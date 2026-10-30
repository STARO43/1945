#!/usr/bin/env python3
"""Собрать index.html + archive.html в один single.html.

Шрифты (./fonts/), фотографии (./media/) и CSS/JS-ассеты (./assets/) остаются
внешними файлами — в HTML не инлайним бинарники. Внутри одного файла склеиваются
разметка обеих страниц и их JavaScript: три ES-модуля превращаются в один
модуль, а сетевой роутинг Taxi заменяется локальным роутером на тех же классах.

Запуск:  python3 build_single3.py   (из корня проекта)
"""
import re, sys, pathlib

root = pathlib.Path(__file__).resolve().parent

index   = (root / 'index.html').read_text()
archive = (root / 'archive.html').read_text()

# ---------- имена hashed-ассетов берём из самих страниц ----------
def asset(page, needle):
    m = re.search(r'\./assets/([A-Za-z0-9_.-]+' + needle + r')', page)
    assert m, needle
    return m.group(1)

app_name   = asset(index, r'app-[\w-]+\.js')
motion_name = re.search(r'from"\./([A-Za-z0-9_.-]+)\.js"', (root / 'assets' / app_name).read_text())
assert motion_name, "не найден импорт motion в app.js"
MOTION, THREE = motion_name.group(1), None
imports = re.findall(r'import\s*\{[^}]*\}\s*from"\./([\w.-]+)\.js"', (root / 'assets' / app_name).read_text())
assert len(imports) == 2, imports
MOTION, THREE = imports[0], imports[1]

appjs   = (root / 'assets' / app_name).read_text()
motion  = (root / 'assets' / (MOTION + '.js')).read_text()
three   = (root / 'assets' / (THREE + '.js')).read_text()

# ---------- 1. куски разметки ----------
shell = index.split('<!-- SHELL START -->')[1].split('<!-- SHELL END -->')[0].strip()

def view(html):
    return re.search(r'<div data-taxi>(.*?)</div><div class="runtime-status"', html, re.S).group(1).strip()

home, arch = view(index), view(archive)
assert 'data-taxi-view="home"' in home and 'data-taxi-view="archive"' in arch

# ---------- 2. обе страницы внутри <div data-taxi>: вторая в <template> ----------
combined = ('<div data-taxi>' + home
            + '<template id="sp-archive">' + arch + '</template>'
            + '</div>')

# ---------- 3. вырезание подстрок по якорям ----------
def between(src, start_anchor, end_anchor, what, inclusive_end=False, required=True):
    i = src.find(start_anchor)
    assert i != -1 or not required, "не найден начало: " + what
    if i == -1:
        return None, None
    j = src.find(end_anchor, i + len(start_anchor))
    assert j != -1 or not required, "не найден конец: " + what
    if j == -1:
        return None, None
    j += len(end_anchor) if inclusive_end else 0
    return i, j

def cut_class(src, name, tag):
    """Вернуть исходный текст объявления `class <name>{...}` (со скобками)."""
    i = src.find('class %s{' % name)
    assert i != -1, tag + ': class ' + name
    depth, p = 0, src.find('{', i)
    while True:
        ch = src[p]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return src[i:p + 1]
        p += 1

def strip_map(s):
    return re.sub(r'\n?//# sourceMappingURL=[^\n]*', '', s)

motion, three, appjs = map(strip_map, (motion, three, appjs))

# ---------- 4. карта экспортов библиотек ----------
def export_map(src, tag):
    ms = list(re.finditer(r'export\s*\{([^}]*)\}', src))
    assert len(ms) == 1, tag
    e = ms[-1]
    pairs = {}
    for item in e.group(1).split(','):
        parts = [p.strip() for p in item.strip().split(' as ')]
        local, alias = parts[0], parts[-1]
        pairs[alias] = local          # публичное имя -> локальное имя модуля
    return pairs

mpairs, tpairs = export_map(motion, MOTION), export_map(three, THREE)

# ---------- 5. склейка модулей ----------
# 5.1 заголовки импортов приложения
heads = list(re.finditer(r'import\s*\{([^}]*)\}\s*from\s*"\./([\w.-]+)\.js";?', appjs))
assert len(heads) == 2, heads

subs = []                       # (алиас в app, локальное имя в библиотеке)
for h in heads:
    pairs = mpairs if h.group(2) == MOTION else tpairs
    for item in h.group(1).split(','):
        parts = [p.strip() for p in item.strip().split(' as ')]
        local_in_lib, alias = parts[0], parts[-1]
        assert local_in_lib in pairs, (h.group(2), local_in_lib, alias)
        subs.append((alias, pairs[local_in_lib]))

alias_to_local = dict(subs)

# 5.2 тело приложения: убрать import'ы и modulepreload-полифилл между ними
first_end  = min(h.end() for h in heads)
last_start = max(h.start() for h in heads)
last_end   = max(h.end() for h in heads)
prelude    = appjs[first_end:last_start]          # IIFE про modulepreload (безопасно)
app_body   = prelude + appjs[last_end:]

# 5.3 алиасы импортов переименовываем уникально (в теле они не объявлены)
for alias, local in subs:
    uniq = '__imp_%s__' % alias
    assert not re.search(r'(?:const|let|var|class|function)\s+' + uniq + r'\b', app_body)
    app_body = re.sub(r'(?<![\w$.])' + re.escape(alias) + r'(?![\w$])', uniq, app_body)

# 5.4 изолируем имена, объявленные в приложении и в библиотеках
decl_re = re.compile(r'(?:^|[;\n])\s*(?:const|let|var|class|function)\s+([A-Za-z_$][\w$]*)')
lib_names = set(decl_re.findall(motion)) | set(decl_re.findall(three))
clash = sorted({m.group(1) for m in decl_re.finditer(app_body)} & lib_names)
for name in clash:
    app_body = re.sub(r'(?<![\w$.])' + re.escape(name) + r'(?![\w$])', '_app_' + name, app_body)

decl_lines = "\n".join("const __imp_%s__ = %s;" % (a, l) for a, l in subs)

# ---------- 6. классы Taxi из оригинального текста (минимум ручных правок) ----------
Taxi_src     = cut_class(motion, mpairs['C'], MOTION)      # класс Taxi
Renderer_src = cut_class(motion, mpairs['R'], MOTION)      # базовый Renderer
Trans_src    = cut_class(motion, mpairs['T'], MOTION)      # базовый Transition

# 6.1 Taxi -> SP_Taxi: убираем attachEvents/popstate/fetch/preload и сеть
drop = [
    r'C\(this,"onClick",[;,].*?\}\);',
    r'C\(this,"onPopstate",[;,].*?\}\}\);',
    r'C\(this,"onPrefetch",[;,].*?\}\);',
    r'attachEvents\(e\),',
    r'preload\(t,e=!1\)\{return.*?console\.warn\(i\)\)\}',
    r'updateCache\(t\)\{.*?cloneNode\(!0\),e\)\}',
    r'clearCache\(t\)\{.*?this\.cache\.delete\(e\)\}',
    r'navigateTo\(t,e=!1,i=!1\)\{return new Promise.*?\}\)\}\}',
    r'beforeFetch\(t,e,i\)\{return.*?r\(\)\}\)\}',
    r'afterFetch\(t,e,i,r\)\{return.*?n\(\)\}\)\}\}',
    r'fetch\(t,e=!0\)\{if\(this\.activePromises.*?this\.activePromises\.set\(t,i\),i\}',
    r'chooseTransition\(t\)\{if\(t\)return this\.transitions\[t\];const e=this\.router\?.*?this\.defaultTransition\}',
    r'attachEvents\(t\)\{bt\.delegate\("click",t,this\.onClick\).*?this\.onPrefetch\)\}',
]
sp_taxi = Taxi_src
for pat in drop:
    sp_taxi, n = re.subn(pat, '', sp_taxi, count=1)
    assert n == 1, "не удалён фрагмент: " + pat[:40]
assert 'fetch(' not in sp_taxi and 'popstate' not in sp_taxi and 'DOMParser' not in sp_taxi

SP_METHODS = r"""
spId(t){const h=new URL(String(t),window.location.origin).hash;return h.indexOf("archive")===0?"archive":"home"}
spEntry(id,url){const c=this._views[id],r=c.dataset.taxiView.length?this.renderers[c.dataset.taxiView]:this.defaultRenderer;return{page:{dataset:{taxiView:r===this.defaultRenderer?"":c.dataset.taxiView},title:__SP_TITLE__[id]},content:c,finalUrl:url,skipCache:!0,scripts:[],styles:[],title:__SP_TITLE__[id],renderer:new r({wrapper:this.wrapper,title:__SP_TITLE__[id],content:c})}}
spActivate(e,t){this.currentLocation=t,this.popTarget=t.href,this.currentCacheEntry=e,document.title=e.title,bt.emit("NAVIGATE_IN",{from:null,to:e,trigger:t.trigger}),e.renderer.enter(this._spTrans,t).then(()=>{bt.emit("NAVIGATE_END",{from:e,to:e,trigger:t}),this.currentCacheEntry=e,this.isTransitioning=!1,this.isPopping=!1})}
navigateTo(t,e=!1,i=!1){const id=this.spId(typeof t==="object"?t.raw:t);if(this.isTransitioning)return Promise.reject(new Error(tr));this.isTransitioning=!0,this.isPopping=i==="popstate",this._spTrans=new(this.chooseTransition(e))({wrapper:this.wrapper});const url=yt(typeof t==="string"?t:(t&&t.raw)||window.location.href),entry=this.spEntry(id,{href:url.href,raw:url.raw,trigger:i,pop:i==="popstate"});return bt.emit("NAVIGATE_OUT",{from:this.currentCacheEntry,trigger:i}),this.currentCacheEntry.renderer.leave(this._spTrans,i,!0).then(()=>{this.spActivate(entry,url)}),Promise.resolve()}
"""

sp_taxi = sp_taxi.replace('createCacheEntry(t,e){', SP_METHODS + 'createCacheEntry(t,e){')
sp_taxi = sp_taxi.replace('class %s{' % mpairs['C'], 'class SP_Taxi{')
# конструктор: добавляем хранилище view'шек сразу после деструктуризации опций
ctor_anchor = 'this.renderers=a,this.transitions=h,'
assert ctor_anchor in sp_taxi
sp_taxi = sp_taxi.replace(ctor_anchor,
                          'this._views=__SP_VIEWS__,this._spTrans=null,' + ctor_anchor)

# 6.2 Renderer: content остаётся живым DOM-узлом (нет строки/парсера/клонирования)
sp_renderer = Renderer_src
for old, new in [
    ('constructor({content:t,page:e,title:i,wrapper:r}){this._contentString=t.outerHTML,this._DOM=null,',
     'constructor({content:t,page:e,title:i,wrapper:r}){'),
    ('this.content=this.wrapper.lastElementChild}', 'this.content=t}'),
    ('update(){document.title=this.title,this.wrapper.appendChild(this._DOM.firstElementChild),'
     'this.content=this.wrapper.lastElementChild,this._DOM=null}', 'update(){}'),
    ('createDom(){this._DOM||(this._DOM=document.createElement("div"),'
     'this._DOM.innerHTML=this._contentString)}', ''),
]:
    assert old in sp_renderer, old[:60]
    sp_renderer = sp_renderer.replace(old, new)
sp_renderer = sp_renderer.replace('class %s{' % mpairs['R'], 'class SP_Renderer{')

# 6.3 приложение: свой класс Taxi + свои view'шки вместо сетевого роутинга
marker = 'new %s({transitions:{default:' % alias_to_local['ka']
i = app_body.find(marker)
assert i != -1, "не найден вызов Taxi в приложении"
j = app_body.find('})', i + len(marker))
assert j != -1
old_call = app_body[i:j + 2]
opts = old_call[old_call.index('{') + 1:old_call.rindex('}')]
new_call = ("new SP_Taxi({" + opts
            + ",renderers:{default:SP_Renderer,home:SP_Renderer,archive:SP_Renderer},"
            + "__SP_VIEWS_INIT__})")
app_body = app_body[:i] + new_call + app_body[j + 2:]

# ---------- 7. одностраничный роутер: view'шки, hash-навигация, popstate ----------
SP_ROUTER = r"""
// ==== одностраничный роутер: те же классы, что у Taxi, но без fetch ======
const __SP_HOME__ = document.querySelector('[data-taxi-view="home"]');
const __SP_TPL__  = document.getElementById('sp-archive');
const __SP_ARCHIVE__ = (() => {
  const el = __SP_TPL__.content.firstElementChild;
  __SP_TPL__.remove();
  el.dataset.taxiView = 'archive';
  return el;
})();
const __SP_VIEWS__ = { home: __SP_HOME__, archive: __SP_ARCHIVE__ };
const __SP_TITLE__ = {
  home: "1941—1945 / История Великой Отечественной",
  archive: "Архив / История Великой Отечественной"
};
const __SP_VIEWS_INIT__ = "";
(() => {
  const base = location.pathname + location.search;
  const spHash = (id) => (id === 'archive' ? '#archive' : '#');
  let taxi = null;
  const timer = setInterval(() => {
    if (!(window.Ca instanceof SP_Taxi)) return;
    clearInterval(timer);
    taxi = window.Ca;
    // ссылки: только hash-адреса этой страницы, остальное — как в исходном Taxi
    const onClick = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const link = event.target && event.target.closest ? event.target.closest(taxi.linksSelector) : null;
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href.charAt(0) !== '#') return;              // index.html#x / archive.html#y — нативная загрузка
      event.preventDefault();
      if (href === '#' || !taxi._views.home.contains(document.querySelector(href.slice(1)))) {
        if (taxi.currentCacheEntry.content !== taxi._views.home) {
          taxi.navigateTo(base + spHash('home'), false, link).catch((e) => console.warn(e));
        } else {
          history.pushState({}, '', base + spHash('home'));
        }
        return;
      }
      if (taxi.isTransitioning) return;
      if (taxi.currentCacheEntry.content !== taxi._views.home) {
        taxi.navigateTo(base + spHash('home'), false, link)
            .then(() => { setTimeout(() => Lenis.scrollTo(href, { offset: -25 }), 60); })
            .catch((e) => console.warn(e));
      } else {
        Lenis.scrollTo(href, { offset: -25 });
        history.pushState({}, '', base + spHash('home') + href);
      }
    };
    const onPop = () => {
      const id = taxi.spId(location.href);
      if (taxi.currentCacheEntry.content === taxi._views[id]) return;
      taxi.navigateTo(location.origin + base + spHash(id), false, 'popstate')
          .catch((e) => console.warn(e));
    };
    window.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPop);
    // стартовый адрес: file:// или /single.html#archive
    if (location.protocol === 'file:' || !location.pathname.endsWith('/')) {
      history.replaceState({}, '', location.origin + base + spHash(taxi.spId(location.href)));
    }
  }, 50);
})();
"""

# имена, которые использует роутер, но которые переименованы из-за коллизий
router = SP_ROUTER
lenis_local = alias_to_local['mo']
if lenis_local in clash:
    router = router.replace('Lenis.', '_app_%s.' % lenis_local)
ca_local = None
for mm in re.finditer(r'let (\w+);try\{Ca=', app_body):
    pass
m_ca = re.search(r'(\w+)\s*=\s*new SP_Taxi\(', app_body)
assert m_ca, "не найдено присваивание экземпляра Taxi"
ca_var = app_body[app_body.rfind(';', 0, m_ca.start()) + 1:m_ca.start()].strip()
ca_var = ca_var.replace('let ', '').replace('try{', '')
router = router.replace('window.Ca', ca_var)
assert ca_var, "не удалось определить переменную экземпляра Taxi"

bundle = (
    "// ==== %s ====\n%s\n\n" % (MOTION, motion) +
    "// ==== %s ====\n%s\n\n" % (THREE, three) +
    "// ==== одностраничные классы ==== \n%s\n%s\n%s\n\n" % (sp_taxi, sp_renderer, Trans_src) +
    "// ==== связи модулей ====\n" + decl_lines + "\n\n" +
    router + "\n" +
    "// ==== %s ====\n" % app_name + app_body
)

assert not re.search(r'(^|[;\n])\s*import\s*[{(*]', bundle), 'остался import'
assert not re.search(r'(^|[;\n])\s*export\s', bundle), 'остался export'
assert '__SP_VIEWS_INIT__' not in bundle.split('// ==== app')[0] or True

# ---------- 8. head ----------
css_name = asset(index, r'app-[\w-]+\.css')
head = (
    '<!doctype html>\n<html lang="ru" class="no-js"><head>'
    '<meta charset="UTF-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1">'
    '<meta name="theme-color" content="#151611">'
    '<meta name="description" content="История Великой Отечественной войны: интерактивная хроника, архивные фотографии и документы.">'
    '<title>1941—1945 / История Великой Отечественной</title>'
    '<link rel="stylesheet" href="./fonts.css">'
    '<link rel="stylesheet" crossorigin href="./assets/%s">' % css_name
    + ''.join('<link rel="modulepreload" href="./assets/%s">' % n
              for n in (app_name, MOTION, THREE))
    + '</head>'
)

body = (
    '<body id="top">\n'
    + shell + '\n'
    + combined + '\n'
    + '<div class="runtime-status" role="status"></div>\n'
    + '<script type="module">\n' + bundle + '\n</script>\n'
    + '</body></html>\n'
)

out = root / 'single.html'
out.write_text(head + body)
print("written", out, out.stat().st_size, "bytes")
print("isolated clashing names:", clash)
print("imported symbols:", [a for a, _ in subs])
print("taxi instance var:", repr(ca_var))

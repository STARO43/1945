#!/usr/bin/env python3
"""Собрать index.html + archive.html в один single.html.

Шрифты (./fonts/), фотографии (./media/) и CSS/JS-ассеты (./assets/) остаются
внешними файлами — в HTML не инлайним бинарники. Внутри одного файла склеиваются
разметка обеих страниц и их JavaScript: три ES-модуля превращаются в один модуль,
а сетевой роутинг Taxi заменяется локальным роутером на исходных классах Taxi
(переопределены только navigateTo / chooseTransition / attachEvents).

Запуск:  python3 build_single.py [имя_выходного_файла]
"""
import re, sys, pathlib

root = pathlib.Path(__file__).resolve().parent
out_name = sys.argv[1] if len(sys.argv) > 1 else 'single.html'

index   = (root / 'index.html').read_text()
archive = (root / 'archive.html').read_text()

# ---------- имена asssetов берём из самих страниц ----------
def asset(page, needle):
    m = re.search(r'(?:\./)?assets/([A-Za-z0-9_.-]*' + needle + r')', page)
    assert m, "не найден ассет: " + needle
    return m.group(1)

app_name = asset(index, r'app-[A-Za-z0-9_-]+\.js')
css_name = asset(index, r'app-[A-Za-z0-9_-]+\.css')
appjs    = (root / 'assets' / app_name).read_text()

imports = re.findall(r'import\s*\{[^}]*\}\s*from"\.?/?([\w.-]+)\.js"', appjs)
assert len(imports) == 2, imports
MOTION, THREE = imports[0], imports[1]
motion = strip = (root / 'assets' / (MOTION + '.js')).read_text()
three  = (root / 'assets' / (THREE + '.js')).read_text()

# ---------- 1. разметка: shell + обе view ----------
shell = index.split('<!-- SHELL START -->')[1].split('<!-- SHELL END -->')[0].strip()

def view(html):
    m = re.search(r'<div data-taxi>(.*?)</div><div class="runtime-status"', html, re.S)
    assert m, "не найдена view"
    return m.group(1).strip()

home, arch = view(index), view(archive)
assert 'data-taxi-view="home"' in home and 'data-taxi-view="archive"' in arch

combined = ('<div data-taxi>' + home
            + '<template id="sp-archive">' + arch + '</template>'
            + '</div>')

# ---------- 2. утилиты ----------
def strip_map(s):
    return re.sub(r'\n?//# sourceMappingURL=[^\n]*', '', s)

motion, three, appjs = map(strip_map, (motion, three, appjs))

def cut_class(src, name, tag):
    """Исходный текст объявления `class <name>{...}` вместе с фигурными скобками."""
    i = src.find('class %s{' % name)
    assert i != -1, "%s: не найден class %s" % (tag, name)
    depth, p = 0, src.index('{', i)
    while True:
        ch = src[p]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0:
                return src[i:p + 1]
        p += 1

def export_map(src, tag):
    ms = list(re.finditer(r'export\s*\{([^}]*)\}', src))
    assert len(ms) == 1, tag
    pairs = {}
    for item in ms[-1].group(1).split(','):
        parts = [p.strip() for p in item.strip().split(' as ')]
        local, alias = parts[0], parts[-1]
        pairs[alias] = local           # публичное имя -> локальное имя модуля
    return pairs

mpairs, tpairs = export_map(motion, MOTION), export_map(three, THREE)

# ---------- 3. склейка модулей ----------
heads = list(re.finditer(r'import\s*\{([^}]*)\}\s*from\s*"\.?/?([\w.-]+)\.js";?', appjs))
assert len(heads) == 2, heads

subs = []                              # (алиас в приложении, локальное имя в библиотеке)
for h in heads:
    pairs = mpairs if h.group(2) == MOTION else tpairs
    for item in h.group(1).split(','):
        parts = [p.strip() for p in item.strip().split(' as ')]
        local_in_lib, alias = parts[0], parts[-1]
        assert local_in_lib in pairs, (h.group(2), local_in_lib, alias)
        subs.append((alias, pairs[local_in_lib]))
alias_to_local = dict(subs)

first_end = min(h.end() for h in heads)
last_start = max(h.start() for h in heads)
last_end = max(h.end() for h in heads)
prelude = appjs[first_end:last_start]      # modulepreload-полифилл (безопасен, file:// обёрнут в try)
app_body = prelude + appjs[last_end:]

for alias, local in subs:
    uniq = '__imp_%s__' % alias
    assert not re.search(r'(?:const|let|var|class|function)\s+' + uniq + r'\b', app_body)
    app_body = re.sub(r'(?<![\w$.])' + re.escape(alias) + r'(?![\w$])', uniq, app_body)

decl_re = re.compile(r'(?:^|[;\n])\s*(?:const|let|var|class|function)\s+([A-Za-z_$][\w$]*)')
lib_names = set(decl_re.findall(motion)) | set(decl_re.findall(three))
clash = sorted({m.group(1) for m in decl_re.finditer(app_body)} & lib_names)
for name in clash:
    app_body = re.sub(r'(?<![\w$.])' + re.escape(name) + r'(?![\w$])', '_app_' + name, app_body)

decl_lines = "\n".join("const __imp_%s__ = %s;" % (a, l) for a, l in subs)

# ---------- 4. одностраничный Taxi: подмешиваем методы в исходный класс ----------
TAXI_LOCAL = mpairs['C']          # класс Taxi
TRANS_LOCAL = mpairs['T']         # базовый Transition
taxi_src = cut_class(motion, TAXI_LOCAL, MOTION)

SP_METHODS = r"""
spId(t){const h=String(t);return h.indexOf("archive")>=0?"archive":"home"}
spHash(id){return id==="archive"?("./"+__SP_FILE__+".html#archive"):("./"+__SP_FILE__+".html")}
spUrl(id){const d=location.href.split("/").slice(0,-1).join("/")+"/";return d+__SP_FILE__+this.spHash(id)}
spEntry(id,url){const c=this._views[id];return{page:{dataset:{taxiView:id},title:__SP_TITLE__[id]},content:c,finalUrl:url,skipCache:!0,scripts:[],styles:[],title:__SP_TITLE__[id],renderer:new this.defaultRenderer({wrapper:this.wrapper,title:__SP_TITLE__[id],content:c,page:{dataset:{taxiView:id}}})}}
chooseTransition(t){if(t)return this.transitions[t];const e=this.router&&this.router.findMatch(this.currentLocation,this.targetLocation);return e?this.transitions[e]:this.defaultTransition}
navigateTo(t,e=!1,i=!1){const id=this.spId(typeof t==="object"?t.raw:t);if(!this.allowInterruption&&this.isTransitioning)return Promise.reject(new Error(tr));const target=this._views[id];if(!target)return Promise.reject(new Error("Unknown view: "+id));const url=this.spUrl(id);if(this.currentCacheEntry&&this.currentCacheEntry.content===target){i!=="popstate"&&window.history.replaceState({},"",url);return Promise.resolve()}this.isTransitioning=!0,this.isPopping=i==="popstate",this.targetLocation=yt(url),this.popTarget=i==="popstate"?window.location.href:url;const entry=this.spEntry(id,url);entry.renderer.createDom();const trans=new(this.chooseTransition(e))({wrapper:this.wrapper});return bt.emit("NAVIGATE_OUT",{from:this.currentCacheEntry,trigger:i}),new Promise(r=>{this.currentCacheEntry.renderer.leave(trans,i,this.removeOldContent).then(()=>{i!=="popstate"&&window.history.pushState({},"",url),this.currentLocation=yt(url),this.popTarget=this.currentLocation.href,this.currentCacheEntry=entry,document.title=entry.title,bt.emit("NAVIGATE_IN",{from:null,to:entry,trigger:i}),entry.renderer.enter(trans,i).then(()=>{bt.emit("NAVIGATE_END",{from:entry,to:entry,trigger:i}),this.isTransitioning=!1,this.isPopping=!1,r()})})})}
attachEvents(){this.linksSelector=this.linksSelector||this.links;const handler=(event)=>{if(event.metaKey||event.ctrlKey||event.altKey||event.shiftKey)return;const link=event.target&&event.target.closest?event.target.closest(this.linksSelector):null;if(!link)return;const href=link.getAttribute("href")||"";if(href.charAt(0)!=="#")return;event.preventDefault();const el=href.length>1?document.getElementById(href.slice(1)):null;if(el&&this._views.home.contains(el)){if(this.isTransitioning)return;const go=()=>{this._lenis().scrollTo(href,{offset:-25});window.history.pushState({},"",this.spUrl("home")+href)};if(this.currentCacheEntry.content!==this._views.home)this.navigateTo(this.spUrl("home"),false,link).then(()=>setTimeout(go,60)).catch(err=>console.warn(err));else go();return}if(this.currentCacheEntry.content===this._views.home){window.history.pushState({},"",this.spUrl("home"));return}this.navigateTo(this.spUrl("home"),false,link).catch(err=>console.warn(err))};document.addEventListener("click",handler,true);window.addEventListener("popstate",()=>{const id=this.spId(location.hash.indexOf("archive")===0?"archive":location.hash);if(this.currentCacheEntry.content===this._views[id])return;this.navigateTo(this.spUrl(id),false,"popstate").catch(err=>console.warn(err))});window.__SP_TAXI__=this}
_lenis(){return window.__SP_LENIS__||{scrollTo:(t,o)=>{const el=typeof t==="string"?document.getElementById(t.slice(1)):t;if(el)el.scrollIntoView(o&&o.immediate?{behavior:"instant"}:{behavior:"smooth"})}}}
"""

taxi_sp = taxi_src.replace('createCacheEntry(t,e){', SP_METHODS + 'createCacheEntry(t,e){')
taxi_sp = taxi_sp.replace('class %s{' % TAXI_LOCAL, 'class SinglePageTaxi{')

# конструктор: регистрируем живые view'шки вместо клона документа
ctor_old = 'this.cache.set(this.currentLocation.href,this.createCacheEntry(document.cloneNode(!0),window.location.href)),this.currentCacheEntry=this.cache.get(this.currentLocation.href),this.currentCacheEntry.renderer.initialLoad()'
assert ctor_old in taxi_sp, "не найден хвост конструктора Taxi"
ctor_new = ('this._views=__SP_VIEWS__;{const u=this.spUrl(this.spId(location.hash));'
            'const e=this.spEntry(this.spId(location.hash),u);this.cache.set(u,e);'
            'this.currentCacheEntry=e;e.renderer.initialLoad()}')
taxi_sp = taxi_sp.replace(ctor_old, ctor_new)

# Renderer: content может быть живым DOM-узлом, а не строкой
renderer_src = cut_class(motion, mpairs['R'], MOTION)
for old, new in [
    ('constructor({content:t,page:e,title:i,wrapper:r}){this._contentString=t.outerHTML,this._DOM=null,',
     'constructor({content:t,page:e,title:i,wrapper:r}){this._live=t.nodeType===1,'),
    ('this.content=this.wrapper.lastElementChild}', 'this.content=this._live?t:this.wrapper.lastElementChild}'),
    ('update(){document.title=this.title,this.wrapper.appendChild(this._DOM.firstElementChild),'
     'this.content=this.wrapper.lastElementChild,this._DOM=null}',
     'update(){document.title=this.title,this._live||(this.wrapper.appendChild(this._DOM.firstElementChild),'
     'this.content=this.wrapper.lastElementChild,this._DOM=null)}'),
    ('createDom(){this._DOM||(this._DOM=document.createElement("div"),'
     'this._DOM.innerHTML=this._contentString)}',
     'createDom(){this._live||this._DOM||(this._DOM=document.createElement("div"),'
     'this._DOM.innerHTML=this._contentString)}'),
]:
    assert old in renderer_src, "renderer: " + old[:50]
    renderer_src = renderer_src.replace(old, new)
renderer_src = renderer_src.replace('class %s{' % mpairs['R'], 'class SinglePageRenderer{')

# приложение: наш класс Taxi + наш рендерер (искажаем по локальному имени класса в исходном appjs)
# в app_body импортированные алиасы заменены на __imp_<alias>__ — ищем сразу там
body_marker = 'new __imp_ka__({transitions:{default:'
k = app_body.find(body_marker)
assert k != -1, "не найден вызов Taxi в app_body"
m = app_body.find('})', k + len(body_marker))
assert m != -1
body_old = app_body[k:m + 2]
new_opts = re.sub(r'(?<![\w$.])__imp_mn__(?![\w$])', 'SinglePageRenderer',
                  body_old[len(body_marker):])
new_opts = new_opts[:new_opts.rindex('})')]
app_body = app_body[:k] + ('new SinglePageTaxi({transitions:{default:' + new_opts + '})') + app_body[m + 2:]

# переменная экземпляра Taxi: в appjs это `let Ca;try{Ca=new ka({...})}catch...`
m_ca = re.search(r'(?:let|const|var)\s+(\w+)\s*;\s*try\{\1\s*=\s*new ka\(', appjs)
assert m_ca, "не найдено объявление экземпляра Taxi"
ca_decl = m_ca.group(1)
hook = ',window.__SP_TAXI_INSTANCE__=%s' % ca_decl

# вставляем хук сразу после закрывающей `})` вызова конструктора (в app_body уже SinglePageTaxi)
kb = app_body.find('new SinglePageTaxi({transitions:{default:')
assert kb != -1
mb = app_body.find('})', kb)
assert mb != -1
app_body = app_body[:mb + 2] + hook + app_body[mb + 2:]

# Lenis-экземпляр приложения — для плавной hash-навигации
m_lenis = re.search(r'(?:let|const|var)\s+(\w+)\s*=\s*new __imp_mo__\(', app_body)
if m_lenis:
    app_body = (app_body[:m_lenis.end()]
                + ',window.__SP_LENIS__=%s' % m_lenis.group(1)
                + app_body[m_lenis.end():])

# ---------- 5. шаблонные куски рантайма ----------
SP_RUNTIME = r"""
// ==== одностраничный роутер: живой DOM вместо fetch ====
window.__SP_FILE__ = location.pathname.split('/').pop() || 'single.html';
const __SP_HOME__ = document.querySelector('[data-taxi-view="home"]');
const __SP_TPL__  = document.getElementById('sp-archive');
const __SP_ARCHIVE__ = (() => {
  const el = __SP_TPL__.content.firstElementChild;
  __SP_TPL__.remove();
  el.dataset.taxiView = 'archive';
  return el;
})();
const __SP_VIEWS__  = { home: __SP_HOME__, archive: __SP_ARCHIVE__ };
const __SP_TITLE__  = {
  home: "@TITLE_HOME@",
  archive: "@TITLE_ARCHIVE@"
};
(() => {
  // file:// не даёт history/pushState — оставляем нативные переходы по ссылкам
  if (location.protocol === 'file:') {
    __SP_TPL__ && __SP_TPL__.remove();
    document.querySelectorAll('a[href^="./"], a[href^="index.html"], a[href^="archive.html"]').forEach(a => {
      a.setAttribute('data-taxi-ignore', '');
    });
    const here = location.pathname.split('/').pop() || 'single.html';
    document.querySelectorAll('a[href]').forEach(a => {
      let h = a.getAttribute('href');
      if (/^(?:\.\/)?index\.html/.test(h)) a.setAttribute('href', here + h.replace(/^(?:\.\/)?index\.html/, ''));
      else if (/^(?:\.\/)?archive\.html/.test(h)) a.setAttribute('href', here + (h.indexOf('#') >= 0 ? '#archive' : '#archive'));
    });
    return;
  }
  const wantArchive = () => location.pathname.indexOf('archive') >= 0 || location.hash.indexOf('archive') === 0;
  const toArchive = () => {
    const t = window.__SP_TAXI_INSTANCE__;
    if (!t) return setTimeout(toArchive, 60);
    if (wantArchive()) t.navigateTo('#archive', false, false).catch(e => console.warn(e));
  };
  toArchive();
})();
"""

titles = {}
for name, html in (('home', index), ('archive', archive)):
    m = re.search(r'<title>(.*?)</title>', html, re.S)
    titles[name] = m.group(1).strip().replace('"', "'")
sp_runtime = SP_RUNTIME.replace('@TITLE_HOME@', titles['home']).replace('@TITLE_ARCHIVE@', titles['archive'])

bundle = (
    "// ==== %s.js ====\n%s\n\n" % (MOTION, motion) +
    "// ==== %s.js ====\n%s\n\n" % (THREE, three) +
    "// ==== одностраничные классы (см. build_single.py) ====\n%s\n%s\n\n" % (taxi_sp, renderer_src) +
    "// ==== связи модулей ====\n%s\n\n" % decl_lines +
    sp_runtime + "\n" +
    "// ==== %s ====\n" % app_name + app_body
)

assert not re.search(r'(^|[;\n])\s*import\s*[{(*]', bundle), 'остался import'
assert not re.search(r'(^|[;\n])\s*export\s', bundle), 'остался export'
assert 'SinglePageTaxi' in bundle and '__SP_VIEWS__' in bundle

# ---------- 6. сборка HTML ----------
head = (
    '<!doctype html>\n<html lang="ru" class="no-js"><head>'
    + '<meta charset="UTF-8">'
    + '<meta name="viewport" content="width=device-width,initial-scale=1">'
    + '<meta name="theme-color" content="#151611">'
    + '<meta name="description" content="История Великой Отечественной войны: интерактивная хроника, архивные фотографии и документы.">'
    + '<title>%s</title>' % titles['home']
    + '<link rel="stylesheet" href="./fonts.css">'
    + '<link rel="stylesheet" crossorigin href="./assets/' + css_name + '">'
    # modulepreload не нужен: JS теперь инлайн-модуль в этом же файле
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

out = root / out_name
out.write_text(head + body)
print("written:", out, out.stat().st_size, "bytes")
print("modules merged:", MOTION, THREE, app_name)
print("isolated clashing names:", clash)
print("taxi instance var:", ca_decl, "| lenis var:", m_lenis.group(1) if m_lenis else None)

#!/usr/bin/env python3
"""Собрать index.html + archive.html в один single.html.

Шрифты, фотографии и CSS/JS остаются внешними файлами (./fonts/, ./media/,
./assets/) — в HTML не инлайним бинарники, только саму разметку обеих страниц
и их JavaScript.
"""
import re, pathlib

root = pathlib.Path('/workspace')
index   = (root/'index.html').read_text()
archive = (root/'archive.html').read_text()
appjs   = (root/'assets/app-2TymPK_d.js').read_text()
motion  = (root/'assets/motion-DbqpPqFl.js').read_text()
three   = (root/'assets/three-D-44EYEX.js').read_text()

# ---------- 1. куски разметки ----------
shell = index.split('<!-- SHELL START -->')[1].split('<!-- SHELL END -->')[0].strip()

def view(html):
    return re.search(r'<div data-taxi>(.*?)</div><div class="runtime-status"', html, re.S).group(1).strip()

home, arch = view(index), view(archive)
assert 'data-taxi-view="home"' in home and 'data-taxi-view="archive"' in arch

# ---------- 2. пути: файл лежит в корне, ссылки без "./" ----------
def rel(frag):
    return frag.replace('./index.html', 'index.html').replace('./archive.html', 'archive.html')

shell, home, arch = map(rel, (shell, home, arch))

# ---------- 3. обе страницы внутри <div data-taxi> ----------
# Taxi удаляет старую view при переходе, но содержимое берёт из кэша (клон
# документа), поэтому вторая страница возвращается на место целиком.
combined = (
    '<div data-taxi>'
    + home
    + '<template id="view-archive">' + arch + '</template>'
    + '</div>'
)

# ---------- 4. склейка ES-модулей в один модуль ----------
def strip_map(src):
    return re.sub(r'\n?//# sourceMappingURL=[^\n]*', '', src)

motion, three, appjs = map(strip_map, (motion, three, appjs))

def cut_export(src, tag):
    """Убрать `export{...}`, вернуть (код, {публичное_имя: локальное_имя})."""
    ms = list(re.finditer(r'export\s*\{([^}]*)\}', src))
    assert len(ms) == 1, tag
    e = ms[-1]
    pairs = {}
    for item in e.group(1).split(','):
        parts = [p.strip() for p in item.strip().split(' as ')]
        pairs[parts[-1]] = parts[0]          # alias -> local
    return src[:e.start()] + src[e.end():], pairs

motion_body, mpairs = cut_export(motion, 'motion')
three_body,  tpairs = cut_export(three,  'three')

# имена, объявленные в библиотеках (top-level) — чтобы не задеть их заменой
decl_re = re.compile(r'(?:^|[;{}\n])\s*(?:const|let|var|class|function)\s+([A-Za-z_$][\w$]*)')
lib_names = set(decl_re.findall(motion_body)) | set(decl_re.findall(three_body))

# заголовки импорта приложения
heads = list(re.finditer(r'import\s*\{([^}]*)\}\s*from\s*"\./([\w.-]+)\.js";?', appjs))
assert len(heads) == 2, heads
subs, consumed_end = [], 0
for h in heads:
    pairs = mpairs if h.group(2).startswith('motion') else tpairs
    for item in h.group(1).split(','):
        parts = [p.strip() for p in item.strip().split(' as ')]
        # `X as Y` -> локальное имя в модуле X, импортируется как Y
        local_in_lib, alias = parts[0], parts[-1]
        assert local_in_lib in pairs, (h.group(2), local_in_lib, alias)
        subs.append((alias, pairs[local_in_lib]))
    consumed_end = max(consumed_end, h.end())

# тело приложения: вырезаем import'ы и modulepreload-polifill между ними
first_import_end = heads[0].end()
last_head = max(heads, key=lambda h: h.end())
prelude = appjs[first_import_end:last_head.start()]     # IIFE про modulepreload
app_body = prelude + appjs[last_head.end():]

# алиасы импортов нигде не объявлены в теле — переименовываем их уникально
for alias, local in subs:
    uniq = '__imp_%s__' % alias
    assert not re.search(r'(?:^|[;{}\n])\s*(?:const|let|var|class|function)\s+' + uniq + r'\b', app_body)
    app_body = re.sub(r'(?<![\w$.])' + re.escape(alias) + r'(?![\w$])', uniq, app_body)

# имена из библиотек, которые application body использует как свои — изолируем
clash = sorted({m.group(1) for m in decl_re.finditer(app_body)} & lib_names)
for name in clash:
    app_body = re.sub(r'(?<![\w$.])' + re.escape(name) + r'(?![\w$])', '_app_' + name, app_body)

decl_lines = "\n".join("const __imp_%s__ = %s;" % (a, l) for a, l in subs)

# ---------- 5. роутер вместо сетевых запросов Taxi ----------
SP_ROUTER = r"""
// ==== одностраничный роутер: тот же API, что у Taxi, но без fetch ====
const __SP_HOME__ = document.querySelector('[data-taxi-view="home"]');
const __SP_TPL__  = document.getElementById('view-archive');
const __SP_ARCHIVE__ = (() => {
  if (!__SP_TPL__) return null;
  const el = __SP_TPL__.content.firstElementChild;
  __SP_TPL__.remove();
  return el;
})();
const __SP_TITLE__ = {
  home: "1941—1945 / История Великой Отечественной",
  archive: "Архив / История Великой Отечественной"
};
class __SinglePageTaxi__ extends Ea {
  constructor(opts = {}) {
    super(opts);
    this.linksSelector = opts.links || this.links;
    this._views = { home: __SP_HOME__, archive: __SP_ARCHIVE__ };
    this._onClickSp = (event) => {
      const link = event.target && event.target.closest ? event.target.closest(this.linksSelector) : null;
      if (!link) return;
      const href = link.getAttribute('href') || '';
      let id = null;
      if (/^(?:\.\/)?(?:index\.html)?#archive/.test(href) || /^#archive/.test(href)) id = 'archive';
      else if (/^(?:\.\/)?(?:index\.html)?#/.test(href) || /^#/.test(href)) id = 'home';
      if (!id || !this._views[id]) return;
      event.preventDefault();
      this.spGo(id, link);
    };
    document.body.addEventListener('click', this._onClickSp, true);
    // перезапись внутренностей Taxi под нашу схему
    this.attachEvents = () => {};
    this.preload = () => Promise.resolve();
    this.navigateTo = (target, transitionName, trigger) => {
      const hash = String(target).split('#')[1] || '';
      const id = hash.indexOf('archive') === 0 ? 'archive' : 'home';
      return this.spGo(id, trigger === 'popstate' ? false : trigger, true);
    };
  }
  spHash(id) { return id === 'archive' ? '#archive' : ''; }
  spGo(id, trigger, fromPop) {
    const entry = this.cache.get(this.currentLocation.href);
    if (!entry) return Promise.resolve();
    const target = this._views[id];
    if (!target || (this.currentCacheEntry && this.currentCacheEntry.content === target)) {
      if (!fromPop) history.replaceState({}, '', location.pathname + location.search + this.spHash(id));
      return Promise.resolve();
    }
    if (this.isTransitioning) return Promise.reject(new Error(tr));
    this.isTransitioning = true;
    const transition = new this.chooseTransition(false)({ wrapper: this.wrapper });
    const url = location.origin + location.pathname + location.search + this.spHash(id);
    const leave = () => {
      this.currentCacheEntry.renderer.leave(transition, trigger, false).then(() => {
        this.currentCacheEntry.content.dataset.taxiView = this.currentCacheEntry.page.dataset.taxiView;
        enter();
      });
    };
    const enter = () => {
      const fakeDoc = { title: __SP_TITLE__[id], querySelectorAll: () => [] };
      const fakeEntry = this.createCacheEntry(fakeDoc, url);
      fakeEntry.content = target;
      fakeEntry.skipCache = true;
      fakeEntry.scripts = [];
      fakeEntry.styles = [];
      fakeEntry.renderer.content = target;
      this.cache.set(url, fakeEntry);
      this.currentLocation = yt(url);
      this.popTarget = this.currentLocation.href;
      this.currentCacheEntry = fakeEntry;
      document.title = __SP_TITLE__[id];
      if (!fromPop) history.pushState({}, '', url);
      fakeEntry.renderer.update = () => {};
      fakeEntry.renderer.enter(transition, trigger).then(() => {
        if (trigger !== 'popstate' && typeof this.onEnterCompleted === 'function') this.onEnterCompleted();
        bt.emit('NAVIGATE_IN', { from: null, to: fakeEntry, trigger });
        this.isTransitioning = false;
        this.isPopping = false;
      });
    };
    bt.emit('NAVIGATE_OUT', { from: this.currentCacheEntry, trigger });
    leave();
    return Promise.resolve();
  }
}
"""

taxi_marker = "new ka({transitions:{default:Bl}"
i = app_body.find(taxi_marker)
assert i != -1, "не найден вызов Taxi"
j = app_body.find("})", i + len(taxi_marker))
assert j != -1
old_call = app_body[i:j + 2]
app_body = app_body[:i] + old_call.replace("new ka(", "new __SinglePageTaxi__(") + app_body[j + 2:]

bundle = (
    "// ==== motion-DbqpPqFl.js (gsap + lenis + taxi) ====\n" + motion_body + "\n\n"
    "// ==== three-D-44EYEX.js (scrolltrigger + splits + textplugin) ====\n" + three_body + "\n\n"
    "// ==== связи модулей ====\n" + decl_lines + "\n\n"
    + SP_ROUTER + "\n"
    "// ==== app-2TymPK_d.js ====\n" + app_body
)

assert not re.search(r'(^|[;\n])\s*import\s*[{(*]', bundle), 'остался import'
assert not re.search(r'(^|[;\n])\s*export\s', bundle), 'остался export'
for name in clash:
    assert not re.search(r'(?<![\w$.])' + re.escape('_app_' + name) + r'\b\s*=', bundle.split('// ==== app')[0]), name

# ---------- 6. head ----------
head = (
    '<!doctype html>\n<html lang="ru" class="no-js"><head>'
    '<meta charset="UTF-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1">'
    '<meta name="theme-color" content="#151611">'
    '<meta name="description" content="История Великой Отечественной войны: интерактивная хроника, архивные фотографии и документы.">'
    '<title>1941—1945 / История Великой Отечественной</title>'
    '<link rel="stylesheet" href="./fonts.css">'
    '<link rel="stylesheet" crossorigin href="./assets/app-BDa_oCwP.css">'
    '</head>'
)

body = (
    '<body id="top">\n'
    + shell + '\n'
    + combined + '\n'
    + '<div class="runtime-status" role="status"></div>\n'
    + '<script type="module">\n' + bundle + '\n</script>\n'
    + '</body></html>\n'
)

out = root/'single.html'
out.write_text(head + body)
print("written", out, out.stat().st_size, "bytes")
print("clashed names isolated in app:", clash)
print("imported symbols:", [a for a, _ in subs])

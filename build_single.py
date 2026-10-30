#!/usr/bin/env python3
"""Собрать весь проект (index.html + archive.html + CSS/JS/шрифты/фото) в один файл single.html."""
import re, base64, pathlib

root = pathlib.Path('/workspace')

index   = (root/'index.html').read_text()
archive = (root/'archive.html').read_text()
appjs   = (root/'assets/app-2TymPK_d.js').read_text()
motion  = (root/'assets/motion-DbqpPqFl.js').read_text()
three   = (root/'assets/three-D-44EYEX.js').read_text()
appcss  = (root/'assets/app-BDa_oCwP.css').read_text()
fontcss = (root/'fonts.css').read_text()

# ---------- 0. data URI для шрифтов и фото ----------
def data_uri(path: pathlib.Path, mime: str) -> str:
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()

FONTS = {}
for p in sorted((root/'fonts').iterdir()):
    FONTS[p.name] = data_uri(p, 'font/ttf')

MEDIA = {}
for p in sorted((root/'media').iterdir()):
    MEDIA[p.name] = data_uri(p, 'image/jpeg')

print("fonts:", len(FONTS), "media:", len(MEDIA))

# ---------- 1. единый CSS ----------
css = appcss + "\n" + fontcss
css = re.sub(r"url\(\./fonts/([\w.-]+)\)", lambda m: "url(" + FONTS[m.group(1)] + ")", css)
assert './fonts/' not in css

# ---------- 2. shell (общая часть страниц) ----------
shell = index.split('<!-- SHELL START -->')[1].split('<!-- SHELL END -->')[0].strip()

def view(html):
    return re.search(r'<div data-taxi>(.*?)</div><div class="runtime-status"', html, re.S).group(1).strip()

home = view(index)
arch = view(archive)
assert 'data-taxi-view="home"' in home and 'data-taxi-view="archive"' in arch

# ---------- 3. ссылки -> якоря одной страницы ----------
def rewrite_links(frag):
    frag = frag.replace('href="./index.html" data-route-label="АРХИВ"', 'href="#archive" data-route-label="АРХИВ"')
    frag = frag.replace('href="./index.html" data-route-label="ХРОНИКА"', 'href="#top" data-route-label="ХРОНИКА"')
    frag = re.sub(r'href="\./index\.html#([a-z-]+)"', r'href="#\1"', frag)
    frag = frag.replace('href="./index.html"', 'href="#top"')
    frag = re.sub(r'href="\./archive\.html#([a-z-]+)"', r'href="#archive-\1"', frag)
    frag = frag.replace('href="./archive.html"', 'href="#archive"')
    return frag

shell, home, arch = map(rewrite_links, (shell, home, arch))

# ---------- 4. медиа во вьюшках -> data URI ----------
def inline_media(frag):
    frag = frag.replace('./media/', 'media/')
    frag = re.sub(r'(url\(["\']?)media/([\w.-]+)(["\']?\))',
                  lambda m: m.group(1) + MEDIA[m.group(2)] + m.group(3), frag)
    frag = re.sub(r'(<img\s[^>]*?)src="media/([\w.-]+)"',
                  lambda m: m.group(1) + 'src="' + MEDIA[m.group(2)] + '"', frag)
    return frag

home, arch = map(inline_media, (home, arch))
assert 'media/' not in re.sub(r'data:[^"\')\s]+', '', home + arch)

# ---------- 5. склейка ES-модулей в один модуль ----------
def strip_map(src):
    return re.sub(r'\n?//# sourceMappingURL=[^\n]*', '', src)

motion = strip_map(motion)
three  = strip_map(three)
appjs  = strip_map(appjs)

def cut_export(src, name):
    """Убрать `export{...}` из библиотеки, вернуть (код, {алиас: локальное_имя})."""
    ms = list(re.finditer(r'export\s*\{([^}]*)\}', src))
    assert len(ms) == 1, name
    e = ms[-1]
    pairs = {}
    for item in e.group(1).split(','):
        parts = item.strip().split(' as ')
        local = parts[0].strip()
        alias = parts[-1].strip()
        pairs[alias] = local
    out = src[:e.start()] + src[e.end():]
    return out, pairs

motion_body, mpairs = cut_export(motion, 'motion')
three_body, tpairs  = cut_export(three, 'three')

# заголовки импорта приложения
heads = list(re.finditer(r'import\s*\{([^}]*)\}\s*from\s*"\./([\w.-]+)\.js";?', appjs))
assert len(heads) == 2
subs = []  # [(alias, local_lib_name)]
consumed_end = 0
for h in heads:
    lib = h.group(2)
    pairs = mpairs if lib.startswith('motion') else tpairs
    for item in h.group(1).split(','):
        parts = [p.strip() for p in item.split(' as ')]
        orig, alias = parts[0], parts[-1]
        assert alias in pairs, (lib, alias)
        subs.append((alias, pairs[alias]))
    consumed_end = max(consumed_end, h.end())
app_body = appjs[consumed_end:]

# замена алиасов на уникальные имена в теле приложения
for alias, lib_local in subs:
    uniq = '__imp_' + alias + '_' + lib_local + '__'
    app_body = re.sub(r'(?<![\w$.])' + re.escape(alias) + r'(?![\w$])', uniq, app_body)
    globals()[uniq] = None  # placeholder, не используется

decl_lines = "\n".join(
    f"const __imp_{alias}_{local}__ = {local};" for alias, local in subs
)

# --- замена конструктора Taxi на одностраничный роутер (без запросов к серверу) ---
taxi_marker = "new __imp_ka_Hs__({transitions:"
i = app_body.find(taxi_marker)
assert i != -1, "не найден вызов Taxi"
j = app_body.find("})", i + len(taxi_marker))
assert j != -1
app_body = (
    app_body[:i]
    + "__imp_ka_Hs__=__SinglePageTaxi__;(function(){const t={transitions:{default:Bl},renderers:{default:__imp_mn_Ys__,home:__imp_mn_Ys__,archive:__imp_mn_Ys__},reloadJsFilter:!1,reloadCssFilter:!1,removeOldContent:!0,links:'a:not([target]):not([href^=\"#\"]):not([data-taxi-ignore])'};"
    + app_body[i + len("new __imp_ka_Hs__(") : j + 2]
    + app_body[j + 2:]
)

taxi_shim = r"""
// ==== одностраничный роутер вместо Taxi.js (весь контент уже в документе) ====
const __SP_HOME__ = document.querySelector('[data-taxi-view="home"]');
const __SP_TPL__  = document.getElementById('view-archive');
let __SP_ARCHIVE__ = null;
if (__SP_TPL__) {
  __SP_ARCHIVE__ = __SP_TPL__.content.firstElementChild;
  __SP_TPL__.remove();
}
class __SinglePageTaxi__ {
  constructor(opts) {
    this.transitions = opts.transitions;
    this.renderers = opts.renderers;
    this.links = opts.links;
    this.current = __SP_HOME__;
    this._onClick = (e) => {
      const a = e.target && e.target.closest ? e.target.closest(this.links) : null;
      if (!a) return;
      let href = a.getAttribute('href') || '';
      if (href.indexOf('#top') === 0) { e.preventDefault(); this.go('home', a); }
      else if (href.indexOf('#archive') === 0) { e.preventDefault(); this.go('archive', a); }
    };
    document.body.addEventListener('click', this._onClick);
  }
  go(id, trigger) {
    if (this.busy || this.current.dataset.taxiView === id) {
      if (id === 'home' && location.hash !== '' && !location.hash.startsWith('#archive')) {
        history.replaceState(null, '', location.pathname);
      }
      if (id === 'archive' && !location.hash.startsWith('#archive')) {
        history.replaceState(null, '', '#archive');
      }
      return;
    }
    const from = this.current;
    const to = id === 'archive' ? __SP_ARCHIVE__ : __SP_HOME__;
    if (!to) return;
    this.busy = true;
    const tr = new this.transitions.default({}, {});
    const done = () => {
      if (id === 'archive') { from.after(to); } else { to.append(from); }
      this.current = to;
      if (id === 'archive') {
        if (!location.hash.startsWith('#archive')) history.replaceState(null, '', '#archive');
      } else if (location.hash.startsWith('#archive')) {
        history.replaceState(null, '', location.pathname);
      }
      tr.onEnter({ to, done: () => { this.busy = false; }, initial: false });
    };
    tr.onLeave({ from, done, trigger });
  }
  destroy() { document.body.removeEventListener('click', this._onClick); }
}
"""

bundle = (
    "// ==== motion-DbqpPqFl.js ====\n" + motion_body + "\n\n"
    "// ==== three-D-44EYEX.js ====\n"  + three_body  + "\n\n"
    "// ==== связи модулей ====\n" + decl_lines + "\n\n"
    + taxi_shim + "\n"
    "// ==== app-2TymPK_d.js ====\n" + app_body
)

# проверка: не осталось ли import/export
assert not re.search(r'(^|[;\n])\s*import\s*[{(*]', bundle), 'остался import'
assert not re.search(r'(^|[;\n])\s*export\s', bundle), 'остался export'

# ---------- 6. фото в JS-данных (/media/*.jpg) ----------
bundle = bundle.replace('/media/', 'media/')
bundle = re.sub(r'"media/([\w.-]+)"', lambda m: '"' + MEDIA[m.group(1)] + '"', bundle)
assert 'media/' not in bundle

# ---------- 7. сборка single.html ----------
head = (
    '<!doctype html>\n<html lang="ru" class="no-js"><head>'
    '<meta charset="UTF-8">'
    '<meta name="viewport" content="width=device-width,initial-scale=1">'
    '<meta name="theme-color" content="#151611">'
    '<meta name="description" content="История Великой Отечественной войны: интерактивная хроника, архивные фотографии и документы.">'
    '<title>1941—1945 / История Великой Отечественной</title>'
    '<style>' + css + '</style>'
    '</head>'
)

body = f'''<body id="top">
{shell}
<div data-taxi>
{home}
<template id="view-archive">{arch}</template>
</div>
<div class="runtime-status" role="status"></div>
<script type="module">
{bundle}
</script>
</body></html>
'''

out = root/'single.html'
out.write_text(head + body)
print("written", out, out.stat().st_size, "bytes")

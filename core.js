/* =========================================================
   core.js —— i18n 引擎 / 主题 / WebGL 背景 / giscus / 标题
   ========================================================= */

function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

const i18n = window.SITE_DATA.i18n;

const LANG_META = {
  'zh':    { html: 'zh-CN', giscus: 'zh-CN', label: '中文' },
  'zh-TW': { html: 'zh-TW', giscus: 'zh-TW', label: '繁體中文' },
  'en':    { html: 'en',    giscus: 'en',    label: 'English' },
  'ja':    { html: 'ja',    giscus: 'ja',    label: '日本語' },
  'ko':    { html: 'ko',    giscus: 'ko',    label: '한국어' },
  'fr':    { html: 'fr',    giscus: 'fr',    label: 'Français' }
};
const LANGS = Object.keys(LANG_META).map(code => ({ code, label: LANG_META[code].label }));

const THEME_PREFS = [
  { code: 'auto',  key: 'theme_auto' },
  { code: 'dark',  key: 'theme_dark' },
  { code: 'light', key: 'theme_light' }
];

/* ---- 全局状态 ---- */
var idx = 0;
let storedLang = safeGet('site_lang');
let currentLang = (storedLang && i18n[storedLang]) ? storedLang : 'zh';

const THEME_MEDIA = window.matchMedia('(prefers-color-scheme: dark)');
let systemIsDark = THEME_MEDIA.matches;
let storedTheme = safeGet('site_theme');
let themePreference = (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'auto')
  ? storedTheme : 'dark';

/* ---- 文案获取 ---- */
function t(key) {
  const dict = i18n[currentLang] || i18n.zh;
  return (dict && dict[key]) || (i18n.zh && i18n.zh[key]) || key;
}
function tx(val) {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') return val[currentLang] || val['en'] || val['zh'] || '';
  return String(val);
}

/* ---- 标题 ---- */
const PAGE_TITLE_KEYS = ['nav_home', 'nav_guestbook', 'title_vote', 'nav_about', 'nav_arcade', 'nav_tools', 'nav_links', 'nav_secret'];
function updateDocumentTitle() {
  const safeIdx = (typeof idx === 'number' && idx >= 0 && idx < PAGE_TITLE_KEYS.length) ? idx : 0;
  document.title = `curious-guoguo | ${t(PAGE_TITLE_KEYS[safeIdx] || 'nav_home')}`;
}

/* ---- 按钮构建 ---- */
function buildLangButtonsHTML() {
  return LANGS.map(l => `<button type="button" data-lang="${l.code}" aria-pressed="false">${l.label}</button>`).join('');
}
function buildThemeButtonsHTML() {
  return THEME_PREFS.map(p =>
    `<button type="button" data-theme="${p.code}" aria-pressed="false" data-i18n="${p.key}">${t(p.key)}</button>`
  ).join('');
}
function updateLangButtons(lang) {
  document.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.lang === lang ? 'true' : 'false');
  });
}
function updateThemeButtons(pref) {
  document.querySelectorAll('button[data-theme]').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.theme === pref ? 'true' : 'false');
  });
}

/* ---- 语言：只更新文本（不含节日重渲染） ---- */
function applyLanguageText(lang) {
  if (!i18n[lang]) lang = 'zh';
  currentLang = lang;
  safeSet('site_lang', lang);
  document.documentElement.lang = LANG_META[lang] ? LANG_META[lang].html : 'zh-CN';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.getAttribute('data-i18n-html'));
  });
  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    el.alt = t(el.getAttribute('data-i18n-alt'));
  });

  const trap = document.getElementById('trapCard');
  if (trap) trap.setAttribute('aria-label', t('trap_hint'));
  const moreBtn = document.getElementById('mobileMoreBtn');
  if (moreBtn) moreBtn.setAttribute('aria-label', t('nav_more'));
  const settingsMenu = document.getElementById('settingsMenu');
  if (settingsMenu) settingsMenu.setAttribute('aria-label', t('settings_label'));

  if (typeof window.renderCards === 'function') window.renderCards();

  updateLangButtons(lang);
  updateDocumentTitle();
  syncGiscusLang();

  document.documentElement.classList.remove('lang-pending');
}

/* ---- 主题 ---- */
function resolveTheme(pref) {
  if (pref === 'light') return 'light';
  if (pref === 'dark') return 'dark';
  return systemIsDark ? 'dark' : 'light';
}
function applyTheme(pref) {
  if (pref !== 'auto' && pref !== 'light' && pref !== 'dark') pref = 'dark';
  themePreference = pref;
  safeSet('site_theme', pref);
  const resolved = resolveTheme(pref);

  if (resolved === 'light') document.documentElement.dataset.theme = 'light';
  else document.documentElement.removeAttribute('data-theme');

  if (typeof window.setBgTheme === 'function') window.setBgTheme(resolved === 'light');

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'light' ? '#e9edf5' : '#05070d');

  updateThemeButtons(pref);
  syncGiscusTheme(resolved);
}
const onSystemThemeChange = (e) => {
  systemIsDark = e.matches;
  if (themePreference === 'auto') applyTheme('auto');
};
if (THEME_MEDIA.addEventListener) THEME_MEDIA.addEventListener('change', onSystemThemeChange);
else if (THEME_MEDIA.addListener) THEME_MEDIA.addListener(onSystemThemeChange);

/* ---- giscus ---- */
let lastGiscusLang = null;
function syncGiscusLang() {
  const lang = LANG_META[currentLang] ? LANG_META[currentLang].giscus : 'zh-CN';
  if (lang === lastGiscusLang) return;
  try {
    const frame = document.querySelector('iframe.giscus-frame');
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage({ giscus: { setConfig: { lang } } }, 'https://giscus.app');
      lastGiscusLang = lang;
    }
  } catch (e) {}
}
function syncGiscusTheme(theme) {
  try {
    const frame = document.querySelector('iframe.giscus-frame');
    if (frame && frame.contentWindow) {
      frame.contentWindow.postMessage(
        { giscus: { setConfig: { theme: theme === 'light' ? 'light' : 'dark' } } },
        'https://giscus.app'
      );
    }
  } catch (e) {}
}
window.addEventListener('message', (e) => {
  if (e.origin === 'https://giscus.app' && e.data && e.data.giscus) syncGiscusLang();
});

function mountGiscus() {
  const mount = document.querySelector('.giscus');
  if (!mount || mount.querySelector('script')) return;
  const lang = LANG_META[currentLang] ? LANG_META[currentLang].giscus : 'zh-CN';
  const script = document.createElement('script');
  script.src = 'https://giscus.app/client.js';
  script.async = true;
  script.crossOrigin = 'anonymous';
  const attrs = {
    'data-repo': 'curious-guoguo/curious-guoguo.github.io',
    'data-repo-id': 'R_kgDOSc14mw',
    'data-category': 'Announcements',
    'data-category-id': 'DIC_kwDOSc14m84DKhvT',
    'data-mapping': 'pathname',
    'data-strict': '0',
    'data-reactions-enabled': '1',
    'data-emit-metadata': '0',
    'data-input-position': 'bottom',
    'data-theme': document.documentElement.dataset.theme === 'light' ? 'light' : 'dark',
    'data-lang': lang,
    'data-loading': 'lazy'
  };
  Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));

  const obs = new MutationObserver(() => {
    const frame = document.querySelector('iframe.giscus-frame');
    if (frame) {
      obs.disconnect();
      frame.addEventListener('load', () => {
        lastGiscusLang = null;
        syncGiscusLang();
        syncGiscusTheme(resolveTheme(themePreference));
      }, { once: true });
    }
  });
  obs.observe(mount, { childList: true, subtree: true });

  mount.appendChild(script);
}

/* =========================================================
   WebGL 背景
   ========================================================= */
(function initWebGL() {
  window.setBgBrightness = () => {};
  window.setBgTheme = () => {};

  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
  if (!gl) return;

  const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  const precision = hp && hp.precision > 0 ? 'highp' : 'mediump';

  const vsSource = `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `;
  const fsSource = `
    precision ${precision} float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_brightness;
    uniform float u_theme;

    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy) );
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m ; m = m*m ;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    void main() {
        vec2 uv = gl_FragCoord.xy / u_resolution.xy;
        uv.x *= u_resolution.x / u_resolution.y;
        float t = u_time * 0.15;

        vec2 p1 = vec2(0.2 + 0.15 * sin(t), 0.8 + 0.15 * cos(t));
        vec2 p2 = vec2(0.8 + 0.15 * cos(t*0.8), 0.2 + 0.15 * sin(t*0.9));
        vec2 p3 = vec2(0.5 + 0.2 * sin(t*0.7), 0.5 + 0.2 * cos(t*0.6));

        vec3 c1 = vec3(0.17, 0.30, 1.0);
        vec3 c2 = vec3(0.61, 0.30, 0.86);
        vec3 c3 = vec3(0.0, 0.7, 0.84);

        float d1 = length(uv - p1);
        float d2 = length(uv - p2);
        float d3 = length(uv - p3);

        float noise = snoise(uv * 3.0 + t * 2.0) * 0.1;

        vec3 baseDark = vec3(0.02, 0.03, 0.05);
        vec3 baseLight = vec3(0.88, 0.91, 0.97);
        vec3 color = mix(baseDark, baseLight, u_theme);

        float glowAmt = mix(1.0, 0.60, u_theme);
        color += c1 * smoothstep(0.7, 0.0, d1 + noise) * 0.6 * glowAmt;
        color += c2 * smoothstep(0.8, 0.0, d2 - noise) * 0.5 * glowAmt;
        color += c3 * smoothstep(0.6, 0.0, d3 + noise) * 0.4 * glowAmt;

        float vignette = smoothstep(1.2, 0.3, length(uv - vec2(0.5)));
        vignette = mix(vignette, mix(0.88, 1.0, vignette), u_theme);
        color *= vignette;
        color *= u_brightness;

        gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader compile failed:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  let program = null, uTime = null, uRes = null, uBrightness = null, uTheme = null;
  let vbo = null;
  let elapsed = 0, lastTime = 0;
  let targetBrightness = 1.0, currentBrightness = 1.0;

  let targetTheme = 0;
  try {
    const pref = safeGet('site_theme') || 'dark';
    const isDark = pref === 'dark' || (pref === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    targetTheme = isDark ? 0 : 1;
  } catch (e) {}
  let currentTheme = targetTheme;

  let rafId = null;
  let glLost = false;
  let visible = !document.hidden;

  function buildResources() {
    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) { if (vs) gl.deleteShader(vs); if (fs) gl.deleteShader(fs); return false; }
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link failed:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      program = null;
      return false;
    }
    gl.useProgram(program);
    if (vbo) { gl.deleteBuffer(vbo); vbo = null; }
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    const posAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);
    uTime = gl.getUniformLocation(program, 'u_time');
    uRes = gl.getUniformLocation(program, 'u_resolution');
    uBrightness = gl.getUniformLocation(program, 'u_brightness');
    uTheme = gl.getUniformLocation(program, 'u_theme');
    return true;
  }
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  function startLoop() { if (rafId === null) { lastTime = 0; rafId = requestAnimationFrame(render); } }
  function stopLoop() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }
  function render(time) {
    rafId = null;
    if (!visible || glLost || !program) return;
    if (lastTime) elapsed += Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;
    currentBrightness += (targetBrightness - currentBrightness) * 0.05;
    currentTheme += (targetTheme - currentTheme) * 0.05;
    gl.uniform1f(uBrightness, currentBrightness);
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTheme, currentTheme);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    rafId = requestAnimationFrame(render);
  }
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault(); glLost = true; stopLoop();
    program = null; vbo = null; uTime = uRes = uBrightness = uTheme = null;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    program = null; vbo = null; uTime = uRes = uBrightness = uTheme = null;
    if (buildResources()) { resize(); glLost = false; lastTime = 0; startLoop(); }
  });
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  });
  window.setBgBrightness = (val) => { targetBrightness = val; };
  window.setBgTheme = (isLight) => { targetTheme = isLight ? 1 : 0; };
  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (!visible) stopLoop();
    else if (!glLost && program) startLoop();
  });
  window.addEventListener('pagehide', stopLoop);
  window.addEventListener('pageshow', (e) => { if (e.persisted && !glLost && program) startLoop(); });

  if (!buildResources()) return;
  resize();
  startLoop();
})();
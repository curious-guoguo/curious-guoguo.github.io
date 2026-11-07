let idx = 0;
let springs = [];
let isUnlocked = false;


/* =========================================================
   2. 高性能 WebGL 背景
   ========================================================= */
(function initWebGL() {
  window.setBgBrightness = () => {};

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
        vec3 color = vec3(0.02, 0.03, 0.05);

        color += c1 * smoothstep(0.7, 0.0, d1 + noise) * 0.6;
        color += c2 * smoothstep(0.8, 0.0, d2 - noise) * 0.5;
        color += c3 * smoothstep(0.6, 0.0, d3 + noise) * 0.4;

        float vignette = smoothstep(1.2, 0.3, length(uv - vec2(0.5)));
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

  let program = null, uTime = null, uRes = null, uBrightness = null;
  let vbo = null;
  let elapsed = 0;
  let lastTime = 0;
  let targetBrightness = 1.0;
  let currentBrightness = 1.0;
  let rafId = null;
  let glLost = false;
  let visible = !document.hidden;

  function buildResources() {
    const vs = compile(gl.VERTEX_SHADER, vsSource);
    const fs = compile(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return false;
    }
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
    return true;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function startLoop() {
    if (rafId === null) {
      lastTime = 0;
      rafId = requestAnimationFrame(render);
    }
  }

  function stopLoop() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function render(time) {
    rafId = null;
    if (!visible || glLost || !program) return;

    if (lastTime) elapsed += Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    currentBrightness += (targetBrightness - currentBrightness) * 0.05;
    gl.uniform1f(uBrightness, currentBrightness);
    gl.uniform1f(uTime, elapsed);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    rafId = requestAnimationFrame(render);
  }

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    glLost = true;
    stopLoop();
    program = null;
    vbo = null;
    uTime = uRes = uBrightness = null;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    program = null;
    vbo = null;
    uTime = uRes = uBrightness = null;
    if (buildResources()) {
      resize();
      glLost = false;
      lastTime = 0;
      startLoop();
    }
  });

  let resizeTimer = null;
  function scheduleResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 100);
  }
  window.addEventListener('resize', scheduleResize);

  window.setBgBrightness = (val) => { targetBrightness = val; };

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    if (!visible) {
      stopLoop();
    } else if (!glLost && program) {
      startLoop();
    }
  });

  window.addEventListener('pagehide', stopLoop);
  window.addEventListener('pageshow', (e) => {
    if (e.persisted && !glLost && program) startLoop();
  });

  if (!buildResources()) return;
  resize();
  startLoop();
})();


/* =========================================================
   3. 基础变量与切页逻辑
   ========================================================= */
const slides = Array.from(document.querySelectorAll('.slide'));
const menuLinks = Array.from(document.querySelectorAll('.sidebar-menu a'));
const drawerLinks = Array.from(document.querySelectorAll('.grid-menu a'));

const mobileMoreBtn = document.getElementById('mobileMoreBtn');
const mobileBottomNav = document.getElementById('mobileBottomNav');
const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');

const shortcutLinks = mobileBottomNav.querySelectorAll('.nav-shortcuts .nav-item[data-slide]');

(function restoreSlideIndex() {
  const saved = parseInt(safeGet('site_slide'), 10);
  if (!Number.isFinite(saved) || saved <= 0 || saved >= slides.length) return;
  slides[idx].classList.remove('active');
  idx = saved;
  slides[idx].classList.add('active');
})();

class Spring {
  constructor(el, delay = 0) {
    this.el = el; this.delay = delay;
    this.y = 34; this.s = 0.92; this.vy = 0; this.vs = 0;
    this.k = 160; this.d = 16; this.ty = 0; this.ts = 1;
    this.running = false; this.timer = null; this.frame = null; this.last = 0;

    el.classList.add('springing');
    el.style.opacity = '0';
    el.style.transform = `translateY(${this.y}px) scale(${this.s})`;
  }
  start() {
    this.timer = setTimeout(() => {
      this.el.style.opacity = '1';
      this.running = true; this.last = performance.now();
      this.frame = requestAnimationFrame(this.tick);
    }, this.delay);
  }
  tick = (now) => {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;
    const ay = (this.ty - this.y) * this.k - this.vy * this.d;
    this.vy += ay * dt; this.y += this.vy * dt;
    const as = (this.ts - this.s) * this.k - this.vs * this.d;
    this.vs += as * dt; this.s += this.vs * dt;
    this.el.style.transform = `translateY(${this.y}px) scale(${this.s})`;
    if (Math.abs(this.y) < .06 && Math.abs(this.vy) < .06 && Math.abs(this.s - 1) < .0006 && Math.abs(this.vs) < .0006) {
      this.finish(); return;
    }
    this.frame = requestAnimationFrame(this.tick);
  };
  finish() { this.reset(); }
  cancel() { this.reset(); }
  reset() {
    this.running = false;
    cancelAnimationFrame(this.frame);
    clearTimeout(this.timer);
    this.el.classList.remove('springing');
    this.el.style.transform = '';
    this.el.style.opacity = '';
  }
}

let prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
if (motionQuery.addEventListener) {
  motionQuery.addEventListener('change', (e) => { prefersReduced = e.matches; });
} else if (motionQuery.addListener) {
  motionQuery.addListener((e) => { prefersReduced = e.matches; });
}

function playSprings(i) {
  springs.forEach(s => s.cancel());
  springs = [];
  const slide = slides[i];
  if (!slide) return;

  const els = Array.from(slide.querySelectorAll('.link-card, .vote-card, .rise'))
    .filter(el => {
      if (el.id === 'card-april_fool') return false;
      if (el.id === 'trapCard') return false;
      return el.offsetParent !== null;
    });

  if (prefersReduced) {
    els.forEach(el => { el.style.opacity = '1'; el.style.transform = ''; });
    return;
  }

  els.forEach((el, k) => {
    const sp = new Spring(el, 50 + k * 38);
    springs.push(sp);
    sp.start();
  });
}

function updateNav() {
  menuLinks.forEach((a, k) => a.classList.toggle('active', k === idx));

  shortcutLinks.forEach(a => {
    const t = parseInt(a.dataset.slide, 10);
    a.classList.toggle('active', t === idx);
  });

  if (idx !== 0 && idx !== 1 && idx !== 4) {
    mobileMoreBtn.classList.add('active');
  } else {
    mobileMoreBtn.classList.remove('active');
  }
}

function updateToastPosition() {
  const el = document.querySelector('.toast');
  if (!el) return;
  const nav = document.getElementById('mobileBottomNav');
  el.classList.toggle('raised', !!(nav && nav.classList.contains('expanded')));
}

function closeMobileDrawer() {
  const wasExpanded = mobileBottomNav.classList.contains('expanded');
  const active = document.activeElement;
  const focusInside = !!(active && active.closest && active.closest('#mobileNavExpanded'));

  mobileBottomNav.classList.remove('expanded');
  mobileDrawerOverlay.classList.remove('show');
  mobileMoreBtn.setAttribute('aria-expanded', 'false');
  const expanded = document.getElementById('mobileNavExpanded');
  if (expanded) expanded.setAttribute('aria-hidden', 'true');

  if (wasExpanded && focusInside) mobileMoreBtn.focus({ preventScroll: true });
  updateToastPosition();
}

function go(target) {
  if (target < 0 || target >= slides.length) return;

  closeMobileDrawer();

  if (target === idx) return;

  springs.forEach(s => s.cancel());
  springs = [];
  slides[idx].classList.remove('active');
  const body = slides[target].querySelector('.slide-body');
  if (body) body.scrollTop = 0;
  idx = target;
  slides[idx].classList.add('active');

  safeSet('site_slide', String(idx));

  updateNav();
  updateDocumentTitle();
  playSprings(idx);

  const langMenu = document.getElementById('langMenu');
  if (langMenu) {
    if (idx === 0) langMenu.classList.add('show');
    else langMenu.classList.remove('show');
  }

  if (target === 1) setTimeout(syncGiscusLang, 500);

  if (target === 6) requestAnimationFrame(startEscapeLoop);
}


/* =========================================================
   4. 音乐与节日逻辑
   ========================================================= */
class AudioSynth {
  constructor() { this.ctx = null; this.currentNodes = []; }
  init() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) {
      this.ctx = null;
    }
  }
  stop() { this.currentNodes.forEach(n => { try { n.stop(); } catch (e) {} }); this.currentNodes = []; }
  playTone(freq, duration, type = 'square', startTime = 0) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    const now = this.ctx.currentTime + startTime;
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + duration);
    this.currentNodes.push(osc);
    osc.onended = () => {
      this.currentNodes = this.currentNodes.filter(n => n !== osc);
    };
  }
  close() {
    if (this.ctx) { try { this.ctx.close(); } catch (e) {} this.ctx = null; }
  }
}
const synth = new AudioSynth();
window.addEventListener('pagehide', () => synth.close());

const NOTES = { 'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88, 'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77 };

function playJingleBells() {
  synth.init(); synth.stop();
  const seq = [['E5', .25], ['E5', .25], ['E5', .5], ['E5', .25], ['E5', .25], ['E5', .5], ['E5', .25], ['G5', .25], ['C5', .5], ['D5', .25], ['E5', 1.0], ['F5', .25], ['F5', .25], ['F5', .25], ['F5', .25], ['F5', .25], ['E5', .25], ['E5', .25], ['E5', .25], ['E5', .25], ['D5', .25], ['D5', .25], ['E5', .25], ['D5', .5], ['G5', .5]];
  let t = 0; for (let [note, dur] of seq) { synth.playTone(NOTES[note], dur, 'square', t); t += dur; }
}
function playSpookySound() { synth.init(); synth.stop(); synth.playTone(150, .5, 'sawtooth', 0); synth.playTone(130, .5, 'sawtooth', .5); synth.playTone(100, 1.0, 'sawtooth', 1.0); }
function playHappySound() { synth.init(); synth.stop(); synth.playTone(NOTES['C5'], .15, 'sine', 0); synth.playTone(NOTES['E5'], .15, 'sine', .15); synth.playTone(NOTES['G5'], .3, 'sine', .3); }
function playFireworkSound() { synth.init(); synth.stop(); synth.playTone(800, .2, 'triangle', 0); synth.playTone(600, .3, 'triangle', .2); }

function getEasterDate(year) {
  const f = Math.floor, G = year % 19, C = f(year / 100), H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30;
  const I = H - f(H / 28) * (1 - f(29 / (H + 1)) * f((21 - G) / 11)), J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7;
  const L = I - J, month = 3 + f((L + 40) / 44), day = L + 28 - 31 * f(month / 4);
  return new Date(year, month - 1, day);
}

const FESTIVALS = [
  { id: 'new_year', name: 'f_new_year', desc: 'd_new_year', check: (d) => d.getMonth() === 0 && d.getDate() === 1, emojis: ['🎆', '🎇', '🥂', '✨'], action: () => { playFireworkSound(); window.setBgBrightness(1.8); } },
  { id: 'april_fool', name: 'f_april_fool', desc: 'd_april_fool', check: (d) => d.getMonth() === 3 && d.getDate() === 1, isEscape: true, emojis: [], action: () => {} },
  { id: 'easter', name: 'f_easter', desc: 'd_easter', check: (d) => { const e = getEasterDate(d.getFullYear()); return d.getMonth() === e.getMonth() && d.getDate() === e.getDate(); }, emojis: ['🐰', '🥚', '🌷', '🐣'], bounce: true, action: () => { playHappySound(); window.setBgBrightness(1.2); } },
  { id: 'mother', name: 'f_mother', desc: 'd_mother', check: (d) => { if (d.getMonth() !== 4) return false; const firstDay = new Date(d.getFullYear(), 4, 1).getDay(); const secondSunday = (firstDay === 0) ? 8 : 15 - firstDay; return d.getDate() === secondSunday; }, emojis: ['💖', '🌸', '💐', '💝'], action: () => { playHappySound(); window.setBgBrightness(1.3); } },
  { id: 'father', name: 'f_father', desc: 'd_father', check: (d) => { if (d.getMonth() !== 5) return false; const firstDay = new Date(d.getFullYear(), 5, 1).getDay(); const thirdSunday = (firstDay === 0) ? 15 : 22 - firstDay; return d.getDate() === thirdSunday; }, emojis: ['👔', '🎣', '🎁', '🍺'], action: () => { playHappySound(); window.setBgBrightness(1.2); } },
  { id: 'halloween_eve', name: 'f_halloween_eve', desc: 'd_halloween_eve', check: (d) => d.getMonth() === 9 && d.getDate() === 31, emojis: ['👻', '🎃', '🦇', '🧛'], action: () => { playSpookySound(); window.setBgBrightness(0.4); } },
  { id: 'halloween', name: 'f_halloween', desc: 'd_halloween', check: (d) => d.getMonth() === 10 && d.getDate() === 1, emojis: ['👻', '🎃', '🦇', '🧟'], action: () => { playSpookySound(); window.setBgBrightness(0.4); } },
  { id: 'thanksgiving', name: 'f_thanksgiving', desc: 'd_thanksgiving', check: (d) => { if (d.getMonth() !== 10) return false; const firstDay = new Date(d.getFullYear(), 10, 1).getDay(); const fourthThursday = (firstDay <= 4) ? 22 + (4 - firstDay) : 29 - (firstDay - 4); return d.getDate() === fourthThursday; }, emojis: ['🦃', '🍗', '🥧', '🍂'], action: () => { playHappySound(); window.setBgBrightness(1.2); } },
  { id: 'xmas_eve', name: 'f_xmas_eve', desc: 'd_xmas_eve', check: (d) => d.getMonth() === 11 && d.getDate() === 24, emojis: ['❄️', '🎁', '🎅', '🦌'], action: () => { playJingleBells(); window.setBgBrightness(1.5); } },
  { id: 'xmas', name: 'f_xmas', desc: 'd_xmas', check: (d) => d.getMonth() === 11 && d.getDate() === 25, emojis: ['❄️', '🎄', '🎁', '🎅'], action: () => { playJingleBells(); window.setBgBrightness(1.5); } }
];


/* =========================================================
   5. 其他页彩蛋
   ========================================================= */
const trapCard = document.getElementById('trapCard');
const trapProgress = document.getElementById('trapProgress');
const cardsHolder = document.getElementById('festival-cards-holder');

let pressTimer = null, progressInterval = null, pressStartTime = 0;
let isLongPressed = false;
let activePointerId = null;
let pointerStartX = 0, pointerStartY = 0, pointerMoved = false;

function initHolidays() {
  const today = new Date();
  const activeHolidays = FESTIVALS.filter(f => f.check(today));
  activeHolidays.forEach(f => {
    renderFestivalCard(f);
    if (f.isEscape) {
      const card = document.getElementById(`card-${f.id}`);
      if (card) card.style.display = 'block';
    }
  });
}

let lastHolidayCheckDay = new Date().toDateString();
setInterval(() => {
  const today = new Date().toDateString();
  if (today === lastHolidayCheckDay) return;
  lastHolidayCheckDay = today;
  if (!isUnlocked) {
    cardsHolder.innerHTML = '';
    initHolidays();
  }
}, 60 * 1000);

function renderFestivalCard(f) {
  if (document.getElementById(`card-${f.id}`)) return;

  const card = document.createElement('div');
  card.id = `card-${f.id}`;
  card.className = 'link-card';

  const nameStr = i18n[currentLang][f.name];
  const descStr = i18n[currentLang][f.desc];

  if (f.isEscape) {
    card.style.position = 'fixed';
    card.style.zIndex = '9999';
    card.style.width = '200px';
    card.style.display = 'none';
    card.style.left = '0';
    card.style.top = '0';
    card.style.willChange = 'transform';
    card.style.transform =
      `translate3d(${Math.max(20, window.innerWidth - 240)}px, ${Math.max(20, window.innerHeight - 160)}px, 0)`;
    card.innerHTML = `<div class="link-title" style="color: #c4a0ff;">${nameStr}</div><div class="desc">${descStr}</div>`;
  } else {
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.innerHTML = `<div class="link-title" style="color: #ff9d00;">${nameStr}</div><div class="desc">${descStr}</div>`;
    card.addEventListener('click', () => playFestivalEffect(f));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playFestivalEffect(f);
      }
    });
  }
  cardsHolder.appendChild(card);
}

let brightnessToken = 0;

function playFestivalEffect(f) {
  synth.stop(); window.setBgBrightness(1.0);
  const existingOverlay = document.querySelector('.effect-overlay');
  if (existingOverlay) existingOverlay.remove();
  f.action();
  if (f.emojis.length === 0) return;

  const token = ++brightnessToken;

  const overlay = document.createElement('div');
  overlay.className = 'effect-overlay';
  document.body.appendChild(overlay);
  const animClass = f.bounce ? 'bouncing-emoji' : 'falling-emoji';

  const frag = document.createDocumentFragment();
  const COUNT = 60;
  for (let i = 0; i < COUNT; i++) {
    const span = document.createElement('span');
    span.className = animClass;
    span.textContent = f.emojis[Math.floor(Math.random() * f.emojis.length)];
    if (f.bounce) {
      span.style.left = '-50px';
      span.style.top = '0px';
      span.style.animationDuration = (Math.random() * 1 + 1.5).toFixed(2) + 's';
    } else {
      span.style.left = Math.random() * 100 + 'vw';
      span.style.fontSize = (Math.random() * 2 + 1).toFixed(2) + 'rem';
      span.style.animationDuration = (Math.random() * 2 + 2).toFixed(2) + 's';
    }
    span.style.animationDelay = (i * 0.05).toFixed(2) + 's';
    span.style.animationFillMode = 'forwards';
    frag.appendChild(span);
  }
  overlay.appendChild(frag);

  setTimeout(() => {
    if (!overlay.isConnected) return;
    overlay.style.opacity = '0';
    setTimeout(() => {
      if (!overlay.isConnected) return;
      overlay.remove();
      if (token === brightnessToken) window.setBgBrightness(1.0);
    }, 1000);
  }, 6000);
}

function cancelTrapPress() {
  clearTimeout(pressTimer);
  clearInterval(progressInterval);
  trapProgress.style.width = '0%';
}

function startTrapPress() {
  isLongPressed = false;
  pressStartTime = Date.now();
  trapProgress.style.width = '0%';

  const start = Date.now();
  progressInterval = setInterval(() => {
    const percent = Math.min(((Date.now() - start) / 3000) * 100, 100);
    trapProgress.style.width = percent + '%';
  }, 20);

  pressTimer = setTimeout(() => {
    isLongPressed = true;
    clearInterval(progressInterval);
    trapProgress.style.width = '100%';
    if (!isUnlocked) {
      isUnlocked = true;
      FESTIVALS.forEach(f => {
        renderFestivalCard(f);
        const card = document.getElementById(`card-${f.id}`);
        if (card && card.style.display === 'none') card.style.display = 'block';
      });
      toast(i18n[currentLang].toast_eggs_unlocked);
      playSprings(idx);
    }
    setTimeout(() => { trapProgress.style.width = '0%'; }, 300);
  }, 3000);
}

function endTrapPress() {
  clearTimeout(pressTimer);
  clearInterval(progressInterval);
  if (!isLongPressed) {
    trapProgress.style.width = '0%';
    if (Date.now() - pressStartTime < 3000) triggerRandomEvent();
  }
}

trapCard.addEventListener('pointerdown', (e) => {
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  activePointerId = e.pointerId;
  pointerStartX = e.clientX;
  pointerStartY = e.clientY;
  pointerMoved = false;
  startTrapPress();
});

trapCard.addEventListener('pointermove', (e) => {
  if (e.pointerId !== activePointerId) return;
  if (Math.hypot(e.clientX - pointerStartX, e.clientY - pointerStartY) > 10) {
    pointerMoved = true;
    cancelTrapPress();
  }
});

trapCard.addEventListener('pointerup', (e) => {
  if (e.pointerId !== activePointerId) return;
  activePointerId = null;
  if (pointerMoved) return;
  endTrapPress();
});

trapCard.addEventListener('pointercancel', () => {
  activePointerId = null;
  cancelTrapPress();
});

trapCard.addEventListener('pointerleave', () => {
  if (!isLongPressed) cancelTrapPress();
  activePointerId = null;
});

trapCard.addEventListener('contextmenu', e => e.preventDefault());

trapCard.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
    e.preventDefault();
    startTrapPress();
  }
});
trapCard.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    endTrapPress();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest && e.target.closest('.link-card[role="button"]');
  if (!card || card.id === 'trapCard') return;
  e.preventDefault();
  card.click();
});

document.querySelectorAll('[data-copy]').forEach(el => {
  el.addEventListener('click', () => copyLink(el.dataset.copy));
});

let enteredFullscreen = false;

function triggerRandomEvent() {
  const rickroll = 'https://www.bilibili.com/video/BV1GJ411x7h7';
  const rand = Math.floor(Math.random() * 4);

  const reqFullscreen = () => {
    const el = document.documentElement;
    if (document.fullscreenElement) return;
    let p = null;
    if (el.requestFullscreen) p = el.requestFullscreen();
    else if (el.webkitRequestFullscreen) p = el.webkitRequestFullscreen();
    if (p && p.then) p.then(() => { enteredFullscreen = true; }).catch(() => {});
    else enteredFullscreen = true;
  };

  if (rand === 0) {
    const w = window.open(rickroll, '_blank');
    if (!w) toast(i18n[currentLang].toast_popup_blocked);
  }
  else if (rand === 1 || rand === 2) {
    reqFullscreen();
    showErrorOverlay(rand === 1 ? 'blue' : 'mac');
  }
  else showErrorOverlay('404');
}

function showErrorOverlay(type) {
  if (document.querySelector('.fatal-error-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'fatal-error-overlay';
  let html = '';
  if (type === 'blue') {
    overlay.classList.add('blue-screen');
    html = `<h1>:(</h1><p>${i18n[currentLang].err_blue}</p>`;
  }
  else if (type === 'mac') {
    overlay.classList.add('mac-screen');
    html = `<div class="mac-spinner"></div><p>${i18n[currentLang].err_mac}</p>`;
  }
  else {
    overlay.classList.add('screen-404');
    html = `<h1>404</h1><p>${i18n[currentLang].err_404}</p>`;
  }
  overlay.innerHTML = html;

  let closed = false;
  const closeOverlay = () => {
    if (closed) return;
    closed = true;
    overlay.style.animation = 'none';
    overlay.style.transition = 'opacity .35s ease';
    overlay.style.opacity = '0';
    // 【优化】支持键盘关闭
    document.removeEventListener('keydown', onKey);
    setTimeout(() => {
      overlay.remove();
      if (enteredFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      enteredFullscreen = false;
    }, 360);
  };
  
  // 【优化】按 Esc 或 Enter 关闭报错层
  const onKey = (e) => {
    if (e.key === 'Escape' || e.key === 'Enter') closeOverlay();
  };

  overlay.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', onKey);
  setTimeout(closeOverlay, 8000);

  document.body.appendChild(overlay);
  overlay.tabIndex = 0;
  overlay.focus();
}


/* =========================================================
   6. 愚人节磁铁排斥逃跑
   ========================================================= */
let mouseX = 0, mouseY = 0, currentAngle = Math.PI, isEscaping = false;
let escapeGeneration = 0;

function startEscapeLoop() {
  if (isEscaping) return;
  const eggEscape = document.getElementById('card-april_fool');
  if (!eggEscape || eggEscape.style.display === 'none' || !eggEscape.isConnected) return;
  isEscaping = true;
  const generation = ++escapeGeneration;

  const w = eggEscape.offsetWidth || 200;
  const h = eggEscape.offsetHeight || 90;

  function update() {
    if (generation !== escapeGeneration) return;

    const el = document.getElementById('card-april_fool');
    if (
      !el || el.style.display === 'none' || !el.isConnected ||
      document.hidden || !el.closest('.slide.active')
    ) {
      isEscaping = false;
      return;
    }

    const centerX = window.innerWidth / 2, centerY = window.innerHeight / 2;
    let dx = mouseX - centerX, dy = mouseY - centerY;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) { dx = 1; dy = 0; }

    const mouseAngle = Math.atan2(dy, dx), targetAngle = mouseAngle + Math.PI;
    let deltaAngle = targetAngle - currentAngle;
    while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
    while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

    currentAngle += deltaAngle * 0.08;
    const R = Math.min(window.innerWidth, window.innerHeight) * 0.5;
    const targetCx = mouseX + Math.cos(currentAngle) * R;
    const targetCy = mouseY + Math.sin(currentAngle) * R;

    const margin = 8;
    const left = Math.min(Math.max(targetCx - w / 2, margin), window.innerWidth - w - margin);
    const top = Math.min(Math.max(targetCy - h / 2, margin), window.innerHeight - h - margin);

    el.style.transition = 'none';
    el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    el.style.opacity = '1';

    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// 【优化】简化 restartEscapeLoop 逻辑
function restartEscapeLoop() {
  if (!isEscaping) return;
  isEscaping = false;
  startEscapeLoop();
}

let escapeResizeTimer = null;
window.addEventListener('resize', () => {
  if (!isEscaping) return;
  clearTimeout(escapeResizeTimer);
  escapeResizeTimer = setTimeout(restartEscapeLoop, 150);
});

window.addEventListener('mousemove', (e) => { mouseX = e.clientX; mouseY = e.clientY; startEscapeLoop(); });
window.addEventListener('touchmove', (e) => { if (!e.touches.length) return; mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; startEscapeLoop(); }, { passive: true });


/* =========================================================
   7. 通用事件与初始化
   ========================================================= */
menuLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = parseInt(a.dataset.slide, 10);
    if (!Number.isNaN(t)) go(t);
  });
});

shortcutLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = parseInt(a.dataset.slide, 10);
    if (!Number.isNaN(t)) go(t);
  });
});

drawerLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = parseInt(a.dataset.slide, 10);
    if (!Number.isNaN(t)) go(t);
  });
});

mobileMoreBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileBottomNav.classList.add('expanded');
  mobileDrawerOverlay.classList.add('show');
  mobileMoreBtn.setAttribute('aria-expanded', 'true');
  const expanded = document.getElementById('mobileNavExpanded');
  if (expanded) expanded.setAttribute('aria-hidden', 'false');

  const first = document.querySelector('#mobileNavExpanded a, #mobileNavExpanded button');
  if (first) setTimeout(() => first.focus({ preventScroll: true }), 380);

  updateToastPosition();
});

mobileMoreBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    mobileMoreBtn.click();
  }
});

mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileDrawer();
});


window.copyLink = function (text) {
  const done = () => toast(i18n[currentLang].toast_copied.replace('{url}', text));
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); }
    catch (err) { toast(i18n[currentLang].toast_copy_failed); }
    ta.remove();
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done).catch(fallback);
  else fallback();
};

let toastTimer = null;
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg;
  updateToastPosition();
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

initMobileLangButtons();
initLangMenu();
mountGiscus();

document.documentElement.classList.remove('lang-en-pending');

const langMenuEl = document.getElementById('langMenu');
if (langMenuEl) {
  if (idx === 0) langMenuEl.classList.add('show');
  else langMenuEl.classList.remove('show');
}

updateNav();
updateDocumentTitle();

// 【优化】避免和 applyLanguage 里的 playSprings 重复
if (idx !== 6) {
  playSprings(idx);
}

// 【新增】绑定 Logo 点击回到首页
const siteLogo = document.getElementById('siteLogo');
if (siteLogo) {
  siteLogo.addEventListener('click', (e) => {
    e.preventDefault();
    go(0);
  });
}
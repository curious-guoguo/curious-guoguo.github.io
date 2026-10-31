/* =========================================================
   1. 高性能 WebGL 极光流体背景
   ========================================================= */
(function initWebGL() {
  const canvas = document.getElementById('bg-canvas');
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const vsSource = `
    attribute vec2 position;
    void main() { gl_Position = vec4(position, 0.0, 1.0); }
  `;
  const fsSource = `
    precision highp float;
    uniform float u_time;
    uniform vec2 u_resolution;

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

        gl_FragColor = vec4(color, 1.0);
    }
  `;

  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }

  const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  const positions = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const posAttr = gl.getAttribLocation(program, 'position');
  gl.enableVertexAttribArray(posAttr);
  gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(program, 'u_time');
  const uRes = gl.getUniformLocation(program, 'u_resolution');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  let startTime = performance.now();
  function render(time) {
    gl.uniform1f(uTime, (time - startTime) * 0.001);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();


/* =========================================================
   2. 获取 DOM
   ========================================================= */
const slides = Array.from(document.querySelectorAll('.slide'));
const menuLinks = Array.from(document.querySelectorAll('.sidebar-menu a'));
const mobileLinks = Array.from(document.querySelectorAll('.mobile-menu-list a'));
const deck = document.getElementById('deck');
const tagFloat = document.getElementById('tagFloat');
const tagText = document.getElementById('tagText');

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

const NAV_MAP = [0, 1, 2, 3, 4, 5, 6, 7, -1];

let idx = 0;
let springs = [];

/* =========================================================
   3. 弹簧引擎
   ========================================================= */
class Spring {
  constructor(el, delay = 0) {
    this.el = el;
    this.delay = delay;
    this.y = 34;
    this.s = 0.92;
    this.vy = 0;
    this.vs = 0;
    this.k = 160;
    this.d = 16;
    this.ty = 0;
    this.ts = 1;
    this.running = false;
    this.timer = null;
    this.frame = null;
    this.last = 0;

    el.classList.add('springing');
    el.style.opacity = '0';
    el.style.transform = `translateY(${this.y}px) scale(${this.s})`;
  }

  start() {
    this.timer = setTimeout(() => {
      this.el.style.opacity = '1';
      this.running = true;
      this.last = performance.now();
      this.frame = requestAnimationFrame(this.tick);
    }, this.delay);
  }

  tick = (now) => {
    if (!this.running) return;
    const dt = Math.min((now - this.last) / 1000, 1 / 30);
    this.last = now;

    const ay = (this.ty - this.y) * this.k - this.vy * this.d;
    this.vy += ay * dt;
    this.y += this.vy * dt;

    const as = (this.ts - this.s) * this.k - this.vs * this.d;
    this.vs += as * dt;
    this.s += this.vs * dt;

    this.el.style.transform = `translateY(${this.y}px) scale(${this.s})`;

    if (Math.abs(this.y) < .06 && Math.abs(this.vy) < .06 &&
        Math.abs(this.s - 1) < .0006 && Math.abs(this.vs) < .0006) {
      this.finish();
      return;
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

function playSprings(i) {
  springs.forEach(s => s.cancel());
  springs = [];

  const slide = slides[i];
  if (!slide) return;

  const els = slide.querySelectorAll('.link-card, .vote-card, .rise');
  els.forEach((el, k) => {
    const sp = new Spring(el, 50 + k * 38);
    springs.push(sp);
    sp.start();
  });
}

/* =========================================================
   4. 飞行标签
   ========================================================= */
function slotRect(slot) {
  let x = 0, y = 0, el = slot;
  while (el && el !== document.body) {
    x += el.offsetLeft;
    y += el.offsetTop;
    el = el.offsetParent;
  }
  return { left: x, top: y, width: slot.offsetWidth };
}

function initTag() {
  const slot = slides[idx] && slides[idx].querySelector('.tag-slot');
  if (!slot) return;
  const r = slotRect(slot);

  tagFloat.style.transition = 'none';
  tagFloat.style.transform = `translate(${r.left}px, ${r.top}px)`;
  tagFloat.style.width = r.width + 'px';

  tagText.textContent = slot.dataset.text || '';
  tagText.style.transition = 'none';
  tagText.style.opacity = '1';
  tagText.style.transform = 'translateX(0)';
}

function flyTag() {
  const slot = slides[idx] && slides[idx].querySelector('.tag-slot');
  if (!slot) return;
  const r = slotRect(slot);

  tagText.style.transition = 'opacity .1s ease, transform .14s ease';
  tagText.style.opacity = '0';
  tagText.style.transform = 'translateX(-14px)';

  setTimeout(() => {
    tagText.textContent = slot.dataset.text || '';
    tagText.style.transition = 'none';
    tagText.style.transform = 'translateX(14px)';
    void tagText.offsetWidth;
    tagText.style.transition = 'opacity .22s ease, transform .26s cubic-bezier(.22,1,.36,1)';
    tagText.style.opacity = '1';
    tagText.style.transform = 'translateX(0)';
  }, 110);

  tagFloat.style.transition =
    'transform .92s cubic-bezier(.22,1.2,.36,1), width .92s cubic-bezier(.22,1.2,.36,1)';
  tagFloat.style.transform = `translate(${r.left}px, ${r.top}px)`;
  tagFloat.style.width = r.width + 'px';
}

/* =========================================================
   5. 切页逻辑
   ========================================================= */
function updateNav() {
  const navIdx = NAV_MAP[idx];
  menuLinks.forEach((a, k) => a.classList.toggle('active', k === navIdx));
  mobileLinks.forEach((a, k) => a.classList.toggle('active', k === navIdx));
}

function go(target) {
  if (target < 0 || target >= slides.length || target === idx) return;

  springs.forEach(s => s.cancel());
  springs = [];

  slides[idx].classList.remove('active');
  const body = slides[target].querySelector('.slide-body');
  if (body) body.scrollTop = 0;

  idx = target;
  slides[idx].classList.add('active');

  updateNav();
  playSprings(idx);
  flyTag();
}

/* =========================================================
   6. 事件绑定
   ========================================================= */
menuLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = parseInt(a.dataset.slide, 10);
    if (!Number.isNaN(t)) go(t);
  });
});

if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
if (mobileMenuClose) mobileMenuClose.addEventListener('click', () => mobileMenu.classList.remove('active'));

mobileLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = parseInt(a.dataset.slide, 10);
    if (!Number.isNaN(t)) go(t);
    mobileMenu.classList.remove('active');
  });
});

/* 复制链接 */
window.copyLink = function (text) {
  const done = () => toast('已复制链接：' + text);
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); }
    catch (err) { toast('复制失败，请手动复制'); }
    ta.remove();
  };

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(fallback);
  } else {
    fallback();
  }
};

let toastTimer = null;
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) {
    el = document.createElement('div');
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

/* =========================================================
   7. 初始化
   ========================================================= */
window.addEventListener('load', () => {
  initTag();
  playSprings(idx);
});
window.addEventListener('resize', () => {
  tagFloat.style.transition = 'none';
  initTag();
});

updateNav();
requestAnimationFrame(initTag);
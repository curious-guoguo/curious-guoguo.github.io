/* =========================================================
   获取 DOM
   ========================================================= */
const slides = Array.from(document.querySelectorAll('.slide'));
const menuLinks = Array.from(document.querySelectorAll('.sidebar-menu a'));
const mobileLinks = Array.from(document.querySelectorAll('.mobile-menu-list a'));
const deck = document.getElementById('deck');
const tagFloat = document.getElementById('tagFloat');
const tagText = document.getElementById('tagText');

// 移动端汉堡菜单
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');

const NAV_MAP = [0, 1, 2, 3, 4, 5, 6, 7, -1]; // slide 索引 -> 侧边栏索引

let idx = 0;
let springs = [];

/* =========================================================
   1. 弹簧引擎
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
   2. 飞行标签
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
   3. 切页逻辑
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
   4. 事件绑定
   ========================================================= */
menuLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = parseInt(a.dataset.slide, 10);
    if (!Number.isNaN(t)) go(t);
  });
});

// 移动端菜单事件
if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => mobileMenu.classList.add('active'));
if (mobileMenuClose) mobileMenuClose.addEventListener('click', () => mobileMenu.classList.remove('active'));

mobileLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = parseInt(a.dataset.slide, 10);
    if (!Number.isNaN(t)) go(t);
    mobileMenu.classList.remove('active'); // 点击后自动关闭全屏
  });
});

/* 卡片光斑跟随 */
document.addEventListener('pointermove', e => {
  const card = e.target.closest('.link-card, .vote-card');
  if (!card) return;
  const r = card.getBoundingClientRect();
  card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
  card.style.setProperty('--my', (e.clientY - r.top) + 'px');
}, { passive: true });

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
   5. 初始化
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

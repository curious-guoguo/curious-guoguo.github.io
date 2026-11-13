/* =========================================================
   app.js —— 卡片渲染 / 切页 / 设置 / 节日 / 彩蛋 / 桌游 / toast
   ========================================================= */

let springs = [];
let isUnlocked = false;

const slides = Array.from(document.querySelectorAll('.slide'));
const menuLinks = Array.from(document.querySelectorAll('.sidebar-menu a'));
const drawerLinks = Array.from(document.querySelectorAll('.grid-menu a'));
const mobileMoreBtn = document.getElementById('mobileMoreBtn');
const mobileBottomNav = document.getElementById('mobileBottomNav');
const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
const shortcutLinks = mobileBottomNav
  ? mobileBottomNav.querySelectorAll('.nav-shortcuts .nav-item[data-slide]')
  : [];

/* =========================================================
   投票卡布局
   ========================================================= */
function applyVoteLayout(grid) {
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll('.vote-card'));
  if (!cards.length) return;

  cards.forEach((c, i) => c.classList.toggle('primary', i === 0));

  const imgs = cards.map(c => c.querySelector('img'));
  const loadPromises = imgs.map(img => new Promise(resolve => {
    if (!img) return resolve();
    if (img.complete && img.naturalWidth > 0) return resolve();
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  }));

  Promise.all(loadPromises).then(() => {
    let maxAr = 0;
    let primaryCard = cards[0];
    imgs.forEach((img, i) => {
      if (!img) return;
      const w = img.naturalWidth || 1;
      const h = img.naturalHeight || 1;
      const ar = w / h;
      cards[i].style.setProperty('--img-ar', ar);
      if (ar > maxAr) { maxAr = ar; primaryCard = cards[i]; }
    });
    cards.forEach(c => c.classList.remove('primary'));
    if (primaryCard) primaryCard.classList.add('primary');
  });
}

/* =========================================================
   卡片渲染
   ========================================================= */
function iconHTML(c) {
  if (c.iconType === 'email') {
    return `<svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
  }
  if (!c.icon) return '';
  const fallback = c.iconFallback ? `<span class="card-fallback" aria-hidden="true">${c.iconFallback}</span>` : '';
  const onerr = c.iconFallback ? `onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';"` : '';
  return `<img src="${c.icon}" class="${c.iconClass || 'card-favicon'}" alt="" ${onerr}>${fallback}`;
}
function titleHTML(c) {
  return c.titleKey ? `<span data-i18n="${c.titleKey}">${t(c.titleKey)}</span>` : (c.title ? tx(c.title) : '');
}
function descHTML(c) {
  if (c.descKey) return `<div class="desc" data-i18n="${c.descKey}">${t(c.descKey)}</div>`;
  if (c.desc != null) return `<div class="desc">${tx(c.desc)}</div>`;
  return '';
}

function renderCards() {
  const D = SITE_DATA;
  if (!D || !D.cards) return;

  const voteGrid = document.querySelector('[data-cards="vote"]');
  if (voteGrid && D.cards.vote) {
    voteGrid.innerHTML = D.cards.vote.map((v, i) => `
      <a class="vote-card${i === 0 ? ' primary' : ''}" href="${v.url}">
        <div class="vote-thumb"><img src="${v.img}" alt="${tx(v.name)}" loading="lazy"></div>
        <div class="vote-info">
          <span class="vote-name">${tx(v.name)}</span>
          <span class="vote-btn">${t('vote_btn')}</span>
        </div>
      </a>`).join('');
    applyVoteLayout(voteGrid);
  }

  function renderLinksGroup(sel, list) {
    const el = document.querySelector(sel);
    if (!el || !list) return;
    el.innerHTML = list.map(c => {
      const target = (c.url && c.url.startsWith('mailto:')) ? '' : 'target="_blank" rel="noopener"';
      return `<a class="link-card" href="${c.url || '#'}" ${target}>
        <div class="link-title">${iconHTML(c)}${titleHTML(c)}</div>
        ${descHTML(c)}
      </a>`;
    }).join('');
  }
  renderLinksGroup('[data-cards="about"]', D.cards.about);
  renderLinksGroup('[data-cards="tools"]', D.cards.tools);

  const arcadeEl = document.querySelector('[data-cards="arcade"]');
  if (arcadeEl && D.cards.arcade) {
    arcadeEl.innerHTML = D.cards.arcade.map(c => {
      const inner = `<div class="link-title">${iconHTML(c)}${titleHTML(c)}</div>${descHTML(c)}`;
      if (c.copy) return `<div class="link-card" role="button" tabindex="0" data-copy="${c.copy}">${inner}</div>`;
      if (c.action === 'boardgames') return `<div class="link-card" id="boardGamesCard" role="button" tabindex="0">${inner}</div>`;
      return `<a class="link-card" href="${c.url}" target="_blank" rel="noopener">${inner}</a>`;
    }).join('');
  }

  const linksEl = document.querySelector('[data-cards="links"]');
  if (linksEl && D.cards.links) {
    linksEl.innerHTML = D.cards.links.map(c => {
      if (c.type === 'split') {
        const fallback = c.iconFallback ? `<span class="card-fallback" aria-hidden="true">${c.iconFallback}</span>` : '';
        const onerr = c.iconFallback ? `onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';"` : '';
        const icon = c.icon ? `<img src="${c.icon}" class="split-header-icon" alt="" ${onerr}>${fallback}` : '';
        const items = c.items.map(it => {
          const iIcon = it.icon ? `<img src="${it.icon}" class="split-favicon" alt="" onerror="this.style.display='none';">` : '';
          return `<a class="split-item" href="${it.url}" target="_blank" rel="noopener">${iIcon}<span>${tx(it.label)}</span></a>`;
        }).join('');
        return `<div class="link-card split-card" tabindex="0" aria-expanded="false">
          <div class="split-header">
            ${icon}
            <div class="split-header-text">
              <span class="split-title">${tx(c.title)}</span>
              <span class="split-sep" aria-hidden="true">·</span>
              <span class="split-sub">${tx(c.desc)}</span>
            </div>
          </div>
          <div class="split-items">${items}</div>
        </div>`;
      }
      const fallback = c.iconFallback ? `<span class="card-fallback" aria-hidden="true">${c.iconFallback}</span>` : '';
      const onerr = c.iconFallback ? `onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-flex';"` : '';
      const icon = c.icon ? `<img src="${c.icon}" class="${c.iconClass || 'card-favicon'}" alt="" ${onerr}>${fallback}` : '';
      return `<a class="link-card" href="${c.url}" target="_blank" rel="noopener">
        <div class="link-title">${icon}<span>${tx(c.title)}</span></div>
        ${c.desc != null ? `<div class="desc">${tx(c.desc)}</div>` : ''}
      </a>`;
    }).join('');
  }

  bindSplitCards();
}
window.renderCards = renderCards;

function bindSplitCards() {
  document.querySelectorAll('.split-card').forEach(card => {
    if (card.dataset.splitBound) return;
    card.dataset.splitBound = '1';
    card.addEventListener('mouseenter', () => {
      document.querySelectorAll('.split-card.is-split').forEach(c => { if (c !== card) collapseSplitCard(c); });
      expandSplitCard(card);
    });
  });
}

/* =========================================================
   Spring 动画
   ========================================================= */
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
if (motionQuery.addEventListener) motionQuery.addEventListener('change', (e) => { prefersReduced = e.matches; });
else if (motionQuery.addListener) motionQuery.addListener((e) => { prefersReduced = e.matches; });

function playSprings(i) {
  springs.forEach(s => s.cancel());
  springs = [];
  const slide = slides[i];
  if (!slide) return;
  const els = Array.from(slide.querySelectorAll('.link-card, .vote-card, .rise')).filter(el => {
    if (el.id === 'card-april_fool') return false;
    if (el.id === 'trapCard') return false;
    return el.offsetParent !== null;
  });
  if (prefersReduced) { els.forEach(el => { el.style.opacity = '1'; el.style.transform = ''; }); return; }
  els.forEach((el, k) => {
    const sp = new Spring(el, 50 + k * 38);
    springs.push(sp);
    sp.start();
  });
}

/* =========================================================
   导航 / 切页
   ========================================================= */
function updateNav() {
  menuLinks.forEach((a, k) => a.classList.toggle('active', k === idx));
  shortcutLinks.forEach(a => a.classList.toggle('active', parseInt(a.dataset.slide, 10) === idx));
  if (mobileMoreBtn) {
    if (idx !== 0 && idx !== 1 && idx !== 4) mobileMoreBtn.classList.add('active');
    else mobileMoreBtn.classList.remove('active');
  }
}
function updateToastPosition() {
  const el = document.querySelector('.toast');
  if (!el) return;
  const nav = document.getElementById('mobileBottomNav');
  el.classList.toggle('raised', !!(nav && nav.classList.contains('expanded')));
}
function closeMobileDrawer() {
  if (!mobileBottomNav || !mobileDrawerOverlay || !mobileMoreBtn) return;
  const wasExpanded = mobileBottomNav.classList.contains('expanded');
  const active = document.activeElement;
  const focusInside = !!(active && active.closest && active.closest('#mobileNavExpanded'));
  mobileBottomNav.classList.remove('expanded');
  mobileDrawerOverlay.classList.remove('show');
  mobileMoreBtn.setAttribute('aria-expanded', 'false');
  const expanded = document.getElementById('mobileNavExpanded');
  if (expanded) expanded.setAttribute('aria-hidden', 'true');
  const settingsPanel = document.getElementById('mobileSettingsPanel');
  const gridMenu = document.getElementById('mobileGridMenu');
  const settingsBtn = document.getElementById('mobileSettingsBtn');
  if (settingsPanel && !settingsPanel.classList.contains('is-hidden')) {
    settingsPanel.classList.add('is-hidden');
    settingsPanel.querySelectorAll('.mobile-settings-sub').forEach(sub => sub.classList.remove('open'));
    settingsPanel.querySelectorAll('.mobile-settings-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
    if (gridMenu) gridMenu.classList.remove('is-hidden');
    if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'false');
  }
  if (wasExpanded && focusInside) mobileMoreBtn.focus({ preventScroll: true });
  updateToastPosition();
}
function scrollGuestbookToBottom() {
  const slide = slides[1];
  if (!slide || !slide.classList.contains('active')) return;
  const body = slide.querySelector('.slide-body');
  if (body) body.scrollTop = body.scrollHeight;
}
function scheduleGuestbookScroll() {
  scrollGuestbookToBottom();
  [150, 400, 800, 1500, 2500].forEach(d => setTimeout(scrollGuestbookToBottom, d));
}

function expandSplitCard(card) {
  if (!card || card.classList.contains('is-split')) return;
  card.classList.add('is-split');
  card.setAttribute('aria-expanded', 'true');
  card.dataset.expandedAt = String(performance.now());
}
function collapseSplitCard(card) {
  if (!card || !card.classList.contains('is-split')) return;
  card.classList.remove('is-split');
  card.setAttribute('aria-expanded', 'false');
  delete card.dataset.expandedAt;
}
function collapseAllSplitCards() {
  document.querySelectorAll('.split-card.is-split').forEach(c => collapseSplitCard(c));
}
document.addEventListener('mousemove', (e) => {
  const cards = document.querySelectorAll('.split-card.is-split');
  if (!cards.length) return;
  cards.forEach(card => {
    const expandedAt = Number(card.dataset.expandedAt || 0);
    if (performance.now() - expandedAt < 200) return;
    const rect = card.getBoundingClientRect();
    const inside = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!inside) collapseSplitCard(card);
  });
}, { passive: true });
document.addEventListener('click', (e) => {
  if (window.matchMedia('(hover: hover)').matches) return;
  const card = e.target.closest('.split-card');
  if (card) {
    if (e.target.closest('.split-item')) return;
    if (card.classList.contains('is-split')) return;
    document.querySelectorAll('.split-card.is-split').forEach(c => collapseSplitCard(c));
    expandSplitCard(card);
  } else {
    document.querySelectorAll('.split-card.is-split').forEach(c => {
      const expandedAt = Number(c.dataset.expandedAt || 0);
      if (performance.now() - expandedAt < 200) return;
      collapseSplitCard(c);
    });
  }
});

function go(target) {
  if (target < 0 || target >= slides.length) return;
  closeMobileDrawer();
  collapseAllSplitCards();
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
  const settingsMenu = document.getElementById('settingsMenu');
  if (settingsMenu) {
    if (idx === 0) settingsMenu.classList.add('show');
    else settingsMenu.classList.remove('show');
  }
  if (target === 1) { setTimeout(syncGiscusLang, 500); scheduleGuestbookScroll(); }
  if (target === 7) requestAnimationFrame(startEscapeLoop);
}

/* =========================================================
   音频合成
   ========================================================= */
class AudioSynth {
  constructor() { this.ctx = null; this.currentNodes = []; }
  init() {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
    } catch (e) { this.ctx = null; }
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
    osc.onended = () => { this.currentNodes = this.currentNodes.filter(n => n !== osc); };
  }
  close() { if (this.ctx) { try { this.ctx.close(); } catch (e) {} this.ctx = null; } }
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

const EFFECT_MAP = {
  firework: playFireworkSound,
  happy: playHappySound,
  spooky: playSpookySound,
  jingle: playJingleBells
};

/* =========================================================
   节日卡片
   ========================================================= */
const trapCard = document.getElementById('trapCard');
const trapProgress = document.getElementById('trapProgress');
const cardsHolder = document.getElementById('festival-cards-holder');

function initHolidays() {
  if (!cardsHolder) return;
  const today = new Date();
  SITE_DATA.festivals.filter(f => f.check(today)).forEach(f => {
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
  if (!isUnlocked && cardsHolder) { cardsHolder.innerHTML = ''; initHolidays(); }
}, 60 * 1000);

function renderFestivalCard(f) {
  if (!cardsHolder) return;
  if (document.getElementById(`card-${f.id}`)) return;
  const card = document.createElement('div');
  card.id = `card-${f.id}`;
  card.className = 'link-card';
  const nameStr = tx(f.name);
  const descStr = tx(f.desc);
  if (f.isEscape) {
    card.style.position = 'fixed';
    card.style.zIndex = '9999';
    card.style.width = '200px';
    card.style.display = 'none';
    card.style.left = '0';
    card.style.top = '0';
    card.style.willChange = 'transform';
    card.style.transform = `translate3d(${Math.max(20, window.innerWidth - 240)}px, ${Math.max(20, window.innerHeight - 160)}px, 0)`;
    card.innerHTML = `<div class="link-title" style="color: #c4a0ff;">${nameStr}</div><div class="desc">${descStr}</div>`;
  } else {
    card.setAttribute('role', 'button');
    card.tabIndex = 0;
    card.innerHTML = `<div class="link-title" style="color: #ff9d00;">${nameStr}</div><div class="desc">${descStr}</div>`;
    card.addEventListener('click', () => playFestivalEffect(f));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); playFestivalEffect(f); }
    });
  }
  cardsHolder.appendChild(card);
}

let brightnessToken = 0;
function playFestivalEffect(f) {
  synth.stop(); window.setBgBrightness(1.0);
  const existingOverlay = document.querySelector('.effect-overlay');
  if (existingOverlay) existingOverlay.remove();
  if (f.effect && EFFECT_MAP[f.effect]) EFFECT_MAP[f.effect]();
  if (typeof f.brightness === 'number') window.setBgBrightness(f.brightness);
  if (!f.emojis || f.emojis.length === 0) return;

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

/* =========================================================
   隐藏彩蛋
   ========================================================= */
let pressTimer = null, progressInterval = null, pressStartTime = 0;
let isLongPressed = false;
let activePointerId = null;
let pointerStartX = 0, pointerStartY = 0, pointerMoved = false;

function cancelTrapPress() {
  clearTimeout(pressTimer);
  clearInterval(progressInterval);
  if (trapProgress) trapProgress.style.width = '0%';
}
function startTrapPress() {
  isLongPressed = false;
  pressStartTime = Date.now();
  if (trapProgress) trapProgress.style.width = '0%';
  const start = Date.now();
  progressInterval = setInterval(() => {
    if (trapProgress) trapProgress.style.width = Math.min(((Date.now() - start) / 3000) * 100, 100) + '%';
  }, 20);
  pressTimer = setTimeout(() => {
    isLongPressed = true;
    clearInterval(progressInterval);
    if (trapProgress) trapProgress.style.width = '100%';
    if (!isUnlocked) {
      isUnlocked = true;
      SITE_DATA.festivals.forEach(f => {
        renderFestivalCard(f);
        const card = document.getElementById(`card-${f.id}`);
        if (card && card.style.display === 'none') card.style.display = 'block';
      });
      toast(t('toast_eggs_unlocked'));
      playSprings(idx);
    }
    setTimeout(() => { if (trapProgress) trapProgress.style.width = '0%'; }, 300);
  }, 3000);
}
function endTrapPress() {
  clearTimeout(pressTimer);
  clearInterval(progressInterval);
  if (!isLongPressed) {
    if (trapProgress) trapProgress.style.width = '0%';
    if (Date.now() - pressStartTime < 3000) triggerRandomEvent();
  }
}
if (trapCard) {
  trapCard.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    activePointerId = e.pointerId;
    pointerStartX = e.clientX; pointerStartY = e.clientY;
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
  trapCard.addEventListener('pointercancel', () => { activePointerId = null; cancelTrapPress(); });
  trapCard.addEventListener('pointerleave', () => { if (!isLongPressed) cancelTrapPress(); activePointerId = null; });
  trapCard.addEventListener('contextmenu', e => e.preventDefault());
  trapCard.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) { e.preventDefault(); startTrapPress(); }
  });
  trapCard.addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); endTrapPress(); }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest && e.target.closest('.link-card[role="button"]');
  if (!card || card.id === 'trapCard') return;
  e.preventDefault();
  card.click();
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
    if (!w) toast(t('toast_popup_blocked'));
  } else if (rand === 1 || rand === 2) {
    reqFullscreen();
    showErrorOverlay(rand === 1 ? 'blue' : 'mac');
  } else showErrorOverlay('404');
}

function showErrorOverlay(type) {
  if (document.querySelector('.fatal-error-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'fatal-error-overlay';
  let html = '';
  if (type === 'blue') {
    overlay.classList.add('blue-screen');
    html = `<h1>:(</h1><p>${t('err_blue')}</p>`;
  } else if (type === 'mac') {
    overlay.classList.add('mac-screen');
    html = `<div class="mac-spinner"></div><p>${t('err_mac')}</p>`;
  } else {
    overlay.classList.add('screen-404');
    html = `<h1>404</h1><p>${t('err_404')}</p>`;
  }
  overlay.innerHTML = html;
  let closed = false;
  const closeOverlay = () => {
    if (closed) return;
    closed = true;
    overlay.style.animation = 'none';
    overlay.style.transition = 'opacity .35s ease';
    overlay.style.opacity = '0';
    document.removeEventListener('keydown', onKey);
    setTimeout(() => {
      overlay.remove();
      if (enteredFullscreen && document.fullscreenElement) document.exitFullscreen().catch(() => {});
      enteredFullscreen = false;
    }, 360);
  };
  const onKey = (e) => { if (e.key === 'Escape' || e.key === 'Enter') closeOverlay(); };
  overlay.addEventListener('click', closeOverlay);
  document.addEventListener('keydown', onKey);
  setTimeout(closeOverlay, 8000);
  document.body.appendChild(overlay);
  overlay.tabIndex = 0;
  overlay.focus();
}

/* =========================================================
   愚人节逃跑
   ========================================================= */
let mouseX = 0, mouseY = 0, currentAngle = Math.PI, isEscaping = false;
let escapeGeneration = 0;
function startEscapeLoop() {
  if (isEscaping) return;
  const eggEscape = document.getElementById('card-april_fool');
  if (!eggEscape || eggEscape.style.display === 'none' || !eggEscape.isConnected) return;
  if (mouseX === 0 && mouseY === 0) { mouseX = window.innerWidth / 2; mouseY = window.innerHeight * 0.6; }
  isEscaping = true;
  const generation = ++escapeGeneration;
  const w = eggEscape.offsetWidth || 200;
  const h = eggEscape.offsetHeight || 90;
  function update() {
    if (generation !== escapeGeneration) return;
    const el = document.getElementById('card-april_fool');
    if (!el || el.style.display === 'none' || !el.isConnected || document.hidden || !el.closest('.slide.active')) {
      isEscaping = false; return;
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
   桌游浮层
   ========================================================= */
const HULLQIN_BASE = 'https://game.hullqin.cn/';
let boardGamesOverlay = null;

function buildBoardGamesGridHTML() {
  return SITE_DATA.boardGames.map(g =>
    `<a class="boardgames-item" href="${HULLQIN_BASE}${g.path}" target="_blank" rel="noopener">${g.name}</a>`
  ).join('');
}
function openBoardGamesModal(fromCard) {
  if (boardGamesOverlay) return;
  const fromRect = fromCard.getBoundingClientRect();
  const overlay = document.createElement('div');
  overlay.className = 'boardgames-overlay';
  overlay.innerHTML = `
    <div class="boardgames-panel" role="dialog" aria-modal="true">
      <div class="boardgames-head">
        <h3>${t('hullqin_modal_title')}</h3>
        <button type="button" class="boardgames-close" aria-label="${t('hullqin_modal_close')}">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      <div class="boardgames-grid">${buildBoardGamesGridHTML()}</div>
    </div>`;
  document.body.appendChild(overlay);
  boardGamesOverlay = overlay;
  const panel = overlay.querySelector('.boardgames-panel');
  const toRect = panel.getBoundingClientRect();
  panel.style.transition = 'none';
  panel.style.transformOrigin = 'top left';
  const scaleX = Math.max(fromRect.width / toRect.width, 0.05);
  const scaleY = Math.max(fromRect.height / toRect.height, 0.05);
  const dx = fromRect.left - toRect.left;
  const dy = fromRect.top - toRect.top;
  panel.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
  panel.style.opacity = '0';
  requestAnimationFrame(() => {
    overlay.classList.add('show');
    panel.style.transition = 'transform .42s cubic-bezier(.22,1.2,.36,1), opacity .28s ease';
    panel.style.transform = 'translate(0, 0) scale(1, 1)';
    panel.style.opacity = '1';
  });
  const close = () => {
    if (!boardGamesOverlay) return;
    panel.style.transition = 'transform .32s ease, opacity .22s ease';
    panel.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY})`;
    panel.style.opacity = '0';
    overlay.classList.remove('show');
    document.removeEventListener('keydown', onKey);
    setTimeout(() => { overlay.remove(); boardGamesOverlay = null; }, 340);
  };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('.boardgames-close').addEventListener('click', close);
}

/* =========================================================
   Toast / copyLink
   ========================================================= */
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
window.copyLink = function (text) {
  const done = () => toast(t('toast_copied').replace('{url}', text));
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); }
    catch (err) { toast(t('toast_copy_failed')); }
    ta.remove();
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done).catch(fallback);
  else fallback();
};

document.addEventListener('click', (e) => {
  const copyEl = e.target.closest('[data-copy]');
  if (copyEl) copyLink(copyEl.dataset.copy);
});
document.addEventListener('click', (e) => {
  const bgCard = e.target.closest('#boardGamesCard');
  if (bgCard) openBoardGamesModal(bgCard);
});

/* =========================================================
   设置菜单
   ========================================================= */
function initSettingsMenu() {
  if (document.getElementById('settingsMenu')) return;
  const menuHTML = `
    <div id="settingsMenu" class="settings-menu-wrapper" tabindex="0" aria-label="${t('settings_label')}">
      <div class="settings-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </div>
      <div class="settings-options">
        <div class="settings-group" data-group="lang">
          <button type="button" class="settings-trigger">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
            <span>${t('settings_lang')}</span>
          </button>
          <div class="settings-sub">${buildLangButtonsHTML()}</div>
        </div>
        <div class="settings-group" data-group="theme">
          <button type="button" class="settings-trigger">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a7 7 0 0 0 0 14c1.5 0 2-1 2-2s-.5-1-2-1a5 5 0 0 1 0-10z" fill="currentColor" stroke="none"></path></svg>
            <span>${t('settings_theme')}</span>
          </button>
          <div class="settings-sub">${buildThemeButtonsHTML()}</div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', menuHTML);
  const menu = document.getElementById('settingsMenu');
  let hideTimer = null;
  function cancelHide() { if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; } }
  function closeMenuNow() {
    cancelHide();
    menu.classList.remove('is-open');
    menu.querySelectorAll('.settings-group').forEach(g => g.classList.remove('sub-open'));
  }
  function scheduleHide(delay = 2000) {
    cancelHide();
    hideTimer = setTimeout(closeMenuNow, delay);
  }
  menu.addEventListener('mouseenter', () => { cancelHide(); menu.classList.add('is-open'); });
  document.addEventListener('mousemove', (e) => {
    if (!menu.classList.contains('is-open')) return;
    if (menu.contains(document.activeElement)) return;
    const rect = menu.getBoundingClientRect();
    if (e.clientX < rect.left - 20 || e.clientX > rect.right + 20) { closeMenuNow(); return; }
    if (e.clientY >= rect.top - 20 && e.clientY <= rect.bottom + 260) cancelHide();
    else scheduleHide(2000);
  });
  menu.querySelectorAll('.settings-group').forEach(group => {
    group.addEventListener('mouseenter', () => {
      cancelHide();
      menu.querySelectorAll('.settings-group').forEach(g => { if (g !== group) g.classList.remove('sub-open'); });
      group.classList.add('sub-open');
    });
  });
  menu.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.addEventListener('click', (e) => { applyLanguage(btn.dataset.lang); if (e.detail !== 0) btn.blur(); });
  });
  menu.querySelectorAll('button[data-theme]').forEach(btn => {
    btn.addEventListener('click', (e) => { applyTheme(btn.dataset.theme); if (e.detail !== 0) btn.blur(); });
  });
  updateThemeButtons(themePreference);
  updateLangButtons(currentLang);
}

function initMobileSettingsPanel() {
  const gridMenu = document.getElementById('mobileGridMenu');
  const panel = document.getElementById('mobileSettingsPanel');
  const settingsBtn = document.getElementById('mobileSettingsBtn');
  const backBtn = document.getElementById('mobileSettingsBack');
  if (!gridMenu || !panel || !settingsBtn || !backBtn) return;
  const langSub = document.getElementById('mobileSubLang');
  const themeSub = document.getElementById('mobileSubTheme');
  if (langSub && !langSub.innerHTML.trim()) langSub.innerHTML = buildLangButtonsHTML();
  if (themeSub && !themeSub.innerHTML.trim()) themeSub.innerHTML = buildThemeButtonsHTML();
  if (langSub) langSub.querySelectorAll('button[data-lang]').forEach(btn => {
    btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
  });
  if (themeSub) themeSub.querySelectorAll('button[data-theme]').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
  });
  settingsBtn.addEventListener('click', () => {
    gridMenu.classList.add('is-hidden');
    panel.classList.remove('is-hidden');
    settingsBtn.setAttribute('aria-expanded', 'true');
  });
  backBtn.addEventListener('click', () => {
    panel.classList.add('is-hidden');
    gridMenu.classList.remove('is-hidden');
    settingsBtn.setAttribute('aria-expanded', 'false');
    panel.querySelectorAll('.mobile-settings-sub').forEach(sub => sub.classList.remove('open'));
    panel.querySelectorAll('.mobile-settings-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
  });
  panel.querySelectorAll('.mobile-settings-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const target = document.getElementById(trigger.dataset.target);
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      panel.querySelectorAll('.mobile-settings-sub').forEach(sub => sub.classList.remove('open'));
      panel.querySelectorAll('.mobile-settings-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
      if (!isOpen && target) { trigger.setAttribute('aria-expanded', 'true'); target.classList.add('open'); }
    });
  });
  updateThemeButtons(themePreference);
  updateLangButtons(currentLang);
}

/* =========================================================
   applyLanguage
   ========================================================= */
function applyLanguage(lang) {
  applyLanguageText(lang);
  const holder = document.getElementById('festival-cards-holder');
  if (!holder) return;
  holder.innerHTML = '';
  if (isUnlocked) {
    SITE_DATA.festivals.forEach(f => {
      renderFestivalCard(f);
      const card = document.getElementById(`card-${f.id}`);
      if (card && card.style.display === 'none') card.style.display = 'block';
    });
  } else {
    initHolidays();
  }
  if (idx === 7) {
    requestAnimationFrame(startEscapeLoop);
    playSprings(idx);
  }
}

/* =========================================================
   初始化
   ========================================================= */
(function init() {
  if (typeof safeGet !== 'function' || typeof t !== 'function') {
    console.error('[app.js] core.js 未正确加载（safeGet/t 未定义）。请检查脚本顺序，并确认 lang.js / main.js 已删除。');
    return;
  }

  const saved = parseInt(safeGet('site_slide'), 10);
  if (Number.isFinite(saved) && saved > 0 && saved < slides.length) {
    if (slides[idx]) slides[idx].classList.remove('active');
    idx = saved;
    if (slides[idx]) slides[idx].classList.add('active');
  }

  initSettingsMenu();
  initMobileSettingsPanel();
  mountGiscus();
  applyLanguage(currentLang);
  applyTheme(themePreference);
  updateNav();

  if (idx === 7) requestAnimationFrame(startEscapeLoop);
  else playSprings(idx);
  if (idx === 1) scheduleGuestbookScroll();

  const settingsMenuEl = document.getElementById('settingsMenu');
  if (settingsMenuEl) {
    if (idx === 0) settingsMenuEl.classList.add('show');
    else settingsMenuEl.classList.remove('show');
  }

  const siteLogo = document.getElementById('siteLogo');
  if (siteLogo) {
    siteLogo.addEventListener('click', (e) => { e.preventDefault(); go(0); });
  }

  menuLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = parseInt(a.dataset.slide, 10);
      if (!Number.isNaN(target)) go(target);
    });
  });
  shortcutLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = parseInt(a.dataset.slide, 10);
      if (!Number.isNaN(target)) go(target);
    });
  });
  drawerLinks.forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = parseInt(a.dataset.slide, 10);
      if (!Number.isNaN(target)) go(target);
    });
  });

  if (mobileMoreBtn) {
    mobileMoreBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileBottomNav.classList.add('expanded');
      mobileDrawerOverlay.classList.add('show');
      mobileMoreBtn.setAttribute('aria-expanded', 'true');
      const expanded = document.getElementById('mobileNavExpanded');
      if (expanded) expanded.setAttribute('aria-hidden', 'false');
      const settingsPanel = document.getElementById('mobileSettingsPanel');
      const gridMenu = document.getElementById('mobileGridMenu');
      const settingsBtn = document.getElementById('mobileSettingsBtn');
      if (settingsPanel) {
        settingsPanel.classList.add('is-hidden');
        settingsPanel.querySelectorAll('.mobile-settings-sub').forEach(sub => sub.classList.remove('open'));
        settingsPanel.querySelectorAll('.mobile-settings-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
      }
      if (gridMenu) gridMenu.classList.remove('is-hidden');
      if (settingsBtn) settingsBtn.setAttribute('aria-expanded', 'false');
      const first = document.querySelector('#mobileNavExpanded a, #mobileNavExpanded button');
      if (first) setTimeout(() => first.focus({ preventScroll: true }), 380);
      updateToastPosition();
    });
    mobileMoreBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mobileMoreBtn.click(); }
    });
  }
  if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileDrawer(); });
})();
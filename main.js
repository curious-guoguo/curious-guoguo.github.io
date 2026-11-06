/* =========================================================
   1. 国际化 (i18n) 字典与语言菜单逻辑
   ========================================================= */
const i18n = {
  zh: {
    nav_home: '首页', nav_guestbook: '留言板', nav_vote: '打榜', nav_about: '关于我', nav_arcade: '游乐场', nav_tools: '百宝箱', nav_secret: '隐藏关',
    hero_sub: '写代码 · 打游戏 · 折腾各种东西',
    home_visit_1: '这里一共有', home_visit_2: '个 ID 访问，总共', home_visit_3: '次',
    home_thanks: '感谢 saobby 提供访问统计与投票服务',
    vote_1: '蒟蒻', vote_2: '老六', vote_3: '大佬六', vote_btn: '去投票 →',
    desc_bili: '我的B站个人空间', desc_github: '我的开源代码仓库', desc_ccw: '共创世界个人主页', desc_luogu: '洛谷编程平台个人主页',
    card_ccw: '共创世界', card_luogu: '洛谷', card_email: '联系邮箱',
    card_dino: 'chrome小恐龙', desc_dino: '点击复制链接后自行打开',
    card_td1: '塔防（1）', desc_td1: '经典塔防小游戏',
    card_td2: '塔防（2）', desc_td2: 'Yorg 塔防在线游玩',
    card_td3: '塔防（3）', desc_td3: 'Yorg3 塔防游戏',
    card_florr: '花朵', desc_florr: 'Florr.io 花朵生存游戏',
    desc_poki: '在线免费小游戏平台', desc_slay: '多人在线射击 IO 游戏',
    card_tool1: '综合工具箱', desc_tool1: 'tool.lu 在线工具集',
    card_tool2: '信奥工具', desc_tool2: 'ssoier 学习与工具站',
    card_tool3: '建站工具', desc_tool3: 'saobby 建站服务平台',
    card_tool4: '云端剪贴板', desc_tool4: 'note.ms 在线文本分享',
    card_tool5: '轻松传', desc_tool5: '跨设备文件极速传输',
    desc_tool6: '深度求索对话大模型',
    card_trap: '千万别点',
    f_new_year: '🎆 元旦快乐', f_april_fool: '🤡 愚人节快乐', f_easter: '🐰 复活节', f_mother: '🌷 母亲节', f_father: '👔 父亲节', f_halloween_eve: '🎃 万圣节前夜', f_halloween: '🎃 万圣节', f_thanksgiving: '🦃 感恩节', f_xmas_eve: '🎄 平安夜', f_xmas: '🎄 圣诞节',
    d_new_year: '新年烟花，点亮夜空', d_april_fool: '你永远也抓不到我！', d_easter: '寻找属于你的彩蛋', d_mother: '妈妈辛苦了', d_father: '爸爸辛苦了', d_halloween_eve: '百鬼夜行，群魔乱舞', d_halloween: '不给糖就捣蛋', d_thanksgiving: '感恩节大餐', d_xmas_eve: '圣诞前夕，雪花飘落', d_xmas: 'Merry Christmas!'
  },
  en: {
    nav_home: 'Home', nav_guestbook: 'Guestbook', nav_vote: 'Vote', nav_about: 'About', nav_arcade: 'Arcade', nav_tools: 'Toolbox', nav_secret: 'Secret',
    hero_sub: 'Coding · Gaming · Tinkering with everything',
    home_visit_1: 'Total', home_visit_2: 'unique IDs and', home_visit_3: 'views',
    home_thanks: 'Powered by saobby',
    vote_1: 'Novice', vote_2: 'Veteran', vote_3: 'Master', vote_btn: 'Vote →',
    desc_bili: 'My Bilibili Space', desc_github: 'My Open Source Repos', desc_ccw: 'CCW Profile', desc_luogu: 'Luogu Profile',
    card_ccw: 'CCW', card_luogu: 'Luogu', card_email: 'Email',
    card_dino: 'Chrome Dino', desc_dino: 'Click to copy link and open',
    card_td1: 'Tower Defense (1)', desc_td1: 'Classic mini-game',
    card_td2: 'Tower Defense (2)', desc_td2: 'Yorg Tower Defense',
    card_td3: 'Tower Defense (3)', desc_td3: 'Yorg3 Tower Defense',
    card_florr: 'Florr', desc_florr: 'Florr.io survival game',
    desc_poki: 'Free online games', desc_slay: 'Multiplayer IO shooter',
    card_tool1: 'Toolbox', desc_tool1: 'tool.lu online tools',
    card_tool2: 'OI Tools', desc_tool2: 'ssoier learning tools',
    card_tool3: 'Website Builder', desc_tool3: 'saobby builder',
    card_tool4: 'Cloud Clipboard', desc_tool4: 'note.ms clipboard',
    card_tool5: 'Easy Chuan', desc_tool5: 'Cross-device file transfer',
    desc_tool6: 'DeepSeek Chat Model',
    card_trap: 'DO NOT CLICK',
    f_new_year: '🎆 Happy New Year', f_april_fool: '🤡 April Fool', f_easter: '🐰 Easter', f_mother: '🌷 Mother\'s Day', f_father: '👔 Father\'s Day', f_halloween_eve: '🎃 Halloween Eve', f_halloween: '🎃 Halloween', f_thanksgiving: '🦃 Thanksgiving', f_xmas_eve: '🎄 Christmas Eve', f_xmas: '🎄 Christmas',
    d_new_year: 'Fireworks lighting up the night', d_april_fool: 'You can never catch me!', d_easter: 'Find your easter egg', d_mother: 'Happy Mother\'s Day', d_father: 'Happy Father\'s Day', d_halloween_eve: 'Spooky night', d_halloween: 'Trick or Treat', d_thanksgiving: 'Thanksgiving feast', d_xmas_eve: 'Snowflakes falling', d_xmas: 'Merry Christmas!'
  }
};

// 校验 localStorage 中的语言值，非法时回退到中文
let storedLang = localStorage.getItem('site_lang');
let currentLang = (storedLang && i18n[storedLang]) ? storedLang : 'zh';

function applyLanguage(lang) {
  if (!i18n[lang]) lang = 'zh';
  currentLang = lang;
  localStorage.setItem('site_lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });

  // 页面标题跟随语言
  document.title = `curious-guoguo | ${i18n[lang].nav_home}`;

  // giscus 留言板语言同步（若已加载）
  try {
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame && giscusFrame.contentWindow) {
      giscusFrame.contentWindow.postMessage(
        { giscus: { setConfig: { lang: lang === 'zh' ? 'zh-CN' : 'en' } } },
        'https://giscus.app'
      );
    }
  } catch (e) { /* 忽略跨域或未加载 */ }

  // 重建节日卡片，保留解锁状态（修复：切语言不再丢失已解锁的隐藏节日）
  const holder = document.getElementById('festival-cards-holder');
  if (holder) {
    holder.innerHTML = '';
    if (typeof isUnlocked !== 'undefined' && isUnlocked) {
      FESTIVALS.forEach(f => {
        renderFestivalCard(f);
        const card = document.getElementById(`card-${f.id}`);
        if (card && card.style.display === 'none') card.style.display = 'block';
      });
    } else {
      initHolidays();
    }
    if (typeof idx !== 'undefined' && idx === 6) playSprings(idx);
  }
}

// 桌面端语言菜单
function initLangMenu() {
  const menuHTML = `
    <div id="langMenu" class="lang-menu-wrapper">
      <div class="lang-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
      </div>
      <div class="lang-options">
        <span onclick="applyLanguage('zh')">中文</span>
        <span onclick="applyLanguage('en')">EN</span>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', menuHTML);
  applyLanguage(currentLang);
}


/* =========================================================
   2. 高性能 WebGL 背景
   ========================================================= */
(function initWebGL() {
  // 兜底：即使 WebGL 不可用，也不让后续调用崩溃
  window.setBgBrightness = () => {};

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
  const uBrightness = gl.getUniformLocation(program, 'u_brightness');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  window.addEventListener('resize', resize);
  resize();

  let startTime = performance.now();
  let targetBrightness = 1.0;
  let currentBrightness = 1.0;

  window.setBgBrightness = (val) => { targetBrightness = val; };

  function render(time) {
    currentBrightness += (targetBrightness - currentBrightness) * 0.05;
    gl.uniform1f(uBrightness, currentBrightness);
    gl.uniform1f(uTime, (time - startTime) * 0.001);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
})();


/* =========================================================
   3. 基础变量与切页逻辑
   ========================================================= */
const slides = Array.from(document.querySelectorAll('.slide'));
const menuLinks = Array.from(document.querySelectorAll('.sidebar-menu a'));
const mobileBottomLinks = Array.from(document.querySelectorAll('.mobile-bottom-nav a[data-slide]'));
const drawerLinks = Array.from(document.querySelectorAll('.grid-menu a'));

// 移动端变形胶囊相关
const mobileMoreBtn = document.getElementById('mobileMoreBtn');
const mobileBottomNav = document.getElementById('mobileBottomNav');
const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');

let idx = 0;
let springs = [];

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

function playSprings(i) {
  springs.forEach(s => s.cancel());
  springs = [];
  const slide = slides[i];
  if (!slide) return;
  const els = slide.querySelectorAll('.link-card, .vote-card, .rise');
  els.forEach((el, k) => {
    if (el.style.display === 'none') return;
    const sp = new Spring(el, 50 + k * 38);
    springs.push(sp);
    sp.start();
  });
}

function updateNav() {
  // 桌面侧边栏高亮
  menuLinks.forEach((a, k) => a.classList.toggle('active', k === idx));

  // 移动端快捷栏高亮
  const shortcutLinks = mobileBottomNav.querySelectorAll('.nav-shortcuts .nav-item[data-slide]');
  shortcutLinks.forEach(a => {
    const t = parseInt(a.dataset.slide, 10);
    a.classList.toggle('active', t === idx);
  });

  // 如果当前页面不在快捷栏，高亮“更多”
  if (idx !== 0 && idx !== 1 && idx !== 4) {
    mobileMoreBtn.classList.add('active');
  } else {
    mobileMoreBtn.classList.remove('active');
  }
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

  // 切换页面时，收起移动端胶囊
  mobileBottomNav.classList.remove('expanded');
  mobileDrawerOverlay.classList.remove('show');

  updateNav();
  playSprings(idx);

  // 桌面端语言菜单只在首页显示
  const langMenu = document.getElementById('langMenu');
  if (langMenu) {
    if (idx === 0) langMenu.classList.add('show');
    else langMenu.classList.remove('show');
  }
}


/* =========================================================
   4. 音乐与节日逻辑
   ========================================================= */
class AudioSynth {
  constructor() { this.ctx = null; this.currentNodes = []; }
  init() {
    if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.ctx.state === 'suspended') this.ctx.resume();
  }
  stop() { this.currentNodes.forEach(n => { try { n.stop(); } catch(e) {} }); this.currentNodes = []; }
  playTone(freq, duration, type = 'square', startTime = 0) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator(); const gain = this.ctx.createGain();
    osc.type = type; osc.frequency.value = freq;
    const now = this.ctx.currentTime + startTime;
    gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain); gain.connect(this.ctx.destination);
    osc.start(now); osc.stop(now + duration); this.currentNodes.push(osc);
  }
}
const synth = new AudioSynth();
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
let isLongPressed = false, isUnlocked = false;

function initHolidays() {
  const today = new Date();
  const activeHolidays = FESTIVALS.filter(f => f.check(today));
  activeHolidays.forEach(f => renderFestivalCard(f));
}

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
    card.innerHTML = `<div class="link-title" style="color: #c4a0ff;">${nameStr}</div><div class="desc">${descStr}</div>`;
  } else {
    card.innerHTML = `<div class="link-title" style="color: #ff9d00;">${nameStr}</div><div class="desc">${descStr}</div>`;
    card.addEventListener('click', () => playFestivalEffect(f));
  }
  cardsHolder.appendChild(card);
}

function playFestivalEffect(f) {
  synth.stop(); window.setBgBrightness(1.0);
  const existingOverlay = document.querySelector('.effect-overlay');
  if (existingOverlay) existingOverlay.remove();
  f.action();
  if (f.emojis.length === 0) return;

  const overlay = document.createElement('div');
  overlay.className = 'effect-overlay';
  document.body.appendChild(overlay);
  const animClass = f.bounce ? 'bouncing-emoji' : 'falling-emoji';

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const span = document.createElement('span');
      span.className = animClass;
      span.textContent = f.emojis[Math.floor(Math.random() * f.emojis.length)];
      if (f.bounce) {
        span.style.left = '-50px'; span.style.top = '0px';
        span.style.animationDuration = (Math.random() * 1 + 1.5) + 's'; span.style.animationDelay = '0s';
      } else {
        span.style.left = Math.random() * 100 + 'vw'; span.style.fontSize = (Math.random() * 2 + 1) + 'rem';
        span.style.animationDuration = (Math.random() * 2 + 2) + 's';
      }
      overlay.appendChild(span);
    }, i * 80);
  }

  setTimeout(() => {
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.remove(); window.setBgBrightness(1.0); }, 1000);
  }, 5000);
}

function handlePressStart(e) {
  if (e.type === 'mousedown' && e.button !== 0) return;
  if (e.type === 'touchstart') e.preventDefault();

  isLongPressed = false; pressStartTime = Date.now(); trapProgress.style.width = '0%';

  let start = Date.now();
  progressInterval = setInterval(() => {
    let percent = Math.min(((Date.now() - start) / 3000) * 100, 100);
    trapProgress.style.width = percent + '%';
  }, 20);

  pressTimer = setTimeout(() => {
    isLongPressed = true; clearInterval(progressInterval); trapProgress.style.width = '100%';
    if (!isUnlocked) {
      isUnlocked = true;
      FESTIVALS.forEach(f => {
        renderFestivalCard(f);
        const card = document.getElementById(`card-${f.id}`);
        if (card && card.style.display === 'none') card.style.display = 'block';
      });
      toast(currentLang === 'zh' ? '发现全部隐藏彩蛋！' : 'Hidden eggs unlocked!');
      playSprings(idx);
    }
    setTimeout(() => { trapProgress.style.width = '0%'; }, 300);
  }, 3000);
}

function handlePressEnd(e) {
  if (e.type === 'touchend') e.preventDefault();
  clearTimeout(pressTimer); clearInterval(progressInterval);
  if (!isLongPressed) {
    trapProgress.style.width = '0%';
    if (Date.now() - pressStartTime < 3000) triggerRandomEvent();
  }
}

trapCard.addEventListener('mousedown', handlePressStart);
trapCard.addEventListener('touchstart', handlePressStart, { passive: false });
trapCard.addEventListener('mouseup', handlePressEnd);
trapCard.addEventListener('touchend', handlePressEnd);
trapCard.addEventListener('mouseleave', () => {
  if (!isLongPressed) {
    clearTimeout(pressTimer); clearInterval(progressInterval); trapProgress.style.width = '0%';
  }
});

// 键盘无障碍：Enter / Space 等价短按
trapCard.addEventListener('keydown', (e) => {
  if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
    e.preventDefault();
    triggerRandomEvent();
  }
});

// 其他 role=button 卡片（例如 chrome 小恐龙）的键盘支持
document.querySelectorAll('.link-card[role="button"]').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.click();
    }
  });
});

function triggerRandomEvent() {
  const rickroll = 'https://www.bilibili.com/video/BV1GJ411x7h7';
  const rand = Math.floor(Math.random() * 4);
  const reqFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen().catch(() => {});
  };

  if (rand === 0) window.open(rickroll, '_blank');
  else if (rand === 1) { reqFullscreen(); showErrorOverlay('blue'); }
  else if (rand === 2) { reqFullscreen(); showErrorOverlay('mac'); }
  else showErrorOverlay('404');
}

function showErrorOverlay(type) {
  if (document.querySelector('.fatal-error-overlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'fatal-error-overlay';
  let html = '';
  if (type === 'blue') { overlay.classList.add('blue-screen'); html = `<h1>:(</h1><p>${currentLang === 'zh' ? '你的电脑遇到问题，需要重新启动。' : 'Your PC ran into a problem and needs to restart.'}</p>`; }
  else if (type === 'mac') { overlay.classList.add('mac-screen'); html = `<div style="width:40px;height:40px;border:4px solid #ccc;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite;margin-bottom:20px;"></div><p>${currentLang === 'zh' ? '系统无响应，正在重启...' : 'System not responding, restarting...'}</p>`; }
  else { overlay.classList.add('404-screen'); html = `<h1>404</h1><p>${currentLang === 'zh' ? '网页已崩溃，数据丢失。' : 'Page crashed, data lost.'}</p>`; }
  overlay.innerHTML = html;

  // 允许关闭（点击任意处 / 8 秒后自动）
  let closed = false;
  const closeOverlay = () => {
    if (closed) return;
    closed = true;
    // 去除 CSS 动画，避免 forwards 锁定 opacity 导致无法淡出
    overlay.style.animation = 'none';
    overlay.style.transition = 'opacity .35s ease';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.remove();
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }, 360);
  };
  overlay.addEventListener('click', closeOverlay);
  setTimeout(closeOverlay, 8000);

  document.body.appendChild(overlay);
}


/* =========================================================
   6. 愚人节磁铁排斥逃跑
   ========================================================= */
let mouseX = 0, mouseY = 0, currentAngle = Math.PI, isEscaping = false;

function startEscapeLoop() {
  if (isEscaping) return;
  isEscaping = true;

  function update() {
    const eggEscape = document.getElementById('card-april_fool');
    if (!eggEscape || eggEscape.style.display === 'none') { isEscaping = false; return; }

    const rect = eggEscape.getBoundingClientRect();
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

    eggEscape.style.transition = 'none';
    eggEscape.style.left = `${targetCx - rect.width / 2}px`;
    eggEscape.style.top = `${targetCy - rect.height / 2}px`;
    eggEscape.style.transform = 'none';

    requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

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

// 底栏快捷点击
const shortcutLinks = mobileBottomNav.querySelectorAll('.nav-shortcuts .nav-item[data-slide]');
shortcutLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = parseInt(a.dataset.slide, 10);
    if (!Number.isNaN(t)) go(t);
  });
});

// 抽屉内菜单点击
drawerLinks.forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = parseInt(a.dataset.slide, 10);
    if (!Number.isNaN(t)) go(t);
  });
});

// 展开/收缩变形胶囊
mobileMoreBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileBottomNav.classList.add('expanded');
  mobileDrawerOverlay.classList.add('show');
});

// 点击外部遮罩收回
mobileDrawerOverlay.addEventListener('click', () => {
  mobileBottomNav.classList.remove('expanded');
  mobileDrawerOverlay.classList.remove('show');
});


window.copyLink = function (text) {
  const done = () => toast(currentLang === 'zh' ? '已复制链接：' + text : 'Link copied: ' + text);
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); }
    catch (err) { toast(currentLang === 'zh' ? '复制失败，请手动复制' : 'Copy failed'); }
    ta.remove();
  };
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done).catch(fallback);
  else fallback();
};

let toastTimer = null;
function toast(msg) {
  let el = document.querySelector('.toast');
  if (!el) { el = document.createElement('div'); el.className = 'toast'; document.body.appendChild(el); }
  el.textContent = msg; void el.offsetWidth; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2000);
}

// 提前初始化（applyLanguage 已含节日卡片初始化，initHolidays 幂等，可保留）
initLangMenu();
initHolidays();

const langMenuEl = document.getElementById('langMenu');
if (langMenuEl) langMenuEl.classList.add('show');

updateNav();
playSprings(idx);

window.addEventListener('load', () => {
  // 动画已在前面立即播放
});
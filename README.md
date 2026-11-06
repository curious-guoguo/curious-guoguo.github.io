# curious-guoguo 个人主页

一个集个人展示、小游戏导航、在线工具收藏与节日彩蛋于一体的单页个人主页。纯静态实现，零构建依赖，原生 HTML + CSS + JavaScript 编写。

> 写代码 · 打游戏 · 折腾各种东西

---

## ✨ 特性一览

| 特性 | 说明 |
|---|---|
| 🌌 **WebGL 动态背景** | 基于 simplex 噪声的三色流动光晕，随节日自动调节亮度 |
| 🗂 **七页单页应用** | 首页 / 留言板 / 打榜 / 关于我 / 游乐场 / 百宝箱 / 隐藏关 |
| 🌐 **中英双语** | 全站文案 i18n，选择记忆在 `localStorage` |
| 🎬 **弹簧入场动画** | 卡片以物理弹簧曲线逐个弹入，切换页面重新触发 |
| 📱 **变形胶囊底栏** | 移动端底栏可展开为 2×4 页面网格 + 语言切换 |
| 🎉 **节日彩蛋系统** | 10 个节日按日期自动出现，附音效、emoji 特效与背景亮度联动 |
| 🕹 **隐藏关** | 长按解锁全部彩蛋，短按触发随机恶作剧 |
| 🎵 **Web Audio 合成音乐** | 无需音频文件，代码合成《铃儿响叮当》与各类音效 |
| 💬 **giscus 留言板** | 基于 GitHub Discussions 的无后端评论系统 |
| 📊 **访问统计与投票** | 由 saobby 提供服务 |

---

## 📄 页面结构

### 1. 首页
- 大字标题 + 渐变姓名
- 实时访问统计（独立 ID 数 / 总访问次数）
- 桌面端左上角悬停语言菜单

### 2. 留言板
- 嵌入 giscus，基于 GitHub Discussions
- 语言随站点切换同步（通过 `postMessage` 通知 iframe）

### 3. 打榜
- 三个候选人卡片（蒟蒻 / 老六 / 大佬六）
- 缩略图 + 一键跳转投票页

### 4. 关于我
- Bilibili、GitHub、共创世界、洛谷、邮箱等社交与平台入口

### 5. 游乐场
- Chrome 小恐龙（点击复制 `chrome://dino/`）
- 塔防 ×3、Florr.io、Poki、slay.one 等小游戏外链

### 6. 百宝箱
- tool.lu、ssoier、saobby、note.ms、轻松传、DeepSeek 等在线工具

### 7. 隐藏关 🕳
- 「千万别点」陷阱卡片
- 长按 3 秒 → 解锁全部节日彩蛋
- 短按 → 随机触发：B 站视频 / 蓝屏 / Mac 转圈 / 404

---

## 🎉 节日彩蛋系统

彩蛋按公历或农历规则在**当天自动出现**在隐藏关中（解锁后常驻）。点击卡片会播放对应音效、emoji 特效，并调节 WebGL 背景亮度。

| 节日 | 日期规则 | 特效 |
|---|---|---|
| 🎆 元旦 | 1 月 1 日 | 烟花音效 + 提亮背景 |
| 🤡 愚人节 | 4 月 1 日 | **磁铁排斥**：卡片始终躲在鼠标/手指对侧 |
| 🐰 复活节 | 复活节算法（高斯算法） | 弹跳彩蛋 |
| 🌷 母亲节 | 5 月第二个周日 | 爱心花瓣下落 |
| 👔 父亲节 | 6 月第三个周日 | 礼物飘落 |
| 🎃 万圣节前夜 | 10 月 31 日 | 恐怖音效 + 压暗背景 |
| 🎃 万圣节 | 11 月 1 日 | 同上 |
| 🦃 感恩节 | 11 月第四个周四 | 火鸡下落 |
| 🎄 平安夜 | 12 月 24 日 | 《铃儿响叮当》 |
| 🎄 圣诞节 | 12 月 25 日 | 《铃儿响叮当》 |

> 愚人节卡片使用极坐标反向追踪：每帧计算卡片应处于鼠标对侧的位置，并用角度插值平滑过渡，永远抓不到。

---

## 🛠 技术栈

- **纯静态**：HTML + CSS + 原生 JS，无框架、无打包
- **WebGL**：手写 GLSL 片元着色器实现 simplex 噪声流动背景
- **Web Audio API**：`OscillatorNode` + `GainNode` 合成音效
- **CSS**：`backdrop-filter` 毛玻璃、`cubic-bezier` 弹簧曲线、`clamp()` 响应式
- **Spring 物理动画**：用 JS 实现弹簧阻尼系统驱动卡片入场
- **giscus**：GitHub Discussions 评论系统

---

## 📁 文件结构

```
.
├── index.html    # 页面结构（7 个 slide + 桌面侧边栏 + 移动胶囊底栏）
├── style.css     # 全部样式（含响应式与动效）
└── main.js       # 全部逻辑（i18n、WebGL、动画、彩蛋）
```

单文件职责清晰，无外部构建产物，可直接托管在 GitHub Pages / Vercel / Netlify 等静态服务。

---

## 🚀 部署

```bash
# 克隆
git clone https://github.com/curious-guoguo/curious-guoguo.github.io.git
cd curious-guoguo.github.io

# 本地预览（任选）
python3 -m http.server 8000
# 或
npx serve .
```

直接打开 `index.html` 也可运行，但 `navigator.clipboard` 依赖安全上下文，建议用本地服务器（`http://localhost`）体验完整功能。

---

## 🌐 浏览器兼容性

| 特性 | 兼容性说明 |
|---|---|
| WebGL 背景 | 不支持时自动降级为纯深色背景，其余功能正常 |
| Web Audio | 现代浏览器均支持；需用户交互后才能发声（浏览器策略） |
| `backdrop-filter` | iOS Safari / Chrome / Edge 支持；Firefox 需 103+ |
| `navigator.clipboard` | 需 HTTPS 或 localhost，否则回退到 `execCommand` |

---

## ⌨️ 无障碍

- 侧边栏、底栏、抽屉菜单均支持 Tab 导航与焦点环
- `role="button"` 卡片支持 Enter / Space 触发
- 全屏报错层可点击关闭，或 8 秒后自动消失
- 尊重 `prefers-reduced-motion`，减少动效时自动降级过渡

---

## 🙏 鸣谢

- [saobby](https://www.saobby.com/) — 访问统计与投票服务
- [giscus](https://giscus.app/) — 留言板
- 各外链平台的图标与 favicon 归属于各自站点

---

## 📜 License

个人项目，代码可参考，请勿直接复制站点内容与个人链接。

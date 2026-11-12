/* =========================================================
   i18n 数据 + 主题状态 + giscus 同步
   UI 交互（设置胶囊 / 移动端设置面板）已移至 main.js
   ========================================================= */

function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

const i18n = {
  zh: {
    nav_home: '首页', nav_guestbook: '留言板', nav_vote: '打榜', nav_about: '关于我', nav_arcade: '游乐场', nav_tools: '百宝箱', nav_links: '友情链接', nav_secret: '隐藏关', nav_more: '更多',
    lang_label: '语言',
    settings_label: '设置', settings_lang: '语言', settings_theme: '外观', settings_back: '返回',
    theme_auto: '跟随系统', theme_light: '浅色', theme_dark: '深色',
    title_vote: '打榜投票',
    hero_sub: '写代码 · 打游戏 · 折腾各种东西',
    home_visit_1: '这里一共有', home_visit_2: '个 ID 访问，总共', home_visit_3: '次',
    home_thanks: '感谢 <a href="https://www.saobby.com/" target="_blank" rel="noopener">saobby</a> 提供访问统计与投票服务',
    alt_visit_id: '访问 ID 数', alt_visit_count: '访问次数',
    vote_1: '蒟蒻', vote_2: '老六', vote_3: '大佬六', vote_btn: '去投票 →',
    desc_bili: '我的B站个人空间', desc_github: '我的开源代码仓库', desc_ccw: '共创世界个人主页', desc_luogu: '洛谷编程平台个人主页',
    card_ccw: '共创世界', card_luogu: '洛谷', card_email: '联系邮箱',
    card_kxyjs: 'kxyjs', desc_kxyjs: '开心每一天',
    card_suziyue: 'suziyue1227', desc_suziyue: '终端风个人主页',
    card_hullqin: 'HullQin 桌游', desc_hullqin: '聚会不带道具，点开即玩',
    hullqin_modal_title: '桌游合集', hullqin_modal_close: '关闭',
    card_dino: 'chrome小恐龙', desc_dino: '点击复制链接后用 Chrome 打开',
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
    trap_hint: '长按 3 秒解锁隐藏彩蛋',
    f_new_year: '🎆 元旦快乐', f_april_fool: '🤡 愚人节快乐', f_easter: '🐰 复活节', f_mother: '🌷 母亲节', f_father: '👔 父亲节', f_halloween_eve: '🎃 万圣节前夜', f_halloween: '🎃 万圣节', f_thanksgiving: '🦃 感恩节', f_xmas_eve: '🎄 平安夜', f_xmas: '🎄 圣诞节',
    d_new_year: '新年烟花，点亮夜空', d_april_fool: '你永远也抓不到我！', d_easter: '寻找属于你的彩蛋', d_mother: '妈妈辛苦了', d_father: '爸爸辛苦了', d_halloween_eve: '百鬼夜行，群魔乱舞', d_halloween: '不给糖就捣蛋', d_thanksgiving: '感恩节大餐', d_xmas_eve: '圣诞前夕，雪花飘落', d_xmas: 'Merry Christmas!',
    toast_eggs_unlocked: '发现全部隐藏彩蛋！',
    toast_copied: '已复制链接：{url}',
    toast_copy_failed: '复制失败，请手动复制',
    toast_popup_blocked: '请允许弹窗以打开链接',
    err_blue: '你的电脑遇到问题，需要重新启动。',
    err_mac: '系统无响应，正在重启...',
    err_404: '网页已崩溃，数据丢失。'
  },
  'zh-TW': {
    nav_home: '首頁', nav_guestbook: '留言板', nav_vote: '打榜', nav_about: '關於我', nav_arcade: '遊樂場', nav_tools: '百寶箱', nav_links: '友情連結', nav_secret: '隱藏關', nav_more: '更多',
    lang_label: '語言',
    settings_label: '設定', settings_lang: '語言', settings_theme: '外觀', settings_back: '返回',
    theme_auto: '跟隨系統', theme_light: '淺色', theme_dark: '深色',
    title_vote: '打榜投票',
    hero_sub: '寫代碼 · 打遊戲 · 折騰各種東西',
    home_visit_1: '這裡一共有', home_visit_2: '個 ID 訪問，總共', home_visit_3: '次',
    home_thanks: '感謝 <a href="https://www.saobby.com/" target="_blank" rel="noopener">saobby</a> 提供訪問統計與投票服務',
    alt_visit_id: '訪問 ID 數', alt_visit_count: '訪問次數',
    vote_1: '蒟蒻', vote_2: '老六', vote_3: '大佬六', vote_btn: '去投票 →',
    desc_bili: '我的B站個人空間', desc_github: '我的開源代碼倉庫', desc_ccw: '共創世界個人主頁', desc_luogu: '洛谷編程平台個人主頁',
    card_ccw: '共創世界', card_luogu: '洛谷', card_email: '聯繫郵箱',
    card_kxyjs: 'kxyjs', desc_kxyjs: '開心每一天',
    card_suziyue: 'suziyue1227', desc_suziyue: '終端風個人主頁',
    card_hullqin: 'HullQin Board Games', desc_hullqin: 'Party games, no props needed',
    hullqin_modal_title: 'Board Games', hullqin_modal_close: 'Close',
    card_dino: 'chrome小恐龍', desc_dino: '點擊複製鏈接後用 Chrome 打開',
    card_td1: '塔防（1）', desc_td1: '經典塔防小遊戲',
    card_td2: '塔防（2）', desc_td2: 'Yorg 塔防在線遊玩',
    card_td3: '塔防（3）', desc_td3: 'Yorg3 塔防遊戲',
    card_florr: '花朵', desc_florr: 'Florr.io 花朵生存遊戲',
    desc_poki: '在線免費小遊戲平台', desc_slay: '多人在線射擊 IO 遊戲',
    card_tool1: '綜合工具箱', desc_tool1: 'tool.lu 在線工具集',
    card_tool2: '信奧工具', desc_tool2: 'ssoier 學習與工具站',
    card_tool3: '建站工具', desc_tool3: 'saobby 建站服務平台',
    card_tool4: '雲端剪貼板', desc_tool4: 'note.ms 在線文本分享',
    card_tool5: '輕鬆傳', desc_tool5: '跨設備文件極速傳輸',
    desc_tool6: '深度求索對話大模型',
    card_trap: '千萬別點',
    trap_hint: '長按 3 秒解鎖隱藏彩蛋',
    f_new_year: '🎆 元旦快樂', f_april_fool: '🤡 愚人節快樂', f_easter: '🐰 復活節', f_mother: '🌷 母親節', f_father: '👔 父親節', f_halloween_eve: '🎃 萬聖節前夜', f_halloween: '🎃 萬聖節', f_thanksgiving: '🦃 感恩節', f_xmas_eve: '🎄 平安夜', f_xmas: '🎄 聖誕節',
    d_new_year: '新年煙花，點亮夜空', d_april_fool: '你永遠也抓不到我！', d_easter: '尋找屬於你的彩蛋', d_mother: '媽媽辛苦了', d_father: '爸爸辛苦了', d_halloween_eve: '百鬼夜行，群魔亂舞', d_halloween: '不給糖就搗蛋', d_thanksgiving: '感恩節大餐', d_xmas_eve: '聖誕前夕，雪花飄落', d_xmas: 'Merry Christmas!',
    toast_eggs_unlocked: '發現全部隱藏彩蛋！',
    toast_copied: '已複製鏈接：{url}',
    toast_copy_failed: '複製失敗，請手動複製',
    toast_popup_blocked: '請允許彈窗以打開鏈接',
    err_blue: '你的電腦遇到問題，需要重新啟動。',
    err_mac: '系統無響應，正在重啟...',
    err_404: '網頁已崩潰，數據丟失。'
  },
  en: {
    nav_home: 'Home', nav_guestbook: 'Guestbook', nav_vote: 'Vote', nav_about: 'About', nav_arcade: 'Arcade', nav_tools: 'Toolbox', nav_links: 'Links', nav_secret: 'Secret', nav_more: 'More',
    lang_label: 'Language',
    settings_label: 'Settings', settings_lang: 'Language', settings_theme: 'Appearance', settings_back: 'Back',
    theme_auto: 'System', theme_light: 'Light', theme_dark: 'Dark',
    title_vote: 'Vote',
    hero_sub: 'Coding · Gaming · Tinkering with everything',
    home_visit_1: 'Total', home_visit_2: 'unique visitor IDs,', home_visit_3: 'views',
    home_thanks: 'Powered by <a href="https://www.saobby.com/" target="_blank" rel="noopener">saobby</a>',
    alt_visit_id: 'Unique visitor IDs', alt_visit_count: 'Total views',
    vote_1: 'Novice', vote_2: 'Veteran', vote_3: 'Master', vote_btn: 'Vote →',
    desc_bili: 'My Bilibili Space', desc_github: 'My Open Source Repos', desc_ccw: 'CCW Profile', desc_luogu: 'Luogu Profile',
    card_ccw: 'CCW', card_luogu: 'Luogu', card_email: 'Email',
    card_kxyjs: 'kxyjs', desc_kxyjs: 'Happy every day',
    card_suziyue: 'suziyue1227', desc_suziyue: 'Terminal-style personal site',
    card_hullqin: 'HullQin Board Games', desc_hullqin: 'Party games, no props needed',
    hullqin_modal_title: 'Board Games', hullqin_modal_close: 'Close',
    card_dino: 'Chrome Dino', desc_dino: 'Copy link and open in Chrome',
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
    trap_hint: 'Press and hold for 3 seconds to unlock hidden eggs',
    f_new_year: '🎆 Happy New Year', f_april_fool: '🤡 April Fool', f_easter: '🐰 Easter', f_mother: '🌷 Mother\'s Day', f_father: '👔 Father\'s Day', f_halloween_eve: '🎃 Halloween Eve', f_halloween: '🎃 Halloween', f_thanksgiving: '🦃 Thanksgiving', f_xmas_eve: '🎄 Christmas Eve', f_xmas: '🎄 Christmas',
    d_new_year: 'Fireworks lighting up the night', d_april_fool: 'You can never catch me!', d_easter: 'Find your easter egg', d_mother: 'Happy Mother\'s Day', d_father: 'Happy Father\'s Day', d_halloween_eve: 'Spooky night', d_halloween: 'Trick or Treat', d_thanksgiving: 'Thanksgiving feast', d_xmas_eve: 'Snowflakes falling', d_xmas: 'Merry Christmas!',
    toast_eggs_unlocked: 'Hidden eggs unlocked!',
    toast_copied: 'Link copied: {url}',
    toast_copy_failed: 'Copy failed, please copy manually',
    toast_popup_blocked: 'Please allow popups to open the link',
    err_blue: 'Your PC ran into a problem and needs to restart.',
    err_mac: 'System not responding, restarting...',
    err_404: 'Page crashed, data lost.'
  },
  ja: {
    nav_home: 'ホーム', nav_guestbook: '掲示板', nav_vote: '投票', nav_about: 'プロフィール', nav_arcade: 'ゲーム', nav_tools: 'ツール', nav_links: 'リンク', nav_secret: '隠しエリア', nav_more: 'もっと',
    lang_label: '言語',
    settings_label: '設定', settings_lang: '言語', settings_theme: '外観', settings_back: '戻る',
    theme_auto: 'システム', theme_light: 'ライト', theme_dark: 'ダーク',
    title_vote: '投票',
    hero_sub: 'コードを書く · ゲームをする · いろいろいじる',
    home_visit_1: 'これまでに', home_visit_2: '個の ID から、合計', home_visit_3: '回',
    home_thanks: '<a href="https://www.saobby.com/" target="_blank" rel="noopener">saobby</a> によるアクセス統計と投票サービス',
    alt_visit_id: '訪問 ID 数', alt_visit_count: '訪問回数',
    vote_1: '初心者', vote_2: 'ベテラン', vote_3: '達人', vote_btn: '投票する →',
    desc_bili: 'Bilibili のマイページ', desc_github: 'オープンソースリポジトリ', desc_ccw: 'CCW プロフィール', desc_luogu: '洛谷プロフィール',
    card_ccw: 'CCW', card_luogu: '洛谷', card_email: 'メール',
    card_kxyjs: 'kxyjs', desc_kxyjs: '毎日楽しく',
    card_suziyue: 'suziyue1227', desc_suziyue: 'ターミナル風個人サイト',
    card_hullqin: 'HullQin Board Games', desc_hullqin: 'Party games, no props needed',
    hullqin_modal_title: 'Board Games', hullqin_modal_close: 'Close',
    card_dino: 'Chrome 恐竜', desc_dino: 'リンクをコピーして Chrome で開く',
    card_td1: 'タワーディフェンス (1)', desc_td1: 'クラシックなミニゲーム',
    card_td2: 'タワーディフェンス (2)', desc_td2: 'Yorg タワーディフェンス',
    card_td3: 'タワーディフェンス (3)', desc_td3: 'Yorg3 タワーディフェンス',
    card_florr: 'Florr', desc_florr: 'Florr.io サバイバルゲーム',
    desc_poki: '無料オンラインゲーム', desc_slay: 'マルチプレイヤー IO シューター',
    card_tool1: 'ツールボックス', desc_tool1: 'tool.lu オンラインツール',
    card_tool2: 'OI ツール', desc_tool2: 'ssoier 学習・ツールサイト',
    card_tool3: 'サイトビルダー', desc_tool3: 'saobby サイト作成サービス',
    card_tool4: 'クラウドクリップボード', desc_tool4: 'note.ms オンラインテキスト',
    card_tool5: 'Easy Chuan', desc_tool5: 'デバイス間のファイル転送',
    desc_tool6: 'DeepSeek チャットモデル',
    card_trap: '絶対にクリックしないで',
    trap_hint: '3 秒間長押しで隠し要素を解除',
    f_new_year: '🎆 新年おめでとう', f_april_fool: '🤡 エイプリルフール', f_easter: '🐰 イースター', f_mother: '🌷 母の日', f_father: '👔 父の日', f_halloween_eve: '🎃 ハロウィン前夜', f_halloween: '🎃 ハロウィン', f_thanksgiving: '🦃 感謝祭', f_xmas_eve: '🎄 クリスマスイブ', f_xmas: '🎄 クリスマス',
    d_new_year: '新年の花火、夜空を彩る', d_april_fool: '絶対につかまらないぞ！', d_easter: 'あなたのエッグを探そう', d_mother: 'お母さんいつもありがとう', d_father: 'お父さんいつもありがとう', d_halloween_eve: '百鬼夜行', d_halloween: 'トリック・オア・トリート', d_thanksgiving: '感謝祭のごちそう', d_xmas_eve: '雪が舞い散る', d_xmas: 'メリークリスマス！',
    toast_eggs_unlocked: '隠し要素をすべて解除しました！',
    toast_copied: 'リンクをコピーしました：{url}',
    toast_copy_failed: 'コピーに失敗しました。手動でコピーしてください',
    toast_popup_blocked: 'リンクを開くにはポップアップを許可してください',
    err_blue: 'PC に問題が発生したため、再起動が必要です。',
    err_mac: 'システムが応答していません。再起動中...',
    err_404: 'ページがクラッシュしました。データが失われました。'
  },
  ko: {
    nav_home: '홈', nav_guestbook: '방명록', nav_vote: '투표', nav_about: '소개', nav_arcade: '게임', nav_tools: '도구함', nav_links: '링크', nav_secret: '비밀 구역', nav_more: '더보기',
    lang_label: '언어',
    settings_label: '설정', settings_lang: '언어', settings_theme: '테마', settings_back: '뒤로',
    theme_auto: '시스템', theme_light: '라이트', theme_dark: '다크',
    title_vote: '투표',
    hero_sub: '코딩 · 게임 · 이것저것 만지기',
    home_visit_1: '지금까지', home_visit_2: '개의 ID가 방문, 총', home_visit_3: '회',
    home_thanks: '<a href="https://www.saobby.com/" target="_blank" rel="noopener">saobby</a> 제공 방문 통계 및 투표 서비스',
    alt_visit_id: '방문 ID 수', alt_visit_count: '방문 횟수',
    vote_1: '초보', vote_2: '고수', vote_3: '달인', vote_btn: '투표하기 →',
    desc_bili: 'Bilibili 개인 공간', desc_github: '오픈소스 저장소', desc_ccw: 'CCW 프로필', desc_luogu: '루오구 프로필',
    card_ccw: 'CCW', card_luogu: '루오구', card_email: '이메일',
    card_kxyjs: 'kxyjs', desc_kxyjs: '매일 행복하세요',
    card_suziyue: 'suziyue1227', desc_suziyue: '터미널 스타일 개인 사이트',
    card_hullqin: 'HullQin Board Games', desc_hullqin: 'Party games, no props needed',
    hullqin_modal_title: 'Board Games', hullqin_modal_close: 'Close',
    card_dino: 'Chrome 공룡', desc_dino: '링크 복사 후 Chrome에서 열기',
    card_td1: '타워 디펜스 (1)', desc_td1: '클래식 미니게임',
    card_td2: '타워 디펜스 (2)', desc_td2: 'Yorg 타워 디펜스',
    card_td3: '타워 디펜스 (3)', desc_td3: 'Yorg3 타워 디펜스',
    card_florr: 'Florr', desc_florr: 'Florr.io 생존 게임',
    desc_poki: '무료 온라인 게임', desc_slay: '멀티플레이어 IO 슈터',
    card_tool1: '도구함', desc_tool1: 'tool.lu 온라인 도구',
    card_tool2: 'OI 도구', desc_tool2: 'ssoier 학습 및 도구 사이트',
    card_tool3: '사이트 빌더', desc_tool3: 'saobby 사이트 제작 서비스',
    card_tool4: '클라우드 클립보드', desc_tool4: 'note.ms 온라인 텍스트',
    card_tool5: 'Easy Chuan', desc_tool5: '기기 간 파일 전송',
    desc_tool6: 'DeepSeek 채팅 모델',
    card_trap: '절대 누르지 마세요',
    trap_hint: '3초간 길게 눌러 숨겨진 요소 해제',
    f_new_year: '🎆 새해 복 많이 받으세요', f_april_fool: '🤡 만우절', f_easter: '🐰 부활절', f_mother: '🌷 어머니의 날', f_father: '👔 아버지의 날', f_halloween_eve: '🎃 할로윈 전야', f_halloween: '🎃 할로윈', f_thanksgiving: '🦃 추수감사절', f_xmas_eve: '🎄 크리스마스 이브', f_xmas: '🎄 크리스마스',
    d_new_year: '새해 불꽃이 밤하늘을 밝힙니다', d_april_fool: '절대 잡을 수 없어!', d_easter: '나만의 에그를 찾아보세요', d_mother: '어머니 수고하셨습니다', d_father: '아버지 수고하셨습니다', d_halloween_eve: '백귀야행', d_halloween: '과자 아니면 장난!', d_thanksgiving: '추수감사절 만찬', d_xmas_eve: '눈송이가 내립니다', d_xmas: '메리 크리스마스!',
    toast_eggs_unlocked: '모든 숨겨진 요소를 해제했습니다!',
    toast_copied: '링크 복사됨: {url}',
    toast_copy_failed: '복사 실패, 수동으로 복사해 주세요',
    toast_popup_blocked: '링크를 열려면 팝업을 허용해 주세요',
    err_blue: 'PC에 문제가 발생하여 다시 시작해야 합니다.',
    err_mac: '시스템이 응답하지 않습니다. 재시작 중...',
    err_404: '페이지가 충돌했습니다. 데이터가 손실되었습니다.'
  },
  fr: {
    nav_home: 'Accueil', nav_guestbook: 'Livre d\'or', nav_vote: 'Vote', nav_about: 'À propos', nav_arcade: 'Arcade', nav_tools: 'Boîte à outils', nav_links: 'Liens', nav_secret: 'Secret', nav_more: 'Plus',
    lang_label: 'Langue',
    settings_label: 'Paramètres', settings_lang: 'Langue', settings_theme: 'Apparence', settings_back: 'Retour',
    theme_auto: 'Système', theme_light: 'Clair', theme_dark: 'Sombre',
    title_vote: 'Vote',
    hero_sub: 'Coder · Jouer · Bricoler en tout genre',
    home_visit_1: 'Au total,', home_visit_2: 'ID uniques et', home_visit_3: 'vues',
    home_thanks: 'Propulsé par <a href="https://www.saobby.com/" target="_blank" rel="noopener">saobby</a>',
    alt_visit_id: 'ID de visiteurs uniques', alt_visit_count: 'Vues totales',
    vote_1: 'Novice', vote_2: 'Vétéran', vote_3: 'Maître', vote_btn: 'Voter →',
    desc_bili: 'Mon espace Bilibili', desc_github: 'Mes dépôts open source', desc_ccw: 'Profil CCW', desc_luogu: 'Profil Luogu',
    card_ccw: 'CCW', card_luogu: 'Luogu', card_email: 'E-mail',
    card_kxyjs: 'kxyjs', desc_kxyjs: 'Joyeux chaque jour',
    card_suziyue: 'suziyue1227', desc_suziyue: 'Site personnel style terminal',
    card_hullqin: 'HullQin Board Games', desc_hullqin: 'Party games, no props needed',
    hullqin_modal_title: 'Board Games', hullqin_modal_close: 'Close',
    card_dino: 'Chrome Dino', desc_dino: 'Copiez le lien et ouvrez-le dans Chrome',
    card_td1: 'Tower Defense (1)', desc_td1: 'Mini-jeu classique',
    card_td2: 'Tower Defense (2)', desc_td2: 'Yorg Tower Defense',
    card_td3: 'Tower Defense (3)', desc_td3: 'Yorg3 Tower Defense',
    card_florr: 'Florr', desc_florr: 'Jeu de survie Florr.io',
    desc_poki: 'Jeux en ligne gratuits', desc_slay: 'Shooter IO multijoueur',
    card_tool1: 'Boîte à outils', desc_tool1: 'Outils en ligne tool.lu',
    card_tool2: 'Outils OI', desc_tool2: 'Site d\'apprentissage ssoier',
    card_tool3: 'Créateur de site', desc_tool3: 'Service de création saobby',
    card_tool4: 'Presse-papiers cloud', desc_tool4: 'note.ms texte en ligne',
    card_tool5: 'Easy Chuan', desc_tool5: 'Transfert de fichiers entre appareils',
    desc_tool6: 'Modèle de chat DeepSeek',
    card_trap: 'NE PAS CLIQUER',
    trap_hint: 'Maintenez 3 secondes pour débloquer les œufs cachés',
    f_new_year: '🎆 Bonne année', f_april_fool: '🤡 Poisson d\'avril', f_easter: '🐰 Pâques', f_mother: '🌷 Fête des mères', f_father: '👔 Fête des pères', f_halloween_eve: '🎃 Veille d\'Halloween', f_halloween: '🎃 Halloween', f_thanksgiving: '🦃 Thanksgiving', f_xmas_eve: '🎄 Réveillon de Noël', f_xmas: '🎄 Noël',
    d_new_year: 'Feux d\'artifice illuminant la nuit', d_april_fool: 'Tu ne m\'attraperas jamais !', d_easter: 'Trouvez votre œuf de Pâques', d_mother: 'Bonne fête maman', d_father: 'Bonne fête papa', d_halloween_eve: 'Nuit des monstres', d_halloween: 'Des bonbons ou un sort', d_thanksgiving: 'Festin de Thanksgiving', d_xmas_eve: 'Flocons de neige', d_xmas: 'Joyeux Noël !',
    toast_eggs_unlocked: 'Tous les œufs cachés sont débloqués !',
    toast_copied: 'Lien copié : {url}',
    toast_copy_failed: 'Échec de la copie, copiez manuellement',
    toast_popup_blocked: 'Autorisez les pop-ups pour ouvrir le lien',
    err_blue: 'Votre PC a rencontré un problème et doit redémarrer.',
    err_mac: 'Le système ne répond pas, redémarrage...',
    err_404: 'La page a planté, données perdues.'
  }
};

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

function buildLangButtonsHTML() {
  return LANGS.map(l =>
    `<button type="button" data-lang="${l.code}" aria-pressed="false">${l.label}</button>`
  ).join('');
}

function buildThemeButtonsHTML() {
  return THEME_PREFS.map(p =>
    `<button type="button" data-theme="${p.code}" aria-pressed="false" data-i18n="${p.key}">${i18n[currentLang][p.key]}</button>`
  ).join('');
}

window.addEventListener('error', () => {
  document.documentElement.classList.remove('lang-en-pending');
});

let storedLang = safeGet('site_lang');
let currentLang = (storedLang && i18n[storedLang]) ? storedLang : 'zh';

const PAGE_TITLE_KEYS = ['nav_home', 'nav_guestbook', 'title_vote', 'nav_about', 'nav_arcade', 'nav_tools', 'nav_links', 'nav_secret'];

function updateDocumentTitle() {
  const safeIdx = (typeof idx === 'number' && idx >= 0 && idx < PAGE_TITLE_KEYS.length) ? idx : 0;
  const key = PAGE_TITLE_KEYS[safeIdx] || 'nav_home';
  const label = (i18n[currentLang] && i18n[currentLang][key]) || i18n[currentLang].nav_home;
  document.title = `curious-guoguo | ${label}`;
}

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

const THEME_MEDIA = window.matchMedia('(prefers-color-scheme: dark)');
let systemIsDark = THEME_MEDIA.matches;

let storedTheme = safeGet('site_theme');
let themePreference = (storedTheme === 'light' || storedTheme === 'dark') ? storedTheme : 'dark';

function resolveTheme(pref) {
  if (pref === 'light') return 'light';
  if (pref === 'dark') return 'dark';
  return systemIsDark ? 'dark' : 'light';
}

function updateThemeButtons(pref) {
  document.querySelectorAll('button[data-theme]').forEach(btn => {
    btn.setAttribute('aria-pressed', btn.dataset.theme === pref ? 'true' : 'false');
  });
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

function applyLanguage(lang) {
  if (!i18n[lang]) lang = 'zh';
  currentLang = lang;
  safeSet('site_lang', lang);

  document.documentElement.lang = LANG_META[lang] ? LANG_META[lang].html : 'zh-CN';

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18n[lang][key]) el.textContent = i18n[lang][key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (i18n[lang][key]) el.innerHTML = i18n[lang][key];
  });

  document.querySelectorAll('[data-i18n-alt]').forEach(el => {
    const key = el.getAttribute('data-i18n-alt');
    if (i18n[lang][key]) el.alt = i18n[lang][key];
  });

  const trap = document.getElementById('trapCard');
  if (trap) trap.setAttribute('aria-label', i18n[lang].trap_hint);

  const moreBtn = document.getElementById('mobileMoreBtn');
  if (moreBtn) moreBtn.setAttribute('aria-label', i18n[lang].nav_more);

  const settingsMenu = document.getElementById('settingsMenu');
  if (settingsMenu) settingsMenu.setAttribute('aria-label', i18n[lang].settings_label);

  updateLangButtons(lang);

  updateDocumentTitle();
  syncGiscusLang();

  const holder = document.getElementById('festival-cards-holder');
  if (holder) {
    const oldEgg = document.getElementById('card-april_fool');
    const oldEggTransform = oldEgg ? oldEgg.style.transform : '';

    holder.innerHTML = '';

    if (isUnlocked) {
      FESTIVALS.forEach(f => {
        renderFestivalCard(f);
        const card = document.getElementById(`card-${f.id}`);
        if (card && card.style.display === 'none') card.style.display = 'block';
      });
    } else {
      initHolidays();
    }

    if (oldEggTransform) {
      const newEgg = document.getElementById('card-april_fool');
      if (newEgg) newEgg.style.transform = oldEggTransform;
    }

    if (idx === 7) {
      requestAnimationFrame(startEscapeLoop);
      playSprings(idx);
    }
  }

  document.documentElement.classList.remove('lang-en-pending');
}
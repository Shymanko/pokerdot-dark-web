// Leagues & Levels — the loyalty progression system.
//
// МІГРАЦІЯ (вересень 2026): метали → МАСТІ чотириколірної колоди.
//   • 5 ліг-мастей: БУБИ ♦ (сині) → КРЕСТИ ♣ (зелені) → ЧЕРВИ ♥ (червоні)
//     → ПІКИ ♠ (сталеві/чорні) → DOT ● (золота точка, старша за всіх,
//     зі свіченням). Порядок черви↔піки — робоче рішення прототипу
//     (бридж-порядок), помінявся вердикт — поміняти два рядки.
//   • 65 рівнів — карти від 2 до туза, по 13 на лігу. Нагорода рівня
//     подається КАРТОЮ (перевертання), сундуки скасовано. Туз — фінал масті.
//   • Рівень тепер ПУБЛІЧНИЙ: у профілі видно і лігу, і карту.
//   • mult — внутрішній множник виплати сейфа. НІДЕ не показується
//     гравцеві, як і будь-які відсотки повернення.
//   • safeThreshold — поріг відкриття сейфа (серверна настройка),
//     xpRate — коефіцієнт XP за рейк (серверна настройка).
//
// Exposed on window: cmLeague (data + helpers), cmPlayer (current state),
// LeagueFrame (рамка аватара в кольорі масті зі знаком).

// v3 (17.09.2026, правка Вадима): рівні йдуть ПО НОМІНАЛАХ, а всередині
// номіналу — по мастях ♦ → ♣ → ♥ → ♠. Тобто 2♦ 2♣ 2♥ 2♠, 3♦ 3♣ 3♥ 3♠ … A♠,
// і остання, 53-тя карта — туз DOT. min/max нижче — перша й остання карта
// масті в цьому порядку (лишені для сумісності старого коду).
const LEAGUES = [{
  id: "diamonds",
  name: "DIAMONDS",
  ru: "БУБИ",
  suit: "♦",
  min: 1,
  max: 49,
  color: "#3B82F6",
  ink: "#fff",
  mult: 0.90
}, {
  id: "clubs",
  name: "CLUBS",
  ru: "КРЕСТИ",
  suit: "♣",
  min: 2,
  max: 50,
  color: "#2FA84F",
  ink: "#fff",
  mult: 1.00
}, {
  id: "hearts",
  name: "HEARTS",
  ru: "ЧЕРВИ",
  suit: "♥",
  min: 3,
  max: 51,
  color: "#E5484D",
  ink: "#fff",
  mult: 1.05
}, {
  id: "spades",
  name: "SPADES",
  ru: "ПИКИ",
  suit: "♠",
  min: 4,
  max: 52,
  color: "#C8CDD4",
  ink: "#0b0b0d",
  mult: 1.10
},
// v3 (17.09.2026): DOT — одна карта, туз. 4 × 13 + 1 = 53 рівні.
{
  id: "dot",
  name: "DOT",
  ru: "DOT",
  suit: "●",
  min: 53,
  max: 53,
  color: "#D4AA55",
  ink: "#171108",
  mult: 1.15,
  glow: true
}];
const CM_TOTAL = 13;

// Ранги карт усередині ліги: 13 рівнів = 2…10, J, Q, K, A.
const CM_RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

// Prototype: ten is owned, jack is next. Each unlocked rank adds four solid cards.
const cmPlayer = {
  level: 9,
  xp: 1000,
  xpNext: 1000,
  pendingLevel: null,
  // 10 → J: 320 XP remaining
  safeXp: 1000,
  safeThreshold: 1000,
  xpRate: 100,
  rakeCycle: 10.00,
  rakeThreshold: 10 // xpRate: XP за $1 рейку
};
function lgIndexForLevel(lvl) {
  const n = Math.max(1, Math.min(CM_TOTAL, Math.round(lvl) || 1));
  return n >= 12 ? 3 : n >= 10 ? 2 : n >= 6 ? 1 : 3;
}
function lgRankIndexForLevel(lvl) {
  const n = Math.max(1, Math.min(CM_TOTAL, Math.round(lvl) || 1));
  return n >= CM_TOTAL ? 12 : n - 1;
}
// рівень за номіналом і мастю: level("Q", "clubs") = 42
function lgLevelFor(rank, suitId) {
  if (suitId === "dot") return CM_TOTAL;
  return CM_RANKS.indexOf(rank) + 1;
}
function lgForLevel(lvl) {
  return LEAGUES[lgIndexForLevel(lvl)];
}
function lgRankForLevel(lvl) {
  return CM_RANKS[lgRankIndexForLevel(lvl)];
}
// v4 (рішення Вадима 21.09.2026): бонус до базового РБ задано таблицею за номіналом карти.
// 2 — без бонусу · 3 +2 · 4 +6 · 5 +10 · 6 +14 · 7 +18 · 8 +22 · 9 +26 · 10 +30 · J +35 · Q +40 · K +50 · A +60
const CM_RB_BONUS = [0, 2, 6, 10, 14, 18, 22, 26, 30, 35, 40, 50, 60];
function lgRbExtra(lvl) {
  const n = Math.max(1, Math.min(CM_TOTAL, Math.round(lvl) || 1));
  return CM_RB_BONUS[n - 1];
}
// крок = приріст бонусу цієї карти відносно попередньої
function lgRbStep(lvl) {
  const n = Math.max(1, Math.min(CM_TOTAL, Math.round(lvl) || 1));
  return CM_RB_BONUS[n - 1] - (n > 1 ? CM_RB_BONUS[n - 2] : 0);
}
// видимий кешбек: стандартні 10 % × (1 + бонус). Рівень 0 — стандарт без карт.
const CM_RB_BASE = 10;
function lgRbPercent(lvl) {
  const n = Math.max(0, Math.min(CM_TOTAL, Math.round(lvl) || 0));
  if (n === 0) return CM_RB_BASE;
  return Math.round(CM_RB_BASE * (1 + lgRbExtra(n) / 100) * 10) / 10;
}
// v3: нагорода під кожною картою — гравець не знає її до відкриття.
// Детермінована за рівнем, щоб демо було стабільним.
const CM_REWARD_KINDS = [{
  kind: "cash",
  label: "BONUS CASH",
  unit: "$"
}, {
  kind: "tdollar",
  label: "TOURNAMENT DOLLARS",
  unit: "T$"
}, {
  kind: "spin",
  label: "SPIN & WIN TICKETS",
  unit: "×"
}];
// v3 (18.09.2026): під кожною картою завжди дві нагороди на вибір —
// кеш-долари або турнірні долари (+10 %). Вибір гравця зберігається у cmRewardPicks.
window.cmRewardPicks = window.cmRewardPicks || {};
function lgCardReward(lvl, pick) {
  const idx = lgIndexForLevel(lvl),
    ri = lgRankIndexForLevel(lvl),
    rank = lgRankForLevel(lvl);
  const ace = rank === "A",
    legend = !!(window.cmLegends && window.cmLegends[lvl]);
  let cash = 3 + ri * 2 + idx;
  if (ace) cash = cash * 5;
  if (legend) cash = cash * 2;
  if (idx >= 4) cash = 500;
  const tdollar = Math.round(cash * 1.1 * 10) / 10;
  const options = [{
    kind: "cash",
    unit: "C$",
    label: "Cash dollars",
    amount: cash,
    text: "C$" + cash
  }, {
    kind: "tdollar",
    unit: "T$",
    label: "Tournament dollars",
    amount: tdollar,
    text: "T$" + tdollar
  }];
  const kind = pick || window.cmRewardPicks[lvl] || "cash";
  const chosen = options.find(o => o.kind === kind) || options[0];
  return {
    ...chosen,
    options,
    ace,
    legend,
    rbNow: lgRbPercent(lvl - 1),
    rbNext: lgRbPercent(lvl)
  };
}
function lgCardForLevel(lvl) {
  const lg = lgForLevel(lvl);
  return lgRankForLevel(lvl);
}
// застаріле: відсотки кешбеку прибрані з продукту повністю; лишається
// заглушкою, щоб старий код не падав, але НІЩО не має це показувати
function lgCashbackForLevel() {
  return null;
}
// shift a hex toward white (amt>0) or black (amt<0)
function lgShade(hex, amt) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const cl = v => Math.max(0, Math.min(255, v + amt));
  return `rgb(${cl(parseInt(n.slice(0, 2), 16))},${cl(parseInt(n.slice(2, 4), 16))},${cl(parseInt(n.slice(4, 6), 16))})`;
}
window.cmLeague = {
  LEAGUES,
  RANKS: CM_RANKS,
  TOTAL: CM_TOTAL,
  rankIndexForLevel: lgRankIndexForLevel,
  levelFor: lgLevelFor,
  rbPercent: lgRbPercent,
  rbExtra: lgRbExtra,
  rbStep: lgRbStep,
  rbBase: CM_RB_BASE,
  rbBonusTable: CM_RB_BONUS,
  cardReward: lgCardReward,
  indexForLevel: lgIndexForLevel,
  forLevel: lgForLevel,
  rankForLevel: lgRankForLevel,
  cardForLevel: lgCardForLevel,
  cashbackForLevel: lgCashbackForLevel,
  shade: lgShade
};
window.cmPlayer = cmPlayer;
window.cmLegends = {};
window.cmLegendHands = {};
window.cmCollectibles = {};
window.cmSpecials = {};
if (typeof document !== "undefined" && !document.getElementById("cm-kf")) {
  const st = document.createElement("style");
  st.id = "cm-kf";
  st.textContent = "@keyframes cm-dot-glow{0%,100%{box-shadow:0 0 8px #D4AA55aa,0 0 22px #D4AA5555}50%{box-shadow:0 0 14px #D4AA55ee,0 0 36px #D4AA5588}}";
  document.head.appendChild(st);
}

// Shared avatar: unframed photo with one small red rank badge.
function LeagueFrame({
  player = true,
  level = cmPlayer.level,
  size = 36,
  showRank = true,
  children,
  style
}) {
  const badge = Math.max(16, Math.min(24, Math.round(size * .36))),
    rank = lgRankForLevel(level);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flex: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: '50%',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#1a1a1e'
    }
  }, children), showRank && player && /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    "aria-label": `Карта ${rank}`,
    style: {
      position: 'absolute',
      zIndex: 6,
      right: -2,
      bottom: -2,
      width: badge,
      height: badge,
      borderRadius: '50%',
      background: '#D71921',
      color: '#fff',
      boxShadow: '0 0 0 2px #101115',
      display: 'grid',
      placeItems: 'center',
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: rank === 'DOT' ? badge * .34 : badge * .62,
      lineHeight: 1,
      letterSpacing: 0
    }
  }, rank));
}

// ── Playing card of a level ─────────────────────────────────────────────
// Міні-карта номіналу рівня: face=true — лицем (ранг + масть у кольорі
// ліги), face=false — сорочка. Нагорода рівня подається такою картою.
function LevelCard({
  level,
  w = 30,
  face = true,
  highlight = false,
  style
}) {
  const lg = lgForLevel(level);
  const rank = lgRankForLevel(level);
  const h = Math.round(w * 1.4);
  if (!face) {
    return /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: Object.assign({
        display: "inline-flex",
        width: w,
        height: h,
        borderRadius: Math.max(3, w * 0.14),
        boxSizing: "border-box",
        border: "1.5px solid rgba(255,255,255,.28)",
        background: "repeating-linear-gradient(48deg,#26262e 0 4px,#17171c 4px 8px)",
        boxShadow: "0 2px 6px rgba(0,0,0,.5)",
        flex: "none"
      }, style || {})
    });
  }
  return /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: Object.assign({
      position: "relative",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: w,
      height: h,
      borderRadius: Math.max(3, w * 0.14),
      background: "#f4f4f4",
      flex: "none",
      boxShadow: highlight ? `0 0 0 2px ${lg.color}, 0 0 12px ${lg.color}aa` : "0 2px 6px rgba(0,0,0,.5)"
    }, style || {})
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.font,
      fontWeight: 700,
      fontSize: w * 0.44,
      lineHeight: 1,
      color: lg.id === "hearts" || lg.id === "diamonds" ? "#bf1730" : lg.id === "dot" ? "#906a26" : "#171a20"
    }
  }, rank), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: w * (lg.id === "dot" ? 0.3 : 0.4),
      lineHeight: 1.15,
      color: lg.id === "hearts" || lg.id === "diamonds" ? "#bf1730" : lg.id === "dot" ? "#906a26" : "#171a20"
    }
  }, lg.suit));
}
Object.assign(window, {
  LeagueFrame,
  LevelCard
});

// One accumulation cycle drives construction and the claim button.
window.rbCycle = {
  progress(p) {
    return Math.max(0, Math.min(1, (p.rakeCycle || 0) / Math.max(.01, p.rakeThreshold || 10)));
  },
  stage(p) {
    return Math.max(1, Math.floor(this.progress(p) * 13 + 1e-8));
  },
  set(p, fraction) {
    const f = Math.max(0, Math.min(1, fraction));
    p.rakeCycle = f * (p.rakeThreshold || 10);
    p.safeXp = p.xp = Math.round(p.rakeCycle * (p.xpRate || 100));
    p.pendingLevel = null;
  },
  settle(p, claim) {
    if (claim.credited || this.progress(p) < 1) return false;
    claim.credited = true;
    p.rakeCycle = 0;
    return true;
  }
};
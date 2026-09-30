function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Cashback / loyalty explainer — opens from the league badge / safe widget.
//
// МІГРАЦІЯ у масті (вересень 2026):
//   • 5 ліг-мастей, 65 рівнів-карт (по 13 на лігу, 2…A). Нагорода рівня
//     подається КАРТОЮ — гравець перевертає карту (сундуки скасовано).
//     Туз — фінал масті з головною нагородою.
//   • Reward Path — окрема вертикальна мапа 65 рівнів у п’яти мастях;
//     поточний XP заповнює шлях від карти до наступної карти.
//   • Сейф мастевий, апгрейдиться з лігою. Відкриття за ПОРОГОМ накопичення
//     (1 000 XP, серверна настройка), а не за розкладом. Надлишок понад
//     поріг НЕ згорає — на сейфі шкала і значення переповнення.
//   • Внутрішній множник виплати за лігою (×0.9…×1.15) гравцеві не
//     показується ніде і ніяк; назовні різниця лише якісна.
//   • Рівень тепер публічний: видно і лігу, і карту.
//   • Відсотки кешбеку (25–70%) прибрані з UI повністю.

const MONO_R = UI.font;
const SANS_R = UI.fontUI;
if (!document.getElementById("rb-readable")) {
  const style = document.createElement("style");
  style.id = "rb-readable";
  style.textContent = ".rb-screen,.rb-screen *{box-sizing:border-box}.rb-screen button:focus-visible,.rb-screen canvas:focus-visible{outline:2px solid #fff;outline-offset:3px}.rb-screen button{touch-action:manipulation}.rb-screen button:disabled{cursor:default}.rb-screen button:not(:disabled){-webkit-tap-highlight-color:transparent}";
  document.head.appendChild(style);
}

// Лічильник, що «набігає» до суми (раніше викликався, але не був визначений).
function useCountUp(target, run, ms = 900) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => {
    if (!run) {
      setV(0);
      return;
    }
    let raf,
      t0 = performance.now();
    const tick = t => {
      const k = Math.min(1, (t - t0) / ms),
        e = 1 - Math.pow(1 - k, 3);
      setV(target * e);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return v;
}
function RbSectionTitle({
  children,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      marginTop: 26,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 14,
      borderRadius: 2,
      background: accent,
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_R,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, children));
}

// Generated vault render (Higgsfield) — turntable strip stepped in CSS; the
// open beat is a one-shot 48-frame strip. Сейф апгрейдиться з лігою: колір
// підкладки і свічення беруться з масті (арт лишається спільний до заміни).
const RB_SHEET = "assets/crates/bronze-spin-sheet.webp";
const RB_FRAMES = 60;
const RB_OPEN_SHEET = "assets/crates/safe-open-sheet.png";
const RB_OPEN_FRAMES = 48;
if (typeof document !== "undefined" && !document.getElementById("rb-kf")) {
  const st = document.createElement("style");
  st.id = "rb-kf";
  st.textContent = "@keyframes rb-spin{from{transform:translate(0,10%)}to{transform:translate(-98.3333%,10%)}}@keyframes rb-open{from{transform:translateX(0)}to{transform:translateX(-97.9167%)}}@keyframes rb-flip{from{transform:rotateY(180deg)}to{transform:rotateY(0)}}";
  document.head.appendChild(st);
}
function RbCrateImg({
  id,
  size = 34,
  color,
  glow = false,
  dim = false,
  radius = 8,
  spin = false
}) {
  const src = (window.CRATE_IMG || {})[id] || "assets/crates/" + id + ".png";
  const mask = "linear-gradient(180deg, #000 0 56%, rgba(0,0,0,.25) 64%, transparent 71%)";
  if (spin) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        width: size,
        height: size,
        flex: "none",
        overflow: "hidden",
        display: "block",
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: RB_SHEET,
      alt: "",
      style: {
        height: "100%",
        width: `${RB_FRAMES * 100}%`,
        display: "block",
        animation: `rb-spin 4.2s steps(${RB_FRAMES - 1}) infinite alternate`
      }
    }));
  }
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: size,
      height: size,
      flex: "none",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block",
      mixBlendMode: "screen",
      transform: "scale(1.28) translateY(9%)",
      maskImage: mask,
      WebkitMaskImage: mask
    }
  }));
}
if (!document.getElementById('rb-story-style')) {
  const st = document.createElement('style');
  st.id = 'rb-story-style';
  st.textContent = `
    @keyframes rb-story-enter{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
    @keyframes rb-portrait-enter{from{opacity:0;transform:scale(1.08) translateX(18px)}to{opacity:1;transform:scale(1) translateX(0)}}
    @keyframes rb-story-card-enter{from{opacity:0;transform:translate(-65px,75px) rotate(-12deg)}to{opacity:1;transform:translate(0,0) rotate(0)}}
    .rb-story{position:absolute;inset:0;z-index:92;display:flex;flex-direction:column;background:#101216;overflow:hidden;animation:rb-story-enter .5s cubic-bezier(.2,.8,.2,1) both}
    .rb-story-scroll{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding-bottom:max(32px,env(safe-area-inset-bottom))}
    .rb-story-top{position:relative;flex:none;z-index:5;isolation:isolate;padding:61px 18px 14px 24px;display:flex;justify-content:space-between;align-items:center;font-size:14px;color:#e9d4a4;letter-spacing:.05em}
    .rb-story-top::before{content:"";position:absolute;inset:-61px -24px -18px;z-index:-1;pointer-events:none;background:linear-gradient(#101216 65%,#101216f5 86%,transparent)}
    .rb-story-close{width:46px;height:46px;border:1px solid #ffffff25;border-radius:50%;background:#181c23cf;color:white;font-size:26px;backdrop-filter:blur(10px);cursor:pointer}
    .rb-story-hero{height:360px;position:relative;background:radial-gradient(ellipse at 80% 42%,#ccb67d22,transparent 67%)}
    .rb-story-portrait{position:absolute;right:-8px;top:0;width:282px;height:355px;animation:rb-portrait-enter 1.1s .12s cubic-bezier(.16,1,.3,1) both;mask-image:linear-gradient(90deg,transparent,#000 24%),linear-gradient(transparent 0%,#000 9% 56%,transparent 100%);mask-composite:intersect;-webkit-mask-image:linear-gradient(90deg,transparent,#000 24%),linear-gradient(transparent 0%,#000 9% 56%,transparent 100%);-webkit-mask-composite:source-in}
    .rb-story-portrait img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.06);opacity:.92}
    .rb-story-year{position:absolute;left:22px;top:14px;font:700 74px ${MONO_R};line-height:1;color:#e5cb91;letter-spacing:-.055em;z-index:1;animation:rb-story-enter .8s .15s both}
    .rb-story-edition{position:absolute;top:87px;left:25px;font:600 12px ${SANS_R};line-height:1.5;letter-spacing:.13em;color:#c2b18a;width:100px;z-index:1}
    .rb-story-card{position:absolute;left:-31px;top:111px;width:250px;height:275px;z-index:2;filter:drop-shadow(0 16px 17px #0008);animation:rb-story-card-enter 1.1s .12s cubic-bezier(.16,1,.3,1) both}
    .rb-story-copy{position:relative;padding:0 26px;z-index:3;animation:rb-story-enter .8s .28s both}
    .rb-story-title{font:700 13px ${MONO_R};letter-spacing:.16em;color:#cbb77f;margin:1px 0 7px}
    .rb-story-name{text-transform:none!important;letter-spacing:0!important;font:50px/1.16 PokerDotSignature,cursive;color:#f7e4b6;margin:0}
    .rb-story-hand{display:flex;align-items:center;gap:17px;padding:19px 0 17px;margin-top:15px;border-top:1px solid #d5bf862e;border-bottom:1px solid #d5bf862e}
    .rb-story-hand-cards{font:700 27px ${MONO_R};white-space:nowrap;color:#f4e6c7}
    .rb-story-copy p{font:17px/1.65 ${SANS_R};color:#d8dee7;margin:20px 0}
    .rb-story-source{font-size:13px;color:#d3bd8d;text-decoration:none;display:flex;align-items:center;gap:8px;min-height:44px}
    .rb-story-credit{color:#8f9aa9;font:12px/1.6 ${SANS_R};padding-top:12px;margin-top:12px;border-top:1px solid #ffffff10}
    .rb-story-credit a{color:inherit;text-underline-offset:3px}
    .rb-hand{scroll-margin-top:135px;margin:30px -4px 18px;--hand-gold:#e7cf95;color:#edf1f5}
    .rb-hand-heading{display:flex;align-items:center;justify-content:space-between;margin:0 0 21px}
    .rb-hand-eyebrow{font:600 12px ${SANS_R};letter-spacing:.09em;color:#c7b98f}
    .rb-hand-heading h3{font:600 26px/1.2 ${MONO_R};margin:7px 0 0;letter-spacing:-.025em}
    .rb-hand-number{font:600 22px ${MONO_R};color:#dac999}.rb-hand-number span{font-size:13px;color:#62707d}
    .rb-hand-table{position:relative;isolation:isolate;padding:0 0 17px}
    .rb-hand-table::before{content:'';position:absolute;inset:46px -45px 50px;z-index:-1;border-radius:50%;border:1px solid #c5ad7040;background:radial-gradient(ellipse,#39544743,#17242220 65%,transparent);box-shadow:0 0 0 8px #c5ad7004,inset 0 0 36px #89b58d08}
    .rb-hand-players{display:grid;grid-template-columns:1fr 1fr;gap:32px}
    .rb-hand-player-status{font:600 12px ${SANS_R};letter-spacing:.09em;color:#84948e;min-height:15px;transition:color .4s}
    .rb-hand-player-name{font:600 17px/1.2 ${SANS_R};min-height:44px;padding:4px 0 9px;color:#d6dfe4}
    .rb-hand-player[data-winner=true] .rb-hand-player-status{color:#f0d499}
    .rb-hand-player[data-winner=true] .rb-hand-player-name{color:#fff3d4}
    .rb-hand-hole{display:flex;gap:7px;perspective:700px}
    .rb-hand-card{display:block;position:relative;flex:none;width:59px;height:84px;perspective:600px;border-radius:5px;transition:filter .6s;filter:drop-shadow(0 6px 8px #0005)}
    .rb-hand-card-flip{position:absolute;inset:0;display:block;transform-style:preserve-3d;transition:transform .68s cubic-bezier(.22,.7,.16,1);transition-delay:var(--deal-delay)}
    .rb-hand-card[data-hidden=true] .rb-hand-card-flip{transform:rotateY(180deg)}
    .rb-hand-card-face,.rb-hand-card-back{position:absolute;inset:0;display:block;border-radius:5px;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
    .rb-hand-card-face{background:linear-gradient(130deg,#fbfcf5,#dce3df);border:1px solid #fff9;color:var(--card-ink);box-shadow:inset 0 0 0 2px #182c3810}
    .rb-hand-card-back{transform:rotateY(180deg);border:1px solid #7e92876b;background:repeating-linear-gradient(60deg,transparent 0 8px,#c7dfd108 8px 9px),linear-gradient(125deg,#3d5049,#20322b);box-shadow:inset 0 0 0 4px #21352d,inset 0 0 0 5px #b0c9ba30;display:grid;place-items:center;color:#b0c5b778;font-size:22px}
    .rb-hand-card-corner{position:absolute;left:4px;top:3px;font:700 18px/.9 ${MONO_R};text-align:center;display:flex;flex-direction:column;gap:2px}
    .rb-hand-card-corner small{font:14px/1 Georgia,serif}
    .rb-hand-card-corner-end{left:auto;top:auto;right:4px;bottom:3px;transform:rotate(180deg)}
    .rb-hand-card-pip{position:absolute;inset:0;display:grid;place-items:center;font:30px/1 Georgia,serif}
    .rb-hand-card[data-winning=true]{filter:drop-shadow(0 0 7px #efcf6355)}
    .rb-hand-card[data-winning=true] .rb-hand-card-face{background:linear-gradient(135deg,#fff4d7,#e1c48f);border-color:#fce5ad;box-shadow:inset 0 0 0 2px #80642525}
    .rb-hand-versus{position:absolute;top:94px;left:50%;transform:translateX(-50%);font:600 12px ${MONO_R};letter-spacing:.05em;color:#8d9b92}
    .rb-hand-board-label{display:flex;justify-content:space-between;margin:29px 0 10px;color:#a5b0a8;font:500 12px ${SANS_R};letter-spacing:.09em}
    .rb-hand-board{display:flex;gap:7px;justify-content:center;perspective:700px}
    .rb-hand-board .rb-hand-card{width:57px;height:81px}.rb-hand-board .rb-hand-card:nth-child(4){margin-left:6px}
    .rb-hand-streets{display:flex;gap:2px;padding:4px;margin-top:21px;border:1px solid #ffffff16;border-radius:999px;background:#ffffff06}
    .rb-hand-streets button{flex:1;min-height:40px;border:0;border-radius:999px;background:none;color:#87958f;font:600 12px ${SANS_R};cursor:pointer;transition:background .3s,color .3s}
    .rb-hand-streets button[aria-pressed=true]{background:#ddd0a8;color:#191d1c;box-shadow:0 2px 8px #0003}
    .rb-hand-narration{display:flex;gap:13px;min-height:126px;border-top:1px solid #d6cbab24;padding-top:17px}
    .rb-hand-step{flex:none;font:500 22px ${MONO_R};color:#d9c799}
    .rb-story-copy .rb-hand-narration p{font:15px/1.6 ${SANS_R};margin:0;color:#c6d0d6;animation:rb-story-enter .4s ease both}
    .rb-hand-replay{width:100%;min-height:46px;padding:0 4px;display:flex;align-items:center;justify-content:space-between;border:0;border-bottom:1px solid #d6cbab24;background:none;color:#e2d4b0;font:600 12px ${SANS_R};letter-spacing:.04em;cursor:pointer}.rb-hand-replay span{font-size:25px}
    .rb-hand-result{margin-top:25px;min-height:0}
    .rb-hand-result h4{font:600 23px/1.25 ${MONO_R};margin:9px 0 17px;color:#f3e1b8}
    .rb-hand-best{display:flex;gap:7px}.rb-hand-best .rb-hand-card{width:43px;height:61px}.rb-hand-best .rb-hand-card-corner{font-size:14px;left:3px;top:3px}.rb-hand-best .rb-hand-card-corner small{font-size:12px}.rb-hand-best .rb-hand-card-corner-end{left:auto;top:auto;right:3px;bottom:3px}.rb-hand-best .rb-hand-card-pip{font-size:21px}
    .rb-story-copy .rb-hand-result p{font:14px/1.55 ${SANS_R};color:#9caab4;margin:15px 0}.rb-hand-result p span{color:#c9d3dc}
    .rb-hand-prize{display:flex;align-items:center;justify-content:space-between;gap:12px;border-top:1px solid #d6cbab24;padding-top:17px;margin-top:19px}.rb-hand-prize span{font:500 12px ${SANS_R};color:#acb5bf;letter-spacing:.05em}.rb-hand-prize strong{font:600 23px ${MONO_R};color:#f1e3c6;white-space:nowrap}
    .rb-story-copy .rb-hand-note{font:12px/1.5 ${SANS_R};color:#85939d;margin:15px 0}
    .rb-story-legacy{border-top:1px solid #d6cbab30;padding-top:24px;margin-top:8px}.rb-story-legacy h3{font:600 24px/1.3 ${MONO_R};color:#ecd7a9;margin:0}
    .rb-story-sources{border-top:1px solid #ffffff16;padding-top:17px;margin-top:25px}.rb-story-sources .rb-story-source{font:13px/1.4 ${SANS_R};padding:7px 0;min-height:42px;justify-content:space-between}
    @media(prefers-reduced-motion:reduce){.rb-hand-card,.rb-hand-card-flip,.rb-hand-streets button{transition:none!important}}

    .rb-collection-enter{animation:rb-story-enter .45s cubic-bezier(.2,.8,.2,1) both}
    @media(prefers-reduced-motion:reduce){.rb-story,.rb-story *,.rb-collection-enter{animation:none!important}}
  `;
  document.head.appendChild(st);
}
// A historical hand replay: fixed cards, four streets, no simulated outcomes.
function RbHistoryPlayingCard({
  card,
  hidden = false,
  winning = false,
  index = 0
}) {
  const suit = card.slice(-1),
    rank = card.slice(0, -1),
    ink = {
      '♦': '#3260a0',
      '♣': '#1c7051',
      '♥': '#c1354c',
      '♠': '#293541'
    }[suit] || '#293541';
  return /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-card",
    "data-hidden": hidden,
    "data-winning": winning,
    role: "img",
    "aria-label": hidden ? 'Карта ещё не открыта' : card,
    style: {
      '--card-ink': ink,
      '--deal-delay': `${index * 70}ms`
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-card-flip"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-card-back",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null, "\u25CF")), /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-card-face",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-card-corner"
  }, rank, /*#__PURE__*/React.createElement("small", null, suit)), /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-card-pip"
  }, suit), /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-card-corner rb-hand-card-corner-end"
  }, rank, /*#__PURE__*/React.createElement("small", null, suit)))));
}
function RbLegendHand({
  legend
}) {
  const hand = legend.finalHand,
    [street, setStreet] = React.useState(3),
    [playing, setPlaying] = React.useState(false),
    ref = React.useRef(null);
  const streets = ['ПРЕФЛОП', 'ФЛОП', 'ТЁРН', 'РИВЕР'],
    shown = [0, 3, 4, 5][street],
    complete = street === 3;
  React.useEffect(() => {
    if (!playing) return;
    if (street === 3) {
      setPlaying(false);
      return;
    }
    const id = setTimeout(() => setStreet(v => Math.min(3, v + 1)), 2200);
    return () => clearTimeout(id);
  }, [playing, street]);
  React.useEffect(() => {
    const stop = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', stop);
    return () => document.removeEventListener('visibilitychange', stop);
  }, []);
  const replay = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setStreet(0);
    ref.current?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start'
    });
    if (!reduced) setPlaying(true);
  };
  const select = n => {
    setPlaying(false);
    setStreet(n);
  };
  return /*#__PURE__*/React.createElement("section", {
    ref: ref,
    className: "rb-hand",
    "data-i18n": "off",
    "aria-label": "\u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u0440\u0430\u0437\u0434\u0430\u0447\u0430",
    "data-street": street
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-eyebrow"
  }, "\u0425\u0415\u0414\u0417-\u0410\u041F \xB7 WSOP ", legend.year), /*#__PURE__*/React.createElement("h3", null, "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u0440\u0430\u0437\u0434\u0430\u0447\u0430"))), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-table"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-players"
  }, [{
    name: legend.name,
    cards: hand.hero,
    hero: true
  }, {
    name: hand.opponent,
    cards: hand.villain,
    hero: false
  }].map(player => /*#__PURE__*/React.createElement("div", {
    key: player.name,
    className: "rb-hand-player",
    "data-winner": complete && player.hero
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-player-status"
  }, complete ? player.hero ? 'ПОБЕДИТЕЛЬ' : 'СОПЕРНИК' : 'КАРТЫ ИГРОКА'), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-player-name"
  }, player.name), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-hole"
  }, player.cards.map((card, i) => /*#__PURE__*/React.createElement(RbHistoryPlayingCard, {
    key: card,
    card: card,
    winning: complete && player.hero && hand.best.includes(card),
    index: i
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-versus",
    "aria-hidden": "true"
  }, "VS"), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-board-label"
  }, /*#__PURE__*/React.createElement("span", null, "\u041E\u0411\u0429\u0418\u0415 \u041A\u0410\u0420\u0422\u042B"), /*#__PURE__*/React.createElement("span", null, shown, " / 5")), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-board"
  }, hand.board.map((card, i) => /*#__PURE__*/React.createElement(RbHistoryPlayingCard, {
    key: card,
    card: card,
    hidden: i >= shown,
    winning: complete && hand.best.includes(card),
    index: i < 3 ? i : 0
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-streets",
    role: "group",
    "aria-label": "\u0423\u043B\u0438\u0446\u0430 \u0440\u0430\u0437\u0434\u0430\u0447\u0438"
  }, streets.map((label, i) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    key: label,
    "aria-pressed": street === i,
    onClick: () => select(i)
  }, label)))), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-narration",
    "aria-live": "polite",
    "aria-atomic": "true"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-step"
  }, "0", street + 1), /*#__PURE__*/React.createElement("p", {
    key: street
  }, hand.steps[street])), /*#__PURE__*/React.createElement("button", {
    className: "rb-hand-replay",
    type: "button",
    onClick: replay
  }, playing ? 'ПАУЗА' : 'ПОВТОРИТЬ РАЗДАЧУ', /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, playing ? 'Ⅱ' : '↻')), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-result",
    "data-complete": complete,
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-eyebrow"
  }, complete ? 'ПОБЕДНАЯ КОМБИНАЦИЯ' : 'ВПЕРЕДИ — РЕШАЮЩИЕ КАРТЫ'), complete ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, hand.result), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-best"
  }, hand.best.map((card, i) => /*#__PURE__*/React.createElement(RbHistoryPlayingCard, {
    key: card,
    card: card,
    winning: true,
    index: i
  }))), /*#__PURE__*/React.createElement("p", null, "\u0423 ", hand.opponent, ": ", /*#__PURE__*/React.createElement("span", null, hand.otherResult.toLowerCase(), ".")), /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-prize"
  }, /*#__PURE__*/React.createElement("span", null, "\u041F\u0420\u0418\u0417 \u0427\u0415\u041C\u041F\u0418\u041E\u041D\u0410"), /*#__PURE__*/React.createElement("strong", null, hand.prize))) : /*#__PURE__*/React.createElement("p", null, "\u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0430\u0439\u0442\u0435 \u0443\u043B\u0438\u0446\u044B \u0432\u044B\u0448\u0435 \u2014 \u043A\u0430\u0440\u0442\u044B \u043E\u0442\u043A\u0440\u043E\u044E\u0442\u0441\u044F \u0432 \u0442\u043E\u043C \u0436\u0435 \u043F\u043E\u0440\u044F\u0434\u043A\u0435, \u0447\u0442\u043E \u0438 \u0432 \u0444\u0438\u043D\u0430\u043B\u0435.")), hand.note && /*#__PURE__*/React.createElement("p", {
    className: "rb-hand-note"
  }, hand.note));
}
function RbLegendHistory({
  legend,
  level,
  onClose
}) {
  const ref = React.useRef(null),
    photo = legend.photo;
  React.useEffect(() => {
    const previous = document.activeElement,
      el = ref.current;
    el?.querySelector('button')?.focus({
      preventScroll: true
    });
    const key = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = el.querySelectorAll('button,a[href]'),
          first = nodes[0],
          last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('keydown', key);
      previous?.focus({
        preventScroll: true
      });
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: "rb-story",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Card history"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-story-top"
  }, /*#__PURE__*/React.createElement("span", null, "CARD STORY"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rb-story-close",
    "aria-label": "Close card history",
    onClick: onClose
  }, "\xD7")), /*#__PURE__*/React.createElement("div", {
    className: "rb-story-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-story-hero"
  }, photo && /*#__PURE__*/React.createElement("div", {
    className: "rb-story-portrait"
  }, /*#__PURE__*/React.createElement("img", {
    src: photo.src,
    alt: legend.name,
    style: {
      objectPosition: photo.position
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "rb-story-year",
    "data-i18n": "off"
  }, legend.year), /*#__PURE__*/React.createElement("div", {
    className: "rb-story-edition",
    "data-i18n": "off"
  }, "WSOP", /*#__PURE__*/React.createElement("br", null), "MAIN EVENT"), /*#__PURE__*/React.createElement("div", {
    className: "rb-story-card"
  }, /*#__PURE__*/React.createElement(window.RbLegendCard3D, {
    level: level,
    w: 250,
    h: 275
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rb-story-copy"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-story-title",
    "data-i18n": "off"
  }, legend.title), /*#__PURE__*/React.createElement("h2", {
    className: "rb-story-name",
    "data-i18n": "off"
  }, legend.name), legend.finalHand ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    "data-i18n": "off"
  }, legend.finalHand.intro), /*#__PURE__*/React.createElement(RbLegendHand, {
    legend: legend
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-story-legacy",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("h3", null, legend.finalHand.legacy), /*#__PURE__*/React.createElement("p", null, legend.finalHand.legacyText)), /*#__PURE__*/React.createElement("div", {
    className: "rb-story-sources",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-eyebrow"
  }, "\u0410\u0420\u0425\u0418\u0412 \u0420\u0410\u0417\u0414\u0410\u0427\u0418"), legend.finalHand.sources.map(source => /*#__PURE__*/React.createElement("a", {
    key: source.url,
    className: "rb-story-source",
    href: source.url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("span", null, source.label), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2197"))))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    "data-i18n": "off"
  }, legend.story), /*#__PURE__*/React.createElement("div", {
    className: "rb-story-hand",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-hand-eyebrow"
  }, "\u041F\u041E\u0411\u0415\u0414\u041D\u0410\u042F \u0420\u0423\u041A\u0410"), /*#__PURE__*/React.createElement("span", {
    className: "rb-story-hand-cards"
  }, legend.hand)), legend.prize && /*#__PURE__*/React.createElement("div", {
    className: "rb-hand-prize",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("span", null, "\u041F\u0420\u0418\u0417 \u0427\u0415\u041C\u041F\u0418\u041E\u041D\u0410"), /*#__PURE__*/React.createElement("strong", null, legend.prize)), legend.draft && /*#__PURE__*/React.createElement("p", {
    className: "rb-hand-note",
    "data-i18n": "off"
  }, "\u0427\u0435\u0440\u043D\u043E\u0432\u0438\u043A: \u0431\u043E\u0440\u0434 \u0438 \u043F\u043E\u043A\u0430\u0434\u0440\u043E\u0432\u044B\u0439 \u0440\u0430\u0437\u0431\u043E\u0440 \u0440\u0430\u0437\u0434\u0430\u0447\u0438 \u0435\u0449\u0451 \u0441\u0432\u0435\u0440\u044F\u044E\u0442\u0441\u044F \u0441 \u0430\u0440\u0445\u0438\u0432\u043E\u043C WSOP.")), photo && /*#__PURE__*/React.createElement("div", {
    className: "rb-story-credit",
    "data-i18n": "off"
  }, "\u0424\u043E\u0442\u043E: ", /*#__PURE__*/React.createElement("a", {
    href: photo.source,
    target: "_blank",
    rel: "noopener noreferrer"
  }, photo.author), " \xB7 ", /*#__PURE__*/React.createElement("a", {
    href: photo.licenseUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, photo.license), /*#__PURE__*/React.createElement("br", null), "\u041A\u0430\u0434\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0438 \u043C\u043E\u043D\u043E\u0445\u0440\u043E\u043C. \u041F\u043E\u0440\u0442\u0440\u0435\u0442 \u0438\u0437 \u0444\u043E\u0442\u043E\u0430\u0440\u0445\u0438\u0432\u0430."))));
}

// ── Card-flip reveal: нагорода рівня подається перевертанням карти ──────
function RbCardReveal({
  level,
  onClose
}) {
  const L = window.cmLeague;
  const legend = window.cmLegends[level];
  if (legend) return /*#__PURE__*/React.createElement(RbLegendHistory, {
    legend: legend,
    level: level,
    onClose: onClose
  });
  const lg = L.forLevel(level);
  const rank = L.rankForLevel(level);
  const ace = rank === "A";
  const special = window.cmSpecials[level],
    ink = special?.edition.ink || lg.color;
  return /*#__PURE__*/React.createElement("div", {
    role: "dialog",
    "aria-modal": "true",
    "aria-label": special ? `${special.name} · Special card` : 'Card reward',
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 92,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "rgba(6,6,8,.92)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 70% 40% at 50% 42%, ${lg.color}30, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".06em",
      color: special ? ink : "#CDD2DB"
    }
  }, special ? '✧ SPECIAL EDITION' : ace ? "ACE — LEAGUE FINALE" : "LEVEL REWARD"), /*#__PURE__*/React.createElement("span", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "relative",
      marginTop: 22,
      perspective: 700,
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      animation: "rb-flip .8s cubic-bezier(.2,.8,.2,1) both",
      transformStyle: "preserve-3d"
    }
  }, window.RbHeroCard3D ? /*#__PURE__*/React.createElement(window.RbHeroCard3D, {
    level: level,
    w: special ? 248 : 200,
    h: special ? 326 : 262,
    faceUp: true,
    glow: true
  }) : window.LevelCard && /*#__PURE__*/React.createElement(window.LevelCard, {
    level: level,
    w: 110,
    face: true,
    highlight: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      textAlign: "center",
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_R,
      fontWeight: 700,
      fontSize: 30,
      color: "#fff",
      letterSpacing: ".04em"
    },
    "data-i18n": "off"
  }, special ? special.name : `${rank}${lg.suit}`), special && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_R,
      fontSize: 19,
      color: ink,
      marginTop: 7
    },
    "data-i18n": "off"
  }, rank, lg.suit, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: '#a4afbd'
    }
  }, " / ", String(level).padStart(2, '0'))), special && /*#__PURE__*/React.createElement("p", {
    "data-i18n": "off",
    style: {
      maxWidth: 322,
      margin: '16px auto 0',
      fontFamily: SANS_R,
      fontSize: 17,
      lineHeight: 1.55,
      color: '#c6d0dc'
    }
  }, special.description), !special && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".06em",
      color: lg.color,
      marginTop: 6
    }
  }, level === (window.cmLeague.TOTAL || 65) ? "COLLECTION COMPLETE" : ace ? "GRAND REWARD + NEXT LEAGUE" : "REWARD UNLOCKED")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      position: "relative",
      marginTop: 26,
      padding: "13px 42px",
      borderRadius: UI.r.pill,
      border: 0,
      cursor: "pointer",
      background: lg.color,
      color: lg.ink,
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".06em",
      boxShadow: `0 10px 26px ${lg.color}66`
    }
  }, "CONTINUE"));
}
if (!document.getElementById('rb-unlock-style')) {
  const st = document.createElement('style');
  st.id = 'rb-unlock-style';
  st.textContent = `
    .rb-unlock{position:absolute;inset:0;z-index:96;overflow:hidden;isolation:isolate;background:#101416;color:#f4f7f8;font-family:${SANS_R};animation:rb-unlock-enter .35s ease both}
    .rb-unlock-bg{position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse 75% 43% at 50% 38%,#396d5140,transparent 76%),linear-gradient(150deg,#12261e33,transparent 65%)}
    .rb-unlock-halo{position:absolute;top:155px;left:-45px;right:-45px;height:405px;pointer-events:none;background:radial-gradient(ellipse,#bcebc51c,transparent 62%);border-radius:50%;opacity:.3;transform:scale(.75);transition:opacity 1.2s ease,transform 1.6s cubic-bezier(.16,1,.3,1)}
    .rb-unlock[data-phase="1"] .rb-unlock-halo,.rb-unlock[data-phase="2"] .rb-unlock-halo{opacity:1;transform:scale(1.12);box-shadow:inset 0 0 100px #afe1bb08}
    .rb-unlock-top{position:absolute;top:77px;left:24px;right:24px;z-index:3;text-align:center}
    .rb-unlock-kicker{font:600 13px ${SANS_R};letter-spacing:.15em;color:#b9cabe}
    .rb-unlock-top h2{font:700 28px ${MONO_R};letter-spacing:.025em;margin:11px 0 0;color:#e3f3e6}
    .rb-unlock-canvas{position:absolute;left:0;top:133px;width:402px;height:444px;transition:transform .9s cubic-bezier(.16,1,.3,1);filter:drop-shadow(0 30px 24px #0007)}
    .rb-unlock[data-phase="2"] .rb-unlock-canvas{transform:translateY(-20px)}
    .rb-unlock-fallback{width:402px;height:444px;display:grid;place-items:center}
    .rb-unlock-seal-copy{position:absolute;top:578px;left:20px;right:20px;text-align:center;font-size:14px;color:#a7b8ac;letter-spacing:.06em;transition:opacity .35s}
    .rb-unlock[data-phase="2"] .rb-unlock-seal-copy{opacity:0}
    .rb-unlock-burst{position:absolute;left:50%;top:358px;pointer-events:none}
    .rb-unlock-burst i{position:absolute;width:2px;height:16px;background:linear-gradient(#d1edce,transparent);border-radius:2px;transform:rotate(var(--angle)) translateY(-80px);opacity:0;animation:rb-unlock-ray 1.55s var(--delay) cubic-bezier(.12,.6,.25,1) both}
    .rb-unlock-sheet{position:absolute;left:24px;right:24px;bottom:27px;padding-top:20px;border-top:1px solid #c5dec74a;background:linear-gradient(#11171900,#111719 30%);animation:rb-unlock-sheet .8s cubic-bezier(.16,1,.3,1) both}
    .rb-unlock-sheet::before{content:'';position:absolute;top:-1px;left:24%;right:24%;height:1px;background:#d9eccc;box-shadow:0 0 17px #c9eecb99}
    .rb-unlock-sheet-label{font:600 13px ${SANS_R};color:#c7dacb;letter-spacing:.085em}
    .rb-unlock-level-row{display:flex;justify-content:space-between;align-items:center;margin-top:11px}
    .rb-unlock-level-window{height:91px;overflow:hidden;mask-image:linear-gradient(transparent,#000 9% 91%,transparent)}
    .rb-unlock-number{font:700 88px/91px ${MONO_R};letter-spacing:-.065em;background:linear-gradient(125deg,#fff 20%,#b7c7bd 53%,#edfff1 75%);-webkit-background-clip:text;background-clip:text;color:transparent;animation:rb-unlock-number .9s .18s cubic-bezier(.2,.8,.2,1) both}
    .rb-unlock-number span{display:block;height:91px}
    .rb-unlock-rank{text-align:right}.rb-unlock-rank strong{font:700 32px ${MONO_R};color:#e1f5e6}.rb-unlock-rank small{display:block;margin-top:5px;font-size:13px;color:#a1b3a7;letter-spacing:.06em}
    .rb-unlock-sheet p{margin:9px 0 18px;color:#b5c4ba;font-size:15px;line-height:1.45}
    .rb-unlock-reward{margin:6px 0 16px;border-top:1px solid #c5dec72e;padding-top:10px}.rb-unlock-reward-row{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:6px 0;font:600 12px ${SANS_R};letter-spacing:.08em;color:#a7b8ac}.rb-unlock-reward-row strong{font:700 19px ${MONO_R};letter-spacing:0;color:#f4f7f8;white-space:nowrap}.rb-unlock-reward-row em{font-style:normal;color:#9ff0b6}.rb-unlock-reward-note{margin-top:6px;font:500 12px ${SANS_R};color:#d9c799}
    .rb-unlock-pick{position:absolute;inset:0;z-index:5;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 20px;background:radial-gradient(ellipse 80% 60% at 50% 45%,#10161a99,#0b0f10e6 80%);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);animation:pp-fadeIn .3s ease}
    .rb-unlock-pick-title{font:700 13px ${SANS_R};letter-spacing:.16em;color:#c7dacb}
    .rb-unlock-pick-sub{margin-top:6px;font:600 15px ${SANS_R};color:#fff}
    .rb-unlock-pick-row{display:flex;gap:14px;width:100%;max-width:360px;margin-top:22px}
    .rb-unlock-tile{position:relative;flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:6px;padding:22px 10px 18px;border-radius:22px;border:1.5px solid;color:#fff;cursor:pointer;overflow:hidden;isolation:isolate;transform:translateY(0);transition:transform .15s,box-shadow .15s;animation:rb-unlock-tile-in .55s cubic-bezier(.16,1,.3,1) both}
    .rb-unlock-tile:active{transform:translateY(2px) scale(.98)}
    .rb-unlock-tile[data-kind=cash]{border-color:#ff5c6a99;background:linear-gradient(165deg,#3a0d13,#1a0b0e 55%,#120a0c);box-shadow:0 18px 40px #0009,0 0 28px #d7192133,inset 0 1px 0 #ffffff1f}
    .rb-unlock-tile[data-kind=tdollar]{border-color:#e2bd7299;background:linear-gradient(165deg,#3a2c10,#1c160b 55%,#120f09);box-shadow:0 18px 40px #0009,0 0 28px #e2bd7233,inset 0 1px 0 #ffffff1f}
    .rb-unlock-tile-glow{position:absolute;left:50%;top:-30%;width:140%;height:80%;transform:translateX(-50%);border-radius:50%;filter:blur(24px);z-index:-1;opacity:.55}
    .rb-unlock-tile[data-kind=cash] .rb-unlock-tile-glow{background:#d71921}
    .rb-unlock-tile[data-kind=tdollar] .rb-unlock-tile-glow{background:#e2bd72}
    .rb-unlock-tile-ic{display:flex;align-items:center;justify-content:center;width:62px;height:62px;border-radius:50%;background:#ffffff12;border:1px solid #ffffff2e;margin-bottom:6px}
    .rb-unlock-tile[data-kind=cash] .rb-unlock-tile-ic{color:#ff8993}
    .rb-unlock-tile[data-kind=tdollar] .rb-unlock-tile-ic{color:#f1d58a}
    .rb-unlock-tile-amt{font:700 30px ${MONO_R};letter-spacing:0;line-height:1;color:#fff}
    .rb-unlock-tile[data-kind=tdollar] .rb-unlock-tile-amt{color:#f1d58a}
    .rb-unlock-tile-kind{font:700 12px ${SANS_R};letter-spacing:.14em;color:#e7ece9;text-align:center}
    .rb-unlock-tile-note{font:600 12px ${SANS_R};color:#8fa39a}
    .rb-unlock-pick-legend{margin-top:18px;font:600 12px ${SANS_R};letter-spacing:.06em;color:#e9c77e}
    @keyframes rb-unlock-tile-in{from{opacity:0;transform:translateY(24px) scale(.96)}to{opacity:1;transform:translateY(0) scale(1)}}
    .rb-unlock-choice-row{display:flex;gap:10px;margin:10px 0 14px}
    .rb-unlock-option{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:4px;padding:14px 8px 12px;border-radius:16px;border:1px solid #c5dec73a;background:#ffffff0a;color:#f4f7f8;cursor:pointer;transition:transform .15s,border-color .15s,background .15s}
    .rb-unlock-option:active{transform:scale(.97)}
    .rb-unlock-option[data-kind=cash]{border-color:#d7192180;background:linear-gradient(#d719211f,#d7192108)}
    .rb-unlock-option[data-kind=tdollar]{border-color:#e2bd7280;background:linear-gradient(#e2bd721f,#e2bd7208)}
    .rb-unlock-option-kind{font:700 12px ${SANS_R};letter-spacing:.14em;color:#a7b8ac}
    .rb-unlock-option strong{font:700 26px ${MONO_R};letter-spacing:0;color:#fff;line-height:1}
    .rb-unlock-option[data-kind=tdollar] strong{color:#f1d58a}
    .rb-unlock-option small{font:600 12px ${SANS_R};color:#8fa39a;text-align:center}
    .rb-unlock-confirm{position:absolute;inset:0;z-index:6;display:flex;align-items:center;justify-content:center;padding:24px;background:#0b0f10b8;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:pp-fadeIn .25s ease}
    .rb-unlock-confirm-card{width:100%;max-width:340px;padding:22px 20px 18px;border-radius:22px;border:1px solid #c5dec73a;background:linear-gradient(#1a2124,#111719);box-shadow:0 20px 60px #0009;text-align:center;animation:rb-unlock-confirm-enter .24s cubic-bezier(.16,1,.3,1) both}
    .rb-unlock-confirm-card .rb-unlock-sheet-label{text-align:center}
    .rb-unlock-confirm-amount{margin-top:8px;font:700 44px ${MONO_R};line-height:1;color:#fff;letter-spacing:0}
    .rb-unlock-confirm-amount[data-kind=tdollar]{color:#f1d58a}
    .rb-unlock-confirm-kind{margin-top:8px;font:600 13px ${SANS_R};color:#a7b8ac}
    .rb-unlock-confirm-row{display:flex;gap:10px;margin-top:18px}
    .rb-unlock-confirm-row .rb-unlock-continue{flex:1.3}
    .rb-unlock-confirm-back{flex:1;height:54px;border-radius:999px;border:1px solid #c5dec74a;background:transparent;color:#dfe7e3;font:700 13px ${SANS_R};letter-spacing:.06em;cursor:pointer}
    .rb-unlock .rb-unlock-continue{display:block;width:100%;height:54px;border:0;border-radius:999px;background:#d71921;color:white;font:700 15px ${SANS_R};letter-spacing:.04em;cursor:pointer}
    @keyframes rb-unlock-confirm-enter{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    @keyframes rb-unlock-enter{from{opacity:0}to{opacity:1}}
    @keyframes rb-unlock-sheet{from{opacity:0;transform:translateY(45px)}to{opacity:1;transform:translateY(0)}}
    @keyframes rb-unlock-number{from{transform:translateY(0)}to{transform:translateY(-50%)}}
    @keyframes rb-unlock-ray{0%{opacity:0;transform:rotate(var(--angle)) translateY(-75px)}22%{opacity:.65}100%{opacity:0;transform:rotate(var(--angle)) translateY(-200px) scaleY(.25)}}
    @media(prefers-reduced-motion:reduce){.rb-unlock,.rb-unlock *{animation:none!important;transition:none!important}.rb-unlock-number{transform:translateY(-50%)}.rb-unlock-burst{display:none}}
  `;
  document.head.appendChild(st);
}
function RbKingUnlock({
  level,
  onEarned,
  onPick,
  onClose
}) {
  const [phase, setPhase] = React.useState(0),
    [reward, setReward] = React.useState(false),
    [pick, setPick] = React.useState(null),
    [confirmed, setConfirmed] = React.useState(false),
    timeline = React.useRef({
      time: 0
    }),
    phaseRef = React.useRef(0),
    earned = React.useRef(false),
    callback = React.useRef(onEarned),
    root = React.useRef(null);
  callback.current = onEarned;
  React.useEffect(() => {
    const previous = document.activeElement;
    root.current?.focus({
      preventScroll: true
    });
    let raf,
      last = performance.now(),
      elapsed = 0;
    const schedule = f => document.hidden && window.__forceRender ? setTimeout(() => f(performance.now()), 50) : requestAnimationFrame(f);
    const tick = now => {
      if (!document.hidden || window.__forceRender) elapsed += Math.min(document.hidden ? 1 : .05, (now - last) / 1000);
      last = now;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) elapsed = 3.4;
      timeline.current.time = elapsed;
      const next = elapsed >= 2.45 ? 2 : elapsed >= .68 ? 1 : 0;
      if (next !== phaseRef.current) {
        phaseRef.current = next;
        setPhase(next);
      }
      if (next === 2 && !earned.current) {
        earned.current = true;
        callback.current(level);
        window.cmFrames?.award(level);
      }
      if (elapsed < 3.4) raf = schedule(tick);
    };
    raf = schedule(tick);
    const key = e => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Tab') {
        e.preventDefault();
        (root.current?.querySelector('.rb-unlock-confirm button') || root.current?.querySelector('button'))?.focus({
          preventScroll: true
        });
      }
    };
    document.addEventListener('keydown', key);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(raf);
      document.removeEventListener('keydown', key);
      if (previous?.isConnected) previous.focus({
        preventScroll: true
      });
    };
  }, [level]);
  React.useEffect(() => {
    if (phase === 2) root.current?.querySelector('button')?.focus({
      preventScroll: true
    });
  }, [phase]);
  React.useEffect(() => {
    if (phase === 2) root.current?.querySelector(pick ? '.rb-unlock-confirm button' : '.rb-unlock-pick button')?.focus({
      preventScroll: true
    });
  }, [pick]);
  const L = window.cmLeague,
    lgU = L.forLevel(level),
    rankU = L.rankForLevel(level),
    RANK_NAMES = {
      '2': 'DEUCE',
      '3': 'THREE',
      '4': 'FOUR',
      '5': 'FIVE',
      '6': 'SIX',
      '7': 'SEVEN',
      '8': 'EIGHT',
      '9': 'NINE',
      '10': 'TEN',
      'J': 'JACK',
      'Q': 'QUEEN',
      'K': 'KING',
      'A': 'ACE'
    };
  const titleU = lgU.id === 'dot' ? 'ACE OF DOT' : `${RANK_NAMES[rankU] || rankU} OF ${lgU.name}`,
    rw = L.cardReward ? L.cardReward(level, pick || undefined) : null,
    pctU = v => (Math.round(v * 10) / 10).toString().replace('.', ',') + '%';
  return /*#__PURE__*/React.createElement("div", {
    ref: root,
    tabIndex: -1,
    className: "rb-unlock",
    "data-phase": phase,
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "New cashback level"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-halo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-kicker"
  }, phase === 2 ? 'CARD UNLOCKED' : 'A NEW CARD IS YOURS'), /*#__PURE__*/React.createElement("h2", null, titleU)), phase > 0 && /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-burst",
    "aria-hidden": "true"
  }, Array.from({
    length: 12
  }, (_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      '--angle': `${i * 30}deg`,
      '--delay': `${i % 3 * .07}s`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-canvas"
  }, /*#__PURE__*/React.createElement(window.RbUnlockCard3D, {
    level: level,
    timeline: timeline,
    phase: phase
  })), /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-seal-copy"
  }, phase === 0 ? 'BREAKING THE SEAL' : 'WELCOME TO YOUR COLLECTION'), phase === 2 && rw && /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-pick",
    inert: pick ? '' : undefined,
    "aria-hidden": pick ? true : undefined,
    role: "dialog",
    "aria-modal": !pick,
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-pick-title"
  }, "\u041D\u0410\u0413\u0420\u0410\u0414\u0410 \u041F\u041E\u0414 \u041A\u0410\u0420\u0422\u041E\u0419"), /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-pick-sub"
  }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u0447\u0442\u043E \u0437\u0430\u0431\u0440\u0430\u0442\u044C"), /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-pick-row"
  }, rw.options.map((o, i) => /*#__PURE__*/React.createElement("button", {
    key: o.kind,
    type: "button",
    className: "rb-unlock-tile",
    "data-kind": o.kind,
    style: {
      animationDelay: `${i * .08}s`
    },
    onClick: () => {
      if (window.playClick) window.playClick(1400, .05);
      setPick(o.kind);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-unlock-tile-glow",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: 'relative',
      display: 'block',
      width: '100%',
      height: 114,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(window.RbRewardCoins3D, {
    kind: o.kind,
    phase: "preview",
    preview: true,
    timeline: {
      current: {
        elapsed: 650
      }
    }
  })), /*#__PURE__*/React.createElement("strong", {
    className: "rb-unlock-tile-amt"
  }, o.text), /*#__PURE__*/React.createElement("span", {
    className: "rb-unlock-tile-kind"
  }, o.kind === 'cash' ? 'КЕШ-ДОЛЛАРЫ' : 'ТУРНИРНЫЕ ДОЛЛАРЫ'), /*#__PURE__*/React.createElement("span", {
    className: "rb-unlock-tile-note"
  }, o.kind === 'cash' ? 'для кеш-игр' : 'для турниров')))), rw.legend && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-pick-legend"
  }, "\u2605 \u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \xB7 \u043D\u0430\u0433\u0440\u0430\u0434\u0430 \u0443\u0434\u0432\u043E\u0435\u043D\u0430"), /*#__PURE__*/React.createElement(window.LegendFrameUnlockGift, {
    level: level
  }))), phase === 2 && rw && pick && !confirmed && (() => {
    const o = rw.options.find(x => x.kind === pick) || rw;
    return /*#__PURE__*/React.createElement("div", {
      className: "rb-unlock-confirm",
      role: "dialog",
      "aria-modal": "true",
      "data-i18n": "off"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rb-unlock-confirm-card"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rb-unlock-sheet-label"
    }, "\u0412\u042B \u0412\u042B\u0411\u0420\u0410\u041B\u0418"), /*#__PURE__*/React.createElement("div", {
      className: "rb-unlock-confirm-amount",
      "data-kind": o.kind
    }, o.text), /*#__PURE__*/React.createElement("div", {
      className: "rb-unlock-confirm-kind"
    }, o.kind === 'cash' ? 'Кеш-доллары · только для кеш-игр' : 'Турнирные доллары · для турниров'), /*#__PURE__*/React.createElement("div", {
      className: "rb-unlock-confirm-row"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "rb-unlock-confirm-back",
      onClick: () => {
        if (window.playClick) window.playClick(900);
        setPick(null);
      }
    }, "\u0418\u0417\u041C\u0415\u041D\u0418\u0422\u042C"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "rb-unlock-continue",
      onClick: () => {
        window.cmRewardPicks[level] = o.kind;
        onPick && onPick(level, o.kind);
        setConfirmed(true);
        setReward(true);
      }
    }, "\u041F\u041E\u0414\u0422\u0412\u0415\u0420\u0414\u0418\u0422\u042C"))));
  })(), phase === 2 && !rw && /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-sheet",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-sheet-label"
  }, "NEW CASHBACK LEVEL"), /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-level-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-level-window",
    "aria-label": `Level ${level}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-number",
    "data-i18n": "off",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null, level - 1), /*#__PURE__*/React.createElement("span", null, level))), /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-rank"
  }, /*#__PURE__*/React.createElement("strong", {
    "data-i18n": "off"
  }, L.cardForLevel(level)), /*#__PURE__*/React.createElement("small", null, L.forLevel(level).name))), rw && /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-reward",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-reward-row"
  }, /*#__PURE__*/React.createElement("span", null, "\u041D\u0410\u0413\u0420\u0410\u0414\u0410 \u041F\u041E\u0414 \u041A\u0410\u0420\u0422\u041E\u0419"), /*#__PURE__*/React.createElement("strong", null, rw.text)), /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-reward-row"
  }, /*#__PURE__*/React.createElement("span", null, "\u041A\u042D\u0428\u0411\u0415\u041A"), /*#__PURE__*/React.createElement("strong", null, pctU(rw.rbNow), " \u2192 ", /*#__PURE__*/React.createElement("em", null, pctU(rw.rbNext)))), rw.legend && /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-reward-note"
  }, "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u0430\u044F \u043A\u0430\u0440\u0442\u0430 \xB7 \u043D\u0430\u0433\u0440\u0430\u0434\u0430 \u0443\u0434\u0432\u043E\u0435\u043D\u0430 \xB7 \u0438\u0441\u0442\u043E\u0440\u0438\u044F \u0432\u043D\u0443\u0442\u0440\u0438"), rw.ace && /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-reward-note"
  }, "\u0422\u0443\u0437 \u043C\u0430\u0441\u0442\u0438 \xB7 \u0433\u0440\u0430\u043D\u0442-\u043D\u0430\u0433\u0440\u0430\u0434\u0430 \xB7 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0430\u044F \u043C\u0430\u0441\u0442\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u0430")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "rb-unlock-continue",
    onClick: () => {
      if (rw) {
        if (window.playClick) window.playClick(1500, .06);
        setReward(true);
      } else onClose();
    }
  }, rw ? /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off"
  }, "\u0417\u0410\u0411\u0420\u0410\u0422\u042C \u041D\u0410\u0413\u0420\u0410\u0414\u0423 \xB7 ", rw.text) : "BACK TO COLLECTION")), reward && /*#__PURE__*/React.createElement(RbCardRewardReveal, {
    level: level,
    accent: "#D71921",
    onClose: onClose
  }));
}

// The collection is a fixed isometric world, navigated one level at a time.
if (!document.getElementById('rb-iso-style')) {
  const st = document.createElement('style');
  st.id = 'rb-iso-style';
  st.textContent = `
    .rb-iso{position:relative;height:100%;min-height:0;overflow:clip;isolation:isolate;color:#edf2f7;font-family:${SANS_R};background:radial-gradient(ellipse at 50% 46%,#25303938,transparent 65%);user-select:none;-webkit-user-select:none}
    .rb-iso-overview{position:absolute;top:5px;left:22px;right:22px;z-index:4;display:flex;justify-content:space-between;align-items:center;pointer-events:none}
    .rb-iso-legend-light{position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;background:radial-gradient(ellipse 70% 47% at 50% 55%,var(--legend-wash),transparent 78%),radial-gradient(ellipse 110% 60% at 5% 42%,var(--legend-haze),transparent 72%);transition:opacity .85s ease}
    .rb-iso[data-legend=true] .rb-iso-legend-light{opacity:.3}
    .rb-iso[data-ready=true] .rb-iso-legend-light{opacity:.18}
    .rb-iso-legend-light::after{content:'';position:absolute;left:16%;right:16%;top:31%;height:43%;border:1px solid var(--legend-haze);border-radius:50%;filter:blur(20px);box-shadow:0 0 65px var(--legend-wash),inset 0 0 50px var(--legend-haze);transform:rotate(-18deg)}
    .rb-iso-legend-intro{position:absolute;top:60px;left:22px;right:22px;z-index:4;pointer-events:none;opacity:0;transform:translateY(-8px);transition:opacity .5s ease,transform .7s cubic-bezier(.22,.7,0,1);text-align:left}
    .rb-iso-legend-intro[data-active=true]{opacity:1;transform:translateY(0)}
    .rb-iso-legend-intro::before{display:none}
    .rb-iso-legend-kicker{display:none;gap:9px;align-items:center;font:600 12px ${SANS_R};letter-spacing:.12em;color:var(--legend-ink)}
    .rb-iso-autograph{margin:0;font:400 29px/1.12 PokerDotSignature,cursive;color:#fff1d6;white-space:nowrap;text-shadow:0 0 24px var(--legend-wash)}
    .rb-iso-legend-fact{grid-column:1;margin:4px 0 0;font:500 12px ${SANS_R};color:#c3bfba;letter-spacing:.02em}
    .rb-iso .rb-iso-read{border:1px solid #efd29870;border-radius:999px;background:#ead09c14;color:#f7dfb0;padding:0 19px;height:40px;font:700 13px ${SANS_R};letter-spacing:.025em;cursor:pointer}
    .rb-iso-read{grid-column:2;grid-row:1 / 3;margin-left:10px}.rb-iso-legend-intro[data-active=true] .rb-iso-read{pointer-events:auto}
    .rb-iso-read:disabled{cursor:default;opacity:.55}
    .rb-iso-legend-content{display:grid;grid-template-columns:1fr auto;align-items:center;animation:rb-iso-legend-arrive .85s cubic-bezier(.22,.7,0,1) both}
    .rb-iso-legend-flare{position:absolute;inset:28% -70% 13%;pointer-events:none;z-index:1;background:linear-gradient(110deg,transparent 40%,#ffe7b918 49%,#fff3d820 50%,transparent 58%);animation:rb-iso-legend-flare 1.8s ease-out both}
    .rb-iso-count{font:700 23px ${MONO_R};color:#e8edf3}.rb-iso-count small{font:500 14px ${SANS_R};color:#a5b0bd;margin-left:8px}
    .rb-iso-home{pointer-events:auto;flex:none;min-height:44px;margin:-6px 0;padding:0 0 0 12px;border:0;border-radius:0;background:none;color:#d2dae3;font:600 12px ${SANS_R};letter-spacing:.01em;cursor:pointer}.rb-iso-home:hover{color:#fff}.rb-iso-home:focus-visible{outline:1px solid #d2dae3;outline-offset:4px}
    .rb-iso-viewport{position:absolute;inset:112px 0 218px;overflow:clip;touch-action:none;cursor:grab;outline:none;mask-image:linear-gradient(transparent,black 3% 97%,transparent);-webkit-mask-image:linear-gradient(transparent,black 3% 97%,transparent)}
    .rb-iso-viewport:active{cursor:grabbing}.rb-iso-labels{position:absolute;inset:0;pointer-events:none}
    .rb-iso .rb-iso-level{position:absolute;top:0;left:0;width:96px;height:112px;margin:0;padding:0;border:0;background:none;color:#b5c0cc;visibility:hidden;pointer-events:auto;cursor:pointer;will-change:transform;outline:none}
    .rb-iso-level:focus-visible{outline:1px solid #d8e5ef;border-radius:14px}
    .rb-iso-level-label{position:absolute;top:96px;left:50%;right:auto;width:max-content;padding:2px 8px;border:1px solid #ffffff18;border-radius:999px;background:#11151bec;transform:translateX(-50%);display:flex;justify-content:center;align-items:center;gap:5px;font:600 14px ${MONO_R};white-space:nowrap;text-shadow:0 2px 6px #000;transition:color .25s}
    .rb-iso-level[data-focused=true] .rb-iso-level-label{font-size:17px;color:#fff}
    .rb-iso .rb-iso-level[data-focused=true]{width:96px;height:112px}
    .rb-iso-level[data-focused=true] .rb-iso-level-label{color:#fff}
    .rb-iso-level[data-current=true] .rb-iso-level-label{color:#ff8993}
    .rb-iso-rarity{font-size:14px;color:var(--rarity-ink)}
    .rb-iso-here{position:absolute;top:132px;left:-36px;right:-36px;color:#fc8e97;font:600 12px ${SANS_R};letter-spacing:.06em;white-space:nowrap;text-shadow:0 2px 8px #000}
    .rb-iso-panel{position:absolute;left:22px;right:22px;bottom:76px;z-index:5;padding-top:16px;background:linear-gradient(transparent,#101115 20%);border-top:1px solid #ffffff15}
    .rb-iso-detail{min-height:79px;animation:rb-iso-copy .3s ease both}
    .rb-iso-meta{display:flex;align-items:center;justify-content:space-between;gap:8px;font:600 13px ${SANS_R};color:#a6b2c1;margin-bottom:8px}
    .rb-iso-title{display:flex;align-items:baseline;gap:12px;line-height:1.15}.rb-iso-title strong{font:700 28px ${MONO_R};color:#f6f7f9;white-space:nowrap}.rb-iso-title span{font:600 18px ${MONO_R};color:#d8e0e9}
    .rb-iso-status{font-size:14px;color:#a7b4c4;margin-top:8px;line-height:1.4;min-height:20px}
    .rb-iso-actions{display:flex;align-items:center;gap:10px;margin-top:12px}
    .rb-iso-position{flex:1;text-align:center;color:#8794a4;font:500 14px ${MONO_R};letter-spacing:.08em}.rb-iso-position b{font-weight:600;color:#dce4ec}
    .rb-iso .rb-iso-arrow{width:50px;height:50px;flex:none;border-radius:50%;border:1px solid #ffffff24;background:#ffffff06;color:#e5edf5;font-size:22px;cursor:pointer;display:grid;place-items:center}
    .rb-iso-arrow:disabled{opacity:.25;cursor:default}
    .rb-iso .rb-iso-open{display:flex;align-items:center;justify-content:center;gap:9px;flex:1;min-height:50px;border:0;border-radius:999px;background:linear-gradient(180deg,#ee3f49 0%,#d71921 52%,#a8121a 100%);color:#fff;font:700 14px ${SANS_R};letter-spacing:.03em;cursor:pointer}
    .rb-iso-open:disabled{background:#252c35;color:#aebac9;cursor:default}
    .rb-iso .rb-iso-open-ready{font-size:15px;box-shadow:0 8px 30px #d7192138}
    .rb-iso-hint{position:absolute;top:77px;left:0;right:0;z-index:3;pointer-events:none;text-align:center;font-size:12px;color:#8494a8}
    .rb-iso[data-legend=true] .rb-iso-hint{opacity:0}.rb-iso-hint{transition:opacity .4s}
    .rb-iso-total{position:absolute;top:42px;left:22px;right:22px;height:4px;background:#ffffff16;border-radius:4px;overflow:hidden}.rb-iso-total>span{display:block;height:100%;background:#d71921;border-radius:4px;transition:width .6s ease}
    .rb-iso-fallback{position:absolute;inset:20% 22px;text-align:center;font-size:16px;line-height:1.6;color:#b6c6d5}
    .rb-iso-monolith{background:radial-gradient(ellipse at 56% 41%,#38465440,transparent 64%)}
    .rb-iso-orbit{background:radial-gradient(ellipse at 50% 44%,#24465355,transparent 61%)}
    .rb-iso-islands{background:radial-gradient(ellipse at 30% 47%,#57452b35,transparent 60%)}
    .rb-iso-obsidian,.rb-iso-strata,.rb-iso-ribbon,.rb-iso-dot-islands{background:radial-gradient(ellipse at 30% 47%,#57452b35,transparent 60%)}
    .rb-iso-pulse{background:radial-gradient(ellipse at 38% 43%,#68112c44,transparent 60%)}
    .rb-iso-monolith .rb-iso-level-label{letter-spacing:.04em}
    .rb-iso-orbit .rb-iso-here{color:#c3dfef}
    @keyframes rb-iso-copy{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
    @keyframes rb-iso-legend-arrive{from{opacity:0;transform:translateY(9px);filter:blur(4px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
    @keyframes rb-iso-legend-flare{from{opacity:0;transform:translateX(-30%) rotate(-6deg)}30%{opacity:1}to{opacity:0;transform:translateX(30%) rotate(-6deg)}}
    @media(prefers-reduced-motion:reduce){.rb-iso *{animation:none!important;transition:none!important}}
  `;
  document.head.appendChild(st);
}
if (!document.getElementById('rb-collection-style')) {
  const st = document.createElement('style');
  st.id = 'rb-collection-style';
  st.textContent = `
 .rb-collection{height:100%;position:relative;overflow:hidden;background:#101115;color:#f4f4f5;font-family:${SANS_R};isolation:isolate}
 .rb-collection-summary{position:absolute;inset:5px 20px auto;z-index:3;display:flex;justify-content:space-between;align-items:center;font-size:12px;letter-spacing:.08em;color:#9b9ba7;background:transparent;padding-bottom:14px}
 .rb-collection-summary b{font-size:17px;color:#ededf1;letter-spacing:0}.rb-collection-overall{position:absolute;bottom:0;left:0;right:0;height:2px;background:#29292f}.rb-collection-overall i{display:block;height:100%;background:#92929d;transition:width .6s}
 .rb-collection-route{position:absolute;inset:45px 0 168px;overflow:hidden;touch-action:none;outline:none;mask-image:linear-gradient(transparent,black 2% 98%,transparent)}
 .rb-collection-rail{position:absolute;left:34px;top:24px;bottom:30px;width:1px;background:linear-gradient(#ffffff12,#77778180 18%,#393941 70%,#39394100)}.rb-collection-rail i{position:absolute;top:0;left:0;width:1px;height:76px;background:linear-gradient(#777781,#ec4352)}
 .rb-collection-step{position:absolute;top:0;left:0;right:0;height:76px;opacity:0;pointer-events:none;transition:transform .95s cubic-bezier(.16,1,.3,1),opacity .65s;will-change:transform}
 .rb-collection-step[data-visible=true]{opacity:1;pointer-events:auto}.rb-collection-step[data-past=true]{opacity:.36}
 .rb-collection-step[data-selected=true]{height:210px;background:radial-gradient(ellipse at 35% 45%,var(--card-tint),transparent 65%)}
 .rb-collection-node{position:absolute;left:20px;top:24px;width:29px;height:29px;border-radius:50%;border:1px solid #45454e;background:#17171c;color:#9898a6;font:500 12px ${MONO_R};cursor:pointer;z-index:2}
 .rb-collection-step[data-selected=true] .rb-collection-node{border-color:#f15d69;background:#c51b2a;color:white;box-shadow:0 0 0 5px #d7192115}
 .rb-collection-step[data-ready=true]:not([data-selected=true]) .rb-collection-node{border-color:#a94952;color:#ff9da6}
 .rb-closed-card{display:grid;place-items:center;width:150px;height:198px;transform:perspective(700px) rotateY(-12deg) rotateZ(-4deg);filter:drop-shadow(4px 7px 5px #0006)}
 .rb-collection .rb-collection-art,.rb-collection .rb-collection-node{position:absolute}
 .rb-collection-art{position:absolute;left:53px;top:-61px;width:150px;height:198px;padding:0;border:0;background:none;transform:scale(.44);transform-origin:0 50%;transition:transform .85s cubic-bezier(.22,1,.36,1),top .85s cubic-bezier(.22,1,.36,1);cursor:pointer}
 .rb-collection-step[data-selected=true] .rb-collection-art{top:6px;left:53px;transform:scale(1);filter:drop-shadow(0 16px 18px #0009)}
 .rb-collection-copy{position:absolute;left:143px;right:20px;top:10px;display:flex;flex-direction:column;gap:3px;transition:left .85s cubic-bezier(.22,1,.36,1)}
 .rb-collection-step[data-selected=true] .rb-collection-copy{left:220px;right:20px;top:10px}
 .rb-collection-eyebrow{font-size:12px;letter-spacing:.09em;font-weight:500;color:#858593}.rb-collection-step[data-selected=true] .rb-collection-eyebrow{color:#e5a9ae;font-size:12px;margin-bottom:5px}
 .rb-collection-copy>strong{font-size:15px;line-height:1.3;font-weight:600}.rb-collection-step[data-selected=true] .rb-collection-copy>strong{font-size:21px;font-weight:600;letter-spacing:-.5px}
 .rb-collection-rank{font:600 30px ${MONO_R};margin:1px 0 0;display:flex;flex-direction:column;gap:3px}.rb-collection-rank small{font:400 12px ${SANS_R};color:#b9b9c2}
 .rb-collection-reward{font-size:12px;line-height:1.45;color:#9999a6}.rb-collection-step[data-selected=true] .rb-collection-reward{display:none}
 .rb-collection-locked{font-size:12px;color:#92929e;margin-top:9px}
 .rb-collection-signature{display:flex;flex-direction:column;align-items:flex-start;gap:8px;margin-top:2px;animation:rb-signature-in .8s cubic-bezier(.16,1,.3,1) both}.rb-collection-signature em{font:23px PokerDotSignature,cursive;color:var(--story-ink,#e0c48f);white-space:nowrap}
 .rb-collection .rb-collection-story{display:block;padding:9px 15px;min-height:36px;border:1px solid #d5bd873d;border-radius:999px;background:linear-gradient(135deg,#e3cc9c16,#e3cc9c06);color:#e1d2b2;font:500 12px ${SANS_R};cursor:pointer;transition:background .25s,transform .25s}.rb-collection-story:hover{background:#e3cc9c24}.rb-collection-story:active{transform:scale(.96)}
 .rb-collection-atmosphere{mask-image:linear-gradient(transparent,black 18%,black 75%,transparent);position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:0;background:radial-gradient(ellipse 100% 55% at 30% 28%,var(--story-tint),transparent 76%),radial-gradient(ellipse 65% 40% at 90% 5%,#c4a35b0c,transparent);transition:opacity 1.2s ease}.rb-collection[data-legend=true] .rb-collection-atmosphere{opacity:1}
 .rb-collection-atmosphere:after{content:'';position:absolute;inset:10% -45% 35%;background:linear-gradient(115deg,transparent 35%,#e9d9ad08 50%,transparent 65%);transform:translateX(-20%);animation:rb-atmosphere-drift 12s ease-in-out infinite alternate}
 @keyframes rb-atmosphere-drift{to{transform:translateX(20%)}}
 @keyframes rb-signature-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
 .rb-collection-footer{position:absolute;left:20px;right:20px;bottom:29px;z-index:4;background:#101115;padding-top:17px;border-top:1px solid #ffffff14}
 .rb-collection-next{display:flex;justify-content:space-between;align-items:center}.rb-collection-next strong{font-size:15px;font-weight:600}.rb-collection-next>span{font:12px ${MONO_R};color:#aaaab5}
 .rb-collection-meter{height:5px;background:#2d2d35;border-radius:9px;margin:12px 0 18px;overflow:hidden}.rb-collection-meter>span{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#b71226,#ed4d5d);transition:width .6s}
 .rb-collection-footer p{font-size:12px;color:#8b8b99;margin:12px 0 0;text-align:center}
 .rb-collection-primary,.rb-collection-return{width:100%;height:51px;border-radius:999px;border:0;font:600 15px ${SANS_R};cursor:pointer}.rb-collection-primary{background:linear-gradient(180deg,#ee3f49 0%,#d71921 52%,#a8121a 100%);color:#fff}.rb-collection-primary span{opacity:.5;margin:0 9px}.rb-collection-return{background:#292930;color:#e4e4eb}
 @media(prefers-reduced-motion:reduce){.rb-collection *{transition:none!important;animation:none!important}}
 `;
  document.head.appendChild(st);
}
function RbPath({
  LEAGUES,
  level,
  xp = 0,
  xpNext = 1000,
  pendingLevel = null,
  onUnlock,
  onFlip,
  active = true
}) {
  const initial = level,
    L = window.cmLeague,
    TOTAL = L.TOTAL || 65,
    [focus, setFocus] = React.useState(initial),
    rootRef = React.useRef(null),
    paneRef = React.useRef(null),
    labelsRef = React.useRef({});
  const motion = React.useRef({
      value: initial,
      velocity: 0,
      target: initial,
      drag: 0,
      focus: initial
    }),
    navigateRef = React.useRef(null);
  const focusCard = n => {
    const next = Math.max(1, Math.min(TOTAL, n));
    motion.current.target = next;
    motion.current.focus = next;
    motion.current.drag = 0;
    setFocus(next);
  };
  navigateRef.current = focusCard;
  React.useEffect(() => {
    motion.current = {
      value: initial,
      velocity: 0,
      target: initial,
      drag: 0,
      focus: initial
    };
    setFocus(initial);
  }, [level, pendingLevel]);
  // шкала їде за тією ж пружиною, що й камера
  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = rulerRef.current;
      if (el && el.parentElement) {
        const h = el.parentElement.clientHeight,
          v = motion.current.value + motion.current.drag;
        el.style.transform = `translateY(${h / 2 - (TOTAL - v) * RULER_SP}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  React.useEffect(() => {
    const pane = paneRef.current,
      root = rootRef.current;
    if (!pane || !active) return;
    let gesture = null,
      swallowClick = false,
      wheelSum = 0,
      wheelUsed = false,
      wheelTimer = 0;
    const step = dir => navigateRef.current(motion.current.focus + dir);
    const wheel = e => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelSum = 0;
        wheelUsed = false;
      }, 200);
      if (wheelUsed) return;
      wheelSum += e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? pane.clientHeight : 1);
      if (Math.abs(wheelSum) > 25) {
        wheelUsed = true;
        step(-Math.sign(wheelSum));
      }
    };
    const down = e => {
      if (!e.isPrimary || e.button !== 0) return;
      gesture = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        dy: 0
      };
      swallowClick = false;
    };
    const move = e => {
      if (!gesture || gesture.id !== e.pointerId) return;
      const scale = pane.getBoundingClientRect().height / pane.clientHeight || 1;
      gesture.dy = (e.clientY - gesture.y) / scale;
      const dx = (e.clientX - gesture.x) / scale;
      if (Math.abs(gesture.dy) > 7 && Math.abs(gesture.dy) > Math.abs(dx)) {
        e.preventDefault();
        swallowClick = true;
        if (!pane.hasPointerCapture(e.pointerId)) pane.setPointerCapture(e.pointerId);
        motion.current.drag = Math.max(-.7, Math.min(.7, gesture.dy / 125));
      }
    };
    const up = e => {
      if (!gesture || gesture.id !== e.pointerId) return;
      const dy = gesture.dy;
      gesture = null;
      if (pane.hasPointerCapture(e.pointerId)) pane.releasePointerCapture(e.pointerId);
      motion.current.drag = 0;
      if (swallowClick && Math.abs(dy) > 32) step(Math.sign(dy));
    };
    const cancel = () => {
      gesture = null;
      motion.current.drag = 0;
    };
    const click = e => {
      if (swallowClick && e.detail !== 0) {
        e.preventDefault();
        e.stopPropagation();
        swallowClick = false;
      }
    };
    const key = e => {
      if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'Home') navigateRef.current(1);else if (e.key === 'End') navigateRef.current(TOTAL);else step(['ArrowDown', 'PageDown'].includes(e.key) ? -1 : 1);
      }
    };
    pane.addEventListener('wheel', wheel, {
      passive: false
    });
    pane.addEventListener('pointerdown', down);
    pane.addEventListener('pointermove', move, {
      passive: false
    });
    pane.addEventListener('pointerup', up);
    pane.addEventListener('pointercancel', cancel);
    pane.addEventListener('click', click, true);
    root.addEventListener('keydown', key);
    return () => {
      clearTimeout(wheelTimer);
      motion.current.drag = 0;
      pane.removeEventListener('wheel', wheel);
      pane.removeEventListener('pointerdown', down);
      pane.removeEventListener('pointermove', move);
      pane.removeEventListener('pointerup', up);
      pane.removeEventListener('pointercancel', cancel);
      pane.removeEventListener('click', click, true);
      root.removeEventListener('keydown', key);
    };
  }, [active]);
  const lg = L.forLevel(focus),
    edition = window.cmCollectibles[focus],
    legend = window.cmLegends[focus],
    reached = focus <= level,
    current = focus === level,
    ready = focus === pendingLevel && xp >= xpNext;
  const lastLegend = React.useRef(legend);
  if (legend) lastLegend.current = legend;
  const story = legend || lastLegend.current,
    legendInk = story?.edition.ink || '#eacb87';
  const progress = Math.max(0, Math.min(1, xp / Math.max(1, xpNext))),
    fmt = n => Math.max(0, n).toLocaleString('en-US').replaceAll(',', ' ');
  const pct = n => {
    const v = L.rbPercent ? L.rbPercent(n) : 0;
    return (Math.round(v * 10) / 10).toString().replace('.', ',') + '%';
  };
  const reward = n => n === TOTAL ? 'Финал коллекции · кэшбек ' + pct(n) : window.cmLegends[n] ? 'Легендарная карта · история · награда ×2' : L.rankForLevel(n) === 'A' ? 'Туз · грант-награда · кэшбек ' + pct(n) : window.cmCollectibles[n] ? 'Особая карта · кэшбек ' + pct(n) : 'Кэшбек ' + pct(n) + ' · награда-сюрприз';
  const position = d => d < 0 ? (d + 1) * 86 : d === 0 ? 86 : 306 + (d - 1) * 86; // рівний проміжок 10px між рядками
  return /*#__PURE__*/React.createElement("section", {
    ref: rootRef,
    className: "rb-collection",
    "data-focus": focus,
    "data-legend": !!legend && reached,
    style: {
      '--story-tint': legendInk + '24',
      '--story-ink': legendInk
    },
    "aria-label": "\u041F\u0443\u0442\u044C \u043D\u0430\u0433\u0440\u0430\u0434",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-collection-atmosphere",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("header", {
    className: "rb-collection-summary"
  }, /*#__PURE__*/React.createElement("span", null, "\u0412\u0410\u0428 \u041F\u0423\u0422\u042C"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, level), " / ", TOTAL, " \u043A\u0430\u0440\u0442"), /*#__PURE__*/React.createElement("div", {
    className: "rb-collection-overall",
    role: "progressbar",
    "aria-label": "\u041E\u0442\u043A\u0440\u044B\u0442\u043E \u043A\u0430\u0440\u0442",
    "aria-valuemin": 0,
    "aria-valuemax": TOTAL,
    "aria-valuenow": level
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      width: `${level / TOTAL * 100}%`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    ref: paneRef,
    className: "rb-collection-route",
    tabIndex: 0,
    "aria-label": "\u0412\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u043F\u0443\u0442\u044C \u043A\u0430\u0440\u0442. \u0421\u0432\u0430\u0439\u043F \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0430 \u043D\u0430 \u043E\u0434\u0438\u043D \u0443\u0440\u043E\u0432\u0435\u043D\u044C."
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-collection-rail",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("i", null)), Array.from({
    length: TOTAL
  }, (_, i) => {
    const n = i + 1,
      d = n - focus,
      selected = d === 0,
      owned = n <= level,
      isReady = n === pendingLevel,
      lgN = L.forLevel(n),
      special = window.cmCollectibles[n],
      leg = window.cmLegends[n],
      visible = d >= -1 && d <= 3;
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      className: "rb-collection-step",
      "data-card-level": n,
      "data-selected": selected,
      "data-past": d < 0,
      "data-ready": isReady,
      "data-owned": owned,
      "data-visible": visible,
      style: {
        transform: `translateY(${position(d)}px)`,
        '--card-tint': owned ? lgN.color + '18' : '#ffffff05'
      },
      "aria-hidden": !visible
    }, /*#__PURE__*/React.createElement("button", {
      className: "rb-collection-node",
      tabIndex: visible ? 0 : -1,
      onClick: () => focusCard(n),
      "aria-label": `Уровень ${n}${owned ? ', открыт' : ', закрыт'}`
    }, n), /*#__PURE__*/React.createElement("button", {
      className: "rb-collection-art",
      "aria-label": owned ? L.cardForLevel(n) : `Закрытая карта, уровень ${n}`,
      tabIndex: visible ? 0 : -1,
      onClick: () => {
        if (selected && isReady) onUnlock?.();else if (selected && owned && leg) onFlip(n);else focusCard(n);
      }
    }, Math.abs(d) <= 4 && (owned ? /*#__PURE__*/React.createElement(window.RbRouteCard3D, {
      level: n,
      sealed: false,
      active: selected && active,
      side: -1,
      w: 150,
      h: 198
    }) : /*#__PURE__*/React.createElement("span", {
      className: "rb-closed-card",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("svg", {
      width: "108",
      height: "153",
      viewBox: "0 0 108 153",
      fill: "none"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "2",
      y: "2",
      width: "104",
      height: "149",
      rx: "8",
      fill: "#202127",
      stroke: "#666872"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "8",
      y: "8",
      width: "92",
      height: "137",
      rx: "5",
      stroke: "#393b44"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M43 72v-9a11 11 0 0 1 22 0v9",
      stroke: "#a9abb5",
      strokeWidth: "3",
      strokeLinecap: "round"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "37",
      y: "71",
      width: "34",
      height: "28",
      rx: "7",
      fill: "#9497a4"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "54",
      cy: "83",
      r: "3",
      fill: "#25262e"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M54 84v6",
      stroke: "#25262e",
      strokeWidth: "2.5",
      strokeLinecap: "round"
    }))))), /*#__PURE__*/React.createElement("div", {
      className: "rb-collection-copy"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rb-collection-eyebrow"
    }, selected ? isReady ? 'МОЖНО ОТКРЫТЬ' : n === level ? 'ТВОЯ КАРТА' : owned ? 'УЖЕ В КОЛЛЕКЦИИ' : 'ВПЕРЕДИ' : owned ? 'ПРОЙДЕНО' : isReady ? `УРОВЕНЬ ${n} · ГОТОВА` : `УРОВЕНЬ ${n} · ЗАКРЫТА`), /*#__PURE__*/React.createElement("strong", null, selected ? `Уровень ${n}` : owned ? L.cardForLevel(n) : 'Закрытая карта'), selected && /*#__PURE__*/React.createElement("span", {
      className: "rb-collection-rank"
    }, owned ? L.cardForLevel(n) : 'Закрыта', /*#__PURE__*/React.createElement("small", null, owned ? 'В коллекции' : isReady ? 'Снимите печать' : 'Играйте, чтобы открыть')), /*#__PURE__*/React.createElement("span", {
      className: "rb-collection-reward"
    }, !owned ? isReady ? 'Нажмите, чтобы открыть' : reward(n) : selected ? 'Ваш статус · кэшбек ' + pct(n) : reward(n)), selected && /*#__PURE__*/React.createElement(React.Fragment, null, leg && owned && /*#__PURE__*/React.createElement("div", {
      className: "rb-collection-signature"
    }, /*#__PURE__*/React.createElement("em", null, leg.name), /*#__PURE__*/React.createElement("button", {
      className: "rb-collection-story",
      onClick: () => onFlip(n)
    }, "\u0418\u0441\u0442\u043E\u0440\u0438\u044F \u043A\u0430\u0440\u0442\u044B")), !owned && !isReady && /*#__PURE__*/React.createElement("span", {
      className: "rb-collection-locked"
    }, "\u041E\u0442\u043A\u0440\u043E\u0435\u0442\u0441\u044F \u043D\u0430 \u0443\u0440\u043E\u0432\u043D\u0435 ", n, " \xB7 ", n - level, " ", n - level === 1 ? 'карта' : n - level < 5 ? 'карты' : 'карт', " \u0432\u043F\u0435\u0440\u0435\u0434\u0438"))));
  })), /*#__PURE__*/React.createElement("footer", {
    className: "rb-collection-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-collection-next"
  }, /*#__PURE__*/React.createElement("strong", null, pendingLevel ? 'Награда готова' : level === TOTAL ? 'Коллекция собрана' : 'До следующей карты'), /*#__PURE__*/React.createElement("span", null, level === TOTAL ? `${TOTAL} / ${TOTAL}` : `${fmt(xp)} / ${fmt(xpNext)} XP`)), /*#__PURE__*/React.createElement("div", {
    className: "rb-collection-meter",
    role: "progressbar",
    "aria-label": "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0434\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u043A\u0430\u0440\u0442\u044B",
    "aria-valuemin": 0,
    "aria-valuemax": xpNext,
    "aria-valuenow": Math.min(xp, xpNext)
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: `${level === TOTAL ? 100 : progress * 100}%`
    }
  })), pendingLevel && xp >= xpNext ? /*#__PURE__*/React.createElement("button", {
    className: "rb-collection-primary",
    onClick: onUnlock
  }, "\u0417\u0430\u0431\u0440\u0430\u0442\u044C ", L.cardForLevel(pendingLevel), " ", /*#__PURE__*/React.createElement("span", null, "\xB7"), " \u0423\u0440\u043E\u0432\u0435\u043D\u044C ", pendingLevel) : /*#__PURE__*/React.createElement("button", {
    className: "rb-collection-return",
    onClick: () => focus === level ? focusCard(Math.min(TOTAL, level + 1)) : focusCard(level)
  }, focus === level ? 'Следующая награда' : 'К моей карте'), /*#__PURE__*/React.createElement("p", null, "\u0418\u0433\u0440\u0430\u0439\u0442\u0435 \u2192 \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0439\u0442\u0435 \u043A\u0430\u0440\u0442\u044B \u2192 \u043F\u043E\u0432\u044B\u0448\u0430\u0439\u0442\u0435 \u043A\u044D\u0448\u0431\u0435\u043A")));
}

// ── Ізометричний шлях (v3, правка Вадима 17.09): дорога хвилями в 3D,
// фокус переходить з карти на карту при скролі/свайпі, камера їде за ним.
// Сцена — RbIsoMap3D (cardhouse-3d.jsx), стиль dot-islands по синусоїді.
const RULER_SP = 14; // крок рисочок шкали, px
function RbIsoPath({
  openOwned = false,
  level,
  xp = 0,
  xpNext = 1000,
  pendingLevel = null,
  onUnlock,
  onFlip,
  onLocked,
  active = true,
  entrance = null,
  onSceneReady = null
}) {
  const initial = level,
    L = window.cmLeague,
    TOTAL = L.TOTAL || 65,
    [focus, setFocus] = React.useState(initial),
    rootRef = React.useRef(null),
    paneRef = React.useRef(null),
    labelsRef = React.useRef({}),
    rulerRef = React.useRef(null),
    rulerBoxRef = React.useRef(null);
  const motion = React.useRef({
      value: initial,
      velocity: 0,
      target: initial,
      drag: 0,
      focus: initial
    }),
    navigateRef = React.useRef(null);
  const focusCard = n => {
    const next = Math.max(1, Math.min(TOTAL, n)),
      previous = motion.current.focus;
    if (next !== previous) window.cmCardWheelAudio?.play(next - previous);
    motion.current.target = next;
    motion.current.focus = next;
    motion.current.drag = 0;
    setFocus(next);
  };
  React.useEffect(() => {
    const root = rootRef.current,
      audio = window.cmCardWheelAudio;
    if (!root || !audio || !active) return;
    // Resume from touch-down/key-down before the first drag detent on mobile.
    const warm = () => audio.prepare();
    root.addEventListener('pointerdown', warm, {
      capture: true,
      passive: true
    });
    root.addEventListener('keydown', warm, true);
    return () => {
      root.removeEventListener('pointerdown', warm, true);
      root.removeEventListener('keydown', warm, true);
      audio.stop();
    };
  }, [active]);
  navigateRef.current = focusCard;
  React.useEffect(() => {
    motion.current = {
      value: initial,
      velocity: 0,
      target: initial,
      drag: 0,
      focus: initial
    };
    setFocus(initial);
  }, [level, pendingLevel]);
  // шкала їде під нерухомим покажчиком: обрана карта завжди по центру лінійки
  React.useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = rulerRef.current;
      if (el && el.parentElement) {
        const h = el.parentElement.clientHeight,
          v = motion.current.value + motion.current.drag;
        el.style.transform = `translateY(${h / 2 - (TOTAL - v) * RULER_SP}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  React.useEffect(() => {
    const pane = paneRef.current,
      root = rootRef.current;
    if (!pane || !active) return;
    let gesture = null,
      swallowClick = false,
      wheelSum = 0,
      wheelUsed = false,
      wheelTimer = 0;
    const step = dir => navigateRef.current(motion.current.focus + dir);
    const wheel = e => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelSum = 0;
        wheelUsed = false;
      }, 200);
      if (wheelUsed) return;
      wheelSum += e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? pane.clientHeight : 1);
      if (Math.abs(wheelSum) > 25) {
        wheelUsed = true;
        step(-Math.sign(wheelSum));
      }
    };
    const down = e => {
      if (!e.isPrimary || e.button !== 0) return;
      gesture = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        dy: 0
      };
      swallowClick = false;
    };
    const move = e => {
      if (!gesture || gesture.id !== e.pointerId) return;
      const scale = pane.getBoundingClientRect().height / pane.clientHeight || 1;
      gesture.dy = (e.clientY - gesture.y) / scale;
      const dx = (e.clientX - gesture.x) / scale;
      if (Math.abs(gesture.dy) > 7 && Math.abs(gesture.dy) > Math.abs(dx)) {
        e.preventDefault();
        swallowClick = true;
        if (!pane.hasPointerCapture(e.pointerId)) pane.setPointerCapture(e.pointerId);
        motion.current.drag = Math.max(-.7, Math.min(.7, gesture.dy / 125));
      }
    };
    const up = e => {
      if (!gesture || gesture.id !== e.pointerId) return;
      const dy = gesture.dy;
      gesture = null;
      if (pane.hasPointerCapture(e.pointerId)) pane.releasePointerCapture(e.pointerId);
      motion.current.drag = 0;
      if (swallowClick && Math.abs(dy) > 32) step(Math.sign(dy));
    };
    const cancel = () => {
      gesture = null;
      motion.current.drag = 0;
    };
    const click = e => {
      if (swallowClick && e.detail !== 0) {
        e.preventDefault();
        e.stopPropagation();
        swallowClick = false;
      }
    };
    const key = e => {
      if (['ArrowDown', 'PageDown', 'ArrowUp', 'PageUp', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
        if (e.key === 'Home') navigateRef.current(1);else if (e.key === 'End') navigateRef.current(TOTAL);else step(['ArrowDown', 'PageDown'].includes(e.key) ? -1 : 1);
      }
    };
    pane.addEventListener('wheel', wheel, {
      passive: false
    });
    pane.addEventListener('pointerdown', down);
    pane.addEventListener('pointermove', move, {
      passive: false
    });
    pane.addEventListener('pointerup', up);
    pane.addEventListener('pointercancel', cancel);
    pane.addEventListener('click', click, true);
    root.addEventListener('keydown', key);
    return () => {
      clearTimeout(wheelTimer);
      motion.current.drag = 0;
      pane.removeEventListener('wheel', wheel);
      pane.removeEventListener('pointerdown', down);
      pane.removeEventListener('pointermove', move);
      pane.removeEventListener('pointerup', up);
      pane.removeEventListener('pointercancel', cancel);
      pane.removeEventListener('click', click, true);
      root.removeEventListener('keydown', key);
    };
  }, [active]);
  // шкала праворуч — барабан: тягнемо пальцем, карти йдуть 1:1 за рисочками (багато за один рух)
  React.useEffect(() => {
    const box = rulerBoxRef.current;
    if (!box || !active) return;
    let g = null;
    const down = e => {
      if (!e.isPrimary || e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      const scale = box.getBoundingClientRect().height / box.clientHeight || 1;
      g = {
        id: e.pointerId,
        y: e.clientY,
        from: motion.current.focus,
        scale,
        last: motion.current.focus
      };
      box.setPointerCapture(e.pointerId);
      box.dataset.drag = '1';
    };
    const move = e => {
      if (!g || g.id !== e.pointerId) return;
      e.preventDefault();
      const n = Math.max(1, Math.min(TOTAL, Math.round(g.from + (e.clientY - g.y) / g.scale / RULER_SP)));
      if (n !== g.last) {
        g.last = n;
        navigateRef.current(n);
      }
    };
    const up = e => {
      if (!g || g.id !== e.pointerId) return;
      g = null;
      delete box.dataset.drag;
      if (box.hasPointerCapture(e.pointerId)) box.releasePointerCapture(e.pointerId);
    };
    box.addEventListener('pointerdown', down);
    box.addEventListener('pointermove', move, {
      passive: false
    });
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
    return () => {
      box.removeEventListener('pointerdown', down);
      box.removeEventListener('pointermove', move);
      box.removeEventListener('pointerup', up);
      box.removeEventListener('pointercancel', up);
    };
  }, [active]);
  const lg = L.forLevel(focus),
    legend = window.cmLegends[focus],
    special = window.cmSpecials[focus],
    reached = focus <= level;
  const lastLegend = React.useRef(legend);
  if (legend) lastLegend.current = legend;
  const story = legend || lastLegend.current,
    legendInk = story?.edition.ink || '#eacb87';
  const fmt = n => Math.max(0, n).toLocaleString('en-US').replaceAll(',', ' ');
  const pct = n => {
    const v = L.rbPercent ? L.rbPercent(n) : 0;
    return (Math.round(v * 10) / 10).toString().replace('.', ',') + '%';
  };
  const rw = L.cardReward ? L.cardReward(focus) : null;
  const owned = focus <= level,
    isReady = focus === pendingLevel && xp >= xpNext,
    current = focus === level;
  // що дає ця карта — плаваючий напис над картою (рендериться спрайтом у сцені)
  const ex = n => '+' + (Math.round(L.rbExtra(n) * 10) / 10).toString().replace('.', ',') + '%';
  const valueText = {
    title: isReady ? 'РАЗБЛОКИРУЙТЕ — БОНУС ОТ КАРТЫ' : 'БОНУС ОТ КАРТЫ',
    big: ex(focus),
    unit: 'К БАЗОВОМУ РЕЙКБЕКУ',
    sub: current ? '' : legend ? 'Легендарная · награда ×2 · история чемпиона' : owned ? rw ? `Награда получена · ${rw.text}` : '' : 'Под картой награда-сюрприз',
    gold: !!legend
  };
  const status = current ? 'Ваш статус · кэшбек ' + pct(focus) + ' · рамка масти' : owned ? legend ? 'Легендарная карта · история · награда ×2' : special ? special.name + ' · особая карта · кэшбек ' + pct(focus) : 'Кэшбек ' + pct(focus) + ' · награда получена' : isReady ? 'Нажмите «Забрать», чтобы снять печать' : focus - level + ' ' + (focus - level === 1 ? 'карта' : focus - level < 5 ? 'карты' : 'карт') + ' впереди · кэшбек ' + pct(focus) + (legend ? ' · легендарная' : '') + ' · награда-сюрприз';
  return /*#__PURE__*/React.createElement("section", {
    ref: rootRef,
    className: "rb-iso",
    "data-legend": !!legend && reached,
    "data-ready": isReady,
    style: {
      '--legend-wash': legendInk + '2e',
      '--legend-haze': legendInk + '1c'
    },
    "aria-label": "\u041F\u0443\u0442\u044C \u043D\u0430\u0433\u0440\u0430\u0434",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-legend-light",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-value",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-value-l"
  }, valueText.title), /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-value-big"
  }, valueText.big), /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-value-unit"
  }, valueText.unit), valueText.sub && /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-value-s",
    style: valueText.gold ? {
      color: '#e9c77e'
    } : null
  }, valueText.sub)), (() => {
    const nextN = Math.min(TOTAL, level + 1),
      done = level >= TOTAL,
      ready = !!pendingLevel && xp >= xpNext,
      p = done ? 1 : Math.max(0, Math.min(1, xp / Math.max(1, xpNext)));
    return /*#__PURE__*/React.createElement("div", {
      className: "rb-iso-next"
    }, /*#__PURE__*/React.createElement("div", {
      className: "rb-iso-next-row"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rb-iso-next-l"
    }, /*#__PURE__*/React.createElement("span", {
      className: "rb-iso-next-status"
    }, done ? "КОЛЛЕКЦИЯ СОБРАНА" : ready ? "ГОТОВА К РАЗБЛОКИРОВКЕ" : "ДО КАРТЫ"), !done && /*#__PURE__*/React.createElement("b", {
      "data-i18n": "off"
    }, L.cardForLevel(nextN))), /*#__PURE__*/React.createElement("span", {
      className: "rb-iso-next-v"
    }, done ? `${TOTAL} / ${TOTAL}` : `${fmt(Math.min(xp, xpNext))} / ${fmt(xpNext)} XP`)), /*#__PURE__*/React.createElement("div", {
      className: "rb-iso-total",
      role: "progressbar",
      "aria-label": "\u041F\u0440\u043E\u0433\u0440\u0435\u0441\u0441 \u0434\u043E \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439 \u043A\u0430\u0440\u0442\u044B",
      "aria-valuemin": 0,
      "aria-valuemax": xpNext,
      "aria-valuenow": Math.min(xp, xpNext)
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: `${p * 100}%`
      }
    })));
  })(), story && /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-legend-intro",
    "data-active": !!legend && reached
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-legend-flare",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-legend-content"
  }, /*#__PURE__*/React.createElement("p", {
    className: "rb-iso-autograph"
  }, story.name), /*#__PURE__*/React.createElement("p", {
    className: "rb-iso-legend-fact"
  }, story.title, " \xB7 WSOP ", story.year), /*#__PURE__*/React.createElement("button", {
    className: "rb-iso-read",
    disabled: !legend || !reached,
    onClick: () => legend && reached && onFlip(focus)
  }, "\u0418\u0421\u0422\u041E\u0420\u0418\u042F"))), /*#__PURE__*/React.createElement("div", {
    ref: paneRef,
    className: "rb-iso-viewport",
    tabIndex: 0,
    "aria-label": "\u0418\u0437\u043E\u043C\u0435\u0442\u0440\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u043F\u0443\u0442\u044C. \u0421\u0432\u0430\u0439\u043F \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0430 \u043D\u0430 \u043E\u0434\u0438\u043D \u0443\u0440\u043E\u0432\u0435\u043D\u044C."
  }, /*#__PURE__*/React.createElement(window.RbIsoMap3D, {
    level: level,
    xp: xp,
    xpNext: xpNext,
    motion: motion,
    labelsRef: labelsRef,
    active: active,
    entrance: entrance,
    onSceneReady: onSceneReady
  }), /*#__PURE__*/React.createElement("button", {
    className: "rb-iso-tap",
    "aria-label": isReady ? 'Забрать карту' : owned ? 'Открыть карту' : 'Карта ещё закрыта',
    onClick: () => {
      if (isReady) onUnlock?.();else if (owned && (legend || openOwned)) onFlip(focus);else if (!owned) onLocked?.(focus);
    },
    style: {
      cursor: isReady || !owned || owned && (legend || openOwned) ? 'pointer' : 'default'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-ruler",
    ref: rulerBoxRef,
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-ruler-track",
    ref: rulerRef
  }, Array.from({
    length: TOTAL
  }, (_, i) => {
    const n = i + 1,
      rankStart = TOTAL <= 13 || (n - 1) % 4 === 0,
      leg = !!window.cmLegends[n],
      sel = n === focus;
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      className: "rb-iso-tick",
      "data-sel": sel,
      "data-owned": n <= level,
      "data-current": n === level,
      "data-rank": rankStart,
      "data-legend": leg,
      style: {
        top: (TOTAL - n) * RULER_SP
      }
    }, sel && /*#__PURE__*/React.createElement("span", {
      className: "rb-iso-tick-val"
    }, "+", (Math.round(L.rbExtra(n) * 10) / 10).toString().replace('.', ','), "%"), rankStart && !sel && /*#__PURE__*/React.createElement("span", {
      className: "rb-iso-tick-rank"
    }, L.rankForLevel(n)), /*#__PURE__*/React.createElement("i", null));
  }))));
}

// Full-screen safe opening: сейф відкривається, сума рахується вгору.
// amount уже містить внутрішній множник ліги — гравець бачить лише підсумок.
function RbSafeReveal({
  amount = 24.8,
  accent = "#D71921",
  onClose
}) {
  const [phase, setPhase] = React.useState(0);
  const sheetRef = React.useRef(null);
  React.useEffect(() => {
    let done = false;
    const fire = () => {
      if (done) return;
      done = true;
      setPhase(1);
      if (window.playClick) window.playClick(1950, 0.06);
    };
    const el = sheetRef.current;
    const anims = el && el.getAnimations ? el.getAnimations() : [];
    if (anims.length && anims[0].finished) anims[0].finished.then(fire).catch(() => {});
    const guard = setTimeout(fire, 6000);
    return () => {
      done = true;
      clearTimeout(guard);
    };
  }, []);
  const val = useCountUp(amount, phase >= 1, 850);
  const shown = phase >= 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 90,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      background: "rgba(6,6,8,.66)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 78% 44% at 50% 40%, ${accent}2b, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 74,
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".06em",
      color: "#CDD2DB"
    }
  }, "CASHBACK SAFE"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      alignSelf: "stretch",
      width: "100%",
      aspectRatio: "476 / 580",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("img", {
    ref: sheetRef,
    src: RB_OPEN_SHEET,
    alt: "",
    style: {
      height: "100%",
      width: `${RB_OPEN_FRAMES * 100}%`,
      display: "block",
      animation: `rb-open 2.65s steps(${RB_OPEN_FRAMES - 1}) forwards`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      textAlign: "center",
      marginTop: -8,
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 420ms, transform 420ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".06em",
      color: "#CDD2DB"
    }
  }, "CASHBACK CLAIMED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_R,
      fontWeight: 700,
      fontSize: 46,
      color: "#f0c75e",
      letterSpacing: ".01em",
      marginTop: 8,
      textShadow: "0 0 30px rgba(240,199,94,.35)",
      fontVariantNumeric: "tabular-nums"
    }
  }, "+$", val.toFixed(2)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_R,
      fontWeight: 500,
      fontSize: 15,
      color: "#CDD2DB",
      marginTop: 8
    }
  }, "Added to your balance")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      position: "relative",
      marginTop: 26,
      padding: "14px 44px",
      borderRadius: UI.r.pill,
      border: 0,
      cursor: "pointer",
      background: accent,
      color: "#fff",
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".06em",
      boxShadow: `0 10px 26px ${accent}66`,
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 420ms 80ms, transform 420ms 80ms cubic-bezier(0.2,0.8,0.2,1)",
      pointerEvents: shown ? "auto" : "none"
    }
  }, "CONTINUE"));
}

// ── Історія нагород (спека §5) ───────────────────────────────────────────
// Демо-події за 30 днів: відкриття доміка і карти рівня. Відсоток —
// фактичний: нагороди за період / згенерований рейк за той самий період.
const RB_HIST = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807 + 11) % 2147483647;
    return seed / 2147483647;
  };
  const out = [];
  for (let d = 0; d < 30; d++) {
    const rake = Math.round(12 + rnd() * 38); // $ рейку за день
    const ev = [];
    if (rnd() < 0.55) ev.push({
      kind: "house",
      amount: 10 + Math.round(rnd() * 3) * 0.5
    });
    if (rnd() < 0.22) ev.push({
      kind: "card",
      amount: [2, 3, 5, 8][Math.floor(rnd() * 4)],
      label: ["SPIN & WIN TICKET", "BONUS CASH", "DAILY TICKET", "BONUS CASH"][Math.floor(rnd() * 4)]
    });
    out.push({
      day: d,
      rake,
      ev
    });
  }
  return out;
})();
window.RB_HIST_PUSH = ev => {
  RB_HIST[0].ev.unshift(ev);
};
function rbDayLabel(d) {
  return d === 0 ? "TODAY" : d === 1 ? "YESTERDAY" : d + " DAYS AGO";
}
function RbHistory({
  accent,
  lgColor
}) {
  const textAccent = window.cmLeague.shade(lgColor, 62);
  const [period, setPeriod] = React.useState(7);
  const days = RB_HIST.slice(0, period);
  const rake = days.reduce((n, d) => n + d.rake, 0);
  const got = days.reduce((n, d) => n + d.ev.reduce((m, e) => m + e.amount, 0), 0);
  const pct = rake ? Math.round(got / rake * 100) : 0;
  const money = v => "$" + Number(v).toFixed(2);
  const events = [];
  days.forEach(d => d.ev.forEach(e => events.push({
    ...e,
    day: d.day
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 18px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      background: "#25262e",
      borderRadius: UI.r.pill,
      padding: 3
    }
  }, [[7, "7 DAYS"], [30, "30 DAYS"]].map(([v, l]) => /*#__PURE__*/React.createElement("button", {
    key: v,
    onClick: () => {
      if (window.playClick) window.playClick(1000, .03);
      setPeriod(v);
    },
    style: {
      flex: 1,
      minHeight: 50,
      padding: "12px 0",
      borderRadius: UI.r.pill,
      border: 0,
      cursor: "pointer",
      background: period === v ? accent : "transparent",
      color: period === v ? "#fff" : "rgba(255,255,255,.74)",
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".06em",
      transition: "background 160ms"
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 0,
      marginTop: 18,
      borderRadius: UI.r.lg,
      padding: "18px 0",
      background: UI.surface1,
      border: `1px solid ${UI.hairline}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px",
      borderRight: `1px solid ${UI.hairline}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".06em",
      color: "#CDD2DB"
    }
  }, "RECEIVED"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: MONO_R,
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 1,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, money(got))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".06em",
      color: "#CDD2DB"
    }
  }, "OF RAKE"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: MONO_R,
      fontWeight: 700,
      fontSize: 24,
      lineHeight: 1,
      color: textAccent,
      fontVariantNumeric: "tabular-nums"
    }
  }, pct, "%"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      fontFamily: SANS_R,
      fontWeight: 600,
      fontSize: 14,
      color: "#AFB6C2",
      whiteSpace: "nowrap"
    }
  }, money(rake), " ", /*#__PURE__*/React.createElement("span", null, "RAKE")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: SANS_R,
      fontWeight: 600,
      fontSize: 15,
      lineHeight: 1.6,
      color: "#BCC3CE",
      textWrap: "pretty"
    }
  }, "Demo history: rewards received divided by rake generated in the same period. The result differs from the estimated league rate."), /*#__PURE__*/React.createElement(RbSectionTitle, {
    accent: accent
  }, "EVENTS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, events.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "26px 0",
      textAlign: "center",
      fontFamily: SANS_R,
      fontWeight: 600,
      fontSize: 15,
      letterSpacing: ".12em",
      color: "#AFB6C2"
    }
  }, "NO REWARDS IN THIS PERIOD"), events.map((e, i) => {
    const house = e.kind === "house";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "18px 0",
        borderBottom: `1px solid ${UI.hairline}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: house ? `${lgColor}22` : "rgba(240,199,94,.12)",
        border: `1px solid ${house ? lgColor + "66" : "rgba(240,199,94,.4)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, house ? /*#__PURE__*/React.createElement("svg", {
      "aria-hidden": "true",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: textAccent,
      strokeWidth: "1.65",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 21 7.5 12.5 12 21M12 21l4.5-8.5L21 21M7.5 12.5 12 4l4.5 8.5M5.5 12.5h13"
    })) : /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#f0c75e",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "3",
      width: "14",
      height: "18",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 8h.01M15 16h.01"
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: MONO_R,
        fontWeight: 700,
        fontSize: 16,
        color: "#fff",
        lineHeight: 1.4,
        overflowWrap: "anywhere"
      }
    }, house ? "CARD HOUSE OPENED" : "LEVEL CARD · " + e.label), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        marginTop: 3,
        fontFamily: SANS_R,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: ".06em",
        color: "#AFB6C2"
      }
    }, rbDayLabel(e.day))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        fontFamily: MONO_R,
        fontWeight: 700,
        fontSize: 17,
        color: house ? textAccent : "#f0c75e",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap"
      }
    }, "+", money(e.amount)));
  })));
}

// ── Відкриття доміка: сума — інтрига до кінця анімації ───────────────────
// Спільний екран нарахування: карти розлітаються, сума «набігає». Використовується
// і для картного будинку, і для нагороди під відкритою картою.
function RbRewardReveal({
  amount,
  format,
  kicker = "CARD HOUSE",
  label = "CASHBACK CLAIMED",
  note = "Demo reward recorded. All accumulated cycle XP has been collected.",
  button = "COLLECT",
  accent,
  lgColor,
  ru = false,
  onClose
}) {
  const [phase, setPhase] = React.useState(0); // 0 — карти летять, 1 — сума
  React.useEffect(() => {
    const t = setTimeout(() => {
      setPhase(1);
      if (window.playClick) window.playClick(1950, .06);
    }, 700);
    return () => clearTimeout(t);
  }, []);
  const n = useCountUp(amount, phase === 1, 1300);
  const fmt = format || (v => "$" + v.toFixed(2));
  const off = ru ? {
    "data-i18n": "off"
  } : {};
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      if (phase === 1) onClose();
    },
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 80,
      background: "rgba(0,0,0,.86)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      animation: "pp-fadeIn .25s ease"
    }
  }, /*#__PURE__*/React.createElement("span", _extends({}, off, {
    style: {
      position: "absolute",
      top: 74,
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".06em",
      color: "#CDD2DB"
    }
  }), kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: 260,
      height: 160,
      marginLeft: -130,
      marginTop: -80,
      pointerEvents: "none"
    }
  }, Array.from({
    length: 12
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      left: 118,
      top: 60,
      width: 26,
      height: 36,
      borderRadius: 4,
      background: `linear-gradient(150deg, ${lgColor}, #0b0b0d)`,
      border: "1px solid rgba(255,255,255,.35)",
      animation: `rb-scatter${i % 4} 1.1s cubic-bezier(.2,.8,.2,1) ${i * 0.03}s both`,
      transform: `rotate(${i * 30}deg)`
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
      padding: "0 28px",
      opacity: phase ? 1 : 0,
      transform: phase ? "translateY(0)" : "translateY(12px)",
      transition: "opacity .4s, transform .5s cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", _extends({}, off, {
    style: {
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".06em",
      color: "#CDD2DB"
    }
  }), label), /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      marginTop: 10,
      fontFamily: MONO_R,
      fontWeight: 700,
      fontSize: 54,
      lineHeight: 1,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, fmt(n)), note && /*#__PURE__*/React.createElement("div", _extends({}, off, {
    style: {
      marginTop: 10,
      fontFamily: SANS_R,
      fontWeight: 600,
      fontSize: 15,
      color: "#BCC3CE"
    }
  }), note), /*#__PURE__*/React.createElement("button", _extends({}, off, {
    onClick: onClose,
    style: Object.assign(UI.btn("l", "primary", accent), {
      margin: "22px auto 0",
      minWidth: 240,
      maxWidth: "100%",
      minHeight: 56,
      fontSize: 16,
      textAlign: "center"
    })
  }), button)));
}
// Session-only prototype ledger. Credits are idempotent and feed the existing wallet screen.
window.cmRewardWallet = window.cmRewardWallet || {
  totals: {
    cash: 0,
    tdollar: 0,
    main: 0
  },
  receipts: new Set(),
  sequence: 0,
  credit(id, kind, amount) {
    if (this.receipts.has(id) || !['cash', 'tdollar', 'main'].includes(kind) || !Number.isFinite(amount) || amount < 0) return false;
    this.receipts.add(id);
    this.totals[kind] = Math.round(((this.totals[kind] || 0) + amount) * 100) / 100;
    window.dispatchEvent(new Event('reward-wallet-change'));
    return true;
  }
};
// One visible timeline drives coin positions, wallet reactions, and the amount.
const RB_REWARD_COINS = 8;
const RB_REWARD_DURATION = 4400;
function rbRewardCoinTiming(index) {
  return {
    start: 900 + index * 85,
    duration: 1650 + index % 3 * 90
  };
}
function rbRewardFrame(elapsed) {
  let fraction = 0,
    hits = 0,
    impact = 0;
  for (let i = 0; i < RB_REWARD_COINS; i++) {
    const t = rbRewardCoinTiming(i),
      since = elapsed - t.start - t.duration;
    if (since >= 0) {
      hits++;
      fraction += Math.min(1, since / 220);
      impact = Math.max(impact, Math.exp(-since / 120));
    }
  }
  return {
    fraction: fraction / RB_REWARD_COINS,
    hits,
    impact
  };
}
function rbRewardCoinPose(elapsed, i, w, h) {
  const t = rbRewardCoinTiming(i),
    p = Math.max(0, Math.min(1, (elapsed - t.start) / t.duration)),
    q = 1 - p;
  const sx = w / 2 + (i % 5 - 2) * 18,
    sy = h * .54 + 18 + i % 3 * 7,
    side = i % 2 ? 1 : -1,
    tx = w / 2 - 90,
    ty = 107;
  const c1x = w / 2 + side * (95 + i % 4 * 15),
    c1y = sy - 55,
    c2x = tx + side * 100,
    c2y = ty + 110;
  return {
    p,
    x: q * q * q * sx + 3 * q * q * p * c1x + 3 * q * p * p * c2x + p * p * p * tx,
    y: q * q * q * sy + 3 * q * q * p * c1y + 3 * q * p * p * c2y + p * p * p * ty,
    scale: p < .16 ? .45 + p / .16 * .55 : 1 - (p - .16) / .84 * .45,
    rotation: side * (p * 160 + i * 12),
    opacity: elapsed >= t.start && p < 1 ? Math.min(1, p / .07, (1 - p) / .07) : 0
  };
}
function RbRewardCoin({
  ticket = false
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 140 70",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "3",
    width: "136",
    height: "64",
    rx: "3",
    fill: ticket ? '#eee9dc' : '#20232a',
    stroke: ticket ? '#af955e' : '#9299a6'
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "7",
    width: "128",
    height: "56",
    rx: "1",
    fill: "none",
    stroke: ticket ? '#c6b589' : '#505764'
  }), /*#__PURE__*/React.createElement("text", {
    x: "13",
    y: "21",
    fontSize: "7",
    fill: ticket ? '#302b23' : '#eee'
  }, "POKERDOT"), /*#__PURE__*/React.createElement("text", {
    x: "12",
    y: "49",
    fontSize: "28",
    fontWeight: "700",
    fill: ticket ? '#302b23' : '#eee'
  }, ticket ? 'T$' : 'C$'), /*#__PURE__*/React.createElement("path", {
    d: "m104 18 17 17-17 17-17-17z",
    fill: "none",
    stroke: ticket ? '#aa8745' : '#dc2939'
  }));
}
if (!document.getElementById('rb-wallet-reward-style')) {
  const st = document.createElement('style');
  st.id = 'rb-wallet-reward-style';
  st.textContent = `
    .rb-pay{--impact:0;position:absolute;inset:0;z-index:100;isolation:isolate;overflow:hidden;background:radial-gradient(ellipse at 50% 55%,#29211660,transparent 55%),linear-gradient(180deg,${UI.surface1},#0b0c10 48%,#121016);color:${UI.text};font-family:${UI.fontUI};animation:pp-fadeIn 260ms ease}
    .rb-pay-halo{position:absolute;width:360px;height:320px;left:50%;top:48%;transform:translate(-50%,-50%);background:radial-gradient(ellipse,${UI.gold}19,transparent 65%);pointer-events:none;animation:rb-reward-light 1100ms ease-out both}
    .rb-pay-horizon{position:absolute;left:0;right:0;top:65%;height:1px;background:linear-gradient(90deg,transparent,${UI.gold}18,transparent)}
    .rb-pay-heading{position:absolute;top:27%;left:22px;right:22px;text-align:center;font-size:12px;font-weight:600;letter-spacing:.14em;color:${UI.textMute};animation:rb-reward-rise 500ms 120ms both}
    .rb-pay-center{position:absolute;left:22px;right:22px;top:31%;text-align:center;z-index:3;animation:rb-reward-rise 700ms 180ms cubic-bezier(.16,1,.3,1) both}
    .rb-pay .rb-pay-title{font:700 20px/1.3 ${UI.fontUI};letter-spacing:.04em;margin:0 0 10px}
    .rb-pay-sub{font-size:13px;line-height:1.5;color:${UI.textMute}}
    .rb-pay-amount{font:700 64px ${UI.font};line-height:1.15;letter-spacing:-.04em;margin:0 0 9px;font-variant-numeric:tabular-nums;color:#f5e3b5;text-shadow:0 2px 28px ${UI.gold}16;white-space:nowrap}
    .rb-pay-currency{font:500 12px ${UI.fontUI};color:${UI.textMute};letter-spacing:.03em}
    .rb-pay-emblem{position:absolute;left:50%;top:54%;width:204px;height:154px;transform:translate(-50%,-50%);perspective:700px;z-index:2;pointer-events:none}
    .rb-pay-emblem::after{content:'';position:absolute;left:-30px;right:-30px;bottom:-20px;height:60px;background:radial-gradient(ellipse,${UI.gold}23,transparent 68%);transform:scaleY(.45)}
    .rb-pay-stack{position:absolute;width:92px;height:92px;left:13px;bottom:0;transform:rotateX(57deg) rotateZ(-12deg);filter:drop-shadow(0 8px 6px #0008);animation:rb-reward-rise 700ms 240ms both}
    .rb-pay-stack:nth-child(2){left:90px;bottom:5px;transform:rotateX(57deg) rotateZ(17deg);animation-delay:320ms}
    .rb-pay-stack svg{position:absolute;inset:0;width:100%;height:100%}
    .rb-pay-medallion{position:absolute;left:50px;top:0;width:112px;height:112px;filter:drop-shadow(0 14px 12px #0009);animation:rb-reward-coin-arrive 950ms cubic-bezier(.16,1,.3,1) both}
    .rb-pay-medallion svg{width:100%;height:100%}
    .rb-pay[data-phase=complete] .rb-pay-medallion{animation:rb-reward-float 4s ease-in-out infinite}
    .rb-pay-wallet{position:absolute;top:62px;left:50%;width:274px;transform:translateX(-50%);z-index:6;pointer-events:none}
    .rb-pay-wallet-shell{animation:rb-wallet-open 760ms cubic-bezier(.16,1,.3,1) both}
    .rb-pay-wallet-body{position:relative;display:flex;align-items:center;gap:12px;height:90px;padding:17px 18px;border-radius:20px;background:linear-gradient(155deg,#ffffff15,#ffffff06 56%,${UI.accent}08),${UI.surface1};border:1px solid #ffffff24;box-shadow:0 16px 40px #0007,inset 0 1px 0 #ffffff14;transform:translateY(calc(var(--impact) * -2px)) scale(calc(1 + var(--impact) * .026));overflow:hidden}
    .rb-pay-wallet-body::after{content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 26px ${UI.gold}35;opacity:var(--impact);pointer-events:none}
    .rb-pay-wallet-icon{flex:none;width:38px;height:38px;border-radius:11px;background:linear-gradient(160deg,${UI.accent},${UI.accentPress});box-shadow:0 5px 16px ${UI.accent}24,inset 0 1px 0 #ffffff30;display:grid;place-items:center;color:#fff}
    .rb-pay-wallet-copy{flex:1;min-width:0}.rb-pay-wallet-copy small{display:block;font:600 12px ${UI.fontUI};letter-spacing:.11em;color:${UI.textMute};margin-bottom:7px;white-space:nowrap}
    .rb-pay-wallet-copy strong{display:block;font:700 22px ${UI.font};font-variant-numeric:tabular-nums;line-height:1.1;letter-spacing:-.025em;white-space:nowrap}
    .rb-pay-wallet-gain{display:flex;justify-content:center;align-items:center;gap:6px;height:26px;margin-top:10px;color:#f1d492;font:600 12px ${UI.fontUI};font-variant-numeric:tabular-nums;opacity:0;transform:translateY(6px);transition:opacity 240ms,transform 300ms}
    .rb-pay[data-receiving=true] .rb-pay-wallet-gain,.rb-pay[data-phase=complete] .rb-pay-wallet-gain{opacity:1;transform:none}
    .rb-pay-status{position:absolute;top:72%;left:20px;right:20px;display:flex;align-items:center;justify-content:center;gap:8px;text-align:center;font-size:13px;color:${UI.textMute}}
    .rb-pay-status svg{color:#efd28e}.rb-pay[data-phase=complete] .rb-pay-status{color:${UI.text}}
    .rb-pay-flight{position:absolute;inset:0;z-index:7;pointer-events:none}
    .rb-pay-coin{position:absolute;top:0;left:0;width:44px;height:44px;opacity:0;will-change:transform,opacity;filter:drop-shadow(0 4px 5px #0008)}
    .rb-pay-coin svg{width:100%;height:100%}
    .rb-pay-trail{position:absolute;left:0;top:0;width:9px;height:30px;border-radius:50%;background:linear-gradient(0deg,transparent,${UI.gold}a6);filter:blur(3px);opacity:0;will-change:transform,opacity}
    .rb-pay-actions{position:absolute;left:24px;right:24px;bottom:42px;display:flex;flex-direction:column;gap:12px;align-items:stretch;z-index:8}
    .rb-pay[data-phase=flying] .rb-pay-actions{opacity:0;pointer-events:none}
    .rb-pay[data-phase=complete] .rb-pay-actions{animation:rb-reward-rise 500ms cubic-bezier(.16,1,.3,1) both}
    .rb-pay-primary,.rb-pay-secondary{min-height:54px;border-radius:999px;font:700 14px ${UI.fontUI};cursor:pointer;letter-spacing:.12em}
    .rb-pay-primary{background:linear-gradient(180deg,#e73543,${UI.accent} 55%,${UI.accentPress});color:${UI.text};border:1px solid #ffffff12;box-shadow:0 6px 24px ${UI.accent}18}
    .rb-pay-primary:disabled{cursor:default}.rb-pay-primary:focus-visible{outline:2px solid #fff;outline-offset:4px}
    .rb-pay-secondary{border:0;background:none;color:${UI.textMute};min-height:38px}
    .rb-pay-options{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:28px}
    .rb-pay-option{min-height:166px;padding:22px 10px;border-radius:24px;border:1px solid ${UI.hairline};background:linear-gradient(160deg,#ffffff08,#ffffff01);color:${UI.text};cursor:pointer;display:flex;flex-direction:column;gap:12px;align-items:center;justify-content:center}
    .rb-pay-option:hover,.rb-pay-option:focus-visible{border-color:${UI.gold}99}
    .rb-pay-option b{font:700 28px ${UI.font};white-space:nowrap}.rb-pay-option small{font-size:12px;font-weight:500;color:${UI.textMute}}
    .rb-pay-option-icon{display:grid;place-items:center;width:40px;height:40px;border:1px solid ${UI.gold}55;border-radius:50%;color:#e9c77e;font-size:17px}
    .rb-pay[data-phase=choose] .rb-pay-heading{top:20%}.rb-pay[data-phase=choose] .rb-pay-center{top:35%}
    @keyframes rb-wallet-open{0%{opacity:0;transform:translateY(-24px) scale(.82,.62)}70%{opacity:1;transform:translateY(3px) scale(1.025)}100%{opacity:1;transform:none}}
    @keyframes rb-reward-rise{from{opacity:0;translate:0 14px}to{opacity:1;translate:0 0}}
    @keyframes rb-reward-light{from{opacity:0;scale:.55}to{opacity:1;scale:1}}
    @keyframes rb-reward-coin-arrive{0%{opacity:0;transform:translateY(35px) rotateY(-65deg) rotateZ(-18deg) scale(.6)}70%{opacity:1;transform:translateY(-5px) rotateY(12deg) rotateZ(4deg)}100%{opacity:1;transform:translateY(0) rotateY(-14deg) rotateZ(-8deg)}}
    @keyframes rb-reward-float{0%,100%{transform:translateY(0) rotateY(-14deg) rotateZ(-8deg)}50%{transform:translateY(-5px) rotateY(-7deg) rotateZ(-5deg)}}
    @media(prefers-reduced-motion:reduce){.rb-pay,.rb-pay-heading,.rb-pay-center,.rb-pay-halo,.rb-pay-stack,.rb-pay-medallion,.rb-pay[data-phase=complete] .rb-pay-medallion,.rb-pay-wallet-shell,.rb-pay[data-phase=complete] .rb-pay-actions{animation:none}.rb-pay-flight{display:none}.rb-pay-wallet-gain{transition:none}}
  `;
  document.head.appendChild(st);
}
function RbWalletReward({
  amount,
  initialKind = null,
  confirmed = false,
  title = 'НАГРАДА ЗА ДОМИК',
  dismissLabel = 'ЗАБРАТЬ',
  coinVisual = false,
  onCredited,
  onClose
}) {
  const [kind, setKind] = React.useState(initialKind),
    [phase, setPhase] = React.useState(confirmed ? 'flying' : 'choose');
  const [motion, setMotion] = React.useState({
      fraction: 0,
      hits: 0
    }),
    [sceneStatus, setSceneStatus] = React.useState(null);
  const coinTimeline = React.useRef({
    elapsed: 0
  });
  const sceneReady = React.useCallback(ok => setSceneStatus(ok ? 'ready' : 'fallback'), []);
  const root = React.useRef(null),
    coins = React.useRef([]),
    trails = React.useRef([]),
    callback = React.useRef(onCredited),
    id = React.useRef(null),
    start = React.useRef(window.pxWallets?.() || {
      cash: 0,
      tourney: 0
    });
  callback.current = onCredited;
  if (id.current == null) id.current = ++window.cmRewardWallet.sequence;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectedAmount = initialKind ? amount : Math.round(amount * (kind === 'tdollar' ? 1.1 : 1) * 100) / 100;
  const unit = kind === 'tdollar' ? 'T$' : 'C$',
    name = kind === 'tdollar' ? 'Турнирные доллары' : 'Кеш-доллары';
  const money = v => Number(v).toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  const balance = (kind === 'tdollar' ? start.current.tourney : start.current.cash) || 0;
  const delta = selectedAmount * (phase === 'complete' ? 1 : motion.fraction);
  React.useEffect(() => {
    if (phase !== 'flying' || sceneStatus === null) return;
    const el = root.current;
    if (!el) return;
    let raf,
      last = null,
      elapsed = 0,
      lastUi = -100,
      finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      coinTimeline.current.elapsed = RB_REWARD_DURATION;
      if (window.cmRewardWallet.credit(id.current, kind, selectedAmount)) callback.current?.(selectedAmount, kind);
      setMotion({
        fraction: 1,
        hits: RB_REWARD_COINS
      });
      setPhase('complete');
    };
    if (reduced) {
      const timer = setTimeout(finish, 220);
      return () => clearTimeout(timer);
    }
    const frame = now => {
      // Do not spend the reward animation while the app tab is hidden or stalled.
      if (last !== null && !document.hidden) elapsed += Math.min(64, now - last);
      last = now;
      const w = el.clientWidth,
        h = el.clientHeight,
        sourceY = h * .54 + 18,
        targetY = 107,
        targetX = w / 2 - 90;
      coinTimeline.current.elapsed = elapsed;
      const state = rbRewardFrame(elapsed);
      el.style.setProperty('--impact', state.impact.toFixed(3));
      coins.current.forEach((coin, i) => {
        if (!coin) return;
        const p = rbRewardCoinPose(elapsed, i, w, h);
        coin.style.opacity = p.opacity.toFixed(3);
        coin.style.transform = `translate3d(${p.x - 22}px,${p.y - 22}px,0) rotate(${p.rotation}deg) scale(${p.scale})`;
        const trail = trails.current[i];
        if (trail) {
          trail.style.opacity = (p.opacity * .45).toFixed(3);
          trail.style.transform = `translate3d(${p.x - 4}px,${p.y + 8}px,0) scale(${p.scale})`;
        }
      });
      if (elapsed - lastUi > 32) {
        setMotion({
          fraction: state.fraction,
          hits: state.hits
        });
        lastUi = elapsed;
      }
      if (elapsed >= RB_REWARD_DURATION) finish();else raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase, kind, selectedAmount, reduced, sceneStatus]);
  const earning = phase === 'flying' || phase === 'complete';
  const RewardVisual = coinVisual && kind === 'cash' ? window.RbRewardMetalCoins3D : window.RbRewardCoins3D;
  return /*#__PURE__*/React.createElement("div", {
    ref: root,
    className: "rb-pay",
    "data-phase": phase,
    "data-receiving": motion.hits > 0,
    "data-arrivals": motion.hits,
    "data-renderer": sceneStatus || 'loading',
    "data-i18n": "off",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u043D\u0430\u0433\u0440\u0430\u0434\u044B"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-halo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-horizon"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-heading"
  }, title), kind && /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet",
    "aria-label": "\u0411\u0430\u043B\u0430\u043D\u0441 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u043E\u0439 \u0432\u0430\u043B\u044E\u0442\u044B"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-pay-wallet-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, phase === 'complete' ? /*#__PURE__*/React.createElement("path", {
    d: "m5 12 4 4 10-10"
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M20 8V6a2 2 0 0 0-2-2H6a3 3 0 0 0-3 3v11a2 2 0 0 0 2 2h15V8H6a2 2 0 0 1 0-4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 11h-5v5h5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17 13.5h.1"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet-copy"
  }, /*#__PURE__*/React.createElement("small", null, kind === 'tdollar' ? 'ТУРНИРНЫЙ БАЛАНС' : 'КЕШ-БАЛАНС'), /*#__PURE__*/React.createElement("strong", null, unit, money(balance + delta))))), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet-gain",
    role: phase === 'complete' ? 'status' : undefined
  }, "+", unit, money(delta), phase === 'complete' ? ' зачислено' : '')), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-center"
  }, phase === 'choose' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h2", {
    className: "rb-pay-title"
  }, "\u0412\u0430\u0448\u0430 \u043D\u0430\u0433\u0440\u0430\u0434\u0430 \u0433\u043E\u0442\u043E\u0432\u0430"), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-sub"
  }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435, \u0447\u0442\u043E \u0437\u0430\u0431\u0440\u0430\u0442\u044C"), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-options"
  }, ['cash', 'tdollar'].map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: "rb-pay-option",
    "data-kind": k,
    onClick: () => {
      setKind(k);
      setPhase('confirm');
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-pay-option-icon"
  }, k === 'cash' ? 'C$' : 'T$'), /*#__PURE__*/React.createElement("b", null, k === 'cash' ? 'C$' : 'T$', money(Math.round(amount * (k === 'tdollar' ? 1.1 : 1) * 100) / 100)), /*#__PURE__*/React.createElement("small", null, k === 'cash' ? 'Кеш-доллары' : 'Турнирные доллары'))))) : /*#__PURE__*/React.createElement(React.Fragment, null, phase === 'confirm' && /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-sub"
  }, "\u0412\u044B \u0432\u044B\u0431\u0440\u0430\u043B\u0438"), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-amount"
  }, "+", unit, money(selectedAmount)), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-currency"
  }, name))), earning && /*#__PURE__*/React.createElement(React.Fragment, null, sceneStatus === 'fallback' && /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-emblem",
    "aria-hidden": "true"
  }, [0, 1].map(n => /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-stack",
    key: n
  }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      inset: 0,
      transform: `translateY(${-i * 6}px)`
    }
  }, /*#__PURE__*/React.createElement(RbRewardCoin, {
    ticket: kind === 'tdollar'
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-medallion"
  }, /*#__PURE__*/React.createElement(RbRewardCoin, {
    ticket: kind === 'tdollar'
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-status"
  }, phase === 'complete' && /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m5 12 4 4 10-10"
  })), phase === 'complete' ? 'Награда на вашем балансе' : 'Зачисляем на ваш баланс')), earning && /*#__PURE__*/React.createElement(RewardVisual, {
    timeline: coinTimeline,
    phase: phase,
    kind: kind,
    getPose: rbRewardCoinPose,
    onReady: sceneReady
  }), phase === 'flying' && !reduced && sceneStatus === 'fallback' && /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-flight",
    "aria-hidden": "true"
  }, Array.from({
    length: RB_REWARD_COINS
  }, (_, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("i", {
    className: "rb-pay-trail",
    ref: el => trails.current[i] = el
  }), /*#__PURE__*/React.createElement("span", {
    className: "rb-pay-coin",
    ref: el => coins.current[i] = el
  }, /*#__PURE__*/React.createElement(RbRewardCoin, {
    ticket: kind === 'tdollar'
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-actions"
  }, phase === 'confirm' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    className: "rb-pay-secondary",
    onClick: () => {
      setKind(null);
      setPhase('choose');
    }
  }, "\u0418\u0417\u041C\u0415\u041D\u0418\u0422\u042C \u0412\u042B\u0411\u041E\u0420"), /*#__PURE__*/React.createElement("button", {
    className: "rb-pay-primary",
    onClick: () => {
      window.rbCoinAudio?.prepare();
      setPhase('flying');
    }
  }, "\u041F\u041E\u0414\u0422\u0412\u0415\u0420\u0414\u0418\u0422\u042C")) : phase !== 'choose' ? /*#__PURE__*/React.createElement("button", {
    className: "rb-pay-primary",
    disabled: phase !== 'complete',
    onClick: onClose
  }, dismissLabel) : null));
}
function RbHouseReveal(props) {
  return /*#__PURE__*/React.createElement(window.RbHousePayout, props);
}
function RbCardRewardReveal({
  level,
  accent,
  onClose
}) {
  const rw = window.cmLeague.cardReward(level);
  return /*#__PURE__*/React.createElement(RbWalletReward, {
    amount: rw.amount,
    initialKind: rw.kind,
    confirmed: true,
    title: 'НАГРАДА ПОД КАРТОЙ · ' + window.cmLeague.cardForLevel(level),
    onClose: onClose
  });
}
function RakebackScreen({
  open,
  onClose,
  accent = "#D71921"
}) {
  React.useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [open]);
  const [tab, setTab] = React.useState(new URLSearchParams(window.location.search).get("collection") === "1" ? "path" : "house");
  const scrollRef = React.useRef(null),
    houseScroll = React.useRef(0);
  const navigate = next => {
    if (next !== tab) {
      houseScroll.current = 0;
      setTab(next);
    }
  };
  React.useLayoutEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = tab === 'house' ? houseScroll.current : 0;
  }, [tab]);
  React.useEffect(() => {
    if (open) {
      houseScroll.current = 0;
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
    }
  }, [open]);
  const [preview, setPreview] = React.useState(false);
  const [previewLevel, setPreviewLevel] = React.useState(null);
  const [historyVersion, setHistoryVersion] = React.useState(0);
  const claimRef = React.useRef(false);
  const finishRef = React.useRef(null);
  const [flipLvl, setFlipLvl] = React.useState(null);
  const [unlockLevel, setUnlockLevel] = React.useState(null),
    unlockGuard = React.useRef(false),
    [, refreshPlayer] = React.useState(0);
  const [safeXp, setSafeXp] = React.useState((window.cmPlayer || {}).safeXp || 0);
  const [collapse, setCollapse] = React.useState(false);
  const [reveal, setReveal] = React.useState(null);
  React.useEffect(() => {
    if (!open) return;
    claimRef.current = false;
    unlockGuard.current = false;
    setUnlockLevel(null);
    setSafeXp((window.cmPlayer || {}).safeXp || 0);
    setTab(new URLSearchParams(window.location.search).get("collection") === "1" ? "path" : "house");
    setCollapse(false);
    setReveal(null);
  }, [open]);
  React.useEffect(() => {
    if (!collapse || reveal != null) return;
    const t = setTimeout(() => {
      finishRef.current && finishRef.current();
    }, 5000);
    return () => clearTimeout(t);
  }, [collapse, reveal]);
  if (!open) return null;
  const L = window.cmLeague;
  let P = window.cmPlayer || {
    level: 24,
    xp: 620,
    xpNext: 1000,
    safeXp: 1380,
    safeThreshold: 1000
  };
  if (previewLevel != null) P = {
    ...P,
    level: previewLevel
  };
  const LEAGUES = L ? L.LEAGUES : [];
  const curIdx = L ? L.indexForLevel(P.level) : 1;
  const lg = LEAGUES[curIdx] || {
    name: "CLUBS",
    suit: "♣",
    color: "#2FA84F",
    ink: "#fff",
    min: 14,
    max: 26
  };
  const lgColor = lg.color;
  const lgText = L.shade(lgColor, 48);
  const rank = L ? L.rankForLevel(P.level) : "Q";
  const nextRank = L ? L.rankForLevel(Math.min(65, P.level + 1)) : "K";
  const pct = Math.round(P.xp / P.xpNext * 100);
  const rb = window.chRbPercent ? window.chRbPercent(P.level) : 20;
  const rbNext = window.chRbPercent ? window.chRbPercent(Math.min(65, P.level + 1)) : rb;
  const st = window.chHouseState ? window.chHouseState(P.level, safeXp) : {
    built: 0,
    pairs: 1,
    TH: 1000,
    canOpen: false,
    nextAt: 1000,
    odd: false
  };
  const floors = window.chFloors ? window.chFloors(P.level, safeXp) : [];
  const TH = st.TH;
  const fmt = v => v.toLocaleString("en-US").split(",").join(" ");
  const payout = Math.round(safeXp / (P.xpRate || 100) * rb) / 100; // demo: rake represented by all XP × estimated league rate
  const openHouse = () => {
    if (!st.canOpen || collapse) return;
    if (window.playClick) window.playClick(1500, .06);
    setCollapse(true);
  };
  const onCollapsed = () => {
    if (claimRef.current) return;
    claimRef.current = true;
    setReveal(payout);
    const ev = {
      day: 0,
      rake: 0,
      ev: [{
        kind: "house",
        amount: payout,
        label: "THIS DEMO SESSION"
      }]
    };
    RB_HIST[0].ev.unshift(ev.ev[0]);
    setHistoryVersion(v => v + 1);
  };
  finishRef.current = onCollapsed;
  const closeReveal = () => {
    const left = 0; // all cycle XP was included in this payout
    claimRef.current = false;
    setReveal(null);
    setCollapse(false);
    setSafeXp(left);
    if (window.cmPlayer) window.cmPlayer.safeXp = left;
  };
  const pendingLevel = previewLevel == null ? P.pendingLevel : null;
  const openKing = () => {
    if (unlockGuard.current || !pendingLevel || P.xp < P.xpNext) return;
    unlockGuard.current = true;
    setUnlockLevel(pendingLevel);
  };
  const earnKing = n => {
    const player = window.cmPlayer;
    if (player?.pendingLevel !== n) return;
    player.level = n;
    player.xp = Math.max(0, player.xp - player.xpNext);
    player.pendingLevel = null;
    refreshPlayer(v => v + 1);
  };
  const closeKing = () => {
    setUnlockLevel(null);
    unlockGuard.current = false;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "rb-screen",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 45,
      background: "#101115",
      animation: "px-up 360ms cubic-bezier(0.2,0.8,0.2,1) both",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 380,
      display: tab === 'path' ? 'none' : undefined,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 70% at 50% 4%, ${lgColor}2e 0%, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 380,
      display: tab === 'path' ? 'none' : undefined,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.085) 0.7px, transparent 1.1px)",
      backgroundSize: "16px 16px",
      maskImage: "linear-gradient(180deg, black, transparent)",
      WebkitMaskImage: "linear-gradient(180deg, black, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    key: tab === 'path' ? 'collection-back' : 'lobby-back',
    "aria-label": tab === 'path' ? "Back to progress" : "Back to lobby",
    disabled: collapse,
    onClick: () => {
      if (window.playClick) window.playClick(900, .04);
      if (tab === 'path') navigate('house');else onClose();
    },
    style: {
      width: 36,
      height: 36,
      borderRadius: UI.r.sm,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_R,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, tab === 'path' ? "YOUR COLLECTION" : "CASHBACK"), tab !== 'path' && window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "CASHBACK"
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36
    }
  })), tab !== 'path' && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      margin: "2px 20px 0",
      display: "flex",
      background: "#25262e",
      borderRadius: UI.r.pill,
      padding: 3
    }
  }, [["house", "PROGRESS"], ["history", "HISTORY"]].map(([id, lbl]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    disabled: collapse,
    onClick: () => {
      if (window.playClick) window.playClick(1000, .03);
      navigate(id);
    },
    style: {
      flex: 1,
      minHeight: 52,
      padding: "12px 4px",
      borderRadius: UI.r.pill,
      border: 0,
      cursor: "pointer",
      background: tab === id ? accent : "transparent",
      color: tab === id ? "#fff" : "rgba(255,255,255,.74)",
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".06em",
      transition: "background 160ms"
    }
  }, lbl))), /*#__PURE__*/React.createElement("div", {
    ref: scrollRef,
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: tab === "path" ? "hidden" : "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: tab === "path" ? 0 : 40,
      position: "relative",
      zIndex: 2
    }
  }, tab === "history" ? /*#__PURE__*/React.createElement(RbHistory, {
    key: historyVersion,
    accent: accent,
    lgColor: lgColor
  }) : tab === "path" ? /*#__PURE__*/React.createElement(RbPath, {
    LEAGUES: LEAGUES,
    level: P.level,
    xp: P.xp,
    xpNext: P.xpNext,
    pendingLevel: pendingLevel,
    onUnlock: openKing,
    onFlip: setFlipLvl,
    active: flipLvl == null && unlockLevel == null,
    scrollRootRef: scrollRef
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "0 20px"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_R,
      fontSize: 18,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "CARD HOUSE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_R,
      fontSize: 14,
      color: "#CDD2DB",
      marginTop: 5
    }
  }, `FLOOR ${st.floorIndex + 1} / 5`)), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Inspect current card",
    disabled: collapse,
    onClick: () => setFlipLvl(P.level),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: `${lgColor}22`,
      border: `1px solid ${lgColor}70`,
      borderRadius: UI.r.pill,
      padding: "11px 17px",
      minHeight: 56
    }
  }, /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      fontFamily: MONO_R,
      fontSize: 25,
      fontWeight: 700,
      color: "#fff"
    }
  }, rank, lg.suit), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_R,
      fontSize: 13,
      color: "#E7EAF0"
    }
  }, lg.name))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "radial-gradient(ellipse 80% 65% at 50% 52%,rgba(114,135,168,.15),transparent 78%)"
    }
  }, window.RbHouse3D ? /*#__PURE__*/React.createElement(window.RbHouse3D, {
    floors: floors,
    w: 402,
    h: 438,
    collapse: collapse,
    onCollapsed: onCollapsed,
    autoRotate: false,
    zoom: 1.12
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: "402/438"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "14px 2px 20px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_R,
      fontWeight: 700,
      fontSize: 20,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, fmt(safeXp), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#BCC3CE",
      fontSize: 16
    }
  }, " / ", fmt(TH), " XP"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 9,
      display: "flex",
      gap: 4
    }
  }, Array.from({
    length: Math.max(1, st.pairs)
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      height: 6,
      borderRadius: 3,
      background: i < st.built ? lgColor : "rgba(255,255,255,.12)",
      boxShadow: i < st.built ? `0 0 8px ${lgColor}88` : "none"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: SANS_R,
      fontWeight: 600,
      fontSize: 14,
      lineHeight: 1.6,
      color: "#CDD2DB",
      textWrap: "pretty"
    }
  }, st.canOpen ? "The house is built. All accumulated XP opens together." : `${st.pairs ? `Building in pairs · next pair at ${fmt(st.nextAt)} XP` : "First card collected · waiting for a pair"}`, st.odd && !st.canOpen ? " · one card waits for a partner" : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: openHouse,
    disabled: !st.canOpen || collapse,
    style: Object.assign(UI.btn("l", st.canOpen ? "primary" : "ghost", accent), {
      flex: 1,
      minWidth: 0,
      minHeight: 56,
      fontSize: 16,
      textAlign: "center",
      opacity: st.canOpen ? 1 : .55
    })
  }, collapse ? "OPENING" : st.canOpen ? "OPEN" : "BUILDING"), /*#__PURE__*/React.createElement("button", {
    onClick: () => navigate('path'),
    disabled: collapse,
    "aria-label": "My cards",
    style: Object.assign(UI.btn("l", "ghost", accent), {
      flex: 1,
      minWidth: 0,
      minHeight: 56,
      padding: "6px 8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "MY CARDS"), /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      fontFamily: MONO_R,
      fontSize: 13,
      fontWeight: 700,
      letterSpacing: 0,
      color: "#BCC3CE"
    }
  }, P.level, " / 65")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      width: "100%",
      padding: "22px 2px",
      borderTop: `1px solid ${UI.hairline}`,
      borderBottom: `1px solid ${UI.hairline}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_R,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".05em",
      color: "#E7EAF0"
    }
  }, "LEAGUE RAKEBACK"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_R,
      fontWeight: 700,
      fontSize: 34,
      color: "#fff",
      lineHeight: 1
    }
  }, "\u2248", rb, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_R,
      fontSize: 13,
      color: "#BCC3CE"
    }
  }, "DEMO"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      paddingTop: 16,
      borderTop: "1px solid rgba(255,255,255,.13)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 10,
      fontFamily: SANS_R,
      fontSize: 14,
      fontWeight: 600,
      color: "#E7EAF0"
    }
  }, /*#__PURE__*/React.createElement("span", null, P.level >= 65 ? "COLLECTION COMPLETE" : "NEXT CARD"), /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      fontFamily: MONO_R,
      fontSize: 18,
      color: lgText
    }
  }, P.level >= 65 ? "65 / 65" : nextRank + L.forLevel(P.level + 1).suit)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 8,
      background: "rgba(255,255,255,.13)",
      borderRadius: 4,
      overflow: "hidden",
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: (P.level >= 65 ? 100 : pct) + "%",
      background: lgColor,
      borderRadius: 4
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      gap: 10,
      marginTop: 9,
      fontFamily: MONO_R,
      fontSize: 14,
      color: "#CDD2DB"
    }
  }, /*#__PURE__*/React.createElement("span", null, P.level >= 65 ? "ALL CARDS UNLOCKED" : `${fmt(P.xp)} / ${fmt(P.xpNext)} XP`), /*#__PURE__*/React.createElement("span", null, P.level >= 65 ? 100 : pct, "%"))))), /*#__PURE__*/React.createElement("button", {
    disabled: collapse,
    onClick: () => setPreview(!preview),
    style: {
      ...UI.btn("s", "ghost", accent),
      width: "100%",
      minHeight: 50,
      marginTop: 12,
      fontSize: 14
    }
  }, "3D PREVIEW \xB7 ", preview ? "CLOSE" : "ALL LEAGUES"), preview && /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      marginTop: 10,
      padding: "16px 2px",
      borderBottom: `1px solid ${UI.hairline}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_R,
      color: "#BCC3CE",
      fontSize: 14,
      marginBottom: 12
    }
  }, "DEMO CONTROLS \xB7 NO REAL REWARDS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6
    }
  }, LEAGUES.map((g, i) => /*#__PURE__*/React.createElement("button", {
    key: g.id,
    disabled: collapse,
    onClick: () => {
      setPreviewLevel(g.max);
      setSafeXp(1380);
    },
    style: {
      ...UI.btn("s", "ghost", accent),
      flex: 1,
      minHeight: 52,
      padding: "8px 0",
      color: g.color,
      fontSize: 20
    }
  }, g.suit))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      color: "#CDD2DB",
      fontFamily: SANS_R,
      fontSize: 14,
      marginTop: 15
    }
  }, "CARD ", P.level, " / 65", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Preview level",
    type: "range",
    min: "1",
    max: "65",
    value: P.level,
    disabled: collapse,
    onChange: e => setPreviewLevel(+e.target.value),
    style: {
      display: "block",
      width: "100%",
      minHeight: 44,
      margin: "10px 0",
      accentColor: accent
    }
  })), /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      color: "#CDD2DB",
      fontFamily: SANS_R,
      fontSize: 14
    }
  }, "CYCLE ", safeXp, " XP", /*#__PURE__*/React.createElement("input", {
    "aria-label": "Preview XP",
    type: "range",
    min: "0",
    max: "2500",
    step: "10",
    value: safeXp,
    disabled: collapse,
    onChange: e => setSafeXp(+e.target.value),
    style: {
      display: "block",
      width: "100%",
      minHeight: 44,
      margin: "10px 0",
      accentColor: accent
    }
  }))), /*#__PURE__*/React.createElement(RbSectionTitle, {
    accent: accent
  }, "HOW IT WORKS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, [["PLAY — EARN XP", "Every $1 of rake you generate is 100 XP. XP never burns and moves two tracks at once."], ["LEVEL = CARD", "Each new level flips a card of your suit — deuce to ace, a reward under every card. The ace is the grand one."], ["LEAGUE = SUIT", "Five leagues: diamonds, clubs, hearts, spades and DOT. Displayed league rates are estimates; balance is in development."], ["CARD HOUSE — 1 000 XP", "Cards stack in pairs as XP grows. Reach the mark, open the house, take the cash — the floor stays once you start the next suit."]].map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      padding: "17px 0",
      borderBottom: i < 3 ? `1px solid ${UI.hairline}` : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: `${accent}1f`,
      border: `1px solid ${accent}66`,
      color: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO_R,
      fontWeight: 700,
      fontSize: 16
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_R,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_R,
      fontWeight: 500,
      fontSize: 16,
      lineHeight: 1.6,
      color: "#E7EAF0",
      marginTop: 5,
      textWrap: "pretty"
    }
  }, d)))))))), reveal != null && /*#__PURE__*/React.createElement(RbHouseReveal, {
    amount: reveal,
    accent: accent,
    lgColor: lgColor,
    onClose: closeReveal
  }), flipLvl != null && /*#__PURE__*/React.createElement(RbCardReveal, {
    level: flipLvl,
    onClose: () => setFlipLvl(null)
  }), unlockLevel != null && /*#__PURE__*/React.createElement(RbKingUnlock, {
    level: unlockLevel,
    onEarned: earnKing,
    onClose: closeKing
  }));
}
Object.assign(window, {
  RakebackScreen,
  RbCrateImg,
  RbIsoPath,
  RbPath,
  RbCardReveal,
  RbKingUnlock,
  RbLegendHistory
});
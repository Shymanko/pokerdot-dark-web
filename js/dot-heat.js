// dot-heat.jsx — екран «Удача»: шкала везіння з талісманом, вердикт за сходинкою, розбір шоудаунів,
// the room's beats, share card, FAQ. Full-screen page in the .me-overlay pattern; segments = SSegment; cards = PokerCard.
const HB_MONO = UI.font,
  HB_SANS = UI.fontUI,
  HB_ACC = UI.accent,
  HB_GOLD = UI.gold,
  HB_BLUE = UI.blue;
const hbT = x => window.DOT_RU ? window.DOT_RU.T(x) : x,
  hbTD = x => window.DOT_RU ? window.DOT_RU.TD(x) : x,
  hbRu = () => !!(window.DOT_RU && window.DOT_RU.isRu());
const hbClick = (f, g) => {
  if (window.playClick) window.playClick(f || 1100, g || 0.04);
};
if (!document.getElementById("hb-style")) {
  const st = document.createElement("style");
  st.id = "hb-style";
  st.textContent = `
  .hb{font-family:var(--cm-font-ui,${HB_SANS});color:#fff}.hb *{box-sizing:border-box}.hb button{font-family:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}
  .hb-sec{margin:22px 16px 0}.hb-h{display:flex;align-items:center;justify-content:space-between;gap:10px;font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.16em;color:${UI.textMute};margin-bottom:10px}.hb-h>span:first-child{flex:none}
  .hb-box{border-radius:${UI.r.lg}px;background:${UI.surface1};border:1px solid ${UI.hairline};padding:16px}
  .hb-gauge{position:relative;height:150px}.hb-gauge svg{display:block;width:100%;height:100%;overflow:visible}
  .hb-num{text-align:center;margin-top:-34px;font:700 34px var(--cm-font-display,${HB_MONO});letter-spacing:.02em;line-height:1}.hb-zone{text-align:center;margin-top:6px;font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.16em;color:${UI.textMute}}
  .hb-verdict{margin-top:14px;padding:14px 16px;border-radius:${UI.r.md}px;border:1px solid ${UI.hairline};display:flex;gap:12px;align-items:flex-start;font:500 14px var(--cm-font-ui,${HB_SANS});line-height:1.45;color:#e9e9ee}.hb-verdict a{color:#ff6b72;font-weight:700;text-decoration:none}
  .hb-cnt{display:grid;grid-template-columns:1fr 14px 1fr;align-items:center;text-align:center}.hb-cnt .hb-l{font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.16em;color:${UI.textMute}}.hb-cnt .hb-v{font:700 40px var(--cm-font-display,${HB_MONO});line-height:1.1;margin-top:4px}
  .hb-div{width:2px;height:60px;margin:0 auto;background-image:radial-gradient(circle,rgba(255,255,255,.35) 1px,transparent 1.4px);background-size:2px 6px}
  .hb-net{margin-top:12px;text-align:center;font:500 13px var(--cm-font-ui,${HB_SANS});color:${UI.textMute}}
  .hb-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-top:1px solid rgba(255,255,255,.08);font:500 13px var(--cm-font-ui,${HB_SANS});color:#e9e9ee}.hb-row b{font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.16em;color:${UI.textMute};flex:none;width:64px}.hb-row span{flex:1}.hb-row i{color:${UI.textDim};font-style:normal}
  .hb-sealed{display:flex;flex-direction:column;align-items:center;gap:12px;padding:8px 0 4px}.hb-sealed p{margin:0;text-align:center;font:500 13px var(--cm-font-ui,${HB_SANS});color:${UI.textMute};line-height:1.45}
  .hb-bars{display:flex;gap:26px}.hb-bars i{display:inline-block;width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.14);margin:0 1.5px}
  .hb-scroll{display:flex;gap:10px;overflow-x:auto;scrollbar-width:none;padding:0 16px;scroll-snap-type:x mandatory}.hb-scroll::-webkit-scrollbar{display:none}.hb-scroll>*{flex:none;width:calc(100% - 44px);scroll-snap-align:start}
  .hb-card{border-radius:${UI.r.lg}px;background:${UI.surface1};border:1px solid ${UI.hairline};overflow:hidden;text-align:left;color:#fff;position:relative}
  .hb-card[data-day=true]{border-color:${HB_GOLD}88}
  .hb-day{padding:8px 14px 0;font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.16em;color:${HB_GOLD}}
  .hb-vs{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 14px 10px;background-image:radial-gradient(circle,rgba(255,255,255,.08) .6px,transparent 1px);background-size:6px 6px;border-bottom:1px solid ${HB_ACC}}
  .hb-vs strong{font:700 15px var(--cm-font-display,${HB_MONO});letter-spacing:.06em}.hb-vs em{font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.12em;color:${UI.textMute};font-style:normal;margin:0 6px}
  .hb-eq{flex:none;font:700 12px var(--cm-font-display,${HB_MONO});padding:5px 8px;border-radius:${UI.r.xs}px;border:1px solid rgba(255,255,255,.18);color:#fff}.hb-eq[data-brutal=true]{color:${HB_ACC};border-color:${HB_ACC}88}
  .hb-meta{display:flex;align-items:center;gap:8px;padding:10px 14px 0;font:500 12px var(--cm-font-ui,${HB_SANS});color:${UI.textMute};white-space:nowrap;overflow:hidden}.hb-meta b{color:${UI.green};font-weight:700}
  .hb-tag{font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.12em;padding:3px 7px;border-radius:${UI.r.xs}px;border:1px solid rgba(255,255,255,.18);color:#fff;flex:none}
  .hb-board{padding:12px 14px 0}.hb-board>span{display:block;font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.16em;color:${UI.textDim};margin-bottom:6px}.hb-board>div{display:flex;gap:5px}
  .hb-pl{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 14px 0}.hb-pl>div{display:flex;align-items:center;gap:8px;min-width:0}.hb-pl .hb-n{font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:92px}.hb-pl .hb-e{font:700 12px var(--cm-font-display,${HB_MONO})}
  .hb-foot{display:flex;align-items:center;justify-content:space-between;padding:12px 14px 14px}.hb-street{font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.14em;padding:5px 9px;border-radius:${UI.r.xs}px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.14)}
  .hb-sort{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}.hb-sort button{flex:none;height:28px;padding:0 10px;border-radius:${UI.r.pill}px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:${UI.textMute};font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.12em}.hb-sort button[data-on=true]{color:#fff;background:rgba(255,255,255,.12);border-color:#fff3}
  .hb-faq{border-top:1px solid ${UI.hairline}}.hb-faq button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 0;border:0;border-bottom:1px solid ${UI.hairline};background:none;color:#fff;text-align:left;font:600 14px var(--cm-font-ui,${HB_SANS})}.hb-faq button span:last-child{color:${UI.textDim};flex:none;transition:transform .2s}.hb-faq button[data-open=true] span:last-child{transform:rotate(45deg)}
  .hb-faq p{margin:0;padding:0 0 14px;font:500 13px var(--cm-font-ui,${HB_SANS});line-height:1.5;color:${UI.textMute};border-bottom:1px solid ${UI.hairline}}
  .hb-share{position:absolute;inset:0;z-index:90;background:#0a0a0ce8;backdrop-filter:blur(8px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px 16px;gap:14px}
  .hb-sharecard{width:240px;height:426px;border-radius:14px;background:#000;border:1px solid rgba(255,255,255,.18);position:relative;overflow:hidden;background-image:radial-gradient(circle,rgba(255,255,255,.1) .6px,transparent 1px);background-size:8px 8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:16px}
  .hb-sharecard .hb-sc-logo{position:absolute;top:14px;left:50%;transform:translateX(-50%) rotate(45deg);display:grid;grid-template-columns:repeat(2,7px);gap:5px}.hb-sharecard .hb-sc-logo i{width:7px;height:7px;border-radius:50%;background:${HB_ACC}}
  .hb-sharecard .hb-sc-foot{position:absolute;bottom:12px;left:0;right:0;text-align:center;font:700 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.14em;color:${UI.textMute}}
  .hb-sharecard .hb-sc-vs{font:700 16px var(--cm-font-display,${HB_MONO});letter-spacing:.06em}.hb-sharecard .hb-sc-line{font:500 12px var(--cm-font-ui,${HB_SANS});color:#e9e9ee;text-align:center;line-height:1.4;margin-top:6px}
  .hb-dev{display:flex;align-items:center;gap:8px;margin:22px 16px 0;font:600 12px var(--cm-font-ui,${HB_SANS});letter-spacing:.1em;color:${UI.textDim}}.hb-dev strong{flex:1;text-align:center;font:700 12px var(--cm-font-display,${HB_MONO});color:#d8d8df;letter-spacing:.04em}.hb-dev button{width:26px;height:26px;padding:0;border-radius:50%;border:1px solid #ffffff2a;background:#ffffff0a;color:#d8d8df;font:700 14px var(--cm-font-ui,${HB_SANS})}.hb-dev .hb-dev-w{width:auto;padding:0 10px;border-radius:999px;font:600 12px var(--cm-font-ui,${HB_SANS})}
  `;
  document.head.appendChild(st);
}
const HB_HANDS = new Map();
function hbHand(b) {
  if (HB_HANDS.has(b.id)) return HB_HANDS.get(b.id);
  const raw = b.pot.replace(/[^\d.K]/g, ''),
    pot = parseFloat(raw) * (raw.endsWith('K') ? 1000 : 1),
    heroSource = b.victim.me ? b.victim : b.winner,
    opponentSource = b.victim.me ? b.winner : b.victim;
  const used = new Set([...b.board, ...b.victim.cards, ...b.winner.cards].map(c => c.r + c.s));
  const deck = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'].flatMap(r => ['spade', 'heart', 'diamond', 'club'].map(s => ({
    r,
    s
  }))).filter(c => !used.has(c.r + c.s));
  const players = ['UTG', 'UTG+1', 'CO', 'BTN', 'SB', 'BB'].map((pos, i) => ({
    pos,
    name: i === 4 ? heroSource.name : i === 5 ? opponentSource.name : ['mokuoha', 'TRAMOLLERO', 'aegbtc', 'ShabbaMatty'][i],
    hero: i === 4,
    cards: i === 4 ? heroSource.cards : i === 5 ? opponentSource.cards : [deck.pop(), deck.pop()],
    put: i >= 4 ? pot / 2 : 0,
    live: i >= 4,
    shown: i >= 4,
    stack: pot
  }));
  const hero = players[4],
    opponent = players[5],
    winner = b.winner.me ? hero : opponent,
    allIn = b.street === 'FLOP' ? 1 : 2;
  let committed = 0;
  const streets = ['PREFLOP', 'FLOP', 'TURN', 'RIVER'].map((name, i) => {
    const to = i === 0 ? pot * .025 : i < allIn ? pot * .12 : pot / 2,
      amount = Math.max(0, to - committed),
      rows = i === 0 ? players.slice(0, 4).map(p => ({
        p,
        act: 'FOLD'
      })) : [];
    committed = to;
    if (i <= allIn) rows.push({
      p: hero,
      act: i === 0 ? 'RAISE' : i === allIn ? 'ALL-IN' : 'BET',
      amt: amount
    }, {
      p: opponent,
      act: 'CALL',
      amt: amount
    });else rows.push({
      p: hero,
      act: 'CHECK'
    }, {
      p: opponent,
      act: 'CHECK'
    });
    return {
      name,
      cards: i ? i + 2 : 0,
      pot: to * 2,
      rows
    };
  });
  const results = players.map(p => ({
    p,
    delta: p === winner ? pot / 2 : p.live ? -pot / 2 : 0,
    won: p === winner,
    shown: p.live
  }));
  const hand = {
    id: 'luck-' + b.id,
    disc: b.where.includes('PLO') ? 'PLO' : "HOLD'EM",
    format: b.disc === 'MTT' ? 'TOURNEY' : b.disc === 'SPIN' ? 'SPIN & WIN' : 'CASH',
    event: b.where,
    stakes: b.where.match(/\$[\d.]+\/\$[\d.]+/)?.[0] || '$2 / $5',
    when: hbTD(b.time),
    table: b.where,
    street: 'SHOWDOWN',
    cards: hero.cards,
    won: winner === hero,
    amt: pot,
    replayData: {
      players,
      board: b.board,
      streets,
      pot,
      results,
      bb: 5,
      sb: 2,
      winner,
      hero,
      heroDelta: winner === hero ? pot / 2 : -pot / 2,
      heroWon: winner === hero
    }
  };
  HB_HANDS.set(b.id, hand);
  return hand;
}
function HbBeatCard({
  b,
  onShare,
  onReplay,
  onOpen
}) {
  const hero = b.victim.me ? b.victim : b.winner,
    other = b.victim.me ? b.winner : b.victim,
    Card = window.HdCard;
  const cards = (cs, w) => cs.map((c, i) => /*#__PURE__*/React.createElement(Card, {
    key: i,
    c: c,
    w: w
  }));
  return /*#__PURE__*/React.createElement("article", {
    className: "hb-beat",
    "data-delivered": !!b.delivered
  }, /*#__PURE__*/React.createElement("button", {
    className: "hb-beat-open",
    onClick: () => onOpen?.(b),
    "aria-label": `Детали раздачи ${b.where} ${b.time}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "hb-beat-meta"
  }, /*#__PURE__*/React.createElement("span", null, hbT(b.disc), /*#__PURE__*/React.createElement("i", null), " ", b.where), /*#__PURE__*/React.createElement("time", null, hbTD(b.time))), /*#__PURE__*/React.createElement("span", {
    className: "hb-beat-hero"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("small", null, b.delivered ? 'ДОЕХАЛ С' : 'ШАНС НА ПОБЕДУ'), /*#__PURE__*/React.createElement("strong", null, hero.eq)), /*#__PURE__*/React.createElement("span", {
    className: "hb-beat-pot"
  }, /*#__PURE__*/React.createElement("small", null, "\u0411\u0410\u041D\u041A"), /*#__PURE__*/React.createElement("b", null, b.pot))), /*#__PURE__*/React.createElement("span", {
    className: "hb-beat-board"
  }, cards(b.board, 32)), /*#__PURE__*/React.createElement("span", {
    className: "hb-beat-match"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("small", null, "\u0422\u0412\u041E\u042F \u0420\u0423\u041A\u0410"), /*#__PURE__*/React.createElement("span", null, cards(hero.cards, 29))), /*#__PURE__*/React.createElement("span", {
    className: "hb-beat-vs"
  }, "VS"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("small", null, other.name), /*#__PURE__*/React.createElement("span", null, cards(other.cards, 29))))), /*#__PURE__*/React.createElement("div", {
    className: "hb-beat-footer"
  }, /*#__PURE__*/React.createElement("span", null, "\u041E\u041B\u041B-\u0418\u041D \u041D\u0410 ", hbT(b.street)), /*#__PURE__*/React.createElement("button", {
    className: "hb-replay-action",
    onClick: () => onReplay?.(b),
    "aria-label": `Реплей ${b.where} ${b.time}`
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 8a8 8 0 1 1 0 8M4 3v5h5",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m10 8 6 4-6 4z",
    fill: "currentColor"
  })), "\u0420\u0415\u041F\u041B\u0415\u0419"), /*#__PURE__*/React.createElement("button", {
    className: "hb-share-action",
    "aria-label": `Поделиться раздачей ${b.time}`,
    onClick: () => onShare?.(b)
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12v7h14v-7M12 16V3m-4 4 4-4 4 4"
  })))));
}

// share card 9:16 — used by the luck screen and by the career tab
function HbShareOverlay({
  share,
  onClose
}) {
  const setShare = v => {
    if (!v) onClose();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "hb-share",
    onClick: () => setShare(null)
  }, /*#__PURE__*/React.createElement("div", {
    className: "hb-sharecard",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "hb-sc-logo"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
    className: "hb-sc-vs"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: HB_GOLD
    }
  }, hbT(share.win)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: UI.textMute,
      fontSize: 12,
      margin: "0 6px"
    }
  }, hbT("vs")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: HB_BLUE
    }
  }, hbT(share.lose))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, share.board.map((c, i) => window.PokerCard ? /*#__PURE__*/React.createElement(window.PokerCard, {
    key: i,
    rank: c.r,
    suit: c.s,
    w: 30,
    style: {
      opacity: share.winBoard.includes(i) ? 1 : .55
    }
  }) : null)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      marginTop: 4
    }
  }, [share.victim, share.winner].map((p, k) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3
    }
  }, p.cards.map((c, i) => window.PokerCard ? /*#__PURE__*/React.createElement(window.PokerCard, {
    key: i,
    rank: c.r,
    suit: c.s,
    w: 26
  }) : null)), /*#__PURE__*/React.createElement("span", {
    style: {
      font: `700 12px var(--cm-font-display,${HB_MONO})`,
      color: k ? HB_ACC : UI.green
    }
  }, p.eq)))), /*#__PURE__*/React.createElement("span", {
    className: "hb-street"
  }, hbT("ALL-IN ON"), " ", hbT(share.street)), /*#__PURE__*/React.createElement("div", {
    className: "hb-sc-line"
  }, share.delivered ? `${share.winner.eq} ${hbT(`on the ${share.street.toLowerCase()}. Got there.`)}` : `${share.victim.eq} ${hbT(`on the ${share.street.toLowerCase()}. Lost. This is the game.`)}`), /*#__PURE__*/React.createElement("div", {
    className: "hb-sc-foot"
  }, "pokerdot.app \xB7 SASHA02")), /*#__PURE__*/React.createElement("button", {
    style: {
      ...UI.btn("l", "primary"),
      width: 240
    },
    onClick: () => {
      hbClick(1250);
      setShare(null);
    }
  }, "\u0413\u041E\u0422\u041E\u0412\u041E"), /*#__PURE__*/React.createElement("button", {
    style: UI.btn("s", "ghost"),
    onClick: () => setShare(null)
  }, hbT("CLOSE")));
}
function HbBeatList({
  rows,
  onShare,
  onReplay,
  onOpen,
  label
}) {
  const [visible, setVisible] = React.useState(3);
  React.useEffect(() => setVisible(3), [rows]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "hb-scroll"
  }, rows.slice(0, visible).map(b => /*#__PURE__*/React.createElement(HbBeatCard, {
    key: b.id,
    b: b,
    onShare: onShare,
    onReplay: onReplay,
    onOpen: onOpen
  }))), visible < rows.length && /*#__PURE__*/React.createElement("button", {
    className: "hb-more",
    "aria-label": `Больше: ${label}`,
    onClick: () => setVisible(n => n + 3)
  }, "\u0411\u041E\u041B\u042C\u0428\u0415", /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 9 6 6 6-6"
  }))));
}
function HeatScreen({
  open,
  onClose,
  level = 3
}) {
  const D = window.DOT,
    Seg = window.SSegment,
    L = D.LUCK_LEVELS,
    cur = L[Math.max(0, Math.min(L.length - 1, level))];
  const [win, setWin] = React.useState(window.DOT.LUCK_WINDOW.showdowns),
    [faq, setFaq] = React.useState(-1),
    [share, setShare] = React.useState(null),
    [replay, setReplay] = React.useState(null),
    [detail, setDetail] = React.useState(null);
  const faqRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [open]);
  if (!open) return null;
  const bi = win === 10 ? cur.bi : win === 100 ? cur.bi * 2 : cur.bi * 1.4;
  const verdict = D.LUCK_VERDICTS[cur.zone] || D.LUCK_VERDICTS[2];
  const frame = verdict.frame === "pearl" ? "#E8E8F0" : verdict.frame === "gold" ? HB_GOLD : UI.hairline;
  const st = window.dtLuckStats ? window.dtLuckStats(bi, win) : {
    went: win,
    up: win / 2,
    down: win / 2,
    lines: null
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "me-overlay me-screen hb",
    style: {
      zIndex: 85
    },
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Luck"
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "Back",
    onClick: () => {
      hbClick(900);
      onClose();
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
    className: "me-title"
  }, hbT("LUCK")), /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "FAQ",
    onClick: () => {
      hbClick(1000);
      faqRef.current && faqRef.current.scrollIntoView({
        behavior: "smooth"
      });
    },
    style: {
      fontFamily: HB_MONO,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff"
    }
  }, "?")), /*#__PURE__*/React.createElement("div", {
    className: "me-scroll",
    style: {
      padding: "4px 0 48px"
    }
  }, /*#__PURE__*/React.createElement("section", {
    className: "hb-editorial"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hb-period"
  }, /*#__PURE__*/React.createElement("span", null, "\u0428\u041E\u0423\u0414\u0410\u0423\u041D\u042B"), /*#__PURE__*/React.createElement("div", null, Seg && /*#__PURE__*/React.createElement(Seg, {
    options: [{
      id: 10,
      label: '10'
    }, {
      id: 25,
      label: '25'
    }, {
      id: 100,
      label: '100'
    }],
    value: win,
    onChange: setWin,
    accent: HB_ACC
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hb-result-header"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "hb-eyebrow"
  }, "\u0412\u0410\u0428\u0410 \u0423\u0414\u0410\u0427\u0410"), /*#__PURE__*/React.createElement("div", {
    className: "hb-big-result"
  }, /*#__PURE__*/React.createElement(window.DtCount, {
    value: Math.abs(bi),
    prefix: bi >= 0 ? '+' : '−'
  }), /*#__PURE__*/React.createElement("small", null, "BI")), /*#__PURE__*/React.createElement("p", null, bi >= 0 ? 'Выше математического ожидания' : 'Ниже математического ожидания'))), /*#__PURE__*/React.createElement("div", {
    className: "hb-trend-panel"
  }, /*#__PURE__*/React.createElement(window.DtLuckLines, {
    key: win,
    lines: st.lines,
    color: "#f0f2f7",
    h: 154
  })), /*#__PURE__*/React.createElement("div", {
    className: "hb-outcomes"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "\u0428\u041E\u0423\u0414\u0410\u0423\u041D\u042B"), /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(window.DtCount, {
    value: st.went,
    decimals: 0
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "\u0412\u042B\u0428\u0415 EV"), /*#__PURE__*/React.createElement("strong", {
    className: "is-positive"
  }, /*#__PURE__*/React.createElement(window.DtCount, {
    value: st.up,
    decimals: 0
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "\u041D\u0418\u0416\u0415 EV"), /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(window.DtCount, {
    value: st.down,
    decimals: 0
  })))), /*#__PURE__*/React.createElement("p", {
    className: "hb-explain"
  }, "\u0421\u0440\u0430\u0432\u043D\u0438\u0432\u0430\u0435\u043C \u0444\u0430\u043A\u0442\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0441 EV \u2014 \u0442\u0435\u043C, \u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0432\u044B \u0434\u043E\u043B\u0436\u043D\u044B \u0431\u044B\u043B\u0438 \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u043F\u043E \u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E\u0441\u0442\u044F\u043C. \u0420\u0430\u0437\u043D\u0438\u0446\u0430 \u0432 \u0431\u0430\u0439-\u0438\u043D\u0430\u0445 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442 \u0443\u0434\u0430\u0447\u0443 \u0437\u0430 \u0432\u044B\u0431\u0440\u0430\u043D\u043D\u044B\u0439 \u043F\u0435\u0440\u0438\u043E\u0434.")), /*#__PURE__*/React.createElement("div", {
    className: "hb-sec",
    style: {
      margin: "22px 0 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hb-h",
    style: {
      padding: "0 16px"
    }
  }, /*#__PURE__*/React.createElement("span", null, hbT("YOUR WORST BEATS")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: UI.textDim,
      letterSpacing: ".04em",
      fontWeight: 600
    }
  }, hbT("by cruelty"))), /*#__PURE__*/React.createElement(HbBeatList, {
    rows: D.MY_BEATS,
    label: "\u0422\u0435\u0431\u044F \u043F\u0435\u0440\u0435\u0435\u0445\u0430\u043B\u0438",
    onShare: setShare,
    onReplay: setReplay,
    onOpen: setDetail
  })), /*#__PURE__*/React.createElement("div", {
    className: "hb-sec",
    style: {
      margin: "22px 0 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "hb-h",
    style: {
      padding: "0 16px"
    }
  }, /*#__PURE__*/React.createElement("span", null, hbT("YOUR BEST SUCKOUTS")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: UI.textDim,
      letterSpacing: ".04em",
      fontWeight: 600
    }
  }, hbT("by cruelty"))), /*#__PURE__*/React.createElement(HbBeatList, {
    rows: D.MY_SUCKOUTS,
    label: "\u0422\u0432\u043E\u0438 \u0434\u043E\u0435\u0437\u0434\u044B",
    onShare: setShare,
    onReplay: setReplay,
    onOpen: setDetail
  })), /*#__PURE__*/React.createElement("section", {
    className: "hb-sec hb-faq-section",
    ref: faqRef,
    "aria-label": "\u0412\u043E\u043F\u0440\u043E\u0441\u044B \u043E\u0431 \u0443\u0434\u0430\u0447\u0435"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hb-h"
  }, /*#__PURE__*/React.createElement("span", null, "\u0412\u041E\u041F\u0420\u041E\u0421\u042B \u041E\u0411 \u0423\u0414\u0410\u0427\u0415")), /*#__PURE__*/React.createElement("div", {
    className: "hb-faq"
  }, D.FAQ.map(([q, ans], i) => /*#__PURE__*/React.createElement("div", {
    className: "hb-faq-item",
    "data-open": faq === i,
    key: i
  }, /*#__PURE__*/React.createElement("button", {
    id: 'luck-question-' + i,
    "aria-expanded": faq === i,
    "aria-controls": 'luck-answer-' + i,
    onClick: () => {
      hbClick(1000, .03);
      setFaq(faq === i ? -1 : i);
    }
  }, /*#__PURE__*/React.createElement("span", null, hbT(q)), /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14"
  }), /*#__PURE__*/React.createElement("path", {
    className: "hb-faq-plus",
    d: "M12 5v14"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hb-faq-answer",
    id: 'luck-answer-' + i,
    role: "region",
    "aria-labelledby": 'luck-question-' + i,
    "aria-hidden": faq !== i
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, hbT(ans))))))))), share && /*#__PURE__*/React.createElement(HbShareOverlay, {
    share: share,
    onClose: () => setShare(null)
  }), detail && /*#__PURE__*/React.createElement(window.HandDetailScreen, {
    open: true,
    hand: hbHand(detail),
    total: 1,
    index: 0,
    onClose: () => setDetail(null),
    onReplay: () => setReplay(detail),
    accent: HB_ACC
  }), replay && /*#__PURE__*/React.createElement(window.HandReplayV2, {
    open: true,
    hand: hbHand(replay),
    onClose: () => setReplay(null),
    accent: HB_ACC
  }));
}
Object.assign(window, {
  HeatScreen,
  HbBeatCard,
  HbBeatList,
  HbShareOverlay
});
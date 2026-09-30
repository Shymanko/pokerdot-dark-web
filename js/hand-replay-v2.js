// Hand replay — the hand played back on OUR felt. Opens from HAND DETAIL.
// Structure follows the room's replay: hand id top-left, close top-right, the
// table in the middle, a transport bar and street tabs at the bottom.

const MONO_RP = UI.fontUI;
const NUM_RP = "Roboto, system-ui, sans-serif";
const RP_W = 640,
  RP_H = 1280; // the felt's authoring space
const RP_POS_C = {
  "UTG": "#D71921",
  "UTG+1": "#E2603A",
  "CO": "#21C97B",
  "BTN": "#f0c75e",
  "SB": "#3B82F6",
  "BB": "#8B7BF7"
};
const rpClick = f => {
  if (window.playClick) window.playClick(f || 1100, 0.04);
};
const rpNum = n => (Math.round(n * 100) / 100).toFixed(2).replace(/\.00$/, "");

// every action becomes a frame: who acted, what the street shows, what is in
// front of each player and what the pot holds at that moment
function rpFrames(H) {
  const frames = [];
  const committed = {};
  H.streets.forEach((st, si) => {
    const bets = {};
    if (si === 0) H.players.forEach(p => {
      committed[p.pos] = 0;
    });else H.players.forEach(p => {
      bets[p.pos] = 0;
    });
    frames.push({
      si,
      street: st.name,
      board: st.cards,
      bets: Object.assign({}, bets),
      pot: rpPot(committed),
      actor: null,
      act: null,
      folded: rpFolded(frames)
    });
    st.rows.forEach(row => {
      const pos = row.p.pos;
      if (row.act === "FOLD" || row.act === "CHECK") {
        // nothing moves; only the badge changes
      } else if (si === 0) {
        committed[pos] = row.amt;
        bets[pos] = row.amt;
      } else {
        bets[pos] = (bets[pos] || 0) + row.amt;
        committed[pos] = (committed[pos] || 0) + row.amt;
      }
      frames.push({
        si,
        street: st.name,
        board: st.cards,
        bets: Object.assign({}, bets),
        pot: rpPot(committed),
        actor: pos,
        act: row.act,
        amt: row.amt,
        folded: frames.length ? Object.assign({}, frames[frames.length - 1].folded, row.act === "FOLD" ? {
          [pos]: 1
        } : null) : {}
      });
    });
  });
  frames.push({
    si: H.streets.length,
    street: "SHOWDOWN",
    board: 5,
    bets: {},
    pot: H.pot,
    actor: null,
    act: null,
    showdown: true,
    folded: frames.length ? frames[frames.length - 1].folded : {}
  });
  return frames;
}
const rpPot = c => Math.round(Object.keys(c).reduce((a, k) => a + (c[k] || 0), 0) * 100) / 100;
const rpFolded = frames => frames.length ? frames[frames.length - 1].folded || {} : {};
function RpSeat({
  p,
  x,
  y,
  K,
  acting,
  folded,
  showdown,
  accent
}) {
  const pw = 132,
    ph = 56;
  const nCards = p.cards.length;
  // same card sizes as the live table's seats (table-ref TrSeat)
  const cardW = nCards <= 2 ? 62 : nCards <= 4 ? 46 : 38;
  const face = p.hero || showdown && p.shownAtEnd;
  const c = RP_POS_C[p.pos] || accent;
  // fan the cards exactly like the live table's seats: overlapped, never wider
  // than the plate; face-up cards keep enough of the corner for the rank
  const step = nCards <= 2 ? face ? cardW * 1.06 : cardW * 0.66 : Math.max(face ? cardW * 0.45 : 0, cardW * 1.55 / (nCards - 1));
  const fanW = cardW + step * (nCards - 1);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: x * K,
      top: y * K,
      transform: "translate(-50%,-50%)",
      width: pw * K,
      opacity: folded ? 0.42 : 1,
      transition: "opacity 200ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      bottom: ph * K * 0.62,
      transform: "translateX(-50%)",
      width: fanW * K,
      height: 84 * K
    }
  }, p.cards.map((cd, i) => face ? /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      left: i * step * K,
      top: 0
    }
  }, /*#__PURE__*/React.createElement(window.TrCard, {
    r: cd.r === "T" ? "10" : cd.r,
    s: cd.s,
    w: cardW * K,
    h: 84 * K
  })) : /*#__PURE__*/React.createElement(window.TrBack, {
    key: i,
    w: cardW * K,
    h: 84 * K,
    tone: ["#3a3a44", "#232329"],
    style: {
      position: "absolute",
      left: i * step * K,
      top: 0
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      borderRadius: 12 * K,
      padding: `${7 * K}px ${8 * K}px ${9 * K}px`,
      textAlign: "center",
      background: "linear-gradient(180deg,#26262b,#16161a)",
      boxShadow: acting ? `0 0 0 ${2 * K}px ${accent}, 0 ${4 * K}px ${12 * K}px rgba(0,0,0,.6)` : `0 ${4 * K}px ${10 * K}px rgba(0,0,0,.55)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_RP,
      fontWeight: 600,
      fontSize: Math.max(12, 23 * K),
      lineHeight: 1.2,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: NUM_RP,
      fontWeight: 700,
      fontSize: Math.max(12, 26 * K),
      lineHeight: 1.2,
      color: "#f0c75e",
      whiteSpace: "nowrap"
    }
  }, "$ ", rpNum(p.stack)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -8 * K,
      top: -14 * K,
      height: 30 * K,
      padding: `0 ${9 * K}px`,
      borderRadius: 125,
      background: c,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO_RP,
      fontWeight: 700,
      fontSize: Math.max(12, 17 * K),
      letterSpacing: ".06em",
      color: "#fff"
    }
  }, p.pos)));
}
const RP_UI = "#D71921";
function HandReplayV2({
  open,
  hand,
  onClose,
  accent = "#D71921"
}) {
  const [mounted, setMounted] = React.useState(false);
  const [i, setI] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const [box, setBox] = React.useState({
    w: 0,
    h: 0
  });
  const stage = React.useRef(null);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    setI(0);
    setPlaying(true);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open, hand && hand.id]);
  React.useLayoutEffect(() => {
    if (!open) return;
    const measure = () => {
      const el = stage.current;
      if (el) setBox({
        w: el.offsetWidth,
        h: el.offsetHeight
      });
    };
    measure();
    const t = setTimeout(measure, 260);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, [open]);
  const H = open && hand ? hand.replayData || (window.hdSim ? window.hdSim(hand) : null) : null;
  const frames = React.useMemo(() => H ? rpFrames(H) : [], [H]);
  React.useEffect(() => {
    if (!open || !playing || !frames.length) return;
    if (i >= frames.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setI(n => Math.min(frames.length - 1, n + 1)), 950);
    return () => clearTimeout(t);
  }, [open, playing, i, frames.length]);
  if (!open || !H) return null;
  const F = frames[Math.min(i, frames.length - 1)] || frames[0];
  const cfg = (window.TR_DISC || {})[hand.disc === "PLO" ? "PLO4" : hand.disc] || (window.TR_DISC || {})["HOLD'EM"] || {};
  const AC = cfg.accent || accent; // the table's own accent drives the replay chrome
  const K = Math.min((box.w || 340) / RP_W, (box.h || 620) / RP_H) || 0.5;
  const seats = (window.TR_SEATS || {})[6] || [];

  // hero sits at the bottom; the others fill the ring in table order
  const heroIdx = H.players.findIndex(p => p.hero);
  const ring = H.players.slice(heroIdx + 1).concat(H.players.slice(0, heroIdx));
  const stacks = {};
  H.players.forEach(p => {
    stacks[p.pos] = p.stack || 100 * H.bb;
  });
  const seatOf = p => Object.assign({}, p, {
    stack: hand.replayData ? F.showdown ? stacks[p.pos] + ((H.results.find(x => x.p.pos === p.pos) || {}).delta || 0) : Math.max(0, stacks[p.pos] - H.streets.slice(0, F.si).reduce((sum, st) => sum + st.rows.filter(r => r.p.pos === p.pos).reduce((n, r) => n + (r.amt || 0), 0), 0) - (F.bets[p.pos] || 0)) : Math.max(0, stacks[p.pos] - (F.bets[p.pos] || 0)),
    shownAtEnd: (H.results.find(x => x.p.pos === p.pos) || {}).shown
  });
  const streets = H.streets.map(s => s.name).concat("SHOWDOWN");
  const jump = name => {
    rpClick(1150);
    const k = frames.findIndex(f => f.street === name);
    if (k >= 0) {
      setI(k);
      setPlaying(false);
    }
  };
  const step = d => {
    rpClick(950);
    setPlaying(false);
    setI(n => Math.max(0, Math.min(frames.length - 1, n + d)));
  };
  const streetJump = d => {
    rpClick(950);
    setPlaying(false);
    const cur = F.si;
    const k = frames.findIndex(f => f.si === cur + d && f.actor == null);
    if (k >= 0) setI(k);else setI(d > 0 ? frames.length - 1 : 0);
  };
  const tBtn = (svg, onTap, big) => /*#__PURE__*/React.createElement("button", {
    onClick: onTap,
    style: {
      flex: "none",
      width: big ? 52 : 40,
      height: big ? 52 : 40,
      borderRadius: "50%",
      cursor: "pointer",
      padding: 0,
      background: big ? AC : "rgba(255,255,255,.07)",
      border: big ? 0 : "1px solid rgba(255,255,255,.14)",
      boxShadow: big ? `0 8px 22px ${AC}55` : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, svg);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 80,
      background: "#050506",
      display: "flex",
      flexDirection: "column",
      opacity: mounted ? 1 : 0,
      transition: "opacity 220ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 3,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "58px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      rpClick(900);
      onClose && onClose();
    },
    "aria-label": "Back",
    style: {
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 12,
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
      flex: 1,
      textAlign: "center",
      fontFamily: MONO_RP,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "HAND REPLAY"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      rpClick(1200);
      if (window.showShareImage) window.showShareImage({
        selector: "[data-replay-felt]",
        accent: AC,
        foot: hand.disc + " · " + hand.stakes,
        text: "Think you can beat that? Take a seat."
      });
    },
    "aria-label": "Share hand",
    style: {
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 6l-4-4-4 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v13"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 3,
      textAlign: "center",
      padding: "6px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_RP,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, "HAND ID "), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: NUM_RP,
      fontWeight: 500,
      fontSize: 12,
      color: "#A9A9B2"
    }
  }, 1214933000 + (Number(String(hand.id).replace(/\D/g, "")) || 0) * 37)), /*#__PURE__*/React.createElement("div", {
    ref: stage,
    style: {
      flex: 1,
      minHeight: 0,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-replay-felt": "1",
    style: {
      position: "relative",
      width: RP_W * K,
      height: RP_H * K
    }
  }, cfg.felt && /*#__PURE__*/React.createElement("img", {
    src: cfg.felt,
    alt: "",
    style: {
      position: "absolute",
      left: -88 * K,
      top: -78 * K,
      width: 815 * K,
      height: 1348 * K,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: 436 * K,
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      fontFamily: MONO_RP,
      fontWeight: 600,
      fontSize: Math.max(12, 25 * K),
      lineHeight: 1,
      letterSpacing: ".02em",
      color: "#D8D8DF",
      textShadow: "0 2px 6px rgba(0,0,0,.5)"
    }
  }, hand.disc, " ", hand.stakes), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: 480 * K,
      transform: "translateX(-50%)",
      whiteSpace: "nowrap",
      fontFamily: MONO_RP,
      fontWeight: 600,
      fontSize: Math.max(12, 21 * K),
      lineHeight: 1,
      color: "#A9A9B2"
    }
  }, "6-MAX"), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: 522 * K,
      transform: "translateX(-50%)",
      width: 162 * K,
      borderRadius: 125,
      padding: `${6 * K}px 0 ${9 * K}px`,
      background: "rgba(0,0,0,.34)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_RP,
      fontWeight: 600,
      fontSize: Math.max(12, 19 * K),
      letterSpacing: ".12em",
      color: "#D8D8DF"
    }
  }, "POT"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: NUM_RP,
      fontWeight: 700,
      fontSize: Math.max(12, 32 * K),
      lineHeight: 1.05,
      color: "#fff"
    }
  }, rpNum(F.pot))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: 600 * K,
      transform: "translateX(-50%)",
      display: "flex",
      gap: 8 * K
    }
  }, H.board.slice(0, F.board).map((c, k) => /*#__PURE__*/React.createElement(window.TrCard, {
    key: k,
    r: c.r === "T" ? "10" : c.r,
    s: c.s,
    w: 84 * K,
    h: 124 * K
  }))), ring.map((p, k) => seats[k] && /*#__PURE__*/React.createElement(RpSeat, {
    key: p.pos,
    p: seatOf(p),
    x: seats[k].x,
    y: seats[k].y,
    K: K,
    accent: AC,
    acting: F.actor === p.pos,
    folded: !!F.folded[p.pos],
    showdown: !!F.showdown
  })), (() => {
    const p = H.players[heroIdx];
    return /*#__PURE__*/React.createElement(RpSeat, {
      p: seatOf(p),
      x: 190,
      y: 1030,
      K: K,
      accent: AC,
      acting: F.actor === p.pos,
      folded: !!F.folded[p.pos],
      showdown: !!F.showdown
    });
  })(), ring.map((p, k) => seats[k] && (F.bets[p.pos] || 0) > 0 && /*#__PURE__*/React.createElement(window.TrBet, {
    key: "b" + p.pos,
    x: seats[k].b.x,
    y: seats[k].b.y,
    amount: rpNum(F.bets[p.pos]),
    K: K
  })), (F.bets[H.players[heroIdx].pos] || 0) > 0 && /*#__PURE__*/React.createElement(window.TrBet, {
    x: 330,
    y: 962,
    amount: rpNum(F.bets[H.players[heroIdx].pos]),
    K: K
  }), F.act && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: 760 * K,
      transform: "translateX(-50%)",
      padding: `${5 * K}px ${16 * K}px`,
      borderRadius: 125,
      background: "rgba(0,0,0,.6)",
      border: `${1.2 * K}px solid ${AC}aa`,
      whiteSpace: "nowrap",
      fontFamily: MONO_RP,
      fontWeight: 700,
      fontSize: Math.max(12, 20 * K),
      letterSpacing: ".12em",
      color: "#fff"
    }
  }, F.actor, " ", F.act, F.amt ? " " + rpNum(F.amt) : ""))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 3,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      padding: "6px 16px 0"
    }
  }, tBtn(/*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 5h2.5v14H7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 5v14L9.5 12z"
  })), () => streetJump(-1)), tBtn(/*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11 12l9-7v14z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 12l9-7v14z"
  })), () => step(-1)), tBtn(playing ? /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "5",
    width: "4",
    height: "14",
    rx: "1.2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "5",
    width: "4",
    height: "14",
    rx: "1.2"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5l11 7-11 7z"
  })), () => {
    rpClick(1300);
    if (i >= frames.length - 1) setI(0);
    setPlaying(!playing);
  }, true), tBtn(/*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13 12L4 5v14z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M22 12l-9-7v14z"
  })), () => step(1)), tBtn(/*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17 5h-2.5v14H17z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 5v14l10.5-7z"
  })), () => streetJump(1))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 3,
      display: "flex",
      justifyContent: "center",
      gap: 6,
      padding: "12px 12px 24px",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 0
    }
  }), streets.map(n => {
    const on = n === F.street;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: () => jump(n),
      style: {
        flex: "none",
        height: 34,
        borderRadius: 125,
        cursor: "pointer",
        padding: "0 14px",
        background: on ? AC : "rgba(255,255,255,.045)",
        border: `1px solid ${on ? AC : "rgba(255,255,255,.12)"}`,
        fontFamily: MONO_RP,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".08em",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        whiteSpace: "nowrap"
      }
    }, n);
  })));
}
Object.assign(window, {
  HandReplayV2
});
// achievement.jsx — the branded achievement card the player shares.
// Four kinds: leaderboard place · tournament win · spin & win · grand jackpot.
// The frame is the product's own: black card, dot-matrix wash, Arcanium rule,
// POKERDOT wordmark, the player's handle and the referral link baked in — so a
// shared screenshot is always an invite.
//   window.showAchievement({ kind, ...fields })   → opens the card
//   window.AchievementHost                        → mount once (lobby does)

const AV_MONO = UI.font;
const AV_SANS = UI.fontUI;
const AV_REF = "pokerdot.com/i/CARD-4821";
const AV_USER = "SASHA02";
const AV_KIND = {
  board: {
    tag: "LEADERBOARD",
    accent: "#D71921",
    art: "assets/comp-grand.png",
    head: "PRIZE POSITION",
    foot: "GRAND LEADERBOARD · SEASON 01",
    hero: "CONGRATULATIONS"
  },
  tourney: {
    tag: "TOURNAMENT",
    accent: "#f0c75e",
    art: "assets/comp-grand.png",
    head: "CHAMPION",
    foot: "ARCANIUM SERIES · MAIN EVENT",
    hero: "FIRST PLACE"
  },
  spin: {
    tag: "SPIN & WIN",
    accent: "#21C97B",
    art: "assets/comp/spin.png",
    head: "MULTIPLIER HIT",
    foot: "SPIN & WIN · 3-MAX HYPER",
    hero: "MULTIPLIER HIT"
  },
  jackpot: {
    tag: "GRAND JACKPOT",
    accent: "#8B7BF7",
    art: "assets/rewards/cash.png",
    head: "JACKPOT WON",
    foot: "BAD BEAT JACKPOT · HOLD'EM",
    hero: "JACKPOT"
  }
};
const avNum = n => Number(n).toLocaleString("en-US").split(",").join(" ");

// ── the shareable card — a real screenshot of the screen, wrapped in the
//    product's own frame; every label lives ON the frame, never over the shot ─
function AvShot({
  shot,
  w,
  h,
  radius
}) {
  if (!shot || !shot.html) return null;
  const k = Math.min(w / shot.w, h / shot.h); // contain — the whole felt reads
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: w,
      height: h,
      borderRadius: radius,
      overflow: "hidden",
      background: "#050506",
      border: "1px solid rgba(255,255,255,.12)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      width: shot.w,
      height: shot.h,
      transform: `translate(-50%, -50%) scale(${k})`,
      transformOrigin: "center center",
      pointerEvents: "none",
      userSelect: "none"
    },
    dangerouslySetInnerHTML: {
      __html: shot.html
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "linear-gradient(180deg, rgba(0,0,0,.34) 0%, transparent 22%, transparent 74%, rgba(0,0,0,.62) 100%)"
    }
  }));
}
function AchievementCard({
  d,
  w = 330
}) {
  const K = AV_KIND[d.kind] || AV_KIND.board;
  const c = K.accent;
  const s = w / 330;
  const pad = 13 * s;
  const shotW = w - pad * 2;
  return /*#__PURE__*/React.createElement("div", {
    "data-achievement-card": "1",
    style: {
      position: "relative",
      overflow: "hidden",
      width: w,
      height: Math.round(w * 16 / 9),
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      borderRadius: 24 * s,
      padding: pad,
      background: "#07070a",
      border: `1px solid ${c}59`,
      boxShadow: `0 26px 60px rgba(0,0,0,.75), inset 0 1px 0 ${c}33`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(115% 90% at 88% 0%, ${c}3d, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.06) .8px, transparent 1.2px)",
      backgroundSize: 12 * s + "px " + 12 * s + "px",
      maskImage: "linear-gradient(150deg, black, transparent 72%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 72%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 8 * s,
      padding: `${3 * s}px ${4 * s}px ${11 * s}px`
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-pokerdot.svg",
    alt: "Pokerdot",
    style: {
      flex: "none",
      height: 17 * s,
      width: "auto",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: `linear-gradient(90deg, ${c}, transparent)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: AV_SANS,
      fontWeight: 700,
      fontSize: 9.5 * s,
      letterSpacing: .18 * s + "em",
      color: c,
      whiteSpace: "nowrap"
    }
  }, K.tag)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14 * s,
      padding: `${2 * s}px 0`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      width: 230 * s,
      height: 230 * s,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${c}3d, transparent 68%)`,
      filter: "blur(" + 6 * s + "px)",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: K.art,
    alt: "",
    style: {
      position: "relative",
      width: "78%",
      maxWidth: 230 * s,
      height: "auto",
      maxHeight: "74%",
      objectFit: "contain",
      filter: `drop-shadow(0 ${14 * s}px ${26 * s}px rgba(0,0,0,.75)) drop-shadow(0 0 ${26 * s}px ${c}59)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: AV_SANS,
      fontWeight: 700,
      fontSize: 10.5 * s,
      letterSpacing: .3 * s + "em",
      color: c,
      textAlign: "center"
    }
  }, d.hero || K.hero || "WINNER")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "flex-end",
      gap: 10 * s,
      padding: `${9 * s}px ${4 * s}px 0`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: AV_SANS,
      fontWeight: 700,
      fontSize: 9.5 * s,
      letterSpacing: .2 * s + "em",
      color: "#A9A9B2"
    }
  }, K.head), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 5 * s,
      fontFamily: AV_MONO,
      fontWeight: 700,
      fontSize: 32 * s,
      lineHeight: .95,
      color: "#fff",
      letterSpacing: "-.01em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, d.big), d.sub ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 6 * s,
      fontFamily: AV_SANS,
      fontWeight: 700,
      fontSize: 10.5 * s,
      letterSpacing: .12 * s + "em",
      color: c
    }
  }, d.sub) : null), d.prize ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: AV_SANS,
      fontWeight: 700,
      fontSize: 8.5 * s,
      letterSpacing: .16 * s + "em",
      color: "#A9A9B2"
    }
  }, d.prizeLabel || "PRIZE"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 6 * s,
      marginTop: 4 * s
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: d.tix ? "assets/rewards/ticket.png" : "assets/rewards/cash.png",
    alt: "",
    style: {
      flex: "none",
      width: 22 * s,
      height: 22 * s,
      objectFit: "contain"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: AV_MONO,
      fontWeight: 700,
      fontSize: 15 * s,
      color: c,
      whiteSpace: "nowrap"
    }
  }, d.prize))) : null), d.stats && d.stats.length ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      margin: `${12 * s}px ${4 * s}px 0`,
      borderRadius: 12 * s,
      background: "rgba(255,255,255,.045)",
      border: "1px solid rgba(255,255,255,.09)"
    }
  }, d.stats.map(([k, v], i) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      flex: 1,
      minWidth: 0,
      padding: `${9 * s}px ${11 * s}px`,
      borderLeft: i ? "1px solid rgba(255,255,255,.08)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: AV_SANS,
      fontWeight: 700,
      fontSize: 8.5 * s,
      letterSpacing: .14 * s + "em",
      color: "#8A8A93",
      whiteSpace: "nowrap"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3 * s,
      fontFamily: AV_MONO,
      fontWeight: 700,
      fontSize: 12 * s,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, v)))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 12 * s,
      paddingTop: 11 * s,
      borderTop: "1px solid rgba(255,255,255,.09)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9 * s
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: (window.CHAT_AV || {}).drebin || "assets/chat/drebin.webp",
    alt: "",
    style: {
      flex: "none",
      width: 28 * s,
      height: 28 * s,
      borderRadius: "50%",
      objectFit: "cover",
      border: `1px solid ${c}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: AV_MONO,
      fontWeight: 700,
      fontSize: 12 * s,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, d.user || AV_USER), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: AV_SANS,
      fontWeight: 700,
      fontSize: 8.5 * s,
      letterSpacing: .14 * s + "em",
      color: "#8A8A93",
      marginTop: 2 * s,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, K.foot)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: AV_SANS,
      fontWeight: 700,
      fontSize: 8.5 * s,
      letterSpacing: .16 * s + "em",
      color: c
    }
  }, "JOIN ME"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 2 * s,
      fontFamily: AV_MONO,
      fontWeight: 700,
      fontSize: 10.5 * s,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, AV_REF)))));
}

// ── the full-screen achievement takeover: card + share actions ─────────────
function AchievementScreen({
  data,
  onClose
}) {
  const [up, setUp] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  React.useEffect(() => {
    if (!data) {
      setUp(false);
      setCopied(false);
      setSaved(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [data]);
  if (!data) return null;
  const K = AV_KIND[data.kind] || AV_KIND.board;
  const c = K.accent;
  const click = f => {
    if (window.playClick) window.playClick(f, .04);
  };
  const share = () => {
    click(1300);
    const text = data.shareText || K.head + " — " + data.big + " on POKERDOT. Join me: " + AV_REF;
    try {
      if (navigator.share) {
        navigator.share({
          text
        });
        return;
      }
      if (navigator.clipboard) navigator.clipboard.writeText(text);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const btn = (label, sub, primary, onTap, icon) => /*#__PURE__*/React.createElement("button", {
    onClick: onTap,
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "14px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: primary ? c : "rgba(255,255,255,.06)",
      border: primary ? 0 : "1px solid rgba(255,255,255,.16)",
      color: primary ? c === "#f0c75e" ? "#241c00" : "#fff" : "rgba(255,255,255,.8)",
      boxShadow: primary ? `0 12px 26px ${c}55` : "none",
      fontFamily: AV_SANS,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".01em"
    }
  }, icon, sub || label);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 240,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 18px",
      background: `radial-gradient(120% 80% at 50% 0%, ${c}26, rgba(3,3,4,.94) 58%, #030304)`,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      opacity: up ? 1 : 0,
      transition: "opacity 220ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(800);
      onClose();
    },
    "aria-label": "Close",
    style: {
      position: "absolute",
      top: 52,
      right: 16,
      width: 38,
      height: 38,
      borderRadius: 125,
      background: "rgba(255,255,255,.075)",
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
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      transform: up ? "scale(1) translateY(0)" : "scale(.94) translateY(14px)",
      transition: "transform 300ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement(AchievementCard, {
    d: data
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 330,
      marginTop: 18,
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9
    }
  }, btn("SAVE", saved ? "SAVED" : "SAVE", false, () => {
    click(1000);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.5 10.5L12 15l4.5-4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 20h16"
  }))), btn("SHARE", copied ? "LINK COPIED" : "SHARE", true, share, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "5.5",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6.5",
    cy: "12",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "18.5",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 10.8l6-4M9 13.2l6 4"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 13px",
      borderRadius: 12,
      background: "rgba(255,255,255,.045)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 13.5a4 4 0 0 0 5.7 0l2.6-2.6a4 4 0 0 0-5.7-5.7l-1 1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 10.5a4 4 0 0 0-5.7 0l-2.6 2.6a4 4 0 0 0 5.7 5.7l1-1"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: AV_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      lineHeight: 1.4,
      color: "#A9A9B2"
    }
  }, "Your win as a 9:16 picture with your referral link on it \u2014 every share invites friends."))));
}

// ── host + demo payloads ───────────────────────────────────────────────────
const AV_DEMO = {
  board: {
    kind: "board",
    big: "#12",
    sub: "GRAND LEADERBOARD · MID",
    prize: "C$4 250 000",
    prizeLabel: "IN LINE FOR",
    stats: [["FIELD", "35 240"], ["POINTS", "18 450"], ["ENDS", "38D"]]
  },
  tourney: {
    kind: "tourney",
    big: "1st",
    sub: "DAILY DEEP · 3 850 ENTRIES",
    prize: "C$115 000 000",
    prizeLabel: "PRIZE WON",
    stats: [["ENTRIES", "3 850"], ["ITM", "TOP 1%"], ["KO", "17"]]
  },
  spin: {
    kind: "spin",
    big: "×100",
    sub: "SPIN & WIN · C$1 000 BUY-IN",
    prize: "C$100 000",
    prizeLabel: "PAID OUT",
    stats: [["MULTIPLIER", "×100"], ["ODDS", "1 : 25 000"], ["HANDS", "9"]]
  },
  jackpot: {
    kind: "jackpot",
    big: "C$8 412 900",
    sub: "BAD BEAT · QUADS BEATEN",
    prize: "50% OF THE POOL",
    prizeLabel: "YOUR SHARE",
    stats: [["HAND", "QUAD 9s"], ["BEATEN BY", "STR FLUSH"], ["TABLE", "TABLE 271"]]
  }
};

// Grabs the screen the player is sharing FROM: climbs to the phone-sized
// ancestor and serialises it, so the card frames a real shot, not a mock-up.
function avGrabShot(marker) {
  try {
    // the felt is what the player wants to show off — grab the table if it is
    // mounted (the win overlay sits on top of it, so it still is), and only
    // fall back to the phone-sized ancestor when there is no table on screen.
    let best = document.querySelector("[data-table-shot]");
    if (!best || !best.offsetHeight) {
      best = null;
      let el = marker;
      while (el) {
        if (el.offsetWidth && el.offsetWidth <= 520 && el.offsetHeight > 380) best = el;
        el = el.parentElement;
      }
    }
    if (!best) return null;
    const clone = best.cloneNode(true);
    clone.querySelectorAll("[data-achievement-card], [data-no-shot]").forEach(n => n.remove());
    return {
      html: clone.outerHTML,
      w: best.offsetWidth,
      h: best.offsetHeight
    };
  } catch (e) {
    return null;
  }
}
function AchievementHost() {
  const [data, setData] = React.useState(null);
  const mark = React.useRef(null);
  React.useEffect(() => {
    window.showAchievement = p => {
      const base = typeof p === "string" ? Object.assign({}, AV_DEMO[p] || AV_DEMO.board) : Object.assign({}, AV_DEMO[p && p.kind || "board"], p || {});
      setData(base);
    };
    return () => {
      delete window.showAchievement;
    };
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    ref: mark,
    style: {
      display: "none"
    }
  }), /*#__PURE__*/React.createElement(AchievementScreen, {
    data: data,
    onClose: () => setData(null)
  }));
}
Object.assign(window, {
  AchievementCard,
  AchievementScreen,
  AchievementHost,
  AvShot,
  avGrabShot,
  AV_DEMO,
  AV_REF
});
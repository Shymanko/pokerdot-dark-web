function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Table flow — after BUY-IN the player picks a table, then sits at it.
// TableListScreen: cash tables with varied VPIP cap / board type / bomb-pot.
// PokerTableScreen: the felt with empty seats (tap a seat to sit).
// Pokerix house style: black chrome, red felt, Space Mono / Roboto.

const MONO_TB = UI.font;
const SANS_TB = UI.fontUI;

// ── your hole cards (dealt when you sit) ──────────────────────────────────
const TB_SUITS = ["spade", "heart", "diamond", "club"];
const TB_RANKS = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
function dealHoleCards() {
  const pick = () => ({
    r: TB_RANKS[Math.random() * TB_RANKS.length | 0],
    s: TB_SUITS[Math.random() * TB_SUITS.length | 0]
  });
  const a = pick();
  let b = pick();
  while (b.r === a.r && b.s === a.s) b = pick();
  return [a, b];
}
function HoleCards({
  hand,
  accent
}) {
  const Suit = window.Suit;
  const colorFor = s => s === "heart" || s === "diamond" ? accent : "#fff";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      padding: "6px 14px",
      borderRadius: 8,
      background: "rgba(0,0,0,.55)",
      border: "1px solid rgba(255,255,255,.22)",
      boxShadow: "0 4px 14px rgba(0,0,0,.5)"
    }
  }, hand.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2
    }
  }, Suit ? /*#__PURE__*/React.createElement(Suit, {
    kind: c.s,
    size: 15,
    color: colorFor(c.s)
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: colorFor(c.s),
      fontSize: 14
    }
  }, c.s[0]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      lineHeight: 1
    }
  }, c.r))));
}

// ── multitabling tab — one open table shown as a hand pill in the top bar.
// Cards read as suit-over-rank columns so a 6-card PLO hand fits the same pill
// a Hold'em hand uses. Active table = discipline/accent fill; tap to switch.
function HandTab({
  hand,
  active,
  accent,
  onClick,
  dim = false
}) {
  const Suit = window.Suit;
  const cards = hand || [];
  const many = cards.length > 4;
  const col = active ? "#fff" : "#0a0a0c";
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      flex: "none",
      height: 34,
      display: "inline-flex",
      alignItems: "center",
      gap: many ? 5 : 7,
      padding: many ? "0 9px" : "0 11px",
      borderRadius: 125,
      cursor: "pointer",
      border: 0,
      background: active ? accent : "#fff",
      boxShadow: active ? `0 3px 12px ${accent}55` : "0 2px 7px rgba(0,0,0,.4)",
      opacity: active ? 1 : 0.92,
      transition: "background .16s, box-shadow .16s, opacity .16s"
    }
  }, cards.length ? cards.map((c, i) => {
    const red = c.s === "heart" || c.s === "diamond";
    const ink = active ? "#fff" : red ? accent : "#0a0a0c";
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
        lineHeight: 1,
        opacity: dim ? 0.5 : 1,
        transition: "opacity .2s"
      }
    }, /*#__PURE__*/React.createElement(Suit, {
      kind: c.s,
      size: many ? 8.5 : 10,
      color: ink
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_TB,
        fontWeight: 700,
        fontSize: many ? 10 : 11.5,
        color: ink,
        lineHeight: 1.05,
        marginTop: 1
      }
    }, c.r));
  }) : [0, 1].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 11,
      height: 15,
      borderRadius: 2.5,
      border: `1.5px dashed ${active ? "rgba(255,255,255,.55)" : "rgba(10,10,12,.35)"}`,
      marginLeft: i ? 2 : 0
    }
  })));
}

// ── active-tab dropdown — tap the open table's pill → Sit out / Leave.
// Three visual styles, all anchored under the pill (caret points up to it).
function TabMenu({
  style = 1,
  accent,
  onSitOut,
  onLeave
}) {
  const IcoPause = ({
    s = 16,
    c = "#fff"
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
    viewBox: "0 0 24 24",
    fill: c,
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "5",
    width: "4",
    height: "14",
    rx: "1.3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "5",
    width: "4",
    height: "14",
    rx: "1.3"
  }));
  const IcoExit = ({
    s = 16,
    c = "#ff5964"
  }) => /*#__PURE__*/React.createElement("svg", {
    width: s,
    height: s,
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
    d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 17l5-5-5-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12H9"
  }));
  const caret = /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -6,
      left: 22,
      width: 12,
      height: 12,
      background: "rgba(16,16,20,.99)",
      borderLeft: "1px solid rgba(255,255,255,.1)",
      borderTop: "1px solid rgba(255,255,255,.1)",
      transform: "rotate(45deg)"
    }
  });
  const wrap = {
    position: "absolute",
    top: "calc(100% + 9px)",
    left: 0,
    zIndex: 40,
    background: "rgba(16,16,20,.99)",
    border: "1px solid rgba(255,255,255,.1)",
    boxShadow: "0 16px 40px rgba(0,0,0,.65)"
  };

  // 1 — classic list (icon tile + label rows, Leave tinted red)
  if (style === 1) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        width: 178,
        borderRadius: 14,
        padding: "5px 4px",
        overflow: "hidden"
      }
    }, caret, /*#__PURE__*/React.createElement("div", {
      onClick: onSitOut,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "9px 11px",
        cursor: "pointer",
        borderRadius: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 30,
        height: 30,
        borderRadius: 12,
        background: "rgba(255,255,255,.085)",
        border: "1px solid rgba(255,255,255,.16)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement(IcoPause, {
      s: 15
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontFamily: SANS_TB,
        fontWeight: 600,
        fontSize: 13,
        color: "#fff"
      }
    }, "Sit out"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_TB,
        fontWeight: 700,
        fontSize: 11,
        color: "#8A8A93"
      }
    }, "5:00")), /*#__PURE__*/React.createElement("div", {
      onClick: onLeave,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 11,
        padding: "9px 11px",
        cursor: "pointer",
        borderRadius: 12,
        background: `${accent}14`,
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 30,
        height: 30,
        borderRadius: 12,
        background: `${accent}22`,
        border: `1px solid ${accent}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement(IcoExit, {
      s: 15
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 13,
        color: "#ff5964"
      }
    }, "Leave table")));
  }
  // 2 — compact two-button popover (side-by-side icon tiles)
  if (style === 2) {
    const tile = (bg, bd) => ({
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      padding: "12px 10px",
      borderRadius: 12,
      background: bg,
      border: `1px solid ${bd}`,
      cursor: "pointer"
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        ...wrap,
        width: 168,
        borderRadius: 16,
        padding: 8
      }
    }, caret, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: onSitOut,
      style: tile("rgba(255,255,255,.075)", "rgba(255,255,255,.16)")
    }, /*#__PURE__*/React.createElement(IcoPause, {
      s: 20
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 11,
        color: "#fff"
      }
    }, "Sit out"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_TB,
        fontWeight: 700,
        fontSize: 10.5,
        color: "#A9A9B2"
      }
    }, "5:00")), /*#__PURE__*/React.createElement("div", {
      onClick: onLeave,
      style: tile(`${accent}18`, `${accent}55`)
    }, /*#__PURE__*/React.createElement(IcoExit, {
      s: 20
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 11,
        color: "#ff5964"
      }
    }, "Leave"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_TB,
        fontWeight: 700,
        fontSize: 10.5,
        color: "rgba(255,89,100,.6)"
      }
    }, "CASH OUT"))));
  }
  // 3 — descriptive action card (label + subtitle rows)
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      width: 214,
      borderRadius: 16,
      padding: 6,
      overflow: "hidden"
    }
  }, caret, /*#__PURE__*/React.createElement("div", {
    onClick: onSitOut,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "10px 11px",
      cursor: "pointer",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(IcoPause, {
    s: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      lineHeight: 1.25
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff"
    }
  }, "Sit out"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, "Hold your seat \xB7 auto-out in 5:00"))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "rgba(255,255,255,.13)",
      margin: "2px 11px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    onClick: onLeave,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "10px 11px",
      cursor: "pointer",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 12,
      background: `${accent}22`,
      border: `1px solid ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(IcoExit, {
    s: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      lineHeight: 1.25
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      color: "#ff5964"
    }
  }, "Leave table"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 10.5,
      color: "rgba(255,89,100,.55)"
    }
  }, "Cash out your stack"))));
}

// ── a single playing card (DS white face: corner rank + centre suit pip) ──
function TbCard({
  r,
  s,
  w = 34,
  dim = false
}) {
  const Suit = window.Suit;
  const red = s === "heart" || s === "diamond";
  const col = dim ? "#b9b9c1" : red ? "#D71921" : "#0a0a0c";
  const bg = dim ? "#45454d" : "#fff";
  const h = Math.round(w * 1.4);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      height: h,
      borderRadius: Math.max(4, Math.round(w * 0.14)),
      background: bg,
      position: "relative",
      boxShadow: "0 3px 7px rgba(0,0,0,.5)",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: 4,
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: Math.round(w * 0.34),
      color: col,
      lineHeight: 1
    }
  }, r), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingTop: Math.round(w * 0.16)
    }
  }, Suit ? /*#__PURE__*/React.createElement(Suit, {
    kind: s,
    size: Math.round(w * 0.5),
    color: col
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: col,
      fontWeight: 700
    }
  }, s[0])));
}

// ── country flag — N horizontal bands ──
function TbFlag({
  colors
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 17,
      height: 12,
      borderRadius: 2,
      overflow: "hidden",
      border: "1.5px solid #0c0c0e",
      display: "flex",
      flexDirection: "column"
    }
  }, colors.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      background: c
    }
  })));
}

// ── timebank ring — frames the hero tile while it's your turn. Depletes
// green → gold → red over TB_TIME, then blinks a red alarm frame in the final
// seconds. Pure CSS (GPU-smooth, no per-frame React). Loops for the demo.
const TB_TIME = 10; // seconds on the clock
function TbTimebank({
  active = true
}) {
  if (!active) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: "208",
    height: "112",
    viewBox: "0 0 208 112",
    style: {
      position: "absolute",
      left: -6,
      top: -6,
      pointerEvents: "none",
      zIndex: 5,
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "202",
    height: "106",
    rx: "20",
    ry: "20",
    fill: "none",
    stroke: "rgba(255,255,255,.16)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "202",
    height: "106",
    rx: "20",
    ry: "20",
    fill: "none",
    strokeWidth: "3",
    strokeLinecap: "round",
    pathLength: "100",
    style: {
      strokeDasharray: "100 100",
      animation: `tbk-deplete ${TB_TIME}s linear infinite, tbk-color ${TB_TIME}s linear infinite`
    }
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "202",
    height: "106",
    rx: "20",
    ry: "20",
    fill: "none",
    stroke: "#D71921",
    strokeWidth: "3.5",
    style: {
      filter: "drop-shadow(0 0 9px #D71921)",
      opacity: 0,
      animation: `tbk-alarm ${TB_TIME}s linear infinite`
    }
  }));
}
// ── live numeric clock — counts TB_TIME → 0 then loops; turns red + blinks ≤4s ──
function TbClock({
  accent
}) {
  const [s, setS] = React.useState(TB_TIME);
  React.useEffect(() => {
    const start = performance.now();
    let last = -1,
      raf;
    const tick = now => {
      const elapsed = (now - start) / 1000 % TB_TIME;
      const rem = Math.max(1, Math.ceil(TB_TIME - elapsed));
      if (rem !== last) {
        last = rem;
        setS(rem);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const urgent = s <= 4;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 11,
      color: urgent ? accent : accent,
      fontVariantNumeric: "tabular-nums",
      animation: urgent ? "tbk-blink .9s steps(1,end) infinite" : "none"
    }
  }, "0:", String(s).padStart(2, "0"));
}

// ── sit-out countdown — you stepped out; SIT_TIME before auto-removal. Same
// visual as the decision timebank (frame around the hero tile), but driven over
// 5 min and showing SIT OUT + the remaining time where the combo normally is.
const SIT_TIME = 300; // 5:00
function useSitCountdown(active) {
  const [rem, setRem] = React.useState(SIT_TIME);
  React.useEffect(() => {
    if (!active) {
      setRem(SIT_TIME);
      return;
    }
    setRem(SIT_TIME);
    const id = setInterval(() => setRem(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(id);
  }, [active]);
  const m = Math.floor(rem / 60),
    s = rem % 60;
  return {
    rem,
    label: `${m}:${String(s).padStart(2, "0")}`,
    pct: rem / SIT_TIME,
    urgent: rem <= 30
  };
}
function sitColor(pct, urgent) {
  return urgent ? "#D71921" : pct > 0.5 ? "#5BD96A" : "#f0c75e";
}
// the depleting frame around the hero tile (mirrors TbTimebank's look)
function TbSitTimebank({
  pct,
  color,
  urgent
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "208",
    height: "112",
    viewBox: "0 0 208 112",
    style: {
      position: "absolute",
      left: -6,
      top: -6,
      pointerEvents: "none",
      zIndex: 5,
      overflow: "visible",
      animation: urgent ? "tbk-blink .9s steps(1,end) infinite" : "none"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "202",
    height: "106",
    rx: "20",
    ry: "20",
    fill: "none",
    stroke: "rgba(255,255,255,.16)",
    strokeWidth: "3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "202",
    height: "106",
    rx: "20",
    ry: "20",
    fill: "none",
    stroke: color,
    strokeWidth: "3",
    strokeLinecap: "round",
    pathLength: "100",
    strokeDasharray: "100 100",
    strokeDashoffset: 100 * (1 - pct),
    style: {
      transition: "stroke-dashoffset 1s linear, stroke .5s",
      filter: urgent ? `drop-shadow(0 0 8px ${color})` : "none"
    }
  }));
}

// ── pill timebank — same behaviour as the hero frame, sized to wrap an
// opponent's nick/balance pill (the player currently to act). Measures its host
// pill so the stadium frame fits any width. Reuses the tbk-* keyframes.
function TbTimebankPill() {
  const ref = React.useRef(null);
  const [box, setBox] = React.useState({
    w: 0,
    h: 0
  });
  React.useLayoutEffect(() => {
    const host = ref.current && ref.current.parentElement;
    if (!host) return;
    const measure = () => setBox(p => p && p.w === host.offsetWidth && p.h === host.offsetHeight ? p : {
      w: host.offsetWidth,
      h: host.offsetHeight
    });
    measure();
    window.addEventListener("resize", measure);
    const tm = setTimeout(measure, 350);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(tm);
    };
  }, []);
  if (!box || !box.w) return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      position: "absolute"
    }
  });
  const sw = 3;
  const W = box.w,
    H = box.h,
    rx = H / 2;
  // inner stroke — sit the ring just inside the pill edge
  const RECT = {
    x: sw / 2,
    y: sw / 2,
    width: W - sw,
    height: H - sw,
    rx: rx - sw / 2,
    ry: rx - sw / 2,
    fill: "none"
  };
  return /*#__PURE__*/React.createElement("svg", {
    ref: ref,
    width: W,
    height: H,
    viewBox: `0 0 ${W} ${H}`,
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      pointerEvents: "none",
      zIndex: 7,
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("rect", _extends({}, RECT, {
    stroke: "rgba(255,255,255,.16)",
    strokeWidth: sw
  })), /*#__PURE__*/React.createElement("rect", _extends({}, RECT, {
    strokeWidth: sw,
    strokeLinecap: "round",
    pathLength: "100",
    style: {
      strokeDasharray: "100 100",
      animation: `tbk-deplete ${TB_TIME}s linear infinite, tbk-color ${TB_TIME}s linear infinite`
    }
  })), /*#__PURE__*/React.createElement("rect", _extends({}, RECT, {
    stroke: "#D71921",
    strokeWidth: sw + 0.5,
    style: {
      filter: "drop-shadow(0 0 8px #D71921)",
      opacity: 0,
      animation: `tbk-alarm ${TB_TIME}s linear infinite`
    }
  })));
}

// ── a seated player: avatar + VPIP (left) + flag (right) + nick / balance ──
function TbSeat({
  p,
  accent,
  tilt,
  seatStyle,
  onOpen,
  tag
}) {
  const isHero = !!p.you;
  const tagColor = tag && tag.color || null;
  const clickable = !isHero && !!onOpen;
  const aMap = {
    FOLD: {
      bg: "rgba(60,60,66,.95)",
      fg: "rgba(255,255,255,.55)"
    },
    CHECK: {
      bg: "rgba(70,194,117,.16)",
      fg: "#5BD96A"
    },
    CALL: {
      bg: "rgba(70,194,117,.16)",
      fg: "#5BD96A"
    },
    RAISE: {
      bg: `${accent}26`,
      fg: "#ff6b73"
    },
    BET: {
      bg: `${accent}26`,
      fg: "#ff6b73"
    }
  };
  const a = p.action ? aMap[p.action] : null;
  const avatarInner = isHero ? /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar.png",
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 30%"
    }
  }) : p.av ? /*#__PURE__*/React.createElement("img", {
    src: (window.CHAT_AV || {})[p.av] || `assets/chat/${p.av}.webp`,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : p.cat ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26,
      lineHeight: 1
    }
  }, "\uD83D\uDC31") : /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.5)",
    strokeWidth: "1.8"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8.5",
    r: "3.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 20c0-4 3.2-6 7-6s7 2 7 6",
    strokeLinecap: "round"
  }));

  // ── pill seat (variant D): avatar+cards like variant C, nick/balance in a pill ──
  if (seatStyle === "pill") {
    return /*#__PURE__*/React.createElement("div", {
      onClick: clickable ? onOpen : undefined,
      style: {
        position: "absolute",
        left: `${p.x}%`,
        top: `${p.y}%`,
        transform: "translate(-50%,-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        zIndex: 4,
        opacity: p.folded ? 0.34 : 1,
        filter: p.folded ? "grayscale(.7)" : "none",
        transition: "opacity .4s, filter .4s",
        cursor: clickable ? "pointer" : "default"
      }
    }, a && /*#__PURE__*/React.createElement("span", {
      key: p.actKey,
      style: {
        marginBottom: 4,
        display: "inline-flex",
        alignItems: "center",
        padding: "0 8px",
        height: 17,
        borderRadius: 125,
        background: a.bg,
        color: a.fg,
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".08em",
        whiteSpace: "nowrap"
      }
    }, p.action), !isHero && !p.folded && /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        marginBottom: -52,
        position: "relative",
        zIndex: 3
      }
    }, [0, 1].map(i => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginLeft: i ? -12 : 0,
        transform: `rotate(${i ? 6 : -6}deg)`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 30,
        height: 42,
        borderRadius: 5,
        background: `repeating-linear-gradient(45deg, ${accent} 0 5px, #a3121b 5px 10px)`,
        border: "1px solid rgba(0,0,0,.4)",
        boxShadow: "0 3px 7px rgba(0,0,0,.5)",
        position: "relative",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 3,
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,.5)"
      }
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        width: 50,
        height: 50
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 50,
        height: 50,
        borderRadius: "50%",
        overflow: "hidden",
        border: `2px solid ${isHero ? accent : tagColor || "rgba(255,255,255,.4)"}`,
        boxShadow: isHero ? `0 0 0 2px ${accent}, 0 0 20px ${accent}aa, 0 6px 14px rgba(0,0,0,.5)` : tagColor ? `0 0 0 2px ${tagColor}, 0 0 14px ${tagColor}88, 0 6px 14px rgba(0,0,0,.5)` : "0 0 0 2px rgba(0,0,0,.55), 0 6px 14px rgba(0,0,0,.5)",
        background: "#23232a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, avatarInner), isHero && /*#__PURE__*/React.createElement(window.LegendFrameOverlay, null), (() => {
      const r = (26 - 3.5) / 2,
        c = 2 * Math.PI * r;
      return /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          left: -7,
          bottom: -7,
          zIndex: 5,
          width: 26,
          height: 26,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          background: "#0c0c0e",
          border: "1.5px solid #0c0c0e"
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: "26",
        height: "26",
        style: {
          position: "absolute",
          transform: "rotate(-90deg)"
        }
      }, /*#__PURE__*/React.createElement("circle", {
        cx: "13",
        cy: "13",
        r: r,
        fill: "none",
        stroke: "rgba(255,255,255,.22)",
        strokeWidth: "3.5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "13",
        cy: "13",
        r: r,
        fill: "none",
        stroke: "#f0c75e",
        strokeWidth: "3.5",
        strokeLinecap: "round",
        strokeDasharray: c,
        strokeDashoffset: c * (1 - p.vpip / 100)
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: MONO_TB,
          fontWeight: 700,
          fontSize: 10.5,
          color: "#fff"
        }
      }, p.vpip));
    })(), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        right: -4,
        bottom: -4,
        zIndex: 5
      }
    }, /*#__PURE__*/React.createElement(TbFlag, {
      colors: p.flag
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        marginTop: 8,
        borderRadius: 125,
        background: tagColor ? `linear-gradient(0deg, ${tagColor}33, ${tagColor}33), rgba(8,8,10,.94)` : "rgba(8,8,10,.94)",
        border: `1px solid ${isHero ? accent : tagColor || "rgba(255,255,255,.2)"}`,
        padding: "4px 13px 5px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: 1.28,
        minWidth: 64,
        boxShadow: tagColor ? `0 4px 10px rgba(0,0,0,.55), 0 0 12px ${tagColor}66` : "0 4px 10px rgba(0,0,0,.55)"
      }
    }, p.toAct && !isHero && /*#__PURE__*/React.createElement(TbTimebankPill, null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 11,
        color: "#fff",
        whiteSpace: "nowrap"
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_TB,
        fontWeight: 700,
        fontSize: 11,
        color: "#f0c75e"
      }
    }, p.bal), p.dealer && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: -8,
        [p.x > 50 ? "left" : "right"]: -8,
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "radial-gradient(circle at 36% 30%, #ffffff, #e3cd86 62%, #b3923f)",
        color: "#3a2a07",
        border: "1.5px solid #0c0c0e",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 11,
        boxShadow: "0 3px 8px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.7)",
        zIndex: 6
      }
    }, "D")), p.chip > 0 && /*#__PURE__*/React.createElement("span", {
      key: "c" + p.actKey,
      style: {
        position: "absolute",
        top: "104%",
        left: "50%",
        transform: "translateX(-50%)",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "1px 7px 1px 4px",
        borderRadius: 125,
        background: "rgba(0,0,0,.7)",
        border: "1px solid #f0c75e55",
        fontFamily: MONO_TB,
        fontWeight: 700,
        fontSize: 10.5,
        color: "#f0c75e",
        whiteSpace: "nowrap",
        zIndex: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: "radial-gradient(circle at 35% 30%, #ffe9a8, #f0c75e 70%)",
        border: "1px solid rgba(0,0,0,.4)"
      }
    }), p.chip), p.says && /*#__PURE__*/React.createElement("div", {
      key: "s" + p.says,
      style: {
        position: "absolute",
        bottom: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: 8,
        zIndex: 9,
        animation: "tb-bubble .3s cubic-bezier(.2,1.5,.4,1) both",
        pointerEvents: "none"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: `linear-gradient(150deg, ${accent}, #a3121b)`,
        color: "#fff",
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 12,
        padding: "7px 13px",
        borderRadius: 14,
        boxShadow: `0 6px 18px ${accent}66`,
        whiteSpace: "nowrap"
      }
    }, p.says), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "6px solid transparent",
        borderRight: "6px solid transparent",
        borderTop: `7px solid ${accent}`
      }
    })));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${p.x}%`,
      top: `${p.y}%`,
      transform: "translate(-50%,-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: 4,
      opacity: p.folded ? 0.34 : 1,
      filter: p.folded ? "grayscale(.7)" : "none",
      transition: "opacity .4s, filter .4s"
    }
  }, a && /*#__PURE__*/React.createElement("span", {
    key: p.actKey,
    style: {
      marginBottom: 4,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 8px",
      height: 17,
      borderRadius: 125,
      background: a.bg,
      color: a.fg,
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      animation: "pp-pulse 0s",
      whiteSpace: "nowrap"
    }
  }, p.action), !isHero && !p.folded && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      marginBottom: -52,
      position: "relative",
      zIndex: 3
    }
  }, [0, 1].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginLeft: i ? -12 : 0,
      transform: `rotate(${i ? 6 : -6}deg)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 42,
      borderRadius: 5,
      background: `repeating-linear-gradient(45deg, ${accent} 0 5px, #a3121b 5px 10px)`,
      border: "1px solid rgba(0,0,0,.4)",
      boxShadow: "0 3px 7px rgba(0,0,0,.5)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 3,
      borderRadius: 3,
      border: "1px solid rgba(255,255,255,.5)"
    }
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 50,
      height: 50
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 50,
      height: 50,
      borderRadius: "50%",
      overflow: "hidden",
      border: `2px solid ${isHero ? accent : "rgba(255,255,255,.4)"}`,
      boxShadow: isHero ? `0 0 0 2px ${accent}, 0 0 20px ${accent}aa, 0 6px 14px rgba(0,0,0,.5)` : "0 0 0 2px rgba(0,0,0,.55), 0 6px 14px rgba(0,0,0,.5)",
      background: "#23232a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, isHero ? /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar.png",
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 30%"
    }
  }) : p.cat ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 30,
      lineHeight: 1
    }
  }, "\uD83D\uDC31") : /*#__PURE__*/React.createElement("svg", {
    width: "28",
    height: "28",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.5)",
    strokeWidth: "1.8"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8.5",
    r: "3.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 20c0-4 3.2-6 7-6s7 2 7 6",
    strokeLinecap: "round"
  }))), isHero && /*#__PURE__*/React.createElement(window.LegendFrameOverlay, null), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -3,
      bottom: -5,
      zIndex: 5,
      minWidth: 18,
      height: 16,
      padding: "0 3px",
      borderRadius: 4,
      background: "#2f6fd0",
      border: "1.5px solid #0c0c0e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#fff",
      lineHeight: 1
    }
  }, p.vpip), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -4,
      bottom: -4,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement(TbFlag, {
    colors: p.flag
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 9,
      borderRadius: 8,
      background: "rgba(8,8,10,.92)",
      border: `1px solid ${isHero ? accent : "rgba(255,255,255,.2)"}`,
      padding: tilt ? "7px 13px 8px" : "6px 13px 7px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      lineHeight: tilt ? 1.42 : 1.22,
      minWidth: 70,
      boxShadow: "0 3px 8px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: tilt ? 13.5 : 11.5,
      color: "#fff",
      letterSpacing: ".01em",
      whiteSpace: "nowrap"
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: tilt ? 13 : 11,
      color: "#f0c75e"
    }
  }, p.bal), p.dealer && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -9,
      right: -9,
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "radial-gradient(circle at 36% 30%, #ffffff, #e3cd86 62%, #b3923f)",
      color: "#3a2a07",
      border: "1.5px solid #0c0c0e",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 12,
      boxShadow: "0 3px 8px rgba(0,0,0,.6), inset 0 1px 1px rgba(255,255,255,.7)",
      zIndex: 6
    }
  }, "D")), p.chip > 0 && /*#__PURE__*/React.createElement("span", {
    key: "c" + p.actKey,
    style: {
      position: "absolute",
      top: "104%",
      left: "50%",
      transform: "translateX(-50%)",
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "1px 7px 1px 4px",
      borderRadius: 125,
      background: "rgba(0,0,0,.7)",
      border: "1px solid #f0c75e55",
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#f0c75e",
      whiteSpace: "nowrap",
      zIndex: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: "radial-gradient(circle at 35% 30%, #ffe9a8, #f0c75e 70%)",
      border: "1px solid rgba(0,0,0,.4)"
    }
  }), p.chip));
}
const TB_TABLES = [{
  name: "TABLE 12",
  max: 6,
  taken: 5,
  vpip: 30,
  dbl: false,
  bomb: "7",
  avg: "$48"
}, {
  name: "TABLE 28",
  max: 9,
  taken: 3,
  vpip: null,
  dbl: true,
  bomb: "5",
  avg: "$112"
}, {
  name: "TABLE 41",
  max: 6,
  taken: 6,
  vpip: 40,
  dbl: false,
  bomb: null,
  avg: "$36"
}, {
  name: "TABLE 53",
  max: 9,
  taken: 2,
  vpip: null,
  dbl: false,
  bomb: null,
  avg: "$22"
}, {
  name: "TABLE 66",
  max: 6,
  taken: 4,
  vpip: null,
  dbl: true,
  bomb: "7",
  avg: "$95"
}, {
  name: "TABLE 74",
  max: 9,
  taken: 5,
  vpip: 30,
  dbl: false,
  bomb: "5",
  avg: "$61"
}];

// extra cash buy-in tiers shown as collapsed groups below the selected one
const TB_MORE_GROUPS = [{
  stake: "0.25/0.50",
  buyIn: 50,
  tables: [{
    name: "TABLE 09",
    max: 6,
    taken: 4,
    vpip: 35,
    dbl: false,
    bomb: "7",
    avg: "$240"
  }, {
    name: "TABLE 17",
    max: 9,
    taken: 7,
    vpip: null,
    dbl: true,
    bomb: null,
    avg: "$390"
  }, {
    name: "TABLE 33",
    max: 6,
    taken: 6,
    vpip: 40,
    dbl: false,
    bomb: "5",
    avg: "$180"
  }, {
    name: "TABLE 88",
    max: 9,
    taken: 2,
    vpip: null,
    dbl: false,
    bomb: null,
    avg: "$120"
  }]
}, {
  stake: "1/2",
  buyIn: 200,
  tables: [{
    name: "TABLE 02",
    max: 6,
    taken: 3,
    vpip: null,
    dbl: true,
    bomb: "7",
    avg: "$1.1k"
  }, {
    name: "TABLE 21",
    max: 9,
    taken: 8,
    vpip: 30,
    dbl: false,
    bomb: "5",
    avg: "$2.4k"
  }, {
    name: "TABLE 50",
    max: 6,
    taken: 6,
    vpip: 50,
    dbl: false,
    bomb: null,
    avg: "$760"
  }]
}, {
  stake: "5/10",
  buyIn: 1000,
  tables: [{
    name: "TABLE 01",
    max: 6,
    taken: 5,
    vpip: null,
    dbl: true,
    bomb: null,
    avg: "$8.2k"
  }, {
    name: "TABLE 07",
    max: 6,
    taken: 2,
    vpip: 40,
    dbl: false,
    bomb: "7",
    avg: "$5.5k"
  }]
}];
function TbListTag({
  children,
  tone,
  accent
}) {
  const map = {
    vip: {
      bg: `${accent}1a`,
      bd: `${accent}45`,
      fg: accent
    },
    board: {
      bg: "rgba(124,160,255,.12)",
      bd: "rgba(124,160,255,.4)",
      fg: "#9CB6FF"
    },
    bomb: {
      bg: "rgba(255,138,60,.13)",
      bd: "rgba(255,138,60,.42)",
      fg: "#FF9E5C"
    },
    mute: {
      bg: "rgba(255,255,255,.075)",
      bd: "rgba(255,255,255,.18)",
      fg: "rgba(255,255,255,.6)"
    }
  }[tone] || {};
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: map.fg,
      padding: "3px 7px",
      borderRadius: 5,
      background: map.bg,
      border: `1px solid ${map.bd}`,
      whiteSpace: "nowrap"
    }
  }, children);
}
function TbListRow({
  t,
  accent,
  onSit,
  grouped = false,
  last = false
}) {
  const full = t.taken >= t.max;
  const tags = [];
  if (t.vpip) tags.push({
    tone: "vip",
    label: `VPIP ${t.vpip}+`
  });
  if (t.dbl) tags.push({
    tone: "board",
    label: "DOUBLE BOARD"
  });
  if (t.bomb) tags.push({
    tone: "bomb",
    label: `BOMB-POT EVERY ${t.bomb}`
  });
  const groupedStyle = {
    borderRadius: 0,
    border: 0,
    borderBottom: last ? 0 : "1px solid rgba(255,255,255,.07)",
    background: full ? "rgba(255,255,255,.015)" : "transparent"
  };
  const cardStyle = {
    borderRadius: 16,
    border: `1px solid ${full ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.1)"}`,
    background: "linear-gradient(155deg,#141418,#0a0a0c)"
  };
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (full) return;
      if (window.playClick) window.playClick(1200, 0.04);
      onSit(t);
    },
    onMouseDown: e => {
      if (!full) e.currentTarget.style.transform = "scale(.99)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      textAlign: "left",
      cursor: full ? "default" : "pointer",
      padding: 14,
      opacity: full ? 0.55 : 1,
      transition: "transform .1s",
      display: "flex",
      flexDirection: "column",
      gap: 11,
      ...(grouped ? groupedStyle : cardStyle)
    }
  }, !grouped && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(circle at 96% 4%, ${accent}12, transparent 52%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, t.name), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 11,
      color: full ? "rgba(255,255,255,.4)" : accent,
      letterSpacing: ".08em"
    }
  }, full ? "FULL" : "SIT ›")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4
    }
  }, Array.from({
    length: t.max
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: 9,
      height: 9,
      borderRadius: 3,
      background: i < t.taken ? full ? accent : "#fff" : "rgba(255,255,255,.18)"
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".04em"
    }
  }, t.taken, "/", t.max)), tags.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      flexWrap: "wrap",
      gap: 6
    }
  }, tags.map((g, i) => /*#__PURE__*/React.createElement(TbListTag, {
    key: i,
    tone: g.tone,
    accent: accent
  }, g.label))));
}

// ── one cash buy-in group: header tap → collapse/expand its tables. The
// header is visually fused to the table rows (single rounded shell + dividers).
function TbTableGroup({
  discipline,
  stake,
  buyIn,
  tables,
  accent,
  onSit,
  defaultOpen = false
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  const openCount = tables.filter(t => t.taken < t.max).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 16,
      overflow: "hidden",
      border: `1px solid ${open ? accent + "3a" : "rgba(255,255,255,.1)"}`,
      background: "#0b0b0d",
      transition: "border-color .2s"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.04);
      setOpen(o => !o);
    },
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "13px 14px",
      cursor: "pointer",
      textAlign: "left",
      background: open ? `${accent}16` : `${accent}0b`,
      border: 0,
      borderBottom: open ? `1px solid ${accent}2e` : "0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".02em",
      whiteSpace: "nowrap",
      flex: "none"
    }
  }, discipline, " \xB7 ", stake), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".06em",
      color: open ? accent : "rgba(255,255,255,.5)",
      padding: "2px 6px",
      borderRadius: 5,
      background: open ? `${accent}1c` : "rgba(255,255,255,.085)",
      border: `1px solid ${open ? accent + "55" : "rgba(255,255,255,.16)"}`,
      flex: "none",
      whiteSpace: "nowrap"
    }
  }, openCount, " OPEN"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      display: "flex",
      alignItems: "center",
      gap: 8,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em",
      whiteSpace: "nowrap"
    }
  }, "BUY-IN $", buyIn.toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: open ? accent : "rgba(255,255,255,.55)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform .2s"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })))), open && tables.map((t, i) => /*#__PURE__*/React.createElement(TbListRow, {
    key: t.name,
    t: t,
    accent: accent,
    onSit: onSit,
    grouped: true,
    last: i === tables.length - 1
  })));
}
function TableListScreen({
  open,
  onClose,
  onSit,
  accent = "#D71921",
  discipline = "HOLD'EM",
  stakes = "5/10",
  buyIn = 0
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 110,
      background: "#0a0a0c",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}22, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.045) 0.6px, transparent 1px)",
      backgroundSize: "11px 11px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 16,
      paddingBottom: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.04);
      onClose();
    },
    style: {
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
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "SELECT TABLE"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "12px 16px 40px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(TbTableGroup, {
    discipline: discipline,
    stake: stakes,
    buyIn: buyIn,
    tables: TB_TABLES,
    accent: accent,
    onSit: onSit,
    defaultOpen: true
  }), TB_MORE_GROUPS.map(g => /*#__PURE__*/React.createElement(TbTableGroup, {
    key: g.stake,
    discipline: discipline,
    stake: g.stake,
    buyIn: g.buyIn,
    tables: g.tables,
    accent: accent,
    onSit: onSit
  })))));
}

// ── Hand History overlay — opens from the gear menu. Drag down to minimize to a
// bottom bar; tap/drag the bar back up to re-open. X closes it fully.
function TbHistory({
  open,
  onClose,
  accent,
  discipline,
  stakes
}) {
  const [min, setMin] = React.useState(false);
  const [dy, setDy] = React.useState(0);
  React.useEffect(() => {
    if (open) {
      setMin(false);
      setDy(0);
    }
  }, [open]);
  if (!open) return null;
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, 0.04);
  };
  // drag the sheet down → minimize
  const startDrag = e => {
    e.preventDefault();
    const sy = e.touches ? e.touches[0].clientY : e.clientY;
    const move = ev => {
      const y = (ev.touches ? ev.touches[0].clientY : ev.clientY) - sy;
      setDy(Math.max(0, y));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setDy(cur => {
        if (cur > 110) {
          click(700);
          setMin(true);
        }
        return 0;
      });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  // drag the minimized bar up → re-open
  const startReopen = e => {
    e.preventDefault();
    const sy = e.touches ? e.touches[0].clientY : e.clientY;
    let moved = 0;
    const move = ev => {
      moved = (ev.touches ? ev.touches[0].clientY : ev.clientY) - sy;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (moved < -24) {
        click(900);
        setMin(false);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const back = /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flex: "none"
    }
  }, [0, 1].map(i => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginLeft: i ? -9 : 0,
      width: 28,
      height: 39,
      borderRadius: 4,
      background: "repeating-linear-gradient(45deg,#3a3a42 0 3px,#2a2a30 3px 6px)",
      border: "1px solid rgba(0,0,0,.5)"
    }
  })));
  const HANDS = [{
    who: "bubaUA21",
    cards: [{
      r: "3",
      s: "heart"
    }, {
      r: "3",
      s: "spade"
    }],
    amt: "+80.80"
  }, {
    who: "Chinin1",
    amt: "+2.50"
  }, {
    who: "bubaUA21",
    amt: "+3.50"
  }, {
    who: "SASHA02",
    cards: [{
      r: "K",
      s: "club"
    }, {
      r: "K",
      s: "heart"
    }],
    amt: "+34.00",
    you: true
  }, {
    who: "TomasR",
    amt: "+2.00"
  }, {
    who: "vittopio",
    cards: [{
      r: "A",
      s: "spade"
    }, {
      r: "A",
      s: "diamond"
    }],
    amt: "+120.00"
  }];
  const cap = {
    fontFamily: SANS_TB,
    fontWeight: 700,
    fontSize: 10.5,
    letterSpacing: ".2em",
    color: "#A9A9B2",
    margin: "0 0 9px"
  };
  const card = {
    background: "rgba(255,255,255,.065)",
    border: "1px solid rgba(255,255,255,.13)",
    borderRadius: 12,
    padding: "12px 14px"
  };
  const infoRow = (k, v, c) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "4px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 12,
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 12,
      color: c || "#fff"
    }
  }, v));

  // ── minimized bar at the bottom ──
  if (min) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 130
      }
    }, /*#__PURE__*/React.createElement("style", null, "@keyframes tbh-barup{from{transform:translateY(100%)}to{transform:translateY(0)}}"), /*#__PURE__*/React.createElement("div", {
      onClick: () => {
        click(900);
        setMin(false);
      },
      onPointerDown: startReopen,
      style: {
        cursor: "pointer",
        touchAction: "none",
        background: "#16161a",
        borderRadius: "18px 18px 0 0",
        borderTop: `1px solid ${accent}55`,
        boxShadow: "0 -6px 22px rgba(0,0,0,.5)",
        padding: "8px 16px 14px",
        animation: "tbh-barup .3s cubic-bezier(.2,.8,.2,1) both"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 42,
        height: 4,
        borderRadius: 125,
        background: "rgba(255,255,255,.28)",
        margin: "0 auto 8px"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 28,
        height: 28,
        borderRadius: 12,
        background: `${accent}22`,
        border: `1px solid ${accent}55`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.9",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 3v5h5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3.05 13A9 9 0 1 0 6 5.3L3 8"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 7v5l3 1.8"
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 13,
        color: "#fff"
      }
    }, "Hand history"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: "#A9A9B2"
      }
    }, "PULL UP"), /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "rgba(255,255,255,.6)",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 15l-6-6-6 6"
    })))));
  }

  // ── full sheet ──
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 130,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("style", null, "@keyframes tbh-up{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes tbh-fade{from{opacity:0}to{opacity:1}}"), /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,.62)",
      backdropFilter: "blur(2px)",
      animation: "tbh-fade .25s ease both",
      opacity: Math.max(0.2, 1 - dy / 300)
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxHeight: "86%",
      display: "flex",
      flexDirection: "column",
      background: "#101013",
      borderRadius: "22px 22px 0 0",
      boxShadow: "0 -6px 30px rgba(0,0,0,.6)",
      transform: `translateY(${dy}px)`,
      transition: dy === 0 ? "transform .3s cubic-bezier(.2,.8,.2,1)" : "none",
      animation: dy === 0 ? "tbh-up .34s cubic-bezier(.2,.8,.2,1) both" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onPointerDown: startDrag,
    style: {
      flex: "none",
      padding: "10px 0 4px",
      cursor: "grab",
      touchAction: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 42,
      height: 4,
      borderRadius: 125,
      background: "rgba(255,255,255,.22)",
      margin: "0 auto"
    }
  })), /*#__PURE__*/React.createElement("div", {
    onPointerDown: startDrag,
    style: {
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "6px 18px 12px",
      cursor: "grab",
      touchAction: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 18,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, "Hand history"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: "rgba(255,255,255,.13)",
      border: "1px solid rgba(255,255,255,.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "0 16px 26px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: cap
  }, "MY SESSION"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...card,
      marginBottom: 18
    }
  }, infoRow("Buy-in", "$10"), infoRow("Profit / loss", "+$190", "#5BD96A"), infoRow("Table VPIP", "31%", accent)), /*#__PURE__*/React.createElement("div", {
    style: cap
  }, "WINNERS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, HANDS.map((h, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 14px",
      borderRadius: 12,
      background: h.you ? `${accent}12` : "rgba(255,255,255,.065)",
      border: `1px solid ${h.you ? accent + "44" : "rgba(255,255,255,.13)"}`,
      cursor: "pointer",
      textAlign: "left",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      color: h.you ? "#fff" : "rgba(255,255,255,.9)",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, h.who), h.cards ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      flex: "none"
    }
  }, h.cards.map((c, j) => /*#__PURE__*/React.createElement(TbCard, {
    key: j,
    r: c.r,
    s: c.s,
    w: 32
  }))) : back, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 13,
      color: "#5BD96A",
      flex: "none",
      minWidth: 58,
      textAlign: "right"
    }
  }, h.amt), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.3)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))))))));
}

// ── VPIP-restriction scenario — fires when the hero plays too tight for the
// table's minimum VPIP. Three escalating steps (warn → final → removed), ClubGG
// style, reimagined for our dark DS. Renders centred over the felt.
function TbVpipMeter({
  vpip,
  req,
  tone
}) {
  const SCALE = 50; // bar covers 0–50% VPIP
  const fill = Math.min(100, vpip / SCALE * 100);
  const reqAt = Math.min(100, req / SCALE * 100);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 12,
      borderRadius: 125,
      background: "rgba(255,255,255,.14)",
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${fill}%`,
      borderRadius: 125,
      background: tone,
      boxShadow: `0 0 10px ${tone}88`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${reqAt}%`,
      top: -3,
      bottom: -3,
      width: 2.5,
      background: "#fff",
      borderRadius: 2,
      transform: "translateX(-50%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${reqAt}%`,
      top: -16,
      transform: "translateX(-50%)",
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      whiteSpace: "nowrap"
    }
  }, "MIN ", req, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#A9A9B2"
    }
  }, "YOUR VPIP"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 13,
      color: tone
    }
  }, vpip, "%")));
}
function TbVpipOverlay({
  step,
  accent,
  onClose,
  onLeave
}) {
  const GOLD = "#f0c75e";
  const cfg = {
    1: {
      tone: GOLD,
      vpip: 14,
      req: 30,
      kicker: "TABLE RULE · VPIP 30+",
      title: "PLAY MORE HANDS",
      body: "You're playing too tight for this table. Loosen up and get involved to keep your seat.",
      foot: "8 hands to comply",
      cta: "GOT IT",
      blocking: false,
      ico: "warn"
    },
    2: {
      tone: accent,
      vpip: 12,
      req: 30,
      kicker: "FINAL WARNING",
      title: "VPIP TOO LOW",
      body: "Still below the minimum. Play a hand within the next 3 or you'll be removed from the table.",
      foot: "3 hands left",
      cta: "GOT IT",
      blocking: false,
      ico: "warn"
    },
    3: {
      tone: accent,
      vpip: 12,
      req: 30,
      kicker: "RESTRICTED",
      title: "REMOVED FROM TABLE",
      body: "Your VPIP stayed below the 30% minimum. You've been removed and can't rejoin this table for a while.",
      foot: "Locked · 29:41",
      cta: "BACK TO LOBBY",
      blocking: true,
      ico: "ban"
    }
  }[step];
  if (!cfg) return null;
  const icon = cfg.ico === "ban" ? /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: cfg.tone,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.6 5.6l12.8 12.8"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: cfg.tone,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l9.5 16.5H2.5L12 3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 10v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 17.5v.2"
  }));
  return /*#__PURE__*/React.createElement("div", {
    onClick: cfg.blocking ? undefined : onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 75,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 18,
      background: "rgba(0,0,0,.66)",
      backdropFilter: "blur(2px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 300,
      background: "rgba(18,18,22,.99)",
      border: `1px solid ${cfg.tone}55`,
      borderRadius: 20,
      boxShadow: `0 24px 60px rgba(0,0,0,.7), 0 0 0 1px ${cfg.tone}22`,
      padding: "22px 20px 20px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: 20,
      margin: "0 auto 14px",
      background: `${cfg.tone}1c`,
      border: `1px solid ${cfg.tone}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".22em",
      color: cfg.tone,
      marginBottom: 7
    }
  }, cfg.kicker), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 20,
      color: "#fff",
      marginBottom: 9,
      letterSpacing: ".01em"
    }
  }, cfg.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 12,
      color: "#A9A9B2",
      lineHeight: 1.45,
      marginBottom: 18
    }
  }, cfg.body), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(0,0,0,.4)",
      border: "1px solid rgba(255,255,255,.13)",
      borderRadius: 14,
      padding: "16px 14px 13px",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(TbVpipMeter, {
    vpip: cfg.vpip,
    req: cfg.req,
    tone: cfg.tone
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: cfg.tone,
      boxShadow: `0 0 7px ${cfg.tone}`,
      animation: "pp-pulse 1.2s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, cfg.foot)), /*#__PURE__*/React.createElement("button", {
    onClick: cfg.blocking ? onLeave : onClose,
    style: {
      width: "100%",
      height: 46,
      borderRadius: 125,
      border: 0,
      background: cfg.tone,
      color: cfg.tone === GOLD ? "#241c00" : "#fff",
      cursor: "pointer",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".04em",
      boxShadow: `0 6px 16px ${cfg.tone}55`
    }
  }, cfg.cta)));
}

// ── Call Time — anti hit-and-run lock, measured in HANDS (not time). After
// winning, the player must stay for N more hands before they can leave/sit out.
// Shown PERSISTENTLY on the table (not a popup): a slim badge with hands left.
function TbCallTimeBadge({
  hands
}) {
  const GOLD = "#f0c75e";
  const lock = /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: GOLD,
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "11",
    width: "16",
    height: "10",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11V8a4 4 0 0 1 8 0v3"
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 12px 5px 10px",
      borderRadius: 125,
      background: "rgba(10,10,12,.92)",
      border: `1px solid ${GOLD}66`,
      boxShadow: `0 2px 10px rgba(0,0,0,.5), 0 0 12px ${GOLD}2e`
    }
  }, lock, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: GOLD
    }
  }, "CALL TIME"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 11,
      background: "rgba(255,255,255,.18)",
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, hands), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, hands === 1 ? "HAND LEFT" : "HANDS LEFT")));
}

// ── player profile — tap an opponent: colour tag + note + table stats. The
// chosen colour tints that player's seat plate. Reimagined for our dark DS.
const TB_TAGS = [{
  c: "#D71921",
  n: "Fish"
}, {
  c: "#ff8a3c",
  n: "Aggro"
}, {
  c: "#f0c75e",
  n: "Reg"
}, {
  c: "#5BD96A",
  n: "Nit"
}, {
  c: "#4fd1c5",
  n: "Caller"
}, {
  c: "#4f9cf0",
  n: "Solid"
}, {
  c: "#a87cf0",
  n: "Wild"
}, {
  c: "#f07cae",
  n: "Tilt"
}];
function TbPlayerProfile({
  p,
  accent,
  tag,
  onClose,
  onSave
}) {
  const [color, setColor] = React.useState(tag ? tag.color : null);
  const [note, setNote] = React.useState(tag ? tag.note || "" : "");
  const Suit = window.Suit;
  const id = "7797-" + String(1000 + p.name.length * 137 % 9000);
  const h = 12 + p.name.length * 7 % 60;
  const pfr = Math.max(4, Math.round(p.vpip * 0.42));
  const win = 18 + p.name.length * 5 % 36;
  const stats = [["HANDS", String(h)], ["VPIP", p.vpip + "%"], ["PFR", pfr + "%"], ["WIN", win + "%"]];
  const tagName = color ? (TB_TAGS.find(t => t.c === color) || {}).n : null;
  const avatarInner = p.av ? /*#__PURE__*/React.createElement("img", {
    src: (window.CHAT_AV || {})[p.av] || `assets/chat/${p.av}.webp`,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover"
    }
  }) : /*#__PURE__*/React.createElement("svg", {
    width: "44",
    height: "44",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.5)",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8.5",
    r: "3.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 20c0-4 3.2-6 7-6s7 2 7 6",
    strokeLinecap: "round"
  }));
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 70,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
      background: "rgba(0,0,0,.66)",
      backdropFilter: "blur(2px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 336,
      maxHeight: "88%",
      overflowY: "auto",
      background: "rgba(18,18,22,.99)",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 20,
      boxShadow: "0 24px 60px rgba(0,0,0,.7)",
      padding: "16px 16px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 26
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".18em",
      color: "#fff"
    }
  }, "PROFILE"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 26,
      height: 26,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.7)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      padding: "8px 0 14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 74,
      height: 74,
      borderRadius: "50%",
      overflow: "hidden",
      background: "#23232a",
      border: `2.5px solid ${color || "rgba(255,255,255,.4)"}`,
      boxShadow: color ? `0 0 18px ${color}88` : "0 6px 16px rgba(0,0,0,.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "border-color .2s, box-shadow .2s"
    }
  }, avatarInner), isHero && /*#__PURE__*/React.createElement(window.LegendFrameOverlay, null), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -6,
      bottom: -2
    }
  }, /*#__PURE__*/React.createElement(TbFlag, {
    colors: p.flag
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      lineHeight: 1.2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 18,
      color: "#fff"
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 500,
      fontSize: 11,
      color: "#8A8A93"
    }
  }, "ID ", id))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2",
      marginBottom: 9
    }
  }, "COLOUR TAG ", tagName && /*#__PURE__*/React.createElement("span", {
    style: {
      color
    }
  }, "\xB7 ", tagName.toUpperCase())), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      gap: 9,
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setColor(null),
    title: "No tag",
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      cursor: "pointer",
      background: "rgba(255,255,255,.075)",
      border: color === null ? "2px solid #fff" : "1.5px solid rgba(255,255,255,.25)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.55)",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 5l14 14"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }))), TB_TAGS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.c,
    onClick: () => setColor(t.c),
    title: t.n,
    style: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      cursor: "pointer",
      background: t.c,
      border: color === t.c ? "2px solid #fff" : "2px solid transparent",
      boxShadow: color === t.c ? `0 0 12px ${t.c}aa` : "0 2px 6px rgba(0,0,0,.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, color === t.c && /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, "NOTE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 500,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, note.length, "/1000")), /*#__PURE__*/React.createElement("textarea", {
    value: note,
    onChange: e => setNote(e.target.value.slice(0, 1000)),
    placeholder: "Add a private note on this player\u2026",
    rows: 3,
    style: {
      width: "100%",
      boxSizing: "border-box",
      resize: "none",
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.16)",
      borderRadius: 12,
      padding: "10px 12px",
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 12,
      color: "#fff",
      outline: "none",
      marginBottom: 16
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2",
      marginBottom: 9
    }
  }, "TABLE STATS \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5BD96A"
    }
  }, "NLH")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: 1,
      background: "rgba(255,255,255,.13)",
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 16
    }
  }, stats.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      background: "rgba(20,20,24,.96)",
      padding: "11px 4px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff"
    }
  }, v)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1400);
      onSave(p.name, color ? {
        color,
        note
      } : note ? {
        color: null,
        note
      } : null);
      onClose();
    },
    style: {
      width: "100%",
      height: 46,
      borderRadius: 125,
      border: 0,
      background: accent,
      color: "#fff",
      cursor: "pointer",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".04em",
      boxShadow: `0 6px 16px ${accent}55`
    }
  }, "SAVE")));
}

// ── the felt ──
function PokerTableScreen({
  open,
  table,
  onClose,
  onBack,
  accent = "#D71921",
  discipline = "HOLD'EM",
  stakes = "5/10",
  buyIn = 2000,
  autoSeat = false,
  variant = "panel",
  tilt = false,
  seatStyle = "default",
  chatPos = "bottom-left",
  pillMenuStyle = 3,
  demoPillMenu = false,
  demoWaiting = false,
  demoProfile = false,
  demoTagged = false,
  vpipStep = 0,
  callHands = 0,
  queue = false,
  queuePos = 1
}) {
  const [mounted, setMounted] = React.useState(false);
  const [seated, setSeated] = React.useState(null);
  const [pending, setPending] = React.useState(null);
  const [seatBuyIn, setSeatBuyIn] = React.useState(buyIn);
  const [hand, setHand] = React.useState(null);
  const [combos, setCombos] = React.useState(false);
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const [raiseOpen, setRaiseOpen] = React.useState(false);
  const [reaction, setReaction] = React.useState(null);
  const [foldY, setFoldY] = React.useState(0);
  const [folded, setFolded] = React.useState(false);
  const [statsOpen, setStatsOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [bbDisplay, setBbDisplay] = React.useState(true);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [leaveOpen, setLeaveOpen] = React.useState(false);
  const [chatX, setChatX] = React.useState(0); // chat drawer offset (0 = closed, 1 = open)
  const [chatOpen, setChatOpen] = React.useState(false);
  // ── multitabling: up to 4 open tables shown as hand-pill tabs in the top bar ──
  const [tabIdx, setTabIdx] = React.useState(0);
  const [pillMenu, setPillMenu] = React.useState(false); // active-tab dropdown open?
  const [sitOut, setSitOut] = React.useState(false);
  // ── no cards yet: just sat down, waiting to be dealt in (wait for BB vs post now) ──
  const [waiting, setWaiting] = React.useState(false);
  const [waitBlind, setWaitBlind] = React.useState(true);
  // ── opponent profile: colour tag + note per player; tints the seat plate ──
  const [profileFor, setProfileFor] = React.useState(null);
  const [playerTags, setPlayerTags] = React.useState({});
  const [vpipWarn, setVpipWarn] = React.useState(0); // 0 none · 1 warn · 2 final · 3 removed
  React.useEffect(() => {
    setVpipWarn(vpipStep);
  }, [vpipStep]);
  const [callLeft, setCallLeft] = React.useState(0); // call-time hands remaining (0 = off)
  React.useEffect(() => {
    setCallLeft(callHands);
  }, [callHands]);
  React.useEffect(() => {
    if (demoWaiting) setWaiting(true);
  }, [demoWaiting]);
  React.useEffect(() => {
    if (demoProfile) {
      setPlayerTags({
        vittopio: {
          color: "#4f9cf0",
          note: "3-bets light from the blinds"
        }
      });
      setProfileFor({
        name: "vittopio",
        vpip: 18,
        flag: ["#0057b7", "#ffd700"],
        av: "sponge"
      });
    } else if (demoTagged) {
      setPlayerTags({
        vittopio: {
          color: "#4f9cf0",
          note: "3-bets light"
        },
        FtManonn: {
          color: "#5BD96A",
          note: ""
        },
        Lexpert: {
          color: "#D71921",
          note: ""
        }
      });
    }
  }, [demoProfile, demoTagged]);
  React.useEffect(() => {
    if (demoPillMenu) setPillMenu(true);
  }, [demoPillMenu]);
  const sit = useSitCountdown(sitOut);
  const sitCol = sitColor(sit.pct, sit.urgent);
  const [tabs, setTabs] = React.useState([[{
    r: "5",
    s: "spade"
  }, {
    r: "K",
    s: "heart"
  }], [{
    r: "9",
    s: "heart"
  }, {
    r: "9",
    s: "diamond"
  }], [{
    r: "A",
    s: "spade"
  }, {
    r: "Q",
    s: "club"
  }]]);
  // preload reaction emojis so the picker shows them instantly
  React.useEffect(() => {
    ["hey", "clap", "laugh", "wow", "angry", "celebrate"].forEach(n => {
      const im = new Image();
      im.src = (window.REACT_IMG || {})[n] || `assets/reactions/${n}.webp`;
    });
  }, []);
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    setFolded(false);
    setFoldY(0);
    if (autoSeat) {
      setSeated(2);
      setSeatBuyIn(buyIn);
      setPending(null);
      setHand(demoWaiting ? null : dealHoleCards());
    } else {
      setSeated(null);
      setPending(null);
      setHand(null);
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, 0.04);
  };
  // swipe the hero hand up to fold
  const startFoldDrag = e => {
    if (folded) return;
    e.preventDefault();
    const sy = e.touches ? e.touches[0].clientY : e.clientY;
    const move = ev => {
      const y = ev.touches ? ev.touches[0].clientY : ev.clientY;
      setFoldY(Math.min(0, y - sy));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      setFoldY(cur => {
        if (cur < -46) {
          click(650);
          setTimeout(() => setFolded(true), 260);
          return -280;
        }
        return 0;
      });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  // swipe the hero info panel up to flip to "my table stats" (tap toggles too)
  const startStatsDrag = e => {
    e.preventDefault();
    const sy = e.touches ? e.touches[0].clientY : e.clientY;
    let dy = 0;
    const move = ev => {
      dy = (ev.touches ? ev.touches[0].clientY : ev.clientY) - sy;
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      if (dy < -16) {
        click(680);
        setStatsOpen(true);
      } else if (dy > 16) {
        click(900);
        setStatsOpen(false);
      } else {
        click(1000);
        setStatsOpen(o => !o);
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  // drag the right-edge tab leftward to open the chat drawer
  const startChatDrag = e => {
    e.preventDefault();
    const W = 300;
    const sx = e.touches ? e.touches[0].clientX : e.clientX;
    const base = chatOpen ? 1 : 0;
    let frac = base;
    const move = ev => {
      const x = ev.touches ? ev.touches[0].clientX : ev.clientX;
      frac = Math.max(0, Math.min(1, base + (sx - x) / W));
      setChatX(frac);
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      const opn = frac > 0.4;
      setChatOpen(opn);
      setChatX(opn ? 1 : 0);
      click(opn ? 1300 : 800);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const SEATS6 = [{
    x: 50,
    y: 4
  }, {
    x: 7,
    y: 24
  }, {
    x: 93,
    y: 24
  }, {
    x: 7,
    y: 70
  }, {
    x: 93,
    y: 70
  }, {
    x: 50,
    y: 92
  }];
  const SEATS9 = [{
    x: 50,
    y: 3
  }, {
    x: 18,
    y: 9
  }, {
    x: 82,
    y: 9
  }, {
    x: 4,
    y: 33
  }, {
    x: 96,
    y: 33
  }, {
    x: 6,
    y: 64
  }, {
    x: 94,
    y: 64
  }, {
    x: 31,
    y: 92
  }, {
    x: 69,
    y: 92
  }];
  const SEATS = table && table.max === 9 ? SEATS9 : SEATS6;

  // in-hand scene data: community board + the six seated players (hero at bottom)
  const BOARD = [{
    r: "A",
    s: "spade"
  }, {
    r: "5",
    s: "diamond"
  }, {
    r: "3",
    s: "diamond"
  }];
  // variant B hides the hero seat and overlays controls on the lower felt, so
  // opponents are pulled into the upper area to never sit under the controls.
  const threeMax = !!(table && table.max === 3);
  const nineMax = !!(table && table.max === 9);
  const SEAT_POS = variant === "panel" ? threeMax ? [{
    x: 15,
    y: 20
  }, {
    x: 85,
    y: 20
  }] : nineMax ? [{
    x: 50,
    y: 4
  }, {
    x: 20,
    y: 8
  }, {
    x: 80,
    y: 8
  }, {
    x: 7,
    y: 25
  }, {
    x: 93,
    y: 25
  }, {
    x: 8,
    y: 48
  }, {
    x: 92,
    y: 48
  }, {
    x: 28,
    y: 62
  }, {
    x: 72,
    y: 62
  }] : [{
    x: 50,
    y: 5
  }, {
    x: 9,
    y: 23
  }, {
    x: 91,
    y: 23
  }, {
    x: 9,
    y: 47
  }, {
    x: 91,
    y: 47
  }, {
    x: 50,
    y: 92
  }] : SEATS6;
  // villain stacks and pot scale with the stake in play (bb parsed from "stakes")
  const tbBB = (() => {
    const parts = String(stakes || "").replace(/[^0-9.\/ ]/g, "").split("/");
    const raw = (parts[1] || parts[0] || "").replace(/ /g, "");
    const v = parseFloat(raw);
    return v > 0 ? v : 10;
  })();
  const tbMoney = v => "$" + (v >= 1000 ? Math.round(v).toLocaleString("en-US").split(",").join(" ") : v < 10 ? v.toFixed(2) : Math.round(v).toString());
  const tbStack = bbs => tbMoney(bbs * tbBB);
  const PLAYERS = threeMax ? [{
    ...SEAT_POS[0],
    name: "jackiecal",
    vpip: 31,
    flag: ["#0057b7", "#ffd700"],
    bal: "$" + seatBuyIn.toLocaleString("en-US").split(",").join(" "),
    dealer: true
  }, {
    ...SEAT_POS[1],
    name: "ripe_sna",
    vpip: 19,
    flag: ["#ff9933", "#fff", "#138808"],
    bal: "$" + seatBuyIn.toLocaleString("en-US").split(",").join(" "),
    cat: true
  }] : nineMax ? [{
    ...SEAT_POS[0],
    name: "Lexpert",
    vpip: 31,
    flag: ["#fff", "#dc143c"],
    bal: tbStack(86),
    av: "drebin"
  }, {
    ...SEAT_POS[1],
    name: "vittopio",
    vpip: 18,
    flag: ["#0057b7", "#ffd700"],
    bal: tbStack(132),
    av: "sponge"
  }, {
    ...SEAT_POS[2],
    name: "FtManonn",
    vpip: 27,
    flag: ["#ff9933", "#fff", "#138808"],
    bal: tbStack(47),
    says: "nice hand!",
    av: "yanu"
  }, {
    ...SEAT_POS[3],
    name: "carpenter7",
    vpip: 27,
    flag: ["#ff9933", "#fff", "#138808"],
    bal: tbStack(194),
    dealer: true,
    av: "girl"
  }, {
    ...SEAT_POS[4],
    name: "LoloS2",
    vpip: 35,
    flag: ["#fff", "#00966e", "#d62612"],
    bal: tbStack(61),
    av: "drebin"
  }, {
    ...SEAT_POS[5],
    name: "ripe_sna",
    vpip: 19,
    flag: ["#0057b7", "#ffd700"],
    bal: tbStack(73),
    cat: true
  }, {
    ...SEAT_POS[6],
    name: "donk_99",
    vpip: 44,
    flag: ["#fff", "#dc143c"],
    bal: tbStack(38),
    av: "sponge"
  }, {
    ...SEAT_POS[7],
    name: "TheNit",
    vpip: 12,
    flag: ["#0057b7", "#ffd700"],
    bal: tbStack(155),
    av: "girl"
  }, {
    ...SEAT_POS[8],
    name: "SASHA02",
    vpip: 31,
    flag: ["#0057b7", "#ffd700"],
    bal: "$" + seatBuyIn.toLocaleString("en-US").split(",").join(" "),
    you: true,
    equity: "13.13%"
  }] : [{
    ...SEAT_POS[0],
    name: "Lexpert",
    vpip: 31,
    flag: ["#fff", "#dc143c"],
    bal: tbStack(86),
    av: "drebin"
  }, {
    ...SEAT_POS[1],
    name: "vittopio",
    vpip: 18,
    flag: ["#0057b7", "#ffd700"],
    bal: tbStack(132),
    cards: [{
      r: "5",
      s: "heart"
    }, {
      r: "5",
      s: "club"
    }],
    equity: "86.87%",
    av: "sponge"
  }, {
    ...SEAT_POS[2],
    name: "FtManonn",
    vpip: 27,
    flag: ["#ff9933", "#fff", "#138808"],
    bal: tbStack(47),
    says: seatStyle === "pill" ? "nice hand!" : undefined,
    av: "yanu"
  }, {
    ...SEAT_POS[3],
    name: "carpenter7",
    vpip: 27,
    flag: ["#ff9933", "#fff", "#138808"],
    bal: tbStack(194),
    dealer: true,
    av: "girl"
  }, {
    ...SEAT_POS[4],
    name: "LoloS2",
    vpip: 35,
    flag: ["#fff", "#00966e", "#d62612"],
    bal: tbStack(61),
    av: "drebin",
    toAct: true
  }, {
    ...SEAT_POS[5],
    name: "SASHA02",
    vpip: 31,
    flag: ["#0057b7", "#ffd700"],
    bal: "$" + seatBuyIn.toLocaleString("en-US").split(",").join(" "),
    you: true,
    equity: "13.13%"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 120,
      background: "#0c0c0e",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      visibility: historyOpen ? "hidden" : "visible"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "radial-gradient(ellipse 100% 60% at 50% 42%, #1a0d10 0%, #08080a 70%)"
    }
  }), /*#__PURE__*/React.createElement("style", null, "@keyframes pp-react-pop{0%{transform:translateX(-50%) translateY(6px) scale(.2);opacity:0}28%{transform:translateX(-50%) translateY(0) scale(1.45);opacity:1}44%{transform:translateX(-50%) translateY(0) scale(.86)}58%{transform:translateX(-50%) translateY(0) scale(1.14)}70%{transform:translateX(-50%) translateY(0) scale(.97)}80%{transform:translateX(-50%) translateY(0) scale(1)}100%{transform:translateX(-50%) translateY(-30px) scale(1.06);opacity:0}}@keyframes tb-bubble{0%{transform:translateX(-50%) scale(.6);opacity:0}60%{transform:translateX(-50%) scale(1.08)}100%{transform:translateX(-50%) scale(1);opacity:1}}@keyframes tbk-deplete{from{stroke-dashoffset:0}to{stroke-dashoffset:100}}@keyframes tbk-color{0%{stroke:#5BD96A}50%{stroke:#5BD96A}66%{stroke:#f0c75e}78%{stroke:#ff8a3c}88%{stroke:#D71921}100%{stroke:#D71921}}@keyframes tbk-alarm{0%,62%{opacity:0}64%{opacity:1}70%{opacity:.12}76%{opacity:1}82%{opacity:.12}88%{opacity:1}94%{opacity:.12}100%{opacity:1}}@keyframes tbk-blink{0%,100%{opacity:1}50%{opacity:.2}}"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 12,
      paddingRight: 12,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      seated != null ? setLeaveOpen(true) : onBack ? onBack() : onClose();
    },
    style: {
      flex: "none",
      height: 32,
      padding: "0 12px",
      borderRadius: 125,
      background: "rgba(0,0,0,.4)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), seated != null && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "0 1 auto",
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      gap: 6,
      overflow: "visible"
    }
  }, tabs.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "relative",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(HandTab, {
    hand: i === tabIdx ? hand : t,
    active: i === tabIdx,
    accent: accent,
    dim: i === tabIdx && sitOut,
    onClick: () => {
      click(900);
      if (i !== tabIdx) {
        setTabIdx(i);
        setHand(t);
        setPillMenu(false);
      } else {
        setPillMenu(o => !o);
      }
    }
  }), i === tabIdx && pillMenu && /*#__PURE__*/React.createElement(TabMenu, {
    style: pillMenuStyle,
    accent: accent,
    onSitOut: () => {
      click(1100);
      setPillMenu(false);
      setSitOut(true);
    },
    onLeave: () => {
      click(900);
      setPillMenu(false);
      setLeaveOpen(true);
    }
  }))), tabs.length < 4 && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1300);
      const nh = dealHoleCards();
      setTabs(a => [...a, nh]);
      setTabIdx(tabs.length);
      setHand(nh);
    },
    style: {
      flex: "none",
      width: 31,
      height: 31,
      padding: 0,
      borderRadius: 125,
      background: "rgba(255,255,255,.13)",
      border: "1px solid rgba(255,255,255,.28)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
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
    d: "M12 5v14M5 12h14"
  })))), pillMenu && /*#__PURE__*/React.createElement("div", {
    onClick: () => setPillMenu(false),
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 30
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), seated != null && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1100);
      setMenuOpen(o => !o);
    },
    style: {
      width: 32,
      height: 32,
      padding: 0,
      borderRadius: 125,
      background: menuOpen ? `${accent}22` : "rgba(0,0,0,.4)",
      border: `1px solid ${menuOpen ? accent : "rgba(255,255,255,.16)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      boxShadow: menuOpen ? `0 0 12px ${accent}55` : "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
  }))), menuOpen && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: () => setMenuOpen(false),
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 18
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "calc(100% + 8px)",
      right: 0,
      width: 230,
      background: "rgba(16,16,20,.99)",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 16,
      boxShadow: "0 16px 40px rgba(0,0,0,.65)",
      padding: "6px 4px",
      overflow: "hidden",
      zIndex: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -6,
      right: 11,
      width: 12,
      height: 12,
      background: "rgba(16,16,20,.99)",
      borderLeft: "1px solid rgba(255,255,255,.1)",
      borderTop: "1px solid rgba(255,255,255,.1)",
      transform: "rotate(45deg)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: SANS_TB,
      fontWeight: 600,
      fontSize: 13,
      color: "#fff"
    }
  }, "Display in BB"), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      click(1000);
      setBbDisplay(v => !v);
    },
    style: {
      width: 42,
      height: 24,
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: bbDisplay ? accent : "rgba(255,255,255,.16)",
      position: "relative",
      flex: "none",
      padding: 0,
      transition: "background .2s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: bbDisplay ? 20 : 2,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "#fff",
      transition: "left .22s cubic-bezier(.3,1.4,.5,1)",
      boxShadow: "0 1px 3px rgba(0,0,0,.45)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      click(1100);
      setMenuOpen(false);
      setSettingsOpen(true);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "21",
    x2: "4",
    y2: "14"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "4",
    y1: "10",
    x2: "4",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "21",
    x2: "12",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "8",
    x2: "12",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "21",
    x2: "20",
    y2: "16"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "12",
    x2: "20",
    y2: "3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "1",
    y1: "14",
    x2: "7",
    y2: "14"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "8",
    x2: "15",
    y2: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "17",
    y1: "16",
    x2: "23",
    y2: "16"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: SANS_TB,
      fontWeight: 600,
      fontSize: 13,
      color: "#fff"
    }
  }, "General settings"), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.32)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      click(1100);
      setMenuOpen(false);
      setHistoryOpen(true);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 3v5h5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.05 13A9 9 0 1 0 6 5.3L3 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v5l3 1.8"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: SANS_TB,
      fontWeight: 600,
      fontSize: 13,
      color: "#fff"
    }
  }, "Hand history"), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.32)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      click(1100);
      setMenuOpen(false);
      setSitOut(true);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "5",
    width: "4",
    height: "14",
    rx: "1.3"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14",
    y: "5",
    width: "4",
    height: "14",
    rx: "1.3"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: SANS_TB,
      fontWeight: 600,
      fontSize: 13,
      color: "#fff"
    }
  }, "Sit out"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 11,
      color: "#8A8A93"
    }
  }, "5:00")), /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      click(900);
      setMenuOpen(false);
      setLeaveOpen(true);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 12px",
      cursor: "pointer",
      background: `${accent}14`,
      borderTop: `1px solid ${accent}22`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 12,
      background: `${accent}22`,
      border: `1px solid ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#ff5964",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 17l5-5-5-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12H9"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      color: "#ff5964"
    }
  }, "Leave table")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 4,
      textAlign: "center",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".22em"
    }
  }, table ? table.name : "TABLE 12", " \xB7 TABLE FOR ", table ? table.max : 6, table && table.dbl ? " · DOUBLE BOARD" : "", table && table.bomb ? ` · BOMB-POT EVERY ${table.bomb}` : ""), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      zIndex: 2,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "30px 18px 16px",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: "100%",
      aspectRatio: "0.62",
      maxWidth: 352,
      margin: "0 auto",
      borderRadius: 125,
      background: tilt ? "transparent" : "radial-gradient(ellipse 78% 62% at 50% 42%, #8f1c28 0%, #6a1019 50%, #45090f 100%)",
      border: tilt ? "none" : "12px solid #161616",
      boxShadow: tilt ? "none" : "0 30px 70px rgba(0,0,0,.6), inset 0 4px 30px rgba(0,0,0,.5)"
    }
  }, tilt && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: "2% 0",
      borderRadius: 125,
      background: "radial-gradient(ellipse 78% 62% at 50% 42%, #8f1c28 0%, #6a1019 50%, #45090f 100%)",
      border: "12px solid #161616",
      boxShadow: "0 30px 70px rgba(0,0,0,.6), inset 0 4px 30px rgba(0,0,0,.5)",
      transform: "perspective(620px) rotateX(34deg) translateY(-12%)",
      transformOrigin: "center 40%",
      zIndex: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 22,
      borderRadius: 125,
      border: "1px solid rgba(255,255,255,.085)",
      boxShadow: "inset 0 0 40px rgba(0,0,0,.35)"
    }
  })), !tilt && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 22,
      borderRadius: 125,
      border: "1px solid rgba(255,255,255,.085)",
      boxShadow: "inset 0 0 40px rgba(0,0,0,.35)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "26%",
      left: 0,
      right: 0,
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_TB,
      fontSize: 15,
      color: "#A9A9B2",
      letterSpacing: ".06em"
    }
  }, discipline), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_TB,
      fontSize: 12,
      color: "#8A8A93",
      letterSpacing: ".06em",
      marginTop: 3
    }
  }, stakes), seated != null && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "4px 18px",
      borderRadius: 125,
      background: "rgba(0,0,0,.5)",
      border: "1px solid rgba(255,255,255,.16)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em",
      display: "block"
    }
  }, "POT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff"
    }
  }, tbMoney(tbBB * 0.79)))), seated != null && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1200);
      setCombos(true);
    },
    style: {
      position: "absolute",
      left: "50%",
      top: "39%",
      transform: "translate(-50%,-50%)",
      display: "flex",
      gap: 5,
      background: "transparent",
      border: 0,
      padding: 4,
      cursor: "pointer",
      zIndex: 3
    }
  }, BOARD.map((c, i) => /*#__PURE__*/React.createElement(TbCard, {
    key: i,
    r: c.r,
    s: c.s,
    w: 38
  }))), variant === "felt" && seated != null && hand && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "74%",
      transform: "translate(-50%,-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex"
    }
  }, hand.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginLeft: i ? -12 : 0,
      transform: `rotate(${i ? 5 : -5}deg)`
    }
  }, /*#__PURE__*/React.createElement(TbCard, {
    r: c.r,
    s: c.s,
    w: 46
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 6,
      padding: "2px 10px",
      borderRadius: 6,
      background: "rgba(0,0,0,.7)",
      border: "1px solid rgba(255,255,255,.16)",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".14em"
    }
  }, "HIGH CARD")), PLAYERS.filter(p => p.you ? variant !== "panel" && seated != null : true).map((p, i) => /*#__PURE__*/React.createElement(TbSeat, {
    key: i,
    p: p,
    accent: accent,
    tilt: tilt,
    seatStyle: seatStyle,
    tag: playerTags[p.name],
    onOpen: () => {
      click(1000);
      setProfileFor(p);
    }
  })))), seatStyle === "pill" && seated != null && /*#__PURE__*/React.createElement(React.Fragment, null, chatX > 0 && /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      click(800);
      setChatOpen(false);
      setChatX(0);
    },
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 18,
      background: `rgba(0,0,0,${chatX * 0.5})`,
      transition: chatOpen || chatX === 0 ? "background .3s" : "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      width: 300,
      maxWidth: "84%",
      zIndex: 20,
      transform: `translateX(${(1 - chatX) * 100}%)`,
      transition: chatOpen && chatX === 1 || chatX === 0 ? "transform .32s cubic-bezier(.2,.8,.2,1)" : "none",
      background: "rgba(14,14,17,.99)",
      borderLeft: `1px solid ${accent}`,
      boxShadow: "-12px 0 40px rgba(0,0,0,.6)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      if (chatX === 0 || !chatOpen) {
        click(1300);
        setChatOpen(true);
        setChatX(1);
      }
    },
    onPointerDown: startChatDrag,
    style: {
      position: "absolute",
      left: -34,
      top: "44%",
      width: 34,
      height: 54,
      borderRadius: "14px 0 0 14px",
      background: accent,
      cursor: "pointer",
      touchAction: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingLeft: 4,
      boxShadow: "-4px 4px 14px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 17 0z"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "62px 16px 12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid rgba(255,255,255,.13)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".14em"
    }
  }, "TABLE CHAT"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(800);
      setChatOpen(false);
      setChatX(0);
    },
    style: {
      width: 30,
      height: 30,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.7)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, [["FtManonn", "nice hand!", false, "yanu"], ["LoloS2", "ty 🙂", false, "girl"], ["SASHA02", "gg wp", true, "sponge"], ["FtManonn", "rematch?", false, "drebin"]].map(([n, m, you, av], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: you ? "flex-end" : "flex-start",
      maxWidth: "84%",
      display: "flex",
      flexDirection: you ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(window.FramedAvatar, {
    src: you ? "assets/avatar.png" : (window.CHAT_AV || {})[av] || `assets/chat/${av}.webp`,
    size: 26,
    player: !!you
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, !you && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em",
      marginBottom: 3,
      paddingLeft: 4
    }
  }, n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 600,
      fontSize: 12,
      color: you ? "#fff" : "rgba(255,255,255,.9)",
      background: you ? accent : "rgba(255,255,255,.07)",
      border: you ? "none" : "1px solid rgba(255,255,255,.1)",
      padding: "7px 12px",
      borderRadius: you ? "14px 14px 4px 14px" : "14px 14px 14px 4px"
    }
  }, m))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px 22px",
      borderTop: "1px solid rgba(255,255,255,.13)",
      display: "flex",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 40,
      borderRadius: 125,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      display: "flex",
      alignItems: "center",
      padding: "0 14px",
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 12,
      color: "#8A8A93"
    }
  }, "Message\u2026"), /*#__PURE__*/React.createElement("button", {
    onClick: () => click(1300),
    style: {
      width: 40,
      height: 40,
      flex: "none",
      borderRadius: "50%",
      background: accent,
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 12px ${accent}55`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: variant === "panel" ? "absolute" : "relative",
      left: 0,
      right: 0,
      bottom: variant === "panel" ? 0 : "auto",
      zIndex: 6,
      padding: variant === "panel" ? "30px 16px 26px" : "0 16px 30px",
      textAlign: "center",
      background: variant === "panel" ? "linear-gradient(180deg, transparent, rgba(8,8,10,.92) 36%)" : "none"
    }
  }, seated == null ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 9,
      marginBottom: 30
    }
  }, /*#__PURE__*/React.createElement("style", null, "@keyframes pp-bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".18em"
    }
  }, "TAKE A SEAT"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1500);
      setPending(5);
    },
    style: {
      width: 66,
      height: 66,
      borderRadius: "50%",
      background: accent,
      border: 0,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      boxShadow: `0 14px 30px rgba(0,0,0,.5), 0 0 0 6px ${accent}33`,
      animation: "pp-bounce 1.5s ease-in-out infinite",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "8.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8.2v7.6M8.2 12h7.6"
  })))) : waiting ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9,
      maxWidth: 360,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: "#f0c75e",
      boxShadow: "0 0 7px #f0c75e",
      animation: "pp-pulse 1.2s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".2em"
    }
  }, "WAITING TO BE DEALT IN")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1000);
      setWaitBlind(true);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "11px 13px",
      borderRadius: 14,
      cursor: "pointer",
      textAlign: "left",
      border: waitBlind ? `1.5px solid ${accent}` : "1px solid rgba(255,255,255,.18)",
      background: waitBlind ? `${accent}1c` : "rgba(255,255,255,.065)",
      transition: "border .15s, background .15s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 8,
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: waitBlind ? accent : "transparent",
      border: waitBlind ? "none" : "1.5px solid rgba(255,255,255,.32)"
    }
  }, waitBlind && /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff"
    }
  }, "Wait for big blind"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 11,
      color: "#A9A9B2"
    }
  }, "Join free \u2014 dealt in when the blind reaches you")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 11,
      color: "#5BD96A",
      flex: "none"
    }
  }, "FREE")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1000);
      setWaitBlind(false);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "11px 13px",
      borderRadius: 14,
      cursor: "pointer",
      textAlign: "left",
      border: !waitBlind ? `1.5px solid ${accent}` : "1px solid rgba(255,255,255,.18)",
      background: !waitBlind ? `${accent}1c` : "rgba(255,255,255,.065)",
      transition: "border .15s, background .15s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 24,
      height: 24,
      borderRadius: 8,
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: !waitBlind ? accent : "transparent",
      border: !waitBlind ? "none" : "1.5px solid rgba(255,255,255,.32)"
    }
  }, !waitBlind && /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff"
    }
  }, "Post big blind now"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 11,
      color: "#A9A9B2"
    }
  }, "Get dealt in right away \u2014 this hand")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 11,
      color: "#f0c75e",
      flex: "none"
    }
  }, tbMoney(tbBB))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1500);
      setWaiting(false);
      setHand(dealHoleCards());
    },
    style: {
      height: 46,
      borderRadius: 125,
      border: 0,
      background: accent,
      color: "#fff",
      cursor: "pointer",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".04em",
      boxShadow: `0 6px 16px ${accent}55`,
      marginTop: 2
    }
  }, waitBlind ? "CONFIRM · WAIT FOR BLIND" : "POST BLIND & DEAL ME IN")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: accent,
      boxShadow: `0 0 7px ${accent}`,
      animation: "pp-pulse 1.2s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#fff",
      letterSpacing: ".2em"
    }
  }, "YOUR TURN"), /*#__PURE__*/React.createElement(TbClock, {
    accent: accent
  })), callLeft > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(TbCallTimeBadge, {
    hands: callLeft
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, seatStyle === "pill" && chatPos === "left-of-call" && /*#__PURE__*/React.createElement("button", {
    onClick: () => click(1100),
    style: {
      width: 44,
      height: 44,
      flex: "none",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,.24)",
      background: "rgba(255,255,255,.13)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 17 0z"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => click(1100),
    style: {
      flex: 1.05,
      height: 44,
      borderRadius: 125,
      border: "1px solid rgba(255,255,255,.24)",
      background: "rgba(255,255,255,.085)",
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1.04,
      fontFamily: MONO_TB,
      fontWeight: 700
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      letterSpacing: ".06em"
    }
  }, "CALL"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#f0c75e",
      fontVariantNumeric: "tabular-nums"
    }
  }, tbMoney(tbBB * 0.5))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1.05,
      display: "flex"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1600);
      setRaiseOpen(o => !o);
    },
    style: {
      flex: 1,
      height: 44,
      borderRadius: 125,
      border: 0,
      background: accent,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1.04,
      fontFamily: MONO_TB,
      fontWeight: 700,
      boxShadow: `0 6px 16px ${accent}55`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      letterSpacing: ".06em"
    }
  }, "RAISE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, tbMoney(tbBB * 2.5))), raiseOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: "calc(100% + 8px)",
      right: 0,
      width: 160,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      zIndex: 9
    }
  }, [["POT", tbMoney(tbBB * 0.79)], ["75%", tbMoney(tbBB * 0.59)], ["50%", tbMoney(tbBB * 0.4)], ["33%", tbMoney(tbBB * 0.26)]].map(([p, a]) => /*#__PURE__*/React.createElement("button", {
    key: p,
    onClick: () => {
      click(1500);
      setRaiseOpen(false);
    },
    style: {
      height: 40,
      borderRadius: 125,
      border: `1px solid ${accent}55`,
      background: "rgba(18,18,22,.97)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 13px",
      boxShadow: "0 6px 16px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em"
    }
  }, p), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 13,
      color: "#f0c75e"
    }
  }, a))))), seatStyle === "pill" && chatPos === "right-of-raise" && /*#__PURE__*/React.createElement("button", {
    onClick: () => click(1100),
    style: {
      width: 44,
      height: 44,
      flex: "none",
      borderRadius: "50%",
      border: "1px solid rgba(255,255,255,.24)",
      background: "rgba(255,255,255,.13)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 17 0z"
  })))), variant === "panel" && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      marginTop: 8
    }
  }, hand && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      flex: 1,
      gap: 4
    }
  }, folded ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontSize: 12,
      color: "#8A8A93",
      letterSpacing: ".14em",
      padding: "22px 0"
    }
  }, "FOLDED") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onPointerDown: startFoldDrag,
    style: {
      display: "flex",
      alignItems: "center",
      cursor: "grab",
      touchAction: "none",
      transform: `translateY(${foldY}px)`,
      opacity: sitOut ? 0.5 : Math.max(0, 1 - -foldY / 130),
      transition: foldY === 0 || foldY <= -280 ? "transform .35s cubic-bezier(.4,0,.2,1), opacity .35s" : "none"
    }
  }, hand.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      marginLeft: i ? -16 : 0,
      transform: `rotate(${i ? 6 : -6}deg)`
    }
  }, /*#__PURE__*/React.createElement(TbCard, {
    r: c.r,
    s: c.s,
    w: 60
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.4)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 14l6-6 6 6"
  })), "SWIPE TO FOLD"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      width: 196
    }
  }, sitOut ? /*#__PURE__*/React.createElement(TbSitTimebank, {
    pct: sit.pct,
    color: sitCol,
    urgent: sit.urgent
  }) : /*#__PURE__*/React.createElement(TbTimebank, null), /*#__PURE__*/React.createElement("div", {
    onPointerDown: startStatsDrag,
    style: {
      position: "relative",
      height: 100,
      borderRadius: 16,
      border: `1px solid ${accent}`,
      background: "rgba(12,12,14,.94)",
      boxShadow: `0 0 14px ${accent}40`,
      overflow: "hidden",
      cursor: "grab",
      touchAction: "none",
      userSelect: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      padding: "11px 13px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transform: `translateY(${statsOpen ? -101 : 0}%)`,
      opacity: statsOpen ? 0 : 1,
      transition: "transform .34s cubic-bezier(.2,.8,.2,1), opacity .24s ease"
    }
  }, /*#__PURE__*/React.createElement("style", null, "@keyframes cr-bg2{0%{transform:scaleX(.2);opacity:0}100%{transform:scaleX(1);opacity:1}}@keyframes cr-pop2{0%{transform:scale(.4);opacity:0}55%{transform:scale(1.12)}75%{transform:scale(.96)}100%{transform:scale(1);opacity:1}}"), sitOut ?
  /*#__PURE__*/
  /* SIT OUT state — replaces avatar/balance: label + timer + clear button */
  React.createElement("div", {
    style: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".22em",
      color: "#A9A9B2"
    }
  }, "SITTING OUT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 30,
      color: sitCol,
      fontVariantNumeric: "tabular-nums",
      marginTop: 4,
      animation: sit.urgent ? "tbk-blink .9s steps(1,end) infinite" : "none"
    }
  }, sit.label)), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      click(1000);
      setSitOut(false);
    },
    onPointerDown: e => e.stopPropagation(),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      height: 30,
      padding: "0 20px",
      borderRadius: 125,
      border: 0,
      background: accent,
      color: "#fff",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".06em",
      cursor: "pointer",
      boxShadow: `0 4px 13px ${accent}88`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5v14l11-7z"
  })), "I'M HERE")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(window.FramedAvatar, {
    size: 38
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      lineHeight: 1.2,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(TbFlag, {
    colors: ["#0057b7", "#ffd700"]
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, "SASHA02")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 15,
      color: "#f0c75e",
      fontVariantNumeric: "tabular-nums",
      marginTop: 1
    }
  }, "$", seatBuyIn.toLocaleString("en-US").split(",").join(" ")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignSelf: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: 8,
      background: "rgba(154,163,173,.16)",
      border: "1px solid rgba(154,163,173,.4)",
      transformOrigin: "left center",
      animation: "cr-bg2 .45s cubic-bezier(.2,.9,.3,1) both"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      padding: "5px 11px",
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".02em",
      color: "#c2cad4",
      whiteSpace: "nowrap",
      animation: "cr-pop2 .5s cubic-bezier(.2,1.4,.4,1) both"
    }
  }, "HIGH CARD")))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      padding: "9px 12px 10px",
      display: "flex",
      flexDirection: "column",
      gap: 7,
      transform: `translateY(${statsOpen ? 0 : 101}%)`,
      opacity: statsOpen ? 1 : 0,
      transition: "transform .34s cubic-bezier(.2,.8,.2,1), opacity .24s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".16em"
    }
  }, "MY TABLE STATS"), /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.4)",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 10l6 6 6-6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "8px 14px"
    }
  }, [["HANDS", "24", "#fff"], ["VPIP", "31%", "#fff"], ["NET", "+$4.20", "#3fbf6a"], ["WIN RATE", "58%", "#f0c75e"]].map(([k, v, c]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      flexDirection: "column",
      lineHeight: 1.04
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 14,
      color: c
    }
  }, v)))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1000);
      setEmojiOpen(o => !o);
    },
    style: {
      position: "absolute",
      right: -10,
      bottom: -10,
      zIndex: 8,
      width: 44,
      height: 44,
      borderRadius: "50%",
      background: "rgba(20,20,24,.97)",
      border: "1px solid rgba(255,255,255,.25)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0,
      boxShadow: "0 4px 10px rgba(0,0,0,.55)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.9)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 14s1.5 2 4 2 4-2 4-2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "9.5",
    x2: "9.01",
    y2: "9.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15",
    y1: "9.5",
    x2: "15.01",
    y2: "9.5"
  }))), emojiOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: -10,
      bottom: 48,
      display: "flex",
      gap: 8,
      padding: "13px 15px",
      borderRadius: 24,
      background: "rgba(28,28,32,.98)",
      border: "1px solid rgba(255,255,255,.16)",
      boxShadow: "0 10px 26px rgba(0,0,0,.65)",
      zIndex: 8
    }
  }, ["hey", "clap", "laugh", "wow", "angry", "celebrate"].map((name, i) => /*#__PURE__*/React.createElement("button", {
    key: name,
    onClick: () => {
      click(1400 + i * 60);
      setReaction(name);
      setEmojiOpen(false);
      setTimeout(() => setReaction(null), 1600);
    },
    style: {
      width: 50,
      height: 50,
      borderRadius: "50%",
      border: 0,
      background: "transparent",
      cursor: "pointer",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: (window.REACT_IMG || {})[name] || `assets/reactions/${name}.webp`,
    alt: name,
    style: {
      width: 46,
      height: 46,
      objectFit: "contain"
    }
  })))), reaction && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: -40,
      transform: "translateX(-50%)",
      animation: "pp-react-pop 1.5s cubic-bezier(.2,.8,.2,1) forwards",
      pointerEvents: "none",
      zIndex: 9
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: (window.REACT_IMG || {})[reaction] || `assets/reactions/${reaction}.webp`,
    alt: "",
    style: {
      width: 64,
      height: 64,
      objectFit: "contain",
      filter: "drop-shadow(0 6px 14px rgba(0,0,0,.6))"
    }
  })))))), pending != null && /*#__PURE__*/React.createElement(TbBuyInSheet, {
    stakes: stakes,
    defAmount: buyIn,
    accent: accent,
    onCancel: () => {
      click(800);
      setPending(null);
    },
    onConfirm: amt => {
      click(1500);
      setSeatBuyIn(amt);
      setSeated(pending);
      setHand(dealHoleCards());
      setPending(null);
    }
  }), combos && /*#__PURE__*/React.createElement(TbCombosSheet, {
    onClose: () => {
      click(800);
      setCombos(false);
    },
    accent: accent
  }), profileFor && /*#__PURE__*/React.createElement(TbPlayerProfile, {
    p: profileFor,
    accent: accent,
    tag: playerTags[profileFor.name],
    onClose: () => {
      click(800);
      setProfileFor(null);
    },
    onSave: (name, t) => setPlayerTags(m => {
      const n = {
        ...m
      };
      if (t) n[name] = t;else delete n[name];
      return n;
    })
  }), vpipWarn > 0 && /*#__PURE__*/React.createElement(TbVpipOverlay, {
    step: vpipWarn,
    accent: accent,
    onClose: () => {
      click(800);
      setVpipWarn(0);
    },
    onLeave: () => {
      click(900);
      setVpipWarn(0);
      onBack ? onBack() : onClose();
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 140,
      visibility: "visible",
      pointerEvents: historyOpen ? "auto" : "none"
    }
  }, window.HandHistoryScreen ? /*#__PURE__*/React.createElement(window.HandHistoryScreen, {
    open: historyOpen,
    onClose: () => {
      click(800);
      setHistoryOpen(false);
    },
    accent: accent
  }) : /*#__PURE__*/React.createElement(TbHistory, {
    open: historyOpen,
    onClose: () => {
      click(800);
      setHistoryOpen(false);
    },
    accent: accent,
    discipline: discipline,
    stakes: stakes
  })), window.SettingsScreen && /*#__PURE__*/React.createElement(window.SettingsScreen, {
    open: settingsOpen,
    onClose: () => {
      click(800);
      setSettingsOpen(false);
    },
    accent: accent
  }), leaveOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 18,
      background: "rgba(0,0,0,.62)",
      backdropFilter: "blur(1.5px)",
      animation: "pp-fadeIn .2s ease both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 258,
      background: "rgba(18,18,22,.99)",
      border: "1px solid rgba(255,255,255,.1)",
      borderRadius: 20,
      boxShadow: "0 24px 60px rgba(0,0,0,.7)",
      padding: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 10,
      marginBottom: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 17,
      color: "#fff"
    }
  }, "Leave the table?"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      setLeaveOpen(false);
    },
    style: {
      flex: "none",
      width: 26,
      height: 26,
      marginTop: -2,
      marginRight: -4,
      borderRadius: 8,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.7)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 12,
      color: "#D8D8DF",
      marginBottom: 15,
      lineHeight: 1.35
    }
  }, "Keep your seat and pop back to the lobby, or leave the table for good."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1100);
      setLeaveOpen(false);
      onBack ? onBack() : onClose();
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 13px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,.18)",
      background: "rgba(255,255,255,.035)",
      cursor: "pointer",
      width: "100%",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "rgba(70,194,117,.16)",
      border: "1px solid rgba(70,194,117,.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 12l9-9 9 9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 10v10h14V10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 20v-6h6v6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff"
    }
  }, "Back to lobby"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 11,
      color: "#D8D8DF",
      lineHeight: 1.3,
      marginTop: 2
    }
  }, "Table stays live \u2014 your seat & stack are held. Jump back any time.")), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.3)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(700);
      setLeaveOpen(false);
      onClose();
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 13px",
      borderRadius: 12,
      border: `1px solid ${accent}55`,
      background: "rgba(255,255,255,.035)",
      cursor: "pointer",
      width: "100%",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: `${accent}22`,
      border: `1px solid ${accent}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#ff5964",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 17l5-5-5-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12H9"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 13,
      color: "#ff5964"
    }
  }, "Leave table"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 11,
      color: "#D8D8DF",
      lineHeight: 1.3,
      marginTop: 2
    }
  }, "Give up your seat & cash out. ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f0c75e",
      fontFamily: MONO_TB,
      fontWeight: 700
    }
  }, "$", seatBuyIn.toLocaleString("en-US").split(",").join(" ")), " returns to balance.")), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,89,100,.55)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      setLeaveOpen(false);
    },
    style: {
      width: "100%",
      marginTop: 13,
      background: "none",
      border: 0,
      cursor: "pointer",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 12,
      color: "#A9A9B2",
      padding: "4px 0"
    }
  }, "Stay at the table"))), queue && /*#__PURE__*/React.createElement(PkQueueOverlay, {
    accent: accent,
    table: table,
    pos: queuePos,
    onLeave: onBack || onClose
  }));
}
const TB_COMBOS = [{
  n: "Royal Flush",
  d: "Highest straight flush",
  cards: [["A", "heart"], ["K", "heart"], ["Q", "heart"], ["J", "heart"], ["10", "heart"]]
}, {
  n: "Straight Flush",
  d: "Five in a row, one suit",
  cards: [["J", "club"], ["10", "club"], ["9", "club"], ["8", "club"], ["7", "club"]]
}, {
  n: "Four of a Kind",
  d: "Four cards of one rank",
  cards: [["8", "spade"], ["8", "heart"], ["8", "club"], ["8", "diamond"], ["6", "spade", true]]
}, {
  n: "Full House",
  d: "Three of a kind + a pair",
  cards: [["A", "heart"], ["A", "club"], ["A", "diamond"], ["10", "spade"], ["10", "diamond"]]
}, {
  n: "Flush",
  d: "Five cards of one suit",
  cards: [["K", "spade"], ["J", "spade"], ["9", "spade"], ["8", "spade"], ["2", "spade"]]
}, {
  n: "Straight",
  d: "Five cards in a row",
  cards: [["10", "club"], ["9", "diamond"], ["8", "spade"], ["7", "heart"], ["6", "spade"]]
}, {
  n: "Three of a Kind",
  d: "Three cards of one rank",
  cards: [["7", "spade"], ["7", "heart"], ["7", "club"], ["K", "heart", true], ["J", "club", true]]
}, {
  n: "Two Pair",
  d: "Two different pairs",
  cards: [["J", "club"], ["J", "diamond"], ["4", "club"], ["4", "diamond"], ["Q", "club", true]]
}, {
  n: "One Pair",
  d: "Two cards of one rank",
  cards: [["K", "club"], ["K", "diamond"], ["9", "club", true], ["2", "spade", true], ["10", "club", true]]
}, {
  n: "High Card",
  d: "Highest-ranking card",
  cards: [["A", "club"], ["7", "club", true], ["3", "heart", true], ["9", "club", true], ["2", "club", true]]
}];
function TbCombosSheet({
  onClose,
  accent
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 130,
      background: "rgba(0,0,0,.6)",
      backdropFilter: "blur(3px)",
      display: "flex",
      alignItems: "flex-end",
      opacity: mounted ? 1 : 0,
      transition: "opacity .25s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      background: "rgb(20,20,24)",
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      boxShadow: "0 -3px 24px rgba(0,0,0,.5)",
      padding: "14px 18px 34px",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform .34s cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,.2)",
      margin: "0 auto 16px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, "HAND RANKINGS"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: "rgba(255,255,255,.13)",
      border: "1px solid rgba(255,255,255,.16)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 1,
      maxHeight: "70vh",
      overflowY: "auto"
    }
  }, TB_COMBOS.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.n,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "8px 2px",
      borderBottom: i < TB_COMBOS.length - 1 ? "1px solid rgba(255,255,255,.085)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 2,
      flex: "none"
    }
  }, c.cards.map((cd, j) => /*#__PURE__*/React.createElement(TbCard, {
    key: j,
    r: cd[0],
    s: cd[1],
    w: 19,
    dim: !!cd[2]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff"
    }
  }, c.n), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 500,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, c.d)))))));
}
function PkQueueOverlay({
  accent,
  table,
  pos = 1,
  onLeave
}) {
  const [inLine, setInLine] = React.useState(false);
  const click = f => {
    if (window.playClick) window.playClick(f, 0.04);
  };
  const name = table && table.name ? table.name : "TABLE";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      pointerEvents: "auto",
      background: "#0d0d10",
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      border: "1px solid rgba(255,255,255,.16)",
      borderBottom: 0,
      boxShadow: "0 -20px 50px rgba(0,0,0,.6)",
      padding: "18px 18px 30px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 15
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#ff8a93",
      background: "rgba(215,25,33,.14)",
      border: "1px solid rgba(215,25,33,.4)",
      padding: "4px 9px",
      borderRadius: 125
    }
  }, "TABLE FULL"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, table && table.max ? `${table.max}/${table.max} SEATED` : "")), inLine ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 13,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.16)",
      borderRadius: 14,
      padding: "14px 16px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 30,
      color: "#fff",
      lineHeight: 1
    }
  }, "#", pos), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "YOU'RE IN LINE"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      marginTop: 3
    }
  }, "We'll seat you automatically when a spot opens."))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      setInLine(false);
    },
    style: {
      width: "100%",
      padding: "14px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.2)",
      color: "#D8D8DF",
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".1em"
    }
  }, "LEAVE QUEUE")) : /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1350);
      setInLine(true);
    },
    style: {
      width: "100%",
      padding: "16px 0",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: accent,
      color: "#fff",
      boxShadow: `0 12px 28px ${accent}55`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".1em"
    }
  }, "JOIN QUEUE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#D8D8DF"
    }
  }, table && table.wait ? `${table.wait} WAITING` : "BE FIRST IN LINE"))));
}
function TbBuyInSheet({
  stakes,
  defAmount,
  accent,
  onConfirm,
  onCancel,
  onDeposit,
  wallets = null,
  title = "BUY-IN",
  disc = "HOLD'EM",
  cta = null
}) {
  // Правка A3 (UX-аудит 07.09): шторка одна, але виклики передавали різні
  // акценти (кеш-лоббі — м'ятний #21C97B, стіл — #17925a), тож кнопки
  // виглядали по-різному. Уніфіковано: один зелений #14804F, підібраний
  // під WCAG AA — білий текст 4.96:1, світлий підпис #EAFDF3 4.69:1
  // (на м'ятному було 2.16:1). Вхідний accent ігноруємо свідомо.
  accent = "#14804F";
  const bb = Math.max(1, parseInt(String(stakes).split("/")[1], 10) || 10);
  const MIN = bb * 40,
    MAX = bb * 200;
  const clamp = v => Math.max(MIN, Math.min(MAX, Math.round(v / bb) * bb));
  // Слайдер за замовчуванням на МІНІМУМІ, а не посередині (правка N3)
  // Правка СЕО N3: слайдер за замовчуванням СТОЇТЬ НА МІНІМУМІ.
  // defAmount ігноруємо для стартової позиції (він тягнув $100 при мін $40).
  const [amt, setAmt] = React.useState(MIN);
  const [rebuy, setRebuy] = React.useState(false);
  const [gameSet, setGameSet] = React.useState(false); // шторка «Настройки игры»
  const [gcfg, setGcfg] = React.useState(() => window.__pxGameCfg || (window.__pxGameCfg = {
    sounds: true,
    stackBB: false,
    fourColour: true,
    confirmSitOut: false,
    defaultBuyin: true,
    autoBuyin: false,
    betStep: "bb",
    betConfirm: "never",
    roundBlind: false,
    openBet: ["2bb", "3bb", "4bb", "pot"],
    potBet: ["33", "50", "75", "max"]
  }));
  const gset = patch => setGcfg(c => {
    const n = {
      ...c,
      ...patch
    };
    window.__pxGameCfg = n;
    return n;
  });
  // which wallet the buy-in comes from — bonus money first, so it is spent
  // before withdrawable dollars. Balances are USD; display goes through pxMoney.
  const WSRC = wallets || (window.pxWallets ? window.pxWallets() : null) || {
    cash: 482500,
    usd: 1847500
  };
  const WALLETS = [{
    id: "cash",
    label: "CASH$",
    bal: WSRC.cash,
    note: "BONUS BALANCE"
  }, {
    id: "usd",
    label: "USD",
    bal: WSRC.usd,
    note: "MAIN BALANCE"
  }];
  const [wallet, setWallet] = React.useState(WSRC.cash >= (defAmount || bb * 100) ? "cash" : "usd");
  const W = WALLETS.find(w => w.id === wallet) || WALLETS[0];
  const m = n => window.pxMoney ? window.pxMoney(n) : "$" + Math.round(n).toLocaleString("en-US").split(",").join("\u2009");
  const ref = React.useRef(null);
  const pct = (amt - MIN) / (MAX - MIN) * 100;
  const move = cx => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let p = Math.max(0, Math.min(1, (cx - r.left) / r.width));
    const v = clamp(MIN + p * (MAX - MIN));
    if (window.playClick && v !== amt) window.playClick(1000 + p * 700, 0.015);
    setAmt(v);
  };
  const down = e => {
    e.preventDefault();
    move(e.touches ? e.touches[0].clientX : e.clientX);
    const mv = ev => move(ev.touches ? ev.touches[0].clientX : ev.clientX);
    const up = () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", mv);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", mv, {
      passive: false
    });
    window.addEventListener("touchend", up);
  };
  const presets = [{
    label: "MIN",
    v: bb * 40
  }, {
    label: "MAX",
    v: MAX
  }];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onCancel,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 9,
      background: "rgba(0,0,0,.6)",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      animation: "tb-fade .2s ease"
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes tb-fade{from{opacity:0}to{opacity:1}}@keyframes tb-up{from{transform:translateY(100%)}to{transform:translateY(0)}}`), /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: "#0d0d10",
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      border: "1px solid rgba(255,255,255,.16)",
      borderBottom: 0,
      padding: "10px 18px 28px",
      boxShadow: "0 -20px 50px rgba(0,0,0,.6)",
      animation: "tb-up .34s cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,.2)",
      margin: "0 auto 16px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".08em"
    }
  }, window.Term && window.PX_TERMS && window.PX_TERMS[title] ? /*#__PURE__*/React.createElement(window.Term, {
    k: title
  }, title) : title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".12em"
    }
  }, disc, " · ", m(MIN), "–", m(MAX))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 40,
      color: "#fff",
      lineHeight: 1
    }
  }, m(amt)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, "PAY FROM"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1300, .04);
      if (onDeposit) onDeposit();else if (window.openDeposit) window.openDeposit();
    },
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 10px",
      borderRadius: 125,
      cursor: "pointer",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.18)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#D8D8DF",
    strokeWidth: "3",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".14em",
      color: "#D8D8DF"
    }
  }, "TOP UP"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, WALLETS.map(w => {
    const on = w.id === wallet;
    const short = w.bal < amt;
    return /*#__PURE__*/React.createElement("button", {
      key: w.id,
      onClick: () => {
        if (window.playClick) window.playClick(1150, .03);
        setWallet(w.id);
      },
      style: {
        padding: "11px 12px",
        borderRadius: 12,
        cursor: "pointer",
        textAlign: "left",
        background: on ? accent + "18" : "rgba(255,255,255,.055)",
        border: "1px solid " + (on ? accent : "rgba(255,255,255,.1)"),
        opacity: short ? .45 : 1,
        display: "flex",
        flexDirection: "column",
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        flex: "none",
        background: on ? accent : "rgba(255,255,255,.25)"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_TB,
        fontWeight: 700,
        fontSize: 12,
        color: "#fff",
        letterSpacing: ".04em"
      }
    }, w.label)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_TB,
        fontWeight: 700,
        fontSize: 13,
        color: on ? "#fff" : "rgba(255,255,255,.62)",
        fontVariantNumeric: "tabular-nums"
      }
    }, m(w.bal)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 8.5,
        letterSpacing: ".14em",
        color: short ? "#E5484D" : "rgba(255,255,255,.42)"
      }
    }, short ? "NOT ENOUGH" : w.note));
  }))), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onMouseDown: down,
    onTouchStart: down,
    style: {
      position: "relative",
      height: 28,
      marginTop: 18,
      cursor: "pointer",
      touchAction: "none",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 6,
      borderRadius: 3,
      background: "rgba(255,255,255,.16)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      height: 6,
      borderRadius: 3,
      width: `${pct}%`,
      background: accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${pct}%`,
      transform: "translateX(-50%)",
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 3px 8px rgba(0,0,0,.5), 0 0 0 5px rgba(255,255,255,.18)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 6,
      fontFamily: MONO_TB,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, /*#__PURE__*/React.createElement("span", null, "MIN ", m(MIN)), /*#__PURE__*/React.createElement("span", null, "MAX ", m(MAX))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginTop: 16
    }
  }, presets.map(p => {
    const on = amt === clamp(p.v);
    return /*#__PURE__*/React.createElement("button", {
      key: p.label,
      onClick: () => {
        if (window.playClick) window.playClick(1200, 0.03);
        setAmt(clamp(p.v));
      },
      style: {
        padding: "12px 0",
        borderRadius: 12,
        cursor: "pointer",
        background: on ? `${accent}1c` : "rgba(255,255,255,.065)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.1)"}`,
        boxShadow: on ? `0 0 0 1px ${accent}` : "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_TB,
        fontWeight: 700,
        fontSize: 14,
        color: "#fff"
      }
    }, m(clamp(p.v))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_TB,
        fontWeight: 700,
        fontSize: 9.5,
        letterSpacing: ".1em",
        color: on ? accent : "rgba(255,255,255,.5)"
      }
    }, /*#__PURE__*/React.createElement("span", null, p.label), " · ", /*#__PURE__*/React.createElement("span", null, Math.round(clamp(p.v) / bb) + " BB")));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1150, .035);
      setGameSet(true);
    },
    style: {
      width: "100%",
      marginTop: 12,
      padding: "10px 12px",
      borderRadius: 12,
      cursor: "pointer",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.14)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.7)",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3.2v2M12 18.8v2M4.6 12H2.6M21.4 12h-2M6.6 6.6L5.2 5.2M18.8 18.8l-1.4-1.4M17.4 6.6l1.4-1.4M5.2 18.8l1.4-1.4"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      color: "rgba(255,255,255,.78)"
    }
  }, "SET UP BUY-IN OPTIONS"), /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.5)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), W.bal < amt ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      padding: "12px 14px",
      borderRadius: 12,
      background: "rgba(229,72,77,.1)",
      border: "1px solid rgba(229,72,77,.4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#E5484D"
    }
  }, "NOT ENOUGH FUNDS"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 4,
      fontFamily: SANS_TB,
      fontWeight: 600,
      fontSize: 11,
      color: "#A9A9B2",
      lineHeight: 1.4
    }
  }, /*#__PURE__*/React.createElement("span", null, "YOU NEED"), " " + m(amt - W.bal) + " ", /*#__PURE__*/React.createElement("span", null, "MORE IN"), " " + W.label)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1500, .05);
      if (onDeposit) onDeposit();else if (window.openDeposit) window.openDeposit();
    },
    style: Object.assign(UI.btn("xl", "primary", accent), {
      width: "100%",
      marginTop: 12,
      flexDirection: "column",
      gap: 2
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".08em"
    }
  }, "DEPOSIT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#EAFDF3",
      letterSpacing: ".12em"
    }
  }, "TOP UP YOUR BALANCE"))) : /*#__PURE__*/React.createElement("button", {
    onClick: () => onConfirm(amt),
    onMouseDown: e => {
      e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: Object.assign(UI.btn("xl", "primary", accent), {
      width: "100%",
      marginTop: 16,
      flexDirection: "column",
      gap: 2,
      transition: "transform .1s"
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TB,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".08em"
    }
  }, "SIT DOWN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TB,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#EAFDF3",
      letterSpacing: ".12em"
    }
  }, m(amt), " · ", /*#__PURE__*/React.createElement("span", null, "FROM"), " " + W.label))), window.GameSettingsSheet && /*#__PURE__*/React.createElement(window.GameSettingsSheet, {
    open: gameSet,
    accent: accent,
    amount: amt,
    cfg: gcfg,
    set: gset,
    onClose: () => {
      if (window.playClick) window.playClick(800, .04);
      setGameSet(false);
    }
  }));
}
const tbChrome = {
  flex: "none",
  width: 38,
  height: 38,
  borderRadius: 12,
  background: "rgba(0,0,0,.4)",
  border: "1px solid rgba(255,255,255,.16)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  padding: 0
};
Object.assign(window, {
  TableListScreen,
  PokerTableScreen,
  TbHistory,
  TbBuyInSheet
});
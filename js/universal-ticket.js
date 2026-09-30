// Universal Ticket — a fixed-value ticket ($3 000) the player holds unredeemed.
// Tear the stub → it opens a LIST of tournaments the ticket can enter (buy-in ≤
// its value). From the list the player can open any event page to read/register,
// come back, and pick another. Opened from My Tournaments.

const MONO_UT = UI.font;
const SANS_UT = UI.fontUI;
const UNI_TICKET = {
  value: "$10",
  valueNum: 10,
  expires: "14 DAYS"
};

// tournaments the ticket can enter — ONLY exact $10 buy-ins (a ticket is strictly
// its face value, not "up to"). Type medallion colour reused.
const UNI_ELIGIBLE = [{
  name: "DAILY DEEP",
  time: "21:00",
  rel: "IN 2H 47M",
  buyIn: "$10",
  gtd: "$50 000",
  fmt: ["PKO", "DEEPSTACK"]
}, {
  name: "TURBO 4-MAX",
  time: "20:30",
  rel: "IN 30M",
  buyIn: "$10",
  gtd: "$10 000",
  fmt: ["TURBO", "4-MAX"]
}, {
  name: "NIGHTLY HUNDRED",
  time: "22:00",
  rel: "IN 1H 30M",
  buyIn: "$10",
  gtd: "$8 000",
  fmt: ["PKO"]
}, {
  name: "PLO TENNER",
  time: "23:00",
  rel: "IN 2H 30M",
  buyIn: "$10",
  gtd: "$5 000",
  fmt: ["PLO", "6-MAX"]
}, {
  name: "MIDNIGHT EXPRESS",
  time: "00:00",
  rel: "IN 3H 30M",
  buyIn: "$10",
  gtd: "$12 000",
  fmt: ["HYPER-TURBO"]
}];
const UT_RED = "#D71921";
function UtTrophy({
  size = 21,
  color = "#fff"
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 4h10v4a5 5 0 0 1-10 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 14h4M9 20h6M12 14v6"
  }));
}
function UtFmt({
  label
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_UT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".1em",
      padding: "3px 7px",
      borderRadius: 5,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      whiteSpace: "nowrap"
    }
  }, label);
}

// ── the tearable universal ticket (horizontal drag-to-tear, mirrors Tickets) ──
function UtTear({
  accent,
  bg,
  onTorn
}) {
  const trackRef = React.useRef(null);
  const [tear, setTear] = React.useState(0);
  const [torn, setTorn] = React.useState(false);
  const W = 224;
  const finish = () => {
    if (torn) return;
    setTorn(true);
    if (window.playClick) window.playClick(1700, 0.07);
    setTimeout(() => onTorn(), 720);
  };
  const moveTo = clientX => {
    const el = trackRef.current;
    if (!el || torn) return;
    const r = el.getBoundingClientRect();
    let p = (clientX - r.left) / r.width;
    p = Math.max(0, Math.min(1, p));
    setTear(p);
    if (window.playClick && p > 0.02) window.playClick(1200 + p * 900, 0.012);
    if (p >= 0.92) finish();
  };
  const onDown = e => {
    e.preventDefault();
    moveTo(e.touches ? e.touches[0].clientX : e.clientX);
    const mv = ev => moveTo(ev.touches ? ev.touches[0].clientX : ev.clientX);
    const up = () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", mv);
      window.removeEventListener("touchend", up);
      setTear(p => p >= 0.92 ? p : 0);
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", mv, {
      passive: false
    });
    window.addEventListener("touchend", up);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: W,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: W,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      background: "linear-gradient(165deg, #1b1316, #0a0a0c)",
      border: `1px solid ${accent}3a`,
      borderBottom: 0,
      padding: "24px 18px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      boxShadow: "0 24px 60px rgba(0,0,0,.6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(circle at 50% 0%, ${accent}26, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.075) .8px, transparent 1.2px)",
      backgroundSize: "14px 14px",
      maskImage: "linear-gradient(180deg, black, transparent 70%)",
      WebkitMaskImage: "linear-gradient(180deg, black, transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      width: 52,
      height: 52,
      borderRadius: 16,
      background: `${accent}26`,
      border: `1px solid ${accent}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(UtTrophy, {
    size: 26,
    color: accent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: SANS_UT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".24em",
      marginTop: 14
    }
  }, "UNIVERSAL TICKET"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: MONO_UT,
      fontWeight: 700,
      fontSize: 34,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 6
    }
  }, UNI_TICKET.value), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: SANS_UT,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".04em",
      marginTop: 8
    }
  }, "Use on any ", UNI_TICKET.value, " buy-in tournament")), /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    onMouseDown: onDown,
    onTouchStart: onDown,
    style: {
      position: "relative",
      height: 34,
      background: "#0a0a0c",
      borderLeft: `1px solid ${accent}3a`,
      borderRight: `1px solid ${accent}3a`,
      cursor: "grab",
      touchAction: "none",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -8,
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: bg
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -8,
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: bg
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12,
      right: 12,
      top: "50%",
      height: 0,
      borderTop: "2px dashed rgba(255,255,255,.26)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 12,
      top: "50%",
      height: 2,
      background: accent,
      width: `calc((100% - 24px) * ${tear})`,
      boxShadow: `0 0 8px ${accent}`,
      transform: "translateY(-1px)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: `calc(12px + (100% - 24px) * ${tear})`,
      top: "50%",
      transform: "translate(-50%,-50%)",
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: accent,
      border: "2px solid #000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 12px ${accent}88`,
      opacity: torn ? 0 : 1,
      transition: torn ? "opacity .3s" : "none",
      zIndex: 3
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
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "6",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "18",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 8.5L20 18M8.5 15.5L20 6"
  }))), tear < 0.04 && !torn && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 54,
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      alignItems: "center",
      animation: "pp-pulse 1.2s ease-in-out infinite",
      pointerEvents: "none"
    }
  }, [0, 1, 2].map(i => /*#__PURE__*/React.createElement("svg", {
    key: i,
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: `rgba(255,255,255,${0.55 - i * 0.14})`,
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      marginLeft: i ? -4 : 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
      background: `linear-gradient(165deg, ${accent}1c, #0c0c0e)`,
      border: `1px solid ${accent}3a`,
      borderTop: 0,
      padding: "15px 14px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      transformOrigin: "top center",
      transform: torn ? "translateY(135%) rotate(7deg)" : `translateY(${tear * 5}px) rotate(${tear * 1.5}deg)`,
      opacity: torn ? 0 : 1,
      transition: torn ? "transform .7s cubic-bezier(.4,0,.2,1), opacity .7s" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_UT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".24em"
    }
  }, "TEAR TO CHOOSE A TOURNAMENT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_UT,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".08em"
    }
  }, UNI_TICKET.value, " \xB7 1 USE"))));
}

// ── eligible-tournament row (shown after tearing) ──
function UtEligibleRow({
  e,
  accent,
  onView,
  onUse
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,.14)",
      background: "linear-gradient(155deg, #141418, #0a0a0c)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 3% 0%, ${UT_RED}1c, transparent 44%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onView,
    style: {
      position: "relative",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      background: "transparent",
      border: 0,
      padding: 13,
      display: "flex",
      gap: 13,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 44,
      height: 44,
      borderRadius: 12,
      background: `${UT_RED}22`,
      border: `1px solid ${UT_RED}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(UtTrophy, {
    size: 20,
    color: UT_RED
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_UT,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".02em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, e.name), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      flex: "none",
      fontFamily: MONO_UT,
      fontSize: 11,
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, e.time, " \xB7 ", e.rel)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_UT,
      fontWeight: 700,
      fontSize: 17,
      color: UT_RED
    }
  }, e.gtd), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_UT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, "GTD"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      fontFamily: SANS_UT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".06em",
      whiteSpace: "nowrap"
    }
  }, "BUY-IN ", e.buyIn))), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.45)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 13px",
      borderTop: "1px solid rgba(255,255,255,.13)",
      background: "rgba(255,255,255,.02)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "nowrap",
      minWidth: 0,
      overflow: "hidden"
    }
  }, (e.fmt || []).slice(0, 2).map(f => /*#__PURE__*/React.createElement(UtFmt, {
    key: f,
    label: f
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: onUse,
    style: {
      marginLeft: "auto",
      flex: "none",
      padding: "8px 15px",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: accent,
      color: "#fff",
      fontFamily: MONO_UT,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      boxShadow: `0 6px 16px ${accent}55`
    }
  }, "USE TICKET \u203A")));
}
function UniversalTicketFlow({
  open,
  onClose,
  accent = "#D71921",
  onView
}) {
  // повноекранний під-екран — ховаємо верхню смугу активних столів,
  // інакше вона малюється поверх власної шапки екрана
  React.useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [open]);
  const [mounted, setMounted] = React.useState(false);
  const [phase, setPhase] = React.useState("tear"); // tear | list
  const [used, setUsed] = React.useState(null);
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    setPhase("tear");
    setUsed(null);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 70,
      background: "#000",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 260,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}26, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 16,
      paddingBottom: 8,
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
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      minWidth: 0,
      maxWidth: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_UT,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "UNIVERSAL TICKET"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "UNIVERSAL TICKET"
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36
    }
  })), phase === "tear" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 2,
      padding: "0 22px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_UT,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".06em",
      textAlign: "center",
      marginBottom: 24,
      maxWidth: 270,
      lineHeight: 1.6
    }
  }, "Swipe the ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent
    }
  }, "red knob"), " across the dotted line to tear the stub and see every tournament this ticket can enter."), /*#__PURE__*/React.createElement(UtTear, {
    accent: accent,
    bg: "#000",
    onTorn: () => {
      setPhase("list");
    }
  })), phase === "list" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "4px 16px 110px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      padding: "14px 15px",
      background: `linear-gradient(120deg, ${accent}, #8c0f16)`,
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.18) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(120deg, black, transparent 75%)",
      WebkitMaskImage: "linear-gradient(120deg, black, transparent 75%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: "none",
      width: 38,
      height: 38,
      borderRadius: 12,
      background: "rgba(0,0,0,.22)",
      border: "1px solid rgba(255,255,255,.3)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(UtTrophy, {
    size: 19,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_UT,
      fontWeight: 700,
      fontSize: 18,
      color: "#fff"
    }
  }, UNI_TICKET.value, " TICKET"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_UT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".14em",
      marginTop: 2
    }
  }, "TORN \xB7 1 USE \xB7 PICK A TOURNAMENT"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      marginTop: 22,
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
      fontFamily: MONO_UT,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".1em"
    }
  }, UNI_TICKET.value, " TOURNAMENTS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_UT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, UNI_ELIGIBLE.length)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, UNI_ELIGIBLE.map(e => /*#__PURE__*/React.createElement(UtEligibleRow, {
    key: e.name,
    e: e,
    accent: accent,
    onView: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      onView && onView(e);
    },
    onUse: () => {
      if (window.playClick) window.playClick(1600, 0.05);
      setUsed(e);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      textAlign: "center",
      fontFamily: SANS_UT,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".06em",
      lineHeight: 1.6
    }
  }, "Tap a tournament to read the details, or use your ticket to register instantly.")), used && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 8,
      background: "rgba(0,0,0,.78)",
      backdropFilter: "blur(4px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 28px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 72,
      height: 72,
      borderRadius: 20,
      background: `${accent}22`,
      border: `1px solid ${accent}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "pp-claim-pop .5s cubic-bezier(.2,.9,.3,1.2) both"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "36",
    height: "36",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_UT,
      fontSize: 22,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 18
    }
  }, "YOU'RE REGISTERED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_UT,
      fontWeight: 600,
      fontSize: 12,
      color: "#D8D8DF",
      marginTop: 8,
      lineHeight: 1.55
    }
  }, "Universal ticket used for ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#fff"
    }
  }, used.name), ". See it under your registered tournaments."), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1500, 0.05);
      onClose();
    },
    style: {
      width: "100%",
      maxWidth: 280,
      marginTop: 24,
      padding: "15px 0",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: accent,
      color: "#fff",
      fontFamily: MONO_UT,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".08em",
      boxShadow: `0 12px 28px ${accent}55`
    }
  }, "DONE")));
}
Object.assign(window, {
  UniversalTicketFlow
});
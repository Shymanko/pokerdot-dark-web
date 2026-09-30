// Tickets — the player's ticket wallet. Opens from the profile TICKETS tile.
// List: full-width rows like the MTT EventRow with a perforated ticket stub.
// Tap a ticket → others fade out, it stands up vertically (stub on top), and
// the user drags across the fold to tear the stub off → registered into the
// linked event with a "YOU'RE REGISTERED" toast.

const MONO_TT = UI.font;
const SANS_TT = UI.fontUI;
const TICKETS = [{
  name: "DUCK HUNT",
  type: "TOURNAMENT TICKET",
  value: "₸10 000 000 000 GTD",
  qty: 1,
  expires: "MAY 29",
  suit: "spade",
  starts: "02:44:02"
}, {
  name: "SUNDAY MILLION",
  type: "TOURNAMENT TICKET",
  value: "₸10 000 000 000 GTD",
  qty: 1,
  expires: "EVERY SUN",
  suit: "heart",
  starts: "1D 04:10"
}, {
  name: "MYSTERY BOUNTY",
  type: "BONUS TICKET",
  value: "₸25 000 VALUE",
  qty: 2,
  expires: "7 DAYS",
  suit: "club",
  starts: "00:38:20"
}, {
  name: "DAILY INVITATIONAL",
  type: "TOURNAMENT TICKET",
  value: "₸50 000 000 GTD",
  qty: 1,
  expires: "TODAY",
  suit: "diamond",
  starts: "05:12:44"
}];
function TicketRow({
  t,
  accent,
  bg,
  onSelect
}) {
  const isRed = t.suit === "heart" || t.suit === "diamond";
  const sc = t.universal ? accent : isRed ? accent : "#fff";
  const STUB = 76;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onSelect,
    onMouseDown: e => {
      e.currentTarget.style.transform = "scale(.99)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      position: "relative",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      padding: 0,
      border: 0,
      background: "transparent",
      transition: "transform .1s"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 16,
      background: "linear-gradient(155deg, #141418, #0a0a0c)",
      border: "1px solid rgba(255,255,255,.14)",
      overflow: "hidden",
      display: "flex",
      alignItems: "stretch",
      minHeight: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(circle at 96% 6%, ${accent}14, transparent 52%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: STUB - 7,
      top: -7,
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: bg,
      border: "1px solid rgba(255,255,255,.14)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: STUB - 7,
      bottom: -7,
      width: 14,
      height: 14,
      borderRadius: "50%",
      background: bg,
      border: "1px solid rgba(255,255,255,.14)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: STUB,
      top: 9,
      bottom: 9,
      width: 0,
      borderLeft: "2px dashed rgba(255,255,255,.16)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      width: STUB,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 7,
      background: `${accent}0f`
    }
  }, t.universal ? /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 4h10v4a5 5 0 0 1-10 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 14h4M9 20h6M12 14v6"
  })) : window.Suit && /*#__PURE__*/React.createElement(window.Suit, {
    kind: t.suit,
    size: 30,
    color: sc
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TT,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "\xD7", t.qty)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minWidth: 0,
      padding: "13px 14px 13px 16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, t.type), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_TT,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 4,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_TT,
      fontWeight: 700,
      fontSize: t.value.length > 16 ? 10.5 : 12.5,
      color: sc,
      marginTop: 4
    }
  }, t.value), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: SANS_TT,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.42)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v4l3 2"
  })), "EXPIRES ", t.expires), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TT,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".1em"
    }
  }, "USE \u203A")))));
}

// the SAME row design, enlarged, with a flip-in entrance + drag-to-tear stub
// portrait ticket — stands up from the row (seamless), stub at bottom,
// swipe the knob LEFT→RIGHT along the perforation to tear it off.
function FocusTicket({
  t,
  accent,
  bg,
  onRegistered
}) {
  const isRed = t.suit === "heart" || t.suit === "diamond";
  const sc = isRed ? accent : "#fff";
  const trackRef = React.useRef(null);
  const [tear, setTear] = React.useState(0);
  const [torn, setTorn] = React.useState(false);
  const W = 212;
  const finish = () => {
    if (torn) return;
    setTorn(true);
    if (window.playClick) window.playClick(1700, 0.07);
    setTimeout(() => onRegistered(), 720);
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
      perspective: 1000,
      width: W,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: W,
      borderRadius: 20,
      overflow: "visible",
      display: "flex",
      flexDirection: "column",
      animation: "tk-standup .5s cubic-bezier(.2,.85,.3,1.04) both",
      transformOrigin: "center center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
      background: "linear-gradient(165deg, #141418, #0a0a0c)",
      border: "1px solid rgba(255,255,255,.1)",
      borderBottom: 0,
      padding: "26px 18px 20px",
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
      background: `radial-gradient(circle at 50% 0%, ${accent}1f, transparent 60%)`
    }
  }), window.Suit && /*#__PURE__*/React.createElement(window.Suit, {
    kind: t.suit,
    size: 46,
    color: sc
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: SANS_TT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".22em",
      marginTop: 14
    }
  }, t.type), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: MONO_TT,
      fontSize: 21,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 7
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: MONO_TT,
      fontWeight: 700,
      fontSize: t.value.length > 16 ? 13 : 16,
      color: sc,
      marginTop: 6
    }
  }, t.value), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: SANS_TT,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".06em",
      marginTop: 12
    }
  }, "STARTS IN ", t.starts)), /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    onMouseDown: onDown,
    onTouchStart: onDown,
    style: {
      position: "relative",
      height: 34,
      background: "#0a0a0c",
      borderLeft: "1px solid rgba(255,255,255,.1)",
      borderRight: "1px solid rgba(255,255,255,.1)",
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
      animation: "tk-nudge-x 1.2s ease-in-out infinite",
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
      padding: "16px 14px",
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
      fontFamily: SANS_TT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".24em"
    }
  }, "ADMIT ONE \xB7 \xD7", t.qty), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TT,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".08em"
    }
  }, t.name))));
}
function TicketsScreen({
  open,
  onClose,
  accent = "#D71921",
  onUseTicket,
  onOpenEvent
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
  const [sel, setSel] = React.useState(null);
  const BG = "#0a0a0c";
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    setSel(null);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const total = TICKETS.reduce((s, t) => s + t.qty, 0);
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, 0.04);
  };
  const focused = sel != null ? TICKETS[sel] : null;
  const back = () => {
    click(900);
    if (sel != null) {
      setSel(null);
    } else onClose();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      background: BG,
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes tk-standup{0%{transform:rotate(-90deg) scale(.62);opacity:0}60%{opacity:1}100%{transform:rotate(0) scale(1);opacity:1}}@keyframes tk-nudge-x{0%,100%{transform:translate(0,-50%)}50%{transform:translate(6px,-50%)}}@keyframes tk-toast{0%{transform:translateY(16px);opacity:0}100%{transform:translateY(0);opacity:1}}`), /*#__PURE__*/React.createElement("div", {
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
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: back,
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
      fontFamily: MONO_TT,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, sel != null ? "USE TICKET" : "TICKETS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TT,
      fontSize: 13,
      color: "#A9A9B2"
    }
  }, sel != null ? "" : total)), sel == null && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 40,
      position: "relative",
      zIndex: 2,
      padding: "8px 16px 40px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, TICKETS.map((t, i) => /*#__PURE__*/React.createElement(TicketRow, {
    key: i,
    t: t,
    accent: accent,
    bg: BG,
    onSelect: () => {
      click(1200);
      setSel(i);
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "18px 2px 0",
      textAlign: "center",
      fontFamily: SANS_TT,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      lineHeight: 1.6
    }
  }, "Win tickets from Tasks, gift codes and promos. Tap a ticket to use it.")), focused && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      zIndex: 2,
      padding: "0 22px 30px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TT,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".06em",
      textAlign: "center",
      marginBottom: 22,
      maxWidth: 260,
      lineHeight: 1.5
    }
  }, "Swipe the ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent
    }
  }, "red knob"), " left \u2192 right along the dotted line to tear the stub and register."), /*#__PURE__*/React.createElement(FocusTicket, {
    t: focused,
    accent: accent,
    bg: BG,
    onRegistered: () => {
      try {
        localStorage.setItem("pp_tourn_reg_DAILY DEEP", "1");
      } catch (e) {}
      onUseTicket && onUseTicket();
    }
  })));
}
Object.assign(window, {
  TicketsScreen
});
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// table-ref-screen.jsx — the felt the app actually sits at.
// Wraps PokerTableRef (our themed reference table: PNG chips, reference top
// bar, one felt colour per discipline) as a drop-in window.PokerTableScreen,
// and puts the leave-the-table confirm behind the top-bar ✕.
// Loads LAST so it overrides table.jsx's older screen.

const TRS_MONO = UI.font;
const TRS_SANS = UI.fontUI;

// 8 seats — seven opponents on the 9-max oval, one seat pulled off the bottom
// (same asymmetry the reference's own 6-max ring uses)
if (window.TR_SEATS && !window.TR_SEATS[8]) {
  window.TR_SEATS[8] = [{
    x: 207,
    y: 208,
    b: {
      x: 240,
      y: 292
    }
  }, {
    x: 437,
    y: 208,
    b: {
      x: 406,
      y: 292
    }
  }, {
    x: 70,
    y: 362,
    b: {
      x: 171,
      y: 372
    }
  }, {
    x: 570,
    y: 362,
    b: {
      x: 466,
      y: 372
    }
  }, {
    x: 70,
    y: 520,
    b: {
      x: 171,
      y: 530
    }
  }, {
    x: 570,
    y: 520,
    b: {
      x: 466,
      y: 530
    }
  }, {
    x: 566,
    y: 832,
    b: {
      x: 457,
      y: 780
    }
  }];
}

// 3 seats (Spin & Win) — heads-up ring the reference doesn't ship
if (window.TR_SEATS && !window.TR_SEATS[3]) {
  window.TR_SEATS[3] = [{
    x: 207,
    y: 208,
    b: {
      x: 240,
      y: 292
    }
  }, {
    x: 437,
    y: 208,
    b: {
      x: 406,
      y: 292
    }
  }];
}

// prototype discipline strings → reference keys
function trsDisc(d, table) {
  const s = String(d || "").toUpperCase().replace(/\s+/g, " ").trim();
  if (table && (table.spin || /SPIN/.test(String(table.name || "").toUpperCase())) || /SPIN/.test(s)) return "SPIN & WIN";
  if (/SHORT/.test(s)) return "SHORT DECK";
  if (/PLO\s*6|6\s*CARD/.test(s)) return "PLO6";
  if (/PLO\s*5|5\s*CARD/.test(s)) return "PLO5";
  if (/PLO|OMAHA/.test(s)) return "PLO4";
  return "HOLD'EM";
}

// ── leave-the-table confirm ────────────────────────────────────────────────
function TrsLeaveSheet({
  open,
  name,
  accent,
  onCancel,
  onLobby,
  onLeave,
  all = false,
  count = 0
}) {
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setUp(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onCancel,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 14px",
      background: "rgba(0,0,0,.74)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      opacity: up ? 1 : 0,
      transition: "opacity 170ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      maxWidth: 330,
      boxSizing: "border-box",
      borderRadius: 20,
      border: `1px solid ${accent}80`,
      padding: "20px 16px 18px",
      textAlign: "center",
      background: `linear-gradient(150deg, ${accent}30 0%, ${accent}0f 40%, #0c0c0f 76%, #0a0a0c 100%)`,
      boxShadow: "0 26px 60px rgba(0,0,0,.7)",
      transform: up ? "scale(1)" : "scale(.93)",
      transition: "transform 190ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.07) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 70%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: TRS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: accent
    }
  }, all ? "LEAVE EVERY TABLE?" : "LEAVE THE TABLE?"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 9,
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".14em",
      color: "#fff",
      textWrap: "pretty"
    }
  }, all ? count + " OPEN TABLES" : name), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 11,
      fontFamily: TRS_SANS,
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.5,
      color: "#D8D8DF",
      textWrap: "pretty"
    }
  }, all ? "Every seat you hold is given up and all stacks are cashed out at once." : "Keep your seat and pop back to the lobby, or leave the table and cash out."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 16,
      display: "flex",
      flexDirection: "column",
      gap: 9,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLobby,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 13px",
      borderRadius: 14,
      cursor: "pointer",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.16)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "rgba(91,217,106,.14)",
      border: "1px solid rgba(91,217,106,.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".12em",
      color: "#fff"
    }
  }, "BACK TO LOBBY"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: TRS_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      lineHeight: 1.35,
      color: "#A9A9B2",
      textWrap: "pretty",
      overflowWrap: "anywhere"
    }
  }, all ? "Every seat is kept · tables stay open" : "Your seat is kept · table stays open")), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.35)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: onLeave,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 13px",
      borderRadius: 14,
      cursor: "pointer",
      background: `${accent}1f`,
      border: `1px solid ${accent}66`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 12,
      background: `${accent}2b`,
      border: `1px solid ${accent}80`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
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
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".12em",
      color: "#fff"
    }
  }, all ? "LEAVE ALL TABLES" : "LEAVE TABLE"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: TRS_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      lineHeight: 1.35,
      color: "#D8D8DF",
      textWrap: "pretty",
      overflowWrap: "anywhere"
    }
  }, all ? "Give up every seat & cash out" : "Give up the seat & cash out your stack")), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.5)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: {
      position: "relative",
      width: "100%",
      marginTop: 14,
      padding: "12px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.14)",
      color: "#D8D8DF",
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".16em"
    }
  }, "STAY AT THE TABLE")));
}

// ── table-action icons — plain, instantly readable, one 24-grid family ─────
function TrsIcon({
  kind,
  size = 22,
  color = "#fff",
  sw
}) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: sw || 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      display: "block"
    }
  };
  switch (kind) {
    case "exit":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17 8.5l3.5 3.5L17 15.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20.5 12H10"
      }));
    case "sitout":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "8.6"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "9",
        y: "8",
        width: "2.2",
        height: "8",
        rx: "1",
        fill: color,
        stroke: "none"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "12.8",
        y: "8",
        width: "2.2",
        height: "8",
        rx: "1",
        fill: color,
        stroke: "none"
      }));
    case "switch":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M4 8.6h13.4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14.6 5.6l3 3-3 3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20 15.4H6.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9.4 12.4l-3 3 3 3"
      }));
    case "board":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M8 4h8v3.4a4 4 0 0 1-8 0z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 5.4H5.6a2.4 2.4 0 0 0 2.4 4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 5.4h2.4a2.4 2.4 0 0 1-2.4 4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 11.4V15"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8.8 20h6.4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9.8 15h4.4l.8 5H9z"
      }));
    case "chips":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("ellipse", {
        cx: "10.4",
        cy: "8.4",
        rx: "6",
        ry: "2.8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4.4 8.4v7.2c0 1.55 2.69 2.8 6 2.8s6-1.25 6-2.8V8.4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4.4 12c0 1.55 2.69 2.8 6 2.8s6-1.25 6-2.8"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M19.4 14v5.2M16.8 16.6H22"
      }));
    case "chipAdd":
      return /*#__PURE__*/React.createElement("svg", _extends({}, p, {
        strokeWidth: 2
      }), /*#__PURE__*/React.createElement("ellipse", {
        cx: "9.4",
        cy: "7.6",
        rx: "5.9",
        ry: "2.7"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3.5 7.6v8.8c0 1.6 2.64 2.9 5.9 2.9s5.9-1.3 5.9-2.9V7.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3.5 12c0 1.6 2.64 2.9 5.9 2.9s5.9-1.3 5.9-2.9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M19.3 12.6v6.2M16.2 15.7h6.2",
        strokeWidth: "2.3"
      }));
    case "history":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M3.6 12a8.4 8.4 0 1 0 2.6-6.1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3.4 4.4v4.2h4.2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 8.2V12l3 1.8"
      }));
    case "chat":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M4 6.4A2.4 2.4 0 0 1 6.4 4h11.2A2.4 2.4 0 0 1 20 6.4v7.2a2.4 2.4 0 0 1-2.4 2.4H9.2L4 20z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7.8 9.2h8.4M7.8 12.2h5.2"
      }));
    case "help":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "8.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9.5 9.4A2.6 2.6 0 0 1 12 7.2a2.5 2.5 0 0 1 1.1 4.7c-.7.4-1.1 1-1.1 1.8v.4"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "17",
        r: ".95",
        fill: color,
        stroke: "none"
      }));
    case "lobby":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M4 10.6L12 4.4l8 6.2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6.4 9.6V19h11.2V9.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10.2 19v-5.2h3.6V19"
      }));
    case "sitoutAll":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "9",
        r: "5.6",
        opacity: ".5"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "14.6",
        cy: "14.6",
        r: "6.6"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "12.5",
        y: "11.6",
        width: "1.7",
        height: "6",
        rx: ".85",
        fill: color,
        stroke: "none"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "15.2",
        y: "11.6",
        width: "1.7",
        height: "6",
        rx: ".85",
        fill: color,
        stroke: "none"
      }));
    case "exitAll":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M11 3.4H7A1.8 1.8 0 0 0 5.2 5.2v13.6A1.8 1.8 0 0 0 7 20.6h4",
        opacity: ".5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14.6 6.6h-3a1.8 1.8 0 0 0-1.8 1.8v9.4a1.8 1.8 0 0 0 1.8 1.8h3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17.4 9.6l3.4 3.4-3.4 3.4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M20.8 13H12"
      }));
    case "gear":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3.1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2.6v2.4M12 19v2.4M4.4 12H2M22 12h-2.4M6.6 6.6L4.9 4.9M19.1 19.1l-1.7-1.7M17.4 6.6l1.7-1.7M4.9 19.1l1.7-1.7"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "7.4"
      }));
  }
  return null;
}

// ── swipe-up table menu — variant 06: actions grid + tools + EXIT ─────────
function TrsActionSheet({
  open,
  accent,
  onClose,
  onExit,
  onBoard
}) {
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setUp(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const ACTIONS = [{
    id: "sitout",
    label: "SITTING OUT",
    icon: "sitout"
  }, {
    id: "switch",
    label: "SWITCH TABLE",
    icon: "switch"
  }, {
    id: "board",
    label: "LEADERBOARD",
    icon: "board",
    tap: onBoard
  }, {
    id: "chips",
    label: "ADD CHIPS",
    icon: "chips"
  }];
  const TOOLS = ["history", "chat", "help", "gear"];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 70,
      display: "flex",
      alignItems: "flex-end",
      background: "rgba(0,0,0,.6)",
      backdropFilter: "blur(4px)",
      WebkitBackdropFilter: "blur(4px)",
      opacity: up ? 1 : 0,
      transition: "opacity 180ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: "10px 14px 22px",
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      background: "linear-gradient(180deg, #131317, #0a0a0c)",
      borderTop: `1px solid ${accent}55`,
      boxShadow: "0 -14px 40px rgba(0,0,0,.7)",
      transform: up ? "translateY(0)" : "translateY(24px)",
      transition: "transform 200ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 46,
      height: 4,
      borderRadius: 3,
      background: "rgba(255,255,255,.26)",
      margin: "0 auto 13px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 7
    }
  }, ACTIONS.map(a2 => /*#__PURE__*/React.createElement("button", {
    key: a2.id,
    onClick: () => {
      if (window.playClick) window.playClick(1200, .04);
      if (a2.tap) a2.tap();else onClose();
    },
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
      padding: "13px 4px 12px",
      borderRadius: 14,
      cursor: "pointer",
      background: "rgba(255,255,255,.055)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement(TrsIcon, {
    kind: a2.icon,
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TRS_SANS,
      fontWeight: 700,
      fontSize: 8.5,
      letterSpacing: ".08em",
      color: "#D8D8DF",
      textAlign: "center",
      lineHeight: 1.25
    }
  }, a2.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 9
    }
  }, TOOLS.map(k => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: onClose,
    style: {
      flex: 1,
      height: 42,
      borderRadius: 12,
      cursor: "pointer",
      background: "rgba(255,255,255,.055)",
      border: "1px solid rgba(255,255,255,.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(TrsIcon, {
    kind: k,
    size: 19,
    color: "rgba(255,255,255,.75)"
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, .04);
      onExit();
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      marginTop: 10,
      padding: "14px 0",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: "#D71921",
      color: "#fff",
      boxShadow: "0 10px 24px rgba(215,25,33,.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".16em"
    }
  }, /*#__PURE__*/React.createElement(TrsIcon, {
    kind: "exit",
    size: 18
  }), "EXIT TABLE")));
}

// ── live top bar ─────────────────────────────────────────────────────────
// Row 1: back + the open tables' hand pills, all the same width.
// Row 2: hand history and the ⋮ menu, right-aligned under the pills.
// four distinct six-card hands; a discipline with fewer cards takes the prefix
const TRS_DEMO_HANDS = [[{
  r: "A",
  s: "spade"
}, {
  r: "K",
  s: "heart"
}, {
  r: "Q",
  s: "diamond"
}, {
  r: "J",
  s: "club"
}, {
  r: "9",
  s: "heart"
}, {
  r: "8",
  s: "spade"
}], [{
  r: "K",
  s: "club"
}, {
  r: "T",
  s: "diamond"
}, {
  r: "7",
  s: "spade"
}, {
  r: "6",
  s: "heart"
}, {
  r: "4",
  s: "club"
}, {
  r: "2",
  s: "diamond"
}], [{
  r: "Q",
  s: "heart"
}, {
  r: "9",
  s: "spade"
}, {
  r: "8",
  s: "club"
}, {
  r: "5",
  s: "diamond"
}, {
  r: "3",
  s: "heart"
}, {
  r: "2",
  s: "spade"
}], [{
  r: "J",
  s: "diamond"
}, {
  r: "T",
  s: "heart"
}, {
  r: "6",
  s: "club"
}, {
  r: "5",
  s: "spade"
}, {
  r: "4",
  s: "diamond"
}, {
  r: "3",
  s: "club"
}]];
// the open tables, exactly as HOME draws them: shared TableBubble, discipline
// colour per table, the outline as the decision clock
const TRS_DEMO_DISCS = ["HOLD'EM", "PLO", "PLO5", "PLO6"];
// C3 (UX-аудит 07.09): стани з'єднання. Патерн — спливаючий пілз-банер
// угорі стола (вердикт Саші), у стилі решти пілзів: коло-іконка, підпис,
// колір за важливістю. Зникає сам, щойно зв'язок відновився.
const TRS_NET = {
  weak: {
    c: "#E0A84A",
    label: "WEAK CONNECTION",
    sub: "Reconnecting\u2026 your seat is held"
  },
  lost: {
    c: "#E5484D",
    label: "CONNECTION LOST",
    sub: "Cards fold at the timebank end"
  },
  back: {
    c: "#5BD96A",
    label: "BACK ONLINE",
    sub: "You did not miss a hand"
  },
  opponent: {
    c: "#8A8A93",
    label: "OPPONENT RECONNECTING",
    sub: "ripe_sna \u00b7 timebank running"
  },
  manyTables: {
    c: "#E0A84A",
    label: "4 TABLES OPEN",
    sub: "Adding more may slow your device"
  },
  offline: {
    c: "#E5484D",
    label: "NO CONNECTION",
    sub: "Action cannot be sent \u2014 waiting for network"
  }
};
function TrsNetBanner({
  state
}) {
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    if (!state) {
      setUp(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [state]);
  const d = state ? TRS_NET[state] : null;
  if (!d) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      pointerEvents: "auto",
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      maxWidth: "100%",
      padding: "7px 14px 7px 10px",
      borderRadius: 125,
      background: "rgba(10,10,12,.92)",
      border: `1px solid ${d.c}80`,
      boxShadow: `0 8px 22px rgba(0,0,0,.6), 0 0 16px ${d.c}33`,
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      opacity: up ? 1 : 0,
      transform: up ? "translateY(0)" : "translateY(-6px)",
      transition: "opacity 200ms, transform 220ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: `${d.c}22`,
      border: `1px solid ${d.c}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: d.c,
      animation: state === "back" ? "none" : "nav-breathe 1.2s ease-in-out infinite"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: d.c,
      whiteSpace: "nowrap"
    }
  }, d.label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TRS_SANS,
      fontWeight: 600,
      fontSize: 9.5,
      color: "#A9A9B2",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, d.sub))));
}

// п.9: після натискання «Сменить стол» гравець має бачити, що станеться
// далі — банер тримається до кінця роздачі і сам зникає після пересадки.
// ── чат за столом ─────────────────────────────────────────────────────────
// Вхід — язичок біля правого краю столу: тап або потяг ліворуч відкриває
// шухляду. Стиль той самий, що в решті апки: моно-шапка, темні бульбашки,
// свої репліки акцентом, поле-капсула і кругла кнопка відправки.
const TRS_CHAT_AV = k => (window.CHAT_AV || {})[k] || "assets/chat/" + k + ".webp";
const TRS_CHAT_SEED = [{
  n: "FtManonn",
  av: "yanu",
  m: "nice hand!"
}, {
  n: "LoloS2",
  av: "girl",
  m: "ty :)"
}, {
  n: "SASHA02",
  av: "sponge",
  m: "gg wp",
  you: true
}, {
  n: "FtManonn",
  av: "drebin",
  m: "rematch?"
}];
function TrsChat({
  open,
  accent,
  onClose
}) {
  const [msgs, setMsgs] = React.useState(TRS_CHAT_SEED);
  const [text, setText] = React.useState("");
  const listRef = React.useRef(null);
  React.useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, msgs]);
  const send = () => {
    const t = text.trim();
    if (!t) return;
    if (window.playClick) window.playClick(1300, .04);
    setMsgs(a => a.concat([{
      n: "SASHA02",
      av: "sponge",
      m: t,
      you: true
    }]));
    setText("");
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 24,
      background: "rgba(0,0,0,.5)",
      opacity: open ? 1 : 0,
      pointerEvents: open ? "auto" : "none",
      transition: "opacity 260ms ease"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      width: 300,
      maxWidth: "84%",
      zIndex: 25,
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform 320ms cubic-bezier(.2,.8,.2,1)",
      background: "rgba(12,12,15,.985)",
      borderLeft: `1px solid ${accent}66`,
      boxShadow: "-14px 0 40px rgba(0,0,0,.65)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 58,
      paddingLeft: 16,
      paddingRight: 12,
      paddingBottom: 12,
      display: "flex",
      alignItems: "center",
      gap: 10,
      borderBottom: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "TABLE CHAT"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Close chat",
    style: {
      flex: "none",
      width: 32,
      height: 32,
      borderRadius: 12,
      cursor: "pointer",
      padding: 0,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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
    d: "M18 6L6 18M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    ref: listRef,
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "12px 14px",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, msgs.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      alignSelf: r.you ? "flex-end" : "flex-start",
      maxWidth: "86%",
      display: "flex",
      flexDirection: r.you ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: r.you ? "assets/avatar.png" : TRS_CHAT_AV(r.av),
    alt: "",
    style: {
      width: 26,
      height: 26,
      flex: "none",
      borderRadius: "50%",
      objectFit: "cover"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, !r.you && /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      display: "block",
      fontFamily: TRS_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".1em",
      color: "#8A8A93",
      marginBottom: 3,
      paddingLeft: 4
    }
  }, r.n), /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      display: "block",
      fontFamily: TRS_SANS,
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.4,
      color: "#fff",
      padding: "7px 12px",
      background: r.you ? accent : "rgba(255,255,255,.07)",
      border: r.you ? "none" : "1px solid rgba(255,255,255,.1)",
      borderRadius: r.you ? "14px 14px 4px 14px" : "14px 14px 14px 4px"
    }
  }, r.m))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 14px 22px",
      borderTop: "1px solid rgba(255,255,255,.1)",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") send();
    },
    placeholder: "Message\u2026",
    style: {
      flex: 1,
      minWidth: 0,
      height: 40,
      boxSizing: "border-box",
      padding: "0 14px",
      borderRadius: 125,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.16)",
      outline: "none",
      fontFamily: TRS_SANS,
      fontWeight: 600,
      fontSize: 12,
      color: "#fff"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: send,
    "aria-label": "Send",
    style: {
      flex: "none",
      width: 40,
      height: 40,
      borderRadius: "50%",
      cursor: "pointer",
      padding: 0,
      background: accent,
      border: 0,
      boxShadow: `0 6px 16px ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "17",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
  }))))));
}

// язичок біля правого краю — єдиний вхід у чат, тап або свайп ліворуч
function TrsChatTab({
  onOpen,
  accent,
  hidden
}) {
  const start = React.useRef(null);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1250, .04);
      onOpen();
    },
    onTouchStart: e => {
      start.current = e.touches[0].clientX;
    },
    onTouchEnd: e => {
      const x0 = start.current;
      start.current = null;
      if (x0 != null && x0 - e.changedTouches[0].clientX > 24) onOpen();
    },
    "aria-label": "Table chat",
    style: {
      position: "absolute",
      right: 0,
      top: "46%",
      zIndex: 12,
      width: 26,
      height: 56,
      borderRadius: "14px 0 0 14px",
      cursor: "pointer",
      padding: 0,
      background: "rgba(12,12,15,.9)",
      border: "1px solid rgba(255,255,255,.16)",
      borderRight: 0,
      borderLeftColor: `${accent}80`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity: hidden ? 0 : 1,
      pointerEvents: hidden ? "none" : "auto",
      transition: "opacity 200ms",
      boxShadow: "-6px 0 16px rgba(0,0,0,.5)",
      touchAction: "none"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#e6e6ea",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6.4A2.4 2.4 0 0 1 6.4 4h11.2A2.4 2.4 0 0 1 20 6.4v7.2a2.4 2.4 0 0 1-2.4 2.4H9.2L4 20z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.8 9.2h8.4M7.8 12.2h5.2"
  })));
}
function TrsChangeBanner({
  on,
  accent,
  onDone
}) {
  const [phase, setPhase] = React.useState(null); // "wait" | "done"
  React.useEffect(() => {
    if (!on) {
      setPhase(null);
      return;
    }
    setPhase("wait");
    const t1 = setTimeout(() => setPhase("done"), 4200);
    const t2 = setTimeout(() => {
      setPhase(null);
      onDone && onDone();
    }, 6600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [on]);
  if (!phase) return null;
  const done = phase === "done";
  const c = done ? "#5BD96A" : accent;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      maxWidth: "86%",
      padding: "8px 14px 8px 10px",
      borderRadius: 125,
      background: "rgba(10,10,12,.94)",
      border: `1px solid ${c}80`,
      boxShadow: `0 8px 22px rgba(0,0,0,.6), 0 0 16px ${c}33`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: `${c}22`,
      border: `1px solid ${c}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, done ? /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: "3.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: c,
      animation: "pp-pulse 1.4s ease-in-out infinite"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TRS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      textTransform: "uppercase",
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, done ? "Moved to a new table" : "Changing table after this hand")));
}
const PILL_W = 82,
  PILL_H = 36,
  PILL_GAP = 5;
function TrsTopBar({
  hands,
  color,
  onBack,
  backOpen,
  disc,
  onChips,
  onHistory,
  onAddTable,
  net,
  changing,
  onChangeDone
}) {
  // Скільки місця лишається між «меню» і «+» — стільки й займають пілзи.
  // Зменшуємо їх ЦІЛКОМ (transform: scale), тому співвідношення сторін,
  // радіуси, кеглі й обводка-таймер лишаються такими самими, як у лобі.
  const stripRef = React.useRef(null);
  const [k, setK] = React.useState(1);
  // кнопка другого ряду: тільки іконка, той самий габарит, що в «назад»
  const mini = (kind, label, onTap) => /*#__PURE__*/React.createElement("button", {
    onClick: onTap,
    "aria-label": label,
    style: {
      pointerEvents: "auto",
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      cursor: "pointer",
      padding: 0,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(TrsIcon, {
    kind: kind,
    size: 16,
    color: "#e6e6ea",
    sw: 2
  }));
  const Bubble = window.TableBubble;
  const nTables = (hands || []).length || 1;
  React.useLayoutEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    const fit = () => {
      const w = el.clientWidth;
      if (!w) return;
      const need = nTables * PILL_W + (nTables - 1) * PILL_GAP;
      setK(Math.min(1, Math.max(0.5, Math.round(w / need * 1000) / 1000)));
    };
    fit();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    if (ro) ro.observe(el);else window.addEventListener("resize", fit);
    return () => {
      if (ro) ro.disconnect();else window.removeEventListener("resize", fit);
    };
  }, [nTables]);
  const tables = (hands || []).map((h, i) => ({
    id: "trs" + i,
    hand: h,
    disc: i === 0 ? disc || TRS_DEMO_DISCS[0] : TRS_DEMO_DISCS[i % TRS_DEMO_DISCS.length],
    secs: [9, 15, 6, 18][i % 4],
    max: [15, 20, 20, 20][i % 4]
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 8,
      padding: "58px 12px 0",
      display: "flex",
      flexDirection: "column",
      gap: 8,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    "aria-label": "Table menu",
    style: {
      pointerEvents: "auto",
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      cursor: "pointer",
      padding: 0,
      background: backOpen ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.07)",
      border: `1px solid ${backOpen ? "rgba(255,255,255,.3)" : "rgba(255,255,255,.16)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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
    ref: stripRef,
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: PILL_GAP,
      pointerEvents: "auto"
    }
  }, Bubble ? tables.map((tb, i) => /*#__PURE__*/React.createElement("span", {
    key: tb.id,
    style: {
      flex: "none",
      width: Math.round(PILL_W * k),
      height: Math.round(PILL_H * k),
      opacity: i === 0 ? 1 : 0.55,
      transition: "opacity .2s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      width: PILL_W,
      height: PILL_H,
      transform: `scale(${k})`,
      transformOrigin: "top left"
    }
  }, /*#__PURE__*/React.createElement(Bubble, {
    t: tb,
    active: i === 0,
    onTap: () => {}
  })))) : null), onAddTable ? /*#__PURE__*/React.createElement("button", {
    onClick: onAddTable,
    "aria-label": "Add table",
    style: {
      pointerEvents: "auto",
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      cursor: "pointer",
      padding: 0,
      background: "rgba(255,255,255,.07)",
      border: "1px dashed rgba(255,255,255,.28)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#cfcfd6",
    strokeWidth: "2.6",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  }))) : null), /*#__PURE__*/React.createElement(TrsNetBanner, {
    state: net
  }), /*#__PURE__*/React.createElement(TrsChangeBanner, {
    on: changing,
    accent: color,
    onDone: onChangeDone
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      pointerEvents: "none"
    }
  }, onChips ? mini("chipAdd", "ADD CHIPS", onChips) : /*#__PURE__*/React.createElement("span", null), mini("history", "HISTORY", onHistory)));
}

// ── BACK opens one full-screen menu: the table actions first, the secondary
// tools (hand history, chips, leaderboard, settings) demoted underneath ──
function TrsTableMenu({
  open,
  accent,
  name,
  stack = "$9 999",
  tablesCount = 4,
  watchers = 0,
  cash = true,
  onClose,
  onSitOut,
  onSitOutAll,
  onLobby,
  onLeave,
  onLeaveAll,
  onHistory,
  onChips,
  onChangeTable,
  onBoard,
  onSettings,
  onDeposit
}) {
  // Меню перебудовано за правками СЕО:
  //  1. Головна дія — «ВЕРНУТЬСЯ К ИГРЕ», перша й найбільша (найчастіший вихід).
  //  2. Порядок за частотою: згорнути → пауза → вийти. Масові дії заховані
  //     в один рядок «Всі столи (N)», бо потрібні раз на сесію.
  //  3. Сума на кнопці виходу. Підтвердження лишилось тільки у «вийти зі
  //     всіх» — це єдина незворотна дія.
  //  4. Підписи відповідають на питання гравця («за вас скидають карти,
  //     фішки залишаються»), а не описують механіку.
  //  5. «Докупити фішки» — помітна дія в основному блоці, «Поповнити
  //     баланс» — рядок унизу (раніше було навпаки).
  const [up, setUp] = React.useState(false);
  const [allOpen, setAllOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setUp(false);
      setAllOpen(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const row = (kind, label, note, onTap, opts = {}) => /*#__PURE__*/React.createElement("button", {
    onClick: onTap,
    style: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 14px",
      borderRadius: 16,
      cursor: "pointer",
      textAlign: "left",
      background: opts.red ? "linear-gradient(152deg,#2b0d10 0%,#180a0c 58%,#100708 100%)" : "linear-gradient(150deg,#17171c 0%,#111116 60%,#0d0d10 100%)",
      border: opts.red ? "1px solid #6b1a1f" : "1px solid #26262e"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 34,
      height: 34,
      borderRadius: 12,
      background: opts.red ? "#3a0f13" : "#1d1d24",
      border: opts.red ? "1px solid #7c2126" : "1px solid #2e2e38",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(TrsIcon, {
    kind: kind,
    size: 17,
    color: opts.red ? "#F0555C" : "#fff"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".08em",
      color: opts.red ? "#F0555C" : "#fff"
    }
  }, label), note ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: TRS_SANS,
      fontWeight: 600,
      fontSize: 11,
      color: "#9a9aa4",
      lineHeight: 1.3
    }
  }, note) : null), opts.chevron ? /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#8a8a93",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none",
      transform: opts.openState ? "rotate(90deg)" : "none",
      transition: "transform 160ms"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })) : null);
  const tool = (kind, label, onTap) => /*#__PURE__*/React.createElement("button", {
    onClick: onTap,
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
      padding: "12px 6px",
      borderRadius: 14,
      cursor: "pointer",
      background: "#121216",
      border: "1px solid #23232b"
    }
  }, /*#__PURE__*/React.createElement(TrsIcon, {
    kind: kind,
    size: 18,
    color: "#e6e6ea"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TRS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      color: "#9a9aa4",
      textAlign: "center",
      lineHeight: 1.25,
      whiteSpace: "pre-line",
      minHeight: 25,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, label));
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 140,
      background: "#08080a",
      opacity: up ? 1 : 0,
      transition: "opacity 180ms",
      display: "flex",
      flexDirection: "column",
      padding: "58px 14px 26px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      transform: up ? "translateY(0)" : "translateY(-8px)",
      transition: "transform 220ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".1em",
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, name, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#5BD96A"
    }
  }, "YOUR STACK ", stack)), /*#__PURE__*/React.createElement("span", {
    title: "Watching",
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 24,
      padding: "0 9px",
      borderRadius: 125,
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.14)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#A9A9B2",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "2.9"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      fontVariantNumeric: "tabular-nums"
    }
  }, watchers))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginTop: 20,
      width: "100%",
      padding: "17px 0",
      borderRadius: 16,
      cursor: "pointer",
      background: "#17925a",
      border: 0,
      boxShadow: "0 12px 28px #17925a55",
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".12em",
      color: "#fff"
    }
  }, "RETURN TO GAME"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, row("lobby", "TO LOBBY", "Cards fold for you, seat & chips stay", onLobby), row("sitout", "PAUSE", "Seat held for 10 minutes, blinds are not posted", onSitOut), cash && row("chips", "ADD CHIPS", "Top up your stack from balance", onChips), row("switch", "CHANGE TABLE", "After this hand \u2014 same game, same limit", onChangeTable), row("exit", "LEAVE & TAKE " + stack, "Stack returns to balance", onLeave, {
    red: true
  }), row("board", "ALL TABLES (" + tablesCount + ")", null, () => setAllOpen(v => !v), {
    chevron: true,
    openState: allOpen
  }), allOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9,
      paddingLeft: 12
    }
  }, row("sitoutAll", "SIT OUT — ALL TABLES", "Skip hands everywhere you are seated", onSitOutAll), row("exitAll", "LEAVE ALL TABLES", "Every seat you hold, with confirmation", onLeaveAll, {
    red: true
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: TRS_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".22em",
      color: "#8a8a93",
      marginBottom: 9
    }
  }, "MORE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8
    }
  }, tool("history", "HAND\nHISTORY", onHistory), tool("board", "LEADERBOARD", onBoard), tool("gear", "TABLE\nSETTINGS", onSettings))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onDeposit,
    style: {
      width: "100%",
      padding: "13px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "transparent",
      border: "1px solid rgba(255,255,255,.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#cfcfd6",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".12em",
      color: "#cfcfd6"
    }
  }, "TOP UP BALANCE"))));
}

// shared dropdown shell — anchored to the bar, never a bottom sheet
function TrsDropdown({
  open,
  onClose,
  side = "left",
  top = 100,
  width = 226,
  children
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "absolute",
      top,
      [side]: 12,
      width,
      borderRadius: 16,
      padding: "5px 4px",
      background: "rgba(16,16,20,.99)",
      border: "1px solid rgba(255,255,255,.12)",
      boxShadow: "0 18px 44px rgba(0,0,0,.7)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -6,
      [side]: 14,
      width: 12,
      height: 12,
      background: "rgba(16,16,20,.99)",
      borderLeft: "1px solid rgba(255,255,255,.12)",
      borderTop: "1px solid rgba(255,255,255,.12)",
      transform: "rotate(45deg)"
    }
  }), children));
}
function TrsMenuRow({
  icon,
  label,
  note,
  tone,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "10px 12px",
      cursor: "pointer",
      borderRadius: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 30,
      height: 30,
      borderRadius: 12,
      background: tone ? `${tone}1f` : "rgba(255,255,255,.075)",
      border: `1px solid ${tone ? tone + "55" : "rgba(255,255,255,.16)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, icon), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: TRS_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".06em",
      color: tone || "#fff"
    }
  }, label), note ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 2,
      fontFamily: TRS_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, note) : null));
}
const trsStakeNums = s => {
  const parts = String(s || "").split("/").map(x => x.replace(/[^0-9.]/g, "")).filter(Boolean);
  return parts.length === 2 ? parts.join("/") : "1/2";
};

// ── the screen ─────────────────────────────────────────────────────────────
// Стіл тимчасово закритий для тесту: будь-яка спроба сісти показує
// пояснення і повертає гравця назад. Знімається одним прапорцем.
const TRS_TABLE_LOCKED = false; // v3: усі розділи відкриті

function PokerTableRefScreen({
  open,
  table,
  discipline,
  onClose,
  onBack
}) {
  const host = React.useRef(null);
  // ── замок стола ────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!open || !TRS_TABLE_LOCKED) return;
    if (window.playClick) window.playClick(700, .04);
    if (window.showScreenInfo) window.showScreenInfo({
      kicker: "TABLE",
      title: "TABLE IS NOT READY YET",
      body: "Work on the table is not finished yet. It opens in one of the next builds.",
      accent: "#D71921",
      noLink: true
    });
    const t = setTimeout(() => {
      (onBack || onClose || (() => {}))();
    }, 60);
    return () => clearTimeout(t);
  }, [open]);
  const [w, setW] = React.useState(402);
  const [ask, setAsk] = React.useState(false);
  const [menu, setMenu] = React.useState(false);
  const [backMenu, setBackMenu] = React.useState(false);
  const [hist, setHist] = React.useState(false);
  const [askAll, setAskAll] = React.useState(false);
  const [chips, setChips] = React.useState(false);
  const [settings, setSettings] = React.useState(false);
  const [board, setBoard] = React.useState(false);
  // C3: стани зв'язку. У прототипі прокручуються по колу, щоб кожен стан
  // можна було побачити; у продукті керується реальним конектом.
  const [net, setNet] = React.useState(null);
  const [who, setWho] = React.useState(null); // п.6: профіль гравця по тапу
  // п.10: наглядачі — живе число, повільно дихає
  const [watchers, setWatchers] = React.useState(() => 3 + Math.floor(Math.random() * 9));
  React.useEffect(() => {
    const iv = setInterval(() => setWatchers(n => Math.max(0, n + (Math.random() < .5 ? -1 : 1))), 9000);
    return () => clearInterval(iv);
  }, []);
  // п.9: зміна стола — черга до кінця поточної роздачі
  const [changing, setChanging] = React.useState(false);
  const [tableNo, setTableNo] = React.useState(() => 10 + Math.floor(Math.random() * 80));
  // п.8: «+» у смузі столів — посадка за такий самий стіл
  const [newTable, setNewTable] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false); // чат за столом
  const [ranks, setRanks] = React.useState(null); // правка 6: довідка комбінацій
  const touch = React.useRef(null);
  React.useEffect(() => {
    if (!open) {
      setAsk(false);
      setAskAll(false);
      setMenu(false);
      setBackMenu(false);
      setHist(false);
      setChips(false);
      setSettings(false);
      setBoard(false);
      setNet(null);
      setWho(null);
      return;
    }
    const measure = () => {
      if (host.current) setW(host.current.clientWidth || 402);
    };
    measure();
    window.addEventListener("resize", measure);
    // демо-цикл станів зв'язку: показуємо кожен по кілька секунд
    const SEQ = [null, "opponent", null, "weak", "lost", "back", null, "manyTables", null, "offline", "back"];
    let i = 0;
    const tick = setInterval(() => {
      i = (i + 1) % SEQ.length;
      setNet(SEQ[i]);
    }, 4200);
    return () => {
      window.removeEventListener("resize", measure);
      clearInterval(tick);
    };
  }, [open]);
  if (!open || TRS_TABLE_LOCKED) return null;
  const disc = trsDisc(discipline || table && table.disc, table);
  const cfg = (window.TR_DISC || {})[disc];
  const sizes = cfg ? cfg.sizes : [6];
  const want = table && table.max || sizes[sizes.length - 1];
  const max = window.TR_SEATS && window.TR_SEATS[want] && sizes.indexOf(want) >= 0 ? want : sizes[sizes.length - 1];
  const accent = cfg && cfg.accent || "#D71921";
  // E14 (UX-аудит 07.09): докупка фішок можлива лише в кеші — у турнірах
  // і Spin & Win стек не поповнюється, тож кнопки там бути не повинно.
  const isCash = !(table && table.tourney) && disc !== "SPIN & WIN";
  const K = w / 640;
  // the open tables' hands — this table first, then the rest of the demo set
  const trsHands = (() => {
    const n = cfg && cfg.hand || 2;
    return TRS_DEMO_HANDS.map(h => h.slice(0, n));
  })();
  const leave = () => {
    setAsk(false);
    setAskAll(false);
    (onClose || onBack || (() => {}))();
  };
  const toLobby = () => {
    setAsk(false);
    (onBack || onClose || (() => {}))();
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: host,
    onTouchStart: e => {
      const t = e.touches[0];
      touch.current = {
        y: t.clientY,
        x: t.clientX,
        t: Date.now()
      };
    },
    onTouchEnd: e => {
      const s = touch.current;
      touch.current = null;
      if (!s || menu || ask) return;
      const t = e.changedTouches[0];
      const dy = s.y - t.clientY,
        dx = Math.abs(s.x - t.clientX);
      if (dy > 60 && dx < 70 && Date.now() - s.t < 700) {
        if (window.playClick) window.playClick(1300, .04);
        setBackMenu(true);
      }
    },
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 200,
      background: "#050506",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      visibility: hist ? "hidden" : "visible"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(window.PokerTableRef, {
    width: w,
    disc: disc,
    max: max,
    stakes: table && table.stake,
    tourney: table && table.tourney,
    onSeatTap: p => setWho(p),
    onBoardTap: d => setRanks(d)
  }), null), /*#__PURE__*/React.createElement(TrsTopBar, {
    hands: trsHands,
    color: accent,
    disc: disc,
    backOpen: backMenu,
    net: net,
    onAddTable: () => {
      if (window.playClick) window.playClick(1250, .04);
      setNewTable(true);
    },
    changing: changing,
    onChangeDone: () => {
      setChanging(false);
      setTableNo(n => 10 + (n + 17) % 80);
    },
    onBack: () => {
      if (window.playClick) window.playClick(900, .04);
      setBackMenu(true);
    },
    onChips: isCash ? () => {
      if (window.playClick) window.playClick(1100, .04);
      setChips(true);
    } : null,
    onHistory: () => {
      if (window.playClick) window.playClick(1100, .04);
      setHist(true);
    }
  }), /*#__PURE__*/React.createElement(TrsTableMenu, {
    open: backMenu,
    accent: accent,
    cash: isCash,
    watchers: watchers,
    name: disc + " " + (table && table.stake || "$1/$2"),
    onClose: () => setBackMenu(false),
    onSitOut: () => {
      setBackMenu(false);
      if (window.playClick) window.playClick(1000, .04);
    },
    onSitOutAll: () => {
      setBackMenu(false);
      if (window.playClick) window.playClick(900, .04);
    },
    onLeaveAll: () => {
      setBackMenu(false);
      setAskAll(true);
    },
    onLobby: () => {
      setBackMenu(false);
      toLobby();
    },
    onLeave: () => {
      setBackMenu(false);
      leave();
    } /* зворотна дія — без підтвердження */,
    onHistory: () => {
      setBackMenu(false);
      setHist(true);
    },
    onChips: () => {
      setBackMenu(false);
      setChips(true);
    },
    onChangeTable: () => {
      setBackMenu(false);
      if (window.playClick) window.playClick(1200, .04);
      setChanging(true);
    },
    onDeposit: () => {
      setBackMenu(false);
      if (window.playClick) window.playClick(1400, .05);
      if (window.openDeposit) window.openDeposit();
    },
    onBoard: () => {
      setBackMenu(false);
      setBoard(true);
    },
    onSettings: () => {
      setBackMenu(false);
      setSettings(true);
    }
  }), chips && window.TbBuyInSheet && /*#__PURE__*/React.createElement(window.TbBuyInSheet, {
    title: "ADD CHIPS",
    disc: disc,
    accent: accent,
    wallets: window.pxWallets ? window.pxWallets() : null,
    stakes: trsStakeNums(table && table.stake || ""),
    defAmount: table && table.buyIn || 0,
    onCancel: () => setChips(false),
    onConfirm: () => setChips(false),
    onDeposit: () => {
      setChips(false);
      if (window.openDeposit) window.openDeposit();
    }
  }), newTable && window.TbBuyInSheet && /*#__PURE__*/React.createElement(window.TbBuyInSheet, {
    title: "NEW TABLE",
    disc: disc,
    accent: accent,
    wallets: window.pxWallets ? window.pxWallets() : null,
    stakes: trsStakeNums(table && table.stake || ""),
    defAmount: table && table.buyIn || 0,
    onCancel: () => setNewTable(false),
    onConfirm: () => setNewTable(false),
    onDeposit: () => {
      setNewTable(false);
      if (window.openDeposit) window.openDeposit();
    }
  }), window.HandRanksSheet && /*#__PURE__*/React.createElement(window.HandRanksSheet, {
    open: !!ranks,
    accent: accent,
    hole: ranks && ranks.hole || [],
    board: ranks && ranks.board || [],
    onClose: () => {
      if (window.playClick) window.playClick(800, .04);
      setRanks(null);
    }
  }), /*#__PURE__*/React.createElement(TrsChatTab, {
    accent: accent,
    hidden: chatOpen || backMenu || hist || settings || board,
    onOpen: () => setChatOpen(true)
  }), /*#__PURE__*/React.createElement(TrsChat, {
    open: chatOpen,
    accent: accent,
    onClose: () => {
      if (window.playClick) window.playClick(800, .04);
      setChatOpen(false);
    }
  }), window.TableSettingsScreen && /*#__PURE__*/React.createElement(window.TableSettingsScreen, {
    open: settings,
    accent: accent,
    onClose: () => setSettings(false)
  }), board && window.CompetitionsScreen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 220,
      background: "#000"
    }
  }, /*#__PURE__*/React.createElement(window.CompetitionsScreen, {
    open: true,
    accent: accent,
    initialRace: "daily",
    preset: {
      disc: window.cpDiscForTable ? window.cpDiscForTable(disc) : disc,
      tier: window.cpTierForStake ? window.cpTierForStake(table && table.stake || "") : "ALL"
    },
    onClose: () => setBoard(false)
  })), hist && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 240,
      visibility: "visible"
    }
  }, window.HandHistoryScreen ? /*#__PURE__*/React.createElement(window.HandHistoryScreen, {
    open: true,
    onClose: () => setHist(false),
    accent: accent
  }) : window.HandReplay ? /*#__PURE__*/React.createElement(window.HandReplay, {
    open: true,
    onClose: () => setHist(false),
    accent: accent,
    discipline: disc,
    stakes: table && table.stake || ""
  }) : null), /*#__PURE__*/React.createElement(TrsLeaveSheet, {
    open: askAll,
    all: true,
    count: trsHands.length,
    accent: "#D71921",
    name: "",
    onCancel: () => setAskAll(false),
    onLobby: () => {
      setAskAll(false);
      toLobby();
    },
    onLeave: leave
  }), window.PlayerCard && /*#__PURE__*/React.createElement(window.PlayerCard, {
    open: !!who,
    accent: accent,
    onClose: () => setWho(null),
    player: who ? Object.assign({}, who, {
      discId: disc === "PLO" || disc === "PLO5" || disc === "PLO6" ? "plo" : disc === "SHORT DECK" ? "short" : disc === "SPIN & WIN" ? "spin" : table && table.tourney ? "mtt" : "holdem",
      limit: table && table.stake || "$0.50 / $1"
    }) : null
  }), /*#__PURE__*/React.createElement(TrsLeaveSheet, {
    open: ask,
    name: table && table.name || disc,
    accent: "#D71921",
    onCancel: () => setAsk(false),
    onLobby: toLobby,
    onLeave: leave
  }));
}
window.PokerTableScreen = PokerTableRefScreen;
Object.assign(window, {
  PokerTableRefScreen,
  TrsLeaveSheet,
  TrsActionSheet,
  TrsIcon
});
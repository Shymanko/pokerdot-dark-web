// rakeback-stats.jsx — Правка 9 (архітектура 09.09).
// Екран статистики рейкбека: вкладки дисциплін, чотири показники,
// динаміка за 7 ігрових днів, історія операцій і «як це працює».

const RS_MONO = UI.font;
const RS_SANS = UI.fontUI;
const RS_DISCS = [["holdem", "HOLD'EM"], ["plo", "PLO"], ["short", "SHORT DECK"]];
function rsData(discId) {
  const base = {
    holdem: 1,
    plo: 0.72,
    short: 0.41
  }[discId] || 1;
  const days = Array.from({
    length: 7
  }, (_, i) => {
    const k = Math.sin((i + 1) * (discId === "plo" ? 2.3 : discId === "short" ? 3.7 : 1.7)) * 0.5 + 0.5;
    return Math.round((40 + k * 260) * base);
  });
  const yesterday = days[days.length - 1];
  return {
    days,
    rbYesterday: (base * 12).toFixed(1) + "%",
    pending: "$" + Math.round(yesterday * 0.38).toLocaleString("en-US").split(",").join(" "),
    rakeYesterday: "$" + yesterday.toLocaleString("en-US").split(",").join(" "),
    rb7: (base * 11.4).toFixed(1) + "%"
  };
}
function RsCard({
  label,
  value,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      padding: "12px 13px",
      borderRadius: 14,
      background: "rgba(255,255,255,.045)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RS_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".12em",
      color: "#8A8A93",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      fontFamily: RS_MONO,
      fontWeight: 700,
      fontSize: 19,
      color: accent,
      marginTop: 7,
      lineHeight: 1
    }
  }, value));
}

// стовпчики за 7 ігрових днів — по кожній дисципліні свій колір
function RsChart({
  accent
}) {
  const sets = RS_DISCS.map(([id]) => rsData(id).days);
  const tone = {
    holdem: "#21C97B",
    plo: "#3B82F6",
    short: "#F0A93C"
  };
  const max = Math.max(...sets.flat(), 1);
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "14px 13px 12px",
      borderRadius: 14,
      background: "rgba(255,255,255,.035)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 9,
      height: 108
    }
  }, days.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: d,
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: "100%",
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      gap: 2,
      height: 90
    }
  }, RS_DISCS.map(([id], k) => /*#__PURE__*/React.createElement("span", {
    key: id,
    style: {
      flex: 1,
      maxWidth: 8,
      height: Math.max(4, Math.round(sets[k][i] / max * 88)),
      borderRadius: 2,
      background: tone[id],
      opacity: .92
    }
  }))), /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      fontFamily: RS_SANS,
      fontWeight: 700,
      fontSize: 8.5,
      letterSpacing: ".06em",
      color: "#6A6A72"
    }
  }, d)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 12,
      paddingTop: 10,
      borderTop: "1px solid rgba(255,255,255,.08)"
    }
  }, RS_DISCS.map(([id, label]) => /*#__PURE__*/React.createElement("span", {
    key: id,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 2,
      background: tone[id]
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RS_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".1em",
      color: "#A9A9B2"
    }
  }, label)))));
}
function RakebackStatsScreen({
  open,
  accent = "#D71921",
  onClose,
  onHistory
}) {
  const [disc, setDisc] = React.useState("holdem");
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    const r = requestAnimationFrame(() => setMounted(true));
    return () => {
      cancelAnimationFrame(r);
      window.dispatchEvent(new CustomEvent("px-full", {
        detail: -1
      }));
    };
  }, [open]);
  if (!open) return null;
  const d = rsData(disc);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 96,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(.2,.8,.2,1)"
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
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 16,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, .04);
      onClose && onClose();
    },
    "aria-label": "Back",
    style: {
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 12,
      cursor: "pointer",
      padding: 0,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
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
    style: {
      flex: 1,
      textAlign: "center",
      marginRight: 36,
      fontFamily: RS_MONO,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".14em",
      color: "#fff"
    }
  }, "RAKEBACK STATS")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 3,
      padding: "6px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 3,
      height: 40,
      boxSizing: "border-box",
      padding: 3,
      borderRadius: 12,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, RS_DISCS.map(([id, label]) => {
    const on = id === disc;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => {
        if (window.playClick) window.playClick(1100, .03);
        setDisc(id);
      },
      style: {
        flex: 1,
        minWidth: 0,
        borderRadius: 8,
        border: 0,
        cursor: "pointer",
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: on ? accent : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        fontFamily: RS_MONO,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em",
        transition: "all 160ms"
      }
    }, label);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "14px 16px 110px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement(RsCard, {
    label: "RAKEBACK YESTERDAY",
    value: d.rbYesterday,
    accent: "#5BD96A"
  }), /*#__PURE__*/React.createElement(RsCard, {
    label: "PENDING",
    value: d.pending,
    accent: "#f0c75e"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9,
      marginTop: 9
    }
  }, /*#__PURE__*/React.createElement(RsCard, {
    label: "RAKE YESTERDAY",
    value: d.rakeYesterday,
    accent: "#fff"
  }), /*#__PURE__*/React.createElement(RsCard, {
    label: "RAKEBACK 7 DAYS",
    value: d.rb7,
    accent: "#5BD96A"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RS_SANS,
      fontWeight: 700,
      fontSize: 10,
      letterSpacing: ".2em",
      color: "#8A8A93",
      margin: "20px 0 9px"
    }
  }, "LAST 7 PLAYING DAYS"), /*#__PURE__*/React.createElement(RsChart, {
    accent: accent
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, .04);
      onHistory && onHistory();
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      marginTop: 12,
      padding: "14px 14px",
      borderRadius: 14,
      cursor: "pointer",
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RS_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".06em",
      color: "#fff"
    }
  }, "OPERATION HISTORY"), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.4)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "13px 14px",
      borderRadius: 14,
      background: `linear-gradient(150deg, ${accent}16, #0c0c0f 62%)`,
      border: `1px solid ${accent}33`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RS_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".08em",
      color: "#fff"
    }
  }, "HOW IT WORKS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RS_SANS,
      fontWeight: 500,
      fontSize: 11.5,
      lineHeight: 1.55,
      color: "#A9A9B2",
      marginTop: 7,
      textWrap: "pretty"
    }
  }, "Rakeback is credited automatically and depends on your level and the rake you have played."), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, .04);
      if (window.showScreenInfo) window.showScreenInfo({
        title: "RAKEBACK",
        accent
      });
    },
    style: {
      marginTop: 10,
      padding: 0,
      background: "none",
      border: 0,
      cursor: "pointer",
      fontFamily: RS_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      color: accent
    }
  }, "MORE \u2192"))));
}
Object.assign(window, {
  RakebackStatsScreen
});
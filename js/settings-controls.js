// Settings — reusable controls (toggle, radio list, segmented, slider, select).
// On-brand dark + red + mono. Used by settings.jsx sub-screens.

const SC_MONO_S = UI.font;
const SC_SANS_S = UI.fontUI;
function SLabel({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SC_SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em",
      margin: "0 0 10px"
    }
  }, children);
}
function SToggle({
  on,
  onToggle,
  accent = "#D71921"
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      onToggle();
    },
    style: {
      width: 50,
      height: 28,
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      padding: 3,
      flex: "none",
      background: on ? accent : "rgba(255,255,255,.16)",
      display: "flex",
      justifyContent: on ? "flex-end" : "flex-start",
      transition: "background 180ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 5px rgba(0,0,0,.4)",
      transition: "all 180ms"
    }
  }));
}

// row with label + a control on the right
function SRow({
  label,
  sub,
  children,
  top
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      padding: "14px 14px",
      borderTop: top ? "1px solid rgba(255,255,255,.085)" : "0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SC_MONO_S,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, label), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SC_SANS_S,
      fontWeight: 500,
      fontSize: 10.5,
      color: "#8A8A93",
      letterSpacing: ".02em",
      marginTop: 4,
      lineHeight: 1.45
    }
  }, sub)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none"
    }
  }, children));
}
function SCard({
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-control-card",
    style: {
      borderRadius: 16,
      overflow: "hidden",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.13)",
      ...style
    }
  }, children);
}

// segmented control (2-3 options) — e.g. BB / SB
function SSegment({
  options,
  value,
  onChange,
  accent = "#D71921"
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dot-segment",
    style: {
      display: "flex",
      gap: 3,
      height: 40,
      boxSizing: "border-box",
      padding: 3,
      borderRadius: 12,
      background: "#14171c",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, options.map(o => {
    const on = o.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.id,
      onClick: () => {
        if (window.playClick) window.playClick(1100, 0.03);
        onChange(o.id);
      },
      style: {
        flex: 1,
        minWidth: 0,
        padding: "0 6px",
        borderRadius: 8,
        border: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        background: on ? accent : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        fontFamily: SC_MONO_S,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em",
        transition: "all 160ms"
      }
    }, o.label);
  }));
}

// vertical radio list (cols=1) or centered chip grid (cols>1)
function SRadioList({
  options,
  value,
  onChange,
  accent = "#D71921",
  cols = 1
}) {
  if (cols > 1) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: 9
      }
    }, options.map(o => {
      const on = o.id === value;
      return /*#__PURE__*/React.createElement("button", {
        key: o.id,
        onClick: () => {
          if (window.playClick) window.playClick(1100, 0.03);
          onChange(o.id);
        },
        style: {
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          minHeight: o.sub ? 64 : 46,
          padding: o.sub ? "12px 12px" : "13px 10px",
          cursor: "pointer",
          textAlign: "center",
          background: on ? `${accent}1c` : "rgba(255,255,255,.065)",
          border: `1px solid ${on ? accent : "rgba(255,255,255,.1)"}`,
          boxShadow: on ? `0 0 0 1px ${accent}, 0 6px 16px ${accent}26` : "none",
          borderRadius: 12,
          transition: "all 140ms"
        }
      }, on && /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 0%, ${accent}26, transparent 65%)`,
          pointerEvents: "none"
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          position: "relative",
          fontFamily: SC_MONO_S,
          fontSize: 13,
          fontWeight: 700,
          color: on ? "#fff" : "rgba(255,255,255,.78)",
          letterSpacing: ".04em"
        }
      }, o.label), o.sub && /*#__PURE__*/React.createElement("span", {
        style: {
          position: "relative",
          fontFamily: SC_SANS_S,
          fontWeight: 500,
          fontSize: 10.5,
          color: "#8A8A93",
          letterSpacing: ".03em",
          lineHeight: 1.4
        }
      }, o.sub));
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "block"
    }
  }, options.map((o, i) => {
    const on = o.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.id,
      onClick: () => {
        if (window.playClick) window.playClick(1100, 0.03);
        onChange(o.id);
      },
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 11,
        width: "100%",
        textAlign: "left",
        padding: "13px 14px",
        cursor: "pointer",
        background: "transparent",
        border: 0,
        borderTop: i === 0 ? "0" : "1px solid rgba(255,255,255,.085)",
        transition: "all 140ms"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 19,
        height: 19,
        borderRadius: "50%",
        flex: "none",
        marginTop: 1,
        border: `2px solid ${on ? accent : "rgba(255,255,255,.25)"}`,
        background: on ? accent : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, on && /*#__PURE__*/React.createElement("svg", {
      width: "10",
      height: "10",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "3.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 6"
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: SC_MONO_S,
        fontSize: 13,
        color: on ? "#fff" : "rgba(255,255,255,.85)",
        letterSpacing: ".03em"
      }
    }, o.label), o.sub && /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: SC_SANS_S,
        fontWeight: 500,
        fontSize: 10.5,
        color: "#8A8A93",
        letterSpacing: ".03em",
        marginTop: 4,
        lineHeight: 1.45
      }
    }, o.sub)));
  }));
}

// slider 0..100 with icons
function SSlider({
  value,
  onChange,
  accent = "#D71921",
  left,
  right
}) {
  const ref = React.useRef(null);
  const drag = clientX => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let p = Math.round((clientX - r.left) / r.width * 100);
    p = Math.max(0, Math.min(100, p));
    if (window.playClick && p !== value) window.playClick(900 + p * 6, 0.02);
    onChange(p);
  };
  const onDown = e => {
    drag(e.touches ? e.touches[0].clientX : e.clientX);
    const move = ev => drag(ev.touches ? ev.touches[0].clientX : ev.clientX);
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, {
      passive: false
    });
    window.addEventListener("touchend", up);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, left, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onMouseDown: onDown,
    onTouchStart: onDown,
    style: {
      flex: 1,
      position: "relative",
      height: 26,
      cursor: "pointer",
      display: "flex",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      height: 5,
      borderRadius: 3,
      background: "rgba(255,255,255,.16)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      height: 5,
      borderRadius: 3,
      width: `${value}%`,
      background: accent
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${value}%`,
      transform: "translateX(-50%)",
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 3px 8px rgba(0,0,0,.45)"
    }
  })), right);
}
Object.assign(window, {
  SC_MONO_S,
  SC_SANS_S,
  SLabel,
  SToggle,
  SRow,
  SCard,
  SSegment,
  SRadioList,
  SSlider
});
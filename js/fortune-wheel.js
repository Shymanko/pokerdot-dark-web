// Fortune Wheel — referral reward wheel. Brand style (Nothing-OS / Pokerdot):
// pure black, Arcanium red + dark segments, white mono type, thin separators.
// Spin is triggered by the CENTER button (like the dock Play button).

const MONO_W = UI.font;
const SANS_W = UI.fontUI;
const WHEEL_PRIZES = [{
  label: "$100K\nGRAND",
  short: "$100 000 GRAND PRIZE",
  grand: true
}, {
  label: "$50\nBONUS",
  short: "$50 Bonus"
}, {
  label: "$215\nTICKET",
  short: "$215 Tournament Ticket"
}, {
  label: "$10\nBONUS",
  short: "$10 Bonus"
}, {
  label: "SPIN&WIN\nTICKET",
  short: "Spin & Win Ticket"
}, {
  label: "$1 000\nCASH",
  short: "$1 000 Cash"
}, {
  label: "MYSTERY\nBOX",
  short: "Mystery Box"
}, {
  label: "THANK\nYOU",
  short: "Thank You"
}];
const SEG = 360 / WHEEL_PRIZES.length;
function FortuneWheel({
  open,
  onClose,
  accent = "#D71921"
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
  const [rot, setRot] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [spinsLeft, setSpinsLeft] = React.useState(3);
  const [result, setResult] = React.useState(null);
  const chosenRef = React.useRef(0);
  const tickRef = React.useRef(0);
  React.useEffect(() => {
    if (!open) {
      setResult(null);
      setSpinning(false);
      return;
    }
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  const scheduleTicks = dur => {
    let t = 0,
      gap = 55;
    const fire = () => {
      if (window.playClick) window.playClick(1700, 0.02);
      gap *= 1.12;
      t += gap;
      if (t < dur) tickRef.current = setTimeout(fire, gap);
    };
    fire();
  };
  const spin = () => {
    if (spinning || spinsLeft <= 0) return;
    if (window.playClick) window.playClick(1300, 0.05);
    const k = Math.floor(Math.random() * WHEEL_PRIZES.length);
    chosenRef.current = k;
    const center = k * SEG + SEG / 2;
    const current = (rot % 360 + 360) % 360;
    const desired = (360 - center) % 360;
    const delta = (desired - current + 360) % 360;
    setSpinning(true);
    setResult(null);
    scheduleTicks(4500);
    setRot(r => r + 360 * 5 + delta);
  };
  const onEnd = () => {
    if (!spinning) return;
    setSpinning(false);
    clearTimeout(tickRef.current);
    setSpinsLeft(n => Math.max(0, n - 1));
    setResult(WHEEL_PRIZES[chosenRef.current]);
    if (window.playClick) {
      window.playClick(1800, 0.05);
      setTimeout(() => window.playClick(2100, 0.06), 110);
    }
  };
  if (!open) return null;
  const canSpin = !spinning && spinsLeft > 0;
  const DEEP = "#9E0E15";

  // two-tone segments: white / deep-red, with thin dark separators
  const stops = WHEEL_PRIZES.map((_, i) => `${i % 2 === 0 ? "#fff" : DEEP} ${i * SEG}deg ${(i + 1) * SEG}deg`).join(", ");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 65,
      background: accent,
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.1) 0.8px, transparent 1.2px)",
      backgroundSize: "22px 22px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "radial-gradient(ellipse 90% 60% at 50% 115%, rgba(0,0,0,.34), transparent 55%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: "rgba(255,255,255,.18)",
      border: 0,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
    d: "M6 6l12 12M18 6L6 18"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_W,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".26em"
    }
  }, "FORTUNE WHEEL"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 20px 70px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_W,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".3em",
      marginBottom: 24
    }
  }, "SPIN TO WIN"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 308,
      height: 308
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -2,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 7,
      width: 0,
      height: 0,
      borderLeft: "11px solid transparent",
      borderRight: "11px solid transparent",
      borderTop: "20px solid #fff",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,.4))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 24px 60px rgba(0,0,0,.4), inset 0 0 0 1px rgba(0,0,0,.08)",
      padding: 8,
      boxSizing: "border-box"
    }
  }, Array.from({
    length: 24
  }, (_, i) => {
    const a = i / 24 * 2 * Math.PI;
    const x = 50 + 48.5 * Math.cos(a),
      y = 50 + 48.5 * Math.sin(a);
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%,-50%)",
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: i % 2 ? accent : "rgba(0,0,0,.25)"
      }
    });
  }), /*#__PURE__*/React.createElement("div", {
    onTransitionEnd: onEnd,
    style: {
      position: "absolute",
      inset: 8,
      borderRadius: "50%",
      overflow: "hidden",
      transform: `rotate(${rot}deg)`,
      transition: spinning ? "transform 4.5s cubic-bezier(0.13,0.62,0.12,1)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: `conic-gradient(${stops})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: `repeating-conic-gradient(rgba(0,0,0,.16) 0deg 0.7deg, transparent 0.7deg ${SEG}deg)`
    }
  }), WHEEL_PRIZES.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `rotate(${i * SEG + SEG / 2}deg) translateY(-100px)`,
      transformOrigin: "0 0",
      width: 0,
      height: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "translate(-50%,-50%)",
      width: 84,
      textAlign: "center",
      fontFamily: MONO_W,
      fontWeight: 700,
      fontSize: 11,
      lineHeight: 1.2,
      color: i % 2 === 0 ? DEEP : "#fff",
      letterSpacing: ".02em",
      whiteSpace: "pre-line"
    }
  }, p.label)))), /*#__PURE__*/React.createElement("button", {
    onClick: spin,
    disabled: !canSpin,
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 6,
      width: 86,
      height: 86,
      borderRadius: "50%",
      border: 0,
      background: canSpin ? "#fff" : "#e9d9da",
      color: accent,
      cursor: canSpin ? "pointer" : "default",
      boxShadow: "0 8px 22px rgba(0,0,0,.4), 0 0 0 6px " + accent + ", inset 0 2px 3px rgba(255,255,255,.9)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      transition: "background 160ms"
    },
    onMouseDown: e => {
      if (canSpin) e.currentTarget.style.transform = "translate(-50%,-50%) scale(.94)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "translate(-50%,-50%)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "translate(-50%,-50%)";
    }
  }, canSpin && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: -6,
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,.7)",
      animation: "pp-ring 2s ease-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_W,
      fontWeight: 700,
      fontSize: 18,
      letterSpacing: ".06em",
      lineHeight: 1,
      color: accent
    }
  }, spinning ? "···" : "SPIN"))))), result && /*#__PURE__*/React.createElement("div", {
    onClick: () => setResult(null),
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 9,
      background: "rgba(0,0,0,.5)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 28,
      animation: "pp-fadeIn .2s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 300,
      borderRadius: 20,
      padding: "28px 22px",
      textAlign: "center",
      background: "#fff",
      boxShadow: "0 30px 70px rgba(0,0,0,.5)",
      animation: "pp-rise .35s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_W,
      fontWeight: 700,
      fontSize: 10.5,
      color: result.short === "Thank You" ? "rgba(0,0,0,.4)" : accent,
      letterSpacing: ".24em"
    }
  }, result.short === "Thank You" ? "BETTER LUCK NEXT TIME" : "YOU WON"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_W,
      fontWeight: 700,
      fontSize: 26,
      color: "#0a0a0a",
      marginTop: 12,
      lineHeight: 1.1
    }
  }, result.short), /*#__PURE__*/React.createElement("button", {
    onClick: () => setResult(null),
    style: {
      marginTop: 22,
      width: "100%",
      padding: "14px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 12px 26px ${accent}66`,
      fontFamily: MONO_W,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".1em"
    }
  }, result.short === "Thank You" ? "OK" : "CLAIM"))));
}
Object.assign(window, {
  FortuneWheel
});
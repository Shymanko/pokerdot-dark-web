// Spin & Go intro — the prize wheel that auto-spins at the start of a fast game
// and lands on a pot multiplier, setting the prize pool. 3-handed felt + countdown.
const SG_MONO = UI.font;
const SG_SANS = UI.fontUI;
const SG_ACC = "#D71921";
const SG_GOLD = "#f0c75e";

// pot multipliers around the wheel (Spin & Go style); index 3 (×10) is the result
const MULTS = [2, 3, 25, 10, 5, 100, 2, 1000];
const LAND_IDX = 3; // lands on ×10
const SG_SEG = 360 / MULTS.length;
const BUYIN = 10;
const SG_SEATS = [{
  x: 14,
  y: 30,
  name: "Unicorni_l",
  flag: ["#0057b7", "#ffd700"]
}, {
  x: 86,
  y: 30,
  name: "borysbory",
  flag: ["#ff9933", "#fff", "#138808"],
  cat: true
}, {
  x: 50,
  y: 88,
  name: "SASHA02",
  flag: ["#0057b7", "#ffd700"],
  you: true
}];
function SgFlag({
  colors
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 15,
      height: 10,
      borderRadius: 2,
      overflow: "hidden",
      border: "1.5px solid #0c0c0e",
      display: "flex",
      flexDirection: "column",
      flex: "none"
    }
  }, colors.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      background: c
    }
  })));
}
function SgSeat({
  p
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${p.x}%`,
      top: `${p.y}%`,
      transform: "translate(-50%,-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      zIndex: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 44,
      height: 44
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 44,
      height: 44,
      borderRadius: "50%",
      overflow: "hidden",
      border: `2px solid ${p.you ? SG_GOLD : "rgba(255,255,255,.35)"}`,
      boxShadow: "0 4px 12px rgba(0,0,0,.5)",
      background: "#23232a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, p.you ? /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar.png",
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 28%"
    }
  }) : p.cat ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 26
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
  }))), p.you && /*#__PURE__*/React.createElement(window.LegendFrameOverlay, null), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: -4,
      bottom: -3
    }
  }, /*#__PURE__*/React.createElement(SgFlag, {
    colors: p.flag
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 5,
      borderRadius: 8,
      background: "rgba(8,8,10,.9)",
      border: "1px solid rgba(255,255,255,.16)",
      padding: "2px 9px 3px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      lineHeight: 1.12,
      minWidth: 54
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      color: SG_GOLD
    }
  }, "1\xA0000")));
}
window.SpinGoIntro = function SpinGoIntro() {
  const [rot, setRot] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [landed, setLanded] = React.useState(false);
  const [count, setCount] = React.useState(5);
  const start = React.useCallback(() => {
    setLanded(false);
    setSpinning(false);
    setRot(0);
    setCount(5);
    // spin shortly after mount
    setTimeout(() => {
      const center = LAND_IDX * SG_SEG + SG_SEG / 2;
      const desired = (360 - center) % 360;
      setSpinning(true);
      setRot(360 * 6 + desired);
      if (window.playClick) window.playClick(1300, 0.05);
    }, 900);
  }, []);
  React.useEffect(() => {
    start();
  }, [start]);
  React.useEffect(() => {
    if (!landed) return;
    if (count <= 0) return;
    const id = setTimeout(() => setCount(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [landed, count]);
  const onEnd = () => {
    if (!spinning) return;
    setSpinning(false);
    setLanded(true);
    if (window.playClick) {
      window.playClick(1800, 0.05);
      setTimeout(() => window.playClick(2200, 0.06), 120);
    }
  };
  const mult = MULTS[LAND_IDX];
  const prize = BUYIN * mult * 3;
  // gold-on-dark segments
  const stops = MULTS.map((_, i) => `${i % 2 === 0 ? "#241a12" : "#15100b"} ${i * SG_SEG}deg ${(i + 1) * SG_SEG}deg`).join(", ");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      position: "relative",
      background: "#08080a",
      overflow: "hidden",
      fontFamily: SG_SANS
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse 100% 60% at 50% 42%, #14110a 0%, #060606 72%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      right: 16,
      top: 110,
      height: 560,
      borderRadius: 125,
      background: "radial-gradient(ellipse 80% 64% at 50% 42%, #1d4a39 0%, #123026 55%, #0c211a 100%)",
      border: "12px solid #161616",
      boxShadow: "0 26px 60px rgba(0,0,0,.6), inset 0 4px 26px rgba(0,0,0,.5)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      right: 16,
      top: 110,
      height: 560,
      zIndex: 4
    }
  }, SG_SEATS.map((p, i) => /*#__PURE__*/React.createElement(SgSeat, {
    key: i,
    p: p
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 150,
      left: 0,
      right: 0,
      textAlign: "center",
      zIndex: 6
    }
  }, !landed ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 13,
      color: "#D8D8DF",
      letterSpacing: ".02em"
    }
  }, "Determining the prize pool\u2026") : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 13,
      color: "#D8D8DF"
    }
  }, "Game starts in ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: SG_GOLD,
      fontFamily: SG_MONO,
      fontWeight: 700
    }
  }, count, "s"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: 430,
      transform: "translate(-50%,-50%)",
      width: 300,
      height: 300,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -4,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 8,
      width: 0,
      height: 0,
      borderLeft: "13px solid transparent",
      borderRight: "13px solid transparent",
      borderTop: `24px solid ${SG_GOLD}`,
      filter: "drop-shadow(0 2px 5px rgba(0,0,0,.6))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "linear-gradient(145deg, #f7e3a0, #c79a3a 55%, #8a6b22)",
      boxShadow: "0 20px 50px rgba(0,0,0,.5), inset 0 0 0 2px rgba(0,0,0,.2)",
      padding: 9,
      boxSizing: "border-box"
    }
  }, Array.from({
    length: 16
  }, (_, i) => {
    const a = i / 16 * 2 * Math.PI;
    const x = 50 + 47 * Math.cos(a),
      y = 50 + 47 * Math.sin(a);
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%,-50%)",
        width: 4,
        height: 4,
        borderRadius: "50%",
        background: "rgba(0,0,0,.4)",
        boxShadow: "inset 0 1px 1px rgba(255,255,255,.4)"
      }
    });
  }), /*#__PURE__*/React.createElement("div", {
    onTransitionEnd: onEnd,
    style: {
      position: "absolute",
      inset: 9,
      borderRadius: "50%",
      overflow: "hidden",
      transform: `rotate(${rot}deg)`,
      transition: spinning ? "transform 5s cubic-bezier(0.13,0.62,0.12,1)" : "none",
      boxShadow: "inset 0 0 30px rgba(0,0,0,.6)"
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
      background: `repeating-conic-gradient(rgba(247,227,160,.25) 0deg 0.8deg, transparent 0.8deg ${SG_SEG}deg)`
    }
  }), MULTS.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `rotate(${i * SG_SEG + SG_SEG / 2}deg) translateY(-96px)`,
      transformOrigin: "0 0",
      width: 0,
      height: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "translate(-50%,-50%)",
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: m >= 1000 ? 18 : 22,
      color: m >= 100 ? SG_GOLD : "#f3e7c8",
      textShadow: "0 1px 2px rgba(0,0,0,.6)",
      letterSpacing: "-.02em",
      whiteSpace: "nowrap"
    }
  }, "\xD7", m.toLocaleString("en-US").split(",").join(" "))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 6,
      width: 78,
      height: 78,
      borderRadius: "50%",
      background: "radial-gradient(circle at 40% 32%, #2a2018, #0e0a06)",
      border: `3px solid ${SG_GOLD}`,
      boxShadow: "0 6px 16px rgba(0,0,0,.6)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 13,
      color: SG_GOLD,
      letterSpacing: ".02em"
    }
  }, "SPIN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff",
      letterSpacing: ".14em"
    }
  }, "& GO")))), landed && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 612,
      textAlign: "center",
      zIndex: 7,
      animation: "sg-pop .5s cubic-bezier(.2,1.4,.4,1) both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".22em",
      color: "#A9A9B2"
    }
  }, "PRIZE POOL"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: 8,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_MONO,
      fontWeight: 700,
      fontSize: 42,
      color: SG_GOLD,
      textShadow: `0 0 22px ${SG_GOLD}88`,
      fontVariantNumeric: "tabular-nums"
    }
  }, "$", prize)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "5px 13px",
      borderRadius: 125,
      background: `${SG_ACC}1f`,
      border: `1px solid ${SG_ACC}66`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2"
    }
  }, "MULTIPLIER"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 15,
      color: "#ff6b73"
    }
  }, "\xD7", mult)))), landed && Array.from({
    length: 30
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      top: 280,
      left: `${50 + (Math.random() - 0.5) * 60}%`,
      width: 6,
      height: 9,
      background: [SG_GOLD, SG_ACC, "#fff"][i % 3],
      borderRadius: 1,
      "--cr": `${(Math.random() > .5 ? 1 : -1) * 600}deg`,
      animation: `sg-conf ${1.4 + Math.random()}s linear ${Math.random() * .3}s both`,
      zIndex: 6
    }
  })), landed && /*#__PURE__*/React.createElement("button", {
    onClick: start,
    style: {
      position: "absolute",
      bottom: 28,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 9,
      padding: "11px 24px",
      borderRadius: 125,
      background: "rgba(255,255,255,.1)",
      border: "1px solid rgba(255,255,255,.28)",
      color: "#fff",
      cursor: "pointer",
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".06em",
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3.05 13A9 9 0 1 0 6 5.3L3 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 3v6h6"
  })), "SPIN AGAIN"));
};

// ── wheel as an OVERLAY over the live table (dim + spin + result, then onDone) ──
const OVL_IDX = 1; // lands on ×3
window.SpinGoWheelOverlay = function SpinGoWheelOverlay({
  buyIn = 10,
  onDone
}) {
  const [rot, setRot] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [landed, setLanded] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => {
      const center = OVL_IDX * SG_SEG + SG_SEG / 2;
      const desired = (360 - center) % 360;
      setSpinning(true);
      setRot(360 * 6 + desired);
      if (window.playClick) window.playClick(1300, 0.05);
    }, 700);
    return () => clearTimeout(t);
  }, []);
  const onEnd = () => {
    if (!spinning) return;
    setSpinning(false);
    setLanded(true);
    if (window.playClick) {
      window.playClick(1800, 0.05);
      setTimeout(() => window.playClick(2200, 0.06), 120);
    }
    setTimeout(() => onDone && onDone(MULTS[OVL_IDX]), 2400);
  };
  const mult = MULTS[OVL_IDX];
  const DEEP = "#9E0E15";
  const stops = MULTS.map((_, i) => `${i % 2 === 0 ? "#fff" : DEEP} ${i * SG_SEG}deg ${(i + 1) * SG_SEG}deg`).join(", ");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 80,
      background: "rgba(0,0,0,.66)",
      backdropFilter: "blur(2px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      animation: "sg-fade .3s ease both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".24em",
      color: "#D8D8DF",
      marginBottom: 18
    }
  }, landed ? "PRIZE POOL SET" : "SPINNING FOR THE PRIZE POOL"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 286,
      height: 286
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -4,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 8,
      width: 0,
      height: 0,
      borderLeft: "13px solid transparent",
      borderRight: "13px solid transparent",
      borderTop: `24px solid #fff`,
      filter: "drop-shadow(0 2px 5px rgba(0,0,0,.6))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 20px 50px rgba(0,0,0,.5), inset 0 0 0 1px rgba(0,0,0,.1)",
      padding: 8,
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onTransitionEnd: onEnd,
    style: {
      position: "absolute",
      inset: 9,
      borderRadius: "50%",
      overflow: "hidden",
      transform: `rotate(${rot}deg)`,
      transition: spinning ? "transform 5s cubic-bezier(0.13,0.62,0.12,1)" : "none",
      boxShadow: "inset 0 0 30px rgba(0,0,0,.6)"
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
      background: `repeating-conic-gradient(rgba(247,227,160,.25) 0deg 0.8deg, transparent 0.8deg ${SG_SEG}deg)`
    }
  }), MULTS.map((m, i) => {
    const beta = (i + 0.5) * SG_SEG;
    const ang = (beta - 90) * Math.PI / 180;
    const R = 31;
    const x = 50 + R * Math.cos(ang),
      y = 50 + R * Math.sin(ang);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%,-50%) rotate(${beta - 90}deg)`,
        fontFamily: SG_SANS,
        fontWeight: 700,
        fontSize: m >= 1000 ? 15 : 20,
        color: i % 2 === 0 ? DEEP : "#fff",
        whiteSpace: "nowrap"
      }
    }, "\xD7", m.toLocaleString("en-US").split(",").join(" "));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 6,
      width: 76,
      height: 76,
      borderRadius: "50%",
      background: "#fff",
      border: `3px solid ${SG_ACC}`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1,
      boxShadow: "0 4px 12px rgba(0,0,0,.4)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 12,
      color: SG_ACC
    }
  }, "SPIN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#0a0a0c",
      letterSpacing: ".14em"
    }
  }, "& GO")))), landed && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      textAlign: "center",
      animation: "sg-pop .5s cubic-bezier(.2,1.4,.4,1) both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 16px",
      borderRadius: 125,
      background: `${SG_ACC}22`,
      border: `1px solid ${SG_ACC}66`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      color: "#D8D8DF"
    }
  }, "MULTIPLIER"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 22,
      color: "#ff6b73"
    }
  }, "\xD7", mult)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontFamily: SG_MONO,
      fontWeight: 700,
      fontSize: 30,
      color: SG_GOLD,
      textShadow: `0 0 22px ${SG_GOLD}88`
    }
  }, "$", buyIn * mult * 3), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2",
      marginTop: 2
    }
  }, "PRIZE POOL")));
};

// ── Spin & Go tournament lobby — Play disabled until seats fill 3/3 ──
window.SpinGoLobby = function SpinGoLobby({
  open,
  buyIn = 10,
  onClose,
  onReady
}) {
  const [filled, setFilled] = React.useState(1);
  // E10 (UX-аудит 07.09): при повному наборі стіл стартує САМ — раніше
  // гравець мусив ще натиснути PLAY, хоча всі троє вже зібрались.
  // Короткий відлік лишає мить побачити суперників і встигнути вийти.
  const [go, setGo] = React.useState(2);
  React.useEffect(() => {
    if (!open) {
      setFilled(1);
      setGo(2);
      return;
    }
    setFilled(1);
    setGo(2);
    const a = setTimeout(() => setFilled(2), 1500);
    const b = setTimeout(() => setFilled(3), 3100);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, [open]);
  React.useEffect(() => {
    if (!open || filled < 3) return;
    if (go <= 0) {
      onReady && onReady();
      return;
    }
    const t = setTimeout(() => setGo(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [open, filled, go]);
  if (!open) return null;
  const full = filled >= 3;
  const seats = [{
    you: true,
    name: "SASHA02",
    flag: ["#0057b7", "#ffd700"]
  }, {
    name: "jackiecal",
    flag: ["#0057b7", "#ffd700"]
  }, {
    name: "ripe_sna",
    flag: ["#ff9933", "#fff", "#138808"],
    cat: true
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 90,
      background: "radial-gradient(ellipse 90% 45% at 50% 6%, #1f0e12, #08080a 58%)",
      display: "flex",
      flexDirection: "column",
      padding: "52px 20px 24px",
      boxSizing: "border-box",
      fontFamily: SG_SANS,
      animation: "sg-fade .3s ease both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 38,
      height: 38,
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "EVENT"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: SG_ACC,
      background: `${SG_ACC}22`,
      border: `1px solid ${SG_ACC}55`,
      padding: "3px 9px",
      borderRadius: 6
    }
  }, "SPIN & GO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 34,
      letterSpacing: ".01em",
      color: "#fff",
      marginTop: 12
    }
  }, "QUICK SEAT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SG_MONO,
      fontWeight: 700,
      fontSize: 20,
      color: SG_GOLD,
      marginTop: 4
    }
  }, "$", buyIn, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".12em"
    }
  }, "BUY-IN"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      borderRadius: 14,
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.13)",
      padding: "14px 16px",
      display: "flex",
      justifyContent: "space-between"
    }
  }, [["GAME", "HOLD'EM"], ["TABLE", "3-MAX"], ["PRIZE", "×2–1000"]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SG_MONO,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      marginTop: 3
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, "PLAYERS"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      background: full ? "#5BD96A" : SG_GOLD,
      animation: full ? "none" : "pp-pulse 1s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_MONO,
      fontWeight: 700,
      fontSize: 12,
      color: full ? "#5BD96A" : "#fff"
    }
  }, filled, "/3 ", full ? "READY" : "FILLING"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 18,
      marginTop: 16,
      justifyContent: "center"
    }
  }, seats.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
      opacity: i < filled ? 1 : .35
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 60,
      height: 60
    }
  }, i < filled ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: "50%",
      overflow: "hidden",
      border: `2px solid ${p.you ? SG_GOLD : "rgba(255,255,255,.4)"}`,
      background: "#23232a",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "sg-pop .4s cubic-bezier(.2,1.4,.4,1) both"
    }
  }, p.you ? /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar.png",
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 28%"
    }
  }) : p.cat ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 32
    }
  }, "\uD83D\uDC31") : /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "30",
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
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: "50%",
      border: "2px dashed rgba(255,255,255,.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: "2px solid rgba(255,255,255,.25)",
      borderTopColor: "transparent",
      animation: "pp-spin .8s linear infinite"
    }
  })), i < filled && p.you && /*#__PURE__*/React.createElement(window.LegendFrameOverlay, null)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: i < filled ? "#fff" : "rgba(255,255,255,.55)"
    }
  }, i < filled ? p.name : "—")))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 54,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      borderRadius: 125,
      background: full ? `${SG_ACC}1f` : "rgba(255,255,255,.06)",
      border: `1px solid ${full ? SG_ACC : "rgba(255,255,255,.14)"}`,
      boxShadow: full ? `0 12px 30px ${SG_ACC}33` : "none",
      transition: "background .25s, border-color .25s"
    }
  }, full && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: SG_ACC,
      boxShadow: `0 0 10px ${SG_ACC}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SG_SANS,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".04em",
      color: full ? "#fff" : "rgba(255,255,255,.4)"
    }
  }, full ? go > 0 ? "TABLE STARTS IN " + go + "…" : "DEALING…" : "WAITING FOR PLAYERS…")));
};
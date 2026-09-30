// Gift Code — redeem a code for a reward. Opens from the profile GIFT CODE tile.
// Structure mirrors the first-deposit page: animated gift hero on top, then
// the code input + redeem CTA. On redeem the gift flies to center & enlarges
// and the unlocked rewards are revealed. Pokerdot house style.

const MONO_GC = UI.font;
const SANS_GC = UI.fontUI;
const GC_REWARDS = [{
  id: "ticket",
  qty: "1×",
  label: "DUCK HUNT TICKET",
  sub: "$1 000 000 GTD event"
}, {
  id: "money",
  qty: "200",
  label: "X-MONEY",
  sub: "Added to your balance"
}];
function GCRewardIcon({
  id,
  accent
}) {
  const P = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (id === "ticket") return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
    d: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 6v12",
    strokeDasharray: "2 2"
  }));
  return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("ellipse", {
    cx: "12",
    cy: "6.5",
    rx: "7",
    ry: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 6.5v11c0 1.7 3.1 3 7 3s7-1.3 7-3v-11M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"
  }));
}
function GiftCodeScreen({
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
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState(null); // null | "bad"
  const [revealed, setRevealed] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    setCode("");
    setStatus(null);
    setRevealed(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const click = (f, v) => {
    if (window.playClick) window.playClick(f, v || 0.04);
  };
  const Gift = window.AlphaVideo;
  const clean = code.trim();
  const redeem = () => {
    if (!clean) return;
    click(1700, 0.07);
    setRevealed(true);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes gc-pop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}@keyframes gc-rise{0%{transform:translateY(14px);opacity:0}100%{transform:translateY(0);opacity:1}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 360,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 70% at 50% 8%, ${accent}40 0%, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 360,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.085) 0.7px, transparent 1.1px)",
      backgroundSize: "16px 16px",
      maskImage: "linear-gradient(180deg, black, transparent)",
      WebkitMaskImage: "linear-gradient(180deg, black, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
    onClick: () => {
      click(900);
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
      fontFamily: MONO_GC,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "GIFT CODE"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), revealed ?
  /*#__PURE__*/
  /* ── reward reveal ── */
  React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 22px 30px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      animation: "gc-pop .5s cubic-bezier(.2,.9,.3,1.2) both"
    }
  }, Gift ? /*#__PURE__*/React.createElement(Gift, {
    src: window.BONUS_GIFT || "assets/bonus-coins.webm",
    style: {
      width: 210,
      height: 210
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 210,
      height: 210
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_GC,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".3em",
      animation: "gc-rise .4s .15s both"
    }
  }, "CODE REDEEMED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_GC,
      fontWeight: 700,
      fontSize: 26,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 8,
      animation: "gc-rise .4s .2s both"
    }
  }, "YOU WON"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 320,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 22
    }
  }, GC_REWARDS.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 13,
      padding: 14,
      borderRadius: 14,
      background: "linear-gradient(155deg, #16161a, #0c0c0e)",
      border: `1px solid ${accent}3a`,
      animation: `gc-rise .4s ${0.28 + i * 0.08}s both`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 44,
      height: 44,
      borderRadius: 12,
      background: `${accent}18`,
      border: `1px solid ${accent}45`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(GCRewardIcon, {
    id: r.id,
    accent: accent
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_GC,
      fontWeight: 700,
      fontSize: 19,
      color: accent
    }
  }, r.qty), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_GC,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, r.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_GC,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".03em",
      marginTop: 3
    }
  }, r.sub))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1500);
      onClose();
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      width: "100%",
      maxWidth: 320,
      marginTop: 24,
      padding: "16px 0",
      borderRadius: 125,
      border: 0,
      background: accent,
      color: "#fff",
      cursor: "pointer",
      boxShadow: `0 12px 28px ${accent}55`,
      fontFamily: MONO_GC,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".08em",
      animation: "gc-rise .4s .5s both"
    }
  }, "COLLECT")) :
  /*#__PURE__*/
  /* ── code entry ── */
  React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 40,
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 4
    }
  }, Gift ? /*#__PURE__*/React.createElement(Gift, {
    src: window.BONUS_GIFT || "assets/bonus-coins.webm",
    style: {
      width: 132,
      height: 132
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 132,
      height: 132
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontFamily: SANS_GC,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".26em"
    }
  }, "REDEEM A CODE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_GC,
      fontWeight: 700,
      fontSize: 25,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 9
    }
  }, "GOT A GIFT CODE?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: SANS_GC,
      fontWeight: 500,
      fontSize: 12,
      color: "#D8D8DF",
      letterSpacing: ".02em",
      textAlign: "center",
      maxWidth: 260,
      lineHeight: 1.5
    }
  }, "Enter your code below to claim tickets, bonuses and other rewards.")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "26px 18px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_GC,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em",
      marginBottom: 10
    }
  }, "YOUR CODE"), /*#__PURE__*/React.createElement("input", {
    value: code,
    onChange: e => {
      setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""));
      if (status) setStatus(null);
    },
    placeholder: "ENTER CODE",
    maxLength: 20,
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: "16px 16px",
      borderRadius: 14,
      background: "rgba(255,255,255,.075)",
      border: `1px solid ${status === "bad" ? accent : "rgba(255,255,255,.16)"}`,
      color: "#fff",
      fontFamily: MONO_GC,
      fontWeight: 700,
      fontSize: 20,
      letterSpacing: ".18em",
      textAlign: "center",
      outline: "none",
      textTransform: "uppercase"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 20,
      marginTop: 9,
      textAlign: "center"
    }
  }, status === "bad" && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_GC,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".06em"
    }
  }, "CODE NOT VALID \u2014 CHECK & TRY AGAIN"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 18px 0"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: redeem,
    disabled: !clean,
    onMouseDown: e => {
      if (clean) e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      width: "100%",
      padding: "16px 0",
      borderRadius: 125,
      border: 0,
      background: clean ? accent : "rgba(255,255,255,.13)",
      color: clean ? "#fff" : "rgba(255,255,255,.35)",
      cursor: clean ? "pointer" : "default",
      boxShadow: clean ? `0 12px 28px ${accent}55` : "none",
      fontFamily: MONO_GC,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".08em",
      transition: "all .12s"
    }
  }, "REDEEM")), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "20px 18px 0",
      padding: "13px 15px",
      borderRadius: 14,
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.13)",
      display: "flex",
      alignItems: "flex-start",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none",
      marginTop: 1
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8h.01M11 12h1v4h1"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_GC,
      fontWeight: 500,
      fontSize: 11,
      lineHeight: 1.5,
      color: "#D8D8DF"
    }
  }, "Codes are shared in our promos, streams and community. Each code can be redeemed once per account."))));
}
Object.assign(window, {
  GiftCodeScreen
});
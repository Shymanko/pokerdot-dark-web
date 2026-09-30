// First-deposit flow — full-screen slide-up. Opens from the bonus banner's
// "CLAIM BONUS" CTA. 100% match up to $1 000. Reuses the spinning gift
// (window.AlphaVideo) as the hero, on-brand: Space Mono / Roboto / red / dots.

const MONO_D = UI.font;
const SANS_D = UI.fontUI;
const DEP_PRESETS = [20, 50, 100, 250, 500, 1000];
const BONUS_CAP = 1000;
const PAY_METHODS = [{
  id: "card",
  label: "CARD"
}, {
  id: "crypto",
  label: "CRYPTO"
}];
function PayGlyph({
  id,
  on
}) {
  const c = on ? "#fff" : "rgba(255,255,255,.55)";
  const P = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (id) {
    case "card":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "2.5",
        y: "5.5",
        width: "19",
        height: "13",
        rx: "2.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2.5 10h19"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 15h3"
      }));
    case "crypto":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9.5 8.5h4a2 2 0 0 1 0 4h-4M9.5 12.5h4.2a2 2 0 0 1 0 4H9.5M11 6.6v1.9M11 16.5v1.9M13 6.6v1.9M13 16.5v1.9"
      }));
    case "wallet":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "2.5",
        y: "5.5",
        width: "19",
        height: "14",
        rx: "2.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 12h2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M2.5 9h13a2 2 0 0 1 2 2v0"
      }));
    case "bank":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M3 9.5 12 4l9 5.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 10v7M9 10v7M15 10v7M19 10v7M3 20h18"
      }));
    default:
      return null;
  }
}
function DepositFlow({
  open,
  onClose,
  accent = "#D71921"
}) {
  const [mounted, setMounted] = React.useState(false);
  const [amount, setAmount] = React.useState(100);
  const [custom, setCustom] = React.useState(""); // typed figure, empty until used
  const [padOpen, setPadOpen] = React.useState(false);
  const [method, setMethod] = React.useState("card");
  // step: "amount" → "pay" (card / crypto details) → "complete"
  const [step, setStep] = React.useState("amount");
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    setStep("amount");
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  const bonus = Math.min(amount, BONUS_CAP);
  const total = amount + bonus;
  const capPct = Math.min(100, Math.round(bonus / BONUS_CAP * 100));
  const click = (f, v) => {
    if (window.playClick) window.playClick(f, v);
  };
  const goPay = () => {
    click(1500, 0.06);
    setStep("pay");
  };
  const finish = () => {
    click(1600, 0.07);
    setStep("complete");
  };
  const back = () => {
    click(900, 0.03);
    if (step === "pay") setStep("amount");else onClose && onClose();
  };
  if (!open) return null;
  const Gift = window.AlphaVideo;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 240,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 340,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 70% at 50% 8%, ${accent}40 0%, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 340,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.085) 0.7px, transparent 1.1px)",
      backgroundSize: "16px 16px",
      maskImage: "linear-gradient(180deg, black, transparent)",
      WebkitMaskImage: "linear-gradient(180deg, black, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 52,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: step === "complete" ? onClose : back,
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
      padding: 0,
      visibility: step === "complete" ? "hidden" : "visible"
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
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, step === "pay" ? method === "crypto" ? "CRYPTO PAYMENT" : "CARD PAYMENT" : "FIRST DEPOSIT"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), step === "complete" ? /*#__PURE__*/React.createElement(DepositComplete, {
    amount: amount,
    bonus: bonus,
    total: total,
    accent: accent,
    onClose: onClose,
    Gift: Gift
  }) : step === "pay" ? method === "crypto" ? /*#__PURE__*/React.createElement(CryptoEntry, {
    amount: amount,
    bonus: bonus,
    total: total,
    accent: accent,
    onPaid: finish
  }) : /*#__PURE__*/React.createElement(CardEntry, {
    amount: amount,
    bonus: bonus,
    total: total,
    accent: accent,
    onPaid: finish
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 120,
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
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".26em"
    }
  }, "WELCOME OFFER"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 44,
      color: "#fff",
      lineHeight: .9
    }
  }, "100%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "MATCH")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, "UP TO $1\xA0000 IN BONUS FUNDS")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, "DEPOSIT AMOUNT"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 4,
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 40,
      color: "#fff",
      lineHeight: 1
    }
  }, "$", amount.toLocaleString("en-US").split(",").join(" "))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8,
      marginTop: 14
    }
  }, DEP_PRESETS.map(v => {
    const on = v === amount;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      onClick: () => {
        click(1100 + v, 0.035);
        setAmount(v);
        setCustom("");
      },
      style: {
        padding: "12px 0",
        borderRadius: 12,
        background: on ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.065)",
        border: `1px solid ${on ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.1)"}`,
        color: "#fff",
        cursor: "pointer",
        fontFamily: MONO_D,
        fontWeight: 700,
        fontSize: 15,
        letterSpacing: ".02em",
        transition: "all 140ms"
      }
    }, "$", v.toLocaleString("en-US").split(",").join(" "));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1050, 0.035);
      setPadOpen(true);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      marginTop: 10,
      padding: "12px 14px",
      borderRadius: 12,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.12)",
      cursor: "pointer",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.5)",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 9h.01M11 9h.01M15 9h.01M7 13h.01M15 13h.01M11 13h2"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: "#A9A9B2"
    }
  }, "OTHER AMOUNT"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      display: "flex",
      alignItems: "baseline",
      justifyContent: "flex-end",
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 20,
      color: "#A9A9B2"
    }
  }, "$"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 20,
      color: custom ? "#fff" : "rgba(255,255,255,.35)"
    }
  }, custom || "0")))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 14,
      overflow: "hidden",
      background: `linear-gradient(160deg, ${accent}1f, rgba(255,255,255,.02))`,
      border: `1px solid ${accent}3d`
    }
  }, /*#__PURE__*/React.createElement(BreakRow, {
    label: "YOUR DEPOSIT",
    value: `$${amount.toLocaleString("en-US").split(",").join(" ")}`
  }), /*#__PURE__*/React.createElement(BreakRow, {
    label: "BONUS \xB7 100%",
    value: `+$${bonus.toLocaleString("en-US").split(",").join(" ")}`,
    accentVal: accent,
    hi: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: "rgba(255,255,255,.13)"
    }
  }), /*#__PURE__*/React.createElement(BreakRow, {
    label: "TOTAL TO PLAY",
    value: `$${total.toLocaleString("en-US").split(",").join(" ")}`,
    big: true
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(DotBar, {
    value: Math.max(1, Math.round(capPct / 100 * 18)),
    max: 18,
    color: accent,
    size: 4,
    gap: 2.5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em",
      whiteSpace: "nowrap"
    }
  }, bonus >= BONUS_CAP ? /*#__PURE__*/React.createElement("span", null, "MAX BONUS REACHED") : /*#__PURE__*/React.createElement(React.Fragment, null, "+$" + (BONUS_CAP - amount).toLocaleString("en-US").split(",").join(" ") + " ", /*#__PURE__*/React.createElement("span", null, "MORE = MAX BONUS"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, "PAY WITH"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      marginTop: 12
    }
  }, PAY_METHODS.map(p => {
    const on = p.id === method;
    return /*#__PURE__*/React.createElement("button", {
      key: p.id,
      onClick: () => {
        click(1000, 0.03);
        setMethod(p.id);
      },
      style: {
        padding: "12px 4px 10px",
        borderRadius: 12,
        background: on ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.06)",
        border: `1px solid ${on ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.1)"}`,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
        transition: "all 140ms"
      }
    }, /*#__PURE__*/React.createElement(PayGlyph, {
      id: p.id,
      on: on
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_D,
        fontWeight: 700,
        fontSize: 10.5,
        color: on ? "#fff" : "rgba(255,255,255,.5)",
        letterSpacing: ".08em"
      }
    }, p.label));
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 6,
      padding: "14px 16px 26px",
      background: "linear-gradient(180deg, transparent, rgba(0,0,0,.92) 28%, #000)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: goPay,
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
      padding: "15px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 14px 30px ${accent}66`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
      transition: "transform 100ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".08em"
    }
  }, "CONTINUE \u203A"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".14em"
    }
  }, /*#__PURE__*/React.createElement("span", null, "DEPOSIT"), " $" + amount.toLocaleString("en-US").split(",").join(" ") + " · ", /*#__PURE__*/React.createElement("span", null, "GET"), " +$" + bonus.toLocaleString("en-US").split(",").join(" "))))), window.KeypadSheet && /*#__PURE__*/React.createElement(window.KeypadSheet, {
    open: padOpen,
    value: amount,
    max: 10000,
    accent: accent,
    onChange: v => {
      setAmount(v);
      setCustom(v ? String(v) : "");
    },
    onClose: () => setPadOpen(false)
  }));
}
function BreakRow({
  label,
  value,
  accentVal,
  hi,
  big
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: big ? "14px 16px" : "12px 16px",
      background: hi ? "rgba(255,255,255,.06)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: big ? 11 : 10,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: big ? 22 : 16,
      color: accentVal || "#fff",
      letterSpacing: ".02em"
    }
  }, value));
}
function DepositComplete({
  amount,
  bonus,
  total,
  accent,
  onClose,
  Gift
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px 40px",
      textAlign: "center"
    }
  }, Gift ? /*#__PURE__*/React.createElement(Gift, {
    src: window.BONUS_GIFT || "assets/bonus-coins.webm",
    style: {
      width: 168,
      height: 168
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 168,
      height: 168
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "5px 12px",
      borderRadius: 8,
      background: "rgba(91,217,106,.14)",
      border: "1px solid rgba(91,217,106,.4)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#5BD96A",
      letterSpacing: ".14em"
    }
  }, "DEPOSIT COMPLETE")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 30,
      color: "#fff",
      marginTop: 16,
      letterSpacing: ".01em"
    }
  }, "$", total.toLocaleString("en-US").split(",").join(" "), " READY"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 600,
      fontSize: 12,
      color: "#D8D8DF",
      letterSpacing: ".06em",
      marginTop: 8,
      lineHeight: 1.5
    }
  }, "$", amount.toLocaleString("en-US").split(",").join(" "), " deposited + ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: accent,
      fontWeight: 700
    }
  }, "$", bonus.toLocaleString("en-US").split(",").join(" "), " bonus"), " added", /*#__PURE__*/React.createElement("br", null), "to your balance instantly. Ready to play."), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginTop: 26,
      width: "100%",
      maxWidth: 320,
      padding: "15px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 14px 30px ${accent}66`,
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".1em"
    }
  }, "START PLAYING"));
}

// ── Shared payment-page order summary chip ────────────────────────────
function PaySummary({
  amount,
  bonus,
  total,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "12px 14px",
      borderRadius: 12,
      marginBottom: 18,
      background: `linear-gradient(160deg, ${accent}1f, rgba(255,255,255,.02))`,
      border: `1px solid ${accent}33`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".18em"
    }
  }, "YOU PAY NOW"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 26,
      color: "#fff",
      lineHeight: 1
    }
  }, "$", amount.toLocaleString("en-US").split(",").join(" "))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      display: "flex",
      flexDirection: "column",
      gap: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, "+$", bonus.toLocaleString("en-US").split(",").join(" "), " BONUS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 14,
      color: accent,
      letterSpacing: ".02em"
    }
  }, "$", total.toLocaleString("en-US").split(",").join(" "), " TO PLAY")));
}

// ── Single labelled input ─────────────────────────────────────────────
function DepField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  maxLength,
  mono = true,
  style
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block",
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".18em",
      display: "block",
      marginBottom: 7
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    placeholder: placeholder,
    inputMode: inputMode,
    maxLength: maxLength,
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px",
      borderRadius: 12,
      background: "rgba(255,255,255,.075)",
      border: `1px solid ${focus ? "rgba(255,255,255,.65)" : "rgba(255,255,255,.16)"}`,
      color: "#fff",
      outline: "none",
      fontFamily: mono ? MONO_D : SANS_D,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: mono ? ".06em" : ".02em",
      transition: "border-color 140ms"
    }
  }));
}

// ── CARD details entry ────────────────────────────────────────────────
function CardEntry({
  amount,
  bonus,
  total,
  accent,
  onPaid
}) {
  const [num, setNum] = React.useState("");
  const [name, setName] = React.useState("");
  const [exp, setExp] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const fmtNum = v => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = v => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  };
  const digits = num.replace(/\D/g, "").length;
  const valid = digits >= 15 && exp.length === 5 && cvv.length >= 3 && name.trim().length > 1;
  const brand = /^4/.test(num) ? "VISA" : /^5/.test(num) ? "MC" : /^3/.test(num) ? "AMEX" : "CARD";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 120,
      position: "relative",
      zIndex: 2,
      padding: "8px 16px 120px"
    }
  }, /*#__PURE__*/React.createElement(PaySummary, {
    amount: amount,
    bonus: bonus,
    total: total,
    accent: accent
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 16,
      overflow: "hidden",
      padding: 16,
      marginBottom: 20,
      height: 92,
      background: "linear-gradient(135deg, #1c1c20 0%, #0c0c0e 100%)",
      border: "1px solid rgba(255,255,255,.1)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.085) 0.7px, transparent 1.1px)",
      backgroundSize: "12px 12px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 22,
      borderRadius: 5,
      background: "linear-gradient(135deg,#d9b65a,#a8842f)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 13,
      color: "#D8D8DF",
      letterSpacing: ".08em"
    }
  }, brand)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".14em",
      position: "relative"
    }
  }, num || "•••• •••• •••• ••••")), /*#__PURE__*/React.createElement(DepField, {
    label: "CARD NUMBER",
    value: num,
    onChange: v => setNum(fmtNum(v)),
    placeholder: "1234 5678 9012 3456",
    inputMode: "numeric"
  }), /*#__PURE__*/React.createElement(DepField, {
    label: "CARDHOLDER NAME",
    value: name,
    onChange: v => setName(v.toUpperCase()),
    placeholder: "ALEX MORGAN",
    mono: false,
    style: {
      marginTop: 14
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(DepField, {
    label: "EXPIRY",
    value: exp,
    onChange: v => setExp(fmtExp(v)),
    placeholder: "MM/YY",
    inputMode: "numeric"
  }), /*#__PURE__*/React.createElement(DepField, {
    label: "CVV",
    value: cvv,
    onChange: v => setCvv(v.replace(/\D/g, "").slice(0, 4)),
    placeholder: "\u2022\u2022\u2022",
    inputMode: "numeric"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 18,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.45)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "11",
    width: "16",
    height: "9",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11V8a4 4 0 0 1 8 0v3"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_D,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, "SECURED \xB7 256-BIT ENCRYPTION \xB7 PCI DSS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 6,
      padding: "14px 16px 26px",
      background: "linear-gradient(180deg, transparent, rgba(0,0,0,.92) 28%, #000)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => valid && onPaid(),
    onMouseDown: e => {
      if (valid) e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      width: "100%",
      padding: "15px 0",
      borderRadius: 125,
      background: valid ? accent : "rgba(255,255,255,.16)",
      color: valid ? "#fff" : "rgba(255,255,255,.4)",
      border: 0,
      cursor: valid ? "pointer" : "default",
      boxShadow: valid ? `0 14px 30px ${accent}66` : "none",
      fontFamily: MONO_D,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".08em",
      transition: "transform 100ms, background 160ms, color 160ms"
    }
  }, "PAY $", amount.toLocaleString("en-US").split(",").join(" "))));
}

// ── CRYPTO send step — reuses the cashier's DepositDetails so the
// first-deposit crypto page is identical to the normal cashier one ─────
function CryptoEntry({
  amount,
  bonus,
  total,
  accent,
  onPaid
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      position: "relative",
      zIndex: 2,
      padding: "8px 16px 40px"
    }
  }, /*#__PURE__*/React.createElement(PaySummary, {
    amount: amount,
    bonus: bonus,
    total: total,
    accent: accent
  }), window.DepositDetails ? /*#__PURE__*/React.createElement(window.DepositDetails, {
    method: "crypto",
    amount: amount,
    accent: accent,
    onConfirm: onPaid
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_D,
      color: "#A9A9B2",
      textAlign: "center",
      padding: 20
    }
  }, "Loading\u2026"));
}
Object.assign(window, {
  DepositFlow
});
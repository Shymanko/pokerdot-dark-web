// Cashier shell — balance, DEPOSIT/WITHDRAW tabs, processing + success.
// Uses AmountEntry, MethodPicker, TxRow (from cashier-parts*.jsx).

function Cashier({
  open,
  onClose,
  balance = window.pxWallets ? window.pxWallets().usd : 4827,
  accent = "#D71921",
  nested = false,
  topInset = 0
}) {
  const [mounted, setMounted] = React.useState(false);
  const [tab, setTab] = React.useState("deposit");
  const [amount, setAmount] = React.useState(100);
  const [method, setMethod] = React.useState("card");
  const [phase, setPhase] = React.useState("form"); // form | processing | done
  const [padOpen, setPadOpen] = React.useState(false);
  const [txOpen, setTxOpen] = React.useState(null); // C1: деталі транзакції
  const [optIn, setOptIn] = React.useState(true); // E9: велком-бонус увімкнено

  React.useEffect(() => {
    if (!open) return;
    // Гаманець може попросити відкрити касу одразу на «ВЫВОД» —
    // передає бажану вкладку через window.__cashierTab (див. M2 у правках СЕО)
    const want = typeof window !== "undefined" && window.__cashierTab === "withdraw" ? "withdraw" : "deposit";
    if (typeof window !== "undefined") window.__cashierTab = null;
    setMounted(false);
    setTab(want);
    setAmount(100);
    setMethod("card");
    setPhase("form");
    setTxOpen(null);
    setOptIn(true);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  const switchTab = t => {
    if (t === tab) return;
    if (window.playClick) window.playClick(1100, 0.04);
    setTab(t);
    setPhase("form");
    setAmount(t === "withdraw" ? Math.min(100, balance) : 100);
  };
  const submit = () => {
    if (amount <= 0) return;
    if (window.playClick) window.playClick(1500, 0.06);
    setPhase("processing");
    // C1: фейл-стан має бути досяжним у прототипі — $500 карткою програється
    // як відмова банку, решта сум проходить успішно
    const willFail = method === "card" && amount === 500;
    setTimeout(() => setPhase(willFail ? "failed" : "done"), 1500);
  };
  const toDetails = () => {
    if (amount <= 0) return;
    if (window.playClick) window.playClick(1300, 0.05);
    setPhase("details");
  };
  if (!open) return null;
  const isDep = tab === "deposit";
  // Правка A1: велком-бонус живе прямо в касі (окремий екран FIRST DEPOSIT злитий сюди)
  const BONUS_CAP = 1000;
  const bonus = isDep && optIn ? Math.min(amount, BONUS_CAP) : 0;
  const totalPlay = amount + bonus;
  const capPct = Math.min(100, Math.round(bonus / BONUS_CAP * 100));
  const M = window.MethodPicker,
    AE = window.AmountEntry,
    TxR = window.TxRow;
  const methodLabel = (window.CASH_METHODS.find(m => m.id === method) || {}).time || "";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: padOpen ? 50 : 36,
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
      height: 300,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${accent}2e 0%, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: nested ? topInset + 14 : 62,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => phase === "details" ? setPhase("form") : onClose(),
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
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "CASHIER"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      textAlign: "center",
      paddingBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".24em"
    }
  }, "AVAILABLE BALANCE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 26,
      color: "#fff",
      marginTop: 5,
      letterSpacing: ".02em"
    }
  }, "$", balance.toLocaleString("en-US").split(",").join(" "))), phase === "form" && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      padding: "0 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      padding: 4,
      borderRadius: 12,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, [["deposit", "DEPOSIT"], ["withdraw", "WITHDRAW"]].map(([id, label]) => {
    const on = tab === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => switchTab(id),
      style: {
        flex: 1,
        padding: "11px 0",
        borderRadius: 12,
        border: 0,
        cursor: "pointer",
        background: on ? accent : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        fontFamily: MONO_C,
        fontWeight: 700,
        fontSize: 13,
        letterSpacing: ".1em",
        boxShadow: on ? `0 8px 18px ${accent}55` : "none",
        transition: "all 180ms"
      }
    }, label);
  }))), phase === "form" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 116,
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "16px 16px 0"
    }
  }, AE && /*#__PURE__*/React.createElement(AE, {
    key: tab,
    hideValue: true,
    value: amount,
    onChange: setAmount,
    presets: isDep ? [20, 50, 100, 250, 500, 1000] : [50, 100, 250],
    max: isDep ? 10000 : balance,
    showMax: !isDep,
    onPad: () => setPadOpen(true),
    accent: accent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em",
      marginBottom: 11
    }
  }, isDep ? "PAY WITH" : "WITHDRAW TO"), M && /*#__PURE__*/React.createElement(M, {
    value: method,
    onChange: setMethod,
    accent: accent
  }), !isDep && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: SANS_C,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".06em",
      textAlign: "center"
    }
  }, "Funds arrive in ", methodLabel.toLowerCase(), " \xB7 no fees")), isDep && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginBottom: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: optIn ? accent : "#8A8A93",
      letterSpacing: ".2em"
    }
  }, "WELCOME OFFER"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, "100% MATCH \xB7 UP TO $1\xA0000"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(optIn ? 800 : 1200, .04);
      setOptIn(!optIn);
    },
    "aria-label": "Toggle welcome bonus",
    style: {
      marginLeft: "auto",
      flex: "none",
      width: 42,
      height: 24,
      borderRadius: 125,
      padding: 0,
      cursor: "pointer",
      background: optIn ? accent : "rgba(255,255,255,.16)",
      border: `1px solid ${optIn ? accent : "rgba(255,255,255,.2)"}`,
      position: "relative",
      transition: "background .2s, border-color .2s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: optIn ? 20 : 2,
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: "#fff",
      transition: "left .18s cubic-bezier(.2,.8,.2,1)",
      boxShadow: "0 2px 5px rgba(0,0,0,.4)"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 14,
      overflow: "hidden",
      background: `linear-gradient(160deg, ${accent}1f, rgba(255,255,255,.02))`,
      border: `1px solid ${accent}3d`
    }
  }, [["YOUR DEPOSIT", "$" + amount.toLocaleString("en-US").split(",").join(" "), null, false], ["BONUS · 100%", "+$" + bonus.toLocaleString("en-US").split(",").join(" "), accent, false], ["TOTAL TO PLAY", "$" + totalPlay.toLocaleString("en-US").split(",").join(" "), null, true]].map(([l, v, c, big], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: big ? "13px 16px" : "11px 16px",
      background: i === 1 ? "rgba(255,255,255,.06)" : "transparent",
      borderTop: big ? "1px solid rgba(255,255,255,.13)" : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: big ? 11 : 10,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, l), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: big ? 21 : 15,
      color: c || "#fff",
      letterSpacing: ".02em"
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 11,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, window.DotBar && /*#__PURE__*/React.createElement(window.DotBar, {
    value: Math.max(1, Math.round(capPct / 100 * 18)),
    max: 18,
    color: accent,
    size: 4,
    gap: 2.5
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em",
      whiteSpace: "nowrap"
    }
  }, bonus >= BONUS_CAP ? "MAX BONUS REACHED" : "+$" + (BONUS_CAP - amount).toLocaleString("en-US").split(",").join(" ") + " MORE = MAX BONUS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, "RECENT"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      borderTop: "1px solid rgba(255,255,255,.085)"
    }
  }, window.CASH_TXNS.map((tx, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      borderBottom: "1px solid rgba(255,255,255,.085)"
    }
  }, TxR && /*#__PURE__*/React.createElement(TxR, {
    tx: tx,
    accent: accent,
    onOpen: setTxOpen
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 6,
      padding: "14px 16px 22px",
      background: "linear-gradient(180deg, transparent, rgba(0,0,0,.92) 24%, #000 50%)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: toDetails,
    disabled: amount <= 0,
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
      flexDirection: "column",
      gap: 2,
      background: amount > 0 ? accent : "rgba(255,255,255,.1)",
      cursor: amount > 0 ? "pointer" : "default",
      boxShadow: amount > 0 ? `0 14px 30px ${accent}66` : "none",
      transition: "transform 100ms, background 160ms"
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block"
    }
  }, "CONTINUE \xB7 $", amount.toLocaleString("en-US").split(",").join(" ")), isDep && bonus > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#FFD9DB",
      letterSpacing: ".14em"
    }
  }, "DEPOSIT $", amount.toLocaleString("en-US").split(",").join(" "), " \xB7 GET +$", bonus.toLocaleString("en-US").split(",").join(" "), " BONUS")))), phase === "details" && /*#__PURE__*/React.createElement("div", {
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
      margin: "8px 16px 16px",
      padding: "12px 14px",
      borderRadius: 12,
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.14)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".16em"
    }
  }, isDep ? "DEPOSIT" : "WITHDRAW", " \xB7 ", (method || "").toUpperCase()), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 20,
      color: "#fff"
    }
  }, "$", amount.toLocaleString("en-US").split(",").join(" "))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 16px"
    }
  }, isDep ? window.DepositDetails && /*#__PURE__*/React.createElement(window.DepositDetails, {
    method: method,
    amount: amount,
    accent: accent,
    onConfirm: submit
  }) : window.WithdrawDetails && /*#__PURE__*/React.createElement(window.WithdrawDetails, {
    method: method,
    amount: amount,
    accent: accent,
    onConfirm: submit
  }))), phase === "processing" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 54,
      height: 54,
      borderRadius: "50%",
      border: "3px solid rgba(255,255,255,.18)",
      borderTopColor: accent,
      animation: "pp-spin .8s linear infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_C,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".18em"
    }
  }, "PROCESSING\u2026")), phase === "failed" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px 50px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 76,
      height: 76,
      borderRadius: "50%",
      background: "rgba(229,72,77,.14)",
      border: "1px solid rgba(229,72,77,.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "pp-rise .4s ease"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "34",
    height: "34",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#E5484D",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7.5v5.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16.5h.01"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 24,
      color: "#fff",
      marginTop: 20,
      letterSpacing: ".02em"
    }
  }, isDep ? "DEPOSIT FAILED" : "WITHDRAWAL FAILED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 600,
      fontSize: 12,
      color: "#D8D8DF",
      letterSpacing: ".02em",
      marginTop: 10,
      lineHeight: 1.55,
      textWrap: "pretty"
    }
  }, isDep ? /*#__PURE__*/React.createElement(React.Fragment, null, "Your bank declined the payment. ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#fff"
    }
  }, "Nothing was charged."), " Try another card or pay with crypto.") : /*#__PURE__*/React.createElement(React.Fragment, null, "The payout could not be sent. ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#fff"
    }
  }, "The amount is back on your balance."), " Check the details and try again.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontFamily: MONO_C,
      fontSize: 10.5,
      color: "#8A8A93",
      letterSpacing: ".08em"
    }
  }, "TX-8842177 \xB7 ", (method || "").toUpperCase(), " \xB7 $", amount.toLocaleString("en-US").split(",").join("\u00A0")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setPhase("form"),
    style: {
      marginTop: 24,
      width: "100%",
      maxWidth: 320,
      padding: "15px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 14px 30px ${accent}66`,
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".1em"
    }
  }, "TRY AGAIN"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginTop: 10,
      width: "100%",
      maxWidth: 320,
      padding: "13px 0",
      borderRadius: 125,
      background: "transparent",
      color: "rgba(255,255,255,.7)",
      border: "1px solid rgba(255,255,255,.2)",
      cursor: "pointer",
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".12em"
    }
  }, "CLOSE")), phase === "done" && /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      zIndex: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 24px 50px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 76,
      height: 76,
      borderRadius: "50%",
      background: "rgba(91,217,106,.16)",
      border: "1px solid rgba(91,217,106,.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "pp-rise .4s ease"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "34",
    height: "34",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 26,
      color: "#fff",
      marginTop: 20,
      letterSpacing: ".02em"
    }
  }, isDep ? "DEPOSIT COMPLETE" : "WITHDRAWAL SENT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 600,
      fontSize: 12,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      marginTop: 10,
      lineHeight: 1.5
    }
  }, isDep ? /*#__PURE__*/React.createElement(React.Fragment, null, "$", amount.toLocaleString("en-US").split(",").join(" "), " added to your balance via ", method, ".") : /*#__PURE__*/React.createElement(React.Fragment, null, "$", amount.toLocaleString("en-US").split(",").join(" "), " on its way to your ", method, " \xB7 ", methodLabel.toLowerCase(), ".")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginTop: 28,
      width: "100%",
      maxWidth: 320,
      padding: "15px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 14px 30px ${accent}66`,
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".1em"
    }
  }, "DONE")), txOpen && /*#__PURE__*/React.createElement("div", {
    onClick: () => setTxOpen(null),
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      display: "flex",
      alignItems: "flex-end",
      background: "rgba(0,0,0,.72)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      boxSizing: "border-box",
      borderRadius: "20px 20px 0 0",
      padding: "16px 18px 26px",
      background: "linear-gradient(160deg,#17171c,#0b0b0e)",
      border: "1px solid rgba(255,255,255,.14)",
      borderBottom: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      width: 44,
      height: 4,
      borderRadius: 3,
      background: "rgba(255,255,255,.22)",
      margin: "0 auto 16px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 40,
      height: 40,
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: `${(window.TX_TONE || {})[txOpen.status] || "#5BD96A"}1f`,
      border: `1px solid ${(window.TX_TONE || {})[txOpen.status] || "#5BD96A"}66`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: (window.TX_TONE || {})[txOpen.status] || "#5BD96A",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, txOpen.status === "failed" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7.5v5.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 16.5h.01"
  })) : txOpen.status === "canceled" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 8.5l7 7M15.5 8.5l-7 7"
  })) : txOpen.status === "pending" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7.5V12l3 2"
  })) : /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, txOpen.type === "deposit" ? "DEPOSIT" : "WITHDRAWAL"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: (window.TX_TONE || {})[txOpen.status] || "#5BD96A"
    }
  }, txOpen.status.toUpperCase())), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 20,
      color: "#fff"
    }
  }, txOpen.type === "deposit" ? "+" : "\u2212", "$", txOpen.amount.toLocaleString("en-US").split(",").join("\u00A0"))), (txOpen.reason || txOpen.note) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "11px 13px",
      borderRadius: 12,
      background: txOpen.status === "failed" ? "rgba(229,72,77,.09)" : "rgba(255,255,255,.05)",
      border: `1px solid ${txOpen.status === "failed" ? "rgba(229,72,77,.32)" : "rgba(255,255,255,.1)"}`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.55,
      color: "#D8D8DF",
      textWrap: "pretty"
    }
  }, txOpen.reason || txOpen.note)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, [["TRANSACTION ID", txOpen.id], ["METHOD", txOpen.method], ["DATE", txOpen.at]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "10px 0",
      borderTop: "1px solid rgba(255,255,255,.08)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: "#8A8A93"
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_C,
      fontSize: 12,
      color: "#fff"
    }
  }, v)))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTxOpen(null),
    style: {
      width: "100%",
      marginTop: 16,
      padding: "13px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: txOpen.status === "failed" ? accent : "rgba(255,255,255,.07)",
      border: txOpen.status === "failed" ? 0 : "1px solid rgba(255,255,255,.18)",
      color: "#fff",
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".14em"
    }
  }, txOpen.status === "failed" ? "TRY AGAIN" : "CLOSE"))), window.KeypadSheet && /*#__PURE__*/React.createElement(window.KeypadSheet, {
    open: padOpen,
    value: amount,
    onChange: setAmount,
    onClose: () => setPadOpen(false),
    max: isDep ? 10000 : balance,
    accent: accent
  }));
}
Object.assign(window, {
  Cashier
});
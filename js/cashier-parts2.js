// Cashier — full-screen deposit / withdraw system. Opens from the CASHIER dock.
// Tabs: DEPOSIT · WITHDRAW. Amount keypad, method picker, processing + success,
// recent transactions. On-brand: Space Mono / Roboto / Arcanium red / dots.

// ── amount entry: big preset buttons; OTHER AMOUNT opens the slide-up keypad ──
function AmountEntry({
  value,
  onChange,
  presets = [],
  max,
  showMax,
  onPad,
  accent = "#D71921",
  hideValue = false
}) {
  const set = v => {
    let n = v;
    if (max != null) n = Math.min(n, max);
    if (n < 0) n = 0;
    onChange(n);
  };
  const pick = p => {
    if (window.playClick) window.playClick(1200, 0.04);
    set(p);
  };
  const over = max != null && value >= max;
  const isPreset = presets.includes(value) || showMax && value === max;
  return /*#__PURE__*/React.createElement("div", null, !hideValue && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      paddingTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".22em"
    }
  }, "AMOUNT"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 54,
      color: "#fff",
      lineHeight: 1.04,
      marginTop: 4
    }
  }, "$", value.toLocaleString("en-US").split(",").join(" ")), over && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".12em",
      marginTop: 2
    }
  }, "MAX AMOUNT REACHED")), hideValue && over && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".12em",
      marginBottom: 8
    }
  }, "MAX AMOUNT REACHED"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 9,
      marginTop: 18
    }
  }, presets.map(p => {
    const on = value === p;
    return /*#__PURE__*/React.createElement("button", {
      key: p,
      onClick: () => pick(p),
      onMouseDown: e => {
        e.currentTarget.style.transform = "scale(.97)";
      },
      onMouseUp: e => {
        e.currentTarget.style.transform = "";
      },
      onMouseLeave: e => {
        e.currentTarget.style.transform = "";
      },
      style: {
        padding: "17px 0",
        borderRadius: 12,
        background: on ? "rgba(255,255,255,.13)" : "rgba(255,255,255,.065)",
        border: `1px solid ${on ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.1)"}`,
        color: "#fff",
        cursor: "pointer",
        fontFamily: MONO_C,
        fontWeight: 700,
        fontSize: 18,
        letterSpacing: ".02em",
        transition: "transform 110ms, background 140ms, border-color 140ms"
      }
    }, "$", p.toLocaleString("en-US").split(",").join(" "));
  }), showMax && max != null && /*#__PURE__*/React.createElement("button", {
    onClick: () => pick(max),
    style: {
      padding: "17px 0",
      borderRadius: 12,
      background: value === max ? `${accent}2e` : "rgba(255,255,255,.065)",
      border: `1px solid ${value === max ? accent : "rgba(255,255,255,.1)"}`,
      color: value === max ? "#fff" : accent,
      cursor: "pointer",
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 17,
      letterSpacing: ".08em",
      transition: "all 140ms"
    }
  }, "MAX")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1050, 0.035);
      onPad && onPad();
    },
    style: {
      width: "100%",
      marginTop: 10,
      padding: "14px 0",
      borderRadius: 12,
      background: !isPreset ? "rgba(255,255,255,.13)" : "transparent",
      border: `1px solid ${!isPreset ? "rgba(255,255,255,.5)" : "rgba(255,255,255,.16)"}`,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".1em",
      transition: "all 160ms"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 9h.01M11 9h.01M15 9h.01M7 13h.01M15 13h.01M11 13h2"
  })), "OTHER AMOUNT"));
}

// ── slide-up numeric keypad (system-keyboard style bottom sheet) ──────────
function KeypadSheet({
  open,
  value,
  onChange,
  onClose,
  max,
  accent = "#D71921"
}) {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      const r = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(r);
    }
    setShow(false);
  }, [open]);
  const set = v => {
    let n = v;
    if (max != null) n = Math.min(n, max);
    if (n < 0) n = 0;
    onChange(n);
  };
  const tap = k => {
    if (window.playClick) window.playClick(1000 + (typeof k === "number" ? k * 40 : 0), 0.03);
    if (k === "del") return set(Math.floor(value / 10));
    if (k === "00") return set(value * 100);
    set(value * 10 + k);
  };
  if (!open) return null;
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "00", 0, "del"];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 300,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,.55)",
      opacity: show ? 1 : 0,
      transition: "opacity .25s"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "#141417",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderTop: "1px solid rgba(255,255,255,.1)",
      boxShadow: "0 -12px 40px rgba(0,0,0,.6)",
      padding: "10px 14px 22px",
      transform: show ? "translateY(0)" : "translateY(100%)",
      transition: "transform .32s cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 4,
      borderRadius: 4,
      background: "rgba(255,255,255,.2)",
      margin: "2px auto 10px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 4px 12px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".18em"
    }
  }, "ENTER AMOUNT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 28,
      color: "#fff"
    }
  }, "$", value.toLocaleString("en-US").split(",").join(" "))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 7
    }
  }, keys.map(k => /*#__PURE__*/React.createElement("button", {
    key: String(k),
    onClick: () => tap(k),
    onMouseDown: e => {
      e.currentTarget.style.background = "rgba(255,255,255,.18)";
    },
    onMouseUp: e => {
      e.currentTarget.style.background = "rgba(255,255,255,.085)";
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = "rgba(255,255,255,.085)";
    },
    style: {
      padding: "16px 0",
      borderRadius: 12,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.13)",
      color: "#fff",
      cursor: "pointer",
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 22,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background 80ms"
    }
  }, k === "del" ? /*#__PURE__*/React.createElement("svg", {
    width: "23",
    height: "23",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 5H8.5L3 12l5.5 7H21a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17 9l-5 6M12 9l5 6"
  })) : k))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginTop: 12,
      width: "100%",
      padding: "14px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".1em"
    }
  }, "DONE")));
}

// ── recent transactions ──────────────────────────────────────────────────
// C1 (UX-аудит 07.09): у прототипі були лише done/pending — не було ні
// невдалої транзакції, ні скасованої, ні деталей. Додано обидва статуси
// (карта і крипта), причину відмови та id для екрана деталей.
const CASH_TXNS = [{
  id: "TX-8842190",
  type: "deposit",
  method: "CARD",
  amount: 100,
  status: "done",
  when: "2H AGO",
  at: "SEP 8, 2026 · 09:14"
}, {
  id: "TX-8842177",
  type: "deposit",
  method: "CARD",
  amount: 500,
  status: "failed",
  when: "4H AGO",
  at: "SEP 8, 2026 · 07:02",
  reason: "Your bank declined the payment. Nothing was charged — try another card or pay with crypto."
}, {
  id: "TX-8841903",
  type: "withdraw",
  method: "CRYPTO",
  amount: 500,
  status: "pending",
  when: "YESTERDAY",
  at: "SEP 7, 2026 · 21:40",
  note: "On its way. Crypto payouts usually land within 10 minutes."
}, {
  id: "TX-8841755",
  type: "withdraw",
  method: "CRYPTO",
  amount: 900,
  status: "failed",
  when: "2D AGO",
  at: "SEP 6, 2026 · 18:22",
  reason: "The receiving address was rejected by the network. The amount is back on your balance."
}, {
  id: "TX-8841402",
  type: "deposit",
  method: "CRYPTO",
  amount: 250,
  status: "done",
  when: "3D AGO",
  at: "SEP 5, 2026 · 12:08"
}, {
  id: "TX-8841120",
  type: "withdraw",
  method: "CARD",
  amount: 300,
  status: "canceled",
  when: "4D AGO",
  at: "SEP 4, 2026 · 16:35",
  reason: "You cancelled this withdrawal before it was processed."
}, {
  id: "TX-8840988",
  type: "withdraw",
  method: "CARD",
  amount: 120,
  status: "done",
  when: "5D AGO",
  at: "SEP 3, 2026 · 11:51"
}];
const TX_TONE = {
  done: "#5BD96A",
  pending: "#f0c75e",
  failed: "#E5484D",
  canceled: "#8A8A93"
};
function TxRow({
  tx,
  accent,
  onOpen
}) {
  const dep = tx.type === "deposit";
  const statusColor = TX_TONE[tx.status] || "#5BD96A";
  const bad = tx.status === "failed";
  const dim = bad || tx.status === "canceled";
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, .03);
      onOpen && onOpen(tx);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "11px 4px",
      cursor: onOpen ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 32,
      height: 32,
      borderRadius: 12,
      flex: "none",
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.13)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: bad ? "#E5484D" : dep ? "#5BD96A" : "rgba(255,255,255,.7)",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, dep ? /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M6 13l6 6 6-6"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M12 19V5M6 11l6-6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_C,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, dep ? "DEPOSIT" : "WITHDRAW"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_C,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em",
      marginTop: 2
    }
  }, tx.method, " \xB7 ", tx.when)), /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "right",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 14,
      color: dim ? "rgba(255,255,255,.45)" : dep ? "#fff" : "rgba(255,255,255,.85)",
      textDecoration: dim ? "line-through" : "none"
    }
  }, dep ? "+" : "−", "$", tx.amount.toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: statusColor,
      letterSpacing: ".14em",
      marginTop: 2
    }
  }, tx.status.toUpperCase())));
}
Object.assign(window, {
  AmountEntry,
  KeypadSheet,
  CASH_TXNS,
  TxRow,
  TX_TONE
});
// Transaction History — the ledger behind WALLET → TRANSACTION HISTORY.
// Structure follows the room's own records page: a currency tab per balance,
// an operation + period filter with SEARCH, then a DATE / OPERATION / AMOUNT /
// BALANCE table with paging. Design is ours: black, mono, Arcanium red.

const MONO_TX = UI.font;
const SANS_TX = UI.fontUI;
const TX_CURRENCIES = [{
  id: "usd",
  label: "USD",
  unit: "$",
  open: 18.39
}, {
  id: "cash",
  label: "CASH$",
  unit: "C$",
  open: 482.5
}, {
  id: "tourney",
  label: "TOURNEY$",
  unit: "T$",
  open: 170
}, {
  id: "ticket",
  label: "TICKETS",
  unit: "",
  open: 4
}];
const TX_OPS = [{
  id: "all",
  label: "ALL OPERATIONS"
}, {
  id: "cash",
  label: "CASH GAMES"
}, {
  id: "tourney",
  label: "TOURNAMENTS"
}, {
  id: "money",
  label: "DEPOSITS & WITHDRAWALS"
}, {
  id: "bonus",
  label: "BONUSES & REWARDS"
}];
const TX_PERIODS = ["LAST 7 DAYS", "LAST 30 DAYS", "LAST 90 DAYS", "LAST 180 DAYS"];

// one ledger per currency; amounts are signed, balance is the running total
const TX_LEDGERS = {
  usd: [{
    d: "2026/08/28 19:24:44",
    op: "Cash out — NLH cash game ($1 / $2)",
    kind: "cash",
    a: 412.5
  }, {
    d: "2026/08/28 17:02:10",
    op: "Buy-in — NLH cash game ($1 / $2)",
    kind: "cash",
    a: -200
  }, {
    d: "2026/08/27 21:47:03",
    op: "Withdrawal — USDT TRC-20",
    kind: "money",
    a: -1500
  }, {
    d: "2026/08/27 12:13:07",
    op: "Cash out — PLO6 cash game ($0.50 / $1)",
    kind: "cash",
    a: 188.4
  }, {
    d: "2026/08/26 12:09:10",
    op: "Buy-in — PLO6 cash game ($0.50 / $1)",
    kind: "cash",
    a: -100
  }, {
    d: "2026/08/26 09:31:55",
    op: "Deposit — Visa •••• 4417",
    kind: "money",
    a: 2000
  }, {
    d: "2026/08/25 23:18:29",
    op: "Rakeback — weekly payout",
    kind: "bonus",
    a: 74.2
  }, {
    d: "2026/08/25 20:41:16",
    op: "Prize — Daily Main Event, 14th",
    kind: "tourney",
    a: 640
  }, {
    d: "2026/08/25 18:00:02",
    op: "Registration — Daily Main Event",
    kind: "tourney",
    a: -110
  }, {
    d: "2026/08/24 16:04:13",
    op: "Cash out — Short Deck cash game ($2 / $4)",
    kind: "cash",
    a: 138
  }, {
    d: "2026/08/24 14:22:47",
    op: "Buy-in — Short Deck cash game ($2 / $4)",
    kind: "cash",
    a: -400
  }, {
    d: "2026/08/23 11:05:38",
    op: "Deposit — USDT TRC-20",
    kind: "money",
    a: 1000
  }],
  cash: [{
    d: "2026/08/28 18:12:44",
    op: "Cashback — Cash$ conversion",
    kind: "bonus",
    a: -120
  }, {
    d: "2026/08/27 19:30:11",
    op: "Buy-in — NLH cash game ($0.25 / $0.50)",
    kind: "cash",
    a: -50
  }, {
    d: "2026/08/27 15:44:02",
    op: "Cash out — NLH cash game ($0.25 / $0.50)",
    kind: "cash",
    a: 84.5
  }, {
    d: "2026/08/26 22:19:35",
    op: "Bonus — welcome offer release",
    kind: "bonus",
    a: 250
  }, {
    d: "2026/08/25 13:07:20",
    op: "Buy-in — Fast Poker ($0.50 / $1)",
    kind: "cash",
    a: -100
  }],
  tourney: [{
    d: "2026/08/28 20:31:00",
    op: "Registration — Bounty Express",
    kind: "tourney",
    a: -25
  }, {
    d: "2026/08/27 21:15:42",
    op: "Unregister — Spring Millions",
    kind: "tourney",
    a: 55
  }, {
    d: "2026/08/27 17:31:49",
    op: "Registration — Spring Millions",
    kind: "tourney",
    a: -55
  }, {
    d: "2026/08/26 12:48:03",
    op: "Prize — Bounty Brunch, 3rd",
    kind: "tourney",
    a: 180
  }, {
    d: "2026/08/25 09:12:56",
    op: "Reward — mission payout",
    kind: "bonus",
    a: 40
  }],
  ticket: [{
    d: "2026/08/28 10:02:19",
    op: "Ticket used — Duck Hunt entry",
    kind: "tourney",
    a: -1
  }, {
    d: "2026/08/27 08:44:51",
    op: "Ticket won — Step 2 satellite",
    kind: "tourney",
    a: 1
  }, {
    d: "2026/08/25 19:20:07",
    op: "Ticket granted — daily check-in day 45",
    kind: "bonus",
    a: 2
  }, {
    d: "2026/08/22 16:38:30",
    op: "Ticket used — Sunday Million entry",
    kind: "tourney",
    a: -1
  }]
};
const txAmt = (n, unit) => (n > 0 ? "+" : "\u2212") + (unit ? unit : "") + Math.abs(n).toLocaleString("en-US", {
  minimumFractionDigits: unit ? 2 : 0,
  maximumFractionDigits: unit ? 2 : 0
}).split(",").join("\u00A0");
const txBal = (n, unit) => (unit || "") + n.toLocaleString("en-US", {
  minimumFractionDigits: unit ? 2 : 0,
  maximumFractionDigits: unit ? 2 : 0
}).split(",").join("\u00A0");
function TxSelect({
  value,
  options,
  onPick,
  accent,
  flex
}) {
  const [open, setOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: flex || 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, .03);
      setOpen(!open);
    },
    style: {
      width: "100%",
      height: 34,
      padding: "0 11px",
      borderRadius: 12,
      cursor: "pointer",
      background: "rgba(255,255,255,.055)",
      border: `1px solid ${open ? accent : "rgba(255,255,255,.14)"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      fontFamily: SANS_TX,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#fff"
    }
  }, value), /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.5)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none",
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 160ms"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 38,
      left: 0,
      right: 0,
      zIndex: 9,
      borderRadius: 12,
      overflow: "hidden",
      background: "#141419",
      border: "1px solid rgba(255,255,255,.14)",
      boxShadow: "0 16px 34px rgba(0,0,0,.66)"
    }
  }, options.map((o, i) => /*#__PURE__*/React.createElement("button", {
    key: o,
    onClick: () => {
      if (window.playClick) window.playClick(1050, .03);
      onPick(o);
      setOpen(false);
    },
    style: {
      width: "100%",
      padding: "11px 12px",
      textAlign: "left",
      cursor: "pointer",
      border: 0,
      borderTop: i ? "1px solid rgba(255,255,255,.07)" : 0,
      background: o === value ? `${accent}1f` : "transparent",
      fontFamily: SANS_TX,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      color: o === value ? "#fff" : "rgba(255,255,255,.68)"
    }
  }, o))));
}
const TX_PAGE = 8;
function TransactionHistory({
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
  const [cur, setCur] = React.useState("usd");
  const [op, setOp] = React.useState(TX_OPS[0].label);
  const [period, setPeriod] = React.useState(TX_PERIODS[3]);
  const [applied, setApplied] = React.useState({
    op: TX_OPS[0].label,
    period: TX_PERIODS[3]
  });
  const [page, setPage] = React.useState(0);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    setCur("usd");
    setOp(TX_OPS[0].label);
    setPeriod(TX_PERIODS[3]);
    setApplied({
      op: TX_OPS[0].label,
      period: TX_PERIODS[3]
    });
    setPage(0);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  React.useEffect(() => {
    setPage(0);
  }, [cur, applied]);
  if (!open) return null;
  const C = TX_CURRENCIES.find(c => c.id === cur) || TX_CURRENCIES[0];
  const opId = (TX_OPS.find(o => o.label === applied.op) || TX_OPS[0]).id;
  const days = {
    "LAST 7 DAYS": 7,
    "LAST 30 DAYS": 30,
    "LAST 90 DAYS": 90,
    "LAST 180 DAYS": 180
  }[applied.period] || 180;

  // running balance walks backwards from the current balance, newest first
  const all = TX_LEDGERS[cur] || [];
  let bal = C.open;
  const withBal = all.map(t => {
    const row = {
      ...t,
      bal
    };
    bal = Math.round((bal - t.a) * 100) / 100;
    return row;
  });
  const cutoff = Date.now() - days * 86400000;
  const rows = withBal.filter(t => (opId === "all" || t.kind === opId) && new Date(t.d.replace(/\//g, "-").replace(" ", "T")).getTime() >= cutoff);
  const pages = Math.max(1, Math.ceil(rows.length / TX_PAGE));
  const shown = rows.slice(page * TX_PAGE, page * TX_PAGE + TX_PAGE);
  const dirty = op !== applied.op || period !== applied.period;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      background: "#000",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 220,
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
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.04);
      onClose();
    },
    "aria-label": "Back",
    style: {
      flex: "none",
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
      flex: 1,
      textAlign: "center",
      marginRight: 36,
      fontFamily: MONO_TX,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "TRANSACTIONS")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 4,
      display: "flex",
      gap: 6,
      padding: "6px 16px 0",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, TX_CURRENCIES.map(c => {
    const on = c.id === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => {
        if (window.playClick) window.playClick(1150, .03);
        setCur(c.id);
      },
      style: {
        flex: "none",
        height: 32,
        padding: "0 13px",
        borderRadius: 125,
        cursor: "pointer",
        background: on ? accent : "rgba(255,255,255,.055)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.14)"}`,
        fontFamily: SANS_TX,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: on ? "#fff" : "rgba(255,255,255,.6)",
        whiteSpace: "nowrap"
      }
    }, c.label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 3,
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "10px 16px 0"
    }
  }, /*#__PURE__*/React.createElement(TxSelect, {
    value: op,
    options: TX_OPS.map(o => o.label),
    onPick: setOp,
    accent: accent,
    flex: 1.35
  }), /*#__PURE__*/React.createElement(TxSelect, {
    value: period,
    options: TX_PERIODS,
    onPick: setPeriod,
    accent: accent
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1300, .04);
      setApplied({
        op,
        period
      });
    },
    style: {
      flex: "none",
      height: 34,
      padding: "0 14px",
      borderRadius: 12,
      cursor: "pointer",
      border: 0,
      background: dirty ? accent : "rgba(255,255,255,.085)",
      color: dirty ? "#fff" : "rgba(255,255,255,.55)",
      boxShadow: dirty ? `0 6px 16px ${accent}44` : "none",
      fontFamily: SANS_TX,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      transition: "all 140ms"
    }
  }, "SEARCH")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "12px 16px 0",
      padding: "0 12px 7px",
      borderBottom: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: SANS_TX,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, "DATE \xB7 OPERATION"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 78,
      textAlign: "right",
      fontFamily: SANS_TX,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, "AMOUNT"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 74,
      textAlign: "right",
      fontFamily: SANS_TX,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, "BALANCE")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      position: "relative",
      zIndex: 2,
      padding: "0 16px 30px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 14,
      overflow: "hidden",
      background: "linear-gradient(150deg,#141419 0%,#0c0c0f 62%,#0a0a0c 100%)",
      border: "1px solid rgba(255,255,255,.08)",
      marginTop: 8
    }
  }, shown.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "42px 0",
      fontFamily: SANS_TX,
      fontWeight: 600,
      fontSize: 12,
      color: "#A9A9B2",
      letterSpacing: ".06em"
    }
  }, "Nothing in this period."), shown.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: t.d + i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "11px 12px",
      borderTop: i ? "1px solid rgba(255,255,255,.07)" : 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TX,
      fontWeight: 600,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".01em",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, t.op), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: MONO_TX,
      fontSize: 10.5,
      color: "#8A8A93",
      letterSpacing: ".04em"
    }
  }, t.d)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 78,
      textAlign: "right",
      fontFamily: MONO_TX,
      fontWeight: 700,
      fontSize: 12,
      fontVariantNumeric: "tabular-nums",
      color: t.a > 0 ? "#5BD96A" : accent
    }
  }, txAmt(t.a, C.unit)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 74,
      textAlign: "right",
      fontFamily: MONO_TX,
      fontWeight: 700,
      fontSize: 12,
      fontVariantNumeric: "tabular-nums",
      color: "#D8D8DF"
    }
  }, txBal(t.bal, C.unit))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: SANS_TX,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#8A8A93"
    }
  }, rows.length, " RECORDS"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(950, .03);
      setPage(Math.max(0, page - 1));
    },
    disabled: page === 0,
    style: {
      flex: "none",
      width: 30,
      height: 30,
      borderRadius: 12,
      cursor: page === 0 ? "default" : "pointer",
      padding: 0,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.14)",
      opacity: page === 0 ? .35 : 1,
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
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), Array.from({
    length: pages
  }, (_, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => {
      if (window.playClick) window.playClick(1100, .03);
      setPage(i);
    },
    style: {
      flex: "none",
      minWidth: 30,
      height: 30,
      borderRadius: 12,
      cursor: "pointer",
      padding: "0 6px",
      background: i === page ? accent : "rgba(255,255,255,.06)",
      border: `1px solid ${i === page ? accent : "rgba(255,255,255,.14)"}`,
      fontFamily: MONO_TX,
      fontWeight: 700,
      fontSize: 12,
      color: i === page ? "#fff" : "rgba(255,255,255,.6)"
    }
  }, i + 1)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(950, .03);
      setPage(Math.min(pages - 1, page + 1));
    },
    disabled: page >= pages - 1,
    style: {
      flex: "none",
      width: 30,
      height: 30,
      borderRadius: 12,
      cursor: page >= pages - 1 ? "default" : "pointer",
      padding: 0,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.14)",
      opacity: page >= pages - 1 ? .35 : 1,
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
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))))));
}
Object.assign(window, {
  TransactionHistory
});
// Cashier — shared building blocks for the deposit/withdraw system.
// On-brand: Space Mono / Roboto, Arcanium red, dot-matrix, pure black.

const MONO_C = UI.font;
const SANS_C = UI.fontUI;

// ── payment / payout methods ─────────────────────────────────────────────
const CASH_METHODS = [{
  id: "card",
  label: "CARD",
  sub: "Visa · Mastercard",
  time: "INSTANT"
}, {
  id: "crypto",
  label: "CRYPTO",
  sub: "USDT · BTC · ETH",
  time: "~10 MIN"
}];
function CashGlyph({
  id,
  on,
  accent = "#D71921"
}) {
  const c = on ? "#fff" : "rgba(255,255,255,.55)";
  const P = {
    width: 22,
    height: 22,
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
        d: "M2.5 9h13a2 2 0 0 1 2 2"
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

// ── method picker — stacked rows with sub + payout time ──────────────────
function MethodPicker({
  value,
  onChange,
  accent = "#D71921"
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, CASH_METHODS.map(m => {
    const on = m.id === value;
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      onClick: () => {
        if (window.playClick) window.playClick(1000, 0.03);
        onChange(m.id);
      },
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        padding: "12px 13px",
        borderRadius: 12,
        cursor: "pointer",
        background: on ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.06)",
        border: `1px solid ${on ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.14)"}`,
        transition: "all 140ms",
        textAlign: "left"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 12,
        flex: "none",
        background: on ? `${accent}26` : "rgba(255,255,255,.075)",
        border: `1px solid ${on ? accent + "66" : "rgba(255,255,255,.13)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(CashGlyph, {
      id: m.id,
      on: on,
      accent: accent
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: MONO_C,
        fontSize: 14,
        color: "#fff",
        letterSpacing: ".04em"
      }
    }, m.label), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: SANS_C,
        fontWeight: 600,
        fontSize: 10.5,
        color: "#A9A9B2",
        letterSpacing: ".06em",
        marginTop: 3
      }
    }, m.sub)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_C,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".12em",
        color: on ? accent : "rgba(255,255,255,.4)",
        padding: "3px 7px",
        borderRadius: 5,
        background: on ? `${accent}1f` : "rgba(255,255,255,.065)",
        flex: "none"
      }
    }, m.time), /*#__PURE__*/React.createElement("span", {
      style: {
        width: 18,
        height: 18,
        borderRadius: "50%",
        flex: "none",
        border: `2px solid ${on ? accent : "rgba(255,255,255,.2)"}`,
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
      strokeWidth: "3.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 6"
    }))));
  }));
}
Object.assign(window, {
  MONO_C,
  SANS_C,
  CASH_METHODS,
  CashGlyph,
  MethodPicker
});
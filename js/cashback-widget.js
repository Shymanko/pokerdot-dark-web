// Cashback safe — lobby widget. МІГРАЦІЯ: відкриття за порогом накопичення
// (1 000 XP, серверна настройка), таймери і «раз на день» скасовані.
// Надлишок понад поріг НЕ згорає — шкала і значення переповнення видимі.
const CBW_MONO = UI.font;
const CBW_SANS = UI.fontUI;
const CBW_GOLD = "#f0c75e";
function CashbackWidget({
  onOpen,
  accent = "#D71921"
}) {
  const P = window.cmPlayer || {
    level: 24,
    safeXp: 1380,
    safeThreshold: 1000
  };
  const L = window.cmLeague;
  const lg = L ? L.forLevel(P.level) : {
    name: "CLUBS",
    suit: "♣",
    color: "#2FA84F",
    ink: "#fff"
  };
  const rank = L && L.rankForLevel ? L.rankForLevel(P.level) : "Q";
  const TH = P.safeThreshold || 1000;
  const xp = P.safeXp || 0;
  const ready = xp >= TH;
  const overflow = Math.max(0, xp - TH);
  const barPct = Math.max(0, Math.min(1, xp / TH));
  return /*#__PURE__*/React.createElement("div", {
    onClick: onOpen,
    style: {
      margin: "20px 14px 0",
      cursor: onOpen ? "pointer" : "default",
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      background: "linear-gradient(150deg,#1e1e26,#0b0b0d)",
      border: `1px solid ${ready ? lg.color + "55" : "rgba(255,255,255,.14)"}`,
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("style", null, "@keyframes cbw-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes cbw-spin{from{transform:translateX(0)}to{transform:translateX(-98.3333%)}}"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 55% 95% at 6% 50%, ${lg.color}22, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      width: 84,
      height: 84,
      overflow: "hidden"
    }
  }, window.RbHouse3D && /*#__PURE__*/React.createElement(window.RbHouse3D, {
    floors: window.chFloors(P.level, xp),
    w: 150,
    h: 150
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CBW_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".06em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, "CARD HOUSE"), /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      fontFamily: CBW_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      marginTop: 5,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: lg.color
    }
  }, lg.suit, " ", rank), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93"
    }
  }, " \xB7 ", xp.toLocaleString("en-US").split(",").join(" "), " / ", TH.toLocaleString("en-US").split(",").join(" "), " XP")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      borderRadius: 3,
      background: "rgba(255,255,255,.13)",
      overflow: "hidden",
      marginTop: 11,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${Math.min(1, barPct) * 100}%`,
      height: "100%",
      borderRadius: 3,
      background: ready ? lg.color : "rgba(255,255,255,.5)",
      transition: "width .4s"
    }
  }), overflow > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      right: 0,
      width: `${Math.min(40, Math.round(overflow / TH * 100))}%`,
      background: "repeating-linear-gradient(48deg, rgba(240,199,94,.85) 0 3px, rgba(240,199,94,.35) 3px 6px)",
      borderRadius: 3
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CBW_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: ready ? CBW_GOLD : "rgba(255,255,255,.5)",
      marginTop: 8,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, ready ? overflow > 0 ? "+" + overflow + " XP STACKED · NOTHING BURNS" : "OPEN ANYTIME" : "FILLS AS YOU PLAY")), ready && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: "none",
      alignSelf: "center",
      display: "inline-flex",
      alignItems: "center",
      height: 44,
      padding: "0 18px",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      fontFamily: CBW_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".1em",
      animation: "cbw-pulse 1.6s ease-in-out infinite",
      whiteSpace: "nowrap",
      boxShadow: `0 6px 16px ${accent}66`
    }
  }, "OPEN \u203A"));
}
Object.assign(window, {
  CashbackWidget
});
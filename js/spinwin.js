// Spin & Win — game lobby. Opens when the SPIN & WIN discipline is chosen
// (instead of stakes → buy-in). Pokerdot house style: pure black, dot-matrix,
// Arcanium red selection, white numerals (no gold, no gems). Tiers are
// full-width rows mirroring the MTT EventRow structure.

const MONO_S = UI.font;
const SANS_S = UI.fontUI;

// listed cheapest → dearest, like every other limit list in the app
// E12 (UX-аудит 07.09): online — це НЕ «скільки зараз чекає в лоббі»
// (таке число стрибає і при добрій ліквідності майже завжди нуль), а скільки
// гравців грає на цьому ліміті просто зараз: показує популярність формату
// і шанс швидко сісти за стіл.
const SW_TIERS = [{
  prize: "$5 000",
  mult: "×10",
  buyIn: "$0.25",
  online: 418
}, {
  prize: "$10 000",
  mult: "×40",
  buyIn: "$1",
  online: 1246
}, {
  prize: "$30 000",
  mult: "×120",
  buyIn: "$3",
  online: 742
}, {
  prize: "$50 000",
  mult: "×10",
  buyIn: "$5",
  online: 503
}, {
  prize: "$100 000",
  mult: "×20",
  buyIn: "$10",
  online: 287
}, {
  prize: "$200 000",
  mult: "×40",
  buyIn: "$20",
  online: 96
}];

// 3.14 — same card model as the cash / fast-poker limits: entry is the
// headline, prize and players are secondary, PLAY sits on the card itself.
function SpinWinRow({
  t,
  selected,
  onSelect,
  onPlay,
  locked,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onSelect,
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      padding: "13px 14px",
      display: "flex",
      alignItems: "center",
      gap: 12,
      cursor: "pointer",
      border: `1px solid ${selected ? accent : accent + "3d"}`,
      background: `linear-gradient(152deg,${accent}1f 0%,#141419 46%,#0d0d10 100%)`,
      boxShadow: selected ? `0 0 0 1px ${accent}, 0 10px 26px ${accent}33` : "0 8px 22px rgba(0,0,0,.55)",
      transition: "border-color .2s, box-shadow .2s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 7,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, "ENTRY"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 20,
      color: "#fff",
      letterSpacing: ".01em",
      fontVariantNumeric: "tabular-nums"
    }
  }, t.buyIn)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      marginTop: 6,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".14em",
      color: "#8A8A93"
    }
  }, "WIN UP TO"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, t.prize), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 9,
      background: "rgba(255,255,255,.16)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: t.online > 0 ? "#5BD96A" : "rgba(255,255,255,.3)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 11,
      color: "#fff",
      fontVariantNumeric: "tabular-nums"
    }
  }, t.online.toLocaleString("en-US").split(",").join("\u00A0")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".14em",
      color: "#8A8A93"
    }
  }, "PLAYING NOW"))), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      if (window.playClick) window.playClick(locked ? 700 : 1350, .04);
      onPlay(locked);
    },
    style: {
      flex: "none",
      height: 38,
      padding: "0 20px",
      borderRadius: 125,
      cursor: "pointer",
      border: 0,
      background: accent,
      color: "#fff",
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      boxShadow: `0 6px 16px ${accent}55`
    }
  }, "PLAY"), "    ");
}
function SpinWinLobby({
  open,
  onClose,
  onStart,
  accent = "#D71921",
  balance = "$4 827"
}) {
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
  const [info, setInfo] = React.useState(false); // A5: GAME INFO & RULES
  const [sel, setSel] = React.useState(1);
  const [games, setGames] = React.useState(1);
  const [insurance, setInsurance] = React.useState(false);
  const [warn, setWarn] = React.useState(null); // "not enough funds" notice

  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    setSel(1);
    setGames(1);
    setInsurance(false);
    setWarn(null);
    setInfo(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  React.useEffect(() => {
    if (!warn) return;
    const t = setTimeout(() => setWarn(null), 2600);
    return () => clearTimeout(t);
  }, [warn]);
  if (!open) return null;
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, 0.04);
  };
  const tier = SW_TIERS[sel];
  const total = parseFloat(tier.buyIn.replace(/[$,]/g, "")) * games;
  const totalStr = "$" + total.toLocaleString(undefined, {
    minimumFractionDigits: tier.buyIn.includes(".") ? 2 : 0
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 120,
      background: "#000",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 240,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}26, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.075) 0.6px, transparent 1px)",
      backgroundSize: "11px 11px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 20,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 4,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(800);
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
  }))), window.PxSectionTitle ? /*#__PURE__*/React.createElement(window.PxSectionTitle, {
    label: "SPIN & WIN",
    accent: accent,
    topInset: 104
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), window.PxBalance ? /*#__PURE__*/React.createElement(window.PxBalance, {
    value: balance,
    onTap: () => {
      click(1250);
      if (window.openDeposit) window.openDeposit();
    }
  }) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      zIndex: 2,
      padding: "14px 16px 18px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1100);
      setInfo(true);
    },
    style: {
      width: "100%",
      margin: "0 0 14px",
      padding: "12px 14px",
      borderRadius: 14,
      cursor: "pointer",
      textAlign: "left",
      border: `1px solid ${accent}55`,
      background: `linear-gradient(155deg,${accent}1f,#0a0a0c 70%)`,
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, "GAME INFO & RULES"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2",
      marginTop: 3
    }
  }, "3-MAX \xB7 RANDOM PRIZE \xD72\u20131000 \xB7 WINNER TAKES ALL")), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), warn && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10,
      padding: "10px 13px",
      borderRadius: 12,
      background: "#1b1114",
      border: `1px solid ${accent}66`,
      boxShadow: "0 10px 26px rgba(0,0,0,.6)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      color: accent
    }
  }, "NOT ENOUGH FUNDS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".04em",
      color: "#A9A9B2",
      marginTop: 3
    }
  }, warn.buyIn, " entry \xB7 your balance ", balance)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, SW_TIERS.map((t, i) => /*#__PURE__*/React.createElement(SpinWinRow, {
    key: i,
    t: t,
    selected: i === sel,
    accent: accent,
    locked: (Number(String(balance).replace(/[^0-9.]/g, "")) || 0) < parseFloat(t.buyIn.replace(/[^0-9.]/g, "")),
    onSelect: () => {
      click(1150);
      setSel(i);
    },
    onPlay: locked => {
      if (locked) {
        setWarn(t);
        return;
      }
      setSel(i);
      onStart && onStart({
        tier: t,
        games,
        insurance
      });
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      padding: "16px 16px 26px",
      borderTop: "1px solid rgba(255,255,255,.13)",
      background: "linear-gradient(180deg, rgba(0,0,0,.4), #000 40%)",
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, "TABLES"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(700);
      setGames(Math.max(1, games - 1));
    },
    style: swStepBtn
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 28,
      textAlign: "center",
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 20,
      color: "#fff"
    }
  }, games), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1500);
      setGames(Math.min(4, games + 1));
    },
    style: swStepBtn
  }, "+"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#A9A9B2"
    }
  }, "PLAY WITH INSURANCE"), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      click(1000);
      if (window.showTermPop) window.showTermPop("INSURANCE");
    },
    "aria-label": "About insurance",
    style: {
      flex: "none",
      width: 18,
      height: 18,
      borderRadius: "50%",
      padding: 0,
      cursor: "pointer",
      background: "transparent",
      border: "1.4px solid rgba(255,255,255,.55)",
      color: "#D8D8DF",
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, "i")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1000);
      setInsurance(!insurance);
    },
    "aria-label": "Toggle insurance",
    style: {
      flex: "none",
      width: 46,
      height: 26,
      borderRadius: 125,
      padding: 0,
      cursor: "pointer",
      background: insurance ? accent : "rgba(255,255,255,.18)",
      border: `1px solid ${insurance ? accent : "rgba(255,255,255,.2)"}`,
      position: "relative",
      transition: "background .2s, border-color .2s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 2,
      left: insurance ? 22 : 2,
      width: 20,
      height: 20,
      borderRadius: "50%",
      background: "#fff",
      transition: "left .18s cubic-bezier(.2,.8,.2,1)",
      boxShadow: "0 2px 5px rgba(0,0,0,.4)"
    }
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1900);
      onStart && onStart({
        tier,
        games,
        insurance
      });
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
      padding: "15px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 12px 28px ${accent}55`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
      transition: "transform .1s",
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".06em"
    }
  }, "PLAY NOW"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#D8D8DF"
    }
  }, "ENTRY ", totalStr, games > 1 ? " · " + games + " TABLES" : ""))), window.ClSheet && /*#__PURE__*/React.createElement(window.ClSheet, {
    z: 130,
    open: info,
    onClose: () => setInfo(false),
    title: "SPIN & WIN",
    sub: "GAME INFO & RULES"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".22em",
      color: "#A9A9B2",
      padding: "0 3px",
      margin: "14px 0 10px"
    }
  }, "GAME SETTINGS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 1,
      background: "rgba(255,255,255,.07)",
      borderRadius: 14,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,.07)"
    }
  }, [["GAME TYPE", "HOLD'EM", null], ["TABLE", "3-MAX", null], ["PLAYERS", "WINNER TAKES ALL", null], ["PRIZE", "×2–1000", "DRAWN BY THE WHEEL"], ["BLINDS", "HYPER", "UP EVERY 3 MIN"], ["STACK", "25 BB", null]].map(([l, v, sub]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: "#0c0c0e",
      padding: "13px 12px",
      minWidth: 0,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em",
      lineHeight: 1.25,
      overflowWrap: "anywhere"
    }
  }, l), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: String(v).length > 9 ? 11 : 14,
      color: "#fff",
      marginTop: 6,
      letterSpacing: ".02em"
    }
  }, v), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 8.5,
      color: "#8A8A93",
      letterSpacing: ".06em",
      marginTop: 4
    }
  }, sub)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".22em",
      color: "#A9A9B2",
      padding: "0 3px",
      margin: "18px 0 10px"
    }
  }, "HOW IT WORKS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, [["THE WHEEL SETS THE PRIZE", "Before the first hand the wheel draws a multiplier from ×2 to ×1000 — the prize is your buy-in times the multiplier."], ["THREE PLAYERS, ONE WINNER", "A 3-max hyper-turbo sprint: play until one player holds all the chips. Winner takes the whole prize."], ["MINUTES, NOT HOURS", "Short stacks and fast blinds — a game usually takes a few minutes. Play up to 4 tables at once. Optional insurance returns the buy-in if you bust the very first game."]].map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      padding: "13px 14px",
      borderRadius: 14,
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 26,
      height: 26,
      borderRadius: "50%",
      background: `${accent}1f`,
      border: `1px solid ${accent}66`,
      color: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 13
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_S,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.5,
      color: "#D8D8DF",
      marginTop: 5,
      textWrap: "pretty"
    }
  }, d)))))));
}
const swStepBtn = {
  width: 44,
  height: 44,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.28)",
  cursor: "pointer",
  background: "rgba(255,255,255,.075)",
  color: "#fff",
  fontFamily: MONO_S,
  fontSize: 21,
  lineHeight: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0
};
Object.assign(window, {
  SpinWinLobby
});
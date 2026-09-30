// screen-info.jsx — the circled "i" that sits right next to a screen title.
// Tapping it asks ONE question: leave the app for the details page?
// The dialog heading is the exact screen title, so it always names where you are.
//   <InfoDot title="HONEYMOON"/>            → url from SCREEN_INFO
//   <InfoDot title="PLO6" url="…"/>         → ad-hoc target
//   window.showScreenInfo({ title, url, accent })

const SI_MONO = UI.font;
const SI_SANS = UI.fontUI;
const SI_BASE = "https://pokerdot.com/help/";

// title → details page slug on the website
const SCREEN_INFO = {
  "HONEYMOON": "honeymoon",
  "DAILY CHECK-IN": "daily-check-in",
  "ACTIVITIES": "activities",
  "COMPETITIONS": "competitions",
  "GRAND JACKPOT": "grand-jackpot",
  "CASHBACK": "cashback",
  "UNIVERSAL TICKET": "universal-ticket",
  "INVITE A FRIEND": "invite-a-friend",
  "TOURNAMENTS": "tournaments",
  "MY TOURNAMENTS": "my-tournaments",
  "STARTER REWARDS": "starter-rewards",
  "TRANSACTIONS": "transactions",
  "FAST POKER": "fast-poker",
  "CLASSIC POKER": "classic-poker",
  "SPIN & WIN": "spin-and-win",
  "CASH GAMES": "cash-games",
  "HOLD'EM": "holdem",
  "PLO": "plo",
  "PLO4": "plo",
  "PLO5": "plo5",
  "PLO6": "plo6",
  "SHORT DECK": "short-deck",
  "REFERRAL REWARDS": "referral-rewards",
  "CERTIFIED RNG": "rng-certificate",
  "QUICK POKER": "spin-and-win",
  "OTHER FORMATS": "cash-games",
  "FLASH & FLUSH": "flash-and-flush",
  "BOMB POT": "bomb-pot",
  "BALANCES": "balances",
  "USD BALANCE": "balances",
  "CASH$ BALANCE": "balances",
  "TOURNEY$ BALANCE": "balances",
  "AUTO RE-BUY": "auto-rebuy"
};

// F3 (правки продукту 07.09): баланси пояснюються прямо в додатку —
// раніше (i) вів на сайт, а описи Cash$/Tourneys$ були неправильні.
// Правильно: Cash$ — вхід у кеш-ігри, Tourneys$ — реєстрація в MTT і
// Spin&Win, обидві валюти НЕвивідні.
const SI_BODY = {
  "USD BALANCE": "Your main balance. Deposits land here, and it is the only balance you can withdraw. Plays everywhere: cash games, tournaments, Spin & Win.",
  "CASH$ BALANCE": "Bonus currency for cash games — use it to buy in at any cash table. Cash$ cannot be withdrawn.",
  "TOURNEY$ BALANCE": "Bonus currency for tournaments — use it to register for MTTs and Spin & Win. Tourneys$ cannot be withdrawn.",
  "BALANCES": "USD is your withdrawable money. Cash$ buys you into cash games, Tourneys$ registers you for MTTs and Spin & Win — both bonus currencies stay in the game and cannot be withdrawn."
};
const siUrl = (title, url) => url || SI_BASE + (SCREEN_INFO[title] || String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));

// the "i" as a pixel-grid SVG — the font's lowercase i sits off-centre in a
// circle, so the glyph is drawn instead: 2px dot, 1px gap, 5px stem.
function SiGlyph({
  px = 10,
  color = "currentColor"
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: px,
    height: px,
    viewBox: "0 0 10 10",
    fill: color,
    shapeRendering: "crispEdges",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "1",
    width: "2",
    height: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "4",
    width: "2",
    height: "5"
  }));
}

// ── the circled "i" — sits inline, right after the title text ───────────────
function InfoDot({
  title,
  url,
  accent = "#D71921",
  size = 19,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      if (window.playClick) window.playClick(1500, 0.03);
      if (window.showScreenInfo) window.showScreenInfo({
        title,
        url,
        accent
      });
    },
    "aria-label": "Details about " + title,
    style: Object.assign({
      flex: "none",
      width: size,
      height: size,
      borderRadius: 125,
      padding: 0,
      cursor: "pointer",
      background: "rgba(255,255,255,.09)",
      border: "1px solid rgba(255,255,255,.34)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#D8D8DF"
    }, style || {})
  }, /*#__PURE__*/React.createElement(SiGlyph, {
    px: Math.max(9, Math.round(size * 0.5))
  }));
}

// ── the confirm window: "leave for the details page?" ──────────────────────
function ScreenInfoSheet({
  data,
  onClose
}) {
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    if (!data) {
      setUp(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [data]);
  if (!data) return null;
  const accent = data.accent || "#D71921";
  const href = siUrl(data.title, data.url);
  const go = () => {
    if (window.playClick) window.playClick(1700, 0.04);
    try {
      window.open(href, "_blank", "noopener");
    } catch (e) {}
    onClose();
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 120,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 22px",
      background: "rgba(0,0,0,.74)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      opacity: up ? 1 : 0,
      transition: "opacity 170ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      position: "relative",
      overflow: "hidden",
      width: "100%",
      maxWidth: 306,
      boxSizing: "border-box",
      borderRadius: 20,
      border: `1px solid ${accent}80`,
      padding: "20px 18px 18px",
      textAlign: "center",
      background: `linear-gradient(150deg, ${accent}30 0%, ${accent}0f 40%, #0c0c0f 76%, #0a0a0c 100%)`,
      boxShadow: "0 26px 60px rgba(0,0,0,.7)",
      transform: up ? "scale(1)" : "scale(.93)",
      transition: "transform 190ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.07) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 70%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: SI_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: accent
    }
  }, data.body ? data.kicker || "HOW IT WORKS" : "OPENS THE HELP PAGE"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 9,
      fontFamily: SI_MONO,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".14em",
      color: "#fff",
      textWrap: "pretty"
    }
  }, data.title), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 11,
      fontFamily: SI_SANS,
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.5,
      color: "#D8D8DF",
      textWrap: "pretty",
      whiteSpace: "pre-line",
      textAlign: data.body ? "left" : "center"
    }
  }, data.body ? Array.isArray(data.body) ? data.body.map((t, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "block",
      marginTop: i ? 9 : 0
    }
  }, t)) : data.body : /*#__PURE__*/React.createElement("span", null, "The full guide for ", data.title, " opens on our website, with a way back to the app. Open it?")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 17,
      display: "flex",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: Object.assign(UI.btn("m", data.body ? "primary" : "ghost", accent), {
      flex: 1
    })
  }, data.body ? "GOT IT" : "NO"), data.body && data.noLink ? null : /*#__PURE__*/React.createElement("button", {
    onClick: go,
    style: Object.assign(UI.btn("m", data.body ? "ghost" : "primary", accent), {
      flex: 1
    })
  }, data.body ? "DETAILS" : "YES"))));
}

// single host: mount once, drive from anywhere via window.showScreenInfo()
function ScreenInfoHost() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    window.showScreenInfo = p => {
      const d = typeof p === "string" ? {
        title: p
      } : p || null;
      // якщо для екрана є пояснення в додатку — показуємо його, а не «відкрити сайт»
      if (d && !d.body && SI_BODY[d.title]) {
        d.body = SI_BODY[d.title];
        d.noLink = true;
      }
      setData(d);
    };
    return () => {
      delete window.showScreenInfo;
    };
  }, []);
  return /*#__PURE__*/React.createElement(ScreenInfoSheet, {
    data: data,
    onClose: () => setData(null)
  });
}
Object.assign(window, {
  SiGlyph,
  InfoDot,
  ScreenInfoSheet,
  ScreenInfoHost,
  SCREEN_INFO,
  SI_BODY
});
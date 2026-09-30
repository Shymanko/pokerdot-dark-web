// Покерні терміни (правка L3 СЕО, друга частина): термін, який не
// перекладається, клікабельний і відкриває ОДИН рядок пояснення.
//   window.Term       — обгортка-підкреслення для підпису (пунктир, тап)
//   window.TermHost   — шторка з поясненням, монтується один раз у корені
//   window.showTermPop("BUY-IN") — відкрити пояснення з будь-якого коду
// Мова пояснення — з перемикача мови (localStorage pokerix_lang), тому
// шторка позначена data-i18n="off": DOM-перекладач її не чіпає.

const PX_TERMS = {
  "BUY-IN": {
    en: "Buy-in — what you pay to take a seat or enter a tournament.",
    ru: "Вход — сумма, которую платят за место за столом или за участие в турнире."
  },
  "BLINDS": {
    en: "Blinds — forced bets posted before the cards are dealt; they set the stakes.",
    ru: "Блайнды — обязательные ставки до раздачи карт, они задают лимит стола."
  },
  "BLIND LEVELS": {
    en: "Blind levels — in tournaments the forced bets grow on a timer, level by level.",
    ru: "Уровни блайндов — в турнирах обязательные ставки растут по таймеру, уровень за уровнем."
  },
  "ANTE": {
    en: "Ante — a small forced bet from every player, every hand.",
    ru: "Анте — небольшая обязательная ставка каждого игрока в каждой раздаче."
  },
  "BB": {
    en: "BB — the big blind; stacks and buy-ins are often measured in it.",
    ru: "ББ — большой блайнд; в нём принято мерить стеки и входы."
  },
  "STARTING STACK": {
    en: "Starting stack — the chips every player begins the tournament with.",
    ru: "Стартовый стек — фишки, с которыми каждый игрок начинает турнир."
  },
  "BOUNTY": {
    en: "Bounty — a cash prize for every player you knock out.",
    ru: "Баунти — денежный приз за каждого выбитого игрока."
  },
  "SATELLITE": {
    en: "Satellite — a cheap tournament that pays seats to a bigger one.",
    ru: "Сателлит — дешёвый турнир, призы в котором — билеты в более дорогой."
  },
  "RE-ENTRY": {
    en: "Re-entry — bust out and you may pay the buy-in to enter again.",
    ru: "Ре-энтри — после вылета можно ещё раз заплатить вход и играть снова."
  },
  "LATE REG": {
    en: "Late reg — you can still register for a while after the start.",
    ru: "Поздняя регистрация — вход открыт ещё некоторое время после старта."
  },
  "SIT OUT": {
    en: "Sit out — skip hands while keeping your seat and chips.",
    ru: "Сит-аут — пропускать раздачи, сохраняя место и фишки."
  },
  "BAD BEAT": {
    en: "Bad beat — losing with a monster hand to an unlikely draw.",
    ru: "Бэд-бит — проигрыш с очень сильной рукой из-за редкого прихода."
  },
  "BANKROLL": {
    en: "Bankroll — the money you set aside just for poker.",
    ru: "Банкролл — деньги, отложенные только на покер."
  },
  "9-MAX": {
    en: "9-max — a full table of nine players.",
    ru: "9-max — полный стол на девять игроков."
  },
  "HOLD'EM": {
    en: "Hold'em — two cards in hand, five on the board. The classic game.",
    ru: "Холдем — две карты на руках, пять на столе. Классика."
  },
  "SHORT DECK": {
    en: "Short deck — hold'em with a 36-card deck, sixes and up.",
    ru: "Короткая колода — холдем колодой в 36 карт, от шестёрок и выше."
  },
  "PLO": {
    en: "PLO — pot-limit Omaha: 4–6 cards in hand, exactly two must play.",
    ru: "ПЛО — пот-лимит Омаха: 4–6 карт на руках, играют ровно две."
  },
  "LEADERBOARD": {
    en: "Leaderboard — a running ranking of players with its own prizes.",
    ru: "Лидерборд — текущий рейтинг игроков со своими призами."
  },
  "SPIN & WIN": {
    en: "Spin & Win — a 3-player sprint with a random prize multiplier.",
    ru: "Spin & Win — спринт на троих со случайным множителем приза."
  },
  "ENTRY FROM": {
    en: "Entry from — the smallest buy-in this game is played for.",
    ru: "Вход от — минимальный вход, с которым играют в эту игру."
  },
  "BUBBLE": {
    en: "Bubble — the last spot before the prizes: bust here and you leave with nothing.",
    ru: "Баббл — последнее место перед призами: вылет здесь оставляет без выплаты."
  },
  "INSURANCE": {
    en: "Insurance — for a small fee your buy-in comes back if you bust the very first game.",
    ru: "Страховка — за небольшую комиссию вход вернётся, если вылетите в самой первой игре."
  }
};

// російські назви термінів — для заголовка шторки при російській мові
const PX_TERM_RU = {
  "BUY-IN": "ВХОД",
  "BLINDS": "БЛАЙНДЫ",
  "BLIND LEVELS": "УРОВНИ БЛАЙНДОВ",
  "ANTE": "АНТЕ",
  "BB": "ББ",
  "STARTING STACK": "СТАРТОВЫЙ СТЕК",
  "BOUNTY": "БАУНТИ",
  "SATELLITE": "САТЕЛЛИТ",
  "RE-ENTRY": "РЕ-ЭНТРИ",
  "LATE REG": "ПОЗДНЯЯ РЕГИСТРАЦИЯ",
  "SIT OUT": "СИТ-АУТ",
  "BAD BEAT": "БЭД-БИТ",
  "BANKROLL": "БАНКРОЛЛ",
  "9-MAX": "9-MAX",
  "HOLD'EM": "ХОЛДЕМ",
  "SHORT DECK": "КОРОТКАЯ КОЛОДА",
  "PLO": "ПЛО",
  "LEADERBOARD": "ЛИДЕРБОРД",
  "SPIN & WIN": "SPIN & WIN",
  "ENTRY FROM": "ВХОД ОТ",
  "INSURANCE": "СТРАХОВКА",
  "BUBBLE": "БАББЛ"
};

// підпис-термін: пунктирне підкреслення, тап відкриває пояснення
function Term({
  k,
  children,
  style
}) {
  const key = String(k || "").toUpperCase();
  if (!PX_TERMS[key]) return /*#__PURE__*/React.createElement("span", {
    style: style
  }, children || k);
  return /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      if (window.playClick) window.playClick(1200, 0.03);
      if (window.showTermPop) window.showTermPop(key);
    },
    style: Object.assign({
      borderBottom: "1px dotted rgba(255,255,255,.42)",
      paddingBottom: 1,
      cursor: "pointer"
    }, style || {})
  }, children || k);
}

// модалка терміна — у канонічному стилі інфо-модалок апки (ScreenInfo):
// центрована картка з акцентною рамкою, градієнтом і дот-текстурою,
// кікер акцентом, назва моно, один червоний GOT IT з свіченням.
function TermHost({
  accent = "#D71921"
}) {
  const [k, setK] = React.useState(null);
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    window.showTermPop = key => {
      setK(String(key || "").toUpperCase());
      requestAnimationFrame(() => setUp(true));
    };
    return () => {
      if (window.showTermPop) window.showTermPop = null;
    };
  }, []);
  const d = k ? PX_TERMS[k] : null;
  if (!d) return null;
  let ru = false;
  if (window.PXI18N && window.PXI18N.lang) ru = window.PXI18N.lang === "ru";else {
    try {
      ru = localStorage.getItem("pokerix_lang") === "ru";
    } catch (e) {}
  }
  const close = () => {
    setUp(false);
    setTimeout(() => setK(null), 180);
  };
  const MONO = UI.font;
  const SANS = UI.fontUI;
  return /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    onClick: close,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 420,
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
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: accent
    }
  }, ru ? "ПОКЕРНЫЙ ТЕРМИН" : "POKER TERM"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 9,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".14em",
      color: "#fff",
      textWrap: "pretty"
    }
  }, ru ? PX_TERM_RU[k] || k : k), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 11,
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.5,
      color: "#D8D8DF",
      textAlign: "center",
      textWrap: "balance"
    }
  }, ru ? d.ru : d.en), /*#__PURE__*/React.createElement("button", {
    onClick: close,
    style: Object.assign(UI.btn("m", "primary", accent), {
      position: "relative",
      width: "100%",
      marginTop: 17
    })
  }, ru ? "ПОНЯТНО" : "GOT IT")));
}
Object.assign(window, {
  PX_TERMS,
  Term,
  TermHost
});
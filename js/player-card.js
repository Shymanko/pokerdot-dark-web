// player-card.jsx — профіль гравця за столом (правка 08.09).
// Відкривається тапом по будь-якому місцю за столом.
//
// Свідомо БЕЗ HUD-статистики (VPIP / PFR / 3BET / AF …): у референсі
// конкурента вона є, але ми її не використовуємо — за рішенням Саші.
// Показуємо те, що допомагає впізнати суперника і вести на нього нотатки:
// аватар у рамці ліги, нік і країна, стек за цим столом, кольорова мітка,
// особиста нотатка і швидкі подарунки-емодзі.

const PC_MONO = UI.font;
const PC_SANS = UI.fontUI;
const PC_TAGS = [{
  id: "none",
  c: "rgba(255,255,255,.22)",
  label: "NO TAG",
  ru: "БЕЗ МЕТКИ"
}, {
  id: "fish",
  c: "#5BD96A",
  label: "FISH"
}, {
  id: "reg",
  c: "#3B82F6",
  label: "REG"
}, {
  id: "nit",
  c: "#8B7BF7",
  label: "NIT"
}, {
  id: "shark",
  c: "#E5484D",
  label: "SHARK"
}, {
  id: "wild",
  c: "#E0A84A",
  label: "WILD"
}];
const PC_GIFTS = ["\u{1F37B}", "\u{1F525}", "\u{1F44F}", "\u{1F921}", "\u{1F31F}", "\u{1F480}"];

// ── Правка 8 (архітектура 09.09): міні-звіт зі зведенням рук ──────────────
// Найкраща і найгірша рука з результатом — на поточному ліміті в обраній
// дисципліні. Дисципліни перемикаються акордеоном; за замовчуванням
// відкрита та, за якою зараз іде гра.
const PC_DISCS = [{
  id: "holdem",
  label: "HOLD'EM",
  ru: "ХОЛДЕМ"
}, {
  id: "plo",
  label: "PLO",
  ru: "PLO"
}, {
  id: "short",
  label: "SHORT DECK",
  ru: "КОРОТКАЯ КОЛОДА"
}, {
  id: "spin",
  label: "SPIN & WIN",
  ru: "SPIN & WIN"
}, {
  id: "mtt",
  label: "TOURNAMENTS",
  ru: "ТУРНИРЫ"
}];
const PC_HANDS = ["A A", "K K", "Q Q", "A K", "A Q", "J J", "T T", "A J", "K Q", "9 9"];
function pcSeed(str) {
  let h = 0;
  for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) % 100000;
  return h;
}
function pcSummary(nick, discId, limit) {
  const h = pcSeed(nick + discId + limit);
  const best = PC_HANDS[h % PC_HANDS.length];
  const worst = PC_HANDS[(h * 7 + 3) % PC_HANDS.length];
  const up = 300 + h % 3200;
  const down = 200 + h * 13 % 2900;
  const money = n => "$" + n.toLocaleString("en-US").split(",").join("\u00A0");
  if (discId === "mtt") {
    return {
      mtt: true,
      entries: 40 + h % 260,
      itm: 8 + h % 40,
      best: "#" + (1 + h % 9),
      total: money(1000 + h % 24000)
    };
  }
  return {
    best,
    bestSum: "+" + money(up),
    worst,
    worstSum: "\u2212" + money(down)
  };
}
function PlayerCard({
  open,
  player,
  accent = "#D71921",
  onClose
}) {
  const [up, setUp] = React.useState(false);
  const [tag, setTag] = React.useState("none");
  const [note, setNote] = React.useState("");
  const [sent, setSent] = React.useState(null);
  const [pdisc, setPdisc] = React.useState(null); // правка 8: обрана дисципліна зведення
  React.useEffect(() => {
    if (!open) {
      setUp(false);
      return;
    }
    setTag("none");
    setNote("");
    setSent(null);
    setPdisc(null);
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [open, player && player.nick]);
  if (!open || !player) return null;

  // підписи картки живуть у двох мовах; самі мітки (FISH / REG / NIT …) —
  // покерний сленг, його не перекладаємо і DOM-перекладач не чіпає
  let ru = false;
  if (window.PXI18N && window.PXI18N.lang) ru = window.PXI18N.lang === "ru";else {
    try {
      ru = localStorage.getItem("pokerix_lang") === "ru";
    } catch (e) {}
  }
  const L = ru ? {
    tag: "МЕТКА",
    note: "ЗАМЕТКА",
    gift: "ОТПРАВИТЬ ПОДАРОК",
    stack: "СТЕК",
    close: "ЗАКРЫТЬ",
    country: "УКРАИНА",
    seat: "МЕСТО",
    you: "ВЫ",
    sent: "ОТПРАВЛЕНО ИГРОКУ",
    ph: "Заметку видите только вы",
    phYou: "Заметка о себе? Смело."
  } : {
    tag: "TAG",
    note: "NOTE",
    gift: "SEND A GIFT",
    stack: "STACK",
    close: "CLOSE",
    country: "UKRAINE",
    seat: "SEAT",
    you: "YOU",
    sent: "SENT TO",
    ph: "Only you see this note",
    phYou: "Notes about yourself? Bold."
  };
  const you = !!player.you;
  const nick = player.nick || "PLAYER";
  const stack = player.stack ? "$ " + player.stack : "—";
  const tagOn = PC_TAGS.find(t => t.id === tag) || PC_TAGS[0];
  const close = () => {
    setUp(false);
    setTimeout(() => onClose && onClose(), 170);
  };
  const gift = g => {
    if (window.playClick) window.playClick(1400, .05);
    setSent(g);
    setTimeout(() => setSent(null), 1600);
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: close,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 210,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "center",
      background: "rgba(0,0,0,.72)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      opacity: up ? 1 : 0,
      transition: "opacity 170ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      boxSizing: "border-box",
      borderRadius: "20px 20px 0 0",
      padding: "14px 16px 26px",
      background: "linear-gradient(160deg,#17171c,#0b0b0e)",
      border: "1px solid rgba(255,255,255,.14)",
      borderBottom: 0,
      transform: up ? "translateY(0)" : "translateY(18px)",
      transition: "transform 220ms cubic-bezier(.2,.8,.2,1)"
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
      gap: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none"
    }
  }, window.LeagueFrame ? /*#__PURE__*/React.createElement(window.LeagueFrame, {
    player: !!you,
    level: you ? (window.cmPlayer || {}).level || 24 : 41,
    size: 58,
    ring: 3
  }, /*#__PURE__*/React.createElement("img", {
    src: you ? typeof window !== "undefined" && window.CM_AVATAR || "assets/avatar.png" : "assets/avatar.png",
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center 30%",
      filter: you ? "none" : "grayscale(.35) brightness(.9)"
    }
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 58,
      height: 58,
      borderRadius: "50%",
      background: "#222",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PC_MONO,
      fontWeight: 700,
      fontSize: 17,
      color: "#fff",
      letterSpacing: ".04em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, nick), you && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: PC_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".14em",
      color: accent,
      padding: "2px 7px",
      borderRadius: 4,
      background: `${accent}1f`,
      border: `1px solid ${accent}66`
    }
  }, L.you)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      marginTop: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 18,
      height: 13,
      borderRadius: 2,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      border: "1px solid rgba(255,255,255,.2)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      background: "#0057b7"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      background: "#ffd700"
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PC_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#8A8A93"
    }
  }, L.country, " \xB7 ", L.seat, " ", player.seat || 1))), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: PC_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".16em",
      color: "#8A8A93"
    }
  }, L.stack), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: PC_MONO,
      fontWeight: 700,
      fontSize: 17,
      color: "#f0c75e",
      marginTop: 3
    }
  }, stack))), (() => {
    const cur = pdisc || player.discId || "holdem";
    const lim = player.limit || "$0.50 / $1";
    const r = pcSummary(nick, cur, lim);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        padding: "12px 13px",
        borderRadius: 14,
        background: "rgba(255,255,255,.045)",
        border: "1px solid rgba(255,255,255,.1)"
      }
    }, /*#__PURE__*/React.createElement("div", {
      "data-i18n": "off",
      style: {
        display: "flex",
        gap: 6,
        overflowX: "auto",
        scrollbarWidth: "none",
        paddingBottom: 2
      }
    }, PC_DISCS.map(d => {
      const on = d.id === cur;
      return /*#__PURE__*/React.createElement("button", {
        key: d.id,
        onClick: () => {
          if (window.playClick) window.playClick(1100, .03);
          setPdisc(d.id);
        },
        style: {
          flex: "none",
          height: 26,
          padding: "0 10px",
          borderRadius: 125,
          cursor: "pointer",
          whiteSpace: "nowrap",
          background: on ? accent : "rgba(255,255,255,.05)",
          border: `1px solid ${on ? accent : "rgba(255,255,255,.12)"}`,
          fontFamily: PC_SANS,
          fontWeight: 700,
          fontSize: 9.5,
          letterSpacing: ".1em",
          color: on ? "#fff" : "rgba(255,255,255,.55)"
        }
      }, ru ? d.ru : d.label);
    })), r.mtt ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10,
        marginTop: 12
      }
    }, [[ru ? "ВХОДОВ" : "ENTRIES", String(r.entries)], [ru ? "В ПРИЗАХ" : "IN THE MONEY", String(r.itm)], [ru ? "ЛУЧШЕЕ МЕСТО" : "BEST FINISH", r.best], [ru ? "ВЫИГРАНО" : "WON", r.total]].map(([k, v]) => /*#__PURE__*/React.createElement("span", {
      key: k,
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: PC_SANS,
        fontWeight: 700,
        fontSize: 8.5,
        letterSpacing: ".12em",
        color: "#8A8A93",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, k), /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: {
        display: "block",
        fontFamily: PC_MONO,
        fontWeight: 700,
        fontSize: 13,
        color: "#fff",
        marginTop: 4
      }
    }, v)))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: PC_SANS,
        fontWeight: 700,
        fontSize: 8.5,
        letterSpacing: ".14em",
        color: "#8A8A93"
      }
    }, ru ? "ЛУЧШАЯ РУКА" : "BEST HAND"), /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: PC_MONO,
        fontWeight: 700,
        fontSize: 15,
        color: "#fff",
        letterSpacing: ".08em"
      }
    }, r.best), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: PC_MONO,
        fontWeight: 700,
        fontSize: 13,
        color: "#5BD96A"
      }
    }, r.bestSum))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: PC_SANS,
        fontWeight: 700,
        fontSize: 8.5,
        letterSpacing: ".14em",
        color: "#8A8A93"
      }
    }, ru ? "ХУДШАЯ РУКА" : "WORST HAND"), /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: PC_MONO,
        fontWeight: 700,
        fontSize: 15,
        color: "#fff",
        letterSpacing: ".08em"
      }
    }, r.worst), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: PC_MONO,
        fontWeight: 700,
        fontSize: 13,
        color: "#E5484D"
      }
    }, r.worstSum)))), /*#__PURE__*/React.createElement("div", {
      "data-i18n": "off",
      style: {
        marginTop: 9,
        fontFamily: PC_SANS,
        fontWeight: 500,
        fontSize: 10,
        color: "#8A8A93"
      }
    }, (ru ? "на лимите " : "on ") + lim + (ru ? "" : " limit"))));
  })(), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PC_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, L.tag), /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      display: "flex",
      gap: 7,
      marginTop: 9,
      flexWrap: "wrap"
    }
  }, PC_TAGS.map(t => {
    const on = t.id === tag;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      onClick: () => {
        if (window.playClick) window.playClick(1100, .03);
        setTag(t.id);
      },
      style: {
        flex: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 30,
        padding: "0 11px",
        borderRadius: 8,
        cursor: "pointer",
        background: on ? `${t.c}1f` : "rgba(255,255,255,.05)",
        border: `1px solid ${on ? t.c : "rgba(255,255,255,.12)"}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: t.c
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: PC_SANS,
        fontWeight: 700,
        fontSize: 9.5,
        letterSpacing: ".1em",
        color: on ? "#fff" : "#8A8A93"
      }
    }, ru && t.ru ? t.ru : t.label));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PC_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, L.note), /*#__PURE__*/React.createElement("textarea", {
    value: note,
    onChange: e => setNote(e.target.value.slice(0, 200)),
    rows: 2,
    placeholder: you ? L.phYou : L.ph,
    style: {
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      marginTop: 9,
      resize: "none",
      padding: "11px 12px",
      borderRadius: 12,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.13)",
      color: "#fff",
      outline: "none",
      fontFamily: PC_SANS,
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.45
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      textAlign: "right",
      marginTop: 5,
      fontFamily: PC_MONO,
      fontSize: 9.5,
      color: "#8A8A93"
    }
  }, note.length, "/200")), !you && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: PC_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, L.gift), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginTop: 9
    }
  }, PC_GIFTS.map(g => /*#__PURE__*/React.createElement("button", {
    key: g,
    onClick: () => gift(g),
    style: {
      flex: 1,
      height: 40,
      borderRadius: 12,
      cursor: "pointer",
      fontSize: 18,
      background: sent === g ? `${accent}26` : "rgba(255,255,255,.05)",
      border: `1px solid ${sent === g ? accent : "rgba(255,255,255,.12)"}`,
      transition: "background .16s, border-color .16s"
    }
  }, g))), sent && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      textAlign: "center",
      fontFamily: PC_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#5BD96A"
    }
  }, L.sent, " ", nick)), /*#__PURE__*/React.createElement("button", {
    onClick: close,
    style: {
      width: "100%",
      marginTop: 18,
      padding: "13px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "rgba(255,255,255,.07)",
      border: "1px solid rgba(255,255,255,.18)",
      color: "#fff",
      fontFamily: PC_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".14em"
    }
  }, L.close)));
}
Object.assign(window, {
  PlayerCard
});
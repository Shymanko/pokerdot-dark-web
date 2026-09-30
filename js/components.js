// Cardomancer Poker — shared primitives.
// Realistic playing-card suits (not the pixel ones from CM) + Nothing-style HUD.

const ARC = "#D71921";
const RED_HOT = "#FF0000";

// ─── Real suit glyphs as inline SVG (clean, scalable, classic) ──────────
function Suit({
  kind = "heart",
  size = 16,
  color,
  style = {}
}) {
  // four classic outlines — solid fills, simple silhouettes
  const paths = {
    heart: "M50 88 C20 70, 4 50, 4 30 C4 14, 16 4, 30 4 C40 4, 46 10, 50 18 C54 10, 60 4, 70 4 C84 4, 96 14, 96 30 C96 50, 80 70, 50 88 Z",
    diamond: "M50 4 L92 50 L50 96 L8 50 Z",
    spade: "M50 4 C50 4, 92 36, 92 60 C92 74, 82 84, 70 84 C62 84, 56 80, 53 74 L58 96 L42 96 L47 74 C44 80, 38 84, 30 84 C18 84, 8 74, 8 60 C8 36, 50 4, 50 4 Z",
    club: "M50 6 C40 6, 32 14, 32 24 C32 28, 33 32, 35 35 C30 32, 24 30, 18 30 C10 30, 4 36, 4 44 C4 54, 12 60, 22 60 C28 60, 33 58, 38 54 C36 60, 36 64, 40 68 L36 96 L64 96 L60 68 C64 64, 64 60, 62 54 C67 58, 72 60, 78 60 C88 60, 96 54, 96 44 C96 36, 90 30, 82 30 C76 30, 70 32, 65 35 C67 32, 68 28, 68 24 C68 14, 60 6, 50 6 Z"
  };
  const isRed = kind === "heart" || kind === "diamond";
  const fill = color || (isRed ? ARC : "#fff");
  if (kind === "club") {
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 100 100",
      width: size,
      height: size,
      style: {
        display: "inline-block",
        ...style
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "50",
      cy: "32",
      r: "19",
      fill: fill
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "29",
      cy: "57",
      r: "19",
      fill: fill
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "71",
      cy: "57",
      r: "19",
      fill: fill
    }), /*#__PURE__*/React.createElement("path", {
      d: "M44 54 C44 68 39 82 34 95 L66 95 C61 82 56 68 56 54 Z",
      fill: fill
    }));
  }
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: size,
    height: size,
    style: {
      display: "inline-block",
      ...style
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: paths[kind],
    fill: fill
  }));
}

// ─── A real playing-card face (white) — clean, no dot-matrix ────────────
function PokerCard({
  rank = "A",
  suit = "spade",
  w = 60,
  faceDown = false,
  style = {}
}) {
  const isRed = suit === "heart" || suit === "diamond";
  const h = w * 1.4;
  if (faceDown) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: w,
        height: h,
        borderRadius: w * 0.09,
        background: "#0a0a0a",
        boxShadow: "0 6px 14px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.085)",
        position: "relative",
        overflow: "hidden",
        flex: "none",
        ...style
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 4,
        borderRadius: w * 0.06,
        backgroundImage: "radial-gradient(circle, rgba(215,25,33,.85) 0.6px, transparent 1px)",
        backgroundSize: `${Math.max(4, w / 12)}px ${Math.max(4, w / 12)}px`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        border: "1px solid rgba(255,255,255,.065)",
        borderRadius: w * 0.09
      }
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      height: h,
      borderRadius: w * 0.09,
      background: "#fff",
      boxShadow: "0 6px 14px rgba(0,0,0,.55), 0 1px 2px rgba(0,0,0,.4)",
      position: "relative",
      flex: "none",
      overflow: "hidden",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: w * 0.08,
      top: w * 0.06,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: w * 0.015,
      color: isRed ? ARC : "#0a0a0a",
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: w * 0.28,
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", null, rank), /*#__PURE__*/React.createElement(Suit, {
    kind: suit,
    size: w * 0.22,
    color: isRed ? ARC : "#0a0a0a"
  })), /*#__PURE__*/React.createElement(Suit, {
    kind: suit,
    size: w * 0.55,
    color: isRed ? ARC : "#0a0a0a",
    style: {
      position: "absolute",
      left: "50%",
      top: "52%",
      transform: "translate(-50%, -50%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: w * 0.08,
      bottom: w * 0.06,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: w * 0.015,
      color: isRed ? ARC : "#0a0a0a",
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: w * 0.28,
      lineHeight: 1,
      transform: "rotate(180deg)"
    }
  }, /*#__PURE__*/React.createElement("span", null, rank), /*#__PURE__*/React.createElement(Suit, {
    kind: suit,
    size: w * 0.22,
    color: isRed ? ARC : "#0a0a0a"
  })));
}

// ─── Dot-matrix bar (HP-style) ──────────────────────────────────────────
function DotBar({
  value = 7,
  max = 10,
  color = "#fff",
  size = 4,
  gap = 2
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap
    }
  }, Array.from({
    length: max
  }).map((_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      width: size,
      height: size,
      borderRadius: "50%",
      background: i < value ? color : "rgba(255,255,255,.18)",
      display: "inline-block"
    }
  })));
}

// ─── A NDOT-styled chip (used for tags, blinds, etc) ─────────────────────
function Chip({
  children,
  color = "rgba(255,255,255,.85)",
  bg = "rgba(255,255,255,.085)",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 7px",
      borderRadius: 4,
      background: bg,
      border: "1px solid rgba(255,255,255,.13)",
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".12em",
      color,
      textTransform: "uppercase",
      ...style
    }
  }, children);
}

// ─── A status LED dot (pulses) ───────────────────────────────────────────
function StatusDot({
  color = "#5BD96A",
  size = 6,
  pulse = true,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      boxShadow: `0 0 8px ${color}`,
      animation: pulse ? "pp-pulse 1.6s ease-in-out infinite" : "none",
      ...style
    }
  });
}

// ─── Stacked-cards visual (hero, banners) ────────────────────────────────
function CardFan({
  cards,
  w = 60,
  spread = 12,
  rotateStep = 6,
  style = {}
}) {
  // cards: [{ rank, suit }]
  const mid = (cards.length - 1) / 2;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: w + (cards.length - 1) * spread,
      height: w * 1.4,
      ...style
    }
  }, cards.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: i * spread,
      top: 0,
      transform: `rotate(${(i - mid) * rotateStep}deg)`,
      transformOrigin: "50% 95%"
    }
  }, /*#__PURE__*/React.createElement(PokerCard, {
    rank: c.rank,
    suit: c.suit,
    w: w
  }))));
}

// ─── Mini ndot ticker (animated numbers) ─────────────────────────────────
function Ticker({
  value,
  fontSize = 14,
  color = "#fff",
  chars = 6,
  prefix = "",
  suffix = ""
}) {
  // not animated digit-by-digit — just renders fixed-width
  const padded = String(value).padStart(chars, "0");
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.font,
      fontSize,
      color,
      letterSpacing: ".05em",
      fontVariantNumeric: "tabular-nums"
    }
  }, prefix, padded, suffix);
}
Object.assign(window, {
  ARC,
  RED_HOT,
  Suit,
  PokerCard,
  DotBar,
  Chip,
  StatusDot,
  CardFan,
  Ticker,
  ShieldCheck
});

// ─── Shield with check (trust badge) ─────────────────────────────────────
function ShieldCheck({
  size = 14,
  color = "#5BD96A"
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size * 1.08,
    viewBox: "0 0 24 26",
    fill: "none",
    style: {
      display: "inline-block",
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 2 L22 6 V14 C22 19 17.5 23.5 12 25 C6.5 23.5 2 19 2 14 V6 Z",
    fill: color,
    fillOpacity: "0.18",
    stroke: color,
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.5 13 L10.8 16 L16.5 10",
    stroke: color,
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: "none"
  }));
}

// ── Плашка балансу: ФІКСОВАНИЙ розмір ────────────────────────────────────
// Шапка не повинна «дихати» разом із сумою. Ширина стала; якщо число не
// влазить — зменшується КЕГЛЬ (пропорційним масштабом), а не розтягується
// плашка. Той самий компонент у всіх шапках, щоб вони збігались.
window.PxBalance = function PxBalance({
  value,
  onTap,
  onPlus,
  w = 152,
  h = 34
}) {
  const ref = React.useRef(null);
  const [k, setK] = React.useState(1);
  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const host = el.parentElement;
    if (!host) return;
    const avail = host.clientWidth,
      nat = el.scrollWidth;
    setK(avail > 0 && nat > 0 && nat > avail ? Math.max(0.55, avail / nat) : 1);
  }, [value, w]);
  return /*#__PURE__*/React.createElement("div", {
    onClick: onTap,
    style: {
      flex: "none",
      boxSizing: "border-box",
      width: w,
      height: h,
      display: "flex",
      alignItems: "center",
      gap: 8,
      cursor: "pointer",
      padding: "0 7px 0 11px",
      borderRadius: 12,
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    ref: ref,
    "data-i18n": "off",
    style: {
      display: "inline-block",
      whiteSpace: "nowrap",
      transform: "scale(" + k + ")",
      transformOrigin: "50% 50%",
      fontFamily: UI.font,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em",
      fontVariantNumeric: "tabular-nums"
    }
  }, value)), /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      if (window.playClick) window.playClick(1250, 0.04);
      (onPlus || onTap || (() => {}))();
    },
    style: {
      flex: "none",
      width: 20,
      height: 20,
      borderRadius: 6,
      background: "#D71921",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      fontFamily: UI.font,
      fontSize: 12,
      lineHeight: 1,
      fontWeight: 700
    }
  }, "+"));
};

// ── Назва розділу в шапці + випадайка форматів ───────────────────────────
// Назва режиму живе МІЖ кнопкою «назад» і балансом. Тап по ній опускає
// зверху ті самі 4 плитки форматів, що на головній, — з будь-якого режиму
// можна перескочити в інший, не повертаючись у лобі.
window.PxSectionTitle = function PxSectionTitle({
  label,
  accent = "#D71921",
  menu = true,
  topInset = 104
}) {
  const [open, setOpen] = React.useState(false);
  const items = window.PX_FORMATS || [];
  const pick = it => {
    if (window.playClick) window.playClick(it.locked ? 700 : 1250, .04);
    if (it.locked) {
      setOpen(false);
      if (window.showScreenInfo) window.showScreenInfo({
        kicker: it.label,
        title: "COMING SOON",
        body: "This format is not open yet. It will appear here as soon as we switch it on.",
        accent,
        noLink: true
      });
      return;
    }
    setOpen(false);
    if (window.__pxPickFormat) window.__pxPickFormat(it.id);
  };
  // Назва мусить ЧИТАТИСЬ як кнопка: власна плашка з рамкою і шеврон
  // у кружечку — інакше маленька стрілочка лишається непоміченою.
  const title = /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!menu) return;
      if (window.playClick) window.playClick(1150, .04);
      setOpen(!open);
    },
    style: {
      flex: 1,
      minWidth: 0,
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      height: 34,
      padding: menu ? "0 6px 0 12px" : "0 6px",
      cursor: menu ? "pointer" : "default",
      borderRadius: 125,
      background: menu ? open ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.055)" : "transparent",
      border: menu ? `1px solid ${open ? accent + "99" : "rgba(255,255,255,.16)"}` : 0,
      transition: "background .15s, border-color .15s"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      fontFamily: UI.font,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".12em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, label), menu && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: open ? accent : "rgba(255,255,255,.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 220ms, background .15s"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  }))));
  if (!menu || !open) return title;
  return /*#__PURE__*/React.createElement(React.Fragment, null, title, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 130,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setOpen(false),
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: topInset,
      bottom: 0,
      pointerEvents: "auto",
      background: "rgba(0,0,0,.62)",
      backdropFilter: "blur(4px)",
      WebkitBackdropFilter: "blur(4px)",
      animation: "pp-fadeIn .18s ease"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: topInset,
      left: 0,
      right: 0,
      padding: "12px 14px 16px",
      pointerEvents: "auto",
      background: "linear-gradient(180deg,#0e0e11 0%,#0a0a0c 78%,rgba(10,10,12,.96) 100%)",
      borderBottom: "1px solid rgba(255,255,255,.1)",
      boxShadow: "0 26px 50px rgba(0,0,0,.7)",
      animation: "px-drop .26s cubic-bezier(.2,.8,.2,1) both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#8A8A93",
      margin: "0 2px 10px"
    }
  }, "POKER FORMATS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, items.map((it, i) => {
    const on = it.label === label;
    return /*#__PURE__*/React.createElement("button", {
      key: it.id,
      onClick: () => pick(it),
      style: {
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        height: 118,
        padding: "12px 12px 13px",
        borderRadius: 18,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        textAlign: "left",
        background: it.locked ? "linear-gradient(150deg, rgba(255,255,255,.09) 0%, rgba(255,255,255,.03) 44%, #0c0c0f 78%, #0a0a0c 100%)" : `linear-gradient(150deg, ${it.c}40 0%, ${it.c}14 44%, #0c0c0f 78%, #0a0a0c 100%)`,
        border: `1px solid ${on ? it.c : it.locked ? "rgba(255,255,255,.14)" : it.c + "59"}`,
        boxShadow: on ? `0 0 0 1px ${it.c}66, 0 10px 26px -12px ${it.c}` : it.locked ? "none" : `inset 0 1px 0 ${it.c}30`
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: it.art,
      alt: "",
      style: {
        position: "absolute",
        right: 0,
        top: 2,
        width: 82,
        height: 82,
        objectFit: "contain",
        filter: it.locked ? "grayscale(1) brightness(.62)" : "drop-shadow(0 10px 18px rgba(0,0,0,.75))",
        opacity: it.locked ? .75 : 1
      }
    }), it.locked && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        right: 10,
        top: 9,
        width: 24,
        height: 24,
        borderRadius: 125,
        background: "rgba(0,0,0,.55)",
        border: "1px solid rgba(255,255,255,.22)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "11",
      height: "11",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "4.5",
      y: "10.5",
      width: "15",
      height: "10.5",
      rx: "2.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 10.5V7.6a4 4 0 0 1 8 0v2.9"
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        fontFamily: UI.font,
        fontWeight: 700,
        fontSize: 13,
        color: it.locked ? "#A9A9B2" : "#fff",
        letterSpacing: ".04em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100%"
      }
    }, it.label), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        fontFamily: UI.fontUI,
        fontWeight: 600,
        fontSize: 10,
        color: "#8A8A93",
        marginTop: 3,
        lineHeight: 1.3
      }
    }, it.locked ? "SOON" : it.sub));
  })))));
};
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// lobby-canvas.jsx — WORKING COPY of lobby.jsx for the Lobby Canvas.
// Edit THIS file when iterating on the canvas; lobby.jsx stays the shipped app.
// Poker Lobby — Nothing-OS aesthetic, PokerStars-style structure.

const {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useMemo
} = React;

// ──────────────────────────────────────────────────────────────────────
// Animated counter (smoothly tweens to target value)
// ──────────────────────────────────────────────────────────────────────
function useAnimatedNumber(target, duration = 800) {
  const [val, setVal] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef(0);
  const rafRef = useRef(0);
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    fromRef.current = val;
    startRef.current = performance.now();
    const tick = t => {
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);
  return val;
}

// ──────────────────────────────────────────────────────────────────────
// Parallax scroll tracker (provides 0..1 progress + raw scroll)
// ──────────────────────────────────────────────────────────────────────
function useScroll(ref) {
  const [y, setY] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const on = () => setY(el.scrollTop);
    el.addEventListener("scroll", on, {
      passive: true
    });
    return () => el.removeEventListener("scroll", on);
  }, []);
  return y;
}

// ──────────────────────────────────────────────────────────────────────
// ── Правка 13 · пуш про перенесення акаунта з ClubGG ────────────────────
// Це саме СИСТЕМНИЙ ПУШ, а не блок у стрічці: плашка висить поверх усього
// екрана під островом, зі скляним фоном, іконкою застосунку і часом — так,
// як виглядає повідомлення в iOS. Закрити не можна: хрестика немає, єдина
// дія — тап, який відкриває повний лист в інбоксі, у вкладці «ВАЖНОЕ».
function MigrationPush({
  show,
  onOpen
}) {
  const MONO = UI.font,
    SANS = UI.fontUI;
  const [up, setUp] = React.useState(false);
  React.useEffect(() => {
    if (!show) {
      setUp(false);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [show]);
  if (!show) return null;
  const c = "#D71921";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 64,
      left: 10,
      right: 10,
      zIndex: 150,
      transform: up ? "translateY(0) scale(1)" : "translateY(-120%) scale(.96)",
      opacity: up ? 1 : 0,
      transition: "transform 420ms cubic-bezier(.2,.9,.25,1), opacity 260ms ease",
      // легке «дихання», щоб плашка читалась як живе сповіщення
      animation: up ? "mp-bob 3.4s ease-in-out 0.6s infinite" : "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, .04);
      onOpen();
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      textAlign: "left",
      cursor: "pointer",
      padding: "11px 13px",
      borderRadius: 22,
      border: "1px solid rgba(255,255,255,.16)",
      background: "rgba(30,30,35,.82)",
      backdropFilter: "blur(26px) saturate(180%)",
      WebkitBackdropFilter: "blur(26px) saturate(180%)",
      boxShadow: "0 22px 48px rgba(0,0,0,.62), inset 0 1px 0 rgba(255,255,255,.09)",
      display: "flex",
      alignItems: "flex-start",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 38,
      height: 38,
      borderRadius: 10,
      overflow: "hidden",
      background: `linear-gradient(150deg, ${c} 0%, #7d0f14 100%)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-mark.svg",
    alt: "",
    style: {
      width: 22,
      height: 22,
      display: "block",
      filter: "brightness(0) invert(1)"
    },
    onError: e => {
      e.currentTarget.style.display = "none";
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".2em",
      color: "rgba(255,255,255,.55)",
      whiteSpace: "nowrap"
    }
  }, "POKERDOT"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".12em",
      color: "rgba(255,255,255,.45)",
      whiteSpace: "nowrap"
    }
  }, "NOW")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 12.5,
      color: "#fff",
      letterSpacing: ".02em",
      lineHeight: 1.25,
      marginTop: 1
    }
  }, "YOUR CLUBGG ACCOUNT HAS MOVED"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "rgba(255,255,255,.7)",
      lineHeight: 1.35
    }
  }, "Balance and progress are saved \xB7 tap to read more")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      alignSelf: "center",
      width: 26,
      height: 26,
      borderRadius: "50%",
      background: c,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 14px ${c}88`,
      animation: "mp-nudge 1.5s ease-in-out infinite"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))));
}

// Header: avatar, name, balance, notifications
// ──────────────────────────────────────────────────────────────────────
function LobbyHeader({
  balance,
  chips,
  scrollY,
  onCashier,
  onDeposit,
  onBell,
  onRakeback,
  onProfile,
  onBack = null,
  section = null,
  sectionMenu = false,
  pinned = false,
  slim = false,
  flow = false,
  padTop = 62
}) {
  const SANS = UI.fontUI;
  const statusIdea = Number(new URLSearchParams(location.search).get('statusConcept'));
  const animBalance = useAnimatedNumber(balance, 600);
  const fade = Math.max(0, Math.min(1, 1 - scrollY / 100));
  const [notif, setNotif] = React.useState(() => window.cmNotifStore ? window.cmNotifStore.summary() : {
    imp: 1,
    oth: 0
  });
  React.useEffect(() => {
    if (!window.cmNotifStore) return;
    setNotif(window.cmNotifStore.summary());
    return window.cmNotifStore.subscribe(() => setNotif(window.cmNotifStore.summary()));
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: flow ? "relative" : pinned ? "absolute" : "sticky",
      left: 0,
      right: 0,
      top: 0,
      zIndex: flow ? 5 : pinned ? 45 : 30,
      paddingTop: padTop,
      paddingLeft: 18,
      paddingRight: 18,
      paddingBottom: 8,
      background: flow ? "none" : pinned ? "linear-gradient(180deg, #000 0%, rgba(0,0,0,.96) 68%, rgba(0,0,0,0) 100%)" : `linear-gradient(180deg, rgba(0,0,0,${0.6 + (1 - fade) * 0.4}) 55%, rgba(0,0,0,0) 100%)`,
      backdropFilter: !flow && (pinned || scrollY > 20) ? "blur(14px) saturate(140%)" : "none",
      WebkitBackdropFilter: !flow && (pinned || scrollY > 20) ? "blur(14px) saturate(140%)" : "none",
      transition: "backdrop-filter 200ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, onBack && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.04);
      onBack();
    },
    "aria-label": "Back",
    style: {
      flex: "none",
      width: 36,
      height: 36,
      borderRadius: 12,
      cursor: "pointer",
      padding: 0,
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.13)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
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
  }))), onBack && (section && window.PxSectionTitle ? /*#__PURE__*/React.createElement(window.PxSectionTitle, {
    label: section,
    accent: ARC,
    menu: sectionMenu,
    topInset: padTop + 46
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  })), !onBack && /*#__PURE__*/React.createElement("div", {
    role: "button",
    tabIndex: 0,
    "aria-label": "Open profile",
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onProfile?.();
      }
    },
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.04);
      onProfile && onProfile();
    },
    onMouseDown: e => {
      e.currentTarget.style.opacity = .7;
    },
    onMouseUp: e => {
      e.currentTarget.style.opacity = 1;
    },
    onMouseLeave: e => {
      e.currentTarget.style.opacity = 1;
    },
    onTouchStart: e => {
      e.currentTarget.style.opacity = .7;
    },
    onTouchEnd: e => {
      e.currentTarget.style.opacity = 1;
    },
    style: {
      display: slim ? "none" : "flex",
      flex: 1,
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      transition: "opacity 120ms ease",
      minWidth: 0
    }
  }, window.PxIdentity ? /*#__PURE__*/React.createElement(window.PxIdentity, {
    size: 44,
    ring: 2.5,
    nickSize: 15.5,
    cardW: 16,
    style: {
      flex: 1
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 36,
      height: 36
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/avatar.png",
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      objectFit: "cover",
      objectPosition: "center 30%"
    }
  }))), slim ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }) : null, window.PxBalance ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      paddingBottom: statusIdea === 24 ? 16 : 0
    }
  }, /*#__PURE__*/React.createElement(window.PxBalance, {
    value: balance > 0 ? "$" + animBalance.toLocaleString("en-US").split(",").join(" ") : "TOP UP",
    onTap: onCashier,
    onPlus: onDeposit || onCashier
  }), statusIdea === 24 && /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off",
    style: {
      position: "absolute",
      bottom: -2,
      left: 0,
      right: 0,
      textAlign: "center",
      fontFamily: SANS,
      fontSize: 10,
      color: "#d8bc86",
      letterSpacing: ".035em"
    }
  }, "RAKEBACK \xB7 Q")) : null, !onBack && /*#__PURE__*/React.createElement("button", {
    onClick: onBell,
    style: {
      position: "relative",
      pointerEvents: "auto",
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.13)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 21a2 2 0 0 0 4 0"
  })), (notif.imp > 0 || notif.oth > 0) && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 8,
      top: 8,
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: notif.imp > 0 ? ARC : "#fff",
      boxShadow: notif.imp > 0 ? "0 0 6px " + ARC : "0 0 7px rgba(255,255,255,.95)",
      animation: notif.imp > 0 ? "pp-pulse 1.6s ease-in-out infinite" : "none"
    }
  }))), !onBack && statusIdea === 25 && /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: '7px 0 1px',
      padding: '9px 12px',
      borderTop: '1px solid #dec28a30',
      borderBottom: '1px solid #dec28a16',
      fontFamily: SANS,
      fontSize: 11,
      color: '#bcbcc6',
      background: 'linear-gradient(90deg,#d7ba7a0c,transparent)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "RAKEBACK ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#ecd09a',
      marginLeft: 7
    }
  }, "Q")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#ecd09a'
    }
  }, "+42% \u0431\u043E\u043D\u0443\u0441 \u043A\u0430\u0440\u0442\u044B")), !onBack && statusIdea === 27 && /*#__PURE__*/React.createElement("div", {
    "data-i18n": "off",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      margin: '8px 0 2px',
      padding: '11px 13px',
      border: '1px solid #ffffff16',
      borderRadius: 16,
      background: 'linear-gradient(110deg,#d1b98411,#ffffff03)',
      fontFamily: SANS
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 3
    }
  }, ['Q', 'K', 'A'].map((v, i) => /*#__PURE__*/React.createElement("span", {
    key: v,
    style: {
      display: 'grid',
      placeItems: 'center',
      width: 23,
      height: 30,
      borderRadius: 4,
      color: i ? '#85858e' : '#17191e',
      background: i ? '#25262d' : '#eeeae1',
      border: '1px solid #ffffff15',
      fontWeight: 700,
      fontSize: 14
    }
  }, i ? '·' : v))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", {
    style: {
      fontSize: 11,
      letterSpacing: '.05em'
    }
  }, "RAKEBACK COLLECTION"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#aaaab4',
      marginTop: 3
    }
  }, "\u0412\u0430\u0448\u0430 \u043A\u0430\u0440\u0442\u0430 Q \xB7 24 / 65"))));
}

// ──────────────────────────────────────────────────────────────────────
// Hero banner — single featured event (image bg + floating character + CTA)
// ──────────────────────────────────────────────────────────────────────
// newPlayer = "no deposit" segment — the welcome offer rides in the slider for them only
function HeroCarousel({
  scrollY,
  onCta,
  onDeposit,
  newPlayer = false
}) {
  const ref = React.useRef(null);
  const [i, setI] = React.useState(0);
  const slides = [...(newPlayer ? [/*#__PURE__*/React.createElement(BannerWelcome, {
    py: scrollY,
    onCta: onDeposit
  })] : []), /*#__PURE__*/React.createElement(BannerSunday, {
    py: scrollY,
    onCta: onCta
  }), /*#__PURE__*/React.createElement(BannerRockets, {
    py: scrollY,
    onCta: onCta
  }), /*#__PURE__*/React.createElement(BannerCasino, {
    py: scrollY,
    onCta: onCta
  })];
  const n = slides.length;
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const p = Math.round(el.scrollLeft / el.clientWidth);
    if (p !== i) setI(Math.max(0, Math.min(n - 1, p)));
  };
  const go = k => {
    const el = ref.current;
    if (el) el.scrollTo({
      left: k * el.clientWidth,
      behavior: "smooth"
    });
  };
  React.useEffect(() => {
    const t = setInterval(() => {
      const el = ref.current;
      if (!el) return;
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % n;
      el.scrollTo({
        left: next * el.clientWidth,
        behavior: "smooth"
      });
    }, 5000);
    return () => clearInterval(t);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 6,
      marginBottom: 0,
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onScroll: onScroll,
    style: {
      display: "flex",
      overflowX: "auto",
      overflowY: "hidden",
      scrollSnapType: "x mandatory",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch"
    }
  }, slides.map((b, k) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      flex: "none",
      width: "100%",
      scrollSnapAlign: "start",
      padding: "0 14px",
      boxSizing: "border-box"
    }
  }, b))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 12,
      display: "flex",
      justifyContent: "center",
      gap: 5,
      pointerEvents: "none"
    }
  }, Array.from({
    length: n
  }, (_, k) => /*#__PURE__*/React.createElement("span", {
    key: k,
    onClick: () => go(k),
    style: {
      pointerEvents: "auto",
      width: k === i ? 22 : 12,
      height: 3,
      borderRadius: 2,
      cursor: "pointer",
      background: k === i ? "#fff" : "rgba(255,255,255,.42)",
      boxShadow: "0 1px 4px rgba(0,0,0,.55)",
      transition: "width .25s cubic-bezier(.2,.8,.2,1), background .25s"
    }
  }))));
}

// ═══════════════════════════════════════════════════════════════════════
// NEW banner model — 3 layers:
//   1) designer-supplied background image (374×220, all copy baked in)
//   2) floating character PNG (duck / rocket / …) — bobble + scroll parallax
//   3) CTA button
// The image owns all text/typography/numbers; code only lays character + CTA.
// ═══════════════════════════════════════════════════════════════════════
// одна висота на всі слайди каруселі — інакше вони «стрибають» при гортанні
const BANNER_H = 160;
function ImageBanner({
  bg,
  character,
  button
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      height: BANNER_H,
      background: "#0a0a0a",
      border: "1px solid rgba(255,255,255,.085)",
      boxShadow: "0 20px 40px rgba(0,0,0,.5)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: bg,
    alt: "",
    draggable: "false",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      userSelect: "none"
    }
  }), character, button && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 16,
      bottom: 16
    }
  }, button));
}

// floating character helper — anchors a PNG + adds bobble & scroll parallax
function BannerCharacter({
  src,
  py,
  width = 176,
  height = 176,
  right = -30,
  bottom = -18
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right,
      bottom,
      width,
      height,
      transform: `translateY(${py * -0.225}px)`,
      filter: "drop-shadow(0 18px 28px rgba(0,0,0,.55))",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      animation: "pp-bobble 6.5s ease-in-out infinite"
    }
  }));
}
function BannerCTA({
  label,
  accent,
  onPress
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      if (window.playClick) window.playClick(1400, 0.05);
      onPress && onPress();
    },
    style: {
      padding: "10px 18px",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".1em",
      boxShadow: `0 6px 14px ${accent}80, 0 0 0 1px rgba(255,255,255,.1) inset`
    }
  }, label);
}

// ── BANNER 1 · Golden Duck Series — image bg + floating duck ──────────
function BannerSunday({
  py,
  onCta
}) {
  return /*#__PURE__*/React.createElement(ImageBanner, {
    bg: "assets/banner-warmup.jpg",
    character: /*#__PURE__*/React.createElement(BannerCharacter, {
      src: "assets/duck.png",
      py: py
    }),
    button: /*#__PURE__*/React.createElement(BannerCTA, {
      label: "REGISTER \u203A",
      accent: ARC,
      onPress: onCta
    })
  });
}

// ── BANNER 2 · Rocket Rush — reuses warmup art + floating rockets PNG ──
function BannerRockets({
  py,
  onCta
}) {
  return /*#__PURE__*/React.createElement(ImageBanner, {
    bg: "assets/banner-warmup.jpg",
    character: /*#__PURE__*/React.createElement(BannerCharacter, {
      src: "assets/rockets.png",
      py: py,
      width: 168,
      height: 168,
      right: -24,
      bottom: -14
    }),
    button: /*#__PURE__*/React.createElement(BannerCTA, {
      label: "JOIN \u203A",
      accent: ARC,
      onPress: onCta
    })
  });
}

// ── BANNER 3 · High Roller — reuses warmup art + casino PNG ────────────
function BannerCasino({
  py,
  onCta
}) {
  return /*#__PURE__*/React.createElement(ImageBanner, {
    bg: "assets/banner-warmup.jpg",
    character: /*#__PURE__*/React.createElement(BannerCharacter, {
      src: "assets/casino.png",
      py: py,
      width: 168,
      height: 168,
      right: -20,
      bottom: -16
    }),
    button: /*#__PURE__*/React.createElement(BannerCTA, {
      label: "REGISTER \u203A",
      accent: ARC,
      onPress: onCta
    })
  });
}

// ── BANNER 0 · Welcome offer — solid Arcanium red, chrome gift, segment-gated
function BannerWelcome({
  py,
  onCta
}) {
  const Gift = window.AlphaVideo;
  const SANS = UI.fontUI;
  // ×2 cut from the same chrome as the gift; the card is near-black with a red
  // bloom and dot grid, so it sits in the same family as the format tiles
  const CHROME = {
    background: "linear-gradient(178deg,#fff 4%,#f2f2f6 34%,#a8aeb8 55%,#f7f7fa 72%,#fff 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      height: BANNER_H,
      background: "linear-gradient(150deg,#241014 0%,#101013 54%,#0a0a0c 100%)",
      border: `1px solid ${ARC}57`,
      boxShadow: "0 20px 40px rgba(0,0,0,.55)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "40%",
      top: -70,
      width: 280,
      height: 210,
      borderRadius: "50%",
      pointerEvents: "none",
      background: "radial-gradient(ellipse at center, rgba(215,25,33,.6), rgba(215,25,33,0) 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .6px, transparent 1px)",
      backgroundSize: "11px 11px",
      maskImage: "linear-gradient(150deg,#000,transparent 72%)",
      WebkitMaskImage: "linear-gradient(150deg,#000,transparent 72%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 22,
      top: 26,
      right: 140,
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".24em",
      color: "#A9A9B2"
    }
  }, "WELCOME OFFER"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      gap: 10,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 62,
      lineHeight: .82,
      letterSpacing: "-.03em",
      ...CHROME
    }
  }, "\xD72"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 12,
      lineHeight: 1.3,
      letterSpacing: ".1em",
      color: "#D8D8DF",
      paddingBottom: 7,
      maxWidth: 62
    }
  }, "FIRST DEPOSIT")), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 88,
      height: 1,
      marginTop: 14,
      background: `linear-gradient(90deg, ${ARC}, rgba(215,25,33,0))`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 9,
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".15em",
      color: "#A9A9B2"
    }
  }, "UP TO $1 000 BONUS")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 2,
      top: -2,
      width: 148,
      height: 148,
      transform: `translateY(${py * -0.225}px)`,
      filter: "drop-shadow(0 18px 30px rgba(0,0,0,.6))",
      pointerEvents: "none"
    }
  }, Gift ? /*#__PURE__*/React.createElement(Gift, {
    src: window.BONUS_GIFT || "assets/bonus-coins.webm",
    style: {
      width: "100%",
      height: "100%"
    }
  }) : /*#__PURE__*/React.createElement("img", {
    src: "assets/gifts/silver-c.png",
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      animation: "pp-bobble 6.5s ease-in-out infinite"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 16,
      bottom: 16,
      zIndex: 4
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      if (window.playClick) window.playClick(1400, 0.05);
      onCta && onCta();
    },
    style: {
      padding: "11px 20px",
      borderRadius: 125,
      background: "linear-gradient(180deg,#EA2630,#B4131A)",
      color: "#fff",
      border: 0,
      cursor: "pointer",
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".12em",
      boxShadow: `0 10px 22px ${ARC}73, inset 0 1px 0 rgba(255,255,255,.28)`
    }
  }, "CLAIM \u203A")));
}
// Jackpot bar — fixed 72px band under the slider. Online + certification
// moved out: online → POKER FORMATS heading, certs → footer.
function JackpotBar({
  jackpotVariant = "inferno",
  onJackpot
}) {
  return /*#__PURE__*/React.createElement("div", {
    "data-lobby-jackpot": "true",
    style: {
      padding: "12px 14px",
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onJackpot,
    style: {
      cursor: onJackpot ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement(BadBeatJackpot, {
    variant: jackpotVariant
  })));
}

// POKER FORMATS heading — carries the room-wide online count (never per tile)
function FormatsHeader() {
  const [online, setOnline] = useState(28473);
  useEffect(() => {
    const i = setInterval(() => setOnline(v => v + Math.floor(Math.random() * 21) - 10), 1200);
    return () => clearInterval(i);
  }, []);
  const animOnline = useAnimatedNumber(online, 600);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: "6px 16px 5px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".14em",
      color: "#fff",
      textTransform: "uppercase"
    }
  }, "POKER FORMATS"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    color: "#5BD96A",
    size: 6
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.font,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em",
      fontVariantNumeric: "tabular-nums"
    }
  }, animOnline.toLocaleString("en-US").split(",").join("\u00A0")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, "ONLINE")));
}

// Lobby footer — RNG certificate, licensing, full wordmark
function LobbyFooter() {
  const info = (title, url) => {
    if (window.playClick) window.playClick(1500, 0.03);
    if (window.showScreenInfo) window.showScreenInfo({
      title,
      url
    });
  };
  const LINKS = [{
    label: "LICENCE",
    title: "LICENCE",
    url: "https://lawstrust.com/en/licence/gambling"
  }, {
    label: "TERMS",
    title: "TERMS & CONDITIONS",
    url: "https://lawstrust.com/en/licence/gambling"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      padding: "14px 18px 10px",
      borderTop: "1px solid rgba(255,255,255,.07)",
      background: "linear-gradient(180deg, rgba(255,255,255,.014) 0%, transparent 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-pokerdot.svg",
    alt: "PokerDot",
    draggable: "false",
    style: {
      height: 20,
      width: "auto",
      opacity: .8
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => info("CERTIFIED RNG", "https://lawstrust.com/en/licence/gambling/rng-certificate"),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      cursor: "pointer",
      padding: "7px 13px",
      borderRadius: 125,
      background: "rgba(91,217,106,.06)",
      border: "1px solid rgba(91,217,106,.18)"
    }
  }, /*#__PURE__*/React.createElement(ShieldCheck, {
    size: 13,
    color: "#5BD96A"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#5BD96A",
      letterSpacing: ".1em"
    }
  }, "CERTIFIED RNG")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      gap: "8px 4px"
    }
  }, LINKS.map((l, k) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: l.label
  }, k > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93",
      fontSize: 10.5
    }
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    onClick: () => info(l.title, l.url),
    style: {
      background: "none",
      border: 0,
      padding: "0 6px",
      cursor: "pointer",
      fontFamily: UI.fontUI,
      fontWeight: 500,
      fontSize: 10.5,
      letterSpacing: ".08em",
      color: "#A9A9B2"
    }
  }, l.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 500,
      fontSize: 11,
      letterSpacing: ".05em",
      color: "#A9A9B2",
      textAlign: "center"
    }
  }, "Licensed & regulated \xB7 18+ only"));
}

// Bad Beat Jackpot — 3 stylistic variants (chosen via Tweaks)
// ──────────────────────────────────────────────────────────────────────
function BadBeatJackpot({
  variant = "inferno"
}) {
  const [jackpot, setJackpot] = useState(1247389.45);
  useEffect(() => {
    const j = setInterval(() => {
      setJackpot(v => v + Math.random() * 4.5 + 0.5);
    }, 1500);
    return () => clearInterval(j);
  }, []);
  // the jackpot is money like any other figure: same currency, same rate, same
  // formatter as buy-ins, blinds and the wallet — no jackpot-only logic
  const value = window.pxMoney ? window.pxMoney(jackpot) : "$" + Math.round(jackpot).toLocaleString("en-US").split(",").join("\u00A0");
  if (variant === "matrix") return /*#__PURE__*/React.createElement(JackpotMatrix, {
    value: value
  });
  if (variant === "premium") return /*#__PURE__*/React.createElement(JackpotPremium, {
    value: value
  });
  return /*#__PURE__*/React.createElement(JackpotInferno, {
    value: value
  });
}

// Variant A — INFERNO: full Arcanium red tile, white text, sweeping shine
function JackpotInferno({
  value
}) {
  // Макет C1 від Саші: вивіска «GRAND JACKPOT» (однорядкова табличка) стоїть
  // по центру ВЕРХНЬОЇ КРОМКИ корпуса і виступає на ~13px угору — читається
  // як окрема деталь, пригвинчена до сейфа. Барабани — на всю ширину плитки.
  const screw = (x, y) => /*#__PURE__*/React.createElement("span", {
    key: x + y,
    style: {
      position: "absolute",
      [x]: 7,
      [y]: 7,
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: "radial-gradient(circle at 34% 28%,#d3d6db,#767a83 50%,#22242a)",
      boxShadow: "inset 0 -1px 1px rgba(0,0,0,.75), 0 1px 1px rgba(0,0,0,.7)",
      pointerEvents: "none"
    }
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "5px 14px 9px",
      borderRadius: 12,
      boxSizing: "border-box",
      background: "linear-gradient(180deg,#43464d 0%,#26282d 26%,#0e0f11 62%,#1b1d21 100%)",
      border: "1px solid rgba(255,255,255,.16)",
      boxShadow: "inset 0 1px 0 rgba(255,255,255,.22), inset 0 -1px 0 rgba(0,0,0,.85), 0 10px 24px rgba(0,0,0,.55)",
      display: "flex",
      justifyContent: "center",
      position: "relative"
    }
  }, screw("left", "top"), screw("right", "top"), screw("left", "bottom"), screw("right", "bottom"), window.LockCounter ? /*#__PURE__*/React.createElement(window.LockCounter, {
    text: value.replace(/^\D+/, ""),
    h: 49,
    prefix: (value.match(/^\D+/) || ["$"])[0],
    sepColor: "rgba(255,255,255,.7)"
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.font,
      fontSize: 38,
      color: "#fff",
      letterSpacing: ".04em",
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap",
      textShadow: "0 1px 0 rgba(0,0,0,.35)"
    }
  }, value)), /*#__PURE__*/React.createElement("img", {
    src: "assets/wordmarks/grand-jackpot-line.png",
    alt: "Grand Jackpot",
    style: {
      position: "absolute",
      left: "50%",
      top: -12,
      transform: "translateX(-50%)",
      height: 18,
      width: "auto",
      filter: "drop-shadow(0 3px 7px rgba(0,0,0,.65))",
      pointerEvents: "none"
    }
  }));
}

// Variant B — MATRIX: black tile, dotted red bg, red border + red text
function JackpotMatrix({
  value
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px",
      borderRadius: 12,
      height: 72,
      boxSizing: "border-box",
      background: "#0a0a0a",
      backgroundImage: `radial-gradient(circle, ${ARC}66 0.8px, transparent 1.2px)`,
      backgroundSize: "7px 7px",
      border: `1px solid ${ARC}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 0 18px ${ARC}55, inset 0 0 14px rgba(215,25,33,.18)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "linear-gradient(180deg, transparent, rgba(0,0,0,.55) 100%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    color: ARC,
    size: 6
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      color: ARC,
      letterSpacing: ".14em",
      textTransform: "uppercase"
    }
  }, "Grand Jackpot")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.font,
      fontSize: 18,
      color: ARC,
      letterSpacing: ".03em",
      fontVariantNumeric: "tabular-nums",
      textShadow: `0 0 12px ${ARC}`,
      position: "relative"
    }
  }, "$", value));
}

// Variant C — PREMIUM: deep wine gradient, gold border + gold text
function JackpotPremium({
  value
}) {
  const gold = "#f0c75e";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px",
      borderRadius: 12,
      height: 72,
      boxSizing: "border-box",
      background: "linear-gradient(135deg, #2a1612 0%, #120a0d 100%)",
      border: `1px solid ${gold}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "relative",
      overflow: "hidden",
      boxShadow: `0 0 0 1px ${gold}22, 0 10px 24px rgba(232,195,107,.18)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(110deg, transparent 30%, ${gold}1a 50%, transparent 70%)`,
      animation: "pp-sweep 7s linear infinite",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(StatusDot, {
    color: gold,
    size: 6
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      color: gold,
      letterSpacing: ".14em",
      textTransform: "uppercase"
    }
  }, "Grand Jackpot")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.font,
      fontSize: 18,
      color: gold,
      letterSpacing: ".03em",
      fontVariantNumeric: "tabular-nums",
      textShadow: `0 0 14px ${gold}66`,
      position: "relative"
    }
  }, "$", value));
}
function StatCell({
  label,
  value,
  indicator
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "8px 10px",
      borderRadius: 12,
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.085)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em",
      whiteSpace: "nowrap"
    }
  }, indicator && /*#__PURE__*/React.createElement(StatusDot, {
    color: "#5BD96A",
    size: 4
  }), label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.font,
      fontSize: 15,
      marginTop: 4,
      color: "#fff",
      letterSpacing: ".02em",
      fontVariantNumeric: "tabular-nums"
    }
  }, value));
}

// ──────────────────────────────────────────────────────────────────────
// Game-mode grid — 3 swappable visual variants (chosen via Tweaks)
// ──────────────────────────────────────────────────────────────────────
const MODES = [{
  id: "spin",
  label: "SPIN & WIN"
}, /* E7: старий формат «Spin & Gem» */
{
  id: "bomb",
  label: "FAST POKER"
}, {
  id: "vip",
  label: "VIP"
}, {
  id: "holdem",
  label: "HOLD'EM"
}, {
  id: "plo",
  label: "PLO"
}, {
  id: "tournament",
  label: "TOURNAMENT"
}];
function ModeIcon({
  kind,
  size = 30,
  color = "#fff"
}) {
  const stroke = {
    stroke: color,
    strokeWidth: 1.6,
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (kind) {
    case "flash":
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 32 32"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M18 4 L8 18 H15 L13 28 L24 13 H17 Z"
      }, stroke, {
        fill: color,
        fillOpacity: "0.16"
      })));
    case "spin":
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 32 32"
      }, /*#__PURE__*/React.createElement("circle", _extends({
        cx: "16",
        cy: "16",
        r: "11"
      }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M16 5 V16 H27"
      }, stroke)), /*#__PURE__*/React.createElement("path", {
        d: "M16 5 A11 11 0 0 1 27 16 L16 16 Z",
        fill: color,
        fillOpacity: "0.16",
        stroke: "none"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "16",
        cy: "16",
        r: "1.6",
        fill: color
      }), /*#__PURE__*/React.createElement("path", _extends({
        d: "M22 7 L24 5 L26 7"
      }, stroke)));
    case "bomb":
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 32 32"
      }, /*#__PURE__*/React.createElement("circle", _extends({
        cx: "13",
        cy: "20",
        r: "9",
        fill: color,
        fillOpacity: "0.16"
      }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M19 13 C21 11 23 10 24 8"
      }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M22 6 L24 8 M26 7 L24 8"
      }, stroke)), /*#__PURE__*/React.createElement("circle", {
        cx: "24",
        cy: "8",
        r: "1.8",
        fill: color
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "10",
        cy: "18",
        r: "1.2",
        fill: "rgba(255,255,255,0)",
        stroke: color,
        strokeWidth: "1.2"
      }));
    case "ofc":
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 32 32"
      }, /*#__PURE__*/React.createElement("rect", _extends({
        x: "6",
        y: "9",
        width: "13",
        height: "17",
        rx: "2"
      }, stroke, {
        transform: "rotate(-10 12 17)"
      })), /*#__PURE__*/React.createElement("rect", _extends({
        x: "9",
        y: "7",
        width: "13",
        height: "17",
        rx: "2"
      }, stroke)), /*#__PURE__*/React.createElement("rect", _extends({
        x: "12",
        y: "5",
        width: "13",
        height: "17",
        rx: "2"
      }, stroke, {
        transform: "rotate(10 18 13)"
      })));
    case "vip":
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 32 32"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M4 23 L6 11 L12 17 L16 8 L20 17 L26 11 L28 23 Z"
      }, stroke, {
        fill: color,
        fillOpacity: "0.16"
      })), /*#__PURE__*/React.createElement("path", {
        d: "M5 27 L27 27",
        stroke: color,
        strokeWidth: "2",
        strokeLinecap: "round"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "11",
        r: "1.2",
        fill: color
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "26",
        cy: "11",
        r: "1.2",
        fill: color
      }));
    case "holdem":
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 32 32"
      }, /*#__PURE__*/React.createElement("rect", _extends({
        x: "5",
        y: "8",
        width: "13",
        height: "18",
        rx: "2"
      }, stroke, {
        transform: "rotate(-8 11 17)",
        fill: color,
        fillOpacity: "0.12"
      })), /*#__PURE__*/React.createElement("rect", _extends({
        x: "14",
        y: "6",
        width: "13",
        height: "18",
        rx: "2"
      }, stroke, {
        transform: "rotate(8 20 15)",
        fill: color,
        fillOpacity: "0.16"
      })), /*#__PURE__*/React.createElement("text", {
        x: "17.5",
        y: "18",
        fontFamily: UI.fontUI,
        fontSize: "6",
        fontWeight: "700",
        fill: color,
        textAnchor: "middle",
        transform: "rotate(8 20 15)"
      }, "A"));
    case "plo":
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 32 32"
      }, /*#__PURE__*/React.createElement("rect", _extends({
        x: "3",
        y: "10",
        width: "10",
        height: "15",
        rx: "1.5"
      }, stroke, {
        transform: "rotate(-22 8 17)"
      })), /*#__PURE__*/React.createElement("rect", _extends({
        x: "8",
        y: "8",
        width: "10",
        height: "15",
        rx: "1.5"
      }, stroke, {
        transform: "rotate(-7 13 15)"
      })), /*#__PURE__*/React.createElement("rect", _extends({
        x: "14",
        y: "8",
        width: "10",
        height: "15",
        rx: "1.5"
      }, stroke, {
        transform: "rotate(7 19 15)"
      })), /*#__PURE__*/React.createElement("rect", _extends({
        x: "19",
        y: "10",
        width: "10",
        height: "15",
        rx: "1.5"
      }, stroke, {
        transform: "rotate(22 24 17)"
      })));
    case "tournament":
      return /*#__PURE__*/React.createElement("svg", {
        width: size,
        height: size,
        viewBox: "0 0 32 32"
      }, /*#__PURE__*/React.createElement("path", _extends({
        d: "M10 5 H22 V13 C22 17 19 20 16 20 C13 20 10 17 10 13 Z"
      }, stroke, {
        fill: color,
        fillOpacity: "0.16"
      })), /*#__PURE__*/React.createElement("path", _extends({
        d: "M10 7 H6 V11 C6 13 8 15 10 15"
      }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M22 7 H26 V11 C26 13 24 15 22 15"
      }, stroke)), /*#__PURE__*/React.createElement("path", _extends({
        d: "M16 20 V24"
      }, stroke)), /*#__PURE__*/React.createElement("rect", _extends({
        x: "11",
        y: "24",
        width: "10",
        height: "3",
        rx: "1"
      }, stroke, {
        fill: color,
        fillOpacity: "0.2"
      })));
  }
}
function ModeSection({
  active,
  onChange,
  accent,
  color = "white",
  layout = "uniform"
}) {
  if (layout === "featured") return /*#__PURE__*/React.createElement(ModeGridFeatured, {
    active: active,
    onChange: onChange,
    accent: accent,
    color: color
  });
  if (layout === "compact") return /*#__PURE__*/React.createElement(ModeGridCompact, {
    active: active,
    onChange: onChange,
    accent: accent,
    color: color
  });
  return /*#__PURE__*/React.createElement(ModeGrid, {
    active: active,
    onChange: onChange,
    accent: accent,
    color: color
  });
}
function ModeGrid({
  active,
  onChange,
  accent,
  color = "red"
}) {
  const isWhite = color === "white";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8,
      padding: "0 14px",
      marginTop: 14
    }
  }, MODES.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    onClick: () => onChange(m.id),
    onMouseDown: e => {
      e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    onTouchStart: e => {
      e.currentTarget.style.transform = "scale(0.97)";
    },
    onTouchEnd: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      aspectRatio: "1 / 1",
      position: "relative",
      overflow: "hidden",
      background: isWhite ? "#fff" : accent,
      border: "1px solid transparent",
      borderRadius: 14,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      cursor: "pointer",
      transition: "transform 100ms ease",
      boxShadow: isWhite ? "0 4px 10px rgba(0,0,0,.28), inset 0 0 0 1px rgba(0,0,0,.04)" : `0 6px 14px ${accent}55, inset 0 0 0 1px rgba(255,255,255,.16)`,
      color: isWhite ? "#0a0a0a" : "#fff",
      padding: 8
    }
  }, !isWhite && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.18) 0.6px, transparent 1px)",
      backgroundSize: "8px 8px",
      opacity: 0.35
    }
  }), /*#__PURE__*/React.createElement(ModeIcon, {
    kind: m.id,
    size: 30,
    color: isWhite ? "#0a0a0a" : "#fff"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".06em",
      lineHeight: 1,
      color: isWhite ? "#0a0a0a" : "#fff"
    }
  }, m.label))));
}

// ─── VARIANT B · FEATURED — 2-col mixed-size: 2 tall heroes + 4 short rows
function ModeGridFeatured({
  active,
  onChange,
  accent,
  color = "white"
}) {
  const isWhite = color === "white";
  // 2-col × 4-row grid: 2 hero tiles span rows 1-2, 4 shorts fill rows 3-4
  const tiles = [{
    id: "holdem",
    c: 1,
    r: "1 / 3",
    hero: true
  }, {
    id: "tournament",
    c: 2,
    r: "1 / 3",
    hero: true
  }, {
    id: "spin",
    c: 1,
    r: "3 / 4",
    hero: false
  }, {
    id: "plo",
    c: 2,
    r: "3 / 4",
    hero: false
  }, {
    id: "bomb",
    c: 1,
    r: "4 / 5",
    hero: false
  }, {
    id: "vip",
    c: 2,
    r: "4 / 5",
    hero: false
  }];
  const fg = isWhite ? "#0a0a0a" : "#fff";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gridAutoRows: 64,
      gap: 8,
      padding: "0 14px",
      marginTop: 14
    }
  }, tiles.map(t => {
    const m = MODES.find(x => x.id === t.id);
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      onClick: () => onChange(m.id),
      onMouseDown: e => {
        e.currentTarget.style.transform = "scale(0.97)";
      },
      onMouseUp: e => {
        e.currentTarget.style.transform = "";
      },
      onMouseLeave: e => {
        e.currentTarget.style.transform = "";
      },
      onTouchStart: e => {
        e.currentTarget.style.transform = "scale(0.97)";
      },
      onTouchEnd: e => {
        e.currentTarget.style.transform = "";
      },
      style: {
        gridColumn: t.c,
        gridRow: t.r,
        position: "relative",
        overflow: "hidden",
        background: isWhite ? "#fff" : accent,
        border: "1px solid transparent",
        borderRadius: 14,
        cursor: "pointer",
        transition: "transform 100ms ease",
        boxShadow: isWhite ? "0 4px 10px rgba(0,0,0,.28), inset 0 0 0 1px rgba(0,0,0,.04)" : `0 6px 14px ${accent}55, inset 0 0 0 1px rgba(255,255,255,.16)`,
        padding: t.hero ? 14 : "0 14px",
        display: "flex",
        flexDirection: t.hero ? "column" : "row",
        alignItems: t.hero ? "flex-start" : "center",
        justifyContent: "space-between",
        gap: t.hero ? 0 : 10
      }
    }, !isWhite && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,.18) 0.6px, transparent 1px)",
        backgroundSize: "8px 8px",
        opacity: 0.35
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        fontFamily: UI.fontUI,
        fontWeight: 700,
        fontSize: t.hero ? 16 : 12,
        letterSpacing: ".04em",
        lineHeight: 1.05,
        color: fg,
        textTransform: "uppercase",
        maxWidth: t.hero ? "100%" : "60%"
      }
    }, m.label), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        alignSelf: t.hero ? "flex-end" : "auto",
        display: "inline-flex"
      }
    }, /*#__PURE__*/React.createElement(ModeIcon, {
      kind: m.id,
      size: t.hero ? 44 : 22,
      color: fg
    })));
  }));
}

// ─── VARIANT C · COMPACT — 2-col grid, all 6 short wide rows (uniform)
function ModeGridCompact({
  active,
  onChange,
  accent,
  color = "white"
}) {
  const isWhite = color === "white";
  const fg = isWhite ? "#0a0a0a" : "#fff";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      padding: "0 14px",
      marginTop: 14
    }
  }, MODES.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    onClick: () => onChange(m.id),
    onMouseDown: e => {
      e.currentTarget.style.transform = "scale(0.97)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    onTouchStart: e => {
      e.currentTarget.style.transform = "scale(0.97)";
    },
    onTouchEnd: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      height: 60,
      position: "relative",
      overflow: "hidden",
      background: isWhite ? "#fff" : accent,
      border: "1px solid transparent",
      borderRadius: 14,
      cursor: "pointer",
      transition: "transform 100ms ease",
      boxShadow: isWhite ? "0 4px 10px rgba(0,0,0,.28), inset 0 0 0 1px rgba(0,0,0,.04)" : `0 6px 14px ${accent}55, inset 0 0 0 1px rgba(255,255,255,.16)`,
      padding: "0 14px",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    }
  }, !isWhite && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.18) 0.6px, transparent 1px)",
      backgroundSize: "8px 8px",
      opacity: 0.35
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".06em",
      lineHeight: 1.05,
      color: fg,
      textTransform: "uppercase",
      maxWidth: "65%"
    }
  }, m.label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex"
    }
  }, /*#__PURE__*/React.createElement(ModeIcon, {
    kind: m.id,
    size: 22,
    color: fg
  })))));
}

// ──────────────────────────────────────────────────────────────────────
// Daily check-in widget — 7-day streak with claim CTA
// ──────────────────────────────────────────────────────────────────────
function DailyCheckIn({
  claimed = 4,
  prizesClaimed = 0,
  onCheckIn,
  onOpenPrize,
  onInfo,
  accent = ARC,
  embedded = false
}) {
  const [animDay, setAnimDay] = useState(null); // day currently playing the claim burst
  const [busy, setBusy] = useState(false);
  const completedWeeks = Math.floor(claimed / 7);
  const prizeReady = completedWeeks > prizesClaimed; // a finished week awaiting its prize
  const week = prizeReady ? prizesClaimed + 1 : Math.ceil((claimed + 1) / 7);
  const weekStart = (week - 1) * 7 + 1;
  const weekEnd = week * 7;
  const todayDay = claimed + 1; // next claimable global day
  const headerNum = prizeReady ? weekEnd : todayDay;
  const prize = (window.streakPrizeFor || (() => ({
    tease: ""
  })))(week);
  const days = Array.from({
    length: 7
  }, (_, i) => {
    const n = weekStart + i;
    let status;
    if (prizeReady || n <= claimed) status = "claimed";else if (n === todayDay) status = "today";else status = "future";
    return {
      day: n,
      status
    };
  });
  const claim = () => {
    if (busy) return;
    if (prizeReady) {
      if (window.playClick) window.playClick(1700, 0.07);
      onOpenPrize && onOpenPrize(week);
      return;
    }
    if (window.playClick) window.playClick(1500, 0.06);
    setBusy(true);
    setAnimDay(todayDay);
    setTimeout(() => {
      setAnimDay(null);
      setBusy(false);
      onCheckIn && onCheckIn();
    }, 720);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: embedded ? "0" : "12px 14px 0",
      padding: "12px 14px",
      borderRadius: 16,
      background: "linear-gradient(135deg, #16161a 0%, #0c0c0e 100%)",
      border: "1px solid rgba(255,255,255,.085)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `linear-gradient(110deg, transparent 30%, ${ARC}22 50%, transparent 70%)`,
      animation: "pp-sweep 6s linear infinite"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".18em"
    }
  }, "DAILY CHECK-IN"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.font,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 3,
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, "DAY ", headerNum, " / ", weekEnd, prizeReady && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".14em",
      padding: "2px 6px",
      borderRadius: 5,
      background: `${accent}22`,
      border: `1px solid ${accent}55`
    }
  }, "COMPLETE"))), /*#__PURE__*/React.createElement("button", {
    onClick: claim,
    onMouseDown: e => {
      if (!busy) e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      padding: "7px 14px",
      borderRadius: 125,
      background: busy ? "rgba(255,255,255,.16)" : accent,
      color: busy ? "rgba(255,255,255,.85)" : "#fff",
      border: 0,
      cursor: busy ? "default" : "pointer",
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      display: "flex",
      alignItems: "center",
      gap: 6,
      boxShadow: busy ? "none" : `0 6px 14px ${accent}66, inset 0 0 0 1px rgba(255,255,255,.1)`,
      transition: "transform 100ms, background 200ms",
      animation: prizeReady && !busy ? "pp-pulse-ring 1.8s ease-in-out infinite" : "none"
    }
  }, busy ? /*#__PURE__*/React.createElement(React.Fragment, null, "CLAIMED", /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 7"
  }))) : prizeReady ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "9",
    width: "18",
    height: "12",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 14h18M12 9v12M12 9c-1.5-3-4.5-3-4.5-1S10 9 12 9c2 0 4.5-1 4.5-3S13.5 6 12 9z"
  })), "CLAIM PRIZE") : "CLAIM ›")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 6
    }
  }, days.map((d, i) => {
    const isClaimed = d.status === "claimed";
    const isToday = d.status === "today";
    const isAnim = animDay === d.day;
    if (isAnim) {
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          position: "relative",
          width: 30,
          height: 30
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          border: `2px solid ${accent}`,
          animation: "pp-burst 600ms ease-out forwards"
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 16px ${accent}aa`,
          animation: "pp-claim-pop 520ms cubic-bezier(.2,.8,.2,1)"
        }
      }, /*#__PURE__*/React.createElement("svg", {
        width: "15",
        height: "15",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#fff",
        strokeWidth: "3.2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M5 12l5 5L20 7",
        strokeDasharray: "24",
        strokeDashoffset: "24",
        style: {
          animation: "pp-check-draw 360ms 150ms ease-out forwards"
        }
      }))));
    }
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: isClaimed ? accent : isToday ? `${accent}2e` : "rgba(255,255,255,.075)",
        border: isToday ? `1.5px solid ${accent}` : "1px solid rgba(255,255,255,.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        boxShadow: isToday ? `0 0 12px ${accent}55` : "none"
      }
    }, isClaimed && /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 7"
    })), isToday && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: accent,
        boxShadow: `0 0 8px ${accent}`,
        animation: "pp-pulse 1.6s ease-in-out infinite"
      }
    }), d.status === "future" && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: UI.font,
        fontSize: 11,
        color: "#8A8A93"
      }
    }, d.day));
  })), prize && prize.tease && /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.04);
      onInfo && onInfo();
    },
    style: {
      marginTop: 11,
      display: "flex",
      alignItems: "center",
      gap: 7,
      cursor: "pointer",
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "9",
    width: "18",
    height: "12",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 14h18M12 9v12M12 9c-1.5-3-4.5-3-4.5-1S10 9 12 9c2 0 4.5-1 4.5-3S13.5 6 12 9z"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, "DAY ", weekEnd, " REWARD \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#fff"
    }
  }, prize.tease)), /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.4)",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))));
}
window.DailyCheckIn = DailyCheckIn;

// ──────────────────────────────────────────────────────────────────────
// Streak prizes — escalating weekly milestone rewards
// ──────────────────────────────────────────────────────────────────────
const STREAK_PRIZES = [null, {
  tease: "$25 + TICKET",
  items: [{
    id: "money",
    qty: "$25",
    label: "BONUS CASH",
    sub: "Added to balance"
  }, {
    id: "ticket",
    qty: "1×",
    label: "GOLD TICKET",
    sub: "$215 tournament entry"
  }]
}, {
  tease: "$75 + 3 TICKETS",
  items: [{
    id: "money",
    qty: "$75",
    label: "BONUS CASH",
    sub: "Added to balance"
  }, {
    id: "ticket",
    qty: "3×",
    label: "GOLD TICKETS",
    sub: "$215 tournaments"
  }, {
    id: "spin",
    qty: "1×",
    label: "WHEEL SPIN",
    sub: "Fortune wheel"
  }]
}, {
  tease: "$200 + SPINS",
  items: [{
    id: "money",
    qty: "$200",
    label: "BONUS CASH",
    sub: "Added to balance"
  }, {
    id: "spin",
    qty: "3×",
    label: "WHEEL SPINS",
    sub: "Fortune wheel"
  }, {
    id: "ticket",
    qty: "5×",
    label: "GOLD TICKETS",
    sub: "$215 tournaments"
  }]
}];
function streakPrizeFor(w) {
  return STREAK_PRIZES[w] || {
    tease: `$${w * 100}+ MEGA`,
    items: [{
      id: "money",
      qty: `$${w * 100}`,
      label: "BONUS CASH",
      sub: "Added to balance"
    }, {
      id: "spin",
      qty: `${w}×`,
      label: "WHEEL SPINS",
      sub: "Fortune wheel"
    }, {
      id: "ticket",
      qty: `${w * 2}×`,
      label: "GOLD TICKETS",
      sub: "$215 tournaments"
    }]
  };
}
window.streakPrizeFor = streakPrizeFor;
function StreakRewardIcon({
  id,
  accent
}) {
  const P = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (id === "ticket") return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
    d: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 6v12",
    strokeDasharray: "2 2"
  }));
  if (id === "spin") return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v9h9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "1.4",
    fill: accent,
    stroke: "none"
  }));
  return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.2 9.2A2.6 2.6 0 0 1 12 7.6c1.3 0 2.4.8 2.4 1.9 0 2.4-4.8 1.4-4.8 4 0 1.1 1.1 1.9 2.4 1.9a2.6 2.6 0 0 0 2.8-1.6M12 6v1.6M12 16.4V18"
  }));
}

// Full-screen streak-reward reveal — mirrors the gift-code / wheel prize screen.
function StreakPrize({
  open,
  week,
  accent = ARC,
  onCollect,
  onInfo
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const Gift = window.AlphaVideo;
  const prize = streakPrizeFor(week);
  const SANS = UI.fontUI;
  const MONO = UI.font;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 80,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes sp-pop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}@keyframes sp-rise{0%{transform:translateY(14px);opacity:0}100%{transform:translateY(0);opacity:1}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 360,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 70% at 50% 8%, ${accent}40 0%, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 360,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.085) 0.7px, transparent 1.1px)",
      backgroundSize: "16px 16px",
      maskImage: "linear-gradient(180deg, black, transparent)",
      WebkitMaskImage: "linear-gradient(180deg, black, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCollect,
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
      fontFamily: MONO,
      fontSize: 12,
      color: "#D8D8DF",
      letterSpacing: ".24em"
    }
  }, "STREAK REWARD"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 22px 30px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      animation: "sp-pop .5s cubic-bezier(.2,.9,.3,1.2) both"
    }
  }, Gift ? /*#__PURE__*/React.createElement(Gift, {
    src: window.BONUS_GIFT || "assets/bonus-coins.webm",
    style: {
      width: 190,
      height: 190
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: 190,
      height: 190
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".3em",
      animation: "sp-rise .4s .15s both"
    }
  }, week * 7, "-DAY STREAK"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 26,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 8,
      animation: "sp-rise .4s .2s both"
    }
  }, "STREAK COMPLETE"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      onInfo && onInfo();
    },
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
      marginTop: 12,
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "7px 14px",
      borderRadius: 125,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      cursor: "pointer",
      transition: "transform 100ms",
      animation: "sp-rise .4s .24s both"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13 3 4 14h7l-1 7 9-11h-7z",
    fill: `${accent}22`
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".1em"
    }
  }, "NEXT: DAY ", (week + 1) * 7, " \xB7 BIGGER REWARDS"), /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.5)",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 320,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 22
    }
  }, prize.items.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 13,
      padding: 14,
      borderRadius: 14,
      background: "linear-gradient(155deg, #16161a, #0c0c0e)",
      border: `1px solid ${accent}3a`,
      animation: `sp-rise .4s ${0.28 + i * 0.08}s both`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 44,
      height: 44,
      borderRadius: 12,
      background: `${accent}18`,
      border: `1px solid ${accent}45`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(StreakRewardIcon, {
    id: r.id,
    accent: accent
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 19,
      color: accent
    }
  }, r.qty), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".03em"
    }
  }, r.label)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".03em",
      marginTop: 3
    }
  }, r.sub))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1500, 0.06);
      onCollect && onCollect();
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
      maxWidth: 320,
      marginTop: 16,
      padding: "16px 0",
      borderRadius: 125,
      border: 0,
      background: accent,
      color: "#fff",
      cursor: "pointer",
      boxShadow: `0 12px 28px ${accent}55`,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".08em",
      animation: "sp-rise .4s .54s both"
    }
  }, "COLLECT & CONTINUE")));
}
window.StreakPrize = StreakPrize;

// ──────────────────────────────────────────────────────────────────────
// Streak mechanic explainer — how streaks work + escalating ladder.
// Opens from the STREAK REWARD ribbon (and the check-in teaser).
// ──────────────────────────────────────────────────────────────────────
const STREAK_STEPS = [{
  n: 1,
  title: "CHECK IN DAILY",
  body: "Open the app and tap CLAIM once a day to bank that day."
}, {
  n: 2,
  title: "COMPLETE 7 DAYS",
  body: "Fill a full week to unlock a milestone reward chest."
}, {
  n: 3,
  title: "KEEP THE CHAIN",
  body: "Each week you finish, the next milestone pays out bigger."
}, {
  n: 4,
  title: "DON'T BREAK IT",
  body: "Miss a day and your streak resets back to day 1."
}];
function StreakInfo({
  open,
  onClose,
  onMissions,
  accent = ARC
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const SANS = UI.fontUI;
  const MONO = UI.font;
  const ladder = [1, 2, 3, 4].map(w => ({
    day: w * 7,
    tease: streakPrizeFor(w).tease,
    mega: w === 4
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 85,
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
      height: 320,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 80% 70% at 50% 6%, ${accent}38 0%, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 320,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.085) 0.7px, transparent 1.1px)",
      backgroundSize: "16px 16px",
      maskImage: "linear-gradient(180deg, black, transparent)",
      WebkitMaskImage: "linear-gradient(180deg, black, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.03);
      onClose && onClose();
    },
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
      fontFamily: MONO,
      fontSize: 12,
      color: "#D8D8DF",
      letterSpacing: ".24em"
    }
  }, "HOW STREAKS WORK"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "4px 18px 24px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 20,
      background: `${accent}1c`,
      border: `1px solid ${accent}4d`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 0 28px ${accent}40`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "32",
    height: "32",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3c1 3-1 4-1 6a3 3 0 0 0 6 0c0-1-.3-1.8-.7-2.5C18 9 19 11.5 19 14a7 7 0 0 1-14 0c0-3.5 3-6 5-8 1 .8 1.6 2 2 5z",
    fill: `${accent}22`
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 24,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 16
    }
  }, "BUILD YOUR STREAK"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 12,
      color: "#D8D8DF",
      lineHeight: 1.5,
      marginTop: 8,
      maxWidth: 280
    }
  }, "Show up every day and your rewards snowball. The longer the chain, the bigger the prize.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginTop: 24
    }
  }, STREAK_STEPS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      display: "flex",
      gap: 13,
      padding: "13px 14px",
      borderRadius: 14,
      background: "rgba(255,255,255,.035)",
      border: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: `${accent}1f`,
      border: `1px solid ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 13,
      color: accent
    }
  }, s.n), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, s.title), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS,
      fontWeight: 500,
      fontSize: 11,
      color: "#D8D8DF",
      lineHeight: 1.45,
      marginTop: 4
    }
  }, s.body))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em",
      margin: "24px 2px 12px"
    }
  }, "MILESTONE LADDER"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, ladder.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 14px",
      borderRadius: 12,
      background: m.mega ? `linear-gradient(135deg, ${accent}26, ${accent}08)` : "rgba(255,255,255,.035)",
      border: m.mega ? `1px solid ${accent}55` : "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 46,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 13,
      color: m.mega ? accent : "#fff"
    }
  }, "D", m.day), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 13,
      color: m.mega ? "#fff" : "rgba(255,255,255,.85)"
    }
  }, m.tease), m.mega && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".14em",
      padding: "3px 7px",
      borderRadius: 5,
      background: `${accent}22`,
      border: `1px solid ${accent}55`
    }
  }, "MEGA"))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".06em",
      marginTop: 4,
      textAlign: "center"
    }
  }, "\u2026and it keeps growing every week you stay on."))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 6,
      padding: "12px 18px 26px",
      background: "linear-gradient(180deg, transparent, rgba(0,0,0,.92) 30%, #000)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1400, 0.05);
      onMissions && onMissions();
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
      border: 0,
      background: accent,
      color: "#fff",
      cursor: "pointer",
      boxShadow: `0 12px 28px ${accent}55`,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".08em",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      transition: "transform 100ms"
    }
  }, "MORE MISSIONS", /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))));
}
window.StreakInfo = StreakInfo;

// ──────────────────────────────────────────────────────────────────────
// Rakeback progress widget — current tier → next tier with bar
// ──────────────────────────────────────────────────────────────────────
function RakebackProgress({
  reward = "icon",
  onOpen
}) {
  const P = window.cmPlayer || {
    level: 14,
    xp: 3500,
    xpNext: 5000
  };
  const L = window.cmLeague;
  const lg = L ? L.forLevel(P.level) : {
    name: "SILVER",
    color: "#C8CDD4"
  };
  const lgColor = lg.color;
  const cNow = L ? L.cashbackForLevel(P.level) : 38; // real current rakeback %
  const nextLevel = Math.min(50, P.level + 1);
  const cNext = L ? L.cashbackForLevel(nextLevel) : cNow; // rakeback after next level-up
  const bump = Math.max(0, cNext - cNow); // the gift inside the box
  const percent = Math.max(0, Math.min(100, Math.round(P.xp / P.xpNext * 100)));
  const SANS = UI.fontUI;
  const MONO = UI.font;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onOpen,
    onMouseDown: e => {
      e.currentTarget.style.transform = "scale(.99)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      margin: "10px 14px 0",
      padding: "13px 14px",
      borderRadius: 16,
      background: "linear-gradient(135deg, #16161a 0%, #0c0c0e 100%)",
      border: "1px solid rgba(255,255,255,.085)",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      transition: "transform 120ms ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `linear-gradient(110deg, transparent 30%, ${ARC}22 50%, transparent 70%)`,
      animation: "pp-sweep 5s linear infinite"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      gap: 13,
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: 54,
      borderRadius: 12,
      position: "relative",
      background: `linear-gradient(150deg, ${ARC} 0%, #a3121b 100%)`,
      boxShadow: `0 6px 16px ${ARC}55, inset 0 1px 1px rgba(255,255,255,.22)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "30",
    height: "30",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      animation: "pp-pulse 2.4s ease-in-out infinite"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "8",
    width: "18",
    height: "13",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v13"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8S10.5 3.5 8 3.5 4.8 6.2 6.5 7.4C7.6 8.1 12 8 12 8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8s1.5-4.5 4-4.5 3.2 2.7 1.5 3.9C16.4 8.1 12 8 12 8z"
  })), bump > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -7,
      right: -7,
      minWidth: 20,
      height: 20,
      padding: "0 4px",
      borderRadius: 125,
      background: "#fff",
      color: ARC,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: "-.02em",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 2px 6px rgba(0,0,0,.45)"
    }
  }, "+", bump, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".18em"
    }
  }, "YOUR RAKEBACK"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: lgColor,
      padding: "3px 8px",
      borderRadius: 5,
      background: `${lgColor}1f`,
      border: `1px solid ${lgColor}55`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 2,
      background: lgColor,
      boxShadow: `0 0 6px ${lgColor}aa`
    }
  }), "LVL ", P.level, " \xB7 ", lg.name)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 6,
      marginTop: 3,
      marginBottom: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".16em",
      alignSelf: "center"
    }
  }, "UP TO"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 30,
      lineHeight: 1,
      color: "#fff",
      letterSpacing: "-.01em",
      textShadow: `0 0 14px ${lgColor}55`
    }
  }, cNow, "%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, "BACK ON EVERY HAND")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".12em"
    }
  }, "PROGRESS TO LVL ", nextLevel), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 10.5,
      color: lgColor,
      fontVariantNumeric: "tabular-nums"
    }
  }, percent, "%")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: "rgba(255,255,255,.13)",
      borderRadius: 3,
      overflow: "hidden",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: `${percent}%`,
      height: "100%",
      background: lgColor,
      boxShadow: `0 0 10px ${lgColor}aa`,
      borderRadius: 3,
      transition: "width .5s ease-out"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 6,
      fontFamily: SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontVariantNumeric: "tabular-nums"
    }
  }, P.xp.toLocaleString("en-US").split(",").join(" "), " / ", P.xpNext.toLocaleString("en-US").split(",").join(" "), " XP"), /*#__PURE__*/React.createElement("span", null, bump > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, "UNLOCKS ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#fff"
    }
  }, cNext, "%"), " RAKEBACK") : /*#__PURE__*/React.createElement(React.Fragment, null, "MAX FOR ", lg.name))))));
}

// ──────────────────────────────────────────────────────────────────────
// Quick-play tile — big CTA with animated background
// ──────────────────────────────────────────────────────────────────────
function QuickPlay({
  mode,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "16px 14px 0",
      borderRadius: 20,
      padding: 16,
      background: "linear-gradient(135deg, #16161a 0%, #0c0c0e 100%)",
      border: "1px solid rgba(255,255,255,.085)",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(110deg, transparent 30%, ${accent}22 50%, transparent 70%)`,
      animation: "pp-sweep 4s linear infinite"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 14,
      background: accent,
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
      boxShadow: `0 10px 20px ${accent}55`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 24 24",
    fill: "#fff"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 5v14l11-7z"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".16em"
    }
  }, "SPIN & WIN \xB7 ", mode.toUpperCase()), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.font,
      fontSize: 18,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 2
    }
  }, "JUMP INTO A TABLE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 11,
      color: "#8A8A93",
      letterSpacing: ".1em",
      marginTop: 4
    }
  }, "Texas Hold'em \xB7 $40\u2013$100 \xB7 Table for 6")), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 5l7 7-7 7"
  }))));
}

// ──────────────────────────────────────────────────────────────────────
// Featured tournaments — horizontal carousel
// ──────────────────────────────────────────────────────────────────────
const FEATURED = [{
  name: "DAILY DEEP",
  buy: "$11",
  gtd: "$50K",
  fills: 0.74,
  start: "TONIGHT 21:00",
  accent: "heart"
}, {
  name: "BOUNTY BLITZ",
  buy: "$5.50",
  gtd: "$25K",
  fills: 0.42,
  start: "STARTS 19:30",
  accent: "diamond"
}, {
  name: "TURBO 4-MAX",
  buy: "$22",
  gtd: "$10K",
  fills: 0.88,
  start: "REG OPEN",
  accent: "spade"
}, {
  name: "FREEROLL",
  buy: "FREE",
  gtd: "$500",
  fills: 0.95,
  start: "LATE REG",
  accent: "club"
}];
function FeaturedRow() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "FEATURED TOURNAMENTS",
    hint: "SEE ALL \u203A"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      padding: "10px 14px 2px",
      overflowX: "auto",
      scrollbarWidth: "none"
    }
  }, FEATURED.map((t, i) => /*#__PURE__*/React.createElement(FeaturedCard, {
    key: i,
    t: t
  }))));
}
function FeaturedCard({
  t
}) {
  const isRed = t.accent === "heart" || t.accent === "diamond";
  const accent = isRed ? ARC : "#fff";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: 170,
      padding: 14,
      borderRadius: 14,
      background: "linear-gradient(160deg, #1e1e26, #0a0a0c)",
      border: "1px solid rgba(255,255,255,.13)",
      position: "relative",
      overflow: "hidden",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement(Suit, {
    kind: t.accent,
    size: 120,
    color: accent + (isRed ? "15" : "10"),
    style: {
      position: "absolute",
      right: -30,
      top: -20
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    color: accent,
    bg: isRed ? "rgba(215,25,33,.12)" : "rgba(255,255,255,.13)"
  }, t.buy), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.font,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 10
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.font,
      fontSize: 18,
      color: accent,
      marginTop: 6,
      letterSpacing: ".02em"
    }
  }, t.gtd), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(DotBar, {
    value: Math.round(t.fills * 14),
    max: 14,
    color: accent,
    size: 3,
    gap: 1
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 6,
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".12em"
    }
  }, /*#__PURE__*/React.createElement("span", null, Math.round(t.fills * 100), "% FULL"), /*#__PURE__*/React.createElement("span", null, t.start)))));
}
function SectionHeader({
  title,
  hint
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      padding: "0 18px"
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontFamily: UI.font,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".22em",
      margin: 0,
      textTransform: "uppercase"
    }
  }, title), hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 11,
      color: "#8A8A93",
      letterSpacing: ".14em",
      cursor: "pointer"
    }
  }, hint));
}

// ──────────────────────────────────────────────────────────────────────
// Cash tables list — primary data table of the lobby
// ──────────────────────────────────────────────────────────────────────
// Buy-in range derived from blinds — 40 to 100 big blinds. Players read a
// dollar range ("$2K\u2013$5K") far more easily than a "25/50" blind level.
window.cmBuyIn = function () {
  const bbOf = s => {
    const p = String(s).split("/");
    return parseFloat(p[p.length - 1].replace(/[^0-9.]/g, "")) || 0;
  };
  const full = n => "$" + (Number.isInteger(n) ? n.toLocaleString("en-US").split(",").join(" ") : n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }));
  const k = n => {
    if (n >= 1000) {
      const v = n / 1000;
      return "$" + (Number.isInteger(v) ? v : +v.toFixed(1)) + "K";
    }
    return "$" + (Number.isInteger(n) ? n : +n.toFixed(2));
  };
  return {
    range: s => full(bbOf(s) * 40) + "\u2013" + full(bbOf(s) * 100),
    rangeK: s => k(bbOf(s) * 40) + "\u2013" + k(bbOf(s) * 100)
  };
}();
const TABLES = [{
  name: "ALDERAAN",
  stakes: "$1/$2",
  seats: 6,
  taken: 5,
  avg: 187,
  hand: "FLOP",
  speed: "REG"
}, {
  name: "BESPIN",
  stakes: "$0.50/$1",
  seats: 6,
  taken: 4,
  avg: 92,
  hand: "TURN",
  speed: "REG"
}, {
  name: "CORUSCANT",
  stakes: "$2/$5",
  seats: 9,
  taken: 8,
  avg: 644,
  hand: "PRE",
  speed: "REG"
}, {
  name: "DAGOBAH",
  stakes: "$0.10/$0.25",
  seats: 4,
  taken: 3,
  avg: 22,
  hand: "FLOP",
  speed: "TURBO"
}, {
  name: "ENDOR",
  stakes: "$5/$10",
  seats: 6,
  taken: 6,
  avg: 1820,
  hand: "RIVER",
  speed: "REG"
}, {
  name: "FELUCIA",
  stakes: "$0.25/$0.50",
  seats: 6,
  taken: 2,
  avg: 56,
  hand: "PRE",
  speed: "TURBO"
}];
function TablesList({
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "ACTIVE TABLES \xB7 Texas Hold'em",
    hint: "FILTER \u203A"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "10px 14px 0",
      borderRadius: 14,
      background: "rgba(255,255,255,.025)",
      border: "1px solid rgba(255,255,255,.085)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(TableHead, null), TABLES.map((t, i) => /*#__PURE__*/React.createElement(TableRow, {
    key: t.name,
    t: t,
    i: i,
    accent: accent
  }))));
}
function TableHead() {
  const C = {
    padding: "8px 12px",
    fontFamily: UI.font,
    fontSize: 10.5,
    letterSpacing: ".18em",
    color: "#A9A9B2"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 0.9fr 0.7fr",
      borderBottom: "1px solid rgba(255,255,255,.075)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: C
  }, "TABLE"), /*#__PURE__*/React.createElement("div", {
    style: C
  }, "BUY-IN"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...C,
      textAlign: "center"
    }
  }, "SEATS"), /*#__PURE__*/React.createElement("div", {
    style: {
      ...C,
      textAlign: "right"
    }
  }, "AVG POT"));
}
function TableRow({
  t,
  i,
  accent
}) {
  const [bump, setBump] = useState(false);
  // random "action" pulse to feel live
  useEffect(() => {
    const id = setTimeout(() => setBump(true), 800 + i * 400 + Math.random() * 2000);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    if (!bump) return;
    const i2 = setInterval(() => {
      setBump(false);
      setTimeout(() => setBump(true), 200 + Math.random() * 3000);
    }, 1000 + Math.random() * 3000);
    return () => clearInterval(i2);
  }, [bump]);
  const full = t.taken >= t.seats;
  const handDots = {
    PRE: 1,
    FLOP: 2,
    TURN: 3,
    RIVER: 4
  }[t.hand] || 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 0.9fr 0.7fr",
      alignItems: "center",
      padding: "10px 12px",
      borderBottom: i < TABLES.length - 1 ? "1px solid rgba(255,255,255,.065)" : 0,
      position: "relative",
      cursor: "pointer",
      transition: "background .25s",
      background: bump ? "rgba(215,25,33,.04)" : "transparent"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Suit, {
    kind: ["spade", "heart", "diamond", "club"][i % 4],
    size: 11,
    color: ["#fff", ARC, ARC, "#fff"][i % 4]
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.font,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 4,
      marginTop: 3,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement(DotBar, {
    value: handDots,
    max: 4,
    color: accent,
    size: 3,
    gap: 1
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#8A8A93",
      letterSpacing: ".14em"
    }
  }, t.hand), t.speed === "TURBO" && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#FFB94A",
      letterSpacing: ".14em"
    }
  }, "\xB7 TURBO")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.font,
      fontSize: 11,
      color: "#fff",
      letterSpacing: ".04em",
      fontVariantNumeric: "tabular-nums"
    }
  }, window.cmBuyIn.rangeK(t.stakes)), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.font,
      fontSize: 11,
      color: full ? "#FFB94A" : "#fff",
      letterSpacing: ".04em"
    }
  }, t.taken, "/", t.seats), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      gap: 2,
      marginTop: 3
    }
  }, Array.from({
    length: t.seats
  }).map((_, k) => /*#__PURE__*/React.createElement("i", {
    key: k,
    style: {
      width: 3,
      height: 3,
      borderRadius: "50%",
      background: k < t.taken ? "#fff" : "rgba(255,255,255,.15)"
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "right",
      fontFamily: UI.font,
      fontSize: 11,
      color: "#fff",
      letterSpacing: ".04em",
      fontVariantNumeric: "tabular-nums"
    }
  }, "$", t.avg), bump && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 2,
      background: accent,
      animation: "pp-fadeIn .25s"
    }
  }));
}

// ──────────────────────────────────────────────────────────────────────
// Block 2 · Active-table bubbles — same shape and place as the multitabling
// tabs behind the felt (see HandTab in table.jsx). One bubble per open table:
// discipline colour, your hole cards, and a ring that IS the timer — decision
// clock when it's your turn, sit-out remaining when you stepped away. No text.
// ──────────────────────────────────────────────────────────────────────
const PX_SITOUT_IN = "#4a4a52"; // sit-out drains all colour out of the bubble
// dark ink on light discipline colours, white on the rest
const pxInk = hex => {
  const h = String(hex).replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  const L = (0.299 * (n >> 16 & 255) + 0.587 * (n >> 8 & 255) + 0.114 * (n & 255)) / 255;
  return L > 0.62 ? "#0a0a0c" : "#fff";
};
function TableBubble({
  t,
  onTap,
  active = false
}) {
  const boxRef = useRef(null);
  const cards = t.hand || [];
  const [w, setW] = useState(0);
  useLayoutEffect(() => {
    // offsetWidth, а не getBoundingClientRect: усередині масштабованого
    // контейнера (верхня смуга за столом) rect віддає вже зменшену ширину,
    // і обводка-таймер малювалась вужчою за сам пілз
    const read = () => {
      const el = boxRef.current;
      if (!el) return;
      const bw = el.offsetWidth;
      setW(p => Math.abs(p - bw) < 0.01 ? p : bw);
    };
    read();
    window.addEventListener("resize", read);
    const tm = setTimeout(read, 350); // fonts settling after first paint
    return () => {
      window.removeEventListener("resize", read);
      clearTimeout(tm);
    };
  }, [cards.length]);
  const bg = t.sitOut ? PX_SITOUT_IN : pxDiscColor(t.disc);
  const red = t.sitOut ? "rgba(255,255,255,.45)" : "#E5484D"; // hearts · diamonds
  const black = t.sitOut ? "rgba(255,255,255,.4)" : "#fff"; // spades · clubs — white on black
  const ink = t.sitOut ? "rgba(255,255,255,.5)" : "#fff"; // the rank
  const timed = true; // every open table shows its clock
  const pct = Math.max(0, Math.min(1, (t.secs || 0) / (t.max || 1)));
  const ring = t.sitOut ? "rgba(255,255,255,.5)" : bg;
  const urgent = timed && pct <= 0.25; // last quarter of the clock — the pill breathes
  const n = cards.length || 2;
  const long = n > 4; // PLO5/6 — tighten the type so the hand still fits
  const suitPx = n >= 5 ? 7.5 : n === 4 ? 8.5 : 10;
  const rankPx = n >= 5 ? 9 : n === 4 ? 10 : 11;
  const cardGap = n >= 5 ? 2 : n === 4 ? 4 : 6;
  return /*#__PURE__*/React.createElement("button", {
    ref: boxRef,
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.04);
      onTap && onTap(t);
    },
    style: {
      position: "relative",
      flex: "none",
      width: 82,
      height: 36,
      boxSizing: "border-box",
      borderRadius: 20,
      cursor: "pointer",
      padding: "0 6px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: cardGap,
      background: t.sitOut ? "#15151a" : "#0a0a0c",
      border: `1.5px solid ${active ? "rgba(255,255,255,.34)" : t.sitOut ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.16)"}`,
      /* активний стіл — легке свічення в кольорі дисципліни, без заливки */
      boxShadow: t.sitOut ? "none" : active ? `0 0 20px ${bg}bb, 0 0 6px ${bg}66` : `0 0 12px ${bg}3d`,
      animation: urgent ? "nav-breathe 1.1s ease-in-out infinite" : "none",
      transition: "background .2s, border-color .2s"
    }
  }, cards.length ? cards.map((c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "relative",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      lineHeight: 1
    }
  }, (() => {
    const isRed = c.s === "heart" || c.s === "diamond";
    const col = isRed ? red : black;
    if (!window.Suit) return /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: suitPx,
        color: isRed ? red : "rgba(255,255,255,.75)",
        lineHeight: 1
      }
    }, c.s === "heart" ? "\u2665" : c.s === "diamond" ? "\u2666" : c.s === "club" ? "\u2663" : "\u2660");
    return /*#__PURE__*/React.createElement(window.Suit, {
      kind: c.s,
      size: suitPx,
      color: col
    });
  })(), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.font,
      fontWeight: 700,
      fontSize: rankPx,
      color: ink,
      lineHeight: 1.05,
      marginTop: 1
    }
  }, c.r))) : [0, 1].map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "relative",
      width: 11,
      height: 15,
      borderRadius: 2.5,
      border: "1.5px dashed rgba(255,255,255,.3)"
    }
  })), timed && w > 0 &&
  /*#__PURE__*/
  /* E13: обводка-таймер малювалась зі зсувом -1 і візуально «виїжджала»
     за край пілза — тепер svg точно по геометрії кнопки */
  React.createElement("svg", {
    width: w,
    height: 36,
    viewBox: `0 0 ${w} 36`,
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1.25",
    y: "1.25",
    width: Math.max(0, w - 2.5),
    height: "33.5",
    rx: "16.75",
    ry: "16.75",
    pathLength: "100",
    fill: "none",
    stroke: ring,
    strokeWidth: "2.5",
    strokeLinecap: "butt",
    strokeDasharray: `${pct * 100} 100`,
    strokeDashoffset: -(Math.max(0, w - 2.5 - 33.5) / 2) / (2 * Math.max(0, w - 2.5 - 33.5) + Math.PI * 33.5) * 100,
    style: {
      transition: t.sitOut ? "stroke-dasharray 1s linear" : "stroke-dasharray .25s linear"
    }
  })));
}

// the strip — top of the screen, exactly where the felt keeps its table tabs.
// No cap and no scroller: bubbles wrap onto as many centred rows as they need,
// so nothing clips their shadows and wide PLO6 hands still fit.
const PX_BAND_H = 52; // pill 36 + equal 8/8 padding
function ActiveTables({
  tables,
  onTap,
  top = 0,
  flow = false,
  shown = true
}) {
  // visibility is the app's call (one 8s clock in PokerLobbyCanvas) so the
  // reserved space collapses on every screen at the same moment
  if (!tables || !tables.length) return null;
  const inner = /*#__PURE__*/React.createElement("div", {
    style: {
      height: PX_BAND_H,
      boxSizing: "border-box",
      padding: "8px 10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(-6px)",
      pointerEvents: shown ? "auto" : "none",
      transition: "opacity 420ms ease, transform 420ms cubic-bezier(.2,.8,.2,1)"
    }
  }, tables.map(t => /*#__PURE__*/React.createElement(TableBubble, {
    key: t.id,
    t: t,
    onTap: onTap
  })));
  if (flow) return /*#__PURE__*/React.createElement("div", {
    style: {
      height: shown ? PX_BAND_H : 0,
      overflow: "hidden",
      transition: "height 420ms cubic-bezier(.2,.8,.2,1)"
    }
  }, inner);
  // Обгортка навмисне не ловить натискання: вона розтягнута на всю ширину
  // вгорі екрана і перекривала кнопки «назад» на екранах із меншим
  // z-index (Rewards має 36, смуга — 41), навіть коли бульбашки згаслі.
  // Клікабельні лишаються самі бульбашки — у них pointerEvents: auto.
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top,
      zIndex: 41,
      pointerEvents: "none"
    }
  }, inner);
}
// ──────────────────────────────────────────────────────────────────────
// "Last game" — the most recent CASH session (classic / cash / fast).
// Tournaments are never recorded here; no history at all → no widget.
// ──────────────────────────────────────────────────────────────────────
const PX_DISC_ART = {
  "HOLD'EM": "assets/comp/holdem.png",
  "PLO": "assets/comp/plo4.png",
  "PLO5": "assets/comp/plo5.png",
  "PLO6": "assets/comp/plo6.png",
  "SHORT DECK": "assets/comp/shortdeck.png"
};
const PX_LAST_GAMES = {
  holdem: {
    cat: "classic",
    disc: "HOLD'EM",
    entry: 8000,
    blinds: "100/200",
    seats: 6
  },
  plo: {
    cat: "classic",
    disc: "PLO",
    entry: 4000,
    blinds: "50/100",
    seats: 6
  },
  plo5: {
    cat: "classic",
    disc: "PLO5",
    entry: 2000,
    blinds: "25/50",
    seats: 6
  },
  short: {
    cat: "classic",
    disc: "SHORT DECK",
    entry: 8000,
    blinds: "100/200",
    seats: 6
  },
  fast: {
    cat: "fast",
    disc: "HOLD'EM",
    entry: 80,
    blinds: "1/2",
    seats: 6,
    fast: true
  },
  none: null
};
const pxDiscColor = disc => (window.CL_DISC_COLOR || {})[disc] || "#21C97B";
function ContinueStrip({
  accent,
  game,
  onResume,
  activity,
  onOpen
}) {
  if (!game && !activity) return null;
  const n = activity?.tables.length || 0,
    m = activity?.registrations.length || 0;
  const disc = activity ? activity.tables[0]?.disc || "HOLD'EM" : game.disc;
  const c = pxDiscColor(disc);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      activity ? onOpen?.() : onResume?.(game);
    },
    "aria-label": activity ? "Мои столы" : undefined,
    "data-lobby-activity": activity ? "tables" : "last-game",
    style: {
      width: "calc(100% - 28px)",
      margin: "0 14px",
      padding: "6px 11px",
      borderRadius: 14,
      cursor: "pointer",
      textAlign: "left",
      background: `linear-gradient(120deg, ${c}22 0%, #101013 46%, #0b0b0d 100%)`,
      border: `1px solid ${c}44`,
      boxShadow: `0 0 0 1px ${c}14, 0 8px 22px ${c}1f`,
      display: "flex",
      alignItems: "center",
      gap: 10,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 46% 150% at 6% 50%, ${c}33, transparent 70%)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: "none",
      width: 38,
      height: 38,
      borderRadius: 12,
      display: "grid",
      placeItems: "center",
      background: `linear-gradient(160deg, ${c}2e, rgba(255,255,255,.03))`,
      border: `1px solid ${c}3d`
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: activity ? "assets/comp/fasttable.png" : PX_DISC_ART[game.disc] || PX_DISC_ART["HOLD'EM"],
    alt: "",
    style: {
      width: 30,
      height: 30,
      objectFit: "contain",
      filter: `drop-shadow(0 3px 7px ${c}66)`
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      position: "relative",
      minWidth: 0,
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 9.5,
      letterSpacing: ".18em",
      color: UI.text,
      whiteSpace: "nowrap",
      overflow: "hidden"
    }
  }, activity ? "MY TABLES" : "LAST GAME"), activity ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 7,
      marginTop: 3,
      whiteSpace: 'nowrap',
      fontFamily: UI.fontUI,
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: '.015em',
      color: UI.text
    }
  }, n > 0 && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    "data-i18n": "off",
    style: {
      color: '#fff',
      fontWeight: 700
    }
  }, n), " ", /*#__PURE__*/React.createElement("span", null, "ACTIVE TABLES")), n > 0 && m > 0 && /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      color: '#66666f'
    }
  }, "\xB7"), m > 0 && /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", {
    "data-i18n": "off",
    style: {
      color: '#fff',
      fontWeight: 700
    }
  }, m), " ", /*#__PURE__*/React.createElement("span", null, "TOURNEYS"))) : /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      marginTop: 2,
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 'none',
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: '.1em',
      color: c
    }
  }, game.disc, game.fast && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 9.5,
      letterSpacing: '.1em',
      color: '#8A8A93'
    }
  }, " \xB7 FAST")), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 0,
      fontFamily: UI.font,
      fontSize: 12,
      color: '#fff',
      letterSpacing: '.02em',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      fontVariantNumeric: 'tabular-nums'
    }
  }, game.blinds))), !activity && game.entry != null && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      marginRight: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: "#A9A9B2"
    }
  }, "ENTRY FROM"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 2,
      fontFamily: UI.font,
      fontWeight: 700,
      fontSize: 12,
      color: "#D8D8DF",
      letterSpacing: ".02em",
      fontVariantNumeric: "tabular-nums"
    }
  }, window.pxMoney ? window.pxMoney(game.entry) : "$" + game.entry)), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: "none",
      padding: "6px 14px",
      borderRadius: 125,
      background: c,
      color: "#05100a",
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".08em"
    }
  }, activity ? "OPEN" : "PLAY"));
}
window.ContinueStrip = ContinueStrip;
// ──────────────────────────────────────────────────────────────────────
// Bottom dock
// ──────────────────────────────────────────────────────────────────────
// Правка 1 (архітектура 09.09): Я · НАГРАДЫ · [лого] · КОШЕЛЁК · НАСТРОЙКИ.
// Лідерборди більше не мають своєї кнопки — вони живуть віджетом у Нагородах.
// Full prototype: all navigation sections are available.
const DOCK = [{
  id: "profile",
  label: "DotCenter",
  icon: "profile"
}, {
  id: "rewards",
  label: "REWARDS",
  icon: "missions"
}, {
  id: "lobby",
  label: "MAIN",
  icon: "home",
  primary: true
}, {
  id: "wallet",
  label: "WALLET",
  icon: "cashier"
}, {
  id: "settings",
  label: "SETTINGS",
  icon: "gear"
}];
function DockIcon({
  kind,
  color = "#fff"
}) {
  const props = {
    width: 23,
    height: 23,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (kind) {
    case "home":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M3.5 11L12 3.5 20.5 11"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5.5 9.6V20h13V9.6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9.6 20v-5.4h4.8V20"
      }));
    case "cup":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M7 4h10v4.5a5 5 0 0 1-10 0z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 6H4.4v1.2A3.4 3.4 0 0 0 7.8 10.6M17 6h2.6v1.2a3.4 3.4 0 0 1-3.4 3.4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 14h4M9 20h6M12 13.6V20"
      }));
    case "menu":
      return /*#__PURE__*/React.createElement("svg", {
        width: "48",
        height: "48",
        viewBox: "0 0 149 148",
        fill: "none",
        style: {
          display: "block"
        }
      }, /*#__PURE__*/React.createElement("g", {
        transform: "translate(0.6276, 0.1561)"
      }, /*#__PURE__*/React.createElement("g", {
        transform: "translate(73.8724, 73.8724) rotate(45) translate(-73.8724, -73.8724) translate(23.3725, 19.901)"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M63.1171298,77.5219731 C70.0854238,84.4811655 70.0854238,95.7642414 63.1171298,102.723434 C56.1488303,109.682621 44.850989,109.682621 37.8826895,102.723434 C30.9143955,95.7642414 30.9143955,84.4811655 37.8826895,77.5219731 C44.850989,70.5627861 56.1488303,70.5627861 63.1171298,77.5219731 Z M30.4606608,44.9081838 C37.4289548,51.8673762 37.4289548,63.1504521 30.4606608,70.1096445 C23.4923613,77.0688315 12.19452,77.0688315 5.22622051,70.1096445 C-1.7420735,63.1504521 -1.7420735,51.8673762 5.22622051,44.9081838 C12.19452,37.9489968 23.4923613,37.9489968 30.4606608,44.9081838 Z M70.5391584,44.9081838 C77.507458,37.9489968 88.8052993,37.9489968 95.7735988,44.9081838 C102.741893,51.8673762 102.741893,63.1504521 95.7735988,70.1096445 C88.8052993,77.0688315 77.507458,77.0688315 70.5391584,70.1096445 C63.5708644,63.1504521 63.5708644,51.8673762 70.5391584,44.9081838 Z",
        fill: color
      }), /*#__PURE__*/React.createElement("circle", {
        stroke: color,
        strokeWidth: "3",
        transform: "translate(50.775, 25.2116) rotate(-45) translate(-50.775, -25.2116)",
        cx: "50.7749778",
        cy: "25.2115551",
        r: "16.3272615"
      }))));
    case "events":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M12 2v6M12 22v-6M2 12h6M22 12h-6"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4"
      }));
    case "play":
      return /*#__PURE__*/React.createElement("svg", _extends({}, props, {
        fill: color,
        stroke: "none"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 4l14 8-14 8z"
      }));
    case "cashier":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M19 7V5a2 2 0 0 0-2-2L5 6a2.5 2.5 0 0 0-2 2.5V18a3 3 0 0 0 3 3h13a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21 12h-5a2 2 0 0 0 0 4h5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16.5 14h.01"
      }));
    case "missions":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "8",
        width: "18",
        height: "4",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 12v8h14v-8M12 8v12"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 8H8a2.5 2.5 0 1 1 2.5-2.5L12 8Zm0 0h4a2.5 2.5 0 1 0-2.5-2.5L12 8Z"
      }));
    case "profile":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "7",
        height: "7",
        rx: "2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "3",
        width: "7",
        height: "7",
        rx: "2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "14",
        width: "7",
        height: "7",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M14 21v-3m3.5 3v-7M21 21v-5"
      }));
    case "gear":
      return /*#__PURE__*/React.createElement("svg", props, /*#__PURE__*/React.createElement("path", {
        d: "M4 6h3m4 0h9M4 12h9m4 0h3M4 18h3m4 0h9"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "6",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "18",
        r: "2"
      }));
  }
}

// HOME's play row — 2×2 grid of the four poker formats.
// Online count is room-wide and lives in the section heading, never per tile.
// Один список форматів на весь застосунок: і сітка на головній, і випадайка
// назви розділу в шапці беруть його звідси.
const PX_FORMATS = [{
  id: "cash",
  label: "CASH GAMES",
  sub: "Classic poker",
  art: "assets/comp/chip.png",
  c: "#21C97B"
}, {
  id: "tourn",
  label: "TOURNAMENTS",
  sub: "Multi-table tournaments",
  art: "assets/comp-grand-v3.png",
  c: "#f0c75e"
}, {
  id: "fast",
  label: "FAST POKER",
  sub: "New table every hand",
  art: "assets/comp/flash.png",
  c: "#D71921"
}, {
  id: "spin",
  label: "SPIN & WIN",
  sub: "3-max · up to ×1000",
  art: "assets/comp/spin.png",
  c: "#8B7BF7",
  badge: "FOR BEGINNERS"
}];
window.PX_FORMATS = PX_FORMATS;
function PlayRow({
  accent,
  onPick
}) {
  const ITEMS = PX_FORMATS;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      padding: "0 14px"
    }
  }, /*#__PURE__*/React.createElement("style", null, "@keyframes px-float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-7px) rotate(-1.6deg)}}"), ITEMS.map((it, i) => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    onClick: () => {
      if (window.playClick) window.playClick(it.locked ? 700 : 1200, .04);
      // правка 5: формат ще не відкритий — плитка лишається на вітрині,
      // але веде не в лобі, а в пояснення «скоро»
      if (it.locked) {
        if (window.showScreenInfo) window.showScreenInfo({
          kicker: it.label,
          title: "COMING SOON",
          body: "This format is not open yet. It will appear here as soon as we switch it on.",
          accent,
          noLink: true
        });
        return;
      }
      onPick(it.id);
    },
    style: {
      position: "relative",
      overflow: "hidden",
      cursor: "pointer",
      height: 138,
      padding: "13px 13px 14px",
      borderRadius: 20,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      alignItems: "flex-start",
      textAlign: "left",
      background: it.locked ? "linear-gradient(150deg, rgba(255,255,255,.09) 0%, rgba(255,255,255,.03) 44%, #0c0c0f 78%, #0a0a0c 100%)" : `linear-gradient(150deg, ${it.c || accent}40 0%, ${it.c || accent}14 44%, #0c0c0f 78%, #0a0a0c 100%)`,
      border: `1px solid ${it.locked ? "rgba(255,255,255,.14)" : (it.c || accent) + "59"}`,
      boxShadow: it.locked ? "none" : `inset 0 1px 0 ${it.c || accent}30`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: it.locked ? "none" : `radial-gradient(ellipse 96% 78% at 76% 2%, ${it.c || accent}4d, transparent 64%)`
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: it.art,
    alt: "",
    style: {
      position: "absolute",
      right: 2,
      top: 4,
      width: 96,
      height: 96,
      objectFit: "contain",
      filter: it.locked ? "grayscale(1) brightness(.62) drop-shadow(0 8px 14px rgba(0,0,0,.7))" : "drop-shadow(0 10px 18px rgba(0,0,0,.75))",
      opacity: it.locked ? .75 : 1,
      animation: it.locked ? "none" : `px-float 4.6s ${i * -1.15}s ease-in-out infinite`
    }
  }), it.locked && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 12,
      top: 11,
      width: 26,
      height: 26,
      borderRadius: 125,
      background: "rgba(0,0,0,.55)",
      border: "1px solid rgba(255,255,255,.22)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.8)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4.5",
    y: "10.5",
    width: "15",
    height: "10",
    rx: "2.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 10.5V7.6a4 4 0 0 1 8 0v2.9"
  }))), it.badge && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 13,
      top: 12,
      padding: "3px 8px",
      borderRadius: 125,
      background: (it.c || accent) + "26",
      border: "1px solid " + (it.c || accent) + "66",
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 8.5,
      letterSpacing: ".14em",
      color: it.c || accent,
      whiteSpace: "nowrap"
    }
  }, it.badge), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".1em",
      lineHeight: 1.2,
      color: it.locked ? "rgba(255,255,255,.62)" : "#fff"
    }
  }, it.label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      marginTop: 5,
      fontFamily: UI.fontUI,
      fontWeight: 500,
      fontSize: 10.5,
      letterSpacing: ".04em",
      lineHeight: 1.3,
      color: it.locked ? "#7A7A82" : "#A9A9B2"
    }
  }, it.locked ? "Coming soon" : it.sub))));
}

// brand mark, inline so the satellite dot can be brand red instead of white
function PxMark({
  size = 31,
  dot = null
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size * 108 / 107,
    viewBox: "-3 4.5 107 108",
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    fill: "#fff",
    d: "M63.1171298,77.5219731 C70.0854238,84.4811655 70.0854238,95.7642414 63.1171298,102.723434 C56.1488303,109.682621 44.850989,109.682621 37.8826895,102.723434 C30.9143955,95.7642414 30.9143955,84.4811655 37.8826895,77.5219731 C44.850989,70.5627861 56.1488303,70.5627861 63.1171298,77.5219731 Z M30.4606608,44.9081838 C37.4289548,51.8673762 37.4289548,63.1504521 30.4606608,70.1096445 C23.4923613,77.0688315 12.19452,77.0688315 5.22622051,70.1096445 C-1.7420735,63.1504521 -1.7420735,51.8673762 5.22622051,44.9081838 C12.19452,37.9489968 23.4923613,37.9489968 30.4606608,44.9081838 Z M70.5391584,44.9081838 C77.507458,37.9489968 88.8052993,37.9489968 95.7735988,44.9081838 C102.741893,51.8673762 102.741893,63.1504521 95.7735988,70.1096445 C88.8052993,77.0688315 77.507458,77.0688315 70.5391584,70.1096445 C63.5708644,63.1504521 63.5708644,51.8673762 70.5391584,44.9081838 Z"
  }), /*#__PURE__*/React.createElement("circle", {
    fill: dot || "#fff",
    fillOpacity: dot ? 1 : .72,
    transform: "translate(50.775, 25.2116) rotate(-45) translate(-50.775, -25.2116)",
    cx: "50.7749778",
    cy: "25.2115551",
    r: "17.8272615"
  }));
}

// Bottom dock — a floating solid pill with the HOME logo dead-centre on it.
// The pill is masked by a circle, so its two halves end in concave arcs that
// wrap the button; the circle is bigger than the pill and reads as elevated.
const DOCK_PILL = 68; // pill height
const DOCK_BTN = 62; // logo button diameter
const DOCK_GAP = 0; // pill arcs meet the button edge — no see-through ring
function BottomDock({
  active,
  onChange,
  onPlay,
  accent
}) {
  const [, rbTick] = React.useState(0);
  React.useEffect(() => {
    const f = () => rbTick(n => n + 1);
    window.addEventListener("me-refresh", f);
    return () => window.removeEventListener("me-refresh", f);
  }, []);
  // B1: кнопка home показує СВІЙ стан — акцентна рамка, свічення і подих
  // лише коли відкрите лобі; на інших екранах вона нейтральна.
  const homeOn = active === "lobby";
  const hole = DOCK_BTN / 2 + DOCK_GAP;
  const mask = `radial-gradient(circle ${hole}px at 50% 50%, transparent 0 ${hole}px, #000 ${hole + 0.5}px)`;
  const cell = d => {
    const on = active === d.id;
    return /*#__PURE__*/React.createElement("button", {
      key: d.id,
      className: "pd-nav-item" + (d.id === "profile" ? " pd-dock-me" : ""),
      "data-active": on,
      disabled: !!d.locked,
      "aria-disabled": !!d.locked,
      title: d.locked ? "Раздел недоступен в этой версии" : undefined,
      "aria-current": on ? "page" : undefined,
      onClick: () => {
        // розділ ще не готовий для тесту — кнопка сіра, з замком і не натискається
        if (d.locked) {
          if (window.playClick) window.playClick(650, .03);
          return;
        }
        onChange(d.id);
      },
      style: {
        position: "relative",
        flex: 1,
        minWidth: 0,
        height: DOCK_PILL - 8,
        borderRadius: DOCK_PILL / 2 - 7,
        cursor: d.locked ? "default" : "pointer",
        padding: 0,
        opacity: d.locked ? .42 : 1,
        background: "transparent",
        border: "1px solid transparent",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4
      }
    }, d.id === "profile" && window.cmPlayer?.rakeCycle >= window.cmPlayer?.rakeThreshold && /*#__PURE__*/React.createElement("span", {
      "aria-label": "\u0420\u0435\u0439\u043A\u0431\u0435\u043A \u0433\u043E\u0442\u043E\u0432",
      style: {
        position: "absolute",
        top: 3,
        left: "calc(50% + 10px)",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#d71921"
      }
    }), d.locked && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        right: "50%",
        top: 2,
        marginRight: -20,
        width: 13,
        height: 13
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#A9A9B2",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "4.5",
      y: "10.5",
      width: "15",
      height: "10",
      rx: "2.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 10.5V7.6a4 4 0 0 1 8 0v2.9"
    }))), /*#__PURE__*/React.createElement(DockIcon, {
      kind: d.icon,
      color: d.locked ? "#6A6A72" : on ? accent : "#A9A9B2"
    }), /*#__PURE__*/React.createElement("span", {
      className: "pd-nav-label",
      "data-i18n": "off",
      style: {
        color: d.locked ? '#6A6A72' : on ? '#f1f3f7' : '#99a2b0'
      }
    }, {
      profile: 'DotCenter',
      rewards: 'Награды',
      wallet: 'Кошелёк',
      settings: 'Настройки'
    }[d.id]));
  };
  const half = (list, side) => /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      bottom: 0,
      [side]: 0,
      width: `calc(50% - ${hole}px)`,
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: side === "left" ? "0 4px 0 7px" : "0 7px 0 4px",
      boxSizing: "border-box"
    }
  }, list.map(cell));
  const left = DOCK.slice(0, 2),
    right = DOCK.slice(3);
  return /*#__PURE__*/React.createElement("div", {
    className: "pd-bottom-dock",
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: active === "profile" ? 112 : 26,
      background: active === "profile" ? "linear-gradient(to bottom,rgba(7,8,10,0),#07080a 62%,#07080a)" : "#000",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      margin: "0 12px 26px",
      height: DOCK_PILL
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: DOCK_PILL / 2,
      background: "#000",
      border: "1px solid rgba(255,255,255,.09)",
      boxShadow: "0 14px 30px rgba(0,0,0,.65)",
      maskImage: mask,
      WebkitMaskImage: mask
    }
  }), half(left, "left"), half(right, "right"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041B\u043E\u0431\u0431\u0438",
    onClick: () => onChange("lobby"),
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: DOCK_BTN,
      height: DOCK_BTN,
      borderRadius: "50%",
      opacity: 1,
      background: "#000",
      border: `1.5px solid ${homeOn ? accent : "rgba(255,255,255,.16)"}`,
      cursor: "pointer",
      display: "grid",
      placeItems: "center",
      padding: 0,
      boxShadow: homeOn ? `0 0 26px ${accent}66, 0 10px 24px rgba(0,0,0,.85)` : "0 10px 24px rgba(0,0,0,.85)",
      transition: "border-color 200ms, box-shadow 200ms"
    }
  }, homeOn && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: -6,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${accent}3d 0%, transparent 72%)`,
      animation: "nav-breathe-ring 2.8s ease-in-out infinite",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      animation: homeOn ? "nav-breathe 2.8s ease-in-out infinite" : "none",
      opacity: homeOn ? 1 : .72,
      transition: "opacity 200ms"
    }
  }, /*#__PURE__*/React.createElement(PxMark, {
    size: 32,
    dot: homeOn ? "#E01F20" : "#8A8A93"
  })))));
}
// ──────────────────────────────────────────────────────────────────────
// Root lobby — wires everything together
// ──────────────────────────────────────────────────────────────────────
function PokerLobbyCanvas({
  hideIsland = false,
  initialMode = "holdem"
} = {}) {
  const [tweaks, setTweak] = window.useTweaks ? window.useTweaks(window.TWEAK_DEFAULTS || {}) : [{
    accent: ARC,
    density: "regular"
  }, () => {}];
  const accent = tweaks.accent || ARC;
  // the player's currency drives every money figure app-wide (blinds, buy-ins,
  // jackpot, wallet) through one formatter
  useEffect(() => {
    const c = window.PX_CUR || tweaks.currency || "USD";
    if (window.pxSetCurrency && window.PX_CUR !== c) window.pxSetCurrency(c);
  }, [tweaks.currency]);
  // one repaint hook so a currency switch refreshes every inline money figure
  const [, curTick] = useState(0);
  useEffect(() => {
    window.__pxRepaint = () => curTick(n => n + 1);
    return () => {
      if (window.__pxRepaint) delete window.__pxRepaint;
    };
  }, []);
  // Module-1 export mode: Getting Started, Welcome Offer and Daily Check-in are
  // shown but non-interactive, and the Next Event widget is dropped.
  const M1 = !!(typeof window !== "undefined" && window.LOBBY_MODULE1);
  const [mode, setMode] = useState(initialMode);
  const [dock, setDockState] = useState("profile");
  const setDock = id => setDockState(id);
  const [profileBack, setProfileBack] = useState(false); // Profile entered from header (show back) vs dock tab (no back)
  const [meOverlay, setMeOverlay] = useState(false); // v3: оверлей розділу «Я» відкритий — обгортка вище дока
  const [playOpen, setPlayOpen] = useState(false);
  const [playPick, setPlayPick] = useState(false); // version chooser (V1/V2)
  const [playV2Open, setPlayV2Open] = useState(false);
  const [playV3Open, setPlayV3Open] = useState(false);
  const [cashOpen, setCashOpen] = useState(false); // cash lobby (dock PLAY)
  const [cashCat, setCashCat] = useState(null);
  const [cashDisc, setCashDisc] = useState(null); // resume handoff: land on this discipline's table list
  const [cashSeat, setCashSeat] = useState(null); // правка 15: сісти одразу за стіл
  // last CASH session shown on HOME — tournaments are excluded by design
  const lastGame = PX_LAST_GAMES[tweaks.lastGame || "holdem"];
  const [playInit, setPlayInit] = useState(null); // {cat, format} handoff from V2/V3
  const [tournOpen, setTournOpen] = useState(false);
  const [tournEv, setTournEv] = useState(null); // the tapped event drives the detail page
  const [depositOpen, setDepositOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  // правка 13 · пуш переїзду з ClubGG: лише сегмент мігрантів, лише до першого тапу
  const [migrPush, setMigrPush] = useState(false);
  const [notifFocus, setNotifFocus] = useState(null); // лист, який відкрити одразу
  const [rakebackOpen, setRakebackOpen] = useState(new URLSearchParams(location.search).has("cardhouse"));
  const [rbHistoryOpen, setRbHistoryOpen] = useState(false);
  const [bbjOpen, setBbjOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false); // link + QR screen
  const [refRewardsOpen, setRefRewardsOpen] = useState(false); // referral rewards / wheel
  const [streakDays, setStreakDays] = useState(4); // daily check-ins done
  const [streakPrizes, setStreakPrizes] = useState(0); // weekly milestone prizes collected
  const [prizeWeek, setPrizeWeek] = useState(null); // week whose prize reveal is open
  const [streakInfoOpen, setStreakInfoOpen] = useState(false); // "how streaks work" explainer

  // ── 28-day Daily Check-In (see checkin.jsx) ──
  const [ciDay, setCiDay] = useState(48); // lifetime days checked in — never resets (day 49 is a present, so the reward window is demoable)
  const [ciFrozen, setCiFrozen] = useState(() => {
    try {
      return new URLSearchParams(location.search).get("paused") === "1";
    } catch (e) {
      return false;
    }
  }); // streak paused; preview via ?paused=1
  const [ciOpen, setCiOpen] = useState(false); // full calendar open
  const [ciCheckedToday, setCiCheckedToday] = useState(false); // banked today's day already?
  const doCheckIn = () => {
    if (ciCheckedToday) return; // one check-in per calendar day
    setCiFrozen(false);
    setCiCheckedToday(true);
    setCiDay(prev => {
      const day = prev + 1;
      // a present lands on every 7th day — the run is endless, so no 28-day cap
      if (day % 7 === 0) {
        const conf = window.CI_MILES && window.CI_MILES.present || {
          items: []
        };
        if (window.claimReward) window.claimReward({
          kicker: "DAILY CHECK-IN \u00b7 DAY " + day,
          heading: "PRESENT OPENED",
          accent,
          items: (conf.items || []).map(r => ({
            amount: r.q,
            sub: r.sub,
            icon: r.t === "cash" ? "chip" : r.t
          })),
          note: "Next present on day " + (day + 7) + "."
        });
      }
      return day;
    });
  };
  const [tasksOpen, setTasksOpen] = useState(false); // missions screen
  const [ticketsOpen, setTicketsOpen] = useState(false); // ticket wallet, opened from WALLET
  const [giftOpen, setGiftOpen] = useState(false); // gift codes, from Rewards
  const [honeymoonOpen, setHoneymoonOpen] = useState(false);

  // ── памʼять переходів ──────────────────────────────────────────────
  // Частина екранів відкривається з інших і при цьому закриває їх — інакше
  // новий екран ліг би позаду, бо z-index у прототипі в кожного свій.
  // Через це «назад» скидало в лобі. Тепер при такому переході ми
  // запамʼятовуємо, що саме відновити, і «назад» повертає туди, звідки
  // прийшли. Ключ потрібен, щоб не відновити чуже: якщо екран відкрили
  // звичайним шляхом, памʼять порожня і поведінка лишається старою.
  const [returnTo, setReturnTo] = useState(null); // { to, restore }
  const navTo = (key, leave, enter, restore) => {
    leave();
    enter();
    setReturnTo({
      to: key,
      restore: restore
    });
  };
  const navBack = (key, leave) => {
    leave();
    if (returnTo && returnTo.to === key) {
      returnTo.restore();
      setReturnTo(null);
    }
  }; // onboarding quest line
  const PX_TABLE_SETS = {
    mixed: [{
      id: "t12",
      name: "TABLE 12",
      disc: "HOLD'EM",
      stake: "$2 / $5",
      seats: 6,
      buyIn: 500,
      hand: [{
        r: "A",
        s: "heart"
      }, {
        r: "10",
        s: "spade"
      }],
      turn: true,
      secs: 11,
      max: 15
    }, {
      id: "t33",
      name: "TABLE 33",
      disc: "PLO",
      stake: "$1 / $2",
      seats: 6,
      buyIn: 200,
      hand: [{
        r: "K",
        s: "diamond"
      }, {
        r: "Q",
        s: "club"
      }, {
        r: "J",
        s: "heart"
      }, {
        r: "9",
        s: "spade"
      }],
      turn: true,
      secs: 14,
      max: 20
    }, {
      id: "t08",
      name: "TABLE 08",
      disc: "HOLD'EM",
      stake: "$1 / $2",
      seats: 9,
      buyIn: 200,
      hand: [{
        r: "7",
        s: "club"
      }, {
        r: "7",
        s: "diamond"
      }],
      sitOut: true,
      secs: 252,
      max: 300
    }],
    // four simultaneous tables, four distinct deals — same set the felt's tabs use
    plo6: [[{
      r: "A",
      s: "spade"
    }, {
      r: "K",
      s: "heart"
    }, {
      r: "Q",
      s: "diamond"
    }, {
      r: "J",
      s: "club"
    }, {
      r: "9",
      s: "heart"
    }, {
      r: "8",
      s: "spade"
    }], [{
      r: "K",
      s: "club"
    }, {
      r: "T",
      s: "diamond"
    }, {
      r: "7",
      s: "spade"
    }, {
      r: "6",
      s: "heart"
    }, {
      r: "4",
      s: "club"
    }, {
      r: "2",
      s: "diamond"
    }], [{
      r: "Q",
      s: "heart"
    }, {
      r: "9",
      s: "spade"
    }, {
      r: "8",
      s: "club"
    }, {
      r: "5",
      s: "diamond"
    }, {
      r: "3",
      s: "heart"
    }, {
      r: "2",
      s: "spade"
    }], [{
      r: "J",
      s: "diamond"
    }, {
      r: "T",
      s: "heart"
    }, {
      r: "6",
      s: "club"
    }, {
      r: "5",
      s: "spade"
    }, {
      r: "4",
      s: "diamond"
    }, {
      r: "3",
      s: "club"
    }]].map((hand, i) => ({
      id: "p" + (i + 1),
      name: "TABLE " + (41 + i),
      disc: "PLO6",
      stake: "$1 / $2",
      seats: 5,
      buyIn: 200,
      hand,
      turn: true,
      secs: [9, 15, 6, 18][i],
      max: 20
    })),
    // one live table per discipline — the four pill colours side by side
    four: [{
      id: "f1",
      name: "NLH 22",
      disc: "HOLD'EM",
      stake: "$2 / $5",
      seats: 8,
      buyIn: 500,
      hand: [{
        r: "A",
        s: "heart"
      }, {
        r: "K",
        s: "spade"
      }],
      turn: true,
      secs: 9,
      max: 15
    }, {
      id: "f2",
      name: "PLO 34",
      disc: "PLO",
      stake: "$1 / $2",
      seats: 6,
      buyIn: 200,
      hand: [{
        r: "K",
        s: "diamond"
      }, {
        r: "Q",
        s: "club"
      }, {
        r: "J",
        s: "heart"
      }, {
        r: "9",
        s: "spade"
      }],
      turn: true,
      secs: 15,
      max: 20
    }, {
      id: "f3",
      name: "PLO5 6",
      disc: "PLO5",
      stake: "$1 / $2",
      seats: 6,
      buyIn: 200,
      hand: [{
        r: "Q",
        s: "heart"
      }, {
        r: "J",
        s: "spade"
      }, {
        r: "9",
        s: "club"
      }, {
        r: "8",
        s: "diamond"
      }, {
        r: "5",
        s: "heart"
      }],
      turn: true,
      secs: 6,
      max: 20
    }, {
      id: "f4",
      name: "PLO6 41",
      disc: "PLO6",
      stake: "$1 / $2",
      seats: 5,
      buyIn: 200,
      hand: [{
        r: "J",
        s: "diamond"
      }, {
        r: "T",
        s: "heart"
      }, {
        r: "8",
        s: "club"
      }, {
        r: "6",
        s: "spade"
      }, {
        r: "4",
        s: "diamond"
      }, {
        r: "3",
        s: "club"
      }],
      turn: true,
      secs: 18,
      max: 20
    }],
    one: [{
      id: "t12",
      name: "TABLE 12",
      disc: "HOLD'EM",
      stake: "$2 / $5",
      seats: 6,
      buyIn: 500,
      hand: [{
        r: "A",
        s: "heart"
      }, {
        r: "10",
        s: "spade"
      }],
      turn: true,
      secs: 11,
      max: 15
    }],
    none: []
  };
  const [myTablesOpen, setMyTablesOpen] = useState(false);
  const registeredEvents = window.useRegisteredEvents();
  const activityScenario = window.PXActivity.scenario;
  const [liveTable, setLiveTable] = useState(null); // felt opened from a bubble
  // Block 2 — the tables you have open. secs/max drive the outline ring only.
  const [openTables, setOpenTables] = useState(() => PX_TABLE_SETS[activityScenario === "idle" || activityScenario === "registered" ? "none" : tweaks.tableSet || "four"]);
  const tournamentTables = registeredEvents.filter(e => e.start <= Date.now()).slice(0, 4).map(e => ({
    id: 'tourney-' + e.id,
    name: e.name,
    disc: {
      nlh: "HOLD'EM",
      plo: 'PLO',
      plo5: 'PLO5',
      plo6: 'PLO6'
    }[e.disc || e.game] || "HOLD'EM",
    stake: 'MTT',
    seats: 7,
    tourneyEvent: e,
    hand: [{
      r: 'K',
      s: 'club'
    }, {
      r: 'J',
      s: 'diamond'
    }],
    turn: true,
    secs: 12,
    max: 20
  }));
  // Four shared seats in the prototype: cash and running tournaments use the same limit.
  const activeTables = []; // Live tables are outside this review scope.
  const tableSet = activityScenario === "idle" || activityScenario === "registered" ? "none" : tweaks.tableSet || "four";
  useEffect(() => {
    setOpenTables(PX_TABLE_SETS[tableSet] || PX_TABLE_SETS.mixed);
  }, [tableSet]);

  // a game lobby or the felt is open → no bottom bar, no pinned header
  const inGame = myTablesOpen || cashOpen || playOpen || playPick || playV2Open || playV3Open || tournOpen || !!liveTable;
  // the tournament lobby keeps its header (back + balance) but drops the dock
  const hideDock = inGame || dock === "tourn" || dock === "cashier";
  const hideHeader = inGame || dock === "wallet" || dock === "profile" || dock === "settings" || dock === "rewards" || dock === "competitions";
  // one source of truth for the balance every game lobby quotes
  const balMode = tweaks.balance || (window.PX_BALANCE_ZERO ? "zero" : "full");
  const balanceNum = balMode === "zero" ? 0 : balMode === "low" ? 140 : 2500000;
  // and its split: USD + Cash$ + Tourney$ always add up to balanceNum
  const balanceSplit = {
    usd: Math.round(balanceNum * .739),
    cash: Math.round(balanceNum * .193),
    tourney: 0
  };
  balanceSplit.tourney = balanceNum - balanceSplit.usd - balanceSplit.cash;
  const [, refreshRewardWallet] = useState(0);
  useEffect(() => {
    const update = () => refreshRewardWallet(v => v + 1);
    window.addEventListener("reward-wallet-change", update);
    return () => window.removeEventListener("reward-wallet-change", update);
  }, []);
  const rewardCredits = window.cmRewardWallet?.totals || {
    cash: 0,
    tdollar: 0
  };
  balanceSplit.usd = Math.round((balanceSplit.usd + (rewardCredits.main || 0)) * 100) / 100;
  balanceSplit.cash = Math.round((balanceSplit.cash + rewardCredits.cash) * 100) / 100;
  balanceSplit.tourney = Math.round((balanceSplit.tourney + rewardCredits.tdollar) * 100) / 100;
  const balanceStr /* M1: лише виводимий USD */ = window.pxMoney ? window.pxMoney(balanceSplit.usd) : "$" + balanceSplit.usd.toLocaleString("en-US").split(",").join("\u00A0");
  // any screen can read the seatable wallets (USD + Cash$) from here
  if (typeof window !== "undefined") window.pxWallets = () => ({
    usd: balanceSplit.usd,
    cash: balanceSplit.cash,
    tourney: balanceSplit.tourney
  });
  // the logo button: one step home from anywhere
  // the bar collapses to a floating bell where the screen owns identity+balance
  const barSlim = dock === "profile" || dock === "settings"; // hero card owns identity
  const barOff = 104; // pinned bar height, cleared of the Dynamic Island
  // the reserved band for open tables — visible for 8s after the set changes,
  // then everything below moves up in step
  const [bandOn, setBandOn] = useState(true);
  // повноекранні під-екрани (історія роздач тощо) живуть усередині доку,
  // тому смуга столів (z 41) малювалася поверх їхньої шапки — ховаємо її
  const [fullOpen, setFullOpen] = useState(0);
  useEffect(() => {
    const h = e => setFullOpen(n => Math.max(0, n + ((e && e.detail) > 0 ? 1 : -1)));
    window.addEventListener("px-full", h);
    return () => window.removeEventListener("px-full", h);
  }, []);
  const bandKey = (openTables || []).map(t => t.id).join(",");
  useEffect(() => {
    setBandOn(true);
    const t = setTimeout(() => setBandOn(false), 8000);
    return () => clearTimeout(t);
  }, [bandKey]);
  const bandH = activeTables.length && bandOn ? PX_BAND_H : 0;
  // the band sits at the very top (under the island), the identity bar below it
  const bandTop = 44;
  const bandBottom = bandH ? bandTop + bandH : 0; // 96 when pills exist and are shown
  const hdrPadTop = bandH ? bandBottom + 6 : 62; // identity bar's top padding
  const hdrRowBottom = hdrPadTop + 44; // its visible bottom
  // content offset: headerless screens clear the band, headered ones clear the bar
  const inset = base => bandH ? base <= 40 ? bandBottom + 4 : hdrRowBottom + 8 : base;
  const [screenModal, setScreenModal] = useState(false);
  useEffect(() => {
    const h = () => setScreenModal(!!window.__pxModalOpen);
    window.addEventListener("px-modal", h);
    return () => window.removeEventListener("px-modal", h);
  }, []);
  const goHome = () => {
    if (window.playClick) window.playClick(1250, 0.04);
    setCashOpen(false);
    setCashCat(null);
    setPlayOpen(false);
    setPlayV2Open(false);
    setPlayV3Open(false);
    setTournOpen(false);
    setTournEv(null);
    setCompetitionsOpen(false);
    setTasksOpen(false);
    setMyTablesOpen(false);
    setProfileBack(false);
    setDock("profile");
  };
  useEffect(() => {
    window.openDeposit = () => {
      window.__cashierTab = "deposit";
      setDock("cashier");
    };
    return () => {
      delete window.openDeposit;
    };
  }, []);

  // one clock for every bubble; timers loop so the rings are always demoable
  useEffect(() => {
    const id = setInterval(() => setOpenTables(ts => ts.map(t => ({
      ...t,
      secs: (t.secs || 0) <= 1 ? t.max || 20 : t.secs - 1
    }))), 1000);
    return () => clearInterval(id);
  }, []);
  const [competitionsOpen, setCompetitionsOpen] = useState(false); // discipline leaderboards
  const [compRace, setCompRace] = useState(null); // open straight into one board
  // lobby-only floating chrome (status islands) must never paint over a full-screen overlay
  const overlayUp = myTablesOpen || dock !== "lobby" || playOpen || playPick || playV2Open || playV3Open || cashOpen || tournOpen || depositOpen || notifOpen || rakebackOpen || bbjOpen || inviteOpen || refRewardsOpen || ciOpen || tasksOpen || honeymoonOpen || competitionsOpen || streakInfoOpen || prizeWeek != null;
  const chromeHidden = hideIsland || overlayUp;
  // capture/debug navigation hooks — open any screen programmatically
  const [compPreset, setCompPreset] = useState(null); // discipline+limit carried in from a table
  const [tourneyTable, setTourneyTable] = useState(null); // seated at a tournament felt
  if (typeof window !== "undefined") window.openTourneyTable = t => {
    const name = t && t.name || "SPRING MILLIONS";
    const gtd = t && t.gtd || "$400 000";
    setTourneyTable({
      name: "TABLE 14",
      max: 9,
      auto: true,
      disc: t && t.disc || "HOLD'EM",
      stake: t && t.buyIn || "",
      tourney: {
        user: "Cardomancer",
        rank: 1,
        field: t && t.field || 251,
        total: 84842.62,
        regular: 33802.87,
        bounty: 51039.75,
        event: name + " \u00b7 " + gtd + " GTD",
        playTime: window.MTT_LIVE && window.MTT_LIVE.elapsedStr ? window.MTT_LIVE.elapsedStr() : "05:28:11",
        date: "AUG 26, 2026 00:53"
      }
    });
  };
  const openActiveTable = t => t.tourneyEvent ? window.openTourneyTable(t.tourneyEvent) : setLiveTable({
    ...t,
    max: t.seats || t.max
  });
  // any screen can open a tournament's own lobby (satellite rungs, tickets)
  if (typeof window !== "undefined") window.openEventDetail = ev => {
    setTournEv(ev || null);
    setTournOpen(true);
  };
  if (typeof window !== "undefined") window.openCompetitions = p => {
    // a board opened from a table lands on that table's discipline and limit tier
    const disc = p && window.cpDiscForTable ? window.cpDiscForTable(p.disc) : "ALL";
    const tier = p && window.cpTierForStake ? window.cpTierForStake(p.stake) : "ALL";
    setCompPreset(p ? {
      disc,
      tier
    } : null);
    setCompRace(p && p.board ? p.board : "grand");
    setCompetitionsOpen(true);
  };
  // правка 13 · мігрантові при першому вході кладемо лист у «ВАЖНОЕ»
  // і піднімаємо пуш; після тапу пуш більше не зʼявляється
  useEffect(() => {
    window.__pxSegment = tweaks.segment || "nodep"; // правка 20: дефолт вкладки кешу
    if (window.cmNotifStore && window.NOTIF_MIGRANT) window.cmNotifStore.ensure(window.NOTIF_MIGRANT);
    let seen = false;
    try {
      seen = localStorage.getItem("px_clubgg_push") === "1";
    } catch (e) {}
    if (!seen) setMigrPush(true);
  }, [tweaks.segment]);

  // випадайка форматів у шапці: перескочити в інший режим з будь-якого екрана
  if (typeof window !== "undefined") {
    window.__pxPickFormat = () => {};
    window.__nav = {
      dock: setDock,
      cash: () => {},
      checkin: () => {},
      tasks: () => {},
      honeymoon: () => {},
      comps: () => {},
      deposit: () => {},
      notif: (v = true) => setNotifOpen(v),
      segment: v => setTweak("segment", v)
    };
  }
  const scrollerRef = useRef(null);
  const scrollY = useScroll(scrollerRef);
  return /*#__PURE__*/React.createElement("div", {
    "data-app-root": "1",
    "data-section": dock,
    style: {
      width: "100%",
      height: "100%",
      background: "#000",
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(ellipse at 50% 0%, ${accent}18 0%, transparent 50%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: scrollerRef,
    className: "pd-lobby-underlay",
    inert: dock !== "lobby" ? "" : undefined,
    "aria-hidden": dock !== "lobby",
    style: {
      position: "absolute",
      inset: 0,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 94
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: 62,
      flex: "none"
    }
  }), !liveTable && !tourneyTable && /*#__PURE__*/React.createElement(ActiveTables, {
    flow: true,
    shown: bandOn,
    tables: activeTables,
    onTap: openActiveTable
  }), /*#__PURE__*/React.createElement(LobbyHeader, {
    flow: true,
    padTop: 6,
    slim: barSlim,
    balance: balanceSplit.usd,
    chips: 89230,
    scrollY: 0,
    onCashier: () => setDock("cashier"),
    onDeposit: () => {
      window.__cashierTab = "deposit";
      setDock("cashier");
    },
    onBell: () => setNotifOpen(true),
    onRakeback: () => {
      setProfileBack(true);
      setDock("profile");
    },
    onProfile: () => {
      setProfileBack(true);
      setDock("profile");
    }
  }), /*#__PURE__*/React.createElement(HeroCarousel, {
    scrollY: scrollY,
    onCta: () => setDock("tourn"),
    onDeposit: () => {
      window.__cashierTab = "deposit";
      setDock("cashier");
    },
    newPlayer: (tweaks.segment || "nodep") === "nodep"
  }), /*#__PURE__*/React.createElement(JackpotBar, {
    jackpotVariant: tweaks.jackpot || "inferno",
    onJackpot: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      setBbjOpen(true);
    }
  }), activeTables.length || registeredEvents.length ? /*#__PURE__*/React.createElement(window.MyTablesStrip, {
    tables: activeTables,
    registrations: registeredEvents,
    onOpen: () => setMyTablesOpen(true)
  }) : /*#__PURE__*/React.createElement(ContinueStrip, {
    accent: accent,
    game: lastGame,
    onResume: g => {
      const b = String(g.blinds || "").split("/");
      setCashOpen(false);
      setCashCat(null);
      setCashDisc(null);
      setCashSeat(null);
      requestAnimationFrame(() => {
        setCashCat(g.cat);
        setCashSeat({
          disc: g.disc,
          sb: parseFloat(b[0]) || 0,
          bb: parseFloat(b[1]) || 0,
          fast: !!g.fast
        });
        setCashOpen(true);
      });
    }
  }), /*#__PURE__*/React.createElement(FormatsHeader, null), /*#__PURE__*/React.createElement(PlayRow, {
    accent: accent,
    onPick: id => {
      if (id === "tourn") {
        setCashOpen(false);
        setCashCat(null);
        setCashDisc(null);
        setCashSeat(null);
        setDock("tourn");
        return;
      }
      setCashOpen(false);
      setCashCat(null);
      requestAnimationFrame(() => {
        setCashCat(id);
        setCashOpen(true);
      });
    }
  }), /*#__PURE__*/React.createElement(LobbyFooter, null)), /*#__PURE__*/React.createElement(MigrationPush, {
    show: migrPush && !rakebackOpen && dock === "lobby",
    onOpen: () => {
      try {
        localStorage.setItem("px_clubgg_push", "1");
      } catch (e) {}
      setMigrPush(false);
      setNotifFocus((window.NOTIF_MIGRANT || {}).id || null);
      setNotifOpen(true);
    }
  }), !hideHeader && !screenModal && dock !== "lobby" && /*#__PURE__*/React.createElement(LobbyHeader, {
    pinned: true,
    padTop: hdrPadTop,
    slim: barSlim,
    balance: balanceSplit.usd,
    chips: 89230,
    scrollY: scrollY,
    onBack: dock === "tourn" ? goHome : null,
    section: dock === "tourn" ? "TOURNAMENTS" : null,
    sectionMenu: dock === "tourn",
    onCashier: () => setDock("cashier"),
    onDeposit: () => {
      window.__cashierTab = "deposit";
      setDock("cashier");
    },
    onBell: () => setNotifOpen(true),
    onRakeback: () => {
      setProfileBack(true);
      setDock("profile");
    },
    onProfile: () => {
      setProfileBack(true);
      setDock("profile");
    }
  }), !hideDock && /*#__PURE__*/React.createElement(BottomDock, {
    active: dock,
    onChange: id => {
      if (id === "profile") setProfileBack(false);
      setDock(id);
    },
    onPlay: goHome,
    accent: accent
  }), window.CheckInCalendar && /*#__PURE__*/React.createElement(window.CheckInCalendar, {
    open: ciOpen,
    claimed: ciDay,
    checkedToday: ciCheckedToday,
    frozen: ciFrozen,
    accent: accent,
    onClose: () => navBack("checkin", () => setCiOpen(false)),
    onCheckIn: doCheckIn
  }), window.RewardClaimHost && /*#__PURE__*/React.createElement(window.RewardClaimHost, {
    accent: accent
  }), window.ScreenInfoHost && /*#__PURE__*/React.createElement(window.ScreenInfoHost, null), window.TermHost && /*#__PURE__*/React.createElement(window.TermHost, null), window.AchievementHost && /*#__PURE__*/React.createElement(window.AchievementHost, null), window.ShareImageHost && /*#__PURE__*/React.createElement(window.ShareImageHost, null), window.TableWinHost && /*#__PURE__*/React.createElement(window.TableWinHost, null), window.TourneyResultHost && /*#__PURE__*/React.createElement(window.TourneyResultHost, null), tourneyTable && window.PokerTableScreen && /*#__PURE__*/React.createElement(window.PokerTableScreen, {
    open: true,
    table: tourneyTable,
    autoSeat: true,
    discipline: tourneyTable.disc,
    onBack: () => setTourneyTable(null),
    onClose: () => setTourneyTable(null),
    accent: accent
  }), /*#__PURE__*/React.createElement(StreakPrize, {
    open: prizeWeek != null,
    week: prizeWeek || 1,
    accent: accent,
    onCollect: () => {
      setStreakPrizes(p => p + 1);
      setPrizeWeek(null);
    },
    onInfo: () => setStreakInfoOpen(true)
  }), !liveTable && !tourneyTable && dock !== "lobby" && dock !== "profile" && !fullOpen && /*#__PURE__*/React.createElement(ActiveTables, {
    shown: bandOn,
    tables: activeTables,
    top: bandTop,
    onTap: openActiveTable
  }), /*#__PURE__*/React.createElement(window.MyTablesScreen, {
    open: myTablesOpen,
    tables: activeTables,
    registrations: registeredEvents,
    onClose: () => setMyTablesOpen(false),
    onTable: t => {
      setMyTablesOpen(false);
      openActiveTable(t);
    },
    onEvent: e => {
      setMyTablesOpen(false);
      setTournEv(e);
      setTournOpen(true);
    },
    onBrowse: () => {
      setMyTablesOpen(false);
      setCashCat(null);
      setCashDisc(null);
      setCashSeat(null);
      setCashOpen(true);
    }
  }), liveTable && window.PokerTableScreen && /*#__PURE__*/React.createElement(window.PokerTableScreen, {
    open: true,
    table: liveTable,
    autoSeat: true,
    discipline: liveTable.disc,
    stakes: liveTable.stake,
    onBack: () => setLiveTable(null),
    onClose: () => {
      setOpenTables(ts => ts.filter(t => t.id !== liveTable.id));
      setLiveTable(null);
    },
    accent: accent
  }), /*#__PURE__*/React.createElement(StreakInfo, {
    open: streakInfoOpen,
    accent: accent,
    onClose: () => setStreakInfoOpen(false),
    onMissions: () => {
      setStreakInfoOpen(false);
      setPrizeWeek(null);
      setTasksOpen(true);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: tasksOpen ? 72 : 36,
      pointerEvents: tasksOpen || dock === "rewards" ? "auto" : "none"
    }
  }, window.TasksScreen && /*#__PURE__*/React.createElement(window.TasksScreen, {
    nested: dock === "rewards" && !tasksOpen,
    topInset: inset(40),
    open: tasksOpen || dock === "rewards",
    onClose: () => {
      setTasksOpen(false);
      if (dock === "rewards") setDock("lobby");
    },
    accent: accent,
    ciDay: ciDay,
    ciCheckedToday: ciCheckedToday,
    ciFrozen: ciFrozen,
    onCheckInOpen: () => {
      const d = dock;
      navTo("checkin", () => {
        setTasksOpen(false);
        if (d === "rewards") setDock("lobby");
      }, () => setCiOpen(true), () => {
        if (d === "rewards") setDock("rewards");else setTasksOpen(true);
      });
    },
    onCheckInNow: () => {
      const d = dock;
      doCheckIn();
      navTo("checkin", () => {
        setTasksOpen(false);
        if (d === "rewards") setDock("lobby");
      }, () => setCiOpen(true), () => {
        if (d === "rewards") setDock("rewards");else setTasksOpen(true);
      });
    },
    onHoneymoon: () => setHoneymoonOpen(true),
    onCompetitions: () => setCompetitionsOpen(true)
    /* «Пригласить друга» веде на РЕФЕРАЛЬНИЙ екран з колесом фортуни
       і другою вкладкою «FRIEND ROYALE» — так було до підміни. */,
    onInvite: () => {
      const d = dock;
      navTo("referral", () => {
        setTasksOpen(false);
        if (d === "rewards") setDock("lobby");
      }, () => setRefRewardsOpen(true), () => {
        if (d === "rewards") setDock("rewards");else setTasksOpen(true);
      });
    },
    onSafe: () => {
      const d = dock;
      navTo("rakeback", () => {
        setTasksOpen(false);
        if (d === "rewards") setDock("lobby");
      }, () => setRakebackOpen(true), () => {
        if (d === "rewards") setDock("rewards");else setTasksOpen(true);
      });
    },
    onGiftCode: () => setGiftOpen(true),
    onPlayDisc: target => {
      if (!target) return;
      setTasksOpen(false);
      if (target.cat === "tourn") {
        setDock("tourn");
        return;
      }
      if (target.cat === "cashier") {
        setDock("cashier");
        return;
      }
      if (target.cat === "invite") {
        setDock("lobby");
        setInviteOpen(true);
        return;
      }
      setDock("lobby");
      setCashOpen(false);
      setCashCat(null);
      setCashDisc(null);
      requestAnimationFrame(() => {
        setCashCat(target.cat);
        setCashDisc(target.disc || null);
        setCashOpen(true);
      });
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 95,
      pointerEvents: honeymoonOpen ? "auto" : "none"
    }
  }, window.HoneymoonScreen && /*#__PURE__*/React.createElement(window.HoneymoonScreen, {
    open: honeymoonOpen,
    onClose: () => setHoneymoonOpen(false),
    accent: accent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: competitionsOpen ? 72 : 36,
      pointerEvents: competitionsOpen || dock === "competitions" ? "auto" : "none"
    }
  }, window.CompetitionsScreen && /*#__PURE__*/React.createElement(window.CompetitionsScreen, {
    nested: !competitionsOpen,
    topInset: inset(40),
    open: competitionsOpen || dock === "competitions",
    initialRace: compRace,
    preset: compPreset,
    onClose: () => {
      setCompetitionsOpen(false);
      setCompRace(null);
      setCompPreset(null);
      if (dock === "competitions") setDock("lobby");
    },
    accent: accent,
    onReferral: () => {
      const d = dock;
      navTo("referral", () => {
        setCompetitionsOpen(false);
        setCompRace(null);
      }, () => setRefRewardsOpen(true), () => {
        if (d === "competitions") setDock("competitions");else setCompetitionsOpen(true);
      });
    }
  })), window.PlayFlow && /*#__PURE__*/React.createElement(window.PlayFlow, {
    open: playOpen,
    onClose: () => setPlayOpen(false),
    style: tweaks.playFlowStyle || "tiles",
    vipStyle: tweaks.vipStyle || "champagne"
  }), window.PlayVersionPicker && /*#__PURE__*/React.createElement(window.PlayVersionPicker, {
    open: playPick,
    onClose: () => setPlayPick(false),
    onPick: v => {
      setPlayPick(false);
      setPlayInit(null);
      v === "v1" ? setPlayOpen(true) : v === "v2" ? setPlayV2Open(true) : setPlayV3Open(true);
    }
  }), window.CashLobby && /*#__PURE__*/React.createElement(window.CashLobby, {
    onLeft: table => {
      if (!table) return;
      const id = table.id || [table.disc, table.name, table.stake].join(':');
      setOpenTables(ts => ts.filter(t => t.id !== id));
    },
    onSeated: table => setOpenTables(ts => {
      const id = table.id || [table.disc, table.name, table.stake].join(':');
      return ts.some(t => t.id === id) ? ts : [...ts, {
        ...table,
        id,
        hand: table.hand || (PX_TABLE_SETS.four.find(t => t.disc === table.disc) || PX_TABLE_SETS.four[0]).hand,
        seats: table.max,
        turn: true,
        secs: 15,
        max: 20
      }];
    }),
    open: cashOpen,
    balance: balanceStr,
    initialCat: cashCat,
    initialDisc: cashDisc,
    initialSeat: cashSeat,
    onTourn: () => {
      setCashOpen(false);
      setCashCat(null);
      setCashDisc(null);
      setCashSeat(null);
      setDock("tourn");
    },
    onClose: () => {
      setCashOpen(false);
      setCashCat(null);
      setCashDisc(null);
      setCashSeat(null);
    },
    accent: accent,
    tableTile: tweaks.tableTile || "7"
  }), window.PlayV2 && /*#__PURE__*/React.createElement(window.PlayV2, {
    open: playV2Open,
    onClose: () => setPlayV2Open(false),
    accent: accent,
    tableTile: tweaks.tableTile || "7",
    onHandoff: (cat, format) => {
      setPlayV2Open(false);
      setPlayInit({
        cat,
        format
      });
      setPlayOpen(true);
    }
  }), window.PlayV3 && /*#__PURE__*/React.createElement(window.PlayV3, {
    open: playV3Open,
    onClose: () => setPlayV3Open(false),
    accent: accent,
    onHandoff: (cat, format) => {
      setPlayV3Open(false);
      setPlayInit({
        cat,
        format
      });
      setPlayOpen(true);
    }
  }), window.TournamentDetail && /*#__PURE__*/React.createElement(window.TournamentDetail, {
    open: tournOpen,
    liveEvent: tournEv,
    onClose: () => navBack("tourn", () => setTournOpen(false)),
    accent: accent,
    onDeposit: () => {
      window.__cashierTab = "deposit";
      setDock("cashier");
    }
  }), window.WalletScreen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 36,
      pointerEvents: dock === "wallet" ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement(window.WalletScreen, {
    nested: true,
    topInset: inset(40),
    open: dock === "wallet",
    accent: accent,
    usd: balanceSplit.usd,
    cash: balanceSplit.cash,
    tourney: balanceSplit.tourney,
    tickets: 4,
    onCashier: () => {
      window.__cashierTab = "deposit";
      setDock("cashier");
    },
    onWithdraw: () => {
      window.__cashierTab = "withdraw";
      setDock("cashier");
    },
    onTickets: () => setTicketsOpen(true),
    onClose: () => setDock("lobby")
  })), window.GiftCodeScreen && /*#__PURE__*/React.createElement(window.GiftCodeScreen, {
    open: giftOpen,
    onClose: () => setGiftOpen(false),
    accent: accent
  }), window.TicketsScreen && /*#__PURE__*/React.createElement(window.TicketsScreen, {
    open: ticketsOpen,
    onClose: () => setTicketsOpen(false),
    accent: accent,
    onUseTicket: () => setTicketsOpen(false),
    onOpenEvent: e => {
      navTo("tourn", () => setTicketsOpen(false), () => {
        setTournEv(e || null);
        setTournOpen(true);
      }, () => setTicketsOpen(true));
    }
  }), window.Cashier && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: dock === "cashier" ? 260 : 36,
      pointerEvents: dock === "cashier" ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement(window.Cashier, {
    nested: true,
    topInset: inset(barOff),
    open: dock === "cashier",
    onClose: () => setDock("lobby"),
    balance: balanceSplit.usd,
    accent: accent
  })), window.NotificationsScreen && /*#__PURE__*/React.createElement(window.NotificationsScreen, {
    open: notifOpen,
    focusId: notifFocus,
    accent: accent,
    onClose: () => {
      setNotifOpen(false);
      setNotifFocus(null);
    }
  }), window.CardHouseScreen && rakebackOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 72
    }
  }, /*#__PURE__*/React.createElement(window.CardHouseScreen, {
    open: rakebackOpen,
    onClose: () => navBack("rakeback", () => setRakebackOpen(false)),
    accent: accent,
    onHistory: () => setRbHistoryOpen(true),
    onPayout: (amount, currency = "main") => {
      if (window.RB_HIST_PUSH) window.RB_HIST_PUSH({
        kind: "house",
        amount,
        currency,
        label: "Основной баланс"
      });
    }
  }), window.RewardHistoryScreen && /*#__PURE__*/React.createElement(window.RewardHistoryScreen, {
    open: rbHistoryOpen,
    accent: accent,
    onClose: () => setRbHistoryOpen(false)
  })), window.BadBeatPage && /*#__PURE__*/React.createElement(window.BadBeatPage, {
    open: bbjOpen,
    onClose: () => setBbjOpen(false),
    accent: accent,
    onPlayCash: () => {
      setBbjOpen(false);
      setCashOpen(true);
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 92,
      pointerEvents: inviteOpen ? "auto" : "none"
    }
  }, window.InviteScreen && /*#__PURE__*/React.createElement(window.InviteScreen, {
    open: inviteOpen,
    onClose: () => navBack("invite", () => setInviteOpen(false)),
    accent: accent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 92,
      pointerEvents: refRewardsOpen ? "auto" : "none"
    }
  }, window.ReferralRewards && /*#__PURE__*/React.createElement(window.ReferralRewards, {
    open: refRewardsOpen,
    onClose: () => navBack("referral", () => setRefRewardsOpen(false)),
    accent: accent
  })), (() => {
    window.__goEvents = () => {
      setTournOpen(false);
      setDock("tourn");
    };
    return null;
  })(), window.EventsScreen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 36,
      pointerEvents: dock === "tourn" ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement(window.EventsScreen, {
    nested: true,
    topInset: inset(barOff),
    open: dock === "tourn",
    onClose: () => setDock("lobby"),
    accent: accent,
    layout: "list",
    rowVariant: 12,
    onOpenEvent: e => {
      setTournEv(e || null);
      setTournOpen(true);
    }
  })), window.MeScreen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: meOverlay ? 72 : 36,
      pointerEvents: dock === "profile" ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement(window.MeScreen, {
    open: dock === "profile",
    directProfile: profileBack,
    accent: accent,
    onOverlay: setMeOverlay,
    onClose: () => {
      setProfileBack(false);
      setDock("lobby");
    }
  })), window.ProfileScreen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 36,
      pointerEvents: dock === "settings" ? "auto" : "none"
    }
  }, /*#__PURE__*/React.createElement(window.ProfileScreen, {
    mode: "settings",
    nested: true,
    topInset: inset(40),
    open: dock === "settings",
    onClose: () => setDock("lobby"),
    accent: accent,
    onRakeback: () => setRakebackOpen(true),
    onSafe: () => {}
  })), window.TweaksPanel && /*#__PURE__*/React.createElement(window.TweaksPanel, {
    title: "LOBBY \xB7 TWEAKS"
  }, /*#__PURE__*/React.createElement(window.TweakSection, {
    title: "Theme"
  }, /*#__PURE__*/React.createElement(window.TweakColor, {
    label: "Accent",
    value: tweaks.accent,
    onChange: v => setTweak("accent", v),
    options: [ARC, "#f0c75e", "#6FA8FF", "#8E5CFF", "#5BD96A"]
  })), /*#__PURE__*/React.createElement(window.TweakSection, {
    title: "Home"
  }, /*#__PURE__*/React.createElement(window.TweakSelect, {
    label: "Open tables",
    value: tweaks.tableSet || "four",
    onChange: v => setTweak("tableSet", v),
    options: [{
      value: "four",
      label: "4 disciplines"
    }, {
      value: "plo6",
      label: "4 × PLO6"
    }, {
      value: "mixed",
      label: "Mixed (3)"
    }, {
      value: "one",
      label: "One table"
    }, {
      value: "none",
      label: "None"
    }]
  }), /*#__PURE__*/React.createElement(window.TweakSelect, {
    label: "Last game",
    value: tweaks.lastGame || "holdem",
    onChange: v => setTweak("lastGame", v),
    options: [{
      value: "holdem",
      label: "Hold'em"
    }, {
      value: "plo",
      label: "PLO"
    }, {
      value: "plo5",
      label: "PLO5"
    }, {
      value: "short",
      label: "Short Deck"
    }, {
      value: "fast",
      label: "Fast Poker"
    }, {
      value: "none",
      label: "No history"
    }]
  }), /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "Player segment",
    value: tweaks.segment || "nodep",
    onChange: v => setTweak("segment", v),
    options: [{
      value: "nodep",
      label: "No deposit"
    }, {
      value: "dep",
      label: "Depositor"
    }, {
      value: "migrant",
      label: "ClubGG migrant"
    }]
  })), /*#__PURE__*/React.createElement(window.TweakSection, {
    title: "Bad Beat Jackpot"
  }, /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "Style",
    value: tweaks.jackpot || "inferno",
    onChange: v => setTweak("jackpot", v),
    options: [{
      value: "inferno",
      label: "INFERNO"
    }, {
      value: "matrix",
      label: "MATRIX"
    }, {
      value: "premium",
      label: "PREMIUM"
    }]
  })), /*#__PURE__*/React.createElement(window.TweakSection, {
    title: "Balance"
  }, /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "Player balance",
    value: tweaks.balance || "full",
    onChange: v => setTweak("balance", v),
    options: [{
      value: "full",
      label: "Full"
    }, {
      value: "low",
      label: "Low"
    }, {
      value: "zero",
      label: "Empty"
    }]
  })), /*#__PURE__*/React.createElement(window.TweakSection, {
    title: "Currency"
  }, /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "Player currency",
    value: tweaks.currency || window.PX_CUR || "USD",
    onChange: v => {
      setTweak("currency", v);
      if (window.pxSetCurrency) window.pxSetCurrency(v);
    },
    options: [{
      value: "USD",
      label: "$ USD"
    }, {
      value: "EUR",
      label: "€ EUR"
    }, {
      value: "KZT",
      label: "₸ KZT"
    }]
  })), /*#__PURE__*/React.createElement(window.TweakSection, {
    title: "Play Flow"
  }, /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "Table tile",
    value: tweaks.tableTile || "7",
    onChange: v => setTweak("tableTile", v),
    options: [{
      value: "1",
      label: "T1"
    }, {
      value: "2",
      label: "T2"
    }, {
      value: "3",
      label: "T3"
    }, {
      value: "4",
      label: "T4"
    }, {
      value: "5",
      label: "T5"
    }, {
      value: "6",
      label: "T6"
    }, {
      value: "7",
      label: "T7"
    }]
  }), /*#__PURE__*/React.createElement(window.TweakRadio, {
    label: "Picker style",
    value: tweaks.playFlowStyle || "tiles",
    onChange: v => setTweak("playFlowStyle", v),
    options: [{
      value: "tiles",
      label: "TILES"
    }, {
      value: "wheels",
      label: "WHEELS"
    }]
  }))));
}
Object.assign(window, {
  PokerLobbyCanvas,
  ModeIcon,
  TableBubble,
  pxDiscColor,
  PxMark
});
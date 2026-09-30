// Profile — Account tab (dock stays visible). Curated for a crypto cash-poker
// shell: balance, quick tiles, settings, support. On-brand dark + red + mono.

const MONO_P = UI.font;
const SANS_P = UI.fontUI;
function PIcon({
  kind,
  color = "#fff",
  size = 20
}) {
  const P = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (kind) {
    case "cash":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "5",
        width: "18",
        height: "14",
        rx: "3"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 12h.01M18 12h.01"
      }));
    case "clock":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 7v5l3 2"
      }));
    case "gift":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "8",
        width: "18",
        height: "13",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 12h18M12 8v13M12 8S10 3 7.5 4.2 9.5 8 12 8zM12 8s2-5 4.5-3.8S14.5 8 12 8z"
      }));
    case "invite":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "8",
        r: "3.2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M18 8v6M21 11h-6"
      }));
    case "code":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "6",
        width: "18",
        height: "12",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 6v12M11 6v12M15 9v6M18 9v6"
      }));
    case "activity":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "3.5",
        y: "4.5",
        width: "17",
        height: "16",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3.5 9h17M8 3v3M16 3v3M8.5 14l2.2 2.2 4-4.4"
      }));
    case "tickets":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M15 6v12",
        strokeDasharray: "2 2"
      }));
    case "settings":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M19.4 13.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H3a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 7.4l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.7-1.1V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-1.1 2.7H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"
      }));
    case "history":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M3 12a9 9 0 1 0 3-6.7M3 4v3h3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 8v4l3 2"
      }));
    case "chart":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M4 20V10M10 20V4M16 20v-7M22 20H2"
      }));
    case "help":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M4 13v-1a8 8 0 0 1 16 0v1M20 17v1a3 3 0 0 1-3 3h-3"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "11",
        width: "4",
        height: "7",
        rx: "2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "17",
        y: "11",
        width: "4",
        height: "7",
        rx: "2"
      }));
    case "sliders":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M4 7h7m4 0h5M4 17h3m4 0h9"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "13",
        cy: "7",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "17",
        r: "2"
      }));
    case "pause":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 8v8m6-8v8"
      }));
    case "shield":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 12l2 2 4-4"
      }));
    case "lock":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "11",
        width: "16",
        height: "9",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 11V8a4 4 0 0 1 8 0v3"
      }));
    case "logout":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M16 17l5-5-5-5M21 12H9"
      }));
    case "camera":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M4 8a2 2 0 0 1 2-2h1.5l1.2-1.8A1 1 0 0 1 9.5 4h5a1 1 0 0 1 .8.4L16.5 6H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12.5",
        r: "3.2"
      }));
    default:
      return null;
  }
}

// Правка 2 (архітектура 09.09): колишній Профіль розібрано на два розділи.
//   «Я»        — усі прогреси, нагороди, статистика гравця
//   «Настройки» — налаштування, відповідальна гра, безпека, вихід
// «Помощь и поддержка» присутня в обох.
const ME_MENU = [{
  id: "hands",
  icon: "history",
  label: "HAND HISTORY",
  sub: "Your last 100 hands · replay"
}, {
  id: "stats",
  icon: "chart",
  label: "STATS CABINET",
  sub: "Your results by game and limit"
}, {
  id: "help",
  icon: "help",
  label: "HELP & SUPPORT",
  sub: "Telegram · around the clock"
}];
const SETTINGS_MENU = [{
  id: "settings",
  icon: "settings",
  label: "GAME SETTINGS",
  sub: "Sounds · Betting · Buy-in · more"
}, {
  id: "respo",
  icon: "lock",
  label: "RESPONSIBLE GAMING",
  sub: "Take a break · freeze up to 24 hours"
}, {
  id: "help",
  icon: "help",
  label: "HELP & SUPPORT",
  sub: "Telegram · around the clock"
}];
const SETTINGS_ITEMS = [{
  id: "sounds",
  label: "SOUNDS",
  value: "ON"
}, {
  id: "betting",
  label: "BETTING",
  value: "SB · 33%"
}, {
  id: "buyin",
  label: "BUY-IN",
  value: "USD · 100%"
}, {
  id: "theme",
  label: "TABLE THEME",
  value: "CLASSIC"
}, {
  id: "timebank",
  label: "TIME BANK",
  value: "AUTO"
}, {
  id: "currency",
  label: "CURRENCY DISPLAY",
  value: "USD"
}, {
  id: "language",
  label: "LANGUAGE",
  value: "ENGLISH"
}, {
  id: "timezone",
  label: "TIME ZONE",
  value: "UTC-8"
}];
const AVA_BASE = ["assets/avatar.png", "assets/chat/drebin.webp", "assets/chat/girl.webp", "assets/chat/yanu.webp", "assets/chat/sponge.webp"];
// 50 standard avatars — placeholder set cycles the 5 available renders.
const AVATARS = Array.from({
  length: 50
}, (_, i) => ({
  id: "a" + i,
  src: AVA_BASE[i % AVA_BASE.length]
}));
function AvatarPickerSheet({
  open,
  current,
  onClose,
  onSelect
}) {
  const [photo, setPhoto] = React.useState(current),
    [frame, setFrame] = React.useState('none'),
    [error, setError] = React.useState('');
  const input = React.useRef(null),
    store = window.cmFrames;
  React.useEffect(() => {
    if (open) {
      setPhoto(current);
      setFrame(store?.choice() || 'none');
      setError('');
    }
  }, [open, current]);
  if (!open) return null;
  const owned = store?.owned() || [],
    selected = frame === 'auto' ? store?.selected()?.id : frame === 'none' ? null : frame;
  const save = () => {
    try {
      localStorage.setItem('pd-avatar', photo);
    } catch (e) {
      setError('Фото слишком большое. Выберите изображение поменьше.');
      return;
    }
    store?.choose(frame);
    onSelect(photo);
    onClose();
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "pd-avatar-editor",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u0424\u043E\u0442\u043E \u0438 \u0440\u0430\u043C\u043A\u0430",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("header", {
    className: "pd-screen-header"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434 \u043A \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430\u043C",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("h2", null, "\u0424\u043E\u0442\u043E \u0438 \u0440\u0430\u043C\u043A\u0430"), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "pd-avatar-scroll"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pd-avatar-preview"
  }, /*#__PURE__*/React.createElement(window.FramedAvatar, {
    src: photo,
    size: 100,
    player: false,
    frameId: selected
  })), /*#__PURE__*/React.createElement("input", {
    ref: input,
    type: "file",
    accept: "image/*",
    hidden: true,
    onChange: e => {
      const f = e.target.files?.[0];
      if (!f) return;
      if (!f.type.startsWith('image/')) {
        setError('Выберите изображение.');
        return;
      }
      const r = new FileReader();
      r.onload = () => {
        setPhoto(r.result);
        setError('');
      };
      r.readAsDataURL(f);
    }
  }), /*#__PURE__*/React.createElement("h3", null, "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u0430\u0432\u0430\u0442\u0430\u0440"), /*#__PURE__*/React.createElement("div", {
    className: "pd-photo-grid"
  }, /*#__PURE__*/React.createElement("button", {
    className: "pd-photo-add",
    "aria-label": "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u0432\u043E\u0451 \u0444\u043E\u0442\u043E",
    title: "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u0432\u043E\u0451 \u0444\u043E\u0442\u043E",
    onClick: () => input.current.click()
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 5v14M5 12h14"
  }))), AVA_BASE.map((src, i) => /*#__PURE__*/React.createElement("button", {
    key: src,
    "aria-label": 'Аватар ' + (i + 1),
    "aria-pressed": photo === src,
    onClick: () => setPhoto(src)
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: ""
  })))), /*#__PURE__*/React.createElement("h3", null, "\u041C\u043E\u0438 \u0440\u0430\u043C\u043A\u0438 ", /*#__PURE__*/React.createElement("small", null, owned.length, " \u043E\u0442\u043A\u0440\u044B\u0442\u043E")), /*#__PURE__*/React.createElement("div", {
    className: "pd-frame-grid"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-pressed": frame === 'none',
    onClick: () => setFrame('none')
  }, /*#__PURE__*/React.createElement(window.FramedAvatar, {
    src: photo,
    size: 52,
    player: false
  }), /*#__PURE__*/React.createElement("span", null, "\u0411\u0435\u0437 \u0440\u0430\u043C\u043A\u0438")), owned.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    "aria-pressed": selected === f.id,
    onClick: () => setFrame(f.id)
  }, /*#__PURE__*/React.createElement(window.FramedAvatar, {
    src: photo,
    size: 52,
    player: false,
    frameId: f.id
  }), /*#__PURE__*/React.createElement("span", null, f.name)))), !owned.length && /*#__PURE__*/React.createElement("p", null, "\u041D\u043E\u0432\u044B\u0435 \u0440\u0430\u043C\u043A\u0438 \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0437\u0434\u0435\u0441\u044C, \u043A\u043E\u0433\u0434\u0430 \u0432\u044B \u0438\u0445 \u0440\u0430\u0437\u0431\u043B\u043E\u043A\u0438\u0440\u0443\u0435\u0442\u0435."), error && /*#__PURE__*/React.createElement("p", {
    role: "alert"
  }, error)), /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("button", {
    onClick: save
  }, "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C")));
}
const pGrp = n => Math.round(n).toLocaleString("en-US").split(",").join("\u00A0");
function ProfileScreen({
  open,
  onClose,
  showBack = false,
  accent = "#D71921",
  onRakeback,
  onSafe,
  onStats,
  mode = "me",
  nested = false,
  topInset = 0
}) {
  const [mounted, setMounted] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [settingsPage, setSettingsPage] = React.useState('list');
  const [preferences, setPreferences] = React.useState({
    currency: window.PX_CUR || 'USD',
    timezone: localStorage.getItem('pd-timezone') || 'UTC-8',
    language: window.PXI18N?.lang === 'ru' ? 'Русский' : 'English'
  });
  const openPreference = page => {
    setSettingsPage(page);
    setSettingsOpen(true);
  };
  const [securityOpen, setSecurityOpen] = React.useState(false);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [handsOpen, setHandsOpen] = React.useState(false); // 7.5 — last 100 hands
  const [respoOpen, setRespoOpen] = React.useState(false); // 7.4 — same screen the wallet opens
  const [logoutAsk, setLogoutAsk] = React.useState(false);
  const [avatarPickerOpen, setAvatarPickerOpen] = React.useState(false);
  const [avatar, setAvatar] = React.useState(() => {
    try {
      return localStorage.getItem("pd-avatar") || "assets/avatar.png";
    } catch (e) {
      return "assets/avatar.png";
    }
  });
  const [sounds, setSounds] = React.useState(true);
  React.useEffect(() => {
    if (!open) {
      setSettingsOpen(false);
      setSecurityOpen(false);
      setHelpOpen(false);
      setHandsOpen(false);
      setRespoOpen(false);
      setLogoutAsk(false);
      setAvatarPickerOpen(false);
      return;
    }
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, 0.04);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-profile-screen",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: helpOpen || handsOpen || respoOpen || avatarPickerOpen ? 50 : 36,
      background: "#000",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ps-profile-ambient",
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 280,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}24 0%, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: nested ? topInset + 14 : 62,
      paddingLeft: 14,
      paddingRight: 16,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose && onClose();
    },
    "aria-label": "Back",
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "#14171c",
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
      fontFamily: MONO_P,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, mode === "settings" ? "SETTINGS" : "ME"), mode === 'settings' ? /*#__PURE__*/React.createElement("button", {
    className: "ps-language",
    "data-i18n": "off",
    "aria-label": "\u0412\u044B\u0431\u0440\u0430\u0442\u044C \u044F\u0437\u044B\u043A",
    onClick: () => openPreference('language')
  }, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": "true",
    viewBox: "0 0 36 26",
    preserveAspectRatio: "xMidYMid slice"
  }, window.PXI18N?.lang === 'ru' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    fill: "#f3f5f8",
    d: "M0 0h36v9H0z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#2052a3",
    d: "M0 9h36v8H0z"
  }), /*#__PURE__*/React.createElement("path", {
    fill: "#d4313d",
    d: "M0 17h36v9H0z"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    fill: "#203762",
    d: "M0 0h36v26H0z"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "#f5f6fa",
    strokeWidth: "6",
    d: "m0 0 36 26M36 0 0 26"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "#ce3042",
    strokeWidth: "2",
    d: "m0 0 36 26M36 0 0 26"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "#f5f6fa",
    strokeWidth: "9",
    d: "M18 0v26M0 13h36"
  }), /*#__PURE__*/React.createElement("path", {
    stroke: "#ce3042",
    strokeWidth: "5",
    d: "M18 0v26M0 13h36"
  })))) : /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      paddingBottom: 110,
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(ProfileHome, {
    preferences: preferences,
    onPreference: openPreference,
    mode: mode,
    onStats: () => {
      click(1100);
      onStats && onStats();
    },
    accent: accent,
    avatar: avatar,
    onSafe: onSafe,
    onEditAvatar: () => {
      click(1200);
      setAvatarPickerOpen(true);
    },
    onSettings: () => {
      click();
      openPreference("list");
    },
    onSecurity: () => {
      click();
      setSecurityOpen(true);
    },
    onHelp: () => {
      click();
      setHelpOpen(true);
    },
    onHands: () => {
      click();
      setHandsOpen(true);
    },
    onRespo: () => {
      click();
      setRespoOpen(true);
    },
    onLogout: () => {
      click(800);
      setLogoutAsk(true);
    },
    onRakeback: () => {
      click(1100);
      onRakeback && onRakeback();
    }
  })), window.SettingsScreen && /*#__PURE__*/React.createElement(window.SettingsScreen, {
    initialSection: settingsPage,
    onPreferenceChange: patch => setPreferences(p => ({
      ...p,
      ...patch
    })),
    open: settingsOpen,
    onClose: () => setSettingsOpen(false),
    accent: accent
  }), window.HelpSupportSheet && /*#__PURE__*/React.createElement(window.HelpSupportSheet, {
    open: helpOpen,
    onClose: () => setHelpOpen(false),
    accent: accent
  }), window.SecurityScreen && /*#__PURE__*/React.createElement(window.SecurityScreen, {
    open: securityOpen,
    onClose: () => setSecurityOpen(false),
    accent: accent
  }), window.HandHistoryScreen && /*#__PURE__*/React.createElement(window.HandHistoryScreen, {
    open: handsOpen,
    onClose: () => setHandsOpen(false),
    accent: accent
  }), window.ResponsibleGaming && /*#__PURE__*/React.createElement(window.ResponsibleGaming, {
    open: respoOpen,
    onClose: () => setRespoOpen(false),
    accent: accent
  }), logoutAsk && /*#__PURE__*/React.createElement("div", {
    onClick: () => setLogoutAsk(false),
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 90,
      background: "rgba(0,0,0,.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0 22px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 300,
      borderRadius: 20,
      padding: "20px 18px 18px",
      textAlign: "center",
      background: "linear-gradient(150deg,#1a1216 0%,#0c0c0f 62%,#0a0a0c 100%)",
      border: `1px solid ${accent}59`,
      boxShadow: "0 26px 60px rgba(0,0,0,.7)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_P,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".2em",
      color: accent
    }
  }, "LOG OUT?"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: SANS_P,
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.55,
      color: "#D8D8DF",
      textWrap: "pretty"
    }
  }, "You will be signed out on this device. Open tables keep playing until they time out."), /*#__PURE__*/React.createElement("button", {
    className: "profile-logout-flat",
    onClick: () => {
      click(800);
      setLogoutAsk(false);
    },
    style: {
      width: "100%",
      marginTop: 16,
      height: 46,
      borderRadius: 12,
      cursor: "pointer",
      border: 0,
      background: accent,
      color: "#fff",
      fontFamily: MONO_P,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".1em"
    }
  }, "LOG OUT"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      setLogoutAsk(false);
    },
    style: {
      width: "100%",
      marginTop: 9,
      height: 44,
      borderRadius: 12,
      cursor: "pointer",
      background: "rgba(255,255,255,.06)",
      border: "1px solid rgba(255,255,255,.16)",
      color: "#D8D8DF",
      fontFamily: MONO_P,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".1em"
    }
  }, "STAY SIGNED IN"))), /*#__PURE__*/React.createElement(AvatarPickerSheet, {
    open: avatarPickerOpen,
    current: avatar,
    accent: accent,
    onClose: () => setAvatarPickerOpen(false),
    onSelect: src => setAvatar(src)
  }));
}
function ProfileHome({
  preferences,
  onPreference,
  mode = "me",
  accent,
  avatar = "assets/avatar.png",
  onEditAvatar,
  onSettings,
  onSecurity,
  onHelp,
  onHands,
  onRespo,
  onLogout,
  onRakeback,
  onSafe,
  onStats
}) {
  const isSet = mode === "settings";
  if (isSet) return /*#__PURE__*/React.createElement("div", {
    className: "ps-home",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement(window.PxProfileHero, {
    avatar: avatar,
    onEdit: onEditAvatar,
    onRakeback: onRakeback
  }), /*#__PURE__*/React.createElement("div", {
    className: "ps-section-label"
  }, "\u0418\u0413\u0420\u0410 \u0418 \u0410\u041A\u041A\u0410\u0423\u041D\u0422"), /*#__PURE__*/React.createElement("div", {
    className: "ps-menu"
  }, [{
    icon: 'sliders',
    title: 'Настройки игры',
    sub: 'Звук, ставки и оформление',
    action: onSettings
  }, {
    icon: 'shield',
    title: 'Безопасность',
    sub: 'Пароль, вход и защита аккаунта',
    action: onSecurity
  }, {
    icon: 'pause',
    title: 'Ответственная игра',
    sub: 'Ваш темп и контроль времени',
    action: onRespo
  }].map(item => /*#__PURE__*/React.createElement("button", {
    className: "ps-row",
    key: item.title,
    onClick: item.action
  }, /*#__PURE__*/React.createElement("span", {
    className: "ps-icon"
  }, /*#__PURE__*/React.createElement(PIcon, {
    kind: item.icon,
    color: "currentColor",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "ps-row-copy"
  }, /*#__PURE__*/React.createElement("strong", null, item.title), /*#__PURE__*/React.createElement("small", null, item.sub)), /*#__PURE__*/React.createElement("svg", {
    className: "ps-chevron",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 5 7 7-7 7"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "ps-section-label"
  }, "\u041F\u0420\u0415\u0414\u041F\u041E\u0427\u0422\u0415\u041D\u0418\u042F"), /*#__PURE__*/React.createElement("div", {
    className: "ps-menu ps-preferences"
  }, [{
    id: 'currency',
    title: 'Валюта',
    value: preferences.currency.toUpperCase(),
    icon: 'cash'
  }, {
    id: 'timezone',
    title: 'Часовой пояс',
    value: preferences.timezone,
    icon: 'clock'
  }].map(item => /*#__PURE__*/React.createElement("button", {
    className: "ps-row",
    key: item.id,
    onClick: () => onPreference(item.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ps-icon"
  }, /*#__PURE__*/React.createElement(PIcon, {
    kind: item.icon,
    color: "currentColor",
    size: 22
  })), /*#__PURE__*/React.createElement("span", {
    className: "ps-row-copy"
  }, /*#__PURE__*/React.createElement("strong", null, item.title)), /*#__PURE__*/React.createElement("span", {
    className: "ps-pref-value"
  }, item.value), /*#__PURE__*/React.createElement("svg", {
    className: "ps-chevron",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 5 7 7-7 7"
  }))))), /*#__PURE__*/React.createElement("button", {
    className: "ps-support",
    onClick: onHelp
  }, /*#__PURE__*/React.createElement("span", {
    className: "ps-support-icon"
  }, /*#__PURE__*/React.createElement(PIcon, {
    kind: "help",
    size: 25,
    color: "currentColor"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ps-row-copy"
  }, /*#__PURE__*/React.createElement("strong", null, "\u041F\u043E\u043C\u043E\u0449\u044C \u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430"), /*#__PURE__*/React.createElement("small", null, /*#__PURE__*/React.createElement("i", null), "\u041D\u0430 \u0441\u0432\u044F\u0437\u0438 \u043A\u0440\u0443\u0433\u043B\u043E\u0441\u0443\u0442\u043E\u0447\u043D\u043E")), /*#__PURE__*/React.createElement("svg", {
    className: "ps-chevron",
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 5 7 7-7 7"
  }))), /*#__PURE__*/React.createElement("button", {
    className: "ps-logout",
    onClick: onLogout
  }, /*#__PURE__*/React.createElement(PIcon, {
    kind: "logout",
    size: 18,
    color: "currentColor"
  }), "\u0412\u044B\u0439\u0442\u0438 \u0438\u0437 \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u0430"), /*#__PURE__*/React.createElement("div", {
    className: "ps-version"
  }, "PokerDot \xB7 1.0.0"));
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, 0.04);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, isSet && window.PxProfileHero && /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "6px 16px 0",
      padding: "18px 14px",
      borderRadius: UI.r.lg,
      background: "linear-gradient(130deg,#202128,#131419)",
      border: "1px solid rgba(255,255,255,.14)"
    }
  }, /*#__PURE__*/React.createElement(window.PxProfileHero, {
    avatar: avatar,
    onRakeback: onRakeback,
    onEdit: () => {
      click(1200);
      onEditAvatar && onEditAvatar();
    },
    style: {
      padding: 0,
      gap: 12
    }
  })), !isSet && (() => {
    const P = window.cmPlayer || {
      level: 14,
      xp: 3500,
      xpNext: 5000
    };
    const lv = P.level || 14;
    const lg = window.cmLeague && window.cmLeague.forLevel(lv) || {
      name: "BRONZE",
      color: "#C07A3E",
      min: 11,
      max: 20
    };
    const c = lg.color || "#C07A3E";
    const nextLg = (window.cmLeague && window.cmLeague.LEAGUES || []).find(l => l.min > lv) || null;
    const pct = Math.max(0, Math.min(1, (P.xp || 0) / (P.xpNext || 1)));
    const grp = n => Math.round(n).toLocaleString("en-US").split(",").join("\u00A0");
    const R = 26,
      CIRC = 2 * Math.PI * R;
    const toCashback = () => {
      click(1100);
      onRakeback && onRakeback();
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        overflow: "hidden",
        margin: "6px 16px 0",
        padding: "16px 16px 14px",
        borderRadius: 20,
        background: `linear-gradient(152deg, ${c}2b 0%, #100d0c 44%, #0a0a0c 100%)`,
        border: `1px solid ${c}4d`,
        boxShadow: "0 16px 38px rgba(0,0,0,.55)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(ellipse 62% 90% at 88% 0%, ${c}30, transparent 62%)`
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,.06) .8px, transparent 1.2px)",
        backgroundSize: "13px 13px",
        maskImage: "linear-gradient(152deg, black, transparent 70%)",
        WebkitMaskImage: "linear-gradient(152deg, black, transparent 70%)"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      role: "button",
      tabIndex: 0,
      "aria-label": "Change photo",
      onClick: () => {
        if (window.playClick) window.playClick(1200, .04);
        onEditAvatar && onEditAvatar();
      },
      style: {
        position: "relative",
        flex: "none",
        cursor: "pointer"
      }
    }, window.LeagueFrame ? /*#__PURE__*/React.createElement(window.LeagueFrame, {
      level: lv,
      size: 72,
      ring: 3.5
    }, /*#__PURE__*/React.createElement("img", {
      src: avatar,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center 30%"
      }
    })) : /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        width: 72,
        height: 72
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: `conic-gradient(from 0deg, ${c}, #fff, ${c})`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 3,
        borderRadius: "50%",
        overflow: "hidden",
        background: "#000"
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: avatar,
      alt: "",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "center 30%"
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 9,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_P,
        fontSize: 20,
        color: "#fff",
        letterSpacing: ".06em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, "SASHA02"), /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.playClick) window.playClick(1150, .035);
        onEditAvatar && onEditAvatar();
      },
      "aria-label": "Change photo",
      title: "Change photo",
      style: {
        flex: "none",
        width: 22,
        height: 22,
        padding: 0,
        borderRadius: 125,
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,.06)",
        border: "1px solid rgba(255,255,255,.16)"
      }
    }, /*#__PURE__*/React.createElement(PIcon, {
      kind: "camera",
      color: "rgba(255,255,255,.6)",
      size: 10
    }))), /*#__PURE__*/React.createElement("button", {
      onClick: toCashback,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        marginTop: 7,
        padding: "4px 10px",
        borderRadius: 125,
        cursor: "pointer",
        backgroundColor: `${c}2e`,
        border: `1px solid ${c}66`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: c,
        boxShadow: `0 0 7px ${c}`
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_P,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".14em",
        color: c
      }
    }, lg.name, /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off"
    }, " · " + (window.cmLeague && window.cmLeague.rankForLevel ? window.cmLeague.rankForLevel(lv) : lv) + (lg.suit || "")))))), /*#__PURE__*/React.createElement("button", {
      onClick: toCashback,
      style: {
        position: "relative",
        width: "100%",
        marginTop: 14,
        display: "block",
        padding: "11px 12px",
        borderRadius: 14,
        cursor: "pointer",
        textAlign: "left",
        background: "rgba(0,0,0,.38)",
        border: "1px solid rgba(255,255,255,.12)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_P,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".18em",
        color: "#A9A9B2"
      }
    }, "LEVEL " + lv), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_P,
        fontWeight: 700,
        fontSize: 12,
        color: "#fff",
        fontVariantNumeric: "tabular-nums"
      }
    }, grp(P.xp), " / ", grp(P.xpNext)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_P,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".14em",
        color: "#8A8A93"
      }
    }, "XP")), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        position: "relative",
        height: 6,
        borderRadius: 3,
        marginTop: 9,
        background: "rgba(255,255,255,.1)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: (pct * 100).toFixed(1) + "%",
        borderRadius: 3,
        background: `linear-gradient(90deg, ${c}, ${c}dd)`,
        boxShadow: `0 0 10px ${c}88`
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginTop: 9
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontFamily: SANS_P,
        fontWeight: 600,
        fontSize: 12,
        color: "#A9A9B2",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, nextLg ? "LEVEL " + (lv + 1) + " NEXT \u00b7 " + nextLg.name + " AT " + nextLg.min : "TOP LEAGUE REACHED"), /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "rgba(255,255,255,.35)",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        flex: "none"
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 6l6 6-6 6"
    })))));
  })(), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      margin: "20px 16px 0",
      borderRadius: 16,
      overflow: "hidden",
      background: `linear-gradient(150deg, ${accent}17 0%, #0c0c0f 56%, #0a0a0c 100%)`,
      border: `1px solid ${accent}30`,
      boxShadow: "0 12px 30px rgba(0,0,0,.46)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.05) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 70%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 70%)"
    }
  }), (isSet ? SETTINGS_MENU : ME_MENU).map((m, i) => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.04);
      if (m.id === "settings") onSettings();else if (m.id === "help") onHelp && onHelp();else if (m.id === "hands") onHands && onHands();else if (m.id === "respo") onRespo && onRespo();else if (m.id === "stats") onStats && onStats();
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 13,
      width: "100%",
      padding: "14px 14px",
      cursor: "pointer",
      background: "transparent",
      border: 0,
      borderTop: i === 0 ? "0" : "1px solid rgba(255,255,255,.085)",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      flex: "none",
      background: "rgba(0,0,0,.34)",
      border: "1px solid rgba(255,255,255,.14)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    kind: m.icon,
    color: "rgba(255,255,255,.85)",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_P,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, m.label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_P,
      fontWeight: 600,
      fontSize: 12,
      color: "#A9A9B2",
      letterSpacing: ".03em",
      marginTop: 3
    }
  }, m.sub)), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.35)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))))), isSet && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.04);
      onSecurity && onSecurity();
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 13,
      width: "calc(100% - 32px)",
      margin: "12px 16px 0",
      padding: "15px 14px",
      borderRadius: 16,
      cursor: "pointer",
      textAlign: "left",
      background: "linear-gradient(150deg,#141419 0%,#0c0c0f 62%,#0a0a0c 100%)",
      border: "1px solid rgba(255,255,255,.12)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      flex: "none",
      background: "rgba(0,0,0,.34)",
      border: "1px solid rgba(255,255,255,.14)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(PIcon, {
    kind: "lock",
    color: "rgba(255,255,255,.85)",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_P,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "SECURITY"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_P,
      fontWeight: 600,
      fontSize: 12,
      color: "#A9A9B2",
      letterSpacing: ".03em",
      marginTop: 3
    }
  }, "Password \xB7 2FA \xB7 sessions")), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.35)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), isSet && /*#__PURE__*/React.createElement("button", {
    className: "profile-logout-flat",
    onClick: () => {
      if (window.playClick) window.playClick(800, 0.04);
      onLogout && onLogout();
    },
    style: {
      width: "calc(100% - 32px)",
      margin: "12px 16px 0",
      height: 52,
      borderRadius: 16,
      cursor: "pointer",
      background: `${accent}1a`,
      border: `1px solid ${accent}59`,
      color: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      fontFamily: MONO_P,
      fontWeight: 700,
      fontSize: 13,
      letterSpacing: ".1em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 17l5-5-5-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 12H9"
  })), "LOG OUT"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 18,
      fontFamily: SANS_P,
      fontWeight: 600,
      fontSize: 12,
      color: "#A9A9B2",
      letterSpacing: ".16em"
    }
  }, "POKERDOT \xB7 v1.0.0"));
}
function ProfileSettings({
  accent,
  sounds,
  setSounds
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 14px",
      borderRadius: 12,
      background: "#111419",
      border: "1px solid rgba(255,255,255,.14)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_P,
      fontSize: 14,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "SOUNDS"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      setSounds(s => !s);
    },
    style: {
      width: 50,
      height: 28,
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      padding: 3,
      background: sounds ? accent : "rgba(255,255,255,.16)",
      display: "flex",
      justifyContent: sounds ? "flex-end" : "flex-start",
      transition: "background 180ms"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 2px 5px rgba(0,0,0,.4)",
      transition: "all 180ms"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      borderRadius: 14,
      overflow: "hidden",
      background: "linear-gradient(150deg,#141419 0%,#0c0c0f 62%,#0a0a0c 100%)",
      border: "1px solid rgba(255,255,255,.07)"
    }
  }, SETTINGS_ITEMS.filter(s => s.id !== "sounds").map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.03);
    },
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      padding: "14px 14px",
      cursor: "pointer",
      background: "transparent",
      border: 0,
      borderTop: i === 0 ? "0" : "1px solid rgba(255,255,255,.085)",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_P,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, s.label), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_P,
      fontWeight: 700,
      fontSize: 12,
      color: "#A9A9B2",
      letterSpacing: ".08em"
    }
  }, s.value), /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.35)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))))));
}
if (!document.getElementById("profile-flat-actions")) {
  const st = document.createElement("style");
  st.id = "profile-flat-actions";
  st.textContent = "#device-host button.profile-logout-flat{background-image:none!important;box-shadow:none!important}";
  document.head.appendChild(st);
}
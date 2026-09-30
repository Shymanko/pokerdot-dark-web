// Notifications (Inbox) — slide-in panel from the lobby bell. On-brand dark.
const MONO_N = UI.font;
const SANS_N = UI.fontUI;

// imp:true → IMPORTANT tab (money, security, time-sensitive registrations,
// personal offers). imp:false → OTHER tab (broadcast promos, product news).
// kind "article" opens a full-screen reader (banner + text + images + CTAs).
const NOTIFS_SEED = [{
  id: 9,
  kind: "prize",
  imp: true,
  title: "LEADERBOARD PRIZE IS YOURS",
  body: "You finished #12 in the GRAND LEADERBOARD — tap to claim $4 250.00.",
  time: "NOW",
  unread: true,
  prize: {
    kind: "board",
    big: "#12",
    sub: "GRAND LEADERBOARD · MID",
    prize: "$4 250.00",
    prizeLabel: "PRIZE WON",
    stats: [["FIELD", "35 240"], ["POINTS", "18 450"], ["SEASON", "01"]]
  }
}, {
  id: 8,
  kind: "article",
  imp: true,
  title: "HOT POKER SUMMER 2026",
  body: "Don't miss the Hot Poker Summer 2026 tournaments — tap to read.",
  time: "NOW",
  unread: true,
  article: true
}, {
  id: 1,
  kind: "bonus",
  imp: true,
  title: "100% WELCOME BONUS",
  body: "Your first deposit is matched up to $1 000. Tap to claim.",
  time: "JUST NOW",
  unread: true
}, {
  id: 2,
  kind: "event",
  imp: true,
  title: "DAILY DEEP STARTS SOON",
  body: "$50 000 GTD · registration closes in 2h 47m.",
  time: "12 MIN",
  unread: true
}, {
  id: 3,
  kind: "cashier",
  imp: true,
  title: "DEPOSIT CONFIRMED",
  body: "$100.00 added to your balance via card.",
  time: "2H",
  unread: false
}, {
  id: 4,
  kind: "system",
  imp: true,
  title: "NEW DEVICE LOGIN",
  body: "A login from a new device was detected and approved.",
  time: "3D",
  unread: false
}, {
  id: 5,
  kind: "promo",
  imp: false,
  title: "WEEKEND CASHBACK ×2",
  body: "Earn double cashback all weekend on cash tables.",
  time: "1D",
  unread: true
}, {
  id: 6,
  kind: "promo",
  imp: false,
  title: "NEW: FLASH & FLUSH",
  body: "Fast-fold cash is live. Fold and jump to a fresh table instantly.",
  time: "2D",
  unread: false
}, {
  id: 7,
  kind: "system",
  imp: false,
  title: "APP UPDATE 2.4",
  body: "Smoother tables and a redesigned rewards path. See what's new.",
  time: "4D",
  unread: false
}];

// Правка 13 · лист про перенесення акаунта з ClubGG. Живе у «ВАЖНОМ», гравець
// може повернутись і перечитати. Додається лише сегменту мігрантів.
const NOTIF_MIGRANT = {
  id: 10,
  kind: "system",
  imp: true,
  unread: true,
  time: "NOW",
  title: "CLUBGG MOVE COMPLETE",
  body: "Full message: what happened to your account — balance and progress have been moved and saved.",
  info: {
    kicker: "ACCOUNT",
    title: "CLUBGG MOVE COMPLETE",
    accent: "#D71921",
    noLink: true,
    body: ["Your ClubGG account has been moved to PokerDot. Balance, tickets, loyalty level and hand history came across in full — nothing was lost.", "You sign in with the same credentials. Everything you had is already on the account: open the wallet to check the balance, or the rewards tab to see your level.", "If something looks wrong, write to support from the inbox — we will sort it out."]
  }
};

// Shared notification store so the header bell can reflect unread state live.
// summary(): { imp, oth } unread counts. Bell precedence: important (red) wins.
window.cmNotifStore = window.cmNotifStore || function () {
  let items = NOTIFS_SEED.map(n => ({
    ...n
  }));
  const subs = new Set();
  return {
    get: () => items,
    set: next => {
      items = next;
      subs.forEach(f => f());
    },
    summary: () => ({
      imp: items.filter(i => i.imp && i.unread).length,
      oth: items.filter(i => !i.imp && i.unread).length
    }),
    subscribe: f => {
      subs.add(f);
      return () => subs.delete(f);
    },
    // додати лист один раз (сегментні повідомлення)
    ensure: item => {
      if (items.some(i => i.id === item.id)) return;
      items = [{
        ...item
      }].concat(items);
      subs.forEach(f => f());
    }
  };
}();
window.NOTIF_MIGRANT = NOTIF_MIGRANT;
function NIcon({
  kind,
  accent
}) {
  const c = "#fff";
  const P = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: c,
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (kind) {
    case "bonus":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "8",
        width: "18",
        height: "13",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 12h18M12 8v13M12 8S10 3 7.5 4.2 9.5 8 12 8zM12 8s2-5 4.5-3.8S14.5 8 12 8z"
      }));
    case "event":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M12 2v6M12 22v-6M2 12h6M22 12h-6"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3.4"
      }));
    case "cashier":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "6",
        width: "18",
        height: "13",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 10h18M7 15h2"
      }));
    case "promo":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M20 12v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "2.5",
        y: "7",
        width: "19",
        height: "5",
        rx: "1"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 7v14M12 7S10 3 7.5 4 9.5 7 12 7zM12 7s2-4 4.5-3S14.5 7 12 7z"
      }));
    case "prize":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M8 21h8M12 17v4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 4h12v4a6 6 0 0 1-12 0z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 5H3.5v2A3.5 3.5 0 0 0 7 10.5M18 5h2.5v2A3.5 3.5 0 0 1 17 10.5"
      }));
    case "article":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M4 5h13a2 2 0 0 1 2 2v12a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 9h7M8 13h7M8 17h4"
      }));
    default:
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "9"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 8v5M12 16h.01"
      }));
  }
}
const NTONE = {
  bonus: "#f0c75e",
  event: "#D71921",
  cashier: "#5BD96A",
  promo: "#6FA8FF",
  system: "#8C93A3",
  article: "#D71921",
  prize: "#f0c75e",
  security: "#8C93A3"
};

// ── Article reader — full-screen, scrolls: banner → text → image+CTA → text → image+CTA
function ArticleReader({
  open,
  onClose,
  accent
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const click = f => {
    if (window.playClick) window.playClick(f, 0.04);
  };
  const H = {
    fontFamily: MONO_N,
    fontWeight: 700,
    color: "#fff",
    letterSpacing: ".04em",
    margin: 0
  };
  const P = {
    fontFamily: SANS_N,
    fontWeight: 500,
    fontSize: 13,
    lineHeight: 1.65,
    color: "#D8D8DF",
    margin: 0,
    textWrap: "pretty"
  };
  const slotWrap = {
    position: "relative",
    width: "100%",
    height: 176,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(255,255,255,.1)"
  };
  const cta = label => /*#__PURE__*/React.createElement("button", {
    onClick: () => click(1300),
    style: {
      alignSelf: "flex-start",
      marginTop: 2,
      padding: "12px 22px",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: accent,
      color: "#fff",
      fontFamily: MONO_N,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".1em",
      boxShadow: `0 8px 20px ${accent}55`
    }
  }, label, " \u203A");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 72,
      background: "#0a0a0c",
      transform: mounted ? "translateX(0)" : "translateX(100%)",
      transition: "transform .34s cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 3,
      display: "flex",
      justifyContent: "flex-end",
      padding: "48px 14px 10px",
      background: "linear-gradient(180deg, rgba(10,10,12,.92), transparent)",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      pointerEvents: "auto",
      width: 34,
      height: 34,
      borderRadius: 12,
      background: "rgba(0,0,0,.5)",
      border: "1px solid rgba(255,255,255,.18)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: 250,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "art-hps-hero",
    shape: "rect",
    fit: "cover",
    placeholder: "Drop banner image"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      padding: "56px 18px 16px",
      background: "linear-gradient(180deg, transparent, rgba(10,10,12,.96))",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_N,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".24em",
      color: accent
    }
  }, "SUMMER SERIES"), /*#__PURE__*/React.createElement("h1", {
    style: {
      ...H,
      fontSize: 24,
      marginTop: 7
    }
  }, "HOT POKER SUMMER 2026"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 20,
      padding: "22px 18px 40px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: P
  }, "The biggest summer festival yet lands in June \u2014 six weeks of daily tournaments, record guarantees, and a $2\xA0000\xA0000 Main Event. Whether you grind micro-stakes or chase the high-roller trophy, there's a seat with your name on it."), /*#__PURE__*/React.createElement("div", {
    style: slotWrap
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "art-hps-1",
    shape: "rect",
    fit: "cover",
    placeholder: "Drop image"
  })), cta("VIEW FULL SCHEDULE"), /*#__PURE__*/React.createElement("p", {
    style: P
  }, "Satellites are already running: turn a few dollars into a Main Event seat, or spin your way in from the Fortune Wheel. Every event awards series points \u2014 climb the leaderboard for exclusive bonuses and a shot at the Champion of Summer title."), /*#__PURE__*/React.createElement("div", {
    style: slotWrap
  }, /*#__PURE__*/React.createElement("image-slot", {
    id: "art-hps-2",
    shape: "rect",
    fit: "cover",
    placeholder: "Drop image"
  })), cta("REGISTER NOW"))));
}
function NotificationsScreen({
  open,
  onClose,
  accent = "#D71921",
  focusId = null
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
  const [items, setItemsRaw] = React.useState(() => window.cmNotifStore ? window.cmNotifStore.get() : NOTIFS_SEED);
  const setItems = updater => setItemsRaw(xs => {
    const next = typeof updater === "function" ? updater(xs) : updater;
    if (window.cmNotifStore) window.cmNotifStore.set(next);
    return next;
  });
  const [tab, setTab] = React.useState("important");
  const [articleOpen, setArticleOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);

  // список міг поповнитись зовні (сегментні листи) — читаємо стор на відкритті
  React.useEffect(() => {
    if (!window.cmNotifStore) return;
    if (open) setItemsRaw(window.cmNotifStore.get());
    return window.cmNotifStore.subscribe(() => setItemsRaw(window.cmNotifStore.get()));
  }, [open]);

  // прийшли з пуша: відкриваємо саме той лист, якому пуш адресований —
  // вкладка «ВАЖНОЕ», рядок підсвічений, повний текст одразу на екрані
  React.useEffect(() => {
    if (!open || focusId == null) return;
    const it = (window.cmNotifStore ? window.cmNotifStore.get() : items).find(i => i.id === focusId);
    if (!it) return;
    setTab(it.imp ? "important" : "other");
    const t = setTimeout(() => {
      setItems(xs => xs.map(i => i.id === focusId ? {
        ...i,
        unread: false
      } : i));
      if (it.article) setArticleOpen(true);
      if (it.info && window.showScreenInfo) window.showScreenInfo(it.info);
      if (it.prize && window.showAchievement) window.showAchievement(it.prize);
    }, 420);
    return () => clearTimeout(t);
  }, [open, focusId]);
  if (!open) return null;
  const unread = items.filter(i => i.unread).length;
  const impUnread = items.filter(i => i.imp && i.unread).length;
  const othUnread = items.filter(i => !i.imp && i.unread).length;
  const shown = items.filter(i => tab === "important" ? i.imp : !i.imp);
  const readAll = () => {
    if (window.playClick) window.playClick(1100, 0.04);
    setItems(xs => xs.map(i => ({
      ...i,
      unread: false
    })));
  };
  const pickTab = t => {
    if (window.playClick) window.playClick(1100, 0.04);
    setTab(t);
  };
  const tap = id => {
    if (window.playClick) window.playClick(1050, 0.03);
    setItems(xs => xs.map(i => i.id === id ? {
      ...i,
      unread: false
    } : i));
    const it = items.find(i => i.id === id);
    if (it && it.article) setArticleOpen(true);
    // повний текст листа — у канонічному вікні пояснення
    if (it && it.info && window.showScreenInfo) window.showScreenInfo(it.info);
    // a leaderboard payout opens the same congratulation screen a win does,
    // with SAVE / SHARE on the card
    if (it && it.prize && window.showAchievement) window.showAchievement(it.prize);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 115,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,.5)",
      opacity: mounted ? 1 : 0,
      transition: "opacity .25s"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      width: "88%",
      maxWidth: 360,
      background: "#0a0a0c",
      borderLeft: "1px solid rgba(255,255,255,.1)",
      boxShadow: "-12px 0 40px rgba(0,0,0,.6)",
      transform: mounted ? "translateX(0)" : "translateX(100%)",
      transition: "transform .34s cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 160,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 100% 70% at 80% 0%, ${accent}1f, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      paddingTop: 62,
      paddingLeft: 16,
      paddingRight: 16,
      paddingBottom: 12,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_N,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".12em"
    }
  }, "INBOX"), unread > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 18,
      height: 18,
      padding: "0 5px",
      borderRadius: 8,
      background: accent,
      color: "#fff",
      fontFamily: SANS_N,
      fontWeight: 700,
      fontSize: 10.5,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 0 8px ${accent}88`
    }
  }, unread)), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 34,
      height: 34,
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
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      padding: "0 16px 10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 5,
      padding: 4,
      borderRadius: 125,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, [["important", "IMPORTANT", impUnread], ["other", "OTHER", othUnread]].map(([id, label, n]) => {
    const on = tab === id;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => pickTab(id),
      style: {
        flex: 1,
        position: "relative",
        padding: "10px 0",
        borderRadius: 125,
        border: 0,
        cursor: "pointer",
        background: on ? accent : "transparent",
        color: on ? "#fff" : "rgba(255,255,255,.55)",
        fontFamily: MONO_N,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".14em",
        boxShadow: on ? `0 6px 16px ${accent}55` : "none",
        transition: "background .15s, color .15s",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7
      }
    }, label, n > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        minWidth: 15,
        height: 15,
        padding: "0 4px",
        borderRadius: 8,
        background: on ? "rgba(255,255,255,.24)" : accent,
        color: "#fff",
        fontFamily: SANS_N,
        fontWeight: 700,
        fontSize: 10.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, n));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      padding: "0 16px 10px",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1250, .04);
      try {
        window.open("https://t.me/PokerdotSupport", "_blank", "noopener");
      } catch (e) {}
    },
    style: {
      flex: 1,
      minWidth: 0,
      height: 40,
      boxSizing: "border-box",
      padding: "0 14px",
      borderRadius: 125,
      cursor: "pointer",
      background: `linear-gradient(150deg, ${accent}2e, ${accent}12 60%, rgba(255,255,255,.04))`,
      border: `1px solid ${accent}80`,
      boxShadow: `0 6px 18px ${accent}33`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 13a8 8 0 0 1 16 0"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2.6",
    y: "13",
    width: "4.2",
    height: "6.2",
    rx: "2.1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "17.2",
    y: "13",
    width: "4.2",
    height: "6.2",
    rx: "2.1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19.3 19.2v.6a2.6 2.6 0 0 1-2.6 2.6H13"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_N,
      fontWeight: 700,
      fontSize: 11.5,
      letterSpacing: ".12em",
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, "SUPPORT")), /*#__PURE__*/React.createElement("button", {
    onClick: readAll,
    disabled: unread === 0,
    style: {
      flex: "none",
      background: "transparent",
      border: 0,
      cursor: unread ? "pointer" : "default",
      fontFamily: SANS_N,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: unread ? accent : "rgba(255,255,255,.55)",
      whiteSpace: "nowrap"
    }
  }, "MARK ALL READ")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "0 12px 24px",
      position: "relative",
      zIndex: 2
    }
  }, shown.map(n => /*#__PURE__*/React.createElement("button", {
    key: n.id,
    onClick: () => tap(n.id),
    style: {
      display: "flex",
      alignItems: "flex-start",
      gap: 12,
      width: "100%",
      textAlign: "left",
      marginBottom: 10,
      padding: "14px 14px",
      minHeight: 80,
      boxSizing: "border-box",
      borderRadius: 16,
      cursor: "pointer",
      position: "relative",
      overflow: "hidden",
      background: n.unread ? `radial-gradient(120% 150% at 0% 0%, ${accent}1F 0%, rgba(255,255,255,.035) 46%, rgba(255,255,255,.02) 100%), radial-gradient(rgba(255,255,255,.05) .8px, transparent .8px) 0 0/9px 9px, #0B0B0C` : `radial-gradient(rgba(255,255,255,.035) .8px, transparent .8px) 0 0/9px 9px, #0A0A0B`,
      border: `1px solid ${n.id === focusId ? accent : n.unread ? accent + "3D" : "rgba(255,255,255,.075)"}`,
      boxShadow: n.id === focusId ? `0 0 0 1px ${accent}66, 0 12px 30px -14px ${accent}` : n.unread ? `0 0 0 1px ${accent}12, 0 10px 26px -18px ${accent}80` : "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      flex: "none",
      background: `linear-gradient(180deg, ${NTONE[n.kind] || "#fff"}26, ${NTONE[n.kind] || "#fff"}0F)`,
      border: `1px solid ${NTONE[n.kind] || "#fff"}3D`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(NIcon, {
    kind: n.kind,
    accent: accent
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_N,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".02em",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, n.title), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: SANS_N,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em"
    }
  }, n.time)), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_N,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".02em",
      marginTop: 4,
      lineHeight: 1.45,
      height: "2.9em",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical"
    }
  }, n.body)), n.unread && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: "50%",
      flex: "none",
      marginTop: 4,
      background: accent,
      boxShadow: `0 0 6px ${accent}`
    }
  }))), shown.length > 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 10,
      fontFamily: SANS_N,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".12em"
    }
  }, "NO OLDER MESSAGES") : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 40,
      fontFamily: SANS_N,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".12em"
    }
  }, tab === "important" ? "NOTHING IMPORTANT RIGHT NOW" : "NO OTHER MESSAGES"))), /*#__PURE__*/React.createElement(ArticleReader, {
    open: articleOpen,
    onClose: () => setArticleOpen(false),
    accent: accent
  }));
}
Object.assign(window, {
  NotificationsScreen
});
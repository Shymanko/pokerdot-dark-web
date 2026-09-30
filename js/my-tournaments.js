// My Tournaments — the player's registered & upcoming events.
// Opened from the "MY TOURNEYS ③" button in the Tournaments screen header.
// House style: black canvas, type-colour medallions (Tournament red / Satellite
// blue / Freeroll green), Space Mono + Roboto, dot-matrix progress.

const MONO_MT = UI.font;
const SANS_MT = UI.fontUI;
const MT_TYPES = {
  tournament: {
    c: "#D71921",
    icon: "trophy"
  },
  satellite: {
    c: "#6FA8FF",
    icon: "seat"
  },
  freeroll: {
    c: "#5BD96A",
    icon: "gift"
  }
};
const MT_STATES = {
  live: {
    label: "LIVE",
    dot: "#D71921",
    text: "#fff",
    pulse: true
  },
  soon: {
    label: "STARTING SOON",
    dot: "#f0c75e",
    text: "#f0c75e"
  },
  open: {
    label: "REG OPEN",
    dot: "rgba(255,255,255,.55)",
    text: "rgba(255,255,255,.7)"
  }
};
function MtIcon({
  kind,
  size = 16,
  color = "#fff"
}) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (kind === "trophy") return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
    d: "M7 4h10v4a5 5 0 0 1-10 0z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 14h4M9 20h6M12 14v6"
  }));
  if (kind === "seat") return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
    d: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 6v12",
    strokeDasharray: "2 2"
  }));
  if (kind === "gift") return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("polyline", {
    points: "20 12 20 22 4 22 4 12"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "7",
    width: "20",
    height: "5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "22",
    x2: "12",
    y2: "7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"
  }));
  return null;
}
function MtStatePill({
  s
}) {
  const S = MT_STATES[s];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "3px 9px",
      borderRadius: 125,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.13)",
      fontFamily: SANS_MT,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      color: S.text,
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: S.dot,
      boxShadow: S.pulse ? `0 0 6px ${S.dot}` : "none",
      animation: S.pulse ? "pp-pulse 1.4s ease-in-out infinite" : "none"
    }
  }), S.label);
}
function MtChip({
  label
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_MT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".1em",
      padding: "3px 7px",
      borderRadius: 5,
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.18)",
      whiteSpace: "nowrap"
    }
  }, label);
}
function MtRow({
  e,
  accent,
  onView
}) {
  if (window.MyTourneyRow) return /*#__PURE__*/React.createElement(window.MyTourneyRow, {
    m: e,
    accent: accent,
    onView: onView
  });
  const T = MT_TYPES[e.type],
    c = T.c;
  const live = e.state === "live";
  const LBL = {
    tournament: "TOURNAMENT",
    satellite: "SATELLITE",
    freeroll: "FREEROLL"
  };
  const fstr = (e.fmt || []).join(" ");
  const artKey = e.type === "satellite" ? "ticket" : e.type === "freeroll" ? "gift" : /MYSTERY/.test(fstr) ? "mystery" : /PKO/.test(fstr) ? "pko" : "trophy";
  const artSrc = (window.PD_TOURN_ICONS || {})[artKey];
  const chips = (e.fmt || []).filter(f => !/^(NLH|PLO|HOLD|SHORT|FLASH|TURBO|HYPER|FREEZEOUT|KO|PKO|MYSTERY|BOUNTY)/i.test(f)).slice(0, 2);
  const Chip = ({
    children,
    color,
    bg,
    bd
  }) => /*#__PURE__*/React.createElement("span", {
    style: {
      height: 19,
      display: "inline-flex",
      alignItems: "center",
      padding: "0 7px",
      borderRadius: 5,
      fontFamily: SANS_MT,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      color: color || "rgba(255,255,255,.62)",
      background: bg || "rgba(255,255,255,.085)",
      border: `1px solid ${bd || "rgba(255,255,255,.18)"}`,
      flex: "none",
      whiteSpace: "nowrap"
    }
  }, children);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 12,
      border: `1px solid ${live ? c + "66" : "rgba(255,255,255,.1)"}`,
      background: "linear-gradient(160deg, #1f1f27, #0a0a0c)",
      display: "flex",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      width: 3,
      background: c,
      opacity: .9
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 2% 0%, ${c}1f, transparent 42%)`,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      onView && onView(e);
    },
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 11px 7px 10px",
      background: "transparent",
      border: 0,
      textAlign: "left",
      cursor: "pointer",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 12,
      background: `${c}22`,
      border: `1px solid ${c}66`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flex: "none",
      overflow: "hidden"
    }
  }, artSrc ? /*#__PURE__*/React.createElement("img", {
    src: artSrc,
    alt: "",
    style: {
      width: 29,
      height: 29,
      objectFit: "contain",
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement(MtIcon, {
    kind: T.icon,
    size: 21,
    color: c
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, e.name), live && e.seat ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 5,
      fontFamily: SANS_MT,
      fontWeight: 700,
      fontSize: 10.5,
      color: c,
      letterSpacing: ".14em"
    }
  }, e.seat) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-end",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: String(e.prize).length > 11 ? 14 : 18,
      color: c,
      lineHeight: 1
    }
  }, e.prize), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_MT,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2"
    }
  }, e.prizeLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 3,
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: 11,
      color: e.buyIn === "FREE" ? "#5BD96A" : "rgba(255,255,255,.72)"
    }
  }, e.buyIn))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "0 11px 9px 10px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".05em",
      color: "#D8D8DF",
      whiteSpace: "nowrap"
    }
  }, "TODAY \xB7 ", e.time), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".04em",
      color: live ? "#fff" : e.state === "soon" ? "#f0c75e" : "rgba(255,255,255,.5)",
      whiteSpace: "nowrap"
    }
  }, live ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: c,
      boxShadow: `0 0 6px ${c}`,
      flex: "none",
      animation: "pp-pulse 1.4s ease-in-out infinite"
    }
  }) : null, live ? "LIVE · " + e.rel : e.rel), live ? /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1500, 0.05);
      onView?.(e);
    },
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      height: 27,
      padding: "0 16px",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: c,
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      color: "#fff",
      boxShadow: `0 6px 16px ${c}55`
    }
  }, "ENTER \u203A") : /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      height: 27,
      padding: "0 12px",
      borderRadius: 125,
      background: "rgba(91,217,106,.12)",
      border: "1px solid rgba(91,217,106,.45)",
      fontFamily: SANS_MT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#5BD96A",
      letterSpacing: ".1em",
      whiteSpace: "nowrap"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 6L9 17l-5-5"
  })), "REGISTERED")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: 5,
      padding: "6px 11px",
      borderTop: "1px solid rgba(255,255,255,.07)",
      background: "rgba(255,255,255,.02)",
      flexWrap: "nowrap",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    color: c,
    bg: `${c}1c`,
    bd: `${c}55`
  }, LBL[e.type]), /*#__PURE__*/React.createElement(Chip, null, "HOLD'EM"), chips.map(f => /*#__PURE__*/React.createElement(Chip, {
    key: f
  }, f)))));
}
function MyTournaments({
  open,
  onClose,
  accent = "#D71921",
  onOpenEvent
}) {
  const registeredEvents = window.useRegisteredEvents();
  const mine = registeredEvents.map(e => {
    const mins = Math.max(1, Math.ceil((e.start - Date.now()) / 60000));
    const live = e.start <= Date.now();
    return {
      ...e,
      event: e,
      type: (e.cats || []).includes('satellite') ? 'satellite' : e.buyIn === 'FREE' ? 'freeroll' : 'tournament',
      time: window.clock(e.start),
      rel: live ? 'PLAYING' : `IN ${mins}M`,
      prize: e.gtd,
      prizeLabel: 'GTD',
      state: live ? 'live' : mins <= 30 ? 'soon' : 'open'
    };
  });
  const [mounted, setMounted] = React.useState(false);
  const [ticketsOpen, setTicketsOpen] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    setTicketsOpen(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const liveCount = mine.filter(e => e.state === "live").length;
  const next = mine.find(e => e.state !== "live");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 50,
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
      height: 220,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}22, transparent 62%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 52,
      paddingLeft: 14,
      paddingRight: 16,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.04);
      onClose();
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
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      minWidth: 0,
      maxWidth: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "MY TOURNAMENTS"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "MY TOURNAMENTS"
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "4px 16px 110px",
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      borderRadius: 12,
      padding: "13px 14px",
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: 22,
      color: "#fff"
    }
  }, mine.length), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_MT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em",
      marginTop: 2
    }
  }, "REGISTERED")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      setTicketsOpen(true);
    },
    style: {
      flex: 1,
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 12,
      padding: "13px 14px",
      background: "rgba(255,255,255,.065)",
      border: `1px solid ${accent}55`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: 22,
      color: accent
    }
  }, "3"), /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.4)",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_MT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em",
      marginTop: 2,
      whiteSpace: "nowrap"
    }
  }, "UNUSED TICKETS")), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1.4,
      borderRadius: 12,
      padding: "13px 14px",
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_MT,
      fontWeight: 700,
      fontSize: 22,
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, next ? next.rel.replace("IN ", "") : "—"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_MT,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em",
      marginTop: 2
    }
  }, "NEXT STARTS"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      marginTop: 22,
      marginBottom: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 14,
      borderRadius: 2,
      background: accent,
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_MT,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".1em"
    }
  }, "REGISTERED")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, mine.map(e => /*#__PURE__*/React.createElement(MtRow, {
    key: e.name,
    e: e,
    accent: accent,
    onView: e => onOpenEvent?.(e.event)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      textAlign: "center",
      fontFamily: SANS_MT,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".1em",
      lineHeight: 1.6
    }
  }, "Registered tournaments appear here.", /*#__PURE__*/React.createElement("br", null), "Browse all events to register for more.")), window.TicketsScreen && /*#__PURE__*/React.createElement(window.TicketsScreen, {
    open: ticketsOpen,
    onClose: () => setTicketsOpen(false),
    accent: accent,
    onUseTicket: () => {
      setTicketsOpen(false);
      onOpenEvent && onOpenEvent();
    },
    onOpenEvent: e => {
      setTicketsOpen(false);
      onOpenEvent && onOpenEvent(e);
    }
  }));
}
Object.assign(window, {
  MyTournaments
});
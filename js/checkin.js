// checkin.jsx — 28-day Daily Check-In system (Cardomancer).
// Compact feed widget (current week, 7 circles) → opens a full 7×4 calendar.
// Milestone gifts at 7/14/21/28 escalate normal → bronze → silver → diamond
// (+20/30/40/50% size). Miss a day → streak FREEZES (never burns). Gift art is a
// placeholder (swap for DCSH/Higgsfield renders later). Open animation built in.

const CI_ARC = "#D71921";
const CI_OK = "#5BD96A";
const CI_MONO = UI.font;
const CI_SANS = UI.fontUI;

// ── present config — one and the same present on every 7th day ──────────────
const CI_MILES = {
  present: {
    tier: "normal",
    reward: "$25",
    items: [{
      t: "cash",
      q: "$25",
      sub: "Bonus cash"
    }]
  }
};

// ── countdown to next local midnight ────────────────────────────────────────
function msToMidnight() {
  const n = new Date();
  const m = new Date(n);
  m.setHours(24, 0, 0, 0);
  return m - n;
}
function CiCountdown({
  size = 12,
  color = "rgba(255,255,255,.55)"
}) {
  const [ms, setMs] = React.useState(msToMidnight());
  React.useEffect(() => {
    const i = setInterval(() => setMs(msToMidnight()), 1000);
    return () => clearInterval(i);
  }, []);
  const h = Math.floor(ms / 3600000),
    m = Math.floor(ms % 3600000 / 60000),
    s = Math.floor(ms % 60000 / 1000);
  const p = x => String(x).padStart(2, "0");
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CI_MONO,
      fontSize: size,
      color,
      letterSpacing: ".08em",
      fontVariantNumeric: "tabular-nums"
    }
  }, "NEXT CHECK-IN IN " + p(h) + ":" + p(m) + ":" + p(s));
}

// ── CTA: CHECK IN button, or (once checked in today) a countdown chip ────────
function CiCheckButton({
  checkedToday,
  frozen,
  accent = CI_ARC,
  onCheckIn,
  big = false
}) {
  if (checkedToday) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        width: "100%",
        padding: big ? "12px 0" : "11px 0",
        borderRadius: 125,
        background: "rgba(70,194,117,.08)",
        border: `1px solid ${CI_OK}44`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontFamily: CI_SANS,
        fontWeight: 700,
        fontSize: big ? 13 : 12,
        letterSpacing: ".1em",
        color: CI_OK
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: CI_OK,
      strokeWidth: "2.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 7"
    })), "CHECKED IN TODAY"), /*#__PURE__*/React.createElement(CiCountdown, {
      size: big ? 11.5 : 10.5
    }));
  }
  return /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      if (window.playClick) window.playClick(1000, 0.05);
      onCheckIn && onCheckIn();
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
      padding: big ? "16px 0" : "13px 0",
      borderRadius: 125,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 9,
      background: accent,
      color: "#fff",
      border: 0,
      fontFamily: CI_SANS,
      fontWeight: 700,
      fontSize: big ? 15 : 13.5,
      letterSpacing: ".12em",
      animation: "ci-ctapulse 2.2s ease-in-out infinite",
      transition: "transform 120ms ease"
    }
  }, frozen ? "CHECK IN TO RESUME" : "CHECK IN", /*#__PURE__*/React.createElement("svg", {
    width: big ? 16 : 15,
    height: big ? 16 : 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 7"
  })));
}

// shared day-state helper ----------------------------------------------------
// todayIdx = the day cell representing "today". If already checked in today it's
// the just-banked day (claimed count); otherwise it's the next claimable day.
function ciStateFor(n, claimed, checkedToday, frozen) {
  const todayIdx = checkedToday ? claimed : claimed + 1;
  if (n < todayIdx) return "claimed";
  if (n === todayIdx) return checkedToday ? "todaydone" : frozen ? "frozen" : "today";
  return "future";
}

// ── COMPACT feed widget ─────────────────────────────────────────────────────
function CheckInWidget({
  claimed = 4,
  checkedToday = false,
  frozen = false,
  onOpen,
  onCheckIn,
  accent = CI_ARC
}) {
  // the run is endless — no cap; the strip always shows the current 7-day week.
  // The header states BANKED days, the same meaning the full screen shows.
  const headerDay = claimed;
  const weekStart = Math.floor(claimed / 7) * 7 + 1;
  const dayCircle = n => {
    const st = ciStateFor(n, claimed, checkedToday, frozen);
    const isMile = n % 7 === 0;
    const cell = {
      flex: "1 1 0",
      minWidth: 0,
      aspectRatio: "1",
      borderRadius: "50%",
      boxSizing: "border-box",
      background: st === "claimed" || st === "todaydone" ? accent : st === "today" ? `${accent}22` : "rgba(255,255,255,.075)",
      border: st === "todaydone" ? "2px solid rgba(255,255,255,.85)" : st === "today" ? `1.5px solid ${accent}` : st === "frozen" ? "1.5px solid rgba(255,255,255,.18)" : "1px solid rgba(255,255,255,.07)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: CI_MONO,
      fontSize: 13,
      color: st === "future" ? "rgba(255,255,255,.4)" : "#fff",
      animation: st === "today" && !frozen ? "ci-todayring 1.8s ease-out infinite" : "none"
    };
    let inner;
    if (isMile) {
      const banked = st === "claimed" || st === "todaydone";
      inner = /*#__PURE__*/React.createElement("img", {
        src: banked ? CI_PRESENT_OPEN : CI_PRESENT,
        alt: "present",
        style: {
          width: 22,
          height: 22,
          objectFit: "contain",
          opacity: st === "future" ? .5 : 1
        }
      });
    } else if (st === "claimed" || st === "todaydone") {
      inner = /*#__PURE__*/React.createElement("svg", {
        width: "13",
        height: "13",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#fff",
        strokeWidth: "3.2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M5 12l5 5L20 7"
      }));
    } else if (st === "frozen") {
      inner = /*#__PURE__*/React.createElement("svg", {
        width: "11",
        height: "11",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#8a8a8a",
        strokeWidth: "2.2",
        strokeLinecap: "round"
      }, /*#__PURE__*/React.createElement("path", {
        d: "M9 5v14M15 5v14"
      }));
    } else {
      inner = n;
    }
    return /*#__PURE__*/React.createElement("div", {
      key: n,
      style: cell
    }, inner);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => {
      if (window.playClick) window.playClick(1100, 0.04);
      onOpen && onOpen();
    },
    style: {
      margin: "0 14px",
      position: "relative",
      borderRadius: 16,
      cursor: "pointer",
      background: "linear-gradient(160deg, #1f1f27, #0a0a0c)",
      border: "1px solid rgba(255,255,255,.13)",
      boxShadow: "0 12px 26px rgba(0,0,0,.45)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: 16,
      overflow: "hidden",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 90% 20%, ${accent}2e 0%, transparent 55%)`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "13px 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CI_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".18em"
    }
  }, "DAILY CHECK-IN"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: CI_MONO,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: frozen ? "#8a8a8a" : accent
    }
  }, headerDay), " DAYS", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CI_SANS,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".13em",
      color: "#A9A9B2",
      marginLeft: 9
    }
  }, "PRESENT ON DAY " + (Math.floor(claimed / 7) * 7 + 7))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 7,
      marginTop: 13
    }
  }, Array.from({
    length: 7
  }, (_, i) => dayCircle(weekStart + i))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13
    }
  }, /*#__PURE__*/React.createElement(CiCheckButton, {
    checkedToday: checkedToday,
    frozen: frozen,
    accent: accent,
    onCheckIn: onCheckIn
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 7,
      fontFamily: CI_SANS,
      fontWeight: 500,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".03em"
    }
  }, checkedToday ? "See you tomorrow for your next reward" : frozen ? "Streak paused — check in to continue" : "Tap CHECK IN to bank today's reward"))));
}
window.CheckInWidget = CheckInWidget;

// ── prize icon (mini) ───────────────────────────────────────────────────────
function CiRewardIcon({
  t,
  accent = CI_ARC,
  size = 22
}) {
  const P = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (t === "ticket") return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
    d: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 6v12",
    strokeDasharray: "2 2"
  }));
  if (t === "tusd") return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9.5 9.5h5M9.5 12h5M12 8v8"
  }));
  return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 7v10M9.5 9h4a1.6 1.6 0 0 1 0 3.2h-3a1.6 1.6 0 0 0 0 3.2h4"
  }));
}

// (the reward window lives in reward-claim.jsx — window.claimReward)

// ── FULL SCREEN: lifetime day count + the run toward the next present ───────
// One screen for both entries (lobby widget and Activities). Days are absolute
// and never renumbered: a present lands on every 7th day — 7, 14, 21, 28, 35 …
// The lifetime count is the trophy and never resets; a missed day only sends the
// current 7-day run back to its first day.
const CI_PRESENT = "assets/gifts/silver.png";
const CI_PRESENT_OPEN = "assets/gifts/silver-open.png";

// one plate shape, two states — the live run, and a finished week.
// Module-level on purpose: an inline component remounts every render and the
// present <img> reloads (visible blink).
function CiPlate({
  endDay,
  live,
  accent,
  left,
  total
}) {
  const start = endDay - 6;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: "none",
      borderRadius: 16,
      padding: "11px 12px",
      border: `1px solid ${live ? accent + "8c" : "rgba(255,255,255,.12)"}`,
      background: live ? `linear-gradient(150deg, ${accent}2b, #0b0b0e 66%)` : "linear-gradient(150deg,#111116,#0a0a0c 74%)",
      opacity: live ? 1 : .74
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CI_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".14em",
      color: "#fff"
    }
  }, "DAY " + start + "\u2013" + endDay), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      padding: "5px 11px",
      borderRadius: 8,
      whiteSpace: "nowrap",
      fontFamily: CI_MONO,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      background: live ? accent : "transparent",
      color: live ? "#fff" : "rgba(255,255,255,.78)",
      border: live ? "none" : "1px solid rgba(255,255,255,.2)"
    }
  }, live ? left === 1 ? "TOMORROW" : left + " DAYS LEFT" : "OPENED")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      gap: 6
    }
  }, Array.from({
    length: 7
  }, (_, k) => {
    const d = start + k;
    const done = live ? d <= total : true;
    const isToday = live && d === total;
    return /*#__PURE__*/React.createElement("span", {
      key: d,
      style: {
        flex: "none",
        width: 32,
        height: 32,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: CI_MONO,
        fontWeight: 700,
        fontSize: 11,
        background: done && !isToday ? accent : isToday ? "#000" : "rgba(255,255,255,.05)",
        border: isToday ? `2px solid ${accent}` : `1px solid ${done ? accent : "rgba(255,255,255,.11)"}`,
        boxShadow: isToday ? `0 0 15px ${accent}8c` : "none",
        color: done || isToday ? "#fff" : "rgba(255,255,255,.64)"
      }
    }, done && !isToday ? /*#__PURE__*/React.createElement(CiTick, null) : d);
  })), /*#__PURE__*/React.createElement("img", {
    src: live ? CI_PRESENT : CI_PRESENT_OPEN,
    alt: "present",
    style: {
      flex: "none",
      width: 56,
      height: 56,
      objectFit: "contain",
      filter: "drop-shadow(0 10px 18px rgba(0,0,0,.85))"
    }
  })));
}
function CiFlame({
  size = 17,
  color = CI_ARC
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "2",
    strokeLinecap: "square",
    strokeLinejoin: "miter",
    style: {
      flex: "none",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M13 2l-1 5 4 3-2 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 22a7 7 0 0 0 7-7c0-4-3-6-4-9-2 3-5 3-6 6-1-1-1-3-1-3-2 2-3 4-3 6a7 7 0 0 0 7 7z"
  }));
}
function CiTick({
  size = 11
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3",
    strokeLinecap: "square",
    style: {
      flex: "none",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 12.5l5 5L20 6.5"
  }));
}
function CheckInCalendar({
  open,
  claimed = 4,
  checkedToday = false,
  frozen = false,
  accent = CI_ARC,
  onClose,
  onCheckIn
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      const r = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(r);
    }
    setMounted(false);
  }, [open]);
  if (!open) return null;
  const total = Math.max(0, claimed); // lifetime days checked in
  const last = Math.floor(total / 7) * 7; // last present already collected
  const next = last + 7; // present being worked toward
  const run = total - last; // days done in the live run
  const left = 7 - run; // days still to go
  const opened = last / 7; // presents collected

  const kLabel = {
    fontFamily: CI_SANS,
    fontWeight: 600,
    fontSize: 11,
    letterSpacing: ".19em",
    color: "#A9A9B2"
  };
  const lbl = extra => Object.assign({
    display: "flex",
    alignItems: "center",
    gap: 9,
    margin: "17px 2px 0"
  }, extra || {});
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 70,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 280,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}2b, transparent 64%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.05) .7px, transparent 1.1px)",
      backgroundSize: "11px 11px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      flex: "none",
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "62px 16px 12px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
    onClick: () => {
      if (window.playClick) window.playClick(900, 0.04);
      onClose();
    },
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
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      minWidth: 0,
      maxWidth: "100%",
      flex: 1,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      textAlign: "center",
      fontFamily: CI_MONO,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "DAILY CHECK-IN"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "DAILY CHECK-IN",
    accent: accent
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "0 16px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1px 1fr",
      borderRadius: 20,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,.12)",
      background: "linear-gradient(150deg,#111116,#0a0a0c 74%)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7
    }
  }, /*#__PURE__*/React.createElement(CiFlame, {
    size: 17,
    color: accent
  }), /*#__PURE__*/React.createElement("span", {
    style: kLabel
  }, "DAYS")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CI_MONO,
      fontWeight: 700,
      fontSize: 64,
      lineHeight: .9,
      color: "#fff",
      textShadow: `0 0 38px ${accent}73`
    }
  }, total), /*#__PURE__*/React.createElement("span", {
    style: Object.assign({}, kLabel, {
      letterSpacing: ".14em"
    })
  }, "CHECKED IN")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: "rgba(255,255,255,.1)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "18px 16px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      gap: 9,
      background: `radial-gradient(90% 90% at 50% 40%, ${accent}33, transparent 72%)`
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: CI_PRESENT,
    alt: "present",
    style: {
      width: 74,
      height: 74,
      objectFit: "contain",
      filter: "drop-shadow(0 10px 18px rgba(0,0,0,.85))"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 4,
      alignItems: "center"
    }
  }, Array.from({
    length: 7
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: "none",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: i < run ? accent : "rgba(255,255,255,.16)",
      boxShadow: i < run ? `0 0 7px ${accent}cc` : "none"
    }
  }))), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: CI_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff"
    }
  }, left === 1 ? "1 DAY TO GO" : left + " DAYS TO GO"), /*#__PURE__*/React.createElement("span", {
    style: Object.assign({}, kLabel, {
      display: "block",
      marginTop: 6,
      letterSpacing: ".13em"
    })
  }, "DAY " + next)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 9,
      marginTop: 15,
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid rgba(255,255,255,.12)",
      background: "rgba(255,255,255,.03)",
      fontFamily: CI_SANS,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.45,
      color: "#D8D8DF"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "2",
    strokeLinecap: "square",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "9",
    width: "18",
    height: "12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 9h18M12 9v12M8 9a3 3 0 1 1 4-3 3 3 0 1 1 4 3"
  })), /*#__PURE__*/React.createElement("span", null, "One check-in a day. ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#fff",
      fontWeight: 700
    }
  }, "A present on every 7th day."), " Miss a day and the run restarts \u2014 your total keeps counting.")), /*#__PURE__*/React.createElement("div", {
    style: lbl({
      marginTop: 17
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CI_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".15em",
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, "THIS RUN"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CI_SANS,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, run + " / 7 DAYS"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "rgba(255,255,255,.12)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(CiPlate, {
    endDay: next,
    live: true,
    accent: accent,
    left: left,
    total: total
  })), opened > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: lbl({
      marginTop: 18
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CI_MONO,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".15em",
      color: "#fff",
      whiteSpace: "nowrap"
    }
  }, "PAST WEEKS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: CI_SANS,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, opened + " PRESENT" + (opened === 1 ? "" : "S") + " OPENED"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "rgba(255,255,255,.12)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9,
      marginTop: 10
    }
  }, Array.from({
    length: opened
  }, (_, i) => /*#__PURE__*/React.createElement(CiPlate, {
    key: i,
    endDay: last - i * 7,
    live: false,
    accent: accent,
    left: left,
    total: total
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 6,
      flex: "none",
      padding: "12px 16px calc(22px + env(safe-area-inset-bottom))",
      borderTop: "1px solid rgba(255,255,255,.07)",
      background: "linear-gradient(0deg,#050506 55%,rgba(5,5,6,.8))"
    }
  }, /*#__PURE__*/React.createElement(CiCheckButton, {
    checkedToday: checkedToday,
    frozen: frozen,
    accent: accent,
    onCheckIn: onCheckIn,
    big: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 10,
      fontFamily: CI_SANS,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.4,
      color: "#D8D8DF"
    }
  }, checkedToday ? `Day ${total} banked — present on day ${next}` : `Day ${total + 1} — present on day ${next}`)));
}
window.CheckInCalendar = CheckInCalendar;
window.CI_MILES = CI_MILES;
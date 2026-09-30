// Tasks — daily & weekly missions. Opens from the profile TASKS tile.
// Pokerdot house style: pure black, dot-matrix, Arcanium red, Space Mono.
// Collapsible sections, progress bars, GO / CLAIM actions.

const MONO_TK = UI.font;
const SANS_TK = UI.fontUI;

// Every mission carries a chrome figurine from the house foundry — either its
// discipline's own piece or the piece for that account action. No flat glyphs.
const DISC_ART = {
  holdem: "assets/disciplines/holdem.png",
  plo5: "assets/disciplines/plo5.png",
  plo6: "assets/disciplines/plo6.png",
  sd: "assets/disciplines/shortdeck.png",
  flash: "assets/disciplines/flash-and-flush.png",
  spin: "assets/comp/spin.png",
  tourn: "assets/fig-trophy-fin.png",
  login: "assets/fig-phone-c.png",
  jackpot: "assets/fig-jackpot.png",
  cash: "assets/fig-cash.png",
  friend: "assets/fig-pawns.png"
};
const DAILY_TASKS = [{
  id: "d1",
  disc: "holdem",
  name: "Play 50 hands in HOLD'EM",
  reward: "Daily Invitational Ticket",
  prog: 22,
  goal: 50
}, {
  id: "d2",
  disc: "spin",
  name: "Play 3 games in SPIN & WIN",
  reward: "$1 Bonus",
  prog: 3,
  goal: 3
}, {
  id: "d3",
  disc: "flash",
  name: "Play 100 hands in FLASH & FLUSH",
  reward: "Daily Ticket",
  prog: 0,
  goal: 100
}, {
  id: "d4",
  disc: "tourn",
  name: "Play in Daily GTD Event once",
  reward: "$1 Bonus",
  prog: 0,
  goal: 1
}, {
  id: "d5",
  disc: "login",
  name: "Log in on mobile",
  reward: "100 UPP",
  prog: 1,
  goal: 1
}];
const WEEKLY_TASKS = [{
  id: "w1",
  disc: "holdem",
  name: "Reach showdown with Four of a Kind in HOLD'EM",
  reward: "Weekly Invitational",
  prog: 1,
  goal: 1
}, {
  id: "w2",
  disc: "plo6",
  name: "Play 400 hands in PLO6",
  reward: "$2.50 Mystery Bounty",
  prog: 145,
  goal: 400
}, {
  id: "w3",
  disc: "sd",
  name: "Play 200 hands in SHORT DECK",
  reward: "Weekly Ticket",
  prog: 0,
  goal: 200
}, {
  id: "w4",
  disc: "tourn",
  name: "Reach the final table in Daily GTD Event",
  reward: "$5 Bonus",
  prog: 0,
  goal: 1
}, {
  id: "w5",
  disc: "jackpot",
  name: "Hit the Jackpot",
  reward: "$10 Bonus",
  prog: 0,
  goal: 1
}, {
  id: "w6",
  disc: "cash",
  name: "Deposit $50",
  reward: "Weekly Invitation Ticket",
  prog: 0,
  goal: 50
}, {
  id: "w7",
  disc: "friend",
  name: "Invite 3 players",
  reward: "3 Free Spins",
  prog: 1,
  goal: 3
}];

// glyphs only for the missions with no discipline behind them
function TaskGlyph({
  accent,
  kind
}) {
  const p = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
    d: "M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M15 6v12",
    strokeDasharray: "2 2"
  }));
}
function TaskRow({
  t,
  accent,
  onPlayDisc
}) {
  const done = t.prog >= t.goal;
  const [taken, setTaken] = React.useState(false);
  const pct = Math.min(100, Math.round(t.prog / t.goal * 100));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 13px",
      borderRadius: 14,
      border: `1px solid ${done ? accent + "99" : "rgba(255,255,255,.1)"}`,
      background: done ? `linear-gradient(152deg, ${accent}3a 0%, ${accent}18 44%, #0c0c0f 80%, #0a0a0c 100%)` : "linear-gradient(152deg,#17171c 0%,#0c0c0f 62%,#0a0a0c 100%)",
      boxShadow: done ? `0 10px 26px rgba(0,0,0,.5), inset 0 1px 0 ${accent}40` : "0 10px 26px rgba(0,0,0,.45)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: "none",
      width: 46,
      height: 46,
      borderRadius: 12,
      background: "rgba(255,255,255,.045)",
      border: "1px solid rgba(255,255,255,.12)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, DISC_ART[t.disc] ? /*#__PURE__*/React.createElement("img", {
    src: DISC_ART[t.disc],
    alt: "",
    style: {
      width: 38,
      height: 38,
      objectFit: "contain",
      filter: "drop-shadow(0 3px 7px rgba(0,0,0,.65))"
    }
  }) : /*#__PURE__*/React.createElement(TaskGlyph, {
    accent: accent,
    kind: t.kind
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_TK,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".01em",
      lineHeight: 1.28,
      textWrap: "pretty",
      display: "-webkit-box",
      WebkitBoxOrient: "vertical",
      WebkitLineClamp: 2,
      overflow: "hidden"
    }
  }, t.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 600,
      fontSize: 11,
      color: "#f0c75e",
      letterSpacing: ".02em",
      marginTop: 4,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, t.reward), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,.1)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      width: `${pct}%`,
      borderRadius: 2,
      background: done ? "#5BD96A" : accent
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_TK,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".06em",
      marginTop: 5,
      fontVariantNumeric: "tabular-nums"
    }
  }, t.prog.toLocaleString("en-US").split(",").join(" "), " / ", t.goal.toLocaleString("en-US").split(",").join(" "))), !done ? /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1500, 0.04);
      onPlayDisc && onPlayDisc(TK_PLAY_TARGET[t.disc] || null);
    },
    style: {
      flex: "none",
      padding: "9px 18px",
      borderRadius: 125,
      cursor: "pointer",
      border: 0,
      background: accent,
      color: "#fff",
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".08em",
      boxShadow: `0 6px 16px ${accent}55`
    }
  }, "PLAY") : /*#__PURE__*/React.createElement("button", {
    disabled: taken,
    onClick: () => {
      if (taken) return;
      if (window.playClick) window.playClick(1700, 0.04);
      const fire = () => setTaken(true);
      if (window.claimReward) window.claimReward({
        kicker: "DAILY MISSION",
        heading: "MISSION REWARD",
        accent,
        items: [{
          amount: t.reward || t.prize || "REWARD",
          sub: t.name,
          icon: "chip"
        }],
        onDone: fire
      });else fire();
    },
    style: {
      flex: "none",
      padding: "9px 18px",
      borderRadius: 125,
      cursor: taken ? "default" : "pointer",
      border: 0,
      background: taken ? "rgba(255,255,255,.085)" : accent,
      color: taken ? "rgba(255,255,255,.35)" : "#fff",
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".08em",
      boxShadow: taken ? "none" : `0 6px 16px ${accent}55`
    }
  }, taken ? "TAKEN" : "CLAIM"));
}
function TaskSection({
  title,
  hint,
  tasks,
  accent,
  defaultOpen = true,
  onPlayDisc,
  locked
}) {
  const [open, setOpen] = React.useState(locked ? false : defaultOpen);
  const readyCount = tasks.filter(t => t.prog >= t.goal).length;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      marginTop: 16,
      border: `1px solid ${!locked && open ? accent + "8c" : "rgba(255,255,255,.12)"}`,
      borderRadius: 14,
      overflow: "hidden",
      background: "linear-gradient(180deg,#0e0e11,#0a0a0c)",
      opacity: locked ? .58 : 1
    }
  }, locked ? /*#__PURE__*/React.createElement(TkLockBadge, {
    days: locked
  }) : null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (locked) return;
      if (window.playClick) window.playClick(1000, 0.03);
      setOpen(!open);
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      textAlign: "left",
      cursor: "pointer",
      background: "none",
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "14px 13px",
      border: "none",
      borderBottom: !locked && open ? "1px solid rgba(255,255,255,.07)" : "none",
      cursor: locked ? "default" : "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".14em"
    }
  }, title, readyCount ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      marginLeft: 8,
      verticalAlign: 2,
      padding: "3px 8px",
      borderRadius: 125,
      background: `${accent}24`,
      border: `1px solid ${accent}80`,
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: accent
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: accent,
      boxShadow: `0 0 8px ${accent}`
    }
  }), readyCount, " READY") : null), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: "#A9A9B2",
      marginTop: 4
    }
  }, tasks.length, " ", tasks.length === 1 ? "MISSION" : "MISSIONS", " \xB7 ", hint)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 26,
      height: 26,
      borderRadius: 8,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.16)",
      display: locked ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 200ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })))), open && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "11px 13px 13px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, tasks.map(t => /*#__PURE__*/React.createElement(TaskRow, {
    key: t.id,
    t: t,
    accent: accent,
    onPlayDisc: onPlayDisc
  })))));
}

// Підтвердження вибору місії: вибір НЕЗВОРОТНИЙ — решта набору закривається,
// тож випадковий тап не має його робити.
function TkConfirmPick({
  data,
  accent,
  onCancel,
  onConfirm
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
  return /*#__PURE__*/React.createElement("div", {
    onClick: onCancel,
    style: {
      position: "fixed",
      inset: 0,
      zIndex: 125,
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
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: accent
    }
  }, data.section), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 9,
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".12em",
      color: "#fff",
      textWrap: "pretty"
    }
  }, "CHOOSE THIS MISSION?"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 13,
      padding: "11px 12px",
      borderRadius: 12,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.11)",
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_TK,
      fontSize: 12.5,
      color: "#fff",
      lineHeight: 1.3,
      textWrap: "pretty"
    }
  }, data.name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 600,
      fontSize: 11,
      color: "#f0c75e",
      marginTop: 5
    }
  }, data.reward)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 11,
      fontFamily: SANS_TK,
      fontWeight: 600,
      fontSize: 11.5,
      lineHeight: 1.5,
      color: "#A9A9B2",
      textWrap: "pretty"
    }
  }, "The other missions in this set will close. This cannot be undone."), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 16,
      display: "flex",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onCancel,
    style: Object.assign(UI.btn("m", "ghost", accent), {
      flex: 1
    })
  }, "CANCEL"), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    style: Object.assign(UI.btn("m", "primary", accent), {
      flex: 1
    })
  }, "CHOOSE"))));
}

// ── ChoiceSection — the GG-style set: pick ONE of N missions, clear it, claim.
// Nothing refreshes until the reward is taken: an unclaimed reward keeps the
// whole set frozen, which is the entire point of the mechanic.
const TK_PLAY_TARGET = {
  holdem: {
    cat: "cash",
    disc: "HOLD'EM"
  },
  plo5: {
    cat: "cash",
    disc: "PLO5"
  },
  plo6: {
    cat: "cash",
    disc: "PLO6"
  },
  sd: {
    cat: "cash",
    disc: "SHORT DECK"
  },
  flash: {
    cat: "fast"
  },
  spin: {
    cat: "spin"
  },
  tourn: {
    cat: "tourn"
  },
  jackpot: {
    cat: "cash",
    disc: "HOLD'EM"
  },
  cash: {
    cat: "cashier"
  },
  friend: {
    cat: "invite"
  }
};
function ChoiceSection({
  title,
  hint,
  tasks: allTasks,
  accent,
  storeKey,
  defaultOpen = true,
  onPlayDisc,
  locked
}) {
  const tasks = allTasks.slice(0, 3);
  const [open, setOpen] = React.useState(locked ? false : defaultOpen);
  const [pick, setPick] = React.useState(null); // id of the chosen mission
  const [confirm, setConfirm] = React.useState(null); // місія, вибір якої підтверджують
  const [taken, setTaken] = React.useState(false);
  const chosen = pick ? tasks.find(t => t.id === pick) : null;
  const done = !!chosen && chosen.prog >= chosen.goal;
  const state = taken ? "claimed" : done ? "ready" : chosen ? "running" : "picking";
  const status = {
    picking: "CHOOSE 1 OF " + tasks.length,
    running: "PLAY TO FINISH IT",
    ready: "REWARD WAITING",
    claimed: "NEXT SET " + hint
  }[state];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      marginTop: 16,
      border: `1px solid ${!locked && open ? accent + "8c" : "rgba(255,255,255,.12)"}`,
      borderRadius: 14,
      overflow: "hidden",
      background: "linear-gradient(180deg,#0e0e11,#0a0a0c)",
      opacity: locked ? .58 : 1
    }
  }, locked ? /*#__PURE__*/React.createElement(TkLockBadge, {
    days: locked
  }) : null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (locked) return;
      if (window.playClick) window.playClick(1000, 0.03);
      setOpen(!open);
    },
    style: {
      width: "100%",
      boxSizing: "border-box",
      textAlign: "left",
      cursor: "pointer",
      background: "none",
      display: "flex",
      alignItems: "center",
      gap: 11,
      padding: "14px 13px",
      border: "none",
      borderBottom: !locked && open ? "1px solid rgba(255,255,255,.07)" : "none",
      cursor: locked ? "default" : "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".14em"
    }
  }, title, state === "ready" ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      marginLeft: 8,
      verticalAlign: 2,
      padding: "3px 8px",
      borderRadius: 125,
      background: `${accent}24`,
      border: `1px solid ${accent}80`,
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: accent
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: accent,
      boxShadow: `0 0 8px ${accent}`
    }
  }), "CLAIM") : null), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em",
      color: state === "ready" ? accent : "rgba(255,255,255,.5)",
      marginTop: 4
    }
  }, status)), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 26,
      height: 26,
      borderRadius: 8,
      background: "rgba(255,255,255,.05)",
      border: "1px solid rgba(255,255,255,.16)",
      display: locked ? "none" : "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 200ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 9l6 6 6-6"
  })))), open && !locked && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "11px 13px 13px",
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.45,
      color: "#A9A9B2"
    }
  }, state === "picking" ? "Pick the one you want to play today. The others close for this set." : state === "claimed" ? "Reward taken. A fresh set of missions arrives at the next refresh." : "Take the reward to unlock the next set — missions do not refresh until you do."), tasks.map(t => {
    const isPick = pick === t.id;
    const dim = !!pick && !isPick;
    const pct = Math.min(100, Math.round(t.prog / t.goal * 100));
    const rowDone = isPick && t.prog >= t.goal;
    return /*#__PURE__*/React.createElement("div", {
      key: t.id,
      style: {
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "12px 13px",
        borderRadius: 14,
        opacity: dim ? .42 : 1,
        transition: "opacity 200ms ease",
        border: `1px solid ${rowDone ? accent + "99" : isPick ? accent + "66" : "rgba(255,255,255,.1)"}`,
        background: rowDone ? `linear-gradient(152deg, ${accent}3a 0%, ${accent}18 44%, #0c0c0f 80%, #0a0a0c 100%)` : isPick ? `linear-gradient(152deg, ${accent}1f 0%, #0c0c0f 62%, #0a0a0c 100%)` : "linear-gradient(152deg,#17171c 0%,#0c0c0f 62%,#0a0a0c 100%)",
        boxShadow: "0 10px 26px rgba(0,0,0,.45)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        flex: "none",
        width: 46,
        height: 46,
        borderRadius: 12,
        background: "rgba(255,255,255,.045)",
        border: "1px solid rgba(255,255,255,.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, DISC_ART[t.disc] ? /*#__PURE__*/React.createElement("img", {
      src: DISC_ART[t.disc],
      alt: "",
      style: {
        width: 38,
        height: 38,
        objectFit: "contain",
        filter: "drop-shadow(0 3px 7px rgba(0,0,0,.65))"
      }
    }) : /*#__PURE__*/React.createElement(TaskGlyph, {
      accent: accent,
      kind: t.kind
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO_TK,
        fontSize: 12,
        color: "#fff",
        lineHeight: 1.28,
        textWrap: "pretty",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: 2,
        overflow: "hidden"
      }
    }, t.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS_TK,
        fontWeight: 600,
        fontSize: 11,
        color: isPick ? "#fff" : "#f0c75e",
        marginTop: 4,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, t.reward), isPick ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        height: 4,
        borderRadius: 2,
        background: "rgba(255,255,255,.1)",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        width: pct + "%",
        borderRadius: 2,
        background: rowDone ? "#5BD96A" : accent
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO_TK,
        fontSize: 10.5,
        color: "#A9A9B2",
        letterSpacing: ".06em",
        marginTop: 5,
        fontVariantNumeric: "tabular-nums"
      }
    }, t.prog, " / ", t.goal)) : null), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none"
      }
    }, !pick ? /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.playClick) window.playClick(1400, 0.04);
        setConfirm({
          ...t,
          section: title
        });
      },
      style: {
        padding: "9px 18px",
        borderRadius: 125,
        border: `1px solid ${accent}`,
        cursor: "pointer",
        background: `${accent}1f`,
        color: "#fff",
        fontFamily: MONO_TK,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".08em"
      }
    }, "CHOOSE") : isPick && !rowDone && !taken ? /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.playClick) window.playClick(1500, 0.04);
        onPlayDisc && onPlayDisc(TK_PLAY_TARGET[t.disc] || null);
      },
      style: {
        padding: "9px 18px",
        borderRadius: 125,
        border: 0,
        cursor: "pointer",
        background: accent,
        color: "#fff",
        fontFamily: MONO_TK,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".08em",
        boxShadow: `0 6px 16px ${accent}55`
      }
    }, "PLAY") : isPick ? /*#__PURE__*/React.createElement("button", {
      disabled: taken,
      onClick: () => {
        if (taken) return;
        if (window.playClick) window.playClick(1700, 0.04);
        const fire = () => setTaken(true);
        if (window.claimReward) window.claimReward({
          kicker: title,
          heading: "MISSION REWARD",
          accent,
          items: [{
            amount: t.reward,
            sub: t.name,
            icon: "chip"
          }],
          note: "A fresh set of missions unlocks now.",
          onCollect: fire
        });else fire();
      },
      style: {
        padding: "9px 18px",
        borderRadius: 125,
        border: 0,
        cursor: taken ? "not-allowed" : "pointer",
        background: taken ? "rgba(255,255,255,.085)" : accent,
        color: taken ? "rgba(255,255,255,.35)" : "#fff",
        fontFamily: MONO_TK,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".08em",
        boxShadow: taken ? "none" : `0 6px 16px ${accent}55`
      }
    }, taken ? "TAKEN" : "CLAIM") : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_TK,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em",
        color: "#8A8A93"
      }
    }, "CLOSED")));
  })), /*#__PURE__*/React.createElement(TkConfirmPick, {
    data: confirm,
    accent: accent,
    onCancel: () => {
      if (window.playClick) window.playClick(900, .03);
      setConfirm(null);
    },
    onConfirm: () => {
      if (window.playClick) window.playClick(1600, .05);
      setPick(confirm.id);
      setConfirm(null);
    }
  }));
}
const HM_TONE = "#E8B23A"; // honeymoon owns the gold tone on the Rewards grid

// ── ActTile — the single tile shape every Rewards entry uses ───────────────
// The figurine gets its own COLUMN (never absolute, never cropped): content
// left, chrome hero right with real padding, action row full-width below.

// Chrome check — the daily check-in's own mark. Same metal language as the
// gift renders (highlight top, mid-tone core, rim light) with the room's red
// bloom behind it, so it belongs on these tiles without a new PNG.
function TkChromeCheck({
  size = 106
}) {
  const s = size;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      width: s,
      height: s,
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: "12%",
      borderRadius: "50%",
      background: "radial-gradient(circle at 50% 46%, rgba(215,25,33,.55), rgba(215,25,33,0) 68%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: "13%",
      borderRadius: "50%",
      background: "linear-gradient(168deg,#ffffff 0%,#e9ebf0 24%,#9ba2ad 52%,#e6e8ee 74%,#ffffff 100%)",
      boxShadow: "inset 0 2px 3px rgba(255,255,255,.95), inset 0 -3px 6px rgba(0,0,0,.42), 0 14px 26px rgba(0,0,0,.7)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: "20%",
      borderRadius: "50%",
      background: "linear-gradient(168deg,#4a4d55 0%,#23252b 46%,#3a3d45 100%)",
      boxShadow: "inset 0 3px 7px rgba(0,0,0,.85), inset 0 -2px 2px rgba(255,255,255,.16)"
    }
  }), /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 100 100",
    width: s,
    height: s,
    style: {
      position: "absolute",
      inset: 0,
      filter: "drop-shadow(0 2px 2px rgba(0,0,0,.6))"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "tkChk",
    x1: "0",
    y1: "0",
    x2: "0.25",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#ffffff"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".42",
    stopColor: "#f3f4f8"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".58",
    stopColor: "#a7aeb9"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#ffffff"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M35.5 51.5 L45.5 62 L66 39",
    fill: "none",
    stroke: "url(#tkChk)",
    strokeWidth: "9.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}

// the corner stamp a locked block wears — days, not a date, because the
// countdown is what the player is waiting on
function TkLockBadge({
  days
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 0,
      top: 0,
      zIndex: 3,
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "6px 11px",
      borderRadius: "0 16px 0 12px",
      background: "#17171c",
      border: "1px solid #2b2b34",
      borderTop: 0,
      borderRight: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.6)",
    strokeWidth: "2.2",
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
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      whiteSpace: "nowrap"
    }
  }, typeof days === "number" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", null, "AVAILABLE IN"), " " + days + " ", /*#__PURE__*/React.createElement("span", null, days === 1 ? "DAY" : "DAYS")) : /*#__PURE__*/React.createElement("span", null, "SOON")));
}
function ActTile({
  wide,
  hot,
  live,
  locked,
  accent,
  tone,
  art,
  artNode,
  artSize = 96,
  kicker,
  title,
  value,
  unit,
  sub,
  foot,
  dots,
  action,
  onTap
}) {
  const c = tone || accent;
  if (locked) hot = live = false;
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (locked) return;
      if (window.playClick) window.playClick(1200, 0.04);
      onTap && onTap();
    },
    style: {
      gridColumn: wide ? "1 / -1" : "auto",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      minHeight: wide ? 158 : 188,
      borderRadius: 16,
      padding: "13px 14px 14px",
      border: `1px solid ${hot ? "rgba(255,255,255,.22)" : live || tone ? c + "66" : "rgba(255,255,255,.11)"}`,
      background: hot ? `linear-gradient(118deg, ${accent} 0%, #8c0f16 100%)` : live || tone ? `linear-gradient(150deg, ${c}3a 0%, ${c}12 42%, #0c0c0f 78%, #0a0a0c 100%)` : "linear-gradient(150deg,#141419 0%,#0c0c0f 62%,#0a0a0c 100%)",
      boxShadow: hot || live || tone ? "0 12px 30px rgba(0,0,0,.5)" : "0 10px 24px rgba(0,0,0,.4)",
      display: "flex",
      flexDirection: "column",
      gap: 0,
      opacity: locked ? .58 : 1,
      cursor: locked ? "default" : "pointer"
    }
  }, locked ? /*#__PURE__*/React.createElement(TkLockBadge, {
    days: locked
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: `radial-gradient(circle, rgba(255,255,255,${hot ? ".18" : ".06"}) .8px, transparent 1.2px)`,
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(118deg, black, transparent 76%)",
      WebkitMaskImage: "linear-gradient(118deg, black, transparent 76%)"
    }
  }), art && !wide && /*#__PURE__*/React.createElement("img", {
    src: art,
    alt: "",
    style: {
      position: "absolute",
      width: artSize,
      height: artSize,
      right: -Math.round(artSize * 0.2),
      top: "62%",
      transform: "translateY(-46%)",
      objectFit: "contain",
      pointerEvents: "none",
      filter: "drop-shadow(0 14px 26px rgba(0,0,0,.72))"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: 1,
      width: "100%",
      boxSizing: "border-box",
      display: "flex",
      gap: 12,
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, live && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 6,
      height: 6,
      borderRadius: "50%",
      background: c,
      boxShadow: `0 0 10px ${c}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      color: live || tone ? c : hot ? "rgba(255,255,255,.82)" : "rgba(255,255,255,.5)"
    }
  }, kicker)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: wide ? 22 : 19,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 7,
      lineHeight: 1.05
    }
  }, title), sub && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 600,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: "#A9A9B2",
      marginTop: 6,
      lineHeight: 1.4
    }
  }, sub), dots && !locked && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      gap: 4,
      marginTop: 10
    }
  }, Array.from({
    length: dots.total
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: "none",
      width: 8,
      height: 8,
      borderRadius: "50%",
      background: i < dots.done ? c : "rgba(255,255,255,.16)",
      boxShadow: i < dots.done ? `0 0 7px ${c}cc` : "none"
    }
  }))), art && !wide && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minHeight: 74
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: art && !wide ? 0 : "auto",
      paddingTop: art && !wide ? 0 : 11,
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, unit && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".16em",
      color: hot ? "rgba(255,255,255,.7)" : "rgba(255,255,255,.45)",
      whiteSpace: "nowrap"
    }
  }, unit), value && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 16,
      color: "#fff",
      lineHeight: 1,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, value), foot && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 600,
      fontSize: 10.5,
      lineHeight: 1.35,
      color: "#A9A9B2"
    }
  }, foot))), (art || artNode) && wide && /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: artSize,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px 0"
    }
  }, artNode || /*#__PURE__*/React.createElement("img", {
    src: art,
    alt: "",
    style: {
      width: "100%",
      maxHeight: 122,
      objectFit: "contain",
      filter: "drop-shadow(0 12px 22px rgba(0,0,0,.7))"
    }
  }))), action && !locked && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      marginTop: 12,
      display: "flex",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      if (window.playClick) window.playClick(1600, 0.05);
      action.onTap && action.onTap();
    },
    style: {
      flex: 1,
      display: "block",
      width: "100%",
      boxSizing: "border-box",
      textAlign: "center",
      padding: "11px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: hot ? "#fff" : accent,
      color: hot ? accent : "#fff",
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".14em",
      boxShadow: hot ? "0 8px 20px rgba(0,0,0,.35)" : `0 8px 20px ${accent}55`
    }
  }, action.label)));
}

// ── InviteTile — the referral hero. Not a generic tile: the Fortune Wheel is
// the illustration AND the promise, so it stands tall on the right, half
// bleeding past the edge with a red glow behind it, and the reward reads as
// one arithmetic line: one friend = one spin.
function InviteTile({
  accent,
  onTap
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.04);
      onTap && onTap();
    },
    style: {
      gridColumn: "1 / -1",
      position: "relative",
      overflow: "hidden",
      boxSizing: "border-box",
      width: "100%",
      textAlign: "left",
      cursor: "pointer",
      borderRadius: 20,
      padding: "16px 16px 15px",
      border: "1px solid rgba(255,255,255,.2)",
      background: `linear-gradient(112deg, ${accent} 0%, #a5121a 58%, #6d0b12 100%)`,
      boxShadow: "0 14px 34px rgba(0,0,0,.55)",
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.2) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(112deg, black, transparent 70%)",
      WebkitMaskImage: "linear-gradient(112deg, black, transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      width: 230,
      height: 230,
      right: -62,
      top: -34,
      borderRadius: "50%",
      pointerEvents: "none",
      background: "radial-gradient(circle, rgba(255,255,255,.3) 0%, rgba(255,255,255,.07) 46%, transparent 68%)"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: "assets/fig-friends-c.png",
    alt: "",
    style: {
      position: "absolute",
      width: 268,
      height: 268,
      right: -34,
      bottom: -22,
      objectFit: "contain",
      pointerEvents: "none",
      filter: "drop-shadow(0 16px 30px rgba(0,0,0,.6))"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      paddingRight: 150
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "4px 10px",
      borderRadius: 125,
      background: "rgba(0,0,0,.32)",
      border: "1px solid rgba(255,255,255,.3)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: "#fff"
    }
  }, "REFERRALS")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      maxWidth: 168,
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 25,
      lineHeight: 1.04,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 10,
      textWrap: "balance"
    }
  }, "INVITE A FRIEND"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "1 FRIEND"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 13,
      color: "#A9A9B2"
    }
  }, "="), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "1 GIFT")), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_TK,
      fontWeight: 600,
      fontSize: 10.5,
      lineHeight: 1.4,
      color: "#D8D8DF",
      marginTop: 6
    }
  }, "Share your link or QR code \u2014 every friend who deposits earns you a gift.")), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "flex",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: e => {
      e.stopPropagation();
      if (window.playClick) window.playClick(1600, 0.05);
      onTap && onTap();
    },
    style: {
      flex: 1,
      textAlign: "center",
      padding: "12px 0",
      borderRadius: 125,
      cursor: "pointer",
      background: "#fff",
      color: accent,
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".14em",
      boxShadow: "0 8px 20px rgba(0,0,0,.4)"
    }
  }, "INVITE A FRIEND")));
}
function TasksScreen({
  open,
  onClose,
  accent = "#D71921",
  ciDay,
  ciCheckedToday,
  ciFrozen,
  onCheckInOpen,
  onCheckInNow,
  onHoneymoon,
  onCompetitions,
  onInvite,
  onSafe,
  onGiftCode,
  onPlayDisc,
  nested = false,
  topInset = 0
}) {
  const [mounted, setMounted] = React.useState(false);
  const cps = window.cpSummary ? window.cpSummary() : {
    races: 0,
    joined: 0,
    pool: 0
  };
  // Правило продукту: перші 30 днів належать Honeymoon, а щоденний чек-ін і
  // місії відкриваються після нього. У прототипі ці розділи мають бути живими
  // й клікабельними, тому замок вимкнено — вмикається одним прапорцем.
  const HM_GATE = false;
  const hmDone = window.hmState ? window.hmState().done : 30;
  const hmLeft = HM_GATE ? Math.max(0, 30 - hmDone) : 0;
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 60,
      background: "#000",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
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
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.045) 0.6px, transparent 1px)",
      backgroundSize: "11px 11px"
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
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
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
      fontFamily: MONO_TK,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "REWARDS"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "REWARDS",
    accent: accent
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
      position: "relative",
      zIndex: 2,
      padding: "4px 16px 110px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 10,
      marginTop: 4
    }
  }, (() => {
    const P = window.cmPlayer || {
      level: 1,
      rakeCycle: 5,
      rakeThreshold: 10,
      xpRate: 100
    };
    const threshold = P.rakeThreshold || 10,
      progress = Math.min(1, (P.rakeCycle || 0) / threshold),
      ready = progress >= 1;
    const xp = Math.round(Math.min(P.rakeCycle || 0, threshold) * (P.xpRate || 100)),
      target = Math.round(threshold * (P.xpRate || 100));
    return /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "rewards-rakeback",
      onClick: onSafe,
      "data-i18n": "off",
      "aria-label": "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u0440\u0435\u0439\u043A\u0431\u0435\u043A",
      style: {
        gridColumn: '1 / -1',
        position: 'relative',
        isolation: 'isolate',
        overflow: 'hidden',
        textAlign: 'left',
        padding: 20,
        minHeight: 240,
        borderRadius: UI.r.md,
        border: '1px solid #ffffff24',
        background: '#101114',
        color: UI.text,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'radial-gradient(ellipse 90% 130% at 85% 55%,#71809040,transparent 75%),#0e1013'
      }
    }), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        width: 420,
        height: 340,
        right: -100,
        top: -62,
        pointerEvents: 'none'
      }
    }, window.RbHouseStages3D && /*#__PURE__*/React.createElement(window.RbHouseStages3D, {
      level: window.rbCycle.stage(P),
      lg: window.cmLeague.forLevel(Math.max(1, window.rbCycle.stage(P))),
      w: 420,
      h: 340,
      autoRotate: true,
      rotationSpeed: .035,
      zoom: 1.35
    })), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(90deg,#0b0d10f5 0%,#0b0d10d9 28%,#0b0d1060 58%,#0b0d1000 88%),linear-gradient(0deg,#0b0d10e8,transparent 45%)'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_TK,
        fontSize: 22,
        fontWeight: 700,
        letterSpacing: '.04em',
        lineHeight: 1.1
      }
    }, "\u0420\u0415\u0419\u041A\u0411\u0415\u041A"), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'grid',
        placeItems: 'center',
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '1px solid #ffffff30',
        background: '#101115a0',
        backdropFilter: 'blur(8px)'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "m9 5 7 7-7 7"
    })))), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'block',
        marginTop: 64
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontFamily: MONO_TK,
        fontSize: 36,
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: '-.03em',
        fontVariantNumeric: 'tabular-nums'
      }
    }, xp.toLocaleString('ru-RU'), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: SANS_TK,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: '.04em',
        marginLeft: 7
      }
    }, "XP")), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        fontFamily: SANS_TK,
        fontSize: 12,
        color: '#c1c4cb',
        marginTop: 7
      }
    }, ready ? 'Рейкбек готов' : 'из ' + target.toLocaleString('ru-RU') + ' XP')), /*#__PURE__*/React.createElement("span", {
      role: "progressbar",
      "aria-label": "XP \u0434\u043E \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430",
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-valuenow": progress * 100,
      style: {
        display: 'block',
        position: 'relative',
        height: 4,
        borderRadius: 2,
        background: '#ffffff22',
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        height: '100%',
        borderRadius: 2,
        width: progress * 100 + '%',
        background: UI.accent,
        transition: 'width .6s ease'
      }
    })));
  })(), /*#__PURE__*/React.createElement(InviteTile, {
    accent: accent,
    onTap: onInvite
  }), window.HoneymoonWidget ? /*#__PURE__*/React.createElement(window.HoneymoonWidget, {
    accent: HM_TONE,
    onOpen: onHoneymoon,
    style: {
      gridColumn: "1 / -1"
    }
  }) : null, (() => {
    // рахуємо всі дошки, які видно на екрані змагань (враховуючи
    // «Дружеский рояль»), інакше число в плитці не збігається зі списком
    const B = window.cpBoards ? window.cpBoards() : null;
    const races = B ? B.length : 4;
    const pool = B ? B.reduce((x, y) => x + (y.pool || 0), 0) : 642000000;
    const money = n => "C$" + Math.round(n || 0).toLocaleString("en-US").split(",").join("\u00A0");
    return /*#__PURE__*/React.createElement(ActTile, {
      wide: true,
      accent: accent,
      tone: "#f0c75e",
      art: "assets/comp/tourn-cup-crown.png",
      artSize: 104,
      kicker: "COMPETITIONS",
      title: races + " LEADERBOARDS",
      sub: "TOTAL POOL " + money(pool),
      onTap: onCompetitions,
      action: {
        label: "OPEN",
        onTap: onCompetitions
      }
    });
  })(), /*#__PURE__*/React.createElement(ActTile, {
    accent: accent,
    tone: "#5BD96A",
    art: "assets/gift-red.png",
    artSize: 98,
    kicker: "GIFT CODE",
    title: "REDEEM",
    sub: "BONUSES \xB7 TICKETS \xB7 SPINS",
    onTap: onGiftCode,
    action: {
      label: "ENTER CODE",
      onTap: onGiftCode
    }
  }), /*#__PURE__*/React.createElement(ActTile, {
    locked: hmLeft,
    accent: accent,
    artNode: /*#__PURE__*/React.createElement(TkChromeCheck, {
      size: 104
    }),
    artSize: 106,
    kicker: "DAILY CHECK-IN",
    title: hmLeft ? "DAILY CHECK-IN" : ciDay + " DAYS",
    sub: hmLeft ? "OPENS AFTER YOUR FIRST 30 DAYS" : (() => {
      const d = Math.floor(ciDay / 7) * 7 + 7 - ciDay;
      return "NEXT GIFT IN " + d + (d === 1 ? " DAY" : " DAYS");
    })(),
    dots: {
      done: ciDay - Math.floor(ciDay / 7) * 7,
      total: 7
    },
    onTap: onCheckInOpen,
    action: ciCheckedToday ? null : {
      label: "CHECK IN",
      onTap: onCheckInNow
    }
  })), /*#__PURE__*/React.createElement("div", {
    "data-shot": "missions"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      margin: "22px 2px 9px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_TK,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: "#8A8A93"
    }
  }, "MISSIONS"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: "rgba(255,255,255,.1)"
    }
  })), /*#__PURE__*/React.createElement(ChoiceSection, {
    locked: hmLeft,
    title: "DAILY MISSIONS",
    hint: "08:00",
    tasks: DAILY_TASKS,
    accent: accent,
    onPlayDisc: onPlayDisc
  }), /*#__PURE__*/React.createElement(ChoiceSection, {
    locked: hmLeft,
    title: "WEEKLY MISSIONS",
    hint: "SUNDAY 08:00",
    tasks: WEEKLY_TASKS,
    accent: accent,
    onPlayDisc: onPlayDisc
  }))));
}
Object.assign(window, {
  TasksScreen
});
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Referral Rewards — screen structured after a common referral-wheel layout,
// rebuilt in the Pokerix/Cardomancer system: pure-black canvas, one Arcanium
// red, Chakra mono, FLAT surfaces (no gradient chrome), dot-matrix accents,
// single back-chevron close. Embeds the shared FortuneWheel (fortune-wheel.jsx)
// for the actual spin.

const RR_MONO = UI.font;
const RR_SANS = UI.fontUI;
const RR_FACES = [{
  l: "$10.8 PKO\nMAIN\nTICKET",
  short: "$10.8 Daily PKO Main Event Ticket ×1"
}, {
  l: "SPIN&WIN\n$1",
  short: "Spin & Win (3-Max) $1 \u00d71"
}, /* E7 */
{
  l: "SPIN&WIN\n$0.25",
  short: "Spin & Win (3-Max) $0.25 \u00d71"
}, {
  l: "$2.5\nMYSTERY\nBOUNTY",
  short: "$2.5 Mystery Bounty Ticket ×1"
}, {
  l: "DAILY\nINVITE\nTICKET",
  short: "Daily Invitational Ticket ×1"
}, {
  l: "THANK\nYOU",
  short: "Thank You"
}];
const RR_SEG = 360 / RR_FACES.length;
const RR_DEEP = "#9E0E15";

// interactive hero wheel — spins in place; center SPIN button
function RrHeroWheel({
  accent,
  rot,
  spinning,
  onEnd,
  onSpin,
  canSpin
}) {
  const stops = RR_FACES.map((_, i) => `${i % 2 === 0 ? "#fff" : RR_DEEP} ${i * RR_SEG}deg ${(i + 1) * RR_SEG}deg`).join(", ");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 236,
      height: 236
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -1,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 6,
      width: 0,
      height: 0,
      borderLeft: "9px solid transparent",
      borderRight: "9px solid transparent",
      borderTop: "17px solid #fff",
      filter: "drop-shadow(0 2px 3px rgba(0,0,0,.5))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "#fff",
      padding: 7,
      boxSizing: "border-box",
      boxShadow: "0 16px 40px rgba(0,0,0,.5)"
    }
  }, Array.from({
    length: 24
  }, (_, i) => {
    const a = i / 24 * 2 * Math.PI,
      x = 50 + 48.5 * Math.cos(a),
      y = 50 + 48.5 * Math.sin(a);
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%,-50%)",
        width: 3,
        height: 3,
        borderRadius: "50%",
        background: i % 2 ? accent : "rgba(0,0,0,.25)"
      }
    });
  }), /*#__PURE__*/React.createElement("div", {
    onTransitionEnd: onEnd,
    style: {
      position: "absolute",
      inset: 7,
      borderRadius: "50%",
      overflow: "hidden",
      transform: `rotate(${rot}deg)`,
      transition: spinning ? "transform 4.5s cubic-bezier(0.13,0.62,0.12,1)" : "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: `conic-gradient(${stops})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: `repeating-conic-gradient(rgba(0,0,0,.16) 0deg 0.7deg, transparent 0.7deg ${RR_SEG}deg)`
    }
  }), RR_FACES.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `rotate(${i * RR_SEG + RR_SEG / 2}deg) translateY(-78px)`,
      transformOrigin: "0 0",
      width: 0,
      height: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "translate(-50%,-50%)",
      width: 66,
      textAlign: "center",
      fontFamily: RR_MONO,
      fontWeight: 700,
      fontSize: 10.5,
      lineHeight: 1.16,
      color: i % 2 === 0 ? RR_DEEP : "#fff",
      whiteSpace: "pre-line"
    }
  }, p.l)))), /*#__PURE__*/React.createElement("button", {
    onClick: onSpin,
    disabled: !canSpin,
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 5,
      width: 60,
      height: 60,
      borderRadius: "50%",
      border: 0,
      background: canSpin ? "#fff" : "#ecdede",
      cursor: canSpin ? "pointer" : "default",
      boxShadow: `0 4px 12px rgba(0,0,0,.4), 0 0 0 5px ${accent}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, canSpin && /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: -5,
      borderRadius: "50%",
      border: `2px solid ${accent}88`,
      animation: "pp-ring 2s ease-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR_MONO,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".04em",
      color: accent
    }
  }, spinning ? "\u00b7\u00b7\u00b7" : "SPIN"))));
}

// exact dock icons from the app (lobby-canvas.jsx)
function RrDockIcon({
  kind,
  color = "#fff"
}) {
  const p = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (kind) {
    case "lobby":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "7",
        height: "7",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "3",
        width: "7",
        height: "7",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "14",
        width: "7",
        height: "7",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "14",
        y: "14",
        width: "7",
        height: "7",
        rx: "1.5"
      }));
    case "events":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
        d: "M12 2v6M12 22v-6M2 12h6M22 12h-6"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4"
      }));
    case "play":
      return /*#__PURE__*/React.createElement("svg", _extends({}, p, {
        fill: color,
        stroke: "none"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 4l14 8-14 8z"
      }));
    case "missions":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "5",
        y: "4",
        width: "14",
        height: "17",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 4h6v2.5H9z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8.5 12.5l2 2 4-4.5"
      }));
    case "profile":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "8",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 21c0-4 4-7 8-7s8 3 8 7"
      }));
    case "cashier":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "6",
        width: "18",
        height: "13",
        rx: "2.4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 10.5h18M6.5 15h3"
      }));
    case "gear":
      return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "3.2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 3.4v2.2M12 18.4v2.2M20.6 12h-2.2M5.6 12H3.4M18.1 5.9l-1.6 1.6M7.5 16.5l-1.6 1.6M18.1 18.1l-1.6-1.6M7.5 7.5L5.9 5.9"
      }));
    default:
      return null;
  }
}

// faux QR (decorative — finder patterns + stable module pattern)
function RrQR({
  size = 150
}) {
  const N = 21,
    cell = size / N,
    rects = [];
  const fin = (x, y, fx, fy) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7 && (x === fx || x === fx + 6 || y === fy || y === fy + 6 || x >= fx + 2 && x <= fx + 4 && y >= fy + 2 && y <= fy + 4);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let on;
    if (x < 7 && y < 7) on = fin(x, y, 0, 0);else if (x >= N - 7 && y < 7) on = fin(x, y, N - 7, 0);else if (x < 7 && y >= N - 7) on = fin(x, y, 0, N - 7);else if (x < 8 && y < 8 || x >= N - 8 && y < 8 || x < 8 && y >= N - 8) on = false;else on = (x * 3 + y * 7 + x * y) % 5 === 0;
    if (on) rects.push(/*#__PURE__*/React.createElement("rect", {
      key: x + "-" + y,
      x: x * cell,
      y: y * cell,
      width: cell,
      height: cell,
      fill: "#0a0a0a"
    }));
  }
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: `0 0 ${size} ${size}`,
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("rect", {
    width: size,
    height: size,
    fill: "#fff"
  }), rects);
}

// share bottom-sheet — brand mark + QR + promo + copy / share
function RrShareSheet({
  open,
  onClose,
  code,
  accent
}) {
  const [mounted, setMounted] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      const r = requestAnimationFrame(() => setMounted(true));
      return () => cancelAnimationFrame(r);
    }
    setMounted(false);
    setCopied(false);
  }, [open]);
  if (!open) return null;
  const link = "play.pokerdot.com/r/" + code; /* один домен із екраном запрошення */
  const copy = () => {
    try {
      navigator.clipboard && navigator.clipboard.writeText(link);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (window.playClick) window.playClick(1100, 0.04);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 70,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,.62)",
      backdropFilter: "blur(3px)",
      WebkitBackdropFilter: "blur(3px)",
      opacity: mounted ? 1 : 0,
      transition: "opacity .3s"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "#141418",
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      padding: "12px 20px calc(26px + env(safe-area-inset-bottom))",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform .34s cubic-bezier(.2,.8,.2,1)",
      borderTop: "1px solid rgba(255,255,255,.13)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 38,
      height: 4,
      borderRadius: 2,
      background: "rgba(255,255,255,.2)",
      margin: "0 auto 2px"
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      position: "absolute",
      top: 14,
      right: 16,
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: "rgba(255,255,255,.13)",
      border: 0,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-pokerdot.svg",
    alt: "PokerDot",
    style: {
      height: 26,
      width: "auto",
      display: "block"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 12,
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 14px 34px rgba(0,0,0,.55)"
    }
  }, /*#__PURE__*/React.createElement(RrQR, {
    size: 148
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 16,
      fontFamily: RR_MONO,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "SCAN QR CODE"), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      marginTop: 9,
      fontFamily: RR_SANS,
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.5,
      color: "#D8D8DF",
      padding: "0 4px"
    }
  }, "Sign up with this link and make a first deposit \\u2014 you get a ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#f0c75e",
      fontWeight: 700
    }
  }, "100% bonus"), ", and your friend gets a gift."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: copy,
    style: {
      flex: 1,
      padding: "15px 0",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: accent,
      color: "#fff",
      boxShadow: `0 10px 24px ${accent}66`,
      fontFamily: RR_SANS,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".08em"
    }
  }, copied ? "LINK COPIED" : "COPY REFERRAL LINK"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, .04);
      const url = "https://" + link;
      const data = {
        title: "PokerDot",
        text: "Join me on PokerDot \u2014 spin the wheel and grab your bonus.",
        url
      };
      if (navigator.share) {
        try {
          navigator.share(data);
          return;
        } catch (e) {}
      }
      try {
        navigator.clipboard && navigator.clipboard.writeText(url);
      } catch (e) {}
    },
    "aria-label": "Share referral link",
    style: {
      flex: "none",
      width: 52,
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,.16)",
      background: "rgba(255,255,255,.075)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "1.9",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "5",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "12",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "19",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"
  }))))));
}

// ── Друзі, яких запросив гравець ────────────────────────────────────────
// Два статуси, як у реальній воронці: зареєструвався за посиланням і
// зробив перший депозит. Депозит = виконана умова = нарахований спін.
const RR_AVA = ["assets/chat/drebin.webp", "assets/chat/girl.webp", "assets/chat/yanu.webp", "assets/chat/sponge.webp"];
const RR_FRIENDS = [{
  id: 1,
  nick: "MingTilt",
  ava: 0,
  dep: 250,
  days: 1
}, {
  id: 2,
  nick: "rivr_rat",
  ava: 1,
  dep: 0,
  days: 1
}, {
  id: 3,
  nick: "gtoWizard",
  ava: 2,
  dep: 1000,
  days: 2
}, {
  id: 4,
  nick: "donk_99",
  ava: 3,
  dep: 0,
  days: 3
}, {
  id: 5,
  nick: "calling_stn",
  ava: 1,
  dep: 50,
  days: 4
}, {
  id: 6,
  nick: "TheNit",
  ava: 0,
  dep: 0,
  days: 6
}, {
  id: 7,
  nick: "felt_lord",
  ava: 2,
  dep: 0,
  days: 8
}, {
  id: 8,
  nick: "snapcall",
  ava: 3,
  dep: 120,
  days: 11
}, {
  id: 9,
  nick: "limpKing",
  ava: 1,
  dep: 0,
  days: 15
}, {
  id: 10,
  nick: "coolerz",
  ava: 0,
  dep: 0,
  days: 21
}];
const rrAgo = d => d <= 1 ? "TODAY" : d === 2 ? "YESTERDAY" : d + " DAYS AGO";
const rrMoney = v => window.TS_MONEY ? window.TS_MONEY.money(v, 1) : "$" + v;
function RrFriendsScreen({
  open,
  onClose,
  onInvite,
  accent
}) {
  const [seg, setSeg] = React.useState("all");
  if (!open) return null;
  const all = RR_FRIENDS;
  const dep = all.filter(f => f.dep > 0),
    reg = all.filter(f => !f.dep);
  const list = seg === "dep" ? dep : seg === "reg" ? reg : all;
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, .04);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 40,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      animation: "px-up 360ms cubic-bezier(0.2,0.8,0.2,1) both"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.035) 0.7px, transparent 1.1px)",
      backgroundSize: "22px 22px",
      maskImage: "radial-gradient(ellipse 90% 55% at 50% 22%, #000 30%, transparent 78%)",
      WebkitMaskImage: "radial-gradient(ellipse 90% 55% at 50% 22%, #000 30%, transparent 78%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      paddingTop: 54,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
      onClose();
    },
    style: {
      width: 38,
      height: 38,
      borderRadius: "50%",
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.1)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
      flex: 1,
      textAlign: "center",
      fontFamily: RR_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "MY FRIENDS"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      overflowY: "auto",
      WebkitOverflowScrolling: "touch",
      padding: "6px 14px calc(110px + env(safe-area-inset-bottom))"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      gap: 8
    }
  }, [["INVITED", all.length, "#fff"], ["DEPOSITED", dep.length, "#5BD96A"], ["SPINS EARNED", dep.length, accent]].map(([k, v, c]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      borderRadius: 14,
      background: "#0f0f13",
      border: "1px solid rgba(255,255,255,.08)",
      padding: "12px 12px 11px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR_SANS,
      fontWeight: 700,
      fontSize: 9.5,
      color: "#8A8A93",
      letterSpacing: ".16em",
      whiteSpace: "nowrap"
    }
  }, k), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      fontFamily: RR_MONO,
      fontWeight: 700,
      fontSize: 20,
      lineHeight: 1,
      color: c,
      fontVariantNumeric: "tabular-nums",
      whiteSpace: "nowrap"
    }
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      fontFamily: RR_SANS,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.5,
      color: "#8A8A93",
      textWrap: "pretty"
    }
  }, "You get one spin for each friend \u2014 it is credited the moment they make their first deposit."), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "16px 0 12px",
      display: "flex",
      background: "#131317",
      borderRadius: 125,
      padding: 3
    }
  }, [["all", "ALL", all.length], ["dep", "DEPOSITED", dep.length], ["reg", "NO DEPOSIT", reg.length]].map(([id, lbl, n]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => {
      click(1000);
      setSeg(id);
    },
    style: {
      flex: 1,
      padding: "9px 0",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      whiteSpace: "nowrap",
      background: seg === id ? accent : "transparent",
      color: seg === id ? "#fff" : "rgba(255,255,255,.5)",
      fontFamily: RR_SANS,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".08em",
      transition: "background 160ms"
    }
  }, lbl, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .7
    }
  }, n)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, list.map(f => {
    const ok = f.dep > 0,
      c = ok ? "#5BD96A" : "#A9A9B2";
    return /*#__PURE__*/React.createElement("div", {
      key: f.id,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "11px 12px",
        borderRadius: 14,
        background: ok ? "linear-gradient(150deg, rgba(91,217,106,.10) 0%, #0f0f13 55%)" : "#0f0f13",
        border: `1px solid ${ok ? "rgba(91,217,106,.28)" : "rgba(255,255,255,.08)"}`
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "relative",
        flex: "none",
        width: 42,
        height: 42
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: RR_AVA[f.ava],
      alt: "",
      style: {
        width: 42,
        height: 42,
        borderRadius: "50%",
        objectFit: "cover",
        border: `1.5px solid ${ok ? "#5BD96A" : "rgba(255,255,255,.18)"}`
      },
      onError: e => {
        e.currentTarget.style.visibility = "hidden";
      }
    }), ok && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        right: -2,
        bottom: -2,
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: "#5BD96A",
        border: "2px solid #0f0f13",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#08080A",
      strokeWidth: "3.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M4 12.5l5.5 5.5L20 6.5"
    })))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: {
        fontFamily: RR_MONO,
        fontWeight: 700,
        fontSize: 13,
        color: "#fff",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, f.nick), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: c
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: RR_SANS,
        fontWeight: 700,
        fontSize: 9.5,
        letterSpacing: ".1em",
        color: c,
        whiteSpace: "nowrap"
      }
    }, ok ? "DEPOSITED" : "SIGNED UP"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: RR_SANS,
        fontWeight: 600,
        fontSize: 9.5,
        letterSpacing: ".06em",
        color: "#6A6A72",
        whiteSpace: "nowrap"
      }
    }, "\xB7 ", rrAgo(f.days)))), ok ? /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 30,
        padding: "0 11px",
        borderRadius: 125,
        background: "rgba(91,217,106,.12)",
        border: "1px solid rgba(91,217,106,.35)"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "12",
      height: "12",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#5BD96A",
      strokeWidth: "2.4",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "8.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: RR_MONO,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: ".06em",
        color: "#5BD96A",
        whiteSpace: "nowrap"
      }
    }, "+1 SPIN")) : /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        fontFamily: RR_SANS,
        fontWeight: 700,
        fontSize: 9.5,
        letterSpacing: ".1em",
        color: "#6A6A72",
        textAlign: "right",
        lineHeight: 1.35,
        maxWidth: 74
      }
    }, "SPIN AFTER DEPOSIT"));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 6,
      padding: "16px 14px calc(26px + env(safe-area-inset-bottom))",
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.96) 28%, #000)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1300);
      onInvite();
    },
    style: Object.assign(UI.btn("xl", "primary", accent), {
      width: "100%"
    })
  }, "INVITE MORE FRIENDS")));
}
function ReferralRewards({
  open = true,
  onClose,
  accent = "#D71921"
}) {
  const [tab, setTab] = React.useState("wheel");
  const [mounted, setMounted] = React.useState(false);
  const [spinsLeft, setSpinsLeft] = React.useState(2);
  React.useEffect(() => {
    if (!open) {
      setMounted(false);
      return;
    }
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [friendsOpen, setFriendsOpen] = React.useState(false); // екран «Мои друзья»
  React.useEffect(() => {
    if (!open) setFriendsOpen(false);
  }, [open]);
  const [rot, setRot] = React.useState(0);
  const [spinning, setSpinning] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const chosenRef = React.useRef(0);
  const CODE = "11321435";
  const canSpin = spinsLeft > 0 && !spinning;
  const doSpin = () => {
    if (!canSpin) return;
    if (window.playClick) window.playClick(1300, 0.05);
    const k = Math.floor(Math.random() * RR_FACES.length);
    chosenRef.current = k;
    const center = k * RR_SEG + RR_SEG / 2;
    const cur = (rot % 360 + 360) % 360;
    const desired = (360 - center) % 360;
    const delta = (desired - cur + 360) % 360;
    setResult(null);
    setSpinning(true);
    setRot(r => r + 360 * 5 + delta);
  };
  const onSpinEnd = () => {
    if (!spinning) return;
    setSpinning(false);
    setSpinsLeft(n => Math.max(0, n - 1));
    setResult(RR_FACES[chosenRef.current]);
    if (window.playClick) {
      window.playClick(1900, 0.05);
      setTimeout(() => window.playClick(2200, 0.06), 110);
    }
  };
  const Rule = ({
    children
  }) => /*#__PURE__*/React.createElement("li", {
    style: {
      display: "flex",
      gap: 10,
      marginBottom: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      marginTop: 6,
      width: 5,
      height: 5,
      borderRadius: "50%",
      background: accent,
      boxShadow: `0 0 6px ${accent}`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR_SANS,
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.5,
      color: "#A9A9B2"
    }
  }, children));
  const TierRow = ({
    k,
    v,
    red,
    info
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 5,
      fontFamily: RR_SANS,
      fontWeight: 500,
      fontSize: 11,
      color: "#A9A9B2"
    }
  }, k, info && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.4)",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 11v5M12 8h.01"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR_MONO,
      fontWeight: 700,
      fontSize: 14,
      color: red ? accent : "#fff"
    }
  }, v));
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "#000",
      display: "flex",
      flexDirection: "column",
      fontFamily: RR_SANS,
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 360ms cubic-bezier(0.2,0.8,0.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.035) 0.7px, transparent 1.1px)",
      backgroundSize: "22px 22px",
      maskImage: "radial-gradient(ellipse 90% 55% at 50% 22%, #000 30%, transparent 78%)",
      WebkitMaskImage: "radial-gradient(ellipse 90% 55% at 50% 22%, #000 30%, transparent 78%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 2,
      paddingTop: 54,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
    onClick: onClose,
    style: {
      width: 38,
      height: 38,
      borderRadius: "50%",
      background: "rgba(255,255,255,.085)",
      border: "1px solid rgba(255,255,255,.1)",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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
      maxWidth: "100%",
      flex: 1,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: RR_MONO,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "REFERRAL REWARDS"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "REFERRAL REWARDS",
    accent: accent
  }) : null), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      margin: "4px 14px 0",
      display: "flex",
      background: "#131317",
      borderRadius: 125,
      padding: 3
    }
  }, [["wheel", "FORTUNE WHEEL"], ["records", "FRIEND ROYALE"]].map(([id, lbl]) => /*#__PURE__*/React.createElement("button", {
    key: id,
    onClick: () => {
      setTab(id);
      if (window.playClick) window.playClick(1000, 0.03);
    },
    style: {
      flex: 1,
      padding: "10px 0",
      borderRadius: 125,
      border: 0,
      cursor: "pointer",
      background: tab === id ? accent : "transparent",
      color: tab === id ? "#fff" : "rgba(255,255,255,.5)",
      fontFamily: RR_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".1em",
      transition: "background 160ms"
    }
  }, lbl))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      zIndex: 2,
      flex: 1,
      overflowY: "auto",
      padding: "16px 14px calc(96px + env(safe-area-inset-bottom))"
    }
  }, tab === "wheel" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "18px 0 8px",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(RrHeroWheel, {
    accent: accent,
    rot: rot,
    spinning: spinning,
    onEnd: onSpinEnd,
    onSpin: doSpin,
    canSpin: canSpin
  })), (() => {
    const dep = RR_FRIENDS.filter(f => f.dep > 0).length;
    return /*#__PURE__*/React.createElement("button", {
      onClick: () => {
        if (window.playClick) window.playClick(1150, .04);
        setFriendsOpen(true);
      },
      style: {
        width: "100%",
        boxSizing: "border-box",
        marginTop: 14,
        textAlign: "left",
        cursor: "pointer",
        borderRadius: 14,
        background: "#0f0f13",
        border: "1px solid rgba(255,255,255,.08)",
        padding: "12px 12px 12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        display: "flex"
      }
    }, RR_FRIENDS.slice(0, 3).map((f, i) => /*#__PURE__*/React.createElement("img", {
      key: f.id,
      src: RR_AVA[f.ava],
      alt: "",
      style: {
        width: 30,
        height: 30,
        borderRadius: "50%",
        objectFit: "cover",
        border: "2px solid #0f0f13",
        marginLeft: i ? -10 : 0,
        position: "relative",
        zIndex: 3 - i
      },
      onError: e => {
        e.currentTarget.style.visibility = "hidden";
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "block",
        fontFamily: RR_SANS,
        fontWeight: 700,
        fontSize: 10.5,
        color: "#A9A9B2",
        letterSpacing: ".14em"
      }
    }, "MY FRIENDS"), /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "baseline",
        gap: 8,
        marginTop: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: RR_MONO,
        fontWeight: 700,
        fontSize: 22,
        lineHeight: 1,
        color: "#fff"
      }
    }, RR_FRIENDS.length), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: RR_SANS,
        fontWeight: 600,
        fontSize: 10.5,
        color: "#5BD96A",
        letterSpacing: ".04em",
        whiteSpace: "nowrap"
      }
    }, `${dep} made a deposit`))), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 30,
        height: 30,
        borderRadius: "50%",
        background: `${accent}1f`,
        border: `1px solid ${accent}66`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "14",
      height: "14",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: accent,
      strokeWidth: "2.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 6l6 6-6 6"
    }))));
  })(), /*#__PURE__*/React.createElement("button", {
    onClick: doSpin,
    disabled: !canSpin,
    style: {
      position: "relative",
      width: "100%",
      boxSizing: "border-box",
      marginTop: 10,
      height: 54,
      borderRadius: 125,
      border: 0,
      cursor: canSpin ? "pointer" : "default",
      background: canSpin ? `linear-gradient(180deg, ${accent} 0%, ${RR_DEEP} 100%)` : "rgba(255,255,255,.08)",
      color: canSpin ? "#fff" : "rgba(255,255,255,.4)",
      boxShadow: canSpin ? `0 12px 28px ${accent}55, inset 0 1px 0 rgba(255,255,255,.18)` : "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: RR_SANS,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".14em"
    }
  }, spinning ? "SPINNING" : "SPIN NOW", /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 11,
      top: "50%",
      transform: "translateY(-50%)",
      width: 32,
      height: 32,
      borderRadius: "50%",
      background: canSpin ? "#fff" : "rgba(255,255,255,.12)",
      color: canSpin ? accent : "rgba(255,255,255,.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: RR_MONO,
      fontWeight: 700,
      fontSize: 14,
      lineHeight: 1,
      fontVariantNumeric: "tabular-nums",
      boxShadow: canSpin ? "0 2px 8px rgba(0,0,0,.35)" : "none"
    }
  }, spinsLeft)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR_MONO,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".14em",
      marginBottom: 12
    }
  }, "FORTUNE WHEEL RULES"), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      margin: 0,
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Rule, null, "Share your referral link with a new player. They can spin the wheel once and claim their reward after registering and logging in with your link."), /*#__PURE__*/React.createElement(Rule, null, "For each new player you successfully refer, you earn one spin. Max 5 spins per day. Only one referral per device counts, to prevent abuse."))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      borderRadius: 14,
      background: "#0f0f13",
      padding: "14px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR_SANS,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, "REFERRAL CODE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR_MONO,
      fontWeight: 700,
      fontSize: 20,
      color: accent,
      letterSpacing: ".08em",
      marginTop: 3,
      fontVariantNumeric: "tabular-nums"
    }
  }, CODE)), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setShareOpen(true);
      if (window.playClick) window.playClick(1100, 0.04);
    },
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: "10px 15px",
      borderRadius: 125,
      background: "rgba(255,255,255,.075)",
      border: "1px solid rgba(255,255,255,.16)",
      color: "#fff",
      cursor: "pointer",
      fontFamily: RR_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".08em"
    }
  }, "COPY", /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "rgba(255,255,255,.8)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "9",
    width: "11",
    height: "11",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 15V5a2 2 0 0 1 2-2h10"
  }))))) :
  /*#__PURE__*/
  /* Friend Royale — the referral leaderboard, same board as Competitions */
  React.createElement(React.Fragment, null, window.RoyaleBoard ? /*#__PURE__*/React.createElement(window.RoyaleBoard, {
    accent: accent
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: RR_SANS,
      fontSize: 12,
      color: "#A9A9B2"
    }
  }, "Leaderboard unavailable."))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 3,
      paddingBottom: 22,
      paddingTop: 8,
      background: "linear-gradient(180deg, transparent 0%, rgba(0,0,0,.85) 30%, #000 100%)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      margin: "0 12px",
      padding: "6px 8px",
      borderRadius: 20,
      background: "rgba(20,20,22,.85)",
      backdropFilter: "blur(16px) saturate(140%)",
      WebkitBackdropFilter: "blur(16px) saturate(140%)",
      border: "1px solid rgba(255,255,255,.085)",
      boxShadow: "0 12px 24px rgba(0,0,0,.5)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }
  }, [{
    id: "profile",
    label: "DotCenter",
    icon: "profile"
  }, {
    id: "rewards",
    label: "REWARDS",
    icon: "missions",
    on: true
  }, {
    id: "play",
    label: "PLAY",
    icon: "play"
  }, {
    id: "wallet",
    label: "WALLET",
    icon: "cashier"
  }, {
    id: "settings",
    label: "SETTINGS",
    icon: "gear"
  }].map(function (d) {
    if (d.id === "play") return /*#__PURE__*/React.createElement("div", {
      key: "play",
      style: {
        flex: 1,
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: onClose,
      style: {
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#000",
        border: `1.5px solid ${accent}`,
        cursor: "pointer",
        display: "grid",
        placeItems: "center",
        padding: 0,
        boxShadow: `0 0 26px ${accent}66, 0 10px 24px rgba(0,0,0,.85)`,
        position: "relative"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        inset: -6,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${accent}3d 0%, transparent 72%)`,
        pointerEvents: "none"
      }
    }), window.PxMark ? /*#__PURE__*/React.createElement(window.PxMark, {
      size: 30,
      dot: "#E01F20"
    }) : /*#__PURE__*/React.createElement(RrDockIcon, {
      kind: "play"
    })));
    const col = d.locked ? "#6A6A72" : d.on ? accent : "rgba(255,255,255,.4)";
    return /*#__PURE__*/React.createElement("div", {
      key: d.id,
      style: {
        flex: 1,
        display: "flex",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement("button", {
      onClick: d.locked ? undefined : onClose,
      style: {
        position: "relative",
        background: "transparent",
        border: 0,
        cursor: d.locked ? "default" : "pointer",
        padding: "8px 10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        opacity: d.locked ? .42 : 1
      }
    }, d.locked && /*#__PURE__*/React.createElement("svg", {
      width: "9",
      height: "9",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#6A6A72",
      strokeWidth: "2.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        position: "absolute",
        top: -1,
        right: 4
      }
    }, /*#__PURE__*/React.createElement("rect", {
      x: "4.5",
      y: "10.5",
      width: "15",
      height: "10.5",
      rx: "2.4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 10.5V7.6a4 4 0 0 1 8 0v2.9"
    })), /*#__PURE__*/React.createElement(RrDockIcon, {
      kind: d.icon,
      color: col
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: RR_SANS,
        fontWeight: 600,
        fontSize: 10.5,
        letterSpacing: ".08em",
        whiteSpace: "nowrap",
        color: d.locked ? "#6A6A72" : d.on ? accent : "#A9A9B2"
      }
    }, d.label)));
  }))), /*#__PURE__*/React.createElement(RrFriendsScreen, {
    open: friendsOpen,
    accent: accent,
    onClose: () => setFriendsOpen(false),
    onInvite: () => {
      setFriendsOpen(false);
      setShareOpen(true);
    }
  }), result && /*#__PURE__*/React.createElement("div", {
    onClick: () => setResult(null),
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 66,
      background: "rgba(0,0,0,.55)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 28,
      animation: "pp-fadeIn .2s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 296,
      borderRadius: 20,
      padding: "28px 22px",
      textAlign: "center",
      background: "#fff",
      boxShadow: "0 30px 70px rgba(0,0,0,.5)",
      animation: "pp-rise .35s ease"
    }
  }, (() => {
    const ty = result.short === "Thank You";
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: RR_SANS,
        fontWeight: 700,
        fontSize: 10.5,
        color: ty ? "rgba(0,0,0,.4)" : accent,
        letterSpacing: ".22em"
      }
    }, ty ? "BETTER LUCK NEXT TIME" : "YOU WON"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: RR_MONO,
        fontWeight: 700,
        fontSize: 22,
        color: "#0a0a0a",
        marginTop: 12,
        lineHeight: 1.2
      }
    }, result.short), !ty && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: RR_SANS,
        fontWeight: 500,
        fontSize: 12,
        color: "rgba(0,0,0,.5)",
        marginTop: 8
      }
    }, "Added to your account"), /*#__PURE__*/React.createElement("button", {
      onClick: () => setResult(null),
      style: {
        marginTop: 22,
        width: "100%",
        padding: "14px 0",
        borderRadius: 125,
        background: accent,
        color: "#fff",
        border: 0,
        cursor: "pointer",
        boxShadow: `0 12px 26px ${accent}66`,
        fontFamily: RR_SANS,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: ".1em"
      }
    }, ty ? "OK" : "CLAIM"));
  })())), /*#__PURE__*/React.createElement(RrShareSheet, {
    open: shareOpen,
    onClose: () => setShareOpen(false),
    code: CODE,
    accent: accent
  }));
}
Object.assign(window, {
  ReferralRewards
});
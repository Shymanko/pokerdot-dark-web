function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// PlayFlow — fullscreen red expansion + iOS-wheel-picker + tile pickers.
// Triggered when user taps the dock Play button.
// Flow: MODE (cash/tournament) → DISCIPLINE → STAKES (cash) → BUY-IN

const MONO = UI.font;

// ─── Static data ─────────────────────────────────────────────────────────
// Cash games only — no tournaments.
const DISCIPLINES = ["FLASH & FLUSH", "SPIN & WIN", "HOLD'EM", "PLO", "PLO 5", "PLO 6", "SHORT DECK"];
const DISCIPLINE_ICON = {
  "FLASH & FLUSH": "flash",
  "SPIN & WIN": "spin",
  "HOLD'EM": "holdem",
  "PLO": "plo",
  "PLO 5": "plo",
  "PLO 6": "plo",
  "SHORT DECK": "ofc"
};
const CASH_STAKES = ["5/10", "10/20", "25/50", "50/100", "100/200", "200/500"];

// Live traffic per stake — players online + open tables + 0..10 load level.
// (Numbers shift slightly on each open via the jitter pass below.)
const STAKES_TRAFFIC = {
  "5/10": {
    players: 1247,
    tables: 87,
    load: 10
  },
  "10/20": {
    players: 892,
    tables: 56,
    load: 9
  },
  "25/50": {
    players: 523,
    tables: 34,
    load: 7
  },
  "50/100": {
    players: 318,
    tables: 21,
    load: 6
  },
  "100/200": {
    players: 156,
    tables: 11,
    load: 4
  },
  "200/500": {
    players: 64,
    tables: 4,
    load: 2
  }
};

// Cash buy-in slider config (min/max/step)
const BUYIN_MIN = 500;
const BUYIN_MAX = 5000;
const BUYIN_STEP = 50;
const DISCIPLINE_INFO = {
  "FLASH & FLUSH": {
    desc: "Fast-fold poker. Fold and you're instantly moved to a new table with a fresh hand — no waiting. Maximum hands per hour.",
    rules: ["Fold = instant new table & new hand", "Hold'em rules, turbo pace", "No waiting on other players", "Built for high-volume grinding"]
  },
  "SPIN & WIN": {
    desc: "3-handed hyper-turbo. A wheel spins before each game to set the prize — up to 1 000× your buy-in. Win it all in minutes.",
    rules: ["3 players, winner takes all", "Prize randomized by the spin (up to 1000×)", "Hyper-turbo blinds", "Games last 3–5 minutes"]
  },
  "HOLD'EM": {
    desc: "Texas Hold'em is the most-played poker variant. You get 2 hole cards, share 5 community cards, and make the best 5-card hand.",
    rules: ["2 hole cards dealt face-down", "5 community cards (flop, turn, river)", "Four betting rounds", "Best 5-card combo wins"]
  },
  "PLO": {
    desc: "Pot-Limit Omaha. Bigger pots, bigger draws, bigger swings. You must use exactly 2 of your 4 hole cards.",
    rules: ["4 hole cards dealt", "Must use exactly 2 hole + 3 community", "Pot-limit betting (no all-in unless covered)", "Stronger hands than Texas Hold'em — flushes/sets common"]
  },
  "PLO 5": {
    desc: "PLO with 5 hole cards. Even more drawing equity, even crazier action. Same rules, but every starting hand has potential.",
    rules: ["5 hole cards dealt", "Use exactly 2 of 5 hole + 3 community", "Pot-limit betting", "Avg pot is ~25% bigger than 4-card PLO"]
  },
  "PLO 6": {
    desc: "PLO with 6 hole cards — peak chaos. Almost any hand can connect. For seasoned PLO players only.",
    rules: ["6 hole cards dealt", "Use exactly 2 of 6 hole + 3 community", "Pot-limit betting", "Variance is highest in this format"]
  },
  "SHORT DECK": {
    desc: "Hold'em with cards 2 through 5 removed (36-card deck). Flushes beat full houses. Aces play low for straights.",
    rules: ["36-card deck (6 to A)", "Flush > Full House (cards rarer)", "Straight: A-6-7-8-9 is the lowest", "Sets and straights hit much more often"]
  }
};

// ─── Cash formats — one flat wheel, no category grouping ─────────────────
// All formats are shown at once under their plain names (no "Classic Poker"
// wrapper, no hidden "Other formats" bucket). Spin & Win is its own lobby and
// is not part of this cash flow.
const CASH_FORMATS = ["HOLD'EM", "PLO 5", "PLO 6", "SHORT DECK", "FLASH & FLUSH"];

// ─── Entry tiers — "how much?" as buy-in ranges (min–max, max = 5× min) ──
const ENTRY_TIERS = [{
  min: 1,
  max: 5,
  label: "EASY"
}, {
  min: 2,
  max: 10,
  label: "REGULAR"
}, {
  min: 4,
  max: 20,
  label: "SERIOUS"
}, {
  min: 10,
  max: 50,
  label: "BIG"
}, {
  min: 20,
  max: 100,
  label: "HIGH"
}, {
  min: 40,
  max: 200,
  label: "HIGH ROLLER"
}, {
  min: 80,
  max: 400,
  label: "NOSEBLEED"
}];
const VIP_TIER = 5; // tier index ≥ this flips the animated VIP backdrop on

const BLIND_LEVELS = [[0.01, 0.02], [0.02, 0.05], [0.05, 0.10], [0.10, 0.25], [0.25, 0.50], [0.50, 1], [1, 2], [2, 5], [5, 10], [10, 25], [25, 50], [50, 100]];
function fmtBlind(n) {
  return n >= 1 ? String(n) : n.toFixed(2);
}
function blindsFor(amount) {
  const targetBB = amount / 100;
  let best = BLIND_LEVELS[0];
  for (const lv of BLIND_LEVELS) {
    if (Math.abs(lv[1] - targetBB) < Math.abs(best[1] - targetBB)) best = lv;
  }
  return `${fmtBlind(best[0])}/${fmtBlind(best[1])}`;
}

// ─── Step builder — format → entry ───────────────────────────────────────
// One flow for every cash format: pick the format, then the table limit.
function buildSteps() {
  return [{
    key: "format",
    title: "PLAY",
    kind: "format"
  }, {
    key: "entry",
    title: "TABLE LIMIT",
    kind: "entry"
  }];
}

// Dry picker detent: original synthesized sound, no sample downloads or audio API.
// One shared context; no deferred bursts, no playback on opening the career screen.
window.cmCardWheelAudio = (() => {
  const buffers = new WeakMap(),
    voices = new Set();
  let last = -Infinity;
  const prefs = () => window.pxSoundPrefs || {
    enabled: true,
    volume: .7
  };
  const prepare = () => {
    try {
      if (!prefs().enabled || prefs().volume <= 0) return null;
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return null;
      const ctx = window.__ppAudioCtx && window.__ppAudioCtx.state !== 'closed' ? window.__ppAudioCtx : window.__ppAudioCtx = new Audio({
        latencyHint: 'interactive'
      });
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      return ctx;
    } catch (_) {
      return null;
    }
  };
  // A felt-damped pawl: a tiny broadband strike plus two fast-decaying resonances.
  const samples = rate => {
    const data = new Float32Array(Math.ceil(rate * .028));
    let seed = 7183,
      previous = 0;
    for (let i = 0; i < data.length; i++) {
      const t = i / rate;
      seed = 1664525 * seed + 1013904223 >>> 0;
      const white = seed / 2147483648 - 1;
      const soft = previous * .52 + white * .48;
      previous = soft;
      const strike = soft * Math.exp(-t / .0019) * .75;
      const body = Math.sin(2 * Math.PI * 1750 * t) * Math.exp(-t / .0036) * .37;
      const shell = Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t / .0017) * .13;
      const seat = Math.sin(2 * Math.PI * 720 * t) * Math.exp(-t / .005) * .2;
      data[i] = (strike + body + shell + seat) * Math.min(1, t / .00025) * Math.min(1, (.028 - t) / .003);
    }
    return data;
  };
  const stop = () => {
    for (const v of voices) {
      try {
        v.stop();
      } catch (_) {}
    }
    voices.clear();
    last = -Infinity;
  };
  const play = direction => {
    try {
      const ctx = prepare();
      if (!ctx || ctx.state !== 'running' || document.hidden) return;
      const now = ctx.currentTime;
      if (now - last < .032) return; // Skip compressed detents rather than queue a rattle after release.
      const fast = now - last < .09;
      last = now;
      let buffer = buffers.get(ctx);
      if (!buffer) {
        buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * .028), ctx.sampleRate);
        buffer.copyToChannel(samples(ctx.sampleRate), 0);
        buffers.set(ctx, buffer);
      }
      const source = ctx.createBufferSource(),
        gain = ctx.createGain();
      source.buffer = buffer;
      source.playbackRate.value = direction < 0 ? .97 : 1;
      gain.gain.value = Math.max(0, Math.min(1, prefs().volume)) * (fast ? .23 : .3);
      source.connect(gain);
      gain.connect(ctx.destination);
      voices.add(source);
      source.onended = () => {
        source.disconnect();
        gain.disconnect();
        voices.delete(source);
      };
      source.start(now);
    } catch (_) {} // Audio must never interfere with card navigation.
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
  });
  return {
    prepare,
    play,
    stop,
    samples
  };
})();

// ─── tick sound — Web Audio square wave click ────────────────────────────
function playClick(freq = 1400, dur = 0.045) {
  try {
    if (window.pxSoundPrefs?.enabled === false || window.pxSoundPrefs?.volume === 0) return;
    const ctx = window.__ppAudioCtx || (window.__ppAudioCtx = new (window.AudioContext || window.webkitAudioContext)());
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    // warm, soft "tock": triangle wave through a low-pass, gentle attack/release.
    const f = Math.max(150, Math.min(760, freq * 0.42));
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 950;
    lp.Q.value = 0.6;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(f, now);
    osc.frequency.exponentialRampToValueAtTime(f * 0.84, now + dur + 0.04);
    const peak = 0.05 * (window.pxSoundPrefs?.volume ?? .7) / .7;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.007); // soft attack (no pop)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur + 0.07); // smooth tail
    osc.connect(lp);
    lp.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + dur + 0.12);
  } catch (e) {}
}

// ─── Inline cash-icon (chip stack) — used in mode tiles ──────────────────
function CashIcon({
  size = 42,
  color = "#0a0a0a"
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: color,
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "16",
    cy: "9",
    rx: "9",
    ry: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 9v5c0 1.7 4 3 9 3s9-1.3 9-3V9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 14v5c0 1.7 4 3 9 3s9-1.3 9-3v-5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 19v5c0 1.7 4 3 9 3s9-1.3 9-3v-5"
  }));
}

// ─── Mode picker — 2 big tiles side-by-side ──────────────────────────────
function ModeTiles({
  items,
  selectedIdx,
  onSelect
}) {
  const ModeIconRef = window.ModeIcon;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12,
      width: 300,
      margin: "0 auto"
    }
  }, items.map((label, i) => {
    const opt = MODE_OPTIONS[i];
    const on = i === selectedIdx;
    const Icon = opt.icon === "cash" ? CashIcon : props => ModeIconRef && /*#__PURE__*/React.createElement(ModeIconRef, _extends({
      kind: opt.icon
    }, props));
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      onClick: () => {
        playClick(1100, 0.04);
        onSelect(i);
      },
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
        appearance: "none",
        outline: "none",
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        border: "none",
        borderRadius: 16,
        padding: 14,
        height: 140,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        cursor: "pointer",
        transition: "transform 100ms ease",
        boxShadow: on ? `0 0 0 3px ${ARC}, 0 10px 24px rgba(0,0,0,.5)` : "0 6px 14px rgba(0,0,0,.3)"
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      size: 44,
      color: "#0a0a0a"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO,
        fontSize: 16,
        fontWeight: 700,
        color: "#0a0a0a",
        letterSpacing: ".04em",
        lineHeight: 1
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: UI.fontUI,
        fontWeight: 600,
        fontSize: 10.5,
        color: "rgba(0,0,0,.5)",
        letterSpacing: ".18em",
        marginTop: 6
      }
    }, opt.sub)));
  }));
}

// ─── Discipline picker — 2-col compact tiles ─────────────────────────────
function DisciplineTiles({
  items,
  selectedIdx,
  onSelect
}) {
  const ModeIconRef = window.ModeIcon;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8,
      width: 300,
      margin: "0 auto",
      maxHeight: 320,
      overflowY: "auto",
      scrollbarWidth: "none",
      paddingTop: 4,
      paddingBottom: 4
    }
  }, items.map((item, i) => {
    const on = i === selectedIdx;
    return /*#__PURE__*/React.createElement("button", {
      key: item,
      onClick: () => {
        playClick(1200, 0.04);
        onSelect(i);
      },
      onMouseDown: e => {
        e.currentTarget.style.transform = "scale(0.98)";
      },
      onMouseUp: e => {
        e.currentTarget.style.transform = "";
      },
      onMouseLeave: e => {
        e.currentTarget.style.transform = "";
      },
      onTouchStart: e => {
        e.currentTarget.style.transform = "scale(0.98)";
      },
      onTouchEnd: e => {
        e.currentTarget.style.transform = "";
      },
      style: {
        position: "relative",
        overflow: "hidden",
        background: "#fff",
        border: "1px solid transparent",
        borderRadius: 14,
        padding: "0 12px",
        height: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 6,
        cursor: "pointer",
        transition: "transform 100ms ease, box-shadow 200ms",
        boxShadow: on ? "0 0 0 2px #fff, 0 10px 22px rgba(0,0,0,.45)" : "0 4px 10px rgba(0,0,0,.28)"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        fontFamily: UI.fontUI,
        fontWeight: 700,
        fontSize: 12,
        color: "#0a0a0a",
        letterSpacing: ".05em",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    }, on && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: ARC,
        boxShadow: `0 0 8px ${ARC}`,
        flex: "none"
      }
    }), item), ModeIconRef && /*#__PURE__*/React.createElement(ModeIconRef, {
      kind: DISCIPLINE_ICON[item],
      size: 20,
      color: "#0a0a0a"
    }));
  }));
}

// ─── StakesWheel — iOS-style carousel + live player count for selected ───
// Same mechanic as WheelPicker (scroll-snap, click ticks, fade in/out),
// but each row is a rich pair: stake on the left, live players on the right.
function StakesWheel({
  items,
  valueIdx,
  onChange,
  redBg = "#D71921",
  fgColor = "#fff",
  rgb = "255,255,255",
  grad = null
}) {
  const FG = rgb;
  const SELC = fgColor;
  const ref = React.useRef(null);
  const lastRef = React.useRef(valueIdx);
  const [, force] = React.useState(0); // rerender on scroll so off-center sizes refresh

  // jitter players a touch on mount so it feels live (deterministic per open)
  const traffic = React.useMemo(() => {
    const out = {};
    for (const s of items) {
      const base = STAKES_TRAFFIC[s] || {
        players: 0
      };
      const drift = Math.round((Math.random() - 0.5) * base.players * 0.06);
      out[s] = {
        players: Math.max(0, base.players + drift)
      };
    }
    return out;
  }, [items]);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = valueIdx * ITEM_H;
      lastRef.current = valueIdx;
      force(n => n + 1);
    }
  }, [items]);
  const handleScroll = () => {
    if (!ref.current) return;
    const top = ref.current.scrollTop;
    const idx = Math.round(top / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    if (clamped !== lastRef.current) {
      lastRef.current = clamped;
      playClick();
      onChange(clamped);
    }
    force(n => n + 1);
  };
  const selected = items[lastRef.current];
  const selectedPlayers = traffic[selected]?.players ?? 0;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 320,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      height: VIEW * ITEM_H
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onScroll: handleScroll,
    style: {
      width: "100%",
      height: "100%",
      overflowY: "auto",
      scrollSnapType: "y mandatory",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch",
      maskImage: `linear-gradient(180deg, transparent 0%, #000 ${FADE_TOP}%, #000 ${FADE_BOTTOM}%, transparent 100%)`,
      WebkitMaskImage: `linear-gradient(180deg, transparent 0%, #000 ${FADE_TOP}%, #000 ${FADE_BOTTOM}%, transparent 100%)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: PAD,
      paddingBottom: PAD
    }
  }, items.map((stake, i) => {
    const dist = Math.abs(i - lastRef.current);
    const isOn = dist === 0;
    const players = traffic[stake]?.players ?? 0;
    const stakeSize = isOn ? 30 : dist === 1 ? 22 : 18;
    const stakeColor = isOn ? SELC : `rgba(${FG},${Math.max(0.18, 0.7 - dist * 0.18)})`;
    const playersOpacity = isOn ? 1 : dist === 1 ? 0.7 : dist === 2 ? 0.35 : 0;
    const rowVip = stake === "100/200" || stake === "200/500";
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => {
        if (ref.current) ref.current.scrollTop = i * ITEM_H;
      },
      style: {
        position: "relative",
        height: ITEM_H,
        scrollSnapAlign: "center",
        display: "grid",
        gridTemplateColumns: "1fr auto",
        alignItems: "center",
        padding: "0 22px",
        columnGap: 14,
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: 9
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: isOn && grad ? {
        fontFamily: MONO,
        fontSize: stakeSize,
        fontWeight: 700,
        letterSpacing: ".04em",
        whiteSpace: "nowrap",
        lineHeight: 1,
        transition: "font-size .15s",
        backgroundImage: grad,
        backgroundSize: "220% 100%",
        animation: "pp-foil 3.6s linear infinite",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
        WebkitTextFillColor: "transparent"
      } : {
        fontFamily: MONO,
        fontSize: stakeSize,
        fontWeight: isOn ? 700 : 400,
        color: stakeColor,
        letterSpacing: ".04em",
        transition: "font-size .15s, color .15s, font-weight .15s",
        whiteSpace: "nowrap",
        lineHeight: 1
      }
    }, window.cmBuyIn ? window.cmBuyIn.rangeK(stake) : stake), rowVip && /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        lineHeight: 1,
        fontSize: isOn ? 20 : 15,
        color: isOn ? "#fff" : "rgba(255,255,255,.55)",
        transition: "font-size .15s, color .15s"
      }
    }, "\u2605")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        gap: 6,
        opacity: playersOpacity,
        transition: "opacity .2s"
      }
    }, isOn && /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: SELC,
        boxShadow: `0 0 8px rgba(${FG},.9)`,
        animation: "pp-pulse 1.4s ease-in-out infinite",
        flex: "none"
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO,
        fontSize: isOn ? 15 : 12,
        fontWeight: isOn ? 700 : 500,
        color: isOn ? SELC : `rgba(${FG},.85)`,
        letterSpacing: ".02em",
        transition: "font-size .15s",
        lineHeight: 1
      }
    }, players.toLocaleString("en-US").split(",").join(" "))));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: PAD,
      left: 14,
      right: 14,
      height: ITEM_H,
      pointerEvents: "none",
      borderTop: `1px solid rgba(${FG},.32)`,
      borderBottom: `1px solid rgba(${FG},.32)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: PAD + ITEM_H + 4,
      right: 22,
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      color: `rgba(${FG},.55)`,
      letterSpacing: ".22em",
      pointerEvents: "none"
    }
  }, "PLAYERS ONLINE")));
}
Object.assign(window, {
  StakesWheel
});

// ─── BuyIn slider — drag to pick a value, click sound per step ───────────
function BuyInSlider({
  value,
  onChange,
  min = BUYIN_MIN,
  max = BUYIN_MAX,
  step = BUYIN_STEP,
  fgColor = "#fff",
  rgb = "255,255,255",
  grad = null
}) {
  const FG = rgb;
  const SELC = fgColor;
  const ref = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  const lastRef = React.useRef(value);
  const updateFromX = clientX => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(r.width, clientX - r.left));
    const frac = r.width > 0 ? x / r.width : 0;
    const raw = min + (max - min) * frac;
    const stepped = Math.round(raw / step) * step;
    const clamped = Math.max(min, Math.min(max, stepped));
    if (clamped !== lastRef.current) {
      lastRef.current = clamped;
      playClick(1100, 0.02);
      onChange(clamped);
    }
  };
  const startDrag = e => {
    e.preventDefault();
    setDragging(true);
    updateFromX(e.clientX);
    const move = ev => updateFromX(ev.clientX);
    const end = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
  };
  const pct = (value - min) / (max - min) * 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 290,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: grad ? {
      textAlign: "center",
      fontFamily: MONO,
      fontSize: 42,
      fontWeight: 700,
      letterSpacing: ".02em",
      marginBottom: 24,
      lineHeight: 1,
      backgroundImage: grad,
      backgroundSize: "220% 100%",
      animation: "pp-foil 3.6s linear infinite",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent",
      WebkitTextFillColor: "transparent"
    } : {
      textAlign: "center",
      fontFamily: MONO,
      fontSize: 42,
      fontWeight: 700,
      color: SELC,
      letterSpacing: ".02em",
      marginBottom: 24,
      lineHeight: 1,
      textShadow: "0 2px 14px rgba(0,0,0,.35)"
    }
  }, "$", value.toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onPointerDown: startDrag,
    style: {
      position: "relative",
      height: 36,
      cursor: "pointer",
      touchAction: "none"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: "50%",
      transform: "translateY(-50%)",
      height: 6,
      borderRadius: 3,
      background: `rgba(${FG},.18)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: "50%",
      transform: "translateY(-50%)",
      height: 6,
      borderRadius: 3,
      width: `${pct}%`,
      background: SELC,
      transition: dragging ? "none" : "width .15s ease"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: `${pct}%`,
      top: "50%",
      transform: "translate(-50%, -50%)",
      width: 28,
      height: 28,
      borderRadius: "50%",
      background: SELC,
      boxShadow: `0 4px 12px rgba(0,0,0,.45), 0 0 0 5px rgba(${FG},.16)`,
      transition: dragging ? "none" : "left .15s ease"
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      display: "flex",
      justifyContent: "space-between",
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 10.5,
      color: `rgba(${FG},.55)`,
      letterSpacing: ".14em"
    }
  }, /*#__PURE__*/React.createElement("span", null, "MIN $", min.toLocaleString("en-US").split(",").join(" ")), /*#__PURE__*/React.createElement("span", null, "MAX $", max.toLocaleString("en-US").split(",").join(" "))));
}
const ITEM_H = 56;
const VIEW = 7;
// fade gradient stops — fade only top/bottom row, keep middle rows fully visible
const FADE_TOP = 1 / VIEW * 100; // % of wheel height = 1 row from top
const FADE_BOTTOM = (VIEW - 1) / VIEW * 100; // % of wheel height = 1 row from bottom
const PAD = (VIEW - 1) / 2 * ITEM_H;
function WheelPicker({
  items,
  valueIdx,
  onChange,
  redBg = "#D71921"
}) {
  const ref = React.useRef(null);
  const lastRef = React.useRef(valueIdx);
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = valueIdx * ITEM_H;
      lastRef.current = valueIdx;
    }
  }, [items]);
  const handleScroll = () => {
    if (!ref.current) return;
    const top = ref.current.scrollTop;
    const idx = Math.round(top / ITEM_H);
    const clamped = Math.max(0, Math.min(items.length - 1, idx));
    if (clamped !== lastRef.current) {
      lastRef.current = clamped;
      playClick();
      onChange(clamped);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 280,
      height: VIEW * ITEM_H,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onScroll: handleScroll,
    style: {
      width: "100%",
      height: "100%",
      overflowY: "auto",
      scrollSnapType: "y mandatory",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: PAD,
      paddingBottom: PAD
    }
  }, items.map((it, i) => {
    const dist = Math.abs(i - lastRef.current);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        height: ITEM_H,
        scrollSnapAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontSize: dist === 0 ? 30 : dist === 1 ? 22 : 18,
        fontWeight: dist === 0 ? 700 : 400,
        color: dist === 0 ? "#fff" : `rgba(255,255,255,${Math.max(0.18, 0.7 - dist * 0.18)})`,
        letterSpacing: ".04em",
        transition: "font-size .15s, color .15s, font-weight .15s",
        whiteSpace: "nowrap"
      }
    }, it);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: PAD,
      left: 18,
      right: 18,
      height: ITEM_H,
      pointerEvents: "none",
      borderTop: "1px solid rgba(255,255,255,.3)",
      borderBottom: "1px solid rgba(255,255,255,.3)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `linear-gradient(180deg, ${redBg} 0%, transparent ${FADE_TOP}%, transparent ${FADE_BOTTOM}%, ${redBg} 100%)`
    }
  }));
}

// VIP rooms (100/200+) — REFINED VELVET treatment (looping video backdrop)
const VIP_THEME = {
  bg: "linear-gradient(168deg,#3c0a0f 0%,#200508 54%,#0b0203 100%)",
  grad: "linear-gradient(110deg,#9a8a6a 0%,#FFF7EA 28%,#FFFFFF 45%,#ECE0CC 60%,#9a8a6a 100%)",
  solid: "#F2E8D8",
  rgb: "214,168,168",
  divider: "rgba(242,232,216,.26)"
};
function VipVideoBg({
  cp
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      clipPath: cp,
      WebkitClipPath: cp,
      overflow: "hidden",
      pointerEvents: "none",
      transition: "clip-path 450ms cubic-bezier(.5,.05,.25,1), -webkit-clip-path 450ms cubic-bezier(.5,.05,.25,1)"
    }
  }, /*#__PURE__*/React.createElement("video", {
    ref: el => {
      if (el) el.play().catch(() => {});
    },
    src: "assets/vip-bg.webm",
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    style: {
      position: "absolute",
      inset: "-4%",
      width: "108%",
      height: "108%",
      objectFit: "cover",
      opacity: 0.92,
      filter: "blur(3px)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "rgba(40,7,11,.28)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "34%",
      background: "linear-gradient(180deg, rgba(11,2,3,.82), transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "38%",
      background: "linear-gradient(0deg, rgba(11,2,3,.88), transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 60%, rgba(0,0,0,.4) 100%)"
    }
  }));
}

// ─── GameTypeStep — beginner-first: Quick (dominant) + Regular + More ────
// ─── PfWheel — compact iOS-style vertical picker (reused for game type) ─
// (uniquely named; a different global `MiniWheel` lives in invite.jsx)
function PfWheel({
  items,
  valueIdx,
  onChange,
  fg = "#fff",
  fgRGB = "255,255,255",
  itemH = 56,
  view = 3,
  big = 26
}) {
  const ref = React.useRef(null);
  const lastRef = React.useRef(valueIdx);
  const [, force] = React.useState(0);
  const padY = (view - 1) / 2 * itemH;
  const fadeT = 1 / view * 100,
    fadeB = (view - 1) / view * 100;
  React.useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = valueIdx * itemH;
      lastRef.current = valueIdx;
      force(n => n + 1);
    }
  }, [items.length]);
  React.useEffect(() => {
    if (ref.current && Math.round(ref.current.scrollTop / itemH) !== valueIdx) {
      ref.current.scrollTop = valueIdx * itemH;
      lastRef.current = valueIdx;
      force(n => n + 1);
    }
  }, [valueIdx]);
  const onScroll = () => {
    if (!ref.current) return;
    const idx = Math.max(0, Math.min(items.length - 1, Math.round(ref.current.scrollTop / itemH)));
    if (idx !== lastRef.current) {
      lastRef.current = idx;
      playClick();
      onChange(idx);
    }
    force(n => n + 1);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 300,
      height: view * itemH,
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: ref,
    onScroll: onScroll,
    style: {
      width: "100%",
      height: "100%",
      overflowY: "auto",
      scrollSnapType: "y mandatory",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch",
      maskImage: `linear-gradient(180deg, transparent 0%, #000 ${fadeT}%, #000 ${fadeB}%, transparent 100%)`,
      WebkitMaskImage: `linear-gradient(180deg, transparent 0%, #000 ${fadeT}%, #000 ${fadeB}%, transparent 100%)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: padY,
      paddingBottom: padY
    }
  }, items.map((it, i) => {
    const dist = Math.abs(i - lastRef.current);
    const on = dist === 0;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => {
        if (ref.current) ref.current.scrollTop = i * itemH;
      },
      style: {
        height: itemH,
        scrollSnapAlign: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontSize: on ? big : dist === 1 ? big * 0.62 : big * 0.5,
        fontWeight: on ? 700 : 400,
        color: on ? fg : `rgba(${fgRGB},${Math.max(0.2, 0.62 - dist * 0.18)})`,
        letterSpacing: ".04em",
        transition: "font-size .15s, color .15s, font-weight .15s",
        whiteSpace: "nowrap",
        cursor: "pointer"
      }
    }, it);
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: padY,
      left: 22,
      right: 22,
      height: itemH,
      pointerEvents: "none",
      borderTop: `1px solid rgba(${fgRGB},.32)`,
      borderBottom: `1px solid rgba(${fgRGB},.32)`
    }
  }));
}

// ─── FormatStep — single vertical wheel of ALL cash formats ──────────────
// Every format is visible at once under its plain name; the description below
// updates with the centered pick, and HOW IT WORKS opens the full rules card.
function FormatStep({
  formatIdx,
  onFormat
}) {
  const name = CASH_FORMATS[formatIdx];
  const desc = (DISCIPLINE_INFO[name] || {}).desc || "";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      transform: "translateY(-50%)",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(PfWheel, {
    items: CASH_FORMATS,
    valueIdx: formatIdx,
    onChange: onFormat,
    itemH: 54,
    view: 5,
    big: 26
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "80%",
      left: 0,
      right: 0,
      transform: "translateY(-50%)",
      maxWidth: 290,
      marginLeft: "auto",
      marginRight: "auto",
      textAlign: "center",
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 12,
      color: "#D8D8DF",
      lineHeight: 1.5
    }
  }, desc));
}

// ─── EntryAmount — 7-tier buy-in-range wheel (centered, desc floats below) ─
function EntryAmount({
  tier,
  onTier,
  fg,
  fgRGB
}) {
  const T = ENTRY_TIERS[tier];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "50%",
      left: 0,
      right: 0,
      transform: "translateY(-50%)",
      display: "flex",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(PfWheel, {
    items: ENTRY_TIERS.map(t => `$${t.min}–$${t.max}`),
    valueIdx: tier,
    onChange: onTier,
    fg: fg,
    fgRGB: fgRGB,
    itemH: 54,
    view: 5,
    big: 28
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: "80%",
      left: 0,
      right: 0,
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".18em",
      color: "#fff"
    }
  }, T.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 11,
      color: `rgba(${fgRGB},.55)`
    }
  }, "BLINDS ", blindsFor(T.max))));
}

// ─── PlayFlow — overlay with clip-path expansion + dynamic step flow ─────
function PlayFlow({
  open,
  onClose,
  style = "tiles",
  vipStyle = "champagne",
  initialCat = null,
  initialFormat = 0,
  jumpEntry = false
}) {
  const [stepIdx, setStepIdx] = React.useState(0);
  const [choices, setChoices] = React.useState({
    format: 0,
    tier: 1
  });
  const [phase, setPhase] = React.useState("entering");
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [spinWin, setSpinWin] = React.useState(false);
  const [tableList, setTableList] = React.useState(false);
  const [tableSel, setTableSel] = React.useState(null);
  const [wheelDone, setWheelDone] = React.useState(false);
  const [spinSeat, setSpinSeat] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    setChoices({
      format: initialFormat || 0,
      tier: 1
    });
    // jump straight to the entry step when a format was pre-picked
    setStepIdx(jumpEntry ? buildSteps().findIndex(s => s.key === "entry") : 0);
    setPhase("entering");
    setInfoOpen(false);
    setSpinWin(false);
    setTableList(false);
    setTableSel(null);
    const t = setTimeout(() => setPhase("open"), 30);
    playClick(60, 0.001);
    return () => clearTimeout(t);
  }, [open]);

  // step list (gameType → [format] → entry)
  const steps = React.useMemo(() => buildSteps(), []);

  // clamp stepIdx if mode change reduces step count
  React.useEffect(() => {
    if (stepIdx > steps.length - 1) setStepIdx(steps.length - 1);
  }, [steps.length]);

  // reset info card whenever step changes
  React.useEffect(() => {
    setInfoOpen(false);
  }, [stepIdx]);
  if (!open) return null;
  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const isFormat = step.key === "format";
  const disc = CASH_FORMATS[choices.format];
  const showInfo = isFormat;

  // resolved entry amount + blinds from the selected buy-in tier
  const entryTier = ENTRY_TIERS[choices.tier];
  const entryAmt = entryTier.max;
  const entryBlinds = blindsFor(entryTier.max);

  // VIP rooms: the top buy-in tiers flip the flow to the animated oxblood+gold backdrop
  const vip = step.key === "entry" && choices.tier >= VIP_TIER;
  const T = VIP_THEME;
  const fg = vip ? T.solid : "#fff";
  const fgRGB = vip ? T.rgb : "255,255,255";
  const bg = vip ? "#1c0407" : ARC;
  const vipGrad = vip ? T.grad : null;

  // anchor at the play button (bottom-center of phone)
  const ax = "50%";
  const ay = "92%";
  const setChoice = (key, value) => setChoices(c => ({
    ...c,
    [key]: value
  }));
  const closeMe = () => {
    setPhase("exiting");
    setTimeout(onClose, 450);
  };
  const handleNext = () => {
    playClick(1900, 0.05);
    if (isFormat) {
      setStepIdx(stepIdx + 1);
      return;
    }
    // entry step (last): fast-fold buys in up-front + auto-seats, others pick a table
    if (disc === "FLASH & FLUSH") {
      setTableSel({
        name: "FLASH 04",
        max: 6,
        dbl: false,
        bomb: null,
        auto: true
      });
    } else setTableList(true);
  };
  const handleBack = () => {
    playClick(700, 0.05);
    // when the discipline was pre-picked (jumpEntry), Back from the entry step
    // returns to the caller (V2/V3) instead of revealing V1's discipline step.
    if (jumpEntry && step.key === "entry") {
      closeMe();
      return;
    }
    if (stepIdx > 0) setStepIdx(stepIdx - 1);else closeMe();
  };
  const cp = phase === "open" ? `circle(150% at ${ax} ${ay})` : `circle(0% at ${ax} ${ay})`;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 100,
      pointerEvents: phase === "exiting" ? "none" : "auto"
    }
  }, /*#__PURE__*/React.createElement("style", null, `@keyframes pp-foil{0%{background-position:200% 0}100%{background-position:-20% 0}}`), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: bg,
      clipPath: cp,
      WebkitClipPath: cp,
      transition: "clip-path 450ms cubic-bezier(.5,.05,.25,1)," + " -webkit-clip-path 450ms cubic-bezier(.5,.05,.25,1)," + " background 320ms ease"
    }
  }), vip && /*#__PURE__*/React.createElement(VipVideoBg, {
    cp: cp
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.18) 0.6px, transparent 1px)",
      backgroundSize: "10px 10px",
      opacity: phase === "open" ? vip ? 0 : 0.38 : 0,
      transition: "opacity 300ms 300ms",
      mixBlendMode: vip ? "screen" : "normal"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      flexDirection: "column",
      opacity: phase === "open" ? 1 : 0,
      transition: "opacity 200ms " + (phase === "open" ? "300ms" : "0ms")
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 64,
      paddingLeft: 18,
      paddingRight: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleBack,
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: `rgba(${fgRGB},.18)`,
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
    stroke: fg,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      color: `rgba(${fgRGB},.6)`,
      letterSpacing: ".22em"
    }
  }, "STEP ", stepIdx + 1, " / ", steps.length), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 22,
      fontWeight: 700,
      color: fg,
      letterSpacing: ".04em",
      marginTop: 5
    }
  }, step.title)), /*#__PURE__*/React.createElement("button", {
    onClick: closeMe,
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      background: `rgba(${fgRGB},.18)`,
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
    stroke: fg,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M18 6L6 18"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      justifyContent: "center",
      marginTop: 16
    }
  }, steps.map((_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      width: i === stepIdx ? 22 : 5,
      height: 5,
      borderRadius: 3,
      background: i <= stepIdx ? fg : `rgba(${fgRGB},.3)`,
      transition: "all .3s"
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, showInfo && infoOpen ? /*#__PURE__*/React.createElement(InfoCard, {
    discipline: disc,
    onClose: () => {
      playClick(700, 0.05);
      setInfoOpen(false);
    }
  }) : step.kind === "format" ? /*#__PURE__*/React.createElement(FormatStep, {
    formatIdx: choices.format,
    onFormat: i => setChoice("format", i)
  }) : step.kind === "entry" ? /*#__PURE__*/React.createElement(EntryAmount, {
    tier: choices.tier,
    onTier: i => setChoice("tier", i),
    fg: fg,
    fgRGB: fgRGB
  }) : null, step.kind === "slider" && !infoOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      top: "78%",
      transform: "translateY(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 9,
      pointerEvents: "auto"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".24em",
      color: `rgba(${fgRGB},.5)`
    }
  }, "TABLES TO LAUNCH"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const t = Math.max(1, (choices.tables || 1) - 1);
      playClick(700, 0.04);
      setChoice("tables", t);
    },
    style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      border: `1px solid rgba(${fgRGB},.32)`,
      cursor: "pointer",
      background: `rgba(${fgRGB},.06)`,
      color: fg,
      fontFamily: MONO,
      fontSize: 24,
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, "\u2212"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 74,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 36,
      color: fg,
      lineHeight: 1
    }
  }, choices.tables || 1), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".2em",
      color: `rgba(${fgRGB},.45)`,
      marginTop: 3
    }
  }, (choices.tables || 1) === 1 ? "TABLE" : "TABLES")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const t = Math.min(8, (choices.tables || 1) + 1);
      playClick(1500, 0.04);
      setChoice("tables", t);
    },
    style: {
      width: 44,
      height: 44,
      borderRadius: 12,
      border: `1px solid rgba(${fgRGB},.32)`,
      cursor: "pointer",
      background: `rgba(${fgRGB},.06)`,
      color: fg,
      fontFamily: MONO,
      fontSize: 24,
      lineHeight: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 0
    }
  }, "+")), (choices.tables || 1) > 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".18em",
      color: `rgba(${fgRGB},.4)`
    }
  }, "$", ((choices.buyIn || 0) * (choices.tables || 1)).toLocaleString("en-US").split(",").join(" "), " TOTAL"))), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: 50,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12
    }
  }, showInfo && !infoOpen && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      playClick(900, 0.05);
      setInfoOpen(true);
    },
    style: {
      padding: "7px 14px",
      borderRadius: 125,
      background: "rgba(255,255,255,.16)",
      border: 0,
      color: "#fff",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".14em"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 14,
      height: 14,
      borderRadius: "50%",
      border: "1.2px solid rgba(255,255,255,.85)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: UI.fontUI,
      fontSize: 10.5,
      fontWeight: 700,
      fontStyle: "italic",
      lineHeight: 1
    }
  }, "i"), "HOW IT WORKS"), !infoOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: UI.fontUI,
      fontWeight: 600,
      fontSize: 11,
      color: `rgba(${fgRGB},.6)`,
      letterSpacing: ".18em"
    }
  }, isLast ? "TAP TO START" : "CONTINUE"), !infoOpen && /*#__PURE__*/React.createElement("button", {
    onClick: handleNext,
    style: {
      width: 68,
      height: 68,
      borderRadius: "50%",
      background: fg,
      color: "#000",
      border: 0,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 14px 34px rgba(0,0,0,.45), " + "0 0 0 6px rgba(255,255,255,.18)",
      padding: 0,
      animation: "pp-pulse-ring 2.4s ease-out infinite"
    }
  }, step.key === "entry" ? /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#000",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 7"
  })) : /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#000",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 5l7 7-7 7"
  }))))), window.SpinWinLobby && /*#__PURE__*/React.createElement(window.SpinWinLobby, {
    open: spinWin,
    onClose: () => setSpinWin(false),
    onStart: () => {
      setSpinWin(false);
      setSpinSeat(true);
    },
    accent: ARC
  }), window.TableListScreen && /*#__PURE__*/React.createElement(window.TableListScreen, {
    open: tableList && !tableSel,
    onClose: () => {
      setTableList(false);
      closeMe();
    },
    onSit: tbl => {
      setTableSel(tbl);
    },
    accent: ARC,
    discipline: disc,
    stakes: entryBlinds,
    buyIn: entryAmt
  }), window.PokerTableScreen && /*#__PURE__*/React.createElement(window.PokerTableScreen, {
    open: !!tableSel,
    table: tableSel,
    autoSeat: !!(tableSel && tableSel.auto),
    variant: "panel",
    tilt: !(tableSel && tableSel.spin),
    seatStyle: tableSel && tableSel.spin ? "default" : "pill",
    onBack: () => {
      if (tableSel && tableSel.auto) closeMe();else setTableSel(null);
    },
    onClose: () => {
      setTableSel(null);
      setTableList(false);
      closeMe();
    },
    accent: ARC,
    discipline: disc,
    stakes: entryBlinds,
    buyIn: entryAmt
  }), tableSel && tableSel.spin && !wheelDone && window.SpinGoWheelOverlay && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 130
    }
  }, /*#__PURE__*/React.createElement(window.SpinGoWheelOverlay, {
    buyIn: entryAmt || 10,
    onDone: () => setWheelDone(true)
  })), window.SpinGoLobby && /*#__PURE__*/React.createElement(window.SpinGoLobby, {
    open: spinSeat,
    buyIn: entryAmt || 10,
    onClose: () => setSpinSeat(false),
    onReady: () => {
      setSpinSeat(false);
      setWheelDone(false);
      setTableSel({
        name: "SPIN & GO",
        max: 3,
        auto: true,
        spin: true
      });
    }
  }));
}
Object.assign(window, {
  PlayFlow,
  playClick
});

// ─── InfoCard — discipline rules explainer ───────────────────────────────
function InfoCard({
  discipline,
  onClose
}) {
  const info = DISCIPLINE_INFO[discipline] || {
    desc: "",
    rules: []
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 300,
      maxHeight: VIEW * ITEM_H,
      margin: "0 auto",
      padding: "16px 18px",
      overflow: "auto",
      scrollbarWidth: "none",
      animation: "pp-fadeIn .25s ease-out"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO,
      fontSize: 26,
      fontWeight: 700,
      color: "#fff",
      letterSpacing: ".04em",
      lineHeight: 1,
      marginBottom: 12
    }
  }, discipline), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: UI.fontUI,
      fontSize: 13,
      fontWeight: 500,
      color: "#D8D8DF",
      lineHeight: 1.45,
      margin: "0 0 12px 0"
    }
  }, info.desc), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, info.rules.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      alignItems: "flex-start",
      fontFamily: UI.fontUI,
      fontSize: 12,
      fontWeight: 500,
      color: "#D8D8DF",
      letterSpacing: ".01em",
      lineHeight: 1.35
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 4,
      height: 4,
      borderRadius: "50%",
      background: "#fff",
      marginTop: 7
    }
  }), r))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginTop: 16,
      padding: "8px 14px",
      borderRadius: 125,
      background: "rgba(255,255,255,.18)",
      border: 0,
      color: "#fff",
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      fontFamily: UI.fontUI,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".12em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "10",
    height: "10",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 18l-6-6 6-6"
  })), "BACK TO PICKER"));
}
Object.assign(window, {
  InfoCard
});
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// First-deposit bonus — 4 directions. 100% match on first deposit.
// On-brand: Space Mono / Roboto, Arcanium red, dot-matrix, suits, poker cards.
// Each is a lobby-feed widget (sits at ~374px content width inside the device).

const MONO_B = UI.font;
const SANS_B = UI.fontUI;
const GOLD_B = "#f0c75e";

// Plays an alpha .mov (HEVC/QuickTime) cross-browser by luma-keying the black
// background to transparent on a canvas every frame. Works in Chromium where
// native .mov alpha renders as solid black.
function AlphaVideo({
  src,
  style
}) {
  const canvasRef = React.useRef(null);
  const [fb, setFb] = React.useState(false); // fallback: raw <video> when canvas is tainted (file://)
  React.useEffect(() => {
    setFb(false);
    const v = document.createElement("video");
    v.src = src;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("muted", "");
    // must live in the DOM (hidden) for frames to advance + paint to canvas
    v.style.cssText = "position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0.01;pointer-events:none;";
    document.body.appendChild(v);
    let timer = 0,
      off = null,
      octx = null;
    const start = () => {
      const cv = canvasRef.current;
      if (!cv) return;
      const W = 216,
        H = 216;
      cv.width = W;
      cv.height = H;
      const cx = cv.getContext("2d");
      off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      octx = off.getContext("2d", {
        willReadFrequently: true
      });
      const N = W * H;
      const A = new Float32Array(N); // raw matte
      const B = new Float32Array(N); // eroded matte
      v.play().catch(() => {});
      const paint = () => {
        if (v.readyState < 2) return;
        octx.clearRect(0, 0, W, H);
        octx.drawImage(v, 0, 0, W, H);
        let img;
        try {
          img = octx.getImageData(0, 0, W, H);
        } catch (e) {
          clearInterval(timer);
          setFb(true);
          return;
        } // tainted (file://) → show raw video
        const d = img.data;
        const LO = 34,
          HI = 72,
          SPAN = HI - LO;
        // pass 1 — build matte from luma
        for (let p = 0; p < N; p++) {
          const i = p << 2;
          const r = d[i],
            g = d[i + 1],
            b = d[i + 2];
          const m = r > g ? r > b ? r : b : g > b ? g : b;
          A[p] = m <= LO ? 0 : m >= HI ? 1 : (m - LO) / SPAN;
        }
        // pass 2 — erode 1px (min of 4-neighbours) to shave the dark fringe ring
        for (let y = 0; y < H; y++) {
          for (let xx = 0; xx < W; xx++) {
            const p = y * W + xx;
            let a = A[p];
            if (a > 0) {
              if (y > 0 && A[p - W] < a) a = A[p - W];
              if (y < H - 1 && A[p + W] < a) a = A[p + W];
              if (xx > 0 && A[p - 1] < a) a = A[p - 1];
              if (xx < W - 1 && A[p + 1] < a) a = A[p + 1];
            }
            B[p] = a;
          }
        }
        // pass 3 — un-premultiply + write
        for (let p = 0; p < N; p++) {
          const i = p << 2;
          const a = B[p];
          if (a <= 0) {
            d[i + 3] = 0;
            continue;
          }
          const f = 1 / (a < 0.5 ? 0.5 : a);
          const r = d[i] * f,
            g = d[i + 1] * f,
            b = d[i + 2] * f;
          d[i] = r > 255 ? 255 : r;
          d[i + 1] = g > 255 ? 255 : g;
          d[i + 2] = b > 255 ? 255 : b;
          d[i + 3] = a * 255;
        }
        cx.putImageData(img, 0, 0);
      };
      // setInterval keeps updating regardless of tab/iframe visibility
      timer = setInterval(paint, 33);
      paint();
    };
    if (v.readyState >= 2) start();else v.addEventListener("loadeddata", start, {
      once: true
    });
    return () => {
      clearInterval(timer);
      try {
        v.pause();
        v.removeAttribute("src");
        v.load();
        v.remove();
      } catch (e) {}
    };
  }, [src]);
  if (fb) return /*#__PURE__*/React.createElement("video", {
    src: src,
    autoPlay: true,
    muted: true,
    loop: true,
    playsInline: true,
    style: {
      ...style,
      objectFit: "contain",
      display: "block"
    }
  });
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: style
  });
}

// ── Welcome-offer window ──────────────────────────────────────────────────
// The offer itself lives strictly until the FIRST DEPOSIT (no clock expiry).
// The countdown is the boosted-window device: 72h from first sight, persisted
// so a reload doesn't reset it. At zero the offer stays alive and the strip
// switches to a final-call line.
const OFFER_WINDOW_MS = 72 * 3600 * 1000;
const OFFER_DEADLINE_KEY = "pokerix.welcomeOffer.deadline";
function offerDeadline() {
  try {
    const saved = parseInt(localStorage.getItem(OFFER_DEADLINE_KEY), 10);
    if (saved > 0) return saved;
    const d = Date.now() + OFFER_WINDOW_MS;
    localStorage.setItem(OFFER_DEADLINE_KEY, String(d));
    return d;
  } catch (e) {
    return Date.now() + OFFER_WINDOW_MS;
  }
}
function useOfferCountdown() {
  const deadline = React.useRef(0);
  if (!deadline.current) deadline.current = offerDeadline();
  const [left, setLeft] = React.useState(() => Math.max(0, deadline.current - Date.now()));
  React.useEffect(() => {
    const id = setInterval(() => setLeft(Math.max(0, deadline.current - Date.now())), 1000);
    return () => clearInterval(id);
  }, []);
  const s = Math.floor(left / 1000);
  return {
    ms: left,
    expired: left <= 0,
    hh: String(Math.floor(s / 3600)).padStart(2, "0"),
    mm: String(Math.floor(s % 3600 / 60)).padStart(2, "0"),
    ss: String(s % 60).padStart(2, "0")
  };
}

// Countdown strip that sits inside the red hero card.
function OfferTimer() {
  const t = useOfferCountdown();
  const urgent = !t.expired && t.ms < 6 * 3600 * 1000;
  const seg = (v, unit, dim) => /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "baseline",
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 19,
      lineHeight: 1,
      color: "#fff",
      fontVariantNumeric: "tabular-nums",
      opacity: dim ? .85 : 1
    }
  }, v), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 9.5,
      lineHeight: 1,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, unit));
  const colon = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 15,
      lineHeight: 1,
      color: "#8A8A93",
      margin: "0 1px"
    }
  }, ":");
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "9px 12px",
      borderRadius: 12,
      background: "rgba(0,0,0,.3)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 125,
      flex: "none",
      background: "#fff",
      animation: "pp-pulse 1s ease-in-out infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".18em",
      color: "#D8D8DF",
      whiteSpace: "nowrap"
    }
  }, t.expired ? "FINAL CALL" : urgent ? "LAST HOURS" : "OFFER ENDS IN")), t.expired ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 9.5,
      letterSpacing: ".12em",
      color: "#fff",
      textAlign: "right"
    }
  }, "UNTIL YOUR FIRST DEPOSIT") : /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "baseline",
      flex: "none"
    }
  }, seg(t.hh, "H", true), colon, seg(t.mm, "M", true), colon, seg(t.ss, "S")));
}

// shared press-scale wrapper for the whole card
function pressHandlers() {
  return {
    onMouseDown: e => {
      e.currentTarget.style.transform = "scale(.99)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    onTouchStart: e => {
      e.currentTarget.style.transform = "scale(.99)";
    },
    onTouchEnd: e => {
      e.currentTarget.style.transform = "";
    }
  };
}

// ═══ Variant 1 — HERO BANNER · bold red, big 100% ════════════════════════
function BonusHero({
  accent = ARC,
  onClaim
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, pressHandlers(), {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      background: accent,
      cursor: "pointer",
      boxShadow: `0 16px 32px ${accent}55`,
      transition: "transform 120ms ease"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.16) 0.8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(120deg, black, transparent 70%)",
      WebkitMaskImage: "linear-gradient(120deg, black, transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "radial-gradient(circle at 92% 110%, rgba(0,0,0,.4), transparent 55%)"
    }
  }), /*#__PURE__*/React.createElement(AlphaVideo, {
    src: window.BONUS_GIFT || "assets/bonus-coins.webm",
    style: {
      position: "absolute",
      right: 8,
      top: 14,
      width: 104,
      height: 104,
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "18px 18px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".24em"
    }
  }, "WELCOME OFFER"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: 8,
      maxWidth: 268
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 62,
      lineHeight: .82,
      color: "#fff"
    }
  }, "100%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_B,
      fontSize: 14,
      lineHeight: 1.15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "FIRST", /*#__PURE__*/React.createElement("br", null), "DEPOSIT", /*#__PURE__*/React.createElement("br", null), "MATCH")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".14em",
      marginTop: 10,
      maxWidth: 268
    }
  }, "UP TO $1\xA0000 IN BONUS FUNDS"), /*#__PURE__*/React.createElement(OfferTimer, null), /*#__PURE__*/React.createElement("button", {
    onClick: onClaim,
    style: {
      marginTop: 10,
      width: "100%",
      padding: "13px 0",
      borderRadius: 125,
      background: "#fff",
      color: accent,
      border: 0,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".1em"
    }
  }, "CLAIM BONUS", /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 6l6 6-6 6"
  })))));
}

// ═══ Variant 2 — LOCKED VAULT · gamified unlock ══════════════════════════
function BonusVault({
  accent = ARC
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, pressHandlers(), {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      background: "linear-gradient(160deg, #17171c, #0a0a0c)",
      border: "1px solid rgba(255,255,255,.14)",
      boxShadow: "0 14px 28px rgba(0,0,0,.45)",
      cursor: "pointer",
      transition: "transform 120ms ease"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 14% 20%, ${accent}26, transparent 50%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "16px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 11
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 42,
      height: 42,
      borderRadius: 12,
      flex: "none",
      background: `${accent}1f`,
      border: `1px solid ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "11",
    width: "16",
    height: "9",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11V8a4 4 0 0 1 8 0v3"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_B,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, "WELCOME BONUS"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".16em",
      marginTop: 3
    }
  }, "100% MATCH \xB7 LOCKED")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 22,
      color: "#D8D8DF"
    }
  }, "$1K")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement(DotBar, {
    value: 0,
    max: 22,
    color: accent,
    size: 4.5,
    gap: 3
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 8,
      fontFamily: SANS_B,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, /*#__PURE__*/React.createElement("span", null, "MAKE 1ST DEPOSIT TO UNLOCK"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93"
    }
  }, "0%"))), /*#__PURE__*/React.createElement("button", {
    style: {
      marginTop: 14,
      width: "100%",
      padding: "13px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 10px 22px ${accent}55`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".1em"
    }
  }, "DEPOSIT NOW")));
}

// ═══ Variant 3 — DOUBLE-UP · premium gold, chip stack ════════════════════
function BonusDouble({
  accent = ARC
}) {
  const chip = (c, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: "absolute",
      left: i * 13,
      bottom: i * 7,
      width: 46,
      height: 46,
      borderRadius: "50%",
      background: c,
      border: "2px dashed rgba(255,255,255,.5)",
      boxShadow: "0 6px 14px rgba(0,0,0,.45)"
    }
  });
  return /*#__PURE__*/React.createElement("div", _extends({}, pressHandlers(), {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      background: "linear-gradient(160deg, #1a160c, #0b0a07)",
      border: `1px solid ${GOLD_B}40`,
      boxShadow: "0 14px 28px rgba(0,0,0,.45)",
      cursor: "pointer",
      transition: "transform 120ms ease"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 80% 24%, ${GOLD_B}2e, transparent 52%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      right: 18,
      bottom: 18,
      width: 90,
      height: 80
    }
  }, chip("#2a2a30", 0), chip(accent, 1), chip(GOLD_B, 2)), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      padding: "16px 16px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 10.5,
      color: GOLD_B,
      letterSpacing: ".22em"
    }
  }, "FIRST DEPOSIT \xB7 DOUBLED"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_B,
      fontSize: 21,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 9,
      maxWidth: 200
    }
  }, "DOUBLE YOUR", /*#__PURE__*/React.createElement("br", null), "FIRST DEPOSIT"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "baseline",
      gap: 8,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 34,
      color: GOLD_B
    }
  }, "+100%"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em"
    }
  }, "INSTANT", /*#__PURE__*/React.createElement("br", null), "UP TO $1\xA0000")), /*#__PURE__*/React.createElement("button", {
    style: {
      marginTop: 14,
      width: "100%",
      padding: "13px 0",
      borderRadius: 125,
      background: GOLD_B,
      color: "#1a1407",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 10px 22px ${GOLD_B}44`,
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".1em"
    }
  }, "GET +100%")));
}

// ═══ Variant 4 — COUPON TICKET · perforated, code ════════════════════════
function BonusTicket({
  accent = ARC,
  notchBg = "#0e0e10"
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, pressHandlers(), {
    style: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      background: "linear-gradient(160deg, #17171c, #0c0c0e)",
      border: "1px solid rgba(255,255,255,.14)",
      boxShadow: "0 14px 28px rgba(0,0,0,.45)",
      cursor: "pointer",
      transition: "transform 120ms ease",
      display: "flex",
      alignItems: "stretch"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      width: 104,
      background: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.16) 0.7px, transparent 1.1px)",
      backgroundSize: "11px 11px"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      transform: "rotate(-90deg)",
      whiteSpace: "nowrap",
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 40,
      color: "#fff",
      letterSpacing: ".02em"
    }
  }, "100%")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 0,
      borderLeft: "2px dashed rgba(255,255,255,.22)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -9,
      top: -9,
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: notchBg
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: -9,
      bottom: -9,
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: notchBg
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      padding: "16px 16px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, "WELCOME COUPON"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_B,
      fontSize: 16,
      color: "#fff",
      letterSpacing: ".03em",
      marginTop: 7
    }
  }, "FIRST DEPOSIT", /*#__PURE__*/React.createElement("br", null), "BONUS \xB7 $1\xA0000"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      marginTop: 11,
      padding: "5px 10px",
      borderRadius: 6,
      background: "rgba(255,255,255,.085)",
      border: "1px dashed rgba(255,255,255,.28)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_B,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#8A8A93",
      letterSpacing: ".14em"
    }
  }, "CODE"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 13,
      color: accent,
      letterSpacing: ".08em"
    }
  }, "WELCOME100")), /*#__PURE__*/React.createElement("button", {
    style: {
      marginTop: 13,
      width: "100%",
      padding: "12px 0",
      borderRadius: 125,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      boxShadow: `0 10px 22px ${accent}55`,
      fontFamily: MONO_B,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".1em"
    }
  }, "REDEEM")));
}
Object.assign(window, {
  BonusHero,
  BonusVault,
  BonusDouble,
  BonusTicket,
  AlphaVideo,
  OfferTimer
});
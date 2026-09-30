// lock-counter.jsx — combination-lock digit barrels, photoreal brushed steel.
// Each digit is a real 3D cylinder (10 faces, 36° apart) that only rolls forward.
// Material is pure CSS, stacked:
//   1 cylinder body — dark poles → bright mid, hot specular line above centre
//   2 lathe rings — fine horizontal machining lines
//   3 anisotropic brush — vertical micro-streaks (soft-light)
//   4 curvature falloff at the left/right rims + knurled edges
//   5 gunmetal housing: recessed well, ribs between barrels, end screws
// Digits are ENGRAVED into the steel: dark face, dark shadow above, light lip below.

const LC_MONO = UI.font;
const LC_STEEL = "linear-gradient(180deg,#23252a 0%,#33363c 5%,#5e626b 12%,#9ba0a9 21%,#c3c7ce 31%,#e2e5e9 40%,#f6f8fa 46%,#ffffff 48.5%,#e6e9ed 52%,#bcc0c8 60%,#8b9099 70%,#5a5e67 80%,#383b41 89%,#22242a 100%)";
const LC_RINGS = p => `repeating-linear-gradient(180deg,rgba(255,255,255,.5) 0 ${p / 3}px,rgba(0,0,0,.16) ${p / 3}px ${p}px)`;
const LC_BRUSH = p => `repeating-linear-gradient(90deg,rgba(255,255,255,.5) 0 ${p / 2}px,rgba(0,0,0,.16) ${p / 2}px ${p}px,rgba(255,255,255,.18) ${p}px ${p * 1.5}px)`;
const LC_RIM = "linear-gradient(90deg,rgba(0,0,0,.72) 0%,rgba(0,0,0,.3) 8%,rgba(255,255,255,.12) 20%,transparent 34%,transparent 66%,rgba(0,0,0,.06) 80%,rgba(0,0,0,.34) 92%,rgba(0,0,0,.74) 100%)";
const LC_KNURL = p => `repeating-linear-gradient(180deg,rgba(255,255,255,.55) 0 ${p / 2}px,rgba(0,0,0,.6) ${p / 2}px ${p}px)`;

// chrome wordmark: vertical steel ramp + a specular band that sweeps across
const LC_CHROME = "linear-gradient(180deg,#ffffff 0%,#e6e9ee 18%,#b6bcc5 38%,#ffffff 50%,#8f959e 58%,#c9ced6 78%,#f4f6f9 100%)";
const LC_SHEEN = "linear-gradient(100deg,transparent 30%,rgba(255,255,255,.4) 40%,rgba(255,255,255,1) 48%,rgba(255,255,255,1) 52%,rgba(255,255,255,.4) 60%,transparent 70%)";
const LC_GLINT = "linear-gradient(100deg,transparent 44%,rgba(255,255,255,.95) 49.5%,transparent 55%)";
if (typeof document !== "undefined" && !document.getElementById("lc-kf")) {
  const st = document.createElement("style");
  st.id = "lc-kf";
  st.textContent = "@keyframes lc-sheen{0%{background-position:-120% 0}100%{background-position:220% 0}}@keyframes lc-glint{0%,62%{background-position:-140% 0}100%{background-position:240% 0}}";
  document.head.appendChild(st);
}

// metal wordmark with a live moving highlight
function MetalText({
  children,
  size = 14,
  weight = 700,
  ls = ".22em",
  speed = 4.2,
  font = LC_MONO
}) {
  const base = {
    fontFamily: font,
    fontWeight: weight,
    fontSize: size,
    letterSpacing: ls,
    lineHeight: 1.15,
    whiteSpace: "nowrap"
  };
  const clip = {
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent"
  };
  const b = Math.max(1, Math.round(size * .055));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: 0,
      top: b,
      ...base,
      color: "rgba(0,0,0,.92)"
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-block",
      ...base,
      backgroundImage: LC_CHROME,
      ...clip,
      filter: `drop-shadow(0 ${b}px 0 rgba(0,0,0,.85)) drop-shadow(0 ${Math.round(size * .1)}px ${Math.round(size * .26)}px rgba(0,0,0,.6))`
    }
  }, children, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      ...base,
      backgroundImage: LC_SHEEN,
      backgroundSize: "240% 100%",
      backgroundRepeat: "no-repeat",
      ...clip,
      animation: `lc-sheen ${speed}s linear infinite`
    }
  }, children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      ...base,
      backgroundImage: LC_GLINT,
      backgroundSize: "300% 100%",
      backgroundRepeat: "no-repeat",
      ...clip,
      animation: `lc-glint ${speed * 2.4}s linear infinite`,
      mixBlendMode: "screen"
    }
  }, children)));
}
function LockDigit({
  d,
  h,
  fs,
  ink = "#0c0d10"
}) {
  const steps = React.useRef(d);
  const prev = React.useRef(d);
  const [rot, setRot] = React.useState(d * 36);
  React.useEffect(() => {
    if (d === prev.current) return;
    steps.current += (d - prev.current + 10) % 10; // never backwards
    prev.current = d;
    setRot(steps.current * 36);
  }, [d]);
  const w = Math.max(11, Math.round(h * 0.66));
  const R = h / (2 * Math.tan(Math.PI / 10));
  const kn = Math.max(1, Math.round(h * 0.06));
  const period = Math.max(1.5, h / 8); // machining lines scale with the barrel
  const tex = h < 30 ? h / 90 : 1; // small barrels: much fainter texture
  const lip = h < 28 ? 0.28 : 0.85; // engraved lip must not eat small glyphs
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-block",
      width: w,
      height: h,
      perspective: h * 6,
      overflow: "hidden",
      background: LC_STEEL,
      boxShadow: `inset 0 0 0 1px rgba(0,0,0,.55), inset 0 ${Math.round(h * .05)}px ${Math.round(h * .1)}px rgba(0,0,0,.45), inset 0 -${Math.round(h * .05)}px ${Math.round(h * .1)}px rgba(0,0,0,.5)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: LC_RINGS(period),
      opacity: .26 * tex,
      mixBlendMode: "overlay",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: LC_BRUSH(period),
      opacity: .3 * tex,
      mixBlendMode: "soft-light",
      pointerEvents: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      transformStyle: "preserve-3d",
      transform: `translateZ(${-R}px) rotateX(${-rot}deg)`,
      transition: "transform 560ms cubic-bezier(.16,.86,.22,1.05)"
    }
  }, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      width: w,
      height: h,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transform: `rotateX(${n * 36}deg) translateZ(${R}px)`,
      backfaceVisibility: "hidden",
      fontFamily: LC_MONO,
      fontWeight: 700,
      fontSize: fs,
      lineHeight: 1,
      color: ink,
      fontVariantNumeric: "tabular-nums",
      textShadow: `0 -1px 0 rgba(0,0,0,.5), 0 1px 0 rgba(255,255,255,${lip})`
    }
  }, n))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.28) 12%,rgba(255,255,255,.05) 34%,rgba(255,255,255,.13) 47%,rgba(255,255,255,.04) 55%,rgba(0,0,0,.24) 74%,rgba(0,0,0,.6) 100%)",
      mixBlendMode: "soft-light"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: LC_RIM
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: kn,
      pointerEvents: "none",
      background: LC_KNURL(period),
      opacity: .32 * tex
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: kn,
      pointerEvents: "none",
      background: LC_KNURL(period),
      opacity: .32 * tex
    }
  }));
}

// static steel face — same material as a barrel, no rotation (used for the $ sign)
function LockPlate({
  ch,
  h,
  fs,
  ink = "#0c0d10"
}) {
  const w = Math.max(9, Math.round(h * 0.5));
  const kn = Math.max(1, Math.round(h * 0.06));
  const period = Math.max(1.5, h / 8);
  const tex = h < 30 ? h / 90 : 1;
  const lip = h < 28 ? 0.28 : 0.85;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: w,
      height: h,
      overflow: "hidden",
      background: LC_STEEL,
      boxShadow: `inset 0 0 0 1px rgba(0,0,0,.55), inset 0 ${Math.round(h * .05)}px ${Math.round(h * .1)}px rgba(0,0,0,.45), inset 0 -${Math.round(h * .05)}px ${Math.round(h * .1)}px rgba(0,0,0,.5)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: LC_RINGS(period),
      opacity: .26 * tex,
      mixBlendMode: "overlay"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      background: LC_BRUSH(period),
      opacity: .3 * tex,
      mixBlendMode: "soft-light"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      fontFamily: LC_MONO,
      fontWeight: 700,
      fontSize: Math.round(fs * 0.82),
      lineHeight: 1,
      color: ink,
      textShadow: `0 -1px 0 rgba(0,0,0,.5), 0 1px 0 rgba(255,255,255,${lip})`
    }
  }, ch), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: "linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.28) 12%,rgba(255,255,255,.05) 34%,rgba(255,255,255,.13) 47%,rgba(255,255,255,.04) 55%,rgba(0,0,0,.24) 74%,rgba(0,0,0,.6) 100%)",
      mixBlendMode: "soft-light"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: LC_RIM
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: kn,
      pointerEvents: "none",
      background: LC_KNURL(period),
      opacity: .32 * tex
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: kn,
      pointerEvents: "none",
      background: LC_KNURL(period),
      opacity: .32 * tex
    }
  }));
}

// text: pre-formatted string ("1,247,389"). Digits become barrels; separators stay flat.
function LockCounter({
  text,
  h = 42,
  ink = "#0c0d10",
  sepColor = "rgba(255,255,255,.6)",
  fs,
  prefix
}) {
  const size = fs || Math.round(h * 0.7);
  const pad = Math.max(2, Math.round(h * 0.11));
  const rib = Math.max(1, Math.round(h * 0.04));
  const screw = Math.max(2, Math.round(h * 0.1));
  const wrapRef = React.useRef(null),
    boxRef = React.useRef(null);
  const [fit, setFit] = React.useState({
    sc: 1,
    nat: 0
  });
  React.useLayoutEffect(() => {
    const measure = () => {
      const wr = wrapRef.current,
        bx = boxRef.current;
      if (!wr || !bx) return;
      const avail = wr.parentElement ? wr.parentElement.clientWidth : 0;
      const nat = bx.offsetWidth; // layout width, ignores transform
      if (nat <= 0) return;
      const sc = avail > 0 ? Math.min(1, avail / nat) : 1;
      setFit(p => Math.abs(p.sc - sc) < 0.005 && p.nat === nat ? p : {
        sc,
        nat
      });
    };
    measure();
    // the counter rescales itself inside the box it would observe, so an RO here
    // re-fires forever ("undelivered notifications"); a resize listener is enough
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 400); // fonts/art settling after first paint
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, [h, String(text).length, prefix]);
  const sc = fit.sc;
  const natH = h + pad * 2;
  return /*#__PURE__*/React.createElement("span", {
    ref: wrapRef,
    style: {
      display: "inline-block",
      maxWidth: "100%",
      width: fit.nat ? Math.round(fit.nat * sc) : undefined,
      height: Math.round(natH * sc),
      lineHeight: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    ref: boxRef,
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "stretch",
      padding: `${pad}px ${pad * 1.9}px`,
      borderRadius: Math.max(3, Math.round(h * 0.14)),
      transform: `scale(${sc})`,
      transformOrigin: "left top",
      background: "linear-gradient(180deg,#53565d,#2a2c31 24%,#0d0e10 60%,#1d1f23)",
      boxShadow: `inset 0 1px 0 rgba(255,255,255,.26), inset 0 -1px 0 rgba(0,0,0,.9), inset 0 0 0 1px rgba(0,0,0,.7), 0 ${Math.round(h * .06)}px ${Math.round(h * .2)}px rgba(0,0,0,.65)`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "inline-flex",
      alignItems: "center",
      gap: rib,
      padding: `0 ${rib}px`,
      borderRadius: Math.max(2, Math.round(h * 0.07)),
      background: "#050506",
      boxShadow: `inset 0 2px ${Math.round(h * .14)}px rgba(0,0,0,.95), inset 0 0 0 1px rgba(255,255,255,.09)`
    }
  }, prefix ? /*#__PURE__*/React.createElement(LockPlate, {
    ch: prefix,
    h: h,
    fs: size,
    ink: ink
  }) : null, String(text).split("").map((ch, i) => /\d/.test(ch) ? /*#__PURE__*/React.createElement(LockDigit, {
    key: i,
    d: +ch,
    h: h,
    fs: size,
    ink: ink
  }) : /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: "inline-flex",
      alignItems: "flex-end",
      height: h,
      paddingBottom: Math.round(h * 0.12),
      fontFamily: LC_MONO,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1,
      color: sepColor,
      opacity: ch === "," ? .85 : 1,
      textShadow: "0 1px 0 rgba(0,0,0,.9)"
    }
  }, ch))), [0, 1].map(s => /*#__PURE__*/React.createElement("span", {
    key: s,
    style: {
      position: "absolute",
      top: "50%",
      [s ? "right" : "left"]: Math.max(1, Math.round(pad * 0.5)),
      width: screw,
      height: screw,
      marginTop: -screw / 2,
      borderRadius: "50%",
      background: "radial-gradient(circle at 34% 28%,#d3d6db,#767a83 50%,#22242a)",
      boxShadow: "inset 0 -1px 1px rgba(0,0,0,.75), 0 1px 1px rgba(0,0,0,.7)",
      pointerEvents: "none"
    }
  }))));
}
Object.assign(window, {
  LockCounter,
  LockDigit,
  LockPlate,
  MetalText
});
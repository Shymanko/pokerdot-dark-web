// marquee-sign.jsx — the animated Vegas-marquee GRAND JACKPOT wordmark.
// Seamless 3.2s loop: halo breath (3.2s) · bulb blink (1.6s = 2 cycles) ·
// light chase across the bulbs (3.2s) · red panel breath (3.2s).
// First and last frame are identical, so it loops with no seam.

const GJ_SIGN_SRC = "assets/wordmarks/marquee.png";
const GJ_MASK = "linear-gradient(100deg,transparent 38%,#000 47%,#000 53%,transparent 62%)";
if (typeof document !== "undefined" && !document.getElementById("gj-sign-kf")) {
  const st = document.createElement("style");
  st.id = "gj-sign-kf";
  st.textContent = "@keyframes gj-halo{0%,100%{opacity:.34}50%{opacity:.62}}@keyframes gj-blink{0%,100%{opacity:0}12%{opacity:.5}25%{opacity:0}37%{opacity:.5}50%{opacity:0}}@keyframes gj-chase{0%{-webkit-mask-position:-160% 0;mask-position:-160% 0}100%{-webkit-mask-position:260% 0;mask-position:260% 0}}@keyframes gj-glow{0%,100%{opacity:.05}50%{opacity:.17}}";
  document.head.appendChild(st);
}
function MarqueeSign({
  width = 260,
  px = 260,
  glow = true,
  style
}) {
  const L = {
    position: "absolute",
    inset: 0,
    backgroundImage: `url("${GJ_SIGN_SRC}")`,
    backgroundSize: "contain",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    pointerEvents: "none"
  };
  const blur = Math.max(4, Math.round(px * 0.05));
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      display: "block",
      width,
      aspectRatio: "1525 / 603",
      isolation: "isolate",
      ...style
    }
  }, glow ? /*#__PURE__*/React.createElement("span", {
    style: {
      ...L,
      filter: `blur(${blur}px) brightness(1.5) saturate(1.15)`,
      opacity: .38,
      animation: "gj-halo 3.2s ease-in-out infinite",
      zIndex: 0
    }
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      ...L,
      zIndex: 1
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...L,
      filter: "brightness(1.3) saturate(1.1)",
      opacity: 0,
      mixBlendMode: "screen",
      animation: "gj-blink 1.6s steps(1,end) infinite",
      zIndex: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...L,
      filter: "brightness(2) saturate(1.2)",
      mixBlendMode: "screen",
      WebkitMaskImage: GJ_MASK,
      maskImage: GJ_MASK,
      WebkitMaskSize: "260% 100%",
      maskSize: "260% 100%",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      animation: "gj-chase 3.2s linear infinite",
      zIndex: 3
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      ...L,
      backgroundImage: "radial-gradient(ellipse 70% 120% at 50% 50%,rgba(215,25,33,.85),transparent 72%)",
      mixBlendMode: "screen",
      opacity: .06,
      animation: "gj-glow 3.2s ease-in-out infinite",
      zIndex: 4
    }
  }));
}
Object.assign(window, {
  MarqueeSign
});
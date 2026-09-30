// reward-claim.jsx — ONE reward window for the whole app.
// Any module calls window.claimReward({...}) and this overlay handles the beat:
// present shakes → bursts open → the reward list rises → COLLECT.
// Visual language is the Competitions card: 150deg gradient, dot-matrix mask,
// accent-tinted border, chrome present art.

const MONO_RC = UI.font;
const SANS_RC = UI.fontUI;
const RC_GIFT = "assets/gifts/silver.png";
const RC_GIFT_OPEN = "assets/gifts/silver-open.png";
const RC_GIFT_GOLD = "assets/gifts/gold.png";
function RcIcon({
  kind,
  color,
  size = 20
}) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  if (kind === "ticket") return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
    d: "M3 9V7a1 1 0 011-1h16a1 1 0 011 1v2a3 3 0 000 6v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2a3 3 0 000-6z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13 6v12"
  }));
  if (kind === "spin") return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v18M3 12h18M6 6l12 12M18 6L6 18"
  }));
  if (kind === "chip") return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "9"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }));
  return /*#__PURE__*/React.createElement("svg", p, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v18M3 12h18"
  }));
}
function RewardClaim({
  data,
  accent = "#D71921",
  onCollect
}) {
  const [phase, setPhase] = React.useState(0);
  React.useEffect(() => {
    if (!data) {
      setPhase(0);
      return;
    }
    const t1 = setTimeout(() => setPhase(1), 620);
    const t2 = setTimeout(() => setPhase(2), 1080);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [data]);
  if (!data) return null;
  const col = data.accent || accent;
  const gold = !!data.gold;
  const art = gold ? RC_GIFT_GOLD : RC_GIFT;
  const items = data.items && data.items.length ? data.items : [{
    amount: data.title || "REWARD",
    sub: data.source || ""
  }];
  const burst = 20;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 92,
      overflow: "hidden",
      background: "radial-gradient(circle at 50% 40%, rgba(22,10,12,.95), rgba(4,4,6,.975))",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      animation: "rc-fade .22s ease"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.05) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "radial-gradient(circle at 50% 40%, black, transparent 72%)",
      WebkitMaskImage: "radial-gradient(circle at 50% 40%, black, transparent 72%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginBottom: 22
    }
  }, phase >= 1 && Array.from({
    length: burst
  }, (_, i) => {
    const ang = i / burst * Math.PI * 2;
    const dist = 74 + i % 4 * 26;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        position: "absolute",
        top: "42%",
        left: "50%",
        width: i % 3 === 0 ? 9 : 6,
        height: i % 3 === 0 ? 9 : 6,
        borderRadius: "50%",
        background: [col, "#fff", col, "rgba(255,255,255,.7)"][i % 4],
        "--tx": Math.cos(ang) * dist + "px",
        "--ty": Math.sin(ang) * dist + "px",
        animation: `rc-burst ${0.7 + i % 3 * 0.15}s cubic-bezier(.15,.7,.3,1) forwards`
      }
    });
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 178,
      height: 178,
      animation: phase === 0 ? "rc-shake .58s ease-in-out" : "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: art,
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      filter: "drop-shadow(0 12px 24px rgba(0,0,0,.8))",
      opacity: phase >= 1 ? 0 : 1,
      transition: "opacity 240ms ease"
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: RC_GIFT_OPEN,
    alt: "",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      filter: `drop-shadow(0 12px 24px rgba(0,0,0,.8)) drop-shadow(0 0 24px ${col}aa)`,
      opacity: phase >= 1 ? 1 : 0,
      transition: "opacity 240ms ease"
    }
  }))), phase >= 2 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      maxWidth: 340,
      padding: "0 26px",
      textAlign: "center",
      animation: "rc-rise .38s ease both"
    }
  }, data.kicker ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_RC,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".28em",
      color: col
    }
  }, data.kicker) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_RC,
      fontWeight: 700,
      fontSize: 25,
      color: "#fff",
      letterSpacing: ".02em",
      marginTop: 8
    }
  }, data.heading || "REWARD UNLOCKED"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9,
      marginTop: 19
    }
  }, items.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "relative",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: 13,
      borderRadius: 14,
      background: `linear-gradient(150deg, ${col}22 0%, #0c0c0f 62%, #0a0a0c 100%)`,
      border: `1px solid ${col}4d`,
      boxShadow: "0 12px 30px rgba(0,0,0,.5)",
      animation: `rc-rise .38s ${0.08 + i * 0.08}s both`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .8px, transparent 1.2px)",
      backgroundSize: "13px 13px",
      maskImage: "linear-gradient(150deg, black, transparent 74%)",
      WebkitMaskImage: "linear-gradient(150deg, black, transparent 74%)"
    }
  }), r.art ? /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      position: "relative",
      flex: "none",
      width: 44,
      height: 44,
      backgroundImage: `url(${r.art})`,
      backgroundSize: "contain",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: "none",
      width: 42,
      height: 42,
      borderRadius: 12,
      background: `${col}1f`,
      border: `1px solid ${col}4d`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(RcIcon, {
    kind: r.icon || "chip",
    color: col,
    size: 19
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      position: "relative",
      flex: 1,
      minWidth: 0,
      textAlign: "left"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_RC,
      fontWeight: 700,
      fontSize: 18,
      color: "#fff",
      lineHeight: 1.1
    }
  }, r.amount), r.sub ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      marginTop: 3,
      fontFamily: SANS_RC,
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: ".06em",
      color: "#A9A9B2"
    }
  }, r.sub) : null)))), data.note ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 13,
      fontFamily: SANS_RC,
      fontWeight: 600,
      fontSize: 11,
      lineHeight: 1.45,
      color: "#A9A9B2"
    }
  }, data.note) : null, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.playClick) window.playClick(1200, 0.05);
      onCollect && onCollect();
    },
    onMouseDown: e => {
      e.currentTarget.style.transform = "translateY(1px)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      width: "100%",
      marginTop: 20,
      padding: "15px 0",
      borderRadius: 125,
      cursor: "pointer",
      border: 0,
      background: col,
      color: "#fff",
      fontFamily: SANS_RC,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".14em",
      boxShadow: `0 8px 22px ${col}70`,
      transition: "transform 120ms ease"
    }
  }, "COLLECT")));
}

// ── single host: mount once, drive from anywhere via window.claimReward() ────
function RewardClaimHost({
  accent = "#D71921"
}) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    window.claimReward = payload => setData(payload || null);
    return () => {
      if (window.claimReward) delete window.claimReward;
    };
  }, []);
  return /*#__PURE__*/React.createElement(RewardClaim, {
    data: data,
    accent: accent,
    onCollect: () => {
      if (data && data.onCollect) data.onCollect();
      setData(null);
    }
  });
}
if (!document.getElementById("rc-anim")) {
  const st = document.createElement("style");
  st.id = "rc-anim";
  st.textContent = "@keyframes rc-fade{from{opacity:0}to{opacity:1}}@keyframes rc-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes rc-shake{0%,100%{transform:rotate(0)}20%{transform:rotate(-7deg) scale(1.03)}45%{transform:rotate(6deg) scale(1.04)}70%{transform:rotate(-4deg) scale(1.02)}}@keyframes rc-burst{0%{opacity:1;transform:translate(-50%,-50%) scale(.5)}100%{opacity:0;transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(.2)}}";
  document.head.appendChild(st);
}
Object.assign(window, {
  RewardClaim,
  RewardClaimHost
});
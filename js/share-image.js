// share-image.jsx — SHARE turns the result screen into a PICTURE.
// The caller hands over the DOM of the block it wants published; this renders it
// as the actual 4:5 share image (branded backdrop, logo, referral link baked in)
// and offers SAVE / SHARE / COPY LINK.
//   window.showShareImage({ selector | html, w, h, accent, text, foot })

const SH_MONO = UI.font;
const SH_SANS = UI.fontUI;
const SI_REF = () => window.AV_REF || "pokerdot.com/i/CARD-4821";

// snapshot a live node so the picture keeps the exact state it was shared in
function siSnap(selector) {
  try {
    const el = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!el || !el.offsetHeight) return null;
    // the frame already brands the picture — drop the block's own logo and
    // referral line so neither shows twice. Measured on the LIVE nodes so the
    // snapshot height shrinks by exactly what was removed (no leftover gap).
    const ref = SI_REF();
    const kill = [];
    el.querySelectorAll("[data-no-shot]").forEach(n => kill.push(n));
    el.querySelectorAll("button").forEach(n => kill.push(n));
    el.querySelectorAll('img[src*="logo-pokerdot"]').forEach(n => kill.push(n));
    el.querySelectorAll("div,span,p").forEach(n => {
      const t = (n.textContent || "").trim();
      if (!t || t.length > 90 || t.indexOf(ref) === -1 || n.querySelector("img")) return;
      let host = n;
      while (host.parentElement && host.parentElement !== el && (host.parentElement.textContent || "").trim().length <= t.length + 40) host = host.parentElement;
      if (host !== el) kill.push(host);
    });
    const paths = kill.filter(n => n !== el).map(n => {
      const ix = [];
      for (let p = n; p && p !== el; p = p.parentElement) ix.unshift(Array.prototype.indexOf.call(p.parentElement.children, p));
      return ix;
    });
    let cut = 0;
    kill.forEach(n => {
      if (n !== el && !kill.some(o => o !== n && o.contains(n))) cut += n.offsetHeight ? n.offsetHeight + 12 : 0;
    });
    const clone = el.cloneNode(true);
    // the picture frame is the only frame — drop the block's own border/shadow
    clone.style.border = "0";
    clone.style.boxShadow = "none";
    clone.style.background = "transparent";
    paths.forEach(ix => {
      let n = clone;
      for (const i of ix) {
        n = n && n.children[i];
      }
      if (n && n.parentNode) n.remove();
    });
    // tight content box in LAYOUT px (offset chain — immune to the phone
    // frame's scale and to how far the source screen is scrolled)
    const off = n => {
      let x = 0,
        y = 0;
      for (let p = n; p && p !== el; p = p.offsetParent) {
        x += p.offsetLeft;
        y += p.offsetTop;
        if (!p.offsetParent || p.offsetParent === el) break;
      }
      return {
        x,
        y
      };
    };
    let t = Infinity,
      b = -Infinity,
      l = Infinity,
      r = -Infinity;
    el.querySelectorAll("*").forEach(n => {
      if (n.children.length) return;
      if (kill.some(k2 => k2 === n || k2.contains(n))) return;
      if (!n.offsetWidth || !n.offsetHeight) return;
      const txt = (n.textContent || "").trim();
      const tag = n.tagName.toUpperCase();
      if (!txt && tag !== "IMG" && tag !== "SVG" && tag !== "CANVAS") return;
      const o = off(n);
      t = Math.min(t, o.y);
      b = Math.max(b, o.y + n.offsetHeight);
      l = Math.min(l, o.x);
      r = Math.max(r, o.x + n.offsetWidth);
    });
    const pad = 16;
    const W = el.offsetWidth,
      H = el.scrollHeight || el.offsetHeight;
    const box = b > 0 ? {
      cx: 0,
      cy: 0,
      cw: W,
      ch: Math.max(80, Math.min(H, b + pad))
    } : {
      cx: 0,
      cy: 0,
      cw: W,
      ch: H
    };
    // the picture is a still — let the clone lay out at full height, unscrolled
    clone.style.overflow = "visible";
    clone.style.height = "auto";
    clone.style.maxHeight = "none";
    clone.querySelectorAll("*").forEach(n => {
      const cs = getComputedStyle(n);
      if (/auto|scroll/.test(cs.overflowY) || /auto|scroll/.test(cs.overflowX)) {
        n.style.overflow = "visible";
        n.style.maxHeight = "none";
      }
    });
    return Object.assign({
      html: clone.outerHTML,
      w: W,
      h: H
    }, box);
  } catch (e) {
    return null;
  }
}

// the picture itself — 9:16, the ratio stories and reels use
function ShareImage({
  shot,
  accent,
  foot,
  text,
  w = 306
}) {
  const c = accent || "#f0c75e";
  const h = Math.round(w * 16 / 9);
  const inner = w - 22;
  const cw = shot ? shot.cw || shot.w : 1;
  const ch = shot ? shot.ch || shot.h : 1;
  const avail = h - 176;
  const k = shot ? Math.min(inner / cw, avail / ch) : 1;
  return /*#__PURE__*/React.createElement("div", {
    "data-share-image": "1",
    style: {
      position: "relative",
      width: w,
      height: h,
      borderRadius: 20,
      overflow: "hidden",
      background: `radial-gradient(120% 90% at 50% 0%, ${c}2e, #0a0a0c 58%, #050506)`,
      border: `1px solid ${c}59`,
      boxShadow: `0 26px 60px rgba(0,0,0,.75), inset 0 1px 0 ${c}33`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.055) .8px, transparent 1.2px)",
      backgroundSize: "12px 12px",
      maskImage: "linear-gradient(160deg, black, transparent 70%)",
      WebkitMaskImage: "linear-gradient(160deg, black, transparent 70%)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: "100%",
      boxSizing: "border-box",
      padding: "15px 16px 11px",
      display: "flex",
      alignItems: "center",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-pokerdot.svg",
    alt: "Pokerdot",
    style: {
      flex: "none",
      height: 19,
      width: "auto",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      height: 1,
      background: `linear-gradient(90deg, ${c}, transparent)`
    }
  }), foot ? /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      fontFamily: SH_SANS,
      fontWeight: 700,
      fontSize: 8.5,
      letterSpacing: ".16em",
      color: c,
      whiteSpace: "nowrap"
    }
  }, foot) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: "none",
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2px 0 6px"
    }
  }, shot ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: cw * k,
      height: ch * k,
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      width: shot.w,
      height: shot.h,
      transform: `scale(${k}) translate(${-(shot.cx || 0)}px, ${-(shot.cy || 0)}px)`,
      transformOrigin: "top left",
      pointerEvents: "none",
      userSelect: "none"
    },
    dangerouslySetInnerHTML: {
      __html: shot.html
    }
  })) : /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SH_SANS,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: ".16em",
      color: "#8A8A93"
    }
  }, "NOTHING TO SHARE")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      flex: 1,
      minHeight: 0,
      width: "100%",
      boxSizing: "border-box",
      padding: "0 16px 18px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: 12,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 46,
      height: 1,
      background: `linear-gradient(90deg, transparent, ${c}, transparent)`
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SH_MONO,
      fontWeight: 700,
      fontSize: 11,
      lineHeight: 1.55,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "#fff",
      maxWidth: 252,
      textWrap: "balance"
    }
  }, text || "Think you can beat that? Take a seat."), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 5,
      width: "100%",
      boxSizing: "border-box",
      padding: "12px 14px",
      borderRadius: 16,
      background: `linear-gradient(180deg, ${c}1A, rgba(255,255,255,.03))`,
      border: `1px solid ${c}40`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SH_SANS,
      fontWeight: 700,
      fontSize: 8.5,
      letterSpacing: ".22em",
      color: "#A9A9B2"
    }
  }, "JOIN ME ON POKERDOT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SH_MONO,
      fontWeight: 700,
      fontSize: 13,
      color: c,
      whiteSpace: "nowrap"
    }
  }, SI_REF()))));
}
function ShareImageScreen({
  data,
  onClose
}) {
  const [up, setUp] = React.useState(false);
  const [state, setState] = React.useState(null);
  React.useEffect(() => {
    if (!data) {
      setUp(false);
      setState(null);
      return;
    }
    const r = requestAnimationFrame(() => setUp(true));
    return () => cancelAnimationFrame(r);
  }, [data]);
  if (!data) return null;
  const c = data.accent || "#f0c75e";
  const dark = c === "#f0c75e" || c === "#21C97B";
  const click = f => {
    if (window.playClick) window.playClick(f, .04);
  };
  const flash = s => {
    setState(s);
    setTimeout(() => setState(null), 1800);
  };
  const doShare = () => {
    click(1400);
    const text = (data.text || "") + " " + SI_REF();
    try {
      if (navigator.share) {
        navigator.share({
          text
        });
        flash("shared");
        return;
      }
      if (navigator.clipboard) navigator.clipboard.writeText(text);
    } catch (e) {}
    flash("copied");
  };
  const btn = (label, primary, onTap, icon) => /*#__PURE__*/React.createElement("button", {
    onClick: onTap,
    style: Object.assign(UI.btn("l", primary ? "primary" : "ghost", c), {
      flex: 1,
      minWidth: 0,
      fontSize: 12,
      padding: "14px 10px",
      color: primary ? dark ? "#1a1400" : "#fff" : "rgba(255,255,255,.8)"
    })
  }, icon, label);
  return /*#__PURE__*/React.createElement("div", {
    "data-no-shot": "1",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 260,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "104px 18px 22px",
      background: "rgba(3,3,4,.9)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      opacity: up ? 1 : 0,
      transition: "opacity 200ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      paddingTop: 58,
      paddingLeft: 14,
      paddingRight: 14,
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 36
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "center",
      fontFamily: SH_MONO,
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: ".16em",
      color: "#fff"
    }
  }, "SHARE HAND"), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(800);
      onClose();
    },
    "aria-label": "Close",
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
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      transform: up ? "scale(1) translateY(0)" : "scale(.94) translateY(14px)",
      transition: "transform 300ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement(ShareImage, {
    shot: data.shot,
    accent: c,
    foot: data.foot,
    text: data.text
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 306,
      marginTop: 16,
      display: "flex",
      gap: 9
    }
  }, btn(state === "saved" ? "SAVED" : "SAVE", false, () => {
    click(1000);
    flash("saved");
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 3v12"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.5 10.5L12 15l4.5-4.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4 20h16"
  }))), btn(state === "shared" ? "SHARED" : state === "copied" ? "LINK COPIED" : "SHARE", true, doShare, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "5.5",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6.5",
    cy: "12",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "18.5",
    r: "2.6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 10.8l6-4M9 13.2l6 4"
  })))));
}
function ShareImageHost() {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    window.showShareImage = p => {
      const o = p || {};
      setData(Object.assign({}, o, {
        shot: o.shot || siSnap(o.selector)
      }));
    };
    return () => {
      delete window.showShareImage;
    };
  }, []);
  return /*#__PURE__*/React.createElement(ShareImageScreen, {
    data: data,
    onClose: () => setData(null)
  });
}
Object.assign(window, {
  ShareImage,
  ShareImageScreen,
  ShareImageHost,
  siSnap,
  SI_REF
});
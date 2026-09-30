function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Invite friends — referral page. Opens from the profile INVITE tile.
// Flow: share your code → friend registers + makes a first deposit → you earn
// a Fortune Wheel spin (top prize $100 000). Code can be copied or shared via
// an auto-generated 9:16 invite card (canvas), like the event share sheet.

const MONO_I = UI.font;
const SANS_I = UI.fontUI;
const REF_CODE = "SASHA02";
const REF_LINK = "https://play.pokerdot.com/r/SASHA02";
const INV_PRIZES = [{
  t: "$100 000",
  grand: true
}, {
  t: "$1 000"
}, {
  t: "$215 TICKET"
}, {
  t: "SPIN & WIN"
}, {
  t: "$50 BONUS"
}, {
  t: "MYSTERY BOX"
}];
function invA(hex, a) {
  const h = hex.replace("#", "");
  const n = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  return `rgba(${parseInt(n.slice(0, 2), 16)},${parseInt(n.slice(2, 4), 16)},${parseInt(n.slice(4, 6), 16)},${a})`;
}
function drawInviteCard(canvas, accent) {
  const W = 1080,
    H = 1920;
  canvas.width = W;
  canvas.height = H;
  const x = canvas.getContext("2d");
  const M = 96,
    MAXW = W - M * 2;
  const fit = (text, weight, maxPx, maxW, family, sp) => {
    let px = maxPx;
    while (px > 10) {
      x.font = `${weight} ${px}px ${family}`;
      try {
        x.letterSpacing = (sp || 0) + "px";
      } catch (e) {}
      if (x.measureText(text).width <= maxW) break;
      px -= 2;
    }
    return px;
  };
  const clearSp = () => {
    try {
      x.letterSpacing = "0px";
    } catch (e) {}
  };
  x.fillStyle = "#08080a";
  x.fillRect(0, 0, W, H);
  let g = x.createRadialGradient(W * 0.74, H * 0.24, 0, W * 0.74, H * 0.24, W * 1.05);
  g.addColorStop(0, invA(accent, 0.5));
  g.addColorStop(0.45, invA(accent, 0.1));
  g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g;
  x.fillRect(0, 0, W, H);
  let g2 = x.createRadialGradient(W * 0.12, H * 0.9, 0, W * 0.12, H * 0.9, W * 0.8);
  g2.addColorStop(0, invA(accent, 0.18));
  g2.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g2;
  x.fillRect(0, 0, W, H);
  x.fillStyle = "rgba(255,255,255,0.05)";
  for (let yy = 0; yy < H; yy += 40) for (let xx = 0; xx < W; xx += 40) {
    x.beginPath();
    x.arc(xx, yy, 1.4, 0, 7);
    x.fill();
  }

  // decorative spade pip
  x.save();
  x.translate(W * 0.83, H * 0.2);
  x.rotate(0.14);
  x.font = "600px Arial, sans-serif";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.fillStyle = invA(accent, 0.15);
  x.fillText("♠", 0, 0);
  x.restore();
  x.textAlign = "left";
  x.textBaseline = "alphabetic";
  // kicker
  fit("POKERDOT · INVITE", 700, 30, MAXW, SANS_I, 10);
  x.fillStyle = "rgba(255,255,255,0.6)";
  x.fillText("POKERDOT · INVITE", M, 210);
  clearSp();
  x.fillStyle = accent;
  x.fillRect(M, 242, 120, 6);

  // headline
  x.fillStyle = "#fff";
  fit("LET\u2019S", 700, 168, MAXW, MONO_I, 0);
  x.fillText("LET\u2019S", M - 4, 470);
  fit("PLAY", 700, 168, MAXW, MONO_I, 0);
  x.fillText("PLAY", M - 4, 628);

  // prize
  x.fillStyle = "rgba(255,255,255,0.55)";
  fit("DEPOSIT BONUS", 700, 40, MAXW, SANS_I, 8);
  x.fillText("DEPOSIT BONUS", M, 800);
  clearSp();
  x.fillStyle = accent;
  fit("+100%", 700, 168, MAXW, MONO_I, 0);
  x.fillText("+100%", M - 6, 960);

  // bonus pill
  const by = 1050,
    bh = 96,
    br = 48;
  x.fillStyle = invA(accent, 0.16);
  if (x.roundRect) {
    x.beginPath();
    x.roundRect(M, by, MAXW, bh, br);
    x.fill();
  }
  x.strokeStyle = invA(accent, 0.5);
  x.lineWidth = 2;
  if (x.roundRect) {
    x.beginPath();
    x.roundRect(M, by, MAXW, bh, br);
    x.stroke();
  }
  x.fillStyle = "#fff";
  x.textAlign = "center";
  x.textBaseline = "middle";
  fit("+ 100% BONUS ON FIRST DEPOSIT", 700, 34, MAXW - 80, SANS_I, 2);
  x.fillText("+ 100% BONUS ON FIRST DEPOSIT", W / 2, by + bh / 2 + 2);
  clearSp();

  // code box
  x.textAlign = "left";
  x.textBaseline = "alphabetic";
  const cy = 1240;
  x.fillStyle = "rgba(255,255,255,0.06)";
  if (x.roundRect) {
    x.beginPath();
    x.roundRect(M, cy, MAXW, 220, 28);
    x.fill();
  }
  x.strokeStyle = "rgba(255,255,255,0.16)";
  x.lineWidth = 2;
  x.setLineDash([14, 12]);
  if (x.roundRect) {
    x.beginPath();
    x.roundRect(M, cy, MAXW, 220, 28);
    x.stroke();
  }
  x.setLineDash([]);
  x.fillStyle = "rgba(255,255,255,0.5)";
  fit("YOUR LINK", 700, 30, MAXW, SANS_I, 8);
  x.fillText("YOUR LINK", M + 44, cy + 74);
  clearSp();
  x.fillStyle = "#fff";
  const linkTxt = REF_LINK.replace("https://", "");
  fit(linkTxt, 700, 60, MAXW - 88, MONO_I, 1);
  x.fillText(linkTxt, M + 42, cy + 162);
  clearSp();

  // CTA
  const py = 1580,
    ph = 152,
    pr = 76;
  x.fillStyle = accent;
  if (x.roundRect) {
    x.beginPath();
    x.roundRect(M, py, MAXW, ph, pr);
    x.fill();
  }
  x.fillStyle = "#fff";
  x.textAlign = "center";
  x.textBaseline = "middle";
  fit("SIGN UP WITH THIS LINK", 700, 46, MAXW - 110, MONO_I, 3);
  x.fillText("SIGN UP WITH THIS LINK", W / 2, py + ph / 2 + 2);
  clearSp();
  x.fillStyle = "rgba(255,255,255,0.5)";
  x.textBaseline = "alphabetic";
  fit("POKERDOT", 700, 36, MAXW, MONO_I, 14);
  x.fillText("POKERDOT", W / 2 - x.measureText("POKERDOT").width / 2, 1850);
  clearSp();
}
const INV_TARGETS = [{
  id: "instagram",
  label: "STORIES",
  bg: "linear-gradient(135deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)"
}, {
  id: "telegram",
  label: "TELEGRAM",
  bg: "#229ED9"
}, {
  id: "whatsapp",
  label: "WHATSAPP",
  bg: "#25D366"
}, {
  id: "x",
  label: "X",
  bg: "#000",
  border: true
}, {
  id: "copy",
  label: "COPY LINK",
  bg: "rgba(255,255,255,.16)"
}, {
  id: "save",
  label: "SAVE",
  bg: "#D71921"
}, {
  id: "more",
  label: "MORE",
  bg: "rgba(255,255,255,.16)"
}];
function InvTargetGlyph({
  id
}) {
  const Wp = {
    width: 23,
    height: 23,
    viewBox: "0 0 24 24"
  };
  switch (id) {
    case "instagram":
      return /*#__PURE__*/React.createElement("svg", _extends({}, Wp, {
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "3",
        width: "18",
        height: "18",
        rx: "5.2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "4.1"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "17.2",
        cy: "6.8",
        r: "1.2",
        fill: "#fff",
        stroke: "none"
      }));
    case "telegram":
      return /*#__PURE__*/React.createElement("svg", _extends({}, Wp, {
        fill: "#fff"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M21.5 4.3 2.9 11.4c-1 .4-1 1 0 1.3l4.6 1.4 1.8 5.6c.2.6.5.7 1 .3l2.6-2 4.7 3.5c.6.4 1.2.2 1.4-.6l3.2-15c.2-.9-.4-1.3-1.2-1z"
      }));
    case "whatsapp":
      return /*#__PURE__*/React.createElement("svg", _extends({}, Wp, {
        fill: "#fff"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm5.6 14.1c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2.3 1.3 1.1 2.3 1.5 2.6 1.6.2.1.4.1.6-.1l.8-.9c.2-.3.4-.2.7-.1l1.8.9c.3.1.5.2.5.4.1.1.1.7-.1 1.5z"
      }));
    case "x":
      return /*#__PURE__*/React.createElement("svg", _extends({}, Wp, {
        fill: "#fff"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M17.5 3h2.7l-5.9 6.7L21 21h-5.4l-4.2-5.5L6.5 21H3.8l6.3-7.2L3 3h5.5l3.8 5 4.2-5zm-1 16h1.5L8.5 4.4H6.9L16.5 19z"
      }));
    case "copy":
      return /*#__PURE__*/React.createElement("svg", _extends({}, Wp, {
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("rect", {
        x: "9",
        y: "9",
        width: "11",
        height: "11",
        rx: "2.2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M5 15V5a2 2 0 0 1 2-2h8"
      }));
    case "save":
      return /*#__PURE__*/React.createElement("svg", _extends({}, Wp, {
        fill: "none",
        stroke: "#fff",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 3v12m0 0l4-4m-4 4l-4-4M4 19h16"
      }));
    case "more":
      return /*#__PURE__*/React.createElement("svg", _extends({}, Wp, {
        fill: "#fff"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "6",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "2"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "18",
        cy: "12",
        r: "2"
      }));
    default:
      return null;
  }
}
function InviteShareModal({
  open,
  onClose,
  accent = "#D71921"
}) {
  const canvasRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const toastRef = React.useRef(0);
  React.useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setReady(false);
    setToast(null);
    const run = async () => {
      try {
        await document.fonts.ready;
      } catch (e) {}
      if (cancelled || !canvasRef.current) return;
      drawInviteCard(canvasRef.current, accent);
      setReady(true);
    };
    const id = requestAnimationFrame(run);
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [open, accent]);
  const flash = m => {
    setToast(m);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2400);
  };
  const SHARE_TEXT = "Join me on PokerDot \u2014 the best poker app! Sign up with my link and make your first deposit to get a 100% first-deposit bonus.";
  const enc = encodeURIComponent;
  const dl = () => {
    const c = canvasRef.current;
    if (!c) return;
    try {
      const a = document.createElement("a");
      a.download = "pokerdot-invite.png";
      a.href = c.toDataURL("image/png");
      a.click();
    } catch (e) {}
  };
  const ext = u => {
    try {
      window.open(u, "_blank", "noopener");
    } catch (e) {}
  };
  // E6 (UX-аудит 07.09): раніше «шеринг» будь-куди насправді відкривав
  // веб-інтент із самим лише текстом і мовчки качав картинку окремо.
  // Тепер спершу пробуємо системний шеринг САМОГО ФАЙЛУ (так картинка
  // реально їде в Stories / месенджер), і лише якщо пристрій цього не
  // вміє — чесно кажемо, що збережено в галерею.
  const shareFile = after => {
    const c = canvasRef.current;
    if (!c) {
      if (after) after(false);
      return;
    }
    try {
      c.toBlob(async blob => {
        const file = blob ? new File([blob], "pokerdot-invite.png", {
          type: "image/png"
        }) : null;
        const data = {
          title: "PokerDot",
          text: SHARE_TEXT,
          url: REF_LINK
        };
        if (file && navigator.canShare && navigator.canShare({
          files: [file]
        })) {
          try {
            await navigator.share({
              ...data,
              files: [file]
            });
            if (after) after(true);
            return;
          } catch (e) {
            if (after) after(true);
            return;
          }
        }
        if (after) after(false);
      }, "image/png");
    } catch (e) {
      if (after) after(false);
    }
  };
  const native = () => shareFile(ok => {
    if (!ok) {
      if (navigator.share) {
        try {
          navigator.share({
            title: "PokerDot",
            text: SHARE_TEXT,
            url: REF_LINK
          });
          return;
        } catch (e) {}
      }
      dl();
      flash("Image saved to your photos");
    }
  });
  const onTarget = id => {
    if (window.playClick) window.playClick(1150, 0.04);
    switch (id) {
      // Stories приймають лише файл — тому тільки системний шеринг
      case "instagram":
        shareFile(ok => {
          if (!ok) {
            dl();
            flash("Image saved \u2014 open Instagram Stories to post it");
          }
        });
        break;
      // месенджери: спершу пробуємо віддати картинку, інакше — лінк текстом
      case "telegram":
        shareFile(ok => {
          if (!ok) {
            ext(`https://t.me/share/url?url=${enc(REF_LINK)}&text=${enc(SHARE_TEXT)}`);
            flash("Telegram opened with your link");
          }
        });
        break;
      case "whatsapp":
        shareFile(ok => {
          if (!ok) {
            ext(`https://wa.me/?text=${enc(SHARE_TEXT + " " + REF_LINK)}`);
            flash("WhatsApp opened with your link");
          }
        });
        break;
      case "x":
        shareFile(ok => {
          if (!ok) {
            ext(`https://twitter.com/intent/tweet?text=${enc(SHARE_TEXT)}&url=${enc(REF_LINK)}`);
            flash("X opened with your link");
          }
        });
        break;
      case "copy":
        try {
          navigator.clipboard && navigator.clipboard.writeText(REF_LINK);
        } catch (e) {}
        flash("Link copied");
        break;
      case "save":
        dl();
        flash("Image saved to your photos");
        break;
      case "more":
        native();
        break;
    }
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 90,
      background: "rgba(0,0,0,.72)",
      backdropFilter: "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 18px",
      boxSizing: "border-box",
      animation: "pp-fadeIn .2s ease"
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: "100%",
      maxWidth: 320,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_I,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".22em"
    }
  }, "SHARE"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 32,
      height: 32,
      borderRadius: 12,
      background: "rgba(255,255,255,.13)",
      border: "1px solid rgba(255,255,255,.16)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
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
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 230,
      height: 409,
      borderRadius: 20,
      overflow: "hidden",
      border: "1px solid rgba(255,255,255,.18)",
      boxShadow: "0 26px 60px rgba(0,0,0,.6)",
      background: "#08080a",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    style: {
      width: "100%",
      height: "100%",
      display: "block",
      opacity: ready ? 1 : 0,
      transition: "opacity .25s"
    }
  }), !ready && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO_I,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, "RENDERING\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".14em",
      marginTop: 12
    }
  }, "1080 \xD7 1920 \xB7 9:16"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      marginTop: 16,
      display: "flex",
      gap: 14,
      overflowX: "auto",
      padding: "2px 2px 6px",
      scrollbarWidth: "none",
      WebkitOverflowScrolling: "touch"
    }
  }, INV_TARGETS.map(tg => /*#__PURE__*/React.createElement("button", {
    key: tg.id,
    onClick: () => onTarget(tg.id),
    onMouseDown: e => {
      e.currentTarget.style.transform = "scale(.92)";
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = "";
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = "";
    },
    style: {
      flex: "none",
      background: "transparent",
      border: 0,
      padding: 0,
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 7,
      width: 66,
      transition: "transform 110ms ease"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 54,
      height: 54,
      borderRadius: "50%",
      background: tg.bg,
      border: tg.border ? "1px solid rgba(255,255,255,.22)" : "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 8px 18px rgba(0,0,0,.4)"
    }
  }, /*#__PURE__*/React.createElement(InvTargetGlyph, {
    id: tg.id
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 9.5,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      whiteSpace: "nowrap"
    }
  }, tg.label)))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 36,
      marginTop: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      maxWidth: "100%",
      padding: "7px 14px 7px 10px",
      borderRadius: 125,
      background: "rgba(10,10,12,.94)",
      border: `1px solid ${accent}80`,
      boxShadow: `0 8px 22px rgba(0,0,0,.6), 0 0 16px ${accent}33`,
      opacity: toast ? 1 : 0,
      transform: toast ? "translateY(0)" : "translateY(-5px)",
      transition: "opacity 200ms, transform 220ms cubic-bezier(.2,.8,.2,1)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 18,
      height: 18,
      borderRadius: "50%",
      background: `${accent}22`,
      border: `1px solid ${accent}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "3.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".12em",
      textTransform: "uppercase",
      color: "#fff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, toast || "")))));
}
function MiniWheel({
  accent,
  onOpen
}) {
  const DEEP = "#9E0E15";
  const faces = ["$100K", "$50", "$215", "$10", "SPIN&GO", "$1 000", "MYSTERY", "—"];
  const n = faces.length,
    SEG = 360 / n;
  const stops = faces.map((_, i) => `${i % 2 === 0 ? "#fff" : DEEP} ${i * SEG}deg ${(i + 1) * SEG}deg`).join(", ");
  return /*#__PURE__*/React.createElement("div", {
    onClick: onOpen,
    style: {
      position: "relative",
      width: 214,
      height: 214,
      margin: "16px auto 0",
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: -2,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 5,
      width: 0,
      height: 0,
      borderLeft: "9px solid transparent",
      borderRight: "9px solid transparent",
      borderTop: "16px solid #fff",
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,.4))"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: "#fff",
      boxShadow: "0 18px 44px rgba(0,0,0,.5), 0 0 0 1px rgba(0,0,0,.08)",
      padding: 7,
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 7,
      borderRadius: "50%",
      overflow: "hidden"
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
      background: `repeating-conic-gradient(rgba(0,0,0,.16) 0deg 0.6deg, transparent 0.6deg ${SEG}deg)`
    }
  }), faces.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: `rotate(${i * SEG + SEG / 2}deg) translateY(-70px)`,
      transformOrigin: "0 0",
      width: 0,
      height: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      transform: "translate(-50%,-50%)",
      width: 62,
      textAlign: "center",
      fontFamily: MONO_I,
      fontWeight: 700,
      fontSize: f.length > 6 ? 8 : 10,
      lineHeight: 1,
      color: i % 2 === 0 ? DEEP : "#fff",
      letterSpacing: ".01em"
    }
  }, f)))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      zIndex: 4,
      width: 58,
      height: 58,
      borderRadius: "50%",
      background: accent,
      boxShadow: "0 4px 12px rgba(0,0,0,.4), 0 0 0 5px #fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_I,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      lineHeight: 1
    }
  }, "SPIN"))));
}
const INV_INVITED = 2; // friends who've registered + deposited so far
const INV_GIFTS = [{
  n: 1,
  reward: "$2"
}, {
  n: 2,
  reward: "$5"
}, {
  n: 3,
  reward: "$10"
}, {
  n: 4,
  reward: "$20"
}, {
  n: 5,
  reward: "$50",
  grand: true
}];
function GiftBox({
  size = 60,
  color = "#fff"
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "8",
    width: "18",
    height: "13",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 12h18"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8v13"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8S10.5 3.5 8 3.5 4.8 6.2 6.5 7.4C7.6 8.1 12 8 12 8z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 8s1.5-4.5 4-4.5 3.2 2.7 1.5 3.9C16.4 8.1 12 8 12 8z"
  }));
}
function InviteScreen({
  open,
  onClose,
  accent = "#D71921"
}) {
  const [mounted, setMounted] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const GOLD = "#f0c75e";
  React.useEffect(() => {
    if (!open) {
      setShareOpen(false);
      setMounted(false);
      return;
    }
    // rAF alone is unreliable — it never fires in a frame that is not painting,
    // which left the panel parked at translateY(100%). A timer always lands.
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, [open]);
  if (!open) return null;
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, 0.04);
  };
  const copyCode = () => {
    click(1250);
    try {
      navigator.clipboard && navigator.clipboard.writeText(REF_LINK);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const invited = INV_INVITED;
  const toGrand = 5 - invited;
  const STEPS = [["SHARE YOUR LINK", "Send your referral link to friends."], ["FRIEND STARTS PLAYING", "They sign up with your link and make a first deposit."], ["GUARANTEED GIFT", "You instantly get a guaranteed gift. Your 5th friend unlocks the $50 main prize."]];
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
      height: 320,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 85% 70% at 50% 4%, ${accent}3a 0%, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 320,
      pointerEvents: "none",
      backgroundImage: "radial-gradient(circle, rgba(255,255,255,.085) 0.7px, transparent 1.1px)",
      backgroundSize: "16px 16px",
      maskImage: "linear-gradient(180deg, black, transparent)",
      WebkitMaskImage: "linear-gradient(180deg, black, transparent)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 52,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434",
    onClick: () => {
      click(900);
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
      fontFamily: MONO_I,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, "INVITE A FRIEND"), window.InfoDot ? /*#__PURE__*/React.createElement(window.InfoDot, {
    title: "INVITE A FRIEND"
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
      paddingBottom: 152,
      position: "relative",
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "4px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      padding: "18px 16px 16px",
      background: "linear-gradient(152deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,.03) 60%, rgba(255,255,255,.02) 100%)",
      border: "1px solid rgba(255,255,255,.13)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em",
      textAlign: "center"
    }
  }, "YOUR PERSONAL INVITE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 168,
      height: 168,
      borderRadius: 16,
      background: "#fff",
      padding: 10,
      boxSizing: "border-box",
      boxShadow: "0 14px 30px rgba(0,0,0,.6)"
    }
  }, window.PxQR ? /*#__PURE__*/React.createElement(window.PxQR, {
    text: REF_LINK,
    px: 148
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      left: "50%",
      top: "50%",
      transform: "translate(-50%,-50%)",
      width: 34,
      height: 34,
      borderRadius: 12,
      background: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 0 0 3px #fff"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo-mark.svg",
    alt: "",
    style: {
      width: 22,
      height: 22,
      display: "block"
    },
    onError: e => {
      e.currentTarget.style.display = "none";
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10,
      textAlign: "center",
      fontFamily: SANS_I,
      fontWeight: 600,
      fontSize: 11,
      color: "#A9A9B2"
    }
  }, "Scan to join with your code"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: copyCode,
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: "14px 15px",
      borderRadius: 14,
      cursor: "pointer",
      textAlign: "left",
      background: "rgba(255,255,255,.075)",
      border: "1px dashed rgba(255,255,255,.28)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_I,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".02em",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
    }
  }, REF_LINK.replace("https://", "")), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 10.5,
      letterSpacing: ".1em",
      color: copied ? "#5BD96A" : accent
    }
  }, copied ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  })), "OK") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: accent,
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "9",
    y: "9",
    width: "11",
    height: "11",
    rx: "2.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 15V5a2 2 0 0 1 2-2h8"
  })), "COPY"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1300);
      setShareOpen(true);
    },
    "aria-label": "Share",
    style: {
      flex: "none",
      width: 56,
      borderRadius: 14,
      cursor: "pointer",
      background: accent,
      border: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 10px 22px ${accent}55`
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2",
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
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "6px 18px 0",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".26em"
    }
  }, "INVITE FRIENDS"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 112,
      height: 112,
      margin: "16px auto 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${accent}33, transparent 70%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      width: 92,
      height: 92,
      borderRadius: 24,
      background: `linear-gradient(150deg, ${accent}, #a3121b)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 16px 34px ${accent}66, inset 0 1px 1px rgba(255,255,255,.25)`
    }
  }, /*#__PURE__*/React.createElement(GiftBox, {
    size: 50,
    color: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18,
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em"
    }
  }, "MAIN PRIZE FOR YOUR 5TH FRIEND"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_I,
      fontWeight: 700,
      fontSize: 64,
      lineHeight: 1,
      color: accent,
      marginTop: 6,
      textShadow: `0 0 28px ${accent}66`
    }
  }, "$50"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 500,
      fontSize: 13,
      lineHeight: 1.6,
      color: "#A9A9B2",
      margin: "14px 0 0",
      maxWidth: 300,
      textWrap: "pretty"
    }
  }, "Every friend who signs up and makes their first deposit earns you a ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "#fff"
    }
  }, "guaranteed gift"), ". Every reward is fixed."), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "100%",
      maxWidth: 320,
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      marginBottom: 7
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".16em"
    }
  }, "YOUR PROGRESS"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_I,
      fontWeight: 700,
      fontSize: 13,
      color: "#fff"
    }
  }, invited, " / 5 ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#8A8A93",
      fontSize: 11
    }
  }, "friends"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      height: 8,
      borderRadius: 125,
      background: "rgba(255,255,255,.1)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: `${invited / 5 * 100}%`,
      borderRadius: 125,
      background: `linear-gradient(90deg, ${accent}, ${GOLD})`,
      boxShadow: `0 0 10px ${accent}88`
    }
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "26px 16px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".2em",
      marginBottom: 12
    }
  }, "GUARANTEED GIFTS"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, INV_GIFTS.map(g => {
    const done = g.n <= invited;
    const current = g.n === invited + 1;
    const ring = done ? "#5BD96A" : current ? accent : "rgba(255,255,255,.22)";
    return /*#__PURE__*/React.createElement("div", {
      key: g.n,
      style: {
        display: "flex",
        alignItems: "center",
        gap: 13,
        padding: "13px 14px",
        borderRadius: 14,
        background: g.grand ? `linear-gradient(120deg, ${accent}26, ${accent}10)` : current ? "rgba(255,255,255,.055)" : "rgba(255,255,255,.06)",
        border: g.grand ? `1px solid ${accent}` : current ? `1px solid ${accent}55` : "1px solid rgba(255,255,255,.07)",
        opacity: done || current || g.grand ? 1 : 0.62
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        width: 34,
        height: 34,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: done ? "rgba(70,194,117,.16)" : g.grand ? accent : "rgba(255,255,255,.075)",
        border: `1.5px solid ${g.grand ? accent : ring}`,
        boxShadow: g.grand ? `0 0 12px ${accent}66` : "none"
      }
    }, done ? /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#5BD96A",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 6"
    })) : g.grand ? /*#__PURE__*/React.createElement(GiftBox, {
      size: 18,
      color: "#fff"
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: MONO_I,
        fontWeight: 700,
        fontSize: 13,
        color: current ? "#fff" : "rgba(255,255,255,.5)"
      }
    }, g.n)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        lineHeight: 1.3
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: MONO_I,
        fontSize: 12,
        color: "#fff",
        letterSpacing: ".03em"
      }
    }, g.grand ? "5TH FRIEND · MAIN PRIZE" : `FRIEND ${g.n}`), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS_I,
        fontWeight: 600,
        fontSize: 10.5,
        color: done ? "#5BD96A" : current ? accent : "rgba(255,255,255,.55)",
        letterSpacing: ".06em",
        marginTop: 3
      }
    }, done ? "CLAIMED" : current ? "NEXT GIFT" : "LOCKED")), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        fontFamily: MONO_I,
        fontWeight: 700,
        fontSize: g.grand ? 18 : 15,
        color: "#fff"
      }
    }, g.reward));
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "22px 16px 0",
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, STEPS.map(([t, d], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 12,
      padding: "13px 14px",
      borderRadius: 14,
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.07)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 26,
      height: 26,
      borderRadius: "50%",
      background: `${accent}1f`,
      border: `1px solid ${accent}66`,
      color: accent,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: MONO_I,
      fontWeight: 700,
      fontSize: 13
    }
  }, i + 1), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_I,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".04em"
    }
  }, t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 500,
      fontSize: 12,
      lineHeight: 1.5,
      color: "#D8D8DF",
      marginTop: 5,
      textWrap: "pretty"
    }
  }, d))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px 16px 0",
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, [["YOU", "A guaranteed gift for every friend, up to $50 for the 5th"], ["FRIEND", "100% bonus on their first deposit"]].map(([who, txt], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 14px",
      borderRadius: 14,
      background: `${accent}12`,
      border: `1px solid ${accent}33`
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 54,
      textAlign: "center",
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".1em",
      padding: "6px 0",
      borderRadius: 8,
      background: `${accent}1f`,
      border: `1px solid ${accent}44`
    }
  }, who), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 600,
      fontSize: 12,
      lineHeight: 1.4,
      color: "#D8D8DF"
    }
  }, txt))))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 6,
      padding: "18px 16px 26px",
      background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.97) 9%, #000 19%)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(1300);
      setShareOpen(true);
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
    style: Object.assign(UI.btn("xl", "primary", accent), {
      width: "100%",
      flexDirection: "column",
      gap: 2,
      transition: "transform 100ms"
    })
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_I,
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: ".08em"
    }
  }, "INVITE A FRIEND"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_I,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#D8D8DF",
      letterSpacing: ".14em"
    }
  }, toGrand > 0 ? `${toGrand} MORE TO THE $50 MAIN PRIZE` : "MAIN PRIZE CLAIMED"))), /*#__PURE__*/React.createElement(InviteShareModal, {
    open: shareOpen,
    onClose: () => setShareOpen(false),
    accent: accent
  }));
}
Object.assign(window, {
  InviteScreen
});
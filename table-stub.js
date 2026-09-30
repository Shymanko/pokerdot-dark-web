/* Заглушка столу для альфа-тесту.
   Підміняє window.PokerTableScreen статичною картинкою — однаково для всіх
   входів: кеш-ігри, турніри, Spin & Win, список столів.

   Клікабельні дві кнопки у верхній панелі:
     ||  — одразу назад у лобі, місце лишається за тобою
     ×   — справжня вспливашка "Leave the table?" з трьома варіантами,
           перенесена з table.jsx без змін

   Живе тільки в білді для тестерів, оригінал проекту не чіпає. */
(function () {
  "use strict";

  var IMG = "table-stub.jpg";
  var ARC = "#D71921";
  var SANS = window.SANS_TB || "'Chakra Petch', system-ui, sans-serif";
  var MONO = window.MONO_TB || "'Chakra Petch', 'Geist Mono', ui-monospace, monospace";

  // Координати у відсотках від картинки — не залежать від масштабу.
  var EXITS = [
    { left: 29.9, top: 0.8, width: 11.0, height: 6.4, label: "Встати з-за столу", act: "back" },
    { left: 41.2, top: 0.8, width: 11.0, height: 6.4, label: "Вийти зі столу",    act: "ask"  }
  ];

  var e = React.createElement;
  var click = function (f) { if (window.playClick) window.playClick(f, 0.04); };

  function svg(props, path) {
    return e("svg", Object.assign({
      viewBox: "0 0 24 24", fill: "none", strokeWidth: 2,
      strokeLinecap: "round", strokeLinejoin: "round"
    }, props), path);
  }

  /* ── рядок вибору у вспливашці ─────────────────────────────────── */
  function LeaveOption(o) {
    return e("button", {
      onClick: o.onClick,
      style: {
        display: "flex", alignItems: "center", gap: 12, padding: "12px 13px",
        borderRadius: 13, border: o.danger ? "1px solid " + ARC + "55" : "1px solid rgba(255,255,255,.18)",
        background: "rgba(255,255,255,.035)", cursor: "pointer", width: "100%", textAlign: "left"
      }
    }, [
      e("span", {
        key: "ico",
        style: {
          width: 36, height: 36, borderRadius: 12, flex: "none",
          background: o.danger ? ARC + "22" : "rgba(70,194,117,.16)",
          border: o.danger ? "1px solid " + ARC + "66" : "1px solid rgba(70,194,117,.4)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }
      }, o.icon),
      e("span", { key: "txt", style: { flex: 1 } }, [
        e("span", {
          key: "t",
          style: { display: "block", fontFamily: SANS, fontWeight: 700, fontSize: 13.5, color: o.danger ? "#ff5964" : "#fff" }
        }, o.title),
        e("span", {
          key: "s",
          style: { display: "block", fontFamily: SANS, fontWeight: 500, fontSize: 11, color: "rgba(255,255,255,.68)", lineHeight: 1.3, marginTop: 2 }
        }, o.sub)
      ]),
      svg({
        key: "chev", width: 15, height: 15, strokeWidth: 2.4,
        stroke: o.danger ? "rgba(255,89,100,.55)" : "rgba(255,255,255,.3)",
        style: { flex: "none" }
      }, e("path", { d: "M9 6l6 6-6 6" }))
    ]);
  }

  /* ── вспливашка "Leave the table?" ─────────────────────────────── */
  function LeaveDialog(p) {
    var money = (p.buyIn || 9999).toLocaleString("en-US").split(",").join(" ");
    return e("div", {
      style: {
        position: "absolute", inset: 0, zIndex: 60, display: "flex",
        alignItems: "center", justifyContent: "center", padding: 18,
        background: "rgba(0,0,0,.62)", backdropFilter: "blur(1.5px)",
        WebkitBackdropFilter: "blur(1.5px)", animation: "pp-fadeIn .2s ease both"
      },
      onClick: function (ev) { if (ev.target === ev.currentTarget) { click(900); p.onDismiss(); } }
    }, e("div", {
      style: {
        width: 258, background: "rgba(18,18,22,.99)", border: "1px solid rgba(255,255,255,.1)",
        borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,.7)", padding: 18
      }
    }, [
      e("div", {
        key: "head",
        style: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 3 }
      }, [
        e("div", { key: "t", style: { fontFamily: SANS, fontWeight: 800, fontSize: 17, color: "#fff" } }, "Leave the table?"),
        e("button", {
          key: "x",
          onClick: function () { click(900); p.onDismiss(); },
          style: {
            flex: "none", width: 26, height: 26, marginTop: -2, marginRight: -4, borderRadius: 8,
            background: "rgba(255,255,255,.085)", border: "1px solid rgba(255,255,255,.16)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0
          }
        }, svg({ width: 13, height: 13, stroke: "rgba(255,255,255,.7)", strokeWidth: 2.4 },
               e("path", { d: "M18 6L6 18M6 6l12 12" })))
      ]),
      e("div", {
        key: "sub",
        style: { fontFamily: SANS, fontWeight: 500, fontSize: 12, color: "rgba(255,255,255,.68)", marginBottom: 15, lineHeight: 1.35 }
      }, "Keep your seat and pop back to the lobby, or leave the table for good."),
      e("div", { key: "opts", style: { display: "flex", flexDirection: "column", gap: 9 } }, [
        e(LeaveOption, {
          key: "lobby",
          title: "Back to lobby",
          sub: "Table stays live — your seat & stack are held. Jump back any time.",
          icon: svg({ width: 18, height: 18, stroke: "#5BD96A" }, [
            e("path", { key: "a", d: "M3 12l9-9 9 9" }),
            e("path", { key: "b", d: "M5 10v10h14V10" }),
            e("path", { key: "c", d: "M9 20v-6h6v6" })
          ]),
          onClick: function () { click(1100); p.onDismiss(); p.onLobby(); }
        }),
        e(LeaveOption, {
          key: "leave", danger: true,
          title: "Leave table",
          sub: e("span", null, ["Give up your seat & cash out. ",
            e("span", { key: "m", style: { color: "#f0c75e", fontFamily: MONO, fontWeight: 700 } }, "$" + money),
            " returns to balance."]),
          icon: svg({ width: 18, height: 18, stroke: "#ff5964" }, [
            e("path", { key: "a", d: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" }),
            e("path", { key: "b", d: "M16 17l5-5-5-5" }),
            e("path", { key: "c", d: "M21 12H9" })
          ]),
          onClick: function () { click(700); p.onDismiss(); p.onLeave(); }
        })
      ]),
      e("button", {
        key: "stay",
        onClick: function () { click(900); p.onDismiss(); },
        style: {
          width: "100%", marginTop: 13, background: "none", border: 0, cursor: "pointer",
          fontFamily: SANS, fontWeight: 700, fontSize: 12.5, color: "rgba(255,255,255,.55)", padding: "4px 0"
        }
      }, "Stay at the table")
    ]));
  }

  /* ── сам екран ─────────────────────────────────────────────────── */
  function TableStub(props) {
    var open = props.open;
    var r = React.useState(402 / 874); var ratio = r[0], setRatio = r[1];
    var a = React.useState(false);     var ask = a[0], setAsk = a[1];

    React.useEffect(function () {
      if (!open) return;
      var im = new Image();
      im.onload = function () {
        if (im.naturalWidth && im.naturalHeight) setRatio(im.naturalWidth / im.naturalHeight);
      };
      im.src = IMG;
    }, [open]);

    React.useEffect(function () { if (!open) setAsk(false); }, [open]);

    if (!open) return null;

    var toLobby = function () { if (props.onBack) props.onBack(); else if (props.onClose) props.onClose(); };
    var toLeave = function () { if (props.onClose) props.onClose(); else if (props.onBack) props.onBack(); };

    var hits = EXITS.map(function (x, i) {
      return e("button", {
        key: "hit" + i,
        "aria-label": x.label, title: x.label,
        onClick: function (ev) {
          ev.stopPropagation();
          click(900);
          if (x.act === "ask") setAsk(true); else toLobby();
        },
        style: {
          position: "absolute", left: x.left + "%", top: x.top + "%",
          width: x.width + "%", height: x.height + "%",
          background: "transparent", border: 0, padding: 0, cursor: "pointer",
          WebkitTapHighlightColor: "rgba(255,255,255,.3)"
        }
      });
    });

    return e("div", {
      style: {
        position: "absolute", inset: 0, zIndex: 200, background: "#000",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
      }
    }, [
      e("div", {
        key: "frame",
        style: { position: "relative", width: "100%", aspectRatio: String(ratio), maxHeight: "100%" }
      }, [
        e("img", {
          key: "img", src: IMG, alt: "Стіл", draggable: false,
          style: { width: "100%", height: "100%", objectFit: "contain", display: "block" }
        })
      ].concat(hits)),
      ask ? e(LeaveDialog, {
        key: "ask",
        buyIn: props.buyIn,
        onDismiss: function () { setAsk(false); },
        onLobby: toLobby,
        onLeave: toLeave
      }) : null
    ]);
  }

  window.PokerTableScreen = TableStub;
})();

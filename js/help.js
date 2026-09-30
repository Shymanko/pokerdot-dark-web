// Help & Support — contact-method sheet. Opens from the profile HELP & SUPPORT
// row. Bottom-sheet modal: pick Telegram / WhatsApp / Email / Viber.
// Pokerdot house style: black, mono, red accent; each method keeps its brand hue.

const MONO_HS = UI.font;
const SANS_HS = UI.fontUI;
const HELP_METHODS = [{
  id: "telegram",
  label: "TELEGRAM",
  handle: "@PokerdotSupport",
  bg: "#229ED9",
  badge: "FASTEST"
}, {
  id: "whatsapp",
  label: "WHATSAPP",
  handle: "+1 555 0192",
  bg: "#25D366"
}, {
  id: "email",
  label: "EMAIL",
  handle: "support@pokerdot.com",
  bg: "#D71921"
}, {
  id: "viber",
  label: "VIBER",
  handle: "+1 555 0192",
  bg: "#7360F2"
}];
function HelpGlyph({
  id
}) {
  const W = {
    width: 23,
    height: 23,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };
  if (id === 'telegram') return /*#__PURE__*/React.createElement("svg", W, /*#__PURE__*/React.createElement("path", {
    d: "m21 3-4 18-6-5-4 3 1-7-6-2Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m8 12 9-6-6 10"
  }));
  if (id === 'email') return /*#__PURE__*/React.createElement("svg", W, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "5",
    width: "18",
    height: "14",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m4 7 8 6 8-6"
  }));
  return /*#__PURE__*/React.createElement("svg", W, /*#__PURE__*/React.createElement("path", {
    d: "M20 11.5a8 8 0 0 1-12 7l-5 1 1-5a8 8 0 1 1 16-3Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "m8 7 2 3-1 1a8 8 0 0 0 4 4l1-1 3 2"
  }), id === 'viber' && /*#__PURE__*/React.createElement("path", {
    d: "M13 6a5 5 0 0 1 5 5m-5-2a2 2 0 0 1 2 2"
  }));
}
function HelpSupportSheet({
  open,
  onClose,
  accent = "#D71921"
}) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const click = f => window.playClick?.(f, .04);
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-help-backdrop",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("section", {
    className: "ps-help-sheet",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u041F\u043E\u043C\u043E\u0449\u044C \u0438 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430",
    "data-i18n": "off",
    onClick: e => e.stopPropagation(),
    style: {
      transform: mounted ? 'translateY(0)' : 'translateY(100%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ps-sheet-handle"
  }), /*#__PURE__*/React.createElement("header", {
    className: "ps-help-heading"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "ps-section-label"
  }, "POKERDOT SUPPORT"), /*#__PURE__*/React.createElement("h2", null, "\u041C\u044B \u043D\u0430 \u0441\u0432\u044F\u0437\u0438")), /*#__PURE__*/React.createElement("button", {
    className: "ps-sheet-close",
    "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0443",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12M18 6 6 18"
  })))), /*#__PURE__*/React.createElement("p", {
    className: "ps-help-intro"
  }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0443\u0434\u043E\u0431\u043D\u044B\u0439 \u0441\u043F\u043E\u0441\u043E\u0431 \u0441\u0432\u044F\u0437\u0438.", /*#__PURE__*/React.createElement("br", null), "\u041F\u043E\u043C\u043E\u0436\u0435\u043C \u0441 \u0438\u0433\u0440\u043E\u0439 \u0438 \u0432\u0430\u0448\u0438\u043C \u0430\u043A\u043A\u0430\u0443\u043D\u0442\u043E\u043C."), /*#__PURE__*/React.createElement("div", {
    className: "ps-help-methods"
  }, HELP_METHODS.map(m => /*#__PURE__*/React.createElement("button", {
    className: "ps-contact-row",
    key: m.id,
    onClick: () => click(1300)
  }, /*#__PURE__*/React.createElement("span", {
    className: "ps-contact-icon"
  }, /*#__PURE__*/React.createElement(HelpGlyph, {
    id: m.id
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, {
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
    email: 'Электронная почта',
    viber: 'Viber'
  }[m.id]), /*#__PURE__*/React.createElement("small", null, m.handle)), /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 5 7 7-7 7"
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "ps-help-availability"
  }, /*#__PURE__*/React.createElement("i", null), "\u041F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 \u0440\u0430\u0431\u043E\u0442\u0430\u0435\u0442 24/7")));
}
Object.assign(window, {
  HelpSupportSheet
});
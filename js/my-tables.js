// Shared activity for the lobby widget and tournament registration screens.
// Query-only presentation states: ?activity=idle | cash | registered | active.
(function () {
  const scenario = new URLSearchParams(location.search).get('activity');
  const seeds = scenario === 'idle' || scenario === 'cash' ? [] : scenario === 'registered' ? ['spring', 'demo-days-away'] : ['demo-late', 'spring', 'demo-days-away'];
  const registered = new Set(seeds);
  if (!scenario) (window.EVENTS || []).forEach(e => {
    try {
      const value = localStorage.getItem('pp_tourn_reg_' + e.name);
      if (value === '1') registered.add(e.id);
      if (value === '0') registered.delete(e.id);
    } catch (_) {}
  });
  const notify = () => window.dispatchEvent(new Event('px-registrations-change'));
  window.PXActivity = {
    scenario,
    registeredIds: () => [...registered],
    registrations: () => (window.EVENTS || []).filter(e => registered.has(e.id) && !e.finished).sort((a, b) => a.start - b.start),
    isRegistered: id => registered.has(id),
    setRegistration: (id, on) => {
      if (!id) return;
      on ? registered.add(id) : registered.delete(id);
      const e = (window.EVENTS || []).find(e => e.id === id);
      if (e) try {
        localStorage.setItem('pp_tourn_reg_' + e.name, on ? '1' : '0');
      } catch (_) {}
      notify();
    }
  };
  window.PX_SET_REG = window.PXActivity.setRegistration;
})();
function useRegisteredEvents() {
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    let timer;
    const schedule = () => {
      clearTimeout(timer);
      const next = window.PXActivity.registrations().find(e => e.start > Date.now());
      if (next) timer = setTimeout(update, Math.min(2147483647, next.start - Date.now() + 20));
    };
    const update = () => {
      tick(n => n + 1);
      schedule();
    };
    schedule();
    window.addEventListener('px-registrations-change', update);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('px-registrations-change', update);
    };
  }, []);
  return window.PXActivity.registrations();
}
function MyTablesStrip({
  tables,
  registrations,
  onOpen
}) {
  if (!tables.length && !registrations.length) return null;
  return /*#__PURE__*/React.createElement(window.ContinueStrip, {
    activity: {
      tables,
      registrations
    },
    onOpen: onOpen
  });
}
function MyCashTile({
  table: t,
  onTable
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "mt-cash-tile",
    "data-tournament": !!t.tourneyEvent
  }, /*#__PURE__*/React.createElement("button", {
    className: "mt-cash-main",
    onClick: () => onTable(t)
  }, /*#__PURE__*/React.createElement("span", {
    className: "mt-cash-title",
    "data-i18n": "off"
  }, t.tourneyEvent ? "MTT" : t.disc), /*#__PURE__*/React.createElement("strong", {
    "data-i18n": "off"
  }, t.tourneyEvent ? t.tourneyEvent.name : t.stake)), /*#__PURE__*/React.createElement(window.TableBubble, {
    t: t,
    onTap: () => onTable(t)
  }));
}
function MyTablesScreen({
  open,
  tables,
  registrations,
  onClose,
  onTable,
  onEvent,
  onBrowse
}) {
  React.useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent('px-full', {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent('px-full', {
      detail: -1
    }));
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("section", {
    className: "mt-screen",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u041C\u043E\u0438 \u0441\u0442\u043E\u043B\u044B"
  }, /*#__PURE__*/React.createElement("header", {
    className: "mt-top"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434 \u0438\u0437 \u043C\u043E\u0438\u0445 \u0441\u0442\u043E\u043B\u043E\u0432",
    onClick: onClose,
    style: UI.btn('icon', 'ghost')
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 6-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("h1", null, "MY TABLES"), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "mt-group",
    "aria-label": "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0435 \u0441\u0442\u043E\u043B\u044B"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-section-title"
  }, /*#__PURE__*/React.createElement("h2", null, "ACTIVE TABLES"), /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off"
  }, tables.length)), tables.length ? /*#__PURE__*/React.createElement("div", {
    className: "mt-cash-grid"
  }, tables.map(t => /*#__PURE__*/React.createElement(MyCashTile, {
    key: t.id,
    table: t,
    onTable: onTable
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "mt-empty"
  }, /*#__PURE__*/React.createElement("span", null, "NO ACTIVE TABLES"), /*#__PURE__*/React.createElement("button", {
    onClick: onBrowse
  }, "FIND A TABLE"))), /*#__PURE__*/React.createElement("section", {
    className: "mt-group",
    "aria-label": "\u0422\u0443\u0440\u043D\u0438\u0440\u044B"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-section-title"
  }, /*#__PURE__*/React.createElement("h2", null, "TOURNEYS"), /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off"
  }, registrations.length)), registrations.length ? /*#__PURE__*/React.createElement("div", {
    className: "mt-list"
  }, registrations.map(e => /*#__PURE__*/React.createElement(window.EventRow, {
    key: e.id,
    e: e,
    accent: "#D71921",
    compact: true,
    rv: 12,
    registered: true,
    onOpen: () => onEvent(e)
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "mt-empty"
  }, /*#__PURE__*/React.createElement("span", null, "NO TOURNAMENT REGISTRATIONS")))));
}
if (!document.getElementById('my-tables-style')) {
  const style = document.createElement('style');
  style.id = 'my-tables-style';
  style.textContent = `
 .mt-screen{position:absolute;inset:0;z-index:86;background:radial-gradient(ellipse at 90% 0%,#35383e33,transparent 36%),#0a0a0c;color:#fff;font-family:${UI.fontUI};display:flex;flex-direction:column}
 .mt-screen *{box-sizing:border-box}.mt-screen button{cursor:pointer;color:inherit;font-family:inherit}
 .mt-top{padding:62px 18px 22px;display:flex;align-items:center;justify-content:space-between;flex:none}.mt-top h1{font:700 15px ${UI.font};letter-spacing:.16em;margin:0}
 .mt-scroll{flex:1;overflow:auto;padding:0 16px 32px;scrollbar-width:none}.mt-group+.mt-group{margin-top:24px}
 .mt-section-title{display:flex;align-items:center;gap:8px;margin-bottom:10px}.mt-section-title h2{font:700 11px ${UI.fontUI};letter-spacing:.13em;color:#a9a9b2;margin:0}.mt-section-title>span{font:600 11px ${UI.font};color:#676770}
 .mt-list{display:flex;flex-direction:column;gap:10px}.mt-cash-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 .mt-cash-tile{min-width:0;height:76px;padding:12px 10px;display:flex;align-items:center;gap:8px;border:1px solid #ffffff1a;border-radius:12px;background:linear-gradient(160deg,#1f1f27,#0a0a0c);overflow:hidden}
 .mt-cash-tile[data-tournament=true] .mt-cash-main strong{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin-top:3px;font:700 12px ${UI.fontUI};letter-spacing:0;white-space:normal;line-height:16px}
 .mt-cash-main{display:block;flex:1;min-width:0;padding:0;background:transparent;border:0;text-align:left}
 .mt-cash-title{display:block;font:700 11px ${UI.fontUI};letter-spacing:.04em;line-height:14px;color:#a9a9b2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 .mt-cash-main strong{display:block;margin-top:5px;font:700 16px ${UI.font};line-height:20px;font-variant-numeric:tabular-nums;letter-spacing:-.025em;color:#fff;white-space:nowrap}
 .mt-empty{padding:18px 14px;border:1px solid #ffffff14;border-radius:12px;color:#93939e;font:500 12px ${UI.fontUI};line-height:1.6;display:flex;flex-direction:column;gap:12px}.mt-empty button{align-self:flex-start;background:none;border:0;padding:0;font:700 11px ${UI.fontUI};letter-spacing:.1em;color:#eee}
 `;
  document.head.appendChild(style);
}
Object.assign(window, {
  MyTablesStrip,
  MyTablesScreen,
  useRegisteredEvents
});
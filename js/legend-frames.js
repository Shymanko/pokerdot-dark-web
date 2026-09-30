// Cosmetic entitlements: one permanent PNG ornament per legendary cashback card.
const LF_DEFINITIONS = [[1, 'Речной след'], [8, 'Компас'], [12, 'Золотой билет'], [16, 'Ледяная грань'], [19, 'Пламя Аризоны'], [24, 'Дорога легенды'], [25, 'Финальный круг'], [32, 'Звезда покера'], [36, 'Техасское золото'], [38, 'Двойная корона'], [42, 'Матадор'], [47, 'Королевская'], [51, 'Возвращение']];
const LF_CATALOG = LF_DEFINITIONS.map(([level, name]) => ({
  id: `legend-${level}`,
  level,
  name,
  card: window.cmLeague53.cardForLevel(level),
  src: `assets/legend-frames/legend-${level}.png?v=2`,
  tone: window.cmLegends53[level].edition.ink,
  story: window.cmLegends53[level].title
}));
function createLegendFrameStore(catalog, player, storage, emit) {
  const key = 'pokerdot.legend-frames.v1';
  let state = {
    owned: [],
    choice: 'auto'
  };
  try {
    const saved = JSON.parse(storage.getItem(key) || 'null');
    if (saved) {
      state.owned = Array.isArray(saved.owned) ? saved.owned.filter(id => catalog.some(f => f.id === id)) : [];
      state.choice = saved.choice || 'auto';
    }
  } catch (e) {}
  const seed = catalog.filter(f => f.level <= player.level).map(f => f.id);
  state.owned = [...new Set([...state.owned, ...seed])];
  if (!['auto', 'none'].includes(state.choice) && !state.owned.includes(state.choice)) state.choice = 'auto';
  const save = () => {
    try {
      storage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  };
  save();
  const api = {
    catalog,
    owned: () => catalog.filter(f => state.owned.includes(f.id)),
    selected: () => state.choice === 'none' ? null : state.choice === 'auto' ? api.owned().slice(-1)[0] || null : catalog.find(f => f.id === state.choice) || null,
    has: id => state.owned.includes(id),
    choose(id) {
      if (!['auto', 'none'].includes(id) && !state.owned.includes(id)) return false;
      state.choice = id;
      save();
      emit();
      return true;
    },
    award(level) {
      const frame = catalog.find(f => f.level === level);
      if (!frame || state.owned.includes(frame.id)) return false;
      state.owned.push(frame.id);
      save();
      emit();
      return true;
    },
    choice: () => state.choice
  };
  return api;
}
window.cmFrames = createLegendFrameStore(LF_CATALOG, window.cmPlayer53, {
  getItem: k => localStorage.getItem(k),
  setItem: (k, v) => localStorage.setItem(k, v)
}, () => window.dispatchEvent(new Event('legend-frames-change')));
function useLegendFrames() {
  const [, update] = React.useState(0);
  React.useEffect(() => {
    const f = () => update(v => v + 1);
    window.addEventListener('legend-frames-change', f);
    return () => window.removeEventListener('legend-frames-change', f);
  }, []);
  return window.cmFrames;
}
function LegendFrameOverlay({
  player = true,
  frameId,
  style
}) {
  const store = useLegendFrames(),
    frame = frameId === null ? null : frameId ? store.catalog.find(f => f.id === frameId) : player ? store.selected() : null;
  if (!frame) return null;
  return /*#__PURE__*/React.createElement("img", {
    className: "legend-avatar-frame",
    "data-frame": frame.id,
    src: frame.src,
    alt: "",
    "aria-hidden": "true",
    draggable: "false",
    style: {
      position: 'absolute',
      left: '-14%',
      top: '-14%',
      width: '128%',
      height: '128%',
      maxWidth: 'none',
      objectFit: 'contain',
      pointerEvents: 'none',
      zIndex: 4,
      ...style
    }
  });
}
function FramedAvatar({
  src = 'assets/avatar.png',
  size = 36,
  player = true,
  frameId,
  style
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex',
      width: size,
      height: size,
      flex: 'none',
      ...style
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "",
    style: {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
      objectPosition: 'center 30%'
    }
  }), /*#__PURE__*/React.createElement(LegendFrameOverlay, {
    player: player,
    frameId: frameId
  }));
}
if (!document.getElementById('legend-frames-style')) {
  const s = document.createElement('style');
  s.id = 'legend-frames-style';
  s.textContent = `
.lf-entry{display:flex;align-items:center;gap:14px;margin:22px 20px 0;padding:16px;width:calc(100% - 40px);text-align:left;border:1px solid ${UI.gold}55;border-radius:16px;background:linear-gradient(135deg,${UI.gold}13,transparent);color:${UI.text};cursor:pointer;font-family:${UI.fontUI}}
.lf-entry strong{display:block;font-size:13px;font-weight:600}.lf-entry small{display:block;margin-top:5px;font-size:12px;color:${UI.textMute}}
.lf-screen{position:absolute;inset:0;z-index:110;display:flex;flex-direction:column;background:#101115;color:${UI.text};font-family:${UI.fontUI};animation:pp-fadeIn 220ms ease}
.lf-top{display:flex;align-items:center;justify-content:space-between;padding:62px 20px 12px;flex:none}.lf-top h2{font-size:16px;margin:0;font-weight:600;letter-spacing:.02em}.lf-top small{color:${UI.textMute};font-size:12px}
.lf-scroll{overflow:auto;min-height:0;flex:1;padding:8px 20px 36px}.lf-preview{display:flex;flex-direction:column;align-items:center;text-align:center;padding:15px 0 24px;border-bottom:1px solid ${UI.hairline};margin-bottom:22px}
.lf-preview h3{font-size:21px;font-weight:600;margin:23px 0 6px}.lf-preview p{font-size:12px;color:${UI.textMute};line-height:1.55;margin:0;max-width:300px}.lf-preview button{width:100%;min-height:46px;margin-top:18px;border:1px solid ${UI.gold}66;border-radius:999px;background:linear-gradient(180deg,${UI.gold}25,${UI.gold}10);color:#f1d49a;font:600 12px ${UI.fontUI};cursor:pointer}.lf-preview button:disabled{cursor:default;color:${UI.textMute};border-color:${UI.hairline};background:#ffffff05}
.lf-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.lf-item{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;gap:11px;min-height:148px;padding:17px 5px 11px;border-radius:15px;border:1px solid ${UI.hairline};background:#ffffff03;color:${UI.text};cursor:pointer;min-width:0}.lf-item[data-preview=true]{border-color:${UI.gold}99;background:${UI.gold}0c}.lf-item[data-locked=true] .lf-thumb{opacity:.42;filter:saturate(.3)}.lf-item b{font:600 12px ${UI.fontUI};line-height:1.3;max-width:100%;overflow-wrap:anywhere}.lf-item small{font:600 12px ${UI.fontUI};color:${UI.textMute};margin-top:auto}.lf-item[data-equipped=true] small{color:#ecd094}.lf-lock{position:absolute;top:61px;right:12px;width:20px;height:20px;border-radius:50%;background:#101115;display:grid;place-items:center;color:#e0c78d;border:1px solid #71603b}.lf-options{display:flex;gap:10px;margin-top:20px}.lf-options button{flex:1;min-height:44px;border:1px solid ${UI.hairline};border-radius:999px;background:transparent;color:${UI.textMute};font:500 12px ${UI.fontUI};cursor:pointer}.lf-options button[aria-pressed=true]{border-color:${UI.gold}77;color:#ecd094}
.lf-unlock-gift{display:flex;align-items:center;gap:12px;padding:11px 13px;margin:12px 0 0;border:1px solid ${UI.gold}40;border-radius:14px;background:${UI.gold}0a;text-align:left}.lf-unlock-gift b{display:block;font-size:12px;color:#f1d49a}.lf-unlock-gift small{display:block;font-size:12px;color:${UI.textMute};margin-top:4px}
.lf-screen button:focus-visible,.lf-entry:focus-visible{outline:2px solid #fff;outline-offset:3px}
`;
  document.head.appendChild(s);
}
function LegendFramesEntry({
  onClick
}) {
  const store = useLegendFrames(),
    selected = store.selected();
  return /*#__PURE__*/React.createElement("button", {
    className: "lf-entry",
    "data-i18n": "off",
    onClick: onClick,
    "aria-label": "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0435 \u0440\u0430\u043C\u043A\u0438"
  }, /*#__PURE__*/React.createElement(FramedAvatar, {
    size: 38
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("strong", null, "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0435 \u0440\u0430\u043C\u043A\u0438"), /*#__PURE__*/React.createElement("small", null, store.owned().length, " \u0438\u0437 ", store.catalog.length, " \xB7 ", selected ? selected.name : 'Без рамки')), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u203A"));
}
function LegendFrameCollection({
  onClose,
  avatar = 'assets/avatar.png'
}) {
  const store = useLegendFrames(),
    [preview, setPreview] = React.useState(() => store.selected()?.id || store.catalog[0].id);
  const frame = store.catalog.find(f => f.id === preview),
    owned = store.has(frame.id),
    equipped = store.selected()?.id === frame.id;
  React.useEffect(() => {
    const key = e => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [onClose]);
  return /*#__PURE__*/React.createElement("div", {
    className: "lf-screen",
    "data-i18n": "off",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0435 \u0440\u0430\u043C\u043A\u0438"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lf-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "\u041D\u0430\u0437\u0430\u0434 \u043A \u043F\u0440\u043E\u0444\u0438\u043B\u044E",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 6-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("h2", null, "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u044B\u0435 \u0440\u0430\u043C\u043A\u0438"), /*#__PURE__*/React.createElement("small", null, store.owned().length, "/", store.catalog.length)), /*#__PURE__*/React.createElement("div", {
    className: "lf-scroll"
  }, /*#__PURE__*/React.createElement("section", {
    className: "lf-preview"
  }, /*#__PURE__*/React.createElement(FramedAvatar, {
    src: avatar,
    size: 86,
    frameId: frame.id
  }), /*#__PURE__*/React.createElement("h3", null, frame.name), /*#__PURE__*/React.createElement("p", null, "\u0417\u0430 \u043B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u0443\u044E \u043A\u0430\u0440\u0442\u0443 ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: '#fff'
    }
  }, frame.card), /*#__PURE__*/React.createElement("br", null), owned ? 'Доступна в профиле, лобби и за любым столом.' : 'Разблокируйте эту карту, чтобы получить рамку.'), /*#__PURE__*/React.createElement("button", {
    disabled: !owned || equipped,
    onClick: () => store.choose(frame.id)
  }, equipped ? 'РАМКА ВЫБРАНА' : owned ? 'НАДЕТЬ РАМКУ' : `ЗАКРЫТО · ${frame.card}`)), /*#__PURE__*/React.createElement("div", {
    className: "lf-grid"
  }, store.catalog.map(f => /*#__PURE__*/React.createElement("button", {
    className: "lf-item",
    key: f.id,
    "data-preview": preview === f.id,
    "data-locked": !store.has(f.id),
    "data-equipped": store.selected()?.id === f.id,
    "aria-label": `${f.name}, ${f.card}${store.has(f.id) ? ', доступна' : ', закрыта'}`,
    onClick: () => setPreview(f.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "lf-thumb"
  }, /*#__PURE__*/React.createElement(FramedAvatar, {
    src: avatar,
    size: 55,
    frameId: f.id
  })), !store.has(f.id) && /*#__PURE__*/React.createElement("span", {
    className: "lf-lock"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "10",
    width: "14",
    height: "11",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 10V7a4 4 0 0 1 8 0v3"
  }))), /*#__PURE__*/React.createElement("b", null, f.name), /*#__PURE__*/React.createElement("small", null, store.selected()?.id === f.id ? 'НАДЕТА' : f.card)))), /*#__PURE__*/React.createElement("div", {
    className: "lf-options"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-pressed": store.choice() === 'auto',
    onClick: () => {
      store.choose('auto');
      setPreview(store.selected()?.id || frame.id);
    }
  }, "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u044F\u044F \u043E\u0442\u043A\u0440\u044B\u0442\u0430\u044F"), /*#__PURE__*/React.createElement("button", {
    "aria-pressed": store.choice() === 'none',
    onClick: () => store.choose('none')
  }, "\u0411\u0435\u0437 \u0440\u0430\u043C\u043A\u0438"))));
}
function LegendFrameUnlockGift({
  level
}) {
  const f = LF_CATALOG.find(f => f.level === level);
  if (!f) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "lf-unlock-gift",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement(FramedAvatar, {
    size: 37,
    frameId: f.id
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "\u041B\u0435\u0433\u0435\u043D\u0434\u0430\u0440\u043D\u0430\u044F \u0440\u0430\u043C\u043A\u0430 \xAB", f.name, "\xBB"), /*#__PURE__*/React.createElement("small", null, "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430 \u0432 \u043A\u043E\u043B\u043B\u0435\u043A\u0446\u0438\u044E \xB7 \u0432\u044B\u0431\u043E\u0440 \u0432 \u043F\u0440\u043E\u0444\u0438\u043B\u0435")));
}
Object.assign(window, {
  LegendFrameOverlay,
  FramedAvatar,
  LegendFramesEntry,
  LegendFrameCollection,
  LegendFrameUnlockGift
});
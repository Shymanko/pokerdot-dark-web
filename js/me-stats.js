// me-stats.jsx — «Моя статистика»: чотири віджети на всю ширину (кеш · турніри · Spin & Win · лідерборди), кожен зі своєю
// структурою, і чотири окремі екрани. Жодного P&L: тільки непрямі показники. Тап по будь-якому показнику → пояснення.
const MS_MONO = `var(--cm-font-display,${UI.font})`,
  MS_SANS = `var(--cm-font-ui,${UI.fontUI})`;
const MS_C = {
  cash: "#21C97B",
  mtt: "#6FA8FF",
  spin: "#f0c75e",
  lb: "#D71921"
};
// демо-дані розділів
const ME_MTT_RECENT = [["Sunday Major", "21.09", "$55", "3 / 412", "$1 240"], ["GOPC #201", "19.09", "$22", "17 / 1 080", "$96"], ["Daily Deep", "17.09", "$11", "148 / 640", "—"], ["Turbo Night", "15.09", "$11", "6 / 230", "$118"]];
const ME_SPIN_DIST = [[2, 62], [3, 24], [5, 9], [10, 3], [25, 1.5], [100, .5]];
const ME_LB = [["Weekly Hold'em Race", "15–21.09", "4", "$120"], ["Omaha Sprint", "08–14.09", "2", "$300"], ["Spin Rush", "08–14.09", "11", "—"], ["Daily Hands", "20.09", "1", "$200"], ["Weekly Hold'em Race", "01–07.09", "7", "$40"]];
const msClick = (f, g) => {
  if (window.playClick) window.playClick(f || 1100, g || 0.04);
};

// ── пояснення показників (EN — джерело, RU через i18n DICT) ────────────────────────────────────
const MS_EXPLAIN = {
  "WINS": "Share of showdowns you won. When cards are opened at the end of a hand, how often yours were the best.",
  "TOTAL GAMES": "Cash sessions you played: one seat-in at one table counts as a game.",
  "TOTAL HANDS": "Hands dealt to you in this discipline over the period.",
  "VPIP": "Доля раздач, в которые вы добровольно вошли коллом или рейзом до флопа.",
  "PFR": "Доля раздач, в которых вы сделали рейз до флопа.",
  "C-BET": "Continuation bet: after raising before the flop, how often you bet the flop again.",
  "3-BET": "Как часто вы делаете ререйз в ответ на рейз соперника до флопа.",
  "WTSD": "Went to showdown: once you saw the flop, how often you went all the way to opening the cards.",
  "AF": "Ставки и рейзы после флопа, делённые на коллы. Больше 1 означает, что ставок и рейзов больше, чем коллов.",
  "BIGGEST POT": "The biggest pot you won in this discipline. Tap the card to replay the hand.",
  "PLAYED": "Events you registered and played in the period.",
  "ITM": "In the money: share of tournaments where you finished in a paid place.",
  "FINAL TABLES": "Tournaments where you reached the last table.",
  "BEST FINISH": "Your highest finishing place in the period.",
  "AVG FINISH": "Your average finish as a share of the field: 42% means you usually outlast 58% of players.",
  "TITLES": "Tournaments you won outright.",
  "CASHES": "Number of tournaments where you took a prize.",
  "PRIZES": "Total prize money you received in the period.",
  "BEST PRIZE": "The single biggest prize you received.",
  "WINS %": "Share of Spin & Win games you won.",
  "JACKPOTS": "Spins that hit the top multiplier tiers.",
  "BEST": "The highest multiplier you have ever spun.",
  "AVG": "Average multiplier across your spins.",
  "×25 AND UP": "Spins that hit a multiplier of ×25 or higher.",
  "WIN STREAK": "Your longest run of Spin & Win victories in a row.",
  "ENTERED": "Leaderboards you took part in.",
  "PRIZE PLACES": "Leaderboards where you finished in a paid place.",
  "BEST PLACE": "Your highest final position across all leaderboards.",
  "TOP 3": "Times you finished on the podium: 1st, 2nd or 3rd.",
  "TOP 10": "Times you finished in the first ten.",
  "AVG PLACE": "Your average final position.",
  "POINTS": "Leaderboard points you collected in the period.",
  "ACTIVE NOW": "Leaderboards running right now where you already have points.",
  "MULTIPLIER HISTORY": "How your spins split by multiplier. Rare high multipliers are highlighted.",
  "LAST 10 SPINS": "Multipliers of your ten most recent spins, newest first.",
  "RECENT RESULTS": "Your latest tournaments with the place and the prize."
};
const MS_RECORDS_URL = "https://pokerdot.app/records";
function MsFullStatsSheet({
  open,
  onClose
}) {
  const Sheet = window.ClSheet;
  if (!open || !Sheet) return null;
  return /*#__PURE__*/React.createElement(Sheet, {
    open: true,
    title: "DOT RECORDS",
    onClose: onClose,
    z: 90,
    cta: /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("button", {
      style: {
        ...UI.btn("l", "ghost"),
        flex: 1
      },
      onClick: () => {
        msClick(900);
        onClose();
      }
    }, "CANCEL"), /*#__PURE__*/React.createElement("button", {
      style: {
        ...UI.btn("l", "primary"),
        flex: 1.4
      },
      onClick: () => {
        msClick(1250);
        try {
          window.open(MS_RECORDS_URL, "_blank");
        } catch (e) {}
        onClose();
      }
    }, "GO TO WEBSITE"))
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "16px 0 14px",
      font: `500 15px ${MS_SANS}`,
      lineHeight: 1.5,
      color: "#fff"
    }
  }, "Do you want to go to the website with detailed statistics for your account?"));
}
const MsAnimContext = React.createContext(true);
function MsReveal({
  children,
  className = '',
  style
}) {
  const ref = React.useRef(null),
    [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!window.IntersectionObserver) {
      setSeen(true);
      return;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        setSeen(true);
        observer.disconnect();
      }
    }, {
      threshold: .12
    });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: 'ms-reveal ' + className,
    "data-seen": seen,
    style: style
  }, /*#__PURE__*/React.createElement(MsAnimContext.Provider, {
    value: seen
  }, children));
}
function MsNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = ''
}) {
  const seen = React.useContext(MsAnimContext),
    [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!seen) return;
    let frame;
    const start = performance.now(),
      reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = t => {
      const p = reduced ? 1 : Math.max(0, Math.min(1, (t - start) / 1000));
      setN(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, value]);
  const parts = n.toFixed(decimals).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0');
  return /*#__PURE__*/React.createElement("span", {
    "data-i18n": "off"
  }, prefix, parts.join('.'), suffix);
}
function MsExplain({
  metric,
  onClose
}) {
  const Sheet = window.ClSheet;
  return metric && Sheet ? /*#__PURE__*/React.createElement(Sheet, {
    open: true,
    title: metric,
    onClose: onClose,
    z: 95
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 20px',
      font: `500 14px ${MS_SANS}`,
      lineHeight: 1.65,
      color: '#d9dee7'
    }
  }, MS_EXPLAIN[metric] || '')) : null;
}
function MsMetric({
  label,
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  onExplain,
  metric
}) {
  const Tag = onExplain ? 'button' : 'div';
  return /*#__PURE__*/React.createElement(Tag, {
    className: "ms-metric",
    onClick: onExplain ? () => onExplain(metric || label) : undefined
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(MsNumber, {
    value: value,
    decimals: decimals,
    prefix: prefix,
    suffix: suffix
  })));
}
function MsTrend({
  values,
  compact = false,
  label = 'Динамика показателя'
}) {
  const id = React.useId().replace(/:/g, ''),
    min = Math.min(...values) - 4,
    max = Math.max(...values) + 4;
  const pts = values.map((v, i) => [4 + i * 312 / (values.length - 1), 76 - (v - min) / (max - min) * 65]);
  const path = pts.reduce((s, p, i) => {
    if (!i) return `M${p[0]},${p[1]}`;
    const q = pts[i - 1],
      x = (p[0] + q[0]) / 2;
    return s + ` C${x},${q[1]} ${x},${p[1]} ${p[0]},${p[1]}`;
  }, '');
  return /*#__PURE__*/React.createElement("div", {
    className: 'ms-trend ' + (compact ? 'is-compact' : '')
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 320 86",
    role: "img",
    "aria-label": label,
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: id,
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "var(--ms-color)",
    stopOpacity: ".16"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "var(--ms-color)",
    stopOpacity: "0"
  }))), !compact && [23, 49, 76].map(y => /*#__PURE__*/React.createElement("path", {
    key: y,
    d: `M4 ${y}H316`,
    stroke: "#ffffff09"
  })), /*#__PURE__*/React.createElement("path", {
    className: "ms-plot-area",
    d: path + ' L316,86 L4,86 Z',
    fill: `url(#${id})`
  }), /*#__PURE__*/React.createElement("path", {
    className: "ms-plot-line",
    d: path,
    pathLength: "1",
    fill: "none",
    stroke: "var(--ms-color)",
    strokeWidth: "2",
    strokeLinecap: "round",
    vectorEffect: "non-scaling-stroke"
  }), /*#__PURE__*/React.createElement("circle", {
    className: "ms-plot-area",
    cx: pts[pts.length - 1][0],
    cy: pts[pts.length - 1][1],
    r: "3",
    fill: "var(--ms-color)"
  })));
}
function MsBars({
  items,
  small = false
}) {
  const max = Math.max(...items.map(x => x[1]));
  return /*#__PURE__*/React.createElement("div", {
    className: 'ms-columns ' + (small ? 'is-small' : '')
  }, items.map(([label, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      '--i': i
    }
  }, /*#__PURE__*/React.createElement("span", null, !small && /*#__PURE__*/React.createElement(MsNumber, {
    value: v,
    decimals: v % 1 ? 1 : 0,
    suffix: "%"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-column-track"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      height: Math.max(3, v / max * 100) + '%'
    }
  })), /*#__PURE__*/React.createElement("b", null, label))));
}
const MS_PERIOD = [{
  id: '7d',
  label: '7 ДНЕЙ'
}, {
  id: '30d',
  label: '30 ДНЕЙ'
}, {
  id: 'all',
  label: 'ВСЁ ВРЕМЯ'
}];
const MS_DESCRIPTIONS = {
  'VPIP': 'Входишь в раздачу добровольно',
  'PFR': 'Делаешь рейз до флопа',
  'C-BET': 'Продолжаешь ставкой на флопе',
  '3-BET': 'Ререйзишь до флопа',
  'WTSD': 'Доходишь до вскрытия после флопа',
  'AF': 'Ставки и рейзы / коллы'
};
function MsStyleMetric({
  label,
  value,
  index,
  ratio,
  onExplain
}) {
  const share = ratio ? value / (value + 1) * 100 : value;
  return /*#__PURE__*/React.createElement("button", {
    className: "ms-game-stat",
    onClick: onExplain,
    "aria-label": `${label}: ${value}${ratio ? ' к 1' : '%'}. Подробнее`
  }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("strong", null, value, ratio ? ' : 1' : '%'), /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement("b", {
    style: {
      width: share + '%'
    }
  })), /*#__PURE__*/React.createElement("small", null, MS_DESCRIPTIONS[label]));
}
function MsCashOverview({
  c,
  period,
  onExplain
}) {
  const participated = Math.round(c.hands * c.vpip / 100),
    showdowns = Math.round(participated * c.wt / 100),
    won = Math.round(showdowns * c.wsd / 100);
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 12;
  const activity = Array.from({
      length: days
    }, (_, i) => (i * 7 + 3) % 11 + 1),
    total = activity.reduce((a, b) => a + b, 0);
  const counts = activity.map(v => Math.floor(v / total * c.games));
  for (let i = 0, left = c.games - counts.reduce((a, b) => a + b, 0); i < left; i++) counts[i % days]++;
  const played = counts.filter(v => v > 0).length;
  return /*#__PURE__*/React.createElement("section", {
    className: "ms-cash-overview ms-cash-reference"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onExplain('TOTAL HANDS')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-label"
  }, "\u0420\u0410\u0417\u0414\u0410\u0427\u0418 ", /*#__PURE__*/React.createElement("span", null, "\u24D8")), /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-value"
  }, /*#__PURE__*/React.createElement("strong", null, c.hands.toLocaleString('ru')), /*#__PURE__*/React.createElement("small", null, "\u0441\u044B\u0433\u0440\u0430\u043D\u043E \u0437\u0430 \u043F\u0435\u0440\u0438\u043E\u0434")), /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-bar ms-ref-bar-large"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      flex: c.vpip
    }
  }, c.vpip, "%"), /*#__PURE__*/React.createElement("b", {
    style: {
      flex: 100 - c.vpip
    }
  }, 100 - c.vpip, "%")), /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-legend"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, participated), /*#__PURE__*/React.createElement("small", null, "\u0431\u043E\u0440\u043E\u043B\u0441\u044F \u0437\u0430 \u0431\u0430\u043D\u043A"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, c.hands - participated), /*#__PURE__*/React.createElement("small", null, "\u0441\u0431\u0440\u043E\u0441\u0438\u043B \u0431\u0435\u0437 \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u0439"))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onExplain('WINS')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-label"
  }, "\u041F\u041E\u0411\u0415\u0414\u042B \u041D\u0410 \u0428\u041E\u0423\u0414\u0410\u0423\u041D\u0415 ", /*#__PURE__*/React.createElement("span", null, "\u24D8")), /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-value"
  }, /*#__PURE__*/React.createElement("strong", null, c.wsd, /*#__PURE__*/React.createElement("em", null, "%")), /*#__PURE__*/React.createElement("small", null, "\u0438\u0437 ", showdowns, " \u0432\u0441\u043A\u0440\u044B\u0442\u0438\u0439 \u043A\u0430\u0440\u0442")), /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-bar ms-ref-showdown"
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      flex: c.wsd
    }
  }), /*#__PURE__*/React.createElement("b", {
    style: {
      flex: 100 - c.wsd
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-legend ms-ref-showdown"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, won), /*#__PURE__*/React.createElement("small", null, "\u0432\u044B\u0438\u0433\u0440\u0430\u043B"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, showdowns - won), /*#__PURE__*/React.createElement("small", null, "\u043F\u0440\u043E\u0438\u0433\u0440\u0430\u043B"))))), /*#__PURE__*/React.createElement("button", {
    onClick: () => onExplain('TOTAL GAMES')
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-label"
  }, "\u0421\u0415\u0421\u0421\u0418\u0418 ", /*#__PURE__*/React.createElement("span", null, "\u24D8")), /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-value"
  }, /*#__PURE__*/React.createElement("strong", null, c.games), /*#__PURE__*/React.createElement("small", null, "\u2248 ", Math.round(c.hands / c.games), " \u0440\u0430\u0437\u0434\u0430\u0447 \u0437\u0430 \u0441\u0435\u0441\u0441\u0438\u044E")), /*#__PURE__*/React.createElement("div", {
    className: "ms-activity",
    style: {
      gridTemplateColumns: `repeat(${days === 30 ? 15 : days},1fr)`
    }
  }, counts.map((v, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    title: `${period === 'all' ? 'Месяц' : 'День'} ${i + 1}: ${v} сессий`,
    style: {
      background: v ? '#21c983' : '#262a2f',
      opacity: v ? .3 + .7 * v / Math.max(...counts) : .7
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ms-ref-calendar-foot"
  }, /*#__PURE__*/React.createElement("small", null, "\u0418\u0433\u0440\u0430\u043B ", played, " \u0438\u0437 ", days, " ", period === 'all' ? 'месяцев' : 'дней'), /*#__PURE__*/React.createElement("span", null, "\u043C\u0435\u043D\u044C\u0448\u0435 ", Array.from({
    length: 4
  }, (_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      opacity: .25 + i * .25
    }
  })), " \u0431\u043E\u043B\u044C\u0448\u0435"))));
}
const MS_RIVAL_AVATARS = {
  RiverStone: "assets/chat/drebin.webp",
  LuckyFox: "assets/chat/girl.webp",
  OmahaKing: "assets/avatar.png",
  AceHunter: "assets/chat/sponge.webp"
};
function MsRivals({
  period,
  disc = "HOLD'EM",
  tournament = false,
  onExplain
}) {
  const k = period === '7d' ? .24 : period === '30d' ? 1 : 2.8,
    om = disc === 'OMAHA';
  const rivals = tournament ? [['ПАЛАЧ', 'RiverStone', -126, 9, 3], ['ТРАМПЛИН', 'LuckyFox', 184, 7, 2]] : om ? [['ЗАКЛЯТЫЙ ВРАГ', 'OmahaKing', -38.5, 81], ['ЛЮБИМЫЙ СПОНСОР', 'AceHunter', 226, 64]] : [['ЗАКЛЯТЫЙ ВРАГ', 'RiverStone', -46.5, 124], ['ЛЮБИМЫЙ СПОНСОР', 'LuckyFox', 318, 76]];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(MsHeading, {
    aside: "\u0440\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442 \u0432 BB"
  }, "\u041B\u0418\u0427\u041D\u042B\u0415 \u0421\u0427\u0401\u0422\u042B"), /*#__PURE__*/React.createElement("div", {
    className: "ms-rivals"
  }, rivals.map(([label, nick, result, count, ko], i) => /*#__PURE__*/React.createElement("button", {
    key: label,
    "data-positive": i === 1,
    "aria-label": `${label}: ${nick}. Подробнее`,
    onClick: () => window.showScreenInfo?.({
      kicker: label,
      title: nick,
      noLink: true,
      body: [MS_EXPLAIN[label], `${Math.max(1, Math.round(count * k))} ${tournament ? 'турниров' : 'раздач'} вместе · ${period === '7d' ? '7 дней' : period === '30d' ? '30 дней' : 'всё время'}.`, `Ваш результат: ${result > 0 ? '+' : ''}${(result * k).toFixed(1)} BB.`]
    })
  }, /*#__PURE__*/React.createElement("small", null, label), /*#__PURE__*/React.createElement("span", {
    className: "ms-rival-identity"
  }, /*#__PURE__*/React.createElement("img", {
    src: MS_RIVAL_AVATARS[nick],
    alt: "",
    width: "40",
    height: "40"
  }), /*#__PURE__*/React.createElement("b", null, nick)), /*#__PURE__*/React.createElement("span", null, Math.max(1, Math.round(count * k)), " ", tournament ? 'турниров' : 'раздач', " \u0432\u043C\u0435\u0441\u0442\u0435"), tournament && /*#__PURE__*/React.createElement("span", null, i ? 'Вы выбили' : 'Вас выбили', ": ", Math.round(ko * k)), /*#__PURE__*/React.createElement("strong", null, result > 0 ? '+' : '', (result * k).toFixed(1), " BB"), /*#__PURE__*/React.createElement("span", {
    className: "ms-rival-more"
  }, "\u041F\u041E\u0414\u0420\u041E\u0411\u041D\u0415\u0415 ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2197"))))));
}
Object.assign(MS_EXPLAIN, {
  'ЗАКЛЯТЫЙ ВРАГ': 'Соперник, с которым сыграно больше всего раздач за выбранный период. Ниже показан ваш результат против него в больших блайндах.',
  'ЛЮБИМЫЙ СПОНСОР': 'Соперник, у которого вы выиграли больше всего за выбранный период. Результат в больших блайндах.',
  'ПАЛАЧ': 'Соперник, который забрал у вас больше всего фишек за период. Показаны совместные турниры, выбивания и ваш результат против него в BB.',
  'ТРАМПЛИН': 'Соперник, у которого вы забрали больше всего фишек за период. Показаны совместные турниры, ваши выбивания и результат в BB.'
});
const MS_CASH_BARS = [['VPIP', 'vpip', 100, [20, 30]], ['PFR', 'pfr', 100, [15, 25]], ['C-BET', 'cbet', 100, [45, 70]], ['3-BET', 'tb', 20, [5, 9]], ['WTSD', 'wt', 60, [24, 30]], ['AF', 'af', 5, [1.5, 2.8]]];
function MsHeading({
  children,
  aside
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-heading"
  }, /*#__PURE__*/React.createElement("h3", null, children), aside && /*#__PURE__*/React.createElement("span", null, aside));
}
function MsScreen({
  title,
  color,
  onClose,
  children,
  overlays,
  ex,
  setEx,
  covered = false
}) {
  React.useEffect(() => {
    window.dispatchEvent(new CustomEvent('px-full', {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent('px-full', {
      detail: -1
    }));
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "me-overlay me-screen ms-screen",
    style: {
      zIndex: 80,
      '--ms-color': color
    },
    role: "dialog",
    "aria-modal": "true",
    "aria-label": title
  }, /*#__PURE__*/React.createElement("div", {
    className: "me-top",
    "aria-hidden": covered
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "\u041D\u0430\u0437\u0430\u0434 \u0438\u0437 \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0438",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 6-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "me-title"
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "me-scroll ms-scroll",
    "aria-hidden": covered
  }, children), /*#__PURE__*/React.createElement(MsExplain, {
    metric: ex,
    onClose: () => setEx(null)
  }), overlays);
}
function MsPeriod({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-period"
  }, /*#__PURE__*/React.createElement(window.SSegment, {
    options: MS_PERIOD,
    value: value,
    onChange: onChange,
    accent: UI.accent
  }));
}
function MsPreview({
  kind,
  title,
  value,
  suffix = '',
  prefix = '',
  label,
  children,
  visual,
  onOpen,
  periodLabel = '30 ДНЕЙ'
}) {
  return /*#__PURE__*/React.createElement(MsReveal, {
    className: "ms-preview-wrap",
    style: {
      '--ms-color': MS_C[kind]
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: 'ms-preview ms-preview-' + kind,
    onClick: () => onOpen(kind),
    "aria-label": 'Статистика: ' + title,
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-preview-head"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("i", null), title), /*#__PURE__*/React.createElement("small", null, periodLabel)), /*#__PURE__*/React.createElement("div", {
    className: "ms-preview-main"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(MsNumber, {
    value: value,
    prefix: prefix,
    suffix: suffix
  })), /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("div", {
    className: "ms-preview-art"
  }, visual)), /*#__PURE__*/React.createElement("div", {
    className: "ms-preview-foot"
  }, children)));
}
function MsCashWidget({
  onOpen
}) {
  const c = meCareerFor("HOLD'EM", 'all');
  return /*#__PURE__*/React.createElement(MsPreview, {
    periodLabel: "\u0412\u0421\u0401 \u0412\u0420\u0415\u041C\u042F",
    kind: "cash",
    title: "\u041A\u042D\u0428",
    value: c.wsd,
    suffix: "%",
    label: "\u043F\u043E\u0431\u0435\u0434 \u043D\u0430 \u0448\u043E\u0443\u0434\u0430\u0443\u043D\u0435",
    onOpen: onOpen,
    visual: /*#__PURE__*/React.createElement(MsTrend, {
      compact: true,
      values: [42, 48, 45, 53, 49, c.wsd],
      label: "\u041F\u043E\u0431\u0435\u0434\u044B \u043D\u0430 \u0448\u043E\u0443\u0434\u0430\u0443\u043D\u0435"
    })
  }, /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0420\u0423\u041A\u0418",
    value: c.hands
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0421\u0415\u0421\u0421\u0418\u0418",
    value: c.games
  }));
}
function MsMttWidget({
  onOpen
}) {
  return /*#__PURE__*/React.createElement(MsPreview, {
    periodLabel: "\u0412\u0421\u0401 \u0412\u0420\u0415\u041C\u042F",
    kind: "mtt",
    title: "\u0422\u0423\u0420\u041D\u0418\u0420\u042B",
    value: 19,
    suffix: "%",
    label: "\u043F\u043E\u043F\u0430\u0434\u0430\u043D\u0438\u0439 \u0432 \u043F\u0440\u0438\u0437\u044B",
    onOpen: onOpen,
    visual: /*#__PURE__*/React.createElement(MsBars, {
      small: true,
      items: [['', 8], ['', 12], ['', 7], ['', 15], ['', 13], ['', 19]]
    })
  }, /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0421\u042B\u0413\u0420\u0410\u041D\u041E",
    value: 86
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041F\u0420\u0418\u0417\u041E\u0412\u042B\u0415",
    value: 6840,
    prefix: "$"
  }));
}
function MsSpinWidget({
  onOpen
}) {
  return /*#__PURE__*/React.createElement(MsPreview, {
    kind: "spin",
    title: "SPIN & WIN",
    value: 100,
    prefix: "\xD7",
    label: "\u043B\u0443\u0447\u0448\u0438\u0439 \u043C\u043D\u043E\u0436\u0438\u0442\u0435\u043B\u044C",
    onOpen: onOpen,
    visual: /*#__PURE__*/React.createElement(window.SpinPrize3D, null)
  }, /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0418\u0413\u0420\u042B",
    value: 227
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041F\u041E\u0411\u0415\u0414\u042B",
    value: 41,
    suffix: "%"
  }));
}
function MsLbWidget({
  onOpen
}) {
  return /*#__PURE__*/React.createElement(MsPreview, {
    kind: "lb",
    title: "\u041B\u0418\u0414\u0415\u0420\u0411\u041E\u0420\u0414\u042B",
    value: 3,
    label: "\u043F\u0440\u0438\u0437\u043E\u0432\u044B\u0445 \u043C\u0435\u0441\u0442\u0430",
    onOpen: onOpen,
    visual: /*#__PURE__*/React.createElement("div", {
      className: "ms-rank-art",
      "aria-hidden": "true"
    }, [4, 2, 1].map((n, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        '--i': i
      }
    }, /*#__PURE__*/React.createElement("span", null, String(n).padStart(2, '0')), /*#__PURE__*/React.createElement("i", {
      style: {
        width: 45 + i * 20 + '%'
      }
    }))))
  }, /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0423\u0427\u0410\u0421\u0422\u0418\u0419",
    value: 8
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041F\u0420\u0418\u0417\u041E\u0412\u042B\u0415",
    value: 473,
    prefix: "$"
  }));
}
function MsCashScreen({
  onClose
}) {
  const [disc, setDisc] = React.useState("HOLD'EM"),
    [period, setPeriod] = React.useState('all'),
    [ex, setEx] = React.useState(null),
    [hands, setHands] = React.useState(false),
    [hand, setHand] = React.useState(null),
    [replay, setReplay] = React.useState(null);
  const c = meCareerFor(disc, period),
    col = MS_C.cash;
  return /*#__PURE__*/React.createElement(MsScreen, {
    title: "\u0421\u0422\u0410\u0422\u0418\u0421\u0422\u0418\u041A\u0410 \u041A\u042D\u0428\u0410",
    color: col,
    onClose: onClose,
    ex: ex,
    setEx: setEx,
    covered: hands || !!hand || !!replay,
    overlays: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.HandHistoryScreen, {
      open: hands,
      onClose: () => setHands(false),
      initialFormat: "CASH",
      initialDisc: disc === 'OMAHA' ? 'PLO' : disc,
      accent: UI.accent
    }), hand && /*#__PURE__*/React.createElement(window.HandDetailScreen, {
      open: true,
      hand: hand,
      index: 0,
      total: 1,
      onClose: () => setHand(null),
      onReplay: () => setReplay(hand),
      accent: UI.accent
    }), replay && /*#__PURE__*/React.createElement(window.HandReplayV2, {
      open: true,
      hand: replay,
      onClose: () => setReplay(null),
      accent: UI.accent
    }))
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-disc"
  }, /*#__PURE__*/React.createElement(window.SSegment, {
    options: [{
      id: "HOLD'EM",
      label: 'ХОЛДЕМ'
    }, {
      id: 'OMAHA',
      label: 'ОМАХА'
    }],
    value: disc,
    onChange: setDisc,
    accent: UI.accent
  })), /*#__PURE__*/React.createElement(MsPeriod, {
    value: period,
    onChange: setPeriod
  }), /*#__PURE__*/React.createElement(MsReveal, {
    key: disc + period,
    className: "ms-body"
  }, /*#__PURE__*/React.createElement(MsCashOverview, {
    c: c,
    period: period,
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsRivals, {
    disc: disc,
    period: period,
    onExplain: setEx
  }), /*#__PURE__*/React.createElement("div", {
    className: "ms-records"
  }, /*#__PURE__*/React.createElement(MeBiggestPot, {
    onReplay: setReplay
  })), /*#__PURE__*/React.createElement(MsHeading, {
    aside: "\u043D\u0430\u0436\u043C\u0438 \u043D\u0430 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u044C"
  }, "\u0418\u0413\u0420\u041E\u0412\u042B\u0415 \u041F\u041E\u041A\u0410\u0417\u0410\u0422\u0415\u041B\u0418"), /*#__PURE__*/React.createElement("div", {
    className: "ms-game-grid"
  }, MS_CASH_BARS.map(([label, k], i) => /*#__PURE__*/React.createElement(MsStyleMetric, {
    key: k,
    label: label,
    value: +c[k],
    index: i,
    ratio: k === 'af',
    onExplain: () => setEx(label)
  }))), /*#__PURE__*/React.createElement(MsRecentHands, {
    format: "CASH",
    disc: disc === 'OMAHA' ? 'PLO' : disc,
    onHistory: () => setHands(true),
    onHand: setHand
  })));
}
function MsResultRows({
  rows,
  leaderboard = false,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-result-list"
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "ms-result-row",
    onClick: onOpen ? () => onOpen(r) : undefined,
    disabled: !onOpen,
    key: i,
    style: {
      '--i': i
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-place",
    "data-podium": parseInt(r[leaderboard ? 2 : 3]) <= 3
  }, String(parseInt(r[leaderboard ? 2 : 3])).padStart(2, '0'), /*#__PURE__*/React.createElement("small", null, "\u041C\u0415\u0421\u0422\u041E")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, r[0]), /*#__PURE__*/React.createElement("span", null, r[1], !leaderboard ? ' · ' + r[3].split(' / ')[1] + ' игроков' : '')), /*#__PURE__*/React.createElement("b", null, r[leaderboard ? 3 : 4]))));
}
function useMsHandHistory(format) {
  const [hands, setHands] = React.useState(false),
    [hand, setHand] = React.useState(null),
    [replay, setReplay] = React.useState(null);
  return {
    covered: hands || !!hand || !!replay,
    widget: /*#__PURE__*/React.createElement(MsRecentHands, {
      format: format,
      onHistory: () => setHands(true),
      onHand: setHand
    }),
    overlays: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(window.HandHistoryScreen, {
      open: hands,
      onClose: () => setHands(false),
      initialFormat: format,
      accent: UI.accent
    }), hand && /*#__PURE__*/React.createElement(window.HandDetailScreen, {
      open: true,
      hand: hand,
      index: 0,
      total: 1,
      onClose: () => setHand(null),
      onReplay: () => setReplay(hand),
      accent: UI.accent
    }), replay && /*#__PURE__*/React.createElement(window.HandReplayV2, {
      open: true,
      hand: replay,
      onClose: () => setReplay(null),
      accent: UI.accent
    }))
  };
}
const MS_TOURNEY_RESULTS = [['Sunday Major', '2026-09-29', '$55', '3 / 412', '$1 240'], ['GOPC #201', '2026-09-28', '$22', '17 / 1080', '$96'], ['Turbo Night', '2026-09-27', '$11', '6 / 230', '$118'], ['Daily Deep', '2026-09-26', '$11', '24 / 640', '$42'], ['Evening Bounty', '2026-09-25', '$5', '9 / 280', '$67'], ['Daily Sprint', '2026-09-20', '$11', '2 / 180', '$280'], ['Sunday Mini', '2026-09-15', '$5', '1 / 390', '$380'], ['Summer Main', '2026-08-18', '$55', '1 / 810', '$1 600']];
function msTopResults(period) {
  const since = period === '7d' ? '2026-09-24' : period === '30d' ? '2026-09-01' : '';
  return MS_TOURNEY_RESULTS.filter(r => r[1] >= since).sort((a, b) => parseInt(a[3]) - parseInt(b[3]) || b[1].localeCompare(a[1])).slice(0, 5).map(r => [r[0], r[1].slice(8) + '.' + r[1].slice(5, 7), ...r.slice(2)]);
}
function MsMttScreen({
  onClose
}) {
  const history = useMsHandHistory('TOURNEY');
  const [result, setResult] = React.useState(null);
  const completed = result ? {
    id: 'history-' + result[0],
    status: 'completed',
    name: result[0],
    date: result[1],
    buyIn: result[2],
    place: parseInt(result[3]),
    entries: Number(result[3].split(' / ')[1]),
    prize: result[4]
  } : null;
  const [period, setPeriod] = React.useState('all'),
    [ex, setEx] = React.useState(null),
    k = period === '7d' ? .15 : period === '30d' ? .55 : 1;
  const totals = period === '7d' ? [13, 5, 3, 0] : period === '30d' ? [47, 9, 4, 1] : [86, 16, 6, 2];
  const steps = [['СЫГРАНО', 'PLAYED'], ['В ПРИЗАХ', 'CASHES'], ['ФИНАЛЬНЫЕ СТОЛЫ', 'FINAL TABLES'], ['ПОБЕДЫ', 'TITLES']].map(([l, key], i) => [l, totals[i], key]);
  return /*#__PURE__*/React.createElement(MsScreen, {
    title: "\u0422\u0423\u0420\u041D\u0418\u0420\u042B",
    color: MS_C.mtt,
    onClose: onClose,
    ex: ex,
    setEx: setEx,
    covered: history.covered || !!result,
    overlays: /*#__PURE__*/React.createElement(React.Fragment, null, history.overlays, completed && /*#__PURE__*/React.createElement(window.TournamentDetail, {
      open: true,
      liveEvent: completed,
      onClose: () => setResult(null),
      accent: UI.accent
    }))
  }, /*#__PURE__*/React.createElement(MsPeriod, {
    value: period,
    onChange: setPeriod
  }), /*#__PURE__*/React.createElement(MsReveal, {
    key: period,
    className: "ms-body"
  }, /*#__PURE__*/React.createElement("section", {
    className: "ms-equal-grid"
  }, /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041F\u0420\u0418\u0417\u041E\u0412\u042B\u0415",
    value: period === '7d' ? 1563 : period === '30d' ? 3420 : 6840,
    prefix: "$",
    metric: "PRIZES",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "ITM",
    value: Math.round(steps[1][1] / steps[0][1] * 100),
    suffix: "%",
    metric: "ITM",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0422\u0423\u0420\u041D\u0418\u0420\u041E\u0412",
    value: steps[0][1],
    metric: "PLAYED",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041B\u0423\u0427\u0428\u0415\u0415 \u041C\u0415\u0421\u0422\u041E",
    value: parseInt(msTopResults(period)[0][3]),
    prefix: "#",
    metric: "BEST FINISH",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0421\u0420\u0415\u0414\u041D\u0418\u0419 \u0424\u0418\u041D\u0418\u0428",
    value: period === '7d' ? 46 : period === '30d' ? 42 : 39,
    suffix: "%",
    metric: "AVG FINISH",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041B\u0423\u0427\u0428\u0418\u0419 \u041F\u0420\u0418\u0417",
    value: period === 'all' ? 1600 : 1240,
    prefix: "$",
    metric: "BEST PRIZE",
    onExplain: setEx
  })), /*#__PURE__*/React.createElement(MsRivals, {
    tournament: true,
    period: period,
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsHeading, null, "\u041E\u0422 \u0412\u0425\u041E\u0414\u0410 \u0414\u041E \u041F\u041E\u0411\u0415\u0414\u042B"), /*#__PURE__*/React.createElement("div", {
    className: "ms-journey"
  }, steps.map(([l, v, key], i) => /*#__PURE__*/React.createElement("button", {
    key: l,
    onClick: () => setEx(key),
    style: {
      '--i': i
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-journey-no"
  }, "0", i + 1), /*#__PURE__*/React.createElement("span", null, l, i > 0 && /*#__PURE__*/React.createElement("i", null, /*#__PURE__*/React.createElement("b", {
    style: {
      width: Math.max(3, v / steps[0][1] * 100) + '%'
    }
  }))), /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(MsNumber, {
    value: v
  }))))), /*#__PURE__*/React.createElement(MsHeading, null, "\u0422\u041E\u041F-5 \u0420\u0415\u0417\u0423\u041B\u042C\u0422\u0410\u0422\u041E\u0412 ", period === 'all' ? 'ЗА ВСЁ ВРЕМЯ' : period === '7d' ? 'ЗА 7 ДНЕЙ' : 'ЗА 30 ДНЕЙ'), /*#__PURE__*/React.createElement(MsResultRows, {
    rows: msTopResults(period),
    onOpen: setResult
  }), history.widget));
}
function MsSpinScreen({
  onClose
}) {
  const history = useMsHandHistory('SPIN & WIN');
  const [period, setPeriod] = React.useState('30d'),
    [ex, setEx] = React.useState(null),
    k = period === '7d' ? .15 : period === '30d' ? .55 : 1;
  return /*#__PURE__*/React.createElement(MsScreen, {
    title: "SPIN & WIN",
    color: MS_C.spin,
    onClose: onClose,
    ex: ex,
    setEx: setEx,
    covered: history.covered,
    overlays: history.overlays
  }, /*#__PURE__*/React.createElement(MsPeriod, {
    value: period,
    onChange: setPeriod
  }), /*#__PURE__*/React.createElement(MsReveal, {
    key: period,
    className: "ms-body"
  }, /*#__PURE__*/React.createElement("section", {
    className: "ms-hero ms-hero-spin"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow"
  }, "\u041B\u0423\u0427\u0428\u0418\u0419 \u041C\u041D\u041E\u0416\u0418\u0422\u0415\u041B\u042C"), /*#__PURE__*/React.createElement("div", {
    className: "ms-hero-main"
  }, /*#__PURE__*/React.createElement("button", {
    className: "ms-hero-value",
    onClick: () => setEx('BEST')
  }, /*#__PURE__*/React.createElement(MsNumber, {
    value: 100,
    prefix: "\xD7"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ms-detail-wheel"
  }, /*#__PURE__*/React.createElement(window.SpinPrize3D, null))), /*#__PURE__*/React.createElement("p", {
    className: "ms-sub"
  }, "Spin & Win $3 \xB7 29.09"), /*#__PURE__*/React.createElement("div", {
    className: "ms-spin-prizes"
  }, /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041F\u0420\u0418\u0417\u041E\u0412\u042B\u0415",
    value: Math.round(3790 * k),
    prefix: "$",
    metric: "PRIZES",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041B\u0423\u0427\u0428\u0418\u0419 \u041F\u0420\u0418\u0417",
    value: 300,
    prefix: "$",
    metric: "BEST PRIZE",
    onExplain: setEx
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ms-equal-grid"
  }, /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0421\u042B\u0413\u0420\u0410\u041D\u041E",
    value: Math.round(412 * k),
    metric: "PLAYED",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041F\u041E\u0411\u0415\u0414\u042B",
    value: 41,
    suffix: "%",
    metric: "WINS %",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0414\u0416\u0415\u041A\u041F\u041E\u0422\u042B",
    value: Math.round(2 * k),
    metric: "JACKPOTS",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0421\u0420\u0415\u0414\u041D\u0418\u0419",
    value: period === '7d' ? 3.4 : 3.1,
    decimals: 1,
    prefix: "\xD7",
    metric: "AVG",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0421\u0415\u0420\u0418\u042F \u041F\u041E\u0411\u0415\u0414",
    value: period === '7d' ? 3 : 6,
    metric: "WIN STREAK",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\xD725 \u0418 \u0412\u042B\u0428\u0415",
    value: Math.round(9 * k),
    metric: "\xD725 AND UP",
    onExplain: setEx
  })), " ", /*#__PURE__*/React.createElement(MsHeading, null, "\u0422\u0412\u041E\u0418 \u041C\u041D\u041E\u0416\u0418\u0422\u0415\u041B\u0418"), /*#__PURE__*/React.createElement("div", {
    className: "ms-chart-panel"
  }, /*#__PURE__*/React.createElement(MsBars, {
    items: ME_SPIN_DIST.map(([m, p]) => ['×' + m, p])
  }), /*#__PURE__*/React.createElement("div", {
    className: "ms-chart-key"
  }, /*#__PURE__*/React.createElement("i", null), "\u0414\u043E\u043B\u044F \u0438\u0433\u0440 \u0441 \u043A\u0430\u0436\u0434\u044B\u043C \u043C\u043D\u043E\u0436\u0438\u0442\u0435\u043B\u0435\u043C")), /*#__PURE__*/React.createElement(MsHeading, null, "\u041F\u041E\u0421\u041B\u0415\u0414\u041D\u0418\u0415 5 \u0418\u0413\u0420"), /*#__PURE__*/React.createElement("div", {
    className: "ms-spin-history"
  }, ME_SUM.spin.mult.slice(0, 5).map((m, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    "data-rare": m >= 25,
    style: {
      '--i': i
    }
  }, /*#__PURE__*/React.createElement("small", null, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("b", null, "\xD7", m)))), history.widget));
}
function MsLbScreen({
  onClose
}) {
  const [period, setPeriod] = React.useState('30d'),
    [ex, setEx] = React.useState(null),
    k = period === '7d' ? .15 : period === '30d' ? .55 : 1;
  return /*#__PURE__*/React.createElement(MsScreen, {
    title: "\u041B\u0418\u0414\u0415\u0420\u0411\u041E\u0420\u0414\u042B",
    color: MS_C.lb,
    onClose: onClose,
    ex: ex,
    setEx: setEx
  }, /*#__PURE__*/React.createElement(MsPeriod, {
    value: period,
    onChange: setPeriod
  }), /*#__PURE__*/React.createElement(MsReveal, {
    key: period,
    className: "ms-body"
  }, /*#__PURE__*/React.createElement("section", {
    className: "ms-hero"
  }, /*#__PURE__*/React.createElement("span", {
    className: "ms-eyebrow"
  }, "\u041B\u0423\u0427\u0428\u0418\u0419 \u0420\u0415\u0417\u0423\u041B\u042C\u0422\u0410\u0422"), /*#__PURE__*/React.createElement("div", {
    className: "ms-hero-main"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "ms-hero-value"
  }, /*#__PURE__*/React.createElement(MsNumber, {
    value: 1,
    prefix: "#"
  })), /*#__PURE__*/React.createElement("span", {
    className: "ms-hero-side"
  }, "Daily Hands", /*#__PURE__*/React.createElement("b", {
    className: "ms-smaller"
  }, "20 \u0421\u0415\u041D\u0422\u042F\u0411\u0420\u042F"))), /*#__PURE__*/React.createElement("div", {
    className: "ms-finish-line",
    "aria-hidden": "true"
  }, Array.from({
    length: 14
  }, (_, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    "data-lit": i < Math.round(5 * k),
    style: {
      '--i': i
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "ms-metrics-row"
  }, /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0423\u0427\u0410\u0421\u0422\u0418\u0419",
    value: Math.round(14 * k),
    metric: "ENTERED",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0412 \u041F\u0420\u0418\u0417\u0410\u0425",
    value: Math.round(5 * k),
    metric: "PRIZE PLACES",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u041F\u0420\u0418\u0417\u041E\u0412\u042B\u0415",
    value: Math.round(860 * k),
    prefix: "$",
    metric: "PRIZES",
    onExplain: setEx
  }))), /*#__PURE__*/React.createElement(MsHeading, {
    aside: "2 \u0441\u043E\u0440\u0435\u0432\u043D\u043E\u0432\u0430\u043D\u0438\u044F"
  }, "\u0421\u0415\u0419\u0427\u0410\u0421 \u0423\u0427\u0410\u0421\u0422\u0412\u0423\u0415\u0428\u042C"), /*#__PURE__*/React.createElement("div", {
    className: "ms-active-races"
  }, [["Weekly Hold'em Race", 4, 18420], ['Spin Rush', 11, 6120]].map(([title, rank, points], i) => /*#__PURE__*/React.createElement("section", {
    key: title,
    style: {
      '--i': i
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "ms-live-dot"
  }), "\u0414\u041E \u041A\u041E\u041D\u0426\u0410 2 \u0414\u041D. 4 \u0427.", /*#__PURE__*/React.createElement("strong", null, title)), /*#__PURE__*/React.createElement("div", {
    className: "ms-race-meta"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(MsNumber, {
    value: rank,
    prefix: "#"
  })), "\u043C\u0435\u0441\u0442\u043E"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, /*#__PURE__*/React.createElement(MsNumber, {
    value: points
  })), "\u043E\u0447\u043A\u043E\u0432"))))), /*#__PURE__*/React.createElement(MsHeading, null, "\u0418\u0421\u0422\u041E\u0420\u0418\u042F \u0420\u0415\u0417\u0423\u041B\u042C\u0422\u0410\u0422\u041E\u0412"), /*#__PURE__*/React.createElement(MsResultRows, {
    rows: ME_LB,
    leaderboard: true
  }), /*#__PURE__*/React.createElement("div", {
    className: "ms-detail-metrics"
  }, /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0422\u041E\u041F-10",
    value: Math.round(4 * k),
    metric: "TOP 10",
    onExplain: setEx
  }), /*#__PURE__*/React.createElement(MsMetric, {
    label: "\u0421\u0420\u0415\u0414\u041D\u0415\u0415 \u041C\u0415\u0421\u0422\u041E",
    value: 7.4,
    decimals: 1,
    metric: "AVG PLACE",
    onExplain: setEx
  }))));
}
function MsRecentHands({
  onHistory,
  onHand,
  format = 'ALL',
  disc = 'ALL'
}) {
  const rows = [...(window.hhHands || [])].filter(h => (format === 'ALL' || h.format === format) && (disc === 'ALL' || h.disc === disc)).sort((a, b) => b.when.localeCompare(a.when)).slice(0, 3);
  return /*#__PURE__*/React.createElement(MsReveal, {
    className: "ms-recent-hands"
  }, /*#__PURE__*/React.createElement("section", {
    "data-format": format,
    "aria-label": "\u041F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u0442\u0440\u0438 \u0440\u0430\u0437\u0434\u0430\u0447\u0438",
    className: "ms-hands-card"
  }, /*#__PURE__*/React.createElement("header", null, /*#__PURE__*/React.createElement("span", {
    className: "ms-hands-icon",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "21",
    height: "21",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 10a9 9 0 1 1 2 8M3 4v6h6M12 7v5l3 2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("h3", null, "\u0418\u0421\u0422\u041E\u0420\u0418\u042F \u0420\u0410\u0417\u0414\u0410\u0427"), /*#__PURE__*/React.createElement("small", null, format === 'ALL' ? 'Последние раздачи' : format === 'CASH' ? 'Кэш · ' + (disc === 'PLO' ? 'Омаха' : 'Холдем') : format === 'TOURNEY' ? 'Турниры' : 'Spin & Win'))), /*#__PURE__*/React.createElement("div", {
    className: "ms-hands-rows"
  }, rows.map(h => /*#__PURE__*/React.createElement(window.HhHandRow, {
    key: h.id || h.when,
    hand: {
      ...h,
      street: {
        PREFLOP: "ПРЕФЛОП",
        FLOP: "ФЛОП",
        TURN: "ТЁРН",
        RIVER: "РИВЕР",
        SHOWDOWN: "ВСКРЫТИЕ"
      }[h.street] || h.street
    },
    onOpen: () => onHand(h)
  }))), /*#__PURE__*/React.createElement("button", {
    className: "ms-hands-all",
    onClick: onHistory
  }, "\u0412\u0421\u042F \u0418\u0421\u0422\u041E\u0420\u0418\u042F", /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m9 5 7 7-7 7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))));
}
function MeStatsWidget({
  onOpen,
  onFull,
  onHistory,
  onHand
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "career-statistics ms-overview",
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement(MsHeading, null, "\u041C\u041E\u042F \u0421\u0422\u0410\u0422\u0418\u0421\u0422\u0418\u041A\u0410"), /*#__PURE__*/React.createElement("div", {
    className: "ms-preview-list"
  }, /*#__PURE__*/React.createElement(MsCashWidget, {
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement(MsMttWidget, {
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement(MsSpinWidget, {
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement(MsLbWidget, {
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement(MsRecentHands, {
    onHistory: onHistory,
    onHand: onHand
  }), /*#__PURE__*/React.createElement("button", {
    className: "ms-records-link",
    onClick: onFull
  }, /*#__PURE__*/React.createElement("span", null, "DOT RECORDS", /*#__PURE__*/React.createElement("small", null, "\u0412\u0441\u044F \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043A\u0430 \u0438 \u0440\u0430\u0437\u0434\u0430\u0447\u0438")), /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 18 18 6M6 6h12v12"
  })))));
}
function CareerStatsScreen({
  open,
  section = 'cash',
  onClose
}) {
  if (!open) return null;
  const Screen = {
    cash: MsCashScreen,
    mtt: MsMttScreen,
    spin: MsSpinScreen,
    lb: MsLbScreen
  }[section] || MsCashScreen;
  return /*#__PURE__*/React.createElement(Screen, {
    onClose: onClose
  });
}
Object.assign(window, {
  MeStatsWidget,
  CareerStatsScreen,
  MsFullStatsSheet,
  MS_EXPLAIN,
  MsReveal,
  MsNumber
});
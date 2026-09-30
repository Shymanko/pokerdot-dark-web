"use strict";
// leagues53.jsx — 53-рівнева ліга v3 (масті, легенди, спец-карти) для DEV-режиму «53 карти в ізометрії». Живе поруч із 13-рівневою.
{
  // Leagues & Levels — the loyalty progression system.
  //
  // МІГРАЦІЯ (вересень 2026): метали → МАСТІ чотириколірної колоди.
  //   • 5 ліг-мастей: БУБИ ♦ (сині) → КРЕСТИ ♣ (зелені) → ЧЕРВИ ♥ (червоні)
  //     → ПІКИ ♠ (сталеві/чорні) → DOT ● (золота точка, старша за всіх,
  //     зі свіченням). Порядок черви↔піки — робоче рішення прототипу
  //     (бридж-порядок), помінявся вердикт — поміняти два рядки.
  //   • 65 рівнів — карти від 2 до туза, по 13 на лігу. Нагорода рівня
  //     подається КАРТОЮ (перевертання), сундуки скасовано. Туз — фінал масті.
  //   • Рівень тепер ПУБЛІЧНИЙ: у профілі видно і лігу, і карту.
  //   • mult — внутрішній множник виплати сейфа. НІДЕ не показується
  //     гравцеві, як і будь-які відсотки повернення.
  //   • safeThreshold — поріг відкриття сейфа (серверна настройка),
  //     xpRate — коефіцієнт XP за рейк (серверна настройка).
  //
  // Exposed on window: cmLeague (data + helpers), cmPlayer (current state),
  // LeagueFrame (рамка аватара в кольорі масті зі знаком).

  // v3 (17.09.2026, правка Вадима): рівні йдуть ПО НОМІНАЛАХ, а всередині
  // номіналу — по мастях ♦ → ♣ → ♥ → ♠. Тобто 2♦ 2♣ 2♥ 2♠, 3♦ 3♣ 3♥ 3♠ … A♠,
  // і остання, 53-тя карта — туз DOT. min/max нижче — перша й остання карта
  // масті в цьому порядку (лишені для сумісності старого коду).
  const LEAGUES = [{
    id: "diamonds",
    name: "DIAMONDS",
    ru: "БУБИ",
    suit: "♦",
    min: 1,
    max: 49,
    color: "#3B82F6",
    ink: "#fff",
    mult: 0.90
  }, {
    id: "clubs",
    name: "CLUBS",
    ru: "КРЕСТИ",
    suit: "♣",
    min: 2,
    max: 50,
    color: "#2FA84F",
    ink: "#fff",
    mult: 1.00
  }, {
    id: "hearts",
    name: "HEARTS",
    ru: "ЧЕРВИ",
    suit: "♥",
    min: 3,
    max: 51,
    color: "#E5484D",
    ink: "#fff",
    mult: 1.05
  }, {
    id: "spades",
    name: "SPADES",
    ru: "ПИКИ",
    suit: "♠",
    min: 4,
    max: 52,
    color: "#C8CDD4",
    ink: "#0b0b0d",
    mult: 1.10
  },
  // v3 (17.09.2026): DOT — одна карта, туз. 4 × 13 + 1 = 53 рівні.
  {
    id: "dot",
    name: "DOT",
    ru: "DOT",
    suit: "●",
    min: 53,
    max: 53,
    color: "#D4AA55",
    ink: "#171108",
    mult: 1.15,
    glow: true
  }];
  const CM_TOTAL = 53;

  // Ранги карт усередині ліги: 13 рівнів = 2…10, J, Q, K, A.
  const CM_RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];

  // Every document load starts the presentation with an earned, sealed K♣.
  // Claiming it updates this session only; reloading restores the demo moment.
  const cmPlayer = {
    level: 42,
    xp: 1000,
    xpNext: 1000,
    pendingLevel: 43,
    // Q♣ (легендарна Mortensen), готова Q♥
    safeXp: 1380,
    safeThreshold: 1000,
    xpRate: 100 // xpRate: XP за $1 рейку
  };
  function lgIndexForLevel(lvl) {
    const n = Math.max(1, Math.min(CM_TOTAL, Math.round(lvl) || 1));
    return n >= CM_TOTAL ? 4 : (n - 1) % 4;
  }
  function lgRankIndexForLevel(lvl) {
    const n = Math.max(1, Math.min(CM_TOTAL, Math.round(lvl) || 1));
    return n >= CM_TOTAL ? 12 : Math.floor((n - 1) / 4);
  }
  // рівень за номіналом і мастю: level("Q", "clubs") = 42
  function lgLevelFor(rank, suitId) {
    if (suitId === "dot") return CM_TOTAL;
    return CM_RANKS.indexOf(rank) * 4 + LEAGUES.findIndex(l => l.id === suitId) + 1;
  }
  function lgForLevel(lvl) {
    return LEAGUES[lgIndexForLevel(lvl)];
  }
  function lgRankForLevel(lvl) {
    return CM_RANKS[lgRankIndexForLevel(lvl)];
  }
  // v3: крок додаткового РБ за номіналом (рішення Вадима 17.09.2026):
  // 2–3 +0,5 · 4–5 +0,75 · 6–7 +1 · 8–10 +1,25 · J–Q +1,5 · K +2 · A +3 · туз DOT +5
  const CM_RB_STEPS = [0.5, 0.5, 0.75, 0.75, 1, 1, 1.25, 1.25, 1.25, 1.5, 1.5, 2, 3];
  function lgRbStep(lvl) {
    const n = Math.max(1, Math.min(CM_TOTAL, Math.round(lvl) || 1));
    if (n >= CM_TOTAL) return 5;
    return CM_RB_STEPS[Math.floor((n - 1) / 4)];
  }
  // накопичений бонус до стандартного РБ — сума кроків усіх відкритих карт (Q♣ = 42 → +42 %)
  function lgRbExtra(lvl) {
    const n = Math.max(1, Math.min(CM_TOTAL, Math.round(lvl) || 1));
    let sum = 0;
    for (let i = 1; i <= n; i++) sum += lgRbStep(i);
    return Math.round(sum * 100) / 100;
  }
  // видимий кешбек: стандартні 10 % × (1 + бонус). Рівень 0 — стандарт без карт.
  const CM_RB_BASE = 10;
  function lgRbPercent(lvl) {
    const n = Math.max(0, Math.min(CM_TOTAL, Math.round(lvl) || 0));
    if (window.rbCalculation) return Math.round(window.rbCalculation({
      cardLevel: n
    }).total * 10) / 10;
    if (n === 0) return CM_RB_BASE;
    return Math.round(CM_RB_BASE * (1 + lgRbExtra(n) / 100) * 10) / 10;
  }
  // v3: нагорода під кожною картою — гравець не знає її до відкриття.
  // Детермінована за рівнем, щоб демо було стабільним.
  const CM_REWARD_KINDS = [{
    kind: "cash",
    label: "BONUS CASH",
    unit: "$"
  }, {
    kind: "tdollar",
    label: "TOURNAMENT DOLLARS",
    unit: "T$"
  }, {
    kind: "spin",
    label: "SPIN & WIN TICKETS",
    unit: "×"
  }];
  // v3 (18.09.2026): під кожною картою завжди дві нагороди на вибір —
  // кеш-долари або турнірні долари (+10 %). Вибір гравця зберігається у cmRewardPicks.
  window.cmRewardPicks53 = window.cmRewardPicks53 || {};
  function lgCardReward(lvl, pick) {
    const idx = lgIndexForLevel(lvl),
      ri = lgRankIndexForLevel(lvl),
      rank = lgRankForLevel(lvl);
    const ace = rank === "A",
      legend = !!(window.cmLegends53 && window.cmLegends53[lvl]);
    let cash = 3 + ri * 2 + idx;
    if (ace) cash = cash * 5;
    if (legend) cash = cash * 2;
    if (idx >= 4) cash = 500;
    const tdollar = Math.round(cash * 1.1 * 10) / 10;
    const options = [{
      kind: "cash",
      unit: "C$",
      label: "Cash dollars",
      amount: cash,
      text: "C$" + cash
    }, {
      kind: "tdollar",
      unit: "T$",
      label: "Tournament dollars",
      amount: tdollar,
      text: "T$" + tdollar
    }];
    const kind = pick || window.cmRewardPicks53[lvl] || "cash";
    const chosen = options.find(o => o.kind === kind) || options[0];
    return {
      ...chosen,
      options,
      ace,
      legend,
      rbNow: lgRbPercent(lvl - 1),
      rbNext: lgRbPercent(lvl)
    };
  }
  function lgCardForLevel(lvl) {
    const lg = lgForLevel(lvl);
    return lgRankForLevel(lvl) + lg.suit;
  }
  // застаріле: відсотки кешбеку прибрані з продукту повністю; лишається
  // заглушкою, щоб старий код не падав, але НІЩО не має це показувати
  function lgCashbackForLevel() {
    return null;
  }
  // shift a hex toward white (amt>0) or black (amt<0)
  function lgShade(hex, amt) {
    const h = hex.replace("#", "");
    const n = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    const cl = v => Math.max(0, Math.min(255, v + amt));
    return `rgb(${cl(parseInt(n.slice(0, 2), 16))},${cl(parseInt(n.slice(2, 4), 16))},${cl(parseInt(n.slice(4, 6), 16))})`;
  }
  window.cmLeague53 = {
    LEAGUES,
    RANKS: CM_RANKS,
    TOTAL: CM_TOTAL,
    rankIndexForLevel: lgRankIndexForLevel,
    levelFor: lgLevelFor,
    rbPercent: lgRbPercent,
    rbExtra: lgRbExtra,
    rbStep: lgRbStep,
    get rbBase() {
      return window.rbCalculation ? window.rbCalculation().base : CM_RB_BASE;
    },
    cardReward: lgCardReward,
    indexForLevel: lgIndexForLevel,
    forLevel: lgForLevel,
    rankForLevel: lgRankForLevel,
    cardForLevel: lgCardForLevel,
    cashbackForLevel: lgCashbackForLevel,
    shade: lgShade
  };
  window.cmPlayer53 = cmPlayer;

  // Editorial collector editions. Names are typeset inscriptions, not autographs
  // or endorsements. Final hands: official WSOP 2012 Media Guide, printed p. 63.
  window.cmLegends53 = {
    4: {
      name: 'Chris Moneymaker',
      year: '2003',
      hand: '5♦ 4♠',
      title: 'THE MONEYMAKER EFFECT',
      story: 'With 5♦ 4♠, Chris Moneymaker beat Sam Farha in the final hand of the 2003 WSOP Main Event. A five on the river completed his full house.'
    },
    7: {
      name: 'Jerry Yang',
      year: '2007',
      hand: '8♦ 8♣',
      title: 'THE FINAL EIGHT',
      story: 'Jerry Yang won the 2007 WSOP Main Event with 8♦ 8♣. In the final hand, his pocket eights defeated Tuan Lam’s A♦ Q♦.'
    },
    21: {
      name: 'Johnny Chan',
      year: '1988',
      hand: 'J♣ 9♣',
      title: 'BACK TO BACK',
      story: 'Johnny Chan held J♣ 9♣ against Erik Seidel in the final hand of the 1988 WSOP Main Event. His straight secured a second consecutive Main Event title.'
    },
    24: {
      name: 'Carlos Mortensen',
      year: '2001',
      hand: 'K♣ Q♣',
      title: 'EL MATADOR',
      story: 'Q♣ was part of Carlos Mortensen’s winning K♣ Q♣ hand in the 2001 WSOP Main Event final. He defeated Dewey Tomko, who held A♠ A♥.'
    },
    39: {
      name: 'Stu Ungar',
      year: '1997',
      hand: 'A♥ 4♣',
      title: 'THE COMEBACK',
      story: 'With A♥ 4♣, Stu Ungar defeated John Strzemp in the final hand of the 1997 WSOP Main Event. A river deuce completed his straight and his third Main Event title.'
    },
    41: {
      name: 'Joe Hachem',
      year: '2005',
      hand: '7♣ 3♠',
      title: 'THE UNLIKELY HAND',
      story: 'Joe Hachem won the 2005 WSOP Main Event holding 7♣ 3♠. He defeated Steve Dannenmann’s A♦ 3♣ in the final hand to claim the championship.'
    },
    48: {
      name: 'Doyle Brunson',
      year: '1976',
      hand: '10♠ 2♠',
      title: 'TEXAS DOLLY',
      story: 'Doyle Brunson won the 1976 WSOP Main Event holding 10♠ 2♠. A year later, he won again with ten-deuce, making the combination his signature hand.'
    }
  };
  // Verified final-hand records; each source is exposed in its story.
  window.cmLegendHands53 = {
    "4": {
      "opponent": "Sam Farha",
      "hero": ["5♦", "4♠"],
      "villain": ["J♥", "10♦"],
      "board": ["J♠", "5♠", "4♣", "8♦", "5♥"],
      "best": ["5♦", "5♠", "5♥", "4♠", "4♣"],
      "result": "Фулл-хаус · пятёрки и четвёрки",
      "otherResult": "Две пары · валеты и пятёрки",
      "prize": "$2 500 000",
      "intro": "Бухгалтер, прошедший онлайн-отбор, против опытного Сэма Фархи. В 2003 году Moneymaker выиграл Main Event среди 839 участников. Его победа стала символом покерного бума — а последняя раздача началась со скромных 5♦ 4♠.",
      "legacy": "Почему именно 5♦",
      "legacyText": "Эта пятёрка участвовала в двух парах на флопе и в чемпионском фулл-хаусе на ривере. Здесь запечатлён финальный выигрыш Moneymaker; его знаменитый блеф с королём был другой раздачей.",
      "steps": ["Фарха повышает до 100 000, Moneymaker уравнивает с 5♦ 4♠. Впереди пять общих карт.", "У Moneymaker две пары; у Фархи — старшая пара валетов. После ставок и рейзов оба оказываются олл-ин.", "Восьмёрка не меняет лидера. Две пары Moneymaker всё ещё сильнее пары валетов.", "Пятёрка превращает две пары в фулл-хаус. Фарха получает две пары, но этого недостаточно: чемпион — Moneymaker."],
      "sources": [{
        "label": "Card Player · финальная раздача",
        "url": "https://www.cardplayer.com/poker-news/4658-wsop-history-2003-recap"
      }, {
        "label": "Card Player · карты тёрна и ривера",
        "url": "https://www.cardplayer.com/cardplayer-poker-magazines/66238-kyle-julius-26-10/articles/21241-happy-10th-anniversary-mr-moneymaker"
      }]
    },
    "7": {
      "opponent": "Tuan Lam",
      "hero": ["8♦", "8♣"],
      "villain": ["A♦", "Q♦"],
      "board": ["Q♣", "9♣", "5♠", "7♦", "6♥"],
      "best": ["9♣", "8♦", "7♦", "6♥", "5♠"],
      "result": "Стрит · до девятки",
      "otherResult": "Пара дам",
      "prize": "$8 250 000",
      "intro": "Финал Main Event 2007 закончился на 205-й раздаче финального стола. В решающем олл-ине Джерри Янга карманные восьмёрки встретились с A♦ Q♦ Туана Лама. После флопа победа выглядела далёкой.",
      "legacy": "Восьмёрка между семёркой и девяткой",
      "legacyText": "Титул принёс не сет восьмёрок. Янг собрал стрит через тёрн и ривер: одна из его карманных восьмёрок соединила 5–6–7 с девяткой на столе. Так 8♦ стала частью чемпионской пятёрки карт.",
      "steps": ["Янг повышает до 2,3 млн. Лам ставит все 22,2 млн, и Янг уравнивает с парой восьмёрок.", "Дама выводит Лама вперёд. Его пара дам сильнее восьмёрок Янга.", "Семёрка даёт Янгу шанс на стрит через шестёрку. Также его спасла бы ещё одна восьмёрка.", "Шестёрка замыкает 5–6–7–8–9. Стрит Янга побеждает пару дам и приносит ему титул."],
      "sources": [{
        "label": "PokerNews · репортаж, раздача №205",
        "url": "https://www.pokernews.com/tours/wsop/2007-wsop/event-55-world-championship-no-limit-holdem/post.28755.htm"
      }]
    },
    "21": {
      "opponent": "Erik Seidel",
      "hero": ["J♣", "9♣"],
      "villain": ["Q♣", "7♥"],
      "board": ["Q♠", "10♥", "8♦", "2♠", "6♦"],
      "best": ["Q♠", "J♣", "10♥", "9♣", "8♦"],
      "result": "Стрит · до дамы",
      "otherResult": "Пара дам",
      "prize": "$700 000",
      "intro": "Джонни Чан защищал чемпионский титул, а Эрик Сайдел играл свой первый Main Event. Их финал 1988 года позже показали в фильме «Шулера» (Rounders). Суть ловушки видна уже на флопе: оба игрока попали в доску, но совершенно по-разному.",
      "legacy": "Спокойствие с готовым стритом",
      "legacyText": "Чан получил лучшую возможную комбинацию уже на флопе, но не раскрыл силу руки. Валет и девятка связывают три карты стола в стрит. Эта раздача принесла ему второй Main Event подряд.",
      "steps": ["Чан входит в раздачу с J♣ 9♣. Сайдел с Q♣ 7♥ смотрит флоп без повышения.", "У Чана сразу стрит до дамы. Сайдел попадает в старшую пару, делает чек-рейз и получает колл.", "Оба пропускают ставку. Двойка ничего не меняет; у Сайдела уже нет карты, которая могла бы спасти его на ривере.", "Сайдел ставит олл-ин с парой дам. Чан сразу уравнивает и показывает победный стрит."],
      "sources": [{
        "label": "Poker Red · разбор всех улиц",
        "url": "https://www.poker-red.com/manos-al-detalle/wsop-1988-johnny-chan-vs-erik-seidel"
      }]
    },
    "24": {
      "opponent": "Dewey Tomko",
      "hero": ["K♣", "Q♣"],
      "villain": ["A♠", "A♥"],
      "board": ["J♦", "10♣", "3♣", "3♦", "9♦"],
      "best": ["K♣", "Q♣", "J♦", "10♣", "9♦"],
      "result": "Стрит · до короля",
      "otherResult": "Две пары · тузы и тройки",
      "prize": "$1 500 000",
      "intro": "В финале 2001 года Карлос Мортенсен оказался против карманных тузов Дьюи Томко. K♣ Q♣ ещё не были готовой сильной рукой, но на флопе получили сразу два пути к победе: флеш и стрит.",
      "legacy": "Дама, которая соединила стрит",
      "legacyText": "Мортенсен не собрал флеш. Решила всё бубновая девятка: вместе с K♣ Q♣, валетом и десяткой она дала стрит до короля. Поэтому именно Q♣ хранит эту историю в коллекции.",
      "steps": ["Томко повышает до 100 000 с тузами. Мортенсен уравнивает с одномастными королём и дамой.", "У Мортенсена флеш-дро и двустороннее стрит-дро. Он ставит, получает рейз, идёт олл-ин; Томко уравнивает.", "Тройка спаривает стол. Томко сохраняет преимущество с двумя парами: тузами и тройками.", "Девятка закрывает стрит 9–10–J–Q–K. Он сильнее двух пар Томко: Мортенсен выигрывает чемпионат."],
      "sources": [{
        "label": "Card Player · свидетель финала, Matt Lessinger",
        "url": "https://www.cardplayer.com/cardplayer-poker-magazines/65752-phil-ivey-22-14/articles/18566-a-flashback-to-the-2001-world-series-of-poker-main-event"
      }]
    },
    "39": {
      "opponent": "John Strzemp",
      "hero": ["A♥", "4♣"],
      "villain": ["A♠", "8♣"],
      "board": ["A♣", "5♦", "3♥", "3♦", "2♠"],
      "best": ["5♦", "4♣", "3♥", "2♠", "A♥"],
      "result": "Стрит · от туза до пятёрки",
      "otherResult": "Две пары · тузы и тройки",
      "prize": "$1 000 000",
      "intro": "В 1997 году финал проходил под открытым небом на Fremont Street. Стю Ангар вернулся за третьим титулом Main Event после побед 1980 и 1981 годов. В решающей раздаче его туз встретился с тузом Джона Стремпа — и худшим был именно кикер Ангара.",
      "legacy": "Туз, который сыграл как единица",
      "legacyText": "На ривере A♥ перестал быть просто частью пары тузов. Он стал младшей картой стрита A–2–3–4–5. Это завершило возвращение Ангара и принесло ему третий титул Main Event.",
      "steps": ["Ангар повышает до 60 000. Стремп уравнивает с A♠ 8♣ против A♥ 4♣.", "Оба получают пару тузов, но восьмёрка Стремпа сильнее четвёрки. После его ставки Ангар идёт олл-ин и получает колл.", "На столе пара троек. У обоих две пары, но восьмёрка всё ещё оставляет Стремпа впереди.", "Двойка завершает стрит Ангара A–2–3–4–5. Две пары Стремпа проигрывают — у Ангара третий чемпионский титул."],
      "sources": [{
        "label": "Card Player · финал 1997 года",
        "url": "https://www.cardplayer.com/poker-news/4607-wsop-history-1997-recap"
      }]
    },
    "41": {
      "opponent": "Steve Dannenmann",
      "hero": ["7♣", "3♠"],
      "villain": ["A♦", "3♣"],
      "board": ["6♥", "5♦", "4♦", "A♠", "4♣"],
      "best": ["7♣", "6♥", "5♦", "4♦", "3♠"],
      "result": "Стрит · до семёрки",
      "otherResult": "Две пары · тузы и четвёрки",
      "prize": "$7 500 000",
      "intro": "После длинного финального стола 2005 года всё решил короткий хедз-ап. Джо Хашем встретил повышение Стива Данненманна с 7♣ 3♠ — неприметной рукой, которой флоп сразу подарил стрит.",
      "legacy": "Почему семёрка важнее туза",
      "legacyText": "Туз на тёрне дал Данненманну старшую пару, но не преимущество. Семёрка Хашема уже венчала стрит 3–4–5–6–7. Соперник мог только разделить банк, если бы на ривере тоже вышла семёрка.",
      "steps": ["Данненманн повышает до 700 000. Хашем уравнивает с 7♣ 3♠.", "Хашем получает стрит до семёрки, делает чек-рейз. Данненманн уравнивает: ему не хватает карты до стрита.", "Туз даёт Данненманну старшую пару. После серии повышений оба идут олл-ин, но стрит Хашема уже впереди.", "Четвёрка не приносит делёжку. У Данненманна две пары, у Хашема — победный стрит до семёрки."],
      "sources": [{
        "label": "Card Player · Hand History Time Capsule",
        "url": "https://www.cardplayer.com/poker-news/11766-hand-history-time-capsule-joe-hachem"
      }]
    },
    "48": {
      "opponent": "Jesse Alto",
      "hero": ["10♠", "2♠"],
      "villain": ["A♠", "J♦"],
      "board": ["A♥", "J♠", "10♥", "2♣", "10♦"],
      "best": ["10♠", "10♥", "10♦", "2♠", "2♣"],
      "result": "Фулл-хаус · десятки и двойки",
      "otherResult": "Две пары · тузы и валеты",
      "prize": "$220 000",
      "intro": "В финале 1976 года Дойл Брансон держал 10♠ 2♠ против A–J Джесси Альто. На флопе младшая пара столкнулась с двумя старшими парами. Брансон проигрывал — ему понадобились обе оставшиеся карты стола.",
      "legacy": "Так появилась «рука Дойла»",
      "legacyText": "Сначала двойка, затем десятка: две улицы превратили слабую пару в фулл-хаус. Через год Брансон снова выиграл Main Event с десяткой и двойкой. Сочетание 10–2 навсегда связали с его именем.",
      "steps": ["Альто повышает с A–J. Брансон уравнивает с 10♠ 2♠, имея преимущество по фишкам.", "Альто получает две пары: тузы и валеты. Брансон с парой десяток отвечает олл-ином на ставку и получает колл.", "У Брансона тоже две пары, но десятки и двойки всё ещё слабее тузов и валетов Альто.", "Ещё одна десятка даёт Брансону фулл-хаус. Он побеждает две пары Альто и забирает титул."],
      "note": "Карты Альто указаны по архиву WSOP; в поздних пересказах масти его A–J различаются.",
      "sources": [{
        "label": "WSOP · официальный архив финальных рук",
        "url": "https://www.wsop.com/pdfs/reports/12101/2012%20WSOP%20Media%20Guide.pdf#page=64"
      }, {
        "label": "PokerStars · последовательность борда",
        "url": "https://www.pokerstarsnews.it/poker-sportivo/la-storia-della-doyle-brunson-hand/23495/"
      }]
    }
  };
  // v3: порядок по номіналах — легенди переїжджають на нові рівні (та сама карта),
  // Moneymaker представлений 4♠ (номінал 4), Chan — J♣ (номінал J).
  (function () {
    const M = {
      4: 12,
      7: 25,
      21: 38,
      24: 42,
      39: 51,
      41: 8,
      48: 36
    };
    const L2 = {},
      H2 = {};
    Object.entries(window.cmLegends53).forEach(([k, v]) => {
      L2[M[k] || k] = v;
    });
    Object.entries(window.cmLegendHands53).forEach(([k, v]) => {
      H2[M[k] || k] = v;
    });
    window.cmLegends53 = L2;
    window.cmLegendHands53 = H2;
    L2[12].legacy = undefined;
    H2[12].legacy = 'Почему именно 4♠';
    H2[12].legacyText = 'Четвёрка дала Moneymaker две пары уже на флопе, а на ривере вошла в чемпионский фулл-хаус: пятёрки на четвёрках. Здесь запечатлён финальный выигрыш; знаменитый блеф с королём был другой раздачей.';
    H2[38].legacy = 'Валет, который замкнул стрит';
  })();
  Object.entries(window.cmLegendHands53).forEach(([level, hand]) => {
    window.cmLegends53[level].finalHand = hand;
  });
  window.cmLegendSource53 = 'https://www.wsop.com/pdfs/reports/12101/2012%20WSOP%20Media%20Guide.pdf#page=64';
  if (typeof document !== "undefined" && !document.getElementById("cm-kf")) {
    const st = document.createElement("style");
    st.id = "cm-kf";
    st.textContent = "@keyframes cm-dot-glow{0%,100%{box-shadow:0 0 8px #D4AA55aa,0 0 22px #D4AA5555}50%{box-shadow:0 0 14px #D4AA55ee,0 0 36px #D4AA5588}}";
    document.head.appendChild(st);
  }

  // ── Avatar frame ────────────────────────────────────────────────────────
  // Кільце в кольорі масті + знак масті внизу рамки. DOT дихає свіченням —
  // візуально явно «старший» за черви. status — зелена онлайн-точка.
  function LeagueFrame({
    player = true,
    frameId,
    level = cmPlayer.level,
    size = 36,
    ring = 2.5,
    status = false,
    spin = false,
    cardBadge = false,
    suitBadge = false,
    children,
    style
  }) {
    const idx = lgIndexForLevel(level);
    const lg = LEAGUES[idx];
    const c = lg.color;
    const sheen = `conic-gradient(from 130deg, ${c}, ${lgShade(c, 80)} 13%, ${c} 33%, ${lgShade(c, -55)} 57%, ${c} 80%, ${lgShade(c, 80)} 93%, ${c})`;
    const glow = 4 + idx * 3;
    const badge = Math.max(12, Math.round(size * 0.3));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: "relative",
        width: size,
        height: size,
        flex: "none",
        ...style
      }
    }, idx >= 3 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: -3,
        borderRadius: "50%",
        border: `1px solid ${c}55`,
        boxShadow: `0 0 ${glow + 4}px ${c}55`,
        animation: lg.glow ? "cm-dot-glow 1.8s ease-in-out infinite" : "none"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        background: sheen,
        boxShadow: `0 0 ${glow}px ${c}66, inset 0 0 3px rgba(0,0,0,.4)`,
        animation: spin ? "pp-spin 8s linear infinite" : "none"
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: "absolute",
        inset: ring,
        borderRadius: "50%",
        background: "#000",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }
    }, children), window.LegendFrameOverlay && /*#__PURE__*/React.createElement(window.LegendFrameOverlay, {
      player: player,
      frameId: frameId
    }), cardBadge && size >= 30 && /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: {
        position: "absolute",
        left: "50%",
        bottom: -badge * 0.55,
        transform: "translateX(-50%)",
        display: "inline-flex",
        borderRadius: Math.max(3, badge * 0.16),
        boxShadow: "0 0 0 2px #0b0b0d, 0 2px 8px rgba(0,0,0,.6)"
      }
    }, /*#__PURE__*/React.createElement(LevelCard, {
      level: level,
      w: Math.round(badge * 1.05),
      face: true
    })), !cardBadge && suitBadge && size >= 30 && /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: {
        position: "absolute",
        left: "50%",
        bottom: -badge * 0.32,
        transform: "translateX(-50%)",
        width: badge,
        height: badge,
        borderRadius: "50%",
        background: c,
        color: lg.ink,
        border: "2px solid #0b0b0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: badge * (lg.id === "dot" ? 0.5 : 0.62),
        lineHeight: 1,
        fontFamily: UI.fontUI,
        animation: lg.glow ? "cm-dot-glow 1.8s ease-in-out infinite" : "none"
      }
    }, lg.suit), status && /*#__PURE__*/React.createElement("span", {
      style: {
        position: "absolute",
        right: -1,
        bottom: -1,
        width: Math.max(8, size * 0.22),
        height: Math.max(8, size * 0.22),
        borderRadius: "50%",
        background: "#5BD96A",
        boxShadow: "0 0 0 2px #000, 0 0 6px #5BD96A"
      }
    }));
  }

  // ── Playing card of a level ─────────────────────────────────────────────
  // Міні-карта номіналу рівня: face=true — лицем (ранг + масть у кольорі
  // ліги), face=false — сорочка. Нагорода рівня подається такою картою.
  function LevelCard({
    level,
    w = 30,
    face = true,
    highlight = false,
    style
  }) {
    const lg = lgForLevel(level);
    const rank = lgRankForLevel(level);
    const h = Math.round(w * 1.4);
    if (!face) {
      return /*#__PURE__*/React.createElement("span", {
        "data-i18n": "off",
        style: Object.assign({
          display: "inline-flex",
          width: w,
          height: h,
          borderRadius: Math.max(3, w * 0.14),
          boxSizing: "border-box",
          border: "1.5px solid rgba(255,255,255,.28)",
          background: "repeating-linear-gradient(48deg,#26262e 0 4px,#17171c 4px 8px)",
          boxShadow: "0 2px 6px rgba(0,0,0,.5)",
          flex: "none"
        }, style || {})
      });
    }
    return /*#__PURE__*/React.createElement("span", {
      "data-i18n": "off",
      style: Object.assign({
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: w,
        height: h,
        borderRadius: Math.max(3, w * 0.14),
        background: "#f4f4f4",
        flex: "none",
        boxShadow: highlight ? `0 0 0 2px ${lg.color}, 0 0 12px ${lg.color}aa` : "0 2px 6px rgba(0,0,0,.5)"
      }, style || {})
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: UI.font,
        fontWeight: 700,
        fontSize: w * 0.44,
        lineHeight: 1,
        color: lg.id === "spades" ? "#0b0b0d" : lg.color
      }
    }, rank), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: w * (lg.id === "dot" ? 0.3 : 0.4),
        lineHeight: 1.15,
        color: lg.id === "spades" ? "#0b0b0d" : lg.color
      }
    }, lg.suit));
  }
  Object.assign(window, {
    LeagueFrame53: LeagueFrame,
    LevelCard53: LevelCard
  });

  // Real archival portraits; source and license travel with each collectible.
  window.cmLegends53[42].photo = {
    "src": "assets/legends/Carlos_Mortensen_2015.jpg",
    "author": "World Poker Tour",
    "source": "https://commons.wikimedia.org/wiki/File:Carlos_Mortensen_2015.jpg",
    "license": "CC BY 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/3.0",
    "position": "50% 15%"
  };
  window.cmLegends53[12].photo = {
    "src": "assets/legends/Chris_Moneymaker_EPT4.jpg",
    "author": "Equipo Unibet from Spain and Portugal",
    "source": "https://commons.wikimedia.org/wiki/File:Chris_Moneymaker_EPT4.jpg",
    "license": "CC BY 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by/2.0",
    "position": "50% 15%"
  };
  window.cmLegends53[36].photo = {
    "src": "assets/legends/Doyle_Brunson_2010.jpg",
    "author": "flipchip • lasvegasvegas.com",
    "source": "https://commons.wikimedia.org/wiki/File:Doyle_Brunson_2010.jpg",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0",
    "position": "50% 15%"
  };
  window.cmLegends53[38].photo = {
    "src": "assets/legends/Johnny_Chan_2008.jpg",
    "author": "Gene Bromberg",
    "source": "https://commons.wikimedia.org/wiki/File:Johnny_Chan_2008.jpg",
    "license": "CC BY-SA 2.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/2.0",
    "position": "50% 15%"
  };
  window.cmLegends53[51].photo = {
    "src": "assets/legends/Stu_ungar.jpg",
    "author": "Shwobopho",
    "source": "https://commons.wikimedia.org/wiki/File:Stu_ungar.jpg",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0",
    "position": "50% 5%"
  };
  window.cmLegends53[12].edition = {
    ink: '#f5d79b',
    motif: 'rays',
    label: 'THE GOLDEN TICKET'
  };
  window.cmLegends53[38].edition = {
    ink: '#bce3d3',
    motif: 'double',
    label: 'TWIN VICTORIES'
  };
  window.cmLegends53[42].edition = {
    ink: '#eacb87',
    motif: 'diamond',
    label: 'EL MATADOR'
  };
  window.cmLegends53[51].edition = {
    ink: '#efc6d5',
    motif: 'orbit',
    label: 'THE COMEBACK'
  };
  window.cmLegends53[36].edition = {
    ink: '#f4d3a0',
    motif: 'western',
    label: 'TEXAS DOLLY'
  };
  window.cmLegends53[25].edition = {
    ink: '#f1d5a3',
    motif: 'octagon',
    label: 'THE FINAL EIGHT'
  };
  window.cmLegends53[8].edition = {
    ink: '#d6e3ed',
    motif: 'compass',
    label: 'THE UNLIKELY HAND'
  };
  window.cmLegends53[25].photo = {
    src: 'assets/legends/Jerry_Yang_2008.jpg',
    author: 'Gene Bromberg',
    source: 'https://commons.wikimedia.org/wiki/File:Jerry_Yang_2008.jpg',
    license: 'CC BY-SA 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0',
    position: '50% 15%'
  };
  window.cmLegends53[8].photo = {
    src: 'assets/legends/Joe_Hachem_2008.jpg',
    author: 'Matt Waldron',
    source: 'https://commons.wikimedia.org/wiki/File:Joe_Hachem_2008.jpg',
    license: 'CC BY 2.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/2.0',
    position: '50% 10%'
  };

  // v3: по одній легендарній карті в КОЖНОМУ номіналі — 13 легенд.
  // Шість нових без покрокового реплею (draft): чемпіон, рік, рука і приз
  // відомі; борд і покрокова розкладка ще звіряються з архівом WSOP.
  Object.assign(window.cmLegends53, {
    1: {
      name: 'Scott Blumstein',
      year: '2017',
      hand: 'A♥ 2♦',
      title: 'RIVER DEUCE',
      draft: true,
      prize: '$8 150 000',
      story: 'Скотт Блумстайн выиграл Main Event 2017 с A♥ 2♦. В последней раздаче против Дэна Отта (A♦ 8♦) двойка на ривере принесла ему пару, титул и $8 150 000.',
      edition: {
        ink: '#f3d1a0',
        motif: 'pulse',
        label: 'RIVER DEUCE'
      }
    },
    16: {
      name: 'Peter Eastgate',
      year: '2008',
      hand: 'A♦ 5♠',
      title: 'THE WHEEL',
      draft: true,
      prize: '$9 152 416',
      story: 'Питер Истгейт в 22 года стал самым молодым чемпионом Main Event на тот момент. В финале 2008 года его A♦ 5♠ против 4♥ 2♥ Ивана Демидова сложились в стрит от туза до пятёрки.',
      edition: {
        ink: '#d6eaff',
        motif: 'facets',
        label: 'THE WHEEL'
      }
    },
    19: {
      name: 'Jim Bechtel',
      year: '1993',
      hand: 'J♠ 6♥',
      title: 'ARIZONA FARMER',
      draft: true,
      prize: '$1 000 000',
      story: 'Джим Бехтел, фермер из Аризоны, выиграл Main Event 1993 с J♠ 6♥ против Гленна Козена. Первый миллион долларов, вручённый чемпиону этой серии.',
      edition: {
        ink: '#f0c9b0',
        motif: 'ember',
        label: 'ARIZONA FARMER'
      }
    },
    24: {
      name: 'Puggy Pearson',
      year: '1973',
      hand: 'A♠ 7♠',
      title: 'ROADGAMBLER',
      draft: true,
      prize: '$130 000',
      story: 'Пагги Пирсон выиграл Main Event 1973 с A♠ 7♠ против Джонни Мосса. Первый финал, который снимали на плёнку; приз — $130 000.',
      edition: {
        ink: '#e9d3a0',
        motif: 'satellite',
        label: 'ROADGAMBLER'
      }
    },
    32: {
      name: 'Phil Hellmuth',
      year: '1989',
      hand: '9♠ 9♣',
      title: 'THE POKER BRAT',
      draft: true,
      prize: '$755 000',
      story: 'Фил Хельмут в 24 года стал самым молодым чемпионом Main Event, победив действующего чемпиона Джонни Чана. Карманные девятки устояли против A♠ 7♠.',
      edition: {
        ink: '#ffe9b8',
        motif: 'nova',
        label: 'THE POKER BRAT'
      }
    },
    47: {
      name: 'Hossein Ensan',
      year: '2019',
      hand: 'K♥ K♣',
      title: 'POCKET KINGS',
      draft: true,
      prize: '$10 000 000',
      story: 'Хоссейн Энсан выиграл Main Event 2019 с K♥ K♣ против 8♠ 4♠ Дарио Саммартино. Короли устояли; приз — $10 000 000.',
      edition: {
        ink: '#fff0c4',
        motif: 'crown',
        label: 'POCKET KINGS'
      }
    }
  });
  // 13 legendary + 11 special of 53 cards are collector editions.
  // Collector designs have no invented player association or historical claim.
  window.cmSpecials53 = {
    37: {
      name: 'PRISM',
      edition: {
        ink: '#badfff',
        base: '#184688',
        motif: 'prism'
      },
      description: 'Преломлённые грани и холодное серебро. Свет меняется с каждым поворотом карты.'
    },
    49: {
      name: 'DIAMOND CUT',
      edition: {
        ink: '#d6eaff',
        base: '#204e9a',
        motif: 'facets'
      },
      description: 'Финал бубновой масти. Точная огранка, глубокий синий и чистые серебряные линии.'
    },
    14: {
      name: 'JADE',
      edition: {
        ink: '#ace5c9',
        base: '#146445',
        motif: 'jade'
      },
      description: 'Мягкие нефритовые дуги на зелёном металле. Спокойная, сдержанная коллекционная карта.'
    },
    50: {
      name: 'EMERALD',
      edition: {
        ink: '#c1efdc',
        base: '#175940',
        motif: 'emerald'
      },
      description: 'Ступенчатая изумрудная огранка. Коллекционный туз завершает трефовую масть.'
    },
    7: {
      name: 'PULSE',
      edition: {
        ink: '#ffa5b4',
        base: '#952c45',
        motif: 'pulse'
      },
      description: 'Один импульс, застывший в металле. Ритмичная гравировка на насыщенной красной поверхности.'
    },
    18: {
      name: 'EMBER',
      edition: {
        ink: '#efbb95',
        base: '#943a38',
        motif: 'ember'
      },
      description: 'Тёплая медь и линии тлеющего пламени. Отблеск проявляется, когда карта поворачивается.'
    },
    31: {
      name: 'RED VELVET',
      edition: {
        ink: '#edb3cb',
        base: '#6e2940',
        motif: 'velvet'
      },
      description: 'Глубокий бордовый и плавные складки гравировки. Карта с мягким бархатным характером.'
    },
    43: {
      name: 'ROSE',
      edition: {
        ink: '#ffd4de',
        base: '#923953',
        motif: 'rose'
      },
      description: 'Лепестки из тонких линий и светлое розовое золото. Геометрический цветок червовой масти.'
    },
    20: {
      name: 'MIDNIGHT',
      edition: {
        ink: '#c5d2ed',
        base: '#303e59',
        motif: 'crescent'
      },
      description: 'Серебряный полумесяц на ночном металле. Минимум деталей — только свет и глубина.'
    },
    52: {
      name: 'OBSIDIAN',
      edition: {
        ink: '#d7dee7',
        base: '#303941',
        motif: 'obsidian'
      },
      description: 'Финальный туз пик. Острые обсидиановые грани и холодный металлический кант.'
    },
    53: {
      name: 'CROWN',
      edition: {
        ink: '#fff0c4',
        base: '#9a752e',
        motif: 'crown'
      },
      description: 'Вершина коллекции. Единственная карта масти DOT — золотой туз с гравировкой короны завершает путь из 53 карт.'
    }
  };
  Object.entries(window.cmLegends53).forEach(([level, card]) => {
    card.id = `legend-${level}`;
    card.rarity = 'legendary';
  });
  Object.entries(window.cmSpecials53).forEach(([level, card]) => {
    card.id = `special-${level}`;
    card.rarity = 'special';
    card.title = card.name;
    card.edition.label = card.name;
  });
  window.cmCollectibles53 = {
    ...window.cmSpecials53,
    ...window.cmLegends53
  };
}
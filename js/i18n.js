
window.PX_CURRENCIES = {
  USD: { sym: "$", rate: 1 },
  EUR: { sym: "\u20AC", rate: 0.92 },
  KZT: { sym: "\u20B8", rate: 505 },
};
(() => {
  let code = "USD";
  try { code = localStorage.getItem("pokerix_cur") || "USD"; } catch (e) {}
  if (!window.PX_CURRENCIES[code]) code = "USD";
  window.PX_CUR = code;
  const cfg = () => window.PX_CURRENCIES[window.PX_CUR] || window.PX_CURRENCIES.USD;
  const group = (n) => n.toLocaleString("en-US").split(",").join("\u2009");
  window.pxSym = () => cfg().sym;
  window.pxRate = () => cfg().rate;
  // n is always in USD — the app's base unit
  window.pxMoney = (n, dec) => {
    const v = (Number(n) || 0) * cfg().rate;
    if (dec || (v > 0 && v < 10 && cfg().rate === 1)) {
      const s = v.toFixed(2).replace(/\.?0+$/, "");
      return cfg().sym + s;
    }
    return cfg().sym + group(Math.round(v));
  };
  window.pxSetCurrency = (c) => {
    if (!window.PX_CURRENCIES[c]) return;
    window.PX_CUR = c;
    try { localStorage.setItem("pokerix_cur", c); } catch (e) {}
    window.dispatchEvent(new Event("px-currency"));
    // money is rendered inline everywhere — force one repaint so every screen
    // picks up the new symbol and rate
    if (window.__pxRepaint) window.__pxRepaint();
  };
})();

/* Pokerix — runtime localisation (EN ⇄ RU).
   Text-node level translator: the whole app renders English literals, so we
   swap them after each render pass. Originals are cached per node, so the
   switch is reversible. Poker terms keep their industry-standard RU forms. */
(function () {
  const DICT = {
    "NO ACTIVE TABLES": "Нет активных столов",
    "YOU ARE REGISTERED": "ВЫ ЗАРЕГИСТРИРОВАНЫ", "TO TABLE": "ЗА СТОЛ", "TOURNAMENT LOBBY": "ЛОББИ ТУРНИРА", "UPCOMING": "СКОРО НАЧНУТСЯ", "ACTIVE TABLES": "АКТИВНЫЕ СТОЛЫ",
    "MY TABLES": "МОИ СТОЛЫ", "CASH TABLES": "КЕШ-СТОЛЫ", "TOURNEYS": "ТУРНИРЫ", "TOURNAMENT REGISTRATIONS": "РЕГИСТРАЦИИ НА ТУРНИРЫ",
    "NO ACTIVE CASH TABLES": "Нет активных кеш-столов", "NO TOURNAMENT REGISTRATIONS": "Вы ещё не зарегистрированы на турниры", "FIND A TABLE": "НАЙТИ СТОЛ", "STARTS IN": "ЧЕРЕЗ", "IN PROGRESS": "ИДЁТ ИГРА",

    // ── navigation / shell ──
    "HOME": "ГЛАВНАЯ", "ACTIVITIES": "АКТИВНОСТИ", "CASHIER": "КАССА", "PROFILE": "ПРОФИЛЬ",
    "LOBBY": "ЛОББИ", "PLAY": "ИГРАТЬ", "MORE": "ЕЩЁ", "BACK": "НАЗАД", "CLOSE": "ЗАКРЫТЬ",
    "DONE": "ГОТОВО", "OK": "ОК", "CANCEL": "ОТМЕНА", "SAVE": "СОХРАНИТЬ", "SAVED": "СОХРАНЕНО",
    "CONTINUE": "ПРОДОЛЖИТЬ", "GOT IT": "ПОНЯТНО", "DETAILS": "ПОДРОБНЕЕ", "RULES": "ПРАВИЛА",
    "HOW IT WORKS": "КАК ЭТО РАБОТАЕТ", "SHARE": "ПОДЕЛИТЬСЯ", "COPY": "КОПИРОВАТЬ",
    "COPY LINK": "КОПИРОВАТЬ ССЫЛКУ", "LINK COPIED": "ССЫЛКА СКОПИРОВАНА", "LINK": "ПРИВЯЗАТЬ",
    "SETTINGS": "НАСТРОЙКИ", "GENERAL SETTINGS": "ОБЩИЕ НАСТРОЙКИ", "HELP & SUPPORT": "ПОМОЩЬ И ПОДДЕРЖКА",
    "NOTE": "ЗАМЕТКА", "READY": "ГОТОВО", "START": "СТАРТ", "TOTAL": "ВСЕГО", "ALL": "ВСЕ",
    "MORE INFO": "ПОДРОБНЕЕ", "SELECT": "ВЫБРАТЬ", "APPLY": "ПРИМЕНИТЬ", "RESET": "СБРОСИТЬ",
    "FILTERS": "ФИЛЬТРЫ", "REFINE": "ФИЛЬТРЫ", "SEARCH": "ПОИСК", "SORT": "СОРТИРОВКА",
    "Close": "Закрыть", "Theme": "Тема", "Tweaks": "Настройки", "Close tweaks": "Закрыть настройки",

    // ── lobby / games ──
    "CASH GAMES": "КЭШ-ИГРЫ", "FAST POKER": "БЫСТРЫЙ ПОКЕР", "CLASSIC POKER": "КЛАССИЧЕСКИЙ ПОКЕР",
    "Classic Poker": "Классический покер", "Other formats": "Другие форматы", "OTHER FORMATS": "ДРУГИЕ ФОРМАТЫ",
    "QUICK POKER": "БЫСТРЫЙ ПОКЕР", "INSTANT PLAY": "МГНОВЕННАЯ ИГРА", "QUICK SEAT": "БЫСТРОЕ МЕСТО",
    "CHOOSE A GAME": "ВЫБЕРИТЕ ИГРУ", "CHOOSE A TABLE": "ВЫБЕРИТЕ СТОЛ", "CHOOSE A LIMIT": "ВЫБЕРИТЕ ЛИМИТ",
    "CHOOSE A BUY-IN": "ВЫБЕРИТЕ ВХОД", "CHOOSE A DISCIPLINE": "ВЫБЕРИТЕ ДИСЦИПЛИНУ",
    "SELECT TABLE": "ВЫБОР СТОЛА", "TABLES": "СТОЛЫ", "TABLE": "СТОЛ", "TABLE LIMIT": "ЛИМИТ СТОЛА",
    "TABLES TO LAUNCH": "СТОЛОВ К ЗАПУСКУ", "PLAY NOW": "ИГРАТЬ", "PLAY MORE HANDS": "БОЛЬШЕ РУК",
    "PLAYERS ONLINE": "ИГРОКОВ В ИГРЕ", "PLAYERS": "ИГРОКИ", "PLAYING": "В ИГРЕ", "SEATED": "ЗА СТОЛОМ",
    "SEATS FREE": "СВОБОДНЫХ МЕСТ", "1 SEAT LEFT": "ОСТАЛОСЬ 1 МЕСТО", "TABLE FULL": "СТОЛ ЗАПОЛНЕН",
    "HIDE FULL": "СКРЫТЬ ЗАПОЛНЕННЫЕ", "HIDE EMPTY": "СКРЫТЬ ПУСТЫЕ", "FILLING": "ЗАПОЛНЯЕТСЯ", "BUY-IN FROM": "ВХОД ОТ",
    "FULL": "ПОЛНЫЙ", "EMPTY": "ПУСТО", "SWIPE TO BROWSE": "СВАЙП ДЛЯ ПРОСМОТРА",
    "TAP TO START": "НАЖМИТЕ, ЧТОБЫ НАЧАТЬ", "Choose how you want to jump in.": "Выберите, как хотите начать.",
    "No waiting on other players": "Без ожидания других игроков",
    "Four betting rounds": "Четыре круга ставок",
    "Variance is highest in this format": "В этом формате самая высокая вариативность",
    "Sets and straights hit much more often": "Сеты и стриты приходят значительно чаще",
    "EASY": "ЛЕГКО", "REGULAR": "ОБЫЧНО", "SERIOUS": "СЕРЬЁЗНО", "BIG": "КРУПНО", "NOSEBLEED": "ЭКСТРИМ",
    "MICRO": "МИКРО", "LOW": "НИЗКИЕ", "MID": "СРЕДНИЕ", "HIGH": "ВЫСОКИЕ", "HIGH STAKES": "ВЫСОКИЕ СТАВКИ",
    "LIMITS": "ЛИМИТЫ", "GAME": "ИГРА", "GAME TYPE": "ТИП ИГРЫ", "MAX": "МАКС", "MIN": "МИН",
    "POT-LIMIT OMAHA": "ПОТ-ЛИМИТ ОМАХА", "5-CARD POT-LIMIT OMAHA": "5-КАРТ. ПЛО",
    "6-CARD POT-LIMIT OMAHA": "6-КАРТ. ПЛО", "SHORT DECK": "КОРОТКАЯ КОЛОДА",
    "5-CARD PLO": "5-КАРТОЧНАЯ PLO", "6-CARD PLO": "6-КАРТОЧНАЯ PLO", "DOUBLE BOARD": "ДВА БОРДА",
    "2 BOARDS": "2 БОРДА", "BOMB POT": "БОМБ-ПОТ", "SQUID GAME": "ИГРА В КАЛЬМАРА",

    // ── table ──
    "TAKE A SEAT": "ЗАНЯТЬ МЕСТО", "SIT DOWN": "СЕСТЬ ЗА СТОЛ", "Sit out": "Пропустить раздачи",
    "SITTING OUT": "ПРОПУСК РАЗДАЧ", "Leave table": "Покинуть стол", "Leave the table?": "Покинуть стол?",
    "Leave": "Выйти", "Stay at the table": "Остаться за столом", "Back to lobby": "Вернуться в лобби",
    "CASH OUT": "ЗАБРАТЬ СТЕК", "Cash out your stack": "Забрать свой стек",
    "Hold your seat · auto-out in 5:00": "Место сохраняется · авто-выход через 5:00",
    "returns to balance.": "вернётся на баланс.",
    "YOUR TURN": "ВАШ ХОД", "FOLDED": "СБРОСИЛ", "Fold": "Сбросить", "Call": "Уравнять", "CALL": "УРАВНЯТЬ",
    "RAISE": "ПОВЫСИТЬ", "Hold": "Держать", "CHECK": "ЧЕК", "BET": "СТАВКА", "ALL IN": "ВА-БАНК",
    "POT": "БАНК", "AVG POT": "СРЕДНИЙ ПОТ", "AVG": "СРЕДН.", "HANDS": "РУКИ", "HAND": "РУКА",
    "HANDS LEFT": "РУК ОСТАЛОСЬ", "HAND LEFT": "РУКА ОСТАЛАСЬ", "BLINDS": "БЛАЙНДЫ",
    "CURRENT BLINDS": "ТЕКУЩИЕ БЛАЙНДЫ", "NEXT BLINDS": "СЛЕДУЮЩИЕ БЛАЙНДЫ", "ANTE": "АНТЕ",
    "(ANTE)": "(АНТЕ)", "PREFLOP": "ПРЕФЛОП", "FLOP": "ФЛОП", "TURN": "ТЁРН", "RIVER": "РИВЕР",
    "SHOWDOWN": "ВСКРЫТИЕ", "HAND ID": "ID РАЗДАЧИ",
    "CHIPS": "ФИШКИ", "BANK": "БАНК", "Collected so far": "Собрано на данный момент",
    "YOU": "ВЫ", "You": "Вы", "WIN": "ПОБЕДА", "YOU WON": "ВЫ ВЫИГРАЛИ", "WINS": "ПОБЕДЫ",
    "WINNERS": "ПОБЕДИТЕЛИ", "WIN RATE": "ВИНРЕЙТ", "NET": "ИТОГ", "POS": "МЕСТО",
    "MY SESSION": "МОЯ СЕССИЯ", "MY TABLE STATS": "МОЯ СТАТИСТИКА", "Table VPIP": "VPIP стола",
    "YOUR VPIP": "ВАШ VPIP", "CALL TIME": "ТАЙМ-БАНК", "Display in BB": "Показывать в ББ",
    "TABLE CHAT": "ЧАТ СТОЛА", "OBSERVE": "НАБЛЮДАТЬ", "PULL UP": "ПОДНЯТЬ",
    "WAITING TO BE DEALT IN": "ОЖИДАНИЕ", "Wait for big blind": "Ждать большой блайнд",
    "Post big blind now": "Поставить большой блайнд сейчас",
    "CONFIRM · WAIT FOR BLIND": "ПОДТВ. · ЖДАТЬ ББ",
    "POST BLIND & DEAL ME IN": "БЛАЙНД И РАЗДАЧА",
    "AUTO RE-BUY": "АВТО-ДОКУПКА",
    "Top back up to 100 BB when you drop below": "Докупать до 100 ББ при падении ниже",
    "JOIN QUEUE": "В ОЧЕРЕДЬ", "LEAVE QUEUE": "ВЫЙТИ ИЗ ОЧЕРЕДИ", "YOU'RE IN LINE": "ВЫ В ОЧЕРЕДИ",
    "BE FIRST IN LINE": "БУДЬТЕ ПЕРВЫМ В ОЧЕРЕДИ", "IN LINE FOR": "В ОЧЕРЕДИ НА",
    "Hand history": "История раздач", "HAND RANKINGS": "СТАРШИНСТВО",
    "RESTRICTED": "ОГРАНИЧЕНО", "VPIP TOO LOW": "НИЗКИЙ VPIP", "FINAL WARNING": "ПОСЛЕДНЕЕ ПРЕДУПР.",
    "REMOVED FROM TABLE": "УДАЛЁН СО СТОЛА", "TABLE RULE · VPIP 30+": "ПРАВИЛО СТОЛА · VPIP 30+",
    "TABLE STATS ·": "СТАТИСТИКА СТОЛА ·", "No tag": "Без метки", "BAD BEAT": "БЭД-БИТ",

    // ── hand names ──
    "ROYAL FLUSH": "РОЯЛ-ФЛЕШ", "Royal Flush": "Роял-флеш", "STRAIGHT FLUSH": "СТРИТ-ФЛЕШ",
    "Straight Flush": "Стрит-флеш", "Straight flush": "Стрит-флеш", "Highest straight flush": "Старший стрит-флеш",
    "FOUR OF A KIND": "КАРЕ", "Four of a Kind": "Каре", "Four cards of one rank": "Четыре карты одного ранга",
    "FULL HOUSE": "ФУЛЛ-ХАУС", "Full House": "Фулл-хаус", "FLUSH": "ФЛЕШ", "Flush": "Флеш",
    "Five cards of one suit": "Пять карт одной масти", "STRAIGHT": "СТРИТ", "Straight": "Стрит",
    "Five cards in a row": "Пять карт по порядку", "THREE OF A KIND": "СЕТ", "Three of a Kind": "Сет",
    "Three cards of one rank": "Три карты одного ранга", "TWO PAIR": "ДВЕ ПАРЫ", "Two Pair": "Две пары",
    "Two different pairs": "Две разные пары", "ONE PAIR": "ПАРА", "One Pair": "Пара",
    "Two cards of one rank": "Две карты одного ранга", "HIGH CARD": "СТАРШАЯ КАРТА", "High Card": "Старшая карта",
    "Aces full of tens": "Фулл-хаус: тузы и десятки",
    "FULL HOUSE, ACES OVER NINES": "ФУЛЛ-ХАУС, ТУЗЫ И ДЕВЯТКИ",

    // ── tournaments ──
    "TOURNAMENTS": "ТУРНИРЫ", "TOURNAMENT": "ТУРНИР", "MY TOURNAMENTS": "МОИ ТУРНИРЫ",
    "MY TOURNEYS": "МОИ ТУРНИРЫ", "COMPETITIONS": "СОРЕВНОВАНИЯ", "COMPS": "ЛИГИ", "LEAGUES": "ЛИГИ", "REWARDS": "НАГРАДЫ", "MAIN": "ГЛАВНАЯ", "WALLET": "КОШЕЛЁК",
    "CASH\nGAMES": "КЭШ\nИГРЫ", "FAST\nPOKER": "БЫСТРЫЙ\nПОКЕР", "SPIN\n& WIN": "SPIN\n& WIN", "TOURNA-\nMENTS": "ТУР-\nНИРЫ", "TOP EVENTS": "ТОП-СОБЫТИЯ", "EVENT": "СОБЫТИЕ",
    "Search tournaments": "Поиск турниров", "NOTHING FOUND": "НИЧЕГО НЕ НАЙДЕНО",
    "EVENT INFO": "О СОБЫТИИ", "NEXT EVENT": "СЛЕДУЮЩЕЕ СОБЫТИЕ", "THIS TOURNAMENT": "ЭТОТ ТУРНИР",
    "SCHEDULE": "РАСПИСАНИЕ", "BUY-IN": "ВХОД", "BUY-IN + FEE": "ВХОД + СБОР", "BUY-INS": "ВХОДЫ",
    "PRIZE POOL": "ПРИЗОВОЙ ФОНД", "LIVE PRIZE POOL": "ТЕКУЩИЙ ПРИЗОВОЙ ФОНД",
    "GUARANTEED PRIZE POOL": "ГАРАНТ. ПРИЗОВОЙ ФОНД", "PRIZE POOL SET": "ПРИЗОВОЙ ФОНД ОПРЕДЕЛЁН",
    "SPINNING FOR THE PRIZE POOL": "РОЗЫГРЫШ ПРИЗОВОГО ФОНДА", "TOTAL PRIZE FUND": "ОБЩИЙ ПРИЗОВОЙ ФОНД",
    "PRIZE POSITION": "ПРИЗОВОЕ МЕСТО", "GUARANTEED": "ГАРАНТИЯ", "POOL": "ФОНД",
    "REGISTER": "РЕГИСТРАЦИЯ", "REGISTER NOW": "РЕГИСТРАЦИЯ", "REGISTERED": "В ТУРНИРЕ",
    "YOU'RE REGISTERED": "ВЫ В ТУРНИРЕ", "UNREGISTER": "ОТМЕНА РЕГ.",
    "UNREGISTERED": "РЕГ. ОТМЕНЕНА", "PLAYERS REGISTERED": "ИГРОКОВ В ТУРНИРЕ",
    "CANCEL REGISTRATION?": "ОТМЕНИТЬ РЕГИСТРАЦИЮ?", "KEEP MY SEAT": "ОСТАВИТЬ МЕСТО",
    "REGISTRATION CLOSED": "РЕГИСТРАЦИЯ ЗАКРЫТА", "REG CLOSED": "РЕГ. ЗАКРЫТА", "REG OPEN": "РЕГ. ОТКРЫТА",
    "LATE REG": "ПОЗДНЯЯ РЕГ.", "LATE REG.": "ПОЗДНЯЯ РЕГ.", "REG": "РЕГ.",
    "REGISTER WITH TICKET": "РЕГИСТРАЦИЯ ПО ТИКЕТУ", "PAID WITH TICKET": "ОПЛАЧЕНО ТИКЕТОМ",
    "SEAT RESERVED": "МЕСТО ЗАБРОНИРОВАНО", "SLIDE TO CONFIRM": "СДВИНЬТЕ ДЛЯ ПОДТВ.",
    "SLIDE TO UNREGISTER": "СДВИНЬТЕ ДЛЯ ОТМЕНЫ", "REMIND": "НАПОМНИТЬ", "REMIND ME": "НАПОМНИТЬ МНЕ",
    "REMINDER SET": "НАПОМИНАНИЕ УСТАНОВЛЕНО", "STARTING SOON": "СКОРО СТАРТ", "Game starts in": "Игра начнётся через",
    "STARTING STACK": "НАЧАЛЬНЫЙ СТЕК", "STARTING CHIPS": "НАЧАЛЬНЫЕ ФИШКИ", "YOUR STACK": "ВАШ СТЕК",
    "AVG STACK": "СРЕДНИЙ СТЕК", "BIG STACK": "БОЛЬШОЙ СТЕК", "SMALL STACK": "МАЛЫЙ СТЕК", "MIN STACK": "МИН. СТЕК",
    "BLIND LEVELS": "УРОВНИ БЛАЙНДОВ", "BLIND INTERVAL": "ИНТЕРВАЛ БЛАЙНДОВ", "BUY-IN BREAKDOWN": "СОСТАВ ВХОДА", "STRUCTURE": "СТРУКТУРА",
    "PLAYERS PER TABLE": "ИГРОКОВ ЗА СТОЛОМ", "PLAYERS LEFT": "ОСТАЛОСЬ ИГРОКОВ", "BREAK TIME": "ПЕРЕРЫВ",
    "NEXT BREAK": "СЛЕДУЮЩИЙ ПЕРЕРЫВ", "EST. DURATION": "ОЖИД. ДЛИТЕЛЬНОСТЬ", "DATE": "ДАТА",
    "RE-ENTRY": "РЕ-ЭНТРИ", "RE-ENTRIES": "РЕ-ЭНТРИ", "TOTAL ENTRIES": "ВСЕГО ВХОДОВ", "ENTRY TO": "ВХОД В",
    "FT BLIND ROLLBACK": "ОТКАТ БЛАЙНДОВ НА ФТ", "BUBBLE PROTECT": "ЗАЩИТА БАББЛА",
    "Not applicable": "Не применяется", "UNLIMITED": "БЕЗ ОГРАНИЧЕНИЙ", "TARGET EVENT": "ЦЕЛЕВОЕ СОБЫТИЕ",
    "SATELLITE": "САТЕЛЛИТ", "MEGA SATELLITE": "МЕГА-САТЕЛЛИТ", "QUALIFIER": "КВАЛИФИКАЦИЯ",
    "MICRO QUALIFIER": "МИКРО-КВАЛИФИКАЦИЯ", "MID QUALIFIER": "СРЕДНЯЯ КВАЛИФИКАЦИЯ", "FREEROLL": "ФРИРОЛЛ", "FREEZEOUT": "ФРИЗАУТ",
    "BOUNTY": "БАУНТИ", "MYSTERY": "МИСТЕРИ", "DEEPSTACK": "ДИПСТЕК", "TURBO": "ТУРБО", "HYPER": "ГИПЕР",
    "OUT": "ВЫБЫЛ", "IN PLAY": "В ИГРЕ", "CAREER": "КАРЬЕРА", "WEEK": "НЕДЕЛЯ", "ALL GAMES": "ВСЕ ИГРЫ", "today": "сегодня", "7 days": "7 дней", "30 days": "30 дней", "OUT → show in play": "ВЫБЫЛ → показать в игре", "IN PLAY → show busted": "В ИГРЕ → показать выбыл", "PAY WITH": "СПОСОБ ОПЛАТЫ", "SPIN & WIN TICKET": "БИЛЕТ SPIN & WIN", "TOURNAMENT DOLLARS": "ТУРНИРНЫЕ ДОЛЛАРЫ", "MAIN BALANCE (USD)": "ОСНОВНОЙ БАЛАНС", "no tickets for this buy-in": "нет билетов на этот бай-ин", "Prize is paid to the main balance whichever way you enter.": "Приз зачисляется на основной баланс при любом способе входа.", "LVL": "УР.", "STEP": "СТУПЕНЬ", "STEP 1": "СТУПЕНЬ 1", "STEP 2": "СТУПЕНЬ 2",
    "STEP 1 / 2": "ШАГ 1 / 2", "STEP 2 / 2": "ШАГ 2 / 2", "EVERY 30 MIN": "КАЖДЫЕ 30 МИН",
    "EVERY HOUR": "КАЖДЫЙ ЧАС", "10 SEATS GTD": "10 МЕСТ ГАРАНТ.", "60 MIN": "60 МИН", "6 MIN": "6 МИН",
    "SHARE TO STORIES": "ПОДЕЛИТЬСЯ В STORIES", "STORIES": "STORIES",
    "1ST": "1-Е", "2ND": "2-Е", "3RD": "3-Е", "4TH": "4-Е", "5TH": "5-Е", "6TH": "6-Е", "7TH": "7-Е",
    "8TH": "8-Е", "9TH": "9-Е",

    // ── tickets / cashier ──
    "TICKET": "ТИКЕТ", "TICKETS": "ТИКЕТЫ", "GOLD TICKETS": "ЗОЛОТЫЕ ТИКЕТЫ",
    "UNIVERSAL TICKET": "УНИВЕРСАЛЬНЫЙ ТИКЕТ", "TOURNAMENT TICKET": "ТУРНИРНЫЙ ТИКЕТ",
    "NO TICKET FOR THIS EVENT": "НЕТ ТИКЕТА НА ЭТО СОБЫТИЕ", "EXPIRES TODAY": "ИСТЕКАЕТ СЕГОДНЯ",
    "TOURNAMENT DOLLARS": "ТУРНИРНЫЕ ДОЛЛАРЫ", "USDT WALLET": "USDT-КОШЕЛЁК",
    "NOT ENOUGH · TOP UP": "НЕДОСТАТОЧНО · ПОПОЛНИТЬ", "TOP UP": "ПОПОЛНИТЬ",
    "BALANCE": "БАЛАНС", "DEPOSIT": "ДЕПОЗИТ", "WITHDRAW": "ВЫВОД", "TRANSACTIONS": "ТРАНЗАКЦИИ",
    "DEPOSIT AMOUNT": "СУММА ДЕПОЗИТА", "AMOUNT": "СУММА", "ENTER AMOUNT": "ВВЕДИТЕ СУММУ",
    "MAX AMOUNT REACHED": "ДОСТИГНУТ МАКСИМУМ", "PAY WITH": "ОПЛАТА ЧЕРЕЗ", "YOU PAY NOW": "К ОПЛАТЕ",
    "CARD PAYMENT": "ОПЛАТА КАРТОЙ", "CRYPTO PAYMENT": "ОПЛАТА КРИПТОЙ", "CARD NUMBER": "НОМЕР КАРТЫ",
    "CARDHOLDER NAME": "ИМЯ ВЛАДЕЛЬЦА", "EXPIRY": "СРОК ДЕЙСТВИЯ", "CARD": "КАРТА", "CRYPTO": "КРИПТО",
    "DEPOSIT COMPLETE": "ДЕПОЗИТ ЗАЧИСЛЕН", "YOUR DEPOSIT": "ВАШ ДЕПОЗИТ", "TOTAL TO PLAY": "ИТОГО К ИГРЕ",
    "START PLAYING": "НАЧАТЬ ИГРУ", "Added to balance": "Зачислено на баланс",
    "Added to your balance": "Зачислено на ваш баланс", "added": "зачислено",
    "SECURED · 256-BIT ENCRYPTION · PCI DSS": "ЗАЩИТА · 256-BIT · PCI DSS",
    "RECENT": "НЕДАВНИЕ", "EARLIER": "РАНЕЕ", "TODAY": "СЕГОДНЯ", "YESTERDAY": "ВЧЕРА",
    "TOMORROW": "ЗАВТРА", "THIS WEEK": "НА ЭТОЙ НЕДЕЛЕ", "7 DAYS": "7 ДНЕЙ", "DAYS": "ДНЕЙ",
    "NEXT 7 DAYS": "СЛЕД. 7 ДНЕЙ", "2 WEEKS": "2 НЕДЕЛИ", "TAP A DAY": "ВЫБЕРИТЕ ДЕНЬ",
    "TAP SAME DAY = ONE DAY · OR PICK END DAY": "ТОТ ЖЕ ДЕНЬ = ОДИН ДЕНЬ · ИЛИ ВЫБЕРИТЕ КОНЕЦ",
    "EVERY SUN": "КАЖДОЕ ВС", "NEXT IN": "СЛЕДУЮЩЕЕ ЧЕРЕЗ", "ENDS IN": "ЗАКАНЧИВАЕТСЯ ЧЕРЕЗ",
    "OFFER ENDS IN": "ДО КОНЦА АКЦИИ", "FINAL CALL": "ПОСЛЕДНИЙ ШАНС", "LAST HOURS": "ПОСЛЕДНИЕ ЧАСЫ",

    // ── bonuses / activities ──
    "WELCOME OFFER": "ПРИВЕТ-БОНУС", "WELCOME BONUS": "ПРИВЕТ-БОНУС",
    "WELCOME COUPON": "ПРИВЕТ-КУПОН", "FIRST DEPOSIT": "ПЕРВЫЙ ДЕПОЗИТ",
    "FIRST DEPOSIT · DOUBLED": "ПЕРВЫЙ ДЕПОЗИТ · УДВОЕН", "DOUBLE YOUR": "УДВОЙТЕ СВОЙ",
    "DEPOSIT BONUS": "БОНУС НА ДЕПОЗИТ", "BONUS CASH": "БОНУСНЫЕ СРЕДСТВА", "CLAIM BONUS": "ЗАБРАТЬ БОНУС",
    "CLAIM": "ЗАБРАТЬ", "CLAIMED": "ПОЛУЧЕНО", "100% MATCH · LOCKED": "100% БОНУС · ЗАБЛОКИРОВАН",
    "MAKE 1ST DEPOSIT TO UNLOCK": "1-Й ДЕПОЗИТ ОТКРОЕТ БОНУС",
    "UNTIL YOUR FIRST DEPOSIT": "ДО ПЕРВОГО ДЕПОЗИТА", "+ 100% BONUS ON FIRST DEPOSIT": "+ 100% БОНУС НА ПЕРВЫЙ ДЕПОЗИТ",
    "MISSIONS": "МИССИИ", "MISSION REWARD": "НАГРАДА ЗА МИССИЮ", "REWARD": "НАГРАДА",
    "REWARD UNLOCKED": "НАГРАДА ОТКРЫТА", "DAILY CHECK-IN": "ЧЕК-ИН ДНЯ", "CHECK IN": "ОТМЕТИТЬСЯ",
    "DAILY": "ЕЖЕДНЕВНО", "WEEKLY": "ЕЖЕНЕДЕЛЬНО", "SEASON": "СЕЗОН", "HONEYMOON": "HONEYMOON",
    "START HONEYMOON": "НАЧАТЬ HONEYMOON", "COMPETITIONS": "СОРЕВНОВАНИЯ", "COMPS": "ЛИГИ", "LEADERBOARD": "ЛИДЕРБОРД",
    "CHAMPION": "ЧЕМПИОН", "CASHBACK": "КЭШБЕК", "RAKEBACK": "РЕЙКБЕК", "GRAND JACKPOT": "ГРАНД-ДЖЕКПОТ",
    "Grand Jackpot": "Гранд-джекпот", "FORTUNE WHEEL": "КОЛЕСО ФОРТУНЫ", "Fortune wheel": "Колесо фортуны",
    "WHEEL SPINS": "ВРАЩЕНИЯ КОЛЕСА", "SPIN": "КРУТИТЬ", "OPENED": "ОТКРЫТО",
    "BETTER LUCK NEXT TIME": "УДАЧИ В СЛЕДУЮЩИЙ РАЗ", "WIN UP TO": "ВЫИГРАЙТЕ ДО",
    "GIFT CODE": "ПОДАРОЧНЫЙ КОД", "VAULT": "СЕЙФ",
    "AVAILABLE IN": "ОТКРОЕТСЯ ЧЕРЕЗ", "OPENS AFTER YOUR FIRST 30 DAYS": "ОТКРОЕТСЯ ПОСЛЕ ПЕРВЫХ 30 ДНЕЙ", "CODE": "КОД", "MULTIPLIER": "МНОЖИТЕЛЬ",
    "INVITE": "ПРИГЛАСИТЬ", "INVITE A FRIEND": "ПРИГЛАСИТЬ ДРУГА",
    "YOUR PERSONAL INVITE": "ВАШЕ ЛИЧНОЕ ПРИГЛАШЕНИЕ",
    "Scan to join with your code": "Отсканируйте, чтобы войти по вашему коду",
    "1 GIFT": "1 ПОДАРОК",
    "Share your link or QR code — every friend who deposits earns you a gift.": "Поделитесь ссылкой или QR-кодом — каждый друг с депозитом приносит вам подарок.", "REFERRALS": "РЕФЕРАЛЫ",
    "REFERRAL REWARDS": "РЕФЕРАЛЬНЫЕ НАГРАДЫ", "YOUR LINK": "ВАША ССЫЛКА", "JOIN ME": "ПРИСОЕДИНЯЙСЯ",
    "FRIEND ROYALE": "ДРУЖЕСКИЙ РОЯЛЬ", "SIGN UP WITH THIS LINK": "РЕГИСТРИРУЙСЯ ПО ЭТОЙ ССЫЛКЕ",
    "Thank You": "Спасибо", "BRONZE": "БРОНЗА", "SILVER": "СЕРЕБРО", "GOLD": "ЗОЛОТО",
    "WOOD": "ДЕРЕВО", "DIAMOND": "АЛМАЗ",
    // ліги-масті (міграція з металів)
    "DIAMONDS": "БУБИ", "CLUBS": "КРЕСТИ", "HEARTS": "ЧЕРВИ", "SPADES": "ПИКИ",
    "Your main balance. Deposits land here, and it is the only balance you can withdraw. Plays everywhere: cash games, tournaments, Spin & Win.": "Основной баланс. Сюда приходят депозиты, и только его можно вывести. Играет везде: кэш-игры, турниры, Spin & Win.",
    "Bonus currency for cash games — use it to buy in at any cash table. Cash$ cannot be withdrawn.": "Бонусная валюта для кэш-игр — ею можно войти за любой кэш-стол. Cash$ не выводится.",
    "Bonus currency for tournaments — use it to register for MTTs and Spin & Win. Tourneys$ cannot be withdrawn.": "Бонусная валюта для турниров — ею можно зарегистрироваться в MTT и Spin & Win. Tourneys$ не выводится.",
    "USD is your withdrawable money. Cash$ buys you into cash games, Tourneys$ registers you for MTTs and Spin & Win — both bonus currencies stay in the game and cannot be withdrawn.": "USD — выводимые деньги. Cash$ — вход в кэш-игры, Tourneys$ — регистрация в MTT и Spin & Win; обе бонусные валюты остаются в игре и не выводятся.",
    "Bubble — the last spot before the prizes: bust here and you leave with nothing.": "Баббл — последнее место перед призами: вылет здесь оставляет без выплаты.",
    "OPEN ANYTIME": "ОТКРОЙТЕ КОГДА УГОДНО", "FILLS AS YOU PLAY": "НАПОЛНЯЕТСЯ ВО ВРЕМЯ ИГРЫ",
    "FILLING": "НАПОЛНЯЕТСЯ", "GRAND": "ГРАНД",
    "LEVEL REWARD": "НАГРАДА УРОВНЯ", "REWARD UNLOCKED": "НАГРАДА ОТКРЫТА",
    "ACE — LEAGUE FINALE": "ТУЗ — ФИНАЛ МАСТИ", "GRAND REWARD + NEXT LEAGUE": "ГЛАВНАЯ НАГРАДА + НОВАЯ ЛИГА",
    "LEVEL = CARD": "УРОВЕНЬ = КАРТА", "LEAGUE = SUIT": "ЛИГА = МАСТЬ",
    "REWARD PATH": "ПУТЬ НАГРАД", "CASHBACK SAFE": "СЕЙФ КЭШБЕКА",

    // ── settings ──
    "HUD": "HUD", "BETTING": "СТАВКИ", "SOUNDS": "ЗВУКИ", "SMART FOCUS": "УМНЫЙ ФОКУС",
    "TABLE THEME": "ТЕМА СТОЛА", "TIME BANK": "ТАЙМ-БАНК", "CURRENCY DISPLAY": "ВАЛЮТА",
    "LANGUAGE": "ЯЗЫК", "TIME ZONE": "ЧАСОВОЙ ПОЯС", "CLASSIC": "КЛАССИКА",
    "ACCOUNT SECURITY": "БЕЗОПАСНОСТЬ", "CHANGE PASSWORD": "СМЕНИТЬ ПАРОЛЬ",
    "Not yet linked": "Ещё не привязано", "ON": "ВКЛ", "OFF": "ВЫКЛ",
    "Typography": "Типографика", "Font size": "Размер шрифта", "Density": "Плотность",
    "Primary": "Основной", "Palette": "Палитра", "Dark mode": "Тёмная тема",
    "About insurance": "О страховке", "Toggle insurance": "Переключить страховку",
    "PLAY WITH INSURANCE": "ИГРАТЬ СО СТРАХОВКОЙ",

    // ── misc ──
    "LIVE": "LIVE", "FREE": "БЕСПЛАТНО", "INSTANT": "МГНОВЕННО", "MATCH": "БОНУС",
    "Drop an image": "Перетащите изображение", "Drop image": "Перетащите изображение",
    "Monday": "Понедельник", "Tuesday": "Вторник", "Wednesday": "Среда", "Thursday": "Четверг",
    "Friday": "Пятница", "Saturday": "Суббота", "Sunday": "Воскресенье",
    "MON": "ПН", "TUE": "ВТ", "WED": "СР", "THU": "ЧТ", "FRI": "ПТ", "SAT": "СБ", "SUN": "ВС",
    "JAN": "ЯНВ", "FEB": "ФЕВ", "MAR": "МАР", "APR": "АПР", "MAY": "МАЙ", "JUN": "ИЮН",
    "JUL": "ИЮЛ", "AUG": "АВГ", "SEP": "СЕН", "OCT": "ОКТ", "NOV": "НОЯ", "DEC": "ДЕК",
    "DAILY MAIN EVENT": "DAILY MAIN EVENT", "HIGH ROLLER": "HIGH ROLLER",
    "SPRING MILLIONS": "SPRING MILLIONS", "DAILY DEEP": "DAILY DEEP",
    "SUNDAY CRUSHER": "SUNDAY CRUSHER", "OMAHOLIC BIG BOUNTY": "OMAHOLIC BIG BOUNTY",
    "SUNDAY GRAND BOUNTY": "SUNDAY GRAND BOUNTY", "FRIDAY OMAHOLIC": "FRIDAY OMAHOLIC",
    "HOT POKER SUMMER 2026": "HOT POKER SUMMER 2026", "ARCANIUM SERIES": "СЕРИЯ ARCANIUM",
    "FLASH & FLUSH": "ФЛЕШ И ФЛЕШ", "SPIN & WIN": "SPIN & WIN", "SPIN & GO": "SPIN & GO",

    // ── home screen / widgets ──
    "ACTIVE TABLES": "СТОЛОВ В ИГРЕ", "CERTIFIED RNG": "СЕРТИФ. ГСЧ", "FAIR": "FAIR PLAY",
    "ONLINE": "ОНЛАЙН", "FIRST": "ПЕРВЫЙ", "BONUS": "БОНУС", "CLEARED": "ОТЫГРАНО",
    "RESUME": "ПРОДОЛЖИТЬ", "JOIN": "ЗА СТОЛ", "OPEN": "ОТКРЫТЬ",
    "TODAY’S MISSION": "МИССИЯ ДНЯ", "TODAY'S MISSION": "МИССИЯ ДНЯ",
    "Play 80 hands of any cash game": "Сыграйте 80 рук в любой кэш-игре",
    "one mission away": "осталась одна миссия", "Texas Hold'em": "Техасский холдем",
    "Table for 6": "Стол на 6", "DAILY LEADERBOARD": "ДНЕВНОЙ ЛИДЕРБОРД",
    "MTT LEADERBOARD": "MTT-ЛИДЕРБОРД", "GRAND LEADERBOARD": "ГРАНД-ЛИДЕРБОРД",
    "TOTAL PRIZE POOL": "ОБЩИЙ ПРИЗОВОЙ ФОНД", "TOP PRIZE": "ГЛАВНЫЙ ПРИЗ", "PTS": "ОЧКИ",
    "CASH-DROP SAFE": "СЕЙФ КЭШБЕКА", "CASHBACK": "КЭШБЕК", "SAFE": "СЕЙФ", "READY TO OPEN": "МОЖНО ОТКРЫТЬ",
    "PRESENT ON DAY": "ПОДАРОК В ДЕНЬ",
    "Tap CHECK IN to bank today's reward": "Нажмите «ОТМЕТИТЬСЯ», чтобы забрать награду",
    "PICK YOUR GAME": "ВЫБЕРИТЕ ИГРУ", "FAST FOLD": "БЫСТРЫЙ ФОЛД",
    "POOLED LIMITS": "ОБЩИЕ ЛИМИТЫ", "FOR BEGINNERS": "ДЛЯ НОВИЧКОВ",
    "HYPER TURBO": "ГИПЕР-ТУРБО", "ALL EVENTS": "ВСЕ СОБЫТИЯ", "STEP SATELLITE": "СТУПЕНЬ-САТЕЛЛИТ",
    "CASH": "КЭШ", "H": "Ч",
    "Your turn": "Ваш ход", "Sitting out": "Пропуск раздач", "auto-out in": "авто-выход через",
    "Waiting": "Ожидание", "Away": "Отошёл", "Playing": "В игре", "Active": "Активен",

    // ── cashier / transactions ──
    "TOTAL IN": "ВСЕГО ВВОД", "TOTAL OUT": "ВСЕГО ВЫВОД", "DEPOSITS": "ДЕПОЗИТЫ",
    "HOW BALANCES WORK": "КАК УСТРОЕНЫ БАЛАНСЫ", "HOW IT WORKS": "КАК ЭТО РАБОТАЕТ",
    "GOT IT": "ПОНЯТНО", "DETAILS": "ПОДРОБНЕЕ",
    "USD ($) is your withdrawable money — deposits and payouts. Cash$ (C$) only sits at cash tables, Tourney$ (T$) only buys into tournaments. Neither can be withdrawn: both turn into withdrawable USD as cashback while you play.": "USD ($) — деньги, которые можно вывести: депозиты и выплаты. Cash$ (C$) работает только за кэш-столами, Tourney$ (T$) — только на входы в турниры. Их нельзя вывести: пока вы играете, они превращаются в кэшбэк в USD.",
    "WITHDRAWALS": "ВЫВОДЫ", "No transactions yet.": "Пока нет транзакций.",
    "SELECT NETWORK": "ВЫБЕРИТЕ СЕТЬ", "WITHDRAW NETWORK": "СЕТЬ ВЫВОДА",
    "I'VE SENT THE FUNDS": "Я ОТПРАВИЛ СРЕДСТВА", "COPIED": "СКОПИРОВАНО",
    "YOUR WALLET ADDRESS": "АДРЕС КОШЕЛЬКА", "DESTINATION CARD": "КАРТА ПОЛУЧАТЕЛЯ",
    "AVAILABLE BALANCE": "ДОСТУПНО", "WITHDRAW TO": "ВЫВОД НА", "WITHDRAWAL SENT": "ВЫВОД ОТПРАВЛЕН",
    "TOTAL BALANCE": "ОБЩИЙ БАЛАНС", "BALANCES": "БАЛАНСЫ", "TRANSACTION HISTORY": "ИСТОРИЯ ОПЕРАЦИЙ",
    "REAL BALANCE": "РЕАЛЬНЫЙ БАЛАНС", "CASH TABLES": "КЭШ-СТОЛЫ", "CURRENCY": "ВАЛЮТА",
    "TOTAL IN / OUT": "ВВОД / ВЫВОД", "PAID OUT": "ВЫПЛАЧЕНО", "PRIZE": "ПРИЗ", "PROFIT": "ПРОФИТ",

    // ── settings detail ──
    "BACKGROUND MUSIC": "ФОНОВАЯ МУЗЫКА", "SOUND EFFECT": "ЗВУКОВЫЕ ЭФФЕКТЫ",
    "OPENING BET SIZE": "ОТКРЫВАЮЩАЯ СТАВКА", "NORMAL BET SIZE (% OF POT)": "ОБЫЧНАЯ СТАВКА (%)",
    "DEFAULT BUY-IN SOURCE": "ИСТОЧНИК ВХОДА", "BUY-IN AMOUNT": "СУММА ВХОДА",
    "STATS SHOWN": "ПОКАЗ. СТАТИСТИКА", "TABLE FELT": "СУКНО СТОЛА", "OPTIONS": "ОПЦИИ",
    "DISPLAY BALANCES IN": "ПОКАЗЫВАТЬ БАЛАНС В", "TIME DISPLAY SAMPLE": "ПРИМЕР ВРЕМЕНИ",
    "QUICK REACTIONS": "РЕАКЦИИ", "EMOJI": "ЭМОДЗИ", "EMERALD": "ИЗУМРУД",
    "MIDNIGHT": "ПОЛНОЧЬ", "CRIMSON": "БАГРЯНЫЙ", "ROUND TO NEAREST BLIND": "ОКРУГЛЯТЬ ДО ББ",
    "AUTOMATIC BUY-IN": "АВТО ВХОД", "ALWAYS": "ВСЕГДА", "MANUAL": "ВРУЧНУЮ",
    "POT · INCL. BLINDS": "ПОТ · С БЛАЙНДАМИ", "POT · EXCL. BLINDS": "ПОТ · БЕЗ БЛАЙНДОВ",
    "DRAW": "НИЧЬЯ", "LOSS": "ПРОИГРЫШ", "AUTO": "АВТО", "ENGLISH": "АНГЛИЙСКИЙ",
    "GAME SETTINGS": "НАСТРОЙКИ ИГРЫ", "SECURITY": "БЕЗОПАСНОСТЬ", "LOG OUT": "ВЫЙТИ",
    "LEAVE THE APP?": "ВЫЙТИ ИЗ ПРИЛОЖЕНИЯ?", "NO": "НЕТ", "YES": "ДА",

    // ── security ──
    "LINK YOUR PHONE": "ПРИВЯЖИТЕ ТЕЛЕФОН", "PHONE NUMBER": "НОМЕР ТЕЛЕФОНА", "SEND CODE": "ОТПРАВИТЬ КОД",
    "VERIFY & LINK": "ПОДТВ. И ПРИВЯЗАТЬ", "NEW PASSWORD MUST BE 8+ CHARACTERS": "ПАРОЛЬ ОТ 8 СИМВОЛОВ",
    "PASSWORDS DON'T MATCH": "ПАРОЛИ НЕ СОВПАДАЮТ", "LOOKS GOOD": "ВСЁ ВЕРНО",
    "SAVE PASSWORD": "СОХРАНИТЬ ПАРОЛЬ", "LINK YOUR ACCOUNT": "ПРИВЯЖИТЕ АККАУНТ",
    "EXTRA PROTECTION": "ДОП. ЗАЩИТА", "CURRENT PASSWORD": "ТЕКУЩИЙ ПАРОЛЬ",
    "NEW PASSWORD": "НОВЫЙ ПАРОЛЬ", "CONFIRM NEW PASSWORD": "ПОВТОРИТЕ ПАРОЛЬ",
    "HIDE PASSWORDS": "СКРЫТЬ ПАРОЛИ", "SHOW PASSWORDS": "ПОКАЗАТЬ ПАРОЛИ", "LINK PHONE": "ПРИВЯЗАТЬ ТЕЛЕФОН",
    "PHONE LINKED": "ТЕЛЕФОН ПРИВЯЗАН", "PASSWORD UPDATED": "ПАРОЛЬ ОБНОВЛЁН", "PHONE": "ТЕЛЕФОН",
    "CHANGE": "ИЗМЕНИТЬ", "FUND PASSWORD": "ПАРОЛЬ ДЛЯ ОПЕРАЦИЙ", "SET": "ЗАДАТЬ",
    "TWO-FACTOR AUTH": "2FA", "EMAIL": "E-MAIL",

    // ── notifications ──
    "INBOX": "СООБЩЕНИЯ", "MARK ALL READ": "ПРОЧИТАТЬ ВСЁ",
    "NO OLDER MESSAGES": "СООБЩЕНИЙ БОЛЬШЕ НЕТ", "100% WELCOME BONUS": "100% ПРИВЕТСТВЕННЫЙ БОНУС",
    "DAILY DEEP STARTS SOON": "DAILY DEEP СКОРО НАЧНЁТСЯ", "DEPOSIT CONFIRMED": "ДЕПОЗИТ ПОДТВЕРЖДЁН",
    "NEW DEVICE LOGIN": "ВХОД С НОВОГО УСТР.", "WEEKEND CASHBACK ×2": "КЭШБЕК ×2 НА ВЫХОДНЫХ",
    "APP UPDATE 2.4": "ОБНОВЛЕНИЕ 2.4", "VIEW FULL SCHEDULE": "ВСЁ РАСПИСАНИЕ",
    "IMPORTANT": "ВАЖНОЕ", "OTHER": "ПРОЧЕЕ", "NOTHING IMPORTANT RIGHT NOW": "ВАЖНОГО ПОКА НЕТ",
    "NO OTHER MESSAGES": "ДРУГИХ СООБЩЕНИЙ НЕТ",

    // ── events / lists ──
    "SHOW": "ПОКАЗАТЬ", "REG SOON": "РЕГ. СКОРО", "MULTIDAY": "МНОГОДНЕВНЫЙ", "FEATURED": "ИЗБРАННОЕ",
    "ANY": "ЛЮБОЙ", "TYPE": "ТИП", "WINS A SEAT": "ВЫИГРЫВАЕТ МЕСТО", "SEAT": "МЕСТО",
    "STARTS": "СТАРТ", "STARTS IN": "СТАРТ ЧЕРЕЗ", "UNUSED TICKETS": "СВОБОДНЫЕ ТИКЕТЫ",
    "NEXT STARTS": "СЛЕДУЮЩИЙ СТАРТ", "TEAR TO CHOOSE A TOURNAMENT": "ОТОРВИТЕ, ЧТОБЫ ВЫБРАТЬ ТУРНИР",
    "TORN · 1 USE · PICK A TOURNAMENT": "ОТОРВАН · 1 ИСПОЛЬЗОВАНИЕ · ВЫБЕРИТЕ ТУРНИР",
    "USE TICKET": "ИСПОЛЬЗОВАТЬ ТИКЕТ", "NOW": "СЕЙЧАС", "CLOSED": "ЗАКРЫТО", "PICK": "ВЫБРАТЬ",
    "REG CLOSED · RUNNING": "РЕГ. ЗАКРЫТА · ИДЁТ", "SATELLITES": "САТЕЛЛИТЫ", "EVENTS": "СОБЫТИЯ",
    "BACK TO LOBBY": "В ЛОББИ", "JUMP INTO A TABLE": "СЕСТЬ ЗА СТОЛ", "SEATS": "МЕСТА",

    // ── missions / rewards ──
    "DAILY MISSION": "МИССИЯ ДНЯ", "MISSION": "МИССИЯ", "CHOOSE 1 OF": "ВЫБЕРИТЕ 1 ИЗ",
    "IN PROGRESS": "В ПРОЦЕССЕ", "REWARD WAITING": "НАГРАДА ЖДЁТ", "NEXT SET": "СЛЕДУЮЩИЙ НАБОР",
    "TAKEN": "ВЗЯТО", "ALL CLEARED": "ВСЁ ВЫПОЛНЕНО", "MISSION AWAY": "МИССИЯ ДО НАГРАДЫ",
    "MISSIONS AWAY": "МИССИЙ ДО НАГРАДЫ", "PROGRESS": "ПРОГРЕСС", "LIVE NOW": "СЕЙЧАС В ЭФИРЕ",
    "TO GO": "ОСТАЛОСЬ", "DAILY MISSIONS": "МИССИИ ДНЯ", "WEEKLY MISSIONS": "МИССИИ НЕДЕЛИ",
    "ALL CLAIMED": "ВСЁ ПОЛУЧЕНО", "AWAY": "ДО НАГРАДЫ", "CLEARED TODAY": "ВЫПОЛНЕНО СЕГОДНЯ",
    "REWARD LADDER": "ПУТЬ НАГРАД", "REWARD PATH": "ПУТЬ НАГРАД", "JUMP TO TODAY": "К СЕГОДНЯШНЕМУ ДНЮ",
    "STARTER REWARDS": "СТАРТОВЫЕ НАГРАДЫ", "TOTAL REWARDS": "ВСЕГО НАГРАД",
    "SUCCESSFUL MISSIONS": "ВЫПОЛНЕНО МИССИЙ", "30-DAY CHALLENGE": "30-ДНЕВНЫЙ ЧЕЛЛЕНДЖ",
    "COMPLETE": "ЗАВЕРШЕНО", "STREAK REWARD": "НАГРАДА ЗА СЕРИЮ", "STREAK COMPLETE": "СЕРИЯ ЗАВЕРШЕНА",
    "HOW STREAKS WORK": "КАК РАБОТАЮТ СЕРИИ", "BUILD YOUR STREAK": "СОБИРАЙТЕ СЕРИЮ",
    "MILESTONE LADDER": "ЭТАПЫ НАГРАД", "MEGA": "МЕГА", "CHECKED IN": "ОТМЕЧЕНО",
    "One check-in a day.": "Одна отметка в день.", "THIS RUN": "ТЕКУЩАЯ СЕРИЯ", "PAST WEEKS": "ПРОШЛЫЕ НЕДЕЛИ",
    "CHECK IN TO RESUME": "ОТМЕТЬТЕСЬ, ЧТОБЫ ПРОДОЛЖИТЬ", "DAYS LEFT": "ДНЕЙ ОСТАЛОСЬ",
    "1 DAY TO GO": "ОСТАЛСЯ 1 ДЕНЬ", "DAYS TO GO": "ДНЕЙ ОСТАЛОСЬ", "COLLECT": "ЗАБРАТЬ",
    "CODE REDEEMED": "КОД АКТИВИРОВАН", "REDEEM A CODE": "АКТИВИРОВАТЬ КОД",
    "GOT A GIFT CODE?": "ЕСТЬ ПОДАРОЧНЫЙ КОД?", "YOUR CODE": "ВАШ КОД", "REDEEM": "АКТИВИРОВАТЬ",
    "ENTER CODE": "ВВЕДИТЕ КОД", "GRAND GIFT": "ГЛАВНЫЙ ПОДАРОК", "MYSTERY BOX": "МИСТЕРИ БОКС",
    "Added to your account": "Зачислено на ваш аккаунт", "SPINS LEFT TODAY": "ВРАЩЕНИЙ ОСТАЛОСЬ",
    "FORTUNE WHEEL RULES": "ПРАВИЛА КОЛЕСА", "SPINNING": "ВРАЩЕНИЕ", "SPIN NOW": "КРУТИТЬ",
    "SPIN TO WIN": "КРУТИ И ВЫИГРЫВАЙ", "WHEEL SPIN": "ВРАЩЕНИЕ КОЛЕСА", "LOCKED": "ЗАБЛОКИРОВАНО",

    // ── cashback / jackpot ──
    "DAILY CASH DROP": "CASH DROP ДНЯ", "CASH DROP": "CASH DROP",
    "CASHBACK CLAIMED": "НАГРАДА ЗА ДОМИК", "CASHBACK SAFE": "СЕЙФ КЭШБЕКА",
    "HOW CASHBACK WORKS": "КАК РАБОТАЕТ КЭШБЕК", "RECENT PLAY MATTERS": "ВАЖНА НЕДАВНЯЯ ИГРА",
    "STAKE": "ЛИМИТ", "ALL-TIME BIGGEST": "МАКСИМУМ ВСЕГДА", "RECORD HIT": "РЕКОРДНАЯ ВЫПЛАТА",
    "POOL BY STAKE": "ФОНД ПО ЛИМИТАМ", "JACKPOT PAYOUT": "ВЫПЛАТА ДЖЕКПОТА", "MORE RULES": "ЕЩЁ ПРАВИЛА",
    "PLAY CASH GAMES": "ИГРАТЬ В КЭШ-ИГРЫ",
    "JACKPOT": "ДЖЕКПОТ", "JACKPOT WON": "ДЖЕКПОТ ВЫИГРАН", "BAD BEAT WINNER": "ПОБЕДИТЕЛЬ БЭД-БИТА",
    "OPPONENT": "СОПЕРНИК", "EACH OTHER PLAYER": "КАЖДЫЙ ДРУГОЙ ИГРОК", "HIGH HAND": "СТАРШАЯ РУКА",
    "WHERE IT RUNS": "ГДЕ ДЕЙСТВУЕТ", "WHAT TRIGGERS IT": "ЧТО АКТИВИРУЕТ",
    "QUAD TENS OR BETTER": "КАРЕ ДЕСЯТОК ИЛИ ВЫШЕ", "50% OF THE POOL": "50% ФОНДА",
    "YOUR SHARE": "ВАША ДОЛЯ", "BEATEN BY": "ПОБИТ", "STR FLUSH": "СТРИТ-ФЛЕШ",
    "YOUR RAKEBACK": "ВАШ РЕЙКБЕК", "UP TO": "ДО", "BACK ON EVERY HAND": "ВОЗВРАТ С КАЖДОЙ РУКИ",
    "UNLOCKS": "ОТКРЫВАЕТСЯ", "ODDS": "ШАНСЫ", "HAND REPLAY": "ПОВТОР РАЗДАЧИ",
    "Telegram · around the clock": "Телеграм · круглосуточно", "TOP LEAGUE REACHED": "ВЫСШАЯ ЛИГА ДОСТИГНУТА",

    // ── leaderboards / competitions ──
    "LEADERBOARD RULES": "ПРАВИЛА ЛИДЕРБОРДА", "SCORING": "НАЧИСЛЕНИЕ ОЧКОВ", "CYCLE": "ЦИКЛ",
    "SNAPSHOT": "СРЕЗ", "PRIZES PAID": "ПРИЗЫ ВЫПЛАЧЕНЫ", "PLACES PAID": "ПРИЗОВЫХ МЕСТ",
    "LIMIT TIERS": "УРОВНИ ЛИМИТОВ", "ENTRY THRESHOLD": "ПОРОГ ВХОДА", "MONTHLY": "МЕСЯЧНЫЙ",
    "FRIENDS": "ДРУЗЬЯ", "ALL GAMES": "ВСЕ ИГРЫ", "ALL LIMITS": "ВСЕ ЛИМИТЫ",
    "NOT IN THE MONEY": "БЕЗ ПРИЗОВЫХ", "EVERY LIMIT · ONE LIST": "ВСЕ ЛИМИТЫ · ОДИН СПИСОК",
    "ENTRIES + ITM FINISHES": "ВХОДЫ + ПРИЗОВЫЕ", "QUALIFIED REFERRED PLAYERS": "КВАЛИФ. РЕФЕРАЛЫ",
    "ACTIVITY × STAKE COEFFICIENT": "АКТИВНОСТЬ × ЛИМИТ",
    "ALL CASH GAMES · ONE SEASON POOL": "ВСЕ КЭШ-ИГРЫ · ОДИН СЕЗОННЫЙ ФОНД",
    "ALL CASH GAMES · RESETS 00:00": "ВСЕ КЭШ-ИГРЫ · СБРОС В 00:00",
    "ALL TOURNAMENTS · ENTRIES + ITM": "ВСЕ ТУРНИРЫ · ВХОДЫ + ПРИЗОВЫЕ",
    "FIELD": "ПОЛЕ", "POINTS": "ОЧКИ", "ENDS": "КОНЕЦ", "ENTRIES": "ВХОДЫ", "RANK": "МЕСТО",
    "PRIZE WON": "ВЫИГРАННЫЙ ПРИЗ", "TOTAL PRIZE": "ОБЩИЙ ПРИЗ", "REGULAR PRIZE": "ОСНОВНОЙ ПРИЗ",
    "BOUNTY PRIZE": "ПРИЗ ЗА БАУНТИ", "BEST HAND": "ЛУЧШАЯ РУКА", "LAST HAND": "ПОСЛЕДНЯЯ РУКА",
    "TOURNAMENT OVER": "ТУРНИР ЗАВЕРШЁН", "CONGRATULATIONS!": "ПОЗДРАВЛЯЕМ!",
    "YOU WIN THE POT": "ВЫ ЗАБИРАЕТЕ ПОТ", "NEXT HAND": "СЛЕДУЮЩАЯ РУКА",
    "MULTIPLIER HIT": "СРАБОТАЛ МНОЖИТЕЛЬ", "OPENED TODAY": "ОТКРЫТО СЕГОДНЯ",
    "FILLING AS YOU PLAY · RESETS IN": "РАСТЁТ ПО ХОДУ ИГРЫ · СБРОС ЧЕРЕЗ",

    // ── referrals ──
    "INVITE FRIENDS": "ПРИГЛАСИТЬ ДРУЗЕЙ", "SEND INVITE": "ОТПРАВИТЬ ПРИГЛАШЕНИЕ",
    "MAIN PRIZE FOR YOUR 5TH FRIEND": "ГЛАВНЫЙ ПРИЗ ЗА 5 ДРУЗЕЙ", "YOUR PROGRESS": "ВАШ ПРОГРЕСС",
    "GUARANTEED GIFTS": "ГАРАНТ. ПОДАРКИ", "GUARANTEED GIFT": "ГАРАНТ. ПОДАРОК",
    "SHARE YOUR LINK": "ПОДЕЛИТЕСЬ ССЫЛКОЙ", "FRIEND STARTS PLAYING": "ДРУГ НАЧИНАЕТ ИГРАТЬ",
    "5TH FRIEND · MAIN PRIZE": "5-Й ДРУГ · ГЛАВНЫЙ ПРИЗ", "NEXT GIFT": "СЛЕДУЮЩИЙ ПОДАРОК",
    "FRIEND": "ДРУГ", "A FRIEND": "ДРУГ", "1 FRIEND": "1 ДРУГ", "1 WHEEL SPIN": "1 ВРАЩЕНИЕ КОЛЕСА",
    "MAIN PRIZE CLAIMED": "ГЛАВНЫЙ ПРИЗ ВЗЯТ", "SCAN QR CODE": "СКАНИРУЙТЕ QR-КОД",
    "REFERRAL CODE": "РЕФЕРАЛЬНЫЙ КОД", "COPY REFERRAL LINK": "КОПИРОВАТЬ ССЫЛКУ",
    "Leaderboard unavailable.": "Лидерборд недоступен.", "NOTHING TO SHARE": "НЕЧЕМ ПОДЕЛИТЬСЯ",
    "SHARED": "ОТПРАВЛЕНО", "SHARE HAND": "ПОДЕЛИТЬСЯ РАЗДАЧЕЙ", "NOTHING TO SHARE": "НЕЧЕМ ПОДЕЛИТЬСЯ",
    // екран рефералів
    ". Every reward is fixed.": ". Каждая награда фиксированная.",
    "100% bonus on their first deposit": "100% бонус на первый депозит",
    "MAIN PRIZE CLAIMED": "ГЛАВНЫЙ ПРИЗ ПОЛУЧЕН",
    "TABLE IS NOT READY YET": "РАБОТА НАД СТОЛОМ ЕЩЁ НЕ ЗАВЕРШЕНА",
    "Work on the table is not finished yet. It opens in one of the next builds.": "Стол ещё в работе \u2014 он откроется в одном из ближайших билдов.",
    "TABLE": "СТОЛ",
    "SUPPORT": "ПОДДЕРЖКА",
    "RAKEBACK STATS": "СТАТИСТИКА РЕЙКБЕКА", "RAKEBACK YESTERDAY": "РЕЙКБЕК ЗА ВЧЕРА", "PENDING": "К НАЧИСЛЕНИЮ",
    "RAKE YESTERDAY": "РЕЙК ЗА ВЧЕРА", "RAKEBACK 7 DAYS": "РЕЙКБЕК ЗА 7 ДНЕЙ", "LAST 7 PLAYING DAYS": "ДИНАМИКА ЗА 7 ИГРОВЫХ ДНЕЙ",
    "OPERATION HISTORY": "ИСТОРИЯ ОПЕРАЦИЙ", "HOW IT WORKS": "КАК ЭТО РАБОТАЕТ",
    "Rakeback is credited automatically and depends on your level and the rake you have played.": "Рейкбек начисляется автоматически и зависит от уровня и сыгранного рейка.",
    "MORE \u2192": "ПОДРОБНЕЕ \u2192",
    "HAND RANKINGS": "КОМБИНАЦИИ", "MY HAND": "МОЯ КОМБИНАЦИЯ", "YOU HAVE NOW": "СЕЙЧАС У ВАС",
    "YOUR HOLE CARDS": "ВАШИ КАРМАННЫЕ КАРТЫ", "Your two cards are outlined in green": "Ваши две карты обведены зелёным",
    "ROYAL FLUSH": "ФЛЕШ-РОЯЛЬ", "STRAIGHT FLUSH": "СТРИТ-ФЛЕШ", "FOUR OF A KIND": "КАРЕ", "FULL HOUSE": "ФУЛЛ-ХАУС",
    "FLUSH": "ФЛЕШ", "STRAIGHT": "СТРИТ", "THREE OF A KIND": "СЕТ", "TWO PAIR": "ДВЕ ПАРЫ", "ONE PAIR": "ПАРА", "HIGH CARD": "СТАРШАЯ КАРТА",
    "A-K-Q-J-10 of one suit": "Туз-король-дама-валет-десятка одной масти", "Five in a row, one suit": "Пять подряд одной масти",
    "Four cards of the same rank": "Четыре карты одного номинала", "Three of a kind plus a pair": "Сет плюс пара",
    "Five cards of one suit": "Пять карт одной масти", "Five in a row, any suits": "Пять подряд любых мастей",
    "Three cards of the same rank": "Три карты одного номинала", "Two different pairs": "Две разные пары",
    "Two cards of the same rank": "Две карты одного номинала", "Nothing made \u2014 the top card plays": "Ничего не собрано \u2014 играет старшая карта",
    "GAME SETTINGS": "НАСТРОЙКИ ИГРЫ", "GENERAL": "ОБЩИЕ", "BET PRESETS": "ПАРАМЕТРЫ СТАВОК",
    "Top the stack back up to your buy-in whenever it drops below it": "Докупать до суммы входа, как только стек падает ниже неё",
    "SET UP BUY-IN OPTIONS": "НАСТРОЙТЕ ПАРАМЕТРЫ ВХОДА", "DEFAULT BUY-IN": "ВХОД ПО УМОЛЧАНИЮ",
    "If your buy-in is below the table minimum, you take the seat with the minimum": "Если установленный вход ниже минимума стола, вы займёте место с минимальным входом",
    "STACK IN BIG BLINDS": "СТЕК В БОЛЬШИХ БЛАЙНДАХ", "Show every stack in BB instead of money": "Показывать все стеки в ББ вместо денег",
    "FOUR-COLOUR DECK": "ЧЕТЫРЁХЦВЕТНАЯ КОЛОДА", "A colour of its own for every suit": "Своя масть \u2014 свой цвет",
    "CONFIRM SIT OUT": "ПОДТВЕРЖДАТЬ СИТ-АУТ", "Ask before you skip a hand": "Спрашивать перед пропуском раздачи",
    "Chips, cards and dealer at the table": "Фишки, карты и дилер за столом",
    "Coming soon": "Скоро станет доступно",
    "This format is not open yet. It will appear here as soon as we switch it on.": "Формат ещё не открыт. Он появится здесь, как только мы его включим.",
    "QUICK PICK": "БЫСТРОЕ МЕНЮ", "ALL TABLES": "ВСЕ СТОЛЫ", "TOURNAMENTS": "ТУРНИРЫ",
    // правка 13 · переїзд з ClubGG
    "YOUR CLUBGG ACCOUNT HAS MOVED": "ВАШ АККАУНТ CLUBGG ПЕРЕНЕСЁН",
    "Balance and progress are saved · tap to read more": "Баланс и прогресс сохранены · нажмите, чтобы узнать больше",
    "CLUBGG MOVE COMPLETE": "ПЕРЕЕЗД С CLUBGG ЗАВЕРШЁН",
    "Full message: what happened to your account — balance and progress have been moved and saved.": "Полное сообщение: что произошло с аккаунтом — баланс и прогресс перенесены и сохранены.",
    "Your ClubGG account has been moved to PokerDot. Balance, tickets, loyalty level and hand history came across in full — nothing was lost.": "Ваш аккаунт ClubGG перенесён в PokerDot. Баланс, билеты, уровень лояльности и история раздач перенесены полностью — ничего не потеряно.",
    "You sign in with the same credentials. Everything you had is already on the account: open the wallet to check the balance, or the rewards tab to see your level.": "Вход — по тем же данным. Всё, что у вас было, уже на аккаунте: откройте кошелёк, чтобы проверить баланс, или раздел наград, чтобы увидеть уровень.",
    "If something looks wrong, write to support from the inbox — we will sort it out.": "Если что-то выглядит не так — напишите в поддержку из инбокса, разберёмся.",
    "ACCOUNT": "АККАУНТ",
    "SOON": "СКОРО", "IN PROGRESS": "В РАБОТЕ",
    "COLLECTION COMPLETE": "КОЛЛЕКЦИЯ СОБРАНА",
    "ALL CARDS UNLOCKED": "ВСЕ КАРТЫ ОТКРЫТЫ",
    "DRAG TO ROTATE": "ПОВОРАЧИВАЙТЕ ДОМИК ПАЛЬЦЕМ",
    "PAUSE ROTATION": "ОСТАНОВИТЬ",
    "AUTO ROTATE": "ВРАЩАТЬ",
    "YOUR CARD": "ВАША КАРТА",
    "SWIPE TO THE NEXT CARD": "СВАЙП — СЛЕДУЮЩАЯ КАРТА", "THE WINNING HAND": "ПОБЕДНАЯ РАЗДАЧА", "Back to progress": "Вернуться к прогрессу", "CARD STORY": "ИСТОРИЯ КАРТЫ", "✦ LEGENDARY": "✦ ЛЕГЕНДАРНАЯ", "YOUR COLLECTION": "ВАША КОЛЛЕКЦИЯ", "EXPLORE YOUR CARDS": "СМОТРЕТЬ КАРТЫ",
    "LEGENDARY": "ЛЕГЕНДАРНАЯ", "GOLD EDITION": "ЗОЛОТАЯ СЕРИЯ", "ARCHIVE EDITION": "АРХИВНАЯ СЕРИЯ",
    "OPEN THE KING": "ОТКРЫТЬ КОРОЛЯ", "TAP TO BREAK THE SEAL": "НАЖМИТЕ, ЧТОБЫ СНЯТЬ ПЕЧАТЬ", "CARD EARNED": "ЗАРАБОТАНО",
    "KING OF CLUBS": "КОРОЛЬ КРЕСТЕЙ", "A NEW CARD IS YOURS": "НОВАЯ КАРТА ДЛЯ ВАС", "CARD UNLOCKED": "КАРТА ОТКРЫТА",
    "BREAKING THE SEAL": "СНИМАЕМ ПЕЧАТЬ", "WELCOME TO YOUR COLLECTION": "ТЕПЕРЬ ОНА ВАША", "NEW CASHBACK LEVEL": "НОВЫЙ УРОВЕНЬ КЕШБЕКА",
    "THE KING IS YOURS. ONE CARD TO THE ACE.": "Король теперь ваш. До туза — одна карта.", "BACK TO COLLECTION": "В КОЛЛЕКЦИЮ",
    "VIEW COLLECTIBLE": "РАССМОТРЕТЬ КАРТУ", "READ MORE": "ЧИТАТЬ БОЛЬШЕ", "STORY AT LEVEL": "ИСТОРИЯ НА УРОВНЕ", "ABOUT THIS EDITION": "ОБ ИЗДАНИИ", "Previous card": "Предыдущая карта", "Next card": "Следующая карта",
    "SPECIAL": "ОСОБАЯ", "✧ SPECIAL EDITION": "✧ ОСОБАЯ СЕРИЯ", "15 SPECIAL": "✧ 15 ОСОБЫХ", "7 LEGENDARY": "✦ 7 ЛЕГЕНДАРНЫХ",
    "Jerry Yang won the 2007 WSOP Main Event with 8♦ 8♣. In the final hand, his pocket eights defeated Tuan Lam’s A♦ Q♦.": "Джерри Янг выиграл WSOP Main Event 2007 с 8♦ 8♣. В финальной раздаче его карманные восьмёрки победили A♦ Q♦ Туана Лама.",
    "Joe Hachem won the 2005 WSOP Main Event holding 7♣ 3♠. He defeated Steve Dannenmann’s A♦ 3♣ in the final hand to claim the championship.": "Джо Хашем выиграл WSOP Main Event 2005 с 7♣ 3♠. В финальной раздаче он обыграл Стива Данненманна с A♦ 3♣ и стал чемпионом.",
    "IN YOUR COLLECTION": "В ВАШЕЙ КОЛЛЕКЦИИ", "READY TO OPEN": "ГОТОВА К ОТКРЫТИЮ", "SEALED CARD": "ЗАПЕЧАТАНА",
    "REVEALING CARD": "ОТКРЫВАЕМ", "TURN THE CARD": "ПЕРЕВЕРНУТЬ", "OPEN YOUR CARD": "ОТКРЫТЬ КАРТУ", "UNLOCK AT LEVEL": "НА УРОВНЕ",
    "ADDING TO YOUR COLLECTION": "ДОБАВЛЯЕМ В КОЛЛЕКЦИЮ", "A REAL HAND. A MOMENT IN HISTORY.": "РЕАЛЬНАЯ РАЗДАЧА. ЧАСТЬ ИСТОРИИ.",
    "YOURS TO KEEP": "ТЕПЕРЬ ОНА ВАША", "YOUR NEXT COLLECTIBLE IS READY": "ЭТА КАРТА УЖЕ ЖДЁТ ВАС", "XP TO OPEN": "XP ДО ОТКРЫТИЯ",
    "A POKER LEGEND WAITS INSIDE": "ВНУТРИ — ИСТОРИЯ ЛЕГЕНДЫ", "FOLLOW THE PATH TO THIS CARD": "СЛЕДУЙТЕ ПО ПУТИ К ЭТОЙ КАРТЕ",
    "COLLECTION PATH": "ВАШ ПУТЬ", "TO YOUR CARD": "К СВОЕЙ КАРТЕ", "POKERDOT ARCHIVE COLLECTION": "АРХИВНАЯ КОЛЛЕКЦИЯ POKERDOT",
    "SOURCE: OFFICIAL WSOP ARCHIVE": "ИСТОЧНИК: ОФИЦИАЛЬНЫЙ АРХИВ WSOP",
    "With 5♦ 4♠, Chris Moneymaker beat Sam Farha in the final hand of the 2003 WSOP Main Event. A five on the river completed his full house.": "С 5♦ 4♠ Крис Манимейкер победил Сэма Фарху в финальной раздаче WSOP Main Event 2003. Пятёрка на ривере завершила его фулл-хаус.",
    "Johnny Chan held J♣ 9♣ against Erik Seidel in the final hand of the 1988 WSOP Main Event. His straight secured a second consecutive Main Event title.": "В финальной раздаче WSOP Main Event 1988 Джонни Чен держал J♣ 9♣ против Эрика Сайдела. Стрит принёс ему второй подряд титул Main Event.",
    "Q♣ was part of Carlos Mortensen’s winning K♣ Q♣ hand in the 2001 WSOP Main Event final. He defeated Dewey Tomko, who held A♠ A♥.": "Q♣ была частью победной руки K♣ Q♣ Карлоса Мортенсена в финале WSOP Main Event 2001. Он обыграл Дьюи Томко с A♠ A♥.",
    "With A♥ 4♣, Stu Ungar defeated John Strzemp in the final hand of the 1997 WSOP Main Event. A river deuce completed his straight and his third Main Event title.": "С A♥ 4♣ Стю Ангар победил Джона Стрземпа в финальной раздаче WSOP Main Event 1997. Двойка на ривере завершила стрит и принесла ему третий титул Main Event.",
    "Doyle Brunson won the 1976 WSOP Main Event holding 10♠ 2♠. A year later, he won again with ten-deuce, making the combination his signature hand.": "Дойл Брансон выиграл WSOP Main Event 1976 с 10♠ 2♠. Через год он снова победил с десяткой и двойкой — эта комбинация стала его визитной карточкой.",
    "WAITING FOR A PAIR": "ЖДЁТ СВОЮ ПАРУ",
    "This card joins the next pair.": "Встанет в домик, когда появится пара.",
    "NEXT LEAGUE": "СЛЕДУЮЩАЯ МАСТЬ",
    "SWIPE THROUGH YOUR CARDS": "ЛИСТАЙТЕ КАРТЫ СВАЙПОМ",
    "SWIPE TO EXPLORE · TAP TO REVEAL": "СВАЙП — ЛИСТАТЬ · ТАП — ОТКРЫТЬ",
    "UNLOCKED CARD": "КАРТА ОТКРЫТА", "LOCKED CARD": "КАРТА ЗАКРЫТА",
    "REWARD INSIDE": "ВНУТРИ — НАГРАДА",
    "REACH THIS LEVEL TO REVEAL": "Достигните этого уровня, чтобы открыть",
    "XP TO GO": "XP ДО КАРТЫ", "NEXT CHAPTER": "СЛЕДУЮЩАЯ ГЛАВА",
    "COMPLETE THE PREVIOUS SUIT": "Завершите предыдущую масть",
    "BACK TO YOUR CARD": "К ВАШЕЙ КАРТЕ",
    "LEVEL": "УРОВЕНЬ", "UP NEXT": "ДАЛЬШЕ", "JOURNEY": "ПУТЬ", "LEVELS IN THE JOURNEY": "УРОВНЕЙ НА ПУТИ", "EXPLORE THE JOURNEY": "ОТКРЫТЬ ПУТЬ",
    "LEVEL RANGE": "УРОВНИ", "SUIT FINALE": "ФИНАЛ МАСТИ", "ACE — GRAND REWARD": "ТУЗ — ГЛАВНЫЙ ПРИЗ",
    "FIVE SUITS · ONE JOURNEY": "ПЯТЬ МАСТЕЙ · ОДИН ПУТЬ",
    "CHAPTER": "ГЛАВА", "CARDS UNLOCKED": "КАРТ ОТКРЫТО", "SUIT COMPLETE": "МАСТЬ СОБРАНА",
    "YOU ARE HERE": "ВЫ ЗДЕСЬ", "GRAND REWARD": "ГЛАВНАЯ НАГРАДА",
    "EVERY CARD TAKES YOU HIGHER": "КАЖДАЯ КАРТА — ШАГ ВЫШЕ",
    "TAP AN UNLOCKED CARD TO REVEAL": "НАЖМИТЕ НА ОТКРЫТУЮ КАРТУ",
    // рейкбек: карточний домік
    "LEAGUE RAKEBACK": "РЕЙКБЕК ЛИГИ",
    "DEMO": "ДЕМО",
    "The house is built. All accumulated XP opens together.": "Домик готов. Весь накопленный XP превращается в награду.",
    "Demo reward recorded. All accumulated cycle XP has been collected.": "Демо-награда записана. Весь XP цикла учтён в этой выплате.",
    "Demo history: rewards received divided by rake generated in the same period. The result differs from the estimated league rate.": "Демо-история: полученные награды / рейк за тот же период. Показатель отличается от ориентировочного рейкбека лиги.",
    "Five leagues: diamonds, clubs, hearts, spades and DOT. Displayed league rates are estimates; balance is in development.": "Пять лиг: буби, крести, черви, пики и DOT. Проценты ориентировочные — баланс в разработке.",
    "PLAY — EARN XP": "ИГРАЙ — КОПИ XP",
    "Each new level flips a card of your suit — deuce to ace, a reward under every card. The ace is the grand one.": "Новый уровень открывает карту масти — от двойки до туза. Под каждой картой награда; туз — главный приз.",
    "3D PREVIEW ·": "3D-ПРОСМОТР ·",
    "ALL LEAGUES": "ВСЕ ЛИГИ",
    "ETERNAL": "НАВСЕГДА",
    "First card collected · waiting for a pair": "Первая карта получена · ждём пару",

    "CARD HOUSE": "КАРТОЧНЫЙ ДОМИК", "HISTORY": "ИСТОРИЯ",
    "Five suits, thirteen cards each — deuce to ace. Reached cards lie face up; tap one to flip its reward. The ace is the suit's grand finale and your ticket to the next league.": "Пять мастей по тринадцать карт — от двойки до туза. Открытые карты лежат лицом вверх; нажмите на любую, чтобы увидеть её награду. Туз — финал масти и билет в следующую лигу.", "YOUR RAKEBACK": "ВАШ РЕЙКБЕК", "SWIPE TO SPIN · TAP TO FLIP": "СВАЙП — ВРАЩАТЬ · ТАП — ПЕРЕВЕРНУТЬ",
    "OPEN THE HOUSE": "ЗАБРАТЬ НАГРАДУ", "MY CARDS": "МОИ КАРТЫ", "BUILDING": "СТРОИТСЯ", "OPENING": "ЗАБИРАЕМ", "COLLECT": "ЗАБРАТЬ", "RECEIVED": "ПОЛУЧЕНО", "OF RAKE": "ОТ РЕЙКА", "RAKE": "РЕЙК", "EVENTS": "СОБЫТИЯ",
    "CARD HOUSE OPENED": "НАГРАДА ЗА ДОМИК", "NO REWARDS IN THIS PERIOD": "ЗА ЭТОТ ПЕРИОД НАГРАД НЕТ", "CARD HOUSE — 1 000 XP": "КАРТОЧНЫЙ ДОМИК — 1 000 XP",
    "The house is built — open it whenever you like. Extra XP carries over.": "Домик готов — заберите награду, когда захотите. Лишние XP перейдут в следующий.",
    "Added to your balance. Extra XP stays in the next house.": "Зачислено на баланс. Лишние XP уже пошли в новый домик.",
    "Actual figure for these days. It differs from your league rate because the house opens in steps, not evenly.": "Фактическая цифра за эти дни. Отличается от ставки лиги: домик открывается шагами, а не равномерно.",
    "Every $1 of rake you generate is 100 XP. XP never burns and moves two tracks at once.": "Каждый $1 сгенерированного рейка — 100 XP. XP не сгорает и двигает сразу два трека.",
    "Every 13 cards — a new suit and +10% rakeback: diamonds, clubs, hearts, spades and DOT above them all.": "Каждые 13 карт — новая масть и +10% рейкбека: бубны, трефы, червы, пики и DOT над всеми.",
    "Cards stack in pairs as XP grows. Reach the mark, open the house, take the cash — the floor stays once you start the next suit.": "Карты встают парами по мере роста XP. Дошли до отметки — заберите награду; этаж закрепится, когда начнёте следующую масть.",
    // друзі (реферальний екран)
    "MY FRIENDS": "МОИ ДРУЗЬЯ", "INVITED": "ПРИГЛАШЕНО", "DEPOSITED": "С ДЕПОЗИТОМ", "EARNED": "ЗАРАБОТАНО",
    "NO DEPOSIT": "БЕЗ ДЕПОЗИТА", "SIGNED UP": "ЗАРЕГИСТРИРОВАЛСЯ", "SPINS EARNED": "СПИНОВ ПОЛУЧЕНО", "SPINS": "СПИНЫ",
    "+1 SPIN": "+1 СПИН", "INVITE MORE FRIENDS": "ПРИГЛАСИТЬ ЕЩЁ ДРУЗЕЙ", "TODAY": "СЕГОДНЯ", "YESTERDAY": "ВЧЕРА",
    "SPIN AFTER DEPOSIT": "СПИН ПОСЛЕ ДЕПОЗИТА",
    "You get one spin for each friend — it is credited the moment they make their first deposit.": "За каждого друга — один спин. Он начисляется, как только друг делает первый депозит.",
    "PLO5": "ОМАХА 5", "OMAHA5": "ОМАХА 5", "OPEN TABLE": "ОТКРЫТЬ СТОЛ", "JOIN THE QUEUE": "ВСТАТЬ В ОЧЕРЕДЬ",
    "NO ACTIVE TABLES": "АКТИВНЫХ СТОЛОВ НЕТ",
    "Nothing matches these filters right now. Change the discipline or reset the filters.": "Под эти фильтры сейчас ничего не подходит. Смените дисциплину или сбросьте фильтры.",
    "RESET FILTERS": "СБРОСИТЬ ФИЛЬТРЫ",
    "CHOOSE THIS MISSION?": "ВЫБРАТЬ ЭТУ МИССИЮ?",
    "The other missions in this set will close. This cannot be undone.": "Остальные миссии в этом наборе закроются. Отменить будет нельзя.", "FULL RING · 9": "ПОЛНЫЙ СТОЛ · 9",
    "TABLE SIZE": "РАЗМЕР СТОЛА", "TABLE TAGS": "ТЕГИ СТОЛА", "9-MAX": "9-MAX", "DISCIPLINE": "ДИСЦИПЛИНА",
    "VPIP 30+": "VPIP 30+", "NO FULL": "БЕЗ ЗАПОЛНЕННЫХ", "NO EMPTY": "БЕЗ ПУСТЫХ",
    // архітектура 09.09
    "ME": "DotCenter", "SETTINGS": "НАСТРОЙКИ", "COMPETITIONS": "СОРЕВНОВАНИЯ",
    "STATS CABINET": "КАБИНЕТ СТАТИСТИКИ", "Your results by game and limit": "Ваши результаты по играм и лимитам",
    "COMING SOON": "СКОРО", "Your results by game, limit and period will live here.": "Здесь будут ваши результаты по играм, лимитам и периодам.",
    "TABLE CHAT": "ЧАТ СТОЛА", "Message\u2026": "Сообщение\u2026",
    "CHANGE PHOTO": "СМЕНИТЬ ФОТО",
    "YOU JOIN A LIMIT, NOT A TABLE \u2014 SEATS ARE DEALT AUTOMATICALLY": "Вы заходите на лимит, а не за конкретный стол \u2014 места раздаются автоматически",
    "Cash tables": "Кэш-столы", "Fast Poker": "Быстрый покер", "4-card Omaha": "4-карточная Омаха",
    "5-card Omaha": "5-карточная Омаха", "6-card Omaha": "6-карточная Омаха", "6+ Hold'em": "6+ Холдем",
    "CASH": "КЭШ", "FAST POKER": "БЫСТРЫЙ ПОКЕР",
    "FILTERS": "ФИЛЬТРЫ", "ALL GAMES": "ВСЕ ИГРЫ", "NO EMPTY": "БЕЗ ПУСТЫХ", "NO FULL": "БЕЗ ЗАПОЛНЕННЫХ",
    "SCAN QR CODE": "ОТСКАНИРУЙТЕ QR-КОД", "COPY REFERRAL LINK": "КОПИРОВАТЬ ССЫЛКУ",
    "100% bonus": "100% бонус",
    "QUALIFICATION PATH": "ПУТЬ ОТБОРА", "DIRECT": "НАПРЯМУЮ", "THIS EVENT": "ЭТОТ ТУРНИР",
    "TO LOBBY": "В ЛОББИ", "CHANGE TABLE": "СМЕНИТЬ СТОЛ", "NEW TABLE": "НОВЫЙ СТОЛ",
    "After this hand \u2014 same game, same limit": "После текущей раздачи \u2014 та же игра и лимит",
    "Changing table after this hand": "Сменим стол после этой раздачи",
    "Moved to a new table": "Вы за новым столом",
    "TOP BACK UP TO": "ДОКУПАТЬ ДО", "WHEN YOU DROP BELOW": "ПРИ ПАДЕНИИ НИЖЕ",
    "YOUR RANK": "ВАШЕ МЕСТО", "YOUR POSITION": "ВАШЕ МЕСТО", "NO WITHDRAW": "БЕЗ ВЫВОДА",
    "ALL OPERATIONS": "ВСЕ ОПЕРАЦИИ", "LAST 180 DAYS": "ПОСЛЕДНИЕ 180 ДНЕЙ", "RECORDS": "ЗАПИСЕЙ",
    "NEXT CARD": "СЛЕДУЮЩАЯ КАРТА", "CARDS 2\u2013A": "КАРТЫ 2\u2013A",
    "Flip the next card to claim its reward": "Переверните следующую карту, чтобы забрать награду",
    "Ready \u2014 open whenever you like. Extra XP keeps stacking, nothing burns.": "Готово \u2014 открывайте когда хотите. Лишний XP копится, ничего не сгорает.",
    "Funds arrive in": "Деньги придут за", "no fees": "без комиссии",
    "TOP EVENTS": "ГЛАВНЫЕ СОБЫТИЯ", "EVENTS": "СОБЫТИЯ",
    "BET STEP": "ШАГ СТАВКИ",
    "CONFIRM THE BET": "ПОДТВЕРЖДЕНИЕ СТАВКИ",
    "Ask before the bet goes in": "Спрашивать перед отправкой ставки",
    "MONEY": "ДЕНЬГИ", "OVER POT": "БОЛЬШЕ БАНКА",
    "STORIES": "СТОРИС",
    "Think you can beat that? Take a seat.": "Думаешь, обыграешь? Садись за стол.",
    "JOIN ME ON POKERDOT": "ИГРАЙ СО МНОЙ В POKERDOT",
    // екран «Ставки»
    "OPENING BET \u00B7 IN BIG BLINDS": "НАЧАЛЬНАЯ СТАВКА \u00B7 В БОЛЬШИХ БЛАЙНДАХ",
    "RAISE / BET INTO A POT \u00B7 % OF THE POT": "СТАВКА В БАНК \u00B7 % ОТ БАНКА",
    "What the +/\u2212 on the table's raise slider adds": "На сколько меняют ставку кнопки +/\u2212 на столе",
    "These four shortcuts sit above the bet slider at the table. The first row is used when the pot is still unopened, the second when there is already a bet to raise. One set for every format \u2014 cash, tournaments and Spin & Win.": "Эти четыре кнопки стоят над слайдером ставки за столом. Первый ряд работает, когда банк ещё не открыт, второй \u2014 когда уже есть ставка для рейза. Один набор для всех форматов: кэш, турниры и Spin & Win.",
    "3-max \u00B7 up to \u00D71000": "3-max \u00B7 до \u00D71000",
    // E6: спливашки шерингу запрошення
    "Image saved to your photos": "Картинка сохранена в галерею",
    "Image saved \u2014 open Instagram Stories to post it": "Картинка сохранена — откройте Instagram Stories и опубликуйте",
    "Telegram opened with your link": "Telegram открыт с вашей ссылкой",
    "WhatsApp opened with your link": "WhatsApp открыт с вашей ссылкой",
    "X opened with your link": "X открыт с вашей ссылкой",
    "Link copied": "Ссылка скопирована",
    "Shared": "Отправлено",

    // ── profile / avatar ──
    "CHOOSE AVATAR": "ВЫБЕРИТЕ АВАТАР", "YOUR PHOTO": "ВАШЕ ФОТО", "UPLOAD A PHOTO": "ЗАГРУЗИТЬ ФОТО",
    "50 STANDARD AVATARS · OR UPLOAD YOUR OWN": "50 АВАТАРОВ · ИЛИ СВОЁ ФОТО",
    "This photo needs attribution": "Для фото нужно указать автора", "Replace": "Заменить", "Edit": "Изменить",
    "Drop a PNG, JPEG, WebP, or AVIF image.": "Перетащите PNG, JPEG, WebP или AVIF.",
    "TOURNEYS": "ТУРНИРЫ",

    // ── fast poker / game info ──
    "FAST POKER RULES": "ПРАВИЛА FAST POKER", "ON EVERY LIMIT": "НА ВСЕХ ЛИМИТАХ",
    "FOLD AND YOU ARE DEALT IN AGAIN": "ПАС — И НОВАЯ РАЗДАЧА",
    "FOLD AND YOU ARE MOVED": "ПАС — И НОВЫЙ СТОЛ",
    "YOU JOIN A LIMIT, NOT A TABLE": "ВХОД В ЛИМИТ, А НЕ ЗА СТОЛ",
    "THE FASTEST CASH GAME": "САМЫЙ БЫСТРЫЙ КЭШ", "ALL DISCIPLINES": "ВСЕ ДИСЦИПЛИНЫ",
    "RING & 6-MAX CASH": "9-MAX И 6-MAX", "RING & 6-MAX CASH TABLES": "9-MAX И 6-MAX",
    "WIN UP TO ×1000 YOUR BUY-IN": "ДО ×1000 ВХОДА",
    "4-CARD POT-LIMIT OMAHA": "4-КАРТ. ПЛО", "36-CARD DECK · 6 TO ACE": "36 КАРТ · С 6 ДО A",
    "MIN PLAYERS": "МИН. ИГРОКОВ", "MAX PLAYERS": "МАКС. ИГРОКОВ", "ACTION TIME": "ВРЕМЯ НА ХОД",
    "DISCONNECT TIME": "ВРЕМЯ ПРИ ОБРЫВЕ", "SPEED": "СКОРОСТЬ", "SEATING": "РАССАДКА", "POOLED": "ОБЩИЙ ПУЛ",
    "UP TO 84 HANDS/HR": "ДО 84 РУК/ЧАС", "FASTER ON LOWER LIMITS · SHOWN PER LIMIT": "БЫСТРЕЕ НА НИЗКИХ ЛИМИТАХ · ПОКАЗАНО ПО ЛИМИТАМ",
    "BAD BEAT + HIGH HAND": "БЭД-БИТ + СТАРШАЯ РУКА",
    "LOSE WITH QUAD ACES OR BETTER TO QUALIFY": "ПРОИГРЫШ С КАРЕ ТУЗОВ И ВЫШЕ",
    "INSURANCE": "СТРАХОВКА", "POT FAVOURITE MAY INSURE AN ALL-IN": "ФАВОРИТ МОЖЕТ СТРАХОВАТЬ ВА-БАНК",
    "MULTIPLE DEALING": "МУЛЬТИ-РАЗДАЧА",
    "UNDERDOG MAY RUN IT TWICE OR THREE TIMES": "АНДЕРДОГ МОЖЕТ СЫГРАТЬ БОРД 2 ИЛИ 3 РАЗА",
    "VIP REWARDS": "VIP-НАГРАДЫ", "RAKE PAID HERE EARNS UPP POINTS": "РЕЙК ЗДЕСЬ ПРИНОСИТ ОЧКИ UPP",
    "SINGLE BOARD": "ОДИН БОРД", "PLAYERS ·": "ИГРОКИ ·", "PER TIER": "ПО УРОВНЮ",
    "MAIN EVENT": "ГЛАВНЫЙ ТУРНИР", "ITM": "В ПРИЗАХ", "COMPLETE 7 DAYS": "ЗАВЕРШИТЕ 7 ДНЕЙ",
    "CHECK IN DAILY": "ОТМЕТКА КАЖДЫЙ ДЕНЬ", "KEEP THE CHAIN": "НЕ ПРЕРЫВАЙТЕ СЕРИЮ",
  };

  Object.assign(DICT, {
    "You're playing too tight for this table. Loosen up and get involved to keep your seat.": "Вы играете слишком тайтово для этого стола. Играйте активнее, чтобы сохранить место.",
    "Still below the minimum. Play a hand within the next 3 or you'll be removed from the table.": "Всё ещё ниже минимума. Сыграйте руку в течение 3 следующих, иначе вас удалят со стола.",
    "Your VPIP stayed below the 30% minimum. You've been removed and can't rejoin this table for a while.": "Ваш VPIP остался ниже минимума 30%. Вас удалили, и вернуться за этот стол пока нельзя.",
    "Join free — dealt in when the blind reaches you": "Бесплатный вход — раздача, когда блайнд дойдёт до вас",
    "Keep your seat and pop back to the lobby, or leave the table for good.": "Сохранить место и вернуться в лобби — или покинуть стол окончательно.",
    "Keep your seat and pop back to the lobby, or leave the table and cash out.": "Сохранить место и вернуться в лобби — или покинуть стол и забрать стек.",
    "We'll seat you automatically when a spot opens.": "Мы посадим вас автоматически, как только освободится место.",
    "Fast-fold poker. Fold and you're instantly moved to a new table with a fresh hand — no waiting. Maximum hands per hour.": "Быстрый покер. Сбросили — и вы моментально за новым столом с новой рукой, без ожидания. Максимум рук в час.",
    "Texas Hold'em is the most-played poker variant. You get 2 hole cards, share 5 community cards, and make the best 5-card hand.": "Техасский холдем — самая популярная разновидность покера. 2 карманные карты, 5 общих, лучшая рука из пяти карт.",
    "Pot-Limit Omaha. Bigger pots, bigger draws, bigger swings. You must use exactly 2 of your 4 hole cards.": "Пот-лимит Омаха. Больше поты, больше дро, больше свингов. Нужно использовать ровно 2 из 4 карманных карт.",
    "Stronger hands than Texas Hold'em — flushes/sets common": "Руки сильнее, чем в холдеме — флеши и сеты частые",
    "PLO with 5 hole cards. Even more drawing equity, even crazier action. Same rules, but every starting hand has potential.": "PLO с 5 карманными картами. Ещё больше эквити на дро и ещё безумнее экшен. Правила те же, но потенциал есть у любой стартовой руки.",
    "PLO with 6 hole cards — peak chaos. Almost any hand can connect. For seasoned PLO players only.": "PLO с 6 карманными картами — максимальный хаос. Зацепиться может почти любая рука. Только для опытных игроков в PLO.",
    "Hold'em with cards 2 through 5 removed (36-card deck). Flushes beat full houses. Aces play low for straights.": "Холдем без карт от 2 до 5 (колода 36 карт). Флеш бьёт фулл-хаус. Тузы играют младшими в стритах.",
    "Pick mode, discipline and stakes step by step.": "Выберите режим, дисциплину и лимит шаг за шагом.",
    "Jump straight in by game type — Quick, Classic or other formats.": "Сразу в игру по типу — быстрый, классический или другие форматы.",
    "Spin an iOS-style wheel of game tiles, then play the centered one.": "Прокрутите колесо плиток и играйте в ту, что по центру.",
    "Buy-in compensated if eliminated at the bubble": "Вход компенсируется при выбывании на баббле",
    "Top 13% of the field is paid. Percentages shown for the current live pool.": "Призовые получают топ-13% поля. Проценты указаны для текущего фонда.",
    "Seats are awarded whole — the cash remainder goes to the first place below the seat line. Winners are auto-registered into the target event.": "Места выдаются целиком — денежный остаток уходит на первое место ниже линии мест. Победители автоматически регистрируются в целевой турнир.",
    "Top 13% of the field is paid. Payouts update live as registrations grow.": "Призовые получают топ-13% поля. Выплаты обновляются по мере регистраций.",
    "Win any stage to climb one level — prizes are awarded as tickets to the stage above. Tap a stage to open its lobby.":
      "Победа на любой ступени поднимает на уровень выше — приз выдаётся билетом на следующую ступень. Нажмите ступень, чтобы открыть её лобби.",
    "1× STEP 2 TICKET": "1× БИЛЕТ НА СТУПЕНЬ 2",
    "1× MEGA SAT TICKET": "1× БИЛЕТ НА МЕГА-САТЕЛЛИТ",
    "LEVELS 1–10": "УРОВНИ 1–10",
    "Win any stage to move one level up — prizes are awarded as tickets to the next stage.": "Победа на любой ступени поднимает вас выше — призы выдаются тикетами на следующую ступень.",
    "Players who win a seat are registered into the target event automatically and cannot unregister. If you already hold a seat, further wins pay the ticket value instead.": "Победители получают место в целевом турнире автоматически и не могут отменить регистрацию. Если место уже есть, дальнейшие победы выплачиваются стоимостью тикета.",
    "Get seated immediately without opening the buy-in window.": "Сесть за стол сразу, без окна входа.",
    "Only when you have money in the pot, including blinds/ante.": "Только когда у вас есть деньги в поте, включая блайнды/анте.",
    "Only when you have money in the pot, excluding blinds/ante.": "Только когда у вас есть деньги в поте, не считая блайндов/анте.",
    "If below the table minimum, you'll be seated with the lowest buy-in allowed.": "Если сумма ниже минимума стола, вас посадят с минимально допустимым входом.",
    "When playing multiple tables, the game automatically determines your most important table and pops it to the front when it's your turn.": "При игре на нескольких столах приложение само определяет важнейший стол и выводит его вперёд, когда ваш ход.",
    "Auto-use your Time Bank on your turns until it is exhausted.": "Автоматически использовать тайм-банк на ваших ходах, пока он не исчерпан.",
    "After a hand resolves, your three quick-reaction buttons appear. Tap one to show that emoji to the other players.": "После раздачи появляются три кнопки быстрых реакций. Нажмите — и эмодзи увидят другие игроки.",
    "We'll text a 6-digit code to verify your number.": "Мы отправим SMS с 6-значным кодом для подтверждения номера.",
    "Your account is protected. Enable two-factor auth for an extra layer of security.": "Аккаунт защищён. Включите двухфакторную аутентификацию для дополнительной защиты.",
    "Don't miss the Hot Poker Summer 2026 tournaments — tap to read.": "Не пропустите турниры Hot Poker Summer 2026 — нажмите, чтобы прочитать.",
    "Your first deposit is matched up to $1 000. Tap to claim.": "Первый депозит удваиваем до $1 000. Нажмите, чтобы забрать.",
    "A login from a new device was detected and approved.": "Обнаружен и подтверждён вход с нового устройства.",
    "Earn double cashback all weekend on cash tables.": "Двойной кэшбек на кэш-столах все выходные.",
    "Fast-fold cash is live. Fold and jump to a fresh table instantly.": "Быстрый кэш уже доступен. Сбросили — и сразу за новый стол.",
    "Smoother tables and a redesigned rewards path. See what's new.": "Плавнее столы и переработанный путь наград. Смотрите, что нового.",
    "Tap a tournament to read the details, or use your ticket to register instantly.": "Нажмите на турнир, чтобы открыть детали, или зарегистрируйтесь тикетом сразу.",
    "Real money. Withdraw it any time, or spend it anywhere in the app.": "Реальные деньги. Выводите в любой момент или тратьте в приложении.",
    "Play-only chips for cash tables. Can’t be withdrawn — converts to cashback as you play.": "Игровые фишки для кэш-столов. Вывести нельзя — превращаются в кэшбек по ходу игры.",
    "Tournament currency. Buys into MTTs and Sit & Go. Can’t be withdrawn.": "Турнирная валюта. Оплачивает вход в MTT и Sit & Go. Вывести нельзя.",
    "Cash$ sits at cash tables; Tourney$ buys into tournaments. Neither can be withdrawn — both convert to cashback as you play.": "Cash$ работает на кэш-столах, Tourney$ оплачивает турниры. Вывести нельзя ни то, ни другое — оба превращаются в кэшбек по ходу игры.",
    "Your wallet holds three kinds of funds. Only USD can be withdrawn — the others are for play and turn into cashback as you play.": "В кошельке три типа средств. Вывести можно только USD — остальные для игры и превращаются в кэшбек.",
    "Pick the one you want to play today. The others close for this set.": "Выберите ту, которую хотите пройти сегодня. Остальные в этом наборе закроются.",
    "Reward taken. A fresh set of missions arrives at the next refresh.": "Награда получена. Новый набор миссий придёт при следующем обновлении.",
    "Take the reward to unlock the next set — missions do not refresh until you do.": "Забери награду, чтобы открыть следующий набор — до этого миссии не обновятся.",
    "Every spin of the Fortune Wheel pays cash, tickets or a jackpot slice.": "Каждое вращение колеса фортуны даёт деньги, тикеты или долю джекпота.",
    "Enter your code below to claim tickets, bonuses and other rewards.": "Введите код ниже, чтобы получить тикеты, бонусы и другие награды.",
    "Codes are shared in our promos, streams and community. Each code can be redeemed once per account.": "Коды раздаются в акциях, на стримах и в сообществе. Один код — одна активация на аккаунт.",
    "Choose how you'd like to reach us — our team replies fast.": "Выберите удобный способ связи — наша команда отвечает быстро.",
    "Win tickets from Tasks, gift codes and promos. Tap a ticket to use it.": "Получайте тикеты за задания, промокоды и акции. Нажмите на тикет, чтобы использовать.",
    "Every hand you play earns experience. Higher stakes and more activity — faster level growth.": "Каждая сыгранная рука даёт опыт. Выше лимиты и больше активности — быстрее рост уровня.",
    "Every new level opens a gift with a reward. The 10th level of a league is the grand gift with a top prize.": "Каждый новый уровень открывает подарок с наградой. 10-й уровень лиги — главный подарок с максимальным призом.",
    "Every 10 levels — a new league: Wood, Bronze, Silver, Gold, Diamond. Higher league — bigger cashback and a fancier frame.": "Каждые 10 уровней — новая лига: Дерево, Бронза, Серебро, Золото, Алмаз. Выше лига — больше кэшбек и красивее рамка.",
    "Fee returns drop into your safe while you play. Open it every day and claim what's inside.": "Возврат комиссии капает в сейф, пока вы играете. Открывайте его каждый день и забирайте содержимое.",
    "The map runs top to bottom — from the highest league to the starting one. Expand a league to see its gifts. CLAIM activates once the level is reached; the last gift of a league is the grand one.": "Карта идёт сверху вниз — от высшей лиги к стартовой. Раскройте лигу, чтобы увидеть её подарки. Кнопка ЗАБРАТЬ активна с момента достижения уровня; последний подарок лиги — главный.",
    "Cashback is a return of part of the table fee you pay while playing. Playing earns XP and raises your level — from 1 to 50. Every level opens a gift, and your league sets the return percentage and the color of your frame.": "Кэшбек — это возврат части комиссии стола, которую вы платите во время игры. Игра приносит опыт и повышает уровень — с 1 до 50. Каждый уровень открывает подарок, а лига задаёт процент возврата и цвет рамки.",
    "Your level reflects not only your all-time volume but also your recent play:": "Уровень отражает не только общий объём игры, но и вашу недавнюю активность:",
    "Your avatar frame changes color with your league — from wood to diamond. Everyone at the table sees it. Only you see your level.": "Рамка аватара меняет цвет вместе с лигой — от дерева до алмаза. Её видят все за столом. Уровень видите только вы.",
    "Percentages are illustrative and depend on your level, stakes and table activity.": "Проценты приведены для примера и зависят от уровня, лимитов и активности за столом.",
    "The Bad Beat jackpot triggers when a very strong hand still loses the pot at a qualifying cash table.": "Джекпот Bad Beat срабатывает, когда очень сильная рука всё равно проигрывает пот на квалифицирующем кэш-столе.",
    "Both the losing and winning hands must use both hole cards (Hold'em) or the game's required hole cards (Omaha).": "И проигравшая, и победившая руки должны использовать обе карманные карты (холдем) или требуемые картой игры (Омаха).",
    "The minimum qualifying losing hand depends on the game — see the triggers above.": "Минимальная квалифицирующая проигравшая рука зависит от игры — см. условия выше.",
    "All players dealt into the hand share the table portion. You must be seated and dealt in to qualify.": "Долю стола делят все участники раздачи. Для квалификации нужно сидеть за столом и получить карты.",
    "The remaining balance reseeds the next Grand Jackpot after every drop.": "Остаток фонда после каждой выплаты идёт в следующий Гранд-джекпот.",
    "The remaining balance reseeds the next Grand Jackpot.": "Остаток фонда идёт в следующий Гранд-джекпот.",
    "The High Hand jackpot pays the strongest qualifying hand made during each hour on a qualifying cash table.": "Джекпот High Hand выплачивается за сильнейшую квалифицирующую руку часа на квалифицирующем кэш-столе.",
    "You must reach showdown with the hand — pots won before showdown don't qualify.": "С рукой нужно дойти до шоудауна — поты, взятые раньше, не квалифицируются.",
    "The minimum qualifying hand depends on the game — see the triggers above.": "Минимальная квалифицирующая рука зависит от игры — см. условия выше.",
    "If two players make the same rank, the earlier hand of the hour wins.": "При одинаковой силе рук побеждает та, что была раньше в течение часа.",
    "High Hand and Bad Beat share one Grand Jackpot pool, fed by the same table fee.": "High Hand и Bad Beat используют один фонд Гранд-джекпота, который наполняется той же комиссией стола.",
    "When a monster hand still loses at a qualifying cash table, this pool drops.": "Когда монструозная рука всё же проигрывает на квалифицирующем кэш-столе, этот фонд выплачивается.",
    "Make the strongest qualifying hand of the hour to claim from this pool.": "Соберите сильнейшую квалифицирующую руку часа, чтобы забрать из этого фонда.",
    "Paid from the shared pool as a fixed multiple of the big blind.": "Выплачивается из общего фонда как фиксированное кратное большого блайнда.",
    "One pool, two ways to win — Bad Beat & High Hand.": "Один фонд, два способа выиграть — Bad Beat и High Hand.",
    "Jackpot values update live. Qualifying rules apply per game and stake. Play responsibly.": "Суммы джекпота обновляются в реальном времени. Условия квалификации зависят от игры и лимита. Играйте ответственно.",
    "One mission per day. Each mission has its own 24-hour countdown.": "Одна миссия в день. У каждой миссии свой 24-часовой отсчёт.",
    "Miss it and that mission is lost for good — the next one starts automatically with a fresh countdown.": "Пропустили — миссия потеряна навсегда, следующая начнётся автоматически с новым отсчётом.",
    "Rewards land the moment your number of SUCCESSFUL missions hits a threshold: 1, 3, 5, 7, 9, 11, 14, 16, 19, 22, 26, 30.": "Награды приходят, как только число ВЫПОЛНЕННЫХ миссий достигает порога: 1, 3, 5, 7, 9, 11, 14, 16, 19, 22, 26, 30.",
    "Tournament missions count only after the tournament ends.": "Турнирные миссии засчитываются только после окончания турнира.",
    "One simple mission a day. Rewards land the moment you clear a milestone — cash, Spin & Win tickets, and a seat in the Main Event.": "Одна простая миссия в день. Награды приходят при достижении этапа — деньги, тикеты Spin & Win и место в Главном турнире.",
    "Points are scored on every hand you play inside the board's window — no opt-in, no registration.": "Очки начисляются за каждую руку в период действия лидерборда — без подписки и регистрации.",
    "Prizes are computed on the limit tier you played in, so micro stakes never race high rollers for the same money.": "Призы считаются по уровню лимитов, на которых вы играли, поэтому микролимиты не соревнуются с хай-роллерами за одни деньги.",
    "Play several limits and you stand on several tier ladders at once; each pays on its own.": "Играете на нескольких лимитах — участвуете сразу в нескольких зачётах, каждый выплачивается отдельно.",
    "The board freezes at the end of its window and prizes land on your balance at the stated time.": "Лидерборд фиксируется в конце периода, и призы приходят на баланс в указанное время.",
    "They sign up with your link and make a first deposit.": "Друг регистрируется по вашей ссылке и делает первый депозит.",
    "You instantly get a guaranteed gift. Your 5th friend unlocks the $50 main prize.": "Вы сразу получаете гарантированный подарок. 5-й друг открывает главный приз $50.",
    "A guaranteed gift for every friend, up to $50 for the 5th": "Гарантированный подарок за каждого друга, до $50 за пятого",
    "Every friend who signs up and makes their first deposit earns you a": "Каждый друг, который зарегистрируется и внесёт первый депозит, приносит вам",
    "Join the leading blockchain poker platform and earn up to": "Присоединяйся к ведущей блокчейн-платформе покера и получай до",
    "Share your referral link with a new player. They can spin the wheel once and claim their reward after registering and logging in with your link.": "Поделитесь реферальной ссылкой с новым игроком. Он сможет крутить колесо один раз и забрать награду после регистрации и входа по вашей ссылке.",
    "For each new player you successfully refer, you earn one spin. Max 5 spins per day. Only one referral per device counts, to prevent abuse.": "За каждого приглашённого игрока вы получаете одно вращение. Максимум 5 вращений в день. Учитывается один реферал с устройства — против злоупотреблений.",
    "Miss a day and the run restarts — your total keeps counting.": "Пропустили день — серия начинается заново, общий счёт сохраняется.",
    "A screenshot of your table with your referral link on the frame — every share invites friends.": "Скриншот вашего стола с реферальной ссылкой на рамке — каждый пост приглашает друзей.",
    "Fold your hand and you are dealt in again immediately at a new table — no waiting for the round to finish.": "Сбросили руку — и вам сразу раздают за новым столом, без ожидания конца круга.",
    "Everyone playing a limit sits in one pool. The seat is picked for you, so there is never a waiting list and never an empty table.": "Все игроки лимита находятся в одном пуле. Место подбирается автоматически, поэтому нет ни очередей, ни пустых столов.",
    "Up to 84 hands per hour — roughly three times a regular cash table, because you never wait for a hand you are not in.": "До 84 рук в час — примерно втрое больше обычного кэш-стола, ведь вы не ждёте раздачи без вас.",
    "Open the app and tap CLAIM once a day to bank that day.": "Заходите в приложение и нажимайте ЗАБРАТЬ раз в день, чтобы засчитать этот день.",
    "Fill a full week to unlock a milestone reward chest.": "Заполните полную неделю, чтобы открыть сундук-награду за этап.",
    "Each week you finish, the next milestone pays out bigger.": "Каждая завершённая неделя делает следующую награду больше.",
    "Miss a day and your streak resets back to day 1.": "Пропустили день — серия сбрасывается на первый день.",
    "Show up every day and your rewards snowball. The longer the chain, the bigger the prize.": "Заходите каждый день — награды растут как снежный ком. Чем длиннее цепочка, тем крупнее приз.",
    "Table stays live — your seat & stack are held. Jump back any time.": "Стол продолжает игру — место и стек сохраняются. Возвращайтесь в любой момент.",
    "Join me on Pokerix — the best poker app! Sign up with my link and make your first deposit to get a 100% first-deposit bonus.": "Присоединяйся ко мне в Pokerix — лучшем покерном приложении! Регистрируйся по моей ссылке и получи 100% бонус на первый депозит.",
    "CASH GAMES": "КЭШ-ИГРЫ",
    "FAST POKER": "БЫСТРЫЙ ПОКЕР",
    "TOURNA- MENTS": "ТУРНИРЫ",
  });

  // ── home: formats grid, banner slider, footer ──
  Object.assign(DICT, {
    "POKER FORMATS": "ПОКЕРНЫЕ ФОРМАТЫ",

    // ── block 4 · tournament lobby ──
    "REGISTERED": "ВЫ ЗАРЕГИСТРИРОВАНЫ",
    "CANCEL": "ОТМЕНИТЬ",
    "DATE": "ДАТА",
    "TOURNAMENT": "ТУРНИР",
    "SATELLITE": "САТЕЛЛИТ",
    "FREEROLL": "ФРИРОЛЛ",

    // ── block 3 · cash entry ──
    "CASH TABLES": "КЭШ-ИГРЫ",

    // ── blocks 7-8 · profile & rewards ──
    "REWARDS": "НАГРАДЫ",
    "HAND HISTORY": "ИСТОРИЯ РАЗДАЧ",
    "Your last 100 hands · replay": "Последние 100 раздач · реплей",
    "SECURITY": "БЕЗОПАСНОСТЬ",
    "Password · 2FA · sessions": "Пароль · 2FA · сессии",
    "LOG OUT": "ВЫЙТИ",
    "LOG OUT?": "ВЫЙТИ ИЗ АККАУНТА?",
    "STAY SIGNED IN": "ОСТАТЬСЯ",
    "HELP & SUPPORT": "ПОМОЩЬ И ПОДДЕРЖКА",
    "SETTINGS": "НАСТРОЙКИ",
    "CHOOSE": "ВЫБРАТЬ",
    "PLAY": "ИГРАТЬ", "CHOOSE": "ВЫБРАТЬ", "CLAIM": "ПОЛУЧИТЬ", "TAKEN": "ПОЛУЧЕНО", "CLOSED": "ЗАКРЫТО",
    "LEFT": "ОСТАЛОСЬ",
    "Moved into the prize zone": "Вы вошли в призовую зону",
    "In the money": "В призах",
    "paid tomorrow 06:00": "выплата завтра в 06:00",
    "paid Monday 06:00": "выплата в понедельник в 06:00",
    "paid at season end": "выплата в конце сезона",
    "ALL GAMES": "ВСЕ ИГРЫ",
    "TOP": "ТОП",
    "PAY": "В ПРИЗАХ",
    "CLAIM": "ПОЛУЧИТЬ",
    "PLAY TO FINISH IT": "ИГРАЙТЕ, ЧТОБЫ ЗАВЕРШИТЬ",
    "GIFT CODE": "ГИФТ-КОД",
    "ENTER CODE": "ВВЕСТИ КОД",
    "CASH-DROP": "CASH-DROP",
    "LAST 100 HANDS": "ПОСЛЕДНИЕ 100 РАЗДАЧ",

    // ── block 6 · wallet ──
    "WALLET": "КОШЕЛЁК",
    "TOTAL BALANCE": "ОБЩИЙ БАЛАНС",
    "USD BALANCE": "БАЛАНС USD",
    "CASH DOLLARS": "CASH DOLLARS",
    "TOURNEY BALANCE": "ТУРНИРНЫЙ БАЛАНС",
    "Withdrawable": "Доступно к выводу",
    "Bonus play": "Бонусные средства",
    "Buy-ins only": "Только на байины",
    "DEPOSIT": "ПОПОЛНИТЬ",
    "TICKETS": "БИЛЕТЫ",
    "Tournament entries you hold": "Ваши турнирные билеты",
    "TRANSACTION HISTORY": "ИСТОРИЯ ТРАНЗАКЦИЙ",
    "Deposits, withdrawals, transfers": "Пополнения, выводы, переводы",
    "RESPONSIBLE GAMING": "ОТВЕТСТВЕННАЯ ИГРА",
    "Take a break · freeze up to 24 hours": "Перерыв · заморозка до 24 часов",
    "Keep your game in balance — set your own limits and take breaks when you need them.": "Сохраняйте баланс в игре — устанавливайте собственные ограничения и делайте перерывы, когда это нужно.",
    "Managing your bankroll well is what keeps you in the game long term.": "Грамотное управление банкроллом помогает оставаться в игре на долгой дистанции.",
    "Pick the stakes and formats your bankroll can actually carry.": "Выбирайте ставки и форматы, которые позволяет ваш банкролл.",
    "Go through hands from your history and learn from the spots you lost.": "Разбирайте раздачи из истории и учитесь на проигранных ситуациях.",
    "Keep a healthy relationship with the game — at the tables and away from them.": "Сохраняйте здоровое отношение к игре — за столами и вне их.",
    "What is a game limit?": "Что такое ограничение игры?",
    "A game limit lets you take a break of up to 24 hours from real-money play. You can still sign in, deposit and withdraw during that time.": "Ограничение позволяет сделать перерыв в игре на деньги до 24 часов. В это время можно входить в аккаунт, пополнять счёт и выводить средства.",
    "I turned the limit on by mistake. How do I cancel it?": "Я включил ограничение по ошибке. Как его отменить?",
    "Contact support at support@pokerdot.com and the team will walk you through what happens next.": "Напишите в поддержку на support@pokerdot.com — команда объяснит дальнейшие действия.",
    "Why play responsibly?": "Почему важно играть ответственно?",
    "Playing deliberately keeps you in control and keeps real-money games enjoyable over the long run. Taking breaks when you need them leads to better decisions.": "Осознанная игра помогает сохранять контроль и получать удовольствие от игры на деньги на долгой дистанции. Своевременные перерывы помогают принимать более взвешенные решения.",
    "Still have questions?": "Остались вопросы?",
    "Our support team is always around. Write to support@pokerdot.com.": "Наша поддержка всегда рядом. Напишите на support@pokerdot.com.",
    "Protected by": "Под защитой",
    "Break duration": "Длительность перерыва",
    "Real-money play is paused for:": "Игра на деньги ограничена на:",
    "Deposits, withdrawals and play-money tables stay open.": "Пополнения, выводы и столы на условные деньги остаются доступны.",
    "You are shut out of every real-money game.": "Все игры на реальные деньги будут недоступны.",
    "Deposits, withdrawals and P2P keep working.": "Пополнения, выводы и P2P-переводы продолжат работать.",
    "Play-money tables stay open the whole time.": "Столы на условные деньги останутся доступны.",
    "By starting a break I confirm I am over 18 and accept the PokerDot responsible gaming terms.": "Начиная перерыв, я подтверждаю, что мне больше 18 лет, и принимаю условия ответственной игры PokerDot.",
    "TOOLS": "ИНСТРУМЕНТЫ",
    "TIPS": "СОВЕТЫ",
    "FAQ": "ЧАСТЫЕ ВОПРОСЫ",
    "GAME LIMIT": "ОГРАНИЧЕНИЕ ИГРЫ",
    "Take a break from real-money play": "Возьмите перерыв от игры на деньги",
    "BANKROLL MANAGEMENT": "УПРАВЛЕНИЕ БАНКРОЛЛОМ",
    "GAME SELECTION": "ВЫБОР ИГР",
    "REVIEW YOUR PLAY": "АНАЛИЗ ИГРЫ",
    "PLAY RESPONSIBLY": "БУДЬТЕ ОТВЕТСТВЕННЫ",
    "WHAT A BREAK DOES": "ЧТО ДАЁТ ПЕРЕРЫВ",
    "START THE BREAK": "НАЧАТЬ ПЕРЕРЫВ",
    "BREAK STARTED": "ПЕРЕРЫВ НАЧАТ",
    "1 HOUR": "1 ЧАС",
    "6 HOURS": "6 ЧАСОВ",
    "12 HOURS": "12 ЧАСОВ",
    "24 HOURS": "24 ЧАСА",
    "ENTRY": "ВХОД",
    "PLAYERS": "ИГРОКОВ",
    "PLAY": "ИГРАТЬ", "CHOOSE": "ВЫБРАТЬ", "CLAIM": "ПОЛУЧИТЬ", "TAKEN": "ПОЛУЧЕНО", "CLOSED": "ЗАКРЫТО",
    "LEFT": "ОСТАЛОСЬ",
    "Moved into the prize zone": "Вы вошли в призовую зону",
    "In the money": "В призах",
    "paid tomorrow 06:00": "выплата завтра в 06:00",
    "paid Monday 06:00": "выплата в понедельник в 06:00",
    "paid at season end": "выплата в конце сезона",
    "ALL GAMES": "ВСЕ ИГРЫ",
    "TOP": "ТОП",
    "PAY": "В ПРИЗАХ",
    "LOCKED": "НЕДОСТУПНО",
    "NOT ENOUGH FUNDS": "НЕДОСТАТОЧНО СРЕДСТВ",
    "SHOW ALL TABLES": "ПОКАЗАТЬ ВСЕ СТОЛЫ",
    "ALL TABLES": "ВСЕ СТОЛЫ",
    "EVERY LIMIT · EVERY GAME": "ВСЕ ЛИМИТЫ · ВСЕ ИГРЫ",
    "STAKES FROM 2 CENTS": "СТАВКИ ОТ 2 ЦЕНТОВ",
    "UP TO 6 PLAYERS": "ДО 6 ИГРОКОВ",
    "HIDE FULL": "СКРЫТЬ ЗАПОЛНЕННЫЕ",
    "HIDE EMPTY": "СКРЫТЬ ПУСТЫЕ",
    "CHOOSE A LIMIT": "ВЫБОР ЛИМИТА",
    "BUY-IN": "ВХОД",
    "SIT DOWN": "СЕСТЬ ЗА СТОЛ",
    "PAY FROM": "СПИСАТЬ С", "BONUS BALANCE": "БОНУСНЫЙ", "MAIN BALANCE": "ОСНОВНОЙ", "NOT ENOUGH": "НЕ ХВАТАЕТ",
    "ABOUT": "ПРИМЕРНО", "HANDS OF PLAY": "РАЗДАЧ ИГРЫ", "FROM": "С",
    "MIN": "МИНИМУМ", "STANDARD": "СТАНДАРТ",
    "TOP BACK UP TO": "ДОКУПАТЬ ДО", "WHEN YOU DROP BELOW": "ПРИ ПАДЕНИИ НИЖЕ",
    "LAST GAME": "ПОСЛЕДНЯЯ ИГРА",
    " · FAST": " · ФАСТ",
    "· FAST": "· ФАСТ",
    "NL Hold'em · Omaha": "НЛ Холдем · Омаха",
    "MTT · Sit & Go": "МТТ · Сит-энд-гоу",
    "Next hand instantly": "Новая раздача сразу",
    "3-max · jackpot": "3 игрока · джекпот",
    "FIRST DEPOSIT · UP TO $1 000": "ПЕРВЫЙ ДЕПОЗИТ · ДО $1 000",
    "ON YOUR FIRST DEPOSIT": "НА ПЕРВЫЙ ДЕПОЗИТ", "UP TO $1 000": "ДО $1 000",
    "UP TO $1 000 BONUS": "ДО $1 000 БОНУСОМ",
    "BONUSES · TICKETS · SPINS": "БОНУСЫ · БИЛЕТЫ · СПИНЫ",
    "Daily Invitational Ticket": "Билет на Daily Invitational",
    "Daily Ticket": "Дневной билет", "Weekly Ticket": "Недельный билет",
    "Weekly Invitational": "Weekly Invitational", "Weekly Invitation Ticket": "Билет на Weekly Invitational",
    "$1 Bonus": "$1 бонусом", "$5 Bonus": "$5 бонусом", "$10 Bonus": "$10 бонусом",
    "$2.50 Mystery Bounty": "Mystery Bounty на $2.50",
    "3 Free Spins": "3 бесплатных спина", "100 UPP": "100 UPP",
    "BONUS": "БОНУС",
    "FIRST DEPOSIT BONUS": "БОНУС НА ПЕРВЫЙ ДЕПОЗИТ",
    "CLAIM ›": "ЗАБРАТЬ ›",
    "LICENCE": "ЛИЦЕНЗИИ",
    "RESPONSIBLE GAMING": "ОТВЕТСТВЕННАЯ ИГРА",
    "TERMS": "ПРАВИЛА",
    "TERMS & CONDITIONS": "ПРАВИЛА И УСЛОВИЯ",
    "Licensed & regulated · 18+ only": "Лицензировано и регулируется · только 18+",
  });

  Object.assign(DICT, {
    "Determining the prize pool…": "Определяем призовой фонд…",
    "SPIN AGAIN": "КРУТИТЬ ЕЩЁ",
    "HOLD'EM": "ХОЛДЕМ",
    "General settings": "Общие настройки",
    "Message…": "Сообщение…",
    "Get dealt in right away — this hand": "Получить карты сразу — в этой раздаче",
    "SWIPE TO FOLD": "СВАЙП ДЛЯ ФОЛДА",
    "I'M HERE": "Я ЗДЕСЬ",
    "Give up your seat & cash out.": "Освободить место и забрать стек.",
    "Give up the seat & cash out your stack": "Освободить место и забрать стек",
    "Your seat is kept · table stays open": "Место сохраняется · стол остаётся открытым",
    "LEAVE THE TABLE?": "ПОКИНУТЬ СТОЛ?",
    "LEAVE TABLE": "ПОКИНУТЬ СТОЛ",
    "SIT OUT": "ПРОПУСК РАЗДАЧ",
    "Classic poker": "Классический покер",
    "Multi-table tournaments": "Многостоловые турниры",
    "New table every hand": "Новый стол каждую раздачу",
    "Fast 3-player tournament": "Быстрый турнир на 3 игрока",
    "FOR BEGINNERS": "ДЛЯ НОВИЧКОВ",
    "BLINDS": "БЛАЙНДЫ",
    "ENTRY FROM": "ВХОД ОТ",
    "OTHER AMOUNT": "ДРУГАЯ СУММА",
    "PLAY": "ИГРАТЬ", "CHOOSE": "ВЫБРАТЬ", "CLAIM": "ПОЛУЧИТЬ", "TAKEN": "ПОЛУЧЕНО", "CLOSED": "ЗАКРЫТО",
    "LEFT": "ОСТАЛОСЬ",
    "Moved into the prize zone": "Вы вошли в призовую зону",
    "In the money": "В призах",
    "paid tomorrow 06:00": "выплата завтра в 06:00",
    "paid Monday 06:00": "выплата в понедельник в 06:00",
    "paid at season end": "выплата в конце сезона",
    "ALL GAMES": "ВСЕ ИГРЫ",
    "TOP": "ТОП",
    "PAY": "В ПРИЗАХ",
    "MORE = MAX BONUS": "ДО МАКС. БОНУСА",
    "GET": "ПОЛУЧИТЬ",
    "MAX BONUS": "МАКС. БОНУС",
    "MAX BONUS REACHED": "МАКСИМУМ БОНУСА ДОСТИГНУТ",
    "Keep the seat, skip hands": "Место сохраняется, раздачи пропускаются",
    "SIT OUT — ALL TABLES": "ПРОПУСК — ВСЕ СТОЛЫ",
    "Skip hands everywhere you are seated": "Пропуск раздач на всех ваших столах",
    "BACK TO LOBBY": "В ЛОББИ",
    "The table keeps playing": "Стол продолжает игру",
    "LEAVE ALL TABLES": "ПОКИНУТЬ ВСЕ СТОЛЫ",
    "Every seat you hold": "Все места, которые вы занимаете",
    "Give up every seat & cash out": "Освободить все места и забрать стеки",
    "MORE": "ЕЩЁ",
    "STAY AT THE TABLE": "ОСТАТЬСЯ ЗА СТОЛОМ",
    "EXIT TABLE": "ВЫЙТИ СО СТОЛА",
    "SWITCH TABLE": "СМЕНИТЬ СТОЛ",
    "ADD CHIPS": "ДОКУПИТЬ ФИШКИ", "HISTORY": "ИСТОРИЯ",
    "TOP UP YOUR BALANCE": "ПОПОЛНИТЬ БАЛАНС", "TOP UP BALANCE": "ПОПОЛНИТЬ БАЛАНС", "YOU NEED": "НУЖНО ЕЩЁ", "MORE IN": "НА КОШЕЛЬКЕ",
    "ADD\nCHIPS": "ДОКУПИТЬ\nФИШКИ", "HAND\nHISTORY": "ИСТОРИЯ\nРАЗДАЧ", "TABLE\nSETTINGS": "НАСТРОЙКИ\nСТОЛА",
    "Table menu": "Меню стола",
    "MENU": "МЕНЮ",
    "Profit / loss": "Профит / убыток",
    "Add a private note on this player…": "Личная заметка об игроке…",
    "Five in a row, one suit": "Пять по порядку, одной масти",
    "Three of a kind + a pair": "Сет + пара",
    "Highest-ranking card": "Старшая карта",

    // ── table settings ──
    "TABLE SETTINGS": "НАСТРОЙКИ СТОЛА", "BETTING": "СТАВКИ", "BUY-IN": "ВХОД", "SOUNDS": "ЗВУКИ",
    "AUTO-FOCUS": "АВТОФОКУС", "QUICK ACTIONS": "БЫСТРЫЕ ДЕЙСТВИЯ", "TABLE THEME": "ТЕМА СТОЛА",
    "TIME BANK": "ТАЙМБАНК", "CURRENCY": "ВАЛЮТА", "TABLE VIEW": "ВИД СТОЛА", "LANGUAGE": "ЯЗЫК",
    "TIME ZONE": "ЧАСОВОЙ ПОЯС", "EMOJI KEYS": "КЛАВИШИ ЭМОДЗИ",
    "BET SIZING": "РАЗМЕР СТАВКИ", "BET BUTTONS": "КНОПКИ СТАВОК",
    "Change the bet in steps of": "Изменять ставку на размер",
    "Ask to confirm before the bet goes in": "Подтверждать перед отправкой ставки",
    "MONEY": "ДЕНЬГИ", "OVER POT": "БОЛЬШЕ БАНКА", "NEVER": "НИКОГДА",
    "ROUND TO THE NEAREST BLIND": "ОКРУГЛЯТЬ ДО БЛИЖАЙШЕГО БЛАЙНДА",
    "Bet amounts snap to whole blinds": "Ставки округляются до целых блайндов",
    "OPENING BET": "НАЧАЛЬНАЯ СТАВКА", "in big blinds": "в больших блайндах",
    "RAISE / BET INTO A POT": "СТАВКА В БАНК", "% of the pot": "% от банка",
    "Four shortcuts sit above the bet slider at the table — the first row is used when you open the action, the second when there is already a bet to raise.": "Четыре кнопки над слайдером ставки: первый ряд — когда вы открываете торговлю, второй — когда уже есть ставка.",
    "DEFAULT BUY-IN": "ВХОД ПО УМОЛЧАНИЮ", "Pay the buy-in from": "Платить вход с",
    "AUTO BUY-IN": "АВТОМАТИЧЕСКИЙ ВХОД",
    "Take the seat straight away, without the buy-in window": "Занять место сразу, без окна входа",
    "If the amount falls below the table minimum you are seated with the table's minimum buy-in.": "Если сумма ниже минимума стола, вы сядете с минимальным входом стола.",
    "TABLE SOUND": "ЗВУК СТОЛА", "Chips, cards, the clock and the dealer": "Фишки, карты, таймер и дилер",
    "LEVELS": "ГРОМКОСТЬ", "BACKGROUND MUSIC": "ФОНОВАЯ МУЗЫКА", "SOUND EFFECTS": "ЗВУКОВЫЕ ЭФФЕКТЫ",
    "DEALER VOICE": "ГОЛОС ДИЛЕРА", "ANNOUNCE THE ACTION": "ОЗВУЧИВАТЬ ДЕЙСТВИЯ",
    "The dealer calls bets, streets and showdown": "Дилер объявляет ставки, улицы и вскрытие",
    "Show the table it is your turn on": "Показывать стол, где ваш ход",
    "With auto-focus on, the app brings the table that needs a decision to the front — the others stay in the bubble row at the top of the screen.": "С автофокусом стол, где нужен ваш ход, выходит на первый план — остальные остаются баблами вверху экрана.",
    "YOUR TURN — BROUGHT FORWARD": "ВАШ ХОД — СТОЛ ВПЕРЁД",
    "TABLES STAY WHERE THEY ARE": "СТОЛЫ ОСТАЮТСЯ НА МЕСТЕ",
    "PRE-ACTION BUTTONS": "КНОПКИ ПРЕД-ДЕЙСТВИЙ",
    "Arm your move before your turn arrives": "Выбрать ход заранее, до своей очереди",
    "Pre-actions are armed while the other players decide; the moment the action reaches you they fire.": "Пред-действия взводятся, пока думают соперники, и срабатывают, как только очередь дойдёт до вас.",
    "ARMED ACTIONS": "ВЗВЕДЁННЫЕ ДЕЙСТВИЯ", "CHECK / FOLD": "ЧЕК / ФОЛД",
    "Check when free, fold to a bet": "Чек, если бесплатно; фолд на ставку",
    "CALL ANY": "КОЛЛ ЛЮБОЙ", "Call whatever it costs": "Уравнять любую сумму",
    "RAISE ANY": "РЕЙЗ ЛЮБОЙ", "Raise as soon as it is on you": "Рейз сразу на своём ходу",
    "AUTO-MUCK LOSING HANDS": "АВТОСБРОС ПРОИГРАВШИХ РУК", "Never show a beaten hand": "Не показывать проигравшую руку",
    "FELT": "СУКНО", "CARDS": "КАРТЫ", "Deck colours": "Цвет колоды", "Card back": "Рубашка",
    "2-COLOUR": "2 ЦВЕТА", "4-COLOUR": "4 ЦВЕТА",
    "CARBON": "КАРБОН", "CLASSIC": "КЛАССИКА", "MIDNIGHT": "ПОЛНОЧЬ", "WINE": "ВИНО",
    "AUTOMATIC TIME BANK": "АВТОМАТИЧЕСКИЙ ТАЙМБАНК",
    "Adds your time bank automatically on your turn. It keeps working until the bank is spent.": "Таймбанк добавляется автоматически на вашем ходу и работает, пока не будет исчерпан.",
    "WHEN TO SPEND IT": "КОГДА ИСПОЛЬЗОВАТЬ",
    "On every decision": "На каждом решении",
    "Time bank runs on each of your turns until it is spent.": "Таймбанк включается на каждом вашем ходу, пока не закончится.",
    "Only with money in the pot": "Только когда у вас есть деньги в банке",
    "Blinds and antes included.": "Включая блайнды и анте.",
    "Blinds and antes excluded.": "Исключая блайнды и анте.",
    "Manual": "Вручную", "You start the time bank yourself.": "Таймбанк запускаете вы сами.",
    "SHOW AMOUNTS AS": "ПОКАЗЫВАТЬ СУММЫ КАК", "Money": "Деньги", "Big blinds": "Большие блайнды", "Both": "Оба",
    "Applies to stacks, pots and every bet button at the table.": "Применяется к стекам, банку и всем кнопкам ставок за столом.",
    "AT THE TABLE": "ЗА СТОЛОМ", "PLAYER AVATARS": "АВАТАРЫ ИГРОКОВ", "Photos in the seats": "Фото на местах",
    "NICKNAMES": "НИКНЕЙМЫ", "Names above the stacks": "Имена над стеками",
    "COMPACT SEATS": "КОМПАКТНЫЕ МЕСТА", "Smaller plates, more felt": "Меньше плашки, больше стола",
    "CHIP ANIMATION": "АНИМАЦИЯ ФИШЕК", "Chips travel to the pot": "Фишки летят в банк",
    "Tournament start times and the hand history are printed in this zone.": "Время старта турниров и история раздач показываются в этом поясе.",
    "Send a reaction at showdown": "Отправить реакцию на вскрытии",
    "WHEN YOU WIN": "КОГДА ВЫ ВЫИГРАЛИ", "WHEN YOU LOSE": "КОГДА ВЫ ПРОИГРАЛИ", "WHEN IT IS SPLIT": "КОГДА НИЧЬЯ",
    "TAP BELOW TO SWAP": "НАЖМИТЕ НИЖЕ, ЧТОБЫ ЗАМЕНИТЬ",
    "SETTINGS APPLIED": "НАСТРОЙКИ ПРИМЕНЕНЫ",
    "SIT ›": "СЕСТЬ ›",
    "VIEW ›": "СМОТРЕТЬ ›",
    "JOIN ›": "ЗА СТОЛ ›",
    "ENTER ›": "ВОЙТИ ›",
    "OPEN ›": "ОТКРЫТЬ ›",
    "USE ›": "ИСПОЛЬЗОВАТЬ ›",
    "ENTER TABLE ›": "ВОЙТИ ЗА СТОЛ ›",
    "OPEN TABLE ›": "ОТКРЫТЬ СТОЛ ›",
    "CONTINUE ›": "ПРОДОЛЖИТЬ ›",
    "USE TICKET ›": "ИСПОЛЬЗОВАТЬ ТИКЕТ ›",
    "BOMB": "БОМБ",
    "SQUID": "КАЛЬМАР",
    "BACK TO PICKER": "НАЗАД К ВЫБОРУ",
    "CHOOSE": "ВЫБРАТЬ",
    "Fold = instant new table & new hand": "Фолд = сразу новый стол и новая рука",
    "Hold'em rules, turbo pace": "Правила холдема, темп турбо",
    "Built for high-volume grinding": "Создано для гринда большими объёмами",
    "Prize randomized by the spin (up to 1000×)": "Приз определяется вращением (до 1000×)",
    "Hyper-turbo blinds": "Блайнды гипер-турбо",
    "Games last 3–5 minutes": "Игра длится 3–5 минут",
    "Best 5-card combo wins": "Побеждает лучшая комбинация из 5 карт",
    "Must use exactly 2 hole + 3 community": "Нужно использовать ровно 2 карманные + 3 общие",
    "Pot-limit betting (no all-in unless covered)": "Ставки по пот-лимиту (ва-банк только в пределах пота)",
    "Use exactly 2 of 5 hole + 3 community": "Ровно 2 из 5 карманных + 3 общие",
    "Pot-limit betting": "Ставки по пот-лимиту",
    "Avg pot is ~25% bigger than 4-card PLO": "Средний пот примерно на 25% больше, чем в 4-карточной PLO",
    "Use exactly 2 of 6 hole + 3 community": "Ровно 2 из 6 карманных + 3 общие",
    "Flush > Full House (cards rarer)": "Флеш сильнее фулл-хауса (карт меньше)",
    "Straight: A-6-7-8-9 is the lowest": "Стрит: A-6-7-8-9 — младший",
    "TEXAS HOLD'EM · CASH": "ТЕХАССКИЙ ХОЛДЕМ · КЭШ",
    "TEXAS HOLD'EM · THE CLASSIC": "ТЕХАССКИЙ ХОЛДЕМ · КЛАССИКА",
    "TEXAS HOLD'EM · FAST FOLD": "ТЕХАССКИЙ ХОЛДЕМ · БЫСТРЫЙ ФОЛД",
    "FAST-FOLD · CASH": "БЫСТРЫЙ ФОЛД · КЭШ",
    "FAST FOLD · POOLED LIMITS": "БЫСТРЫЙ ФОЛД · ОБЩИЕ ЛИМИТЫ",
    "HOLD'EM · PLO · SHORT DECK": "ХОЛДЕМ · PLO · КОРОТКАЯ КОЛОДА",
    "HOLD'EM · PLO · PLO5 · PLO6": "ХОЛДЕМ · PLO · PLO5 · PLO6",
    "SHORT DECK · PLO5 · PLO6": "КОРОТКАЯ КОЛОДА · PLO5 · PLO6",
    "HYPER TURBO · 3-MAX": "ГИПЕР-ТУРБО · 3-МАКС",
    "GAME INFO & RULES": "ОБ ИГРЕ И ПРАВИЛА",
    "FOLD & MOVE · UP TO 84 HANDS/HR": "ФОЛД И ПЕРЕХОД · ДО 84 РУК/ЧАС",
    "DEALING STARTS ONLY WITH ENOUGH PLAYERS SEATED": "РАЗДАЧА НАЧИНАЕТСЯ ТОЛЬКО ПРИ ДОСТАТОЧНОМ ЧИСЛЕ ИГРОКОВ",
    "EVERY HAND IS DEALT AT A FRESH 6-MAX TABLE": "КАЖДАЯ РУКА РАЗДАЁТСЯ ЗА НОВЫМ 6-МАКС СТОЛОМ",
    "HANDS/HR": "РУК/ЧАС",
    "RENDERING…": "РЕНДЕРИНГ…",
    "Loading…": "Загрузка…",
    "PROCESSING…": "ОБРАБОТКА…",
    "QUALIFICATION PATH · FROM $2 500": "ПУТЬ КВАЛИФИКАЦИИ · ОТ $2 500",
    "Texas Hold'em · Table for 8 · DEEP": "Техасский холдем · Стол на 8 · ДИП",
    "Texas Hold'em · $40–$100 · Table for 6": "Техасский холдем · $40–$100 · Стол на 6",
    "LATE REG 60M": "ПОЗДНЯЯ РЕГ. 60М",
    "SATELLITES · 3": "САТЕЛЛИТЫ · 3",
    "Unlimited re-entries": "Неограниченные ре-энтри",
    "RUNNING": "ИДЁТ",
    "YOU'RE IN · TABLE 14 · SEAT 3": "ВЫ В ИГРЕ · СТОЛ 14 · МЕСТО 3",
    "TABLE 14 · SEAT 3": "СТОЛ 14 · МЕСТО 3",
    "UP TO $1 000 IN BONUS FUNDS": "ДО $1 000 БОНУСОМ",
    "DEPOSIT NOW": "ПОПОЛНИТЬ",
    "GET +100%": "ПОЛУЧИТЬ +100%",
    "BONUS · $1 000": "БОНУС · $1 000",
    "BONUS · 100%": "БОНУС · 100%",
    "to your balance instantly. Ready to play.": "на баланс мгновенно. Можно играть.",
    "OTHER AMOUNT": "ДРУГАЯ СУММА",
    "PLAY": "ИГРАТЬ", "CHOOSE": "ВЫБРАТЬ", "CLAIM": "ПОЛУЧИТЬ", "TAKEN": "ПОЛУЧЕНО", "CLOSED": "ЗАКРЫТО",
    "LEFT": "ОСТАЛОСЬ",
    "Moved into the prize zone": "Вы вошли в призовую зону",
    "In the money": "В призах",
    "paid tomorrow 06:00": "выплата завтра в 06:00",
    "paid Monday 06:00": "выплата в понедельник в 06:00",
    "paid at season end": "выплата в конце сезона",
    "ALL GAMES": "ВСЕ ИГРЫ",
    "TOP": "ТОП",
    "PAY": "В ПРИЗАХ",
    "MORE = MAX BONUS": "ДО МАКС. БОНУСА",
    "GET": "ПОЛУЧИТЬ",
    "MAX BONUS": "МАКС. БОНУС",
    "MAX BONUS REACHED": "МАКСИМУМ БОНУСА ДОСТИГНУТ",
    "Send": "Отправьте",
    "Funds credit after network confirmation.": "Средства зачисляются после подтверждения сетью.",
    "Sending": "Отправляем",
    "to your card · arrives in 1–3 business days.": "на вашу карту · поступит в течение 1–3 рабочих дней.",
    "DESTINATION CARD": "КАРТА ПОЛУЧАТЕЛЯ",
    "Bet-size shortcuts": "Быстрые размеры ставок",
    "Default seat amount": "Сумма по умолчанию",
    "Music · effects": "Музыка · эффекты",
    "Auto-pop active table": "Авто-вывод активного стола",
    "Felt & deck look": "Вид сукна и карт",
    "Quick reactions · win · draw · loss": "Быстрые реакции · победа · ничья · проигрыш",
    "Auto-use rules": "Правила авто-использования",
    "How balances show": "Как отображается баланс",
    "Show opponent stats on the table": "Показывать статистику соперников за столом",
    "Voluntarily put $ in pot": "Добровольно вложено в пот",
    "Pre-flop raise %": "Процент рейзов на префлопе",
    "Hands observed": "Учтено раздач",
    "Auto-use on all of your turns.": "Использовать автоматически на всех ваших ходах.",
    "Use your Time Bank manually.": "Использовать тайм-банк вручную.",
    "LINKED": "ПРИВЯЗАНО",
    "Enter current password": "Введите текущий пароль",
    "At least 8 characters": "Минимум 8 символов",
    "Repeat new password": "Повторите новый пароль",
    "Recovery email": "E-mail для восстановления",
    "Login password": "Пароль для входа",
    "Required for withdrawals": "Требуется для выводов",
    "Require a code on every login": "Запрашивать код при каждом входе",
    "SUMMER SERIES": "ЛЕТНЯЯ СЕРИЯ",
    "JUST NOW": "ТОЛЬКО ЧТО",
    "NEW: FLASH & FLUSH": "НОВОЕ: FLASH & FLUSH",
    "Drop banner image": "Перетащите баннер",
    "NO EVENTS — TRY ANOTHER DAY": "НЕТ СОБЫТИЙ — ВЫБЕРИТЕ ДРУГОЙ ДЕНЬ",
    "REG NOW OPEN": "РЕГ. ОТКРЫТА",
    "REG OPENS LATER": "РЕГ. ОТКРОЕТСЯ ПОЗЖЕ",
    "Registered tournaments appear here.": "Здесь появятся турниры, куда вы зарегистрированы.",
    "Browse all events to register for more.": "Смотрите все события, чтобы зарегистрироваться ещё.",
    "MIDNIGHT FREEROLL": "НОЧНОЙ ФРИРОЛЛ",
    "Swipe the": "Проведите",
    "red knob": "красный ползунок",
    "Universal ticket used for": "Универсальный тикет использован для",
    "left → right along the dotted line to tear the stub and register.": "слева → направо по пунктиру, чтобы оторвать корешок и зарегистрироваться.",
    "Sounds · Betting · Buy-in · more": "Звуки · ставки · вход · ещё",
    "Deposits · withdrawals · play": "Депозиты · выводы · игра",
    "Tap to replace": "Нажмите, чтобы заменить",
    "From your gallery": "Из вашей галереи",
    "Edit avatar": "Изменить аватар",
    "About balances": "О балансах",
    "CASH TABLES": "КЭШ-ИГРЫ",

    // ── blocks 7-8 · profile & rewards ──
    "REWARDS": "НАГРАДЫ",
    "HAND HISTORY": "ИСТОРИЯ РАЗДАЧ",
    "Your last 100 hands · replay": "Последние 100 раздач · реплей",
    "SECURITY": "БЕЗОПАСНОСТЬ",
    "Password · 2FA · sessions": "Пароль · 2FA · сессии",
    "LOG OUT": "ВЫЙТИ",
    "LOG OUT?": "ВЫЙТИ ИЗ АККАУНТА?",
    "STAY SIGNED IN": "ОСТАТЬСЯ",
    "HELP & SUPPORT": "ПОМОЩЬ И ПОДДЕРЖКА",
    "SETTINGS": "НАСТРОЙКИ",
    "CHOOSE": "ВЫБРАТЬ",
    "PLAY": "ИГРАТЬ", "CHOOSE": "ВЫБРАТЬ", "CLAIM": "ПОЛУЧИТЬ", "TAKEN": "ПОЛУЧЕНО", "CLOSED": "ЗАКРЫТО",
    "LEFT": "ОСТАЛОСЬ",
    "Moved into the prize zone": "Вы вошли в призовую зону",
    "In the money": "В призах",
    "paid tomorrow 06:00": "выплата завтра в 06:00",
    "paid Monday 06:00": "выплата в понедельник в 06:00",
    "paid at season end": "выплата в конце сезона",
    "ALL GAMES": "ВСЕ ИГРЫ",
    "TOP": "ТОП",
    "PAY": "В ПРИЗАХ",
    "CLAIM": "ПОЛУЧИТЬ",
    "PLAY TO FINISH IT": "ИГРАЙТЕ, ЧТОБЫ ЗАВЕРШИТЬ",
    "GIFT CODE": "ГИФТ-КОД",
    "ENTER CODE": "ВВЕСТИ КОД",
    "CASH-DROP": "CASH-DROP",
    "LAST 100 HANDS": "ПОСЛЕДНИЕ 100 РАЗДАЧ",

    // ── block 6 · wallet ──
    "WALLET": "КОШЕЛЁК",
    "TOTAL BALANCE": "ОБЩИЙ БАЛАНС",
    "USD BALANCE": "БАЛАНС USD",
    "CASH DOLLARS": "CASH DOLLARS",
    "TOURNEY BALANCE": "ТУРНИРНЫЙ БАЛАНС",
    "Withdrawable": "Доступно к выводу",
    "Bonus play": "Бонусные средства",
    "Buy-ins only": "Только на байины",
    "DEPOSIT": "ПОПОЛНИТЬ",
    "TICKETS": "БИЛЕТЫ",
    "Tournament entries you hold": "Ваши турнирные билеты",
    "TRANSACTION HISTORY": "ИСТОРИЯ ТРАНЗАКЦИЙ",
    "Deposits, withdrawals, transfers": "Пополнения, выводы, переводы",
    "RESPONSIBLE GAMING": "ОТВЕТСТВЕННАЯ ИГРА",
    "Take a break · freeze up to 24 hours": "Перерыв · заморозка до 24 часов",
    "TOOLS": "ИНСТРУМЕНТЫ",
    "TIPS": "СОВЕТЫ",
    "FAQ": "ЧАСТЫЕ ВОПРОСЫ",
    "GAME LIMIT": "ОГРАНИЧЕНИЕ ИГРЫ",
    "Take a break from real-money play": "Возьмите перерыв от игры на деньги",
    "BANKROLL MANAGEMENT": "УПРАВЛЕНИЕ БАНКРОЛЛОМ",
    "GAME SELECTION": "ВЫБОР ИГР",
    "REVIEW YOUR PLAY": "АНАЛИЗ ИГРЫ",
    "PLAY RESPONSIBLY": "БУДЬТЕ ОТВЕТСТВЕННЫ",
    "WHAT A BREAK DOES": "ЧТО ДАЁТ ПЕРЕРЫВ",
    "START THE BREAK": "НАЧАТЬ ПЕРЕРЫВ",
    "BREAK STARTED": "ПЕРЕРЫВ НАЧАТ",
    "1 HOUR": "1 ЧАС",
    "6 HOURS": "6 ЧАСОВ",
    "12 HOURS": "12 ЧАСОВ",
    "24 HOURS": "24 ЧАСА",
    "Play 50 hands in HOLD'EM": "Сыграйте 50 рук в ХОЛДЕМ",
    "Play 3 games in SPIN & WIN": "Сыграйте 3 игры в SPIN & WIN",
    "Play 100 hands in FLASH & FLUSH": "Сыграйте 100 рук в FLASH & FLUSH",
    "Play in Daily GTD Event once": "Сыграйте в Daily GTD Event один раз",
    "Log in on mobile": "Войдите с телефона",
    "Reach showdown with Four of a Kind in HOLD'EM": "Дойдите до шоудауна с каре в ХОЛДЕМ",
    "Play 400 hands in PLO6": "Сыграйте 400 рук в PLO6",
    "Play 200 hands in SHORT DECK": "Сыграйте 200 рук в КОРОТКОЙ КОЛОДЕ",
    "Reach the final table in Daily GTD Event": "Дойдите до финального стола в Daily GTD Event",
    "Hit the Jackpot": "Возьмите джекпот",
    "Invite 3 players": "Пригласите 3 игроков",
    "Every prize is yours": "Все призы ваши",
    "PRIZE POOLS": "ПРИЗОВЫЕ ФОНДЫ",
    "CODE NOT VALID — CHECK & TRY AGAIN": "КОД НЕВЕРНЫЙ — ПРОВЕРЬТЕ И ПОВТОРИТЕ",
    "DUCK HUNT TICKET": "ТИКЕТ DUCK HUNT",
    "ONLINE 24/7": "ОНЛАЙН 24/7",
    "FASTEST": "САМЫЙ БЫСТРЫЙ",
    "MYSTERY BOUNTY": "МИСТЕРИ БАУНТИ",
    "BONUS TICKET": "БОНУСНЫЙ ТИКЕТ",
    "DAILY INVITATIONAL": "ЕЖЕДНЕВНЫЙ INVITATIONAL",
    "SUNDAY MILLION": "SUNDAY MILLION",
    "Opened — filling again for tomorrow.": "Открыт — снова наполняется к завтрашнему дню.",
    "Fills while you play. Open once a day.": "Наполняется, пока вы играете. Открывается раз в день.",
    "or better": "или выше",
    "Quad deuces": "Каре двоек",
    "Quad eights": "Каре восьмёрок",
    "Quad jacks": "Каре валетов",
    "Quad sixes": "Каре шестёрок",
    "Cash & Fast Poker": "Кэш и быстрый покер", "Fast tables": "Быстрые столы",
    "CASH & FAST POKER": "КЭШ И БЫСТРЫЙ ПОКЕР", "5-CARD OMAHA": "5-КАРТОЧНАЯ ОМАХА",
    "6-CARD OMAHA": "6-КАРТОЧНАЯ ОМАХА", "6+ HOLD'EM": "ХОЛДЕМ 6+", "FAST TABLES": "БЫСТРЫЕ СТОЛЫ",
    "waiting for you": "ждёт вас", "TOTAL": "ВСЕГО", "MISSION #": "МИССИЯ №",
    "24 hours to clear it. Miss it and this mission is lost for good — a different mission starts tomorrow.":
      "На выполнение — 24 часа. Не успели — миссия потеряна навсегда, завтра начнётся другая.",
    "Any straight flush": "Любой стрит-флеш",
    "The losing monster hand": "Проигравшая монструозная рука",
    "The winning hand": "Победившая рука",
    "Dealt into the hand": "Участник раздачи",
    "Hold'em cash": "Кэш в холдеме",
    "Lose with": "Проиграть с",
    "Win with": "Выиграть с",
    "Qualifying losing hand per game": "Квалифицирующая проигравшая рука по каждой игре",
    "You play for the pool at your table's stake": "Вы играете за фонд по лимиту своего стола",
    "Same rates across every game": "Одинаковые ставки во всех играх",
    "across 30 missions": "за 30 миссий",
    "MAIN EVENT C$150 000": "ГЛАВНЫЙ ТУРНИР C$150 000",
    "SATELLITE STEP 3 C$10 000": "САТЕЛЛИТ СТУПЕНЬ 3 C$10 000",
    "SAT STEP 3": "САТ СТУПЕНЬ 3",
    "Play 30 hands of HOLD'EM": "Сыграйте 30 рук в ХОЛДЕМ",
    "Win a hand with a flush": "Выиграйте руку с флешем",
    "Play 3 SPIN & WIN games": "Сыграйте 3 игры SPIN & WIN",
    "Play 50 hands of any cash game": "Сыграйте 50 рук в любой кэш-игре",
    "Enter any tournament": "Зайдите в любой турнир",
    "Win 2 SPIN & WIN games": "Выиграйте 2 игры SPIN & WIN",
    "Play 40 hands of OMAHA": "Сыграйте 40 рук в ОМАХУ",
    "Reach the money in a tournament": "Дойдите до призовых в турнире",
    "Play 60 hands of FAST POKER": "Сыграйте 60 рук в БЫСТРОМ ПОКЕРЕ",
    "Win a hand holding pocket aces": "Выиграйте руку с карманными тузами",
    "Play 5 SPIN & WIN games": "Сыграйте 5 игр SPIN & WIN",
    "Play 2 tournaments": "Сыграйте 2 турнира",
    "Win a hand with a full house": "Выиграйте руку с фулл-хаусом",
    "Play 40 hands of SHORT DECK": "Сыграйте 40 рук в КОРОТКОЙ КОЛОДЕ",
    "Knock out a player in a tournament": "Выбейте игрока в турнире",
    "Play 100 hands of FAST POKER": "Сыграйте 100 рук в БЫСТРОМ ПОКЕРЕ",
    "Win 3 SPIN & WIN games": "Выиграйте 3 игры SPIN & WIN",
    "Play 3 tournaments": "Сыграйте 3 турнира",
    "Win a hand with four of a kind": "Выиграйте руку с каре",
    "Play 120 hands of any cash game": "Сыграйте 120 рук в любой кэш-игре",
    "Reach a tournament final table": "Дойдите до финального стола турнира",
    "Play 60 hands of OMAHA": "Сыграйте 60 рук в ОМАХУ",
    "Win 4 SPIN & WIN games": "Выиграйте 4 игры SPIN & WIN",
    "Play 150 hands of FAST POKER": "Сыграйте 150 рук в БЫСТРОМ ПОКЕРЕ",
    "Score 3 knockouts in tournaments": "Сделайте 3 нокаута в турнирах",
    "Play 4 tournaments": "Сыграйте 4 турнира",
    "Win a hand with a straight flush": "Выиграйте руку со стрит-флешем",
    "Play 200 hands of any cash game": "Сыграйте 200 рук в любой кэш-игре",
    "Cash in any tournament": "Заберите призовые в любом турнире",
    "BUY-IN $200 +": "ВХОД $200 +",
    "NEXT DAY 06:00": "НА СЛЕДУЮЩИЙ ДЕНЬ 06:00",
    "MONDAY 06:00": "ПОНЕДЕЛЬНИК 06:00",
    "SEASON END 06:00": "КОНЕЦ СЕЗОНА 06:00",
    "You moved into the prize zone · paid": "Вы вошли в призовую зону · выплата",
    "guaranteed gift": "гарантированный подарок",
    "friends": "друзей",
    "Send your referral link to friends.": "Отправьте реферальную ссылку друзьям.",
    "through beginner missions.": "через миссии для новичков.",
    "CHECKED IN TODAY": "ОТМЕЧЕНО СЕГОДНЯ",
    "A present on every 7th day.": "Подарок каждый 7-й день.",
    "Bonus cash": "Бонусные средства",
    "See you tomorrow for your next reward": "До завтра — за следующей наградой",
    "Streak paused — check in to continue": "Серия приостановлена — отметьтесь, чтобы продолжить",
    "Details about": "Подробности о",
    "GRAND LEADERBOARD · SEASON 01": "ГРАНД-ЛИДЕРБОРД · СЕЗОН 01",
    "ARCANIUM SERIES · MAIN EVENT": "СЕРИЯ ARCANIUM · ГЛАВНЫЙ ТУРНИР",
    "SPIN & WIN · 3-MAX HYPER": "SPIN & WIN · 3-МАКС ГИПЕР",
    "BAD BEAT JACKPOT · HOLD'EM": "ДЖЕКПОТ BAD BEAT · ХОЛДЕМ",
    "GRAND LEADERBOARD · MID": "ГРАНД-ЛИДЕРБОРД · СРЕДНИЕ",
    "DAILY DEEP · 3 850 ENTRIES": "DAILY DEEP · 3 850 ВХОДОВ",
    "TOP 1%": "ТОП 1%",
    "SPIN & WIN · C$1 000 BUY-IN": "SPIN & WIN · ВХОД C$1 000",
    "BAD BEAT · QUADS BEATEN": "BAD BEAT · КАРЕ ПОБИТО",
    "YOUR SHARE IMAGE · 4:5": "ВАШЕ ИЗОБРАЖЕНИЕ · 4:5",
    "Just took": "Только что взял",
    "You knocked out": "Вы выбили",
    "RANK #": "МЕСТО #",
    "CLAIM PRIZE": "ЗАБРАТЬ ПРИЗ",
    "COLLECT & CONTINUE": "ЗАБРАТЬ И ПРОДОЛЖИТЬ",
    "MORE MISSIONS": "ЕЩЁ МИССИИ",
    "GOLD TICKET": "ЗОЛОТОЙ ТИКЕТ",
    "DON'T BREAK IT": "НЕ ПРЕРЫВАЙТЕ",
    "TONIGHT 21:00": "СЕГОДНЯ В 21:00",
    "STARTS 19:30": "СТАРТ 19:30",
    "FEATURED TOURNAMENTS": "ИЗБРАННЫЕ ТУРНИРЫ",
    "PRESENT OPENED": "ПОДАРОК ОТКРЫТ",
    "Next present on day": "Следующий подарок на день",
    "Table tile": "Плитка стола",
    "Picker style": "Стиль выбора",
    "TILES": "ПЛИТКИ",
    "WHEELS": "КОЛЁСА",
    // правки 08.09: меню стола і шторка «вийти зі всіх столів»
    "LEAVE EVERY TABLE?": "ПОКИНУТЬ ВСЕ СТОЛЫ?",
    "LEAVE THE TABLE?": "ПОКИНУТЬ СТОЛ?",
    "Every seat you hold is given up and all stacks are cashed out at once.": "Вы освобождаете все свои места, стеки сразу возвращаются на баланс.",
    "Keep your seat and pop back to the lobby, or leave the table and cash out.": "Можно сохранить место и выйти в лобби, а можно покинуть стол и забрать стек.",
    "Every seat is kept · tables stay open": "Места сохраняются · столы остаются открытыми",
    "Your seat is kept · table stays open": "Место сохраняется · стол остаётся открытым",
    "Give up every seat & cash out": "Освободить все места и забрать стеки",
    "Give up the seat & cash out your stack": "Освободить место и забрать стек",
    "LEAVE ALL TABLES": "ПОКИНУТЬ ВСЕ СТОЛЫ", "LEAVE TABLE": "ПОКИНУТЬ СТОЛ",
    "BACK TO LOBBY": "В ЛОББИ",
    "Cards fold for you, seat & chips stay": "Карты сбросят за вас, место и фишки сохранятся",
    "Top up your stack from balance": "Доложить фишки из имеющегося баланса",
    "Seat held for 10 minutes, blinds are not posted": "Место держится 10 минут, блайнды не списываются",
    "Stack returns to balance": "Стек вернётся на баланс",
    "Skip hands everywhere you are seated": "Пропускать раздачи на всех столах",
    "Every seat you hold, with confirmation": "Все ваши места, с подтверждением",
    "SIT OUT — ALL TABLES": "ПРОПУСК РАЗДАЧ — ВСЕ СТОЛЫ",
    "MORE": "ЕЩЁ", "HAND\nHISTORY": "ИСТОРИЯ РАЗДАЧ", "LEADERBOARD": "ЛИДЕРБОРД",
    "TABLE\nSETTINGS": "НАСТРОЙКИ СТОЛА", "HISTORY": "ИСТОРИЯ", "ADD CHIPS": "ДОКУПИТЬ ФИШКИ",
    // стани зʼєднання
    "WEAK CONNECTION": "СЛАБАЯ СВЯЗЬ", "CONNECTION LOST": "СВЯЗЬ ПОТЕРЯНА",
    "BACK ONLINE": "СВЯЗЬ ВОССТАНОВЛЕНА", "OPPONENT RECONNECTING": "ОППОНЕНТ ПЕРЕПОДКЛЮЧАЕТСЯ",
    "4 TABLES OPEN": "ОТКРЫТО 4 СТОЛА", "NO CONNECTION": "НЕТ СВЯЗИ",
    "Reconnecting… your seat is held": "Переподключаемся… место сохраняется",
    "timebank running": "идёт тайм-банк",
    "Cards fold at the timebank end": "Карты сбросятся по окончании тайм-банка",
    "You did not miss a hand": "Вы не пропустили ни одной раздачи",
    "Adding more may slow your device": "Ещё один стол может замедлить устройство",
    "Action cannot be sent — waiting for network": "Действие не отправить — ждём сеть",
    "OPENS THE HELP PAGE": "ОТКРОЕТСЯ СТРАНИЦА ПОМОЩИ", "RETURN TO GAME": "ВЕРНУТЬСЯ К ИГРЕ", "MINIMIZE TABLE": "СВЕРНУТЬ СТОЛ", "PAUSE": "ПАУЗА", "ADD CHIPS": "ДОКУПИТЬ ФИШКИ", "LEAVE & TAKE": "ВЫЙТИ И ЗАБРАТЬ", "ALL TABLES": "ВСЕ СТОЛЫ", "YOUR STACK": "ВАШ СТЕК", "TOP UP BALANCE": "ПОПОЛНИТЬ БАЛАНС", "Cards fold for you, seat & chips stay": "Карты сбросят за вас, место и фишки сохранятся", "Seat held for 10 minutes, blinds are not posted": "Место держится 10 минут, блайнды не списываются", "Top up your stack from balance": "Доложить фишки из имеющегося баланса", "Stack returns to balance": "Стек вернётся на баланс", "Every seat you hold, with confirmation": "Все ваши места, с подтверждением", "The full guide for": "Полная инструкция для", "opens on our website, with a way back to the app. Open it?": "откроется на нашем сайте, с кнопкой возврата в приложение. Открыть?",  "HOW IT WORKS": "КАК ЭТО РАБОТАЕТ", "FOLD": "СБРОСИТЬ",
    "PRE": "ПРЕ",
    // hand detail
    "HAND DETAIL": "ДЕТАЛИ РАЗДАЧИ", "SUMMARY": "ИТОГ", "TOTAL POT": "ОБЩИЙ БАНК",
    "REPLAY HAND": "ПОВТОР РАЗДАЧИ", "WON": "ВЫИГРАЛ", "ALL-IN": "ВА-БАНК",
    "POT AFTER PREFLOP": "БАНК ПОСЛЕ ПРЕФЛОПА", "POT AFTER FLOP": "БАНК ПОСЛЕ ФЛОПА",
    "POT AFTER TURN": "БАНК ПОСЛЕ ТЁРНА", "POT AFTER RIVER": "БАНК ПОСЛЕ РИВЕРА",
    "SHOW MORE": "ПОКАЗАТЬ ЕЩЁ", "ENTRY FROM": "ВХОД ОТ", "LAST 100 HANDS": "ПОСЛЕДНИЕ 100 РАЗДАЧ",
    "THIS TOURNAMENT": "ЭТОТ ТУРНИР",
    "SUNDAY": "ВОСКРЕСЕНЬЕ",
    "MONDAY": "ПОНЕДЕЛЬНИК",
    "TUESDAY": "ВТОРНИК",
    "WEDNESDAY": "СРЕДА",
    "THURSDAY": "ЧЕТВЕРГ",
    "FRIDAY": "ПЯТНИЦА",
    "SATURDAY": "СУББОТА",
    "SUNDAY 08:00": "ВОСКРЕСЕНЬЕ 08:00",
    "PER TIER ·": "ПО УРОВНЮ ·",
    "MAY 29": "29 МАЯ",
    "VIP": "VIP",
    "Your first deposit is matched up to $1 000. Tap to claim.": "Первый депозит удваиваем до $1 000. Нажмите, чтобы забрать.",
  });

  Object.assign(DICT, {
    "LEADERBOARD PRIZE IS YOURS": "ПРИЗ В ЛИДЕРБОРДЕ — ВАШ",
    "You finished #12 in the GRAND LEADERBOARD — tap to claim $4 250.00.": "Вы заняли 12-е место в ГРАНД-ЛИДЕРБОРДЕ — забрать $4 250.00.",
    "PRIZE WON": "ПРИЗ ВЫИГРАН", "IN LINE FOR": "ПРЕТЕНДУЕТЕ НА", "PAID OUT": "ВЫПЛАЧЕНО", "YOUR SHARE": "ВАША ДОЛЯ",
    "SEASON": "СЕЗОН", "POINTS": "ОЧКИ", "FIELD": "УЧАСТНИКОВ",
    "SAVE": "СОХРАНИТЬ", "SAVED": "СОХРАНЕНО", "SHARE": "ПОДЕЛИТЬСЯ", "SHARED": "ОТПРАВЛЕНО", "LINK COPIED": "ССЫЛКА СКОПИРОВАНА",
  });

  Object.assign(DICT, {
    "CONGRATULATIONS": "ПОЗДРАВЛЯЕМ", "FIRST PLACE": "ПЕРВОЕ МЕСТО", "MULTIPLIER HIT": "МНОЖИТЕЛЬ ВЫПАЛ",
    "JACKPOT": "ДЖЕКПОТ", "WINNER": "ПОБЕДА", "PRIZE POSITION": "ПРИЗОВОЕ МЕСТО", "CHAMPION": "ЧЕМПИОН",
    "JACKPOT WON": "ДЖЕКПОТ ВЗЯТ",
    "Your win as a 9:16 picture with your referral link on it — every share invites friends.": "Ваш выигрыш картинкой 9:16 с вашей реферальной ссылкой — каждый шер приглашает друзей.",
  });

  // patterns applied when no exact match (relative times, counters, suffixes)
  // Russian counts take three forms: 1 миссия · 2–4 миссии · 5+ миссий
  const plural = (n, one, few, many) => {
    const d = n % 10, h = n % 100;
    return d === 1 && h !== 11 ? one : d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many;
  };
  const HANDS = {
    "ACES FULL OF TENS": "ТУЗАМИ НА ДЕСЯТКАХ", "QUAD DEUCES": "КАРЕ ДВОЕК", "QUAD SIXES": "КАРЕ ШЕСТЁРОК",
    "QUAD SEVENS": "КАРЕ СЕМЁРОК", "QUAD EIGHTS": "КАРЕ ВОСЬМЁРОК", "QUAD NINES": "КАРЕ ДЕВЯТОК",
    "QUAD TENS": "КАРЕ ДЕСЯТОК", "QUAD JACKS": "КАРЕ ВАЛЕТОВ", "QUAD QUEENS": "КАРЕ ДАМ", "QUAD KINGS": "КАРЕ КОРОЛЕЙ",
  };
  // v3: ці записи мають перекривати старіші дублікати ("ви", нові екрани)
  Object.assign(DICT, {
    // ── v3 · розділ «Я», картковий домік, історія нарахувань, профіль ──
    "ME": "DotCenter", "YOUR CASHBACK": "ВАШ КЭШБЕК", "NEXT": "ДАЛЬШЕ", "SUITS": "МАСТИ",
    "card to the ace": "карта до туза", "cards to the ace": "карты до туза", "next suit": "следующая масть", "top of the deck": "вершина колоды",
    "XP left · surprise reward": "XP осталось · награда-сюрприз", "reward under the card": "награда под картой", "collection complete": "коллекция собрана",
    "Open profile": "Открыть профиль", "Card house. Drag to rotate.": "Карточный домик. Потяните, чтобы повернуть.",
    "Card house is built. Collect the reward": "Домик готов. Заберите награду",
    "THE HOUSE IS BUILT": "ДОМИК ГОТОВ", "FLOOR 1": "ЭТАЖ 1", "FLOOR 2": "ЭТАЖ 2", "ROOF": "КРЫША",
    "Collect the reward. The house falls apart and building starts again from zero.": "Заберите награду — карты вернутся в колоду, и вы начнёте собирать новый домик.",
    "Play to earn XP. The first floor appears at a third of the way.": "Играйте и копите XP. Первый этаж появится на трети пути.",
    "REWARD HISTORY": "ИСТОРИЯ РЕЙКБЕКА", "TOTAL REWARDS RECEIVED": "ВСЕГО НАЧИСЛЕНО НАГРАД",
    "Card house + card rewards, since your first hand.": "Карточный домик + награды за карты, с вашей первой раздачи.",
    "LAST 7 DAYS": "ПОСЛЕДНИЕ 7 ДНЕЙ", "LAST 30 DAYS": "ПОСЛЕДНИЕ 30 ДНЕЙ", "30 DAYS": "30 ДНЕЙ", "ACCRUALS": "НАЧИСЛЕНИЯ",
    "Rewards received divided by the rake you generated in the same period. Your real return is usually above the league rate: card rewards add to the house.": "Полученные награды, делённые на рейк, который вы сгенерировали за тот же период. Реальный возврат обычно выше ставки лиги: награды за карты добавляются к домику.",
    "LEVEL CARD ·": "КАРТА УРОВНЯ ·", "LEVEL CARD": "КАРТА УРОВНЯ",
    "PLAY — EARN XP": "ИГРАЙТЕ — КОПИТЕ XP", "THREE STAGES": "ТРИ ЭТАПА",
    "Every $1 of rake is 100 XP. XP fills the house and your card path at the same time.": "Каждый $1 рейка — это 100 XP. XP одновременно наполняет домик и ваш путь по картам.",
    "333 XP — first floor. 666 XP — second floor. 1 000 XP — the roof. The pile of cards turns into a house.": "333 XP — первый этаж. 666 XP — второй этаж. 1 000 XP — крыша. Куча карт превращается в домик.",
    "At 1 000 XP the button unlocks. The house falls, cashback lands on your balance, and a new house begins.": "На 1 000 XP кнопка открывается. Кэшбек зачисляется на баланс, а карты возвращаются в колоду для нового домика.",
    "BUILD STAGES": "ЭТАПЫ СТРОЙКИ", "DEMO ·": "ДЕМО ·",
    "3D is not available on this device.": "3D недоступно на этом устройстве.",
    "ID": "ID", "with us since": "с нами с", "Change photo": "Сменить фото",
    "BIGGEST POT WON": "САМЫЙ КРУПНЫЙ ВЫИГРАННЫЙ БАНК", "BIGGEST POT LOST": "САМЫЙ КРУПНЫЙ ПРОИГРАННЫЙ БАНК", "GAME STATS": "ИГРОВАЯ СТАТИСТИКА",
    "CASH STATS": "СТАТИСТИКА КЭША",
    "TOURNAMENT STATS": "СТАТИСТИКА ТУРНИРОВ",
    "SPIN & WIN STATS": "СТАТИСТИКА SPIN & WIN",
    "LEADERBOARD STATS": "СТАТИСТИКА ЛИДЕРБОРДОВ",
    "SPIN & WIN": "SPIN & WIN",
    "PLAY STYLE": "СТИЛЬ ИГРЫ", "FULL STATS": "ПОЛНАЯ СТАТИСТИКА", "OPEN WEBSITE": "ОТКРЫТЬ САЙТ", "GO TO WEBSITE": "ПЕРЕЙТИ", "CANCEL": "ОТМЕНА", "Do you want to go to the website with detailed statistics for your account?": "Вы действительно хотите перейти на сайт с детальной статистикой по вашему аккаунту?", "hands · disciplines · win rate · on the website": "раздачи · дисциплины · винрейт · на сайте", "Detailed statistics live on the website: every hand, every discipline, win rate, sessions and filters.": "Подробная статистика живёт на сайте: каждая раздача, каждая дисциплина, винрейт, сессии и фильтры.", "DISCIPLINES": "ДИСЦИПЛИНЫ", "SESSIONS": "СЕССИИ", "Every hand you played, with replay": "Каждая сыгранная раздача с повтором", "Hold'em, Omaha, tournaments, spins side by side": "Холдем, Омаха, турниры и спины рядом", "Win rate by stake, table and period": "Винрейт по лимиту, столу и периоду", "Session log with filters and export": "Журнал сессий с фильтрами и экспортом", "ends in 2d 4h": "конец через 2д 4ч",
    "tap a metric": "нажми на показатель",
    "typical range at 6-max": "типичный диапазон за 6-max",
    "FROM ENTRY TO TITLE": "ОТ ВХОДА ДО ПОБЕДЫ",
    "RESULTS": "РЕЗУЛЬТАТЫ",
    "points · ends in 2d 4h": "очков · конец через 2д 4ч",
    "Share of showdowns you won. When cards are opened at the end of a hand, how often yours were the best.": "Доля выигранных шоудаунов. Когда в конце раздачи вскрываются карты — как часто твои были лучшими.",
    "Cash sessions you played: one seat-in at one table counts as a game.": "Сыгранные кеш-сессии: одна посадка за один стол — одна игра.",
    "Hands dealt to you in this discipline over the period.": "Раздачи, в которых ты участвовал в этой дисциплине за период.",
    "Voluntarily put money in pot: share of hands you entered by calling or raising before the flop. 20–30% is typical at 6-max.": "Доля раздач, в которые ты добровольно вошёл коллом или рейзом до флопа.",
    "Preflop raise: share of hands you entered with a raise. Closer to VPIP means you take the lead instead of calling.": "Доля раздач, в которые ты вошёл рейзом. Чем ближе к VPIP, тем чаще ты берёшь инициативу вместо колла.",
    "Continuation bet: after raising before the flop, how often you bet the flop again.": "Продолженная ставка: после рейза до флопа — как часто ты снова ставишь на флопе.",
    "How often you re-raise someone else's preflop raise. 5–9% is typical.": "Как часто ты ререйзишь чужой рейз до флопа.",
    "Went to showdown: once you saw the flop, how often you went all the way to opening the cards.": "Дошёл до шоудауна: увидев флоп, как часто ты доходил до вскрытия карт.",
    "Aggression factor: bets and raises divided by calls after the flop. Above 2 means you bet more than you call.": "Фактор агрессии: ставки и рейзы, делённые на коллы после флопа. Больше 1 — ставок и рейзов больше, чем коллов.",
    "The biggest pot you won in this discipline. Tap the card to replay the hand.": "Самый крупный банк, который ты выиграл в этой дисциплине. Нажми на карточку, чтобы посмотреть повтор.",
    "Events you registered and played in the period.": "События, в которых ты зарегистрировался и сыграл за период.",
    "In the money: share of tournaments where you finished in a paid place.": "В призах: доля турниров, где ты финишировал на оплачиваемом месте.",
    "Tournaments where you reached the last table.": "Турниры, где ты дошёл до финального стола.",
    "Your highest finishing place in the period.": "Твоё лучшее место за период.",
    "Your average finish as a share of the field: 42% means you usually outlast 58% of players.": "Средний финиш как доля поля: 42% значит, что обычно ты переживаешь 58% игроков.",
    "Tournaments you won outright.": "Турниры, которые ты выиграл.",
    "Number of tournaments where you took a prize.": "Количество турниров, где ты забрал приз.",
    "Total prize money you received in the period.": "Сумма призовых, которые ты получил за период.",
    "The single biggest prize you received.": "Самый крупный отдельный приз.",
    "Share of Spin & Win games you won.": "Доля выигранных игр Spin & Win.",
    "Spins that hit the top multiplier tiers.": "Спины, где выпали высшие множители.",
    "The highest multiplier you have ever spun.": "Самый высокий множитель, который у тебя выпадал.",
    "Average multiplier across your spins.": "Средний множитель по всем твоим спинам.",
    "Spins that hit a multiplier of ×25 or higher.": "Спины с множителем ×25 и выше.",
    "Your longest run of Spin & Win victories in a row.": "Твоя самая длинная серия побед в Spin & Win подряд.",
    "Leaderboards you took part in.": "Лидерборды, в которых ты участвовал.",
    "Leaderboards where you finished in a paid place.": "Лидерборды, где ты финишировал на призовом месте.",
    "Your highest final position across all leaderboards.": "Твоё лучшее итоговое место по всем лидербордам.",
    "Times you finished on the podium: 1st, 2nd or 3rd.": "Сколько раз ты был на подиуме: 1, 2 или 3 место.",
    "Times you finished in the first ten.": "Сколько раз ты попадал в первую десятку.",
    "Your average final position.": "Твоё среднее итоговое место.",
    "Leaderboard points you collected in the period.": "Очки лидербордов, набранные за период.",
    "Leaderboards running right now where you already have points.": "Лидерборды, которые идут сейчас и где у тебя уже есть очки.",
    "How your spins split by multiplier. Rare high multipliers are highlighted.": "Как твои спины распределились по множителям. Редкие высокие множители подсвечены.",
    "Multipliers of your ten most recent spins, newest first.": "Множители десяти последних спинов, новые первыми.",
    "Your latest tournaments with the place and the prize.": "Твои последние турниры с местом и призом.",
    "HANDS PLAYED": "РАЗДАЧ СЫГРАНО", "MY STATS": "МОЯ СТАТИСТИКА", "TOTAL GAMES": "ВСЕГО ИГР", "PRIZES": "ПРИЗОВЫЕ", "WINS %": "ПОБЕД", "CASHES": "В ПРИЗАХ", "TITLES": "ПОБЕД", "BEST PRIZE": "ЛУЧШИЙ ПРИЗ", "DATE": "ДАТА", "WIN STREAK": "СЕРИЯ ПОБЕД", "×25 AND UP": "×25 И ВЫШЕ", "AF": "AF", "TOURNEYS": "ТУРНИРЫ", "SPINS": "СПИНЫ", "LEADERBOARDS": "ЛИДЕРБОРДЫ", "PLAYED": "СЫГРАНО", "PROFIT": "ПРОФИТ", "BEST": "ЛУЧШИЙ", "ENTERED": "УЧАСТИЙ", "PRIZE PLACES": "ПРИЗОВЫХ МЕСТ", "FINAL TABLES": "ФИНАЛЬНЫХ СТОЛОВ", "BEST FINISH": "ЛУЧШИЙ ФИНИШ", "AVG FINISH": "СРЕДНИЙ ФИНИШ", "BUY-INS": "БАЙ-ИНЫ", "RECENT RESULTS": "ПОСЛЕДНИЕ РЕЗУЛЬТАТЫ", "TOURNEY": "ТУРНИР", "PLACE": "МЕСТО", "PRIZE": "ПРИЗ", "MULTIPLIER HISTORY": "ИСТОРИЯ МНОЖИТЕЛЕЙ", "LAST 10 SPINS": "ПОСЛЕДНИЕ 10 СПИНОВ", "JACKPOTS": "ДЖЕКПОТЫ", "BEST PLACE": "ЛУЧШЕЕ МЕСТО", "AVG PLACE": "СРЕДНЕЕ МЕСТО", "ACTIVE NOW": "СЕЙЧАС ИДУТ", "PERIOD": "ПЕРИОД", "LEADERBOARD": "ЛИДЕРБОРД", "POINTS": "ОЧКИ", "LB": "ЛБ", "AVG": "СРЕДН.", "ROI": "ROI", "ITM": "ITM", "TOP 3": "ТОП-3", "TOP 10": "ТОП-10", "TOTAL HANDS": "ВСЕГО РУК", "RECENT GAMES": "НЕДАВНЯЯ ИСТОРИЯ ИГР", "DURATION": "ВРЕМЯ ИГРЫ", "OMAHA": "ОМАХА", "ALL TIME": "ВСЁ ВРЕМЯ", "ALL STATS ›": "ВСЯ СТАТИСТИКА ›", "HOURS AT TABLES": "ЧАСОВ ЗА СТОЛАМИ", "WIN RATE": "ВИНРЕЙТ", "SHOWDOWN WINS": "ПОБЕД НА ШОУДАУНЕ", "VPIP / PFR": "VPIP / PFR", "TOURNEYS · ITM": "ТУРНИРОВ · ITM",
    "since March 2026": "с марта 2026", "cash + tournaments": "кэш + турниры", "bb/100 · cash": "bb/100 · кэш", "of 1 930 showdowns": "из 1 930 шоудаунов", "hold'em": "холдем", "3 final tables": "3 финальных стола",
    "Your last 100 hands · replay": "Ваши последние 100 раздач · реплей", "Telegram · around the clock": "Telegram · круглосуточно",
    "NEW CASHBACK LEVEL": "НОВЫЙ УРОВЕНЬ КЭШБЕКА", "CARD UNLOCKED": "КАРТА ОТКРЫТА", "A NEW CARD IS YOURS": "НОВАЯ КАРТА ВАША", "BREAKING THE SEAL": "СНИМАЕМ ПЕЧАТЬ", "WELCOME TO YOUR COLLECTION": "ДОБРО ПОЖАЛОВАТЬ В КОЛЛЕКЦИЮ", "BACK TO COLLECTION": "К КОЛЛЕКЦИИ",
    "Demo reward recorded. All accumulated cycle XP has been collected.": "Зачислено на баланс. Карты вернулись в колоду — новый домик уже строится.", "Added to your balance": "Зачислено на баланс",
    "ME": "DotCenter", "until": "до", "card": "карта", "cards": "карты", "BIGGEST POT": "САМЫЙ КРУПНЫЙ БАНК", "WON": "ВЫИГРАН", "LOST": "ПРОИГРАН", "× house": "× домик", "× card": "× карта", "1 930 showdowns": "1 930 шоудаунов", "3 final tables": "3 финалки",
  });
  const RULES = [
    // назви комбінацій для порогів джекпоту (кеш і швидкий покер)
    [/^LOSE WITH (.+?) OR BETTER$/i, (m, a) => "ПРОИГРАТЬ С " + (HANDS[a.toUpperCase()] || a) + " ИЛИ СИЛЬНЕЕ"],
    // «ДО НАГРАДЫ 1 МИССИЯ / 3 МИССИИ / 7 МИССИЙ» — one phrase, correct plural
    [/^(\d+) AWAY$/, (m, a) => "ЧЕРЕЗ " + a],
    // Spin & Win: спосіб бай-іну (21.09)
    [/^balance (.+)$/, (m, a) => "баланс " + a],
    [/^(\d+) × (\$[\d.,]+) available$/, (m, a, b) => a + " × " + b + " доступно"],
    [/^(\d+) tickets?$/, (m, a) => a + " " + (a === "1" ? "билет" : (+a < 5 ? "билета" : "билетов"))],
    [/^(\d+) TICKETS?$/, (m, a) => a + " " + (a === "1" ? "ТИКЕТ" : (+a < 5 ? "ТИКЕТА" : "ТИКЕТОВ"))],
    [/^([\d ]+) showdowns$/, (m, a) => a + " шоудаунов"],
    [/^(\d+) final tables$/, (m, a) => a + " " + (a === "1" ? "финальный стол" : (+a < 5 ? "финальных стола" : "финальных столов"))],
    [/^(\d+) MISSIONS?$/, (m, a) => a + " " + plural(+a, "МИССИЯ", "МИССИИ", "МИССИЙ")],
    [/^(\d+) RULES?$/, (m, a) => a + " " + plural(+a, "ПРАВИЛО", "ПРАВИЛА", "ПРАВИЛ")],
    // екран друзів
    [/^Next stage at ([\d ]+) XP\. Every \$1 of rake adds (\d+) XP\.$/, (m, a, b) => `Следующий этап на ${a} XP. Каждый $1 рейка даёт ${b} XP.`],
    [/^(DEUCE|THREE|FOUR|FIVE|SIX|SEVEN|EIGHT|NINE|TEN|JACK|QUEEN|KING|ACE) OF (DIAMONDS|CLUBS|HEARTS|SPADES|DOT)$/, (m, a, b) => ({ DEUCE: "ДВОЙКА", THREE: "ТРОЙКА", FOUR: "ЧЕТВЁРКА", FIVE: "ПЯТЁРКА", SIX: "ШЕСТЁРКА", SEVEN: "СЕМЁРКА", EIGHT: "ВОСЬМЁРКА", NINE: "ДЕВЯТКА", TEN: "ДЕСЯТКА", JACK: "ВАЛЕТ", QUEEN: "ДАМА", KING: "КОРОЛЬ", ACE: "ТУЗ" })[a] + " " + ({ DIAMONDS: "БУБЕН", CLUBS: "КРЕСТЕЙ", HEARTS: "ЧЕРВЕЙ", SPADES: "ПИК", DOT: "DOT" })[b]],
    [/^Card house · (\d+)%$/, (m, a) => `Карточный домик · ${a}%`],
    [/^(\d+) DAYS AGO$/, (m, a) => a + " " + plural(+a, "ДЕНЬ", "ДНЯ", "ДНЕЙ") + " НАЗАД"],
    [/^FLOOR (\d+) \/ (\d+)$/, (m, a, b) => "ЭТАЖ " + a + " / " + b],
    [/^(\d+) \/ (\d+) PAIRS$/, (m, a, b) => a + " / " + b + " " + plural(+b, "ПАРА", "ПАРЫ", "ПАР")],
    [/^Building in pairs · next pair at ([\d\s\u00A0]+) XP$/, (m, a) => "Строим парами · следующая пара на " + a + " XP"],
    [/^LEVEL CARD · (.+)$/, (m, a) => "КАРТА УРОВНЯ · " + a],
    [/^(\d+) made a deposit$/, (m, a) => a + " " + (+a === 1 ? "сделал депозит" : "сделали депозит")],
    // кнопка шторки фільтрів: «ПОКАЗАТЬ 42 СТОЛА»
    [/^APPLY · (\d+) TABLES?$/i, (m, a) => "ПРИМЕНИТЬ · " + a + " " + plural(+a, "СТОЛ", "СТОЛА", "СТОЛОВ")],
    [/^(\d+) TABLES?$/i, (m, a) => a + " " + plural(+a, "СТОЛ", "СТОЛА", "СТОЛОВ")],
    // назви столів Омахи 5: «OMAHA5 103» → «ОМАХА 5 103»
    [/^OMAHA5 (.+)$/, (m, a) => "ОМАХА 5 " + a],
    [/^(\d+) cleared$/, (m, a) => a + " выполнено"],
    [/^(\d+) lost$/, (m, a) => a + " потеряно"],
    [/^(\d+) to come$/, (m, a) => "ещё " + a],
    [/^You have (\d+) days? left to start\. The Honeymoon expires if you don't begin by day 7\.$/,
      (m, a) => "У вас " + a + " " + plural(+a, "день", "дня", "дней") + ", чтобы начать. Медовый месяц истечёт, если не начать до 7-го дня."],
    [/^(\d+) DAYS?$/, (m, a) => a + " " + plural(+a, "ДЕНЬ", "ДНЯ", "ДНЕЙ")],
    [/^NEXT PRIZE IN (\d+) MISSIONS?$/, (m, a) => "ДО НАГРАДЫ " + a + " " + plural(+a, "МИССИЯ", "МИССИИ", "МИССИЙ")],
    // «ДО ПОДАРКА 1 ДЕНЬ / 3 ДНЯ / 7 ДНЕЙ»
    [/^CHOOSE 1 OF (\d+)$/, (m, a) => "ВЫБЕРИТЕ 1 ИЗ " + a],
    [/^NEXT GIFT IN (\d+) DAYS?$/, (m, a) => {
      const n = +a, d = n % 10, h = n % 100;
      const w = d === 1 && h !== 11 ? "ДЕНЬ" : d >= 2 && d <= 4 && (h < 12 || h > 14) ? "ДНЯ" : "ДНЕЙ";
      return "ДО ПОДАРКА " + a + " " + w;
    }],
    [/^(\d+)D (\d+)H$/, (m, a, b) => `${a} ДН. ${b} Ч`],
    [/^IN (\d+)D (\d+)H$/, (m, a, b) => `ЧЕРЕЗ ${a}Д ${b}Ч`],
    [/^IN (\d+)H (\d+)M$/, (m, a, b) => `ЧЕРЕЗ ${a}Ч ${b}М`],
    [/^IN (\d+)H$/, (m, a) => `ЧЕРЕЗ ${a}Ч`],
    [/^IN (\d+)M$/, (m, a) => `ЧЕРЕЗ ${a}М`],
    [/^(\d+)H AGO$/, (m, a) => `${a}Ч НАЗАД`],
    [/^(\d+)D AGO$/, (m, a) => `${a}Д НАЗАД`],
    [/^(\d+)M AGO$/, (m, a) => `${a}М НАЗАД`],
    [/^(\d+) MIN$/, (m, a) => `${a} МИН`],
    [/^(\d+) SEC$/, (m, a) => `${a} СЕК`],
    [/^(\d+) DAYS?$/, (m, a) => `${a} ДН.`],
    [/^(\d+) BB$/, (m, a) => `${a} ББ`],
    [/^TODAY(\s.*)?$/, (m, rest) => "СЕГОДНЯ" + (rest || "")],
    [/^TOMORROW(\s.*)?$/, (m, rest) => "ЗАВТРА" + (rest || "")],
    [/^LATE REG (\d+)M$/, (m, a) => `ПОЗДНЯЯ РЕГ. ${a}М`],
    [/^(\d+) SEATS? LEFT$/, (m, a) => `ОСТАЛОСЬ МЕСТ: ${a}`],
    [/^REGISTER ·(.*)$/, (m, a) => `РЕГИСТРАЦИЯ ·${a}`],
    [/^(.*) GTD$/, (m, a) => `${a} ГАРАНТ.`],
    [/^WINS ([\d\s.,]+)$/, (m, a) => `ВЫИГРЫВАЕТ ${a}`],
    [/^([\d\s]+) REGISTERED$/, (m, a) => `ИГРОКОВ: ${a.trim()}`],
    [/^ENDS IN (.+)$/, (m, a) => `ДО КОНЦА ${a}`],
    [/^STARTS IN (.+)$/, (m, a) => `СТАРТ ЧЕРЕЗ ${a}`],
    [/^UP TO (.+) IN BONUS FUNDS$/, (m, a) => `ДО ${a} БОНУСОМ`],
    [/^(\d+) EVENTS$/, (m, a) => `СОБЫТИЙ: ${a}`],
    [/^TABLE (\d+)$/, (m, a) => `СТОЛ ${a}`],
    [/^SEAT (\d+)$/, (m, a) => `МЕСТО ${a}`],
    [/^Table (\d+)$/, (m, a) => `Стол ${a}`],
    [/^LEVEL (\d+)$/, (m, a) => `УРОВЕНЬ ${a}`],
    [/^LEVEL (\d+) NEXT · (.+) AT (\d+)$/, (m, a, b, c) => `УРОВЕНЬ ${a} ДАЛЕЕ · ${DICT[b] || b} С ${c}`],
    [/^BRONZE (\d+)$/, (m, a) => `БРОНЗА ${a}`],
    [/^SILVER (\d+)$/, (m, a) => `СЕРЕБРО ${a}`],
    [/^GOLD (\d+)$/, (m, a) => `ЗОЛОТО ${a}`],
    [/^(\d+)m$/, (m, a) => `${a}м`],
    [/^(\d+)h$/, (m, a) => `${a}ч`],
    [/^(\d+)s$/, (m, a) => `${a}с`],
    [/^Play (\d+) hands (?:of|in) (.+)$/, (m, a, b) => `Сыграйте ${a} рук в ${b}`],
    [/^Play (\d+) games? in (.+)$/, (m, a, b) => `Сыграйте ${a} игр в ${b}`],
    [/^Win (\d+) (.+?) games?$/, (m, a, b) => `Выиграйте ${a} игр в ${b}`],
    [/^Play in (.+) once$/, (m, a) => `Сыграйте в ${a} один раз`],
    [/^Reach the final table in (.+)$/, (m, a) => `Дойдите до финального стола в ${a}`],
    [/^Reach showdown with (.+) in (.+)$/, (m, a, b) => `Дойдите до шоудауна с ${a} в ${b}`],
    [/^(\d+)W AGO$/, (m, a) => `${a} НЕД. НАЗАД`],
    [/^(\d+)MO AGO$/, (m, a) => `${a} МЕС. НАЗАД`],
    [/^RESEND IN (.+)$/, (m, a) => `ПОВТОР ЧЕРЕЗ ${a}`],
    [/^TONIGHT (.+)$/, (m, a) => `СЕГОДНЯ В ${a}`],
    [/^(\d+) MISSIONS? AWAY$/, (m, a) => `ДО НАГРАДЫ МИССИЙ: ${a}`],
    [/^(\d+) DAYS? TO GO$/, (m, a) => `ОСТАЛОСЬ ДНЕЙ: ${a}`],
    [/^(\d+) DAYS? LEFT$/, (m, a) => `ОСТАЛОСЬ ДНЕЙ: ${a}`],
    [/^(\d+) TICKETS?$/, (m, a) => `${a} ТИКЕТ(ОВ)`],
  ];

  const CACHE = new WeakMap();
  const WROTE = new WeakMap();   // node → the RU value we last wrote     // text node -> original English
  const ATTR_CACHE = new WeakMap(); // element -> {attr: original}
  const ATTRS = ["placeholder", "aria-label", "title"];
  let lang = "en", scheduled = false, observer = null;

  const MONTHS = { JAN: "ЯНВ", FEB: "ФЕВ", MAR: "МАР", APR: "АПР", MAY: "МАЙ", JUN: "ИЮН", JUL: "ИЮЛ", AUG: "АВГ", SEP: "СЕН", OCT: "ОКТ", NOV: "НОЯ", DEC: "ДЕК" };
  const WEEK = { MON: "ПН", TUE: "ВТ", WED: "СР", THU: "ЧТ", FRI: "ПТ", SAT: "СБ", SUN: "ВС" };

  function core(t) {
    if (DICT[t]) return DICT[t];
    const up = t.toUpperCase();
    if (up !== t && DICT[up]) return DICT[up];
    for (const [re, fn] of RULES) { const m = t.match(re); if (m) return fn(...m); }
    let m = t.match(/^([A-Z]{3}) (\d{1,2})$/);            // AUG 27
    if (m && MONTHS[m[1]]) return `${m[2]} ${MONTHS[m[1]]}`;
    m = t.match(/^([A-Z]{3}) (\d{1,2}), (\d{4})(.*)$/);    // AUG 26, 2026 00:53
    if (m && MONTHS[m[1]]) return `${m[2]} ${MONTHS[m[1]]} ${m[3]}${m[4]}`;
    if (WEEK[up] && up === t) return WEEK[up];
    return null;
  }

  // оболонка → переклад; $1 = число або сума з оригіналу
  const PATTERNS = [
    [/^ALL TABLES \((\d+)\)$/i,        "ВСЕ СТОЛЫ ($1)"],
    [/^LEAVE & TAKE (.+)$/i,            "ВЫЙТИ И ЗАБРАТЬ $1"],
    [/^(\d+) OPEN TABLES$/i,            "ОТКРЫТО СТОЛОВ: $1"],
    [/^YOUR STACK (.+)$/i,              "ВАШ СТЕК $1"],
    [/^ENTRY (.+)$/i,                   "ВХОД $1"],
    [/^TABLE STARTS IN (\d+)…$/i,       "СТОЛ СТАРТУЕТ ЧЕРЕЗ $1…"],
    [/^\+(\d+) XP STACKED$/i,           "+$1 XP НАКОПЛЕНО"],
    [/^SLOT (\d+)$/i,                   "СЛОТ $1"],
    [/^(\d+) LEADERBOARDS?$/i,          "$1 ЛИДЕРБОРДА"],
    [/^TOTAL POOL (.+)$/i,              "ОБЩИЙ ФОНД $1"],
    [/^(\d+) PRESENTS? OPENED$/i,       "ПОДАРКОВ ОТКРЫТО: $1"],
    [/^PRESENT ON DAY (\d+)$/i,         "ПОДАРОК НА ДЕНЬ $1"],
    [/^DAY (\d+)\u2013(\d+)$/i,          "ДНИ $1\u2013$2"],
    [/^(\d+) \/ 7 DAYS$/i,              "$1 / 7 ДНЕЙ"],
    [/^(\d+) DAYS LEFT$/i,              "ОСТАЛОСЬ ДНЕЙ: $1"],
    [/^(\d+) DAYS TO GO$/i,             "ОСТАЛОСЬ $1 ДНЕЙ"],
    [/^NEXT CHECK-IN IN (.+)$/i,        "СЛЕДУЮЩАЯ ОТМЕТКА ЧЕРЕЗ $1"],
    [/^Day (\d+) banked \u2014 present on day (\d+)$/i, "День $1 отмечен \u2014 подарок на день $2"],
    [/^Day (\d+) \u2014 present on day (\d+)$/i,        "День $1 \u2014 подарок на день $2"],
    [/^Next present on day (\d+)\.$/i,  "Следующий подарок на день $1."],
    [/^DAILY CHECK-IN \u00B7 DAY (\d+)$/i, "ЧЕК-ИН ДНЯ \u00B7 ДЕНЬ $1"],
    [/^(\d+) PRESENTS$/i,               "$1 ПОДАРКОВ"],
    [/^DAY (\d+)$/i,                    "ДЕНЬ $1"],
    [/^(\d+) TABLES$/i,                 "$1 СТОЛОВ"],
    [/^(\d+) SEATS?$/i,                 "$1 МЕСТ"],
    [/^A SEAT$/i,                       "МЕСТО"],
    [/^DEPOSIT (.+?) \u00B7 GET \+(.+?) BONUS$/i, "ДЕПОЗИТ $1 \u00B7 БОНУС +$2"],
    [/^FRIEND (\d+)$/i,                 "ДРУГ $1"],
    [/^(\d+) MORE TO THE \$50 MAIN PRIZE$/i, "ЕЩЁ $1 ДО ГЛАВНОГО ПРИЗА $50"],
    [/^(\d+) PLAYING NOW$/i,            "$1 ИГРАЮТ СЕЙЧАС"],
  ];
  function translate(raw) {
    const t = raw.trim();
    if (!t || t.length > 400) return null;
    const direct = core(t);
    if (direct) return direct;
    // trailing chevron / arrow: translate the head, keep the glyph
    let m = t.match(/^([·›»])\s*(.+)$/);
    if (m) { const h = translate(m[2]); if (h) return `${m[1]} ${h}`; }
    m = t.match(/^(.*?)\s*([›»→▸▶·])$/);
    if (m) { const h = core(m[1].trim()); if (h) return `${h} ${m[2]}`; }
    // шаблони з числом/сумою: перекладаємо оболонку, значення лишаємо
    // (правка 08.09: у меню стола половина рядків не перекладалась саме
    //  через те, що в них вшита сума або лічильник)
    for (const [re, ru] of PATTERNS) {
      const mm = t.match(re);
      if (mm) return ru.replace("$1", mm[1]).replace("$2", mm[2] || "");
    }
    // dot-separated composites: translate each known segment
    if (t.includes(" · ")) {
      const parts = t.split(" · ");
      let hit = false;
      const out = parts.map((p) => { const r = core(p.trim()); if (r) { hit = true; return r; } return p; });
      if (hit) return out.join(" · ");
    }
    return null;
  }
  function withSpacing(raw, out) {
    const lead = raw.match(/^\s*/)[0], tail = raw.match(/\s*$/)[0];
    return lead + out + tail;
  }

  function walk(root) {
    const pending = []; // {node, orig, out, el, w0, h0}
    const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    for (let n = it.nextNode(); n; n = it.nextNode()) nodes.push(n);
    for (const n of nodes) {
      const p = n.parentNode;
      if (!p || p.nodeName === "SCRIPT" || p.nodeName === "STYLE") continue;
      // Власні назви (наприклад назви мов у списку) перекладати не можна:
      // гілку позначають атрибутом data-i18n="off" і ми її не чіпаємо.
      if (p.closest && p.closest('[data-i18n="off"]')) continue;
      if (lang === "ru") {
        // the cache is only valid while the node still holds OUR translation;
        // a different value means React wrote fresh English — retranslate that
        let orig;
        if (CACHE.has(n) && WROTE.get(n) === n.nodeValue) orig = CACHE.get(n);
        else { orig = n.nodeValue; CACHE.delete(n); WROTE.delete(n); }
        const out = translate(orig.replace(/\s+/g, " "));
        if (!out) continue;
        const v = withSpacing(orig, out);
        if (n.nodeValue === v) continue;
        CACHE.set(n, orig);
        WROTE.set(n, v);
        // remember the English box so the RU copy can be fitted back into it
        pending.push({ node: n, value: v, el: p, w0: p.offsetWidth || 0, h0: p.offsetHeight || 0 });
      } else if (CACHE.has(n)) {
        const orig = CACHE.get(n);
        if (n.nodeValue !== orig) n.nodeValue = orig;
      }
    }
    for (const p of pending) p.node.nodeValue = p.value;
    // attributes
    const els = root.querySelectorAll ? root.querySelectorAll("[placeholder],[aria-label],[title]") : [];
    els.forEach((el) => {
      let store = ATTR_CACHE.get(el) || {};
      for (const a of ATTRS) {
        const cur = el.getAttribute(a);
        if (cur == null) continue;
        if (lang === "ru") {
          const orig = a in store ? store[a] : cur;
          const out = translate(orig);
          if (out) { store[a] = orig; if (cur !== out) el.setAttribute(a, out); }
        } else if (a in store && cur !== store[a]) el.setAttribute(a, store[a]);
      }
      ATTR_CACHE.set(el, store);
    });
    return pending;
  }

  const FIT = new Set(); // elements adjusted so the RU copy keeps the EN footprint

  // Ru strings run longer than EN. Rather than let them wrap and push the
  // layout around, each translated label keeps the box the EN label had:
  // 1. single-line labels are pinned to one line,
  // 2. the (wide) tracking is tightened to one uniform value,
  // 3. only if it still does not fit, the whole ROW is scaled by one shared
  //    factor — never element-by-element, so sizes stay even.
  const TIGHT_LS = "0.02em";

  function prep(el) {
    if (!el.dataset.pxFitBase) {
      const cs = getComputedStyle(el);
      el.dataset.pxFitBase = String(parseFloat(cs.fontSize) || 12);
      el.dataset.pxFitLs = el.style.letterSpacing || "";
      el.dataset.pxFitWs = el.style.whiteSpace || "";
      el.dataset.pxFitTracking = cs.letterSpacing;
    }
    FIT.add(el);
  }

  function fitOne(p) {
    const { el, w0, h0 } = p;
    if (!el || el.nodeType !== 1 || !el.isConnected) return;
    if (!w0 && !h0) return;
    const grew = (h0 > 0 && el.offsetHeight > h0 + 2) || (w0 > 0 && el.offsetWidth > w0 + 2) ||
                 (el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 3);
    if (!grew) return;
    if (getComputedStyle(el).display === "none") return;
    prep(el);
    // 1) one line, if the English label was one line
    const lh = parseFloat(getComputedStyle(el).lineHeight) || parseFloat(el.dataset.pxFitBase) * 1.2;
    if (h0 > 0 && h0 <= lh * 1.6) el.style.whiteSpace = "nowrap";
    // 2) uniform tighter tracking
    if (parseFloat(el.dataset.pxFitTracking) > 0) el.style.letterSpacing = TIGHT_LS;
    // 3) only if tracking alone did not do it, ask for a scale
    const stillWide = w0 > 0 && el.scrollWidth > w0 + 2;
    const need = stillWide ? el.scrollWidth / w0 : 1;
    // 4) якщо навіть найменша сходинка не рятує — краще перенести рядок,
    //    ніж випустити текст за межі картки (правка 08.09)
    if (need > 1 / 0.9) el.style.whiteSpace = el.dataset.pxFitWs || "";
    p.scale = need > 1.02 ? Math.max(0.9, Math.floor((1 / need) * 20) / 20) : 1;
  }

  // Однакова роль → однаковий розмір, але В МЕЖАХ ОДНОГО КОНТРОЛА.
  // Раніше сходинка бралася на весь екран: один довгий підпис тягнув за собою
  // всі написи тієї ж ролі, і екран виглядав випадково дрібним. Тепер сусіди
  // в одному ряду рівні між собою, а сусідній ряд живе своїм життям.
  const BUCKETS = new Map();          // host -> Map(роль -> {scale, tight})

  function bucketKey(el, cs) {
    const base = el.dataset.pxFitBase ? parseFloat(el.dataset.pxFitBase) : parseFloat(cs.fontSize);
    if (!base) return null;
    return (Math.round(base * 2) / 2) + "|" + cs.fontWeight + "|" + cs.fontFamily;
  }

  // контрол = найближчий предок (до 3 рівнів), у якому є принаймні два
  // текстові листки: ряд сегмента, ряд чіпів, комірка сітки тощо
  function groupHost(el) {
    let h = el.parentElement;
    for (let i = 0; i < 3 && h; i++) {
      let leaves = 0;
      for (const c of h.children) if (!c.children.length && (c.textContent || "").trim()) leaves++;
      if (leaves >= 2) return h;
      h = h.parentElement;
    }
    return el.parentElement || el;
  }

  function slot(el) {
    const host = groupHost(el);
    let m = BUCKETS.get(host);
    if (!m) { m = new Map(); BUCKETS.set(host, m); }
    return m;
  }

  function note(el, scale, tight) {
    const cs = getComputedStyle(el);
    const key = bucketKey(el, cs);
    if (!key) return;
    const m = slot(el);
    const b = m.get(key) || { scale: 1, tight: false };
    if (scale != null && scale < b.scale) b.scale = scale;
    if (tight) b.tight = true;
    m.set(key, b);
  }

  // Catch anything the measure-based pass missed (elements that mounted after
  // their box was measured): still clipped => the whole type role shrinks.
  function sweepOverflow() {
    document.body.querySelectorAll("*").forEach((el) => {
      if (el.children.length) return;
      const t = el.textContent;
      if (!t || !/[\u0400-\u04FF]/.test(t)) return;
      let need = 0;
      if (el.clientWidth > 0) {
        if (el.scrollWidth > el.clientWidth + 3) need = el.scrollWidth / el.clientWidth;
      } else {
        // inline element: measure against the nearest sized ancestor
        const w = el.getBoundingClientRect().width;
        let box = el.parentElement;
        while (box && box.clientWidth === 0) box = box.parentElement;
        if (!box || !w) return;
        const cs2 = getComputedStyle(box);
        const inner = box.clientWidth - parseFloat(cs2.paddingLeft || 0) - parseFloat(cs2.paddingRight || 0);
        if (inner > 0 && w > inner + 3) need = w / inner;
      }
      if (!need) return;
      prep(el);
      el.style.maxWidth = "100%";
      el.style.overflowWrap = "anywhere";
      note(el, Math.max(0.7, Math.floor((1 / need) * 20) / 20), true);
    });
  }

  // Apply each remembered role scale to every element of that role on screen,
  // so identical labels are identical everywhere — nav bar included.
  function applyBuckets() {
    if (!BUCKETS.size) return;
    const hit = (el, b) => {
      prep(el);
      const base = parseFloat(el.dataset.pxFitBase);
      if (b.tight && parseFloat(el.dataset.pxFitTracking) > 0) el.style.letterSpacing = TIGHT_LS;
      el.style.fontSize = b.scale < 1 ? (base * b.scale).toFixed(2) + "px" : (base ? base + "px" : "");
    };
    for (const [host, roles] of BUCKETS) {
      if (!host || !host.isConnected) { BUCKETS.delete(host); continue; }
      const leaves = [];
      host.querySelectorAll("*").forEach((el) => {
        if (el.children.length) return;
        if ((el.textContent || "").trim()) leaves.push(el);
      });
      for (const el of leaves) {
        const b = roles.get(bucketKey(el, getComputedStyle(el)));
        if (!b || (b.scale >= 1 && !b.tight)) continue;
        hit(el, b);
      }
    }
  }

  function normalizeGroups(pending) {
    for (const p of pending) {
      const el = p.el;
      if (!el || el.nodeType !== 1 || !el.isConnected) continue;
      if (getComputedStyle(el).display === "none") continue;
      note(el, p.scale, FIT.has(el));
    }
    sweepOverflow();
    applyBuckets();
  }

  function unfitAll() {
    BUCKETS.clear();
    FIT.forEach((el) => {
      // restore the authored size — clearing it drops React's own inline value
      const b0 = parseFloat(el.dataset.pxFitBase);
      el.style.fontSize = b0 ? b0 + "px" : "";
      el.style.letterSpacing = el.dataset.pxFitLs || "";
      el.style.whiteSpace = el.dataset.pxFitWs || "";
      el.style.maxWidth = ""; el.style.overflowWrap = "";
      delete el.dataset.pxFitBase; delete el.dataset.pxFitLs; delete el.dataset.pxFitTracking; delete el.dataset.pxFitWs;
    });
    FIT.clear();
  }

  let inRun = false;
  function run() {
    if (inRun) return;
    inRun = true;
    if (observer) observer.disconnect();
    try {
      const pending = walk(document.body);
      if (lang === "ru") { pending.forEach(fitOne); normalizeGroups(pending); } else unfitAll();
    } catch (e) { console.warn("i18n", e); }
    if (observer) observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    inRun = false;
  }
    // Translate in the same task as the DOM change so a new screen never paints
  // in English first. A trailing pass catches async/late renders.
  function schedule() {
    if (inRun) return;
    run();
    if (!scheduled) { scheduled = true; setTimeout(() => { scheduled = false; run(); }, 40); }
  }

  // Chakra Petch / Geist Mono carry no Cyrillic, so RU text falls back to an
  // ugly system face. Swap the families for Cyrillic-native equivalents while
  // RU is active (attribute selectors + !important beat the inline styles).
  function ensureFonts() {
    if (document.getElementById("px-ru-fonts")) return;
    const l = document.createElement("link");
    l.id = "px-ru-fonts";
    l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Golos+Text:wght@500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap";
    document.head.appendChild(l);
    const st = document.createElement("style");
    st.id = "px-ru-font-css";
    st.textContent = [
      'html[lang="ru"]{--cm-font-display:"Play","Golos Text",sans-serif;--cm-font-ui:"Play","Golos Text",sans-serif}',
      'html[lang="ru"] body{font-family:"Play","Golos Text",sans-serif}',
      'html[lang="ru"] [style*="Chakra Petch"]{font-family:"Play","Golos Text","Chakra Petch",sans-serif!important}',
      'html[lang="ru"] [style*="NDOT"]{font-family:"Play",sans-serif!important}',
      'html[lang="ru"] [style*="Geist Mono"],html[lang="ru"] [style*="Space Mono"],html[lang="ru"] [style*="Roboto Mono"],html[lang="ru"] [style*="ui-monospace"]{font-family:"Play","Golos Text",sans-serif!important;font-variant-numeric:tabular-nums}',
    ].join("");
    document.head.appendChild(st);
  }

  function setLang(l) {
    lang = l === "ru" ? "ru" : "en";
    try { localStorage.setItem("pokerix_lang", lang); } catch (e) {}
    document.documentElement.setAttribute("lang", lang);
    if (lang === "ru") ensureFonts();
    run();
  }

  window.PXI18N = {
    setLang,
    get lang() { return lang; },
    t: (s) => (lang === "ru" ? translate(s) || s : s),
    fromLabel: (label) => (label === "Русский" ? "ru" : "en"),
    DICT,
  };

  function boot() {
    if (!document.body) return void setTimeout(boot, 30);
    observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    let saved = "ru";
    try { saved = localStorage.getItem("pokerix_lang") || "ru"; } catch (e) {}
    setLang(saved);
    setInterval(schedule, 1500); // catch canvas-adjacent late renders
  }
  boot();
})();

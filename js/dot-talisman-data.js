// dot-talisman-data.js — DOT tab: twelve talismans (style × result), metrics, personas, Heat & Bad Beats mock data.
// Source: «PokerDot · ТЗ для Claude Design · 22.09.2026 · Вкладка DOT у розділі Career». All UI copy is EN, taken from the spec.
(function () {
  // ── metric codes → tooltip definition + five zone words (Cash 6-max base) ─────────
  const METRICS = {
    VPIP:  { def: "Hands you play out of 100 (not folding preflop).", zones: ["very tight", "normal", "loose", "very loose", "everything"] },
    RATIO: { def: "PFR ÷ VPIP: do you enter raising or calling.", zones: ["caller", "mixed", "mostly raising", "aggressor", "aggressor"] },
    "3BET": { def: "How often you re-raise someone's raise.", zones: ["rarely", "low", "normal", "high", "very high"] },
    F3B:   { def: "How often you fold when re-raised.", zones: ["stubborn", "normal", "careful", "pushover", "pushover"] },
    STEAL: { def: "How often you attack the blinds from the button and cutoff.", zones: ["rarely", "low", "normal", "often", "relentless"] },
    AF:    { def: "Bets and raises per one call after the flop.", zones: ["passive", "careful", "normal", "aggressive", "relentless"] },
    CBET:  { def: "How often you bet the flop after raising preflop.", zones: ["rarely", "low", "normal", "high", "always"] },
    FCB:   { def: "How often you give up to a flop bet.", zones: ["sticky", "normal", "careful", "gives up", "folds to anything"] },
    XR:    { def: "How often you check-raise.", zones: ["never", "rare", "normal", "trapper", "constant"] },
    FLOAT: { def: "Call the flop, take the turn when they check.", zones: ["never", "rare", "normal", "often", "constant"] },
    WTSD:  { def: "How often you reach showdown after seeing a flop.", zones: ["folds early", "low", "normal", "sticky", "calls everything"] },
    W$SD:  { def: "How often you win when you reach showdown.", zones: ["loses too often", "low", "normal", "strong", "reader"] },
    WWSF:  { def: "Pots you win after seeing a flop.", zones: ["low", "low", "normal", "high", "high"] },
    BLUFF: { def: "Share of your river bets that were a pure bluff.", zones: ["never bluffs", "rare", "normal", "bluffs a lot", "mostly air"] },
    CAUGHT:{ def: "How many of your bluffs got called and beaten.", zones: ["gets through", "normal", "often caught", "caught a lot", "transparent"] },
    HERO:  { def: "Accuracy of your river calls without a strong hand.", zones: ["pays off", "pays off", "normal", "good read", "sees through"] },
    EV100: { def: "Win rate with all-ins counted by equity, not by result.", zones: ["losing", "leaking", "break-even", "winning", "crushing"] },
    LUCK:  { def: "Real result minus EV, in buy-ins. Variance.", zones: ["run over", "unlucky", "normal", "lucky", "on fire"] },
    RED:   { def: "Winnings without showdown (everyone folded to you).", zones: ["low", "low", "normal", "high", "steals a lot"] },
    BLUE:  { def: "Winnings at showdown.", zones: ["low", "low", "normal", "high", "high"] },
    TILT:  { def: "Spikes after a big loss: looser and wilder in the next 60 hands.", zones: ["none", "one", "some", "many", "constant"] },
    HANDS: { def: "Hands in the analysis window.", zones: ["few", "some", "normal", "a lot", "grinder"] },
  };
  METRICS.ZONE_NORMAL = 2;

  // ── the twelve, in map order (section 5) ─────────────────────────────────────────
  const ANIMALS = [
    { id: "tiger", name: "Tiger", power: "Balance", color: "#F2A93B", grade: "strong", evolves: "dragon",
      improve: "Open a few more hands from the button and cutoff when the table folds too much.",
      tagline: "Tight, aggressive, winning.",
      signals: ["VPIP 19–27", "Raise-to-call ratio 0.65+", "EV win rate +1 or better", "Bluffs 12–30% of river bets", "Wins 48–56% of showdowns"],
      meaning: "You pick your hands carefully and play them with the lead. Your bluffs and your value bets come in the same proportions, so nobody can read you off one habit. This is the style most winning players end up with.",
      edge: "Balance. Opponents who try to exploit you find nothing to grab.",
      leak: "Against tables that fold too much you leave money on the table — you could attack the blinds more.",
      next: "Open a few more hands from the button. If your win rate holds, the Dragon is next." },
    { id: "dragon", name: "Dragon", power: "Fire", color: "#D71921", grade: "strong", evolves: null,
      improve: "Pick the targets: bluff only the players who fold, and watch how often you get caught.",
      tagline: "Wide, aggressive, and it pays.",
      signals: ["VPIP 28+", "Raise-to-call ratio 0.65+", "3-bet 8+ or aggression 2.8+", "EV win rate +1 or better", "Bluffs caught 55% or less"],
      meaning: "You play a lot of hands and you play them hard — and it works. Your pressure makes people fold better hands and call with worse ones.",
      edge: "Relentless aggression that actually pays.",
      leak: "Swings. When bluffs get called, they're expensive. Pick the targets who fold.",
      next: "There's no next animal — keep the fire and watch how often you get caught." },
    { id: "ox", name: "Ox", power: "Strength", color: "#B87333", grade: "strong", evolves: "tiger",
      improve: "Add a bluff on the rivers where your line already looks strong.",
      tagline: "Bets with a hand. Gets paid.",
      signals: ["VPIP 27 or less", "Raise-to-call ratio 0.6+", "Bluffs under 12%", "Wins 55%+ of showdowns", "EV win rate 0 or better"],
      meaning: "You bet when you have it and you get paid. Almost no bluffs — just strong hands played hard.",
      edge: "When you show up at showdown, you win. People pay you off because they don't believe you.",
      leak: "Once they figure it out, they fold to your big bets. You win little without a showdown.",
      next: "Add a bluff on the rivers where your line looks strong anyway. That's the road to the Tiger." },
    { id: "snake", name: "Snake", power: "Invisibility", color: "#2FBF8F", grade: "strong", evolves: "pig",
      improve: "Take the lead more often instead of waiting for a bet — keep the reads.",
      tagline: "Looks passive. Sets traps.",
      signals: ["Raise-to-call ratio under 0.6", "Check-raise 12%+", "Wins 55%+ of showdowns", "EV win rate 0 or better"],
      meaning: "You look passive, and that's the trap. You let people bet into you, then you strike. When you show a hand, it's usually the winner.",
      edge: "Nobody sees it coming. Your check-raises are twice the table average.",
      leak: "When they don't bet, your trap catches nothing. You win less without showdown than you should.",
      next: "Take the lead more often instead of waiting. Keep the reads — that's the Pig." },
    { id: "rooster", name: "Rooster", power: "Levitation", color: "#F0C75E", grade: "strong", evolves: "dragon",
      improve: "Value-bet your medium hands more so the showdown money adds to the steals.",
      tagline: "Wins pots without cards.",
      signals: ["Non-showdown winnings +3 or better", "Steals 40%+", "Showdowns under 24%", "EV win rate 0 or better"],
      meaning: "You win pots without showing cards. Position, steals, taking the pot on the turn when they check — that's where your money comes from.",
      edge: "You don't need good cards to win. Two thirds of your profit came from folds.",
      leak: "Against people who don't fold, this stops working. Your showdown winnings are thin.",
      next: "Value-bet your medium hands more. Add showdown money to the steals and you become the Dragon." },
    { id: "pig", name: "Pig", power: "Heat vision", color: "#FF6B8A", grade: "strong", evolves: "tiger",
      improve: "Tighten up before the flop and keep the reads.",
      tagline: "Reads hands. Calls right, folds right.",
      signals: ["Wins 57%+ of showdowns", "River calls right 55%+", "Bluffs caught 40% or less", "EV win rate 0 or better"],
      meaning: "You see through bets. Your calls with marginal hands are right more often than not, your big folds are right, and your bluffs get through.",
      edge: "Reads. You win 6 of 10 showdowns — the table wins 5.",
      leak: "You lean on reads instead of structure. Your preflop game is looser than it needs to be.",
      next: "Tighten up before the flop and keep the reads. That's a Tiger with x-ray eyes." },
    { id: "horse", name: "Horse", power: "Healing", color: "#E8E8F0", grade: "strong", evolves: null,
      improve: "Change nothing. Keep the same decisions — the cards even out.",
      tagline: "Healthy game. Cold deck.",
      signals: ["EV win rate +1 or better", "Luck −3 buy-ins or worse"],
      meaning: "Your game is healthy. The cards weren't. Over the last 1 000 hands you should be at +$310 by the odds — you're at −$90. That $400 is variance, and variance evens out.",
      edge: "Your decisions are in the plus. The cards are not.",
      leak: "This is where tilt starts. Three of your last five sessions had a spike after a big loss.",
      next: "Change nothing. Keep playing the same way and the Tiger comes back on its own." },
    { id: "rat", name: "Rat", power: "Motion", color: "#A7B0BE", grade: "even", evolves: "tiger",
      improve: "Fix one leak from “Where the money went” and take breaks after hand 400 of a session.",
      tagline: "Volume. Steady. Ahead.",
      signals: ["8 000+ hands in 30 days", "EV win rate 0 to +3", "No specialist signal fired"],
      meaning: "You play a lot, you play steady, and you come out ahead. No big holes, no big edge — volume does the work.",
      edge: "Consistency. 9 400 hands this month with no session below −2 buy-ins.",
      leak: "Autopilot. Your win rate drops by 6 bb/100 after hand 400 of a session.",
      next: "Fix one leak from “Where the money went” and the Rat becomes a Tiger." },
    { id: "dog", name: "Dog", power: "Immortality", color: "#6FA8FF", grade: "even", evolves: "snake",
      improve: "Open more hands from the button and cutoff — patience plus a little pressure.",
      tagline: "The rock. Rarely loses, rarely wins.",
      signals: ["VPIP under 19", "Showdowns under 26%", "EV win rate −1 to +1"],
      meaning: "You wait. You play very few hands and almost never lose big. You also almost never win big.",
      edge: "You don't die. No session this month cost you more than a buy-in.",
      leak: "Blinds. Half of what you lose is just sitting there. And when you finally bet, everyone folds.",
      next: "Open more hands from the button and cutoff. Patience plus a little pressure is the Snake." },
    { id: "monkey", name: "Monkey", power: "Shape-shifting", color: "#9B6BFF", grade: "leak", evolves: "dragon",
      improve: "Bluff half as often, and only against players who fold.",
      tagline: "Aggressive, chaotic, paying for it.",
      signals: ["Raise-to-call ratio 0.6+", "Bluffs over 30% or caught over 55%", "EV win rate under +1"],
      meaning: "You're aggressive and unpredictable — and right now that costs you. Your style changes from session to session, and your bluffs get called.",
      edge: "Courage. You're not afraid to fire, and that's the hardest thing to teach.",
      leak: "Bluffs that get called — 38% of everything you lost. You bluff people who never fold.",
      next: "Bluff half as often, and only against players who fold. Same fire, better targets — that's the Dragon." },
    { id: "rabbit", name: "Rabbit", power: "Speed", color: "#8FE3FF", grade: "leak", evolves: "rooster",
      improve: "Enter fewer hands, then fight for the ones you enter.",
      tagline: "Jumps in. Jumps out.",
      signals: ["VPIP 22+", "Folds to flop bet 58%+ or to 3-bet 65%+", "Showdowns under 22%", "EV win rate below 0"],
      meaning: "You jump into a lot of hands and jump out at the first sign of trouble. You pay to see the flop, then leave the pot to someone else.",
      edge: "You don't sink money after the flop. Your losses are small.",
      leak: "Too many small ones. One bet is enough to take the pot from you — and the table knows.",
      next: "Enter fewer hands, then fight for the ones you enter. Speed plus position is the Rooster." },
    { id: "sheep", name: "Sheep", power: "Astral projection", color: "#9A93B5", grade: "leak", evolves: "ox",
      improve: "Every time you want to call, choose: raise or fold.",
      tagline: "Follows the action. Calls it down.",
      signals: ["Raise-to-call ratio under 0.5", "Showdowns 30%+", "Wins under 48% of showdowns", "EV win rate below 0"],
      meaning: "You follow the action instead of leading it. You call, and you call again, and at showdown the other hand is better more often than not.",
      edge: "Nobody bluffs you. Against wild players you come out ahead.",
      leak: "Calls with the worse hand — 41% of what you lost. Most of them should have been a fold; some should have been a raise.",
      next: "Every time you want to call, choose: raise or fold. Strength instead of following — that's the Ox." },
  ];
  const ANIMAL = {}; ANIMALS.forEach((a) => { ANIMAL[a.id] = a; });

  // ── silhouettes: one solid shape each, viewBox 0 0 100 100, currentColor ─────────
  const SIL = {
    tiger: '<path d="M50 20a34 34 0 1 0 0 68a34 34 0 1 0 0-68z"/><circle cx="22" cy="28" r="12"/><circle cx="78" cy="28" r="12"/><path d="M18 58L4 52l10 12L2 68l16 12zM82 58l14-6-10 12 12 4-16 12z"/><g class="dt-hole"><circle cx="22" cy="28" r="5"/><circle cx="78" cy="28" r="5"/><rect x="42" y="30" width="16" height="3.5" rx="1.5"/><rect x="39" y="37" width="22" height="3.5" rx="1.5"/><rect x="44" y="44" width="12" height="3.5" rx="1.5"/><ellipse cx="37" cy="56" rx="5" ry="4"/><ellipse cx="63" cy="56" rx="5" ry="4"/><path d="M43 66h14l-7 8z"/><path d="M20 48l8 6-2 3-8-6zM80 48l-8 6 2 3 8-6zM18 66l8 3-1 3-8-3zM82 66l-8 3 1 3 8-3z"/></g>',
    dragon: '<path d="M30 40c-2-14 6-24 16-24l6-10 4 12 8-10 0 12c10 4 20 12 30 20l2 8-16 4 10 10-18-2c-4 6-12 10-20 8l-8 10-2-12-8 8-2-12-10 6 4-12c-2-6 0-12 4-16z"/><g class="dt-hole"><circle cx="58" cy="36" r="4"/><circle cx="88" cy="44" r="2"/></g>',
    ox: '<path fill-rule="evenodd" d="M50 30c-10 0-18 4-22 11-5-2-11-6-13-14-3 3-3 9 0 15-6-3-12-8-15-14-1 12 6 24 22 28-2 8-1 16 5 22 6 7 15 10 23 10s17-3 23-10c6-6 7-14 5-22 16-4 23-16 22-28-3 6-9 11-15 14 3-6 3-12 0-15-2 8-8 12-13 14-4-7-12-11-22-11zm-11 42a4 4 0 1 1 0 1zm22 0a4 4 0 1 1 0 1z"/>',
    snake: '<path d="M68 10c10 0 16 6 16 13 0 6-4 9-10 12-5 2-10 3-10 8 0 3 3 5 8 7 13 5 22 12 22 24 0 12-10 20-24 20H30c-9 0-16-4-16-11 0-6 6-10 15-10h34c6 0 9-2 9-5 0-4-4-6-10-8-13-4-22-10-22-22 0-9 6-15 15-15h13zm6 11a3 3 0 1 0 0 1z"/><path d="M52 82c-2 6-6 10-14 10H26c-6 0-10 3-10 6h34c6 0 10-4 12-10z"/>',
    rooster: '<path d="M40 30c0-10 6-18 14-18-2-8 6-10 8-2 2-8 10-8 10 0 6-6 12-2 8 6 6 6 10 14 8 22l12 6-12 4c0 6-6 10-10 8 2 6-2 12-8 10-4 10-14 18-26 20l-4 10-6-12c-8-4-12-14-8-24-4-10 2-24 14-30z"/><g class="dt-hole"><circle cx="72" cy="36" r="3.5"/></g>',
    pig: '<path fill-rule="evenodd" d="M50 22c-8 0-15 2-20 6-6-6-14-10-20-8-2 8 0 16 6 22-3 6-4 12-4 18 0 16 16 28 38 28s38-12 38-28c0-6-1-12-4-18 6-6 8-14 6-22-6-2-14 2-20 8-5-4-12-6-20-6zM33 46a4 4 0 1 1 0 1zm34 0a4 4 0 1 1 0 1zM50 60c-9 0-14 4-14 10s5 10 14 10 14-4 14-10-5-10-14-10zm-5 7a2.5 2.5 0 1 1 0 1zm10 0a2.5 2.5 0 1 1 0 1z"/>',
    horse: '<path d="M30 28l6-20 8 18 6-16 4 26c10 2 20 10 28 22 8 8 14 16 14 26 0 8-6 12-14 10-6 0-10-4-12-10-8-4-14-10-20-16-4 10-10 20-16 32l-10 4c-2-16-6-36-2-52l-8-4 8-4-10-6 12 0-6-8z"/><g class="dt-hole"><circle cx="60" cy="44" r="4"/><circle cx="86" cy="78" r="2.5"/></g>',
    rat: '<path d="M24 44c6-14 20-16 32-10l40 18-36 8c-6 10-20 14-30 8-8-6-10-14-6-24z"/><circle cx="38" cy="26" r="15"/><circle cx="95" cy="52" r="3.5"/><path d="M26 72C8 76 6 92 22 94" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><g class="dt-hole"><circle cx="38" cy="26" r="7"/><circle cx="62" cy="46" r="3.5"/></g>',
    dog: '<path d="M50 14c-6 0-12 2-16 6-8 0-14 6-16 14-6 6-8 18-4 30 2 8 6 12 12 12 2 0 4 0 6-2 4 6 10 10 18 10s14-4 18-10c2 2 4 2 6 2 6 0 10-4 12-12 4-12 2-24-4-30-2-8-8-14-16-14-4-4-10-6-16-6zM40 44a4 4 0 1 1 0 1zm20 0a4 4 0 1 1 0 1zM50 56c-5 0-8 2-8 6 0 3 3 5 8 5s8-2 8-5c0-4-3-6-8-6z"/>',
    monkey: '<path fill-rule="evenodd" d="M50 10c-4 0-7 3-8 6-14 2-24 12-24 26-6 0-12 4-12 12s6 12 12 12c4 12 16 20 32 20s28-8 32-20c6 0 12-4 12-12s-6-12-12-12c0-14-10-24-24-26-1-3-4-6-8-6zm0 22c-10 0-18 6-18 14 0 10 8 18 18 18s18-8 18-18c0-8-8-14-18-14zm-7 10a3 3 0 1 1 0 1zm14 0a3 3 0 1 1 0 1zm-7 10c-4 0-6 2-6 4h12c0-2-2-4-6-4z"/>',
    rabbit: '<path d="M36 4c6 0 10 8 10 26v6c2 0 6 0 8 0v-6c0-18 4-26 10-26s8 12 8 26c0 6-2 12-6 16 12 4 20 14 20 26 0 12-16 22-36 22S14 84 14 72c0-12 8-22 20-26-4-4-6-10-6-16C28 16 30 4 36 4zm4 60a4 4 0 1 0 0 1zm20 0a4 4 0 1 0 0 1zM50 74c-4 0-6 2-6 4s2 3 6 3 6-1 6-3-2-4-6-4z"/>',
    sheep: '<path fill-rule="evenodd" d="M50 14c-5 0-9 2-11 5-5-2-11-1-14 3-4-3-10-2-13 2-3 4-2 9 1 12-4 3-6 8-4 12-3 4-2 10 2 13 0 5 4 9 9 10 2 5 7 8 12 8 3 3 7 5 12 5h12c5 0 9-2 12-5 5 0 10-3 12-8 5-1 9-5 9-10 4-3 5-9 2-13 2-4 0-9-4-12 3-3 4-8 1-12-3-4-9-5-13-2-3-4-9-5-14-3-2-3-6-5-11-5zm0 22c-9 0-16 6-16 16 0 12 7 20 16 20s16-8 16-20c0-10-7-16-16-16zm-6 12a3 3 0 1 1 0 1zm12 0a3 3 0 1 1 0 1zM14 44c-8 2-12 10-8 18 4 6 12 6 16 0-6 0-10-6-8-12 0-2 0-4 0-6zm72 0c8 2 12 10 8 18-4 6-12 6-16 0 6 0 10-6 8-12 0-2 0-4 0-6z"/>',
  };

  // ── personas (section 12.2) ───────────────────────────────────────────────────
  const sig = (key, value, zone, role, sentence) => ({ key, value, zone, role, sentence });
  const TIGER = {
    id: "tiger", label: "Tiger · Active", discipline: "cash", window: "LAST 1 000 HANDS", sampleHands: 1000, days: 30,
    state: "active", animal: "tiger", underlying: null, reason: "Your aggression started paying.",
    signals: [
      sig("VPIP", "24", 1, "edge", "You play 24 of 100 hands. That's normal for 6-max. The table plays about 25."),
      sig("RATIO", "0.71", 3, "edge", "When you enter a hand, you come in raising 7 times out of 10. You take the lead."),
      sig("BLUFF", "19%", 2, "edge", "1 in 5 of your river bets is a pure bluff. Right in the middle."),
      sig("W$SD", "58%", 4, "neutral", "When you get to showdown, you win 58%. When you show cards, they're usually the best."),
      sig("STEAL", "27%", 1, "leak", "From the button and cutoff you attack the blinds 27% — low. That's free money left behind."),
      sig("EV100", "+7.3", 4, "edge", "If every all-in had gone by the odds, you'd be at +$310. That's a crushing rate."),
    ],
    closeness: { dragon: .8, ox: .6, rooster: .5, pig: .5, snake: .25, rat: .33, dog: 0, monkey: .33, rabbit: 0, sheep: 0, horse: .5, tiger: 1 },
    missing: { dragon: ["Open more: 24 → 28+"], ox: ["Bluff less: 19% → under 12%", "Win more showdowns: 58% → 55%+ ✓"], rooster: ["Steal more: 27% → 40%+", "Showdowns: 34% → under 24%"], pig: ["River calls: 51% → 55%+", "Bluffs caught: 57% → under 40%"], snake: ["Check-raise: 8% → 12%+", "Ratio 0.71 → under 0.6"], rat: ["Volume: 1 000 → 8 000+ hands"], dog: ["VPIP 24 → under 19", "Showdowns 34% → under 26%"], monkey: ["Bluff more: 19% → over 30%"], rabbit: ["Fold more: 41% → 58%+"], sheep: ["Ratio 0.71 → under 0.5"], horse: ["Luck −4 ✓ · this is the Horse's door"] },
    money: { bb100: -2.1, ev100: 7.3, luckBI: -4.0, real: "−$90", ev: "+$310", diff: "$400", red: 1.2, blue: 6.1,
      loss: [["BLUFF_CAUGHT", "Bluffs that got called", .21, "−1 040 bb"], ["BAD_BEAT", "Got outdrawn", .24, "−1 190 bb"], ["COOLER", "Coolers", .18, "−890 bb"], ["BLINDS", "Blinds and antes", .14, "−690 bb"], ["BAD_RANGE", "Hands you shouldn't have played", .09, "−445 bb"], ["DRAW_OVERPAY", "Paid too much for draws", .08, "−395 bb"], ["STATION", "Called with the worse hand", .06, "−300 bb"]],
      win: [["VALUE", "Best hand at showdown", .52, "+3 010 bb"], ["STEAL", "Uncontested pots", .17, "+985 bb"], ["PRESSURE", "They gave up postflop", .15, "+870 bb"], ["BLUFF_WON", "Bluffs that worked", .11, "+640 bb"], ["LUCK_WON", "Got there", .05, "+290 bb"]] },
    showdown: { went: 312, won: 181, pct: 58, lostMostWith: "top pair, weak kicker", lostSecond: "two pair vs a set" },
    bluffs: { count: 96, through: 41, caught: 55, caughtPct: 57 },
    tilt: { events: 1, last: "Sep 19" },
    edge: { key: "RATIO", value: "0.71", zone: 3, text: "Balance. Opponents who try to exploit you find nothing to grab." },
    leak: { key: "STEAL", value: "27%", zone: 1, text: "You attack the blinds 27% of the time. Against this table, 35 would pay." },
    improve: "Attack the blinds more often: 27% → 35%.",
    next: { animal: "dragon", key: "VPIP", value: "24", zone: 1, text: "Open a few more hands from the button. If your win rate holds, the Dragon is next." },
    history: [["sheep", "2 Jun", "14 Jul"], ["rabbit", "14 Jul", "20 Aug"], ["tiger", "20 Aug", null]],
    luckLine: { ev: [0, 1, 1.5, 2.4, 3, 3.8, 4.2, 5, 5.6, 6.4, 7, 7.3], real: [0, .6, 1.2, .4, 1.5, .2, -1, -.4, -2, -1.2, -2.6, -2.1] },
  };
  const HORSE = Object.assign({}, TIGER, {
    id: "horse", label: "Horse · over Tiger", state: "active", animal: "horse", underlying: "tiger", reason: "Your game is +$310 by the odds. The cards owe you $400.",
    edge: { key: "EV100", value: "+7.3", zone: 4, text: "Your decisions are in the plus. By the odds you're +$310 over these hands." },
    leak: { key: "TILT", value: "3 of 5", zone: 3, text: "This is where tilt starts. Three of your last five sessions had a spike after a big loss." },
    improve: "Change nothing. After a big loss take a break instead of playing on.",
    next: { animal: "tiger", key: "LUCK", value: "−4 BI", zone: 0, text: "Change nothing. When luck comes back to normal, the Tiger returns on its own." },
    tilt: { events: 2, last: "Sep 20" },
  });
  const SHEEP = {
    id: "sheep", label: "Sheep · Shadow · MTT", discipline: "mtt", window: "LAST 1 000 HANDS", sampleHands: 1000, days: 30, tourneys: 96,
    state: "shadow", animal: "sheep", underlying: null, reason: "Big losses are changing how you play.",
    signals: [
      sig("RATIO", "0.42", 1, "leak", "When you enter a hand, you come in raising 4 times out of 10. You follow more than you lead."),
      sig("WTSD", "36%", 4, "leak", "Once you see a flop, you go all the way to showdown 36% of the time. That's a lot — you don't let go."),
      sig("W$SD", "44%", 1, "leak", "When you get to showdown, you win 44%. Normal is about 50. The other hand is better more often than not."),
      sig("F3B", "38%", 0, "edge", "When someone re-raises you, you fold 38% — stubborn. Nobody pushes you off a hand cheaply."),
      sig("EV100", "−3.4", 1, "neutral", "If every all-in had gone by the odds, you'd still be at −$140 over these tournaments."),
      sig("TILT", "3", 3, "leak", "3 tilt spikes in the last 1 000 hands. After a big loss you play 11 more hands per 100."),
    ],
    closeness: { ox: .5, tiger: .2, dragon: 0, snake: .5, rooster: 0, pig: .25, horse: 0, rat: .33, dog: .33, monkey: 0, rabbit: .25, sheep: 1 },
    missing: { ox: ["Raise or fold: ratio 0.42 → 0.6+", "Win more showdowns: 44% → 55%+"], tiger: ["Ratio 0.42 → 0.65+", "Showdown wins 44% → 48%+"], snake: ["Check-raise: 5% → 12%+", "Showdown wins 44% → 55%+"], rat: ["EV win rate −3.4 → 0+"], dog: ["VPIP 29 → under 19", "Showdowns 36% → under 26%"], pig: ["Showdown wins 44% → 57%+"], rabbit: ["Fold more on the flop: 31% → 58%+"], dragon: ["Ratio 0.42 → 0.65+"], rooster: ["Steal 22% → 40%+"], monkey: ["Ratio 0.42 → 0.6+"], horse: ["EV win rate −3.4 → +1"] },
    money: { bb100: -6.8, ev100: -3.4, luckBI: -2.2, real: "−$310", ev: "−$140", diff: "$170", red: -4.1, blue: -2.7,
      loss: [["STATION", "Called with the worse hand", .41, "−2 380 bb"], ["DRAW_OVERPAY", "Paid too much for draws", .17, "−990 bb"], ["BAD_BEAT", "Got outdrawn", .12, "−700 bb"], ["COOLER", "Coolers", .1, "−580 bb"], ["BLINDS", "Blinds and antes", .09, "−520 bb"], ["BAD_RANGE", "Hands you shouldn't have played", .08, "−460 bb"], ["BLUFF_CAUGHT", "Bluffs that got called", .03, "−175 bb"]],
      win: [["VALUE", "Best hand at showdown", .61, "+2 450 bb"], ["LUCK_WON", "Got there", .14, "+560 bb"], ["PRESSURE", "They gave up postflop", .12, "+480 bb"], ["STEAL", "Uncontested pots", .1, "+400 bb"], ["BLUFF_WON", "Bluffs that worked", .03, "+120 bb"]] },
    showdown: { went: 488, won: 215, pct: 44, lostMostWith: "second pair", lostSecond: "top pair, weak kicker" },
    bluffs: { count: 22, through: 9, caught: 13, caughtPct: 59 },
    tilt: { events: 3, last: "Sep 21" },
    edge: { key: "F3B", value: "38%", zone: 0, text: "Nobody bluffs you. Against wild players you come out ahead." },
    leak: { key: "STATION", value: "41%", zone: 4, text: "Called with the worse hand — 41% of what you lost." },
    improve: "Every time you want to call, choose: raise or fold. Start with the river.",
    next: { animal: "ox", key: "RATIO", value: "0.42", zone: 1, text: "Every time you want to call, choose: raise or fold. Strength instead of following — that's the Ox." },
    history: [["rabbit", "3 May", "18 Jun"], ["sheep", "18 Jun", null]],
    luckLine: { ev: [0, -.4, -.8, -1, -1.6, -2, -2.2, -2.8, -3, -3.2, -3.5, -3.4], real: [0, -.2, -1.4, -2, -2.4, -3.6, -4, -4.8, -5.6, -6, -6.4, -6.8] },
  };
  const DORMANT = {
    id: "dormant", label: "Dormant · Spin", discipline: "spin", window: "LAST 1 000 HANDS", sampleHands: 0, spins: 23, spinsNeed: 60, days: 30,
    state: "dormant", animal: null, underlying: null, reason: "",
    signals: [], closeness: {}, missing: {}, money: null, showdown: null, bluffs: null, tilt: { events: 0 }, history: [], luckLine: null,
  };
  const PERSONAS = [TIGER, HORSE, SHEEP, DORMANT];
  // carousel-only: the Dragon shown Awakened as a goal
  const AWAKENED_DEMO = "dragon";

  // ── luck ladder: the talisman is tied to the luck level (real result vs EV over the last 10 showdowns, in buy-ins) ──
  // cold → hot; each step has a buy-in range and a one-line reading
  const LUCK_DEGREES = ["JINXED", "UNLUCKY", "EVEN", "LUCKY", "CHARMED", "GOLDEN"];
  const LUCK_LEVELS = [
    { animal: "horse",   range: "≤ −300",       bb: -420, zone: 0, line: "Jinxed. The deck owes you — a lot." },
    { animal: "dog",     range: "−300 … −100",  bb: -260, zone: 1, line: "Unlucky. Your good hands keep losing at showdown." },
    { animal: "ox",      range: "−100 … +100", bb: 40, zone: 2, line: "Even. What you see is your game." },
    { animal: "tiger",   range: "+100 … +300",  bb: 240,  zone: 3, line: "Lucky. A little above the odds." },
    { animal: "rooster", range: "+300 … +450",    bb: 400,  zone: 4, line: "Charmed. Your draws keep getting there." },
    { animal: "dragon",  range: "≥ +450",       bb: 500,  zone: 5, line: "Golden. This is as hot as it gets." },
  ];
  const LUCK_WINDOW = { showdowns: 10, hands: 100 };
  const LUCK_FORMING = { done: 6, need: 10 };
  const LUCK_HISTORY = [["dog", "2 Jun", "14 Jul"], ["ox", "14 Jul", "20 Aug"], ["tiger", "20 Aug", null]];
  // ── Heat & Bad Beats (section 14) ─────────────────────────────────────────────
  // one verdict per luck step — luck only, no money and no game-quality claims
  const LUCK_VERDICTS = [
    { verdict: "Run over. This isn't your decisions — the deck is. Keep the same line and it comes back.", frame: "pearl" },
    { verdict: "Below the odds. Over a hundred showdowns that happens. Nothing to fix here.", frame: "pearl" },
    { verdict: "The deck is fair right now. What you see is your game.", frame: "hairline" },
    { verdict: "A little above the odds. Nothing to change.", frame: "hairline" },
    { verdict: "Well above the odds. Enjoy it — don't count on it.", frame: "gold" },
    { verdict: "As hot as it gets. It always comes back to even, so keep playing the same way.", frame: "gold" },
  ];
  const HEAT_ZONES = ["RUN OVER", "UNLUCKY", "EVEN", "LUCKY", "ON A ROLL"];
  const c = (r, s) => ({ r, s });
  const ME = "SASHA02";
  const MY_BEATS = [
    { id: "mb1", win: "QUADS", lose: "FULL HOUSE", eq: 99.9, brutal: true, disc: "CASH", where: "Hold'em $2/$5", time: "Sep 19", pot: "$1 240", board: [c("K", "club"), c("9", "club"), c("4", "spade"), c("2", "heart"), c("2", "club")], winBoard: [0, 3, 4], victim: { name: ME, cards: [c("K", "spade"), c("K", "heart")], eq: "99.9%", me: true }, winner: { name: "RiverStone", cards: [c("2", "spade"), c("2", "diamond")], eq: "0.1%" }, street: "FLOP" },
    { id: "mb2", win: "FLUSH", lose: "SET", eq: 91.2, brutal: false, disc: "MTT", where: "GOPC #188", time: "Sep 14", pot: "62.4K", board: [c("8", "spade"), c("8", "heart"), c("3", "spade"), c("J", "spade"), c("6", "diamond")], winBoard: [0, 2, 3], victim: { name: ME, cards: [c("8", "diamond"), c("A", "club")], eq: "91.2%", me: true }, winner: { name: "mokuoha", cards: [c("Q", "spade"), c("4", "spade")], eq: "8.8%" }, street: "TURN" },
    { id: "mb3", win: "STRAIGHT", lose: "TWO PAIR", eq: 88.6, brutal: false, disc: "SPIN", where: "Spin & Win $3", time: "Sep 11", pot: "1 500", board: [c("J", "spade"), c("10", "heart"), c("3", "club"), c("Q", "diamond"), c("8", "heart")], winBoard: [0, 1, 3], victim: { name: ME, cards: [c("J", "club"), c("10", "diamond")], eq: "88.6%", me: true }, winner: { name: "aegbtc", cards: [c("9", "club"), c("K", "diamond")], eq: "11.4%" }, street: "FLOP" },
    { id: "mb4", win: "FLUSH", lose: "STRAIGHT", eq: 84.1, brutal: false, disc: "CASH", where: "PLO $1/$2", time: "Sep 6", pot: "$860", board: [c("6", "diamond"), c("7", "diamond"), c("8", "club"), c("2", "diamond"), c("A", "spade")], winBoard: [0, 1, 3], victim: { name: ME, cards: [c("9", "spade"), c("10", "club"), c("A", "heart"), c("Q", "heart")], eq: "84.1%", me: true }, winner: { name: "ShabbaMatty", cards: [c("K", "diamond"), c("3", "diamond"), c("Q", "club"), c("J", "heart")], eq: "15.9%" }, street: "TURN" },
    { id: "mb5", win: "SET", lose: "OVERPAIR", eq: 81.5, brutal: false, disc: "MTT", where: "Sunday Major", time: "Aug 31", pot: "48.2K", board: [c("5", "heart"), c("Q", "club"), c("2", "spade"), c("5", "club"), c("J", "heart")], winBoard: [0, 3], victim: { name: ME, cards: [c("A", "diamond"), c("A", "heart")], eq: "81.5%", me: true }, winner: { name: "TRAMOLLERO", cards: [c("5", "diamond"), c("6", "spade")], eq: "18.5%" }, street: "FLOP" },
  ];
  const MY_SUCKOUTS = [
    { id: "ms1", win: "QUADS", lose: "FULL HOUSE", eq: 97.7, brutal: true, disc: "CASH", where: "Hold'em $2/$5", time: "Sep 17", pot: "$2 140", board: [c("K", "heart"), c("K", "diamond"), c("9", "club"), c("9", "spade"), c("4", "heart")], winBoard: [2, 3], victim: { name: "KingThreeOff", cards: [c("K", "spade"), c("A", "club")], eq: "97.7%" }, winner: { name: ME, cards: [c("9", "heart"), c("9", "diamond")], eq: "2.3%", me: true }, street: "TURN", delivered: true },
    { id: "ms2", win: "FLUSH", lose: "SET", eq: 95.2, brutal: true, disc: "MTT", where: "GOPC #201", time: "Sep 12", pot: "93.85K", board: [c("7", "club"), c("A", "club"), c("2", "spade"), c("9", "spade"), c("10", "spade")], winBoard: [2, 3, 4], victim: { name: "hiphopdawg99", cards: [c("7", "heart"), c("7", "diamond")], eq: "94.7%" }, winner: { name: ME, cards: [c("A", "spade"), c("Q", "spade")], eq: "5.3%", me: true }, street: "FLOP", delivered: true },
    { id: "ms3", win: "STRAIGHT", lose: "TWO PAIR", eq: 86.3, brutal: false, disc: "CASH", where: "Hold'em $1/$2", time: "Sep 8", pot: "$410", board: [c("9", "heart"), c("10", "club"), c("A", "spade"), c("Q", "heart"), c("J", "club")], winBoard: [0, 1, 3, 4], victim: { name: "TRAMOLLERO", cards: [c("A", "diamond"), c("10", "spade")], eq: "86.3%" }, winner: { name: ME, cards: [c("K", "spade"), c("8", "club")], eq: "13.7%", me: true }, street: "FLOP", delivered: true },
    { id: "ms4", win: "TWO PAIR", lose: "OVERPAIR", eq: 83.4, brutal: false, disc: "SPIN", where: "Spin & Win $1", time: "Sep 3", pot: "500", board: [c("J", "diamond"), c("4", "club"), c("8", "spade"), c("4", "heart"), c("J", "spade")], winBoard: [0, 1, 3, 4], victim: { name: "mokuoha", cards: [c("Q", "spade"), c("Q", "heart")], eq: "83.4%" }, winner: { name: ME, cards: [c("J", "club"), c("3", "diamond")], eq: "16.6%", me: true }, street: "FLOP", delivered: true },
    { id: "ms5", win: "STRAIGHT", lose: "SET", eq: 80.9, brutal: false, disc: "MTT", where: "Daily Deep", time: "Aug 27", pot: "21.6K", board: [c("6", "spade"), c("6", "heart"), c("9", "club"), c("7", "diamond"), c("8", "spade")], winBoard: [2, 3, 4], victim: { name: "aegbtc", cards: [c("6", "diamond"), c("6", "club")], eq: "80.9%" }, winner: { name: ME, cards: [c("10", "heart"), c("5", "spade")], eq: "19.1%", me: true }, street: "TURN", delivered: true },
  ];
  const FAQ = [
    ["What counts as a bad beat here?", "All-in with 80% equity or more, and lost. Brutal is 95% and up. A suckout is the mirror: all-in with 20% or less, and won."],
    ["How is luck different from just wins and losses?", "We compare what you won to what the odds said you should win. Ten losses with 30% equity each isn't bad luck. Ten losses with 90% is."],
    ["How is my luck level counted?", "Over your last 10 showdowns we add up the difference between the real result and the one the odds called for. The sum, in buy-ins, is the number on the scale."],
    ["Why does my talisman change?", "There are six steps of luck, from jinxed to golden. Each step has its own talisman, so when your level moves to another step, the talisman changes with it."],
    ["Which hands count?", "Only hands that reached a showdown: there the cards are open and the equity is known. Hands where everyone folded don't count."],
    ["Does Run it twice count?", "Each run counts as a share of one hand: two runs — half each, three runs — a third each."],
  ];
  window.DOT = { METRICS, ANIMALS, ANIMAL, SIL, PERSONAS, AWAKENED_DEMO, LUCK_VERDICTS, HEAT_ZONES, MY_BEATS, MY_SUCKOUTS, FAQ, LUCK_LEVELS, LUCK_DEGREES, LUCK_WINDOW, LUCK_FORMING, LUCK_HISTORY };
})();

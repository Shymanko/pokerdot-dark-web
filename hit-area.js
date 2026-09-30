/* Збільшує зону натискання дрібних тап-цілей, не чіпаючи їхній вигляд.

   Правка A1 від СЕО (друга ітерація): раніше додавали фіксовані +8 px з
   кожного боку — «ЛИЦЕНЗИИ» 57×10 ставало 66×24, тобто все одно менше
   норми Apple 44×44. Тепер зона ДОТЯГУЄТЬСЯ до 44 по кожній осі окремо:
   скільки бракує — стільки й додаємо (порівну з обох боків).

   Ціль — не лише <button>: футерні посилання і CTA у банерах намальовані
   спанами з cursor:pointer. Беремо і їх, але пропускаємо все, що лежить
   усередині кнопки (зона самої кнопки вже покриває підпис).

   Живе тільки в білді для тестерів, оригінал проекту не чіпає. */
(function () {
  "use strict";

  var MIN = 44;

  var css = document.createElement("style");
  css.textContent =
    ".px-hit{position:relative}" +
    ".px-hit::before{content:'';position:absolute;" +
    "top:calc(-1*var(--px-hy,0px));bottom:calc(-1*var(--px-hy,0px));" +
    "left:calc(-1*var(--px-hx,0px));right:calc(-1*var(--px-hx,0px));" +
    "border-radius:inherit}";
  document.head.appendChild(css);

  function grow(el, r) {
    var hx = Math.max(0, Math.ceil((MIN - r.width) / 2));
    var hy = Math.max(0, Math.ceil((MIN - r.height) / 2));
    if (!hx && !hy) return;
    el.style.setProperty("--px-hx", hx + "px");
    el.style.setProperty("--px-hy", hy + "px");
    el.classList.add("px-hit");
  }

  function widen(root) {
    var scope = root || document;

    // 1. усі кнопки, менші за 44 по будь-якій осі
    var btns = scope.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      if (b.classList.contains("px-hit")) continue;
      var r = b.getBoundingClientRect();
      if (r.width && (r.width < MIN || r.height < MIN)) grow(b, r);
    }

    // 2. клікабельні span/div/a поза кнопками (футер, CTA банерів)
    var els = scope.querySelectorAll('a,[role="button"],span,div');
    for (var j = 0; j < els.length; j++) {
      var el = els[j];
      if (el.classList.contains("px-hit")) continue;
      if (el.closest("button")) continue;                 // підпис усередині кнопки
      var q = el.getBoundingClientRect();
      if (!q.width || q.width > 220 || q.height >= MIN && q.width >= MIN) continue;
      if (q.height >= MIN && q.width >= MIN) continue;
      if (getComputedStyle(el).cursor !== "pointer") continue;
      if (el.querySelector("button")) continue;           // контейнер із кнопками
      grow(el, q);
    }
  }

  // Екрани з'являються і зникають увесь час — стежимо за деревом.
  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; widen(); });
  }

  function start() {
    widen();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();

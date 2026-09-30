/* Fixed 402 × 874 prototype. Scale the complete artboard; never reflow it. */
(function () {
  var W = 402, H = 874;

  /* ── лоадер, поки компілюється прототип ───────────────────────── */
  var ov = document.createElement("div");
  ov.id = "pd-loader";
  ov.innerHTML =
    '<div class="pd-l-in">' +
      '<img class="pd-l-logo" src="logo.svg" alt="PokerDot" width="752" height="180">' +
      '<div class="pd-l-txt">Завантажуємо прототип</div>' +
      '<div class="pd-l-sub">кілька секунд</div>' +
    '</div>';
  var st = document.createElement("style");
  st.textContent =
    '#pd-loader{position:fixed;inset:0;z-index:9999;background:#050505;display:flex;' +
    'align-items:center;justify-content:center;transition:opacity .35s ease}' +
    '#pd-loader.gone{opacity:0;pointer-events:none}' +
    '.pd-l-in{text-align:center;font-family:"Chakra Petch",ui-monospace,monospace}' +
    '.pd-l-logo{width:186px;height:auto;display:block;margin:0 auto 26px;' +
    'filter:drop-shadow(0 0 26px rgba(224,31,32,.3));animation:pd-l-p 1.7s ease-in-out infinite}' +
    '@keyframes pd-l-p{0%,100%{opacity:1}50%{opacity:.5}}' +
    '.pd-l-txt{font-size:15px;letter-spacing:.14em;color:#fff;text-transform:uppercase}' +
    '.pd-l-sub{font-size:13px;letter-spacing:.06em;color:rgba(255,255,255,.45);margin-top:10px}' +
    'html,body{width:100%;height:100%;margin:0;overflow:hidden}' +
    '.stage{position:fixed!important;inset:0;min-height:0!important;height:100vh;height:100dvh;padding:0!important;gap:0!important;overflow:hidden;display:flex;align-items:center;justify-content:center}' +
    '#device-host{width:402px!important;height:874px!important;min-width:402px;max-width:402px;min-height:874px;max-height:874px;flex:0 0 auto;aspect-ratio:402/874}' +
    '.brand-mark{display:none!important}';
  document.head.appendChild(st);
  if (document.body) document.body.appendChild(ov);

  function done() {
    ov.classList.add("gone");
    setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, 400);
  }
  var tries = 0;
  var poll = setInterval(function () {
    var host = document.getElementById("device-host");
    tries++;
    if ((host && host.firstChild) || tries > 400) { window.__pdReady = Math.round(performance.now()); clearInterval(poll); setTimeout(done, 250); }
  }, 100);

  /* ── масштаб під екран ────────────────────────────────────────── */
  function fit() {
    var host = document.getElementById("device-host");
    if (!host) return;
    var vw = (window.visualViewport && window.visualViewport.width)  || window.innerWidth;
    var vh = (window.visualViewport && window.visualViewport.height) || window.innerHeight;
    var k = Math.min(1, vw / W, vh / H);
    if (!isFinite(k) || k <= 0) k = 1;
    host.style.transformOrigin = "center center";
    host.style.transform = "scale(" + k + ")";
    host.style.width  = W + "px";
    host.style.height = H + "px";
    host.style.margin = (H * (k - 1) / 2) + "px " + (W * (k - 1) / 2) + "px";
    host.style.flex = "0 0 auto";
  }
  fit();
  window.addEventListener("resize", fit);
  window.addEventListener("orientationchange", function () { setTimeout(fit, 250); });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", fit);
  var fitPoll = setInterval(fit, 300);
  setTimeout(function () { clearInterval(fitPoll); }, 20000);
})();

/* ── WebKit: flex-контейнер усередині <button> не розтягує дітей ──────────
   У Chrome діти колонкового flex тягнуться на всю ширину, у Safari/iOS —
   стискаються по контенту, і картки їдуть (кнопка CHECK IN стає пігулкою).
   Правка живе тільки в цьому білді: дітям ставимо явну ширину 100%,
   якщо своя ширина їм не задана. Це рівно те, що робить align-items:stretch. */
(function () {
  "use strict";
  function fixOne(b) {
    var cs = getComputedStyle(b);
    if (cs.display !== "flex" && cs.display !== "inline-flex") return;
    if (cs.flexDirection !== "column" && cs.flexDirection !== "column-reverse") return;
    for (var i = 0; i < b.children.length; i++) {
      var ch = b.children[i];
      if (ch.dataset && ch.dataset.pdFixed === "1") continue;
      var s = getComputedStyle(ch);
      if (s.position === "absolute" || s.position === "fixed") continue;
      if (ch.style && ch.style.width) continue;          // своя ширина — не чіпаємо
      if (s.alignSelf === "center" || s.alignSelf === "flex-start" ||
          s.alignSelf === "flex-end") continue;
      ch.style.width = "100%";
      ch.style.boxSizing = "border-box";
      if (ch.dataset) ch.dataset.pdFixed = "1";
    }
  }
  function sweep() {
    var bs = document.querySelectorAll("button");
    for (var i = 0; i < bs.length; i++) fixOne(bs[i]);
  }
  var pending = null;
  function schedule() {
    if (pending) return;
    pending = setTimeout(function () { pending = null; sweep(); }, 60);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule);
  } else schedule();
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true });
})();

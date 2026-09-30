/* PokerDot alpha — плаваюча кнопка відгуку + вікно вводу коментаря.
   Коментар летить на /api/feedback разом з ніком тестера і назвою екрана. */
(function () {
  "use strict";

  var API = "/api/feedback";
  var QUEUE_KEY = "pd_fb_queue";

  function nick() {
    try { return localStorage.getItem("pd_name") || "Анонім"; } catch (e) { return "Анонім"; }
  }

  /* ── визначення поточного екрана ──────────────────────────────────
     Прототип — один React-канвас без роутера, тому екран вгадуємо по DOM:
     беремо найверхніший оверлей, що накриває пристрій, і читаємо його
     заголовок. Не вгадали — тестер може виправити руками. */
  var TITLE_RE = /^[A-ZА-ЯЁІЇЄҐ0-9][A-ZА-ЯЁІЇЄҐ0-9 &·:'’\-\.\/₸₮$%]{1,28}$/;

  function deviceEl() {
    var host = document.getElementById("device-host");
    return host && host.firstElementChild ? host.firstElementChild : host;
  }

  function visible(el) {
    if (!el) return false;
    var r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    var s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none" && parseFloat(s.opacity || "1") > .05;
  }

  function detectScreen() {
    var dev = deviceEl();
    if (!dev) return "";
    var devRect = dev.getBoundingClientRect();
    var devArea = devRect.width * devRect.height;
    if (!devArea) return "";

    // 1. кандидати в оверлеї: позиційовані блоки, що накривають >55% пристрою
    var best = null, bestZ = -1;
    var nodes = dev.querySelectorAll("div,section,span");
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var s = getComputedStyle(n);
      if (s.position !== "absolute" && s.position !== "fixed") continue;
      if (!visible(n)) continue;
      var r = n.getBoundingClientRect();
      if (r.width * r.height < devArea * .55) continue;
      var z = parseInt(s.zIndex, 10); if (isNaN(z)) z = 0;
      if (z >= bestZ) { bestZ = z; best = n; }
    }

    var scope = best || dev;
    var scopeRect = scope.getBoundingClientRect();

    // 2. у верхній смузі оверлея шукаємо короткий верхньорегістровий заголовок
    var texts = scope.querySelectorAll("span,div,h1,h2,h3");
    var head = "";
    for (var j = 0; j < texts.length; j++) {
      var t = texts[j];
      if (t.children.length) continue;
      var txt = (t.textContent || "").trim();
      if (!txt || txt.length > 30) continue;
      if (!TITLE_RE.test(txt)) continue;
      if (!visible(t)) continue;
      var tr = t.getBoundingClientRect();
      if (tr.top - scopeRect.top > 130) continue;
      var ls = parseFloat(getComputedStyle(t).letterSpacing) || 0;
      if (ls < 1) continue;              // заголовки в цьому проекті завжди розріджені
      head = txt; break;
    }
    if (head) return head;

    // 3. запасний варіант — активна вкладка доку
    var dockLabels = ["LOBBY", "ACTIVITIES", "TOURNEYS", "PROFILE", "CASHIER"];
    var found = "";
    var all = dev.querySelectorAll("span,div");
    for (var k = 0; k < all.length; k++) {
      var e = all[k];
      if (e.children.length) continue;
      var v = (e.textContent || "").trim();
      if (dockLabels.indexOf(v) < 0) continue;
      if (!visible(e)) continue;
      var col = getComputedStyle(e).color;
      // активна вкладка світліша за неактивні
      if (/rgba?\(\s*255,\s*255,\s*255/.test(col) && !/0?\.[0-5]\)/.test(col)) { found = v; break; }
      if (!found) found = v;
    }
    return found || "LOBBY";
  }

  /* ── стилі ───────────────────────────────────────────────────────── */
  var css = document.createElement("style");
  css.textContent = [
    '#pd-fb-btn{position:fixed;z-index:99998;width:46px;height:46px;border-radius:50%;border:0;',
    'background:rgba(255,255,255,.13);backdrop-filter:blur(14px) saturate(160%);',
    '-webkit-backdrop-filter:blur(14px) saturate(160%);box-shadow:0 6px 20px rgba(0,0,0,.45),',
    'inset 0 0 0 1px rgba(255,255,255,.22);cursor:pointer;display:flex;align-items:center;',
    'justify-content:center;padding:0;opacity:.62;transition:opacity .2s,transform .12s;',
    '-webkit-tap-highlight-color:transparent}',
    '#pd-fb-btn:hover{opacity:1}#pd-fb-btn:active{transform:scale(.92);opacity:1}',
    '#pd-fb-btn.pulse{animation:pd-fb-attn 2.6s ease-in-out 3}',
    '@keyframes pd-fb-attn{0%,100%{box-shadow:0 6px 20px rgba(0,0,0,.45),inset 0 0 0 1px rgba(255,255,255,.22)}',
    '50%{box-shadow:0 6px 26px rgba(215,25,33,.6),inset 0 0 0 1px rgba(215,25,33,.8)}}',

    '#pd-fb-back{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.62);',
    'backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);opacity:0;pointer-events:none;',
    'transition:opacity .28s ease;display:flex;align-items:flex-end;justify-content:center}',
    '#pd-fb-back.on{opacity:1;pointer-events:auto}',

    '#pd-fb-sheet{width:100%;max-width:440px;background:linear-gradient(168deg,#17171d,#0b0b0e 72%);',
    'border:1px solid rgba(255,255,255,.14);border-bottom:0;border-radius:22px 22px 0 0;',
    'box-shadow:0 -18px 50px rgba(0,0,0,.7);padding:10px 20px calc(22px + env(safe-area-inset-bottom));',
    'transform:translateY(102%);transition:transform .34s cubic-bezier(.22,1,.28,1);',
    'font-family:"Inter",-apple-system,system-ui,sans-serif;color:#fff;box-sizing:border-box}',
    '#pd-fb-back.on #pd-fb-sheet{transform:translateY(0)}',
    '.pd-fb-grip{width:38px;height:4px;border-radius:99px;background:rgba(255,255,255,.22);margin:0 auto 16px}',
    '.pd-fb-h{display:flex;align-items:center;gap:9px;margin-bottom:5px}',
    '.pd-fb-h .d{width:9px;height:9px;border-radius:50%;background:#D71921;box-shadow:0 0 12px rgba(215,25,33,.8);flex:0 0 auto}',
    '.pd-fb-h b{font-size:17px;font-weight:600;letter-spacing:-.01em}',
    '.pd-fb-sub{font-size:14px;color:rgba(255,255,255,.5);margin:0 0 16px;line-height:1.5}',
    '.pd-fb-lab{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.45);',
    'margin-bottom:8px;font-weight:500}',
    '#pd-fb-screen{width:100%;box-sizing:border-box;height:46px;background:rgba(255,255,255,.06);',
    'border:1px solid rgba(255,255,255,.14);border-radius:12px;color:#fff;padding:0 13px;font-size:15px;',
    'font-family:inherit;outline:none;margin-bottom:16px;-webkit-appearance:none}',
    '#pd-fb-screen:focus{border-color:#D71921}',
    '#pd-fb-text{width:100%;box-sizing:border-box;min-height:118px;background:rgba(255,255,255,.06);',
    'border:1px solid rgba(255,255,255,.14);border-radius:14px;color:#fff;padding:13px;font-size:16px;',
    'line-height:1.5;font-family:inherit;outline:none;resize:none;-webkit-appearance:none}',
    '#pd-fb-text:focus{border-color:#D71921}',
    '#pd-fb-text::placeholder{color:rgba(255,255,255,.32)}',
    '.pd-fb-row{display:flex;gap:10px;margin-top:16px}',
    '.pd-fb-b{flex:1;height:52px;border-radius:13px;border:0;cursor:pointer;font-size:15px;font-weight:600;',
    'font-family:inherit;transition:opacity .15s,transform .1s;-webkit-tap-highlight-color:transparent}',
    '.pd-fb-b:active{transform:scale(.985)}',
    '.pd-fb-cancel{background:rgba(255,255,255,.08);color:rgba(255,255,255,.75);flex:0 0 34%}',
    '.pd-fb-send{background:#D71921;color:#fff}.pd-fb-send:disabled{opacity:.35;cursor:default}',
    '.pd-fb-who{font-size:13px;color:rgba(255,255,255,.38);margin-top:14px;text-align:center}',

    '#pd-fb-toast{position:fixed;left:50%;bottom:32px;transform:translate(-50%,26px);z-index:100000;',
    'background:rgba(20,20,24,.96);border:1px solid rgba(255,255,255,.16);border-radius:13px;',
    'padding:13px 20px;color:#fff;font-family:"Inter",-apple-system,system-ui,sans-serif;font-size:15px;',
    'box-shadow:0 12px 34px rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:opacity .25s,transform .25s}',
    '#pd-fb-toast.on{opacity:1;transform:translate(-50%,0)}',
    '#pd-fb-toast .ok{color:#5BD96A;margin-right:8px}'
  ].join("");
  document.head.appendChild(css);

  /* ── розмітка ────────────────────────────────────────────────────── */
  var btn = document.createElement("button");
  btn.id = "pd-fb-btn";
  btn.setAttribute("aria-label", "Залишити зауваження");
  btn.innerHTML = '<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" ' +
    'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-3.4-.6L3 21l1.9-5a8.2 8.2 0 0 1-.9-3.7 8.4 8.4 0 0 1 8.4-8.3h.6A8.4 8.4 0 0 1 21 11v.5z"/></svg>';

  var back = document.createElement("div");
  back.id = "pd-fb-back";
  back.innerHTML =
    '<div id="pd-fb-sheet" role="dialog" aria-modal="true">' +
      '<div class="pd-fb-grip"></div>' +
      '<div class="pd-fb-h"><span class="d"></span><b>Ваше зауваження</b></div>' +
      '<p class="pd-fb-sub">Що тут незрозуміло, незручно або дратує? Пишіть як є.</p>' +
      '<div class="pd-fb-lab">Екран</div>' +
      '<input id="pd-fb-screen" type="text" autocomplete="off" spellcheck="false">' +
      '<div class="pd-fb-lab">Коментар</div>' +
      '<textarea id="pd-fb-text" placeholder="Наприклад: не зрозумів, що робить ця кнопка…"></textarea>' +
      '<div class="pd-fb-row">' +
        '<button class="pd-fb-b pd-fb-cancel" id="pd-fb-cancel" type="button">Закрити</button>' +
        '<button class="pd-fb-b pd-fb-send" id="pd-fb-send" type="button" disabled>Надіслати</button>' +
      '</div>' +
      '<div class="pd-fb-who" id="pd-fb-who"></div>' +
    '</div>';

  var toast = document.createElement("div");
  toast.id = "pd-fb-toast";

  function mount() {
    if (!document.body) return setTimeout(mount, 50);
    document.body.appendChild(btn);
    document.body.appendChild(back);
    document.body.appendChild(toast);
    place();
    setTimeout(function () { btn.classList.add("pulse"); }, 2500);
  }
  mount();

  /* кнопка тримається правого краю пристрою, а не вікна */
  function place() {
    var dev = deviceEl();
    if (!dev) { btn.style.right = "18px"; btn.style.bottom = "108px"; return; }
    var r = dev.getBoundingClientRect();
    if (!r.width) return;
    var right = Math.max(10, window.innerWidth - r.right + 12);
    var bottom = Math.max(12, window.innerHeight - r.bottom + r.height * 0.30);
    btn.style.right = right + "px";
    btn.style.bottom = bottom + "px";
    btn.style.left = "auto"; btn.style.top = "auto";
  }
  window.addEventListener("resize", place);
  window.addEventListener("orientationchange", function () { setTimeout(place, 260); });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", place);
  setInterval(place, 900);

  /* ── поведінка ───────────────────────────────────────────────────── */
  var fScreen = back.querySelector("#pd-fb-screen");
  var fText   = back.querySelector("#pd-fb-text");
  var bSend   = back.querySelector("#pd-fb-send");
  var bCancel = back.querySelector("#pd-fb-cancel");
  var who     = back.querySelector("#pd-fb-who");

  function open() {
    fScreen.value = detectScreen() || "";
    fText.value = "";
    bSend.disabled = true;
    who.textContent = "Підпис: " + nick();
    back.classList.add("on");
    setTimeout(function () { fText.focus(); }, 340);
  }
  function close() {
    back.classList.remove("on");
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
  }

  btn.addEventListener("click", function () { btn.classList.remove("pulse"); open(); });
  bCancel.addEventListener("click", close);
  back.addEventListener("click", function (e) { if (e.target === back) close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  fText.addEventListener("input", function () { bSend.disabled = fText.value.trim().length < 2; });

  function showToast(html) {
    toast.innerHTML = html;
    toast.classList.add("on");
    setTimeout(function () { toast.classList.remove("on"); }, 2600);
  }

  function queue(item) {
    try {
      var q = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
      q.push(item); localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
    } catch (e) {}
  }

  function send(item, quiet) {
    return fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    }).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      return true;
    }).catch(function () {
      if (!quiet) queue(item);
      return false;
    });
  }

  bSend.addEventListener("click", function () {
    var item = {
      name: nick(),
      screen: (fScreen.value || "").trim() || "—",
      text: fText.value.trim(),
      ua: navigator.userAgent,
      vw: window.innerWidth,
      vh: window.innerHeight,
      at: new Date().toISOString(),
    };
    bSend.disabled = true;
    bSend.textContent = "Надсилаємо…";
    send(item).then(function (ok) {
      bSend.textContent = "Надіслати";
      close();
      showToast(ok
        ? '<span class="ok">✓</span>Дякуємо, записали'
        : '<span class="ok">✓</span>Збережено, надішлемо як буде мережа');
    });
  });

  /* черга, що не долетіла минулого разу */
  (function flush() {
    var q = [];
    try { q = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch (e) {}
    if (!q.length) return;
    try { localStorage.removeItem(QUEUE_KEY); } catch (e) {}
    q.forEach(function (it) { send(it, false); });
  })();
})();

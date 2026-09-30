// Career adapts the reference flows to the existing PokerDot tokens.
(function(){
 const style=document.createElement('style');style.id='career-system';
 style.textContent=`
 .pd-career .dt-tag,.pd-career .hb-verdict,.pd-career .hb-row,.pd-career .hb-sealed p{font-size:14px;line-height:1.5}
 .pd-career .dt-luck-foot{flex-wrap:wrap;gap:10px}.pd-career .dt-luck-result .dt-result-caption{font-size:13px}
 .pd-career .hf-entry-count,.pd-career .hf-entry-next small{font-size:13px;line-height:1.4}.pd-career .hf-entry-action{font-size:12px;letter-spacing:.07em}
 .pd-career .hb-vs{flex-wrap:wrap}.pd-career .hb-faq-q{font-size:14px}.pd-career .hb-faq-a{font-size:14px;line-height:1.5}

 .pd-career{--career-border:rgba(255,255,255,.14);font-family:var(--cm-font-ui,${UI.fontUI})}
 .pd-career button:focus-visible,.career-level-control input:focus-visible{outline:2px solid #fff;outline-offset:4px}
 .pd-career .me-title{font-family:var(--cm-font-display,${UI.font});font-size:16px;letter-spacing:.14em}
 .pd-career>.me-top{padding-left:20px!important;padding-right:20px!important}
 .pd-career .dt{background:radial-gradient(ellipse 85% 360px at 50% 140px,#292d383b,transparent 85%),#0a0a0c;padding-bottom:112px}
 .pd-career .dt-scene{height:300px;overflow:visible}
 .dt-artifact{position:relative;transform-style:preserve-3d;will-change:transform;filter:drop-shadow(0 18px 20px #0009);animation:career-artifact-in .65s cubic-bezier(.2,.75,.2,1) both}
 @keyframes career-artifact-in{from{opacity:0;scale:.92;translate:0 12px}to{opacity:1;scale:1;translate:0 0}}
 .pd-career .dt-scene-glow{width:340px;height:340px;opacity:.35}
 .pd-career .dt-scene-dots{opacity:.3}
 .pd-career .dt-under{padding:0 22px}
 .pd-career .dt-name{font-size:30px;letter-spacing:.1em;color:#fff!important;line-height:1.2}
 .pd-career .dt-power{display:inline-block;font-size:12px;letter-spacing:.12em;margin-top:9px}
 .pd-career .dt-tag{font-size:14px;line-height:1.5;color:#aeb3bf;margin-top:9px}
 .pd-career .dt-sec{margin:26px 20px 0}
 .pd-career .dt-sec-h{font-size:14px;letter-spacing:.12em;color:#fff;margin-bottom:13px}
 .pd-career .dt-sec-h a{font-size:12px;letter-spacing:.08em;color:#aeb3bf;cursor:pointer;padding:5px 0}
 .pd-career .dt-box{border-radius:${UI.r.lg}px;border:1px solid var(--career-border);background:linear-gradient(130deg,#202128,#131419);padding:18px}
 .pd-career .dt-luck-top{grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;margin-bottom:19px}
 .pd-career .dt-luck-top span{font-size:12px;letter-spacing:.06em;color:#aeb3bf}
 .pd-career .dt-luck-top b{font-size:22px;letter-spacing:-.02em}
 .pd-career .dt-mute{font-size:12px;line-height:1.4;color:#9399a6}
 .pd-career .dt-ladder{display:grid;grid-template-columns:40px 74px 1fr auto;gap:9px;padding:12px 0}
 .pd-career .dt-ladder-n{width:auto;font-size:12px}
 .pd-career .dt-ladder-z{font-size:12px;letter-spacing:.04em}
 .pd-career .dt-road-art{width:56px}
 .pd-career .career-statistics>div:nth-child(2){padding-left:20px!important;padding-right:20px!important;gap:16px!important}
 .career-stat-label{display:flex;align-items:center;font:700 12px var(--cm-font-ui,${UI.fontUI});letter-spacing:.12em;color:#c1c4ce;margin:2px 0 9px}
 .career-statistics button{font-family:var(--cm-font-ui,${UI.fontUI})}
 .pd-career .hf{background:radial-gradient(ellipse 105% 55% at 50% 35%,#2b303e 0%,#151923 50%,transparent 84%),#0a0a0c}
 .pd-career .hf-stats{margin:16px 20px 0!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:0}
 .pd-career .hf .hf-stat{min-width:0;padding:8px 6px;gap:9px}
 .pd-career .hf .hf-stat>.hf-stat-label{display:block!important;font-size:12px;line-height:17px;letter-spacing:.04em;white-space:normal}
 .pd-career .hf .hf-stat strong{gap:7px}
 .pd-career .hf .hf-stat .hf-rules{display:inline-grid;place-items:center;font:500 10px var(--cm-font-ui);width:14px;height:14px;line-height:1;letter-spacing:0}
 .pd-career .hf .hf-stat strong{font-family:var(--cm-font-display,${UI.font});font-size:20px;height:23px}
 .pd-career .hf-content{padding-left:20px;padding-right:20px}
 .pd-career .hf-scene{min-height:330px}
 .pd-career .hf .hf-primary{background:${UI.grad(UI.accent)}!important;box-shadow:none!important}
 .pd-career .hf .hf-primary:disabled{background:#66171e!important;color:#b7787e!important}
 .pd-career .hf-xp{margin-bottom:14px}
 .pd-career .hf-cards-head{margin-top:26px}
 .pd-career .rb-route-header,.pd-career .rb-detail-header{padding-top:22px}
 .career-level-control{display:block;padding:16px;margin:20px 0 8px;border:1px solid var(--career-border,#ffffff24);border-radius:16px;background:#191a20;color:#aeb3bf;font:600 12px var(--cm-font-ui,${UI.fontUI});letter-spacing:.1em}
 .career-level-control>span:first-child{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px}
 .career-level-control b{font-size:16px;color:#fff;letter-spacing:0}.career-level-control small{font-size:12px;font-weight:500;color:#8e95a3}
 .career-level-control input{display:block;appearance:none;-webkit-appearance:none;width:100%;height:4px;background:linear-gradient(90deg,#d71921 var(--progress),#404149 var(--progress));border-radius:4px;margin:17px 0;cursor:pointer}
 .career-level-control input::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 8px #0008}
 .career-level-control input::-moz-range-thumb{border:0;width:22px;height:22px;border-radius:50%;background:#fff}
 .career-level-marks{display:flex;justify-content:space-between}.career-level-marks i{font-style:normal;color:#8e95a3;font-size:12px;letter-spacing:0}
 .pd-career .dt-dev{margin:24px 20px 0;padding:13px 12px;border-radius:14px;background:#17181d;border:1px solid var(--career-border);gap:8px;flex-wrap:wrap}
 .pd-career .dt-dev>span{width:100%;font-size:12px;letter-spacing:.1em;color:#949aa7;margin-bottom:3px}
 .pd-career .dt-dev strong{flex:1;font-size:12px;text-align:center;color:#d5d8df;min-width:0}
 .pd-career .dt-dev button{width:30px;height:30px;border-radius:10px}
 .pd-career .dt-dev .dt-dev-w{width:auto;padding:0 10px}
 .pd-career .dt-scene:focus-visible{outline:1px solid #ffffff70;outline-offset:-15px;border-radius:24px}
 .pd-career .dt-mini-artifact{filter:drop-shadow(0 3px 4px #0009)}
 .pd-career .dt{background:radial-gradient(ellipse 120% 410px at 55% 140px,#23293655,transparent 85%),#0c0d10}
 .dt-hero-header{display:flex;align-items:center;justify-content:space-between;margin:19px 22px 0;font-size:12px;font-weight:700;letter-spacing:.12em;color:#888f9c}
 .dt-hero-header button{display:flex;align-items:center;gap:7px;padding:7px 0 7px 10px;background:none;border:0;color:#e9ecf2;font:700 12px var(--cm-font-ui,${UI.fontUI});letter-spacing:.1em}
 .pd-career .dt-scene{height:350px;position:relative;overflow:visible;touch-action:auto}
 .dt-model-stage{height:350px;width:100%;position:relative;isolation:isolate}
 .dt-model-stage canvas{position:relative;z-index:2;display:block;width:100%;height:100%;cursor:grab;touch-action:none;outline:none}
 .dt-model-stage canvas:active{cursor:grabbing}.dt-model-stage canvas:focus-visible{outline:1px solid #ffffff60;outline-offset:-12px;border-radius:20px}
 .dt-model-halo{position:absolute;width:86%;height:75%;left:7%;top:5%;border-radius:50%;background:radial-gradient(ellipse,#a9b9d016,transparent 69%);pointer-events:none}
 .dt-model-shadow{position:absolute;width:48%;height:19px;left:26%;bottom:28px;border-radius:50%;background:#0009;filter:blur(10px);pointer-events:none}
 .dt-model-controls{position:absolute;z-index:4;bottom:1px;left:22px;right:22px;display:flex;align-items:center;justify-content:center;pointer-events:none}
 .dt-model-controls>span{display:flex;align-items:center;gap:6px;color:#777f8b;font:600 12px var(--cm-font-ui,${UI.fontUI});letter-spacing:.13em;transition:opacity .4s}.dt-model-controls>span.is-touched{opacity:.35}
 .dt-model-loader{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;font-size:12px;font-weight:600;letter-spacing:.12em;color:#9ca5b2;z-index:3}
 .dt-model-loader>span:empty{width:25px;height:25px;border:1px solid #ffffff20;border-top-color:#f0f3f8;border-radius:50%;animation:dt-loading .8s linear infinite}
 @keyframes dt-loading{to{rotate:360deg}}
 .pd-career .dt-under{padding:19px 22px 0;display:grid;grid-template-columns:1fr auto;align-items:center;text-align:left;gap:0 10px}
 .pd-career .dt-under .dt-name{font-size:34px;letter-spacing:.08em}
 .pd-career .dt-under .dt-power{grid-column:2;margin:0;display:flex;align-items:center;gap:6px;color:#e4e8ee!important;font-size:12px;font-weight:700;letter-spacing:.11em}
 .pd-career .dt-under .dt-power:before{content:'';width:5px;height:5px;border-radius:50%;background:#e41c2d}
 .pd-career .dt-under .dt-tag{grid-column:1/-1;font-size:12px;line-height:1.5;margin-top:7px;color:#8f98a7}
 .pd-career .dt-under .dt-charge{grid-column:1/-1}
 .pd-career .dt-luck-section{margin:23px 20px 0}
 .dt-luck-card{position:relative;isolation:isolate;display:block;width:100%;text-align:left;border:1px solid #ffffff20;border-radius:20px;padding:19px 18px 15px;background:linear-gradient(120deg,#222630,#14161c 75%);color:#fff;overflow:hidden;cursor:pointer}
 .dt-luck-card:after{content:'';position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse at 95% 0,#717d9919,transparent 70%);pointer-events:none}
 .dt-luck-heading{display:flex;justify-content:space-between;align-items:center;font-size:12px;letter-spacing:.12em;font-weight:700;color:#b0b8c6}
 .dt-luck-heading svg{color:#949ca9}
 .dt-luck-result{display:grid;grid-template-columns:max-content max-content;align-items:baseline;column-gap:9px;row-gap:6px;width:max-content;text-align:left;margin-top:15px;position:relative;z-index:2;pointer-events:none}
 .dt-luck-result>strong{font:600 39px var(--cm-font-display,${UI.font});letter-spacing:-.045em;line-height:1.1;font-variant-numeric:tabular-nums}
 .dt-luck-result>span{font-size:13px;color:#c4cad4;font-weight:700}
 .dt-result-caption{grid-column:1 / -1;justify-self:start;display:block;font-weight:400;font-size:12px;color:#939dac;margin:0;line-height:1.4}
 .dt-luck-spark{position:absolute;width:45%;right:18px;top:57px;opacity:.9}
 .dt-luck-foot{margin-top:22px;padding-top:12px;border-top:1px solid #ffffff0c;display:flex;justify-content:space-between;color:#8993a2;font-size:12px;line-height:1.3}
 .dt-luck-foot b{color:#d6dce5;font-weight:600}.dt-luck-foot>span:last-child{display:flex;align-items:center;gap:6px}
 .dt-luck-foot i{width:5px;height:5px;border-radius:50%;background:#e8edf5}.dt-ev-key{width:10px;border-top:1px dashed #828a98;margin-left:5px}
 .dt-trend svg{display:block;overflow:visible}.dt-trend-line{stroke-dasharray:1;animation:dt-draw 1.2s cubic-bezier(.16,1,.3,1) both}
 .dt-trend-fill{animation:dt-fill 1.1s ease both}.dt-trend-legend{display:flex;justify-content:space-between;margin-top:16px;color:#778291;font-size:12px;letter-spacing:.02em}.dt-trend-legend b{font-weight:500;color:#dce2eb;margin-left:5px}
 @keyframes dt-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}@keyframes dt-fill{from{opacity:0}to{opacity:1}}
 .pd-career .career-statistics{margin-top:29px!important}.pd-career .career-statistics>div:first-child{font-size:12px;letter-spacing:.1em;color:#c3c9d3}
 .pd-career .career-stat-label{color:#808b9b;font-size:12px;margin-bottom:9px;letter-spacing:.13em}
 .pd-career .career-statistics button{box-shadow:none!important}
 .hb-editorial{padding:14px 22px 0}.hb-period{display:flex;align-items:center;justify-content:space-between;gap:16px;color:#929caa;font-size:12px;font-weight:700;letter-spacing:.12em}.hb-period>div{width:170px}
 .hb-result-header{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:34px}
 .hb-eyebrow{font-size:12px;letter-spacing:.13em;color:#9ba5b2;font-weight:700}.hb-big-result{font:600 61px var(--cm-font-display,${UI.font});letter-spacing:-.055em;line-height:1.18;margin-top:8px;font-variant-numeric:tabular-nums;color:#f5f7fb;white-space:nowrap}
 .hb-big-result small{font-size:18px;margin-left:9px;letter-spacing:0;color:#8b96a5}.hb-result-header p{font-size:12px;line-height:1.5;color:#9ca6b5;margin:5px 0 0;max-width:180px}
 .hb-result-header .dt-mini-artifact{filter:drop-shadow(0 12px 10px #0009);transform:rotate(8deg)}
 .hb-trend-panel{margin:30px 0 0}.hb-outcomes{display:grid;grid-template-columns:repeat(3,1fr);margin-top:26px;padding:20px 0;border-top:1px solid #ffffff16;border-bottom:1px solid #ffffff16}
 .hb-outcomes>div{display:flex;flex-direction:column;gap:9px}.hb-outcomes>div+div{border-left:1px solid #ffffff12;padding-left:18px}
 .hb-outcomes span{font-size:12px;font-weight:600;letter-spacing:.09em;color:#84909f}.hb-outcomes strong{font:600 28px var(--cm-font-display,${UI.font});font-variant-numeric:tabular-nums;color:#e9edf4}.hb-outcomes strong.is-positive{color:#8cd4b6}
 .hb-explain{font-size:12px;line-height:1.6;color:#818d9e;margin:18px 0 27px}
 .pd-career .hb{background:radial-gradient(ellipse 130% 40% at 80% 8%,#26303f55,transparent 70%),#0c0d10}
 .pd-career .hb-h{font-size:12px;letter-spacing:.09em;color:#b8c1cd}
 .pd-career .dt-dev{opacity:.65}
 .hb-talisman-trigger{padding:0;border:0;background:transparent;flex:none;cursor:pointer;border-radius:20px;transition:transform .25s}
 .hb-talisman-trigger:hover{transform:translateY(-3px) rotate(-4deg)}.hb-talisman-trigger:active{transform:scale(.94)}.hb-talisman-trigger:focus-visible{outline:1px solid #d0d6e0;outline-offset:4px}
 .tt-overlay{position:absolute;inset:0;z-index:115;display:flex;flex-direction:column;overflow:hidden;isolation:isolate;color:#fff;font-family:var(--cm-font-ui,${UI.fontUI})}
 .tt-overlay *{box-sizing:border-box}.tt-overlay button{font-family:inherit;-webkit-tap-highlight-color:transparent}.tt-overlay button:focus-visible{outline:2px solid #e8edf6;outline-offset:4px}
 .tt-backdrop{position:absolute;inset:0;z-index:-2;background:radial-gradient(ellipse 120% 70% at 50% 35%,#242d3d 0%,#11141b 45%,#090a0d 80%);animation:tt-backdrop-in .6s ease both}
 .tt-top{padding:62px 22px 0;flex:none;animation:tt-ui-in .65s .1s both}.tt-top .me-back{color:#fff}.tt-top .me-title{font-size:14px;letter-spacing:.16em}.tt-secret-dot{width:36px;height:36px;position:relative}.tt-secret-dot:after{content:'';width:4px;height:4px;border-radius:50%;background:#d71921;position:absolute;top:16px;right:16px}
 .tt-intro{text-align:center;padding:23px 18px 0;flex:none;position:relative;z-index:2;animation:tt-ui-in .7s .22s both}
 .tt-eyebrow{display:block;color:#8995a8;font-size:12px;letter-spacing:.18em;font-weight:600}
 .tt-intro h2{font:700 28px var(--cm-font-display,${UI.font});letter-spacing:.025em;line-height:1.15;margin:10px 0 8px;color:#f6f7fa}
 .tt-intro p{margin:0;min-height:20px;font-size:12px;line-height:1.5;color:#a0aaba}
 .tt-stage{flex:1;min-height:160px;max-height:470px;position:relative;isolation:isolate;will-change:transform;pointer-events:none}
 .tt-stage canvas{width:100%;height:100%;display:block;position:relative;z-index:2}
 .tt-aura{position:absolute;inset:12% 8%;background:radial-gradient(ellipse,#c2d7ff0b,transparent 66%);border-radius:50%;transition:background 1s;pointer-events:none}
 .tt-loading{position:absolute;inset:0;display:grid;place-items:center;color:#949ead;font-size:12px;letter-spacing:.15em;animation:tt-backdrop-in 1s .3s both}
 .tt-landed-label{position:absolute;bottom:0;left:0;right:0;text-align:center;color:#dbe2ed;font-size:12px;font-weight:600;letter-spacing:.22em;animation:tt-ui-in .6s both}
 .tt-controls{position:relative;z-index:3;flex:none;padding:12px 22px 27px;animation:tt-ui-in .8s .5s both}
 .tt-choice-area{height:91px;display:flex;align-items:center;margin-bottom:17px;transition:opacity .24s,transform .45s}.tt-choice-area[data-hidden=true]{opacity:0;transform:translateY(12px);pointer-events:none}
 .tt-sides{display:grid;grid-template-columns:1fr 1fr;gap:10px;width:100%}
 .tt-side{position:relative;display:flex;align-items:center;justify-content:center;gap:9px;min-height:83px;padding:10px 12px;border:1px solid #ffffff21;border-radius:${UI.r.md}px;background:#ffffff04;color:#bac3d0;cursor:pointer;transition:background .2s,border-color .2s,transform .2s}
 .tt-side>img{width:45px;height:45px;object-fit:contain;filter:drop-shadow(0 4px 4px #0008)}.tt-side>span{font-size:12px;font-weight:700;letter-spacing:.08em}.tt-side>i{position:absolute;top:8px;right:8px;width:5px;height:5px;border-radius:50%;background:#d71921;opacity:0;transition:opacity .2s}
 .tt-side[aria-pressed=true]{border-color:#d71921;background:#d7192110;color:#fff}.tt-side[aria-pressed=true]>i{opacity:1}.tt-side:active{transform:scale(.97)}.tt-side:disabled{cursor:default}
 .tt-dot-logo{width:32px;height:32px;flex:none;margin:0 4px;color:#d3d8e2}
 .tt-primary{position:relative}.tt-primary:disabled{cursor:default!important;opacity:.38}.tt-overlay[data-phase=tossing] .tt-primary,.tt-overlay[data-phase=landing] .tt-primary,.tt-overlay[data-phase=revealing] .tt-primary{background:#1d232d!important;color:#a1adbf!important;opacity:1;letter-spacing:.1em}
 .tt-flight-dots{display:flex;gap:3px;align-items:center;margin-right:3px}.tt-flight-dots i{width:3px;height:3px;border-radius:50%;background:currentColor;animation:tt-dot-pulse 1s infinite}.tt-flight-dots i:nth-child(2){animation-delay:.15s}.tt-flight-dots i:nth-child(3){animation-delay:.3s}
 .tt-footnote{display:block;text-align:center;font-size:12px;letter-spacing:.14em;color:#737f90;margin-top:15px;min-height:12px}
 .tt-result-note{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;font-size:13px;color:#bdc7d5;animation:tt-ui-in .6s both}.tt-result-icon{display:grid;place-items:center;width:36px;height:36px;border:1px solid #ffffff20;border-radius:50%;color:#c7d1df}.tt-result-icon[data-won=true]{color:#f0d699;border-color:#f0c75e45;background:#f0c75e09}
 .tt-overlay[data-won=true] .tt-intro h2{animation:tt-win-reveal .9s both}.tt-overlay[data-won=true] .tt-aura{background:radial-gradient(ellipse,#f0c75e0f,transparent 67%)}
 .tt-overlay[data-closing=true]{pointer-events:none;animation:tt-close .24s ease both}.tt-error{display:flex;flex-direction:column;align-items:center;gap:10px;color:#a3afbe;font-size:12px}
 @keyframes tt-backdrop-in{from{opacity:0}to{opacity:1}}@keyframes tt-ui-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes tt-close{to{opacity:0;transform:scale(.98)}}
 @keyframes tt-dot-pulse{0%,100%{opacity:.25;transform:translateY(0)}50%{opacity:1;transform:translateY(-2px)}}
 @keyframes tt-win-reveal{0%{opacity:0;transform:translateY(8px) scale(.96);text-shadow:0 0 24px #f0c75e88}55%{opacity:1;transform:translateY(0) scale(1.035);text-shadow:0 0 28px #f0c75e44}100%{transform:scale(1);text-shadow:0 0 0 transparent}}
 @media(max-height:740px){.tt-top{padding-top:44px}.tt-intro{padding-top:16px}.tt-intro h2{font-size:25px}.tt-controls{padding-bottom:19px}.tt-choice-area{height:74px;margin-bottom:12px}.tt-side{min-height:70px}}
 @media(prefers-reduced-motion:reduce){.tt-overlay *,.tt-overlay{animation:none!important;transition:none!important}.hb-talisman-trigger:hover{transform:none}}
 @media(prefers-reduced-motion:reduce){.pd-career *{scroll-behavior:auto!important}.pd-career .dt-stage{transition:none}.dt-artifact,.dt-trend-line,.dt-trend-fill{animation:none;transform:none!important}}
 `;document.head.appendChild(style);
})();

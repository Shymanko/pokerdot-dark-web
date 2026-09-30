// A small, self-contained visual ritual. It never writes luck, balances or rewards.
const TT_TAU = Math.PI * 2;
const ttClamp = v => Math.max(0, Math.min(1, v));
const ttEase = v => 1 - Math.pow(1 - ttClamp(v), 3);
const ttSmooth = v => {
  const p = ttClamp(v);
  return p * p * (3 - 2 * p);
};
function TalismanToss({
  animal = 'tiger',
  origin,
  onClose
}) {
  const root = React.useRef(null),
    canvas = React.useRef(null),
    stage = React.useRef(null);
  const engine = React.useRef(null),
    audio = React.useRef(null),
    closeRef = React.useRef(onClose);
  closeRef.current = onClose;
  const [phase, setPhase] = React.useState('entering'),
    [choice, setChoice] = React.useState(null);
  const [result, setResult] = React.useState(null),
    [attempt, setAttempt] = React.useState(0);
  const [closing, setClosing] = React.useState(false);
  const won = result !== null && result === choice;
  const busy = ['entering', 'tossing', 'landing', 'revealing'].includes(phase);
  const name = dtAN(animal);
  React.useEffect(() => {
    const previous = document.activeElement;
    window.dispatchEvent(new CustomEvent('dt-toss-active', {
      detail: true
    }));
    root.current?.querySelector('button')?.focus({
      preventScroll: true
    });
    return () => {
      window.dispatchEvent(new CustomEvent('dt-toss-active', {
        detail: false
      }));
      if (previous?.isConnected) previous.focus({
        preventScroll: true
      });
    };
  }, []);
  React.useEffect(() => {
    let cancelled = false,
      raf,
      resize,
      renderer,
      model,
      animation;
    const T = window.THREE,
      el = canvas.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const e = {
      phase: 'entering',
      start: 0,
      side: 0,
      targetSide: 0,
      result: 0,
      choice: null,
      round: 0,
      reduced,
      ready: false
    };
    engine.current = e;
    setPhase('entering');
    const disposable = [];
    try {
      renderer = new T.WebGLRenderer({
        canvas: el,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      const scene = new T.Scene();
      scene.environment = CH.envFor(renderer);
      const camera = new T.PerspectiveCamera(36, 1, .1, 40);
      camera.position.set(0, .35, 7.5);
      camera.lookAt(0, .35, 0);
      const key = new T.DirectionalLight(0xffffff, 2.8);
      key.position.set(-3, 4, 5);
      scene.add(key);
      const rim = new T.DirectionalLight(0xc1d3ef, 2.1);
      rim.position.set(4, 2, -2);
      scene.add(rim);
      const red = new T.PointLight(0xe92238, .9, 9);
      red.position.set(-2, -1, 2);
      scene.add(red);
      scene.add(new T.HemisphereLight(0xf5f7ff, 0x252730, .65));
      const pivot = new T.Group();
      scene.add(pivot);
      const floorY = -.92;
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = shadowCanvas.height = 128;
      const g = shadowCanvas.getContext('2d'),
        gradient = g.createRadialGradient(64, 64, 8, 64, 64, 64);
      gradient.addColorStop(0, 'rgba(0,0,0,.9)');
      gradient.addColorStop(.45, 'rgba(0,0,0,.6)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gradient;
      g.fillRect(0, 0, 128, 128);
      const shadowTexture = new T.CanvasTexture(shadowCanvas);
      const shadowMat = new T.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        depthWrite: false
      });
      const shadowGeo = new T.PlaneGeometry(3.2, 3.2),
        shadow = new T.Mesh(shadowGeo, shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.set(0, floorY, .1);
      scene.add(shadow);
      disposable.push(shadowTexture, shadowMat, shadowGeo);
      const ringGeo = new T.RingGeometry(1, 1.018, 100),
        ringMat = new T.MeshBasicMaterial({
          color: 0xe7edff,
          transparent: true,
          opacity: 0,
          side: T.DoubleSide,
          depthWrite: false
        });
      const ring = new T.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = floorY + .01;
      scene.add(ring);
      disposable.push(ringGeo, ringMat);
      const particles = 84,
        positions = new Float32Array(particles * 3),
        colors = new Float32Array(particles * 3);
      const seeds = Array.from({
        length: particles
      }, (_, i) => ({
        angle: i * 2.39996,
        speed: .8 + i * 37 % 100 / 55,
        lift: .4 + i * 17 % 73 / 60
      }));
      for (let i = 0; i < particles; i++) {
        colors.set(i % 5 === 0 ? [1, .65, .35] : [.78, .85, 1], i * 3);
      }
      const dustGeo = new T.BufferGeometry();
      dustGeo.setAttribute('position', new T.BufferAttribute(positions, 3));
      dustGeo.setAttribute('color', new T.BufferAttribute(colors, 3));
      const dustMat = new T.PointsMaterial({
        size: .028,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: T.AdditiveBlending
      });
      const dust = new T.Points(dustGeo, dustMat);
      scene.add(dust);
      disposable.push(dustGeo, dustMat);
      // Layout size stays stable while the canvas flies out of the thumbnail.
      const resizeScene = () => {
        const w = Math.max(1, el.clientWidth),
          h = Math.max(1, el.clientHeight);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize = new ResizeObserver(resizeScene);
      resize.observe(el);
      resizeScene();
      const impactSound = () => {
        const a = audio.current,
          prefs = window.pxSoundPrefs;
        if (!a?.buffer || a.ctx.state !== 'running' || prefs?.enabled === false) return;
        const source = a.ctx.createBufferSource(),
          gain = a.ctx.createGain();
        source.buffer = a.buffer;
        source.playbackRate.value = .85;
        gain.gain.value = .34 * (prefs?.volume ?? .7);
        source.connect(gain).connect(a.ctx.destination);
        source.start();
        source.onended = () => {
          source.disconnect();
          gain.disconnect();
        };
      };
      const changePhase = next => {
        e.phase = next;
        setPhase(next);
      };
      const orient = (x, y, z) => pivot.quaternion.setFromEuler(new T.Euler(x, y, z));
      const burst = (age, strength = 1) => {
        const t = ttClamp(age),
          fade = Math.pow(1 - t, 2);
        ring.scale.setScalar(1 + t * 3.1);
        ringMat.opacity = fade * .42 * strength;
        dustMat.opacity = fade * .75 * strength;
        seeds.forEach((s, i) => {
          const travel = t * s.speed;
          positions[i * 3] = Math.cos(s.angle) * travel;
          positions[i * 3 + 1] = floorY + .07 + Math.max(0, s.lift * Math.sin(t * Math.PI));
          positions[i * 3 + 2] = Math.sin(s.angle) * travel;
        });
        dustGeo.attributes.position.needsUpdate = true;
      };
      dtLoadModel(animal).then(gltf => {
        if (cancelled) return;
        model = gltf.scene.clone(true);
        model.traverse(o => {
          if (o.isMesh) {
            o.material = o.material.clone();
            o.material.envMapIntensity = 1.05;
          }
        });
        model.position.sub(new T.Box3().setFromObject(model).getCenter(new T.Vector3()));
        pivot.add(model);
        e.start = performance.now();
        e.ready = true;
        if (!reduced && origin) {
          const b = stage.current.getBoundingClientRect(),
            dx = origin.x + origin.width / 2 - (b.x + b.width / 2),
            dy = origin.y + origin.height / 2 - (b.y + b.height / 2);
          animation = stage.current.animate([{
            transform: `translate(${dx}px,${dy}px) scale(.24)`,
            opacity: .35
          }, {
            transform: 'translate(0,-12px) scale(1.045)',
            opacity: 1,
            offset: .76
          }, {
            transform: 'translate(0,0) scale(1)',
            opacity: 1
          }], {
            duration: 1100,
            easing: 'cubic-bezier(.16,1,.3,1)',
            fill: 'none'
          });
        }
      }).catch(() => {
        if (!cancelled) {
          e.phase = 'error';
          setPhase('error');
        }
      });
      let last = performance.now();
      const render = now => {
        if (cancelled) return;
        const dt = Math.min(.04, (now - last) / 1000);
        last = now;
        if (e.ready) {
          const age = Math.max(0, (now - e.start) / 1000);
          shadowMat.opacity = .65;
          ringMat.opacity = 0;
          dustMat.opacity = 0;
          camera.position.x = 0;
          camera.position.y = .35;
          camera.lookAt(0, .35, 0);
          if (e.phase === 'entering') {
            const p = reduced ? 1 : ttEase(age / 1.1);
            orient(.1 + (1 - p) * .4, -.12 - (1 - p) * TT_TAU * .72, 0);
            pivot.position.set(0, -.05, 0);
            pivot.scale.setScalar(1.37);
            if (p >= 1) changePhase('choose');
          } else if (e.phase === 'choose') {
            e.side += (e.targetSide - e.side) * (reduced ? 1 : 1 - Math.exp(-7 * dt));
            orient(.1, e.side - .12, reduced ? 0 : Math.sin(now / 3400) * .025);
            pivot.position.set(0, -.05 + (reduced ? 0 : Math.sin(now / 2400) * .035), 0);
            pivot.scale.setScalar(1.37);
          } else if (e.phase === 'tossing') {
            if (reduced) {
              const p = ttClamp(age / .65);
              orient(.1, e.result === 0 ? -.12 : Math.PI - .12, 0);
              pivot.position.set(0, -.05, 0);
              pivot.scale.setScalar(1.37);
              model.visible = p < .4 || p > .58;
              if (p >= 1) {
                model.visible = true;
                changePhase('result');
                setResult(e.result);
              }
            } else if (age < .34) {
              const p = ttSmooth(age / .34);
              pivot.position.set(0, -.05 - .4 * p, 0);
              pivot.scale.setScalar(1.37 - .36 * p);
              orient(.1 - .72 * p, e.side - .12, -.14 * p);
            } else if (age < 2.65) {
              const u = (age - .34) / 2.31,
                p = u + .075 * Math.sin(TT_TAU * u),
                altitude = 4 * p * (1 - p);
              stage.current.dataset.motion = p < .38 ? 'rising' : p > .62 ? 'falling' : 'apex';
              pivot.position.set(.14 * Math.sin(TT_TAU * p), -.45 + 1.8 * altitude, 0);
              pivot.scale.setScalar(1.01 - .38 * Math.sin(Math.PI * p));
              const finalAngle = TT_TAU * 5 + (e.result === 0 ? -Math.PI / 2 : Math.PI / 2);
              orient(-.62 + (finalAngle + .62) * p, (e.side - .12) * (1 - ttSmooth(p / .72)), Math.sin(p * TT_TAU) * .22 - .14 * (1 - p));
              shadow.scale.setScalar(1 + .75 * altitude);
              shadowMat.opacity = .7 - .45 * altitude;
              key.intensity = 2.8 + Math.sin(p * Math.PI) * 1.1;
            } else {
              e.start = now;
              e.floorQuat = new T.Quaternion().setFromEuler(new T.Euler(e.result === 0 ? -Math.PI / 2 : Math.PI / 2, 0, 0));
              e.revealQuat = new T.Quaternion().setFromEuler(new T.Euler(.1, e.result === 0 ? -.12 : Math.PI - .12, -.03));
              impactSound();
              changePhase('landing');
            }
          } else if (e.phase === 'landing') {
            const p = ttClamp(age / .62),
              bounce = Math.abs(Math.sin(p * Math.PI * 2)) * Math.pow(1 - p, 2) * .26;
            pivot.position.set(0, -.60 + bounce, 0);
            pivot.scale.setScalar(1.01);
            pivot.quaternion.copy(e.floorQuat);
            pivot.rotateZ(Math.sin(p * 23) * Math.exp(-p * 6) * .18);
            pivot.rotateX(Math.sin(p * 17) * Math.exp(-p * 5) * .12);
            shadow.scale.setScalar(1 + bounce);
            burst(p, .8);
            const shake = Math.sin(age * 75) * Math.exp(-age * 14) * .042;
            camera.position.set(shake, .35 + shake * .6, 7.5);
            camera.lookAt(0, .35, 0);
            if (p >= 1) {
              e.start = now;
              changePhase('revealing');
            }
          } else if (e.phase === 'revealing') {
            const p = ttEase(age / .85);
            pivot.position.set(0, -.60 + .55 * p, 0);
            pivot.scale.setScalar(1.01 + .36 * p);
            pivot.quaternion.slerpQuaternions(e.floorQuat, e.revealQuat, p);
            shadow.scale.setScalar(1);
            if (p >= 1) {
              e.start = now;
              changePhase('result');
              setResult(e.result);
            }
          } else if (e.phase === 'result') {
            pivot.quaternion.copy(e.revealQuat || new T.Quaternion().setFromEuler(new T.Euler(.1, e.result === 0 ? -.12 : Math.PI - .12, 0)));
            pivot.position.y = -.05 + (reduced ? 0 : Math.sin(now / 2400) * .025);
            pivot.scale.setScalar(1.37);
            if (!reduced && e.result === e.choice && age < 1.3) burst(age / 1.3, .65);
          }
          key.position.x = -3 + (reduced ? 0 : Math.sin(now / 3200) * 1.4);
          if (e.phase !== 'tossing') key.intensity = 2.8;
          if (!document.hidden) renderer.render(scene, camera);
        }
        raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    } catch (error) {
      setPhase('error');
      e.phase = 'error';
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      animation?.cancel();
      resize?.disconnect();
      model?.traverse(o => {
        if (o.isMesh) o.material.dispose();
      });
      disposable.forEach(o => o.dispose());
      if (renderer) {
        CH.envs.get(renderer)?.dispose();
        CH.envs.delete(renderer);
        renderer.dispose();
        renderer.forceContextLoss();
      }
      audio.current?.ctx.close().catch(() => {});
      audio.current = null;
    };
  }, [animal, attempt]);
  const select = side => {
    if (phase !== 'choose') return;
    setChoice(side);
    const e = engine.current;
    if (e) {
      e.choice = side;
      e.targetSide = side === 0 ? 0 : Math.PI;
    }
  };
  const toss = () => {
    const e = engine.current;
    if (!e?.ready || e.phase !== 'choose' || choice === null) return;
    e.result = crypto.getRandomValues(new Uint8Array(1))[0] & 1;
    e.choice = choice;
    e.start = performance.now();
    e.phase = 'tossing';
    e.round++;
    setResult(null);
    setPhase('tossing');
    // Reuse the app's recorded metal contact; honor the global sound preference.
    if (window.pxSoundPrefs?.enabled !== false) {
      try {
        if (!audio.current) {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          audio.current = {
            ctx,
            buffer: null
          };
          const a = audio.current;
          fetch('assets/audio/coin-contact-0.wav').then(r => r.arrayBuffer()).then(b => ctx.decodeAudioData(b)).then(b => {
            a.buffer = b;
          }).catch(() => {});
        }
        audio.current.ctx.resume().catch(() => {});
      } catch (_) {}
    }
  };
  const again = () => {
    const e = engine.current;
    e.side = result === 0 ? 0 : Math.PI;
    e.targetSide = e.side;
    e.choice = null;
    e.phase = 'choose';
    setResult(null);
    setChoice(null);
    setPhase('choose');
  };
  const close = () => {
    if (closing) return;
    setClosing(true);
  };
  React.useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => closeRef.current(), matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240);
    return () => clearTimeout(timer);
  }, [closing]);
  return /*#__PURE__*/React.createElement("div", {
    ref: root,
    className: "tt-overlay",
    "data-phase": phase,
    "data-closing": closing,
    "data-won": phase === 'result' && won,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "tt-title",
    "data-i18n": "off",
    onKeyDown: event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
      if (event.key === 'Tab') {
        const focus = [...root.current.querySelectorAll('button:not(:disabled)')];
        const first = focus[0],
          last = focus[focus.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tt-backdrop"
  }), /*#__PURE__*/React.createElement("div", {
    className: "me-top tt-top"
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C \u043F\u043E\u0434\u0431\u0440\u0430\u0441\u044B\u0432\u0430\u043D\u0438\u0435",
    onClick: close
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m6 6 12 12M18 6 6 18"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "me-title"
  }, "\u041D\u0410 \u0423\u0414\u0410\u0427\u0423"), /*#__PURE__*/React.createElement("span", {
    className: "tt-secret-dot",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tt-intro",
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tt-eyebrow"
  }, phase === 'result' ? 'ТВОЙ МАЛЕНЬКИЙ РИТУАЛ' : 'СЕКРЕТ ТАЛИСМАНА'), /*#__PURE__*/React.createElement("h2", {
    id: "tt-title"
  }, phase === 'result' ? won ? 'ТЕБЕ ВЕЗЁТ' : 'ДАВАЙ ЕЩЁ РАЗ' : 'ДОВЕРЬСЯ ЧУТЬЮ'), /*#__PURE__*/React.createElement("p", null, phase === 'result' ? `Выпал ${result === 0 ? name.toLowerCase() : 'DOT'}. ${won ? 'Ты угадал.' : 'Попробуем ещё?'}` : phase === 'tossing' ? 'Один бросок. Две стороны.' : phase === 'landing' || phase === 'revealing' ? 'Сейчас узнаем…' : 'На какую сторону упадёт талисман?')), /*#__PURE__*/React.createElement("div", {
    ref: stage,
    className: "tt-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tt-aura"
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvas,
    "aria-label": `Подбрасывание 3D талисмана: ${name}`,
    role: "img"
  }), phase === 'entering' && /*#__PURE__*/React.createElement("span", {
    className: "tt-loading"
  }, engine.current?.ready ? '' : 'СЕКУНДУ…'), phase === 'result' && /*#__PURE__*/React.createElement("div", {
    className: "tt-landed-label"
  }, result === 0 ? 'ТАЛИСМАН' : 'DOT')), /*#__PURE__*/React.createElement("div", {
    className: "tt-controls"
  }, phase === 'error' ? /*#__PURE__*/React.createElement("div", {
    className: "tt-error"
  }, /*#__PURE__*/React.createElement("p", null, "\u0422\u0430\u043B\u0438\u0441\u043C\u0430\u043D \u043F\u043E\u043A\u0430 \u043D\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u043B\u0441\u044F"), /*#__PURE__*/React.createElement("button", {
    style: {
      ...UI.btn('l', 'primary'),
      boxShadow: 'none'
    },
    onClick: () => setAttempt(v => v + 1)
  }, "\u041F\u041E\u0412\u0422\u041E\u0420\u0418\u0422\u042C")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "tt-choice-area",
    "data-hidden": busy
  }, phase === 'result' ? /*#__PURE__*/React.createElement("div", {
    className: "tt-result-note"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tt-result-icon",
    "data-won": won
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: won ? 'm5 12 4 4 10-10' : 'M5 10a7 7 0 1 1 0 6M5 5v5h5'
  }))), /*#__PURE__*/React.createElement("span", null, won ? 'Чутьё не подвело.' : 'Удача любит настойчивых.')) : /*#__PURE__*/React.createElement("div", {
    className: "tt-sides",
    role: "group",
    "aria-label": "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u0442\u043E\u0440\u043E\u043D\u0443"
  }, /*#__PURE__*/React.createElement("button", {
    className: "tt-side",
    disabled: busy,
    "aria-pressed": choice === 0,
    onClick: () => select(0)
  }, /*#__PURE__*/React.createElement("img", {
    src: `assets/talismans3d/${animal}.png`,
    alt: ""
  }), /*#__PURE__*/React.createElement("span", null, "\u0422\u0410\u041B\u0418\u0421\u041C\u0410\u041D"), /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("button", {
    className: "tt-side",
    disabled: busy,
    "aria-pressed": choice === 1,
    onClick: () => select(1)
  }, /*#__PURE__*/React.createElement("svg", {
    className: "tt-dot-logo",
    width: "40",
    height: "40",
    viewBox: "0 0 44 44",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "10",
    r: "7",
    fill: "#d71921"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "22",
    r: "7",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "34",
    cy: "22",
    r: "7",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "22",
    cy: "34",
    r: "7",
    fill: "currentColor"
  })), /*#__PURE__*/React.createElement("span", null, "DOT"), /*#__PURE__*/React.createElement("i", null)))), /*#__PURE__*/React.createElement("button", {
    className: "tt-primary",
    style: {
      ...UI.btn('l', 'primary'),
      boxShadow: 'none',
      width: '100%',
      minHeight: 52
    },
    disabled: busy || phase === 'choose' && choice === null,
    onClick: phase === 'result' ? again : toss
  }, phase === 'result' ? 'ЕЩЁ РАЗ' : busy ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "tt-flight-dots"
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("i", null)), phase === 'entering' ? 'ПРОБУЖДАЕМ' : phase === 'tossing' ? 'В ПОЛЁТЕ' : 'ЛОВИМ МОМЕНТ') : 'ПОДБРОСИТЬ'), /*#__PURE__*/React.createElement("span", {
    className: "tt-footnote"
  }, phase === 'choose' && choice === null ? 'ВЫБЕРИ СТОРОНУ ПЕРЕД БРОСКОМ' : 'ПРОСТО НА УДАЧУ'))));
}
window.TalismanToss = TalismanToss;
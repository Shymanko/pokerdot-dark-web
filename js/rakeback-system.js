// One source of truth for the illustrative rakeback calculation.
// Production must supply approved bands, activity thresholds and a server snapshot.
const RB_TALISMANS = [['anchor', 'Якорь'], ['shield', 'Щит'], ['ox', 'Бык'], ['dog', 'Собака'], ['horse', 'Конь'], ['tiger', 'Тигр'], ['compass', 'Компас'], ['clover', 'Клевер'], ['rooster', 'Петух'], ['star', 'Звезда'], ['crown', 'Корона'], ['dragon', 'Дракон']].map(([id, name], i) => ({
  id,
  name,
  index: i,
  rate: 22 - i,
  min: -500 + i * 1000 / 12,
  max: -500 + (i + 1) * 1000 / 12
}));
const RB_TEMPERATURES = [['Во льду', '#85ceff', .60], ['Промёрзший', '#9edbff', .70], ['Оттаивает', '#ade8ed', .80], ['Прохладный', '#bcd8df', .90], ['Нейтральный', '#c9ced7', 1], ['Тёплый', '#e9be89', 1.05], ['Разогретый', '#ffa36a', 1.10], ['Горячий', '#ff804f', 1.15], ['Пылающий', '#ff6044', 1.20], ['Раскалённый', '#ffd49a', 1.25]].map(([name, color, multiplier], i) => ({
  name,
  color,
  multiplier,
  index: i
}));
const RB_DEMO_SNAPSHOT = Object.freeze({
  luckBB: 240,
  activity: 6
});
const rbFmt = (v, d = 1) => Number(v.toFixed(d)).toLocaleString('ru-RU', {
  maximumFractionDigits: d
});
function rbTierFor(bb) {
  return Math.max(0, Math.min(11, Math.floor((Math.max(-500, Math.min(500, bb)) + 500) / 1000 * 12)));
}
function rbCalculation({
  luckBB = RB_DEMO_SNAPSHOT.luckBB,
  activity = RB_DEMO_SNAPSHOT.activity,
  tier = rbTierFor(luckBB),
  cardLevel = window.cmPlayer53?.level || 0
} = {}) {
  const talisman = RB_TALISMANS[Math.max(0, Math.min(11, tier))],
    temperature = RB_TEMPERATURES[Math.max(0, Math.min(9, activity))];
  const bonus = cardLevel > 0 ? window.cmLeague53?.rbExtra(cardLevel) || 0 : 0;
  const base = Math.round(talisman.rate * temperature.multiplier * 10000) / 10000,
    extra = base * bonus / 100;
  return {
    talisman,
    temperature,
    base,
    bonus,
    extra,
    total: base + extra,
    cardLevel,
    luckBB
  };
}

// Real GLB geometry. Temperature alters materials and attached 3D ice/fire effects.
function RbThermalModel({
  id,
  temperature = 4,
  mini = false,
  name = ''
}) {
  const canvas = React.useRef(null),
    live = React.useRef({
      temperature
    }),
    motion = React.useRef({
      yaw: -.20,
      pitch: .06,
      drag: null
    });
  const [status, setStatus] = React.useState('loading'),
    [retry, setRetry] = React.useState(0);
  live.current.temperature = temperature;
  React.useEffect(() => {
    const T = window.THREE,
      cv = canvas.current;
    let cancelled = false,
      renderer,
      raf,
      resize,
      visibility,
      model,
      env,
      fx,
      shown = temperature,
      visible = true,
      prev = 0;
    const ownedGeometry = [],
      ownedMaterials = [],
      materials = [],
      crystals = [],
      flames = [],
      embers = [];
    setStatus('loading');
    motion.current = {
      yaw: -.20,
      pitch: .06,
      drag: null
    };
    try {
      renderer = new T.WebGLRenderer({
        canvas: cv,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mini ? 1.5 : 2));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      const scene = new T.Scene();
      env = CH.envFor(renderer);
      scene.environment = env;
      const camera = new T.PerspectiveCamera(34, 1, .1, 30);
      camera.position.set(0, 0, mini ? 5.25 : 5.05);
      const pivot = new T.Group();
      scene.add(pivot);
      fx = new T.Group();
      pivot.add(fx);
      const key = new T.DirectionalLight('#e4f0ff', 2.8);
      key.position.set(-3, 4, 5);
      scene.add(key);
      const fill = new T.DirectionalLight('#fff1dc', 1.9);
      fill.position.set(3, -1, 4);
      scene.add(fill);
      const glow = new T.PointLight('#ff6428', 0, 7);
      glow.position.set(-1, .6, 1.7);
      scene.add(glow, new T.HemisphereLight('#ffffff', '#151b28', 1.2));
      const size = () => {
        const b = cv.getBoundingClientRect();
        if (!b.width || !b.height) return;
        renderer.setSize(b.width, b.height, false);
        camera.aspect = b.width / b.height;
        camera.updateProjectionMatrix();
      };
      resize = new ResizeObserver(size);
      resize.observe(cv);
      size();
      visibility = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
      });
      visibility.observe(cv);
      const crystalGeo = new T.ConeGeometry(1, 1, 5);
      ownedGeometry.push(crystalGeo);
      const crystalMat = new T.MeshPhysicalMaterial({
        color: '#8cdfff',
        metalness: .12,
        roughness: .13,
        transmission: .18,
        thickness: .3,
        transparent: true,
        opacity: .66,
        emissive: '#1f627f',
        emissiveIntensity: .07
      });
      ownedMaterials.push(crystalMat);
      for (let i = 0; i < 18; i++) {
        const a = i * 2.39996,
          r = i < 14 ? 1.04 : .86,
          k = new T.Mesh(crystalGeo, crystalMat);
        k.position.set(Math.cos(a) * r, Math.sin(a) * r, .10 + i % 3 * .09);
        k.rotation.set(.3 * Math.sin(a), .35 * Math.cos(a), a - Math.PI / 2);
        k.userData.size = .05 + i % 4 * .025;
        fx.add(k);
        crystals.push(k);
      }
      const flameGeo = new T.PlaneGeometry(.38, .90, 1, 1);
      ownedGeometry.push(flameGeo);
      const flameMat = new T.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: T.AdditiveBlending,
        side: T.DoubleSide,
        uniforms: {
          time: {
            value: 0
          },
          heat: {
            value: 0
          }
        },
        vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader: `varying vec2 vUv;uniform float time;uniform float heat;
    void main(){float y=vUv.y;float sway=sin(y*9.-time*2.6)*.065*y+sin(y*17.+time*1.7)*.025;float x=abs(vUv.x-.5+sway);float width=(1.-y)*.43;float a=smoothstep(width,width*.35,x)*sin(y*3.14159)*heat;vec3 c=mix(vec3(1.,.20,.025),vec3(1.,.85,.35),pow(1.-y,2.));gl_FragColor=vec4(c,a*.7);}`
      });
      ownedMaterials.push(flameMat);
      for (let i = 0; i < (mini ? 8 : 16); i++) {
        const f = new T.Mesh(flameGeo, flameMat),
          a = i * 2.39996;
        f.position.set(Math.cos(a) * .9, Math.sin(a) * .75 + .2, -.22);
        f.userData.phase = i * .63;
        fx.add(f);
        flames.push(f);
      }
      const emberGeo = new T.SphereGeometry(.014, 5, 4),
        emberMat = new T.MeshBasicMaterial({
          color: '#ffbb63',
          transparent: true,
          opacity: .7
        });
      ownedGeometry.push(emberGeo);
      ownedMaterials.push(emberMat);
      for (let i = 0; i < (mini ? 4 : 14); i++) {
        const e = new T.Mesh(emberGeo, emberMat);
        fx.add(e);
        embers.push(e);
      }
      dtLoadModel(id).then(gltf => {
        if (cancelled) return;
        model = gltf.scene.clone(true);
        model.traverse(o => {
          if (o.isMesh) {
            const original = Array.isArray(o.material) ? o.material : [o.material];
            const cloned = original.map(mat => {
              const m = mat.clone();
              m.envMapIntensity = 1.1;
              materials.push({
                m,
                color: m.color.clone(),
                emissive: m.emissive?.clone() || new T.Color(0),
                roughness: m.roughness,
                metalness: m.metalness
              });
              return m;
            });
            o.material = Array.isArray(o.material) ? cloned : cloned[0];
          }
        });
        const box = new T.Box3().setFromObject(model),
          center = box.getCenter(new T.Vector3()),
          extent = box.getSize(new T.Vector3()),
          scale = 2.22 / Math.max(extent.x, extent.y, extent.z);
        model.position.sub(center);
        const normal = new T.Group();
        normal.add(model);
        normal.scale.setScalar(scale);
        pivot.add(normal);
        setStatus('ready');
      }).catch(() => {
        if (!cancelled) setStatus('error');
      });
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches,
        coldColor = new T.Color('#9ddfff'),
        hotColor = new T.Color('#ed672c');
      const render = t => {
        if (cancelled) return;
        raf = requestAnimationFrame(render);
        if (!visible || document.hidden || t - prev < (mini ? 55 : 30)) return;
        const dt = Math.min(.1, (t - prev) / 1000);
        prev = t;
        shown += (live.current.temperature - shown) * (reduced ? 1 : Math.min(1, dt * 5));
        const cold = Math.max(0, (4 - shown) / 4),
          hot = Math.max(0, (shown - 4) / 5);
        materials.forEach(({
          m,
          color,
          emissive,
          roughness,
          metalness
        }) => {
          m.color.copy(color).lerp(coldColor, cold * .48).lerp(hotColor, hot * .45);
          m.roughness = roughness + cold * .14;
          m.metalness = metalness * (1 - cold * .55);
          if (m.emissive) {
            m.emissive.copy(emissive).lerp(hotColor, hot);
            m.emissiveIntensity = hot * .72;
          }
        });
        crystals.forEach((k, i) => {
          k.visible = cold > .04;
          k.scale.set(k.userData.size * cold, k.userData.size * 2.8 * cold, k.userData.size * cold);
        });
        flameMat.uniforms.time.value = reduced ? 0 : t / 1000;
        flameMat.uniforms.heat.value = Math.max(0, (hot - .15) / .85);
        flames.forEach((f, i) => {
          f.visible = hot > .15;
          f.scale.set(.55 + hot * .75, (.28 + hot) * (reduced ? 1 : 1 + Math.sin(t / 650 + i) * .14), 1);
        });
        embers.forEach((e, i) => {
          const life = reduced ? i % 5 / 5 : (t / 2400 + i * .173) % 1;
          e.visible = hot > .35;
          e.position.set(Math.sin(i * 7.1) * 1.1 + Math.sin(life * 4 + i) * .08, -.5 + life * 2.4, .12 + Math.cos(i) * .2);
          e.scale.setScalar((1 - life) * hot);
        });
        glow.color.set(cold > 0 ? '#69caff' : '#ff6028');
        glow.intensity = cold * .8 + hot * 2.1;
        const m = motion.current;
        pivot.rotation.set(m.pitch, m.yaw + (reduced || m.drag ? 0 : Math.sin(t / 4200) * .045), 0);
        pivot.position.y = reduced ? 0 : Math.sin(t / 3200) * .024;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(render);
    } catch (e) {
      setStatus('error');
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      resize?.disconnect();
      visibility?.disconnect();
      materials.forEach(({
        m
      }) => m.dispose());
      ownedGeometry.forEach(g => g.dispose());
      ownedMaterials.forEach(m => m.dispose());
      if (renderer) {
        CH.envs.get(renderer)?.dispose();
        CH.envs.delete(renderer);
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [id, mini, retry]);
  const stop = e => {
    motion.current.drag = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };
  return /*#__PURE__*/React.createElement("span", {
    className: 'rb-thermal ' + (mini ? 'rb-thermal-mini' : ''),
    "data-status": status,
    style: {
      '--thermal': RB_TEMPERATURES[temperature].color
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-thermal-aura"
  }), status !== 'ready' && /*#__PURE__*/React.createElement("img", {
    className: "rb-thermal-fallback",
    src: `assets/talismans3d/${id}.png`,
    alt: ""
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvas,
    role: "img",
    "aria-label": `${name}, ${RB_TEMPERATURES[temperature].name}. 3D талисман${mini ? '' : '. Потяните для вращения'}`,
    tabIndex: mini ? -1 : 0,
    onPointerDown: e => {
      if (mini) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      motion.current.drag = {
        x: e.clientX,
        y: e.clientY
      };
    },
    onPointerMove: e => {
      const m = motion.current;
      if (!m.drag) return;
      m.yaw += (e.clientX - m.drag.x) * .009;
      m.pitch = Math.max(-.7, Math.min(.7, m.pitch + (e.clientY - m.drag.y) * .007));
      m.drag = {
        x: e.clientX,
        y: e.clientY
      };
    },
    onPointerUp: stop,
    onPointerCancel: stop,
    onKeyDown: e => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        motion.current.yaw += e.key === 'ArrowLeft' ? -.25 : .25;
      }
    }
  }), status === 'error' && !mini && /*#__PURE__*/React.createElement("button", {
    className: "rb-model-retry",
    onClick: () => setRetry(v => v + 1)
  }, "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C 3D \u0435\u0449\u0451 \u0440\u0430\u0437"));
}
function RbChevron() {
  return /*#__PURE__*/React.createElement("svg", {
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
  }));
}
function RbRateWidget({
  variant = 'default',
  onOverlay
}) {
  const ref = React.useRef(null),
    [host, setHost] = React.useState(null),
    [, refresh] = React.useState(0);
  React.useEffect(() => {
    const f = () => refresh(v => v + 1);
    window.addEventListener('me-refresh', f);
    return () => window.removeEventListener('me-refresh', f);
  }, []);
  React.useEffect(() => {
    onOverlay?.(!!host);
    return () => onOverlay?.(false);
  }, [host, onOverlay]);
  const c = rbCalculation();
  return /*#__PURE__*/React.createElement("div", {
    className: 'rb-rate-wrap rb-rate-' + variant,
    ref: ref,
    "data-i18n": "off"
  }, /*#__PURE__*/React.createElement("button", {
    className: "rb-rate-widget",
    "aria-label": `Ваш рейкбек ${rbFmt(c.total)}%. Открыть расчёт`,
    onClick: () => setHost(ref.current.closest('[data-app-root]') || ref.current.parentElement)
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-rate-copy"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-eyebrow"
  }, "\u0412\u0410\u0428 \u0420\u0415\u0419\u041A\u0411\u0415\u041A"), /*#__PURE__*/React.createElement("strong", null, rbFmt(c.total), /*#__PURE__*/React.createElement("small", null, "%")), /*#__PURE__*/React.createElement("span", {
    className: "rb-rate-description"
  }, rbFmt(c.base), "% \u0431\u0430\u0437\u0430 + \u0431\u043E\u043D\u0443\u0441 \u043A\u0430\u0440\u0442\u044B"), /*#__PURE__*/React.createElement("span", {
    className: "rb-rate-link"
  }, "\u041A\u0430\u043A \u0441\u043A\u043B\u0430\u0434\u044B\u0432\u0430\u0435\u0442\u0441\u044F ", /*#__PURE__*/React.createElement(RbChevron, null))), /*#__PURE__*/React.createElement("span", {
    className: "rb-rate-model",
    "aria-hidden": "true"
  }, !host && /*#__PURE__*/React.createElement(RbThermalModel, {
    id: c.talisman.id,
    temperature: c.temperature.index,
    name: c.talisman.name,
    mini: true
  }), /*#__PURE__*/React.createElement("span", null, c.talisman.name, " \xB7 ", c.temperature.name.toLowerCase()))), /*#__PURE__*/React.createElement("span", {
    className: "rb-demo-caption"
  }, "\u0414\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u043E\u043D\u043D\u044B\u0439 \u0440\u0430\u0441\u0447\u0451\u0442"), host && ReactDOM.createPortal(/*#__PURE__*/React.createElement(RbRateDetails, {
    onClose: () => setHost(null)
  }), host));
}
function RbTemperatureBar({
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "rb-temp-control"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-temp-steps",
    role: "group",
    "aria-label": "10 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0439 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438"
  }, RB_TEMPERATURES.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: s.name,
    type: "button",
    "aria-label": `${i + 1}. ${s.name}`,
    "aria-pressed": value === i,
    onClick: () => onChange(i),
    style: {
      '--step-color': s.color
    }
  }, /*#__PURE__*/React.createElement("i", null), /*#__PURE__*/React.createElement("span", null, i + 1)))), /*#__PURE__*/React.createElement("div", {
    className: "rb-temp-labels"
  }, /*#__PURE__*/React.createElement("span", null, "\u041C\u0430\u043B\u043E \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438"), /*#__PURE__*/React.createElement("span", null, "\u041C\u043D\u043E\u0433\u043E \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438")));
}
function RbRateDetails({
  onClose
}) {
  const [tab, setTab] = React.useState('rate'),
    [preview, setPreview] = React.useState(null),
    [temp, setTemp] = React.useState(RB_DEMO_SNAPSHOT.activity),
    [cards, setCards] = React.useState(false),
    [explain, setExplain] = React.useState(false);
  const scroll = React.useRef(null),
    dialog = React.useRef(null),
    savedFocus = React.useRef(null),
    current = rbCalculation(),
    c = rbCalculation({
      tier: preview ?? current.talisman.index,
      activity: preview == null ? current.temperature.index : temp
    });
  React.useEffect(() => {
    savedFocus.current = document.activeElement;
    window.dispatchEvent(new CustomEvent('px-full', {
      detail: 1
    }));
    dialog.current?.querySelector('button')?.focus({
      preventScroll: true
    });
    return () => {
      window.dispatchEvent(new CustomEvent('px-full', {
        detail: -1
      }));
      savedFocus.current?.focus?.({
        preventScroll: true
      });
    };
  }, []);
  const close = () => {
    if (cards) setCards(false);else if (preview != null) setPreview(null);else onClose();
  };
  const changeTab = t => {
    setTab(t);
    setPreview(null);
    scroll.current?.scrollTo({
      top: 0
    });
  };
  const inspect = i => {
    setPreview(i);
    setTemp(current.temperature.index);
    scroll.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const trap = e => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      close();
    }
    if (e.key === 'Tab') {
      const nodes = [...dialog.current.querySelectorAll('button,[tabindex="0"]')].filter(n => n.getClientRects().length);
      const a = nodes[0],
        b = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === a) {
        e.preventDefault();
        b?.focus();
      } else if (!e.shiftKey && document.activeElement === b) {
        e.preventDefault();
        a?.focus();
      }
    }
  };
  return /*#__PURE__*/React.createElement("section", {
    ref: dialog,
    className: "rb-rate-screen",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u0412\u0430\u0448 \u0440\u0435\u0439\u043A\u0431\u0435\u043A",
    "data-i18n": "off",
    onKeyDown: trap
  }, /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header rb-rate-header"
  }, /*#__PURE__*/React.createElement("button", {
    className: "me-back",
    "aria-label": "\u041D\u0430\u0437\u0430\u0434 \u0438\u0437 \u0440\u0430\u0441\u0447\u0451\u0442\u0430 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430",
    onClick: close
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m15 6-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("h1", null, preview != null ? 'ПРОСМОТР ТАЛИСМАНА' : 'ВАШ РЕЙКБЕК'), /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "rb-rate-tabs"
  }, window.SSegment && /*#__PURE__*/React.createElement(window.SSegment, {
    options: [{
      id: 'rate',
      label: 'РАСЧЁТ'
    }, {
      id: 'catalog',
      label: '12 ТАЛИСМАНОВ'
    }],
    value: tab,
    onChange: changeTab,
    accent: "#d71921"
  })), /*#__PURE__*/React.createElement("div", {
    className: "rb-rate-scroll",
    ref: scroll
  }, (tab === 'rate' || preview != null) && /*#__PURE__*/React.createElement(React.Fragment, null, preview != null && /*#__PURE__*/React.createElement("div", {
    className: "rb-preview-notice"
  }, "\u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \xB7 \u0432\u0430\u0448 \u0440\u0435\u0439\u043A\u0431\u0435\u043A \u043D\u0435 \u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F"), /*#__PURE__*/React.createElement("div", {
    className: "rb-rate-hero",
    style: {
      '--thermal': c.temperature.color
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-hero-heading"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-eyebrow"
  }, preview != null ? 'В ЭТОМ ПРИМЕРЕ' : 'ВОЗВРАЩАЕТСЯ ОТ РЕЙКА'), /*#__PURE__*/React.createElement("strong", null, rbFmt(c.total), /*#__PURE__*/React.createElement("small", null, "%")), /*#__PURE__*/React.createElement("span", {
    className: "rb-demo-tag"
  }, "\u0414\u0435\u043C\u043E")), /*#__PURE__*/React.createElement(RbThermalModel, {
    id: c.talisman.id,
    temperature: c.temperature.index,
    name: c.talisman.name
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-talisman-name"
  }, /*#__PURE__*/React.createElement("h2", null, c.talisman.name), /*#__PURE__*/React.createElement("span", {
    style: {
      color: c.temperature.color
    }
  }, /*#__PURE__*/React.createElement("i", null), c.temperature.name, " ", /*#__PURE__*/React.createElement("b", null, c.temperature.index + 1, "/10")))), preview != null ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(RbTemperatureBar, {
    value: temp,
    onChange: setTemp
  }), /*#__PURE__*/React.createElement("p", {
    className: "rb-help"
  }, "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435, \u0447\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C, \u043A\u0430\u043A \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u043C\u0435\u043D\u044F\u0435\u0442 \u0442\u0430\u043B\u0438\u0441\u043C\u0430\u043D \u0438 \u0431\u0430\u0437\u043E\u0432\u044B\u0439 \u0440\u0435\u0439\u043A\u0431\u0435\u043A.")) : /*#__PURE__*/React.createElement("div", {
    className: "rb-current-signals"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "\u0423\u0434\u0430\u0447\u0430"), /*#__PURE__*/React.createElement("strong", null, "+", current.luckBB, " ", /*#__PURE__*/React.createElement("small", null, "BB")), /*#__PURE__*/React.createElement("small", null, "\u0412\u0430\u043C \u0432\u0435\u0437\u0451\u0442")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", null, "\u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C"), /*#__PURE__*/React.createElement("strong", null, c.temperature.index + 1, /*#__PURE__*/React.createElement("small", null, " / 10")), /*#__PURE__*/React.createElement("small", null, c.temperature.name))), /*#__PURE__*/React.createElement("div", {
    className: "rb-explanation"
  }, /*#__PURE__*/React.createElement("h2", null, "\u041F\u043E\u0447\u0435\u043C\u0443 \u0442\u0430\u043A\u043E\u0439 \u043F\u0440\u043E\u0446\u0435\u043D\u0442?"), /*#__PURE__*/React.createElement("p", null, preview != null ? c.talisman.index >= 6 ? 'При такой удаче компенсация ниже.' : 'При такой удаче компенсация выше.' : c.talisman.index >= 6 ? 'Сейчас вам везёт — компенсация ниже.' : 'Сейчас удача ниже — компенсация выше.', " ", c.temperature.index < 4 ? 'Низкая активность охлаждает талисман и уменьшает базовый рейкбек.' : c.temperature.index === 4 ? 'При нейтральной активности базовый рейкбек без поправки.' : 'Активность разогревает талисман и повышает базовый рейкбек.')), /*#__PURE__*/React.createElement("div", {
    className: "rb-calculation",
    "aria-label": "\u0420\u0430\u0441\u0447\u0451\u0442 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-calc-line"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "\u0417\u0430 \u0443\u0434\u0430\u0447\u0443"), /*#__PURE__*/React.createElement("small", null, "\u0422\u0430\u043B\u0438\u0441\u043C\u0430\u043D \xAB", c.talisman.name, "\xBB")), /*#__PURE__*/React.createElement("strong", null, rbFmt(c.talisman.rate), "%")), /*#__PURE__*/React.createElement("div", {
    className: "rb-calc-line"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "\u041F\u043E\u043F\u0440\u0430\u0432\u043A\u0430 \u0437\u0430 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C"), /*#__PURE__*/React.createElement("small", null, c.temperature.name, " \xB7 ", c.temperature.index + 1, " \u0438\u0437 10")), /*#__PURE__*/React.createElement("strong", null, c.base >= c.talisman.rate ? '+' : '−', rbFmt(Math.abs(c.base - c.talisman.rate), 2), " ", /*#__PURE__*/React.createElement("small", null, "\u043F.\u043F."))), /*#__PURE__*/React.createElement("div", {
    className: "rb-calc-line rb-calc-base"
  }, /*#__PURE__*/React.createElement("span", null, "\u0411\u0430\u0437\u043E\u0432\u044B\u0439 \u0440\u0435\u0439\u043A\u0431\u0435\u043A"), /*#__PURE__*/React.createElement("strong", null, rbFmt(c.base, 2), "%")), /*#__PURE__*/React.createElement("button", {
    className: "rb-calc-card",
    onClick: () => setCards(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-mini-card"
  }, window.LevelCard53 && /*#__PURE__*/React.createElement(window.LevelCard53, {
    level: Math.max(1, c.cardLevel),
    w: 32
  })), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "\u0411\u043E\u043D\u0443\u0441 \u043A\u0430\u0440\u0442\u044B +", rbFmt(c.bonus), "%"), /*#__PURE__*/React.createElement("small", null, c.cardLevel, " \u0438\u0437 53 \u043A\u0430\u0440\u0442 \xB7 \u043A \u0431\u0430\u0437\u043E\u0432\u043E\u043C\u0443 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0443")), /*#__PURE__*/React.createElement("strong", null, "+", rbFmt(c.extra, 2), /*#__PURE__*/React.createElement("small", null, " \u043F.\u043F.")), /*#__PURE__*/React.createElement(RbChevron, null)), /*#__PURE__*/React.createElement("div", {
    className: "rb-calc-total"
  }, /*#__PURE__*/React.createElement("span", null, preview != null ? 'В этом примере' : 'Ваш рейкбек'), /*#__PURE__*/React.createElement("strong", null, rbFmt(c.total), "%"))), /*#__PURE__*/React.createElement("p", {
    className: "rb-percent-note"
  }, "\u043F.\u043F. \u2014 \u043F\u0440\u043E\u0446\u0435\u043D\u0442\u043D\u044B\u0435 \u043F\u0443\u043D\u043A\u0442\u044B: \u043F\u0440\u0438\u0431\u0430\u0432\u043A\u0430 \u043A \u0441\u0442\u0430\u0432\u043A\u0435 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430."), /*#__PURE__*/React.createElement("p", {
    className: "rb-example"
  }, "\u0421 \u043A\u0430\u0436\u0434\u044B\u0445 ", /*#__PURE__*/React.createElement("b", null, "$100 \u0440\u0435\u0439\u043A\u0430"), " \u2014 ", /*#__PURE__*/React.createElement("b", null, "$", rbFmt(c.total, 2), " \u0432\u043E\u0437\u0432\u0440\u0430\u0442\u0430"), " \u0432 \u044D\u0442\u043E\u043C \u043F\u0440\u0438\u043C\u0435\u0440\u0435."), /*#__PURE__*/React.createElement("button", {
    className: "rb-text-link",
    "aria-expanded": explain,
    onClick: () => setExplain(!explain)
  }, "\u041A\u0430\u043A \u043F\u0440\u0438\u0431\u0430\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0431\u043E\u043D\u0443\u0441 \u043A\u0430\u0440\u0442\u044B ", /*#__PURE__*/React.createElement("span", null, explain ? '−' : '+')), explain && /*#__PURE__*/React.createElement("p", {
    className: "rb-help rb-card-explainer"
  }, "\u0411\u043E\u043D\u0443\u0441 +", rbFmt(c.bonus), "% \u0443\u0432\u0435\u043B\u0438\u0447\u0438\u0432\u0430\u0435\u0442 \u0432\u0430\u0448\u0443 \u0431\u0430\u0437\u0443: ", rbFmt(c.base, 2), "% \xD7 ", rbFmt(c.bonus), "% = \u0435\u0449\u0451 ", rbFmt(c.extra, 2), " \u043F\u0440\u043E\u0446\u0435\u043D\u0442\u043D\u043E\u0433\u043E \u043F\u0443\u043D\u043A\u0442\u0430. \u0418\u0442\u043E\u0433\u043E ", rbFmt(c.total), "%. \u041E\u0442\u043A\u0440\u044B\u0442\u044B\u0435 \u043A\u0430\u0440\u0442\u044B \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u044E\u0442\u0441\u044F, \u0434\u0430\u0436\u0435 \u043A\u043E\u0433\u0434\u0430 \u043C\u0435\u043D\u044F\u044E\u0442\u0441\u044F \u0443\u0434\u0430\u0447\u0430 \u0438 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C."), /*#__PURE__*/React.createElement("button", {
    className: "rb-brand-button",
    onClick: () => changeTab('catalog')
  }, "\u0412\u0441\u0435 \u0442\u0430\u043B\u0438\u0441\u043C\u0430\u043D\u044B \u0438 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F ", /*#__PURE__*/React.createElement(RbChevron, null)), /*#__PURE__*/React.createElement("div", {
    className: "rb-demo-note"
  }, "\u041F\u0440\u043E\u0446\u0435\u043D\u0442\u044B \u0438 \u0433\u0440\u0430\u043D\u0438\u0446\u044B \u0443\u0440\u043E\u0432\u043D\u0435\u0439 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u044B \u0434\u043B\u044F \u0434\u0435\u043C\u043E\u043D\u0441\u0442\u0440\u0430\u0446\u0438\u0438. \u0418\u0442\u043E\u0433\u043E\u0432\u0443\u044E \u0442\u0430\u0431\u043B\u0438\u0446\u0443 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430 \u0435\u0449\u0451 \u043F\u0440\u0435\u0434\u0441\u0442\u043E\u0438\u0442 \u0443\u0442\u0432\u0435\u0440\u0434\u0438\u0442\u044C.")), tab === 'catalog' && preview == null && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "rb-catalog-intro"
  }, /*#__PURE__*/React.createElement("h2", null, "\u0423\u0434\u0430\u0447\u0430 \u0432\u044B\u0431\u0438\u0440\u0430\u0435\u0442 \u0442\u0430\u043B\u0438\u0441\u043C\u0430\u043D"), /*#__PURE__*/React.createElement("p", null, "\u0427\u0435\u043C \u043C\u0435\u043D\u044C\u0448\u0435 \u0432\u0435\u0437\u0451\u0442, \u0442\u0435\u043C \u0431\u043E\u043B\u044C\u0448\u0435 \u0431\u0430\u0437\u043E\u0432\u044B\u0439 \u0440\u0435\u0439\u043A\u0431\u0435\u043A. \u0422\u0430\u043B\u0438\u0441\u043C\u0430\u043D \u043C\u0435\u043D\u044F\u0435\u0442\u0441\u044F \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u0438 \u0432\u043C\u0435\u0441\u0442\u0435 \u0441 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u0435\u043C \u0443\u0434\u0430\u0447\u0438.")), /*#__PURE__*/React.createElement("div", {
    className: "rb-luck-direction"
  }, /*#__PURE__*/React.createElement("span", null, "\u041C\u0435\u043D\u044C\u0448\u0435 \u0443\u0434\u0430\u0447\u0438", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "\u0411\u043E\u043B\u044C\u0448\u0435 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430")), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"), /*#__PURE__*/React.createElement("span", null, "\u0411\u043E\u043B\u044C\u0448\u0435 \u0443\u0434\u0430\u0447\u0438", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("b", null, "\u041C\u0435\u043D\u044C\u0448\u0435 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430"))), /*#__PURE__*/React.createElement("div", {
    className: "rb-talisman-grid"
  }, RB_TALISMANS.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    "aria-label": `Талисман ${t.name}. Посмотреть 10 состояний`,
    onClick: () => inspect(i),
    "data-current": i === current.talisman.index
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-tile-index"
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("img", {
    loading: "lazy",
    src: `assets/talismans3d/${t.id}.png`,
    alt: ""
  }), /*#__PURE__*/React.createElement("strong", null, t.name), /*#__PURE__*/React.createElement("span", null, i === current.talisman.index ? 'Ваш талисман' : '10 состояний')))), /*#__PURE__*/React.createElement("div", {
    className: "rb-catalog-intro"
  }, /*#__PURE__*/React.createElement("h2", null, "\u0410\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u044C \u0437\u0430\u0434\u0430\u0451\u0442 \u0442\u0435\u043C\u043F\u0435\u0440\u0430\u0442\u0443\u0440\u0443"), /*#__PURE__*/React.createElement("p", null, "\u041C\u0430\u043B\u043E \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438 \u2014 \u0442\u0430\u043B\u0438\u0441\u043C\u0430\u043D \u0432\u043E \u043B\u044C\u0434\u0443. \u0411\u043E\u043B\u044C\u0448\u0435 \u0430\u043A\u0442\u0438\u0432\u043D\u043E\u0441\u0442\u0438 \u2014 \u043E\u043D \u043E\u0442\u0442\u0430\u0438\u0432\u0430\u0435\u0442 \u0438 \u043D\u0430\u0433\u0440\u0435\u0432\u0430\u0435\u0442\u0441\u044F. \u0423 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0442\u0430\u043B\u0438\u0441\u043C\u0430\u043D\u0430 10 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0439.")), /*#__PURE__*/React.createElement("div", {
    className: "rb-state-list"
  }, RB_TEMPERATURES.map((t, i) => /*#__PURE__*/React.createElement("button", {
    key: t.name,
    onClick: () => {
      setPreview(current.talisman.index);
      setTemp(i);
      scroll.current?.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: t.color
    }
  }, String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("b", null, t.name), /*#__PURE__*/React.createElement("i", {
    style: {
      background: t.color
    }
  }), /*#__PURE__*/React.createElement(RbChevron, null)))), /*#__PURE__*/React.createElement("p", {
    className: "rb-demo-note"
  }, "\u042D\u0442\u043E \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F \u043E\u0434\u043D\u043E\u0433\u043E \u0442\u0430\u043B\u0438\u0441\u043C\u0430\u043D\u0430, \u0430 \u043D\u0435 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B \u0434\u043B\u044F \u043F\u043E\u043A\u0443\u043F\u043A\u0438. \u041F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043A\u0430\u0442\u0430\u043B\u043E\u0433\u0430 \u043D\u0435 \u043C\u0435\u043D\u044F\u0435\u0442 \u0432\u0430\u0448\u0438 \u043F\u043E\u043A\u0430\u0437\u0430\u0442\u0435\u043B\u0438."))), cards && /*#__PURE__*/React.createElement("div", {
    className: "rb-rate-collection"
  }, /*#__PURE__*/React.createElement(RbCardCollection, {
    onClose: () => setCards(false)
  })));
}
Object.assign(window, {
  RB_TALISMANS,
  RB_TEMPERATURES,
  RB_DEMO_SNAPSHOT,
  rbCalculation,
  RbRateWidget,
  RbRateDetails,
  RbThermalModel
});
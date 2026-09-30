// Closed GLB medallions: solid metal body, milled edges, sculpted front, embossed reverse.
const DT_MODEL_CACHE = new Map();
let DT_GLTF_LOADER;
function dtLoadModel(animal) {
  if (!DT_MODEL_CACHE.has(animal)) {
    const p = (DT_GLTF_LOADER || (DT_GLTF_LOADER = import('../vendor/three-addons/loaders/GLTFLoader.js'))).then(({
      GLTFLoader
    }) => new GLTFLoader().loadAsync(`assets/talismans3d/${animal}.glb?v=polish-112`));
    DT_MODEL_CACHE.set(animal, p);
    p.catch(() => DT_MODEL_CACHE.delete(animal));
  }
  return DT_MODEL_CACHE.get(animal);
}
function Talisman3D({
  animal = 'tiger',
  dormant = false,
  onInfo
}) {
  const canvas = React.useRef(null),
    motion = React.useRef(null);
  const [status, setStatus] = React.useState('loading'),
    [attempt, setAttempt] = React.useState(0);
  const [touched, setTouched] = React.useState(false);
  React.useEffect(() => {
    let cancelled = false,
      raf = 0,
      observer,
      renderer,
      env,
      scene,
      model;
    const T = window.THREE,
      cv = canvas.current;
    const m = {
      yaw: -.27,
      pitch: .10,
      vy: 0,
      vx: 0,
      drag: null,
      last: performance.now(),
      visible: true,
      interacted: false,
      start: 0
    };
    motion.current = m;
    setStatus('loading');
    setTouched(false);
    const suspend = event => {
      m.suspended = !!event.detail;
    };
    window.addEventListener('dt-toss-active', suspend);
    try {
      renderer = new T.WebGLRenderer({
        canvas: cv,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.12;
      scene = new T.Scene();
      env = CH.envFor(renderer);
      scene.environment = env;
      const camera = new T.PerspectiveCamera(31, 1, .1, 20);
      camera.position.set(0, 0, 4.55);
      const key = new T.DirectionalLight(0xffffff, 2.0);
      key.position.set(-3, 4, 5);
      scene.add(key);
      const rim = new T.DirectionalLight(0xd4e1ff, 1.8);
      rim.position.set(4, 1, -2);
      scene.add(rim);
      const red = new T.PointLight(0xee182d, .8, 8);
      red.position.set(-2, -1, 1);
      scene.add(red);
      scene.add(new T.HemisphereLight(0xffffff, 0x23252c, .7));
      const size = () => {
        const b = cv.getBoundingClientRect();
        renderer.setSize(Math.max(1, b.width), Math.max(1, b.height), false);
        camera.aspect = b.width / b.height;
        camera.updateProjectionMatrix();
      };
      observer = new ResizeObserver(size);
      observer.observe(cv);
      size();
      dtLoadModel(animal).then(gltf => {
        if (cancelled) return;
        model = gltf.scene.clone(true);
        model.traverse(o => {
          if (o.isMesh) {
            o.material = o.material.clone();
            o.material.envMapIntensity = .9;
            if (dormant) {
              o.material.color.multiplyScalar(.3);
              o.material.roughness = .65;
            }
          }
        });
        const box = new T.Box3().setFromObject(model),
          center = box.getCenter(new T.Vector3());
        model.position.sub(center);
        const pivot = new T.Group();
        pivot.add(model);
        scene.add(pivot);
        m.pivot = pivot;
        m.start = performance.now();
        setStatus('ready');
      }).catch(() => {
        if (!cancelled) setStatus('error');
      });
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const render = t => {
        if (cancelled) return;
        const dt = Math.min(.04, (t - m.last) / 1000);
        m.last = t;
        if (m.pivot) {
          if (!m.drag) {
            m.yaw += m.vy * dt;
            m.pitch = Math.max(-1, Math.min(1, m.pitch + m.vx * dt));
            m.vy *= Math.exp(-4.5 * dt);
            m.vx *= Math.exp(-5 * dt);
          }
          const entrance = reduced ? 1 : Math.max(0, Math.min(1, (t - m.start) / 1000)),
            ease = 1 - Math.pow(1 - entrance, 4);
          m.pivot.rotation.set(m.pitch, m.yaw + (reduced || m.interacted ? 0 : Math.sin(t / 4300) * .08) - (1 - ease) * .52, 0);
          m.pivot.position.y = (reduced ? 0 : Math.sin(t / 2800) * .022) - (1 - ease) * .16;
          m.pivot.scale.setScalar(.86 + .14 * ease);
          if (!reduced) {
            key.position.x = -3 + Math.sin(t / 3600) * 1.15;
            red.intensity = .6 + Math.sin(t / 4400) * .12;
          }
          if (!document.hidden && !m.suspended) renderer.render(scene, camera);
        }
        raf = requestAnimationFrame(render);
      };
      raf = requestAnimationFrame(render);
    } catch (e) {
      setStatus('error');
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('dt-toss-active', suspend);
      observer?.disconnect();
      if (model) model.traverse(o => {
        if (o.isMesh) o.material.dispose();
      });
      const target = renderer && CH.envs.get(renderer);
      target?.dispose();
      if (renderer) {
        CH.envs.delete(renderer);
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [animal, dormant, attempt]);
  const reset = () => {
    const m = motion.current;
    if (m) {
      m.yaw = -.27;
      m.pitch = .10;
      m.vx = m.vy = 0;
      m.interacted = false;
    }
    setTouched(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "dt-model-stage",
    "data-state": status
  }, /*#__PURE__*/React.createElement("div", {
    className: "dt-model-halo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dt-model-shadow"
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvas,
    role: "img",
    tabIndex: 0,
    "aria-label": `3D талисман ${dtAN(animal)}. Перетащите для вращения на 360 градусов. Стрелки вращают, Home возвращает вид.`,
    onPointerDown: e => {
      const m = motion.current;
      if (!m || status !== 'ready') return;
      e.currentTarget.setPointerCapture(e.pointerId);
      m.drag = {
        x: e.clientX,
        y: e.clientY,
        t: performance.now()
      };
      m.vy = m.vx = 0;
      m.interacted = true;
      setTouched(true);
    },
    onPointerMove: e => {
      const m = motion.current,
        d = m?.drag;
      if (!d) return;
      const now = performance.now(),
        dt = Math.max(.016, (now - d.t) / 1000),
        dx = e.clientX - d.x,
        dy = e.clientY - d.y;
      m.yaw += dx * .009;
      m.pitch = Math.max(-1, Math.min(1, m.pitch + dy * .007));
      m.vy = Math.max(-4, Math.min(4, dx * .009 / dt));
      m.vx = Math.max(-2, Math.min(2, dy * .007 / dt));
      m.drag = {
        x: e.clientX,
        y: e.clientY,
        t: now
      };
    },
    onPointerUp: e => {
      const m = motion.current;
      if (m) m.drag = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {}
    },
    onPointerCancel: () => {
      const m = motion.current;
      if (m) {
        m.drag = null;
        m.vx = m.vy = 0;
      }
    },
    onKeyDown: e => {
      const m = motion.current;
      if (!m) return;
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key)) {
        e.preventDefault();
        m.interacted = true;
        setTouched(true);
        if (e.key === 'Home') reset();else if (e.key === 'ArrowLeft') m.yaw -= .3;else if (e.key === 'ArrowRight') m.yaw += .3;else m.pitch = Math.max(-1, Math.min(1, m.pitch + (e.key === 'ArrowUp' ? -.2 : .2)));
      }
    }
  }), status === 'loading' && /*#__PURE__*/React.createElement("div", {
    className: "dt-model-loader",
    role: "status"
  }, /*#__PURE__*/React.createElement("span", null), "\u0417\u0410\u0413\u0420\u0423\u0416\u0410\u0415\u041C \u0422\u0410\u041B\u0418\u0421\u041C\u0410\u041D"), status === 'error' && /*#__PURE__*/React.createElement("div", {
    className: "dt-model-loader"
  }, /*#__PURE__*/React.createElement("span", null, "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C 3D"), /*#__PURE__*/React.createElement("button", {
    style: UI.btn('s', 'ghost'),
    onClick: () => setAttempt(v => v + 1)
  }, "\u041F\u041E\u0412\u0422\u041E\u0420\u0418\u0422\u042C")), status === 'ready' && /*#__PURE__*/React.createElement("div", {
    className: "dt-model-controls"
  }, /*#__PURE__*/React.createElement("span", {
    className: touched ? 'is-touched' : ''
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.3"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 8C-1 16 25 16 20 8M17 7l3 1-1 3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 7V4a3 3 0 0 1 6 0v9M7 10l2 3v-3M9 18h6"
  })), "\u0412\u0420\u0410\u0429\u0410\u0419\u0422\u0415 \u0422\u0410\u041B\u0418\u0421\u041C\u0410\u041D")));
}
function DtCount({
  value,
  decimals = 1,
  prefix = '',
  suffix = ''
}) {
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    let raf;
    const start = performance.now(),
      reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShown(0);
    const tick = t => {
      const p = reduced ? 1 : Math.max(0, Math.min(1, (t - start) / 850));
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, prefix, shown.toFixed(decimals), suffix);
}
Object.assign(window, {
  Talisman3D,
  DtCount
});
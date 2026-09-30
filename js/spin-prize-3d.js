// Chosen Monopoly-style reference 01, without a stand: a chrome wheel with six sectors.
function SpinPrize3D() {
  const canvas = React.useRef(null),
    visible = React.useRef(false),
    [seen, setSeen] = React.useState(false),
    [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      visible.current = entries[0].isIntersecting;
      if (visible.current) setSeen(true);
    }, {
      rootMargin: '60px'
    });
    observer.observe(canvas.current);
    return () => observer.disconnect();
  }, []);
  React.useEffect(() => {
    if (!seen) return;
    let cancelled = false,
      raf = 0,
      renderer,
      model,
      observer,
      environment;
    const T = window.THREE,
      cv = canvas.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      renderer = new T.WebGLRenderer({
        canvas: cv,
        alpha: true,
        antialias: true,
        powerPreference: 'low-power'
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      const scene = new T.Scene(),
        camera = new T.PerspectiveCamera(35, 1, .1, 20);
      camera.position.set(0, 0, 2.60);
      const studio = new T.Scene();
      studio.add(new T.Mesh(new T.BoxGeometry(24, 24, 24), new T.MeshBasicMaterial({
        color: 0x202329,
        side: T.BackSide
      })));
      [[3, 13, -5, 3, 7, 4.5], [2, 12, 5, 2, 6, 5], [12, 3, 0, 8, 1, 4], [8, 2, 0, -5, 6, 2.2], [5, 8, 1, 1, -9, 2.5]].forEach(([w, h, x, y, z, power]) => {
        const mat = new T.MeshBasicMaterial({
          color: 0xffffff
        });
        mat.color.multiplyScalar(power);
        const panel = new T.Mesh(new T.PlaneGeometry(w, h), mat);
        panel.position.set(x, y, z);
        panel.lookAt(0, 0, 0);
        studio.add(panel);
      });
      const pmrem = new T.PMREMGenerator(renderer);
      environment = pmrem.fromScene(studio, .025);
      pmrem.dispose();
      studio.traverse(o => {
        if (o.isMesh) {
          o.geometry.dispose();
          o.material.dispose();
        }
      });
      scene.environment = environment.texture;
      const key = new T.DirectionalLight(0xffffff, 1.2);
      key.position.set(-3, 4, 4);
      scene.add(key);
      scene.add(new T.HemisphereLight(0xffffff, 0x15171a, .3));
      const size = () => {
        const r = cv.getBoundingClientRect();
        renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
        camera.aspect = r.width / Math.max(1, r.height);
        camera.updateProjectionMatrix();
      };
      observer = new ResizeObserver(size);
      observer.observe(cv);
      size();
      dtLoadModel('spin-lottery-wheel').then(gltf => {
        if (cancelled) return;
        model = gltf.scene.clone(true);
        model.traverse(o => {
          if (o.isMesh) {
            o.material = o.material.clone();
            o.material.envMapIntensity = .95;
          }
        });
        const center = new T.Box3().setFromObject(model).getCenter(new T.Vector3());
        model.position.sub(center);
        const pivot = new T.Group();
        pivot.add(model);
        scene.add(pivot);
        const rotor = model.getObjectByName('LotteryRotor');
        let age = 0,
          last = performance.now();
        setReady(true);
        const render = t => {
          if (cancelled) return;
          const dt = Math.min(.05, (t - last) / 1000);
          last = t;
          if (visible.current && !document.hidden) {
            if (!reduced) age += dt;
            const p = reduced ? 1 : Math.min(1, age / 1.6),
              ease = 1 - Math.pow(1 - p, 4);
            pivot.rotation.set(.14, -.38, 0);
            pivot.scale.setScalar(.88 + .12 * ease);
            pivot.position.y = -(1 - ease) * .10;
            if (rotor) rotor.rotation.z = reduced ? .18 : -age * .56 + (1 - ease) * Math.PI * 2;
            renderer.render(scene, camera);
          }
          raf = requestAnimationFrame(render);
        };
        raf = requestAnimationFrame(render);
      }).catch(() => {});
    } catch (_) {}
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      if (model) model.traverse(o => {
        if (o.isMesh) o.material.dispose();
      });
      environment?.dispose();
      if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
      }
    };
  }, [seen]);
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-spin-object",
    "data-ready": ready,
    role: "img",
    "aria-label": "\u0425\u0440\u043E\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u043E\u0435 3D-\u043A\u043E\u043B\u0435\u0441\u043E Spin & Win \u0441 \u0448\u0435\u0441\u0442\u044C\u044E \u0441\u0435\u043A\u0442\u043E\u0440\u0430\u043C\u0438"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/talismans3d/spin-lottery-wheel.png?v=wheel-79",
    alt: ""
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvas
  }));
}
window.SpinPrize3D = SpinPrize3D;
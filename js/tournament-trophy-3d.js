// Real GLB trophy with a studio-rendered fallback; never blocks reading statistics.
function TournamentTrophy3D() {
  const canvas = React.useRef(null),
    [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const cv = canvas.current,
      T = window.THREE;
    let cancelled = false,
      renderer,
      env,
      resize,
      intersection,
      raf = 0,
      model,
      visible = true;
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
      renderer.toneMappingExposure = .95;
      const scene = new T.Scene(),
        camera = new T.PerspectiveCamera(32, 1, .1, 20);
      camera.position.set(0, .15, 5.05);
      camera.lookAt(0, 0, 0);
      const studio = new T.Scene();
      studio.add(new T.Mesh(new T.BoxGeometry(20, 20, 20), new T.MeshBasicMaterial({
        color: 0x24262c,
        side: T.BackSide
      })));
      [[3, 10, -5, 3, 5, 4], [2, 9, 5, 2, 4, 5], [9, 3, 0, 7, 0, 4], [4, 6, -3, 1, -5, 3], [4, 5, 0, 1, 7, 1.3]].forEach(([w, h, x, y, z, power]) => {
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
      env = pmrem.fromScene(studio, .035);
      pmrem.dispose();
      studio.traverse(o => {
        if (o.isMesh) {
          o.geometry.dispose();
          o.material.dispose();
        }
      });
      scene.environment = env.texture;
      const key = new T.DirectionalLight(0xffffff, 1.7);
      key.position.set(-3, 4, 5);
      scene.add(key);
      scene.add(new T.HemisphereLight(0xffffff, 0x14151a, .4));
      let draw = () => {};
      const size = () => {
        const r = cv.getBoundingClientRect();
        renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
        camera.aspect = r.width / Math.max(1, r.height);
        camera.updateProjectionMatrix();
        draw();
      };
      resize = new ResizeObserver(size);
      resize.observe(cv);
      size();
      intersection = new IntersectionObserver(entries => {
        visible = entries[0].isIntersecting;
        if (visible) draw();
      });
      intersection.observe(cv);
      dtLoadModel('tournament-trophy').then(gltf => {
        if (cancelled) return;
        model = gltf.scene.clone(true);
        model.traverse(o => {
          if (o.isMesh) {
            o.material = o.material.clone();
            o.material.envMapIntensity = 1.1;
          }
        });
        const box = new T.Box3().setFromObject(model),
          center = box.getCenter(new T.Vector3()),
          scale = 2.1 / box.getSize(new T.Vector3()).y;
        model.position.copy(center).multiplyScalar(-scale);
        model.scale.setScalar(scale);
        const pivot = new T.Group();
        pivot.add(model);
        pivot.rotation.set(.16, -.32, -.07);
        scene.add(pivot);
        let age = 0,
          last = performance.now();
        draw = () => renderer.render(scene, camera);
        const tick = t => {
          if (cancelled) return;
          const dt = Math.min(.05, (t - last) / 1000);
          last = t;
          if (visible && !document.hidden) {
            if (!reduced) age += dt;
            pivot.rotation.set(.16, -.32 + (reduced ? 0 : Math.sin(age * .6) * .09), -.07);
            draw();
          }
          if (!reduced) raf = requestAnimationFrame(tick);
        };
        tick(performance.now());
        setReady(true);
      }).catch(() => {});
    } catch (_) {}
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      resize?.disconnect();
      intersection?.disconnect();
      model?.traverse(o => {
        if (o.isMesh) o.material.dispose();
      });
      env?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "ms-trophy-object",
    "data-ready": ready,
    role: "img",
    "aria-label": "3D-\u043A\u0443\u0431\u043E\u043A PokerDot: \u0445\u0440\u043E\u043C, \u0447\u0451\u0440\u043D\u044B\u0439 \u043C\u0435\u0442\u0430\u043B\u043B \u0438 \u043A\u0440\u0430\u0441\u043D\u0430\u044F \u044D\u043C\u0430\u043B\u044C"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/talismans3d/tournament-trophy.png?v=2",
    alt: ""
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvas
  }));
}
window.TournamentTrophy3D = TournamentTrophy3D;
// Real GLB trophy with a studio-rendered fallback; never blocks reading statistics.
function TournamentTrophy3D({
  interactive = false
}) {
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
      visible = true,
      removeControls = () => {};
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
        color: 0x4a4c52,
        side: T.BackSide
      })));
      [[3, 10, -5, 3, 5, 4], [2, 9, 5, 2, 4, 5], [9, 3, 0, 7, 0, 4], [4, 6, -3, 1, -5, 3], [4, 5, 0, 1, 7, 1.3], [2, 9, -5, -3, 4, 4], [2, 9, 5, -3, 4, 4]].forEach(([w, h, x, y, z, power]) => {
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
        camera.position.z = Math.max(5.05, 2.65 / (2 * Math.tan(16 * Math.PI / 180) * camera.aspect));
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
      dtLoadModel('tournament-trophy-wing').then(gltf => {
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
        pivot.rotation.set(.24, -.12, 0);
        scene.add(pivot);
        let age = 0,
          last = performance.now();
        draw = () => renderer.render(scene, camera);
        let drag = null,
          turned = false,
          pitch = .24,
          yaw = -.12;
        if (interactive) {
          const down = e => {
            if (e.button !== 0) return;
            drag = [e.clientX, e.clientY];
            turned = true;
            cv.setPointerCapture(e.pointerId);
            cv.focus();
          };
          const move = e => {
            if (!drag) return;
            yaw += (e.clientX - drag[0]) * .009;
            pitch = Math.max(-.5, Math.min(1.1, pitch + (e.clientY - drag[1]) * .006));
            drag = [e.clientX, e.clientY];
            pivot.rotation.set(pitch, yaw, 0);
            draw();
          };
          const up = () => {
            drag = null;
          };
          const key = e => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key)) return;
            e.preventDefault();
            turned = true;
            if (e.key === 'Home') {
              yaw = -.12;
              pitch = .24;
            } else if (e.key === 'ArrowLeft') yaw -= .15;else if (e.key === 'ArrowRight') yaw += .15;else pitch = Math.max(-.5, Math.min(1.1, pitch + (e.key === 'ArrowUp' ? -.1 : .1)));
            pivot.rotation.set(pitch, yaw, 0);
            draw();
          };
          cv.addEventListener('pointerdown', down);
          cv.addEventListener('pointermove', move);
          cv.addEventListener('pointerup', up);
          cv.addEventListener('pointercancel', up);
          cv.addEventListener('keydown', key);
          removeControls = () => {
            cv.removeEventListener('pointerdown', down);
            cv.removeEventListener('pointermove', move);
            cv.removeEventListener('pointerup', up);
            cv.removeEventListener('pointercancel', up);
            cv.removeEventListener('keydown', key);
          };
        }
        const tick = t => {
          if (cancelled) return;
          const dt = Math.min(.05, (t - last) / 1000);
          last = t;
          if (visible && !document.hidden) {
            if (!reduced) age += dt;
            if (!turned) pivot.rotation.set(.24, -.12 + (reduced ? 0 : Math.sin(age * .6) * .065), 0);
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
      removeControls();
      resize?.disconnect();
      intersection?.disconnect();
      model?.traverse(o => {
        if (o.isMesh) o.material.dispose();
      });
      env?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, [interactive]);
  return /*#__PURE__*/React.createElement("div", {
    className: 'ms-trophy-object' + (interactive ? ' is-interactive' : ''),
    "data-ready": ready,
    role: interactive ? undefined : 'img',
    "aria-label": "3D-\u043A\u0443\u0431\u043E\u043A PokerDot: \u0448\u0438\u0440\u043E\u043A\u0430\u044F \u0447\u0430\u0448\u0430, \u0445\u0440\u043E\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0435 \u043A\u0440\u044B\u043B\u044C\u044F \u0438 \u0440\u0443\u0431\u0438\u043D\u043E\u0432\u043E\u0435 \u043E\u0441\u043D\u043E\u0432\u0430\u043D\u0438\u0435"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/talismans3d/tournament-trophy-wing.png?v=1",
    alt: ""
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvas,
    tabIndex: interactive ? 0 : undefined,
    "aria-label": interactive ? '3D-модель кубка. Обертайте перетягуванням або клавішами зі стрілками. Home — початковий ракурс.' : undefined
  }));
}
window.TournamentTrophy3D = TournamentTrophy3D;
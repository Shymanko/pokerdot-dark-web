// Native round podium; results stay in a steady HTML row below the matching places.
function spFinishLabel(n) {
  return n % 100 >= 11 && n % 100 <= 14 ? 'финишей' : n % 10 === 1 ? 'финиш' : [2, 3, 4].includes(n % 10) ? 'финиша' : 'финишей';
}
function SpinPodium3D({
  counts
}) {
  const host = React.useRef(null),
    canvas = React.useRef(null),
    [ready, setReady] = React.useState(false),
    [near, setNear] = React.useState(false);
  React.useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true);
    }, {
      rootMargin: '180px'
    });
    io.observe(host.current);
    return () => io.disconnect();
  }, []);
  React.useEffect(() => {
    if (!near) return;
    const cv = canvas.current,
      T = window.THREE;
    let cancelled = false,
      renderer,
      env,
      resize,
      visibility,
      raf = 0,
      model,
      shadowPlane,
      shown = true;
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
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = T.PCFSoftShadowMap;
      const scene = new T.Scene(),
        camera = new T.OrthographicCamera(-.24, .24, .1333, -.1333, .01, 5);
      camera.position.set(.08, .46, .9);
      camera.lookAt(0, .059, 0);
      camera.updateMatrixWorld();
      const studio = new T.Scene();
      studio.add(new T.Mesh(new T.BoxGeometry(20, 20, 20), new T.MeshBasicMaterial({
        color: 0x414750,
        side: T.BackSide
      })));
      [[5, 8, -4, 5, 5, 3], [2, 8, 5, 2, 3, 3], [10, 3, 0, 8, -2, 4], [5, 6, 0, 1, 7, 1.5]].forEach(([w, h, x, y, z, power]) => {
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
      env = pmrem.fromScene(studio, .03);
      pmrem.dispose();
      studio.traverse(o => {
        if (o.isMesh) {
          o.geometry.dispose();
          o.material.dispose();
        }
      });
      scene.environment = env.texture;
      const key = new T.DirectionalLight(0xfff4df, 2.5);
      key.position.set(-.4, .8, .6);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      Object.assign(key.shadow.camera, {
        left: -.4,
        right: .4,
        top: .4,
        bottom: -.4,
        near: .1,
        far: 3
      });
      key.shadow.bias = -.00002;
      key.shadow.normalBias = .0005;
      scene.add(key);
      scene.add(new T.HemisphereLight(0xf0f5ff, 0x10131a, .55));
      const rim = new T.DirectionalLight(0xdde8ff, 1.6);
      rim.position.set(.4, .4, -.3);
      scene.add(rim);
      shadowPlane = new T.Mesh(new T.PlaneGeometry(.9, .7), new T.ShadowMaterial({
        opacity: .26
      }));
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -.001;
      shadowPlane.receiveShadow = true;
      scene.add(shadowPlane);
      let hasDrawn = false;
      const draw = () => {
        if (cancelled || !model || !shown || document.hidden) return;
        renderer.render(scene, camera);
        if (!hasDrawn) {
          hasDrawn = true;
          setReady(true);
        }
      };
      const size = () => {
        const r = cv.getBoundingClientRect();
        renderer.setSize(Math.max(1, r.width), Math.max(1, r.height), false);
        const halfH = .24 * r.height / Math.max(1, r.width);
        camera.top = halfH;
        camera.bottom = -halfH;
        camera.updateProjectionMatrix();
        draw();
      };
      resize = new ResizeObserver(size);
      resize.observe(cv);
      size();
      visibility = new IntersectionObserver(([entry]) => {
        shown = entry.isIntersecting;
        if (shown) draw();
      });
      visibility.observe(cv);
      dtLoadModel('spin-podium-round-v2').then(gltf => {
        if (cancelled) return;
        model = gltf.scene.clone(true);
        model.traverse(o => {
          if (o.isMesh) {
            o.material = o.material.clone();
            o.material.envMapIntensity = .9;
            o.castShadow = true;
            o.receiveShadow = true;
          }
        });
        scene.add(model);
        draw();
        // The podium and text stay still. Only a very subtle light pass brings out the metal.
        if (!reduced) {
          let prev = 0;
          const tick = t => {
            if (cancelled) return;
            if (t - prev > 40) {
              prev = t;
              rim.intensity = 1.55 + Math.sin(t * .0005) * .15;
              draw();
            }
            raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      }).catch(() => {});
    } catch (_) {}
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      resize?.disconnect();
      visibility?.disconnect();
      model?.traverse(o => {
        if (o.isMesh) o.material.dispose();
      });
      shadowPlane?.geometry.dispose();
      shadowPlane?.material.dispose();
      env?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, [near]);
  return /*#__PURE__*/React.createElement("div", {
    ref: host,
    className: "ms-podium-scene ms-podium-round",
    "data-ready": ready
  }, /*#__PURE__*/React.createElement("div", {
    className: "ms-podium-art"
  }, /*#__PURE__*/React.createElement("img", {
    className: "ms-podium-render",
    src: "assets/talismans3d/spin-podium-round.png?v=2",
    alt: ""
  }), /*#__PURE__*/React.createElement("canvas", {
    ref: canvas,
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "ms-podium-counts"
  }, [2, 1, 3].map(place => /*#__PURE__*/React.createElement("div", {
    key: place,
    className: "ms-podium-result",
    "data-place": place,
    "aria-label": `${place}-е место: ${counts[place - 1]} ${spFinishLabel(counts[place - 1])}`
  }, /*#__PURE__*/React.createElement("small", null, place, " \u041C\u0415\u0421\u0422\u041E"), /*#__PURE__*/React.createElement("strong", null, /*#__PURE__*/React.createElement(MsNumber, {
    value: counts[place - 1]
  })), /*#__PURE__*/React.createElement("span", null, spFinishLabel(counts[place - 1]))))));
}
window.SpinPodium3D = SpinPodium3D;
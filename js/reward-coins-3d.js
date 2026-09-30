// Recorded real coin contacts: syncopika / OpenGameArt, CC0. See assets/audio/LICENSE.txt.
window.rbCoinAudio = (() => {
  let ctx,
    loading,
    lastHit = -Infinity;
  const voices = new Set(),
    buffers = [];
  const files = Array.from({
    length: 4
  }, (_, i) => fetch(`assets/audio/coin-contact-${i}.wav`).then(r => r.arrayBuffer()).catch(() => null));
  const prepare = () => {
    try {
      const prefs = window.pxSoundPrefs;
      if (prefs && (!prefs.enabled || prefs.volume <= 0)) return null;
      ctx = window.__ppAudioCtx && window.__ppAudioCtx.state !== 'closed' ? window.__ppAudioCtx : window.__ppAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      if (!loading) loading = Promise.all(files.map(async (f, i) => {
        const data = await f;
        if (data) buffers[i] = await ctx.decodeAudioData(data.slice(0));
      })).catch(() => {});
      return ctx;
    } catch (_) {
      return null;
    }
  };
  const hit = (index = 0, strength = 1) => {
    const c = prepare(),
      buffer = buffers[index % 4];
    if (!c || !buffer || c.currentTime - lastHit < .055) return;
    lastHit = c.currentTime;
    const src = c.createBufferSource(),
      gain = c.createGain(),
      pan = c.createStereoPanner();
    src.buffer = buffer;
    src.playbackRate.value = .96 + index % 3 * .035;
    gain.gain.value = Math.min(.65, strength * .65) * (window.pxSoundPrefs?.volume ?? .7);
    pan.pan.value = (index % 3 - 1) * .25;
    src.connect(gain);
    gain.connect(pan);
    pan.connect(c.destination);
    voices.add(src);
    src.onended = () => {
      voices.delete(src);
      src.disconnect();
      gain.disconnect();
      pan.disconnect();
    };
    src.start();
  };
  return {
    prepare,
    hit,
    stop: () => {
      voices.forEach(v => {
        try {
          v.stop();
        } catch (_) {}
      });
      voices.clear();
    }
  };
})();
// Solid gold coin with raised DOT relief; shared geometry and materials.
function RbRewardMetalCoins3D({
  timeline,
  phase,
  kind,
  getPose,
  onReady,
  symbol,
  preview = false
}) {
  const canvas = React.useRef(null),
    latest = React.useRef({
      phase,
      kind
    }),
    callback = React.useRef(onReady);
  latest.current = {
    phase,
    kind
  };
  callback.current = onReady;
  React.useEffect(() => {
    const cv = canvas.current,
      T = window.THREE,
      CH = window.CH3D;
    if (!cv || !T || !CH) {
      callback.current?.(false);
      return;
    }
    let r,
      scene,
      raf = 0,
      observer,
      dead = false,
      clock = 0,
      last = 0,
      studioTarget;
    const textures = [],
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    try {
      let w = cv.parentElement.clientWidth,
        h = cv.parentElement.clientHeight;
      r = CH.renderer(cv, w, h, .95);
      r.setPixelRatio(Math.min(3, Math.max(2, window.devicePixelRatio || 1)));
      r.setSize(w, h, false);
      r.shadowMap.enabled = true;
      r.shadowMap.type = T.PCFSoftShadowMap;
      scene = new T.Scene();
      const camera = new T.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, .1, 2400);
      camera.position.z = 1000;
      // Same photographic environment used by the embossed playing cards.
      const env = CH.envFor(r),
        ambient = new T.HemisphereLight(0xffffff, 0x26344d, .25);
      scene.add(ambient);
      const key = new T.DirectionalLight(0xffffff, .6);
      key.position.set(-180, 380, 470);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      Object.assign(key.shadow.camera, {
        left: -220,
        right: 220,
        top: 240,
        bottom: -240,
        near: 1,
        far: 1200
      });
      key.shadow.bias = -.0002;
      scene.add(key);
      const rim = new T.DirectionalLight(0xc2d5ff, .45);
      rim.position.set(230, 30, -80);
      scene.add(rim);
      // One raised-relief master, shared mesh data for every copy.
      const gold = new T.MeshPhysicalMaterial({
        color: 0xd7af63,
        metalness: 1,
        roughness: .25,
        clearcoat: .35,
        clearcoatRoughness: .18,
        envMap: env,
        envMapIntensity: 1
      });
      const polish = new T.MeshPhysicalMaterial({
        color: 0xe9c582,
        metalness: 1,
        roughness: .14,
        clearcoat: 1,
        clearcoatRoughness: .1,
        envMap: env,
        envMapIntensity: 1.2
      });
      // Subtle radial machining in roughness only: detail without glittering normals.
      const grain = new Uint8Array(256 * 256 * 4);
      let seed = 71;
      for (let y = 0; y < 256; y++) for (let x = 0; x < 256; x++) {
        seed = seed * 1664525 + 1013904223 >>> 0;
        const radius = Math.hypot(x - 128, y - 128),
          v = 190 + Math.sin(radius * 4) * 9 + (seed / 4294967296 - .5) * 16,
          i = (y * 256 + x) * 4;
        grain[i] = grain[i + 1] = grain[i + 2] = v;
        grain[i + 3] = 255;
      }
      const finish = new T.DataTexture(grain, 256, 256, T.RGBAFormat);
      finish.needsUpdate = true;
      finish.generateMipmaps = true;
      finish.minFilter = T.LinearMipmapLinearFilter;
      finish.magFilter = T.LinearFilter;
      finish.anisotropy = Math.min(8, r.capabilities.getMaxAnisotropy());
      textures.push(finish);
      gold.roughnessMap = finish;
      const master = new T.Group();
      // Minted profile: narrow rounded bevel, flat die face and a recessed reeded band.
      const profile = [[0, -.071], [.935, -.071], [.969, -.069], [.990, -.056], [1, -.035], [1, .035], [.990, .056], [.969, .069], [.935, .071], [0, .071]].map(([x, y]) => new T.Vector2(x, y));
      const body = new T.Mesh(new T.LatheGeometry(profile, 192), gold);
      body.castShadow = true;
      master.add(body);
      // Radial grooves have rounded shoulders and never interrupt the silhouette.
      const edgeGeo = new T.CylinderGeometry(1.001, 1.001, .063, 384, 1, true),
        pos = edgeGeo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i),
          z = pos.getZ(i),
          a = Math.atan2(z, x),
          rr = .998 + .003 * Math.cos(a * 72);
        pos.setX(i, x * rr);
        pos.setZ(i, z * rr);
      }
      edgeGeo.computeVertexNormals();
      const edgeMesh = new T.Mesh(edgeGeo, polish);
      master.add(edgeMesh);
      for (const side of [-1, 1]) {
        for (const [radius, tube, y] of [[.962, .011, .064], [.879, .004, .073]]) {
          const ring = new T.Mesh(new T.TorusGeometry(radius, tube, 10, 192), polish);
          ring.rotation.x = Math.PI / 2;
          ring.position.y = side * y;
          master.add(ring);
        }
        for (const [x, z] of [[0, -.3], [-.3, 0], [.3, 0], [0, .3]]) {
          const dot = new T.Mesh(new T.SphereGeometry(.164, 48, 24), polish);
          dot.scale.y = .18;
          dot.position.set(x, side * .078, z);
          dot.castShadow = true;
          master.add(dot);
        }
      }
      if (kind === 'tdollar') {
        // A solid ticket with rounded corners and punched side notches.
        master.clear();
        const shape = new T.Shape();
        shape.moveTo(-1.2, -.64);
        shape.lineTo(1.2, -.64);
        shape.quadraticCurveTo(1.3, -.64, 1.3, -.54);
        shape.lineTo(1.3, -.15);
        shape.absarc(1.3, 0, .15, -Math.PI / 2, -Math.PI * 1.5, true);
        shape.lineTo(1.3, .54);
        shape.quadraticCurveTo(1.3, .64, 1.2, .64);
        shape.lineTo(-1.2, .64);
        shape.quadraticCurveTo(-1.3, .64, -1.3, .54);
        shape.lineTo(-1.3, .15);
        shape.absarc(-1.3, 0, .15, Math.PI / 2, -Math.PI / 2, true);
        shape.lineTo(-1.3, -.54);
        shape.quadraticCurveTo(-1.3, -.64, -1.2, -.64);
        const geo = new T.ExtrudeGeometry(shape, {
          depth: .055,
          bevelEnabled: true,
          bevelSize: .015,
          bevelThickness: .012,
          bevelSegments: 3,
          curveSegments: 20
        });
        geo.translate(0, 0, -.0275);
        geo.rotateX(-Math.PI / 2);
        const edgeMat = new T.MeshPhysicalMaterial({
          color: 0xdccba5,
          metalness: .65,
          roughness: .26,
          envMap: env,
          clearcoat: 1
        });
        master.add(new T.Mesh(geo, edgeMat));
        const art = document.createElement('canvas');
        art.width = 1040;
        art.height = 512;
        const g = art.getContext('2d');
        g.fillStyle = '#eee9dc';
        g.fillRect(0, 0, 1040, 512);
        g.strokeStyle = '#aa8a50';
        g.lineWidth = 4;
        g.strokeRect(33, 28, 974, 456);
        g.fillStyle = '#191b21';
        g.font = '700 45px sans-serif';
        g.fillText('POKERDOT', 75, 95);
        g.font = '700 176px sans-serif';
        g.fillText('T$', 72, 310);
        g.font = '500 25px sans-serif';
        g.fillText('TOURNAMENT ENTRY', 76, 420);
        g.setLineDash([9, 12]);
        g.beginPath();
        g.moveTo(777, 30);
        g.lineTo(777, 482);
        g.stroke();
        g.setLineDash([]);
        for (let n = 0; n < 29; n++) {
          g.fillRect(824 + n * 4, 105, n % 3 === 0 ? 3 : 1, 245);
        }
        g.font = '500 19px sans-serif';
        g.fillText('DOT / TICKET', 812, 405);
        const texture = new T.CanvasTexture(art);
        texture.colorSpace = T.SRGBColorSpace;
        texture.anisotropy = 8;
        textures.push(texture);
        const faceGeo = new T.ShapeGeometry(shape, 20),
          uv = faceGeo.attributes.uv,
          ps = faceGeo.attributes.position;
        for (let i = 0; i < ps.count; i++) uv.setXY(i, (ps.getX(i) + 1.3) / 2.6, (ps.getY(i) + .64) / 1.28);
        uv.needsUpdate = true;
        const faceMat = new T.MeshPhysicalMaterial({
          map: texture,
          metalness: .18,
          roughness: .35,
          clearcoat: .7,
          envMap: env
        });
        for (const side of [-1, 1]) {
          const face = new T.Mesh(faceGeo, faceMat);
          face.rotation.x = side > 0 ? -Math.PI / 2 : Math.PI / 2;
          face.position.y = side * .047;
          master.add(face);
        }
      }
      const makeCoin = () => {
        const coin = master.clone(true);
        coin.traverse(o => {
          if (o.isMesh) {
            o.material = o.material.clone();
            o.material.transparent = true;
          }
        });
        return coin;
      };
      const pile = new T.Group();
      pile.scale.setScalar(1.3);
      pile.rotation.x = .56;
      scene.add(pile);
      const motionData = window.RbCoinMotion,
        coins = Array.from({
          length: 8
        }, () => {
          const coin = makeCoin();
          coin.scale.setScalar(29);
          coin.visible = false;
          pile.add(coin);
          return coin;
        });
      const floor = new T.Mesh(new T.PlaneGeometry(320, 240), new T.ShadowMaterial({
        opacity: .25
      }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -.25;
      floor.receiveShadow = true;
      pile.add(floor);
      const departure = [...coins].reverse();
      const departures = new Map(),
        impacts = new Set();
      const impact = (id, index, strength = 1) => {
        if (!reduced && !impacts.has(id)) {
          impacts.add(id);
          window.rbCoinAudio.hit(index, strength);
        }
      };
      const flying = Array.from({
        length: kind === 'main' ? 0 : 16
      }, () => {
        const coin = makeCoin();
        coin.visible = false;
        scene.add(coin);
        return coin;
      });
      const resize = () => {
        if (dead) return;
        w = cv.parentElement.clientWidth;
        h = cv.parentElement.clientHeight;
        r.setSize(w, h, false);
        camera.left = -w / 2;
        camera.right = w / 2;
        camera.top = h / 2;
        camera.bottom = -h / 2;
        camera.updateProjectionMatrix();
        pile.position.set(0, h / 2 - h * .555 - 20, 0);
      };
      resize();
      observer = new ResizeObserver(resize);
      observer.observe(cv.parentElement);
      const draw = now => {
        if (dead) return;
        const dt = last ? Math.min(.05, (now - last) / 1000) : 0;
        last = now;
        if (!document.hidden) {
          clock += dt;
          const elapsed = preview ? 650 : reduced ? kind === 'main' ? 3400 : 4400 : timeline.current.elapsed || 0;
          if (kind === 'main') {
            const clamp = n => Math.max(0, Math.min(1, n)),
              smooth = n => n * n * (3 - 2 * n);
            cv.style.maskImage = elapsed < 1000 ? 'linear-gradient(to bottom,transparent 46%,black 53%)' : 'none';
            pile.position.set(0, h / 2 - h * .665, 0);
            pile.rotation.y = -.14;
            pile.scale.setScalar(1.3);
            pile.visible = true;
            const seconds = Math.max(0, (elapsed - 60) / 1000 * 1.22),
              frame = seconds * motionData.fps,
              fi = Math.min(motionData.frames.length - 1, Math.floor(frame)),
              fj = Math.min(fi + 1, motionData.frames.length - 1),
              blend = frame - Math.floor(frame);
            coins.forEach((coin, i) => {
              if (departures.has(coin)) return;
              const a = motionData.frames[fi][i],
                b = motionData.frames[fj][i] || a;
              coin.visible = !!a;
              if (!a) return;
              coin.position.set((a[0] + (b[0] - a[0]) * blend) * 29, (a[1] + (b[1] - a[1]) * blend) * 29, (a[2] + (b[2] - a[2]) * blend) * 29);
              coin.quaternion.set(...a.slice(3));
              coin.quaternion.slerp(new T.Quaternion(...b.slice(3)), blend);
            });
            motionData.impacts.forEach(([at, index, force], i) => {
              if (seconds >= at) impact('contact' + i, index, force);
            });
            pile.updateMatrixWorld(true);
            departure.forEach((coin, i) => {
              const start = 1900 + i * 65,
                raw = clamp((elapsed - start) / 950);
              if (elapsed < start) return;
              if (!departures.has(coin)) {
                scene.attach(coin);
                departures.set(coin, {
                  pos: coin.position.clone(),
                  scale: coin.scale.clone(),
                  quat: coin.quaternion.clone()
                });
              }
              const from = departures.get(coin),
                t = smooth(raw),
                q = 1 - t;
              const target = new T.Vector3(-92, h / 2 - 102, 100),
                side = i % 2 ? 1 : -1;
              coin.position.set(q * q * q * from.pos.x + 3 * q * q * t * (from.pos.x + side * 35) + 3 * q * t * t * (target.x + side * 24) + t * t * t * target.x, q * q * q * from.pos.y + 3 * q * q * t * (from.pos.y + 90) + 3 * q * t * t * (target.y - 75) + t * t * t * target.y, from.pos.z + (target.z - from.pos.z) * t + Math.sin(t * Math.PI) * 25);
              coin.scale.copy(from.scale).multiplyScalar(1 - .97 * t);
              coin.quaternion.copy(from.quat);
              coin.rotateY(Math.sin(t * Math.PI) * .45);
              coin.rotateZ(side * t * .45);
              coin.visible = raw < 1;
            });
            floor.visible = elapsed < 3100;
          } else {
            pile.visible = true;
            floor.visible = !preview && elapsed < 3500;
            if (preview) {
              pile.scale.setScalar(.85);
              pile.position.y = -12;
              pile.rotation.y = Math.sin(clock * .55) * .18;
            }
            coins.forEach((coin, i) => {
              const pose = motionData.frames[motionData.frames.length - 1][i];
              if (!departures.has(coin)) {
                coin.visible = true;
                if (kind === 'tdollar') {
                  coin.position.set((i % 3 - 1) * 15, i * 4, 0);
                  coin.rotation.set(.55, (i - 3) * .09, 0);
                } else {
                  coin.position.set(pose[0] * 29, pose[1] * 29, pose[2] * 29);
                  coin.quaternion.set(...pose.slice(3));
                }
                const arrival = Math.max(0, Math.min(1, elapsed / 650));
                coin.scale.setScalar(29 * (.9 + .1 * arrival));
                coin.traverse(o => {
                  if (o.isMesh) o.material.opacity = arrival;
                });
              }
              const start = 900 + i * 85,
                duration = 1650 + i % 3 * 90,
                raw = Math.max(0, Math.min(1, (elapsed - start) / duration));
              if (elapsed < start) return;
              if (!departures.has(coin)) {
                pile.updateMatrixWorld(true);
                scene.attach(coin);
                departures.set(coin, {
                  pos: coin.position.clone(),
                  scale: coin.scale.clone(),
                  quat: coin.quaternion.clone()
                });
              }
              const from = departures.get(coin),
                t = raw * raw * (3 - 2 * raw),
                q = 1 - t,
                target = new T.Vector3(-90, h / 2 - 107, 90),
                side = i % 2 ? 1 : -1;
              coin.position.set(q * q * q * from.pos.x + 3 * q * q * t * (from.pos.x + side * 42) + 3 * q * t * t * (target.x + side * 30) + t * t * t * target.x, q * q * q * from.pos.y + 3 * q * q * t * (from.pos.y + 75) + 3 * q * t * t * (target.y - 65) + t * t * t * target.y, from.pos.z + (target.z - from.pos.z) * t);
              coin.scale.copy(from.scale).multiplyScalar(1 - .97 * t);
              coin.quaternion.copy(from.quat);
              coin.rotateY(Math.sin(t * Math.PI) * .65);
              coin.rotateZ(side * t * .32);
              coin.visible = raw < 1;
            });
          }
          r.render(scene, camera);
        }
        raf = requestAnimationFrame(draw);
      };
      pile.visible = false;
      r.render(scene, camera);
      callback.current?.(true);
      raf = requestAnimationFrame(draw);
      const lost = e => {
        e.preventDefault();
        callback.current?.(false);
      };
      cv.addEventListener('webglcontextlost', lost);
      return () => {
        dead = true;
        window.rbCoinAudio.stop();
        cancelAnimationFrame(raf);
        observer.disconnect();
        cv.removeEventListener('webglcontextlost', lost);
        textures.forEach(t => t.dispose());
        studioTarget?.dispose();
        CH.release(scene, r);
      };
    } catch (error) {
      console.warn('Reward 3D fallback:', error.message);
      dead = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      textures.forEach(t => t.dispose());
      studioTarget?.dispose();
      if (r) {
        if (scene) CH.release(scene, r);else r.dispose();
      }
      callback.current?.(false);
    }
  }, [kind, symbol, preview]);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvas,
    className: "rb-pay-coins-3d",
    "aria-label": kind === 'tdollar' ? "Объёмные турнирные билеты" : "Объёмные золотые монеты",
    role: "img",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 4
    }
  });
}
window.RbRewardMetalCoins3D = RbRewardMetalCoins3D;

// Flexible banknotes, sharing the card renderer and studio lighting.
function RbRewardCoins3D({
  timeline,
  phase,
  kind,
  onReady,
  preview = false
}) {
  const canvas = React.useRef(null),
    callback = React.useRef(onReady);
  callback.current = onReady;
  React.useEffect(() => {
    const cv = canvas.current,
      T = window.THREE,
      CH = window.CH3D;
    if (!cv || !T || !CH) {
      callback.current?.(false);
      return;
    }
    let r,
      scene,
      raf,
      observer,
      dead = false;
    const textures = [];
    try {
      let w = cv.parentElement.clientWidth,
        h = cv.parentElement.clientHeight;
      r = CH.renderer(cv, w, h, 1.08);
      r.setPixelRatio(Math.min(3, Math.max(2, devicePixelRatio || 1)));
      r.setSize(w, h, false);
      scene = new T.Scene();
      const cam = new T.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, .1, 2000);
      cam.position.z = 1100;
      const env = CH.envFor(r);
      scene.add(new T.HemisphereLight(0xffffff, 0x434b5b, 1.6));
      const light = new T.DirectionalLight(0xffffff, 1.7);
      light.position.set(-140, 240, 350);
      scene.add(light);
      const tourney = kind === 'tdollar',
        unit = kind === 'main' ? '$' : tourney ? 'T$' : 'C$',
        ink = tourney ? '#302b23' : '#f0eee8',
        accent = tourney ? '#a3844c' : '#dc2939';
      const art = document.createElement('canvas');
      art.width = 1400;
      art.height = 650;
      const g = art.getContext('2d');
      g.fillStyle = tourney ? '#eee9dc' : '#20232a';
      g.fillRect(0, 0, 1400, 650);
      g.strokeStyle = tourney ? '#bba575' : '#9097a4';
      g.lineWidth = 2;
      g.strokeRect(26, 26, 1348, 598);
      g.strokeStyle = tourney ? '#d0c4a6' : '#4e535e';
      g.strokeRect(36, 36, 1328, 578);
      // Restrained engraved lines and foil lozenge, derived from the playing-card backs.
      g.save();
      g.translate(1030, 325);
      g.strokeStyle = accent;
      g.globalAlpha = .34;
      g.lineWidth = 1.4;
      for (let i = 0; i < 12; i++) {
        const x = 130 + i * 8,
          y = 145 + i * 9;
        g.beginPath();
        g.moveTo(0, -y);
        g.lineTo(x, 0);
        g.lineTo(0, y);
        g.lineTo(-x, 0);
        g.closePath();
        g.stroke();
      }
      g.restore();
      g.fillStyle = ink;
      g.font = '600 37px "Chakra Petch",sans-serif';
      g.fillText('P O K E R D O T', 80, 107);
      g.font = '700 238px "Chakra Petch",sans-serif';
      g.fillText(unit, 75, 396);
      g.fillStyle = accent;
      g.fillRect(82, 440, 96, 5);
      g.fillStyle = ink;
      g.font = '600 26px "Chakra Petch",sans-serif';
      g.fillText(kind === 'main' ? 'POKERDOT / USD' : tourney ? 'TOURNAMENT DOLLARS' : 'CASH DOLLARS', 82, 506);
      g.fillStyle = tourney ? '#82765e' : '#9ca3ad';
      g.font = '400 19px monospace';
      g.fillText(tourney ? 'TD  /  00002750' : 'CD  /  00002500', 82, 570);
      g.save();
      g.translate(1300, 563);
      g.rotate(Math.PI);
      g.fillStyle = ink;
      g.font = '700 57px "Chakra Petch",sans-serif';
      g.fillText(unit, 0, 0);
      g.restore();
      [[0, -50], [-50, 0], [50, 0], [0, 50]].forEach(([x, y], i) => {
        g.fillStyle = i === 0 ? accent : ink;
        g.beginPath();
        g.ellipse(1030 + x, 325 + y, 22, 29, -.3, 0, Math.PI * 2);
        g.fill();
      });
      const tex = new T.CanvasTexture(art);
      tex.colorSpace = T.SRGBColorSpace;
      tex.anisotropy = Math.min(8, r.capabilities.getMaxAnisotropy());
      textures.push(tex);
      const notes = Array.from({
        length: 8
      }, (_, i) => {
        // One continuous paper surface: no independently bending front/back planes.
        const geo = new T.PlaneGeometry(2.8, 1.3, 40, 16);
        const mat = new T.MeshPhysicalMaterial({
          map: tex,
          side: T.DoubleSide,
          metalness: .02,
          roughness: .72,
          clearcoat: .06,
          envMap: env,
          envMapIntensity: .35
        });
        const note = new T.Mesh(geo, mat);
        note.userData.rest = geo.attributes.position.array.slice();
        scene.add(note);
        return note;
      });
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const resize = () => {
        w = cv.parentElement.clientWidth;
        h = cv.parentElement.clientHeight;
        r.setSize(w, h, false);
        cam.left = -w / 2;
        cam.right = w / 2;
        cam.top = h / 2;
        cam.bottom = -h / 2;
        cam.updateProjectionMatrix();
      };
      observer = new ResizeObserver(resize);
      observer.observe(cv.parentElement);
      const clamp = x => Math.max(0, Math.min(1, x)),
        smooth = x => x * x * (3 - 2 * x);
      const draw = now => {
        if (dead) return;
        const elapsed = preview ? 800 : reduced ? 4400 : timeline.current.elapsed || 0;
        notes.forEach((note, i) => {
          const main = kind === 'main',
            start = main ? 1900 + i * 65 : 900 + i * 85,
            duration = main ? 950 : 1650 + i % 3 * 90;
          const t = smooth(clamp((elapsed - start) / duration)),
            q = 1 - t;
          const appear = preview ? 1 : smooth(clamp((elapsed - i * 38) / 520));
          const scale = preview ? Math.min(43, w / 3.8) : 51;
          const sx = (i - 3.5) * (preview ? 3 : 5),
            sy = preview ? -5 + i * 2 : h / 2 - h * (main ? .66 : .56) + i * 3;
          const tx = -90,
            ty = h / 2 - 105;
          const lift = Math.sin(Math.PI * t),
            flow = reduced ? 0 : elapsed * .004;
          // Fixed, disjoint depth lanes prevent sheets intersecting even as they flex.
          // Orthographic projection keeps note size independent of its lane.
          const lane = (7 - i) * 100;
          const arc = 32 + i % 3 * 12;
          note.position.set(q * q * q * sx + 3 * q * q * t * (sx + arc) + 3 * q * t * t * (tx + arc * .7) + t * t * t * tx, q * q * q * (sy - (1 - appear) * 32) + 3 * q * q * t * (sy + 90) + 3 * q * t * t * (ty - 60) + t * t * t * ty, lane);
          note.scale.setScalar(scale * (.86 + .14 * appear) * (1 - .965 * t));
          note.rotation.set(-.12 + Math.sin(flow + i * .35) * .09 * lift, Math.sin(flow * .75 + i * .35) * .22 * lift, (i - 3.5) * .075 + Math.sin(flow * .7 + i * .3) * .13 * lift);
          note.visible = (elapsed < start + duration || preview) && appear > 0;
          const ps = note.geometry.attributes.position;
          for (let v = 0; v < ps.count; v++) {
            const x = note.userData.rest[v * 3],
              y = note.userData.rest[v * 3 + 1],
              u = x / 1.4;
            // Travelling bend, diagonal torsion, and a softer trailing edge.
            const wave = Math.sin(x * 2.25 - flow + i * .28) * (.025 + .19 * lift);
            const twist = u * y * Math.sin(flow * .8 + i * .28) * .16 * lift;
            const edge = u * u * Math.sin(flow * 1.25 - y * 2 + i * .28) * .065 * lift;
            ps.setY(v, y + wave * .48 * lift + edge * .3);
            ps.setZ(v, wave + twist + edge);
          }
          ps.needsUpdate = true;
          note.geometry.computeVertexNormals();
        });
        r.render(scene, cam);
        raf = requestAnimationFrame(draw);
      };
      callback.current?.(true);
      raf = requestAnimationFrame(draw);
      return () => {
        dead = true;
        cancelAnimationFrame(raf);
        observer.disconnect();
        textures.forEach(t => t.dispose());
        CH.release(scene, r);
      };
    } catch (e) {
      console.warn('Banknote preview unavailable', e);
      callback.current?.(false);
      if (scene && r) CH.release(scene, r);
    }
  }, [kind, preview]);
  return /*#__PURE__*/React.createElement("canvas", {
    ref: canvas,
    role: "img",
    "aria-label": kind === 'tdollar' ? 'Купюры T$' : 'Купюры C$',
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 4
    }
  });
}
window.RbRewardCoins3D = RbRewardCoins3D;

// House rewards are withdrawable money, independent of promotional card rewards.
function RbHousePayout({
  amount,
  baseAmount,
  bonusPercent,
  cardLevel,
  onCredited,
  onClose
}) {
  const base = baseAmount ?? Math.round(amount / (1 + (bonusPercent ?? window.cmLeague.rbExtra(window.cmPlayer.level)) / 100) * 100) / 100;
  const bonus = bonusPercent ?? window.cmLeague.rbExtra(window.cmPlayer.level);
  const [time, setTime] = React.useState(0),
    root = React.useRef(null),
    timeline = React.useRef({
      elapsed: 0
    }),
    done = React.useRef(false),
    id = React.useRef(null),
    callback = React.useRef(onCredited);
  const start = React.useRef(window.pxWallets?.().usd || 0),
    currency = React.useRef(window.PX_CUR || 'USD');
  callback.current = onCredited;
  if (id.current === null) id.current = ++window.cmRewardWallet.sequence;
  const cfg = window.PX_CURRENCIES[currency.current],
    fmt = n => cfg.sym + (n * cfg.rate).toLocaleString('ru-RU', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  const clamp = n => Math.max(0, Math.min(1, n)),
    ease = n => 1 - Math.pow(1 - clamp(n), 3);
  const stage = time < 700 ? 'base' : time < 1450 ? 'bonus' : time < 2580 ? 'sum' : time < 3400 ? 'coins' : time < 4300 ? 'wallet' : time < 5800 ? 'transfer' : 'complete';
  const baseCount = base * ease(time / 650),
    bonusCount = (amount - base) * ease((time - 700) / 650);
  const displayed = base + (amount - base) * ease((time - 1450) / 850);
  const arrival = Array.from({
    length: 8
  }, (_, i) => clamp((time - (4300 + i * 65 + 850)) / 100)).reduce((a, b) => a + b, 0) / 8;
  const walletPulse = Math.min(1.5, Array.from({
    length: 8
  }, (_, i) => {
    const age = time - (5250 + i * 65);
    return age < 0 ? 0 : (1 - Math.exp(-age / 12)) * Math.exp(-age / 95);
  }).reduce((a, b) => a + b, 0));
  const walletFeedback = {
    transform: `scale(${1 + walletPulse * .024})`,
    boxShadow: `0 0 ${12 + walletPulse * 25}px rgba(239,194,105,${walletPulse * .24}),0 0 ${25 + walletPulse * 45}px rgba(239,194,105,${walletPulse * .10})`,
    borderRadius: 22,
    willChange: 'transform,box-shadow'
  };
  React.useEffect(() => {
    let raf,
      last = null,
      elapsed = 0,
      lastPaint = -100;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const tick = now => {
      if (last !== null && !document.hidden) elapsed += Math.min(64, now - last);
      last = now;
      if (reduced) elapsed = 6200;
      timeline.current.elapsed = Math.max(0, elapsed - 2400);
      if (elapsed - lastPaint >= 32 || elapsed >= 5800) {
        setTime(Math.min(elapsed, 6200));
        lastPaint = elapsed;
      }
      if (elapsed >= 5800) {
        if (!done.current) {
          done.current = true;
          if (window.cmRewardWallet.credit(id.current, 'main', amount)) callback.current?.(amount, 'main');
        }
      }
      if (elapsed < 6200) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [amount]);
  return /*#__PURE__*/React.createElement("div", {
    ref: root,
    className: "rb-pay rb-house-pay",
    "data-phase": stage === 'complete' ? 'complete' : 'flying',
    "data-stage": stage,
    "data-i18n": "off",
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0435 \u0440\u0435\u0439\u043A\u0431\u0435\u043A\u0430"
  }, /*#__PURE__*/React.createElement("style", null, `
      .rb-house-pay .rb-pay-wallet{top:58px}.rb-house-pay .rb-pay-center{top:252px;z-index:5}.rb-house-pay .rb-pay-heading{top:214px;line-height:20px}
      .rb-house-pay .rb-pay-amount{font-size:clamp(32px,10vw,54px);font-family:${UI.fontUI};font-weight:700;letter-spacing:-.04em}
      .rb-house-pay .rb-pay-wallet-copy strong{font-family:${UI.fontUI};font-size:23px}
      .rb-house-breakdown{display:grid;gap:16px;text-align:left;max-width:290px;margin:auto}.rb-house-line{display:flex;justify-content:space-between;align-items:center;gap:16px;font-size:12px;color:#a8a8b2}.rb-house-line strong{font-size:27px;font-weight:600;color:#eee9dd;font-variant-numeric:tabular-nums;white-space:nowrap}.rb-house-line small{display:block;margin-top:5px;color:#ddc58d;font-size:12px}.rb-house-line[data-bonus]{opacity:0;transform:translateY(8px);transition:.35s}.rb-house-pay:not([data-stage=base]) .rb-house-line[data-bonus]{opacity:1;transform:none}.rb-house-total{border-top:1px solid #ffffff18;margin-top:18px;padding-top:14px;opacity:0;transform:translateY(12px);transition:.4s}.rb-house-pay[data-stage=sum] .rb-house-total,.rb-house-pay[data-stage=transfer] .rb-house-total,.rb-house-pay[data-stage=complete] .rb-house-total{opacity:1;transform:none}.rb-house-total small{font-size:12px;letter-spacing:.13em;color:#aaa6a0}.rb-house-total .rb-pay-amount{margin-top:6px}
      .rb-house-pay .rb-pay-status{top:78%}.rb-house-pay .rb-pay-horizon{top:69%}
      .rb-house-pay[data-stage=bonus] .rb-pay-amount{animation:house-bonus-pulse 1.4s ease both}
      .rb-house-pay[data-stage=transfer] .rb-pay-wallet-body{box-shadow:0 12px 40px #0008,0 0 26px #c7dfb51a,inset 0 1px 0 #ffffff24}
      .rb-house-pay{background:#090b0f}
      .rb-house-pay:before,.rb-house-pay:after{content:'';position:absolute;pointer-events:none;border-radius:50%;filter:blur(65px);z-index:0}
      .rb-house-pay:before{width:340px;height:370px;left:-160px;top:26%;background:radial-gradient(ellipse,#933e382d,transparent 72%)}
      .rb-house-pay:after{width:380px;height:380px;right:-160px;top:42%;background:radial-gradient(ellipse,#d4aa6040,transparent 70%)}
      .rb-house-pay .rb-pay-halo{top:65%;width:340px;height:240px;background:radial-gradient(ellipse,#d6aa5733,transparent 68%);filter:blur(32px);animation:house-light-breathe 6s ease-in-out infinite}
      .rb-house-pay .rb-pay-horizon{display:none}
      .rb-house-pay .rb-pay-heading{font-size:13px;color:#c3b9a7;letter-spacing:.12em;top:214px}
      .rb-house-pay .rb-pay-center{top:252px}
      .rb-house-line{font-size:14px;color:#bfc0c8}.rb-house-line small{font-size:13px}.rb-house-line strong{font-size:25px}
      .rb-house-total{margin-top:16px;padding-top:14px;border-color:#dac08a20}.rb-house-total small{font-size:12px;letter-spacing:.08em;color:#bfc0c8}
      .rb-house-pay .rb-pay-amount{font-size:48px;color:#ffe5ab;text-shadow:0 0 36px #dca74930}
      .rb-house-pay .rb-pay-status{top:80%;left:36px;right:36px;font-size:14px;line-height:1.5;color:#d5cec0}
      .rb-house-pay[data-stage=complete] .rb-pay-wallet-gain{color:#e9cc88}
      @keyframes house-light-breathe{0%,100%{opacity:.65;transform:translate(-50%,-50%) scale(.94)}50%{opacity:1;transform:translate(-50%,-50%) scale(1.08)}}
      @media(prefers-reduced-motion:reduce){.rb-house-pay .rb-pay-halo{animation:none}}
      .rb-house-pay .rb-house-line{opacity:0;transform:translateY(10px);transition:opacity .3s ease,transform .4s cubic-bezier(.16,1,.3,1)}
      .rb-house-pay .rb-house-line[data-visible=true]{opacity:1;transform:none}
      .rb-house-pay .rb-house-line[data-visible=false]{opacity:0;transform:translateY(10px)}
      .rb-house-pay .rb-house-total{opacity:0;transform:translateY(12px);transition:opacity .35s ease,transform .45s cubic-bezier(.16,1,.3,1)}
      .rb-house-pay .rb-house-total[data-visible=true]{opacity:1;transform:none}
      .rb-house-pay[data-stage=sum] .rb-house-total .rb-pay-amount{animation:house-bonus-pulse .85s ease both}
      .rb-house-pay .rb-house-line strong,.rb-house-pay .rb-pay-amount{font-variant-numeric:tabular-nums}
      .rb-house-pay .rb-pay-heading,.rb-house-pay .rb-pay-center{animation:rb-reward-rise 320ms cubic-bezier(.16,1,.3,1) both}
      .rb-house-pay .rb-pay-wallet-shell{margin:auto;overflow:hidden;transform-origin:50% 0;background:#111216;border-radius:28px;animation:house-island-open 700ms cubic-bezier(.22,.85,.2,1) both}
      .rb-house-pay .rb-pay-wallet-body{min-width:274px;animation:house-wallet-content 600ms 120ms both}
      .rb-house-pay .rb-pay-wallet-gain{transition:opacity 200ms}
      @keyframes house-island-open{0%{width:126px;height:34px;transform:translateY(-38px);border-radius:28px;opacity:0}15%{opacity:1}65%{width:282px;height:94px;transform:translateY(2px);border-radius:22px}100%{width:274px;height:90px;transform:none;border-radius:20px;opacity:1}}
      @media(prefers-reduced-motion:reduce){.rb-wallet-feedback{transform:none!important;box-shadow:none!important}}
      @keyframes house-wallet-content{0%,20%{opacity:0;transform:translateY(-6px)}100%{opacity:1;transform:none}}
      @media(prefers-reduced-motion:reduce){.rb-house-pay .rb-pay-wallet-shell,.rb-house-pay .rb-pay-wallet-body{animation:none}.rb-house-pay .rb-pay-wallet-shell{height:90px;width:274px}}
      @keyframes house-bonus-pulse{50%{text-shadow:0 0 30px #f1c76c75;transform:scale(1.05)}}
      @media(prefers-reduced-motion:reduce){.rb-house-bills{display:none}.rb-house-bonus{transition:none}.rb-house-pay .rb-pay-amount{animation:none!important}}
    `), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-halo"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-horizon"
  }), time >= 3400 && /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-wallet-feedback",
    style: walletFeedback
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet-shell"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rb-pay-wallet-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.7"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 6h15v14H4zM4 6V3h13v3M15 11h6v5h-6z"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet-copy"
  }, /*#__PURE__*/React.createElement("small", null, "\u041E\u0421\u041D\u041E\u0412\u041D\u041E\u0419 \u0411\u0410\u041B\u0410\u041D\u0421 \xB7 ", currency.current), /*#__PURE__*/React.createElement("strong", null, fmt(start.current + amount * arrival)))))), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-wallet-gain",
    style: {
      opacity: arrival > 0 ? 1 : 0,
      transform: 'none'
    }
  }, "+", fmt(amount * arrival), stage === 'complete' ? ' зачислено' : '')), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-heading"
  }, "\u041D\u0410\u0413\u0420\u0410\u0414\u0410 \u0417\u0410 \u0414\u041E\u041C\u0418\u041A"), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-house-breakdown"
  }, /*#__PURE__*/React.createElement("div", {
    className: "rb-house-line",
    "data-visible": time >= 60
  }, /*#__PURE__*/React.createElement("span", null, "\u0411\u0430\u0437\u043E\u0432\u044B\u0439 \u0440\u0435\u0439\u043A\u0431\u0435\u043A"), /*#__PURE__*/React.createElement("strong", null, fmt(baseCount))), /*#__PURE__*/React.createElement("div", {
    className: "rb-house-line",
    "data-bonus": "true",
    "data-visible": time >= 700
  }, /*#__PURE__*/React.createElement("span", null, "\u0411\u043E\u043D\u0443\u0441 \u043A\u0430\u0440\u0442\u044B", /*#__PURE__*/React.createElement("small", null, window.cmLeague.cardForLevel(cardLevel ?? window.cmPlayer.level), " \xB7 +", bonus.toLocaleString('ru-RU'), "%")), /*#__PURE__*/React.createElement("strong", null, "+", fmt(bonusCount)))), /*#__PURE__*/React.createElement("div", {
    className: "rb-house-total",
    "data-visible": time >= 1450
  }, /*#__PURE__*/React.createElement("small", null, "\u0418\u0422\u041E\u0413\u041E \u041D\u0410 \u041E\u0421\u041D\u041E\u0412\u041D\u041E\u0419 \u0411\u0410\u041B\u0410\u041D\u0421"), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-amount"
  }, "+", fmt(displayed)))), time >= 2580 && /*#__PURE__*/React.createElement(RbRewardMetalCoins3D, {
    timeline: timeline,
    phase: stage,
    kind: "main"
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-status",
    role: "status"
  }, stage === 'complete' ? 'Рейкбек зачислен' : stage === 'transfer' ? 'Переводим на основной баланс' : time < 2580 ? 'Рассчитываем рейкбек' : 'Ваша награда готова'), /*#__PURE__*/React.createElement("div", {
    className: "rb-pay-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "rb-pay-primary",
    style: {
      ...UI.btn("l", "primary"),
      minHeight: 56,
      background: "#d71921",
      backgroundImage: "none",
      boxShadow: "none",
      color: "#fff"
    },
    disabled: stage !== 'complete',
    onClick: onClose
  }, "\u0413\u041E\u0422\u041E\u0412\u041E")));
}
window.RbHousePayout = RbHousePayout;
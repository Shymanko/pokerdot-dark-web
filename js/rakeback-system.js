// One source of truth for the illustrative rakeback calculation.
// Production must supply approved bands, activity thresholds and a server snapshot.
const RB_READY_MODELS = new Set(['ox', 'tiger', 'dragon', 'horse', 'rooster', 'dog']);
const RB_TALISMANS = [['rat', 'Крыса'], ['ox', 'Бык'], ['tiger', 'Тигр'], ['rabbit', 'Кролик'], ['dragon', 'Дракон'], ['snake', 'Змея'], ['horse', 'Лошадь'], ['sheep', 'Коза'], ['rooster', 'Петух'], ['monkey', 'Обезьяна'], ['dog', 'Собака'], ['pig', 'Свинья']].map(([id, name], i) => ({
  id,
  name,
  index: i,
  modelReady: RB_READY_MODELS.has(id),
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

// Shared noise field: advected fire, crystalline surface frost and airborne particles.
// All effects remain attached to the original zodiac mesh; no extra animal geometry.
const RB_FX_NOISE = `
float rbHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
float rbNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(rbHash(i),rbHash(i+vec2(1,0)),f.x),mix(rbHash(i+vec2(0,1)),rbHash(i+vec2(1,1)),f.x),f.y);}
float rbFbm(vec2 p){float n=0.;float a=.5;mat2 r=mat2(.8,-.6,.6,.8);for(int i=0;i<4;i++){n+=a*rbNoise(p);p=r*p*2.03+vec2(13.2,7.1);a*=.5;}return n;}
vec2 rbCell(vec2 p){vec2 i=floor(p),f=fract(p);float a=8.,b=8.;for(int y=-1;y<=1;y++){for(int x=-1;x<=1;x++){vec2 g=vec2(float(x),float(y));vec2 o=vec2(rbHash(i+g),rbHash(i+g+53.7));float d=length(g+o-f);if(d<a){b=a;a=d;}else if(d<b){b=d;}}}return vec2(a,b-a);}
`;
function rbAttachSurfaceFX(material, uniforms) {
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vRbSurface;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvRbSurface = position;');
    shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `#include <common>\nuniform float rbCold;uniform float rbHot;uniform float rbTime;varying vec3 vRbSurface;\n${RB_FX_NOISE}`).replace('#include <color_fragment>', `#include <color_fragment>
    vec2 rbP=vRbSurface.xy*4.8+vRbSurface.z*.17;
    float rbGrain=rbFbm(rbP*3.2);
    vec2 rbIce=rbCell(rbP*4.2+rbFbm(rbP*1.5)*.8);
    float rbCrack=1.-smoothstep(.009,.045,rbIce.y);
    float rbFrost=smoothstep(1.-rbCold*1.28,1.2-rbCold*1.18,rbGrain);
    float rbVein=rbCrack*rbCold;
    vec3 rbIceColor=mix(vec3(.035,.14,.23),vec3(.32,.57,.70),rbGrain);
    diffuseColor.rgb=mix(diffuseColor.rgb,rbIceColor,rbFrost*.78);
    diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.035,.14,.21),rbVein*.52);
    diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(1.12,.73,.44),rbHot*.34);
   `).replace('#include <roughnessmap_fragment>', `#include <roughnessmap_fragment>\nroughnessFactor=mix(roughnessFactor,.19+rbGrain*.30,rbFrost);`).replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>\nmetalnessFactor=mix(metalnessFactor,.12,rbFrost*.9);`).replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
    float rbEdge=pow(1.-abs(dot(normal,normalize(vViewPosition))),2.6);
    totalEmissiveRadiance+=vec3(.10,.38,.57)*(rbVein*.19+rbEdge*rbCold*.27);
    float rbCoal=smoothstep(.58,.81,rbFbm(rbP*2.4));
    totalEmissiveRadiance+=vec3(1.,.085,.008)*rbHot*rbHot*(.045+rbCoal*.48+rbEdge*.48);
   `);
  };
  material.customProgramCacheKey = () => 'rb-surface-frost-v2';
}
function rbCreateAtmosphere(T, pivot, mini, uniforms, geometries, materials) {
  const group = new T.Group();
  pivot.add(group);
  const quad = new T.PlaneGeometry(3.4, 3.6);
  geometries.push(quad);
  const vertex = `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`;
  const fragment = `varying vec2 vUv;uniform float rbTime;uniform float rbHot;uniform float rbCold;uniform float layer;${RB_FX_NOISE}
 void main(){
  vec2 p=(vUv-.5)*vec2(3.4,3.6);
  float t=rbTime;float hot=rbHot;float cold=rbCold;
  vec2 flow=vec2(p.x*3.1,p.y*3.8-t*1.22+layer*8.);
  float turbulence=rbFbm(flow+vec2(rbFbm(flow*.57+t*.11)*2.4,0));
  float fine=rbFbm(flow*2.1-vec2(0,t*.5));
  vec2 q=p;
  float warp=rbFbm(vec2(p.x*4.7,p.y*3.1-t*1.25));
  q.x+=(rbFbm(vec2(p.y*4.-t*.9,p.x*3.+layer*5.))-.5)*(.08+max(p.y,0.)*.20);
  q.y-=hot*(.10+warp*.36)*smoothstep(-.8,.8,p.y);
  float oct=max(max(abs(q.x),abs(q.y)),(abs(q.x)+abs(q.y))*.7071);
  float rim=exp(-pow((oct-.83)/(.055+hot*.12),2.));
  float filaments=rbFbm(vec2(q.x*8.,q.y*4.8-t*1.9)+turbulence*2.2);
  float fuel=rim*(.48+hot*.52);
  float density=smoothstep(.22,.95,fuel+filaments*.52-turbulence*.18);
  density*=smoothstep(-1.04,-.8,p.y)*(1.-smoothstep(1.20,1.47,p.y));
  float border=smoothstep(0.,.12,vUv.x)*smoothstep(0.,.12,1.-vUv.x)*smoothstep(0.,.06,vUv.y)*smoothstep(0.,.1,1.-vUv.y);
  float fire=density*hot*border;
  float corona=exp(-pow((oct-.85)/.24,2.))*hot*hot*.13*border;
  if(layer>0.5){fire*=smoothstep(.83,1.04,oct)*.48;}
  vec3 fireColor=mix(vec3(.58,.018,.001),vec3(1.,.22,.012),smoothstep(.06,.38,density));
  fireColor=mix(fireColor,vec3(1.,.56,.12),smoothstep(.46,.84,density));
  fireColor=mix(fireColor,vec3(1.,.96,.73),smoothstep(.88,1.,density));
  // Cold vapor rolls beneath the face instead of surrounding it with repeated spikes.
  float mist=rbFbm(vec2(p.x*2.4+t*.12,p.y*5.+t*.16));
  float fog=exp(-pow((p.y+.77+sin(p.x*3.+t*.3)*.08)/.19,2.))*exp(-p.x*p.x*.9)*smoothstep(.30,.75,mist)*cold*.24*border;
  float a=fire+fog+corona;
  if(a<.002)discard;
  vec3 color=(fireColor*fire+vec3(.45,.76,.9)*fog+vec3(.95,.12,.006)*corona)/max(a,.001);
  gl_FragColor=vec4(color,a);
 }`;
  [0, 1].forEach(layer => {
    const mat = new T.ShaderMaterial({
      name: 'MAT_RB_AdvectedAtmosphere',
      transparent: true,
      depthWrite: false,
      side: T.DoubleSide,
      uniforms: {
        ...uniforms,
        layer: {
          value: layer
        }
      },
      vertexShader: vertex,
      fragmentShader: fragment
    });
    materials.push(mat);
    const mesh = new T.Mesh(quad, mat);
    mesh.position.set(0, 0, layer ? .22 : -.25);
    mesh.renderOrder = layer ? 3 : 0;
    group.add(mesh);
  });
  const count = mini ? 24 : 76,
    geo = new T.BufferGeometry();
  const positions = new Float32Array(count * 3),
    seeds = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    seeds.set([i * .61803398875 % 1, (i * .38196601125 + .13) % 1, (i * .754877666 + .23) % 1, (i * .56984029 + .3) % 1], i * 4);
  }
  geo.setAttribute('position', new T.BufferAttribute(positions, 3));
  geo.setAttribute('seed', new T.BufferAttribute(seeds, 4));
  geometries.push(geo);
  const sparkMat = new T.ShaderMaterial({
    name: 'MAT_RB_SparksAndIceDust',
    transparent: true,
    depthWrite: false,
    blending: T.AdditiveBlending,
    uniforms: {
      ...uniforms,
      rbPixel: {
        value: Math.min(devicePixelRatio || 1, mini ? 1.5 : 2)
      }
    },
    vertexShader: `attribute vec4 seed;uniform float rbTime;uniform float rbHot;uniform float rbCold;uniform float rbPixel;varying float vAlpha;varying float vHot;
 void main(){float hot=rbHot;float cold=rbCold;float life=fract(rbTime*(.12+seed.z*.18)+seed.y);float theta=seed.x*6.283185;vec3 p=vec3(cos(theta)*.85,sin(theta)*.72,.15+seed.z*.22);p.x+=sin(life*5.+seed.z*20.)*(.04+life*.22);p.y+=life*life*(1.3+hot*.7)*(hot>0.?1.:-.3);p.z+=life*.10;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp((1.+seed.w*2.6)*rbPixel*3./-mv.z,1.,7.);vAlpha=sin(life*3.14159)*(.2+seed.z*.8)*max(hot*hot,cold*.45);vHot=hot;}`,
    fragmentShader: `varying float vAlpha;varying float vHot;void main(){vec2 p=gl_PointCoord-.5;float d=length(p);float a=(1.-smoothstep(.06,.5,d))*vAlpha;if(a<.006)discard;vec3 c=mix(vec3(.45,.78,1.),vec3(1.,.48,.09),step(.01,vHot));c=mix(c,vec3(1.),(1.-smoothstep(0.,.14,d))*.6);gl_FragColor=vec4(c,a);}`
  });
  materials.push(sparkMat);
  const points = new T.Points(geo, sparkMat);
  points.frustumCulled = false;
  points.renderOrder = 4;
  group.add(points);
  return group;
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
      materials = [];
    const uniforms = {
      rbCold: {
        value: 0
      },
      rbHot: {
        value: 0
      },
      rbTime: {
        value: 0
      }
    };
    if (!RB_READY_MODELS.has(id)) {
      setStatus('unavailable');
      return;
    }
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
      camera.position.set(0, 0, mini ? 5.25 : 4.25);
      const pivot = new T.Group();
      scene.add(pivot);
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
      fx = rbCreateAtmosphere(T, pivot, mini, uniforms, ownedGeometry, ownedMaterials);
      dtLoadModel(id).then(gltf => {
        if (cancelled) return;
        model = gltf.scene.clone(true);
        model.traverse(o => {
          if (o.isMesh) {
            const original = Array.isArray(o.material) ? o.material : [o.material];
            const cloned = original.map(mat => {
              const m = mat.clone();
              m.envMapIntensity = 1.1;
              rbAttachSurfaceFX(m, uniforms);
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
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const render = t => {
        if (cancelled) return;
        raf = requestAnimationFrame(render);
        if (!visible || document.hidden || t - prev < (mini ? 55 : 30)) return;
        const dt = Math.min(.1, (t - prev) / 1000);
        prev = t;
        shown += (live.current.temperature - shown) * (reduced ? 1 : Math.min(1, dt * 5));
        const cold = Math.max(0, (4 - shown) / 4),
          hot = Math.max(0, (shown - 4) / 5);
        uniforms.rbCold.value = cold;
        uniforms.rbHot.value = hot;
        uniforms.rbTime.value = reduced ? 3.7 : t / 1000;
        fx.visible = cold > .005 || hot > .005;
        glow.color.set(cold > 0 ? '#95deff' : '#ff7d32');
        glow.intensity = cold * .6 + hot * (1.3 + (reduced ? 0 : Math.sin(t * .0031) * .10 + Math.sin(t * .0077) * .06));
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
  }), status !== 'ready' && RB_READY_MODELS.has(id) && /*#__PURE__*/React.createElement("img", {
    className: "rb-thermal-fallback",
    src: `assets/talismans3d/${id}.png`,
    alt: ""
  }), !RB_READY_MODELS.has(id) && /*#__PURE__*/React.createElement("span", {
    className: "rb-model-unavailable"
  }, name, /*#__PURE__*/React.createElement("small", null, "3D-\u043C\u043E\u0434\u0435\u043B\u044C \u0435\u0449\u0451 \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430")), /*#__PURE__*/React.createElement("canvas", {
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
  }, variant === 'hero' && /*#__PURE__*/React.createElement("div", {
    className: "rb-home-talisman",
    style: {
      '--thermal': c.temperature.color
    }
  }, !host && /*#__PURE__*/React.createElement(RbThermalModel, {
    id: c.talisman.id,
    temperature: c.temperature.index,
    name: c.talisman.name
  }), /*#__PURE__*/React.createElement("div", {
    className: "rb-home-talisman-caption"
  }, /*#__PURE__*/React.createElement("h2", null, c.talisman.name), /*#__PURE__*/React.createElement("span", null, c.temperature.name, " \xB7 ", c.temperature.index + 1, "/10"))), /*#__PURE__*/React.createElement("button", {
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
  }, !host && variant !== 'hero' && /*#__PURE__*/React.createElement(RbThermalModel, {
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
  }, String(i + 1).padStart(2, '0')), t.modelReady ? /*#__PURE__*/React.createElement("img", {
    loading: "lazy",
    src: `assets/talismans3d/${t.id}.png`,
    alt: ""
  }) : /*#__PURE__*/React.createElement("span", {
    className: "rb-catalog-pending"
  }, "3D-\u043C\u043E\u0434\u0435\u043B\u044C", /*#__PURE__*/React.createElement("br", null), "\u0435\u0449\u0451 \u043D\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0430"), /*#__PURE__*/React.createElement("strong", null, t.name), /*#__PURE__*/React.createElement("span", null, i === current.talisman.index ? 'Ваш талисман' : '10 состояний')))), /*#__PURE__*/React.createElement("div", {
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
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// CARD HOUSE / CHROME EDITION. Procedural, real-time Three.js geometry.
// No remote generation, texture bake or paid provider is required.
const CH_MONO = UI.font;
const CH_SANS = UI.fontUI;
if (!document.getElementById('pd-signature-font')) {
  const style = document.createElement('style');
  style.id = 'pd-signature-font';
  style.textContent = '@font-face{font-family:PokerDotSignature;src:url(fonts/Allura-Regular.ttf) format("truetype");font-style:normal;font-weight:400;font-display:swap}';
  document.head.appendChild(style);
}
const CH_SIGNATURE_READY = document.fonts.load('48px PokerDotSignature').catch(() => []);
const CH_TH = () => Math.max(1, Number((window.cmPlayer || {}).safeThreshold) || 1000);
// Balance is unresolved in rb-spec. League averages are explicitly estimates.
function chRbPercent(level) {
  return 10 + window.cmLeague.indexForLevel(level) * 10;
}
function chOpenInSuit(level) {
  return Math.max(1, Math.min(13, level - window.cmLeague.forLevel(level).min + 1));
}
function chHouseState(level, xp, th) {
  const TH = th || CH_TH();
  // First card of a new suit keeps the previous full cycle active.
  const idx = window.cmLeague.indexForLevel(level);
  const opened = chOpenInSuit(level);
  const holding = idx > 0 && opened === 1;
  const N = holding ? 13 : opened;
  const pairs = Math.floor(N / 2);
  const safeXP = Math.max(0, Number(xp) || 0);
  const stages = Array.from({
    length: pairs
  }, (_, i) => Math.round((i + 1) * TH / pairs));
  const built = stages.filter(t => safeXP >= t).length;
  return {
    N,
    opened,
    pairs,
    built,
    TH,
    stages,
    xpPerPair: pairs ? TH / pairs : TH,
    nextAt: stages[built] || TH,
    odd: N % 2 === 1 && N !== 13,
    full: N === 13,
    canOpen: safeXP >= TH,
    holding,
    floorIndex: holding ? idx - 1 : idx,
    eternal: level >= 65
  };
}
function chFloors(level, xp) {
  const L = window.cmLeague,
    st = chHouseState(level, xp),
    out = [];
  for (let i = 0; i < st.floorIndex; i++) out.push({
    lg: L.LEAGUES[i],
    pairs: 6,
    ace: true,
    complete: true
  });
  out.push({
    lg: L.LEAGUES[st.floorIndex],
    pairs: st.eternal ? 6 : st.built,
    total: st.pairs,
    ace: st.full,
    complete: st.eternal,
    odd: st.odd,
    N: st.N
  });
  return out;
}
const CH = {
  ok: () => !!window.THREE,
  textures: new Map(),
  geometries: new Map(),
  envs: new WeakMap(),
  envFor(r) {
    if (this.envs.has(r)) return this.envs.get(r).texture;
    const T = window.THREE,
      scene = new T.Scene();
    scene.add(new T.Mesh(new T.BoxGeometry(30, 30, 30), new T.MeshBasicMaterial({
      color: 0x596372,
      side: T.BackSide
    })));
    [[2, 15, -8, 4, 6, 0xeaf0ff, 5], [1.3, 18, 9, 3, 3, 0xffffff, 7], [12, 1.2, 0, 10, -2, 0xffffff, 6], [4, 10, -5, 0, -9, 0x879cff, 3], [14, 1, 0, -7, 6, 0xffffff, 4], [11, 9, 0, 2, 12, 0xe6edff, 1.25], [10, 8, 0, 2, -12, 0xd0e0ff, 1.1]].forEach(([w, h, x, y, z, c, k]) => {
      const mat = new T.MeshBasicMaterial({
        color: c
      });
      mat.color.multiplyScalar(k);
      const m = new T.Mesh(new T.PlaneGeometry(w, h), mat);
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      scene.add(m);
    });
    const gen = new T.PMREMGenerator(r),
      target = gen.fromScene(scene, .035);
    gen.dispose();
    scene.traverse(o => {
      if (o.isMesh) {
        o.geometry.dispose();
        o.material.dispose();
      }
    });
    this.envs.set(r, target);
    return target.texture;
  },
  suitPath(g, id, x, y, s) {
    g.beginPath();
    if (id === 'diamonds') {
      g.moveTo(x, y - s);
      g.lineTo(x + s * .65, y);
      g.lineTo(x, y + s);
      g.lineTo(x - s * .65, y);
      g.closePath();
    } else if (id === 'hearts') {
      g.moveTo(x, y + s);
      g.bezierCurveTo(x - s * 1.7, y - s * .1, x - s * .8, y - s * 1.5, x, y - s * .45);
      g.bezierCurveTo(x + s * .8, y - s * 1.5, x + s * 1.7, y - s * .1, x, y + s);
    } else if (id === 'spades') {
      g.moveTo(x, y - s);
      g.bezierCurveTo(x + s * 1.5, y + s * .2, x + s * .8, y + s, x + s * .12, y + s * .45);
      g.lineTo(x + s * .3, y + s);
      g.lineTo(x - s * .3, y + s);
      g.lineTo(x - s * .12, y + s * .45);
      g.bezierCurveTo(x - s * .8, y + s, x - s * 1.5, y + s * .2, x, y - s);
    } else if (id === 'clubs') {
      [[0, -.5], [-.48, .2], [.48, .2]].forEach(([a, b]) => {
        g.moveTo(x + a * s + s * .44, y + b * s);
        g.arc(x + a * s, y + b * s, s * .44, 0, Math.PI * 2);
      });
      g.moveTo(x - s * .14, y + s * .2);
      g.lineTo(x + s * .14, y + s * .2);
      g.lineTo(x + s * .3, y + s);
      g.lineTo(x - s * .3, y + s);
    } else g.arc(x, y, s * .7, 0, Math.PI * 2);
    g.fill();
  },
  // The same engravings drive the WebGL texture and its lightweight SVG back.
  editionPaths(ed) {
    const p = [],
      line = points => p.push(points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' '));
    const polygon = (rx, ry, n, rotation = 0) => {
      const points = Array.from({
        length: n
      }, (_, i) => {
        const a = i * Math.PI * 2 / n + rotation;
        return [Math.cos(a) * rx, Math.sin(a) * ry];
      });
      line([...points, points[0]]);
    };
    const ellipse = (rx, ry, rotation = 0, cx = 0) => {
      const points = Array.from({
        length: 65
      }, (_, i) => {
        const a = i * Math.PI / 32,
          x = Math.cos(a) * rx,
          y = Math.sin(a) * ry;
        return [cx + x * Math.cos(rotation) - y * Math.sin(rotation), x * Math.sin(rotation) + y * Math.cos(rotation)];
      });
      line(points);
    };
    switch (ed.motif) {
      case 'rays':
        for (let i = 0; i < 40; i++) {
          const a = i * Math.PI / 20;
          line([[Math.cos(a) * 110, Math.sin(a) * 110], [Math.cos(a) * 181, Math.sin(a) * 221]]);
        }
        break;
      case 'double':
        [-28, 28].forEach(x => {
          ellipse(112, 158, 0, x);
          ellipse(119, 167, 0, x);
        });
        break;
      case 'diamond':
        [0, 12, 25].forEach(d => polygon(144 + d, 174 + d, 4));
        break;
      case 'orbit':
        [-.3, .3].forEach(a => ellipse(129, 193, a));
        break;
      case 'western':
        for (let i = 0; i < 3; i++) {
          const d = i * 11;
          line([[-151 - d, -140 + d], [0, -194 + d], [151 + d, -140 + d]]);
          line([[-151 - d, 140 - d], [0, 194 - d], [151 + d, 140 - d]]);
        }
        break;
      case 'octagon':
        [0, 13, 26].forEach(d => polygon(139 + d, 171 + d, 8, Math.PI / 8));
        break;
      case 'compass':
        polygon(165, 204, 4);
        ellipse(132, 156);
        for (let i = 0; i < 8; i++) {
          const a = i * Math.PI / 4;
          line([[Math.cos(a) * 111, Math.sin(a) * 137], [Math.cos(a) * 165, Math.sin(a) * 204]]);
        }
        break;
      case 'prism':
        polygon(162, 210, 4);
        line([[0, -210], [-95, 0], [0, 210], [95, 0], [0, -210]]);
        line([[-162, 0], [162, 0]]);
        break;
      case 'facets':
        polygon(166, 201, 4);
        polygon(117, 140, 4);
        [1, -1].forEach(s => {
          line([[0, s * 201], [-117, 0], [0, -s * 140], [166, 0]]);
        });
        break;
      case 'jade':
        [0, 20, 40].forEach(d => p.push(`M${-157 + d} 162 V-38 C${-157 + d} ${-224 + d} ${157 - d} ${-224 + d} ${157 - d} -38 V162`));
        break;
      case 'emerald':
        [0, 15, 30].forEach(d => {
          line([[-94 + d, -199 + d], [94 - d, -199 + d], [163 - d, -126 + d], [163 - d, 126 - d], [94 - d, 199 - d], [-94 + d, 199 - d], [-163 + d, 126 - d], [-163 + d, -126 + d], [-94 + d, -199 + d]]);
        });
        break;
      case 'pulse':
        [-126, 126].forEach(y => line([[-168, y], [-104, y], [-74, y - 24], [-38, y + 32], [0, y - 49], [36, y + 23], [69, y], [168, y]]));
        break;
      case 'ember':
        [-1, 1].forEach(s => {
          p.push(`M${s * 125} 187 C${s * 230} 15 ${s * 50} -49 ${s * 115} -193`);
          p.push(`M${s * 149} 181 C${s * 222} 9 ${s * 107} -52 ${s * 146} -174`);
        });
        break;
      case 'velvet':
        [-1, 1].forEach(s => [0, 18, 36].forEach(d => p.push(`M-161 ${s * (129 + d)} Q0 ${s * (263 + d)} 161 ${s * (129 + d)}`)));
        break;
      case 'rose':
        [0, .35, -.35].forEach(a => {
          ellipse(115, 180, a);
        });
        break;
      case 'crescent':
        p.push('M72 -195 C-239 -219 -239 219 72 195 C-127 153 -127 -153 72 -195');
        ellipse(160, 207);
        break;
      case 'obsidian':
        polygon(169, 209, 4);
        line([[-169, 0], [78, -113], [-38, 116], [169, 0]]);
        line([[0, -209], [78, -113], [0, 209], [-38, 116], [0, -209]]);
        break;
      case 'dawn':
        for (let i = 0; i < 17; i++) {
          const a = i * Math.PI / 16;
          line([[Math.cos(a) * 110, -Math.sin(a) * 110], [Math.cos(a) * 172, -Math.sin(a) * 205]]);
        }
        [-1, 1].forEach(s => line([[-168, s * 155], [168, s * 155]]));
        break;
      case 'aureus':
        [0, 12, 30].forEach(d => ellipse(131 + d, 166 + d));
        break;
      case 'satellite':
        [-.55, 0, .55].forEach(a => ellipse(87, 193, a));
        break;
      case 'nova':
        {
          const points = Array.from({
            length: 16
          }, (_, i) => {
            const a = i * Math.PI / 8,
              r = i % 2 ? .68 : 1;
            return [Math.cos(a) * 168 * r, Math.sin(a) * 203 * r];
          });
          line([...points, points[0]]);
          polygon(119, 143, 4);
          break;
        }
      case 'crown':
        [-1, 1].forEach(s => {
          line([[-151, s * 120], [-131, s * 187], [131, s * 187], [151, s * 120], [78, s * 147], [0, s * 100], [-78, s * 147], [-151, s * 120]]);
          line([[-126, s * 199], [126, s * 199]]);
        });
        break;
    }
    return p;
  },
  texture(rank, lg, back = false, legend = null, classic = false) {
    const key = (classic ? 'classic:' : 'colour:') + lg.id + ':' + (back ? 'back' : rank) + (legend ? ':edition-' + legend.id : '');
    if (this.textures.has(key)) return this.textures.get(key);
    const T = window.THREE,
      c = document.createElement('canvas');
    c.width = 512;
    c.height = 720;
    const g = c.getContext('2d');
    // Classic ivory faces and one charcoal PokerDot back across the collection.
    const light = back ? '#89909c' : classic ? '#d7d3ca' : '#aebfc6',
      base = back ? '#17191e' : classic ? '#fffdf8' : {
        diamonds: '#123f8b',
        clubs: '#075539',
        hearts: '#8c172b',
        spades: '#242a33',
        dot: '#71501f'
      }[lg.id];
    const ink = classic ? lg.id === 'hearts' || lg.id === 'diamonds' ? '#bf1730' : lg.id === 'dot' ? '#906a26' : '#171a20' : '#e3e8ed';
    g.fillStyle = base;
    g.fillRect(0, 0, 512, 720);
    if (back) {
      const metal = g.createLinearGradient(0, 0, 512, 720);
      metal.addColorStop(0, '#30333b');
      metal.addColorStop(.42, '#17191e');
      metal.addColorStop(1, '#0c0d11');
      g.fillStyle = metal;
      g.fillRect(0, 0, 512, 720);
    }
    g.lineJoin = 'round';
    if (back) {
      // Symmetric engraved back. No ranks, suit glyphs or corner ornaments.
      // Two clean perimeter pinstripes enclose the same raised PokerDot emblem.
      [21, 33].forEach((p, i) => {
        g.strokeStyle = i ? light : '#e8eff9';
        g.lineWidth = i ? 1.2 : 2.7;
        g.beginPath();
        g.roundRect(p, p, 512 - 2 * p, 720 - 2 * p, 22);
        g.stroke();
      });
      // Brushed metal micro-lines; kept quiet enough to disappear at house scale.
      g.strokeStyle = light;
      g.lineWidth = .65;
      g.globalAlpha = .055;
      for (let x = 51; x < 465; x += 5) {
        g.beginPath();
        g.moveTo(x, 58);
        g.lineTo(x, 662);
        g.stroke();
      }
      g.globalAlpha = 1;
      // Precision-cut lozenge surrounds the dimensional logo, with exact 180° symmetry.
      const diamond = (rx, ry) => {
        g.beginPath();
        g.moveTo(256, 360 - ry);
        g.lineTo(256 + rx, 360);
        g.lineTo(256, 360 + ry);
        g.lineTo(256 - rx, 360);
        g.closePath();
      };
      g.fillStyle = base;
      diamond(184, 202);
      g.fill();
      g.strokeStyle = '#a42a3b';
      g.lineWidth = 1.5;
      g.globalAlpha = .7;
      diamond(184, 202);
      g.stroke();
      g.lineWidth = .8;
      g.globalAlpha = .4;
      diamond(174, 191);
      g.stroke();
      g.globalAlpha = 1;
      g.fillStyle = '#edf3fc';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.font = '600 17px sans-serif';
      g.fillText('P O K E R D O T', 256, 107);
      // One upright brand line; the lower zone is reserved for edition metadata.
    } else {
      // Silver inlay stays legible; the plate itself carries the suit colour.
      g.strokeStyle = light;
      g.lineWidth = 2;
      g.beginPath();
      g.roundRect(24, 24, 464, 672, 20);
      g.stroke();
      g.fillStyle = ink;
      this.suitPath(g, lg.id, 256, 360, 88);
      // Align the visible glyph (not the font's line box) to the card corner.
      g.font = `700 ${rank.length > 1 ? 70 : 86}px serif`;
      g.textAlign = 'left';
      g.textBaseline = 'alphabetic';
      const m = g.measureText(rank),
        left = 36,
        top = 36;
      const rankX = left + m.actualBoundingBoxLeft,
        rankY = top + m.actualBoundingBoxAscent;
      const suitX = left + (m.actualBoundingBoxLeft + m.actualBoundingBoxRight) / 2;
      const suitY = rankY + m.actualBoundingBoxDescent + 26;
      const corner = () => {
        g.fillText(rank, rankX, rankY);
        this.suitPath(g, lg.id, suitX, suitY, 18);
      };
      corner();
      g.save();
      g.translate(512, 720);
      g.rotate(Math.PI);
      corner();
      g.restore();
    }
    if (legend) {
      const ed = {
        ...(legend.edition || {
          motif: 'diamond'
        }),
        ink: back || !classic ? legend.edition?.ink || '#e6c77e' : '#8b6b32'
      };
      g.strokeStyle = ed.ink;
      g.lineWidth = legend.rarity === 'legendary' ? 4 : 2.5;
      g.beginPath();
      g.roundRect(16, 16, 480, 688, 22);
      g.stroke();
      // Each commemorative edition has its own engraved geometry, on both sides.
      g.save();
      g.translate(256, back ? 340 : 335);
      g.scale(.95, back ? .70 : .62);
      g.strokeStyle = ed.ink;
      g.lineWidth = 2.2;
      g.globalAlpha = back ? .50 : .48;
      this.editionPaths(ed).forEach(path => g.stroke(new Path2D(path)));
      g.restore();
      g.fillStyle = ed.ink;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.font = '600 20px sans-serif';
      g.fillText(legend.title, 256, 155, 290);
      if (legend.year) {
        g.font = '600 23px serif';
        g.fillText(legend.year, 256, back ? 616 : 494);
      }
      // Special editions already show their name in the title; do not repeat it below.
      g.font = '500 12px sans-serif';
      g.fillText(legend.rarity === 'legendary' ? 'W S O P   •   L E G E N D S' : 'P O K E R D O T   •   S P E C I A L', 256, 653);
    }
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    tex.anisotropy = 4;
    this.textures.set(key, tex);
    if (legend?.rarity === 'legendary' && !back) {
      const sign = () => {
        g.save();
        g.translate(256, 558);
        g.rotate(-.055);
        g.fillStyle = classic ? '#43351f' : '#e6c77e';
        g.textAlign = 'center';
        g.textBaseline = 'middle';
        let size = 58;
        g.font = `${size}px PokerDotSignature, cursive`;
        while (g.measureText(legend.name).width > 340 && size > 28) {
          size--;
          g.font = `${size}px PokerDotSignature, cursive`;
        }
        g.fillText(legend.name, 0, 0);
        g.restore();
        tex.needsUpdate = true;
      };
      if (document.fonts.check('48px PokerDotSignature')) sign();else CH_SIGNATURE_READY.then(sign);
    }
    return tex;
  },
  cardGeo(w, h, d) {
    const key = [w, h, d].join(':');
    if (this.geometries.has(key)) return this.geometries.get(key);
    const T = window.THREE,
      s = new T.Shape(),
      r = w * .06,
      x = -w / 2,
      y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    const body = new T.ExtrudeGeometry(s, {
      depth: d,
      bevelEnabled: true,
      bevelThickness: d * .24,
      bevelSize: d * .24,
      bevelSegments: 2,
      curveSegments: 6
    });
    body.translate(0, 0, -d / 2);
    const plane = new T.ShapeGeometry(s, 6),
      pos = plane.attributes.position,
      uv = plane.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + w / 2) / w, (pos.getY(i) + h / 2) / h);
    uv.needsUpdate = true;
    const value = {
      body,
      plane
    };
    this.geometries.set(key, value);
    return value;
  },
  makeCard({
    rank = 'A',
    lg,
    w = 1,
    h = 1.406,
    d = .018,
    env,
    emblem = true,
    sealed = false,
    legend = null,
    classic = false
  }) {
    const T = window.THREE,
      {
        body,
        plane
      } = this.cardGeo(w, h, d),
      g = new T.Group();
    const edge = new T.MeshPhysicalMaterial({
      color: new T.Color(0xbec3cc),
      metalness: .94,
      roughness: .22,
      envMap: env,
      envMapIntensity: 1.3,
      clearcoat: 1
    });
    // A sealed object has no visible face on either side, even mid-transition.
    const face = new T.MeshPhysicalMaterial({
      map: this.texture(rank, lg, sealed, legend, classic),
      metalness: sealed ? .55 : classic ? 0 : .35,
      roughness: sealed ? .3 : classic ? .48 : .3,
      clearcoat: sealed ? .8 : classic ? .25 : .8,
      clearcoatRoughness: .2,
      envMap: env,
      envMapIntensity: 1
    });
    const back = new T.MeshPhysicalMaterial({
      map: this.texture(rank, lg, true, legend),
      metalness: .55,
      roughness: .28,
      clearcoat: 1,
      clearcoatRoughness: .12,
      iridescence: 0,
      iridescenceIOR: 1.45,
      iridescenceThicknessRange: [230, 490],
      envMap: env,
      envMapIntensity: 1.1
    });
    if (legend || lg.id === 'dot') edge.color.set(legend?.edition?.ink || 0xd5b46c);
    // Fine diffractive bands respond to view angle through physical iridescence.
    if (!this.foilBands) {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 256;
      const q = c.getContext('2d');
      for (let y = 0; y < 256; y++) {
        const n = Math.round(128 + 120 * Math.sin(y * .021));
        q.fillStyle = `rgb(${n},${n},${n})`;
        q.fillRect(0, y, 256, 1);
      }
      this.foilBands = new T.CanvasTexture(c);
    }
    back.iridescenceThicknessMap = this.foilBands;
    const b = new T.Mesh(body, edge),
      f = new T.Mesh(plane, face),
      k = new T.Mesh(plane, back);
    f.position.z = d * .78;
    k.position.z = -d * .78;
    k.rotation.y = Math.PI;
    g.add(b, f, k);
    if (emblem) {
      const badge = new T.Group();
      badge.position.z = -d * .8;
      badge.rotation.y = Math.PI;
      g.add(badge);
      [[0, .145, true], [-.145, 0, false], [.145, 0, false], [0, -.145, false]].forEach(([x, y, red]) => {
        const m = new T.Mesh(new T.SphereGeometry(w * .078, 24, 12), new T.MeshPhysicalMaterial({
          color: red ? 0xc90622 : 0xe2e5ee,
          metalness: red ? .65 : 1,
          roughness: .17,
          clearcoat: 1,
          envMap: env,
          envMapIntensity: 1.2
        }));
        m.scale.z = .24;
        m.position.set(x * w, y * w, w * .016);
        badge.add(m);
      });
    }
    if (sealed) {
      const band = new T.Group();
      band.position.y = -h * .25;
      g.add(band);
      g.userData.band = band;
      // легендарна: золота стрічка, чорна печатка, золотий замок; звичайна: червона з білою окантовкою, білий круг, чорний замок
      const gold = !!(legend && legend.rarity === 'legendary');
      // стрічка — матовий градієнт від темного до базового тону, без бліків
      const bandTex = (key, dark, base) => {
        this._bandTex = this._bandTex || {};
        if (this._bandTex[key]) return this._bandTex[key];
        const c = document.createElement('canvas');
        c.width = 8;
        c.height = 128;
        const q = c.getContext('2d'),
          gr = q.createLinearGradient(0, 128, 0, 0);
        gr.addColorStop(0, dark);
        gr.addColorStop(.55, base);
        gr.addColorStop(1, base);
        q.fillStyle = gr;
        q.fillRect(0, 0, 8, 128);
        const t = new T.CanvasTexture(c);
        t.colorSpace = T.SRGBColorSpace;
        return this._bandTex[key] = t;
      };
      const bandMat = new T.MeshStandardMaterial({
        map: gold ? bandTex('gold', '#5a3f12', '#d9b25f') : bandTex('red', '#5c070e', '#d71921'),
        metalness: gold ? .25 : .05,
        roughness: gold ? .62 : .72,
        envMap: env,
        envMapIntensity: gold ? .35 : .15
      });
      const wrap = new T.Mesh(new T.BoxGeometry(w * 1.025, h * .125, d * 2.1), bandMat);
      band.add(wrap);
      for (const y of [-1, 1]) {
        const trim = new T.Mesh(new T.BoxGeometry(w * 1.033, h * .008, d * 2.18), new T.MeshStandardMaterial({
          color: gold ? 0xe6c982 : 0xf2f2f2,
          metalness: gold ? .3 : .05,
          roughness: .6,
          envMap: env,
          envMapIntensity: .3
        }));
        trim.position.y = y * h * .059;
        band.add(trim);
      }
      // A small raised lock seal on the back: a closed, tangible reward.
      const seal = new T.Group();
      seal.position.set(0, -h * .25, -d * 1.2);
      seal.rotation.y = Math.PI;
      g.add(seal);
      g.userData.seal = seal;
      const silver = gold ? new T.MeshPhysicalMaterial({
        color: 0x0a0a0c,
        metalness: .4,
        roughness: .35,
        envMap: env,
        envMapIntensity: .6,
        clearcoat: .8
      }) : new T.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: .1,
        roughness: .28,
        envMap: env,
        envMapIntensity: .5,
        clearcoat: .6
      });
      const plate = new T.Mesh(new T.CylinderGeometry(w * .085, w * .085, w * .016, 40), silver);
      plate.rotation.x = Math.PI / 2;
      seal.add(plate);
      const ink = gold ? new T.MeshStandardMaterial({
        color: 0xe6c26a,
        metalness: .9,
        roughness: .25,
        envMap: env,
        envMapIntensity: 1.1
      }) : new T.MeshStandardMaterial({
        color: 0x0a0a0c,
        metalness: .2,
        roughness: .45
      });
      const shackle = new T.Mesh(new T.TorusGeometry(w * .027, w * .006, 8, 24, Math.PI), ink);
      shackle.position.set(0, w * .012, w * .013);
      seal.add(shackle);
      const lock = new T.Mesh(new T.BoxGeometry(w * .063, w * .044, w * .006), ink);
      lock.position.set(0, -w * .012, w * .013);
      seal.add(lock);
    }
    g.userData.mats = [edge, face, back];
    return g;
  },
  renderer(canvas, w, h, exposure = 1) {
    const T = window.THREE,
      r = new T.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
    r.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
    r.setSize(w, h, false);
    r.setClearColor(0, 0);
    r.toneMapping = T.ACESFilmicToneMapping;
    r.toneMappingExposure = exposure;
    r.outputColorSpace = T.SRGBColorSpace;
    return r;
  },
  release(scene, r) {
    const shared = new Set([...this.geometries.values()].flatMap(g => [g.body, g.plane])),
      mats = new Set();
    scene.traverse(o => {
      if (o.geometry && !shared.has(o.geometry)) o.geometry.dispose();
      if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => mats.add(m));
    });
    mats.forEach(m => m.dispose());
    const env = this.envs.get(r);
    if (env) env.dispose();
    this.envs.delete(r);
    r.dispose();
    if (r.forceContextLoss) r.forceContextLoss();
  }
};
const chEase = t => 1 - Math.pow(1 - t, 3);
function chUseLoop(ref, draw, deps, enabled = true) {
  React.useEffect(() => {
    const cv = ref.current;
    if (!cv || !enabled) return;
    let raf = 0,
      visible = true,
      last = performance.now();
    const tick = t => {
      raf = 0;
      if (!window.__forceRender && (!visible || document.hidden)) return;
      const dt = Math.min(.04, (t - last) / 1000);
      last = t;
      draw(dt, t / 1000);
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const io = new IntersectionObserver(es => {
      visible = es[0].isIntersecting;
      if (visible) kick();
    });
    io.observe(cv);
    const vis = () => {
      if (!document.hidden || window.__forceRender) kick();
    };
    document.addEventListener('visibilitychange', vis);
    window.addEventListener('rb-force-render', kick);
    kick();
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', vis);
    };
  }, [...deps, enabled]);
}
function chPointer(s) {
  return {
    onPointerDown: e => {
      e.currentTarget.setPointerCapture(e.pointerId);
      s.current.drag = {
        x: e.clientX,
        y: e.clientY,
        dx: 0,
        dy: 0,
        moved: 0
      };
    },
    onPointerMove: e => {
      const d = s.current.drag;
      if (!d) return;
      d.dx += e.clientX - d.x;
      d.dy += e.clientY - d.y;
      d.moved += Math.abs(e.clientX - d.x);
      d.x = e.clientX;
      d.y = e.clientY;
    },
    onPointerCancel: () => {
      s.current.drag = null;
    }
  };
}
function RbUnlockCard3D({
  level,
  timeline,
  phase,
  w = 402,
  h = 444
}) {
  const ref = React.useRef(null),
    state = React.useRef(null),
    [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    if (!CH.ok() || !ref.current) return;
    let r, scene;
    try {
      const T = window.THREE,
        lg = window.cmLeague.forLevel(level);
      r = CH.renderer(ref.current, w, h, 1.05);
      scene = new T.Scene();
      const camera = new T.PerspectiveCamera(30, w / h, .1, 30);
      camera.position.set(0, 0, 4.3);
      const card = CH.makeCard({
        rank: window.cmLeague.rankForLevel(level),
        lg,
        w: 1.18,
        h: 1.65,
        d: .043,
        env: CH.envFor(r),
        sealed: true,
        legend: window.cmCollectibles[level]
      });
      scene.add(card);
      scene.add(new T.HemisphereLight(0xffffff, 0x4c6460, 1.5));
      const key = new T.DirectionalLight(0xf4f7ff, 2);
      key.position.set(-3, 5, 4);
      scene.add(key);
      const rim = new T.DirectionalLight(0xb7f4d4, 1.3);
      rim.position.set(3, 2, -2);
      scene.add(rim);
      const sealParts = [];
      [card.userData.band, card.userData.seal].forEach(group => group?.traverse(o => {
        if (o.material) {
          o.material.transparent = true;
          sealParts.push(o.material);
        }
      }));
      state.current = {
        r,
        scene,
        camera,
        card,
        lg,
        sealParts,
        front: false,
        settled: false
      };
    } catch (e) {
      if (r && scene) CH.release(scene, r);
      setFailed(true);
    }
    return () => {
      const d = state.current;
      if (d) CH.release(d.scene, d.r);
      state.current = null;
    };
  }, [level, w, h]);
  chUseLoop(ref, () => {
    const d = state.current;
    if (!d || d.settled) return;
    const t = timeline.current.time,
      clamp = v => Math.max(0, Math.min(1, v)),
      smooth = v => v * v * (3 - 2 * v);
    const release = smooth(clamp((t - .26) / .64)),
      turn = smooth(clamp((t - .72) / 1.34)),
      settle = smooth(clamp((t - 2.05) / .85));
    if (t >= .94 && !d.front) {
      d.card.userData.mats[1].map = CH.texture(window.cmLeague.rankForLevel(level), d.lg, false, window.cmCollectibles[level]);
      d.card.userData.mats[1].needsUpdate = true;
      d.front = true;
    }
    d.card.rotation.set(-.07 + Math.sin(turn * Math.PI) * .14, Math.PI + .20 + (Math.PI - .43) * turn, -.11 + .075 * settle);
    d.card.scale.setScalar(1 + Math.sin(turn * Math.PI) * .09);
    d.card.position.y = Math.sin(turn * Math.PI) * .08 + .10 * settle;
    const band = d.card.userData.band,
      seal = d.card.userData.seal;
    band.position.y = -1.65 * .25 - release * .35;
    band.scale.set(1 + release * .48, Math.max(.01, 1 - release * .7), 1);
    band.visible = release < 1;
    seal.position.set(0, -1.65 * .25 + release * .24, -.043 * 1.2 - release * .55);
    seal.rotation.z = release * .4;
    seal.visible = release < 1;
    d.sealParts.forEach(m => m.opacity = 1 - release);
    d.r.render(d.scene, d.camera);
    if (t >= 3.2) d.settled = true;
  }, [level, w, h], !failed);
  if (!CH.ok() || failed) return /*#__PURE__*/React.createElement("div", {
    className: "rb-unlock-fallback"
  }, /*#__PURE__*/React.createElement(window.LevelCard, {
    level: level,
    w: 210,
    face: phase === 2
  }));
  return /*#__PURE__*/React.createElement("canvas", {
    key: level,
    ref: ref,
    role: "img",
    "aria-label": phase === 2 ? 'New king revealed' : 'Sealed king opening',
    style: {
      width: w,
      height: h,
      display: 'block'
    }
  });
}
function RbHeroCard3D({
  level,
  w = 230,
  h = 290,
  faceUp = false,
  onFlip,
  glow = true
}) {
  const ref = React.useRef(null),
    three = React.useRef(null),
    s = React.useRef({
      y: faceUp ? 0 : Math.PI + .28,
      x: -.1,
      drag: null,
      age: 0
    });
  const [failed, setFailed] = React.useState(false),
    lg = window.cmLeague.forLevel(level),
    rank = window.cmLeague.rankForLevel(level);
  React.useEffect(() => {
    if (!CH.ok() || !ref.current) return;
    let r;
    try {
      const T = window.THREE;
      r = CH.renderer(ref.current, w, h, 1);
      const scene = new T.Scene(),
        cam = new T.PerspectiveCamera(29, w / h, .1, 40);
      cam.position.set(0, 0, 3.7);
      const env = CH.envFor(r),
        card = CH.makeCard({
          rank,
          lg,
          env,
          emblem: true,
          legend: window.cmCollectibles[level]
        });
      scene.add(card);
      scene.add(new T.HemisphereLight(0xffffff, 0x68788e, 1.0));
      s.current.y = faceUp ? 0 : Math.PI + .28;
      s.current.age = 0;
      three.current = {
        r,
        scene,
        cam,
        card
      };
    } catch (e) {
      if (r) r.dispose();
      setFailed(true);
    }
    return () => {
      const d = three.current;
      if (d) CH.release(d.scene, d.r);
      three.current = null;
    };
  }, [level, w, h]);
  React.useEffect(() => {
    s.current.target = faceUp ? Math.round(s.current.y / (Math.PI * 2)) * Math.PI * 2 : Math.PI + Math.round((s.current.y - Math.PI) / (Math.PI * 2)) * Math.PI * 2;
  }, [faceUp]);
  chUseLoop(ref, (dt, t) => {
    const d = three.current;
    if (!d) return;
    const q = s.current;
    q.age += dt;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (q.drag) {
      q.y += q.drag.dx * .014;
      q.x = Math.max(-.7, Math.min(.7, q.x + q.drag.dy * .007));
      q.drag.dx = q.drag.dy = 0;
      q.target = null;
    } else if (q.target != null) {
      q.y += (q.target - q.y) * Math.min(1, dt * 7);
      if (Math.abs(q.target - q.y) < .008) q.target = null;
    } else if (!reduced) q.y += dt * .27;
    d.card.rotation.set(q.x + (!reduced ? Math.sin(t * .5) * .055 : 0), q.y, -.065);
    d.card.position.y = reduced ? 0 : Math.sin(t * .7) * .035;
    d.r.render(d.scene, d.cam);
  }, [level, w, h]);
  const flip = () => {
    s.current.target = s.current.y + Math.PI;
    onFlip && onFlip();
  };
  if (!CH.ok() || failed) return /*#__PURE__*/React.createElement("div", {
    style: {
      width: w,
      height: h,
      display: 'grid',
      placeItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(window.LevelCard, {
    level: level,
    w: 110,
    face: true,
    highlight: true
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: w,
      height: h
    }
  }, glow && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: '20%',
      background: `radial-gradient(ellipse,${lg.color}23,transparent 70%)`,
      filter: 'blur(20px)'
    }
  }), /*#__PURE__*/React.createElement("canvas", _extends({
    key: level,
    ref: ref,
    width: w,
    height: h,
    role: "button",
    tabIndex: 0,
    "aria-label": `Обертати карту ${rank}${lg.suit}. Enter — перевернути.`,
    onKeyDown: e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    }
  }, chPointer(s), {
    onPointerUp: () => {
      const d = s.current.drag;
      s.current.drag = null;
      if (d && d.moved < 6) flip();
    },
    style: {
      position: 'relative',
      width: w,
      height: h,
      display: 'block',
      touchAction: 'pan-y',
      cursor: 'grab'
    }
  })));
}
function RbHouse3D({
  floors,
  w = 366,
  h = 380,
  collapse = false,
  onCollapsed,
  autoRotate = true,
  explode = 0,
  zoom = 1,
  captureRef,
  flight,
  onFlightEnd
}) {
  const ref = React.useRef(null),
    three = React.useRef(null),
    state = React.useRef({
      orbit: .48,
      tilt: .26,
      drag: null,
      age: 0,
      fall: null
    });
  const callback = React.useRef(onCollapsed);
  callback.current = onCollapsed;
  const explodeRef = React.useRef(explode);
  explodeRef.current = explode;
  const zoomRef = React.useRef(zoom);
  zoomRef.current = zoom;
  const flightEnd = React.useRef(onFlightEnd);
  flightEnd.current = onFlightEnd;
  const [failed, setFailed] = React.useState(false);
  const sig = JSON.stringify((floors || []).map(f => [f.lg.id, f.pairs, f.ace, f.complete, f.odd, f.N]));
  React.useEffect(() => {
    if (!CH.ok() || !ref.current) return;
    let r;
    try {
      const T = window.THREE;
      r = CH.renderer(ref.current, w, h, 1.05);
      const scene = new T.Scene(),
        cam = new T.PerspectiveCamera(31, w / h, .1, 70),
        env = CH.envFor(r),
        root = new T.Group();
      scene.add(root);
      scene.add(new T.HemisphereLight(0xf5f7ff, 0x68788e, 1.15));
      const key = new T.DirectionalLight(0xffffff, 1.25);
      key.position.set(-3, 6, 5);
      scene.add(key);
      const rim = new T.DirectionalLight(0x8ca7ff, 1.7);
      rim.position.set(5, 1, -5);
      scene.add(rim);
      const cards = [],
        groups = [],
        CW = .52,
        HH = .76,
        lean = .37,
        AH = HH * Math.cos(lean),
        off = HH * Math.sin(lean) / 2;
      let height = 0;
      const ghostMat = new T.MeshBasicMaterial({
        color: 0xb3c8e5,
        transparent: true,
        opacity: .08,
        depthWrite: false
      });
      (floors || []).forEach((f, fi) => {
        const size = Math.pow(.84, fi),
          group = new T.Group();
        group.scale.setScalar(size);
        group.position.y = height;
        group.userData.base = height;
        root.add(group);
        groups.push(group);
        // Six structural A-frames around a central, upright trophy ace.
        const slots = [[-.62, .37], [.62, .37], [-.62, -.37], [.62, -.37], [0, .77], [0, -.77]];
        slots.forEach(([x, z], i) => {
          for (const sign of [-1, 1]) {
            const frame = new T.Group();
            frame.position.set(x, 0, z);
            if (i >= 4) frame.rotation.y = Math.PI / 2;
            group.add(frame);
            const card = CH.makeCard({
              rank: window.cmLeague.RANKS[i * 2 + (sign > 0 ? 1 : 0)],
              lg: f.lg,
              w: CW,
              h: HH,
              d: .012,
              env,
              classic: true
            });
            card.userData.level = f.lg.min + i * 2 + (sign > 0 ? 1 : 0);
            card.rotation.set(0, sign > 0 ? -Math.PI / 2 : Math.PI / 2, sign * lean);
            // Euler order matters: orient the wide face along depth, lean across x.
            card.rotation.order = 'ZYX';
            card.position.set(sign * off, AH / 2, 0);
            const built = f.complete || i < f.pairs;
            if (!built) {
              card.traverse(o => {
                if (o.isMesh) {
                  o.material.dispose();
                  o.material = ghostMat;
                }
              });
            }
            frame.add(card);
            card.userData.current = !f.complete && built;
            card.userData.ghost = !built;
            card.userData.base = card.position.clone();
            card.userData.rot = card.rotation.clone();
            card.userData.delay = f.complete ? 0 : .08 + i * .11;
            cards.push(card);
          }
        });
        if (f.ace) {
          const ace = CH.makeCard({
            rank: 'A',
            lg: f.lg,
            w: CW * .96,
            h: HH * .96,
            d: .015,
            env,
            classic: true
          });
          ace.userData.level = f.lg.max;
          ace.position.set(0, HH * .49, .055);
          ace.userData.current = !f.complete;
          ace.userData.base = ace.position.clone();
          ace.userData.rot = ace.rotation.clone();
          ace.userData.delay = .1;
          group.add(ace);
          cards.push(ace);
        }
        // At one card, show the starting card upright in the centre. Later odd
        // cards are represented in the labelled waiting slot outside the 3D floor.
        if (f.N === 1) {
          const first = CH.makeCard({
            rank: '2',
            lg: f.lg,
            w: CW,
            h: HH,
            d: .012,
            env,
            classic: true
          });
          first.userData.level = f.lg.min;
          first.position.set(0, HH * .5, 0);
          first.rotation.y = .15;
          group.add(first);
          first.userData.current = !f.complete;
          first.userData.base = first.position.clone();
          first.userData.rot = first.rotation.clone();
          first.userData.delay = 0;
          cards.push(first);
        }
        // Thin smoked structural shelf makes the tier's support readable; not a reward card.
        if (f.complete && fi < floors.length - 1) {
          const slab = new T.Mesh(new T.BoxGeometry(1.87, .019, 1.75), new T.MeshPhysicalMaterial({
            color: f.lg.color,
            metalness: .8,
            roughness: .25,
            transparent: true,
            opacity: .12,
            envMap: env
          }));
          slab.position.y = AH + .01;
          group.add(slab);
        }
        height += (AH + .045) * size;
      });
      // The cards stand on their own: no display base or rings.
      root.position.y = -height * .46;
      const dist = Math.max((height + .5) * .5, 1.4 / (w / h)) / Math.tan(cam.fov * Math.PI / 360) * 1.08;
      cam.position.set(0, dist * .32, dist * .947);
      cam.lookAt(0, 0, 0);
      state.current.age = 100;
      state.current.fall = null;
      three.current = {
        r,
        scene,
        cam,
        root,
        cards,
        groups,
        dist
      };
      if (flight) {
        // One real 3D scene: preserve the house projection in the full-screen camera.
        const houseDist = Math.max((height + .5) * .5, 1.4 / (402 / 438)) / Math.tan(cam.fov * Math.PI / 360) * 1.08;
        const pose = flight.pose || {
          orbit: .48,
          tilt: .26
        };
        root.rotation.y = pose.orbit;
        const forward = new T.Vector3(0, Math.sin(pose.tilt), Math.cos(pose.tilt));
        const fullDist = houseDist / zoom;
        cam.position.copy(forward).multiplyScalar(fullDist);
        cam.lookAt(0, 0, 0);
        cam.setViewOffset(402, 438, -flight.left, -flight.top, 402, 874);
        const vertical = 2 * fullDist * Math.tan(cam.fov * Math.PI / 360) * 874 / 438;
        scene.updateMatrixWorld(true);
        cam.updateMatrixWorld(true);
        const planeZ = new T.Vector3().project(cam).z,
          main = flight.route[flight.route.length - 1];
        const items = cards.filter(c => !c.userData.ghost).map((c, i) => {
          scene.attach(c);
          const base = c.position.clone(),
            q = c.quaternion.clone(),
            scale = c.scale.clone(),
            n = c.userData.level;
          const exact = flight.route.find(p => p.n === n),
            point = exact || main;
          const target = new T.Vector3(point.x / 402 * 2 - 1, 1 - point.y / 874 * 2, planeZ).unproject(cam);
          if (!exact) {
            target.x += (i % 3 - 1) * .06;
            target.z -= .03 * i;
          }
          const targetScale = new T.Vector3().setScalar(point.w / 402 * vertical * (402 / 874) / .52);
          const front = cam.quaternion.clone().multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 0, 1), -.05));
          return {
            c,
            base,
            q,
            scale,
            target,
            targetScale,
            front,
            exact,
            i
          };
        });
        cards.filter(c => c.userData.ghost).forEach(c => c.visible = false);
        groups.forEach(g => g.visible = false);
        three.current.flight = {
          items,
          time: 0,
          done: false,
          fromHouse: flight.fromHouse
        };
      }
    } catch (e) {
      if (r) r.dispose();
      setFailed(true);
    }
    return () => {
      const d = three.current;
      if (d) CH.release(d.scene, d.r);
      three.current = null;
    };
  }, [sig, w, h]);
  React.useEffect(() => {
    if (!captureRef) return;
    captureRef.current = () => {
      const d = three.current;
      if (!d || !ref.current) return [];
      d.scene.updateMatrixWorld(true);
      d.cam.updateMatrixWorld(true);
      const box = ref.current.getBoundingClientRect(),
        T = window.THREE;
      return d.cards.filter(c => !c.userData.ghost && c.userData.level).map(c => {
        const v = c.getWorldPosition(new T.Vector3()).project(d.cam),
          n = c.userData.level,
          lg = window.cmLeague.forLevel(n);
        const texture = CH.texture(window.cmLeague.rankForLevel(n), lg, false, window.cmCollectibles[n]);
        const src = texture.image.toDataURL('image/png');
        texture.dispose();
        return {
          n,
          src,
          x: box.left + (v.x + 1) * box.width / 2,
          y: box.top + (1 - v.y) * box.height / 2,
          w: box.width * .095,
          h: box.width * .135,
          angle: (n % 2 ? 1 : -1) * 22
        };
      });
    };
    captureRef.current.pose = () => ({
      orbit: state.current.orbit,
      tilt: state.current.tilt
    });
    return () => {
      captureRef.current = null;
    };
  }, [sig, w, h, captureRef]);
  React.useEffect(() => {
    if (!collapse) {
      state.current.fall = null;
      return;
    }
    if (!three.current) {
      const id = setTimeout(() => callback.current && callback.current(), 900);
      return () => clearTimeout(id);
    }
    const T = window.THREE,
      d = three.current,
      items = [];
    d.cards.filter(c => c.userData.current).forEach((c, i) => {
      // Detach preserving world transform: gravity then acts consistently on tilted cards.
      d.root.attach(c);
      items.push({
        c,
        p: c.position.clone(),
        rot: c.rotation.clone(),
        v: new T.Vector3(Math.sin(i * 2.4) * 1.5, 1.8 + i % 3 * .17, Math.cos(i * 2.4) * 1.4),
        i
      });
    });
    state.current.fall = {
      t: 0,
      items,
      done: false
    };
  }, [collapse, sig]);
  chUseLoop(ref, (dt, t) => {
    const d = three.current;
    if (!d) return;
    const s = state.current,
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    s.age += dt;
    if (d.flight) {
      const f = d.flight;
      f.time += dt;
      f.items.forEach(({
        c,
        base,
        q,
        scale,
        target,
        targetScale,
        front,
        exact,
        i
      }) => {
        const raw = Math.max(0, Math.min(1, (f.time - i * .015) / 1.25)),
          ease = raw * raw * (3 - 2 * raw),
          u = f.fromHouse ? ease : 1 - ease;
        c.position.copy(base).lerp(target, u);
        c.position.y += Math.sin(Math.PI * u) * (.35 + i % 3 * .08);
        c.quaternion.copy(q).slerp(front, u);
        c.scale.copy(scale).lerp(targetScale, u);
        c.visible = exact || u < .96;
        if (!exact) c.scale.multiplyScalar(1 - Math.pow(u, 8) * .99);
      });
      d.r.render(d.scene, d.cam);
      if (f.time > 1.25 + f.items.length * .015 && !f.done) {
        f.done = true;
        flightEnd.current?.();
      }
      return;
    }
    if (s.drag) {
      s.orbit += s.drag.dx * .011;
      s.tilt = Math.max(.08, Math.min(.67, s.tilt + s.drag.dy * .003));
      s.drag.dx = s.drag.dy = 0;
    } else if (autoRotate && !reduced && !s.fall) s.orbit += dt * .1;
    d.root.rotation.y = s.orbit;
    d.cam.position.set(0, Math.sin(s.tilt) * d.dist / zoomRef.current, Math.cos(s.tilt) * d.dist / zoomRef.current);
    d.cam.lookAt(0, 0, 0);
    d.groups.forEach((g, i) => {
      g.position.y += (g.userData.base + i * explodeRef.current * .28 - g.position.y) * Math.min(1, dt * 6);
    });
    if (!s.fall) d.cards.forEach(c => {
      if (c.userData.current && !reduced) {
        const p = Math.max(0, Math.min(1, (s.age - c.userData.delay) / .8));
        c.position.y = c.userData.base.y + (1 - chEase(p)) * .55;
        c.scale.setScalar(.75 + .25 * chEase(p));
      }
    });
    if (s.fall) {
      const f = s.fall;
      f.t += dt;
      f.items.forEach(({
        c,
        p,
        rot,
        v,
        i
      }) => {
        const q = Math.max(0, f.t - .12),
          pull = Math.min(1, f.t / .12);
        c.position.copy(p).addScaledVector(v, q);
        c.position.y -= 3.4 * q * q;
        c.rotation.set(rot.x + q * (2 + i % 3), rot.y + q * (i % 2 ? 3 : -3), rot.z + q);
        c.scale.setScalar(Math.max(.001, 1 - Math.max(0, q - .75)));
      });
      if (!f.done && f.t > (reduced ? .25 : 1.55)) {
        f.done = true;
        callback.current && callback.current();
      }
    }
    d.r.render(d.scene, d.cam);
  }, [sig, w, h, autoRotate]);
  if (!CH.ok() || failed) return /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: h,
      display: 'grid',
      placeItems: 'center',
      color: '#c2c9d2',
      textAlign: 'center'
    }
  }, "\u2666 \u2663 \u2665 \u2660 \u25CF", /*#__PURE__*/React.createElement("br", null), "3D \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0435 \u043D\u0430 \u0446\u044C\u043E\u043C\u0443 \u043F\u0440\u0438\u0441\u0442\u0440\u043E\u0457.", /*#__PURE__*/React.createElement("br", null), floors.filter(f => f.complete).length, " \u043F\u043E\u0432\u0435\u0440\u0445\u0456\u0432 \u0437\u0431\u0435\u0440\u0435\u0436\u0435\u043D\u043E");
  // Scene cleanup explicitly loses its WebGL context. A changed floor layout
  // must get a fresh canvas; reusing the released canvas fails after collecting.
  return /*#__PURE__*/React.createElement("canvas", _extends({
    key: `${sig}:${w}:${h}`,
    ref: ref,
    width: w,
    height: h,
    role: "img",
    "aria-label": `Картковий будинок, ${floors.length} поверхів. Перетягніть, щоб обертати.`
  }, chPointer(state), {
    onPointerUp: () => state.current.drag = null,
    style: {
      width: '100%',
      height: 'auto',
      aspectRatio: `${w}/${h}`,
      display: 'block',
      touchAction: 'pan-y',
      cursor: 'grab'
    }
  }));
}
// Opaque, embossed back for devices that cannot create a WebGL renderer.
function RbSealedCardArt({
  lg,
  level,
  sealed = true,
  legend = null
}) {
  const id = `rb-sealed-${level}`,
    base = '#17191e';
  return /*#__PURE__*/React.createElement("svg", {
    width: "156",
    height: "220",
    viewBox: "0 0 156 220",
    "aria-hidden": "true",
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `${id}-edge`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#e7f1fa"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".27",
    stopColor: "#71899d"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".54",
    stopColor: "#eef5fc"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#596c80"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: `${id}-body`,
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#343740"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".55",
    stopColor: base
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#0c0d11"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: `${id}-chrome`,
    cx: "30%",
    cy: "24%",
    r: "80%"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#ffffff"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".28",
    stopColor: "#e7eef6"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".55",
    stopColor: "#7f95aa"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".8",
    stopColor: "#d0dce9"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#58687a"
  })), /*#__PURE__*/React.createElement("radialGradient", {
    id: `${id}-red`,
    cx: "28%",
    cy: "20%",
    r: "85%"
  }, /*#__PURE__*/React.createElement("stop", {
    stopColor: "#ff8c9b"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".28",
    stopColor: "#ec2449"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".8",
    stopColor: "#9f0926"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#530e1d"
  }))), /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "153",
    height: "217",
    rx: "10",
    fill: "#425666"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "1",
    width: "152",
    height: "216",
    rx: "9",
    fill: `url(#${id}-body)`,
    stroke: `url(#${id}-edge)`,
    strokeWidth: "2.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "8",
    width: "138",
    height: "202",
    rx: "5",
    fill: "none",
    stroke: "#afc8d8",
    strokeWidth: ".9"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "12",
    y: "12",
    width: "130",
    height: "194",
    rx: "4",
    fill: "none",
    stroke: "#a42a3b",
    strokeWidth: ".7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M77 47 129 109 77 169 25 109Z",
    fill: "none",
    stroke: "#b9d1da",
    strokeOpacity: ".45",
    strokeWidth: ".8"
  }), /*#__PURE__*/React.createElement("text", {
    x: "77",
    y: "33",
    textAnchor: "middle",
    fill: "#dceaf1",
    fontSize: "5.8",
    fontFamily: "sans-serif",
    letterSpacing: "1.4"
  }, "POKERDOT"), [[77, 86, true], [54, 109, false], [100, 109, false], [77, 132, false]].map(([x, y, red], i) => /*#__PURE__*/React.createElement("g", {
    key: i
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: x + 1,
    cy: y + 2,
    rx: "10",
    ry: "10",
    fill: "#092323"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: x,
    cy: y,
    r: "9.5",
    fill: `url(#${id}-${red ? 'red' : 'chrome'})`,
    stroke: red ? '#f55b72' : '#e6f0f7',
    strokeWidth: ".6"
  }))), legend && /*#__PURE__*/React.createElement("g", {
    stroke: legend.edition.ink,
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "5",
    width: "144",
    height: "208",
    rx: "7",
    strokeWidth: legend.rarity === 'legendary' ? 1.5 : .9
  }), /*#__PURE__*/React.createElement("g", {
    transform: "translate(77 109) scale(.28)",
    strokeWidth: "2.2",
    opacity: ".72"
  }, CH.editionPaths(legend.edition).map((path, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: path
  }))), /*#__PURE__*/React.createElement("text", {
    x: "77",
    y: "47",
    textAnchor: "middle",
    stroke: "none",
    fill: legend.edition.ink,
    fontSize: "5.5",
    fontFamily: "sans-serif"
  }, legend.year || legend.name)), sealed && /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: `${id}-band`,
    x1: "0",
    y1: "1",
    x2: "0",
    y2: "0"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: legend?.rarity === 'legendary' ? '#5a3f12' : '#5c070e'
  }), /*#__PURE__*/React.createElement("stop", {
    offset: ".55",
    stopColor: legend?.rarity === 'legendary' ? '#d9b25f' : '#d71921'
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: legend?.rarity === 'legendary' ? '#d9b25f' : '#d71921'
  })), /*#__PURE__*/React.createElement("rect", {
    x: "-1",
    y: "170",
    width: "158",
    height: "27",
    fill: `url(#${id}-band)`,
    stroke: legend?.rarity === 'legendary' ? '#f3dc9a' : '#fff',
    strokeWidth: "1.6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "77",
    cy: "183",
    r: "12",
    fill: legend?.rarity === 'legendary' ? '#0a0a0c' : '#fff'
  }), /*#__PURE__*/React.createElement("path", {
    d: "M73 182v-3a4 4 0 0 1 8 0v3m-9 0h10v7h-10z",
    fill: "none",
    stroke: legend?.rarity === 'legendary' ? '#e6c26a' : '#0a0a0c',
    strokeWidth: "1.6",
    strokeLinejoin: "round"
  })));
}
// Only cards near the viewport allocate a WebGL context. A long map must not
// keep 65 renderers alive; offscreen nodes retain an opaque static card.
function RbRouteCardStill({
  level,
  sealed,
  w = 150
}) {
  const lg = window.cmLeague.forLevel(level),
    cw = w * .72,
    ref = React.useRef(null),
    legend = window.cmCollectibles[level];
  React.useEffect(() => {
    let alive = true;
    const draw = () => {
      if (!alive || !ref.current || !CH.ok()) return;
      const texture = CH.texture(window.cmLeague.rankForLevel(level), lg, false, legend);
      const g = ref.current.getContext('2d');
      g.clearRect(0, 0, 512, 720);
      g.drawImage(texture.image, 0, 0);
    };
    draw();
    CH_SIGNATURE_READY.then(draw);
    return () => {
      alive = false;
    };
  }, [level]);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'grid',
      placeItems: 'center',
      filter: legend ? 'drop-shadow(0 0 3px #d4aa5540)' : undefined
    }
  }, sealed ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: cw,
      height: cw * 220 / 156
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      transform: `scale(${cw / 156})`,
      transformOrigin: 'top left'
    }
  }, /*#__PURE__*/React.createElement(RbSealedCardArt, {
    lg: lg,
    level: level,
    legend: legend
  }))) : /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    width: 512,
    height: 720,
    "aria-hidden": "true",
    style: {
      width: cw,
      height: cw * 720 / 512,
      display: 'block',
      borderRadius: cw * .055,
      border: `1px solid ${legend?.edition?.ink || '#adbcc6'}`,
      transform: 'perspective(600px) rotateY(13deg) rotateZ(3deg)',
      filter: 'none'
    }
  }));
}
function RbRouteCardScene({
  level,
  sealed,
  side,
  w = 150,
  h = 208,
  animate = true,
  onSnapshot
}) {
  const ref = React.useRef(null),
    three = React.useRef(null),
    [failed, setFailed] = React.useState(false);
  const lg = window.cmLeague.forLevel(level),
    rank = window.cmLeague.rankForLevel(level);
  React.useEffect(() => {
    if (!CH.ok() || !ref.current) return;
    let r, scene;
    try {
      const T = window.THREE;
      r = CH.renderer(ref.current, w, h, 1.03);
      scene = new T.Scene();
      const camera = new T.PerspectiveCamera(29, w / h, .1, 40);
      camera.position.set(0, 0, 3.45);
      const env = CH.envFor(r),
        card = CH.makeCard({
          rank,
          lg,
          d: sealed ? .037 : .024,
          env,
          sealed,
          legend: window.cmCollectibles[level]
        });
      card.userData.mats.forEach(m => {
        m.transparent = false;
        m.opacity = 1;
        m.transmission = 0;
        m.depthWrite = true;
      });
      const [edge, face, back] = card.userData.mats;
      edge.color.set(window.cmCollectibles[level]?.edition?.ink || (lg.id === 'dot' ? 0xe7c783 : 0xc9d4df));
      edge.roughness = .24;
      edge.envMapIntensity = 1.4;
      face.clearcoat = .35;
      face.envMapIntensity = .55;
      back.metalness = .55;
      back.roughness = .33;
      back.clearcoat = .65;
      back.envMapIntensity = .75;
      back.iridescence = 0;
      card.rotation.set(-.11, (sealed ? Math.PI : 0) + side * .24, side * .055);
      scene.add(card);
      scene.add(new T.HemisphereLight(0xffffff, 0x627184, 1));
      const fill = new T.DirectionalLight(0xe6efff, .35);
      fill.position.set(-3, 4, 5);
      scene.add(fill);
      r.render(scene, camera);
      three.current = {
        r,
        scene,
        camera,
        card
      };
    } catch (e) {
      console.warn('Route card renderer:', e.message);
      if (r) {
        if (scene) CH.release(scene, r);else {
          r.dispose();
          r.forceContextLoss();
        }
      }
      setFailed(true);
    }
    return () => {
      const d = three.current;
      if (d) CH.release(d.scene, d.r);
      three.current = null;
    };
  }, [level, sealed, side, w, h]);
  chUseLoop(ref, (dt, t) => {
    const d = three.current;
    if (!d) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Restrained tilt shows the metal edge. Sealed backs never reveal a face.
    d.card.rotation.y = (sealed ? Math.PI : 0) + side * .24 + (reduced ? 0 : Math.sin(t * .6 + level) * .045);
    d.card.position.y = reduced ? 0 : Math.sin(t * .7 + level) * .016;
    d.r.render(d.scene, d.camera);
  }, [level, sealed, side, w, h], animate);
  React.useEffect(() => {
    const d = three.current;
    if (!animate && d && onSnapshot) {
      d.r.render(d.scene, d.camera);
      onSnapshot(d.r.domElement.toDataURL('image/png'));
    }
  }, [animate]);
  if (!CH.ok() || failed) return /*#__PURE__*/React.createElement(RbRouteCardStill, {
    level: level,
    sealed: sealed,
    w: w
  });
  return /*#__PURE__*/React.createElement("canvas", {
    key: `${level}-${sealed}-${w}-${h}`,
    ref: ref,
    width: w,
    height: h,
    "aria-hidden": "true",
    style: {
      position: 'relative',
      display: 'block',
      width: w,
      height: h,
      pointerEvents: 'none'
    }
  });
}
function RbRouteCard3D({
  level,
  sealed,
  active,
  side,
  w = 150,
  h = 208,
  animate = true
}) {
  const [live, setLive] = React.useState(false),
    [shown, setShown] = React.useState(false),
    [snapshot, setSnapshot] = React.useState(null);
  React.useEffect(() => {
    let frame = 0,
      second = 0;
    let timer;
    if (active) {
      timer = setTimeout(() => {
        setLive(true);
        frame = requestAnimationFrame(() => {
          second = requestAnimationFrame(() => setShown(true));
        });
      }, 650);
    } else {
      setShown(false);
      timer = setTimeout(() => setLive(false), 250);
    }
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(second);
    };
  }, [active]);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      position: 'relative',
      width: w,
      height: h
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: shown ? 0 : 1,
      transition: 'opacity 350ms'
    }
  }, /*#__PURE__*/React.createElement(React.Fragment, null, snapshot ? /*#__PURE__*/React.createElement("img", {
    src: snapshot,
    alt: "",
    style: {
      display: 'block',
      width: w,
      height: h
    }
  }) : /*#__PURE__*/React.createElement(RbRouteCardStill, {
    level: level,
    sealed: sealed,
    w: w
  }))), live && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: shown ? 1 : 0,
      transition: 'opacity 350ms'
    }
  }, /*#__PURE__*/React.createElement(RbRouteCardScene, {
    level: level,
    sealed: sealed,
    side: side,
    w: w,
    h: h,
    animate: animate && active,
    onSnapshot: setSnapshot
  })));
}
// A readable, angled collectible in the archival story composition.
function RbLegendCard3D({
  level,
  w = 250,
  h = 275
}) {
  const ref = React.useRef(null),
    state = React.useRef(null),
    [failed, setFailed] = React.useState(false);
  React.useEffect(() => {
    if (!CH.ok() || !ref.current) return;
    let r, scene;
    try {
      const T = window.THREE;
      r = CH.renderer(ref.current, w, h, 1.12);
      scene = new T.Scene();
      const camera = new T.PerspectiveCamera(30, w / h, .1, 30);
      camera.position.set(0, 0, 3.3);
      const lg = window.cmLeague.forLevel(level),
        card = CH.makeCard({
          rank: window.cmLeague.rankForLevel(level),
          lg,
          d: .033,
          env: CH.envFor(r),
          legend: window.cmCollectibles[level]
        });
      card.rotation.set(.15, -.38, -.20);
      card.userData.mats[1].envMapIntensity = .6;
      card.userData.mats[1].clearcoat = .6;
      scene.add(card);
      scene.add(new T.HemisphereLight(0xffffff, 0x5b697d, 1.1));
      const key = new T.DirectionalLight(0xffe8be, 1.2);
      key.position.set(-3, 4, 5);
      scene.add(key);
      r.render(scene, camera);
      state.current = {
        r,
        scene,
        camera,
        card,
        time: 0
      };
    } catch (e) {
      if (r && scene) CH.release(scene, r);
      setFailed(true);
    }
    return () => {
      if (state.current) CH.release(state.current.scene, state.current.r);
      state.current = null;
    };
  }, [level, w, h]);
  chUseLoop(ref, dt => {
    const d = state.current;
    if (!d) return;
    d.time += dt;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      t = reduced ? 0 : d.time;
    d.card.rotation.set(.15 + Math.sin(t * .5) * .025, -.38 + Math.sin(t * .65) * .065, -.20 + Math.sin(t * .5) * .018);
    d.card.position.y = Math.sin(t * .8) * .022;
    d.r.render(d.scene, d.camera);
  }, [level, w, h]);
  if (!CH.ok() || failed) return /*#__PURE__*/React.createElement(RbRouteCardStill, {
    level: level,
    w: w
  });
  return /*#__PURE__*/React.createElement("canvas", {
    ref: ref,
    width: w,
    height: h,
    role: "img",
    "aria-label": `${window.cmLeague.cardForLevel(level)} · ${window.cmLegends[level].name}`,
    style: {
      display: 'block',
      width: w,
      height: h
    }
  });
}

// A fixed, true isometric camera. Each step follows one of the ground axes;
// selecting a card moves the camera, never the positions of neighbouring levels.
// v3: крок між картами і масштаб кадру — параметри (Вадим: 3 карти в кадрі, крок більший)
window.RB_ISO_STEP = window.RB_ISO_STEP || 2.9;
window.RB_ISO_ZOOM = window.RB_ISO_ZOOM || 3.35;
window.RB_ISO_AHEAD = window.RB_ISO_AHEAD || 2;
window.RB_ISO_SIDE = window.RB_ISO_SIDE || 0.8; // від краю до краю кадру
window.RB_ISO_BARE = window.RB_ISO_BARE !== false; // v3: без острівців і доріжок — лише карти
window.RB_ISO_DOWN = window.RB_ISO_DOWN || 1.25; // (орто-режим) наскільки камера дивиться вперед
// v3 · перспектива від першої особи: камера стоїть за вибраною картою, нахил 70° від вертикалі
// RB_ISO_TILT — нахил камери вниз від горизонту (70° = майже зверху); карти нахилені назустріч камері (RB_ISO_CARD_TILT, частка від нахилу)
window.RB_ISO_TILT = window.RB_ISO_TILT || 60;
window.RB_ISO_R = window.RB_ISO_R || 4.7;
window.RB_ISO_FOV = window.RB_ISO_FOV || 50;
window.RB_ISO_LOOK = window.RB_ISO_LOOK || {
  downOff: 12,
  cardY: .95
};
window.RB_ISO_CARD_TILT = window.RB_ISO_CARD_TILT || 0;
// v3 · прямий ракурс: камера на рівні карти, шлях іде вгору під ухилом RB_ISO_SLOPE°, підлога з відбиттям, без прогрес-бару
window.RB_ISO_FLOOR_LEN = window.RB_ISO_FLOOR_LEN || 44;
window.RB_ISO_FLOOR_AHEAD = window.RB_ISO_FLOOR_AHEAD || 13; /* скляна плита: довжина і як далеко попереду її кромка-горизонт */
window.RB_ISO_FRONT = window.RB_ISO_FRONT !== false;
window.RB_ISO_SLOPE = window.RB_ISO_SLOPE || 24;
window.RB_ISO_EYE = window.RB_ISO_EYE || 0; // EYE — зсув ока від центру карти (0 = рівно по центру, погляд без нахилу)
// кожна наступна карта стоїть на сходинку вище (RB_ISO_RISE), камера дивиться трохи вгору (RB_ISO_PITCH_UP°)
window.RB_ISO_RISE = window.RB_ISO_RISE || 0;
window.RB_ISO_SHIFT = window.RB_ISO_SHIFT == null ? .16 : window.RB_ISO_SHIFT; /* зсув кадру: карти нижче, вгорі місце для напису */
window.RB_ISO_PITCH_UP = window.RB_ISO_PITCH_UP || 0;
window.RB_ISO_RAILS = !!window.RB_ISO_RAILS;
window.RB_ISO_GROUND = window.RB_ISO_GROUND || .42;
// зигзаг: бік чергується строго ліво/право, крок між картами завжди однаковий
function rbIsoSide(n) {
  return window.RB_ISO_SIDE * (Math.round(n) % 2 ? -1 : 1);
}
function rbIsoSideAt(v) {
  const a = Math.floor(v),
    b = a + 1,
    t = v - a;
  return rbIsoSide(a) * (1 - t) + rbIsoSide(b) * t;
}
function rbIsoPoint(n) {
  const style = window.cmMapStyle || 'classic';
  const side = style === 'orbit' ? 1.72 * Math.sin((n - 1) * Math.PI / 3) : style === 'dot-islands' ? rbIsoSide(n) : ['islands', 'obsidian', 'strata', 'ribbon', 'dot-islands'].includes(style) ? [-2.15, -.7, 1.6, 2.15, .7, -1.6][(n - 1) % 6] : style === 'pulse' ? [-1.45, 1.45][(n - 1) % 2] : [-2.55, 0, 2.55, 0][(n - 1) % 4],
    depth = (n - 1) * window.RB_ISO_STEP,
    s = Math.SQRT1_2;
  return {
    x: (side - depth) * s,
    z: (-side - depth) * s
  };
}
const RB_MAP_LOOKS = {
  classic: {
    name: 'CLASSIC',
    road: .19,
    card: 1,
    grid: .095,
    node: 'round',
    ink: '#ef3543',
    light: 1.08
  },
  monolith: {
    name: 'MONOLITH',
    road: .50,
    card: 1.15,
    grid: 0,
    node: 'slab',
    ink: '#fa525f',
    light: 1.17
  },
  orbit: {
    name: 'ORBIT',
    road: .10,
    card: 1.09,
    grid: 0,
    node: 'orbit',
    ink: '#bcd9ef',
    light: 1.12
  },
  islands: {
    name: 'ISLANDS',
    road: .16,
    card: 1.08,
    grid: 0,
    node: 'island',
    ink: '#dabb77',
    light: 1.20
  },
  pulse: {
    name: 'REDLINE',
    road: .27,
    card: 1.14,
    grid: .035,
    node: 'pulse',
    ink: '#ff334e',
    light: 1.12
  },
  obsidian: {
    name: 'OBSIDIAN',
    road: .13,
    card: 1.08,
    grid: 0,
    node: 'obsidian',
    ink: '#e2bb7d',
    light: 1.20,
    ground: .35
  },
  strata: {
    name: 'STRATA',
    road: .13,
    card: 1.08,
    grid: 0,
    node: 'strata',
    ink: '#e2bb7d',
    light: 1.20,
    ground: .34
  },
  ribbon: {
    name: 'RIBBON',
    road: .13,
    card: 1.08,
    grid: 0,
    node: 'ribbon',
    ink: '#e2bb7d',
    light: 1.20,
    ground: .34
  },
  'dot-islands': {
    name: 'DOT ISLANDS',
    road: .13,
    card: 1.08,
    grid: 0,
    node: 'dot-islands',
    ink: '#e2bb7d',
    light: 1.20,
    ground: .33
  }
};
window.cmMapStyle = new URLSearchParams(window.location.search).get('mapStyle') || 'dot-islands';
// Підпис карти як спрайт у сцені (пілюля: замок · номінал+масть · ★ для легенди)
function rbIsoLabelSprite(T, n, level) {
  // підпис карти — акуратна скляна пігулка: номінал+масть у кольорі масті, замок для закритих, зірка для легендарних
  const L = window.cmLeague,
    lg = L.forLevel(n),
    owned = n <= level,
    leg = !!window.cmLegends[n],
    cur = n === level,
    suitColor = lg.color || '#fff';
  const c = document.createElement('canvas');
  c.width = 384;
  c.height = 112;
  const g = c.getContext('2d');
  const rank = L.rankForLevel(n),
    suit = lg.suit;
  g.font = '700 46px "Chakra Petch", system-ui, sans-serif';
  const rw = g.measureText(rank).width;
  g.font = '600 40px system-ui, sans-serif';
  const sw = g.measureText(suit).width;
  const lock = owned ? 0 : 40,
    star = leg ? 38 : 0,
    pad = 30,
    gap = 6,
    w = Math.min(380, lock + rw + gap + sw + star + pad * 2),
    x0 = (384 - w) / 2,
    y0 = 14,
    h = 84;
  const rr = (x, y, w, h, r) => {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  };
  // тінь під пігулкою
  g.save();
  g.shadowColor = 'rgba(0,0,0,.55)';
  g.shadowBlur = 18;
  g.shadowOffsetY = 6;
  rr(x0, y0, w, h, h / 2);
  g.fillStyle = 'rgba(14,17,22,.86)';
  g.fill();
  g.restore();
  // скло: легкий верхній відблиск + тонка рамка
  const grad = g.createLinearGradient(0, y0, 0, y0 + h);
  grad.addColorStop(0, 'rgba(255,255,255,.10)');
  grad.addColorStop(.5, 'rgba(255,255,255,.02)');
  grad.addColorStop(1, 'rgba(0,0,0,.12)');
  rr(x0, y0, w, h, h / 2);
  g.fillStyle = grad;
  g.fill();
  rr(x0 + 1, y0 + 1, w - 2, h - 2, (h - 2) / 2);
  g.strokeStyle = cur ? 'rgba(255,255,255,.55)' : owned ? suitColor + '99' : 'rgba(255,255,255,.18)';
  g.lineWidth = 2;
  g.stroke();
  let x = x0 + pad;
  const cy = y0 + h / 2;
  if (!owned) {
    g.strokeStyle = '#8d97a4';
    g.lineWidth = 4;
    g.lineCap = 'round';
    g.beginPath();
    g.arc(x + 13, cy - 8, 8, Math.PI, 0);
    g.stroke();
    g.fillStyle = '#8d97a4';
    rr(x + 1, cy - 8, 24, 20, 5);
    g.fill();
    x += lock;
  }
  g.textBaseline = 'middle';
  g.fillStyle = owned ? '#fff' : '#a9b2bd';
  g.font = '700 46px "Chakra Petch", system-ui, sans-serif';
  g.fillText(rank, x, cy + 2);
  x += rw + gap;
  g.fillStyle = owned ? suitColor : '#8d97a4';
  g.font = '600 40px system-ui, sans-serif';
  g.fillText(suit, x, cy + 1);
  x += sw + 6;
  if (leg) {
    g.fillStyle = '#e9c77e';
    g.font = '700 34px system-ui, sans-serif';
    g.fillText('★', x, cy + 1);
  }
  const tex = new T.CanvasTexture(c);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 4;
  const sp = new T.Sprite(new T.SpriteMaterial({
    map: tex,
    transparent: true,
    depthTest: true,
    depthWrite: false
  }));
  sp.scale.set(.96, .28, 1);
  sp.userData.base = {
    w: .96,
    h: .28
  };
  return sp;
}
function rbIsoSpring(m, dt, reduced = false) {
  const target = m.target + m.drag;
  if (reduced) {
    m.value = target;
    m.velocity = 0;
    return;
  }
  const displacement = m.value - target,
    decay = Math.exp(-10 * dt),
    j = m.velocity + 10 * displacement;
  m.value = target + (displacement + j * dt) * decay;
  m.velocity = (m.velocity - 10 * j * dt) * decay;
  if (Math.abs(m.value - target) < .0001 && Math.abs(m.velocity) < .001) {
    m.value = target;
    m.velocity = 0;
  }
}
function RbIsoMap3D({
  level,
  xp,
  xpNext,
  motion,
  labelsRef,
  active = true,
  valueText = null,
  entrance = null,
  onSceneReady = null
}) {
  const ref = React.useRef(null),
    state = React.useRef(null),
    [failed, setFailed] = React.useState(false);
  const readySent = React.useRef(false),
    readyCallback = React.useRef(onSceneReady);
  readyCallback.current = onSceneReady;
  const look = RB_MAP_LOOKS[window.cmMapStyle] || RB_MAP_LOOKS.classic;
  React.useEffect(() => {
    if (!CH.ok() || !ref.current) return;
    let r, scene, observer;
    try {
      const T = window.THREE,
        host = ref.current.parentElement,
        w = host.clientWidth,
        h = host.clientHeight,
        TOTAL = window.cmLeague.TOTAL || 65;
      r = CH.renderer(ref.current, w, h, look.light);
      scene = new T.Scene();
      const Z = window.RB_ISO_ZOOM,
        camera = window.RB_ISO_BARE ? new T.PerspectiveCamera(window.RB_ISO_FOV, w / h, .1, 200) : new T.OrthographicCamera(-Z * w / h, Z * w / h, Z, -Z, .1, 160),
        env = CH.envFor(r),
        roads = [];
      // світ нахилений: шлях піднімається вгору під ухилом (обертання навколо бічної осі)
      const world = new T.Group();
      scene.add(world);
      if (window.RB_ISO_FRONT) {
        world.quaternion.setFromAxisAngle(new T.Vector3(1, 0, -1).normalize(), window.RB_ISO_SLOPE * Math.PI / 180);
        world.updateMatrixWorld(true);
        // глянцева підлога з відбиттям карт і туман до горизонту (варіант, який затвердив Вадим)
        const floor = new T.Mesh(new T.PlaneGeometry(400, 400), new T.MeshPhysicalMaterial({
          color: 0x0c0f14,
          metalness: .9,
          roughness: .32,
          envMap: env,
          envMapIntensity: .55,
          transparent: true,
          opacity: .62,
          depthWrite: false
        }));
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = 0;
        floor.renderOrder = -1;
        world.add(floor);
        const sheen = new T.Mesh(new T.PlaneGeometry(400, 400), new T.MeshBasicMaterial({
          color: 0x2a3340,
          transparent: true,
          opacity: .18,
          depthWrite: false
        }));
        sheen.rotation.x = -Math.PI / 2;
        sheen.position.y = -.002;
        sheen.renderOrder = -2;
        world.add(sheen);
        scene.fog = new T.Fog(0x101115, 9, 30);
      }
      scene.add(new T.HemisphereLight(0xffffff, 0x64727e, 1.45));
      const light = new T.DirectionalLight(0xf5f3ec, 2.1);
      light.position.set(5, 12, 8);
      scene.add(light);
      const rimLight = new T.DirectionalLight(0xcedeff, .2);
      rimLight.position.set(-6, 8, -2);
      scene.add(rimLight);
      const mat = (color, metal = .5, rough = .4) => new T.MeshStandardMaterial({
        color,
        metalness: metal,
        roughness: rough,
        envMap: env,
        envMapIntensity: .65
      });
      const roadMat = mat(0x71808a, .72),
        doneMat = mat(0x9ba9ae, .7),
        redMat = new T.MeshStandardMaterial({
          color: 0xe12c3c,
          emissive: 0xa51420,
          emissiveIntensity: .6,
          metalness: .45,
          roughness: .35
        });
      const RAIL_Y = window.RB_ISO_BARE ? .30 : .04,
        TAN = window.RB_ISO_BARE ? 4.5 : 6;
      const orbitRail = (n, material, radius, end = 1) => {
        const a = rbIsoPoint(n),
          b = rbIsoPoint(n + 1),
          prev = rbIsoPoint(Math.max(1, n - 1)),
          next = rbIsoPoint(Math.min(TOTAL, n + 2)),
          v = p => new T.Vector3(p.x, RAIL_Y, p.z),
          curve = new T.CubicBezierCurve3(v(a), new T.Vector3(a.x + (b.x - prev.x) / TAN, RAIL_Y, a.z + (b.z - prev.z) / TAN), new T.Vector3(b.x - (next.x - a.x) / TAN, RAIL_Y, b.z - (next.z - a.z) / TAN), v(b));
        const part = end === 1 ? curve : new T.CatmullRomCurve3(Array.from({
            length: 24
          }, (_, i) => curve.getPoint(i / 23 * end))),
          mesh = new T.Mesh(new T.TubeGeometry(part, 48, radius, 12, false), material);
        if (look.node === 'slab') {
          mesh.scale.y = .25;
          mesh.position.y = .05;
        }
        scene.add(mesh);
        roads.push({
          n,
          mesh
        });
      };
      const progress = Math.max(0, Math.min(1, xp / Math.max(1, xpNext))),
        nodes = [];
      if (window.RB_ISO_BARE && !window.RB_ISO_RAILS) {/* без доріжок */} else if (window.RB_ISO_BARE) {
        // v3: S-подібний прогрес-бар між картами — скляна прозора трубка,
        // усередині заповнення кольором наступної карти: пройдені сегменти повні,
        // поточний — на частку XP до наступної карти.
        const glass = new T.MeshPhysicalMaterial({
          color: 0xeef4fb,
          transparent: true,
          opacity: .22,
          roughness: .12,
          metalness: .05,
          clearcoat: 1,
          clearcoatRoughness: .1,
          envMap: env,
          envMapIntensity: .9,
          depthWrite: false
        });
        const fillFor = n => {
          const c = new T.Color(window.cmLeague.forLevel(Math.min(TOTAL, n + 1)).color);
          return new T.MeshPhysicalMaterial({
            color: c,
            emissive: c,
            emissiveIntensity: .55,
            roughness: .25,
            metalness: .4,
            envMap: env,
            envMapIntensity: .8,
            transparent: true,
            opacity: .95
          });
        };
        for (let n = 1; n < TOTAL; n++) {
          orbitRail(n, glass, .125);
          if (n < level) orbitRail(n, fillFor(n), .072);else if (n === level && progress > 0) orbitRail(n, fillFor(n), .072, progress);
        }
      } else for (let n = 1; n < TOTAL; n++) {
        orbitRail(n, roadMat, look.road * .5);
        if (n < level) orbitRail(n, doneMat, look.node === 'slab' ? .16 : .074);
        if (n === level && progress > 0) orbitRail(n, redMat, look.node === 'slab' ? .18 : .095, progress);
      }
      // A quiet floor grid makes the shared ground plane easy to read.
      const grid = new T.GridHelper(280, 140, 0x60717d, 0x60717d);
      grid.material.transparent = true;
      grid.material.opacity = look.grid;
      grid.position.y = -.10;
      scene.add(grid);
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 64;
      shadowCanvas.height = 64;
      const g = shadowCanvas.getContext('2d'),
        gradient = g.createRadialGradient(32, 32, 4, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(0,0,0,.6)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gradient;
      g.fillRect(0, 0, 64, 64);
      const shadowTexture = new T.CanvasTexture(shadowCanvas),
        shadowMat = new T.MeshBasicMaterial({
          map: shadowTexture,
          transparent: true,
          depthWrite: false
        });
      const baseGeo = look.node === 'slab' ? new T.BoxGeometry(1.13, .22, 1.13) : look.node === 'island' ? new T.CylinderGeometry(.69, .45, .40, 6) : new T.CylinderGeometry(.48, .53, .15, 48),
        topGeo = look.node === 'slab' ? new T.BoxGeometry(1.05, .025, 1.05) : new T.CylinderGeometry(look.node === 'island' ? .66 : .43, look.node === 'island' ? .66 : .43, .025, look.node === 'island' ? 6 : 48),
        ringGeo = new T.TorusGeometry(.437, .014, 8, 64);
      const baseMat = mat(0x242c34, .7),
        topMat = mat(0x10181e, .5);
      // Four studies of the same island route. Rounded physical forms are built
      // in the scene, so their light, contact shadows and card angle stay coherent.
      const customIsland = ['obsidian', 'strata', 'ribbon', 'dot-islands'].includes(look.node);
      const pebble = new T.Shape();
      pebble.moveTo(-.77, -.16);
      pebble.bezierCurveTo(-.78, -.50, -.36, -.62, .05, -.53);
      pebble.bezierCurveTo(.40, -.56, .85, -.29, .77, .09);
      pebble.bezierCurveTo(.78, .43, .30, .61, -.04, .51);
      pebble.bezierCurveTo(-.40, .53, -.77, .22, -.77, -.16);
      const roundedCard = new T.Shape(),
        rw = .65,
        rh = .46,
        rr = .10;
      roundedCard.moveTo(-rw + rr, -rh);
      roundedCard.lineTo(rw - rr, -rh);
      roundedCard.quadraticCurveTo(rw, -rh, rw, -rh + rr);
      roundedCard.lineTo(rw, rh - rr);
      roundedCard.quadraticCurveTo(rw, rh, rw - rr, rh);
      roundedCard.lineTo(-rw + rr, rh);
      roundedCard.quadraticCurveTo(-rw, rh, -rw, rh - rr);
      roundedCard.lineTo(-rw, -rh + rr);
      roundedCard.quadraticCurveTo(-rw, -rh, -rw + rr, -rh);
      const flatGeo = (shape, depth, bevel) => {
        const geo = new T.ExtrudeGeometry(shape, {
          depth,
          bevelEnabled: true,
          bevelSegments: 4,
          steps: 1,
          bevelSize: bevel,
          bevelThickness: bevel,
          curveSegments: 24
        });
        geo.rotateX(-Math.PI / 2);
        return geo;
      };
      const pedestalGeos = customIsland ? {
        pebble: flatGeo(pebble, .16, .065),
        card: flatGeo(roundedCard, .055, .025),
        dot: new T.SphereGeometry(1, 32, 20)
      } : null;
      const satin = mat(0x9ba8b3, .92, .26),
        graphite = mat(0x2b333b, .76, .30),
        darkChrome = mat(0x151d25, .90, .22);
      const trace = (shape, y, material) => new T.LineLoop(new T.BufferGeometry().setFromPoints(shape.getPoints(80).map(p => new T.Vector3(p.x, y, -p.y))), material);
      const addIsland = (group, n, edition, accent) => {
        const island = new T.Group();
        island.rotation.y = Math.PI / 4;
        group.add(island);
        const edge = new T.LineBasicMaterial({
          color: edition?.rarity === 'legendary' ? 0xe5c17f : 0xa7b6c5,
          transparent: true,
          opacity: .75
        });
        if (look.node === 'obsidian') {
          const rock = new T.Mesh(pedestalGeos.pebble, darkChrome);
          rock.position.y = .015;
          island.add(rock);
          const edgeLine = trace(pebble, .24, edge);
          edgeLine.scale.set(.98, 1, .98);
          island.add(edgeLine);
          const foot = new T.Mesh(pedestalGeos.pebble, graphite);
          foot.scale.set(.88, .30, .88);
          foot.position.y = -.10;
          island.add(foot);
          const inlay = new T.Mesh(new T.SphereGeometry(.032, 12, 8), accent);
          inlay.position.set(.45, .244, .25);
          island.add(inlay);
        } else if (look.node === 'strata') {
          for (let k = 0; k < 3; k++) {
            const sheet = new T.Group();
            sheet.rotation.y = (k - 1) * .14;
            sheet.position.set((k - 1) * .055, -.095 + k * .13, 0);
            island.add(sheet);
            sheet.add(new T.Mesh(pedestalGeos.card, k === 2 ? graphite : satin));
            sheet.add(trace(roundedCard, .084, k === 2 ? edge : new T.LineBasicMaterial({
              color: 0xc1cbd3,
              transparent: true,
              opacity: .4
            })));
          }
          const seal = new T.Mesh(new T.SphereGeometry(.034, 12, 8), accent);
          seal.position.set(.45, .27, .27);
          island.add(seal);
        } else if (look.node === 'ribbon') {
          // A continuous folded metal sheet, with rounded cross-section and an
          // open silhouette. The two bright edges explain its real thickness.
          const cross = new T.Shape();
          cross.moveTo(-.87, .31);
          cross.bezierCurveTo(-.71, .31, -.71, .05, -.48, .025);
          cross.bezierCurveTo(-.17, -.045, .29, -.045, .52, .06);
          cross.bezierCurveTo(.70, .14, .69, .32, .86, .36);
          cross.lineTo(.86, .30);
          cross.bezierCurveTo(.74, .25, .75, .08, .55, .00);
          cross.bezierCurveTo(.22, -.105, -.17, -.105, -.50, -.035);
          cross.bezierCurveTo(-.77, -.005, -.77, .24, -.87, .25);
          cross.closePath();
          const geo = new T.ExtrudeGeometry(cross, {
            depth: .88,
            bevelEnabled: true,
            bevelSize: .025,
            bevelThickness: .025,
            bevelSegments: 3,
            steps: 1,
            curveSegments: 24
          });
          geo.translate(0, .08, -.44);
          island.add(new T.Mesh(geo, satin));
          const seam = new T.CubicBezierCurve3(new T.Vector3(-.82, .39, .477), new T.Vector3(-.6, -.04, .477), new T.Vector3(.65, -.04, .477), new T.Vector3(.82, .43, .477));
          island.add(new T.Mesh(new T.TubeGeometry(seam, 40, .012, 6, false), accent));
        } else {
          for (let k = 0; k < 4; k++) {
            const pod = new T.Mesh(pedestalGeos.dot, satin);
            pod.scale.set(.37, .13, .31);
            pod.position.set(k % 2 === 0 ? -.38 : .38, .05, k < 2 ? -.32 : .32);
            island.add(pod);
            const underside = new T.Mesh(pedestalGeos.dot, darkChrome);
            underside.scale.set(.29, .045, .24);
            underside.position.copy(pod.position);
            underside.position.y = -.10;
            island.add(underside);
          }
        }
      };
      for (let n = 1; n <= TOTAL; n++) {
        const p = rbIsoPoint(n),
          edition = window.cmCollectibles[n],
          group = new T.Group();
        group.position.set(p.x, 0, p.z);
        world.add(group);
        const shadow = new T.Mesh(new T.PlaneGeometry(1.8, 1.8), shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = window.RB_ISO_FRONT ? .004 : -.084;
        group.add(shadow);
        const base = new T.Mesh(baseGeo, baseMat);
        group.add(base);
        const cap = new T.Mesh(topGeo, topMat);
        cap.position.y = look.node === 'island' ? .212 : look.node === 'slab' ? .126 : .088;
        group.add(cap);
        if (look.node === 'slab') {
          const rim = new T.LineSegments(new T.EdgesGeometry(topGeo), new T.LineBasicMaterial({
            color: n === level ? 0xed3a47 : edition?.rarity === 'legendary' ? 0xe5c581 : 0x8d9fae,
            transparent: true,
            opacity: .8
          }));
          rim.position.copy(cap.position);
          group.add(rim);
          base.rotation.y = cap.rotation.y = rim.rotation.y = Math.PI / 4;
        }
        const color = n === level ? look.ink : edition?.rarity === 'legendary' ? '#dabb77' : edition?.edition.ink || '#7b8897';
        const ringMat = new T.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: n === level ? .8 : edition?.rarity === 'legendary' ? .22 : .07,
          metalness: .65,
          roughness: .28
        });
        const ring = new T.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = .11;
        group.add(ring);
        if (look.node === 'slab' || customIsland) ring.visible = false;
        if (customIsland) {
          base.visible = false;
          cap.visible = false;
          if (!window.RB_ISO_BARE) addIsland(group, n, edition, ringMat);
        }
        if (window.RB_ISO_BARE) {
          base.visible = false;
          cap.visible = false;
          ring.visible = false;
          shadow.scale.setScalar(1.35);
        }
        if (edition?.rarity === 'legendary' && !customIsland) {
          const extra = new T.Mesh(new T.TorusGeometry(.49, .008, 6, 64), ringMat);
          extra.rotation.x = -Math.PI / 2;
          extra.position.y = .06;
          group.add(extra);
        }
        if (look.node === 'island') {
          const rim = new T.LineSegments(new T.EdgesGeometry(topGeo), new T.LineBasicMaterial({
            color: edition?.rarity === 'legendary' ? 0xe7c780 : 0x81919e,
            transparent: true,
            opacity: .8
          }));
          rim.position.copy(cap.position);
          group.add(rim);
          const lower = new T.Mesh(new T.CylinderGeometry(.78, .69, .06, 6), baseMat);
          lower.position.y = -.19;
          group.add(lower);
          if (n % 2 === 0) {
            const shard = new T.Mesh(new T.OctahedronGeometry(.18, 0), mat(edition?.rarity === 'legendary' ? 0xceac68 : 0x556373, .8));
            shard.position.set(-.88, -.22, .25);
            shard.rotation.set(.3, .6, .3);
            group.add(shard);
          }
        }
        if (look.node === 'orbit') {
          for (let k = 0; k < 3; k++) {
            const orbit = new T.Mesh(new T.TorusGeometry(.63 + k * .105, .006, 6, 80), ringMat);
            orbit.rotation.x = -Math.PI / 2;
            orbit.position.y = .01 - k * .045;
            group.add(orbit);
          }
          const satellite = new T.Mesh(new T.SphereGeometry(.045, 12, 8), ringMat);
          satellite.position.set(.77, .055, 0);
          group.add(satellite);
        }
        if (look.node === 'pulse') {
          for (let k = 0; k < 3; k++) {
            const contour = new T.Mesh(new T.TorusGeometry(.62 + k * .13, .006, 6, 64), new T.MeshBasicMaterial({
              color: n === level ? 0xf54b60 : 0x704454,
              transparent: true,
              opacity: .42 - k * .10
            }));
            contour.rotation.x = -Math.PI / 2;
            contour.position.y = -.035 - k * .003;
            group.add(contour);
          }
        }
        // Wider pieces between levels make each direction a distinct landscape.
        if (look.node === 'slab' && n % 4 === 0) {
          const tile = new T.Mesh(new T.BoxGeometry(3.2, .10, 1.35), mat(0x19232c, .6));
          tile.position.set(.1, -.19, -.05);
          tile.rotation.y = -Math.PI / 4;
          group.add(tile);
          const cut = new T.LineSegments(new T.EdgesGeometry(tile.geometry), new T.LineBasicMaterial({
            color: 0x5a6c7b,
            transparent: true,
            opacity: .30
          }));
          cut.position.copy(tile.position);
          cut.rotation.copy(tile.rotation);
          group.add(cut);
        }
        if (look.node === 'orbit' && n % 4 === 0) {
          const arc = new T.Mesh(new T.TorusGeometry(1.30, .010, 6, 100, Math.PI * 1.35), mat(0x546e83, .8));
          arc.rotation.x = -Math.PI / 2;
          arc.position.y = -.12;
          group.add(arc);
        }
        if (look.node === 'pulse' && n === level) {
          const glowCanvas = document.createElement('canvas');
          glowCanvas.width = 128;
          glowCanvas.height = 128;
          const c = glowCanvas.getContext('2d'),
            rg = c.createRadialGradient(64, 64, 0, 64, 64, 64);
          rg.addColorStop(0, 'rgba(246,33,68,.38)');
          rg.addColorStop(.45, 'rgba(199,15,52,.16)');
          rg.addColorStop(1, 'rgba(199,15,52,0)');
          c.fillStyle = rg;
          c.fillRect(0, 0, 128, 128);
          const texture = new T.CanvasTexture(glowCanvas),
            glow = new T.Mesh(new T.PlaneGeometry(4.6, 4.6), new T.MeshBasicMaterial({
              map: texture,
              transparent: true,
              depthWrite: false
            }));
          glow.rotation.x = -Math.PI / 2;
          glow.position.y = -.07;
          group.add(glow);
        }
        nodes.push({
          n,
          p,
          group,
          ring,
          ringMat,
          card: null,
          scale: n === motion.current.focus ? 1.85 : 1.0,
          edition
        });
      }
      const resize = () => {
        const w = host.clientWidth,
          h = host.clientHeight;
        r.setSize(w, h, false);
        if (camera.isOrthographicCamera) {
          camera.left = -Z * w / h;
          camera.right = Z * w / h;
        } else {
          camera.aspect = w / h;
          if (window.RB_ISO_FRONT && window.RB_ISO_SHIFT) camera.setViewOffset(w, h, 0, -h * window.RB_ISO_SHIFT, w, h);
        }
        camera.updateProjectionMatrix();
        if (state.current) state.current.idle = 0;
      };
      observer = new ResizeObserver(resize);
      observer.observe(host);
      const legendLight = new T.PointLight(0xffdda1, 0, 16, 2);
      scene.add(legendLight);
      // v3: підсвітка-«дихання» за вибраною картою і підказка «натисніть» — показують, що карта натискається
      let glow = null,
        tapHint = null,
        valueSprite = null;
      if (window.RB_ISO_FRONT) {
        const gc = document.createElement('canvas');
        gc.width = gc.height = 256;
        const gg = gc.getContext('2d'),
          grd = gg.createRadialGradient(128, 128, 10, 128, 128, 128);
        grd.addColorStop(0, 'rgba(255,255,255,.55)');
        grd.addColorStop(.45, 'rgba(255,255,255,.16)');
        grd.addColorStop(1, 'rgba(255,255,255,0)');
        gg.fillStyle = grd;
        gg.fillRect(0, 0, 256, 256);
        const gt = new T.CanvasTexture(gc);
        glow = new T.Sprite(new T.SpriteMaterial({
          map: gt,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          opacity: .4,
          color: 0xffffff
        }));
        glow.scale.set(3.6, 4.4, 1);
        glow.renderOrder = -0.5;
        world.add(glow);
        const hintTex = (text, color) => {
          const hc = document.createElement('canvas');
          hc.width = 600;
          hc.height = 72;
          const hg = hc.getContext('2d');
          hg.font = '700 26px "Chakra Petch", system-ui, sans-serif';
          hg.textAlign = 'center';
          hg.textBaseline = 'middle';
          hg.fillStyle = color;
          hg.fillText(text, 300, 36);
          const ht = new T.CanvasTexture(hc);
          ht.colorSpace = T.SRGBColorSpace;
          return ht;
        };
        tapHint = new T.Sprite(new T.SpriteMaterial({
          map: hintTex('НАЖМИТЕ · ИСТОРИЯ КАРТЫ', 'rgba(233,199,126,.95)'),
          transparent: true,
          depthWrite: false,
          depthTest: false,
          opacity: .8
        }));
        tapHint.scale.set(2.0, .24, 1);
        world.add(tapHint);
        tapHint.userData.legend = tapHint.material.map;
        tapHint.userData.claim = hintTex('НАЖМИТЕ, ЧТОБЫ РАЗБЛОКИРОВАТЬ', 'rgba(159,240,182,.95)');
        // плаваючий напис «що дає карта» над вибраною картою
        valueSprite = new T.Sprite(new T.SpriteMaterial({
          transparent: true,
          depthWrite: false,
          depthTest: false,
          opacity: 1
        }));
        valueSprite.scale.set(2.25, .82, 1);
        valueSprite.visible = false;
        world.add(valueSprite);
      }
      state.current = {
        r,
        scene,
        camera,
        env,
        nodes,
        roads,
        grid,
        light,
        rimLight,
        legendLight,
        glow,
        tapHint,
        valueSprite,
        legendBlend: 0,
        w,
        h,
        shadowTexture,
        world,
        point: new T.Vector3(),
        target: new T.Vector3(),
        offset: new T.Vector3(18, 18, 18)
      };
      window.__rbIso = state.current;
      CH_SIGNATURE_READY.then(() => {
        if (state.current) state.current.idle = 0;
      });
    } catch (error) {
      if (r && scene) CH.release(scene, r);
      setFailed(true);
    }
    return () => {
      observer?.disconnect();
      const d = state.current;
      if (d) {
        CH.release(d.scene, d.r);
        d.shadowTexture.dispose();
        if (d.glow) {
          d.glow.material.map.dispose();
          d.glow.material.dispose();
        }
        if (d.tapHint) {
          d.tapHint.material.map.dispose();
          d.tapHint.material.dispose();
        }
      }
      state.current = null;
    };
  }, [level, xp, xpNext]);
  React.useEffect(() => {
    const d = state.current;
    if (!d || !d.valueSprite || !valueText) return;
    const T = window.THREE;
    const c = document.createElement('canvas');
    c.width = 768;
    c.height = 280;
    const g = c.getContext('2d');
    // м'яка темна підкладка без рамки — щоб напис читався поверх карт позаду
    const bg = g.createRadialGradient(384, 140, 40, 384, 140, 330);
    bg.addColorStop(0, 'rgba(14,16,20,.82)');
    bg.addColorStop(.6, 'rgba(14,16,20,.55)');
    bg.addColorStop(1, 'rgba(14,16,20,0)');
    g.fillStyle = bg;
    g.fillRect(0, 0, 768, 280);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = '700 24px "Chakra Petch", system-ui, sans-serif';
    g.fillStyle = 'rgba(190,198,208,.95)';
    g.fillText(valueText.title.split('').join(String.fromCharCode(8202)), 384, 44);
    g.font = '700 96px "Chakra Petch", system-ui, sans-serif';
    g.fillStyle = valueText.gold ? '#ffe9a8' : '#ffe9a8';
    g.shadowColor = 'rgba(233,199,126,.55)';
    g.shadowBlur = 28;
    g.fillText(valueText.big, 384, 132);
    g.shadowBlur = 0;
    g.font = '600 28px "Chakra Petch", system-ui, sans-serif';
    g.fillStyle = 'rgba(225,230,236,.95)';
    g.fillText(valueText.unit, 384, 200);
    g.font = '500 26px "Chakra Petch", system-ui, sans-serif';
    g.fillStyle = valueText.gold ? 'rgba(233,199,126,.95)' : 'rgba(170,178,188,.95)';
    g.fillText(valueText.sub, 384, 248);
    const tex = new T.CanvasTexture(c);
    tex.colorSpace = T.SRGBColorSpace;
    if (d.valueSprite.material.map) d.valueSprite.material.map.dispose();
    d.valueSprite.material.map = tex;
    d.valueSprite.material.needsUpdate = true;
    d.valueSprite.visible = false;
  }, [valueText && JSON.stringify(valueText), level]);
  chUseLoop(ref, dt => {
    const d = state.current;
    if (!d) return;
    const T = window.THREE,
      m = motion.current,
      reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Entrance uses wall time so overlays/backgrounding cannot replay or prolong it.
    const intro = entrance?.current,
      now = performance.now();
    if (intro && intro.start == null) intro.start = now;
    const age = !intro || intro.cancelled || reduced ? 2 : (now - intro.start) / 1000;
    const arrive = x => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);
    const approach = 1 - arrive(age / 1.08);
    const before = m.value;
    rbIsoSpring(m, dt, reduced);
    const moving = Math.abs(before - m.value) > .00001 || Math.abs(m.velocity) > .001 || d.lastFocus !== m.focus;
    d.lastFocus = m.focus;
    d.idle = moving ? 0 : (d.idle || 0) + dt;
    if (d.idle > 1 && !window.RB_ISO_FRONT) return;
    const TOTAL = window.cmLeague.TOTAL || 65,
      AHEAD = window.RB_ISO_AHEAD,
      view = Math.max(1, Math.min(TOTAL, m.value)),
      sq = Math.SQRT1_2;
    if (d.camera.isPerspectiveCamera) {
      // від першої особи: камера за вибраною картою (по її боку зигзагу), дивиться вперед уздовж шляху
      const sideV = rbIsoSideAt(view),
        depthV = (view - 1) * window.RB_ISO_STEP,
        px = (sideV - depthV) * sq,
        pz = (-sideV - depthV) * sq;
      // нахил камери = RB_ISO_TILT від вертикалі (70° → дивиться на 20° вниз); висота така,
      // щоб вибрана карта стояла внизу кадру під кутом RB_ISO_LOOK.down
      if (window.RB_ISO_FRONT) {
        // прямий ракурс: камера на висоті центру карти, дивиться вперед уздовж шляху; ухил дає група world
        // око рівно на висоті центру вибраної карти У СВІТІ: камера стоїть нижче по схилу, тому в локальних координатах піднята на R·tg(ухил)
        const R = window.RB_ISO_R + 2.4 * approach,
          yc = window.RB_ISO_GROUND + .66 * 1.7 + window.RB_ISO_EYE + R * Math.tan(window.RB_ISO_SLOPE * Math.PI / 180) + (view - 1) * window.RB_ISO_RISE,
          up = Math.tan(window.RB_ISO_PITCH_UP * Math.PI / 180) * 6;
        // камера стоїть на схилі (за картою), але дивиться горизонтально у світі — тому шлях попереду видно вище
        const camL = new T.Vector3(px + R * sq, yc, pz + R * sq);
        d.world.localToWorld(camL);
        d.camera.position.copy(camL);
        d.target.set(camL.x - 6 * sq, camL.y + up, camL.z - 6 * sq);
        d.camera.lookAt(d.target);
        d.camera.updateMatrixWorld();
      } else {
        // камера на відстані R від вибраної карти під кутом (нахил + downOff) — карта внизу кадру
        const R = window.RB_ISO_R,
          pitch = window.RB_ISO_TILT * Math.PI / 180,
          L = window.RB_ISO_LOOK,
          a = Math.min(89, window.RB_ISO_TILT + L.downOff) * Math.PI / 180,
          DIST = R * Math.cos(a),
          H = L.cardY + R * Math.sin(a);
        d.camera.position.set(px + DIST * sq, H, pz + DIST * sq);
        d.target.set(d.camera.position.x - sq * Math.cos(pitch) * 10, H - Math.sin(pitch) * 10, d.camera.position.z - sq * Math.cos(pitch) * 10);
        d.camera.lookAt(d.target);
        d.camera.updateMatrixWorld();
      }
    } else {
      const anchor = view + window.RB_ISO_DOWN,
        depth = (anchor - 1) * window.RB_ISO_STEP,
        sideV = 0;
      d.target.set((sideV - depth) * sq, .2, (-sideV - depth) * sq);
      d.camera.position.copy(d.target).add(d.offset);
      d.camera.lookAt(d.target);
      d.camera.updateMatrixWorld();
    }
    d.grid.position.set(Math.round(d.target.x / 2) * 2, -.10, Math.round(d.target.z / 2) * 2);
    // Keep the light fixed relative to the camera, so moving through the map
    // does not make foil flicker or change the apparent colour of a suit.
    d.light.position.copy(d.target).add(new T.Vector3(5, 12, 8));
    d.light.target.position.copy(d.target);
    d.light.target.updateMatrixWorld();
    d.rimLight.position.copy(d.target).add(new T.Vector3(-6, 8, -2));
    d.rimLight.target.position.copy(d.target);
    d.rimLight.target.updateMatrixWorld();
    if (!ref.current) {
      return;
    }
    const host = ref.current.parentElement,
      w = host.clientWidth,
      h = host.clientHeight;
    const legend = window.cmLegends[m.focus],
      focusedPoint = rbIsoPoint(m.focus);
    d.legendBlend = reduced ? legend ? 1 : 0 : d.legendBlend + ((legend ? 1 : 0) - d.legendBlend) * (1 - Math.exp(-dt * 6));
    d.legendLight.intensity = d.legendBlend * 1.0;
    d.legendLight.position.set(focusedPoint.x - 2, 3, focusedPoint.z + 2);
    const AH = d.camera.isPerspectiveCamera ? 4 : AHEAD;
    for (const road of d.roads) road.mesh.visible = road.n >= Math.floor(view) - 1 && road.n < view + AH;
    for (const node of d.nodes) {
      const focused = node.n === m.focus,
        visible = node.n >= Math.floor(view) - 1 && node.n <= Math.ceil(view) + AH;
      const arrival = arrive((age - Math.max(0, node.n - level) * .065) / .82);
      node.group.visible = visible;
      if (visible && !node.card) {
        const lg = window.cmLeague.forLevel(node.n);
        node.card = CH.makeCard({
          rank: window.cmLeague.rankForLevel(node.n),
          lg,
          w: .94,
          h: 1.32,
          d: .034,
          env: d.env,
          sealed: node.n > level,
          legend: node.edition
        });
        if (d.camera.isPerspectiveCamera) {
          node.card.rotation.order = 'YXZ';
          const tiltX = window.RB_ISO_FRONT ? window.RB_ISO_SLOPE * Math.PI / 180 : window.RB_ISO_TILT * Math.PI / 180 * window.RB_ISO_CARD_TILT;
          node.card.rotation.set((node.n > level ? 1 : -1) * tiltX, Math.PI / 4 + (node.n > level ? Math.PI : 0), 0);
        } else node.card.rotation.set(-.10, Math.PI / 4 - .16 + (node.n > level ? Math.PI : 0), 0);
        node.card.userData.mats[1].roughness = .38;
        node.card.userData.mats[2].iridescence = 0;
        // закриті карти попереду — затемнені
        if (node.n > level && window.RB_ISO_BARE) {
          const k = node.edition?.rarity === 'legendary' ? .55 : .3;
          node.card.userData.mats.forEach(mt => {
            mt.color.multiplyScalar(k);
            if (mt.envMapIntensity != null) mt.envMapIntensity *= k * .85;
          });
        }
        node.group.add(node.card);
        if (window.RB_ISO_FRONT) {
          // відбиття в підлозі: дзеркальна копія під площиною y=0
          const mirror = node.card.clone(true);
          mirror.traverse(o => {
            if (o.isMesh) {
              o.material = o.material.clone();
              o.material.transparent = true;
              o.material.opacity = .32;
              o.material.depthWrite = false;
            }
          });
          node.group.add(mirror);
          node.mirror = mirror;
          // підпис карти — у сцені, під картою: перекривається картами попереду так само, як сама карта
          if (node.edition?.rarity === 'legendary') {
            const halo = new T.Sprite(new T.SpriteMaterial({
              map: d.glow.material.map,
              transparent: true,
              depthWrite: false,
              depthTest: false,
              opacity: node.n <= level ? .42 : .4,
              color: 0xe9c77e
            }));
            halo.scale.set(2.9, 3.6, 1);
            halo.position.set(-.3 * Math.SQRT1_2, 0, -.3 * Math.SQRT1_2);
            node.group.add(halo);
            node.halo = halo;
          }
          node.label = rbIsoLabelSprite(T, node.n, level);
          node.label.visible = false;
          d.scene.add(node.label);
        }
      }
      if (!visible && node.card) {
        node.group.remove(node.card);
        const shared = new Set([...CH.geometries.values()].flatMap(g => [g.body, g.plane]));
        node.card.traverse(o => {
          if (o.geometry && !shared.has(o.geometry)) o.geometry.dispose();
          if (o.material) o.material.dispose();
        });
        node.card = null;
        if (node.mirror) {
          node.group.remove(node.mirror);
          node.mirror.traverse(o => {
            if (o.material) o.material.dispose();
          });
          node.mirror = null;
        }
        if (node.label) {
          d.scene.remove(node.label);
          node.label.material.map.dispose();
          node.label.material.dispose();
          node.label = null;
        }
        if (node.halo) {
          node.group.remove(node.halo);
          node.halo.material.dispose();
          node.halo = null;
        }
      }
      const desired = focused ? d.camera.isPerspectiveCamera ? 1.7 : 1.85 : (node.n < level ? .92 : 1.0) * look.card;
      node.scale = reduced ? desired : node.scale + (desired - node.scale) * (1 - Math.exp(-dt * 10));
      if (node.card) {
        const gy = window.RB_ISO_FRONT ? window.RB_ISO_GROUND + (node.n - 1) * window.RB_ISO_RISE : look.ground || (look.node === 'island' ? .29 : .16);
        const entryScale = node.scale * (.9 + .1 * arrival),
          lift = (1 - arrival) * .52;
        node.card.scale.setScalar(entryScale);
        node.card.position.set(0, gy + .66 * entryScale - lift, 0);
        if (window.RB_ISO_FRONT) node.card.rotation.z = -.065 * (1 - arrival);
        if (node.mirror) {
          node.mirror.position.set(0, -node.card.position.y, 0);
          node.mirror.scale.set(entryScale, -entryScale, entryScale);
          node.mirror.rotation.copy(node.card.rotation);
        }
        if (node.halo) {
          node.halo.position.y = gy + .66 * node.scale;
          node.halo.scale.set(2.9 * node.scale / 1.7, 3.6 * node.scale / 1.7, 1);
        }
        // підпис — одразу під нижнім краєм карти, трохи ближче до камери; масштаб іде за картою
        if (node.label) {
          const k = Math.max(.8, node.scale),
            b = node.label.userData.base;
          node.label.visible = !focused && node.n > level && arrival > .82; /* підпис лише у закритих: у відкритих номінал видно на самій карті */
          // світові координати: під нижнім краєм карти (карти стоять вертикально у світі), трохи до камери
          const wp = node.card.getWorldPosition(new T.Vector3()),
            toCam = d.camera.position.clone().sub(wp);
          toCam.y = 0;
          toCam.normalize();
          node.label.position.copy(wp).add(new T.Vector3(0, -(.703 * node.scale + .12 * k), 0)).addScaledVector(toCam, .22);
          node.label.scale.set(b.w * k * .8, b.h * k * .8, 1);
        }
      }
      if (node.halo && !focused) node.halo.visible = true;
      if (focused && node.card && window.RB_ISO_FRONT) {
        // вибрана карта повільно парить (кілька пікселів угору-вниз)
        const bob = reduced ? 0 : Math.sin(performance.now() / 1000 * 1.3) * .055;
        node.card.position.y += bob;
        if (node.mirror) node.mirror.position.y -= bob;
        const isLegendAny = node.edition?.rarity === 'legendary',
          isLegend = isLegendAny && node.n <= level,
          isReady = node.n === level + 1 && xp >= xpNext;
        if (d.glow) {
          d.glow.visible = isLegendAny || isReady;
          d.glow.material.color.set(isLegendAny ? 0xe9c77e : 0x9ff0b6);
          d.glow.material.opacity = reduced ? .36 : .3 + Math.sin(performance.now() / 1000 * 1.3) * .14;
          d.glow.position.copy(node.group.position);
          d.glow.position.y = node.card.position.y;
          d.glow.position.x -= .35 * Math.SQRT1_2;
          d.glow.position.z -= .35 * Math.SQRT1_2;
        }
        if (node.halo) node.halo.visible = false;
        if (d.valueSprite) {
          d.valueSprite.position.copy(node.group.position);
          d.valueSprite.position.y = node.card.position.y + .66 * node.scale + .5;
          d.valueSprite.position.x += .4 * Math.SQRT1_2;
          d.valueSprite.position.z += .4 * Math.SQRT1_2;
        }
        if (d.tapHint) {
          d.tapHint.visible = (isLegend || isReady) && age > .72;
          d.tapHint.material.map = isLegend ? d.tapHint.userData.legend : d.tapHint.userData.claim;
          d.tapHint.position.copy(node.group.position);
          d.tapHint.position.y = node.card.position.y - .66 * node.scale - .14;
          d.tapHint.position.x += .6 * Math.SQRT1_2;
          d.tapHint.position.z += .6 * Math.SQRT1_2;
          d.tapHint.material.opacity = reduced ? .8 : .55 + Math.sin(performance.now() / 1000 * 2.2) * .3;
        }
      }
      node.ring.visible = focused && !window.RB_ISO_BARE;
      node.ring.scale.setScalar(look.node === 'dot-islands' ? 1.85 : 1.2);
      node.ringMat.emissiveIntensity = node.n === level ? .8 : focused ? .4 : node.edition?.rarity === 'legendary' ? .22 : .07;
      const el = labelsRef.current[node.n];
      if (el) {
        d.point.set(node.p.x, 0, node.p.z).project(d.camera);
        const x = (d.point.x * .5 + .5) * w,
          y = (-d.point.y * .5 + .5) * h;
        el.style.transform = `translate3d(${x - 48}px,${y - 88}px,0)`;
        el.style.visibility = visible && y > 25 && y < (d.camera.isPerspectiveCamera && !focused ? h * .5 : h - 4) ? 'visible' : 'hidden';
        el.style.zIndex = focused ? '1000' : String(Math.round(y));
      }
    }
    d.r.render(d.scene, d.camera);
    if (!readySent.current) {
      readySent.current = true;
      readyCallback.current?.();
    }
  }, [level, xp, xpNext], active && !failed);
  if (!CH.ok() || failed) return /*#__PURE__*/React.createElement("div", {
    className: "rb-iso-fallback",
    role: "status"
  }, "3D-\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0430\u0440\u0442\u0443 \u043A\u043D\u043E\u043F\u043A\u0430\u043C\u0438 \u043D\u0438\u0436\u0435.");
  return /*#__PURE__*/React.createElement("canvas", {
    key: `${level}:${xp}:${xpNext}`,
    ref: ref,
    role: "img",
    "aria-label": "\u0418\u0437\u043E\u043C\u0435\u0442\u0440\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043A\u0430\u0440\u0442\u0430: \u043D\u0435\u043F\u0440\u0435\u0440\u044B\u0432\u043D\u044B\u0439 \u043F\u0443\u0442\u044C \u043F\u043E \u0432\u0441\u0435\u043C \u0443\u0440\u043E\u0432\u043D\u044F\u043C",
    style: {
      width: '100%',
      height: '100%',
      display: 'block'
    }
  });
}
Object.assign(window, {
  rbIsoSide,
  rbIsoSideAt,
  CH3D: CH,
  chUseLoop3D: chUseLoop,
  chPointer3D: chPointer,
  RbUnlockCard3D,
  RbHeroCard3D,
  RbHouse3D,
  RbRouteCard3D,
  RbLegendCard3D,
  RbIsoMap3D,
  rbIsoPoint,
  rbIsoSpring,
  chRbPercent,
  chHouseState,
  chFloors,
  chOpenInSuit
});
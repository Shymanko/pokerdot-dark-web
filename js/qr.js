// qr.js — a real, scannable QR code, generated locally (no network).
// Scope kept deliberately narrow: version 3 (29×29), EC level M, byte mode,
// single RS block (70 codewords: 44 data + 26 error) — enough for a referral
// link of up to 41 characters, which is all this app encodes.
(() => {
  const SIZE = 29,
    DATA_CW = 44,
    EC_CW = 26,
    TOTAL_CW = 70;

  // ── GF(256) ──────────────────────────────────────────────────────────────
  const EXP = new Uint8Array(512),
    LOG = new Uint8Array(256);
  for (let i = 0, x = 1; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11D;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  const mul = (a, b) => a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];

  // generator polynomial of degree EC_CW
  const gen = (() => {
    let g = [1];
    for (let i = 0; i < EC_CW; i++) {
      const n = new Array(g.length + 1).fill(0);
      for (let j = 0; j < g.length; j++) {
        n[j] ^= mul(g[j], 1);
        n[j + 1] ^= mul(g[j], EXP[i]);
      }
      g = n;
    }
    return g;
  })();
  const ecc = data => {
    const res = new Array(EC_CW).fill(0);
    for (let i = 0; i < data.length; i++) {
      const f = data[i] ^ res[0];
      res.shift();
      res.push(0);
      if (f !== 0) for (let j = 0; j < EC_CW; j++) res[j] ^= mul(gen[j + 1], f);
    }
    return res;
  };

  // ── bit stream ───────────────────────────────────────────────────────────
  const encode = text => {
    const bytes = [];
    for (const ch of unescape(encodeURIComponent(text))) bytes.push(ch.charCodeAt(0) & 0xff);
    if (bytes.length > DATA_CW - 3) throw new Error("qr: text too long for version 3-M");
    const bits = [];
    const push = (v, n) => {
      for (let i = n - 1; i >= 0; i--) bits.push(v >> i & 1);
    };
    push(0b0100, 4); // byte mode
    push(bytes.length, 8); // char count (versions 1–9)
    bytes.forEach(b => push(b, 8));
    push(0, Math.min(4, DATA_CW * 8 - bits.length)); // terminator
    while (bits.length % 8) bits.push(0);
    const cw = [];
    for (let i = 0; i < bits.length; i += 8) cw.push(parseInt(bits.slice(i, i + 8).join(""), 2));
    const PAD = [0xEC, 0x11];
    while (cw.length < DATA_CW) cw.push(PAD[(cw.length - Math.ceil(bits.length / 8)) % 2]);
    return cw.concat(ecc(cw));
  };

  // ── matrix ───────────────────────────────────────────────────────────────
  const build = (text, mask = 0) => {
    const m = Array.from({
      length: SIZE
    }, () => new Array(SIZE).fill(null)); // null = free
    const set = (r, c, v) => {
      if (r >= 0 && r < SIZE && c >= 0 && c < SIZE) m[r][c] = v;
    };
    const finder = (R, C) => {
      for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
        if (R + r < 0 || R + r >= SIZE || C + c < 0 || C + c >= SIZE) continue;
        const on = r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4;
        set(R + r, C + c, on ? 1 : 0);
      }
    };
    finder(0, 0);
    finder(0, SIZE - 7);
    finder(SIZE - 7, 0);

    // alignment pattern (version 3 → centre 22,22)
    for (let r = -2; r <= 2; r++) for (let c = -2; c <= 2; c++) {
      const on = Math.max(Math.abs(r), Math.abs(c)) !== 1;
      set(22 + r, 22 + c, on ? 1 : 0);
    }
    // timing
    for (let i = 8; i < SIZE - 8; i++) {
      const v = i % 2 === 0 ? 1 : 0;
      set(6, i, v);
      set(i, 6, v);
    }

    // reserve format areas
    for (let i = 0; i < 9; i++) {
      if (m[8][i] === null) set(8, i, 0);
      if (m[i][8] === null) set(i, 8, 0);
    }
    for (let i = 0; i < 8; i++) {
      set(8, SIZE - 1 - i, 0);
      set(SIZE - 1 - i, 8, 0);
    }

    // ── data placement, zig-zag from the bottom-right ──
    const cw = encode(text);
    const bits = [];
    cw.forEach(b => {
      for (let i = 7; i >= 0; i--) bits.push(b >> i & 1);
    });
    let bi = 0,
      up = true;
    for (let col = SIZE - 1; col > 0; col -= 2) {
      if (col === 6) col--; // skip the timing column
      for (let n = 0; n < SIZE; n++) {
        const row = up ? SIZE - 1 - n : n;
        for (const c of [col, col - 1]) {
          if (m[row][c] !== null) continue;
          let bit = bi < bits.length ? bits[bi++] : 0;
          // mask 0: (row + col) % 2 === 0
          if ((row + c) % 2 === 0) bit ^= 1;
          m[row][c] = bit;
        }
      }
      up = !up;
    }

    // ── format info: level M (00) + mask 0 → BCH(15,5) ──
    const data = 0b00 << 3 | mask; // 0b00000
    let bch = data << 10;
    for (let i = 4; i >= 0; i--) if (bch >> 10 + i & 1) bch ^= 0b10100110111 << i;
    const fmt = (data << 10 | bch) ^ 0b101010000010010;
    // bit i is the LSB-first index; both copies follow the spec's mapping
    const fbit = i => fmt >> i & 1;
    for (let i = 0; i < 15; i++) {
      const b = fbit(i);
      // column 8, top-down
      if (i < 6) set(i, 8, b);else if (i < 8) set(i + 1, 8, b);else set(SIZE - 15 + i, 8, b);
      // row 8, right-to-left
      if (i < 8) set(8, SIZE - 1 - i, b);else if (i === 8) set(8, 7, b);else set(8, 14 - i, b);
    }
    set(SIZE - 8, 8, 1); // dark module — written last, nothing may overwrite it

    return m;
  };
  window.pxQR = text => ({
    size: SIZE,
    modules: build(text)
  });

  // <PxQR text=… px=… /> — draws the matrix on a canvas, crisp at any size
  function PxQR({
    text,
    px = 148,
    dark = "#000",
    light = "#fff",
    quiet = 2
  }) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      const cv = ref.current;
      if (!cv) return;
      let q;
      try {
        q = window.pxQR(text);
      } catch (e) {
        return;
      }
      const n = q.size + quiet * 2;
      const dpr = window.devicePixelRatio || 1;
      const cell = Math.max(1, Math.floor(px * dpr / n));
      const side = cell * n;
      cv.width = side;
      cv.height = side;
      cv.style.width = px + "px";
      cv.style.height = px + "px";
      const g = cv.getContext("2d");
      g.fillStyle = light;
      g.fillRect(0, 0, side, side);
      g.fillStyle = dark;
      for (let r = 0; r < q.size; r++) for (let c = 0; c < q.size; c++) {
        if (q.modules[r][c]) g.fillRect((c + quiet) * cell, (r + quiet) * cell, cell, cell);
      }
    }, [text, px, dark, light, quiet]);
    return /*#__PURE__*/React.createElement("canvas", {
      ref: ref,
      style: {
        display: "block",
        width: px,
        height: px,
        borderRadius: 4
      }
    });
  }
  Object.assign(window, {
    PxQR
  });
})();
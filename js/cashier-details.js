// Cashier — details step (enter payment data) between amount and processing.
// CARD → card form. CRYPTO → network + deposit address + QR (deposit) or
// wallet address input (withdraw). On-brand dark + mono.

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  inputMode = "numeric",
  mono = true
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "block"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_C,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".18em",
      marginBottom: 7
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    maxLength: maxLength,
    inputMode: inputMode,
    style: {
      width: "100%",
      boxSizing: "border-box",
      padding: "13px 14px",
      borderRadius: 12,
      background: "rgba(255,255,255,.065)",
      border: "1px solid rgba(255,255,255,.16)",
      color: "#fff",
      outline: "none",
      fontFamily: mono ? MONO_C : SANS_C,
      fontWeight: mono ? 700 : 600,
      fontSize: 15,
      letterSpacing: ".04em"
    },
    onFocus: e => {
      e.target.style.borderColor = "rgba(255,255,255,.5)";
    },
    onBlur: e => {
      e.target.style.borderColor = "rgba(255,255,255,.16)";
    }
  }));
}

// deterministic faux-QR (dot-matrix grid) — decorative, on-brand
function FauxQR({
  size = 132,
  seed = 7
}) {
  const N = 21,
    cell = size / N;
  let s = seed;
  const rnd = () => (s = s * 1103515245 + 12345 & 0x7fffffff) / 0x7fffffff;
  const cells = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const finder = x < 7 && y < 7 || x >= N - 7 && y < 7 || x < 7 && y >= N - 7;
    const on = finder ? x === 0 || x === 6 || y === 0 || y === 6 || x >= 2 && x <= 4 && y >= 2 && y <= 4 || x >= N - 7 && (x === N - 7 || x === N - 1) : rnd() > 0.55;
    if (on) cells.push(/*#__PURE__*/React.createElement("rect", {
      key: x + "-" + y,
      x: x * cell,
      y: y * cell,
      width: cell,
      height: cell,
      fill: "#0a0a0a"
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: size,
      height: size,
      borderRadius: 12,
      background: "#fff",
      padding: 8,
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "100%",
    height: "100%",
    viewBox: `0 0 ${size} ${size}`
  }, cells));
}
const CRYPTO_NETS = ["USDT TRC-20", "USDT ERC-20", "BTC", "ETH"];
const MOCK_ADDR = {
  "USDT TRC-20": "TQn9Y2khEsLJW1ChVWFMSMeRDow5oNZ3",
  "USDT ERC-20": "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  "BTC": "bc1qar0srrr7xfkvy5l643lydnw9re59gtzz",
  "ETH": "0x4E83362442B8d1beC281594ceA3050c8EB01311C"
};
function NetworkPicker({
  value,
  onChange,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 8
    }
  }, CRYPTO_NETS.map(n => {
    const on = n === value;
    return /*#__PURE__*/React.createElement("button", {
      key: n,
      onClick: () => {
        if (window.playClick) window.playClick(1050, 0.03);
        onChange(n);
      },
      style: {
        padding: "12px 0",
        borderRadius: 12,
        background: on ? "rgba(255,255,255,.1)" : "rgba(255,255,255,.065)",
        border: `1px solid ${on ? accent : "rgba(255,255,255,.1)"}`,
        color: on ? "#fff" : "rgba(255,255,255,.6)",
        cursor: "pointer",
        fontFamily: MONO_C,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: ".04em",
        transition: "all 140ms"
      }
    }, n);
  }));
}
function fmtCard(v) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function fmtExp(v) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

// ── DEPOSIT details ──────────────────────────────────────────────────────
function DepositDetails({
  method,
  amount,
  accent,
  onConfirm
}) {
  const [num, setNum] = React.useState("");
  const [exp, setExp] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [name, setName] = React.useState("");
  const [net, setNet] = React.useState(CRYPTO_NETS[0]);
  const [copied, setCopied] = React.useState(false);
  if (method === "crypto") {
    const addr = MOCK_ADDR[net];
    const copy = () => {
      try {
        navigator.clipboard && navigator.clipboard.writeText(addr);
      } catch (e) {}
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      if (window.playClick) window.playClick(1200, 0.04);
    };
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS_C,
        fontWeight: 700,
        fontSize: 10.5,
        color: "#A9A9B2",
        letterSpacing: ".2em",
        marginBottom: 11
      }
    }, "SELECT NETWORK"), /*#__PURE__*/React.createElement(NetworkPicker, {
      value: net,
      onChange: setNet,
      accent: accent
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement(FauxQR, {
      seed: net.length * 13 + 5
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS_C,
        fontWeight: 700,
        fontSize: 10.5,
        color: "#A9A9B2",
        letterSpacing: ".18em",
        marginTop: 16
      }
    }, "DEPOSIT ADDRESS \xB7 ", net), /*#__PURE__*/React.createElement("div", {
      onClick: copy,
      style: {
        marginTop: 8,
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 13px",
        borderRadius: 12,
        background: "rgba(255,255,255,.065)",
        border: "1px solid rgba(255,255,255,.16)",
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        minWidth: 0,
        fontFamily: MONO_C,
        fontSize: 12,
        color: "#fff",
        wordBreak: "break-all",
        lineHeight: 1.4
      }
    }, addr), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: "none",
        display: "flex",
        alignItems: "center",
        gap: 5,
        color: copied ? "#5BD96A" : accent,
        fontFamily: SANS_C,
        fontWeight: 700,
        fontSize: 10.5,
        letterSpacing: ".1em"
      }
    }, copied ? /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#5BD96A",
      strokeWidth: "3",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5L20 6"
    })) : /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: accent,
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "9",
      y: "9",
      width: "11",
      height: "11",
      rx: "2.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 15V5a2 2 0 0 1 2-2h8"
    })), copied ? "COPIED" : "COPY")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        fontFamily: SANS_C,
        fontWeight: 600,
        fontSize: 11,
        color: "#D8D8DF",
        letterSpacing: ".04em",
        textAlign: "center",
        lineHeight: 1.5
      }
    }, "Send ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#fff",
        fontWeight: 700
      }
    }, "$", amount.toLocaleString("en-US").split(",").join(" ")), " worth of ", net.split(" ")[0], " to this address.", /*#__PURE__*/React.createElement("br", null), "Funds credit after network confirmation.")), /*#__PURE__*/React.createElement("button", {
      onClick: onConfirm,
      style: ctaStyle(accent)
    }, "I'VE SENT THE FUNDS"));
  }

  // card
  const valid = num.replace(/\s/g, "").length >= 15 && exp.length === 5 && cvv.length >= 3 && name.trim().length > 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      borderRadius: 14,
      padding: 16,
      height: 92,
      overflow: "hidden",
      background: "linear-gradient(135deg, #1d1d22, #0c0c0e)",
      border: "1px solid rgba(255,255,255,.1)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: `radial-gradient(circle at 88% 20%, ${accent}33, transparent 55%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 24,
      borderRadius: 5,
      background: "linear-gradient(135deg,#f0c75e,#b8901f)"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 11,
      color: "#A9A9B2",
      letterSpacing: ".1em"
    }
  }, "POKERDOT")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      marginTop: 14,
      fontFamily: MONO_C,
      fontWeight: 700,
      fontSize: 17,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, num || "•••• •••• •••• ••••")), /*#__PURE__*/React.createElement(Field, {
    label: "CARD NUMBER",
    value: num,
    onChange: v => setNum(fmtCard(v)),
    placeholder: "1234 5678 9012 3456"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "EXPIRY",
    value: exp,
    onChange: v => setExp(fmtExp(v)),
    placeholder: "MM/YY",
    maxLength: 5
  }), /*#__PURE__*/React.createElement(Field, {
    label: "CVV",
    value: cvv,
    onChange: v => setCvv(v.replace(/\D/g, "").slice(0, 4)),
    placeholder: "123",
    maxLength: 4
  })), /*#__PURE__*/React.createElement(Field, {
    label: "CARDHOLDER NAME",
    value: name,
    onChange: setName,
    placeholder: "JOHN DOE",
    inputMode: "text"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    disabled: !valid,
    style: ctaStyle(accent, !valid)
  }, "DEPOSIT $", amount.toLocaleString("en-US").split(",").join(" ")));
}

// ── WITHDRAW details ─────────────────────────────────────────────────────
function WithdrawDetails({
  method,
  amount,
  accent,
  onConfirm
}) {
  const [num, setNum] = React.useState("");
  const [name, setName] = React.useState("");
  const [net, setNet] = React.useState(CRYPTO_NETS[0]);
  const [addr, setAddr] = React.useState("");
  if (method === "crypto") {
    const valid = addr.trim().length >= 20;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS_C,
        fontWeight: 700,
        fontSize: 10.5,
        color: "#A9A9B2",
        letterSpacing: ".2em",
        marginBottom: 11
      }
    }, "WITHDRAW NETWORK"), /*#__PURE__*/React.createElement(NetworkPicker, {
      value: net,
      onChange: setNet,
      accent: accent
    })), /*#__PURE__*/React.createElement(Field, {
      label: "YOUR WALLET ADDRESS",
      value: addr,
      onChange: setAddr,
      placeholder: `Paste your ${net} address`,
      inputMode: "text"
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: SANS_C,
        fontWeight: 600,
        fontSize: 11,
        color: "#D8D8DF",
        letterSpacing: ".04em",
        textAlign: "center",
        lineHeight: 1.5
      }
    }, "Sending ", /*#__PURE__*/React.createElement("span", {
      style: {
        color: "#fff",
        fontWeight: 700
      }
    }, "$", amount.toLocaleString("en-US").split(",").join(" ")), " in ", net.split(" ")[0], " \xB7 network fee deducted."), /*#__PURE__*/React.createElement("button", {
      onClick: onConfirm,
      disabled: !valid,
      style: ctaStyle(accent, !valid)
    }, "WITHDRAW $", amount.toLocaleString("en-US").split(",").join(" ")));
  }
  const valid = num.replace(/\s/g, "").length >= 15 && name.trim().length > 1;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "DESTINATION CARD",
    value: num,
    onChange: v => setNum(fmtCard(v)),
    placeholder: "1234 5678 9012 3456"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "CARDHOLDER NAME",
    value: name,
    onChange: setName,
    placeholder: "JOHN DOE",
    inputMode: "text"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_C,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".04em",
      textAlign: "center",
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#fff",
      fontWeight: 700
    }
  }, "$", amount.toLocaleString("en-US").split(",").join(" ")), " to your card \xB7 arrives in 1\u20133 business days."), /*#__PURE__*/React.createElement("button", {
    onClick: onConfirm,
    disabled: !valid,
    style: ctaStyle(accent, !valid)
  }, "WITHDRAW $", amount.toLocaleString("en-US").split(",").join(" ")));
}
function ctaStyle(accent, disabled) {
  return {
    marginTop: 18,
    width: "100%",
    padding: "16px 0",
    borderRadius: 125,
    background: disabled ? "rgba(255,255,255,.1)" : accent,
    color: "#fff",
    border: 0,
    cursor: disabled ? "default" : "pointer",
    boxShadow: disabled ? "none" : `0 14px 30px ${accent}66`,
    fontFamily: MONO_C,
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: ".08em",
    transition: "background 160ms"
  };
}
Object.assign(window, {
  DepositDetails,
  WithdrawDetails
});
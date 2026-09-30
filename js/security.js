// Account Security screen — link accounts + security controls.
// Tab-style overlay (dock stays visible). Reuses settings controls.

function SecIcon({
  kind,
  color = "rgba(255,255,255,.85)"
}) {
  const P = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: color,
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (kind) {
    case "mail":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "5",
        width: "18",
        height: "14",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3.5 6.5 12 13l8.5-6.5"
      }));
    case "phone":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "6",
        y: "2.5",
        width: "12",
        height: "19",
        rx: "2.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10.5 18.5h3"
      }));
    case "google":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "8.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 9.5h4.2a4.4 4.4 0 1 1-1.3-3"
      }));
    case "key":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("circle", {
        cx: "8",
        cy: "14",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M11 11l8-8M16 4l3 3M14.5 5.5l2.5 2.5"
      }));
    case "lock":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "11",
        width: "16",
        height: "9",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 11V8a4 4 0 0 1 8 0v3"
      }));
    case "shield":
      return /*#__PURE__*/React.createElement("svg", P, /*#__PURE__*/React.createElement("path", {
        d: "M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 12l2 2 4-4"
      }));
    default:
      return null;
  }
}
function SecRow({
  icon,
  label,
  value,
  status,
  button,
  onButton,
  accent,
  top
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-security-row",
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "13px 13px",
      borderTop: top ? "1px solid rgba(255,255,255,.085)" : "0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 38,
      height: 38,
      borderRadius: 12,
      flex: "none",
      background: "#14171c",
      border: "1px solid rgba(255,255,255,.13)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(SecIcon, {
    kind: icon
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: MONO_S,
      fontSize: 13,
      color: "#fff",
      letterSpacing: ".02em",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, label), value && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".04em",
      marginTop: 3,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, value)), status && /*#__PURE__*/React.createElement("span", {
    className: "ps-security-status",
    style: {
      flex: "none",
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      padding: "4px 9px",
      borderRadius: 6,
      background: "rgba(91,217,106,.14)",
      border: "1px solid rgba(91,217,106,.35)",
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#5BD96A",
      letterSpacing: ".12em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "9",
    height: "9",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  })), "LINKED"), button && /*#__PURE__*/React.createElement("button", {
    className: "ps-security-action",
    onClick: () => {
      if (window.playClick) window.playClick(1150, 0.04);
      onButton && onButton();
    },
    style: {
      flex: "none",
      padding: "9px 16px",
      borderRadius: 8,
      background: accent,
      color: "#fff",
      border: 0,
      cursor: "pointer",
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: ".06em",
      boxShadow: `0 6px 14px ${accent}44`
    }
  }, button));
}
const secInput = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 14px",
  borderRadius: 12,
  background: "#14171c",
  border: "1px solid rgba(255,255,255,.16)",
  color: "#fff",
  fontFamily: MONO_S,
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: ".04em",
  outline: "none"
};
function SubPhoneBind({
  accent,
  onLinked,
  onBack
}) {
  const [code, setCode] = React.useState("+1");
  const [num, setNum] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, 0.04);
  };
  const CODES = ["+1", "+44", "+380", "+48", "+886", "+66", "+84"];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      background: `${accent}18`,
      border: `1px solid ${accent}45`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(SecIcon, {
    kind: "phone",
    color: accent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_S,
      fontSize: 18,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 12
    }
  }, "LINK YOUR PHONE"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 500,
      fontSize: 11,
      color: "#D8D8DF",
      textAlign: "center",
      marginTop: 6,
      maxWidth: 250,
      lineHeight: 1.5
    }
  }, "We'll text a 6-digit code to verify your number.")), /*#__PURE__*/React.createElement(SLabel, null, "PHONE NUMBER"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: code,
    onChange: e => setCode(e.target.value),
    style: {
      ...secInput,
      width: 88,
      flex: "none",
      appearance: "none",
      cursor: "pointer"
    }
  }, CODES.map(c => /*#__PURE__*/React.createElement("option", {
    key: c,
    value: c,
    style: {
      background: "#111"
    }
  }, c))), /*#__PURE__*/React.createElement("input", {
    value: num,
    onChange: e => setNum(e.target.value.replace(/[^0-9]/g, "")),
    placeholder: "555 019 2834",
    inputMode: "numeric",
    style: {
      ...secInput,
      flex: 1,
      letterSpacing: ".1em"
    }
  })), !sent ? /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!num) return;
      click(1400);
      setSent(true);
    },
    disabled: !num,
    style: {
      width: "100%",
      marginTop: 18,
      padding: "15px 0",
      borderRadius: 125,
      border: 0,
      background: num ? accent : "rgba(255,255,255,.13)",
      color: num ? "#fff" : "rgba(255,255,255,.35)",
      cursor: num ? "pointer" : "default",
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".08em",
      boxShadow: num ? `0 12px 28px ${accent}55` : "none"
    }
  }, "SEND CODE") : /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20
    }
  }, /*#__PURE__*/React.createElement(SLabel, null, "ENTER CODE \u2014 SENT TO ", code, " ", num), /*#__PURE__*/React.createElement("input", {
    value: otp,
    onChange: e => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6)),
    placeholder: "\u2022 \u2022 \u2022 \u2022 \u2022 \u2022",
    inputMode: "numeric",
    style: {
      ...secInput,
      textAlign: "center",
      fontSize: 22,
      letterSpacing: ".4em"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
      padding: "0 2px"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      click(900);
    },
    style: {
      background: "transparent",
      border: 0,
      cursor: "pointer",
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em"
    }
  }, "RESEND IN 0:42"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".06em"
    }
  }, otp.length, "/6")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (otp.length < 6) return;
      click(1700);
      onLinked(code + " " + num);
    },
    disabled: otp.length < 6,
    style: {
      width: "100%",
      marginTop: 14,
      padding: "15px 0",
      borderRadius: 125,
      border: 0,
      background: otp.length >= 6 ? accent : "rgba(255,255,255,.13)",
      color: otp.length >= 6 ? "#fff" : "rgba(255,255,255,.35)",
      cursor: otp.length >= 6 ? "pointer" : "default",
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".08em",
      boxShadow: otp.length >= 6 ? `0 12px 28px ${accent}55` : "none"
    }
  }, "VERIFY & LINK")));
}
function SubChangePassword({
  accent,
  onDone
}) {
  const [cur, setCur] = React.useState("");
  const [nw, setNw] = React.useState("");
  const [cf, setCf] = React.useState("");
  const [show, setShow] = React.useState(false);
  const click = f => {
    if (window.playClick) window.playClick(f || 1100, 0.04);
  };
  const strong = nw.length >= 8;
  const match = nw && nw === cf;
  const ok = cur && strong && match;
  const Field = ({
    label,
    val,
    setVal,
    ph
  }) => /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(SLabel, null, label), /*#__PURE__*/React.createElement("input", {
    type: show ? "text" : "password",
    value: val,
    onChange: e => setVal(e.target.value),
    placeholder: ph,
    style: secInput
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 16,
      background: `${accent}18`,
      border: `1px solid ${accent}45`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(SecIcon, {
    kind: "key",
    color: accent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: MONO_S,
      fontSize: 18,
      color: "#fff",
      letterSpacing: ".04em",
      marginTop: 12
    }
  }, "CHANGE PASSWORD")), /*#__PURE__*/React.createElement(Field, {
    label: "CURRENT PASSWORD",
    val: cur,
    setVal: setCur,
    ph: "Enter current password"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "NEW PASSWORD",
    val: nw,
    setVal: setNw,
    ph: "At least 8 characters"
  }), /*#__PURE__*/React.createElement(Field, {
    label: "CONFIRM NEW PASSWORD",
    val: cf,
    setVal: setCf,
    ph: "Repeat new password"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShow(!show),
    style: {
      background: "transparent",
      border: 0,
      cursor: "pointer",
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#A9A9B2",
      letterSpacing: ".08em",
      padding: "2px 2px"
    }
  }, show ? "HIDE PASSWORDS" : "SHOW PASSWORDS"), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 18,
      marginTop: 4
    }
  }, nw && !strong && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".06em"
    }
  }, "NEW PASSWORD MUST BE 8+ CHARACTERS"), strong && cf && !match && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: accent,
      letterSpacing: ".06em"
    }
  }, "PASSWORDS DON'T MATCH"), ok && /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      fontFamily: SANS_S,
      fontWeight: 700,
      fontSize: 10.5,
      color: "#5BD96A",
      letterSpacing: ".06em"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#5BD96A",
    strokeWidth: "3",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  })), "LOOKS GOOD")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (!ok) return;
      click(1700);
      onDone();
    },
    disabled: !ok,
    style: {
      width: "100%",
      marginTop: 8,
      padding: "15px 0",
      borderRadius: 125,
      border: 0,
      background: ok ? accent : "rgba(255,255,255,.13)",
      color: ok ? "#fff" : "rgba(255,255,255,.35)",
      cursor: ok ? "pointer" : "default",
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 14,
      letterSpacing: ".08em",
      boxShadow: ok ? `0 12px 28px ${accent}55` : "none"
    }
  }, "SAVE PASSWORD"));
}
function SecurityScreen({
  open,
  onClose,
  accent = "#D71921"
}) {
  // повноекранний під-екран — ховаємо верхню смугу активних столів,
  // інакше вона малюється поверх власної шапки екрана
  React.useEffect(() => {
    if (!open) return;
    window.dispatchEvent(new CustomEvent("px-full", {
      detail: 1
    }));
    return () => window.dispatchEvent(new CustomEvent("px-full", {
      detail: -1
    }));
  }, [open]);
  const [mounted, setMounted] = React.useState(false);
  const [twofa, setTwofa] = React.useState(false);
  const [phoneLinked, setPhoneLinked] = React.useState(false);
  const [phoneVal, setPhoneVal] = React.useState("");
  const [googleLinked, setGoogleLinked] = React.useState(false);
  const [sub, setSub] = React.useState("main");
  const [toast, setToast] = React.useState(null);
  const toastRef = React.useRef(0);
  React.useEffect(() => {
    if (!open) {
      setSub("main");
      return;
    }
    setMounted(false);
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, [open]);
  if (!open) return null;
  const flash = m => {
    setToast(m);
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), 2600);
  };
  const back = () => {
    if (window.playClick) window.playClick(900, 0.04);
    if (sub !== "main") setSub("main");else onClose();
  };
  const title = sub === "phone" ? "LINK PHONE" : sub === "password" ? "CHANGE PASSWORD" : "ACCOUNT SECURITY";
  return /*#__PURE__*/React.createElement("div", {
    className: "ps-detail ps-security",
    style: {
      position: "absolute",
      inset: 0,
      zIndex: 39,
      background: "#000",
      transform: mounted ? "translateY(0)" : "translateY(100%)",
      transition: "transform 340ms cubic-bezier(0.2,0.8,0.2,1)",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: 200,
      pointerEvents: "none",
      background: `radial-gradient(ellipse 90% 70% at 50% 0%, ${accent}1c, transparent 60%)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "pd-screen-header",
    style: {
      position: "relative",
      zIndex: 5,
      paddingTop: 62,
      paddingLeft: 14,
      paddingRight: 14,
      paddingBottom: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "\u041D\u0430\u0437\u0430\u0434 \u0438\u0437 \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u0438",
    onClick: back,
    style: {
      width: 36,
      height: 36,
      borderRadius: 12,
      background: "#14171c",
      border: "1px solid rgba(255,255,255,.18)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 6l-6 6 6 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 15,
      color: "#fff",
      letterSpacing: ".16em"
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 36
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ps-content",
    style: {
      flex: 1,
      overflowY: "auto",
      overflowX: "hidden",
      WebkitOverflowScrolling: "touch",
      padding: "6px 16px 110px",
      position: "relative",
      zIndex: 2
    }
  }, sub === "phone" && /*#__PURE__*/React.createElement(SubPhoneBind, {
    accent: accent,
    onLinked: v => {
      setPhoneVal(v);
      setPhoneLinked(true);
      setSub("main");
      flash("PHONE LINKED");
    },
    onBack: () => setSub("main")
  }), sub === "password" && /*#__PURE__*/React.createElement(SubChangePassword, {
    accent: accent,
    onDone: () => {
      setSub("main");
      flash("PASSWORD UPDATED");
    }
  }), sub === "main" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(SLabel, null, "LINK YOUR ACCOUNT"), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SecRow, {
    icon: "mail",
    label: "aiccpoker@gmail.com",
    value: "Recovery email",
    status: true,
    accent: accent
  }), /*#__PURE__*/React.createElement(SecRow, {
    top: true,
    icon: "phone",
    label: "PHONE",
    value: phoneLinked ? phoneVal : "Not yet linked",
    status: phoneLinked,
    button: phoneLinked ? null : "LINK",
    onButton: () => setSub("phone"),
    accent: accent
  }), /*#__PURE__*/React.createElement(SecRow, {
    top: true,
    icon: "google",
    label: "GOOGLE",
    value: googleLinked ? "Connected" : "Not yet linked",
    status: googleLinked,
    button: googleLinked ? null : "LINK",
    onButton: () => setGoogleLinked(true),
    accent: accent
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(SLabel, null, "ACCOUNT SECURITY"), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SecRow, {
    icon: "key",
    label: "CHANGE PASSWORD",
    value: "Login password",
    button: "CHANGE",
    onButton: () => setSub("password"),
    accent: accent
  }), /*#__PURE__*/React.createElement(SecRow, {
    top: true,
    icon: "lock",
    label: "FUND PASSWORD",
    value: "Required for withdrawals",
    button: "SET",
    accent: accent
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 18
    }
  }, /*#__PURE__*/React.createElement(SLabel, null, "EXTRA PROTECTION"), /*#__PURE__*/React.createElement(SCard, null, /*#__PURE__*/React.createElement(SRow, {
    label: "TWO-FACTOR AUTH",
    sub: "Require a code on every login"
  }, /*#__PURE__*/React.createElement(SToggle, {
    on: twofa,
    onToggle: () => setTwofa(!twofa),
    accent: accent
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "12px 14px",
      borderRadius: 12,
      background: "rgba(91,217,106,.08)",
      border: "1px solid rgba(91,217,106,.25)"
    }
  }, /*#__PURE__*/React.createElement(SecIcon, {
    kind: "shield",
    color: "#5BD96A"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: SANS_S,
      fontWeight: 600,
      fontSize: 11,
      color: "#D8D8DF",
      letterSpacing: ".03em",
      lineHeight: 1.5
    }
  }, "Your account is protected. Enable two-factor auth for an extra layer of security."))))), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 16,
      right: 16,
      bottom: 30,
      zIndex: 8,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "13px 15px",
      borderRadius: 14,
      background: "rgba(18,22,18,.96)",
      border: "1px solid rgba(91,217,106,.4)",
      boxShadow: "0 14px 34px rgba(0,0,0,.55)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: "none",
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: "#5BD96A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#0a0a0a",
    strokeWidth: "3.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12l5 5L20 6"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: MONO_S,
      fontWeight: 700,
      fontSize: 12,
      color: "#fff",
      letterSpacing: ".06em"
    }
  }, toast)));
}
Object.assign(window, {
  SecurityScreen
});
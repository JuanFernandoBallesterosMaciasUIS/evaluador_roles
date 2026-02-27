import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  { id: 1,  text: "Me gusta probar y luego revisar mis ideas antes de generar la solucion o el producto final", type: "C" },
  { id: 2,  text: "Me gusta tomarme el tiempo para clarificar la naturaleza exacta del problema", type: "A" },
  { id: 3,  text: "Disfruto tomar los pasos necesarios para poner mis ideas en accion", type: "D" },
  { id: 4,  text: "Me gusta separar un problema amplio en partes para examinarlo desde todos los angulos", type: "C" },
  { id: 5,  text: "Tengo dificultad en tener ideas inusuales para resolver un problema", type: "B" },
  { id: 6,  text: "Me gusta identificar los hechos mas relevantes relativos al problema", type: "A" },
  { id: 7,  text: "No tengo el temperamento para tratar de aislar las causas especificas de un problema", type: "A" },
  { id: 8,  text: "Disfruto en generar formas unicas de mirar un problema", type: "B" },
  { id: 9,  text: "Me gusta generar todos los pros y contras de una solucion potencial", type: "C" },
  { id: 10, text: "Antes de implementar una solucion me gusta separarla en pasos", type: "C" },
  { id: 11, text: "Transformar ideas en accion no es lo que mas disfruto", type: "D" },
  { id: 12, text: "Me gusta superar el criterio que pueda usarse para identificar la mejor opcion o solucion", type: "C" },
  { id: 13, text: "Disfruto de pasar el tiempo profundizando el analisis inicial del problema", type: "B" },
  { id: 14, text: "Por naturaleza no paso mucho tiempo emocionandome en definir el problema exacto a resolver", type: "A" },
  { id: 15, text: "Me gusta entender una situacion al mirar el panorama general", type: "B" },
  { id: 16, text: "Disfruto de trabajar en problemas mal definidos y novedosos", type: "B" },
  { id: 17, text: "Cuando trabajo en un problema, me gusta encontrar la mejor forma de enunciarlo", type: "A" },
  { id: 18, text: "Disfruto en hacer que las cosas se concreten", type: "D" },
  { id: 19, text: "Me gusta enfocarme en enunciar un problema en una forma precisa", type: "A" },
  { id: 20, text: "Disfruto de utilizar mi imaginacion para producir muchas ideas", type: "B" },
  { id: 21, text: "Me gusta enfocarme en la informacion clave de una situacion desafiante", type: "A" },
  { id: 22, text: "Disfruto de tomarme el tiempo para perfeccionar una idea", type: "C" },
  { id: 23, text: "Me resulta dificil implementar mis ideas", type: "D" },
  { id: 24, text: "Disfruto en transformar ideas en bruto en soluciones concretas", type: "D" },
  { id: 25, text: "No paso el tiempo en todas las cosas que necesito hacer para implementar una idea", type: "D" },
  { id: 26, text: "Realmente disfruto de implementar una idea", type: "D" },
  { id: 27, text: "Antes de avanzar me gusta tener una clara comprension del problema", type: "A" },
  { id: 28, text: "Me gusta trabajar con ideas unicas", type: "B" },
  { id: 29, text: "Disfruto de poner mis ideas en accion", type: "D" },
  { id: 30, text: "Me gusta explorar las fortalezas y debilidades de una solucion potencial", type: "C" },
  { id: 31, text: "Disfruto de reunir informacion para identificar el origen de un problema en particular", type: "A" },
  { id: 32, text: "Disfruto el analisis y el esfuerzo que lleva transformar un concepto preliminar en una idea factible", type: "C" },
  { id: 33, text: "Mi tendencia natural no es generar muchas ideas para los problemas", type: "B" },
  { id: 34, text: "Disfruto de usar metaforas o analogias para generar nuevas ideas para los problemas", type: "B" },
  { id: 35, text: "Encuentro que tengo poca paciencia para el esfuerzo que lleva pulir o refinar una idea", type: "C" },
  { id: 36, text: "Tiendo a buscar una solucion rapida y luego implementarla", type: "D" },
];

const PROFILES = {
  A: { label: "Clarificador",  color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
  B: { label: "Ideador",       color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  C: { label: "Desarrollador", color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" },
  D: { label: "Implementador", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
};

const MAX_SCORES = (() => {
  const m = { A: 0, B: 0, C: 0, D: 0 };
  QUESTIONS.forEach(q => { m[q.type] += 5; });
  return m;
})();

function scoreFromBox(b) {
  if (b <= 2) return 1;
  if (b <= 4) return 2;
  if (b <= 6) return 3;
  if (b <= 8) return 4;
  return 5;
}
function calcResults(answers) {
  const s = { A: 0, B: 0, C: 0, D: 0 };
  QUESTIONS.forEach((q, i) => { if (answers[i] != null) s[q.type] += scoreFromBox(answers[i]); });
  return s;
}

async function loadShared(key) {
  try { const r = await window.storage.get(key, true); return r ? JSON.parse(r.value) : null; }
  catch { return null; }
}
async function saveShared(key, data) {
  try { await window.storage.set(key, JSON.stringify(data), true); } catch {}
}

// ── ICONS ──────────────────────────────────────────────────────────────────
const Ico = {
  brand: (
    <svg viewBox="0 0 24 24" style={{width:"100%",height:"100%"}} fill="none" stroke="white" strokeWidth="2">
      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4m0 0h18"/>
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  survey: (
    <svg viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/><path d="M9 12h6M9 16h4"/>
    </svg>
  ),
  dash: (
    <svg viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  sun: (
    <svg viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" style={{width:24,height:24}} fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
};

// ── CSS ────────────────────────────────────────────────────────────────────
const buildCss = (dark) => `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:       ${dark ? "#0F172A" : "#F8FAFC"};
  --bg2:      ${dark ? "#1E293B" : "#FFFFFF"};
  --bg3:      ${dark ? "#0F172A" : "#F1F5F9"};
  --bdr:      ${dark ? "rgba(255,255,255,0.08)" : "#E2E8F0"};
  --text:     ${dark ? "#F1F5F9" : "#0F172A"};
  --text2:    ${dark ? "#94A3B8" : "#475569"};
  --text3:    ${dark ? "#475569" : "#94A3B8"};
  --acc:      #4F46E5;
  --acc2:     #6366F1;
  --inp-bg:   ${dark ? "#0F172A" : "#F8FAFC"};
  --sidebar:  ${dark ? "#0B1120" : "#FFFFFF"};
  --sh:       ${dark ? "0 4px 20px rgba(0,0,0,0.4)" : "0 4px 20px rgba(15,23,42,0.07)"};
  --sh-lg:    ${dark ? "0 20px 60px rgba(0,0,0,0.5)" : "0 20px 60px rgba(15,23,42,0.1)"};
}

body{font-family:'Sora',sans-serif;background:var(--bg);color:var(--text);transition:background .3s,color .3s}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--bdr);border-radius:4px}

/* AUTH */
.auth-wrap{display:flex;align-items:center;justify-content:center;min-height:100vh;padding:20px;background:var(--bg)}
.auth-card{background:var(--bg2);border:1px solid var(--bdr);border-radius:18px;padding:44px 40px;width:100%;max-width:420px;box-shadow:var(--sh-lg)}
.auth-brand{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:28px}
.auth-brand-mark{width:40px;height:40px;background:linear-gradient(135deg,var(--acc),var(--acc2));border-radius:10px;padding:8px;flex-shrink:0}
.auth-brand-name{font-size:20px;font-weight:800;color:var(--text);letter-spacing:-0.5px}
.auth-brand-sub{font-size:12px;color:var(--text3)}
.auth-heading{font-size:17px;font-weight:700;color:var(--text);margin-bottom:20px}
.field{margin-bottom:14px}
.field label{display:block;font-size:11px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.8px;margin-bottom:6px}
.field input{width:100%;padding:11px 14px;background:var(--inp-bg);border:1px solid var(--bdr);border-radius:10px;color:var(--text);font-family:'Sora',sans-serif;font-size:14px;outline:none;transition:border-color .2s,box-shadow .2s}
.field input:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(79,70,229,.1)}
.field input::placeholder{color:var(--text3)}
.btn-primary{width:100%;padding:12px;background:linear-gradient(135deg,var(--acc),var(--acc2));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:transform .15s,box-shadow .15s}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(79,70,229,.3)}
.btn-ghost{width:100%;padding:11px;background:transparent;border:1px solid var(--bdr);border-radius:10px;color:var(--text2);font-family:'Sora',sans-serif;font-size:14px;font-weight:500;cursor:pointer;transition:all .18s;margin-top:10px}
.btn-ghost:hover{border-color:var(--acc);color:var(--acc)}
.auth-err{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:8px;padding:10px 14px;font-size:13px;color:#EF4444;margin-bottom:14px}
.auth-switch{text-align:center;margin-top:16px;font-size:13px;color:var(--text3)}
.auth-switch span{color:var(--acc);cursor:pointer;font-weight:700}
.auth-hint{margin-top:14px;padding:10px 14px;background:${dark?"rgba(79,70,229,.08)":"#EEF2FF"};border-radius:8px;font-size:12px;color:var(--text2)}
.auth-hint code{font-family:'JetBrains Mono',monospace;color:var(--acc);font-size:12px}

/* LAYOUT */
.layout{display:flex;min-height:100vh}
.sidebar{width:200px;flex-shrink:0;background:var(--sidebar);border-right:1px solid var(--bdr);padding:18px 10px;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:20;transition:width .25s ease,padding .25s ease;overflow:hidden}
.sidebar.collapsed{width:56px;padding:18px 6px}
.sidebar.collapsed .nav-lbl,.sidebar.collapsed .sb-logo-text,.sidebar.collapsed .sb-logo-sub,.sidebar.collapsed .user-nm,.sidebar.collapsed .user-rl,.sidebar.collapsed .admin-badge{display:none}
.sidebar.collapsed .nav-item{justify-content:center;padding:9px 0}
.sidebar.collapsed .nav-item span,.sidebar.collapsed .nav-item svg~*{display:none}
.sidebar.collapsed .theme-btn{justify-content:center;padding:9px 0}
.sidebar.collapsed .theme-btn span,.sidebar.collapsed .theme-btn svg~*{display:none}
.sidebar.collapsed .logout-btn{justify-content:center;padding:9px 0}
.sidebar.collapsed .logout-btn svg~*{display:none}
.sidebar.collapsed .user-card{padding:6px;justify-content:center}
.sidebar.collapsed .user-card>div:not(.user-av){display:none}
.sidebar.collapsed .sb-logo{justify-content:center;padding:6px 0}
.sb-toggle{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:6px;border:1px solid var(--bdr);background:var(--bg2);cursor:pointer;color:var(--text2);margin-bottom:10px;align-self:flex-end;flex-shrink:0;transition:all .15s}
.sb-toggle:hover{background:var(--acc);color:#fff;border-color:var(--acc)}
.sidebar.collapsed .sb-toggle{align-self:center}
.sb-logo{display:flex;align-items:center;gap:10px;padding:6px 8px;margin-bottom:26px}
.sb-logo-mark{width:32px;height:32px;background:linear-gradient(135deg,var(--acc),var(--acc2));border-radius:8px;padding:6px;flex-shrink:0}
.sb-logo-text{font-size:14px;font-weight:800;color:var(--text);letter-spacing:-.3px}
.sb-logo-sub{font-size:10px;color:var(--text3)}
.nav-lbl{font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:1px;padding:0 8px;margin-bottom:4px;margin-top:10px}
.nav-item{display:flex;align-items:center;gap:9px;padding:9px 8px;border-radius:8px;cursor:pointer;transition:all .15s;color:var(--text2);font-size:13px;font-weight:500;margin-bottom:2px;border:none;background:transparent;width:100%;text-align:left}
.nav-item:hover{background:${dark?"rgba(79,70,229,.1)":"#EEF2FF"};color:var(--acc)}
.nav-item.active{background:${dark?"rgba(79,70,229,.15)":"#EEF2FF"};color:var(--acc);font-weight:700}
.sb-bottom{margin-top:auto}
.theme-btn{display:flex;align-items:center;gap:9px;padding:9px 8px;border-radius:8px;cursor:pointer;color:var(--text2);font-size:13px;font-weight:500;border:none;background:transparent;width:100%;transition:all .15s;margin-bottom:8px}
.theme-btn:hover{background:${dark?"rgba(255,255,255,.05)":"#F1F5F9"};color:var(--text)}
.user-card{display:flex;align-items:center;gap:9px;padding:10px;background:${dark?"rgba(255,255,255,.03)":"#F8FAFC"};border:1px solid var(--bdr);border-radius:10px}
.user-av{width:30px;height:30px;background:linear-gradient(135deg,var(--acc),var(--acc2));border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0}
.user-nm{font-size:13px;font-weight:700;color:var(--text)}
.user-rl{font-size:10px;color:var(--text3)}
.admin-badge{display:inline-block;background:linear-gradient(135deg,#F59E0B,#D97706);color:#fff;font-size:9px;font-weight:800;padding:2px 6px;border-radius:20px;letter-spacing:.5px;text-transform:uppercase;margin-left:5px;vertical-align:middle}
.logout-btn{display:flex;align-items:center;gap:9px;padding:9px 8px;border-radius:8px;cursor:pointer;color:var(--text3);font-size:13px;margin-top:6px;transition:all .15s;border:none;background:transparent;width:100%}
.logout-btn:hover{background:rgba(239,68,68,.08);color:#EF4444}

.main{padding:36px 40px;flex:1;min-width:0;box-sizing:border-box;transition:margin-left .25s ease}
.pg-hdr{margin-bottom:26px}
.pg-title{font-size:23px;font-weight:800;color:var(--text);letter-spacing:-.6px}
.pg-sub{font-size:13px;color:var(--text2);margin-top:3px}

/* EXIT FLOAT */
.exit-float{position:fixed;top:10px;right:16px;z-index:50;display:flex;align-items:center;gap:6px;padding:7px 14px;background:var(--bg2);border:1px solid var(--bdr);border-radius:8px;color:var(--text3);font-size:12px;font-weight:600;cursor:pointer;font-family:'Sora',sans-serif;box-shadow:0 2px 10px rgba(0,0,0,.07);transition:all .18s}
.exit-float:hover{color:#EF4444;border-color:#EF4444;box-shadow:0 3px 12px rgba(239,68,68,.12)}

/* ASSESSMENT */
.assess-wrap{width:100%;max-width:960px;margin:0 auto}
.prog-meta{display:flex;justify-content:space-between;font-size:12px;color:var(--text3);margin-bottom:6px}
.prog-sticky{position:sticky;top:0;z-index:25;background:var(--bg);padding:12px 0 10px;margin-bottom:12px;border-bottom:1px solid var(--bdr);box-shadow:0 2px 8px rgba(0,0,0,.04)}
.prog-outer{background:var(--bdr);border-radius:100px;height:5px;margin-bottom:0}
.prog-inner{background:linear-gradient(90deg,var(--acc),var(--acc2));height:5px;border-radius:100px;transition:width .4s ease}

.q-card{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;padding:22px 24px;margin-bottom:14px;transition:all .2s;scroll-margin-top:70px;outline:none}
.q-card.answered{border-left:3px solid var(--acc)}
.q-card.active{border:2.5px solid var(--acc);box-shadow:0 8px 30px rgba(79,70,229,.12);transform:scale(1.01)}
.q-card:hover{border-color:${dark?"rgba(79,70,229,.3)":"#C7D2FE"}}
.q-num{font-size:10px;font-weight:700;color:var(--acc);text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;font-family:'JetBrains Mono',monospace}
.q-text{font-size:14px;color:var(--text);line-height:1.65;margin-bottom:18px}

/* ── SCALE: full width 10 boxes ── */
.scale-lbl-row{display:grid;grid-template-columns:3fr 4fr 3fr;margin-bottom:7px;width:100%}
.slbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.slbl.red{color:#EF4444}
.slbl.mid{color:var(--text3);text-align:center}
.slbl.grn{color:#10B981;text-align:right}
.scale-row{display:grid;grid-template-columns:repeat(10,1fr);gap:2px;width:100%}
.sbox{
  aspect-ratio:1;min-width:0;max-height:60px;
  border-radius:8px;border:1.5px solid;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-size:12px;font-weight:700;
  font-family:'JetBrains Mono',monospace;
  transition:all .13s;user-select:none;
}
.sbox.red{border-color:rgba(239,68,68,.3);background:${dark?"rgba(239,68,68,.07)":"#FEF2F2"};color:#EF4444}
.sbox.mid{border-color:${dark?"rgba(100,116,139,.3)":"#CBD5E1"};background:${dark?"rgba(100,116,139,.07)":"#F8FAFC"};color:${dark?"#94A3B8":"#64748B"}}
.sbox.grn{border-color:rgba(16,185,129,.3);background:${dark?"rgba(16,185,129,.07)":"#F0FDF4"};color:#10B981}
.sbox.red.sel{background:#EF4444;border-color:#EF4444;color:#fff;transform:scale(1.1);box-shadow:0 3px 12px rgba(239,68,68,.35)}
.sbox.mid.sel{background:${dark?"#64748B":"#64748B"};border-color:#64748B;color:#fff;transform:scale(1.1);box-shadow:0 3px 12px rgba(100,116,139,.3)}
.sbox.grn.sel{background:#10B981;border-color:#10B981;color:#fff;transform:scale(1.1);box-shadow:0 3px 12px rgba(16,185,129,.35)}
.sbox:hover:not(.sel){transform:scale(1.07);opacity:.82}
.scale-segs{display:grid;grid-template-columns:3fr 4fr 3fr;gap:4px;margin-top:6px;width:100%}
.sseg{height:3px;border-radius:100px}
.sseg.red{background:rgba(239,68,68,.25)}
.sseg.mid{background:${dark?"rgba(100,116,139,.2)":"#E2E8F0"}}
.sseg.grn{background:rgba(16,185,129,.25)}

/* MISSING */
.missing-box{background:${dark?"rgba(239,68,68,.07)":"#FEF2F2"};border:1px solid rgba(239,68,68,.2);border-radius:10px;padding:14px 18px;margin-top:20px}
.missing-title{font-size:12px;font-weight:700;color:#EF4444;margin-bottom:10px}
.missing-nums{display:flex;flex-wrap:wrap;gap:7px}
.miss-chip{width:34px;height:34px;border-radius:8px;background:#EF4444;color:#fff;font-size:12px;font-weight:700;font-family:'JetBrains Mono',monospace;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .13s}
.miss-chip:hover{background:#DC2626;transform:scale(1.1)}

.assess-foot{display:flex;justify-content:space-between;align-items:center;margin-top:24px;padding-top:18px;border-top:1px solid var(--bdr)}
.foot-count{font-size:13px;color:var(--text3)}
.foot-count strong{color:var(--acc)}
.btn-submit{padding:12px 28px;background:linear-gradient(135deg,var(--acc),var(--acc2));border:none;border-radius:10px;color:#fff;font-family:'Sora',sans-serif;font-size:14px;font-weight:700;cursor:pointer;transition:all .18s}
.btn-submit:hover{transform:translateY(-1px);box-shadow:0 8px 20px rgba(79,70,229,.3)}
.btn-submit:disabled{opacity:.45;cursor:not-allowed;transform:none;box-shadow:none}

/* RESULTS */
.res-wrap{width:100%;max-width:960px;margin:0 auto}
.res-hdr{margin-bottom:24px}
.res-title{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-.6px}
.res-sub{font-size:13px;color:var(--text2);margin-top:4px}
.p-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:20px}
.p-card{border-radius:13px;padding:20px;border:1.5px solid;position:relative;overflow:hidden}
.p-card.top::after{content:'Mayor puntaje';position:absolute;top:10px;right:10px;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.4px;padding:2px 7px;border-radius:20px;background:rgba(0,0,0,.1);color:inherit}
.p-ltr{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;opacity:.6;margin-bottom:3px}
.p-name{font-size:16px;font-weight:800;margin-bottom:13px}
.p-bar-o{background:rgba(0,0,0,.1);border-radius:100px;height:5px}
.p-bar-i{border-radius:100px;height:5px;transition:width .8s}
.p-score{font-size:28px;font-weight:800;font-family:'JetBrains Mono',monospace;margin-top:9px}
.p-max{font-size:11px;opacity:.5}
.res-actions{display:flex;gap:9px}
.btn-outline{padding:10px 20px;background:transparent;border:1px solid var(--bdr);border-radius:9px;color:var(--text2);font-family:'Sora',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .15s}
.btn-outline:hover{border-color:var(--acc);color:var(--acc)}

/* USER HOME */
.home-cta{text-align:center;padding:54px 40px;background:var(--bg2);border:1px solid var(--bdr);border-radius:16px}
.home-cta-t{font-size:19px;font-weight:800;color:var(--text);margin-bottom:8px}
.home-cta-s{font-size:13px;color:var(--text2);line-height:1.65;margin-bottom:26px}

/* ADMIN */
.stats-g{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:26px}
.stat-c{background:var(--bg2);border:1px solid var(--bdr);border-radius:13px;padding:18px}
.stat-v{font-size:28px;font-weight:800;color:var(--text);font-family:'JetBrains Mono',monospace;letter-spacing:-1px}
.stat-l{font-size:10px;color:var(--text3);margin-top:3px;text-transform:uppercase;letter-spacing:.7px;font-weight:700}
.stat-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:var(--acc);margin-right:5px;vertical-align:middle;margin-bottom:1px}
.sec-t{font-size:14px;font-weight:700;color:var(--text);margin-bottom:13px;letter-spacing:-.2px}
.avg-g{display:grid;grid-template-columns:repeat(4,1fr);gap:11px;margin-bottom:26px}
.avg-c{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;padding:15px}
.avg-ltr{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px}
.avg-nm{font-size:12px;font-weight:700;color:var(--text);margin-bottom:9px}
.avg-val{font-size:22px;font-weight:800;font-family:'JetBrains Mono',monospace}
.avg-bar-o{background:var(--bg3);border-radius:100px;height:4px;margin-top:7px}
.avg-bar-i{border-radius:100px;height:4px}
.avg-sub{font-size:10px;color:var(--text3);margin-top:4px}

/* TABLE */
.tbl-wrap{background:var(--bg2);border:1px solid var(--bdr);border-radius:13px;overflow-x:auto}
.tbl-head{
  display:grid;
  grid-template-columns:minmax(140px,1.5fr) 110px repeat(4,1fr) 100px 60px;
  padding:11px 18px;
  background:${dark?"rgba(0,0,0,.25)":"#F8FAFC"};
  border-bottom:1px solid var(--bdr);
  gap:8px;
  min-width: 860px;
}
.th{font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;display:flex;align-items:center}
.th.ctr{justify-content:center}
.tbl-row{
  display:grid;
  grid-template-columns:minmax(140px,1.5fr) 110px repeat(4,1fr) 100px 60px;
  padding:12px 18px;
  border-bottom:1px solid ${dark?"rgba(255,255,255,.04)":"#F1F5F9"};
  transition:background .12s;cursor:pointer;align-items:center;
  gap:8px;
  min-width: 860px;
}
.tbl-row:last-child{border-bottom:none}
.tbl-row:hover{background:${dark?"rgba(79,70,229,.05)":"#F8FAFF"}}
.td{font-size:13px;color:var(--text2);display:flex;align-items:center}
.td.bold{font-weight:700;color:var(--text)}
.td.ctr{justify-content:center}
.score-pill{font-size:12px;font-weight:800;padding:3px 10px;border-radius:20px;font-family:'JetBrains Mono',monospace;display:inline-block}
.badge{font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;display:inline-block;white-space:nowrap}
.b-done{background:${dark?"rgba(16,185,129,.13)":"#ECFDF5"};color:#059669}
.b-pend{background:${dark?"rgba(148,163,184,.1)":"#F8FAFC"};color:${dark?"#94A3B8":"#64748B"};border:1px solid var(--bdr)}

/* MODAL */
.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
.modal{background:var(--bg2);border:1px solid var(--bdr);border-radius:16px;padding:26px;width:100%;max-width:640px;max-height:88vh;overflow-y:auto;box-shadow:var(--sh-lg)}
.modal-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}
.modal-title{font-size:17px;font-weight:800;color:var(--text);letter-spacing:-.3px}
.modal-x{background:none;border:none;color:var(--text3);cursor:pointer;font-size:18px;padding:4px;line-height:1;transition:color .15s}
.modal-x:hover{color:var(--text)}
.dp-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:18px}
.dp-c{border-radius:9px;padding:13px;border:1.5px solid}
.dp-ltr{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;opacity:.6;margin-bottom:2px}
.dp-nm{font-size:12px;font-weight:700;margin-bottom:5px}
.dp-sc{font-size:20px;font-weight:800;font-family:'JetBrains Mono',monospace}
.q-list{display:flex;flex-direction:column;gap:6px}
.q-it{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:${dark?"rgba(15,23,42,.5)":"#F8FAFC"};border-radius:7px;gap:10px}
.q-it-txt{font-size:12px;color:var(--text2);flex:1;line-height:1.4}
.q-it-r{display:flex;align-items:center;gap:5px;flex-shrink:0}
.q-box-b{font-size:11px;font-weight:700;font-family:'JetBrains Mono',monospace;color:var(--acc);background:${dark?"rgba(79,70,229,.1)":"#EEF2FF"};padding:2px 6px;border-radius:4px}
.q-sc-b{font-size:11px;font-weight:700;color:#10B981}

.toast{position:fixed;bottom:18px;right:18px;background:var(--bg2);border:1px solid var(--bdr);border-radius:9px;padding:11px 16px;font-size:13px;color:var(--text);box-shadow:var(--sh-lg);z-index:200;animation:su .22s ease}
@keyframes su{from{transform:translateY(12px);opacity:0}to{transform:translateY(0);opacity:1}}
.empty{text-align:center;padding:56px 20px;color:var(--text3)}
.empty-t{font-size:14px;font-weight:600}

/* MOBILE HEADER */
.mob-hdr{display:none;align-items:center;justify-content:space-between;padding:14px 20px;background:var(--bg2);border-bottom:1px solid var(--bdr);position:sticky;top:0;z-index:30}
.mob-menu-btn{background:none;border:none;color:var(--text);cursor:pointer;padding:5px}
.mob-logo{display:flex;align-items:center;gap:8px}
.mob-logo-mark{width:28px;height:28px;background:linear-gradient(135deg,var(--acc),var(--acc2));border-radius:6px;padding:5px}
.mob-logo-text{font-size:14px;font-weight:800}

@media(max-width:900px){
  .mob-hdr{display:flex}
  .sidebar{transform:translateX(-100%);transition:transform .3s ease;box-shadow:20px 0 50px rgba(0,0,0,0.2)}
  .sidebar.open{transform:translateX(0)}
  .main{margin-left:0 !important;padding:24px 20px}
  .layout{flex-direction:column}
  .stats-g{grid-template-columns:1fr 1fr}
  .avg-g{grid-template-columns:1fr 1fr}
  .p-grid{grid-template-columns:1fr 1fr}
  .dp-grid{grid-template-columns:1fr}
  .q-card{padding:16px 18px}
  .auth-card{padding:30px 24px}
  .scale-row{gap:3px}
  .sbox{font-size:11px;border-radius:6px}
  .scale-lbl-row{display:flex;justify-content:space-between}
  .slbl.mid{display:none}
  .home-cta{padding:36px 24px}
  .prog-sticky{padding-right:90px}
  .q-card{scroll-margin-top:65px}
}

@media(max-width:600px){
  .stats-g,.avg-g{grid-template-columns:1fr}
  .p-grid{grid-template-columns:1fr 1fr}
  .pg-title{font-size:20px}
  .q-card{padding:12px 14px;scroll-margin-top:60px}
  .res-actions{flex-direction:column}
  .btn-outline,.btn-submit{width:100%}
  .scale-row{display:grid;grid-template-columns:repeat(5,1fr);grid-template-rows:repeat(2,1fr)}
  .assess-foot{flex-direction:column;gap:12px;align-items:stretch}
  .assess-foot .btn-submit{width:100%}
  .foot-count{text-align:center}
  .prog-sticky{padding-right:70px;padding-top:8px;padding-bottom:7px}
  .prog-meta{font-size:11px}
  .exit-float{padding:5px 10px;font-size:11px;top:8px;right:10px}
}
`;


const BOX_COLORS = ["red","red","red","mid","mid","mid","mid","grn","grn","grn"];

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div className="toast">{msg}</div>;
}

function ScaleRow({ value, onChange }) {
  return (
    <div>
      <div className="scale-lbl-row">
        <span className="slbl red">Para nada se parece a mi</span>
        <span className="slbl mid">Neutral</span>
        <span className="slbl grn">Muy parecido a mi</span>
      </div>
      <div className="scale-row">
        {[1,2,3,4,5,6,7,8,9,10].map((n,i) => (
          <div
            key={n}
            className={`sbox ${BOX_COLORS[i]}${value === n ? " sel" : ""}`}
            onClick={() => onChange(n)}
          >{n}</div>
        ))}
      </div>
      <div className="scale-segs">
        <div className="sseg red"/><div className="sseg mid"/><div className="sseg grn"/>
      </div>
    </div>
  );
}

function AssessmentPage({ user, onComplete }) {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [active, setActive] = useState(0);
  const [saving, setSaving] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    const handleKey = (e) => {
      if (saving) return;
      
      // Teclas 1-9 y 0 (para el 10)
      let val = null;
      if (e.key >= '1' && e.key <= '9') val = parseInt(e.key);
      else if (e.key === '0') val = 10;
      
      if (val !== null) {
        e.preventDefault();
        const n = [...answers];
        n[active] = val;
        setAnswers(n);
        
        // Avanzar a la siguiente pregunta si existe
        if (active < QUESTIONS.length - 1) {
          const next = active + 1;
          setActive(next);
          refs.current[next]?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [active, answers, saving]);

  const answered = answers.filter(a => a != null).length;
  const missing = answers.map((a,i) => a == null ? i : null).filter(x => x !== null);

  const handleSubmit = async () => {
    if (answered < QUESTIONS.length || saving) return;
    setSaving(true);
    const all = await loadShared("all-users") || {};
    if (!all[user.username]) all[user.username] = { username: user.username, role: "user" };
    all[user.username].answers = answers;
    all[user.username].completedAt = new Date().toISOString();
    all[user.username].scores = calcResults(answers);
    await saveShared("all-users", all);
    onComplete();
  };

  return (
    <div className="assess-wrap">
      <div style={{background:"var(--bg2)",border:"1px solid var(--bdr)",borderRadius:12,padding:"16px 22px",marginBottom:22,display:"flex",alignItems:"center",gap:14}}>
        <div style={{width:40,height:40,background:"linear-gradient(135deg,var(--acc),#6366F1)",borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:800,color:"#fff",flexShrink:0}}>
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <div style={{fontSize:15,fontWeight:700,color:"var(--text)"}}>{user?.name}</div>
          <div style={{fontSize:11,color:"var(--text3)",fontFamily:"'JetBrains Mono',monospace"}}>Identificación: {user?.username}</div>
        </div>

      </div>
      <div className="prog-sticky">
        <div className="prog-meta">
          <span>{answered} de {QUESTIONS.length} respondidas</span>
          <span>{Math.round((answered/QUESTIONS.length)*100)}%</span>
        </div>
        <div className="prog-outer"><div className="prog-inner" style={{width:`${(answered/QUESTIONS.length)*100}%`}}/></div>
      </div>

      {QUESTIONS.map((q,i) => (
        <div
          key={q.id}
          className={`q-card${answers[i]!=null?" answered":""}${active===i?" active":""}`}
          ref={el => refs.current[i]=el}
          onClick={() => setActive(i)}
        >
          <div className="q-num">Pregunta {q.id} / {QUESTIONS.length}</div>
          <div className="q-text">{q.text}</div>
          <ScaleRow
            value={answers[i]}
            onChange={v => { 
              const n=[...answers]; n[i]=v; setAnswers(n); 
              setActive(i);
            }}
          />
        </div>
      ))}

      {missing.length > 0 && (
        <div className="missing-box">
          <div className="missing-title">Preguntas sin responder — haz clic para ir a cada una:</div>
          <div className="missing-nums">
            {missing.map(idx => (
              <div key={idx} className="miss-chip"
                onClick={() => refs.current[idx]?.scrollIntoView({behavior:"smooth",block:"center"})}>
                {idx+1}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="assess-foot">
        <div className="foot-count"><strong>{answered}</strong> de {QUESTIONS.length} respondidas</div>
        <button className="btn-submit" onClick={handleSubmit} disabled={answered < QUESTIONS.length || saving}>
          {saving ? "Guardando..." : "Enviar evaluacion"}
        </button>
      </div>
    </div>
  );
}

// Renderizado de la página principal del usuario
function UserHome({ user, onStartAssess }) {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    loadShared("all-users").then(all => {
      if (all?.[user.username]?.scores) setScores(all[user.username].scores);
      setLoading(false);
    });
  }, []);
  if (loading) return <div className="empty"><div className="empty-t">Cargando...</div></div>;
  return (
    <div style={{width:"100%"}}>
      {!scores && (
        <div className="pg-hdr">
          <div className="pg-title">Bienvenido/a, {user.name || user.username}</div>
          <div className="pg-sub">Evaluacion de perfil profesional en proyectos de software</div>
        </div>
      )}
      {!scores ? (
        <div className="home-cta">
          <div className="home-cta-t">No has completado la evaluación</div>
          <div className="home-cta-s">El cuestionario contiene {QUESTIONS.length} afirmaciones.<br/>Para cada una indica en una escala del 1 al 10 qué tan identificado/a te sientes.</div>
          <button className="btn-submit" onClick={onStartAssess}>Comenzar evaluación</button>
        </div>
      ) : (
        <div className="home-cta">
          <div className="home-cta-t">¡Evaluación completada!</div>
          <div className="home-cta-s">
            Gracias por completar el cuestionario. <br/>
            Tus respuestas han sido enviadas exitosamente. Los resultados serán revisados por el administrador.
          </div>
          <button className="btn-outline" onClick={onStartAssess}>Volver a realizar la evaluación</button>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ view = "resumen" }) {
  const [users, setUsers] = useState({});
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedCount, setSeedCount] = useState(50);
  const [confirmClear, setConfirmClear] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // {key, user}

  useEffect(() => { loadShared("all-users").then(d => { setUsers(d||{}); setLoading(false); }); }, []);

  const handleSeed = async () => {
    setSeeding(true);
    const existing = await loadShared("all-users") || {};
    const baseNames = ["Juan", "Maria", "Carlos", "Ana", "Luis", "Elena", "Diego", "Sofia", "Andres", "Lucia"];
    const baseLast = ["Gomez", "Perez", "Rodriguez", "Lopez", "Martinez", "Garcia", "Sanchez", "Ramirez"];
    
    const usedCedulas = new Set(Object.values(existing).map(u => u.username));
    const genCedula = () => {
      const len = Math.floor(Math.random() * 4) + 7;
      const first = Math.floor(Math.random() * 9) + 1;
      const rest = Array.from({length: len - 1}, () => Math.floor(Math.random() * 10)).join('');
      return `${first}${rest}`;
    };
    const total = Math.max(1, Math.min(2000, Number(seedCount) || 50));
    let count = 0;
    let idx = Date.now();
    while (count < total) {
      const uname = `EJE-${idx++}`;
      let cedula = genCedula();
      while (usedCedulas.has(cedula)) cedula = genCedula();
      usedCedulas.add(cedula);
      const nom = `${baseNames[Math.floor(Math.random()*baseNames.length)]} ${baseLast[Math.floor(Math.random()*baseLast.length)]}`;
      const ans = Array.from({length: QUESTIONS.length}, () => Math.floor(Math.random() * 10) + 1);
      existing[uname] = {
        name: nom, 
        username: cedula,
        role: "user",
        answers: ans,
        completedAt: new Date(Date.now() - Math.random() * 5000000000).toISOString(),
        scores: calcResults(ans)
      };
      count++;
    }
    await saveShared("all-users", existing);
    setUsers({...existing});
    setSeeding(false);
  };

  const handleClear = () => {
    const exCount = Object.keys(users).filter(k => k.startsWith("EJE-") || k.startsWith("ejemplo_")).length;
    setConfirmClear({ count: exCount });
  };

  const doClear = async () => {
    setConfirmClear(null);
    setSeeding(true);
    const existing = await loadShared("all-users") || {};
    const filtered = {};
    Object.entries(existing).forEach(([k, v]) => {
      if (!k.startsWith("EJE-") && !k.startsWith("ejemplo_")) filtered[k] = v;
    });
    await saveShared("all-users", filtered);
    setUsers(filtered);
    setSeeding(false);
  };

  const doDeleteUser = async () => {
    if (!confirmDelete) return;
    const existing = await loadShared("all-users") || {};
    delete existing[confirmDelete.key];
    await saveShared("all-users", existing);
    setUsers({...existing});
    setSel(null);
    setConfirmDelete(null);
  };

  const allEntries = Object.entries(users);
  const all = Object.values(users);
  const done = all.filter(u => u.answers);
  const avg = { A:0,B:0,C:0,D:0 };
  if (done.length>0) {
    done.forEach(u => Object.entries(u.scores||{}).forEach(([k,v]) => { avg[k]+=v; }));
    Object.keys(avg).forEach(k => { avg[k]=Math.round(avg[k]/done.length); });
  }

  if (loading) return <div className="empty"><div className="empty-t">Cargando datos...</div></div>;

  return (
    <div>
      {confirmClear && (
        <div className="modal-ov">
          <div className="modal" style={{maxWidth:400}}>
            <div className="modal-hdr">
              <div className="modal-title">Confirmar eliminación</div>
              <button className="modal-x" onClick={() => setConfirmClear(null)}>✕</button>
            </div>
            <div style={{fontSize:14,color:"var(--text2)",lineHeight:1.6,marginBottom:24}}>
              ¿Estás seguro de que quieres borrar los <strong style={{color:"var(--text)"}}>{confirmClear.count} registros de ejemplo</strong>? Esta acción no se puede deshacer.
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn-outline" onClick={() => setConfirmClear(null)}>Cancelar</button>
              <button className="btn-submit" style={{background:"#EF4444",borderColor:"#EF4444"}} onClick={doClear}>Sí, borrar</button>
            </div>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div className="modal-ov" style={{zIndex:110}}>
          <div className="modal" style={{maxWidth:400}}>
            <div className="modal-hdr">
              <div className="modal-title">Eliminar usuario</div>
              <button className="modal-x" onClick={() => setConfirmDelete(null)}>✕</button>
            </div>
            <div style={{fontSize:14,color:"var(--text2)",lineHeight:1.6,marginBottom:24}}>
              ¿Estás seguro de que quieres eliminar a <strong style={{color:"var(--text)"}}>{confirmDelete.user.name || confirmDelete.user.username}</strong>? Se borrarán todos sus datos y respuestas.
            </div>
            <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
              <button className="btn-outline" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn-submit" style={{background:"#EF4444",borderColor:"#EF4444"}} onClick={doDeleteUser}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
      {sel && (
        <div className="modal-ov" onClick={e => e.target===e.currentTarget && setSel(null)}>
          <div className="modal">
            <div className="modal-hdr">
              <div className="modal-title">Detalle: {sel.name || sel.username}</div>
              <button className="modal-x" onClick={() => setSel(null)}>x</button>
            </div>
            {!sel.answers
              ? <div className="empty"><div className="empty-t">Usuario sin evaluacion completada</div></div>
              : (() => {
                  const sc=sel.scores||{};
                  const maxV=Math.max(...Object.values(sc));
                  const topK=Object.keys(sc).filter(k=>sc[k]===maxV);
                  const hasTie=topK.length>1;
                  return <>
                  {hasTie && (
                    <div style={{background:"rgba(245,158,11,.1)",border:"1px solid rgba(245,158,11,.3)",borderRadius:8,padding:"8px 14px",marginBottom:14,fontSize:12,fontWeight:600,color:"#D97706"}}>
                      ⚠ Empate detectado entre: {topK.map(k=>PROFILES[k].label).join(" y ")} ({maxV} pts cada uno)
                    </div>
                  )}
                  <div className="dp-grid">
                    {Object.entries(PROFILES).map(([k,p]) => {
                      const isTop=topK.includes(k);
                      return (
                      <div key={k} className="dp-c" style={{
                        background:isTop?p.color:p.bg,
                        borderColor:isTop?p.color:p.border,
                        color:isTop?"#fff":p.color,
                        transform:isTop?"scale(1.03)":"none",
                        boxShadow:isTop?`0 4px 16px ${p.color}44`:"none",
                        transition:"all .2s"
                      }}>
                        <div className="dp-ltr" style={{opacity:isTop?0.85:0.6}}>Perfil {k}{isTop?(hasTie?" — Empate":" — Mayor puntaje"):""}</div>
                        <div className="dp-nm">{p.label}</div>
                        <div className="dp-sc">{sel.scores?.[k]||0} pts</div>
                      </div>
                      );
                    })}
                  </div>
                  <div className="sec-t" style={{marginBottom:9}}>Respuestas por pregunta</div>
                  <div className="q-list">
                    {QUESTIONS.map((q,i) => {
                      const box=sel.answers[i];
                      const sc=box!=null?scoreFromBox(box):null;
                      return (
                        <div className="q-it" key={q.id}>
                          <div className="q-it-txt">{q.id}. {q.text}</div>
                          <div className="q-it-r">
                            {box!=null
                              ? <><span className="q-box-b">Casilla {box}</span><span className="q-sc-b">{sc}pt</span></>
                              : <span style={{fontSize:11,color:"var(--text3)"}}>Sin respuesta</span>
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
                })()
            }
          </div>
        </div>
      )}

      <div className="pg-hdr" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div className="pg-title">{view==="usuarios" ? "Usuarios y resultados" : "Dashboard Administrador"}</div>
          <div className="pg-sub">{view==="usuarios" ? "Listado de evaluados y sus resultados" : "Resumen general de evaluaciones y resultados"}</div>
        </div>
        {view==="usuarios" && (
        <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
          {!Object.keys(users).some(k => k.startsWith("EJE-") || k.startsWith("ejemplo_")) ? (
            <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
              <input
                type="number"
                min="1"
                max="2000"
                value={seedCount}
                onChange={e => setSeedCount(e.target.value)}
                disabled={seeding}
                style={{width:70,padding:"5px 8px",borderRadius:6,border:"1px solid var(--bdr)",fontSize:13,textAlign:"center",background:"var(--bg2)",color:"var(--text1)"}}
              />
              <button className="btn-outline" onClick={handleSeed} disabled={seeding}>
                {seeding ? "Generando..." : "Generar datos de ejemplo"}
              </button>
            </div>
          ) : (
            <button className="btn-outline" style={{borderColor:"#EF4444",color:"#EF4444"}} onClick={handleClear} disabled={seeding}>
              {seeding ? "Limpiando..." : "Limpiar datos de ejemplo"}
            </button>
          )}
        </div>
        )}
      </div>

      {view === "resumen" && <>
      <div className="stats-g">
        {[
          {v:all.length, l:"Usuarios registrados"},
          {v:done.length, l:"Evaluaciones completadas"},
          {v:all.length-done.length, l:"Evaluaciones pendientes"},
          {v:all.length>0?`${Math.round((done.length/all.length)*100)}%`:"0%", l:"Tasa de completitud"},
        ].map((s,i) => (
          <div className="stat-c" key={i}>
            <div className="stat-v">{s.v}</div>
            <div className="stat-l"><span className="stat-dot"/>{s.l}</div>
          </div>
        ))}
      </div>

      <div className="sec-t">Promedio por perfil ({done.length} evaluaciones)</div>
      <div className="avg-g">
        {Object.entries(PROFILES).map(([k,p]) => {
          const pct=(avg[k]/MAX_SCORES[k])*100;
          return (
            <div className="avg-c" key={k}>
              <div className="avg-ltr" style={{color:p.color}}>Perfil {k}</div>
              <div className="avg-nm">{p.label}</div>
              <div className="avg-val" style={{color:p.color}}>{avg[k]}</div>
              <div className="avg-bar-o"><div className="avg-bar-i" style={{width:`${pct}%`,background:p.color}}/></div>
              <div className="avg-sub">max {MAX_SCORES[k]} pts</div>
            </div>
          );
        })}
      </div>
      </>}

      {view === "usuarios" && <>
      <div className="sec-t">Usuarios y resultados</div>
      {all.length===0
        ? <div className="empty"><div className="empty-t">No hay usuarios registrados</div></div>
        : (
          <div className="tbl-wrap">
            <div className="tbl-head">
              <span className="th">Nombre / Identificación</span>
              <span className="th ctr">Estado</span>
              <span className="th ctr">Clarificador</span>
              <span className="th ctr">Ideador</span>
              <span className="th ctr">Desarrollador</span>
              <span className="th ctr">Implementador</span>
              <span className="th ctr">Completado</span>
              <span className="th ctr">Eliminar</span>
            </div>
            {allEntries.map(([key, u]) => {
              const s=u.scores||{};
              const maxVal=u.scores?Math.max(...Object.values(s)):0;
              const topKeys=u.scores?Object.keys(s).filter(k=>s[k]===maxVal):[];
              const isTied=topKeys.length>1;
              return (
                <div className="tbl-row" key={u.username} onClick={() => setSel(u)}>
                  <span className="td bold">
                    <div>
                      <div style={{fontSize:13}}>{u.name || "Sin nombre"}</div>
                      <div style={{fontSize:10, color:"var(--text3)", fontWeight:400}}>{u.username}</div>
                    </div>
                  </span>
                  <span className="td ctr">
                    <span className={`badge ${u.answers?"b-done":"b-pend"}`}>{u.answers?"Completado":"Pendiente"}</span>
                  </span>
                  {["A","B","C","D"].map(k => {
                    const isTop=topKeys.includes(k);
                    return (
                    <span className="td ctr" key={k}>
                      {s[k]!=null
                        ? <span className="score-pill" style={{
                            background:isTop?PROFILES[k].color:PROFILES[k].bg,
                            color:isTop?"#fff":PROFILES[k].color,
                            border:`1px solid ${PROFILES[k].border}`,
                            fontWeight:isTop?800:700,
                            boxShadow:isTop?`0 2px 8px ${PROFILES[k].color}44`:'none'
                          }}>
                            {s[k]}{isTop&&isTied?" ≡":isTop?" ★":""}
                          </span>
                        : <span style={{color:"var(--text3)"}}>—</span>
                      }
                    </span>
                    );
                  })}
                  <span className="td ctr" style={{fontSize:11,color:"var(--text3)"}}>
                    {u.completedAt?new Date(u.completedAt).toLocaleDateString("es-CO"):"—"}
                  </span>
                  <span className="td ctr">
                    <button
                      onClick={e => { e.stopPropagation(); setConfirmDelete({key, user: u}); }}
                      style={{background:"none",border:"none",cursor:"pointer",color:"var(--text3)",padding:4,borderRadius:6,transition:"all .15s"}}
                      onMouseEnter={e => { e.currentTarget.style.color="#EF4444"; e.currentTarget.style.background="rgba(239,68,68,.08)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color="var(--text3)"; e.currentTarget.style.background="none"; }}
                      title="Eliminar usuario"
                    >
                      <svg viewBox="0 0 24 24" style={{width:15,height:15}} fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </span>
                </div>
              );
            })}
          </div>
        )
      }
      </>}
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login");
  const [view, setView] = useState("home");
  const [login, setLogin] = useState({ name:"", code:"" });
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [sideCollapsed, setSideCollapsed] = useState(true);
  const [adminView, setAdminView] = useState("resumen");

  const doLogin = async () => {
    if (!login.name || !login.code) { 
      setErr("Por favor ingresa tu nombre e identificación."); 
      return; 
    }

    // Admin Access
    if (login.name.toLowerCase() === "admin" && login.code === "admin123") {
      setUser({ username: "admin", name: "Administrador", role: "admin" });
      setScreen("app");
      setErr("");
      return;
    }

    const all = await loadShared("all-users") || {};
    const existing = all[login.code];

    if (existing) {
      // User exists, just log in
      setUser({ username: login.code, name: existing.name, role: "user" });
    } else {
      // Auto-register new user
      const newUser = { 
        name: login.name, 
        username: login.code, // Utilizar código como username único
        role: "user" 
      };
      all[login.code] = newUser;
      await saveShared("all-users", all);
      setUser({ username: login.code, name: login.name, role: "user" });
      setToast("Bienvenido, tu perfil ha sido creado");
    }

    setScreen("app");
    setErr("");
  };

  const doLogout = () => { 
    setUser(null); 
    setScreen("login"); 
    setErr(""); 
    setLogin({ name: "", code: "" }); 
    setView("home"); 
  };

  const isAdmin = user?.role==="admin";
  const navItems = isAdmin
    ? [{icon:Ico.dash,label:"Dashboard",view:"home"}]
    : [{icon:Ico.home,label:"Inicio",view:"home"},{icon:Ico.survey,label:"Evaluacion",view:"assess"}];

  return (
    <>
      <style>{buildCss(false)}</style>
      <div className="app">
        {screen==="login" ? (
          <div className="auth-wrap">
            <div className="auth-card">
              {err && <div className="auth-err">{err}</div>}
              {!adminMode ? (
                <>
                  <div className="auth-heading">Responder Encuesta</div>
                  <div className="pg-sub" style={{marginBottom:18,fontSize:13,color:"var(--text2)",lineHeight:1.6}}>
                    Ingresa tu nombre e identificación para acceder al cuestionario de perfil profesional.
                  </div>
                  <div className="field">
                    <label>Nombre Completo</label>
                    <input 
                      placeholder="Ej: Juan Pérez" 
                      value={login.name}
                      onChange={e => setLogin({ ...login, name: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Identificación</label>
                    <input 
                      placeholder="Tu número de identificación" 
                      value={login.code}
                      onChange={e => setLogin({ ...login, code: e.target.value })}
                      onKeyDown={e => e.key === "Enter" && doLogin()} 
                    />
                  </div>
                  <button className="btn-primary" onClick={doLogin}>Comenzar encuesta</button>
                  <div style={{textAlign:"center",marginTop:20}}>
                    <span 
                      onClick={() => { setAdminMode(true); setErr(""); setLogin({name:"",code:""}); }}
                      style={{fontSize:11,color:"var(--text3)",cursor:"pointer",textDecoration:"underline"}}>
                      Acceso administrador
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="auth-heading">Acceso Administrador</div>
                  <div className="field">
                    <label>Nombre</label>
                    <input 
                      placeholder="Nombre de administrador" 
                      value={login.name}
                      onChange={e => setLogin({ ...login, name: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <label>Clave de acceso</label>
                    <input 
                      type="password"
                      placeholder="Clave secreta" 
                      value={login.code}
                      onChange={e => setLogin({ ...login, code: e.target.value })}
                      onKeyDown={e => e.key === "Enter" && doLogin()} 
                    />
                  </div>
                  <button className="btn-primary" onClick={doLogin}>Ingresar</button>
                  <button className="btn-ghost" onClick={() => { setAdminMode(false); setErr(""); setLogin({name:"",code:""}); }}>Volver</button>
                </>
              )}
            </div>
          </div>
        ) : screen==="done" ? null : isAdmin ? (
          <div className="layout">
            <header className="mob-hdr">
              <div className="mob-logo"/>
              <button className="mob-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
                {Ico.menu}
              </button>
            </header>
            <div className={`sidebar${menuOpen ? " open" : ""}${sideCollapsed ? " collapsed" : ""}`}>
              <button className="sb-toggle" onClick={() => setSideCollapsed(!sideCollapsed)} title={sideCollapsed ? "Expandir" : "Contraer"}>
                <svg viewBox="0 0 24 24" style={{width:16,height:16}} fill="none" stroke="currentColor" strokeWidth="2">
                  {sideCollapsed
                    ? <polyline points="9 18 15 12 9 6"/>
                    : <polyline points="15 18 9 12 15 6"/>
                  }
                </svg>
              </button>
              <div className="nav-lbl">Menu</div>
              <button className={`nav-item${adminView==="resumen"?" active":""}`} onClick={() => setAdminView("resumen")}>{Ico.dash}<span>Dashboard</span></button>
              <button className={`nav-item${adminView==="usuarios"?" active":""}`} onClick={() => setAdminView("usuarios")}>
                <svg viewBox="0 0 24 24" style={{width:16,height:16,flexShrink:0}} fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                <span>Usuarios</span>
              </button>
              <div className="sb-bottom">
                <div className="user-card">
                  <div className="user-av">A</div>
                  <div>
                    <div className="user-nm">Administrador<span className="admin-badge">Admin</span></div>
                    <div className="user-rl">Administrador</div>
                  </div>
                </div>
                <button className="logout-btn" onClick={doLogout}>{Ico.logout}<span> Cerrar sesion</span></button>
              </div>
            </div>
            <div className="main" style={{marginLeft: sideCollapsed ? 56 : 200}}><AdminDashboard view={adminView}/></div>
          </div>
        ) : (
          /* Layout limpio para evaluados — sin sidebar */
          <div style={{minHeight:"100vh",background:"var(--bg)",boxSizing:"border-box"}}>
            <button
              onClick={doLogout}
              className="exit-float"
            >{Ico.logout} Salir</button>
            <div style={{maxWidth:780,margin:"0 auto",padding:"32px 20px"}}>
              <AssessmentPage
                user={user}
                onComplete={() => {
                  setScreen("done");
                }}
              />
            </div>
          </div>
        )}
        {/* Pantalla de encuesta completada para evaluados */}
        {screen==="done" && (
          <div style={{minHeight:"100vh",background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div className="auth-card" style={{textAlign:"center"}}>
              <div style={{fontSize:48,marginBottom:12}}>✅</div>
              <div style={{fontSize:20,fontWeight:800,color:"var(--text)",marginBottom:8}}>¡Encuesta enviada!</div>
              <div style={{fontSize:14,color:"var(--text2)",lineHeight:1.65,marginBottom:24}}>
                Gracias, <strong>{user?.name}</strong>.<br/>
                Tus respuestas han sido registradas correctamente.<br/>
                Los resultados serán revisados por el administrador.
              </div>
              <button className="btn-outline" onClick={() => { setScreen("app"); }}>Responder de nuevo</button>
              <button className="logout-btn" style={{marginTop:10,justifyContent:"center"}} onClick={doLogout}>{Ico.logout} Salir</button>
            </div>
          </div>
        )}
        {toast && <Toast msg={toast} onDone={()=>setToast("")}/>}
      </div>
    </>
  );
}

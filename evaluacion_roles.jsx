import { useState, useEffect, useRef } from "react";

const QUESTIONS = [
  { id: 1,  text: "Generalmente no me acerco a los problemas en forma creativa", type: "D" },
  { id: 2,  text: "Me gusta probar y luego revisar mis ideas antes de generar la solucion o el producto final", type: "C" },
  { id: 3,  text: "Me gusta tomarme el tiempo para clarificar la naturaleza exacta del problema", type: "A" },
  { id: 4,  text: "Disfruto tomar los pasos necesarios para poner mis ideas en accion", type: "D" },
  { id: 5,  text: "Me gusta separar un problema amplio en partes para examinarlo desde todos los angulos", type: "C" },
  { id: 6,  text: "Tengo dificultad en tener ideas inusuales para resolver un problema", type: "B" },
  { id: 7,  text: "Me gusta identificar los hechos mas relevantes relativos al problema", type: "A" },
  { id: 8,  text: "No tengo el temperamento para tratar de aislar las causas especificas de un problema", type: "A" },
  { id: 9,  text: "Disfruto en generar formas unicas de mirar un problema", type: "B" },
  { id: 10, text: "Me gusta generar todos los pros y contras de una solucion potencial", type: "C" },
  { id: 11, text: "Antes de implementar una solucion me gusta separarla en pasos", type: "C" },
  { id: 12, text: "Transformar ideas en accion no es lo que mas disfruto", type: "D" },
  { id: 13, text: "Me gusta superar el criterio que pueda usarse para identificar la mejor opcion o solucion", type: "C" },
  { id: 14, text: "Disfruto de pasar el tiempo profundizando el analisis inicial del problema", type: "B" },
  { id: 15, text: "Por naturaleza no paso mucho tiempo emocionandome en definir el problema exacto a resolver", type: "A" },
  { id: 16, text: "Me gusta entender una situacion al mirar el panorama general", type: "B" },
  { id: 17, text: "Disfruto de trabajar en problemas mal definidos y novedosos", type: "B" },
  { id: 18, text: "Cuando trabajo en un problema, me gusta encontrar la mejor forma de enunciarlo", type: "A" },
  { id: 19, text: "Disfruto en hacer que las cosas se concreten", type: "D" },
  { id: 20, text: "Me gusta enfocarme en enunciar un problema en una forma precisa", type: "A" },
  { id: 21, text: "Disfruto de utilizar mi imaginacion para producir muchas ideas", type: "B" },
  { id: 22, text: "Me gusta enfocarme en la informacion clave de una situacion desafiante", type: "A" },
  { id: 23, text: "Disfruto de tomarme el tiempo para perfeccionar una idea", type: "C" },
  { id: 24, text: "Me resulta dificil implementar mis ideas", type: "D" },
  { id: 25, text: "Disfruto en transformar ideas en bruto en soluciones concretas", type: "D" },
  { id: 26, text: "No paso el tiempo en todas las cosas que necesito hacer para implementar una idea", type: "D" },
  { id: 27, text: "Realmente disfruto de implementar una idea", type: "D" },
  { id: 28, text: "Antes de avanzar me gusta tener una clara comprension del problema", type: "A" },
  { id: 29, text: "Me gusta trabajar con ideas unicas", type: "B" },
  { id: 30, text: "Disfruto de poner mis ideas en accion", type: "D" },
  { id: 31, text: "Me gusta explorar las fortalezas y debilidades de una solucion potencial", type: "C" },
  { id: 32, text: "Disfruto de reunir informacion para identificar el origen de un problema en particular", type: "A" },
  { id: 33, text: "Disfruto el analisis y el esfuerzo que lleva transformar un concepto preliminar en una idea factible", type: "C" },
  { id: 34, text: "Mi tendencia natural no es generar muchas ideas para los problemas", type: "B" },
  { id: 35, text: "Disfruto de usar metaforas o analogias para generar nuevas ideas para los problemas", type: "B" },
  { id: 36, text: "Encuentro que tengo poca paciencia para el esfuerzo que lleva pulir o refinar una idea", type: "C" },
  { id: 37, text: "Tiendo a buscar una solucion rapida y luego implementarla", type: "D" },
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
.sidebar{width:248px;flex-shrink:0;background:var(--sidebar);border-right:1px solid var(--bdr);padding:22px 14px;display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:20}
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

.main{margin-left:248px;padding:36px 40px;flex:1}
.pg-hdr{margin-bottom:26px}
.pg-title{font-size:23px;font-weight:800;color:var(--text);letter-spacing:-.6px}
.pg-sub{font-size:13px;color:var(--text2);margin-top:3px}

/* ASSESSMENT */
.assess-wrap{max-width:760px}
.prog-meta{display:flex;justify-content:space-between;font-size:12px;color:var(--text3);margin-bottom:6px}
.prog-outer{background:var(--bdr);border-radius:100px;height:4px;margin-bottom:26px}
.prog-inner{background:linear-gradient(90deg,var(--acc),var(--acc2));height:4px;border-radius:100px;transition:width .4s ease}

.q-card{background:var(--bg2);border:1px solid var(--bdr);border-radius:12px;padding:22px 24px;margin-bottom:14px;transition:border-color .2s;scroll-margin-top:16px}
.q-card.answered{border-left:3px solid var(--acc)}
.q-card:hover{border-color:${dark?"rgba(79,70,229,.3)":"#C7D2FE"}}
.q-num{font-size:10px;font-weight:700;color:var(--acc);text-transform:uppercase;letter-spacing:1px;margin-bottom:7px;font-family:'JetBrains Mono',monospace}
.q-text{font-size:14px;color:var(--text);line-height:1.65;margin-bottom:18px}

/* ── SCALE: full width 10 boxes ── */
.scale-lbl-row{display:grid;grid-template-columns:3fr 4fr 3fr;margin-bottom:7px}
.slbl{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
.slbl.red{color:#EF4444}
.slbl.mid{color:var(--text3);text-align:center}
.slbl.grn{color:#10B981;text-align:right}
.scale-row{display:grid;grid-template-columns:repeat(10,1fr);gap:5px;width:100%}
.sbox{
  aspect-ratio:1;min-width:0;
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
.scale-segs{display:grid;grid-template-columns:3fr 4fr 3fr;gap:4px;margin-top:6px}
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
.res-wrap{max-width:660px}
.res-hdr{margin-bottom:24px}
.res-title{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-.6px}
.res-sub{font-size:13px;color:var(--text2);margin-top:4px}
.p-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin-bottom:20px}
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
.tbl-wrap{background:var(--bg2);border:1px solid var(--bdr);border-radius:13px;overflow:hidden}
.tbl-head{
  display:grid;
  grid-template-columns:minmax(120px,1.5fr) 110px repeat(4,1fr) 100px;
  padding:11px 18px;
  background:${dark?"rgba(0,0,0,.25)":"#F8FAFC"};
  border-bottom:1px solid var(--bdr);
  gap:8px;
}
.th{font-size:10px;font-weight:800;color:var(--text3);text-transform:uppercase;letter-spacing:.8px;display:flex;align-items:center}
.th.ctr{justify-content:center}
.tbl-row{
  display:grid;
  grid-template-columns:minmax(120px,1.5fr) 110px repeat(4,1fr) 100px;
  padding:12px 18px;
  border-bottom:1px solid ${dark?"rgba(255,255,255,.04)":"#F1F5F9"};
  transition:background .12s;cursor:pointer;align-items:center;
  gap:8px;
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

@media(max-width:900px){
  .sidebar{display:none}
  .main{margin-left:0;padding:18px 14px}
  .stats-g{grid-template-columns:1fr 1fr}
  .avg-g{grid-template-columns:1fr 1fr}
  .p-grid{grid-template-columns:1fr}
  .dp-grid{grid-template-columns:1fr}
  .tbl-head,.tbl-row{grid-template-columns:1fr 90px 70px;gap:4px}
  .th:nth-child(n+4),.td:nth-child(n+4){display:none}
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
  const [answers, setAnswers] = useState(Array(37).fill(null));
  const [saving, setSaving] = useState(false);
  const refs = useRef([]);

  const answered = answers.filter(a => a != null).length;
  const missing = answers.map((a,i) => a == null ? i : null).filter(x => x !== null);

  const handleSubmit = async () => {
    if (answered < 37 || saving) return;
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
      <div className="pg-hdr">
        <div className="pg-title">Cuestionario de Perfil</div>
        <div className="pg-sub">Indica que tan identificado te sientes con cada afirmacion (1 = para nada, 10 = totalmente)</div>
      </div>
      <div className="prog-meta">
        <span>{answered} de 37 respondidas</span>
        <span>{Math.round((answered/37)*100)}%</span>
      </div>
      <div className="prog-outer"><div className="prog-inner" style={{width:`${(answered/37)*100}%`}}/></div>

      {QUESTIONS.map((q,i) => (
        <div
          key={q.id}
          className={`q-card${answers[i]!=null?" answered":""}`}
          ref={el => refs.current[i]=el}
        >
          <div className="q-num">Pregunta {q.id} / 37</div>
          <div className="q-text">{q.text}</div>
          <ScaleRow
            value={answers[i]}
            onChange={v => { const n=[...answers]; n[i]=v; setAnswers(n); }}
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
        <div className="foot-count"><strong>{answered}</strong> de 37 respondidas</div>
        <button className="btn-submit" onClick={handleSubmit} disabled={answered<37||saving}>
          {saving ? "Guardando..." : "Enviar evaluacion"}
        </button>
      </div>
    </div>
  );
}

function ResultsPage({ scores, username, onRetake }) {
  const maxVal = Math.max(...Object.values(scores));
  return (
    <div className="res-wrap">
      <div className="res-hdr">
        <div className="res-title">Resultados de {username}</div>
        <div className="res-sub">Distribucion de perfil profesional en proyectos de software</div>
      </div>
      <div className="p-grid">
        {Object.entries(PROFILES).map(([k,p]) => {
          const s = scores[k]||0;
          const pct = (s/MAX_SCORES[k])*100;
          const isTop = s===maxVal && s>0;
          return (
            <div key={k} className={`p-card${isTop?" top":""}`}
              style={{background:p.bg,borderColor:p.border,color:p.color}}>
              <div className="p-ltr">Perfil {k}</div>
              <div className="p-name">{p.label}</div>
              <div className="p-bar-o"><div className="p-bar-i" style={{width:`${pct}%`,background:p.color}}/></div>
              <div className="p-score">{s}</div>
              <div className="p-max">de {MAX_SCORES[k]} puntos maximos</div>
            </div>
          );
        })}
      </div>
      <div className="res-actions">
        <button className="btn-outline" onClick={onRetake}>Volver a responder</button>
      </div>
    </div>
  );
}

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
    <div style={{maxWidth:660}}>
      <div className="pg-hdr">
        <div className="pg-title">Bienvenido/a, {user.username}</div>
        <div className="pg-sub">Evaluacion de perfil profesional en proyectos de software</div>
      </div>
      {!scores ? (
        <div className="home-cta">
          <div className="home-cta-t">No has completado la evaluacion</div>
          <div className="home-cta-s">El cuestionario contiene 37 afirmaciones.<br/>Para cada una indica en una escala del 1 al 10 que tan identificado/a te sientes.</div>
          <button className="btn-submit" onClick={onStartAssess}>Comenzar evaluacion</button>
        </div>
      ) : (
        <ResultsPage scores={scores} username={user.username} onRetake={onStartAssess} />
      )}
    </div>
  );
}

function AdminDashboard() {
  const [users, setUsers] = useState({});
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { loadShared("all-users").then(d => { setUsers(d||{}); setLoading(false); }); }, []);

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
      {sel && (
        <div className="modal-ov" onClick={e => e.target===e.currentTarget && setSel(null)}>
          <div className="modal">
            <div className="modal-hdr">
              <div className="modal-title">Detalle: {sel.username}</div>
              <button className="modal-x" onClick={() => setSel(null)}>x</button>
            </div>
            {!sel.answers
              ? <div className="empty"><div className="empty-t">Usuario sin evaluacion completada</div></div>
              : <>
                  <div className="dp-grid">
                    {Object.entries(PROFILES).map(([k,p]) => (
                      <div key={k} className="dp-c" style={{background:p.bg,borderColor:p.border,color:p.color}}>
                        <div className="dp-ltr">Perfil {k}</div>
                        <div className="dp-nm">{p.label}</div>
                        <div className="dp-sc">{sel.scores?.[k]||0} pts</div>
                      </div>
                    ))}
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
            }
          </div>
        </div>
      )}

      <div className="pg-hdr">
        <div className="pg-title">Dashboard Administrador</div>
        <div className="pg-sub">Resumen general de evaluaciones y resultados</div>
      </div>

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

      <div className="sec-t">Usuarios y resultados</div>
      {all.length===0
        ? <div className="empty"><div className="empty-t">No hay usuarios registrados</div></div>
        : (
          <div className="tbl-wrap">
            <div className="tbl-head">
              <span className="th">Usuario</span>
              <span className="th ctr">Estado</span>
              <span className="th ctr">Clarificador</span>
              <span className="th ctr">Ideador</span>
              <span className="th ctr">Desarrollador</span>
              <span className="th ctr">Implementador</span>
              <span className="th ctr">Completado</span>
            </div>
            {all.map(u => {
              const s=u.scores||{};
              const maxK=u.scores?Object.entries(s).sort((a,b)=>b[1]-a[1])[0]?.[0]:null;
              return (
                <div className="tbl-row" key={u.username} onClick={() => setSel(u)}>
                  <span className="td bold">{u.username}</span>
                  <span className="td ctr">
                    <span className={`badge ${u.answers?"b-done":"b-pend"}`}>{u.answers?"Completado":"Pendiente"}</span>
                  </span>
                  {["A","B","C","D"].map(k => (
                    <span className="td ctr" key={k}>
                      {s[k]!=null
                        ? <span className="score-pill" style={{background:PROFILES[k].bg,color:PROFILES[k].color,border:`1px solid ${PROFILES[k].border}`}}>
                            {s[k]}{k===maxK?" *":""}
                          </span>
                        : <span style={{color:"var(--text3)"}}>—</span>
                      }
                    </span>
                  ))}
                  <span className="td ctr" style={{fontSize:11,color:"var(--text3)"}}>
                    {u.completedAt?new Date(u.completedAt).toLocaleDateString("es-CO"):"—"}
                  </span>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}

// ── APP ────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false);
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("login");
  const [view, setView] = useState("home");
  const [login, setLogin] = useState({ username:"", password:"" });
  const [reg, setReg] = useState({ username:"", password:"", confirm:"" });
  const [err, setErr] = useState("");
  const [toast, setToast] = useState("");

  const doLogin = async () => {
    if (!login.username||!login.password) { setErr("Completa todos los campos."); return; }
    if (login.username==="admin"&&login.password==="admin123") {
      setUser({username:"admin",role:"admin"}); setScreen("app"); setErr(""); return;
    }
    const all = await loadShared("all-users")||{};
    const u = all[login.username];
    if (!u) { setErr("Usuario no encontrado."); return; }
    if (u.password!==login.password) { setErr("Contrasena incorrecta."); return; }
    setUser({username:login.username,role:"user"}); setScreen("app"); setErr("");
  };

  const doReg = async () => {
    if (!reg.username||!reg.password||!reg.confirm) { setErr("Completa todos los campos."); return; }
    if (reg.password!==reg.confirm) { setErr("Las contrasenas no coinciden."); return; }
    if (reg.password.length<4) { setErr("Minimo 4 caracteres en la contrasena."); return; }
    if (reg.username==="admin") { setErr("Nombre de usuario no permitido."); return; }
    const all = await loadShared("all-users")||{};
    if (all[reg.username]) { setErr("Este usuario ya existe."); return; }
    all[reg.username]={username:reg.username,password:reg.password,role:"user"};
    await saveShared("all-users",all);
    setUser({username:reg.username,role:"user"}); setScreen("app"); setErr("");
    setToast("Cuenta creada exitosamente");
  };

  const doLogout = () => { setUser(null); setScreen("login"); setErr(""); setLogin({username:"",password:""}); setView("home"); };

  const isAdmin = user?.role==="admin";
  const navItems = isAdmin
    ? [{icon:Ico.dash,label:"Dashboard",view:"home"}]
    : [{icon:Ico.home,label:"Inicio",view:"home"},{icon:Ico.survey,label:"Evaluacion",view:"assess"}];

  return (
    <>
      <style>{buildCss(dark)}</style>
      <div className="app">
        {screen!=="app" ? (
          <div className="auth-wrap">
            <div className="auth-card">
              <div className="auth-brand">
                <div className="auth-brand-mark">{Ico.brand}</div>
                <div>
                  <div className="auth-brand-name">RoleProfile</div>
                  <div className="auth-brand-sub">Evaluacion de perfil profesional</div>
                </div>
              </div>
              {err && <div className="auth-err">{err}</div>}
              {screen==="login" ? (
                <>
                  <div className="auth-heading">Iniciar sesion</div>
                  <div className="field">
                    <label>Usuario</label>
                    <input placeholder="Tu nombre de usuario" value={login.username}
                      onChange={e=>setLogin({...login,username:e.target.value})}
                      onKeyDown={e=>e.key==="Enter"&&doLogin()} />
                  </div>
                  <div className="field">
                    <label>Contrasena</label>
                    <input type="password" placeholder="Tu contrasena" value={login.password}
                      onChange={e=>setLogin({...login,password:e.target.value})}
                      onKeyDown={e=>e.key==="Enter"&&doLogin()} />
                  </div>
                  <button className="btn-primary" onClick={doLogin}>Iniciar sesion</button>
                  <div className="auth-switch">No tienes cuenta? <span onClick={()=>{setScreen("register");setErr("");}}>Registrate</span></div>
                  <div className="auth-hint">Admin: <code>admin / admin123</code></div>
                </>
              ) : (
                <>
                  <div className="auth-heading">Crear cuenta</div>
                  <div className="field">
                    <label>Usuario</label>
                    <input placeholder="Elige un nombre de usuario" value={reg.username}
                      onChange={e=>setReg({...reg,username:e.target.value})} />
                  </div>
                  <div className="field">
                    <label>Contrasena</label>
                    <input type="password" placeholder="Minimo 4 caracteres" value={reg.password}
                      onChange={e=>setReg({...reg,password:e.target.value})} />
                  </div>
                  <div className="field">
                    <label>Confirmar contrasena</label>
                    <input type="password" placeholder="Repite tu contrasena" value={reg.confirm}
                      onChange={e=>setReg({...reg,confirm:e.target.value})}
                      onKeyDown={e=>e.key==="Enter"&&doReg()} />
                  </div>
                  <button className="btn-primary" onClick={doReg}>Crear cuenta</button>
                  <button className="btn-ghost" onClick={()=>{setScreen("login");setErr("");}}>Volver al inicio de sesion</button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="layout">
            <div className="sidebar">
              <div className="sb-logo">
                <div className="sb-logo-mark">{Ico.brand}</div>
                <div>
                  <div className="sb-logo-text">RoleProfile</div>
                  <div className="sb-logo-sub">Evaluacion de perfil</div>
                </div>
              </div>
              <div className="nav-lbl">Menu</div>
              {navItems.map(n => (
                <button key={n.view} className={`nav-item${view===n.view?" active":""}`} onClick={()=>setView(n.view)}>
                  {n.icon}{n.label}
                </button>
              ))}
              <div className="sb-bottom">
                <button className="theme-btn" onClick={()=>setDark(d=>!d)}>
                  {dark?Ico.sun:Ico.moon}{dark?"Modo claro":"Modo oscuro"}
                </button>
                <div className="user-card">
                  <div className="user-av">{user?.username?.[0]?.toUpperCase()}</div>
                  <div>
                    <div className="user-nm">{user?.username}{isAdmin&&<span className="admin-badge">Admin</span>}</div>
                    <div className="user-rl">{isAdmin?"Administrador":"Evaluado"}</div>
                  </div>
                </div>
                <button className="logout-btn" onClick={doLogout}>{Ico.logout} Cerrar sesion</button>
              </div>
            </div>
            <div className="main">
              {isAdmin
                ? <AdminDashboard/>
                : view==="assess"
                  ? <AssessmentPage user={user} onComplete={()=>{setView("home");setToast("Evaluacion enviada con exito");}}/>
                  : <UserHome user={user} onStartAssess={()=>setView("assess")}/>
              }
            </div>
          </div>
        )}
        {toast && <Toast msg={toast} onDone={()=>setToast("")}/>}
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// INTSEG ACADEMY V2.0 — app.js
// Funcionalidades implementadas:
//  ✅ Login / Logout con 3 roles (admin, instructor, guardia)
//  ✅ Catálogo dinámico con progreso real por usuario
//  ✅ Detalle de curso con acordeón de módulos funcional
//  ✅ Sistema de evaluaciones (quiz con 5 preguntas por curso)
//  ✅ Seguimiento de progreso con localStorage
//  ✅ Gestión de usuarios (CRUD)
//  ✅ Gestión de cursos (CRUD)
//  ✅ Reportes de avance por guardia
//  ✅ Ajustes (cambio de contraseña, reset)
//  ✅ Navegación sidebar completa
// ═══════════════════════════════════════════════════════════════

// ──────────────────────────────────────────────────────────────
// 1. DATOS POR DEFECTO
// ──────────────────────────────────────────────────────────────

const DEFAULT_USERS = [
  { id:"u1", user:"guardia01",  pass:"intseg123", role:"guardia", name:"Carlos Mendoza",  active:true },
  { id:"u2", user:"guardia02",  pass:"intseg456", role:"guardia", name:"Ana Torres",       active:true },
  { id:"u3", user:"guardia03",  pass:"intseg789", role:"guardia", name:"Pedro Ramírez",    active:true },
  { id:"u4", user:"admin",      pass:"admin123",  role:"admin",   name:"Claudia Escoto",   active:true },
  { id:"u5", user:"instructor", pass:"inst123",   role:"maestro", name:"Susana Ochoa",     active:true },
];

const DEFAULT_COURSES = [
  {
    id:"dc3",
    badge:"Certificación DC3",
    title:"Normatividad en Seguridad Privada",
    instructor:"Juan Pérez",
    duration:"3 horas",
    img:"avatar-guardia.png",
    desc:"Curso sobre las normas y regulaciones en seguridad privada necesarias para desempeñar funciones de vigilante. Cubre la Ley Federal de Seguridad Privada y el reglamento de la SSPF.",
    passingScore: 80,
    modules:[
      { id:"dc3-m1", title:"Marco legal de la seguridad privada",
        content:"La Ley Federal de Seguridad Privada (LFSP) establece los requisitos para operar como empresa de seguridad privada. Las empresas deben renovar su autorización cada dos años ante la SSPF. El artículo 15 define las obligaciones del personal operativo." },
      { id:"dc3-m2", title:"Procedimientos operativos estándar",
        content:"Los POE definen los protocolos de actuación en cada puesto. Incluyen: ronda de inspección, registro de visitantes, manejo de accesos y coordinación con cuerpos de seguridad pública. Toda ronda debe registrarse en la bitácora del puesto." },
      { id:"dc3-m3", title:"Manejo y reporte de incidentes",
        content:"Todo incidente debe reportarse en las primeras 24 horas usando el formato SPGIP-FO-027. Los incidentes críticos (robo, lesiones) requieren reporte inmediato a supervisión y, según el caso, a autoridades competentes." },
    ],
    questions:[
      { q:"¿Qué ley regula los servicios de seguridad privada en México?",
        opts:["Ley Federal del Trabajo","Ley Federal de Seguridad Privada","Ley de Seguridad Nacional","Código Penal Federal"], ans:1 },
      { q:"¿Cada cuánto tiempo deben renovar su autorización las empresas de seguridad privada?",
        opts:["Cada año","Cada tres años","Cada dos años","Cada cinco años"], ans:2 },
      { q:"¿Cuál es el plazo máximo para reportar un incidente ordinario?",
        opts:["12 horas","48 horas","24 horas","72 horas"], ans:2 },
      { q:"¿Qué formato se usa para el reporte de incidentes?",
        opts:["SPGIP-FO-011","SPGIP-FO-027","DC3-001","SSC-2024"], ans:1 },
      { q:"¿Quién expide la autorización para operar como empresa de seguridad privada?",
        opts:["IMSS","STPS","SSPF","SAT"], ans:2 },
    ],
  },
  {
    id:"iso",
    badge:"Certificación Internacional",
    title:"ISO 28001: Seguridad en la Cadena de Suministro",
    instructor:"Susana Ochoa",
    duration:"4 horas",
    img:"cover-iso28001.jpg",
    desc:"Estándares internacionales para asegurar la cadena de suministro y operaciones logísticas. Requisito para la certificación OEA y C-TPAT.",
    passingScore: 80,
    modules:[
      { id:"iso-m1", title:"Introducción a ISO 28001",
        content:"ISO 28001 especifica los requisitos para implementar un sistema de gestión de seguridad en la cadena de suministro. Busca proteger las operaciones logísticas contra amenazas como el contrabando, la introducción de drogas y el terrorismo." },
      { id:"iso-m2", title:"Evaluación y gestión de riesgos",
        content:"La metodología ISO 28001 incluye: identificación de activos críticos, análisis de amenazas, evaluación de vulnerabilidades y determinación de contramedidas. Se usa una matriz de riesgo 5×5 para priorizar acciones." },
      { id:"iso-m3", title:"Controles y contramedidas de seguridad",
        content:"Los controles de seguridad física incluyen: acceso con credencial, CCTV en zonas críticas, sellado de contenedores con número único, inspección de vehículos en entrada y salida, y registro de todo el personal externo." },
    ],
    questions:[
      { q:"¿Cuál es el principal objetivo de la norma ISO 28001?",
        opts:["Gestión de calidad","Seguridad en la cadena de suministro","Control de manufactura","Gestión ambiental"], ans:1 },
      { q:"¿Qué amenaza busca prevenir ISO 28001 en los contenedores?",
        opts:["Daño por humedad","Introducción de contrabando o drogas","Retraso en entrega","Daño por temperatura"], ans:1 },
      { q:"¿Qué dimensiones tiene la matriz de riesgo de ISO 28001?",
        opts:["3×3","4×4","5×5","6×6"], ans:2 },
      { q:"¿Cuál de estos es un control físico de ISO 28001?",
        opts:["Análisis de sangre","Sellado de contenedores con número único","Polígrafo mensual","Cámaras en domicilios"], ans:1 },
      { q:"ISO 28001 es requisito para obtener:",
        opts:["ISO 9001","OHSAS","Certificación OEA y C-TPAT","ISO 14001"], ans:2 },
    ],
  },
  {
    id:"aml",
    badge:"Certificación OEA",
    title:"Antilavado de Dinero y Seguridad Patrimonial",
    instructor:"Lic. M. González",
    duration:"2 horas",
    img:"cover-antilavado.jpg",
    desc:"Cumplimiento normativo obligatorio. Identificación y reporte de operaciones sospechosas según la Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita.",
    passingScore: 80,
    modules:[
      { id:"aml-m1", title:"Marco normativo antilavado (LFPIORPI)",
        content:"La Ley Federal para la Prevención e Identificación de Operaciones con Recursos de Procedencia Ilícita obliga a ciertas actividades vulnerables a presentar avisos ante la UIF (Unidad de Inteligencia Financiera) de la SHCP." },
      { id:"aml-m2", title:"Señales de alerta y operaciones sospechosas",
        content:"Señales de alerta: pagos en efectivo por montos inusualmente altos, clientes que evitan identificarse, transacciones sin justificación económica, uso de intermediarios sin relación comercial clara, cambios frecuentes de domicilio o identidad." },
      { id:"aml-m3", title:"Procedimiento de reporte interno",
        content:"El personal operativo reporta situaciones sospechosas a su supervisor dentro de las 24 horas. El supervisor escala al Oficial de Cumplimiento, quien evalúa si presenta un aviso ante la UIF dentro de los 30 días calendario." },
    ],
    questions:[
      { q:"¿Ante qué institución se presentan los avisos de operaciones sospechosas?",
        opts:["SAT","CONDUSEF","UIF – SHCP","CNBV"], ans:2 },
      { q:"¿Cuál es la ley antilavado aplicable en México?",
        opts:["Ley General de Títulos y Operaciones de Crédito","LFPIORPI","Ley del Mercado de Valores","Ley de Instituciones de Crédito"], ans:1 },
      { q:"¿En cuánto tiempo debe el personal reportar una situación sospechosa?",
        opts:["72 horas","Sin límite","24 horas","7 días"], ans:2 },
      { q:"¿Cuál de estas situaciones es una señal de alerta de lavado de dinero?",
        opts:["Cliente que solicita factura","Pago en efectivo por monto inusualmente alto","Cliente que llega con cita","Transacción con documentación completa"], ans:1 },
      { q:"¿Quién evalúa si se presenta un aviso ante la UIF?",
        opts:["El guardia operativo","El director general","El Oficial de Cumplimiento","El cliente"], ans:2 },
    ],
  },
];

// ──────────────────────────────────────────────────────────────
// 2. ESTADO (localStorage)
// ──────────────────────────────────────────────────────────────

function loadState() {
  try {
    return {
      users:    JSON.parse(localStorage.getItem("ia_users"))    || DEFAULT_USERS.map(u => ({...u})),
      courses:  JSON.parse(localStorage.getItem("ia_courses"))  || DEFAULT_COURSES.map(c => ({...c})),
      progress: JSON.parse(localStorage.getItem("ia_progress")) || {},
    };
  } catch(e) {
    return { users: DEFAULT_USERS.map(u=>({...u})), courses: DEFAULT_COURSES.map(c=>({...c})), progress: {} };
  }
}
function saveState() {
  localStorage.setItem("ia_users",    JSON.stringify(S.users));
  localStorage.setItem("ia_courses",  JSON.stringify(S.courses));
  localStorage.setItem("ia_progress", JSON.stringify(S.progress));
}

let S = loadState();
let ME = null;
let _currentCourse = null;
let _quiz = null;

function getProg(uid, cid) {
  if (!S.progress[uid]) S.progress[uid] = {};
  if (!S.progress[uid][cid]) S.progress[uid][cid] = { status:"not_started", score:null, attempts:0 };
  return S.progress[uid][cid];
}
function setProg(uid, cid, data) {
  if (!S.progress[uid]) S.progress[uid] = {};
  S.progress[uid][cid] = { ...getProg(uid, cid), ...data };
  saveState();
}

// ──────────────────────────────────────────────────────────────
// 3. NAVEGACIÓN
// ──────────────────────────────────────────────────────────────

function navigate(name) {
  ["viewLogin","viewCatalog","viewDetail","viewAdmin"].forEach(id => {
    document.getElementById(id)?.classList.add("hidden");
  });
  document.getElementById("appShell")?.classList.add("hidden");
  document.querySelectorAll(".ia-dv").forEach(v => v.classList.add("hidden"));

  if (name === "login") {
    document.getElementById("viewLogin").classList.remove("hidden");
    return;
  }

  document.getElementById("appShell").classList.remove("hidden");

  const staticMap = { catalog:"viewCatalog", detail:"viewDetail", admin:"viewAdmin" };
  if (staticMap[name]) {
    document.getElementById(staticMap[name]).classList.remove("hidden");
  }

  const dynamicViews = ["users","reports","settings","courseAdmin"];
  if (dynamicViews.includes(name)) {
    let el = document.getElementById("ia-dv-" + name);
    if (!el) {
      el = document.createElement("div");
      el.id = "ia-dv-" + name;
      el.className = "ia-dv";
      const anchor = document.getElementById("viewAdmin") || document.getElementById("appShell");
      if (anchor?.parentNode) anchor.parentNode.insertBefore(el, anchor.nextSibling);
      else document.getElementById("appShell").appendChild(el);
    }
    el.classList.remove("hidden");
  }

  document.querySelectorAll(".sidebar__item, .sidebar__link, nav li, nav a").forEach(i => i.classList.remove("active"));
  const sideMap = { catalog:"sideCursos", admin:"sideInicio", users:"sideUsuarios", reports:"sideReportes", settings:"sideAjustes", courseAdmin:"sideCursos", detail:"sideCursos" };
  if (sideMap[name]) document.getElementById(sideMap[name])?.classList.add("active");
  if (name==="catalog"||name==="detail") document.getElementById("sideInicio")?.classList.add("active");
  window.scrollTo(0, 0);
}

// ──────────────────────────────────────────────────────────────
// 4. TOAST
// ──────────────────────────────────────────────────────────────

let _tt = null;
function toast(msg, type = "info") {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.background = type==="error" ? "#dc2626" : type==="success" ? "#16a34a" : "#003d6b";
  el.classList.remove("hidden");
  if (_tt) clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.add("hidden"), 2800);
}

// ──────────────────────────────────────────────────────────────
// 5. LOGIN / LOGOUT
// ──────────────────────────────────────────────────────────────

function doLogin() {
  const u   = document.getElementById("inputUser").value.trim();
  const p   = document.getElementById("inputPass").value.trim();
  const err = document.getElementById("loginError");
  const found = S.users.find(x => x.user===u && x.pass===p && x.active);
  if (!found) {
    err.classList.remove("hidden");
    setTimeout(() => err.classList.add("hidden"), 3000);
    return;
  }
  ME = found;
  initSidebar();

  const roleLabel = { admin:"Administrador", maestro:"Instructor", guardia:"Guardia" };
  const welcomeEl = document.getElementById("adminWelcome");
  if (welcomeEl) welcomeEl.textContent = "Bienvenido, " + found.name;
  const badgeEl = document.getElementById("roleBadge");
  if (badgeEl) {
    badgeEl.textContent = roleLabel[found.role] || found.role;
    badgeEl.style.cssText = "display:inline-block;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:bold;background:#003d6b;color:#fff;margin-left:8px;";
  }

  if (found.role === "guardia") {
    document.getElementById("sideUsuarios")?.closest("li,.sidebar__item")?.style.setProperty("display","none");
    document.getElementById("sideReportes")?.closest("li,.sidebar__item")?.style.setProperty("display","none");
  }

  if (found.role==="admin" || found.role==="maestro") {
    refreshAdminStats();
    navigate("admin");
  } else {
    buildCatalog();
    navigate("catalog");
  }
}

function doLogout() {
  ME = null; _currentCourse = null; _quiz = null;
  document.getElementById("inputUser").value = "";
  document.getElementById("inputPass").value = "";
  navigate("login");
}

// ──────────────────────────────────────────────────────────────
// 6. SIDEBAR
// ──────────────────────────────────────────────────────────────

function initSidebar() {
  // Asignar IDs por texto si no los tienen
  document.querySelectorAll(".sidebar__item, nav li, .sidebar__link, nav a").forEach(item => {
    const t = item.textContent.trim().toLowerCase();
    if (!item.id) {
      if      (t === "inicio")                                  item.id = "sideInicio";
      else if (t === "cursos")                                  item.id = "sideCursos";
      else if (t.includes("usuario"))                          item.id = "sideUsuarios";
      else if (t.includes("reporte"))                          item.id = "sideReportes";
      else if (t.includes("ajuste"))                           item.id = "sideAjustes";
    }
  });

  const sidebar = document.querySelector(".sidebar, aside, .sidebar__nav") ||
                  document.getElementById("sideInicio")?.closest("nav,aside,div");
  if (sidebar && !sidebar.dataset.iaInit) {
    sidebar.dataset.iaInit = "1";
    sidebar.addEventListener("click", e => {
      const item = e.target.closest("[id^='side'], .sidebar__logout, [data-logout]");
      if (!item) {
        // Detectar "Cerrar sesión" por texto
        const btn = e.target.closest("button,a,li,div");
        if (btn) {
          const t = btn.textContent.trim().toLowerCase();
          if (t.includes("salir") || t.includes("cerrar sesión") || t.includes("logout")) { doLogout(); return; }
        }
        return;
      }
      const id = item.id;
      if      (id === "sideInicio")   { ME?.role==="guardia" ? (buildCatalog(),navigate("catalog")) : (refreshAdminStats(),navigate("admin")); }
      else if (id === "sideCursos")   { buildCatalog(); navigate("catalog"); }
      else if (id === "sideUsuarios") { buildUsersView(); navigate("users"); }
      else if (id === "sideReportes") { buildReportsView(); navigate("reports"); }
      else if (id === "sideAjustes")  { buildSettingsView(); navigate("settings"); }
    });
  }

  // Bottom nav mobile
  const bottomNav = document.querySelector(".bottom-nav,.nav-bar,.tab-bar");
  if (bottomNav && !bottomNav.dataset.iaInit) {
    bottomNav.dataset.iaInit = "1";
    bottomNav.addEventListener("click", e => {
      const btn = e.target.closest("button,a,li,div");
      if (!btn) return;
      const t = btn.textContent.trim().toLowerCase();
      if      (t.includes("inicio"))   { ME?.role==="guardia" ? (buildCatalog(),navigate("catalog")) : (refreshAdminStats(),navigate("admin")); }
      else if (t.includes("curso"))    { buildCatalog(); navigate("catalog"); }
      else if (t.includes("usuario"))  { buildUsersView(); navigate("users"); }
      else if (t.includes("ajuste"))   { buildSettingsView(); navigate("settings"); }
    });
  }
}

// ──────────────────────────────────────────────────────────────
// 7. CATÁLOGO
// ──────────────────────────────────────────────────────────────

function buildCatalog() {
  const list = document.getElementById("courseList");
  if (!list) return;
  list.innerHTML = "";
  S.courses.forEach(c => {
    const prog = getProg(ME.id, c.id);
    const pct  = prog.status==="completed" ? 100 : prog.status==="in_progress" ? 50 : 0;
    const card = document.createElement("div");
    card.className = "courseCard";
    card.dataset.status = prog.status==="not_started" ? "all" : prog.status;
    card.innerHTML = `
      <p class="courseCard__badge">${c.badge}</p>
      <div class="courseCard__row" style="display:flex;align-items:flex-start;gap:12px;">
        <img src="${c.img}" alt="${c.title}" style="width:52px;height:52px;border-radius:8px;object-fit:cover;flex-shrink:0;" onerror="this.style.display='none'">
        <div style="flex:1;min-width:0;">
          <p class="courseCard__title" style="margin:0 0 4px;font-weight:600;font-size:14px;">${c.title}</p>
          ${c.instructor ? `<p style="margin:0 0 6px;font-size:12px;color:#64748b;">de <em>${c.instructor}</em></p>` : ""}
          ${prog.status !== "not_started" ? `
            <div style="background:#e2e8f0;border-radius:4px;height:6px;margin-bottom:4px;">
              <div style="background:#ff8c00;height:6px;border-radius:4px;width:${pct}%;transition:width .4s;"></div>
            </div>
            <p style="font-size:11px;color:#64748b;margin:0;">${pct}% completado</p>` : ""}
          ${prog.status==="completed" && prog.score !== null
            ? `<p style="font-size:11px;color:#16a34a;margin:4px 0 0;">✅ Aprobado — ${prog.score}%</p>` : ""}
        </div>
      </div>
      <button class="btn btn--primary" data-go="detail" data-course="${c.id}"
        style="width:100%;margin-top:10px;padding:9px;border:none;border-radius:8px;background:#003d6b;color:#fff;cursor:pointer;font-size:14px;font-weight:600;">
        Ver detalle
      </button>`;
    list.appendChild(card);
  });
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("tab--active"));
  document.querySelector(".tab[data-filter='all']")?.classList.add("tab--active");
}

// ──────────────────────────────────────────────────────────────
// 8. DETALLE
// ──────────────────────────────────────────────────────────────

function loadDetail(courseId) {
  const c = S.courses.find(x => x.id===courseId) || S.courses[0];
  if (!c) return;
  _currentCourse = c;
  const prog = getProg(ME.id, c.id);
  if (prog.status==="not_started") setProg(ME.id, c.id, { status:"in_progress" });

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set("detBadge",      c.badge);
  set("detTitle",      c.title);
  set("detInstructor", c.instructor);
  set("detDuration",   c.duration);
  set("detDesc",       c.desc);
  const img = document.querySelector("#detAvatar img");
  if (img) img.src = c.img;

  // Inyectar acordeón de módulos
  const detView = document.getElementById("viewDetail");
  let modulesEl = document.getElementById("detModules");
  if (!modulesEl) {
    // Buscar el primer botón con "›" y subir hasta el contenedor de módulos
    const chevron = [...detView.querySelectorAll("button,div,p,span")]
                      .find(el => el.textContent.trim() === "›");
    if (chevron) {
      modulesEl = chevron.closest("ul,ol,section,[class*='module'],[class*='content']")
                  || chevron.parentElement?.parentElement;
    }
    if (!modulesEl) {
      // Crear antes del botón de evaluación
      modulesEl = document.createElement("div");
      const btnEval = document.getElementById("btnEval");
      if (btnEval?.parentElement) btnEval.parentElement.insertBefore(modulesEl, btnEval);
      else detView.appendChild(modulesEl);
    }
    modulesEl.id = "detModules";
  }

  if (c.modules?.length) {
    modulesEl.innerHTML = c.modules.map((m, i) => `
      <div style="border:1px solid #e2e8f0;border-radius:8px;margin-bottom:8px;overflow:hidden;">
        <button onclick="toggleModule('ia-m-${m.id}')"
          style="width:100%;background:#f8fafc;border:none;padding:12px 16px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;font-size:14px;font-weight:600;color:#003d6b;text-align:left;">
          <span>Módulo ${i+1} – ${m.title}</span>
          <span id="ia-icon-${m.id}" style="font-size:18px;transition:transform .3s;margin-left:8px;flex-shrink:0;">›</span>
        </button>
        <div id="ia-m-${m.id}" style="display:none;padding:14px 16px;font-size:13px;color:#334155;line-height:1.7;background:#fff;">
          ${m.content}
        </div>
      </div>`).join("");
  }

  const btnEval = document.getElementById("btnEval");
  if (btnEval) {
    const p = getProg(ME.id, c.id);
    btnEval.textContent = p.status==="completed"
      ? `Repetir evaluación (último: ${p.score}%)`
      : "Iniciar evaluación";
  }
}

function toggleModule(id) {
  const el   = document.getElementById(id);
  const icon = document.getElementById("ia-icon-" + id.replace("ia-m-",""));
  if (!el) return;
  const open = el.style.display !== "none";
  el.style.display = open ? "none" : "block";
  if (icon) icon.style.transform = open ? "" : "rotate(90deg)";
}

// ──────────────────────────────────────────────────────────────
// 9. QUIZ
// ──────────────────────────────────────────────────────────────

function openEval() {
  const c = _currentCourse;
  if (!c?.questions?.length) { toast("Este curso no tiene evaluación disponible aún.", "error"); return; }
  _quiz = { courseId: c.id, current: 0, answers: [] };
  document.getElementById("modalOverlay").classList.remove("hidden");
  renderQuestion();
}

function getModalInner() {
  const overlay = document.getElementById("modalOverlay");
  let inner = overlay.querySelector(".modal,.modal__content,.modal-box");
  if (!inner) {
    // Usar el primer div hijo, o crear uno
    inner = overlay.querySelector("div");
    if (!inner) {
      inner = document.createElement("div");
      overlay.appendChild(inner);
    }
  }
  inner.style.cssText = "background:#fff;border-radius:16px;max-width:520px;width:90%;margin:auto;max-height:90vh;overflow-y:auto;";
  return inner;
}

function renderQuestion() {
  const c   = S.courses.find(x => x.id===_quiz.courseId);
  const q   = c.questions[_quiz.current];
  const cur = _quiz.current + 1;
  const tot = c.questions.length;
  getModalInner().innerHTML = `
    <div style="padding:24px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <h3 style="margin:0;color:#003d6b;font-size:15px;flex:1;padding-right:12px;">📋 ${c.title}</h3>
        <button onclick="closeModal()" style="background:none;border:none;font-size:24px;cursor:pointer;color:#94a3b8;flex-shrink:0;">✕</button>
      </div>
      <div style="background:#e2e8f0;border-radius:4px;height:6px;margin-bottom:6px;">
        <div style="background:#003d6b;height:6px;border-radius:4px;width:${Math.round(cur/tot*100)}%;transition:width .3s;"></div>
      </div>
      <p style="font-size:12px;color:#94a3b8;margin:0 0 18px;">Pregunta ${cur} de ${tot}</p>
      <p style="font-size:15px;font-weight:600;color:#1e293b;line-height:1.5;margin:0 0 20px;">${q.q}</p>
      <div id="quiz-opts" style="display:flex;flex-direction:column;gap:10px;">
        ${q.opts.map((o,i) => `
          <button onclick="answerQuestion(${i})"
            style="text-align:left;padding:12px 16px;border-radius:8px;border:2px solid #e2e8f0;
                   background:#f8fafc;cursor:pointer;font-size:14px;color:#1e293b;transition:all .15s;"
            onmouseover="this.style.borderColor='#003d6b';this.style.background='#eff6ff';"
            onmouseout="this.style.borderColor='#e2e8f0';this.style.background='#f8fafc';">
            <strong style="color:#003d6b;margin-right:8px;">${String.fromCharCode(65+i)}.</strong>${o}
          </button>`).join("")}
      </div>
    </div>`;
}

function answerQuestion(idx) {
  const c       = S.courses.find(x => x.id===_quiz.courseId);
  const q       = c.questions[_quiz.current];
  const correct = idx === q.ans;
  _quiz.answers.push({ selected:idx, correct });
  document.querySelectorAll("#quiz-opts button").forEach((btn,i) => {
    btn.disabled = true;
    btn.removeAttribute("onmouseover"); btn.removeAttribute("onmouseout");
    if (i===q.ans)            { btn.style.borderColor="#16a34a"; btn.style.background="#f0fdf4"; }
    if (i===idx && !correct)  { btn.style.borderColor="#dc2626"; btn.style.background="#fef2f2"; }
  });
  setTimeout(() => {
    if (_quiz.current < c.questions.length-1) { _quiz.current++; renderQuestion(); }
    else showResults();
  }, 900);
}

function showResults() {
  const c       = S.courses.find(x => x.id===_quiz.courseId);
  const correct = _quiz.answers.filter(a=>a.correct).length;
  const total   = c.questions.length;
  const score   = Math.round(correct/total*100);
  const passed  = score >= c.passingScore;
  const prog    = getProg(ME.id, c.id);
  const attempts= (prog.attempts||0)+1;
  setProg(ME.id, c.id, {
    status:  passed ? "completed" : "in_progress",
    score:   passed ? Math.max(score, prog.score||0) : prog.score,
    attempts,
  });
  getModalInner().innerHTML = `
    <div style="padding:28px;text-align:center;">
      <div style="font-size:52px;margin-bottom:8px;">${passed?"🏆":"📖"}</div>
      <h2 style="margin:0 0 4px;color:${passed?"#16a34a":"#dc2626"};">${passed?"¡Aprobado!":"No aprobado"}</h2>
      <div style="font-size:48px;font-weight:800;color:${passed?"#16a34a":"#dc2626"};line-height:1.1;margin:8px 0;">${score}%</div>
      <p style="color:#94a3b8;font-size:13px;margin:0 0 20px;">mínimo requerido: ${c.passingScore}%</p>
      <div style="background:#f8fafc;border-radius:8px;padding:14px;margin-bottom:18px;text-align:left;font-size:13px;color:#64748b;">
        <p style="margin:0 0 4px;">Correctas: <strong style="color:#1e293b;">${correct} de ${total}</strong></p>
        <p style="margin:0;">Intentos: <strong style="color:#1e293b;">${attempts}</strong></p>
      </div>
      ${!passed?`<p style="font-size:13px;background:#fef3c7;color:#92400e;padding:10px;border-radius:8px;margin-bottom:18px;">Necesitas ${c.passingScore}% para acreditar. Puedes repetir cuando quieras.</p>`:""}
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        ${!passed?`<button onclick="openEval()" style="background:#003d6b;color:#fff;border:none;padding:10px 22px;border-radius:8px;cursor:pointer;font-weight:600;">Repetir examen</button>`:""}
        <button onclick="closeModal()" style="background:${passed?"#003d6b":"#e2e8f0"};color:${passed?"#fff":"#1e293b"};border:none;padding:10px 22px;border-radius:8px;cursor:pointer;font-weight:600;">Cerrar</button>
      </div>
    </div>`;
  const btnEval = document.getElementById("btnEval");
  if (btnEval && passed) btnEval.textContent = `Repetir evaluación (último: ${score}%)`;
  buildCatalog();
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
  _quiz = null;
}

// ──────────────────────────────────────────────────────────────
// 10. ADMIN STATS
// ──────────────────────────────────────────────────────────────

function refreshAdminStats() {
  // Solo actualizar el campo de bienvenida; las stats en tarjetas son difíciles
  // de identificar sin ver el HTML real — se deja como mejora si se añaden data-stat
  const el = document.getElementById("adminWelcome");
  if (el && ME) el.textContent = "Bienvenido, " + ME.name;
}

// ──────────────────────────────────────────────────────────────
// 11. GESTIÓN DE USUARIOS
// ──────────────────────────────────────────────────────────────

const _s = "width:100%;padding:9px 12px;border:1px solid #e2e8f0;border-radius:8px;font-size:14px;box-sizing:border-box;";
const _rl = { admin:"Administrador", maestro:"Instructor", guardia:"Guardia" };

function buildUsersView() {
  const view = document.getElementById("ia-dv-users");
  if (!view) return;
  view.innerHTML = `
    <div style="padding:20px;max-width:820px;margin:0 auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 style="margin:0;color:#003d6b;font-size:20px;">👥 Gestión de Usuarios</h2>
        <button onclick="toggleAddUserForm()" style="background:#ff8c00;color:#fff;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">+ Nuevo usuario</button>
      </div>
      <div id="ia-uform"></div>
      <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow-x:auto;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;min-width:520px;">
          <thead><tr style="background:#003d6b;color:#fff;">
            <th style="padding:12px 16px;text-align:left;">Nombre</th>
            <th style="padding:12px 16px;text-align:left;">Usuario</th>
            <th style="padding:12px 16px;text-align:left;">Rol</th>
            <th style="padding:12px 16px;text-align:center;">Estado</th>
            <th style="padding:12px 16px;text-align:center;">Acciones</th>
          </tr></thead>
          <tbody>
            ${S.users.map((u,i) => `
              <tr style="background:${i%2===0?"#f8fafc":"#fff"};border-bottom:1px solid #f1f5f9;">
                <td style="padding:12px 16px;font-weight:500;">${u.name}</td>
                <td style="padding:12px 16px;color:#64748b;font-family:monospace;">${u.user}</td>
                <td style="padding:12px 16px;">
                  <span style="background:${u.role==="admin"?"#003d6b":u.role==="maestro"?"#7c3aed":"#0369a1"};color:#fff;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;">${_rl[u.role]||u.role}</span>
                </td>
                <td style="padding:12px 16px;text-align:center;">
                  <span style="background:${u.active?"#dcfce7":"#fee2e2"};color:${u.active?"#16a34a":"#dc2626"};padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;">${u.active?"Activo":"Inactivo"}</span>
                </td>
                <td style="padding:12px 16px;text-align:center;white-space:nowrap;">
                  <button onclick="toggleUserStatus('${u.id}')"
                    style="background:${u.active?"#fee2e2":"#dcfce7"};color:${u.active?"#dc2626":"#16a34a"};border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;margin-right:4px;">
                    ${u.active?"Desactivar":"Activar"}
                  </button>
                  ${u.id!==ME?.id?`<button onclick="deleteUser('${u.id}')" style="background:#f1f5f9;color:#64748b;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px;">Eliminar</button>`:""}
                </td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>`;
}

function toggleAddUserForm() {
  const c = document.getElementById("ia-uform");
  if (!c) return;
  if (c.innerHTML.trim()) { c.innerHTML=""; return; }
  c.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.08);">
      <h3 style="margin:0 0 14px;color:#003d6b;font-size:15px;">Nuevo Usuario</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
        <div><label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Nombre completo</label>
          <input id="ia-nu-name" placeholder="Ej: Juan Martínez" style="${_s}"></div>
        <div><label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Usuario (login)</label>
          <input id="ia-nu-user" placeholder="Ej: guardia04" style="${_s}"></div>
        <div><label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Contraseña (mín. 6 caracteres)</label>
          <input id="ia-nu-pass" type="password" placeholder="••••••" style="${_s}"></div>
        <div><label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Rol</label>
          <select id="ia-nu-role" style="${_s}">
            <option value="guardia">Guardia</option>
            <option value="maestro">Instructor</option>
            <option value="admin">Administrador</option>
          </select></div>
      </div>
      <div style="display:flex;gap:10px;">
        <button onclick="addUser()" style="background:#003d6b;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">Guardar</button>
        <button onclick="document.getElementById('ia-uform').innerHTML=''" style="background:#f1f5f9;color:#64748b;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;">Cancelar</button>
      </div>
    </div>`;
}

function addUser() {
  const name = document.getElementById("ia-nu-name")?.value.trim();
  const user = document.getElementById("ia-nu-user")?.value.trim();
  const pass = document.getElementById("ia-nu-pass")?.value.trim();
  const role = document.getElementById("ia-nu-role")?.value;
  if (!name||!user||!pass||pass.length<6) { toast("Completa todos los campos. Contraseña mín. 6 caracteres.","error"); return; }
  if (S.users.find(u=>u.user===user)) { toast("Ese nombre de usuario ya existe.","error"); return; }
  S.users.push({ id:"u"+Date.now(), user, pass, role, name, active:true });
  saveState();
  toast("Usuario creado: "+name,"success");
  buildUsersView();
}

function toggleUserStatus(id) {
  const u = S.users.find(x=>x.id===id);
  if (!u||u.id===ME?.id) { toast("No puedes desactivar tu propio usuario.","error"); return; }
  u.active = !u.active;
  saveState();
  toast(`${u.name} ${u.active?"activado":"desactivado"}.`, u.active?"success":"info");
  buildUsersView();
}

function deleteUser(id) {
  const u = S.users.find(x=>x.id===id);
  if (!u||u.id===ME?.id) { toast("No puedes eliminar tu propio usuario.","error"); return; }
  if (!confirm(`¿Eliminar a "${u.name}"? Esta acción no se puede deshacer.`)) return;
  S.users = S.users.filter(x=>x.id!==id);
  saveState();
  toast("Usuario eliminado.","info");
  buildUsersView();
}

// ──────────────────────────────────────────────────────────────
// 12. GESTIÓN DE CURSOS
// ──────────────────────────────────────────────────────────────

function buildCourseAdminView() {
  const view = document.getElementById("ia-dv-courseAdmin");
  if (!view) return;
  const compl  = cid => Object.values(S.progress).filter(u=>u[cid]?.status==="completed").length;
  const inProg = cid => Object.values(S.progress).filter(u=>u[cid]?.status==="in_progress").length;
  view.innerHTML = `
    <div style="padding:20px;max-width:820px;margin:0 auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <h2 style="margin:0;color:#003d6b;font-size:20px;">📚 Gestión de Cursos</h2>
        <button onclick="showCourseForm(null)" style="background:#ff8c00;color:#fff;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">+ Nuevo curso</button>
      </div>
      <div id="ia-cform"></div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        ${S.courses.map(c=>`
          <div style="background:#fff;border-radius:12px;padding:16px;box-shadow:0 1px 4px rgba(0,0,0,.08);display:flex;gap:14px;align-items:flex-start;">
            <img src="${c.img}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0;" onerror="this.style.display='none'">
            <div style="flex:1;min-width:0;">
              <span style="font-size:11px;background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:20px;">${c.badge}</span>
              <p style="margin:6px 0 2px;font-weight:600;font-size:14px;">${c.title}</p>
              <p style="margin:0 0 8px;font-size:12px;color:#64748b;">${c.instructor} · ${c.duration}</p>
              <div style="display:flex;gap:8px;flex-wrap:wrap;font-size:12px;">
                <span style="background:#f0fdf4;color:#16a34a;padding:2px 8px;border-radius:20px;">✅ ${compl(c.id)} completados</span>
                <span style="background:#fff7ed;color:#c2410c;padding:2px 8px;border-radius:20px;">📖 ${inProg(c.id)} en curso</span>
                <span style="background:#f8fafc;color:#64748b;padding:2px 8px;border-radius:20px;">❓ ${c.questions?.length||0} preguntas</span>
              </div>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;flex-shrink:0;">
              <button onclick="showCourseForm('${c.id}')" style="background:#003d6b;color:#fff;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;">Editar</button>
              <button onclick="deleteCourse('${c.id}')" style="background:#fee2e2;color:#dc2626;border:none;padding:7px 14px;border-radius:6px;cursor:pointer;font-size:12px;">Eliminar</button>
            </div>
          </div>`).join("")}
      </div>
    </div>`;
}

function showCourseForm(courseId) {
  const c = courseId ? S.courses.find(x=>x.id===courseId) : null;
  const container = document.getElementById("ia-cform");
  if (!container) return;
  if (container.innerHTML.trim() && !courseId) { container.innerHTML=""; return; }
  container.innerHTML = `
    <div style="background:#fff;border-radius:12px;padding:20px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.08);">
      <h3 style="margin:0 0 14px;color:#003d6b;font-size:15px;">${c?"Editar curso":"Nuevo Curso"}</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
        <div><label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Título del curso</label>
          <input id="ia-cf-title" value="${c?.title||""}" style="${_s}"></div>
        <div><label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Instructor</label>
          <input id="ia-cf-instructor" value="${c?.instructor||""}" style="${_s}"></div>
        <div><label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Categoría / Badge</label>
          <input id="ia-cf-badge" value="${c?.badge||""}" style="${_s}"></div>
        <div><label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Duración</label>
          <input id="ia-cf-dur" value="${c?.duration||""}" placeholder="Ej: 3 horas" style="${_s}"></div>
      </div>
      <div style="margin-bottom:12px;"><label style="font-size:12px;color:#64748b;display:block;margin-bottom:4px;">Descripción</label>
        <textarea id="ia-cf-desc" rows="3" style="${_s}">${c?.desc||""}</textarea></div>
      <div style="display:flex;gap:10px;">
        <button onclick="saveCourse('${courseId||""}')" style="background:#003d6b;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">${c?"Actualizar":"Crear curso"}</button>
        <button onclick="document.getElementById('ia-cform').innerHTML=''" style="background:#f1f5f9;color:#64748b;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;">Cancelar</button>
      </div>
    </div>`;
  container.scrollIntoView({behavior:"smooth"});
}

function saveCourse(courseId) {
  const title=document.getElementById("ia-cf-title")?.value.trim();
  const inst =document.getElementById("ia-cf-instructor")?.value.trim();
  const badge=document.getElementById("ia-cf-badge")?.value.trim();
  const dur  =document.getElementById("ia-cf-dur")?.value.trim();
  const desc =document.getElementById("ia-cf-desc")?.value.trim();
  if (!title||!inst) { toast("Título e instructor son obligatorios.","error"); return; }
  if (courseId) {
    const c = S.courses.find(x=>x.id===courseId);
    if (c) Object.assign(c,{title,instructor:inst,badge,duration:dur,desc});
    toast("Curso actualizado.","success");
  } else {
    S.courses.push({id:"c"+Date.now(),badge,title,instructor:inst,duration:dur,img:"avatar-guardia.png",desc,passingScore:80,modules:[],questions:[]});
    toast("Curso creado.","success");
  }
  saveState();
  buildCourseAdminView();
}

function deleteCourse(id) {
  const c = S.courses.find(x=>x.id===id);
  if (!c) return;
  if (!confirm(`¿Eliminar "${c.title}"? Esta acción no se puede deshacer.`)) return;
  S.courses = S.courses.filter(x=>x.id!==id);
  saveState();
  toast("Curso eliminado.","info");
  buildCourseAdminView();
}

// ──────────────────────────────────────────────────────────────
// 13. REPORTES
// ──────────────────────────────────────────────────────────────

function buildReportsView() {
  const view = document.getElementById("ia-dv-reports");
  if (!view) return;
  const guardias = S.users.filter(u=>u.active&&u.role==="guardia");
  const rows = guardias.map(u => {
    const progs   = S.progress[u.id]||{};
    const compl   = Object.values(progs).filter(p=>p.status==="completed").length;
    const inprog  = Object.values(progs).filter(p=>p.status==="in_progress").length;
    const total   = S.courses.length;
    const pct     = total ? Math.round(compl/total*100) : 0;
    const best    = Object.values(progs).reduce((a,p)=>Math.max(a,p.score||0),0);
    return {u,compl,inprog,total,pct,best};
  });
  const avg   = rows.length ? Math.round(rows.reduce((s,r)=>s+r.pct,0)/rows.length) : 0;
  const totalC= rows.reduce((s,r)=>s+r.compl,0);
  view.innerHTML = `
    <div style="padding:20px;max-width:900px;margin:0 auto;">
      <h2 style="margin:0 0 20px;color:#003d6b;font-size:20px;">📊 Reportes de Capacitación</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:24px;">
        ${[["👥","Guardias activos",guardias.length,"#003d6b"],["📚","Cursos",S.courses.length,"#0369a1"],
           ["✅","Completados",totalC,"#16a34a"],["📈","Avance promedio",avg+"%","#ff8c00"]]
          .map(([ic,lb,val,col])=>`
            <div style="background:#fff;border-radius:12px;padding:16px;box-shadow:0 1px 4px rgba(0,0,0,.08);text-align:center;">
              <div style="font-size:26px;">${ic}</div>
              <div style="font-size:24px;font-weight:800;color:${col};">${val}</div>
              <div style="font-size:11px;color:#64748b;margin-top:2px;">${lb}</div>
            </div>`).join("")}
      </div>
      <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <div style="padding:16px 20px;border-bottom:1px solid #f1f5f9;">
          <h3 style="margin:0;color:#003d6b;font-size:15px;">Avance por Guardia</h3>
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;min-width:480px;">
            <thead><tr style="background:#f8fafc;">
              ${["Nombre","Completados","En curso","Avance","Mejor nota"].map(h=>
                `<th style="padding:12px 16px;text-align:${h==="Avance"||h==="Nombre"?"left":"center"};color:#64748b;font-weight:600;font-size:13px;">${h}</th>`).join("")}
            </tr></thead>
            <tbody>
              ${rows.length===0?`<tr><td colspan="5" style="padding:24px;text-align:center;color:#94a3b8;">Sin datos aún.</td></tr>`:
              rows.map((r,i)=>`
                <tr style="border-bottom:1px solid #f1f5f9;background:${i%2===0?"#fff":"#f8fafc"};">
                  <td style="padding:12px 16px;font-weight:500;">${r.u.name}</td>
                  <td style="padding:12px 16px;text-align:center;"><span style="background:#dcfce7;color:#16a34a;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:600;">${r.compl}/${r.total}</span></td>
                  <td style="padding:12px 16px;text-align:center;color:#64748b;">${r.inprog}</td>
                  <td style="padding:12px 20px;">
                    <div style="background:#e2e8f0;border-radius:4px;height:8px;min-width:80px;">
                      <div style="background:${r.pct===100?"#16a34a":r.pct>=50?"#ff8c00":"#003d6b"};height:8px;border-radius:4px;width:${r.pct}%;"></div>
                    </div>
                    <p style="font-size:11px;color:#64748b;margin:3px 0 0;">${r.pct}%</p>
                  </td>
                  <td style="padding:12px 16px;text-align:center;font-weight:600;color:${r.best>=80?"#16a34a":"#64748b"};">${r.best?r.best+"%":"—"}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}

// ──────────────────────────────────────────────────────────────
// 14. AJUSTES
// ──────────────────────────────────────────────────────────────

function buildSettingsView() {
  const view = document.getElementById("ia-dv-settings");
  if (!view) return;
  view.innerHTML = `
    <div style="padding:20px;max-width:560px;margin:0 auto;">
      <h2 style="margin:0 0 20px;color:#003d6b;font-size:20px;">⚙️ Ajustes</h2>
      <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);margin-bottom:14px;">
        <h3 style="margin:0 0 12px;color:#003d6b;font-size:15px;">Mi perfil</h3>
        <p style="margin:0 0 6px;font-size:14px;"><strong>Nombre:</strong> ${ME?.name}</p>
        <p style="margin:0 0 6px;font-size:14px;"><strong>Usuario:</strong> <code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">${ME?.user}</code></p>
        <p style="margin:0;font-size:14px;"><strong>Rol:</strong> ${_rl[ME?.role]||""}</p>
      </div>
      <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);margin-bottom:14px;">
        <h3 style="margin:0 0 12px;color:#003d6b;font-size:15px;">Cambiar contraseña</h3>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <input id="ia-s-old"  type="password" placeholder="Contraseña actual" style="${_s}">
          <input id="ia-s-new"  type="password" placeholder="Nueva contraseña (mín. 6 caracteres)" style="${_s}">
          <input id="ia-s-con"  type="password" placeholder="Confirmar nueva contraseña" style="${_s}">
          <button onclick="changePassword()" style="background:#003d6b;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;align-self:flex-start;">Actualizar contraseña</button>
        </div>
      </div>
      <div style="background:#fff;border-radius:12px;padding:20px;box-shadow:0 1px 4px rgba(0,0,0,.08);">
        <h3 style="margin:0 0 8px;color:#dc2626;font-size:15px;">Zona de riesgo</h3>
        <p style="font-size:13px;color:#64748b;margin:0 0 12px;">Elimina todo el progreso y restaura los datos de fábrica.</p>
        <button onclick="resetApp()" style="background:#fee2e2;color:#dc2626;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;font-size:14px;font-weight:600;">Restablecer datos de la app</button>
      </div>
    </div>`;
}

function changePassword() {
  const old = document.getElementById("ia-s-old")?.value;
  const nw  = document.getElementById("ia-s-new")?.value;
  const con = document.getElementById("ia-s-con")?.value;
  if (!old||!nw||!con)    { toast("Completa todos los campos.","error"); return; }
  if (old !== ME.pass)    { toast("La contraseña actual no es correcta.","error"); return; }
  if (nw.length < 6)      { toast("La nueva contraseña debe tener mínimo 6 caracteres.","error"); return; }
  if (nw !== con)         { toast("Las contraseñas no coinciden.","error"); return; }
  const u = S.users.find(x=>x.id===ME.id);
  if (u) { u.pass=nw; ME.pass=nw; saveState(); }
  toast("Contraseña actualizada.","success");
  ["ia-s-old","ia-s-new","ia-s-con"].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=""; });
}

function resetApp() {
  if (!confirm("¿Restablecer todos los datos? Se eliminará el progreso, usuarios y cursos personalizados.")) return;
  ["ia_users","ia_courses","ia_progress"].forEach(k=>localStorage.removeItem(k));
  toast("Datos restablecidos. Recargando...","info");
  setTimeout(()=>window.location.reload(),1500);
}

// ──────────────────────────────────────────────────────────────
// 15. DELEGACIÓN DE EVENTOS GLOBAL
// ──────────────────────────────────────────────────────────────

document.addEventListener("click", e => {
  // data-go
  const go = e.target.closest("[data-go]");
  if (go) {
    const dest=go.dataset.go, cid=go.dataset.course;
    if (dest==="detail"&&cid) { loadDetail(cid); navigate("detail"); }
    else if (dest==="catalog") { buildCatalog(); navigate("catalog"); }
    else if (dest==="admin")   { refreshAdminStats(); navigate("admin"); }
    return;
  }
  // data-back
  const back = e.target.closest("[data-back]");
  if (back) {
    const dest = back.dataset.back;
    if (dest==="catalog") { buildCatalog(); navigate("catalog"); }
    else { refreshAdminStats(); navigate("admin"); }
    return;
  }
  // Botones del admin por texto
  if (ME && (ME.role==="admin"||ME.role==="maestro")) {
    const btn = e.target.closest("button,[class*='quick'],[class*='card'],[class*='action']");
    if (btn) {
      const t = btn.textContent.trim().toLowerCase();
      if      (t.includes("crear curso"))                                         { buildCourseAdminView(); navigate("courseAdmin"); setTimeout(()=>showCourseForm(null),60); }
      else if (t.includes("gestionar curso")||t.includes("gestionar cursos"))     { buildCourseAdminView(); navigate("courseAdmin"); }
      else if (t.includes("gestión de usuario")||t.includes("gestionar usuario")) { buildUsersView(); navigate("users"); }
      else if (t.includes("reporte")&&!btn.closest("#ia-dv-reports"))             { buildReportsView(); navigate("reports"); }
    }
  }
});

// ──────────────────────────────────────────────────────────────
// 16. LISTENERS ESTÁTICOS
// ──────────────────────────────────────────────────────────────

document.getElementById("btnLogin")?.addEventListener("click", doLogin);

document.addEventListener("keydown", e => {
  if (e.key==="Enter" && !document.getElementById("viewLogin").classList.contains("hidden")) doLogin();
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", function() {
    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("tab--active"));
    this.classList.add("tab--active");
    const f = this.dataset.filter;
    document.querySelectorAll("#courseList .courseCard").forEach(card => {
      card.style.display = (!f||f==="all"||card.dataset.status===f) ? "" : "none";
    });
  });
});

document.getElementById("searchInput")?.addEventListener("input", function() {
  const q = this.value.toLowerCase();
  document.querySelectorAll("#courseList .courseCard").forEach(card => {
    const title = card.querySelector(".courseCard__title")?.textContent.toLowerCase()||"";
    card.style.display = title.includes(q) ? "" : "none";
  });
});

document.getElementById("btnEval")?.addEventListener("click", openEval);
document.getElementById("btnModalClose")?.addEventListener("click", closeModal);
document.getElementById("modalOverlay")?.addEventListener("click", e => {
  if (e.target===document.getElementById("modalOverlay")) closeModal();
});

// ──────────────────────────────────────────────────────────────
// 17. INICIO
// ──────────────────────────────────────────────────────────────

navigate("login");

const USERS = [
  { user:"guardia01",  pass:"intseg123", role:"guardia"  },
  { user:"admin",      pass:"admin123",  role:"admin"    },
  { user:"instructor", pass:"inst123",   role:"maestro"  },
];
const COURSES = {
  dc3:{ badge:"Certificación DC3", title:"Normatividad en Seguridad Privada", instructor:"Juan Pérez", duration:"3 horas", img:"avatar-guardia.png", desc:"Curso sobre las normas y regulaciones en seguridad privada necesarias para desempeñar funciones de vigilante de seguridad." },
  iso:{ badge:"Certificación Internacional", title:"ISO 28001: Seguridad en la Cadena de Suministro", instructor:"Susana Ochoa", duration:"4 horas", img:"cover-iso28001.jpg", desc:"Estándares internacionales para asegurar la cadena de suministro y las operaciones logísticas de la organización." },
  aml:{ badge:"Certificación OEA", title:"Antilavado de Dinero y Seguridad Patrimonial", instructor:"Lic. M. González", duration:"2 horas", img:"cover-antilavado.jpg", desc:"Cumplimiento normativo obligatorio. Identificación y reporte de operaciones sospechosas para todo el personal de seguridad privada." },
};
const VIEWS = ["viewLogin","viewCatalog","viewDetail","viewAdmin"];

function navigate(name) {
  document.getElementById("viewLogin").classList.add("hidden");
  document.getElementById("appShell").classList.add("hidden");
  document.getElementById("viewCatalog").classList.add("hidden");
  document.getElementById("viewDetail").classList.add("hidden");
  document.getElementById("viewAdmin").classList.add("hidden");
  if (name === "login") {
    document.getElementById("viewLogin").classList.remove("hidden");
    return;
  }
  document.getElementById("appShell").classList.remove("hidden");
  const viewId = { catalog:"viewCatalog", detail:"viewDetail", admin:"viewAdmin" }[name];
  if (viewId) document.getElementById(viewId).classList.remove("hidden");
  document.querySelectorAll(".sidebar__item").forEach(i => i.classList.remove("active"));
  if (name === "catalog") { document.getElementById("sideInicio").classList.add("active"); document.getElementById("sideCursos").classList.add("active"); }
  if (name === "admin") { document.getElementById("sideInicio").classList.add("active"); }
  window.scrollTo(0, 0);
}

let _tt = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  if (_tt) clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.add("hidden"), 2500);
}

function doLogin() {
  const u = document.getElementById("inputUser").value.trim();
  const p = document.getElementById("inputPass").value.trim();
  const err = document.getElementById("loginError");
  const found = USERS.find(x => x.user===u && x.pass===p);
  if (!found) {
    err.classList.remove("hidden");
    setTimeout(() => err.classList.add("hidden"), 3000);
    return;
  }
  const roleLabels = { admin:"Administrador", maestro:"Instructor", guardia:"Guardia" };
  const welcomeEl = document.getElementById("adminWelcome");
  if (welcomeEl) welcomeEl.textContent = "Bienvenido, " + (roleLabels[found.role] || found.role);
  const badgeEl = document.getElementById("roleBadge");
  if (badgeEl) {
    badgeEl.textContent = roleLabels[found.role] || found.role;
    badgeEl.style.cssText = "display:inline-block;padding:3px 12px;border-radius:20px;font-size:12px;font-weight:bold;background:#003d6b;color:#fff;margin-left:8px;";
  }
  navigate(found.role==="admin"||found.role==="maestro" ? "admin" : "catalog");
}

function doLogout() {
  document.getElementById("inputUser").value = "";
  document.getElementById("inputPass").value = "";
  navigate("login");
}

function loadDetail(key) {
  const c = COURSES[key]||COURSES.dc3;
  document.getElementById("detBadge").textContent      = c.badge;
  document.getElementById("detTitle").textContent      = c.title;
  document.getElementById("detInstructor").textContent = c.instructor;
  document.getElementById("detDuration").textContent   = c.duration;
  document.getElementById("detDesc").textContent       = c.desc;
  const img = document.querySelector("#detAvatar img");
  if (img) img.src = c.img;
}

document.addEventListener("click", e => {
  const go = e.target.closest("[data-go]");
  if (go) {
    const t = go.dataset.go, c = go.dataset.course;
    if (t==="detail" && c) { loadDetail(c); navigate("detail"); }
    else if (t==="catalog") navigate("catalog");
    else if (t==="admin") navigate("admin");
    return;
  }
  const back = e.target.closest("[data-back]");
  if (back) { navigate(back.dataset.back==="catalog"?"catalog":"admin"); return; }
});

document.getElementById("btnLogin").addEventListener("click", doLogin);
document.addEventListener("keydown", e => {
  if (e.key==="Enter" && !document.getElementById("viewLogin").classList.contains("hidden")) doLogin();
});

document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", function(){
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("tab--active"));
    this.classList.add("tab--active");
    const f = this.dataset.filter;
    document.querySelectorAll("#courseList .courseCard").forEach(card => {
      card.style.display = (f==="all"||card.dataset.status===f) ? "" : "none";
    });
  });
});

document.getElementById("searchInput").addEventListener("input", function(){
  const q = this.value.toLowerCase();
  document.querySelectorAll("#courseList .courseCard").forEach(card => {
    const t = card.querySelector(".courseCard__title")?.textContent.toLowerCase()||"";
    card.style.display = t.includes(q) ? "" : "none";
  });
});

document.getElementById("btnEval").addEventListener("click", () => document.getElementById("modalOverlay").classList.remove("hidden"));
document.getElementById("btnModalClose").addEventListener("click", () => document.getElementById("modalOverlay").classList.add("hidden"));
document.getElementById("modalOverlay").addEventListener("click", e => { if(e.target===document.getElementById("modalOverlay")) document.getElementById("modalOverlay").classList.add("hidden"); });

navigate("login");

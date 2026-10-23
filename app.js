const CURRENT_DATE = new Date();
const TODAY_KEY = toDateKey(CURRENT_DATE);
const ROLES = {
  nurse: { label: "Nurse", name: "Maya Patel", initials: "MP", icon: "✚" },
  doctor: { label: "Doctor", name: "Dr. A. Mehta", initials: "AM", icon: "⚕" },
  admin: { label: "Admin", name: "Jordan Lee", initials: "JL", icon: "⌂" },
};

const seedPatients = [
  {
    id: "PT-1042", name: "Ananya Rao", room: "B-12", age: 38, admitted: daysAgo(8), diagnosis: "Viral fever monitoring",
    temperatureToday: 38.7, temperatureTime: "08:40", doctorVisited: false, doctorVisitTime: null,
    temps: [
      { date: daysAgo(0), value: 38.7, time: "08:40", nurse: "Maya Patel", note: "Reported chills overnight" },
      { date: daysAgo(1), value: 38.3, time: "09:10", nurse: "Maya Patel", note: "" },
      { date: daysAgo(2), value: 38.9, time: "08:55", nurse: "A. Khan", note: "" },
    ],
    doctorNote: "", dischargeNotified: false, discharged: false,
  },
  {
    id: "PT-1048", name: "Vikram Shah", room: "A-09", age: 52, admitted: daysAgo(5), diagnosis: "Viral fever monitoring",
    temperatureToday: null, temperatureTime: null, doctorVisited: false, doctorVisitTime: null,
    temps: [
      { date: daysAgo(1), value: 36.8, time: "09:20", nurse: "A. Khan", note: "" },
      { date: daysAgo(2), value: 36.7, time: "08:50", nurse: "Maya Patel", note: "" },
      { date: daysAgo(3), value: 37.1, time: "09:06", nurse: "Maya Patel", note: "" },
    ],
    doctorNote: "", dischargeNotified: false, discharged: false,
  },
  {
    id: "PT-1051", name: "Meera Patel", room: "C-24", age: 29, admitted: daysAgo(9), diagnosis: "Viral fever monitoring",
    temperatureToday: 36.6, temperatureTime: "08:14", doctorVisited: true, doctorVisitTime: "10:20",
    temps: [
      { date: daysAgo(0), value: 36.6, time: "08:14", nurse: "Maya Patel", note: "" },
      { date: daysAgo(1), value: 36.8, time: "08:22", nurse: "Maya Patel", note: "" },
      { date: daysAgo(2), value: 36.7, time: "08:35", nurse: "A. Khan", note: "" },
      { date: daysAgo(3), value: 36.9, time: "08:26", nurse: "A. Khan", note: "" },
    ],
    doctorNote: "Clinically stable. Meets discharge criterion.", dischargeNotified: false, discharged: false,
  },
  {
    id: "PT-1057", name: "Arjun Singh", room: "A-17", age: 41, admitted: daysAgo(7), diagnosis: "Viral fever monitoring",
    temperatureToday: 37.0, temperatureTime: "09:05", doctorVisited: false, doctorVisitTime: null,
    temps: [
      { date: daysAgo(0), value: 37.0, time: "09:05", nurse: "Maya Patel", note: "" },
      { date: daysAgo(1), value: 36.9, time: "08:45", nurse: "Maya Patel", note: "" },
      { date: daysAgo(2), value: 36.8, time: "09:15", nurse: "A. Khan", note: "" },
    ],
    doctorNote: "", dischargeNotified: false, discharged: false,
  },
  {
    id: "PT-1063", name: "Nisha Kapoor", room: "B-03", age: 34, admitted: daysAgo(3), diagnosis: "Viral fever monitoring",
    temperatureToday: 38.4, temperatureTime: "08:35", doctorVisited: true, doctorVisitTime: "09:55",
    temps: [
      { date: daysAgo(0), value: 38.4, time: "08:35", nurse: "Maya Patel", note: "Hydration encouraged" },
      { date: daysAgo(1), value: 38.1, time: "08:50", nurse: "A. Khan", note: "" },
      { date: daysAgo(2), value: 38.6, time: "09:05", nurse: "Maya Patel", note: "" },
    ],
    doctorNote: "Continue fluids. Review tomorrow.", dischargeNotified: false, discharged: false,
  },
  {
    id: "PT-1070", name: "Rohan Das", room: "C-06", age: 46, admitted: daysAgo(11), diagnosis: "Viral fever monitoring",
    temperatureToday: 36.9, temperatureTime: "08:54", doctorVisited: true, doctorVisitTime: "11:04",
    temps: [
      { date: daysAgo(0), value: 36.9, time: "08:54", nurse: "Maya Patel", note: "" },
      { date: daysAgo(1), value: 37.0, time: "08:46", nurse: "Maya Patel", note: "" },
      { date: daysAgo(2), value: 36.8, time: "09:00", nurse: "A. Khan", note: "" },
    ],
    doctorNote: "Stable. Discharge handoff sent to admin.", dischargeNotified: true, discharged: false,
  },
];

const state = {
  role: null,
  view: "dashboard",
  selectedPatientId: null,
  search: "",
  filter: "all",
  occupancy: 74,
  patients: loadPatients(),
};

const app = document.querySelector("#app");
const modalRoot = document.querySelector("#modal-root");
const toastRoot = document.querySelector("#toast-root");

function loadPatients() {
  try {
    const saved = JSON.parse(localStorage.getItem("wardflow-prototype-patients"));
    return Array.isArray(saved) ? saved : structuredClone(seedPatients);
  } catch {
    return structuredClone(seedPatients);
  }
}

function savePatients() {
  localStorage.setItem("wardflow-prototype-patients", JSON.stringify(state.patients));
}

function toDateKey(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function daysAgo(days) {
  const date = new Date(CURRENT_DATE);
  date.setDate(date.getDate() - days);
  return toDateKey(date);
}

function displayDate(dateKey) {
  return new Date(`${dateKey}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function displayToday() {
  return CURRENT_DATE.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });
}

function nowTime() {
  return new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function getPatient(id) { return state.patients.find(patient => patient.id === id); }
function activePatients() { return state.patients.filter(patient => !patient.discharged); }
function initials(name) { return name.split(" ").map(part => part[0]).join("").slice(0, 2); }
function hasFever(value) { return Number(value) >= 37.5; }

function feverFreeDays(patient) {
  const dates = [daysAgo(0), daysAgo(1), daysAgo(2)];
  return dates.reduce((total, date) => {
    const entry = patient.temps.find(temp => temp.date === date);
    return total + (entry && !hasFever(entry.value) ? 1 : 0);
  }, 0);
}

function isDischargeEligible(patient) {
  return !patient.discharged && feverFreeDays(patient) === 3;
}

function careStatus(patient) {
  if (patient.discharged) return { label: "Discharged", kind: "neutral" };
  if (patient.dischargeNotified) return { label: "Admin handoff", kind: "info" };
  if (isDischargeEligible(patient)) return { label: "Discharge review", kind: "ready" };
  if (!patient.temperatureToday) return { label: "Temp overdue", kind: "alert" };
  if (!patient.doctorVisited) return { label: "Doctor visit due", kind: "pending" };
  if (hasFever(patient.temperatureToday)) return { label: "Fever - monitor", kind: "alert" };
  return { label: "Care complete", kind: "ready" };
}

function statusTag(status) { return `<span class="status status-${status.kind}">${status.label}</span>`; }
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char])); }

function render() {
  if (!state.role) {
    renderLogin();
    return;
  }
  app.innerHTML = `
    <div class="app-shell">
      ${renderSidebar()}
      <div class="main-area">
        ${renderTopbar()}
        <section class="content">${renderView()}</section>
      </div>
    </div>`;
  bindShellEvents();
}

function renderLogin() {
  app.innerHTML = `
    <section class="login-screen">
      <aside class="login-aside">
        <div class="brand"><span class="brand-mark">W</span>WardFlow</div>
        <h1>Every patient. Every step. Accounted for.</h1>
        <p>A focused care-operations workspace for a high-volume quarantine ward.</p>
        <div class="login-points"><span>Temperature tracking</span><span>Visit coordination</span><span>Timely discharge</span></div>
      </aside>
      <main class="login-main">
        <div class="role-picker">
          <h2>Open the prototype</h2>
          <p>Choose a role to explore the working care flow. You can switch roles at any time.</p>
          <div class="role-options">
            ${Object.entries(ROLES).map(([key, role]) => `
              <button class="role-option" data-role="${key}">
                <span class="role-option-icon">${role.icon}</span>
                <span><span class="role-option-title">Continue as ${role.label}</span><span class="role-option-text">${roleSummary(key)}</span></span>
              </button>`).join("")}
          </div>
          <div class="demo-note">Prototype mode - actions update the session data only. No real patient data is used.</div>
        </div>
      </main>
    </section>`;
  app.querySelectorAll("[data-role]").forEach(button => button.addEventListener("click", () => {
    state.role = button.dataset.role;
    state.view = "dashboard";
    render();
  }));
}

function roleSummary(role) {
  return {
    nurse: "Record temperatures and clear daily task queues.",
    doctor: "Review readings, complete visits, and notify admin.",
    admin: "Manage discharge handoffs and ward capacity.",
  }[role];
}

function navigationItems() {
  const common = [
    { id: "dashboard", icon: "▦", label: "Overview" },
    { id: "patients", icon: "◉", label: "Patients" },
  ];
  if (state.role === "nurse") common.splice(1, 0, { id: "tasks", icon: "✓", label: "Today's tasks" });
  if (state.role === "doctor") common.splice(1, 0, { id: "tasks", icon: "✦", label: "Visit queue" });
  if (state.role === "admin") common.splice(1, 0, { id: "tasks", icon: "⇢", label: "Discharge queue" });
  common.push({ id: "quality", icon: "↗", label: "Quality & outcomes" });
  return common;
}

function renderSidebar() {
  const role = ROLES[state.role];
  return `<aside class="sidebar">
    <div class="brand"><span class="brand-mark">W</span>WardFlow</div>
    <nav aria-label="Primary navigation">
      <p class="sidebar-label">Care operations</p>
      <div class="nav-list">
        ${navigationItems().map(item => `<button class="nav-item ${state.view === item.id ? "active" : ""}" data-view="${item.id}"><span class="nav-icon">${item.icon}</span>${item.label}</button>`).join("")}
      </div>
    </nav>
    <div class="sidebar-footer"><strong>${role.name}</strong>${role.label} access • Prototype</div>
  </aside>`;
}

function renderTopbar() {
  const role = ROLES[state.role];
  return `<header class="topbar">
    <div class="topbar-date">${displayToday()} <span class="muted">• Shift overview</span></div>
    <div class="role-switcher">
      <span class="avatar">${role.initials}</span>
      <label class="sr-only" for="role-select">Switch role</label>
      <select id="role-select" class="role-select" aria-label="Switch prototype role">
        ${Object.entries(ROLES).map(([key, item]) => `<option value="${key}" ${key === state.role ? "selected" : ""}>${item.label} view</option>`).join("")}
      </select>
    </div>
  </header>`;
}

function renderView() {
  if (state.view === "patients") return renderPatients();
  if (state.view === "tasks") return renderTasks();
  if (state.view === "quality") return renderQuality();
  if (state.view === "detail") return renderPatientDetail(getPatient(state.selectedPatientId));
  return renderDashboard();
}

function renderDashboard() {
  if (state.role === "nurse") return renderNurseDashboard();
  if (state.role === "doctor") return renderDoctorDashboard();
  return renderAdminDashboard();
}

function metricCard(title, value, help, variant = "") {
  return `<article class="card metric-card"><div class="metric-title">${title}</div><div class="metric-value">${value}</div><div class="metric-help ${variant}">${help}</div></article>`;
}

function renderNurseDashboard() {
  const active = activePatients();
  const overdue = active.filter(patient => !patient.temperatureToday);
  const done = active.filter(patient => patient.temperatureToday).length;
  return `
    <div class="page-heading">
      <div><h1>Good morning, Maya</h1><p class="subtitle">Here’s what needs attention in the ward before the doctor round.</p></div>
      <div class="heading-actions"><button class="btn btn-primary" data-action="record-temp">+ Record temperature</button></div>
    </div>
    ${overdue.length ? `<div class="notice"><span class="notice-icon">⚠</span><div><strong>${overdue.length} temperature ${overdue.length === 1 ? "is" : "are"} still overdue</strong><p>These patients cannot move to the doctor visit queue until a reading is recorded.</p></div></div>` : ""}
    <section class="grid metric-grid">
      ${metricCard("Temperature rounds", `${done} / ${state.occupancy}`, `${state.occupancy - done} readings remaining`, state.occupancy - done ? "warning" : "good")}
      ${metricCard("Fever alerts", active.filter(p => hasFever(p.temperatureToday)).length, "Requires clinical review", "warning")}
      ${metricCard("Ready for doctor", active.filter(p => p.temperatureToday && !p.doctorVisited).length, "Readings completed today", "good")}
      ${metricCard("Completed today", active.filter(p => p.temperatureToday && p.doctorVisited).length, "Temperature + doctor visit logged", "good")}
    </section>
    <section class="grid two-column">
      <article class="card">
        <div class="card-header"><div><div class="card-title">Temperature task queue</div><div class="card-subtitle">Prioritized by overdue and fever status</div></div><button class="btn-text" data-view="tasks">View all</button></div>
        ${renderNurseQueue(active.slice().sort(nurseSort).slice(0, 5))}
      </article>
      <article class="card">
        <div class="card-header"><div><div class="card-title">Today’s coverage</div><div class="card-subtitle">Track the handoff to doctor rounds</div></div></div>
        <div class="progress-wrap">
          ${progressRow("Temperature recorded", done, state.occupancy, "teal")}
          ${progressRow("Doctor visit completed", active.filter(p => p.doctorVisited).length, state.occupancy, "amber")}
          ${progressRow("Discharge ready", active.filter(isDischargeEligible).length, active.length, "teal")}
        </div>
      </article>
    </section>`;
}

function nurseSort(a, b) {
  const weight = patient => !patient.temperatureToday ? 0 : hasFever(patient.temperatureToday) && !patient.doctorVisited ? 1 : 2;
  return weight(a) - weight(b);
}

function renderNurseQueue(patients) {
  if (!patients.length) return emptyState("✓", "Temperature round complete", "Every active patient has a reading for today.");
  return `<div class="task-list">${patients.map(patient => {
    const missing = !patient.temperatureToday;
    const fever = hasFever(patient.temperatureToday);
    const label = missing ? "Temperature overdue" : fever ? `${patient.temperatureToday.toFixed(1)}°C - fever alert` : `${patient.temperatureToday.toFixed(1)}°C recorded at ${patient.temperatureTime}`;
    return `<div class="task-row"><span class="task-indicator ${missing || fever ? missing ? "red" : "amber" : "teal"}"></span><div class="task-main"><div class="task-title">${patient.name} <span class="muted">· Room ${patient.room}</span></div><div class="task-meta">${label}</div></div><div class="task-action">${statusTag(careStatus(patient))}<button class="action-link" data-record="${patient.id}" ${missing ? "" : "disabled"}>${missing ? "Record" : "View"}</button></div></div>`;
  }).join("")}</div>`;
}

function renderDoctorDashboard() {
  const active = activePatients();
  const ready = active.filter(patient => patient.temperatureToday && !patient.doctorVisited);
  const blocked = active.filter(patient => !patient.temperatureToday);
  const discharge = active.filter(patient => isDischargeEligible(patient) && !patient.dischargeNotified);
  return `
    <div class="page-heading"><div><h1>Doctor round control</h1><p class="subtitle">See only patients that are ready for a clinical visit, and clear discharge handoffs.</p></div><div class="heading-actions"><button class="btn btn-secondary" data-view="quality">View outcomes</button></div></div>
    ${blocked.length ? `<div class="notice"><span class="notice-icon">ℹ</span><div><strong>${blocked.length} patient${blocked.length > 1 ? "s are" : " is"} not ready for a doctor visit</strong><p>Temperature has not been recorded today. The visit action remains blocked until the nurse task is complete.</p></div></div>` : ""}
    <section class="grid metric-grid">
      ${metricCard("Visit queue", ready.length, "Temperature has been recorded", "warning")}
      ${metricCard("Visits completed", active.filter(p => p.doctorVisited).length, "Today", "good")}
      ${metricCard("Discharge review", discharge.length, "Meets 3 full fever-free days", "good")}
      ${metricCard("Fever alerts", active.filter(p => hasFever(p.temperatureToday)).length, "Prioritize clinical review", "warning")}
    </section>
    <section class="grid two-column">
      <article class="card"><div class="card-header"><div><div class="card-title">Ready for doctor visit</div><div class="card-subtitle">Nurse reading is available for each patient below</div></div><button class="btn-text" data-view="tasks">Open queue</button></div>${renderDoctorQueue(ready.slice(0, 5))}</article>
      <article class="card"><div class="card-header"><div><div class="card-title">Discharge decisions</div><div class="card-subtitle">3 full days without a fever</div></div></div>${renderDischargeReview(discharge)}</article>
    </section>`;
}

function renderDoctorQueue(patients) {
  if (!patients.length) return emptyState("✓", "Visit queue is clear", "No patients with a recorded temperature are waiting for a doctor visit.");
  return `<div class="task-list">${patients.map(patient => `<div class="task-row"><span class="task-indicator ${hasFever(patient.temperatureToday) ? "red" : "amber"}"></span><div class="task-main"><div class="task-title">${patient.name} <span class="muted">· Room ${patient.room}</span></div><div class="task-meta"><span class="vitals ${hasFever(patient.temperatureToday) ? "fever" : ""}">${patient.temperatureToday.toFixed(1)}°C</span> recorded at ${patient.temperatureTime} ${hasFever(patient.temperatureToday) ? "· Fever alert" : ""}</div></div><div class="task-action"><button class="action-link" data-visit="${patient.id}">Open visit</button></div></div>`).join("")}</div>`;
}

function renderDischargeReview(patients) {
  if (!patients.length) return emptyState("○", "No discharge reviews", "Patients will appear here after 3 full fever-free days.");
  return `<div class="task-list">${patients.map(patient => `<div class="task-row"><span class="task-indicator teal"></span><div class="task-main"><div class="task-title">${patient.name} <span class="muted">· Room ${patient.room}</span></div><div class="task-meta">3 consecutive fever-free days · ${patient.doctorVisited ? "visit complete" : "visit required"}</div></div><div class="task-action"><button class="action-link" data-discharge-review="${patient.id}">Review</button></div></div>`).join("")}</div>`;
}

function renderAdminDashboard() {
  const active = activePatients();
  const notified = active.filter(patient => patient.dischargeNotified);
  const eligible = active.filter(patient => isDischargeEligible(patient) && !patient.dischargeNotified);
  return `
    <div class="page-heading"><div><h1>Ward administration</h1><p class="subtitle">Turn doctor discharge decisions into released beds without delay.</p></div><div class="heading-actions"><button class="btn btn-secondary" data-view="quality">Quality report</button></div></div>
    <section class="grid metric-grid">
      ${metricCard("Ward occupancy", `${state.occupancy} / 74`, state.occupancy === 74 ? "Ward is at capacity" : `${74 - state.occupancy} bed${74 - state.occupancy === 1 ? "" : "s"} available`, state.occupancy === 74 ? "warning" : "good")}
      ${metricCard("Discharge handoffs", notified.length, "Approved by a doctor", notified.length ? "warning" : "good")}
      ${metricCard("Awaiting review", eligible.length, "Doctor action still required", eligible.length ? "warning" : "good")}
      ${metricCard("Discharged today", 1 + state.patients.filter(p => p.discharged).length, "Capacity released", "good")}
    </section>
    <section class="grid two-column">
      <article class="card"><div class="card-header"><div><div class="card-title">Discharge handoff queue</div><div class="card-subtitle">Only doctor-approved patients can be discharged</div></div><button class="btn-text" data-view="tasks">View all</button></div>${renderAdminQueue(notified)}</article>
      <article class="card"><div class="card-header"><div><div class="card-title">Capacity snapshot</div><div class="card-subtitle">Live after each discharge</div></div></div><div class="progress-wrap">${progressRow("Occupied beds", state.occupancy, 74, state.occupancy === 74 ? "amber" : "teal")} ${progressRow("Discharge-ready, doctor action", eligible.length, active.length, "amber")} ${progressRow("Handoffs awaiting admin", notified.length, active.length, "teal")}</div></article>
    </section>`;
}

function renderAdminQueue(patients) {
  if (!patients.length) return emptyState("✓", "No handoffs waiting", "When a doctor approves a discharge, it will appear here immediately.");
  return `<div class="task-list">${patients.map(patient => `<div class="task-row"><span class="task-indicator teal"></span><div class="task-main"><div class="task-title">${patient.name} <span class="muted">· Room ${patient.room}</span></div><div class="task-meta">Doctor handoff received · 3 fever-free days documented</div></div><div class="task-action">${statusTag({ label: "Ready to discharge", kind: "ready" })}<button class="action-link" data-confirm-discharge="${patient.id}">Confirm</button></div></div>`).join("")}</div>`;
}

function progressRow(label, value, total, tone) {
  const percentage = Math.max(0, Math.min(100, total ? (value / total) * 100 : 0));
  return `<div class="progress-row"><div class="progress-label"><span>${label}</span><strong>${value} <span class="muted">/ ${total}</span></strong></div><div class="progress-bar"><div class="progress-fill ${tone}" style="width:${percentage}%"></div></div></div>`;
}

function renderTasks() {
  const configs = {
    nurse: { title: "Temperature task queue", subtitle: "Record one daily temperature for every active patient before the doctor visit.", action: "record" },
    doctor: { title: "Doctor visit queue", subtitle: "A visit can begin only after today’s temperature is available.", action: "visit" },
    admin: { title: "Discharge handoff queue", subtitle: "Confirm discharge after the doctor has sent a handoff.", action: "discharge" },
  };
  const config = configs[state.role];
  const active = activePatients();
  let patients = [];
  if (config.action === "record") patients = active.filter(patient => !patient.temperatureToday).sort(nurseSort);
  if (config.action === "visit") patients = active.filter(patient => patient.temperatureToday && !patient.doctorVisited);
  if (config.action === "discharge") patients = active.filter(patient => patient.dischargeNotified);
  const actionLabel = config.action === "record" ? "+ Record temperature" : "";
  return `<div class="page-heading"><div><h1>${config.title}</h1><p class="subtitle">${config.subtitle}</p></div><div class="heading-actions">${actionLabel ? `<button class="btn btn-primary" data-action="record-temp">${actionLabel}</button>` : ""}</div></div><article class="card"><div class="card-header"><div><div class="card-title">${patients.length} action${patients.length === 1 ? "" : "s"} pending</div><div class="card-subtitle">${displayToday()}</div></div></div>${renderTaskTable(patients, config.action)}</article>`;
}

function renderTaskTable(patients, action) {
  if (!patients.length) return emptyState("✓", "Nothing is waiting", "This queue will update automatically as care actions are completed.");
  return `<div class="task-list">${patients.map(patient => {
    const base = `<div class="task-main"><div class="task-title">${patient.name} <span class="muted">· Room ${patient.room}</span></div><div class="task-meta">${taskMeta(patient, action)}</div></div>`;
    const button = action === "record" ? `<button class="btn btn-primary" data-record="${patient.id}">Record temperature</button>` : action === "visit" ? `<button class="btn btn-primary" data-visit="${patient.id}">Open visit</button>` : `<button class="btn btn-primary" data-confirm-discharge="${patient.id}">Confirm discharge</button>`;
    return `<div class="task-row"><span class="task-indicator ${action === "record" ? "red" : action === "visit" && hasFever(patient.temperatureToday) ? "red" : "teal"}"></span>${base}<div class="task-action">${button}</div></div>`;
  }).join("")}</div>`;
}

function taskMeta(patient, action) {
  if (action === "record") return "No temperature recorded today - doctor visit remains blocked";
  if (action === "visit") return `${patient.temperatureToday.toFixed(1)}°C recorded at ${patient.temperatureTime}${hasFever(patient.temperatureToday) ? " - fever alert" : ""}`;
  return "Doctor has confirmed that the 3-day fever-free criterion is met";
}

function renderPatients() {
  const patients = activePatients().filter(matchesPatientFilter);
  const headingAction = state.role === "nurse" ? `<button class="btn btn-primary" data-action="record-temp">+ Record temperature</button>` : "";
  return `<div class="page-heading"><div><h1>Patients</h1><p class="subtitle">Live daily care status for every active patient.</p></div><div class="heading-actions">${headingAction}</div></div><article class="card"><div class="card-header"><div><div class="card-title">Active ward list</div><div class="card-subtitle">Showing ${patients.length} of ${activePatients().length} demo records</div></div><div class="filters"><input id="patient-search" class="search" value="${escapeHtml(state.search)}" placeholder="Search patient or room" aria-label="Search patient or room"><select id="patient-filter" class="filter-select" aria-label="Filter patients"><option value="all" ${state.filter === "all" ? "selected" : ""}>All statuses</option><option value="temp" ${state.filter === "temp" ? "selected" : ""}>Temperature overdue</option><option value="visit" ${state.filter === "visit" ? "selected" : ""}>Doctor visit due</option><option value="discharge" ${state.filter === "discharge" ? "selected" : ""}>Discharge ready</option></select></div></div>${renderPatientTable(patients)}</article>`;
}

function matchesPatientFilter(patient) {
  const haystack = `${patient.name} ${patient.id} ${patient.room}`.toLowerCase();
  if (!haystack.includes(state.search.toLowerCase())) return false;
  if (state.filter === "temp") return !patient.temperatureToday;
  if (state.filter === "visit") return Boolean(patient.temperatureToday && !patient.doctorVisited);
  if (state.filter === "discharge") return isDischargeEligible(patient) || patient.dischargeNotified;
  return true;
}

function renderPatientTable(patients) {
  if (!patients.length) return emptyState("⌕", "No patients found", "Try clearing the search or choosing a different status filter.");
  return `<div class="patient-table-wrap"><table class="patient-table"><thead><tr><th>Patient</th><th>Room</th><th>Today’s temperature</th><th>Doctor visit</th><th>Status</th><th></th></tr></thead><tbody>${patients.map(patient => {
    const temperature = patient.temperatureToday ? `<span class="vitals ${hasFever(patient.temperatureToday) ? "fever" : ""}">${patient.temperatureToday.toFixed(1)}°C</span><span class="muted"> · ${patient.temperatureTime}</span>` : `<span class="muted">Not recorded</span>`;
    const visit = patient.doctorVisited ? `<span class="status status-ready">Complete</span>` : !patient.temperatureToday ? `<span class="status status-neutral">Blocked</span>` : `<span class="status status-pending">Due</span>`;
    return `<tr data-detail="${patient.id}"><td><div class="patient-name"><span class="patient-initial">${initials(patient.name)}</span><span>${patient.name}<span class="patient-id">${patient.id} · ${patient.age} years</span></span></div></td><td class="room">${patient.room}</td><td>${temperature}</td><td>${visit}</td><td>${statusTag(careStatus(patient))}</td><td><button class="table-action" data-detail="${patient.id}">View</button></td></tr>`;
  }).join("")}</tbody></table></div>`;
}

function renderPatientDetail(patient) {
  if (!patient) { state.view = "patients"; return renderPatients(); }
  const status = careStatus(patient);
  const currentActions = detailActions(patient);
  const records = patient.temps.slice().sort((a, b) => b.date.localeCompare(a.date));
  return `<div class="page-heading"><div><button class="btn-text" data-view="patients">← Back to patients</button><h1 style="margin-top:9px">Patient record</h1><p class="subtitle">Care timeline and today’s required actions.</p></div><div class="heading-actions">${currentActions}</div></div><section class="patient-detail"><article class="card"><div class="profile-header"><div class="profile-avatar">${initials(patient.name)}</div><div><div class="profile-name">${patient.name}</div><div class="profile-meta">${patient.id} · ${patient.age} years · Room ${patient.room} · Admitted ${displayDate(patient.admitted)}</div></div></div><div class="details-list"><div class="detail-item"><span class="detail-label">Care status</span><span class="detail-value">${statusTag(status)}</span></div><div class="detail-item"><span class="detail-label">Fever-free progress</span><span class="detail-value">${feverFreeDays(patient)} of 3 full days</span></div><div class="detail-item"><span class="detail-label">Today’s temperature</span><span class="detail-value">${patient.temperatureToday ? `${patient.temperatureToday.toFixed(1)}°C at ${patient.temperatureTime}` : "Not recorded"}</span></div><div class="detail-item"><span class="detail-label">Doctor visit</span><span class="detail-value">${patient.doctorVisited ? `Completed at ${patient.doctorVisitTime}` : patient.temperatureToday ? "Due today" : "Blocked until temperature is recorded"}</span></div></div><div class="card-header"><div><div class="card-title">Temperature timeline</div><div class="card-subtitle">Last recorded readings</div></div></div><div class="timeline">${records.map(record => `<div class="timeline-item ${hasFever(record.value) ? "alert" : ""}"><div class="timeline-day">${record.date === TODAY_KEY ? "Today" : displayDate(record.date)} · ${record.time}</div><div class="timeline-value ${hasFever(record.value) ? "vitals fever" : ""}">${record.value.toFixed(1)}°C ${hasFever(record.value) ? "· Fever" : "· No fever"}</div><div class="timeline-note">Recorded by ${record.nurse}${record.note ? ` · ${escapeHtml(record.note)}` : ""}</div></div>`).join("")}</div></article><aside class="card"><div class="side-stat"><div class="side-stat-label">Clinical handoff</div><div class="side-stat-value">${patient.doctorVisited ? "Visit complete" : patient.temperatureToday ? "Visit required" : "Temp required"}</div><div class="muted" style="margin-top:4px;font-size:12px">${patient.doctorNote ? escapeHtml(patient.doctorNote) : "No doctor note recorded yet."}</div></div><div class="side-stat"><div class="side-stat-label">Discharge rule</div><div class="side-stat-value">${feverFreeDays(patient)} / 3 days</div><div class="muted" style="margin-top:4px;font-size:12px">${isDischargeEligible(patient) ? "Clinical rule met. Await doctor handoff." : "Three consecutive fever-free days required."}</div></div><div class="side-stat"><div class="side-stat-label">Admission reason</div><div class="side-stat-value" style="font-size:15px">${patient.diagnosis}</div></div></aside></section>`;
}

function detailActions(patient) {
  if (state.role === "nurse") return !patient.temperatureToday ? `<button class="btn btn-primary" data-record="${patient.id}">Record temperature</button>` : "";
  if (state.role === "doctor") {
    if (patient.temperatureToday && !patient.doctorVisited) return `<button class="btn btn-primary" data-visit="${patient.id}">Open doctor visit</button>`;
    if (isDischargeEligible(patient) && !patient.dischargeNotified) return `<button class="btn btn-primary" data-discharge-review="${patient.id}">Review discharge</button>`;
  }
  if (state.role === "admin" && patient.dischargeNotified) return `<button class="btn btn-primary" data-confirm-discharge="${patient.id}">Confirm discharge</button>`;
  return "";
}

function renderQuality() {
  const active = activePatients();
  const feverFree = active.filter(patient => !hasFever(patient.temperatureToday)).length;
  return `<div class="page-heading"><div><h1>Quality & outcomes</h1><p class="subtitle">A simple operational view against the 85% success benchmark.</p></div></div><section class="quality-hero"><div><div class="eyebrow">30-day treatment outcome</div><h2>88% success rate</h2><p>Above the 85% benchmark. Continue monitoring; investigate promptly if mortality rises above 15%.</p></div><div class="quality-score"><b>12%</b><span>Mortality rate · target ≤ 15%</span></div></section><section class="report-grid"><article class="card"><div class="card-header"><div><div class="card-title">Weekly treatment success</div><div class="card-subtitle">Percentage of discharged patients who recovered</div></div><span class="badge">Above benchmark</span></div><div class="card-body"><div class="bar-chart"><div class="bar-col"><span class="bar" style="height:67%"></span><span>Week 1<br>84%</span></div><div class="bar-col"><span class="bar" style="height:72%"></span><span>Week 2<br>86%</span></div><div class="bar-col"><span class="bar" style="height:77%"></span><span>Week 3<br>89%</span></div><div class="bar-col"><span class="bar current" style="height:75%"></span><span>Week 4<br>88%</span></div></div><div class="legend"><span><i class="legend-dot"></i>Actual success rate</span><span>Benchmark: 85%</span></div></div></article><article class="card"><div class="card-header"><div><div class="card-title">Daily care reliability</div><div class="card-subtitle">Use this to spot process breakdowns</div></div></div><div class="progress-wrap">${progressRow("Temperature completion", active.filter(p => p.temperatureToday).length, state.occupancy, "teal")}${progressRow("Doctor visit completion", active.filter(p => p.doctorVisited).length, state.occupancy, "amber")}${progressRow("Patients fever-free today", feverFree, active.length, "teal")}</div></article></section>`;
}

function emptyState(icon, title, text) { return `<div class="empty-state"><div class="empty-icon">${icon}</div><h3>${title}</h3><p>${text}</p></div>`; }

function bindShellEvents() {
  app.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", event => {
    event.preventDefault();
    state.view = button.dataset.view;
    render();
  }));
  document.querySelector("#role-select")?.addEventListener("change", event => {
    state.role = event.target.value;
    state.view = "dashboard";
    render();
  });
  app.querySelectorAll("[data-record]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); openTemperatureModal(button.dataset.record); }));
  app.querySelectorAll("[data-visit]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); openVisitModal(button.dataset.visit); }));
  app.querySelectorAll("[data-discharge-review]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); openDischargeReviewModal(button.dataset.dischargeReview); }));
  app.querySelectorAll("[data-confirm-discharge]").forEach(button => button.addEventListener("click", event => { event.stopPropagation(); openConfirmDischargeModal(button.dataset.confirmDischarge); }));
  app.querySelectorAll("[data-detail]").forEach(element => element.addEventListener("click", event => {
    event.stopPropagation();
    state.selectedPatientId = element.dataset.detail;
    state.view = "detail";
    render();
  }));
  app.querySelectorAll('[data-action="record-temp"]').forEach(button => button.addEventListener("click", () => openTemperatureModal()));
  const search = document.querySelector("#patient-search");
  search?.addEventListener("input", event => { state.search = event.target.value; render(); document.querySelector("#patient-search")?.focus(); });
  document.querySelector("#patient-filter")?.addEventListener("change", event => { state.filter = event.target.value; render(); });
}

function openModal(content, afterRender) {
  modalRoot.innerHTML = `<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true">${content}</section></div>`;
  const backdrop = modalRoot.querySelector(".modal-backdrop");
  backdrop.addEventListener("click", event => { if (event.target === backdrop) closeModal(); });
  modalRoot.querySelectorAll("[data-close-modal]").forEach(button => button.addEventListener("click", closeModal));
  document.addEventListener("keydown", escapeModal);
  afterRender?.();
}

function closeModal() { modalRoot.innerHTML = ""; document.removeEventListener("keydown", escapeModal); }
function escapeModal(event) { if (event.key === "Escape") closeModal(); }

function openTemperatureModal(patientId = "") {
  const options = activePatients().filter(patient => !patient.temperatureToday);
  if (!options.length) { toast("All active demo patients have a temperature recorded today."); return; }
  const selected = getPatient(patientId) || options[0];
  openModal(`
    <div class="modal-header"><div><h2 class="modal-title">Record temperature</h2><p class="modal-subtitle">This creates today’s single nurse reading and unlocks the doctor visit.</p></div><button class="close-btn" aria-label="Close" data-close-modal>×</button></div>
    <form id="temperature-form"><div class="modal-body"><div class="form-grid"><div class="field"><label for="temperature-patient">Patient</label><select id="temperature-patient" name="patient">${options.map(patient => `<option value="${patient.id}" ${patient.id === selected.id ? "selected" : ""}>${patient.name} · Room ${patient.room}</option>`).join("")}</select></div><div class="form-row"><div class="field"><label for="temperature-value">Temperature (°C)</label><input id="temperature-value" name="temperature" type="number" step="0.1" min="34" max="43" placeholder="e.g. 37.2" required autofocus><span class="field-help">Accepted range: 34.0–43.0°C</span></div><div class="field"><label for="temperature-time">Recorded at</label><input id="temperature-time" name="time" type="time" value="${nowTime()}" required><span class="field-help">Today, ${displayDate(TODAY_KEY)}</span></div></div><div class="field"><label for="temperature-note">Observation <span class="muted">(optional)</span></label><textarea id="temperature-note" name="note" placeholder="e.g. chills reported, hydration advised"></textarea></div><div id="temperature-error" class="field-error" role="alert"></div></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-close-modal>Cancel</button><button type="submit" class="btn btn-primary">Save temperature</button></div></form>`, () => {
    modalRoot.querySelector("#temperature-form").addEventListener("submit", saveTemperature);
  });
}

function saveTemperature(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const patient = getPatient(form.get("patient"));
  const value = Number(form.get("temperature"));
  const error = modalRoot.querySelector("#temperature-error");
  if (!patient || patient.temperatureToday) { error.textContent = "This patient already has a temperature logged for today. Duplicate readings are not allowed."; return; }
  if (!Number.isFinite(value) || value < 34 || value > 43) { error.textContent = "Enter a temperature between 34.0°C and 43.0°C."; return; }
  patient.temperatureToday = value;
  patient.temperatureTime = form.get("time");
  patient.temps.unshift({ date: TODAY_KEY, value, time: form.get("time"), nurse: ROLES.nurse.name, note: form.get("note").trim() });
  savePatients();
  closeModal();
  render();
  toast(`${patient.name}'s temperature was recorded. They are now ready for a doctor visit.`);
}

function openVisitModal(patientId) {
  const patient = getPatient(patientId);
  if (!patient) return;
  if (!patient.temperatureToday) { toast("Doctor visits are blocked until today’s temperature is recorded."); return; }
  openModal(`
    <div class="modal-header"><div><h2 class="modal-title">Complete doctor visit</h2><p class="modal-subtitle">${patient.name} · Room ${patient.room}</p></div><button class="close-btn" aria-label="Close" data-close-modal>×</button></div>
    <form id="visit-form"><div class="modal-body"><div class="summary-block"><div class="summary-title">Nurse reading available</div><div class="summary-line"><span>Today’s temperature</span><strong class="${hasFever(patient.temperatureToday) ? "vitals fever" : ""}">${patient.temperatureToday.toFixed(1)}°C at ${patient.temperatureTime}</strong></div><div class="summary-line"><span>Fever-free progress</span><strong>${feverFreeDays(patient)} / 3 full days</strong></div></div>${hasFever(patient.temperatureToday) ? `<div class="alert-box">Fever alert: document the treatment decision before completing this visit.</div>` : ""}<div class="form-grid" style="margin-top:16px"><div class="field"><label for="doctor-note">Clinical note / treatment decision</label><textarea id="doctor-note" name="note" required placeholder="Document the visit and next clinical action">${escapeHtml(patient.doctorNote)}</textarea><span class="field-help">This note is shown to the next clinician and admin when relevant.</span></div><div id="visit-error" class="field-error" role="alert"></div></div></div><div class="modal-footer"><button type="button" class="btn btn-secondary" data-close-modal>Cancel</button><button type="submit" class="btn btn-primary">Mark visit complete</button></div></form>`, () => {
    modalRoot.querySelector("#visit-form").addEventListener("submit", event => saveVisit(event, patient.id));
  });
}

function saveVisit(event, patientId) {
  event.preventDefault();
  const patient = getPatient(patientId);
  const note = new FormData(event.currentTarget).get("note").trim();
  if (!note) { modalRoot.querySelector("#visit-error").textContent = "Add a short clinical note before completing the visit."; return; }
  patient.doctorVisited = true;
  patient.doctorVisitTime = nowTime();
  patient.doctorNote = note;
  savePatients();
  closeModal();
  render();
  toast(`Doctor visit for ${patient.name} is complete.`);
}

function openDischargeReviewModal(patientId) {
  const patient = getPatient(patientId);
  if (!patient) return;
  if (!isDischargeEligible(patient)) { toast("This patient has not yet completed 3 full fever-free days."); return; }
  openModal(`
    <div class="modal-header"><div><h2 class="modal-title">Review discharge</h2><p class="modal-subtitle">${patient.name} · Room ${patient.room}</p></div><button class="close-btn" aria-label="Close" data-close-modal>×</button></div>
    <div class="modal-body"><div class="summary-block"><div class="summary-title">Discharge criterion</div><div class="summary-line"><span>Consecutive fever-free days</span><strong>${feverFreeDays(patient)} of 3 - met</strong></div><div class="summary-line"><span>Today’s reading</span><strong>${patient.temperatureToday.toFixed(1)}°C at ${patient.temperatureTime}</strong></div><div class="summary-line"><span>Doctor visit</span><strong>${patient.doctorVisited ? "Completed" : "Not recorded today"}</strong></div></div>${patient.doctorVisited ? "" : `<div class="alert-box">A doctor visit is still required today. You can notify admin only after completing that visit.</div>`}</div><div class="modal-footer"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" data-send-handoff="${patient.id}" ${patient.doctorVisited ? "" : "disabled"}>Send handoff to admin</button></div>`, () => {
    modalRoot.querySelector("[data-send-handoff]")?.addEventListener("click", () => sendHandoff(patient.id));
  });
}

function sendHandoff(patientId) {
  const patient = getPatient(patientId);
  patient.dischargeNotified = true;
  savePatients();
  closeModal();
  render();
  toast(`Discharge handoff for ${patient.name} was sent to administration.`);
}

function openConfirmDischargeModal(patientId) {
  const patient = getPatient(patientId);
  if (!patient) return;
  openModal(`
    <div class="modal-header"><div><h2 class="modal-title">Confirm discharge</h2><p class="modal-subtitle">Release a bed only after reviewing the doctor handoff.</p></div><button class="close-btn" aria-label="Close" data-close-modal>×</button></div>
    <div class="modal-body"><div class="summary-block"><div class="summary-title">Patient handoff</div><div class="summary-line"><span>Patient</span><strong>${patient.name} · Room ${patient.room}</strong></div><div class="summary-line"><span>Discharge criterion</span><strong>3 fever-free days documented</strong></div><div class="summary-line"><span>Doctor note</span><strong>${escapeHtml(patient.doctorNote || "Visit complete")}</strong></div></div><p class="muted" style="font-size:13px;margin-bottom:0">This marks the patient as discharged in the prototype and reduces ward occupancy by one.</p></div><div class="modal-footer"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" data-finalize-discharge="${patient.id}">Confirm discharge</button></div>`, () => {
    modalRoot.querySelector("[data-finalize-discharge]")?.addEventListener("click", () => finalizeDischarge(patient.id));
  });
}

function finalizeDischarge(patientId) {
  const patient = getPatient(patientId);
  patient.discharged = true;
  patient.dischargeNotified = false;
  state.occupancy = Math.max(0, state.occupancy - 1);
  savePatients();
  closeModal();
  state.view = "dashboard";
  render();
  toast(`${patient.name} has been discharged. One bed is now available.`);
}

function toast(message) {
  toastRoot.innerHTML = `<div class="toast"><span class="toast-icon">✓</span>${escapeHtml(message)}</div>`;
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => { toastRoot.innerHTML = ""; }, 4200);
}

render();

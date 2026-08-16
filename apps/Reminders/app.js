const state = {
  reminders: [],
  data: null
};

const STORAGE_KEY = "dailyflow_progress_v1";
const $ = (s) => document.querySelector(s);

function localDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDate(value) {
  if (!value) return null;
  const [y,m,d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(value) {
  const d = typeof value === "string" ? parseDate(value) : value;
  return d?.toLocaleDateString("es-CR", {day:"numeric", month:"short", year:"numeric"}) || "—";
}

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getEntry(id) {
  const p = loadProgress();
  if (!p[id]) p[id] = { completed: {}, streak: 0, lastCompleted: null };
  return { p, e: p[id] };
}

function isWithinSchedule(r, today = new Date()) {
  const key = localDateKey(today);
  return key >= r.startDate && key <= r.endDate;
}

function computeStreak(r) {
  const {e} = getEntry(r.id);
  let cursor = e.lastCompleted ? parseDate(e.lastCompleted) : null;
  if (!cursor) return 0;
  let streak = 0;
  while (cursor) {
    const key = localDateKey(cursor);
    if (!e.completed[key]) break;
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function toggleDone(id) {
  const r = state.reminders.find(x => x.id === id);
  if (!r || !isWithinSchedule(r)) return;

  const today = localDateKey();
  const {p, e} = getEntry(id);
  if (e.completed[today]) {
    delete e.completed[today];
  } else {
    e.completed[today] = true;
    e.lastCompleted = today;
  }
  e.streak = computeStreak(r);
  saveProgress(p);
  render();
  showToast(e.completed[today] ? "¡Daily completado! ✨" : "Completado desmarcado.");
}

window.toggleDone = toggleDone;

function sanitize(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

function render() {
  const today = new Date();
  $("#todayLabel").textContent = today.toLocaleDateString("es-CR", {weekday:"long", day:"numeric", month:"long"});
  const active = state.reminders.filter(r => isWithinSchedule(r, today));
  let completed = 0;
  let best = 0;

  const html = state.reminders.map((r, index) => {
    const activeNow = isWithinSchedule(r, today);
    const {e} = getEntry(r.id);
    const todayKey = localDateKey();
    const done = !!e.completed[todayKey];
    if (activeNow && done) completed++;
    const streak = computeStreak(r);
    best = Math.max(best, streak);

    const start = parseDate(r.startDate);
    const end = parseDate(r.endDate);
    const totalDays = Math.max(1, Math.floor((end - start) / 86400000) + 1);
    const elapsed = Math.min(totalDays, Math.max(0, Math.floor((today - start) / 86400000) + 1));
    const progress = Math.round((elapsed / totalDays) * 100);

    let badge = activeNow ? `${r.durationDays ?? totalDays} días` : (today < start ? "Próximamente" : "Finalizado");
    return `
      <article class="reminder" style="animation-delay:${index * 45}ms">
        <div class="reminder-top">
          <div>
            <h3>${sanitize(r.title)}</h3>
            ${r.description ? `<p class="description">${sanitize(r.description)}</p>` : ""}
          </div>
          <span class="badge">${sanitize(badge)}</span>
        </div>
        <div class="meta">
          <span>Inicio · ${formatDate(r.startDate)}</span>
          <span>Final · ${formatDate(r.endDate)}</span>
        </div>
        <div class="progress-wrap">
          <div class="progress-line"><span>Periodo</span><span>${activeNow ? `${elapsed}/${totalDays} días` : (today < start ? "Aún no inicia" : "Terminado")}</span></div>
          <div class="progress"><div style="width:${activeNow ? progress : (today > end ? 100 : 0)}%"></div></div>
        </div>
        <div class="action-row">
          <div class="streak">Racha: <strong>✦ ${streak}</strong> día${streak === 1 ? "" : "s"}</div>
          <button class="done-btn ${done ? "done" : ""}" ${!activeNow ? "disabled" : ""} onclick="toggleDone('${sanitize(r.id)}')">
            ${done ? "✓ Hecho hoy" : "Marcar como hecho"}
          </button>
        </div>
      </article>`;
  }).join("");

  $("#reminders").innerHTML = html || `<div class="empty">No hay dailies configurados. Añade uno en <code>reminders.json</code>.</div>`;
  $("#completedCount").textContent = completed;
  $("#bestStreak").textContent = best;
  $("#activeCount").textContent = active.length;
  $("#summary").textContent = state.reminders.length
    ? `${active.length} activo${active.length === 1 ? "" : "s"} · ${completed} completado${completed === 1 ? "" : "s"} hoy`
    : "Sin recordatorios configurados";
}

async function loadJson() {
  try {
    const response = await fetch(`reminders.json?t=${Date.now()}`, {cache:"no-store"});
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    state.data = data;
    state.reminders = Array.isArray(data) ? data : (data.reminders || []);
    $("#syncStatus").textContent = "JSON conectado · cada 2 s";
    render();
  } catch (error) {
    $("#syncStatus").textContent = "No se pudo leer JSON";
    if (!state.reminders.length) {
      $("#reminders").innerHTML = `<div class="empty">No se pudo cargar <code>reminders.json</code>.<br><small>${sanitize(error.message)}</small></div>`;
    }
  }
}

function showToast(message) {
  const t = $("#toast");
  t.textContent = message;
  t.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove("show"), 2200);
}

$("#refreshBtn").addEventListener("click", () => {
  loadJson();
  showToast("Actualizando recordatorios…");
});

loadJson();
setInterval(loadJson, 30000);

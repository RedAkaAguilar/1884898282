import { requireAuth, getSession, logout } from "./auth.js";
import { requireAuth, getSession } from "./auth.js";

requireAuth();

const session = getSession();

async function loadInstances() {
  const res = await fetch("/data/instances.json");
  const data = await res.json();

  const allowed = data.instances.filter(i => {

    if (i.allowedUsers)
      return i.allowedUsers.includes(session.username);

    return session.level >= (i.levelRequired || 1);
  });

  if (allowed.length === 0) {
    document.getElementById("mainView").innerHTML =
      "<h2>No estás autorizado. No hay instancias disponibles.</h2>";
    return;
  }

  const sidebar = document.getElementById("instanceIcons");

  allowed.forEach(instance => {
    const icon = document.createElement("img");
    icon.src = instance.icon;
    icon.className = "instance-icon";

    icon.onclick = () => openInstance(instance);
    sidebar.appendChild(icon);
  });
}

function openInstance(instance) {
  document.getElementById("mainView").innerHTML = `
    <div class="instance-view"
         style="background-image:url('${instance.background}')">

      <img src="${instance.icon}" class="instance-title">

      <div class="instance-panel">
        <p>${instance.description}</p>
        <button class="download-btn">Descargar Assets</button>
      </div>

    </div>
  `;
}

loadInstances();

window.logoutUser = function () {
  logout();
};



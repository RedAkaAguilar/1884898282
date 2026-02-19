import { setSession } from "./auth.js";

async function login() {
  const input = document.getElementById("username").value;

  const res = await fetch("/data/users.json");
  const data = await res.json();

  const user = data.users.find(u => u.username === input);

  if (!user) {
    alert("Usuario no encontrado");
    return;
  }

  if (user.level === 0) {
    alert("Estás baneado.");
    return;
  }

  setSession(user);
  window.location.href = "/index.html";
}

window.login = login;


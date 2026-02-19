import { setSession } from "./auth.js";

async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  const res = await fetch("/data/users.json");
  const data = await res.json();

  const user = data.users.find(u => u.username === username);

  if (!user) {
    error.textContent = "Usuario no existe.";
    return;
  }

  if (user.password !== password) {
    error.textContent = "Contraseña incorrecta.";
    return;
  }

  if (user.level === 0) {
    error.textContent = "Estás baneado.";
    return;
  }

  // Guardamos sesión sin la contraseña
  const sessionUser = {
    nickname: user.nickname,
    username: user.username,
    level: user.level
  };

  setSession(sessionUser);
  window.location.href = "/index.html";
}

window.login = login;

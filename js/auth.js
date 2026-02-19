export function getSession() {
  return JSON.parse(localStorage.getItem("zyra_session"));
}

export function setSession(user) {
  localStorage.setItem("zyra_session", JSON.stringify(user));
}

export function logout() {
  localStorage.removeItem("zyra_session");
  window.location.href = "/login.html";
}

export function requireAuth() {
  const session = getSession();

  if (!session) {
    window.location.href = "/login.html";
    return;
  }

  if (session.level === 0) {
    logout();
  }
}

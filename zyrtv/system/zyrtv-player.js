(async () => {

const script = document.currentScript;
const videoId = script?.dataset.id;
if (!videoId) return;

let root = document.getElementById("zyrtv-player");
if (!root) {
  root = document.createElement("div");
  script.before(root);
}

const JSON_URL = "https://www.zyrakaworld.net/zyrtv/system/videos.json";

const res = await fetch(JSON_URL + "?t=" + Date.now());
const data = await res.json();
const v = data.videos.find(x => x.id === videoId);
if (!v) {
  root.innerHTML = "Video no encontrado";
  return;
}

const style = document.createElement("style");
style.textContent = `
.zyrtv-shell{
  position:relative;
  width:100%;
  max-width:1100px;
  aspect-ratio:16/9;
  margin:auto;
  border-radius:32px;
  overflow:hidden;
  background:#000;
  font-family:-apple-system,BlinkMacSystemFont,Inter,system-ui;
  box-shadow:0 40px 120px rgba(0,0,0,.7);
}

/* ===== BLURRED BACKGROUND ===== */
.zyrtv-bg{
  position:absolute;
  inset:-30%;
  background-size:cover;
  background-position:center;
  filter:blur(60px) brightness(.6) saturate(1.2);
  transform:scale(1.2);
}

/* ===== VIDEO ===== */
.zyrtv-video{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:contain;
  background:black;
  z-index:2;
}

/* ===== PLAY OVERLAY ===== */
.zyrtv-play{
  position:absolute;
  inset:0;
  display:grid;
  place-items:center;
  z-index:3;
  backdrop-filter:blur(14px);
  transition:.6s;
}

.zyrtv-play.hidden{
  opacity:0;
  pointer-events:none;
}

.zyrtv-play button{
  width:96px;
  height:96px;
  border-radius:50%;
  border:none;
  background:rgba(255,255,255,.22);
  backdrop-filter:blur(30px);
  color:white;
  font-size:38px;
  cursor:pointer;
  box-shadow:
    0 0 0 0 rgba(255,255,255,.6),
    0 20px 60px rgba(0,0,0,.6);
  animation:pulse 2.4s infinite;
}

@keyframes pulse{
  0%{box-shadow:0 0 0 0 rgba(255,255,255,.45)}
  70%{box-shadow:0 0 0 30px rgba(255,255,255,0)}
}

/* ===== CONTROLS ===== */
.zyrtv-controls{
  position:absolute;
  left:0;
  right:0;
  bottom:0;
  padding:22px;
  display:flex;
  gap:14px;
  align-items:center;
  background:linear-gradient(to top, rgba(0,0,0,.85), transparent);
  opacity:0;
  transform:translateY(20px);
  transition:.45s ease;
  z-index:4;
}

.zyrtv-shell:hover .zyrtv-controls{
  opacity:1;
  transform:translateY(0);
}

.zyrtv-btn{
  border:none;
  border-radius:18px;
  padding:12px 16px;
  font-size:14px;
  color:white;
  background:rgba(255,255,255,.18);
  backdrop-filter:blur(18px);
  cursor:pointer;
  transition:.25s;
}

.zyrtv-btn:hover{
  background:rgba(255,255,255,.32);
  transform:scale(1.06);
}

/* ===== PROGRESS BAR ===== */
.zyrtv-bar{
  flex:1;
  height:6px;
  background:rgba(255,255,255,.25);
  border-radius:999px;
  overflow:hidden;
  cursor:pointer;
}

.zyrtv-progress{
  height:100%;
  width:0%;
  background:linear-gradient(90deg,#fff,#ddd);
  transition:width .15s linear;
}

::cue{
  background:rgba(0,0,0,.6);
  color:white;
  font-size:17px;
  padding:8px 18px;
  border-radius:14px;
}
`;
document.head.appendChild(style);

root.innerHTML = `
<div class="zyrtv-shell">
  <div class="zyrtv-bg" style="background-image:url('${v.thumbnail}')"></div>

  <video class="zyrtv-video" preload="metadata">
    <source src="${v.video}">
    ${v.subs ? `<track kind="subtitles" src="${v.subs}" srclang="es" default>` : ""}
  </video>

  <div class="zyrtv-play">
    <button>▶</button>
  </div>

  <div class="zyrtv-controls">
    <button class="zyrtv-btn play">⏯</button>
    <button class="zyrtv-btn back">⏪ 10</button>
    <button class="zyrtv-btn forward">⏩ 10</button>
    <div class="zyrtv-bar"><div class="zyrtv-progress"></div></div>
    <button class="zyrtv-btn mute">🔊</button>
    <button class="zyrtv-btn subs">CC</button>
  </div>
</div>
`;

/* ================= LOGIC ================= */
const shell = root.querySelector(".zyrtv-shell");
const video = root.querySelector("video");
const playOverlay = root.querySelector(".zyrtv-play");
const progress = root.querySelector(".zyrtv-progress");
const bar = root.querySelector(".zyrtv-bar");

playOverlay.onclick = () => {
  playOverlay.classList.add("hidden");
  video.play();
};

video.ontimeupdate = () => {
  progress.style.width = (video.currentTime / video.duration * 100) + "%";
};

bar.onclick = e => {
  const r = bar.getBoundingClientRect();
  video.currentTime = ((e.clientX - r.left) / r.width) * video.duration;
};

shell.querySelector(".play").onclick = () =>
  video.paused ? video.play() : video.pause();

shell.querySelector(".back").onclick = () =>
  video.currentTime -= 10;

shell.querySelector(".forward").onclick = () =>
  video.currentTime += 10;

shell.querySelector(".mute").onclick = () =>
  video.muted = !video.muted;

shell.querySelector(".subs").onclick = () => {
  const t = video.textTracks[0];
  if (t) t.mode = t.mode === "showing" ? "hidden" : "showing";
};

})();

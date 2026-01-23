(async () => {

const script = document.currentScript;
if(!script) return;

const videoId = script.dataset.id;
if(!videoId){
  console.error("ZyrTV ▶ Falta data-id");
  return;
}

/* contenedor automático */
let root = document.getElementById("zyrtv-player");
if(!root){
  root = document.createElement("div");
  script.before(root);
}

const JSON_URL = "https://www.zyrakaworld.net/zyrtv/system/videos.json";

/* ================= FETCH JSON ================= */
const res = await fetch(JSON_URL + "?t=" + Date.now());
const data = await res.json();

const videoData = data.videos.find(v => v.id === videoId);

if(!videoData){
  root.innerHTML = "❌ Video no encontrado";
  return;
}

const style = document.createElement("style");
style.textContent = `
`;
document.head.appendChild(style);

root.innerHTML = `
<div class="zyrtv-wrap">
  <div class="zyrtv-bg" style="background-image:url('${videoData.thumbnail}')"></div>

  <video class="zyrtv-video" preload="metadata">
    <source src="${videoData.video}">
    ${videoData.subs ? `<track kind="subtitles" src="${videoData.subs}" srclang="es" default>` : ""}
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

const wrap = root.querySelector(".zyrtv-wrap");
const video = root.querySelector("video");
const playOverlay = root.querySelector(".zyrtv-play");
const progress = root.querySelector(".zyrtv-progress");
const bar = root.querySelector(".zyrtv-bar");

let audio = null;
if(videoData.audio){
  audio = new Audio(videoData.audio);
}

playOverlay.onclick = () => {
  playOverlay.style.display = "none";
  video.style.display = "block";
  video.play();
  if(audio) audio.play();
};

video.ontimeupdate = () => {
  progress.style.width = (video.currentTime / video.duration * 100) + "%";
  if(audio) audio.currentTime = video.currentTime;
};

bar.onclick = e => {
  const r = bar.getBoundingClientRect();
  video.currentTime = ((e.clientX - r.left) / r.width) * video.duration;
  if(audio) audio.currentTime = video.currentTime;
};

wrap.querySelector(".play").onclick = () => {
  if(video.paused){
    video.play();
    if(audio) audio.play();
  }else{
    video.pause();
    if(audio) audio.pause();
  }
};

wrap.querySelector(".back").onclick = () => {
  video.currentTime -= 10;
  if(audio) audio.currentTime = video.currentTime;
};

wrap.querySelector(".forward").onclick = () => {
  video.currentTime += 10;
  if(audio) audio.currentTime = video.currentTime;
};

wrap.querySelector(".mute").onclick = () => {
  video.muted = !video.muted;
  if(audio) audio.muted = video.muted;
};

wrap.querySelector(".subs").onclick = () => {
  const track = video.textTracks[0];
  if(track) track.mode = track.mode === "showing" ? "hidden" : "showing";
};

})();

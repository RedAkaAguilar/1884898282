(() => {

const root = document.getElementById("zyrtv-player");
if(!root) return;

const videoSrc = root.dataset.video;
const thumb = root.dataset.thumb;
const subs = root.dataset.subs;

const style = document.createElement("style");
style.textContent = `
.zyrtv-wrap{
  position:relative;
  width:100%;
  max-width:960px;
  aspect-ratio:16/9;
  border-radius:28px;
  overflow:hidden;
  background:#000;
  font-family:system-ui, -apple-system, BlinkMacSystemFont;
}

.zyrtv-bg{
  position:absolute;
  inset:0;
  background-size:cover;
  background-position:center;
  filter:blur(20px) brightness(.7);
  transform:scale(1.1);
}

.zyrtv-video{
  width:100%;
  height:100%;
  object-fit:cover;
  display:none;
}

.zyrtv-play{
  position:absolute;
  inset:0;
  display:grid;
  place-items:center;
  backdrop-filter:blur(12px);
  cursor:pointer;
}

.zyrtv-play button{
  width:90px;
  height:90px;
  border-radius:50%;
  border:none;
  background:rgba(255,255,255,.25);
  backdrop-filter:blur(20px);
  font-size:36px;
  color:white;
  transition:.4s;
}

.zyrtv-play button:hover{
  transform:scale(1.15);
}

.zyrtv-controls{
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  padding:16px;
  background:linear-gradient(to top, rgba(0,0,0,.85), transparent);
  display:flex;
  gap:12px;
  align-items:center;
  opacity:0;
  transition:.4s;
}

.zyrtv-wrap:hover .zyrtv-controls{
  opacity:1;
}

.zyrtv-btn{
  background:rgba(255,255,255,.18);
  border:none;
  border-radius:14px;
  padding:10px 14px;
  color:white;
  cursor:pointer;
  backdrop-filter:blur(14px);
}

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
  background:white;
}

/* ===== SUBTITULOS IPHONE STYLE ===== */
::cue {
  background:rgba(0,0,0,.55);
  color:white;
  font-size:16px;
  padding:6px 14px;
  border-radius:12px;
}
`;
document.head.appendChild(style);

/* ================== HTML ================== */
root.innerHTML = `
<div class="zyrtv-wrap">
  <div class="zyrtv-bg" style="background-image:url('${thumb}')"></div>

  <video class="zyrtv-video">
    <source src="${videoSrc}">
    ${subs ? `<track kind="subtitles" src="${subs}" srclang="es" default>` : ""}
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

/* ================== LOGIC ================== */
const wrap = root.querySelector(".zyrtv-wrap");
const video = root.querySelector("video");
const playOverlay = root.querySelector(".zyrtv-play");
const progress = root.querySelector(".zyrtv-progress");
const bar = root.querySelector(".zyrtv-bar");

playOverlay.onclick = () => {
  playOverlay.style.display = "none";
  video.style.display = "block";
  video.play();
};

video.ontimeupdate = () => {
  progress.style.width = (video.currentTime / video.duration * 100) + "%";
};

bar.onclick = e => {
  const r = bar.getBoundingClientRect();
  video.currentTime = ((e.clientX - r.left) / r.width) * video.duration;
};

wrap.querySelector(".play").onclick = () =>
  video.paused ? video.play() : video.pause();

wrap.querySelector(".back").onclick = () =>
  video.currentTime -= 10;

wrap.querySelector(".forward").onclick = () =>
  video.currentTime += 10;

wrap.querySelector(".mute").onclick = () =>
  video.muted = !video.muted;

wrap.querySelector(".subs").onclick = () => {
  const track = video.textTracks[0];
  if(track) track.mode = track.mode === "showing" ? "hidden" : "showing";
};

})();

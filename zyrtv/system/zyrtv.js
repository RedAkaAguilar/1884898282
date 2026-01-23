const JSON_URL = "/zyrtv/system/videos.json";
const REFRESH_MS = 1500; // 1.5s (puedes bajar hasta 500ms)

let lastHash = "";
let grid = document.getElementById("videoGrid");

/* ===================== */
/* UTILS */
/* ===================== */
async function fetchJSON(){
  const res = await fetch(JSON_URL + "?t=" + Date.now());
  return res.json();
}

function hashData(data){
  return JSON.stringify(data);
}

/* ===================== */
/* RENDER */
/* ===================== */
function renderVideos(data){
  grid.innerHTML = "";

  data.videos.forEach(v => {
    const card = document.createElement("div");
    card.className = "video-card";

    card.innerHTML = `
      <div class="video-thumb" style="background-image:url('${v.thumbnail}')">
        <div class="play-icon">
          <span class="material-symbols-rounded">
            ${v.icon || "play_arrow"}
          </span>
        </div>
      </div>

      <div class="video-info">
        <h3>${v.title}</h3>
        <p>${v.description}</p>
      </div>
    `;

    // Liquid Glass tracking
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--x", e.clientX - r.left + "px");
      card.style.setProperty("--y", e.clientY - r.top + "px");
    });

    card.onclick = () => window.open(v.link, "_blank");

    grid.appendChild(card);
  });
}

/* ===================== */
/* WATCHER */
/* ===================== */
async function watchJSON(){
  try{
    const data = await fetchJSON();
    const currentHash = hashData(data);

    if(currentHash !== lastHash){
      lastHash = currentHash;
      renderVideos(data);
      console.log("ZyrTV ▶ JSON actualizado");
    }
  }catch(e){
    console.warn("ZyrTV ▶ esperando JSON…");
  }
}

/* ===================== */
/* INIT */
/* ===================== */
watchJSON();
setInterval(watchJSON, REFRESH_MS);

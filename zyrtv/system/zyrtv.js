fetch("videos.json")
  .then(r => r.json())
  .then(data => {
    const grid = document.getElementById("videoGrid");

    data.videos.forEach(v => {
      const card = document.createElement("div");
      card.className = "video-card";

      card.innerHTML = `
        <div class="video-thumb" style="background-image:url('${v.thumbnail}')">
          <div class="play-icon">
            <span class="material-symbols-rounded">${v.icon || "play_arrow"}</span>
          </div>
        </div>
        <div class="video-info">
          <h3>${v.title}</h3>
          <p>${v.description}</p>
        </div>
      `;

      // efecto liquid follow
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--x", e.clientX - r.left + "px");
        card.style.setProperty("--y", e.clientY - r.top + "px");
      });

      card.onclick = () => {
        window.open(v.link, "_blank");
      };

      grid.appendChild(card);
    });
  });

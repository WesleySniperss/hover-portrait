console.log("Hover Portrait: hover.js loaded");

let hoverTimeout = null;
let removalTimer = null;

/* ------------------------------------------------------------
   DYNAMIC FRAME RESIZE FUNCTION
------------------------------------------------------------ */
function resizeFrame(frame, w, h) {
  const maxSize = 260;
  const aspect = w / h;

  let newW, newH;

  if (aspect > 1) {
    newW = maxSize;
    newH = maxSize / aspect;
  } else {
    newH = maxSize;
    newW = maxSize * aspect;
  }

  frame.style.width = `${newW}px`;
  frame.style.height = `${newH}px`;
}

/* ------------------------------------------------------------
   MAIN HOVER HANDLER
------------------------------------------------------------ */
Hooks.on("hoverToken", (token, hovered) => {

  // ------------------------------------------------------------
  // WHEN HOVER ENDS
  // ------------------------------------------------------------
  if (!hovered) {
    clearTimeout(hoverTimeout);

    clearTimeout(removalTimer);
    removalTimer = setTimeout(() => {
      const wrapper = document.getElementById("hover-wrapper");
      if (wrapper) wrapper.remove();
    }, 10000);

    return;
  }

  // ------------------------------------------------------------
  // WHEN HOVER BEGINS
  // ------------------------------------------------------------
  const delay = game.settings.get("hover-portrait", "hoverDelay");
  const border = game.settings.get("hover-portrait", "borderStyle");
  const path = token.document.getFlag("hover-portrait", "portraitPath");

  if (!path) return;

  hoverTimeout = setTimeout(() => {

    const oldWrapper = document.getElementById("hover-wrapper");
    if (oldWrapper) oldWrapper.remove();

    // ⭐ PER-USER POSITION (client settings)
    const savedTop = game.settings.get("hover-portrait", "portraitTop");
    const savedLeft = game.settings.get("hover-portrait", "portraitLeft");
    const pinned = game.settings.get("hover-portrait", "portraitPinned");

    const wrapper = document.createElement("div");
    wrapper.id = "hover-wrapper";

    const frame = document.createElement("div");
    frame.id = "hover-portrait";
    frame.classList.add(`hover-portrait-${border}`);

    frame.style.position = "absolute";
    frame.style.top = `${savedTop}px`;
    frame.style.left = `${savedLeft}px`;

    /* ------------------------------------------------------------
       PIN BUTTON
    ------------------------------------------------------------ */
    const pinBtn = document.createElement("div");
    pinBtn.id = "hover-pin-btn";
    pinBtn.textContent = pinned ? "⚔" : "🛡";
    pinBtn.style.position = "absolute";
    pinBtn.style.top = "-12px";
    pinBtn.style.right = "-12px";
    pinBtn.style.fontSize = "22px";
    pinBtn.style.cursor = "pointer";
    pinBtn.style.pointerEvents = "auto";
    pinBtn.style.zIndex = "1000000000";

    frame.appendChild(pinBtn);

    /* ------------------------------------------------------------
       MEDIA ELEMENT
    ------------------------------------------------------------ */
    let media;

    if (path.endsWith(".webm") || path.endsWith(".mp4")) {
      media = document.createElement("video");
      media.src = path;
      media.autoplay = true;
      media.loop = true;
      media.muted = true;

      const videoWrap = document.createElement("div");
      videoWrap.classList.add("hover-video-wrapper");
      videoWrap.appendChild(media);
      frame.appendChild(videoWrap);

      media.onloadedmetadata = () => {
        resizeFrame(frame, media.videoWidth, media.videoHeight);
      };

    } else {
      media = document.createElement("img");
      media.src = path;
      frame.appendChild(media);

      media.onload = () => {
        resizeFrame(frame, media.naturalWidth, media.naturalHeight);
      };
    }

    wrapper.appendChild(frame);
    document.body.appendChild(wrapper);

    /* ------------------------------------------------------------
       DRAGGING LOGIC (PER-USER SAVE)
    ------------------------------------------------------------ */
    if (!pinned) {
      let dragging = false;
      let offsetX = 0;
      let offsetY = 0;

      frame.addEventListener("mousedown", (ev) => {
        dragging = true;
        offsetX = ev.clientX - frame.offsetLeft;
        offsetY = ev.clientY - frame.offsetTop;

        clearTimeout(removalTimer);
      });

      window.addEventListener("mousemove", (ev) => {
        if (!dragging) return;

        const newLeft = ev.clientX - offsetX;
        const newTop = ev.clientY - offsetY;

        frame.style.left = `${newLeft}px`;
        frame.style.top = `${newTop}px`;
      });

      window.addEventListener("mouseup", () => {
        if (!dragging) return;
        dragging = false;

        // ⭐ SAVE POSITION PER USER
        game.settings.set("hover-portrait", "portraitTop", parseInt(frame.style.top));
        game.settings.set("hover-portrait", "portraitLeft", parseInt(frame.style.left));

        clearTimeout(removalTimer);
        removalTimer = setTimeout(() => {
          const wrapper = document.getElementById("hover-wrapper");
          if (wrapper) wrapper.remove();
        }, 10000);
      });
    }

    /* ------------------------------------------------------------
       PIN BUTTON CLICK (PER-USER SAVE)
    ------------------------------------------------------------ */
    pinBtn.addEventListener("click", () => {
      const newPinned = !pinned;

      // ⭐ SAVE PIN STATE PER USER
      game.settings.set("hover-portrait", "portraitPinned", newPinned);

      pinBtn.textContent = newPinned ? "⚔" : "🛡";

      wrapper.remove();
      Hooks.call("hoverToken", token, true);
    });

    /* ------------------------------------------------------------
       MOUSE ENTER / LEAVE LOGIC
    ------------------------------------------------------------ */
    frame.addEventListener("mouseenter", () => {
      clearTimeout(removalTimer);
    });

    frame.addEventListener("mouseleave", () => {
      clearTimeout(removalTimer);
      removalTimer = setTimeout(() => {
        const wrapper = document.getElementById("hover-wrapper");
        if (wrapper) wrapper.remove();
      }, 10000);
    });

  }, delay);
});

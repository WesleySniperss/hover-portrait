console.log("Hover Portrait: hover.js loaded");

(() => {
  const MODULE = "hover-portrait";
  const LINGER = 10000;          // the portrait stays this long after the pointer left the token (ms)
  const MAX_SIZE = 260;          // of the longer side of the portrait (px)
  const VIDEO = /\.(webm|mp4|m4v|ogv)$/i;
  let hoverTimeout = null;
  let removalTimer = null;

  /* ------------------------------------------------------------
     PORTRAIT SOURCE
  ------------------------------------------------------------ */

  // Foundry's placeholder art says nothing about a token
  function isPlaceholder(src) {
    return !src || (src === CONST.DEFAULT_TOKEN) || /icons\/svg\/mystery-man/.test(src);
  }

  // The portrait chosen in the Portrait Library: for this token, or for its actor (all of its tokens). "img" is where
  // older versions kept it.
  function getAssignedPortrait(token) {
    const doc = token.document;
    const actor = token.actor;
    return doc.getFlag(MODULE, "portraitPath") || doc.getFlag(MODULE, "img")
      || actor?.getFlag(MODULE, "portraitPath") || actor?.getFlag(MODULE, "img") || null;
  }

  // What to show for a token: its assigned portrait, or else (Portrait Source setting) the actor image or the token
  // image. The actor image only for those who may see the actor, others get the token image.
  function getPortraitPath(token) {
    const assigned = getAssignedPortrait(token);
    if (assigned) return assigned;
    const source = game.settings.get(MODULE, "portraitSource");
    if (source === "assigned") return null;
    const tokenImage = token.document.texture?.src;
    const actor = token.actor;
    if ((source === "actor") && actor && (game.user.isGM || actor.testUserPermission(game.user, "LIMITED"))
      && !isPlaceholder(actor.img)) return actor.img;
    return isPlaceholder(tokenImage) ? null : tokenImage;
  }

  /* ------------------------------------------------------------
     THE PORTRAIT WINDOW
  ------------------------------------------------------------ */

  // Fit the frame to the picture, the longer side MAX_SIZE
  function resizeFrame(frame, w, h) {
    if (!w || !h) return;
    const aspect = w / h;
    const width = (aspect > 1) ? MAX_SIZE : MAX_SIZE * aspect;
    const height = (aspect > 1) ? MAX_SIZE / aspect : MAX_SIZE;
    frame.style.width = `${width}px`;
    frame.style.height = `${height}px`;
  }

  function removePortrait() {
    clearTimeout(removalTimer);
    document.getElementById("hover-wrapper")?.remove();
  }

  function scheduleRemoval() {
    clearTimeout(removalTimer);
    removalTimer = setTimeout(removePortrait, LINGER);
  }

  function showPortrait(token) {
    const path = getPortraitPath(token);
    if (!path) return;
    removePortrait();

    const border = game.settings.get(MODULE, "borderStyle");
    const pinned = game.settings.get(MODULE, "portraitPinned");
    // a position saved on a larger screen is brought back into the window
    const left = Math.clamp(game.settings.get(MODULE, "portraitLeft"), 0, Math.max(window.innerWidth - 120, 0));
    const top = Math.clamp(game.settings.get(MODULE, "portraitTop"), 0, Math.max(window.innerHeight - 120, 0));

    const wrapper = document.createElement("div");
    wrapper.id = "hover-wrapper";
    const frame = document.createElement("div");
    frame.id = "hover-portrait";
    frame.classList.add(`hover-portrait-${border}`);
    frame.style.position = "absolute";
    frame.style.left = `${left}px`;
    frame.style.top = `${top}px`;
    frame.style.width = frame.style.height = `${MAX_SIZE}px`;

    // Pin button: a pinned portrait can't be moved
    const pin = document.createElement("div");
    pin.id = "hover-pin-btn";
    pin.textContent = pinned ? "⚔" : "🛡";
    pin.title = pinned ? "Unpin (let it be moved)" : "Pin in place";
    pin.addEventListener("click", async (event) => {
      event.stopPropagation();
      await game.settings.set(MODULE, "portraitPinned", !pinned);
      showPortrait(token);
    });
    frame.appendChild(pin);

    // The picture (an image or a looping video)
    if (VIDEO.test(path.split("?")[0])) {
      const video = document.createElement("video");
      Object.assign(video, { src: path, autoplay: true, loop: true, muted: true, playsInline: true });
      video.addEventListener("loadedmetadata", () => resizeFrame(frame, video.videoWidth, video.videoHeight));
      const videoWrap = document.createElement("div");
      videoWrap.classList.add("hover-video-wrapper");
      videoWrap.appendChild(video);
      frame.appendChild(videoWrap);
    } else {
      const image = document.createElement("img");
      image.addEventListener("load", () => resizeFrame(frame, image.naturalWidth, image.naturalHeight));
      image.addEventListener("error", () => wrapper.remove());
      image.src = path;
      frame.appendChild(image);
    }

    wrapper.appendChild(frame);
    document.body.appendChild(wrapper);

    // Dragging, the position saved per user
    if (!pinned) {
      frame.addEventListener("pointerdown", (event) => {
        if ((event.button !== 0) || (event.target === pin)) return;
        event.preventDefault();
        clearTimeout(removalTimer);
        const dx = event.clientX - frame.offsetLeft;
        const dy = event.clientY - frame.offsetTop;
        const move = (e) => {
          frame.style.left = `${e.clientX - dx}px`;
          frame.style.top = `${e.clientY - dy}px`;
        };
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          game.settings.set(MODULE, "portraitLeft", parseInt(frame.style.left));
          game.settings.set(MODULE, "portraitTop", parseInt(frame.style.top));
          if (!frame.matches(":hover")) scheduleRemoval();
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      });
    }

    // It stays while the pointer is on it
    frame.addEventListener("pointerenter", () => clearTimeout(removalTimer));
    frame.addEventListener("pointerleave", scheduleRemoval);
  }

  /* ------------------------------------------------------------
     HOVER
  ------------------------------------------------------------ */
  Hooks.on("hoverToken", (token, hovered) => {
    clearTimeout(hoverTimeout);
    if (!hovered) {
      if (document.getElementById("hover-wrapper")) scheduleRemoval();
      return;
    }
    if (token.isPreview || !getPortraitPath(token)) return;
    hoverTimeout = setTimeout(() => showPortrait(token), game.settings.get(MODULE, "hoverDelay"));
  });

  // A new scene: no portrait of a token that is gone
  Hooks.on("canvasTearDown", () => {
    clearTimeout(hoverTimeout);
    removePortrait();
  });

  globalThis.HoverPortrait = { getPortraitPath, getAssignedPortrait, showPortrait, removePortrait };
})();

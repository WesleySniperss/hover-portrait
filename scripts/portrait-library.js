/**
 * Portrait Library: assign a hover portrait to a token (and its actor) from the portrait folder, or any file
 */
console.log("Hover Portrait: portrait-library.js loaded");

(() => {
  const MODULE = "hover-portrait";
  // Where portraits are looked for in the Data folder: the documented folder first, then the one of 2.4.x
  const ROOTS = ["portraits", "public/portraits"];
  const IMAGE = new Set(["png", "jpg", "jpeg", "webp", "gif", "avif", "svg"]);
  const VIDEO = new Set(["mp4", "webm", "m4v", "ogv"]);
  const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;
  const picker = () => foundry.applications.apps.FilePicker.implementation;
  const browse = (path) => picker().browse("data", path);

  function decode(path) {
    try { return decodeURIComponent(path); } catch { return path; }
  }

  // The first portrait folder that exists; the GM gets one made when there is none
  async function findRoot() {
    for (const root of ROOTS) {
      try {
        await browse(root);
        return root;
      } catch { /* not there */ }
    }
    if (!game.user.isGM) return null;
    try {
      await picker().createDirectory("data", ROOTS[0]);
      return ROOTS[0];
    } catch {
      return null;
    }
  }

  // Assign a portrait to the token and to its actor, so its other tokens and new ones show it too. null removes it.
  async function assignPortrait(token, path) {
    const doc = token.document;
    const actor = game.actors.get(doc.actorId);
    const targets = [doc, actor].filter(d => d?.isOwner);
    for (const target of targets) {
      if (path) await target.setFlag(MODULE, "portraitPath", path);
      else {
        if (target.getFlag(MODULE, "portraitPath") !== undefined) await target.unsetFlag(MODULE, "portraitPath");
        if (target.getFlag(MODULE, "img") !== undefined) await target.unsetFlag(MODULE, "img");
      }
    }
  }

  class PortraitLibrary extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(token, options = {}) {
      super(options);
      this.token = token;
      this.root = undefined;   // the portrait folder (null when there is none)
      this.folder = null;      // the subfolder shown, null for the portrait folder itself
    }

    static DEFAULT_OPTIONS = {
      id: "portrait-library",
      classes: ["portrait-library"],
      window: { title: "Portrait Library", icon: "fa-solid fa-images", resizable: true },
      position: { width: 650, height: 550 },
      actions: {
        pick: PortraitLibrary.#onPick,
        folder: PortraitLibrary.#onFolder,
        back: PortraitLibrary.#onBack,
        choose: PortraitLibrary.#onChoose,
        clear: PortraitLibrary.#onClear
      }
    };

    static PARTS = {
      library: { template: "modules/hover-portrait/templates/portrait-library.html", scrollable: [""] }
    };

    get title() {
      return `Portrait Library: ${this.token.name}`;
    }

    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      if (this.root === undefined) this.root = await findRoot();
      const folder = this.folder ?? this.root;
      let listing = { dirs: [], files: [] };
      let notice = "";
      if (!folder) {
        notice = game.user.isGM
          ? `There is no portrait folder and it could not be made. Create Data/${ROOTS[0]} or choose a file.`
          : `There is no portrait folder yet (Data/${ROOTS[0]}). You can still choose a file.`;
      } else {
        try {
          listing = await browse(folder);
        } catch (error) {
          notice = `${decode(folder)} can't be opened: ${error.message}`;
        }
      }
      const files = (listing.files ?? []).map(path => {
        const extension = path.split("?")[0].split(".").pop().toLowerCase();
        return { path, name: decode(path.split("/").pop()), isImage: IMAGE.has(extension), isVideo: VIDEO.has(extension) };
      }).filter(file => file.isImage || file.isVideo);
      return Object.assign(context, {
        tokenName: this.token.name,
        assigned: globalThis.HoverPortrait?.getAssignedPortrait(this.token) ?? null,
        assignedLabel: decode(globalThis.HoverPortrait?.getAssignedPortrait(this.token) ?? ""),
        notice,
        folderLabel: folder ? `Data/${decode(folder)}` : "",
        inFolder: !!this.folder,
        dirs: (listing.dirs ?? []).map(path => ({ path, name: decode(path.split("/").pop()) })),
        files
      });
    }

    static async #onPick(event, target) {
      await assignPortrait(this.token, target.dataset.path);
      ui.notifications.info(`Portrait set for ${this.token.name}`);
      this.close();
    }

    static #onFolder(event, target) {
      this.folder = target.dataset.path;
      this.render();
    }

    static #onBack() {
      const parent = (this.folder ?? "").split("/").slice(0, -1).join("/");
      this.folder = (!this.root || !parent || (parent.length <= this.root.length)) ? null : parent;
      this.render();
    }

    static #onChoose() {
      const assigned = globalThis.HoverPortrait?.getAssignedPortrait(this.token);
      const current = decode(assigned ?? this.folder ?? this.root ?? "").replace(/^\//, "");
      const FilePicker = picker();
      new FilePicker({
        type: "imagevideo",
        current,
        callback: async (path) => {
          await assignPortrait(this.token, path);
          ui.notifications.info(`Portrait set for ${this.token.name}`);
          this.close();
        }
      }).render(true);
    }

    static async #onClear() {
      await assignPortrait(this.token, null);
      ui.notifications.info(`Portrait removed from ${this.token.name}`);
      this.render();
    }
  }

  /**
   * HUD Button
   */
  Hooks.on("renderTokenHUD", (hud, html, context) => {
    const token = hud.object ?? canvas.tokens.get(context?._id);
    if (!token?.document.isOwner) return;
    const element = (html instanceof HTMLElement) ? html : html?.[0];
    const column = element?.querySelector(".col.right");
    if (!column || column.querySelector(".hover-portrait-library")) return;
    const button = document.createElement("button");
    button.type = "button";
    button.classList.add("control-icon", "hover-portrait-library");
    button.dataset.tooltip = "Portrait Library";
    button.innerHTML = `<i class="fa-solid fa-images" inert></i>`;
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      new PortraitLibrary(token).render({ force: true });
    });
    column.append(button);
  });

  globalThis.HoverPortrait = Object.assign(globalThis.HoverPortrait ?? {}, { PortraitLibrary, assignPortrait });
})();

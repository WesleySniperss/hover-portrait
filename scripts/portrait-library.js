/**
 * Portrait Library UI (classic Application, V13 compatible)
 */

class PortraitLibrary extends Application {
  constructor(token, options = {}) {
    super(options);
    this.token = token;
    this.currentFolder = "";
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "portrait-library",
      title: "Portrait Library",
      width: 650,
      height: 550,
      resizable: true,
      classes: ["portrait-library"],
      template: "modules/hover-portrait/templates/portrait-library.html"
    });
  }

  async getData(options = {}) {
    // Base directory inside REAL public folder
    const baseDir = this.currentFolder === ""
      ? "public/portraits"
      : `public/portraits/${this.currentFolder}`;

    // V13 FilePicker API
    const FP = foundry.applications.apps.FilePicker.implementation;
    const files = await FP.browse("data", baseDir);

    /**
     * Convert Foundry paths → browser paths
     * Foundry returns: "public/portraits/<folder>/<file>"
     * Browser needs:   "/public/portraits/<folder>/<file>"
     */
    const browserFiles = files.files.map(f => {
      const url = `/${f}`;
      const ext = f.split('.').pop().toLowerCase();

      return {
        path: url,
        isImage: ["png", "jpg", "jpeg", "webp"].includes(ext),
        isVideo: ["mp4", "webm"].includes(ext)
      };
    });

    return {
      tokenName: this.token.name,
      dirs: files.dirs,
      files: browserFiles,
      currentFolder: this.currentFolder
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    const jq = $(html);

    // Click portrait to assign
    jq.find(".portrait-entry").click(ev => {
      const path = ev.currentTarget.dataset.path;
      this.token.document.setFlag("hover-portrait", "portraitPath", path);
      ui.notifications.info(`Portrait set for ${this.token.name}`);
      this.close();
    });

    // Click folder
    jq.find(".portrait-folder").click(async ev => {
      let folder = ev.currentTarget.dataset.folder;

      if (folder === "") {
        this.currentFolder = "";
      } else {
        folder = folder.split("/").pop();
        this.currentFolder = this.currentFolder === ""
          ? folder
          : `${this.currentFolder}/${folder}`;
      }

      await this.render(true);
    });

    // ⭐ BACK BUTTON
    jq.find(".portrait-back").click(async ev => {
      // If nested: go up one level
      if (this.currentFolder.includes("/")) {
        this.currentFolder = this.currentFolder.split("/").slice(0, -1).join("/");
      }
      // If at first level: return to root
      else {
        this.currentFolder = "";
      }

      await this.render(true);
    });
  }
}

/**
 * HUD Button
 */
Hooks.on("renderTokenHUD", (hud, html, data) => {
  const token = canvas.tokens.get(data._id);
  if (!token) return;

  const jq = $(html);

  const btn = $(`<div class="control-icon"><i class="fas fa-images"></i></div>`);
  btn.attr("title", "Portrait Library");

  btn.click(() => {
    new PortraitLibrary(token).render(true);
  });

  jq.find(".col.right").append(btn);
});

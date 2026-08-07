console.log("Hover Portrait: module.js loaded");

Hooks.once("init", () => {
  console.log("Hover Portrait: registering settings");

  // Border style selector
  game.settings.register("hover-portrait", "borderStyle", {
    name: "Hover Portrait Border Style",
    hint: "Choose the border style for the hover portrait window.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      none: "None",
      default: "Default",
      fantasy: "Fantasy (Arcane Glow)",
      fire: "Fire (Ember Flame)",
      nature: "Nature (Druidic Green)",
      necromancer: "Necromancer (Blood Red)",
      steel: "Steel (Warrior Frame)",
      gold: "Gold (Wizard Trim)",
      moon: "Moonlight (Silver Glow)",
      dragon: "Dragon (Scaled Border)"
    },
    default: "fantasy"
  });

  // Portrait source: which image to show when no assigned portrait exists
  game.settings.register("hover-portrait", "portraitSource", {
    name: "Hover Portrait Source",
    hint: "Which image to show when hovering a token. An assigned portrait is always preferred; this setting selects the fallback when none is set.",
    scope: "client",
    config: true,
    type: String,
    choices: {
      portrait: "Assigned Portrait",
      actor: "Actor Image",
      token: "Token Image"
    },
    default: "actor"
  });

  // Hover delay
  game.settings.register("hover-portrait", "hoverDelay", {
    name: "Hover Delay",
    hint: "Delay (in milliseconds) before the portrait appears.",
    scope: "client",
    config: true,
    type: Number,
    default: 300
  });

  // Saved portrait position (per-client)
  game.settings.register("hover-portrait", "portraitTop", {
    scope: "client",
    config: false,
    type: Number,
    default: 150
  });

  game.settings.register("hover-portrait", "portraitLeft", {
    scope: "client",
    config: false,
    type: Number,
    default: 150
  });

  // Pin state (per-client)
  game.settings.register("hover-portrait", "portraitPinned", {
    scope: "client",
    config: false,
    type: Boolean,
    default: false
  });
});

// Token inheritance (kept exactly as-is)
Hooks.on("preCreateToken", (document) => {
  const actor = game.actors.get(document.actorId);
  if (!actor) return;

  const saved = actor.getFlag("hover-portrait", "img");
  if (saved) {
    document.updateSource({
      "flags.hover-portrait.img": saved
    });
  }
});

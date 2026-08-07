Hover Portrait
A premium‑quality Foundry VTT module that displays a custom portrait when hovering over tokens.
Includes a sandboxed global portrait picker, auto‑discovered folders, video support, and a clean, modern UI designed for zero ambiguity and maximum usability.

This module is system‑agnostic and works with any game system.


### 🆕 Configurable Portrait Source (NEW in 2.4.1)

Hover Portrait now includes a portrait fallback system that determines what image to show when a token has **no assigned portrait**.

A new client setting is available:


You can choose:

- **Assigned Portrait** — only use portraits explicitly set via the Portrait Library  
- **Actor Image** — fall back to the actor’s `img` (default)  
- **Token Image** — fall back to the token’s texture  

Assigned portraits always take priority.

Thanks to **Apostol Apostolov** for the feature request.


✨ Features
🎨 Custom Hover Portraits
Displays a portrait when hovering over any token.

Supports images and videos (png, jpg, webp, gif, webm, mp4, etc.).

Portraits can be styled with multiple border themes.

Fully stable bottom‑left placement with smooth fade transitions.

https://github.com/user-attachments/assets/d5872024-1832-4887-ac54-da798a3ec429
https://github.com/user-attachments/assets/f2238693-3615-411c-91b6-9749916963e7

🗂️ Global Sandboxed Portrait Picker
The picker has been completely redesigned and now uses a global portrait directory:

Code
Data/portraits/
This replaces the old module‑local path
modules/hover-portrait/assets/portraits.

New Picker Capabilities
Fully custom UI — no Foundry FilePicker.

Browses only inside:

Code
Data/portraits/
Auto‑detects subfolders and builds category buttons.

Clean grid layout with image/video previews.

Back‑button navigation inside the portrait tree.

One‑click assignment to both actor and token flags.

Safe sandboxing: users cannot browse outside Data/portraits/.

https://github.com/user-attachments/assets/c0c27e25-ff21-4ec5-9f7a-9847bf951f60
https://github.com/user-attachments/assets/b48eef90-2641-4764-8497-6e46f8e8e042

📚 Portrait Library UI
A new, modern portrait browser:

Responsive grid layout

Auto‑discovered folders (actors, tokens, npc, custom, etc.)

Smooth transitions and dynamic sizing

Unified with the new picker

Zero UI collisions

🔄 Token Inheritance
Newly created tokens automatically inherit the actor’s saved portrait.

🧩 Zero Interference
No UI collisions.

No resizing logic (removed for stability).

No reliance on deprecated Foundry globals.

No global token hooks — everything is scoped and safe.

📦 Installation
Method 1: Install via Manifest URL
Paste this URL into Foundry’s “Install Module” dialog:
https://raw.githubusercontent.com/Ramz1337/hover-portrait/main/module.json

Method 2: Install from GitHub
Download the ZIP from:

hover-portrait-v2.4.0.zip (update link when publishing release)

Extract it into your Foundry Data/modules folder.

Ensure the directory is named:hover-portrait

Portrait Directory Setup
Create the global portrait directory: Data/portraits/

You may add any subfolders you like:

Data/portraits/actors/
Data/portraits/tokens/
Data/portraits/npc/
Data/portraits/custom/





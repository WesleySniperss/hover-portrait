Hover Portrait Module
A streamlined portrait‑management and display system for Foundry VTT, using a global portrait directory located directly under the Foundry Data root. Includes a custom sandboxed picker, dynamic portrait handling, and integration with Hover Portrait v2.3.0.

📁 Directory Structure
Global Foundry Data Directory
All portrait assets live in a root‑level directory, not inside the module:

Code
Data/
├─ portraits/                 ← REQUIRED global portrait directory (lowercase)
│   ├─ actors/
│   ├─ tokens/
│   ├─ npc/
│   └─ custom/
│
└─ modules/
    └─ hover-portrait/        ← Module directory
        ├─ scripts/
        │   ├─ hover-portrait.js
        │   ├─ portrait-picker.js
        │   └─ portrait-library.js
        ├─ styles/
        │   └─ hover-portrait.css
        └─ module.json
Portrait Directory Rules
Required root:

Code
Data/portraits/
The module never stores portraits inside its own folder.

The custom picker:

Locks navigation to Data/portraits/

Auto-discovers all subfolders

Prevents browsing above the root

Supports back-navigation and safe media filtering

🎨 Features
🔒 Sandboxed Global Portrait Picker
A custom picker replacing Foundry’s default FilePicker for portraits:

Rooted at Data/portraits/

Auto-discovers nested folders

Supports PNG, JPG, WEBP, and Foundry-safe formats

Prevents access to any other Data directories

Clean back-button navigation

Fully player-safe (no write access)

🖼️ Portrait Library UI
Displays all portraits in a responsive grid

Folder-based categorization (actors, tokens, npc, custom)

Drag-to-select and quick-assign behavior

Smooth transitions and dynamic sizing

🧩 Hover Portrait Integration
Selected portraits update the static bottom-left portrait frame

Portraits persist across reloads

No global token hooks

No “apply to all tokens” behavior — strictly scoped

⚙️ Installation
Place the module folder here:

Code
Data/modules/hover-portrait/
Ensure the global portrait directory exists:

Code
Data/portraits/
Add any subfolders you want:

Code
Data/portraits/actors/
Data/portraits/tokens/
Data/portraits/npc/
Data/portraits/custom/
Enable Hover Portrait in:

Game Settings → Manage Modules

🗂️ Adding Portraits
Simply drop image files anywhere under:

Code
Data/portraits/
The module will automatically:

Detect new folders

Display images in the library

Restrict navigation to the portrait tree

🔧 Developer Notes
All portrait access is routed through the custom picker.

The picker uses Foundry v13+ safe path resolution.

Portrait selections are stored using game.settings.

The module avoids global hooks and global token overrides.

Designed for clean integration with your custom UI logic.

📜 License
MIT License — free to use, modify, and redistribute.

📬 Support
Open an issue on the module’s repository for bugs, feature requests, or contributions.

![full](https://github.com/user-attachments/assets/d5872024-1832-4887-ac54-da798a3ec429)
![icon](https://github.com/user-attachments/assets/f2238693-3615-411c-91b6-9749916963e7)



![box](https://github.com/user-attachments/assets/c0c27e25-ff21-4ec5-9f7a-9847bf951f60)

![options](https://github.com/user-attachments/assets/b48eef90-2641-4764-8497-6e46f8e8e042)





### **Method 2: Install from GitHub**

1. Download the ZIP from:
2. [hover-portrait-v2.3.2.zip](https://github.com/user-attachments/files/24404138/hover-portrait-v2.3.2.zip)
4. Extract it into your Foundry `Data/modules` folder.
5. Make sure the directory is called hover-portrait
6. Restart Foundry and enable the module.








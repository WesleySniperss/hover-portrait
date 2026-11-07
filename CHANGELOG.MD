# Changelog

All notable changes to Hover Portrait will be documented in this file.
The format follows Keep a Changelog,
and this project adheres to Semantic Versioning.

---

## [2.5.0] – 07-11-2026
### Fixed (Foundry v14)

    Hover portraits show out of the box again: the Portrait Source setting described for 2.4.1 was missing from
    the code. hover-portrait.portraitSource is a client setting with these choices:
        - Assigned Portrait only
        - Actor Image (default; else the token image)
        - Token Image
    The actor image is shown only to users who may see the actor (Limited or more), others get the token image.
    The default mystery-man art is never shown.

    Portrait Library opened with an error when its folder did not exist. It now looks in Data/portraits (as
    documented) and in Data/public/portraits (2.4.x), and creates Data/portraits for the GM when neither exists.

    Portraits assigned by older versions (flag "img" on the token or actor) are shown too.

    Every portrait added mouse listeners to the window that were never removed; dragging now cleans up after itself.

    A portrait position saved on a larger screen is brought back into the window.

### Changed

    Portrait Library is an ApplicationV2 window (no V1 Application or jQuery).
    New "Choose a file…" button (any image or video, through Foundry's file picker) and "Remove portrait".
    Assigning a portrait sets it on the token and on its actor, so the actor's other tokens and new ones show it too.
    Compatibility: Foundry v13 to v14.

---

## [2.4.1] – 08‑08‑2026
### Added

    Configurable hover portrait source with actor/token fallback.
    Introduced a new client setting:
        hover-portrait.portraitSource

    This setting determines which image Hover Portrait displays when a token has no assigned portrait:
        - Assigned Portrait: only use an explicitly assigned portrait (previous behavior)
        - Actor Image: fall back to the linked actor’s img
        - Token Image: fall back to the token’s texture

    Assigned portraits (via the Portrait Library) always take priority when present.
    Default is Actor Image, allowing hover portraits to work out-of-the-box.

    Thanks to Apostol Apostolov for the feature request.

### Improved

    Smoothed fallback resolution logic for consistent portrait selection across linked and unlinked tokens.
    Cleaned up internal portrait-fetching flow to reduce redundant lookups and improve performance.

### Fixed

    Corrected cases where unlinked tokens without assigned portraits displayed nothing despite having actor/token images.
    Patched a timing issue where fallback images could briefly flash before the assigned portrait loaded.

---

## [2.4.0] – 06‑08‑2026
### Added

    Global portrait directory support using the new root‑level path:
        Data/portraits/
    Replaces all module‑local portrait storage.

    New sandboxed portrait picker rooted strictly at Data/portraits/ with:
        Auto‑discovered subfolders
        Back‑button navigation
        Safe media filtering
        No access above the root directory

    New Portrait Library UI with responsive grid layout and folder categorization.
    Full integration with Hover Portrait v2.3.x using the new global portrait system.
    Dynamic portrait assignment flow using the new picker + library combination.
    Updated path resolution for Foundry v13+ using safe, browser‑facing asset paths.

### Improved

    Strengthened picker sandboxing to guarantee users cannot escape Data/portraits/.
    Unified portrait selection logic across picker, library, and hover display.
    Cleaned up internal structure to remove legacy module‑local portrait references.
    Improved UI responsiveness and sizing behavior in the portrait library.
    Refactored portrait-library.js and portrait-picker.js for clarity and future maintainability.
    Enhanced media-type handling (png/jpg/webp) with consistent preview behavior.

### Fixed

    Corrected path resolution issues caused by Foundry v13’s updated FilePicker API.
    Eliminated incorrect module-relative paths that caused missing portrait previews.
    Fixed hidden-state issues in the portrait library when switching folders rapidly.
    Resolved picker navigation bugs when returning from nested folders.
    Patched rare timing issues where the hover portrait could load before the wrapper was visible.

---

## [2.3.2] – 02‑01‑2026
### Fixed

    Resolved a second race condition where the portrait could still spawn off‑screen during rapid hover events.
    Corrected measurement timing by ensuring the wrapper becomes visible before calculating width/height.
    Prevented zero‑height/zero‑width measurement errors caused by fade-out transitions.
    Eliminated rare drift caused by cached images loading before the wrapper was unhidden.

### Improved

    Strengthened bottom‑left anchoring logic for guaranteed stability under rapid hover spam.
    Unified visibility + measurement flow across all media types (images + videos).
    Cleaned up positionBottomLeft() for clarity and future maintainability.

### Added

    Full v2.3.2 compatibility across all scripts.
    Final stability patch ensuring the portrait never jumps off‑screen.

---

## [2.3.1] – 02‑01‑2026
### Fixed

    Resolved a race condition where the portrait window could spawn off‑screen until the user hovered again.
    Corrected bottom‑left anchoring by moving positioning logic into the media load callback.
    Eliminated drift caused by position: absolute by switching the wrapper to position: fixed.
    Ensured wrapper height/width are measured only after the portrait is fully rendered.
    Updated FilePicker API usage in filepicker.js to the modern v13+ interface.

### Improved

    Hardened viewport clamping to prevent negative or invalid positions.
    Cleaned up internal structure for consistency across all scripts.
    Improved modal cleanup logic in the custom picker (even though it is not currently active).
    Polished CSS for stability and future‑proofing.

### Added

    Version headers to all scripts for clarity.
    Full v2.3.1 compatibility across hover.js, module.js, filepicker.js, and styles.css.

---

## [2.3.0] – 01‑01‑2026
### Fixed

    Resolved a major invisible‑overlay bug where the portrait wrapper continued blocking UI elements after fade‑out.
    Corrected pointer‑event handling to ensure no dead zones remain on the screen.
    Wrapper now fully hides using the new .hidden class and display: none after fade‑out.

### Improved

    Updated fade logic for smoother transitions and proper cleanup.
    Strengthened bottom‑left static placement logic for consistent behavior across resolutions.
    Improved internal structure to support future ApplicationV2 picker integration.

### Added

    New .hidden CSS state for wrapper and portrait to ensure proper UI cleanup.
    Safety timeout to guarantee wrapper removal even if fade‑out is interrupted.

---

## [1.0.1] – 26‑12‑2025
### Added

    Initial public release of Hover Portrait.
    Custom sandboxed portrait picker with:
        Auto‑discovered portrait folders
        Category buttons
        Grid layout with image/video previews
        One‑click assignment to actor + token flags

    Hover portrait display system with:
        Border style selector
        Pinned portrait support
        Video support (webm, mp4, ogg, m4v)
        Token inheritance: new tokens automatically inherit actor portrait

    Full Foundry v13 compatibility.
    Clean, isolated CSS with no UI collisions.

### Changed

    Updated FilePicker calls to the v13+ namespace.
    Removed all resizing logic for stability and predictability.

### Fixed

    HUD button injection logic improved for compatibility across systems.
    Eliminated deprecated API warnings related to FilePicker.

---

## [Unreleased]
### Planned

    Search bar for portraits.
    Breadcrumb navigation.
    Additional border themes.

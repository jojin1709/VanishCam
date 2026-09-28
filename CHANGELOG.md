# Changelog

All notable changes to VanishCam are documented here.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).

## [0.2.0] - 2026-09-28

### Added

- App icon (16/32/48/128 px) wired into the manifest and README
- Mic on/off toggle — release the microphone when snap listening is off
- AudioWorklet-based snap detector with automatic ScriptProcessor fallback
- Empty-room photo is saved locally and restored on reload (with a "forget saved room" button)
- Dissolve duration and particle density sliders (persisted)
- Global shortcuts via the Chrome commands API (`Ctrl/Cmd+Shift+X`, `Ctrl/Cmd+Shift+H`) — work even when the Meet tab is not focused; editable at `chrome://extensions/shortcuts`
- UI translations: English, German, Spanish (follows the browser language)
- Warning when Meet re-opens the camera (video effects / device switch) so the empty room is recaptured
- `CHANGELOG.md`, `.gitignore`, `.github/FUNDING.yml`
- CI workflow: manifest validation + JS syntax checks on every push
- `docs/CHROME_WEB_STORE.md` — store submission checklist
- Demo illustration in the README

### Fixed

- Pipeline leak: a second `getUserMedia` call now destroys the previous render pipeline instead of leaving it running
- Broken Discussions link in the issue-template config (Discussions now enabled)

### Changed

- README restructured: browser support, settings, shortcuts and testing sections
- Version bumped to 0.2.0

## [0.1.0] - 2026-09-28

### Added

- First release
- Finger-snap detection with adjustable sensitivity
- Particle dissolve / reassemble effect on the camera feed
- One-click empty-room capture
- Manual vanish/return button and in-page shortcuts
- 100% local processing — no server, no telemetry

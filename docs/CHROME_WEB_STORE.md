# Chrome Web Store submission — checklist

VanishCam isn't on the store yet. Publishing needs **your** Chrome Web Store
account and a one-time **US$5 developer registration fee** — nothing here can be
done from the CLI, but everything you need is prepared below.

## 1. Account

1. Sign in to <https://chrome.google.com/webstore/devconsole> with your Google account.
2. Pay the one-time **$5 registration fee**.
3. Accept the developer agreement.

## 2. Package the ZIP

The ZIP must contain the extension files **at the root** (no outer folder):

```powershell
# run from the repository root
Compress-Archive -Path manifest.json, background.js, bridge.js, i18n.js, `
  effect.js, snapdetect.js, inject.js, icons -DestinationPath VanishCam-store.zip
```

CI already builds this folder as the `VanishCam-extension` artifact
(`.github/workflows/ci.yml`) — download it from the Actions tab and zip it.

## 3. Listing assets

| Asset | Size | Source |
|---|---|---|
| Icon 128×128 | 128×128 | `icons/icon128.png` |
| Small promo tile | 440×280 | crop from `assets/demo.png` |
| Screenshots | 1280×800 or 640×400 (min 5, max 5) | your Meet screen recordings |
| Store icon | 128×128 | `icons/icon128.png` |

Screenshots that work well: pill button visible · before/after vanish ·
the settings panel · snap mid-dissolve.

## 4. Store listing text

**Title:** VanishCam — Snap to vanish in Google Meet

**Summary (132 chars max):**
```
Snap your fingers and vanish from your own video in Google Meet. 100% local, no server, no data sent.
```

**Description:**

```text
Snap your fingers and vanish from your own video in Google Meet.

You stay in the call — your picture dissolves into particles and leaves an
empty room behind, until you snap again.

HOW IT WORKS
1. Join a Meet call and click "capture empty room".
2. Step out of frame for 3 seconds, sit back down.
3. Snap your fingers — you dissolve into particles and disappear.
4. Snap again — you reappear.

FEATURES
• Finger-snap detection with adjustable sensitivity
• Particle dissolve / reassemble effect
• One-click empty-room capture, saved locally
• Manual vanish/return button and global shortcuts (Ctrl+Shift+X / H)
• Dissolve duration and particle amount controls
• English, German and Spanish interface
• Nothing is uploaded: no server, no account, no analytics

Developed by JOJIN JOHN.
```

**Category:** `Accessibility` or `Entertainment`
**Language:** English

## 5. Privacy practices tab (this is where listings get rejected)

- **Single purpose:** "Modify the user's video stream in Google Meet calls."
- **Permission justifications:**
  - `microphone` — "Listens locally for a finger-snap sound to trigger the effect.
    Audio is analysed in memory and never stored, recorded or transmitted."
  - `video stream / tab capture` (implicit via `getUserMedia` hook) — "Draws the
    camera feed to a local canvas to render the particle effect; frames never leave
    the page."
  - `storage` — "Saves the user's settings and captured empty-room photo in
    localStorage, on meet.google.com only."
  - `tabs` / commands — "Runs the user-chosen keyboard shortcuts."
- **Data collection:** check **"No, I do not collect user data"** — this is true
  and must stay true. CI enforces it (`scripts/validate.js` fails on any network API).
- **Remote code:** "No" — everything ships in the package.

## 6. Review

- First review typically takes **1–3 days** (up to a week if manual review).
- If rejected, the most common reasons for this kind of extension:
  - unclear permission justification (use the wording above)
  - screenshot with readable Meet/Google branding — blur it
  - undeclared data collection — we collect none
- After approval: updates re-review, usually within hours.

## 7. After approval

- [ ] Add the Web Store badge to the README and the showcase site
- [ ] Point the website's Download button at the store listing
- [ ] Update `docs/CHROME_WEB_STORE.md` status to *published*
- [ ] Keep `version` in `manifest.json` in sync with each release

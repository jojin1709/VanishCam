<div align="center">

# ✨ VanishCam

### Snap your fingers and vanish from your own video in Google Meet

**You stay in the call — your picture just dissolves into particles and leaves an empty room behind, until you snap again.**

<br/>

[![Manifest V3](https://img.shields.io/badge/Manifest-V3-0D1117?style=flat-square&labelColor=0D1117&logo=googlechrome&logoColor=7B61FF)](https://developer.chrome.com/docs/extensions/)
[![Chrome](https://img.shields.io/badge/Chrome-100%2B-0D1117?style=flat-square&labelColor=0D1117&logo=googlechrome&logoColor=7B61FF)](https://www.google.com/chrome/)
[![Local Only](https://img.shields.io/badge/100%25-Local-0D1117?style=flat-square&labelColor=0D1117&color=2EA043)](#privacy)
[![No Server](https://img.shields.io/badge/No-Cloud_No_Account-0D1117?style=flat-square&labelColor=0D1117&color=2EA043)](#privacy)
[![Privacy](https://img.shields.io/badge/Zero-Data_Sent-0D1117?style=flat-square&labelColor=0D1117&color=2EA043)](#privacy)
[![License](https://img.shields.io/badge/Open-Source-0D1117?style=flat-square&labelColor=0D1117&color=7B61FF)](#license)

<br/>

![](https://img.shields.io/badge/Snap-Trigger-7B61FF?style=for-the-badge&labelColor=0D1117)
&nbsp;![](https://img.shields.io/badge/Particle-Dissolve-7B61FF?style=for-the-badge&labelColor=0D1117)
&nbsp;![](https://img.shields.io/badge/Empty-Room-7B61FF?style=for-the-badge&labelColor=0D1117)
&nbsp;![](https://img.shields.io/badge/Mic-Snap_Detect-7B61FF?style=for-the-badge&labelColor=0D1117)
&nbsp;![](https://img.shields.io/badge/No-Server-7B61FF?style=for-the-badge&labelColor=0D1117)

<br/>

**Developed by [JOJIN JOHN](https://github.com/jojin1709)**

</div>

---

> [!TIP]
> **TL;DR:** install it, click `capture empty room`, step out of frame for 3 seconds, sit back down — then snap your fingers to disappear. Snap again to come back.

---

## Table of Contents

- [What is VanishCam?](#what-is-vanishcam)
- [Install](#install)
- [How to use it](#how-to-use-it)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Troubleshooting](#troubleshooting)
- [How it works](#how-it-works)
- [Privacy](#privacy)
- [Honest scope](#honest-scope)
- [License](#license)
- [Support](#support)

---

## What is VanishCam?

VanishCam is a tiny Chrome extension for Google Meet that makes you disappear from your own video — triggered by a normal finger snap.

- **👆 Snap to vanish** — a sharp snap dissolves your picture into particles and leaves the captured empty room behind.
- **🫥 Snap to return** — snap again and you reappear, right where you were.
- **📷 Empty-room capture** — one click takes a photo of your room while you're out of frame; that photo becomes the background you vanish into.
- **🎚 Adjustable sensitivity** — a slider tunes how hard you have to snap, so talking or knocking won't trigger it.
- **🧩 Fully local** — camera frames and microphone audio never leave your browser. No server, no account, no network calls.

It works fine offline (aside from the call itself).

---

## Install

**(3 minutes, no terminal needed)**

1. At the top of this page, click the green **`Code`** button → **`Download ZIP`**.
2. Unzip the downloaded file (just double-click it). You'll get a folder, something like `VanishCam-main`.
3. Move that folder somewhere it won't get lost, for example your `Documents` folder. Don't delete or rename the files inside it.
4. Open Chrome and go to: `chrome://extensions`.
5. Turn on **`Developer mode`** (toggle in the top right of the page).
6. Click the **`Load unpacked`** button that appears on the left, and select the folder from step 3.
7. The extension now shows up in the list. Done — open Google Meet (reload the tab if it was already open).

> [!NOTE]
> It's normal that Chrome doesn't offer a one-click install like it does for the Chrome Web Store. This is a personal extension, not published in the store, so it needs `Developer mode` to load. That's not dangerous — it's Chrome's standard way of loading extensions from outside the store.

---

## How to use it

1. Join a Meet call and allow camera and microphone access when the browser asks.
2. A small dark pill button appears in the top left. Click it, then click **`capture empty room`**.
3. Step out of frame for about 3 seconds — the extension takes a photo of the empty room.
4. Sit back down. The status will change to **`armed`**, meaning it's ready.
5. Snap your fingers (a normal, sharp snap). You'll dissolve into particles and disappear from the video. Snap again to come back.

<details>
<summary><strong>Backup triggers if the snap isn't heard</strong></summary>

- Click the **`vanish / return`** button in the panel.
- Use the shortcut **`Ctrl` + `Shift` + `X`** (`Cmd` + `Shift` + `X` on macOS).
- Hide the pill button itself while recording: **`Ctrl` + `Shift` + `H`**.

</details>

---

## Keyboard shortcuts

| Shortcut | Action |
|:---:|---|
| `Ctrl` + `Shift` + `X` | Vanish / return |
| `Ctrl` + `Shift` + `H` | Hide / show the pill button |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| **Not reacting to snaps** | Open the panel (click the status text) and move the `snap sensitivity` slider to the right (more sensitive). |
| **Triggers on its own** (talking, knocking) | Move the same slider to the left (less sensitive). |
| **The disappearing looks messy / leaves a trace** | The lighting changed since you clicked `capture empty room` — click it again right before the call. |
| **The button never shows up** | Reload the Meet tab after installing, and check that `Developer mode` is on and the extension is enabled (toggle is blue) on `chrome://extensions`. |

> [!TIP]
> Keep the camera still and the lighting steady while the extension is running, otherwise the saved "empty room" stops matching reality.

---

## How it works

```text
snap-main/
├── manifest.json    ← Manifest V3 config — runs on meet.google.com only
├── inject.js        ← content-script glue: hooks into the Meet call UI
├── snapdetect.js    ← microphone listener: detects a sharp finger snap
└── effect.js        ← particle engine: dissolves your frame into dust
```

1. **Detect** — `snapdetect.js` listens to the microphone and watches for the sharp transient of a finger snap (tunable via the sensitivity slider). The audio is analysed in memory and never recorded.
2. **Capture** — `effect.js` stores a still photo of your empty room as the replacement background.
3. **Dissolve** — on a snap, your video frame is replaced particle-by-particle until only the empty room remains. Snap again to reverse it.

Everything runs inside the Meet tab as a content script — no background service, no network requests.

---

## Privacy

> [!IMPORTANT]
> Everything happens locally, inside your browser.

- **No video leaves your machine** — camera frames are processed in the page and never sent anywhere.
- **No audio leaves your machine** — the microphone is only used to listen for the finger snap itself; audio is never stored or recorded.
- **No server** — this extension talks to no backend, has no account, no telemetry, and no analytics.
- **Works offline** — aside from the Meet call itself, nothing requires an internet connection.

---

## Honest scope

| Thing | What it really does |
|---|---|
| **Snap detection** | Audio-based; may need the sensitivity slider tuned for your mic/room |
| **Empty room** | A single captured photo — lighting changes will show |
| **Works on** | Google Meet in Chrome (`meet.google.com` only) |
| **Distribution** | Loaded unpacked via `Developer mode` — not on the Chrome Web Store |

These limitations are surfaced in the UI and docs rather than hidden.

---

## License

Free and open-source. Fork it, use it, improve it.

---

## Support

Free and open-source. If it saves you time, ⭐ **star the repo** — it helps others discover the project.

<div align="center">

### ❤️ Sponsor jojin1709

<a href="https://github.com/sponsors/jojin1709"><img src="https://img.shields.io/badge/GitHub_Sponsors-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="Sponsor on GitHub" height="32"></a>&nbsp;
<a href="https://github.com/sponsors/jojin1709"><img src="https://img.shields.io/badge/Become_a_Sponsor-EA4AAA?style=for-the-badge&logo=githubsponsors&logoColor=white" alt="Become a Sponsor"></a>

<br/>

<a href="https://github.com/jojin1709/VanishCam/stargazers"><img src="https://img.shields.io/badge/⭐_Star-7B61FF?style=for-the-badge&logo=github&logoColor=white" alt="Star on GitHub"></a>

**Developed by JOJIN JOHN**

</div>

> **Only use this on your own camera feed and in meetings you're part of.**

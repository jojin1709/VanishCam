# Security Policy

## Reporting a vulnerability

VanishCam runs on your camera feed and microphone, so we take security seriously.

**Do not open a public issue for a security vulnerability.**

Report it privately instead:

- **GitHub private advisory:** https://github.com/jojin1709/VanishCam/security/advisories/new
- **Or contact the maintainer directly:** https://github.com/jojin1709

Please include:

1. What the vulnerability is and how to reproduce it
2. The affected file(s) and version/tag
3. What an attacker could gain (e.g. video/audio exposure, code execution)
4. Any suggested fix, if you have one

## What to expect

- Acknowledgement as soon as possible
- A fix or mitigation decision before any public disclosure
- Credit in the advisory if you want it (your choice)

## Scope

In scope:

- Camera or microphone data leaving the browser
- Any unexpected network request added to the extension
- Code execution in the Meet page beyond what the effect needs
- Content-script isolation or manifest misconfiguration

Out of scope:

- Google Meet's own behaviour
- Issues that require you to already control the victim's machine
- Social-engineering of the extension user

## Supported versions

Only the [latest release](https://github.com/jojin1709/VanishCam/releases/latest)
receives security fixes.

# Contributing to VanishCam

Thanks for caring about this project. Please read this before opening anything.

## Rules of the road

VanishCam is **proprietary, not open source** (see [LICENSE.txt](LICENSE.txt)).
The code is public so people can review it — not so people can reuse it.

**Allowed without asking:**

- Report bugs via [bug report](.github/ISSUE_TEMPLATE/bug_report.md)
- Suggest features via [feature request](.github/ISSUE_TEMPLATE/feature_request.md)
- Ask questions and discuss ideas in issues
- Fix something in your **private** fork and propose it back here

**Always requires permission first:**

- Redistributing, rebranding, or re-uploading any part of this code
- Using any file or snippet in your own project
- Publishing a modified version of VanishCam
- Adding a new dependency, changing the license, or renaming the project

When in doubt, open an issue and ask.

## How to propose a fix

1. Open an issue describing the bug **before** writing code — so we don't duplicate work.
2. Fork the repository. Keep your fork private until it's approved for a PR.
3. Make the smallest change that fixes the problem.
4. Manually verify it in Google Meet:
   - the pill button appears,
   - `capture empty room` works,
   - snap detection triggers and un-triggers,
   - the sensitivity slider behaves.
5. Open a pull request using the [PR template](.github/PULL_REQUEST_TEMPLATE.md).
6. Describe what you changed, why, and how you tested it.

## Code style

- Plain JavaScript, no build step, no bundler — keep it that way.
- No comments-for-the-sake-of-comments; clear names instead.
- No new files or frameworks without prior discussion in an issue.
- Never add network requests, analytics, or telemetry. Ever.
- Keep the privacy guarantee: no camera frame or audio may leave the page.

## Code of conduct

By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Security

Do **not** open a public issue for vulnerabilities. Follow [SECURITY.md](SECURITY.md).

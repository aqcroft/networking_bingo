# Agent and contributor instructions

These rules apply to EVERY code, interface, wording, behaviour or accessibility change in this repository.

1. Update the current version in **version.js**, the sole source of truth for the version displayed by the app. Do not hard-code a second competing version in other files. Use semantic versioning: patch for fixes or wording/UI polish; minor for new functionality; major only for intentionally incompatible changes.
2. Add a short, dated entry to **CHANGELOG.md** for each release. Update the recent-changes array in **version.js** to reflect the same release.
3. If the app later gains a service worker, cache manifest or other cached build assets, update the cache version with each release and check mobile clients receive the new files.
4. Preserve a no-account, no-lead-capture, low-friction, mobile-first game. Avoid trackers, paywalls, advertisements and third-party dependencies unless explicitly approved.
5. Keep the content warm, relatable, cheeky, and appropriate for British business networking. Use British English, the phrase 'one-to-one' rather than 'coffee chat', and simple hyphens instead of en/em dashes in published copy.
6. Keep the full 25-square 5 × 5 board with NO free centre square. If changing descriptions, check both mobile legibility and the exported image. Preserve the fixed square positions and the six rank thresholds unless intentionally releasing a new edition.
7. Check gameplay after every change: rank thresholds, persistence, one-time first-row/column/diagonal modals, combined wins, glowing lines, full house, reset, and copy/share/save.
8. Keep changes accessible: buttons must be keyboard-operable, state reflected in aria-pressed, and important status available to screen readers.
9. Update README instructions if publishing, installation, or user actions change.
10. Do not claim the website is live merely because files were committed: GitHub Pages must be enabled and a published link checked.

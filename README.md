# Networking Bingo 😂

A mobile-friendly, tongue-in-cheek Bingo game about the embarrassing, surprising and genuinely lovely moments of business networking.

**Version:** maintained in [version.js](./version.js). This is the single source of truth for the current app version and the recent-changes panel.

## What it does

- A 5 × 5 board with 24 tickable networking experiences and a free centre space.
- Detects rows, columns and diagonals automatically. Two complete lines = Double Bingo; all 24 experiences = Full House.
- Saves your ticks locally in your browser. No account, tracking, forms or lead capture.
- Creates a shareable PNG of the completed card, including a visible game URL and a scannable QR code.
- Offers one-tap WhatsApp sharing with a prewritten invitation and clickable game link.
- Native phone image sharing includes the invitation text where supported (some receiving apps ignore image captions).
- The QR code is stored locally in `qr-code.js`; there are no remote QR services or extra tracking requests.
- Offers a copyable text result for LinkedIn and an easy Reset button.
- No external libraries, build system, or paid hosting required.

## Publish the website

This repository is public, but **GitHub Pages must still be switched on** before the game has a public playable link.

1. Open [Settings → Pages](https://github.com/aqcroft/networking_bingo/settings/pages) in a browser whilst signed in.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose **main** as the branch and **/(root)** as the folder.
4. Save, then revisit the Pages settings to obtain the live website URL.

The expected GitHub Pages address is https://aqcroft.github.io/networking_bingo/ **after publishing completes**. Do not share it as live until you have opened and checked it.

On a phone, GitHub's website in your browser may be easier than the GitHub mobile app for finding repository settings.

## How to edit the board

Open [app.js](./app.js) and edit the SQUARES array at the top. There must be exactly 25 entries in a 5 × 5 grid, with the free space at index 12 (the thirteenth square). Each label is a concise, self-explanatory phrase displayed both on the card and the exported image; full is the longer accessible description. When editing, prioritise clarity over cryptic shorthand, and check the words fit on narrow mobile screens and on the PNG.

The board is intentionally fixed, not shuffled, so people playing from the same LinkedIn post see the same squares.

## How to test

Open the published website on mobile and desktop:

1. Tick and untick some squares; refresh and confirm they remain selected.
2. Complete a horizontal row, vertical column, and diagonal. Check that lines are counted once each.
3. Complete two lines to see Double Bingo; complete all 24 experiences for Full House.
4. Try Share my card and Save image; confirm that the PNG contains your marked squares, score, full URL and a scannable QR code.
5. Scan the exported QR code with another phone and check it opens the correct game.
6. Try WhatsApp and check the generated invitation contains a clickable link and your score.
7. Confirm native image sharing preserves the link where supported; it can legitimately be stripped by receiving apps.
8. Reset, refresh, and check that the centre free space remains selected and everything else is blank.

## Versioning and changes

Follow [AGENTS.md](./AGENTS.md) for every code change. Update version.js and [CHANGELOG.md](./CHANGELOG.md) together. Use patch versions for small fixes and minor versions for feature updates. Keep dates and wording in UK English.

## Status

**Prototype (v0.3.1).** The wording of the squares and visual presentation can be refined following feedback. The project is not presented as an official Business Buzz product.

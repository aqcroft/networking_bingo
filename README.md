# Networking Bingo 😂

A mobile-friendly, tongue-in-cheek Bingo game about the embarrassing, surprising and genuinely lovely moments of business networking.

**Version:** maintained in [version.js](./version.js). This is the single source of truth for the current app version and the recent-changes panel.

## What it does

- A mobile-friendly 5 x 5 board of square tiles with **25 networking moments** and no free centre square.
- A balanced mix of eight positive experiences, eight silly mishaps and nine cringe-worthy ones. The same board appears for everyone.
- Your current title and six rank badges: Networking Newbie (0), Small-Talk Survivor (5), Chatterbox Champion (10), Networking Ninja (15), Social Supremo (20), and Galaxy's Greatest Greeter (25). The badge strip displays icons and numbers only.
- Detects completed rows, columns and diagonals. Newly completed lines briefly glow, then stay highlighted.
- A first completed row, column and diagonal get separate one-time celebrations (combined when earned together); completing all 25 squares gets Full House. Additional lines don't interrupt play.
- Ticks and earned line-type celebrations are kept in local browser storage; resetting clears both. Edition 1 starts afresh because the squares are different from the previous prototype.
- Creates a shareable PNG of your marked card, current rank and rank icons, with a visible URL and offline, scannable QR code.
- Dedicated WhatsApp invitation with the game link and score; native image sharing includes the invitation text where the receiving app allows it.
- No account, trackers, forms, advertising, external code libraries or lead capture.


## Publish the website

This repository is public, but **GitHub Pages must still be switched on** before the game has a public playable link.

1. Open [Settings → Pages](https://github.com/aqcroft/networking_bingo/settings/pages) in a browser whilst signed in.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose **main** as the branch and **/(root)** as the folder.
4. Save, then revisit the Pages settings to obtain the live website URL.

The expected GitHub Pages address is https://aqcroft.github.io/networking_bingo/ **after publishing completes**. Do not share it as live until you have opened and checked it.

On a phone, GitHub's website in your browser may be easier than the GitHub mobile app for finding repository settings.

## How to edit the board

The 25 scenarios are in the `SQUARES` array at the start of [app.js](./app.js). Short, standalone `label` phrases appear on both the mobile card and exported PNG; `full` descriptions help screen-reader users. There is no free square. Keep the board fixed for comparable results.

The six rank names, thresholds and icons live in `RANKS` in [app.js](./app.js). The current rank is displayed in full and all six thresholds appear in the badge strip, with locked icons faded out.

## How to test

1. Open the site on a mobile-sized screen and check all 25 squares remain square with legible wording.
2. Tick squares to cross each threshold (0, 5, 10, 15, 20, 25). The title and six badges must update without milestone pop-ups.
3. Complete a row, a column and a diagonal in turn. Each **first of its type** should open a single modal; additional lines of that type should only highlight.
4. Confirm completed-line squares remain subtly gold and new lines briefly glow. Unticking an earned line should remove its highlight; reticking it should not open its achievement modal again.
5. If one tap completes multiple first-time line types, it should show **one** combined modal.
6. Tick all 25 squares for Full House and Galaxy's Greatest Greeter, in one celebration. Untick and retick to check the same awards do not fire again.
7. Refresh and confirm ticks and already celebrated types persist. Start again should reset both, with the next row celebrating once again.
8. Try Share my card and Save image. Check the 25 marked squares, badges, rank, URL and QR appear and can be scanned.
9. Test the WhatsApp message and native image sharing (some receiving apps remove accompanying caption text).


## Versioning and changes

Follow [AGENTS.md](./AGENTS.md) for every code change. Update version.js and [CHANGELOG.md](./CHANGELOG.md) together. Use patch versions for small fixes and minor versions for feature updates. Keep dates and wording in UK English.

## Status

**Edition 1 prototype.** Designed as a light-hearted personal project from Adrian Croft. It is not presented as an official Business Buzz or Utility Warehouse product. The app version itself is always defined in version.js.

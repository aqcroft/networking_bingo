# Changelog

All notable changes to Networking Bingo are recorded here. The **current version** is defined only in [version.js](./version.js).

## 0.5.0 - 26th October 2026

- Refreshed the classic card into 25 genuine networking experiences with no free centre square: eight positive, eight everyday/silly mishaps and nine cringeworthy moments.
- Simplified the masthead to "Networking Bingo" with handshake and coffee icons and "The Good. The Bad. The Cringeworthy." as the one subtitle.
- Removed American-style B-I-N-G-O column letters, redundant headings, and the expanded rules panel. Kept a square 5 x 5 layout for mobile.
- Added six alliterative ranks at 0, 5, 10, 15, 20 and 25 squares; show only six icons with thresholds under the board, plus the current rank and score.
- Added persistent highlighting and an initial gold glow on completed rows, columns and diagonals.
- A player's first row, first column and first diagonal can each trigger one celebration, plus one final Full House celebration. Multiple kinds of achievement in one tap are combined in one pop-up. Later lines do not interrupt play.
- Updated WhatsApp and native share copy, the exported 25-square PNG and its milestone icons, while keeping the scannable offline QR code.
- Switched creator attribution to Adrian Croft and aqcroft.com, with no Business Buzz or Utility Warehouse branding.
- Started a new local save key because the 25 scenarios changed; old edition ticks are deliberately not carried over to unrelated scenarios.

## 0.4.0 - 25th October 2026

- Restored true square Bingo tiles on all screen sizes and shortened the longest labels without making them cryptic.
- Retained the traditional BINGO letters across the top and the free central square.
- Reduced interruptions: a big modal for the first Bingo and first Full House, with compact, non-blocking toasts for subsequent newly completed lines.
- Prevented repeat celebrations for lines already earned in the current game, even after unticking and reticking them.
- Simplified the rules panel and removed the three introductory badges.
- Added a discreet footer credit to Adrian Croft and Market Harborough Business Buzz, both on the webpage and the shareable PNG.

## 0.3.1 - 25th October 2026

- Reworded the 24 experiences as clear, self-contained descriptions rather than shorthand labels, whilst keeping their humour.
- Increased mobile card height and improved label readability for longer descriptions.
- Improved PNG export to wrap full square labels and reduce the font size when needed instead of cutting the wording after three lines.
- Preserved existing marked-square history, Bingo scoring, celebrations and sharing functionality.

## 0.3.0 - 25th October 2026

- Added a dedicated WhatsApp share button with a prewritten game invitation, player's score and clickable link.
- Added the same WhatsApp share option to each celebration modal.
- Updated native image sharing to include an accompanying text invitation and URL where the receiving app supports it.
- Added the URL and a scannable QR code to the PNG card export, generated entirely locally from a checked-in QR matrix.
- No third-party QR requests, accounts or new tracking dependencies.

## 0.2.0 - 25th October 2026

- Added a colourful, accessible celebration pop-up whenever a newly completed row, column or diagonal is achieved.
- Celebrations distinguish first Bingo, Double Bingo, additional lines and Full House.
- Added Keep playing and Share card actions, keyboard Escape to close, and reduced-motion support.
- Replaced the unclear "Shoulder-scanned" square with "Looked past you", with a clearer full description.
- Removed the hard-coded version number fallback from the webpage, keeping version.js as the single source of truth.

## 0.1.0 - 25th October 2026

- Created the first mobile-friendly, 5 × 5 Networking Bingo card.
- Added 24 humorous networking scenarios and one free centre square.
- Added live detection of completed horizontal, vertical and diagonal lines, Double Bingo and Full House.
- Added locally remembered ticks, reset, text score copying and sharable PNG card generation.
- Added native mobile sharing where available, plus an image-download fallback.
- Added About and version information, privacy note and GitHub Pages publishing instructions.

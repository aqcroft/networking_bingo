"use strict";

const APP_URL = "https://aqcroft.github.io/networking_bingo/";

const SQUARES = [
  { emoji: "📅", label: "Turned up on the wrong day", full: "Went to a networking event on the wrong date" },
  { emoji: "🎯", label: "Got a sales pitch before hello", full: "Someone immediately tried selling you their services instead of getting to know you - a classic pitch-slap!" },
  { emoji: "👔", label: "Arrived seriously overdressed", full: "Arrived at a networking event dressed much more formally than everyone else" },
  { emoji: "🎤", label: "Froze mid-60-second pitch", full: "Completely lost your train of thought during a 60-second introduction" },
  { emoji: "🤝", label: "Gave a referral, no strings", full: "Recommended someone because they were a good fit, without expecting a referral in return" },
  { emoji: "⏰", label: "Arrived far too early", full: "Turned up ridiculously early for a networking event" },
  { emoji: "🔦", label: "Forgot I was the spotlight", full: "Forgot you were supposed to be the featured speaker or spotlight guest" },
  { emoji: "🫣", label: "Called someone the wrong name", full: "Confidently addressed someone by the wrong name" },
  { emoji: "🚽", label: "Escaped a chat via the loo", full: "Used a trip to the toilet as an excuse to escape a conversation" },
  { emoji: "🎁", label: "Got a surprise referral", full: "Received a lovely referral you weren't expecting" },
  { emoji: "📍", label: "Went to the wrong venue", full: "Arrived at a different venue from the actual networking event" },
  { emoji: "👀", label: "Looked past me for someone else", full: "Someone looked over your shoulder for someone more interesting whilst you were speaking" },
  { emoji: "☕", label: "FREE SPACE", full: "The free middle square - no networking mishap required!" },
  { emoji: "📝", label: "Turned up totally unprepared", full: "Attended a networking event without preparing what to say or bring" },
  { emoji: "💬", label: "One-to-one ran for 2+ hours", full: "Had a one-to-one that carried on for more than two hours" },
  { emoji: "👟", label: "Arrived clearly underdressed", full: "Turned up much more casually dressed than everyone else" },
  { emoji: "🏃", label: "Walked in embarrassingly late", full: "Arrived so late that everyone noticed you walking in" },
  { emoji: "🔄", label: "Gave referral, got none back", full: "Gave someone a referral and secretly hoped they'd reciprocate, but they never did" },
  { emoji: "😬", label: "Recognised face, forgot name", full: "Recognised someone but could not remember their name" },
  { emoji: "💜", label: "Made a real networking friend", full: "Made a friend through networking who is more than just a business contact" },
  { emoji: "⌚", label: "Got the event start time wrong", full: "Turned up on the right day but got the starting time completely wrong" },
  { emoji: "🗣️", label: "Trapped in a sales monologue", full: "Got trapped listening to someone talk about their business without letting you speak" },
  { emoji: "🙋", label: "Introduced myself twice", full: "Introduced yourself to somebody you'd already met or spoken to at an event" },
  { emoji: "🌱", label: "Won business months later", full: "A networking contact became a customer or client months after you first met" },
  { emoji: "🥐", label: "Went partly for the food", full: "Chose to attend a networking event partly because the refreshments sounded good" }
];

const CENTRE = 12;
const STORAGE_KEY = "networking-bingo-selected-v1";
const BOARD = document.getElementById("board");
const SCORE = document.getElementById("score");
const OUTCOME = document.getElementById("outcome");
const LINES = document.getElementById("lines");
const PROGRESS = document.getElementById("progress");
const STATUS = document.getElementById("status");
const LINE_TOAST = document.getElementById("line-toast");
const CELEBRATION = document.getElementById("celebration");
const CELEBRATION_TITLE = document.getElementById("celebration-title");
const CELEBRATION_DETAIL = document.getElementById("celebration-detail");
let lastSelectedSquareIndex = null;

const WIN_LINES = [];
for (let n = 0; n < 5; n++) {
  WIN_LINES.push([0, 1, 2, 3, 4].map(col => n * 5 + col));
  WIN_LINES.push([0, 1, 2, 3, 4].map(row => row * 5 + n));
}
WIN_LINES.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);

function showLineToast(message) {
  if (lineToastTimeout !== null) clearTimeout(lineToastTimeout);
  LINE_TOAST.textContent = message;
  LINE_TOAST.hidden = false;
  lineToastTimeout = setTimeout(() => {
    LINE_TOAST.hidden = true;
    lineToastTimeout = null;
  }, 2600);
}

function hideLineToast() {
  if (lineToastTimeout !== null) clearTimeout(lineToastTimeout);
  lineToastTimeout = null;
  LINE_TOAST.hidden = true;
}

function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter(value => Number.isInteger(value) && value >= 0 && value < 25)
      : [];
  } catch (_) {
    return [];
  }
}

const selected = new Set([...readSaved(), CENTRE]);

// A new line is celebrated only once during the current game. Existing
// completed lines are considered already celebrated when a player returns.
const celebratedLines = new Set(stats().completed.map(line => line.join(",")));
let firstBingoCelebrated = stats().lineCount > 0;
let fullHouseCelebrated = stats().fullHouse;
let lineToastTimeout = null;

function store() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected].filter(i => i !== CENTRE)));
  } catch (_) {
    // The game still works when browser storage is disabled.
  }
}

function stats() {
  const completed = WIN_LINES.filter(line => line.every(i => selected.has(i)));
  const experiences = selected.size - 1;
  return {
    experiences,
    completed,
    lineCount: completed.length,
    fullHouse: experiences === 24,
    diagonal: completed.some(line => (line[0] === 0 && line[4] === 24) || (line[0] === 4 && line[4] === 20))
  };
}

function resultTitle(s) {
  if (s.fullHouse) return "🏠 FULL HOUSE!";
  if (s.lineCount >= 2) return "✌️ DOUBLE BINGO!";
  if (s.lineCount >= 1) return "🎉 BINGO!";
  if (s.experiences >= 15) return "So close... maybe! 😂";
  if (s.experiences >= 8) return "You're a seasoned networker!";
  return "No Bingo... yet!";
}

function announce(message) {
  STATUS.textContent = message;
}

function describeLine(line) {
  if (line[0] === 0 && line[4] === 24 || line[0] === 4 && line[4] === 20) return "a diagonal";
  if (line[1] - line[0] === 1) return "a row";
  return "a column";
}

function showCelebration(before, after, newlyCompleted) {
  if (!newlyCompleted.length) return;
  const winCount = newlyCompleted.length;
  // Only interrupt play for first Bingo and the first Full House.
  // Further lines get a brief toast instead of a repeated modal.
  if (after.fullHouse && !fullHouseCelebrated) {
    fullHouseCelebrated = true;
    hideLineToast();
    CELEBRATION_TITLE.textContent = "FULL HOUSE! 🏠";
    CELEBRATION_DETAIL.textContent = "Every square ticked. You've certainly seen a thing or two at networking events! 😂";
    CELEBRATION.showModal();
  } else if (!firstBingoCelebrated) {
    firstBingoCelebrated = true;
    hideLineToast();
    CELEBRATION_TITLE.textContent = "BINGO! 🎉";
    CELEBRATION_DETAIL.textContent = "You've completed " + describeLine(newlyCompleted[0]) + "! What's your most memorable networking moment?";
    CELEBRATION.showModal();
  } else if (after.lineCount >= 2 && before.lineCount < 2) {
    showLineToast("✌️ Double Bingo! Keep going...");
  } else {
    showLineToast("🎉 " + (after.lineCount === 1 ? "Bingo again!" : after.lineCount + " completed lines!") + (winCount > 1 ? " Nice combo!" : ""));
  }
}

function drawBoard() {
  BOARD.replaceChildren();
  SQUARES.forEach((square, i) => {
    const button = document.createElement("button");
    const marked = selected.has(i);
    button.type = "button";
    button.className = "square" + (marked ? " is-marked" : "") + (i === CENTRE ? " free" : "");
    button.setAttribute("aria-pressed", String(marked));
    button.setAttribute("aria-label", square.full + (marked ? ", checked" : ", not checked"));
    button.innerHTML = '<span class="emoji" aria-hidden="true"></span><span class="square-text"></span>';
    button.querySelector(".emoji").textContent = square.emoji;
    button.querySelector(".square-text").textContent = square.label;
    if (i === CENTRE) {
      button.disabled = true;
      button.title = "Free centre square";
    } else {
      button.addEventListener("click", () => {
        const before = stats();
        if (selected.has(i)) selected.delete(i);
        else selected.add(i);
        store();
        drawBoard();
        updateResults();
        const after = stats();
        const newlyCompleted = after.completed.filter(line =>
          !before.completed.includes(line) && !celebratedLines.has(line.join(","))
        );
        for (const line of newlyCompleted) celebratedLines.add(line.join(","));
        lastSelectedSquareIndex = i;
        if (newlyCompleted.length) {
          showCelebration(before, after, newlyCompleted);
          announce("BINGO! You've completed " + newlyCompleted.length + " new " + (newlyCompleted.length === 1 ? "line" : "lines") + ". 🎉");
        } else {
          announce("");
          BOARD.children[i].focus({ preventScroll: true });
        }
      });
    }
    BOARD.appendChild(button);
  });
}

function updateResults() {
  const s = stats();
  SCORE.textContent = String(s.experiences);
  OUTCOME.textContent = resultTitle(s);
  LINES.textContent = s.lineCount + " completed " + (s.lineCount === 1 ? "line" : "lines") + (s.diagonal ? " - diagonal included!" : "");
  PROGRESS.style.width = (s.experiences / 24 * 100) + "%";
}

function shareText() {
  const s = stats();
  return [
    "I played Networking Bingo! 😂",
    "I ticked " + s.experiences + "/24 squares and completed " + s.lineCount + " " + (s.lineCount === 1 ? "line" : "lines") + "!",
    "Fancy a go? Play it here:",
    APP_URL
  ].join("\n");
}

function openWhatsAppShare() {
  // A prefilled text link is reliable on WhatsApp; attaching an image to the
  // same WhatsApp draft isn't supported by the wa.me deep link.
  const url = "https://wa.me/?text=" + encodeURIComponent(shareText());
  window.open(url, "_blank", "noopener,noreferrer");
}

async function copyScore() {
  const message = shareText();
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(message);
    } else {
      const helper = document.createElement("textarea");
      helper.value = message;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const didCopy = document.execCommand("copy");
      helper.remove();
      if (!didCopy) throw new Error("Copy unavailable");
    }
    announce("Score copied! Paste it into your LinkedIn comment. 👍");
  } catch (_) {
    announce("Copy is unavailable in this browser. You can share or save the image instead.");
  }
}

function roundedRect(ctx, x, y, w, h, r, colour) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fillStyle = colour;
  ctx.fill();
}

function wrapLines(ctx, words, maxWidth) {
  const lines = [];
  let line = "";
  for (const word of words.split(/\s+/)) {
    const trial = line ? line + " " + word : word;
    if (line && ctx.measureText(trial).width > maxWidth) {
      lines.push(line);
      line = word;
    } else line = trial;
  }
  if (line) lines.push(line);
  return lines;
}

// Draw a pre-generated, scannable QR matrix directly onto the exported canvas.
// No network calls, canvas tainting, or third-party QR API.
function drawQrCode(ctx, x, y, size) {
  const qr = window.NETWORKING_BINGO_QR;
  if (!qr || qr.url !== APP_URL || !Array.isArray(qr.rows) || !qr.rows.length) return false;
  const count = qr.rows.length;
  if (qr.rows.some(row => row.length !== count || /[^01]/.test(row))) return false;
  const quietZone = 4;
  const step = size / (count + quietZone * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x, y, size, size);
  ctx.fillStyle = "#131222";
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.rows[row][col] !== "1") continue;
      const x0 = Math.round(x + (col + quietZone) * step);
      const x1 = Math.round(x + (col + quietZone + 1) * step);
      const y0 = Math.round(y + (row + quietZone) * step);
      const y1 = Math.round(y + (row + quietZone + 1) * step);
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    }
  }
  return true;
}

function makeImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1580;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image creation is unavailable");
  const s = stats();

  ctx.fillStyle = "#f6f3ef";
  ctx.fillRect(0, 0, 1080, 1580);
  ctx.fillStyle = "#241a40";
  ctx.fillRect(0, 0, 1080, 221);
  ctx.fillStyle = "#ffd77d";
  ctx.font = "800 25px Arial, sans-serif";
  ctx.fillText("THE NETWORKER'S SURVIVAL GAME", 45, 46);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 82px Arial, sans-serif";
  ctx.fillText("NETWORKING BINGO!", 43, 134);
  ctx.fillStyle = "#e8ddff";
  ctx.font = "27px Arial, sans-serif";
  ctx.fillText("The good. The bad. The cringeworthy.", 46, 183);

  const left = 43;
  const gap = 8;
  const side = (1080 - left * 2 - 4 * gap) / 5;
  const top = 294;
  const rowH = 188;

  "BINGO".split("").forEach((letter, col) => {
    const x = left + col * (side + gap);
    roundedRect(ctx, x, 234, side, 48, 8, "#5b329d");
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 34px Arial, sans-serif";
    ctx.fillText(letter, x + side / 2, 269);
  });

  SQUARES.forEach((square, i) => {
    const row = Math.floor(i / 5);
    const col = i % 5;
    const x = left + col * (side + gap);
    const y = top + row * (rowH + gap);
    roundedRect(ctx, x, y, side, rowH, 13, i === CENTRE ? "#fff0ba" : selected.has(i) ? "#cbeee4" : "#ffffff");
    ctx.textAlign = "center";
    ctx.fillStyle = "#27253a";
    ctx.font = "46px Arial, sans-serif";
    ctx.fillText(square.emoji, x + side / 2, y + 62);
    // Fit the complete phrase on the shared image. Never silently chop off
    // explanatory words, especially on the more unusual networking squares.
    let fontSize = 22;
    let lines = [];
    do {
      ctx.font = "800 " + fontSize + "px Arial, sans-serif";
      lines = wrapLines(ctx, square.label, side - 20);
      if (lines.length <= 4) break;
      fontSize--;
    } while (fontSize >= 17);
    const lineHeight = fontSize + 3;
    const blockTop = y + 95 + Math.max(0, 4 - lines.length) * 8;
    lines.forEach((line, j) => ctx.fillText(line, x + side / 2, blockTop + j * lineHeight));
    if (selected.has(i)) {
      roundedRect(ctx, x + side - 43, y + 10, 32, 32, 16, i === CENTRE ? "#a77300" : "#15775a");
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 24px Arial, sans-serif";
      ctx.fillText(i === CENTRE ? "★" : "✓", x + side - 27, y + 34);
    }
  });

  roundedRect(ctx, 43, 1284, 994, 231, 18, "#ede4f8");
  ctx.textAlign = "left";
  ctx.fillStyle = "#5b329d";
  ctx.font = "900 49px Arial, sans-serif";
  ctx.fillText(resultTitle(s).replace(/^[^A-Za-z]+/, ""), 67, 1350);
  ctx.font = "700 28px Arial, sans-serif";
  ctx.fillStyle = "#312c4a";
  ctx.fillText(s.experiences + "/24 experiences  •  " + s.lineCount + " completed lines", 67, 1397);
  ctx.font = "800 23px Arial, sans-serif";
  ctx.fillStyle = "#4e4860";
  ctx.fillText("Play it here:", 67, 1437);
  ctx.font = "21px Arial, sans-serif";
  ctx.fillText(APP_URL, 67, 1472);
  if (drawQrCode(ctx, 829, 1305, 180)) {
    ctx.textAlign = "center";
    ctx.font = "700 17px Arial, sans-serif";
    ctx.fillText("SCAN TO PLAY", 919, 1503);
  }
  // Subtle attribution on the card, without turning the game into an advert.
  ctx.textAlign = "center";
  ctx.fillStyle = "#635f75";
  ctx.font = "700 20px Arial, sans-serif";
  ctx.fillText("Adrian Croft - Host, Market Harborough Business Buzz", 540, 1553);
  return canvas;
}

async function pngBlob() {
  const canvas = makeImage();
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Could not save image")), "image/png");
  });
}

function downloadImage(blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "networking-bingo-" + stats().experiences + "-squares.png";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

async function saveImage() {
  const button = document.getElementById("save");
  button.disabled = true;
  try {
    const blob = await pngBlob();
    downloadImage(blob);
    announce("Card image saved. Add it to your LinkedIn comment! 🖼️");
  } catch (_) {
    announce("Sorry, this browser couldn't create the image.");
  } finally {
    button.disabled = false;
  }
}

async function shareImage() {
  const button = document.getElementById("share");
  button.disabled = true;
  try {
    const blob = await pngBlob();
    const file = new File([blob], "networking-bingo.png", { type: "image/png" });
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: "Networking Bingo",
        text: shareText(),
        files: [file]
      });
      announce("Thanks for sharing! If the receiving app omitted the link, use Share on WhatsApp to send it separately.");
    } else {
      downloadImage(blob);
      announce("Card image saved. Use Share on WhatsApp for a clickable game link.");
    }
  } catch (error) {
    if (error && error.name !== "AbortError") {
      announce("Image sharing didn't work here. Try Save image instead.");
    }
  } finally {
    button.disabled = false;
  }
}

function resetBoard() {
  celebratedLines.clear();
  firstBingoCelebrated = false;
  fullHouseCelebrated = false;
  hideLineToast();
  selected.clear();
  selected.add(CENTRE);
  store();
  drawBoard();
  updateResults();
  announce("All clear. Ready for another round!");
}

CELEBRATION.addEventListener("close", () => {
  if (lastSelectedSquareIndex !== null && BOARD.children[lastSelectedSquareIndex]) {
    BOARD.children[lastSelectedSquareIndex].focus({ preventScroll: true });
  }
});
document.getElementById("celebration-continue").addEventListener("click", () => CELEBRATION.close());
document.getElementById("celebration-share").addEventListener("click", () => {
  CELEBRATION.close();
  shareImage();
});

document.getElementById("celebration-whatsapp").addEventListener("click", () => {
  CELEBRATION.close();
  openWhatsAppShare();
});

document.getElementById("whatsapp").addEventListener("click", openWhatsAppShare);
document.getElementById("copy").addEventListener("click", copyScore);
document.getElementById("save").addEventListener("click", saveImage);
document.getElementById("share").addEventListener("click", shareImage);
document.getElementById("reset").addEventListener("click", resetBoard);

if (window.NETWORKING_BINGO_RELEASE) {
  const release = window.NETWORKING_BINGO_RELEASE;
  document.getElementById("version").textContent = "v" + release.version;
  document.getElementById("changes").textContent =
    "Version " + release.version + " (" + release.date + "): " + release.changes.join("; ") + ".";
}

drawBoard();
updateResults();

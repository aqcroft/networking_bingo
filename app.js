"use strict";

const APP_URL = "https://aqcroft.github.io/networking_bingo/";

const SQUARES = [
  { emoji: "📍", label: "Went to the wrong venue", full: "Arrived at a networking event at the completely wrong venue" },
  { emoji: "🎯", label: "Got pitched before hello", full: "Someone started selling before they'd even said hello" },
  { emoji: "👔", label: "Got the dress code wrong", full: "Turned up noticeably overdressed or underdressed" },
  { emoji: "🎤", label: "Froze during my 60 seconds", full: "Lost your train of thought during your 60-second introduction" },
  { emoji: "🤝", label: "Gave a no-strings referral", full: "Referred someone simply because they were right for the job" },
  { emoji: "🏷️", label: "Got home still wearing my badge", full: "Left an event and forgot to take your name badge off until you got home" },
  { emoji: "🎙️", label: "Forgot I was speaking", full: "Forgot you were meant to give a talk or do the spotlight" },
  { emoji: "🫣", label: "Called someone the wrong name", full: "Confidently called somebody by the wrong name" },
  { emoji: "🚽", label: "Escaped a chat via the loo", full: "Used a trip to the toilet as an excuse to escape a conversation" },
  { emoji: "🎁", label: "Got a surprise referral", full: "Received a lovely referral out of the blue" },
  { emoji: "📱", label: "Got a sales DM before leaving", full: "Received a sales pitch on LinkedIn before you'd left the networking event" },
  { emoji: "👀", label: "They lost interest mid-chat", full: "Someone asked what you did, then visibly lost interest" },
  { emoji: "🤝", label: "Introduced two who did business", full: "Introduced two people who later did business with each other" },
  { emoji: "💡", label: "Found an unlikely collaborator", full: "Met someone you wouldn't expect to work with and found a collaboration" },
  { emoji: "💬", label: "One-to-one ran for 2+ hours", full: "Had a one-to-one that went on for more than two hours" },
  { emoji: "🔇", label: "Did my online pitch on mute", full: "Gave a networking introduction online without realising your microphone was muted" },
  { emoji: "🥐", label: "Went partly for the food", full: "Attended a networking event partly because of its food or refreshments" },
  { emoji: "🔄", label: "Gave a referral, got none back", full: "Gave a referral and secretly hoped for one back, but got nothing" },
  { emoji: "📅", label: "Said 'We must meet!'... didn't", full: "Promised a one-to-one but never actually arranged it" },
  { emoji: "💜", label: "Made a real networking friend", full: "Made a genuine friendship through networking" },
  { emoji: "👋", label: "Reconnected with an old contact", full: "Bumped into and reconnected with somebody you'd lost touch with" },
  { emoji: "😶", label: "Made a joke nobody laughed at", full: "Tried to be funny at a networking event and got absolutely no laughs" },
  { emoji: "🙋", label: "Introduced myself twice", full: "Introduced yourself to someone you had already met" },
  { emoji: "🌱", label: "Won business months later", full: "Won business months after first meeting somebody at networking" },
  { emoji: "📸", label: "Caught mid-mouthful in a photo", full: "Appeared in an event photo with a mouthful of food" }
];

const STORAGE_KEY = "networking-bingo-edition1-selected-v2";
const AWARDS_KEY = "networking-bingo-edition1-awards-v1";
const BOARD = document.getElementById("board");
const SCORE = document.getElementById("score");
const RANK = document.getElementById("rank-title");
const RANK_ICON = document.getElementById("rank-icon");
const BADGES = document.getElementById("rank-badges");
const STATUS = document.getElementById("status");
const CELEBRATION = document.getElementById("celebration");
const CELEBRATION_TITLE = document.getElementById("celebration-title");
const CELEBRATION_DETAIL = document.getElementById("celebration-detail");
let lastSelectedSquareIndex = null;

const RANKS = [
  { threshold: 0,  name: "Networking Newbie",         icon: "👋" },
  { threshold: 5,  name: "Small-Talk Survivor",      icon: "☕" },
  { threshold: 10, name: "Chatterbox Champion",      icon: "🗣️" },
  { threshold: 15, name: "Networking Ninja",         icon: "🥷" },
  { threshold: 20, name: "Social Supremo",           icon: "🎩" },
  { threshold: 25, name: "Galaxy's Greatest Greeter",icon: "🌌" }
];

const WIN_LINES = [];
for (let n = 0; n < 5; n++) {
  WIN_LINES.push({ type: "row", indices: [0,1,2,3,4].map(col => n * 5 + col) });
  WIN_LINES.push({ type: "column", indices: [0,1,2,3,4].map(row => row * 5 + n) });
}
WIN_LINES.push(
  { type: "diagonal", indices: [0,6,12,18,24] },
  { type: "diagonal", indices: [4,8,12,16,20] }
);

function getStoredArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (_) {
    return [];
  }
}
const selected = new Set(
  getStoredArray(STORAGE_KEY).filter(i => Number.isInteger(i) && i >= 0 && i < 25)
);
const celebratedTypes = new Set(
  getStoredArray(AWARDS_KEY).filter(t => ["row","column","diagonal","fullHouse"].includes(t))
);
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
    localStorage.setItem(AWARDS_KEY, JSON.stringify([...celebratedTypes]));
  } catch (_) {
    // Storage is optional; the game still works if it's disabled.
  }
}

function stats() {
  const completed = WIN_LINES.filter(line => line.indices.every(i => selected.has(i)));
  return {
    experiences: selected.size,
    completed,
    lineCount: completed.length,
    fullHouse: selected.size === 25
  };
}
function rankFor(count) {
  return [...RANKS].reverse().find(rank => count >= rank.threshold);
}
function announce(message) {
  STATUS.textContent = message;
}
function updateResults() {
  const s = stats();
  const rank = rankFor(s.experiences);
  SCORE.textContent = String(s.experiences);
  RANK.textContent = rank.name;
  RANK_ICON.textContent = rank.icon;
  BADGES.replaceChildren();
  RANKS.forEach((item, i) => {
    const unlocked = s.experiences >= item.threshold;
    const current = item.threshold === rank.threshold;
    const cell = document.createElement("div");
    cell.className = "rank-badge" + (unlocked ? " earned" : " locked") + (current ? " current" : "");
    cell.setAttribute("aria-label", item.name + ", " + item.threshold + " squares, " + (unlocked ? "unlocked" : "locked"));
    cell.title = item.name + " (" + item.threshold + "/25)";
    cell.innerHTML = '<span class="rank-emoji" aria-hidden="true"></span><span class="rank-number"></span>';
    cell.querySelector(".rank-emoji").textContent = item.icon;
    cell.querySelector(".rank-number").textContent = String(item.threshold);
    BADGES.appendChild(cell);
  });
}
function drawBoard(newSquares = []) {
  const s = stats();
  const winning = new Set(s.completed.flatMap(line => line.indices));
  const flashes = new Set(newSquares);
  BOARD.replaceChildren();
  SQUARES.forEach((square, i) => {
    const button = document.createElement("button");
    const marked = selected.has(i);
    button.type = "button";
    button.className = "square" + (marked ? " is-marked" : "") +
      (winning.has(i) ? " is-winning" : "") +
      (flashes.has(i) ? " line-flash" : "");
    button.setAttribute("aria-pressed", String(marked));
    button.setAttribute("aria-label", square.full + (marked ? ", checked" : ", not checked"));
    button.innerHTML = '<span class="emoji" aria-hidden="true"></span><span class="square-text"></span>';
    button.querySelector(".emoji").textContent = square.emoji;
    button.querySelector(".square-text").textContent = square.label;
    button.addEventListener("click", () => {
      const before = stats();
      if (selected.has(i)) selected.delete(i); else selected.add(i);
      const after = stats();
      const newLines = after.completed.filter(line => !before.completed.includes(line));
      drawBoard(newLines.flatMap(line => line.indices));
      updateResults();
      const newTypes = [...new Set(newLines.map(line => line.type))]
        .filter(type => !celebratedTypes.has(type));
      // Already-completed types on a saved board don't trigger delayed surprises.
      const priorTypes = new Set(before.completed.map(line => line.type));
      const firstTypes = newTypes.filter(type => !priorTypes.has(type));
      firstTypes.forEach(type => celebratedTypes.add(type));
      const firstFullHouse = after.fullHouse && !celebratedTypes.has("fullHouse");
      if (firstFullHouse) celebratedTypes.add("fullHouse");
      persist();
      lastSelectedSquareIndex = i;
      if (firstTypes.length || firstFullHouse) {
        celebrate(firstTypes, firstFullHouse, rankFor(after.experiences).name);
      } else {
        announce(newLines.length ? "Another Bingo line completed!" : "");
        BOARD.children[i].focus({ preventScroll: true });
      }
    });
    BOARD.appendChild(button);
  });
}
function celebrate(types, fullHouse, rankName) {
  const names = { row: "a row", column: "a column", diagonal: "a diagonal" };
  if (fullHouse) {
    CELEBRATION_TITLE.textContent = "🏠 FULL HOUSE!";
    CELEBRATION_DETAIL.textContent = "25 out of 25! You are officially Galaxy's Greatest Greeter.";
  } else if (types.length > 1) {
    CELEBRATION_TITLE.textContent = "🎉 MULTIPLE BINGOS!";
    CELEBRATION_DETAIL.textContent = "You've completed " + types.map(t => names[t]).join(" and ") + "!";
  } else {
    const type = types[0];
    CELEBRATION_TITLE.textContent = type === "row" ? "🎉 BINGO!" :
      type === "column" ? "🏆 COLUMN BINGO!" : "✨ DIAGONAL BINGO!";
    CELEBRATION_DETAIL.textContent = "You've completed " + names[type] + "!";
  }
  announce(CELEBRATION_TITLE.textContent + " " + CELEBRATION_DETAIL.textContent);
  if (!CELEBRATION.open) CELEBRATION.showModal();
}
function shareText() {
  const s = stats(), rank = rankFor(s.experiences);
  return [
    "I played Networking Bingo! 🤝☕",
    "I ticked " + s.experiences + "/25 and earned the rank of " + rank.name + "!",
    "Fancy a go? Play it here:",
    APP_URL
  ].join("\n");
}
function openWhatsAppShare() {
  // WhatsApp's deep link shares text rather than attaching an image.
  window.open("https://wa.me/?text=" + encodeURIComponent(shareText()), "_blank", "noopener,noreferrer");
}
async function copyScore() {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(shareText());
    } else {
      const helper = document.createElement("textarea");
      helper.value = shareText();
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      if (!document.execCommand("copy")) throw new Error("Copy unavailable");
      helper.remove();
    }
    announce("Copied! Paste your score into a LinkedIn comment. 👍");
  } catch (_) {
    announce("Copy isn't available here. Try WhatsApp or Share my card.");
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
  canvas.height = 1670;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image creation is unavailable");
  const s = stats();
  const rank = rankFor(s.experiences);
  const lineSquares = new Set(s.completed.flatMap(line => line.indices));

  ctx.fillStyle = "#f6f3ef";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#241a40";
  ctx.fillRect(0, 0, 203);
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "66px Arial, sans-serif";
  ctx.fillText("🤝", 42, 101);
  ctx.font = "900 68px Arial, sans-serif";
  ctx.fillText("NETWORKING BINGO", 120, 100);
  ctx.font = "61px Arial, sans-serif";
  ctx.fillText("☕", 941, 100);
  ctx.fillStyle = "#ffd77d";
  ctx.font = "700 29px Arial, sans-serif";
  ctx.fillText("The Good. The Bad. The Cringeworthy.", 46, 156);

  const left = 43, gap = 8;
  const side = (1080 - left * 2 - 4 * gap) / 5;
  const top = 232;
  SQUARES.forEach((square, i) => {
    const row = Math.floor(i / 5), col = i % 5;
    const x = left + col * (side + gap), y = top + row * (side + gap);
    const marked = selected.has(i);
    roundedRect(ctx, x, y, side, side, 13,
      lineSquares.has(i) ? "#ffe4a0" : marked ? "#cbeee4" : "#ffffff");
    ctx.textAlign = "center";
    ctx.fillStyle = "#27253a";
    ctx.font = "42px Arial, sans-serif";
    ctx.fillText(square.emoji, x + side / 2, y + 60);

    let fontSize = 22, textLines = [];
    do {
      ctx.font = "800 " + fontSize + "px Arial, sans-serif";
      textLines = wrapLines(ctx, square.label, side - 20);
      if (textLines.length <= 4) break;
      fontSize--;
    } while (fontSize > 16);
    const lineHeight = fontSize + 3;
    const textTop = y + 100 + Math.max(0, 4 - textLines.length) * 8;
    textLines.forEach((line, j) => ctx.fillText(line, x + side / 2, textTop + j * lineHeight));
    if (marked) {
      roundedRect(ctx, x + side - 43, y + 10, 32, 32, 16,
        lineSquares.has(i) ? "#ac7916" : "#15775a");
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 24px Arial, sans-serif";
      ctx.fillText("✓", x + side - 27, y + 34);
    }
  });

  roundedRect(ctx, 43, 1264, 994, 359, 18, "#ede4f8");
  ctx.textAlign = "left";
  ctx.fillStyle = "#5b329d";
  ctx.font = "900 42px Arial, sans-serif";
  ctx.fillText(rank.icon + " " + rank.name, 67, 1329);
  ctx.fillStyle = "#312c4a";
  ctx.font = "700 29px Arial, sans-serif";
  ctx.fillText(s.experiences + "/25 networking moments", 67, 1380);
  ctx.fillStyle = "#4e4860";
  ctx.font = "700 22px Arial, sans-serif";
  ctx.fillText("Play it here:", 67, 1424);
  ctx.font = "21px Arial, sans-serif";
  ctx.fillText(APP_URL, 67, 1458);

  if (drawQrCode(ctx, 831, 1283, 178)) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#5f5870";
    ctx.font = "700 17px Arial, sans-serif";
    ctx.fillText("SCAN TO PLAY", 920, 1482);
  }

  // Six tiny ranks, earned in colour and future ranks faded. Titles are not
  // repeated under the icons; the current title sits above the strip.
  RANKS.forEach((item, i) => {
    const x = 66 + i * 116, y = 1510;
    const earned = s.experiences >= item.threshold;
    const active = item.threshold === rank.threshold;
    roundedRect(ctx, x, y, 82, 80, 13, active ? "#fff0bc" :
      earned ? "#ffffff" : "#ded9e7");
    ctx.globalAlpha = earned ? 1 : .38;
    ctx.textAlign = "center";
    ctx.fillStyle = "#302848";
    ctx.font = "39px Arial, sans-serif";
    ctx.fillText(item.icon, x + 41, y + 49);
    ctx.globalAlpha = 1;
    ctx.font = "700 17px Arial, sans-serif";
    ctx.fillStyle = "#625b70";
    ctx.fillText(String(item.threshold), x + 41, y + 102);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = "#635f75";
  ctx.font = "700 19px Arial, sans-serif";
  ctx.fillText("A little networking nonsense from Adrian Croft  |  aqcroft.com", 540, 1654);
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
  selected.clear();
  celebratedTypes.clear();
  persist();
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

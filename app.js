"use strict";

const SQUARES = [
  { emoji: "📅", label: "Wrong date", full: "Turned up on completely the wrong date" },
  { emoji: "🎯", label: "Pitch-slapped", full: "Been pitch-slapped before you could say hello" },
  { emoji: "👔", label: "Overdressed", full: "Turned up hilariously overdressed" },
  { emoji: "🎤", label: "60-second brain freeze", full: "Had a 60-second introduction brain freeze" },
  { emoji: "🤝", label: "No-strings referral", full: "Referred someone without expecting anything in return" },

  { emoji: "⏰", label: "Way too early", full: "Arrived ridiculously early" },
  { emoji: "🔦", label: "Forgot the spotlight", full: "Forgot you were supposed to be doing the spotlight" },
  { emoji: "🫣", label: "Wrong name", full: "Called someone by the wrong name" },
  { emoji: "🚽", label: "Loo escape", full: "Gone to the loo to escape a conversation" },
  { emoji: "🎁", label: "Surprise referral", full: "Received an unexpected referral" },

  { emoji: "📍", label: "Wrong venue", full: "Arrived at the wrong venue" },
  { emoji: "👀", label: "Shoulder-scanned", full: "Had someone look over your shoulder for somebody more interesting" },
  { emoji: "☕", label: "FREE SPACE", full: "Coffee at a networking event - this one's on us!" },
  { emoji: "📝", label: "Ill-prepared", full: "Turned up without properly preparing" },
  { emoji: "💬", label: "2-hour one-to-one", full: "Had a one-to-one that lasted over two hours" },

  { emoji: "👟", label: "Underdressed", full: "Been conspicuously underdressed" },
  { emoji: "🏃", label: "Embarrassingly late", full: "Walked into an event embarrassingly late" },
  { emoji: "🔄", label: "Referral not returned", full: "Referred in good faith, secretly hoped for one back... and got nothing" },
  { emoji: "😬", label: "Recognised face, no name", full: "Recognised someone's face but couldn't remember their name" },
  { emoji: "💜", label: "Made a real friend", full: "Made a genuine friendship through networking" },

  { emoji: "⌚", label: "Wrong start time", full: "Got the start time completely wrong" },
  { emoji: "🗣️", label: "Trapped in a monologue", full: "Been trapped in a never-ending sales monologue" },
  { emoji: "🙋", label: "Introduced twice", full: "Introduced yourself to the same person twice" },
  { emoji: "🌱", label: "Business months later", full: "Won business months after first meeting somebody" },
  { emoji: "🥐", label: "Went for the food", full: "Attended an event partly because you'd heard the food was good" }
];

const CENTRE = 12;
const STORAGE_KEY = "networking-bingo-selected-v1";
const BOARD = document.getElementById("board");
const SCORE = document.getElementById("score");
const OUTCOME = document.getElementById("outcome");
const LINES = document.getElementById("lines");
const PROGRESS = document.getElementById("progress");
const STATUS = document.getElementById("status");

const WIN_LINES = [];
for (let n = 0; n < 5; n++) {
  WIN_LINES.push([0, 1, 2, 3, 4].map(col => n * 5 + col));
  WIN_LINES.push([0, 1, 2, 3, 4].map(row => row * 5 + n));
}
WIN_LINES.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);

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
        const before = stats().lineCount;
        if (selected.has(i)) selected.delete(i);
        else selected.add(i);
        store();
        drawBoard();
        updateResults();
        if (stats().lineCount > before) announce("BINGO! You've completed a line. 🎉");
        else announce("");
        BOARD.children[i].focus({ preventScroll: true });
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
    "Networking Bingo! 😂",
    "I've experienced " + s.experiences + " of 24 networking moments and completed " + s.lineCount + " " + (s.lineCount === 1 ? "line" : "lines") + "!",
    resultTitle(s),
    "",
    "My most memorable moment? That's another story... 😳",
    "How many can YOU tick?",
    location.href.split("#")[0]
  ].join("\n");
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

function makeImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1480;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image creation is unavailable");
  const s = stats();

  ctx.fillStyle = "#f6f3ef";
  ctx.fillRect(0, 0, 1080, 1480);
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
    ctx.font = "800 23px Arial, sans-serif";
    const lines = wrapLines(ctx, square.label, side - 24).slice(0, 3);
    const blockTop = y + 101 - (lines.length - 1) * 7;
    lines.forEach((line, j) => ctx.fillText(line, x + side / 2, blockTop + j * 26));
    if (selected.has(i)) {
      roundedRect(ctx, x + side - 43, y + 10, 32, 32, 16, i === CENTRE ? "#a77300" : "#15775a");
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 24px Arial, sans-serif";
      ctx.fillText(i === CENTRE ? "★" : "✓", x + side - 27, y + 34);
    }
  });

  roundedRect(ctx, 43, 1284, 994, 146, 18, "#ede4f8");
  ctx.textAlign = "left";
  ctx.fillStyle = "#5b329d";
  ctx.font = "900 49px Arial, sans-serif";
  ctx.fillText(resultTitle(s).replace(/^[^A-Za-z]+/, ""), 67, 1350);
  ctx.font = "700 28px Arial, sans-serif";
  ctx.fillStyle = "#312c4a";
  ctx.fillText(s.experiences + "/24 experiences  •  " + s.lineCount + " completed lines", 67, 1397);
  ctx.textAlign = "right";
  ctx.font = "22px Arial, sans-serif";
  ctx.fillStyle = "#635f75";
  ctx.fillText("Play along: aqcroft.github.io/networking_bingo", 1035, 1462);
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
        text: "How many networking moments have YOU survived? 😂",
        files: [file]
      });
      announce("Thanks for playing! 🎉");
    } else {
      downloadImage(blob);
      announce("Your browser can't share an image directly, so I've saved it for you to post manually.");
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
  selected.add(CENTRE);
  store();
  drawBoard();
  updateResults();
  announce("All clear. Ready for another round!");
}

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

// =====================================
// Elements
// =====================================
const envelope = document.getElementById("envelope-container");
const letter = document.getElementById("letter-container");

const yesBtn = document.querySelector(".btn[alt='Yes']");
const noWrapper = document.querySelector(".no-wrapper");
const noImg = document.querySelector(".no-btn");

const title = document.getElementById("letter-title");
const catImg = document.getElementById("letter-cat");
const buttons = document.getElementById("letter-buttons");
const finalText = document.getElementById("final-text");

const letterWindow = document.querySelector(".letter-window");

// =====================================
// Settings
// =====================================
const CHANGE_AFTER_MOVES = 5;
const CHANGE_DURATION_MS = 2000;
const MOVE_COOLDOWN_MS = 220;
const AVOID_GAP = 15;

let moveCount = 0;
let isChanged = false;
let lastMoveAt = 0;

// =====================================
// Envelope Click
// =====================================
envelope.addEventListener("click", () => {
  envelope.style.display = "none";
  letter.style.display = "flex";

  setTimeout(() => {
    letterWindow.classList.add("open");
    requestAnimationFrame(setupNoButton);
  }, 50);
});

// =====================================
// Setup NO Button
// =====================================
function setupNoButton() {
  buttons.style.position = "relative";

  noWrapper.style.position = "absolute";
  noWrapper.style.zIndex = "10";
  noWrapper.style.transition = "left 0.12s ease, top 0.12s ease";

  placeNoNextToYes();
}

// Initial position next to YES
function placeNoNextToYes() {
  const gap = 30;

  const yesRect = yesBtn.getBoundingClientRect();
  const buttonsRect = buttons.getBoundingClientRect();

  const yesLeft = yesRect.left - buttonsRect.left;
  const yesTop = yesRect.top - buttonsRect.top;

  noWrapper.style.left = `${yesLeft + yesRect.width + gap}px`;
  noWrapper.style.top = `${yesTop}px`;
}

// =====================================
// Avoid YES overlap helpers
// =====================================
function getYesForbiddenRect() {
  const yesRect = yesBtn.getBoundingClientRect();
  const buttonsRect = buttons.getBoundingClientRect();

  const left = yesRect.left - buttonsRect.left - AVOID_GAP;
  const top = yesRect.top - buttonsRect.top - AVOID_GAP;
  const right = left + yesRect.width + AVOID_GAP * 2;
  const bottom = top + yesRect.height + AVOID_GAP * 2;

  return { left, top, right, bottom };
}

function rectsOverlap(a, b) {
  return !(
    a.right <= b.left ||
    a.left >= b.right ||
    a.bottom <= b.top ||
    a.top >= b.bottom
  );
}

function placeNoSafely() {
  const padding = 8;

  const areaW = buttons.clientWidth;
  const areaH = buttons.clientHeight;

  const w = noWrapper.offsetWidth;
  const h = noWrapper.offsetHeight;

  if (!areaW || !areaH || !w || !h) return false;

  const maxX = areaW - w - padding;
  const maxY = areaH - h - padding;

  const forbidden = getYesForbiddenRect();

  for (let i = 0; i < 25; i++) {
    const x = padding + Math.random() * maxX;
    const y = padding + Math.random() * maxY;

    const noRect = { left: x, top: y, right: x + w, bottom: y + h };

    if (!rectsOverlap(noRect, forbidden)) {
      noWrapper.style.left = `${x}px`;
      noWrapper.style.top = `${y}px`;
      return true;
    }
  }

  return false;
}

// =====================================
// Move NO Button
// =====================================
function moveNoButton() {
  if (isChanged) return;

  const now = Date.now();
  if (now - lastMoveAt < MOVE_COOLDOWN_MS) return;
  lastMoveAt = now;

  const placed = placeNoSafely();
  if (!placed) return;

  moveCount++;

  if (moveCount >= CHANGE_AFTER_MOVES) {
    triggerChangeImage();
  }
}

// =====================================
// Change NO Image Temporarily
// =====================================
function triggerChangeImage() {
  isChanged = true;

  placeNoSafely(); // ensure safe position before changing image

  noImg.src = "change.jpg";

  setTimeout(() => {
    noImg.src = "no.png";
    moveCount = 0;
    isChanged = false;
  }, CHANGE_DURATION_MS);
}

// =====================================
// Movement Triggers
// =====================================
noWrapper.addEventListener("mouseenter", moveNoButton);
noWrapper.addEventListener("mousemove", moveNoButton);

noWrapper.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    moveNoButton();
  },
  { passive: false }
);

// Keep correct position on resize
window.addEventListener("resize", () => {
  if (letter.style.display === "flex") {
    placeNoNextToYes();
  }
});

// =====================================
// YES Button Click
// =====================================
yesBtn.addEventListener("click", () => {
  title.textContent = "Yippeeee! Happy Valentine’s Day!";
  catImg.src = "happycat.gif";

  // 🎉 Celebration background
  document.body.classList.add("celebrate");

  letterWindow.classList.add("final");
  buttons.style.display = "none";
  finalText.style.display = "block";
});

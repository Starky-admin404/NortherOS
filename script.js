// ------------------------
// Directional Points logic
// ------------------------

// Config
const PLUS_COST = 500;

// State
let points = 0;
let directionalPlus = false;
let lastDailyLogin = null;

// DOM references (set after DOM load)
let pointsDisplayEl;
let plusStatusEl;
let plusRequirementTextEl;
let unlockPlusBtnEl;

// Init on page load
window.addEventListener("DOMContentLoaded", () => {
  pointsDisplayEl = document.getElementById("pointsDisplay");
  plusStatusEl = document.getElementById("plusStatus");
  plusRequirementTextEl = document.getElementById("plusRequirementText");
  unlockPlusBtnEl = document.getElementById("unlockPlusBtn");

  loadState();
  applyDailyLoginBonus();
  updateUI();
});

/**
 * Load state from localStorage
 */
function loadState() {
  points = Number(localStorage.getItem("norther_points")) || 0;
  directionalPlus = localStorage.getItem("norther_plus") === "true";

  const savedDate = localStorage.getItem("norther_last_daily");
  if (savedDate) {
    lastDailyLogin = new Date(savedDate);
  }
}

/**
 * Save state to localStorage
 */
function saveState() {
  localStorage.setItem("norther_points", String(points));
  localStorage.setItem("norther_plus", directionalPlus ? "true" : "false");

  if (lastDailyLogin) {
    localStorage.setItem("norther_last_daily", lastDailyLogin.toISOString());
  }
}

/**
 * Daily login bonus: once per real calendar day
 */
function applyDailyLoginBonus() {
  const now = new Date();
  const todayKey = now.toDateString();
  const lastDayKey = lastDailyLogin ? lastDailyLogin.toDateString() : null;

  if (todayKey !== lastDayKey) {
    // new day, grant bonus
    addPoints(50, false);
    lastDailyLogin = now;
    saveState();
    alert("Daily login bonus: +50 Directional Points!");
  }
}

/**
 * Add points
 * @param {number} amount
 * @param {boolean} silent - don't show popup if true
 */
function addPoints(amount, silent = false) {
  points += amount;
  if (!silent) {
    alert(`You earned +${amount} points!`);
  }
  saveState();
  updateUI();
}

/**
 * Developer/test earning from buttons
 */
function devEarnPoints(amount) {
  addPoints(amount);
}

/**
 * Attempt to unlock Directional+
 */
function attemptUnlockPlus() {
  if (directionalPlus) {
    alert("Directional+ is already unlocked!");
    return;
  }

  if (points < PLUS_COST) {
    const needed = PLUS_COST - points;
    alert(`You need ${needed} more points to unlock Directional+. Keep using Norther OS!`);
    return;
  }

  // Enough points, unlock
  directionalPlus = true;
  saveState();
  updateUI();
  alert("Directional+ unlocked! Enjoy your premium visuals and perks.");
}

/**
 * Update HUD + body classes
 */
function updateUI() {
  if (pointsDisplayEl) {
    pointsDisplayEl.textContent = points;
  }

  if (plusStatusEl) {
    plusStatusEl.textContent = directionalPlus ? "Directional+ Active" : "Free Tier";
  }

  if (plusRequirementTextEl) {
    if (directionalPlus) {
      plusRequirementTextEl.textContent = "You already unlocked Directional+.";
    } else {
      plusRequirementTextEl.textContent = `Cost: ${PLUS_COST} points. You currently have ${points}.`;
    }
  }

  if (unlockPlusBtnEl) {
    unlockPlusBtnEl.disabled = directionalPlus;
  }

  // Adjust body classes for visual states
  const body = document.body;

  if (directionalPlus) {
    body.classList.add("body-plus-active");
    body.classList.add("plus-enabled");
  } else {
    body.classList.remove("body-plus-active");
    body.classList.remove("plus-enabled");
  }
}

// ------------------------
// Window management
// ------------------------

/**
 * Open a window by id
 */
function openWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("active");
}

/**
 * Close a window by id
 */
function closeWindow(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("active");
}

// ------------------------
// Theme management
// ------------------------

/**
 * Set theme via data attribute on body
 */
function setTheme(themeName) {
  // If theme is a Directional+ theme, block it when not plus
  const plusOnlyThemes = ["neon"];

  if (plusOnlyThemes.includes(themeName) && !directionalPlus) {
    alert("This theme is for Directional+ users. Earn and unlock Directional+ to use it.");
    return;
  }

  document.body.setAttribute("data-theme", themeName);
}

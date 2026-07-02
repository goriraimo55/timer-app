// Timer state. This app intentionally does not use sound or vibration.
const LAST_TIME_KEY = "tabletTimerLastSeconds";

let remainingSeconds = 0;
let overtimeSeconds = 0;
let timerId = null;
let wakeLock = null;
let shouldKeepAwake = false;
let isFinished = false;

const timerDisplay = document.getElementById("timerDisplay");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const resetButton = document.getElementById("resetButton");
const presetButtons = document.querySelectorAll(".preset-button");

// Convert seconds to mm:ss.
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateDisplay() {
  timerDisplay.textContent = formatTime(isFinished ? overtimeSeconds : remainingSeconds);
  updateTimerVisualState();
}

function updateButtonState() {
  const isRunning = timerId !== null;
  startButton.disabled = isFinished || isRunning || remainingSeconds <= 0;
  stopButton.disabled = isFinished || !isRunning;
}

function clearTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
}

async function requestWakeLock() {
  shouldKeepAwake = true;

  if (!("wakeLock" in navigator) || wakeLock !== null) {
    return;
  }

  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      wakeLock = null;
    });
  } catch (error) {
    // Wake Lock can be unavailable on some browsers or when battery saver is active.
  }
}

async function restoreWakeLock() {
  if (document.visibilityState === "visible" && shouldKeepAwake) {
    await requestWakeLock();
  }
}

function saveLastTime(seconds) {
  try {
    localStorage.setItem(LAST_TIME_KEY, String(seconds));
  } catch (error) {
    // If browser storage is unavailable, the timer still works for this session.
  }
}

function loadLastTime() {
  try {
    const savedSeconds = Number(localStorage.getItem(LAST_TIME_KEY));
    return Number.isFinite(savedSeconds) && savedSeconds > 0 ? savedSeconds : 0;
  } catch (error) {
    return 0;
  }
}

function updateTimerVisualState() {
  document.body.classList.toggle(
    "is-warning",
    !isFinished && remainingSeconds > 10 && remainingSeconds <= 60
  );
  document.body.classList.toggle(
    "is-critical",
    !isFinished && remainingSeconds > 0 && remainingSeconds <= 10
  );
}

function selectPresetButton(selectedButton) {
  presetButtons.forEach((button) => {
    button.classList.toggle("is-selected", button === selectedButton);
  });
}

function selectPresetBySeconds(seconds) {
  const selectedButton = Array.from(presetButtons).find((button) => {
    return Number(button.dataset.minutes) * 60 === seconds;
  });
  selectPresetButton(selectedButton || null);
}

function finishTimer() {
  clearTimer();
  isFinished = true;
  remainingSeconds = 0;
  overtimeSeconds = 0;
  updateDisplay();
  document.body.classList.add("is-finished");
  timerId = setInterval(() => {
    overtimeSeconds += 1;
    updateDisplay();
  }, 1000);
  updateButtonState();
}

function startTimer() {
  if (isFinished || timerId !== null || remainingSeconds <= 0) {
    return;
  }

  requestWakeLock();
  timerId = setInterval(() => {
    remainingSeconds -= 1;

    if (remainingSeconds <= 0) {
      finishTimer();
      return;
    }

    updateDisplay();
  }, 1000);

  updateButtonState();
}

function stopTimer() {
  clearTimer();
  updateButtonState();
}

function resetTimer() {
  clearTimer();
  isFinished = false;
  remainingSeconds = 0;
  overtimeSeconds = 0;
  document.body.classList.remove("is-finished");
  selectPresetButton(null);
  updateDisplay();
  updateButtonState();
}

function setPreset(minutes, button) {
  clearTimer();
  isFinished = false;
  remainingSeconds = minutes * 60;
  overtimeSeconds = 0;
  saveLastTime(remainingSeconds);
  requestWakeLock();
  document.body.classList.remove("is-finished");
  selectPresetButton(button);
  updateDisplay();
  updateButtonState();
}

presetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const minutes = Number(button.dataset.minutes);
    setPreset(minutes, button);
  });
});

startButton.addEventListener("click", startTimer);
stopButton.addEventListener("click", stopTimer);
resetButton.addEventListener("click", resetTimer);
document.addEventListener("visibilitychange", restoreWakeLock);

remainingSeconds = loadLastTime();
selectPresetBySeconds(remainingSeconds);
updateDisplay();
updateButtonState();

/* ============================================================
   Tick Timer - script.js
   タイマーの状態管理とカウントダウン処理
   ============================================================ */

// ---- DOM要素の取得 ----
const app        = document.getElementById("app");
const display    = document.getElementById("display");
const statusEl   = document.getElementById("status");
const presetList = document.getElementById("presetList");
const startBtn   = document.getElementById("startBtn");
const stopBtn    = document.getElementById("stopBtn");
const resetBtn   = document.getElementById("resetBtn");

// ---- 状態変数 ----
let presetSeconds    = 10 * 60;      // 選択中のプリセット時間（秒）初期値10分
let remainingSeconds = presetSeconds; // 現在の残り時間（秒）
let endTime          = null;          // カウントダウンの終了予定時刻（ms）
let intervalId       = null;          // setIntervalのID
let state            = "ready";       // ready | running | paused | finished

/* ============================================================
   表示更新
   ============================================================ */

// 秒数を mm:ss 形式の文字列に変換する（60分は 60:00 と表示）
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

// 残り時間と状態ラベルを画面に反映する
function render() {
  display.textContent = formatTime(remainingSeconds);

  const labels = {
    ready:    "READY",
    running:  "RUNNING",
    paused:   "PAUSED",
    finished: "TIME UP",
  };
  statusEl.textContent = labels[state];

  // CSS用に状態クラスを付け替える
  app.classList.toggle("running",  state === "running");
  app.classList.toggle("finished", state === "finished");
}

/* ============================================================
   カウントダウン処理
   ============================================================ */

// 200msごとに残り時間を再計算する
// （終了予定時刻との差分で計算するため、setIntervalの誤差が蓄積しない）
function tick() {
  const diffMs = endTime - Date.now();
  const newRemaining = Math.max(0, Math.ceil(diffMs / 1000));

  // 秒が変わったときだけ表示を更新（無駄な描画を防ぐ）
  if (newRemaining !== remainingSeconds) {
    remainingSeconds = newRemaining;
    render();
  }

  // 0秒に到達したら終了状態へ移行（点滅開始）
  if (remainingSeconds <= 0) {
    stopInterval();
    state = "finished";
    render();
  }
}

// インターバルを停止する共通処理
function stopInterval() {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

/* ============================================================
   ボタン操作
   ============================================================ */

// START：カウントダウン開始／一時停止からの再開
function start() {
  // 終了後や残り0秒からは開始しない（RESET待ち）
  if (state === "running" || state === "finished" || remainingSeconds <= 0) return;

  // 現在の残り時間から終了予定時刻を計算
  endTime = Date.now() + remainingSeconds * 1000;
  intervalId = setInterval(tick, 200);
  state = "running";
  render();
}

// STOP：一時停止（残り時間は保持され、STARTで再開できる）
function stop() {
  if (state !== "running") return;

  stopInterval();
  state = "paused";
  render();
}

// RESET：初期状態へ戻す（点滅も解除される）
function reset() {
  stopInterval();
  remainingSeconds = presetSeconds; // 選択中のプリセット時間に戻す
  state = "ready";
  render();
}

// プリセットボタン：時間をセットしてタイマーを初期化
function selectPreset(button) {
  const minutes = Number(button.dataset.minutes);
  presetSeconds = minutes * 60;

  // 選択中ボタンのハイライトを付け替える
  presetList.querySelectorAll(".preset-btn").forEach((btn) => {
    btn.classList.toggle("selected", btn === button);
  });

  reset(); // 新しい時間で初期状態に戻す
}

/* ============================================================
   イベント登録
   ============================================================ */

startBtn.addEventListener("click", start);
stopBtn.addEventListener("click", stop);
resetBtn.addEventListener("click", reset);

// プリセットはイベント委譲でまとめて処理
presetList.addEventListener("click", (e) => {
  const button = e.target.closest(".preset-btn");
  if (button) selectPreset(button);
});

/* ============================================================
   初期化：10分を選択した状態で起動
   ============================================================ */
selectPreset(presetList.querySelector('[data-minutes="10"]'));

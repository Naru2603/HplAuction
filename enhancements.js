// ==========================================
// HPL 2026 Enhancements (Non-Intrusive)
// ==========================================


// ===============================
// 🔊 BID SOUND SETUP
// ===============================
const bidSound = new Audio('sounds/bip.mp3');
bidSound.preload = "auto";

// Unlock audio once (browser restriction fix)
document.addEventListener("click", () => {
  bidSound.play().then(() => {
    bidSound.pause();
    bidSound.currentTime = 0;
  }).catch(() => {});
}, { once: true });


// ===============================
// 🎤 INDIAN FEMALE-LIKE VOICE (AUDIO BASED)
// ===============================

async function speak(text) {
  try {
    // Clean text for better pronunciation
    const formattedText = text
      .replace(/₹/g, "rupees")
      .replace(/\s+/g, " ");

    // Google TTS (Indian English)
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(formattedText)}&tl=en-IN&client=tw-ob`;

    const audio = new Audio(url);

    // ensure no overlap
    audio.currentTime = 0;

    await audio.play();

  } catch (e) {
    console.log("TTS error:", e);
  }
}


// ===============================
// 🔊 SOUND ON EVERY BID CLICK
// ===============================
(function () {
  const btn = document.getElementById('bid-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    try {
      bidSound.currentTime = 0;
      bidSound.play();
    } catch (e) {
      console.log("Sound error:", e);
    }
  });
})();


// ===============================
// 🎤 VOICE FOR EVERY PLAYER SOLD
// ===============================
(function () {
  const soldBtn = document.getElementById('sold-btn');
  if (!soldBtn) return;

  soldBtn.addEventListener('click', () => {
    try {
      // Capture BEFORE state changes
      const player = stateManager.getCurrentPlayer();
      const team = document.getElementById('team-select').value;
      const price = stateManager.currentBid;

      if (!player || !team) return;

      const message = `${player.name} sold to ${team} for rupees ${price}`;

      // small delay = smoother UX
      setTimeout(() => {
        speak(message);
      }, 150);

    } catch (e) {
      console.log("Voice error:", e);
    }
  });
})();


// ===============================
// 📊 AUTO SUMMARY AFTER EACH SET
// ===============================
(function () {
  const originalMoveNext = stateManager.moveToNextPlayer.bind(stateManager);

  stateManager.moveToNextPlayer = function () {
    const result = originalMoveNext();

    if (!result) {
      setTimeout(() => {
        stateManager.navigateToPage('summary-page');
        UIRenderer.showPage('summary-page');
        UIRenderer.renderSummaryPage();
      }, 400);
    }

    return result;
  };
})();



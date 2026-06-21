/**
 * HPL Auction System - Main Script
 * ================================
 * Event handlers and auction flow logic
 * Orchestrates state, UI, and user interactions
 */

// ========== DOM REFERENCES ==========

const dom = {
  // Landing Page
  startAuctionBtn: document.getElementById('start-auction-btn'),

  // Teams Page
  teamsPage: document.getElementById('teams-page'),
  backFromTeams: document.getElementById('back-from-teams'),
  startSetAuctionBtn: document.getElementById('start-set-auction-btn'),

  // Auction Page
  auctionPage: document.getElementById('auction-page'),
  teamSelect: document.getElementById('team-select'),
  bidBtn: document.getElementById('bid-btn'),
  decreaseBidBtn: document.getElementById('decrease-bid-btn'),
  soldBtn: document.getElementById('sold-btn'),
  previousPlayerBtn: document.getElementById('previous-player-btn'),
  nextSetBtn: document.getElementById('next-set-btn'),
  backFromAuction: document.getElementById('back-from-auction'),
  summaryBtn: document.getElementById('summary-btn'),

  // Summary Page
  summaryPage: document.getElementById('summary-page'),
  backFromSummary: document.getElementById('back-from-summary'),

  // Final Summary Page
  finalSummaryPage: document.getElementById('final-summary-page'),
  backFromFinalSummary: document.getElementById('back-from-final-summary'),
  downloadSummaryBtn: document.getElementById('download-summary-btn'),
  restartAuctionBtn: document.getElementById('restart-auction-btn')
};

// ========== LANDING PAGE RENDERING ==========

/**
 * Render the teams and sponsors on the landing page
 */
function renderLandingTeamsGrid() {
  const grid = document.getElementById('landing-teams-grid');
  if (!grid) return;
  
  grid.innerHTML = '';
  TEAMS.forEach((teamName, index) => {
    const teamConfig = TEAMS_CONFIG[teamName] || {};
    const card = document.createElement('div');
    card.className = 'landing-team-card';
    card.innerHTML = `
      <div class="landing-team-header">${teamName}</div>
      <div class="landing-team-sponsor">
        <strong>Sponsor:</strong> ${teamConfig.sponsor || 'N/A'}
      </div>
    `;
    grid.appendChild(card);
  });
}

// ========== EVENT LISTENERS ==========

/**
 * Initialize all event listeners
 */
function initializeEventListeners() {
  // Landing page
  dom.startAuctionBtn.addEventListener('click', handleStartAuction);

  // Teams page
  dom.backFromTeams.addEventListener('click', handleBackFromTeams);
  dom.startSetAuctionBtn.addEventListener('click', handleStartSetAuction);

  // Auction page
  dom.bidBtn.addEventListener('click', handleBidClick);
  dom.decreaseBidBtn.addEventListener('click', handleDecreaseBidClick);
  dom.soldBtn.addEventListener('click', handleSoldClick);
  dom.previousPlayerBtn.addEventListener('click', handlePreviousPlayerClick);
  dom.nextSetBtn.addEventListener('click', handleNextSetClick);
  dom.backFromAuction.addEventListener('click', handleBackFromAuction);
  dom.summaryBtn.addEventListener('click', handleSummaryClick);
  dom.teamSelect.addEventListener('change', handleTeamSelectChange);

  // View set players button
  const viewSetPlayersBtn = document.getElementById('view-set-players-btn');
  if (viewSetPlayersBtn) {
    viewSetPlayersBtn.addEventListener('click', () => {
      UIRenderer.showSetPlayersModal();
    });
  }

  // Summary page
  dom.backFromSummary.addEventListener('click', handleBackFromSummary);

  // Final summary page
  dom.backFromFinalSummary.addEventListener('click', handleBackFromFinalSummary);
  dom.downloadSummaryBtn.addEventListener('click', () => {
    UIRenderer.exportAuctionDataAsJSON();
  });
  dom.restartAuctionBtn.addEventListener('click', handleRestartAuction);

  // Modal handlers
  const modal = document.getElementById('team-details-modal');
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      UIRenderer.closeTeamDetailsModal();
    }
  });

  // Set players modal handler
  const setPlayersModal = document.getElementById('set-players-modal');
  if (setPlayersModal) {
    setPlayersModal.addEventListener('click', (e) => {
      if (e.target === setPlayersModal) {
        UIRenderer.closeSetPlayersModal();
      }
    });
  }
}

// ========== EVENT HANDLERS ==========

/**
 * Handle start auction button
 */
function handleStartAuction() {
  stateManager.navigateToPage('teams-page');
  UIRenderer.showPage('teams-page');
  UIRenderer.renderTeamsGrid();
}

/**
 * Handle back from teams page
 */
function handleBackFromTeams() {
  const previousPage = stateManager.goBack();
  UIRenderer.showPage(previousPage);
  if (previousPage === 'auction-page') {
    UIRenderer.renderAuctionPage();
  }
}

/**
 * Handle start set auction
 */
function handleStartSetAuction() {
  stateManager.auctionStarted = true;
  stateManager.navigateToPage('auction-page');
  UIRenderer.showPage('auction-page');
  UIRenderer.renderAuctionPage();
}

/**
 * Handle team select change - update budget display
 */
function handleTeamSelectChange() {
  const selectedTeam = dom.teamSelect.value;
  const budgetDisplay = document.getElementById('team-budget-display');
  const budgetRemaining = document.getElementById('team-budget-remaining');
  const budgetTotal = document.getElementById('team-budget-total');
  const budgetStatus = document.getElementById('team-budget-status');

  if (selectedTeam) {
    const remaining = stateManager.getTeamRemainingBudget(selectedTeam);
    const spent = stateManager.getTeamTotalSpent(selectedTeam);
    const currentBid = stateManager.currentBid;
    
    budgetRemaining.textContent = remaining;
    budgetTotal.textContent = TEAM_BUDGET;
    budgetDisplay.style.display = 'block';
    
    // Update budget status
    if (remaining < currentBid) {
      budgetStatus.textContent = `❌ Insufficient budget (need ₹${currentBid}, have ₹${remaining})`;
      budgetStatus.className = 'budget-status warning';
      dom.soldBtn.disabled = true;
    } else {
      budgetStatus.textContent = `✓ Budget available (₹${remaining} remaining)`;
      budgetStatus.className = 'budget-status success';
      dom.soldBtn.disabled = false;
    }
  } else {
    budgetDisplay.style.display = 'none';
  }
}

/**
 * Handle bid click - increase bid
 * User can increase bid without selecting a team
 */
function handleBidClick() {
  // Check price cap based on set type
  const nextBid = stateManager.getNextBidAmount();
  
  if (stateManager.currentSetIndex === 0) {
    // Captains: max Rs 5000
    if (nextBid > BIDDING_RULES.CAPTAIN_RULES.MAX_PRICE) {
      UIRenderer.showError(`Captain bid cannot exceed ₹${BIDDING_RULES.CAPTAIN_RULES.MAX_PRICE}`);
      return;
    }
  } else {
    // Normal players: max Rs 10000
    if (nextBid > BIDDING_RULES.MAX_PRICE) {
      UIRenderer.showError(`Player bid cannot exceed ₹${BIDDING_RULES.MAX_PRICE} (Team budget constraint)`);
      return;
    }
  }
  
  stateManager.increaseBid();
  UIRenderer.updateBidDisplay();
  playBidSound('increase');
  
  // Update budget status if team is selected
  if (dom.teamSelect.value) {
    handleTeamSelectChange();
  }
}

/**
 * Handle decrease bid click - reduce current bid
 */
function handleDecreaseBidClick() {
  const basePrice = stateManager.getInitialBidForSet(stateManager.currentSetIndex);
  
  if (stateManager.currentBid <= basePrice) {
    UIRenderer.showError(`Bid cannot go below base price ₹${basePrice}`);
    return;
  }
  
  stateManager.decreaseBid();
  UIRenderer.updateBidDisplay();
  playBidSound('decrease');
  
  // Update budget status if team is selected
  if (dom.teamSelect.value) {
    handleTeamSelectChange();
  }
}

/**
 * Play bid sound effect
 */
function playBidSound(type) {
  try {
    // Create audio context
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === 'increase') {
      // Pleasant "ding" sound for increase bid
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1000, now + 0.1);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'decrease') {
      // Lower "beep" sound for decrease bid
      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch (e) {
    // Silently fail if audio context not available
    console.debug('Audio context not available');
  }
}

/**
 * Handle sold click - mark player as sold
 */
function handleSoldClick() {
  const selectedTeam = dom.teamSelect.value;

  if (!selectedTeam) {
    UIRenderer.showError('Please select a team first to mark player as sold');
    dom.teamSelect.focus();
    return;
  }

  // Check if team already selected in this set
  const existingSelection = stateManager.getTeamSelectionInSet(
    selectedTeam,
    stateManager.currentSetIndex
  );

  if (existingSelection) {
    UIRenderer.showError(`${selectedTeam} has already selected a player in this set`);
    return;
  }

  // Check if team can buy reserve player (Set 7 - all 8 teams allowed)
  if (!stateManager.canTeamBuyReservePlayer(selectedTeam)) {
    if (stateManager.isReservePlayersSet()) {
      UIRenderer.showError(`Reserve Players: Only 8 teams can buy from this set. Maximum limit reached!`);
    } else {
      UIRenderer.showError(`${selectedTeam} cannot purchase this player.`);
    }
    return;
  }

  const currentPlayer = stateManager.getCurrentPlayer();
  const currentBid = stateManager.currentBid;

  // Check if team has enough budget
  if (!stateManager.canTeamBid(selectedTeam, currentBid)) {
    const remaining = stateManager.getTeamRemainingBudget(selectedTeam);
    UIRenderer.showError(`${selectedTeam} has insufficient budget. Bid: ₹${currentBid}, Available: ₹${remaining}`);
    return;
  }

  // Record the sale
  stateManager.recordSale(
    currentPlayer.id,
    currentPlayer.name,
    currentPlayer.category,
    selectedTeam,
    currentBid
  );

  // Update UI
  UIRenderer.updateTeamStats();
  UIRenderer.updateBidDisplay();

  // Try to move to next player
  const hasNextPlayer = stateManager.moveToNextPlayer();

  if (hasNextPlayer) {
    UIRenderer.renderAuctionPage();
  } else {
    // All players in set sold
    // For Set 7 (Reserve Players), show final summary immediately when all players sold
    if (stateManager.currentSetIndex === PLAYER_SETS.length - 1) {
      // Last set - show final summary
      stateManager.navigateToPage('final-summary-page');
      UIRenderer.showPage('final-summary-page');
      UIRenderer.renderFinalSummaryPage();
    } else if (stateManager.isCurrentSetComplete()) {
      // Check if all teams completed in regular sets
      // Show message that set is complete
      UIRenderer.showSuccess('Set complete! All players sold and all teams selected.');
      UIRenderer.updateAuctionButtonStates();
    } else {
      // Some teams haven't selected yet
      UIRenderer.showSuccess('Player sold! Waiting for remaining teams to complete their selections.');
      UIRenderer.renderAuctionPage();
    }
  }
}

/**
 * Handle previous player button - go back and undo last selection
 */
function handlePreviousPlayerClick() {
  if (!stateManager.canGoPreviousPlayer()) {
    UIRenderer.showError('No previous player to go back to');
    return;
  }

  const success = stateManager.goToPreviousPlayer();

  if (success) {
    UIRenderer.showSuccess('Went back to previous player. You can now change the team selection.');
    UIRenderer.renderAuctionPage();
  } else {
    UIRenderer.showError('Cannot go back. You may be at a different set.');
  }
}

/**
 * Handle next set button
 */
function handleNextSetClick() {
  if (!stateManager.isCurrentSetComplete()) {
    UIRenderer.showError('All teams must complete this set before moving to the next');
    return;
  }

  if (stateManager.getUnsoldPlayers().length > 0) {
    UIRenderer.showError('All players must be sold before moving to the next set');
    return;
  }

  const hasNextSet = stateManager.moveToNextSet();

  if (hasNextSet) {
    UIRenderer.renderAuctionPage();
  } else {
    // Auction complete
    stateManager.navigateToPage('final-summary-page');
    UIRenderer.showPage('final-summary-page');
    UIRenderer.renderFinalSummaryPage();
  }
}

/**
 * Handle back from auction
 * Goes to previous player if available, otherwise goes to teams page
 */
function handleBackFromAuction() {
  // First, try to go back to previous player in the auction
  if (stateManager.canGoPreviousPlayer()) {
    const success = stateManager.goToPreviousPlayer();
    if (success) {
      UIRenderer.showSuccess('Went back to previous player. You can now change the team selection.');
      UIRenderer.renderAuctionPage();
      return;
    }
  }

  // If no previous player, go back to previous page (teams page)
  const previousPage = stateManager.goBack();
  UIRenderer.showPage(previousPage);
  if (previousPage === 'teams-page') {
    UIRenderer.renderTeamsGrid();
  }
}

/**
 * Handle summary button
 */
function handleSummaryClick() {
  stateManager.navigateToPage('summary-page');
  UIRenderer.showPage('summary-page');
  UIRenderer.renderSummaryPage();
}

/**
 * Handle back from summary
 */
function handleBackFromSummary() {
  const previousPage = stateManager.goBack();
  UIRenderer.showPage(previousPage);
  if (previousPage === 'auction-page') {
    UIRenderer.renderAuctionPage();
  } else if (previousPage === 'teams-page') {
    UIRenderer.renderTeamsGrid();
  }
}

/**
 * Handle back from final summary
 */
function handleBackFromFinalSummary() {
  const previousPage = stateManager.goBack();
  UIRenderer.showPage(previousPage);
  if (previousPage === 'auction-page') {
    UIRenderer.renderAuctionPage();
  } else if (previousPage === 'teams-page') {
    UIRenderer.renderTeamsGrid();
  } else if (previousPage === 'summary-page') {
    UIRenderer.renderSummaryPage();
  }
}

/**
 * Handle restart auction
 */
function handleRestartAuction() {
  stateManager.reset();
  // Reset navigation history after restart
  stateManager.navigationHistory = ['landing-page'];
  UIRenderer.showPage('landing-page');
  UIRenderer.showSuccess('Auction reset. Ready for new auction.');
}

// ========== INITIALIZATION ==========

/**
 * Initialize the application
 */
function initializeApplication() {
  console.log('Initializing HPL Auction System...');
  console.log('Configuration:', {
    teams: TEAMS.length,
    sets: PLAYER_SETS.length,
    totalPlayers: PLAYER_SETS.reduce((sum, set) => sum + set.players.length, 0)
  });

  initializeEventListeners();
  UIRenderer.showPage('landing-page');
  renderLandingTeamsGrid();

  console.log('Application initialized successfully!');
}

// Start application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
  initializeApplication();
}

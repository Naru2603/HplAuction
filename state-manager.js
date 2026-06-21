/**
 * State Manager - Centralized Application State
 * ==============================================
 * Manages all auction state including:
 * - Current set and player
 * - Team selections
 * - Bid tracking
 * - Auction history
 */

class StateManager {
  constructor() {
    // Current auction flow state
    this.currentSetIndex = 0; // 0-6 for sets 1-7
    this.currentPlayerIndex = 0;
    this.currentBid = this.getInitialBidForSet(0);
    this.selectedTeam = null;
    this.auctionStarted = false;

    // Navigation history stack
    // Tracks page changes so back button returns to the actual previous page
    this.navigationHistory = ['landing-page'];

    // Player selection history - tracks the order of players sold in current set
    // Structure: [ { setIndex, playerIndex, playerData, team, price }, ... ]
    this.playerSelectionHistory = [];

    // Data structures
    // Structure: { setIndex: { teamName: { playerId, playerName, playerCategory, bidPrice } } }
    this.teamSelections = {};
    
    // Structure: { setIndex: [ { playerId, playerName, soldTeam, soldPrice } ] }
    this.soldPlayers = {};
    
    // Structure: { teamName: remainingBudget }
    this.teamBudgets = {};
    
    // Initialize sets and team budgets
    this.initializeSets();
  }

  /**
   * Get initial bid amount for a set
   * @param {number} setIndex - The set index
   * @returns {number} - Initial bid amount
   */
  getInitialBidForSet(setIndex) {
    if (setIndex === 0) {
      // Captains set
      return BIDDING_RULES.CAPTAIN_RULES.BASE_PRICE;
    }
    // Normal players
    return BIDDING_RULES.BASE_PRICE;
  }

  /**
   * Initialize all sets with empty data structures
   */
  initializeSets() {
    for (let i = 0; i < PLAYER_SETS.length; i++) {
      this.teamSelections[i] = {};
      this.soldPlayers[i] = [];
      
      // Initialize empty selections for each team
      TEAMS.forEach(team => {
        this.teamSelections[i][team] = null;
      });
    }
    
    // Initialize team budgets
    TEAMS.forEach(team => {
      this.teamBudgets[team] = TEAM_BUDGET;
    });
  }

  /**
   * Get current set
   */
  getCurrentSet() {
    return PLAYER_SETS[this.currentSetIndex];
  }

  /**
   * Get current player in current set
   */
  getCurrentPlayer() {
    const currentSet = this.getCurrentSet();
    return currentSet.players[this.currentPlayerIndex];
  }

  /**
   * Get unsold players in current set
   */
  getUnsoldPlayers() {
    const currentSet = this.getCurrentSet();
    const soldPlayerIds = this.soldPlayers[this.currentSetIndex].map(p => p.playerId);
    return currentSet.players.filter(p => !soldPlayerIds.includes(p.id));
  }

  /**
   * Check if all teams have made selections in current set
   */
  isCurrentSetComplete() {
    const selections = this.teamSelections[this.currentSetIndex];
    return TEAMS.every(team => selections[team] !== null);
  }

  /**
   * Get number of teams that have completed current set
   */
  getCompletedTeamsCount() {
    const selections = this.teamSelections[this.currentSetIndex];
    return TEAMS.filter(team => selections[team] !== null).length;
  }

  /**
   * Record a player sale
   * @param {number} playerId - Player ID
   * @param {string} playerName - Player name
   * @param {string} playerCategory - Player category
   * @param {string} team - Team that bought the player
   * @param {number} price - Sale price
   */
  recordSale(playerId, playerName, playerCategory, team, price) {
    const currentPlayer = this.getCurrentPlayer();
    
    // Record in sold players list
    this.soldPlayers[this.currentSetIndex].push({
      playerId,
      playerName,
      playerCategory,
      soldTeam: team,
      soldPrice: price
    });

    // Record in team selections
    this.teamSelections[this.currentSetIndex][team] = {
      playerId,
      playerName,
      playerCategory,
      bidPrice: price
    };
    
    // Deduct from team budget
    this.teamBudgets[team] -= price;

    // Record in player selection history for undo capability
    this.playerSelectionHistory.push({
      setIndex: this.currentSetIndex,
      playerIndex: this.currentPlayerIndex,
      playerData: currentPlayer,
      team: team,
      price: price
    });
  }

  /**
   * Get remaining budget for a team
   * @param {string} team - Team name
   * @returns {number} - Remaining budget
   */
  getTeamRemainingBudget(team) {
    return this.teamBudgets[team] || 0;
  }

  /**
   * Check if a team can bid at a certain price
   * @param {string} team - Team name
   * @param {number} price - Bid price
   * @returns {boolean} - True if team has enough budget
   */
  canTeamBid(team, price) {
    return this.getTeamRemainingBudget(team) >= price;
  }

  /**
   * Get total spent by a team
   * @param {string} team - Team name
   * @returns {number} - Total spent
   */
  getTeamTotalSpent(team) {
    return TEAM_BUDGET - this.getTeamRemainingBudget(team);
  }

  /**
   * Move to next unsold player in current set
   * @returns {boolean} - True if moved to next player, false if set is complete
   */
  moveToNextPlayer() {
    const unsoldPlayers = this.getUnsoldPlayers();
    
    if (unsoldPlayers.length === 0) {
      return false; // No more unsold players in this set
    }

    // Find next unsold player's index in the main players array
    const nextPlayer = unsoldPlayers[0];
    const currentSet = this.getCurrentSet();
    this.currentPlayerIndex = currentSet.players.findIndex(p => p.id === nextPlayer.id);
    this.resetBid();
    this.selectedTeam = null;
    
    return true;
  }

  /**
   * Move to next set
   */
  moveToNextSet() {
    if (this.currentSetIndex < PLAYER_SETS.length - 1) {
      this.currentSetIndex++;
      this.currentPlayerIndex = 0;
      this.resetBid();
      this.selectedTeam = null;
      // Don't clear player selection history - allow going back across sets
      return true;
    }
    return false;
  }

  /**
   * Check if auction is complete (all sets done)
   */
  isAuctionComplete() {
    return this.currentSetIndex === PLAYER_SETS.length - 1 && this.getUnsoldPlayers().length === 0;
  }

  /**
   * Increase current bid
   */
  increaseBid() {
    const increment = getBidIncrement(this.currentBid, this.currentSetIndex);
    this.currentBid += increment;
  }

  /**
   * Decrease current bid
   */
  decreaseBid() {
    const basePrice = this.getInitialBidForSet(this.currentSetIndex);
    if (this.currentBid > basePrice) {
      const increment = getBidIncrement(this.currentBid, this.currentSetIndex);
      this.currentBid = Math.max(basePrice, this.currentBid - increment);
    }
  }

  /**
   * Reset bid to base price for current set
   */
  resetBid() {
    this.currentBid = this.getInitialBidForSet(this.currentSetIndex);
  }

  /**
   * Get current bid increment
   */
  getCurrentBidIncrement() {
    return getBidIncrement(this.currentBid, this.currentSetIndex);
  }

  /**
   * Get next bid amount
   */
  getNextBidAmount() {
    return getNextBidAmount(this.currentBid, this.currentSetIndex);
  }

  /**
   * Get team's selected players for a specific set
   */
  getTeamSelectionInSet(teamName, setIndex) {
    return this.teamSelections[setIndex][teamName];
  }

  /**
   * Get all team selections for a specific set
   */
  getAllSelectionsInSet(setIndex) {
    return this.teamSelections[setIndex];
  }

  /**
   * Get all sold players in a specific set
   */
  getSoldPlayersInSet(setIndex) {
    return this.soldPlayers[setIndex];
  }

  /**
   * Get total spent by all teams across all sets
   */
  getTotalSpent() {
    let total = 0;
    for (let setIndex = 0; setIndex <= this.currentSetIndex; setIndex++) {
      const sold = this.soldPlayers[setIndex];
      total += sold.reduce((sum, p) => sum + p.soldPrice, 0);
    }
    return total;
  }

  /**
   * Get total spent by a specific team
   */
  getTeamTotalSpent(teamName) {
    let total = 0;
    for (let setIndex = 0; setIndex <= this.currentSetIndex; setIndex++) {
      const sold = this.soldPlayers[setIndex];
      const teamSales = sold.filter(p => p.soldTeam === teamName);
      total += teamSales.reduce((sum, p) => sum + p.soldPrice, 0);
    }
    return total;
  }

  /**
   * Get total players bought by a team
   */
  getTeamPlayerCount(teamName) {
    let count = 0;
    for (let setIndex = 0; setIndex <= this.currentSetIndex; setIndex++) {
      const selections = this.teamSelections[setIndex][teamName];
      if (selections) count++;
    }
    return count;
  }

  /**
   * Get all players bought by a team across all sets
   */
  getTeamPlayers(teamName) {
    const players = [];
    for (let setIndex = 0; setIndex <= this.currentSetIndex; setIndex++) {
      const selection = this.teamSelections[setIndex][teamName];
      if (selection) {
        players.push({
          setIndex: setIndex + 1,
          setName: PLAYER_SETS[setIndex].name,
          ...selection
        });
      }
    }
    return players;
  }

  /**
   * Get statistics for current auction
   */
  getStatistics() {
    let totalSold = 0;
    let totalAmount = 0;

    for (let setIndex = 0; setIndex <= this.currentSetIndex; setIndex++) {
      const sold = this.soldPlayers[setIndex];
      totalSold += sold.length;
      totalAmount += sold.reduce((sum, p) => sum + p.soldPrice, 0);
    }

    return {
      totalSold,
      totalAmount,
      currentSet: this.currentSetIndex + 1,
      totalSets: PLAYER_SETS.length
    };
  }

  /**
   * Get final statistics (when auction is complete)
   */
  getFinalStatistics() {
    const teamStats = {};
    
    TEAMS.forEach(team => {
      const players = this.getTeamPlayers(team);
      const totalSpent = this.getTeamTotalSpent(team);
      
      teamStats[team] = {
        players,
        playerCount: players.length,
        totalSpent,
        avgPrice: players.length > 0 ? Math.round(totalSpent / players.length) : 0
      };
    });

    return {
      teams: teamStats,
      totalSold: this.getStatistics().totalSold,
      grandTotal: this.getTotalSpent()
    };
  }

  /**
   * Reset entire auction state
   */
  reset() {
    this.currentSetIndex = 0;
    this.currentPlayerIndex = 0;
    this.currentBid = BIDDING_RULES.BASE_PRICE;
    this.selectedTeam = null;
    this.auctionStarted = false;
    this.playerSelectionHistory = [];
    this.initializeSets();
  }

  /**
   * Check if current set is the reserve players set
   * Set 7 (index 6) has 7 players, so 7 teams can buy from it
   */
  isReservePlayersSet() {
    return this.currentSetIndex === 6; // Set 7 is index 6 (0-based)
  }

  /**
   * Get count of teams that have bought from reserve players set
   */
  getTeamsBoughtFromReserveSet() {
    if (!this.isReservePlayersSet()) {
      return 0;
    }
    const selections = this.teamSelections[6];
    return TEAMS.filter(team => selections[team] !== null).length;
  }

  /**
   * Check if a team can buy a reserve player
   * Reserve set (Set 7) can be bought by 8 teams max
   */
  canTeamBuyReservePlayer(teamName) {
    if (!this.isReservePlayersSet()) {
      return true; // Not in reserve set, no restriction
    }

    // Check if team already has a player from reserve set
    if (this.getTeamSelectionInSet(teamName, 6) !== null) {
      return false;
    }

    // Check if 8 teams already bought from reserve set
    const teamsBought = this.getTeamsBoughtFromReserveSet();
    return teamsBought < 8;
  }

  /**
   * Get detailed audit log for debugging
   */
  getAuditLog() {
    return {
      currentSet: this.currentSetIndex,
      currentPlayer: this.currentPlayerIndex,
      currentBid: this.currentBid,
      teamSelections: this.teamSelections,
      soldPlayers: this.soldPlayers
    };
  }

  /**
   * Navigate to a page and track in history
   * @param {string} pageId - The page ID to navigate to
   */
  navigateToPage(pageId) {
    const currentPage = this.navigationHistory[this.navigationHistory.length - 1];
    
    // Only add to history if it's a different page
    if (currentPage !== pageId) {
      this.navigationHistory.push(pageId);
    }
  }

  /**
   * Go back to previous page
   * @returns {string} - The previous page ID, or 'landing-page' if no history
   */
  goBack() {
    if (this.navigationHistory.length > 1) {
      this.navigationHistory.pop(); // Remove current page
      return this.navigationHistory[this.navigationHistory.length - 1];
    }
    return 'landing-page'; // Default fallback
  }

  /**
   * Get current page
   * @returns {string} - The current page ID
   */
  getCurrentPage() {
    return this.navigationHistory[this.navigationHistory.length - 1];
  }

  /**
   * Check if we can go back to previous player
   * @returns {boolean} - True if there's a previous player to go back to
   */
  canGoPreviousPlayer() {
    return this.playerSelectionHistory.length > 0;
  }

  /**
   * Go back to previous player and undo the last selection
   * Handles going back across sets
   * @returns {boolean} - True if successfully went back, false otherwise
   */
  goToPreviousPlayer() {
    if (this.playerSelectionHistory.length === 0) {
      return false;
    }

    const lastSelection = this.playerSelectionHistory.pop();
    const { setIndex, playerIndex, playerData, team, price } = lastSelection;

    // Undo the sale for the selected player
    // 1. Remove from sold players list
    this.soldPlayers[setIndex] = this.soldPlayers[setIndex].filter(
      p => !(p.soldTeam === team && p.soldPrice === price && p.playerId === playerData.id)
    );

    // 2. Remove from team selections
    this.teamSelections[setIndex][team] = null;

    // 3. Restore team budget
    this.teamBudgets[team] += price;

    // 4. Navigate to that set and player
    this.currentSetIndex = setIndex;
    this.currentPlayerIndex = playerIndex;
    this.resetBid();
    this.selectedTeam = null;

    return true;
  }
}

// Create global state manager instance
const stateManager = new StateManager();

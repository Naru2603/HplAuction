/**
 * UI Renderer - Handles all UI rendering
 * ======================================
 * Separates UI logic from business logic
 * Provides reusable rendering functions
 */

class UIRenderer {
  /**
   * Page Management
   */
  static showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
      page.classList.remove('active');
    });
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add('active');
    }
  }

  /**
   * Render teams grid
   */
  static renderTeamsGrid() {
    const teamsGrid = document.getElementById('teams-grid');
    teamsGrid.innerHTML = '';

    TEAMS.forEach((teamName, index) => {
      const teamCard = document.createElement('div');
      teamCard.className = 'team-card';
      // Use team config for logo & sponsor if available
      const cfg = (typeof TEAMS_CONFIG !== 'undefined' && TEAMS_CONFIG[teamName]) ? TEAMS_CONFIG[teamName] : null;
      const logoHtml = cfg ? `<img src="${cfg.logo}" alt="${teamName} logo" class="team-logo"/>` : `<div class="team-icon">🏆</div>`;
      const sponsorHtml = cfg ? `<p class="team-sponsor">Sponsor: ${cfg.sponsor}</p>` : '';

      teamCard.innerHTML = `
        ${logoHtml}
        <h3>${teamName}</h3>
        <p>Team ${index + 1}</p>
        ${sponsorHtml}
        <div class="team-stats">
          <span class="team-stat">Players: <strong id="team-count-${index}">0</strong>/6</span>
        </div>
      `;
      teamCard.setAttribute('data-team-name', teamName);
      teamCard.addEventListener('click', () => {
        // Show team details modal/page
        UIRenderer.showTeamDetails(teamName);
      });
      teamsGrid.appendChild(teamCard);
    });

    this.updateTeamStats();
  }

  /**
   * Update team statistics display
   */
  static updateTeamStats() {
    TEAMS.forEach((teamName, index) => {
      const count = stateManager.getTeamPlayerCount(teamName);
      const element = document.getElementById(`team-count-${index}`);
      if (element) {
        element.textContent = count;
      }
    });
  }

  /**
   * Render auction page for current set
   */
  static renderAuctionPage() {
    const currentSet = stateManager.getCurrentSet();
    const currentPlayer = stateManager.getCurrentPlayer();
    const completedCount = stateManager.getCompletedTeamsCount();
    const totalTeams = TEAMS.length;
    const unsoldCount = stateManager.getUnsoldPlayers().length;

    // Update set information
    document.getElementById('set-name').textContent = `Set ${currentSet.id}: ${currentSet.name}`;
    document.getElementById('set-counter').textContent = `Set ${currentSet.id} of ${PLAYER_SETS.length}`;
    document.getElementById('set-description').textContent = currentSet.description;

    // Update progress bar
    const progress = (completedCount / totalTeams) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `${completedCount} of ${totalTeams} teams completed`;

    // Update player display
    if (currentPlayer) {
      document.getElementById('player-photo').src = currentPlayer.photo;
      document.getElementById('player-name').textContent = currentPlayer.name;
      document.getElementById('player-category').textContent = currentPlayer.category;
      document.getElementById('current-player').textContent = stateManager.currentPlayerIndex + 1;
      document.getElementById('total-players').textContent = currentSet.players.length;
      document.getElementById('unsold-count').textContent = unsoldCount;
    }

    // Update bid display
    this.updateBidDisplay();

    // Populate team select
    this.populateTeamSelect();

    // Update buttons state
    this.updateAuctionButtonStates();
  }

  /**
   * Update bid display
   */
  static updateBidDisplay() {
    const currentBid = stateManager.currentBid;
    const increment = stateManager.getCurrentBidIncrement();
    const basePrice = stateManager.getInitialBidForSet(stateManager.currentSetIndex);
    
    document.getElementById('bid-amount').textContent = currentBid;
    document.getElementById('bid-increment').textContent = `(+${increment})`;
    document.getElementById('base-price').textContent = basePrice;
  }

  /**
   * Populate team select dropdown
   */
  static populateTeamSelect() {
    const teamSelect = document.getElementById('team-select');
    
    teamSelect.innerHTML = '<option value="">-- Choose Team --</option>';
    
    TEAMS.forEach(teamName => {
      // Check if team already selected in this set
      const alreadySelected = stateManager.getTeamSelectionInSet(teamName, stateManager.currentSetIndex) !== null;
      
      // Check if team can buy reserve player (Set 7 only allows 7 teams)
      const canBuyReserve = stateManager.canTeamBuyReservePlayer(teamName);
      
      if (!alreadySelected && canBuyReserve) {
        const option = document.createElement('option');
        option.value = teamName;
        option.textContent = teamName;
        teamSelect.appendChild(option);
      }
    });

    // Always reset to default "Choose Team" for new player
    teamSelect.value = '';
  }

  /**
   * Update auction button states
   */
  static updateAuctionButtonStates() {
    const nextSetBtn = document.getElementById('next-set-btn');
    const previousPlayerBtn = document.getElementById('previous-player-btn');
    const isSetComplete = stateManager.isCurrentSetComplete();
    const unsoldCount = stateManager.getUnsoldPlayers().length;

    // Enable next set button only if all teams selected AND all players sold
    nextSetBtn.disabled = !(isSetComplete && unsoldCount === 0);
    nextSetBtn.textContent = isSetComplete && unsoldCount === 0 ? 'Next Set' : 'Complete Set First';

    // Enable previous player button if there's history
    previousPlayerBtn.disabled = !stateManager.canGoPreviousPlayer();
  }

  /**
   * Render summary page
   */
  static renderSummaryPage() {
    const stats = stateManager.getStatistics();
    const currentSet = stateManager.getCurrentSet();

    // Update summary stats
    document.getElementById('summary-current-set').textContent = `Set ${stats.currentSet}`;
    document.getElementById('summary-total-sold').textContent = stats.totalSold;
    document.getElementById('summary-total-amount').textContent = stats.totalAmount;

    // Render set tabs
    this.renderSetTabs();

    // Render teams summary for current set
    this.renderTeamsSummaryForSet(stateManager.currentSetIndex);

    // Render sold players for current set
    this.renderSoldPlayersForSet(stateManager.currentSetIndex);
  }

  /**
   * Render set tabs for switching between sets
   */
  static renderSetTabs() {
    const tabsContainer = document.getElementById('set-tabs-container');
    tabsContainer.innerHTML = '';

    PLAYER_SETS.forEach((set, index) => {
      const tab = document.createElement('button');
      tab.className = 'set-tab' + (index === stateManager.currentSetIndex ? ' active' : '');
      tab.textContent = `Set ${set.id}`;
      tab.addEventListener('click', () => {
        stateManager.currentSetIndex = index;
        this.renderTeamsSummaryForSet(index);
        this.renderSoldPlayersForSet(index);
        // Update active tab
        document.querySelectorAll('.set-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
      tabsContainer.appendChild(tab);
    });
  }

  /**
   * Render teams summary for specific set
   */
  static renderTeamsSummaryForSet(setIndex) {
    const teamsSummaryContainer = document.getElementById('teams-summary');
    teamsSummaryContainer.innerHTML = '';

    const selections = stateManager.getAllSelectionsInSet(setIndex);
    const setName = PLAYER_SETS[setIndex].name;

    TEAMS.forEach(teamName => {
      const selection = selections[teamName];
      const teamCard = document.createElement('div');
      teamCard.className = 'team-summary-card';

      if (selection) {
        teamCard.innerHTML = `
          <h4>${teamName}</h4>
          <div class="team-selection-info">
            <p><strong>Player:</strong> ${selection.playerName}</p>
            <p><strong>Category:</strong> ${selection.playerCategory}</p>
            <p><strong>Price:</strong> ₹${selection.bidPrice}</p>
          </div>
        `;
      } else {
        teamCard.innerHTML = `
          <h4>${teamName}</h4>
          <p class="not-selected">Not yet selected</p>
        `;
      }

      teamsSummaryContainer.appendChild(teamCard);
    });
  }

  /**
   * Render sold players for specific set
   */
  static renderSoldPlayersForSet(setIndex) {
    const soldPlayersList = document.getElementById('sold-players-list');
    soldPlayersList.innerHTML = '';

    const soldPlayers = stateManager.getSoldPlayersInSet(setIndex);

    if (soldPlayers.length === 0) {
      soldPlayersList.innerHTML = '<p class="empty-message">No players sold yet in this set.</p>';
      return;
    }

    soldPlayers.forEach(sale => {
      const playerItem = document.createElement('div');
      playerItem.className = 'sold-player-item';
      playerItem.innerHTML = `
        <div class="sold-player-info">
          <h5>${sale.playerName}</h5>
          <p class="player-category">${sale.playerCategory}</p>
        </div>
        <div class="sold-player-team">
          <span class="team-badge">${sale.soldTeam}</span>
        </div>
        <div class="sold-player-price">
          <span class="sold-price-amount">₹${sale.soldPrice}</span>
        </div>
      `;
      soldPlayersList.appendChild(playerItem);
    });
  }

  /**
   * Render final summary page with comprehensive team rosters
   */
  static renderFinalSummaryPage() {
    const stats = stateManager.getFinalStatistics();

    // Update statistics
    document.getElementById('final-total-sold').textContent = stats.totalSold;
    document.getElementById('final-total-amount').textContent = stats.grandTotal;

    // Render team summaries
    const summaryContainer = document.getElementById('final-summary-by-team');
    summaryContainer.innerHTML = '';

    Object.entries(stats.teams).forEach(([teamName, teamData]) => {
      const teamSection = document.createElement('div');
      teamSection.className = 'team-final-summary';
      
      // Get team config for logo and sponsor
      const teamConfig = TEAMS_CONFIG[teamName] || {};
      
      // Group players by set
      const playersBySet = {};
      teamData.players.forEach(player => {
        if (!playersBySet[player.setName]) {
          playersBySet[player.setName] = [];
        }
        playersBySet[player.setName].push(player);
      });

      // Build players HTML organized by set
      let playersHTML = '';
      Object.entries(playersBySet).forEach(([setName, players]) => {
        playersHTML += `<div class="set-roster-group">`;
        playersHTML += `<h6 class="set-roster-title">${setName}</h6>`;
        
        players.forEach(player => {
          playersHTML += `
            <div class="player-in-roster">
              <span class="player-name">${player.playerName}</span>
              <span class="player-category-badge">${player.playerCategory}</span>
              <span class="player-price">₹${player.bidPrice}</span>
            </div>
          `;
        });
        
        playersHTML += `</div>`;
      });

      const remainingBudget = stateManager.getTeamRemainingBudget(teamName);
      const teamColor = teamConfig.color || '#6c63ff';

      teamSection.innerHTML = `
        <div class="team-header-summary" style="border-left: 4px solid ${teamColor}">
          <div class="team-title-info">
            <h3>${teamName}</h3>
            ${teamConfig.sponsor ? `<p class="team-sponsor-info">Sponsor: ${teamConfig.sponsor}</p>` : ''}
          </div>
        </div>
        <div class="team-stats-grid">
          <div class="stat">
            <span class="label">Total Players</span>
            <span class="value">${teamData.playerCount}</span>
          </div>
          <div class="stat">
            <span class="label">Total Spent</span>
            <span class="value">₹${teamData.totalSpent}</span>
          </div>
          <div class="stat">
            <span class="label">Remaining Budget</span>
            <span class="value">₹${remainingBudget}</span>
          </div>
          <div class="stat">
            <span class="label">Avg Price/Player</span>
            <span class="value">₹${teamData.avgPrice}</span>
          </div>
        </div>
        <div class="player-roster">
          <h5>Complete Squad</h5>
          ${playersHTML}
        </div>
      `;
      
      summaryContainer.appendChild(teamSection);
    });
  }

    /**
     * Show team details (captain, roster) when team card clicked
     */
    static showTeamDetails(teamName) {
      this.showTeamDetailsModal(teamName);
    }

  /**
   * Export auction data as PDF (teams roster)
   */
  static exportAuctionDataAsJSON() {
    try {
      // Disable button to prevent multiple clicks
      const downloadBtn = document.getElementById('download-summary-btn');
      if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.textContent = '⬇️ Downloading...';
      }

      const { jsPDF } = window.jspdf;
      if (!jsPDF) {
        throw new Error('jsPDF library not loaded');
      }

      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFont('helvetica');

      const stats = stateManager.getFinalStatistics();
      const now = new Date();
      const dateStr = now.toLocaleString('en-IN');
      const pageWidth = doc.internal.pageSize.getWidth();
      const leftMargin = 14;
      const rightMargin = pageWidth - 14;
      const contentWidth = rightMargin - leftMargin;
      
      let pageNumber = 1;

      // Loop each team → separate page
      Object.entries(stats.teams).forEach(([teamName, teamData], teamIndex) => {
        if (teamIndex !== 0) {
          doc.addPage();
          pageNumber++;
        }

        let y = 15;

        // Header with proper alignment
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(dateStr, leftMargin, y);
        doc.text("Auction Report", rightMargin - 40, y);

        y += 8;

        // Title
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text("HPL 2026 Auction Report", leftMargin + 5, y);

        y += 12;

        // Team Logo and Name
        const teamConfig = TEAMS_CONFIG[teamName] || {};
        
        if (teamConfig.logo) {
          try {
            doc.addImage(teamConfig.logo, 'PNG', leftMargin, y - 2, 8, 8);
          } catch (e) {
            // Logo failed to load, continue without it
          }
        }

        // Team Name
        doc.setFontSize(18);
        doc.setTextColor(0, 102, 204);
        doc.text(teamName, leftMargin + 10, y + 3);

        y += 10;

        // Owner
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Owner: ${teamConfig.sponsor || 'N/A'}`, leftMargin + 10, y);

        y += 8;

        // Table Header Background
        doc.setFillColor(200, 200, 200);
        doc.rect(leftMargin, y, contentWidth, 7, 'F');
        
        // Table Header Text
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text("SR. NO", leftMargin + 5, y + 5);
        doc.text("PLAYER NAME", leftMargin + 30, y + 5);
        doc.text("PRICE", rightMargin - 25, y + 5);

        y += 15; // Increased space after header

        // Table Borders
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);

        // Players
        doc.setFont(undefined, 'normal');
        teamData.players.forEach((player, index) => {
          doc.setFontSize(11);
          doc.setTextColor(0, 0, 0);

          // Draw row with borders
          doc.rect(leftMargin, y - 6, contentWidth, 7);

          doc.text(`${index + 1}`, leftMargin + 5, y);
          doc.text(player.playerName, leftMargin + 30, y);
          doc.text(`Rs ${player.bidPrice}`, rightMargin - 25, y);

          y += 8; // Adjusted row height

          // Check if we need a new page
          if (y > 260) {
            // Add page number at bottom
            doc.setFontSize(9);
            doc.setTextColor(150, 150, 150);
            doc.text(`Page ${pageNumber}`, rightMargin - 15, 285);

            doc.addPage();
            pageNumber++;
            y = 20;
          }
        });

        // Footer Total
        y += 3;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`Total Spent: Rs ${teamData.totalSpent}`, leftMargin + 5, y);

        // Add page number at bottom
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${pageNumber}`, rightMargin - 2, 290, { align: 'right' });
      });

      // Add footers to all pages
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Bottom line first
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(leftMargin, 282, rightMargin, 282);
        
        // Set footer styling
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        
        // Left footer - Hunuman Premier League 2026
        doc.text("Hunuman Premier League 2026", leftMargin, 290);
      }

      // Save PDF
      doc.save("HPL_2026_Auction_Report.pdf");

      this.showSuccess('Auction summary downloaded as PDF!');

      // Re-enable button after download
      setTimeout(() => {
        if (downloadBtn) {
          downloadBtn.disabled = false;
          downloadBtn.textContent = '⬇️ Download Summary';
        }
      }, 1000);

    } catch (error) {
      console.error('PDF Download Error:', error);
      this.showError(`Download failed: ${error.message}`);
      
      // Re-enable button on error
      const downloadBtn = document.getElementById('download-summary-btn');
      if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.textContent = '⬇️ Download Summary';
      }
    }
  }

  /**
   * Show error message
   */
  static showError(message) {
    alert(message); // Simple alert for now, can be replaced with toast notification
  }

  /**
   * Show success message
   */
  static showSuccess(message) {
    // Could be implemented with a toast notification system
    console.log('Success:', message);
  }

  /**
   * Disable/Enable bid button
   */
  static setBidButtonState(enabled) {
    const bidBtn = document.getElementById('bid-btn');
    bidBtn.disabled = !enabled;
  }

  /**
   * Disable/Enable sold button
   */
  static setSoldButtonState(enabled) {
    const soldBtn = document.getElementById('sold-btn');
    soldBtn.disabled = !enabled;
  }

  /**
   * Disable/Enable next set button
   */
  static setNextSetButtonState(enabled) {
    const nextSetBtn = document.getElementById('next-set-btn');
    nextSetBtn.disabled = !enabled;
  }

  /**
   * Show team details modal
   * @param {string} teamName - Team name to display
   */
  static showTeamDetailsModal(teamName) {
    const modal = document.getElementById('team-details-modal');
    const modalTeamName = document.getElementById('modal-team-name');
    const modalTeamLogo = document.getElementById('modal-team-logo');
    const modalTeamSponsor = document.getElementById('modal-team-sponsor');
    const modalTeamColor = document.getElementById('modal-team-color');
    const squadContainer = document.getElementById('modal-team-squad');

    const teamConfig = TEAMS_CONFIG[teamName];
    
    // Set header and basic info
    modalTeamName.textContent = teamName;
    modalTeamLogo.src = teamConfig.logo;
    modalTeamSponsor.textContent = teamConfig.sponsor;
    modalTeamColor.textContent = teamConfig.color;

    // Populate squad members from all sets
    squadContainer.innerHTML = '';
    PLAYER_SETS.forEach((set, setIndex) => {
      set.players.forEach(player => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'squad-member';
        memberDiv.innerHTML = `
          <span class="squad-member-name">${player.name}</span>
          <span class="squad-member-category">${set.name}</span>
        `;
        squadContainer.appendChild(memberDiv);
      });
    });

    modal.style.display = 'flex';
  }

  /**
   * Close team details modal
   */
  static closeTeamDetailsModal() {
    const modal = document.getElementById('team-details-modal');
    modal.style.display = 'none';
  }

  /**
   * Show all players in current set
   */
  static showSetPlayersModal() {
    const currentSetIndex = stateManager.currentSetIndex;
    const currentSet = PLAYER_SETS[currentSetIndex];
    
    if (!currentSet) return;

    // Populate modal header
    document.getElementById('modal-set-name').textContent = `${currentSet.name} - All Players`;
    document.getElementById('modal-set-description').textContent = currentSet.description;

    // Populate players
    const playersContainer = document.getElementById('modal-set-players');
    playersContainer.innerHTML = '';

    currentSet.players.forEach((player) => {
      const playerElement = document.createElement('div');
      playerElement.className = 'squad-member';
      playerElement.innerHTML = `
        <span class="squad-member-name">${player.name}</span>
        <span class="squad-member-category">${player.category}</span>
      `;
      playersContainer.appendChild(playerElement);
    });

    // Show modal
    const modal = document.getElementById('set-players-modal');
    modal.style.display = 'flex';
  }

  /**
   * Close set players modal
   */
  static closeSetPlayersModal() {
    const modal = document.getElementById('set-players-modal');
    modal.style.display = 'none';
  }
}

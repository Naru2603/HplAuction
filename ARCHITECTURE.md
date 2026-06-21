# HPL Auction System - Architecture Documentation

## 🏗️ System Architecture

This document provides detailed technical architecture of the HPL Auction System.

## File-by-File Breakdown

### 1. config.js
**Purpose**: Centralized configuration for the entire application

**Key Exports**:
- `TEAMS` - Array of 8 team names
- `PLAYER_SETS` - Array of 7 player sets with 8 players each (Set 1-6) and 3 players (Set 7)
- `BIDDING_RULES` - Base price and increment rules

**Key Functions**:
- `getBidIncrement(currentBid)` - Returns increment amount based on current bid
- `getNextBidAmount(currentBid)` - Calculates next bid amount

**Why Separate?**
- Easy to modify configuration without touching logic
- Centralized source of truth for data
- Supports different tournament configurations

**Example Customization**:
```javascript
// Change base price
const BIDDING_RULES = {
  BASE_PRICE: 750  // Changed from 500
};

// Add more players
PLAYER_SETS[0].players.push({
  id: 109,
  name: 'New Player',
  category: 'Batsman',
  photo: 'images/new.jpg'
});
```

---

### 2. state-manager.js
**Purpose**: Centralized application state management

**Class**: `StateManager`

**Key Properties**:
```javascript
currentSetIndex    // 0-6 for sets 1-7
currentPlayerIndex // Index in current set
currentBid         // Current bid amount
selectedTeam       // Currently selected team
teamSelections     // 2D structure: { setIndex: { teamName: playerData } }
soldPlayers        // 2D array: { setIndex: [ soldPlayer objects ] }
```

**Key Methods**:

#### Reading State
- `getCurrentSet()` - Returns current player set
- `getCurrentPlayer()` - Returns current player object
- `getUnsoldPlayers()` - Returns unsold players in current set
- `isCurrentSetComplete()` - Checks if all teams selected
- `getCompletedTeamsCount()` - Returns number of teams that selected

#### Modifying State
- `recordSale(playerId, playerName, playerCategory, team, price)` - Records player sale
- `moveToNextPlayer()` - Moves to next unsold player
- `moveToNextSet()` - Advances to next set
- `increaseBid()` - Increments current bid
- `resetBid()` - Resets to base price

#### Getting Data
- `getTeamSelectionInSet(teamName, setIndex)` - Gets team's selection in specific set
- `getAllSelectionsInSet(setIndex)` - Gets all selections for a set
- `getSoldPlayersInSet(setIndex)` - Gets sold players in set
- `getTotalSpent()` - Total spent across all sets
- `getTeamTotalSpent(teamName)` - Team's total spending
- `getTeamPlayers(teamName)` - All players bought by team
- `getStatistics()` - Current auction statistics
- `getFinalStatistics()` - Complete auction statistics

#### Utility
- `reset()` - Resets entire auction state
- `getAuditLog()` - Returns debug information

**State Structure**:
```javascript
teamSelections: {
  0: {  // Set 1
    'Team A': { playerId, playerName, playerCategory, bidPrice },
    'Team B': null,
    // ...
  },
  1: {  // Set 2
    // ...
  }
}

soldPlayers: {
  0: [  // Set 1
    { playerId, playerName, soldTeam, soldPrice },
    { playerId, playerName, soldTeam, soldPrice }
  ]
}
```

**Why Separate StateManager?**
- Decouples state from UI
- Enables testing without DOM
- Reusable across different UI implementations
- Clean API for state queries
- Easy debugging with audit log

---

### 3. ui-renderer.js
**Purpose**: All UI rendering logic, completely decoupled from state

**Class**: `UIRenderer` (all static methods)

**Key Methods**:

#### Page Navigation
- `showPage(pageId)` - Shows specific page, hides others
  - Handles fade-in/fade-out animations
  - Updates `.active` class

#### Team Grid
- `renderTeamsGrid()` - Renders all 8 teams
- `updateTeamStats()` - Updates player count for each team
  - Updates dynamically as auction progresses

#### Auction Display
- `renderAuctionPage()` - Full auction page render
- `updateBidDisplay()` - Updates bid amount and increment
- `populateTeamSelect()` - Populates dropdown with available teams
  - Only shows teams that haven't selected yet
- `updateAuctionButtonStates()` - Enables/disables buttons based on state

#### Summary Pages
- `renderSummaryPage()` - Renders mid-auction summary
- `renderFinalSummaryPage()` - Renders final auction summary
- `renderSetTabs()` - Creates clickable tabs for each set
- `renderTeamsSummaryForSet(setIndex)` - Shows teams & selections for set
- `renderSoldPlayersForSet(setIndex)` - Shows sold players for set

#### Notifications
- `showError(message)` - Shows error message
- `showSuccess(message)` - Shows success message

**Why Separate UIRenderer?**
- No business logic in UI code
- Easy to change UI without affecting state
- Reusable across different pages
- Testable in isolation
- Follows separation of concerns principle

---

### 4. script.js
**Purpose**: Event handlers and application orchestration

**Structure**:

#### DOM References
- `const dom = { ... }` - Cached DOM element references
  - Improves performance (no repeated DOM queries)
  - Single source of truth for element access

#### Event Listeners Setup
- `initializeEventListeners()` - Attaches all event handlers
  - Called once on page load

#### Event Handlers
- `handleStartAuction()` - Shows teams page
- `handleBackFromTeams()` - Returns to landing
- `handleStartSetAuction()` - Begins auction for current set
- `handleBidClick()` - Increases current bid
- `handleSoldClick()` - Records player sale, moves to next
- `handleNextSetClick()` - Advances to next set
- `handleBackFromAuction()` - Returns to teams page
- `handleSummaryClick()` - Shows summary
- `handleBackFromSummary()` - Returns to auction
- `handleRestartAuction()` - Resets entire auction

#### Application Flow
```
User Action
    ↓
Event Handler
    ↓
Update State (stateManager)
    ↓
Validate State
    ↓
Re-render UI (UIRenderer)
```

#### Initialization
- `initializeApplication()` - Main entry point
  - Waits for DOM to load
  - Sets up event listeners
  - Shows landing page

**Why Separate Script?**
- Orchestration logic separate from state and UI
- Easy to track user flow
- Centralized error handling
- Clean event-driven architecture

---

### 5. index.html
**Purpose**: Semantic HTML structure for all pages

**Pages**:

1. **Landing Page** (#landing-page)
   - Hero card with start button
   - Introduction to system

2. **Teams Page** (#teams-page)
   - Grid of 8 team cards
   - Shows player count per team
   - Navigation buttons

3. **Auction Page** (#auction-page)
   - Set progress indicator with progress bar
   - Current player display with photo
   - Team selection dropdown
   - Bid display and controls
   - Navigation buttons

4. **Summary Page** (#summary-page)
   - Statistics cards
   - Set tabs for navigation
   - Team selections view
   - Sold players list

5. **Final Summary Page** (#final-summary-page)
   - Overall statistics
   - Complete team rosters
   - Player distribution
   - Final spending breakdown

**Structure Principles**:
- Semantic HTML elements
- Data attributes for identification
- IDs for JavaScript targeting
- Classes for styling
- No inline event handlers
- Accessible markup

---

### 6. styles.css
**Purpose**: Responsive, modern styling

**CSS Architecture**:

#### Design System
- **CSS Variables**: Color scheme, spacing, shadows
- **Consistent Spacing**: 8px, 12px, 16px, 20px, 24px, 28px, 32px
- **Color Palette**: 
  - Primary: Dark background (#0c1220)
  - Accent: Purple (#6c63ff)
  - Success: Green (#10b981)
  - Text: Light (#f8fafc)

#### Sections
1. **Root & Reset** - CSS variables, box-sizing, defaults
2. **Page Transitions** - Fade in/out animations
3. **Common Elements** - Headers, footers, buttons
4. **Landing Page** - Hero card styling
5. **Teams Page** - Grid and team cards
6. **Auction Page** - Player display, controls
7. **Summary Pages** - Tabs, cards, lists
8. **Responsive** - Mobile-first breakpoints

#### Responsive Breakpoints
- **Mobile-first**: Base styles for all devices
- **@media (max-width: 768px)**: Tablet optimizations
- **@media (max-width: 1024px)**: Larger screens

#### Button Styles
- `.primary-btn` - Main action buttons (gradient)
- `.secondary-btn` - Secondary actions
- `.success-btn` - Confirm/success actions
- `.ghost-btn` - Navigation buttons
- All buttons have hover and active states

---

## Data Flow Diagrams

### Auction Flow

```
START AUCTION
    ↓
Select Set 1: Captains
    ↓
LOOP for each unsold player:
    ├── Display player
    ├── Select team
    ├── Increase bid (optional)
    └── Mark sold
    ├── Move to next player
    └── Update team stats
    ↓
All players sold? YES
    ├── All teams selected? YES → Move to next set
    └── All teams selected? NO → Wait for remaining
    ↓
Move to Set 2...Set 6
    ↓
All sets complete?
    ↓
Show Final Summary
```

### State Update Flow

```
User clicks "Sold"
    ↓
handleSoldClick() validates input
    ↓
stateManager.recordSale() updates state
    ↓
stateManager.moveToNextPlayer() if available
    ↓
UIRenderer.renderAuctionPage() re-renders display
    ↓
UI updates on screen
```

---

## Key Design Principles

### 1. **Separation of Concerns**
- **config.js**: Data & rules
- **state-manager.js**: State logic
- **ui-renderer.js**: UI rendering
- **script.js**: Event orchestration
- **index.html**: Markup
- **styles.css**: Styling

### 2. **Single Responsibility**
- Each function has one clear purpose
- Each module handles one concern
- Easy to test and maintain

### 3. **Centralized State**
- All application state in `StateManager` class
- One source of truth
- Predictable updates
- Easy debugging

### 4. **Declarative UI**
- `UIRenderer` methods don't modify state
- UI reflects current state
- No hidden state in DOM

### 5. **Event-Driven Architecture**
- User actions trigger events
- Events call handlers
- Handlers update state
- State changes trigger re-renders

---

## Extension Points

### Adding New Features

1. **New Bidding Rule**
   - Modify `BIDDING_RULES` in `config.js`
   - Update `getBidIncrement()` function

2. **New Statistics**
   - Add method to `StateManager` class
   - Add rendering method to `UIRenderer` class
   - Call from `script.js` event handler

3. **New Page**
   - Add HTML section to `index.html`
   - Create render method in `UIRenderer`
   - Add event listeners in `script.js`
   - Add CSS styling to `styles.css`

4. **Custom Team Rules**
   - Modify `TEAMS` array in `config.js`
   - Validation logic in `StateManager`

5. **Export/Import Data**
   - Get state from `stateManager.getAuditLog()`
   - Parse and export to JSON/CSV
   - Parse and load from file

---

## Performance Considerations

### Current Implementation
- **DOM Caching**: All DOM refs in `dom` object
- **Efficient Re-renders**: Only update changed elements
- **No Memory Leaks**: Event listeners cleaned up appropriately
- **CSS Animations**: GPU-accelerated (transform, opacity)

### Future Optimizations
- **Virtual DOM**: For large player lists
- **Lazy Loading**: Images when needed
- **Service Workers**: For offline support
- **IndexedDB**: To persist state across sessions

---

## Debugging Guide

### 1. **Check State**
```javascript
console.log(stateManager.getAuditLog());
```

### 2. **Validate Configuration**
```javascript
console.log({
  teams: TEAMS.length,
  sets: PLAYER_SETS.length,
  totalPlayers: PLAYER_SETS.reduce((s, set) => s + set.players.length, 0)
});
```

### 3. **Trace User Actions**
Add console logs in event handlers:
```javascript
function handleSoldClick() {
  console.log('Sold clicked');
  console.log('Current team:', dom.teamSelect.value);
  console.log('Current player:', stateManager.getCurrentPlayer());
  // ...
}
```

### 4. **Browser DevTools**
- **Console**: Check for JavaScript errors
- **Elements**: Inspect DOM structure
- **Network**: Check image loading
- **Performance**: Profile render performance

---

## Testing Strategy

### Unit Tests (for StateManager)
```javascript
// Test state updates
const manager = new StateManager();
manager.recordSale(101, 'Player 1', 'Batsman', 'Team A', 500);
assert(manager.isCurrentSetComplete() === false);
```

### Integration Tests
```javascript
// Test full auction flow
// 1. Start auction
// 2. Select player
// 3. Bid
// 4. Record sale
// 5. Move to next
// 6. Verify state
```

### UI Tests
```javascript
// Test rendering
UIRenderer.renderAuctionPage();
assert(document.getElementById('player-photo').src !== '');
```

---

## Deployment Checklist

- [ ] Update player data in `config.js`
- [ ] Add all player images to `images/` folder
- [ ] Test auction flow end-to-end
- [ ] Test on mobile devices
- [ ] Check image loading on deployed server
- [ ] Verify all links work
- [ ] Test browser compatibility
- [ ] Optimize image sizes
- [ ] Test file paths (relative vs absolute)
- [ ] Verify no console errors

---

**Last Updated**: April 2026
**Version**: 1.0

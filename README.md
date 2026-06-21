# HPL Auction System - Complete Application

A modern, feature-rich web-based auction system for managing cricket team auctions with multiple player sets, bidding rules, and comprehensive summaries.

## 🎯 Features

- **8 Teams Support**: Manage exactly 8 teams throughout the auction
- **7 Player Sets**: Auction organized into 7 sets (Sets 1-6 with 8 players each, Set 7 with 3 reserve players)
- **Smart Bidding Rules**: Automatic bid increments based on current bid amount
- **State Preservation**: All selections, bids, and team data preserved throughout the auction
- **Progress Tracking**: Real-time progress indicators showing completion status
- **Comprehensive Summaries**: View detailed auction summaries with player distribution and spending
- **Responsive Design**: Works seamlessly on desktop and tablet devices
- **Dynamic Image Management**: Easy-to-update player photo system

## 📁 Project Structure

```
HplAuction - Old/
├── index.html           # Main HTML structure (4 pages)
├── script.js            # Event handlers & auction orchestration
├── state-manager.js     # State management (centralized application state)
├── ui-renderer.js       # UI rendering logic (separation of concerns)
├── config.js            # Configuration (teams, players, bidding rules)
├── styles.css           # Enhanced responsive styling
├── images/              # Player images folder (create & manage here)
├── README.md            # This file
└── ARCHITECTURE.md      # Detailed architecture documentation
```

## 🚀 Quick Start

1. **Open the Application**
   - Open `index.html` in a modern web browser
   - The landing page will appear with "Start Auction" button

2. **Basic Flow**
   - Landing → Teams Overview → Auction (7 Sets) → Final Summary

3. **Image Setup** (See section below)

## 📸 Image Management

### Directory Structure

Create an `images` folder in the project root with the following subfolders structure:

```
images/
├── captains/
│   ├── narendra-korade.jpg
│   ├── soham-jagtap.jpg
│   ├── sayaji-gaikwad.jpg
│   └── ... (8 total)
│
├── all-rounders/
│   ├── omkar-sangle.jpg
│   ├── moin-chaus.jpg
│   ├── kuldeep-patil.jpg
│   └── ... (8 total)
│
├── middle-order/
│   ├── sagar-bichkar.jpg
│   ├── avinash-korade.jpg
│   ├── suraj-kenwade.jpg
│   └── ... (8 total)
│
├── fast-bowlers/
│   ├── pranav-sangle.jpg
│   ├── om-chavan.jpg
│   ├── rajat-ballole.jpg
│   └── ... (8 total)
│
├── spin-bowlers/
│   ├── prathamesh-waingade.jpg
│   ├── harsh-belekar.jpg
│   ├── harsh-vibhute.jpg
│   └── ... (8 total)
│
├── emerging-talent/
│   ├── vinayak-chavan.jpg
│   ├── sarvesh-bedkyale.jpg
│   ├── aditya-mali.jpg
│   └── ... (8 total)
│
└── reserve/
    ├── dhanaraj-patil.jpg
    ├── arav-thagare.jpg
    └── darshit-patni.jpg
```

### Updating Player Images

To change player images:

1. **Edit config.js**
   - Open `config.js` in your text editor
   - Find the `PLAYER_SETS` array
   - Each player has a `photo` property with path: `images/filename.jpg`

2. **Replace Images**
   - Replace image files in the `images/` folder with new photos
   - Keep the same filenames, or update filenames in config.js

3. **Example - Updating a Captain Photo**
   ```javascript
   // In PLAYER_SETS[0] (Captains set)
   {
     id: 101,
     name: 'Virat Kohli',
     category: 'Batsman',
     photo: 'images/virat.jpg'  // Change this path
   }
   ```

4. **Supported Image Formats**
   - JPG / JPEG
   - PNG
   - WebP
   - Any standard web image format

## ⚙️ Auction Rules

### Bidding Rules

Bid increments based on current bid:
- **₹500 - ₹999**: Increment by ₹50
- **₹1000 - ₹2499**: Increment by ₹300
- **₹2500+**: Increment by ₹500

Base price for all players: **₹500**

### Auction Flow

1. **Set 1-6**: Each set represents different player categories
2. **Per Set**: 
   - 8 teams, each selects exactly 1 player
   - Must complete all teams before moving to next set
   - All players in set must be sold (no skipping)
3. **Final Summary**: After all 7 sets, view complete auction results

### State Preservation

- Team selections are saved in real-time
- Bid history preserved
- Auction progress saved across page navigation
- Restart available to begin fresh auction

## 🏗️ Architecture

### Modular Design

The application follows a clean, modular architecture with separation of concerns:

- **config.js**: Configuration data (teams, players, bidding rules)
- **state-manager.js**: Centralized state management class
- **ui-renderer.js**: All UI rendering logic (decoupled from state)
- **script.js**: Event handlers & orchestration
- **index.html**: Semantic HTML structure
- **styles.css**: Responsive styling

### State Management

`StateManager` class handles:
- Current set & player tracking
- Team selections per set
- Bid tracking
- Sale history
- Completion status
- Statistics calculation

### UI Rendering

`UIRenderer` class provides:
- Page navigation
- Dynamic team grid rendering
- Auction display updates
- Summary rendering
- Team statistics
- Tab switching

### Event Handling

`script.js` coordinates:
- User interactions
- State updates
- UI re-renders
- Navigation flow

## 🎮 How to Use

### Starting an Auction

1. Click "Start Auction" on landing page
2. View all 8 teams on Teams Overview page
3. Click "Start Auction" to begin Set 1 (Captains)

### Auction Process

For each player:

1. **Select Team**: Choose which team is bidding
2. **Increase Bid** (optional): Click to increment bid
3. **Mark as Sold**: When bidding complete, click to record sale
4. **Next Player**: Automatically moves to next player
5. **Repeat**: Until all teams have selected for current set

### Viewing Summary

- Click "Summary" button during auction to see current status
- View team selections, sold prices, and statistics
- Switch between sets using tabs
- Return to auction to continue

### Final Summary

After all 7 sets complete:
- View complete roster for each team
- See all players acquired
- View total spending per team
- Calculate average prices
- Option to restart for new auction

## 🔧 Customization

### Adding New Teams

Edit `config.js`:
```javascript
const TEAMS = [
  'Kings XI Punjab',
  'Mumbai Indians',
  // ... add more teams (need exactly 8)
];
```

### Modifying Bidding Rules

Edit `config.js`:
```javascript
const BIDDING_RULES = {
  BASE_PRICE: 500,
  INCREMENT_RULES: [
    { max: 1000, increment: 50 },
    { max: 2500, increment: 300 },
    { max: Infinity, increment: 500 }
  ]
};
```

### Adding More Players

Edit player lists in `PLAYER_SETS` in `config.js`:
```javascript
{
  id: 109,
  name: 'New Player',
  category: 'Batsman',
  photo: 'images/new-player.jpg'
}
```

## 📱 Responsive Behavior

- **Desktop** (>1024px): Full two-column layout
- **Tablet** (768px-1024px): Adjusted grid columns
- **Mobile** (<768px): Single column, optimized touch targets

## 🐛 Troubleshooting

### Images not showing

1. Verify `images/` folder exists in project root
2. Check file paths in config.js match actual files
3. Ensure image files are in correct format (JPG, PNG, etc.)
4. Check browser console for errors (F12 → Console)

### Auction data lost

- State is preserved in browser memory during session
- Reloading page will reset auction
- Use "Restart Auction" button instead

### Team already selected error

- Each team can only select ONE player per set
- Move to next set after all teams complete current set

## 💡 Tips & Best Practices

1. **Organize Images**: Keep all player photos in consistent format/size
2. **Consistent Naming**: Use clear, consistent image filenames
3. **Backup**: Keep backup of original data before making changes
4. **Testing**: Test auction flow before using with live data
5. **Mobile**: Test on mobile devices before presenting
6. **Printing**: CSS can be enhanced for print-friendly summary

## 📝 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Modern mobile browsers

*Note: Requires JavaScript enabled*

## 📄 License

This project is provided as-is for auction management purposes.

## 🤝 Support

For issues or questions:
1. Check ARCHITECTURE.md for technical details
2. Review code comments in .js files
3. Check browser console for error messages

---

**Happy Auctioning! 🏆**

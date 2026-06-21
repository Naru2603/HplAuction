# HPL Auction System - Setup Guide

## ✅ Complete Setup Instructions

This guide walks you through setting up and configuring the HPL Auction System for your tournament.

---

## Phase 1: Initial Setup (2 minutes)

### Step 1: Project Structure
Ensure your project folder (`HplAuction - Old/`) contains:

```
HplAuction - Old/
├── index.html
├── script.js
├── state-manager.js
├── ui-renderer.js
├── config.js
├── styles.css
├── README.md
├── ARCHITECTURE.md
└── SETUP_GUIDE.md (this file)
```

**Status**: ✅ Already in place

### Step 2: Create Images Folder

1. In your project root (`HplAuction - Old/`), create a new folder called **`images`**
   - Right-click → New Folder
   - Name: `images`

2. This folder will contain all player photographs

**Status**: Ready for images

---

## Phase 2: Configure Teams & Players (10 minutes)

### Step 3: Update Teams List

1. Open `config.js` in your text editor
2. Find the `TEAMS` array (around line 10)
3. Currently contains 8 teams (as required):
   ```javascript
   const TEAMS = [
     'Kings XI Punjab',
     'Mumbai Indians',
     'Royal Challengers',
     'Kolkata Knight Riders',
     'Delhi Capitals',
     'Rajasthan Royals',
     'Chennai Super Kings',
     'Sunrisers Hyderabad'
   ];
   ```

4. **Customize teams**:
   - Keep exactly 8 teams
   - Replace team names as needed
   - Save file

**Example**:
```javascript
const TEAMS = [
  'Your Team 1',
  'Your Team 2',
  'Your Team 3',
  'Your Team 4',
  'Your Team 5',
  'Your Team 6',
  'Your Team 7',
  'Your Team 8'
];
```

### Step 4: Update Player Sets

1. In `config.js`, find `PLAYER_SETS` (around line 18)
2. Six player sets are defined:
   - **Set 1**: Captains
   - **Set 2**: Premium All-Rounders
   - **Set 3**: Middle Order
   - **Set 4**: Fast Bowlers
   - **Set 5**: Spin Bowlers
   - **Set 6**: Emerging Talent

3. **For each set, update players**:
   ```javascript
   {
     id: 101,
     name: 'Player Name',           // Change this
     category: 'Batsman',           // Update if needed
     photo: 'images/filename.jpg'   // Match image file
   }
   ```

4. **Keep structure**:
   - Each set has exactly 8 players
   - Each player has: id, name, category, photo

**Example Update**:
```javascript
// Set 1: Captains
const PLAYER_SETS = [
  {
    id: 1,
    name: 'Captains',
    description: 'Select team captains - One per team',
    players: [
      { id: 101, name: 'Virat Kohli', category: 'Batsman', photo: 'images/virat.jpg' },
      { id: 102, name: 'Rohit Sharma', category: 'Batsman', photo: 'images/rohit.jpg' },
      // ... more players
    ]
  },
  // ... more sets
];
```

---

## Phase 3: Image Setup (15 minutes)

### Step 5: Prepare Player Photos

You need **51 images total** (6 sets × 8 players + 1 set × 3 players):

1. **Gather Photos**
   - Collect player images (JPG, PNG, or WebP format)
   - Minimum recommended size: 300×300 pixels
   - Recommended size: 400×400 pixels to 600×600 pixels

2. **Organize by Set**
   - Set 1 (Captains): 8 photos
   - Set 2 (All-Rounders): 8 photos
   - Set 3 (Middle Order): 8 photos
   - Set 4 (Fast Bowlers): 8 photos
   - Set 5 (Spin Bowlers): 8 photos
   - Set 6 (Emerging Talent): 8 photos
   - Set 7 (Reserve Players): 3 photos

3. **Naming Convention** (suggested)
   ```
   Set 1 (Captains):
   narendra-korade.jpg, soham-jagtap.jpg, sayaji-gaikwad.jpg, ...
   
   Set 2 (All-Rounders):
   omkar-sangle.jpg, moin-chaus.jpg, kuldeep-patil.jpg, ...
   
   Set 3 (Middle Order):
   sagar-bichkar.jpg, avinash-korade.jpg, suraj-kenwade.jpg, ...
   
   Set 4 (Fast Bowlers):
   pranav-sangle.jpg, om-chavan.jpg, rajat-ballole.jpg, ...
   
   Set 5 (Spin Bowlers):
   prathamesh-waingade.jpg, harsh-belekar.jpg, harsh-vibhute.jpg, ...
   
   Set 6 (Emerging Talent):
   vinayak-chavan.jpg, sarvesh-bedkyale.jpg, aditya-mali.jpg, ...
   
   Set 7 (Reserve Players):
   dhanaraj-patil.jpg, arav-thagare.jpg, darshit-patni.jpg
   ```

### Step 6: Place Images in Folder

1. Open the `images/` folder you created
2. Create subfolders: `captains/`, `all-rounders/`, `middle-order/`, `fast-bowlers/`, `spin-bowlers/`, `emerging-talent/`, `reserve/`
3. Paste player photos into their respective folders
4. **Files should be named exactly as referenced in `config.js`**

**Verify**:
- ✅ Folder has 51 image files total
- ✅ Filenames match config.js exactly
- ✅ All images display properly

### Step 7: Test Images

1. Open `index.html` in your browser
2. Start an auction (click "Start Auction")
3. Go to teams page (click "Start Auction" again)
4. Start bidding (click "Start Auction" once more)
5. **Verify**: Player photo displays correctly
6. **If not**: Check console (F12 → Console tab) for errors

**Common Issues**:
- File not found: Check spelling in config.js
- Image path: Use `images/folder/filename.jpg` format
- Relative paths: Images folder must be in project root

---

## Phase 4: Bidding Rules Configuration (5 minutes)

### Step 8: Customize Bidding Rules (Optional)

In `config.js`, find `BIDDING_RULES` (around line 73):

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

**Current Rules**:
- Start: ₹500
- ₹500-₹999: +₹50 per bid
- ₹1000-₹2499: +₹300 per bid
- ₹2500+: +₹500 per bid

**To Customize**:
1. Change `BASE_PRICE` for different starting price
2. Modify `INCREMENT_RULES` for different bid steps

**Example (Lower bids)**:
```javascript
const BIDDING_RULES = {
  BASE_PRICE: 1000,
  INCREMENT_RULES: [
    { max: 3000, increment: 100 },
    { max: 10000, increment: 500 },
    { max: Infinity, increment: 1000 }
  ]
};
```

---

## Phase 5: Testing (10 minutes)

### Step 9: Run Complete Test

1. **Open Application**
   - Open `index.html` in your browser
   - Should see landing page with "Start Auction" button

2. **Test Landing Page**
   - ✅ Button displays
   - ✅ Hero image loads
   - ✅ Text is readable

3. **Test Teams Page**
   - Click "Start Auction"
   - ✅ See all 8 teams
   - ✅ Each team shows "Players: 0/6"

4. **Test Auction**
   - Click "Start Auction"
   - ✅ Player photo displays
   - ✅ Player name shows correctly
   - ✅ Set info displays (Set 1, Captains)
   - ✅ Progress bar shows 0/8

5. **Test Bidding**
   - Select a team from dropdown
   - Click "Increase Bid"
   - ✅ Bid amount increases
   - ✅ Increment shows correctly

6. **Test Sale Recording**
   - Team selected
   - Click "Mark as Sold"
   - ✅ Moves to next player
   - ✅ Player count updates on Teams page
   - ✅ Progress bar advances

7. **Test Summary**
   - During auction, click "Summary"
   - ✅ See current statistics
   - ✅ Teams & selections visible
   - ✅ Sold players listed

8. **Test Final Summary**
   - Complete all players in Set 1
   - After Set 6 completes
   - ✅ Final summary page appears
   - ✅ All team rosters visible
   - ✅ Spending summary shown

### Step 10: Mobile Testing

1. Open on mobile/tablet device
2. ✅ Layout adapts to screen size
3. ✅ Buttons are touch-friendly
4. ✅ Text is readable
5. ✅ Images load correctly

---

## Phase 6: Pre-Auction Checklist (5 minutes)

### Step 11: Final Verification

Before running live auction, verify:

- [ ] All 48 player images present in `images/` folder
- [ ] All image paths in `config.js` are correct
- [ ] All 8 teams configured correctly
- [ ] Bidding rules match your requirements
- [ ] Complete test auction successful
- [ ] Mobile devices tested
- [ ] No console errors (F12 → Console)
- [ ] All navigation buttons work
- [ ] Summary page displays correctly
- [ ] Restart function works

---

## Common Issues & Solutions

### Issue 1: Images Not Showing

**Symptoms**: Player photos appear as broken images

**Solutions**:
1. Verify `images/` folder exists in project root
2. Check file paths in config.js
3. Ensure filenames have correct extensions (.jpg, .png, etc.)
4. Check spelling (case-sensitive on some systems)

**Example Fix**:
```javascript
// WRONG
photo: 'images/Virat.jpg'  // Capital V

// CORRECT
photo: 'images/virat.jpg'  // Lowercase v (if file is lowercase)
```

### Issue 2: Auction Won't Start

**Symptoms**: Can't progress past teams page

**Solutions**:
1. Open browser console (F12 → Console)
2. Check for JavaScript errors
3. Verify all scripts loaded: config.js, state-manager.js, ui-renderer.js, script.js
4. Check if JavaScript is enabled in browser

### Issue 3: Teams Already Selected Error

**Symptoms**: "Team has already selected a player" appears incorrectly

**Solutions**:
1. Ensure you're completing Sets in order
2. Don't skip players
3. All players in current set must be sold before next set

### Issue 4: Progress Bar Not Updating

**Symptoms**: Progress bar doesn't advance after sales

**Solutions**:
1. Refresh page and try again
2. Check browser console for errors
3. Verify state-manager.js is loaded

### Issue 5: File Paths Not Working on Server

**Symptoms**: Works locally but not on web server

**Solutions**:
1. Use relative paths: `images/filename.jpg` (not absolute)
2. Ensure images folder is uploaded to server
3. Check file permissions on server
4. Verify case sensitivity matches file system

---

## Customization Examples

### Example 1: Different Team Names

```javascript
const TEAMS = [
  'Mumbai Hawks',
  'Delhi Warriors',
  'Chennai Titans',
  'Bangalore Eagles',
  'Kolkata Kings',
  'Hyderabad Strikers',
  'Punjab Phoenix',
  'Rajasthan Rulers'
];
```

### Example 2: Different Player Categories

```javascript
// Change a player category
{ 
  id: 101, 
  name: 'Player Name', 
  category: 'Wicket Keeper',  // Changed from Batsman
  photo: 'images/virat.jpg' 
}
```

### Example 3: Higher Base Price

```javascript
const BIDDING_RULES = {
  BASE_PRICE: 2000,  // Changed from 500
  INCREMENT_RULES: [
    { max: 5000, increment: 200 },
    { max: 15000, increment: 1000 },
    { max: Infinity, increment: 2000 }
  ]
};
```

---

## Performance Tips

1. **Image Optimization**
   - Keep images under 200KB each
   - Use WebP format for smaller file size
   - Minimum 300×300 pixels sufficient

2. **Browser**
   - Use modern browser (Chrome, Firefox, Safari, Edge)
   - Close other tabs to improve performance
   - Clear browser cache if issues

3. **Network**
   - Upload images to server if using online
   - Test on same network as users will use
   - Consider image compression for web

---

## Backup & Recovery

### Creating a Backup

1. Copy entire project folder
2. Rename to `HplAuction - Backup`
3. Store in safe location

### Recovering from Mistakes

1. Close browser without saving
2. Reload page from disk/server
3. Auction state will reset (that's normal)

### Exporting Auction Results

1. After auction completes
2. Click "Summary" to view results
3. Take screenshot for records
4. Manually record in spreadsheet if needed

---

## Support Resources

1. **Technical Questions**
   - See ARCHITECTURE.md for detailed technical info
   - Check README.md for feature descriptions

2. **Customization Help**
   - Review examples above
   - Check config.js comments
   - Modify carefully, test thoroughly

3. **Troubleshooting**
   - Check browser console (F12)
   - Enable JavaScript
   - Try different browser
   - Clear browser cache

---

## Next Steps

1. ✅ Set up images folder
2. ✅ Update teams & players in config.js
3. ✅ Add 48 player photos
4. ✅ Test complete auction flow
5. ✅ Verify on mobile devices
6. ✅ Ready for live auction!

---

## Quick Reference

### File Modification Checklist

| File | What to Change | Frequency |
|------|---|---|
| config.js | Teams, players, bidding rules | Once per tournament |
| images/ | Player photos | Once per tournament |
| HTML/CSS/JS | Code logic | Only if enhancing |

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Open Developer Tools | F12 |
| Go Back | Alt + Left Arrow |
| Refresh | F5 or Ctrl+R |
| Clear Cache | Ctrl+Shift+Delete |

---

**You're all set! Good luck with your auction! 🎉**

For detailed technical info, see [ARCHITECTURE.md](ARCHITECTURE.md)
For feature overview, see [README.md](README.md)

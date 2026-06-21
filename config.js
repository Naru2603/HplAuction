/**
 * HPL Auction System - Configuration File
 * ========================================
 * This file contains all configuration for the auction system:
 * - Teams
 * - Player Sets
 * - Bidding Rules
 * - Image Configuration
 * 
 * To modify images:
 * 1. Add your image files to the /images folder
 * 2. Update the playerSets object with the new image paths
 */

// ========== TEAMS ==========
// Exactly 8 teams based on forts
const TEAMS = [
  'Raigad Warriors',
  'Rajgad Riders',
  'Vijaydurg Titans',
  'Pratapgad Veer',
  'Purandar Strikers',
  'Sinhgad Lions',
  'Rangana Blazers',
  'Shivneri Sunrisers'
];

// ========== TEAMS CONFIG ==========
// Team details including logos and sponsors
// To add team logos: Place image files in /images/teams/ folder
// Update the logo paths below with your image file names
const TEAMS_CONFIG = {
  'Raigad Warriors': {
    logo: 'images/teams/raigad.png',
    sponsor: 'Omkar Sangle',
    color: '#FF6B35'
  },
  'Rajgad Riders': {
    logo: 'images/teams/rajgad.png',
    sponsor: 'Aniket Nikam',
    color: '#004B87'
  },
  'Vijaydurg Titans': {
    logo: 'images/teams/vijaydurg.png',
    sponsor: 'Samadhan Bedage',
    color: '#EC1C24'
  },
  'Pratapgad Veer': {
    logo: 'images/teams/pratapgad.png',
    sponsor: 'Bhausaheb Gaikwad',
    color: '#3A225D'
  },
  'Purandar Strikers': {
    logo: 'images/teams/purandar.png',
    sponsor: 'Avinash Korade',
    color: '#004687'
  },
  'Sinhgad Lions': {
    logo: 'images/teams/sinhgad.png',
    sponsor: 'Mahesh Bedkyale',
    color: '#E95299'
  },
  'Rangana Blazers': {
    logo: 'images/teams/rangana.png',
    sponsor: 'Rahul Belekar',
    color: '#FFDB58'
  },
  'Shivneri Sunrisers': {
    logo: 'images/teams/shivneri.png',
    sponsor: 'Sagar Bichkar',
    color: '#FF7A00'
  }
};

// ========== TEAM BUDGET ==========
const TEAM_BUDGET = 12500; // Maximum budget per team in Rs

// ========== SPONSOR BUDGET ==========
const SPONSOR_BUDGET = 12500; // Maximum budget for sponsors in Rs

// ========== BIDDING RULES ==========
const BIDDING_RULES = {
  BASE_PRICE: 500,
  MAX_PRICE: 12500,
  INCREMENT_RULES: [
    { max: 1000, increment: 50 },
    { max: 2500, increment: 300 },
    { max: 5000, increment: 500 },
    { max: 12500, increment: 500 }
  ],
  // Special rules for Captains (Set 1)
  CAPTAIN_RULES: {
    BASE_PRICE: 2500,
    MIN_PRICE: 2500,
    MAX_PRICE: 5000,
    INCREMENT_RULES: [
      { max: 4000, increment: 300 },
      { max: 5000, increment: 500 }
    ]
  }
};

// ========== PLAYER SETS ==========
// 7 sets total: 1 Captain + 6 Other Categories
const PLAYER_SETS = [
  {
    id: 1,
    name: 'Captains',
    description: 'Select team captains - One per team',
    players: [
      { id: 101, name: 'Narendra Korade', category: 'Captain', photo: 'images/captains/narendra-korade.jpg' },
      { id: 102, name: 'Amit Rajmane', category: 'Captain', photo: 'images/captains/amit-rajmane.jpg' },
      { id: 103, name: 'Sayaji Gaikwad', category: 'Captain', photo: 'images/captains/sayaji-gaikwad.jpg' },
      { id: 104, name: 'Sunil Tashildar', category: 'Captain', photo: 'images/captains/sunil-tashildar.jpg' },
      { id: 105, name: 'Omkar Patil', category: 'Captain', photo: 'images/captains/omkar-patil.jpg' },
      { id: 106, name: 'Pratap Nikam', category: 'Captain', photo: 'images/captains/pratap-nikam.jpg' },
      { id: 107, name: 'Indrajeet Kagawade', category: 'Captain', photo: 'images/captains/indrajeet-kagawade.jpg' },
      { id: 108, name: 'Mahaveer Bhande', category: 'Captain', photo: 'images/captains/mahaveer-bhande.jpg' }
    ]
  },
  {
    id: 2,
    name: 'All-Rounders',
    description: 'Batting & Bowling All-Rounders',
    players: [
      { id: 201, name: 'Omkar Sangle', category: 'All-Rounder', photo: 'images/all-rounders/omkar-sangle.jpg' },
      { id: 202, name: 'Moin Chaus', category: 'All-Rounder', photo: 'images/all-rounders/moin-chaus.jpg' },
      { id: 203, name: 'Kuldeep Patil', category: 'All-Rounder', photo: 'images/all-rounders/kuldeep-patil.jpg' },
      { id: 204, name: 'Sachin Tashildar', category: 'All-Rounder', photo: 'images/all-rounders/sachin-tashildar.jpg' },
      { id: 205, name: 'Harsh Nikam', category: 'All-Rounder', photo: 'images/all-rounders/harsh-nikam.jpg' },
      { id: 206, name: 'Aditya Belekar', category: 'All-Rounder', photo: 'images/all-rounders/aditya-belekar.jpg' },
      { id: 207, name: 'Soham Jagtap', category: 'All-Rounder', photo: 'images/all-rounders/soham-jagtap.jpg' },
      { id: 208, name: 'Rohit Jadhav', category: 'All-Rounder', photo: 'images/all-rounders/rohit-jadhav.jpg' }
    ]
  },
  {
    id: 3,
    name: 'Middle Order',
    description: 'Reliable middle order batsmen',
    players: [
      { id: 301, name: 'Sagar Bichkar', category: 'Batsman', photo: 'images/middle-order/sagar-bichkar.jpg' },
      { id: 302, name: 'Avinash Korade', category: 'Batsman', photo: 'images/middle-order/avinash-korade.jpg' },
      { id: 303, name: 'Suraj Kenwade', category: 'Batsman', photo: 'images/middle-order/suraj-kenwade.jpg' },
      { id: 304, name: 'Sunny More', category: 'Batsman', photo: 'images/middle-order/sunny-more.jpg' },
      { id: 305, name: 'Shree Nikam', category: 'Batsman', photo: 'images/middle-order/shree-nikam.jpg' },
      { id: 306, name: 'Aniket Patil', category: 'Batsman', photo: 'images/middle-order/aniket-patil.jpg' },
      { id: 307, name: 'Aniket Ugale', category: 'Batsman', photo: 'images/middle-order/aniket-ugale.jpg' },
      { id: 308, name: 'Sangram Kagawade', category: 'Batsman', photo: 'images/middle-order/sangram-kagawade.jpg' }
    ]
  },
  {
    id: 4,
    name: 'Fast Bowlers',
    description: 'Strike bowling force',
    players: [
      { id: 401, name: 'Pranav Sangle', category: 'Bowler', photo: 'images/fast-bowlers/pranav-sangle.jpg' },
      { id: 402, name: 'Om Chavan', category: 'Bowler', photo: 'images/fast-bowlers/om-chavan.jpg' },
      { id: 403, name: 'Rajat Ballole', category: 'Bowler', photo: 'images/fast-bowlers/rajat-ballole.jpg' },
      { id: 404, name: 'Sahil Ghudubhai', category: 'Bowler', photo: 'images/fast-bowlers/sahil-ghudubhai.jpg' },
      { id: 405, name: 'Swapnil Patil', category: 'Bowler', photo: 'images/fast-bowlers/swapnil-patil.jpg' },
      { id: 406, name: 'Tejas Belekar', category: 'Bowler', photo: 'images/fast-bowlers/tejas-belekar.jpg' },
      { id: 407, name: 'Karan Patil', category: 'Bowler', photo: 'images/fast-bowlers/karan-patil.jpg' },
      { id: 408, name: 'Sarthak Ainapure', category: 'Bowler', photo: 'images/fast-bowlers/sarthak-ainapure.jpg' }
    ]
  },
  {
    id: 5,
    name: 'Spin Bowlers',
    description: 'Exceptional spin bowling',
    players: [
      { id: 501, name: 'Prathamesh Waingade', category: 'Bowler', photo: 'images/spin-bowlers/prathamesh-waingade.jpg' },
      { id: 502, name: 'Harsh Belekar', category: 'Bowler', photo: 'images/spin-bowlers/harsh-belekar.jpg' },
      { id: 503, name: 'Harsh Vibhute', category: 'Bowler', photo: 'images/spin-bowlers/harsh-vibhute.jpg' },
      { id: 504, name: 'Rahul Belekar', category: 'Bowler', photo: 'images/spin-bowlers/rahul-belekar.jpg' },
      { id: 505, name: 'Satwashil More', category: 'Bowler', photo: 'images/spin-bowlers/satwashil-more.jpg' },
      { id: 506, name: 'Harish Chavan', category: 'Bowler', photo: 'images/spin-bowlers/harish-chavan.jpg' },
      { id: 507, name: 'Sushil Shiralkar', category: 'Bowler', photo: 'images/spin-bowlers/sushil-shiralkar.jpg' },
      { id: 508, name: 'Dhanyakumar Patil', category: 'Bowler', photo: 'images/spin-bowlers/dhanyakumar-patil.jpg' }
    ]
  },
  {
    id: 6,
    name: 'Emerging Talent',
    description: 'Young and promising players',
    players: [
      { id: 601, name: 'Vinayak Chavan', category: 'Batsman', photo: 'images/emerging-talent/vinayak-chavan.jpg' },
      { id: 602, name: 'Sarvesh Bedkyale', category: 'Batsman', photo: 'images/emerging-talent/sarvesh-bedkyale.jpg' },
      { id: 603, name: 'Aditya Mali', category: 'Batsman', photo: 'images/emerging-talent/aditya-mali.jpg' },
      { id: 604, name: 'Harsh Bedkyale', category: 'Batsman', photo: 'images/emerging-talent/harsh-bedkyale.jpg' },
      { id: 605, name: 'Shreyash Bedkyale', category: 'Batsman', photo: 'images/emerging-talent/shreyash-bedkyale.jpg' },
      { id: 606, name: 'Siddarth Mali', category: 'Batsman', photo: 'images/emerging-talent/siddarth-mali.jpg' },
      { id: 607, name: 'Ranveer More', category: 'Batsman', photo: 'images/emerging-talent/ranveer-more.jpg' },
      { id: 608, name: 'Raj Patil', category: 'Batsman', photo: 'images/emerging-talent/raj-patil.jpg' }
    ]
  },
  {
    id: 7,
    name: 'Reserve Players',
    description: 'Standby and reserve players',
    players: [
      { id: 701, name: 'Vedant Mangure', category: 'Player', photo: 'images/reserve/vedant-mangure.jpg' },
      { id: 702, name: 'Parth Nirmale', category: 'Player', photo: 'images/reserve/parth-nirmale.jpg' },
      { id: 703, name: 'Dhanaraj Patil', category: 'Player', photo: 'images/reserve/dhanaraj-patil.jpg' },
      { id: 704, name: 'Swastik Nikam', category: 'Player', photo: 'images/reserve/swastik-nikam.jpg' },
      { id: 705, name: 'Arav Thagare', category: 'Player', photo: 'images/reserve/arav-thagare.jpg' },
      { id: 706, name: 'Darshit Patni', category: 'Player', photo: 'images/reserve/darshit-patni.jpg' },
      { id: 707, name: 'Avishkar Bedkyale', category: 'Player', photo: 'images/reserve/avishkar-bedkyale.jpg' },
      { id: 708, name: 'Varad Patil', category: 'Player', photo: 'images/reserve/varad-patil.jpg' }
    ]
  }
];

/**
 * Get bid increment based on current bid amount and set type
 * @param {number} currentBid - The current bid amount
 * @param {number} setIndex - The current set index (0-6), optional
 * @returns {number} - The increment to add
 */
function getBidIncrement(currentBid, setIndex = -1) {
  // Check if this is a captain (set 1, index 0)
  if (setIndex === 0) {
    const captainRules = BIDDING_RULES.CAPTAIN_RULES.INCREMENT_RULES;
    for (const rule of captainRules) {
      if (currentBid < rule.max) {
        return rule.increment;
      }
    }
    return captainRules[captainRules.length - 1].increment;
  }
  
  // Normal rules for other players
  for (const rule of BIDDING_RULES.INCREMENT_RULES) {
    if (currentBid < rule.max) {
      return rule.increment;
    }
  }
  return BIDDING_RULES.INCREMENT_RULES[BIDDING_RULES.INCREMENT_RULES.length - 1].increment;
}

/**
 * Get next bid amount based on current bid
 * @param {number} currentBid - The current bid amount
 * @param {number} setIndex - The current set index (0-6), optional
 * @returns {number} - The next bid amount
 */
function getNextBidAmount(currentBid, setIndex = -1) {
  return currentBid + getBidIncrement(currentBid, setIndex);
}

// Export for use in other files (Node.js style, ignored by browser)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TEAMS,
    PLAYER_SETS,
    BIDDING_RULES,
    TEAM_BUDGET,
    SPONSOR_BUDGET,
    getBidIncrement,
    getNextBidAmount
  };
}

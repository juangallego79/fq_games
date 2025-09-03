// Game data
const instruments = [
  'Beaker', 'Test Tube', 'Bunsen Burner', 'Pipette',
  'Microscope', 'Petri Dish', 'Graduated Cylinder',
  'Thermometer', 'Scalpel', 'Tongs',
  'Funnel', 'Dropper', 'Spatula', 'Stirring Rod',
  'Safety Goggles', 'Gloves', 'Lab Coat', 'Balance',
  'Reagent Bottle', 'Centrifuge'
];

const totalPairs = 10;

// State
let selectedCards = [];
let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timerInterval = null;
let started = false;
let lockBoard = false;

// Utilities
function shuffleAndPairInstruments() {
  const paired = [];
  for (let i = 0; i < totalPairs; i++) paired.push(instruments[i], instruments[i]);
  return paired.sort(() => Math.random() - 0.5);
}

function formatTime(s) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, '0')}`;
}

function updateHUD() {
  const movesEl = document.getElementById('moves');
  const matchesEl = document.getElementById('matches');
  const timerEl = document.getElementById('timer');
  if (movesEl) movesEl.textContent = moves;
  if (matchesEl) matchesEl.textContent = `${matchedPairs}`;
  if (timerEl) timerEl.textContent = formatTime(seconds);
}

function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    seconds += 1;
    updateHUD();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = null;
}

function resetTimer() {
  stopTimer();
  seconds = 0;
}

// DOM builders
function createCard(label, index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('data-instrument', label);
  card.setAttribute('data-index', index);

  const inner = document.createElement('div');
  inner.className = 'card-inner';

  const front = document.createElement('div');
  front.className = 'card-face card-front';
  front.textContent = '🔬';

  const back = document.createElement('div');
  back.className = 'card-face card-back';
  back.textContent = label;

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener('click', () => handleCardClick(card));
  return card;
}

// Game logic
function initGame() {
  const gameBoard = document.getElementById('game-board');
  if (!gameBoard) return;
  gameBoard.innerHTML = '';

  // reset state
  selectedCards = [];
  matchedPairs = 0;
  moves = 0;
  started = false;
  lockBoard = false;
  resetTimer();
  updateHUD();

  const shuffled = shuffleAndPairInstruments();
  shuffled.forEach((instrument, index) => {
    const card = createCard(instrument, index);
    gameBoard.appendChild(card);
  });
}

function handleCardClick(card) {
  if (lockBoard) return;
  if (card.classList.contains('matched') || card.classList.contains('revealed')) return;

  if (!started) { started = true; startTimer(); }

  card.classList.add('revealed');
  selectedCards.push(card);

  if (selectedCards.length === 2) {
    moves += 1;
    updateHUD();
    lockBoard = true;
    setTimeout(checkForMatch, 350);
  }
}

function checkForMatch() {
  const [a, b] = selectedCards;
  if (!a || !b) { lockBoard = false; return; }
  const match = a.getAttribute('data-instrument') === b.getAttribute('data-instrument');

  if (match) {
    a.classList.add('matched');
    b.classList.add('matched');
    matchedPairs += 1;
    updateHUD();
    if (matchedPairs === totalPairs) {
      stopTimer();
      setTimeout(() => {
        alert(`Congratulations! You found all pairs in ${moves} moves and ${formatTime(seconds)}.`);
      }, 300);
    }
  } else {
    a.classList.remove('revealed');
    b.classList.remove('revealed');
  }

  selectedCards = [];
  lockBoard = false;
}

// Start
document.addEventListener('DOMContentLoaded', () => {
  initGame();
  const restartBtn = document.getElementById('restart-button');
  if (restartBtn) restartBtn.addEventListener('click', initGame);
});

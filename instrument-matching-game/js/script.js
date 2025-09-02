// Initialize game variables
const instruments = [
    'Beaker', 'Test Tube', 'Bunsen Burner', 'Pipette', 
    'Microscope', 'Petri Dish', 'Graduated Cylinder', 
    'Thermometer', 'Scalpel', 'Tongs', 
    'Funnel', 'Dropper', 'Spatula', 'Stirring Rod', 
    'Safety Goggles', 'Gloves', 'Lab Coat', 'Balance', 
    'Reagent Bottle', 'Centrifuge'
];

let selectedSquares = [];
let matchedPairs = 0;
const totalPairs = 10;

// Shuffle instruments and create pairs
function shuffleAndPairInstruments() {
    const pairedInstruments = [];
    for (let i = 0; i < totalPairs; i++) {
        const instrument = instruments[i];
        pairedInstruments.push(instrument, instrument);
    }
    return pairedInstruments.sort(() => Math.random() - 0.5);
}

// Initialize the game
function initGame() {
    const gameBoard = document.getElementById('game-board');
    const shuffledInstruments = shuffleAndPairInstruments();
    
    shuffledInstruments.forEach((instrument, index) => {
        const square = document.createElement('div');
        square.classList.add('square');
        square.setAttribute('data-instrument', instrument);
        square.setAttribute('data-index', index);
        square.addEventListener('click', handleSquareClick);
        gameBoard.appendChild(square);
    });
}

// Handle square click
function handleSquareClick(event) {
    const square = event.target;
    if (selectedSquares.length < 2 && !square.classList.contains('matched')) {
        square.classList.add('revealed');
        square.textContent = square.getAttribute('data-instrument');
        selectedSquares.push(square);
        
        if (selectedSquares.length === 2) {
            setTimeout(checkForMatch, 1000);
        }
    }
}

// Check for a match
function checkForMatch() {
    const [firstSquare, secondSquare] = selectedSquares;
    if (firstSquare.getAttribute('data-instrument') === secondSquare.getAttribute('data-instrument')) {
        firstSquare.classList.add('matched');
        secondSquare.classList.add('matched');
        matchedPairs++;
        if (matchedPairs === totalPairs) {
            alert('Congratulations! You found all pairs!');
        }
    } else {
        firstSquare.classList.remove('revealed');
        secondSquare.classList.remove('revealed');
        firstSquare.textContent = '';
        secondSquare.textContent = '';
    }
    selectedSquares = [];
}

// Start the game
document.addEventListener('DOMContentLoaded', initGame);
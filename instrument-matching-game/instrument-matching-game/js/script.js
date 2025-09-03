document.addEventListener('DOMContentLoaded', () => {
    const startScreen = document.getElementById('start-screen');
    const gameScreen = document.getElementById('game-screen');
    const onePlayerBtn = document.getElementById('one-player-btn');
    const twoPlayerBtn = document.getElementById('two-player-btn');
    const changeModeBtn = document.getElementById('change-mode-btn');
    const gameBoard = document.getElementById('game-board');
    const scoreboard = document.getElementById('scoreboard');
    const restartBtn = document.getElementById('restart-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resumeBtn = document.getElementById('resume-btn');
    const pauseOverlay = document.getElementById('pause-overlay');
    const winScreen = document.getElementById('win-screen');
    const winMessage = document.getElementById('win-message');
    const winStats = document.getElementById('win-stats');
    const playAgainBtn = document.getElementById('play-again-btn');

    let gameMode = 1; // 1 for one player, 2 for two players
    let currentPlayer = 1;
    let player1Score = 0;
    let player2Score = 0;
    let timer;
    let time = 0;
    let attempts = 0;
    let matchedPairs = 0;
    let totalPairs = 10;
    let flippedCards = [];
    let lockBoard = false;
    let isPaused = false;

    const instruments = [
        { name: 'Microscopio', id: 'microscope', description: 'Amplía objetos pequeños.' },
        { name: 'Probeta', id: 'graduated-cylinder', description: 'Mide volúmenes de líquidos.' },
        { name: 'Matraz Erlenmeyer', id: 'erlenmeyer-flask', description: 'Contiene y mezcla químicos.' },
        { name: 'Tubo de ensayo', id: 'test-tube', description: 'Contiene pequeñas muestras.' },
        { name: 'Pipeta', id: 'pipette', description: 'Transfiere pequeños volúmenes de líquido.' },
        { name: 'Balanza', id: 'analytical-balance', description: 'Mide la masa con precisión.' },
        { name: 'Mechero Bunsen', id: 'bunsen-burner', description: 'Fuente de calor y llama.' },
        { name: 'Vaso de precipitados', id: 'beaker', description: 'Recipiente para reacciones.' },
        { name: 'Embudo', id: 'funnel', description: 'Transfiere líquidos a recipientes.' },
        { name: 'Termómetro', id: 'thermometer', description: 'Mide la temperatura.' },
    ];

    onePlayerBtn.addEventListener('click', () => {
        gameMode = 1;
        startGame();
    });

    twoPlayerBtn.addEventListener('click', () => {
        gameMode = 2;
        startGame();
    });

    changeModeBtn.addEventListener('click', () => {
        clearInterval(timer);
        gameScreen.classList.remove('active');
        startScreen.classList.add('active');
        winScreen.classList.remove('active');
    });

    restartBtn.addEventListener('click', () => {
        startGame();
    });

    pauseBtn.addEventListener('click', () => {
        if (gameMode === 1 && !isPaused) {
            isPaused = true;
            clearInterval(timer);
            pauseOverlay.classList.add('active');
        }
    });

    resumeBtn.addEventListener('click', () => {
        isPaused = false;
        startTimer();
        pauseOverlay.classList.remove('active');
    });
    
    playAgainBtn.addEventListener('click', () => {
        winScreen.classList.remove('active');
        startGame();
    });

    function startGame() {
        startScreen.classList.remove('active');
        gameScreen.classList.add('active');
        winScreen.classList.remove('active');
        pauseOverlay.classList.remove('active');
        
        resetGame();
        createBoard();
        updateScoreboard();
        if (gameMode === 1) {
            startTimer();
            pauseBtn.style.display = 'inline-block';
        } else {
            pauseBtn.style.display = 'none';
        }
    }

    function resetGame() {
        clearInterval(timer);
        time = 0;
        attempts = 0;
        matchedPairs = 0;
        player1Score = 0;
        player2Score = 0;
        currentPlayer = 1;
        flippedCards = [];
        lockBoard = false;
        isPaused = false;
        gameBoard.innerHTML = '';
    }

    function createBoard() {
        const cards = [];
        instruments.forEach(instrument => {
            cards.push({ type: 'image', content: `img/${instrument.id}.png`, id: instrument.id, description: instrument.description });
            cards.push({ type: 'text', content: instrument.name, id: instrument.id, description: instrument.description });
        });

        shuffle(cards);

        cards.forEach((cardData, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = cardData.id;

            card.innerHTML = `
                <div class="card-face card-front">${index + 1}</div>
                <div class="card-face card-back">
                    ${cardData.type === 'image' ? `<img src="${cardData.content}" alt="${cardData.id}">` : cardData.content}
                </div>
                <div class="tooltip">${cardData.description}</div>
            `;

            card.addEventListener('click', () => flipCard(card));
            gameBoard.appendChild(card);
        });
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function flipCard(card) {
        if (lockBoard || card.classList.contains('flipped') || isPaused) return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            lockBoard = true;
            if (gameMode === 1) attempts++;
            checkForMatch();
            updateScoreboard();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.id === card2.dataset.id;

        if (isMatch) {
            disableCards();
        } else {
            setTimeout(unflipCards, 2500);
        }
    }

    function disableCards() {
        flippedCards.forEach(card => {
            card.removeEventListener('click', () => flipCard(card));
            card.classList.add('matched');
        });
        
        matchedPairs++;
        if (gameMode === 2) {
            if (currentPlayer === 1) player1Score++;
            else player2Score++;
        }

        resetFlippedCards();
        updateScoreboard();

        if (matchedPairs === totalPairs) {
            endGame();
        }
    }

    function unflipCards() {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        if (gameMode === 2) {
            switchPlayer();
        }
        resetFlippedCards();
    }
    
    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateScoreboard();
    }

    function resetFlippedCards() {
        flippedCards = [];
        lockBoard = false;
    }

    function updateScoreboard() {
        let content = '';
        if (gameMode === 1) {
            content = `
                <div>Tiempo: ${formatTime(time)}</div>
                <div>Intentos: ${attempts}</div>
                <div>Parejas: ${matchedPairs} / ${totalPairs}</div>
            `;
        } else {
            content = `
                <div id="player1-score" class="${currentPlayer === 1 ? 'player-turn' : ''}">J1: ${player1Score}</div>
                <div id="player2-score" class="${currentPlayer === 2 ? 'player-turn' : ''}">J2: ${player2Score}</div>
                <div>Restantes: ${totalPairs - matchedPairs}</div>
            `;
        }
        scoreboard.innerHTML = content;
    }

    function startTimer() {
        timer = setInterval(() => {
            time++;
            updateScoreboard();
        }, 1000);
    }

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }

    function endGame() {
        clearInterval(timer);
        winScreen.classList.add('active');
        let stats = '';
        if (gameMode === 1) {
            winMessage.textContent = '¡Has completado el juego!';
            stats = `
                <p>Tu tiempo: ${formatTime(time)}</p>
                <p>Intentos: ${attempts}</p>
            `;
            const bestTime = localStorage.getItem('bestTime');
            if (!bestTime || time < bestTime) {
                localStorage.setItem('bestTime', time);
                stats += '<p>¡Nuevo récord!</p>';
            } else {
                stats += `<p>Mejor tiempo: ${formatTime(bestTime)}</p>`;
            }
        } else {
            if (player1Score > player2Score) {
                winMessage.textContent = '¡Gana el Jugador 1!';
            } else if (player2Score > player1Score) {
                winMessage.textContent = '¡Gana el Jugador 2!';
            } else {
                winMessage.textContent = '¡Es un empate!';
            }
            stats = `
                <p>Jugador 1: ${player1Score} parejas</p>
                <p>Jugador 2: ${player2Score} parejas</p>
            `;
        }
        winStats.innerHTML = stats;
    }
});
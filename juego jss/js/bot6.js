document.addEventListener('DOMContentLoaded', function () {
    // Variables
    var cards = document.querySelectorAll('.card');
    var startButton = document.getElementById('startgame');
    var restartButton = document.querySelector('.restartbutton');
    var player1Score = document.getElementById('score1');
    var player2Score = document.getElementById('score2');
    var winnerMessage = document.getElementById('winner-message');
    var winnerText = document.getElementById('winner-text');
    var timerDisplay = document.getElementById('timer');

    var currentPlayer = 1;
    var isGameActive = false;
    var isClickable = false;
    var player1Points = 0;
    var player2Points = 0;
    var timer;
    var secondsRemaining = 60;

    const flipSound = document.getElementById('flipsound');
    const matchSound = document.getElementById('matchsound');
    const winSound = document.getElementById('winsound');

    // Variable para almacenar las cartas volteadas
    var first = null;
    var second = null;

    function shuffleCards() {
        cards.forEach(function (card) {
            var randomPos = Math.floor(Math.random() * cards.length);
            card.style.order = randomPos;
        });
    }

    function checkWin() {
        var matchedCards = document.querySelectorAll('.card.matched');
    
        // Verifica si el número de cartas coincidentes es igual al total de cartas
        if (matchedCards.length === cards.length) {
            endGame(); // Todas las cartas han sido emparejadas, termina el juego
        }
    }

    function flipCard() {
        if (isGameActive && !this.classList.contains('matched') && !this.classList.contains('flip')) {
            this.classList.add('flip');
            flipSound.play()
            if (!first) {
                first = this;
            } else {
                second = this;
                checkMatch();
            }
        }
    }

    function checkMatch() {
        setTimeout(function () {
            if (first.dataset.id === second.dataset.id) {
                // Match
                first.classList.add('matched');
                second.classList.add('matched');
    
                // Update player scores
                if (currentPlayer === 1) {
                    player1Points++;
                    player1Score.textContent = player1Points;
                } else {
                    player2Points++;
                    player2Score.textContent = player2Points;
                }
    
                // Check for a win
                checkWin();
                matchSound.play()
            } else {
                // No match
                first.classList.remove('flip');
                second.classList.remove('flip');
            }
    
            // Reset first and second cards
            first = null;
            second = null;
    
            // Switch players
            currentPlayer = 3 - currentPlayer; // Switch between 1 and 2
    
            // Check if all cards are matched
            if (document.querySelectorAll('.card:not(.matched)').length === 0) {
                endGame();
            } else {
                // Hacer todas las cartas clickeables después de la comparación
                isClickable = true;
            }
            if (currentPlayer === 1) {
                document.querySelector('.frame169').classList.add('Player1-turn');
                document.querySelector('.frame170').classList.remove('Player2-turn');
            } else {
                document.querySelector('.frame170').classList.add('Player2-turn');
                document.querySelector('.frame169').classList.remove('Player1-turn');
            }
        }, 1000);
    }    

    // Add event listeners to cards
    cards.forEach(function (card) {
        card.addEventListener('click', flipCard);
    });



    // Start button event listener
    startButton.addEventListener('click', startGame);

    // Restart button event listener
    restartButton.addEventListener('click', restartGame);

    function startGame() {
        if (!isGameActive) {
            isGameActive = true;
            isClickable = true;
            currentPlayer = 1;
            secondsRemaining = 30;
            updateTimerDisplay();
            shuffleCards();
            // Start the timer
            timer = setInterval(function () {
                secondsRemaining--;
                updateTimerDisplay();
    
                if (secondsRemaining === 0) {
                    endGame();
                }
            }, 1000);
    
            // Make cards clickable
            cards.forEach(function (card) {
                card.classList.remove('unclickable');
            });
    
            // Highlight Player 1's frame
            document.querySelector('.frame169').classList.add('Player1-turn');
            // Remove highlight from Player 2's frame
            document.querySelector('.frame170').classList.remove('Player2-turn');
        }
    }

    function endGame() {
        isGameActive = false;
        isClickable = false;
        clearInterval(timer);
        winSound.play()

        // Display winner message
        if (player1Points > player2Points) {
            showWinnerMessage('Player 1 wins!');
        } else if (player2Points > player1Points) {
            showWinnerMessage('Player 2 wins!');
        } else {
            showWinnerMessage('It\'s a tie!');
        }

        // Disable clicking on cards
        cards.forEach(function (card) {
            card.classList.add('unclickable');
        });
    }

    function showWinnerMessage(message) {
        winnerText.textContent = message;
        winnerMessage.classList.remove('hidden');
    }

    function restartGame() {
        clearInterval(timer);
        isGameActive = false;
        isClickable = false;
        winnerMessage.classList.add('hidden');

        // Reset scores
        player1Points = 0;
        player2Points = 0;
        player1Score.textContent = '0';
        player2Score.textContent = '0';

        // Reset cards
        cards.forEach(function (card) {
            card.classList.remove('flip', 'matched');
            card.classList.add('unclickable');
        });

        shuffleCards();

        // Make cards clickable
        cards.forEach(function (card) {
            card.classList.remove('unclickable');
        });
    }

    function updateTimerDisplay() {
        timerDisplay.textContent = 'Tiempo: ' + secondsRemaining + ' segundos';
    }
});

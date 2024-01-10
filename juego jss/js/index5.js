const gridContainer = document.querySelector(".grid-container");
let cards = [
  {
    "image": "../assets/1.jpg",
    "name": "1"
  },
  {
    "image": "../assets/2.jpg",
    "name": "2"
  },
  {
    "image": "../assets/3.jpg",
    "name": "3"
  },
  {
    "image": "../assets/4.jpg",
    "name": "4"
  },
  {
    "image": "../assets/5.jpg",
    "name": "5"
  },
  {
    "image": "../assets/6.jpg",
    "name": "6"
  },
  {
    "image": "../assets/7.jpg",
    "name": "7"
  },
  {
    "image": "../assets/8.jpg",
    "name": "8"
  },
  {
    "image": "../assets/9.jpg",
    "name": "9"
  },
  {
    "image": "../assets/1.jpg",
    "name": "1"
  },
  {
    "image": "../assets/2.jpg",
    "name": "2"
  },
  {
    "image": "../assets/3.jpg",
    "name": "3"
  },
  {
    "image": "../assets/4.jpg",
    "name": "4"
  },
  {
    "image": "../assets/5.jpg",
    "name": "5"
  },
  {
    "image": "../assets/6.jpg",
    "name": "6"
  },
  {
    "image": "../assets/7.jpg",
    "name": "7"
  },
  {
    "image": "../assets/8.jpg",
    "name": "8"
  },
  {
    "image": "../assets/9.jpg",
    "name": "9"
  },];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let timer;
let elapsedTime = 0;

document.querySelector(".score").textContent = "Score: 0";


shuffleCards();
generateCards();

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src="${card.image}" alt="${card.name}" />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

let attempts = 0;
const clickSound = new Audio('./sound/click.wav');

function flipCard() {
  if (lockBoard || this.classList.contains("flipped") || elapsedTime === 0) return;

  this.classList.add("flipped");

  clickSound.play(); // Reproducir sonido de clic

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  attempts++;

  lockBoard = true;
  checkForMatch();
}


function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
  score++;
  document.querySelector(".score").textContent = "Score: " + score;

  if (score === cards.length / 2) {
    clearInterval(timer);
    showCongratulationsMessage();

  }

  if (score === cards.length / 2) {
    clearInterval(timer);
    winSound.play(); // Reproducir sonido de victoria
    showCongratulationsMessage();
    saveHighScore(username, score); // Guardar la puntuación al ganar
    displayHighScores(); // Actualizar la lista de puntuaciones
  }
  if (score === cards.length / 2) {
    clearInterval(timer);
    winSound.play(); // Reproducir sonido de victoria
    showCongratulationsMessage();
    saveHighScore(username, score); // Guardar la puntuación al ganar
    displayHighScores(); // Actualizar la lista de puntuaciones
  }
}

function saveHighScore(username, score) {
  // Obtener puntuaciones almacenadas o inicializar si no hay
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  
  // Agregar la nueva puntuación
  highScores.push({ username, score });

  // Ordenar las puntuaciones de mayor a menor
  highScores.sort((a, b) => b.score - a.score);

  // Guardar las puntuaciones en localStorage
  localStorage.setItem("highScores", JSON.stringify(highScores));
}

function displayHighScores() {
  const highScoresList = document.getElementById("highScoresList");
  highScoresList.innerHTML = ""; // Limpiar la lista

  // Obtener las puntuaciones almacenadas
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

  // Mostrar las puntuaciones en la lista
  highScores.forEach((entry, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${entry.username}: ${entry.score}`;
    highScoresList.appendChild(listItem);
  });
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  if (document.querySelectorAll(".flipped").length === cards.length) {
    clearInterval(timer);
    showCongratulationsMessage();
  }
}

function startGame() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = "Score: 0";
  document.getElementById("timer").textContent = "60";
  elapsedTime = 60;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
  gridContainer.innerHTML = "";
  generateCards();
}

function updateTimer() {
  if (elapsedTime > 0) {
    elapsedTime--;
    document.getElementById("timer").textContent = elapsedTime + " seconds";
  } else {
    clearInterval(timer);
    showGameOverMessage();
  }
}
const matchSound = new Audio('./sound/sound.wav');
const winSound = new Audio('./sound/yay.mp3');
const loseSound = new Audio('./sound/perder.mp3');
const clickAudio = new Audio('./sounds/click.wav');

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
  score++;
  document.querySelector(".score").textContent = "Score: " + score;

  matchSound.play(); // Reproducir sonido de coincidencia

  if (score === cards.length / 2) {
    clearInterval(timer);
    winSound.play(); // Reproducir sonido de victoria
    showCongratulationsMessage();
  }
}

function showGameOverMessage() {
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = `<p>Game over! You ran out of time. Try again!</p>`;
  messageContainer.style.display = "block";
  lockBoard = true; // Bloquea el tablero para que no se puedan voltear más cartas.
  
  loseSound.play(); // Reproducir sonido de derrota
}

function showCongratulationsMessage() {
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = `<p>Congratulations! You completed the game in ${60 - elapsedTime} seconds with ${attempts} attempts.</p>`;
  messageContainer.style.display = "block";
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  attempts = 0;
  document.querySelector(".score").textContent = "Score: 0";
  document.getElementById("timer").textContent = "60";
  elapsedTime = 60;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
  gridContainer.innerHTML = "";
  generateCards();
} 

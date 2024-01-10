const gridContainer = document.querySelector(".grid-container");
//Almacena la referencia al contenedor HTML que contiene las cartas del juego.
let cards = [
  { //Un array que contiene objetos representando cartas, 
    //cada uno con una imagen y un nombre.
  "image": "../assets/chili.png",
  "name": "chili"
},
{
  "image": "../assets/grapes.png",
  "name": "grapes"
},
{
  "image": "../assets/lemon.png",
  "name": "lemon"
},
{
  "image": "../assets/orange.png",
  "name": "orange"
},
{
  "image": "../assets/pineapple.png",
  "name": "pineapple"
},
{
  "image": "../assets/strawberry.png",
  "name": "strawberry"
},
{
  "image": "../assets/tomato.png",
  "name": "tomato"
},
{
  "image": "../assets/watermelon.png",
  "name": "watermelon"
},
{
  "image": "../assets/cherries.png",
  "name": "cherries"
},
{
  "image": "../assets/chili.png",
  "name": "chili"
},
{
  "image": "../assets/grapes.png",
  "name": "grapes"
},
{
  "image": "../assets/lemon.png",
  "name": "lemon"
},
{
  "image": "../assets/orange.png",
  "name": "orange"
},
{
  "image": "../assets/pineapple.png",
  "name": "pineapple"
},
{
  "image": "../assets/strawberry.png",
  "name": "strawberry"
},
{
  "image": "../assets/tomato.png",
  "name": "tomato"
},
{
  "image": "../assets/watermelon.png",
  "name": "watermelon"
},
{
  "image": "../assets/cherries.png",
  "name": "cherries"
}];
let firstCard, secondCard;// Almacenan las referencias a las cartas que se están comparando.
let lockBoard = false;//Un indicador para bloquear el tablero durante ciertas operaciones.
let score = 0;//Puntuación del jugador.
let timer;//Un temporizador que cuenta el tiempo de juego.
let elapsedTime = 0;//El tiempo restante de juego.

document.querySelector(".score").textContent = "Score: 0";


shuffleCards();
generateCards();

function shuffleCards() {//Baraja las cartas en el array cards.
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
  //Crea las cartas en el DOM a partir del array cards, asignando eventos de clic
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
  //Voltea una carta cuando se hace clic en ella, realiza acciones 
  //dependiendo de si es la primera o segunda carta volteada.
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
  //Compara las dos cartas volteadas para determinar si coinciden.
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  //Desactiva el evento de clic en las cartas emparejadas, 
  //incrementa la puntuación y muestra un mensaje de felicitaciones 
  //si todas las cartas han sido emparejadas.
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



//Guarda la puntuación del jugador junto con su nombre en el 
//almacenamiento local y actualiza la lista de puntuaciones.
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
  //Muestra la lista de puntuaciones almacenadas en el almacenamiento local.
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
  //Voltea las cartas si no coinciden después de un breve período.
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  //Restablece las variables firstCard, secondCard y lockBoard.
  firstCard = null;
  secondCard = null;
  lockBoard = false;

  if (document.querySelectorAll(".flipped").length === cards.length) {
    clearInterval(timer);
    showCongratulationsMessage();
  }
}

function startGame() {
  //Inicia el juego, reiniciando el tablero, barajando las cartas y configurando el temporizador.
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
  //Actualiza el temporizador, mostrando el tiempo restante.
  //Muestra un mensaje de juego terminado si el tiempo se agota.
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
  //Muestra un mensaje de juego terminado cuando el tiempo se agota.
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = `<p>Game over! You ran out of time. Try again!</p>`;
  messageContainer.style.display = "block";
  lockBoard = true; // Bloquea el tablero para que no se puedan voltear más cartas.
  
  loseSound.play(); // Reproducir sonido de derrota
}

function showCongratulationsMessage() {
  //Muestra un mensaje de felicitaciones cuando todas las cartas han sido emparejadas.
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = `<p>Congratulations! You completed the game in ${60 - elapsedTime} seconds with ${attempts} attempts.</p>`;
  messageContainer.style.display = "block";
}

function restart() {
  //Reinicia el juego, restableciendo el tablero, barajando las cartas
  // y reiniciando la puntuación y el temporizador.
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
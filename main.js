const cards = document.querySelectorAll(".memory-card");
const landing = document.querySelector(".landing-container");
const gameBoard = document.querySelector(".memory-game-container");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");
const endgameBoard = document.querySelector(".endgame-container");

let hasFlippedCard = false;
let firstCard;
let secondCard;
let disabledPairs = 0;
let lockBoard = false;
let attemptsCount = 0;
let attemptsRemaining;


function flipCard(){

  if (lockBoard) {return}; // cuando el valor de esta variable cambie a "true", la función no devuelve nada (se usa para prevenir dar vuelta más de 2 cartas).
  if (this === firstCard) {return}; //previene que se tome como match cuando se hace click 2 veces en la misma carta.

  this.classList.add("flip");

  if(!hasFlippedCard) {
    //declarar que es el primer click del set.
    hasFlippedCard = true;
    firstCard = this; //alberga el valor de la carta clickeada
  } else {
    secondCard = this;

    checkMatch();
  }
}

function checkMatch() {
  //comprobar si coinciden las cartas
  if (firstCard.dataset.image === secondCard.dataset.image) {
    //Match!
    disableCards();  
  } else {
    // Not a Match :(
    unflipCards();      
  }
  attemptsCounter();

  setTimeout(function() {endgame();}, 1000);
  
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  disabledPairs++;
  resetBoard(); 
}

function unflipCards(){
  lockBoard = true; // evitar que se den vuelta más cartas hasta que se acomoden los pares no equivalentes de cartas (vuelvan a girarse las cartas boca abajo)

  setTimeout(function() {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    
    resetBoard();
    }, 1500);
}

function resetBoard() {
  hasFlippedCard = false;
  lockBoard = false;
  firstCard = null;
  secondCard = null;
}

function attemptsCounter() {
  attemptsCount++;
  document.getElementById("attempts").innerHTML = attemptsCount;
  attemptsRemaining--;
  document.getElementById("remaining").innerHTML = attemptsRemaining;
  
  
}

function shuffleCards() {
  
  for (var i = 0; i < cards.length; i++) {
    let randomPosition = Math.floor(Math.random() * 12);
    cards[i].style.order = randomPosition;      
  }
};

function gameOn() {
  
  //Agregar eventListener a todas las cartas
  for (var i = 0; i < cards.length; i++) {
    cards[i].addEventListener("click", flipCard);    
  }
  //Mezclar cartas
  shuffleCards()
  //Acceder a la plataforma de juego principal
  landing.classList.toggle("hide");
  gameBoard.classList.remove("hide");

  //Determinar cantidad de intentos disponibles para ganar el juego
  if (this.dataset.difficulty === "easy") {
    attemptsRemaining = 15;
  } else if (this.dataset.difficulty === "medium"){
    attemptsRemaining = 12;
  } else {
    attemptsRemaining = 9;
  }

  document.getElementById("attempts").innerHTML = attemptsCount;
  document.getElementById("remaining").innerHTML = attemptsRemaining;
}

function endgame() {
  if (attemptsRemaining === 0) {
    gameBoard.classList.toggle("hide");
    endgameBoard.classList.remove("hide");
    document.getElementById("endgameMsg").innerHTML = "PERDISTE";
  } else if (disabledPairs === 6) {
      gameBoard.classList.toggle("hide");
      endgameBoard.classList.remove("hide");
      document.getElementById("endgameMsg").innerHTML = "GANASTE!!";
  }
  return;  
}

function resetCounters() {
  attemptsCount = 0;
  disabledPairs = 0;  
}

function relaunchLanding() {
  landing.classList.remove("hide");
  endgameBoard.classList.toggle("hide");  
}

function reFlipAllCards() {
  let allFlippedCards = document.querySelectorAll(".flip");
  for (var i = 0; i < allFlippedCards.length; i++) {
    allFlippedCards[i].classList.remove("flip");
  }
}

function restartGame() {
  resetBoard();
  resetCounters();
  relaunchLanding();
  reFlipAllCards();  
}


//Hacer que cada botón pueda ejecutar la función inicial del juego:
for (var i = 0; i < difficultyBtns.length; i++) {
  difficultyBtns[i].addEventListener("click", gameOn);
}



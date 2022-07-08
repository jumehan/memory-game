//"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("results");
const controls = document.querySelector(".controls-container")
let cards;
let interval;
let firstCard = false;
let secondCard= false;
var prevHighScore=localStorage.getItem("score");

// 1 second timer
const FOUND_MATCH_WAIT_MSECS = 1000;

//cards array
const items = [
  {name: "confused", image: "confused_kitten.png"},
  {name: "gg", image: "gg_kitten.png"},
  {name: "sad", image: "sad_kitten.png"},
  {name: "shock", image: "shock_kitten.png"},
  {name: "wink", image: "wink_kitten.png"},
  {name: "stare", image: "stare_kitten.png"},
  {name: "boop", image: "boop_kitten.png"},
  {name: "nani", image: "nani_kitten.png"},
  {name: "wow", image: "wow_kitten.png"},
  {name: "cry", image: "cry_kitten.png"},
  {name: "scared", image: "scared_kitten.png"}
];

let seconds = 0, minutes = 0;
let movesCount = 0, winCount = 0;

const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  //add leading zeros prn
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time: </span>${minutesValue}:${secondsValue}`;
};

const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

const generateRandom = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  //size (/2 because pairs)
  size = (size * size) / 2;
  //random obj selection
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  //simple shuffle (Fisher-Yates)
  for (let i = cardValues.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardValues[i], cardValues[j]] = [cardValues[j], cardValues[i]];
  }
  for (let k = 0; k < size * size; k++) {
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[k].name}">
        <div class="card-before">
        <img src="meme_kitten.png" class="flipped"/></div>
        <div class="card-after">
        <img src="${cardValues[k].image}" class="image"/></div>
     </div>
     `;
  }

  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      //If selected card is not matched yet then only run (i.e already matched card when clicked would be ignored)
      if (!card.classList.contains("matched")) {
        //flip the cliked card
        card.classList.add("flipped");
        //!firstCard = first card (= false)
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            //if match
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            //reset firstCard & win +1
            firstCard = false;
            winCount += 1;
            //if wincount = total cards/2, user wins, game ends
            if (winCount == Math.floor(cardValues.length / 2)) {
              var newScore = movesCount.toFixed(0);
              //check for highscore and save to localstorage
              if (prevHighScore && parseFloat(prevHighScore) > newScore){
                  localStorage.setItem('score', newScore);
              }
              result.innerHTML = `
              <h2>YAY YOU WON!</h2>
              <h4>Moves: ${movesCount}</h4>
              <h4>Highscore: ${newScore}</h4>
              `;
              stopGame();
            }
          } else {
            //if no match, flip back
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, FOUND_MATCH_WAIT_MSECS);
          }
        }
      }
    });
  });
};

//game start
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  //hide/show
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  //timer start, increments of 1 second
  interval = setInterval(timeGenerator, 1000);
  //move count start
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

//game stop
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};

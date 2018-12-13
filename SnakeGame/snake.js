const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");

// unit
const box = 32;

// images
const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

const gameoverImg = new Image();
gameoverImg.src = "img/game-over.png";

// audio

const dead = new Audio();
const eat = new Audio();
const up = new Audio();
const left = new Audio();
const right = new Audio();
const down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";


// snake
let snake = [];

snake[0] = {
  x : 9 * box,
  y : 10 * box
};

// food
let food = {
  x : Math.floor(Math.random()*17+1) * box,
  y : Math.floor(Math.random()*15+3) * box
}

// score
let score = 0;

// to control the snake

let d;
document.addEventListener("keydown", direction);

function direction(event){
  if (event.keyCode == 37 && d != "RIGHT"){
    left.play();
    d = "LEFT";
  }else if (event.keyCode == 38 && d != "DOWN"){
    up.play();
    d = "UP";
  }else if (event.keyCode == 39 && d != "LEFT"){
    right.play();
    d = "RIGHT";
  }else if (event.keyCode == 40 && d != "UP"){
    down.play();
    d = "DOWN";
  }
}

// function to check if there is a collision

function collision(head, array){
  for ( let i = 0; i < array.length ; i++){
    if(head.x == array[i].x && head.y == array[i].y){
      return true;
    }
  }
  return false;
}

// function to draw on canvas

function draw() {
  context.drawImage(ground,0,0);

  for ( let i = 0; i < snake.length ; i++){
    context.fillStyle = ( i == 0 ) ? "#458645" : "#72C070";
    context.fillRect(snake[i].x, snake[i].y, box, box);

    context.strokeStyle = "red";
    context.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  context.drawImage(foodImg, food.x, food.y);

  // to get the old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // which direction
  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  // if snake eats food
  if (snakeX == food.x && snakeY == food.y){
    score++;
    eat.play();
    food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
  } else {
    // we remove the tail
    snake.pop();
  }

  // add new head
  let newHead = {
    x : snakeX,
    y : snakeY
  }

  // set game over

  if (snakeX < box || snakeX > 17 * box || snakeY < 3 * box || snakeY > 17 * box || collision(newHead, snake)){
    clearInterval(game);
    dead.play();
    context.drawImage(gameoverImg,4 * box, 7 * box);
  }

  snake.unshift(newHead);

// score styling
  context.fillStyle = "white";
  context.font = "55px Indie Flower";
  context.fillText(score, 2*box, 1.6*box);
}

// to call draw function every 100 ms

let game = setInterval(draw,100);


const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const rows = canvas.height / box;
const cols = canvas.width / box;

let snake = [{ x: 9 * box, y: 10 * box }];
let direction = null;
let food = randomFood();
let score = 0;
let level = 1;
let speed = 150;
let gameInterval;

document.addEventListener("keydown", changeDirection);

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
  const key = event.key.toLowerCase();
  if ((key === "a" || event.keyCode === 65) && direction !== "RIGHT") direction = "LEFT";
  else if ((key === "w" || event.keyCode === 87) && direction !== "DOWN") direction = "UP";
  else if ((key === "d" || event.keyCode === 68) && direction !== "LEFT") direction = "RIGHT";
  else if ((key === "s" || event.keyCode === 83) && direction !== "UP") direction = "DOWN";
}

function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, box, box);
  ctx.strokeStyle = "#111";
  ctx.strokeRect(x, y, box, box);
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * cols) * box,
    y: Math.floor(Math.random() * rows) * box,
  };
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  snake.forEach((segment, index) => {
    drawBox(segment.x, segment.y, index === 0 ? "#0f0" : "#5f5");
  });

  // Draw food
  drawBox(food.x, food.y, "#f00");

  // Move snake
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // Game Over conditions
  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(gameInterval);
    alert("Game Over! Your Score: " + score);
    return;
  }

  // Eating food
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    food = randomFood();

    if (score % 50 === 0) {
      level++;
      speed -= 10;
      clearInterval(gameInterval);
      gameInterval = setInterval(drawGame, speed);
      document.getElementById("level").textContent = level;
    }
  } else {
    snake.pop();
  }

  snake.unshift(head);

  // Update Score
  document.getElementById("score").textContent = score;
}

function collision(head, snake) {
  return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function restartGame() {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;
  food = randomFood();
  score = 0;
  level = 1;
  speed = 150;
  document.getElementById("score").textContent = score;
  document.getElementById("level").textContent = level;
  clearInterval(gameInterval);
  gameInterval = setInterval(drawGame, speed);
}

// Start the game loop
gameInterval = setInterval(drawGame, speed);

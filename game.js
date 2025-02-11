let canvas = document.getElementById('gameCanvas');
let ctx = canvas.getContext('2d');
let basket, fruits = [], bombs = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameInterval, fruitInterval, bombInterval;
let gameSpeed = 2;
let gameOver = false;
let level = 1;

document.getElementById('highScore').innerText = highScore;

function startGame(difficulty) {
  document.getElementById('startMenu').style.display = 'none';
  canvas.style.display = 'block';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  score = 0;
  level = 1;
  gameOver = false;

  // Adjust difficulty
  if (difficulty === 'easy') gameSpeed = 2;
  if (difficulty === 'medium') gameSpeed = 3;
  if (difficulty === 'hard') gameSpeed = 4;

  basket = { x: canvas.width / 2 - 50, y: canvas.height - 100, width: 100, height: 50 };
  
  gameLoop();
  startFruitAndBombs();
}

function gameLoop() {
  if (gameOver) return endGame();

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBasket();
  drawFruitsAndBombs();
  checkCollisions();
  levelUp();

  score++;

  requestAnimationFrame(gameLoop);
}

function startFruitAndBombs() {
  fruitInterval = setInterval(() => {
    if (gameOver) clearInterval(fruitInterval);
    spawnFruit();
  }, 1000 / gameSpeed);

  bombInterval = setInterval(() => {
    if (gameOver) clearInterval(bombInterval);
    spawnBomb();
  }, 2000 / gameSpeed);
}

function spawnFruit() {
  let x = Math.random() * (canvas.width - 50);
  let speed = gameSpeed + Math.random();
  fruits.push({ x: x, y: 0, speed: speed });
}

function spawnBomb() {
  let x = Math.random() * (canvas.width - 50);
  let speed = gameSpeed + Math.random();
  bombs.push({ x: x, y: 0, speed: speed });
}

function drawBasket() {
  ctx.fillStyle = 'brown'; // Basket color
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawFruitsAndBombs() {
  fruits.forEach((fruit, index) => {
    ctx.fillStyle = 'green'; // Fruit color
    ctx.beginPath();
    ctx.arc(fruit.x, fruit.y, 20, 0, Math.PI * 2);
    ctx.fill();
    fruit.y += fruit.speed;

    if (fruit.y > canvas.height) fruits.splice(index, 1);
  });

  bombs.forEach((bomb, index) => {
    ctx.fillStyle = 'red'; // Bomb color
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, 20, 0, Math.PI * 2);
    ctx.fill();
    bomb.y += bomb.speed;

    if (bomb.y > canvas.height) bombs.splice(index, 1);
  });
}

function checkCollisions() {
  fruits.forEach((fruit, index) => {
    if (fruit.y + 20 > basket.y && fruit.x > basket.x && fruit.x < basket.x + basket.width) {
      fruits.splice(index, 1);
      score += 10;
    }
  });

  bombs.forEach((bomb, index) => {
    if (bomb.y + 20 > basket.y && bomb.x > basket.x && bomb.x < basket.x + basket.width) {
      bombs.splice(index, 1);
      gameOver = true;
    }
  });

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore);
  }
}

function levelUp() {
  if (score % 100 === 0 && score > 0) {
    level++;
    gameSpeed += 0.5;
  }
}

function endGame() {
  clearInterval(fruitInterval);
  clearInterval(bombInterval);
  alert('Game Over! Your score: ' + score);
  document.getElementById('highScore').innerText = highScore;
  document.getElementById('startMenu').style.display = 'block';
  canvas.style.display = 'none';
}

window.addEventListener('mousemove', (e) => {
  if (gameOver) return;
  basket.x = e.clientX - basket.width / 2;
});

window.addEventListener('touchmove', (e) => {
  if (gameOver) return;
  basket.x = e.touches[0].clientX - basket.width / 2;
});

startGame('easy');

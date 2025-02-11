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

  // Adjust difficulty (slow increase)
  if (difficulty === 'easy') gameSpeed = 1.5;
  if (difficulty === 'medium') gameSpeed = 2;
  if (difficulty === 'hard') gameSpeed = 2.5;

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
  }, 2000 / gameSpeed); // Adjust spawn frequency

  bombInterval = setInterval(() => {
    if (gameOver) clearInterval(bombInterval);
    spawnBomb();
  }, 3000 / gameSpeed); // Adjust bomb spawn frequency
}

function spawnFruit() {
  let side = Math.random() < 0.5 ? 'left' : 'right';
  let startX = side === 'left' ? 0 : canvas.width;
  let startY = canvas.height;

  let curveHeight = 300; // Height of the curve
  let curveDirection = side === 'left' ? 1 : -1; // Left or right direction of the curve
  let targetY = canvas.height - 100; // Where the fruit should land (just above the basket)
  
  // Generate fruit trajectory
  fruits.push({
    x: startX,
    y: startY,
    speed: gameSpeed + Math.random() * 2, // Speed of the fruit
    curveHeight: curveHeight,
    curveDirection: curveDirection,
    targetY: targetY,
    trajectory: Math.random() * Math.PI - Math.PI / 2, // Random curve angle
  });
}

function spawnBomb() {
  let side = Math.random() < 0.5 ? 'left' : 'right';
  let startX = side === 'left' ? 0 : canvas.width;
  let startY = canvas.height;

  let curveHeight = 300; // Height of the curve
  let curveDirection = side === 'left' ? 1 : -1; // Left or right direction of the curve
  
  // Generate bomb trajectory (similar to fruit but no targetY)
  bombs.push({
    x: startX,
    y: startY,
    speed: gameSpeed + Math.random() * 2,
    curveHeight: curveHeight,
    curveDirection: curveDirection,
    trajectory: Math.random() * Math.PI - Math.PI / 2,
  });
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
    
    // Move fruit with curved trajectory
    fruit.trajectory += 0.1 * fruit.curveDirection;
    fruit.x += Math.cos(fruit.trajectory) * 3; // Moving side-to-side in a curve
    fruit.y -= Math.sin(fruit.trajectory) * 3; // Move up and then fall

    if (fruit.y < fruit.curveHeight) {
      fruit.y += fruit.speed;
    }

    if (fruit.y > canvas.height) {
      fruits.splice(index, 1);
      gameOver = true; // Game over if fruit goes past the basket
    }
  });

  bombs.forEach((bomb, index) => {
    ctx.fillStyle = 'red'; // Bomb color
    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Move bomb with curved trajectory
    bomb.trajectory += 0.1 * bomb.curveDirection;
    bomb.x += Math.cos(bomb.trajectory) * 3; // Moving side-to-side in a curve
    bomb.y -= Math.sin(bomb.trajectory) * 3; // Move up and then fall

    if (bomb.y < bomb.curveHeight) {
      bomb.y += bomb.speed;
    }

    if (bomb.y > canvas.height) {
      bombs.splice(index, 1);
    }
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
  // Slow increase: every 5000 points, increase difficulty very slowly
  if (score % 5000 === 0 && score > 0) {
    gameSpeed += 0.05; // Slow increase
    level++;
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

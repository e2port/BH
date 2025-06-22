// game.js

// ================================
// Section 1: Configuration
// ================================
// Tweak these to change game physics & pacing
const CONFIG = {
  gravity: 0.2,
  jumpStrength: -6,
  obstacleSpeed: 1.5,
  obstacleWidth: 15,
  obstacleGap: 150,
  minGapMargin: 25,
  obstacleSpacing: 200,           // px between obstacles
  bgColors: [
    "#87CEEB", "#FFB6C1", "#90EE90",
    "#FFA07A", "#DDA0DD", "#ADD8E6"
  ],
  bgCycleMs: 10000,
  countdownStart: 4
};

// ================================
// Section 2: State Variables
// ================================
let canvas, ctx;
let canvasWidth, canvasHeight;
let lion, obstacles, score, gameStartTime;
let gameRunning = false;
let countdownTime;
let countdownInterval, bgInterval, currentBgIndex;

// ================================
// Section 3: Asset Loading Stubs
// ================================
// TODO: Replace rectangles with real images/sprites
// const playerSprite = new Image();
// playerSprite.src = 'assets/lion.png';

// ================================
// Section 4: Sound & Music Stubs
// ================================
// TODO: Load sound effects & music
// const flapSound = new Audio('assets/flap.wav');
// const bgMusic  = new Audio('assets/theme.mp3');

// ================================
// Section 5: Input Handling
// ================================
function setupControls() {
  document.addEventListener("keydown", e => {
    if (e.code === "Space") lion.flap();
    // TODO: add Pause (P), Mute (M), etc.
  });
  document.addEventListener("click", () => lion.flap());
  // TODO: add touchstart listener for mobile
}

// ================================
// Section 6: Game Objects
// ================================
function createLion() {
  return {
    x: canvasWidth * 0.2,
    y: canvasHeight * 0.5,
    width: 20,
    height: 10,
    velocityY: 0,
    draw() {
      // TODO: draw playerSprite instead
      ctx.fillStyle = "#800080";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    update() {
      this.velocityY += CONFIG.gravity;
      this.y += this.velocityY;
      if (this.y < 0 || this.y + this.height > canvasHeight) {
        restartGame();
      }
    },
    flap() {
      this.velocityY = CONFIG.jumpStrength;
      // TODO: flapSound.play();
    }
  };
}

// ================================
// Section 7: Canvas & Resize
// ================================
function resizeCanvas() {
  canvasWidth = canvas.clientWidth;
  canvasHeight = canvas.clientHeight;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  if (lion) lion.x = canvasWidth * 0.2;
}

// ================================
// Section 8: Background Cycling
// ================================
function changeBackgroundColor() {
  currentBgIndex = (currentBgIndex + 1) % CONFIG.bgColors.length;
  canvas.style.background = CONFIG.bgColors[currentBgIndex];
}

// ================================
// Section 9: Obstacles
// ================================
function generateObstacle() {
  const gap = CONFIG.obstacleGap;
  const maxTop = canvasHeight - gap - CONFIG.minGapMargin;
  const topH = Math.random() * maxTop + CONFIG.minGapMargin;
  const bottomH = canvasHeight - topH - gap;
  obstacles.push({
    x: canvasWidth,
    width: CONFIG.obstacleWidth,
    topHeight: topH,
    bottomHeight: bottomH
  });
}

function updateObstacles() {
  for (let i = obstacles.length - 1; i >= 0; i--) {
    obstacles[i].x -= CONFIG.obstacleSpeed;
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
    }
  }
  if (
    obstacles.length === 0 ||
    obstacles[obstacles.length - 1].x < canvasWidth - CONFIG.obstacleSpacing
  ) {
    generateObstacle();
  }
}

function drawObstacles() {
  ctx.fillStyle = "#FF4500";
  obstacles.forEach(obs => {
    ctx.fillRect(obs.x, 0, obs.width, obs.topHeight);
    ctx.fillRect(
      obs.x,
      canvasHeight - obs.bottomHeight,
      obs.width,
      obs.bottomHeight
    );
  });
}

// ================================
// Section 10: Collision & Score
// ================================
function checkCollision() {
  for (let obs of obstacles) {
    if (
      (lion.x < obs.x + obs.width &&
        lion.x + lion.width > obs.x &&
        lion.y < obs.topHeight) ||
      (lion.x < obs.x + obs.width &&
        lion.x + lion.width > obs.x &&
        lion.y + lion.height > canvasHeight - obs.bottomHeight)
    ) {
      restartGame();
    }
  }
}

function updateScore() {
  const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
  let pts = 0;
  if (elapsed <= 20) {
    pts = elapsed * 10;
  } else if (elapsed <= 30) {
    pts = 200 + (elapsed - 20) * 20;
  } else if (elapsed <= 40) {
    pts = 400 + (elapsed - 30) * 30;
  } else {
    pts = 700 + (elapsed - 40) * 50;
  }
  score = pts;
  document.getElementById("timer").textContent =
    `0:${elapsed.toString().padStart(2, "0")}`;
  document.getElementById("score").textContent = score
    .toString()
    .padStart(5, "0");
}

// ================================
// Section 11: Main Loop
// ================================
function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  lion.update();
  lion.draw();
  updateObstacles();
  drawObstacles();
  checkCollision();
  updateScore();
  requestAnimationFrame(gameLoop);
}

// ================================
// Section 12: Countdown & Restart
// ================================
function restartGame() {
  gameRunning = false;
  clearInterval(countdownInterval);
  countdownTime = CONFIG.countdownStart;
  document.getElementById("countdown").textContent = countdownTime;
  countdownInterval = setInterval(() => {
    countdownTime--;
    document.getElementById("countdown").textContent = countdownTime > 0 ? countdownTime : "";
    if (countdownTime <= 0) {
      clearInterval(countdownInterval);
      document.getElementById("countdown").textContent = "";
      startGame();
    }
  }, 1000);
}

function startGame() {
  lion = createLion();
  obstacles = [];
  score = 0;
  gameStartTime = Date.now();
  generateObstacle();
  gameRunning = true;
  gameLoop();
}

// ================================
// Section 13: Extra Feature Hooks
// ================================
// 1. Pause/Resume
// 2. Mobile Touch Controls
// 3. Settings Menu (volume, difficulty…)
// 4. High‐Score Persistence (localStorage)
// 5. Particle Effects (explosions, dust…)
// 6. Power‐Ups (slow‐motion, shields…)
// 7. Multi‐Level Progression
// 8. Animated Sprites & Frames
// 9. Background Music (play/pause/toggle)
// 10. Sound Effects (flap, collide, point…)
// (You can add more under this section)

// ================================
// Section 14: Initialization
// ================================
function init() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
  setupControls();
  bgInterval = setInterval(changeBackgroundColor, CONFIG.bgCycleMs);
  restartGame();
}

init();



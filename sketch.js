let sprites = {
    player1: {
      idle: {
        img: null,
        width: 74,
        height: 112,
        frames: 16
      },
      walk: {
        img: null,
        width: 87.4,
        height: 107,
        frames: 9
      },
      jump: {
        img: null,
        width: 103,
        height: 160,
        frames: 18
      }
    },
    player2: {
      idle: {
        img: null,
        width: 97,
        height: 133,
        frames: 24
      },
      walk: {
        img: null,
        width: 88.5,
        height: 190,
        frames: 10
      },
      jump: {
        img: null,
        width: 79.6,
        height: 111,
        frames: 14
      }
  }
};

let player1, player2;
let bgImg;
let titleColors;
const GRAVITY = 0.8;
const GROUND_Y = 500;

function preload() {
  // 載入所有精靈圖
  sprites.player1.idle.img = loadImage('player1idle.png');
  sprites.player1.walk.img = loadImage('player1walk.png');
  sprites.player1.jump.img = loadImage('player1jump.png');
  
  sprites.player2.idle.img = loadImage('player2idle.png');
  sprites.player2.walk.img = loadImage('player2walk.png');
  sprites.player2.jump.img = loadImage('player2jump.png');
  
  bgImg = loadImage('background.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  titleColors = [
    color(65, 105, 225),  // 皇家藍
    color(100, 149, 237), // 矢車菊藍
    color(30, 144, 255),  // 道奇藍
    color(0, 191, 255)    // 深天藍
  ];
  
  // 初始化玩家1
  player1 = {
    x: 100,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    health: 100,
    currentFrame: 0,
    frameCount: 0,
    state: 'idle',
    direction: 1,
    isJumping: false
  };
  
  // 初始化玩家2
  player2 = {
    x: width - 200,
    y: GROUND_Y,
    vx: 0,
    vy: 0,
    health: 100,
    currentFrame: 0,
    frameCount: 0,
    state: 'idle',
    direction: -1,
    isJumping: false
  };
}

function draw() {
  drawBackground();
  drawAnimatedTitle();
  
  updatePlayer(player1);
  updatePlayer(player2);
  
  drawPlayer(player1, sprites.player1);
  drawPlayer(player2, sprites.player2);
  
  displayHealth();
  displayInstructions();
}

function drawBackground() {
  image(bgImg, 0, 0, width, height);
  fill(255, 255, 255, 30);
  rect(0, 0, width, height);
}

function drawAnimatedTitle() {
  push();
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  
  let baseSize = 80;
  let letters = ['T', 'K', 'U', 'E', 'T'];
  let spacing = 70;
  let centerX = width/2 - (spacing * 2);
  let centerY = 80;
  
  for(let i = 0; i < letters.length; i++) {
    push();
    translate(centerX + (i * spacing), centerY);
    
    let offset = sin(frameCount * 0.05 + i * 0.5) * 10;
    
    fill(0, 100);
    textSize(baseSize + abs(offset/2));
    text(letters[i], 3, 3);
    
    let letterColor = titleColors[i % titleColors.length];
    fill(letterColor);
    textSize(baseSize + abs(offset/2));
    
    strokeWeight(3);
    stroke(255);
    text(letters[i], 0, 0);
    pop();
  }
  
  push();
  textSize(24);
  textStyle(ITALIC);
  noStroke();
  fill(255);
  text("Battle Arena", width/2, centerY + 50);
  pop();
  
  pop();
}

function updatePlayer(player) {
  player.frameCount++;
  if (player.frameCount > 5) {
    player.frameCount = 0;
    player.currentFrame++;
    
    let maxFrames = sprites[player === player1 ? 'player1' : 'player2'][player.state].frames;
    if (player.currentFrame >= maxFrames) {
      player.currentFrame = 0;
    }
  }
  
  if (player.y < GROUND_Y) {
    player.vy += GRAVITY;
    player.isJumping = true;
  } else {
    player.vy = 0;
    player.y = GROUND_Y;
    player.isJumping = false;
    if (player.state === 'jump') {
      player.state = 'idle';
    }
  }
  
  player.x += player.vx;
  player.y += player.vy;
  
  player.x = constrain(player.x, 0, width - sprites[player === player1 ? 'player1' : 'player2'].idle.width);
}

function drawPlayer(player, spriteData) {
  push();
  translate(player.x, player.y);
  if (player.direction === -1) {
    scale(-1, 1);
    translate(-spriteData[player.state].width, 0);
  }
  
  let spriteX = player.currentFrame * spriteData[player.state].width;
  
  image(
    spriteData[player.state].img,
    0,
    0,
    spriteData[player.state].width,
    spriteData[player.state].height,
    spriteX,
    0,
    spriteData[player.state].width,
    spriteData[player.state].height
  );
  pop();
}

function keyPressed() {
  // 玩家1跳躍
  if (key === 'w' && !player1.isJumping) {
    player1.vy = -15;
    player1.state = 'jump';
  }
  
  // 玩家2跳躍
  if (keyCode === UP_ARROW && !player2.isJumping) {
    player2.vy = -15;
    player2.state = 'jump';
  }
}

function keyReleased() {
  if ((key === 'a' || key === 'd') && player1.state === 'walk') {
    player1.state = 'idle';
    player1.vx = 0;
  }
  if ((keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) && player2.state === 'walk') {
    player2.state = 'idle';
    player2.vx = 0;
  }
}

function displayInstructions() {
  push();
  textSize(16);
  textAlign(LEFT);
  
  fill(0, 0, 0, 180);
  rect(10, height - 140, 200, 130, 10);
  
  fill(255);
  let instructions = [
    "遊戲操作說明：",
    "玩家1 (左側)：",
    "- W：跳躍",
    "- A：向左移動",
    "- D：向右移動",
    "",
    "玩家2 (右側)：",
    "- ↑：跳躍",
    "- ←：向左移動",
    "- →：向右移動"
  ];
  
  let startY = height - 130;
  instructions.forEach((line, index) => {
    text(line, 20, startY + (index * 15));
  });
  pop();
}

function displayHealth() {
  push();
  textAlign(LEFT);
  
  fill(0, 0, 0, 150);
  rect(20, 20, 200, 40, 5);
  rect(width - 220, 20, 200, 40, 5);
  
  fill(255, 50, 50);
  rect(25, 25, map(player1.health, 0, 100, 0, 190), 30, 3);
  rect(width - 215, 25, map(player2.health, 0, 100, 0, 190), 30, 3);
  
  textSize(20);
  fill(255);
  text(`P1: ${player1.health}%`, 30, 47);
  text(`P2: ${player2.health}%`, width - 210, 47);
  pop();
}

// 添加移動控制
function draw() {
  drawBackground();
  drawAnimatedTitle();
  
  // 處理玩家1的移動
  if (keyIsDown(65)) { // A鍵
    player1.x -= 5;
    player1.direction = -1;
    player1.state = 'walk';
  }
  if (keyIsDown(68)) { // D鍵
    player1.x += 5;
    player1.direction = 1;
    player1.state = 'walk';
  }
  
  // 處理玩家2的移動
  if (keyIsDown(LEFT_ARROW)) {
    player2.x -= 5;
    player2.direction = -1;
    player2.state = 'walk';
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player2.x += 5;
    player2.direction = 1;
    player2.state = 'walk';
  }
  
  updatePlayer(player1);
  updatePlayer(player2);
  
  drawPlayer(player1, sprites.player1);
  drawPlayer(player2, sprites.player2);
  
  displayHealth();
  displayInstructions();
} 
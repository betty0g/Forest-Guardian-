import { Collectible } from "./gameObjects/collectible.js";
import { Enemy } from "./gameObjects/enemy.js";
import { Tree } from "./gameObjects/tree.js";
import { Bush } from "./gameObjects/bush.js";
import { Cauldron } from "./gameObjects/cauldron.js";
import { LifePotion } from "./gameObjects/lifePotion.js";
import { MAP_COLS, MAP_ROWS, TILE_WIDTH, TILE_HEIGHT, mapWidth, mapHeight, showGrid, invincibilityDuration, getCurrentTilemap } from "./config/constants.js";
import { initCollectibles, initTreesAndBushes, initEnemies, initCauldron } from "./gameObjects/levelManager.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

const spriteSheet = new Image();
spriteSheet.src = 'images/spritesheetWitch.png';

const inventory = {
    leaf: 0,
    crystal: 0,
    mushroom: 0,
    sage: 0
};

const required = {
    leaf: 3,
    mushroom: 2,
    sage: 1,
    crystal: 3
};

let hearts = 4;
let currentLevel = 1;
let gameState = 'startScreen';

const player = {
    x: Math.floor(MAP_COLS / 2) * TILE_WIDTH - (TILE_WIDTH * 1.2 - TILE_WIDTH) / 2,
    y: Math.floor(MAP_ROWS / 2) * TILE_HEIGHT - (TILE_HEIGHT * 1.2 - TILE_HEIGHT) / 2,
    width: TILE_WIDTH * 1.2,
    height: TILE_HEIGHT * 1.2,
    speed: 4,
    xVelocity: 0,
    yVelocity: 0,
    spriteWidth: 32,
    spriteHeight: 32,
    currentFrame: 0,
    animationFrames: [0, 0],
    animationSpeed: 0.1,
    animationCounter: 0,
    direction: 'down'
};

const camera = {
    x: 0,
    y: 0
};


const mapImage = new Image();
mapImage.src = 'images/map1.png';


const startScreenImage = new Image();
startScreenImage.src = 'images/startscreen.png';
const startButtonImage = new Image();
startButtonImage.src = 'images/startbtn.png';


const startSecondLevelImage = new Image();
startSecondLevelImage.src = 'images/startsecondlevel.png';
const level2ButtonImage = new Image();
level2ButtonImage.src = 'images/level2btn.png';


const startThirdLevelImage = new Image();
startThirdLevelImage.src = 'images/startthirdlevel.png';
const level3ButtonImage = new Image();
level3ButtonImage.src = 'images/level3btn.png';

const winScreenImage = new Image();
winScreenImage.src = 'images/winscreen.png';
const gameOverScreenImage = new Image();
gameOverScreenImage.src = 'images/gameoverscreen.png';
const playAgainButtonImage = new Image();
playAgainButtonImage.src = 'images/playagainbtn.png';

const leafIcon = new Image();
leafIcon.src = 'images/leaf.png';
const crystalIcon = new Image();
crystalIcon.src = 'images/crystal.png';
const mushroomIcon = new Image();
mushroomIcon.src = 'images/mushroom.png';
const sageIcon = new Image();
sageIcon.src = 'images/sage.png';

const collectibles = [];
const enemies = [];
const bullets = [];
const trees = [];
const bushes = [];
const lifePotions = [];
let cauldron = null;
const potionImage = new Image();
potionImage.src = 'images/potion.png';
let potionState = {
    active: false,
    alpha: 1.0,
    fadeSpeed: 0.01
};

let invincibilityTimer = 0;

initCollectibles(collectibles, required, currentLevel);
initTreesAndBushes(trees, bushes, currentLevel);

function spawnEnemy() {
    const x = Math.random() * (mapWidth - 60) + 30;
    const y = Math.random() * (mapHeight - 60) + 30;
    const enemySpeed = currentLevel === 1 ? 1.5 : (currentLevel === 2 ? 2 : 2.5);
    const enemyHealth = currentLevel === 1 ? 4 : 3;
    let canShoot = true;
    if (currentLevel === 3) {
        const shootingCount = enemies.filter(e => e.canShoot).length;
        canShoot = shootingCount < 2;
    }
    enemies.push(new Enemy(x, y, enemySpeed, enemyHealth, canShoot));
}

function spawnLifePotion() {
    if (currentLevel === 1) return;
    
    const currentTilemap = getCurrentTilemap(currentLevel);
    let attempts = 0;
    let x, y;
    
    const minDistance = TILE_WIDTH * 3;
    const maxDistance = TILE_WIDTH * 5;
    
    do {
        const angle = Math.random() * Math.PI * 2;
        const distance = minDistance + Math.random() * (maxDistance - minDistance);
        const spawnX = player.x + player.width / 2 + Math.cos(angle) * distance;
        const spawnY = player.y + player.height / 2 + Math.sin(angle) * distance;
        
        const col = Math.floor(spawnX / TILE_WIDTH);
        const row = Math.floor(spawnY / TILE_HEIGHT);
        
        if (col >= 0 && col < MAP_COLS && row >= 0 && row < MAP_ROWS &&
            currentTilemap[row] && currentTilemap[row][col] === 0) {
            x = col * TILE_WIDTH + TILE_WIDTH / 2;
            y = row * TILE_HEIGHT + TILE_HEIGHT / 2;
            break;
        }
        attempts++;
    } while (attempts < 100);
    
    if (x !== undefined && y !== undefined) {
        lifePotions.push(new LifePotion(x, y));
    }
}

initEnemies(enemies, currentLevel, mapWidth, mapHeight);

function startLevel2() {
    currentLevel = 2;
    for (const type in inventory) {
        inventory[type] = 0;
    }
    player.x = Math.floor(MAP_COLS / 2) * TILE_WIDTH - (TILE_WIDTH * 1.2 - TILE_WIDTH) / 2;
    player.y = Math.floor(MAP_ROWS / 2) * TILE_HEIGHT - (TILE_HEIGHT * 1.2 - TILE_HEIGHT) / 2;
    camera.x = 0;
    camera.y = 0;
    bullets.length = 0;
    lifePotions.length = 0;
    potionState.active = false;
    potionState.alpha = 1.0;
    initTreesAndBushes(trees, bushes, currentLevel);
    initCollectibles(collectibles, required, currentLevel);
    initEnemies(enemies, currentLevel, mapWidth, mapHeight);
    invincibilityTimer = 0;
    gameState = 'playing';
    canvas.style.cursor = 'crosshair';
}

function startLevel3() {
    currentLevel = 3;
    for (const type in inventory) {
        inventory[type] = 0;
    }
    player.x = Math.floor(MAP_COLS / 2) * TILE_WIDTH - (TILE_WIDTH * 1.2 - TILE_WIDTH) / 2;
    player.y = Math.floor(MAP_ROWS / 2) * TILE_HEIGHT - (TILE_HEIGHT * 1.2 - TILE_HEIGHT) / 2;
    camera.x = 0;
    camera.y = 0;
    bullets.length = 0;
    lifePotions.length = 0;
    potionState.active = false;
    potionState.alpha = 1.0;
    initTreesAndBushes(trees, bushes, currentLevel);
    initCollectibles(collectibles, required, currentLevel);
    initEnemies(enemies, currentLevel, mapWidth, mapHeight);
    cauldron = initCauldron(cauldron, currentLevel);
    invincibilityTimer = 0;
    gameState = 'playing';
    canvas.style.cursor = 'crosshair';
}

function resetGame() {
    currentLevel = 1;
    for (const type in inventory) {
        inventory[type] = 0;
    }
    player.x = Math.floor(MAP_COLS / 2) * TILE_WIDTH - (TILE_WIDTH * 1.2 - TILE_WIDTH) / 2;
    player.y = Math.floor(MAP_ROWS / 2) * TILE_HEIGHT - (TILE_HEIGHT * 1.2 - TILE_HEIGHT) / 2;
    camera.x = 0;
    camera.y = 0;
    bullets.length = 0;
    lifePotions.length = 0;
    potionState.active = false;
    potionState.alpha = 1.0;
    hearts = 4;
    initTreesAndBushes(trees, bushes, currentLevel);
    initCollectibles(collectibles, required, currentLevel);
    initEnemies(enemies, currentLevel, mapWidth, mapHeight);
    cauldron = null;
    invincibilityTimer = 0;
    gameState = 'playing';
    canvas.style.cursor = 'crosshair';
}

const keys = {};

document.addEventListener('keydown', (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault();
    }
    
    if (e.key === 'Enter') {
        if (gameState === 'levelComplete' && currentLevel === 1) {
            startLevel2();
            return;
        }
        if (gameState === 'levelComplete' && currentLevel === 2) {
            startLevel3();
            return;
        }
    }
    
    keys[e.key] = true;
    handleInput(e.key);
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
    if (!keys['ArrowUp'] && !keys['ArrowDown'] && !keys['ArrowLeft'] && !keys['ArrowRight'] &&
        !keys['w'] && !keys['a'] && !keys['s'] && !keys['d']) {
        player.xVelocity = 0;
        player.yVelocity = 0;
        if (player.direction === 'down') setAnimationSprites(0, 0);
        else if (player.direction === 'right') setAnimationSprites(3, 3);
        else if (player.direction === 'left') setAnimationSprites(6, 6);
        else if (player.direction === 'up') setAnimationSprites(9, 9);
    }
});

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (gameState === 'startScreen') {
        const buttonCenterX = canvas.width / 2;
        const buttonCenterY = canvas.height - 110;
        let buttonWidth = 200;
        let buttonHeight = buttonWidth;
        if (startButtonImage.complete && startButtonImage.naturalWidth > 0) {
            const buttonAspectRatio = startButtonImage.naturalWidth / startButtonImage.naturalHeight;
            buttonHeight = buttonWidth / buttonAspectRatio;
        }
        
        if (mouseX >= buttonCenterX - buttonWidth / 2 &&
            mouseX <= buttonCenterX + buttonWidth / 2 &&
            mouseY >= buttonCenterY - buttonHeight / 2 &&
            mouseY <= buttonCenterY + buttonHeight / 2) {
            gameState = 'playing';
            canvas.style.cursor = 'crosshair';
            return;
        }
    }
    
    if (gameState === 'levelComplete' && currentLevel === 1) {
        const buttonCenterX = canvas.width / 2;
        const buttonCenterY = canvas.height - 110;
        let buttonWidth = 350;
        let buttonHeight = buttonWidth;
        if (level2ButtonImage.complete && level2ButtonImage.naturalWidth > 0) {
            const buttonAspectRatio = level2ButtonImage.naturalWidth / level2ButtonImage.naturalHeight;
            buttonHeight = buttonWidth / buttonAspectRatio;
        }
        
        if (mouseX >= buttonCenterX - buttonWidth / 2 &&
            mouseX <= buttonCenterX + buttonWidth / 2 &&
            mouseY >= buttonCenterY - buttonHeight / 2 &&
            mouseY <= buttonCenterY + buttonHeight / 2) {
            startLevel2();
            return;
        }
    }
    
    if (gameState === 'levelComplete' && currentLevel === 2) {
        const buttonCenterX = canvas.width / 2;
        const buttonCenterY = canvas.height - 110;
        let buttonWidth = 350;
        let buttonHeight = buttonWidth;
        if (level3ButtonImage.complete && level3ButtonImage.naturalWidth > 0) {
            const buttonAspectRatio = level3ButtonImage.naturalWidth / level3ButtonImage.naturalHeight;
            buttonHeight = buttonWidth / buttonAspectRatio;
        }
        
        if (mouseX >= buttonCenterX - buttonWidth / 2 &&
            mouseX <= buttonCenterX + buttonWidth / 2 &&
            mouseY >= buttonCenterY - buttonHeight / 2 &&
            mouseY <= buttonCenterY + buttonHeight / 2) {
            startLevel3();
            return;
        }
    }
    
    if (gameState === 'winScreen') {
        const buttonCenterX = canvas.width / 2;
        const buttonCenterY = canvas.height - 110;
        let buttonWidth = 400;
        let buttonHeight = buttonWidth;
        if (playAgainButtonImage.complete && playAgainButtonImage.naturalWidth > 0) {
            const buttonAspectRatio = playAgainButtonImage.naturalWidth / playAgainButtonImage.naturalHeight;
            buttonHeight = buttonWidth / buttonAspectRatio;
        }
        
        if (mouseX >= buttonCenterX - buttonWidth / 2 &&
            mouseX <= buttonCenterX + buttonWidth / 2 &&
            mouseY >= buttonCenterY - buttonHeight / 2 &&
            mouseY <= buttonCenterY + buttonHeight / 2) {
            resetGame();
            return;
        }
    }
    
    if (gameState === 'gameOver') {
        const buttonCenterX = canvas.width / 2;
        const buttonCenterY = canvas.height - 110;
        let buttonWidth = 400;
        let buttonHeight = buttonWidth;
        if (playAgainButtonImage.complete && playAgainButtonImage.naturalWidth > 0) {
            const buttonAspectRatio = playAgainButtonImage.naturalWidth / playAgainButtonImage.naturalHeight;
            buttonHeight = buttonWidth / buttonAspectRatio;
        }
        
        if (mouseX >= buttonCenterX - buttonWidth / 2 &&
            mouseX <= buttonCenterX + buttonWidth / 2 &&
            mouseY >= buttonCenterY - buttonHeight / 2 &&
            mouseY <= buttonCenterY + buttonHeight / 2) {
            resetGame();
            return;
        }
    }
    
    if (gameState !== 'playing') return;
    
    const worldMouseX = mouseX + camera.x;
    const worldMouseY = mouseY + camera.y;
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const dx = worldMouseX - playerCenterX;
    const dy = worldMouseY - playerCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const speed = 12;
    const velocityX = (dx / distance) * speed;
    const velocityY = (dy / distance) * speed;
    
    bullets.push({
        x: playerCenterX,
        y: playerCenterY,
        velocityX,
        velocityY,
        radius: 5,
        color: '#c084fc',
        type: 'player'
    });
});


function setAnimationSprites(startFrame, endFrame) {
    player.animationFrames = [startFrame, endFrame];
    player.currentFrame = startFrame;
    player.animationCounter = 0;
}

function handleInput(key) {
    switch(key) {
        case 'd':
        case 'ArrowRight':
            if (player.xVelocity !== player.speed) {
                setAnimationSprites(3, 5); 
            }
            player.xVelocity = player.speed;
            player.yVelocity = 0;
            player.direction = 'right';
            break;
        case 'a':
        case 'ArrowLeft':
            if (player.xVelocity !== -player.speed) {
                setAnimationSprites(6, 8); 
            }
            player.xVelocity = -player.speed;
            player.yVelocity = 0;
            player.direction = 'left';
            break;
        case 'w':
        case 'ArrowUp':
            if (player.yVelocity !== -player.speed) {
                setAnimationSprites(9, 11); 
            }
            player.yVelocity = -player.speed;
            player.xVelocity = 0;
            player.direction = 'up';
            break;
        case 's':
        case 'ArrowDown':
            if (player.yVelocity !== player.speed) {
                setAnimationSprites(0, 2); 
            }
            player.yVelocity = player.speed;
            player.xVelocity = 0;
            player.direction = 'down';
            break;
    }
}

function updateAnimation() {
    player.animationCounter += player.animationSpeed;
    
    if (player.animationCounter >= 1) {
        player.animationCounter = 0;
        player.currentFrame++;
        
        // Loop animation
        if (player.currentFrame > player.animationFrames[1]) {
            player.currentFrame = player.animationFrames[0];
        }
    }
}

function getFrameFromSpriteSheet(frameIndex) {
    const col = frameIndex % 3;
    const row = Math.floor(frameIndex / 3);
    return {
        x: col * player.spriteWidth,
        y: row * player.spriteHeight
    };
}

function checkTileCollision(x, y, width, height) {
    for (const tree of trees) {
        if (tree.checkCollision(x, y, width, height)) {
            return true;
        }
    }
    for (const bush of bushes) {
        if (bush.checkCollision(x, y, width, height)) {
            return true;
        }
    }
    return false;
}

function update() {
    if (gameState === 'playing') {
        canvas.style.cursor = 'crosshair';
    } else {
        canvas.style.cursor = 'default';
    }
    
    if (gameState !== 'playing') {
        return;
    }

    if (keys['ArrowUp'] || keys['w']) {
        const newY = Math.max(0, player.y - player.speed);
        if (!checkTileCollision(player.x, newY, player.width, player.height)) {
            player.y = newY;
        }
    }
    if (keys['ArrowDown'] || keys['s']) {
        const newY = Math.min(mapHeight - player.height, player.y + player.speed);
        if (!checkTileCollision(player.x, newY, player.width, player.height)) {
            player.y = newY;
        }
    }
    if (keys['ArrowLeft'] || keys['a']) {
        const newX = Math.max(0, player.x - player.speed);
        if (!checkTileCollision(newX, player.y, player.width, player.height)) {
            player.x = newX;
        }
    }
    if (keys['ArrowRight'] || keys['d']) {
        const newX = Math.min(mapWidth - player.width, player.x + player.speed);
        if (!checkTileCollision(newX, player.y, player.width, player.height)) {
            player.x = newX;
        }
    }

    updateAnimation();

    if (invincibilityTimer > 0) {
        invincibilityTimer--;
    }

    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += bullet.velocityX;
        bullet.y += bullet.velocityY;
        
        let shouldRemove = false;
        
        if (bullet.type === 'player') {
        for (let j = enemies.length - 1; j >= 0; j--) {
            const enemy = enemies[j];
            const closestX = Math.max(enemy.x, Math.min(bullet.x, enemy.x + enemy.width));
            const closestY = Math.max(enemy.y, Math.min(bullet.y, enemy.y + enemy.height));
            const distanceX = bullet.x - closestX;
            const distanceY = bullet.y - closestY;
            const distanceSquared = distanceX * distanceX + distanceY * distanceY;
            
            if (distanceSquared < bullet.radius * bullet.radius) {
                enemy.health -= 1;
                if (enemy.health <= 0) {
                    enemies.splice(j, 1);
                    spawnEnemy();
                }
                    shouldRemove = true;
                break;
                }
            }
        }
        
        if (bullet.type === 'enemy' && invincibilityTimer === 0) {
            const playerCenterX = player.x + player.width / 2;
            const playerCenterY = player.y + player.height / 2;
            const distanceX = bullet.x - playerCenterX;
            const distanceY = bullet.y - playerCenterY;
            const distanceSquared = distanceX * distanceX + distanceY * distanceY;
            
            if (distanceSquared < (bullet.radius + Math.max(player.width, player.height) / 2) * (bullet.radius + Math.max(player.width, player.height) / 2)) {
                const previousHearts = hearts;
                hearts--;
                invincibilityTimer = invincibilityDuration;
                if (hearts <= 0) {
                    gameState = 'gameOver';
                } else if (previousHearts > hearts && (currentLevel === 2 || currentLevel === 3)) {
                    spawnLifePotion();
                }
                shouldRemove = true;
            }
        }
        
        for (const tree of trees) {
            const closestX = Math.max(tree.x, Math.min(bullet.x, tree.x + tree.width));
            const closestY = Math.max(tree.y, Math.min(bullet.y, tree.y + tree.height));
            const distanceX = bullet.x - closestX;
            const distanceY = bullet.y - closestY;
            const distanceSquared = distanceX * distanceX + distanceY * distanceY;
            
            if (distanceSquared < bullet.radius * bullet.radius) {
                shouldRemove = true;
                break;
            }
        }
        
        if (!shouldRemove) {
            for (const bush of bushes) {
                const closestX = Math.max(bush.x, Math.min(bullet.x, bush.x + bush.width));
                const closestY = Math.max(bush.y, Math.min(bullet.y, bush.y + bush.height));
                const distanceX = bullet.x - closestX;
                const distanceY = bullet.y - closestY;
                const distanceSquared = distanceX * distanceX + distanceY * distanceY;
                
                if (distanceSquared < bullet.radius * bullet.radius) {
                    shouldRemove = true;
                    break;
                }
            }
        }
        
        if (shouldRemove ||
            bullet.x < -bullet.radius ||
            bullet.x > mapWidth + bullet.radius ||
            bullet.y < -bullet.radius ||
            bullet.y > mapHeight + bullet.radius) {
            bullets.splice(i, 1);
        }
    }

    enemies.forEach(enemy => {
        enemy.update(player, mapWidth, mapHeight, bullets, currentLevel);
    });

    if (invincibilityTimer === 0) {
        for (const enemy of enemies) {
            if (enemy.checkCollision(player)) {
                const previousHearts = hearts;
                hearts--;
                invincibilityTimer = invincibilityDuration;
                if (hearts <= 0) {
                    gameState = 'gameOver';
                } else if (previousHearts > hearts && (currentLevel === 2 || currentLevel === 3)) {
                    spawnLifePotion();
                }
                break;
            }
        }
    }

    for (let i = collectibles.length - 1; i >= 0; i--) {
        const item = collectibles[i];
        if (item.checkCollision(player)) {
            inventory[item.type] = (inventory[item.type] || 0) + 1;
            collectibles.splice(i, 1);
        }
    }
    
    for (let i = lifePotions.length - 1; i >= 0; i--) {
        const potion = lifePotions[i];
        if (potion.checkCollision(player)) {
            hearts = 4;
            lifePotions.splice(i, 1);
        }
    }

    let allCollected = true;
    for (const type in required) {
        if (inventory[type] < required[type]) {
            allCollected = false;
            break;
        }
    }
    
    if (currentLevel === 3 && allCollected && cauldron && !potionState.active) {
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const cauldronCenterX = cauldron.x + cauldron.width / 2;
        const cauldronCenterY = cauldron.y + cauldron.height / 2;
        const distance = Math.sqrt(
            (playerCenterX - cauldronCenterX) ** 2 + 
            (playerCenterY - cauldronCenterY) ** 2
        );
        
        if (distance < 150) {
            potionState.active = true;
            potionState.alpha = 1.0;
            enemies.length = 0;
        }
    }
    
    if (potionState.active) {
        potionState.alpha -= potionState.fadeSpeed;
        if (potionState.alpha <= 0) {
            potionState.alpha = 0;
            if (currentLevel === 3 && hearts > 0) {
                gameState = 'winScreen';
            }
        }
    }
    
    if (currentLevel !== 3 && allCollected && hearts > 0) {
        gameState = 'levelComplete';
    }

    camera.x = player.x - canvas.width / 2 + player.width / 2;
    camera.y = player.y - canvas.height / 2 + player.height / 2;
    camera.x = Math.max(0, Math.min(camera.x, mapWidth - canvas.width));
    camera.y = Math.max(0, Math.min(camera.y, mapHeight - canvas.height));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (gameState === 'startScreen') {
        ctx.imageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        
        if (startScreenImage.complete && startScreenImage.naturalWidth > 0) {
            ctx.drawImage(startScreenImage, 0, 0, canvas.width, canvas.height);
        }
        
        if (startButtonImage.complete && startButtonImage.naturalWidth > 0) {
            const buttonCenterX = canvas.width / 2;
            const buttonCenterY = canvas.height - 110;
            const buttonAspectRatio = startButtonImage.naturalWidth / startButtonImage.naturalHeight;
            let buttonWidth = 280;
            let buttonHeight = buttonWidth / buttonAspectRatio;
            
            ctx.drawImage(
                startButtonImage,
                buttonCenterX - buttonWidth / 2,
                buttonCenterY - buttonHeight / 2,
                buttonWidth,
                buttonHeight
            );
        }
        
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        
        return;
    }
    
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    
    if (mapImage.complete && mapImage.naturalWidth > 0) {
        ctx.drawImage(mapImage, -camera.x, -camera.y, mapWidth, mapHeight);
    }

    if (showGrid) {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
            ctx.beginPath();
        
        const startX = Math.floor(camera.x / TILE_WIDTH) * TILE_WIDTH;
        const endX = Math.ceil((camera.x + canvas.width) / TILE_WIDTH) * TILE_WIDTH;
        const startY = Math.floor(camera.y / TILE_HEIGHT) * TILE_HEIGHT;
        const endY = Math.ceil((camera.y + canvas.height) / TILE_HEIGHT) * TILE_HEIGHT;
        
        for (let i = startX; i <= endX; i += TILE_WIDTH) {
            ctx.moveTo(i - camera.x, 0);
            ctx.lineTo(i - camera.x, canvas.height);
        }
        
        for (let i = startY; i <= endY; i += TILE_HEIGHT) {
            ctx.moveTo(0, i - camera.y);
            ctx.lineTo(canvas.width, i - camera.y);
        }
        
            ctx.stroke();
        }

    const viewportLeft = camera.x;
    const viewportRight = camera.x + canvas.width;
    const viewportTop = camera.y;
    const viewportBottom = camera.y + canvas.height;

    trees.forEach(tree => {
        if (tree.x + tree.width >= viewportLeft && tree.x <= viewportRight &&
            tree.y + tree.height >= viewportTop && tree.y <= viewportBottom) {
            tree.draw(ctx, camera.x, camera.y);
        }
    });

    bushes.forEach(bush => {
        if (bush.x + bush.width >= viewportLeft && bush.x <= viewportRight &&
            bush.y + bush.height >= viewportTop && bush.y <= viewportBottom) {
            bush.draw(ctx, camera.x, camera.y);
        }
    });

    if (currentLevel === 3 && cauldron) {
        if (cauldron.x + cauldron.width >= viewportLeft && cauldron.x <= viewportRight &&
            cauldron.y + cauldron.height >= viewportTop && cauldron.y <= viewportBottom) {
            cauldron.draw(ctx, camera.x, camera.y);
        }
    }

    collectibles.forEach(collectible => {
        if (collectible.x + collectible.width >= viewportLeft && collectible.x <= viewportRight &&
            collectible.y + collectible.height >= viewportTop && collectible.y <= viewportBottom) {
        collectible.draw(ctx, camera.x, camera.y);
        }
    });

    lifePotions.forEach(potion => {
        const potionLeft = potion.x - potion.width / 2;
        const potionRight = potion.x + potion.width / 2;
        const potionTop = potion.y - potion.height / 2;
        const potionBottom = potion.y + potion.height / 2;
        if (potionRight >= viewportLeft && potionLeft <= viewportRight &&
            potionBottom >= viewportTop && potionTop <= viewportBottom) {
            potion.draw(ctx, camera.x, camera.y);
        }
    });

    enemies.forEach(enemy => {
        if (enemy.x + enemy.width >= viewportLeft && enemy.x <= viewportRight &&
            enemy.y + enemy.height >= viewportTop && enemy.y <= viewportBottom) {
        enemy.draw(ctx, camera.x, camera.y);
        }
    });

    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(
            bullet.x - camera.x,
            bullet.y - camera.y,
            bullet.radius,
            0,
            Math.PI * 2
        );
        ctx.fill();
    });

    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    
    if (invincibilityTimer === 0 || Math.floor(invincibilityTimer / 5) % 2 === 0) {
        if (spriteSheet.complete && spriteSheet.naturalWidth > 0) {
            const framePos = getFrameFromSpriteSheet(player.currentFrame);
            ctx.drawImage(
                spriteSheet,
                framePos.x,
                framePos.y,
                player.spriteWidth,
                player.spriteHeight,
                player.x - camera.x,
                player.y - camera.y,
                player.width,
                player.height
            );
        }
    }

    function drawPixelHeart(ctx, x, y, size) {
        const pixelSize = size / 8;
        
        const heartPattern = [
            [0, 1, 1, 0, 0, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
        
        function shouldDrawBorder(row, col) {
            if (heartPattern[row][col] === 0) return false;
            const neighbors = [
                [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]
            ];
            for (const [r, c] of neighbors) {
                if (r < 0 || r >= 8 || c < 0 || c >= 8 || heartPattern[r][c] === 0) {
                    return true; 
                }
            }
            return false;
        }
        
        ctx.fillStyle = '#000000';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (heartPattern[row][col] === 1 && shouldDrawBorder(row, col)) {
                    ctx.fillRect(x + col * pixelSize - 1, y + row * pixelSize - 1, pixelSize + 2, pixelSize + 2);
                }
            }
        }
        
        ctx.fillStyle = '#FF0000';
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (heartPattern[row][col] === 1) {
                    ctx.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
                }
            }
        }
    }
    
    const heartSize = 32;
    const heartSpacing = 40;
    for (let i = 0; i < hearts; i++) {
        drawPixelHeart(ctx, 10 + i * heartSpacing, 10, heartSize);
    }

    const typesOrder = ['leaf', 'crystal', 'mushroom', 'sage'];
    const icons = {
        leaf: leafIcon,
        crystal: crystalIcon,
        mushroom: mushroomIcon,
        sage: sageIcon
    };
    
    const boxSize = 90;
    const hudY = canvas.height - boxSize - 10;
    const totalWidth = boxSize * typesOrder.length;
    const startX = (canvas.width - totalWidth) / 2;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '12px "Pixelify Sans", sans-serif';
    
    const typeLabels = {
        leaf: 'Leaf',
        crystal: 'Crystal',
        mushroom: 'Mushroom',
        sage: 'Sage'
    };
    
    typesOrder.forEach((type, index) => {
        const boxX = startX + (boxSize * index);
        const centerX = boxX + boxSize / 2;
        const iconSize = 45;
        const icon = icons[type];

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(boxX, hudY, boxSize, boxSize);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.strokeRect(boxX, hudY, boxSize, boxSize);

        ctx.fillStyle = 'white';
        ctx.font = '12px "Pixelify Sans", sans-serif';
        ctx.fillText(
            typeLabels[type],
            centerX,
            hudY + 15
        );

        if (icon && icon.complete && icon.naturalWidth > 0) {
            ctx.drawImage(
                icon,
                centerX - iconSize / 2,
                hudY + 25,
                iconSize,
                iconSize
            );
        }

        ctx.fillStyle = 'white';
        ctx.font = '14px "Pixelify Sans", sans-serif';
        const current = inventory[type] || 0;
        const need = required[type] || 0;
        ctx.fillText(
            `${current} / ${need}`,
            centerX,
            hudY + boxSize - 12
        );
    });

    if (currentLevel === 3 && potionState.active && potionState.alpha > 0) {
        if (potionImage.complete && potionImage.naturalWidth > 0) {
            ctx.save();
            ctx.globalAlpha = potionState.alpha;
            const potionSize = 200;
            ctx.drawImage(
                potionImage,
                canvas.width / 2 - potionSize / 2,
                canvas.height / 2 - potionSize / 2,
                potionSize,
                potionSize
            );
            ctx.restore();
        }
    }

    if (gameState === 'levelComplete') {
        ctx.imageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        
        if (currentLevel === 1) {
        if (startSecondLevelImage.complete && startSecondLevelImage.naturalWidth > 0) {
            ctx.drawImage(startSecondLevelImage, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '40px Arial';
            ctx.fillText('Level 1 Complete!', canvas.width / 2, canvas.height / 2 - 30);
            ctx.font = '30px Arial';
            ctx.fillText('Level 2', canvas.width / 2, canvas.height / 2 + 20);
            }
            
            if (level2ButtonImage.complete && level2ButtonImage.naturalWidth > 0) {
                const buttonCenterX = canvas.width / 2;
                const buttonCenterY = canvas.height - 110;
                const buttonAspectRatio = level2ButtonImage.naturalWidth / level2ButtonImage.naturalHeight;
                let buttonWidth = 350;
                let buttonHeight = buttonWidth / buttonAspectRatio;
                
                ctx.drawImage(
                    level2ButtonImage,
                    buttonCenterX - buttonWidth / 2,
                    buttonCenterY - buttonHeight / 2,
                    buttonWidth,
                    buttonHeight
                );
            }
        } else if (currentLevel === 2) {
            if (startThirdLevelImage.complete && startThirdLevelImage.naturalWidth > 0) {
                ctx.drawImage(startThirdLevelImage, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '40px Arial';
                ctx.fillText('Level 2 Complete!', canvas.width / 2, canvas.height / 2 - 30);
                ctx.font = '30px Arial';
                ctx.fillText('Level 3', canvas.width / 2, canvas.height / 2 + 20);
            }
            
            if (level3ButtonImage.complete && level3ButtonImage.naturalWidth > 0) {
                const buttonCenterX = canvas.width / 2;
                const buttonCenterY = canvas.height - 110;
                const buttonAspectRatio = level3ButtonImage.naturalWidth / level3ButtonImage.naturalHeight;
                let buttonWidth = 350;
                let buttonHeight = buttonWidth / buttonAspectRatio;
                
                ctx.drawImage(
                    level3ButtonImage,
                    buttonCenterX - buttonWidth / 2,
                    buttonCenterY - buttonHeight / 2,
                    buttonWidth,
                    buttonHeight
                );
            }
        } else if (currentLevel === 3) {
            if (winScreenImage.complete && winScreenImage.naturalWidth > 0) {
                ctx.drawImage(winScreenImage, 0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.font = '50px Arial';
                ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
                ctx.font = '30px Arial';
                ctx.fillText('Potion Created!', canvas.width / 2, canvas.height / 2 + 50);
            }
            
            if (playAgainButtonImage.complete && playAgainButtonImage.naturalWidth > 0) {
                const buttonCenterX = canvas.width / 2;
                const buttonCenterY = canvas.height - 110;
                
                const buttonAspectRatio = playAgainButtonImage.naturalWidth / playAgainButtonImage.naturalHeight;
                let buttonWidth = 400;
                let buttonHeight = buttonWidth / buttonAspectRatio;
                
                ctx.drawImage(
                    playAgainButtonImage,
                    buttonCenterX - buttonWidth / 2,
                    buttonCenterY - buttonHeight / 2,
                    buttonWidth,
                    buttonHeight
                );
            }
        }
    }
    
    if (gameState === 'gameOver') {
        ctx.imageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        
        if (gameOverScreenImage.complete && gameOverScreenImage.naturalWidth > 0) {
            ctx.drawImage(gameOverScreenImage, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '50px Arial';
            ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        }
        
        if (playAgainButtonImage.complete && playAgainButtonImage.naturalWidth > 0) {
            const buttonCenterX = canvas.width / 2;
            const buttonCenterY = canvas.height - 110;
            
            const buttonAspectRatio = playAgainButtonImage.naturalWidth / playAgainButtonImage.naturalHeight;
            let buttonWidth = 400;
            let buttonHeight = buttonWidth / buttonAspectRatio;
            
            ctx.drawImage(
                playAgainButtonImage,
                buttonCenterX - buttonWidth / 2,
                buttonCenterY - buttonHeight / 2,
                buttonWidth,
                buttonHeight
            );
        }
        
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
    }
    
    if (gameState === 'winScreen') {
        ctx.imageSmoothingEnabled = true;
        ctx.webkitImageSmoothingEnabled = true;
        ctx.mozImageSmoothingEnabled = true;
        
        if (winScreenImage.complete && winScreenImage.naturalWidth > 0) {
            ctx.drawImage(winScreenImage, 0, 0, canvas.width, canvas.height);
        } else {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'white';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = '50px Arial';
            ctx.fillText('You Win!', canvas.width / 2, canvas.height / 2);
            ctx.font = '30px Arial';
            ctx.fillText('Potion Created!', canvas.width / 2, canvas.height / 2 + 50);
        }
        
        if (playAgainButtonImage.complete && playAgainButtonImage.naturalWidth > 0) {
            const buttonCenterX = canvas.width / 2;
            const buttonCenterY = canvas.height - 110;
            const buttonAspectRatio = playAgainButtonImage.naturalWidth / playAgainButtonImage.naturalHeight;
            let buttonWidth = 400;
            let buttonHeight = buttonWidth / buttonAspectRatio;
            
            ctx.drawImage(
                playAgainButtonImage,
                buttonCenterX - buttonWidth / 2,
                buttonCenterY - buttonHeight / 2,
                buttonWidth,
                buttonHeight
            );
        }
        
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
    }
}

let lastTime = 0;
const targetFPS = 60;
const frameTime = 1000 / targetFPS;

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    
    if (deltaTime >= frameTime) {
    update();
    draw();
        lastTime = currentTime - (deltaTime % frameTime);
    }
    
    requestAnimationFrame(gameLoop);
}

let imagesLoaded = 0;
const totalImages = 11;

function checkImagesLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        gameLoop();
    }
}

spriteSheet.onload = checkImagesLoaded;
spriteSheet.onerror = () => {
    console.error('Failed to load sprite sheet');
    checkImagesLoaded(); 
};

mapImage.onload = checkImagesLoaded;
mapImage.onerror = () => {
    console.error('Failed to load map image');
    checkImagesLoaded(); 
};

startScreenImage.onload = checkImagesLoaded;
startScreenImage.onerror = () => {
    console.error('Failed to load start screen image');
    checkImagesLoaded(); 
};

startButtonImage.onload = checkImagesLoaded;
startButtonImage.onerror = () => {
    console.error('Failed to load start button image');
    checkImagesLoaded(); 
};

startSecondLevelImage.onload = checkImagesLoaded;
startSecondLevelImage.onerror = () => {
    console.error('Failed to load level 2 start screen image');
    checkImagesLoaded(); 
};

level2ButtonImage.onload = checkImagesLoaded;
level2ButtonImage.onerror = () => {
    console.error('Failed to load level 2 button image');
    checkImagesLoaded(); 
};

startThirdLevelImage.onload = checkImagesLoaded;
startThirdLevelImage.onerror = () => {
    console.error('Failed to load level 3 start screen image');
    checkImagesLoaded(); 
};

level3ButtonImage.onload = checkImagesLoaded;
level3ButtonImage.onerror = () => {
    console.error('Failed to load level 3 button image');
    checkImagesLoaded(); 
};

winScreenImage.onload = checkImagesLoaded;
winScreenImage.onerror = () => {
    console.error('Failed to load win screen image');
    checkImagesLoaded(); 
};

gameOverScreenImage.onload = checkImagesLoaded;
gameOverScreenImage.onerror = () => {
    console.error('Failed to load game over screen image');
    checkImagesLoaded(); 
};

playAgainButtonImage.onload = checkImagesLoaded;
playAgainButtonImage.onerror = () => {
    console.error('Failed to load play again button image');
    checkImagesLoaded(); 
};
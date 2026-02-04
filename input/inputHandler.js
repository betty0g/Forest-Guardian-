import { images } from '../config/images.js';

export function setupInputHandlers(canvas, gameState, currentLevel, player, bullets, camera, startLevel2, startLevel3, resetGame) {
    const keys = {};

    document.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        handleInput(e.key, player);
    });

    document.addEventListener('keyup', (e) => {
        keys[e.key] = false;
        if (!keys['ArrowUp'] && !keys['ArrowDown'] && !keys['ArrowLeft'] && !keys['ArrowRight'] &&
            !keys['w'] && !keys['a'] && !keys['s'] && !keys['d']) {
            player.xVelocity = 0;
            player.yVelocity = 0;
            if (player.direction === 'down') setAnimationSprites(player, 0, 0);
            else if (player.direction === 'right') setAnimationSprites(player, 3, 3);
            else if (player.direction === 'left') setAnimationSprites(player, 6, 6);
            else if (player.direction === 'up') setAnimationSprites(player, 9, 9);
        }
    });

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        if (gameState.current === 'startScreen') {
            if (checkButtonClick(mouseX, mouseY, canvas, images.startButtonImage, 280)) {
                gameState.current = 'playing';
                canvas.style.cursor = 'crosshair';
                return;
            }
        }

        if (gameState.current === 'levelComplete' && currentLevel.current === 1) {
            if (checkButtonClick(mouseX, mouseY, canvas, images.level2ButtonImage)) {
                startLevel2();
                return;
            }
        }

        if (gameState.current === 'levelComplete' && currentLevel.current === 2) {
            if (checkButtonClick(mouseX, mouseY, canvas, images.level3ButtonImage)) {
                startLevel3();
                return;
            }
        }

        if (gameState.current === 'winScreen' || gameState.current === 'gameOver') {
            if (checkButtonClick(mouseX, mouseY, canvas, images.playAgainButtonImage)) {
                resetGame();
                return;
            }
        }

        if (gameState.current === 'playing') {
            const worldMouseX = mouseX + camera.x;
            const worldMouseY = mouseY + camera.y;
            const playerCenterX = player.x + player.width / 2;
            const playerCenterY = player.y + player.height / 2;
            const dx = worldMouseX - playerCenterX;
            const dy = worldMouseY - playerCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                const speed = 12;
                bullets.push({
                    x: playerCenterX,
                    y: playerCenterY,
                    velocityX: (dx / distance) * speed,
                    velocityY: (dy / distance) * speed,
                    radius: 5,
                    color: '#c084fc', // Light purple
                    type: 'player'
                });
            }
        }
    });
}

function checkButtonClick(mouseX, mouseY, canvas, buttonImage, width = 200) {
    if (!buttonImage.complete || buttonImage.naturalWidth === 0) return false;
    
    const buttonCenterX = canvas.width / 2;
    const buttonCenterY = canvas.height - 110;
    const buttonAspectRatio = buttonImage.naturalWidth / buttonImage.naturalHeight;
    const buttonHeight = width / buttonAspectRatio;

    return mouseX >= buttonCenterX - width / 2 &&
           mouseX <= buttonCenterX + width / 2 &&
           mouseY >= buttonCenterY - buttonHeight / 2 &&
           mouseY <= buttonCenterY + buttonHeight / 2;
}

function handleInput(key, player) {
    switch(key) {
        case 'd':
        case 'ArrowRight':
            if (player.xVelocity !== player.speed) {
                setAnimationSprites(player, 3, 5);
            }
            player.xVelocity = player.speed;
            player.yVelocity = 0;
            player.direction = 'right';
            break;
        case 'a':
        case 'ArrowLeft':
            if (player.xVelocity !== -player.speed) {
                setAnimationSprites(player, 6, 8);
            }
            player.xVelocity = -player.speed;
            player.yVelocity = 0;
            player.direction = 'left';
            break;
        case 'w':
        case 'ArrowUp':
            if (player.yVelocity !== -player.speed) {
                setAnimationSprites(player, 9, 11);
            }
            player.yVelocity = -player.speed;
            player.xVelocity = 0;
            player.direction = 'up';
            break;
        case 's':
        case 'ArrowDown':
            if (player.yVelocity !== player.speed) {
                setAnimationSprites(player, 0, 2);
            }
            player.yVelocity = player.speed;
            player.xVelocity = 0;
            player.direction = 'down';
            break;
    }
}

function setAnimationSprites(player, startFrame, endFrame) {
    player.animationFrames = [startFrame, endFrame];
    player.currentFrame = startFrame;
    player.animationCounter = 0;
}

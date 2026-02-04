import { images } from '../config/images.js';
import { TILE_WIDTH, TILE_HEIGHT, showGrid } from '../config/constants.js';

export function drawStartScreen(ctx, canvas) {
    ctx.imageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.mozImageSmoothingEnabled = true;
    
    if (images.startScreenImage.complete && images.startScreenImage.naturalWidth > 0) {
        ctx.drawImage(images.startScreenImage, 0, 0, canvas.width, canvas.height);
    }
    
    if (images.startButtonImage.complete && images.startButtonImage.naturalWidth > 0) {
        const buttonCenterX = canvas.width / 2;
        const buttonCenterY = canvas.height - 110;
        const buttonAspectRatio = images.startButtonImage.naturalWidth / images.startButtonImage.naturalHeight;
        const buttonWidth = 280;
        const buttonHeight = buttonWidth / buttonAspectRatio;
        
        ctx.drawImage(
            images.startButtonImage,
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

export function drawLevelCompleteScreen(ctx, canvas, currentLevel) {
    ctx.imageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.mozImageSmoothingEnabled = true;
    
    if (currentLevel === 1) {
        if (images.startSecondLevelImage.complete && images.startSecondLevelImage.naturalWidth > 0) {
            ctx.drawImage(images.startSecondLevelImage, 0, 0, canvas.width, canvas.height);
        }
        drawButton(ctx, canvas, images.level2ButtonImage);
    } else if (currentLevel === 2) {
        if (images.startThirdLevelImage.complete && images.startThirdLevelImage.naturalWidth > 0) {
            ctx.drawImage(images.startThirdLevelImage, 0, 0, canvas.width, canvas.height);
        }
        drawButton(ctx, canvas, images.level3ButtonImage);
    }
    
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
}

export function drawWinScreen(ctx, canvas) {
    ctx.imageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.mozImageSmoothingEnabled = true;
    
    if (images.winScreenImage.complete && images.winScreenImage.naturalWidth > 0) {
        ctx.drawImage(images.winScreenImage, 0, 0, canvas.width, canvas.height);
    }
    
    drawButton(ctx, canvas, images.playAgainButtonImage);
    
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
}

export function drawGameOverScreen(ctx, canvas) {
    ctx.imageSmoothingEnabled = true;
    ctx.webkitImageSmoothingEnabled = true;
    ctx.mozImageSmoothingEnabled = true;
    
    if (images.gameOverScreenImage.complete && images.gameOverScreenImage.naturalWidth > 0) {
        ctx.drawImage(images.gameOverScreenImage, 0, 0, canvas.width, canvas.height);
    }
    
    drawButton(ctx, canvas, images.playAgainButtonImage);
    
    ctx.imageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
}

function drawButton(ctx, canvas, buttonImage, width = 200) {
    if (buttonImage.complete && buttonImage.naturalWidth > 0) {
        const buttonCenterX = canvas.width / 2;
        const buttonCenterY = canvas.height - 110;
        const buttonAspectRatio = buttonImage.naturalWidth / buttonImage.naturalHeight;
        const buttonHeight = width / buttonAspectRatio;
        
        ctx.drawImage(
            buttonImage,
            buttonCenterX - width / 2,
            buttonCenterY - buttonHeight / 2,
            width,
            buttonHeight
        );
    }
}

export function drawGameWorld(ctx, canvas, camera, mapWidth, mapHeight, trees, bushes, collectibles, enemies, bullets, player, spriteSheet, currentLevel, cauldron, potionState, invincibilityTimer) {
    if (images.mapImage.complete && images.mapImage.naturalWidth > 0) {
        ctx.drawImage(images.mapImage, -camera.x, -camera.y, mapWidth, mapHeight);
    }

    if (showGrid) {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        for (let i = 0; i <= mapWidth; i += TILE_WIDTH) {
            ctx.beginPath();
            ctx.moveTo(i - camera.x, 0);
            ctx.lineTo(i - camera.x, canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i <= mapHeight; i += TILE_HEIGHT) {
            ctx.beginPath();
            ctx.moveTo(0, i - camera.y);
            ctx.lineTo(canvas.width, i - camera.y);
            ctx.stroke();
        }
    }

    trees.forEach(tree => tree.draw(ctx, camera.x, camera.y));
    bushes.forEach(bush => bush.draw(ctx, camera.x, camera.y));

    if (currentLevel === 3 && cauldron) {
        cauldron.draw(ctx, camera.x, camera.y);
    }

    collectibles.forEach(collectible => collectible.draw(ctx, camera.x, camera.y));
    enemies.forEach(enemy => enemy.draw(ctx, camera.x, camera.y));

    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x - camera.x, bullet.y - camera.y, bullet.radius, 0, Math.PI * 2);
        ctx.fill();
    });

    if (invincibilityTimer === 0 || Math.floor(invincibilityTimer / 5) % 2 === 0) {
        if (spriteSheet.complete && spriteSheet.naturalWidth > 0) {
            const framePos = getFrameFromSpriteSheet(player.currentFrame, player.spriteWidth, player.spriteHeight);
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

    if (currentLevel === 3 && potionState.active && potionState.alpha > 0) {
        if (images.potionImage.complete && images.potionImage.naturalWidth > 0) {
            ctx.save();
            ctx.globalAlpha = potionState.alpha;
            const potionSize = 200;
            ctx.drawImage(
                images.potionImage,
                canvas.width / 2 - potionSize / 2,
                canvas.height / 2 - potionSize / 2,
                potionSize,
                potionSize
            );
            ctx.restore();
        }
    }
}

export function drawHUD(ctx, canvas, hearts, inventory, required, invincibilityTimer) {
    ctx.fillStyle = '#FF0000';
    ctx.font = '40px Arial';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    let heartsText = '';
    for (let i = 0; i < hearts; i++) {
        heartsText += '❤ ';
    }
    ctx.fillText(heartsText, 10, 10);

    const hudHeight = 90;
    const hudY = canvas.height - hudHeight;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, hudY, canvas.width, hudHeight);

    const typesOrder = ['leaf', 'crystal', 'mushroom', 'sage'];
    const icons = {
        leaf: images.leafIcon,
        crystal: images.crystalIcon,
        mushroom: images.mushroomIcon,
        sage: images.sageIcon
    };
    const typeLabels = {
        leaf: 'Leaf',
        crystal: 'Crystal',
        mushroom: 'Mushroom',
        sage: 'Sage'
    };
    const slotWidth = canvas.width / typesOrder.length;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '16px "Pixelify Sans", sans-serif';

    typesOrder.forEach((type, index) => {
        const centerX = slotWidth * index + slotWidth / 2;
        const iconSize = 40;
        const icon = icons[type];

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.strokeRect(slotWidth * index + 10, hudY + 10, slotWidth - 20, hudHeight - 20);

        ctx.fillStyle = 'white';
        ctx.font = '14px "Pixelify Sans", sans-serif';
        ctx.fillText(typeLabels[type], centerX, hudY + 15);

        if (icon && icon.complete && icon.naturalWidth > 0) {
            ctx.drawImage(icon, centerX - iconSize / 2, hudY + 25, iconSize, iconSize);
        }

        ctx.fillStyle = 'white';
        ctx.font = '16px "Pixelify Sans", sans-serif';
        const current = inventory[type] || 0;
        const need = required[type] || 0;
        ctx.fillText(`${current} / ${need}`, centerX, hudY + hudHeight - 25);
    });
}

function getFrameFromSpriteSheet(frameIndex, spriteWidth, spriteHeight) {
    const framesPerRow = 3;
    const row = Math.floor(frameIndex / framesPerRow);
    const col = frameIndex % framesPerRow;
    return {
        x: col * spriteWidth,
        y: row * spriteHeight
    };
}

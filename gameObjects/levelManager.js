import { MAP_COLS, MAP_ROWS, TILE_WIDTH, TILE_HEIGHT, getCurrentTilemap } from '../config/constants.js';
import { Collectible } from './collectible.js';
import { Enemy } from './enemy.js';
import { Tree } from './tree.js';
import { Bush } from './bush.js';
import { Cauldron } from './cauldron.js';

export function initCollectibles(collectibles, required, currentLevel) {
    collectibles.length = 0;
    const currentTilemap = getCurrentTilemap(currentLevel);

    for (const type in required) {
        const needed = required[type];
        for (let i = 0; i < needed; i++) {
            let attempts = 0;
            let x, y;
            do {
                const col = Math.floor(Math.random() * MAP_COLS);
                const row = Math.floor(Math.random() * MAP_ROWS);
                if (currentTilemap[row] && currentTilemap[row][col] === 0) {
                    x = col * TILE_WIDTH + TILE_WIDTH / 2;
                    y = row * TILE_HEIGHT + TILE_HEIGHT / 2;
                    break;
                }
                attempts++;
            } while (attempts < 500);
            
            if (x === undefined || y === undefined) {
                const col = Math.floor(Math.random() * MAP_COLS);
                const row = Math.floor(Math.random() * MAP_ROWS);
                x = col * TILE_WIDTH + TILE_WIDTH / 2;
                y = row * TILE_HEIGHT + TILE_HEIGHT / 2;
            }
            
            collectibles.push(new Collectible(x, y, type));
        }
    }
}

export function initTreesAndBushes(trees, bushes, currentLevel) {
    trees.length = 0;
    bushes.length = 0;
    
    const currentTilemap = getCurrentTilemap(currentLevel);
    const processed = Array(MAP_ROWS).fill(null).map(() => Array(MAP_COLS).fill(false));
    
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            if (processed[row][col]) continue;
            
            const tileType = currentTilemap[row][col];
            
            if (tileType === 2) {
                if (col + 1 < MAP_COLS && row + 1 < MAP_ROWS &&
                    currentTilemap[row][col + 1] === 2 &&
                    currentTilemap[row + 1][col] === 2 &&
                    currentTilemap[row + 1][col + 1] === 2) {
                    trees.push(new Tree(col, row, TILE_WIDTH, TILE_HEIGHT));
                    processed[row][col] = true;
                    processed[row][col + 1] = true;
                    processed[row + 1][col] = true;
                    processed[row + 1][col + 1] = true;
                } else {
                    bushes.push(new Bush(col, row, TILE_WIDTH, TILE_HEIGHT));
                    processed[row][col] = true;
                }
            } else if (tileType === 1) {
                bushes.push(new Bush(col, row, TILE_WIDTH, TILE_HEIGHT));
                processed[row][col] = true;
            }
        }
    }
}

export function initEnemies(enemies, currentLevel, mapWidth, mapHeight) {
    enemies.length = 0;
    
    const enemyCount = currentLevel === 1 ? 3 : (currentLevel === 2 ? 3 : 3);
    const enemyPositions = [
        { x: mapWidth * 0.25, y: mapHeight * 0.25 },
        { x: mapWidth * 0.75, y: mapHeight * 0.5 },
        { x: mapWidth * 0.5, y: mapHeight * 0.75 },
        { x: mapWidth * 0.15, y: mapHeight * 0.6 },
        { x: mapWidth * 0.85, y: mapHeight * 0.3 }
    ];
    
    const enemySpeed = currentLevel === 1 ? 1.5 : (currentLevel === 2 ? 2 : 2.5);
    const enemyHealth = currentLevel === 1 ? 4 : 3;
    
    for (let i = 0; i < enemyCount; i++) {
        const pos = enemyPositions[i];
        // Level 3: first 2 enemies can shoot, last one cannot
        const canShoot = currentLevel === 3 ? (i < 2) : true;
        enemies.push(new Enemy(pos.x, pos.y, enemySpeed, enemyHealth, canShoot));
    }
}

export function initCauldron(cauldron, currentLevel) {
    if (currentLevel !== 3) return null;
    
    const currentTilemap = getCurrentTilemap(currentLevel);
    let attempts = 0;
    let x, y;
    
    do {
        const col = Math.floor(Math.random() * MAP_COLS);
        const row = Math.floor(Math.random() * MAP_ROWS);
        if (currentTilemap[row] && currentTilemap[row][col] === 0) {
            x = col * TILE_WIDTH;
            y = row * TILE_HEIGHT;
            break;
        }
        attempts++;
    } while (attempts < 500);
    
    if (x !== undefined && y !== undefined) {
        return new Cauldron(x, y);
    }
    return null;
}

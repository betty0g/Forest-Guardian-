class Enemy {
    // Static enemy image 
    static enemyImage = null;
    
    constructor(x, y, speed = 1.5, maxHealth = 4, canShoot = true) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
        this.speed = speed;
        this.maxHealth = maxHealth;
        this.health = maxHealth;
        this.detectionRange = 700; // Only chase player if within this distance
        this.shootCooldown = 0; // Timer for shooting
        this.shootInterval = 90; // Shoot every 90 frames (1.5 seconds at 60fps)
        this.canShoot = canShoot; // Whether this enemy can shoot
        
        // Load enemy image if not already loaded
        if (!Enemy.enemyImage) {
            Enemy.enemyImage = new Image();
            Enemy.enemyImage.src = 'images/enemy.png';
        }
    }

    update(player, mapWidth, mapHeight, bullets, currentLevel) {
        // Calculate direction to player
        const dx = (player.x + player.width / 2) - (this.x + this.width / 2);
        const dy = (player.y + player.height / 2) - (this.y + this.height / 2);
        
        // Calculate distance
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only move towards player if within detection range
        if (distance > 0 && distance <= this.detectionRange) {
            const moveX = (dx / distance) * this.speed;
            const moveY = (dy / distance) * this.speed;
            
            // Update position
            this.x += moveX;
            this.y += moveY;
            
            // Keep enemy within map bounds
            this.x = Math.max(0, Math.min(this.x, mapWidth - this.width));
            this.y = Math.max(0, Math.min(this.y, mapHeight - this.height));
            
            // Shoot at player in level 2 and 3 (only if this enemy can shoot)
            if ((currentLevel === 2 || currentLevel === 3) && this.canShoot) {
                this.shootCooldown--;
                if (this.shootCooldown <= 0) {
                    this.shoot(player, bullets);
                    // Level 2 shoots less frequently (longer interval)
                    const shootInterval = currentLevel === 2 ? 120 : this.shootInterval; // Level 2: 2 seconds, Level 3: 1.5 seconds
                    this.shootCooldown = shootInterval;
                }
            }
        }
    }
    
    shoot(player, bullets) {
        // Calculate direction from enemy to player
        const enemyCenterX = this.x + this.width / 2;
        const enemyCenterY = this.y + this.height / 2;
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const dx = playerCenterX - enemyCenterX;
        const dy = playerCenterY - enemyCenterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            // Normalize and set bullet speed (slower than player bullets)
            const speed = 8; // Enemy bullet speed
            const velocityX = (dx / distance) * speed;
            const velocityY = (dy / distance) * speed;
            
            // Create enemy bullet
            bullets.push({
                x: enemyCenterX,
                y: enemyCenterY,
                velocityX,
                velocityY,
                radius: 5,
                color: '#ff6b00', // Orange color for enemy bullets
                type: 'enemy' // Mark as enemy bullet
            });
        }
    }

    draw(ctx, cameraX, cameraY) {
        // Draw health bar above enemy
        this.drawHealthBar(ctx, cameraX, cameraY);
        
        // Draw enemy PNG image if loaded, otherwise fallback to rectangle
        if (Enemy.enemyImage && Enemy.enemyImage.complete && Enemy.enemyImage.naturalWidth > 0) {
            ctx.drawImage(
                Enemy.enemyImage,
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        } else {
            // Fallback to rectangle if image not loaded yet
            ctx.fillStyle = this.color;
            ctx.fillRect(
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
            
            // Optional: Add a simple outline
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        }
    }
    
    drawHealthBar(ctx, cameraX, cameraY) {
        // Only draw health bar if enemy is alive
        if (this.health <= 0) return;
        
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x - cameraX;
        const barY = this.y - cameraY - 8; // Position above enemy
        
        // Calculate health percentage
        const healthPercent = this.health / this.maxHealth;
        const filledWidth = barWidth * healthPercent;
        
        // Draw background (dark red/black)
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Draw health bar (red, goes left as health decreases)
        ctx.fillStyle = '#FF0000'; // Red color
        ctx.fillRect(barX, barY, filledWidth, barHeight);
        
        // Optional: Add border
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    checkCollision(player) {
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }
}

export { Enemy };

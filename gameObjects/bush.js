class Bush {
    // Static bush image 
    static bushImage = null;
    
    constructor(tileCol, tileRow, tileWidth, tileHeight) {
        // Bushes take 1x1 tile
        this.tileCol = tileCol;
        this.tileRow = tileRow;
        this.x = tileCol * tileWidth;
        this.y = tileRow * tileHeight;
        this.width = tileWidth;  // 1 tile wide
        this.height = tileHeight; // 1 tile tall (visual height)
        
        // Collision box is only at the top portion (40-50% of height)
        // Bottom part has no collision - player can overlap the lower part (walk under)
        this.collisionWidth = this.width * 0.5; // 50% of visual width (centered)
        this.collisionHeight = this.height * 0.45; // 45% of visual height (top portion only)
        this.collisionX = this.x + (this.width - this.collisionWidth) / 2; // Centered horizontally
        this.collisionY = this.y; // Collision starts at top (top 45% only)
        
        // Load bush image if not already loaded
        if (!Bush.bushImage) {
            Bush.bushImage = new Image();
            Bush.bushImage.src = 'images/bush.png';
        }
    }

    draw(ctx, cameraX, cameraY) {
        // Ensure image smoothing is disabled for crisp pixel art
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        
        // Draw bush PNG image if loaded, otherwise fallback to circle
        if (Bush.bushImage && Bush.bushImage.complete && Bush.bushImage.naturalWidth > 0) {
            ctx.drawImage(
                Bush.bushImage,
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        } else {
            // Fallback to green circle if image not loaded yet
            ctx.fillStyle = '#228B22'; // Forest green color for bush
            ctx.beginPath();
            ctx.arc(
                this.x - cameraX + this.width / 2,
                this.y - cameraY + this.height / 2,
                Math.min(this.width, this.height) / 2,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Optional: Add a simple outline
            ctx.strokeStyle = '#006400';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    checkCollision(x, y, width, height) {
        // Collision only in top 45% of bush height
        // Bottom 55% has no collision - player can walk under/overlap it
        return this.collisionX < x + width &&
               this.collisionX + this.collisionWidth > x &&
               this.collisionY < y + height &&
               this.collisionY + this.collisionHeight > y;
    }
}

export { Bush };

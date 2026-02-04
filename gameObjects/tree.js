class Tree {
    // Static tree image 
    static treeImage = null;
    
    constructor(tileCol, tileRow, tileWidth, tileHeight) {
        // Trees take 2x2 tiles, so position at the top-left corner of the 2x2 area
        this.tileCol = tileCol;
        this.tileRow = tileRow;
        this.x = tileCol * tileWidth;
        this.y = tileRow * tileHeight;
        this.width = tileWidth * 2;  // 2 tiles wide
        this.height = tileHeight * 2; // 2 tiles tall (visual height)
        
        // Collision box is only at the top portion (40-50% of height)
        // Bottom part has no collision - player can overlap the lower part (walk under)
        this.collisionWidth = this.width * 0.6; // 60% of visual width (centered)
        this.collisionHeight = this.height * 0.45; // 45% of visual height (top portion only)
        this.collisionX = this.x + (this.width - this.collisionWidth) / 2; // Centered horizontally
        this.collisionY = this.y; // Collision starts at top (top 45% only)
        
        // Load tree image if not already loaded
        if (!Tree.treeImage) {
            Tree.treeImage = new Image();
            Tree.treeImage.src = 'images/tree2.png';
        }
    }

    draw(ctx, cameraX, cameraY) {
        // Ensure image smoothing is disabled for crisp pixel art
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        
        // Draw tree PNG image if loaded, otherwise fallback to rectangle
        if (Tree.treeImage && Tree.treeImage.complete && Tree.treeImage.naturalWidth > 0) {
            ctx.drawImage(
                Tree.treeImage,
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        } else {
            // Fallback to rectangle if image not loaded yet
            ctx.fillStyle = '#8B4513'; // Brown color for tree
            ctx.fillRect(
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
            
            // Optional: Add a simple outline
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        }
    }

    checkCollision(x, y, width, height) {
        // Collision only in top 45% of tree height
        // Bottom 55% has no collision - player can walk under/overlap it
        return this.collisionX < x + width &&
               this.collisionX + this.collisionWidth > x &&
               this.collisionY < y + height &&
               this.collisionY + this.collisionHeight > y;
    }
}

export { Tree };

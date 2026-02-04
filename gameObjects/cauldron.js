class Cauldron {
    // Static cauldron image 
    static cauldronImage = null;
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 120;  // Same size as a tile
        this.height = 120; // Same size as a tile
        
        // Load cauldron image if not already loaded
        if (!Cauldron.cauldronImage) {
            Cauldron.cauldronImage = new Image();
            Cauldron.cauldronImage.src = 'images/cauldron.png';
        }
    }

    draw(ctx, cameraX, cameraY) {
        // Draw cauldron PNG image if loaded, otherwise fallback to rectangle
        if (Cauldron.cauldronImage && Cauldron.cauldronImage.complete && Cauldron.cauldronImage.naturalWidth > 0) {
            ctx.drawImage(
                Cauldron.cauldronImage,
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
        } else {
            // Fallback to rectangle if image not loaded yet
            ctx.fillStyle = '#4A4A4A'; // Dark gray color for cauldron
            ctx.fillRect(
                this.x - cameraX,
                this.y - cameraY,
                this.width,
                this.height
            );
            
            // Optional: Add a simple outline
            ctx.strokeStyle = '#2A2A2A';
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
        return this.x < x + width &&
               this.x + this.width > x &&
               this.y < y + height &&
               this.y + this.height > y;
    }
}

export { Cauldron };

class Collectible {
    // Static images 
    static leafImage = null;
    static crystalImage = null;
    static mushroomImage = null;
    static sageImage = null;
    
    constructor(x, y, type = 'leaf') {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.type = type;
        
        // Load images if not already loaded
        if (type === 'leaf' && !Collectible.leafImage) {
            Collectible.leafImage = new Image();
            Collectible.leafImage.src = 'images/leaf.png';
        }
        if (type === 'crystal' && !Collectible.crystalImage) {
            Collectible.crystalImage = new Image();
            Collectible.crystalImage.src = 'images/crystal.png';
        }
        if (type === 'mushroom' && !Collectible.mushroomImage) {
            Collectible.mushroomImage = new Image();
            Collectible.mushroomImage.src = 'images/mushroom.png';
        }
        if (type === 'sage' && !Collectible.sageImage) {
            Collectible.sageImage = new Image();
            Collectible.sageImage.src = 'images/sage.png';
        }
        
        // Define each ingredient's properties
        this.ingredientData = {
            leaf: { color: '#00FF00', name: 'Leaf' },
            crystal: { color: '#6B5FFF', name: 'Crystal' },
            mushroom: { color: '#FF4444', name: 'Mushroom' },
            sage: { color: '#FFD700', name: 'Sage' }
        };
    }

    draw(ctx, cameraX, cameraY) {
        const data = this.ingredientData[this.type];
        ctx.fillStyle = data.color;
        
        // Draw different shapes based on type
        switch(this.type) {
            case 'leaf':
                this.drawLeaf(ctx, cameraX, cameraY);
                break;
            case 'crystal':
                this.drawCrystal(ctx, cameraX, cameraY);
                break;
            case 'mushroom':
                this.drawMushroom(ctx, cameraX, cameraY);
                break;
            case 'sage':
                this.drawSage(ctx, cameraX, cameraY);
                break;
        }
    }

    drawLeaf(ctx, cameraX, cameraY) {
        // Draw leaf PNG image if loaded, otherwise fallback to green ellipse
        if (Collectible.leafImage && Collectible.leafImage.complete && Collectible.leafImage.naturalWidth > 0) {
            ctx.drawImage(
                Collectible.leafImage,
                this.x - cameraX - this.width / 2,
                this.y - cameraY - this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback to green ellipse if image not loaded yet
            ctx.beginPath();
            ctx.ellipse(this.x - cameraX, this.y - cameraY, 8, 12, 0.3, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawCrystal(ctx, cameraX, cameraY) {
        // Draw crystal PNG image if loaded, otherwise fallback to purple rectangle
        if (Collectible.crystalImage && Collectible.crystalImage.complete && Collectible.crystalImage.naturalWidth > 0) {
            ctx.drawImage(
                Collectible.crystalImage,
                this.x - cameraX - this.width / 2,
                this.y - cameraY - this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback to purple rectangle if image not loaded yet
            ctx.fillRect(this.x - cameraX - this.width / 4, this.y - cameraY - this.height / 2.5, this.width / 2, this.height * 0.8);
        }
    }

    drawMushroom(ctx, cameraX, cameraY) {
        // Draw mushroom PNG image if loaded, otherwise fallback to red circle and rectangle
        if (Collectible.mushroomImage && Collectible.mushroomImage.complete && Collectible.mushroomImage.naturalWidth > 0) {
            ctx.drawImage(
                Collectible.mushroomImage,
                this.x - cameraX - this.width / 2,
                this.y - cameraY - this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback to red circle and rectangle if image not loaded yet
            ctx.beginPath();
            ctx.arc(this.x - cameraX, this.y - cameraY - this.height / 4, this.width / 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(this.x - cameraX - this.width / 8, this.y - cameraY - this.height / 4, this.width / 4, this.height / 2);
        }
    }

    drawSage(ctx, cameraX, cameraY) {
        // Draw sage PNG image if loaded, otherwise fallback to gold rectangles
        if (Collectible.sageImage && Collectible.sageImage.complete && Collectible.sageImage.naturalWidth > 0) {
            ctx.drawImage(
                Collectible.sageImage,
                this.x - cameraX - this.width / 2,
                this.y - cameraY - this.height / 2,
                this.width,
                this.height
            );
        } else {
            // Fallback to gold rectangles if image not loaded yet
            for (let i = -this.width / 3; i <= this.width / 3; i += this.width / 6) {
                ctx.fillRect(this.x - cameraX + i, this.y - cameraY - this.height / 2, this.width / 10, this.height * 0.6);
            }
        }
    }

    checkCollision(player) {
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }
}

export {Collectible}
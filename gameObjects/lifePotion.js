class LifePotion {
    static potionImage = null;
    
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        
        if (!LifePotion.potionImage) {
            LifePotion.potionImage = new Image();
            LifePotion.potionImage.src = 'images/lifepotion.png';
        }
    }
    
    draw(ctx, cameraX, cameraY) {
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        
        if (LifePotion.potionImage && LifePotion.potionImage.complete && LifePotion.potionImage.naturalWidth > 0) {
            ctx.drawImage(
                LifePotion.potionImage,
                this.x - cameraX - this.width / 2,
                this.y - cameraY - this.height / 2,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(this.x - cameraX, this.y - cameraY, this.width / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    checkCollision(player) {
        const potionLeft = this.x - this.width / 2;
        const potionRight = this.x + this.width / 2;
        const potionTop = this.y - this.height / 2;
        const potionBottom = this.y + this.height / 2;
        
        return potionLeft < player.x + player.width &&
               potionRight > player.x &&
               potionTop < player.y + player.height &&
               potionBottom > player.y;
    }
}

export { LifePotion };

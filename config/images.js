export const images = {
    spriteSheet: new Image(),
    mapImage: new Image(),
    startScreenImage: new Image(),
    startButtonImage: new Image(),
    startSecondLevelImage: new Image(),
    level2ButtonImage: new Image(),
    startThirdLevelImage: new Image(),
    level3ButtonImage: new Image(),
    winScreenImage: new Image(),
    gameOverScreenImage: new Image(),
    playAgainButtonImage: new Image(),
    leafIcon: new Image(),
    crystalIcon: new Image(),
    mushroomIcon: new Image(),
    sageIcon: new Image(),
    potionImage: new Image()
};

images.spriteSheet.src = 'images/spritesheetWitch.png';
images.mapImage.src = 'images/map1.png';
images.startScreenImage.src = 'images/startscreen.png';
images.startButtonImage.src = 'images/startbtn.png';
images.startSecondLevelImage.src = 'images/startsecondlevel.png';
images.level2ButtonImage.src = 'images/level2btn.png';
images.startThirdLevelImage.src = 'images/startthirdlevel.png';
images.level3ButtonImage.src = 'images/level3btn.png';
images.winScreenImage.src = 'images/winscreen.png';
images.gameOverScreenImage.src = 'images/gameoverscreen.png';
images.playAgainButtonImage.src = 'images/playagainbtn.png';
images.leafIcon.src = 'images/leaf.png';
images.crystalIcon.src = 'images/crystal.png';
images.mushroomIcon.src = 'images/mushroom.png';
images.sageIcon.src = 'images/sage.png';
images.potionImage.src = 'images/potion.png';

export const totalImages = Object.keys(images).length;

export function setupImageLoaders(checkImagesLoaded) {
    Object.values(images).forEach(image => {
        image.onload = checkImagesLoaded;
        image.onerror = () => {
            console.error(`Failed to load image: ${image.src}`);
            checkImagesLoaded();
        };
    });
}

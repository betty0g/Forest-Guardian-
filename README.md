# Forest Guardian

A 2D top-down action-adventure game built with HTML5 Canvas and JavaScript. Play as a witch guardian collecting magical ingredients across three levels while fighting enemies and avoiding obstacles.

## 🎮 Game Overview

**Forest Guardian** is a pixel-art style game where players control a witch character navigating through a forest environment. The objective is to collect ingredients (leaves, crystals, mushrooms, and sage) across three progressively challenging levels, defeat enemies, and ultimately create a magical potion to save the forest.

### Core Gameplay
- **Movement**: Use arrow keys or WASD to move the player
- **Combat**: Click to shoot projectiles at enemies
- **Collection**: Gather required ingredients to progress
- **Survival**: Avoid enemy attacks and maintain your health (4 hearts)
- **Progression**: Complete three levels with increasing difficulty

## 🎯 Main Features

### Game Mechanics
1. **Three Progressive Levels**
   - Level 1: Introduction with basic enemies (3 enemies, speed 1.5)
   - Level 2: Increased difficulty with shooting enemies (3 enemies, speed 2)
   - Level 3: Final challenge with mixed enemy types (2 shooting, 1 non-shooting, speed 2.5)

2. **Combat System**
   - Player shooting with light purple projectiles
   - Enemy AI with detection range and pathfinding
   - Enemy shooting in levels 2 and 3
   - Bullet collision with environment (trees and bushes)

3. **Health System**
   - 4 hearts for player health
   - Invincibility frames after taking damage
   - Life potions spawn in levels 2 and 3 when health is lost
   - Life potions restore all hearts

4. **Collectible System**
   - Four ingredient types: Leaf, Crystal, Mushroom, Sage
   - Level-specific requirements
   - Visual inventory HUD showing collected items

5. **Environment Interaction**
   - Collision detection with trees and bushes
   - Trees allow walking under lower portion
   - Bullets collide with obstacles
   - Camera system that follows the player

6. **Visual Features**
   - Pixel art style with image smoothing disabled
   - Animated player sprite with directional movement
   - Health bars for enemies
   - Pixel art hearts with borders
   - Multiple screen states (start, level complete, win, game over)

## 🏗️ Code Organization

### Project Structure
```
Forest Guardian/
├── config/
│   ├── constants.js      # Game constants, tilemaps, map dimensions
│   └── images.js         # Image loading and management
├── gameObjects/
│   ├── bush.js           # Bush obstacle class
│   ├── cauldron.js       # Cauldron interaction for level 3
│   ├── collectible.js    # Collectible items (ingredients)
│   ├── enemy.js          # Enemy AI and behavior
│   ├── levelManager.js   # Level initialization functions
│   ├── lifePotion.js     # Health restoration items
│   └── tree.js           # Tree obstacle class
├── images/               # All game assets (sprites, maps, UI)
├── game.js               # Main game loop and logic
├── index.html            # HTML entry point
└── style.css             # Styling
```

### Key Classes and Modules

#### `game.js` - Main Game Engine
- **Game State Management**: Controls different game states (startScreen, playing, levelComplete, win, gameOver)
- **Game Loop**: Frame-rate independent update loop with delta time
- **Input Handling**: Keyboard and mouse event listeners
- **Update Logic**: Player movement, collision detection, bullet physics, enemy updates
- **Rendering**: Draws all game objects, UI elements, and screens

#### `gameObjects/enemy.js` - Enemy Class
- **AI Behavior**: Pathfinding towards player within detection range
- **Shooting System**: Configurable shooting intervals per level
- **Health System**: Health bars and damage handling
- **Collision Detection**: AABB collision with player

#### `gameObjects/levelManager.js` - Level Initialization
- **`initCollectibles()`**: Spawns collectibles on walkable tiles
- **`initTreesAndBushes()`**: Parses tilemap to create obstacles
- **`initEnemies()`**: Creates enemies with level-specific properties
- **`initCauldron()`**: Spawns cauldron for level 3

#### `config/constants.js` - Configuration
- **Tilemaps**: Array-based level layouts (0=walkable, 1=bush, 2=tree)
- **Map Dimensions**: 24x18 tile grid, 120x120 pixels per tile
- **Game Constants**: Invincibility duration, grid display toggle

## 🔧 Technical Implementation

### Game Loop
The game uses `requestAnimationFrame` with delta time for smooth, frame-rate independent updates:

```javascript
function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    if (deltaTime >= frameTime) {
        update();
        draw();
        lastTime = currentTime - (deltaTime % frameTime);
    }
    requestAnimationFrame(gameLoop);
}
```

**Key Features:**
- Target FPS: 60
- Delta time calculation for consistent speed
- Frame time limiting to prevent excessive updates

### Input System
- **Keyboard Input**: Arrow keys and WASD for movement
- **Mouse Input**: Click to shoot, button interactions
- **Prevent Default**: Arrow keys prevent browser scrolling
- **Enter Key**: Advance to next level on level complete screens

### Collision Detection

#### Player-Environment Collision
- **AABB (Axis-Aligned Bounding Box)**: Used for player vs. trees/bushes
- **Partial Collision**: Trees only collide in top 45% of height
- **Boundary Checking**: Prevents player from leaving map bounds

#### Bullet Collision
- **Circle-Rectangle**: Bullets use radius-based collision
- **Player Bullets**: Hit enemies and obstacles
- **Enemy Bullets**: Hit player and obstacles
- **Environment Collision**: Bullets stop when hitting trees/bushes

#### Enemy-Player Collision
- **AABB Detection**: Simple rectangle overlap
- **Damage System**: Reduces hearts, triggers invincibility
- **Respawn Logic**: Enemies respawn when killed

### Camera System
- **Follow Camera**: Centers on player position
- **Boundary Clamping**: Prevents camera from showing outside map
- **Viewport Culling**: Only renders objects within camera view

### Rendering Optimizations
- **Viewport Culling**: Objects outside camera view are not drawn
- **Image Smoothing Disabled**: Maintains pixel art aesthetic
- **Static Image Loading**: Shared image instances across objects
- **Conditional Rendering**: Only draws when game state allows

## 🎨 Game Features Explained

### Enemy AI
- **Detection Range**: 700 pixels
- **Pathfinding**: Moves directly towards player when in range
- **Shooting Logic**: 
  - Level 2: Shoots every 120 frames (2 seconds)
  - Level 3: Shoots every 90 frames (1.5 seconds)
- **Health System**: 
  - Level 1: 4 health points
  - Levels 2-3: 3 health points

### Life Potion System
- **Spawn Trigger**: When player loses a heart in levels 2-3
- **Spawn Location**: Near player using polar coordinates
- **Validation**: Checks for walkable tiles before spawning
- **Effect**: Restores all 4 hearts

### Level Progression
1. **Level 1**: Collect all ingredients, defeat 3 enemies
2. **Level 2**: Collect ingredients, defeat 3 shooting enemies, spawns life potions
3. **Level 3**: Collect ingredients, interact with cauldron, defeat 2 shooting + 1 non-shooting enemy, create potion to win

### Animation System
- **Sprite Sheet**: 4x3 grid (12 frames total)
- **Directional Animation**: Different frames for up, down, left, right
- **Animation Speed**: 0.1 frame increment per update
- **Idle State**: Single frame when not moving

## 🚀 Setup and Running

### Local Development
1. Clone or download the repository
2. Ensure all files are in the same directory structure
3. Open `index.html` in a modern web browser
4. No build process required - pure JavaScript modules

### GitLab Pages Deployment
1. Push code to GitLab repository
2. Enable GitLab Pages in repository settings
3. Set root directory to repository root
4. Access via GitLab Pages URL

### Browser Requirements
- Modern browser with ES6 module support
- Canvas API support
- JavaScript enabled

## 📝 Controls

- **Arrow Keys** or **WASD**: Move player
- **Mouse Click**: Shoot projectiles
- **Enter**: Advance to next level (on level complete screens)
- **Mouse**: Click buttons on UI screens

## 🎯 Game Objectives

### Level 1
- Collect: 3 Leaves, 2 Mushrooms, 1 Sage, 3 Crystals
- Defeat: 3 enemies (4 health each, speed 1.5)

### Level 2
- Collect: 3 Leaves, 2 Mushrooms, 1 Sage, 3 Crystals
- Defeat: 3 enemies (3 health each, speed 2, can shoot)

### Level 3
- Collect: 3 Leaves, 2 Mushrooms, 1 Sage, 3 Crystals
- Defeat: 2 shooting enemies + 1 non-shooting enemy (3 health each, speed 2.5)
- Interact with cauldron to create potion and win

## 🐛 Known Issues / Future Improvements

- No gravity system (top-down game)
- Fixed map sizes (no procedural generation)
- Limited enemy variety
- No sound effects or music
- No save/load system

## 📄 License

This project is created for educational purposes.

## 👤 Author

Created as part of a game development course project.

---

**Note**: This game uses ES6 modules and requires a local server or GitLab Pages for proper execution due to CORS restrictions with file:// protocol.

function main()
{/*
    Scrolling Platformer Starter
        Provides the building blocks for making a 2D game that scrolls both
        horizontally and vertically. The 'levels' variable serves as a test
        for this functionality.
        
    Directions for the player:
        Press left or right arrows to move horizontally
        Press up to jump
        Press down to go through a door
 
  
/*  Based on:
 *
 *             _     _         
 * /\   /\___ (_) __| |        
 * \ \ / / _ \| |/ _` |        
 *  \ V / (_) | | (_| | Games
 *   \_/ \___/|_|\____|        
 * -  - - - - - - - - - - - -
 * 
 * Title: Platformr Example
 * Author: Thomas L.
 * 
 * You may use this in your own projects without credit.
 * 
 * Based on this example but translated into Javascript: 
 *  http://www.nandnor.net/?p=64
 * 
 *
/*
***  Changes made to the original ***

** Refactored to make game resizeable (needs a browser refresh/reload)

** Refactored to decrease function size

** Converted to side-scroller thanks to Eric Sursa:
    https://www.khanacademy.org/computer-programming/camera-following-via-translate/5688637541

** Got lazy and switched to KhanAcademy images instead of drawing

** Added crop function to fix strangely shaped block images.
    
** Made the height and width of the blocks and player, as well as jump speed,
    proportional to the selected canvas width and height.

** Added platforms going up and a ceiling to illustrate that the game
    scrolls both horizontally and vertically.
    
** Removed the debug menu in favor of adding println or debug while debugging.

** Added a pause feature - press 'p' to pause

** Added a blockType attribute for future functionality to special types of blocks

** Added reward block and spent reward block type

** Added GameObject modeled after the player object for monsters, moving treasure, etc.

** Refactored player collision detection into stand-alone collision detection functions
    for detecting collisions with monsters and other game objects

** Added a green gem reward that makes Hoppy cool and added to gameObjects array

** Added Marcimus as a monster to a monsters array

** Added termination sequences for both the player and monsters

** Refactored all objects to inherit from one base object.

** Added Mr. Pants who stays on his platform

** Converting to grid-based graphics for ease of level-building

** Added doors to move between levels

** Added temporary (3 sec) invincibility after being damaged
*/
var game = function() {
    var paused = false;
    var keys = [];
    var images = {};
    var level = '1';
    var levelChanged = false;
    var lvlW, lvlH, unitWidth;
    
    var cropBlock = function(img) {
        var croppedImage;
    
        background(255, 0, 0, 0);
        image(img, 0, 0);
        croppedImage = get(1, 52, 97, 76);
    
        return croppedImage;
    };
    var createDoorImage = function() {
        image(images.woodBlock, 0, 0, 40, 40);
        image(images.woodBlock, 0, 40, 40, 40);
        noStroke();
        fill(79, 53, 13);
        ellipse(7, 42, 7, 7);
        return get(0, 0, 40, 80);
    };
    var prepareImages = function() {
        images.stoneBlock = cropBlock(getImage("cute/StoneBlock"));
        images.woodBlock = cropBlock(getImage("cute/WoodBlock"));
        images.door = createDoorImage();
        images.grassBlock = cropBlock(getImage("cute/GrassBlock"));
        images.hopperStanding = getImage("creatures/Hopper-Happy");
        images.hopperJumping = getImage("creatures/Hopper-Jumping");
        images.hopperCool = getImage("creatures/Hopper-Cool");
        images.reward = getImage("avatars/questionmark");
        images.spentReward = cropBlock(getImage("cute/PlainBlock"));
        images.greenGem = getImage("cute/GemGreen");
        images.marcimus = getImage("avatars/marcimus");
        images.mrpants = getImage("avatars/mr-pants");
        background(255, 255, 255);
    }();
    var drawBackground = function() {
        var bgColor = color(9, 173, 173);
        fill(bgColor);
        rect(0, 0, lvlW, lvlH);
    };

    var pause = function() {
        paused = !paused;
        if (paused){
            fill(255, 255, 255);
            textSize(50);
            text('PAUSED', width/3, height/2, width/2, height/5);
            textSize(12);
            noLoop();
        }
        else {
            loop();
        }
    };
    var end = function(x, y) {
        fill(255, 255, 255);
        textSize(50);
        // text('GAME OVER', width/3, height/2);
        text('GAME OVER', x - width/3, y - height/4);
        textSize(12);
        noLoop();
    };
    var collisionDetected = function(o1, o2) {
        if ( o1.y+o1.h > o2.y &&
            o1.y        < o2.y+o2.h &&
            o1.x+o1.w > o2.x &&
            o1.x        < o2.x+o2.w) {
            return true;
        }
        return false;
    };
    var directionOfCollision = function(o) {
        if(o.yvel>0) {
            return 'bottom';
        }
        if(o.yvel<0) {
            return 'top';
        }
        if(o.xvel>0) {
            return 'right';
        }
        if(o.xvel<0) {
            return 'left';
        }
    };
    var checkLevelsForRectangles = function(lvls) {
        var allRectangles = true;
        
        for (var lvl in lvls) {
            var i, l = lvls[lvl].length, lvlWidth = lvls[lvl][0].length;
            
            for (i = 0; i < l; i++) {
                if (lvls[lvl][i].length === lvlWidth) {}
                else {
                    allRectangles = false;
                }
            }
        }
        if (!allRectangles) {
            println('All levels should be rectangles.');
        }
    };
    var checkForOneHoppy = function(lvl) {
        
    };
    var dimensionsOfLevel = function(lvl) {
        debug(lvl);
        return [ lvl[0].length, lvl.length ];
    };
    var removeConsumedObjects = function(objects) {
        var length = objects.length, index, o,
            player = objects[0], removeMe = 0,
            consumed = false;
    
        for (index = 1; index < length; index++) {
            o = objects[index];
            if (o.consumed) {
                if (o.type === 'greenGem') {
                    player.isCool = true;
                }
                removeMe = index;
                consumed = true;
            }
        }
        if (consumed) {
            objects.splice(removeMe, 1);
        }
    };
    var checkForObjectConsumption = function(objects) {
        var length = objects.length,
            index, o, p = objects[0];
       
        for (index = 1; index < length; index++) {
            o = objects[index];
            if (!(o.monster)) {
                if (collisionDetected(p, o)) {
                    if (o.consumable) {
                        o.consumed = true;
                    }
                }
            }
        }
    };
    var update = function(objects) {
        drawBackground();
        checkForObjectConsumption(objects);
        removeConsumedObjects(objects);
    };
    var getLvlDim = function() {
        return [lvlW, lvlH];
    };
    var setLvlDim = function(w, h) {
        lvlW = w;
        lvlH = h;
    };
    var setUnitWidth = function(w) {
        unitWidth = w;
    };
    var getUnitWidth = function() {
        return unitWidth;
    };

    return {
        'keys':                     keys,
        'images':                   images,
        'pause':                    pause,
        'end':                      end,
        'getLvlDim':                getLvlDim,
        'setLvlDim':                setLvlDim,
        'setUnitWidth':             setUnitWidth,
        'getUnitWidth':             getUnitWidth,
        'collisionDetected':        collisionDetected,
        'directionOfCollision':     directionOfCollision,
        'update':                   update,
        'checkLevelsForRectangles': checkLevelsForRectangles,
        'dimensionsOfLevel':        dimensionsOfLevel
    };
}();
var keyPressed = function() {
    game.keys[keyCode] = true;
    if (keyCode === 80){
        game.pause();
    }
};
var keyReleased = function() {
    game.keys[keyCode]=false;
};

var GameCamera = function() {
    this.offSetX = 0;
    this.offSetY = 0;
};
GameCamera.prototype.update = function(x, y) {
    var lvlDims = game.getLvlDim();
    this.offSetX = -(x - width/2);
    this.offSetY = -(y - height/2);

    this.offSetX = constrain(this.offSetX, width - lvlDims[0], 0);
    this.offSetY = constrain(this.offSetY, -lvlDims[1] + height, 0);
};
var gameCamera = new GameCamera();

var GameObject = function(x,y,w,h,t) {
    this.x = x;
    this.y = y;
    this.w = w; 
    this.h = h;
    this.type = t;
    if (t === 'greenGem') {
        this.img = game.images.greenGem;
        this.consumable = true;
    }
    if (t === 'marcimus') {
        this.img = game.images.marcimus;
    }
    if (t === 'mrpants') {
        this.img = game.images.mrpants;
    }
    if (t === 'door') {
        this.img = game.images.door;
        this.comsumable = false;
        this.background = true;
        this.loc = '';
    }
    this.consumed = false;
    this.terminated = false;
};
var gameObjects = [];
var gameObjectsDraw = function() {
    for (var i = 0; i < gameObjects.length; i++) {
        if (gameObjects[i].background) {
            gameObjects[i].draw();
        }
    }
    for (var i = 0; i < gameObjects.length; i++) {
        if (!gameObjects[i].background) {
            gameObjects[i].draw();
        }
    }
};
var gameObjectsUpdate = function(objects) {
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(objects);
        var o = gameObjects[i];
        // println(i + ' ' + o.type + ' ' + o.x + ' ' + o.y + ' ' + o.w + ' ' + o.h);
    }
};
var gameObjectsAdd = function(gameObject) {
    if (gameObject.type === "hoppy") {
        gameObjects.unshift(gameObject);
    }
    else {
        gameObjects.push(gameObject);
    }
};
var gameObjectsClear = function() {
    while(gameObjects.length > 0) {
        gameObjects.splice(0, 1);
    }
};
var Block = function (x, y, w, h, t) {
    GameObject.call(this, x, y, w, h, t);
    switch (this.type) {
        case 'wood':
            this.img = game.images.woodBlock;
            break;
        case 'grass':
            this.img = game.images.grassBlock;
            break;
        default:
            this.img = game.images.stoneBlock;
    }
};
var MovingObject = function(x, y, w, h, t) {
    GameObject.call(this, x, y, w, h, t);
    this.xvel = 0;
    this.yvel = 0;
    this.falling = true;
    this.gravity = 0.4; // original 0.4
    this.jumpHeight = 10 * height / 400;
    this.maxFallSpeed = 12;
    this.moveSpeed = 0.5;
    this.maxMoveSpeed = 0.75;
    this.movingRight = true;
};
var Player = function(x, y, w, h, t) {
    MovingObject.call(this, x, y, w, h, t);
    this.moveSpeed = 0.5;
    this.maxMoveSpeed = 5;
    this.isCool = false;
    this.lastHurt = 0;
};
var Monster = function(x, y, w, h, t) {
    MovingObject.call(this, x, y, w, h, t);
    this.monster = true;
};
var addObjectMethods = function() {
    GameObject.prototype.update = function(objects) {};
    GameObject.prototype.draw = function() {
        image(this.img, this.x, this.y, this.w, this.h);
    };
    Block.prototype = Object.create(GameObject.prototype);
    Block.prototype.draw = function() {
        var qtyWide = round(this.w / 50),
            qtyHigh = round(this.h / 50),
            unitWidth, unitHeight, img, wI, hI;
        
        qtyWide = constrain(qtyWide, 1, qtyWide);
        qtyHigh = constrain(qtyHigh, 1, qtyHigh);
        unitWidth = this.w / qtyWide;
        unitHeight = this.h / qtyHigh;
        for (wI = 0; wI < qtyWide; wI++) {
            for (hI = 0; hI < qtyHigh; hI++) {
                image(this.img, this.x + unitWidth * wI, this.y + unitHeight * hI, this.w / qtyWide + 1, this.h / qtyHigh + 1);
            }
        }
        if (this.type === 'reward') {
            image(game.images.reward, this.x, this.y, this.w, this.h);
        }
        if (this.type === 'spentReward') {
            image(game.images.spentReward, this.x, this.y, this.w, this.h);
        }
    };
    MovingObject.prototype = Object.create(GameObject.prototype);
    MovingObject.prototype.adjustVelocity = function() {
        this.xvel = this.movingRight ? this.xvel + this.moveSpeed : this.xvel - this.moveSpeed;
        if (this.xvel < 0.1 && this.xvel > 0) {this.xvel=0;}
        if (this.xvel > -0.1 && this.xvel < 0) {this.xvel=0;}
        this.yvel += this.gravity;
        this.yvel = constrain(this.yvel, -this.maxFallSpeed, this.maxFallSpeed);
        this.xvel = constrain(this.xvel, -this.maxMoveSpeed, this.maxMoveSpeed);
    };
    MovingObject.prototype.applyPropertyEffects = function() {
        if (this.terminated) {
            // this.w -= 1;
            this.h -= 1;
        }
        if (this.h < 0) {
            this.consumed = true;
        }
    };
    MovingObject.prototype.update = function(objects) {
        this.adjustVelocity();
        this.x = constrain(this.x + this.xvel, 0, game.getLvlDim()[0] - this.w);
        this.collideWith(this.xvel, 0, objects);
        this.falling = true;
        // this.y += this.yvel;
        this.y = constrain(this.y + this.yvel, 0, game.getLvlDim()[1] - this.h);
        this.collideWith(0, this.yvel, objects);
        this.applyPropertyEffects();
    };
    MovingObject.prototype.collideWith = function(xv, yv, objects) {
        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            
            if (o instanceof Block) {
                if( this.y+this.h > o.y &&
                    this.y        < o.y+o.h &&
                    this.x+this.w > o.x &&
                    this.x        < o.x+o.w)
                {
                    // BOTTOM
                    if(yv>0) {
                        this.yvel = 0;
                        this.falling = false;
                        this.y = o.y-this.h;
                    }
                    // TOP
                    if(yv<0) {
                        this.yvel = 0;
                        this.falling = true;
                        this.y = o.y+o.h;
                   }
                    // RIGHT
                    if(xv>0) {
                        this.xvel = 0;
                        this.x = o.x-this.w;
                        this.movingRight = false;
                    }
                    // LEFT
                    if(xv<0) {
                        this.xvel = 0;
                        this.x = o.x+o.w;
                        this.movingRight = true;
                    }
                }
            }
        }
    };
    Player.prototype = Object.create(MovingObject.prototype);
    Player.prototype.adjustVelocity = function() {
        if(game.keys[LEFT]) { this.xvel -= this.moveSpeed; }
        if(game.keys[RIGHT]){ this.xvel += this.moveSpeed; }
        if(!game.keys[LEFT] && !game.keys[RIGHT]) {
            if(this.xvel>0) {
                this.xvel -= this.moveSpeed;
            }
            if(this.xvel<0) {
                this.xvel += this.moveSpeed;
            }
            if(this.xvel<0.1 && this.xvel>0){this.xvel=0;}
            if(this.xvel>-0.1 && this.xvel<0){this.xvel=0;}
        }
        if(game.keys[UP] && !this.falling) {
            this.yvel = -this.jumpHeight;
        }
        this.yvel += this.gravity;
        this.yvel = constrain(this.yvel, -this.maxFallSpeed, this.maxFallSpeed);
        this.xvel = constrain(this.xvel, -this.maxMoveSpeed, this.maxMoveSpeed);
     };
    Player.prototype.applyPropertyEffects = function() {
        if (this.terminated) {
            this.w -= 1;
            this.h -= 1;
        }
        if (this.w < 0 && this.h < 0) {
            game.end(this.x, this.y);
        }
    };
    Player.prototype.collideWith = function(xv, yv, objects) {
        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            if (o.type === 'door' && game.collisionDetected(this, o)) {
                if (game.keys[DOWN]) {
                    game.level = o.level;
                    game.levelChanged = true;
                    redraw();
                }
            }
            if (o instanceof Block) {
                if( this.y+this.h > o.y &&
                    this.y        < o.y+o.h &&
                    this.x+this.w > o.x &&
                    this.x        < o.x+o.w)
                {
                    // BOTTOM
                    if(yv>0) {
                        this.yvel = 0;
                        this.falling = false;
                        this.y = o.y-this.h;
                    }
                    // TOP
                    if(yv<0) {
                        this.yvel = 0;
                        this.falling = true;
                        this.y = o.y+o.h;
                        if (o.type === 'reward') {
                            var movingObject = new MovingObject(o.x, o.y - 60, 37, 57, 'greenGem');
                            gameObjects.push(movingObject);
                            o.type = 'spentReward';
                        }
                    }
                    // RIGHT
                    if(xv>0) {
                        this.xvel = 0;
                        this.x = o.x-this.w;
                    }
                    // LEFT
                    if(xv<0) {
                        this.xvel = 0;
                        this.x = o.x+o.w;
                    }
                }
            }
        }
    };
    Player.prototype.draw = function() {
        var img;
        
        if (this.isCool) {
            img = game.images.hopperCool;
        }
        else {
            if (this.falling) {
                img = game.images.hopperJumping;
            }
            else {
                img = game.images.hopperStanding;
            }
        }
        image(img, this.x, this.y, this.w, this.h);
    };
    Player.prototype.damaged = function() {
        if (millis() - this.lastHurt < 3000) {
            return;
        }
        else {
            this.lastHurt = millis();
            if (this.isCool) {
                this.isCool = false;
            }
            else {
                this.terminated = true;
            }
        }
    };
    Monster.prototype = Object.create(MovingObject.prototype);
    Monster.prototype.stayOnBlock = function() {
        if (this.falling && !this.terminated) {
            this.y -= this.yvel;
            this.x -= this.xvel * 2;
            if (this.movingRight) {
                this.movingRight = false;
            }
            else {
                this.movingRight = true;
            }
        }
    };
    Monster.prototype.playerCollision = function(p) {
        if (game.collisionDetected(p, this)) {
            if (game.directionOfCollision(p) === 'bottom') {
                this.terminated = true;
                p.yvel *= -1;
            }
            else {
                if (!this.terminated) {
                    p.damaged();
                    // This doesn't work very well. Need to add brief invincibility.
                    p.xvel *= -3;
                    this.xvel *= -1;
                }
            }
        }
    };
    Monster.prototype.update = function(objects) {
        this.adjustVelocity();
        this.x += this.xvel;
        this.collideWith(this.xvel, 0, objects);
        this.falling = true;
        this.y += this.yvel;
        this.collideWith(0, this.yvel, objects);
        if (this.type === "mrpants") {
            this.stayOnBlock();
        }
        this.applyPropertyEffects();
        this.playerCollision(gameObjects[0]);
    };
    Monster.prototype.collideWith = function(xv, yv, objects) {
        for (var i = 0; i < objects.length; i++) {
            var o = objects[i];
            
            if (o instanceof Block) {
                if( this.y+this.h > o.y &&
                    this.y        < o.y+o.h &&
                    this.x+this.w > o.x &&
                    this.x        < o.x+o.w)
                {
                    // BOTTOM
                    if(yv>0) {
                        this.yvel = 0;
                        this.falling = false;
                        this.y = o.y-this.h;
                    }
                    // TOP
                    if(yv<0) {
                        this.yvel = 0;
                        this.falling = true;
                        this.y = o.y+o.h;
                   }
                    // RIGHT
                    if(xv>0) {
                        this.xvel = 0;
                        this.x = o.x-this.w;
                        this.movingRight = false;
                    }
                    // LEFT
                    if(xv<0) {
                        this.xvel = 0;
                        this.x = o.x+o.w;
                        this.movingRight = true;
                    }
                }
            }
        }
    };
}();

var levels = {
    /* Legend for level arrays
        e   empty space
        s   stone block
        w   wood block
        g   grass block
        H   Hopper
        S   stone block with reward
        m   Marcimus
        M   Mr. Pants
        d   door
            Any other character serves as the level that the door above it takes you to
    */
    '1':    [   'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeMeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeesssssseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'seeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeesssssseeeessssseeeeeeeeeeeeeeeeeeeeeeeeeeeees',
                'seeeeeeeeeeeeMeeeeeeeSeeeeeeeeeeeeeeeeeeeSeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeees',
                'seeeedeeeesssssseeeeeeeeeeeessssssseeeeeeeeeeeessssseeeeeeeeeeeeeeeeeeeeeeeeds',
                'seHee2eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee3s',
                'gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg' ],
    '2':    [   'eeeeee',
                'eeeede',
                'eeHe1e',
                'gggggg' ],
    '3':    [   'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                'eeeeeeeeeeemseeeeeeeeeeeeeeemsmeeeeeeeeeeeemsmeeeeeeeeemsmeeeeeeeee',
                'eeeeeeeeeeessseeeeeeeeeeeeeessseeeeeeeeeeeessseeeeeeeeessseeeeeeeee',
                'eeeeeeeeeessssseeeeeeeeeeeessssseeeeeeeeeessssseeeeeeessssseeeeeeee',
                'eeeeeeeeessssssseeeeeeeeeessssssseeeeeeeessssssseeeeessssssseeeeeed',
                'eeeeeeeessssssssseeeeeeeessssssssseeeeeessssssssseeessssssssseeeee1',
                'gHeeeeessssssssssseeeeeessssssssssseeeesssssssssssessssssssssseeeeg',
                'ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg' ]
};
var addLocationToDoorAbove = function(l, x, y, unitH, unitW) {
    gameObjects.forEach(function(element, index, array) {
        if (element.type === 'door' && element.y === y - unitH && element.x === x) {
            debug('door level is ' + l);
            element.level = l;
        }
    });
};
var addObjectFromObjectCode = function(objectCode, x, y, unitW, unitH, p) {
    switch (objectCode) {
        case 's':
            gameObjectsAdd(new Block(x, y, unitW, unitH, 'stone'));
            break;
        case 'S':
            gameObjectsAdd(new Block(x, y, unitW, unitH, 'reward'));
            break;
        case 'g':
            gameObjectsAdd(new Block(x, y, unitW, unitH, 'grass'));
            break;
        case 'd':
            gameObjectsAdd(new GameObject(x, y, unitW, unitH * 2, 'door'));
            break;
        case 'M':
            gameObjectsAdd(new Monster(x + 1, y + 1, unitW - 2, unitH - 2, 'mrpants'));
            break;
        case 'm':
            gameObjectsAdd(new Monster(x + 1, y + 1, unitW - 2, unitH - 2, 'marcimus'));
            break;
        case 'H':
            if (p) {
                p.x = x + 1;
                p.y = y + 1;
                p.w = unitW - 2;
                p.h = unitH - 2;
                gameObjectsAdd(p);
            }
            else {
                gameObjectsAdd(new Player(x + 1, y + 1, unitW - 2, unitH - 2, 'hoppy'));
            }
            break;
        case 'w':
            gameObjectsAdd(new Block(x, y, unitW, unitH, 'wood'));
            break;
        case 'e':
            break;
        default:
            addLocationToDoorAbove(objectCode, x, y, unitH, unitW);
            break;
    }
};
var addObjects = function(lvl, p) {
    var dimLvl = game.dimensionsOfLevel(lvl),
        w = dimLvl[0], h = dimLvl[1],
        unitW = width / 10, unitH = height / 10,
        x = 0, y = 0, i, j, o;
        
    if (w * width / 10 < width) {
        unitW = width / w;
    }
    game.setUnitWidth(unitW);
    if (h * height / 10 < height) {
        unitH = height / h;
    }
    game.setLvlDim(unitW * w, unitH * h);
    for (i = 0; i < h; i++) {
        for (j = 0; j < w; j++) {
            o = lvl[i].charAt(j);
            addObjectFromObjectCode(o, x, y, unitW, unitH, p);
            x += unitW;
        }
        x = 0;
        y += unitH;
    }
};
var changeLevel = function() {
    if (game.levelChanged) {
        var p = gameObjects[0];
        
        gameObjectsClear();
        addObjects(levels[game.level], p);
        game.levelChanged = false;
    }
};
var initialize = function() {
    game.checkLevelsForRectangles(levels);
    addObjects(levels['1']);
    noStroke();
    imageMode(CORNER);
}();

draw = function() {
    changeLevel();
    game.update(gameObjects);
    gameObjectsUpdate(gameObjects);
    gameCamera.update(gameObjects[0].x, gameObjects[0].y);
    pushMatrix();
    translate(gameCamera.offSetX, gameCamera.offSetY);
    gameObjectsDraw();
    popMatrix();
};

}

PJSLoader.loadSketch("canvas", main);
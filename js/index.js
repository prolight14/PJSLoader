function main()
{/**
Original game made by Jacob (Galaxy programming), spin-off made by Russell Smith.


*Now with smoother graphics, a story (pause the game to see, it changes every level), working sounds, darker background (easier on the eyes and the computer's battery), a more interesting blob (trigonometry is used for the shape and color, making it change shape and color), the ability to win, three extra levels, and score keeping!.

Credits:
The menu uses code from here:
https://www.khanacademy.org/cs/animation-2-unfinished/4933595224080384

And also from here:
https://www.khanacademy.org/cs/escape-plan/5472242247663616
/**

The original authors comments (they include credits so I won't remove them):
* Huge thanks to:
* Ryan Kee, for sounds on collision and managing objects
* Thomas L. for his amazing camera function
* Michael da boss for the block on block collision and the movable blocks
* 
* Special thanks to:
* Bruce for helping me with the robot collision and morral support!
* Bolduchaiel for making levels!
*/
smooth();
frameRate(45);
var x = 200; //for the level select (these have nothing to do with the player)
var y = 200;
var amount = 0;
var gamestate = "select";
var sounds = {

    jump: getSound("rpg/water-bubble"),

    portal: getSound("retro/whistle1"),

    hurt: getSound("rpg/hit-splat"),

    land: getSound("rpg/hit-splat")

};
var barX = 0;
var messages = [

["Type: Tutorial\nPurpose: Navigation\nMessage: Left & right arrows\nto move, Up arrow to jump,\nR to restart.",

        "Type: Tutorial\nPurpose: Scoring points\nmessage: gather star dust\nparticals to score points! ",

        "Type: Tutorial\nMessage: If you die,\nyour body will teleport back to\nthe beginning of the level...",
"Type: Tutorial\nMessage: Be wary of lasers, some\nof them (like this one) turn off\nsometimes, but a lot of them\nstay on, so try to avoid them",
        "Type: Tutorial\nMessage: Be careful!\nThese zappers are extremly\ndangerous...", "Type: tutorial\nmessage: This is a check-point,\nit will automatically save\nyour spot if you die. Go ahead\nand activate it!",

        "Type: Tutorial\nMessage: Keep going,\nyou're almost there!",

        "Type: Tutorial\nMessage: Hmm, I wonder\nhow I could get past that\nlaser...",

        "Type: Tutorial\nMessage: This is the Exit,\nit will take you to the next\nroom.",

        "Type: Tutorial\nMessage: You have finished the\ntutorial! Good luck my friend,\nnot many creatures have\ngotten out alive..."

    ], //level one
[],
    ["Type: WARNING\nMessage: WARNING!  WARNING!\nDANGER!  DANGER!  Robots have\nescaped, be prepared for anything,\nyou will need to be quick.", "Type: Notice\nMessage: Welcome to the robot lab.\nThis is where all the robots are\ntested.  Ready for a tour?",
        "Type: Information\nMessage: These are just simple\ndumb robots.  They wont hurt you\nunless you get in their way.\nShall we continue?",
        "Type: Information\nMessage: Those however, are a bit\nmore dangerous. They'll hunt you\ndown until they kill you!  Now you\nget why they keep them in cages?"
    ],
    ["Type: Notice\nMessage: Beware of the robots,\nlight grey robots follow a path,\nwhile dark grey robots follow\nyou.",

        "Type: Achievment\nMessage: Congratulations!\nYou have found the\nsecret jackpot!"

    ],

    ["Type: Notice\nMessage: Phew... That was close!\nPlenty more where that\ncame from though...","Type: Notice\nMessage: Welcome to the laser lab.\nOne of the most dangerous\nplaces on earth...",

     "Type: Direction\nMessage: Dooowwn...  theerre!!!",

     "Type: Achievment\nMessage: Wow I'm impressed!\nbut you're not out yet..."],
     [
    "Type: Notice\nMessage: I'm distracting you!",
      "Type: Notice\nMessage: This is a tough one,\nbut you can do it!",
    ],
    [
    "Type: Notice\nMessage: I wonder what could be\ndown that hole...",
    ],
    [
    ],
    [
    "Type: Achievement\nMessage: Congratulations,\nyou've won, for now...",
    ],

];
var star = getImage("cute/Star");
var graphics = createGraphics(star.width, star.height, JAVA2D);
graphics.background(255, 0);
//What image to tint
graphics.image(star);
var word = function(index, str, x, y) {
    var temp = str.substring(0, index);
    textSize(12);
    fill(255);
    text(temp, x, y);
};
var spark = function(x, y, r) { //for the lasers
    pushMatrix();
    translate(x, y);
    rotate(r);
    line(0, 0, random(5, 10), -random(3, 8));
    line(0, 0, random(-5, -10), -random(3, 8));
    line(0, 0, random(3, 8), -random(3, 8));
    line(0, 0, -random(3, 8), -random(3, 8));
    popMatrix();
};
var base = function(x, y, r) { //for the lasers
    pushMatrix();
    translate(x, y);
    rotate(-90 + r);
    stroke(112, 112, 112);
    strokeWeight(2);
    fill(82, 82, 82);
    ellipse(0, 0, 7, 30);
    beginShape();
    noStroke();
    vertex(15, 4);
    vertex(10, 0);
    vertex(15, -4);
    vertex(0, -10);
    vertex(0, 10);
    endShape(CLOSE);
    stroke(138, 138, 138);
    line(15, 4, 4, 7);
    popMatrix();
};
var sF = 0.5;

var deadTimer = 0;

var alien = function(x, y) {
    pushMatrix();

    translate(x - width / 2, y - height / 2);

    scale(sF);

    fill(cos(frameCount)*100+100,sin(frameCount)*100+100,0);

    strokeWeight(2);

    stroke(0, 158, 0);

    beginShape();

    curveVertex(214, 122);

    curveVertex(236, sin(frameCount)*7+174);

    curveVertex(231, sin(frameCount)*7+168);

    curveVertex(220, sin(frameCount)*7+163);

    curveVertex(207, sin(frameCount)*7+162);

    curveVertex(195, sin(frameCount)*7+165);

    curveVertex(186, sin(frameCount)*7+174);

    curveVertex(178, 192);

    curveVertex(171, 215);

    curveVertex(166, 229);

    curveVertex(163, 235);

    curveVertex(158, 238);

    curveVertex(158, 241);

    curveVertex(163, 244);

    curveVertex(170, 241);

    curveVertex(180, 240);

    curveVertex(190, 243);

    curveVertex(198, 241);

    curveVertex(206, 240);

    curveVertex(211, 245);

    curveVertex(221, 245);

    curveVertex(225, 242);

    curveVertex(231, 240);

    curveVertex(240, 242);

    curveVertex(244, 240);

    curveVertex(242, 232);

    curveVertex(241, 229);

    curveVertex(239, 211);

    curveVertex(239, 195);

    curveVertex(235, 172);

    endShape(CLOSE);

    fill(255, 255, 255);

    stroke(0);

    ellipse(214, sin(frameCount)*7+190, 18, 20);

    ellipse(235, sin(frameCount)*7+188, 13, 20);

    fill(0, 0, 0);

    ellipse(217, sin(frameCount)*7+191, 8, 10);

    ellipse(237, sin(frameCount)*7+190, 6, 10);

    noFill();

    strokeWeight(1);

    arc(226, sin(frameCount)*7+208, 20, 3, 36, 121);

    popMatrix();

};

var alien2 = function(x, y) {
    pushMatrix();

    translate(x - width / 2, y - height / 2);

    scale(sF);

    fill(155, 155, 0);

    strokeWeight(2);

    stroke(0, 158, 0);

    beginShape();

    curveVertex(214, 122);

    curveVertex(236, 174);

    curveVertex(231, 168);

    curveVertex(220, 163);

    curveVertex(207, 162);

    curveVertex(195, 165);

    curveVertex(186, 174);

    curveVertex(178, 192);

    curveVertex(171, 215);

    curveVertex(166, 229);

    curveVertex(163, 235);

    curveVertex(158, 238);

    curveVertex(158, 241);

    curveVertex(163, 244);

    curveVertex(170, 241);

    curveVertex(180, 240);

    curveVertex(190, 243);

    curveVertex(198, 241);

    curveVertex(206, 240);

    curveVertex(211, 245);

    curveVertex(221, 245);

    curveVertex(225, 242);

    curveVertex(231, 240);

    curveVertex(240, 242);

    curveVertex(244, 240);

    curveVertex(242, 232);

    curveVertex(241, 229);

    curveVertex(239, 211);

    curveVertex(239, 195);

    curveVertex(235, 172);

    endShape(CLOSE);

    fill(255, 255, 255);

    stroke(0);

    ellipse(214, 190, 18, 20);

    ellipse(235, 188, 13, 20);

    fill(0, 0, 0);

    ellipse(217, 191, 8, 10);

    ellipse(237, 190, 6, 10);

    noFill();

    strokeWeight(1);

    arc(226, 208, 20, 3, 36, 121);

    popMatrix();

};
var Alien = function(x, y, direction) {

    if (direction === "right") {

        alien(x, y);

    } else if (direction === "left") {

        pushMatrix();

        translate(x + -200, y);

        scale(-1, 1);

        alien(0, 0);

        popMatrix();

    } else if (direction === "none") {
        pushMatrix();

        translate(x - width / 2, y - height / 2);

        scale(sF);

        fill(cos(frameCount)*100+100,sin(frameCount)*100+100,0);

        strokeWeight(2);

        stroke(0, 168, 39);

        beginShape();

        curveVertex(246, 232);

        curveVertex(235, 216);

        curveVertex(232, sin(frameCount)*7+189);

        curveVertex(225, sin(frameCount)*7+171);

        curveVertex(212, sin(frameCount)*7+163);

        curveVertex(197, sin(frameCount)*7+161);

        curveVertex(185, sin(frameCount)*7+165);

        curveVertex(174, sin(frameCount)*7+178);

        curveVertex(168, 213);

        curveVertex(169, 206);

        curveVertex(166, 229);

        curveVertex(158, 240);

        curveVertex(170, 242);

        curveVertex(182, 240);

        curveVertex(191, 243);

        curveVertex(200, 245);

        curveVertex(207, 240);

        curveVertex(212, 239);

        curveVertex(219, 242);

        curveVertex(221, 243);

        curveVertex(228, 240);

        curveVertex(229, 239);

        curveVertex(235, 239);

        curveVertex(240, 239);

        curveVertex(240, 232);

        curveVertex(236, 227);

        curveVertex(234, 199);

        endShape(CLOSE);

        fill(255, 255, 255);

        stroke(0);

        ellipse(190, sin(frameCount)*7+190, 18, 20);

        ellipse(215, sin(frameCount)*7+190, 18, 20);

        fill(0, 0, 0);

        ellipse(190, sin(frameCount)*7+192, 8, 10);

        ellipse(215, sin(frameCount)*7+192, 8, 10);

        noFill();

        strokeWeight(1);

        arc(202, sin(frameCount)*7+208, 20, 3, 36, 121);

        popMatrix();

    } else if (direction === "dead") {

        deadTimer++;

        var flash = random(8, 12);

        if (deadTimer > flash) {

            deadTimer = 0;

        }

        if (deadTimer > flash / 2) {

            fill(255, 255, 255);

        } else {

            fill(0, 0, 0);

        }
        pushMatrix();
        scale(sF);
        translate(x - width / 2, y - height / 2);
        translate(random(-2, 2), random(-2, 2));
        noStroke();
        beginShape();
        curveVertex(211, 177);
        curveVertex(206, 169);
        curveVertex(201, 163);
        curveVertex(195, 166);
        curveVertex(195, 173);
        curveVertex(189, 176);
        curveVertex(181, 176);
        curveVertex(170, 178);
        curveVertex(170, 185);
        curveVertex(169, 193);
        curveVertex(157, 204);
        curveVertex(157, 211);
        curveVertex(169, 217);
        curveVertex(171, 228);
        curveVertex(173, 232);
        curveVertex(181, 233);
        curveVertex(192, 231);
        curveVertex(202, 233);
        curveVertex(212, 235);
        curveVertex(217, 228);
        curveVertex(230, 225);
        curveVertex(236, 217);
        curveVertex(224, 214);
        curveVertex(225, 204);
        curveVertex(234, 200);
        curveVertex(233, 191);
        curveVertex(222, 184);
        curveVertex(219, 177);
        curveVertex(217, 172);
        curveVertex(208, 170);
        endShape(CLOSE);
        ellipse(186, 170, 12, 10);
        ellipse(191, 239, 16, 10);
        ellipse(232, 213, 10, 13);
        fill(255, 255, 255);
        ellipse(185, 195, 18, 20);
        ellipse(209, 195, 18, 20);
        fill(0, 0, 0);
        ellipse(185, 196, 10, 12);
        ellipse(209, 196, 10, 12);
        noFill();
        stroke(255, 255, 255);
        strokeWeight(1);
        arc(196, 212, 20, -3, 36, 121);
        popMatrix();
    }
};
var mute = "off";
// transparent screen
var transparency = 255;
var screenColor = [255, 255, 255];
// background color
var bgColor = color(0, 150, 255);
// key events
var keys = [];
keyPressed = function() {
    keys[keyCode] = true;
};
keyReleased = function() {
    keys[keyCode] = false;
};
// mouse events
var mouse = [];
mousePressed = function() {
    mouse[mouseButton] = true;
};
mouseReleased = function() {
    mouse[mouseButton] = false;
    return true;
};
// rect with rect collision
var collide = function(obj1, obj2) {
    return obj1.x < obj2.x + obj2.w && obj1.x + obj1.w > obj2.x && obj1.y < obj2.y + obj2.h && obj1.y + obj1.h > obj2.y;
};
// rect with ellipse
var collideWithEllipse = function(obj1, obj2) {
    // obj1 should be the ellipse for accurate collisions 
    return obj2.x + obj2.w > obj1.x - obj1.w / 2 && obj2.x < obj1.x + obj1.w / 2 && obj2.y + obj2.h > obj1.y - obj1.h / 2 && obj2.y < obj1.y + obj1.h / 2;
};
// Button object
var button = function(x, y, w, h, message, txtSize) {
    var m = {
        x: mouseX,
        y: mouseY,
        w: 1,
        h: 1
    };
    var self = {
        x: x,
        y: y,
        w: w,
        h: h
    };
    if (collide(m, self)) {
        fill(100, 100, 100, 100);
    } else {
        fill(150, 150, 150, 100);
    }
    strokeWeight(((w + h) / 2) / 15);
    stroke(255, 255, 255);
    rect(x, y, w, h, 5);
    fill(0, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(txtSize);
    text(message, x + w / 2, y + h / 2);
    if (collide(m, self) && mouse[LEFT] && mouseReleased()) {
        return true;
    }
};
var areSame = function(x, y, x1, y1) {
    if (x === x1 && y === y1) {
        return true;
    } else {
        return false;
    }
};
// Credit to Thomas L. for the Camera function
var Camera = function(x, y, w, h, viewX, viewY, levelWidth, levelHeight, speed) {
    // Viewport on canvas
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    // Inside the viewport
    this.viewX = viewX;
    this.viewY = viewY;
    this.levelWidth = levelWidth;
    this.levelHeight = levelHeight;
    this.speed = this.speed || speed; // the lower the number, the faster the speed
};
Camera.prototype.follow = function(ent) {
    var x = -ent.x + this.x + (this.w / 2) - (ent.w / 2);
    var y = -ent.y + this.y + (this.h / 2) - (ent.h / 2);
    var a = atan2(y - this.viewY, x - this.viewX);
    var v = dist(x, y, this.viewX, this.viewY) / this.speed;
    this.viewX += v * cos(a);
    this.viewY += v * sin(a);
    var width = this.x + this.w - this.levelWidth;
    var height = this.y + this.h - this.levelHeight;
    this.viewX = min(this.viewX, this.x);
    this.viewX = max(this.viewX, width);
    this.viewY = min(this.viewY, this.y);
    this.viewY = max(this.viewY, height);
};
Camera.prototype.view = function(ent) {
    var viewX = -this.viewX + this.x,
        viewY = -this.viewY + this.y,
        viewW = ent.w - this.w,
        viewH = ent.w - this.h;
    if (ent.x > viewX - ent.w && ent.x < viewX - viewW + ent.w && ent.y > viewY - ent.h && ent.y < viewY - viewH + ent.h) {
        var camView = {
            x: (this.viewX + ent.x),
            y: (this.viewY + ent.y),
            w: ent.w,
            h: ent.h,
            cam: this
        };
        return camView;
    }
};
// Particle object
// Player object
var Player = function(x, y, w, h, keyInputs) {
    this.x = x; // position and dimensions
    this.y = y;
    this.w = w;
    this.h = h;
    this.keyInputs = keyInputs;
    this.velx = 0; // velocity and speed stuff
    this.vely = 0;
    this.maxSpeed = 5;
    this.accel = 0.5;
    this.jumping = false; // jumping stuff
    this.jumpHeight = 9;
    this.gravity = 0.4;
    this.dead = false; // deaths
    this.deathCounter = 0;
    this.respawnx = x;
    this.respawny = y;
};
Player.prototype.update = function(blocks) {
    if (!this.dead && !this.sad) {
        // update player's position when NOT dead
        if (keys[this.keyInputs[0]]) {
            this.velx += this.accel;
        } else if (keys[this.keyInputs[1]]) {
            this.velx -= this.accel;
        }
        if (keys[this.keyInputs[2]] && !this.jumping) {
            this.vely = -this.jumpHeight;
            this.jumping = true;
            if (mute === "on") {
                playSound(sounds.jump);
            }
        }
        if (!keys[this.keyInputs[0]] && !keys[this.keyInputs[1]]) {
            if (this.velx > 0) {
                this.velx -= this.accel;
            }
            if (this.velx < 0) {
                this.velx += this.accel;
            }
        }
        // limit the player's speed
        if (Math.abs(this.velx) > this.maxSpeed) {
            if (this.velx > 0) {
                this.velx = this.maxSpeed;
            }
            if (this.velx < 0) {
                this.velx = -this.maxSpeed;
            }
        }
        this.x += this.velx;
        this.applyCollision(blocks, this.velx, 0); // apply speed and collisions
        this.jumping = true;
        this.y += this.vely;
        this.applyCollision(blocks, 0, this.vely);
        this.vely += this.gravity;
    }
    if (this.jumping) {
        this.jumpTimer = 0;
    }
    if (this.health <= 0) {
        this.dead = true;
    }
};
Player.prototype.applyCollision = function(obj, velx, vely) {
    for (var i = 0; i < obj.length; i++) {
        if (collide(this, obj[i])) { // handle collisions
            if (vely > 0) {
                if (this.jumpTimer === 1 && mute === "on") {
                    playSound(sounds.land);
                }
                this.jumpTimer++;
                this.vely = 0;
                this.jumping = false;
                this.y = obj[i].y - this.h;
            }
            if (vely < 0) {
                this.vely = 0;
                this.jumping = true;
                this.y = obj[i].y + obj[i].h;
            }
            if (velx < 0) {
                obj[i].vx = this.velx;
                if (obj[i].fixed) {
                    this.velx = 0;
                } else if (keys[RIGHT]) {
                    this.velx = 3;
                }
                this.x = obj[i].x + obj[i].w;
            }
            if (velx > 0) {
                obj[i].vx = this.velx;
                if (obj[i].fixed) {
                    this.velx = 0;
                } else if (keys[LEFT]) {
                    this.velx = 0;
                }
                this.x = obj[i].x - this.w;
            }
        }
    }
};
Player.prototype.draw = function(cam) {
    var view = cam.view(this);
    noStroke();
    if (view && !this.dead) {
        // draw the player
        // body
        if (keys[LEFT]) {
            Alien(view.x + 120, view.y + 120, "left");
        } else if (keys[RIGHT]) {
            Alien(view.x + 120, view.y + 120, "right");
        } else {
            Alien(view.x + 120, view.y + 120, "none");
        }
    }
    if (view && this.dead) {
        pushMatrix();
        translate(view.x + 20, view.y);
        Alien(0, 0, "dead");
        popMatrix();
    }
};
// store "Player"s in an array
var players = [];
players.add = function(x, y, w, h, keyInputs, color) {
    this.push(new Player(x, y, w, h, keyInputs, color));
};
players.apply = function(cam, blocks, fallBlocks) {
    for (var i = 0; i < this.length; i++) {
        this[i].update(blocks);
        this[i].draw(cam);
    }
};
// Block object
var blocks = [];
var Block = function(x, y, w, h, fixed) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fixed = fixed;
    this.vx = 0;
    this.vy = 0;
    this.falling = false;
    this.movingLeft = false;
    this.movingRight = false;
    this.draw = function(cam) {
        var view = cam.view(this);
        noStroke();
        if (view) {
            if (this.fixed) {
                fill(33, 0, 33);
                rect(view.x, view.y, view.w, view.h);
            } else {
                var l = 3;
                fill(102, 102, 102);
                rect(view.x, view.y, view.w, view.h);
                strokeWeight(6);
                stroke(150, 150, 150);
                line(view.x + l, view.y + l, view.x + view.w - l, view.y + l);
                line(view.x + l, view.y + l, view.x + l, view.y + view.h - l);
                line(view.x + view.w - l, view.y + view.h - l, view.x + l, view.y + view.h - l);
                line(view.x + view.w - l, view.y + l, view.x + view.w - l, view.y + view.h - l);
                strokeWeight(10);
                point(view.x + l * 2, view.y + l * 2);
                point(view.x + view.w - l * 2, view.y + l * 2);
                point(view.x + view.w - l * 2, view.y + view.h - l * 2);
                point(view.x + l * 2, view.y + view.h - l * 2);
                strokeWeight(4);
                stroke(0, 255, 0);
                point(view.x + l * 1.5, view.y + l * 1.5);
                point(view.x + view.w - l * 1.5, view.y + l * 1.5);
                point(view.x + view.w - l * 1.5, view.y + view.h - l * 1.5);
                point(view.x + l * 1.5, view.y + view.h - l * 1.5);
            }
        }
    };
    this.update = function() {
        if (this.fixed === false) {
            if (this.vx > 0) {
                this.vx -= 0.2;
            }
            if (this.vx < 0) {
                this.vx += 0.2;
            }
            if (this.vx < 0.3 && this.vx > 0) {
                this.vx = 0;
            }
            if (this.vx > -0.3 && this.vx < 0) {
                this.vx = 0;
            }
            this.x += this.vx;
            // Checks LEFT and RIGHT collision
            this.collideWith(this.vx, 0, blocks);
            this.collideWithPlayer(this.vx, 0);
            this.falling = true;
            this.y += this.vy;
            // Checks TOP and BOTTOM collision
            this.collideWith(0, this.vy, blocks);
            this.collideWithPlayer(0, this.vy);
            this.vy += 0.4;
        }
    };
    this.collideWith = function(xv, yv, platforms) {
        for (var i = 0; i < platforms.length; i++) {
            var p = platforms[i];
            if (this.y + this.h > p.y &&
                this.y < p.y + p.h &&
                this.x + this.w > p.x &&
                this.x < p.x + p.w &&
                !areSame(this.x, this.y, p.x, p.y)) {
                // BOTTOM
                if (yv > 0) {
                    this.vy = 0;
                    this.falling = false;
                    this.y = p.y - this.h;
                }
                // TOP
                if (yv < 0) {
                    this.vy = 0;
                    this.falling = true;
                    this.y = p.y + p.h;
                }
                // RIGHT
                if (xv > 0) {
                    this.vx = 0;
                    this.x = p.x - this.w;
                }
                // LEFT
                if (xv < 0) {
                    this.vx = 0;
                    this.x = p.x + p.w;
                }
            }
        }
    };
    this.collideWithPlayer = function(xv, yv) {
        var p = players[0];
        if (this.y + this.h > p.y &&
            this.y < p.y + p.h &&
            this.x + this.w > p.x &&
            this.x < p.x + p.w) {
            // BOTTOM
            if (yv > 0) {
                this.vy = 0;
                this.falling = false;
                this.y = p.y - this.h;
            }
            // TOP
            if (yv < 0) {
                this.vy = 0;
                this.falling = true;
                this.y = p.y + p.h;
            }
            // RIGHT
            if (xv > 0) {
                this.vx = 0;
                this.x = p.x - this.w;
            }
            // LEFT
            if (xv < 0) {
                this.vx = 0;
                this.x = p.x + p.w;
            }
        }
    };
};
// store "Block"s in an array
blocks.add = function(x, y, w, h, fixed) {
    this.push(new Block(x, y, w, h, fixed));
};
blocks.apply = function(cam) {
    for (var i = 0; i < this.length; i++) {
        this[i].draw(cam);
        this[i].update();
    }
};
// Exit object
var Exit = function(x, y) {
    this.x = x;
    this.y = y + 40;
    this.w = 80;
    this.h = 120;
    this.timer = 0;
    this.active = color(0, 255, 0);
    this.grey = color(46, 46, 46);
    this.color = color(92, 92, 92);
    this.color1 = this.grey;
    this.color2 = this.grey;
    this.color3 = this.grey;
    this.color4 = this.grey;
    this.draw = function(cam) {
        var view = cam.view(this);
        if (view) {
            fill(56, 56, 56);
            strokeWeight(6);
            stroke(99, 99, 99);
            rect(view.x - 10, view.y - 10, 60, -100);
            strokeWeight(3);
            rect(view.x - 15, view.y - 100, 70, -20);
            noStroke();
            quad(view.x - 20, view.y, view.x - 10, view.y - 10, view.x + 50, view.y - 10, view.x + 60, view.y);
            fill(this.color);
            quad(view.x - 16, view.y - 2, view.x - 10, view.y - 8, view.x - 2, view.y - 8, view.x - 8, view.y - 2);
            quad(view.x + 56, view.y - 2, view.x + 50, view.y - 8, view.x + 42, view.y - 8, view.x + 48, view.y - 2);
            quad(view.x + 18, view.y - 2, view.x + 18, view.y - 8, view.x + 2, view.y - 8, view.x - 4, view.y - 2);
            quad(view.x + 22, view.y - 2, view.x + 22, view.y - 8, view.x + 38, view.y - 8, view.x + 44, view.y - 2);
            textAlign(CENTER, CENTER);
            fill(0, 255, 0, 100);
            textSize(18);
            text("EXIT", view.x + 20, view.y - 110);
            fill(0, 255, 0, 150);
            textSize(17);
            text("EXIT", view.x + 20, view.y - 110);
            fill(0, 255, 0);
            textSize(16);
            text("EXIT", view.x + 20, view.y - 110);
            fill(this.color1);
            rect(view.x - 2.5, view.y - 30, 45, 15, 5);
            fill(this.color2);
            rect(view.x - 2.5, view.y - 50, 45, 15, 5);
            fill(this.color3);
            rect(view.x - 2.5, view.y - 70, 45, 15, 5);
            fill(this.color4);
            rect(view.x - 2.5, view.y - 90, 45, 15, 5);
            fill(this.active);
            for (var i = 0; i < 80; i += 20) {
                rect(view.x - 12, view.y - i - 30, 3, 6);
                rect(view.x + 48, view.y - i - 30, 3, 6);
            }
        }
    };
    this.update = function() {
        transparency = 0;
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            if (player.x > this.x - 20 && player.x + player.w < this.x + 60 && player.y > this.y - 120 && player.y + player.h < this.y) {
                this.timer++;
            } else {
                this.timer = 0;
            }
            if (player.x + player.w > this.x - 20 && player.x < this.x + 60) {
                if (player.y + player.h > this.y - 10 && player.y + player.h <= this.y) { ///////////////////
                    if (player.vely > 0) {
                        player.y = this.y - 10 - player.h;
                        player.vely = 0;
                        player.jumping = false;
                    }
                }
            }
        }
        if (this.timer > 1) {
            this.color = this.active;
        } else {
            this.color = color(107, 107, 107);
        }
        if (this.timer > 30) {
            this.color1 = this.active;
        } else {
            this.color1 = this.grey;
        }
        if (this.timer > 60) {
            this.color2 = this.active;
        } else {
            this.color2 = this.grey;
        }
        if (this.timer > 90) {
            this.color3 = this.active;
        } else {
            this.color3 = this.grey;
        }
        if (this.timer > 120) {
            this.color4 = this.active;
        } else {
            this.color4 = this.grey;
        }
        if (this.timer > 160) {
            this.complete = true;
            barX = 0;
        }
    };
};
// store "Exit"s in an array
var exits = [];
exits.add = function(x, y, w, h) {
    this.push(new Exit(x, y));
};
exits.apply = function(cam, players) {
    for (var i = 0; i < this.length; i++) {
        this[i].update(players);
        this[i].draw(cam);
    }
};
var Laser = function(x, y, dir, flash) {
    this.x = x;
    this.y = y;
    this.w = 400;
    this.h = 400;
    this.h1 = 10;
    this.w1 = 400;
    this.dir = dir;
    this.on = true;
    this.flash = flash;
    this.t = 0;
    this.draw = function(cam) {
        if (this.flash && !players[0].dead) {
            this.t++;
            if (this.t > 200) {
                this.t = 0;
            }
            if (this.t > 100) {
                this.on = true;
            } else {
                this.on = false;
            }
        }
        var view = cam.view(this);
        if (view) {
            var r = random(150);
            noStroke();
            for (var a = 0; a < 5; a++) {
                if (this.on) {
                    fill(255, r, 0, a * 40);
                } else {
                    fill(255, 0, 0, a * 5);
                }
                rect(view.x + a - 1, view.y + a - 1, this.w - a * 2 + 2, this.h1 - a * 2 + 2);
            }
            if (this.on) {
                this.str = color(255, r, 0);
                strokeWeight(1);
            } else {
                this.str = color(255, 0, 0, 20);
                strokeWeight(3);
            }
            if (this.dir === ">") {
                base(view.x, view.y + 5, 90);
                stroke(this.str);
                spark(view.x + view.w + 1, view.y + 5, 270);
            } else if (this.dir === "<") {
                base(view.x + view.w, view.y + 5, 270);
                stroke(this.str);
                spark(view.x - 1, view.y + 5, 90);
            } else if (this.dir === "^") {
                base(view.x + 5, view.y + this.h1 + 1, 0);
                stroke(this.str);
                spark(view.x + 5, view.y - 1, 180);
            } else if (this.dir === "v") {
                base(view.x + 5, view.y, 180);
                stroke(this.str);
                spark(view.x + 5, view.y + this.h1 + 1, 0);
            }
        }
        this.update = function() {
            this.w = 10000;
            this.h = this.w;
            //this.h1=1000;
            if (this.dir === ">") {
                this.w = 10000;
            } else if (this.dir === "<") {
                this.x = -0;
                this.w = 1000;
            } else if (this.dir === "^") {
                this.y = -0;
                this.h1 = 1000;
            } else if (this.dir === "v") {
                this.h1 = 40;
            }
            for (var i = 0; i < blocks.length; i++) {
                var b = blocks[i];
                if (b.x < this.x + this.w && b.x + b.w > this.x && b.y < this.y + this.h1 && b.y + b.h > this.y) {
                    if (this.dir === ">") {
                        this.w = b.x - this.x;
                    } else if (this.dir === "<") {
                        this.x = b.x + b.w;
                        this.w = x - this.x;
                    } else if (this.dir === "^") {
                        this.y = b.y + b.h;
                        this.h1 = y - this.y;
                        this.w = 10;
                    } else if (this.dir === "v") {
                        this.h1 = b.y - this.y;
                        this.w = 10;
                    }
                }
            }
            if (players[0].x < this.x + this.w && players[0].x + players[0].w > this.x && players[0].y < this.y + this.h1 && players[0].y + players[0].h > this.y && this.on) {
                players[0].dead = true;
                if (this.dir === ">" || this.dir === "<") {
                    if (players[0].y < this.y + 5) {
                        players[0].y = this.y - 5;
                    } else {
                        players[0].y = this.y + 10;
                    }
                }
            }
            if (players[0].dead) {
                this.on = true;
            }
        };
    };
    this.update = function() {
        for (var i = 0; i < blocks.length; i++) {
        }
    };
};
var lasers = [];
lasers.add = function(x, y, dir, flash) {
    lasers.push(new Laser(x, y, dir, flash));
};
lasers.apply = function(cam) {
    for (var i = 0; i < lasers.length; i++) {
        this[i].draw(cam);
        this[i].update();
    }
};
//Zappers:
var Zapper = function(x, y, side) {
    this.x = x;
    this.y = y;
    this.w = 40;
    this.h = 40;
    this.side = side;
    this.draw = function(cam) {
        var view = cam.view(this);
        if (view) {
            if (this.side === "top") {
                this.x = x;
                this.y = y;
                this.w = 40;
                this.h = 10 + cos(millis());
            } else if (this.side === "bottom") {
                this.x = x;
                this.y = y + 30 - cos(millis());
                this.w = 40;
                this.h = 10 + cos(millis());
            } else if (this.side === "right") {
                this.x = x + 30 - cos(millis());
                this.y = y;
                this.w = 10 + cos(millis());
                this.h = 40;
            } else if (this.side === "left") {
                this.x = x;
                this.y = y;
                this.w = 10 + cos(millis());
                this.h = 40;
            }
            noStroke();
            fill(204, 255, 0);
            rect(view.x, view.y, view.w, view.h);
        }
    };
    this.update = function() {
        if (players[0].x < this.x + this.w && players[0].x + players[0].w > this.x && players[0].y < this.y + this.h - 3 && players[0].y + players[0].h > this.y) {
            players[0].dead = true;
            if (this.side === "bottom") {
                players[0].y = this.y - 20;
            } else if (this.side === "top") {
                players[0].y = this.y + 20;
            } else if (this.side === "left") {
                players[0].x = this.x + 10;
            } else if (this.side === "right") {
                players[0].x = this.x - 30;
            }
        }
    };
};
var zappers = [];
zappers.add = function(x, y, side) {
    this.push(new Zapper(x, y, side));
};
zappers.apply = function(cam) {
    for (var i = 0; i < zappers.length; i++) {
        this[i].draw(cam);
        this[i].update();
    }
};
var Robot = function(x, y, xv, yv, type) {
    this.x = x;
    this.y = y;
    this.respawnx = x;
    this.respawny = y;
    this.position = new PVector(x, y);
    this.velocity = new PVector(0, 0);
    this.acceleration = new PVector(0, 0);
    this.w = 40;
    this.h = 40;
    this.p = []; //empty array for electricity
    this.pTime = 0;
    this.xvel = xv;
    this.yvel = yv;
    this.type = type;
    this.move = true;
    this.draw = function(cam) {
        if (this.type === 'boss') {
            this.color = 43;
        } else {
            this.color = 217;
        }
        var view = cam.view(this);
        if (view) {
            pushMatrix();
            translate(20, 20);
            //the electricity
            this.pTime++;
            if (this.pTime > 1) {
                this.p.push([random(44, 50), random(360), random(15, 30)]);
                this.pTime = 0;
            }
            strokeWeight(0.5);
            noFill();
            stroke(158, 247, 255);
            for (var i = 0; i < this.p.length; i++) {
                var arcs = this.p[i];
                arc(view.x, view.y, arcs[0], arcs[0], arcs[1] - arcs[2], arcs[1]);
                if (this.p.length > 10) {
                    this.p.shift();
                }
            }
            //the drawing
            fill(this.color);
            stroke(this.color - 40);
            strokeWeight(2);
            ellipse(view.x, view.y, 40, 40); //the body
            noFill();
            strokeWeight(0.2);
            stroke(this.color - 30);
            arc(view.x, view.y + -20, 30, 10, 50, 129);
            arc(view.x, view.y + -10, 40, 10, 22, 158);
            arc(view.x, view.y + 0, 40, 10, 0, 175);
            arc(view.x, view.y + 10, 35, 10, 25, 155);
            //the eyes
            pushMatrix();
            fill(255, 0, 0);
            translate(view.x + 10, view.y);
            rotate(-31);
            arc(0, 0, 10, 8, -10, 180);
            strokeWeight(2);
            stroke(0);
            line(-5, -1, 5, -2);
            popMatrix();
            //second eye
            strokeWeight(0.2);
            stroke(this.color - 40);
            pushMatrix();
            fill(255, 0, 0);
            translate(view.x - 10, view.y);
            rotate(31);
            arc(0, 0, 10, 8, 0, 190);
            strokeWeight(2);
            stroke(0);
            line(-5, -2, 5, -1);
            popMatrix();
            //irises
            strokeWeight(3);
            point(view.x + -10, view.y);
            point(view.x + 10, view.y);
            //mouth
            fill(255, 255, 255);
            strokeWeight(0.5);
            rect(view.x - 10, view.y + 9, 20, 5);
            line(view.x - 10, view.y + 11, view.x + 10, view.y + 11.5);
            popMatrix();
        }
    };
    this.update = function() {
        if (collide(this, players[0])) {
            players[0].dead = true;
            this.move = false;
        } else {
            this.move = true;
        }
        if (players[0].x > exits[0].x - 40 &&
            players[0].x + players[0].w < exits[0].x + 80 &&
            players[0].y + players[0].h < exits[0].y && players[0].y > exits[0].y - 120 && this.type === "boss") {
            this.move = false;
        }
        if (this.move && type !== "boss") {
            this.collideWith(this.xvel, 0);
            this.collideWith(0, this.yvel);
            this.x += this.xvel;
            this.y += this.yvel;
        }
        if (type === "boss" && this.move) {
            var mouse = new PVector(players[0].x, players[0].y);
            var dir = PVector.sub(mouse, this.position);
            dir.normalize();
            dir.mult(0.5);
            this.acceleration = dir;
            this.velocity.limit(3);
            this.position.x += this.velocity.x;
            this.x = this.position.x;
            this.BossCollideWith(this.velocity.x, 0);
            this.velocity.add(this.acceleration);
            this.position.y += this.velocity.y;
            this.y = this.position.y;
            this.BossCollideWith(0, this.velocity.y);
        }
    };
    this.BossCollideWith = function(xv, yv) {
        for (var i = 0; i < blocks.length; i++) {
            var b = blocks[i];
            var e = exits[0];
            if (this.position.y + this.h > b.y &&
                this.position.y < b.y + b.h &&
                this.position.x + this.w > b.x &&
                this.position.x < b.x + b.w) {
                if (this.type === 'boss') {
                    if (xv > 0) {
                        this.acceleration.x = 0;
                        this.velocity.x = 0;
                        this.position.x = b.x - this.w;
                    }
                    if (xv < 0) {
                        this.acceleration.x = 0;
                        this.velocity.x = 0;
                        this.position.x = b.x + b.w;
                    }
                    if (yv < 0) {
                        this.acceleration.y = 0; ////////////////////////////////////Over here!
                        this.velocity.y = 0;
                        this.position.y = b.y + b.h;
                    }
                    if (yv > 0) {
                        this.acceleration.y = 0;
                        this.velocity.y = 0;
                        this.position.y = b.y - this.h; ///////////////////////////////////////////////
                    }
                }
            }
        }
    };
    this.collideWith = function(xv, yv) {
        for (var i = 0; i < blocks.length; i++) {
            var b = blocks[i];
            if (this.y + this.h > b.y &&
                this.y < b.y + b.h &&
                this.x + this.w > b.x &&
                this.x < b.x + b.w) {
                if (xv > 0) {
                    this.xvel = -this.xvel;
                }
                if (xv < 0) {
                    this.xvel = -this.xvel;
                }
                if (yv > 0) {
                    this.yvel = -this.yvel;
                }
                if (yv < 0) {
                    this.yvel = -this.yvel;
                }
            }
        }
    };
};
var robots = [];
robots.add = function(x, y, xv, yv, type) {
    this.push(new Robot(x, y, xv, yv, type));
};
robots.apply = function(cam) {
    for (var i = 0; i < this.length; i++) {
        robots[i].draw(cam);
        robots[i].update();
    }
};
var Sign = function(x, y, txt) {
    this.x = x;
    this.y = y;
    this.h = 40;
    this.w = 40;
    this.msg = "";
    this.running = false;
    this.rectSize = 0;
    this.active = false;
    this.counter = 0;
    var c = 0;
    this.draw = function(cam) {
        var view = cam.view(this);
        if (view) {
            strokeWeight(5);
            stroke(55, 142, 153, 35);
            fill(130, 180, 199, 150);
            if (this.running) {
                c++;
                rect(80, 35, this.rectSize, this.rectSize / 3);
            }
            strokeWeight(1);
            if (c > 2) {
                for (var i = 0; i < this.rectSize; i++) {
                    var r = random(80, 80 + this.rectSize);
                    stroke(random(15, 20), random(70, 100), 160, random(10, 30));
                    line(r, 35, r, 35 + this.rectSize / 3);
                }
                c = 0;
            }
            textSize(55);
            textFont(createFont(""));
            fill(148, 148, 148, 200 + cos(millis() / 5) * 100);
            textAlign(LEFT, TOP);
            text("?", view.x + 6, view.y - 10 + cos(millis() / 10) * 2);
            noStroke();
            textFont(createFont("monospace"));
            word(this.counter, this.msg, 90, 40);
        }
    };
    this.update = function() {
        if (this.running && this.rectSize < 240) {
            this.rectSize += 10;
        }
        if (!this.running) {
            this.rectSize = 0;
            this.active = false;
        }
        if (this.rectSize >= 240) {
            this.active = true;
        }
        if (collide(this, players[0])) {
            this.running = true;
        } else {
            this.running = false;
        }
        if (this.active) {
            this.counter += 0.5;
        } else {
            this.counter = 0;
        }
    };
};
var signs = [];
signs.add = function(x, y) {
    this.push(new Sign(x, y));
};
signs.apply = function(cam) {
    for (var i = 0; i < this.length; i++) {
        this[i].draw(cam);
        this[i].update();
    }
};
var Point = function(x, y) {
    this.x = x + 20;
    this.y = y + 20;
    this.w = 13;
    this.h = 13;
    this.r = random(2, 4);
    this.on = true;
    this.draw = function(cam) {
        var view = cam.view(this);
        if (this.on && view) {
            strokeWeight(5);
            stroke(136, 255, 0, 80 + cos(millis() / this.r) * 23);
            fill(136, 255, 0, 200);
            ellipse(view.x, view.y, 13, 13);
            view.x += cos(millis() / 5) * this.r / 25;
            view.y += cos(millis() / 2) / this.r / 0.5 / 2;
        }
        //updating on contact
        if (collideWithEllipse(this, players[0]) && this.on) {
            this.on = false;
            if(barX < 370) {
            barX+=amount;
            }
        }
    };
};
var points = [];
points.add = function(x, y) {
    this.push(new Point(x, y));
};
points.apply = function(cam) {
    for (var i = 0; i < this.length; i++) {
        this[i].draw(cam);
    }
};
var Checkmark = function(x, y) {

    this.x = x + 20;

    this.y = y + 40;

    this.w = 80;

    this.h = 120;

    this.color1 = color(168, 168, 168);

    this.saved = false;

    this.part = [];

    this.transparency = 40;

    this.draw = function(cam) {

        var view = cam.view(this);

        if (view) {

            fill(56, 56, 56);

            noStroke();

            quad(view.x - 20, view.y, view.x - 10, view.y - 10, view.x + 50, view.y - 10, view.x + 60, view.y);

            fill(this.color1);

            quad(view.x - 16, view.y - 2, view.x - 10, view.y - 8, view.x - 2, view.y - 8, view.x - 8, view.y - 2);

            quad(view.x + 56, view.y - 2, view.x + 50, view.y - 8, view.x + 42, view.y - 8, view.x + 48, view.y - 2);

            quad(view.x + 18, view.y - 2, view.x + 18, view.y - 8, view.x + 2, view.y - 8, view.x - 4, view.y - 2);

            quad(view.x + 22, view.y - 2, view.x + 22, view.y - 8, view.x + 38, view.y - 8, view.x + 44, view.y - 2);

            if (players[0].respawnx === this.x && players[0].respawny === this.y - 50) {
                
                alien2(view.x+120, sin(frameCount)*5+view.y+55, "right");
                
                this.saved = true;

                this.part.push([random(-10, +50), -10]);

                this.color1 = color(0, 255, 0);

                this.transparency = 40;

            } else {

                this.color1 = color(94, 94, 94);

                this.part.shift();

                this.transparency = 20;

            }

            for (var i = 0; i < this.part.length; i++) {

                var p = this.part[i];

                stroke(21, 255, 0, this.transparency / 2);

                strokeWeight(5);

                line(view.x + p[0], view.y + p[1], view.x + p[0], view.y + p[1] - 40);

                strokeWeight(1);

                stroke(0, 255, 38, this.transparency);

                line(view.x + p[0], view.y + p[1], view.x + p[0], view.y + p[1] - 40);

                p[1] --;

                if (this.part.length > 50) {

                    this.part.shift();

                }
            }

        }

    };

    this.update = function() {

        if (players[0].x + players[0].w > this.x - 20 && players[0].x < this.x + 60 && players[0].y < this.y && players[0].y + players[0].h > this.y - 120) {

            players[0].respawnx = this.x;

            players[0].respawny = this.y - 50;

        }

        for (var i = 0; i < players.length; i++) {

            var player = players[i];

            if (player.x + player.w > this.x - 20 && player.x < this.x + 60) {

                if (player.y + player.h > this.y - 10 && player.y + player.h <= this.y) { ///////////////////

                    if (player.vely > 0) {

                        player.y = this.y - 10 - player.h;

                        player.vely = 0;

                        player.jumping = false;

                    }

                }

            }

        }

    };

};

var checkmarks = [];

checkmarks.add = function(x, y) {

    checkmarks.push(new Checkmark(x, y));

};

checkmarks.apply = function(cam) {

    for (var i = 0; i < this.length; i++) {

        this[i].draw(cam);

        this[i].update();

    }
};
// manage objects
var objects1 = [players, blocks, exits, lasers, zappers, robots, signs, points, checkmarks];
// remove objects
objects1.remove = function() {
    for (var i = 0; i < objects1.length; i++) {
        for (var j = 0; j < objects1[i].length; j++) {
            objects1[i].splice(j, objects1[i].length);
        }
    }
};
var objects2 = [exits, lasers, zappers, robots, signs];
// remove objects
objects2.remove = function() {
    for (var i = 0; i < objects2.length; i++) {
        for (var j = 0; j < objects2[i].length; j++) {
            objects2[i].splice(j, objects2[i].length);
        }
    }
    for (var i = 0; i < blocks.length; i++) {
        if (!blocks[i].fixed) {
            blocks[i].splice(i, blocks.length);
        }
    }
};
// manage the game
var Game = function() {
    // game levels
    /**

        * game levels

        //must have:

        * @ = Exit

        * P = player (please add only one)

        

        //optional

        * b = block (solid)

        * c = block (move-able)

        * [ = zapper left

        * ] = zapper right

        * - = zapper top

        * _ = zapper bottom

        

        * > = laser pointing right

        * < = laser pointing left

        * v = laser pointing down (doesn't work yet)

        * ^ = laser pointing up

        * A = flashing laser pointing down (doesn't work yet)

        * a = flashing laser pointing up

        

        * 1 = robots going left to right

        * 2 = robots going up and down

        * o = follower robots

        

        * ? = sign (don't forget to add the message at the begining!

        * ~ = check-mark

        * $ = star dust particals (points)

        

        

    */
    this.levels = [ //tutorial

           ["P                                   bbbbbbbbbbb",

            "             $$$$        $$$        $bbbbbbbbbbb",

            "     $      $    $       $$$        $bbbbbbbbbbb",

            "? $$$?$  ?$$      $$   ?$$a$$      $bb       bb",

            "bbbbbbbbbbbbb     bbbbbbbbbbbbb    $bb       bb",

            "bbbbbbbbbbbbb_____bbb              $bb       bb",

            "bbbbbbbbbbbbbbbbbbb                $bb       bb",

            "b                                  $bb       bb",

            "b    $$$$$            $$$$         cbb       bb",

            "b$   bbbb$$$$         bbbb>   bbbbbbbbbbbbbbbbb",

            "b$    bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",

            "b$    -     -----     -----    $$           ]bb",

            "b$                                          ]bb",

            "b$?     ]b        ]b        ]b     ? ~      ]bb",

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb    ]bb",

            "b                                           ]bb",

            "b                              cc c cc c c c]bb",

            "b   ?                         ______________bbb",

            "b bbbbbbbbbbbbbbbb>  bbb>   bbbbbbbbbbbbbbbbbbb",

            "b                                 $$$$$       b",

            "b         c                      bbbbbb       b",

            "b        bb                    b$$$$$$$       b",

            "b ~ ? b          <b      ~   b$$$$$$$$$?  ?$@ b",

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"

        ],
        [

            "                                               ",

            "                                               ",

            "                                               ",

            "                                               ",

            "                                               ",

            "                                   ~ $$$$      ",

            "                                  bbbbbbbb[    ",

            "                      $$      b   --     b[    ",

            "                      bb   ]b          @ b[    ",

            "                 $  b $$             bbbbb[    ",

            "$$$$$           bb     bb        bbb b ---     ",

            "bbbbb        c     $$$     ]bb       c$$$$$$   ",

            "$$$        bbbb    bbb     ]b        bbbbbbbbbb",

            "bbb    bb                bb]b> $$$$$  b        ",

            "  P    $$$$$$       $$$    ]bbbbbbbb           ",

            "bbbbbbbbbbbbbb2    bbbbb   ]b $$$$$$$$$$$$$    ",

            "b> $$$$$$$$$$   $$          1       $$$$$$$$$bb",

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"

        ],
[
            "b                                                        b",
            "b              $$$$$$$$$$$$$$$                           b",
            "b              bbbbbbbbbbbbbbb                        bo b",
            "b                       b$$$$$                        bbbb",
            "b           bbb         b$$@$$     $$$                   b",
            "b                       bbbbbb     bbb                   b",
            "b             bbb             $$$$$$$                    b",
            "b                  b  bbbbbbbbbbbbbbb                    b",
            "b                  b                                     b",
            "b                bbb b              b                    b",
            "b          ?       bob            bob                    b",
            "b        bbbbbbb   bbb            bbb                    b",
            "b                $$$$$$                          bbbbb$$$b",
            "b                bbbbbb              ~ $$$$$$$$$$b[  bbb b",
            "b                        bb          bbbbbbbbbbbbb[      b",
            "b>                       b        $$$$$$              bbbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb   bbbbbb                 b",
            "bbbbbbbbbbbbbbbbbbbbbbbbbb    b   b    b             bbb b",
            "bbbbbbbbbbbbbbbbbbbbb1   b o  b   b o  b    1            b",
            "b        2     2    b 1  b    b   b    b              bbbb",
            "b                   b  1 bbbbbb   bbbbbb    $$$$$$$$     b",
            "b                   b                      bbbbbbbbbb    b",
            "bP?  ?2     2      a$$$$$$$      ?                       b",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ],
        ["                                                  ",

            "                                                   ",

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",

            "b                                                  bb",

            "b                 2     2                          bb",

            "b               $$$$$$$$$$                         2b",

            "b               $bbbbbbbbb     $$$$                 b",

            "b        bbbbb           ]b  bbbbbb        _   @  $$b",

            "b       $$$$$$$$$$$$     ]b       bbbbbbbbbb bbbbb$$b",

            "b      bbbbbbbbbbb$$  ~  ]b       b          b    bbb",

            "  o             bb   bbbbbb       bb   bbbbbbbbbb   b",

            "  bbbbbbbbbbbbbbb  b                                b",

            "b                 b                   b             b",

            "b               bb     b          bbb               b",

            "b             ?      b          b                   b",

            "b          ]bbbbbbbb           b         $$$$$$$$$$$b",
            "b      ]bb   ]bb             $   $     $ bbbbbbbbb$$b",
            "b  bb[       ]bb             bbbbb  $  b 1  2  $$$$bb",
            "b  P    cb   ]bb                  $ b  2      $$bbb  ",
            "b      bb    ]bb                  b         $$$b     ",
            "b b bb>     ]b>        b        ?$$$$$$$$$$$$$$b     ",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",

        ],

        [

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb     bbbbbbbbbbbbbb",

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb       bbb$$$$$$$$$b",

            "b                                                $$$$$$$b",

            "bP                          $$$$$$$$~     aaa $$$$$$$$$$b",

            "b         b       b        ?$bbbbbbbbbd   bbbbb  bbbbbbbb",

            "b  ?   ba  a a a a a a    Dbbbbbbbbbbbd   bbbbbb$$$$   2b",

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb ?__bb b$$$$$     b",

            "b                            2   bbbbb bbbbb bbbbb      b",

            "bb  c                            bbbbb bbbbb2  $$$$$$   b",

            "bb  bbbbbb         bbbbb         bbbbb bbbbb   $bbbb$   b",

            "b              bbb              2                      bb",

            "b          bbbbb  bbb      bbbbbbbbbbb bbbbbb         bbb",

            "b   $$$$$$$$    b1               bbbbb bbbbb b      1bbbb",

            "b   bbbbbbbb    b  bbb           ----- bbbbb$$$$$$$$bbbbb",

            "b                 1                    -bbbbbbbbbbbbbbbbb",

            "b   $$$$$  1      bbbbbbbb         1    -bbbbbbbbbbbbbbbb",

            "b   bbbbbbbbbbbbbbb      b               bbbbbbbb      bb",

            "b                        bbb  bbb        bbbbbbb        b",

            "b                                        bbbbbb         b",

            "b                       c         b      bbbbb          b",

            "b                    bbbbb          ~                   b",

            "b               b                   bbb                 b",

            "b   $ a ~   a          <b    a    a           <b?     @ b",

            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",

        ],
        [
            "                         o",
            "                          ",
            "                          ",
            "      $                   ",
            "     $?$$  c              ",
            "$  bbbbbbbbbbbbbbbbbb  bbb",
            "b$     b    <b          bb",
            "bb$                     bb",
            "bbbP ? ^     ^    ^ $$$^bb",
            "bbbbbbbb>    b    b> @ bbb",
            "bbbbbbbbbbbbbbbbbbbbbbbbbb",
        ],
        [
            "bo                       o",
            "bbbbbbbbbbbbbbb          ",
            "                         ",
            "      $                  ",
            "     $$$                 ",
            "$         bbbbbbbbbb $bbb",
            "b$ bbbbbbbb          $  bb",
            "bb$                  $ b",
            "bbbP    ?          ^@ ^b",
            "bbbbbbbbbb bbbbbbbbbbbbb",
        ],
        [
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "b               2   2   2                b",
            "b                                        b",
            "b                                        b",
            "b               $   $   $    c   c   c  $b",
            "b    $$$  bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            "b$$$  bb                                 b",
            "b bb                                     b",
            "b  P                    ^@ ^             b",
            "b bbb bb b bb bbbb bbbbbbbbbbbbbbbbbbbbbbb",
            "b                                        b",
            "b                                        b",
            "b                                        b",
            "b                                        b",
            "b                                        b",
            "b                                        b",
            "b1111                                1111b",
            "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ],
        [
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
        "          ",
        " P  ?     ",
        "bbbbbbbbbb",
        ],

    ];
    this.level = 0; // keep track of which level to access
    this.levelSize = [0, 0]; // level dimensions
    // create a camera
    this.cam = new Camera(0, 0, width, height, 0, 0, this.levelSize[0], this.levelSize[1], 8);
    // the sign's messages
    // store dust particles in an array
    this.paused = false; // is the game paused?
};
Game.prototype.loadMap = function() {
    for (var col = 0; col < this.levels[this.level].length; col++) {
        for (var row = 0; row < this.levels[this.level][col].length; row++) {
            var s = this.levels[this.level][col][row];
            if (s === "P") {
                players.add(row * 40, col * 40, 40, 40, [RIGHT, LEFT, UP, DOWN]);
            }
            if (s === "c") {
                blocks.add(row * 40, col * 40, 40, 40, false);
            }
            if (s === "b") {
                blocks.add(row * 40, col * 40, 40, 40, true);
            }
            if (s === "@") {
                exits.add(row * 40 + 20, col * 40, 80, 80);
            }
            if (s === ">") {
                lasers.add(row * 40, col * 40 + 15, ">", false);
            }
            if (s === "<") {
                lasers.add(row * 40 + 40, col * 40 + 15, "<", false);
            }
            if (s === "^") {
                lasers.add(row * 40 + 15, col * 40 + 40, "^", false);
            }
            if (s === "v") {
                lasers.add(row * 40 + 15, col * 40, "v", false);
            }
            if (s === "A") {
                lasers.add(row * 40 + 15, col * 40, "v", true);
            }
            if (s === "a") {
                lasers.add(row * 40 + 15, col * 40 + 40, "^", true);
            }
            if (s === "D") {
                lasers.add(row * 40 + 40, col * 40 + 15, "<", true);
            }
            if (s === "d") {
                lasers.add(row * 40, col * 40 + 15, ">", true);
            }
            if (s === "]") {
                zappers.add(row * 40, col * 40, "right");
            }
            if (s === "[") {
                zappers.add(row * 40, col * 40, "left");
            }
            if (s === "_") {
                zappers.add(row * 40, col * 40, "bottom");
            }
            if (s === "-") {
                zappers.add(row * 40, col * 40, "top");
            }
            if (s === "o") {
                robots.add(row * 40, col * 40, 5, 0, 'boss');
            }
            if (s === "1") {
                robots.add(row * 40, col * 40, 3, 0);
            }
            if (s === "2") {
                robots.add(row * 40, col * 40, 0, -2);
            }
            if (s === "4") {
                robots.add(row * 40, col * 40, 0, 2);
            }
            if (s === "?") {
                signs.add(row * 40, col * 40);
            }
            if (s === "$") {
                points.add(row * 40, col * 40);
            }
            if (s === "~") {
                checkmarks.add(row * 40, col * 40);
            }
            // apply a level width and height according to the level
            this.levelSize[0] = this.levels[this.level][col].length * 40;
            this.levelSize[1] = this.levels[this.level].length * 40;
        }
    }
};
// apply object's methods to the draw loop
Game.prototype.apply = function() {
    if (!this.paused) {
        // adjust the level's dimensions accordingly
        this.cam.levelWidth = this.levelSize[0];
        this.cam.levelHeight = this.levelSize[1];
        var self = this;
        this.cam.follow(players[0]);
        blocks.apply(this.cam);
        exits.apply(this.cam, players);
        checkmarks.apply(this.cam);
        lasers.apply(this.cam);
        zappers.apply(this.cam);
        robots.apply(this.cam);
        signs.apply(this.cam);
        points.apply(this.cam);
        players.apply(this.cam, blocks);
        //applying the mssgs to the signs:
        for (var i = 0; i < signs.length; i++) {
            if (collide(players[0], signs[i])) {
                signs[i].msg = messages[this.level][i];
            }
        }
                fill(100);
        noStroke();
        rect(0, 0, width, 30);
        fill(50);
        rect(15, 0, 370, 20, 10);
        fill(50, 100, 0);
        rect(15, 0, barX, 20, 20);
        stroke(0);
        strokeWeight(2);
        line(100, 0, 100, 20);
        line(width/2, 0, width/2, 20);
        line(300, 0, 300, 20);
        if(barX < 85) {
        tint(0, 0, 0, 255);
        } else {
            tint(0, sin(frameCount)*25+230, 0, 255);
        }
        imageMode(CENTER);
        image(graphics, 100, 20, 25, 35);
        if(barX < 185) {
        tint(0, 0, 0, 255);
        } else {
            tint(0, sin(frameCount)*25+230, 0, 255);
        }
        image(graphics, width/2, 20, 25, 35);
        if(barX < 285) {
        tint(0, 0, 0, 255);
        } else {
            tint(0, sin(frameCount)*25+230, 0, 255);
        }
        image(graphics, 300, 20, 25, 35);
        imageMode(CORNER);
        textFont(createFont(""));
        if (button(width - 30, 30, 30, 30, "| |", 15)) {
            this.paused = true;
        }
        for (var i = 0; i < exits.length; i++) {
            if (exits[i].complete) { // to next level
                objects1.remove();
                self.level++;
                self.loadMap();
            }
        }
        if (keys[82]) {
            objects1.remove();
            self.loadMap();
        }
        if (this.level >= this.levels.length - 1) {
            transparency = 0;
            mute = "off";
        }
        for (var i = 0; i < players.length; i++) {
            // constrain the player from falling off the screen
            if (players[i].x < 0) {
                players[i].x = 0;
            }
            if (players[i].x + players[i].w > this.levelSize[0]) {
                players[i].x = this.levelSize[0] - players[i].w;
            }
            if (players[i].y > this.levelSize[1]) {
                players[i].dead = true;
            }
            if (players[i].dead) {
                if (players[i].deathCounter < 100) {
                    players[i].deathCounter++;
                } else {
                    sF -= 0.02;
                }
                if (sF < 0.01) {
                    players[i].dead = false; //put some objects back to their place but not all of them!
                    players[i].deathCounter = 0;
                    players[i].x = players[i].respawnx;
                    players[i].y = players[i].respawny;
                    for (var a = 0; a < robots.length; a++) {
                        robots[a].move = true;
                        if (robots[a].type === "boss") {
                            robots[a].position.x = robots[a].respawnx;
                            robots[a].position.y = robots[a].respawny;
                        } else {
                            robots[a].x = robots[a].respawnx;
                            robots[a].y = robots[a].respawny;
                        }
                    }
                    sF = 0.5;
                }
            }
        }
        if (this.level === 0) {
            if (button(width / 2 + 90, 360, 100, 30, "skip Tutorial", 15)) {
                this.level = 1;
                objects1.remove();
                self.loadMap();
            }
        }
        noStroke();
        fill(screenColor[0], screenColor[1], screenColor[2], transparency);
        rect(0, 0, width, height);
    } else {
        background(200, 200, 200);
        rectMode(CENTER);
        strokeWeight(5);
        stroke(0, 0, 0);
        fill(0, 0, 0, 100);
        rect(width / 2, height / 2, width / 2, height / 2, 10);
        rectMode(LEFT);
        textAlign(CENTER, CENTER);
        textSize(25);
        fill(0, 0, 0);
        text("Game Paused", width / 2, height / 3);
        if (button(width / 2 - 50, height / 2 - 30, 100, 30, "Resume", 15)) {
            this.paused = false;
        }
        if (button(width / 2 - 50, height / 2 + 30, 100, 30, "Sound is: " + mute, 12)) {
            if (mute === "on") {
                mute = "off";
            } else {
                mute = "on";
            }
        }
        if(this.level === 0) {
        text("Story:\n\nI came to this planet in peace, yet they locked\nme up, and took my ship!\nNow I shall escape!  I will make them pay!", 200, 350);
        } else if(this.level === 1) {
        text("Story:\n\nI passed that level, but the levels are getting tougher!", 200, 350);
        } else if(this.level ===2) {
            text("Story:\n\nSuddenly I've developed\na fear of robots...", 200, 350);
        } else if(this.level === 3) {
        text("Story:\n\nMore robots?\nARRRGH!!!", 200, 350);
        } else if(this.level === 4) {
        text("Story:\n\nThis place is so dangerous, that I almost WANT\nto be back in my cage...", 200, 350);
        } else if(this.level === 5) {
        text("Story:\n\nThis level is small, but it's sooo tough!", 200, 350);
        } else if(this.level === 6) {
         text("Story:\n\nAnother small level!\nBut this one also looks tough,\nwho can afford all these robots?", 200, 350);  
        } else if(this.level === 7) {
         text("Story:\n\nThere are a lot of holes!\nMaybe if I'm fast enough I can\nrun over them, maybe even with a block...", 200, 350);  
        } else if(this.level === 8) {
         text("Story:\n\nI AM FREE!!!!", 200, 350);  
        }
    }
};
// create a game
var game = new Game();
game.loadMap();
//level select:
var selectState = 1;
var timer = 0;
var lvlButton = function(x, y, lvl, stars) {
    this.timer=0;
    this.x = x;
    this.y = y;
    this.lvl = lvl-1;
    this.stars = 0;
    this.mx = this.x + 50;//middle x
    this.my = this.y + 50;//middle y
    this.score = 0;
    this.locked = true;
    this.mouseOn = false;
    this.sF = 1; //scale factor
    this.draw = function() {
        fill(84, 84, 84, 144);
        strokeWeight(5);
        stroke(112, 112, 112);
        rect(this.x - 50, this.y - 50, 100, 100, 20);
        textFont(createFont("Arial Black"));
        textAlign(CENTER, CENTER);
        fill(0, 0, 0);
        textSize(20);
        if(this.lvl!==0){
            text("level " + this.lvl, this.x, this.y + 65);
        }else{
            text("Tutorial", this.x, this.y + 65);
        }
        
        pushMatrix();
        translate(this.x, this.y);
        scale(this.sF);
        if (!this.locked) {
            textSize(15);
            text("Score\n" + this.score, 0, 20);
        }
        //stars
        if (!this.locked) {
            for (var i = 0; i < 3 - this.stars; i++) {
                pushMatrix();
                translate(0, 10);
                rotate(-102 - i * 52);
                tint(40, 40, 40, 52);
                image(graphics, 0, 0, 35, 60);
                popMatrix();
            }
            for (var i = 0; i < this.stars; i++) {
                pushMatrix();
                translate(0, 10);
                rotate(-206 + i * 52);
                tint(255, 255, 255, 255);
                image(graphics, 0, 0, 35, 60);
                popMatrix();
            }
        }
        if (this.locked) { //lock pad
            noFill();
            strokeWeight(7);
            arc(0, -12, 40, 50, 180, 360);
            strokeWeight(3);
            stroke(122, 122, 122);
            arc(0, -12, 40, 50, 180, 360);
            stroke(99, 99, 99);
            strokeWeight(3);
            fill(110, 110, 110);
            rect(-30, -10, 60, 40, 3);
            fill(36, 36, 36);
            noStroke();
            ellipse(0, 6, 15, 15);
            triangle(0, 0, -8, 25, 8, 25);
        }
        popMatrix();
    };
    this.update = function(thegame) {
        if (mouseX > this.x - 50 && mouseX < this.x + 50 && mouseY > this.y - 50 && mouseY < this.y + 50) {
            this.mouseOn = true;
        } else {
            this.mouseOn = false;
        }
        if (this.mouseOn) {
            if (this.locked) {
                this.sF = 1.1;
            } else {
                this.sF = 1.05;
            }
        } else {
            this.sF = 1;
        }
        
        
    };
};
var lvlB = [];
lvlB.add = function(numx, numy, lvl) {
    this.push(new lvlButton(numx, numy, lvl));
};
lvlB.apply = function() {
    for (var i = 0; i < this.length; i++) {
        this[i].draw();
        this[i].update();
        if(i<game.levels.length){
            this[i].locked=false;
        }
        if(this[i].locked===false&&this[i].mouseOn&&mouse[LEFT]&&mouseReleased){
            objects1.remove();
            game.level=this[i].lvl;
            game.loadMap();
            gamestate="play";
            
        }
        
    }
};
lvlB.add(70, 140, 1);
lvlB.add(190, 140, 2);
lvlB.add(310, 140, 3);
lvlB.add(70, 280, 4);
lvlB.add(190, 280, 5);
lvlB.add(310, 280, 6);
var stars = [];
var op = 0;
for (var i = 0; i < 70; i++) {
    stars.push([random(-20, 420), random(-20, 420), random(5, 15)]);
}
var LevelSelect = function() {
    var sF = 0.5;
var deadTimer = 0;
var deathTicks = 0;
var beaker = function(x,y,type,color,s){
    pushMatrix();
    strokeWeight(2);
    translate(x,y);
    scale(s);
    if(type===1){
        fill(color);
        stroke(191, 191, 191,150);
        rect(0,0,10,40,5);
        fill(255, 255, 255);
        rect(-2,-2,14,5,5);
        stroke(255, 255, 255,70);
        strokeWeight(4);
        point(5,10);
        point(4,19);
        point(7,26);
        point(3,34);
        
    }else if(type===2){
       
        strokeWeight(2);
        stroke(191, 191, 191,150);
        
        fill(191,191,191,150);
        rect(-4,-30,8,30);
        rect(-6.6,-34,12,5,3);
        fill(color);
        rect(-4,-24,8,30);
        arc(0,0,30,30,-72,258);
        strokeWeight(4);
        stroke(191,191,191,60);
        point(0,0);
        point(10,0);
        point(4,8);
        point(-6,-11);
        point(-5,4);
        point(3,-10);
        point(-12,0);
        point(-3,11);
        point(0,-18);
    }else if(type===3){
        fill(color);
        stroke(191,191,191,150);
        strokeWeight(2);
        triangle(-15,-10,15,-10,0,-30);
        fill(191,191,191,150);
        rect(-4,-40,8,15);
        rect(-6,-42,12,5,2);
        fill(191);
        rect(-4,-29,8,3);
        stroke(191,191,191,50);
        strokeWeight(4);
        point(-10,-12);
        point(8,-12);
        point(-5,-17);
        point(3,-19);
        point(-2,-12);
        
    }
    
    popMatrix();
};
var A = function(x,y){



pushMatrix();
translate(x-width/2,y-height/2);
scale(sF);
fill(2,255,0);
strokeWeight(2);
stroke(0, 190, 0);
beginShape();

curveVertex(214,122);
curveVertex(236,174);
curveVertex(231,168);
curveVertex(220,163);
curveVertex(207,162);
curveVertex(195,165);
curveVertex(186,174);
curveVertex(178,192);
curveVertex(171,215);
curveVertex(166,229);
curveVertex(163,235);
curveVertex(158,238);
curveVertex(158,241);
curveVertex(163,244);
curveVertex(170,241);
curveVertex(180,240);
curveVertex(190,243);
curveVertex(198,241);
curveVertex(206,240);
curveVertex(211,245);
curveVertex(221,245);
curveVertex(225,242);
curveVertex(231,240);
curveVertex(240,242);
curveVertex(244,240);
curveVertex(242,232);
curveVertex(241,229);
curveVertex(239,211);
curveVertex(239,195);
curveVertex(235,172);
endShape(CLOSE);

fill(255, 255, 255);

stroke(0);

ellipse(214,190,18,20);

ellipse(235,188,13,20);

fill(0, 0, 0);

ellipse(217,191,8,10);

ellipse(237,190,6,10);

noFill();
strokeWeight(1);

arc(226,208,20,3,36,121);



popMatrix();

};

var ALIEN = function(x,y,direction,push){

    if(direction === "right"){

        A(x,y);

    }else if(direction === "left"){

        pushMatrix();
translate(x+-200,y);
scale(-1,1);

        A(0,0);

        popMatrix();

    }else if(direction==="none"){
        


pushMatrix();
translate(x-width/2,y-height/2);
scale(sF);
fill(0,255,0);
strokeWeight(2);
stroke(0, 190, 39);
beginShape();


curveVertex(246,232);
curveVertex(235,216);
curveVertex(232,189);
curveVertex(225,171);
curveVertex(212,163);
curveVertex(197,161);
curveVertex(185,165);
curveVertex(174,178);
curveVertex(168,213);
curveVertex(169,206);
curveVertex(166,229);
curveVertex(158,240);
curveVertex(170,242);
curveVertex(182,240);
curveVertex(191,243);
curveVertex(200,245);
curveVertex(207,240);
curveVertex(212,239);
curveVertex(219,242);
curveVertex(221,243);
curveVertex(228,240);
curveVertex(229,239);
curveVertex(235,239);
curveVertex(240,239);
curveVertex(240,232);
curveVertex(236,227);
curveVertex(234,199);
endShape(CLOSE);

fill(255, 255, 255);

stroke(0);

ellipse(190,190,18,20);

ellipse(215,190,18,20);

fill(0, 0, 0);

ellipse(190,192,8,10);

ellipse(215,192,8,10);

noFill();
strokeWeight(1);

arc(202,208,20,3,36,121);


popMatrix();


    }else if(direction==="dead"){
        

deadTimer++;
var flash = random(8,12);
if(deadTimer>flash){
    deadTimer=0;
}
if(deadTimer>flash/2){
    fill(255, 255, 255);
}else {
   fill(0, 0, 0); 
}
pushMatrix();
translate(x-width/2,y-height/2);
translate(random(-2,2),random(-2,2));
scale(sF);
noStroke();
beginShape();

curveVertex(211,177);
curveVertex(206,169);
curveVertex(201,163);
curveVertex(195,166);
curveVertex(195,173);
curveVertex(189,176);
curveVertex(181,176);
curveVertex(170,178);
curveVertex(170,185);
curveVertex(169,193);
curveVertex(157,204);
curveVertex(157,211);
curveVertex(169,217);
curveVertex(171,228);
curveVertex(173,232);
curveVertex(181,233);
curveVertex(192,231);
curveVertex(202,233);
curveVertex(212,235);
curveVertex(217,228);
curveVertex(230,225);
curveVertex(236,217);
curveVertex(224,214);
curveVertex(225,204);
curveVertex(234,200);
curveVertex(233,191);
curveVertex(222,184);
curveVertex(219,177);
curveVertex(217,172);
curveVertex(208,170);
endShape(CLOSE);
ellipse(186,170,12,10);
ellipse(191,239,16,10);
ellipse(232,213,10,13);
fill(255, 255, 255);
ellipse(185,195,18,20);
ellipse(209,195,18,20);
fill(0, 0, 0);
ellipse(185,196,10,12);
ellipse(209,196,10,12);
noFill();
stroke(255, 255, 255);
strokeWeight(1);

arc(196,212,20,-3,36,121);
popMatrix();


//copy the code above and paste it into a program, then chose the fill the color of your choice!

    }

    

};
        background(153, 153, 153);
        strokeWeight(5);
        fill(125);
        rect(-20,-20,440,150);
        stroke(71, 0, 77);
        fill(4, 48, 0);
        rect(-20,20,122,80);
        fill(255, 255, 255,100);
        textAlign(CORNER);
        textSize(11);
        textFont(createFont("arial"));//writting on the board
        text(Array,5,40, 120, 100);
        stroke(0, 0, 0);
        pushStyle();
        pushMatrix();
        translate(200, 50);
        scale(0.5, 0.5);
        fill(0, 255, 0);
        textAlign(CENTER,CENTER);

        
        textFont(createFont("Arial Bold"));
        textSize(75);
        text("BLOBBY'S\n",0,0);
        fill(100);
        text("\nESCAPE",0,0);
        fill(0,255,0);
        noStroke();
        //B
        ellipse(-182,-25,12,40);
        ellipse(-153,-15,12,40);
        ellipse(-182,-60,7,28);
        //L
        ellipse(-125,-25,12,40);
        //B, B
        ellipse(33,-20,12,40);
        ellipse(0,-25,12,40);
        //Y
        ellipse(84,-50,8,30);
        ellipse(107,-40,10,30);
        //S
        ellipse(186,-40,6,30);
        ellipse(165,-30,10,30);
        ellipse(182,-20,8,30);
        //PLAN
        //EYE
        fill(255, 255, 255);
        stroke(0, 0, 0);
        ellipse(-63,-44,29,37);
        fill(0, 0, 0);
        ellipse(-63,-44,15,15);
        
        popMatrix();
        popStyle();
        for(var i=0;i<400;i+=40){//draw the floor lines
            strokeWeight(3);
            line(i,130,i*2-200,400);
            strokeWeight(1);
            line(0,160+i,400,160+i);
        }
        strokeWeight(5);
        stroke(32, 0, 48);
        fill(113, 0, 158);
        
        quad(280,160,120,160,40,350,360,350);//the table
        rect(38,350,324,40,5);
        pushMatrix();
        scale(2.5,3+cos(millis()/2)/35);
        ALIEN(180,180,"none");
        popMatrix();
        fill(255, 255, 255);
        rect(323,182,10,79);
        rect(380,286,10,79);
        quad(310,162,430,164,536,306,375,300);
        rect(55,182,10,79);
        rect(42,209,10,79);
        quad(-111,162,72,164,49,212,-336,200);
        fill(0,255,0);
        noStroke();
        ellipse(203,242,70,100);//cover that face so we don't see that smile!
        fill(87, 244, 255);//draw the tears
        ellipse(173,223,8,15);
        ellipse(228,223,8,15);
        ellipse(163,228,8,10);
        ellipse(238,233,8,10);
        strokeWeight(3);
        stroke(0);
        fill(0,255,0);//draw the new face :(
        arc(185,225,25,14+cos(millis()),200,320);
        arc(219,225,25,14+cos(millis()),200,320);
        arc(200,252,30,5+cos(millis()/2)*2,180,360);
        noFill();
        
        strokeWeight(10);
        stroke(0);
        arc(200,330,500,100,240,302);
        arc(200,241,500,100,249,292);
        //the beakers
        beaker(351,147,1,color(13, 255, 0),1.3);
        beaker(393,193,3,color(255, 111, 0),1.3);
        beaker(374,231,2,color(153, 0, 255),1.3);
        
        beaker(-1,129,1,color(13, 255, 0),1.3);
        beaker(18,134,1,color(255, 170, 0),1.3);
        beaker(37,127,1,color(255, 0, 247),1.3);
        beaker(38,190,2,color(255, 0, 0),1);
        pushStyle();
    if (selectState === 1) {
        
        
        if (button(width / 2 - 80, height / 2 + 130, 160, 50, "PLAY!", 40)) {
            objects1.remove();
            game.level=0;
            game.loadMap();
            gamestate = "play";
        }
        if (button(width / 2 + 100, height / 2 - 200, 100, 40, "Level Select", 16)) {
            selectState = 2;
            gamestate = "select";
        }
        
    } else if (selectState === 2) {
        lvlB.apply();
        op = 50;
        textSize(50);
        fill(0, 0, 0);
        text("Level Select", 200, 30);
        textSize(50);
        fill(255, 255, 255);
        text("Level Select", 203, 33);
        text("level: "+game.level,200,375);
        
    }
};
draw = function() {
    if (gamestate === "select") {
        LevelSelect();
    } else if (gamestate === "play") {
        background(125);
        game.apply();
    }
        if(game.level < 5) {
    amount = 5;
} else {
    amount = 37;
}
if(keys[82]) {
    barX = 0;
}
};

} 

PJSLoader.loadSketch("canvas", main);
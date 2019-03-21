/**
 * Ambient
 */

var x = document.getElementById("soundtrack"); 

function musicOn() { 
  x.play(); 
} 

function musicOff() { 
  x.pause(); 
} 

/**
 * World/Playingfield construction
 */

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 600; 
canvas.height = 600;
var boardContainer = document.getElementById("boardContainer");
boardContainer.appendChild(canvas);

ctx.beginPath();
ctx.rect(0, 0, 600, 600);
ctx.fillStyle = 'green';
ctx.fill();

/**
 * Matrix for numerical representations of game objects
 */
class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.value = [];

        for (var i = 0; i < this.rows; i++) {
            this.value[i] = []; // fill each row with empty array
            for (var j = 0; j < this.cols; j++) {   
                this.value[i][j] = 0; // fill each column with intial value of zero
            }
        } 
    }
    // function for filling each box with random number
    randomize() {
        for (var i = 0; i < this.rows; i++) {

            for (var j = 0; j < this.cols; j++) {
                this.value[i][j] = Math.floor(Math.random() * Math.floor(5)); 
            }
        }
    }  
}


//create map
var map = new Matrix(10,10); 

/**
 * Box for one 60x60px area in the 10x10 boxes matrix
 */
class Box {
	constructor (row,col) {
		this.row = row;
        this.col = col;
    }

    createBox() {
        ctx.beginPath();
        ctx.rect(this.col * 60, this.row * 60, boxSize, boxSize);  
    }
}

var boxSize = 60; // 60x60 pixels in size
var contentBox;
var contentBoxes = [];

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "pics/field.jpg";


/**
 * GAME OBJECTS
 */

/**
 * Weapon Declarations
 */

class Weapon {
	constructor (weaponId, name, damage) {
		this.weaponId = weaponId;
        this.name = name;
        this.damage = damage;
    }
}

var hands = new Weapon(null, "Hands", 10);
var grass = new Weapon(70, "Grass Sword", 20);
var finnSword = new Weapon(71, "Finn Sword", 20);
var scarletSword = new Weapon(72, "Scarlet Sword", 20);
var magicWand = new Weapon(73, "Magic Wand", 30);
var mushBomb = new Weapon(74, "Mushroom Bomb", 40);
var demonSword = new Weapon(75, "Demon Sword", 20);

/**
 * Weapon Images
 */

//Grass Sword
var grassReady = false;
var grassImage = new Image();
grassImage.onload = function () {
	grassReady = true;
};
grassImage.src = "pics/grass.png";

//Finn Sword
var finnSwordready = false;
var finnSwordimage = new Image();
finnSwordimage.onload = function () {
	finnSwordready = true;
};
finnSwordimage.src = "pics/finnsword.png";

//Scarlet Sword
var scarletSwordready = false;
var scarletSwordimage = new Image();
scarletSwordimage.onload = function () {
	scarletSwordready = true;
};
scarletSwordimage.src = "pics/scarlet.png";

//Magic Wand
var magicWandready = false;
var magicWandimage = new Image();
magicWandimage.onload = function () {
	magicWandready = true;
};
magicWandimage.src = "pics/star.png";

//Mushroom Bomb
var mushBombready = false;
var mushBombimage = new Image();
mushBombimage.onload = function () {
	mushBombready = true;
};
mushBombimage.src = "pics/mbomb.png";

//Mushroom Bomb
var demonSwordready = false;
var demonSwordimage = new Image();
demonSwordimage.onload = function () {
	demonSwordready = true;
};
demonSwordimage.src = "pics/demon.png";


/**
 * Obstacle Declaration
 */
var rocks = []; 

/**
 * Obstacle Image
 */

var rockReady = false;
var rockImage = new Image();
rockImage.onload = function () {
	rockReady = true;
};
rockImage.src = "pics/rock.png";

/**
 * Heroes Declarations
 */
class Hero1 {
	constructor (x, y, health, damage, weapon) {
		this.x = x;
		this.y = y;
		this.health = health;
        this.weapon = weapon;
        this.damage = weapon.damage;
    }
	
	// getters
	getCurrentPosition() {
		return map.value[this.x/60][this.y/60];
	}
	
	getPositionAbove() {
		return map.value[this.x/60][(this.y/60)-1];
	}
	
	getPositionBelow() {
		return map.value[this.x/60][(this.y/60)+1];
	}
	
	getPositionLeft() {
		return map.value[(this.x/60)-1][this.y/60];
	}

	getPositionRight() {
		return map.value[(this.x/60)+1][this.y/60];
	}
	
	// setters
	setCurrentPosition(value) {
		map.value[this.x/60][this.y/60] = value;
	}
	
	setPositionAbove(value) {
		map.value[this.x/60][(this.y/60)-1] = value;
	}
	
	setPositionBelow(value) {
		map.value[this.x/60][(this.y/60)+1] = value;
	}
	
	setPositionLeft(value) {
		map.value[(this.x/60)-1][this.y/60] = value;
	}

	setPositionRight(value) {
		map.value[(this.x/60)+1][this.y/60] = value;
	}
	
	
	updatePosition(x,y) {
		this.x += x;
		this.y += y;
		if(x != 0 || y != 0) { // hero did a move 
			this.setCurrentPosition(88);
		}
		if(x>0) { // hero moves right
			this.setPositionLeft(1);
		}
		if(x<0) { // hero moves left
			this.setPositionRight(1);
		}
		if(y<0) { // her moves up
			this.setPositionBelow(1);
		}
		if(y>0) { // hero moves down
			this.setPositionAbove(1);
		}
	}
	
	opponentInVicinity() {
		return 	this.getPositionAbove() == 89 ||
				this.getPositionBelow() == 89 ||
				this.getPositionRight() == 89 ||
				this.getPositionLeft() == 89;
	}
	
}

class Hero2 {
	constructor (x, y, health, damage, weapon) {
		this.x = x;
		this.y = y;
		this.health = health;
        this.weapon = weapon;
        this.damage = weapon.damage;
    }
	
	// getters
	getCurrentPosition() {
		return map.value[this.x/60][this.y/60];
	}
	
	getPositionAbove() {
		return map.value[this.x/60][(this.y/60)-1];
	}
	
	getPositionBelow() {
		return map.value[this.x/60][(this.y/60)+1];
	}
	
	getPositionLeft() {
		return map.value[(this.x/60)-1][this.y/60];
	}

	getPositionRight() {
		return map.value[(this.x/60)+1][this.y/60];
	}
	
	// setters
	setCurrentPosition(value) {
		map.value[this.x/60][this.y/60] = value;
	}
	
	setPositionAbove(value) {
		map.value[this.x/60][(this.y/60)-1] = value;
	}
	
	setPositionBelow(value) {
		map.value[this.x/60][(this.y/60)+1] = value;
	}
	
	setPositionLeft(value) {
		map.value[(this.x/60)-1][this.y/60] = value;
	}

	setPositionRight(value) {
		map.value[(this.x/60)+1][this.y/60] = value;
	}
	
	
	updatePosition(x,y) {
		this.x += x;
		this.y += y;
		if(x != 0 || y != 0) { // hero did a move 
			this.setCurrentPosition(89);
		}
		if(x>0) { // hero moves right
			this.setPositionLeft(1);
		}
		if(x<0) { // hero moves left
			this.setPositionRight(1);
		}
		if(y<0) { // her moves up
			this.setPositionBelow(1);
		}
		if(y>0) { // hero moves down
			this.setPositionAbove(1);
		}
	}
	
	opponentInVicinity() {
		return 	this.getPositionAbove() == 88 ||
				this.getPositionBelow() == 88 ||
				this.getPositionRight() == 88 ||
				this.getPositionLeft() == 88;
	}
	
}

var hero1 = new Hero1(0, 0, 100, 10, hands);
var hero2 = new Hero2(0, 0, 100, 10, hands);

/**
 * Hero Images
 */

//hero1 image
var hero1Ready = false;
var hero1Image = new Image();
hero1Image.onload = function () {
	hero1Ready = true;
};
hero1Image.src = "pics/fernMini.png";

// hero2 image
var hero2Ready = false;
var hero2Image = new Image();
hero2Image.onload = function () {
	hero2Ready = true;
};
hero2Image.src = "pics/finnMini.png";


/**
 * Handle keyboard controls
 */
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

/**
 * Reset/Create the game, place heros and obstacles
 */ 
var reset = function () {

	// fill map/matrix with random numerical values
	map.randomize(); 

	// create obstacles
	for (var row = 0; row < map.rows; row++) {
	    for (var col = 0; col < map.cols; col++) {
	        if (map.value[row][col] === 4) { // place stone
	            contentBox = new Box(row, col);
	            contentBox.createBox();
	            rock1 = {}
	        	rock1.x = contentBox.row * 60;
	        	rock1.y = contentBox.col * 60;
	        	rocks.push(rock1);
	            map.value[row][col] = 99; // set cell occupied
	            contentBoxes.push(contentBox); 
	        } else {
	        	contentBox = new Box(row, col);
	            contentBox.createBox();
	            map.value[row][col] = 1; // is not occupied
	            contentBoxes.push(contentBox);
	        } 
	    }
	} 
	
	// get a random free cell for hero 1
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] != 1) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
	
	// place hero 1
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
	hero1.x = contentBox.row * 60;
	hero1.y = contentBox.col * 60;
    map.value[randomRow][randomCol] = 88; // set cell occupied
    contentBoxes.push(contentBox); 

    // get a random free cell for hero 2
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] != 1) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
	
	// place hero 2
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
	hero2.x = contentBox.row * 60;
	hero2.y = contentBox.col * 60;
	map.value[randomRow][randomCol] = 89; // set cell occupied
    contentBoxes.push(contentBox); 
	
    // get a random free cell for Grass Sword Weapon
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] != 1) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
	
	// place  Grass Sword Weapon
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
	grass.x = contentBox.row * 60;
	grass.y = contentBox.col * 60;
	map.value[randomRow][randomCol] = 70; // set cell occupied
    contentBoxes.push(contentBox); 
  
    
    //get a random free cell for Finn Sword Weapon
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] != 1) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
    
	// place Finn Sword Weapon
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
	finnSword.x = contentBox.row * 60;
	finnSword.y = contentBox.col * 60;
	map.value[randomRow][randomCol] = 71; // set cell occupied
    contentBoxes.push(contentBox); 
    
    // get a random free cell for Scarlet Sword Weapon
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] != 1) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
    
	// place Scarlet Sword Weapon
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
	scarletSword.x = contentBox.row * 60;
	scarletSword.y = contentBox.col * 60;
	map.value[randomRow][randomCol] = 72; // set cell occupied
    contentBoxes.push(contentBox); 
    
    // get a random free cell for Magic Wand Weapon
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] != 1) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
    
	// place Magic Wand Weapon
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
	magicWand.x = contentBox.row * 60;
	magicWand.y = contentBox.col * 60;
	map.value[randomRow][randomCol] = 73; // set cell occupied
    contentBoxes.push(contentBox); 
    
    // get a random free cell for Mushroom Bomb Weapon
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] != 1) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
	
	// place Mushroom Bomb Weapon
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
    mushBomb.x = contentBox.row * 60;
    mushBomb.y = contentBox.col * 60;
	map.value[randomRow][randomCol] = 74; // set cell occupied
    contentBoxes.push(contentBox); 
    
    // get a random free cell for Demon Sword Weapon
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] != 1) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
    
	// place Demon Sword Weapon
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
    demonSword.x = contentBox.row * 60;
    demonSword.y = contentBox.col * 60;
	map.value[randomRow][randomCol] = 75; // set cell occupied
    contentBoxes.push(contentBox); 
    
};

const walkingSpeed = 60;
var steps = 0;
var playerOnesTurn = true;

var update = function (modifier) {

	// hero1
	if(playerOnesTurn) {
		if (38 in keysDown) { // Player holding up
			if(hero1.getPositionAbove() < 88) {
				if(hero1.getPositionAbove() == 70) {
					hero1.weapon = grass;
					hero1.damage = grass.damage;
					grassReady = false;
				}
				hero1.updatePosition(0,-walkingSpeed);
				steps++;
			} 
			delete keysDown[38];
			// moveCounter++
		} else if (40 in keysDown) { // Player holding down
			if(hero1.getPositionBelow() < 88) {
				if(hero1.getPositionBelow() == 70) {
					hero1.weapon = grass;
					hero1.damage = grass.damage;
					grassReady = false;
				}
				hero1.updatePosition(0, walkingSpeed);
				steps++;
			} 
			delete keysDown[40];
		} else if (37 in keysDown) { // Player holding left
			if(hero1.getPositionLeft() < 88) {
				if(hero1.getPositionLeft() == 70) {
					hero1.weapon = grass;
					hero1.damage = grass.damage;
					grassReady = false;
				}
				hero1.updatePosition(-walkingSpeed, 0);
				steps++;
			} 
			delete keysDown[37];
		} else if (39 in keysDown) { // Player holding right
			if(hero1.getPositionRight() < 88) {
				if(hero1.getPositionRight() == 70) {
					hero1.weapon = grass;
					hero1.damage = grass.damage;
					grassReady = false;
				}
				hero1.updatePosition(walkingSpeed, 0);
				steps++;
			} 
			delete keysDown[39];
		} else if (189 in keysDown) { // Player 1 deals damage (c)
			if(hero1.opponentInVicinity()) {
				hero2.health -= hero1.damage;
				steps++;
			} 
			delete keysDown[189];
		}
		if(steps == 3) {
			playerOnesTurn = false;
			steps = 0;
		}
	} else { // hero2 87 83
		if (87 in keysDown) { // Player holding up
			if(hero2.getPositionAbove() < 88) {
				if(hero2.getPositionAbove() == 70) {
					hero2.weapon = grass;
					hero2.damage = grass.damage;
					grassReady = false;
				}
				hero2.updatePosition(0,-walkingSpeed);
				steps++;
			} 
			delete keysDown[87];
		} else if (83 in keysDown) { // Player holding down
			if(hero2.getPositionBelow() < 88) {
				if(hero2.getPositionBelow() == 70) {
					hero2.weapon = grass;
					hero2.damage = grass.damage;
					grassReady = false;
				}
				hero2.updatePosition(0, walkingSpeed);
				steps++;
			} 
			delete keysDown[83];
		} else if (65 in keysDown) { // Player holding left
			if(hero2.getPositionLeft() < 88) {
				if(hero2.getPositionLeft() == 70) {
					hero2.weapon = grass;
					hero2.damage = grass.damage;
					grassReady = false;
				}
				hero2.updatePosition(-walkingSpeed, 0);
				steps++;
			} 
			delete keysDown[65];
		} else if (68 in keysDown) { // Player holding right
			if(hero2.getPositionRight() < 88) {
				if(hero2.getPositionRight() == 70) {
					hero2.weapon = grass;
					hero2.damage = grass.damage;
					grassReady = false;
				}
				hero2.updatePosition(walkingSpeed, 0);
				steps++;
			} 
			delete keysDown[68];
		} else if (67 in keysDown) { // Player 2 deals damage (c)
			if(hero2.opponentInVicinity()) {
				hero1.health -= hero2.damage;
				steps++;
			} 
			delete keysDown[67];
		}
		
		if(steps == 3) {
			playerOnesTurn = true;
			steps = 0;
		}
	}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (hero1Ready) {
		ctx.drawImage(hero1Image, hero1.x, hero1.y);
	}

	if (hero2Ready) {
		ctx.drawImage(hero2Image, hero2.x, hero2.y);
	}
	
	if (rockReady) {
		rocks.forEach(
			rock => ctx.drawImage(rockImage, rock.x, rock.y, 60, 60)
		);
	}
	
	if (grassReady) {
		ctx.drawImage(grassImage, grass.x, grass.y, 60, 60);
	}
	
	if (finnSwordready) {
		ctx.drawImage(finnSwordimage, finnSword.x, finnSword.y, 60, 60);
	}
	
	if (scarletSwordready) {
		ctx.drawImage(scarletSwordimage, scarletSword.x, scarletSword.y, 60, 60);
	}
	
	if (magicWandready) {
		ctx.drawImage(magicWandimage, magicWand.x, magicWand.y, 60, 60);
	}
	
	if (mushBombready) {
		ctx.drawImage(mushBombimage, mushBomb.x, mushBomb.y, 60, 60);
	}
	
	if (demonSwordready) {
		ctx.drawImage(demonSwordimage, demonSword.x, demonSword.y, 60, 60);
	};

	
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	if(playerOnesTurn) {
		ctx.fillText("It's hero1's turn.", 32, 32);
	} else {
		ctx.fillText("It's hero2's turn.", 32, 32);
	}
	ctx.fillText("steps: " + steps, 32, 64);
	ctx.fillText("hero 1 health: " + hero1.health, 32, 96);
	ctx.fillText("hero 1 damage: " + hero1.damage, 32, 128);
	ctx.fillText("hero 2 health: " + hero2.health, 32, 160);
	ctx.fillText("hero 2 damage: " + hero2.damage, 32, 196);
	
	
	if(hero1.health == 0) {
		ctx.fillText("hero 2 won.", 32, 228);
		// reset game
		// more visuals perhaps
	} else if (hero2.health == 0) {
		ctx.fillText("hero 1 won.", 32, 228);
		// reset game 
	}
	
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame ||
						w.webkitRequestAnimationFrame ||
						w.msRequestAnimationFrame ||
						w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();















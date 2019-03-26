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
 * Disable arrow keys scrolling in a browser
 */
var arrow_keys_handler = function(e) {
    switch(e.keyCode){
        case 37: case 39: case 38:  case 40: // Arrow keys
        case 32: e.preventDefault(); break; // Space
        default: break; // do not block other keys
    }
};
window.addEventListener("keydown", arrow_keys_handler, false);


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
bgImage.src = "pics/field2.jpg";


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
rockImage.src = "pics/stone.png";

/**
 * Heroes Declarations
 */
class Hero1 {
	constructor (name, x, y, health, damage, weapon, isBlocking) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.health = health;
        this.weapon = weapon;
        this.damage = weapon.damage;
        this.isBlocking = isBlocking;
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
	
	isBlocking() {
		return this.isBlocking;
	}
	
}

class Hero2 {
	constructor (name, x, y, health, damage, weapon, isBlocking) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.health = health;
        this.weapon = weapon;
        this.damage = weapon.damage;
        this.isBlocking = isBlocking;
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

var hero1 = new Hero1("Fern", 0, 0, 100, 10, hands, false);
var hero2 = new Hero2("Finn", 0, 0, 100, 10, hands, false);

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
 * Finds a random box (on the matrix)
 * that is free, i.e., has the "1" as
 * the (x,y) value.
 */
class FreeCellFinder {
	find(map) {
		var randomRow = map.rows * Math.random() | 0;
		var randomCol = map.cols * Math.random() | 0;
		while(map.value[randomRow][randomCol] != 1) { // already occupied by stone, do again
			randomRow = map.rows * Math.random() | 0;
			randomCol = map.cols * Math.random() | 0;
		}
		return new FreeCellCoords(randomRow, randomCol);
	}
}

/**
 * Utility class to encapsulates the 
 * coordinates of the free cell.
 */
class FreeCellCoords {
	constructor(row, col) {
		this.row = row;
		this.col = col;
	}
}

/**
 * Class to place an item on the map/matrix and 
 * create a content box. 
 */
class ItemPlacer {
	place(fcf, item, itemId, map, contentBoxes) {
		var fcc = fcf.find(map); // find free cell cords
		var contentBox = new Box(fcc.row, fcc.col);
		contentBox.createBox();
		item.x = contentBox.row * 60;
		item.y = contentBox.col * 60;
		map.value[fcc.row][fcc.col] = itemId; // set cell occupied
		contentBoxes.push(contentBox); 
	}
}

/**
 * Reset/Create the game: place items on map 
 * (obstacles, heros and weapons).
 */ 
var reset = function () {

	// fill map/matrix with random numerical values
	map.randomize(); 

	/**
	 * For the obstacle items (rocks):
	 * (a) find a free cell,
	 * (b) place items on the map (set 99 on matrix),
	 * (c) set all other matrix cells to free (1).
	 */
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
	
	/**
	 * For NON-obstacle items:
	 * (a) find a free cell,
	 * (b) place items on the map.
	 */
	var itemPlacer = new ItemPlacer(); // places items
	var fcf = new FreeCellFinder(); // finds free cells
	
    itemPlacer.place(fcf, hero1, 88, map, contentBoxes);
    itemPlacer.place(fcf, hero2, 89, map, contentBoxes);
    itemPlacer.place(fcf, grass, 70, map, contentBoxes);
    itemPlacer.place(fcf, finnSword, 71, map, contentBoxes);
    itemPlacer.place(fcf, scarletSword, 72, map, contentBoxes);
    itemPlacer.place(fcf, magicWand, 73, map, contentBoxes);
    itemPlacer.place(fcf, mushBomb, 74, map, contentBoxes);
    itemPlacer.place(fcf, demonSword, 75, map, contentBoxes);
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
				} else if(hero1.getPositionAbove() == 71) {
					hero1.weapon = finnSword;
					hero1.damage = finnSword.damage;
					finnSwordready = false;
				} else if(hero1.getPositionAbove() == 72) {
					hero1.weapon = scarletSword;
					hero1.damage = scarletSword.damage;
					scarletSwordready = false;
				} else if(hero1.getPositionAbove() == 73) {
					hero1.weapon = magicWand;
					hero1.damage = magicWand.damage;
					magicWandready = false;
				} else if(hero1.getPositionAbove() == 74) {
					hero1.weapon = mushBomb;
					hero1.damage = mushBomb.damage;
					mushBombready = false;
				} else if(hero1.getPositionAbove() == 75) {
					hero1.weapon = demonSword;
					hero1.damage = demonSword.damage;
					demonSwordready = false;
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
				} else if(hero1.getPositionBelow() == 71) {
					hero1.weapon = finnSword;
					hero1.damage = finnSword.damage;
					finnSwordready = false;
				} else if(hero1.getPositionBelow() == 72) {
					hero1.weapon = scarletSword;
					hero1.damage = scarletSword.damage;
					scarletSwordready = false;
				} else if(hero1.getPositionBelow() == 73) {
					hero1.weapon = magicWand;
					hero1.damage = magicWand.damage;
					magicWandready = false;
				} else if(hero1.getPositionBelow() == 74) {
					hero1.weapon = mushBomb;
					hero1.damage = mushBomb.damage;
					mushBombready = false;
				} else if(hero1.getPositionBelow() == 75) {
					hero1.weapon = demonSword;
					hero1.damage = demonSword.damage;
					demonSwordready = false;
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
				} else if(hero1.getPositionLeft() == 71) {
					hero1.weapon = finnSword;
					hero1.damage = finnSword.damage;
					finnSwordready = false;
				} else if(hero1.getPositionLeft() == 72) {
					hero1.weapon = scarletSword;
					hero1.damage = scarletSword.damage;
					scarletSwordready = false;
				} else if(hero1.getPositionLeft() == 73) {
					hero1.weapon = magicWand;
					hero1.damage = magicWand.damage;
					magicWandready = false;
				} else if(hero1.getPositionLeft() == 74) {
					hero1.weapon = mushBomb;
					hero1.damage = mushBomb.damage;
					mushBombready = false;
				} else if(hero1.getPositionLeft() == 75) {
					hero1.weapon = demonSword;
					hero1.damage = demonSword.damage;
					demonSwordready = false;
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
				} else if(hero1.getPositionRight() == 71) {
					hero1.weapon = finnSword;
					hero1.damage = finnSword.damage;
					finnSwordready = false;
				} else if(hero1.getPositionRight() == 72) {
					hero1.weapon = scarletSword;
					hero1.damage = scarletSword.damage;
					scarletSwordready = false;
				} else if(hero1.getPositionRight() == 73) {
					hero1.weapon = magicWand;
					hero1.damage = magicWand.damage;
					magicWandready = false;
				} else if(hero1.getPositionRight() == 74) {
					hero1.weapon = mushBomb;
					hero1.damage = mushBomb.damage;
					mushBombready = false;
				} else if(hero1.getPositionRight() == 75) {
					hero1.weapon = demonSword;
					hero1.damage = demonSword.damage;
					demonSwordready = false;
				}
				hero1.updatePosition(walkingSpeed, 0);
				steps++;
			} 
			delete keysDown[39];
		} else if (191 in keysDown) { // Player 1 deals damage (/)
			if(hero1.opponentInVicinity()) {
				/**
				 * If the other hero (here hero2) is blocking,
				 * hero1 attacks deal less damage (hero2 health is
				 * reduced less). 
				 */
				if(hero2.isBlocking) { 
					hero2.health -= hero1.damage / 2;					
				} else {
					hero2.health -= hero1.damage;
				}
				healthBarProgress(hero2.name);
				steps++;
			} 
			delete keysDown[191];
		} else if (190 in keysDown) { // Player 2 defeats attack(x)
			if(hero1.isBlocking) { // hero currently blocking, restore
				heros.isBlocking = false;
				hero1.damage = hero1.damage * 2;
			} else { // hero currently not blocking, decrease his dmg
				hero1.isBlocking = true;
				hero1.damage = hero1.damage / 2;
			}
			steps++; 
			delete keysDown[190];
		}
		
		if(steps == 3) {
			playerOnesTurn = false;
			steps = 0;
		}
	} else { // hero2 
		if (87 in keysDown) { // Player holding up
			if(hero2.getPositionAbove() < 88) {
				if(hero2.getPositionAbove() == 70) {
					hero2.weapon = grass;
					hero2.damage = grass.damage;
					grassReady = false;
				} else if(hero2.getPositionAbove() == 71) {
					hero2.weapon = finnSword;
					hero2.damage = finnSword.damage;
					finnSwordready = false;
				} else if(hero2.getPositionAbove() == 72) {
					hero2.weapon = scarletSword;
					hero2.damage = scarletSword.damage;
					scarletSwordready = false;
				} else if(hero2.getPositionAbove() == 73) {
					hero2.weapon = magicWand;
					hero2.damage = magicWand.damage;
					magicWandready = false;
				} else if(hero2.getPositionAbove() == 74) {
					hero2.weapon = mushBomb;
					hero2.damage = mushBomb.damage;
					mushBombready = false;
				} else if(hero2.getPositionAbove() == 75) {
					hero2.weapon = demonSword;
					hero2.damage = demonSword.damage;
					demonSwordready = false;
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
				} else if(hero2.getPositionBelow() == 71) {
					hero2.weapon = finnSword;
					hero2.damage = finnSword.damage;
					finnSwordready = false;
				} else if(hero2.getPositionBelow() == 72) {
					hero2.weapon = scarletSword;
					hero2.damage = scarletSword.damage;
					scarletSwordready = false;
				} else if(hero2.getPositionBelow() == 73) {
					hero2.weapon = magicWand;
					hero2.damage = magicWand.damage;
					magicWandready = false;
				} else if(hero2.getPositionBelow() == 74) {
					hero2.weapon = mushBomb;
					hero2.damage = mushBomb.damage;
					mushBombready = false;
				} else if(hero2.getPositionBelow() == 75) {
					hero2.weapon = demonSword;
					hero2.damage = demonSword.damage;
					demonSwordready = false;
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
				} else if(hero2.getPositionLeft() == 71) {
					hero2.weapon = finnSword;
					hero2.damage = finnSword.damage;
					finnSwordready = false;
				} else if(hero2.getPositionLeft() == 72) {
					hero2.weapon = scarletSword;
					hero2.damage = scarletSword.damage;
					scarletSwordready = false;
				} else if(hero2.getPositionLeft() == 73) {
					hero2.weapon = magicWand;
					hero2.damage = magicWand.damage;
					magicWandready = false;
				} else if(hero2.getPositionLeft() == 74) {
					hero2.weapon = mushBomb;
					hero2.damage = mushBomb.damage;
					mushBombready = false;
				} else if(hero2.getPositionLeft() == 75) {
					hero2.weapon = demonSword;
					hero2.damage = demonSword.damage;
					demonSwordready = false;
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
				} else if(hero2.getPositionRight() == 71) {
					hero2.weapon = finnSword;
					hero2.damage = finnSword.damage;
					finnSwordready = false;
				} else if(hero2.getPositionRight() == 72) {
					hero2.weapon = scarletSword;
					hero2.damage = scarletSword.damage;
					scarletSwordready = false;
				} else if(hero2.getPositionRight() == 73) {
					hero2.weapon = magicWand;
					hero2.damage = magicWand.damage;
					magicWandready = false;
				} else if(hero2.getPositionRight() == 74) {
					hero2.weapon = mushBomb;
					hero2.damage = mushBomb.damage;
					mushBombready = false;
				} else if(hero2.getPositionRight() == 75) {
					hero2.weapon = demonSword;
					hero2.damage = demonSword.damage;
					demonSwordready = false; 
				}
				hero2.updatePosition(walkingSpeed, 0);
				steps++;
			} 
			delete keysDown[68];
		} else if (67 in keysDown) { // Player 2 deals damage (c)
			if(hero2.opponentInVicinity()) {
				/**
				 * If the other hero (here hero1) is blocking,
				 * hero2 attacks deal less damage (hero1 health is
				 * reduced less). 
				 */
				if(hero1.isBlocking) { 
					hero1.health -= hero2.damage / 2;					
				} else {
					hero1.health -= hero2.damage;
				}
				healthBarProgress(hero1.name);
				steps++;
			} 
			delete keysDown[67];
		} else if (88 in keysDown) { // Player 2 defeats attack(x)
			if(hero2.isBlocking) { // hero currently blocking, restore
				hero2.isBlocking = false;
				hero2.damage = hero2.damage * 2;
			} else { // hero currently not blocking, decrease his dmg
				hero2.isBlocking = true;
				hero2.damage = hero2.damage / 2;
			}
			steps++; 
			delete keysDown[88];
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

//Affect health bars



function healthBarProgress(heroName) {
	switch (heroName) {
	case "Fern":
		$("#healthFern").css('width', hero1.health +'%')
						.attr('aria-valuenow', hero1.health)
						.text(hero1.health + ' %');
        break;
	case "Finn":
		$("#healthFinn").css('width', hero2.health +'%')
						.attr('aria-valuenow', hero2.health)
						.text(hero2.health + ' %');
        break;
	default:
	        break;
	}
}





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















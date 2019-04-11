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
                this.value[i][j] = Math.floor(Math.random() * Math.floor(8)); 
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
rockImage.src = "pics/hay.png";

/**
 * Heroes Declarations
 */
class Hero {
	constructor (name, x, y, health, damage, weapon, isBlocking, heroId) {
		this.name = name;
		this.x = x;
		this.y = y;
		this.health = health;
        this.weapon = weapon;
        this.damage = weapon.damage;
        this.isBlocking = isBlocking;
        this.heroId = heroId;
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
		//peter.updateposition(20,30);
		/**
		 * Before updating, Check whether the old position value
		 * was a weapon. If yes, leave a "weapon value" behind.
		 */
		var upcomingPositionVal = map.value[this.x/60][this.y/60];
		var oldPositionVal;
		// is it a weapon?
		if(upcomingPositionVal >= 70 && upcomingPositionVal < 88) {
			oldPositionVal = upcomingPositionVal;
		} else { // it was not a weapon
			oldPositionVal = 1;
		}
		
		this.x += x;
		this.y += y;
		/**
		 * Move the character and update previous position
		 */
		if(x != 0 || y != 0) { // hero did a move 
			this.setCurrentPosition(this.heroId);
		}

		if(x>0) { // hero moves right
			this.setPositionLeft(oldPositionVal);
		}
		if(x<0) { // hero moves left
			this.setPositionRight(oldPositionVal);
		}
		if(y<0) { // her moves up
			this.setPositionBelow(oldPositionVal);
		}
		if(y>0) { // hero moves down
			this.setPositionAbove(oldPositionVal);
		}
	}
	
	opponentInVicinity() {
		if(this.heroId == 88) { // this this hero Finn?
			// check if Fern is nearby
			return 	this.getPositionAbove() == 89 ||
					this.getPositionBelow() == 89 ||
					this.getPositionRight() == 89 ||
					this.getPositionLeft() == 89;
		} else { // no, this hero is not Finn, it's Fern
			// check if Fern is nearby
			return 	this.getPositionAbove() == 88 ||
					this.getPositionBelow() == 88 ||
					this.getPositionRight() == 88 ||
					this.getPositionLeft() == 88;
		}
	}
}




var finn = new Hero("Finn", 0, 0, 100, 10, hands, false, 88);
var fern = new Hero("Fern", 0, 0, 100, 10, hands, false, 89);

/**
 * Hero Images
 */

//hero1 image
var finnReady = false;
var finnImage = new Image();
finnImage.onload = function () {
	finnReady = true;
};
finnImage.src = "pics/finnMini.png";


// hero2 image
var fernReady = false;
var fernImage = new Image();
fernImage.onload = function () {
	fernReady = true;
};
fernImage.src = "pics/fernMini.png";


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
	
    itemPlacer.place(fcf, finn, 88, map, contentBoxes);
    itemPlacer.place(fcf, fern, 89, map, contentBoxes);
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

	// Finn
	if(playerOnesTurn) {
		if (38 in keysDown) { // Player holding up
			if(finn.y != 0) { // hero is not at the upmost part of the map
				if(finn.getPositionAbove() < 88) { // no block?
					// move
					changeCharacterUsingNewPosFinn(finn.getPositionAbove());
					finn.updatePosition(0,-walkingSpeed);
					steps++;
				} 
			}
			delete keysDown[38];

		} else if (40 in keysDown) { // Player holding down
			if(finn.y/60 != 9) {// hero is not at the lowermost part of the map
				if(finn.getPositionBelow() < 88) {
					changeCharacterUsingNewPosFinn(finn.getPositionBelow());
					finn.updatePosition(0, walkingSpeed);
					steps++;
				} 
			}
			delete keysDown[40];
		} else if (37 in keysDown) { // Player holding left
			if(finn.x != 0) {// hero is not at the leftmost part of the map
				if(finn.getPositionLeft() < 88) {
					changeCharacterUsingNewPosFinn(finn.getPositionLeft());
					finn.updatePosition(-walkingSpeed, 0);
					steps++;
				} 
			}
			delete keysDown[37];
			
		} else if (39 in keysDown) { // Player holding right
			if(finn.x/60 != 9) {// hero is not at the rightmost part of the map
				if(finn.getPositionRight() < 88) {
					changeCharacterUsingNewPosFinn(finn.getPositionRight());
					finn.updatePosition(walkingSpeed, 0);
					steps++;
				}
			} else {
				// do nothing, maybe a message "can't move"
			}
			delete keysDown[39];
		} else if (76 in keysDown) { // Finn attacks (L)
			if(finn.opponentInVicinity()) {
				/**
				 * If the other hero (here Fern) is blocking,
				 * Finn attacks and deal less damage (Fern's health is
				 * reduced less). 
				 */
				if(fern.isBlocking) { 
					fern.health -= finn.damage / 2;					
				} else {
					fern.health -= finn.damage;
				}
				healthBarProgress(fern.name);
				steps++;
				appendToLog("Finn just attacked Fern and caused " + finn.damage + " points damage");
			} 
			delete keysDown[76];
		} else if (79 in keysDown) { // O Finn switches blocking mode (O)
			if(finn.isBlocking) { // hero currently blocking, restore
				finn.isBlocking = false;
				finn.damage = finn.damage * 2;
			} else { // hero currently not blocking, decrease his dmg
				finn.isBlocking = true;
				finn.damage = finn.damage / 2;
			}
			steps++; 
			delete keysDown[79];
		}
		
		if(steps == 3) {
			playerOnesTurn = false;
			steps = 0;
		}
	} else { // Fern 
		if (87 in keysDown) { // Player holding up
			if(fern.y != 0) { // hero is not at the upmost part of the map
				if(fern.getPositionAbove() < 88) {
				changeCharacterUsingNewPosFern(fern.getPositionAbove());
				fern.updatePosition(0,-walkingSpeed);
				steps++;
			} 
		} 	
			delete keysDown[87];
		} else if (83 in keysDown) { // Player holding down
			if(fern.y/60 != 9) {
				if(fern.getPositionBelow() < 88) {
					changeCharacterUsingNewPosFern(fern.getPositionBelow());
					fern.updatePosition(0, walkingSpeed);
					steps++;
				} 
			} 			
			delete keysDown[83];
		} else if (65 in keysDown) { // Player holding left
			if(fern.x != 0) {
				if(fern.getPositionLeft() < 88) {
					changeCharacterUsingNewPosFern(fern.getPositionLeft());
					fern.updatePosition(-walkingSpeed, 0);
					steps++;
				} 
			} 	
			delete keysDown[65];
		} else if (68 in keysDown) { // Player holding right
			if(fern.x/60 != 9) {
				if(fern.getPositionRight() < 88) {
					changeCharacterUsingNewPosFern(fern.getPositionRight());
					fern.updatePosition(walkingSpeed, 0);
					steps++;
				} 
			} 	 
			delete keysDown[68];
		} else if (67 in keysDown) { // Fern deals damage (c)
			if(fern.opponentInVicinity()) {
				/**
				 * If the other hero (here Finn) is blocking,
				 * Fern attacks deal less damage (Finn's health is
				 * reduced less). 
				 */
				if(finn.isBlocking) { 
					finn.health -= fern.damage / 2;					
				} else {
					finn.health -= fern.damage;
				}
				healthBarProgress(finn.name);
				steps++;
				appendToLog("Fern just attacked Finn and caused " + fern.damage + " points damage");
			} 
			delete keysDown[67];
		} else if (88 in keysDown) { // Fern switches blocking mode (X)
			if(fern.isBlocking) { // hero currently blocking, restore
				fern.isBlocking = false;
				fern.damage = fern.damage * 2;
			} else { // hero currently not blocking, decrease his dmg
				fern.isBlocking = true;
				fern.damage = fern.damage / 2;
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

//Weapons Sounds
var swordSound = new Audio("sounds/sword.mp3");
swordSound.volume = 0.1;
var magicWandSound = new Audio("sounds/magicwand.mp3");
magicWandSound.volume = 0.1;
var mushBombSound = new Audio("sounds/bomb.mp3");
mushBombSound.volume = 0.1;

function changeCharacterUsingNewPosFinn(pos) {
	switch(pos) {
		case 70:
			changeCharactersAppearance(finn, grass,
					"characterFinn",
					"pics/finnEquipedGrassSword.png");
			 swordSound.play(); 
			 appendToLog("Finn picked up the Grass Sword. Now he can cause 20 points damage.");
			break;
		case 71:
			changeCharactersAppearance(finn, finnSword,
					"characterFinn",
					"pics/finnEquipedFinnSword.png");
			swordSound.play(); 
			appendToLog("Finn picked up the Finn's Sword. Now he can cause 20 points damage.");
			break;
		case 72:
			changeCharactersAppearance(finn, scarletSword,
					"characterFinn",
					"pics/finnEquipedScarletSword.png");
			swordSound.play(); 
			appendToLog("Finn picked up the Scarlet Sword. Now he can cause 20 points damage.");
			break;
		case 73:
			changeCharactersAppearance(finn, magicWand,
					"characterFinn",
					"pics/finnEquipedMagicWand.png");
			magicWandSound.play(); 
			appendToLog("Finn picked up the Magic Wand. Now he can cause 30 points damage.");
			break;
		case 74:
			changeCharactersAppearance(finn, mushBomb,
					"characterFinn",
					"pics/finnEquipedMushBomb.png");
			mushBombSound.play(); 
			appendToLog("Finn picked up the Mushroom Bomb. Now he can cause 40 points damage.");
			break;
		case 75:
			changeCharactersAppearance(finn, demonSword,
					"characterFinn",
					"pics/finnEquipedDemonSword.png");
			swordSound.play(); 
			appendToLog("Finn picked up the Demon Sword. Now he can cause 20 points damage.");
			break;

		default:
			break;
	}
};

function changeCharacterUsingNewPosFern(pos) {
	switch(pos) {
		case 70:
			changeCharactersAppearance(fern, grass,
					"characterFern",
					"pics/fernEquipedGrassSword.png");
			swordSound.play(); 
			appendToLog("Fern picked up the Grass Sword. Now he can cause 20 points damage.");
			break;
		case 71:
			changeCharactersAppearance(fern, finnSword,
					"characterFern",
					"pics/fernEquipedFinnSword.png");
			swordSound.play(); 
			appendToLog("Fern picked up the Finn's Sword. Now he can cause 20 points damage.");
			break;
		case 72:
			changeCharactersAppearance(fern, scarletSword,
					"characterFern",
					"pics/fernEquipedScarletSword.png");
			swordSound.play(); 
			appendToLog("Fern picked up the Scarlet Sword. Now he can cause 20 points damage.");
			break;
		case 73:
			changeCharactersAppearance(fern, magicWand,
					"characterFern",
					"pics/fernEquipedMagicWand.png");
			magicWandSound.play();
			appendToLog("Fern picked up the Magic Wand. Now he can cause 30 points damage.");
			break;
		case 74:
			changeCharactersAppearance(fern, mushBomb,
					"characterFern",
					"pics/fernEquipedMushBomb.png");
			mushBombSound.play();
			appendToLog("Fern picked up the Mushroom Bomb. Now he can cause 40 points damage.");
			break;
		case 75:
			changeCharactersAppearance(fern, demonSword,
					"characterFern",
					"pics/fernEquipedDemon.png");
			swordSound.play(); 
			appendToLog("Fern picked up the Demon Sword. Now he can cause 20 points damage.");
			break;
		default:
			break;
	}
}

var winnerWasFound = false;
// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (finnReady) {
		ctx.drawImage(finnImage, finn.x, finn.y);
	}

	if (fernReady) {
		ctx.drawImage(fernImage, fern.x, fern.y);
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
	ctx.font = "14px bold Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	if(playerOnesTurn) {
		ctx.fillText("It's Finn's turn", 10, 10);
	} else {
		ctx.fillText("It's Fern's turn", 10, 10);
	}
	ctx.fillText("Steps made: " + steps, 150, 10);
	ctx.fillText("Finn: "  + finn.damage, 350, 10);
	ctx.fillText("Fern: "  + fern.damage, 500, 10);

	/**
	 * GAME OVER
	 */


	//Finn is the winner
	var winnerFinnReady = false;
	var winnerFinnImage = new Image();
	winnerFinnImage.onload = function() {
		winnerFinnReady = true;
	};
	winnerFinnImage.src = "pics/winnerFinn.png";

	//Fern is the winner
	var winnerFernReady = false;
	var winnerFernImage = new Image();
	winnerFernImage.onload = function() {
		winnerFernReady = true;
	};
	winnerFernImage.src = "pics/winnerFern.png";
	
	
	
	if(finn.health <= 0 || fern.health <= 0) {
		if(finn.health <= 0) {
			winnerFernReady = true;
			ctx.drawImage(winnerFernImage, 0, 0, 600, 600);
			if (!winnerWasFound) {
				winnerWasFound = true;
				appendToLog("Game over! Fern is the winner");
				keysDown[e.keyCode] = false;
			}
		} 
		if (fern.health <= 0) {
			winnerFinnReady = true;
			ctx.drawImage(winnerFinnImage, 0, 0, 600, 600);
			if (!winnerWasFound) {
				winnerWasFound = true;
				appendToLog("Game over! Finn is the winner");
				keysDown[e.keyCode] = false;
				
			}
		}
	}
	
};

//Game log

function appendToLog(message) {
	var log = document.getElementById("displayMessage");
	var newLineContainer = document.createElement("p");
	var newLine = document.createTextNode(message);
	//	text.textContent = displayMessage.text; // Define its text content
    newLineContainer.appendChild(newLine);
	log.appendChild(newLineContainer); // Insert the new element 
    log.scrollTop = newLineContainer.offsetHeight + newLineContainer.offsetTop; 
}


//Affect health bars
// updateHealthBar
function healthBarProgress(heroName) {
	switch (heroName) {
	case "Finn":
		$("#healthFinn").css('width', finn.health +'%')
						.attr('aria-valuenow', finn.health)
						.text(finn.health + ' %');
        break;
	case "Fern":
		$("#healthFern").css('width', fern.health +'%')
						.attr('aria-valuenow', fern.health)
						.text(fern.health + ' %');
        break;
	default:
        break;
	}
}


//Change characters' divs behavior
function changeCharactersAppearance(hero, newWeapon, characterDivId, weaponFileSrc) {
	
	// reactivate image of the "old" weapon
	var currentWeapon = hero.weapon;
	switch(currentWeapon.name) {
	case "Grass Sword": grassReady = true; break;
	case "Finn Sword": finnSwordready = true; break;
	case "Scarlet Sword": scarletSwordready = true; break;
	case "Magic Wand": magicWandready = true; break;
	case "Mushroom Bomb": mushBombready = true; break;
	case "Demon Sword": demonSwordready = true; break;
	default: break;
	}
	
	// place the "old" weapon on the current position of the hero 
	// he leave this within this step of the round)
	map.value[hero.x/60][hero.y/60] = hero.weapon.weaponId;
	hero.weapon.x = hero.x;
	hero.weapon.y = hero.y;
	
	// set new weapon
	switch (newWeapon.name)	{
	case "Grass Sword":
		hero.weapon = grass;
		hero.damage = grass.damage;
		grassReady = false;
		document.getElementById(characterDivId).src = weaponFileSrc;
		break;
	case "Finn Sword":
		hero.weapon = finnSword;
		hero.damage = finnSword.damage;
		finnSwordready = false;
		document.getElementById(characterDivId).src = weaponFileSrc;
		break;
	case "Scarlet Sword":
		hero.weapon = scarletSword;
		hero.damage = scarletSword.damage;
		scarletSwordready = false;
		document.getElementById(characterDivId).src = weaponFileSrc;
		break;
	case "Magic Wand":
		hero.weapon = magicWand;
		hero.damage = magicWand.damage;
		magicWandready = false;
		document.getElementById(characterDivId).src = weaponFileSrc;
		break;
	case "Mushroom Bomb":
		hero.weapon = mushBomb;
		hero.damage = mushBomb.damage;
		mushBombready = false;
		document.getElementById(characterDivId).src = weaponFileSrc;
		break;
	case "Demon Sword":
		hero.weapon = demonSword;
		hero.damage = demonSword.damage;
		demonSwordready = false;
		document.getElementById(characterDivId).src = weaponFileSrc;
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















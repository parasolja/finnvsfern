//Music On/Off

var x = document.getElementById("soundtrack"); 

function musicOn() { 
  x.play(); 
} 

function musicOff() { 
  x.pause(); 
} 

//First draw a big rectangle using canvas

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

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "pics/field.jpg";

//Create boxes/obstacles on canvas
var boxSize = 60; // 60x60 pixels in size
var contentBox;
var contentBoxes = [];

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

//rock/obstacle image

var rockReady = false;
var rockImage = new Image();
rockImage.onload = function () {
	rockReady = true;
};
rockImage.src = "pics/rock.png";

//Game objects
var hero1 = {
	speed: 256 // movement in pixels per second, likely irrelevant
	// weapons
};
var hero2 = {
		
};
var hero2sCaught = 0;

var rocks = [];

//Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);
// Limit Moves

var map = new Matrix(10,10); // create map
// Reset the game, place heros and obstacles
var reset = function () {

	map.randomize(); // fill map with random values

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
	        } 
	    }
	} 
	
	// get a random free cell for hero 1
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] === 99) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
	
	// place hero 1
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
	hero1.x = contentBox.row * 60;
	hero1.y = contentBox.col * 60;
    map.value[randomRow][randomCol] = 99; // set cell occupied
    contentBoxes.push(contentBox); 

    // get a random free cell for hero 2
	var randomRow = map.rows * Math.random() | 0;
	var randomCol = map.cols * Math.random() | 0;
	while(map.value[randomRow][randomCol] === 99) { // already occupied by stone, do again
		randomRow = map.rows * Math.random() | 0;
		randomCol = map.cols * Math.random() | 0;
	}
	
	// place hero 2
    contentBox = new Box(randomRow, randomCol);
    contentBox.createBox();
	hero2.x = contentBox.row * 60;
	hero2.y = contentBox.col * 60;
	map.value[randomRow][randomCol] = 99; // set cell occupied
    contentBoxes.push(contentBox); 
	
};


//Update game objects


//check every barrier for collisions


// if the move is allowed, return the desiredPlayer position
// if the move is not allowed, return the old player position




//var playerOnesTurn = false;
// Update game objects
var steps = 0;
var update = function (modifier) {
	// hero1
//	if(playerOnesTurn) {
	const walkingSpeed = 60;
		if (38 in keysDown) { // Player holding up
			if(checkMoveAllowed()) {
				hero1.y -= walkingSpeed;
				steps++;
			} else {
				hero1.y += walkingSpeed;
			}
			delete keysDown[38];
			// moveCounter++
		} else if (40 in keysDown) { // Player holding down
			if(checkMoveAllowed()) {
				hero1.y += walkingSpeed;
				steps++;
			} else {
				hero1.y -= walkingSpeed;
			}
			delete keysDown[40];
		} else if (37 in keysDown) { // Player holding left
			if(checkMoveAllowed()) {
				hero1.x -= walkingSpeed;
				steps++;
			} else {
				hero1.x += walkingSpeed;
			}
			delete keysDown[37];
		} else if (39 in keysDown) { // Player holding right
			if(checkMoveAllowed()) {
				hero1.x += walkingSpeed;
				steps++;
			} else {
				hero1.x -= walkingSpeed;
			}
			delete keysDown[39];
		}
//	} else {
		// hero2
		if (87 in keysDown) { // Player holding up
			hero2.y -= walkingSpeed;
			delete keysDown[87];
		} else if (83 in keysDown) { // Player holding down
			hero2.y += walkingSpeed;
			delete keysDown[83];
		} else if (65 in keysDown) { // Player holding left
			hero2.x -= walkingSpeed;
			delete keysDown[65];
		} else if (68 in keysDown) { // Player holding right
			hero2.x += walkingSpeed;
			delete keysDown[68];
		}
//	}
	
	// Are they touching?
	// transform into one hero is touching weapon
	
		// for each box
		
		// if hero touches box
		
	 {
		// make weapon disappear and give it to hero

		//++hero2sCaught;
		//reset();
	}
};

function checkMoveAllowed() {
	var moveAllowed = true;
	rocks.forEach(
			rock => {
				var heroTouchesTopBlock = 
					hero1.x <= (rock.x + 48)
					&& rock.x <= (hero1.x + 48)
					&& hero1.y <= (rock.y + 48)
					&& rock.y <= (hero1.y + 48);
				
				if (heroTouchesTopBlock) {
					moveAllowed = false;
				}
			}
		);
	return moveAllowed;
}

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
	
	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
//	if(playerOnesTurn) {
		ctx.fillText("It's Finns turn: " + hero2sCaught, 32, 32);
//	} else {
//		ctx.fillText("It's Ferns turn: " + hero2sCaught, 32, 32);
//	}
		ctx.fillText("steps: " + steps, 32, 64);	
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















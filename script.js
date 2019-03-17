//Music On/Off

var x = document.getElementById("soundtrack"); 

function musicOn() { 
  x.play(); 
} 

function musicOff() { 
  x.pause(); 
} 


//Create a board

//First draw a big rectangle using canvas

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 600; 
canvas.height = 600;
var boardContainer = document.getElementById("boardContainer");
boardContainer.appendChild(canvas);


// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "pics/background.png";



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

//Game objects
var hero1 = {
	speed: 256 // movement in pixels per second, likely irrelevant
	// weapons
};
var hero2 = {
		
};
var hero2sCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a hero2
var reset = function () {
	// Throw the hero1 somewhere on the screen randomly
	hero1.x = 32 + (Math.random() * (canvas.width - 64));
	hero1.y = 32 + (Math.random() * (canvas.height - 64));

	// Throw the hero2 somewhere on the screen randomly
	hero2.x = 32 + (Math.random() * (canvas.width - 64));
	hero2.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {
	// hero1
	if (38 in keysDown) { // Player holding up
		hero1.y -= 4;
		
	} else if (40 in keysDown) { // Player holding down
		hero1.y += 4;
	} else if (37 in keysDown) { // Player holding left
		hero1.x -= 4;
		// flip horizontally
//		ctx.translate(hero1Image.width, 0);
//		ctx.scale(-1, 1);
//		this.ctx.drawImage(hero1Image, 0, 0);
	} else if (39 in keysDown) { // Player holding right
		hero1.x += 4;
		// flip horizontally
//		ctx.translate(hero1Image.width, 0);
//		ctx.scale(-1, 1);
//		this.ctx.drawImage(hero1Image, 0, 0);
	}

	// hero2
	if (87 in keysDown) { // Player holding up
		hero2.y -= 4;
	} else if (83 in keysDown) { // Player holding down
		hero2.y += 4;
	} else if (65 in keysDown) { // Player holding left
		hero2.x -= 4;
	} else if (68 in keysDown) { // Player holding right
		hero2.x += 4;
	}


	// Are they touching?
	// transform into one hero is touching weapon
	if (
		hero1.x <= (hero2.x + 32)
		&& hero2.x <= (hero1.x + 32)
		&& hero1.y <= (hero2.y + 32)
		&& hero2.y <= (hero1.y + 32)
	) {
		// make weapon disappear and give it to hero

		//++hero2sCaught;
		//reset();
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

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Some Game Stats: " + hero2sCaught, 32, 32);
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
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();















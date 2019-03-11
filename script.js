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

var board = document.getElementById("board");
var context = board.getContext("2d");

context.beginPath();
context.rect(0, 0, 600, 600);
context.fillStyle = '#e6f4f1';
context.fill();

//Add some border
context.lineWidth = 2;
context.strokeStyle = '#50a627';
context.stroke();

//Create columns and rows inside of a big rectangle
 
class Layout {
	constructor(columns,rows) {
		this.columns = columns;
		this.rows = rows;
		this.value = [];
	
		for (var i = 0; i < this.rows; i++) {
	        this.value[i] = []; 
	        for (var j = 0; j < this.columns; j++) {   
	            this.value[i][j] = 0; 
	        }
		}
	}

	//add some random numbers to boxes
	getRandom () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                this.value[i][j] = Math.floor(Math.random() * Math.floor(10)); 
            }
        }
    }  
}

//Finally create a board and add random values

var board = new Layout (10,10);
board.getRandom();

//Declare variables for a board (only for squares)

var whiteSquare;
var whiteSquares = []; //store them all together
var obsSquare;
var obsSquares = [];
var squareSize = 60;

//Create class for squares
class Square {
	constructor(row,col) {
        this.row = row;
        this.col = col;
    }

    squareCreate() {
        context.beginPath();
        context.rect( this.col * 60, this.row * 60, squareSize, squareSize);  
    }
}

//create grid

for (var row = 0; row < board.rows; row++) {
    
    for (var col = 0; col < board.columns; col++) {
    
        // if box status equals 2, place black box, set box value to 1 (unavailable)
        if (board.value[row][col] === 2 || board.value[row][col] === 3) {

        	obsSquare = new Square(row, col);
        	obsSquare.squareCreate();
            context.fillStyle = '#0099cb';
            context.fill();
            board.value[row][col] = 1;

            obsSquares.push(obsSquare); // push all black/unavaiable boxes onto blackBoxes array
        } else if (board.value[row][col] === 4) { // place something else
        
	      	obsSquare = new Square(row, col);
	    	obsSquare.squareCreate();
	        context.fillStyle = 'red';
	        context.fill();
	        board.value[row][col] = 2;
        
    	} else if (board.value[row][col] === 5) { // place something else
        
	      	obsSquare = new Square(row, col);
	    	obsSquare.squareCreate();
	        context.fillStyle = 'yellow';
	        context.fill();
	        board.value[row][col] = 3;
        
    	} else { //else place grey box, set box value to 0 (available)
            
            whiteSquare = new Square(row, col);
            whiteSquare.squareCreate();
            context.fillStyle = 'white';
            context.fill();
            context.stroke();
            board.value[row][col] = 0;

            whiteSquares.push(whiteSquare); // push all grey/available boxes onto greyBoxes array
        }  
    }    
}
console.table(board.value);















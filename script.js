//Music On/Off

var x = document.getElementById("soundtrack"); 

function musicOn() { 
  x.play(); 
} 

function musicOff() { 
  x.pause(); 
} 


//Create a board

var board = document.getElementById("board");
var context = board.getContext("2d");

context.beginPath();
context.rect(0, 0, 600, 600);
context.fillStyle = '#e6f4f1';
context.fill();

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

var map = new Matrix(10,10); // create map
map.randomize(); // fill map with random values


var width;
var height;
var curX = window.innerWidth/2;
var curY = window.innerHeight/2;
const rows = 40;
const cols = 40;
var dots = [];

class Dot{
	constructor(){
		this.baseX = 0;
		this.baseY = 0;
		this.x = 0;
		this.y = 0;
		this.radius = 3;
	}
	
	draw(){
		noStroke();
		fill('rgba(0,0,0,1)');
		circle(this.x,this.y,this.radius);
	}
	
	update(){
		this.x = this.baseX;
		this.y = this.baseY;
	}
}

function setup(){
	width = window.innerWidth;
	height = window.innerHeight;
	createCanvas(width, height);
	for (var i= 0; i<rows; i++){
		for (var j = 0; j<cols; j++){
			var dot = new Dot;
			dot.baseX = ((i/(rows-1)) * (width-200))    + 100;
			dot.baseY = ((j/(cols-1)) * (height-200))   + 100;
			dots.push(dot);
		}
	}
}

function draw(){
	for (dot of dots){
		dot.update();
		dot.draw();
	}
}
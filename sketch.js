var width;
var height;
var curX = window.innerWidth/2;
var curY = window.innerHeight/2;
var centerX = window.innerWidth/2;
var centerY = window.innerHeight/2;
const cols = 20;
const margin = 100;
const rows = Math.round((window.innerWidth-2*margin)*cols/(window.innerHeight-2*margin));
var dots = [];


class Dot{
	constructor(){
		this.baseX = 0;
		this.baseY = 0;
		this.x = 0;
		this.y = 0;
		this.xi = 0;
		this.yi = 0;
		this.radius = 3;
	}
	
	draw(){
		noStroke();
		fill('rgba(0,0,0,1)');
		circle(this.x,this.y,this.radius);
	}
	
	mouseVersion(){
		var d = dist(mouseX, mouseY, this.baseX, this.baseY);
		// console.log(d);
		if (1===1){
			// +1 to stop being infinite where dist is 0
			var amount =  1500* 1/((0.5*d)+0.00001);
			if (amount > 50){
				amount = 50;
			}
			var dx = this.baseX- mouseX;
			// Y reversed because coordinate system starts in top left corner
			var dy = this.baseY - mouseY;
			var angle = Math.atan2(dy, dx);
			this.x = this.baseX + amount * Math.cos(angle);
			this.y = this.baseY + amount * Math.sin(angle);
			// console.log(this.x);
			stroke('rgba(0,0,0,1)');
			strokeWeight(1);
			line(this.x,this.y,this.baseX,this.baseY);
		} else {
			this.x = this.baseX;
			this.y = this.baseY;
		}
	}
	
	sinVersion(){
		// console.log(millis());
		let t = millis()*0.0005;
		// can just replace with offset rather than baseX/baseY twice
		this.x = this.baseX + sin((t*(this.xi+0.0001)*2) + this.yi)*30;
		this.y = this.baseY + cos((t*(this.xi+0.0001)*2) + this.yi)*30;
		stroke('rgba(0,0,0,1)');
		strokeWeight(1);
		line(this.x,this.y,this.baseX,this.baseY);
	}
	
	update(){
		// this.mouseVersion();
		this.sinVersion();
	}
}

function setupGrid(){
	for (var i= 0; i<rows; i++){
		for (var j = 0; j<cols; j++){
			var dot = new Dot;
			dot.baseX = ((i/(rows-1)) * (width-200))    + 100;
			dot.baseY = ((j/(cols-1)) * (height-200))   + 100;
			dot.xi = i;
			dot.yi = j;
			dots.push(dot);
		}
	}
}

function setupCircle(){
	var numCircles = 8;
	var radii = [];
	var outerR = (height/2) - margin;
	var distBetween = 30;
	for (var i = 1; i<numCircles; i++){
		var r = outerR * i/numCircles;
		var numInLayer = Math.round((2*r*Math.PI)/distBetween);
		console.log(numInLayer);
		var angle = (2*Math.PI)/numInLayer;
		for (var j = 0; j<numInLayer; j++){
			var dot = new Dot;
			dot.baseX = centerX + (r*cos(angle*j));
			dot.baseY = centerY + (r*sin(angle*j));
			dot.xi = i;
			dot.yi = j;
			dots.push(dot);
		}
	}
	console.log(dots);
}

function setup(){
	width = window.innerWidth;
	height = window.innerHeight;
	createCanvas(width, height);
	// setupGrid();
	setupCircle();
}

function draw(){
	clear();
	for (dot of dots){
		dot.update();
		// dot.draw();
	}
}
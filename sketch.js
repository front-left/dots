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
const numCircles = 8;

class Dot{
	constructor(){
		this.baseX = 0;
		this.baseY = 0;
		this.x = 0;
		this.y = 0;
		// Column / Layer in circle
		this.xi = 0;
		// Row / Number in layer
		this.yi = 0;
		this.radius = 3;
		this.tweenStartX = 0;
		this.tweenStartY = 0;
		this.tweening = false;
	}
	
	drawDot(){
		noStroke();
		fill('rgba(0,0,0,1)');
		circle(this.x,this.y,3);
	}
	
	drawBaseDot(){
		noStroke();
		fill('rgba(0,0,0,1)');
		circle(this.baseX,this.baseY,3);
	}
	
	drawCircle(){
		noStroke();
		fill('rgba(0,0,0,1)');
		circle(this.baseX,this.baseY,this.radius);
	}
	
	drawLine(){
		stroke('rgba(0,0,0,1)');
		strokeWeight(1);
		line(this.x,this.y,this.baseX,this.baseY);
	}
	
	draw(){
		this.drawBaseDot();
		// this.drawDot();
		// this.drawLine();
		// this.drawCircle();
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
			this.radius = 0.5+ amount/5;
			// console.log(this.radius);
			
		} else {
			this.x = this.baseX;
			this.y = this.baseY;
		}
	}
	
	sinUpdate(){
		// console.log(millis());
		let t = millis()*0.0005;
		// can just replace with offset rather than baseX/baseY twice
		this.x = this.baseX + sin((t*(this.xi+0.0001*Math.PI/4)*2) + (this.yi*Math.PI/2))*10;
		this.y = this.baseY + cos((t*(this.xi+0.0001*Math.PI/4)*2) + (this.yi*Math.PI/2))*10;
		this.radius = 5+ sin((t*(this.xi+0.0001*Math.PI/4)*2) + (this.yi*Math.PI/2))*10;
	}
	
	rotate(){
		var outerR = (height/2) - margin;
		var r = outerR * (this.xi-1)/numCircles;
		var distBetween = 30;
		var numInLayer = Math.round((2*r*Math.PI)/distBetween);
		// could move all this to a class attribute, since angle wont change.
		var angle = (2*Math.PI)/(numInLayer);
		let t = millis()*0.0005;
		// Rotate with varying speeds:
		// this.baseX = centerX + (r*cos( angle*(this.yi )+  (0.5*this.xi*sin(t*0.5))));
		// this.baseY = centerY + (r*sin( angle*(this.yi ) + (0.5*this.xi*sin(t*0.5))));
		// Rotate with varying speeds, inverse:
		this.baseX = centerX + (r*cos( angle*(this.yi )+  (0.5*(numCircles+1-this.xi)*sin(t*0.5))));
		this.baseY = centerY + (r*sin( angle*(this.yi ) + (0.5*(numCircles+1-this.xi)*sin(t*0.5))));
		// Rotate equally with time:
		// this.baseX = centerX + (r*cos( angle*(this.yi )+  t));
		// this.baseY = centerY + (r*sin( angle*(this.yi ) + t));
	}
	
	setTweenTarget(targetX, targetY){
		
		this.tweenStartX = this.baseX;
		this.tweenStartY = this.baseY;
		this.targetX = targetX;
		this.targetY = targetY;
		this.tweening = true;
	}
	
	tweenToTarget(){
		this.baseX = this.baseX + (this.targetX-this.tweenStartX)/10;
		this.baseY = this.baseY + (this.targetY-this.tweenStartY)/10;
		if (dist(this.baseX, this.baseY, this.targetX, this.targetY)<2){
			this.tweening = false;
		}
	}
	
	update(){
		this.mouseVersion();
		// this.sinUpdate();
		if (this.tweening){
			this.tweenToTarget();
		} else {
			this.rotate();
		}
	}
}

function setupGrid(){
	for (var i= 0; i<rows; i++){
		for (var j = 0; j<cols; j++){
			var dot = new Dot;
			dot.baseX = ((i/(rows-1)) * (width-200))    + 100;
			dot.baseY = ((j/(cols-1)) * (height-200))   + 100;
			dot.xi = i+1;
			dot.yi = j+1;
			dots.push(dot);
		}
	}
}

function setupCircle(){
	
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
			dot.xi = i+1;
			dot.yi = j+1;
			dots.push(dot);
		}
	}
	console.log(dots);
}

// See solution at link below
// https://math.stackexchange.com/questions/1681461/fit-2600-equally-spaced-points-on-concentric-circles
function setupCircle2(){
	var numDots = cols * rows;
	var layers = (Math.sqrt(Math.PI) * Math.sqrt(4*numDots + Math.PI) - Math.PI)/(2*Math.PI);
	layers = Math.round(layers);
	var approxNumDots= 0;
	for (var i = 1; i<=layers; i++){
		approxNumDots += Math.floor(2*i *Math.PI);
	}
	var remainingDots = numDots - approxNumDots;
	if (remainingDots > 0){
		console.log("remaiing : "+remainingDots);
	}
	var newRemaining = remainingDots;
	for (var i = 1; i<=layers; i++){
		var baseNumInLayer = Math.floor(2*i *Math.PI);
		var extraInLayer =  Math.floor(remainingDots*(baseNumInLayer)/numDots);
		if (i == layers){
			extraInLayer = newRemaining;
		} else {
			newRemaining -= extraInLayer;
		}
		var numInLayer = baseNumInLayer + extraInLayer;
		var angle = 2*Math.PI/numInLayer;
		for (var j = 0; j<numInLayer; j++){
			var dot = new Dot;
			dot.baseX = centerX + (r*cos(angle*j));
			dot.baseY = centerY + (r*sin(angle*j));
			dot.angle = angle*j;
			dot.xi = i;
			dot.yi = j;
			dots.push(dot);
		}
	}
}

function moveAllToCenter(){
	for (dot of dots){
		dot.setTweenTarget(centerX, centerY);
	}
}

function setup(){
	width = window.innerWidth;
	height = window.innerHeight;
	createCanvas(width, height);
	// setupGrid();
	setupCircle();
	setupCircle2();
}

function draw(){
	clear();
	let t = millis()/1000;
	if (t > 5){
		moveAllToCenter();
	}
	for (dot of dots){
		dot.update();
		dot.draw();
	}
	
	
}
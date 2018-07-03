/* Philippe Meyer */



window.onload = function() {
	var needUpdate,width,height,fov,h2,w2,k90degres,k270degres,k360degres;
	var saveContext;
	var canvas = document.getElementById("canvas");
	var	context = canvas.getContext("2d");
	var things = [];
	var camera = new Camera(0.05,10,toradians(90));
	var mode = "static";
	init();

var elem = document.getElementsByClassName("mode");
for (var i = 0; i < elem.length; i++) {
    elem[i].addEventListener('click', function(){
		mode = this.id;
		var all = document.getElementsByClassName("mode");
		for(var j=0;j<all.length;j++){
			if(all[j].id == mode){
				all[j].setAttribute("class", "mode chosen");
			}else{
				all[j].setAttribute("class", "mode");
			}
		}
		
	}, false);

}

	
	/*
	
	var aRotation = {x:0,y:0,z:0};
	var cubePrime = new Cube();
	var nrOfCubes = 6;
	var angleDiff = toradians(360/nrOfCubes);
	var distance,size,altitude,angleToOrigine,name;
	angleToOrigine = 0;
	for(var i = 0;i < nrOfCubes ;i++){
		name = String.fromCharCode(65+i);
		size = 80 ;
		altitude = 0;
		distance =1000;
		
		things.push(new Shape(cubePrime,size,distance,altitude,angleToOrigine,aRotation,name));
		angleToOrigine += angleDiff;
	}
*/
things.push(new Square(30,100,k90degres,0.5,"A"));

things.push(new Square(30,140,k90degres-0.4,0.25,"B"));

things.push(new Square(30,250,k180degres-0.5,0.1,"C"));

things.push(new Square(45,185,k180degres+1,.3,"D"));

things.push(new Square(22,220,0.9,.3,"E"));

things.push(new Square(50,325,1.5,.7,"F"));

	update();

	
function init(){
	
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	w2 = width/2;
	h2 = height/2;
	k90degres = toradians(90);
	k60degres = toradians(60);
	k45degres = toradians(45);
	k180degres = toradians(180);
	k270degres = toradians(270);
	k360degres = toradians(360);
	k80degres = toradians(80);
	k280degres = toradians(280);
	
	camFov = k45degres;
	focalW = w2 / Math.tan(camFov/2);
	focalH = h2 / Math.tan(camFov/2);
	zoom = 4;
	focalAverage = (focalW + focalH)/2;
	
	//context.scale(0.8,0.5);
	context.translate(width / 2, height / 2);
	

}

function update() {

		
		context.clearRect(-w2 , -h2, width, height);
		//context.fillStyle="rgb(185,183,184)"; 
		//context.rect(-w2 , -h2, width, height);
		context.fill();
		context.fillStyle="black"; 
		camera.draw();
		things.forEach(function(thing){
			thing.draw();
		});
	
		//context3d.clearRect(-w2 , -h2, width, height);
		//context3d.fillStyle="pink"; 
		//context3d.rect(800 , 500, 50, 50);
		//context3d.fill();
	requestAnimationFrame(update);
	
}



// Converts from degrees to radians.
function  toradians(degrees) {
	return degrees * Math.PI / 180;
}

// Converts from radians to degrees.
function todegrees(radians) {
	return radians * 180 / Math.PI;
}


function Cube(){
this.data2D = {
	"topLeft": {"x":-1,"y":-1},
	"topRight": {"x":1,"y":-1},
	"bottomLeft": {"x":-1,"y":1},
	"bottomRight": {"x":1,"y":1}
}
this.data = [
	[-1,-1,-1], // left, bottom, back
	[1,-1,-1], // right, bottom, back
	[1, 1,-1], // right, top, back
	[-1, 1,-1], // left, top, back
	[1,-1, 1], // right, bottom, front
	[-1,-1, 1], // left, bottom, front
	[-1, 1, 1],// left, top, front
	[1, 1, 1] // right, top, front
];
this.poly=[];
this.poly[0]=[0,1,2,3]; // Back side
this.poly[1]=[1,4,7,2]; // Right side
this.poly[2]=[4,5,6,7]; // front side
this.poly[3]=[5,0,3,6]; // left side
this.poly[4]=[5,4,1,0]; // bottom side
this.poly[5]=[3,2,7,6]; // top side

this.normals=[
{"x":0,"y":0,"z":-1},
{"x":1,"y":0,"z":0},
{"x":0,"y":0,"z":1},
{"x":-1,"y":0,"z":0},
{"x":0,"y":-1,"z":0},
{"x":0,"y":1,"z":0},
];
this.normals2D=[
	{"x":0,"y":-1},
	{"x":1,"y":0},
	{"x":0,"y":1},
	{"x":-1,"y":0}
];

this.colors=[
	"DarkOrchid",
	"FireBrick",
	"GoldenRod",
	"HotPink",
	"OrangeRed",
	"MidnightBlue"
]
}



function scalarProduct(a,b){
var ax=a.x;
var ay=a.y;
var az=a.z;
var bx=b.x;
var by=b.y;
var bz=b.z;

var len = hypo(ax,ay,az);
ax=ax/len;
ay=ay/len;
az=az/len;

len = hypo(bx,by,bz);
bx=bx/len;
by=by/len;
bz=bz/len;

return ax*bx+ay*by+az*bz;
}

function scalarProduct2D(a,b){
var ax=a.x;
var ay=a.y;
var bx=b.x;
var by=b.y;

var len =  Math.sqrt(ax*ax+ay*ay);
ax=ax/len;
ay=ay/len;

len =  Math.sqrt(bx*bx+by*by);
bx=bx/len;
by=by/len;


return ax*bx+ay*by;
}

function hypo(x,y,z){
return Math.sqrt(x*x+y*y+z*z);
}

function hypo2d(x,y){
return Math.sqrt(x*x+y*y);
}

function Camera(rotStep,walkStep,rotation) {
	this.rotation = rotation ? rotation : 0; 
	this.position = {x:0,y:0,z:0};
	this.previousLocation = {x:0,y:0,z:0}; 
	this.antePenultLocation = {x:0,y:0,z:0}; 

	this.sightWidth = toradians(140);
	this.sightLength = 300;
	this.walkStep = walkStep;
	this.rotStep = rotStep;
	this.bodyRadius = 20;
	this.turn = function(amount){ // -1 or +1
		//this.rotation.x += rotAngle.x;
		this.rotation -= this.rotStep*amount;
		if(this.rotation<0) this.rotation  += k360degres;
		if(this.rotation >k360degres ) this.rotation  =0;
		//console.log("Camera : " + Math.floor(todegrees(this.rotation)));
	}
	this.walk = function(amount){// -1 or +1
		// Calculate new position considering the amount, the position and the direction
		//collideCirclePoly(cx, cy, diameter, vertices, interior) 
	
		this.savePosition();
		var dirx = Math.cos(this.rotation);
		var dirz = - Math.sin(this.rotation);
		this.position.x = Math.floor(this.position.x + (dirx * amount * this.walkStep)); 
		this.position.z = Math.floor(this.position.z + (dirz * amount * this.walkStep));
		

	}

	
	this.draw = function(){
		
		if(mode=="static"){
			this.drawStatic();
		}else if(mode=="dynamic"){
			this.drawDynamic();
		} else if (mode=="3d"){
			this.draw3D();
		}
			
	}
	
	this.drawStatic = function(){
		var self = this;
		
		self.checkCollisions();
		
		self.drawSoil();
		
		self.drawCross();
		
		self.drawCamera();

		//self.drawScanner();
		self.Scan();
	}
	
	this.drawDynamic = function(){
		
		var camCos = Math.cos(camera.rotation);
		var camSin = -Math.sin(camera.rotation);
		
		var vectorCam = {x:camCos*50,y:camSin*50};
		
		var west = simpleRotate(vectorCam,k90degres);
		var east = simpleRotate(vectorCam,-k90degres);
		var north = vectorCam;
		var south = simpleRotate(vectorCam,-k180degres);
		
		context.globalAlpha=0.5;
		context.beginPath();
		context.strokeStyle="green"; 
		
		context.moveTo(west.x, west.y);
		context.lineTo(east.x, east.y);
		context.moveTo(north.x, north.y);
		context.lineTo(south.x, south.y);
		
		context.fillText("W",west.x-5, west.y);
		context.fillText("E",east.x-5, east.y);
		context.fillText("N",north.x-5, north.y);
		context.fillText("S",south.x-5, south.y);
		
		context.closePath();
		context.stroke();
		
		context.globalAlpha=1;
		context.beginPath();
		context.strokeStyle="darkblue"; 
		var messagePosition = camera.position.x + "," + camera.position.z;

		vectorCam = {x:0,y:-30};
		
		drawArrow(context,0,0,vectorCam.x,vectorCam.y);
		context.fillText(messagePosition+" * " + Math.floor(camera.rotation * 180 / Math.PI) +" °", 30, -30);
		context.closePath();
		context.stroke();
	}
	
	this.draw3D = function(){
	}
	
	this.drawSoil=function(){
		var self = this;
		things.forEach(function(x){
			var alpha = 1-(x.distance/300);
				if (alpha < 0.1) alpha = 0.1;
				
				context.globalAlpha=alpha;				
				context.beginPath();
				context.strokeStyle="black"; 
				context.fillStyle="rgb(20,230,160)"; 

				context.arc(0, 0, x.distance, 0, Math.PI * 2, true);
				context.closePath();
	
				context.stroke();	
				context.fill();				
			}); 
		
	}
	this.checkCollisions=function(){
		var self = this;
		things.forEach(function(x){
				var poly = [x.topLeft,x.topRight,x.bottomRight,x.bottomLeft,x.topLeft];
				if(collideCirclePoly(self.position.x , self.position.z, self.bodyRadius*2, poly)) {
					self.restorePosition ();
				}			
			}); 
	}
	
		this.drawCross=function(){
			context.save();
			context.globalAlpha=0.4;
			context.beginPath();
			context.strokeStyle="green"; 
			context.fillStyle="white"; 
			var camCos = Math.cos(k90degres);
			var camSin = -Math.sin(k90degres);
			
			var vectorCam = {x:camCos*50,y:camSin*50};
			
			var west = simpleRotate(vectorCam,k90degres);
			var east = simpleRotate(vectorCam,-k90degres);
			var north = vectorCam;
			var south = simpleRotate(vectorCam,-k180degres);
			
			
			context.beginPath();
			context.strokeStyle="black"; 
			context.moveTo(west.x, west.y);
			context.lineTo(east.x, east.y);
			context.moveTo(north.x, north.y);
			context.lineTo(south.x, south.y);
			context.closePath();
			context.stroke();

			context.beginPath();
			context.fillStyle="black";
			context.fillText("W",west.x-5, west.y);
			context.fillText("E",east.x-5, east.y);
			context.fillText("N",north.x-5, north.y);
			context.fillText("S",south.x-5, south.y);
			context.closePath();
			context.stroke();
			
			context.restore();
		}
	
	this.drawCamera=function(){
			context.save();

			context.globalAlpha=1;	
			
			context.beginPath();
			context.strokeStyle="darkred"; 
			context.fillStyle="white"; 
			
			context.beginPath();
			context.arc(camera.position.x, camera.position.z, this.bodyRadius,0, 2*Math.PI,false);
		
			context.closePath();
			context.stroke();
			context.fill();
			


			var messagePosition = camera.position.x + "," + camera.position.z;
			var camCos = Math.cos(camera.rotation);
			var camSin = -Math.sin(camera.rotation);
			var vectorCam = {x:camCos*30,y:camSin*30};
			

			context.beginPath();
			drawArrow(context,camera.position.x,camera.position.z,camera.position.x+vectorCam.x,camera.position.z+vectorCam.y);
			context.closePath();
			context.stroke();
			
			context.strokeStyle="darkred"; 
			context.fillStyle="black"; 
			
			context.beginPath();
			context.fillText(messagePosition, camera.position.x -7, camera.position.z -this.bodyRadius/2);
			context.fillText(Math.floor(camera.rotation * 180 / Math.PI) +" °", camera.position.x -6, camera.position.z +this.bodyRadius/2);

			context.closePath();
			context.stroke();
			
		

			context.restore();
	}

	this.drawScanner=function(){
		context.save();
		context.globalAlpha=0.35;
		context.beginPath();
		var rotationLeftLimit = camera.rotation-this.sightWidth/2;
		var rotationRightLimit = camera.rotation+this.sightWidth/2;

		context.strokeStyle="rgb(255,0,0)"; 
		var ray;
		things.forEach(function(x){
			x.hit = false;
			x.hitAngles.length = 0;
		});
		var relativeAngle = - this.sightWidth/2;
		var step = 0.02;
		var rayLength =  this.sightLength-this.bodyRadius;
		for(var i = rotationLeftLimit;i <= rotationRightLimit;i+=step){
			camCos = Math.cos(i);
			camSin = -Math.sin(i);
			
			var start = {"x":camera.position.x+camCos*this.bodyRadius,"y":camera.position.z+camSin*this.bodyRadius};
			context.moveTo(start.x, start.y);
			
			ray= {x:camCos*rayLength,y:camSin*rayLength};
			var end = {"x":start.x+ray.x,"y":start.y+ray.y};
			context.lineTo(end.x,end.y);
			things.forEach(function(x){
				
				var poly = [x.topLeft,x.topRight,x.bottomRight,x.bottomLeft,x.topLeft];
			
				if(collideLinePoly(start.x,start.y,end.x,end.y,poly)){
					x.hit = true;
					x.hitAngles.push(relativeAngle);
				}					
			});
			relativeAngle += step;
		}
		things.forEach(function(x){
			if(x.hit){
				var nrHits = x.hitAngles.length;
				if(nrHits==0){
					x.hit = false;
				}else if(nrHits==1){
					x.hitMiddleAngle = x.hitAngles[0];
				}else{
					x.hitMiddleAngle = x.hitAngles[Math.floor((nrHits-1)/2)];
				}
			}
		
		});
		
		things.forEach(function(x){
			if(x.hit){
//geometry.normals2D[0]
				
//scalarProduct2D
			}
		
		});
		
	}
	this.Scan=function(){
		var self = this;
		things.forEach(function(x){
			x.hit = false;
			var relPosition = {};
			relPosition.x = x.positionAbsolute.x - camera.position.x;
			relPosition.y = x.positionAbsolute.y - camera.position.z;
			
			var dist =  Math.floor(0.5+Math.sqrt(relPosition.x*relPosition.x+relPosition.y*relPosition.y));
			relPosition = simpleRotate(relPosition,-camera.rotation);
			x.positionRelative.x  = relPosition.x;
			x.positionRelative.y  = relPosition.y;
			x.positionRelative.grot = calcAngleRadians(x.positionRelative.x,x.positionRelative.y);
			var irot = x.innerRotation;
			
			var irotCos = Math.cos(irot);
			var irotSin = -Math.sin(irot);
			
			var irotpos = simpleRotate({"x":irotCos,"y":irotSin},-camera.rotation);
			x.positionRelative.irot = calcAngleRadians(irotpos.x,irotpos.y);
			x.positionRelative.dist =  dist;

			x.positionRelative.normals.length=0;
			x.positionRelative.dots.length=0;
			irot = x.positionRelative.irot;
			
			var camCos = 0;
			var camSin = 1;
			var camVector = {"x":camCos,"y":camSin};
			if(x.positionRelative.grot >= -self.sightWidth/2 && x.positionRelative.grot <= self.sightWidth/2 && x.positionRelative.dist <=  self.sightLength){
				x.hit = true;
			}

		});
		


	}	
	
	this.savePosition = function(){
		
		this.antePenultLocation.x = this.previousLocation.x;
		this.antePenultLocation.y = this.previousLocation.y;
		this.antePenultLocation.z = this.previousLocation.z;
		
		this.previousLocation.x = this.position.x;
		this.previousLocation.y = this.position.y;
		this.previousLocation.z = this.position.z;
		
		
	}
	
	this.restorePosition = function(){
		this.position.x = this.previousLocation.x;
		this.position.y = this.previousLocation.y;
		this.position.z = this.previousLocation.z;
		
		this.previousLocation.x = this.antePenultLocation.x;
		this.previousLocation.y = this.antePenultLocation.y;
		this.previousLocation.z = this.antePenultLocation.z;
	}

}
// primitive,size,distance,altitude,angleToOrigine,rotation,name
function Square(size,distance,angleToOrigine,innerRotation,name){
	this.size = size;
	this.distance = distance;
	this.angleToOrigine = angleToOrigine; 
	this.name = name;
	this.innerRotation = innerRotation;
	this.positionAbsolute = {x:0,y:0};
	this.positionRelative = {x:0,y:0,grot:0,irot:0,dist:0,normals:[],dots:[]}; // global rotation, innerRotation
	this.half = Math.floor(size/2);
	this.geometry = new Cube(); // only for 3D
	this.hit = false;
	this.hitAngles = [];
	this.hitMiddleAngle = 0;
	

	
	var cos = Math.cos(this.angleToOrigine);
	var sin = -Math.sin(this.angleToOrigine);
	this.topLeft = {"x": 0,"y": 0};
	this.topRight = {"x": 0 ,"y": 0};
	this.bottomLeft = {"x": 0,"y": 0};
	this.bottomRight = {"x": 0,"y": 0};
	
	// the real position according to origin point
	this.positionAbsolute.x = Math.floor(cos*distance);
	this.positionAbsolute.y = Math.floor(sin*distance);

	this.left = this.positionAbsolute.x - this.size / 2;
	this.top = this.positionAbsolute.y - this.size / 2;
	

	
	var geometry = this.geometry.data2D;
	
	this.topLeft = {"x": geometry.topLeft.x,"y": geometry.topLeft.y};
	this.topRight = {"x": geometry.topRight.x ,"y": geometry.topRight.y };
	this.bottomLeft = {"x": geometry.bottomLeft.x ,"y": geometry.bottomLeft.y};
	this.bottomRight = {"x": geometry.bottomRight.x ,"y": geometry.bottomRight.y};
	
	this.topLeft = simpleRotate(this.topLeft,this.innerRotation);
	this.topRight = simpleRotate(this.topRight,this.innerRotation);
	this.bottomLeft = simpleRotate(this.bottomLeft,this.innerRotation);
	this.bottomRight = simpleRotate(this.bottomRight,this.innerRotation);
	
	this.topLeft.x = this.topLeft.x * this.half  + this.positionAbsolute.x;
	this.topLeft.y = this.topLeft.y * this.half  + this.positionAbsolute.y;
	
	this.topRight.x = this.topRight.x * this.half  + this.positionAbsolute.x;
	this.topRight.y = this.topRight.y * this.half  + this.positionAbsolute.y;
	
	this.bottomLeft.x = this.bottomLeft.x * this.half  + this.positionAbsolute.x;
	this.bottomLeft.y = this.bottomLeft.y * this.half  + this.positionAbsolute.y;
	
	this.bottomRight.x = this.bottomRight.x * this.half  + this.positionAbsolute.x;
	this.bottomRight.y = this.bottomRight.y * this.half  + this.positionAbsolute.y;
	
	this.geometry.normals2D[0] =  simpleRotate(this.geometry.normals2D[0],this.innerRotation);
	this.geometry.normals2D[1] =  simpleRotate(this.geometry.normals2D[1],this.innerRotation);
	this.geometry.normals2D[2] =  simpleRotate(this.geometry.normals2D[2],this.innerRotation);
	this.geometry.normals2D[3] =  simpleRotate(this.geometry.normals2D[3],this.innerRotation);
		

	this.draw = function(){
		
		if(mode=="static"){
			this.drawStatic();
		}else if(mode=="dynamic"){
			this.drawDynamic();
		} else if (mode=="3d"){
			this.draw3D();
		}
			

	}
	this.drawStatic = function(){
		// the camera moves : the objects stay stationnary so the positionRelative == positionAbsolute
			var self = this;

			context.save();
		
			context.strokeStyle="black"; 
			context.strokeStyle="white";
			var saveFill= context.fillStyle;
			var saveStroke= context.strokeStyle;
			
			
				// drawing normals :
		    context.globalAlpha=0.4;
			context.strokeStyle="black";
			context.beginPath();
			
			context.moveTo(self.positionAbsolute.x, self.positionAbsolute.y);
			context.lineTo(self.positionAbsolute.x + self.geometry.normals2D[0].x*self.size, self.positionAbsolute.y + self.geometry.normals2D[0].y*self.size);
			
			context.moveTo(self.positionAbsolute.x, self.positionAbsolute.y);
			context.lineTo(self.positionAbsolute.x + self.geometry.normals2D[1].x*self.size, self.positionAbsolute.y + self.geometry.normals2D[1].y*self.size);
			
			context.moveTo(self.positionAbsolute.x, self.positionAbsolute.y);
			context.lineTo(self.positionAbsolute.x + self.geometry.normals2D[2].x*self.size, self.positionAbsolute.y + self.geometry.normals2D[2].y*self.size);

			context.moveTo(self.positionAbsolute.x, self.positionAbsolute.y);
			context.lineTo(self.positionAbsolute.x + self.geometry.normals2D[3].x*self.size, self.positionAbsolute.y + self.geometry.normals2D[3].y*self.size);
			
			context.stroke();
			context.closePath();
			
			context.globalAlpha=0.8;
			context.strokeStyle="black";
			context.fillStyle="rgb(20,230,160)"; 
			context.beginPath();
			// Drawing the square
			context.moveTo(self.topLeft.x, self.topLeft.y);
			context.lineTo(self.topRight.x, self.topRight.y);
			context.lineTo(self.bottomRight.x, self.bottomRight.y);
			context.lineTo(self.bottomLeft.x, self.bottomLeft.y);
			context.lineTo(self.topLeft.x, self.topLeft.y);

			context.closePath();
			context.stroke();
			if(self.hit){
				context.fillStyle="red"; 
				context.fill();
				context.fillStyle="black"; 
				context.fillText(Math.floor(todegrees(self.positionRelative.grot))+" °", self.topRight.x+2, self.topRight.y-2);		
				
				var corners = [
					{"pt":self.topLeft,"dist":0,"order":0},
					{"pt":self.topRight,"dist":0,"order":1},
					{"pt":self.bottomRight,"dist":0,"order":2},
					{"pt":self.bottomLeft,"dist":0,"order":3}
				]
				corners.forEach(function(x){
					x.dist = hypo2d(camera.position.x-x.pt.x,camera.position.z-x.pt.y);
				});
				corners.sort(function(a,b){
					return (a.dist>=b.dist);
				});
				var sides =[
					[0,1],
					[1,2],
					[2,3],
					[3,0]
					
				]
/* 				this.colors=[
					"DarkOrchid", // top
					"FireBrick", // right
					"GoldenRod", // bottom
					"HotPink", // left
					"OrangeRed", // 3d
					"MidnightBlue"// 3d
				] */
				var sidesToDraw = [];
				var differenceBetWeen0And1 = Math.abs(corners[0].dist-corners[1].dist);
				if(differenceBetWeen0And1> self.size/6){
					var pt = corners[0].order;
					sides.forEach(function(x,j){
						if(x[0] == pt || x[1] == pt ){
							sidesToDraw.push(j);
						}
					});
				}else{ // we see only one side
					var pt1 = corners[0].order;
					var pt2 = corners[1].order;
					sides.forEach(function(x,j){
						if(x[0] == pt1 && x[1] == pt2 ){
							sidesToDraw.push(j);
						}else{
							if(x[0] == pt2 && x[1] == pt1 ){
								sidesToDraw.push(j);
							}
						}
					});
				}
				corners.sort(function(a,b){
					return (a.order>=b.order);
				});
				context.lineWidth=1;
							context.lineWidth=5;
					for(var i = 0;i < sidesToDraw.length;i++){
						var color = self.geometry.colors[sidesToDraw[i]];
							context.strokeStyle=color; 
							context.beginPath();
							var side = sides[sidesToDraw[i]];
							context.moveTo(corners[side[0]].pt.x, corners[side[0]].pt.y);
							context.lineTo(corners[side[1]].pt.x, corners[side[1]].pt.y);
							context.closePath();
							context.stroke();
					}
				context.lineWidth=1;
			}

			context.fillStyle="black"; 
			
			context.beginPath();
			context.strokeStyle=saveStroke; 
			context.fillText(self.name, self.positionAbsolute.x-2, self.positionAbsolute.y+2);
			context.closePath();
			


			context.globalAlpha=1;
			context.restore();
	}
	
		this.drawDynamic = function(){
			// the camera does not move : everything rotate around
			var self = this;
			// We have to calculate the relative position with cemera rotation and camera position
			var x = self.positionAbsolute.x;
			var y = self.positionAbsolute.y;
			
			var diffX = x-camera.position.x;
			var diffY = y-camera.position.z;
			
			var dist =  Math.floor(0.5+Math.sqrt(diffX*diffX+diffY*diffY));
			if (dist < 1 ) dist = 1;
			var camCos = Math.cos(camera.rotation);
			var camSin = -Math.sin(camera.rotation);
			
			var objectToCam = {"x":(camera.position.x-x)/dist,"y":(y-self.positionAbsolute.y)/dist};

			var vectorCam = {x:camCos,y:camSin};
			var vectorObjet	= {x:x/dist,y:y/dist};
			
			var angleCam = keepWithInCircle(calcAngleRadians(vectorCam.x,vectorCam.y));
			var angleObjet	= keepWithInCircle(calcAngleRadians(vectorObjet.x,vectorObjet.y));			
			var relativeAngle =  keepWithInCircle(angleCam - angleObjet);
			
			var dot = scalarProduct2D(vectorCam,objectToCam);
			
			if(relativeAngle <=k80degres || relativeAngle >= k280degres){
				//var angle = Math.acos(dot)+k90degres;
				
				var objCos = Math.cos(relativeAngle+k90degres);
				var objSin = -Math.sin(relativeAngle+k90degres);
				
				self.positionRelative.x = objCos*dist;
				self.positionRelative.y = objSin*dist;
				
				context.strokeStyle="black"; 
				context.beginPath();
				
				context.moveTo(self.positionRelative.x-self.half, self.positionRelative.y-self.half);
				context.rect(self.positionRelative.x-self.half,self.positionRelative.y-self.half,self.half,self.half);
				var message = self.name+" angle="+ Math.floor(relativeAngle* 180 / Math.PI)+" dist=" +dist+" dot="+dot;
				context.fillText(message, self.positionRelative.x+5, self.positionRelative.y-5);
				context.closePath();
				context.stroke();
				
				context.globalAlpha=0.8;

				context.beginPath();
				context.strokeStyle="red"; 
				context.arc(0, 0, dist, 0, Math.PI * 2, true);
				context.closePath();
				context.stroke();
			}else{
				
				context.globalAlpha=0.4;

				context.beginPath();
				context.strokeStyle="grey"; 
				context.arc(0, 0, dist, 0, Math.PI * 2, true);
				context.closePath();
				context.stroke();	
				
			}
			context.globalAlpha=1;
	}
	
			this.draw3D = function(){
			// the camera does not move : everything rotate around
			var self = this;
			// We have to calculate the relative position with cemera rotation and camera position
			var x = self.positionAbsolute.x;
			var y = self.positionAbsolute.y;
			
			var diffX = x-camera.position.x;
			var diffY = y-camera.position.z;
			
			var dist =  Math.floor(0.5+Math.sqrt(diffX*diffX+diffY*diffY));
			if (dist < 1 ) dist = 1;
			var camCos = Math.cos(camera.rotation);
			var camSin = -Math.sin(camera.rotation);
			
			var vectorCam = {x:camCos,y:camSin};
			var vectorObjet	= {x:x/dist,y:y/dist};
			
			var angleCam = keepWithInCircle(calcAngleRadians(vectorCam.x,vectorCam.y));
			var angleObjet	= keepWithInCircle(calcAngleRadians(vectorObjet.x,vectorObjet.y));			
			var relativeAngle =  keepWithInCircle(angleCam - angleObjet);
			
			//var dot = scalarProduct2D(vectorCam,vectorObjet);
			
	
			if(relativeAngle <=k80degres || relativeAngle >= k280degres){
				//var angle = Math.acos(dot)+k90degres;
				var dontShow = false;
				var objCos = Math.cos(relativeAngle+k90degres);
				var objSin = -Math.sin(relativeAngle+k90degres);
				
				self.positionRelative.x = objCos*dist;
				self.positionRelative.y = objSin*dist;
				
				var points = self.geometry.data.map(function(arr){
					return {"x":arr[0],"y":arr[1],"z":arr[2]};
				});
				
				points = doRotate(points,relativeAngle,0,0);
				
				var points2D = [];
				
				points.forEach(function(point){
					point.x = point.x *size +self.positionRelative.x;
					point.y = point.y *size;
					point.z = point.z *size +self.positionRelative.y;
					if(point.z < 5) dontShow;

					var x = Math.floor((point.x*w2)/(dist-point.z));
					var y = Math.floor((point.y*w2)/(dist-point.z));
					points2D.push({"x":x,"y":y});
				});
					context.beginPath();
					context.strokeStyle="darkred"; 
					for(var i = 0;i < self.geometry.poly.length;i++){
						var polyPoints = self.geometry.poly[i];
						drawPoly(context,points2D,polyPoints);
						context.stroke();
						context.strokeStyle="black"; 
					}
			}
	}
}

function drawArrow(context,x1,y1,x2,y2){
	var branchLentgh = 10;
	var diffX = x2-x1;
	var diffY = y1-y2;
	var dist =  Math.sqrt(diffX*diffX+diffY*diffY);
	if(dist !=0){
		branchLentgh = Math.floor(dist/3);
		diffX = diffX /dist;
		diffY = diffY /dist;
		// calculation angle given 2 points, just to practise : don't use cam rotation !
		var rotation = calcAngleRadians(diffX,diffY);
		var leftBranch = keepWithInCircle(rotation + k45degres);
		var rightBranch = keepWithInCircle(rotation - k45degres);
		context.moveTo(x1, y1);
		context.lineTo(x2, y2);
		
		context.moveTo(x2, y2);
		context.lineTo(x2-Math.cos(leftBranch)*branchLentgh, y2+Math.sin(leftBranch)*branchLentgh);
		
		context.moveTo(x2, y2);
		context.lineTo(x2, y2);
		context.lineTo(x2-Math.cos(rightBranch)*branchLentgh, y2+Math.sin(rightBranch)*branchLentgh);

	}
}

function keepWithInCircle(rotation){
	if(rotation<0) rotation  += k360degres;
	if(rotation >k360degres ) rotation  -= k360degres;
	return rotation;
}

function Shape(geometry,size,distance,altitude,angleToOrigine,rotation,name){
	
	this.size = size;
	this.distance = distance;
	this.altitude = altitude;
	this.angleToOrigine = angleToOrigine; // something to do with the cam rotation its only an integer
	this.position = {"x":Math.cos(angleToOrigine)*distance,"y":altitude,"z":Math.sin(angleToOrigine)*distance};	//initial position with camera at 0 degree
	this.rotation = rotation;// nothing to do with the cam rotation
	this.geometry = {};
    this.name = name;
	
	this.geometry.data = [];
	this.geometry.poly = [];
	
	this.polyNr = geometry.poly.length;

	for(var i = 0;i < geometry.data.length;i++){
		var aPoint = geometry.data[i];
		var x = aPoint[0];
		var y = aPoint[1];
		var z = aPoint[2];
		var truePoint = {"x":x,"y":y,"z":z};
		this.geometry.data.push(truePoint);
	}
	for(var i = 0;i < geometry.data.length;i++){
		var aPoly = geometry.poly[i];
		this.geometry.poly.push(aPoly);
	}
	
	this.draw=function(){
		if(camera.position.x == 0 && camera.position.z == 0){		
			var newRotation = this.angleToOrigine - camera.rotation;
				if(newRotation <0) newRotation  += k360degres;
				if(newRotation >k360degres ) newRotation  -= k360degres;
			
			var cos = Math.cos(newRotation);
			var sin = Math.sin(newRotation);

			// not normed
			this.position = {
				"x": Math.floor(cos*this.distance),
				"y": this.altitude,
				"z":-Math.floor(sin*this.distance)
			};


		}else{
			
			// the circle is enlarged or shrunk but the angler of the camera does not change
			// the the angle of the cube to the camera changes
			// Get the distance to the object
			
			var cubeX = this.position.x - camera.position.x;
			var cubeY= this.position.y - camera.position.y;
			var cubeZ = this.position.z - camera.position.z;

			var newDistance = hypo(cubeX,cubeY,cubeZ);
			if(newDistance < 1) newDistance = 1;
			
			var cosCube = cubeX / newDistance;
			var sinCube = cubeZ / newDistance;
			
			this.angleToOrigine = calcAngleRadians(cosCube,sinCube);

			this.position = {"x":Math.cos(this.angleToOrigine)*newDistance,"y":this.altitude,"z":Math.sin(this.angleToOrigine)*newDistance};
			this.distance = newDistance;
			
		}

doDraw = newRotation <= k180degres;		
		if(doDraw){
			context.strokeStyle="black"; 
			var self = this;
			var scale;
			var points = [];
			this.geometry.data.forEach(function(point){
				var copyOfPoint = {"x":point.x,"y":point.y,"z":point.z};
				points.push(copyOfPoint);
			});
			points = doRotate(points,this.rotation.x+newRotation,this.rotation.y,this.rotation.z);
			var points2D = [];
			var size =  this.size;
			var position = this.position;
			//newPositionFromCenter
			//newRotation
			points.forEach(function(point){
				point.x *= size;
				point.y *= size;
				point.z *= size;
				
				point.x += self.position.x;
				point.y += self.position.y;
				point.z += self.position.z;
				
								
				scale=fov/(fov-point.z);
				var x = -Math.floor(point.x*scale);
				var y = Math.floor(point.y*scale);
				points2D.push({"x":x,"y":y});
			
			});
			context.beginPath();
			context.strokeStyle="darkred"; 
			for(var i = 0;i < this.polyNr-1;i++){
				var polyPoints = this.geometry.poly[i];
				drawPoly(context,points2D,polyPoints);
				context.stroke();
				context.strokeStyle="black"; 
			}
			context.strokeStyle="darkblue"; 
			drawPoly(context,points2D,polyPoints);
			context.stroke();
			
			var x2d = points2D[this.polyNr/2].x;
			var y2d = points2D[this.polyNr/2].y;
			var z3d = points[this.polyNr/2].z;
			
			var message = this.name + " : " + Math.floor(todegrees(this.angleToOrigine))+" ° => z = " + Math.floor(z3d) ;
			context.fillText(message,x2d ,y2d+20);
			
		}
	}
}	

function drawPoly(context,points,poly){
	
	context.moveTo(points[poly[0]].x, points[poly[0]].y);		

	for(var i = 1; i < poly.length; i++) {
		context.lineTo(points[poly[i]].x, points[poly[i]].y);
	}
	
	context.lineTo(points[poly[0]].x, points[poly[0]].y);

}


function simpleRotate(point,angle){
	var cos = Math.cos(angle);
	var sin = -Math.sin(angle);
	rotatedX = point.x * cos - point.y * sin;
    rotatedY = point.y * cos + point.x * sin;
	return {"x":rotatedX,"y":rotatedY}
}

function calcRotationGivenAdjacentSide(adjacent, hypotenuse){
	if(!hypotenuse) hypotenuse = 1; // if already normed
	var ratio = adjacent/hypotenuse;
	var result = 1 - ratio*ratio/2;
	result = Math.acos(result);
	return result;	
}
	
function doRotate(points,pitch, roll, yaw) {
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);

    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);

    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);

    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;

    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;

    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;

    for (var i = 0; i < points.length; i++) {
        var px = points[i].x;
        var py = points[i].y;
        var pz = points[i].z;

        points[i].x = Axx*px + Axy*py + Axz*pz;
        points[i].y = Ayx*px + Ayy*py + Ayz*pz;
        points[i].z = Azx*px + Azy*py + Azz*pz;
    }
	return points;
}

function calcAngleDegrees(x, y) { // origine : MDN docs
  return Math.atan2(y, x) * 180 / Math.PI;
}

function calcAngleRadians(x, y) { // origine : calcAngleDegrees
  return Math.atan2(y, x);
}

	document.addEventListener("keydown", function(event) {
		switch(event.keyCode) {
			case 37: // left ctrlKey shiftKey
				camera.turn(-1);
				break;
			case 39: // right
				camera.turn(1);
				break;
			case 38: // up
			    camera.walk(1);
				break;
			case 40: // down
				camera.walk(-1);
				break;
		}
	}); 
	
	window.onresize = function(event) {
		init();
	};

}
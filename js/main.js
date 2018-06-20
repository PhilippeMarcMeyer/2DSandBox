/* Philippe Meyer */



window.onload = function() {
	var needUpdate,width,height,fov,h2,w2,k90degres,k270degres,k360degres;

	var canvas = document.getElementById("canvas");
	var	context = canvas.getContext("2d");
	var things = [];
	var camera = new Camera(0.1,5,toradians(90));
		
init();

	
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
things.push(new Square(10,100,k90degres,"A"));

things.push(new Square(10,140,k90degres-0.2,"B"));

things.push(new Square(10,250,k180degres-0.5,"C"));

	update();

	
function init(){
	
	width = canvas.width = window.innerWidth;
	height = canvas.height = window.innerHeight;
	needUpdate = true;
	fov = width;
	w2 = width/2;
	h2 = height/2;
	k90degres = toradians(90);
	k45degres = toradians(45);
	k180degres = toradians(180);
	k270degres = toradians(270);
	k360degres = toradians(360);
	context.translate(width / 2, height / 2);
	needUpdate = true;

}

function update() {
	needUpdate = true;
	if(needUpdate){
		//context.rect(-w2+10,-h2+10,width-10,height-10);
		//context.clearRect(-w2 , -h2, width, height);
		context.fillStyle="white"; 
		context.rect(-w2 , -h2, width, height);
		context.fill();
		context.fillStyle="black"; 
		things.forEach(function(thing){
			thing.draw();
		});
		needUpdate = false;
	}
	requestAnimationFrame(update);
	
}

function Camera(rotStep,walkStep,rotation) {
	this.rotation = rotation ? rotation : 0; 
	this.position = {x:0,y:0,z:0};
	this.walkStep = walkStep;
	this.rotStep = rotStep;
	this.turn = function(amount){ // -1 or +1
		//this.rotation.x += rotAngle.x;
		this.rotation -= this.rotStep*amount;
		if(this.rotation<0) this.rotation  += k360degres;
		if(this.rotation >k360degres ) this.rotation  =0;
		//console.log("Camera : " + Math.floor(todegrees(this.rotation)));
	}
	this.walk = function(amount){// -1 or +1
		// Calculate new position considering the amount, the position and the direction
		var dirx = Math.cos(this.rotation);
		var dirz = - Math.sin(this.rotation);
		this.position.x = Math.floor(this.position.x + (dirx * amount * this.walkStep)); 
		this.position.z = Math.floor(this.position.z + (dirz * amount * this.walkStep));
	}
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
	this.data = [
		[-1,-1,-1],
		[1,-1,-1],
		[1, 1,-1],
		[-1, 1,-1],
		[1,-1, 1],
		[-1,-1, 1],
		[-1, 1, 1],
		[1, 1, 1]
	];
this.poly=[];
this.poly[0]=[0,1,2,3];
this.poly[1]=[1,4,7,2];
this.poly[2]=[4,5,6,7]; 
this.poly[3]=[5,0,3,6];
this.poly[4]=[5,4,1,0];
this.poly[5]=[3,2,7,6];
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

function hypo(x,y,z){
return Math.sqrt(x*x+y*y+z*z);
}
// primitive,size,distance,altitude,angleToOrigine,rotation,name
function Square(size,distance,angleToOrigine,name){
	this.size = size;
	this.distance = distance;
	this.angleToOrigine = angleToOrigine; 
	this.name = name;
	this.positionAbsolute = {x:0,y:0};
	this.positionRelative = {x:0,y:0};
	this.half = Math.floor(size/2);
	
	var cos = Math.cos(this.angleToOrigine);
	var sin = -Math.sin(this.angleToOrigine);
	
	
	
	this.positionAbsolute.x = Math.floor(cos*distance);
	this.positionAbsolute.y = Math.floor(sin*distance);

	this.draw = function(){
		var self = this;
			self.positionRelative.x = self.positionAbsolute.x;
			self.positionRelative.y = self.positionAbsolute.y;
			context.beginPath();
			context.strokeStyle="black"; 
			context.moveTo(self.positionRelative.x-self.half, self.positionRelative.y-self.half);
			context.rect(self.positionRelative.x-self.half,self.positionRelative.y-self.half,self.half,self.half);
			var message = self.name;
			context.fillText(message, self.positionRelative.x+5, self.positionRelative.y-5);
			context.closePath();
			context.stroke();
			
			context.globalAlpha=0.8;

			context.beginPath();
			context.strokeStyle="red"; 
			context.arc(0, 0, self.distance, 0, Math.PI * 2, true);
			context.closePath();
			context.stroke();
			
			context.globalAlpha=0.2;

			context.beginPath();
			context.strokeStyle="green"; 
			context.moveTo(-50, 0);
			context.lineTo(50, 0);
			context.moveTo(0, 50);
			context.lineTo(0, -50);
			context.closePath();
			context.stroke();
			
			context.globalAlpha=1;
			
			context.beginPath();
			context.strokeStyle="darkblue"; 
			//context.arc(0, 0, 2, 0, Math.PI * 2, true);
			var messagePosition = camera.position.x + "," + camera.position.z;
			var camCos = Math.cos(camera.rotation);
			var camSin = -Math.sin(camera.rotation);
			var vectorCam = {x:camCos*30,y:camSin*30};
			drawArrow(context,camera.position.x,camera.position.z,camera.position.x+vectorCam.x,camera.position.z+vectorCam.y);
			context.fillText(messagePosition+" * " + Math.floor(camera.rotation * 180 / Math.PI) +" °", camera.position.x + 30, camera.position.z -30);
			context.closePath();
			context.stroke();
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
function simpleRotate(item,angle){
	rotatedX = x * cos(angle) - y * sin(angle)
   rotatedY = y * cos(angle) + x * sin(angle)
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
				needUpdate = true;
				camera.turn(-1);
				break;
			case 39: // right
				needUpdate = true;
				camera.turn(1);
				break;
			case 38: // up
			    camera.walk(1);
				needUpdate = true;
				break;
			case 40: // down
				camera.walk(-1);
				needUpdate = true;
				break;
		}
	}); 
	
	window.onresize = function(event) {
		init();
	};
}

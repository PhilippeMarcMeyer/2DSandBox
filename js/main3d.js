/* Philippe Meyer */



window.onload = function() {
	var needUpdate,fov,h2,w2,w4,h4,k90degres,k270degres,k360degres,camera;
	var saveContext;
	var canvas = document.getElementById("canvas");
	var	context = canvas.getContext("2d");
	var w,h;
	var fov = 400; ; //pixels are 250px away from us
	
	var things = [];
	var camera = new Camera(0.05,10,toradians(90));
	var mode = "3d";
	init();


things.push(new Cube(80,100,k90degres,0.5,"A"));

things.push(new Cube(80,140,k90degres-0.4,0.25,"B"));

things.push(new Cube(80,250,k180degres-0.5,0.1,"C"));

things.push(new Cube(80,185,k180degres+1,.3,"D"));

things.push(new Cube(80,220,0.9,.3,"E"));

things.push(new Cube(80,325,1.5,.7,"F"));

	update();

	
function init(){
	
	w = canvas.width = window.innerWidth;
	h = canvas.height = window.innerHeight;
	
	
	w2 = w/2;
	w4 = w/4;
	h2 = h/2;
	h4 = h/4;
	k90degres = toradians(90);
	k60degres = toradians(60);
	k45degres = toradians(45);
	k180degres = toradians(180);
	k270degres = toradians(270);
	k360degres = toradians(360);
	k80degres = toradians(80);
	k280degres = toradians(280);
	
	camFov = toradians(140);
	focalW = w2 / Math.tan(camFov/2)  ;
	camFov = toradians(80);
	focalH = h2 / Math.tan(camFov/2) ;
	zoom = 4;
	focal = (focalW + focalH)/2;
	focal = focalW;
	focalW = w;
	focalH = h;
	context.translate(w / 2, h / 2);
	camera.zoom =  w4 / camera.sightWidthDegrees;

}

function update() {

		
		context.clearRect(-w2 , -h2, w, h);
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



function Camera(rotStep,walkStep,rotation) {
	this.rotation = rotation ? rotation : 0; 
	this.position = {x:0,y:0,z:0};
	this.previousLocation = {x:0,y:0,z:0}; 
	this.antePenultLocation = {x:0,y:0,z:0}; 
	this.sightWidthDegrees = 140;
	this.sightWidth = toradians(this.sightWidthDegrees );
	this.zoom = 0;
	this.sightLength = 300;
	this.walkStep = walkStep;
	this.rotStep = rotStep;
	this.bodyRadius = 20;
	this.turn = function(amount){ // -1 or +1
		this.rotation -= this.rotStep*amount;
		if(this.rotation<0) this.rotation  += k360degres;
		if(this.rotation >k360degres ) this.rotation  =0;
	}
	this.walk = function(amount){// -1 or +1
		this.savePosition();
		var dirx = Math.cos(this.rotation);
		var dirz = - Math.sin(this.rotation);
		this.position.x = Math.floor(this.position.x + (dirx * amount * this.walkStep)); 
		this.position.z = Math.floor(this.position.z + (dirz * amount * this.walkStep));
	}

	
	this.draw = function(){
		var self = this;
		
		//self.checkCollisions(); 
		
		//self.drawSoil();
		
		self.Scan();
	}


	

	
	this.drawSoil=function(){
		var self = this;
	}
	
	this.checkCollisions=function(){
		var self = this;
		self.savePosition ();
		things.forEach(function(t){
			var points = t.geometry.points;
			var center = t.geometry.center;
			var corners = [
					{"x":-1,"y":-1}, // top-left
					{"x":1,"y":-1}, //  top-rigth
					{"x":1,"y":1}, //   bottom-right
					{"x":-1,"y":1} //   bottom-left
				];
				corners.forEach(function(c){
					c = simpleRotate(c,t.innerRotation)
					c.x = (c.x * t.half) + center.x;
					c.y = (c.y * t.half) + center.y;
				});
				var poly = [corners[0],corners[1],corners[2],corners[3],corners[0]];
				if(collideCirclePoly(self.position.x , self.position.z, self.bodyRadius*2, poly)) {
					self.restorePosition();
				}			
			}); 
	}



	this.Scan=function(){
		var self = this;
		things.forEach(function(t){
			t.hit = false;
			// get the center of square : 
			var center = t.geometry.center;
			// calculate position relative to camera
			var relPosition = {};
			relPosition.x = center.x - camera.position.x;
			relPosition.y = center.y - camera.position.y;
			relPosition.z = center.z - camera.position.z;
			var dist = hypo(relPosition.x,relPosition.y,relPosition.z);
			relPosition = simpleRotate3d(relPosition,-camera.rotation+k90degres);
			
			t.geometry.relativePosition.x  = relPosition.x;
			t.geometry.relativePosition.y  = relPosition.y;
			t.geometry.relativePosition.z  = relPosition.z-w2;

			t.geometry.grot = calcAngleRadians(t.geometry.relativePosition.x,t.geometry.relativePosition.z);
			//var scale=focal/(focal-t.geometry.relativePosition.z);


			var irot = t.innerRotation;
			
			var irotCos = Math.cos(irot);
			var irotSin = -Math.sin(irot);
			
			var irotpos = simpleRotate({"x":irotCos,"y":irotSin},-camera.rotation+k90degres);
			t.geometry.irot = calcAngleRadians(irotpos.x,irotpos.y);
			t.geometry.dist =  dist;

			// Should we draw the cube ? check the distance and the angle left and right from the camera axis
			if(t.geometry.relativePosition.z < -w2 && t.geometry.dist <= self.sightLength){
			//if(t.geometry.grot >= -self.sightWidth/2 && t.geometry.grot <= self.sightWidth/2 && t.geometry.dist <=  self.sightLength){
				t.hit = true;
				
				// I want to draw near cubes in an arc going from the edges of the leftBottom of the screen tp mid height back to right bottom of the screen
				// the distance narrows the width
			var degreeRotation = todegrees(t.geometry.grot );
			var center2d =  {"x":t.geometry.relativePosition.x,"y":t.geometry.relativePosition.y};
				// if yes, the calculate normals and dots to help 
				var nrPoints = t.geometry.points.length;
				// Copy the points of the cube geometry to avoid modifying the model
				var points = [];
				for(var i= 0 ; i < nrPoints;i++){
					points.push({"x":t.geometry.points[i].x,"y":t.geometry.points[i].y,"z":t.geometry.points[i].z});
				}
				points.forEach(function(p,i){
					p = simpleRotate3d(p,t.geometry.irot)
					p.x = (p.x * t.half) ;
					p.z = (p.z * t.half);
					p.y = (p.y * t.half);
					
					var scaleW = focalW/(focalW - t.geometry.relativePosition.z - p.z);
					var scaleH = focalH/(focalH - t.geometry.relativePosition.z - p.z);


					t.geometry.points2d[i].x = (center2d.x*self.zoom + p.x) *scaleW;
					t.geometry.points2d[i].y = (center2d.y*self.zoom + p.y) *scaleH;
				});
				
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
function Cube(size,distance,angleToOrigine,innerRotation,name){
	
	this.geometry = {
		"center" : {"x":0,"y":0,"z":0},
		"points" : [
					{"x":-1,"y":-1,"z":-1}, // left, bottom, back
					{"x":1,"y":-1,"z":-1}, // right, bottom, back
					{"x":1,"y":1,"z":-1}, // right, top, back
					{"x":-1,"y":1,"z":-1}, // left, top, back
					{"x":1,"y":-1,"z":1}, // right, bottom, front
					{"x":-1,"y":-1,"z":1}, // left, bottom, front
					{"x":-1,"y":1,"z":1},// left, top, front
					{"x":1,"y":1,"z":1} // right, top, front
				],

		"polys" : [
					[0,1,2,3], // Back side
					[1,4,7,2], // Right side
					[4,5,6,7], // front side
					[5,0,3,6], // left side
					[5,4,1,0], // bottom side
					[3,2,7,6] // top side
				],
		"colors" : [
				"DarkOrchid",
				"FireBrick",
				"GoldenRod",
				"HotPink",
				"OrangeRed",
				"MidnightBlue"
			],
			
		"normals" : [
				{"x":0,"y":0,"z":0},
				{"x":0,"y":0,"z":0},
				{"x":0,"y":0,"z":0},
				{"x":0,"y":0,"z":0},
				{"x":0,"y":0,"z":0},
				{"x":0,"y":0,"z":0}
		],
		
		"dots" : [
				0,
				0,
				0,
				0,
				0,
				0
		],
		"relativePosition" : {"x":0,"y":0,"z":0}, // 2d relative center position
		"grot" : 0,	// 2d global rotation
		"irot" : 0,	// 2d inner rotation
		"dist" : 0,	// 2d distance of center to camera
		"points2d" : [	// relative to camera
				{"x":0,"y":0},
				{"x":0,"y":0},
				{"x":0,"y":0},
				{"x":0,"y":0},
				{"x":0,"y":0},
				{"x":0,"y":0},
				{"x":0,"y":0},
				{"x":0,"y":0}
		]
	}


	this.size = size;
	this.distance = distance;
	this.angleToOrigine = angleToOrigine; 
	this.name = name;
	this.innerRotation = innerRotation;
	
	this.half = Math.floor(size/2);
	this.hit = false;
	this.hitAngles = [];
	this.hitMiddleAngle = 0;
		
		
	// Calculating the real center position to the origin :
	var cos = Math.cos(this.angleToOrigine);
	var sin = -Math.sin(this.angleToOrigine);

	this.geometry.center.x = Math.floor(cos*distance);
	this.geometry.center.y = 0;
	this.geometry.center.z = Math.floor(sin*distance);

	


	this.draw = function(){
		var self = this;

		if(self.hit){
			
			var points = self.geometry.points2d;
			var polys = self.geometry.polys;
			var colors = self.geometry.colors;
			
			polys.forEach(function(poly,i){
				var color = colors[i];
				context.strokeStyle  =color; 
				context.beginPath();
				
				context.moveTo(points[poly[0]].x, points[poly[0]].y);
				for(var j = 1; j < poly.length;j++){
					context.lineTo(points[poly[j]].x, points[poly[j]].y);
				}
				context.lineTo(points[poly[0]].x, points[poly[0]].y);
				context.closePath();
				context.stroke();
			});
				context.fillText(self.name+" "+ Math.floor(todegrees(self.geometry.grot )),points[0].x, points[0].y);

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
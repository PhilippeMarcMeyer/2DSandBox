/* Philippe Meyer */

var things = [];

var w = 640;
var h = 480;
var fov = 500;
var w2 = w/2;
var h2 = h/2;

function setup() {

	createCanvas(w, h);
	things.push(new Shape(new Cube(),80,{x:40,y:20,z:50},{x:0.3,y:0,z:0}));
	things.push(new Shape(new Cube(),40,{x:-150,y:20,z:100},{x:0.1,y:1,z:0}));
}

function draw() {
			background(225);

	things.forEach(function(thing){
		thing.draw();
	});
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

function Shape(geometry,shapeSize,shapePosition,shapeRotation){
	
	this.shapeSize = shapeSize;
	this.shapePosition = shapePosition;
	this.rotation = shapeRotation;
	this.geometry = {};

	
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
		var c = color(225, 50, 0);
		stroke(c);

		var scale;
		var points = [];
		this.geometry.data.forEach(function(point){
			var copyOfPoint = {"x":point.x,"y":point.y,"z":point.z};
			points.push(copyOfPoint);
		});
		points = doRotate(points,this.rotation.x,this.rotation.y,this.rotation.z);
		var points2D = [];
		var shapeSize =  this.shapeSize;
		var shapePosition = this.shapePosition;
		points.forEach(function(point){
			point.x *= shapeSize;
			point.y *= shapeSize;
			point.z *= shapeSize;
			
			point.x += shapePosition.x;
			point.y += shapePosition.y;
			point.z += shapePosition.z;

			
			scale=fov/(fov+point.z);
			var x = Math.floor(point.x*scale+w2);
			var y = Math.floor(point.y*scale+h2);
			points2D.push({"x":x,"y":y});
		});
		
		for(var i = 0;i < this.polyNr;i++){
			var polyPoints = this.geometry.poly[i];
			for(var j = 0;j < polyPoints.length;j++){
				if(j == polyPoints.length -1){
					line(points2D[polyPoints[j]].x, points2D[polyPoints[j]].y, points2D[polyPoints[0]].x, points2D[polyPoints[0]].y);
				}else{
					line(points2D[polyPoints[j]].x, points2D[polyPoints[j]].y, points2D[polyPoints[j+1]].x, points2D[polyPoints[j+1]].y);
				}
			}
		}
stroke(c);
	}
	
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


	document.addEventListener("keydown", function(event) {
		switch(event.keyCode) {
			case 37: // left
				if(event.ctrlKey) {
				}
				else {
				}
				break;
			case 39: // right
				if(event.ctrlKey) {
				}
				else {
				}
				break;
			case 38: // up
				if(event.shiftKey) {
				}
				else if(event.ctrlKey) {
				}
				else {
				}
				break;
			case 40: // down
				if(event.shiftKey) {
				}
				else if(event.ctrlKey) {
				}
				else {
				}
				break;
		}
	}); 

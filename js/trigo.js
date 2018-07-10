	k90degres = toradians(90);
	k60degres = toradians(60);
	k45degres = toradians(45);
	k180degres = toradians(180);
	k270degres = toradians(270);
	k360degres = toradians(360);
	k80degres = toradians(80);
	k280degres = toradians(280);  
	
	
// Converts from degrees to radians.
function  toradians(degrees) {
	return degrees * Math.PI / 180;
}

// Converts from radians to degrees.
function todegrees(radians) {
	return radians * 180 / Math.PI;
}

  
function simpleRotate(point,angle){
	var cos = Math.cos(angle);
	var sin = -Math.sin(angle);
	rotatedX = point.x * cos - point.y * sin;
    rotatedY = point.y * cos + point.x * sin;
	return {"x":rotatedX,"y":rotatedY}
}

function simpleRotate3d(point,angle){
	var cos = Math.cos(angle);
	var sin = -Math.sin(angle);
	rotatedX = point.x * cos - point.z * sin;
	rotatedY = point.y;
    rotatedZ = point.z * cos + point.z * sin;
	return {"x":rotatedX,"y":rotatedY,"z":rotatedZ}
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


function normale(a, b, d){
	// use the first 2 points of the surface + the last one
var len=Math.sqrt(a.x*a.x+a.y*a.y+a.z*a.z);
var xu = (b.x - a.x); 
var xv = (d.x - a.x);
var yu = (b.y - a.y);
var yv = (d.y - a.y);
var zu = (b.z - a.z);
var zv = (d.z - a.z);

xu=xu/len;
xv=xv/len;
yu=yu/len;
yv=yv/len;
zu=zu/len;
zv=zv/len;
var xw = yu * zv - yv * zu;
var yw = zu * xv - zv * xu;
var zw = xu * yv - xv * yu;

return {"x":xw,"y":yw,"z":zw};
}

function calcAngleDegrees(x, y) { // origine : MDN docs
  return Math.atan2(y, x) * 180 / Math.PI;
}

function calcAngleRadians(x, y) { // origine : calcAngleDegrees
  return Math.atan2(y, x);
}


function keepWithInCircle(rotation){
	if(rotation<0) rotation  += k360degres;
	if(rotation >k360degres ) rotation  -= k360degres;
	return rotation;
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
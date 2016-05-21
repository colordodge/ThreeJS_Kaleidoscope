

// var stats = new Stats();
// stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom );


var bufferSize = 1024;
var bufferWidth = bufferSize;
var bufferHeight = bufferSize;


var scene = new THREE.Scene();

var bufferCamera = new THREE.PerspectiveCamera(75, bufferWidth / bufferHeight, 0.1, 1000);
bufferCamera.position.z = 2;
var camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 0.1, 1000 );
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.TrackballControls(bufferCamera, renderer.domElement);
controls.noZoom = true;
controls.dynamicDampingFactor = 0.1;
controls.rotateSpeed = 1;

var controls2 = new THREE.OrbitControls(camera, renderer.domElement);
controls2.enableZoom = true;
controls2.enableRotate = false;
controls2.zoomSpeed = 0.3;
controls2.minZoom = 0.2
controls2.maxZoom = 2;
controls2.enablePan = false;


var bufferScene = new THREE.Scene();
var bufferTexture = new THREE.WebGLRenderTarget( bufferWidth, bufferHeight, { minFilter: THREE.LinearMipMapLinearFilter, magFilter: THREE.LinearFilter, antialias: true});


/// buffer scene objects

var numAxes = 12;

// var geometry = new THREE.IcosahedronGeometry(3, 2);
var geometry = new THREE.TorusKnotGeometry( 1, 0.5, 50, 20, 4, 16 );
var material = new THREE.MeshPhongMaterial({color:0x993300, specular:0xffff00, shading:THREE.FlatShading, side:THREE.DoubleSide});
material.color.setHSL(1.0,0.5,0.5);
material.specular.setHSL(0.5,1.0,0.1);
material.shininess = 30; 
var hue = Math.random();
var specHue = Math.random();

var material2 = new THREE.MeshPhongMaterial({color:0x993300, specular:0xffff00, shading:THREE.FlatShading, side:THREE.DoubleSide});
material2.color.setHSL(1.0,0.5,0.5);
material2.specular.setHSL(0.5,1.0,0.1);
material2.shininess = 30; 
var hue2 = Math.random();
var specHue2 = Math.random();

var cube = new THREE.Mesh(geometry, material2);
cube.rotation.x = Math.random();
cube.rotation.y = Math.random();
cube.rotation.z = Math.random();
bufferScene.add(cube);

var cube2 = new THREE.Mesh(geometry, material);
cube2.rotation.x = Math.random();
cube2.rotation.y = Math.random();
cube2.rotation.z = Math.random();
bufferScene.add(cube2);


var ambientLight = new THREE.AmbientLight(0x404040);
bufferScene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0,50,100);
bufferScene.add(pointLight);


/// main scene objects

var ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

var pointLight3 = new THREE.PointLight(0xffffff);
pointLight3.position.set(-100,200,100);
scene.add(pointLight3);




// main object

var tileHolder;
var tileMat = new THREE.MeshBasicMaterial({map:bufferTexture, side:THREE.DoubleSide});


function updateGridGeometry()
{
	console.log("updating geometry");

	scene.remove(tileHolder);
	tileHolder = new THREE.Object3D();

	var theta = 0;
	var numSteps = numAxes;
	var step = 2*Math.PI / numSteps;
	var radius = 1;

	var tileGeometry = new THREE.Geometry();
	tileGeometry.vertices.push(new THREE.Vector3(0,0,0));

	var snapStep;
	var stepAngle;
	var rotOffset;

	// compute tile width
	var p1 = new THREE.Vector2(radius*Math.cos(0), radius*Math.sin(0));
	var p2 = new THREE.Vector2(radius*Math.cos(stepAngle), radius*Math.sin(stepAngle));
	var dist = p1.distanceTo(p2);
	var a = dist / 2;
	var c = radius;
	var b = Math.sqrt(c*c - a*a);
	var tileWidth;
	var tileHeight;
	var tileRowOffset;


	// find out if numAxes is factor of 4 or 6
	if ( !(numAxes % 6) )
	{
		// factor of 6
		snapStep = numAxes/6;
		stepAngle = (2*Math.PI) / 6;
		rotOffset = stepAngle / 2;

		tileWidth = b*2;
		tileHeight = c + a;
		tileRowOffset = b;
	}
	else
	{
		// factor of 4
		snapStep = numAxes/4;
		stepAngle = (2*Math.PI) / 4;
		rotOffset = 0;

		tileWidth = c * 2;
		tileHeight = c;
		tileRowOffset = c;
	}
	

	// add vertices
	for (var i=0; i<numSteps; i++)
	{
		var mod = i % snapStep;
		var ratio = mod / snapStep;
		var position = Math.floor(i/snapStep);
		var angle1 = stepAngle * position;
		var angle2 = stepAngle * (position+1);
		var x, y;

		if (mod == 0) 
		{
			// standard vertex position
			x = radius * Math.cos(theta);
			y = radius * Math.sin(theta);
		}
		else
		{
			// interpolate between angle1 and angle2
			var x1 = radius * Math.cos(angle1);
			var y1 = radius * Math.sin(angle1);

			var x2 = radius * Math.cos(angle2);
			var y2 = radius * Math.sin(angle2);

			x = x1 + ( (x2-x1) * ratio );
			y = y1 + ( (y2-y1) * ratio );
		}

		tileGeometry.vertices.push(new THREE.Vector3(x ,y ,0));
		theta += step; 
	}

	// add faces
	for (var i=0; i<numSteps; i++)
	{
		var v1 = i+1;
		var v2 = i+2;
		if (v2 > numSteps) v2 = 1;
		tileGeometry.faces.push( new THREE.Face3( 0, v1, v2 ) );
	}


	tileGeometry.computeBoundingSphere();
	tileGeometry.computeBoundingBox();


	// set UV mapping
	tileGeometry.faceVertexUvs[0] = [];

	for (i = 0; i < tileGeometry.faces.length ; i++) 
	{
		if (i%2)
		{
			tileGeometry.faceVertexUvs[0].push([
				new THREE.Vector2( 0.5,  0),
				new THREE.Vector2( 0, 1),
				new THREE.Vector2(  1, 1)
			]);
		}
		else
		{
			tileGeometry.faceVertexUvs[0].push([
				new THREE.Vector2( 0.5,  0),
				new THREE.Vector2( 1, 1),
				new THREE.Vector2(  0, 1)
			]);
		}	
	}

	tileGeometry.uvsNeedUpdate = true;


	var tileRow = new THREE.Object3D();
	tileHolder.add(tileRow);

	var scale = bufferSize;

	var tileMesh = new THREE.Mesh(tileGeometry, tileMat);
	tileMesh.scale.set( scale, scale, 1 );
	tileMesh.rotation.z = rotOffset;
	tileRow.add(tileMesh);

	var tileCountX = 4;
	for (var i=0; i<tileCountX; i++)
	{
		var tileMeshLeft = tileMesh.clone();
		tileMeshLeft.position.x -= (tileWidth * scale) * (i+1);
		tileRow.add(tileMeshLeft);

		var tileMeshRight = tileMesh.clone();
		tileMeshRight.position.x += (tileWidth * scale) * (i+1);
		tileRow.add(tileMeshRight);
	}

	var tileCountY = 3;
	for (var i=0; i<tileCountY; i++)
	{
		var tileRowTop = tileRow.clone();
		tileRowTop.position.y += tileHeight * scale * (i+1);
		if (!(i%2)) tileRowTop.position.x += tileRowOffset * scale;
		tileHolder.add(tileRowTop);

		var tileRowBottom = tileRow.clone();
		tileRowBottom.position.y -= tileHeight * scale * (i+1);
		if (!(i%2)) tileRowBottom.position.x += tileRowOffset * scale;
		tileHolder.add(tileRowBottom);
	}



	scene.add(tileHolder);
}

updateGridGeometry();


// GUI

var gui = new dat.GUI();
var numAxesControl = gui.add(this, "numAxes", [4, 6, 8, 12, 16, 18, 20, 24, 28, 30, 32, 36]);

numAxesControl.onChange(function(value){
	console.log("numAxes changed");
	updateGridGeometry();
});

// test plane
// var planeMat = new THREE.MeshBasicMaterial({map:bufferTexture, side:THREE.DoubleSide});
// var planeGeo = new THREE.PlaneGeometry(bufferWidth, bufferHeight);
// var planeObj = new THREE.Mesh(planeGeo, planeMat);
// scene.add(planeObj);


function render()
{
	// stats.begin();

	
	update();
	
	renderer.render(bufferScene, bufferCamera, bufferTexture);
	renderer.render(scene, camera);

	// stats.end();

	requestAnimationFrame(render);
}
render();

function update()
{
	controls.update();

	var speed = -0.2;

	cube.rotation.x += 0.0045 * speed;
	cube.rotation.y += 0.0021 * speed;
	cube.rotation.z -= 0.0016 * speed;

	cube2.rotation.x -= 0.0031 * speed;
	cube2.rotation.y -= 0.0027 * speed;
	cube2.rotation.z += 0.0009 * speed;

	hue += 0.0005;
	if (hue > 1.0) hue = 0.0;
	material.color.setHSL(hue, 0.5, 0.3);

	specHue += 0.0008;
	if (specHue > 1.0) specHue = 0.0;
	material.specular.setHSL(specHue, 1.0, 0.5);

	hue2 += 0.0003;
	if (hue2 > 1.0) hue2 = 0.0;
	material2.color.setHSL(hue2, 0.5, 0.3);

	specHue2 += 0.0001;
	if (specHue2 > 1.0) specHue2 = 0.0;
	material2.specular.setHSL(specHue2, 1.0, 0.5);
}
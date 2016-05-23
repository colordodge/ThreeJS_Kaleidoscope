function TorusKnotShape()
{
	var material = new THREE.MeshPhongMaterial({color:0x993300, specular:0xffff00, shading:THREE.FlatShading, side:THREE.DoubleSide});
	material.color.setHSL(1.0,0.5,0.5);
	material.specular.setHSL(0.5,1.0,0.1);
	material.shininess = 30; 
	var hue = Math.random();
	var specHue = Math.random();

	var hueSpeed = (Math.random() * 10) / 10000;
	var specHueSpeed = (Math.random() * 10) / 10000;

	console.log("hueSpeed = " + hueSpeed);
	console.log("specHueSpeed = " + specHueSpeed);

	var torus = {radius:1, tubeSize:0.5, tubularSegments:50, radialSegments:30, p:4, q:16};
	var torusGeo = new THREE.TorusKnotGeometry( torus.radius, torus.tubeSize, torus.tubularSegments, torus.radialSegments, torus.p, torus.q );

	this.mesh = new THREE.Mesh(torusGeo, material);
	this.mesh.rotation.x = Math.random();
	this.mesh.rotation.y = Math.random();
	this.mesh.rotation.z = Math.random();

	var rotSpeedX = Math.random() / 400;
	var rotSpeedY = Math.random() / 400;
	var rotSpeedZ = Math.random() / 400;

	this.update = function()
	{
		this.mesh.rotation.x += rotSpeedX * speed;
		this.mesh.rotation.y += rotSpeedY * speed;
		this.mesh.rotation.z -= rotSpeedZ * speed;

		hue += hueSpeed;
		if (hue > 1.0) hue = 0.0;
		material.color.setHSL(hue, 0.5, 0.3);

		specHue += specHueSpeed;
		if (specHue > 1.0) specHue = 0.0;
		material.specular.setHSL(specHue, 1.0, 0.5);
	}
}
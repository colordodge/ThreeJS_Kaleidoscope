function TorusKnotShape()
{

	var material;
	var hue;
	var specHue;

	this.mesh;

	this.init = function()
	{
		material = new THREE.MeshPhongMaterial({color:0x993300, specular:0xffff00, shading:THREE.FlatShading, side:THREE.DoubleSide});
		material.color.setHSL(1.0,0.5,0.5);
		material.specular.setHSL(0.5,1.0,0.1);
		material.shininess = 30; 
		hue = Math.random();
		specHue = Math.random();

		var torus = {radius:1, tubeSize:0.5, tubularSegments:50, radialSegments:30, p:4, q:16};
		var torusGeo = new THREE.TorusKnotGeometry( torus.radius, torus.tubeSize, torus.tubularSegments, torus.radialSegments, torus.p, torus.q );

		this.mesh = new THREE.Mesh(torusGeo, material);
		this.mesh.rotation.x = Math.random();
		this.mesh.rotation.y = Math.random();
		this.mesh.rotation.z = Math.random();
	}

	this.init();

	this.update = function()
	{
		this.mesh.rotation.x += 0.0045 * speed;
		this.mesh.rotation.y += 0.0021 * speed;
		this.mesh.rotation.z -= 0.0016 * speed;


		hue += 0.0005;
		if (hue > 1.0) hue = 0.0;
		material.color.setHSL(hue, 0.5, 0.3);

		specHue += 0.0008;
		if (specHue > 1.0) specHue = 0.0;
		material.specular.setHSL(specHue, 1.0, 0.5);
	}
}
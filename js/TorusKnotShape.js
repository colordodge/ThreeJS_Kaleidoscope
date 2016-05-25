function TorusKnotShape()
{
	var material = new THREE.MeshPhongMaterial({color:0x993300, specular:0xffff00, shading:THREE.FlatShading, side:THREE.DoubleSide});
	material.color.setHSL(1.0,0.5,0.5);
	material.specular.setHSL(0.5,1.0,0.1);
	material.shininess = 30; 

	this.hue = Math.random();
	this.specHue = Math.random();
	this.sat = Math.random();
	this.sat2 = Math.random();

	var hueSpeed = (Math.random() * 10) / 10000;
	var specHueSpeed = (Math.random() * 10) / 10000;

	var torus = {radius:1, tubeSize:0.5, tubularSegments:50, radialSegments:30, p:4, q:16};
	var torusGeo = new THREE.TorusKnotGeometry( torus.radius, torus.tubeSize, torus.tubularSegments, torus.radialSegments, torus.p, torus.q );

	this.mesh = new THREE.Mesh(torusGeo, material);
	this.mesh.rotation.x = Math.random() * Math.PI*2;
	this.mesh.rotation.y = Math.random() * Math.PI*2;
	this.mesh.rotation.z = Math.random() * Math.PI*2;

	var rotSpeedX = Math.random() / 400;
	var rotSpeedY = Math.random() / 400;
	var rotSpeedZ = Math.random() / 400;

	if (Math.random() > 0.5) {rotSpeedX = -rotSpeedX};
	if (Math.random() > 0.5) {rotSpeedY = -rotSpeedX};
	if (Math.random() > 0.5) {rotSpeedZ = -rotSpeedX};

	var oscX = Math.random() * Math.PI*2;
	var oscY = Math.random() * Math.PI*2;
	var oscZ = Math.random() * Math.PI*2;

	oscXSpeed = Math.random() * 0.003;
	oscYSpeed = Math.random() * 0.003;
	oscZSpeed = Math.random() * 0.003;

	this.update = function()
	{
		this.updatePosition();
		this.updateColor();
	}

	this.updatePosition = function()
	{
		this.mesh.rotation.x += rotSpeedX * speed;
		this.mesh.rotation.y += rotSpeedY * speed;
		// this.mesh.rotation.z += rotSpeedZ * speed;

		oscX += oscXSpeed * speed;
		oscY += oscYSpeed * speed;
		oscZ += oscZSpeed * speed;

		this.mesh.position.x = Math.cos(oscX) * 1;
		this.mesh.position.y = Math.sin(oscY) * 1;
		// this.mesh.position.z = Math.sin(oscZ) * 1;
	}

	this.updateColor = function()
	{
		this.hue += hueSpeed * speed;
		if (this.hue > 1.0) this.hue = 0.0;
		material.color.setHSL(this.hue, 0.5*saturation * this.sat, 0.3*lightness);

		this.specHue -= specHueSpeed * speed;
		if (this.specHue < 0.0) this.specHue = 1.0;
		material.specular.setHSL(this.specHue, 1.0*saturation * this.sat2 * 2, 0.5*lightness);
	}

	this.randomizeColor = function()
	{
		this.hue = Math.random();
		this.specHue = Math.random();
		this.sat = Math.random();
		this.sat2 = Math.random();

		this.updateColor();
	}
}
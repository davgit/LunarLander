if ( !window.requestAnimationFrame ) {
  window.requestAnimationFrame = ( function() {
	  return window.webkitRequestAnimationFrame ||
	  window.mozRequestAnimationFrame ||
	  window.oRequestAnimationFrame ||
	  window.msRequestAnimationFrame ||
	  function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {
		  window.setTimeout( callback, 1000 / 60 );
	  };
	})();
}

var Game = {};
Game.items = {
	lander: {},
	ground: {},
	light: {}
};
Game.keyboard = new THREEx.KeyboardState();

Game.init = function () {
	// set the scene size
	var WIDTH = window.innerWidth,
	    HEIGHT = window.innerWidth;
	// var WIDTH = 640,
	// 	HEIGHT =480;

	// set some camera attributes
	var VIEW_ANGLE = 45,
	    ASPECT = WIDTH / HEIGHT,
	    NEAR = 0.1,
	    FAR = 10000;

	this.renderer = new THREE.WebGLRenderer({
		antialias: true,
	});

	this.renderer.shadowMapEnabled = true;
	this.renderer.shadowMapSoft = true;

	this.camera = new THREE.PerspectiveCamera(  VIEW_ANGLE,
                                ASPECT,
                                NEAR,
                                FAR  );
	this.scene = new Physijs.Scene();

	this.camera.position.y = 0;
	this.camera.position.z = 300;
	// Game.camera.lookAt(new THREE.Vector3(0, 0, 0));
	this.scene.add(Game.camera);

	this.renderer.setSize(WIDTH, HEIGHT);

	document.body.appendChild(this.renderer.domElement);

	this.init_scene();
	this.animate();
};

Game.init_scene = function() {

	var lander = Game.items.lander;
	var ground = Game.items.ground;
	var light = Game.items.light;

	//Lander
	lander.material =
	  new THREE.MeshLambertMaterial(
	    {
	      color: 0xCC0000
    	});

	lander.geometry= new THREE.CubeGeometry(10, 20, 10);

	lander.rotation = 0;
	lander.elevation = 0;

	lander.mesh = new THREE.Mesh(lander.geometry, lander.material);
	lander.mesh.castShadow = true;
	// lander.mesh.receiveShadow = true;

	Game.scene.add(lander.mesh);

	//Ground
	ground.geometry = new THREE.PlaneGeometry(200, 200);

	ground.geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2));

	ground.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, -100, 0));

	ground.material = new THREE.MeshLambertMaterial(
			{
				color: 0xEEEEEE
			}
		);

	ground.mesh = new THREE.Mesh(ground.geometry, ground.material);
	// ground.mesh.castShadow = true;
	ground.mesh.receiveShadow = true;


	Game.scene.add(ground.mesh);

	// light = new THREE.PointLight(0xFFFFFF);

	// light.position.x = 10;
	// light.position.y = 50;
	// light.position.z = 130;

	light = new THREE.SpotLight( 0xFFFFFF );
	light.position.set( 0, 200, 400 );
	light.target.position.copy( this.scene.position );
	light.castShadow = true;
	light.shadowDarkness = .7;
	light.shadowCameraVisible = true;
	Game.scene.add(light);

};

Game.render = function() {
	Game.handle_keys();
	Game.renderer.render(Game.scene, Game.camera);
};

Game.handle_keys = function() {
	var lander = this.items.lander;

	if (this.keyboard.pressed("w")) {
		this.apply_thrust(lander);
	}
	if (this.keyboard.pressed("a")) {
		this.rotate_left(lander);
	}
	if (this.keyboard.pressed("d")) {
		this.rotate_right(lander);
	}
};

Game.apply_thrust = function(lander) {
	var theta = lander.mesh.rotation.z + Math.PI/2;
	lander.mesh.position.x += 1*Math.cos(theta);
	lander.mesh.position.y += 1*Math.sin(theta);
}

Game.rotate_right = function(lander) {
	lander.mesh.rotation.z -= 4*Math.PI/180.0;
}

Game.rotate_left = function(lander) {
	lander.mesh.rotation.z += 4*Math.PI/180.0;
}

Game.frameTime = 0; //ms
Game.cumFrameTime = 0; //ms
Game._lastFrameTime = Date.now(); //timestamp

Game.animate = function() {
	var time = Date.now();
	Game.frameTime = time - Game._lastFrameTime;
	Game._lastFrameTime = time;
	Game.cumulatedFrameTime += Game.frameTime;

	Game.render();

	window.requestAnimationFrame(Game.animate);
}


window.addEventListener("load", Game.init.bind(Game));
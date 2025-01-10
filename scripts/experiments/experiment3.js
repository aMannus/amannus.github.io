var container, scene, camera, renderer, controls, stats;
var clock = new THREE.Clock();

var mirrorSphere, mirrorSphereCamera;
var skyHigh;

$(function () {

	exp.init();
	exp.animate();

	$(window).on('resize', function () { exp.onWindowResize(); });
	$(window).on('orientationchange', function () { scene.onWindowResize(); });

});

var exp = {
	init: function () {
		var colors = {
			green: 0xCEFF1A,
			blue: 0x19FFE0,
			magenta: 0xFF1990
		};

		// SCENE
		scene = new THREE.Scene();

		// CAMERA
		var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
		var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 2000;
		camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
		scene.add(camera);
		camera.position.set(0, -45, 300);
		camera.lookAt(scene.position);

		// RENDERER
		if (Detector.webgl)
			renderer = new THREE.WebGLRenderer({ antialias: true });
		else
			renderer = new THREE.CanvasRenderer();
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		$('.experimentThree').append(renderer.domElement);

		// CONTROLS
		controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.userZoom = false;
		controls.userPan = false;
		controls.autoRotate = true;
		controls.noPan = true;

		// LIGHT
		var light = new THREE.PointLight(0xffffff);
		light.position.set(0, 0, 0);
		scene.add(light);

		var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		var spotLight = new THREE.SpotLight(colors.blue, 2);
		var lightHelper;

		renderer.gammaInput = true;
		renderer.gammaOutput = true;

		spotLight.position.set(0, 130, 130);
		spotLight.castShadow = false;
		spotLight.angle = Math.PI / 6;
		spotLight.penumbra = 0;
		spotLight.decay = 1;
		spotLight.distance = 300;
		spotLight.shadow.mapSize.width = 1024;
		spotLight.shadow.mapSize.height = 1024;
		spotLight.shadow.camera.near = 1;
		spotLight.shadow.camera.far = 250;

		lightHelper = new THREE.SpotLightHelper(spotLight);

		var spotLightDick = new THREE.SpotLight(colors.magenta, 2);
		var lightHelper;

		renderer.gammaInput = true;
		renderer.gammaOutput = true;

		spotLightDick.position.set(0, -130, -130);
		spotLightDick.castShadow = false;
		spotLightDick.angle = Math.PI / 6;
		spotLightDick.penumbra = 0;
		spotLightDick.decay = 1;
		spotLightDick.distance = 300;
		spotLightDick.shadow.mapSize.width = 1024;
		spotLightDick.shadow.mapSize.height = 1024;
		spotLightDick.shadow.camera.near = 1;
		spotLightDick.shadow.camera.far = 250;

		lightHelperDick = new THREE.SpotLightHelper(spotLightDick);

		// SKYBOX
		var materialArray = [];
		materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/images/experiments/posx.jpg') }));
		materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/images/experiments/negx.jpg') }));
		materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/images/experiments/posy.jpg') }));
		materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/images/experiments/negy.jpg') }));
		materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/images/experiments/posz.jpg') }));
		materialArray.push(new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/images/experiments/negz.jpg') }));
		for (var i = 0; i < 6; i++)
			materialArray[i].side = THREE.BackSide;
		var skyboxMaterial = new THREE.MeshFaceMaterial(materialArray);
		var skyboxGeom = new THREE.CubeGeometry(2000, 2000, 2000, 1, 1, 1);
		var skybox = new THREE.Mesh(skyboxGeom, skyboxMaterial);
		scene.add(skybox);

		// GLASS BALL
		var sphereGeom = new THREE.SphereGeometry(50, 64, 32);
		mirrorSphereCamera = new THREE.CubeCamera(0.1, 2000, 512);
		scene.add(mirrorSphereCamera);
		var mirrorSphereMaterial = new THREE.MeshLambertMaterial({ envMap: mirrorSphereCamera.renderTarget, color: 0xffffff, transparent: true, opacity: 0.8 });
		//var mirrorSphereMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff } );
		mirrorSphere = new THREE.Mesh(sphereGeom, mirrorSphereMaterial);
		mirrorSphere.position.set(0, 0, 0);
		mirrorSphereCamera.position = mirrorSphere.position;
		scene.add(mirrorSphere);

		// SMALL GLASS BALL				
		skyHigh = new THREE.Object3D();
		skyHigh.rotation.x = 45
		scene.add(skyHigh);
		var sphereAround = new THREE.Object3D();
		sphereAround.rotation.z = 0;
		skyHigh.add(sphereAround);

		var anSphereGeom = new THREE.SphereGeometry(12, 16, 8);
		anMirrorSphereCamera = new THREE.CubeCamera(0.1, 2000, 512);
		scene.add(anMirrorSphereCamera);
		var anMirrorSphereMaterial = new THREE.MeshLambertMaterial({ envMap: anMirrorSphereCamera.renderTarget, color: 0xffffff, transparent: true, opacity: 0.8 });
		anMirrorSphere = new THREE.Mesh(anSphereGeom, anMirrorSphereMaterial);
		anMirrorSphere.position.y = 80;
		anMirrorSphereCamera.position = anMirrorSphere.position;
		sphereAround.add(anMirrorSphere);

		window.addEventListener('mouseup', function (event) {
			controls.autoRotate = true;
		})
		window.addEventListener('mousedown', function (event) {
			controls.autoRotate = false;
		})

		scene.add(spotLight);
		scene.add(spotLightDick);
		//scene.add( lightHelper );
		//scene.add( lightHelperDick );
	},

	onWindowResize: function () {
		var width = $(window).innerWidth();
		var height = $(window).innerHeight();

		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize(width, height);
	},

	render: function () {
		mirrorSphere.visible = false;
		mirrorSphereCamera.updateCubeMap(renderer, scene);
		mirrorSphere.visible = true;

		anMirrorSphere.visible = false;
		anMirrorSphereCamera.updateCubeMap(renderer, scene);
		anMirrorSphere.visible = true;

		skyHigh.rotation.z += 0.025;

		renderer.render(scene, camera);
	},

	animate: function () {
		exp.render();
		exp.update();
		requestAnimationFrame(exp.animate);
	},

	update: function () {
		controls.update();
	}
}
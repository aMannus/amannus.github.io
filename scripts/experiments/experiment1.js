var cameraObj, sceneObj, renderer, composer;
var geometry, light;
var glitchPass;
var mousePositionX = 0;
var mousePositionY = 0;
var maxMouseRotationX = 0.008;
var maxMouseRotationY = 0.008;
var mouseRotationX = maxMouseRotationX;
var mouseRotationY = maxMouseRotationY;

$(function () {

    if (webglSupport) {
        scene.init();
        scene.animate();

        $(window).on('resize', function () { scene.onWindowResize(); });
        $(window).on('orientationchange', function () { scene.onWindowResize(); });
    }

    document.onmousemove = scene.handleMouseMove;

});

var scene = {
    init: function () {
        scene.build();
	    scene.animate();
    },

    handleMouseMove: function (event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                (doc && doc.scrollTop || body && body.scrollTop || 0) -
                (doc && doc.clientTop || body && body.clientTop || 0);
        }

        var width = $(window).innerWidth();
        var height = $(window).innerHeight()

        mousePositionX = event.pageX - (width / 2);
        mouseRotationX = mousePositionX / (width / 2) * maxMouseRotationX;
        mousePositionY = event.pageY - (height / 2);
        mouseRotationY = mousePositionY / (height / 2) * maxMouseRotationY;
    },

	build: function () {
	    renderer = new THREE.WebGLRenderer();
	    renderer.setPixelRatio(window.devicePixelRatio);
	    renderer.setSize(window.innerWidth, window.innerHeight);
	    document.body.appendChild(renderer.domElement);

	    cameraObj = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
	    cameraObj.position.z = 150;

	    sceneObj = new THREE.Scene();
	    sceneObj.fog = new THREE.Fog(0x19FFE0, 1, 400);
	    sceneObj.background = new THREE.Color(0xffffff);

	    var material = new THREE.LineBasicMaterial({
	        color: 0xFF1990
	    });

	    var geometry = new THREE.Geometry();
	    for (var i = 0; i < 150; i++) {
	        var max = 651;
	        var maxI = 325;
	        geometry.vertices.push(
                new THREE.Vector3(Math.floor(Math.random() * max) - maxI, Math.floor(Math.random() * max) - maxI, Math.floor(Math.random() * max) - maxI),
                new THREE.Vector3(Math.floor(Math.random() * max) - maxI, Math.floor(Math.random() * max) - maxI, Math.floor(Math.random() * max) - maxI),
                new THREE.Vector3(Math.floor(Math.random() * max) - maxI, Math.floor(Math.random() * max) - maxI, Math.floor(Math.random() * max) - maxI)
            );
	    }

	    var line = new THREE.Line(geometry, material);
	    sceneObj.add(line);

	    var material = new THREE.LineBasicMaterial({
	    	color: 0xFF1990
	    });

	    var geometry = new THREE.Geometry();
	    for (var i = 0; i < 70; i++) {
			var distance = 70
	    	var theta = THREE.Math.randFloatSpread(360);
	    	var phi = THREE.Math.randFloatSpread(360);

	    	tarx = distance * Math.sin(theta) * Math.cos(phi);
	    	tary = distance * Math.sin(theta) * Math.sin(phi);
	    	tarz = distance * Math.cos(theta);

	    	geometry.vertices.push(
                new THREE.Vector3(distance * Math.sin(theta) * Math.cos(phi), distance * Math.sin(theta) * Math.sin(phi), distance * Math.cos(theta)),
                new THREE.Vector3(distance * Math.sin(theta) * Math.cos(phi), distance * Math.sin(theta) * Math.sin(phi), distance * Math.cos(theta)),
                new THREE.Vector3(distance * Math.sin(theta) * Math.cos(phi), distance * Math.sin(theta) * Math.sin(phi), distance * Math.cos(theta))
            );
	    }

	    var line = new THREE.Line(geometry, material);
	    sceneObj.add(line);

	    light = new THREE.DirectionalLight(0xffffff);
	    light.position.set(1, 1, 1);
	    sceneObj.add(light);

	    composer = new THREE.EffectComposer(renderer);
	    composer.addPass(new THREE.RenderPass(sceneObj, cameraObj));

	    glitchPass = new THREE.GlitchPass(12);
	    glitchPass.renderToScreen = true;
	    composer.addPass(glitchPass);
	},

	onWindowResize: function () {
		var width = $(window).innerWidth();
		var height = $(window).innerHeight();

		cameraObj.aspect = width / height;
		cameraObj.updateProjectionMatrix();

		renderer.setSize(width, height);
		composer.setSize(width, height);
	},

	animate: function () {
		requestAnimationFrame(scene.animate);

		sceneObj.children[0].rotation.x += 0.002;
		sceneObj.children[0].rotation.y += 0.004;

		sceneObj.children[1].rotation.x += mouseRotationY;
		sceneObj.children[1].rotation.y += mouseRotationX;

	    composer.render();
	}
}
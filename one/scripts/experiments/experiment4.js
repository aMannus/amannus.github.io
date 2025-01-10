var camera;
var sceneObj;
var statsObj;
var controls;
var renderer;
var renderer2;

$(function () {

    //stats.init();
    
    scene.init();
	
    $(window).on('resize', function () { scene.onWindowResize(); });
    $(window).on('orientationchange', function () { scene.onWindowResize(); });
    
    document.onmousemove = scene.handleMouseMove;
	
	document.addEventListener('touchmove', function(event) {
		scene.handleMouseMove(event.targetTouches[0]);
	    event.preventDefault();
	}, false);
	
	
});

var scene = {
    init: function () {
		
        sceneObj = new THREE.Scene();
		sceneObj.background = new THREE.Color(0xffffff);
		
		sceneObj2 = new THREE.Scene();
		sceneObj2.background = new THREE.Color(0xffffff);
		
		var minZoom = 1;
        var maxZoom = 10000;
        var fov = 50;
        var width = $(window).innerWidth();
        var height = $(window).innerHeight();
		
		var pointLight = new THREE.PointLight(0xFFFFFF, 2, 0);
		pointLight.position.set(20,20,20);
		pointLight.castShadow = true;
		sceneObj.add(pointLight);
		
		var pointLight2 = new THREE.PointLight(0xFFFFFF, 2, 0); 
		pointLight2.position.set(-20,20,20);
		pointLight2.castShadow = true;
		sceneObj.add(pointLight2);
		
		var light = new THREE.AmbientLight(0xffffff, 1.5);
		sceneObj.add(light);
		
        // Make camera and move further back
        camera = new THREE.PerspectiveCamera(fov, width / height, minZoom, maxZoom);
        camera.position.z = 35;
        camera.position.y = 8;
        camera.position.x = 35;
		camera.lookAt(new THREE.Vector3(0,0,0));
		
        // Init renderer and insert into DOM
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        $('.experimentFour').append(renderer.domElement);
		
		renderer2 = new THREE.WebGLRenderer({ antialias: true });
        renderer2.setSize(width, height);
        $('.experimentFourTwo .holder').append(renderer2.domElement);
		
        // Init controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
		controls.userZoom = false;
		controls.userPan = false;
		controls.noPan = true;
		
        object.add("models/scene_land.json", false, sceneObj, false);
        object.add("models/scene_water.json", true, sceneObj, false);
        
        object.add("models/scene_land.json", false, sceneObj2, true);
        object.add("models/scene_water.json", true, sceneObj2, true);
		
        scene.animate();
        
        var centerX = width / 2 - 75;
        var centerY = height / 2 - 75;
        
        var centerNegX = -Math.abs(centerX);
        var centerNegY = -Math.abs(centerY);
        
        $('.experimentFourTwo .holder').css('transform', 'translate('+centerX+'px, '+centerY+'px)');
        $('.experimentFourTwo .holder canvas').css('transform', 'translate('+centerNegX+'px, '+centerNegY+'px)');
    },

    animate: function (now) {

        //statsObj.begin();

        renderer.render(sceneObj, camera);
        renderer2.render(sceneObj2, camera);
		
		controls.update();
		
        //statsObj.end();

        requestAnimationFrame(scene.animate);
    },

    onWindowResize: function () {
        var width = $(window).innerWidth();
        var height = $(window).innerHeight();

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
        renderer2.setSize(width, height);
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

        mousePositionX = event.pageX - 75;
        mousePositionY = event.pageY - 75;
        if(mousePositionX > 0) {
        	var mouseNegPositionX = -Math.abs(mousePositionX);
        } else {
        	var mouseNegPositionX = Math.abs(mousePositionX);
        }
        
        if(mousePositionY > 0) {
        	var mouseNegPositionY = -Math.abs(mousePositionY);
        } else {
        	var mouseNegPositionY = Math.abs(mousePositionY);
        }
        
        $('.experimentFourTwo .holder').css('transform', 'translate('+mousePositionX+'px, '+mousePositionY+'px)');
        $('.experimentFourTwo .holder canvas').css('transform', 'translate('+mouseNegPositionX+'px, '+mouseNegPositionY+'px)');
    }
}

var object = {
    add: function (url, animate, scene, wireframe) {
    	
        var JSONLoader = new THREE.JSONLoader();
		JSONLoader.load(url, function (geometry, materials) {
			
			var object = new THREE.Mesh( geometry, materials );
		
			object.castShadow = true;
			object.receiveShadow = true;
			
			if(wireframe == true) {
				$.each(object.material, function(index, value) {
					object.material[index].wireframe = true;
				});
			}
			
			scene.add( object );
			
		});
		
    }
}

var stats = {
    init: function () {
        statsObj = new Stats();
        statsObj.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        $('.experimentFour').append(statsObj.dom);
    }
}
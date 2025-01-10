var camera;
var sceneObj;
var statsObj;
var controls;
var renderer;

var sphere;
var originalSphere;

// Audio
var ctx;
var music;
var getSound;
var playSound;
var frequencyData;
var averageVolume = 0;
var audioPlaying = false;
var audioSupported = true;


$(function () {

    //stats.init();
    
    audioPlayer.checkAudioAPI();

    if (audioSupported) {
        scene.init();
        audioPlayer.init();
    } else {
        $('.errorNotice').show();
    }

    $(window).on('resize', function () { scene.onWindowResize(); });
    $(window).on('orientationchange', function () { scene.onWindowResize(); });

});

var scene = {
    init: function () {

        // Start variables
        sceneObj = new THREE.Scene();
        sceneObj.background = new THREE.Color(0xffffff);

        var minZoom = 1;
        var maxZoom = 30;
        var fov = 75;
        var width = $(window).innerWidth();
        var height = $(window).innerHeight();

        // Make camera and move further back
        camera = new THREE.PerspectiveCamera(fov, width / height, minZoom, maxZoom);
        camera.position.z = 5;
        camera.position.y = 3;

        // Init renderer and insert into DOM
        renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        $('.experimentTwo').append(renderer.domElement);

        // Init controls
        controls = new THREE.OrbitControls(camera);
        controls.minDistance = minZoom;
        controls.maxDistance = maxZoom;

        object.add();

        scene.animate();
    },

    animate: function (now) {

        //statsObj.begin();

        renderer.render(sceneObj, camera);

        sphere.rotation.y += 0.005;
        wireSphere.rotation.y += 0.005;

        if (audioPlaying) {
            audioPlayer.animate();
        }

        //statsObj.end();

        requestAnimationFrame(scene.animate);
    },

    onWindowResize: function () {
        var width = $(window).innerWidth();
        var height = $(window).innerHeight();

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height);
    },
}

var object = {
    add: function () {
        var geometry = new THREE.SphereGeometry(2, 30, 30);
        var originalGeometry = new THREE.SphereGeometry(2, 30, 30);
        var material = new THREE.MeshNormalMaterial();
        var wireMaterial = new THREE.MeshNormalMaterial({ wireframe: true });

        sphere = new THREE.Mesh(geometry, material);
        wireSphere = new THREE.Mesh(geometry, wireMaterial);
        originalSphere = new THREE.Mesh(originalGeometry, material);

        sceneObj.add(sphere);
        sphere.material.transparent = true;
        sphere.material.opacity = 0.3;

        sceneObj.add(wireSphere);
        wireSphere.scale.set(0.85, 0.85, 0.85);
    }
}

var audioPlayer = {
    init: function () {
        audioPlayer.load();
        audioPlayer.clicks();
    },

    checkAudioAPI: function () {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            window.audioContext = new window.AudioContext();
        } catch (e) {
            audioSupported = false;
            $('.row.top .textBlock').hide(0);
            $('.errorNotice').show();
        }
    },

    load: function () {

        ctx = new AudioContext();
        getSound = new XMLHttpRequest();
        playSound = ctx.createBufferSource();

        getSound.open("GET", "/one/images/experiments/audio.mp3", true);
        getSound.responseType = "arraybuffer";
        getSound.onload = function () {
            ctx.decodeAudioData(getSound.response, function (buffer) {
                music = buffer;

                playSound.buffer = music;
                playSound.connect(ctx.destination);
                analyser = ctx.createAnalyser();
                playSound.connect(analyser);
                playSound.loop = true;
                frequencyData = new Uint8Array(analyser.frequencyBinCount);
            });
        }
        getSound.send();
        $('.playButton').show(300);
    },

    clicks: function () {
        $('.playButton .inner').on('click', function () {
            $('.row.top .textBlock').addClass('hide');
            $(this).parent().fadeOut(300);

            playSound.start(0);
            audioPlaying = true;
        });
    },

    animate: function () {
        var array = new Uint8Array(analyser.frequencyBinCount);
        var vertexCount = sphere.geometry.vertices.length;
        analyser.getByteFrequencyData(array);

        var steps = Math.floor(array.length / vertexCount);

        var totalVolume = 0;

        for (var i = 0; i < vertexCount; i++) {
            var value = array[i * steps];

            if (value != undefined) {
                var currentVert = sphere.geometry.vertices[i];
                var targetVert = originalSphere.geometry.vertices[i];

                currentVert.x = targetVert.x + (targetVert.x * (value / 255));
                currentVert.y = targetVert.y + (targetVert.y * (value / 255));
                currentVert.z = targetVert.z + (targetVert.z * (value / 255));

                totalVolume += value;
            }
        }

        averageVolume = totalVolume / vertexCount / 255;

        wireSphere.scale.set(averageVolume / 4 + 0.85, averageVolume / 4 + 0.85, averageVolume / 4 + 0.85);
        sphere.scale.set(averageVolume / 4 + 1, averageVolume / 4 + 1, averageVolume / 4 + 1);

        sphere.geometry.verticesNeedUpdate = true;
    }
}

var stats = {
    init: function () {
        statsObj = new Stats();
        statsObj.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        $('.experimentOne').append(statsObj.dom);
    }
}
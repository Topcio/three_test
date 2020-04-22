window.onload = function () {
    var clock, mixer, camera, controls, scene, renderer, model, delta;

    var init = function () {

        if (!clock) {
            clock = new THREE.Clock();
        };

        if (mixer) {
            mixer = null;
        };

        if (renderer) {
            renderer.dispose()
        };

        if (scene) {
            scene.dispose()
        };

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(25, 500 / 500, 0.01, 10);
        camera.position.set(-10, 15, 20);

        // var size = 2.5;
        // var divisions = 15;

        // var gridHelper = new THREE.GridHelper(size, divisions);
        // scene.add(gridHelper);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(500, 500);
        renderer.shadowMap.enabled = true;



        container = document.createElement('div');
        container.classList.add(`animation`);
        document.body.append(container)
        container.appendChild(renderer.domElement);

        window.addEventListener('resize', () => {
            renderer.setSize(500, 500);
            camera.aspect = 500 / 500;
            camera.updateProjectionMatrix();
        });

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.addEventListener('change', function () {
            render;
        });

        var GLBFile = 'hero.glb';

        var loader = new THREE.GLTFLoader();
        loader.load(GLBFile, async (gltf) => {
                model = gltf.scene;
                gltf.scene.traverse(function (node) {
                    if (node.isMesh || node.isLight) node.castShadow = true;
                    if (node.isMesh || node.isLight) node.receiveShadow = true;
                });

                gltf.animations;
                gltf.castShadow = true;
                gltf.receiveShadow = true;
                gltf.scenes;
                gltf.cameras;
                gltf.asset;
                mixer = new THREE.AnimationMixer(gltf.scene);
                var action = mixer.clipAction(gltf.animations[0]);
                action.play();
                scene.add(model);
                animate();

            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('An error happened');
            });

        var light = new THREE.PointLight(0xffffff, 11, 0);
        light.position.set(0, 5, 0);
        scene.add(light);

        light.shadow.mapSize.width = 512; // default
        light.shadow.mapSize.height = 512; // default
        light.shadow.camera.near = 0.1; // default
        light.shadow.camera.far = 10 // default

        // var sphereSize = 4;
        // var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
        // scene.add( pointLightHelper );


        scene.add( new THREE.CameraHelper( light.shadow.camera ) );

        controls.enableDamping = false; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 10.5;
        controls.screenSpacePanning = false;
        controls.maxDistance = 0.25;
        controls.minDistance = 0.25;
        controls.maxPolarAngle = Math.PI / 2;
        controls.addEventListener('change', light_update);



        var mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 100, 100 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
        mesh.rotation.x = - Math.PI / 2;
        mesh.receiveShadow = true;
        mesh.castShadow = true;
        scene.add( mesh );




        function light_update() {
            light.position.copy(camera.position);
        }

        window.addEventListener('resize', onWindowResize, false);

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            delta = clock.getDelta();
            if (mixer) mixer.update(delta);
            requestAnimationFrame(animate);
            controls.update();
            render();
        }

        function render() {
            renderer.render(scene, camera);
        }

        controls.target.set(0, 0.03, 0);
        controls.update();

    };
    init();
}
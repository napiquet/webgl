import * as THREE from './shuvi/vendor/three.js-master/build/three.module.js';
import Stats from './shuvi/vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './shuvi/vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './shuvi/vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';

const Scene = {
    vars: {
        container: null,
        scene: null,
        renderer: null,
        camera: null,
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        animPurcent: 0
    },
    init: () => {
        let vars = Scene.vars;

        //préparer le container de la scene
        vars.container = document.createElement('div');
        vars.container.classList.add("fullscreen");
        document.body.appendChild(vars.container);

        //création scène
        vars.scene = new THREE.Scene();
        vars.scene.background = new THREE.Color(0xa0a0a0);

        //moteur de rendu
        vars.renderer = new THREE.WebGLRenderer({ antialias: true });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.container.appendChild(vars.renderer.domElement);
        
        //caméra
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        vars.camera.position.set(-1.5, 210, 572);

        //lumière
        let lightIntensity = 0.5;

        let light = new THREE.HemisphereLight(0xFFFFFF, 0x444444, lightIntensity);
        light.position.set(0, 700, 0);
        vars.scene.add(light);
        
        //sol
        let sol = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new
            THREE.MeshLambertMaterial({ color: new THREE.Color(0x888888) }));
        sol.rotation.x = -Math.PI / 2;
        vars.scene.add(sol);

        let planeMaterial = new THREE.ShadowMaterial();
        planeMaterial.opacity = 0.07;
        let shadowPlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000,
        2000), planeMaterial);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.receiveShadow = true;
        vars.scene.add(shadowPlane);

        //texture du sol, grid helper
        // let grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
        // grid.material.opacity = 0.2;
        // grid.material.transparent = true;
        // vars.scene.add(grid);

        //creation bulle
        let geometry = new THREE.SphereGeometry(1000, 32, 32);
        let material = new THREE.MeshPhongMaterial({color: 0xffffff});
        material.side = THREE.DoubleSide;
        let sphere = new THREE.Mesh(geometry, material);
        vars.scene.add(sphere);

        //chargement des objets
        //TODO

        //ok, suppression chargement
        document.querySelector("#loading").remove();
        

        window.addEventListener('resize', Scene.onWindowResize, false);

        window.addEventListener('mousemove', Scene.onMouseMove, false);

        //mise en place des controls et des limites
        vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
        vars.controls.minPolarAngle = Math.PI / 4;
        vars.controls.maxPolarAngle = Math.PI / 2;
        vars.controls.minAzimuthAngle = -Math.PI / 4;
        vars.controls.maxAzimuthAngle = Math.PI / 4;
        vars.controls.minDistance = 300;
        vars.controls.maxDistance = 1000;
        vars.controls.target.set(0, 100, 0);
        vars.controls.update(); 

        //ajout des stats
        vars.stats = new Stats();
        vars.container.appendChild(vars.stats.dom);

        Scene.animate();
    },
    loadFBX: (file, echelle, position, rotation, couleur, nom, callback) => {
        let loader = new FBXLoader();

        if(file === undefined){
            return;
        }

        loader.load("./shuvi/fbx/" + file, function(model){
            let mixer = new THREE.AnimationMixer( model );

            //var action = mixer.clipAction( model.animations[ 0 ] );
            //action.play();

            model.scale.set(echelle, echelle, echelle);
            model.position.set(position[0], position[1], position[2]);
            model.rotation.set(rotation[0], rotation[1], rotation[2]);

            model.traverse(node =>{
                if(node.isMesh){
                    node.castShadow = true;
                    node.receiveShadow = true;

                    //textures
                    if(nom == "plaquette"){
                        new THREE.TextureLoader().load('./shuvi/texture/marbre.jpg', (texture)=>{
                            node.material = new THREE.MeshBasicMaterial({map: texture});
                        });
                    }
                    else if(nom == "schwi" || nom == "schwi2" || nom == "schwi3"){
                        let trophymat = new THREE.MeshStandardMaterial();
                        trophymat.roughness = 0.2;
                        trophymat.metalness = 0.3;

                        node.material = trophymat;
                        node.material.skinning = true;
                    }

                    node.material.color = new THREE.Color(couleur);
                }
            });

            Scene.vars[nom] = model;

            callback();
        });
    },
    loadText: (file, echelle, position, rotation, couleur, nom, callback) => {
      let loader = new THREE.FontLoader();
      let text = "Shuvi";

      let hash = document.location.hash.substr( 1 );
      if ( hash.length !== 0 ) {
      var texthash = hash.substring();
        text = decodeURI( texthash );
      }

      loader.load(file, function(font){
        let geometry = new THREE.TextGeometry(text, {
          font: font,
          size: echelle,
          height: 0.1,
          curveSegments: 1,
          bevelThickness: 1,
          bevelSize: 1,
          bevelEnabled: false
         });
  
        geometry.computeBoundingBox();
        let offset = geometry.boundingBox.getCenter().negate();
        geometry.translate( offset.x, offset.y, offset.z );
  
        let textmat = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color: new THREE.Color(couleur)}));

        textmat.position.set(position[0], position[1], position[2]);
        textmat.rotation.set(rotation[0], rotation[1], rotation[2]);

        Scene.vars[nom] = textmat;
  
        callback();
      });
    },
    onMouseMove: () => {
        Scene.vars.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        Scene.vars.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    onWindowResize: () => {
        let vars = Scene.vars;
        vars.camera.aspect = window.innerWidth / window.innerHeight;
        vars.camera.updateProjectionMatrix();
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    customAnimation: () => {
       
    },
    animate: () => {
        Scene.render();
        requestAnimationFrame(Scene.animate);
        Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

        //intersects
        if (Scene.vars.loli != undefined){
          var intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.loli.children, true);
          
          //Following cursor
          if (intersects.length > 0) {
              Scene.vars.animSpeed = 0.05;
              Scene.customAnimation();
          } else {
              Scene.vars.animSpeed = -0.05;
              Scene.customAnimation();
          }
      }
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
        Scene.vars.stats.update();
    }
};

Scene.init();
import * as THREE from '../shuvi/vendor/three.js-master/build/three.module.js';
import Stats from '../shuvi/vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from '../shuvi/vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from '../shuvi/vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';

let lightIntensity = 0.5;

//préparations pour animations
let dir = 2;

//MUSIQUE
var listener = new THREE.AudioListener();
//création du son
var sound = new THREE.Audio(listener);


const Scene = {
    vars: {
        container: null,
        scene: null,
        renderer: null,
        camera: null,
        raycaster: new THREE.Raycaster(),
        mouse: new THREE.Vector2(),
        color: 'black',
        started: false,
        ready: false,
        score: 0,
        redSpeed: 20,
        blueSpeed: 20
    },
    init: () => {
        let vars = Scene.vars;

        //préparer le container de la scene
        vars.container = document.createElement('div');
        vars.container.classList.add("fullscreen");
        document.body.appendChild(vars.container);

        //création scène
        vars.scene = new THREE.Scene();
        vars.scene.background = new THREE.Color(0x000000);

        //moteur de rendu
        vars.renderer = new THREE.WebGLRenderer({ antialias: true });
        vars.renderer.setPixelRatio(window.devicePixelRatio);
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
        vars.container.appendChild(vars.renderer.domElement);
        
        //caméra
        vars.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
        vars.camera.position.set(-1.5, 210, 572);


        //chargement des objets
        Scene.loadFBX("beat.fbx", 0.2, [0, 50, 0], [0, 0, 0], 0xff3844, "red", () => {
            Scene.loadFBX("beat.fbx", 0.2, [0, 50, 0], [0, 0, 0], 0x5bb9e9, "blue", () => {
                Scene.loadText("../shuvi/vendor/three.js-master/examples/fonts/helvetiker_regular.typeface.json", 18, [0, 100, 0], [0, 90, 0], 0xFFFFFF, "start", "CLICK ANYWHERE TO START", () => {
                    vars.red.name = 'red';
                    vars.blue.name = 'blue';
                    vars.scene.add(vars.start);
                    
                    //lights
                    var directional = new THREE.DirectionalLight(0xffffff, 0.5);
                    directional.position.set(1000, 50, 0);
                    directional.target = vars.red;
                    vars.scene.add(directional);


                    //ombres
                    vars.renderer.shadowMap.enabled = true;
                    vars.renderer.shadowMapSoft = true;

                    directional.castShadow = true;
                    let d = 1000;
                    directional.shadow.camera.left = -d;
                    directional.shadow.camera.right = d;
                    directional.shadow.camera.top = d;
                    directional.shadow.camera.bottom = -d;
                    directional.shadow.camera.far = 2000;
                    directional.shadow.mapSize.width = 4096;
                    directional.shadow.mapSize.height = 4096;


                    //ok, suppression chargement
                    document.querySelector("#loading").remove();
                });
            });
        });

        window.addEventListener('resize', Scene.onWindowResize, false);

        window.addEventListener('mousemove', Scene.onMouseMove, false);

        window.addEventListener('mousedown', Scene.onMouseClick, false);

        //mise en place des controls et des limites
        vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
        vars.controls.minPolarAngle = Math.PI / 2;
        vars.controls.maxPolarAngle = Math.PI / 2;
        vars.controls.minAzimuthAngle = Math.PI / 2;
        vars.controls.maxAzimuthAngle = Math.PI / 2;
        vars.controls.minDistance = 800;
        vars.controls.maxDistance = 800;
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

        loader.load("../shuvi/fbx/" + file, function(model){
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
                    node.material.color = new THREE.Color(couleur);
                }
            });

            Scene.vars[nom] = model;

            callback();
        });
    },
    loadText: (file, echelle, position, rotation, couleur, nom, texte, callback) => {
      let loader = new THREE.FontLoader();
      let text = texte;

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
    onMouseClick: () => {
        if(Scene.vars.started){
            Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

            //intersects pour click

            //RED
            if (Scene.vars.red != undefined){
                let intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.red.children, true);
                
                if (intersects.length > 0) {
                    Scene.beatsaber('red');
                }
            }
            //BLUE
            if (Scene.vars.blue != undefined){
                let intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.blue.children, true);
                
                if (intersects.length > 0) {
                    Scene.beatsaber('blue');
                }
            }
        }
        else{
            Scene.songs();
        }
    },
    onWindowResize: () => {
        let vars = Scene.vars;
        vars.camera.aspect = window.innerWidth / window.innerHeight;
        vars.camera.updateProjectionMatrix();
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    beatsaber: (color) => {
        let vars = Scene.vars;

        if(vars.ready){
            Scene.vars.scene.remove(Scene.vars.scene.getObjectByName(color));
            Scene.vars.score += 1;
        }
    },
    songs: () => {
        //YEET METEOR SONG
        let vars = Scene.vars;
        
        if(!vars.started){
            vars.started = true;
            vars.scene.remove(vars.start);

            //MUSIQUE
            vars.camera.add(listener);
            //chargement
            var audioLoader = new THREE.AudioLoader();
            audioLoader.load('../sound/meteor.mp3', function(buffer){
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(0.1);
                sound.play();

                //CUBES

                //PART 1: DRUMS
                Scene.timeout('red', 2.9); Scene.timeout('blue', 3.2); Scene.timeout('red', 3.5); Scene.timeout('blue', 3.9);
                Scene.timeout('red', 4.2); Scene.timeout('blue', 4.5); Scene.timeout('red', 4.9); Scene.timeout('blue', 5.2);
                Scene.timeout('red', 5.5); Scene.timeout('blue', 5.9); Scene.timeout('red', 6.2); Scene.timeout('blue', 6.5);
                Scene.timeout('red', 6.9); Scene.timeout('blue', 7.2); Scene.timeout('red', 7.5); Scene.timeout('blue', 7.9);
                Scene.timeout('red', 8.2); Scene.timeout('blue', 8.5); Scene.timeout('red', 8.9); Scene.timeout('blue', 9.2);
                Scene.timeout('red', 9.5); Scene.timeout('blue', 9.9); Scene.timeout('red', 10.2); Scene.timeout('blue', 10.5);
                Scene.timeout('red', 10.9); Scene.timeout('blue', 11.2); Scene.timeout('red', 11.5); Scene.timeout('blue', 11.9);
                Scene.timeout('red', 12.2); Scene.timeout('blue', 12.5); Scene.timeout('red', 12.9); Scene.timeout('blue', 13.5);
                Scene.timeout('red', 13.9); Scene.timeout('blue', 14.2); Scene.timeout('red', 14.5); Scene.timeout('blue', 14.9);
                Scene.timeout('red', 15.2); Scene.timeout('blue', 15.5); Scene.timeout('red', 15.9); Scene.timeout('blue', 16.2);
                Scene.timeout('red', 16.5); Scene.timeout('blue', 16.9); Scene.timeout('red', 17.2); Scene.timeout('blue', 17.5);
                Scene.timeout('red', 17.9); Scene.timeout('blue', 18.2); Scene.timeout('red', 18.5); Scene.timeout('blue', 18.9);
                Scene.timeout('red', 19.2); Scene.timeout('blue', 19.5); Scene.timeout('red', 19.9); Scene.timeout('blue', 20.2);
                Scene.timeout('red', 20.5); Scene.timeout('blue', 20.9); Scene.timeout('red', 21.2); Scene.timeout('blue', 21.5);
                Scene.timeout('red', 21.9); Scene.timeout('blue', 22.2); Scene.timeout('red', 22.5); Scene.timeout('blue', 22.9);
                Scene.timeout('red', 23.2); Scene.timeout('blue', 23.5); Scene.timeout('red', 23.9); Scene.timeout('blue', 24.2);
                Scene.timeout('red', 24.5); Scene.timeout('blue', 24.9); Scene.timeout('red', 25.2);

                //PART 2: SINGING SOFT
                

                //END
                vars.ready = true;
            });
        }
    },
    timeout: (color, time) => {
        if(color == 'red'){
            setTimeout(function(){
                Scene.vars.red.position.y = 50;
                Scene.vars.red.position.z = 120;

                Scene.vars.scene.add(Scene.vars.red);
            }, time*1000);
        }
        else if(color == 'blue'){
            setTimeout(function(){
                Scene.vars.scene.add(Scene.vars.blue);

                Scene.vars.blue.position.y = 50;
                Scene.vars.blue.position.z = -120;
            }, time*1000);
        }
    },
    animate: () => {
        Scene.render();
        requestAnimationFrame(Scene.animate);
        Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

        if(Scene.vars.ready){
            //déplacement du cube rouge
            if(Scene.vars.scene.getObjectByName('red') != undefined && Scene.vars.scene.getObjectByName('red') != false){
                Scene.vars.red.position.x += Scene.vars.redSpeed;
            }
            else{
                Scene.vars.red.position.x = -600;
            }

            //déplacement du cube bleu
            if(Scene.vars.scene.getObjectByName('blue') != undefined && Scene.vars.scene.getObjectByName('blue') != false){
                Scene.vars.blue.position.x += Scene.vars.blueSpeed;
            }
            else{
                Scene.vars.blue.position.x = -600;
            }

            //déstructions des cubes
            if(Scene.vars.red.position.x > 450){
                Scene.vars.scene.remove(Scene.vars.red);
            }
            if(Scene.vars.blue.position.x > 450){
                Scene.vars.scene.remove(Scene.vars.blue);
            }
        }
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
        Scene.vars.stats.update();
    }
};

Scene.init();
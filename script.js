import * as THREE from './shuvi/vendor/three.js-master/build/three.module.js';
import Stats from './shuvi/vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './shuvi/vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './shuvi/vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';

let lightIntensity = 0.5;

//préparations pour animations
let dir = 1;

//lumières
var light = new THREE.HemisphereLight(0xFFFFFF, 0x444444, lightIntensity);
var directionalLeft = new THREE.DirectionalLight(0xffffff, lightIntensity);
var directionalRight = new THREE.DirectionalLight(0xffffff, lightIntensity);
var directional = new THREE.DirectionalLight(0xffffff, 0.2);
var directionalMusic = new THREE.DirectionalLight(0xffffff, 0.5);

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
        meteor: false,
        animReady: false,
        showing: false,
        showing2: false,
        jump: false
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

        //creation bulle
        let geometry = new THREE.SphereGeometry(1000, 32, 32);
        let material = new THREE.MeshPhongMaterial({color: 0xffffff});
        material.side = THREE.DoubleSide;
        let sphere = new THREE.Mesh(geometry, material);
        vars.scene.add(sphere);

        //chargement des objets
        Scene.loadFBX("schwi/schwiFix.fbx", 0.2, [0, 50, 0], [0, 0, 0], 0xFFD700, "schwi", () => {
            Scene.loadFBX("schwi/schwiFix.fbx", 0.2, [0, 50, 0], [0, 0, 0], 0xCD7F32, "schwi2", () => {
                Scene.loadFBX("schwi/schwiFix.fbx", 0.2, [0, 50, 0], [0, 0, 0], 0xC0C0C0, "schwi3", () => {
                    Scene.loadFBX("Socle_Partie1.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, "socle1", () => {
                        Scene.loadFBX("Socle_Partie2.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, "socle2", () => {
                            Scene.loadFBX("Plaquette.FBX", 10, [0, 4, 45], [0, 0, 0], 0xFFFFFF, "plaquette", () => {
                                Scene.loadFBX("Logo_Feelity.FBX", 10, [45, 22, 0], [0, 0, 0], 0xFFFFFF, "logo1", () => {
                                    Scene.loadFBX("Logo_Feelity.FBX", 10, [-45, 22, 0], [0, 0, Math.PI], 0xFFFFFF, "logo2", () => {
                                      Scene.loadText("./shuvi/vendor/three.js-master/examples/fonts/helvetiker_regular.typeface.json", 8, [0, 22, 46], [0, 0, 0], 0x000000, "text", "Shuvi", () => {
                                        // Positionnement des trophes
                                        var trophy = new THREE.Group();
                                        trophy.add(Scene.vars.socle1);
                                        trophy.add(Scene.vars.socle2);
                                        trophy.add(Scene.vars.plaquette);
                                        trophy.add(Scene.vars.logo1);
                                        trophy.add(Scene.vars.logo2);
                                        trophy.add(Scene.vars.text);
                                        var trophyLeft = trophy.clone();
                                        var trophyRight = trophy.clone();
                                        trophy.add(Scene.vars.schwi);
                                        vars.scene.add(trophy);
                                        trophy.position.z = -50;
                                        trophy.position.y = 10;
                                        Scene.vars.goldGroup = trophy;

                                        trophyLeft.add(Scene.vars.schwi2);
                                        vars.scene.add(trophyLeft);
                                        trophyLeft.position.z = 20;
                                        trophyLeft.position.x = 250;
                                        trophyLeft.position.y = 10;
                                        trophyLeft.rotation.y = -45;
                                        Scene.vars.bronzeGroup = trophyLeft;

                                        trophyRight.add(Scene.vars.schwi3);
                                        vars.scene.add(trophyRight);
                                        trophyRight.position.z = 20;
                                        trophyRight.position.x = -250;
                                        trophyRight.position.y = 10;
                                        trophyRight.rotation.y = 45;
                                        Scene.vars.silverGroup = trophyRight;

                                        //lights
                                        directionalLeft.position.set(300, 300, 500);
                                        directionalLeft.target = trophyLeft;
                                        vars.scene.add(directionalLeft);
                                        
                                        directionalRight.position.set(-300, 300, 500);
                                        directionalRight.target = trophyRight;
                                        vars.scene.add(directionalRight);

                                        directional.position.set(0, 600, 500);
                                        directional.target = trophy;
                                        vars.scene.add(directional);


                                        //ombres
                                        vars.renderer.shadowMap.enabled = true;
                                        vars.renderer.shadowMapSoft = true;

                                        directionalLeft.castShadow = true;
                                        let d = 1000;
                                        directionalLeft.shadow.camera.left = -d;
                                        directionalLeft.shadow.camera.right = d;
                                        directionalLeft.shadow.camera.top = d;
                                        directionalLeft.shadow.camera.bottom = -d;
                                        directionalLeft.shadow.camera.far = 2000;
                                        directionalLeft.shadow.mapSize.width = 4096;
                                        directionalLeft.shadow.mapSize.height = 4096;


                                        Scene.vars.animSpeed = -0.05;

                                        //ok, suppression chargement
                                        document.querySelector("#loading").remove();
                                      });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });

        window.addEventListener('resize', Scene.onWindowResize, false);

        window.addEventListener('mousemove', Scene.onMouseMove, false);

        window.addEventListener('mousedown', Scene.onMouseClick, false);

        //mise en place des controls et des limites
        vars.controls = new OrbitControls(vars.camera, vars.renderer.domElement);
        vars.controls.minPolarAngle = Math.PI / 4;
        vars.controls.maxPolarAngle = Math.PI / 2;
        vars.controls.minAzimuthAngle = -Math.PI / 4;
        vars.controls.maxAzimuthAngle = Math.PI / 4;
        vars.controls.minDistance = 300;
        vars.controls.maxDistance = 850;
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
        Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

        //intersects pour click
        if (Scene.vars.goldGroup != undefined){
          let intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.goldGroup.children, true);
          
          if (intersects.length > 0) {
            if(Scene.vars.meteor){
                Scene.vars.meteor = false;
            }
            else{
                Scene.vars.meteor = true;
            }
            Scene.songs("meteor");
          }
        }
        if (Scene.vars.silverGroup != undefined){
            let intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.silverGroup.children, true);
            
            if (intersects.length > 0) {
              if(Scene.vars.jump){
                  Scene.vars.jump = false;
              }
              else{
                  Scene.vars.jump = true;
              }
              Scene.songs("jumpforjoy");
            }
          }
    },
    onWindowResize: () => {
        let vars = Scene.vars;
        vars.camera.aspect = window.innerWidth / window.innerHeight;
        vars.camera.updateProjectionMatrix();
        vars.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    songs: (song) => {
        //YEET METEOR SONG
        if(Scene.vars.meteor || Scene.vars.jump){
            let vars = Scene.vars;

            //suppression lumières
            vars.scene.remove(light);
            vars.scene.remove(directionalLeft);
            vars.scene.remove(directional);
            vars.scene.remove(directionalRight);

            //MUSIQUE
            vars.camera.add(listener);
            //chargement
            var audioLoader = new THREE.AudioLoader();
            audioLoader.load('sound/' + song + '.mp3', function(buffer){
                sound.setBuffer(buffer);
                sound.setLoop(true);
                sound.setVolume(0.05);
                sound.play();

                //ajout lumière
                directionalMusic.position.set(0, 300, 500);
                directionalMusic.target = vars.goldGroup;
                vars.scene.add(directionalMusic);

                Scene.vars.animReady = true;

                //SONG JUMP FOR JOY: Attendre le bon moment pour faire sauter la deuxieme, puis troisième
                setTimeout(function(){
                    Scene.vars.silverReady = true;
                }, 32000);
                setTimeout(function(){
                    Scene.vars.bronzeReady = true;
                }, 47000);
            });
        }
        else{
            let vars = Scene.vars;
            Scene.vars.animReady = false;
            Scene.vars.silverReady = false;
            Scene.vars.bronzeReady = false;

            //lumières
            vars.scene.remove(directionalMusic);
            vars.scene.add(directionalLeft);
            vars.scene.add(directionalRight);
            vars.scene.add(directional);

            //son et rotations
            sound.stop();
            Scene.vars.goldGroup.rotation.x = 0;
            Scene.vars.goldGroup.position.y = 10;
            Scene.vars.silverGroup.rotation.z = 0;
            Scene.vars.silverGroup.position.y = 10;
            Scene.vars.bronzeGroup.rotation.z = 0;
            Scene.vars.bronzeGroup.position.y = 10;
        }
    },
    animate: () => {
        Scene.render();
        requestAnimationFrame(Scene.animate);
        Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

        //intersects pour déplacement souris (affichage d'un "CLICK ME!")
        if (Scene.vars.goldGroup != undefined && Scene.vars.silverGroup != undefined){
          var intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.goldGroup.children, true);
          var intersects2 = Scene.vars.raycaster.intersectObjects(Scene.vars.silverGroup.children, true);

          //Gold
          if (intersects.length > 0 && !Scene.vars.showing && !Scene.vars.meteor && !Scene.vars.jump) {
            Scene.vars.showing = true;
            Scene.loadText("./shuvi/vendor/three.js-master/examples/fonts/helvetiker_regular.typeface.json", 12, [0, 100, 25], [0, 0, 0], 0xFFFFFF, "click", "CLICK ME!", () => {
                Scene.vars.scene.add(Scene.vars.click);
            });
          }
          else if(intersects.length <= 0 && Scene.vars.showing){
            Scene.vars.scene.remove(Scene.vars.click);
            Scene.vars.showing = false;
          }

          //Silver
          if (intersects2.length > 0 && !Scene.vars.showing2 && !Scene.vars.jump && !Scene.vars.meteor) {
            Scene.vars.showing2 = true;
            Scene.loadText("./shuvi/vendor/three.js-master/examples/fonts/helvetiker_regular.typeface.json", 12, [-200, 100, 50], [0, 45, 0], 0xFFFFFF, "click2", "CLICK ME!", () => {
                Scene.vars.scene.add(Scene.vars.click2);
            });
          }
          else if(intersects2.length <= 0 && Scene.vars.showing2){
            Scene.vars.scene.remove(Scene.vars.click2);
            Scene.vars.showing2 = false;
          }
        }

        //animation de spin pour METEOR
        if(Scene.vars.animReady && Scene.vars.meteor){
            Scene.vars.goldGroup.rotation.x += 1;
            Scene.vars.silverGroup.rotation.z -= 1;
            Scene.vars.bronzeGroup.rotation.z += 1;
        }

        //animation jump pour JUMP FOR JOY
        if(Scene.vars.animReady && Scene.vars.jump){
            if(Scene.vars.goldGroup.position.y >= 30){
                dir = -1;
            }
            else if(Scene.vars.goldGroup.position.y <= 10){
                dir = 1;
            }

            Scene.vars.goldGroup.position.y += dir;

            //sauts en synchro avec la musique (voir methode songs)
            if(Scene.vars.silverReady != undefined && Scene.vars.silverReady){
                Scene.vars.silverGroup.position.y += dir;
            }
            if(Scene.vars.bronzeReady != undefined && Scene.vars.bronzeReady){
                Scene.vars.bronzeGroup.position.y += dir;
            }
        }
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
        Scene.vars.stats.update();
    }
};

Scene.init();
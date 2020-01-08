import * as THREE from './vendor/three.js-master/build/three.module.js';
import Stats from './vendor/three.js-master/examples/jsm/libs/stats.module.js';
import { OrbitControls } from './vendor/three.js-master/examples/jsm/controls/OrbitControls.js';
import { FBXLoader } from './vendor/three.js-master/examples/jsm/loaders/FBXLoader.js';

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
        Scene.loadFBX("schwi/schwiFix.fbx", 0.2, [0, 50, 0], [0, 0, 0], 0xFFD700, "schwi", () => {
            Scene.loadFBX("schwi/schwiFix.fbx", 0.2, [0, 50, 0], [0, 0, 0], 0xCD7F32, "schwi2", () => {
                Scene.loadFBX("schwi/schwiFix.fbx", 0.2, [0, 50, 0], [0, 0, 0], 0xC0C0C0, "schwi3", () => {
                    Scene.loadFBX("Socle_Partie1.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, "socle1", () => {
                        Scene.loadFBX("Socle_Partie2.FBX", 10, [0, 0, 0], [0, 0, 0], 0x1A1A1A, "socle2", () => {
                            Scene.loadFBX("Plaquette.FBX", 10, [0, 4, 45], [0, 0, 0], 0xFFFFFF, "plaquette", () => {
                                Scene.loadFBX("Logo_Feelity.FBX", 10, [45, 22, 0], [0, 0, 0], 0xFFFFFF, "logo1", () => {
                                    Scene.loadFBX("Logo_Feelity.FBX", 10, [-45, 22, 0], [0, 0, Math.PI], 0xFFFFFF, "logo2", () => {
                                      Scene.loadText("./vendor/three.js-master/examples/fonts/helvetiker_regular.typeface.json", 8, [0, 22, 46], [0, 0, 0], 0x000000, "text", () => {
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
                                        Scene.vars.silverGroup = trophyLeft;

                                        trophyRight.add(Scene.vars.schwi3);
                                        vars.scene.add(trophyRight);
                                        trophyRight.position.z = 20;
                                        trophyRight.position.x = -250;
                                        trophyRight.position.y = 10;
                                        trophyRight.rotation.y = 45;
                                        Scene.vars.bronzeGroup = trophyRight;

                                        //lights
                                        let directionalLeft = new THREE.DirectionalLight(0xffffff, lightIntensity);
                                        directionalLeft.position.set(300, 300, 500);
                                        directionalLeft.target = trophyLeft;
                                        //let helper = new THREE.DirectionalLightHelper(directionalLeft, 5); 
                                        //vars.scene.add(helper);
                                        vars.scene.add(directionalLeft);
                                        
                                        let directionalRight = new THREE.DirectionalLight(0xffffff, lightIntensity);
                                        directionalRight.position.set(-300, 300, 500);
                                        directionalRight.target = trophyRight;
                                        //let helper = new THREE.DirectionalLightHelper(directionalRight, 5); 
                                        //vars.scene.add(helper);
                                        vars.scene.add(directionalRight);

                                        let directional = new THREE.DirectionalLight(0xffffff, 0.2);
                                        directional.position.set(0, 600, 500);
                                        directional.target = trophy;
                                        //let helper = new THREE.DirectionalLightHelper(directional, 5); 
                                        //vars.scene.add(helper);
                                        vars.scene.add(directional);


                                        //ombres
                                        vars.renderer.shadowMap.enabled = true;
                                        vars.renderer.shadowMapSoft = true;

                                        //directional.castShadow = true;
                                        directionalLeft.castShadow = true;
                                        //directionalRight.castShadow = true;
                                        let d = 1000;
                                        // directional.shadow.camera.left = -d;
                                        // directional.shadow.camera.right = d;
                                        // directional.shadow.camera.top = d;
                                        // directional.shadow.camera.bottom = -d;
                                        // directional.shadow.camera.far = 2000;
                                        // directional.shadow.mapSize.width = 4096;
                                        // directional.shadow.mapSize.height = 4096;
                                        directionalLeft.shadow.camera.left = -d;
                                        directionalLeft.shadow.camera.right = d;
                                        directionalLeft.shadow.camera.top = d;
                                        directionalLeft.shadow.camera.bottom = -d;
                                        directionalLeft.shadow.camera.far = 2000;
                                        directionalLeft.shadow.mapSize.width = 4096;
                                        directionalLeft.shadow.mapSize.height = 4096;
                                        // directionalRight.shadow.camera.left = -d;
                                        // directionalRight.shadow.camera.right = d;
                                        // directionalRight.shadow.camera.top = d;
                                        // directionalRight.shadow.camera.bottom = -d;
                                        // directionalRight.shadow.camera.far = 2000;
                                        // directionalRight.shadow.mapSize.width = 4096;
                                        // directionalRight.shadow.mapSize.height = 4096;


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

        loader.load("./fbx/" + file, function(model){
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
                        new THREE.TextureLoader().load('./texture/marbre.jpg', (texture)=>{
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
        Scene.vars.animPurcent = Scene.vars.animPurcent + Scene.vars.animSpeed;

        if(Scene.vars.animPurcent < 0){
          Scene.vars.animPurcent = 0;
        }
        if(Scene.vars.animPurcent > 1){
          Scene.vars.animPurcent = 1;
        }

        if(Scene.vars.animPurcent <= 0.33){
          Scene.vars.plaquette.position.z = 45 + (25 * 3 * Scene.vars.animPurcent);
          Scene.vars.text.position.z = 50 + (40 * 3 * Scene.vars.animPurcent);
        }

        if(Scene.vars.animPurcent >= 0.20 && Scene.vars.animPurcent <= 0.75){
          let percent = (Scene.vars.animPurcent - 0.2) / 0.55;

          Scene.vars.socle1.position.x = 20 * percent;
          Scene.vars.socle2.position.x = - (20 * percent);
          Scene.vars.logo1.position.x = 45 + (45 * percent);
          Scene.vars.logo2.position.x = - (45 + (45 * percent));
        }
        else if(Scene.vars.animPurcent < 0.20){
          Scene.vars.socle1.position.x = 0;
          Scene.vars.socle2.position.x = 0;
          Scene.vars.logo1.position.x = 45;
          Scene.vars.logo2.position.x = -45;
        }

        if(Scene.vars.animPurcent >= 0.40){
          Scene.vars.schwi.position.y = 35 + (15 * 3 * Scene.vars.animPurcent);
        }
        else if(Scene.vars.animPurcent < 0.7){
          Scene.vars.schwi.position.y = 50;
        }
    },
    animate: () => {
        Scene.render();
        requestAnimationFrame(Scene.animate);
        Scene.vars.raycaster.setFromCamera(Scene.vars.mouse, Scene.vars.camera);

        //intersects
        if (Scene.vars.goldGroup != undefined){
          var intersects = Scene.vars.raycaster.intersectObjects(Scene.vars.goldGroup.children, true);
          //var intersects2 = Scene.vars.raycaster.intersectObjects(Scene.vars.silverGroup.children, true);
          //var intersects3 = Scene.vars.raycaster.intersectObjects(Scene.vars.bronzeGroup.children, true);
          
          //Gold
          if (intersects.length > 0) {
              Scene.vars.animSpeed = 0.05;
              Scene.customAnimation();
          } else {
              Scene.vars.animSpeed = -0.05;
              Scene.customAnimation();
          }

          //Silver
          // if (intersects2.length > 0) {
          //     Scene.vars.animSpeed = 0.05;
          // } else {
          //     Scene.vars.animSpeed = -0.05;
          // }

          //Bronze
          // if (intersects3.length > 0) {
          //     Scene.vars.animSpeed = 0.05;
          // } else {
          //     Scene.vars.animSpeed = -0.05;
          // }
      }
    },
    render: () => {
        Scene.vars.renderer.render(Scene.vars.scene, Scene.vars.camera);
        Scene.vars.stats.update();
    }
};

Scene.init();
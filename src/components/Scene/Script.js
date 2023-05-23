import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water";
import { Sky } from "three/examples/jsm/objects/Sky";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

let currentRef = null;
let camera, scene, renderer;
let controls, water, sun;

export const initScene = (mountRef, dayMode = true) => {
  currentRef = mountRef.current;

  // scene, Renderer, Camera
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  currentRef.appendChild(renderer.domElement);

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    55,
    currentRef.clientWidth / currentRef.clientHeight,
    1,
    20000
  );
  camera.position.set(30, 30, 100);
  
  // Sun, Water and Sky
  sun = new THREE.Vector3();

  // water color first: 001e0f
  // water color second: 00031E

  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "./img/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x1d334a,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  const sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);
  const skyUniforms = sky.material.uniforms;
  skyUniforms["turbidity"].value = dayMode ? 3.5 : 10;
  skyUniforms["rayleigh"].value = dayMode ? 0.991 : 3;
  skyUniforms["mieCoefficient"].value = dayMode ? 0.025 : 0.005;
  skyUniforms["mieDirectionalG"].value = dayMode ? 0.999 : 0.7;

  let elevationParam = dayMode ? 40 : 2;

  const parameters = {
    elevation: elevationParam,
    azimuth: 180,
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  let renderTarget;

  const updateSun = () => {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);
    sun.setFromSphericalCoords(1, phi, theta);
    sky.material.uniforms["sunPosition"].value.copy(sun);
    water.material.uniforms["sunDirection"].value.copy(sun).normalize();
    if (renderTarget !== undefined) renderTarget.dispose();
    renderTarget = pmremGenerator.fromScene(sky);
    scene.environment = renderTarget.texture;
  };
  updateSun();

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.495;

  // Load Models 3D
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("./draco/");

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  gltfLoader.load("./model/grand_piano.glb", (gltf) => {
    gltf.scene.position.set(5, -1, 5);
    gltf.scene.rotation.y = Math.PI * 0.25;
    scene.add(gltf.scene);
  });
  gltfLoader.load("./model/pink_tree.glb", (gltf) => {
    gltf.scene.scale.set(12, 12, 12);
    gltf.scene.position.set(-35, -1, -35);
    scene.add(gltf.scene);
  });

  /*const onWindowResize = () => {
    camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
  };*/

  window.addEventListener("resize", onWindowResize);

  const animate = () => {
    requestAnimationFrame(animate);
    render();
  };

  const render = () => {
    water.material.uniforms["time"].value += 1.0 / 60.0;
    renderer.render(scene, camera);
  };

  // Call the animate function to start rendering the scene
  animate();
};

const onWindowResize = () => {
  camera.aspect = currentRef.clientWidth / currentRef.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
};

/*export const mountScene = (mountRef) => {
  currentRef = mountRef.current;
  currentRef.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize);
  onWindowResize();
  animate();
};

const animate = () => {
  requestAnimationFrame(animate);
  render();
};

const render = () => {
  water.material.uniforms["time"].value += 1.0 / 60.0;
  renderer.render(scene, camera);
};*/

export const cleanUpScene = () => {
  window.removeEventListener("resize", onWindowResize);
  currentRef.removeChild(renderer.domElement);
  renderer.dispose();
  scene.dispose();
};

/*
const objParamsBasic = {
  turbidity: 10,
  rayleigh: 2,
  mieCoefficient: 0.005,
  mieDirectionalG: 0.8,
  elevation: 2,
  azimuth: 180,
  exposure: 0.5,
}
*/

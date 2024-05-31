import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import * as dat from "dat.gui";
import stars from "../img/stars.jpg";
import nebula from "../img/nebula.jpg";
const renderer = new THREE.WebGLRenderer();

// set shadowMap to true to enable shadow
renderer.shadowMap.enabled = true;

renderer.setSize(window.innerWidth, window.innerHeight);
// set background color
document.body.appendChild(renderer.domElement);
// renderer.setClearColor(0xfffae);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// changes camera position
// camera.position.z = 5;
// camera.position.y = 2;

// do that in one line
camera.position.set(-10, 30, 30);
orbit.update();

// creating a box
// first phase :  creating Skelton of box (any element)
const boxGeometry = new THREE.BoxGeometry();
// Second phase : mesh basic material
// some of mesh material  : meshBasicMaterial, meshStandardMaterial, mashLambertMaterial
// mashBasicMaterial require no light to show up
const boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// third phase : fusion of geometry in material the result of this combination is a mesh
// a mesh in three world is an object it can me cube or circle or any character created using a 3D software
const box = new THREE.Mesh(boxGeometry, boxMaterial);

// adding mash to scene
scene.add(box);

// creating plane
const planeGeometry = new THREE.PlaneGeometry(30, 30);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
scene.add(plane);

// rotating plane
plane.rotation.x = -0.5 * Math.PI;
// define who will receive shadow
// define who will receive shadow
plane.receiveShadow = true;

// creating sphere
const sphereGeometry = new THREE.SphereGeometry(4, 50, 50);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
  wireframe: false,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// changing the position of mesh
// sphere.position.x = -10;
sphere.position.set(-10, 10, 0);

// define who will cast shadow
sphere.castShadow = true;

// adding ambient light to scene
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// // adds  directional light // //
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// scene.add(directionalLight);
// directionalLight.position.set(-30, 50, 0);

// // as direction light will cast shadow with light so set it true as well
// directionalLight.castShadow = true;
// directionalLight.shadow.camera.bottom = -12;

// const dLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(dLightHelper);

// const dLightShadowHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(dLightShadowHelper);

// adds spotLight
const spotLight = new THREE.SpotLight(0xffffff, 100000);
spotLight.position.set(-100, 100, 0);
scene.add(spotLight);
spotLight.angle = 0.02;
spotLight.castShadow = true;

const sLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(sLightHelper);

// first method to add fog
// scene.fog = new THREE.Fog(0xffffff, 0, 200);

// second method to add fog
// scene.fog = new THREE.FogExp2(0xffffff, 0.01);

// add image to scene as background
// to add image to the scene we have to load it first
//2d
const textureLoader = new THREE.TextureLoader();
// scene.background = textureLoader.load(stars);

// 3d for cube texture to render image should be in 1:1 ratio
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = new THREE.CubeTextureLoader().load([
  nebula,
  nebula,
  nebula,
  nebula,
  nebula,
  nebula,
]);

// add box element with image
const box2Geometry = new THREE.BoxGeometry(4, 4, 4);
const box2Material = new THREE.MeshBasicMaterial({
  map: textureLoader.load(nebula),
});
const box2 = new THREE.Mesh(box2Geometry, box2Material);
scene.add(box2);
box2.position.set(0, 15, 10);
// add extra functionality to animation
const gui = new dat.GUI();
const options = {
  sphereColor: "#ffea00",
  wireframe: false,
  speed: 0.01,
  angle: 0.2,
  penumbra: 0,
  intensity: 50000,
};
// for changing color of sphere
gui.addColor(options, "sphereColor").onChange((e) => {
  // e will give color value
  sphere.material.color.set(e);
});

// check box to change wire frame
gui.add(options, "wireframe").onChange((e) => {
  // e will give true or false
  sphere.material.wireframe = e;
});
// change speed of bouncing sphere
gui.add(options, "speed", 0, 0.1);

gui.add(options, "angle", 0, 1);

gui.add(options, "penumbra", 0, 1);

gui.add(options, "intensity", 0, 100000);

let step = 0;
// let speed = 0.01;

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);

// animation for box rotation
function animate(time) {
  box.rotation.x = time / 1000;
  box.rotation.y = time / 1000;

  spotLight.angle = options.angle;
  spotLight.penumbra = options.penumbra;
  spotLight.intensity = options.intensity;
  sLightHelper.update();

  step += options.speed;
  sphere.position.y = 10 * Math.abs(Math.sin(step));

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

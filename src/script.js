import './style.css';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import * as dat from 'lil-gui';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

// Debug
// const gui = new dat.GUI();

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/matcap.png');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
// const axesHelper = new THREE.AxesHelper(2)
// scene.add(axesHelper)

// Material
const material = new THREE.MeshMatcapMaterial();
material.side = THREE.DoubleSide;
material.matcap = matcapTexture;

// gtlf Loader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Geometry
let model;

gltfLoader.load(
  '/models/deprojet.glb',
  (gltf) => {
    model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.rotation.x = Math.random() * Math.PI * 2;
    model.rotation.y = Math.random() * Math.PI * 2;
    // gui.add(model.rotation, 'x').min(0).max(Math.PI * 2).step(0.01)
    model.traverse((o) => {
      if (o.isMesh) o.material = material;
    });
    scene.add(model);
  }
)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0,0,20);
scene.add(camera);

// Controls
const controls = new TrackballControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

function tick() {
  // const elapsedTime = clock.getElapsedTime();
  // Rotate model
  if (model) model.rotation.y += 0.003;
  if (model) model.rotation.x += 0.003;
  // Update controls
  controls.update();
  // Render
  renderer.render(scene, camera);
  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
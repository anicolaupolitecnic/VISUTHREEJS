import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ===== Escena =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);

// ===== Cámara fija =====
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 5);

// ===== Renderizador =====
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== Luces =====
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 5);
dirLight.position.set(3, 10, 10);
scene.add(dirLight);

// ===== Controles de ratón =====
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = true;      // rotación con ratón
controls.enableZoom = true;       // opcional: desactivar zoom
controls.enablePan = true;        // opcional: desactivar pan
controls.target.set(0, 1, 0);      // centro de rotación
controls.update();

// ===== Cargar modelo GLB =====
let model; // referencia al modelo
const loader = new GLTFLoader();
loader.load(
  new URL("/public/mario.glb", import.meta.url).href,
  (gltf) => {
    model = gltf.scene;
    scene.add(model);
  },
  undefined,
  (error) => {
    console.error("Error al cargar el modelo:", error);
  }
);

// ===== Controles de teclado para rotar el modelo =====
const rotationStep = 0.05;

window.addEventListener("keydown", (event) => {
  if (!model) return;

  switch(event.key) {
    case "ArrowUp":
      model.rotation.x -= rotationStep;
      break;
    case "ArrowDown":
      model.rotation.x += rotationStep;
      break;
    case "ArrowLeft":
      model.rotation.y -= rotationStep;
      break;
    case "ArrowRight":
      model.rotation.y += rotationStep;
      break;
  }
});

// ===== Animación =====
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// ===== Ajuste al redimensionar =====
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

// Scene setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 0.8);
const pointLight = new THREE.PointLight(0xffffff, 0.6);
pointLight.position.set(0, 2, 2);
scene.add(ambient, pointLight);

// Materials
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xd9d9d9 });
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xc2a475 });
const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const frameMaterial = new THREE.MeshStandardMaterial({
  color: 0x888888,
  metalness: 0.2,
  roughness: 0.5,
});

// Corridor segments
const segmentLength = 10;
const numSegments = 10;

for (let i = 0; i < numSegments; i++) {
  const z = -i * segmentLength;

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(4, segmentLength),
    floorMaterial
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, z);
  scene.add(floor);

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(4, segmentLength),
    ceilingMaterial
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 3, z);
  scene.add(ceiling);

  // Left Wall
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(3, segmentLength),
    wallMaterial
  );
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-2, 1.5, z);
  scene.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(3, segmentLength),
    wallMaterial
  );
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(2, 1.5, z);
  scene.add(rightWall);

  // Door Frame
  const frameThickness = 0.1;
  const frameWidth = 4.2;
  const frameHeight = 3.2;
  const frameDepth = 0.2;

  const frame = new THREE.Group();

  const top = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
    frameMaterial
  );
  top.position.set(0, frameHeight / 2, 0);
  frame.add(top);

  const bottom = new THREE.Mesh(
    new THREE.BoxGeometry(frameWidth, frameThickness, frameDepth),
    frameMaterial
  );
  bottom.position.set(0, -frameHeight / 2, 0);
  frame.add(bottom);

  const left = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
    frameMaterial
  );
  left.position.set(-frameWidth / 2, 0, 0);
  frame.add(left);

  const right = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, frameHeight, frameDepth),
    frameMaterial
  );
  right.position.set(frameWidth / 2, 0, 0);
  frame.add(right);

  frame.position.set(0, 1.5, z - segmentLength / 2);
  scene.add(frame);
}

// Movement controls
const keys = { w: false, s: false };
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "w") keys.w = true;
  if (e.key.toLowerCase() === "s") keys.s = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() === "w") keys.w = false;
  if (e.key.toLowerCase() === "s") keys.s = false;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // Move camera
  if (keys.w) camera.position.z -= 0.1; // forward
  if (keys.s) camera.position.z += 0.1; // backward

  renderer.render(scene, camera);
}
animate();

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

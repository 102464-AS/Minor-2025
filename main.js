import * as THREE from "https://unpkg.com/three@0.161.0/build/three.module.js";

// Scen setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.6, 5);

//  setup renderer
const textureLoader = new THREE.TextureLoader();
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

//  add ligthing
const ambient = new THREE.AmbientLight(0xffffff, 0.8);
const pointLight = new THREE.PointLight(0xffffff, 0.6);
pointLight.position.set(0, 2, 2);
scene.add(ambient, pointLight);

// setup metarilas
const wallTexture = textureLoader.load('images/wall.jpg');
const wallMaterial = new THREE.MeshStandardMaterial({ map: wallTexture });

const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xc2a475 });

const ceilingTexture = textureLoader.load('images/ceiling2.jpeg');
const ceilingMaterial = new THREE.MeshStandardMaterial({ map: ceilingTexture });

const doorTexture = textureLoader.load('images/door.png');
const doorMaterial = new THREE.MeshStandardMaterial({ map: doorTexture, side: THREE.DoubleSide });


const segmentLength = 10;
const numSegments = 10;

const door_urls = [
  "./rooms/red_room/red_room.html", 
  "./rooms/wobly_room/wobly_room.html",
  "./rooms/disco_room/index.html",
];

function openDoor(door) {
  const url = door_urls[Math.floor(Math.random() * door_urls.length)];
  console.log("Opening door to: " + url);

  window.location.href = url;
}

// setyp raycasting
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

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

  // Left Wall
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(segmentLength, 3),
    wallMaterial
  );
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.set(-2, 1.5, z);
  scene.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(segmentLength, 3),
    wallMaterial
  );
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.set(2, 1.5, z);
  scene.add(rightWall);

  // left side doors
  if (i % 1 === 0) {
    const doorGeometry = new THREE.PlaneGeometry(2, 3); 
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.name = "door_" + i + "_left";

    door.position.set(-1.9, 1.5, z + segmentLength / 2);
    door.rotation.y = Math.PI / 2;
 
    function onMouseClick(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
    
      const intersects = raycaster.intersectObjects(scene.children);
    
      if (intersects.length > 0 && intersects[0].object === door) {
        openDoor(door)
      }
    }

    window.addEventListener('click', onMouseClick);
    scene.add(door);
  }

  //  right side doors
  if (i % 1 === 0) {
    const doorGeometry = new THREE.PlaneGeometry(2, 3); 
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(1.9, 1.5, z + segmentLength / 2);
    door.rotation.y = -Math.PI / 2;


    function onMouseClick(event) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
    
      // If door was clicked
      if (intersects.length > 0 && intersects[0].object === door) {
        openDoor(door)
      }
    }

    window.addEventListener('click', onMouseClick);

    scene.add(door);
  }

  // Ceiling
  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(4, segmentLength),
    ceilingMaterial
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.set(0, 3, z);
  scene.add(ceiling);
}



// front wall
const frontWall = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 3),
  wallMaterial
);
frontWall.position.set(0, 1.5, segmentLength / 2);
scene.add(frontWall);

// backwall
const backWall = new THREE.Mesh(
  new THREE.PlaneGeometry(4, 3),
  wallMaterial
);
backWall.position.set(0, 1.5, -numSegments * segmentLength + segmentLength / 2);
scene.add(backWall);

// Movement
const keys = { w: false, s: false };

document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "w") keys.w = true;
  if (e.key.toLowerCase() === "s") keys.s = true;

  // collision back wall
  if (camera.position.z <= -numSegments * segmentLength + segmentLength -2.9 && keys.w) {
    keys.w = false;
  }

  // collision front wall
  if (camera.position.z >= segmentLength / 2 -2.9 && keys.s) {
    keys.s = false;
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() === "w") keys.w = false;
  if (e.key.toLowerCase() === "s") keys.s = false;
});


function animate() {
  requestAnimationFrame(animate);

  if (keys.w) camera.position.z -= 0.1; 
  if (keys.s) camera.position.z += 0.1; 

  renderer.render(scene, camera);
}

animate();
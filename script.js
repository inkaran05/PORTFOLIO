// PixiJS setup for fabric displacement effect

const app = new PIXI.Application({
  view: document.getElementById('fabric-canvas'),
  resizeTo: window,
  transparent: true,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  antialias: true,
});

let displacementSprite, displacementFilter;
let mousePosition = { x: 0, y: 0 };
let targetPosition = { x: 0, y: 0 };
let velocity = { x: 0, y: 0 };
const easing = 0.1;

// Load fabric texture and displacement map
PIXI.Loader.shared
  .add('fabricTexture', 'https://i.ibb.co/2kR7Zqv/silk-texture.jpg')
  .add('displacementMap', 'https://i.ibb.co/7vY9Q7Z/displacement-map.png')
  .load(setup);

function setup(loader, resources) {
  // Create fabric sprite
  const fabric = new PIXI.Sprite(resources.fabricTexture.texture);
  fabric.width = app.screen.width;
  fabric.height = app.screen.height;
  fabric.tileScale.set(1);
  fabric.tilePosition.set(0);
  app.stage.addChild(fabric);

  // Create displacement sprite
  displacementSprite = new PIXI.Sprite(resources.displacementMap.texture);
  displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
  displacementSprite.scale.set(2);
  app.stage.addChild(displacementSprite);

  // Create displacement filter
  displacementFilter = new PIXI.filters.DisplacementFilter(displacementSprite);
  displacementFilter.scale.x = 30;
  displacementFilter.scale.y = 30;

  fabric.filters = [displacementFilter];

  // Animate displacement sprite
  app.ticker.add(() => {
    // Smoothly move displacement sprite towards target position
    velocity.x += (targetPosition.x - displacementSprite.x) * easing;
    velocity.y += (targetPosition.y - displacementSprite.y) * easing;

    velocity.x *= 0.8;
    velocity.y *= 0.8;

    displacementSprite.x += velocity.x;
    displacementSprite.y += velocity.y;

    // Slowly move the displacement map to create waving effect
    displacementSprite.x += 1;
    displacementSprite.y += 1;
  });

  // Mouse move event to update target position
  window.addEventListener('mousemove', (event) => {
    targetPosition.x = event.clientX;
    targetPosition.y = event.clientY;
  });

  // Resize handler
  window.addEventListener('resize', () => {
    fabric.width = app.screen.width;
    fabric.height = app.screen.height;
  });
}

// Three.js setup for interactive 3D scene

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';

const canvas = document.getElementById('three-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0); // transparent background

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Create objects array
const objects = [];

// Create a ground plane for raycasting
const groundGeometry = new THREE.PlaneGeometry(100, 100);
const groundMaterial = new THREE.MeshBasicMaterial({ visible: false });
const groundPlane = new THREE.Mesh(groundGeometry, groundMaterial);
groundPlane.rotation.x = - Math.PI / 2;
scene.add(groundPlane);

// Create some cubes
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x64ffda });

for (let i = 0; i < 20; i++) {
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.position.set(
    (Math.random() - 0.5) * 20,
    0.5,
    (Math.random() - 0.5) * 20
  );
  scene.add(cube);
  objects.push(cube);
}

camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Repel effect variables
const repelRadius = 3;
const repelPower = 0.8;
const mouseVector = new THREE.Vector2();
const mouseWorld = new THREE.Vector3();
const raycaster = new THREE.Raycaster();

const repelPointGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const repelPointMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });
const repelPoint = new THREE.Mesh(repelPointGeometry, repelPointMaterial);
scene.add(repelPoint);

// Mouse move handler
window.addEventListener('mousemove', (event) => {
  mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouseVector.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouseVector, camera);
  const intersects = raycaster.intersectObject(groundPlane);
  if (intersects.length > 0) {
    mouseWorld.copy(intersects[0].point);
    repelPoint.position.copy(mouseWorld);
  }
});

function repelObjects() {
  objects.forEach(object => {
    const distance = object.position.distanceTo(repelPoint.position);
    if (distance < repelRadius) {
      const repelDirection = new THREE.Vector3()
        .copy(object.position)
        .sub(repelPoint.position)
        .normalize()
        .multiplyScalar((repelRadius - distance) * repelPower * 0.1);
      object.position.add(repelDirection);

      // Optional: Scale effect
      const scale = 1 + (1 - distance / repelRadius) * 0.5;
      object.scale.set(scale, scale, scale);
    } else {
      // Reset scale if outside repel radius
      object.scale.set(1, 1, 1);
    }
  });
}

function animate() {
  requestAnimationFrame(animate);

  repelObjects();

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

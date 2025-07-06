document.addEventListener('DOMContentLoaded', () => {
  // Apply ripple effect only on buttons and links
  document.body.addEventListener('click', function (e) {
    const target = e.target;
    if (target.tagName !== 'BUTTON' && target.tagName !== 'A') {
      return;
    }

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    target.appendChild(ripple);

    const maxDim = Math.max(target.clientWidth, target.clientHeight);
    ripple.style.width = ripple.style.height = maxDim + 'px';

    const rect = target.getBoundingClientRect();
    ripple.style.left = e.clientX - rect.left - maxDim / 2 + 'px';
    ripple.style.top = e.clientY - rect.top - maxDim / 2 + 'px';

    ripple.classList.add('ripple-animate');

    ripple.addEventListener('animationend', () => {
      ripple.remove();
    });
  });
});

const style = document.createElement('style');
style.textContent = `
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0.4;
    transform: scale(0);
    pointer-events: none;
    animation: ripple-effect 0.6s linear;
    z-index: 1000;
  }

  .ripple-animate {
    animation-name: ripple-effect;
  }

  @keyframes ripple-effect {
    to {
      opacity: 0;
      transform: scale(4);
    }
  }
`;

// Repel effect implementation for Three.js scene
const repelRadius = 100;
const repelPower = 0.8;
const mouseVector = new THREE.Vector2();
const mouseWorld = new THREE.Vector3();

function setupRepelEffect(scene, camera, groundPlane) {
  // Create attractor point
  const repelGeometry = new THREE.SphereGeometry(5, 16, 16);
  const repelMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xff0000,
    visible: false // Set to true for debugging
  });
  const repelPoint = new THREE.Mesh(repelGeometry, repelMaterial);
  scene.add(repelPoint);

  // Mouse movement handler
  document.addEventListener('mousemove', (event) => {
    mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouseVector.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    // Update world position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseVector, camera);
    const intersects = raycaster.intersectObjects([groundPlane]); // Use existing plane
    if (intersects.length > 0) {
      mouseWorld.copy(intersects[0].point);
      repelPoint.position.copy(mouseWorld);
    }
  });

  return repelPoint;
}

function repelObjects(objects, repelPoint) {
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
      const scale = 1 + (1 - distance/repelRadius) * 0.5;
      object.scale.set(scale, scale, scale);
    }
  });
}

document.head.appendChild(style);

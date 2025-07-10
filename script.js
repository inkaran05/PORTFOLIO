document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll for navigation links
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Animate skill progress bars when in viewport
  const skillBars = document.querySelectorAll('.progress');
  const animateSkills = () => {
    skillBars.forEach(bar => {
      const rect = bar.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        bar.style.width = bar.getAttribute('style').match(/width: (\d+)%/)[1] + '%';
      } else {
        bar.style.width = '0';
      }
    });
  };
  window.addEventListener('scroll', animateSkills);
  animateSkills();

  // Contact form validation and submission using EmailJS
  const form = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    if (!name || !email || !message) {
      formStatus.textContent = 'Please fill in all fields.';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formStatus.textContent = 'Please enter a valid email address.';
      return;
    }

    formStatus.textContent = 'Sending...';

    // Initialize EmailJS with your User ID
    emailjs.init('YOUR_API_KEY');

    // Send email using EmailJS (replace with your Service ID and Template ID)
    emailjs.send('service_e705xsm', 'template_ps6u5ie', {
      from_name: name,
      from_email: email,
      message: message,
    }).then(() => {
      formStatus.textContent = 'Message sent successfully!';
      form.reset();
    }, (error) => {
      formStatus.textContent = 'Failed to send message. Please try again later.';
      console.error('EmailJS error:', error);
    });
  });

// Lazy loading images (if any)
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('loading');
        obs.unobserve(img);
      }
    });
  });
  lazyImages.forEach(img => observer.observe(img));
} else {
  // Fallback: load all images immediately
  lazyImages.forEach(img => {
    img.src = img.dataset.src;
    img.removeAttribute('loading');
  });
}

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Cloud Architecture",
    date: "2024-01-15",
    summary: "An introduction to cloud architecture principles and best practices.",
    url: "https://example.com/blog/cloud-architecture"
  },
  {
    id: 2,
    title: "Building Responsive Web Apps",
    date: "2024-02-10",
    summary: "Tips and techniques for creating responsive and user-friendly web applications.",
    url: "https://example.com/blog/responsive-web-apps"
  },
  {
    id: 3,
    title: "DevOps Essentials for Beginners",
    date: "2024-03-05",
    summary: "A beginner's guide to understanding and implementing DevOps workflows.",
    url: "https://example.com/blog/devops-essentials"
  }
];

// Function to render blog posts
function renderBlogPosts() {
  const blogContainer = document.getElementById('blog-posts');
  if (!blogContainer) return;

  blogPosts.forEach(post => {
    const postElement = document.createElement('article');
    postElement.classList.add('blog-post');

    postElement.innerHTML = `
      <h3><a href="${post.url}" target="_blank" rel="noopener noreferrer">${post.title}</a></h3>
      <p class="blog-date">${new Date(post.date).toLocaleDateString()}</p>
      <p class="blog-summary">${post.summary}</p>
    `;

    blogContainer.appendChild(postElement);
  });
}

// Render blog posts on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  renderBlogPosts();
});
});

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

// Cursor trail movement
const cursorTrail = document.querySelector('.cursor-trail');
const circles = cursorTrail ? cursorTrail.querySelectorAll('.circle') : [];
const circlePositions = Array.from(circles).map(() => ({ x: 0, y: 0 }));
const mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animateCursorTrail() {
  let x = mouse.x;
  let y = mouse.y;

  circles.forEach((circle, index) => {
    const nextPos = circlePositions[index];
    nextPos.x += (x - nextPos.x) * 0.3;
    nextPos.y += (y - nextPos.y) * 0.3;

    circle.style.transform = `translate(${nextPos.x}px, ${nextPos.y}px)`;

    x = nextPos.x;
    y = nextPos.y;
  });

  requestAnimationFrame(animateCursorTrail);
}

if (circles.length > 0) {
  animateCursorTrail();
}

// Typing effect for hero subtitle
const typingText = document.getElementById('typing-text');
const textToType = 'Future Cloud Architect | Web & System Design Enthusiast';
let charIndex = 0;

function type() {
  if (charIndex < textToType.length) {
    typingText.textContent += textToType.charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  }
}

if (typingText) {
  type();
}

// Modal functionality
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalExtra = document.getElementById('modal-extra');
const openModalButtons = document.querySelectorAll('.open-modal-btn');
const closeModalButton = document.querySelector('.close-modal');

const projectDetails = {
  'iit-madras': {
    title: 'IIT Madras Homepage Clone',
    description: 'A responsive clone of the IIT Madras homepage built using HTML/CSS. Focused on layout fidelity and responsive behavior.',
    extra: '<p>Technologies used: HTML, CSS, Responsive Design</p>'
  },
  'rti-ethanol-ev': {
    title: 'RTI Ethanol EV Transparency',
    description: 'A transparency dashboard for ethanol and electric vehicle data, built with React and integrated APIs.',
    extra: '<p>Technologies used: React, REST APIs, Data Visualization</p>'
  }
};

openModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const projectKey = button.getAttribute('data-project');
    const details = projectDetails[projectKey];
    if (details) {
      modalTitle.textContent = details.title;
      modalDescription.textContent = details.description;
      modalExtra.innerHTML = details.extra;
      modal.style.display = 'block';
    }
  });
});

closeModalButton.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

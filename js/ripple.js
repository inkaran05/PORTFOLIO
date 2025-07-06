const canvas = document.getElementById('rippleCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let ripples = [];

document.addEventListener('mousemove', e => {
  ripples.push({ x: e.clientX, y: e.clientY, radius: 0 });
});

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = ripples.length - 1; i >= 0; i--) {
    let r = ripples[i];
    r.radius += 3;
    const alpha = Math.max(1 - r.radius / 300, 0);
    if (alpha <= 0) ripples.splice(i, 1);
    else {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.2})`;
      ctx.lineWidth = 20;
      ctx.stroke();
    }
  }
  requestAnimationFrame(animate);
}
animate();

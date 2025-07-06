document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);

    const maxDim = Math.max(this.clientWidth, this.clientHeight);
    ripple.style.width = ripple.style.height = maxDim + 'px';

    const rect = this.getBoundingClientRect();
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
document.head.appendChild(style);

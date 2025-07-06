// Popup modal open/close script
document.addEventListener('DOMContentLoaded', () => {
  const popupOpenBtn = document.getElementById('popupOpenBtn');
  const popupCloseBtn = document.getElementById('popupCloseBtn');
  const popupModal = document.getElementById('popupModal');

  popupOpenBtn.addEventListener('click', () => {
    popupModal.setAttribute('aria-hidden', 'false');
  });

  popupCloseBtn.addEventListener('click', () => {
    popupModal.setAttribute('aria-hidden', 'true');
  });

  // Close popup when clicking outside content
  popupModal.addEventListener('click', (e) => {
    if (e.target === popupModal) {
      popupModal.setAttribute('aria-hidden', 'true');
    }
  });

  // Close popup on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popupModal.getAttribute('aria-hidden') === 'false') {
      popupModal.setAttribute('aria-hidden', 'true');
    }
  });
});

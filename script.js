
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  loader.style.display = 'none';
});

const hoverSound = document.getElementById('hoverSound');
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('mouseenter', () => {
    hoverSound.currentTime = 0;
    hoverSound.play();
  });
});

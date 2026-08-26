const menuBtn = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const tracks = [
  {title:"Pagar", file:"audio/Pagar.mp3", number:"01"},
  {title:"Maratabat", file:"audio/Maratabat.mp3", number:"02"},
  {title:"Alam Na 'Yan, Bro", file:"audio/Alam Na 'Yan, Bro.mp3", number:"03"}
];
const audio = document.getElementById('audio');
const player = document.getElementById('musicPlayer');
const playBtn = document.getElementById('playBtn');
const seekBar = document.getElementById('seekBar');
const volumeBar = document.getElementById('volumeBar');
const playerTitle = document.getElementById('playerTitle');
const playerNumber = document.getElementById('playerNumber');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
let currentTrack = 0;

audio.volume = .8;

function fmt(sec){
  if (!Number.isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}
function loadTrack(i, autoplay=false){
  currentTrack = (i + tracks.length) % tracks.length;
  const t = tracks[currentTrack];
  audio.src = t.file;
  playerTitle.textContent = t.title;
  playerNumber.textContent = t.number;
  player.classList.add('show');
  document.querySelectorAll('.release-card').forEach((card, idx) => {
    card.classList.toggle('playing', idx === currentTrack);
    const btn = card.querySelector('.listen-btn');
    const icon = card.querySelector('.play-cover b');
    if (btn) btn.textContent = idx === currentTrack && !audio.paused ? 'PAUSE ↗' : 'PLAY ↗';
    if (icon) icon.textContent = idx === currentTrack && !audio.paused ? 'Ⅱ' : '▶';
  });
  if (autoplay) audio.play();
}
function syncButtons(){
  playBtn.textContent = audio.paused ? '▶' : 'Ⅱ';
  document.querySelectorAll('.release-card').forEach((card, idx) => {
    const btn = card.querySelector('.listen-btn');
    const icon = card.querySelector('.play-cover b');
    const active = idx === currentTrack && !audio.paused;
    card.classList.toggle('playing', active);
    if(btn) btn.textContent = active ? 'PAUSE ↗' : 'PLAY ↗';
    if(icon) icon.textContent = active ? 'Ⅱ' : '▶';
  });
}
document.querySelectorAll('.release-card').forEach((card, idx) => {
  const activate = () => {
    if (idx === currentTrack && !audio.paused) audio.pause();
    else if (idx === currentTrack) audio.play();
    else loadTrack(idx, true);
    player.classList.add('show');
  };
  card.addEventListener('click', activate);
});
playBtn.addEventListener('click', () => {
  if (!audio.src) loadTrack(0, true);
  else audio.paused ? audio.play() : audio.pause();
});
document.getElementById('prevBtn').addEventListener('click', () => loadTrack(currentTrack - 1, true));
document.getElementById('nextBtn').addEventListener('click', () => loadTrack(currentTrack + 1, true));
document.getElementById('playerClose').addEventListener('click', () => player.classList.remove('show'));
volumeBar.addEventListener('input', e => audio.volume = e.target.value);
seekBar.addEventListener('input', e => {
  if (audio.duration) audio.currentTime = (e.target.value / 100) * audio.duration;
});
audio.addEventListener('loadedmetadata', () => {
  totalTime.textContent = fmt(audio.duration);
  document.querySelectorAll('.release-card')[currentTrack].querySelector('.duration').textContent = fmt(audio.duration);
});
audio.addEventListener('timeupdate', () => {
  currentTime.textContent = fmt(audio.currentTime);
  if (audio.duration) seekBar.value = (audio.currentTime / audio.duration) * 100;
});
audio.addEventListener('play', syncButtons);
audio.addEventListener('pause', syncButtons);
audio.addEventListener('ended', () => loadTrack(currentTrack + 1, true));

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('formStatus').textContent =
    'Thanks — your message is ready to be connected to your email service.';
});

// --- Techy animated network background ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let nodes = [];
let edges = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initNetwork();
});

// Generate nodes and edges
function initNetwork() {
  nodes = [];
  edges = [];
  const numNodes = Math.floor(window.innerWidth / 40);
  for (let i = 0; i < numNodes; i++) {
    nodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: 2 + Math.random() * 2
    });
  }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      if (Math.random() < 0.08) {
        edges.push([i, j]);
      }
    }
  }
}
initNetwork();

function animateNetwork() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw edges
  edges.forEach(([i, j]) => {
    const a = nodes[i], b = nodes[j];
    const dist = Math.hypot(a.x - b.x, a.y - b.y);
    if (dist < 220) {
      const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
      grad.addColorStop(0, "#3f51b5");
      grad.addColorStop(1, "#f50057");
      ctx.strokeStyle = grad;
      ctx.globalAlpha = 0.18 + 0.22 * (1 - dist / 220);
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }
  });

  // Draw nodes
  nodes.forEach(node => {
    const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r + 3);
    grad.addColorStop(0, "#f50057");
    grad.addColorStop(1, "#3f51b5");
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.r, 0, 2 * Math.PI);
    ctx.fillStyle = grad;
    ctx.shadowColor = "#3f51b5";
    ctx.shadowBlur = 7;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // Animate nodes
  nodes.forEach(node => {
    node.x += node.vx;
    node.y += node.vy;
    if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
    if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
  });

  ctx.globalAlpha = 1;
  requestAnimationFrame(animateNetwork);
}
animateNetwork();

// --- Navigation and reveal animations ---
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});
const reveals = document.querySelectorAll('.reveal');
window.addEventListener('scroll', () => {
  reveals.forEach(section => {
    const windowHeight = window.innerHeight;
    const revealTop = section.getBoundingClientRect().top;
    if (revealTop < windowHeight - 100) {
      section.classList.add('active');
    }
  });
});
window.dispatchEvent(new Event('scroll'));




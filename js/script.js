/* ─── NAVBAR SCROLL EFFECT ─── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ─── MOBILE NAV TOGGLE ─── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ─── COUNTDOWN TIMER ─── */
(function initCountdown() {
  const target = new Date('2026-06-11T09:00:00');
  function update() {
    const now  = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById('cd-days').textContent = 'LIVE';
      document.getElementById('cd-hrs').textContent  = '🎯';
      document.getElementById('cd-min').textContent  = '🎯';
      document.getElementById('cd-sec').textContent  = '🎯';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    document.getElementById('cd-days').textContent = String(d);
    document.getElementById('cd-hrs').textContent  = String(h).padStart(2,'0');
    document.getElementById('cd-min').textContent  = String(m).padStart(2,'0');
    document.getElementById('cd-sec').textContent  = String(s).padStart(2,'0');
  }
  update();
  setInterval(update, 1000);
})();

/* ─── ANIMATED COUNTERS ─── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const startTime = performance.now();
  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => counterObserver.observe(el));

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.brief-card, .stage-card, .staff-list li, .schedule-table tbody tr, .sponsor-card, .dir-block'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ─── FLOATING PARTICLES ─── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['var(--gold)', 'var(--crimson-lt)', '#ffffff'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'hero-particle';
    const size = Math.random() * 2.5 + 1;
    p.style.cssText = [
      `left: ${Math.random() * 100}%`,
      `top: ${Math.random() * 100 + 20}%`,
      `width: ${size}px`,
      `height: ${size}px`,
      `background: ${colors[Math.floor(Math.random() * colors.length)]}`,
      `animation-duration: ${Math.random() * 12 + 8}s`,
      `animation-delay: ${Math.random() * 8}s`,
    ].join(';');
    container.appendChild(p);
  }
})();

/* ─── SPONSOR RANDOMIZATION ─── */
(function renderSponsors() {

  const goldSponsors = [
    { img: 'img/gold/anderson-logo.png',            name: 'Anderson Manufacturing' },
    { img: 'img/gold/c-more-logo.png',              name: 'C-More Systems'         },
    { img: 'img/gold/holosun-logo.png',             name: 'Holosun'                },
    { img: 'img/gold/lok-grips.png',                name: 'LOK Grips'              },
    { img: 'img/gold/outdoor-dynamics-logo.png',    name: 'Outdoor Dynamics'       },
    { img: 'img/gold/pov-nutrition-logo.png.jpg',   name: 'POV Nutrition'          },
    { img: 'img/gold/shooters-connection-logo.png', name: "Shooter's Connection"   },
    { img: 'img/gold/Springer Precision.jpg',       name: 'Springer Precision'     },
    { img: 'img/gold/vortex-logo.svg',              name: 'Vortex Optics'          },
    { img: 'img/gold/zeroed-ammo.png',              name: 'Zeroed Ammo'            },
  ];

  // Add silver sponsor objects here when logos are available:
  // { img: 'img/silver/sponsor-logo.png', name: 'Sponsor Name' }
  const silverSponsors = [];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildCard(sponsor, extraClass) {
    const card = document.createElement('div');
    card.className = `sponsor-card${extraClass ? ' ' + extraClass : ''} reveal`;
    if (sponsor.img) {
      const img = document.createElement('img');
      img.src   = sponsor.img;
      img.alt   = sponsor.name;
      img.className = 'sponsor-logo-img';
      img.loading = 'lazy';
      card.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'sponsor-placeholder';
      ph.textContent = sponsor.name;
      card.appendChild(ph);
    }
    return card;
  }

  function populateGrid(sponsors, containerId, cardClass) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (sponsors.length === 0) {
      container.closest('.sponsors-tier').style.display = 'none';
      return;
    }
    shuffle(sponsors).forEach(s => {
      const card = buildCard(s, cardClass);
      container.appendChild(card);
      // Wire into scroll-reveal after DOM insertion
      card.classList.add('reveal');
      revealObserver.observe(card);
    });
  }

  populateGrid(goldSponsors,   'gold-sponsors-grid',   'gold');
  populateGrid(silverSponsors, 'silver-sponsors-grid', '');
})();

/* ─── ACTIVE NAV LINK ON SCROLL ─── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const scrollSpy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => scrollSpy.observe(s));

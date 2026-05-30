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
    { img: 'img/gold/Hunters-HD-Gold-Logo-2020_HD-GOLD-Tagline-300x128.png', name: 'Hunters HD Gold',     url: 'https://huntershdgold.com'              },
    { img: 'img/gold/pov-nutrition-logo.png',                                 name: 'POV Nutrition',       url: 'https://pov-nutrition.com'              },
    { img: 'img/gold/shooters-connection-logo.png',                           name: "Shooter's Connection", url: 'https://www.shootersconnectionstore.com' },
    { img: 'img/gold/socn-logo.svg',                                          name: 'Spec Ops Charity',    url: 'https://specopscharity.com/'            },
  ];

  const silverSponsors = [
    { img: 'img/silver/anderson-logo.png',          name: 'Anderson Manufacturing', url: 'https://www.andersonshooting.com'     },
    { img: 'img/silver/holosun-logo.png',           name: 'Holosun',                url: 'https://www.holosun.com'              },
    { img: 'img/silver/lok-grips.png',              name: 'LOK Grips',              url: 'https://www.lokgrips.com'             },
    { img: 'img/silver/outdoor-dynamics-logo.png',  name: 'Outdoor Dynamics',       url: 'https://www.outdoordynamics.net'      },
    { img: 'img/silver/range-panda-logo.jpg',       name: 'Range Panda',            url: 'https://rangepanda.com'               },
    { img: 'img/silver/springer-precision-logo.jpg',name: 'Springer Precision',     url: 'https://shop.springerprecision.com'   },
    { img: 'img/silver/vortex-logo.svg',            name: 'Vortex Optics',          url: 'https://www.vortexoptics.com'         },
  ];

  const divisionSponsors = [
    { img: 'img/Division/c-more-logo.png', name: 'C-More Systems', division: 'Carry Optics', url: 'https://www.cmore.com'      },
    { img: 'img/Division/zeroed-ammo.png', name: 'Zeroed Ammo',    division: 'Open',          url: 'https://zeroedammo.com', xl: true },
  ];

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function buildCard(sponsor, extraClass) {
    const tag = sponsor.url ? 'a' : 'div';
    const card = document.createElement(tag);
    card.className = `sponsor-card${extraClass ? ' ' + extraClass : ''} reveal`;
    // Slug class for per-sponsor CSS targeting (e.g. sponsor-zeroed-ammo)
    const slug = sponsor.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    card.classList.add('sponsor-' + slug);
    if (sponsor.url) {
      card.href   = sponsor.url;
      card.target = '_blank';
      card.rel    = 'noopener';
    }
    if (sponsor.division) {
      const badge = document.createElement('div');
      badge.className = 'sponsor-division-badge';
      badge.textContent = sponsor.division;
      card.appendChild(badge);
    }
    if (sponsor.img) {
      const img = document.createElement('img');
      img.src       = sponsor.img;
      img.alt       = sponsor.name;
      img.className = 'sponsor-logo-img' + (sponsor.xl ? ' sponsor-logo-xl' : '');
      img.loading   = 'lazy';
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
      card.classList.add('reveal');
      revealObserver.observe(card);
    });
  }

  populateGrid(goldSponsors,     'gold-sponsors-grid',     'gold');
  populateGrid(silverSponsors,   'silver-sponsors-grid',   '');
  populateGrid(divisionSponsors, 'division-sponsors-grid', 'division');
})();

/* ─── SQUAD MATRIX TABS ─── */
document.querySelectorAll('.squad-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.squad-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.squad-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById('squad-' + tab.dataset.day);
    if (panel) panel.classList.add('active');
  });
});

/* ─── PDF MODAL ─── */
(function initPdfModal() {
  const modal      = document.getElementById('pdf-modal');
  const backdrop   = modal.querySelector('.pdf-modal-backdrop');
  const closeBtn   = document.getElementById('pdf-modal-close');
  const iframe     = document.getElementById('pdf-iframe');
  const titleEl    = document.getElementById('pdf-modal-title');
  const downloadBtn = document.getElementById('pdf-download-btn');
  const newTabBtn  = document.getElementById('pdf-new-tab-btn');

  // iOS Safari and most mobile browsers can't render PDFs in iframes —
  // open in the native viewer (new tab) instead.
  // iOS, Android, and iPadOS 13+ all struggle with PDFs in iframes —
  // send them straight to the native viewer.
  const isMobilePDF = /iPad|iPhone|iPod|Android/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); // iPadOS 13+

  function openModal(src, title) {
    if (isMobilePDF) {
      window.open(src, '_blank', 'noopener');
      return;
    }
    titleEl.textContent = title;
    iframe.src = src;
    downloadBtn.href = src;
    downloadBtn.setAttribute('download', title + '.pdf');
    newTabBtn.href = src;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  // Wire up stage cards
  document.querySelectorAll('.stage-card[data-pdf]').forEach(card => {
    // Add "View Stage Diagram" hint
    const hint = document.createElement('div');
    hint.className = 'stage-pdf-hint';
    hint.textContent = '📄 View Stage Diagram';
    card.querySelector('.stage-body').appendChild(hint);

    card.addEventListener('click', () => openModal(card.dataset.pdf, card.dataset.pdfTitle));
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
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

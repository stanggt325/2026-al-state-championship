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


/* ─── AWARDS DIVISION TABS ─── */
(function initAwardsTabs() {
  const tabs   = document.querySelectorAll('.awards-tab');
  const panels = document.querySelectorAll('.awards-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.getElementById('awards-panel-' + tab.dataset.div);
      if (panel) panel.classList.add('active');
    });
  });
})();

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

/* ─── SECTION HEADER REVEAL ─── */
const headingObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const tag     = e.target.querySelector('.section-tag');
    const title   = e.target.querySelector('.section-title');
    if (tag)   setTimeout(() => tag.classList.add('visible'),   0);
    if (title) setTimeout(() => title.classList.add('visible'), 120);
    headingObserver.unobserve(e.target);
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section-tag, .section-title').forEach(el => {
  const cls = el.classList.contains('section-tag') ? 'reveal-tag' : 'reveal-heading';
  el.classList.add(cls);
});

document.querySelectorAll('.section').forEach(s => headingObserver.observe(s));

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
    { img: 'img/gold/zero_sports_header_0d4c7fea-c93a-4d90-9230-abceba74a3ca_245x@2x.webp', name: 'Zero Sports', url: 'https://zerosportsdepot.com/' },
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

/* ─── BAY MAP ─── */
(function initBayMap() {

  // Physical bay order top→bottom, with actual stage assignments.
  // B column (B5→B1) then A column (A5→A1).
  const bays = [
    { bay: 'B5', stageNum: 6,  stageName: 'Orange Beach' },
    { bay: 'B4', stageNum: 5,  stageName: 'Evergreen'    },
    { bay: 'B3', stageNum: 7,  stageName: 'Talladega'    },
    { bay: 'B2', stageNum: 4,  stageName: 'Slapout'      },
    { bay: 'B1', stageNum: 8,  stageName: 'Auburn'       },
    // ── row break (A column starts below) ──
    { bay: 'A5', stageNum: 3,  stageName: 'Tuscaloosa'   },
    { bay: 'A4', stageNum: 9,  stageName: 'Eclectic',  shooterServices: true },
    { bay: 'A3', stageNum: 2,  stageName: 'Grant'        },
    { bay: 'A2', stageNum: 10, stageName: 'Ohatchee'     },
    { bay: 'A1', stageNum: 1,  stageName: 'Opelika'      },
  ];

  // Colors matching .sq-1 through .sq-10
  const squadColors = [
    null, '#FCA5A5', '#FDBA74', '#FCD34D', '#86EFAC',
    '#67E8F9', '#93C5FD', '#C4B5FD', '#F9A8D4', '#5EEAD4', '#BEF264',
  ];

  const NS = 'http://www.w3.org/2000/svg';
  const W = 500, H = 700;
  const BAY_LEFT = 32, BAY_RIGHT = 338;
  const BAY_H = 44, SKEW = 6, ACCENT_W = 14;
  const ROAD_X = 352, ROAD_W = 38;
  const Y0 = 48, DY = 55;
  const SEP_EXTRA = 14; // extra gap between B1 and A5

  function el(tag, attrs) {
    const e = document.createElementNS(NS, tag);
    if (attrs) Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    return e;
  }
  function tx(tag, attrs, content) {
    const e = el(tag, attrs); e.textContent = content; return e;
  }

  // Pre-compute Y positions (B/A gap after index 4)
  const yPos = bays.map((_, i) => Y0 + i * DY + (i >= 5 ? SEP_EXTRA : 0));

  const svg = el('svg', {
    viewBox: `0 0 ${W} ${H}`, id: 'bay-map-svg', role: 'img',
    'aria-label': 'CMP Talladega Range 5 — Stage Bay Map',
  });

  // Background
  svg.appendChild(el('rect', { width: W, height: H, fill: '#0D0D0E' }));

  // Map title
  svg.appendChild(tx('text', {
    x: BAY_LEFT, y: 22, fill: '#3A3A4E',
    'font-size': 9, 'font-family': 'Oswald, sans-serif',
    'font-weight': 600, 'letter-spacing': 2,
  }, 'RANGE LAYOUT  ·  CMP TALLADEGA  ·  RANGE 5'));

  // Road
  const roadBottom = yPos[9] + BAY_H + SKEW + 30;
  svg.appendChild(el('rect', { x: ROAD_X, y: 28, width: ROAD_W, height: roadBottom - 28, rx: 4, fill: '#222226' }));
  svg.appendChild(el('line', {
    x1: ROAD_X + ROAD_W / 2, y1: 28, x2: ROAD_X + ROAD_W / 2, y2: roadBottom,
    stroke: '#363640', 'stroke-width': 1.5, 'stroke-dasharray': '10,9',
  }));

  // B/A row break midpoint — P icon and Parking/Bathrooms label live here
  const wcY = (yPos[4] + BAY_H + SKEW + yPos[5]) / 2;
  const pCX = ROAD_X + ROAD_W / 2;

  svg.appendChild(el('circle', { cx: pCX, cy: wcY, r: 10, fill: '#26262C', stroke: 'rgba(201,168,76,.3)', 'stroke-width': 1 }));
  svg.appendChild(tx('text', {
    x: pCX, y: wcY + 4, 'text-anchor': 'middle',
    fill: '#C9A84C', 'font-size': 10, 'font-family': 'Oswald, sans-serif', 'font-weight': 700,
  }, 'P'));

  // Parking / Bathrooms → label (right of road)
  svg.appendChild(tx('text', {
    x: ROAD_X + ROAD_W + 8, y: wcY + 4,
    fill: '#4A4A5A', 'font-size': 8, 'font-family': 'Inter, sans-serif', 'font-style': 'italic',
  }, 'Parking / Bathrooms →'));


  // Berm label
  svg.appendChild(tx('text', {
    x: 10, y: H / 2, 'text-anchor': 'middle', fill: '#252530',
    'font-size': 8, 'font-family': 'Oswald, sans-serif', 'letter-spacing': 2,
    transform: `rotate(-90,10,${H / 2})`,
  }, '← BERM'));

  // Bays
  bays.forEach((bay, i) => {
    const y = yPos[i];
    const midY = y + BAY_H / 2 + SKEW / 2;

    const g = el('g', {
      class: 'bay-group', 'data-stage': bay.stageNum, id: `bay-stage-${bay.stageNum}`,
    });

    // Connector driveway
    g.appendChild(el('rect', {
      x: BAY_RIGHT - 1, y: midY - 4, width: ROAD_X - BAY_RIGHT + 2, height: 8,
      fill: '#181818',
    }));

    // Bay body
    g.appendChild(el('polygon', {
      points: `${BAY_LEFT},${y+SKEW} ${BAY_RIGHT},${y} ${BAY_RIGHT},${y+BAY_H} ${BAY_LEFT},${y+BAY_H+SKEW}`,
      fill: '#1A1A1D', stroke: 'rgba(201,168,76,.18)', 'stroke-width': 1, class: 'bay-body',
    }));

    // Accent bar (berm/shooting end)
    g.appendChild(el('polygon', {
      points: `${BAY_LEFT},${y+SKEW} ${BAY_LEFT+ACCENT_W},${y+SKEW-1} ${BAY_LEFT+ACCENT_W},${y+BAY_H+1} ${BAY_LEFT},${y+BAY_H+SKEW}`,
      fill: '#9B1C1C', class: 'bay-accent',
    }));

    // Bay designation (B5, A4, etc.) — large, fills the left zone
    g.appendChild(tx('text', {
      x: BAY_LEFT + ACCENT_W + 8, y: midY + 1,
      'dominant-baseline': 'middle', 'text-anchor': 'start',
      fill: '#C9A84C', 'font-family': 'Oswald, sans-serif',
      'font-size': 15, 'font-weight': 700, class: 'bay-num',
    }, bay.bay));

    // Separator
    g.appendChild(el('line', {
      x1: BAY_LEFT + ACCENT_W + 36, y1: y + SKEW + 6,
      x2: BAY_LEFT + ACCENT_W + 36, y2: y + BAY_H - 6,
      stroke: 'rgba(201,168,76,.15)', 'stroke-width': 1,
    }));

    // Stage name — "Stage N · Name"
    g.appendChild(tx('text', {
      x: BAY_LEFT + ACCENT_W + 44, y: midY + 1,
      'dominant-baseline': 'middle', fill: '#B0ADA8',
      'font-family': 'Inter, sans-serif', 'font-size': 11, class: 'bay-name',
    }, `Stage ${bay.stageNum}  ·  ${bay.stageName}`));

    // "★ YOUR START" label (hidden by default)
    g.appendChild(tx('text', {
      x: BAY_RIGHT - 8, y: midY + 1,
      'dominant-baseline': 'middle', 'text-anchor': 'end',
      fill: '#F0C040', 'font-family': 'Oswald, sans-serif',
      'font-size': 10, 'font-weight': 600, 'letter-spacing': 1,
      class: 'bay-start-label', visibility: 'hidden',
    }, '★  YOUR START'));

    svg.appendChild(g);

    // Shooter Services box (A4 only, road side)
    if (bay.shooterServices) {
      const ssY = midY - 14;
      const ssG = el('g');
      const ssW = 56, ssCX = ROAD_X + ROAD_W + 6 + ssW / 2;
      ssG.appendChild(el('rect', {
        x: ROAD_X + ROAD_W + 6, y: ssY, width: ssW, height: 28,
        rx: 4, fill: '#1A1A1D', stroke: 'rgba(201,168,76,.35)', 'stroke-width': 1,
      }));
      ssG.appendChild(tx('text', {
        x: ssCX, y: ssY + 11, 'text-anchor': 'middle',
        fill: '#C9A84C', 'font-size': 7, 'font-family': 'Oswald, sans-serif', 'letter-spacing': 1,
      }, 'SHOOTER'));
      ssG.appendChild(tx('text', {
        x: ssCX, y: ssY + 22, 'text-anchor': 'middle',
        fill: '#C9A84C', 'font-size': 7, 'font-family': 'Oswald, sans-serif', 'letter-spacing': 1,
      }, 'SERVICES'));
      // connector line from road to box
      ssG.appendChild(el('line', {
        x1: ROAD_X + ROAD_W, y1: midY + 1,
        x2: ROAD_X + ROAD_W + 6, y2: midY + 1,
        stroke: 'rgba(201,168,76,.25)', 'stroke-width': 1,
      }));
      svg.appendChild(ssG);
    }
  });

  const wrap = document.getElementById('bay-map-wrap');
  if (wrap) wrap.appendChild(svg);

  // ── Highlight logic ──
  let activeStage = null;

  function highlightBay(stageNum) {
    document.querySelectorAll('.bay-group').forEach(g => {
      g.querySelector('.bay-body').setAttribute('fill', '#1A1A1D');
      g.querySelector('.bay-accent').setAttribute('fill', '#9B1C1C');
      g.querySelector('.bay-start-label').setAttribute('visibility', 'hidden');
      g.querySelector('.bay-name').setAttribute('fill', '#B0ADA8');
    });
    document.querySelectorAll('.sq.sq-selected, td.sq.sq-selected').forEach(e => e.classList.remove('sq-selected'));

    if (activeStage === stageNum) { activeStage = null; return; }
    activeStage = stageNum;

    const bay = document.getElementById(`bay-stage-${stageNum}`);
    if (!bay) return;
    bay.querySelector('.bay-body').setAttribute('fill', '#26262C');
    bay.querySelector('.bay-accent').setAttribute('fill', squadColors[stageNum] || '#C9A84C');
    bay.querySelector('.bay-start-label').setAttribute('visibility', 'visible');
    bay.querySelector('.bay-name').setAttribute('fill', '#E0DDD8');

    document.querySelectorAll(`.sq-${stageNum}`).forEach(e => e.classList.add('sq-selected'));
    wrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.querySelectorAll('.sq').forEach(sqEl => {
    const cls = [...sqEl.classList].find(c => /^sq-\d+$/.test(c));
    if (!cls) return;
    sqEl.style.cursor = 'pointer';
    sqEl.title = 'Click to highlight your starting bay';
    sqEl.addEventListener('click', () => highlightBay(parseInt(cls.replace('sq-', ''), 10)));
  });

  document.querySelectorAll('.bay-group').forEach(g => {
    g.addEventListener('click', () => highlightBay(parseInt(g.dataset.stage, 10)));
  });
})();

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

  // Wire up "View All Stages" button — same mobile logic as individual PDFs
  const allStagesBtn = document.querySelector('[data-all-stages]');
  if (allStagesBtn) {
    allStagesBtn.addEventListener('click', e => {
      e.preventDefault();
      const src = allStagesBtn.getAttribute('href');
      if (isMobilePDF) {
        window.open(src, '_blank', 'noopener');
      } else {
        window.open(src, '_blank', 'noopener');
      }
    });
  }

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

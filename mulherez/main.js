/**
 * MULHEREZ — The Clinical Atelier
 * main.js | Vanilla JS Interactions
 *
 * Modules:
 *  1. Config
 *  2. Preloader
 *  3. Custom Cursor
 *  4. Scroll Progress
 *  5. Navigation (scroll state + mobile menu)
 *  6. Smooth Scroll
 *  7. Hero Parallax
 *  8. Hero Typing Animation
 *  9. Reveal on Scroll (IntersectionObserver)
 * 10. Stats Counter Animation
 * 11. Before / After Slider
 * 12. Testimonials Carousel
 * 13. Magnetic Buttons
 * 14. Footer Newsletter
 * 15. Init & Event Listeners
 */

'use strict';

/* ═══════════════════════════════════════════════
   1. CONFIG
═══════════════════════════════════════════════ */
const CFG = {
  typing: {
    text:       'Somatic Elegance',
    typeSpeed:  75,   // ms per character
    deleteSpeed: 40,
    pauseAfter:  2800, // ms to hold before deleting
    pauseStart:  600,  // ms before typing starts
    loop:        true,
  },
  counter: {
    duration: 1800, // ms
    easing:   (t) => 1 - Math.pow(1 - t, 3), // ease-out-cubic
  },
  parallax: {
    factor: 0.38,   // 0 = no movement, 1 = full scroll
  },
  reveal: {
    threshold: 0.14,
    rootMargin: '0px 0px -60px 0px',
  },
};

/* ═══════════════════════════════════════════════
   2. PRELOADER
═══════════════════════════════════════════════ */
(function initPreloader() {
  const el = document.getElementById('preloader');
  if (!el) return;

  // Minimum display time so the animation feels intentional
  const MIN_DISPLAY = 1900; // ms
  const start = Date.now();

  function dismiss() {
    const elapsed = Date.now() - start;
    const delay   = Math.max(0, MIN_DISPLAY - elapsed);
    setTimeout(() => {
      el.classList.add('hidden');
      document.body.style.overflow = '';
    }, delay);
  }

  // Block scroll during preloader
  document.body.style.overflow = 'hidden';

  if (document.readyState === 'complete') {
    dismiss();
  } else {
    window.addEventListener('load', dismiss, { once: true });
  }
})();

/* ═══════════════════════════════════════════════
   3. CUSTOM CURSOR — disabled
═══════════════════════════════════════════════ */
// Cursor effect removed per design decision.
(function hideCursor() {
  const cursor = document.getElementById('cursor');
  if (cursor) cursor.style.display = 'none';
})();

/* ═══════════════════════════════════════════════
   4. SCROLL PROGRESS
═══════════════════════════════════════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;

  function update() {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = `${Math.min(progress, 100)}%`;
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ═══════════════════════════════════════════════
   5. NAVIGATION — scroll state + mobile menu
═══════════════════════════════════════════════ */
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobMenu');
  if (!nav) return;

  /* --- Scroll state --- */
  function updateNav() {
    const scrolled = window.scrollY > 20;
    nav.classList.toggle('scrolled', scrolled);
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* --- Mobile menu --- */
  if (burger && menu) {
    burger.addEventListener('click', () => {
      const isOpen = menu.classList.contains('open');
      menu.classList.toggle('open', !isOpen);
      burger.classList.toggle('open', !isOpen);
      burger.setAttribute('aria-expanded', String(!isOpen));
      menu.setAttribute('aria-hidden', String(isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on link click
    menu.querySelectorAll('.mob-menu__link, .btn').forEach((el) => {
      el.addEventListener('click', () => {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        burger.click();
      }
    });
  }
})();

/* ═══════════════════════════════════════════════
   6. SMOOTH SCROLL
═══════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id     = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH   = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 80;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ═══════════════════════════════════════════════
   7. HERO PARALLAX — disabled (new split layout)
═══════════════════════════════════════════════ */
// Parallax removed: hero now uses a card layout, not a full-bleed background.

/* ═══════════════════════════════════════════════
   8. HERO TYPING ANIMATION — disabled
═══════════════════════════════════════════════ */
// Typing effect removed per design decision.
// "Somatic Elegance" is now static italic text in the HTML.

/* ═══════════════════════════════════════════════
   9. REVEAL ON SCROLL
═══════════════════════════════════════════════ */
(function initReveal() {
  const elements = document.querySelectorAll('[data-reveal]');
  if (!elements.length) return;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (mq.matches) {
    // Show everything immediately if reduced motion
    elements.forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(() => {
        entry.target.classList.add('revealed');
      }, delay);
      observer.unobserve(entry.target);
    });
  }, {
    threshold:  CFG.reveal.threshold,
    rootMargin: CFG.reveal.rootMargin,
  });

  elements.forEach((el) => observer.observe(el));
})();

/* ═══════════════════════════════════════════════
   10. STATS COUNTER ANIMATION
═══════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function animateCounter(el) {
    const target   = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = CFG.counter.duration;
    const ease     = CFG.counter.easing;
    let startTime  = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = ease(progress) * target;
      el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.floor(value);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
      }
    }

    if (mq.matches) {
      el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
    } else {
      requestAnimationFrame(step);
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach((el) => observer.observe(el));
})();

/* ═══════════════════════════════════════════════
   11. BEFORE / AFTER SLIDER
═══════════════════════════════════════════════ */
(function initBASlider() {
  const slider = document.getElementById('baSlider');
  const after  = document.getElementById('baAfter');
  const handle = document.getElementById('baHandle');
  if (!slider || !after || !handle) return;

  let isDragging = false;
  let position   = 50; // percentage

  function setPosition(pct) {
    position = Math.max(2, Math.min(98, pct));
    after.style.clipPath  = `inset(0 ${100 - position}% 0 0)`;
    handle.style.left     = `${position}%`;
    slider.setAttribute('aria-valuenow', Math.round(position));
  }

  function getPositionFromEvent(e) {
    const rect  = slider.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    return ((clientX - rect.left) / rect.width) * 100;
  }

  // Mouse events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  // Also allow dragging from anywhere on the slider
  slider.addEventListener('mousedown', (e) => {
    isDragging = true;
    setPosition(getPositionFromEvent(e));
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setPosition(getPositionFromEvent(e));
  });

  document.addEventListener('mouseup', () => { isDragging = false; });

  // Touch events
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(getPositionFromEvent(e));
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setPosition(getPositionFromEvent(e));
  }, { passive: true });

  document.addEventListener('touchend', () => { isDragging = false; });

  // Keyboard accessibility
  slider.addEventListener('keydown', (e) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === 'ArrowLeft')  { setPosition(position - step); e.preventDefault(); }
    if (e.key === 'ArrowRight') { setPosition(position + step); e.preventDefault(); }
  });

  // Intro animation: sweep from 50% to 30% to 50%
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  const introObserver = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting) return;
    introObserver.disconnect();
    if (mq.matches) return;

    let start = null;
    const DURATION = 1200;

    function introAnim(ts) {
      if (!start) start = ts;
      const t   = Math.min((ts - start) / DURATION, 1);
      // Ease: go to 30%, come back to 50%
      const ease = t < 0.5
        ? 2 * t * t
        : -1 + (4 - 2 * t) * t;
      const pct = t < 0.5
        ? 50 - (ease * 20)    // 50 → 30
        : 30 + (ease * 20);    // 30 → 50
      setPosition(pct);
      if (t < 1) requestAnimationFrame(introAnim);
    }
    setTimeout(() => requestAnimationFrame(introAnim), 600);
  }, { threshold: 0.5 });

  introObserver.observe(slider);
  setPosition(50);
})();

/* ═══════════════════════════════════════════════
   12. TESTIMONIALS CAROUSEL
═══════════════════════════════════════════════ */
(function initTestimonials() {
  const carousel = document.getElementById('testiCarousel');
  const dotsWrap = document.getElementById('testiDots');
  const prevBtn  = document.getElementById('testiPrev');
  const nextBtn  = document.getElementById('testiNext');
  if (!carousel) return;

  const TESTIMONIALS = [
    {
      text:   '"Entrar no Atelier é como entrar em outro mundo. A expertise clínica é evidente, mas o nível de cuidado e a visão artística são o que realmente diferencia a Mulherez. Me sinto mais eu mesma do que em anos."',
      name:   'Alexandra V.',
      since:  'Cliente Privada desde 2021',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUItNGUOeI8LS9-DgM4of-fdGybFKwi7Dl8QBcun5Qb4e6KdBTcr6fm5EzkVKdzO0Yqovim3JqUyd4mB4Fny30_Z4zsHKV4v49LumRObhTC1RlRB-R2IicrT9jQJgNFOU27BKiOmPnp86mjsrXvH1Qpw26hFTEDjvelZy5TqsXLIUcJWRsYqyWB0PaT4g-RBgcOFHVLhGHlGUAdywyWHx_RazSlEIcYUjbRnu0ip6GNVUSN8_pahAaLmpvteOUjk0rgCaqAcz0VVs',
    },
    {
      text:   '"A equipe Mulherez tem uma rara capacidade de ouvir — de verdade — o que você deseja, ao mesmo tempo em que te guia para o que é genuinamente melhor para a sua anatomia única. Os resultados são tão naturais que nem minhas amigas mais próximas conseguiram identificar o que mudou."',
      name:   'Marina S.',
      since:  'Cliente Privada desde 2022',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUItNGUOeI8LS9-DgM4of-fdGybFKwi7Dl8QBcun5Qb4e6KdBTcr6fm5EzkVKdzO0Yqovim3JqUyd4mB4Fny30_Z4zsHKV4v49LumRObhTC1RlRB-R2IicrT9jQJgNFOU27BKiOmPnp86mjsrXvH1Qpw26hFTEDjvelZy5TqsXLIUcJWRsYqyWB0PaT4g-RBgcOFHVLhGHlGUAdywyWHx_RazSlEIcYUjbRnu0ip6GNVUSN8_pahAaLmpvteOUjk0rgCaqAcz0VVs',
    },
    {
      text:   '"Depois de anos hesitando, finalmente encontrei uma clínica onde ciência e discrição coexistem no mais alto nível. Os protocolos são baseados em evidências, o ambiente é deslumbrante e os resultados falam completamente por si mesmos."',
      name:   'Claire D.',
      since:  'Cliente Privada desde 2023',
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUItNGUOeI8LS9-DgM4of-fdGybFKwi7Dl8QBcun5Qb4e6KdBTcr6fm5EzkVKdzO0Yqovim3JqUyd4mB4Fny30_Z4zsHKV4v49LumRObhTC1RlRB-R2IicrT9jQJgNFOU27BKiOmPnp86mjsrXvH1Qpw26hFTEDjvelZy5TqsXLIUcJWRsYqyWB0PaT4g-RBgcOFHVLhGHlGUAdywyWHx_RazSlEIcYUjbRnu0ip6GNVUSN8_pahAaLmpvteOUjk0rgCaqAcz0VVs',
    },
  ];

  let current = 0;
  let autoTimer = null;

  /* Build items */
  function buildItem(data, index) {
    const div = document.createElement('div');
    div.className = 'testi-item' + (index === 0 ? ' active' : '');
    div.setAttribute('role', 'tabpanel');
    div.setAttribute('id', `testi-panel-${index}`);
    div.innerHTML = `
      <p class="testi-text">${data.text}</p>
      <div class="testi-author">
        <div class="testi-avatar">
          <img src="${data.avatar}" alt="${data.name}" loading="lazy" />
        </div>
        <div>
          <p class="testi-name">${data.name}</p>
          <p class="testi-since">${data.since}</p>
        </div>
      </div>
    `;
    return div;
  }

  /* Build dots */
  function buildDot(index) {
    const btn = document.createElement('button');
    btn.className = 'testi-dot' + (index === 0 ? ' active' : '');
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-label', `Ir para depoimento ${index + 1}`);
    btn.setAttribute('aria-controls', `testi-panel-${index}`);
    btn.addEventListener('click', () => goTo(index));
    return btn;
  }

  // Populate
  TESTIMONIALS.forEach((data, i) => {
    carousel.appendChild(buildItem(data, i));
    if (dotsWrap) dotsWrap.appendChild(buildDot(i));
  });

  function goTo(index) {
    const items = carousel.querySelectorAll('.testi-item');
    const dots  = dotsWrap ? dotsWrap.querySelectorAll('.testi-dot') : [];

    // Exit current
    items[current].classList.remove('active');
    items[current].classList.add('exit');
    dots[current]?.classList.remove('active');

    setTimeout(() => items[current].classList.remove('exit'), 600);

    current = (index + TESTIMONIALS.length) % TESTIMONIALS.length;

    // Enter next
    items[current].classList.add('active');
    dots[current]?.classList.add('active');

    resetAuto();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  if (nextBtn) nextBtn.addEventListener('click', next);
  if (prevBtn) prevBtn.addEventListener('click', prev);

  // Auto-advance
  function startAuto() {
    autoTimer = setInterval(next, 5500);
  }
  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  startAuto();

  // Pause on hover
  const section = carousel.closest('.testimonials');
  if (section) {
    section.addEventListener('mouseenter', () => clearInterval(autoTimer));
    section.addEventListener('mouseleave', startAuto);
  }

  // Swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      dx < 0 ? next() : prev();
    }
  }, { passive: true });
})();

/* ═══════════════════════════════════════════════
   13. MAGNETIC BUTTONS
═══════════════════════════════════════════════ */
/* Magnetic effect disabled — buttons stay fixed, hover handled in CSS */

/* ═══════════════════════════════════════════════
   14. FOOTER NEWSLETTER
═══════════════════════════════════════════════ */
(function initNewsletter() {
  const form    = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input || !input.value) return;

    // Simulate submission
    const btn = form.querySelector('button');
    if (btn) btn.style.opacity = '0.4';

    setTimeout(() => {
      input.value = '';
      success.textContent = 'Você está na lista. Bem-vinda ao Atelier.';
      if (btn) btn.style.opacity = '';
      setTimeout(() => { success.textContent = ''; }, 5000);
    }, 800);
  });
})();

/* ═══════════════════════════════════════════════
   15. CARD TILT (subtle 3D hover on treatment cards)
═══════════════════════════════════════════════ */
(function initCardTilt() {
  const mq = window.matchMedia('(hover: none)');
  if (mq.matches) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) return;

  document.querySelectorAll('.card--treatment').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `
        perspective(900px)
        rotateY(${x * 6}deg)
        rotateX(${-y * 6}deg)
        translateZ(6px)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ═══════════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL
═══════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const links    = document.querySelectorAll('.nav__link[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach((link) => {
        const matches = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('nav__link--active', matches);
      });
    });
  }, {
    rootMargin: '-40% 0px -55% 0px',
    threshold:  0,
  });

  sections.forEach((s) => observer.observe(s));
})();

/* ═══════════════════════════════════════════════
   SANCTUARY IMAGE HOVER PARALLAX
═══════════════════════════════════════════════ */
(function initSanctuaryParallax() {
  const mq = window.matchMedia('(hover: none)');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mq.matches || prefersReduced.matches) return;

  document.querySelectorAll('.sanctuary__img').forEach((img) => {
    img.addEventListener('mouseenter', () => {
      img.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    });
    img.addEventListener('mousemove', (e) => {
      const rect = img.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      img.style.transform = `scale(1.04) translate(${x * 8}px, ${y * 8}px)`;
    });
    img.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });
})();

/* ═══════════════════════════════════════════════
   VIDEO MODAL — YouTube carousel (Ninfoplastia)
═══════════════════════════════════════════════ */
const initVideoModal = () => {
  // Preencha com os IDs dos vídeos do YouTube (ex.: 'dQw4w9WgXcQ')
  const videos = [
    // { id: 'YOUTUBE_ID_1', title: 'Dra. Mirelle explica a ninfoplastia' },
    // { id: 'YOUTUBE_ID_2', title: 'Recuperação e cuidados' },
  ];

  const modal     = document.getElementById('videoModal');
  if (!modal) return;

  const frame     = document.getElementById('videoModalFrame');
  const caption   = document.getElementById('videoModalCaption');
  const dotsWrap  = document.getElementById('videoModalDots');
  const prevBtn   = modal.querySelector('[data-video-modal-prev]');
  const nextBtn   = modal.querySelector('[data-video-modal-next]');
  const openers   = document.querySelectorAll('[data-video-modal-open]');
  const closers   = modal.querySelectorAll('[data-video-modal-close]');

  let current     = 0;
  let lastFocus   = null;

  const renderFrame = () => {
    frame.innerHTML = '';
    frame.classList.remove('video-modal__frame-inner--empty');

    if (!videos.length) {
      frame.classList.add('video-modal__frame-inner--empty');
      frame.textContent = 'Os vídeos serão adicionados em breve.';
      caption.textContent = '';
      return;
    }

    const video  = videos[current];
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&modestbranding=1&playsinline=1`;
    iframe.title = video.title || 'Vídeo Mulherez';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    frame.appendChild(iframe);

    caption.textContent = video.title ? `${current + 1} / ${videos.length} — ${video.title}` : `${current + 1} / ${videos.length}`;
  };

  const renderDots = () => {
    dotsWrap.innerHTML = '';
    if (videos.length <= 1) return;

    videos.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'video-modal__dot' + (i === current ? ' is-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Ir para o vídeo ${i + 1}`);
      dot.setAttribute('aria-selected', i === current ? 'true' : 'false');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });
  };

  const updateNav = () => {
    const disabled = videos.length <= 1;
    prevBtn.disabled = disabled;
    nextBtn.disabled = disabled;
  };

  const goTo = (index) => {
    if (!videos.length) return;
    current = (index + videos.length) % videos.length;
    renderFrame();
    renderDots();
  };

  const open = () => {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('video-modal-open');
    lastFocus = document.activeElement;
    renderFrame();
    renderDots();
    updateNav();
    (videos.length > 1 ? nextBtn : modal.querySelector('.video-modal__close')).focus();
  };

  const close = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('video-modal-open');
    frame.innerHTML = ''; // stops YouTube playback
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  };

  openers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      open();
    });
  });

  closers.forEach((el) => el.addEventListener('click', close));
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVideoModal);
} else {
  initVideoModal();
}

/* ═══════════════════════════════════════════════
   CONSOLE SIGNATURE
═══════════════════════════════════════════════ */
console.log(
  '%cMulherez — The Clinical Atelier\n%cCrafted with precision.',
  'color:#4b194b;font-family:Georgia,serif;font-size:18px;font-weight:700;',
  'color:#006a65;font-family:sans-serif;font-size:11px;letter-spacing:0.1em;',
);

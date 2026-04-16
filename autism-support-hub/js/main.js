/* ============================================================
   Autism Support Hub — Main JavaScript
   autismsupporthub.com.au
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Page Transition ─────────────────────────────────────
  const overlay = document.getElementById('page-transition');

  // Fade in current page
  const pageContent = document.querySelector('.page-content');
  if (pageContent) {
    requestAnimationFrame(() => {
      setTimeout(() => pageContent.classList.add('visible'), 40);
    });
  }

  // Intercept nav links for smooth transitions
  function navigateTo(href) {
    if (!overlay) return (window.location.href = href);
    overlay.classList.add('enter');
    setTimeout(() => {
      window.location.href = href;
    }, 520);
  }

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    // Skip external links, anchors, mailto, tel
    if (!href || href.startsWith('#') || href.startsWith('mailto') ||
        href.startsWith('tel') || href.startsWith('http') || link.hasAttribute('data-no-transition')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      navigateTo(href);
    });
  });

  // On page load, exit overlay
  if (overlay) {
    overlay.classList.remove('enter');
    overlay.classList.add('exit');
    setTimeout(() => overlay.classList.remove('exit'), 600);
  }

  // ─── Navigation ──────────────────────────────────────────
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  // Scrolled state
  function updateNav() {
    if (!nav) return;
    const isDark = nav.classList.contains('dark-bg');
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
      if (isDark) nav.classList.remove('dark-bg');
    } else {
      nav.classList.remove('scrolled');
      if (isDark || nav.dataset.dark === 'true') nav.classList.add('dark-bg');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // Hamburger toggle
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active nav link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath) link.classList.add('active');
  });

  // ─── Scroll Reveal ───────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // ─── Smooth Scroll Anchor ────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--nav-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ─── Hero Scroll Hint ────────────────────────────────────
  const heroScroll = document.querySelector('.hero-scroll');
  if (heroScroll) {
    heroScroll.addEventListener('click', () => {
      const next = document.querySelector('.hero')?.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ─── Contact Form ─────────────────────────────────────────
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      // Simulate submission (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 1400));

      contactForm.style.display = 'none';
      if (formSuccess) formSuccess.style.display = 'block';
    });

    // Real-time validation feedback
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.required && !field.value.trim()) {
          field.style.borderColor = '#e53e3e';
        } else {
          field.style.borderColor = '';
        }
      });
      field.addEventListener('focus', () => {
        field.style.borderColor = '';
      });
    });
  }

  // ─── Counter Animation ───────────────────────────────────
  function animateCounter(el, target, duration = 1600) {
    const start = performance.now();
    const isPlus = el.textContent.includes('+');
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target) + (isPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, parseInt(entry.target.dataset.count));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => counterObserver.observe(el));

});

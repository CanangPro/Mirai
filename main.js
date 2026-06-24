document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. STICKY HEADER — CSS-class-driven scroll state
     ========================================================================== */
  const header = document.getElementById('main-header');

  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Apply correct state on first load
  }

  /* ==========================================================================
     2. MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    // Toggle drawer open/closed
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on any nav link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) {
        mobileMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ==========================================================================
     3. SCROLL REVEAL — IntersectionObserver
     ========================================================================== */
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-on-scroll-visible');
        observer.unobserve(entry.target); // Observe once only
      }
    });
  }, {
    rootMargin: '0px',
    threshold: 0.12
  });

  document.querySelectorAll('[data-animation-on-scroll]').forEach(el => {
    el.classList.add('animate-on-scroll-hidden');

    if (el.hasAttribute('data-anim-left'))  el.classList.add('animate-from-left');
    if (el.hasAttribute('data-anim-right')) el.classList.add('animate-from-right');

    const delay = el.getAttribute('data-delay');
    if (delay) el.classList.add(`reveal-delay-${delay}`);

    revealObserver.observe(el);
  });

  /* ==========================================================================
     4. CONTACT FORM — Validation & Submission
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const fields = {
    name:    { input: document.getElementById('form-name'),    feedback: document.getElementById('feedback-name') },
    email:   { input: document.getElementById('form-email'),   feedback: document.getElementById('feedback-email') },
    service: { input: document.getElementById('form-service'), feedback: document.getElementById('feedback-service') },
    details: { input: document.getElementById('form-details'), feedback: document.getElementById('feedback-details') },
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const clearFeedback = () =>
    Object.values(fields).forEach(({ feedback }) => feedback.classList.add('hidden'));

  const showFeedback = (key) => {
    fields[key].feedback.classList.remove('hidden');
  };

  const validate = () => {
    clearFeedback();
    let valid = true;

    if (!fields.name.input.value.trim())                              { showFeedback('name');    valid = false; }
    if (!EMAIL_REGEX.test(fields.email.input.value.trim()))           { showFeedback('email');   valid = false; }
    if (!fields.service.input.value)                                  { showFeedback('service'); valid = false; }
    if (!fields.details.input.value.trim())                           { showFeedback('details'); valid = false; }

    return valid;
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Mengirim Pesan…';

    // Simulate async submission (replace with real API call if needed)
    setTimeout(() => {
      submitBtn.textContent = '✓ Pesan Terkirim!';
      submitBtn.style.cssText = 'background-color: var(--color-primary); color: var(--color-accent); opacity: 0.85;';
      contactForm.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.removeAttribute('style');
      }, 3500);
    }, 1500);
  });

});

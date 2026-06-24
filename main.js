document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     STICKY HEADER SCROLL EFFECT
     ========================================================================== */
  const header = document.getElementById('main-header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      header.querySelector('nav').classList.add('bg-[rgba(10,34,64,0.95)]', 'shadow-lg');
      header.querySelector('nav').classList.remove('bg-[rgba(237,236,233,0.93)]');
      // Change logo and menu link color states to light when scrolled since nav turns dark
      const logoImg = header.querySelector('.logo-img');
      if (logoImg) {
        logoImg.classList.add('brightness-0', 'invert');
      }
      header.querySelectorAll('.nav-desktop-link').forEach(link => {
        link.classList.remove('text-brand-primary', 'hover:bg-black/5');
        link.classList.add('text-neutral-white', 'hover:bg-white/10');
      });
      // Toggle menu toggle button color
      const menuToggle = document.getElementById('menu-toggle');
      if (menuToggle) {
        menuToggle.classList.remove('text-brand-primary');
        menuToggle.classList.add('text-brand-accent');
      }
    } else {
      header.classList.remove('scrolled');
      header.querySelector('nav').classList.remove('bg-[rgba(10,34,64,0.95)]', 'shadow-lg');
      header.querySelector('nav').classList.add('bg-[rgba(237,236,233,0.93)]');
      // Reset color states
      const logoImg = header.querySelector('.logo-img');
      if (logoImg) {
        logoImg.classList.remove('brightness-0', 'invert');
      }
      header.querySelectorAll('.nav-desktop-link').forEach(link => {
        link.classList.add('text-brand-primary', 'hover:bg-black/5');
        link.classList.remove('text-neutral-white', 'hover:bg-white/10');
      });
      const menuToggle = document.getElementById('menu-toggle');
      if (menuToggle) {
        menuToggle.classList.add('text-brand-primary');
        menuToggle.classList.remove('text-brand-accent');
      }
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run initially

  /* ==========================================================================
     MOBILE NAVIGATION DRAWER
     ========================================================================== */
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    const toggleMenu = () => {
      mobileMenu.classList.toggle('opacity-0');
      mobileMenu.classList.toggle('pointer-events-none');
      mobileMenu.classList.toggle('-translate-y-4');
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking navigation link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
      });
    });

    // Close mobile menu if clicked outside
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target) && !mobileMenu.classList.contains('opacity-0')) {
        mobileMenu.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
      }
    });
  }

  /* ==========================================================================
     INTERSECTION OBSERVER FOR SCROLL REVEALS
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-on-scroll-visible');
        // Optional: stop observing once visible
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('[data-animation-on-scroll]').forEach(element => {
    element.classList.add('animate-on-scroll-hidden');
    
    // Add specific transition directions from attributes
    if (element.hasAttribute('data-anim-left')) {
      element.classList.add('animate-from-left');
    } else if (element.hasAttribute('data-anim-right')) {
      element.classList.add('animate-from-right');
    }

    // Add delays if specified
    if (element.hasAttribute('data-delay')) {
      const delay = element.getAttribute('data-delay');
      element.classList.add(`reveal-delay-${delay}`);
    }

    scrollObserver.observe(element);
  });

  /* ==========================================================================
     CONTACT / INTAKE FORM VALIDATION & HANDLING
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const name = document.getElementById('form-name');
      const email = document.getElementById('form-email');
      const details = document.getElementById('form-details');
      const service = document.getElementById('form-service');

      // Clear previous feedbacks
      document.querySelectorAll('.form-feedback').forEach(el => el.classList.add('hidden'));

      // Validate Name
      if (!name.value.trim()) {
        document.getElementById('feedback-name').classList.remove('hidden');
        isValid = false;
      }

      // Validate Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
        document.getElementById('feedback-email').classList.remove('hidden');
        isValid = false;
      }

      // Validate Project Details
      if (!details.value.trim()) {
        document.getElementById('feedback-details').classList.remove('hidden');
        isValid = false;
      }

      // Validate Service selection
      if (!service.value.trim()) {
        document.getElementById('feedback-service').classList.remove('hidden');
        isValid = false;
      }

      if (isValid) {
        // Success feedback simulation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim Pesan...';

        setTimeout(() => {
          submitBtn.textContent = 'Pesan Terkirim!';
          submitBtn.classList.remove('bg-brand-accent', 'text-brand-primary');
          submitBtn.classList.add('bg-green-500', 'text-white');
          
          // Clear inputs
          contactForm.reset();

          // Reset button after 3 seconds
          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('bg-green-500', 'text-white');
            submitBtn.classList.add('bg-brand-accent', 'text-brand-primary');
          }, 3000);
        }, 1500);
      }
    });
  }
});

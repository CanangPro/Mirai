document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     STICKY HEADER & ACTIVE NAV LINK HIGHLIGHT
     ========================================================================== */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  const handleScroll = () => {
    // Sticky header class
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting based on scroll position
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120; // offset for navbar height
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Trigger on load

  /* ==========================================================================
     MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });

    // Close menu if clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     PORTFOLIO FILTERING SYSTEM
     ========================================================================== */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button style
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');

        if (filterValue === 'all' || itemCategory === filterValue) {
          // Show items with transition
          item.classList.remove('hidden');
          // Trigger a small animation re-entry if desired
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          // Hide items with transition
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  /* ==========================================================================
     TESTIMONIALS SLIDER CAROUSEL
     ========================================================================== */
  const sliderTrack = document.getElementById('slider-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  const dots = document.querySelectorAll('.slider-dot');
  
  let currentSlideIndex = 0;
  const totalSlides = slides.length;

  const updateSlider = () => {
    // Translate the track
    sliderTrack.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // Toggle active classes on slides
    slides.forEach((slide, index) => {
      if (index === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Toggle active classes on dots
    dots.forEach((dot, index) => {
      if (index === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const goToNextSlide = () => {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateSlider();
  };

  const goToPrevSlide = () => {
    currentSlideIndex = (currentSlideIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
  };

  if (sliderTrack && totalSlides > 0) {
    // Next/Prev Buttons
    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', goToNextSlide);
      prevBtn.addEventListener('click', goToPrevSlide);
    }

    // Dots navigation
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        currentSlideIndex = parseInt(dot.getAttribute('data-index'), 10);
        updateSlider();
      });
    });

    // Optional Auto-play every 7 seconds
    let autoPlayTimer = setInterval(goToNextSlide, 7000);

    const resetTimer = () => {
      clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(goToNextSlide, 7000);
    };

    // Reset autoplay timer when user interacts
    if (nextBtn) nextBtn.addEventListener('click', resetTimer);
    if (prevBtn) prevBtn.addEventListener('click', resetTimer);
    dots.forEach(dot => dot.addEventListener('click', resetTimer));
  }

  /* ==========================================================================
     SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Unobserve after revealing
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is in full view
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ==========================================================================
     CONTACT FORM VALIDATION & INTERACTIVE STATE
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      
      const nameInput = document.getElementById('form-name');
      const emailInput = document.getElementById('form-email');
      const detailsInput = document.getElementById('form-details');
      const serviceInput = document.getElementById('form-service');
      
      const nameFeedback = document.getElementById('feedback-name');
      const emailFeedback = document.getElementById('feedback-email');
      const detailsFeedback = document.getElementById('feedback-details');
      const serviceFeedback = document.getElementById('feedback-service');
      
      // Name validation
      if (nameInput.value.trim() === '') {
        nameFeedback.style.display = 'block';
        nameInput.style.borderBottomColor = '#ff6b6b';
        isValid = false;
      } else {
        nameFeedback.style.display = 'none';
        nameInput.style.borderBottomColor = '';
      }
      
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput.value.trim())) {
        emailFeedback.style.display = 'block';
        emailInput.style.borderBottomColor = '#ff6b6b';
        isValid = false;
      } else {
        emailFeedback.style.display = 'none';
        emailInput.style.borderBottomColor = '';
      }
      
      // Project Details validation
      if (detailsInput.value.trim() === '') {
        detailsFeedback.style.display = 'block';
        detailsInput.style.borderBottomColor = '#ff6b6b';
        isValid = false;
      } else {
        detailsFeedback.style.display = 'none';
        detailsInput.style.borderBottomColor = '';
      }
      
      // Service validation
      if (serviceInput.value.trim() === '') {
        serviceFeedback.style.display = 'block';
        serviceInput.style.borderBottomColor = '#ff6b6b';
        isValid = false;
      } else {
        serviceFeedback.style.display = 'none';
        serviceInput.style.borderBottomColor = '';
      }
      
      // Submit form if valid
      if (isValid) {
        // Show success visual state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;
        
        // Simulate sending process (2 seconds)
        setTimeout(() => {
          // Success Feedback
          submitBtn.textContent = 'Message Sent!';
          submitBtn.style.backgroundColor = '#2ecc71';
          submitBtn.style.borderColor = '#2ecc71';
          submitBtn.style.color = '#ffffff';
          submitBtn.style.opacity = '1';
          
          // Reset form fields
          contactForm.reset();
          
          // Revert button after 3 seconds
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.backgroundColor = '';
            submitBtn.style.borderColor = '';
            submitBtn.style.color = '';
            submitBtn.disabled = false;
          }, 3000);
        }, 1500);
      }
    });

    // Clear feedback errors on input typing
    const inputs = contactForm.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        const feedback = document.getElementById(`feedback-${input.id.replace('form-', '')}`);
        if (feedback) {
          feedback.style.display = 'none';
          input.style.borderBottomColor = '';
        }
      });
    });
  }
});

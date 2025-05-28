document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('nav a[href^="#"], .scroll-indicator a[href^="#"]');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Hero logo animation (simple fade-in and scale-up for the img tag)
  const heroLogo = document.querySelector('.hero-logo');
  if (heroLogo) {
    heroLogo.style.opacity = '0';
    heroLogo.style.transform = 'scale(0.95)';
    // The transition properties should be defined in CSS for better separation
    // e.g., .hero-logo { transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
    // Adding them here defensively if not in CSS, but CSS is preferred.
    if (!getComputedStyle(heroLogo).transitionProperty.includes('opacity')) {
        heroLogo.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    }

    setTimeout(() => {
      heroLogo.style.opacity = '1';
      heroLogo.style.transform = 'scale(1)';
    }, 100); // Short delay to ensure initial styles are applied
  }

  // "Who Knew?" pop-out animation on scroll
  const whoKnewElement = document.getElementById('who-knew-popout');
  if (whoKnewElement) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.4 // 40% of element visible
    };

    const whoKnewObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Animate only once
        }
      });
    }, observerOptions);

    whoKnewObserver.observe(whoKnewElement);
  }

  // Contact form submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const button = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = button.textContent;
      button.textContent = 'Sending...';
      button.disabled = true;

      // Create a status message element if it doesn't exist
      let statusMessage = contactForm.querySelector('.form-status-message');
      if (!statusMessage) {
        statusMessage = document.createElement('p');
        statusMessage.className = 'form-status-message';
        // Insert message before the button, or at the end of the form
        contactForm.insertBefore(statusMessage, button);
      }
      statusMessage.textContent = ''; // Clear previous messages

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          // const result = await response.json(); // Assuming server sends JSON response
          statusMessage.textContent = 'Message sent successfully! We\'ll be in touch.';
          statusMessage.style.color = 'var(--success, #10b981)';
          contactForm.reset();
        } else {
          // const errorResult = await response.json(); // Assuming server sends JSON error
          statusMessage.textContent = 'Something went wrong. Please try again.';
          statusMessage.style.color = 'var(--error, #ef4444)';
        }
      } catch (error) {
        console.error('Form submission error:', error);
        statusMessage.textContent = 'Network error. Please check your connection and try again.';
        statusMessage.style.color = 'var(--error, #ef4444)';
      }
      finally {
        button.textContent = originalButtonText;
        button.disabled = false;
        setTimeout(() => { statusMessage.textContent = ''; }, 5000); // Clear message after 5s
      }
    });
  }

  // Playful scroll-down indicator (example: simple pulse, CSS should handle main animation)
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    // This is mostly to demonstrate JS interaction if needed.
    // CSS animations are preferred for simple loops like pulsing.
    // Example: Add a class on load to kickstart CSS animation if not already active
    // scrollIndicator.classList.add('active');
  }

});

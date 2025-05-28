document.addEventListener('DOMContentLoaded', () => {
  // Smooth scrolling for navigation links
  const smoothScrollLinks = document.querySelectorAll('nav a[href^="#"], a.scroll-down-indicator[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      // Basic check for valid targetId (e.g. not just "#")
      if (targetId && targetId.length > 1) {
        try {
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                behavior: 'smooth'
                });
            }
        } catch (error) {
            console.error('Error finding element for smooth scroll:', targetId, error);
        }
      }
    });
  });

  // Hero logo animation (triggered by JS, visual properties and transition defined in CSS)
  const heroLogo = document.querySelector('#hero-logo'); // Updated selector to ID-based
  if (heroLogo) {
    // Initial styles (opacity: 0, transform: scale(0.95)) and transition are set in CSS.
    // JS just triggers the animation after a short delay to ensure CSS is applied.
    setTimeout(() => {
      heroLogo.style.opacity = '1';
      heroLogo.style.transform = 'scale(1)';
    }, 100); // Delay to ensure initial styles are rendered and transition occurs
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
          entry.target.classList.add('is-visible'); // CSS handles the animation
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
      const plainFormData = Object.fromEntries(formData.entries());
      const jsonDataString = JSON.stringify(plainFormData);

      const button = contactForm.querySelector('button[type="submit"]');
      const originalButtonText = button.textContent;
      
      button.textContent = 'Sending...';
      button.disabled = true;

      let statusMessage = contactForm.querySelector('.form-status-message');
      if (!statusMessage) {
        statusMessage = document.createElement('p');
        statusMessage.className = 'form-status-message';
        // Insert message before the button for visibility
        button.parentNode.insertBefore(statusMessage, button);
      }
      statusMessage.textContent = ''; // Clear previous messages

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: jsonDataString
        });

        const responseData = await response.json(); // Server is expected to send JSON

        if (response.ok) {
          statusMessage.textContent = responseData.message || 'Message sent successfully! We\'ll be in touch.';
          statusMessage.style.color = 'var(--success-color, #10b981)'; 
          contactForm.reset();
        } else {
          statusMessage.textContent = responseData.message || 'Something went wrong. Please try again.';
          statusMessage.style.color = 'var(--error-color, #ef4444)';
        }
      } catch (error) { // Catches network errors or if response.json() fails
        console.error('Form submission error:', error);
        statusMessage.textContent = 'A network error occurred or the server response was not valid. Please try again.';
        statusMessage.style.color = 'var(--error-color, #ef4444)';
      } finally {
        button.textContent = originalButtonText;
        button.disabled = false;
        setTimeout(() => { 
          if (statusMessage) statusMessage.textContent = ''; 
        }, 5000); // Clear message after 5 seconds
      }
    });
  }

  // Scroll-down indicator interactions (if any beyond smooth scroll)
  const scrollIndicator = document.querySelector('.scroll-down-indicator'); // Corrected selector
  if (scrollIndicator) {
    // Current functionality for scroll-down-indicator is smooth scroll (handled above)
    // and CSS animation (@keyframes bounce). No specific JS interaction added here for now.
  }
  
  // Set current year in footer
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});

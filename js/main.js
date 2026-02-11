/* ============================================
   FITNESSBEACHES.COM — Main JavaScript
   ============================================ */

(function () {
  'use strict';

  // --- Navigation: Scroll-based style change ---
  const nav = document.getElementById('nav');

  function handleNavScroll() {
    if (!nav) return;
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // Check initial state

  // --- Mobile Menu Toggle ---
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      const isOpen = mobileMenu.classList.contains('active');
      mobileMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close mobile menu when clicking a link that scrolls to a section
    const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });
  }

  // --- Scroll Reveal Animations (Intersection Observer) ---
  var revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything immediately
    revealElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // --- FAQ Accordion ---
  var faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    var answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          var otherQuestion = otherItem.querySelector('.faq-question');
          var otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherQuestion) otherQuestion.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });

    // Keyboard support
    question.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        question.click();
      }
    });
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var navHeight = nav ? nav.offsetHeight : 72;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // --- Stats counter animation ---
  var statNumbers = document.querySelectorAll('.stat__number');

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (stat) {
      statsObserver.observe(stat);
    });
  }

  function animateStat(el) {
    var text = el.textContent.trim();
    var hasPlus = text.includes('+');
    var hasDash = text.includes('-');

    // For non-numeric stats like "1-100", skip animation
    if (hasDash && !hasPlus) return;

    var numericPart = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericPart)) return;

    var suffix = hasPlus ? '+' : '';
    var duration = 1200;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.floor(eased * numericPart);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = numericPart + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // --- Horizontal scroll drag for routes ---
  var routesScroll = document.querySelector('.routes-scroll');

  if (routesScroll) {
    var isDown = false;
    var startX;
    var scrollLeft;

    routesScroll.addEventListener('mousedown', function (e) {
      isDown = true;
      routesScroll.style.cursor = 'grabbing';
      startX = e.pageX - routesScroll.offsetLeft;
      scrollLeft = routesScroll.scrollLeft;
    });

    routesScroll.addEventListener('mouseleave', function () {
      isDown = false;
      routesScroll.style.cursor = '';
    });

    routesScroll.addEventListener('mouseup', function () {
      isDown = false;
      routesScroll.style.cursor = '';
    });

    routesScroll.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - routesScroll.offsetLeft;
      var walk = (x - startX) * 1.5;
      routesScroll.scrollLeft = scrollLeft - walk;
    });
  }

  // --- Newsletter form handling (placeholder) ---
  var forms = document.querySelectorAll('form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        var btn = form.querySelector('button[type="submit"]');
        if (btn) {
          var originalText = btn.textContent;
          btn.textContent = 'Noted. We\'ll be in touch.';
          btn.disabled = true;
          btn.style.opacity = '0.7';
          input.value = '';
          input.disabled = true;

          setTimeout(function () {
            btn.textContent = originalText;
            btn.disabled = false;
            btn.style.opacity = '';
            input.disabled = false;
          }, 4000);
        }
      }
    });
  });
})();

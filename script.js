/* ============================================================
   AICT Global Services — Script
   Minimal, no-framework JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ---- Mobile Navigation Toggle ----
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');

  function openNav() {
    mainNav.classList.add('open');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    mainNav.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.contains('open');
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
  }

  // Close nav on link click (mobile)
  if (mainNav) {
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (mainNav.classList.contains('open')) {
          closeNav();
        }
      });
    });
  }

  // Close nav on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mainNav && mainNav.classList.contains('open')) {
      closeNav();
      navToggle.focus();
    }
  });


  // ---- Header Scroll Effect ----
  const header = document.querySelector('.site-header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    if (header) {
      if (scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Run on load


  // ---- Scroll Reveal Animations (IntersectionObserver) ----
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything
      reveals.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  initScrollReveal();


  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#main') return; // skip-link handled by browser

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 72;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Set focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });


  // ---- Active Navigation Link ----
  function setActiveNavLink() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var navLinks = document.querySelectorAll('.main-nav a:not(.btn)');

    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setActiveNavLink();

})();

/* Portfolio interactions — no dependencies, no build step. */
(function () {
  'use strict';

  /* ── Current year in footer ── */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ── Mobile menu ── */
  var toggle = document.getElementById('navToggle');
  var links  = document.getElementById('navLinks');

  function closeMenu() {
    if (!links) return;
    links.classList.remove('is-open');
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
  }

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ── Border on nav once scrolled ── */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('is-stuck', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Reveal elements as they enter the viewport ── */
  var revealables = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        setTimeout(function () { el.classList.add('is-visible'); }, i * 60);
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealables.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ── Highlight the nav link for the section you're reading ── */
  var sections = document.querySelectorAll('main section[id]');
  var navAnchors = links ? links.querySelectorAll('a[href^="#"]') : [];

  if ('IntersectionObserver' in window && sections.length && navAnchors.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        navAnchors.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ── Project filtering (matches data-tags on each .card) ── */
  var filterBar = document.getElementById('filters');
  var grid = document.getElementById('projectGrid');

  if (filterBar && grid) {
    var cards = grid.querySelectorAll('.card');

    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filters__btn');
      if (!btn) return;

      filterBar.querySelectorAll('.filters__btn').forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });

      var want = btn.dataset.filter;
      cards.forEach(function (card) {
        var tags = (card.dataset.tags || '').split(/\s+/);
        var show = want === 'all' || tags.indexOf(want) !== -1;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-visible');
      });
    });
  }
})();

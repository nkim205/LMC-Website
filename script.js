// Green Forks Connect: light interactivity (no dependencies)
(function () {
  'use strict';

  // ----- Report / Notify / Track stepper (accessible tabs) -----
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.step'));
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));

  function activate(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) {
      p.classList.toggle('is-active', p.id === tab.getAttribute('aria-controls'));
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activate(tab); });
    tab.addEventListener('keydown', function (e) {
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); activate(next, true); }
    });
  });

  // Gentle auto-advance until the visitor interacts
  var auto = null;
  var stepper = document.querySelector('.stepper');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function stopAuto() { if (auto) { clearInterval(auto); auto = null; } }
  if (stepper && !reduce && 'IntersectionObserver' in window) {
    stepper.addEventListener('click', stopAuto);
    stepper.addEventListener('keydown', stopAuto);
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !auto && !stepper.dataset.touched) {
          auto = setInterval(function () {
            var i = tabs.findIndex(function (t) { return t.classList.contains('is-active'); });
            activate(tabs[(i + 1) % tabs.length]);
          }, 5000);
        } else if (!en.isIntersecting) { stopAuto(); }
      });
    }, { threshold: 0.4 }).observe(stepper);
  }

  // ----- Scroll reveal -----
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // ----- Count-up for impact stats -----
  var counters = document.querySelectorAll('[data-count]');
  function run(el) {
    var target = parseInt(el.dataset.count, 10);
    var start = null, dur = 1200;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }
})();

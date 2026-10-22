/* ==========================================================================
   AcquireLocal — active-nav.js
   Highlights the nav link for the section on screen (desktop underline and
   the phone menu row) by setting aria-current="location" on it.
   ========================================================================== */
(function () {
  "use strict";

  var links = Array.prototype.slice.call(document.querySelectorAll('.nav__list a[href^="#"]'));
  var items = links.map(function (link) {
    return { link: link, section: document.getElementById(link.getAttribute("href").slice(1)) };
  }).filter(function (item) { return item.section; });
  if (!items.length) return;

  var current = null;
  var ticking = false;

  function update() {
    ticking = false;
    var line = window.innerHeight * 0.35;   // a section is "current" once its top passes 35% down the screen
    var active = null;

    items.forEach(function (item) {
      if (item.section.getBoundingClientRect().top <= line) active = item;
    });

    // At the very bottom, the last section wins even if it's short
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      active = items[items.length - 1];
    }

    if (active === current) return;
    if (current) current.link.removeAttribute("aria-current");
    if (active) active.link.setAttribute("aria-current", "location");
    current = active;
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", update);
  update();
})();

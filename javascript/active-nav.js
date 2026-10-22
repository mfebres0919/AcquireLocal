/* ==========================================================================
   AcquireLocal — active-nav.js
   Highlights the link for the section on screen by setting
   aria-current="location". Works for each link group independently:
   - .nav__list   → main nav on the home page (desktop underline + phone menu row)
   - .legal__toc  → "On this page" list on the Accessibility / Privacy pages
   ========================================================================== */
(function () {
  "use strict";

  var GROUPS = [".nav__list", ".legal__toc"];

  var groups = GROUPS.map(function (sel) {
    var root = document.querySelector(sel);
    if (!root) return null;
    var items = Array.prototype.slice.call(root.querySelectorAll('a[href^="#"]'))
      .map(function (link) {
        return { link: link, section: document.getElementById(link.getAttribute("href").slice(1)) };
      })
      .filter(function (item) { return item.section; });
    return items.length ? { items: items, current: null } : null;
  }).filter(Boolean);

  if (!groups.length) return;

  var ticking = false;

  function update() {
    ticking = false;
    var line = window.innerHeight * 0.35;   // a section is "current" once its top passes 35% down the screen
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    groups.forEach(function (group) {
      var active = null;
      group.items.forEach(function (item) {
        if (item.section.getBoundingClientRect().top <= line) active = item;
      });
      if (atBottom) active = group.items[group.items.length - 1];   // short last section still wins

      if (active === group.current) return;
      if (group.current) group.current.link.removeAttribute("aria-current");
      if (active) active.link.setAttribute("aria-current", "location");
      group.current = active;
    });
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

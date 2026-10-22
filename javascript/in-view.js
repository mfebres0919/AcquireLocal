/* ==========================================================================
   AcquireLocal — in-view.js
   Adds .is-in-view to [data-in-view] elements while they're on screen and
   removes it when they leave, so CSS animations replay on each visit.
   ========================================================================== */
(function () {
  "use strict";

  var items = document.querySelectorAll("[data-in-view]");
  if (!items.length || !("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      entry.target.classList.toggle("is-in-view", entry.isIntersecting);
    });
  }, { threshold: 0.45 });

  Array.prototype.forEach.call(items, function (item) {
    observer.observe(item);
  });
})();

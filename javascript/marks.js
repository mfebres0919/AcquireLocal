/* ==========================================================================
   AcquireLocal — marks.js
   Draws the gold underlines (.mark) in headings marked [data-marks] when the
   heading scrolls into view. Skipped with reduced motion: lines just show.
   ========================================================================== */
(function () {
  "use strict";

  var headings = document.querySelectorAll("[data-marks]");
  if (!headings.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!("IntersectionObserver" in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-drawn");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  Array.prototype.forEach.call(headings, function (heading) {
    heading.classList.add("marks-ready");   // hide lines until they draw
    observer.observe(heading);
  });
})();

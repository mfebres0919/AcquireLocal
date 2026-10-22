/* ==========================================================================
   AcquireLocal — smooth-scroll.js
   Lenis (javascript/vendor/lenis.min.js) eases mouse-wheel and trackpad
   scrolling so the page glides instead of stepping. Touch scrolling stays
   native (phones already have momentum). In-page links (#event, #join…)
   glide too and stop just below the fixed nav, then move keyboard focus to
   the section. Off for reduced motion (CSS scroll-padding handles anchors).
   Shared as window.lenis so other scripts (menu, back to top) can use it.
   ========================================================================== */
(function () {
  "use strict";

  if (typeof Lenis === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var lenis = new Lenis({
    duration: 1.2,                                                   // seconds a wheel scroll takes to settle
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, // fast start, soft landing
    smoothWheel: true
  });
  window.lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    window.requestAnimationFrame(raf);
  }
  window.requestAnimationFrame(raf);

  // In-page links: glide to the section, clear of the nav bar
  var nav = document.querySelector(".nav");
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link || link.hasAttribute("data-to-top")) return;
    var id = link.getAttribute("href").slice(1);
    if (!id) {                               // href="#" (logo) → back to the top
      e.preventDefault();
      lenis.scrollTo(0);
      return;
    }
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();

    var offset = -((nav ? nav.offsetHeight : 80) + 8);
    lenis.scrollTo(target, {
      offset: offset,
      onComplete: function () {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });   // keyboard + screen reader users land in the section
      }
    });
    if (history.pushState) history.pushState(null, "", "#" + id);
  });
})();

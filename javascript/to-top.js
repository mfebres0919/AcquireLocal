/* ==========================================================================
   AcquireLocal — to-top.js
   Shows the back-to-top button after the visitor scrolls past the hero,
   and returns focus to the top of the page when it's used.
   ========================================================================== */
(function () {
  "use strict";

  var btn = document.querySelector("[data-to-top]");
  var main = document.getElementById("main");
  if (!btn) return;

  function update() {
    btn.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.8);
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("load", update);
  update();

  btn.addEventListener("click", function (e) {
    e.preventDefault();
    var smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.lenis) window.lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    if (main) main.focus({ preventScroll: true });   // keyboard users land back at the top
  });
})();

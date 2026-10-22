/* ==========================================================================
   AcquireLocal — why.js
   1. Counts the 17,600 stat up from 0 the first time it scrolls into view.
   2. Business buttons (aria-pressed): pressing one shows its photo.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Count-up ---------- */
  var num = document.querySelector("[data-count]");
  if (num && !reduceMotion && "IntersectionObserver" in window) {
    var target = Number(num.getAttribute("data-count"));
    var format = function (n) { return Math.round(n).toLocaleString("en-US"); };
    num.textContent = "0";

    var countObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      countObserver.disconnect();
      var duration = 1600;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / duration);
        var eased = 1 - Math.pow(1 - t, 3);          // ease-out
        num.textContent = format(target * eased);
        if (t < 1) window.requestAnimationFrame(step);
      }
      window.requestAnimationFrame(step);
    }, { threshold: 0.6 });
    countObserver.observe(num);
  }

  /* ---------- 2. Business buttons: each one shows its photo ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".why__tab"));
  if (!tabs.length) return;

  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-pressed", String(on));
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { select(tab); });
  });
})();

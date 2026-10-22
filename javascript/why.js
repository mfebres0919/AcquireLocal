/* ==========================================================================
   AcquireLocal — why.js
   1. Counts the 17,600 stat up from 0 the first time it scrolls into view.
   2. Business tabs: switch the photo. Arrow keys / Home / End move between
      tabs (WAI-ARIA tabs pattern, automatic activation).
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

  /* ---------- 2. Tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".why__tab"));
  if (!tabs.length) return;

  function select(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
    if (focus) tab.focus();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { select(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (e.key === "Home") next = tabs[0];
      else if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); select(next, true); }
    });
  });
})();

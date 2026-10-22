/* ==========================================================================
   AcquireLocal — reveal-text.js
   Words in [data-reveal-text] fill from a muted tone to full ink as the
   paragraph scrolls through the viewport. Without JS, or with reduced
   motion, the text simply shows at full colour.
   ========================================================================== */
(function () {
  "use strict";

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var blocks = document.querySelectorAll("[data-reveal-text]");
  if (!blocks.length) return;

  // Wrap each word in a span (text stays one readable string for screen readers)
  var items = Array.prototype.map.call(blocks, function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    var spans = words.map(function (word, i) {
      var span = document.createElement("span");
      span.className = "reveal-word";
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
      return span;
    });
    el.classList.add("is-reveal-ready");
    return { el: el, spans: spans };
  });

  var ticking = false;

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    items.forEach(function (item) {
      var rect = item.el.getBoundingClientRect();
      // 0 when the top reaches 85% of the viewport, 1 when the bottom reaches 55%
      var start = vh * 0.85;
      var end = vh * 0.55;
      var progress = (start - rect.top) / (start - end + rect.height);
      progress = Math.max(0, Math.min(1, progress));
      var lit = Math.round(progress * item.spans.length);
      item.spans.forEach(function (span, i) {
        span.classList.toggle("is-lit", i < lit);
      });
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
  window.addEventListener("load", onScroll);
  update();
})();

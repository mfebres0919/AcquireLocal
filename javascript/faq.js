/* ==========================================================================
   AcquireLocal — faq.js
   Smooth open/close for the FAQ accordion (<details class="faq__item">),
   in every browser. Only one answer stays open: opening a question slides
   the previously open one shut. Without JS (or with reduced motion) the
   native <details> behaviour still works — it just isn't animated.
   ========================================================================== */
(function () {
  "use strict";

  var items = Array.prototype.slice.call(document.querySelectorAll(".faq__item"));
  if (!items.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!Element.prototype.animate) return;

  var DURATION = 380;
  var EASING = "cubic-bezier(.22, .61, .36, 1)";

  items.forEach(function (item) {
    item.removeAttribute("name");   // we handle "one open at a time" ourselves so both items animate
    var summary = item.querySelector("summary");
    item._anim = null;

    summary.addEventListener("click", function (e) {
      e.preventDefault();
      if (item.open && !item.classList.contains("is-closing")) {
        close(item);
      } else {
        items.forEach(function (other) {
          if (other !== item && other.open && !other.classList.contains("is-closing")) close(other);
        });
        open(item);
      }
    });
  });

  function animateHeight(item, from, to, done) {
    if (item._anim) item._anim.cancel();
    item._anim = item.animate({ height: [from + "px", to + "px"] }, { duration: DURATION, easing: EASING });
    item._anim.onfinish = function () {
      item._anim = null;
      done();
    };
  }

  function open(item) {
    var start = item.offsetHeight;
    item.classList.remove("is-closing");
    item.open = true;                                 // render the answer so we can measure it
    var end = item.offsetHeight;
    animateHeight(item, start, end, function () {});
  }

  function close(item) {
    var summary = item.querySelector("summary");
    var start = item.offsetHeight;
    var end = summary.offsetHeight + 2;                 // + top/bottom border
    item.classList.add("is-closing");                   // fades the answer while it slides up
    animateHeight(item, start, end, function () {
      item.open = false;
      item.classList.remove("is-closing");
    });
  }
})();

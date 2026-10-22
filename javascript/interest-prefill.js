/* ==========================================================================
   AcquireLocal — interest-prefill.js
   Links with data-interest="…" (e.g. "Become a Partner") jump to the Join
   form and tick the matching "I'm interested in" option, so the visitor
   doesn't have to. Does nothing if the form or option isn't on the page.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-interest]");
    if (!link) return;
    var value = link.getAttribute("data-interest");
    var boxes = document.querySelectorAll('input[name="interest"], input[name="interest[]"]');
    Array.prototype.forEach.call(boxes, function (box) {
      if (box.value === value) box.checked = true;
    });
  });
})();

/* ==========================================================================
   AcquireLocal — signup.js
   Submits [data-signup] forms to Formspree without leaving the page and
   announces the result (role="status"). Without JS the form posts normally.
   ========================================================================== */
(function () {
  "use strict";

  var forms = document.querySelectorAll("[data-signup]");
  if (!forms.length || !window.fetch) return;

  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector(".signup__status, [role='status']");
    var button = form.querySelector("[type='submit']");

    function say(msg, ok) {
      if (!status) return;
      status.textContent = msg;
      status.classList.toggle("is-success", ok);
      status.classList.toggle("is-error", !ok);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      button.disabled = true;
      say("Sending…", true);

      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          form.reset();
          say("Thank you! You’re on the list. We’ll be in touch with upcoming events.", true);
        })
        .catch(function () {
          say("Sorry, something went wrong. Please try again in a moment.", false);
        })
        .then(function () { button.disabled = false; });
    });
  });
})();

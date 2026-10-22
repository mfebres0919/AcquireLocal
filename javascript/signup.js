/* ==========================================================================
   AcquireLocal — signup.js
   Submits [data-signup] forms to Netlify Forms without leaving the page and
   announces the result (role="status"). Netlify detects these forms at deploy
   (data-netlify="true") and emails each submission (set the recipient in
   Netlify: Site → Forms → Form notifications).

   Without JS the form posts normally and Netlify shows its success page.
   Note: submissions only work on the deployed Netlify site, not local preview.
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

      // Netlify expects a urlencoded POST to the page, including "form-name".
      // Several ticked interests are sent as one readable line.
      var data = new FormData(form);
      var interests = data.getAll("interest");
      if (interests.length) {
        data.delete("interest");
        data.append("interest", interests.join(", "));
      }

      button.disabled = true;
      say("Sending…", true);

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString()
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

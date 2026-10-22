/* ==========================================================================
   AcquireLocal — hero.js
   Slow crossfade between the hero photos.

   Accessibility (WCAG 2.2.2 Pause, Stop, Hide):
   - Visible pause/play button; once paused it stays paused.
   - Visitors with "reduce motion" turned on see the first photo only.
   - Rotation also pauses while the tab is hidden.
   ========================================================================== */
(function () {
  "use strict";

  var INTERVAL = 7000; // ms each photo is shown (fade itself is 1.6s, set in CSS)

  var hero = document.querySelector(".hero");
  if (!hero) return;

  var slides = hero.querySelectorAll("[data-slide]");
  var dots = hero.querySelectorAll("[data-dot]");
  var pauseBtn = hero.querySelector("[data-pause]");
  var pauseLabel = pauseBtn && pauseBtn.querySelector(".hero__pause-label");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (slides.length < 2 || reduceMotion.matches) return;

  var current = 0;
  var timer = null;
  var userPaused = false;

  hero.classList.add("is-rotating");

  var FADE = 1600; // must match the opacity transition in styles.css

  function show(index) {
    if (index === current) return;

    // Outgoing photo keeps zooming while it fades, then resets
    var leaving = slides[current];
    leaving.classList.add("is-leaving");
    window.setTimeout(function () {
      leaving.classList.remove("is-leaving");
    }, FADE + 100);

    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    dots[current].removeAttribute("aria-current");

    current = (index + slides.length) % slides.length;

    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
    dots[current].setAttribute("aria-current", "true");
  }

  function start() {
    stop();
    if (userPaused || document.hidden) return;
    timer = window.setInterval(function () {
      show(current + 1);
    }, INTERVAL);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  function setPaused(paused) {
    userPaused = paused;
    pauseBtn.setAttribute("aria-pressed", String(paused));
    pauseLabel.textContent = paused ? "Play slideshow" : "Pause slideshow";
    hero.classList.toggle("is-paused", paused); // freezes the zoom too
    if (paused) stop();
    else start();
  }

  pauseBtn.addEventListener("click", function () {
    setPaused(!userPaused);
  });

  Array.prototype.forEach.call(dots, function (dot) {
    dot.addEventListener("click", function () {
      show(Number(dot.getAttribute("data-dot")));
      start(); // restart the countdown so the chosen photo gets its full time
    });
  });

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  // If the visitor turns on reduce-motion mid-visit, stop for good
  reduceMotion.addEventListener("change", function (e) {
    if (e.matches) {
      setPaused(true);
      hero.classList.remove("is-rotating");
    }
  });

  start();
})();

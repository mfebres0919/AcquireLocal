/* ==========================================================================
   AcquireLocal — nav.js
   1. Header turns solid once the page scrolls.
   2. Mobile menu: open/close, Escape to close, focus kept inside while open.
   ========================================================================== */
(function () {
  "use strict";

  var header = document.getElementById("site-header");
  var toggle = header && header.querySelector(".nav__toggle");
  var menu = document.getElementById("nav-menu");
  if (!header || !toggle || !menu) return;

  var desktop = window.matchMedia("(min-width: 75em)")  // keep in sync with the desktop nav breakpoint in styles.css;

  /* ---------- 1. Scrolled state ---------- */
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("load", onScroll);   // browsers restore scroll position after a reload
  onScroll();

  /* ---------- 2. Mobile menu ---------- */
  function focusables() {
    return [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll("a[href], button")));
  }

  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    header.classList.add("menu-open");
    document.body.classList.add("menu-locked");
    if (window.lenis) window.lenis.stop();       // freeze smooth scroll behind the panel
    var first = menu.querySelector("a[href]");
    if (first) first.focus();
  }

  function closeMenu(returnFocus) {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-locked");
    if (window.lenis) window.lenis.start();
    if (returnFocus) toggle.focus();
  }

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  toggle.addEventListener("click", function () {
    if (isOpen()) closeMenu(true);
    else openMenu();
  });

  // Tap on the dimmed page (outside the bar + panel) closes the menu
  document.addEventListener("click", function (e) {
    if (isOpen() && !e.target.closest(".nav")) closeMenu(false);
  });

  // Close after choosing a link (same-page anchors)
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a") && isOpen()) closeMenu(false);
  });

  document.addEventListener("keydown", function (e) {
    if (!isOpen()) return;

    if (e.key === "Escape") {
      closeMenu(true);
      return;
    }

    // Keep Tab cycling between the toggle and the menu items
    if (e.key === "Tab") {
      var items = focusables();
      var first = items[0];
      var last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Reset if the viewport grows to desktop while the panel is open
  desktop.addEventListener("change", function (e) {
    if (e.matches && isOpen()) closeMenu(false);
  });
})();

/* ---------- Desktop submenu toggle (Why It Matters → Ownership) ---------- */
(function () {
  "use strict";
  var toggles = document.querySelectorAll(".nav__subtoggle");
  Array.prototype.forEach.call(toggles, function (btn) {
    var item = btn.closest(".nav__item--has-sub");
    function set(open) {
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    }
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    item.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && item.classList.contains("is-open")) { set(false); btn.focus(); }
    });
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) set(false);
    });
    item.addEventListener("click", function (e) {
      if (e.target.closest(".nav__link--sub")) set(false);
    });
  });
})();

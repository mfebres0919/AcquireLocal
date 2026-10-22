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
    var first = menu.querySelector("a[href]");
    if (first) first.focus();
  }

  function closeMenu(returnFocus) {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    header.classList.remove("menu-open");
    document.body.classList.remove("menu-locked");
    if (returnFocus) toggle.focus();
  }

  function isOpen() {
    return toggle.getAttribute("aria-expanded") === "true";
  }

  toggle.addEventListener("click", function () {
    if (isOpen()) closeMenu(true);
    else openMenu();
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

/* =========================================================
   Asher Portfolio — script.js
   Vanilla JavaScript: mobile nav, scroll spy, reveals, year.
   Everything degrades gracefully without JS or with
   prefers-reduced-motion enabled.
   ========================================================= */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  var navToggleLabel = document.querySelector("[data-nav-toggle-label]");

  function setNav(open) {
    if (!navToggle || !nav) return;
    navToggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    if (navToggleLabel) {
      navToggleLabel.textContent = open ? "Close menu" : "Menu";
    }
  }

  function isNavOpen() {
    return navToggle && navToggle.getAttribute("aria-expanded") === "true";
  }

  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      setNav(!isNavOpen());
    });

    // Close after choosing a section
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNav(false);
    });

    // Close on Escape, return focus to the button
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isNavOpen()) {
        setNav(false);
        navToggle.focus();
      }
    });

    // Close when clicking/tapping outside
    document.addEventListener("click", function (event) {
      if (
        isNavOpen() &&
        !nav.contains(event.target) &&
        !navToggle.contains(event.target)
      ) {
        setNav(false);
      }
    });

    // Reset state when switching to desktop layout
    var desktop = window.matchMedia("(min-width: 52rem)");
    var onViewportChange = function (event) {
      if (event.matches) setNav(false);
    };
    if (desktop.addEventListener) {
      desktop.addEventListener("change", onViewportChange);
    } else if (desktop.addListener) {
      desktop.addListener(onViewportChange);
    }
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector("[data-header]");
  if (header) {
    var ticking = false;
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    };
    updateHeader();
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateHeader);
        }
      },
      { passive: true }
    );
  }

  /* ---------- Scroll spy (active nav link) ---------- */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.nav-list a[href^="#"]')
  );
  var sections = navLinks
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var visible = new Map();

    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          visible.set(entry.target.id, entry.isIntersecting);
        });

        var activeId = null;
        for (var i = 0; i < sections.length; i++) {
          if (visible.get(sections[i].id)) {
            activeId = sections[i].id;
            break;
          }
        }

        navLinks.forEach(function (link) {
          var match = activeId && link.getAttribute("href") === "#" + activeId;
          if (match) {
            link.setAttribute("aria-current", "true");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");

  if (!reveals.length) {
    // Nothing to do
  } else if (reduceMotion.matches || !("IntersectionObserver" in window)) {
    // Show everything immediately
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });

    // If the user turns reduced motion on later, reveal everything
    var onMotionChange = function (event) {
      if (event.matches) {
        reveals.forEach(function (el) {
          el.classList.add("is-visible");
        });
        revealObserver.disconnect();
      }
    };
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener("change", onMotionChange);
    } else if (reduceMotion.addListener) {
      reduceMotion.addListener(onMotionChange);
    }
  }

  /* ---------- Footer year ---------- */
  var yearEl = document.querySelector("[data-year]");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
})();

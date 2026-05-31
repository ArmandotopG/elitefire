(function () {
  const closeMenu = (header, nav, button) => {
    header.classList.remove("nav-active");
    nav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    button.setAttribute("aria-expanded", "false");
  };

  const initResponsiveMenu = () => {
    document.querySelectorAll(".site-header").forEach((header, index) => {
      const nav = header.querySelector(".nav");
      const button = header.querySelector(".menu-toggle");

      if (!nav || !button) {
        return;
      }

      if (!nav.id) {
        nav.id = `site-navigation-${index + 1}`;
      }

      button.setAttribute("aria-controls", nav.id);
      button.setAttribute("aria-expanded", "false");

      button.addEventListener("click", () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";

        if (isOpen) {
          closeMenu(header, nav, button);
          return;
        }

        header.classList.add("nav-active");
        nav.classList.add("is-open");
        document.body.classList.add("nav-open");
        button.setAttribute("aria-expanded", "true");
      });

      nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          if (window.matchMedia("(max-width: 900px)").matches) {
            closeMenu(header, nav, button);
          }
        });
      });

      window.addEventListener("resize", () => {
        if (!window.matchMedia("(max-width: 900px)").matches) {
          closeMenu(header, nav, button);
        }
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initResponsiveMenu);
  } else {
    initResponsiveMenu();
  }
})();

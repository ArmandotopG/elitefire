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

  const encodeFormData = (formData) =>
    new URLSearchParams(formData).toString();

  const createSubmissionId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  };

  const refreshNetlifyMetadata = (form) => {
    const submissionId = form.querySelector('input[name="submission_id"]');
    const submittedAt = form.querySelector('input[name="submitted_at"]');

    if (submissionId) {
      submissionId.value = createSubmissionId();
    }

    if (submittedAt) {
      submittedAt.value = new Date().toISOString();
    }
  };

  const initNetlifyForms = () => {
    document.querySelectorAll('form[data-netlify="true"]').forEach((form) => {
      refreshNetlifyMetadata(form);

      form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        refreshNetlifyMetadata(form);

        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
          submitButton.disabled = true;
          submitButton.dataset.originalText = submitButton.textContent;
          submitButton.textContent = "Sending...";
        }

        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encodeFormData(new FormData(form)),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Form submission failed");
            }

            window.location.href = form.getAttribute("action") || "/thank-you.html";
          })
          .catch(() => {
            form.submit();
          });
      });
    });
  };

  const initSite = () => {
    initResponsiveMenu();
    initNetlifyForms();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSite);
  } else {
    initSite();
  }

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      document.querySelectorAll('form[data-netlify="true"]').forEach((form) => {
        refreshNetlifyMetadata(form);

        const submitButton = form.querySelector('[type="submit"]');
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = submitButton.dataset.originalText || submitButton.textContent;
        }
      });
    }
  });
})();

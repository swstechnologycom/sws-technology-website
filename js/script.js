document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const button = document.getElementById("submitButton");
  const statusBox = document.getElementById("formStatus");
  const navLinks = document.getElementById("navLinks");
  const menuToggle = document.getElementById("menuToggle");
  const year = document.getElementById("year");

  year.textContent = new Date().getFullYear();

  menuToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
    });
  });

  function setError(fieldName, message) {
    const input = document.getElementById(fieldName);
    const field = input?.closest(".field");
    const error = document.querySelector(`[data-error-for="${fieldName}"]`);
    field?.classList.toggle("invalid", Boolean(message));
    if (error) error.textContent = message || "";
  }

  function validate() {
    let valid = true;
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    setError("name", "");
    setError("email", "");
    setError("subject", "");
    setError("message", "");

    if (!name.value.trim()) {
      setError("name", "Please enter your full name.");
      valid = false;
    }

    if (!email.value.trim()) {
      setError("email", "Please enter your email address.");
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
      setError("email", "Please enter a valid email address.");
      valid = false;
    }

    if (!subject.value.trim()) {
      setError("subject", "Please enter a subject.");
      valid = false;
    }

    if (!message.value.trim()) {
      setError("message", "Please enter your message.");
      valid = false;
    }

    return valid;
  }

  function showStatus(type, title, text) {
    statusBox.className = `form-status show ${type}`;
    statusBox.innerHTML = `<strong>${title}</strong><br>${text}`;
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validate()) {
      showStatus("error", "Please check the form.", "Complete the highlighted fields and try again.");
      return;
    }

    button.disabled = true;
    button.classList.add("loading");
    statusBox.className = "form-status";
    statusBox.textContent = "";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        form.reset();
        showStatus(
          "success",
          "✓ Message sent successfully",
          "Thank you for contacting SWS Technology. Our team will get back to you shortly."
        );
      } else {
        let message = "We could not send your message. Please try again.";
        try {
          const data = await response.json();
          if (data?.errors?.length) {
            message = data.errors.map(error => error.message).join(" ");
          }
        } catch (_) {}
        showStatus("error", "⚠ Message not sent", message);
      }
    } catch (error) {
      showStatus(
        "error",
        "⚠ Connection error",
        "Please check your internet connection and try again."
      );
    } finally {
      button.disabled = false;
      button.classList.remove("loading");
    }
  });
});

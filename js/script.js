// =====================================
// SWS TECHNOLOGY — INTERACTIONS
// =====================================

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  // Mobile navigation
  menuToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });

  // Current year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add("visible"));
  }

  // Countdown — first day of October 2026.
  // Once the organizer confirms the exact date, change this date.
  const targetDate = new Date("2026-10-01T09:00:00+01:00").getTime();

  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  function updateCountdown() {
    const distance = targetDate - Date.now();

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Gallery lightbox
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");

  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => {
      const image = item.dataset.image;
      const alt = item.querySelector("img")?.alt || "Galerie SWS Technology";

      lightboxImage.src = image;
      lightboxImage.alt = alt;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
    });
  });

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  // Video demo modal
  const videoModal = document.getElementById("videoModal");
  const videoDemo = document.getElementById("videoDemo");
  const videoClose = document.getElementById("videoClose");

  videoDemo?.addEventListener("click", () => {
    videoModal.classList.add("open");
    videoModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("menu-open");
  });

  function closeVideo() {
    videoModal.classList.remove("open");
    videoModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("menu-open");
  }

  videoClose?.addEventListener("click", closeVideo);
  videoModal?.addEventListener("click", event => {
    if (event.target === videoModal) closeVideo();
  });

  // Escape key
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeLightbox();
      closeVideo();
      navLinks?.classList.remove("open");
      document.body.classList.remove("menu-open");
    }
  });

  // Contact form demo
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  form?.addEventListener("submit", event => {
    event.preventDefault();
    success.classList.add("show");
    form.reset();

    setTimeout(() => {
      success.classList.remove("show");
    }, 6000);
  });
});

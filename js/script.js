const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function applyTheme(theme){
  body.dataset.theme = theme;
  localStorage.setItem("sws-theme", theme);
  themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  themeToggle.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
}
applyTheme(localStorage.getItem("sws-theme") || "dark");

themeToggle.addEventListener("click", () => {
  const nextTheme = body.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

menuToggle.addEventListener("click", () => mainNav.classList.toggle("open"));

document.querySelectorAll(".nav-drop-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    if (window.innerWidth <= 950) {
      e.preventDefault();
      btn.parentElement.classList.toggle("open");
    }
  });
});

document.querySelectorAll(".main-nav a").forEach(a => {
  a.addEventListener("click", () => mainNav.classList.remove("open"));
});

/* Hero slider */
const slides = [...document.querySelectorAll(".slide")];
const dotsWrap = document.getElementById("sliderDots");
let current = 0;
let timer;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "slider-dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
  dot.addEventListener("click", () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

function goToSlide(index){
  current = (index + slides.length) % slides.length;
  slides.forEach((s,i) => s.classList.toggle("active", i === current));
  [...dotsWrap.children].forEach((d,i) => d.classList.toggle("active", i === current));
  restartSlider();
}
function restartSlider(){
  clearInterval(timer);
  timer = setInterval(() => goToSlide(current + 1), 6500);
}
document.getElementById("prevSlide").addEventListener("click", () => goToSlide(current - 1));
document.getElementById("nextSlide").addEventListener("click", () => goToSlide(current + 1));
restartSlider();

/* Pause slider when pointer is over hero */
const hero = document.querySelector(".hero");
hero.addEventListener("mouseenter", () => clearInterval(timer));
hero.addEventListener("mouseleave", restartSlider);

/* Counter animation */
const counters = document.querySelectorAll("[data-count]");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    let n = 0;
    const step = Math.max(1, Math.ceil(target / 20));
    const tick = setInterval(() => {
      n += step;
      if(n >= target){ n = target; clearInterval(tick); }
      el.textContent = n;
    }, 55);
    observer.unobserve(el);
  });
},{threshold:.5});
counters.forEach(c => observer.observe(c));

/* Contact form: Formspree endpoint */
const form = document.getElementById("contactForm");
const statusBox = document.getElementById("formStatus");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusBox.className = "form-status";
  statusBox.textContent = "";
  submitBtn.disabled = true;
  submitBtn.querySelector("span").textContent = "Sending...";

  try {
    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    });

    if(response.ok){
      form.reset();
      statusBox.textContent = "✓ Message sent successfully. Thank you — our team will get back to you soon.";
      statusBox.className = "form-status show success";
    }else{
      let message = "Something went wrong. Please check the fields and try again.";
      try{
        const data = await response.json();
        if(data.errors?.length) message = data.errors.map(x => x.message).join(" ");
      }catch(_){}
      statusBox.textContent = "✕ " + message;
      statusBox.className = "form-status show error";
    }
  }catch(error){
    statusBox.textContent = "✕ We could not reach the form service. Please contact us directly by email or WhatsApp.";
    statusBox.className = "form-status show error";
  }finally{
    submitBtn.disabled = false;
    submitBtn.querySelector("span").textContent = "Envoyer le message";
  }
});

/* Cursor glow on desktop */
const glow = document.querySelector(".cursor-glow");
if(window.matchMedia("(pointer:fine)").matches){
  window.addEventListener("pointermove", e => {
    glow.style.transform = `translate(${e.clientX - 120}px, ${e.clientY - 120}px)`;
  });
}

/* Current year */
document.getElementById("year").textContent = new Date().getFullYear();

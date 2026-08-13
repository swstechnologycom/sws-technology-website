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
  dot.setAttribute("aria-label", `Go to service ${i + 1}`);
  dot.addEventListener("click", () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

function typeSlideText(slide){
  const target = slide?.querySelector(".typing-text");
  if(!target) return;
  const text = target.dataset.text || "";
  clearInterval(target._typingTimer);
  target.textContent = "";
  let i = 0;
  target.classList.add("is-typing");
  target._typingTimer = setInterval(() => {
    target.textContent += text.charAt(i++);
    if(i >= text.length){
      clearInterval(target._typingTimer);
      target.classList.remove("is-typing");
    }
  }, 28);
}

function goToSlide(index){
  current = (index + slides.length) % slides.length;
  slides.forEach((s,i) => s.classList.toggle("active", i === current));
  typeSlideText(slides[current]);
  [...dotsWrap.children].forEach((d,i) => d.classList.toggle("active", i === current));
  restartSlider();
}
function restartSlider(){
  clearInterval(timer);
  timer = setInterval(() => goToSlide(current + 1), 6500);
}
typeSlideText(slides[0]);

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
      statusBox.textContent = "✓ Message sent successfully. Thank you — our team will get back to you shortly.";
      statusBox.className = "form-status show success";
    }else{
      let message = "An error occurred. Please check the fields and try again.";
      try{
        const data = await response.json();
        if(data.errors?.length) message = data.errors.map(x => x.message).join(" ");
      }catch(_){}
      statusBox.textContent = "✕ " + message;
      statusBox.className = "form-status show error";
    }
  }catch(error){
    statusBox.textContent = "✕ Unable to reach the form service. Please contact us directly by email or WhatsApp.";
    statusBox.className = "form-status show error";
  }finally{
    submitBtn.disabled = false;
    submitBtn.querySelector("span").textContent = "Send Message";
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

/* V14 — interactive agency process */
document.addEventListener("DOMContentLoaded", () => {
  const cards = [...document.querySelectorAll(".process-card")];
  const counter = document.getElementById("processCounter");
  const title = document.getElementById("processTitle");
  const copy = document.getElementById("processCopy");
  const icon = document.getElementById("processIcon");
  const step = document.getElementById("processStep");
  const progress = document.querySelector(".process-progress span");
  const next = document.getElementById("processNext");
  if (!cards.length) return;
  let current = 0;

  function activate(i){
    current = (i + cards.length) % cards.length;
    const c = cards[current];
    cards.forEach(x => x.classList.remove("active"));
    c.classList.add("active");
    counter.textContent = c.dataset.step;
    step.textContent = "ÉTAPE " + c.dataset.step;
    title.textContent = c.dataset.title;
    copy.textContent = c.dataset.copy;
    icon.textContent = c.dataset.icon;
    progress.style.height = ((current + 1) / cards.length * 100) + "%";
    cards.forEach((x, n) => {
      x.style.transitionDelay = n === current ? "0ms" : "0ms";
    });
  }

  cards.forEach((c,i) => c.addEventListener("click", () => activate(i)));
  next?.addEventListener("click", () => activate(current + 1));

  const stage = document.querySelector(".process-stage");
  let auto = setInterval(() => activate(current + 1), 4800);
  stage?.addEventListener("mouseenter", () => clearInterval(auto));
  stage?.addEventListener("mouseleave", () => auto = setInterval(() => activate(current + 1), 4800));

  const observer = new IntersectionObserver(entries => {
    if(entries.some(e => e.isIntersecting)) activate(current);
  }, {threshold:.25});
  const section = document.querySelector(".sws-process");
  if(section) observer.observe(section);
});

/* V15 — interactive radial service constellation */
document.addEventListener("DOMContentLoaded", () => {
  const nodes = [...document.querySelectorAll(".service-node")];
  const info = document.querySelector(".constellation-info");
  const kicker = document.getElementById("constellationKicker");
  const title = document.getElementById("constellationTitle");
  const copy = document.getElementById("constellationCopy");
  const link = document.getElementById("constellationLink");
  if (!nodes.length || !info) return;

  const data = {
    communication: ["01 / COMMUNICATION","Construisez une marque mémorable.","Stratégie, identité visuelle, design graphique et communication corporate réunis dans une expérience de marque cohérente.","#communication"],
    advertising: ["02 / PUBLICITÉ","Placez votre marque là où les regards se portent.","Campagnes extérieures, affichage, supports promotionnels et communication visuelle conçus pour une forte visibilité.","#advertising"],
    printing: ["03 / IMPRESSION","Transformez chaque surface en média.","Impression grand format, enseignes, bâches, affiches, roll-up, vinyles et signalétique professionnelle.","#printing"],
    events: ["04 / ÉVÉNEMENTS","Transformez les moments en expériences.","Salons, conférences, stands, scènes, photocalls et branding événementiel complet.","#events"],
    marketing: ["05 / MARKETING","Transformez l’attention en opportunités.","Campagnes digitales, réseaux sociaux, marketing B2B et contenus qui poussent vos audiences à l’action.","#marketing"],
    content: ["06 / MÉDIA & CONTENU","Donnez une voix à votre marque.","Photographie, vidéo, couverture événementielle et contenus sociaux pour prolonger votre visibilité.","#marketing"]
  };

  function activate(node){
    nodes.forEach(n => n.classList.remove("active"));
    node.classList.add("active");
    const d=data[node.dataset.service];
    kicker.textContent=d[0]; title.textContent=d[1]; copy.textContent=d[2]; link.href=d[3];
    info.classList.remove("show");
    requestAnimationFrame(()=>info.classList.add("show"));
  }
  nodes.forEach(n=>n.addEventListener("click",()=>activate(n)));
  activate(nodes[0]);

  let i=0;
  const timer=setInterval(()=>{i=(i+1)%nodes.length;activate(nodes[i])},5200);
  const constellation=document.querySelector(".constellation");
  constellation?.addEventListener("mouseenter",()=>clearInterval(timer));
});

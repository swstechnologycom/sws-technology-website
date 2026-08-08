const header = document.getElementById("header");
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 20));

menuToggle?.addEventListener("click", () => {
  const open = navMenu.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", open);
});
document.querySelectorAll(".nav-menu a").forEach(a => a.addEventListener("click", () => navMenu.classList.remove("open")));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); revealObserver.unobserve(entry.target); }});
}, {threshold: .12});
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const counters = document.querySelectorAll("[data-count]");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target, target = Number(el.dataset.count);
    let start = 0;
    const timer = setInterval(() => {
      start += Math.max(1, Math.ceil(target / 25));
      if (start >= target) { start = target; clearInterval(timer); }
      el.textContent = start;
    }, 45);
    counterObserver.unobserve(el);
  });
}, {threshold:.5});
counters.forEach(el => counterObserver.observe(el));

const modal = document.getElementById("galleryModal");
const modalTitle = document.getElementById("modalTitle");
document.querySelectorAll(".gallery-item").forEach(item => item.addEventListener("click", () => {
  modalTitle.textContent = item.dataset.title || "SWS Technology";
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}));
function closeModal(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }
document.querySelector(".modal-close")?.addEventListener("click", closeModal);
document.querySelector(".modal-backdrop")?.addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if(e.key === "Escape") closeModal(); });

const translations = {
  en: {
    topbar:"Technology Events • Algeria & Beyond", brandSub:"Technology Events",
    navHome:"Home",navSectors:"Sectors",navProcess:"Our Process",navEvents:"Events",navGallery:"Gallery",navContact:"Contact",
    heroEyebrow:"TECHNOLOGY EVENTS • ALGERIA",heroTitle:"Creating world-class <em>technology events.</em>",
    heroText:"Premium exhibitions, AI conferences, industrial forums and innovation summits that connect technology leaders with future opportunities.",
    explore:"Explore Events ↗",contactUs:"Contact Us",flagship:"FLAGSHIP EVENT",eventTitle:"Technology & Innovation",
    eventText:"Exhibition • Conference • B2B • Innovation",reserve:"Become a Partner →",
    sectionSpeciality:"OUR SPECIALITY",introTitle:"Where technology meets <span>opportunity.</span>",
    introText:"SWS TECHNOLOGY delivers professional technology events across strategic industries, bringing together innovators, companies, startups, institutions and decision-makers.",
    sectorsTitle:"Technology sectors",sectorsText:"Specialized events across the technologies shaping the future.",
    s1:"Artificial Intelligence",s1p:"AI conferences, machine learning, generative AI and intelligent systems.",
    s2:"Industry 4.0",s2p:"Smart manufacturing, automation and digital factory solutions.",
    s3:"Robotics",s3p:"Automation, robotics and next-generation industrial technologies.",
    s4:"Cyber Security",s4p:"Future security, cloud protection and digital trust.",
    s5:"Smart Cities",s5p:"Smart mobility, sustainable cities and urban innovation.",
    s6:"Digital Transformation",s6p:"Digital strategies and technologies that transform organizations.",
    processTitle:"How we create successful events",processText:"From the first concept to the final media coverage, every event follows a strategic process.",
    p1:"Concept",p1p:"Create the event vision and objectives.",p2:"Planning",p2p:"Venue, exhibitors, speakers and logistics.",
    p3:"Marketing",p3p:"Digital campaigns and media partnerships.",p4:"Registration",p4p:"Online registration and visitor management.",
    p5:"Event Day",p5p:"Professional management and live experience.",p6:"Media Coverage",p6p:"Photography, video production and promotion.",
    featureTitle:"The meeting point for <span>technology & innovation.</span>",
    featureText:"A professional platform designed to connect exhibitors, technology leaders, startups, institutions and business decision-makers.",
    partner:"Become an Exhibitor",locationLabel:"LOCATION",impactTitle:"Driving technology events forward.",
    stat1:"Technology Sectors",stat2:"Flagship Event Concepts",stat3:"Technology Fields",stat4:"Next Event Season",
    galleryTitle:"Gallery",galleryText:"A visual language built around technology, people, ideas and live experiences.",
    contactTitle:"Build your next <span>technology event.</span>",contactText:"Ready to organize an exhibition, conference or innovation summit? Talk to the SWS TECHNOLOGY team.",
    name:"Full Name",email:"Email",company:"Company",subject:"Subject",message:"Message",send:"Send Message →"
  },
  fr: {
    topbar:"Événements technologiques • Algérie & au-delà",brandSub:"Événements technologiques",
    navHome:"Accueil",navSectors:"Secteurs",navProcess:"Notre méthode",navEvents:"Événements",navGallery:"Galerie",navContact:"Contact",
    heroEyebrow:"ÉVÉNEMENTS TECHNOLOGIQUES • ALGÉRIE",heroTitle:"Créons des <em>événements technologiques</em> de référence.",
    heroText:"Expositions, conférences IA, forums industriels et sommets d’innovation qui connectent les leaders technologiques aux opportunités de demain.",
    explore:"Découvrir les événements ↗",contactUs:"Nous contacter",flagship:"ÉVÉNEMENT PHARE",eventTitle:"Technologie & Innovation",
    eventText:"Exposition • Conférence • B2B • Innovation",reserve:"Devenir partenaire →",
    sectionSpeciality:"NOTRE SPÉCIALITÉ",introTitle:"Quand la technologie rencontre <span>l’opportunité.</span>",
    introText:"SWS TECHNOLOGY organise des événements technologiques professionnels dans des secteurs stratégiques, réunissant innovateurs, entreprises, startups, institutions et décideurs.",
    sectorsTitle:"Secteurs technologiques",sectorsText:"Des événements spécialisés autour des technologies qui façonnent l’avenir.",
    s1:"Intelligence Artificielle",s1p:"Conférences IA, machine learning, IA générative et systèmes intelligents.",
    s2:"Industrie 4.0",s2p:"Production intelligente, automatisation et usine numérique.",
    s3:"Robotique",s3p:"Automatisation, robotique et technologies industrielles de nouvelle génération.",
    s4:"Cybersécurité",s4p:"Sécurité du futur, protection cloud et confiance numérique.",
    s5:"Villes intelligentes",s5p:"Mobilité intelligente, villes durables et innovation urbaine.",
    s6:"Transformation digitale",s6p:"Stratégies et technologies qui transforment les organisations.",
    processTitle:"Comment créer des événements réussis",processText:"Du concept initial à la couverture média finale, chaque événement suit une démarche stratégique.",
    p1:"Concept",p1p:"Créer la vision et les objectifs de l’événement.",p2:"Planification",p2p:"Lieu, exposants, intervenants et logistique.",
    p3:"Marketing",p3p:"Campagnes digitales et partenariats médias.",p4:"Inscription",p4p:"Inscription en ligne et gestion des visiteurs.",
    p5:"Jour J",p5p:"Gestion professionnelle et expérience live.",p6:"Couverture média",p6p:"Photo, vidéo et promotion.",
    featureTitle:"Le point de rencontre de la <span>technologie et de l’innovation.</span>",
    featureText:"Une plateforme professionnelle pour connecter exposants, leaders technologiques, startups, institutions et décideurs.",
    partner:"Devenir exposant",locationLabel:"LIEU",impactTitle:"Faire avancer les événements technologiques.",
    stat1:"Secteurs technologiques",stat2:"Concepts d’événements phares",stat3:"Domaines technologiques",stat4:"Prochaine saison",
    galleryTitle:"Galerie",galleryText:"Un univers visuel autour de la technologie, des personnes, des idées et des expériences live.",
    contactTitle:"Construisons votre prochain <span>événement technologique.</span>",contactText:"Prêt à organiser une exposition, une conférence ou un sommet d’innovation ? Contactez l’équipe SWS TECHNOLOGY.",
    name:"Nom complet",email:"E-mail",company:"Entreprise",subject:"Objet",message:"Message",send:"Envoyer le message →"
  }
};

let currentLang = "en";
const langBtn = document.getElementById("langBtn");
function setLanguage(lang){
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if(translations[lang][key] !== undefined) el.innerHTML = translations[lang][key];
  });
  langBtn.textContent = lang === "en" ? "FR" : "EN";
}
langBtn?.addEventListener("click", () => setLanguage(currentLang === "en" ? "fr" : "en"));

document.getElementById("contactForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const subject = encodeURIComponent(data.get("subject") || "SWS Technology enquiry");
  const body = encodeURIComponent(
    `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nCompany: ${data.get("company")}\n\n${data.get("message")}`
  );
  window.location.href = `mailto:sws.technology@macirvoyages.com?subject=${subject}&body=${body}`;
  document.getElementById("formNote").textContent = currentLang === "en"
    ? "Your email application will open with the message prepared."
    : "Votre application e-mail va s’ouvrir avec le message préparé.";
});

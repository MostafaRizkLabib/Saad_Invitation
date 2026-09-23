/**
 * ============================================================================
 * LUXURY WEDDING CONFIGURATION (Saad & Mayada)
 * Edit the values below — everything on the page updates automatically.
 * ============================================================================
 */
const WEDDING_CONFIG = {
  // Couple's names
  groomName: "Saad",
  brideName: "Mayada",

  // Date & time (ISO format — used by the live countdown)
  weddingDate: "2026-10-09T19:30:00", // October 9, 2026, 7:30 PM
  weddingTime: "7:30 PM",

  // Venue & dress code
  venueName: "Kempinski Hall",
  venueAddress: "Grand Ballroom, Main Entrance",
  dressCode: "Formal Chic",
  googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kempinski+Hall", // replace with your venue's exact map link

  // RSVP via WhatsApp — replace with the real number (country code, no + or leading zero)
  whatsappNumber: "201000000000",
  whatsappMessage: "Hello! I would be delighted to confirm my attendance at Saad & Mayada's wedding on October 9, 2026. ❤️",

  // Optional ambient music (leave blank to disable the music button)
  musicUrl: "",

  // Symbolic photos for the couple cards (rings / bouquet, not portraits)
  groomPhoto: "assets/images/wedding-ring-hero.jpg",
  bridePhoto: "assets/images/bridal-bouquet.jpg",

  // Reliable fallback photos, used automatically if the files above aren't found
  defaultGroomFallback: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80",
  defaultBrideFallback: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
  defaultGalleryFallbacks: [
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80", // golden rings
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", // reception table
    "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80", // wedding cake
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", // floral arch
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80", // venue lighting
    "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80", // white florals
    "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80", // crystal decor
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=800&q=80"  // gilded place cards
  ]
};

/* ============================================================================
   ENTRY POINT
   ============================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  setupConfigBindings(WEDDING_CONFIG);
  initCanvasParticles();
  initOpeningTransition();
  initAudioSystem();
  initRealtimeCountdown(WEDDING_CONFIG.weddingDate);
  initIntersectionObserver();
  initDrawerNavigation();
  initLightboxViewer();
});

/**
 * Bind config values and links into the page.
 */
function setupConfigBindings(config) {
  document.querySelectorAll(".config-groom-name").forEach(el => (el.textContent = config.groomName));
  document.querySelectorAll(".config-bride-name").forEach(el => (el.textContent = config.brideName));
  document.querySelectorAll(".config-time").forEach(el => (el.textContent = config.weddingTime));
  document.querySelectorAll(".config-venue-name").forEach(el => (el.textContent = config.venueName));
  document.querySelectorAll(".config-venue-address").forEach(el => (el.textContent = config.venueAddress));
  document.querySelectorAll(".config-dress-code").forEach(el => (el.textContent = config.dressCode));

  const groomImg = document.getElementById("groom-img");
  if (groomImg) {
    groomImg.src = config.groomPhoto;
    groomImg.onerror = () => { groomImg.onerror = null; groomImg.src = config.defaultGroomFallback; };
  }

  const brideImg = document.getElementById("bride-img");
  if (brideImg) {
    brideImg.src = config.bridePhoto;
    brideImg.onerror = () => { brideImg.onerror = null; brideImg.src = config.defaultBrideFallback; };
  }

  document.querySelectorAll(".gallery-item img").forEach((img, i) => {
    if (config.defaultGalleryFallbacks[i]) {
      img.src = config.defaultGalleryFallbacks[i];
    }
  });

  const mapsBtn = document.getElementById("maps-btn");
  if (mapsBtn && config.googleMapsUrl) mapsBtn.href = config.googleMapsUrl;

  const rsvpBtn = document.getElementById("whatsapp-rsvp-btn");
  if (rsvpBtn) {
    const encoded = encodeURIComponent(config.whatsappMessage);
    rsvpBtn.href = `https://wa.me/${config.whatsappNumber}?text=${encoded}`;
  }

  const bgAudio = document.getElementById("bg-audio");
  const musicToggle = document.getElementById("music-toggle");
  if (bgAudio && config.musicUrl) {
    bgAudio.src = config.musicUrl;
  } else if (musicToggle) {
    musicToggle.style.display = "none"; // hide the control when no track is set
  }
}

/**
 * Drifting gold particles on the background canvas.
 */
function initCanvasParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  const count = Math.min(Math.floor(window.innerWidth / 16), 40);
  const particles = [];

  class Sparkle {
    constructor() { this.init(); }
    init() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.size = Math.random() * 2 + 0.8;
      this.speedY = -(Math.random() * 0.4 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.opacity = Math.random() * 0.7 + 0.2;
      this.fade = Math.random() * 0.008 + 0.004;
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fade;
      if (this.y < 0 || this.opacity <= 0) {
        this.init();
        this.y = h + 5;
        this.opacity = Math.random() * 0.7 + 0.3;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(223, 183, 108, ${this.opacity})`;
      ctx.shadowBlur = 6;
      ctx.shadowColor = "#dfb76c";
      ctx.fill();
    }
  }

  for (let i = 0; i < count; i++) particles.push(new Sparkle());

  function render() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(render);
  }
  render();
}

/**
 * Opening curtain transition + optional music start.
 */
function initOpeningTransition() {
  const enterBtn = document.getElementById("enter-btn");
  const screen = document.getElementById("opening-curtain");
  const bgAudio = document.getElementById("bg-audio");
  const musicToggle = document.getElementById("music-toggle");

  if (!enterBtn || !screen) return;

  enterBtn.addEventListener("click", () => {
    screen.classList.add("fade-out");

    if (bgAudio && bgAudio.src) {
      bgAudio.play().then(() => {
        if (musicToggle) musicToggle.classList.add("playing");
      }).catch(() => { /* autoplay may be blocked — the music button still works */ });
    }

    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
  });
}

/**
 * Music on/off toggle.
 */
function initAudioSystem() {
  const toggle = document.getElementById("music-toggle");
  const audio = document.getElementById("bg-audio");
  if (!toggle || !audio) return;

  toggle.addEventListener("click", () => {
    if (!audio.src) return;
    if (audio.paused) {
      audio.play().then(() => toggle.classList.add("playing")).catch(() => {});
    } else {
      audio.pause();
      toggle.classList.remove("playing");
    }
  });
}

/**
 * Live countdown to the wedding date.
 */
function initRealtimeCountdown(targetDateString) {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");
  const clockBox = document.getElementById("countdown-clock");
  const celebrateBox = document.getElementById("countdown-celebration");

  const target = new Date(targetDateString).getTime();

  function update() {
    const diff = target - Date.now();

    if (diff <= 0) {
      if (clockBox) clockBox.classList.add("hidden");
      if (celebrateBox) celebrateBox.classList.remove("hidden");
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);

    if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, "0");
  }

  update();
  const timer = setInterval(update, 1000);
}

/**
 * Fade-in-on-scroll for elements marked .reveal-element.
 */
function initIntersectionObserver() {
  const elements = document.querySelectorAll(".reveal-element");
  if (!("IntersectionObserver" in window)) {
    elements.forEach(el => el.classList.add("is-revealed"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  elements.forEach(el => observer.observe(el));
}

/**
 * Slide-in navigation drawer.
 */
function initDrawerNavigation() {
  const navToggle = document.getElementById("nav-toggle");
  const siteNav = document.getElementById("site-nav");
  const navClose = document.getElementById("nav-close");
  const links = document.querySelectorAll(".nav-link");

  if (!siteNav || !navToggle) return;

  function open() {
    siteNav.classList.add("is-open");
    navToggle.setAttribute("aria-expanded", "true");
  }
  function close() {
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  navToggle.addEventListener("click", open);
  if (navClose) navClose.addEventListener("click", close);
  links.forEach(l => l.addEventListener("click", close));
}

/**
 * Gallery lightbox viewer — click to open, arrow keys, buttons, and swipe to navigate.
 */
function initLightboxViewer() {
  const lightbox = document.getElementById("lightbox");
  const imgElement = document.getElementById("lightbox-current-img");
  const closeBtn = document.getElementById("lightbox-close");
  const prevBtn = document.getElementById("lightbox-prev");
  const nextBtn = document.getElementById("lightbox-next");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (!lightbox || !galleryItems.length) return;

  let currentIndex = 0;

  function getImages() {
    return Array.from(galleryItems).map(item => {
      const img = item.querySelector("img");
      return img ? img.src : "";
    });
  }

  function show(idx) {
    const images = getImages();
    if (idx < 0) idx = images.length - 1;
    if (idx >= images.length) idx = 0;
    currentIndex = idx;
    imgElement.src = images[currentIndex];
  }

  function open(idx) {
    show(idx);
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  galleryItems.forEach((item, index) => item.addEventListener("click", () => open(index)));

  if (closeBtn) closeBtn.addEventListener("click", close);
  if (prevBtn) prevBtn.addEventListener("click", () => show(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => show(currentIndex + 1));

  lightbox.addEventListener("click", e => { if (e.target === lightbox) close(); });

  window.addEventListener("keydown", e => {
    if (!lightbox.classList.contains("active")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(currentIndex - 1);
    if (e.key === "ArrowRight") show(currentIndex + 1);
  });

  let startX = 0;
  lightbox.addEventListener("touchstart", e => { startX = e.changedTouches[0].screenX; }, { passive: true });
  lightbox.addEventListener("touchend", e => {
    const diff = e.changedTouches[0].screenX - startX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) show(currentIndex - 1);
      else show(currentIndex + 1);
    }
  }, { passive: true });
}

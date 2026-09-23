/**
 * SAAD & MAYADA — WEDDING INVITATION
 * All interactive behaviour: opening curtain, navigation, live countdown,
 * scroll reveal animations, and the ambient gold particle canvas.
 */
(function () {
  "use strict";

  /* ---- Opening curtain ---- */
  var curtain = document.getElementById("curtain");
  var enterBtn = document.getElementById("enter");
  if (curtain && enterBtn) {
    enterBtn.addEventListener("click", function () {
      curtain.classList.add("hide");
    });
  }

  /* ---- Slide-in navigation ---- */
  var navToggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
      });
    });
  }

  /* ---- Live countdown to the wedding ---- */
  var target = new Date("2026-10-09T19:30:00").getTime();
  var daysEl = document.getElementById("days");
  var hoursEl = document.getElementById("hours");
  var minutesEl = document.getElementById("minutes");
  var secondsEl = document.getElementById("seconds");
  var countdownSection = document.getElementById("countdown");
  var finishedEl = document.getElementById("finished");
  var timer;

  function tick() {
    var diff = target - Date.now();
    if (diff <= 0) {
      var grid = countdownSection && countdownSection.querySelector(".count-grid");
      if (grid) grid.style.display = "none";
      if (finishedEl) finishedEl.style.display = "block";
      clearInterval(timer);
      return;
    }
    var d = Math.floor(diff / 86400000);
    var h = Math.floor((diff % 86400000) / 3600000);
    var m = Math.floor((diff % 3600000) / 60000);
    var s = Math.floor((diff % 60000) / 1000);
    if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(m).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(s).padStart(2, "0");
  }
  tick();
  timer = setInterval(tick, 1000);

  /* ---- Reveal-on-scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---- Ambient gold particle canvas ---- */
  var canvas = document.getElementById("particles-canvas");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ctx = canvas.getContext("2d");
    var w = (canvas.width = window.innerWidth);
    var h = (canvas.height = window.innerHeight);

    window.addEventListener("resize", function () {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    var count = Math.min(Math.floor(window.innerWidth / 22), 34);
    var particles = [];

    function Sparkle() {
      this.reset();
    }
    Sparkle.prototype.reset = function () {
      this.x = Math.random() * w;
      this.y = h + Math.random() * h * 0.4;
      this.size = Math.random() * 1.8 + 0.6;
      this.speedY = -(Math.random() * 0.35 + 0.12);
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.opacity = Math.random() * 0.6 + 0.15;
      this.fade = Math.random() * 0.006 + 0.003;
    };
    Sparkle.prototype.update = function () {
      this.y += this.speedY;
      this.x += this.speedX;
      this.opacity -= this.fade;
      if (this.y < -10 || this.opacity <= 0) this.reset();
    };
    Sparkle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(202, 162, 98, " + this.opacity + ")";
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#caa262";
      ctx.fill();
    };

    for (var i = 0; i < count; i++) particles.push(new Sparkle());

    function render() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(function (p) {
        p.update();
        p.draw();
      });
      requestAnimationFrame(render);
    }
    render();
  }
})();

/* VanishCam showcase — interactions (vanilla JS, no dependencies) */
(() => {
  'use strict';

  // ---------- sticky nav ----------
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- mobile menu ----------
  const burger = document.getElementById('burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // ---------- reveal on scroll ----------
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 })
    : null;
  document.querySelectorAll('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('visible')));

  // ---------- active nav link ----------
  const sections = ['demo', 'features', 'how', 'install', 'faq']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const navA = Array.from(document.querySelectorAll('.nav-links a'));
  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        navA.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  // ---------- video placeholders: hide the <video> until a file exists ----------
  document.querySelectorAll('[data-video-slot]').forEach((slot) => {
    const video = slot.querySelector('video');
    if (!video) return;
    const missing = () => slot.classList.add('missing');
    const source = video.querySelector('source');
    if (source) {
      source.addEventListener('error', missing);
      // probe: if the file 404s, source error fires after load attempt
      video.addEventListener('loadedmetadata', () => slot.classList.remove('missing'));
      video.load();
    } else {
      missing();
    }
  });

  // ---------- hero particle field (the vanish effect, mini version) ----------
  const canvas = document.getElementById('particles');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let w, h, dpr, parts = [], raf;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const make = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2.2 + 0.6,
      vx: 0.12 + Math.random() * 0.35,
      vy: -0.06 - Math.random() * 0.25,
      a: Math.random() * 0.55 + 0.15,
      hue: Math.random() < 0.25 ? 255 : 252
    });

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.a += (Math.random() - 0.5) * 0.02;
        if (p.x > w + 10 || p.y < -10) Object.assign(p, make(), { x: -6, y: h * (0.3 + Math.random() * 0.7) });
        ctx.beginPath();
        ctx.fillStyle = p.hue === 255
          ? `rgba(230,225,255,${p.a})`
          : `rgba(167,139,250,${p.a})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      resize();
      const count = Math.round((w * h) / 26000);
      parts = Array.from({ length: Math.max(30, Math.min(120, count)) }, make);
      if (!reduced) loop();
      else { ctx.clearRect(0, 0, w, h); }
    };

    let t;
    window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(start, 150); });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduced) loop();
    });
    start();
  }
})();

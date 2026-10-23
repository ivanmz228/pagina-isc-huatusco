// Animaciones progresivas: se respeta la preferencia de movimiento reducido.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches) return;
  const pending = new Set();
  let observer;
  const reset = () => {
    observer?.disconnect();
    pending.forEach(el => el.classList.remove('reveal-pending'));
    pending.clear();
  };
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-visible');
        pending.delete(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.06 });
    document.querySelectorAll('.hero-copy > *, .facts > div, .section h2, .prose, .project-photo, .campus, .courses li, .checks li, .support article, .plan, .awards article, .details > *, .tags span').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const siblings = [...el.parentElement.children];
      el.style.setProperty('--reveal-delay', `${Math.min(siblings.indexOf(el), 4) * 65}ms`);
      el.classList.add('reveal-pending');
      pending.add(el);
      observer.observe(el);
    });
  }
  motion.addEventListener('change', event => { if (event.matches) reset(); });
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('pointerdown', event => {
      if (motion.matches) return;
      const bounds = button.getBoundingClientRect();
      const wave = document.createElement('span');
      wave.className = 'button-wave';
      wave.setAttribute('aria-hidden', 'true');
      wave.style.left = `${event.clientX - bounds.left}px`;
      wave.style.top = `${event.clientY - bounds.top}px`;
      button.append(wave);
      wave.addEventListener('animationend', () => wave.remove(), { once: true });
    });
  });
})();

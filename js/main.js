const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const siteNav = document.getElementById('siteNav');
const year = document.getElementById('year');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const preloader = document.getElementById('preloader');
const loadPercent = document.getElementById('loadPercent');
const cursor = document.getElementById('cursor');

let loaded = 0;
const loadingTimer = setInterval(() => {
  loaded = Math.min(loaded + Math.ceil(Math.random() * 12), 96);
  loadPercent.textContent = `${String(loaded).padStart(2, '0')}%`;
}, 55);

window.addEventListener('load', () => {
  clearInterval(loadingTimer);
  loadPercent.textContent = '100%';
  setTimeout(() => preloader.classList.add('is-hidden'), 280);
});

year.textContent = new Date().getFullYear();

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

const closeMenu = () => {
  menuToggle.setAttribute('aria-expanded', 'false');
  siteNav.classList.remove('open');
  header.classList.remove('menu-active');
  document.body.classList.remove('menu-open');
  menuToggle.querySelector('.menu-label').textContent = 'Menú';
};

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';

  if (isOpen) {
    closeMenu();
    return;
  }

  menuToggle.setAttribute('aria-expanded', 'true');
  menuToggle.querySelector('.menu-label').textContent = 'Cerrar';
  siteNav.classList.add('open');
  header.classList.add('menu-active');
  document.body.classList.add('menu-open');
});

siteNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

document.querySelectorAll('[data-lightbox]').forEach(work => {
  work.addEventListener('click', () => {
    lightboxImage.src = work.dataset.lightbox;
    lightboxImage.alt = work.querySelector('img').alt;
    lightboxCaption.textContent = work.dataset.caption;
    lightbox.showModal();
    document.body.classList.add('lightbox-open');
  });
});

const closeLightbox = () => {
  lightbox.close();
  lightboxImage.src = '';
  document.body.classList.remove('lightbox-open');
};

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener('close', () => {
  document.body.classList.remove('lightbox-open');
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });

document.querySelectorAll('.intro, .work, .process-card').forEach(element => {
  revealObserver.observe(element);
});

if (window.matchMedia('(pointer: fine)').matches) {
  let cursorX = 0;
  let cursorY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener('mousemove', event => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    cursor.classList.add('visible');
  });

  const renderCursor = () => {
    currentX += (cursorX - currentX) * 0.22;
    currentY += (cursorY - currentY) * 0.22;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(renderCursor);
  };

  renderCursor();

  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    element.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));

    element.addEventListener('mousemove', event => {
      if (element.classList.contains('work')) return;
      const bounds = element.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
    });
  });

  document.querySelectorAll('.work').forEach(work => {
    work.addEventListener('mouseenter', () => cursor.classList.add('viewing'));
    work.addEventListener('mouseleave', () => cursor.classList.remove('viewing'));
  });
}

document.querySelectorAll('a, button').forEach(element => {
  element.addEventListener('pointerdown', event => {
    const ripple = document.createElement('span');
    ripple.className = 'click-ripple';
    ripple.style.left = `${event.clientX}px`;
    ripple.style.top = `${event.clientY}px`;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const heroMedia = document.querySelector('.hero-media');
  const featureImage = document.querySelector('.feature > img');
  let ticking = false;

  const updateParallax = () => {
    const scrollY = window.scrollY;
    heroMedia.style.transform = `translate3d(0, ${scrollY * 0.14}px, 0)`;

    const feature = featureImage.parentElement.getBoundingClientRect();
    if (feature.bottom > 0 && feature.top < window.innerHeight) {
      featureImage.style.transform = `scale(1.06) translate3d(0, ${feature.top * -0.035}px, 0)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(updateParallax);
    ticking = true;
  }, { passive: true });
}

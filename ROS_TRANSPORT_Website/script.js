'use strict';

// Gallery filtering. Add a new .gallery-item in index.html to extend the permanent gallery.
const filters = Array.from(document.querySelectorAll('.gallery-filter'));
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
filters.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach((b) => {
      const active = b === button;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    galleryItems.forEach((item) => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
  });
});

// Expand pictures, poster and technical diagrams without a server or library.
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');
let lastFocused = null;
function openLightbox(item) {
  lastFocused = document.activeElement;
  const source = item.dataset.full || item.querySelector('img')?.getAttribute('src');
  if (!source) return;
  lightboxImage.src = source;
  lightboxImage.alt = item.querySelector('img')?.alt || item.dataset.title || 'รูปภาพโครงงาน';
  lightboxCaption.textContent = item.dataset.title || '';
  lightbox.classList.add('visible');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  lightboxClose.focus();
}
function closeLightbox() {
  lightbox.classList.remove('visible');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  lightboxImage.removeAttribute('src');
  if (lastFocused?.focus) lastFocused.focus();
}
document.querySelectorAll('.image-action').forEach((item) => {
  item.addEventListener('click', () => openLightbox(item));
  item.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openLightbox(item); }
  });
});
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.classList.contains('visible')) closeLightbox(); });

// Subtle progressive reveal; content stays visible in browsers without IntersectionObserver.
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px 60px 0px', threshold: 0.05 });
  document.querySelectorAll('.section-reveal').forEach((section) => { section.classList.add('will-reveal'); observer.observe(section); });
}


// Restore the interactive Hardware / Software component tabs.
const componentTabs = Array.from(document.querySelectorAll('[data-component-tab]'));
function selectComponentTab(chosen, focus = false) {
  componentTabs.forEach((button) => {
    const selected = button === chosen;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    if (panel) panel.hidden = !selected;
  });
  if (focus) chosen.focus();
}
componentTabs.forEach((button, index) => {
  button.addEventListener('click', () => selectComponentTab(button));
  button.addEventListener('keydown', (event) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % componentTabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + componentTabs.length) % componentTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = componentTabs.length - 1;
    else return;
    event.preventDefault();
    selectComponentTab(componentTabs[next], true);
  });
});

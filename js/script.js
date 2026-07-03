const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));
}

const sections = [...document.querySelectorAll('main section[id], header[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0.01 });
sections.forEach(section => observer.observe(section));


// v5.0 lightbox for real project galleries
const galleryImages = [...document.querySelectorAll('.gallery-thumb img')];
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = `
  <button class="lightbox-close" type="button" aria-label="Close gallery">×</button>
  <button class="lightbox-prev" type="button" aria-label="Previous photo">‹</button>
  <img alt="">
  <button class="lightbox-next" type="button" aria-label="Next photo">›</button>
`;
document.body.appendChild(lightbox);

let currentGallery = [];
let currentIndex = 0;
const lbImg = lightbox.querySelector('img');

function openLightbox(img){
  const block = img.closest('.gallery-block');
  currentGallery = [...block.querySelectorAll('.gallery-thumb img')];
  currentIndex = currentGallery.indexOf(img);
  lbImg.src = img.src;
  lbImg.alt = img.alt;
  lightbox.classList.add('open');
}
function moveLightbox(direction){
  if (!currentGallery.length) return;
  currentIndex = (currentIndex + direction + currentGallery.length) % currentGallery.length;
  lbImg.src = currentGallery[currentIndex].src;
  lbImg.alt = currentGallery[currentIndex].alt;
}

galleryImages.forEach(img => img.addEventListener('click', () => openLightbox(img)));
lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => moveLightbox(-1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => moveLightbox(1));
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.classList.remove('open');
});
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') lightbox.classList.remove('open');
  if (e.key === 'ArrowLeft') moveLightbox(-1);
  if (e.key === 'ArrowRight') moveLightbox(1);
});


// Professional no-redirect estimate form submission
const estimateForm = document.getElementById('estimate-form');
const formSuccess = document.getElementById('form-success');
const formError = document.getElementById('form-error');

if (estimateForm) {
  estimateForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    formSuccess?.classList.remove('show');
    formError?.classList.remove('show');
    estimateForm.classList.add('sending');

    const submitButton = estimateForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton ? submitButton.textContent : '';
    if (submitButton) submitButton.textContent = 'Sending...';

    try {
      const response = await fetch(estimateForm.action, {
        method: 'POST',
        body: new FormData(estimateForm),
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error('Form submission failed');

      estimateForm.reset();
      formSuccess?.classList.add('show');
    } catch (error) {
      formError?.classList.add('show');
    } finally {
      estimateForm.classList.remove('sending');
      if (submitButton) submitButton.textContent = originalButtonText || 'Send Request';
    }
  });
}

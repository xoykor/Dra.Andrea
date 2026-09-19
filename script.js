const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('#navigation');
const navLinks = [...navigation.querySelectorAll('a')];
const progress = document.querySelector('.page-progress span');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// Coloque aqui o número real do WhatsApp, somente com dígitos.
// Exemplo para Brasil: 5584999999999
const WHATSAPP_NUMBER = '5584988089777';

function buildWhatsAppUrl(message = '') {
  const base = `https://web.whatsapp.com/send?phone=${WHATSAPP_NUMBER}`;
  return message ? `${base}&text=${encodeURIComponent(message)}` : base;
}

function openWhatsApp(message = '') {
  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    alert('Configure o número real do WhatsApp no arquivo script.js antes de publicar.');
    return;
  }

  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
}

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  navigation.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

menuButton.addEventListener('click', () => {
  setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
});

navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 980) setMenu(false);
}, { passive: true });

function updateScrollUI() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = max > 0 ? Math.min(1, y / max) : 0;

  header.classList.toggle('is-scrolled', y > 28);
  progress.style.transform = `scaleX(${ratio})`;
}

updateScrollUI();
window.addEventListener('scroll', updateScrollUI, { passive: true });

if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.13,
    rootMargin: '0px 0px -5% 0px'
  });

  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
}

if (!reducedMotion && finePointer) {
  const portrait = document.querySelector('[data-parallax]');

  if (portrait) {
    const reset = () => {
      portrait.style.transform = '';
    };

    portrait.addEventListener('pointermove', event => {
      const rect = portrait.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      portrait.style.transform =
        `perspective(1100px) rotateY(${x * 2.3}deg) rotateX(${y * -2.3}deg) translate3d(0,0,0)`;
    });

    portrait.addEventListener('pointerleave', reset);
  }
}

document.querySelectorAll('[data-whatsapp]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();

    openWhatsApp(
      'Olá, Dra. Andrea. Gostaria de solicitar informações sobre atendimento jurídico.'
    );
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();

  const form = event.currentTarget;
  const data = new FormData(form);

  const nome = String(data.get('nome') || '').trim();
  const email = String(data.get('email') || '').trim();
  const telefone = String(data.get('telefone') || '').trim();
  const mensagem = String(data.get('mensagem') || '').trim();

  const whatsappMessage = [
    'Olá, Dra. Andrea.',
    '',
    'Gostaria de solicitar informações sobre atendimento jurídico.',
    '',
    `Nome: ${nome}`,
    `E-mail: ${email}`,
    telefone ? `Telefone: ${telefone}` : null,
    `Assunto: ${mensagem}`
  ].filter(Boolean).join('\n');

  openWhatsApp(whatsappMessage);
});
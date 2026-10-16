document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Menu Toggle + Close on Outside Click / Escape
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.setAttribute('aria-expanded', 'false');

    const closeMenu = () => {
      navLinks.classList.remove('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    };

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // Destaque do link ativo conforme a seção visível
  const sectionLinks = navLinks ? [...navLinks.querySelectorAll('a[href^="#"]')] : [];
  if ('IntersectionObserver' in window && sectionLinks.length) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sectionLinks.forEach(a => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) spy.observe(target);
    });
  }

  // Ocultar botão flutuante do WhatsApp quando a seção #contato estiver visível (evita sobreposição no mobile)
  const whatsappFloat = document.querySelector('.whatsapp-float');
  const contatoSection = document.getElementById('contato');
  if ('IntersectionObserver' in window && whatsappFloat && contatoSection) {
    const floatObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        whatsappFloat.classList.toggle('is-hidden', entry.isIntersecting);
      });
    }, { threshold: 0.15 });
    floatObserver.observe(contatoSection);
  }

  // Revelar elementos ao rolar
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js-reveal');
    const revealSelector = '.section-header, .pillar-card, .timeline-card, .person-card, .brand-card, .process-step, .about-grid > *, .cta-box';
    const reveal = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    document.querySelectorAll(revealSelector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${(i % 4) * 70}ms`);
      reveal.observe(el);
    });
  }

  // Filter Tabs for "Pessoas que Somei" (Brasil vs EUA)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const personCards = document.querySelectorAll('.person-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const region = btn.getAttribute('data-filter');
      personCards.forEach(card => {
        if (region === 'all' || card.getAttribute('data-region') === region) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Interactive WhatsApp Objective Selector
  const objectiveOptions = document.querySelectorAll('.objective-option');
  const whatsappDynamicBtn = document.getElementById('whatsappDynamicBtn');
  const phone = '5565993068512';

  objectiveOptions.forEach(option => {
    option.addEventListener('click', () => {
      objectiveOptions.forEach(o => o.classList.remove('selected'));
      option.classList.add('selected');

      const message = option.getAttribute('data-msg');
      if (whatsappDynamicBtn && message) {
        whatsappDynamicBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      }
    });
  });
});

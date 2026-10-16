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
  });

  // Mobile Menu Toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
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

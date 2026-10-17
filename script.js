(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  /* ---------- menu mobile ---------- */
  const toggle = $('#navToggle');
  const links = $('#navLinks');
  const nav = $('#nav');
  const closeMenu = () => {
    links.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
  };
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  $$('a', links).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', e => { if (!nav.contains(e.target)) closeMenu(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

  /* ---------- régua: playhead acompanha a rolagem ---------- */
  const head = $('#rulerHead');
  const played = $('#rulerPlayed');
  const ticksBox = $('#rulerTicks');
  const sections = $$('[data-tick]');

  const placeTicks = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    ticksBox.innerHTML = '';
    sections.forEach(sec => {
      const t = document.createElement('span');
      t.className = 'ruler__tick';
      t.style.left = `${Math.min(100, (sec.offsetTop / max) * 100)}%`;
      ticksBox.appendChild(t);
    });
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      const w = head.parentElement.clientWidth;
      head.style.transform = `translateX(${p * w}px)`;
      played.style.width = `${p * 100}%`;
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { placeTicks(); onScroll(); });
  addEventListener('load', () => { placeTicks(); onScroll(); });
  placeTicks(); onScroll();

  /* link ativo no menu */
  if (hasIO) {
    const navLinks = $$('a[href^="#"]', links);
    const spy = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(a => {
          if (a.getAttribute('href') === `#${entry.target.id}`) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(a => { const t = $(a.getAttribute('href')); if (t) spy.observe(t); });
  }

  /* ---------- timecode do visor (24 fps) ---------- */
  const tc = $('#timecode');
  if (tc && !reduceMotion) {
    const pad = n => String(n).padStart(2, '0');
    const start = performance.now();
    let last = -1;
    const tick = now => {
      const frames = Math.floor(((now - start) / 1000) * 24);
      if (frames !== last) {
        last = frames;
        const f = frames % 24, s = Math.floor(frames / 24) % 60, m = Math.floor(frames / 1440) % 60, h = Math.floor(frames / 86400);
        tc.textContent = `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- entradas: títulos (wipe) ---------- */
  const animated = $$('.cut-in');
  if (hasIO && !reduceMotion) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    animated.forEach(el => io.observe(el));
  } else {
    animated.forEach(el => el.classList.add('is-in'));
  }

  /* ---------- faixas V1/V2/A1 (abas acessíveis) ---------- */
  const tabs = $$('.track');
  const select = (tab, focus) => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', e => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) { e.preventDefault(); select(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true); }
      if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });

  /* ---------- rolo de filme: setas + arrastar com o mouse ---------- */
  const film = $('#filmTrack');
  const prev = $('#stripPrev');
  const next = $('#stripNext');
  const step = () => (film.querySelector('.frame')?.getBoundingClientRect().width || 280) * 2;
  const updateArrows = () => {
    prev.disabled = film.scrollLeft < 8;
    next.disabled = film.scrollLeft + film.clientWidth > film.scrollWidth - 8;
  };
  prev.addEventListener('click', () => film.scrollBy({ left: -step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  next.addEventListener('click', () => film.scrollBy({ left: step(), behavior: reduceMotion ? 'auto' : 'smooth' }));
  film.addEventListener('scroll', updateArrows, { passive: true });
  addEventListener('resize', updateArrows);
  updateArrows();

  let drag = null;
  film.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, left: film.scrollLeft, moved: false };
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 5) { drag.moved = true; film.classList.add('is-dragging'); }
    if (drag.moved) film.scrollLeft = drag.left - dx;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    if (drag.moved) {
      film.classList.remove('is-dragging');
      // encaixa no frame mais próximo
      const w = film.querySelector('.frame').getBoundingClientRect().width;
      film.scrollTo({ left: Math.round(film.scrollLeft / w) * w, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
    drag = null;
  });

  /* ---------- filtro de pessoas ---------- */
  const filterBtns = $$('.filter__btn');
  const people = $$('.person');
  filterBtns.forEach(btn => btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    const f = btn.dataset.filter;
    people.forEach(p => {
      const show = f === 'all' || p.dataset.region === f;
      p.hidden = !show;
      p.classList.remove('is-showing');
      if (show) { void p.offsetWidth; p.classList.add('is-showing'); }
    });
    placeTicks();
  }));

  /* ---------- marcas: duplica as linhas para o loop sem emenda ---------- */
  const reel = $('#reel');
  if (reel && !reduceMotion) {
    $$('.reel__row', reel).forEach(row => {
      [...row.children].forEach(li => {
        const c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        row.appendChild(c);
      });
      row.style.setProperty('--dur', `${row.children.length * 3.2}s`);
    });
    reel.classList.add('is-running');
  }

  /* ---------- contato: mensagem do WhatsApp conforme a escolha ---------- */
  const waPick = $('#waPick');
  $$('input[name="foco"]').forEach(r => r.addEventListener('change', () => {
    waPick.href = `https://wa.me/5565993068512?text=${encodeURIComponent(r.value)}`;
  }));

  /* ---------- esconde o botão flutuante na seção de contato ---------- */
  const waFloat = $('#waFloat');
  const contato = $('#contato');
  if (hasIO && waFloat && contato) {
    new IntersectionObserver(([e]) => waFloat.classList.toggle('is-hidden', e.isIntersecting), { threshold: 0.2 }).observe(contato);
  }
})();

(function () {
  const hero = document.querySelector('.hero');
  const brand = document.querySelector('.brand');
  const menu = document.getElementById('menu');
  const burger = document.querySelector('.brand__menu');
  const backdrop = document.querySelector('.menu-backdrop');
  const interactiveElements = menu ? menu.querySelectorAll('a, button') : [];

  function updatePillWidth() {
    if (brand && menu) {
      const width = brand.offsetWidth;
      menu.style.setProperty('--pill-w', width + 'px');
    }
  }

  updatePillWidth();
  window.addEventListener('load', updatePillWidth);
  window.addEventListener('resize', updatePillWidth);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updatePillWidth);
  }

  interactiveElements.forEach((el) => {
    el.tabIndex = -1;
  });

  function setMenuOpen(open) {
    if (!hero || !burger) return;
    if (open) {
      updatePillWidth();
      hero.classList.add('is-menu-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      interactiveElements.forEach((el) => {
        el.tabIndex = 0;
      });
    } else {
      hero.classList.remove('is-menu-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      interactiveElements.forEach((el) => {
        el.tabIndex = -1;
      });
    }
  }

  if (burger) {
    burger.addEventListener('click', () => {
      const isOpen = hero.classList.contains('is-menu-open');
      setMenuOpen(!isOpen);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => setMenuOpen(false));
  }

  if (menu) {
    menu.querySelectorAll('.menu__link').forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hero && hero.classList.contains('is-menu-open')) {
      setMenuOpen(false);
      if (burger) burger.focus();
    }
  });
})();

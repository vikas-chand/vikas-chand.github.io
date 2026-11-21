(() => {
  const bar = document.querySelector('.masthead');
  const navigation = document.getElementById('navigation');
  const button = document.getElementById('menu-button');
  const main = document.getElementById('main');
  const mobile = window.matchMedia('(max-width: 860px)');
  const links = Array.from(navigation.querySelectorAll('a'));
  const sections = links.map(link => document.querySelector(link.hash));

  function setMenu(open) {
    document.body.classList.toggle('menu-open', open);
    main.inert = open;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) links[0].focus();
  }

  function updateBar() {
    bar.classList.toggle('scrolled', window.scrollY > 24);
    const active = sections.filter(section => section.getBoundingClientRect().top <= 130)
      .sort((a, b) => b.getBoundingClientRect().top - a.getBoundingClientRect().top)[0];
    for (const link of links) {
      if (active && link.hash.slice(1) === active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  bar.classList.add('enhanced');
  button.hidden = false;
  button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') === 'false'));
  bar.addEventListener('click', event => {
    if (event.target.closest('a') && document.body.classList.contains('menu-open')) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
      setMenu(false);
      button.focus();
    }
  });
  mobile.addEventListener('change', () => setMenu(false));
  window.addEventListener('scroll', updateBar, { passive: true });
  window.addEventListener('pageshow', updateBar);
  updateBar();
})();

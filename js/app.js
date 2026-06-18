
(function(){
  const routes = {
    home: 'pages/home.html',
    about: 'pages/about.html',
    schedule: 'pages/schedule.html',
    images: 'pages/images.html',
    member: 'pages/member.html',
    contact: 'pages/contact.html'
  };

  const contentEl = document.getElementById('content');
  const navLinks = Array.from(document.querySelectorAll('nav.primary-nav a'));

  function setActive(route){
    navLinks.forEach(a => {
      const isActive = a.dataset.route === route;
      a.classList.toggle('active', isActive);
      if (isActive) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
    });
  }

  async function loadIncludes(){
    const includes = contentEl.querySelectorAll('[data-include]');
    for(const el of includes){
      try{
        const src = el.getAttribute('data-include');
        const res = await fetch(src, { cache: 'no-store' });
        if(res.ok){
          const html = await res.text();
          el.innerHTML = html;
        }
      }catch(err){
        console.error('Failed to load include:', err);
      }
    }
  }

  function executeScripts(container){
    container.querySelectorAll('script').forEach(old => {
      const s = document.createElement('script');
      s.textContent = old.textContent;
      old.replaceWith(s);
    });
  }

  async function loadRoute(route){
    if(!routes[route]){ route = 'home'; }
    setActive(route);
    try{
      const res = await fetch(routes[route], { cache: 'no-store' });
      if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const html = await res.text();
      contentEl.innerHTML = html;
      executeScripts(contentEl);
      await loadIncludes();
      const h1 = contentEl.querySelector('h1');
      if(h1){ h1.setAttribute('tabindex','-1'); h1.focus(); }
    }catch(err){
      contentEl.innerHTML = `<p role="alert">Sorry, failed to load content. (${err.message})</p>`;
    }
  }

  function handleHash(){
    const route = (location.hash || '#home').replace('#','');
    loadRoute(route);
  }

  // Hamburger menu
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('#primary-nav');

  function closeNav(){
    primaryNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Öppna meny');
  }

  if(navToggle){
    navToggle.addEventListener('click', () => {
      const isOpen = primaryNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Stäng meny' : 'Öppna meny');
    });
    document.addEventListener('click', e => {
      if(primaryNav.classList.contains('open') && !navToggle.contains(e.target) && !primaryNav.contains(e.target)){
        closeNav();
      }
    });
  }

  // Close mobile nav on link click; allow hash change to proceed
  navLinks.forEach(a => a.addEventListener('click', () => {
    if(navToggle) closeNav();
  }));

  window.addEventListener('hashchange', handleHash);
  document.addEventListener('DOMContentLoaded', () => {
    handleHash();
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  });
})();

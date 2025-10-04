
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

  async function loadRoute(route){
    if(!routes[route]){ route = 'home'; }
    setActive(route);
    try{
      const res = await fetch(routes[route], { cache: 'no-store' });
      if(!res.ok) throw new Error(res.status + ' ' + res.statusText);
      const html = await res.text();
      contentEl.innerHTML = html;
      // focus first heading for accessibility
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

  // Intercept nav clicks (optional — hash will trigger anyway)
  navLinks.forEach(a => a.addEventListener('click', e => {
    // Allow default (hash change) to occur; nothing else needed
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

/* Menu enhancements. The menu still works without this file (CSS checkbox),
   this adds keyboard support, correct ARIA state and touch-friendly dropdowns. */
(function () {
  var toggle = document.getElementById('nav-toggle');
  var label = document.querySelector('.nav-toggle-label');
  var nav = document.getElementById('site-nav');
  if (!toggle || !label || !nav) return;

  function sync() {
    label.setAttribute('aria-expanded', toggle.checked ? 'true' : 'false');
    label.setAttribute('aria-label', toggle.checked ? 'Close menu' : 'Open menu');
  }
  function closeDropdowns(except) {
    nav.querySelectorAll('.has-dropdown.open').forEach(function (d) {
      if (d === except) return;
      d.classList.remove('open');
      d.firstElementChild.setAttribute('aria-expanded', 'false');
    });
  }

  toggle.addEventListener('change', sync);
  label.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle.checked = !toggle.checked;
      sync();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (toggle.checked) { toggle.checked = false; sync(); label.focus(); }
    var open = nav.querySelector('.has-dropdown.open, .has-dropdown:focus-within');
    closeDropdowns();
    if (open && document.activeElement && open.contains(document.activeElement)) {
      open.firstElementChild.focus();
      open.classList.add('dismissed');
    }
  });

  // Touch screens wide enough for the desktop menu: first tap opens the dropdown.
  var wideTouch = window.matchMedia('(hover: none) and (min-width: 901px)');
  nav.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    var item = link.parentElement;
    item.addEventListener('mouseleave', function () { item.classList.remove('dismissed'); });
    link.addEventListener('click', function (e) {
      if (!wideTouch.matches) return;
      if (!item.classList.contains('open')) {
        e.preventDefault();
        closeDropdowns(item);
        item.classList.add('open');
        link.setAttribute('aria-expanded', 'true');
      }
    });
  });
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target)) closeDropdowns();
  });

  // Browsers restore form state on Back; make sure the menu starts closed.
  window.addEventListener('pageshow', function () { toggle.checked = false; sync(); closeDropdowns(); });
  sync();
})();

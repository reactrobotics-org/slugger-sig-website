/* Collapsed navigation for narrow viewports.
 *
 * Progressive enhancement: the `js` class is set in <head> so the collapsed
 * bar is styled from first paint. With scripting off the class never lands,
 * the toggle stays display:none, and .side-nav renders as the always-visible
 * scrolling strip — navigation still works, it just does not collapse.
 *
 * The desktop rail (>1080px) is untouched: every rule this drives lives inside
 * the max-width:1080px block in site.css.
 */
(function () {
  var sidebar = document.querySelector('.sidebar');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!sidebar || !toggle || !nav) return;

  function setOpen(open) {
    sidebar.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  toggle.addEventListener('click', function () {
    setOpen(!sidebar.classList.contains('is-open'));
  });

  // Tapping the page, or Escape, dismisses it the way a menu should.
  document.addEventListener('click', function (e) {
    if (!sidebar.contains(e.target)) setOpen(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Widening back to the rail must not strand `is-open`, which would leave the
  // desktop nav carrying a state class it has no styles for.
  var wide = window.matchMedia('(min-width: 1081px)');
  var onChange = function (e) { if (e.matches) setOpen(false); };
  if (wide.addEventListener) wide.addEventListener('change', onChange);
  else if (wide.addListener) wide.addListener(onChange);
})();

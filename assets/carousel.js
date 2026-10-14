/* Sponsor carousel: a CSS 3D drum.
 *
 * Faces are spaced evenly around a cylinder, each pushed out along Z by the
 * radius that makes their edges meet, and the whole drum is rotated to bring a
 * face to the front. Geometry is computed here rather than hard-coded so that
 * adding or removing a sponsor needs no CSS: radius and face angle both fall
 * out of the slide count.
 *
 * Progressive enhancement, and deliberately fail-safe: the markup renders the
 * sponsors as a plain row, and this script opts into the drum by adding
 * `is-carousel`. If it 404s or throws, every sponsor is still on screen, which
 * is the outcome a sponsor actually cares about.
 *
 * There are no visible controls by request, so rotation holding on hover and
 * on keyboard focus is the only mechanism to stop the motion (WCAG 2.2.2).
 * The carousel carries tabindex=0 so that focus route exists at all.
 */
(function () {
  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var drum = root.querySelector('[data-carousel-drum]');
  var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel-slide'));
  // Fewer than three faces is not a drum; the flat row says more.
  if (!drum || slides.length < 3) return;

  var stage = root.querySelector('.carousel-stage');

  var count = slides.length;
  var step = 360 / count;
  var INTERVAL = 4500;
  var angle = 0;            // accumulates, so the drum never unwinds backwards
  var radius = 0;
  var timer = null;

  function activeIndex() {
    return ((Math.round(-angle / step) % count) + count) % count;
  }

  function layout() {
    // Panel width tracks the stage so the drum never outgrows the column, and
    // the radius is the one that makes neighbouring faces just touch.
    var avail = stage.clientWidth || 600;
    var panel = Math.max(170, Math.min(300, Math.round(avail * 0.42)));
    radius = Math.round((panel / 2) / Math.tan(Math.PI / count));
    drum.style.setProperty('--panel-w', panel + 'px');
    slides.forEach(function (slide, i) {
      slide.style.transform = 'rotateY(' + (i * step) + 'deg) translateZ(' + radius + 'px)';
    });
    render();
  }

  function render() {
    // Pulling the drum back by the radius leaves the front face sitting on the
    // perspective plane, so the presented logo is never scaled by depth.
    drum.style.transform = 'translateZ(' + (-radius) + 'px) rotateY(' + angle + 'deg)';
    var active = activeIndex();
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === active); });
  }

  function go(delta) { angle -= delta * step; render(); }

  function run() { if (!timer) timer = setInterval(function () { go(1); }, INTERVAL); }
  function halt() { if (timer) { clearInterval(timer); timer = null; } }

  // There are no visible controls, so hover and focus carry the whole job of
  // stopping the motion: point at a logo and it holds, tab to the carousel and
  // it holds while arrow keys step through it.
  root.addEventListener('mouseenter', halt);
  root.addEventListener('mouseleave', run);
  root.addEventListener('focusin', halt);
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) run(); });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { go(1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); }
  });

  // A backgrounded tab should not bank up queued advances.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) halt(); else run();
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });

  root.classList.add('is-carousel');
  layout();
  run();
})();

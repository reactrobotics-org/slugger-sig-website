/* Sponsor carousel.
 *
 * Progressive enhancement, and deliberately fail-safe: the markup renders every
 * sponsor side by side, and this script only switches to one-at-a-time by adding
 * `is-carousel`. If the file 404s or throws, visitors still see every sponsor,
 * which is the outcome a sponsor actually cares about. The controls are shown by
 * CSS off that same class, so they can never appear without this script running.
 *
 * On prefers-reduced-motion the carousel still rotates, but site.css drops the
 * cross-fade so slides cut rather than animate. That preference is about
 * animation; auto-advancing content is instead covered by WCAG 2.2.2 (Pause,
 * Stop, Hide), which the Pause control satisfies. Rotation also holds on hover
 * and on keyboard focus.
 */
(function () {
  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel-slide'));
  // One sponsor is not a carousel. Leave the static row alone.
  if (slides.length < 2) return;

  var dotsWrap = root.querySelector('[data-carousel-dots]');
  var pauseBtn = root.querySelector('[data-carousel-pause]');

  var INTERVAL = 4500;
  var index = 0;
  var timer = null;
  var userPaused = false;
  var dots = [];

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
    dots.forEach(function (d, n) { d.setAttribute('aria-current', n === index ? 'true' : 'false'); });
  }

  function run() { if (!timer && !userPaused) timer = setInterval(function () { show(index + 1); }, INTERVAL); }
  function halt() { if (timer) { clearInterval(timer); timer = null; } }

  function setPaused(paused) {
    userPaused = paused;
    if (paused) halt(); else run();
    if (pauseBtn) {
      pauseBtn.textContent = paused ? 'Play' : 'Pause';
      pauseBtn.setAttribute('aria-label', paused ? 'Resume sponsor rotation' : 'Pause sponsor rotation');
    }
  }

  slides.forEach(function (slide, i) {
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', 'Show sponsor ' + (i + 1) + ' of ' + slides.length);
    dot.addEventListener('click', function () { show(i); });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  if (pauseBtn) pauseBtn.addEventListener('click', function () { setPaused(!userPaused); });

  // Hovering or tabbing in holds the current sponsor without flipping the
  // button, so an explicit pause survives a stray mouse.
  root.addEventListener('mouseenter', halt);
  root.addEventListener('mouseleave', run);
  root.addEventListener('focusin', halt);
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) run(); });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { show(index + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { show(index - 1); e.preventDefault(); }
  });

  // A backgrounded tab should not bank up queued advances.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) halt(); else run();
  });

  root.classList.add('is-carousel');
  show(0);
  setPaused(false);
})();

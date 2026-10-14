/* Sponsor carousel.
 *
 * Progressive enhancement, and deliberately fail-safe: the markup renders every
 * sponsor side by side, and this script only switches to one-at-a-time by adding
 * `is-carousel`. If the file 404s or throws, visitors still see every sponsor,
 * which is the outcome a sponsor actually cares about.
 *
 * That same static row is the answer for prefers-reduced-motion. A paused
 * carousel would technically be motion-free, but it would park one sponsor
 * behind a Play button nobody presses; the row shows all of them with no motion
 * at all. So reduced motion means no carousel, not a stopped one.
 *
 * Auto-rotation needs a visible pause control to meet WCAG 2.2.2 (Pause, Stop,
 * Hide), so the controls are built here rather than being optional chrome. It
 * also holds on hover and on keyboard focus.
 */
(function () {
  var root = document.querySelector('[data-carousel]');
  if (!root) return;

  var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel-slide'));
  // One sponsor is not a carousel. Leave the static row alone.
  if (slides.length < 2) return;

  var dotsWrap = root.querySelector('[data-carousel-dots]');
  var controls = root.querySelector('[data-carousel-controls]');
  var pauseBtn = root.querySelector('[data-carousel-pause]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  var INTERVAL = 4500;
  var index = 0;
  var timer = null;
  var userPaused = false;
  var on = false;
  var dots = [];

  function show(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
    dots.forEach(function (d, n) { d.setAttribute('aria-current', n === index ? 'true' : 'false'); });
  }

  function run() { if (on && !timer && !userPaused) timer = setInterval(function () { show(index + 1); }, INTERVAL); }
  function halt() { if (timer) { clearInterval(timer); timer = null; } }

  function setPaused(paused) {
    userPaused = paused;
    if (paused) halt(); else run();
    if (pauseBtn) {
      pauseBtn.textContent = paused ? 'Play' : 'Pause';
      pauseBtn.setAttribute('aria-label', paused ? 'Resume sponsor rotation' : 'Pause sponsor rotation');
    }
  }

  function buildDots() {
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
  }

  function enable() {
    if (on) return;
    on = true;
    root.classList.add('is-carousel');
    if (controls) controls.hidden = false;
    if (!dots.length) buildDots();
    show(0);
    setPaused(false);
  }

  function disable() {
    if (!on) return;
    on = false;
    halt();
    root.classList.remove('is-carousel');
    if (controls) controls.hidden = true;
    // Back to the static row: every sponsor on screen, nothing moving.
    slides.forEach(function (s) { s.classList.remove('is-active'); });
  }

  if (pauseBtn) pauseBtn.addEventListener('click', function () { setPaused(!userPaused); });

  // Hovering or tabbing in holds the current sponsor without flipping the
  // button, so an explicit pause survives a stray mouse.
  root.addEventListener('mouseenter', halt);
  root.addEventListener('mouseleave', run);
  root.addEventListener('focusin', halt);
  root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) run(); });

  root.addEventListener('keydown', function (e) {
    if (!on) return;
    if (e.key === 'ArrowRight') { show(index + 1); e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { show(index - 1); e.preventDefault(); }
  });

  // A backgrounded tab should not bank up queued advances.
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) halt(); else run();
  });

  var sync = function () { if (reduce.matches) disable(); else enable(); };
  if (reduce.addEventListener) reduce.addEventListener('change', sync);
  else if (reduce.addListener) reduce.addListener(sync);
  sync();
})();

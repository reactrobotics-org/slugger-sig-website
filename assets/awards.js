/* Native details handles clicks, taps, and keyboard activation without JS.
 * Hover previews close on departure; explicitly opened descriptions stay open.
 */
(function () {
  var hover = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.award-details').forEach(function (details) {
    var card = details.closest('.award-featured');
    var summary = details.querySelector('summary');
    var preview = false;

    card.addEventListener('pointerenter', function (event) {
      if (!hover.matches || event.pointerType === 'touch' || details.open) return;
      preview = true;
      details.open = true;
    });
    card.addEventListener('pointerleave', function () {
      if (!preview || details.contains(document.activeElement)) return;
      details.open = false;
      preview = false;
    });
    // Keep the native summary toggle authoritative after an explicit action.
    summary.addEventListener('click', function () { preview = false; });
    details.addEventListener('focusout', function (event) {
      if (!preview || details.contains(event.relatedTarget) || card.matches(':hover')) return;
      details.open = false;
      preview = false;
    });
    details.addEventListener('keydown', function (event) {
      if (event.key !== 'Escape' || !details.open) return;
      details.open = false;
      preview = false;
      summary.focus();
      event.preventDefault();
    });
  });
})();

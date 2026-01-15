/*
  Phantom by HTML5 UP
  html5up.net | @ajlkn
*/

(function($) {

  var $window = $(window),
      $body = $('body');

  // Breakpoints.
  breakpoints({
    xlarge:   [ '1281px',  '1680px' ],
    large:    [ '981px',   '1280px' ],
    medium:   [ '737px',   '980px'  ],
    small:    [ '481px',   '736px'  ],
    xsmall:   [ '361px',   '480px'  ],
    xxsmall:  [ null,      '360px'  ]
  });

  // Play initial animations on page load.
  $window.on('load', function() {
    window.setTimeout(function() {
      $body.removeClass('is-preload');
    }, 100);
  });

  // Touch?
  if (browser.mobile)
    $body.addClass('is-touch');

  // Forms.
  var $form = $('form');

  // Auto-resizing textareas.
  $form.find('textarea').each(function() {

    var $this = $(this),
        $wrapper = $('<div class="textarea-wrapper"></div>');

    $this
      .wrap($wrapper)
      .attr('rows', 1)
      .css('overflow', 'hidden')
      .css('resize', 'none')
      .on('keydown', function(event) {

        if (event.keyCode == 13 && event.ctrlKey) {
          event.preventDefault();
          event.stopPropagation();
          $(this).blur();
        }

      })
      .on('blur focus', function() {
        $this.val($.trim($this.val()));
      })
      .on('input blur focus --init', function() {

        $wrapper.css('height', $this.height());

        $this
          .css('height', 'auto')
          .css('height', $this.prop('scrollHeight') + 'px');

      })
      .on('keyup', function(event) {

        if (event.keyCode == 9)
          $this.select();

      })
      .triggerHandler('--init');

    // Fix.
    if (browser.name == 'ie' || browser.mobile)
      $this
        .css('max-height', '10em')
        .css('overflow-y', 'auto');

  });

  // Menu (включаем ТОЛЬКО если реально есть #menu)
  var $menu = $('#menu');

  if ($menu.length) {

    $menu.wrapInner('<div class="inner"></div>');

    $menu._locked = false;

    $menu._lock = function() {
      if ($menu._locked) return false;
      $menu._locked = true;
      window.setTimeout(function() { $menu._locked = false; }, 350);
      return true;
    };

    $menu._show = function() {
      if ($menu._lock()) $body.addClass('is-menu-visible');
    };

    $menu._hide = function() {
      if ($menu._lock()) $body.removeClass('is-menu-visible');
    };

    $menu._toggle = function() {
      if ($menu._lock()) $body.toggleClass('is-menu-visible');
    };

    $menu
      .appendTo($body)
      .on('click', function(event) {
        event.stopPropagation();
      })
      .on('click', 'a', function(event) {

        var href = $(this).attr('href');

        event.preventDefault();
        event.stopPropagation();

        // Hide.
        $menu._hide();

        // Redirect.
        if (href == '#menu') return;

        window.setTimeout(function() {
          window.location.href = href;
        }, 350);

      })
      .append('<a class="close" href="#menu">Close</a>');

    $body
      .on('click', 'a[href="#menu"]', function(event) {
        event.stopPropagation();
        event.preventDefault();
        $menu._toggle();
      })
      .on('click', function() {
        $menu._hide();
      })
      .on('keydown', function(event) {
        if (event.keyCode == 27) $menu._hide();
      });

  }

})(jQuery);


/* =========================
   Graphic Design modal (единая версия)
   ========================= */
document.addEventListener('DOMContentLoaded', () => {
  const gdLinks = Array.from(document.querySelectorAll('.gd-open'));
  if (!gdLinks.length) return;

  const modal = document.getElementById('gdModal');
  if (!modal) return;

  const modalImg = document.getElementById('gdModalImg');
  const modalCaption = document.getElementById('gdModalCaption');

  const btnClose = modal.querySelector('.gd-modal__close');
  const btnPrev = modal.querySelector('.gd-prev');
  const btnNext = modal.querySelector('.gd-next');
  const backdrop = modal.querySelector('.gd-modal__backdrop');

  let currentIndex = 0;

  function openModal(index) {
    currentIndex = index;

    const link = gdLinks[currentIndex];
    modalImg.src = link.getAttribute('href');
    modalImg.alt = link.dataset.title || '';

    const title = link.dataset.title || '';
    const description = link.dataset.description || '';
    modalCaption.innerHTML = `<strong>${title}</strong><br>${description}`;

    modal.classList.add('is-open');              // <-- ВАЖНО: совпадает с CSS
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gd-modal-lock');
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    modalCaption.textContent = '';
    document.body.classList.remove('gd-modal-lock');
  }

  function showNext() {
    openModal((currentIndex + 1) % gdLinks.length);
  }

  function showPrev() {
    openModal((currentIndex - 1 + gdLinks.length) % gdLinks.length);
  }

  gdLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(index);
    });
  });

  btnClose?.addEventListener('click', closeModal);
  backdrop?.addEventListener('click', closeModal);

  btnNext?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showNext();
  });

  btnPrev?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    showPrev();
  });

  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
});

/*
  Phantom by HTML5 UP
  html5up.net | @ajlkn
*/

(function ($) {
  var $window = $(window),
    $body = $("body");

  // Breakpoints.
  breakpoints({
    xlarge: ["1281px", "1680px"],
    large: ["981px", "1280px"],
    medium: ["737px", "980px"],
    small: ["481px", "736px"],
    xsmall: ["361px", "480px"],
    xxsmall: [null, "360px"],
  });

  // Play initial animations on page load.
  $window.on("load", function () {
    window.setTimeout(function () {
      $body.removeClass("is-preload");
    }, 100);
  });

  // Touch?
  if (browser.mobile) $body.addClass("is-touch");

  // Forms (оставляем из шаблона, безопасно).
  var $form = $("form");

  $form.find("textarea").each(function () {
    var $this = $(this),
      $wrapper = $('<div class="textarea-wrapper"></div>');

    $this
      .wrap($wrapper)
      .attr("rows", 1)
      .css("overflow", "hidden")
      .css("resize", "none")
      .on("keydown", function (event) {
        if (event.keyCode == 13 && event.ctrlKey) {
          event.preventDefault();
          event.stopPropagation();
          $(this).blur();
        }
      })
      .on("blur focus", function () {
        $this.val($.trim($this.val()));
      })
      .on("input blur focus --init", function () {
        $wrapper.css("height", $this.height());
        $this.css("height", "auto").css("height", $this.prop("scrollHeight") + "px");
      })
      .on("keyup", function (event) {
        if (event.keyCode == 9) $this.select();
      })
      .triggerHandler("--init");

    if (browser.name == "ie" || browser.mobile)
      $this.css("max-height", "10em").css("overflow-y", "auto");
  });

  // ВАЖНО: меню Phantom отключено, потому что ты его убрала стилями и верхним меню.
  // (иначе шаблонный JS лезет в #menu и создаёт путаницу)

})(jQuery);

// =========================
// Graphic Design modal
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const gdLinks = Array.from(document.querySelectorAll(".gd-open"));
  const modal = document.getElementById("gdModal");
  const modalImg = document.getElementById("gdModalImg");
  const caption = document.getElementById("gdModalCaption");

  if (!gdLinks.length || !modal || !modalImg || !caption) return;

  let currentIndex = 0;

  const btnClose = modal.querySelector(".gd-modal__close");
  const btnPrev = modal.querySelector(".gd-prev");
  const btnNext = modal.querySelector(".gd-next");
  const backdrop = modal.querySelector(".gd-modal__backdrop");

  function openModal(index) {
    currentIndex = index;

    const link = gdLinks[currentIndex];
    modalImg.src = link.getAttribute("href");
    modalImg.alt = link.dataset.title || "";

    const title = link.dataset.title || "";
    const description = link.dataset.description || "";
    caption.innerHTML = `<strong>${title}</strong><br>${description}`;

    modal.classList.add("is-open");              // ✅ совпадает с CSS
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("gd-modal-lock");
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
    caption.textContent = "";
    document.body.classList.remove("gd-modal-lock");
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % gdLinks.length;
    openModal(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + gdLinks.length) % gdLinks.length;
    openModal(currentIndex);
  }

  gdLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      openModal(index);
    });
  });

  btnClose?.addEventListener("click", closeModal);
  backdrop?.addEventListener("click", closeModal);

  btnNext?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showNext();
  });

  btnPrev?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showPrev();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;

    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});

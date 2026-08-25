(function () {
  var header = document.querySelector(".site-header");
  var hero = document.querySelector("[data-hero]");
  var toggle = document.querySelector(".nav-toggle");

  function updateHeader() {
    if (!header) return;
    if (!hero) {
      header.style.setProperty("--header-opacity", "1");
      return;
    }
    var range = Math.max(1, hero.offsetHeight - header.offsetHeight);
    var t = Math.min(1, Math.max(0, window.scrollY / range));
    header.style.setProperty("--header-opacity", String(t));
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
  window.addEventListener("resize", updateHeader);

  if (toggle && header) {
    toggle.addEventListener("click", function () {
      header.classList.toggle("is-open");
    });
  }

  document.querySelectorAll(".accordion-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".accordion-item");
      var open = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".accordion-item").forEach(function (el) {
        el.classList.remove("is-open");
        el.querySelector(".accordion-btn").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  var form = document.querySelector(".js-contact-form");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();
      var subject = encodeURIComponent("Запрос с сайта Special-Style" + (name ? " — " + name : ""));
      var body = encodeURIComponent(
        (name ? "Имя: " + name + "\n" : "") +
          (email ? "Email: " + email + "\n\n" : "") +
          message
      );
      window.location.href = "mailto:mail@special-style.ru?subject=" + subject + "&body=" + body;
    });
  }

  var mosaicRoots = document.querySelectorAll(".js-lightbox");
  if (mosaicRoots.length) {
    var slides = [];
    mosaicRoots.forEach(function (root) {
      root.querySelectorAll("img").forEach(function (img) {
        slides.push(img);
      });
    });

    var overlay = document.createElement("div");
    overlay.className = "lightbox";
    overlay.hidden = true;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Галерея проекта");
    overlay.innerHTML =
      '<button class="lightbox-close" type="button">Закрыть</button>' +
      '<button class="lightbox-prev" type="button" aria-label="Предыдущее фото">‹</button>' +
      "<img alt=\"\" />" +
      '<button class="lightbox-next" type="button" aria-label="Следующее фото">›</button>';
    document.body.appendChild(overlay);

    var picture = overlay.querySelector("img");
    var current = 0;

    function openAt(index) {
      current = (index + slides.length) % slides.length;
      var img = slides[current];
      picture.src = img.currentSrc || img.src;
      picture.alt = img.alt || "";
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      overlay.hidden = true;
      picture.removeAttribute("src");
      document.body.style.overflow = "";
    }

    slides.forEach(function (img, index) {
      img.addEventListener("click", function () {
        openAt(index);
      });
    });

    overlay.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    overlay.querySelector(".lightbox-prev").addEventListener("click", function () {
      openAt(current - 1);
    });
    overlay.querySelector(".lightbox-next").addEventListener("click", function () {
      openAt(current + 1);
    });
    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (overlay.hidden) return;
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") openAt(current - 1);
      if (event.key === "ArrowRight") openAt(current + 1);
    });
  }
})();

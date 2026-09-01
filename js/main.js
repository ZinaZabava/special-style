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
    function setNavOpen(open) {
      header.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.textContent = open ? "Закрыть" : "Меню";
    }

    toggle.setAttribute("aria-expanded", "false");
    toggle.addEventListener("click", function () {
      setNavOpen(!header.classList.contains("is-open"));
    });
    header.querySelectorAll(".nav-links a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNavOpen(false);
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 720) setNavOpen(false);
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
      document.body.classList.add("lightbox-open");
    }

    function closeLightbox() {
      overlay.hidden = true;
      picture.removeAttribute("src");
      document.body.style.overflow = "";
      document.body.classList.remove("lightbox-open");
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

  var mobileImageMq = window.matchMedia("(max-width: 720px)");
  var orientationImgSelector =
    ".gallery-row img, .thumb-mosaic img, .journal-media img, .mosaic-frame img, .project-card img, .person img, .award-covers img, .office-grid img, .detail-intro .frame";

  function getImageDimensions(img) {
    var w = img.naturalWidth;
    var h = img.naturalHeight;
    if (!w || !h) {
      w = parseInt(img.getAttribute("width"), 10) || 0;
      h = parseInt(img.getAttribute("height"), 10) || 0;
    }
    return { w: w, h: h };
  }

  function classifyMobileImage(img) {
    var dims = getImageDimensions(img);
    if (!dims.w || !dims.h) return;
    var landscape = dims.w >= dims.h;
    img.classList.toggle("mobile-landscape", landscape);
    img.classList.toggle("mobile-portrait", !landscape);
    var card = img.closest(".project-card");
    if (card) {
      card.classList.toggle("is-landscape", landscape);
      scheduleProjectsGridReorder();
    }
    var mosaic = img.closest(".project-detail .thumb-mosaic");
    if (mosaic) scheduleThumbMosaicReorder();
    var person = img.closest(".person");
    if (person) person.classList.toggle("is-landscape", landscape);
  }

  function clearMobileOrientation() {
    document.querySelectorAll(".mobile-landscape, .mobile-portrait").forEach(function (el) {
      el.classList.remove("mobile-landscape", "mobile-portrait");
    });
    document.querySelectorAll(".project-card.is-landscape, .person.is-landscape").forEach(function (el) {
      el.classList.remove("is-landscape");
    });
  }

  function applyMobileOrientation() {
    if (!mobileImageMq.matches) {
      clearMobileOrientation();
      return;
    }
    document.querySelectorAll(orientationImgSelector).forEach(function (img) {
      if (img.complete && img.naturalWidth) {
        classifyMobileImage(img);
        return;
      }
      img.addEventListener(
        "load",
        function () {
          classifyMobileImage(img);
        },
        { once: true }
      );
    });
  }

  var projectGridRestores = [];
  var projectsGridReorderTimer;

  function scheduleProjectsGridReorder() {
    if (!mobileImageMq.matches) return;
    clearTimeout(projectsGridReorderTimer);
    projectsGridReorderTimer = setTimeout(reorderProjectsGrid, 40);
  }

  function restoreProjectsGridOrder() {
    projectGridRestores.forEach(function (item) {
      item.order.forEach(function (card) {
        item.grid.appendChild(card);
      });
    });
    projectGridRestores.length = 0;
  }

  function isWideProjectCard(card) {
    return card.classList.contains("is-landscape") || card.classList.contains("is-wide");
  }

  function packProjectCards(cards) {
    var remaining = cards.slice();
    var output = [];
    var col = 0;

    while (remaining.length > 0) {
      var card = remaining[0];
      var wide = isWideProjectCard(card);

      if (wide) {
        if (col === 1) {
          var portraitIdx = -1;
          for (var i = 1; i < remaining.length; i += 1) {
            if (!isWideProjectCard(remaining[i])) {
              portraitIdx = i;
              break;
            }
          }
          if (portraitIdx > 0) {
            output.push(remaining.splice(portraitIdx, 1)[0]);
            col = 0;
          }
        }
        remaining.shift();
        output.push(card);
        col = 0;
      } else {
        remaining.shift();
        output.push(card);
        col = col === 0 ? 1 : 0;
      }
    }

    return output;
  }

  function reorderProjectsGrid() {
    restoreProjectsGridOrder();
    if (!mobileImageMq.matches) return;

    document.querySelectorAll(".projects-grid").forEach(function (grid) {
      var cards = Array.from(grid.querySelectorAll(":scope > .project-card"));
      if (!cards.length) return;

      projectGridRestores.push({ grid: grid, order: cards.slice() });

      var packed = packProjectCards(cards);
      packed.forEach(function (card) {
        grid.appendChild(card);
      });
    });
  }

  var thumbMosaicRestores = [];
  var thumbMosaicReorderTimer;

  function scheduleThumbMosaicReorder() {
    if (!mobileImageMq.matches) return;
    clearTimeout(thumbMosaicReorderTimer);
    thumbMosaicReorderTimer = setTimeout(reorderThumbMosaics, 40);
  }

  function restoreThumbMosaicOrder() {
    thumbMosaicRestores.forEach(function (item) {
      item.order.forEach(function (img) {
        item.mosaic.appendChild(img);
      });
    });
    thumbMosaicRestores.length = 0;
  }

  function isWideMosaicImage(img) {
    return img.classList.contains("mobile-landscape");
  }

  function packMosaicImages(images) {
    var remaining = images.slice();
    var output = [];
    var col = 0;

    while (remaining.length > 0) {
      var img = remaining[0];
      var wide = isWideMosaicImage(img);

      if (wide) {
        if (col === 1 || col === 3) {
          var portraitIdx = -1;
          for (var i = 1; i < remaining.length; i += 1) {
            if (!isWideMosaicImage(remaining[i])) {
              portraitIdx = i;
              break;
            }
          }
          if (portraitIdx > 0) {
            output.push(remaining.splice(portraitIdx, 1)[0]);
            col += 1;
            if (col > 3) col = 0;
          }
        }
        if (col > 2) col = 0;
        remaining.shift();
        output.push(img);
        col += 2;
        if (col > 3) col = 0;
      } else {
        remaining.shift();
        output.push(img);
        col += 1;
        if (col > 3) col = 0;
      }
    }

    return output;
  }

  function reorderThumbMosaics() {
    restoreThumbMosaicOrder();
    if (!mobileImageMq.matches) return;

    document.querySelectorAll(".project-detail .thumb-mosaic").forEach(function (mosaic) {
      var images = Array.from(mosaic.querySelectorAll(":scope > img"));
      if (!images.length) return;

      thumbMosaicRestores.push({ mosaic: mosaic, order: images.slice() });

      var packed = packMosaicImages(images);
      packed.forEach(function (img) {
        mosaic.appendChild(img);
      });
    });
  }

  function applyMobileLayout() {
    applyMobileOrientation();
    reorderProjectsGrid();
    reorderThumbMosaics();
  }

  applyMobileLayout();
  mobileImageMq.addEventListener("change", applyMobileLayout);
  window.addEventListener("resize", applyMobileLayout);
})();

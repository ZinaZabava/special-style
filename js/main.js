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
})();

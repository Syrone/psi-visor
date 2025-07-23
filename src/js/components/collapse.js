import "bootstrap/js/dist/collapse.js";

document.querySelectorAll("[data-bs-toggle=\"collapse\"]")?.forEach(trigger => {
  const targetSelector = trigger.getAttribute("data-bs-target") || trigger.getAttribute("href");
  const collapseEl = document.querySelector(targetSelector);
  if (!collapseEl) return;

  const accordionItem = trigger.closest(".accordion-item");
  if (!accordionItem) return;

  collapseEl.addEventListener("show.bs.collapse", () => {
    accordionItem.classList.add("is-show");
  });

  collapseEl.addEventListener("hide.bs.collapse", () => {
    accordionItem.classList.remove("is-show");
  });

  if (collapseEl.classList.contains("show")) {
    accordionItem.classList.add("is-show");
  }

  collapseEl.addEventListener("shown.bs.collapse", () => {
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;

    // Позиция элемента относительно документа
    const elementTop = accordionItem.getBoundingClientRect().top + window.pageYOffset;
    const currentScroll = window.pageYOffset;
    let scrollToY;
    const isMobile = window.innerWidth < 992;

    if (isMobile) {
      const offset = headerHeight + 16;
      if (elementTop < currentScroll) {
        // Скроллим вверх — учитываем шапку + отступ
        scrollToY = elementTop - offset;
      } else {
        // Скроллим вниз — без учёта шапки
        scrollToY = elementTop - 16;
      }
    } else {
      // Для десктопа всегда смещаем на 16px от верха
      scrollToY = elementTop - 16;
    }

    window.scrollTo({
      top: scrollToY,
      behavior: "smooth"
    });
  });
});


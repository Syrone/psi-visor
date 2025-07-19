import Swiper from 'swiper'
import { Pagination } from 'swiper/modules'

document.querySelectorAll('[data-swiper]')?.forEach((element) => {
  const type = element.dataset.swiper

  if (type === 'cards') {
    new Swiper(element, {
      modules: [ Pagination ],
      slidesPerView: 3,
      spaceBetween: 24,
      pagination: {
        el: element.querySelector('.swiper-pagination'),
        clickable: true,
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 16,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
      },
    });
  }
})

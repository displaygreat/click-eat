'use strict';

// Slider

new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'fade',
  pagination: {
    el: ('.swiper-pagination'),
    clickable: true,
    },
  })
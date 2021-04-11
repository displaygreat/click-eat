'use strict';

const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title')
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');

const getData = async function(url) {
  const response = await fetch(url);

if (!response.ok) {
  throw new Error(`Ошибка по адаресу ${url}, статус ошибка ${response.status}!`);
}
  return await response.json();
};

function createCardRestaurants({ image, kitchen, name, price, stars, products,
time_of_delivery: timeOfDelivery }) {

  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = "card card-restaurant";
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
      <div class="card-img-wrap">
        <img class="card-img" src="${image}" alt="image" class="card-image"/>
      </div>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">${name}</h3>
          <span class="card-tag tag">${timeOfDelivery} min</span>
        </div>
        <div class="card-info">
          <div class="rating">${stars}</div>
          <div class="price">From ${price} ILS</div>
          <div class="category">${kitchen}</div>
        </div>
        </div>
  `;
  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}

function createCardGood({ description, id, name, price, image }) {

  const card = document.createElement('div');
  card.className = 'card card-menu';
  card.insertAdjacentHTML('beforeend', `
              <div class="card-img-wrap">
                <img src=${image} alt="${name}" class="card-img"/>
              </div>
              <div class="card-text">
                <div class="card-heading">
                  <h3 class="card-title">${name}</h3>
                </div>
                <div class="card-info">
                  <div class="ingredients">${description}
                  </div>
                </div>
                <div class="card-buttons">
                  <button class="button button-primary button-add-cart" id=${id}>
                    <span class="button-card-text">Add to cart</span>
                    <span class="button-cart-svg"></span>
                  </button>
                  <strong class="card-price card-price-bold">${price} ILS</strong>
                </div>
              </div>
  `);
  
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
  const target = event.target;
  if (true) {
    const restaurant = target.closest('.card-restaurant');
    if (restaurant) {
        cardsMenu.textContent = '';
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');

        const { name, kitchen, stars, price } = restaurant.info;

        restaurantTitle.textContent = name;
        restaurantRating.textContent = stars;
        restaurantPrice.textContent = `From ${price} ILS`;
        restaurantCategory.textContent = kitchen;

        getData(`./db/${restaurant.products}`).then(function(data) {
        data.forEach(createCardGood);
      });
    }
  // } else {
  //   toggleModalAuth();
  // }
  }
}

function init() {
  getData('./db/partners.json').then(function(data) {
  data.forEach(createCardRestaurants);
  });

  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', function() {
      containerPromo.classList.remove('hide');
      restaurants.classList.remove('hide');
      menu.classList.add('hide');
  })
  
}

//slider
const swiper = new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: 'fade',
  pagination: {
    el: ('.swiper-pagination'),
    clickable: true,
  },
});

init();
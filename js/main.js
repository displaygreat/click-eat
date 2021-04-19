"use strict";

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm");
const loginInput = document.querySelector("#login");
const userName = document.querySelector(".user-name");
const buttonOut = document.querySelector(".button-out");
const cardsRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const restaurantTitle = document.querySelector(".restaurant-title");
const restaurantRating = document.querySelector(".rating");
const restaurantPrice = document.querySelector(".price");
const restaurantCategory = document.querySelector(".category");
const inputSearch = document.querySelector(".input-search");
const modalBody = document.querySelector(".modal-body");
const modalPrice = document.querySelector(".total-pricetag");
const buttonClearCart = document.querySelector(".clear-cart");

let login = localStorage.getItem("clickEat");

const cart = JSON.parse(localStorage.getItem(`clickEat_${login}`)) || [];

function downloadCart() {
  if (localStorage.getItem(`clickEat_${login}`)) {
    const data = JSON.parse(localStorage.getItem(`clickEat_${login}`));
    cart.push(...data);
  }
}

function saveCart() {
  localStorage.setItem(`clickEat_${login}`, JSON.stringify(cart));
}

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error on ${url}, error status ${response.status}!`);
  }
  return await response.json();
};

function validName(str) {
  const regName = /^[a-zA-Z0-9-\.]{1,20}$/;
  return regName.test(str);
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
  if (modalAuth.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function clearForm() {
  loginInput.style.borderColor = "";
  logInForm.reset();
}

function authorized() {
  function logOut() {
    login = null;
    cart.length = 0;
    localStorage.removeItem("clickEat");
    buttonAuth.style.display = "";
    userName.style.display = "";
    buttonOut.style.display = "";
    cartButton.style.display = "";
    buttonOut.removeEventListener("click", logOut);
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
    inputSearch.value = "";
    checkAuth();
  }

  console.log("Signed in");

  userName.textContent = login;
  buttonAuth.style.display = "none";
  userName.style.display = "inline-block";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";
  buttonOut.addEventListener("click", logOut);
}

function notAuthorized() {
  function logIn(event) {
    event.preventDefault();
    if (validName(loginInput.value)) {
      login = loginInput.value;
      localStorage.setItem("clickEat", login);
      toggleModalAuth();
      downloadCart();
      buttonAuth.removeEventListener("click", toggleModalAuth);
      closeAuth.removeEventListener("click", toggleModalAuth);
      logInForm.removeEventListener("submit", logIn);
      logInForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = "#ff0000";
      loginInput.value = "";
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  buttonAuth.addEventListener("click", clearForm);
  closeAuth.addEventListener("click", toggleModalAuth);
  logInForm.addEventListener("submit", logIn);
  modalAuth.addEventListener("click", function (event) {
    if (event.target.classList.contains("is-open")) {
      toggleModalAuth();
    }
  });
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

function createCardRestaurants({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery,
}) {
  const cardRestaurant = document.createElement("a");
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
  cardRestaurant.insertAdjacentHTML("beforeend", card);
  cardsRestaurants.insertAdjacentElement("beforeend", cardRestaurant);
}

function createCardGood({ description, id, name, price, image }) {
  const card = document.createElement("div");
  card.className = "card card-menu";
  card.insertAdjacentHTML(
    "beforeend",
    `
              <div class="card-img-wrap">
                <img src=${image} alt="${name}" class="card-img"/>
              </div>
              <div class="card-text">
                <div class="card-heading">
                  <h3 class="card-title card-title-reg">${name}</h3>
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
  `
  );

  cardsMenu.insertAdjacentElement("beforeend", card);
}

function openGoods(event) {
  const target = event.target;
  if (login) {
    const restaurant = target.closest(".card-restaurant");
    if (restaurant) {
      cardsMenu.textContent = "";
      containerPromo.classList.add("hide");
      restaurants.classList.add("hide");
      menu.classList.remove("hide");

      const { name, kitchen, stars, price } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `From ${price} ILS`;
      restaurantCategory.textContent = kitchen;

      getData(`./db/${restaurant.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}

function addToCart(event) {
  if (login) {
    const target = event.target;

    const buttonAddToCart = target.closest(".button-add-cart");
    if (buttonAddToCart) {
      const card = target.closest(".card");
      const imgUrl = card.querySelector(".card-img").getAttribute("src");
      const title = card.querySelector(".card-title-reg").textContent;
      const cost = card.querySelector(".card-price").textContent;
      const id = buttonAddToCart.id;

      const food = cart.find(function (item) {
        return item.id === id;
      });

      if (food) {
        food.count += 1;
      } else {
        cart.push({
          id: id,
          image: imgUrl,
          title: title,
          cost: cost,
          count: 1,
        });
      }
      saveCart();
    }
  } else {
    toggleModalAuth();
  }
}

function renderCart() {
  modalBody.textContent = "";
  cart.forEach(function ({ id, count, cost, title, image }) {
    const itemCart = `
      <div class="food-row">
        <div class="card-thumb-wrap">
          <img src=${image} alt="${title}" class="card-thumb"/>
        </div>
        <div class="food-wrap">
          <span class="food-name">${title}</span>
          <span class="food-price">${cost}</span>
          <div class="food-counter">
            <button class="counter-button counter-minus" data-id=${id}>-</button>
            <span class="counter">${count}</span>
            <button class="counter-button counter-plus" data-id=${id}>+</button>
          </div>
        </div>
      </div>
    `;
    modalBody.insertAdjacentHTML("afterbegin", itemCart);
  });
  const totalPrice = cart.reduce(function (result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0);
  modalPrice.textContent = totalPrice + " ILS";
  saveCart();
}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains("counter-button")) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });

    if (target.classList.contains("counter-minus")) {
      food.count--;
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
    if (target.classList.contains("counter-plus")) food.count++;

    renderCart();
  }
}

//slider
const swiper = new Swiper(".swiper-container", {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  effect: "fade",
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

function init() {
  getData("./db/partners.json").then(function (data) {
    data.forEach(createCardRestaurants);
  });

  buttonClearCart.addEventListener("click", function () {
    cart.length = 0;
    renderCart();
    toggleModal();
  });

  modalBody.addEventListener("click", changeCount);

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });

  cardsMenu.addEventListener("click", addToCart);

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener("click", openGoods);
  logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide");
    restaurants.classList.remove("hide");
    menu.classList.add("hide");
  });

  checkAuth();

  inputSearch.addEventListener("keypress", function (event) {
    if (event.charCode === 13) {
      const value = event.target.value.trim();

      getData("./db/partners.json")
        .then(function (data) {
          return data.map(function (partner) {
            return partner.products;
          });
        })
        .then(function (linksProduct) {
          cardsMenu.textContent = "";

          linksProduct.forEach(function (link) {
            getData(`./db/${link}`).then(function (data) {
              const resultSearch = data.filter(function (item) {
                const name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              });

              containerPromo.classList.add("hide");
              restaurants.classList.add("hide");
              menu.classList.remove("hide");

              restaurantTitle.textContent = "Search results";
              restaurantRating.textContent = "";
              restaurantPrice.textContent = "";
              restaurantCategory.textContent = "Varied cuisine";
              resultSearch.forEach(createCardGood);
            });
          });
        });
    }
  });
}

init();

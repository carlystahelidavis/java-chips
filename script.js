//* global variables*//
var range = document.getElementById("range");
var rangeValue = document.getElementById("range-value");
var home = document.querySelector("#home-page");
var start = document.querySelector("#start-button");
var preferences = document.querySelector("#preferences-page");
var previousOrders = document.querySelector('#previous-orders');
var latitude = "40.758701";
var longitude = "-111.876183";
var restaurantsArray = [];
var orderProcessing = document.querySelector("#order-processing");
var submitOrder = document.querySelector("#submitOrder");
var orderSubmitted = document.querySelector("#order-submitted");
var restaurantName = document.querySelector("#restaurantName");
var dishName = document.querySelector("#dishName");
var tryAgain = document.querySelector("#try-again");

// Config
const isOpenClass = 'modal-is-open';
const openingClass = 'modal-is-opening';
const closingClass = 'modal-is-closing';
const animationDuration = 400; // ms
let visibleModal = null;


// Toggle modal
const toggleModal = event => {
  event.preventDefault();
  const modal = document.getElementById(event.currentTarget.getAttribute('data-target'));
  (typeof (modal) != 'undefined' && modal != null)
    && isModalOpen(modal) ? closeModal(modal) : openModal(modal)
}

// Is modal open
const isModalOpen = modal => {
  return modal.hasAttribute('open') && modal.getAttribute('open') != 'false' ? true : false;
}

// Open modal
const openModal = modal => {
  if (isScrollbarVisible()) {
    document.documentElement.style.setProperty('--scrollbar-width', `${getScrollbarWidth()}px`);
  }
  document.documentElement.classList.add(isOpenClass, openingClass);
  setTimeout(() => {
    visibleModal = modal;
    document.documentElement.classList.remove(openingClass);
  }, animationDuration);
  modal.setAttribute('open', true);
}

// Close modal
const closeModal = modal => {
  visibleModal = null;
  document.documentElement.classList.add(closingClass);
  setTimeout(() => {
    document.documentElement.classList.remove(closingClass, isOpenClass);
    document.documentElement.style.removeProperty('--scrollbar-width');
    modal.removeAttribute('open');
  }, animationDuration);
}

range.addEventListener("input", function () {
  rangeValue.textContent = range.value + ' miles';
});


function beginOrder() {
  home.setAttribute("style", "display: none");
  preferences.setAttribute("style", "display: block");
};

start.addEventListener('click', beginOrder);

//address javascript
// Is scrollbar visible
const isScrollbarVisible = () => {
  return document.body.scrollHeight > screen.height;
}

// Get scrollbar width
const getScrollbarWidth = () => {

  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}

function getRestaurantList() {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'bcfd012af7msh7fdff2617da2484p1117acjsn51c78b0dac2b',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    }
  };

  fetch('https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=40.7608&longitude=-111.8910&limit=30&currency=USD&distance=2&open_now=false&lunit=km&lang=en_US', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}
function getLatLon() {

  var address = "537 W 600 S, Salt Lake City, UT 84101";
  var encode = encodeURIComponent(address);

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8403ee9960msh8ee9ed3f1dc65f9p1d13c3jsna559bd38400a',
      'X-RapidAPI-Host': 'address-from-to-latitude-longitude.p.rapidapi.com'
    }
  };

  fetch('https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?address=' + encode, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}
/////////////////////////////////////////////////-restaurant API begins /////////////////////
submitOrder.addEventListener('click', function (event) {
  event.preventDefault();
  var cuisineSelected = document.querySelector("#cuisineSelected");
  var cuisinePreference = cuisineSelected.value;
  var distanceSelected = document.querySelector("#range");
  var distance = distanceSelected.value;
  var minRatingSelected = document.querySelector("#rating");
  var minRating = minRatingSelected.value;
  console.log(cuisinePreference + distance + minRating);
  var URL =
    "https://travel-advisor.p.rapidapi.com/restaurants/list-by-latlng?latitude=" +
    latitude +
    "&longitude=" +
    longitude +
    "&limit=50&currency=USD&distance=" +
    distance +
    "&open_now=false&lunit=km&lang=en_US&min_rating=" +
    minRating +
    "&rapidapi-key=00f9c8e49fmshe497b54f0a15c1ap147920jsn29c568417b24&rapidapi-host=travel-advisor.p.rapidapi.com";
  fetch(URL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      checkCuisine(data.data);
    });
})

function checkCuisine(data) {
  for (i = 0; i < data.length; i++) {
    var restaurantData = data[i];

    if (restaurantData.hasOwnProperty("cuisine")) {
      var restaurantCuisine = restaurantData.cuisine;
      var restaurantID = restaurantData.location_id;

      getCuisine(restaurantID, restaurantCuisine);
    }
  }

  randomRestaurant();
}

function getCuisine(restaurantID, restaurantCuisine) {
  var cuisineData = restaurantCuisine;
  var restaurant = restaurantID;

  if (cuisineData.length > 0) {
    var cuisineArray = cuisineData;
    getDetail(restaurant, cuisineArray);
  }
}

function getDetail(restaurant, cuisineArray) {
  var cuisineName = cuisineArray[0].name;
  var restaurantOptions = restaurant;
  var cuisineSelected = document.querySelector("#cuisineSelected");
  var cuisinePreference = cuisineSelected.value;
  if (cuisineName === cuisinePreference) {
    if (!restaurantsArray.includes(restaurantOptions)) {
      restaurantsArray.push([restaurantOptions]);
    }
  }
}

function randomRestaurant() {
  var index = Math.floor(Math.random() * restaurantsArray.length);
  var selectedRestaurant = restaurantsArray[index];

  if (restaurantsArray.length === 0) {
    orderProcessing.setAttribute('open', false);
    tryAgain.setAttribute('open', true);
  } else {
    ;
    console.log(selectedRestaurant);

    getItem(selectedRestaurant);
  }
}

function getItem(selectedRestaurant) {
  var id = selectedRestaurant;
  var detailsURL =
    "https://travel-advisor.p.rapidapi.com/restaurants/get-details?location_id=" +
    id +
    "&currency=USD&lang=en_US&rapidapi-key=00f9c8e49fmshe497b54f0a15c1ap147920jsn29c568417b24&rapidapi-host=travel-advisor.p.rapidapi.com";

  fetch(detailsURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      filter(data);
    });
}

function filter(data) {
  var dishes = data.dishes;


  if (dishes.length > 0) {
    var index = Math.floor(Math.random() * dishes.length);
    var randomDish = dishes[index];
    localStorage.setItem("Restaurant", data.name);
    localStorage.setItem("Dish", randomDish.name);
    console.log(randomDish.name);
    orderSubmitted.setAttribute('open', true);
  } else {
    var selectedRestaurant = restaurantsArray.shift();
    if (selectedRestaurant) {
      console.log("No dishes found for the selected restaurant, trying another one...");
      getItem(selectedRestaurant);
    }
  }
  var confirmRestaurant = localStorage.getItem("Restaurant");
  var confirmDish = localStorage.getItem("Dish");
  orderProcessing.setAttribute('open', false);
  restaurantName.textContent = "Restaurant: " + confirmRestaurant;
  dishName.textContent = "Menu Item: " + confirmDish;
}

//*function to get past orders from the button*//
function getPastOrders() {
  var pastDishes = localStorage.getItem("Dish");
  var pastRestaurants = localStorage.getItem("Restaurant");
  localStorage.setItem(pastDishes, pastRestaurants);
  var pastDishesAndRestaurantsEL = document.createElement("p");
  pastDishesAndRestaurantsEL.textContent = `${pastDishes} - ${pastRestaurants}`;
  previousOrders.appendChild(pastDishesAndRestaurantsEL);
};

getPastOrders();


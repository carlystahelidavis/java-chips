
// Config
var latitude = localStorage.getItem("latitude");
var longitude = localStorage.getItem("longitude");
const isOpenClass = 'modal-is-open';
const openingClass = 'modal-is-opening';
const closingClass = 'modal-is-closing';
const animationDuration = 400; // ms
let visibleModal = null;
var localTime = dayjs();
var pickUpTime = localTime.add(30, 'minute').format('hh:mm');

// Toggle modal
const toggleModal = event => {
  event.preventDefault();
  const modal = document.getElementById(event.currentTarget.getAttribute('data-target'));
  (typeof (modal) != 'undefined' && modal != null)
    && isModalOpen(modal) ? closeModal(modal) : openModal(modal)
}

// Is modal open
const isModalOpen = modal => {
  var storedAddress = localStorage.getItem("address");
  if (storedAddress != 'undefined' && storedAddress != null && storedAddress.length > 0) {
    return modal.hasAttribute('open') && modal.getAttribute('open') != 'false' ? true : false;
  } else {
    const modal = document.getElementById('address-dialog');
    openModal(modal);
    closeModal(document.getElementById('modal-example'));
  }

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


var range = document.getElementById("range");
var rangeValue = document.getElementById("range-value");
var home = document.querySelector("#home-page");
var start = document.querySelector("#start-button");
var preferences = document.querySelector("#preferences-page");

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

/* Nishanthi Govindasamy - Get List of Restaurants from Rapid API */
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

/* Nishanthi Govindasamy - Get Latitude and Longitude information from Rapid API */
function getLatLon() {

  var address = localStorage.getItem("address");// eg:"537 W 600 S, Salt Lake City, UT 84101";
  var encode = encodeURIComponent(address); // to escape spaces in the url

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '8403ee9960msh8ee9ed3f1dc65f9p1d13c3jsna559bd38400a',
      'X-RapidAPI-Host': 'address-from-to-latitude-longitude.p.rapidapi.com'
    }
  };

  fetch('https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?address=' + encode, options)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);
      if (response.Results.length > 0) {
        console.log(response.Results[0]);
        latitude = response.Results[0].latitude;
        longitude = response.Results[0].longitude;
        console.log("latitude: " + latitude);
        console.log("longitude: " + longitude);
      }

    });
}


/* Nishanthi Govindasamy - Save Address to Local Storage(address) */
function saveAddress() {

  var firstName = document.querySelector("#firstname").value;
  var lastName = document.querySelector("#lastname").value;
  var streetAddress = document.querySelector("#staddress").value;
  var city = document.querySelector("#city").value;
  var state = document.querySelector("#state").value;
  var zipcode = document.querySelector("#zipcode").value;
  var email = document.querySelector("#email").value;
  var mobile = document.querySelector("#mobile").value;
  var address = streetAddress + ", " + city + ", " + state + " " + zipcode;
  console.log("Address: " + address);

  localStorage.setItem("firstname", firstName);
  localStorage.setItem("lastname", lastName);
  localStorage.setItem("address", address);
  localStorage.setItem("mobile", mobile);
  localStorage.setItem("email", email);

  getLatLon(); // setting latitude and longitude in variables after saving in local storage
}


/////////////////////////////////////////////////-restaurant API begins //////////////////////

var restaurantsArray = [];
var orderProcessing = document.querySelector("#order-processing");
var submitOrder = document.querySelector("#submitOrder");
var orderSubmitted = document.querySelector("#order-submitted");
var restaurantName = document.querySelector("#restaurantName");
var dishName = document.querySelector("#dishName");
var tryAgain = document.querySelector("#try-again");
var thankYou = document.querySelector("#thank-you");
var time = document.querySelector("#time");


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
  thankYou.textContent = "Thank you, " + localStorage.getItem("firstname") + " " + localStorage.getItem("lastname");
  restaurantName.textContent = "Your order has been sent to " + confirmRestaurant + " located at " + data.address;
  dishName.textContent = "Food item ordered: " + confirmDish;
  time.textContent = "Your order will be ready for pickup at: " + pickUpTime;
  orderProcessing.setAttribute("open", false);
}

document.querySelector("#tryAgain").addEventListener('click', function () {
  preferences.reset();
});

document.querySelector("#orderConfirmed").addEventListener('click', function () {
  preferences.reset();
  home.setAttribute("style", "display: block");
  preferences.setAttribute("style", "display: none");
});

document.querySelector('#homeButton').addEventListener('click', function (){
    preferences.reset();
    preferences.setAttribute('style', 'display: none');
    home.setAttribute('style', 'display: block');

}) 






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

  fetch('https://address-from-to-latitude-longitude.p.rapidapi.com/geolocationapi?address='+encode, options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));
}
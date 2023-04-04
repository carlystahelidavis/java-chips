var range = document.getElementById("range");
var rangeValue = document.getElementById("range-value");

range.addEventListener("input", function () {
  rangeValue.textContent = range.value + ' miles';
});

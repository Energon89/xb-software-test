import { CityMap } from "./CityMap.js";

let cityMap;
let stringCitiesList;
let isValidateLatitude = false;
let isValidateLongitude = false;

function init() {
  stringCitiesList = `"Nashville, TN", 36.17, -86.78;
  "New York, NY", 40.71, -74.00;
  "Atlanta, GA", 33.75, -84.39;
  "Denver, CO", 39.74, -104.98;
  "Seattle, WA", 47.61, -122.33;
  "Los Angeles, CA", 34.05, -118.24;
  "Memphis, TN", 35.15, -90.05;`;

  cityMap = new CityMap(stringCitiesList);
};
init();

const htmlElements = {
  outputCityMap: document.querySelector('.outputCityMap'),
  northernmostButton: document.querySelector('.northernmostButton'),
  outputNorthernmost: document.querySelector('.outputNorthernmost'),
  southernmostButton: document.querySelector('.southernmostButton'),
  outputSouthernmost: document.querySelector('.outputSouthernmost'),
  easternmostButton: document.querySelector('.easternmostButton'),
  outputEasternmost: document.querySelector('.outputEasternmost'),
  westernmostButton: document.querySelector('.westernmostButton'),
  outputWesternmost: document.querySelector('.outputWesternmost'),
  longitudeInput: document.querySelector('.longitude'),
  latitudeInput: document.querySelector('.latitude'),
  searchClosestButton: document.querySelector('.searchClosestButton'),
  outputCoordinates: document.querySelector('.outputCoordinates'),
  outputClosest: document.querySelector('.outputClosest'),
  outputCoordinates: document.querySelector('.outputCoordinates'),
};

htmlElements.outputCityMap.innerText = stringCitiesList;
htmlElements.northernmostButton.addEventListener("click", onNorthernmostButtonClick);
htmlElements.outputNorthernmost.innerText = cityMap.getNorthernMostName();
htmlElements.southernmostButton.addEventListener("click", onSouthernmostButtonClick);
htmlElements.outputSouthernmost.innerText = cityMap.getSouthernMostName();
htmlElements.easternmostButton.addEventListener("click", onEasternmostButtonClick);
htmlElements.outputEasternmost.innerText = cityMap.getEasternMostName();
htmlElements.westernmostButton.addEventListener("click", onWesternmostButtonClick);
htmlElements.outputWesternmost.innerText = cityMap.getWesternMostName();
htmlElements.latitudeInput.addEventListener("blur", () => validateLatitude(htmlElements.latitudeInput.value));
htmlElements.longitudeInput.addEventListener("blur", () => validateLongitude(htmlElements.longitudeInput.value));
htmlElements.searchClosestButton.addEventListener("click", () => {
  onSearchClosestButtonClick(parseFloat(htmlElements.longitudeInput.value), parseFloat(htmlElements.latitudeInput.value));
});

function onNorthernmostButtonClick() {
  init();
  htmlElements.outputNorthernmost.innerText = cityMap.getNorthernMostName();
  console.log('The name of the northernmost city is:', htmlElements.outputNorthernmost.innerText);
};

function onSouthernmostButtonClick() {
  init();
  htmlElements.outputSouthernmost.innerText = cityMap.getSouthernMostName();
  console.log('The name of the southernmost city is:', htmlElements.outputSouthernmost.innerText);
};

function onEasternmostButtonClick() {
  init();
  htmlElements.outputEasternmost.innerText = cityMap.getEasternMostName();
  console.log('The name of the easternmost city is:', htmlElements.outputEasternmost.innerText);
};

function onWesternmostButtonClick() {
  init();
  htmlElements.outputWesternmost.innerText = cityMap.getWesternMostName();
  console.log('The name of the westernmost city is:', htmlElements.outputWesternmost.innerText);
};

function onSearchClosestButtonClick(longitude, latitude) {
  if (isValidateLatitude && isValidateLongitude) {
    console.log(longitude, latitude);
    htmlElements.latitudeInput.classList.remove("error");
    htmlElements.longitudeInput.classList.remove("error");
    htmlElements.outputCoordinates.innerText = `${latitude}, ${longitude}`;
    htmlElements.outputClosest.innerText = cityMap.getNearestCity(longitude, latitude);
    htmlElements.longitudeInput.value = "";
    htmlElements.latitudeInput.value = "";
    isValidateLatitude = false;
    isValidateLongitude = false;
  } else {
    htmlElements.latitudeInput.classList.add("error");
    htmlElements.longitudeInput.classList.add("error");
  }
};

function validateLatitude(coordinate) {
  const RegexLatitude = new RegExp("^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$");
  if (!RegexLatitude.test(coordinate)) {
    htmlElements.latitudeInput.classList.add("error");
  } else {
    htmlElements.latitudeInput.classList.remove("error");
    isValidateLatitude = true;
  }
};

function validateLongitude(coordinate) {
  const RegexLongitude = new RegExp("^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$");
  if (!RegexLongitude.test(coordinate)) {
    htmlElements.longitudeInput.classList.add("error");
  } else {
    htmlElements.longitudeInput.classList.remove("error");
    isValidateLongitude = true;
  }
};

console.log('State abbreviations from the list of cities:', cityMap.getStates());

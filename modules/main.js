import { CityMap } from "./cityMap.js";
import { getStatesJson } from "./service.js"

let cityMap;
let stringCitiesList;
let htmlElements;
let isValidateLatitude = false;
let isValidateLongitude = false;
let isValidateLongitudeCreate = false;
let isValidateLatitudeCreate = false;

function init() {
  stringCitiesList = localStorage.getItem('newList') || `"Nashville, TN", 36.17, -86.78;
  "New York, NY", 40.71, -74.00;
  "Atlanta, GA", 33.75, -84.39;
  "Denver, CO", 39.74, -104.98;
  "Seattle, WA", 47.61, -122.33;
  "Los Angeles, CA", 34.05, -118.24;
  "Memphis, TN", 35.15, -90.05;`;

  cityMap = new CityMap(stringCitiesList);

  htmlElements = {
    outputCityMap: document.querySelector('.outputCityMap'),
    outputNorthernmost: document.querySelector('.outputNorthernmost'),
    outputSouthernmost: document.querySelector('.outputSouthernmost'),
    outputEasternmost: document.querySelector('.outputEasternmost'),
    outputWesternmost: document.querySelector('.outputWesternmost'),
    longitudeInput: document.querySelector('.longitude'),
    latitudeInput: document.querySelector('.latitude'),
    searchClosestButton: document.querySelector('.searchClosestButton'),
    outputCoordinates: document.querySelector('.outputCoordinates'),
    outputClosest: document.querySelector('.outputClosest'),
    outputCoordinates: document.querySelector('.outputCoordinates'),
    selectState: document.querySelector('.selectState'),
    outputCities: document.querySelector('.outputCities'),
    selectStates: document.querySelector('.selectStates'),
    createField: document.querySelector('.createField'),
    cityInput: document.querySelector('.cityInput'),
    latitudeCreate: document.querySelector('.latitudeCreate'),
    longitudeCreate: document.querySelector('.longitudeCreate'),
    pieWebix: document.querySelector('.pieWebix')
  };

  htmlElements.outputCityMap.innerText = stringCitiesList;
  htmlElements.outputNorthernmost.innerText = cityMap.getNorthernMostName();
  htmlElements.outputSouthernmost.innerText = cityMap.getSouthernMostName();
  htmlElements.outputEasternmost.innerText = cityMap.getEasternMostName();
  htmlElements.outputWesternmost.innerText = cityMap.getWesternMostName();
  htmlElements.latitudeInput.addEventListener("blur", () => validateLatitude(htmlElements.latitudeInput.value));
  htmlElements.longitudeInput.addEventListener("blur", () => validateLongitude(htmlElements.longitudeInput.value));
  htmlElements.searchClosestButton.addEventListener("click", () => {
    onSearchClosestButtonClick(parseFloat(htmlElements.longitudeInput.value), parseFloat(htmlElements.latitudeInput.value));
  });
  htmlElements.createField.addEventListener("click", createFieldClick);
  htmlElements.latitudeCreate.addEventListener("blur", () => validateLatitude(htmlElements.latitudeCreate.value, true));
  htmlElements.longitudeCreate.addEventListener("blur", () => validateLongitude(htmlElements.longitudeCreate.value, true));
  htmlElements.cityInput.addEventListener("blur", () => htmlElements.cityInput.classList.remove('error'));

  renderSelectState();
  renderSelectStates();
  renderWebix();
};
init();

function onSearchClosestButtonClick(longitude, latitude) {
  if (isValidateLatitude && isValidateLongitude) {
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

function validateLatitude(coordinate, isCreate) {
  const RegexLatitude = new RegExp("^(\\+|-)?(?:90(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\\.[0-9]{1,6})?))$");
  if (!RegexLatitude.test(coordinate)) {
    isCreate ? htmlElements.latitudeCreate.classList.add("error") : htmlElements.latitudeInput.classList.add("error");
  } else {
    isCreate ? (htmlElements.latitudeCreate.classList.remove("error"), isValidateLatitudeCreate = true)
      : (htmlElements.latitudeInput.classList.remove("error"), isValidateLatitude = true);
  }
};

function validateLongitude(coordinate, isCreate) {
  const RegexLongitude = new RegExp("^(\\+|-)?(?:180(?:(?:\\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\\.[0-9]{1,6})?))$");
  if (!RegexLongitude.test(coordinate)) {
    isCreate ? htmlElements.longitudeCreate.classList.add("error") : htmlElements.longitudeInput.classList.add("error");
  } else {
    isCreate ? (htmlElements.longitudeCreate.classList.remove("error"), isValidateLongitudeCreate = true)
      : (htmlElements.longitudeInput.classList.remove("error"), isValidateLongitude = true);
  }
};

function renderSelectState() {
  const states = cityMap.getStates().split(' ');
  htmlElements.selectState.innerHTML = "";

  const select = document.createElement("select");
  select.classList.add("output");
  select.addEventListener("change", () => searchByState(select.value));

  states.forEach(state => {
    const option = document.createElement("option");
    option.innerText = state || 'Select state';
    option.value = state;
    select.appendChild(option);
  });

  htmlElements.selectState.appendChild(select);
}

function searchByState(state) {
  htmlElements.outputCities.innerText = cityMap
    .getCyties(state)
    .map(elem => {
      return `${elem.city}, ${elem.abbreviation}, ${elem.latitude}, ${elem.longitude};
      `;
    })
    .join(' ')
}

function renderSelectStates() {
  htmlElements.selectStates.innerHTML = "";

  const select = document.createElement("select");
  select.classList.add("output");
  htmlElements.select = select;

  getStatesJson().then(states => {
    states.forEach(state => {
      const option = document.createElement("option");
      option.innerText = state.name;
      option.value = state.abbreviation;
      select.appendChild(option);
    });
  })

  htmlElements.selectStates.appendChild(select);
}

function createFieldClick() {
  if (!htmlElements.cityInput.value) {
    htmlElements.cityInput.classList.add('error');
  } else if (!htmlElements.select.value) {
    htmlElements.select.classList.add('error');
  } else if (!isValidateLatitudeCreate) {
    htmlElements.latitudeCreate.classList.add('error');
  } else if (!isValidateLongitudeCreate) {
    htmlElements.longitudeCreate.classList.add('error');
  } else {
    htmlElements.cityInput.classList.remove('error');
    htmlElements.select.classList.remove('error');
    htmlElements.latitudeCreate.classList.remove('error');
    htmlElements.longitudeCreate.classList.remove('error');
    const city = htmlElements.cityInput.value;
    const state = htmlElements.select.value;
    const latitude = htmlElements.latitudeCreate.value;
    const longitude = htmlElements.longitudeCreate.value;

    localStorage.setItem('newList', cityMap.getNewList(city, state, latitude, longitude));

    htmlElements.cityInput.value = '';
    htmlElements.select.value = '';
    htmlElements.latitudeCreate.value = '';
    htmlElements.longitudeCreate.value = '';
    isValidateLongitudeCreate = false;
    isValidateLatitudeCreate = false;

    console.log('List has been updated');
    init();
  }
}

//Super advanced task
function renderWebix() {
  htmlElements.pieWebix.innerHTML = "";
  const title = document.createElement("div");
  title.innerText = 'Visual representation for the states using webix charts:';
  htmlElements.pieWebix.appendChild(title);

  const dataWebix = cityMap.getDataWebix();

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  webix.ui({
    view: "chart",
    type: "pie",
    container: "pieWebix",
    value: "#sales#",
    label: "#abbreviation#",
    pieInnerText: '#sales#',
    color: "#color#",
    radius: 200,
    gradient: true,
    shadow: true,
    data: dataWebix.map(data => { return { sales: data.sales, abbreviation: data.abbreviation, color: getRandomColor() } })
  });
}

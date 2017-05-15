/*
  WEATHER APP:

  1. Log out the current temperature for Sydney's latitude and longitude
    (hint: complete the getWeather function, returning a promise with the result from the API call, use that promise to then log the result)
  2. Convert the temperature from kelvin to degrees celsius
  3. Add a form on index.html that allows a user to search for any city's weather and logs out the result.
    (hint: google maps api from previous example)
  4. Display the result of the users search on the DOM.
  5. Display the type of weather too (cloudy, sunny, etc -- check the response)

  --BONUS ROUND--
  6. Add a loading indicator until you're ready to display the information for the city.
  7. Make it pretty, ideas:
    * Change the background of the page to reflect the temperature
    * Add pictures to represent the type of weather -- clouds, the sun, etc.
    * Request a new temperature every few minutes (hint: setInterval)
    * Animate when the weather changes.
    *


*/

const mapsApi = 'https://maps.googleapis.com/maps/api/geocode/json?address='
const weatherUrl = "http://api.openweathermap.org/data/2.5/weather";
const apiKey = "72af66db614bf9fd03583352142dd7a7";
const container = document.querySelector("#container")
const state = {
  cities: []
}

function getLatLng(location) {
  return fetch(mapsApi + location)
  .then(res => res.json())
  .then(body => {
    return body.results[0].geometry.location
  })
}

function getWeather(lat, lng) {
  const url = `${weatherUrl}?lat=${lat}&lon=${lng}&units=metric&APPID=${apiKey}`
  return fetch(url)
  .then(res => res.json())
  .then(body => {
    console.log(body)
    return body
  })
}

function getWeatherIcon(weatherIcon) {
  const weatherIconArray = weatherIcon.split('')
  weatherIconArray[2] = 'd'
  return weatherIconArray.join('')
}

function getTime(time) {
  const dt = new Date(time*1000);
  const hr = dt.getHours();
  const m = "0" + dt.getMinutes();
  return hr+ ':' + m.substr(-2);
}

function render(element, data) {
  element.innerHTML = `
  <input id="locationText" type="text" name="" value="">
  <div class="background"></div>
  <div class="weather">
    <h1 class="city">${data.name}</h1>
    <div class="weatherDetails">
      <img src="./images/${getWeatherIcon(data.weather.icon)}.png">
      <p>${data.weather.description}</p>
    </div>
    <div class="tempContainer">
      <p class="temp">
        <span class="minTemp">${Math.round(data.main.temp_max)}</span>
        <span class="tempNow">${Math.round(data.main.temp)}°</span>
        <span class="maxTemp">${Math.round(data.main.temp_min)}</span>
      </p>
    </div>
    <div class="sun">
      <div class="sunRise">
        <img src="./images/021-sunrise.png">
        <p>${getTime(data.sys.sunrise)}</p>
      </div>
      <div class="sunSet">
        <img src="./images/021-sunset.png">
          <p>${getTime(data.sys.sunset)}</p>
      </div>
    </div>
  </div>
    ${state.currentCity === state.cities.length - 1 ?
      `<div class="add">
         <p>+</p>
       </div>`
      : `<div class="next">
          <p>></p>
         </div>`
    }
    ${state.currentCity === 0 ?
      ''
      : `<div class="previous">
        <p><</p>
      </div>`
    }
    <video playsinline autoplay muted loop id="bgvid">
      <source src="./videos/${getWeatherIcon(data.weather.icon)}.mp4" type="video/mp4">
    </video>
  `
}
delegate('body', 'click', '.add', event => {
  const location = document.querySelector('#locationText')

  location.style.display = 'block'
  document.querySelector('.background').style.display = 'block'

  location.focus()
})

delegate('body', 'click', '.background', event => {
  const location = document.querySelector('#locationText')

  location.style.display = 'none'
  document.querySelector('.background').style.display = 'none'
})
delegate('body', 'keyup', '#locationText', event => {
  if (event.keyCode === 13 ) {

    getLatLng(document.querySelector('#locationText').value)
    .then(res => {
      const city = {}
      city.lat = res.lat
      city.lng = res.lng

      getWeather(res.lat, res.lng)
      .then(res => {
         city.main = res.main
         city.name = res.name
         city.wind = res.wind
         city.weather = res.weather[0]
         city.sys = res.sys
         state.cities.push(city)
         state.currentCity = state.cities.length - 1
         console.log(state.cities);
         render(container, state.cities[state.currentCity])
       })
    })
  }
})

delegate('body', 'click', '.next', event => {
  const nextCity = state.currentCity + 1

  state.currentCity = nextCity
  render(container, state.cities[nextCity])
})

delegate('body', 'click', '.previous', event => {
  const previousCity = state.currentCity - 1
  state.currentCity = previousCity
  render(container, state.cities[previousCity])
})

getLatLng("Sydney")
.then(res => {
  const city = {}
  city.lat = res.lat
  city.lng = res.lng

  getWeather(res.lat, res.lng)
  .then(res => {
     city.main = res.main
     city.name = res.name
     city.wind = res.wind
     city.weather = res.weather[0]
     city.sys = res.sys
     state.cities.push(city)
     state.currentCity = state.cities.length - 1
     render(container, state.cities[state.currentCity])
   })
})

//universal let
let footer = document.querySelector("footer");

let city = document.querySelector("#city");
let submit = document.querySelector("#submit");
let h1 = document.querySelector("h1");
let h2 = document.querySelector("h2");
let h3 = document.querySelector("h3");
let h4 = document.querySelector("h4");
let img = document.querySelector("main>img");
let humidity = document.querySelector("#humidity");
let wind = document.querySelector("#wind");
let weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let weekdaySmall = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

let apiKey = "eb0a1d7541da4e9c4f957db698ea2ffe";

//retrieve city today to retrive location
function searchCity() {
  let urlsearchCity = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=${apiKey}`;
  axios.get(urlsearchCity).then(retrieveLocation);
  axios.get(urlsearchCity).then(retrieveNow);
}

//retrieve location to retrieve future
function retrieveLocation(location) {
  let lon = location.data.coord.lon;
  let lat = location.data.coord.lat;
  let urlRetrieveLocation = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude={minutely,hourly,alerts,current}&appid=${apiKey}`;
  axios.get(urlRetrieveLocation).then(retrieveFuture);
}

//retrieveNow cityname discription degree icon humidity wind
function retrieveNow(nowWeather) {
  let temp = Math.round(nowWeather.data.main.temp);
  if ((temp < 10) & (temp > -1)) {
    temp = `&nbsp${temp}`;
  }
  let discription = nowWeather.data.weather[0].description;
  let iconid = nowWeather.data.weather[0].icon;
  let humidityNum = nowWeather.data.main.humidity;
  let windNum = nowWeather.data.wind.speed;

  h1.innerHTML = city.value.toUpperCase();
  h3.innerHTML = discription;
  h4.innerHTML = `${temp}°`;
  humidity.innerHTML = humidityNum;
  wind.innerHTML = windNum;
  img.setAttribute("src", `http://openweathermap.org/img/wn/${iconid}@2x.png`);
}

//retrieve time
function newtime() {
  let date = null;
  date = new Date();
  let weekday = weekdays[date.getDay()];
  let hour = date.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minute = date.getMinutes();
  if (minute < 10) {
    minute = `0${minute}`;
  }
  h2.innerHTML = `${weekday} ${hour}:${minute}`;
}

//submit
function submitSearch(event) {
  event.preventDefault();
  searchCity();
  newtime();
}

//writefuture
function retrieveFuture(future) {
  //write footer 5 times
  footer.innerHTML = null;
  let forcastArrey = future.data.daily;
  forcastArrey.forEach(writeFooter);

  function writeFooter(futureDay, index) {
    let date = null;
    date = new Date();
    let weekday = date.getDay();

    if ((index > 0) & (index < 6)) {
      let weekNum = weekday + index;
      if (weekNum > 6) {
        weekNum = weekNum - 7;
      }
      let max = Math.round(futureDay.temp.max);
      let min = Math.round(futureDay.temp.min);
      let iconid = futureDay.weather[0].icon;
      footer.innerHTML =
        footer.innerHTML +
        `<div>
          <h5>${weekdaySmall[weekNum]}</h5>
          <img src="http://openweathermap.org/img/wn/${iconid}@2x.png"/>
          <h6><span id="max">${max}°</span>&nbsp&nbsp<span id="min">${min}°</span></h6>
        </div>`;
    }
  }
}

//onload

submit.addEventListener("click", submitSearch);
searchCity();
newtime();

// Sample API call: api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=86170c5f8394ef98b050c629516377aa
var city = "";
var apiKey = "86170c5f8394ef98b050c629516377aa";
var searchHistory = [];

const wait = (amount = 0) =>
  new Promise((resolve) => setTimeout(resolve, amount));

function formatDate(date) {
  var parts = date.split("-");
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
}

function createCurrentSection(data) {
  $("#curr-city").html(
    `${data.city} ${data.date} <img src=${data.icon} style="display: inline; width: 35px;" />`
  );
  $("#curr-temp").text(data.temp);
  $("#curr-humid").text(data.humidity);
  $("#curr-wind").text(data.wind);
  getUVIndex(data.coord);
}

function displayCurrentWeather(city) {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`,
    method: "GET",
  }).then(function ({ name, main, coord, wind, weather }) {
    var data = {
      city: name,
      date: `(${new Date(Date.now()).toLocaleString().split(",")[0]})`,
      icon: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
      coord,
      temp: `Temperature: ${main.temp} °F`,
      humidity: `Humidity: ${main.humidity}%`,
      wind: `Wind Speed: ${wind.speed} MPH`,
    };
    createCurrentSection(data);
  });
}

function createDayCard(day) {
  var card = $("<div>").addClass("card teal lighten-1");
  var cardContent = $("<div>").addClass("card-content white-text");
  var date = $("<h6>").text(day.date);
  var icon = $("<img>").attr("src", day.icon).attr("style", "width: 40px;");
  var temp = $("<p>").text(day.temp);
  var humid = $("<p>").text(day.humidity);
  card
    .append(cardContent.append(date, icon, temp, humid))
    .appendTo($(".day-container"));
}

function displayWeatherForecast(city) {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`,
    method: "GET",
  }).then(function ({ list }) {
    var days = [];
    var dayCounter = 0;
    for (var i = 2; i < 40; i += 8) {
      var { main, weather, dt_txt } = list[i];
      days[dayCounter] = {
        temp: `Temp: ${main.temp} °F`,
        humidity: `Humidity: ${main.humidity}%`,
        icon: `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`,
        date: formatDate(dt_txt.split(" ")[0]),
      };
      createDayCard(days[dayCounter]);
      dayCounter++;
    }
  });
}

function getUVIndex({ lat, lon }) {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    method: "GET",
  }).then(function ({ value }) {
    $("#curr-uv").text(`UV Index: ${value}`);
  });
}

function clearDispalys() {
  $("#search-history").empty();
  $(".day-container").empty();
  $("#curr-city").empty();
  $("#curr-temp").empty();
  $("#curr-humid").empty();
  $("#curr-wind").empty();
  $("#curr-uv").empty();
}

function prettifyCityName(name) {
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function displaySearchHistory() {
  searchHistory.forEach((city) => {
    $("<a>")
      .addClass("collection-item grey-text text-darken-4")
      .text(city)
      .appendTo("#search-history");
  });
}

function addToSearchHistory(city) {
  var formattedName = prettifyCityName(city);
  if (!searchHistory.includes(formattedName)) {
    searchHistory.push(formattedName);
  }
}

async function searchCity(city) {
  addToSearchHistory(city);
  clearDispalys();
  displaySearchHistory();
  displayCurrentWeather(city);
  displayWeatherForecast(city);
}

$("#search-btn").click(function () {
  var city = $("#city-search").val();
  searchCity(city);
});

$(document).on("click", ".collection-item", function () {
  searchCity(this.textContent);
});

// searchCity("seattle");

// ! TODO:
// * Local Storage
// * Value when seearh returns nothing

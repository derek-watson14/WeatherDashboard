// Global Variables
var apiKey = "86170c5f8394ef98b050c629516377aa";
var city = "";
var searchHistory;

// Utility Functions
function formatDate(date) {
  var parts = date.split("-");
  return `${parts[1]}/${parts[2]}/${parts[0]}`;
}
function prettifyCityName(name) {
  return name
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// Search History / Local Storage
function setSearchHistory() {
  var localHistory = localStorage.getItem("searchHistory");
  if (!localHistory) {
    searchHistory = [];
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  } else {
    searchHistory = JSON.parse(localHistory);
  }
}
function addToSearchHistory(city) {
  var formattedName = prettifyCityName(city);
  if (!searchHistory.includes(formattedName)) {
    searchHistory.push(formattedName);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }
}
function clearSearchHistory() {
  searchHistory = [];
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
}
function displaySearchHistory() {
  searchHistory.forEach((city) => {
    $("<a>")
      .addClass("history-item collection-item grey-text text-darken-4")
      .text(city)
      .prependTo("#search-history");
  });
}

// Getting and displaying weather info
function displayAllWeather(city) {
  displayCurrentWeather(city);
  displayWeatherForecast(city);
}
function displayCurrentWeather(city) {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`,
    method: "GET",
  }).then(function (res) {
    var { name, main, coord, wind, weather } = res;
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
function createCurrentSection(data) {
  $("#curr-city").html(
    `${data.city} ${data.date} <img src=${data.icon} style="display: inline; width: 35px;" />`
  );
  $("#curr-temp").text(data.temp);
  $("#curr-humid").text(data.humidity);
  $("#curr-wind").text(data.wind);
  displayUVIndex(data.coord);
}
function displayUVIndex({ lat, lon }) {
  var uvs = ["green", "#ADFF2F", "gold", "orange", "#FF4500", "red", "darkred"];
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`,
    method: "GET",
  }).then(function ({ value }) {
    var color = `${uvs[Math.floor((value / 14) * 7) - 1]}`;
    var valDisplay = $("<span>")
      .text(value)
      .css({ backgroundColor: color, padding: "3px" });
    $("#curr-uv").text(`UV Index: `).append(valDisplay);
  });
}
function displayWeatherForecast(city) {
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`,
    method: "GET",
  }).then(function ({ list }) {
    var days = [];
    var dayCounter = 0;
    // each item is a 3 hour step, 8 in a day
    // starting at 3 and adding 8 will produce each day at noon
    for (var i = 3; i < 40; i += 8) {
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
function clearDispalys() {
  $("#search-history").empty();
  $(".day-container").empty();
  $("#curr-city").text("Nothing to display");
  $("#curr-temp").empty();
  $("#curr-humid").empty();
  $("#curr-wind").empty();
  $("#curr-uv").empty();
}

// Running the program
function init() {
  setSearchHistory();
  displaySearchHistory();
  var newestSearch = searchHistory[searchHistory.length - 1];
  if (newestSearch) {
    displayAllWeather(newestSearch);
  }
}
function searchCity(city) {
  addToSearchHistory(city);
  clearDispalys();
  displaySearchHistory();
  displayAllWeather(city);
}

// Listeners
$("#search-btn").click(function () {
  var city = $("#city-search").val();
  searchCity(city);
  $("#city-search").val("");
});

$(document).on("click", ".history-item", function () {
  searchCity(this.textContent);
});

$("#clear-history").click(function () {
  clearSearchHistory();
  clearDispalys();
  displaySearchHistory();
});

// Start Program
init();

# WeatherDashboard

A weather dashboard which allows users to check the weather for a given location using the OpenWeatherMap API and local
storage to save search history. The current weather is displayed, along with a less detailed five day forecast.
This project took longer than I expected, becuase I wanted the jQuery AJAX call to save to a variable, not write directly.
I couldn't figure out how to do that and was pressed for time so I had to change my plans.

I chose to use Materialize CSS for this project, because I would be usiing it for our first group project later in the week.
I find it to be a really clean looking framework.

One thing I wish I had had the time to implement was handling incorrectly spelled or non-exsistent city names.
I couldn't figure out how to do so with jQuery & AJAX in the time allotted.

## View Site Here:

https://derek-watson14.github.io/WeatherDashboard/

## Project Criteria:

### User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

### Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```

## Screenshot:

![Project Screenshot](Screenshots/dash.png)

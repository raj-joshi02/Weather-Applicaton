const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherCards = document.getElementById("weatherCards");

// API options
const options = {
  method: 'GET',
  headers: {
    'x-rapidapi-key': 'a1f7c32a21msh1ecaf125c99361dp1869f0jsn0e666a1b7130',
    'x-rapidapi-host': 'visual-crossing-weather.p.rapidapi.com'
  }
};

// Fetch today's weather for a city
async function getTodaysWeather(city) {
  const today = new Date().toISOString().split("T")[0];
  const url = `https://visual-crossing-weather.p.rapidapi.com/forecast?location=${encodeURIComponent(city)}&unitGroup=metric&contentType=json&aggregateHours=24`;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    const locationKey = Object.keys(data.locations)[0];
    const locationData = data.locations[locationKey];
    const todayWeather = locationData.values.find(day => day.datetimeStr.startsWith(today));

    if (!todayWeather) throw new Error("No data for today");

    return {
      city,
      temp: todayWeather.temp,
      mint: todayWeather.mint,
      maxt: todayWeather.maxt,
      wdir: todayWeather.wdir,
      wspd: todayWeather.wspd,
      humidity: todayWeather.humidity,
      uvindex: todayWeather.uvindex,
      visibility: todayWeather.visibility,
      precip: todayWeather.precip,
      conditions: todayWeather.conditions,
      datetimeStr: todayWeather.datetimeStr
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

// Display weather card
function displayWeatherCard(weather) {
  if (!weather) return;

  // update heading dynamically
  const heading = document.querySelector("h1");
  heading.textContent = `Today's Weather for ${weather.city}`;

  weatherCards.innerHTML = `
    <div class="col-md-4">
      <div class="card weather-card text-center">
        <div class="card-header"><h2>Temperature</h2></div>
        <div class="card-body">
          <h2 style="font-size:45px; font-weight:bold; margin-bottom:10px;">${weather.temp}°C</h2>
          <p>Current Temperature: ${weather.temp}°C</p>
          <p>Mininimum Temperature: ${weather.mint}°C</p>
          <p>Maximum Temperature: ${weather.maxt}°C</p>
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card weather-card text-center">
        <div class="card-header"><h2>Weather</h2></div>
        <div class="card-body">
          <h3 style="font-size:45px; font-weight:bold; margin-bottom:10px;">${weather.conditions}</h3>
          <p>Weather Conditions: ${weather.conditions}</p>
          <p>Humidity: ${weather.humidity}%</p>
          <p>Precipitation: ${weather.precip} mm</p>
          
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card weather-card text-center">
        <div class="card-header"><h3>Other Info</h3></div>
        <div class="card-body">
          <p>Wind Direction: ${weather.wdir}°</p>
          <p>UV Index: ${weather.uvindex}</p>
          <p>Visibility: ${weather.visibility} km</p>
          <p>Wind Speed: ${weather.wspd} km/h</p>
          <p>Date & Time: ${weather.datetimeStr}</p>
        </div>
      </div>
    </div>
  `;
}

// Search city from input
async function searchCity(city) {
  cityInput.value = city;
  const weather = await getTodaysWeather(city);
  displayWeatherCard(weather);
}

// Search button click
searchBtn.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (city) searchCity(city);
  else alert("Please enter a city name");
});

// Default city on load: Ujjain
searchCity("Ujjain,India");


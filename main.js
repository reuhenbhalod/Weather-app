const WEATHERAPI_KEY      = '7e6079e943144c088e9194933253007';
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1';

const hourlyCardsContainer = document.querySelector('.hourly-cards-container');
const cityNameHeader = document.getElementById('city-name');


const airQuality = document.querySelector("#air-quality");
const humidity = document.querySelector("#humidity");
const uvIndex = document.querySelector("#uv-index");
const wind = document.querySelector("#wind");
const pressure = document.querySelector("#pressure");
const fact = document.querySelector("#fun-fact");

const weatherForm = document.querySelector('.form-inline');
const cityInput = document.querySelector('.formInput');
const card = document.querySelector('.card');


// const apiKey = "e0bda7ed56631cf6f858df8289d218aa";
// const apiUrl = `http://api.weatherstack.com/current?access_key=${apiKey}&query=${city}`


// Weather Api
const weatherApiKey = "e1116162e8bb4d738bc190848253107";
const weatherApi = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&aqi=yes&q=`;

let city;

// Get the current location
const locationApi = "http://ip-api.com/json";
async function getCurrentLocation() {
    try {
        const response = await fetch(locationApi);
        const data = await response.json();

        if (data && data.city) {
            console.log("Location data:", data);
            // Set the city variable to the current city
            city = data.city;
            console.log("Current city:", city);

            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            loadWeatherData(city);
            showWeather(city);
            showForecast(city);
            showFunFact();
            showCityImage(city);
        }
    } catch (error) {
        console.error("Error detecting location:", error);
    }
}

getCurrentLocation()


// Main input event
weatherForm.addEventListener('submit', async event => {

    event.preventDefault();

    city = cityInput.value;

    if (city) {
        try {
            // Reuhen's section
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
            // Jimmy's section
            loadWeatherData(city);
            // Helen's section
            showWeather(city);
            // Rukiya's section
            showForecast(city);
            // Fun Fact section
            showFunFact();
            // City Image section
            showCityImage(city);
        }
        catch (error) {
            console.error(error)
            displayError(error)
        }
    }
    else {
        displayError("Please enter a city name.");
    }
});


// Get current weather data

async function getWeatherData(city) {
    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&query=${city}`

    const response = await fetch(apiUrl);

    if (!response.ok) {
        throw new Error("Failed to fetch weather data");
    }
    return await response.json();
}

function displayWeatherInfo(data) {
    const city = data.location.name;
    const temp = data.current.temp_f;
    const weather_descriptions = data.current.condition.text;

    console.log("Weather Condition:", weather_descriptions);

    card.textContent = '';
    card.style.display = 'flex';

    const cityDisplay = document.createElement('h1');
    const tempDisplay = document.createElement('p');
    const weatherEmoji = document.createElement('p');
    const descriptionDisplay = document.createElement('p');

    cityDisplay.textContent = city;
    tempDisplay.textContent = `${temp}°F`;
    weatherEmoji.textContent = getWeatherEmoji(weather_descriptions);
    descriptionDisplay.textContent = weather_descriptions;

    cityDisplay.id = 'cityDisplay';
    tempDisplay.classList.add('tempDisplay');
    weatherEmoji.classList.add('weatherEmoji');
    descriptionDisplay.classList.add('weatherDescription');

    card.appendChild(cityDisplay);
    card.appendChild(tempDisplay);
    card.appendChild(weatherEmoji);
    card.appendChild(descriptionDisplay);

    setWeatherAnimation(weather_descriptions);
}

function getWeatherEmoji(weather_descriptions) {
    const description = weather_descriptions.toLowerCase();

    if (description.includes("sunny")) return "☀️";
    if (description.includes("partly cloudy") || description.includes("mostly sunny")) return "⛅";
    if (description.includes("cloudy")) return "☁️";
    if (description.includes("rain")) return "🌧️";
    if (description.includes("snow")) return "❄️";
    if (description.includes("mist")) return "🌫️";
    if (description.includes("thunder")) return "⛈️";
    if (description.includes("drizzle")) return "🌦️";
    if (description.includes("windy")) return "💨";
    if (description.includes("hail")) return "🌨️";
    if (description.includes("clear")) return "🌙";
    if (description.includes("overcast")) return "☁️";
    if (description.includes("light rain")) return "🌦️";
    if (description.includes("light snow")) return "🌨️";

    return "🌈"; // Default emoji if no match found
}

function displayError(message) {
    const errorDisplay = document.createElement('p');
    errorDisplay.textContent = message;
    errorDisplay.id = 'errorDisplay';

    card.textContent = '';
    card.style.display = 'flex';
    card.appendChild(errorDisplay);
}



/*** Get Weather Data ***/

async function fetchWeather(city) {
    try {
        const response = await fetch(weatherApi + city);
        console.log("Response from weather API:", response);
        const data = await response.json();
        console.log("Full weather data:", data);
        return data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        airQuality.textContent = "Could not fetch air quality data. Please try again later.";
        uvIndex.textContent = "Could not fetch UV data. Please try again later.";
        humidity.textContent = "Could not fetch humidity data. Please try again later.";
        wind.textContent = "Could not fetch wind data. Please try again later.";
        pressure.textContent = "Could not fetch pressure data. Please try again later.";
    }
}

async function showWeather(city) {
    let weatherData = await fetchWeather(city);
    const dataRow = document.querySelector("#data-row");

    if (weatherData && weatherData.current) {
        const epaIndex = weatherData.current.air_quality["us-epa-index"];
        airQuality.textContent = `${epaIndex} - ${epaStatus(epaIndex)}`;
        uvIndex.textContent = `${weatherData.current.uv}`;
        humidity.textContent = `${weatherData.current.humidity}%`;
        wind.textContent = `${weatherData.current.wind_mph} mph ${weatherData.current.wind_dir}`;
        pressure.textContent = `${weatherData.current.pressure_in} inHg`;
    } else {
        airQuality.textContent = "No air quality data available.";
        humidity.textContent = "No humidity data available.";
        uvIndex.textContent = "No UV index data available.";
        wind.textContent = "No wind data available.";
        pressure.textContent = "No pressure data available.";
    }

}


function epaStatus(epaIndex) {
    if (epaIndex === 1) {
        return "Good";
    } else if (epaIndex === 2) {
        return "Moderate";
    } else if (epaIndex === 3 || epaIndex === 4) {
        return "Unhealthy";
    } else if (epaIndex === 5) {
        return "Very Unhealthy";
    } else if (epaIndex === 6) {
        return "Hazardous";
    } else {
        return "Unknown";
    }
}


// Hourly Forecast
document.addEventListener('DOMContentLoaded', () => {
  // loadWeatherData(DEFAULT_LOCATION);
  setupScrollNavigation();
});

function setupScrollNavigation() {
  const container = hourlyCardsContainer;
  container.style.scrollBehavior = 'smooth';
  container.addEventListener('wheel', e => {
    e.preventDefault(); container.scrollLeft += e.deltaY;
  });
  document.addEventListener('keydown', e => {
    const amt = 200;
    if (e.key === 'ArrowLeft') {
      e.preventDefault(); container.scrollLeft -= amt;
    } else if (e.key === 'ArrowRight') {
      e.preventDefault(); container.scrollLeft += amt;
    }
  });
}

async function loadWeatherData(city) {
  try {
    const url = `${WEATHERAPI_BASE_URL}/forecast.json`
      + `?key=${WEATHERAPI_KEY}`
      + `&q=${encodeURIComponent(city)}`
      + `&days=1&aqi=no&alerts=no`;

    const res  = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    cityNameHeader.textContent =
      `${data.location.name}, ${data.location.country} — Hourly Forecast`;

    const hours = data.forecast.forecastday[0].hour;

    const nowEpoch           = data.current.last_updated_epoch;
    const currentHourEpoch   = Math.floor(nowEpoch / 3600) * 3600;

    const upcoming = hours
      .filter(h => h.time_epoch >= currentHourEpoch)

    const displayCount = Math.min(upcoming.length, 12);
    const nextHours = upcoming.slice(0, displayCount);

    updateHourlyForecast(nextHours);
  } catch (err) {
    console.error('Fetch failed:', err);
  }
}


function updateHourlyForecast(hourlyArray) {
  hourlyCardsContainer.innerHTML = '';
  hourlyArray.forEach(h => {
    const timePart = h.time.split(' ')[1]; 
    const hourNum  = parseInt(timePart.split(':')[0], 10);
    const timeLabel = formatHour(hourNum);
    const tempF     = Math.round(h.temp_f);
    const iconUrl   = h.condition.icon;

    const card = document.createElement('div');
    card.className = 'hourly-card';
    card.innerHTML = `
      <div class="time">${timeLabel}</div>
      <div class="weather-icon">
        <img src="https:${iconUrl}" alt="${h.condition.text}" />
      </div>
      <div class="temperature">${tempF}°</div>
    `;
    hourlyCardsContainer.appendChild(card);
  });
}

function formatHour(h) {
  if (h === 0)   return '12 AM';
  if (h === 12)  return '12 PM';
  if (h > 12)    return `${h - 12} PM`;
  return `${h} AM`;
}


// 5-Day Forecast
const apiKey = "30479ac799194889b47204401253107";
const baseUrl = "http://api.weatherapi.com/v1";
const forecast = "/forecast.json"

async function getForecast(city) {
    const finalUrl = baseUrl + forecast + "?key=" + apiKey + "&q=" + city + "&days=5";

    try {
        let forecast = await fetch(finalUrl);
        const data = await forecast.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function showForecast(city){
    let data = await getForecast(city);
    const forcastRow = document.querySelector("#forecast-row");
    forcastRow.innerHTML = "";

    data.forecast.forecastday.forEach(days => {
        let date = days.date;
        console.log(date);
        let dateOb = new Date(date);
        let weekday = dateOb.toLocaleDateString("en-US", {weekday: "long", timeZone: "UTC"});

        let icon = days.day.condition.icon;
        let maxTemp = days.day.maxtemp_f;
        let minTemp = days.day.mintemp_f;

        forcastRow.innerHTML += 
            `<div class = "row">
                <div class = "col-6 text-center">
                    ${weekday} 
                </div>

                <div class = "col-3">
                </div>

                <div class = "col-3">
                    <img src= "${icon}"/> ${maxTemp}°F   ${minTemp}°F
                </div>
            </div>`;
    });
}



// Fun Fact API
const funFactApi = "https://api.api-ninjas.com/v1/facts?";
const  funFactApiKey = "2PEZcWfNMed2t9E75rD0KA==f0IhxzBGJslzMW7C";

// authenticate the API key
const params = {
    method: "GET",
    headers: {
        "X-Api-Key": funFactApiKey
    }
};

async function fetchFunFact() {
    try {
        const response = await fetch(funFactApi, params);
        console.log("Response from fun fact API:", response);
        return await response.json();
    } catch (error) {
        console.error("Error fetching fun fact:", error);
        fact.textContent = "Could not fetch fun fact. Please try again later.";
    }
}

async function showFunFact() {
    let facts = await fetchFunFact();
    if (facts && facts.length > 0) {
        fact.textContent = facts[0].fact;
    } else {
        fact.textContent = "No fun fact available at the moment.";
    }
}

// City Image API
const cityImageApi = "https://api.unsplash.com/search/photos?query=";
const cityImageApiKey = "AD14s-KmH-o_HxDLWIk_u0w7AmFYDJzDAhTfp4kgNyg";

async function fetchCityImage(city) {
    try {
        const response = await fetch(`${cityImageApi}${encodeURIComponent(city)}&client_id=${cityImageApiKey}`);
        console.log("Response from city image API:", response);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        return data.results[0]?.urls?.regular || null;
    } catch (error) {
        console.error("Error fetching city image:", error);
        return null;
    }
}

async function showCityImage(city) {
    const imageUrl = await fetchCityImage(city);

    if (imageUrl) {
        card.style.backgroundImage = `url(${imageUrl})`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
    } else {
        card.style.backgroundImage = 'none';
        console.log("No image found for the city:", city);
    }
}

// Weather Animation
function setWeatherAnimation(conditionText) {
  const condition = conditionText.toLowerCase();
  const video = document.getElementById("weather-video");
  const source = video.querySelector("source");

  video.appendChild(source);
  video.style.display = "block";

  let videoFile = "default.mp4";

  if (condition.includes("rain") || condition.includes("shower") || condition.includes("drizzle")) {
    videoFile = "light-rain.mp4";
  } else if (condition.includes("overcast")) {
    videoFile = "overcast.mp4";
  } else if (condition.includes("mostly sunny") || condition.includes("partly cloudy")) {
    videoFile = "partly-cloudy.mp4";
  } else if (condition.includes("sunny")) {
    videoFile = "sunny.mp4";
  } else if (condition.includes("clear")) {
    videoFile = "clear.mp4";
  } else if (condition.includes("snow")) {
    videoFile = "snow.mp4";
  } else if (condition.includes("heavy rain") || condition.includes("hail")) {
    videoFile = "heavy-rain.mp4";
  }  else {
    videoFile = "default.mp4";
  }

  source.setAttribute("src", `videos/${videoFile}`);
  video.load();
}

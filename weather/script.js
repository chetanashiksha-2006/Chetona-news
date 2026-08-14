/* ==========================================================
   Weather Widget — Instant Cache First & Geolocation
   ========================================================== */

const API_KEY = 'c3de2647f304e07ff81aa3d07734f9d3';
const DEFAULT_CITY = 'Kolkata';

// ২ মিনিট = ১২০,০০০ মিলিসেকেন্ড
const CACHE_EXPIRATION_TIME = 2 * 60 * 1000; 

const CURRENT_WEATHER_COORD_URL = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
const FORECAST_COORD_URL = (lat, lon) =>
  `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

const CURRENT_WEATHER_CITY_URL = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;
const FORECAST_CITY_URL = (city) =>
  `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`;

// ---------- DOM references ----------
const widgetLoader = document.getElementById('widgetLoader');
const widgetContent = document.getElementById('widgetContent');

const cityNameEl = document.getElementById('cityName');
const currentDateEl = document.getElementById('currentDate');
const currentIconEl = document.getElementById('currentIcon');
const currentTempEl = document.getElementById('currentTemp');
const currentDescEl = document.getElementById('currentDesc');
const rainChanceEl = document.getElementById('rainChance');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('windSpeed');
const forecastListEl = document.getElementById('forecastList');

// ==========================================================
// Date Formatter (English)
// ==========================================================
function formatDate(date) {
  const options = { month: 'long', day: 'numeric', year: 'numeric', weekday: 'long' };
  const formatted = date.toLocaleDateString('en-US', options);
  const parts = formatted.split(', ');
  if(parts.length >= 3) {
      return `${parts[1]}, ${parts[2]} | ${parts[0]}`;
  }
  return formatted;
}

function formatWeekdayShort(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

// ==========================================================
// Weather Icons
// ==========================================================
const ICON_MAP = {
  '01d': '☀️', '01n': '🌙', '02d': '⛅', '02n': '☁️',
  '03d': '☁️', '03n': '☁️', '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️', '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️', '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

function renderIcon(code) {
  return ICON_MAP[code] || '🌡️';
}

// ==========================================================
// Fetch & Render logic
// ==========================================================
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function renderCurrentWeather(data) {
  const { name, main, weather, wind } = data;
  const condition = weather && weather[0] ? weather[0] : { description: '', icon: '01d' };

  cityNameEl.textContent = name || 'Unknown Location';
  currentDateEl.textContent = formatDate(new Date());

  currentIconEl.textContent = renderIcon(condition.icon);
  currentTempEl.textContent = Math.round(main.temp);
  currentDescEl.textContent = condition.description;

  humidityEl.textContent = `${main.humidity}%`;
  windSpeedEl.textContent = `${Math.round(wind.speed * 3.6)} km/h`; 
}

function renderRainChanceFromForecast(forecastList) {
  if (!forecastList || !forecastList.length) {
    rainChanceEl.textContent = '0%';
    return;
  }
  const nearest = forecastList[0];
  const pop = typeof nearest.pop === 'number' ? nearest.pop : 0;
  rainChanceEl.textContent = `${Math.round(pop * 100)}%`;
}

function buildDailyForecast(forecastList) {
  const days = {}; 
  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().slice(0, 10);

    if (!days[dateKey]) days[dateKey] = { date, temps: [], items: [] };
    
    days[dateKey].temps.push(item.main.temp_max, item.main.temp_min);
    days[dateKey].items.push(item);
  });

  const todayKey = new Date().toISOString().slice(0, 10);

  return Object.keys(days)
    .filter((key) => key !== todayKey)
    .sort()
    .slice(0, 5)
    .map((key) => {
      const bucket = days[key];
      const high = Math.round(Math.max(...bucket.temps));
      const low = Math.round(Math.min(...bucket.temps));

      const midday = bucket.items.reduce((best, cur) => {
        const bestHour = new Date(best.dt * 1000).getHours();
        const curHour = new Date(cur.dt * 1000).getHours();
        return Math.abs(curHour - 12) < Math.abs(bestHour - 12) ? cur : best;
      });

      return { date: bucket.date, high, low, icon: midday.weather[0].icon };
    });
}

function renderForecast(forecastDays) {
  forecastListEl.innerHTML = '';

  forecastDays.forEach((day) => {
    const card = document.createElement('div');
    card.className = 'forecast-day';
    card.innerHTML = `
      <div class="forecast-day__name">${formatWeekdayShort(day.date)}</div>
      <div class="forecast-day__icon">${renderIcon(day.icon)}</div>
      <div class="forecast-day__temps">
        <span class="temp-high">${day.high}°</span>
        <span class="temp-low">${day.low}°</span>
      </div>
    `;
    forecastListEl.appendChild(card);
  });
}

// Function to fetch API and cache it
async function fetchWeatherData(currentUrl, forecastUrl) {
  try {
    console.log("Fetching fresh data from API 🌐");
    const [currentData, forecastData] = await Promise.all([
      fetchJSON(currentUrl),
      fetchJSON(forecastUrl),
    ]);

    // নতুন ডেটা ক্যাশে সেভ করা হচ্ছে
    const newDataToCache = {
      timestamp: new Date().getTime(),
      current: currentData,
      forecast: forecastData
    };
    localStorage.setItem('chetana_weather_cache', JSON.stringify(newDataToCache));

    renderCurrentWeather(currentData);
    renderRainChanceFromForecast(forecastData.list);
    renderForecast(buildDailyForecast(forecastData.list));

    widgetLoader.hidden = true;
    widgetContent.hidden = false;
    
  } catch (err) {
    console.error('Weather fetch failed:', err);
    widgetLoader.hidden = true;
  }
}

// ==========================================================
// App Init: Check Cache FIRST, then Geolocation if needed
// ==========================================================
function initApp() {
  // ১. প্রথমেই ক্যাশ চেক করা হচ্ছে
  const cachedDataString = localStorage.getItem('chetana_weather_cache');
    
  if (cachedDataString) {
    const cachedData = JSON.parse(cachedDataString);
    const currentTime = new Date().getTime();

    // ২. যদি ক্যাশে ২ মিনিটের নতুন ডেটা থাকে, সাথে সাথে রেন্ডার করবে
    if (currentTime - cachedData.timestamp < CACHE_EXPIRATION_TIME) {
      console.log("Loading instantly from Cache ⚡");
      
      renderCurrentWeather(cachedData.current);
      renderRainChanceFromForecast(cachedData.forecast.list);
      renderForecast(buildDailyForecast(cachedData.forecast.list));

      widgetLoader.hidden = true;
      widgetContent.hidden = false;
      return; // এখানেই থেমে যাবে, আর লোকেশন খুঁজবে না বা লোডার দেখাবে না
    }
  }

  // ৩. যদি ক্যাশ না থাকে বা পুরনো হয়ে যায়, তখন লোডার দেখিয়ে লোকেশন খুঁজবে
  widgetLoader.hidden = false;
  widgetContent.hidden = true;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeatherData(CURRENT_WEATHER_COORD_URL(lat, lon), FORECAST_COORD_URL(lat, lon));
      },
      (error) => {
        fetchWeatherData(CURRENT_WEATHER_CITY_URL(DEFAULT_CITY), FORECAST_CITY_URL(DEFAULT_CITY));
      }
    );
  } else {
    fetchWeatherData(CURRENT_WEATHER_CITY_URL(DEFAULT_CITY), FORECAST_CITY_URL(DEFAULT_CITY));
  }
}

// Start the app
initApp();

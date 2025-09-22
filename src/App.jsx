import { useState } from "react";
import "./App.css"; // keep your animations here

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const apiKey = "bcc63c23ad1841fd10934e030a0161e6"; // replace with your OpenWeatherMap key

  // 🔹 Fetch weather by city
  const getWeather = async () => {
    if (!city) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      if (!res.ok) throw new Error("City not found");
      const data = await res.json();
      setWeather(data);
      setError("");
      getForecast(data.coord.lat, data.coord.lon);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch weather by current location
  const getLocationWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(fetchByCoords, geoError);
    } else {
      alert("Geolocation not supported by this browser.");
    }
  };

  const fetchByCoords = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      if (!res.ok) throw new Error("Unable to fetch weather");
      const data = await res.json();
      setWeather(data);
      setError("");
      getForecast(lat, lon);
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  const geoError = (err) => {
    alert("Unable to get location: " + err.message);
  };

  // 🔹 Fetch 5-day forecast
  const getForecast = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();
      // pick one forecast per day (12:00)
      const daily = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00")
      );
      setForecast(daily);
    } catch (err) {
      console.error("Forecast error:", err);
    }
  };

  // 🔹 Card background colors
  const getCardBackground = (main) => {
    switch (main) {
      case "Clear":
        return "#f39c12"; // yellow/orange
      case "Rain":
        return "#3498db"; // blue
      case "Snow":
        return "#5dade2"; // light blue
      case "Clouds":
        return "#95a5a6"; // gray
      default:
        return "#7f8c8d"; // fallback gray
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-300 to-indigo-300 p-4">
      <div className="bg-white/90 shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          🌦 Weather App
        </h1>

        {/* 🔹 Search */}
        <div className="flex gap-2">
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <button
            onClick={getWeather}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {/* 🔹 Current Location Button */}
        <button
          onClick={getLocationWeather}
          className="mt-3 w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
        >
          📍 Get Current Location
        </button>

        {/* 🔹 Current Weather */}
        {loading && <p className="text-center mt-3">Loading...</p>}
        {error && <p className="text-red-500 mt-3">{error}</p>}
        {weather && (
          <div className="mt-4 text-center">
            <p className="text-3xl font-bold text-black">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="capitalize text-black">
              {weather.weather[0].description}
            </p>
            <p className="text-black">
              💧 {weather.main.humidity}% | 💨 {weather.wind.speed} m/s
            </p>
            <p className="text-sm text-gray-700">
              📍 {weather.name}, {weather.sys.country}
            </p>
          </div>
        )}

        {/* 🔹 Forecast */}
        {forecast.length > 0 && (
          <div className="forecast mt-6">
            <h2 className="text-center text-xl font-bold text-black mb-2">
              5-Day Forecast
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {forecast.map((day, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl shadow"
                  style={{
                    background: getCardBackground(day.weather[0].main),
                    color: "#fff",
                  }}
                >
                  <p className="font-bold">
                    {new Date(day.dt_txt).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </p>

                  {/* Animated Icons */}
                  {day.weather[0].main === "Clear" && <div className="sun"></div>}
                  {day.weather[0].main === "Rain" && <div className="rain"></div>}
                  {day.weather[0].main === "Snow" && <div className="snow"></div>}
                  {day.weather[0].main === "Clouds" && (
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt="clouds"
                    />
                  )}

                  {/* fallback */}
                  {!["Clear", "Rain", "Snow", "Clouds"].includes(
                    day.weather[0].main
                  ) && (
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt="forecast icon"
                    />
                  )}

                  <p>
                    {Math.round(day.main.temp_min)}°C /{" "}
                    {Math.round(day.main.temp_max)}°C
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

// components/WeatherWidget.jsx
"use client";

import { useWeather } from "../hooks/useWeather";
import { useState } from "react";
import { czechRegionalCities } from "../data/cities";

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState(czechRegionalCities[0]);
  const { weatherData, loading, error } = useWeather(
    selectedCity.latitude,
    selectedCity.longitude
  );
  const [activeTab, setActiveTab] = useState("current"); // 'current', 'daily', 'hourly'

  if (loading)
    return <div className="p-4 text-center">Načítání dat o počasí...</div>;
  if (error)
    return (
      <div className="p-4 text-center text-red-500">
        Chyba při načítání dat: {error}
      </div>
    );
  if (!weatherData) return null;

  const { current, daily, hourly, metadata } = weatherData;

  // Pomocná funkce pro formátování času
  const formatTime = (date) => {
    if (!date) return "N/A";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Pomocná funkce pro formátování data
  const formatDate = (date) => {
    if (!date) return "N/A";
    return date.toLocaleDateString();
  };

  // Pomocná funkce pro získání ikony počasí podle kódu
  const getWeatherIcon = (code) => {
    // Zde můžete implementovat mapování kódů počasí na ikony
    // Pro jednoduchost vrátíme emoji
    if (!code && code !== 0) return "❓";

    // WMO Weather interpretation codes (WW)
    // https://open-meteo.com/en/docs
    switch (code) {
      case 0:
        return "☀️"; // Clear sky
      case 1:
      case 2:
      case 3:
        return "🌤️"; // Mainly clear, partly cloudy, and overcast
      case 45:
      case 48:
        return "🌫️"; // Fog and depositing rime fog
      case 51:
      case 53:
      case 55:
        return "🌧️"; // Drizzle: Light, moderate, and dense intensity
      case 56:
      case 57:
        return "🌧️❄️"; // Freezing Drizzle: Light and dense intensity
      case 61:
      case 63:
      case 65:
        return "🌧️"; // Rain: Slight, moderate and heavy intensity
      case 66:
      case 67:
        return "🌧️❄️"; // Freezing Rain: Light and heavy intensity
      case 71:
      case 73:
      case 75:
        return "❄️"; // Snow fall: Slight, moderate, and heavy intensity
      case 77:
        return "❄️"; // Snow grains
      case 80:
      case 81:
      case 82:
        return "🌧️"; // Rain showers: Slight, moderate, and violent
      case 85:
      case 86:
        return "❄️"; // Snow showers slight and heavy
      case 95:
        return "⛈️"; // Thunderstorm: Slight or moderate
      case 96:
      case 99:
        return "⛈️🌨️"; // Thunderstorm with slight and heavy hail
      default:
        return "❓";
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Počasí pro {selectedCity.name}
      </h1>

      {/* Výběr města */}
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {czechRegionalCities.map((city) => (
            <button
              key={city.name}
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCity.name === city.name
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Přepínač záložek */}
      <div className="flex border-b mb-4">
        <button
          className={`py-2 px-4 ${
            activeTab === "current"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("current")}
        >
          Aktuální
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "daily"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("daily")}
        >
          Denní předpověď
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === "hourly"
              ? "border-b-2 border-blue-500 font-medium"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("hourly")}
        >
          Hodinová předpověď
        </button>
      </div>

      {/* Aktuální počasí */}
      {activeTab === "current" && (
        <div className="bg-blue-50 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Aktuální počasí</h2>
            <span className="text-sm text-gray-500">
              {current.time
                ? formatDate(current.time) + " " + formatTime(current.time)
                : "N/A"}
            </span>
          </div>

          <div className="flex flex-col md:flex-row">
            <div className="flex-1 mb-4 md:mb-0">
              <div className="flex items-center">
                <span className="text-5xl mr-4">
                  {getWeatherIcon(current.weatherCode)}
                </span>
                <div>
                  <div className="text-3xl font-bold">
                    {current.temperature !== null
                      ? `${current.temperature}°C`
                      : "N/A"}
                  </div>
                  <div className="text-gray-600">
                    Pocitově:{" "}
                    {current.apparentTemperature !== null
                      ? `${current.apparentTemperature}°C`
                      : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-2">
              <div>
                <div className="text-gray-500">Vlhkost</div>
                <div>
                  {current.humidity !== null ? `${current.humidity}%` : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Vítr</div>
                <div>
                  {current.windSpeed !== null
                    ? `${current.windSpeed} km/h`
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Srážky</div>
                <div>
                  {current.precipitation !== null
                    ? `${current.precipitation} mm`
                    : "N/A"}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Tlak</div>
                <div>
                  {current.pressure !== null
                    ? `${current.pressure} hPa`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Denní předpověď */}
      {activeTab === "daily" && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Předpověď na 7 dní</h2>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
            {daily.times.map((time, index) => (
              <div key={index} className="bg-white p-3 rounded shadow">
                <div className="font-medium text-center">
                  {formatDate(time)}
                </div>
                <div className="text-center text-3xl my-2">
                  {getWeatherIcon(daily.weatherCodes[index])}
                </div>
                <div className="flex justify-between text-sm">
                  <span>
                    {daily.temperatureMin[index] !== null
                      ? `${daily.temperatureMin[index]}°`
                      : "N/A"}
                  </span>
                  <span className="font-medium">
                    {daily.temperatureMax[index] !== null
                      ? `${daily.temperatureMax[index]}°`
                      : "N/A"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <div>
                    Srážky:{" "}
                    {daily.precipitationSum[index] !== null
                      ? `${daily.precipitationSum[index]} mm`
                      : "N/A"}
                  </div>
                  <div>
                    Vítr:{" "}
                    {daily.windSpeedMax[index] !== null
                      ? `${daily.windSpeedMax[index]} km/h`
                      : "N/A"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hodinová předpověď */}
      {activeTab === "hourly" && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Hodinová předpověď</h2>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-3 text-left">Čas</th>
                  <th className="py-2 px-3 text-center">Počasí</th>
                  <th className="py-2 px-3 text-right">Teplota</th>
                  <th className="py-2 px-3 text-right">Pocitová</th>
                  <th className="py-2 px-3 text-right">Srážky</th>
                  <th className="py-2 px-3 text-right">Vítr</th>
                </tr>
              </thead>
              <tbody>
                {hourly.times.slice(0, 24).map((time, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-3">{formatTime(time)}</td>
                    <td className="py-2 px-3 text-center text-xl">
                      {getWeatherIcon(hourly.weatherCode[index])}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {hourly.temperature[index] !== null
                        ? `${hourly.temperature[index]}°C`
                        : "N/A"}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {hourly.apparentTemperature[index] !== null
                        ? `${hourly.apparentTemperature[index]}°C`
                        : "N/A"}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {hourly.precipitation[index] !== null
                        ? `${hourly.precipitation[index]} mm`
                        : "N/A"}
                      {hourly.precipitationProbability[index] !== null
                        ? ` (${hourly.precipitationProbability[index]}%)`
                        : ""}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {hourly.windSpeed10m[index] !== null
                        ? `${hourly.windSpeed10m[index]} km/h`
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

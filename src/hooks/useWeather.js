// hooks/useWeather.js
import { useState, useEffect } from "react";

export function useWeather(latitude = 50.0399, longitude = 15.5603) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m",
          hourly:
            "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weather_code,surface_pressure,cloud_cover,cloud_cover_low,cloud_cover_mid,cloud_cover_high,visibility,wind_speed_10m,wind_speed_80m,wind_speed_120m,wind_speed_180m,wind_direction_10m,wind_direction_80m,wind_direction_120m,wind_direction_180m,wind_gusts_10m,temperature_80m,temperature_120m,temperature_180m",
          daily:
            "weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,daylight_duration,sunshine_duration,uv_index_max,uv_index_clear_sky_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant",
          timezone: "Europe/Berlin",
        });

        const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const rawData = await response.json();
        console.log("Raw API response:", rawData);

        // Zpracování dat do strukturovaných objektů
        const processedData = processWeatherData(rawData);
        setWeatherData(processedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWeatherData();
  }, [latitude, longitude]);

  return { weatherData, loading, error };
}

// Funkce pro zpracování dat z API do strukturovaných objektů
function processWeatherData(data) {
  // Zpracování aktuálních dat
  const current = {
    time: data.current?.time ? new Date(data.current.time) : null,
    temperature: data.current?.temperature_2m ?? null,
    apparentTemperature: data.current?.apparent_temperature ?? null,
    humidity: data.current?.relative_humidity_2m ?? null,
    isDay: data.current?.is_day ?? null,
    precipitation: data.current?.precipitation ?? null,
    rain: data.current?.rain ?? null,
    showers: data.current?.showers ?? null,
    snowfall: data.current?.snowfall ?? null,
    weatherCode: data.current?.weather_code ?? null,
    cloudCover: data.current?.cloud_cover ?? null,
    pressure: data.current?.pressure_msl ?? null,
    surfacePressure: data.current?.surface_pressure ?? null,
    windSpeed: data.current?.wind_speed_10m ?? null,
    windDirection: data.current?.wind_direction_10m ?? null,
    windGusts: data.current?.wind_gusts_10m ?? null,
  };

  // Zpracování denních dat
  const daily = {
    times: data.daily?.time?.map((t) => new Date(t)) ?? [],
    weatherCodes: data.daily?.weather_code ?? [],
    temperatureMax: data.daily?.temperature_2m_max ?? [],
    temperatureMin: data.daily?.temperature_2m_min ?? [],
    apparentTemperatureMax: data.daily?.apparent_temperature_max ?? [],
    apparentTemperatureMin: data.daily?.apparent_temperature_min ?? [],
    sunrise: data.daily?.sunrise?.map((t) => new Date(t)) ?? [],
    sunset: data.daily?.sunset?.map((t) => new Date(t)) ?? [],
    daylightDuration: data.daily?.daylight_duration ?? [],
    sunshineDuration: data.daily?.sunshine_duration ?? [],
    uvIndexMax: data.daily?.uv_index_max ?? [],
    uvIndexClearSkyMax: data.daily?.uv_index_clear_sky_max ?? [],
    precipitationSum: data.daily?.precipitation_sum ?? [],
    rainSum: data.daily?.rain_sum ?? [],
    showersSum: data.daily?.showers_sum ?? [],
    snowfallSum: data.daily?.snowfall_sum ?? [],
    precipitationHours: data.daily?.precipitation_hours ?? [],
    precipitationProbabilityMax:
      data.daily?.precipitation_probability_max ?? [],
    windSpeedMax: data.daily?.wind_speed_10m_max ?? [],
    windGustsMax: data.daily?.wind_gusts_10m_max ?? [],
    windDirectionDominant: data.daily?.wind_direction_10m_dominant ?? [],
  };

  // Zpracování hodinových dat
  const hourly = {
    times: data.hourly?.time?.map((t) => new Date(t)) ?? [],
    temperature: data.hourly?.temperature_2m ?? [],
    humidity: data.hourly?.relative_humidity_2m ?? [],
    apparentTemperature: data.hourly?.apparent_temperature ?? [],
    precipitationProbability: data.hourly?.precipitation_probability ?? [],
    precipitation: data.hourly?.precipitation ?? [],
    rain: data.hourly?.rain ?? [],
    showers: data.hourly?.showers ?? [],
    snowfall: data.hourly?.snowfall ?? [],
    snowDepth: data.hourly?.snow_depth ?? [],
    weatherCode: data.hourly?.weather_code ?? [],
    surfacePressure: data.hourly?.surface_pressure ?? [],
    cloudCover: data.hourly?.cloud_cover ?? [],
    cloudCoverLow: data.hourly?.cloud_cover_low ?? [],
    cloudCoverMid: data.hourly?.cloud_cover_mid ?? [],
    cloudCoverHigh: data.hourly?.cloud_cover_high ?? [],
    visibility: data.hourly?.visibility ?? [],
    windSpeed10m: data.hourly?.wind_speed_10m ?? [],
    windSpeed80m: data.hourly?.wind_speed_80m ?? [],
    windSpeed120m: data.hourly?.wind_speed_120m ?? [],
    windSpeed180m: data.hourly?.wind_speed_180m ?? [],
    windDirection10m: data.hourly?.wind_direction_10m ?? [],
    windDirection80m: data.hourly?.wind_direction_80m ?? [],
    windDirection120m: data.hourly?.wind_direction_120m ?? [],
    windDirection180m: data.hourly?.wind_direction_180m ?? [],
    windGusts10m: data.hourly?.wind_gusts_10m ?? [],
    temperature80m: data.hourly?.temperature_80m ?? [],
    temperature120m: data.hourly?.temperature_120m ?? [],
    temperature180m: data.hourly?.temperature_180m ?? [],
  };

  // Metadata
  const metadata = {
    latitude: data.latitude,
    longitude: data.longitude,
    timezone: data.timezone,
    timezoneAbbreviation: data.timezone_abbreviation,
    utcOffsetSeconds: data.utc_offset_seconds,
    elevation: data.elevation,
  };

  return {
    current,
    daily,
    hourly,
    metadata,
  };
}

import { useState, useEffect } from 'react';
import { WeatherData } from '../types';

// Map WMO Weather interpretation codes (WW) to human descriptions
function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code >= 45 && code <= 48) return 'Foggy';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 71 && code <= 77) return 'Snow Flurries';
  if (code >= 80 && code <= 82) return 'Heavy Rain';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Fair Weather';
}

const FALLBACK_WEATHER: WeatherData = {
  temperature: 28,
  humidity: 78,
  precipitation: 0.2,
  windSpeed: 8.5,
  condition: 'Partly Cloudy',
  isDay: true,
  dailyForecast: [
    { date: 'Today', dayName: 'Today', maxTemp: 31, minTemp: 22, condition: 'Partly Cloudy', rainProb: 20 },
    { date: 'Tomorrow', dayName: 'Tomorrow', maxTemp: 29, minTemp: 21, condition: 'Light Showers', rainProb: 65 },
    { date: 'Day 3', dayName: 'Day 3', maxTemp: 28, minTemp: 21, condition: 'Scattered Rain', rainProb: 80 },
    { date: 'Day 4', dayName: 'Day 4', maxTemp: 30, minTemp: 22, condition: 'Fair Weather', rainProb: 15 },
  ],
};

export function useWeather(latitude?: number, longitude?: number) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Default to central agricultural region if no coords provided (e.g. 13.6937, 75.2415)
    const lat = latitude ?? 13.6937;
    const lon = longitude ?? 75.2415;

    let isMounted = true;
    setLoading(true);

    const fetchWeather = async () => {
      try {
        const cacheKey = `weather_${lat.toFixed(3)}_${lon.toFixed(3)}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          const parsed = JSON.parse(cached);
          // 15-minute cache
          if (Date.now() - parsed.timestamp < 15 * 60 * 1000) {
            if (isMounted) {
              setWeather(parsed.data);
              setLoading(false);
              return;
            }
          }
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch Open-Meteo weather');
        const data = await res.json();

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dailyForecast = (data.daily?.time || []).slice(0, 4).map((timeStr: string, idx: number) => {
          const d = new Date(timeStr);
          const dayName = idx === 0 ? 'Today' : idx === 1 ? 'Tomorrow' : dayNames[d.getDay()];
          return {
            date: timeStr,
            dayName,
            maxTemp: Math.round(data.daily.temperature_2m_max[idx]),
            minTemp: Math.round(data.daily.temperature_2m_min[idx]),
            condition: getWeatherCondition(data.daily.weather_code[idx]),
            rainProb: data.daily.precipitation_probability_max[idx] ?? 0,
          };
        });

        const weatherResult: WeatherData = {
          temperature: Math.round(data.current?.temperature_2m ?? 28),
          humidity: Math.round(data.current?.relative_humidity_2m ?? 70),
          precipitation: data.current?.precipitation ?? 0,
          windSpeed: Math.round(data.current?.wind_speed_10m ?? 8),
          condition: getWeatherCondition(data.current?.weather_code ?? 0),
          isDay: Boolean(data.current?.is_day ?? 1),
          dailyForecast,
        };

        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: weatherResult,
          timestamp: Date.now(),
        }));

        if (isMounted) {
          setWeather(weatherResult);
          setLoading(false);
        }
      } catch (err: any) {
        console.warn('Weather API notice:', err.message);
        if (isMounted) {
          setWeather(FALLBACK_WEATHER);
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchWeather();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  return { weather, loading, error };
}

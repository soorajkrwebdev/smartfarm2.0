import React from 'react';
import { useWeather } from '../../hooks/useWeather';
import { Droplets, Wind, CloudRain } from 'lucide-react';
import { Farm } from '../../types';

interface WeatherWidgetProps {
  farm?: Farm | null;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ farm }) => {
  const { weather, loading } = useWeather(farm?.latitude, farm?.longitude);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-md animate-pulse">
        <div className="h-4 bg-emerald-700/50 rounded w-1/3 mb-4" />
        <div className="h-10 bg-emerald-700/50 rounded w-1/2 mb-6" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 bg-emerald-700/40 rounded-xl" />
          <div className="h-12 bg-emerald-700/40 rounded-xl" />
          <div className="h-12 bg-emerald-700/40 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!weather) return null;

  // Agricultural advisory based on rainfall and temp
  const getAgriWeatherAdvisory = () => {
    const rainNextDays = weather.dailyForecast.some(d => d.rainProb > 50);
    if (weather.precipitation > 2 || rainNextDays) {
      return 'Rain forecast detected: ensure drainage channels are cleared; avoid foliar botanical sprays until clear sky returns.';
    }
    if (weather.temperature > 34) {
      return 'High temperatures: maintain soil mulch layers to curb evapotranspiration; irrigate during early morning or late evening.';
    }
    return 'Favorable conditions: ideal window for vermicompost application, biofertilizer inoculation, and light intercultural weeding.';
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-emerald-850 to-teal-950 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden border border-emerald-700/30">
      {/* Decorative background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top row: Farm & condition */}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/90 block">
            Hyperlocal Weather & Agronomic Advisory
          </span>
          <h4 className="text-sm font-semibold text-emerald-100 mt-0.5 truncate max-w-[200px] sm:max-w-xs">
            {farm ? farm.name : 'Regional Agriculture Forecast'}
          </h4>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200">
          {weather.condition}
        </span>
      </div>

      {/* Main Temperature & Key Metrics */}
      <div className="my-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl sm:text-5xl font-extrabold tracking-tight font-heading">
            {weather.temperature}°C
          </span>
          <div className="text-xs text-emerald-200/80">
            <p>Feels like {weather.temperature + 1}°C</p>
            <p className="text-[11px] text-emerald-300/70">
              {farm?.location || 'Western Ghats / Peninsular India'}
            </p>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
            <Droplets className="w-4 h-4 mx-auto text-emerald-300 mb-1" />
            <span className="block text-[10px] text-emerald-200 uppercase font-bold">Humidity</span>
            <span className="font-bold text-white text-sm">{weather.humidity}%</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
            <CloudRain className="w-4 h-4 mx-auto text-sky-300 mb-1" />
            <span className="block text-[10px] text-emerald-200 uppercase font-bold">Rainfall</span>
            <span className="font-bold text-white text-sm">{weather.precipitation} mm</span>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-2.5 border border-white/10">
            <Wind className="w-4 h-4 mx-auto text-teal-300 mb-1" />
            <span className="block text-[10px] text-emerald-200 uppercase font-bold">Wind</span>
            <span className="font-bold text-white text-sm">{weather.windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* Agronomic advisory note */}
      <div className="bg-emerald-950/70 border border-emerald-700/40 rounded-2xl p-3 text-xs text-emerald-100/90 leading-relaxed mb-4 relative z-10">
        <span className="font-bold text-emerald-300 mr-1.5">Agronomy Alert:</span>
        {getAgriWeatherAdvisory()}
      </div>

      {/* 4-Day Forecast Strip */}
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-emerald-800/60 relative z-10">
        {weather.dailyForecast.map((day, idx) => (
          <div key={idx} className="text-center p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="block text-[10px] font-bold text-emerald-200 uppercase">{day.dayName}</span>
            <span className="block text-xs font-bold text-white my-0.5">{day.maxTemp}° / {day.minTemp}°</span>
            <span className="block text-[9px] text-emerald-300/80 truncate">{day.condition}</span>
            <span className="inline-block text-[9px] font-semibold text-sky-300 mt-0.5">
              🌧 {day.rainProb}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

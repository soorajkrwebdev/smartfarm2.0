import React, { useState } from 'react';
import { useFarmData } from '../../contexts/FarmContext';
import { useWeather } from '../../hooks/useWeather';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import {
  MapPin,
  Search,
  Droplets,
  Wind,
  CloudRain,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Agricultural context hints
// These are general contextual observations — NOT commands or diagnoses.
// They are triggered by weather thresholds and are purely informational.
// ─────────────────────────────────────────────────────────────────────────────
interface ContextHint {
  level: 'info' | 'caution' | 'ok';
  message: string;
}

function getAgriculturalHints(
  precipitation: number,
  rainProbability: number,
  humidity: number,
  windSpeed: number,
  temperature: number,
): ContextHint[] {
  const hints: ContextHint[] = [];

  // High rain probability
  if (rainProbability >= 70) {
    hints.push({
      level: 'caution',
      message:
        `Forecast indicates ${rainProbability}% rain probability today. ` +
        'Consider checking crops susceptible to fungal conditions if this is a pattern over multiple days.',
    });
  }

  // Recent precipitation
  if (precipitation > 5) {
    hints.push({
      level: 'caution',
      message:
        `Significant recent precipitation (${precipitation} mm). ` +
        'If drainage in crop basins is inadequate, it may be worth inspecting for waterlogging.',
    });
  }

  // High sustained humidity
  if (humidity >= 85) {
    hints.push({
      level: 'caution',
      message:
        `Relative humidity is ${humidity}%. Prolonged high humidity is associated with conditions ` +
        'that can support foliar disease development in some crops — consider scouting.',
    });
  } else if (humidity >= 70 && humidity < 85) {
    hints.push({
      level: 'info',
      message: `Humidity at ${humidity}%. Conditions are within a moderate range for most plantation crops.`,
    });
  }

  // Temperature context
  if (temperature >= 38) {
    hints.push({
      level: 'caution',
      message:
        `High temperature (${temperature}°C). Consider checking soil moisture near young plants ` +
        'and whether irrigation timing should be adjusted to early morning or evening.',
    });
  } else if (temperature <= 15) {
    hints.push({
      level: 'info',
      message:
        `Temperature is relatively low (${temperature}°C). ` +
        'Activity of some soil organisms and beneficial insects may slow at lower temperatures.',
    });
  }

  // High wind
  if (windSpeed >= 30) {
    hints.push({
      level: 'caution',
      message:
        `Wind speed is ${windSpeed} km/h. Foliar spraying is generally not recommended in windy conditions ` +
        'due to drift — consider postponing any scheduled applications.',
    });
  }

  // All clear
  if (hints.length === 0) {
    hints.push({
      level: 'ok',
      message:
        'Current forecast conditions appear generally suitable for routine farm activities. ' +
        'Always verify with your own field observations.',
    });
  }

  return hints;
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export const WeatherPage: React.FC = () => {
  const { farms } = useFarmData();
  const [q, setQ] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  const selectedFarm = selectedFarmId
    ? farms.find(f => f.id === selectedFarmId)
    : null;

  const hasCoords =
    selectedFarm?.latitude != null && selectedFarm?.longitude != null;

  const { weather, loading: weatherLoading, error: weatherError } = useWeather(
    selectedFarm?.latitude,
    selectedFarm?.longitude,
  );

  const filteredFarms = farms.filter(
    f =>
      f.name.toLowerCase().includes(q.toLowerCase()) ||
      f.location.toLowerCase().includes(q.toLowerCase()),
  );

  const hints =
    weather
      ? getAgriculturalHints(
          weather.precipitation,
          weather.rainProbability,
          weather.humidity,
          weather.windSpeed,
          weather.temperature,
        )
      : [];

  const hintColors: Record<ContextHint['level'], string> = {
    ok:      'bg-emerald-50 border-emerald-200 text-emerald-900',
    info:    'bg-blue-50    border-blue-200    text-blue-900',
    caution: 'bg-amber-50   border-amber-200   text-amber-900',
  };
  const hintIcons: Record<ContextHint['level'], React.ReactNode> = {
    ok:      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
    info:    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
    caution: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Weather Intelligence</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Farm-location weather forecast via Open-Meteo API
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="emerald" size="sm">Open-Meteo</Badge>
          <a
            href="https://open-meteo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-400 hover:text-emerald-600 flex items-center gap-0.5"
          >
            open-meteo.com <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — farm selector */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/70 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-sm">Select Farm</h3>
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search farms..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>

            {farms.length === 0 ? (
              <EmptyState
                icon={<MapPin className="w-8 h-8" />}
                title="No farms added"
                description="Add a farm with GPS coordinates to view weather."
              />
            ) : filteredFarms.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No farms match your search.</p>
            ) : (
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {filteredFarms.map(farm => {
                  const isSelected = selectedFarmId === farm.id;
                  const farmHasCoords = farm.latitude != null && farm.longitude != null;
                  return (
                    <button
                      key={farm.id}
                      onClick={() => setSelectedFarmId(farm.id)}
                      className={`w-full text-left rounded-xl border px-3 py-2 transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-300'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-800 truncate">{farm.name}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{farm.location}</p>
                      {!farmHasCoords && (
                        <p className="text-[10px] text-amber-600 font-medium mt-0.5 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          No GPS coordinates — edit farm to add location
                        </p>
                      )}
                      {farmHasCoords && (
                        <p className="text-[10px] text-emerald-600 mt-0.5">
                          {farm.latitude?.toFixed(4)}°N {farm.longitude?.toFixed(4)}°E
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Source notice */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 text-xs text-slate-500 space-y-1.5">
            <p className="font-semibold text-slate-700">About this data</p>
            <p>Forecasts come from the Open-Meteo free weather API, based on the GPS coordinates of your selected farm. Data is cached for 15 minutes.</p>
            <p>This is a forecast, not a sensor reading. Actual field conditions may differ.</p>
            <a
              href="https://open-meteo.com/en/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-600 hover:underline font-medium"
            >
              Open-Meteo documentation <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Right — weather display */}
        <div className="lg:col-span-2 space-y-4">
          {/* No farm selected */}
          {!selectedFarm && (
            <div className="bg-white rounded-2xl border p-10 text-center">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-700 mb-1">Select a farm</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto">
                Choose a farm from the list to see its location-based weather forecast.
              </p>
            </div>
          )}

          {/* Farm selected but no coordinates */}
          {selectedFarm && !hasCoords && (
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-8 text-center">
              <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
              <h3 className="font-semibold text-amber-900 mb-1">
                No GPS coordinates for {selectedFarm.name}
              </h3>
              <p className="text-sm text-amber-700 max-w-sm mx-auto">
                Edit this farm and use the map picker to set its latitude and longitude.
                Weather forecasts are based on coordinates — without them no forecast can be shown.
              </p>
            </div>
          )}

          {/* Loading */}
          {selectedFarm && hasCoords && weatherLoading && (
            <div className="bg-white rounded-2xl border p-10 text-center">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500">
                Fetching forecast for {selectedFarm.name}...
              </p>
            </div>
          )}

          {/* Error */}
          {selectedFarm && hasCoords && !weatherLoading && weatherError && (
            <div className="bg-rose-50 rounded-2xl border border-rose-200 p-8 text-center">
              <AlertTriangle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
              <h3 className="font-semibold text-rose-900 mb-1">Unable to load forecast</h3>
              <p className="text-sm text-rose-700 max-w-sm mx-auto">{weatherError}</p>
            </div>
          )}

          {/* Weather data */}
          {selectedFarm && hasCoords && !weatherLoading && weather && (
            <>
              {/* Current conditions card */}
              <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-6 text-white shadow-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-300/90 tracking-wider">
                      Farm-Location Weather Forecast
                    </span>
                    <h3 className="text-base font-bold text-emerald-50 mt-0.5">
                      {selectedFarm.name}
                    </h3>
                    <p className="text-[10px] text-emerald-400 mt-0.5">
                      {selectedFarm.latitude?.toFixed(4)}°N, {selectedFarm.longitude?.toFixed(4)}°E
                    </p>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-800/80 border border-emerald-700/60">
                    {weather.condition}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-4 flex-wrap">
                  <div>
                    <span className="text-5xl font-extrabold">{weather.temperature}°C</span>
                    <span className="text-sm text-emerald-200/70 ml-2">
                      {weather.isDay ? 'Daytime' : 'Night-time'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                      <Droplets className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
                      <span className="text-[10px] text-emerald-200 uppercase font-bold block">Humidity</span>
                      <span className="block font-bold text-white text-sm">{weather.humidity}%</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                      <CloudRain className="w-4 h-4 text-sky-300 mx-auto mb-1" />
                      <span className="text-[10px] text-emerald-200 uppercase font-bold block">Rain prob.</span>
                      <span className="block font-bold text-white text-sm">{weather.rainProbability}%</span>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
                      <Wind className="w-4 h-4 text-teal-300 mx-auto mb-1" />
                      <span className="text-[10px] text-emerald-200 uppercase font-bold block">Wind</span>
                      <span className="block font-bold text-white text-sm">{weather.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-emerald-400/70 mt-4 border-t border-white/10 pt-3">
                  Source: {weather.source} · Retrieved: {new Date(weather.fetchedAt).toLocaleTimeString()}
                </p>
              </div>

              {/* 5-day forecast */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
                <h4 className="font-bold text-slate-800 text-sm mb-3">5-Day Forecast</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {weather.dailyForecast.map((day, idx) => (
                    <div
                      key={idx}
                      className="text-center p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">
                        {day.dayName}
                      </span>
                      <span className="block text-base font-bold text-slate-800 my-1">
                        {day.maxTemp}° / {day.minTemp}°
                      </span>
                      <span className="text-[10px] text-slate-500 block">{day.condition}</span>
                      <span className="text-[10px] font-semibold text-sky-600 block">
                        {day.rainProb}% rain
                      </span>
                      {day.precipitationSum != null && day.precipitationSum > 0 && (
                        <span className="text-[10px] text-sky-500 block">
                          {day.precipitationSum} mm
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Agricultural context hints */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">Agricultural Context</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Observations only — not farm commands
                  </span>
                </div>

                {hints.map((hint, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 p-3 rounded-xl border text-xs leading-relaxed ${hintColors[hint.level]}`}
                  >
                    {hintIcons[hint.level]}
                    <span>{hint.message}</span>
                  </div>
                ))}

                <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  These are general observations based on forecast thresholds. They are not crop-specific
                  diagnoses or recommendations. Always verify with your own field scouting.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

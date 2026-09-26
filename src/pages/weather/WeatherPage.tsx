import React, { useState } from 'react';
import { useFarmData } from '../../contexts/FarmContext';
import { useWeather } from '../../hooks/useWeather';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { MapPin, Search, Plus, Droplets, Wind, CloudRain } from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { farms } = useFarmData();
  const [q, setQ] = useState('');
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  const selectedFarm = selectedFarmId ? farms.find(f => f.id === selectedFarmId) : null;
  const { weather, loading: _weatherLoading } = useWeather(selectedFarm?.latitude, selectedFarm?.longitude);

  const filteredFarms = farms.filter(f =>
    f.name.toLowerCase().includes(q.toLowerCase()) ||
    f.location.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold text-slate-800'>Weather Intelligence</h1>
          <p className='text-sm text-slate-500 mt-0.5'>Hyperlocal forecasts for field-level advisory</p>
        </div>
        <Badge variant='emerald' size='sm'>Open-Meteo</Badge>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl border border-slate-200/70 p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-bold text-slate-800'>Select Farm Location</h3>
              <MapPin className='w-4 h-4 text-emerald-600' />
            </div>
            <div className='relative mb-3'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <input
                type='text'
                placeholder='Search farms...'
                value={q}
                onChange={e => setQ(e.target.value)}
                className='w-full pl-9 pr-3 py-2 text-sm text-slate-800 bg-slate-50 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none'
              />
            </div>
            {filteredFarms.length > 0 ? (
              <div className='space-y-1.5 max-h-64 overflow-y-auto'>
                {filteredFarms.map(farm => {
                  const _isSel = selectedFarmId === farm.id;
                  return (
                    <div key={farm.id} onClick={() => setSelectedFarmId(farm.id)}
                      className='rounded-xl border p-2 cursor-pointer bg-white border-slate-200'>
                      <p className='text-sm font-semibold text-slate-800 truncate'>{farm.name}</p>
                      <p className='text-xs text-slate-500 truncate'>{farm.location}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState icon={<MapPin className='w-8 h-8' />} title='No farms found' description='Add a farm to see weather.' actionText='Add Farm' />
            )}
          </div>
        </div>

        <div className='lg:col-span-2'>
          {!selectedFarm ? (
            <div className='bg-white rounded-2xl border p-8 text-center'>
              <MapPin className='w-12 h-12 text-slate-300 mx-auto mb-4' />
              <h3 className='font-semibold text-slate-700 mb-1'>Select or add a farm first</h3>
              <p className='text-sm text-slate-500 max-w-sm mx-auto pb-4'>Choose a farm to get weather data.</p>
              <Button variant='primary' icon={<Plus className='w-4 h-4' />}>Add Farm</Button>
            </div>
          ) : weather ? (
            <div className='space-y-4'>
              <div className='bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-6 text-white shadow-lg'>
                <div className='flex items-start justify-between'>
                  <div>
                    <span className='text-[10px] font-bold uppercase text-emerald-300/90'>Hyperlocal Forecast</span>
                    <h3 className='text-base font-bold text-emerald-50 mt-0.5'>{selectedFarm.name}</h3>
                  </div>
                  <span className='text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-800/80'>{weather.condition}</span>
                </div>
                <div className='mt-4 flex justify-between'>
                  <div>
                    <span className='text-5xl font-extrabold'>{weather.temperature}°C</span>
                    <span className='text-sm text-emerald-200/80 ml-2'>Feels like {weather.temperature + 1}°C</span>
                  </div>
                  <div className='grid grid-cols-3 gap-3 text-center'>
                    <div className='bg-white/10 rounded-xl p-2 border flex items-center gap-1.5'>
                      <Droplets className='w-3 h-3 text-emerald-300' />
                      <span className='text-[9px] text-emerald-200 uppercase font-bold'>Humidity</span>
                      <span className='block font-bold text-white text-sm'>{weather.humidity}%</span>
                    </div>
                    <div className='bg-white/10 rounded-xl p-2 border flex items-center gap-1.5'>
                      <CloudRain className='w-3 h-3 text-sky-300' />
                      <span className='text-[9px] text-emerald-200 uppercase font-bold'>Rain</span>
                      <span className='block font-bold text-white text-sm'>{weather.precipitation} mm</span>
                    </div>
                    <div className='bg-white/10 rounded-xl p-2 border flex items-center gap-1.5'>
                      <Wind className='w-3 h-3 text-teal-300' />
                      <span className='text-[9px] text-emerald-200 uppercase font-bold'>Wind</span>
                      <span className='block font-bold text-white text-sm'>{weather.windSpeed} km/h</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-white rounded-2xl border p-4'>
                <h4 className='font-bold text-slate-800 mb-3'>4-Day Forecast</h4>
                <div className='grid grid-cols-4 gap-2'>
                  {weather.dailyForecast.map((day, idx) => (
                    <div key={idx} className='text-center p-2 rounded-xl bg-slate-50 border'>
                      <span className='text-[10px] font-bold text-slate-500 uppercase'>{day.dayName}</span>
                      <span className='block text-lg font-bold text-slate-800 my-1'>{day.maxTemp}° / {day.minTemp}°</span>
                      <span className='text-xs text-slate-500'>{day.condition}</span>
                      <span className='text-[10px] font-semibold text-sky-600'>{day.rainProb}% rain</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className='bg-white rounded-2xl border p-8 text-center'>
              <div className='h-8 bg-emerald-100 rounded w-24 mx-auto mb-4 animate-pulse' />
              <p className='text-sm text-slate-500'>Loading weather data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

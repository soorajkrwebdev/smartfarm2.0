import React from 'react';
import { Search, X } from 'lucide-react';
import { ACTIVITY_TYPES } from './ActivityFormModal';
import { useFarmData } from '../../contexts/FarmContext';

interface ActivityFiltersProps {
  farmFilter: string;
  onFarmFilterChange: (id: string) => void;
  cropFilter: string;
  onCropFilterChange: (id: string) => void;
  typeFilter: string;
  onTypeFilterChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onReset: () => void;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  farmFilter,
  onFarmFilterChange,
  cropFilter,
  onCropFilterChange,
  typeFilter,
  onTypeFilterChange,
  searchQuery,
  onSearchChange,
  onReset,
}) => {
  const { farms, crops } = useFarmData();

  const availableCrops = farmFilter
    ? crops.filter(c => c.farm_id === farmFilter)
    : crops;

  const hasActiveFilters = Boolean(farmFilter || cropFilter || typeFilter || searchQuery);

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3 mb-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activities or notes..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        {/* Farm Filter */}
        <select
          value={farmFilter}
          onChange={e => {
            onFarmFilterChange(e.target.value);
            onCropFilterChange('');
          }}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
        >
          <option value="">All Farms ({farms.length})</option>
          {farms.map(f => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>

        {/* Crop Filter */}
        <select
          value={cropFilter}
          onChange={e => onCropFilterChange(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
        >
          <option value="">All Crops ({availableCrops.length})</option>
          {availableCrops.map(c => (
            <option key={c.id} value={c.id}>
              {c.crop_name} {c.variety ? `(${c.variety})` : ''}
            </option>
          ))}
        </select>

        {/* Activity Type Filter */}
        <select
          value={typeFilter}
          onChange={e => onTypeFilterChange(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
        >
          <option value="">All Activity Types</option>
          {ACTIVITY_TYPES.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium">Filters active</span>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1 text-slate-600 hover:text-emerald-700 font-semibold cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Farm } from '../../types';
import { Badge } from '../common/Badge';
import { Trees, MapPin, Droplets, Mountain, Edit3, Trash2, Sprout, ArrowRight } from 'lucide-react';

interface FarmCardProps {
  farm: Farm;
  cropsCount: number;
  activitiesCount: number;
  onEdit: (farm: Farm) => void;
  onDelete: (id: string) => void;
  onSelectFarm: (id: string) => void;
  isSelected?: boolean;
}

export const FarmCard: React.FC<FarmCardProps> = ({
  farm,
  cropsCount,
  activitiesCount,
  onEdit,
  onDelete,
  onSelectFarm,
  isSelected = false,
}) => {
  const getOrganicStatusBadge = (status: Farm['organic_status']) => {
    switch (status) {
      case 'certified_organic':
        return <Badge variant="emerald">Certified Organic</Badge>;
      case 'in_conversion':
        return <Badge variant="amber">In Conversion (C1-C3)</Badge>;
      case 'non_certified_organic':
        return <Badge variant="blue">Organic Practices</Badge>;
      default:
        return <Badge variant="slate">Conventional</Badge>;
    }
  };

  const getMethodBadge = (method: Farm['farming_method']) => {
    return (
      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 capitalize">
        {method}
      </span>
    );
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isSelected
          ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
      }`}
    >
      {/* Top Banner accent */}
      <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

      <div className="p-5 flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {getOrganicStatusBadge(farm.organic_status)}
              {getMethodBadge(farm.farming_method)}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate group-hover:text-emerald-700 transition-colors">
              {farm.name}
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{farm.location}</span>
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(farm)}
              title="Edit Farm"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(farm.id)}
              title="Delete Farm"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        {farm.description && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {farm.description}
          </p>
        )}

        {/* Characteristic Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs py-3 my-2 border-y border-slate-100 bg-slate-50/50 rounded-xl px-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Area</span>
            <span className="font-bold text-slate-800 text-sm">{farm.area} {farm.area_unit}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Season</span>
            <span className="font-semibold text-slate-700">{farm.current_season}</span>
          </div>
          {farm.soil_type && (
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Mountain className="w-2.5 h-2.5" /> Soil
              </span>
              <span className="font-medium text-slate-700 truncate block">{farm.soil_type}</span>
            </div>
          )}
          {farm.irrigation_type && (
            <div className="truncate">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Droplets className="w-2.5 h-2.5" /> Irrigation
              </span>
              <span className="font-medium text-slate-700 truncate block">{farm.irrigation_type}</span>
            </div>
          )}
        </div>

        {/* Summary badges (Crops and Activities) */}
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 mt-3">
          <span className="flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>{cropsCount} {cropsCount === 1 ? 'Crop' : 'Crops'}</span>
          </span>
          <span className="text-slate-300">•</span>
          <span>{activitiesCount} Activities Logged</span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => onSelectFarm(farm.id)}
          className={`text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isSelected ? 'text-emerald-700' : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          <span>{isSelected ? 'Currently Selected' : 'Select This Farm'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        {farm.latitude && farm.longitude && (
          <span className="text-[10px] text-slate-400 font-mono">
            {farm.latitude.toFixed(2)}°N, {farm.longitude.toFixed(2)}°E
          </span>
        )}
      </div>
    </div>
  );
};

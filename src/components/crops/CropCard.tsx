import React from 'react';
import { FarmCrop, CropActivity } from '../../types';
import { Badge } from '../common/Badge';
import { CropTimeline } from './CropTimeline';
import { Sprout, Calendar, Trees, Edit3, Trash2, PlusCircle, CheckCircle2 } from 'lucide-react';

interface CropCardProps {
  crop: FarmCrop;
  activities?: CropActivity[];
  onEdit: (crop: FarmCrop) => void;
  onDelete: (id: string) => void;
  onRecordActivity: (crop: FarmCrop) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  crop,
  activities = [],
  onEdit,
  onDelete,
  onRecordActivity,
}) => {
  const getStageBadge = (stage: FarmCrop['growth_stage']) => {
    switch (stage) {
      case 'Nursery / Land Prep':
        return <Badge variant="slate">{stage}</Badge>;
      case 'Vegetative':
        return <Badge variant="emerald">{stage}</Badge>;
      case 'Flowering':
        return <Badge variant="purple">{stage}</Badge>;
      case 'Fruiting / Podding':
        return <Badge variant="amber">{stage}</Badge>;
      case 'Maturity / Ripening':
        return <Badge variant="indigo">{stage}</Badge>;
      case 'Harvesting':
        return <Badge variant="rose">{stage}</Badge>;
      default:
        return <Badge variant="slate">{stage}</Badge>;
    }
  };

  const getStatusBadge = (status: FarmCrop['status']) => {
    switch (status) {
      case 'active':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">Active</span>;
      case 'harvested':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">Harvested</span>;
      case 'fallow':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">Fallow</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">Failed</span>;
    }
  };

  const cropActivities = activities.filter(a => a.crop_id === crop.id);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div className="p-5 flex-1">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {getStatusBadge(crop.status)}
              {getStageBadge(crop.growth_stage)}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
              {crop.crop_name}
            </h3>
            {crop.variety && (
              <p className="text-xs font-semibold text-emerald-700">
                Variety: {crop.variety}
              </p>
            )}
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Trees className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{crop.farm_name || 'Assigned Farm'}</span>
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(crop)}
              title="Edit Crop"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(crop.id)}
              title="Delete Crop"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs py-2.5 my-3 border-y border-slate-100 bg-slate-50/60 rounded-xl px-3">
          {crop.area && (
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Cultivated</span>
              <span className="font-bold text-slate-800">{crop.area} {crop.area_unit || 'acres'}</span>
            </div>
          )}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Planted On</span>
            <span className="font-semibold text-slate-700">{crop.planting_date}</span>
          </div>
          {crop.expected_harvest_date ? (
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Exp. Harvest</span>
              <span className="font-semibold text-slate-700">{crop.expected_harvest_date}</span>
            </div>
          ) : (
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Method</span>
              <span className="font-semibold text-slate-700 capitalize">{crop.farming_method || 'Organic'}</span>
            </div>
          )}
        </div>

        {/* Notes */}
        {crop.notes && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
            {crop.notes}
          </p>
        )}

        {/* Life-cycle Timeline */}
        <div className="pt-2">
          <CropTimeline
            growthStage={crop.growth_stage}
            activities={cropActivities}
          />
        </div>
      </div>

      {/* Footer Quick Action */}
      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">
          {cropActivities.length} {cropActivities.length === 1 ? 'activity logged' : 'activities logged'}
        </span>
        <button
          onClick={() => onRecordActivity(crop)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100/60 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Record Activity</span>
        </button>
      </div>
    </div>
  );
};

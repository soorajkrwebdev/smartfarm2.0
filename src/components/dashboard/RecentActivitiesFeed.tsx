import React from 'react';
import { CropActivity } from '../../types';
import { Badge } from '../common/Badge';
import { ArrowRight, ClipboardList, Calendar } from 'lucide-react';

interface RecentActivitiesFeedProps {
  activities: CropActivity[];
  onViewAll: () => void;
  onRecordActivity: () => void;
}

export const RecentActivitiesFeed: React.FC<RecentActivitiesFeedProps> = ({
  activities,
  onViewAll,
  onRecordActivity,
}) => {
  const recent = activities.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Farm Operations</h3>
          <p className="text-xs text-slate-500">Logged activities and input events</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recent.length === 0 ? (
        <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <ClipboardList className="w-7 h-7 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-700">No activities recorded yet</p>
          <p className="text-[11px] text-slate-400 mt-0.5 mb-3">Record mulch, compost, irrigation or harvest events</p>
          <button
            onClick={onRecordActivity}
            className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
          >
            + Record First Activity
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map(act => (
            <div
              key={act.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/60 transition-colors border border-slate-100"
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold text-slate-800">{act.activity_type}</span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                    <Calendar className="w-2.5 h-2.5" /> {act.activity_date}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  <span className="font-semibold text-slate-700">{act.farm_name}</span>
                  {act.crop_name && <span> • {act.crop_name}</span>}
                </p>
              </div>

              <div className="text-right shrink-0">
                {act.cost > 0 && (
                  <span className="text-xs font-bold text-slate-900 block">
                    ₹{act.cost.toLocaleString('en-IN')}
                  </span>
                )}
                {act.quantity && (
                  <span className="text-[10px] text-slate-500 font-medium">
                    {act.quantity} {act.unit || ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

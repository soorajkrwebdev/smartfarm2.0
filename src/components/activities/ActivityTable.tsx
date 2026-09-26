import React from 'react';
import { CropActivity, ActivityType } from '../../types';
import { Badge } from '../common/Badge';
import { Edit3, Trash2 } from 'lucide-react';

interface ActivityTableProps {
  activities: CropActivity[];
  onEdit: (activity: CropActivity) => void;
  onDelete: (id: string) => void;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({
  activities,
  onEdit,
  onDelete,
}) => {
  const getActivityBadge = (type: ActivityType) => {
    switch (type) {
      case 'Organic manure':
      case 'Biofertilizer application':
        return <Badge variant="emerald">{type}</Badge>;
      case 'Irrigation':
        return <Badge variant="blue">{type}</Badge>;
      case 'Planting':
        return <Badge variant="indigo">{type}</Badge>;
      case 'Harvest':
        return <Badge variant="purple">{type}</Badge>;
      case 'Pest monitoring':
      case 'Spraying':
        return <Badge variant="amber">{type}</Badge>;
      case 'Weeding':
      case 'Mulching':
      case 'Pruning':
        return <Badge variant="slate">{type}</Badge>;
      case 'Labour':
      case 'Custom activity':
      default:
        return <Badge variant="slate">{type}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
            <tr>
              <th scope="col" className="px-5 py-3.5">Date</th>
              <th scope="col" className="px-4 py-3.5">Activity</th>
              <th scope="col" className="px-4 py-3.5">Farm & Crop</th>
              <th scope="col" className="px-4 py-3.5">Quantity / Area</th>
              <th scope="col" className="px-4 py-3.5">Cost</th>
              <th scope="col" className="px-4 py-3.5">Notes</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {activities.map(act => (
              <tr key={act.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                  {act.activity_date}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {getActivityBadge(act.activity_type)}
                </td>
                <td className="px-4 py-3.5 max-w-[200px]">
                  <p className="font-bold text-slate-900 truncate">{act.farm_name}</p>
                  <p className="text-[11px] text-emerald-700 truncate">{act.crop_name}</p>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {act.quantity ? (
                    <span className="font-semibold text-slate-800">
                      {act.quantity} {act.unit || ''}
                    </span>
                  ) : act.area ? (
                    <span className="font-semibold text-slate-800">
                      {act.area} {act.area_unit || 'acres'}
                    </span>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-800">
                  {act.cost > 0 ? `₹${act.cost.toLocaleString('en-IN')}` : <span className="text-slate-400 font-normal">₹0</span>}
                </td>
                <td className="px-4 py-3.5 max-w-[220px]">
                  <p className="text-slate-600 line-clamp-1" title={act.notes}>
                    {act.notes || <span className="text-slate-400 italic">No notes</span>}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(act)}
                      title="Edit Activity"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(act.id)}
                      title="Delete Activity"
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Feed View */}
      <div className="md:hidden divide-y divide-slate-100">
        {activities.map(act => (
          <div key={act.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">
                  {act.activity_date}
                </span>
                {getActivityBadge(act.activity_type)}
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">
                  {act.cost > 0 ? `₹${act.cost.toLocaleString('en-IN')}` : '₹0'}
                </span>
                {act.quantity && (
                  <span className="text-[10px] text-slate-500">
                    {act.quantity} {act.unit}
                  </span>
                )}
              </div>
            </div>

            <div className="text-xs">
              <span className="font-bold text-slate-800">{act.farm_name}</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-emerald-700 font-semibold">{act.crop_name}</span>
            </div>

            {act.notes && (
              <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                {act.notes}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
              <button
                onClick={() => onEdit(act)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(act.id)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

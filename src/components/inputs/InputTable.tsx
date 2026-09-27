import React from 'react';
import { FarmInput, InputCategory } from '../../types';
import { Badge } from '../common/Badge';
import { Edit3, Trash2, ClipboardPlus } from 'lucide-react';

interface InputTableProps {
  inputs: FarmInput[];
  onEdit: (input: FarmInput) => void;
  onDelete: (id: string) => void;
  onLogAsActivity: (input: FarmInput) => void;
}

export const InputTable: React.FC<InputTableProps> = ({
  inputs,
  onEdit,
  onDelete,
  onLogAsActivity,
}) => {
  const getCategoryBadge = (category: InputCategory) => {
    switch (category) {
      case 'Organic manure':
        return <Badge variant="emerald">{category}</Badge>;
      case 'Biofertilizers':
        return <Badge variant="blue">{category}</Badge>;
      case 'Biological inputs':
        return <Badge variant="indigo">{category}</Badge>;
      case 'Botanical inputs':
        return <Badge variant="purple">{category}</Badge>;
      case 'Seeds':
        return <Badge variant="amber">{category}</Badge>;
      case 'Fertilizers':
        return <Badge variant="slate">{category}</Badge>;
      case 'Pesticides':
        return <Badge variant="rose">{category}</Badge>;
      default:
        return <Badge variant="slate">{category}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100">
            <tr>
              <th scope="col" className="px-5 py-3.5">Product / Input</th>
              <th scope="col" className="px-4 py-3.5">Category</th>
              <th scope="col" className="px-4 py-3.5">Farm & Crop</th>
              <th scope="col" className="px-4 py-3.5">Date</th>
              <th scope="col" className="px-4 py-3.5">Stock / Qty</th>
              <th scope="col" className="px-4 py-3.5">Cost</th>
              <th scope="col" className="px-4 py-3.5">Purpose / Method</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {inputs.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-bold text-slate-900 text-xs">{item.product_name}</p>
                  {item.supplier_or_source && (
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[180px]">
                      Source: {item.supplier_or_source}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {getCategoryBadge(item.category)}
                </td>
                <td className="px-4 py-3.5 max-w-[180px]">
                  <p className="font-bold text-slate-800 truncate">{item.farm_name}</p>
                  <p className="text-[11px] text-emerald-700 truncate">{item.crop_name}</p>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700">
                  {item.purchase_date}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-semibold text-slate-900">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap font-bold text-slate-900">
                  {item.cost > 0 ? `₹${item.cost.toLocaleString('en-IN')}` : '₹0'}
                </td>
                <td className="px-4 py-3.5 max-w-[200px]">
                  <p className="text-slate-700 line-clamp-1 font-medium">{item.purpose || '-'}</p>
                  {item.application_method && (
                    <p className="text-[10px] text-slate-400 line-clamp-1">{item.application_method}</p>
                  )}
                </td>
                <td className="px-5 py-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onLogAsActivity(item)}
                      title="Log as Activity in Crop Cycle"
                      className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <ClipboardPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      title="Edit Input"
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      title="Delete Input"
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
        {inputs.map(item => (
          <div key={item.id} className="p-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-bold text-slate-900 text-xs">{item.product_name}</p>
                <div className="mt-1">{getCategoryBadge(item.category)}</div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block">
                  {item.quantity} {item.unit}
                </span>
                <span className="text-[11px] text-slate-500 font-semibold">
                  {item.cost > 0 ? `₹${item.cost.toLocaleString('en-IN')}` : '₹0'}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800">{item.farm_name}</span>
              <span className="text-slate-400 mx-1.5">•</span>
              <span className="text-emerald-700">{item.crop_name}</span>
            </div>

            {item.purpose && (
              <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-xl">
                {item.purpose}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-50 text-xs">
              <button
                onClick={() => onLogAsActivity(item)}
                className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:text-emerald-800"
              >
                <ClipboardPlus className="w-3.5 h-3.5" />
                <span>Log to Activities</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(item)}
                  className="font-semibold text-slate-600 hover:text-slate-900 px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(item.id)}
                  className="font-semibold text-rose-600 hover:text-rose-700 px-2 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

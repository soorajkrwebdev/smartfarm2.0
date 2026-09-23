import React from 'react';
import { OrganicInput } from '../../types';
import { Badge } from '../common/Badge';
import { CheckCircle2, AlertTriangle, ExternalLink, ShieldCheck, Sprout } from 'lucide-react';

interface OrganicInputCardProps {
  input: OrganicInput;
  userCropNames?: string[];
  onApplyToCrop?: (input: OrganicInput) => void;
}

export const OrganicInputCard: React.FC<OrganicInputCardProps> = ({
  input,
  userCropNames = [],
  onApplyToCrop,
}) => {
  const getCategoryBadge = (category: OrganicInput['category']) => {
    switch (category) {
      case 'Organic Manures':
        return <Badge variant="emerald">{category}</Badge>;
      case 'Biofertilizers':
        return <Badge variant="blue">{category}</Badge>;
      case 'Biological / Biocontrol Inputs':
        return <Badge variant="indigo">{category}</Badge>;
      case 'Botanical Inputs':
        return <Badge variant="purple">{category}</Badge>;
      case 'Soil Amendments':
        return <Badge variant="amber">{category}</Badge>;
      default:
        return <Badge variant="slate">{category}</Badge>;
    }
  };

  // Check if suitable crops match any of the farmer's registered crops
  const matchingCrops = input.suitable_crops.filter(sc =>
    userCropNames.some(uc => uc.toLowerCase().includes(sc.toLowerCase()) || sc.toLowerCase().includes(uc.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
          {getCategoryBadge(input.category)}
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{input.verification_status}</span>
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 tracking-tight font-heading mt-1">
          {input.name}
        </h3>
        <p className="text-xs font-semibold text-emerald-700 mt-0.5">
          Purpose: {input.purpose}
        </p>

        <p className="text-xs text-slate-600 leading-relaxed mt-2.5 mb-4">
          {input.description}
        </p>

        {/* Benefits list */}
        <div className="space-y-1.5 mb-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Verified Agronomic Benefits
          </span>
          {input.benefits.slice(0, 3).map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Suitable crops */}
        <div className="mb-4">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">
            Suitable Crops
          </span>
          <div className="flex flex-wrap gap-1.5">
            {input.suitable_crops.map(c => {
              const isUserCrop = userCropNames.some(uc => uc.toLowerCase().includes(c.toLowerCase()));
              return (
                <span
                  key={c}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                    isUserCrop
                      ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {isUserCrop ? `✓ ${c}` : c}
                </span>
              );
            })}
          </div>
          {matchingCrops.length > 0 && (
            <p className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <Sprout className="w-3 h-3" />
              <span>Directly matches your active farm crop: {matchingCrops.join(', ')}</span>
            </p>
          )}
        </div>

        {/* Application details */}
        <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs space-y-1.5 mb-3">
          <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider">
            Application Guidelines
          </span>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            {input.application_information}
          </p>
          {input.precautions && (
            <p className="text-amber-800 text-[11px] flex items-start gap-1 pt-1 border-t border-slate-200/50">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span><strong>Precaution:</strong> {input.precautions}</span>
            </p>
          )}
        </div>
      </div>

      {/* Footer with Authoritative Source Citation */}
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <div className="min-w-0">
          <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Source Citation</span>
          <span className="font-bold text-slate-700 truncate block text-[11px]" title={input.source_name}>
            {input.source_name}
          </span>
        </div>

        {input.source_url && (
          <a
            href={input.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 shrink-0 hover:underline"
          >
            <span>Research Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { OrganicInputViewItem } from '../../types';
import { AlertTriangle, ExternalLink, ChevronDown, ChevronUp, Sprout, Info } from 'lucide-react';

interface OrganicInputCardProps {
  input: OrganicInputViewItem;
  userCropNames?: string[];
}

/** Maps OrganicClassification to a human label and colour token. */
const classificationLabel: Record<string, { label: string; color: string }> = {
  'natural':            { label: 'Natural Material',              color: 'bg-slate-100 text-slate-700 border-slate-200' },
  'organic-input':      { label: 'Organic Farming Input',         color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  'listed-in-standard': { label: 'Listed in Organic Standard',    color: 'bg-blue-50 text-blue-800 border-blue-200' },
  'certified-product':  { label: 'Certified Product (by issuer)', color: 'bg-indigo-50 text-indigo-800 border-indigo-200' },
  'not-established':    { label: 'Educational Reference Only',    color: 'bg-amber-50 text-amber-800 border-amber-200' },
};

const verificationColor: Record<string, string> = {
  'Verified':                         'text-emerald-800 bg-emerald-50 border-emerald-200',
  'Source-backed':                    'text-blue-800   bg-blue-50   border-blue-200',
  'Educational':                      'text-slate-700  bg-slate-50  border-slate-200',
  'General Agricultural Information': 'text-slate-700  bg-slate-50  border-slate-200',
  'Needs Verification':               'text-amber-800  bg-amber-50  border-amber-200',
  'Unverified / For Review':          'text-rose-800   bg-rose-50   border-rose-200',
};

const categoryColor: Record<string, string> = {
  'Organic Manures':                 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Biofertilizers':                  'bg-blue-50    text-blue-800   border-blue-200',
  'Biological / Biocontrol Inputs':  'bg-indigo-50  text-indigo-800 border-indigo-200',
  'Botanical Inputs':                'bg-purple-50  text-purple-800 border-purple-200',
  'Soil Amendments':                 'bg-amber-50   text-amber-800  border-amber-200',
};

export const OrganicInputCard: React.FC<OrganicInputCardProps> = ({
  input,
  userCropNames = [],
}) => {
  const [expanded, setExpanded] = useState(false);

  const cls = classificationLabel[input.classification] ?? classificationLabel['not-established'];
  const verColor = verificationColor[input.verification_status] ?? verificationColor['General Agricultural Information'];
  const catColor = categoryColor[input.category] ?? 'bg-slate-100 text-slate-700 border-slate-200';

  const matchingCrops = input.suitable_crops.filter(sc =>
    userCropNames.some(uc =>
      uc.toLowerCase().includes(sc.toLowerCase()) ||
      sc.toLowerCase().includes(uc.toLowerCase())
    )
  );

  // Crop guidance from the relationship table
  const myCropGuidance = input.crop_guidance.filter(cg =>
    userCropNames.some(uc =>
      uc.toLowerCase().includes(cg.crop_name.toLowerCase()) ||
      cg.crop_name.toLowerCase().includes(uc.toLowerCase())
    )
  );

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <div className="p-5 flex-1">
        {/* Category + classification row */}
        <div className="flex items-start flex-wrap gap-1.5 mb-3">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catColor}`}>
            {input.category}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls.color}`}>
            {cls.label}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${verColor}`}>
            {input.verification_status}
          </span>
        </div>

        {/* Name & purpose */}
        <h3 className="text-base font-bold text-slate-900 tracking-tight">
          {input.name}
        </h3>
        <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
          {input.purpose}
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed mt-2 mb-3">
          {input.summary}
        </p>

        {/* Benefits — labelled "Described benefits" not "Verified" */}
        {input.benefits.length > 0 && (
          <div className="space-y-1 mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Described Benefits (from source)
            </span>
            {input.benefits.slice(0, 3).map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        )}

        {/* Suitable crops — highlight farmer's own crops */}
        <div className="mb-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1.5">
            Suitable Crops
          </span>
          <div className="flex flex-wrap gap-1.5">
            {input.suitable_crops.map(c => {
              const isUserCrop = userCropNames.some(uc =>
                uc.toLowerCase().includes(c.toLowerCase())
              );
              return (
                <span
                  key={c}
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
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
            <p className="text-[10px] text-emerald-700 font-semibold mt-1.5 flex items-center gap-1">
              <Sprout className="w-3 h-3" />
              Matches your registered crops: {matchingCrops.join(', ')}
            </p>
          )}
        </div>

        {/* Crop-specific guidance from relationship table */}
        {myCropGuidance.length > 0 && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/60 mb-3 text-xs space-y-1.5">
            <span className="font-bold text-emerald-900 block text-[10px] uppercase tracking-wider">
              Crop-Specific Guidance (from {myCropGuidance[0].source_name})
            </span>
            {myCropGuidance.map(cg => (
              <div key={cg.id}>
                <span className="font-semibold text-emerald-800">{cg.crop_name} · {cg.stage}:</span>
                <p className="text-emerald-700 mt-0.5">{cg.guidance}</p>
              </div>
            ))}
          </div>
        )}

        {/* Application guidance */}
        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs mb-3">
          <span className="font-bold text-slate-800 block text-[10px] uppercase tracking-wider mb-1">
            Application Guidance
          </span>
          <p className="text-slate-600 leading-relaxed">{input.application_guidance}</p>
          {input.precautions && (
            <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-slate-200/60">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-amber-800 text-[11px]">
                <strong>Precaution: </strong>{input.precautions}
              </p>
            </div>
          )}
        </div>

        {/* Expanded: limitation + mode of action */}
        {expanded && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {input.mode_of_action && (
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs">
                <span className="font-bold text-blue-900 block mb-0.5">How it works (mode of action):</span>
                <p className="text-blue-800 leading-relaxed">{input.mode_of_action}</p>
              </div>
            )}
            {input.limitation && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs flex items-start gap-2">
                <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-900 block mb-0.5">
                    What this source does NOT establish:
                  </span>
                  <p className="text-amber-800">{input.limitation}</p>
                </div>
              </div>
            )}
            {input.classification_note && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-700 block mb-0.5">Classification note:</span>
                <p className="text-slate-600 leading-relaxed">{input.classification_note}</p>
              </div>
            )}
            {input.last_verified && (
              <p className="text-[10px] text-slate-400">
                Last reviewed: {input.last_verified}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Footer — source citation + expand toggle */}
      <div className="border-t border-slate-100">
        <div className="px-5 py-2.5 bg-slate-50 flex items-center justify-between gap-3 text-xs">
          <div className="min-w-0">
            <span className="text-[9px] text-slate-400 block font-medium uppercase tracking-wider">
              Source
            </span>
            <span className="font-bold text-slate-700 truncate block text-[11px]" title={input.source_name}>
              {input.source_name}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {input.source_url && (
              <a
                href={input.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
              >
                Source <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? 'Less' : 'More'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

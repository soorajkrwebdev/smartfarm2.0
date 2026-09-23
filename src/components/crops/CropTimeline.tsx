import React from 'react';
import { CropActivity } from '../../types';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface CropTimelineProps {
  growthStage: string;
  activities?: CropActivity[];
}

export const CROP_TIMELINE_STEPS = [
  'Planting',
  'Irrigation',
  'Nutrient Management',
  'Weeding',
  'Mulching',
  'Pest Monitoring',
  'Treatment/IPM',
  'Harvest'
] as const;

export const CropTimeline: React.FC<CropTimelineProps> = ({
  growthStage,
  activities = [],
}) => {
  // Determine completed stages based on logged activities
  const hasActivityForStep = (stepName: string) => {
    return activities.some(a => {
      const type = a.activity_type.toLowerCase();
      if (stepName === 'Planting') return type.includes('planting');
      if (stepName === 'Irrigation') return type.includes('irrigation');
      if (stepName === 'Nutrient Management') return type.includes('fertil') || type.includes('manure') || type.includes('biofertilizer');
      if (stepName === 'Weeding') return type.includes('weeding');
      if (stepName === 'Mulching') return type.includes('mulching');
      if (stepName === 'Pest Monitoring') return type.includes('pest') || type.includes('monitoring');
      if (stepName === 'Treatment/IPM') return type.includes('spray') || type.includes('treatment');
      if (stepName === 'Harvest') return type.includes('harvest');
      return false;
    });
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Life-Cycle & Management Timeline
        </span>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
          Stage: {growthStage}
        </span>
      </div>

      {/* Horizontal step tracker */}
      <div className="relative flex items-center justify-between gap-1 overflow-x-auto py-2 no-scrollbar">
        {CROP_TIMELINE_STEPS.map((step, idx) => {
          const isDone = hasActivityForStep(step) || (step === 'Planting');
          return (
            <div key={step} className="flex items-center flex-1 min-w-[70px]">
              <div className="flex flex-col items-center text-center w-full">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors text-xs font-bold ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                  title={`${step}: ${isDone ? 'Activity logged / active' : 'Upcoming'}`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-[10px]">{idx + 1}</span>
                  )}
                </div>
                <span className={`text-[9px] mt-1 font-medium leading-tight truncate w-full px-0.5 ${
                  isDone ? 'text-slate-800 font-semibold' : 'text-slate-400'
                }`}>
                  {step}
                </span>
              </div>
              {idx < CROP_TIMELINE_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 shrink-0 -mt-3.5 ${
                    isDone ? 'bg-emerald-400' : 'bg-slate-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

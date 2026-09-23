import React, { useState } from 'react';
import { OrganicPractice } from '../../types';
import { Leaf, ChevronDown, ChevronUp, AlertCircle, BookOpen, Clock, Droplets, CheckCircle } from 'lucide-react';
import { Badge } from '../common/Badge';

export const OrganicPracticeCard: React.FC<{ practice: OrganicPractice }> = ({ practice }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
              {practice.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-1.5 font-heading">
              {practice.title}
            </h3>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
            <Leaf className="w-4 h-4" />
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {practice.summary}
        </p>

        {/* Quick parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs py-2.5 my-2 border-y border-slate-100 bg-slate-50/60 rounded-xl px-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-emerald-600" /> Application Rate
            </span>
            <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">{practice.application_rate}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" /> Timing
            </span>
            <span className="font-semibold text-slate-800 text-[11px] block mt-0.5">{practice.dosage_timing}</span>
          </div>
        </div>

        {/* Expandable Protocol Steps & Scientific Rationale */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
            {/* Scientific Rationale */}
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100/70 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Scientific Agronomic Mechanism:</span>
              <p className="text-emerald-800/90 leading-relaxed">{practice.scientific_rationale}</p>
            </div>

            {/* Preparation Steps */}
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Step-by-Step Preparation & Execution Protocol:
              </span>
              <ol className="space-y-2 text-xs text-slate-600 pl-1">
                {practice.preparation_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Cautions */}
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Critical Agronomic Cautions:</span>
                <p className="mt-0.5 text-amber-800">{practice.cautions}</p>
              </div>
            </div>

            {/* Source Reference */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Authoritative Source: <strong className="text-slate-600">{practice.source}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
        >
          <span>{expanded ? 'Hide Preparation Protocol' : 'View Full Preparation & Execution Steps'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

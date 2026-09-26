import React, { useState } from 'react';
import { OrganicPractice } from '../../types';
import { Leaf, ChevronDown, ChevronUp, AlertCircle, ExternalLink, Clock, Droplets } from 'lucide-react';

export const OrganicPracticeCard: React.FC<{ practice: OrganicPractice }> = ({ practice }) => {
  const [expanded, setExpanded] = useState(false);

  const verificationColor = (status?: string) => {
    if (!status) return 'text-slate-500 bg-slate-50 border-slate-200';
    if (status.includes('Source-backed')) return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    if (status.includes('Educational')) return 'text-blue-800 bg-blue-50 border-blue-200';
    return 'text-slate-700 bg-slate-50 border-slate-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
              {practice.category}
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight mt-1.5">
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
            <span className="font-semibold text-slate-800 text-[11px] block mt-0.5 leading-snug">
              {practice.application_rate}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-600" /> Timing
            </span>
            <span className="font-semibold text-slate-800 text-[11px] block mt-0.5 leading-snug">
              {practice.dosage_timing}
            </span>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
            {/* Scientific rationale */}
            <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-100/70 text-xs">
              <span className="font-bold text-emerald-900 block mb-1">Agronomic Mechanism:</span>
              <p className="text-emerald-800/90 leading-relaxed">{practice.scientific_rationale}</p>
            </div>

            {/* Preparation steps */}
            <div>
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Preparation & Execution Steps:
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
                <span className="font-bold">Cautions & Limitations:</span>
                <p className="mt-0.5 text-amber-800">{practice.cautions}</p>
              </div>
            </div>

            {/* Claim basis (what source actually proves) */}
            {practice.claim_basis && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-700 block mb-0.5">What the cited source supports:</span>
                <p>{practice.claim_basis}</p>
              </div>
            )}

            {/* Source */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div className="text-[11px] text-slate-500">
                <span className="font-medium text-slate-600">Source: </span>
                <span className="font-bold text-slate-700">{practice.source}</span>
              </div>
              {practice.source_url && (
                <a
                  href={practice.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline shrink-0"
                >
                  View Source <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Verification status */}
            {practice.verification_status && (
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${verificationColor(practice.verification_status)}`}>
                {practice.verification_status}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toggle button */}
      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
        >
          <span>{expanded ? 'Hide Preparation Details' : 'View Full Preparation Steps & Source'}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

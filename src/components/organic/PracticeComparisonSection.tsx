import React, { useState } from 'react';
import { Info } from 'lucide-react';

type ComparisonDimension = {
  aspect: string;
  organic: { text: string; tone: 'positive' | 'neutral' | 'negative' };
  ipm: { text: string; tone: 'positive' | 'neutral' | 'negative' };
  conventional: { text: string; tone: 'positive' | 'neutral' | 'negative' };
};

const COMPARISON: ComparisonDimension[] = [
  {
    aspect: 'Primary pest management tool',
    organic:      { text: 'Prevention → Cultural → Biological → Botanical (chemicals only from permitted natural list)', tone: 'positive' },
    ipm:          { text: 'Prevention → Monitoring → Biological → Chemical only at threshold (any registered product)', tone: 'positive' },
    conventional: { text: 'Synthetic pesticide application at scheduled intervals or at first sign of pest', tone: 'neutral' },
  },
  {
    aspect: 'Soil fertility source',
    organic:      { text: 'Organic matter (compost, FYM, vermicompost, green manure, biofertilisers)', tone: 'positive' },
    ipm:          { text: 'Flexible — organic and synthetic fertilisers used depending on soil test and economics', tone: 'neutral' },
    conventional: { text: 'Primarily synthetic NPK fertilisers; organic matter may be neglected', tone: 'neutral' },
  },
  {
    aspect: 'Soil health over time',
    organic:      { text: 'Generally improves SOM and biological activity with consistent organic management', tone: 'positive' },
    ipm:          { text: 'Depends on input choices; can improve or decline depending on fertility management', tone: 'neutral' },
    conventional: { text: 'Can decline if SOM additions are neglected; soil biology may be suppressed by fungicide/nematicide use', tone: 'negative' },
  },
  {
    aspect: 'Synthetic pesticide residues in produce',
    organic:      { text: 'Zero synthetic pesticide residues (from certified organic systems using permitted inputs only)', tone: 'positive' },
    ipm:          { text: 'Low to nil if pre-harvest intervals (PHI) are observed; depends on farmer compliance', tone: 'neutral' },
    conventional: { text: 'Risk of residue if PHI is not observed; acceptable under MRL (maximum residue limit) if compliant', tone: 'neutral' },
  },
  {
    aspect: 'Environmental impact',
    organic:      { text: 'Lower synthetic chemical load; generally better for soil organisms, pollinators, and water quality', tone: 'positive' },
    ipm:          { text: 'Significantly lower pesticide load than conventional; beneficial insect conservation is a core goal', tone: 'positive' },
    conventional: { text: 'Higher synthetic chemical load; potential for off-target impacts on soil organisms, water, and non-target insects', tone: 'negative' },
  },
  {
    aspect: 'Certification & premium market access',
    organic:      { text: 'Eligible for certified organic premium market if certified by APEDA-accredited CB', tone: 'positive' },
    ipm:          { text: 'IPM produce may qualify for "low-pesticide" or "responsibly grown" labels in some markets, but not "organic"', tone: 'neutral' },
    conventional: { text: 'Standard commodity market; no premium for pest management approach unless specific buyer programme', tone: 'neutral' },
  },
  {
    aspect: 'Transition difficulty',
    organic:      { text: 'Requires 2–3 year conversion period with potential yield reduction; high knowledge demand', tone: 'negative' },
    ipm:          { text: 'Can be implemented immediately without conversion period; gradual adoption is practical', tone: 'positive' },
    conventional: { text: 'Established baseline for most farmers; no additional learning curve for continuation', tone: 'neutral' },
  },
  {
    aspect: 'Input cost structure',
    organic:      { text: 'Lower recurring synthetic input cost once system is established; higher labour and knowledge cost', tone: 'neutral' },
    ipm:          { text: 'Can reduce pesticide cost significantly; fertiliser costs depend on approach', tone: 'positive' },
    conventional: { text: 'Higher recurring synthetic fertiliser and pesticide purchase cost; lower knowledge and labour demand for inputs', tone: 'neutral' },
  },
  {
    aspect: 'Risk management in severe pest events',
    organic:      { text: 'More vulnerable if biological controls fail and no synthetic backup is available; requires early monitoring', tone: 'negative' },
    ipm:          { text: 'Synthetic pesticide available as a last resort, reducing catastrophic loss risk while minimising routine use', tone: 'positive' },
    conventional: { text: 'Immediate chemical option always available; resistance and secondary pest flare-up are long-term risks', tone: 'neutral' },
  },
];

const toneClass: Record<'positive' | 'neutral' | 'negative', string> = {
  positive: 'bg-emerald-50 text-emerald-900',
  neutral:  'bg-slate-50   text-slate-700',
  negative: 'bg-amber-50   text-amber-900',
};

const toneDot: Record<'positive' | 'neutral' | 'negative', string> = {
  positive: 'bg-emerald-500',
  neutral:  'bg-slate-400',
  negative: 'bg-amber-500',
};

export const PracticeComparisonSection: React.FC = () => {
  const [view, setView] = useState<'table' | 'cards'>('cards');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-2xs">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">
              Comparison: Organic vs IPM vs Conventional Farming
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              This comparison is provided for educational purposes. No single approach is universally
              superior — the best system depends on the farm context, crop, market, resources, and
              farmer goals. Trade-offs are highlighted honestly.
            </p>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Source: Educational compilation based on ICAR, IFOAM, and FAO guidance on integrated
              and organic production systems.
            </p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 flex-wrap text-[11px] font-semibold">
        {(['positive', 'neutral', 'negative'] as const).map(t => (
          <span key={t} className="flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${toneDot[t]}`} />
            {t === 'positive' ? 'Generally advantageous'
              : t === 'negative' ? 'Generally a trade-off or challenge'
              : 'Context-dependent'}
          </span>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('cards')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${view === 'cards' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
        >
          Card View
        </button>
        <button
          onClick={() => setView('table')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${view === 'table' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
        >
          Table View
        </button>
      </div>

      {/* Card view */}
      {view === 'cards' && (
        <div className="space-y-3">
          {COMPARISON.map((row, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs">
              <h4 className="font-bold text-slate-900 text-xs mb-3 uppercase tracking-wide">
                {row.aspect}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Organic', data: row.organic, headerBg: 'bg-emerald-600 text-white' },
                  { label: 'IPM', data: row.ipm, headerBg: 'bg-blue-600 text-white' },
                  { label: 'Conventional', data: row.conventional, headerBg: 'bg-slate-500 text-white' },
                ].map(col => (
                  <div key={col.label} className="rounded-xl overflow-hidden border border-slate-100">
                    <div className={`${col.headerBg} px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider`}>
                      {col.label}
                    </div>
                    <div className={`${toneClass[col.data.tone]} px-2.5 py-2 text-xs leading-relaxed flex items-start gap-1.5`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${toneDot[col.data.tone]} shrink-0 mt-1.5`} />
                      <span>{col.data.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === 'table' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left p-3 font-bold text-slate-700 bg-slate-50 w-36">Aspect</th>
                  <th className="text-left p-3 font-bold text-white bg-emerald-600">Organic</th>
                  <th className="text-left p-3 font-bold text-white bg-blue-600">IPM</th>
                  <th className="text-left p-3 font-bold text-white bg-slate-500">Conventional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON.map((row, i) => (
                  <tr key={i}>
                    <td className="p-3 font-semibold text-slate-700 bg-slate-50/50 align-top">
                      {row.aspect}
                    </td>
                    <td className={`p-3 align-top ${toneClass[row.organic.tone]}`}>
                      {row.organic.text}
                    </td>
                    <td className={`p-3 align-top ${toneClass[row.ipm.tone]}`}>
                      {row.ipm.text}
                    </td>
                    <td className={`p-3 align-top ${toneClass[row.conventional.tone]}`}>
                      {row.conventional.text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
        <strong className="text-slate-800">Important: </strong>
        This comparison is educational and generalised. Outcomes on any specific farm depend on soil
        type, climate, crop, farmer skill, market access, and many other factors. It should be used
        for awareness and learning — not as a prescription for farm management decisions without
        consulting qualified agricultural extension support.
      </div>
    </div>
  );
};

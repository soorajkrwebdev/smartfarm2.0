import React from 'react';
import { ShieldAlert, Sparkles, Heart, Globe, Scale } from 'lucide-react';

export const ConversionRoadmap: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Official Certification Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-start gap-3 text-xs leading-relaxed">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold block text-sm">Regulatory Notice Regarding Organic Certification:</strong>
          This platform provides digital management records, agronomic logs, and verified educational knowledge. It is a decision-support and farm-management system; <span className="underline font-bold">it does NOT issue, replace, or certify official organic status</span>. Official certification in India is governed through authorized accredited certification bodies under NPOP (APEDA) or the PGS-India participatory guarantee system.
        </div>
      </div>

      {/* 4 Core Principles of Organic Agriculture (IFOAM) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        <h3 className="text-xl font-bold text-slate-900 font-heading mb-1">
          Four Fundamental Principles of Organic Agriculture
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Established by the International Federation of Organic Agriculture Movements (IFOAM) and adopted under NPOP standards.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <Heart className="w-5 h-5 text-emerald-700 mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">1. Principle of Health</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organic agriculture should sustain and enhance the health of soil, plant, animal, human, and planet as one and indivisible.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100">
            <Globe className="w-5 h-5 text-teal-700 mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">2. Principle of Ecology</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Farming must be based on living ecological systems and cycles, work with them, emulate them and help sustain them.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <Scale className="w-5 h-5 text-amber-700 mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">3. Principle of Fairness</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Build on relationships that ensure fairness regarding the common environment, animal welfare, and human life opportunities.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <Sparkles className="w-5 h-5 text-indigo-700 mb-2" />
            <h4 className="font-bold text-slate-900 text-sm mb-1">4. Principle of Care</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Practices must be managed in a precautionary and responsible manner to protect current and future generations.
            </p>
          </div>
        </div>
      </div>

      {/* Transition Roadmap: Conversion Period (C1 to C3) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        <h3 className="text-xl font-bold text-slate-900 font-heading mb-1">
          Conversion Period Roadmap (C1 → C2 → C3 → Certified)
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Transitioning from synthetic chemicals to biological fertility requires systematic soil detoxification and biology rebuilding over a 2 to 3 year conversion window.
        </p>

        <div className="relative border-l-2 border-emerald-500 ml-4 space-y-8 pl-6">
          {/* Year 1 */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                Year 1 (Conversion 1 - C1)
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">Chemical Cessation & Soil Inoculation</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1 mb-2">
                Immediate cessation of all synthetic fertilizers, chemical weedicides, and chemical insecticides. Soil microbial activity is initially low and requires intensive organic inoculation.
              </p>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>• Sow deep-rooted green manure crops (Sunnhemp / Daincha) to break hard pans.</li>
                <li>• Apply heavy baseline farmyard manure (FYM @ 10-15 t/ha) enriched with Trichoderma.</li>
                <li>• Drench bi-weekly with Jeevamrutha to re-introduce native soil bacteria.</li>
              </ul>
            </div>
          </div>

          {/* Year 2 */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                Year 2 (Conversion 2 - C2)
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">Biomass Recycling & Predator Habitat Establishment</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1 mb-2">
                Yield stabilization phase. Soil organic carbon (SOC) begins rising; beneficial predator insect populations (ladybirds, predatory mites) multiply in field borders.
              </p>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>• Establish permanent border trap crops (Marigold, Castor) to divert bollworms and caterpillars.</li>
                <li>• Implement continuous in-situ residue mulching around tree canopies.</li>
                <li>• Inoculate biofertilizers (Azospirillum, PSB, Potash Mobilizing Bacteria).</li>
              </ul>
            </div>
          </div>

          {/* Year 3 */}
          <div className="relative">
            <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                Year 3 (Conversion 3 - C3 → Full Organic Status)
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">Ecological Equilibrium & Full Natural Productivity</h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1 mb-2">
                The agro-ecosystem reaches internal nutrient cycling equilibrium. Soil water-holding capacity increases noticeably, reducing irrigation vulnerability.
              </p>
              <ul className="text-xs text-slate-700 space-y-1">
                <li>• Earthworm populations flourish natively without artificial replenishment.</li>
                <li>• Complete internal farm biomass self-sufficiency achieved via vermicompost and frond recycling.</li>
                <li>• Eligible for full NPOP / PGS-India Certified Organic crop harvest audit.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Matrix: Organic vs Conventional */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs overflow-hidden">
        <h3 className="text-xl font-bold text-slate-900 font-heading mb-1">
          Comparative Analysis: Organic vs Conventional Systems
        </h3>
        <p className="text-xs text-slate-500 mb-6">
          Key ecological, agronomic, and financial differences based on long-term ICAR research trials.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Agronomic Parameter</th>
                <th className="p-3 text-emerald-800 bg-emerald-50/50">Organic Farming System</th>
                <th className="p-3 text-slate-700">Conventional System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-bold text-slate-900">Soil Organic Carbon (SOC)</td>
                <td className="p-3 font-semibold text-emerald-900 bg-emerald-50/30">
                  Consistently increases (+0.3% to +0.8% over 3 years); builds durable humus.
                </td>
                <td className="p-3">
                  Tends to decline or plateau due to rapid mineralization by synthetic nitrogen.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Soil Microbiome & Mycorrhizae</td>
                <td className="p-3 font-semibold text-emerald-900 bg-emerald-50/30">
                  Thriving fungal-bacterial networks; high enzymatic activity (phosphatase, dehydrogenase).
                </td>
                <td className="p-3">
                  Severely depressed by chemical fungicides, nematicides, and concentrated salts.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Pest Resistance & Chemical Residues</td>
                <td className="p-3 font-semibold text-emerald-900 bg-emerald-50/30">
                  Zero toxic synthetic residues; pests managed via natural parasitoids and botanicals.
                </td>
                <td className="p-3">
                  High risk of pest resurgence, secondary pest flare-ups, and pesticide resistance.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Drought & Climate Resilience</td>
                <td className="p-3 font-semibold text-emerald-900 bg-emerald-50/30">
                  Higher soil moisture retention (+20-30%) due to organic matter acting as a sponge.
                </td>
                <td className="p-3">
                  Requires frequent irrigation cycles due to poor soil aggregate stability and quick runoff.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Input Cost & Energy Footprint</td>
                <td className="p-3 font-semibold text-emerald-900 bg-emerald-50/30">
                  Low external cash dependency; utilizes on-farm residues, cattle dung, and biological cultures.
                </td>
                <td className="p-3">
                  High recurring cash expense tied to petroleum-derived fertilizer and agrochemical price spikes.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useFarmData } from '../../contexts/FarmContext';
import { Badge } from '../../components/common/Badge';
import { ShieldCheck, CheckCircle, TrendingUp, Leaf, Recycle, Bug, TestTube } from 'lucide-react';

export const SustainabilityPage: React.FC = () => {
  const { farms, crops, activities, inputs, pestObservations, ipmRecords, soilTests, waterTests, farmWaste, compostBatches } = useFarmData();
  const farm = farms[0];

  const organicActivities = activities.filter(a => ['Organic manure', 'Biofertilizer application', 'Mulching', 'Weeding'].includes(a.activity_type));
  const organicInputs = inputs.filter(i => ['Organic manure', 'Biofertilizers', 'Biological inputs', 'Botanical inputs'].includes(i.category));
  const totalInputs = inputs.length;
  const wasteRecycled = farmWaste.filter(w => w.status === 'composted' || w.status === 'applied').reduce((sum, w) => sum + w.quantity, 0);

  const metrics = [
    { label: 'Organic Practices Logged', value: organicActivities.length, icon: Leaf, color: 'emerald', description: 'Organic manure, biofertilizer, mulching, weeding' },
    { label: 'Organic Input Usage', value: totalInputs > 0 ? Math.round((organicInputs.length / totalInputs) * 100) : 100, suffix: '%', icon: TrendingUp, color: 'teal', description: `${organicInputs.length} of ${totalInputs} inputs are organic` },
    { label: 'Waste Recycled', value: wasteRecycled, unit: 'kg', icon: Recycle, color: 'blue', description: 'Crop residue and biomass converted to compost' },
    { label: 'IPM Activities', value: ipmRecords.length, icon: Bug, color: 'indigo', description: 'Biological and botanical pest management decisions' },
    { label: 'Soil Tests Conducted', value: soilTests.length, icon: TestTube, color: 'purple', description: 'Laboratory soil analysis records' },
    { label: 'Compost Produced', value: compostBatches.filter(c => c.status === 'finished').reduce((s, c) => s + (c.volume_finished || 0), 0), unit: 'kg', icon: Leaf, color: 'green', description: 'Finished compost batches volume' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Phase 4 - Sustainability Tracking</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Farm Sustainability Dashboard</h1>
          <p className="text-xs text-slate-500 mt-1">
            Track organic practices, waste recycling, IPM, and input record completeness. This is a farm sustainability tracking system, not an official certification.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl bg-${m.color}-50 text-${m.color}-700 flex items-center justify-center`}>
                <m.icon className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">{m.label}</span>
                <p className={`text-2xl font-bold text-slate-900 ${m.suffix || m.unit ? 'text-emerald-700' : ''}`}>
                  {m.suffix ? `${m.value}${m.suffix}` : m.unit ? `${m.value} ${m.unit}` : m.value}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500">{m.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50 rounded-3xl border border-emerald-200/60 p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <h3 className="font-bold text-slate-900">Sustainability Tracking Notice</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          This dashboard tracks your farm's sustainability practices and provides indicators based on recorded data. 
          It is a decision-support and farm-management tool. It does NOT issue, replace, or certify official organic status 
          or sustainability certification. Official certification in India is governed through authorized accredited certification 
          bodies under NPOP (APEDA) or PGS-India.
        </p>
      </div>
    </div>
  );
};
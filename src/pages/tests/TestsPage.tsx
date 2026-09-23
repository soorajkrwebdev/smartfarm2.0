import React, { useState } from 'react';
import { useFarmData } from '../../contexts/FarmContext';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { TestTube, Search } from 'lucide-react';
import { SoilTest, WaterTest } from '../../types';

export const TestsPage: React.FC = () => {
  const { soilTests, waterTests } = useFarmData();
  const [tab, setTab] = useState('soil');
  const [q, setQ] = useState('');
  const data = tab === 'soil' ? soilTests : waterTests;
  const filtered = data.filter(t => !q || t.farm_name?.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => new Date(b.test_date).getTime() - new Date(a.test_date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
            <TestTube className="w-3.5 h-3.5 text-emerald-700" />
            <span>Phase 4 Module</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Soil & Water Testing Records</h1>
        </div>
        <Button variant="primary" size="md" onClick={() => alert('Lab test entry form coming soon')}>Add Test Record</Button>
      </div>

      <div className="flex rounded-2xl bg-white border border-slate-200/80 p-1 gap-1">
        <button onClick={() => setTab('soil')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${tab === 'soil' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          Soil Tests ({soilTests.length})
        </button>
        <button onClick={() => setTab('water')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${tab === 'water' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          Water Tests ({waterTests.length})
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Search by farm..." value={q} onChange={e => setQ(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<TestTube className="w-8 h-8" />} title="No tests yet" description="Record your lab analysis results." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-slate-200/80 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{t.farm_name}</span>
                {t.laboratory && <span className="text-[10px] text-slate-400">{t.laboratory}</span>}
              </div>
              <h3 className="font-bold text-sm text-slate-900">{tab === 'soil' ? 'Soil Analysis' : 'Water Quality'}</h3>
              <p className="text-xs text-slate-500">{t.test_date}</p>
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                {tab === 'soil' && t.ph && <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-100"><span className="text-[10px] text-emerald-700">pH</span><span className="font-bold">{(t as SoilTest).ph?.toFixed(1)}</span></div>}
                {tab === 'soil' && (t as SoilTest).nitrogen && <div><span className="text-slate-400">N</span><span className="font-bold">{(t as SoilTest).nitrogen} kg/ha</span></div>}
                {tab === 'soil' && (t as SoilTest).phosphorus && <div><span className="text-slate-400">P</span><span className="font-bold">{(t as SoilTest).phosphorus} kg/ha</span></div>}
                {tab === 'soil' && (t as SoilTest).potassium && <div><span className="text-slate-400">K</span><span className="font-bold">{(t as SoilTest).potassium} kg/ha</span></div>}
                {tab === 'soil' && (t as SoilTest).organic_carbon && <div><span className="text-slate-400">Organic C</span><span className="font-bold">{(t as SoilTest).organic_carbon}%</span></div>}
                {tab === 'water' && (t as WaterTest).ph && <div><span className="text-slate-400">pH</span><span className="font-bold">{(t as WaterTest).ph?.toFixed(2)}</span></div>}
                {tab === 'water' && (t as WaterTest).ec && <div><span className="text-slate-400">EC</span><span className="font-bold">{(t as WaterTest).ec} dS/m</span></div>}
                {tab === 'water' && (t as WaterTest).hardness && <div><span className="text-slate-400">Hardness</span><span className="font-bold">{(t as WaterTest).hardness} mg/L</span></div>}
                {tab === 'water' && (t as WaterTest).sodium && <div><span className="text-slate-400">Na</span><span className="font-bold">{(t as WaterTest).sodium} mg/L</span></div>}
              </div>
              {t.notes && <p className="text-xs text-slate-600 mt-2 pt-2 border-t">{t.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
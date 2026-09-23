import React, { useState } from 'react';
import { useFarmData } from '../../contexts/FarmContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import { Recycle, Search } from 'lucide-react';

export const WastePage: React.FC = () => {
  const { farmWaste, compostBatches } = useFarmData();
  const [tab, setTab] = useState('waste');
  const [q, setQ] = useState('');
  const wasteData = farmWaste.filter(w => !q || w.farm_name?.toLowerCase().includes(q.toLowerCase())).sort((a, b) => new Date(b.collection_date).getTime() - new Date(a.collection_date).getTime());
  const compostData = compostBatches.filter(c => !q || c.farm_name?.toLowerCase().includes(q.toLowerCase())).sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
            <Recycle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Phase 4 Module</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Farm Waste & Compost Management</h1>
        </div>
        <Button variant="primary" size="md" onClick={() => alert('Entry form coming soon')}>Record Waste / Compost</Button>
      </div>

      <div className="flex rounded-2xl bg-white border border-slate-200/80 p-1 gap-1">
        <button onClick={() => setTab('waste')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${tab === 'waste' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          Waste ({farmWaste.length})
        </button>
        <button onClick={() => setTab('compost')} className={`flex-1 py-2 text-xs font-bold rounded-xl ${tab === 'compost' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-50'}`}>
          Compost ({compostBatches.length})
        </button>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input type="text" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600" />
      </div>

      {tab === 'waste' && (wasteData.length === 0 ? <EmptyState icon={<Recycle className="w-8 h-8" />} title="No waste records" description="Track your farm waste and recycling." /> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wasteData.map(w => (
            <div key={w.id} className="bg-white rounded-2xl border border-slate-200/80 p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={w.status === 'applied' ? 'emerald' : w.status === 'composted' ? 'blue' : 'slate'}>{w.status}</Badge>
                <span className="text-[10px] text-slate-400">{w.farm_name}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Recycle className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 capitalize">{w.waste_type.replace('_', ' ')}</h3>
              </div>
              <p className="text-xs text-slate-600"><span className="font-bold">{w.quantity}</span> {w.unit} - {w.collection_date}</p>
              {w.notes && <p className="text-xs text-slate-500 mt-2 pt-2 border-t">{w.notes}</p>}
            </div>
          ))}
        </div>
      )}

      {tab === 'compost' && (compostData.length === 0 ? <EmptyState icon={<Recycle className="w-8 h-8" />} title="No compost batches" description="Track your composting operations." /> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {compostData.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-slate-200/80 p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={c.status === 'finished' ? 'emerald' : c.status === 'active' ? 'blue' : 'slate'}>{c.status}</Badge>
                <span className="text-[10px] text-slate-400">{c.farm_name}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 capitalize">{c.compost_type.replace('_', ' ')}</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-slate-400">Started:</span><span className="font-medium">{c.start_date}</span></div>
                {c.volume_start && <div><span className="text-slate-400">Start:</span><span className="font-medium">{c.volume_start} {c.unit}</span></div>}
                {c.volume_finished && <div className="font-bold text-emerald-700"><span className="text-slate-400">Finished:</span> {c.volume_finished} {c.unit}</div>}
              </div>
              {c.notes && <p className="text-xs text-slate-500 mt-2 pt-2 border-t">{c.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
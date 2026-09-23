import React, { useState } from 'react';
import { useFarmData } from '../../contexts/FarmContext';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Bug, Plus, Search } from 'lucide-react';

export const PestPage: React.FC = () => {
  const { pestObservations, selectedFarmId } = useFarmData();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = pestObservations.filter(o => 
    !searchQuery || o.pest_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => new Date(b.observation_date).getTime() - new Date(a.observation_date).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
            <Bug className="w-3.5 h-3.5 text-emerald-700" />
            <span>Flagship Module - Phase 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pest Monitoring & IPM Advisory
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Record pest observations and track IPM decisions
          </p>
        </div>
        <Button variant="primary" size="md" onClick={() => alert('Pest observation form coming soon')}>
          Record Observation
        </Button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Search pests..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Bug className="w-8 h-8" />} title="No observations yet"
          description="Record your first pest observation to begin IPM tracking."
          actionText="Record First Observation" onAction={() => alert('Form coming soon')} />
      ) : (
        <div className="space-y-3">
          {filtered.map(obs => (
            <div key={obs.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{obs.pest_name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{obs.farm_name} {obs.crop_name ? `• ${obs.crop_name}` : ''}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  obs.severity === 'critical' ? 'bg-rose-100 text-rose-800' :
                  obs.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                  obs.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {obs.severity} severity
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2">{obs.symptoms}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                <span>Date: {obs.observation_date}</span>
                <span>Affected: {obs.affected_area_percent}%</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
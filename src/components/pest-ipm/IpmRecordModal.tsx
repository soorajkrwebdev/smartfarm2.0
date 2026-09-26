import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFarmData } from '../../contexts/FarmContext';
import { AdvisoryLevel, PestObservation } from '../../types';

interface IpmRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedObservation?: PestObservation | null;
  defaultLevel?: AdvisoryLevel;
  defaultPestName?: string;
}

export const IpmRecordModal: React.FC<IpmRecordModalProps> = ({
  isOpen,
  onClose,
  selectedObservation,
  defaultLevel,
  defaultPestName,
}) => {
  const { farms, crops, addIPMRecord } = useFarmData();
  const [farmId, setFarmId] = useState(selectedObservation?.farm_id || '');
  const [cropId, setCropId] = useState(selectedObservation?.crop_id || '');
  const [pestName, setPestName] = useState(
    selectedObservation?.pest_name || defaultPestName || ''
  );
  const [advisoryLevel, setAdvisoryLevel] = useState<AdvisoryLevel>(defaultLevel || 'biological');
  const [recommendation, setRecommendation] = useState('');
  const [rationale, setRationale] = useState('');
  const [sourceName, setSourceName] = useState('ICAR / Agricultural Extension');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolve the target farm even when the farm list loads after first render.
  const effFarmId = farmId || selectedObservation?.farm_id || farms[0]?.id || '';
  const farmCrops = crops.filter(c => c.farm_id === effFarmId);

  // Adjust state during render when the modal is (re)opened with a different
  // preselection, rather than synchronising through an effect.
  const syncKey = `${isOpen}|${selectedObservation?.id || ''}|${defaultLevel || ''}|${defaultPestName || ''}`;
  const [lastSyncKey, setLastSyncKey] = useState(syncKey);
  if (syncKey !== lastSyncKey) {
    setLastSyncKey(syncKey);
    if (isOpen) {
      if (selectedObservation) {
        setFarmId(selectedObservation.farm_id);
        setCropId(selectedObservation.crop_id || '');
        setPestName(selectedObservation.pest_name);
      } else if (defaultPestName) {
        setPestName(defaultPestName);
      }
      if (defaultLevel) setAdvisoryLevel(defaultLevel);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effFarmId || !pestName.trim() || !recommendation.trim()) {
      setError('Please fill in required fields: farm, target pest/disease and action.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await addIPMRecord({
      farm_id: effFarmId,
      crop_id: cropId || undefined,
      pest_observation_id: selectedObservation?.id || undefined,
      pest_name: pestName.trim(),
      advisory_level: advisoryLevel,
      recommendation: recommendation.trim(),
      rationale: rationale.trim() || 'Field IPM management decision',
      source_name: sourceName.trim(),
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
      setRecommendation('');
      setRationale('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record IPM Management Decision">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-xs text-emerald-800">
          <strong>IPM Decision Hierarchy:</strong> Prioritize 1. Prevention & Cultural &rarr; 2. Mechanical &rarr; 3. Biological &rarr; 4. Botanical &rarr; 5. Chemical (Last resort with strict PHI).
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm *</label>
            <select
              value={effFarmId}
              onChange={e => { setFarmId(e.target.value); setCropId(''); }}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Crop (optional)</label>
            <select
              value={cropId}
              onChange={e => setCropId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="">None</option>
              {farmCrops.map(c => <option key={c.id} value={c.id}>{c.crop_name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Pest / Disease *</label>
            <input
              type="text"
              value={pestName}
              onChange={e => setPestName(e.target.value)}
              placeholder="e.g. Koleroga, Stem Borer"
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Intervention Level *</label>
            <select
              value={advisoryLevel}
              onChange={e => setAdvisoryLevel(e.target.value as AdvisoryLevel)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="monitoring">Monitoring / Scouting</option>
              <option value="prevention">Prevention (Prophylactic)</option>
              <option value="cultural">Cultural Control (Drainage/Sanitation)</option>
              <option value="mechanical">Mechanical (Traps/Barriers/Pruning)</option>
              <option value="biological">Biological (Trichoderma/Pseudomonas/Metarhizium)</option>
              <option value="botanical">Botanical (Neem/NSKE/Plant Extracts)</option>
              <option value="chemical">Chemical (Targeted/Label Compliant)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Action / Recommendation *</label>
          <textarea
            placeholder="e.g. Apply a Trichoderma-enriched compost to the root basin after the monsoon shower, following the product label"
            value={recommendation}
            onChange={e => setRecommendation(e.target.value)}
            required
            rows={2}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Agronomic Rationale</label>
          <input
            type="text"
            placeholder="e.g. Biological suppression of Phytophthora zoospores before fungal sporulation"
            value={rationale}
            onChange={e => setRationale(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Authoritative Source</label>
          <input
            type="text"
            value={sourceName}
            onChange={e => setSourceName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Decision'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

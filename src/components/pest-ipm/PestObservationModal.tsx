import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFarmData } from '../../contexts/FarmContext';
import { PestSeverity, PestType } from '../../types';

interface PestObservationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GROWTH_STAGES = [
  'Nursery / Land Prep',
  'Vegetative',
  'Flowering',
  'Fruiting / Podding',
  'Maturity / Ripening',
  'Harvesting',
  'Post-Harvest',
] as const;

export const PestObservationModal: React.FC<PestObservationModalProps> = ({ isOpen, onClose }) => {
  const { farms, crops, addPestObservation } = useFarmData();
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [cropId, setCropId] = useState('');
  const [pestName, setPestName] = useState('');
  const [pestType, setPestType] = useState<PestType>('insect');
  const [symptoms, setSymptoms] = useState('');
  const [growthStage, setGrowthStage] = useState<string>('Vegetative');
  const [severity, setSeverity] = useState<PestSeverity>('low');
  const [affectedAreaPercent, setAffectedAreaPercent] = useState<number>(5);
  const [observationDate, setObservationDate] = useState(new Date().toISOString().split('T')[0]);
  const [photosInput, setPhotosInput] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const farmCrops = crops.filter(c => c.farm_id === farmId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) {
      setError('Please select a farm.');
      return;
    }
    if (!pestName.trim()) {
      setError('Please specify the pest or disease name.');
      return;
    }
    if (!symptoms.trim()) {
      setError('Please describe observed symptoms.');
      return;
    }

    setLoading(true);
    setError(null);

    const photos = photosInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const res = await addPestObservation({
      farm_id: farmId,
      crop_id: cropId || undefined,
      pest_name: pestName.trim(),
      pest_type: pestType,
      symptoms: symptoms.trim(),
      growth_stage: growthStage,
      severity,
      affected_area_percent: Number(affectedAreaPercent) || 0,
      observation_date: observationDate,
      photos: photos.length > 0 ? photos : undefined,
      notes: notes.trim() || undefined,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
      // Reset form
      setPestName('');
      setSymptoms('');
      setNotes('');
      setPhotosInput('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Record Pest & Disease Observation">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm *</label>
            <select
              value={farmId}
              onChange={e => {
                setFarmId(e.target.value);
                setCropId('');
              }}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              {farms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Affected Crop</label>
            <select
              value={cropId}
              onChange={e => setCropId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="">General / None</option>
              {farmCrops.map(c => (
                <option key={c.id} value={c.id}>{c.crop_name} ({c.variety || 'Standard'})</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Pest / Disease Name *</label>
            <input
              type="text"
              placeholder="e.g. Koleroga, Rhinoceros Beetle, Quick Wilt"
              value={pestName}
              onChange={e => setPestName(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Crop Growth Stage *</label>
            <select
              value={growthStage}
              onChange={e => setGrowthStage(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              {GROWTH_STAGES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
            <select
              value={pestType}
              onChange={e => setPestType(e.target.value as PestType)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="insect">Insect Pest</option>
              <option value="disease">Fungal / Bacterial Disease</option>
              <option value="nematode">Nematode</option>
              <option value="weed">Weed Competition</option>
              <option value="mammal">Mammal</option>
              <option value="bird">Bird</option>
              <option value="other">Other / Unknown</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Observed Symptoms *</label>
          <textarea
            placeholder="Describe what you see: e.g. dark water-soaked lesions on young nuts, chewed leaves, yellowing vines..."
            value={symptoms}
            onChange={e => setSymptoms(e.target.value)}
            required
            rows={2}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Severity *</label>
            <select
              value={severity}
              onChange={e => setSeverity(e.target.value as PestSeverity)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="low">Low (Trace / Scout)</option>
              <option value="medium">Medium (Moderate concern)</option>
              <option value="high">High (Economic damage risk)</option>
              <option value="critical">Critical (Severe outbreak)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Affected Area (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={affectedAreaPercent}
              onChange={e => setAffectedAreaPercent(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Observation Date</label>
            <input
              type="date"
              value={observationDate}
              onChange={e => setObservationDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Photo References (optional, comma-separated URLs)</label>
          <input
            type="text"
            placeholder="e.g. https://.../leaf-photo.jpg"
            value={photosInput}
            onChange={e => setPhotosInput(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Field Notes</label>
          <input
            type="text"
            placeholder="e.g. Seen primarily in southern shaded block after continuous rain"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Observation'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

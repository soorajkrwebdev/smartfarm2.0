import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFarmData } from '../../contexts/FarmContext';

interface SoilTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoilTestModal: React.FC<SoilTestModalProps> = ({ isOpen, onClose }) => {
  const { farms, addSoilTest } = useFarmData();
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [labName, setLabName] = useState('');
  const [ph, setPh] = useState<string>('6.2');
  const [nitrogen, setNitrogen] = useState<string>('240');
  const [phosphorus, setPhosphorus] = useState<string>('18');
  const [potassium, setPotassium] = useState<string>('190');
  const [organicCarbon, setOrganicCarbon] = useState<string>('0.85');
  const [ec, setEc] = useState<string>('0.25');
  const [micronutrients, setMicronutrients] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId) {
      setError('Please select a farm.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await addSoilTest({
      farm_id: farmId,
      test_date: testDate,
      lab_name: labName.trim() || undefined,
      ph: ph ? parseFloat(ph) : undefined,
      nitrogen: nitrogen ? parseFloat(nitrogen) : undefined,
      phosphorus: phosphorus ? parseFloat(phosphorus) : undefined,
      potassium: potassium ? parseFloat(potassium) : undefined,
      organic_carbon: organicCarbon ? parseFloat(organicCarbon) : undefined,
      electrical_conductivity: ec ? parseFloat(ec) : undefined,
      micronutrients: micronutrients.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
      setNotes('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Soil Health Test Record">
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
              onChange={e => setFarmId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              {farms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Test Date *</label>
            <input
              type="date"
              value={testDate}
              onChange={e => setTestDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Laboratory / KVK Name</label>
          <input
            type="text"
            placeholder="e.g. District Soil Testing Lab / ICAR-KVK"
            value={labName}
            onChange={e => setLabName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Soil pH (0-14)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="14"
              value={ph}
              onChange={e => setPh(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Organic Carbon (%)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={organicCarbon}
              onChange={e => setOrganicCarbon(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">EC (dS/m)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={ec}
              onChange={e => setEc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nitrogen (kg/ha)</label>
            <input
              type="number"
              step="1"
              value={nitrogen}
              onChange={e => setNitrogen(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phosphorus (kg/ha)</label>
            <input
              type="number"
              step="1"
              value={phosphorus}
              onChange={e => setPhosphorus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Potassium (kg/ha)</label>
            <input
              type="number"
              step="1"
              value={potassium}
              onChange={e => setPotassium(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Micronutrients & Observations</label>
          <input
            type="text"
            placeholder="e.g. Zinc sufficient, Boron deficient, Sandy loam texture"
            value={micronutrients}
            onChange={e => setMicronutrients(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Agronomist Notes</label>
          <input
            type="text"
            placeholder="e.g. Apply 1 kg agricultural lime per palm basin before pre-monsoon"
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
            {loading ? 'Saving...' : 'Save Soil Test'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

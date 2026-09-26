import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFarmData } from '../../contexts/FarmContext';

interface WaterTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaterTestModal: React.FC<WaterTestModalProps> = ({ isOpen, onClose }) => {
  const { farms, addWaterTest } = useFarmData();
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [labName, setLabName] = useState('');
  const [ph, setPh] = useState<string>('6.8');
  const [ec, setEc] = useState<string>('0.45');
  const [hardness, setHardness] = useState<string>('120');
  const [alkalinity, setAlkalinity] = useState<string>('150');
  const [suitability, setSuitability] = useState<'excellent' | 'good' | 'marginal' | 'poor' | 'unsuitable'>('good');
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

    const res = await addWaterTest({
      farm_id: farmId,
      test_date: testDate,
      lab_name: labName.trim() || undefined,
      ph: ph ? parseFloat(ph) : undefined,
      ec: ec ? parseFloat(ec) : undefined,
      hardness: hardness ? parseFloat(hardness) : undefined,
      alkalinity: alkalinity ? parseFloat(alkalinity) : undefined,
      suitability,
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Irrigation Water Test Record">
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
          <label className="block text-xs font-bold text-slate-700 mb-1">Testing Laboratory / Water Agency</label>
          <input
            type="text"
            placeholder="e.g. State Groundwater Testing Laboratory"
            value={labName}
            onChange={e => setLabName(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Water pH</label>
            <input
              type="number"
              step="0.01"
              value={ph}
              onChange={e => setPh(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">EC (dS/m or mS/cm)</label>
            <input
              type="number"
              step="0.01"
              value={ec}
              onChange={e => setEc(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Hardness (mg/L)</label>
            <input
              type="number"
              step="1"
              value={hardness}
              onChange={e => setHardness(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alkalinity (mg/L)</label>
            <input
              type="number"
              step="1"
              value={alkalinity}
              onChange={e => setAlkalinity(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Irrigation Suitability</label>
            <select
              value={suitability}
              onChange={e => setSuitability(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none capitalize"
            >
              <option value="excellent">Excellent</option>
              <option value="good">Good (Safe for all crops)</option>
              <option value="marginal">Marginal (Caution with sensitive crops)</option>
              <option value="poor">Poor (High salinity risk)</option>
              <option value="unsuitable">Unsuitable</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
          <input
            type="text"
            placeholder="e.g. Borewell water tested before summer irrigation cycle"
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
            {loading ? 'Saving...' : 'Save Water Test'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

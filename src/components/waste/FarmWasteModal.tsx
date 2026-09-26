import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFarmData } from '../../contexts/FarmContext';
import { WasteType, WasteStatus } from '../../types';

interface FarmWasteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmWasteModal: React.FC<FarmWasteModalProps> = ({ isOpen, onClose }) => {
  const { farms, addFarmWaste } = useFarmData();
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [wasteType, setWasteType] = useState<WasteType>('crop_residue');
  const [quantity, setQuantity] = useState<string>('50');
  const [unit, setUnit] = useState<string>('kg');
  const [collectionDate, setCollectionDate] = useState(new Date().toISOString().split('T')[0]);
  const [sourceLocation, setSourceLocation] = useState('');
  const [status, setStatus] = useState<WasteStatus>('collected');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId || !quantity || parseFloat(quantity) <= 0) {
      setError('Please provide a valid farm and quantity.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await addFarmWaste({
      farm_id: farmId,
      waste_type: wasteType,
      quantity: parseFloat(quantity),
      unit,
      collection_date: collectionDate,
      source_location: sourceLocation.trim() || undefined,
      status,
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
    <Modal isOpen={isOpen} onClose={onClose} title="Log Farm Biomass / Waste Collection">
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Waste / Biomass Category *</label>
            <select
              value={wasteType}
              onChange={e => setWasteType(e.target.value as WasteType)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="crop_residue">Crop Residue (Areca husk, stalks, coir)</option>
              <option value="leaves">Dried Leaves & Pruning Biomass</option>
              <option value="weeds">Uprooted Weeds & Grass Mulch</option>
              <option value="animal_waste">Animal Dung & Dairy Washings</option>
              <option value="organic_waste">Organic Household / Farm Waste</option>
              <option value="other">Other Farm Biomass</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
            <input
              type="number"
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Unit</label>
            <select
              value={unit}
              onChange={e => setUnit(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="kg">kg</option>
              <option value="quintals">quintals</option>
              <option value="tonnes">tonnes</option>
              <option value="trailer">trailer / cart load</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Collection Date</label>
            <input
              type="date"
              value={collectionDate}
              onChange={e => setCollectionDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Source / Plot Location</label>
            <input
              type="text"
              placeholder="e.g. South Block intercrop area"
              value={sourceLocation}
              onChange={e => setSourceLocation(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as WasteStatus)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="collected">Collected (Stored for Composting)</option>
              <option value="processing">Processing (In Pit)</option>
              <option value="composted">Converted to Compost</option>
              <option value="applied">Applied Directly as Mulch</option>
              <option value="disposed">Disposed / Farm Sweep</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
          <input
            type="text"
            placeholder="e.g. Shredded using mechanical shredder for vermicompost pit #2"
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
            {loading ? 'Saving...' : 'Save Waste Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFarmData } from '../../contexts/FarmContext';
import { CompostStatus } from '../../types';

interface CompostBatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompostBatchModal: React.FC<CompostBatchModalProps> = ({ isOpen, onClose }) => {
  const { farms, crops, addCompostBatch } = useFarmData();
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [compostType, setCompostType] = useState<'vermicompost' | 'farmyard_manure' | 'green_manure' | 'compost' | 'other'>('vermicompost');
  const [startingQuantity, setStartingQuantity] = useState<string>('200');
  const [unit, setUnit] = useState<string>('kg');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [processingMethod, setProcessingMethod] = useState('Earthworm biodegradation (Eisenia foetida) in shaded pit');
  const [status, setStatus] = useState<CompostStatus>('active');
  const [finishedQuantity, setFinishedQuantity] = useState<string>('');
  const [completionDate, setCompletionDate] = useState<string>('');
  const [appliedToCropId, setAppliedToCropId] = useState<string>('');
  const [qualityRating, setQualityRating] = useState<'excellent' | 'good' | 'fair'>('excellent');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const farmCrops = crops.filter(c => c.farm_id === farmId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId || !startingQuantity || parseFloat(startingQuantity) <= 0) {
      setError('Please specify a valid farm and starting quantity.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await addCompostBatch({
      farm_id: farmId,
      compost_type: compostType,
      starting_quantity: parseFloat(startingQuantity),
      unit,
      start_date: startDate,
      processing_method: processingMethod.trim() || undefined,
      status,
      finished_quantity: finishedQuantity ? parseFloat(finishedQuantity) : undefined,
      completion_date: completionDate || undefined,
      applied_to_crop_id: appliedToCropId || undefined,
      quality_rating: qualityRating,
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
    <Modal isOpen={isOpen} onClose={onClose} title="Create / Update Compost Batch">
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Compost Type *</label>
            <select
              value={compostType}
              onChange={e => setCompostType(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="vermicompost">Vermicompost (Earthworms)</option>
              <option value="farmyard_manure">Farmyard Manure (FYM Pit)</option>
              <option value="green_manure">Green Manure / In-situ Decomposition</option>
              <option value="compost">Aerobic Biomass Compost</option>
              <option value="other">Biological Strain Enhanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Starting Quantity *</label>
            <input
              type="number"
              min="1"
              step="1"
              value={startingQuantity}
              onChange={e => setStartingQuantity(e.target.value)}
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
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Batch Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as CompostStatus)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="preparing">Preparing Pits / Bedding</option>
              <option value="active">Active Decomposition (Mesophilic/Thermophilic)</option>
              <option value="curing">Curing & Cooling</option>
              <option value="finished">Finished Humus (Ready for Field Application)</option>
              <option value="used">Applied to Crops</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Quality Assessment</label>
            <select
              value={qualityRating}
              onChange={e => setQualityRating(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none capitalize"
            >
              <option value="excellent">Excellent (Dark, earthy, crumbly humus)</option>
              <option value="good">Good Quality</option>
              <option value="fair">Fair</option>
            </select>
          </div>
        </div>

        {(status === 'finished' || status === 'used') && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-emerald-900 mb-1">Finished Yield ({unit})</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g. 120"
                value={finishedQuantity}
                onChange={e => setFinishedQuantity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-900 mb-1">Completion Date</label>
              <input
                type="date"
                value={completionDate}
                onChange={e => setCompletionDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-emerald-900 mb-1">Applied To Crop</label>
              <select
                value={appliedToCropId}
                onChange={e => setAppliedToCropId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300 bg-white focus:outline-none"
              >
                <option value="">General Field Application</option>
                {farmCrops.map(c => (
                  <option key={c.id} value={c.id}>{c.crop_name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Processing Method / Inoculant</label>
          <input
            type="text"
            placeholder="e.g. Inoculated with cow dung slurry and Trichoderma; turned weekly"
            value={processingMethod}
            onChange={e => setProcessingMethod(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Batch Notes</label>
          <input
            type="text"
            placeholder="e.g. Pit #2 near irrigation sump; moisture maintained at 60%"
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
            {loading ? 'Saving...' : 'Save Compost Batch'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

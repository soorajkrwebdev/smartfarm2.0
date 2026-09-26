import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFarmData } from '../../contexts/FarmContext';
import { PestObservation } from '../../types';
import { CHEMICAL_DISCLAIMER, CHEMICAL_UNVERIFIED_PLACEHOLDER } from '../../lib/pesticideSafety';
import { Info } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedObservation?: PestObservation | null;
}

const UNITS = ['ml', 'L', 'g', 'kg'];
const AREA_UNITS = ['acres', 'cent', 'ha'];
const METHODS = ['Foliar spray', 'Soil drench', 'Broadcast', 'Crown application', 'Basal', 'Injection'];

export const PesticideApplicationModal: React.FC<Props> = (props) => {
  const d = useFarmData();
  const [farmId, setFarmId] = useState('');
  const [cropId, setCropId] = useState('');
  const [observationId, setObservationId] = useState('');
  const [productName, setProductName] = useState('');
  const [activeIngredient, setActiveIngredient] = useState('');
  const [applicationDate, setApplicationDate] = useState(new Date().toISOString().split('T')[0]);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('ml');
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('acres');
  const [method, setMethod] = useState('Foliar spray');
  const [sourceRef, setSourceRef] = useState('');
  const [phi, setPhi] = useState('');
  const [rei, setRei] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const effFarm = farmId || props.preselectedObservation?.farm_id || d.farms[0]?.id || '';
  const farmCrops = d.crops.filter((c) => c.farm_id === effFarm);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(quantity);
    const ar = Number(area);
    if (!effFarm || !cropId || !productName.trim() || !applicationDate || !qty || qty <= 0 || !ar || ar <= 0 || !method) {
      setError('Please fill all required fields: farm, crop, product, date, quantity + unit, area, application method.');
      return;
    }
    setLoading(true);
    setError(null);
    const res = await d.addPesticideApplication({
      farm_id: effFarm,
      crop_id: cropId || undefined,
      pest_observation_id: observationId || props.preselectedObservation?.id || undefined,
      product_name: productName.trim(),
      active_ingredient: activeIngredient.trim() || undefined,
      application_date: applicationDate,
      quantity: qty,
      unit,
      area: ar,
      area_unit: areaUnit,
      application_method: method,
      source_reference: sourceRef.trim() || undefined,
      pre_harvest_interval_days: phi === '' ? undefined : Number(phi),
      re_entry_interval_hours: rei === '' ? undefined : Number(rei),
      notes: notes.trim() || undefined,
      follow_up_date: followUp || undefined,
    });
    setLoading(false);
    if (res.error) { setError(res.error); } else { props.onClose(); setProductName(''); setNotes(''); }
  };
  const ic = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none';
  const sc = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none';
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title="Record Pesticide Application">
      <form onSubmit={submit} className="space-y-4">
        {error ? <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">{error}</div> : null}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
          <p>
            <strong className="text-slate-800">APPLICATION RECORD - </strong>
            <span>This records what was actually applied. It is not a platform recommendation.</span>
          </p>
          <p>{CHEMICAL_DISCLAIMER}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm *</label>
            <select value={effFarm} onChange={(e) => { setFarmId(e.target.value); setCropId(''); }} required className={sc}>
              {d.farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Crop *</label>
            <select value={cropId} onChange={(e) => setCropId(e.target.value)} required className={sc}>
              <option value="">Select crop</option>
              {farmCrops.map((c) => <option key={c.id} value={c.id}>{c.crop_name}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Linked Observation (optional)</label>
          <select value={observationId} onChange={(e) => setObservationId(e.target.value)} className={sc}>
            <option value="">None</option>
            {d.pestObservations.filter((o) => !effFarm || o.farm_id === effFarm).map((o) => (
              <option key={o.id} value={o.id}>{o.pest_name}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Name *</label>
            <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)} required className={ic} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Active Ingredient (optional)</label>
            <input type="text" value={activeIngredient} onChange={(e) => setActiveIngredient(e.target.value)} className={ic} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Application Date *</label>
            <input type="date" value={applicationDate} onChange={(e) => setApplicationDate(e.target.value)} required className={ic} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Quantity *</label>
            <div className="flex gap-2">
              <input type="number" min="0" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} required className={ic} />
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="px-2 py-2 text-xs rounded-xl border border-slate-200 bg-white">
                {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Area *</label>
            <div className="flex gap-2">
              <input type="number" min="0" step="any" value={area} onChange={(e) => setArea(e.target.value)} required className={ic} />
              <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)} className="px-2 py-2 text-xs rounded-xl border border-slate-200 bg-white">
                {AREA_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Application Method *</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} required className={sc}>
              {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Source / Reference (optional)</label>
            <input type="text" value={sourceRef} onChange={(e) => setSourceRef(e.target.value)} className={ic} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">PHI days (label value)</label>
            <input type="number" min="0" step="any" value={phi} onChange={(e) => setPhi(e.target.value)} placeholder="PHI not verified" className={ic} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">REI hours (label value)</label>
            <input type="number" min="0" step="any" value={rei} onChange={(e) => setRei(e.target.value)} placeholder="REI not verified" className={ic} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Date (optional)</label>
            <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} className={ic} />
          </div>
        </div>
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>Leave PHI/REI blank when the label value is not available at hand. {CHEMICAL_UNVERIFIED_PLACEHOLDER}</span>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={ic} />
        </div>
        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={props.onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Application Record'}</Button>
        </div>
      </form>
    </Modal>
  );
};

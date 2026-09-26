import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFarmData } from '../../contexts/FarmContext';
import { PestFollowUpOutcome, PestSeverity } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  preselectedObservationId?: string | null;
}

export const PestFollowUpModal: React.FC<Props> = (props) => {
  const d = useFarmData();
  const [farmId, setFarmId] = useState('');
  const [cropId, setCropId] = useState('');
  const [observationId, setObservationId] = useState('');
  const [applicationId, setApplicationId] = useState('');
  const [followUpDate, setFollowUpDate] = useState(new Date().toISOString().split('T')[0]);
  const [severityAfter, setSeverityAfter] = useState<PestSeverity>('low');
  const [areaAfter, setAreaAfter] = useState('');
  const [outcome, setOutcome] = useState<PestFollowUpOutcome>('unknown');
  const [notes, setNotes] = useState('');
  const [photosInput, setPhotosInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const effFarm = farmId || d.farms[0]?.id || '';
  const farmCrops = d.crops.filter((c) => c.farm_id === effFarm);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!effFarm || !followUpDate || !severityAfter || !outcome) {
      setError('Please fill all required fields: farm, follow-up date, severity, outcome.');
      return;
    }
    setLoading(true);
    setError(null);
    const photos = photosInput.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
    const res = await d.addPestFollowUp({
      farm_id: effFarm,
      crop_id: cropId || undefined,
      pest_observation_id: observationId || props.preselectedObservationId || undefined,
      pesticide_application_id: applicationId || undefined,
      follow_up_date: followUpDate,
      severity_after_treatment: severityAfter,
      affected_area_after_percent: areaAfter === '' ? undefined : Number(areaAfter),
      outcome,
      notes: notes.trim() || undefined,
      photos: photos.length > 0 ? photos : undefined,
    });
    setLoading(false);
    if (res.error) { setError(res.error); } else { props.onClose(); setNotes(''); setPhotosInput(''); }
  };
  const ic = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none';
  const sc = 'w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none';
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose} title="Log Pest Follow-up">
      <form onSubmit={submit} className="space-y-4">
        {error ? <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">{error}</div> : null}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
          <span>Record what was observed after treatment. The outcome label reflects the field observation only.</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm *</label>
            <select value={effFarm} onChange={(e) => { setFarmId(e.target.value); setCropId(''); }} required className={sc}>
              {d.farms.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Crop (optional)</label>
            <select value={cropId} onChange={(e) => setCropId(e.target.value)} className={sc}>
              <option value="">None</option>
              {farmCrops.map((c) => <option key={c.id} value={c.id}>{c.crop_name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Linked Observation (optional)</label>
            <select value={observationId} onChange={(e) => setObservationId(e.target.value)} className={sc}>
              <option value="">None</option>
              {d.pestObservations.filter((o) => !effFarm || o.farm_id === effFarm).map((o) => (
                <option key={o.id} value={o.id}>{o.pest_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Linked Application (optional)</label>
            <select value={applicationId} onChange={(e) => setApplicationId(e.target.value)} className={sc}>
              <option value="">None</option>
              {d.pesticideApplications.filter((a) => !effFarm || a.farm_id === effFarm).map((a) => (
                <option key={a.id} value={a.id}>{a.product_name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Date *</label>
            <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} required className={ic} />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Severity After Treatment *</label>
            <select value={severityAfter} onChange={(e) => setSeverityAfter(e.target.value as PestSeverity)} className={sc}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Affected Area After % (optional)</label>
            <input type="number" min="0" max="100" step="any" value={areaAfter} onChange={(e) => setAreaAfter(e.target.value)} className={ic} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Outcome *</label>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value as PestFollowUpOutcome)} className={sc}>
            <option value="improved">improved</option>
            <option value="unchanged">unchanged</option>
            <option value="worsened">worsened</option>
            <option value="unknown">unknown</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={ic} />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Photo References (optional, comma-separated URLs)</label>
          <input type="text" value={photosInput} onChange={(e) => setPhotosInput(e.target.value)} className={ic} />
        </div>
        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={props.onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Follow-up'}</Button>
        </div>
      </form>
    </Modal>
  );
};

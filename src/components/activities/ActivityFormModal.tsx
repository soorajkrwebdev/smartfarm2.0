import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { CropActivity, ActivityType, AreaUnit, FarmCrop } from '../../types';
import { useFarmData } from '../../contexts/FarmContext';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityToEdit?: CropActivity | null;
  defaultCrop?: FarmCrop | null;
  defaultFarmId?: string;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  'Planting',
  'Irrigation',
  'Fertilization',
  'Organic manure',
  'Biofertilizer application',
  'Weeding',
  'Mulching',
  'Pruning',
  'Pest monitoring',
  'Spraying',
  'Harvest',
  'Labour',
  'Custom activity',
];

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  activityToEdit,
  defaultCrop,
  defaultFarmId,
}) => {
  const { farms, crops, addActivity, updateActivity, selectedFarmId } = useFarmData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    farm_id: defaultCrop?.farm_id || defaultFarmId || selectedFarmId || '',
    crop_id: defaultCrop?.id || '',
    activity_type: 'Organic manure' as ActivityType,
    activity_date: new Date().toISOString().split('T')[0],
    quantity: '',
    unit: 'kg',
    cost: '0',
    area: '',
    area_unit: 'acres' as AreaUnit,
    notes: '',
  });

  useEffect(() => {
    if (activityToEdit) {
      setFormData({
        farm_id: activityToEdit.farm_id,
        crop_id: activityToEdit.crop_id || '',
        activity_type: activityToEdit.activity_type,
        activity_date: activityToEdit.activity_date,
        quantity: activityToEdit.quantity ? activityToEdit.quantity.toString() : '',
        unit: activityToEdit.unit || 'kg',
        cost: activityToEdit.cost ? activityToEdit.cost.toString() : '0',
        area: activityToEdit.area ? activityToEdit.area.toString() : '',
        area_unit: activityToEdit.area_unit || 'acres',
        notes: activityToEdit.notes || '',
      });
    } else {
      setFormData({
        farm_id: defaultCrop?.farm_id || defaultFarmId || selectedFarmId || (farms.length > 0 ? farms[0].id : ''),
        crop_id: defaultCrop?.id || '',
        activity_type: 'Organic manure',
        activity_date: new Date().toISOString().split('T')[0],
        quantity: '',
        unit: 'kg',
        cost: '0',
        area: '',
        area_unit: 'acres',
        notes: '',
      });
    }
    setError(null);
  }, [activityToEdit, defaultCrop, defaultFarmId, selectedFarmId, farms, isOpen]);

  // Filter crops based on selected farm in modal
  const availableCrops = crops.filter(c => c.farm_id === formData.farm_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farm_id) {
      setError('Please select a farm.');
      return;
    }
    if (!formData.activity_type || !formData.activity_date) {
      setError('Please specify activity type and execution date.');
      return;
    }

    const costNum = parseFloat(formData.cost) || 0;
    if (costNum < 0) {
      setError('Cost cannot be negative.');
      return;
    }

    const qtyNum = formData.quantity ? parseFloat(formData.quantity) : undefined;
    const areaNum = formData.area ? parseFloat(formData.area) : undefined;

    setLoading(true);
    setError(null);

    const payload = {
      farm_id: formData.farm_id,
      crop_id: formData.crop_id ? formData.crop_id : undefined,
      activity_type: formData.activity_type,
      activity_date: formData.activity_date,
      quantity: qtyNum,
      unit: formData.unit.trim() || undefined,
      cost: costNum,
      area: areaNum,
      area_unit: formData.area_unit,
      notes: formData.notes.trim() || undefined,
    };

    let result;
    if (activityToEdit) {
      result = await updateActivity(activityToEdit.id, payload);
    } else {
      result = await addActivity(payload);
    }

    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activityToEdit ? 'Edit Farm Activity' : 'Record Farm Activity'}
      subtitle="Log input applications, agronomic operations, labour, and associated costs"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Farm & Crop Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Farm"
            required
            value={formData.farm_id}
            onChange={e => setFormData({ ...formData, farm_id: e.target.value, crop_id: '' })}
          >
            <option value="">-- Select Farm --</option>
            {farms.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </Select>

          <Select
            label="Associated Crop (Optional)"
            value={formData.crop_id}
            onChange={e => setFormData({ ...formData, crop_id: e.target.value })}
          >
            <option value="">-- General Farm Activity --</option>
            {availableCrops.map(c => (
              <option key={c.id} value={c.id}>
                {c.crop_name} {c.variety ? `(${c.variety})` : ''}
              </option>
            ))}
          </Select>
        </div>

        {/* Activity Type & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Activity Type"
            required
            value={formData.activity_type}
            onChange={e => setFormData({ ...formData, activity_type: e.target.value as ActivityType })}
          >
            {ACTIVITY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          <Input
            label="Execution Date"
            type="date"
            required
            value={formData.activity_date}
            onChange={e => setFormData({ ...formData, activity_date: e.target.value })}
          />
        </div>

        {/* Quantity & Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Quantity / Volume"
            type="number"
            step="0.01"
            placeholder="e.g. 500"
            value={formData.quantity}
            onChange={e => setFormData({ ...formData, quantity: e.target.value })}
          />
          <Input
            label="Unit of Measurement"
            placeholder="e.g. kg, litres, hours, bundles, carts"
            value={formData.unit}
            onChange={e => setFormData({ ...formData, unit: e.target.value })}
          />
        </div>

        {/* Cost & Covered Area */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Input
              label="Total Cost (₹)"
              type="number"
              step="1"
              min="0"
              placeholder="0"
              value={formData.cost}
              onChange={e => setFormData({ ...formData, cost: e.target.value })}
            />
          </div>
          <div>
            <Input
              label="Treated Area"
              type="number"
              step="0.01"
              placeholder="e.g. 3.0"
              value={formData.area}
              onChange={e => setFormData({ ...formData, area: e.target.value })}
            />
          </div>
          <div>
            <Select
              label="Area Unit"
              value={formData.area_unit}
              onChange={e => setFormData({ ...formData, area_unit: e.target.value as AreaUnit })}
              options={[
                { value: 'acres', label: 'Acres' },
                { value: 'hectares', label: 'Hectares' },
                { value: 'cents', label: 'Cents' },
                { value: 'bigha', label: 'Bigha' },
                { value: 'guntha', label: 'Guntha' },
              ]}
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
            Activity Notes & Observations
          </label>
          <textarea
            rows={2}
            className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Include inputs applied, labor count, weather during spraying, or machinery used..."
            value={formData.notes}
            onChange={e => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" loading={loading}>
            {activityToEdit ? 'Save Activity' : 'Record Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

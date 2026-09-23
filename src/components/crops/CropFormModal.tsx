import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { FarmCrop, AreaUnit, GrowthStage, CropStatus, FarmingMethod } from '../../types';
import { useFarmData } from '../../contexts/FarmContext';

interface CropFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  cropToEdit?: FarmCrop | null;
  defaultFarmId?: string;
}

export const CropFormModal: React.FC<CropFormModalProps> = ({
  isOpen,
  onClose,
  cropToEdit,
  defaultFarmId,
}) => {
  const { farms, addCrop, updateCrop, selectedFarmId } = useFarmData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    farm_id: defaultFarmId || selectedFarmId || '',
    crop_name: '',
    variety: '',
    area: '',
    area_unit: 'acres' as AreaUnit,
    planting_date: new Date().toISOString().split('T')[0],
    expected_harvest_date: '',
    growth_stage: 'Vegetative' as GrowthStage,
    status: 'active' as CropStatus,
    soil_type: 'Laterite Red Loam',
    irrigation: 'Drip Irrigation',
    farming_method: 'organic' as FarmingMethod,
    notes: '',
  });

  useEffect(() => {
    if (cropToEdit) {
      setFormData({
        farm_id: cropToEdit.farm_id,
        crop_name: cropToEdit.crop_name,
        variety: cropToEdit.variety || '',
        area: cropToEdit.area ? cropToEdit.area.toString() : '',
        area_unit: cropToEdit.area_unit || 'acres',
        planting_date: cropToEdit.planting_date,
        expected_harvest_date: cropToEdit.expected_harvest_date || '',
        growth_stage: cropToEdit.growth_stage,
        status: cropToEdit.status,
        soil_type: cropToEdit.soil_type || '',
        irrigation: cropToEdit.irrigation || '',
        farming_method: cropToEdit.farming_method || 'organic',
        notes: cropToEdit.notes || '',
      });
    } else {
      setFormData({
        farm_id: defaultFarmId || selectedFarmId || (farms.length > 0 ? farms[0].id : ''),
        crop_name: '',
        variety: '',
        area: '',
        area_unit: 'acres',
        planting_date: new Date().toISOString().split('T')[0],
        expected_harvest_date: '',
        growth_stage: 'Vegetative',
        status: 'active',
        soil_type: 'Laterite Red Loam',
        irrigation: 'Drip Irrigation',
        farming_method: 'organic',
        notes: '',
      });
    }
    setError(null);
  }, [cropToEdit, isOpen, defaultFarmId, selectedFarmId, farms]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farm_id) {
      setError('Please select a farm for this crop.');
      return;
    }
    if (!formData.crop_name.trim() || !formData.planting_date) {
      setError('Please enter crop name and planting date.');
      return;
    }

    const areaNum = formData.area ? parseFloat(formData.area) : undefined;
    if (areaNum !== undefined && (isNaN(areaNum) || areaNum <= 0)) {
      setError('Crop area must be greater than 0.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      farm_id: formData.farm_id,
      crop_name: formData.crop_name.trim(),
      variety: formData.variety.trim(),
      area: areaNum,
      area_unit: formData.area_unit,
      planting_date: formData.planting_date,
      expected_harvest_date: formData.expected_harvest_date || undefined,
      growth_stage: formData.growth_stage,
      status: formData.status,
      soil_type: formData.soil_type.trim(),
      irrigation: formData.irrigation.trim(),
      farming_method: formData.farming_method,
      notes: formData.notes.trim(),
    };

    let result;
    if (cropToEdit) {
      result = await updateCrop(cropToEdit.id, payload);
    } else {
      result = await addCrop(payload);
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
      title={cropToEdit ? 'Edit Crop Cycle' : 'Register New Crop'}
      subtitle="Track variety, growth stages, planting schedule and agronomic timeline"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Farm Selection */}
        <Select
          label="Farm Location"
          required
          value={formData.farm_id}
          onChange={e => setFormData({ ...formData, farm_id: e.target.value })}
        >
          <option value="">-- Choose Farm --</option>
          {farms.map(f => (
            <option key={f.id} value={f.id}>
              {f.name} ({f.location})
            </option>
          ))}
        </Select>

        {/* Crop Name & Variety */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Crop Name"
            placeholder="e.g. Arecanut, Black Pepper, Paddy, Coffee"
            required
            value={formData.crop_name}
            onChange={e => setFormData({ ...formData, crop_name: e.target.value })}
          />
          <Input
            label="Variety / Cultivar"
            placeholder="e.g. Mangala, Panniyur-1, Gandhasale"
            value={formData.variety}
            onChange={e => setFormData({ ...formData, variety: e.target.value })}
          />
        </div>

        {/* Area & Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Cultivated Area"
              type="number"
              step="0.01"
              placeholder="e.g. 4.5"
              value={formData.area}
              onChange={e => setFormData({ ...formData, area: e.target.value })}
            />
          </div>
          <div>
            <Select
              label="Unit"
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

        {/* Dates: Planting & Expected Harvest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Planting / Sowing Date"
            type="date"
            required
            value={formData.planting_date}
            onChange={e => setFormData({ ...formData, planting_date: e.target.value })}
          />
          <Input
            label="Expected Harvest Date"
            type="date"
            value={formData.expected_harvest_date}
            onChange={e => setFormData({ ...formData, expected_harvest_date: e.target.value })}
          />
        </div>

        {/* Growth Stage & Crop Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Current Growth Stage"
            value={formData.growth_stage}
            onChange={e => setFormData({ ...formData, growth_stage: e.target.value as GrowthStage })}
            options={[
              { value: 'Nursery / Land Prep', label: 'Nursery / Land Prep' },
              { value: 'Vegetative', label: 'Vegetative' },
              { value: 'Flowering', label: 'Flowering' },
              { value: 'Fruiting / Podding', label: 'Fruiting / Podding' },
              { value: 'Maturity / Ripening', label: 'Maturity / Ripening' },
              { value: 'Harvesting', label: 'Harvesting' },
              { value: 'Post-Harvest', label: 'Post-Harvest' },
            ]}
          />
          <Select
            label="Cycle Status"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value as CropStatus })}
            options={[
              { value: 'active', label: 'Active Crop' },
              { value: 'harvested', label: 'Harvested' },
              { value: 'fallow', label: 'Fallow / Rest Period' },
              { value: 'failed', label: 'Failed' },
            ]}
          />
        </div>

        {/* Farming Method, Soil & Irrigation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Farming Method"
            value={formData.farming_method}
            onChange={e => setFormData({ ...formData, farming_method: e.target.value as FarmingMethod })}
            options={[
              { value: 'organic', label: 'Organic' },
              { value: 'natural', label: 'Natural / ZBNF' },
              { value: 'regenerative', label: 'Regenerative' },
              { value: 'integrated', label: 'Integrated' },
              { value: 'conventional', label: 'Conventional' },
            ]}
          />
          <Input
            label="Soil Type"
            placeholder="e.g. Red Loam"
            value={formData.soil_type}
            onChange={e => setFormData({ ...formData, soil_type: e.target.value })}
          />
          <Input
            label="Irrigation Method"
            placeholder="e.g. Drip, Micro-sprinkler"
            value={formData.irrigation}
            onChange={e => setFormData({ ...formData, irrigation: e.target.value })}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
            Crop Notes & Intercropping Details
          </label>
          <textarea
            rows={2}
            className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Note seed source, companion plants, spacing, or organic bio-stimulant schedules..."
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
            {cropToEdit ? 'Save Changes' : 'Register Crop'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

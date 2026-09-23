import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { FarmMapPicker } from './FarmMapPicker';
import { Farm, AreaUnit, FarmingMethod, OrganicStatus } from '../../types';
import { useFarmData } from '../../contexts/FarmContext';
import { MapPin, Map, AlignLeft } from 'lucide-react';

interface FarmFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmToEdit?: Farm | null;
}

export const FarmFormModal: React.FC<FarmFormModalProps> = ({
  isOpen,
  onClose,
  farmToEdit,
}) => {
  const { addFarm, updateFarm } = useFarmData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area: '',
    area_unit: 'acres' as AreaUnit,
    soil_type: 'Laterite Red Loam',
    irrigation_type: 'Drip & Sprinkler',
    farming_method: 'organic' as FarmingMethod,
    organic_status: 'in_conversion' as OrganicStatus,
    current_season: 'Kharif',
    description: '',
    latitude: 13.6937,
    longitude: 75.2415,
  });

  useEffect(() => {
    if (farmToEdit) {
      setFormData({
        name: farmToEdit.name,
        location: farmToEdit.location,
        area: farmToEdit.area.toString(),
        area_unit: farmToEdit.area_unit,
        soil_type: farmToEdit.soil_type || 'Laterite Red Loam',
        irrigation_type: farmToEdit.irrigation_type || 'Drip & Sprinkler',
        farming_method: farmToEdit.farming_method,
        organic_status: farmToEdit.organic_status,
        current_season: farmToEdit.current_season,
        description: farmToEdit.description || '',
        latitude: farmToEdit.latitude || 13.6937,
        longitude: farmToEdit.longitude || 75.2415,
      });
      setShowMap(Boolean(farmToEdit.latitude));
    } else {
      setFormData({
        name: '',
        location: '',
        area: '',
        area_unit: 'acres',
        soil_type: 'Laterite Red Loam',
        irrigation_type: 'Drip & Sprinkler',
        farming_method: 'organic',
        organic_status: 'in_conversion',
        current_season: 'Kharif',
        description: '',
        latitude: 13.6937,
        longitude: 75.2415,
      });
      setShowMap(false);
    }
    setError(null);
  }, [farmToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim() || !formData.area) {
      setError('Please fill in farm name, location, and total area.');
      return;
    }

    const areaNum = parseFloat(formData.area);
    if (isNaN(areaNum) || areaNum <= 0) {
      setError('Please provide a valid area number greater than 0.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name.trim(),
      location: formData.location.trim(),
      area: areaNum,
      area_unit: formData.area_unit,
      soil_type: formData.soil_type,
      irrigation_type: formData.irrigation_type,
      farming_method: formData.farming_method,
      organic_status: formData.organic_status,
      current_season: formData.current_season,
      description: formData.description.trim(),
      latitude: formData.latitude,
      longitude: formData.longitude,
    };

    let result;
    if (farmToEdit) {
      result = await updateFarm(farmToEdit.id, payload);
    } else {
      result = await addFarm(payload);
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
      title={farmToEdit ? 'Edit Farm Details' : 'Add New Farm'}
      subtitle="Configure farm boundaries, soil characteristics, and sustainable farming methods"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
            {error}
          </div>
        )}

        {/* Farm Name & Location */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Farm Name"
            placeholder="e.g. Green Valley Homestead"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Location / Village / District"
            placeholder="e.g. Thirthahalli, Shimoga"
            required
            value={formData.location}
            onChange={e => setFormData({ ...formData, location: e.target.value })}
          />
        </div>

        {/* Area & Area Unit */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <Input
              label="Farm Area"
              type="number"
              step="0.01"
              min="0.1"
              placeholder="e.g. 10.5"
              required
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

        {/* Farming Method, Organic Status & Season */}
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
              { value: 'mixed', label: 'Mixed System' },
            ]}
          />
          <Select
            label="Organic Status"
            value={formData.organic_status}
            onChange={e => setFormData({ ...formData, organic_status: e.target.value as OrganicStatus })}
            options={[
              { value: 'certified_organic', label: 'Certified Organic' },
              { value: 'in_conversion', label: 'In-Conversion (C1/C2/C3)' },
              { value: 'non_certified_organic', label: 'Non-Certified Organic' },
              { value: 'conventional', label: 'Conventional' },
            ]}
          />
          <Select
            label="Current Season"
            value={formData.current_season}
            onChange={e => setFormData({ ...formData, current_season: e.target.value })}
            options={[
              { value: 'Kharif', label: 'Kharif (Monsoon)' },
              { value: 'Rabi', label: 'Rabi (Winter)' },
              { value: 'Zaid', label: 'Zaid (Summer)' },
              { value: 'Perennial', label: 'Perennial Crops' },
              { value: 'Year-Round', label: 'Year-Round Active' },
            ]}
          />
        </div>

        {/* Soil Type & Irrigation Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Soil Type"
            placeholder="e.g. Laterite Red Loam / Clay Loam"
            value={formData.soil_type}
            onChange={e => setFormData({ ...formData, soil_type: e.target.value })}
          />
          <Input
            label="Irrigation System"
            placeholder="e.g. Drip Irrigation, Canal, Rainfed"
            value={formData.irrigation_type}
            onChange={e => setFormData({ ...formData, irrigation_type: e.target.value })}
          />
        </div>

        {/* Description / Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
            Farm Description & Ecological Features
          </label>
          <textarea
            rows={2}
            className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Mention agro-climatic zone, water sources, natural mulch or surrounding flora..."
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Coordinates & Map Toggle */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
              GPS Location (For Hyperlocal Weather)
            </span>
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
            >
              <Map className="w-3.5 h-3.5" />
              <span>{showMap ? 'Hide Map Picker' : 'Show Interactive Map Picker'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Latitude"
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={e => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Longitude"
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={e => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
            />
          </div>

          {showMap && (
            <div className="mt-3">
              <FarmMapPicker
                latitude={formData.latitude}
                longitude={formData.longitude}
                onChange={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })}
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" loading={loading}>
            {farmToEdit ? 'Save Changes' : 'Create Farm'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

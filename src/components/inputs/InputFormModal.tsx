import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Select } from '../common/Select';
import { Button } from '../common/Button';
import { FarmInput, InputCategory } from '../../types';
import { useFarmData } from '../../contexts/FarmContext';

interface InputFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputToEdit?: FarmInput | null;
  defaultFarmId?: string;
}

export const INPUT_CATEGORIES: InputCategory[] = [
  'Seeds',
  'Fertilizers',
  'Organic manure',
  'Biofertilizers',
  'Biological inputs',
  'Botanical inputs',
  'Pesticides',
  'Other',
];

export const InputFormModal: React.FC<InputFormModalProps> = ({
  isOpen,
  onClose,
  inputToEdit,
  defaultFarmId,
}) => {
  const { farms, crops, addInput, updateInput, selectedFarmId } = useFarmData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    farm_id: defaultFarmId || selectedFarmId || '',
    crop_id: '',
    product_name: '',
    category: 'Organic manure' as InputCategory,
    purchase_date: new Date().toISOString().split('T')[0],
    quantity: '',
    unit: 'kg',
    cost: '0',
    purpose: '',
    application_method: 'Soil application in root basin',
    batch_or_lot_no: '',
    supplier_or_source: '',
    notes: '',
  });

  useEffect(() => {
    if (inputToEdit) {
      setFormData({
        farm_id: inputToEdit.farm_id,
        crop_id: inputToEdit.crop_id || '',
        product_name: inputToEdit.product_name,
        category: inputToEdit.category,
        purchase_date: inputToEdit.purchase_date,
        quantity: inputToEdit.quantity.toString(),
        unit: inputToEdit.unit,
        cost: inputToEdit.cost.toString(),
        purpose: inputToEdit.purpose || '',
        application_method: inputToEdit.application_method || '',
        batch_or_lot_no: inputToEdit.batch_or_lot_no || '',
        supplier_or_source: inputToEdit.supplier_or_source || '',
        notes: inputToEdit.notes || '',
      });
    } else {
      setFormData({
        farm_id: defaultFarmId || selectedFarmId || (farms.length > 0 ? farms[0].id : ''),
        crop_id: '',
        product_name: '',
        category: 'Organic manure',
        purchase_date: new Date().toISOString().split('T')[0],
        quantity: '',
        unit: 'kg',
        cost: '0',
        purpose: '',
        application_method: 'Soil application in root basin',
        batch_or_lot_no: '',
        supplier_or_source: '',
        notes: '',
      });
    }
    setError(null);
  }, [inputToEdit, defaultFarmId, selectedFarmId, farms, isOpen]);

  const availableCrops = crops.filter(c => c.farm_id === formData.farm_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.farm_id) {
      setError('Please select a farm.');
      return;
    }
    if (!formData.product_name.trim() || !formData.quantity || !formData.unit.trim()) {
      setError('Please provide product name, quantity, and unit of measurement.');
      return;
    }

    const qtyNum = parseFloat(formData.quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) {
      setError('Quantity must be greater than 0.');
      return;
    }

    const costNum = parseFloat(formData.cost) || 0;
    if (costNum < 0) {
      setError('Cost cannot be negative.');
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      farm_id: formData.farm_id,
      crop_id: formData.crop_id ? formData.crop_id : undefined,
      product_name: formData.product_name.trim(),
      category: formData.category,
      purchase_date: formData.purchase_date,
      quantity: qtyNum,
      unit: formData.unit.trim(),
      cost: costNum,
      purpose: formData.purpose.trim() || undefined,
      application_method: formData.application_method.trim() || undefined,
      batch_or_lot_no: formData.batch_or_lot_no.trim() || undefined,
      supplier_or_source: formData.supplier_or_source.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    let result;
    if (inputToEdit) {
      result = await updateInput(inputToEdit.id, payload);
    } else {
      result = await addInput(payload);
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
      title={inputToEdit ? 'Edit Agricultural Input' : 'Add Agricultural Input'}
      subtitle="Track inputs, seed varieties, biofertilizers, manures, and inventory costs"
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
            <option value="">-- Choose Farm --</option>
            {farms.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </Select>

          <Select
            label="Assigned Crop (Optional)"
            value={formData.crop_id}
            onChange={e => setFormData({ ...formData, crop_id: e.target.value })}
          >
            <option value="">-- General Farm Inventory --</option>
            {availableCrops.map(c => (
              <option key={c.id} value={c.id}>
                {c.crop_name} {c.variety ? `(${c.variety})` : ''}
              </option>
            ))}
          </Select>
        </div>

        {/* Product Name & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product / Input Name"
            placeholder="e.g. Enriched Neem Cake, Trichoderma, Rock Phosphate"
            required
            value={formData.product_name}
            onChange={e => setFormData({ ...formData, product_name: e.target.value })}
          />

          <Select
            label="Input Category"
            required
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value as InputCategory })}
          >
            {INPUT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>

        {/* Date, Quantity, Unit, Cost */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <Input
              label="Purchase Date"
              type="date"
              required
              value={formData.purchase_date}
              onChange={e => setFormData({ ...formData, purchase_date: e.target.value })}
            />
          </div>
          <div>
            <Input
              label="Quantity"
              type="number"
              step="0.01"
              required
              placeholder="e.g. 50"
              value={formData.quantity}
              onChange={e => setFormData({ ...formData, quantity: e.target.value })}
            />
          </div>
          <div>
            <Input
              label="Unit"
              required
              placeholder="kg, litres, bags"
              value={formData.unit}
              onChange={e => setFormData({ ...formData, unit: e.target.value })}
            />
          </div>
          <div>
            <Input
              label="Total Cost (₹)"
              type="number"
              step="1"
              min="0"
              value={formData.cost}
              onChange={e => setFormData({ ...formData, cost: e.target.value })}
            />
          </div>
        </div>

        {/* Purpose & Application Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Agronomic Purpose"
            placeholder="e.g. Slow-release nitrogen, fungal root shielding"
            value={formData.purpose}
            onChange={e => setFormData({ ...formData, purpose: e.target.value })}
          />
          <Input
            label="Application Method"
            placeholder="e.g. Soil incorporation, foliar spray, drip"
            value={formData.application_method}
            onChange={e => setFormData({ ...formData, application_method: e.target.value })}
          />
        </div>

        {/* Supplier / Source & Batch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Supplier / Source / Cooperative"
            placeholder="e.g. Shimoga Organic Farmers FPO"
            value={formData.supplier_or_source}
            onChange={e => setFormData({ ...formData, supplier_or_source: e.target.value })}
          />
          <Input
            label="Batch / Lot Number"
            placeholder="e.g. B-2026-99"
            value={formData.batch_or_lot_no}
            onChange={e => setFormData({ ...formData, batch_or_lot_no: e.target.value })}
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 tracking-wide uppercase mb-1.5">
            Input Notes & NPOP Compliance Details
          </label>
          <textarea
            rows={2}
            className="block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            placeholder="Active ingredients, organic certification label, expiry date or storage condition..."
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
            {inputToEdit ? 'Save Changes' : 'Record Input'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

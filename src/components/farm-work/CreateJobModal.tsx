import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useFarmData } from '../../contexts/FarmContext';
import { createFarmJob } from '../../services/farmJobService';
import { WorkType, WageUnit } from '../../types';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: () => void;
}

export const CreateJobModal: React.FC<CreateJobModalProps> = ({
  isOpen,
  onClose,
  onJobCreated,
}) => {
  const { user } = useAuth();
  const { farms } = useFarmData();
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [title, setTitle] = useState('');
  const [workType, setWorkType] = useState<WorkType>('Harvesting');
  const [location, setLocation] = useState(farms[0]?.location || '');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [workersNeeded, setWorkersNeeded] = useState<number>(3);
  const [wageRate, setWageRate] = useState<string>('600');
  const [wageUnit, setWageUnit] = useState<WageUnit>('day');
  const [description, setDescription] = useState('');
  const [contactPreference, setContactPreference] = useState<'phone' | 'inquiry' | 'both'>('both');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in as a farmer to post a job.');
      return;
    }
    if (!farmId || !title.trim() || !description.trim() || !location.trim()) {
      setError('Please fill in all required job fields.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await createFarmJob(user.id, {
      farm_id: farmId,
      title: title.trim(),
      location: location.trim(),
      work_type: workType,
      start_date: startDate,
      end_date: endDate || undefined,
      workers_needed: Number(workersNeeded),
      wage_rate: wageRate ? parseFloat(wageRate) : undefined,
      wage_unit: wageUnit,
      description: description.trim(),
      contact_preference: contactPreference,
      contact_phone: contactPhone.trim() || undefined,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
      onJobCreated?.();
      setTitle('');
      setDescription('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Post Farm Work Listing">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Farm *</label>
            <select
              value={farmId}
              onChange={e => {
                setFarmId(e.target.value);
                const f = farms.find(farm => farm.id === e.target.value);
                if (f) setLocation(f.location);
              }}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              {farms.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Type *</label>
            <select
              value={workType}
              onChange={e => setWorkType(e.target.value as WorkType)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="Harvesting">Harvesting (Arecanut/Pepper/Coconut)</option>
              <option value="Pruning">Pruning & Canopy Management</option>
              <option value="Weeding">Weeding & Basin Preparation</option>
              <option value="Planting">Planting & Pit Preparation</option>
              <option value="Irrigation">Irrigation & Drip Maintenance</option>
              <option value="Processing">Post-Harvest Processing / Drying</option>
              <option value="Transport">Transport & Sump Hauling</option>
              <option value="Labour">General Farm Labour</option>
              <option value="Other">Other Agricultural Work</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Job Title *</label>
          <input
            type="text"
            placeholder="e.g. Need 4 experienced climbers for Arecanut harvesting"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Location / Village *</label>
            <input
              type="text"
              placeholder="e.g. Sakleshpur, Hassan District"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Workers Needed *</label>
            <input
              type="number"
              min="1"
              max="100"
              value={workersNeeded}
              onChange={e => setWorkersNeeded(Number(e.target.value))}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Offered Wage (Rs)</label>
            <input
              type="number"
              min="0"
              value={wageRate}
              onChange={e => setWageRate(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Per</label>
            <select
              value={wageUnit}
              onChange={e => setWageUnit(e.target.value as WageUnit)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="day">Day</option>
              <option value="hour">Hour</option>
              <option value="piece">Tree / Palm</option>
              <option value="contract">Total Contract</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Job Details & Requirements *</label>
          <textarea
            placeholder="Describe the nature of work, tools provided, meals/transport arrangements if any..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Applicant Contact Mode</label>
            <select
              value={contactPreference}
              onChange={e => setContactPreference(e.target.value as any)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="both">Phone & In-App Inquiry</option>
              <option value="phone">Direct Phone Call Only</option>
              <option value="inquiry">Online Inquiry Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Publish Farm Job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

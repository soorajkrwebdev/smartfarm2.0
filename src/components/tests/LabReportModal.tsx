import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFarmData } from '../../contexts/FarmContext';
import { LabReportType } from '../../types';

interface LabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({ isOpen, onClose }) => {
  const { farms } = useFarmData();
  // addLabReport will be wired in a future set when lab_reports table is fully in context
  const addLabReport = async (_data: any) => ({ error: 'Lab report storage coming soon.' });
  const [farmId, setFarmId] = useState(farms[0]?.id || '');
  const [reportType, setReportType] = useState<LabReportType>('soil');
  const [title, setTitle] = useState('');
  const [labName, setLabName] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [documentUrl, setDocumentUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId || !title.trim()) {
      setError('Please provide a report title and select a farm.');
      return;
    }

    setLoading(true);
    setError(null);

    const res = await addLabReport({
      farm_id: farmId,
      report_type: reportType,
      title: title.trim(),
      lab_name: labName.trim() || undefined,
      issue_date: issueDate,
      document_url: documentUrl.trim() || undefined,
      certification_disclaimer:
        'Farmer record only. Uploaded documents do not constitute official platform certification.',
      notes: notes.trim() || undefined,
    });

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
      setTitle('');
      setDocumentUrl('');
      setNotes('');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Laboratory Document / Report Record">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-900 leading-relaxed">
          <strong>Notice:</strong> Farmer record only. Uploading a lab report, soil card or test document archives it in your farm ledger for audits. It does <em>not</em> mean the platform issues or guarantees certification.
        </div>

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
            <label className="block text-xs font-bold text-slate-700 mb-1">Report Category *</label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value as LabReportType)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none"
            >
              <option value="soil">Soil Health Analysis</option>
              <option value="water">Water Quality Certificate</option>
              <option value="input_analysis">Manure / Bio-Input Test</option>
              <option value="residue_report">Pesticide Residue Analysis</option>
              <option value="certification">Certification Audit Document</option>
              <option value="other">Other Laboratory Document</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Document Title *</label>
          <input
            type="text"
            placeholder="e.g. Annual Heavy Metal & Residue Screening 2026"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Testing Laboratory</label>
            <input
              type="text"
              placeholder="e.g. NABL Accredited Analytical Lab"
              value={labName}
              onChange={e => setLabName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Date of Issue *</label>
            <input
              type="date"
              value={issueDate}
              onChange={e => setIssueDate(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Document / Certificate Reference URL</label>
          <input
            type="text"
            placeholder="https://... or certificate ID number"
            value={documentUrl}
            onChange={e => setDocumentUrl(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
          <input
            type="text"
            placeholder="e.g. Zero detectable synthetic residues observed"
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
            {loading ? 'Saving...' : 'Save Report Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

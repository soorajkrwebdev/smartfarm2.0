import React, { useState } from 'react';
import { useFarmData } from '../contexts/FarmContext';
import { Button } from '../components/common/Button';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import {
  IndianRupee,
  Plus,
  Search,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { FarmExpense, ExpenseCategory } from '../types';

// ─── Expense Form Modal ───────────────────────────────────────────────────────
interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingExpense?: FarmExpense | null;
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'seeds', 'manure', 'fertilizer', 'pesticide',
  'labour', 'irrigation', 'machinery', 'transport', 'other',
];

const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, editingExpense }) => {
  const { farms, crops, addExpense, updateExpense } = useFarmData();

  const [farmId, setFarmId] = useState(editingExpense?.farm_id ?? farms[0]?.id ?? '');
  const [cropId, setCropId] = useState(editingExpense?.crop_id ?? '');
  const [category, setCategory] = useState<ExpenseCategory>(editingExpense?.category ?? 'labour');
  const [amount, setAmount] = useState(editingExpense?.amount?.toString() ?? '');
  const [date, setDate] = useState(editingExpense?.expense_date ?? new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(editingExpense?.description ?? '');
  const [vendor, setVendor] = useState(editingExpense?.vendor_or_source ?? '');
  const [notes, setNotes] = useState(editingExpense?.notes ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const farmCrops = crops.filter(c => c.farm_id === farmId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmId || !amount || parseFloat(amount) < 0 || !description.trim()) {
      setError('Farm, amount, and description are required.');
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      farm_id: farmId,
      crop_id: cropId || undefined,
      category,
      amount: parseFloat(amount),
      expense_date: date,
      description: description.trim(),
      vendor_or_source: vendor.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    const res = editingExpense
      ? await updateExpense(editingExpense.id, payload)
      : await addExpense(payload);

    setLoading(false);
    if (res.error) {
      setError(res.error);
    } else {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingExpense ? 'Edit Expense' : 'Record Farm Expense'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm *</label>
            <select value={farmId} onChange={e => { setFarmId(e.target.value); setCropId(''); }} required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none">
              {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Crop (optional)</label>
            <select value={cropId} onChange={e => setCropId(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none">
              <option value="">General Farm Expense</option>
              {farmCrops.map(c => <option key={c.id} value={c.id}>{c.crop_name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value as ExpenseCategory)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:border-emerald-600 focus:outline-none capitalize">
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Amount (₹) *</label>
            <input type="number" min="0" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required
              placeholder="0.00"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} required
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Vendor / Source</label>
            <input type="text" value={vendor} onChange={e => setVendor(e.target.value)}
              placeholder="e.g. Local agri store"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Description *</label>
          <input type="text" value={description} onChange={e => setDescription(e.target.value)} required
            placeholder="e.g. 10 kg Azospirillum biofertiliser purchase"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none" />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
          <input type="text" value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Any additional notes"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none" />
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <Button variant="outline" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button variant="primary" size="sm" type="submit" loading={loading}>
            {editingExpense ? 'Save Changes' : 'Record Expense'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const ExpensesPage: React.FC = () => {
  const { expenses, deleteExpense, loading } = useFarmData();

  const [q, setQ] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<FarmExpense | null>(null);

  const filtered = expenses.filter(e => {
    const matchesQ = !q ||
      e.description.toLowerCase().includes(q.toLowerCase()) ||
      e.farm_name?.toLowerCase().includes(q.toLowerCase()) ||
      e.vendor_or_source?.toLowerCase().includes(q.toLowerCase());
    const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesQ && matchesCat;
  });

  const totalAmount = filtered.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  // Breakdown by category from filtered set
  const byCategory: Record<string, number> = {};
  filtered.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + Number(e.amount);
  });
  const catEntries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const maxCatAmount = Math.max(...Object.values(byCategory), 1);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading expenses…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Farm Expenses</h1>
          <p className="text-xs text-slate-500 mt-1">
            Record all farm expenditure by category. Every entry persists to Supabase.
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}
          onClick={() => { setEditingExpense(null); setIsModalOpen(true); }}>
          Record Expense
        </Button>
      </div>

      {/* Summary + breakdown */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border p-5">
            <p className="text-xs text-slate-500 font-medium mb-1">Total (filtered)</p>
            <p className="text-3xl font-extrabold text-slate-900">
              ₹{totalAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-slate-400 mt-1">{filtered.length} records</p>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl border p-5">
            <p className="text-xs font-bold text-slate-700 mb-3">By Category</p>
            <div className="space-y-2">
              {catEntries.slice(0, 5).map(([cat, amt]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-slate-700 capitalize">{cat}</span>
                    <span className="text-xs text-slate-500">₹{amt.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(amt / maxCatAmount) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input type="text" value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search description, farm, vendor…"
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none" />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:border-emerald-600 focus:outline-none cursor-pointer">
          <option value="all">All Categories</option>
          {EXPENSE_CATEGORIES.map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Records */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<IndianRupee className="w-10 h-10 text-slate-300" />}
          title={expenses.length === 0 ? 'No expenses recorded yet' : 'No matching records'}
          description={
            expenses.length === 0
              ? 'Record your farm expenditure — seeds, labour, inputs, irrigation, machinery — to track costs and feed the analytics.'
              : 'Try clearing filters to see all expense records.'
          }
          actionText="Record First Expense"
          onAction={() => { setEditingExpense(null); setIsModalOpen(true); }}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs min-w-[620px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-3 font-bold text-slate-600">Date</th>
                  <th className="text-left p-3 font-bold text-slate-600">Description</th>
                  <th className="text-left p-3 font-bold text-slate-600">Category</th>
                  <th className="text-left p-3 font-bold text-slate-600">Farm / Crop</th>
                  <th className="text-right p-3 font-bold text-slate-600">Amount (₹)</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-slate-500 whitespace-nowrap">{e.expense_date}</td>
                    <td className="p-3 font-semibold text-slate-800">
                      {e.description}
                      {e.vendor_or_source && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          {e.vendor_or_source}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className="capitalize px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                        {e.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {e.farm_name}
                      {e.crop_name && e.crop_name !== 'General Farm' && (
                        <span className="block text-[10px] text-slate-400">{e.crop_name}</span>
                      )}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ₹{Number(e.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3 text-right">
                      <button onClick={() => deleteExpense(e.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete expense">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-slate-200 bg-slate-50">
                <tr>
                  <td colSpan={4} className="p-3 text-xs font-bold text-slate-700 text-right">
                    Total ({filtered.length} records)
                  </td>
                  <td className="p-3 text-right font-extrabold text-slate-900">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
        <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>
          Expense records are farmer-entered and stored in your private Supabase account.
          They feed the Analytics and Reports modules. They are not audited or validated by this platform.
        </p>
      </div>

      <ExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} editingExpense={editingExpense} />
    </div>
  );
};

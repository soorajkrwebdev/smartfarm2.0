import React, { useState } from 'react';
import { useFarmData } from '../../contexts/FarmContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Recycle,
  Search,
  Plus,
  Trash2,
  Leaf,
  Sprout,
  ArrowRight,
} from 'lucide-react';
import { FarmWasteModal } from '../../components/waste/FarmWasteModal';
import { CompostBatchModal } from '../../components/waste/CompostBatchModal';
import { FarmWaste } from '../../types';

export const WastePage: React.FC = () => {
  const {
    farmWaste,
    compostBatches,
    deleteFarmWaste,
    deleteCompostBatch,
    updateFarmWaste,
  } = useFarmData();

  const [tab, setTab] = useState<'waste' | 'compost'>('waste');
  const [q, setQ] = useState('');
  const [isWasteModalOpen, setIsWasteModalOpen] = useState(false);
  const [isCompostModalOpen, setIsCompostModalOpen] = useState(false);
  const [compostPrefill, setCompostPrefill] = useState<{ farmId?: string; quantity?: number; unit?: string } | undefined>();

  /** Open the compost modal pre-filled from a waste record and mark the waste as 'processing' */
  const handleStartComposting = async (w: FarmWaste) => {
    // Mark waste as processing
    await updateFarmWaste(w.id, { status: 'processing' });
    setCompostPrefill({ farmId: w.farm_id, quantity: w.quantity, unit: w.unit });
    setTab('compost');
    setIsCompostModalOpen(true);
  };

  const wasteData = farmWaste
    .filter(
      w =>
        !q ||
        w.farm_name?.toLowerCase().includes(q.toLowerCase()) ||
        w.waste_type.toLowerCase().includes(q.toLowerCase()) ||
        w.notes?.toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => new Date(b.collection_date).getTime() - new Date(a.collection_date).getTime());

  const compostData = compostBatches
    .filter(
      c =>
        !q ||
        c.farm_name?.toLowerCase().includes(q.toLowerCase()) ||
        c.compost_type.toLowerCase().includes(q.toLowerCase()) ||
        c.notes?.toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());

  const totalWasteRecycled = farmWaste
    .filter(w => w.status === 'composted' || w.status === 'applied')
    .reduce((sum, w) => sum + (w.quantity || 0), 0);

  const totalCompostProduced = compostBatches
    .filter(c => c.status === 'finished' || c.status === 'used')
    .reduce((sum, c) => sum + (c.finished_quantity || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
            <Recycle className="w-3.5 h-3.5 text-emerald-700" />
            <span>Circular Bio-Economy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Farm Waste & Compost Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Transform farm residue, biomass, and animal dung into humus-rich vermicompost and bio-manure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tab === 'waste' ? (
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsWasteModalOpen(true)}
            >
              Log Waste Collection
            </Button>
          ) : (
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsCompostModalOpen(true)}
            >
              New Compost Batch
            </Button>
          )}
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Total Biomass Logged</span>
            <Recycle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">
            {farmWaste.reduce((s, w) => s + w.quantity, 0)} kg
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Across {farmWaste.length} collection logs</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Biomass Recycled / Composted</span>
            <Leaf className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-2xl font-extrabold text-teal-700">{totalWasteRecycled} kg</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Diverted from burning or disposal</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Finished Compost Yield</span>
            <Sprout className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-700">{totalCompostProduced} kg</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Active batches: {compostBatches.filter(c => c.status === 'active').length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-white border border-slate-200/80 p-1 gap-1">
        <button
          onClick={() => setTab('waste')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            tab === 'waste' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Biomass & Waste Logs ({farmWaste.length})
        </button>
        <button
          onClick={() => setTab('compost')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            tab === 'compost' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Composting Batches ({compostBatches.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search logs by farm, waste type or notes..."
          value={q}
          onChange={e => setQ(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
        />
      </div>

      {/* Tab Content: Waste Logs */}
      {tab === 'waste' && (
        <>
          {wasteData.length === 0 ? (
            <EmptyState
              icon={<Recycle className="w-8 h-8" />}
              title="No farm biomass or waste logged"
              description="Track crop residues, dried areca leaves, weeds and manure for recycling into vermicompost."
              actionText="Log Biomass Collection"
              onAction={() => setIsWasteModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wasteData.map(w => (
                <div
                  key={w.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-shadow relative"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {w.farm_name || 'Farm'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          w.status === 'composted' || w.status === 'applied'
                            ? 'emerald'
                            : w.status === 'processing'
                            ? 'amber'
                            : 'slate'
                        }
                      >
                        {w.status}
                      </Badge>
                      <button
                        onClick={() => deleteFarmWaste(w.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 capitalize mt-1">
                    {w.waste_type.replace(/_/g, ' ')}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Quantity: <strong className="text-slate-900">{w.quantity} {w.unit}</strong> • {w.collection_date}
                  </p>

                  {w.source_location && (
                    <p className="text-[11px] text-slate-400 mt-1">
                      Plot: {w.source_location}
                    </p>
                  )}

                  {w.notes && (
                    <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                      {w.notes}
                    </p>
                  )}

                  {/* Workflow: start composting from this waste */}
                  {(w.status === 'collected' || w.status === 'processing') && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleStartComposting(w)}
                        className="w-full flex items-center justify-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 hover:bg-emerald-100 transition-colors cursor-pointer"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Start Compost Batch from this Waste
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab Content: Compost Batches */}
      {tab === 'compost' && (
        <>
          {compostData.length === 0 ? (
            <EmptyState
              icon={<Sprout className="w-8 h-8" />}
              title="No composting batches started"
              description="Start a vermicompost or FYM batch to track the decomposition cycle from raw biomass to finished organic manure."
              actionText="Start New Compost Batch"
              onAction={() => setIsCompostModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {compostData.map(c => (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-shadow relative"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {c.farm_name || 'Farm'}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          c.status === 'finished' || c.status === 'used'
                            ? 'emerald'
                            : c.status === 'active' || c.status === 'curing'
                            ? 'blue'
                            : 'slate'
                        }
                      >
                        {c.status}
                      </Badge>
                      <button
                        onClick={() => deleteCompostBatch(c.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Delete batch"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 capitalize mt-1">
                    {c.compost_type.replace(/_/g, ' ')}
                  </h3>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">STARTED</span>
                      <span className="font-semibold text-slate-700">{c.start_date}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">INPUT QUANTITY</span>
                      <span className="font-semibold text-slate-700">{c.starting_quantity} {c.unit}</span>
                    </div>
                    {c.finished_quantity !== undefined && (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">FINISHED YIELD</span>
                        <span className="font-bold text-emerald-700">{c.finished_quantity} {c.unit}</span>
                      </div>
                    )}
                    {c.quality_rating && (
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">QUALITY</span>
                        <span className="font-semibold text-slate-700 capitalize">{c.quality_rating}</span>
                      </div>
                    )}
                  </div>

                  {c.processing_method && (
                    <p className="text-[11px] text-slate-500 mt-2">
                      <strong>Method: </strong>{c.processing_method}
                    </p>
                  )}

                  {c.notes && (
                    <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
                      {c.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <FarmWasteModal
        isOpen={isWasteModalOpen}
        onClose={() => setIsWasteModalOpen(false)}
      />
      <CompostBatchModal
        isOpen={isCompostModalOpen}
        onClose={() => { setIsCompostModalOpen(false); setCompostPrefill(undefined); }}
        prefill={compostPrefill}
      />
    </div>
  );
};
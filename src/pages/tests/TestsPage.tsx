import React, { useState } from 'react';
import { useFarmData } from '../../contexts/FarmContext';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import {
  TestTube,
  Search,
  Plus,
  Trash2,
  Droplets,
  FileText,
  ShieldAlert,
} from 'lucide-react';
import { LabReport } from '../../types';
import { SoilTestModal } from '../../components/tests/SoilTestModal';
import { WaterTestModal } from '../../components/tests/WaterTestModal';
import { LabReportModal } from '../../components/tests/LabReportModal';

export const TestsPage: React.FC = () => {
  const {
    soilTests,
    waterTests,
    labReports,
    deleteSoilTest,
    deleteWaterTest,
    deleteLabReport,
  } = useFarmData();

  const [tab, setTab] = useState<'soil' | 'water' | 'reports'>('soil');
  const [q, setQ] = useState('');
  const [isSoilModalOpen, setIsSoilModalOpen] = useState(false);
  const [isWaterModalOpen, setIsWaterModalOpen] = useState(false);
  const [isLabModalOpen, setIsLabModalOpen] = useState(false);

  const filteredSoil = soilTests.filter(
    t =>
      !q ||
      t.farm_name?.toLowerCase().includes(q.toLowerCase()) ||
      t.lab_name?.toLowerCase().includes(q.toLowerCase())
  );

  const filteredWater = waterTests.filter(
    t =>
      !q ||
      t.farm_name?.toLowerCase().includes(q.toLowerCase()) ||
      t.lab_name?.toLowerCase().includes(q.toLowerCase())
  );

  const filteredReports = labReports.filter(
    (r: LabReport) =>
      !q ||
      r.title?.toLowerCase().includes(q.toLowerCase()) ||
      r.farm_name?.toLowerCase().includes(q.toLowerCase()) ||
      r.lab_name?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
            <TestTube className="w-3.5 h-3.5 text-emerald-700" />
            <span>Soil & Water Diagnostics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Soil & Water Testing Records
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track laboratory pH, organic carbon (SOC), salinity, and irrigation water safety indicators.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tab === 'soil' && (
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsSoilModalOpen(true)}
            >
              Add Soil Test
            </Button>
          )}
          {tab === 'water' && (
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsWaterModalOpen(true)}
            >
              Add Water Test
            </Button>
          )}
          {tab === 'reports' && (
            <Button
              variant="primary"
              size="md"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => setIsLabModalOpen(true)}
            >
              Add Lab Document
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-2xl bg-white border border-slate-200/80 p-1 gap-1">
        <button
          onClick={() => setTab('soil')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            tab === 'soil' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Soil Tests ({soilTests.length})
        </button>
        <button
          onClick={() => setTab('water')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            tab === 'water' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Water Quality ({waterTests.length})
        </button>
        <button
          onClick={() => setTab('reports')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
            tab === 'reports' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          Lab Documents ({labReports.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by farm or laboratory name..."
          value={q}
          onChange={e => setQ(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-emerald-600 focus:outline-none"
        />
      </div>

      {/* Soil Tests */}
      {tab === 'soil' && (
        <>
          {filteredSoil.length === 0 ? (
            <EmptyState
              icon={<TestTube className="w-8 h-8" />}
              title="No soil tests recorded yet"
              description="Record Soil Health Card parameters (pH, organic carbon %, N-P-K) to guide your soil fertility plan."
              actionText="Record First Soil Test"
              onAction={() => setIsSoilModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSoil.map(t => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {t.farm_name || 'Farm'}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-1">Soil Analysis</h3>
                      <p className="text-xs text-slate-400">{t.test_date}</p>
                    </div>
                    <button
                      onClick={() => deleteSoilTest(t.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      title="Delete test record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {t.lab_name && (
                    <p className="text-[11px] text-slate-500 mb-3">
                      <strong>Lab: </strong>{t.lab_name}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">SOIL pH</span>
                      <span className="font-bold text-slate-800">
                        {t.ph !== undefined ? t.ph.toFixed(1) : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">ORGANIC CARBON</span>
                      <span className="font-bold text-emerald-700">
                        {t.organic_carbon !== undefined ? `${t.organic_carbon}%` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">AVAILABLE N</span>
                      <span className="font-bold text-slate-800">
                        {t.nitrogen ? `${t.nitrogen} kg/ha` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">AVAILABLE P</span>
                      <span className="font-bold text-slate-800">
                        {t.phosphorus ? `${t.phosphorus} kg/ha` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">AVAILABLE K</span>
                      <span className="font-bold text-slate-800">
                        {t.potassium ? `${t.potassium} kg/ha` : '—'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">EC (dS/m)</span>
                      <span className="font-bold text-slate-800">
                        {t.electrical_conductivity ? `${t.electrical_conductivity}` : '—'}
                      </span>
                    </div>
                  </div>

                  {t.notes && (
                    <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100">
                      <strong>Notes: </strong>{t.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Water Tests */}
      {tab === 'water' && (
        <>
          {filteredWater.length === 0 ? (
            <EmptyState
              icon={<Droplets className="w-8 h-8" />}
              title="No water quality tests recorded yet"
              description="Record water testing reports for borewells, ponds, or open irrigation channels."
              actionText="Record Water Test"
              onAction={() => setIsWaterModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWater.map(w => (
                <div
                  key={w.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {w.farm_name || 'Farm'}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-1">Water Quality Analysis</h3>
                      <p className="text-xs text-slate-400">{w.test_date}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant={
                          w.suitability === 'excellent' || w.suitability === 'good'
                            ? 'emerald'
                            : w.suitability === 'marginal'
                            ? 'amber'
                            : 'rose'
                        }
                      >
                        {w.suitability || 'Good'}
                      </Badge>
                      <button
                        onClick={() => deleteWaterTest(w.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {w.lab_name && (
                    <p className="text-[11px] text-slate-500 mb-3">
                      <strong>Testing Agency: </strong>{w.lab_name}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">WATER pH</span>
                      <span className="font-bold text-slate-800">{w.ph ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">EC (dS/m)</span>
                      <span className="font-bold text-slate-800">{w.ec ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">HARDNESS (mg/L)</span>
                      <span className="font-bold text-slate-800">{w.hardness ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">ALKALINITY</span>
                      <span className="font-bold text-slate-800">{w.alkalinity ?? '—'}</span>
                    </div>
                  </div>

                  {w.notes && (
                    <p className="text-xs text-slate-600 mt-3 pt-2 border-t border-slate-100">
                      <strong>Notes: </strong>{w.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Lab Reports */}
      {tab === 'reports' && (
        <>
          <div className="p-3 bg-slate-100/70 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              <strong>Farmer Internal Record Only:</strong> Documents stored here serve your farm's internal records. The platform does not certify or validate third-party lab results.
            </span>
          </div>

          {filteredReports.length === 0 ? (
            <EmptyState
              icon={<FileText className="w-8 h-8" />}
              title="No laboratory documents archived"
              description="Archive laboratory test documents, residue analyses, and inspection reports for your farm records."
              actionText="Add Lab Document"
              onAction={() => setIsLabModalOpen(true)}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReports.map((r: LabReport) => (
                <div
                  key={r.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800">
                      {r.report_type?.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => deleteLabReport(r.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-1">{r.title}</h3>
                  {r.lab_name && (
                    <p className="text-xs text-slate-600 mt-1">
                      <strong>Testing Agency: </strong>{r.lab_name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <SoilTestModal isOpen={isSoilModalOpen} onClose={() => setIsSoilModalOpen(false)} />
      <WaterTestModal isOpen={isWaterModalOpen} onClose={() => setIsWaterModalOpen(false)} />
      <LabReportModal isOpen={isLabModalOpen} onClose={() => setIsLabModalOpen(false)} />
    </div>
  );
};

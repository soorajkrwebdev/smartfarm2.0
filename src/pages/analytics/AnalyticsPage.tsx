import React from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import {
  BarChart3,
  TrendingUp,
  Leaf,
  Wheat,
  CircleDollarSign,
  Activity,
  Bug,
  FileCheck,
  Recycle,
  DollarSign,
} from 'lucide-react';
import { useFarmData } from '../../contexts/FarmContext';

export const AnalyticsPage: React.FC = () => {
  const {
    farms,
    crops,
    activities,
    soilTests,
    waterTests,
    farmWaste,
    compostBatches,
    pestObservations,
    ipmRecords,
    expenses,
    harvests,
    loading,
  } = useFarmData();

  // ---- Summary metrics (all from real Supabase data) ----
  const totalFarms = farms.length;

  // Normalise all areas to acres for display
  const totalFarmAcres = farms.reduce((sum, f) => {
    const factor = f.area_unit === 'hectares' ? 2.47105 : 1;
    return sum + (Number(f.area) || 0) * factor;
  }, 0);

  const organicFarmCount = farms.filter(
    f => f.farming_method === 'organic' || f.farming_method === 'natural'
  ).length;
  const organicPercent = totalFarms > 0
    ? Math.round((organicFarmCount / totalFarms) * 100)
    : 0;

  const totalCropsCount = crops.length;
  const activeCropsCount = crops.filter(c => c.status === 'active').length;
  const totalCropAcres = crops.reduce((sum, c) => {
    const factor = c.area_unit === 'hectares' ? 2.47105 : 1;
    return sum + (Number(c.area) || 0) * factor;
  }, 0);

  const totalActivitiesCount = activities.length;
  const organicActivitiesCount = activities.filter(
    a =>
      a.activity_type === 'Organic manure' ||
      a.activity_type === 'Biofertilizer application' ||
      a.activity_type === 'Mulching'
  ).length;

  const pestObservationsCount = pestObservations.length;
  const ipmActionsCount = ipmRecords.length;

  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalHarvestRevenue = harvests.reduce(
    (sum, h) => sum + (Number(h.quantity) || 0) * (Number(h.sale_price) || 0),
    0
  );

  const totalWasteRecycled = farmWaste
    .filter(w => w.status === 'composted' || w.status === 'applied')
    .reduce((sum, w) => sum + (Number(w.quantity) || 0), 0);

  const totalCompostProduced = compostBatches
    .filter(b => b.status === 'finished' || b.status === 'used')
    .reduce((sum, b) => sum + (Number(b.finished_quantity) || 0), 0);

  const totalSoilTests = soilTests.length;
  const totalWaterTests = waterTests.length;

  // ---- Expense breakdown by category ----
  const expenseByCategory: Record<string, number> = {};
  expenses.forEach(e => {
    const cat = e.category ?? 'other';
    expenseByCategory[cat] = (expenseByCategory[cat] ?? 0) + Number(e.amount);
  });
  const expenseEntries = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  const maxExpense = Math.max(...Object.values(expenseByCategory), 1);

  // ---- Activity breakdown by type ----
  const activityByType: Record<string, number> = {};
  activities.forEach(a => {
    const t = a.activity_type ?? 'other';
    activityByType[t] = (activityByType[t] ?? 0) + 1;
  });
  const activityEntries = Object.entries(activityByType).sort((a, b) => b[1] - a[1]);
  const maxActivity = Math.max(...Object.values(activityByType), 1);

  // ---- Crop area + harvest breakdown ----
  const cropMap: Record<string, { area: number; production: number }> = {};
  crops.forEach(c => {
    const factor = c.area_unit === 'hectares' ? 2.47105 : 1;
    const key = c.crop_name;
    if (!cropMap[key]) cropMap[key] = { area: 0, production: 0 };
    cropMap[key].area += (Number(c.area) || 0) * factor;
  });
  harvests.forEach(h => {
    const crop = crops.find(c => c.id === h.crop_id);
    const key = crop ? crop.crop_name : 'Harvested Crop';
    if (!cropMap[key]) cropMap[key] = { area: 0, production: 0 };
    cropMap[key].production += Number(h.quantity) || 0;
  });
  const cropBreakdown = Object.entries(cropMap);
  const maxCropArea = Math.max(...cropBreakdown.map(e => e[1].area), 1);

  const hasAnyData =
    totalFarms > 0 || totalCropsCount > 0 || totalActivitiesCount > 0 ||
    totalExpenses > 0 || totalSoilTests > 0;

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Calculating farm analytics from database...</p>
      </div>
    );
  }

  if (!hasAnyData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Farm Analytics</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Live metrics calculated from your farm records
            </p>
          </div>
          <Badge variant="emerald" size="sm">Live Database Data</Badge>
        </div>
        <EmptyState
          icon={<BarChart3 className="w-12 h-12 text-slate-400" />}
          title="No farm records yet"
          description="Analytics are computed strictly from your farm records, crops, activities, expenses, and tests. Add your first farm to see real charts and indicators."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Farm Analytics & Intelligence</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real data from your farms, crops, activities, inputs, tests, and harvests
          </p>
        </div>
        <Badge variant="emerald" size="sm">Supabase Source of Truth</Badge>
      </div>

      {/* KPI top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Farm Area</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-800">
            {totalFarmAcres.toFixed(1)}{' '}
            <span className="text-base font-normal text-slate-500">acres</span>
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Across {totalFarms} farm(s) · {organicPercent}% organic method
          </p>
        </div>

        <div className="bg-white rounded-2xl border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Active Crop Cycles</span>
            <Wheat className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-slate-800">{activeCropsCount}</p>
          <p className="text-xs text-slate-400 mt-1">
            {totalCropAcres.toFixed(1)} acres planted · {totalCropsCount} total
          </p>
        </div>

        <div className="bg-white rounded-2xl border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Recorded Expenses</span>
            <CircleDollarSign className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-3xl font-bold text-slate-800">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {expenses.length} expense entr{expenses.length === 1 ? 'y' : 'ies'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Harvest Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-bold text-slate-800">
            ₹{totalHarvestRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            From {harvests.length} recorded harvest(s)
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity distribution */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800">Field Activity Distribution</h3>
              <p className="text-xs text-slate-400">Categorised from logged crop activities</p>
            </div>
            <Activity className="w-4 h-4 text-emerald-600" />
          </div>
          {activityEntries.length > 0 ? (
            <div className="space-y-3">
              {activityEntries.map(([type, count]) => {
                const pct = ((count / totalActivitiesCount) * 100).toFixed(0);
                const w = (count / maxActivity) * 100;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700">{type}</span>
                      <span className="text-xs font-semibold text-slate-600">{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${w}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-6 text-center">No field activities recorded yet.</p>
          )}
          <div className="mt-4 pt-3 border-t flex justify-between text-xs text-slate-500">
            <span>Total</span>
            <span className="font-bold text-slate-800">{totalActivitiesCount}</span>
          </div>
        </div>

        {/* Expense breakdown */}
        <div className="bg-white rounded-2xl border p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-800">Expense Breakdown</h3>
              <p className="text-xs text-slate-400">Operational spend by category</p>
            </div>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          {expenseEntries.length > 0 ? (
            <div className="space-y-3">
              {expenseEntries.map(([category, amount]) => {
                const pct = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(0) : '0';
                const w = (amount / maxExpense) * 100;
                return (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 capitalize">{category}</span>
                      <span className="text-xs font-semibold text-slate-600">
                        ₹{amount.toLocaleString('en-IN')} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full w-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full transition-all" style={{ width: `${w}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-6 text-center">No farm expenses recorded yet.</p>
          )}
          <div className="mt-4 pt-3 border-t flex justify-between text-xs text-slate-500">
            <span>Total Expenditure</span>
            <span className="font-bold text-slate-800">₹{totalExpenses.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Crops acreage + harvest output */}
      <div className="bg-white rounded-2xl border p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800">Crops — Acreage & Harvest Output</h3>
            <p className="text-xs text-slate-400">From registered crops and harvest logs</p>
          </div>
          <Wheat className="w-4 h-4 text-emerald-600" />
        </div>
        {cropBreakdown.length > 0 ? (
          <div className="space-y-3">
            {cropBreakdown.map(([cropName, data]) => {
              const w = (data.area / maxCropArea) * 100;
              return (
                <div key={cropName} className="flex items-center gap-4 text-xs">
                  <span className="font-medium text-slate-700 w-36 truncate">{cropName}</span>
                  <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full flex items-center px-2 text-[10px] text-white font-medium transition-all"
                      style={{ width: `${Math.max(w, 8)}%` }}
                    >
                      {data.area > 0 ? `${data.area.toFixed(1)} ac` : '—'}
                    </div>
                  </div>
                  <div className="w-32 text-right">
                    <span className="font-semibold text-slate-800">
                      {data.production > 0 ? `${data.production.toLocaleString()} kg` : 'Pending'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Harvested</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic py-4 text-center">No crops registered yet.</p>
        )}
      </div>

      {/* Sustainability indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-900 rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="w-4 h-4 text-emerald-300" />
            <span className="text-xs text-emerald-200">Organic Practices</span>
          </div>
          <p className="text-2xl font-bold">{organicActivitiesCount}</p>
          <p className="text-xs text-emerald-200/70 mt-1">Manure, bio-inputs & mulch logs</p>
        </div>

        <div className="bg-blue-900 rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Bug className="w-4 h-4 text-blue-300" />
            <span className="text-xs text-blue-200">IPM & Pest Logs</span>
          </div>
          <p className="text-2xl font-bold">
            {ipmActionsCount}{' '}
            <span className="text-sm font-normal">/ {pestObservationsCount} obs</span>
          </p>
          <p className="text-xs text-blue-200/70 mt-1">Integrated pest interventions</p>
        </div>

        <div className="bg-amber-900 rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Recycle className="w-4 h-4 text-amber-300" />
            <span className="text-xs text-amber-200">Waste Recycled</span>
          </div>
          <p className="text-2xl font-bold">
            {totalWasteRecycled}{' '}
            <span className="text-sm font-normal">kg</span>
          </p>
          <p className="text-xs text-amber-200/70 mt-1">
            Compost produced: {totalCompostProduced} kg
          </p>
        </div>

        <div className="bg-teal-900 rounded-2xl p-4 text-white shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="w-4 h-4 text-teal-300" />
            <span className="text-xs text-teal-200">Soil & Water Tests</span>
          </div>
          <p className="text-2xl font-bold">
            {totalSoilTests + totalWaterTests}{' '}
            <span className="text-sm font-normal">tests</span>
          </p>
          <p className="text-xs text-teal-200/70 mt-1">
            {totalSoilTests} Soil · {totalWaterTests} Water
          </p>
        </div>
      </div>

      {/* Sustainability tracking summary */}
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
          <div>
            <h3 className="font-bold text-base text-slate-100">Farm Sustainability Indicators</h3>
            <p className="text-xs text-slate-400 mt-1">
              Internal farm progress tracking based on logged agricultural practices
            </p>
          </div>
          <Badge variant="emerald" size="sm">Self-Tracked Indicators</Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div className="text-xl font-bold text-emerald-400">{organicPercent}%</div>
            <div className="text-xs text-slate-400 mt-1">Organic Farms</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div className="text-xl font-bold text-emerald-400">{totalSoilTests}</div>
            <div className="text-xs text-slate-400 mt-1">Soil Tests Logged</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div className="text-xl font-bold text-emerald-400">{totalCompostProduced} kg</div>
            <div className="text-xs text-slate-400 mt-1">Compost Produced</div>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
            <div className="text-xl font-bold text-emerald-400">{ipmActionsCount}</div>
            <div className="text-xs text-slate-400 mt-1">IPM Decisions</div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span>Source: Farm records entered by farmer in SmartFarm 2.0.</span>
          <span className="text-emerald-400 font-medium">Active Data-Driven Monitoring</span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-900 text-sm">Sustainability Tracking Disclaimer</h4>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              These indicators reflect internal farm tracking entered by the farmer. They do not constitute official organic certification or government NPOP validation. For accredited third-party organic certification, consult with recognised APEDA/NPOP certification bodies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

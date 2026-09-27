import React from 'react';
import { useFarmData } from '../../contexts/FarmContext';
import {
  ShieldCheck,
  Leaf,
  Recycle,
  Bug,
  TestTube,
  TrendingUp,
  Package,
  Info,
  Droplets,
  ClipboardList,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Indicator card — typed statically so Tailwind includes every class used
// ─────────────────────────────────────────────────────────────────────────────
interface IndicatorCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;   // full static class string, e.g. "bg-emerald-100 text-emerald-700"
  methodology: string;
}

const IndicatorCard: React.FC<IndicatorCardProps> = ({
  label, value, sub, icon, iconBg, methodology,
}) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:shadow-sm transition-shadow">
    <div className="flex items-start gap-3 mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block leading-none mb-1">
          {label}
        </span>
        <p className="text-2xl font-extrabold text-slate-900 leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
    <p className="text-[10px] text-slate-400 leading-relaxed border-t border-slate-100 pt-2">
      <span className="font-semibold text-slate-500">How calculated: </span>{methodology}
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Horizontal bar (percentage or absolute)
// ─────────────────────────────────────────────────────────────────────────────
const Bar: React.FC<{
  label: string;
  value: number;
  max: number;
  displayValue: string;
  barClass: string;
}> = ({ label, value, max, displayValue, barClass }) => {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-700">{label}</span>
        <span className="text-xs font-semibold text-slate-600">{displayValue}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export const SustainabilityPage: React.FC = () => {
  const {
    farms,
    activities,
    inputs,
    ipmRecords,
    pesticideApplications,
    soilTests,
    waterTests,
    farmWaste,
    compostBatches,
    pestObservations,
    loading,
  } = useFarmData();

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Loading sustainability data…</p>
      </div>
    );
  }

  // ── Compute every indicator from real database records ──────────────────

  // 1. Organic practices logged
  const ORGANIC_ACTIVITY_TYPES = new Set([
    'Organic manure',
    'Biofertilizer application',
    'Mulching',
    'Weeding',
  ]);
  const organicActivities = activities.filter(a => ORGANIC_ACTIVITY_TYPES.has(a.activity_type));

  // 2. Organic input usage share
  const ORGANIC_INPUT_CATEGORIES = new Set([
    'Organic manure',
    'Biofertilizers',
    'Biological inputs',
    'Botanical inputs',
  ]);
  const organicInputCount = inputs.filter(i => ORGANIC_INPUT_CATEGORIES.has(i.category)).length;
  const totalInputCount = inputs.length;
  const organicInputPct = totalInputCount > 0
    ? Math.round((organicInputCount / totalInputCount) * 100)
    : null;

  // 3. IPM decisions — and breakdown: chemical vs non-chemical
  const totalIPM = ipmRecords.length;
  const nonChemicalIPM = ipmRecords.filter(
    r => r.advisory_level !== 'chemical',
  ).length;
  const chemicalIPM = totalIPM - nonChemicalIPM;
  const nonChemicalPct = totalIPM > 0
    ? Math.round((nonChemicalIPM / totalIPM) * 100)
    : null;

  // 4. Pesticide applications (farmer records)
  const totalPesticideApps = pesticideApplications.length;

  // 5. Pest observations total and resolved (treated / controlled)
  const totalPestObs = pestObservations.length;

  // 6. Soil & water tests
  const totalSoilTests = soilTests.length;
  const totalWaterTests = waterTests.length;

  // 7. Waste metrics
  const wasteRecycledKg = farmWaste
    .filter(w => w.status === 'composted' || w.status === 'applied')
    .reduce((s, w) => s + (Number(w.quantity) || 0), 0);
  const totalWasteKg = farmWaste.reduce((s, w) => s + (Number(w.quantity) || 0), 0);
  const wasteRecycledPct = totalWasteKg > 0
    ? Math.round((wasteRecycledKg / totalWasteKg) * 100)
    : null;

  // 8. Compost produced
  const compostProducedKg = compostBatches
    .filter(c => c.status === 'finished' || c.status === 'used')
    .reduce((s, c) => s + (Number(c.finished_quantity) || 0), 0);

  // 9. Farm method overview
  const organicFarms = farms.filter(
    f => f.farming_method === 'organic' || f.farming_method === 'natural',
  ).length;
  const organicFarmPct = farms.length > 0
    ? Math.round((organicFarms / farms.length) * 100)
    : null;

  // 10. Record completeness — has at least one of each key module
  const recordModules = [
    { label: 'Farms',                 done: farms.length > 0 },
    { label: 'Crops',                 done: activities.length > 0 },
    { label: 'Activities',            done: activities.length > 0 },
    { label: 'Inputs',                done: inputs.length > 0 },
    { label: 'Pest Observations',     done: totalPestObs > 0 },
    { label: 'IPM Records',           done: totalIPM > 0 },
    { label: 'Soil Tests',            done: totalSoilTests > 0 },
    { label: 'Water Tests',           done: totalWaterTests > 0 },
    { label: 'Waste / Compost',       done: farmWaste.length > 0 },
  ];
  const completedModules = recordModules.filter(m => m.done).length;
  const completenessScore = Math.round((completedModules / recordModules.length) * 100);

  const hasAnyData = farms.length > 0 || activities.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Farm Sustainability Tracking
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Farm Sustainability Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Indicators calculated from your actual farm records. This is an internal tracking
            tool — not official certification or a sustainability score.
          </p>
        </div>
      </div>

      {/* Certification notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-amber-800">
          <strong className="text-amber-900">Not a certification system.</strong>{' '}
          Indicators here reflect data entered by the farmer. They do not constitute
          organic certification, government validation, or NPOP compliance. For official
          certification consult an APEDA-accredited certification body.
        </p>
      </div>

      {!hasAnyData ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-700">No records yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Add farms, crops, activities, inputs, and tests to see sustainability indicators here.
          </p>
        </div>
      ) : (
        <>
          {/* ── Indicator grid ────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <IndicatorCard
              label="Organic Practice Logs"
              value={organicActivities.length}
              sub="Organic manure, biofertiliser, mulching, weeding"
              icon={<Leaf className="w-5 h-5" />}
              iconBg="bg-emerald-100 text-emerald-700"
              methodology="Count of crop activity records where activity_type is Organic manure, Biofertilizer application, Mulching, or Weeding."
            />

            <IndicatorCard
              label="Organic Input Share"
              value={organicInputPct !== null ? `${organicInputPct}%` : '—'}
              sub={
                totalInputCount > 0
                  ? `${organicInputCount} of ${totalInputCount} purchases`
                  : 'No inputs recorded yet'
              }
              icon={<Package className="w-5 h-5" />}
              iconBg="bg-blue-100 text-blue-700"
              methodology="Organic manure + biofertiliser + biological + botanical input records ÷ total input records × 100."
            />

            <IndicatorCard
              label="IPM Decisions Logged"
              value={totalIPM}
              sub={
                totalIPM > 0
                  ? `${nonChemicalIPM} non-chemical · ${chemicalIPM} chemical`
                  : 'No IPM records yet'
              }
              icon={<Bug className="w-5 h-5" />}
              iconBg="bg-indigo-100 text-indigo-700"
              methodology="Count of IPM records (ipm_records table). Chemical = advisory_level 'chemical'. Non-chemical = all other levels."
            />

            <IndicatorCard
              label="Pesticide Applications"
              value={totalPesticideApps}
              sub="Farmer application records only"
              icon={<ClipboardList className="w-5 h-5" />}
              iconBg="bg-rose-100 text-rose-700"
              methodology="Count of rows in pesticide_applications table. These are records the farmer logged — not a compliance measure."
            />

            <IndicatorCard
              label="Soil Tests Conducted"
              value={totalSoilTests}
              sub={`+ ${totalWaterTests} water quality tests`}
              icon={<TestTube className="w-5 h-5" />}
              iconBg="bg-purple-100 text-purple-700"
              methodology="Count of soil_tests + water_tests records."
            />

            <IndicatorCard
              label="Compost Produced"
              value={`${compostProducedKg} kg`}
              sub={
                farmWaste.length > 0
                  ? `From ${compostBatches.filter(c => c.status === 'finished' || c.status === 'used').length} finished batch(es)`
                  : 'No compost batches completed yet'
              }
              icon={<Recycle className="w-5 h-5" />}
              iconBg="bg-amber-100 text-amber-700"
              methodology="Sum of finished_quantity from compost_batches where status = 'finished' or 'used'."
            />

            <IndicatorCard
              label="Waste Recycled / Composted"
              value={`${wasteRecycledKg} kg`}
              sub={
                wasteRecycledPct !== null
                  ? `${wasteRecycledPct}% of total waste logged`
                  : 'No waste records yet'
              }
              icon={<Leaf className="w-5 h-5" />}
              iconBg="bg-teal-100 text-teal-700"
              methodology="Sum of quantity from farm_waste where status = 'composted' or 'applied'."
            />

            <IndicatorCard
              label="Pest Observations"
              value={totalPestObs}
              sub={`${ipmRecords.length} IPM actions recorded in response`}
              icon={<Bug className="w-5 h-5" />}
              iconBg="bg-orange-100 text-orange-700"
              methodology="Count of pest_observations records. Paired with IPM response count as a monitoring coverage ratio."
            />

            <IndicatorCard
              label="Organic Farms"
              value={organicFarmPct !== null ? `${organicFarmPct}%` : '—'}
              sub={`${organicFarms} of ${farms.length} registered farm(s)`}
              icon={<TrendingUp className="w-5 h-5" />}
              iconBg="bg-green-100 text-green-700"
              methodology="Farms with farming_method = 'organic' or 'natural' ÷ total farms × 100."
            />
          </div>

          {/* ── IPM breakdown bar chart ───────────────────────────────────── */}
          {totalIPM > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">IPM Intervention Breakdown</h3>
                  <p className="text-xs text-slate-400">
                    How pest management decisions were classified
                  </p>
                </div>
                <Bug className="w-4 h-4 text-indigo-600" />
              </div>

              <div className="space-y-3">
                {[
                  'monitoring', 'prevention', 'cultural',
                  'mechanical', 'biological', 'botanical', 'chemical',
                ].map(level => {
                  const count = ipmRecords.filter(r => r.advisory_level === level).length;
                  if (count === 0) return null;
                  const barClass =
                    level === 'chemical'
                      ? 'bg-rose-500'
                      : level === 'biological' || level === 'botanical'
                      ? 'bg-emerald-500'
                      : level === 'monitoring' || level === 'prevention'
                      ? 'bg-blue-500'
                      : 'bg-amber-500';
                  return (
                    <Bar
                      key={level}
                      label={level.charAt(0).toUpperCase() + level.slice(1)}
                      value={count}
                      max={totalIPM}
                      displayValue={`${count} (${Math.round((count / totalIPM) * 100)}%)`}
                      barClass={barClass}
                    />
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Total IPM decisions: <strong className="text-slate-800">{totalIPM}</strong></span>
                {nonChemicalPct !== null && (
                  <span className="font-semibold text-emerald-700">
                    {nonChemicalPct}% non-chemical
                  </span>
                )}
              </div>

              <p className="text-[10px] text-slate-400 mt-2">
                Classification is based on the advisory_level field in each IPM record, as entered
                by the farmer. "Non-chemical" = monitoring, prevention, cultural, mechanical,
                biological, botanical.
              </p>
            </div>
          )}

          {/* ── Waste recycling bar ───────────────────────────────────────── */}
          {farmWaste.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Waste Stream Status</h3>
                  <p className="text-xs text-slate-400">
                    How logged biomass and farm waste has been handled
                  </p>
                </div>
                <Recycle className="w-4 h-4 text-amber-600" />
              </div>

              <div className="space-y-3">
                {(['collected', 'processing', 'composted', 'applied', 'disposed'] as const).map(status => {
                  const entries = farmWaste.filter(w => w.status === status);
                  if (entries.length === 0) return null;
                  const kg = entries.reduce((s, w) => s + (Number(w.quantity) || 0), 0);
                  const barClass =
                    status === 'composted' || status === 'applied'
                      ? 'bg-emerald-500'
                      : status === 'processing'
                      ? 'bg-blue-400'
                      : status === 'disposed'
                      ? 'bg-rose-400'
                      : 'bg-slate-300';
                  return (
                    <Bar
                      key={status}
                      label={status.charAt(0).toUpperCase() + status.slice(1)}
                      value={kg}
                      max={totalWasteKg}
                      displayValue={`${kg} kg (${entries.length} log${entries.length > 1 ? 's' : ''})`}
                      barClass={barClass}
                    />
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                Total waste logged: <strong className="text-slate-800">{totalWasteKg} kg</strong>{' '}
                · Recycled (composted + applied):{' '}
                <strong className="text-emerald-700">{wasteRecycledKg} kg</strong>
              </div>
            </div>
          )}

          {/* ── Record completeness ───────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Farm Record Completeness</h3>
                <p className="text-xs text-slate-400">
                  Which key management modules have at least one record
                </p>
              </div>
              <span className="text-lg font-extrabold text-emerald-700">{completenessScore}%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {recordModules.map(m => (
                <div
                  key={m.label}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border ${
                    m.done
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      m.done ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                  {m.label}
                </div>
              ))}
            </div>

            <p className="text-[10px] text-slate-400 mt-3 border-t border-slate-100 pt-2">
              Completeness = modules with at least 1 record ÷ 9 key modules.
              This is a record-keeping indicator, not a compliance measure.
            </p>
          </div>

          {/* ── Soil & water context ──────────────────────────────────────── */}
          {(totalSoilTests > 0 || totalWaterTests > 0) && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Droplets className="w-4 h-4 text-blue-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Soil & Water Monitoring</h3>
                  <p className="text-xs text-slate-400">Test records logged</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                  <p className="text-2xl font-extrabold text-slate-900">{totalSoilTests}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Soil tests</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                  <p className="text-2xl font-extrabold text-slate-900">{totalWaterTests}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Water tests</p>
                </div>
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-3">
                  <p className="text-2xl font-extrabold text-slate-900">{totalSoilTests + totalWaterTests}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Total tests</p>
                </div>
                <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-3">
                  <p className="text-2xl font-extrabold text-emerald-700">
                    {totalSoilTests > 0 ? '✓' : '—'}
                  </p>
                  <p className="text-[10px] text-emerald-600 mt-0.5">Soil data present</p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

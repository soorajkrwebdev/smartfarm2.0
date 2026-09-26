import React, { useState, useMemo } from 'react';
import { useFarmData } from '../contexts/FarmContext';
import { OrganicInputCard } from '../components/organic/OrganicInputCard';
import { OrganicPracticeCard } from '../components/organic/OrganicPracticeCard';
import { ConversionRoadmap } from '../components/organic/ConversionRoadmap';
import { UnderstandOrganicSection } from '../components/organic/UnderstandOrganicSection';
import { OrganicCertificationSection } from '../components/organic/OrganicCertificationSection';
import { PracticeComparisonSection } from '../components/organic/PracticeComparisonSection';
import {
  ORGANIC_INPUTS,
  CROP_INPUT_LINKS,
  ORGANIC_PRACTICES,
} from '../lib/organicKnowledge';
import {
  OrganicInputViewItem,
  OrganicInput,
  CropOrganicInput,
  OrganicVerificationStatus,
} from '../types';
import {
  Sparkles,
  BookOpen,
  Layers,
  Search,
  Sprout,
  ShieldCheck,
  BookMarked,
  BarChart3,
  X,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — merge Supabase rows with curated knowledge
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert a raw Supabase organic_inputs row into the OrganicInputViewItem shape.
 * Supabase rows use the legacy OrganicInput type — map carefully.
 */
function supabaseInputToViewItem(
  row: OrganicInput,
  links: CropOrganicInput[]
): OrganicInputViewItem {
  const relatedLinks = links
    .filter(l => l.organic_input_id === row.id)
    .map(l => ({
      id: l.id,
      organic_input_id: l.organic_input_id,
      crop_name: l.crop_name,
      stage: l.recommended_stage,
      guidance: l.application_notes ?? l.dosage_guide,
      source_name: l.source_reference ?? row.source_name,
      verification_status:
        (l.verification_status as OrganicVerificationStatus | undefined) ??
        ('General Agricultural Information' as OrganicVerificationStatus),
    }));

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    summary: row.description,
    purpose: row.purpose,
    benefits: row.benefits ?? [],
    mode_of_action: undefined,
    suitable_crops: row.suitable_crops ?? [],
    application_guidance: row.application_information,
    precautions: row.precautions,
    classification:
      (row.npop_relevance_class as OrganicInputViewItem['classification']) ?? 'organic-input',
    classification_note: row.organic_relevance,
    source_name: row.source_name,
    source_kind: undefined,
    source_url: row.source_url,
    verification_status: row.verification_status,
    last_verified: row.last_verified_date,
    limitation: row.source_limitation,
    related_practice_ids: [],
    provenance: 'database',
    matched_crops: [],
    crop_guidance: relatedLinks,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page component
// ─────────────────────────────────────────────────────────────────────────────

type TabId = 'understand' | 'library' | 'practices' | 'compare' | 'certification';

interface TabDef {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

const TABS: TabDef[] = [
  { id: 'understand',    label: 'Understand Organic Farming', shortLabel: 'Understand',   icon: <BookMarked className="w-4 h-4" /> },
  { id: 'library',       label: 'Input Knowledge Library',    shortLabel: 'Input Library', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'practices',     label: 'Preparation Protocols',      shortLabel: 'Protocols',     icon: <Layers className="w-4 h-4" /> },
  { id: 'compare',       label: 'Compare Approaches',         shortLabel: 'Compare',       icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'certification', label: 'Certification Awareness',    shortLabel: 'Certification', icon: <ShieldCheck className="w-4 h-4" /> },
];

const CATEGORY_OPTIONS = [
  'Organic Manures',
  'Biofertilizers',
  'Biological / Biocontrol Inputs',
  'Botanical Inputs',
  'Soil Amendments',
] as const;

// Crops for the selector — covers the major crops in the curated dataset
const KNOWN_CROPS = [
  'Arecanut',
  'Black Pepper',
  'Coconut',
  'Paddy',
  'Banana',
  'Ginger',
  'Turmeric',
  'Cardamom',
  'Coffee',
  'Vegetables',
  'Sugarcane',
  'Pulses',
  'Millets',
] as const;

export const OrganicPage: React.FC = () => {
  const { organicInputs: supabaseInputs, cropOrganicInputs: supabaseCoi, crops } = useFarmData();

  const [activeTab, setActiveTab] = useState<TabId>('library');

  // Library filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [matchMyFarmCrops, setMatchMyFarmCrops] = useState(false);

  // Unique crop names the farmer actually grows
  const farmCropNames = useMemo(
    () => Array.from(new Set(crops.map(c => c.crop_name))),
    [crops]
  );

  // ── Merge sources ──────────────────────────────────────────────────────────
  // Supabase rows take priority (dedup by name). Curated knowledge fills gaps.
  const mergedInputs = useMemo((): OrganicInputViewItem[] => {
    const dbItems = supabaseInputs.map(row =>
      supabaseInputToViewItem(row, supabaseCoi)
    );
    const dbNames = new Set(dbItems.map(i => i.name.toLowerCase()));

    // Curated records not already in the database
    const curatedFallback = ORGANIC_INPUTS.filter(
      ci => !dbNames.has(ci.name.toLowerCase())
    );

    // Attach crop_guidance from CROP_INPUT_LINKS to curated items
    const curatedWithLinks: OrganicInputViewItem[] = curatedFallback.map(ci => ({
      ...ci,
      crop_guidance: CROP_INPUT_LINKS.filter(l => l.organic_input_id === ci.id),
    }));

    return [...dbItems, ...curatedWithLinks];
  }, [supabaseInputs, supabaseCoi]);

  // ── Filter pipeline ────────────────────────────────────────────────────────
  const filteredLibrary = useMemo(() => {
    // Which crop names are "active" for filtering
    const activeCropFilter =
      selectedCrop
        ? [selectedCrop]
        : matchMyFarmCrops
        ? farmCropNames
        : [];

    return mergedInputs.filter(item => {
      // Category
      if (selectedCategory && item.category !== selectedCategory) return false;

      // Text search (name, purpose, suitable_crops)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesText =
          item.name.toLowerCase().includes(q) ||
          item.purpose.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.suitable_crops.some(c => c.toLowerCase().includes(q)) ||
          item.crop_guidance.some(cg => cg.crop_name.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      // Crop filter — use relationship table first, fall back to suitable_crops array
      if (activeCropFilter.length > 0) {
        const inRelationship = item.crop_guidance.some(cg =>
          activeCropFilter.some(
            af =>
              af.toLowerCase().includes(cg.crop_name.toLowerCase()) ||
              cg.crop_name.toLowerCase().includes(af.toLowerCase())
          )
        );
        const inSuitable = item.suitable_crops.some(sc =>
          activeCropFilter.some(
            af =>
              af.toLowerCase().includes(sc.toLowerCase()) ||
              sc.toLowerCase().includes(af.toLowerCase())
          )
        );
        if (!inRelationship && !inSuitable) return false;
      }

      return true;
    });
  }, [mergedInputs, selectedCategory, searchQuery, selectedCrop, matchMyFarmCrops, farmCropNames]);

  // Compute matched_crops for each filtered item given active user context
  const filteredWithMatches = useMemo((): OrganicInputViewItem[] => {
    const userNames = matchMyFarmCrops ? farmCropNames : selectedCrop ? [selectedCrop] : farmCropNames;
    return filteredLibrary.map(item => ({
      ...item,
      matched_crops: item.suitable_crops.filter(sc =>
        userNames.some(
          uc =>
            uc.toLowerCase().includes(sc.toLowerCase()) ||
            sc.toLowerCase().includes(uc.toLowerCase())
        )
      ),
    }));
  }, [filteredLibrary, farmCropNames, matchMyFarmCrops, selectedCrop]);

  const clearCropFilter = () => {
    setSelectedCrop('');
    setMatchMyFarmCrops(false);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Knowledge Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Organic Farming & Sustainable Agriculture
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Educational reference, verified input library, and decision-support resources grounded
            in ICAR, TNAU, APEDA, and IFOAM publications. Not an e-commerce catalogue or
            certification service.
          </p>
        </div>
      </div>

      {/* ── Tab navigation ───────────────────────────────────────────────── */}
      <div className="flex rounded-2xl bg-white border border-slate-200/80 p-1 gap-0.5 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-max flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Understand ──────────────────────────────────────────────── */}
      {activeTab === 'understand' && <UnderstandOrganicSection />}

      {/* ── Tab: Input Library ───────────────────────────────────────────── */}
      {activeTab === 'library' && (
        <div className="space-y-5">
          {/* Info banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-slate-900 block">
                  Non-Commercial Knowledge Directory
                </strong>
                <span className="text-slate-600">
                  Source-attributed reference library. Every entry carries its source, classification,
                  and an explicit statement of what the source does NOT prove. Not a shop or
                  certification service.
                </span>
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-200">
              {mergedInputs.length} inputs · {CROP_INPUT_LINKS.length} crop links
            </span>
          </div>

          {/* Filter toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Text search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, purpose, or crop…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Category */}
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="">All categories ({mergedInputs.length})</option>
                {CATEGORY_OPTIONS.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              {/* Crop selector */}
              <div className="flex gap-2">
                <select
                  value={selectedCrop}
                  onChange={e => { setSelectedCrop(e.target.value); setMatchMyFarmCrops(false); }}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
                >
                  <option value="">Filter by crop</option>
                  {KNOWN_CROPS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {(selectedCrop || matchMyFarmCrops) && (
                  <button
                    onClick={clearCropFilter}
                    className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Clear crop filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* My-farm-crops toggle */}
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={matchMyFarmCrops}
                onChange={e => { setMatchMyFarmCrops(e.target.checked); setSelectedCrop(''); }}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                {farmCropNames.length > 0
                  ? `Show inputs relevant to my crops: ${farmCropNames.join(', ')}`
                  : 'Show inputs for my registered crops (add crops on the Crops page first)'}
              </span>
            </label>

            {/* Active filter pills */}
            {(selectedCrop || matchMyFarmCrops || selectedCategory || searchQuery) && (
              <div className="flex flex-wrap gap-2 text-[11px]">
                {searchQuery && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                    Search: "{searchQuery}"
                  </span>
                )}
                {selectedCategory && (
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-medium">
                    {selectedCategory}
                  </span>
                )}
                {selectedCrop && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 font-medium">
                    Crop: {selectedCrop}
                  </span>
                )}
                {matchMyFarmCrops && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-medium">
                    My farm crops
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                  {filteredWithMatches.length} result{filteredWithMatches.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Input cards grid */}
          {filteredWithMatches.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No inputs match your filters</h3>
              <p className="text-xs text-slate-400 mt-1">
                Try clearing the crop or category filter, or search with different keywords.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredWithMatches.map(item => (
                <OrganicInputCard
                  key={item.id}
                  input={item}
                  userCropNames={farmCropNames.length > 0 ? farmCropNames : selectedCrop ? [selectedCrop] : []}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Practices / Protocols ───────────────────────────────────── */}
      {activeTab === 'practices' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs text-xs text-slate-600">
            <strong className="font-bold text-slate-800 block mb-1">
              Preparation & Execution Protocols — Source Attribution
            </strong>
            Each protocol below is attributed to a specific research institution. Specific
            quantities and application rates follow the cited source where available; where they
            are not directly verifiable from the source, they are described qualitatively.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ORGANIC_PRACTICES.map(practice => (
              <OrganicPracticeCard key={practice.id} practice={practice} />
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Compare Approaches ──────────────────────────────────────── */}
      {activeTab === 'compare' && <PracticeComparisonSection />}

      {/* ── Tab: Certification Awareness ─────────────────────────────────── */}
      {activeTab === 'certification' && (
        <div className="space-y-6">
          {/* Principles + Conversion Roadmap (existing component) */}
          <ConversionRoadmap />
          {/* Certification detail section (new) */}
          <OrganicCertificationSection />
        </div>
      )}
    </div>
  );
};

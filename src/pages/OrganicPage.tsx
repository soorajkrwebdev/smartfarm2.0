import React, { useState } from 'react';
import { useFarmData } from '../contexts/FarmContext';
import { OrganicInputCard } from '../components/organic/OrganicInputCard';
import { OrganicPracticeCard } from '../components/organic/OrganicPracticeCard';
import { ConversionRoadmap } from '../components/organic/ConversionRoadmap';
import { DemoStorage } from '../lib/demoStorage';
import { OrganicInputCategory } from '../types';
import {
  Leaf,
  BookOpen,
  Layers,
  Sparkles,
  Search,
  Filter,
  CheckCircle,
  Sprout,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const OrganicPage: React.FC = () => {
  const { organicInputs, crops } = useFarmData();
  const [activeTab, setActiveTab] = useState<'library' | 'practices' | 'awareness'>('library');

  // Library filters
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [matchMyCropsOnly, setMatchMyCropsOnly] = useState(false);

  const practices = DemoStorage.getOrganicPractices();

  // Extract unique crop names the farmer currently grows
  const userCropNames = Array.from(new Set(crops.map(c => c.crop_name)));

  // Filter organic inputs library
  const filteredLibrary = organicInputs.filter(item => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.suitable_crops.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesUserCrops = !matchMyCropsOnly || item.suitable_crops.some(sc =>
      userCropNames.some(uc => uc.toLowerCase().includes(sc.toLowerCase()) || sc.toLowerCase().includes(uc.toLowerCase()))
    );

    return matchesCategory && matchesSearch && matchesUserCrops;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Flagship Module</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Organic Agriculture & Verified Input Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Authoritative knowledge, practical on-farm protocols, and non-commercial directory grounded in verified research bodies (ICAR, APEDA, NCONF).
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex rounded-2xl bg-white p-1.5 border border-slate-200/80 shadow-2xs gap-1">
        <button
          onClick={() => setActiveTab('library')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'library'
              ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Organic Input Knowledge Library</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-700/50 text-white hidden sm:inline">
            {organicInputs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('practices')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'practices'
              ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Practical Preparation Protocols</span>
        </button>

        <button
          onClick={() => setActiveTab('awareness')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeTab === 'awareness'
              ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Principles & Conversion (C1-C3)</span>
        </button>
      </div>

      {/* TAB 1: KNOWLEDGE LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-6">
          {/* Informational Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <div>
                <strong className="font-bold block text-slate-900">Verified Non-Commercial Knowledge Directory</strong>
                <span>All formulations and application instructions are sourced directly from ICAR, TNAU, and NPOP research repositories. This is not an e-commerce catalog.</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-xl border border-emerald-200 shrink-0">
              100% Peer Verified
            </span>
          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search input name, purpose, or crop..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                <option value="">All Categories ({organicInputs.length})</option>
                <option value="Organic Manures">Organic Manures (FYM, Vermicompost, Compost)</option>
                <option value="Biofertilizers">Biofertilizers (Azospirillum, PSB)</option>
                <option value="Biological / Biocontrol Inputs">Biological / Biocontrol (Trichoderma)</option>
                <option value="Botanical Inputs">Botanical Inputs (Neem / NSKE)</option>
                <option value="Soil Amendments">Soil Amendments</option>
              </select>

              {/* Match My Crops Toggle */}
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={matchMyCropsOnly}
                  onChange={e => setMatchMyCropsOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Only Show Inputs for My Crops ({userCropNames.join(', ') || 'None'})</span>
                </span>
              </label>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLibrary.map(item => (
              <OrganicInputCard
                key={item.id}
                input={item}
                userCropNames={userCropNames}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRACTICAL PREPARATION PROTOCOLS */}
      {activeTab === 'practices' && (
        <div className="space-y-6">
          <div className="text-left max-w-2xl">
            <h2 className="text-lg font-bold text-slate-900 font-heading">
              Standardized Organic Preparation & Execution Guides
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Field-tested recipes and bio-enhancer formulation procedures developed by national organic research institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {practices.map(practice => (
              <OrganicPracticeCard
                key={practice.id}
                practice={practice}
              />
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AWARENESS, PRINCIPLES & CONVERSION ROADMAP */}
      {activeTab === 'awareness' && (
        <ConversionRoadmap />
      )}
    </div>
  );
};

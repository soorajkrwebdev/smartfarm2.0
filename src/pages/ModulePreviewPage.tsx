import React from 'react';
import { NavigationTab } from '../components/layout/Sidebar';
import { useFarmData } from '../contexts/FarmContext';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { Button } from '../components/common/Button';
import {
  CloudSun,
  Package,
  Leaf,
  Bug,
  TestTube,
  Recycle,
  Briefcase,
  TrendingUp,
  BarChart3,
  Bot,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface ModulePreviewPageProps {
  tab: NavigationTab;
  onGoToDashboard: () => void;
}

export const ModulePreviewPage: React.FC<ModulePreviewPageProps> = ({
  tab,
  onGoToDashboard,
}) => {
  const { selectedFarm } = useFarmData();

  const getModuleMeta = () => {
    switch (tab) {
      case 'weather':
        return {
          title: 'Hyperlocal Weather Intelligence',
          phase: 'Phase 1 Active (Expanded in Phase 5)',
          description: 'Live agricultural weather metrics powered by Open-Meteo, with humidity, wind velocity, precipitation probability, and agronomic spraying advisories.',
          icon: <CloudSun className="w-8 h-8 text-emerald-600" />,
          isLive: true,
        };
      case 'inputs':
        return {
          title: 'Agricultural Inputs Management',
          phase: 'Phase 2 Architecture',
          description: 'Track seed batches, organic manures, biofertilizers, botanical preparations, and biological inputs with cost attribution.',
          icon: <Package className="w-8 h-8 text-emerald-600" />,
        };
      case 'organic':
        return {
          title: 'Flagship: Organic Farming & Knowledge Library',
          phase: 'Phase 2 Architecture',
          description: 'Educational and practical guides on vermicomposting, farmyard manure, green manuring, biofertilizers, and non-commercial organic input directory.',
          icon: <Leaf className="w-8 h-8 text-emerald-600" />,
        };
      case 'pest-ipm':
        return {
          title: 'Flagship: Pest Monitoring & IPM Decision Support',
          phase: 'Phase 3 Architecture',
          description: 'Graduated Integrated Pest Management decision workflow: Cultural -> Mechanical -> Biological -> Botanical -> Chemical with safety intervals.',
          icon: <Bug className="w-8 h-8 text-emerald-600" />,
        };
      case 'tests':
        return {
          title: 'Soil & Water Testing Records',
          phase: 'Phase 4 Architecture',
          description: 'Log pH, nitrogen, phosphorus, potassium, organic carbon, and electrical conductivity (EC) lab test reports.',
          icon: <TestTube className="w-8 h-8 text-emerald-600" />,
        };
      case 'waste':
        return {
          title: 'Farm Waste & Compost Batch Tracking',
          phase: 'Phase 4 Architecture',
          description: 'Track crop residues, biomass recycling, composting batches, and finished organic inputs applied back to farm soils.',
          icon: <Recycle className="w-8 h-8 text-emerald-600" />,
        };
      case 'farm-work':
        return {
          title: 'Public Farm Work Board',
          phase: 'Phase 6 Architecture',
          description: 'Publish farm work opportunities (harvesting, intercultural operations) for public community discovery without worker accounts.',
          icon: <Briefcase className="w-8 h-8 text-emerald-600" />,
        };
      case 'market':
        return {
          title: 'Agricultural Market & Mandi Prices',
          phase: 'Phase 5 Architecture',
          description: 'AGMARKNET price trends, minimum/maximum/modal wholesale mandi rates across districts.',
          icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
        };
      case 'analytics':
        return {
          title: 'Farm Analytics & Cost Intelligence',
          phase: 'Phase 7 Architecture',
          description: 'Visual breakdowns of input costs, labor expenses, crop profitability, and sustainability progress using Recharts.',
          icon: <BarChart3 className="w-8 h-8 text-emerald-600" />,
        };
      case 'farm-ai':
        return {
          title: 'Farm-Aware AI Assistant',
          phase: 'Phase 8 Architecture',
          description: 'Context-grounded assistant aware of your registered farm soils, crops, past activities, and authoritative agricultural data.',
          icon: <Bot className="w-8 h-8 text-emerald-600" />,
        };
      case 'knowledge':
        return {
          title: 'Agricultural Knowledge Hub',
          phase: 'Phase 2 Architecture',
          description: 'Curated technical agronomy library grounded in ICAR, APEDA, State Agricultural Universities, and verified sources.',
          icon: <BookOpen className="w-8 h-8 text-emerald-600" />,
        };
      default:
        return {
          title: 'Agricultural Intelligence Module',
          phase: 'Upcoming Phase',
          description: 'Module is part of the planned phased release.',
          icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />,
        };
    }
  };

  const meta = getModuleMeta();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 shrink-0">
              {meta.icon}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                {meta.phase}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-heading mt-1">
                {meta.title}
              </h1>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={onGoToDashboard}>
            Back to Dashboard
          </Button>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mb-6">
          {meta.description}
        </p>

        {tab === 'weather' && (
          <div className="mt-4">
            <WeatherWidget farm={selectedFarm} />
          </div>
        )}

        {tab !== 'weather' && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-3">
            <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Planned Architectural Scope
            </h4>
            <p>
              In accordance with Product Rule #35, this module will be introduced systematically in its designated development phase after Phase 1 core operations (Authentication, Farms, Crops, and Activities) are fully verified and tested.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

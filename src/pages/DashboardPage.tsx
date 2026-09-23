import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFarmData } from '../contexts/FarmContext';
import { StatCard } from '../components/common/StatCard';
import { WeatherWidget } from '../components/dashboard/WeatherWidget';
import { RecentActivitiesFeed } from '../components/dashboard/RecentActivitiesFeed';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  Trees,
  Sprout,
  ClipboardList,
  IndianRupee,
  Leaf,
  Plus,
  CloudSun,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Package
} from 'lucide-react';
import { NavigationTab } from '../components/layout/Sidebar';

interface DashboardPageProps {
  onTabChange: (tab: NavigationTab) => void;
  onOpenAddFarm: () => void;
  onOpenAddCrop: () => void;
  onOpenAddActivity: () => void;
  onOpenAddInput: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onTabChange,
  onOpenAddFarm,
  onOpenAddCrop,
  onOpenAddActivity,
  onOpenAddInput,
}) => {
  const { profile } = useAuth();
  const { farms, crops, activities, selectedFarm } = useFarmData();

  // Computations
  const totalFarms = farms.length;
  const totalAreaAcres = farms.reduce((acc, f) => {
    // Basic normalization: assume acres unless hectares (* 2.47)
    const factor = f.area_unit === 'hectares' ? 2.47 : 1;
    return acc + (f.area * factor);
  }, 0);

  const activeCrops = crops.filter(c => c.status === 'active');
  const totalExpenses = activities.reduce((acc, a) => acc + (a.cost || 0), 0);
  const organicPracticesCount = activities.filter(a => 
    a.activity_type === 'Organic manure' || 
    a.activity_type === 'Biofertilizer application' || 
    a.activity_type === 'Mulching'
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Farmer Greeting & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              {profile?.farming_type ? `${profile.farming_type} Farming` : 'Sustainable Farm System'}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              {profile?.district ? `${profile.district}, ${profile.state}` : 'Farm Location Set'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Welcome back, {profile?.full_name || 'Farmer'}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Here is your sustainable agricultural snapshot for <span className="font-semibold text-slate-800">{selectedFarm?.name || 'your farm'}</span>. Current season is <span className="font-semibold text-emerald-700">{selectedFarm?.current_season || 'Kharif (Monsoon)'}</span>.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddInput}
            icon={<Package className="w-4 h-4" />}
          >
            Add Input
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddActivity}
            icon={<ClipboardList className="w-4 h-4" />}
          >
            Record Activity
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenAddCrop}
            icon={<Sprout className="w-4 h-4" />}
          >
            Add Crop
          </Button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Farms"
          value={totalFarms}
          subtext={`${totalAreaAcres.toFixed(1)} Total Acres Managed`}
          icon={<Trees className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="Active Crop Cycles"
          value={activeCrops.length}
          subtext={`${crops.length} total cycles recorded`}
          icon={<Sprout className="w-5 h-5" />}
          accentColor="blue"
        />
        <StatCard
          title="Sustainable Practices"
          value={organicPracticesCount}
          subtext="Manure, bio-inputs & mulch logs"
          icon={<Leaf className="w-5 h-5" />}
          accentColor="emerald"
        />
        <StatCard
          title="Total Farm Operations Cost"
          value={`₹${totalExpenses.toLocaleString('en-IN')}`}
          subtext={`${activities.length} operations recorded`}
          icon={<IndianRupee className="w-5 h-5" />}
          accentColor="amber"
        />
      </div>

      {/* Two Column Layout: Weather & Agronomic Advisory + Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Weather Widget */}
        <div className="lg:col-span-7 space-y-6">
          <WeatherWidget farm={selectedFarm} />

          {/* Active Crops Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Active Crops & Growth Status</h3>
                <p className="text-xs text-slate-500">Monitoring vegetative & reproductive phases</p>
              </div>
              <button
                onClick={() => onTabChange('crops')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Manage Crops</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeCrops.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No active crops registered yet.</p>
            ) : (
              <div className="space-y-3">
                {activeCrops.slice(0, 3).map(crop => (
                  <div
                    key={crop.id}
                    className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{crop.crop_name}</span>
                        {crop.variety && (
                          <span className="text-[10px] text-slate-500">({crop.variety})</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Planted: {crop.planting_date} • {crop.area} {crop.area_unit}
                      </p>
                    </div>
                    <Badge variant="emerald" size="sm">
                      {crop.growth_stage}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Operations Feed & Sustainability Highlights */}
        <div className="lg:col-span-5 space-y-6">
          <RecentActivitiesFeed
            activities={activities}
            onViewAll={() => onTabChange('activities')}
            onRecordActivity={onOpenAddActivity}
          />

          {/* Sustainability & Good Practices Tracker */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/40 rounded-2xl border border-emerald-200/60 p-5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Sustainability Tracking
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Your farm maintains high organic compliance with active biomass mulching and microbial consortium inoculations.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span>Soil Organic Carbon Support</span>
                <span className="font-bold text-emerald-800">Active (FYM / Mulch)</span>
              </div>
              <div className="w-full bg-emerald-200/50 rounded-full h-1.5">
                <div className="bg-emerald-600 h-1.5 rounded-full w-4/5" />
              </div>
              <div className="flex items-center justify-between text-slate-700 pt-1">
                <span>IPM Biological Priority</span>
                <span className="font-bold text-emerald-800">100% Non-Chemical</span>
              </div>
              <div className="w-full bg-emerald-200/50 rounded-full h-1.5">
                <div className="bg-emerald-600 h-1.5 rounded-full w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

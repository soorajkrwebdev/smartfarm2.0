import React from 'react';
import {
  LayoutDashboard,
  Trees,
  Sprout,
  ClipboardList,
  Package,
  Leaf,
  Bug,
  TestTube,
  Recycle,
  Briefcase,
  CloudSun,
  TrendingUp,
  BarChart3,
  Bot,
  BookOpen,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Badge } from '../common/Badge';

export type NavigationTab = 
  | 'dashboard'
  | 'farms'
  | 'crops'
  | 'activities'
  | 'inputs'
  | 'organic'
  | 'pest-ipm'
  | 'tests'
  | 'waste'
  | 'sustainability'
  | 'farm-work'
  | 'weather'
  | 'market'
  | 'analytics'
  | 'farm-ai'
  | 'knowledge'
  | 'profile';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
}

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  phaseNotice?: string;
  isFlagship?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange }) => {
  const { profile, signOut, isDemoMode, isConfigured } = useAuth();

  const primaryItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'farms', label: 'My Farms', icon: <Trees className="w-4 h-4" /> },
    { id: 'crops', label: 'Crops & Cycles', icon: <Sprout className="w-4 h-4" /> },
    { id: 'activities', label: 'Farm Activities', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'inputs', label: 'Inputs Management', icon: <Package className="w-4 h-4" /> },
    { id: 'organic', label: 'Organic Farming Hub', icon: <Leaf className="w-4 h-4" />, isFlagship: true },
  ];

  const secondaryItems: NavItem[] = [
    { id: 'weather', label: 'Weather Intel', icon: <CloudSun className="w-4 h-4" /> },
    { id: 'pest-ipm', label: 'Pest & IPM Advisory', icon: <Bug className="w-4 h-4" />, phaseNotice: 'Phase 3' },
    { id: 'tests', label: 'Soil & Water Tests', icon: <TestTube className="w-4 h-4" />, phaseNotice: 'Phase 4' },
    { id: 'waste', label: 'Waste & Compost', icon: <Recycle className="w-4 h-4" />, phaseNotice: 'Phase 4' },
    { id: 'market', label: 'Market Prices', icon: <TrendingUp className="w-4 h-4" />, phaseNotice: 'Phase 5' },
    { id: 'farm-work', label: 'Farm Work Board', icon: <Briefcase className="w-4 h-4" />, phaseNotice: 'Phase 6' },
    { id: 'analytics', label: 'Farm Analytics', icon: <BarChart3 className="w-4 h-4" />, phaseNotice: 'Phase 7' },
    { id: 'farm-ai', label: 'Farm AI Assistant', icon: <Bot className="w-4 h-4" />, phaseNotice: 'Phase 8' },
    { id: 'knowledge', label: 'Knowledge Hub', icon: <BookOpen className="w-4 h-4" />, phaseNotice: 'Phase 2' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/80 min-h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm shadow-emerald-700/20">
          <Leaf className="w-5 h-5 fill-white/20" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900 tracking-tight text-base font-heading">SmartFarm</span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase tracking-wider">2.0</span>
          </div>
          <p className="text-[10px] text-slate-400 font-medium">Sustainable Agriculture</p>
        </div>
      </div>

      {/* Database State Badge */}
      <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Database State:</span>
          {isConfigured && !isDemoMode ? (
            <Badge variant="emerald" size="sm">Supabase Live</Badge>
          ) : (
            <Badge variant="amber" size="sm">Local Sandbox</Badge>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Operations */}
        <div>
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Core Operations</p>
          <nav className="space-y-1">
            {primaryItems.map(item => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.isFlagship && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${active ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-50 text-emerald-700'}`}>
                      Flagship
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Extended Intelligence Modules */}
        <div>
          <div className="px-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            <span>Intelligence & Modules</span>
            <Sparkles className="w-3 h-3 text-emerald-600" />
          </div>
          <nav className="space-y-1">
            {secondaryItems.map(item => {
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.phaseNotice && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${active ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-100 text-slate-500 font-normal'}`}>
                      {item.phaseNotice}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Card / Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
          <button 
            onClick={() => onTabChange('profile')}
            className="flex items-center gap-2.5 min-w-0 text-left cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'F'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate">{profile?.full_name || 'Farmer'}</p>
              <p className="text-[10px] text-slate-400 capitalize truncate">{profile?.farming_type || 'Organic'} grower</p>
            </div>
          </button>
          <button
            onClick={signOut}
            title="Log Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

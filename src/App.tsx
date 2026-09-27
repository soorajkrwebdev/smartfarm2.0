import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FarmProvider } from './contexts/FarmContext';
import { AppShell } from './components/layout/AppShell';
import { NavigationTab } from './components/layout/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { FarmsPage } from './pages/FarmsPage';
import { CropsPage } from './pages/CropsPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { InputsPage } from './pages/InputsPage';
import { OrganicPage } from './pages/OrganicPage';
import { PestPage } from './pages/pest-ipm/PestPage';
import { TestsPage } from './pages/tests/TestsPage';
import { WastePage } from './pages/waste/WastePage';
import { SustainabilityPage } from './pages/sustainability/SustainabilityPage';
import { WeatherPage } from './pages/weather/WeatherPage';
import { MarketPage } from './pages/market/MarketPage';
import { FarmWorkBoardPage } from './pages/farm-work/FarmWorkBoardPage';
import { AnalyticsPage } from './pages/analytics/AnalyticsPage';
import { FarmAiPage } from './pages/farm-ai/FarmAiPage';
import { KnowledgePage } from './pages/knowledge/KnowledgePage';
import { ProfilePage } from './pages/ProfilePage';
import { ExpensesPage } from './pages/ExpensesPage';
import { HarvestsPage } from './pages/HarvestsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ModulePreviewPage } from './pages/ModulePreviewPage';
import { FarmFormModal } from './components/farms/FarmFormModal';
import { CropFormModal } from './components/crops/CropFormModal';
import { ActivityFormModal } from './components/activities/ActivityFormModal';
import { InputFormModal } from './components/inputs/InputFormModal';
import { PestObservationModal } from './components/pest-ipm/PestObservationModal';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const MainAppContent: React.FC = () => {
  const { user, loading, connection } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [authView, setAuthView] = useState<'none' | 'login' | 'register'>('none');

  // Quick-action modal triggers
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddInputOpen, setIsAddInputOpen] = useState(false);
  const [isPestObsModalOpen, setIsPestObsModalOpen] = useState(false);

  if (loading || connection.status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Checking connection..." />
      </div>
    );
  }

  if (connection.status !== 'connected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-amber-200 p-8 text-center shadow-lg">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{connection.label}</h2>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">
            {connection.detail}
          </p>
          {connection.status === 'configuration_missing' && (
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Copy <code className="bg-slate-100 px-1 rounded">.env.example</code> to{' '}
              <code className="bg-slate-100 px-1 rounded">.env</code> and set{' '}
              <code className="bg-slate-100 px-1 rounded">VITE_SUPABASE_URL</code> and{' '}
              <code className="bg-slate-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code>
              {' '}(or <code className="bg-slate-100 px-1 rounded">VITE_SUPABASE_PUBLISHABLE_KEY</code>), then restart the dev server.
            </p>
          )}
          <p className="text-xs text-slate-400">
            Error code: {connection.code}
          </p>
        </div>
      </div>
    );
  }

  // Not logged in → landing page or auth
  if (!user && authView === 'none') {
    return (
      <LandingPage
        onGoToAuth={(mode) => setAuthView(mode)}
      />
    );
  }

  if (!user && authView !== 'none') {
    return (
      <AuthPage
        initialMode={authView}
        onBackToLanding={() => setAuthView('none')}
      />
    );
  }

  // Authenticated farmer
  const renderTabContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onTabChange={setCurrentTab}
            onOpenAddFarm={() => setIsAddFarmOpen(true)}
            onOpenAddCrop={() => setIsAddCropOpen(true)}
            onOpenAddActivity={() => setIsAddActivityOpen(true)}
            onOpenAddInput={() => setIsAddInputOpen(true)}
            onOpenRecordPestObservation={() => setIsPestObsModalOpen(true)}
            onOpenPesticideAdvisory={() => setCurrentTab('pest-ipm')}
            onOpenOrganicInputs={() => setCurrentTab('organic')}
          />
        );
      case 'farms':      return <FarmsPage />;
      case 'crops':      return <CropsPage />;
      case 'activities': return <ActivitiesPage />;
      case 'inputs':     return <InputsPage />;
      case 'organic':    return <OrganicPage />;
      case 'pest-ipm':   return <PestPage />;
      case 'tests':      return <TestsPage />;
      case 'waste':      return <WastePage />;
      case 'sustainability': return <SustainabilityPage />;
      case 'weather':    return <WeatherPage />;
      case 'market':     return <MarketPage />;
      case 'farm-work':  return <FarmWorkBoardPage />;
      case 'analytics':  return <AnalyticsPage />;
      case 'farm-ai':    return <FarmAiPage />;
      case 'knowledge':  return <KnowledgePage />;
      case 'profile':    return <ProfilePage />;
      case 'expenses':     return <ExpensesPage />;
      case 'harvests':     return <HarvestsPage />;
      case 'notifications': return <NotificationsPage />;
      case 'reports':      return <ReportsPage />;
      default:
        return (
          <ModulePreviewPage
            tab={currentTab}
            onGoToDashboard={() => setCurrentTab('dashboard')}
          />
        );
    }
  };

  return (
    <FarmProvider>
      <AppShell currentTab={currentTab} onTabChange={setCurrentTab}>
        {renderTabContent()}

        {/* Global quick-add modals triggered from dashboard/header */}
        <FarmFormModal isOpen={isAddFarmOpen} onClose={() => setIsAddFarmOpen(false)} />
        <CropFormModal isOpen={isAddCropOpen} onClose={() => setIsAddCropOpen(false)} />
        <ActivityFormModal isOpen={isAddActivityOpen} onClose={() => setIsAddActivityOpen(false)} />
        <InputFormModal isOpen={isAddInputOpen} onClose={() => setIsAddInputOpen(false)} />
        <PestObservationModal isOpen={isPestObsModalOpen} onClose={() => setIsPestObsModalOpen(false)} />
      </AppShell>
    </FarmProvider>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

export default App;

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
import { ModulePreviewPage } from './pages/ModulePreviewPage';
import { FarmFormModal } from './components/farms/FarmFormModal';
import { CropFormModal } from './components/crops/CropFormModal';
import { ActivityFormModal } from './components/activities/ActivityFormModal';
import { InputFormModal } from './components/inputs/InputFormModal';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const MainAppContent: React.FC = () => {
  const { user, loading, signIn } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [authView, setAuthView] = useState<'none' | 'login' | 'register'>('none');

  // Quick action modal triggers
  const [isAddFarmOpen, setIsAddFarmOpen] = useState(false);
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);
  const [isAddInputOpen, setIsAddInputOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner message="Initializing SmartFarm 2.0 Platform..." />
      </div>
    );
  }

  // Not logged in and not on auth screen -> show public landing page
  if (!user && authView === 'none') {
    return (
      <LandingPage
        onGoToAuth={(mode) => setAuthView(mode)}
        onExploreDemo={async () => {
          await signIn('ramesh.patel@smartfarm.org', 'demo');
        }}
      />
    );
  }

  // Auth screen (Login / Register)
  if (!user && authView !== 'none') {
    return (
      <AuthPage
        initialMode={authView}
        onBackToLanding={() => setAuthView('none')}
      />
    );
  }

  // Authenticated farmer dashboard application
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
          />
        );
      case 'farms':
        return <FarmsPage />;
      case 'crops':
        return <CropsPage />;
      case 'activities':
        return <ActivitiesPage />;
      case 'inputs':
        return <InputsPage />;
      case 'organic':
        return <OrganicPage />;
      case 'pest-ipm':
        return <PestPage />;
      case 'tests':
        return <TestsPage />;
      case 'waste':
        return <WastePage />;
      case 'sustainability':
        return <SustainabilityPage />;
      case 'weather':
        return <WeatherPage />;
      case 'market':
        return <MarketPage />;
      case 'farm-work':
        return <FarmWorkBoardPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'farm-ai':
        return <FarmAiPage />;
      case 'knowledge':
        return <KnowledgePage />;
      case 'profile':
        return <ProfilePage />;
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

        {/* Global Modals triggered from dashboard or header */}
        <FarmFormModal
          isOpen={isAddFarmOpen}
          onClose={() => setIsAddFarmOpen(false)}
        />
        <CropFormModal
          isOpen={isAddCropOpen}
          onClose={() => setIsAddCropOpen(false)}
        />
        <ActivityFormModal
          isOpen={isAddActivityOpen}
          onClose={() => setIsAddActivityOpen(false)}
        />
        <InputFormModal
          isOpen={isAddInputOpen}
          onClose={() => setIsAddInputOpen(false)}
        />
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

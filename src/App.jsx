import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import Header from './components/Shell/Header';
import Navigation from './components/Shell/Navigation';
import OnboardingView from './views/OnboardingView';
import Home from './views/Home';
import WardrobeView from './views/WardrobeView';
import ScanView from './views/ScanView';
import PremiumView from './views/PremiumView';
import ProfileView from './views/ProfileView';

function AppContent() {
  const { currentView } = useContext(AppContext);

  return (
    <>
      {/* Sticky header */}
      <Header />
      
      {/* Main scrollable view panel */}
      <main className="main-content no-scrollbar">
        {currentView === 'onboarding' && <OnboardingView />}
        {currentView === 'home' && <Home />}
        {currentView === 'wardrobe' && <WardrobeView />}
        {currentView === 'scan' && <ScanView />}
        {currentView === 'premium' && <PremiumView />}
        {currentView === 'profile' && <ProfileView />}
      </main>

      {/* Bottom mobile tab bar */}
      <Navigation />
    </>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

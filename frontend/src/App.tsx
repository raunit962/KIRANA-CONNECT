import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { RoleSwitcher } from './components/RoleSwitcher';
import { PortalSlideMenu } from './components/PortalSlideMenu';
import { BookCoverPage } from './views/BookCoverPage';
import { CustomerPortal } from './views/CustomerPortal';
import { AgentPortal } from './views/AgentPortal';
import { MerchantPortal } from './views/MerchantPortal';
import { AdminPortal } from './views/AdminPortal';
import { LiveFlowSimulator } from './views/LiveFlowSimulator';
import { Store, ShieldCheck } from 'lucide-react';

const MainLayout: React.FC = () => {
  // Starts on the editorial "Book Cover Page" by default
  const [activeTab, setActiveTab] = useState<string>('COVER');
  const [isSlideMenuOpen, setIsSlideMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#786F67] selection:bg-[#1A5336] selection:text-[#fffd47]">
      {/* 1. Global Slide Bar Menu Drawer */}
      <PortalSlideMenu
        isOpen={isSlideMenuOpen}
        onClose={() => setIsSlideMenuOpen(false)}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Primary Content Rendering */}
      {activeTab === 'COVER' ? (
        // Editorial Book Cover Landing Page (No portal clutter)
        <BookCoverPage
          onOpenSlideMenu={() => setIsSlideMenuOpen(true)}
          onNavigatePortal={(portalKey) => {
            setActiveTab(portalKey);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        // Operational Portal Views
        <>
          {/* Top Navigation Bar with Back-to-Cover and Portal Menu */}
          <Navbar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenSlideMenu={() => setIsSlideMenuOpen(true)}
          />

          {/* Quick Role Switcher Bar */}
          <RoleSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Active Portal Workspace */}
          <main className="flex-1 pb-16">
            {activeTab === 'CUSTOMER' && <CustomerPortal />}
            {activeTab === 'AGENT' && <AgentPortal />}
            {activeTab === 'MERCHANT' && <MerchantPortal />}
            {activeTab === 'ADMIN' && <AdminPortal />}
            {activeTab === 'SIMULATOR' && <LiveFlowSimulator />}
          </main>

          {/* Footer */}
          <footer className="bg-[#171717] border-t border-[#D8C3A5]/20 py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#D8C3A5]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <Store className="w-4 h-4 text-[#B85C38]" />
                <span className="font-bold text-[#F8F5EF]">KiranaConnect </span>
                <span className="text-[#D8C3A5]/80"> ~ Acts as an exception layer to reduce Failed deliveries</span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setActiveTab('COVER')}
                  className="text-[#fffd47] hover:underline font-bold"
                >
                  📖 Return to Book Cover
                </button>
                <span className="text-[#D8C3A5] font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B85C38]" />
                </span>
                <span className="text-[#D8C3A5]/80">Contact For further Queries &amp; Help</span>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;

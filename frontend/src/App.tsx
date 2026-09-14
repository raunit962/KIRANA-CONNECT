import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { RoleSwitcher } from './components/RoleSwitcher';
import { CustomerPortal } from './views/CustomerPortal';
import { AgentPortal } from './views/AgentPortal';
import { MerchantPortal } from './views/MerchantPortal';
import { AdminPortal } from './views/AdminPortal';
import { LiveFlowSimulator } from './views/LiveFlowSimulator';
import { Store, ShieldCheck, Heart, ExternalLink, Globe } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('CUSTOMER');
  const { language } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EF] text-[#786F67] selection:bg-[#B85C38] selection:text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* Persistent 1-Click Role Switcher */}
      <RoleSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Active View Container */}
      <main className="flex-1 pb-16">
        {activeTab === 'CUSTOMER' && <CustomerPortal />}
        {activeTab === 'AGENT' && <AgentPortal />}
        {activeTab === 'MERCHANT' && <MerchantPortal />}
        {activeTab === 'ADMIN' && <AdminPortal />}
        {activeTab === 'SIMULATOR' && <LiveFlowSimulator />}
      </main>

      {/* Footer with Solution Context */}
      <footer className="bg-[#171717] border-t border-[#D8C3A5]/20 py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#D8C3A5]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Store className="w-4 h-4 text-[#B85C38]" />
            <span className="font-bold text-[#F8F5EF]">KiranaConnect </span>
            <span className="text-[#D8C3A5]/80"> ~ Acts as an exception layer to reduce Failed deliveries</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-[#D8C3A5] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B85C38]" />
              
            </span>
            <span className="text-[#D8C3A5]/80">Contact For further Queries & Help</span>
          </div>
        </div>
      </footer>
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

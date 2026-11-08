import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { CompanySearchView } from './components/CompanySearchView';
import { KnowledgeGraphView } from './components/KnowledgeGraphView';
import { ChatbotView } from './components/ChatbotView';
import { CompanyComparisonView } from './components/CompanyComparisonView';
import { ReportGeneratorView } from './components/ReportGeneratorView';
import { AdminDashboardView } from './components/AdminDashboardView';
import { NotebookView } from './components/NotebookView';
import { ValuationForecastView } from './components/ValuationForecastView';
import { InvestigatorWorkspaceView } from './components/InvestigatorWorkspaceView';
import { LandingPageView } from './components/LandingPageView';
import { CommandPalette } from './components/CommandPalette';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  const handleSelectCompare = (companyName: string) => {
    setActiveTab('compare');
  };

  if (activeTab === 'landing') {
    return <LandingPageView onEnterApp={() => setActiveTab('dashboard')} />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AnalyticsDashboardView />;
      case 'investigator':
        return <InvestigatorWorkspaceView />;
      case 'search':
        return <CompanySearchView onSelectCompare={handleSelectCompare} />;
      case 'graph':
        return <KnowledgeGraphView />;
      case 'chatbot':
        return <ChatbotView />;
      case 'compare':
        return <CompanyComparisonView />;
      case 'forecast':
        return <ValuationForecastView />;
      case 'notebook':
        return <NotebookView />;
      case 'reports':
        return <ReportGeneratorView />;
      case 'admin':
        return <AdminDashboardView />;
      default:
        return <AnalyticsDashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-900 text-slate-100 selection:bg-sky-500 selection:text-white">
      <CommandPalette 
        isOpen={isCmdOpen} 
        onClose={() => setIsCmdOpen(false)} 
        onSelectTab={(tab) => setActiveTab(tab)} 
      />
      
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar activeTab={activeTab} onOpenCommandPalette={() => setIsCmdOpen(true)} />
        <main className="p-6 flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}

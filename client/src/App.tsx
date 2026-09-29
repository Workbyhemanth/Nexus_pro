import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DemoBanner } from './components/DemoBanner';
import { DashboardView } from './views/DashboardView';
import { MeetingsView } from './views/MeetingsView';
import { PrepareView } from './views/PrepareView';
import { CommitmentsView } from './views/CommitmentsView';
import { ChatView } from './views/ChatView';
import { MemoryExplorerView } from './views/MemoryExplorerView';
import { SettingsView } from './views/SettingsView';
import { NewMeetingModal } from './components/NewMeetingModal';
import { MeetingDetailsModal } from './components/MeetingDetailsModal';
import { Meeting, Commitment, MemoryItem } from './types';
import { api } from './services/api';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [selectedPrepareClient, setSelectedPrepareClient] = useState<string>('');

  const [isNewMeetingModalOpen, setIsNewMeetingModalOpen] = useState<boolean>(false);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [mtgs, comms, mems] = await Promise.all([
        api.getMeetings(),
        api.getCommitments(),
        api.getMemories()
      ]);
      setMeetings(mtgs);
      setCommitments(comms);
      setMemories(mems);

      if (mtgs.length > 0 && !selectedPrepareClient) {
        setSelectedPrepareClient(mtgs[0].client_name);
      }
    } catch (err) {
      console.error('Failed to load application data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateCommitmentStatus = async (id: string, status: any) => {
    try {
      await api.updateCommitmentStatus(id, status);
      loadData();
    } catch (err) {
      console.error('Failed to update commitment status:', err);
    }
  };

  const handleDeleteCommitment = async (id: string) => {
    try {
      await api.deleteCommitment(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete commitment:', err);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    try {
      await api.deleteMeeting(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete meeting:', err);
    }
  };

  const handleUpdateMemory = async (id: string, data: any) => {
    try {
      await api.updateMemory(id, data);
      loadData();
    } catch (err) {
      console.error('Failed to update memory:', err);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await api.deleteMemory(id);
      loadData();
    } catch (err) {
      console.error('Failed to delete memory:', err);
    }
  };

  const pageTitles: Record<NavTab, string> = {
    dashboard: 'Dashboard Overview',
    meetings: 'Meeting History & Notes',
    prepare: 'Prepare Me for My Next Meeting',
    commitments: 'Commitment & Task Tracking',
    chat: 'AI Memory Assistant',
    memories: 'Hindsight Memory Explorer',
    settings: 'System Settings & Integration'
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenQuickPrepare={() => {
          if (meetings.length > 0) setSelectedPrepareClient(meetings[0].client_name);
          setCurrentTab('prepare');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Hackathon Demo Walkthrough Banner */}
        <DemoBanner
          onRefreshData={loadData}
          onNavigateTab={setCurrentTab}
          onSelectClientForPrepare={setSelectedPrepareClient}
        />

        {/* Header Navbar */}
        <Navbar
          title={pageTitles[currentTab]}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewMeeting={() => setIsNewMeetingModalOpen(true)}
          onOpenPrepare={() => setCurrentTab('prepare')}
        />

        {/* View Page Container */}
        <main className="flex-1 p-6 overflow-y-auto">
          {currentTab === 'dashboard' && (
            <DashboardView
              meetings={meetings}
              commitments={commitments}
              memories={memories}
              onNavigateTab={setCurrentTab}
              onOpenNewMeeting={() => setIsNewMeetingModalOpen(true)}
              onSelectClientForPrepare={setSelectedPrepareClient}
            />
          )}

          {currentTab === 'meetings' && (
            <MeetingsView
              meetings={meetings}
              onOpenNewMeeting={() => setIsNewMeetingModalOpen(true)}
              onSelectMeetingDetails={setSelectedMeetingId}
              onDeleteMeeting={handleDeleteMeeting}
              onSelectClientForPrepare={setSelectedPrepareClient}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'prepare' && (
            <PrepareView
              meetings={meetings}
              selectedClient={selectedPrepareClient}
              onSelectClient={setSelectedPrepareClient}
            />
          )}

          {currentTab === 'commitments' && (
            <CommitmentsView
              commitments={commitments}
              onUpdateStatus={handleUpdateCommitmentStatus}
              onDeleteCommitment={handleDeleteCommitment}
            />
          )}

          {currentTab === 'chat' && (
            <ChatView meetings={meetings} />
          )}

          {currentTab === 'memories' && (
            <MemoryExplorerView
              memories={memories}
              onUpdateMemory={handleUpdateMemory}
              onDeleteMemory={handleDeleteMemory}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView onRefreshData={loadData} />
          )}
        </main>
      </div>

      {/* Modals */}
      <NewMeetingModal
        isOpen={isNewMeetingModalOpen}
        onClose={() => setIsNewMeetingModalOpen(false)}
        onSuccess={loadData}
      />

      <MeetingDetailsModal
        meetingId={selectedMeetingId}
        onClose={() => setSelectedMeetingId(null)}
      />
    </div>
  );
}

export default App;

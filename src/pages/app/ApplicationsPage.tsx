import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, Modal, Input, AgentBadge } from '../../components/ui';
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Calendar,
  Building2,
  FileText,
  Filter,
  Layers,
  List
} from 'lucide-react';
import { ApplicationStatusType } from '../../types';

export const ApplicationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { applications, selectedJob, activeResumeVersion, coverLetter, recordJobApplication, isLoading } = useWorkflow();

  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST'>('KANBAN');
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [appNotes, setAppNotes] = useState('');

  const statuses: ApplicationStatusType[] = [
    'SAVED', 'APPLIED', 'APPLICATION_RECEIVED', 'SCREENING', 'INTERVIEW', 'OFFER', 'REJECTED'
  ];

  const handleRecordNewApp = async () => {
    await recordJobApplication(appNotes);
    setRecordModalOpen(false);
  };

  const getStatusBadge = (status: ApplicationStatusType) => {
    switch (status) {
      case 'INTERVIEW': return <Badge variant="success">Interview</Badge>;
      case 'OFFER': return <Badge variant="info">Offer!</Badge>;
      case 'APPLIED': return <Badge variant="dark">Applied</Badge>;
      case 'REJECTED': return <Badge variant="danger">Rejected</Badge>;
      default: return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Application Management & Tracking</h1>
            <AgentBadge code="AG-006 & AG-007" name="App Mgmt & Tracking" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Track application status history timelines. Tying together exact resume versions and cover letters used.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#111111] p-1 rounded-full border border-white/12 text-xs font-semibold">
            <button
              onClick={() => setViewMode('KANBAN')}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${viewMode === 'KANBAN' ? 'bg-[#28282A] text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              <Layers className="w-3.5 h-3.5" /> Board
            </button>
            <button
              onClick={() => setViewMode('LIST')}
              className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors ${viewMode === 'LIST' ? 'bg-[#28282A] text-white' : 'text-neutral-400 hover:text-white'}`}
            >
              <List className="w-3.5 h-3.5" /> List
            </button>
          </div>

          <Button variant="whitePill" size="sm" onClick={() => setRecordModalOpen(true)} leftIcon={<Plus className="w-4 h-4 text-black" />}>
            Record New Application
          </Button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-[#1A1A1A] border-white/12">
          <span className="text-2xl font-extrabold font-display text-white">{applications.length}</span>
          <span className="block text-[11px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Total Tracked</span>
        </Card>
        <Card className="p-4 text-center bg-[#1A1A1A] border-white/12">
          <span className="text-2xl font-extrabold font-display text-white">
            {applications.filter(a => a.status === 'APPLIED' || a.status === 'APPLICATION_RECEIVED').length}
          </span>
          <span className="block text-[11px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Active Pipelines</span>
        </Card>
        <Card className="p-4 text-center bg-[#1A1A1A] border-white/12">
          <span className="text-2xl font-extrabold font-display text-emerald-400">
            {applications.filter(a => a.status === 'INTERVIEW').length}
          </span>
          <span className="block text-[11px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Interviews</span>
        </Card>
        <Card className="p-4 text-center bg-[#1A1A1A] border-white/12">
          <span className="text-2xl font-extrabold font-display text-white">
            {applications.filter(a => a.status === 'OFFER').length}
          </span>
          <span className="block text-[11px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Offers</span>
        </Card>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'KANBAN' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-x-auto pb-4">
          {['APPLIED', 'APPLICATION_RECEIVED', 'INTERVIEW', 'OFFER'].map(statusKey => {
            const statusApps = applications.filter(a => a.status === statusKey);
            return (
              <div key={statusKey} className="bg-[#111111] rounded-2xl p-4 min-w-[260px] flex flex-col h-full border border-white/12">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-bold text-xs text-white uppercase tracking-wider">{statusKey.replace('_', ' ')}</span>
                  <span className="w-5 h-5 rounded-full bg-[#28282A] text-neutral-300 font-bold text-[11px] flex items-center justify-center">
                    {statusApps.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {statusApps.map(app => (
                    <Card key={app.id} className="p-4 bg-[#1A1A1A] border-white/10 hoverable space-y-3">
                      <div>
                        <h4 className="font-bold text-white text-xs">{app.companyName}</h4>
                        <p className="text-[11px] text-neutral-400 font-medium leading-tight mt-0.5">{app.jobTitle}</p>
                      </div>

                      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-neutral-500">
                        <span>Applied: {app.appliedDate.split('T')[0]}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-400" />
                      </div>
                    </Card>
                  ))}
                  {statusApps.length === 0 && (
                    <div className="py-8 text-center text-xs text-neutral-500 italic">No applications in this stage</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW WITH TIMELINE HISTORY */}
      {viewMode === 'LIST' && (
        <div className="space-y-4">
          {applications.map(app => (
            <Card key={app.id} className="p-6 space-y-4 bg-[#1A1A1A] border-white/12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#111111] text-white border border-white/10 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{app.companyName}</h3>
                    <p className="text-xs text-neutral-400">{app.jobTitle} • Date: {app.appliedDate.split('T')[0]}</p>
                  </div>
                </div>

                {getStatusBadge(app.status)}
              </div>

              {/* Status Timeline Events (AG-007 Requirement) */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2 font-mono">Status Timeline History (DATA-012)</span>
                <div className="space-y-2">
                  {app.history.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                      <span className="font-bold text-white">{ev.status}</span>
                      <span className="text-neutral-500">• {ev.timestamp.split('T')[0]}</span>
                      {ev.note && <span className="text-neutral-400 italic">({ev.note})</span>}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* RECORD APPLICATION MODAL */}
      <Modal isOpen={recordModalOpen} onClose={() => setRecordModalOpen(false)} title="Record New Job Application">
        <div className="space-y-4 text-xs text-white">
          <div className="p-3 bg-[#111111] border border-white/15 rounded-xl text-neutral-300">
            <span className="font-bold block mb-1 text-white">Scope Clarification:</span>
            <span>This action records your application in the system tracking database (DATA-011). Automatic submission to 3rd-party job boards is out of scope.</span>
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Target Company & Role</label>
            <Input value={`${selectedJob?.company || 'Anthropic'} - ${selectedJob?.title || 'Frontend Engineer'}`} disabled />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Resume Version Used</label>
            <Input value={activeResumeVersion.versionName} disabled />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Application Notes / External Job URL</label>
            <textarea
              value={appNotes}
              onChange={e => setAppNotes(e.target.value)}
              placeholder="e.g. Applied manually via company careers portal..."
              rows={3}
              className="w-full p-3 rounded-xl border border-white/15 bg-[#111111] text-white focus:outline-none focus:border-white/35 font-sans"
            />
          </div>

          <Button variant="whitePill" className="w-full mt-2 py-3" onClick={handleRecordNewApp} isLoading={isLoading}>
            Confirm & Record Application
          </Button>
        </div>
      </Modal>
    </div>
  );
};

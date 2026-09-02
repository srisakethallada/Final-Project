import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge } from '../../components/ui';
import { Bell, CheckCircle2, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useWorkflow();

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-white font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">Notification Center</h1>
            <AgentBadge code="AG-008" name="Notification Agent" />
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            AG-008 delivers in-app alerts for application status updates, interview invitations, and job matches.
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-4 bg-[#1A1A1A] border-white/12">
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.actionUrl) navigate(notif.actionUrl);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.read ? 'bg-[#111111] border-white/20' : 'bg-[#111111]/60 border-white/10'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#28282A] text-white flex items-center justify-center shrink-0 font-bold border border-white/12">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs">{notif.title}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

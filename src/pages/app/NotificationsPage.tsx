import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge } from '../../components/ui';
import { Bell, CheckCircle2, AlertCircle, ArrowRight, Trash2 } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { notifications, markNotificationRead } = useWorkflow();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-outfit text-slate-900">Notification Center</h1>
            <AgentBadge code="AG-008" name="Notification Agent" />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            AG-008 delivers in-app alerts for application status updates, interview invitations, and job matches.
          </p>
        </div>
      </div>

      <Card className="p-6 space-y-4">
        <div className="space-y-3">
          {notifications.map(notif => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationRead(notif.id);
                if (notif.actionUrl) navigate(notif.actionUrl);
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.read ? 'bg-brand-50/50 border-brand-200' : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0 font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs font-outfit">{notif.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

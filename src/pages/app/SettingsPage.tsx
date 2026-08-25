import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge } from '../../components/ui';
import { ShieldCheck, Mail, Lock, User, Github, Linkedin, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateEmailAuthorization } = useWorkflow();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-outfit text-slate-900">Account & Security Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage connected accounts, privacy preferences, and email authorization permissions.</p>
      </div>

      {/* EMAIL AUTHORIZATION PERMISSIONS CARD (SRS Requirement: Separate from Login Auth) */}
      <Card className="p-6 space-y-4 border-indigo-200 bg-gradient-to-br from-white to-brand-50/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm font-outfit">Email Read-Only Access (AG-009)</h3>
                <AgentBadge code="AG-009" name="Interview Scan" />
              </div>
              <p className="text-xs text-slate-500">
                Grants read-scoped permission to scan inbox for interview invitation detection only.
              </p>
            </div>
          </div>

          <Badge variant={user.emailAuthorized ? 'success' : 'slate'}>
            {user.emailAuthorized ? 'Authorized' : 'Not Granted'}
          </Badge>
        </div>

        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
          <span className="font-bold text-slate-800 block">Security Boundary Guarantee:</span>
          <p>This permission is strictly separate from login authentication. The platform never writes or transmits emails on your behalf.</p>
        </div>

        <div className="flex justify-end pt-2">
          {user.emailAuthorized ? (
            <Button variant="danger" size="sm" onClick={() => updateEmailAuthorization(false)}>
              Revoke Email Read Access
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => updateEmailAuthorization(true)}>
              Grant Read-Only Email Access
            </Button>
          )}
        </div>
      </Card>

      {/* CONNECTED ACCOUNTS */}
      <Card className="p-6 space-y-4">
        <h3 className="font-bold text-base font-outfit text-slate-900">Connected OAuth Providers</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-800">Google Account ({user.email})</span>
            <Badge variant="success" size="sm">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-800">LinkedIn Account</span>
            <Badge variant="success" size="sm">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <span className="font-semibold text-slate-800">GitHub Account</span>
            <Badge variant="success" size="sm">Connected</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

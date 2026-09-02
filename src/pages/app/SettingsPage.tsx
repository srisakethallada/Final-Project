import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, AgentBadge } from '../../components/ui';
import { ShieldCheck, Mail, Lock, User, Github, Linkedin, AlertCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateEmailAuthorization } = useWorkflow();

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-white font-sans">
      <div>
        <h1 className="text-2xl font-bold text-white">Account & Security Settings</h1>
        <p className="text-xs text-neutral-400 mt-1">Manage connected accounts, privacy preferences, and email authorization permissions.</p>
      </div>

      {/* EMAIL AUTHORIZATION PERMISSIONS CARD (SRS Requirement: Separate from Login Auth) */}
      <Card className="p-6 space-y-4 border-white/12 bg-[#1A1A1A]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#111111] text-white flex items-center justify-center font-bold border border-white/10">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Email Read-Only Access (AG-009)</h3>
                <AgentBadge code="AG-009" name="Interview Scan" />
              </div>
              <p className="text-xs text-neutral-400">
                Grants read-scoped permission to scan inbox for interview invitation detection only.
              </p>
            </div>
          </div>

          <Badge variant={user.emailAuthorized ? 'success' : 'dark'}>
            {user.emailAuthorized ? 'Authorized' : 'Not Granted'}
          </Badge>
        </div>

        <div className="p-3 bg-[#111111] rounded-xl border border-white/10 text-xs text-neutral-300 space-y-1">
          <span className="font-bold text-white block">Security Boundary Guarantee:</span>
          <p>This permission is strictly separate from login authentication. The platform never writes or transmits emails on your behalf.</p>
        </div>

        <div className="flex justify-end pt-2">
          {user.emailAuthorized ? (
            <Button variant="danger" size="sm" onClick={() => updateEmailAuthorization(false)}>
              Revoke Email Read Access
            </Button>
          ) : (
            <Button variant="whitePill" size="sm" onClick={() => updateEmailAuthorization(true)}>
              Grant Read-Only Email Access
            </Button>
          )}
        </div>
      </Card>

      {/* CONNECTED ACCOUNTS */}
      <Card className="p-6 space-y-4 bg-[#1A1A1A] border-white/12">
        <h3 className="font-bold text-base text-white">Connected OAuth Providers</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-white/10">
            <span className="font-semibold text-white">Google Account ({user.email})</span>
            <Badge variant="success" size="sm">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-white/10">
            <span className="font-semibold text-white">LinkedIn Account</span>
            <Badge variant="success" size="sm">Connected</Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111111] border border-white/10">
            <span className="font-semibold text-white">GitHub Account</span>
            <Badge variant="success" size="sm">Connected</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

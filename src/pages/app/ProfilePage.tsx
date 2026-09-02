import React from 'react';
import { useWorkflow } from '../../context/WorkflowContext';
import { Card, Button, Badge, Input } from '../../components/ui';
import { User as UserIcon, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Save } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile } = useWorkflow();

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-white font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Profile</h1>
          <p className="text-xs text-neutral-400 mt-1">Structured Profile Database record feeding all downstream AI agents.</p>
        </div>
      </div>

      <Card className="p-8 space-y-6 bg-[#1A1A1A] border-white/12">
        <div className="flex items-center gap-4 border-b border-white/12 pb-6">
          <img src={user.avatarUrl} alt="User" className="w-16 h-16 rounded-2xl border-2 border-white/20 object-cover" />
          <div>
            <h2 className="text-xl font-bold text-white">{user.name}</h2>
            <p className="text-xs text-neutral-300 font-semibold">{profile.headline}</p>
            <p className="text-xs text-neutral-400">{user.email} • {profile.location}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Full Name</label>
            <Input value={user.name} readOnly />
          </div>
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Phone Number</label>
            <Input value={profile.phone} readOnly />
          </div>
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Location</label>
            <Input value={profile.location} readOnly />
          </div>
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Preferred Work Mode</label>
            <Input value={profile.preferences.workMode} readOnly />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-2">Verified Technical Skills</label>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s, i) => (
              <span key={i} className="px-3 py-1.5 rounded-lg bg-[#111111] text-white border border-white/12 font-mono text-xs font-semibold">
                {s}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

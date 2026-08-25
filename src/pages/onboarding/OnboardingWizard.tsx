import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Progress, AgentBadge } from '../../components/ui';
import {
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Briefcase,
  MapPin,
  DollarSign,
  Building2,
  X,
  AlertCircle
} from 'lucide-react';
import { useWorkflow } from '../../context/WorkflowContext';

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { uploadAndAnalyzeResume, updateProfile, profile, isLoading } = useWorkflow();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Preference Form State
  const [targetRoles, setTargetRoles] = useState('Frontend Engineer, Full Stack Developer, AI Platform Engineer');
  const [preferredLocation, setPreferredLocation] = useState('San Francisco, CA / Remote');
  const [workMode, setWorkMode] = useState<'REMOTE' | 'HYBRID' | 'ONSITE'>('HYBRID');
  const [experienceLevel, setExperienceLevel] = useState<'ENTRY' | 'MID' | 'SENIOR'>('ENTRY');
  const [targetCompanies, setTargetCompanies] = useState('Anthropic, Vercel, Stripe, Figma, Google');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const simulateUpload = () => {
    if (!selectedFile) return;
    setUploadProgress(20);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStep(2);
          return 100;
        }
        return prev + 40;
      });
    }, 300);
  };

  const handleSavePreferences = async () => {
    updateProfile({
      preferences: {
        targetRoles: targetRoles.split(',').map(s => s.trim()),
        preferredLocation,
        workMode: workMode as any,
        experienceLevel: experienceLevel as any,
        minSalary: 110000,
        maxSalary: 150000,
        targetCompanies: targetCompanies.split(',').map(s => s.trim())
      }
    });

    setStep(3);
    // Run AG-001 Resume Analysis
    await uploadAndAnalyzeResume(selectedFile || 'Sri_Saketh_Software_Engineer_Resume.pdf');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-brand-500 selection:text-white">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold text-xl flex items-center justify-center font-outfit shadow-md shadow-brand-500/20">
              AI
            </div>
            <span className="font-bold text-2xl font-outfit text-slate-900">AI Career <span className="text-brand-600">OS</span></span>
          </div>
          <h2 className="text-2xl font-bold font-outfit text-slate-900">Welcome! Let's set up your profile</h2>
          <p className="text-sm text-slate-500 mt-1">AG-001 Resume Analysis will build your structured profile in seconds.</p>

          {/* Progress Bar */}
          <div className="flex items-center justify-center gap-2 mt-6 max-w-md mx-auto">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
            <div className={`flex-1 h-2 rounded-full ${step >= 3 ? 'bg-brand-600' : 'bg-slate-200'}`}></div>
          </div>
        </div>

        <Card className="p-8 shadow-xl border-slate-200">
          {/* STEP 1: RESUME UPLOAD */}
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold font-outfit text-slate-900">Upload Your Resume</h3>
                  <p className="text-xs text-slate-500">Supports PDF, DOC, DOCX, or Image formats</p>
                </div>
                <AgentBadge code="AG-001" name="Resume Analysis" />
              </div>

              {!selectedFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all ${
                    dragActive ? 'border-brand-500 bg-brand-50/50 scale-[0.99]' : 'border-slate-300 hover:border-brand-400 bg-slate-50/50'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1 font-outfit">Drag & Drop your resume here</h4>
                  <p className="text-xs text-slate-400 mb-6">PDF, DOCX, or Image (Max 10MB)</p>
                  
                  <label className="cursor-pointer">
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-md shadow-brand-500/20 transition-colors">
                      <FileText className="w-4 h-4" /> Browse File
                    </span>
                    <input type="file" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="hidden" />
                  </label>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm font-outfit">{selectedFile.name}</h4>
                        <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-slate-700 p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  <Button variant="gradient" className="w-full mt-2" onClick={simulateUpload}>
                    Continue to Career Preferences
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: CAREER PREFERENCES */}
          {step === 2 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold font-outfit text-slate-900">Career Preferences</h3>
                  <p className="text-xs text-slate-500">Powers AG-002 Job Search matching engine</p>
                </div>
                <AgentBadge code="AG-002" name="Job Search" />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Target Roles</label>
                  <Input
                    value={targetRoles}
                    onChange={e => setTargetRoles(e.target.value)}
                    placeholder="e.g. Frontend Engineer, Full Stack Developer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Preferred Location</label>
                    <Input
                      value={preferredLocation}
                      onChange={e => setPreferredLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Work Mode</label>
                    <select
                      value={workMode}
                      onChange={e => setWorkMode(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="HYBRID">Hybrid</option>
                      <option value="REMOTE">Remote</option>
                      <option value="ONSITE">On-site</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">Target Companies</label>
                  <Input
                    value={targetCompanies}
                    onChange={e => setTargetCompanies(e.target.value)}
                    placeholder="e.g. Anthropic, Vercel, Stripe"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  Back
                </Button>
                <Button variant="gradient" onClick={handleSavePreferences} rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Run Resume Analysis Agent
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: RESUME ANALYSIS PROCESSING & CONFIRMATION */}
          {step === 3 && (
            <div className="text-center py-8">
              {isLoading ? (
                <div>
                  <div className="w-16 h-16 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin mx-auto mb-4"></div>
                  <h3 className="text-xl font-bold font-outfit text-slate-900 mb-2">AG-001 Resume Analysis Agent Running...</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
                    Extracting skills, experience history, education entities, and structural notes into structured User Profile schema.
                  </p>
                  <AgentBadge code="AG-001" name="Structured Profile Extraction" />
                </div>
              ) : (
                <div>
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold font-outfit text-slate-900 mb-2">Profile & Resume Analysis Complete!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
                    Your structured profile is now populated with 15 verified skills, 2 education records, and work history.
                  </p>

                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={() => navigate('/app/dashboard')}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Enter Command Dashboard
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

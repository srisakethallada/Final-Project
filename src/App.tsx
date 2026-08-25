import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WorkflowProvider } from './context/WorkflowContext';

// Layouts & Landing
import { LandingPage } from './pages/landing/LandingPage';
import { AppLayout } from './components/layout/AppLayout';

// Auth Pages
import { SignInPage, SignUpPage, ForgotPasswordPage } from './pages/auth/AuthPages';

// Onboarding
import { OnboardingWizard } from './pages/onboarding/OnboardingWizard';

// App Pages
import { DashboardPage } from './pages/app/DashboardPage';
import { AIAssistantPage } from './pages/app/AIAssistantPage';
import { ResumePage } from './pages/app/ResumePage';
import { JobSearchPage } from './pages/app/JobSearchPage';
import { JDAnalysisPage } from './pages/app/JDAnalysisPage';
import { ResumeOptimizationPage } from './pages/app/ResumeOptimizationPage';
import { CoverLetterPage } from './pages/app/CoverLetterPage';
import { ApplicationsPage } from './pages/app/ApplicationsPage';
import { InterviewsPage } from './pages/app/InterviewsPage';
import { MockInterviewPage } from './pages/app/MockInterviewPage';
import { FeedbackCoachPage } from './pages/app/FeedbackCoachPage';
import { NotificationsPage } from './pages/app/NotificationsPage';
import { ProfilePage } from './pages/app/ProfilePage';
import { SettingsPage } from './pages/app/SettingsPage';

export const App: React.FC = () => {
  return (
    <WorkflowProvider>
      <Router>
        <Routes>
          {/* Public Landing */}
          <Route path="/" element={<LandingPage />} />

          {/* Authentication Routes */}
          <Route path="/auth/signin" element={<SignInPage />} />
          <Route path="/auth/signup" element={<SignUpPage />} />
          <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />

          {/* Onboarding Wizard */}
          <Route path="/onboarding" element={<OnboardingWizard />} />

          {/* Authenticated Application Workspace */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="assistant" element={<AIAssistantPage />} />
            <Route path="resume" element={<ResumePage />} />
            <Route path="resume/analysis" element={<ResumePage />} />
            <Route path="resume/optimize" element={<ResumeOptimizationPage />} />
            <Route path="jobs" element={<JobSearchPage />} />
            <Route path="jobs/:jobId/analysis" element={<JDAnalysisPage />} />
            <Route path="cover-letter" element={<CoverLetterPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="interview-prep" element={<InterviewsPage />} />
            <Route path="mock-interview" element={<MockInterviewPage />} />
            <Route path="feedback" element={<FeedbackCoachPage />} />
            <Route path="career-coach" element={<FeedbackCoachPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </WorkflowProvider>
  );
};

export default App;

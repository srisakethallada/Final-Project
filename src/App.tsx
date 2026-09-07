import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkflowProvider } from './context/WorkflowContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Layouts & Landing
import { LandingPage } from './pages/landing/LandingPage';
import { AppLayout } from './components/layout/AppLayout';

// Auth Pages
import { SignInPage, SignUpPage, ForgotPasswordPage } from './pages/auth/AuthPages';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { EmailVerificationPage } from './pages/auth/EmailVerificationPage';
import { AuthCallbackPage } from './pages/auth/AuthCallbackPage';

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
    <AuthProvider>
      <WorkflowProvider>
        <Router>
          <Routes>
            {/* Public Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* Authentication Route Shortcuts */}
            <Route path="/signin" element={<Navigate to="/auth/signin" replace />} />
            <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
            <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Direct Authentication System Pages */}
            <Route path="/auth/signin" element={<SignInPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected Onboarding Flow */}
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingWizard />
                </ProtectedRoute>
              }
            />

            {/* Protected Application Workspace */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="assistant" element={<AIAssistantPage />} />
              <Route path="resume" element={<ResumePage />} />
              <Route path="resume/analysis" element={<ResumePage />} />
              <Route path="resume/optimize" element={<ResumeOptimizationPage />} />
              <Route path="resume-optimization" element={<Navigate to="/app/resume/optimize" replace />} />
              <Route path="jobs" element={<JobSearchPage />} />
              <Route path="job-search" element={<Navigate to="/app/jobs" replace />} />
              <Route path="jobs/analysis" element={<JDAnalysisPage />} />
              <Route path="jd-analysis" element={<Navigate to="/app/jobs/analysis" replace />} />
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
    </AuthProvider>
  );
};

export default App;

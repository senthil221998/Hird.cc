import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { ResultsPage } from './components/ResultsPage';
import { AuthGateModal } from './components/AuthGateModal';
import { MyProfile } from './components/MyProfile';
import { ProfileCompletionModal } from './components/ProfileCompletionModal';
import { AnalysisResult, TailoredResume } from './types';
import { generateResumePDF, generateFilename } from './utils/pdfGenerator';
import { TemplateId } from './utils/resumeTemplates';
import { supabase } from './lib/supabase';

type AppState = 'landing' | 'results' | 'profile';

function AppContent() {
  const { user, userProfile, loading } = useAuth();
  const [appState, setAppState] = useState<AppState>('landing');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [pendingResume, setPendingResume] = useState<TailoredResume | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('corporate');
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);

  useEffect(() => {
    if (!loading && userProfile) {
      const isMandatoryComplete =
        userProfile.first_name &&
        userProfile.last_name &&
        userProfile.phone_number &&
        userProfile.professional_summary &&
        userProfile.experiences.length > 0 &&
        userProfile.education.length > 0 &&
        userProfile.skills.length > 0;

      if (!isMandatoryComplete) {
        setShowProfileCompletion(true);
      }
    }
  }, [userProfile, loading]);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setAppState('results');
  };

  const handleBack = () => {
    setAppState('landing');
    setAnalysisResult(null);
  };

  const downloadPDF = async (resume: TailoredResume, templateId: TemplateId) => {
    const pdf = await generateResumePDF(resume, templateId);
    const filename = generateFilename(resume);
    pdf.save(filename);

    if (user) {
      await supabase
        .from('users')
        .update({
          number_of_resumes_generated: (userProfile?.number_of_resumes_generated || 0) + 1,
        })
        .eq('id', user.id);
    }
  };

  useEffect(() => {
    if (user && !loading) {
      const pendingDownload = sessionStorage.getItem('pendingDownload');
      if (pendingDownload) {
        const { resume, templateId } = JSON.parse(pendingDownload);
        sessionStorage.removeItem('pendingDownload');
        downloadPDF(resume, templateId);
      }
    }
  }, [user, loading]);

  const handleDownloadRequest = async (resume: TailoredResume, templateId: TemplateId) => {
    if (user) {
      await downloadPDF(resume, templateId);
    } else {
      sessionStorage.setItem('pendingDownload', JSON.stringify({ resume, templateId }));
      setPendingResume(resume);
      setSelectedTemplate(templateId);
    }
  };

  const handleNavigate = (page: 'home' | 'profile') => {
    if (page === 'home') {
      setAppState('landing');
    } else if (page === 'profile') {
      setAppState('profile');
    }
  };

  const handleCompleteProfile = () => {
    setShowProfileCompletion(false);
    setAppState('profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className={!user && !loading ? 'blur-sm pointer-events-none' : ''}>
        <Header onNavigate={handleNavigate} />

        {appState === 'landing' && (
          <LandingPage
            onAnalysisComplete={handleAnalysisComplete}
            user={useAuth().user}
            userProfile={userProfile}
            onNavigateToProfile={() => setAppState('profile')}
          />
        )}

        {appState === 'results' && analysisResult && (
          <ResultsPage
            result={analysisResult}
            onBack={handleBack}
            onDownload={handleDownloadRequest}
          />
        )}

        {appState === 'profile' && <MyProfile />}

        {showProfileCompletion && (
          <ProfileCompletionModal onComplete={handleCompleteProfile} />
        )}
      </div>

      {!user && !loading && <AuthGateModal />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

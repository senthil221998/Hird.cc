import { useState } from 'react';
import { Upload, FileText, Loader2, User as UserIcon } from 'lucide-react';
import { extractTextFromFile } from '../utils/fileParser';
import { AnalysisResult, UserProfile } from '../types';
import { User } from '@supabase/supabase-js';

interface LandingPageProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  user: User | null;
  userProfile: UserProfile | null;
  onNavigateToProfile: () => void;
}

type ResumeSource = 'upload' | 'profile';

export function LandingPage({ onAnalysisComplete, user, userProfile, onNavigateToProfile }: LandingPageProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [resumeSource, setResumeSource] = useState<ResumeSource>('upload');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (
        validTypes.includes(file.type) ||
        file.name.toLowerCase().endsWith('.pdf') ||
        file.name.toLowerCase().endsWith('.docx')
      ) {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please upload a PDF or DOCX file');
        setSelectedFile(null);
      }
    }
  };

  const isProfileComplete = () => {
    if (!userProfile) return false;
    return !!(
      userProfile.first_name &&
      userProfile.last_name &&
      userProfile.phone_number &&
      userProfile.professional_summary &&
      userProfile.experiences.length > 0 &&
      userProfile.education.length > 0 &&
      userProfile.skills.length > 0
    );
  };

  const canGenerate = () => {
    if (!jobDescription.trim()) return false;

    if (resumeSource === 'upload') {
      return !!selectedFile;
    } else {
      return isProfileComplete();
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    if (resumeSource === 'upload' && !selectedFile) {
      setError('Please upload your resume');
      return;
    }

    if (resumeSource === 'profile' && !isProfileComplete()) {
      setError('Please complete your profile to use this option');
      return;
    }

    setIsAnalyzing(true);
    setError('');

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      let payload: any = {
        jobDescription: jobDescription.trim(),
        resume_source: resumeSource,
      };

      if (resumeSource === 'upload') {
        const resumeText = await extractTextFromFile(selectedFile!);
        payload.resumeText = resumeText;
      } else if (resumeSource === 'profile' && userProfile) {
        payload.profile_data = {
          first_name: userProfile.first_name,
          last_name: userProfile.last_name,
          email: userProfile.email,
          phone_number: userProfile.phone_number,
          linkedin_url: userProfile.linkedin_url || '',
          website_url: userProfile.website_url || '',
          profile_picture: userProfile.profile_picture || '',
          professional_summary: userProfile.professional_summary,
          experience: userProfile.experiences.map((exp) => ({
            company_name: exp.company_name,
            role_title: exp.role_title,
            start_date: exp.start_date,
            end_date: exp.end_date,
            location: exp.location || '',
            responsibilities: exp.responsibilities,
          })),
          education: userProfile.education.map((edu) => ({
            school_name: edu.school_name,
            degree: edu.degree,
            start_date: edu.start_date,
            end_date: edu.end_date,
            field_of_study: edu.field_of_study || '',
          })),
          skills: userProfile.skills,
          certifications: (userProfile.certifications || []).map((cert) => ({
            name: cert.certificate_name,
            organization: cert.issuing_organization,
            year: cert.year_of_completion.toString(),
          })),
        };
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/analyze-resume`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze resume');
      }

      const result: AnalysisResult = await response.json();
      onAnalysisComplete(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tailor Your Resume
          </h1>
          <p className="text-xl text-slate-600">
            Match your resume to any job description with AI
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Paste Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-48 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-slate-800 placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-4">
              Resume Source
            </label>

            {user ? (
              <div className="space-y-3">
                <div
                  onClick={() => setResumeSource('upload')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    resumeSource === 'upload'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        resumeSource === 'upload'
                          ? 'border-blue-500'
                          : 'border-slate-300'
                      }`}
                    >
                      {resumeSource === 'upload' && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-800">
                          Upload Resume (PDF / DOCX)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setResumeSource('profile')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    resumeSource === 'profile'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        resumeSource === 'profile'
                          ? 'border-blue-500'
                          : 'border-slate-300'
                      }`}
                    >
                      {resumeSource === 'profile' && (
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-slate-600" />
                        <span className="font-medium text-slate-800">
                          Use Data from "My Profile"
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 border-2 border-slate-300 rounded-lg">
                <div className="flex items-center gap-2">
                  <Upload className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-800">
                    Upload Resume (PDF / DOCX)
                  </span>
                </div>
              </div>
            )}

            {resumeSource === 'upload' && (
              <div className="relative mt-4">
                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                  id="resume-upload"
                />
                <label
                  htmlFor="resume-upload"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition-colors"
                >
                  <div className="text-center">
                    {selectedFile ? (
                      <>
                        <FileText className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                        <p className="text-sm font-medium text-slate-700">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
                        <p className="text-sm font-medium text-slate-700">
                          Upload your resume file
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Click to browse files
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
            )}

            {resumeSource === 'profile' && user && !isProfileComplete() && (
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800 mb-3">
                  Please complete your My Profile to use this option.
                </p>
                <button
                  onClick={onNavigateToProfile}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                >
                  Go to My Profile
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !canGenerate()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Resume'
            )}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>
            Your resume will be analyzed using AI to match the job description.
          </p>
          <p className="mt-1">No data is stored without your permission.</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Download, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { AnalysisResult, Experience, TailoredResume, Education, Project, Certification } from '../types';
import { TemplateId } from '../utils/resumeTemplates';
import { TemplateSelector } from './TemplateSelector';
import { TemplatePreviewPage } from './TemplatePreviewPage';

interface ResultsPageProps {
  result: AnalysisResult;
  onBack: () => void;
  onDownload: (resume: TailoredResume, templateId: TemplateId) => void;
}

export function ResultsPage({ result, onBack, onDownload }: ResultsPageProps) {
  const [editedResume, setEditedResume] = useState<TailoredResume>(
    result.tailored_resume
  );
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('corporate');
  const [showingPreview, setShowingPreview] = useState<TemplateId | null>(null);

  const handleSummaryChange = (value: string) => {
    setEditedResume({ ...editedResume, summary: value });
  };

  const handleExperienceBulletChange = (
    expIndex: number,
    bulletIndex: number,
    value: string
  ) => {
    const newExperience = [...editedResume.experience];
    newExperience[expIndex].bullets[bulletIndex] = value;
    setEditedResume({ ...editedResume, experience: newExperience });
  };

  const handleAddExperienceBullet = (expIndex: number) => {
    const newExperience = [...editedResume.experience];
    newExperience[expIndex].bullets.push('');
    setEditedResume({ ...editedResume, experience: newExperience });
  };

  const handleRemoveExperienceBullet = (expIndex: number, bulletIndex: number) => {
    const newExperience = [...editedResume.experience];
    newExperience[expIndex].bullets.splice(bulletIndex, 1);
    setEditedResume({ ...editedResume, experience: newExperience });
  };

  const handleSkillChange = (type: 'technical' | 'soft', value: string) => {
    const skills = value.split(',').map((s) => s.trim()).filter(Boolean);
    setEditedResume({
      ...editedResume,
      skills: { ...editedResume.skills, [type]: skills },
    });
  };

  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...(editedResume.education || [])];
    newEducation[index] = { ...newEducation[index], [field]: value };
    setEditedResume({ ...editedResume, education: newEducation });
  };

  const handleAddEducation = () => {
    const newEducation = [
      ...(editedResume.education || []),
      { degree: '', institution: '', location: '', dates: '' },
    ];
    setEditedResume({ ...editedResume, education: newEducation });
  };

  const handleRemoveEducation = (index: number) => {
    const newEducation = [...(editedResume.education || [])];
    newEducation.splice(index, 1);
    setEditedResume({ ...editedResume, education: newEducation });
  };

  const handleProjectChange = (index: number, field: keyof Project, value: string) => {
    const newProjects = [...(editedResume.projects || [])];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setEditedResume({ ...editedResume, projects: newProjects });
  };

  const handleAddProject = () => {
    const newProjects = [
      ...(editedResume.projects || []),
      { title: '', description: '' },
    ];
    setEditedResume({ ...editedResume, projects: newProjects });
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = [...(editedResume.projects || [])];
    newProjects.splice(index, 1);
    setEditedResume({ ...editedResume, projects: newProjects });
  };

  const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
    const newCertifications = [...(editedResume.certifications || [])];
    newCertifications[index] = { ...newCertifications[index], [field]: value };
    setEditedResume({ ...editedResume, certifications: newCertifications });
  };

  const handleAddCertification = () => {
    const newCertifications = [
      ...(editedResume.certifications || []),
      { title: '', issuer: '', dates: '' },
    ];
    setEditedResume({ ...editedResume, certifications: newCertifications });
  };

  const handleRemoveCertification = (index: number) => {
    const newCertifications = [...(editedResume.certifications || [])];
    newCertifications.splice(index, 1);
    setEditedResume({ ...editedResume, certifications: newCertifications });
  };

  if (showingPreview) {
    return (
      <TemplatePreviewPage
        templateId={showingPreview}
        onBack={() => setShowingPreview(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-8 px-4">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Upload
        </button>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Match Score
              </h2>
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  {result.match_score.percentage}%
                </div>
                <p className="text-sm text-slate-600">
                  {result.match_score.summary}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Key Changes
              </h2>
              <ul className="space-y-2">
                {result.explanation.map((item, index) => (
                  <li key={index} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                Tailored Resume
              </h2>

              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelectTemplate={setSelectedTemplate}
                onViewTemplate={setShowingPreview}
              />

              <button
                onClick={() => onDownload(editedResume, selectedTemplate)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-2">
                  PROFESSIONAL SUMMARY
                </h3>
                <textarea
                  value={editedResume.summary}
                  onChange={(e) => handleSummaryChange(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-slate-800"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-3">
                  EXPERIENCE
                </h3>
                <div className="space-y-6">
                  {editedResume.experience.map((exp, expIndex) => (
                    <div key={expIndex} className="border-l-2 border-blue-600 pl-4">
                      <div className="font-semibold text-slate-900">
                        {exp.position}
                      </div>
                      <div className="text-sm text-slate-600 mb-3">
                        {exp.company} | {exp.duration}
                      </div>
                      <div className="space-y-2">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex gap-2">
                            <textarea
                              value={bullet}
                              onChange={(e) =>
                                handleExperienceBulletChange(
                                  expIndex,
                                  bulletIndex,
                                  e.target.value
                                )
                              }
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-slate-800"
                              rows={2}
                            />
                            <button
                              onClick={() =>
                                handleRemoveExperienceBullet(expIndex, bulletIndex)
                              }
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => handleAddExperienceBullet(expIndex)}
                          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Bullet
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-2">
                  TECHNICAL SKILLS
                </h3>
                <input
                  type="text"
                  value={editedResume.skills.technical.join(', ')}
                  onChange={(e) => handleSkillChange('technical', e.target.value)}
                  placeholder="Separate skills with commas"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-700 mb-2">
                  SOFT SKILLS
                </h3>
                <input
                  type="text"
                  value={editedResume.skills.soft.join(', ')}
                  onChange={(e) => handleSkillChange('soft', e.target.value)}
                  placeholder="Separate skills with commas"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                />
              </div>

              {(editedResume.education && editedResume.education.length > 0) && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">
                    EDUCATION
                  </h3>
                  <div className="space-y-4">
                    {editedResume.education.map((edu, index) => (
                      <div key={index} className="border border-slate-300 rounded-lg p-4">
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => handleRemoveEducation(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            placeholder="Degree"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                          />
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            placeholder="Institution"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={edu.location}
                              onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                              placeholder="Location"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                            />
                            <input
                              type="text"
                              value={edu.dates}
                              onChange={(e) => handleEducationChange(index, 'dates', e.target.value)}
                              placeholder="Dates"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleAddEducation}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Education
                    </button>
                  </div>
                </div>
              )}

              {!editedResume.education && (
                <button
                  onClick={handleAddEducation}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              )}

              {(editedResume.projects && editedResume.projects.length > 0) && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">
                    PROJECTS
                  </h3>
                  <div className="space-y-4">
                    {editedResume.projects.map((project, index) => (
                      <div key={index} className="border border-slate-300 rounded-lg p-4">
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => handleRemoveProject(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={project.title}
                            onChange={(e) => handleProjectChange(index, 'title', e.target.value)}
                            placeholder="Project Title"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                          />
                          <textarea
                            value={project.description}
                            onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                            placeholder="Project Description"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm text-slate-800"
                            rows={3}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleAddProject}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  </div>
                </div>
              )}

              {!editedResume.projects && (
                <button
                  onClick={handleAddProject}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Project
                </button>
              )}

              {(editedResume.certifications && editedResume.certifications.length > 0) && (
                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-3">
                    CERTIFICATIONS
                  </h3>
                  <div className="space-y-4">
                    {editedResume.certifications.map((cert, index) => (
                      <div key={index} className="border border-slate-300 rounded-lg p-4">
                        <div className="flex justify-end mb-2">
                          <button
                            onClick={() => handleRemoveCertification(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={cert.title}
                            onChange={(e) => handleCertificationChange(index, 'title', e.target.value)}
                            placeholder="Certification Title"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={cert.issuer}
                              onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)}
                              placeholder="Issuer"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                            />
                            <input
                              type="text"
                              value={cert.dates}
                              onChange={(e) => handleCertificationChange(index, 'dates', e.target.value)}
                              placeholder="Dates"
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-800"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleAddCertification}
                      className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus className="w-4 h-4" />
                      Add Certification
                    </button>
                  </div>
                </div>
              )}

              {!editedResume.certifications && (
                <button
                  onClick={handleAddCertification}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Certification
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

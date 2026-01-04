import { ArrowLeft } from 'lucide-react';
import { TemplateId, getDummyResume, TEMPLATES } from '../utils/resumeTemplates';
import { TemplatePreview } from './TemplatePreview';

interface TemplatePreviewPageProps {
  templateId: TemplateId;
  onBack: () => void;
}

export function TemplatePreviewPage({ templateId, onBack }: TemplatePreviewPageProps) {
  const dummyResume = getDummyResume();
  const template = TEMPLATES.find((t) => t.id === templateId);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-slate-900">{template?.name} Template</h1>
            <p className="text-sm text-slate-600">{template?.description}</p>
          </div>
          <div className="w-20"></div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white shadow-lg">
          <TemplatePreview templateId={templateId} resume={dummyResume} />
        </div>
      </div>
    </div>
  );
}

import { ExternalLink } from 'lucide-react';
import { TemplateId, TEMPLATES, getDummyResume } from '../utils/resumeTemplates';
import { TemplatePreview } from './TemplatePreview';
import { openFullPreview, getFullPreviewHTML } from '../utils/templatePreviews';

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onViewTemplate: (templateId: TemplateId) => void;
}

export function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
  onViewTemplate,
}: TemplateSelectorProps) {
  const dummyResume = getDummyResume();

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-slate-700 mb-3">SELECT TEMPLATE</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {TEMPLATES.map((template) => (
          <div
            key={template.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-300 hover:border-slate-400'
            }`}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-slate-900">{template.name}</h4>
                <p className="text-xs text-slate-600">{template.description}</p>
              </div>
              <input
                type="radio"
                checked={selectedTemplate === template.id}
                onChange={() => onSelectTemplate(template.id)}
                className="mt-1"
              />
            </div>

            <div className="bg-white border border-slate-200 rounded overflow-hidden mb-3">
              <div style={{ height: '200px', overflow: 'hidden' }}>
                <div
                  style={{
                    transform: 'scale(0.25)',
                    transformOrigin: 'top left',
                    width: '400%',
                    height: '400%',
                  }}
                  dangerouslySetInnerHTML={{ __html: getFullPreviewHTML(template.id) }}
                />
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openFullPreview(template.id);
              }}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            >
              <ExternalLink className="w-3 h-3" />
              View full template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

import { TailoredResume } from '../types';
import { TemplateId, renderTemplate } from '../utils/resumeTemplates';

interface TemplatePreviewProps {
  templateId: TemplateId;
  resume: TailoredResume;
  scale?: number;
}

export function TemplatePreview({ templateId, resume, scale = 1 }: TemplatePreviewProps) {
  const html = renderTemplate(templateId, resume);

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${100 / scale}%`,
        height: `${100 / scale}%`,
      }}
    >
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          backgroundColor: 'white',
          minHeight: '100vh',
        }}
      />
    </div>
  );
}

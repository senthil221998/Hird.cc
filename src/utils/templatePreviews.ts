import { TemplateId } from './resumeTemplates';
import modernFullPreview from '../templates/modern_full_preview.html?raw';
import corporateFullPreview from '../templates/corporate_full_preview.html?raw';
import compactFullPreview from '../templates/compact_full_preview.html?raw';

export function getFullPreviewHTML(templateId: TemplateId): string {
  switch (templateId) {
    case 'modern':
      return modernFullPreview;
    case 'corporate':
      return corporateFullPreview;
    case 'compact':
      return compactFullPreview;
    default:
      return modernFullPreview;
  }
}

export function openFullPreview(templateId: TemplateId): void {
  const html = getFullPreviewHTML(templateId);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');

  if (win) {
    win.addEventListener('load', () => {
      URL.revokeObjectURL(url);
    });
  }
}

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TailoredResume } from '../types';
import { TemplateId, renderTemplate } from './resumeTemplates';

export async function generateResumePDF(resume: TailoredResume, templateId: TemplateId = 'corporate'): Promise<jsPDF> {
  const htmlContent = renderTemplate(templateId, resume);

  const tempContainer = document.createElement('div');
  tempContainer.innerHTML = htmlContent;
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '0';
  tempContainer.style.width = '210mm';
  document.body.appendChild(tempContainer);

  const resumeElement = tempContainer.querySelector('.resume') || tempContainer;

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    await pdf.html(resumeElement as HTMLElement, {
      callback: () => {},
      x: 0,
      y: 0,
      width: 210,
      windowWidth: 800,
      html2canvas: {
        scale: 0.264583,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      },
    });

    document.body.removeChild(tempContainer);
    return pdf;
  } catch (error) {
    document.body.removeChild(tempContainer);
    throw error;
  }
}

export function generateFilename(resume: TailoredResume): string {
  const firstName = resume.header.name.split(' ')[0] || 'Resume';
  const position = resume.experience[0]?.position || 'Professional';
  const sanitizedPosition = position.replace(/[^a-zA-Z0-9]/g, '');
  return `${firstName}_${sanitizedPosition}.pdf`;
}

import { TailoredResume } from '../types';

export type TemplateId = 'corporate' | 'modern' | 'compact';

export interface ResumeTemplate {
  id: TemplateId;
  name: string;
  description: string;
}

export const TEMPLATES: ResumeTemplate[] = [
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional layout with clear sections',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design',
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'Minimalist space-efficient format',
  },
];

export function renderTemplate(templateId: TemplateId, resume: TailoredResume): string {
  switch (templateId) {
    case 'corporate':
      return renderCorporateTemplate(resume);
    case 'modern':
      return renderModernTemplate(resume);
    case 'compact':
      return renderCompactTemplate(resume);
  }
}

function renderCorporateTemplate(resume: TailoredResume): string {
  const contactInfo = [
    `Email: ${resume.header.email}`,
    `Phone: ${resume.header.phone}`,
    resume.header.linkedin ? `LinkedIn: ${resume.header.linkedin}` : null,
    resume.header.location || null
  ].filter(Boolean).join(' | ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Corporate Resume</title>
<style>
  @page {
    size: A4;
    margin: 16mm;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body { font-family: Arial, sans-serif; color: #000; margin: 0; padding: 0; }
  .resume { width: 800px; margin: 20px auto; border: 2px solid #000; padding: 30px; }
  .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
  .name { font-size: 28px; font-weight: bold; }
  .contact { font-size: 14px; margin-top: 5px; }
  .section { margin-top: 20px; }
  .section-title { font-weight: bold; font-size: 18px; border-bottom: 1px solid #000; margin-bottom: 10px; padding-bottom: 3px; }
  .job, .edu, .cert { margin-bottom: 15px; }
  ul { margin: 5px 0 0 20px; }
</style>
</head>
<body>
<div class="resume">
  <div class="header">
    <div class="name">${resume.header.name}</div>
    <div class="contact">${contactInfo}</div>
  </div>

  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p>${resume.summary}</p>
  </div>

  <div class="section">
    <div class="section-title">Experience</div>
    ${resume.experience.map(exp => `
    <div class="job">
      <strong>${exp.company}</strong> | ${exp.position} | ${exp.duration}
      <ul>
        ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
    </div>
    `).join('')}
  </div>

  ${resume.education && resume.education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${resume.education.map(edu => `
    <div class="edu">
      <strong>${edu.institution}</strong> | ${edu.degree} | ${edu.dates}${edu.location ? ` | ${edu.location}` : ''}
    </div>
    `).join('')}
  </div>
  ` : ''}

  ${resume.projects && resume.projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${resume.projects.map(project => `
    <div class="job">
      <strong>${project.title}</strong>
      <p>${project.description}</p>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Skills</div>
    <p>${[...resume.skills.technical, ...resume.skills.soft].join(', ')}</p>
  </div>

  ${resume.certifications && resume.certifications.length > 0 ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${resume.certifications.map(cert => `
    <div class="cert">
      ${cert.title} | ${cert.issuer} | ${cert.dates}
    </div>
    `).join('')}
  </div>
  ` : ''}
</div>
</body>
</html>`;
}

function renderModernTemplate(resume: TailoredResume): string {
  const contactParts = [
    resume.header.email,
    resume.header.phone,
    resume.header.linkedin ? `LinkedIn: ${resume.header.linkedin}` : null,
  ].filter(Boolean);
  const contactInfo = contactParts.join(' | ');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Modern Resume</title>
<style>
  @page {
    size: A4;
    margin: 16mm;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
    color: #1f2933;
    margin: 0;
    padding: 24px;
  }
  .resume {
    max-width: 800px;
    margin: auto;
    border: 1px solid #d1d5db;
    padding: 24px;
  }
  .header {
    border-bottom: 2px solid #3b82f6;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
  .name {
    font-size: 26px;
    font-weight: bold;
  }
  .contact {
    font-size: 12px;
    margin-top: 6px;
    color: #374151;
  }
  .section {
    margin-top: 18px;
  }
  .section-title {
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    color: #3b82f6;
    margin-bottom: 6px;
  }
  .summary {
    font-size: 13px;
    line-height: 1.5;
  }
  .item {
    margin-bottom: 12px;
  }
  .item-title {
    font-weight: bold;
    font-size: 13px;
  }
  .item-meta {
    font-size: 12px;
    color: #6b7280;
  }
  ul {
    margin: 6px 0 0 16px;
    padding: 0;
  }
  li {
    font-size: 12.5px;
    margin-bottom: 4px;
  }
  .skills {
    font-size: 12.5px;
  }
</style>
</head>
<body>
<div class="resume">
  <div class="header">
    <div class="name">${resume.header.name}</div>
    <div class="contact">${contactInfo}</div>
  </div>

  <div class="section">
    <div class="section-title">Professional Summary</div>
    <div class="summary">${resume.summary}</div>
  </div>

  <div class="section">
    <div class="section-title">Professional Experience</div>
    ${resume.experience.map(exp => `
    <div class="item">
      <div class="item-title">${exp.position} — ${exp.company}</div>
      <div class="item-meta">${exp.duration}</div>
      <ul>
        ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
    </div>
    `).join('')}
  </div>

  ${resume.education && resume.education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${resume.education.map(edu => `
    <div class="item">
      <div class="item-title">${edu.degree}</div>
      <div class="item-meta">${edu.institution}${edu.location ? `, ${edu.location}` : ''} | ${edu.dates}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  ${resume.projects && resume.projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${resume.projects.map(project => `
    <div class="item">
      <div class="item-title">${project.title}</div>
      <div class="item-meta">${project.description}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills">${[...resume.skills.technical, ...resume.skills.soft].join(', ')}</div>
  </div>

  ${resume.certifications && resume.certifications.length > 0 ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${resume.certifications.map(cert => `
    <div class="item">
      <div class="item-title">${cert.title}</div>
      <div class="item-meta">${cert.issuer} | ${cert.dates}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}
</div>
</body>
</html>`;
}

function renderCompactTemplate(resume: TailoredResume): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Compact Resume</title>
<style>
  @page {
    size: A4;
    margin: 16mm;
  }

  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: Arial, Helvetica, sans-serif;
    background: #ffffff;
    color: #111827;
    margin: 0;
    padding: 16px;
  }
  .resume {
    max-width: 780px;
    margin: auto;
    border: 1px solid #9ca3af;
    padding: 16px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #10b981;
    padding-bottom: 8px;
  }
  .name {
    font-size: 22px;
    font-weight: bold;
  }
  .contact {
    font-size: 11px;
    text-align: right;
    color: #374151;
  }
  .section {
    margin-top: 12px;
  }
  .section-title {
    font-size: 12px;
    font-weight: bold;
    color: #10b981;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
  .summary {
    font-size: 12px;
    line-height: 1.4;
  }
  .item {
    margin-bottom: 8px;
  }
  .item-title {
    font-size: 12px;
    font-weight: bold;
  }
  .item-meta {
    font-size: 11px;
    color: #6b7280;
  }
  ul {
    margin: 4px 0 0 14px;
    padding: 0;
  }
  li {
    font-size: 11.5px;
    margin-bottom: 2px;
  }
  .skills {
    font-size: 11.5px;
  }
</style>
</head>
<body>
<div class="resume">
  <div class="header">
    <div class="name">${resume.header.name}</div>
    <div class="contact">
      ${resume.header.email}<br/>
      ${resume.header.phone}${resume.header.linkedin ? `<br/>${resume.header.linkedin}` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Summary</div>
    <div class="summary">${resume.summary}</div>
  </div>

  <div class="section">
    <div class="section-title">Experience</div>
    ${resume.experience.map(exp => `
    <div class="item">
      <div class="item-title">${exp.position} — ${exp.company}</div>
      <div class="item-meta">${exp.duration}</div>
      <ul>
        ${exp.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
    </div>
    `).join('')}
  </div>

  ${resume.education && resume.education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${resume.education.map(edu => `
    <div class="item">
      <div class="item-title">${edu.degree}</div>
      <div class="item-meta">${edu.institution}${edu.location ? `, ${edu.location}` : ''} | ${edu.dates}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  ${resume.projects && resume.projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${resume.projects.map(project => `
    <div class="item">
      <div class="item-title">${project.title}</div>
      <div class="item-meta">${project.description}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="section">
    <div class="section-title">Skills</div>
    <div class="skills">${[...resume.skills.technical, ...resume.skills.soft].join(', ')}</div>
  </div>

  ${resume.certifications && resume.certifications.length > 0 ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${resume.certifications.map(cert => `
    <div class="item">
      <div class="item-title">${cert.title}</div>
      <div class="item-meta">${cert.issuer} | ${cert.dates}</div>
    </div>
    `).join('')}
  </div>
  ` : ''}
</div>
</body>
</html>`;
}

export function getDummyResume(): TailoredResume {
  return {
    header: {
      name: 'Senthil Kumar',
      email: 'senthil@email.com',
      phone: '+49 XXXXXXXX',
      location: 'Berlin, Germany',
      linkedin: 'linkedin.com/in/senthilkumar',
    },
    summary: 'Experienced project coordinator with exposure to HVDC offshore wind projects, reporting, and stakeholder coordination. Detail-oriented professional with strong analytical and communication skills.',
    experience: [
      {
        company: 'GE Vernova',
        position: 'Project Reporting Coordinator',
        duration: 'Apr 2025 – Present',
        bullets: [
          'Coordinated reporting activities for HVDC projects.',
          'Prepared management dashboards and progress reports.',
          'Supported coordination across consortium partners.',
        ],
      },
    ],
    skills: {
      technical: ['HVDC', 'Project Reporting', 'Power BI', 'Excel', 'MS Project'],
      soft: ['Stakeholder Coordination', 'Communication', 'Problem Solving'],
    },
    education: [
      {
        degree: 'B.Tech – Electrical Engineering',
        institution: 'Anna University',
        location: 'Chennai, India',
        dates: '2018 – 2022',
      },
    ],
    projects: [
      {
        title: 'HVDC Offshore Wind Study',
        description: 'Analysis of offshore transmission systems and cost optimization strategies for renewable energy integration.',
      },
      {
        title: 'AI Resume Optimization Tool (hird.cc)',
        description: 'Built an AI-powered resume tailoring and job matching platform to help job seekers optimize their applications.',
      },
    ],
    certifications: [
      {
        title: 'PMP (In Progress)',
        issuer: 'PMI',
        dates: 'Expected 2025',
      },
    ],
  };
}

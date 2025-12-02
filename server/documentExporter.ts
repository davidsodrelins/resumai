import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, UnderlineType } from 'docx';
import PDFDocument from 'pdfkit';
import { ProcessedResumeData } from './resumeProcessor';

/**
 * Generate DOCX document from resume data
 */
export async function generateDOCX(resumeData: ProcessedResumeData): Promise<Buffer> {
  const sections: Paragraph[] = [];

  // Personal Information Header
  if (resumeData.personalInfo.fullName) {
    sections.push(
      new Paragraph({
        text: resumeData.personalInfo.fullName,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      })
    );
  }

  // Contact Information
  const contactInfo: string[] = [];
  if (resumeData.personalInfo.email) contactInfo.push(resumeData.personalInfo.email);
  if (resumeData.personalInfo.phone) contactInfo.push(resumeData.personalInfo.phone);
  if (resumeData.personalInfo.location) contactInfo.push(resumeData.personalInfo.location);
  if (resumeData.personalInfo.linkedin) contactInfo.push(resumeData.personalInfo.linkedin);
  if (resumeData.personalInfo.website) contactInfo.push(resumeData.personalInfo.website);

  if (contactInfo.length > 0) {
    sections.push(
      new Paragraph({
        text: contactInfo.join(' | '),
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );
  }

  // Professional Summary
  if (resumeData.personalInfo.summary) {
    sections.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: resumeData.personalInfo.summary,
        spacing: { after: 200 }
      })
    );
  }

  // Work Experience
  if (resumeData.experience.length > 0) {
    sections.push(
      new Paragraph({
        text: 'WORK EXPERIENCE',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 }
      })
    );

    resumeData.experience.forEach((exp) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true }),
            new TextRun({ text: ` - ${exp.company}` })
          ],
          spacing: { before: 100 }
        }),
        new Paragraph({  
          children: [
            new TextRun({ text: `${exp.startDate} - ${exp.endDate || 'Present'}`, italics: true })
          ],
          spacing: { after: 50 }
        }),
        new Paragraph({
          text: exp.description,
          spacing: { after: 50 }
        })
      );

      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          sections.push(
            new Paragraph({
              text: `• ${achievement}`,
              spacing: { before: 50 }
            })
          );
        });
        sections.push(new Paragraph({ text: '', spacing: { after: 100 } }));
      }
    });
  }

  // Education
  if (resumeData.education.length > 0) {
    sections.push(
      new Paragraph({
        text: 'EDUCATION',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 }
      })
    );

    resumeData.education.forEach((edu) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.degree, bold: true }),
            edu.field ? new TextRun({ text: ` in ${edu.field}` }) : new TextRun({ text: '' })
          ],
          spacing: { before: 100 }
        }),
        new Paragraph({
          text: edu.institution,
          spacing: { after: 50 }
        })
      );

      if (edu.startDate || edu.endDate) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${edu.startDate || ''} - ${edu.endDate || 'Present'}`, italics: true })
            ],
            spacing: { after: 50 }
          })
        );
      }

      if (edu.description) {
        sections.push(
          new Paragraph({
            text: edu.description,
            spacing: { after: 100 }
          })
        );
      }
    });
  }

  // Skills
  if (resumeData.skills.length > 0) {
    sections.push(
      new Paragraph({
        text: 'SKILLS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 }
      })
    );

    resumeData.skills.forEach((skillCategory) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${skillCategory.category}: `, bold: true }),
            new TextRun({ text: skillCategory.items.join(', ') })
          ],
          spacing: { after: 50 }
        })
      );
    });
  }

  // Languages
  if (resumeData.languages.length > 0) {
    sections.push(
      new Paragraph({
        text: 'LANGUAGES',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 }
      })
    );

    resumeData.languages.forEach((lang) => {
      sections.push(
        new Paragraph({
          text: `${lang.language}: ${lang.proficiency}`,
          spacing: { after: 50 }
        })
      );
    });
  }

  // Certifications
  if (resumeData.certifications.length > 0) {
    sections.push(
      new Paragraph({
        text: 'CERTIFICATIONS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 }
      })
    );

    resumeData.certifications.forEach((cert) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true }),
            new TextRun({ text: ` - ${cert.issuer}` }),
            cert.date ? new TextRun({ text: ` (${cert.date})` }) : new TextRun({ text: '' })
          ],
          spacing: { after: 50 }
        })
      );
    });
  }

  // Projects
  if (resumeData.projects.length > 0) {
    sections.push(
      new Paragraph({
        text: 'PROJECTS',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 200, after: 100 }
      })
    );

    resumeData.projects.forEach((project) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({ text: project.name, bold: true })
          ],
          spacing: { before: 100 }
        }),
        new Paragraph({
          text: project.description,
          spacing: { after: 50 }
        })
      );

      if (project.technologies && project.technologies.length > 0) {
        sections.push(
          new Paragraph({
            children: [
              new TextRun({ text: `Technologies: ${project.technologies.join(', ')}`, italics: true })
            ],
            spacing: { after: 100 }
          })
        );
      }
    });
  }

  // Additional Sections
  if (resumeData.additionalSections.length > 0) {
    resumeData.additionalSections.forEach((section) => {
      sections.push(
        new Paragraph({
          text: section.title.toUpperCase(),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: section.content,
          spacing: { after: 200 }
        })
      );
    });
  }

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: sections
      }
    ]
  });

  return await Packer.toBuffer(doc);
}

/**
 * Generate PDF document from resume data
 */
export async function generatePDF(resumeData: ProcessedResumeData, template: 'classic' | 'modern' | 'minimal' | 'executive' | 'creative' = 'classic'): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Define color palettes matching ResumePreview.tsx
    const colors = {
      classic: {
        header: '#f1f5f9', // slate-100 (bg-slate-100)
        headerText: '#0f172a', // slate-900 (text-slate-900)
        section: '#0f172a', // slate-900 (text-slate-900)
        accent: '#334155', // slate-700 (text-slate-700)
        text: '#334155' // slate-700
      },
      modern: {
        header: '#3b82f6', // blue-500 (from-blue-500)
        headerText: '#ffffff', // white
        section: '#2563eb', // blue-600 (text-blue-600)
        accent: '#2563eb', // blue-600 (text-blue-600)
        text: '#334155' // slate-700
      },
      minimal: {
        header: '#ffffff', // white (bg-white)
        headerText: '#0f172a', // slate-900 (text-slate-900)
        section: '#1e293b', // slate-800 (text-slate-800)
        accent: '#1e293b', // slate-800 (text-slate-800)
        text: '#475569' // slate-600
      },
      executive: {
        header: '#1e293b', // slate-800 (bg-slate-800)
        headerText: '#ffffff', // white
        section: '#0f172a', // slate-900 (text-slate-900)
        accent: '#d97706', // amber-600 (text-amber-600)
        text: '#334155' // slate-700
      },
      creative: {
        header: '#ec4899', // pink-500 (from-pink-500)
        headerText: '#ffffff', // white
        section: '#a855f7', // purple-500 (text-purple-600 approximation)
        accent: '#a855f7', // purple-500 (text-purple-600)
        text: '#334155' // slate-700
      }
    };

    const palette = colors[template];

    // Personal Information Header with colored background
    if (resumeData.personalInfo.fullName) {
      // Draw colored header background FIRST
      doc.rect(0, 0, doc.page.width, 120).fill(palette.header);
      
      // Then draw text on top
      doc.fillColor(palette.headerText);
      doc.fontSize(24).font('Helvetica-Bold').text(resumeData.personalInfo.fullName, 50, 30, { align: 'center' });
      doc.moveDown(0.5);
    }

    // Contact Information
    const contactInfo: string[] = [];
    if (resumeData.personalInfo.email) contactInfo.push(resumeData.personalInfo.email);
    if (resumeData.personalInfo.phone) contactInfo.push(resumeData.personalInfo.phone);
    if (resumeData.personalInfo.location) contactInfo.push(resumeData.personalInfo.location);

    if (contactInfo.length > 0) {
      doc.fontSize(10).font('Helvetica').fillColor(palette.headerText).text(contactInfo.join(' | '), { align: 'center' });
    }

    if (resumeData.personalInfo.linkedin || resumeData.personalInfo.website) {
      const links: string[] = [];
      if (resumeData.personalInfo.linkedin) links.push(resumeData.personalInfo.linkedin);
      if (resumeData.personalInfo.website) links.push(resumeData.personalInfo.website);
      doc.fontSize(10).font('Helvetica').fillColor(palette.headerText).text(links.join(' | '), { align: 'center' });
    }

    // Reset to black text for body
    doc.fillColor(palette.text);
    doc.moveDown(2);

    // Professional Summary
    if (resumeData.personalInfo.summary) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor(palette.section).text('PROFESSIONAL SUMMARY');
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica').fillColor(palette.text).text(resumeData.personalInfo.summary, { align: 'justify' });
      doc.moveDown(1);
    }

    // Work Experience
    if (resumeData.experience.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor(palette.section).text('WORK EXPERIENCE');
      doc.moveDown(0.5);

      resumeData.experience.forEach((exp, index) => {
        doc.fontSize(12).font('Helvetica-Bold').fillColor(palette.accent).text(`${exp.position} - ${exp.company}`);
        doc.fontSize(10).font('Helvetica-Oblique').fillColor(palette.text).text(`${exp.startDate} - ${exp.endDate || 'Present'}`);
        doc.moveDown(0.3);
        doc.fontSize(10).font('Helvetica').fillColor(palette.text).text(exp.description, { align: 'justify' });

        if (exp.achievements && exp.achievements.length > 0) {
          doc.moveDown(0.3);
          exp.achievements.forEach((achievement) => {
            doc.fontSize(10).font('Helvetica').text(`• ${achievement}`, { indent: 20 });
          });
        }

        if (index < resumeData.experience.length - 1) {
          doc.moveDown(0.8);
        }
      });

      doc.moveDown(1);
    }

    // Education
    if (resumeData.education.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor(palette.section).text('EDUCATION');
      doc.moveDown(0.5);

      resumeData.education.forEach((edu) => {
        const degreeText = edu.field ? `${edu.degree} in ${edu.field}` : edu.degree;
        doc.fontSize(12).font('Helvetica-Bold').fillColor(palette.accent).text(degreeText);
        doc.fontSize(10).font('Helvetica').fillColor(palette.text).text(edu.institution);

        if (edu.startDate || edu.endDate) {
          doc.fontSize(10).font('Helvetica-Oblique').text(`${edu.startDate || ''} - ${edu.endDate || 'Present'}`);
        }

        if (edu.description) {
          doc.moveDown(0.3);
          doc.fontSize(10).font('Helvetica').text(edu.description, { align: 'justify' });
        }

        doc.moveDown(0.5);
      });

      doc.moveDown(0.5);
    }

    // Skills
    if (resumeData.skills.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor(palette.section).text('SKILLS');
      doc.moveDown(0.5);

      resumeData.skills.forEach((skillCategory) => {
        doc.fontSize(10).font('Helvetica-Bold').fillColor(palette.accent).text(`${skillCategory.category}: `, { continued: true });
        doc.font('Helvetica').fillColor(palette.text).text(skillCategory.items.join(', '));
      });

      doc.moveDown(1);
    }

    // Languages
    if (resumeData.languages.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor(palette.section).text('LANGUAGES');
      doc.moveDown(0.5);

      resumeData.languages.forEach((lang) => {
        doc.fontSize(10).font('Helvetica').fillColor(palette.text).text(`${lang.language}: ${lang.proficiency}`);
      });

      doc.moveDown(1);
    }

    // Certifications
    if (resumeData.certifications.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor(palette.section).text('CERTIFICATIONS');
      doc.moveDown(0.5);

      resumeData.certifications.forEach((cert) => {
        const certText = cert.date ? `${cert.name} - ${cert.issuer} (${cert.date})` : `${cert.name} - ${cert.issuer}`;
        doc.fontSize(10).font('Helvetica').fillColor(palette.text).text(certText);
      });

      doc.moveDown(1);
    }

    // Projects
    if (resumeData.projects.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold').fillColor(palette.section).text('PROJECTS');
      doc.moveDown(0.5);

      resumeData.projects.forEach((project) => {
        doc.fontSize(11).font('Helvetica-Bold').fillColor(palette.accent).text(project.name);
        doc.fontSize(10).font('Helvetica').fillColor(palette.text).text(project.description, { align: 'justify' });

        if (project.technologies && project.technologies.length > 0) {
          doc.fontSize(10).font('Helvetica-Oblique').fillColor(palette.text).text(`Technologies: ${project.technologies.join(', ')}`);
        }

        doc.moveDown(0.5);
      });

      doc.moveDown(0.5);
    }

    // Additional Sections
    if (resumeData.additionalSections.length > 0) {
      resumeData.additionalSections.forEach((section) => {
        doc.fontSize(14).font('Helvetica-Bold').fillColor(palette.section).text(section.title.toUpperCase());
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica').fillColor(palette.text).text(section.content, { align: 'justify' });
        doc.moveDown(1);
      });
    }

    doc.end();
  });
}

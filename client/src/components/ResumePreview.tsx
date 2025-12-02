import type { ResumeData, ResumeTemplate, ResumeLanguage } from "@/../../shared/resumeTypes";

interface ResumePreviewProps {
  resumeData: ResumeData;
  template: ResumeTemplate;
  language: ResumeLanguage;
}

const TEMPLATE_STYLES = {
  classic: {
    container: "bg-white",
    header: "bg-slate-100 border-b-2 border-slate-300",
    headerText: "text-slate-900",
    sectionTitle: "text-xl font-bold text-slate-900 border-b-2 border-slate-700 pb-2 mb-3",
    text: "text-slate-700",
    accent: "text-slate-700",
  },
  modern: {
    container: "bg-white",
    header: "bg-gradient-to-r from-blue-500 to-purple-600",
    headerText: "text-white",
    sectionTitle: "text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-2 mb-3",
    text: "text-slate-700",
    accent: "text-blue-600",
  },
  minimal: {
    container: "bg-white",
    header: "bg-white border-b border-slate-300",
    headerText: "text-slate-900",
    sectionTitle: "text-lg font-semibold text-slate-800 mb-3",
    text: "text-slate-600",
    accent: "text-slate-800",
  },
  executive: {
    container: "bg-slate-50",
    header: "bg-slate-800",
    headerText: "text-white",
    sectionTitle: "text-xl font-bold text-slate-900 border-b-2 border-amber-600 pb-2 mb-3",
    text: "text-slate-700",
    accent: "text-amber-600",
  },
  creative: {
    container: "bg-gradient-to-br from-pink-50 to-purple-50",
    header: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
    headerText: "text-white",
    sectionTitle: "text-xl font-bold text-purple-600 border-b-2 border-purple-600 pb-2 mb-3",
    text: "text-slate-700",
    accent: "text-purple-600",
  },
};

const TRANSLATIONS = {
  pt: {
    experience: "EXPERIÊNCIA PROFISSIONAL",
    education: "EDUCAÇÃO",
    skills: "HABILIDADES",
    languages: "IDIOMAS",
    certifications: "CERTIFICAÇÕES",
    projects: "PROJETOS",
    present: "Presente",
  },
  en: {
    experience: "WORK EXPERIENCE",
    education: "EDUCATION",
    skills: "SKILLS",
    languages: "LANGUAGES",
    certifications: "CERTIFICATIONS",
    projects: "PROJECTS",
    present: "Present",
  },
  es: {
    experience: "EXPERIENCIA PROFESIONAL",
    education: "EDUCACIÓN",
    skills: "HABILIDADES",
    languages: "IDIOMAS",
    certifications: "CERTIFICACIONES",
    projects: "PROYECTOS",
    present: "Presente",
  },
};

export function ResumePreview({ resumeData, template, language }: ResumePreviewProps) {
  const styles = TEMPLATE_STYLES[template];
  const t = TRANSLATIONS[language];

  return (
    <div className={`${styles.container} p-8 rounded-lg border shadow-sm max-h-[800px] overflow-y-auto`}>
      {/* Personal Info Header */}
      {resumeData.personalInfo && (
        <div className={`${styles.header} mb-6 p-6 rounded-lg`}>
          {resumeData.personalInfo.fullName && (
            <h2 className={`text-3xl font-bold ${styles.headerText} mb-2`}>
              {resumeData.personalInfo.fullName}
            </h2>
          )}
          <div className={`text-sm ${styles.headerText} space-y-1`}>
            {resumeData.personalInfo.email && <p>{resumeData.personalInfo.email}</p>}
            {resumeData.personalInfo.phone && <p>{resumeData.personalInfo.phone}</p>}
            {resumeData.personalInfo.location && <p>{resumeData.personalInfo.location}</p>}
            {resumeData.personalInfo.linkedin && <p>{resumeData.personalInfo.linkedin}</p>}
            {resumeData.personalInfo.website && <p>{resumeData.personalInfo.website}</p>}
          </div>
          {resumeData.personalInfo.summary && (
            <p className={`mt-4 ${styles.headerText} text-justify leading-relaxed`}>
              {resumeData.personalInfo.summary}
            </p>
          )}
        </div>
      )}

      {/* Experience */}
      {resumeData.experience && resumeData.experience.length > 0 && (
        <div className="mb-6">
          <h3 className={styles.sectionTitle}>{t.experience}</h3>
          {resumeData.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`font-semibold ${styles.accent}`}>{exp.position}</h4>
                  <p className={styles.text}>{exp.company}</p>
                </div>
                <p className={`text-sm ${styles.text} italic`}>
                  {exp.startDate} - {exp.endDate || t.present}
                </p>
              </div>
              {exp.description && (
                <p className={`text-sm ${styles.text} mt-2`}>{exp.description}</p>
              )}
              {exp.achievements && exp.achievements.length > 0 && (
                <ul className={`list-disc list-inside text-sm ${styles.text} mt-2 space-y-1`}>
                  {exp.achievements.map((ach, i) => (
                    <li key={i}>{ach}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {resumeData.education && resumeData.education.length > 0 && (
        <div className="mb-6">
          <h3 className={styles.sectionTitle}>{t.education}</h3>
          {resumeData.education.map((edu, idx) => (
            <div key={idx} className="mb-3">
              <h4 className={`font-semibold ${styles.accent}`}>
                {edu.degree}{edu.field ? ` em ${edu.field}` : ""}
              </h4>
              <p className={styles.text}>{edu.institution}</p>
              {(edu.startDate || edu.endDate) && (
                <p className={`text-sm ${styles.text} italic`}>
                  {edu.startDate || ""} - {edu.endDate || t.present}
                </p>
              )}
              {edu.gpa && <p className={`text-sm ${styles.text}`}>GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {resumeData.skills && resumeData.skills.length > 0 && (
        <div className="mb-6">
          <h3 className={styles.sectionTitle}>{t.skills}</h3>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 ${template === 'modern' ? 'bg-blue-100 text-blue-700' : template === 'creative' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'} rounded-full text-sm font-medium`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resumeData.languages && resumeData.languages.length > 0 && (
        <div className="mb-6">
          <h3 className={styles.sectionTitle}>{t.languages}</h3>
          <div className="grid grid-cols-2 gap-2">
            {resumeData.languages.map((lang, idx) => (
              <div key={idx} className={styles.text}>
                <span className="font-semibold">{lang.name}:</span> {lang.proficiency}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {resumeData.certifications && resumeData.certifications.length > 0 && (
        <div className="mb-6">
          <h3 className={styles.sectionTitle}>{t.certifications}</h3>
          {resumeData.certifications.map((cert, idx) => (
            <div key={idx} className="mb-2">
              <h4 className={`font-semibold ${styles.accent}`}>{cert.name}</h4>
              <p className={`text-sm ${styles.text}`}>
                {cert.issuer} - {cert.date}
                {cert.expiryDate && ` (Válido até: ${cert.expiryDate})`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div className="mb-6">
          <h3 className={styles.sectionTitle}>{t.projects}</h3>
          {resumeData.projects.map((project, idx) => (
            <div key={idx} className="mb-3">
              <h4 className={`font-semibold ${styles.accent}`}>{project.name}</h4>
              <p className={`text-sm ${styles.text}`}>{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <p className={`text-xs ${styles.text} mt-1`}>
                  <strong>Tecnologias:</strong> {project.technologies.join(", ")}
                </p>
              )}
              {project.url && (
                <p className={`text-xs ${styles.text}`}>
                  <strong>Link:</strong> {project.url}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Additional Sections */}
      {resumeData.additionalSections && resumeData.additionalSections.length > 0 && (
        <>
          {resumeData.additionalSections.map((section, idx) => (
            <div key={idx} className="mb-6">
              <h3 className={styles.sectionTitle}>{section.title}</h3>
              <p className={`text-sm ${styles.text} whitespace-pre-wrap`}>{section.content}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

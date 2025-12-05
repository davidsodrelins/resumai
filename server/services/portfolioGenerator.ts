import { invokeLLM } from "../_core/llm.js";
import type { ResumeData, Experience, Education } from "../../shared/resumeTypes.js";

export interface PortfolioConfig {
  template: "modern" | "minimalist" | "professional";
  theme: "light" | "dark";
  primaryColor?: string;
  customDomain?: string;
}

export interface PortfolioData {
  html: string;
  css: string;
  js: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
    ogImage?: string;
  };
}

/**
 * Gera um portfolio web completo a partir dos dados do currículo
 */
export async function generatePortfolio(
  resume: ResumeData,
  config: PortfolioConfig
): Promise<PortfolioData> {
  const { template, theme, primaryColor = "#3b82f6" } = config;

  // Gerar biografia enriquecida via IA
  const biography = await generateBiography(resume);

  // Gerar HTML baseado no template escolhido
  const html = generateHTML(resume, biography, template, theme);

  // Gerar CSS customizado
  const css = generateCSS(template, theme, primaryColor);

  // Gerar JavaScript para interatividade
  const js = generateJS(template);

  // Gerar metadados SEO
  const metadata = generateMetadata(resume);

  return { html, css, js, metadata };
}

/**
 * Gera uma biografia profissional enriquecida usando IA
 */
async function generateBiography(resume: ResumeData): Promise<string> {
  const prompt = `
Você é um especialista em redação profissional. Com base nas informações do currículo abaixo, crie uma biografia profissional envolvente e autêntica em primeira pessoa.

**Informações do Currículo:**
Nome: ${resume.personalInfo.fullName}
Email: ${resume.personalInfo.email}
Resumo: ${resume.personalInfo.summary || 'N/A'}
Experiências: ${resume.experience.map((exp: Experience) => `${exp.position} na ${exp.company} (${exp.startDate} - ${exp.endDate || 'Presente'})`).join(", ")}

**Requisitos:**
- Escreva em primeira pessoa
- Tom profissional mas acessível
- Destaque conquistas e paixões
- Mencione motivações e objetivos de carreira
- Máximo de 3 parágrafos
- Seja autêntico e humanizado

**Biografia:**
`;

  const response = await invokeLLM({
    messages: [
      { role: "system", content: "Você é um especialista em redação profissional e storytelling." },
      { role: "user", content: prompt }
    ],
  });

  const content = response.choices[0].message.content;
  return typeof content === 'string' ? content.trim() : '';
}

/**
 * Gera o HTML do portfolio baseado no template
 */
function generateHTML(
  resume: ResumeData,
  biography: string,
  template: string,
  theme: string
): string {
  const { personalInfo, experience, education, skills } = resume;

  // Template base comum
  const baseHTML = `
<!DOCTYPE html>
<html lang="pt-BR" class="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Portfolio profissional de ${personalInfo.fullName}">
  <meta name="keywords" content="${skills.join(", ")}">
  
  <!-- Open Graph -->
  <meta property="og:title" content="${personalInfo.fullName} - Portfolio Profissional">
  <meta property="og:description" content="${biography.substring(0, 160)}">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${personalInfo.fullName}">
  <meta name="twitter:description" content="${biography.substring(0, 160)}">
  
  <title>${personalInfo.fullName} - Portfolio</title>
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  ${template === "modern" ? generateModernTemplate(resume, biography) : 
    template === "minimalist" ? generateMinimalistTemplate(resume, biography) :
    generateProfessionalTemplate(resume, biography)}
  
  <script src="script.js"></script>
</body>
</html>
`;

  return baseHTML;
}

/**
 * Template Moderno - Design vibrante com animações
 */
function generateModernTemplate(resume: ResumeData, biography: string): string {
  const { personalInfo, experience, education, skills } = resume;
  
  return `
  <!-- Navigation -->
  <nav class="nav-modern">
    <div class="container">
      <div class="nav-brand">${personalInfo.fullName}</div>
      <ul class="nav-links">
        <li><a href="#about">Sobre</a></li>
        <li><a href="#experience">Experiência</a></li>
        <li><a href="#skills">Habilidades</a></li>
        <li><a href="#education">Educação</a></li>
        <li><a href="#contact">Contato</a></li>
      </ul>
      <button class="nav-toggle" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </nav>

  <!-- Hero Section -->
  <section class="hero-modern">
    <div class="container">
      <div class="hero-content">
        <h1 class="hero-title animate-fade-in">${personalInfo.fullName}</h1>
        <p class="hero-subtitle animate-fade-in-delay">${resume.personalInfo.summary || 'Profissional'}</p>
        <div class="hero-contact animate-fade-in-delay-2">
          <a href="mailto:${personalInfo.email}" class="contact-link">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            ${personalInfo.email}
          </a>
          <a href="tel:${personalInfo.phone}" class="contact-link">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            ${personalInfo.phone}
          </a>
          ${personalInfo.location ? `
          <span class="contact-link">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
            </svg>
            ${personalInfo.location}
          </span>
          ` : ''}
        </div>
        <div class="hero-cta animate-fade-in-delay-3">
          <a href="#contact" class="btn-primary">Entre em Contato</a>
          <a href="#experience" class="btn-secondary">Ver Experiência</a>
        </div>
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="section-modern">
    <div class="container">
      <h2 class="section-title">Sobre Mim</h2>
      <div class="about-content">
        ${biography.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </div>
    </div>
  </section>

  <!-- Experience Section -->
  <section id="experience" class="section-modern bg-alt">
    <div class="container">
      <h2 class="section-title">Experiência Profissional</h2>
      <div class="timeline-modern">
        ${experience.map((exp: Experience, index: number) => `
        <div class="timeline-item" data-index="${index}">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h3 class="timeline-title">${exp.position}</h3>
              <span class="timeline-date">${exp.startDate} - ${exp.endDate || 'Presente'}</span>
            </div>
            <p class="timeline-company">${exp.company}</p>
            <ul class="timeline-achievements">
              ${(exp.achievements || []).map((achievement: string) => `<li>${achievement}</li>`).join('')}
            </ul>
          </div>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Skills Section -->
  <section id="skills" class="section-modern">
    <div class="container">
      <h2 class="section-title">Habilidades</h2>
      <div class="skills-grid-modern">
        ${skills.map((skill: string) => `
        <div class="skill-card">
          <span class="skill-name">${skill}</span>
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Education Section -->
  <section id="education" class="section-modern bg-alt">
    <div class="container">
      <h2 class="section-title">Educação</h2>
      <div class="education-grid">
        ${education.map((edu: Education) => `
        <div class="education-card">
          <h3 class="education-degree">${edu.degree}</h3>
          <p class="education-institution">${edu.institution}</p>
          <p class="education-date">${edu.startDate} - ${edu.endDate || 'Presente'}</p>
          ${edu.field ? `<p class="education-details">${edu.field}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="section-modern">
    <div class="container">
      <h2 class="section-title">Entre em Contato</h2>
      <div class="contact-content">
        <p class="contact-intro">Interessado em trabalhar juntos? Vamos conversar!</p>
        <div class="contact-methods">
          <a href="mailto:${personalInfo.email}" class="contact-method">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
            </svg>
            <span>${personalInfo.email}</span>
          </a>
          <a href="tel:${personalInfo.phone}" class="contact-method">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            <span>${personalInfo.phone}</span>
          </a>
          ${personalInfo.linkedin ? `
          <a href="${personalInfo.linkedin}" target="_blank" rel="noopener noreferrer" class="contact-method">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            <span>LinkedIn</span>
          </a>
          ` : ''}
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer-modern">
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${personalInfo.fullName}. Todos os direitos reservados.</p>
      <p class="footer-credit">Portfolio gerado por <a href="https://manus.space" target="_blank">Manus IA</a></p>
    </div>
  </footer>
`;
}

/**
 * Template Minimalista - Design limpo e focado
 */
function generateMinimalistTemplate(resume: ResumeData, biography: string): string {
  const { personalInfo, experience, education, skills } = resume;
  
  return `
  <!-- Header -->
  <header class="header-minimal">
    <div class="container-minimal">
      <h1 class="name-minimal">${personalInfo.fullName}</h1>
      <p class="title-minimal">${resume.personalInfo.summary || 'Profissional'}</p>
      <nav class="nav-minimal">
        <a href="#about">Sobre</a>
        <a href="#experience">Experiência</a>
        <a href="#skills">Habilidades</a>
        <a href="#education">Educação</a>
        <a href="#contact">Contato</a>
      </nav>
    </div>
  </header>

  <main class="main-minimal">
    <!-- About -->
    <section id="about" class="section-minimal">
      <div class="container-minimal">
        <h2 class="heading-minimal">Sobre</h2>
        <div class="content-minimal">
          ${biography.split('\n\n').map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
    </section>

    <!-- Experience -->
    <section id="experience" class="section-minimal">
      <div class="container-minimal">
        <h2 class="heading-minimal">Experiência</h2>
        <div class="list-minimal">
          ${experience.map((exp: Experience) => `
          <article class="item-minimal">
            <div class="item-header">
              <h3>${exp.position}</h3>
              <time>${exp.startDate} — ${exp.endDate || 'Presente'}</time>
            </div>
            <p class="item-subtitle">${exp.company}</p>
            <ul class="item-list">
              ${(exp.achievements || []).map((achievement: string) => `<li>${achievement}</li>`).join('')}
            </ul>
          </article>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="section-minimal">
      <div class="container-minimal">
        <h2 class="heading-minimal">Habilidades</h2>
        <div class="skills-minimal">
          ${skills.map((skill: string) => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
      </div>
    </section>

    <!-- Education -->
    <section id="education" class="section-minimal">
      <div class="container-minimal">
        <h2 class="heading-minimal">Educação</h2>
        <div class="list-minimal">
          ${education.map((edu: Education) => `
          <article class="item-minimal">
            <div class="item-header">
              <h3>${edu.degree}</h3>
              <time>${edu.startDate} — ${edu.endDate || 'Presente'}</time>
            </div>
            <p class="item-subtitle">${edu.institution}</p>
            ${edu.field ? `<p class="item-details">${edu.field}</p>` : ''}
          </article>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section-minimal">
      <div class="container-minimal">
        <h2 class="heading-minimal">Contato</h2>
        <div class="contact-minimal">
          <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
          <a href="tel:${personalInfo.phone}">${personalInfo.phone}</a>
          ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
          ${personalInfo.location ? `<span>${personalInfo.location}</span>` : ''}
        </div>
      </div>
    </section>
  </main>

  <footer class="footer-minimal">
    <div class="container-minimal">
      <p>${new Date().getFullYear()} ${personalInfo.fullName}</p>
    </div>
  </footer>
`;
}

/**
 * Template Profissional - Design corporativo e formal
 */
function generateProfessionalTemplate(resume: ResumeData, biography: string): string {
  const { personalInfo, experience, education, skills } = resume;
  
  return `
  <!-- Sidebar -->
  <aside class="sidebar-pro">
    <div class="profile-pro">
      <div class="profile-avatar">${personalInfo.fullName.charAt(0)}</div>
      <h1 class="profile-name">${personalInfo.fullName}</h1>
      <p class="profile-title">${resume.personalInfo.summary || 'Profissional'}</p>
    </div>
    
    <nav class="nav-pro">
      <a href="#about" class="nav-item-pro">Sobre</a>
      <a href="#experience" class="nav-item-pro">Experiência</a>
      <a href="#skills" class="nav-item-pro">Habilidades</a>
      <a href="#education" class="nav-item-pro">Educação</a>
      <a href="#contact" class="nav-item-pro">Contato</a>
    </nav>
    
    <div class="contact-sidebar">
      <h3>Contato</h3>
      <a href="mailto:${personalInfo.email}" class="contact-item-sidebar">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
        </svg>
        ${personalInfo.email}
      </a>
      <a href="tel:${personalInfo.phone}" class="contact-item-sidebar">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
        </svg>
        ${personalInfo.phone}
      </a>
      ${personalInfo.location ? `
      <div class="contact-item-sidebar">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
        </svg>
        ${personalInfo.location}
      </div>
      ` : ''}
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main-pro">
    <!-- About -->
    <section id="about" class="section-pro">
      <h2 class="section-heading-pro">Sobre Mim</h2>
      <div class="section-content-pro">
        ${biography.split('\n\n').map(p => `<p>${p}</p>`).join('')}
      </div>
    </section>

    <!-- Experience -->
    <section id="experience" class="section-pro">
      <h2 class="section-heading-pro">Experiência Profissional</h2>
      <div class="section-content-pro">
        ${experience.map(exp => `
        <div class="experience-item-pro">
          <div class="experience-header-pro">
            <div>
              <h3 class="experience-position">${exp.position}</h3>
              <p class="experience-company">${exp.company}</p>
            </div>
            <span class="experience-date">${exp.startDate} - ${exp.endDate || 'Presente'}</span>
          </div>
          <ul class="experience-achievements">
            ${(exp.achievements || []).map((achievement: string) => `<li>${achievement}</li>`).join('')}
          </ul>
        </div>
        `).join('')}
      </div>
    </section>

    <!-- Skills -->
    <section id="skills" class="section-pro">
      <h2 class="section-heading-pro">Habilidades</h2>
      <div class="section-content-pro">
        <div class="skills-grid-pro">
          ${skills.map((skill: string) => `<div class="skill-badge-pro">${skill}</div>`).join('')}
        </div>
      </div>
    </section>

    <!-- Education -->
    <section id="education" class="section-pro">
      <h2 class="section-heading-pro">Educação</h2>
      <div class="section-content-pro">
        ${education.map((edu: Education) => `
        <div class="education-item-pro">
          <div class="education-header-pro">
            <div>
              <h3 class="education-degree-pro">${edu.degree}</h3>
              <p class="education-institution-pro">${edu.institution}</p>
            </div>
            <span class="education-date-pro">${edu.startDate} - ${edu.endDate || 'Presente'}</span>
          </div>
            ${edu.field ? `<p class="education-details-pro">${edu.field}</p>` : ''}
        </div>
        `).join('')}
      </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="section-pro">
      <h2 class="section-heading-pro">Entre em Contato</h2>
      <div class="section-content-pro">
        <p class="contact-text-pro">Interessado em discutir oportunidades ou projetos? Ficarei feliz em conversar.</p>
        <div class="contact-buttons-pro">
          <a href="mailto:${personalInfo.email}" class="btn-pro-primary">Enviar Email</a>
          ${personalInfo.linkedin ? `<a href="${personalInfo.linkedin}" target="_blank" rel="noopener" class="btn-pro-secondary">Ver LinkedIn</a>` : ''}
        </div>
      </div>
    </section>
  </main>
`;
}

/**
 * Gera o CSS customizado baseado no template e tema
 */
function generateCSS(template: string, theme: string, primaryColor: string): string {
  const baseCSS = `
/* Reset e Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary-color: ${primaryColor};
  --primary-dark: ${adjustColor(primaryColor, -20)};
  --primary-light: ${adjustColor(primaryColor, 20)};
  ${theme === "dark" ? `
  --bg-color: #0f172a;
  --bg-alt: #1e293b;
  --text-color: #f1f5f9;
  --text-muted: #94a3b8;
  --border-color: #334155;
  ` : `
  --bg-color: #ffffff;
  --bg-alt: #f8fafc;
  --text-color: #1e293b;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  `}
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition);
}

a:hover {
  color: var(--primary-dark);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

.animate-fade-in-delay {
  animation: fadeIn 0.6s ease-out 0.2s both;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 0.6s ease-out 0.4s both;
}

.animate-fade-in-delay-3 {
  animation: fadeIn 0.6s ease-out 0.6s both;
}

/* Responsive Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.container-minimal {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}
`;

  const templateCSS = template === "modern" ? getModernCSS() :
                      template === "minimalist" ? getMinimalistCSS() :
                      getProfessionalCSS();

  return baseCSS + templateCSS;
}

/**
 * CSS para template Moderno
 */
function getModernCSS(): string {
  return `
/* Navigation Modern */
.nav-modern {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  backdrop-filter: blur(10px);
  background-color: rgba(var(--bg-color), 0.8);
}

.nav-modern .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-color);
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  color: var(--text-muted);
  font-weight: 500;
  transition: var(--transition);
}

.nav-links a:hover {
  color: var(--primary-color);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-toggle span {
  width: 24px;
  height: 2px;
  background: var(--text-color);
  transition: var(--transition);
}

/* Hero Modern */
.hero-modern {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
  background: linear-gradient(135deg, var(--bg-color) 0%, var(--bg-alt) 100%);
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.hero-contact {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.hero-cta {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 0.75rem 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: var(--transition);
}

.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  padding: 0.75rem 2rem;
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 0.5rem;
  font-weight: 600;
  transition: var(--transition);
}

.btn-secondary:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

/* Section Modern */
.section-modern {
  padding: 6rem 0;
}

.section-modern.bg-alt {
  background: var(--bg-alt);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--text-muted);
}

.about-content p {
  margin-bottom: 1.5rem;
}

/* Timeline Modern */
.timeline-modern {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
}

.timeline-modern::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border-color);
}

.timeline-item {
  position: relative;
  padding-left: 3rem;
  margin-bottom: 3rem;
}

.timeline-marker {
  position: absolute;
  left: -6px;
  top: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--primary-color);
  border: 3px solid var(--bg-alt);
}

.timeline-content {
  background: var(--bg-color);
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.timeline-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
}

.timeline-date {
  font-size: 0.875rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.timeline-company {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 1rem;
}

.timeline-achievements {
  list-style: none;
  padding-left: 0;
}

.timeline-achievements li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-muted);
}

.timeline-achievements li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--primary-color);
}

/* Skills Grid Modern */
.skills-grid-modern {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.skill-card {
  background: var(--bg-alt);
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  font-weight: 500;
  transition: var(--transition);
  border: 1px solid var(--border-color);
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--primary-color);
}

/* Education Grid */
.education-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.education-card {
  background: var(--bg-color);
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.education-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.education-degree {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.education-institution {
  color: var(--primary-color);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.education-date {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.education-details {
  color: var(--text-muted);
  line-height: 1.6;
}

/* Contact Section */
.contact-content {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.contact-intro {
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-method {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-alt);
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.contact-method:hover {
  border-color: var(--primary-color);
  transform: translateX(4px);
}

/* Footer Modern */
.footer-modern {
  background: var(--bg-alt);
  padding: 2rem 0;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.footer-modern p {
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.footer-credit {
  font-size: 0.875rem;
}

.footer-credit a {
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .nav-toggle {
    display: flex;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-contact {
    flex-direction: column;
    align-items: center;
  }
  
  .timeline-modern::before {
    left: 0;
  }
  
  .timeline-item {
    padding-left: 2rem;
  }
  
  .timeline-header {
    flex-direction: column;
  }
  
  .skills-grid-modern {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
`;
}

/**
 * CSS para template Minimalista
 */
function getMinimalistCSS(): string {
  return `
/* Header Minimal */
.header-minimal {
  padding: 4rem 0 2rem;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.name-minimal {
  font-size: 2.5rem;
  font-weight: 300;
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.title-minimal {
  font-size: 1.125rem;
  color: var(--text-muted);
  font-weight: 400;
  margin-bottom: 2rem;
}

.nav-minimal {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.nav-minimal a {
  color: var(--text-muted);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.nav-minimal a:hover {
  color: var(--text-color);
}

/* Main Minimal */
.main-minimal {
  padding: 4rem 0;
}

.section-minimal {
  margin-bottom: 4rem;
}

.heading-minimal {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.content-minimal {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--text-muted);
}

.content-minimal p {
  margin-bottom: 1.5rem;
}

/* List Minimal */
.list-minimal {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.item-minimal {
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.item-minimal:last-child {
  border-bottom: none;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.5rem;
  gap: 1rem;
}

.item-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
}

.item-header time {
  font-size: 0.875rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.item-subtitle {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.item-list {
  list-style: none;
  padding-left: 0;
}

.item-list li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.item-list li::before {
  content: '—';
  position: absolute;
  left: 0;
}

.item-details {
  color: var(--text-muted);
  font-size: 0.95rem;
  margin-top: 0.5rem;
}

/* Skills Minimal */
.skills-minimal {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-tag {
  padding: 0.5rem 1rem;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 2px;
  font-size: 0.875rem;
  color: var(--text-muted);
}

/* Contact Minimal */
.contact-minimal {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-minimal a,
.contact-minimal span {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.contact-minimal a:hover {
  color: var(--text-color);
}

/* Footer Minimal */
.footer-minimal {
  padding: 2rem 0;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.footer-minimal p {
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .name-minimal {
    font-size: 2rem;
  }
  
  .item-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .skills-minimal {
    gap: 0.5rem;
  }
  
  .skill-tag {
    font-size: 0.8125rem;
  }
}
`;
}

/**
 * CSS para template Profissional
 */
function getProfessionalCSS(): string {
  return `
/* Layout Professional */
body {
  display: flex;
  min-height: 100vh;
}

.sidebar-pro {
  width: 300px;
  background: var(--bg-alt);
  border-right: 1px solid var(--border-color);
  padding: 2rem;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
}

.main-pro {
  margin-left: 300px;
  flex: 1;
  padding: 3rem;
}

/* Profile Professional */
.profile-pro {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 auto 1rem;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.profile-title {
  color: var(--text-muted);
  font-size: 0.95rem;
}

/* Navigation Professional */
.nav-pro {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.nav-item-pro {
  padding: 0.75rem 1rem;
  color: var(--text-muted);
  border-radius: 0.375rem;
  transition: var(--transition);
  font-weight: 500;
}

.nav-item-pro:hover {
  background: var(--bg-color);
  color: var(--primary-color);
}

/* Contact Sidebar */
.contact-sidebar {
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.contact-sidebar h3 {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.contact-item-sidebar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: var(--text-muted);
  font-size: 0.875rem;
  word-break: break-all;
}

.contact-item-sidebar:hover {
  color: var(--primary-color);
}

.contact-item-sidebar svg {
  flex-shrink: 0;
}

/* Section Professional */
.section-pro {
  margin-bottom: 4rem;
}

.section-heading-pro {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--primary-color);
}

.section-content-pro {
  font-size: 1rem;
  line-height: 1.7;
}

.section-content-pro p {
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

/* Experience Professional */
.experience-item-pro {
  margin-bottom: 2.5rem;
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-color);
}

.experience-item-pro:last-child {
  border-bottom: none;
}

.experience-header-pro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 2rem;
}

.experience-position {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.experience-company {
  color: var(--primary-color);
  font-weight: 500;
}

.experience-date {
  color: var(--text-muted);
  font-size: 0.875rem;
  white-space: nowrap;
}

.experience-achievements {
  list-style: none;
  padding-left: 0;
}

.experience-achievements li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--text-muted);
}

.experience-achievements li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary-color);
  font-weight: bold;
}

/* Skills Professional */
.skills-grid-pro {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.skill-badge-pro {
  padding: 0.75rem 1rem;
  background: var(--bg-alt);
  border: 1px solid var(--border-color);
  border-radius: 0.375rem;
  text-align: center;
  font-weight: 500;
  transition: var(--transition);
}

.skill-badge-pro:hover {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

/* Education Professional */
.education-item-pro {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.education-item-pro:last-child {
  border-bottom: none;
}

.education-header-pro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 2rem;
}

.education-degree-pro {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.education-institution-pro {
  color: var(--primary-color);
  font-weight: 500;
}

.education-date-pro {
  color: var(--text-muted);
  font-size: 0.875rem;
  white-space: nowrap;
}

.education-details-pro {
  color: var(--text-muted);
}

/* Contact Professional */
.contact-text-pro {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.contact-buttons-pro {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-pro-primary {
  padding: 0.75rem 2rem;
  background: var(--primary-color);
  color: white;
  border-radius: 0.375rem;
  font-weight: 600;
  transition: var(--transition);
}

.btn-pro-primary:hover {
  background: var(--primary-dark);
}

.btn-pro-secondary {
  padding: 0.75rem 2rem;
  background: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  border-radius: 0.375rem;
  font-weight: 600;
  transition: var(--transition);
}

.btn-pro-secondary:hover {
  background: var(--primary-color);
  color: white;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar-pro {
    position: static;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }
  
  .main-pro {
    margin-left: 0;
    padding: 2rem 1.5rem;
  }
  
  .experience-header-pro,
  .education-header-pro {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .skills-grid-pro {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
}
`;
}

/**
 * Gera o JavaScript para interatividade
 */
function generateJS(template: string): string {
  return `
// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Mobile menu toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.timeline-item, .skill-card, .education-card').forEach(el => {
  observer.observe(el);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === \`#\${current}\`) {
      item.classList.add('active');
    }
  });
});

// Print analytics (if available)
if (window.plausible) {
  window.plausible('pageview');
}

console.log('Portfolio loaded successfully! Generated by Manus IA');
`;
}

/**
 * Gera metadados SEO
 */
function generateMetadata(resume: ResumeData): {
  title: string;
  description: string;
  keywords: string[];
} {
  const { personalInfo, skills, experience } = resume;
  
  const title = `${personalInfo.fullName} - Portfolio Profissional`;
  
  const description = `Portfolio profissional de ${personalInfo.fullName} com experiência em ${experience[0]?.company || 'diversas empresas'}. Especializado em ${skills.slice(0, 3).join(", ")}.`;
  
  const keywords = [
    personalInfo.fullName,
    ...skills,
    ...experience.map(exp => exp.company),
    "portfolio",
    "currículo",
    "profissional"
  ];
  
  return { title, description, keywords };
}

/**
 * Ajusta cor (clareia ou escurece)
 */
function adjustColor(color: string, percent: number): string {
  // Remove # se presente
  const hex = color.replace('#', '');
  
  // Converte para RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Ajusta
  const adjust = (value: number) => {
    const adjusted = value + (value * percent / 100);
    return Math.min(255, Math.max(0, Math.round(adjusted)));
  };
  
  // Converte de volta para hex
  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`;
}

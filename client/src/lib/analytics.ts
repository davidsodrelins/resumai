/**
 * Google Analytics 4 Event Tracking Helper
 * 
 * Use este helper para rastrear eventos de conversão importantes
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Rastreia evento personalizado no GA4
 */
export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters);
  }
}

/**
 * Rastreia cadastro de novo usuário
 */
export function trackSignup(method: string = "email") {
  trackEvent("sign_up", {
    method,
  });
}

/**
 * Rastreia login de usuário
 */
export function trackLogin(method: string = "email") {
  trackEvent("login", {
    method,
  });
}

/**
 * Rastreia criação de currículo
 */
export function trackResumeCreated(template: string, language: string) {
  trackEvent("create_resume", {
    template,
    language,
    value: 1, // Valor de conversão
  });
}

/**
 * Rastreia download de currículo
 */
export function trackResumeDownload(format: string) {
  trackEvent("download_resume", {
    format, // pdf, docx, latex
  });
}

/**
 * Rastreia doação
 */
export function trackDonation(amount: number, currency: string = "BRL") {
  trackEvent("purchase", {
    currency,
    value: amount,
    items: [
      {
        item_name: "Donation",
        price: amount,
        quantity: 1,
      },
    ],
  });
}

/**
 * Rastreia compartilhamento de referral
 */
export function trackReferralShare(platform: string) {
  trackEvent("share", {
    method: platform, // whatsapp, twitter, linkedin, facebook
    content_type: "referral_link",
  });
}

/**
 * Rastreia visualização de template
 */
export function trackTemplateView(templateName: string) {
  trackEvent("view_item", {
    item_name: templateName,
    item_category: "resume_template",
  });
}

/**
 * Rastreia início de criação de currículo
 */
export function trackResumeStart() {
  trackEvent("begin_checkout", {
    item_category: "resume_creation",
  });
}

/**
 * Rastreia visualização de post do blog
 */
export function trackBlogPostView(postTitle: string, category: string) {
  trackEvent("view_item", {
    item_name: postTitle,
    item_category: category,
  });
}

/**
 * Rastreia busca no site
 */
export function trackSearch(searchTerm: string) {
  trackEvent("search", {
    search_term: searchTerm,
  });
}

/**
 * Rastreia compartilhamento social
 */
export function trackShare(platform: string) {
  trackEvent("share", {
    method: platform,
  });
}

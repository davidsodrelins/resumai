import { describe, it, expect } from "vitest";
import { getWelcomeEmailData } from "./welcomeEmail";

describe("Welcome Email", () => {
  it("should generate welcome email data with user name", () => {
    const userName = "João Silva";
    const emailData = getWelcomeEmailData(userName);

    expect(emailData).toBeDefined();
    expect(emailData.subject).toContain(userName);
    expect(emailData.subject).toContain("Bem-vindo ao ResumAI");
    expect(emailData.html).toContain(userName);
    expect(emailData.text).toContain(userName);
  });

  it("should include key information in HTML email", () => {
    const emailData = getWelcomeEmailData("Test User");

    // Check for important sections
    expect(emailData.html).toContain("ResumAI");
    expect(emailData.html).toContain("5 currículos por mês");
    expect(emailData.html).toContain("3 idiomas");
    expect(emailData.html).toContain("Análise ATS");
    expect(emailData.html).toContain("Criar Meu Primeiro Currículo");
    expect(emailData.html).toContain("currículos ilimitados");
  });

  it("should include key information in plain text email", () => {
    const emailData = getWelcomeEmailData("Test User");

    // Check for important sections
    expect(emailData.text).toContain("ResumAI");
    expect(emailData.text).toContain("5 currículos por mês");
    expect(emailData.text).toContain("3 idiomas");
    expect(emailData.text).toContain("Análise ATS");
    expect(emailData.text).toContain("https://resumai.manus.space/generator");
  });

  it("should have valid HTML structure", () => {
    const emailData = getWelcomeEmailData("Test User");

    // Check for basic HTML structure
    expect(emailData.html).toContain("<!DOCTYPE html>");
    expect(emailData.html).toContain("<html");
    expect(emailData.html).toContain("<head>");
    expect(emailData.html).toContain("<body>");
    expect(emailData.html).toContain("</html>");
  });

  it("should include CTA button link", () => {
    const emailData = getWelcomeEmailData("Test User");

    expect(emailData.html).toContain('href="https://resumai.manus.space/generator"');
    expect(emailData.html).toContain("Criar Meu Primeiro Currículo");
  });

  it("should include support information", () => {
    const emailData = getWelcomeEmailData("Test User");

    expect(emailData.html).toContain("Quer currículos ilimitados");
    expect(emailData.html).toContain("R$ 5");
    expect(emailData.html).toContain("badge especial de apoiador");
  });

  it("should include footer with links", () => {
    const emailData = getWelcomeEmailData("Test User");

    expect(emailData.html).toContain("David Sodré");
    expect(emailData.html).toContain("github.com/davidsodrelins/resumai");
    expect(emailData.html).toContain("página de recursos");
  });

  it("should escape HTML in user name", () => {
    const maliciousName = '<script>alert("xss")</script>';
    const emailData = getWelcomeEmailData(maliciousName);

    // Should not contain unescaped script tags
    expect(emailData.html).not.toContain('<script>alert("xss")</script>');
  });

  it("should handle special characters in user name", () => {
    const specialName = "José María O'Brien";
    const emailData = getWelcomeEmailData(specialName);

    expect(emailData.subject).toContain(specialName);
    // HTML should escape the apostrophe
    expect(emailData.html).toContain("José María O&#039;Brien");
    expect(emailData.text).toContain(specialName);
  });

  it("should have responsive email design", () => {
    const emailData = getWelcomeEmailData("Test User");

    // Check for responsive meta tag
    expect(emailData.html).toContain('name="viewport"');
    expect(emailData.html).toContain("width=device-width");
    
    // Check for max-width container
    expect(emailData.html).toContain("max-width: 600px");
  });
});

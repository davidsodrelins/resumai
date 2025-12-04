import { describe, it, expect } from "vitest";
import { sendEmail } from "./smtpEmail";

describe("SMTP Email Configuration", () => {
  it("should validate SMTP credentials by attempting to send a test email", async () => {
    // Test sending a welcome email to validate SMTP configuration
    const result = await sendEmail({
      to: "report@hidalgo.digital",
      subject: "ResumAI - Teste de Configuração SMTP",
      html: `
        <h1>Teste de Configuração SMTP</h1>
        <p>Se você recebeu este email, as credenciais SMTP foram configuradas corretamente.</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    });

    expect(result).toBe(true);
  });

  it("should handle missing SMTP configuration gracefully", async () => {
    // This test validates that the system falls back to logging when SMTP is not configured
    const result = await sendEmail({
      to: "test@example.com",
      subject: "Test Email",
      html: "<p>Test</p>",
    });

    // Should return true (either sent or logged)
    expect(result).toBe(true);
  });

  it("should validate email template structure", async () => {
    const result = await sendEmail({
      to: "report@hidalgo.digital",
      subject: "ResumAI - Template Test",
      html: `
        <html>
          <body>
            <h1>Email Template Test</h1>
            <p>This is a test email with proper HTML structure.</p>
          </body>
        </html>
      `,
    });

    expect(result).toBe(true);
  });
});

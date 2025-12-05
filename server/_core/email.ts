import nodemailer from "nodemailer";
import { ENV } from "./env";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using SMTP configuration from environment variables
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // Check if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
    console.warn("[Email] SMTP not configured, skipping email send");
    console.log("[Email] Would send to:", options.to);
    console.log("[Email] Subject:", options.subject);
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: parseInt(smtpPort),
    secure: parseInt(smtpPort) === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  // Send email
  try {
    const info = await transporter.sendMail({
      from: `"ResumAI" <${smtpUser}>`,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ""), // Fallback to HTML without tags
      html: options.html,
    });

    console.log("[Email] Email sent successfully:", info.messageId);
  } catch (error) {
    console.error("[Email] Failed to send email:", error);
    throw new Error("Falha ao enviar email");
  }
}

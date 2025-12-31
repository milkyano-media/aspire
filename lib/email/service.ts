import 'server-only';

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { ConsultationFormData } from '@/components/aspire/ConsultationForm/schema';
import { generateEmailTemplate, generateCustomEmailTemplate } from './templates';

// Email data type without the terms checkbox
type EmailFormData = Omit<ConsultationFormData, 'terms'>;

interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Validate SMTP configuration environment variables
 */
function validateSmtpConfig(): boolean {
  const requiredVars = [
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASSWORD',
    'SMTP_FROM_EMAIL',
    'SMTP_FROM_NAME',
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error(
      `Email service not configured - missing environment variables: ${missing.join(', ')}`
    );
    return false;
  }

  return true;
}

/**
 * Create and configure nodemailer transporter for Gmail SMTP
 */
function createTransporter(): Transporter {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // Gmail-specific settings
    service: 'gmail',
    tls: {
      rejectUnauthorized: true,
    },
  });
}

/**
 * Send confirmation email to form submitter
 *
 * @param data - Consultation form data (without terms field)
 * @returns Promise with success status and optional error message
 */
export async function sendConfirmationEmail(
  data: EmailFormData
): Promise<EmailResult> {
  try {
    // Validate environment variables
    if (!validateSmtpConfig()) {
      return {
        success: false,
        error: 'Email service not configured - missing SMTP credentials',
      };
    }

    // Create transporter
    const transporter = createTransporter();

    // Generate email templates
    const { html, text } = generateEmailTemplate(data);

    // Email options
    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || 'Aspire Academics',
        address: process.env.SMTP_FROM_EMAIL || 'admin@aspireacademics.au',
      },
      to: data.email,
      subject: 'Consultation Request Confirmation - Aspire Academics',
      text: text,
      html: html,
    };

    // Send email with 10-second timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Email sending timeout after 10 seconds')), 10000)
    );

    await Promise.race([sendPromise, timeoutPromise]);

    console.log(`Confirmation email sent successfully to: ${data.email}`);

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send confirmation email:', {
      error: errorMessage,
      recipient: data.email,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Test SMTP connection (useful for debugging)
 *
 * @returns Promise with connection test result
 */
export async function testSmtpConnection(): Promise<EmailResult> {
  try {
    if (!validateSmtpConfig()) {
      return {
        success: false,
        error: 'SMTP configuration incomplete',
      };
    }

    const transporter = createTransporter();

    // Verify connection
    await transporter.verify();

    console.log('SMTP connection test successful');
    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('SMTP connection test failed:', errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

interface BulkEmailResult {
  success: boolean;
  successCount: number;
  failedEmails: string[];
  error?: string;
}

interface EmailAttachment {
  filename: string;
  content: string; // Base64 encoded
  contentType: string;
}

/**
 * Send custom email to multiple recipients (bulk send)
 *
 * @param recipients - Array of recipient email addresses
 * @param subject - Email subject line
 * @param htmlBody - Custom HTML body content (will be wrapped in Aspire template)
 * @param attachments - Optional array of file attachments
 * @returns Promise with success status and detailed results
 */
export async function sendBulkCustomEmail(
  recipients: string[],
  subject: string,
  htmlBody: string,
  attachments: EmailAttachment[] = []
): Promise<BulkEmailResult> {
  try {
    // Validate environment variables
    if (!validateSmtpConfig()) {
      return {
        success: false,
        successCount: 0,
        failedEmails: recipients,
        error: 'Email service not configured - missing SMTP credentials',
      };
    }

    // Create transporter
    const transporter = createTransporter();

    const failedEmails: string[] = [];
    let successCount = 0;

    console.log(`Starting bulk email send to ${recipients.length} recipients`);

    // Send emails one by one (avoid spam filters with slight delays)
    for (const recipientEmail of recipients) {
      try {
        // Generate email template with custom body
        const { html, text } = generateCustomEmailTemplate(subject, htmlBody);

        // Email options
        const mailOptions: any = {
          from: {
            name: process.env.SMTP_FROM_NAME || 'Aspire Academics',
            address: process.env.SMTP_FROM_EMAIL || 'admin@aspireacademics.au',
          },
          to: recipientEmail,
          subject: subject,
          text: text,
          html: html,
        };

        // Add attachments if provided
        if (attachments && attachments.length > 0) {
          mailOptions.attachments = attachments.map((attachment) => ({
            filename: attachment.filename,
            content: Buffer.from(attachment.content, 'base64'),
            contentType: attachment.contentType,
          }));
        }

        // Send email with 15-second timeout
        const sendPromise = transporter.sendMail(mailOptions);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Email timeout')), 15000)
        );

        await Promise.race([sendPromise, timeoutPromise]);

        successCount++;
        console.log(`Email sent successfully to: ${recipientEmail} (${successCount}/${recipients.length})`);

        // Small delay to avoid spam filters (500ms between emails)
        if (recipients.indexOf(recipientEmail) < recipients.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (emailError) {
        const errorMsg = emailError instanceof Error ? emailError.message : 'Unknown error';
        console.error(`Failed to send email to ${recipientEmail}:`, errorMsg);
        failedEmails.push(recipientEmail);
      }
    }

    const allSuccess = failedEmails.length === 0;

    console.log(`Bulk email send complete: ${successCount}/${recipients.length} successful`);

    return {
      success: allSuccess,
      successCount,
      failedEmails,
      error: allSuccess ? undefined : `Failed to send to ${failedEmails.length} recipients`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to send bulk emails:', errorMessage);

    return {
      success: false,
      successCount: 0,
      failedEmails: recipients,
      error: errorMessage,
    };
  }
}

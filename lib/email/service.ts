import 'server-only';

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { ConsultationFormData } from '@/components/aspire/ConsultationForm/schema';
import { generateEmailTemplate } from './templates';

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

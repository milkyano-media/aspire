import "server-only";

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { ConsultationFormData } from "@/components/aspire/ConsultationForm/schema";
import {
  generateEmailTemplate,
  generateCustomEmailTemplate, replaceTemplateVariables,
  generateRegistrationEmailTemplate,
  generateYear3PricingEmailTemplate,
  generateYear4PricingEmailTemplate,
  generateYear5PricingEmailTemplate,
  generateYear6PricingEmailTemplate,
  generateYear7PricingEmailTemplate,
  generateYear8PricingEmailTemplate,
  generateYear9PricingEmailTemplate,
  generateYear10PricingEmailTemplate,
  generateYear11PricingEmailTemplate,
  generateYear12PricingEmailTemplate,
  generateSelectiveEntryPricingEmailTemplate,
} from "./templates";

// Email data type without the terms checkbox
type EmailFormData = Omit<ConsultationFormData, "terms">;

interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Validate SMTP configuration environment variables
 */
function validateSmtpConfig(): boolean {
  const requiredVars = [
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM_EMAIL",
    "SMTP_FROM_NAME",
  ];

  const missing = requiredVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error(
      `Email service not configured - missing environment variables: ${missing.join(", ")}`,
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
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    // Gmail-specific settings
    service: "gmail",
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
  data: EmailFormData,
): Promise<EmailResult> {
  try {
    // Validate environment variables
    if (!validateSmtpConfig()) {
      return {
        success: false,
        error: "Email service not configured - missing SMTP credentials",
      };
    }

    // Create transporter
    const transporter = createTransporter();

    // Generate email templates
    const { html, text } = generateEmailTemplate(data);

    // Email options
    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || "Aspire Academics",
        address: process.env.SMTP_FROM_EMAIL || "admin@aspireacademics.au",
      },
      to: data.email,
      subject: "Consultation Request Confirmation - Aspire Academics",
      text: text,
      html: html,
    };

    // Send email with 10-second timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Email sending timeout after 10 seconds")),
        10000,
      ),
    );

    await Promise.race([sendPromise, timeoutPromise]);

    console.log(`Confirmation email sent successfully to: ${data.email}`);

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send confirmation email:", {
      error: errorMessage,
      recipient: data.email,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

interface RegistrationEmailData {
  parent: {
    name: string;
    email: string;
    phoneNumber: string;
    relationship: string;
    address: string;
  };
  student: {
    name: string;
    email: string;
    phoneNumber: string;
    gender: string;
    dateOfBirth: string;
    schoolGrade: string;
    vceClass: string[];
    schoolName: string;
    additionalDetails: string;
    preference: string;
  };
}

/**
 * Send registration confirmation email to parent
 *
 * @param data - Registration data containing parent and student information
 * @returns Promise with success status and optional error message
 */
export async function sendRegistrationConfirmationEmail(
  data: RegistrationEmailData,
): Promise<EmailResult> {
  try {
    // Validate environment variables
    if (!validateSmtpConfig()) {
      return {
        success: false,
        error: "Email service not configured - missing SMTP credentials",
      };
    }

    // Create transporter
    const transporter = createTransporter();

    // Generate email templates
    const { html, text } = generateRegistrationEmailTemplate();

    // Email options
    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || "Aspire Academics",
        address: process.env.SMTP_FROM_EMAIL || "admin@aspireacademics.au",
      },
      to: data.parent.email,
      subject: "Thank You for Completing Your Aspire Academics Registration",
      text: text,
      html: html,
    };

    // Send email with 10-second timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Email sending timeout after 10 seconds")),
        10000,
      ),
    );

    await Promise.race([sendPromise, timeoutPromise]);

    console.log(
      `Registration confirmation email sent successfully to: ${data.parent.email}`,
    );

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send registration confirmation email:", {
      error: errorMessage,
      recipient: data.parent.email,
    });

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send grade-specific pricing email to parent
 *
 * @param parentEmail - Parent's email address
 * @param parentName - Parent's name for personalization
 * @param studentName - Student's name for personalization
 * @param schoolGrade - Student's school grade (A-J representing Year 3-12)
 * @returns Promise with success status and optional error message
 */
export async function sendGradePricingEmail(
  parentEmail: string,
  parentName: string,
  studentName: string,
  schoolGrade: string,
): Promise<EmailResult> {
  try {
    // Validate environment variables
    if (!validateSmtpConfig()) {
      return {
        success: false,
        error: "Email service not configured - missing SMTP credentials",
      };
    }

    // Create transporter
    const transporter = createTransporter();

    // Generate email template based on grade
    let emailTemplate;
    let subject;

    switch (schoolGrade) {
      case "A": // Year 3
        emailTemplate = generateYear3PricingEmailTemplate();
        subject = "Year 3 Program Details & Pricing - Aspire Academics";
        break;
      case "B": // Year 4
        emailTemplate = generateYear4PricingEmailTemplate();
        subject = "Year 4 Program Details & Pricing - Aspire Academics";
        break;
      case "C": // Year 5
        emailTemplate = generateYear5PricingEmailTemplate();
        subject = "Year 5 Program Details & Pricing - Aspire Academics";
        break;
      case "D": // Year 6
        emailTemplate = generateYear6PricingEmailTemplate();
        subject = "Year 6 Program Details & Pricing - Aspire Academics";
        break;
      case "E": // Year 7
        emailTemplate = generateYear7PricingEmailTemplate();
        subject = "Year 7 Program Details & Pricing - Aspire Academics";
        break;
      case "F": // Year 8
        emailTemplate = generateYear8PricingEmailTemplate();
        subject = "Year 8 Program Details & Pricing - Aspire Academics";
        break;
      case "G": // Year 9
        emailTemplate = generateYear9PricingEmailTemplate();
        subject = "Year 9 Program Details & Pricing - Aspire Academics";
        break;
      case "H": // Year 10
        emailTemplate = generateYear10PricingEmailTemplate();
        subject = "Year 10 Program Details & Pricing - Aspire Academics";
        break;
      case "I": // Year 11
        emailTemplate = generateYear11PricingEmailTemplate();
        subject = "VCE Year 11 Program Details & Pricing - Aspire Academics";
        break;
      case "J": // Year 12
        emailTemplate = generateYear12PricingEmailTemplate();
        subject = "VCE Year 12 Program Details & Pricing - Aspire Academics";
        break;
      case "K": // Selective Entry
        emailTemplate = generateSelectiveEntryPricingEmailTemplate();
        subject = "Selective Entry Program Details & Pricing - Aspire Academics";
        break;
      default:
        return {
          success: false,
          error: `No pricing template available for grade: ${schoolGrade}`,
        };
    }

    // Replace template variables with actual values
    const personalizedHtml = replaceTemplateVariables(emailTemplate.html, {
      parentName,
      studentName,
      parentEmail,
      studentEmail: '', // Not used in pricing templates
    });

    const personalizedText = replaceTemplateVariables(emailTemplate.text, {
      parentName,
      studentName,
      parentEmail,
      studentEmail: '', // Not used in pricing templates
    });

    const html = personalizedHtml;
    const text = personalizedText;

    // Email options
    const mailOptions = {
      from: {
        name: process.env.SMTP_FROM_NAME || "Aspire Academics",
        address: process.env.SMTP_FROM_EMAIL || "admin@aspireacademics.au",
      },
      to: parentEmail,
      subject: subject,
      text: text,
      html: html,
    };

    // Send email with 10-second timeout
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("Email sending timeout after 10 seconds")),
        10000,
      ),
    );

    await Promise.race([sendPromise, timeoutPromise]);

    console.log(
      `Grade pricing email (${schoolGrade}) sent successfully to: ${parentEmail}`,
    );

    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send grade pricing email:", {
      error: errorMessage,
      recipient: parentEmail,
      grade: schoolGrade,
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
        error: "SMTP configuration incomplete",
      };
    }

    const transporter = createTransporter();

    // Verify connection
    await transporter.verify();

    console.log("SMTP connection test successful");
    return { success: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("SMTP connection test failed:", errorMessage);

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

interface RecipientData {
  studentId: string;
  studentName: string;
  studentEmail: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  courseName?: string;
}

/**
 * Send custom email to multiple recipients (bulk send)
 * Supports template variables for personalization
 *
 * @param recipients - Array of recipient data with student/parent info
 * @param subject - Email subject line (supports template variables)
 * @param htmlBody - Custom HTML body content (supports template variables, will be wrapped in Aspire template)
 * @param attachments - Optional array of file attachments
 * @returns Promise with success status and detailed results
 */
export async function sendBulkCustomEmail(
  recipients: RecipientData[],
  subject: string,
  htmlBody: string,
  attachments: EmailAttachment[] = [],
): Promise<BulkEmailResult> {
  try {
    // Validate environment variables
    if (!validateSmtpConfig()) {
      return {
        success: false,
        successCount: 0,
        failedEmails: recipients.map(r => r.parentEmail),
        error: "Email service not configured - missing SMTP credentials",
      };
    }

    // Create transporter
    const transporter = createTransporter();

    const failedEmails: string[] = [];
    let successCount = 0;

    console.log(`Starting bulk email send to ${recipients.length} recipients`);

    // Send emails one by one (avoid spam filters with slight delays)
    for (const recipient of recipients) {
      try {
        // Personalize subject
        const personalizedSubject = replaceTemplateVariables(subject, {
          parentName: recipient.parentName,
          studentName: recipient.studentName,
          courseName: recipient.courseName,
          studentEmail: recipient.studentEmail,
          parentEmail: recipient.parentEmail,
        });

        // Personalize body
        const personalizedBody = replaceTemplateVariables(htmlBody, {
          parentName: recipient.parentName,
          studentName: recipient.studentName,
          courseName: recipient.courseName,
          studentEmail: recipient.studentEmail,
          parentEmail: recipient.parentEmail,
        });

        // Generate email template with personalized body
        const { html, text } = generateCustomEmailTemplate(personalizedSubject, personalizedBody);

        // Email options
        const mailOptions: any = {
          from: {
            name: process.env.SMTP_FROM_NAME || "Aspire Academics",
            address: process.env.SMTP_FROM_EMAIL || "admin@aspireacademics.au",
          },
          to: recipient.parentEmail,
          subject: personalizedSubject,
          text: text,
          html: html,
        };

        // Add attachments if provided
        if (attachments && attachments.length > 0) {
          mailOptions.attachments = attachments.map((attachment) => ({
            filename: attachment.filename,
            content: Buffer.from(attachment.content, "base64"),
            contentType: attachment.contentType,
          }));
        }

        // Send email with 15-second timeout
        const sendPromise = transporter.sendMail(mailOptions);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Email timeout")), 15000),
        );

        await Promise.race([sendPromise, timeoutPromise]);

        successCount++;
        console.log(
          `Email sent successfully to: ${recipient.parentEmail} (${successCount}/${recipients.length})`,
        );

        // Small delay to avoid spam filters (500ms between emails)
        if (recipients.indexOf(recipient) < recipients.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (emailError) {
        const errorMsg =
          emailError instanceof Error ? emailError.message : "Unknown error";
        console.error(`Failed to send email to ${recipient.parentEmail}:`, errorMsg);
        failedEmails.push(recipient.parentEmail);
      }
    }

    const allSuccess = failedEmails.length === 0;

    console.log(
      `Bulk email send complete: ${successCount}/${recipients.length} successful`,
    );

    return {
      success: allSuccess,
      successCount,
      failedEmails,
      error: allSuccess
        ? undefined
        : `Failed to send to ${failedEmails.length} recipients`,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to send bulk emails:", errorMessage);

    return {
      success: false,
      successCount: 0,
      failedEmails: recipients.map(r => r.parentEmail),
      error: errorMessage,
    };
  }
}

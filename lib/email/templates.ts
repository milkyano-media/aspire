import { ConsultationFormData } from "@/components/aspire/ConsultationForm/schema";

// Email data type without the terms checkbox
type EmailFormData = Omit<ConsultationFormData, "terms">;

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Format city value for display
 */
function formatCity(city: string): string {
  return city
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format school year for display
 */
function formatSchoolYear(year?: string): string {
  if (!year) return "Not specified";
  return year
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format program name for display
 */
function formatProgram(program: string): string {
  const programMap: Record<string, string> = {
    consult: "Consultation",
    selective_entry: "Selective Entry",
    vce: "VCE",
    public_speaking: "Public Speaking",
  };
  return programMap[program] || program;
}

interface EmailTemplate {
  html: string;
  text: string;
}

/**
 * Generate HTML and plain text email templates for consultation form confirmation
 */
export function generateEmailTemplate(data: EmailFormData): EmailTemplate {
  const {
    role,
    name,
    email,
    countryCode,
    phone,
    city,
    schoolYear,
    program,
    message,
  } = data;

  // Escape user input for HTML
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = message
    ? escapeHtml(message)
    : "No additional message provided";
  const safePhone = escapeHtml(`${countryCode} ${phone}`);

  // Format display values
  const displayCity = formatCity(city);
  const displaySchoolYear = formatSchoolYear(schoolYear);
  const displayProgram = formatProgram(program);
  const submissionDate = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Consultation Request Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Empowering Students to Achieve Excellence</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 24px;">Dear ${safeName},</h2>

              <!-- Thank You Message -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for requesting a free consultation with Aspire Academics! We're excited to help you on your academic journey.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We have received your consultation request and our team will review it shortly. Below is a summary of the information you provided:
              </p>

              <!-- Submission Details -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; overflow: hidden; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Consultation Request Details</h3>

                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; width: 40%;">Role:</td>
                        <td style="color: #333333; font-size: 14px;">${role}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Name:</td>
                        <td style="color: #333333; font-size: 14px;">${safeName}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Email:</td>
                        <td style="color: #333333; font-size: 14px;">${safeEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Phone:</td>
                        <td style="color: #333333; font-size: 14px;">${safePhone}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">City:</td>
                        <td style="color: #333333; font-size: 14px;">${displayCity}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">School Year:</td>
                        <td style="color: #333333; font-size: 14px;">${displaySchoolYear}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Program:</td>
                        <td style="color: #333333; font-size: 14px;">${displayProgram}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; vertical-align: top;">Message:</td>
                        <td style="color: #333333; font-size: 14px; line-height: 1.5;">${safeMessage}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Submitted:</td>
                        <td style="color: #333333; font-size: 14px;">${submissionDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Next Steps -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px;">What Happens Next?</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Our team will review your request within 24 hours</li>
                  <li>If you haven't already, please book your consultation time using the Calendly link that appeared after submitting the form</li>
                  <li>We'll send you a confirmation email with your consultation details</li>
                  <li>During the consultation, we'll discuss your goals and how we can help you achieve them</li>
                </ul>
              </div>

              <!-- Call to Action -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://calendly.com/aspire-academics123/30min" style="display: inline-block; background-color: #FF8C00; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 6px; font-size: 16px; font-weight: bold;">Book Your Consultation Now</a>
                  </td>
                </tr>
              </table>

              <!-- Closing Message -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                If you have any questions or need to make changes to your request, please don't hesitate to contact us.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0;">
                We look forward to working with you!
              </p>

              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 20px 0 0 0;">
                Best regards,<br>
                The Aspire Academics Team
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This is an automated confirmation email. Please do not reply directly to this message.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Empowering Students to Achieve Excellence

Dear ${name},

Thank you for requesting a free consultation with Aspire Academics! We're excited to help you on your academic journey.

We have received your consultation request and our team will review it shortly. Below is a summary of the information you provided:

CONSULTATION REQUEST DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Role:           ${role}
Name:           ${name}
Email:          ${email}
Phone:          ${countryCode} ${phone}
City:           ${displayCity}
School Year:    ${displaySchoolYear}
Program:        ${displayProgram}
Message:        ${message || "No additional message provided"}
Submitted:      ${submissionDate}

WHAT HAPPENS NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Our team will review your request within 24 hours
• If you haven't already, please book your consultation time using this link:
  https://calendly.com/aspire-academics123/30min
• We'll send you a confirmation email with your consultation details
• During the consultation, we'll discuss your goals and how we can help you achieve them

If you have any questions or need to make changes to your request, please don't hesitate to contact us.

We look forward to working with you!

Best regards,
The Aspire Academics Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This is an automated confirmation email.
  `.trim();

  return { html, text };
}

/**
 * Convert HTML to plain text by removing tags
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<li>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n\n\n+/g, "\n\n")
    .trim();
}

/**
 * Generate HTML and plain text email templates for custom admin emails
 * Wraps custom content in Aspire Academics branding
 */
export function generateCustomEmailTemplate(
  subject: string,
  customHtmlBody: string,
): EmailTemplate {
  // Escape subject for HTML safety
  const safeSubject = escapeHtml(subject);

  // HTML Email Template with custom body
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${safeSubject} - Aspire Academics</title>
  <style>
    /* Rich text formatting styles */
    .email-content h1 {
      font-size: 2em;
      font-weight: bold;
      margin: 0.67em 0;
      color: #002366;
    }
    .email-content h2 {
      font-size: 1.5em;
      font-weight: bold;
      margin: 0.75em 0;
      color: #002366;
    }
    .email-content h3 {
      font-size: 1.17em;
      font-weight: bold;
      margin: 1em 0;
      color: #002366;
    }
    .email-content p {
      margin: 1em 0;
    }
    .email-content ul {
      margin: 1em 0;
      padding-left: 2em;
      list-style-type: disc;
    }
    .email-content ol {
      margin: 1em 0;
      padding-left: 2em;
      list-style-type: decimal;
    }
    .email-content li {
      margin: 0.5em 0;
    }
    .email-content blockquote {
      border-left: 4px solid #FF8C00;
      padding-left: 1em;
      margin: 1em 0;
      color: #666;
      font-style: italic;
    }
    .email-content pre {
      background-color: #f5f5f5;
      padding: 1em;
      border-radius: 4px;
      overflow-x: auto;
      font-family: 'Courier New', Courier, monospace;
    }
    .email-content code {
      background-color: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.9em;
    }
    .email-content strong {
      font-weight: bold;
    }
    .email-content em {
      font-style: italic;
    }
    .email-content u {
      text-decoration: underline;
    }
    .email-content s {
      text-decoration: line-through;
    }
    .email-content a {
      color: #FF8C00;
      text-decoration: underline;
    }
    .email-content hr {
      border: none;
      border-top: 2px solid #e0e0e0;
      margin: 2em 0;
    }
    .email-content [style*="text-align: left"] {
      text-align: left;
    }
    .email-content [style*="text-align: center"] {
      text-align: center;
    }
    .email-content [style*="text-align: right"] {
      text-align: right;
    }
    .email-content [style*="text-align: justify"] {
      text-align: justify;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Empowering Students to Achieve Excellence</p>
            </td>
          </tr>

          <!-- Main Content (Custom Body) -->
          <tr>
            <td style="padding: 40px 30px; color: #333333; font-size: 16px; line-height: 1.6;">
              <div class="email-content">
                ${customHtmlBody}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const plainTextBody = htmlToPlainText(customHtmlBody);
  const text = `
ASPIRE ACADEMICS
Empowering Students to Achieve Excellence

${plainTextBody}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 3 grade pricing
 */
export function generateYear3PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 3 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Year 3 Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for taking the time to complete your Aspire Academics registration form.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to clearly outline the updated Year 3 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that our Year 3 pricing has been updated from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>The introduction of a new Learning Management System (LMS) for clearer communication and organisation</li>
                  <li>Increased lesson structure and planning</li>
                  <li>Improved resources and homework materials</li>
                  <li>Additional academic support options for families who require more personalised guidance</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.
                </p>
              </div>

              <!-- Program Options -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Year 3 Program Options</h2>

              <!-- Standard Package -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">STANDARD PACKAGE - $45 per week</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>2 hours per week of English and Mathematics</li>
                  <li>Structured weekly lessons aligned to school expectations and curriculum</li>
                  <li>Content books and homework booklets</li>
                  <li>Ongoing revision of core literacy and numeracy skills</li>
                  <li>Email support (72-hour response time)</li>
                </ul>
              </div>

              <!-- Premium Package -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">PREMIUM PACKAGE - $60 per week</h3>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-style: italic;">
                  Includes everything in the Standard Package, PLUS:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly one-on-one consult (30 minutes) to provide personalised feedback and support</li>
                  <li>Full access to our online Resource Bank, including extra practice questions and revision material</li>
                </ul>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Year 3 Program Registration

Dear {{parentName}},

Thank you for taking the time to complete your Aspire Academics registration form.

We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.

We are writing to clearly outline the updated Year 3 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that our Year 3 pricing has been updated from last year. This update reflects:

• The introduction of a new Learning Management System (LMS) for clearer communication and organisation
• Increased lesson structure and planning
• Improved resources and homework materials
• Additional academic support options for families who require more personalised guidance

These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YEAR 3 PROGRAM OPTIONS

STANDARD PACKAGE - $45 per week

• 2 hours per week of English and Mathematics
• Structured weekly lessons aligned to school expectations and curriculum
• Content books and homework booklets
• Ongoing revision of core literacy and numeracy skills
• Email support (72-hour response time)

PREMIUM PACKAGE - $60 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes) to provide personalised feedback and support
• Full access to our online Resource Bank, including extra practice questions and revision material

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 4 grade pricing
 */
export function generateYear4PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 4 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Year 4 Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for taking the time to complete your Aspire Academics registration form.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to clearly outline the updated Year 4 pricing and program structure for 2026, along with the next steps as we finalise classes.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that Year 4 pricing has changed from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>The introduction of a new Learning Management System (LMS) for clearer communication and organisation</li>
                  <li>Increased lesson structure and planning</li>
                  <li>Improved resources and homework materials</li>
                  <li>Additional academic support options for families who require more personalised guidance</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These updates allow us to maintain small class sizes while delivering more consistent and effective learning outcomes.
                </p>
              </div>

              <!-- Program Options -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Year 4 Program Options</h2>

              <!-- Standard Package -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">STANDARD PACKAGE - $55 per week</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>2.5 hours per week of English and Mathematics</li>
                  <li>Structured, curriculum-aligned lessons</li>
                  <li>Content books and homework booklets</li>
                  <li>Ongoing revision of core skills</li>
                  <li>Email support (72-hour response time)</li>
                </ul>
              </div>

              <!-- Premium Package -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">PREMIUM PACKAGE - $65 per week</h3>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-style: italic;">
                  Includes everything in the Standard Package, PLUS:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly one-on-one consult (30 minutes)</li>
                  <li>Full access to our online Resource Bank</li>
                </ul>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Year 4 Program Registration

Dear {{parentName}},

Thank you for taking the time to complete your Aspire Academics registration form.

We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.

We are writing to clearly outline the updated Year 4 pricing and program structure for 2026, along with the next steps as we finalise classes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that Year 4 pricing has changed from last year. This update reflects:

• The introduction of a new Learning Management System (LMS) for clearer communication and organisation
• Increased lesson structure and planning
• Improved resources and homework materials
• Additional academic support options for families who require more personalised guidance

These updates allow us to maintain small class sizes while delivering more consistent and effective learning outcomes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YEAR 4 PROGRAM OPTIONS

STANDARD PACKAGE - $55 per week

• 2.5 hours per week of English and Mathematics
• Structured, curriculum-aligned lessons
• Content books and homework booklets
• Ongoing revision of core skills
• Email support (72-hour response time)

PREMIUM PACKAGE - $65 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our online Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 5 grade pricing
 */
export function generateYear5PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 5 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Year 5 Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for taking the time to complete your Aspire Academics registration form.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to clearly outline the updated Year 5 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that our Year 5 pricing has been updated from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>The introduction of a new Learning Management System (LMS) for clearer communication and organisation</li>
                  <li>Increased lesson structure and planning</li>
                  <li>Improved resources and homework materials</li>
                  <li>Additional academic support options for families who require more personalised guidance</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.
                </p>
              </div>

              <!-- Program Options -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Year 5 Program Options</h2>

              <!-- Standard Package -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">STANDARD PACKAGE – $65 per week</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>3 hours per week of English and Mathematics</li>
                  <li>Structured lessons aligned to upper-primary expectations</li>
                  <li>Content books and homework booklets</li>
                  <li>Continuous revision and consolidation</li>
                  <li>Email support (72-hour response time)</li>
                </ul>
              </div>

              <!-- Premium Package -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">PREMIUM PACKAGE – $80 per week</h3>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-style: italic;">
                  Includes everything in the Standard Package, PLUS:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly one-on-one consult (30 minutes)</li>
                  <li>Full access to our online Resource Bank</li>
                </ul>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Year 5 Program Registration

Dear {{parentName}},

Thank you for taking the time to complete your Aspire Academics registration form.

We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.

We are writing to clearly outline the updated Year 5 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that our Year 5 pricing has been updated from last year. This update reflects:

• The introduction of a new Learning Management System (LMS) for clearer communication and organisation
• Increased lesson structure and planning
• Improved resources and homework materials
• Additional academic support options for families who require more personalised guidance

These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YEAR 5 PROGRAM OPTIONS

STANDARD PACKAGE – $65 per week

• 3 hours per week of English and Mathematics
• Structured lessons aligned to upper-primary expectations
• Content books and homework booklets
• Continuous revision and consolidation
• Email support (72-hour response time)

PREMIUM PACKAGE – $80 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our online Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 6 grade pricing
 */
export function generateYear6PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 6 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Year 6 Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for taking the time to complete your Aspire Academics registration form.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to clearly outline the updated Year 6 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that our Year 6 pricing has been updated from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>The introduction of a new Learning Management System (LMS) for clearer communication and organisation</li>
                  <li>Increased lesson structure and planning</li>
                  <li>Improved resources and homework materials</li>
                  <li>Additional academic support options for families who require more personalised guidance</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.
                </p>
              </div>

              <!-- Program Options -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Year 6 Program Options</h2>

              <!-- Standard Package -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">STANDARD PACKAGE – $65 per week</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>3 hours per week of English and Mathematics</li>
                  <li>Focus on mastery and secondary-school readiness</li>
                  <li>Structured revision and exam-style practice</li>
                  <li>Email support (72-hour response time)</li>
                </ul>
              </div>

              <!-- Premium Package -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">PREMIUM PACKAGE – $80 per week</h3>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-style: italic;">
                  Includes everything in the Standard Package, PLUS:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly one-on-one consult (30 minutes)</li>
                  <li>Full access to our Resource Bank</li>
                </ul>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Year 6 Program Registration

Dear {{parentName}},

Thank you for taking the time to complete your Aspire Academics registration form.

We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.

We are writing to clearly outline the updated Year 6 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that our Year 6 pricing has been updated from last year. This update reflects:

• The introduction of a new Learning Management System (LMS) for clearer communication and organisation
• Increased lesson structure and planning
• Improved resources and homework materials
• Additional academic support options for families who require more personalised guidance

These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YEAR 6 PROGRAM OPTIONS

STANDARD PACKAGE – $65 per week

• 3 hours per week of English and Mathematics
• Focus on mastery and secondary-school readiness
• Structured revision and exam-style practice
• Email support (72-hour response time)

PREMIUM PACKAGE – $80 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 7 grade pricing
 */
export function generateYear7PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 7 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Year 7 Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for taking the time to complete your Aspire Academics registration form.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to clearly outline the updated Year 7 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that our Year 7 pricing has been updated from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>The introduction of a new Learning Management System (LMS) for clearer communication and organisation</li>
                  <li>Increased lesson structure and planning</li>
                  <li>Improved resources and homework materials</li>
                  <li>Additional academic support options for families who require more personalised guidance</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.
                </p>
              </div>

              <!-- Program Options -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Year 7 Program Options</h2>

              <!-- Standard Package -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">STANDARD PACKAGE – $75 per week</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly English and Mathematics classes</li>
                  <li>Curriculum-aligned lessons</li>
                  <li>Continuous revision and skill development</li>
                  <li>Email support (72-hour response time)</li>
                </ul>
              </div>

              <!-- Premium Package -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">PREMIUM PACKAGE – $90 per week</h3>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-style: italic;">
                  Includes everything in the Standard Package, PLUS:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly one-on-one consult (30 minutes)</li>
                  <li>Full access to our Resource Bank</li>
                </ul>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Year 7 Program Registration

Dear {{parentName}},

Thank you for taking the time to complete your Aspire Academics registration form.

We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.

We are writing to clearly outline the updated Year 7 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that our Year 7 pricing has been updated from last year. This update reflects:

• The introduction of a new Learning Management System (LMS) for clearer communication and organisation
• Increased lesson structure and planning
• Improved resources and homework materials
• Additional academic support options for families who require more personalised guidance

These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YEAR 7 PROGRAM OPTIONS

STANDARD PACKAGE – $75 per week

• Weekly English and Mathematics classes
• Curriculum-aligned lessons
• Continuous revision and skill development
• Email support (72-hour response time)

PREMIUM PACKAGE – $90 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 8 grade pricing
 */
export function generateYear8PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 8 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Year 8 Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for taking the time to complete your Aspire Academics registration form.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to clearly outline the updated Year 8 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that our Year 8 pricing has been updated from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>The introduction of a new Learning Management System (LMS) for clearer communication and organisation</li>
                  <li>Increased lesson structure and planning</li>
                  <li>Improved resources and homework materials</li>
                  <li>Additional academic support options for families who require more personalised guidance</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.
                </p>
              </div>

              <!-- Program Options -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Year 8 Program Options</h2>

              <!-- Standard Package -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">STANDARD PACKAGE – $75 per week</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly English and Mathematics classes</li>
                  <li>Structured, curriculum-aligned lessons</li>
                  <li>Continuous revision of key topics</li>
                  <li>Email support (72-hour response time)</li>
                </ul>
              </div>

              <!-- Premium Package -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">PREMIUM PACKAGE – $90 per week</h3>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-style: italic;">
                  Includes everything in the Standard Package, PLUS:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly one-on-one consult (30 minutes)</li>
                  <li>Full access to our Resource Bank</li>
                </ul>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Year 8 Program Registration

Dear {{parentName}},

Thank you for taking the time to complete your Aspire Academics registration form.

We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.

We are writing to clearly outline the updated Year 8 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that our Year 8 pricing has been updated from last year. This update reflects:

• The introduction of a new Learning Management System (LMS) for clearer communication and organisation
• Increased lesson structure and planning
• Improved resources and homework materials
• Additional academic support options for families who require more personalised guidance

These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YEAR 8 PROGRAM OPTIONS

STANDARD PACKAGE – $75 per week

• Weekly English and Mathematics classes
• Structured, curriculum-aligned lessons
• Continuous revision of key topics
• Email support (72-hour response time)

PREMIUM PACKAGE – $90 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 9 grade pricing
 */
export function generateYear9PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 9 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Year 9 Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for taking the time to complete your Aspire Academics registration form.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to clearly outline the updated Year 9 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that our Year 9 pricing has been updated from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>The introduction of a new Learning Management System (LMS) for clearer communication and organisation</li>
                  <li>Increased lesson structure and planning</li>
                  <li>Improved resources and homework materials</li>
                  <li>Additional academic support options for families who require more personalised guidance</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.
                </p>
              </div>

              <!-- Program Options -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Year 9 Program Options</h2>

              <!-- Standard Package -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">STANDARD PACKAGE – $90 per week</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly English and Mathematics classes</li>
                  <li>Focus on exam skills, reasoning, and application</li>
                  <li>Structured revision and exam-style practice</li>
                  <li>Email support (72-hour response time)</li>
                </ul>
              </div>

              <!-- Premium Package -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">PREMIUM PACKAGE – $100 per week</h3>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-style: italic;">
                  Includes everything in the Standard Package, PLUS:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly one-on-one consult (30 minutes)</li>
                  <li>Full access to our Resource Bank</li>
                </ul>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Year 9 Program Registration

Dear {{parentName}},

Thank you for taking the time to complete your Aspire Academics registration form.

We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.

We are writing to clearly outline the updated Year 9 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that our Year 9 pricing has been updated from last year. This update reflects:

• The introduction of a new Learning Management System (LMS) for clearer communication and organisation
• Increased lesson structure and planning
• Improved resources and homework materials
• Additional academic support options for families who require more personalised guidance

These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YEAR 9 PROGRAM OPTIONS

STANDARD PACKAGE – $90 per week

• Weekly English and Mathematics classes
• Focus on exam skills, reasoning, and application
• Structured revision and exam-style practice
• Email support (72-hour response time)

PREMIUM PACKAGE – $100 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 10 grade pricing
 */
export function generateYear10PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Year 10 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Year 10 Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for taking the time to complete your Aspire Academics registration form.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to clearly outline the updated Year 10 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that our Year 10 pricing has been updated from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>The introduction of a new Learning Management System (LMS) for clearer communication and organisation</li>
                  <li>Increased lesson structure and planning</li>
                  <li>Improved resources and homework materials</li>
                  <li>Additional academic support options for families who require more personalised guidance</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.
                </p>
              </div>

              <!-- Program Options -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Year 10 Program Options</h2>

              <!-- Standard Package -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">STANDARD PACKAGE – $90 per week</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly English and Mathematics classes</li>
                  <li>Focus on exam readiness and skill mastery</li>
                  <li>Structured revision of core topics</li>
                  <li>Email support (72-hour response time)</li>
                </ul>
              </div>

              <!-- Premium Package -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">PREMIUM PACKAGE – $100 per week</h3>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-style: italic;">
                  Includes everything in the Standard Package, PLUS:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly one-on-one consult (30 minutes)</li>
                  <li>Full access to our online Resource Bank</li>
                </ul>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Year 10 Program Registration

Dear {{parentName}},

Thank you for taking the time to complete your Aspire Academics registration form.

We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.

We are writing to clearly outline the updated Year 10 pricing and program structure for 2026, and to explain the next steps as we finalise classes for the upcoming term.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that our Year 10 pricing has been updated from last year. This update reflects:

• The introduction of a new Learning Management System (LMS) for clearer communication and organisation
• Increased lesson structure and planning
• Improved resources and homework materials
• Additional academic support options for families who require more personalised guidance

These changes allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

YEAR 10 PROGRAM OPTIONS

STANDARD PACKAGE – $90 per week

• Weekly English and Mathematics classes
• Focus on exam readiness and skill mastery
• Structured revision of core topics
• Email support (72-hour response time)

PREMIUM PACKAGE – $100 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our online Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 11 grade pricing
 */
export function generateYear11PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VCE Year 11 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">VCE Year 11 Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}} and {{studentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for registering for Aspire Academics VCE Year 11 tutoring.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to confirm the updated pricing structure for 2026, along with important information regarding trial classes and enrolment.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that VCE Year 11 pricing has changed from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Increased subject depth and curriculum alignment</li>
                  <li>Improved lesson structure and assessment preparation</li>
                  <li>Enhanced resources and practice materials</li>
                  <li>Introduction of our new LMS for clearer communication and resource access</li>
                </ul>
              </div>

              <!-- Program Overview -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">VCE Year 11 Program Overview</h2>

              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>1.5-hour weekly classes</li>
                  <li>Subjects include Chemistry, Biology, Mathematical Methods, General Maths, Specialist Maths, HHD, Psychology and other VCE offerings</li>
                  <li>Focus on content mastery, application, and assessment readiness</li>
                  <li>SAC Preparation + Notes</li>
                  <li>Mentorship for mastery in Exam Situations</li>
                </ul>
                <p style="color: #002366; font-size: 18px; font-weight: bold; margin: 20px 0 0 0;">
                  Weekly Fee: $60
                </p>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
VCE Year 11 Program Registration

Dear {{parentName}} and {{studentName}},

Thank you for registering for Aspire Academics VCE Year 11 tutoring.

We are writing to confirm the updated pricing structure for 2026, along with important information regarding trial classes and enrolment.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that VCE Year 11 pricing has changed from last year. This update reflects:

• Increased subject depth and curriculum alignment
• Improved lesson structure and assessment preparation
• Enhanced resources and practice materials
• Introduction of our new LMS for clearer communication and resource access

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VCE YEAR 11 PROGRAM OVERVIEW

• 1.5-hour weekly classes
• Subjects include Chemistry, Biology, Mathematical Methods, General Maths, Specialist Maths, HHD, Psychology and other VCE offerings
• Focus on content mastery, application, and assessment readiness
• SAC Preparation + Notes
• Mentorship for mastery in Exam Situations

Weekly Fee: $60

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for Year 12 grade pricing
 */
export function generateYear12PricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VCE Year 12 Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">VCE Year 12 Registration Confirmation</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}} and {{studentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for registering for Aspire Academics VCE Year 12 tutoring.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                As students enter a critical exam year, we are writing to outline the updated pricing and program structure for 2026, along with next steps.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that VCE Year 12 pricing has changed from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Extended lesson duration to support exam preparation</li>
                  <li>Increased focus on exam technique and assessment strategy</li>
                  <li>Improved revision systems and targeted practice</li>
                  <li>Enhanced communication and tracking through our LMS</li>
                </ul>
              </div>

              <!-- VCE Year 12 Program Overview -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">VCE Year 12 Program Overview</h2>

              <!-- Program Details -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li><strong>2-hour weekly classes</strong></li>
                  <li>Subjects include <strong>Chemistry, Biology, Mathematical Methods, General Maths, Specialist Maths, HHD, Psychology</strong> and other VCE offerings</li>
                  <li>Strong emphasis on <strong>exam readiness, confidence, and performance</strong></li>
                  <li><strong>SAC Preparation + Notes</strong></li>
                  <li><strong>Mentorship for mastery in Exam Situations</strong></li>
                </ul>
              </div>

              <!-- Pricing -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px; text-align: center;">
                <h3 style="color: #002366; margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">Weekly Fee: $80</h3>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
VCE Year 12 Registration Confirmation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear {{parentName}} and {{studentName}},

Thank you for registering for Aspire Academics VCE Year 12 tutoring.

As students enter a critical exam year, we are writing to outline the updated pricing and program structure for 2026, along with next steps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that VCE Year 12 pricing has changed from last year. This update reflects:

• Extended lesson duration to support exam preparation
• Increased focus on exam technique and assessment strategy
• Improved revision systems and targeted practice
• Enhanced communication and tracking through our LMS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VCE YEAR 12 PROGRAM OVERVIEW

• 2-hour weekly classes
• Subjects include Chemistry, Biology, Mathematical Methods, General Maths, Specialist Maths, HHD, Psychology and other VCE offerings
• Strong emphasis on exam readiness, confidence, and performance
• SAC Preparation + Notes
• Mentorship for mastery in Exam Situations

WEEKLY FEE: $80

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

TERM PAYMENT: Standard payment for a 10-week term.
SEMESTER PAYMENT: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling:  10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

[Aspire Academics Logo]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics. If you have any questions, please contact us.
  `.trim();

  return { html, text };
}

export function generateSelectiveEntryPricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Selective Entry Registration Confirmation - Aspire Academics</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color: #002366; padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Aspire Academics</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Selective Entry Program Registration</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                Thank you for registering your child for the Aspire Academics Selective Entry Program.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We are writing to outline the updated pricing and program structure for 2026, and to explain the next steps as we finalise trial classes and placements.
              </p>

              <!-- Important Update Section -->
              <div style="background-color: #fff3e6; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Important Update: Pricing Changes from Last Year</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                  Please note that Selective Entry pricing has changed from last year. This update reflects:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Full alignment with current ACER-style and selective exam requirements</li>
                  <li>Increased volume of exam-style questions and structured revision</li>
                  <li>Improved lesson sequencing across English and Mathematics</li>
                  <li>Introduction of our new Learning Management System (LMS) for clearer communication, resources, and tracking</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These changes allow us to deliver a more structured, exam-focused program while maintaining small group sizes.
                </p>
              </div>

              <!-- Program Options -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Selective Entry Program Options</h2>

              <!-- Standard Package -->
              <div style="background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin-bottom: 20px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">STANDARD PACKAGE – $80 per week</h3>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly exam-focused English and Mathematics classes</li>
                  <li>Coverage of all tested areas (reading, writing, reasoning, and maths)</li>
                  <li>Continuous revision of high-frequency exam concepts</li>
                  <li>Practice and exam-style questions</li>
                  <li>Email support (72-hour response time)</li>
                </ul>
              </div>

              <!-- Premium Package -->
              <div style="background-color: #e8f4f8; border: 2px solid #FF8C00; border-radius: 6px; padding: 20px; margin-bottom: 30px;">
                <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">PREMIUM PACKAGE – $100 per week</h3>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-style: italic;">
                  Includes everything in the Standard Package, PLUS:
                </p>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>Weekly one-on-one consult (30 minutes) for personalised guidance</li>
                  <li>Full access to our Selective Entry Resource Bank, including additional practice sets and revision material</li>
                </ul>
              </div>

              <!-- Trial Classes & Payments -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Trial Classes & Payments</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0;">
                As part of our enrolment process:
              </p>

              <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 20px 0; padding-left: 20px;">
                <li>You will receive trial class details shortly, including the class time and location</li>
              </ul>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Payment Options are as follows:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 20px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    <strong>Term Payment:</strong> Standard payment for a 10-week term.
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>Semester Payment:</strong> Covers two consecutive terms. A 10% discount is applied.
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: bold;">
                Sibling Discounts:
              </p>

              <table width="100%" cellpadding="10" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; width: 40%;">
                    <strong>1 sibling:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px;">
                    10% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>2 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    15% off each enrolment
                  </td>
                </tr>
                <tr>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    <strong>3 siblings:</strong>
                  </td>
                  <td style="color: #333333; font-size: 15px; padding: 10px 20px; border-top: 1px solid #e0e0e0;">
                    20% off each enrolment
                  </td>
                </tr>
              </table>

              <!-- Class Schedule -->
              <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Class Schedule</h2>

              <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0 0 30px 0;">
                A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Kind regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Yaseen Muntasir
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 20px 0;">
                Director | Aspire Academics
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 10px;" />

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0;">
                <strong>Aspire Academics</strong><br>
                Melbourne, Victoria, Australia
              </p>
              <p style="color: #666666; font-size: 14px; margin: 0 0 15px 0;">
                Email: <a href="mailto:admin@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">admin@aspireacademics.au</a>
              </p>
              <p style="color: #999999; font-size: 12px; margin: 0;">
                This email was sent by Aspire Academics. If you have any questions, please contact us.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
ASPIRE ACADEMICS
Selective Entry Program Registration

Dear {{parentName}},

Thank you for registering your child for the Aspire Academics Selective Entry Program.

We are writing to outline the updated pricing and program structure for 2026, and to explain the next steps as we finalise trial classes and placements.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT UPDATE: PRICING CHANGES FROM LAST YEAR

Please note that Selective Entry pricing has changed from last year. This update reflects:

• Full alignment with current ACER-style and selective exam requirements
• Increased volume of exam-style questions and structured revision
• Improved lesson sequencing across English and Mathematics
• Introduction of our new Learning Management System (LMS) for clearer communication, resources, and tracking

These changes allow us to deliver a more structured, exam-focused program while maintaining small group sizes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SELECTIVE ENTRY PROGRAM OPTIONS

STANDARD PACKAGE – $80 per week

• Weekly exam-focused English and Mathematics classes
• Coverage of all tested areas (reading, writing, reasoning, and maths)
• Continuous revision of high-frequency exam concepts
• Practice and exam-style questions
• Email support (72-hour response time)

PREMIUM PACKAGE – $100 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes) for personalised guidance
• Full access to our Selective Entry Resource Bank, including additional practice sets and revision material

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TRIAL CLASSES & PAYMENTS

As part of our enrolment process:

• You will receive trial class details shortly, including the class time and location

Payment Options are as follows:

Term Payment: Standard payment for a 10-week term.
Semester Payment: Covers two consecutive terms. A 10% discount is applied.

Sibling Discounts:

1 sibling: 10% off each enrolment
2 siblings: 15% off each enrolment
3 siblings: 20% off each enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLASS SCHEDULE

A member of our team will be in touch within the next 48-72 hours to allocate students into respective classes with timings confirmed.

Kind regards,
Yaseen Muntasir
Director | Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: admin@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

/**
 * Generate HTML and plain text email templates for registration confirmation
 */
export function generateRegistrationEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
            body {
                font-family: sans-serif;
                line-height: 19.5px;
                font-size: 13px;
            }

            .text-primary {
                font-size: 15px;
                font-weight: 700;
            }
        </style>
    </head>
    <body>
        <p>Dear Parents and Guardians,</p>
        <br />
        <p>Thank you for taking the time to complete your Aspire Academics registration form.</p>
        <br />
        <p>
            We are pleased to confirm that we have successfully received your submission. Your child's details are now
            being processed as part of our term onboarding.
        </p>
        <hr />
        <p class="text-primary">What Happens Next</p>
        <br />
        <p>Within the next 24-48 hours, you will receive a follow-up email confirming:</p>
        <ul>
            <li>Your child's allocated class(es)</li>
            <br />
            <li>Class schedule and start date</li>
            <br />
            <li>Payment confirmation (if applicable)</li>
            <br />
            <li>Access details for our new Learning Management System (LMS)</li>
        </ul>
        <br />
        <p>Once LMS access is provided, you will be able to:</p>
        <ul>
            <li>View class information and resources</li>
            <br />
            <li>Receive announcements and updates</li>
            <br />
            <li>Communicate directly with Aspire Academics</li>
        </ul>
        <hr />
        <p>
            If you have any urgent questions in the meantime, please feel free to contact us via email. Otherwise, we
            look forward to welcoming your child to the upcoming term and continuing their learning journey with Aspire
            Academics.
        </p>
        <br />
        <p>Thank you once again for your cooperation and support.</p>
        <br />
        <p>Kind regards</p>
        <p>Yaseen Muntasir</p>
        <p>Director | Aspire Academics</p>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
Dear Parents and Guardians,

Thank you for taking the time to complete your Aspire Academics registration form.

We are pleased to confirm that we have successfully received your submission. Your child's details are now being processed as part of our term onboarding.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

WHAT HAPPENS NEXT

Within the next 24-48 hours, you will receive a follow-up email confirming:

• Your child's allocated class(es)
• Class schedule and start date
• Payment confirmation (if applicable)
• Access details for our new Learning Management System (LMS)

Once LMS access is provided, you will be able to:

• View class information and resources
• Receive announcements and updates
• Communicate directly with Aspire Academics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

If you have any urgent questions in the meantime, please feel free to contact us via email. Otherwise, we look forward to welcoming your child to the upcoming term and continuing their learning journey with Aspire Academics.

Thank you once again for your cooperation and support.

Kind regards
Yaseen Muntasir
Director | Aspire Academics
  `.trim();

  return { html, text };
}

/**
 * Supported template variables for email personalization
 */
export const TEMPLATE_VARIABLES = {
  parentName: '{{parentName}}',
  studentName: '{{studentName}}',
  courseName: '{{courseName}}',
  studentEmail: '{{studentEmail}}',
  parentEmail: '{{parentEmail}}',
} as const;

/**
 * Replace template variables with actual values
 * Escapes HTML in variable values for security
 */
export function replaceTemplateVariables(
  content: string,
  data: {
    parentName: string;
    studentName: string;
    courseName?: string;
    studentEmail: string;
    parentEmail: string;
  }
): string {
  let result = content;

  // Replace with HTML-escaped values, use fallbacks for missing data
  result = result.replace(/\{\{parentName\}\}/g, escapeHtml(data.parentName || 'Parent'));
  result = result.replace(/\{\{studentName\}\}/g, escapeHtml(data.studentName || 'Student'));
  result = result.replace(/\{\{courseName\}\}/g, escapeHtml(data.courseName || 'the course'));
  result = result.replace(/\{\{studentEmail\}\}/g, escapeHtml(data.studentEmail || ''));
  result = result.replace(/\{\{parentEmail\}\}/g, escapeHtml(data.parentEmail || ''));

  return result;
}

/**
 * Get list of available template variables with descriptions
 */
export function getAvailableVariables(): Array<{ variable: string; description: string }> {
  return [
    { variable: '{{parentName}}', description: "Parent's name" },
    { variable: '{{studentName}}', description: "Student's name" },
    { variable: '{{courseName}}', description: 'Course name' },
    { variable: '{{studentEmail}}', description: "Student's email" },
    { variable: '{{parentEmail}}', description: "Parent's email" },
  ];
}

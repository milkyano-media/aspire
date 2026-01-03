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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 YEAR 3 - POST REGISTRATION</h1>
            <br />
            <p>Dear Parents and Guardians,</p>
            <br />
            <p>Thank you for completing your child's registration for the Aspire Academics Year 3 program.</p>
            <br />
            <p>Below is an overview of the program structure, pricing, and next steps.</p>
            <hr />
        </header>
        <section>
            <h2>📘 Year 3 Program Options</h2>
            <br />
            <p>STANDARD PACKAGE - $45 per week</p>
            <ul>
                <li>2 hours per week (English & Mathematics)</li>
                <br />
                <li>Structured weekly lessons</li>
                <br />
                <li>Content books and homework booklets</li>
                <br />
                <li>Continuous revision of key skills</li>
                <br />
                <li>Email support (72-hour response time)</li>
            </ul>
            <br />
            <p>PREMIUM PACKAGE - $60 per week</p>
            <p>Includes everything in the Standard Package, PLUS:</p>
            <ul>
                <li>Weekly one-on-one consult (30 minutes)</li>
                <br />
                <li>Full access to our Resource Bank</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>🎯 What Happens Next</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options will be provided after the trial class to confirm enrolment</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Fees are charged termly</li>
                <br />
                <li>Enrolment is confirmed once payment is received</li>
                <br />
                <li>LMS access is provided upon confirmation</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir</p>
            <p>Director | Aspire Academics—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 YEAR 3 - POST REGISTRATION

Dear Parents and Guardians,

Thank you for completing your child's registration for the Aspire Academics Year 3 program.

Below is an overview of the program structure, pricing, and next steps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 YEAR 3 PROGRAM OPTIONS

STANDARD PACKAGE - $45 per week

• 2 hours per week (English & Mathematics)
• Structured weekly lessons
• Content books and homework booklets
• Continuous revision of key skills
• Email support (72-hour response time)

PREMIUM PACKAGE - $60 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 WHAT HAPPENS NEXT

• Trial class details will be sent shortly
• Payment options will be provided after the trial class to confirm enrolment

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Fees are charged termly
• Enrolment is confirmed once payment is received
• LMS access is provided upon confirmation

Kind regards,
Yaseen Muntasir
Director | Aspire Academics
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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 YEAR 4 - POST REGISTRATION</h1>
            <br />
            <p>Dear Parents and Guardians,</p>
            <br />
            <p>Thank you for completing your child's registration for the Aspire Academics Year 4 program.</p>
            <hr />
        </header>
        <section>
            <h2>📘 Year 4 Program Options</h2>
            <br />
            <p>STANDARD PACKAGE - $55 per week</p>
            <ul>
                <li>2.5 hours per week (English & Mathematics)</li>
                <br />
                <li>Structured, curriculum-aligned lessons</li>
                <br />
                <li>Ongoing revision</li>
                <br />
                <li>Email support (72-hour response time)</li>
            </ul>
            <br />
            <p>PREMIUM PACKAGE - $65 per week</p>
            <p>Includes everything in the Standard Package, PLUS:</p>
            <ul>
                <li>Weekly one-on-one consult (30 minutes)</li>
                <br />
                <li>Full access to our Resource Bank</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options will follow after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Termly payment structure</li>
                <br />
                <li>Enrolment confirmed upon payment</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 YEAR 4 - POST REGISTRATION

Dear Parents and Guardians,

Thank you for completing your child's registration for the Aspire Academics Year 4 program.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 YEAR 4 PROGRAM OPTIONS

STANDARD PACKAGE - $55 per week

• 2.5 hours per week (English & Mathematics)
• Structured, curriculum-aligned lessons
• Ongoing revision
• Email support (72-hour response time)

PREMIUM PACKAGE - $65 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options will follow after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Termly payment structure
• Enrolment confirmed upon payment

Kind regards,
Yaseen Muntasir
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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 YEAR 5 - POST REGISTRATION</h1>
            <br />
            <p>Dear Parents and Guardians,</p>
            <br />
            <p>Thank you for registering your child for the Aspire Academics Year 5 program.</p>
            <hr />
        </header>
        <section>
            <h2>📘 Year 5 Program Options</h2>
            <br />
            <p>STANDARD PACKAGE - $65 per week</p>
            <ul>
                <li>3 hours per week (English & Mathematics)</li>
                <br />
                <li>Structured lessons aligned to upper-primary expectations</li>
                <br />
                <li>Content books and homework booklets</li>
                <br />
                <li>Continuous revision</li>
                <br />
                <li>Email support (72-hour response time)</li>
            </ul>
            <br />
            <p>PREMIUM PACKAGE - $80 per week</p>
            <p>Includes everything in the Standard Package, PLUS:</p>
            <ul>
                <li>Weekly one-on-one consult (30 minutes)</li>
                <br />
                <li>Full access to our Resource Bank</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options provided after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Fees charged termly</li>
                <br />
                <li>Enrolment confirmed upon payment</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 YEAR 5 - POST REGISTRATION

Dear Parents and Guardians,

Thank you for registering your child for the Aspire Academics Year 5 program.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 YEAR 5 PROGRAM OPTIONS

STANDARD PACKAGE - $65 per week

• 3 hours per week (English & Mathematics)
• Structured lessons aligned to upper-primary expectations
• Content books and homework booklets
• Continuous revision
• Email support (72-hour response time)

PREMIUM PACKAGE - $80 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options provided after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Fees charged termly
• Enrolment confirmed upon payment

Kind regards,
Yaseen Muntasir
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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 YEAR 6 - POST REGISTRATION</h1>
            <br />
            <p>Dear Parents and Guardians,</p>
            <br />
            <p>Thank you for completing registration for the Aspire Academics Year 6 program.</p>
            <hr />
        </header>
        <section>
            <h2>📘 Year 6 Program Options</h2>
            <br />
            <p>STANDARD PACKAGE - $65 per week</p>
            <ul>
                <li>3 hours per week (English & Mathematics)</li>
                <br />
                <li>Focus on upper-primary mastery and transition to secondary</li>
                <br />
                <li>Structured revision and exam-style practice</li>
                <br />
                <li>Homework resources</li>
                <br />
                <li>Email support (72-hour response time)</li>
            </ul>
            <br />
            <p>PREMIUM PACKAGE - $80 per week</p>
            <p>Includes everything in the Standard Package, PLUS:</p>
            <ul>
                <li>Weekly one-on-one consult (30 minutes)</li>
                <br />
                <li>Full access to our Resource Bank</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options will follow after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Term-based payments</li>
                <br />
                <li>Enrolment confirmed once payment is received</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 YEAR 6 - POST REGISTRATION

Dear Parents and Guardians,

Thank you for completing registration for the Aspire Academics Year 6 program.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 YEAR 6 PROGRAM OPTIONS

STANDARD PACKAGE - $65 per week

• 3 hours per week (English & Mathematics)
• Focus on upper-primary mastery and transition to secondary
• Structured revision and exam-style practice
• Homework resources
• Email support (72-hour response time)

PREMIUM PACKAGE - $80 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options will follow after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Term-based payments
• Enrolment confirmed once payment is received

Kind regards,
Yaseen Muntasir
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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 YEAR 7 - POST REGISTRATION</h1>
            <br />
            <p>Dear Parents and Guardians,</p>
            <br />
            <p>Thank you for registering your child for the Aspire Academics Year 7 program.</p>
            <hr />
        </header>
        <section>
            <h2>📘 Year 7 Program Options</h2>
            <br />
            <p>STANDARD PACKAGE - $75 per week</p>
            <ul>
                <li>Weekly English & Mathematics classes</li>
                <br />
                <li>Curriculum-aligned lessons</li>
                <br />
                <li>Ongoing revision and skill development</li>
                <br />
                <li>Homework and practice resources</li>
                <br />
                <li>Email support (72-hour response time)</li>
            </ul>
            <br />
            <p>PREMIUM PACKAGE - $90 per week</p>
            <p>Includes everything in the Standard Package, PLUS:</p>
            <ul>
                <li>Weekly one-on-one consult (30 minutes)</li>
                <br />
                <li>Full access to our Resource Bank</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options will be sent after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Fees charged termly</li>
                <br />
                <li>Enrolment confirmed upon payment</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 YEAR 7 - POST REGISTRATION

Dear Parents and Guardians,

Thank you for registering your child for the Aspire Academics Year 7 program.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 YEAR 7 PROGRAM OPTIONS

STANDARD PACKAGE - $75 per week

• Weekly English & Mathematics classes
• Curriculum-aligned lessons
• Ongoing revision and skill development
• Homework and practice resources
• Email support (72-hour response time)

PREMIUM PACKAGE - $90 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options will be sent after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Fees charged termly
• Enrolment confirmed upon payment

Kind regards,
Yaseen Muntasir
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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 YEAR 8 - POST REGISTRATION</h1>
            <br />
            <p>Dear Parents and Guardians,</p>
            <br />
            <p>Thank you for completing registration for the Aspire Academics Year 8 program.</p>
            <hr />
        </header>
        <section>
            <h2>📘 Year 8 Program Options</h2>
            <br />
            <p>STANDARD PACKAGE - $75 per week</p>
            <ul>
                <li>Weekly English & Mathematics classes</li>
                <br />
                <li>Structured, curriculum-aligned lessons</li>
                <br />
                <li>Continuous revision of key topics</li>
                <br />
                <li>Homework and practice resources</li>
                <br />
                <li>Email support (72-hour response time)</li>
            </ul>
            <br />
            <p>PREMIUM PACKAGE - $90 per week</p>
            <p>Includes everything in the Standard Package, PLUS:</p>
            <ul>
                <li>Weekly one-on-one consult (30 minutes)</li>
                <br />
                <li>Full access to our Resource Bank</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options provided after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Term-based payments</li>
                <br />
                <li>Enrolment confirmed upon payment</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 YEAR 8 - POST REGISTRATION

Dear Parents and Guardians,

Thank you for completing registration for the Aspire Academics Year 8 program.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 YEAR 8 PROGRAM OPTIONS

STANDARD PACKAGE - $75 per week

• Weekly English & Mathematics classes
• Structured, curriculum-aligned lessons
• Continuous revision of key topics
• Homework and practice resources
• Email support (72-hour response time)

PREMIUM PACKAGE - $90 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options provided after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Term-based payments
• Enrolment confirmed upon payment

Kind regards,
Yaseen Muntasir
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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 YEAR 9 - POST REGISTRATION</h1>
            <br />
            <p>Dear Parents and Guardians,</p>
            <br />
            <p>Thank you for registering your child for the Aspire Academics Year 9 program.</p>
            <hr />
        </header>
        <section>
            <h2>📘 Year 9 Program Options</h2>
            <br />
            <p>STANDARD PACKAGE - $90 per week</p>
            <ul>
                <li>Weekly English & Mathematics classes</li>
                <br />
                <li>Strong focus on exam skills and reasoning</li>
                <br />
                <li>Structured revision</li>
                <br />
                <li>Homework and exam-style practice</li>
                <br />
                <li>Email support (72-hour response time)</li>
            </ul>
            <br />
            <p>PREMIUM PACKAGE - $100 per week</p>
            <p>Includes everything in the Standard Package, PLUS:</p>
            <ul>
                <li>Weekly one-on-one consult (30 minutes)</li>
                <br />
                <li>Full access to our Resource Bank</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options sent after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Fees charged termly</li>
                <br />
                <li>Enrolment confirmed once payment is received</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 YEAR 9 - POST REGISTRATION

Dear Parents and Guardians,

Thank you for registering your child for the Aspire Academics Year 9 program.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 YEAR 9 PROGRAM OPTIONS

STANDARD PACKAGE - $90 per week

• Weekly English & Mathematics classes
• Strong focus on exam skills and reasoning
• Structured revision
• Homework and exam-style practice
• Email support (72-hour response time)

PREMIUM PACKAGE - $100 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options sent after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Fees charged termly
• Enrolment confirmed once payment is received

Kind regards,
Yaseen Muntasir
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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 YEAR 10 - POST REGISTRATION</h1>
            <br />
            <p>Dear Parents and Guardians,</p>
            <br />
            <p>Thank you for completing registration for the Aspire Academics Year 10 program.</p>
            <hr />
        </header>
        <section>
            <h2>📘 Year 10 Program Options</h2>
            <br />
            <p>STANDARD PACKAGE - $90 per week</p>
            <ul>
                <li>Weekly English & Mathematics classes</li>
                <br />
                <li>Focus on exam preparation and skill mastery</li>
                <br />
                <li>Structured revision of core topics</li>
                <br />
                <li>Homework and exam-style practice</li>
                <br />
                <li>Email support (72-hour response time)</li>
            </ul>
            <br />
            <p>PREMIUM PACKAGE - $100 per week</p>
            <p>Includes everything in the Standard Package, PLUS:</p>
            <ul>
                <li>Weekly one-on-one consult (30 minutes)</li>
                <br />
                <li>Full access to our Resource Bank</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options provided after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Term-based payments</li>
                <br />
                <li>Enrolment confirmed upon payment</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 YEAR 10 - POST REGISTRATION

Dear Parents and Guardians,

Thank you for completing registration for the Aspire Academics Year 10 program.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 YEAR 10 PROGRAM OPTIONS

STANDARD PACKAGE - $90 per week

• Weekly English & Mathematics classes
• Focus on exam preparation and skill mastery
• Structured revision of core topics
• Homework and exam-style practice
• Email support (72-hour response time)

PREMIUM PACKAGE - $100 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options provided after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Term-based payments
• Enrolment confirmed upon payment

Kind regards,
Yaseen Muntasir
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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 VCE YEAR 11 - ALL SUBJECTS</h1>
            <br />
            <p>Dear Parents and Students,</p>
            <br />
            <p>Thank you for registering for Aspire Academics VCE Year 11 tutoring.</p>
            <hr />
        </header>
        <section>
            <h2>🎓 VCE Year 11 Program</h2>
            <ul>
                <li>1.5-hour weekly classes</li>
                <br />
                <li>Subjects include Chemistry, Biology, Mathematical Methods and more</li>
                <br />
                <li>Exam-aligned teaching focused on content mastery</li>
            </ul>
            <br />
            <p>Weekly Fee: $60</p>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options will follow after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Term-based payments</li>
                <br />
                <li>Enrolment confirmed once payment is received</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 VCE YEAR 11 - ALL SUBJECTS

Dear Parents and Students,

Thank you for registering for Aspire Academics VCE Year 11 tutoring.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 VCE YEAR 11 PROGRAM

• 1.5-hour weekly classes
• Subjects include Chemistry, Biology, Mathematical Methods and more
• Exam-aligned teaching focused on content mastery

Weekly Fee: $60

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options will follow after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Term-based payments
• Enrolment confirmed once payment is received

Kind regards,
Yaseen Muntasir
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
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 VCE YEAR 12 - ALL SUBJECTS</h1>
            <br />
            <p>Dear Parents and Students,</p>
            <br />
            <p>Thank you for registering for Aspire Academics VCE Year 12 tutoring.</p>
            <hr />
        </header>
        <section>
            <h2>🎓 VCE Year 12 Program</h2>
            <ul>
                <li>2-hour weekly classes</li>
                <br />
                <li>Subjects include Chemistry, Biology, Mathematical Methods and more</li>
                <br />
                <li>Focus on exam readiness and performance</li>
            </ul>
            <br />
            <p>Weekly Fee: $80</p>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options provided after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Fees charged termly</li>
                <br />
                <li>Enrolment confirmed upon payment</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 VCE YEAR 12 - ALL SUBJECTS

Dear Parents and Students,

Thank you for registering for Aspire Academics VCE Year 12 tutoring.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎓 VCE YEAR 12 PROGRAM

• 2-hour weekly classes
• Subjects include Chemistry, Biology, Mathematical Methods and more
• Focus on exam readiness and performance

Weekly Fee: $80

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options provided after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Fees charged termly
• Enrolment confirmed upon payment

Kind regards,
Yaseen Muntasir
  `.trim();

  return { html, text };
}

export function generateSelectiveEntryPricingEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <style>
        body {
            font-family: sans-serif;
            line-height: 19.5px;
            font-size: 13px;
        }

        h1 {
            font-size: 19.5px;
        }

        h2 {
            font-size: 15px;
        }
    </style>
    <body>
        <header>
            <h1>📩 SELECTIVE ENTRY - POST REGISTRATION</h1>
            <br />
            <p>Dear Parents and Guardians,</p>
            <br />
            <p>Thank you for registering your child for the Aspire Academics Selective Entry Program.</p>
            <hr />
        </header>
        <section>
            <h2>📘 Selective Entry Program Options</h2>
            <br />
            <p>STANDARD PACKAGE - $80 per week</p>
            <ul>
                <li>Weekly exam-focused English & Mathematics</li>
                <br />
                <li>ACER-style and selective exam preparation</li>
                <br />
                <li>Continuous revision of tested concepts</li>
                <br />
                <li>Practice and exam-style questions</li>
                <br />
                <li>Email support (72-hour response time)</li>
            </ul>
            <br />
            <p>PREMIUM PACKAGE - $100 per week</p>
            <p>Includes everything in the Standard Package, PLUS:</p>
            <ul>
                <li>Weekly one-on-one consult (30 minutes)</li>
                <br />
                <li>Full access to our Selective Entry Resource Bank</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>🎯 Next Steps</h2>
            <ul>
                <li>Trial class details will be sent shortly</li>
                <br />
                <li>Payment options will follow after the trial class</li>
            </ul>
        </section>
        <hr />
        <section>
            <h2>💳 Payment Policy</h2>
            <ul>
                <li>Fees charged termly</li>
                <br />
                <li>Enrolment confirmed upon payment</li>
            </ul>
        </section>
        <section>
            <p>Kind regards,</p>
            <p>Yaseen Muntasir—</p>
        </section>
    </body>
</html>
  `.trim();

  // Plain Text Email Template
  const text = `
📩 SELECTIVE ENTRY - POST REGISTRATION

Dear Parents and Students,

Thank you for registering your child for the Aspire Academics Selective Entry Program.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📘 📘 Selective Entry Program Options

STANDARD PACKAGE - $80 per week

• Weekly exam-focused English & Mathematics
• ACER-style and selective exam preparation
• Structured revision of core topics
• Continuous revision of tested concepts
• Practice and exam-style questions
• Email support (72-hour response time)

PREMIUM PACKAGE - $100 per week

Includes everything in the Standard Package, PLUS:

• Weekly one-on-one consult (30 minutes)
• Full access to our Selective Entry Resource Bank

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 NEXT STEPS

• Trial class details will be sent shortly
• Payment options will follow after the trial class

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💳 PAYMENT POLICY

• Fees charged termly
• Enrolment confirmed upon payment

Kind regards,
Yaseen Muntasir
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

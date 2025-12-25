import { ConsultationFormData } from '@/components/aspire/ConsultationForm/schema';

// Email data type without the terms checkbox
type EmailFormData = Omit<ConsultationFormData, 'terms'>;

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Format city value for display
 */
function formatCity(city: string): string {
  return city
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format school year for display
 */
function formatSchoolYear(year?: string): string {
  if (!year) return 'Not specified';
  return year
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format program name for display
 */
function formatProgram(program: string): string {
  const programMap: Record<string, string> = {
    'consult': 'Consultation',
    'selective_entry': 'Selective Entry',
    'vce': 'VCE',
    'public_speaking': 'Public Speaking',
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
  const safeMessage = message ? escapeHtml(message) : 'No additional message provided';
  const safePhone = escapeHtml(`${countryCode} ${phone}`);

  // Format display values
  const displayCity = formatCity(city);
  const displaySchoolYear = formatSchoolYear(schoolYear);
  const displayProgram = formatProgram(program);
  const submissionDate = new Date().toLocaleDateString('en-AU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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
Message:        ${message || 'No additional message provided'}
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

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

/**
 * Convert HTML to plain text by removing tags
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/\n\n\n+/g, '\n\n')
    .trim();
}

/**
 * Generate HTML and plain text email templates for custom admin emails
 * Wraps custom content in Aspire Academics branding
 */
export function generateCustomEmailTemplate(
  subject: string,
  customHtmlBody: string
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

interface RegistrationData {
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
    vceClass: string;
    schoolName: string;
    additionalDetails: string;
    preference: string;
  };
}

/**
 * Format gender for display
 */
function formatGender(gender: string): string {
  const genderMap: Record<string, string> = {
    'M': 'Male',
    'F': 'Female',
    'O': 'Other',
  };
  return genderMap[gender] || gender;
}

/**
 * Format school grade for display
 */
function formatSchoolGrade(grade: string): string {
  const gradeMap: Record<string, string> = {
    'C': 'Year 3',
    'D': 'Year 4',
    'E': 'Year 5',
    'F': 'Year 6',
    'G': 'Year 7',
    'H': 'Year 8',
    'I': 'Year 11',
    'J': 'Year 12',
  };
  return gradeMap[grade] || grade;
}

/**
 * Format learning preference for display
 */
function formatPreference(preference: string): string {
  const preferenceMap: Record<string, string> = {
    'online': 'Online',
    'offline': 'In-Person (Offline)',
    'hybrid': 'Hybrid (Both)',
  };
  return preferenceMap[preference] || preference;
}

/**
 * Format relationship for display
 */
function formatRelationship(relationship: string): string {
  return relationship.charAt(0).toUpperCase() + relationship.slice(1);
}

/**
 * Generate HTML and plain text email templates for registration confirmation
 */
export function generateRegistrationEmailTemplate(data: RegistrationData): EmailTemplate {
  const { parent, student } = data;

  // Escape user input for HTML
  const safeParentName = escapeHtml(parent.name);
  const safeParentEmail = escapeHtml(parent.email);
  const safeParentPhone = escapeHtml(parent.phoneNumber);
  const safeParentAddress = escapeHtml(parent.address);

  const safeStudentName = escapeHtml(student.name);
  const safeStudentEmail = escapeHtml(student.email);
  const safeStudentPhone = escapeHtml(student.phoneNumber);
  const safeSchoolName = escapeHtml(student.schoolName);
  const safeAdditionalDetails = student.additionalDetails
    ? escapeHtml(student.additionalDetails)
    : 'None provided';
  const safeVceClass = student.vceClass.trim() ? escapeHtml(student.vceClass) : 'Not applicable';

  // Format display values
  const displayGender = formatGender(student.gender);
  const displayGrade = formatSchoolGrade(student.schoolGrade);
  const displayPreference = formatPreference(student.preference);
  const displayRelationship = formatRelationship(parent.relationship);
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
  <title>Registration Confirmation - Aspire Academics</title>
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
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 24px;">Dear ${safeParentName},</h2>

              <!-- Thank You Message -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for registering ${safeStudentName} with Aspire Academics! We're thrilled to welcome your family to our learning community.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Your registration has been successfully processed. Below is a summary of the information you provided:
              </p>

              <!-- Parent Information -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; overflow: hidden; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Parent/Guardian Information</h3>

                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; width: 40%;">Name:</td>
                        <td style="color: #333333; font-size: 14px;">${safeParentName}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Relationship:</td>
                        <td style="color: #333333; font-size: 14px;">${displayRelationship}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Email:</td>
                        <td style="color: #333333; font-size: 14px;">${safeParentEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Phone:</td>
                        <td style="color: #333333; font-size: 14px;">${safeParentPhone}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; vertical-align: top;">Address:</td>
                        <td style="color: #333333; font-size: 14px; line-height: 1.5;">${safeParentAddress}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Student Information -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; overflow: hidden; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #002366; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Student Information</h3>

                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; width: 40%;">Name:</td>
                        <td style="color: #333333; font-size: 14px;">${safeStudentName}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Email:</td>
                        <td style="color: #333333; font-size: 14px;">${safeStudentEmail}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Phone:</td>
                        <td style="color: #333333; font-size: 14px;">${safeStudentPhone}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Gender:</td>
                        <td style="color: #333333; font-size: 14px;">${displayGender}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Date of Birth:</td>
                        <td style="color: #333333; font-size: 14px;">${escapeHtml(student.dateOfBirth)}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">School Grade:</td>
                        <td style="color: #333333; font-size: 14px;">${displayGrade}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">School Name:</td>
                        <td style="color: #333333; font-size: 14px;">${safeSchoolName}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">VCE Class:</td>
                        <td style="color: #333333; font-size: 14px;">${safeVceClass}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Learning Preference:</td>
                        <td style="color: #333333; font-size: 14px;">${displayPreference}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold; vertical-align: top;">Additional Details:</td>
                        <td style="color: #333333; font-size: 14px; line-height: 1.5;">${safeAdditionalDetails}</td>
                      </tr>
                      <tr>
                        <td style="color: #666666; font-size: 14px; font-weight: bold;">Registered:</td>
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
                  <li>Our team will review the registration and set up ${safeStudentName}'s student account</li>
                  <li>You will receive course details and schedule information within 24-48 hours</li>
                  <li>We'll contact you to discuss any specific learning needs or goals</li>
                  <li>If you have any questions, feel free to reach out to us anytime</li>
                </ul>
              </div>

              <!-- Closing Message -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                We're excited to support ${safeStudentName} on their academic journey and look forward to helping them achieve their goals!
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">
                If you have any questions or need assistance, please don't hesitate to contact us.
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

Dear ${parent.name},

Thank you for registering ${student.name} with Aspire Academics! We're thrilled to welcome your family to our learning community.

Your registration has been successfully processed. Below is a summary of the information you provided:

PARENT/GUARDIAN INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:           ${parent.name}
Relationship:   ${displayRelationship}
Email:          ${parent.email}
Phone:          ${parent.phoneNumber}
Address:        ${parent.address}

STUDENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:               ${student.name}
Email:              ${student.email}
Phone:              ${student.phoneNumber}
Gender:             ${displayGender}
Date of Birth:      ${student.dateOfBirth}
School Grade:       ${displayGrade}
School Name:        ${student.schoolName}
VCE Class:          ${student.vceClass.trim() || 'Not applicable'}
Learning Preference: ${displayPreference}
Additional Details: ${student.additionalDetails || 'None provided'}
Registered:         ${submissionDate}

WHAT HAPPENS NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Our team will review the registration and set up ${student.name}'s student account
• You will receive course details and schedule information within 24-48 hours
• We'll contact you to discuss any specific learning needs or goals
• If you have any questions, feel free to reach out to us anytime

We're excited to support ${student.name} on their academic journey and look forward to helping them achieve their goals!

If you have any questions or need assistance, please don't hesitate to contact us.

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

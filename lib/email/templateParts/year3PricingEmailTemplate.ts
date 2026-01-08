interface EmailTemplate {
  html: string;
  text: string;
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
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">New Pricing Structure</h2>
                <ul style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                  <li>The introduction of a new Learning Management System (LMS) for clearer communication and organisation</li>
                  <li>Increased lesson structure and planning</li>
                  <li>Improved resources and homework materials</li>
                  <li>Additional academic support options for families who require more personalised guidance</li>
                </ul>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 15px 0 0 0;">
                  These allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.
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
                Email: <a href="mailto:info@aspireacademics.au" style="color: #FF8C00; text-decoration: none;">info@aspireacademics.au</a>
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

New Pricing Structure

• The introduction of a new Learning Management System (LMS) for clearer communication and organisation
• Increased lesson structure and planning
• Improved resources and homework materials
• Additional academic support options for families who require more personalised guidance

These allow us to maintain small group sizes while continuing to deliver high-quality teaching and strong learning outcomes.

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
Email: info@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

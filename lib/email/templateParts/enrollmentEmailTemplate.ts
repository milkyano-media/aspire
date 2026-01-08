interface EmailTemplate {
  html: string;
  text: string;
}

export function generateEnrollmentEmailTemplate(): EmailTemplate {
  // HTML Email Template
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Aspire Academics Portal</title>
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
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Welcome to the Portal</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px 30px;">

              <!-- Greeting -->
              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Dear {{parentName}},
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                We're happy to share that your child is now enrolled in our Aspire Academics Portal.
              </p>

              <!-- Portal Access Section -->
              <div style="background-color: #e8f4f8; border-left: 4px solid #FF8C00; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
                <h2 style="color: #002366; margin: 0 0 15px 0; font-size: 20px; font-weight: bold;">Portal Access Instructions</h2>
                <p style="color: #333333; font-size: 15px; line-height: 1.6; margin: 0;">
                  {{studentName}} can access the ASPIRE portal through the mobile app or website. When opening it for the first time, you'll be asked to enter an institution code.
                </p>
              </div>

              <!-- Institution Code -->
              <h2 style="color: #002366; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #FF8C00; padding-bottom: 10px;">Institution Code</h2>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 30px;">
                <tr>
                  <td style="background-color: #002366; padding: 20px; text-align: center; border-radius: 6px;">
                    <p style="color: #ffffff; font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; margin: 0; letter-spacing: 2px;">
                      aspireacademics
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Once the code is entered, you can log in through the app or your web browser.
              </p>

              <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                If you have any questions or need help getting started, please don't hesitate to reach out, we're always happy to help.
              </p>

              <!-- Signature -->
              <p style="color: #333333; font-size: 16px; margin: 0;">
                Warm regards,
              </p>
              <p style="color: #002366; font-size: 16px; font-weight: bold; margin: 5px 0;">
                Aspire Academics Team
              </p>

              <!-- Logo -->
              <img src="https://aspireacademics.au/logo.png" alt="Aspire Academics Logo" style="width: 120px; height: auto; margin-top: 20px;" />

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
Welcome to the Portal

Dear {{parentName}},

We're happy to share that your child is now enrolled in our Aspire Academics Portal.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PORTAL ACCESS INSTRUCTIONS

{{studentName}} can access the ASPIRE portal through the mobile app or website. When opening it for the first time, you'll be asked to enter an institution code.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INSTITUTION CODE

aspireacademics

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Once the code is entered, you can log in through the app or your web browser.

If you have any questions or need help getting started, please don't hesitate to reach out, we're always happy to help.

Warm regards,
Aspire Academics Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Aspire Academics
Melbourne, Victoria, Australia
Email: info@aspireacademics.au

This email was sent by Aspire Academics.
  `.trim();

  return { html, text };
}

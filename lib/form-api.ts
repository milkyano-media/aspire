/**
 * Form API submission utilities
 * Handles external API integrations for form submissions
 */

export interface FormSubmissionPayload {
  formData: Record<string, any>;
  spreadsheetUrl: string;
  emailReceiver: string;
  metadata: {
    formType: string;
    subject: string;
  };
}

/**
 * Submit form data to external API
 * @throws Error if submission fails
 */
export async function submitToExternalAPI(
  payload: FormSubmissionPayload
): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_EXTERNAL_API_URL is not configured");
  }

  const response = await fetch(`${apiUrl}/api/form-submissions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `External API submission failed: ${response.status} - ${errorText}`
    );
  }
}

/**
 * Submit form data to Pabbly webhook
 * @throws Error if submission fails
 */
export async function submitToPabbly(data: Record<string, any>): Promise<void> {
  const webhookUrl = process.env.NEXT_PUBLIC_PABBLY_WEBHOOK_URL;

  if (!webhookUrl) {
    throw new Error("NEXT_PUBLIC_PABBLY_WEBHOOK_URL is not configured");
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Pabbly submission failed: ${response.status}`);
  }
}

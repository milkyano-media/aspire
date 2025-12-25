"use server";

import { sendConfirmationEmail } from "@/lib/email/service";
import { consultationFormSchema } from "@/components/aspire/ConsultationForm/schema";
import type { ActionState } from "@/lib/auth/middleware";

// Email data type without the terms checkbox
type EmailFormData = Omit<
  typeof consultationFormSchema._type,
  'terms'
>;

/**
 * Server action to send consultation confirmation email
 *
 * This action is called after a user submits the consultation form.
 * It sends a confirmation email with their submission details.
 *
 * @param data - Form data without the terms field
 * @returns ActionState with success or error message
 */
export async function sendConsultationConfirmation(
  data: EmailFormData
): Promise<ActionState> {
  try {
    // Send confirmation email
    const result = await sendConfirmationEmail(data);

    if (result.success) {
      return {
        success: "Confirmation email sent successfully",
      };
    } else {
      // Return error but don't throw - allows silent failure
      return {
        error: result.error || "Failed to send confirmation email",
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Server action error sending confirmation email:", errorMessage);

    return {
      error: errorMessage,
    };
  }
}

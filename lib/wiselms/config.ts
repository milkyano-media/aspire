import 'server-only';

export const WISELMS_CONFIG = {
  host: process.env.WISELMS_API_HOST || 'api.wiseapp.live',
  namespace: process.env.WISELMS_NAMESPACE || 'aspireacademics',
  apiKey: process.env.WISELMS_API_KEY || '',
  userId: process.env.WISELMS_USER_ID || '',
  instituteId: process.env.WISELMS_INSTITUTE_ID || '',
  userAgent: process.env.WISELMS_USER_AGENT || 'VendorIntegrations/aspireacademics',
  webhookSecret: process.env.WISELMS_WEBHOOK_SECRET || '',
  consultationTeacherId: process.env.WISELMS_CONSULTATION_TEACHER_ID || '6942e4b428118f629e897e2e',
} as const;

/**
 * Validate WiseLMS API configuration
 * @returns true if all required config values are present
 */
export function validateWiseLMSConfig(): boolean {
  const required = ['apiKey', 'userId', 'instituteId'];
  const missing = required.filter(
    (key) => !WISELMS_CONFIG[key as keyof typeof WISELMS_CONFIG]
  );

  if (missing.length > 0) {
    console.error(
      `WiseLMS API not configured - missing: ${missing.join(', ')}`
    );
    return false;
  }

  return true;
}

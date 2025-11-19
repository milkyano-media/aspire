import { z } from 'zod';

export const consultationFormSchema = z.object({
  role: z.enum(['Student', 'Parent']),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  countryCode: z.string(),
  phone: z.string().min(1, 'Phone is required'),
  city: z.string().min(1, 'Please select a city'),
  schoolYear: z.string().optional(),
  program: z.string().min(1, 'Please select a program'),
  message: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to terms',
  }),
});

export type ConsultationFormData = z.infer<typeof consultationFormSchema>;

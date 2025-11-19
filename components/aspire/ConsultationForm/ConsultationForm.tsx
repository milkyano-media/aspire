'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { consultationFormSchema, ConsultationFormData } from './schema';
import { RoleToggle } from './RoleToggle';
import { CountryCodeSelect } from './CountryCodeSelect';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ConsultationFormProps {
  onSuccess: () => void;
}

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: {
        url: string;
        prefill?: {
          name: string;
          email: string;
          customAnswers?: {
            a1: string;
          };
        };
        utm?: {
          utmSource: string;
          utmMedium: string;
        };
      }) => void;
    };
    dataLayer?: any[];
  }
}

export function ConsultationForm({ onSuccess }: ConsultationFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      role: 'Parent',
      countryCode: '+61',
    },
  });

  const role = watch('role');

  const onSubmit = async (data: ConsultationFormData) => {
    try {
      // Prepare submission data
      const submissionData = {
        role: data.role,
        name: data.name,
        email: data.email,
        phone: `${data.countryCode} ${data.phone}`,
        city: data.city,
        schoolYear: data.schoolYear || '',
        program: data.program,
        message: data.message || '',
      };

      // Submit to Pabbly webhook
      await fetch(process.env.NEXT_PUBLIC_PABBLY_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      // GTM Tracking
      if (typeof window !== 'undefined') {
        window.dataLayer = window.dataLayer || [];
        const nameParts = data.name.split(' ');
        window.dataLayer.push({
          event: 'form_submit',
          email: data.email,
          phone: submissionData.phone,
          city: data.city,
          first_name: nameParts[0] || '',
          last_name: nameParts.slice(1).join(' ') || '',
          role: data.role,
          form_id: 'consultForm',
          form_name: 'Consultation Form',
        });
      }

      // Show success screen
      onSuccess();

      // Open Calendly popup after 1 second
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.Calendly) {
          window.Calendly.initPopupWidget({
            url: process.env.NEXT_PUBLIC_CALENDLY_URL!,
            prefill: {
              name: data.name,
              email: data.email,
              customAnswers: {
                a1: `City: ${data.city} - Program: ${data.program} - School Year: ${data.schoolYear || 'N/A'} - Message: ${data.message || 'N/A'}`,
              },
            },
            utm: {
              utmSource: 'website',
              utmMedium: 'consultation-form',
            },
          });
        }
      }, 1000);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
      {/* Title */}
      <h2 className="mb-4 text-2xl font-bold text-[#002366]">
        Get Your Free Consultation Today
      </h2>
      <div className="mb-6 h-0.5 w-16 bg-[#002366]" />

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Role Toggle */}
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RoleToggle value={field.value} onChange={field.onChange} />
          )}
        />

        {/* Name */}
        <div>
          <Input
            {...register('name')}
            type="text"
            placeholder="Name"
            className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-[#002366]"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email and Phone */}
        <div className="flex space-x-3">
          {/* Email */}
          <div className="w-1/2">
            <Input
              {...register('email')}
              type="email"
              placeholder="Email"
              className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-[#002366]"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="w-1/2">
            <div className="flex overflow-hidden rounded-lg border">
              <Controller
                name="countryCode"
                control={control}
                render={({ field }) => (
                  <CountryCodeSelect value={field.value} onChange={field.onChange} />
                )}
              />
              <Input
                {...register('phone')}
                type="tel"
                placeholder="Phone"
                className="flex-1 border-0 px-2 py-2 outline-none focus:ring-2 focus:ring-[#002366]"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* City */}
        <div>
          <select
            {...register('city')}
            className="w-full rounded-lg border px-4 py-2 text-gray-500 outline-none focus:ring-2 focus:ring-[#002366]"
          >
            <option value="">Select City</option>
            <option value="carlton">Carlton</option>
            <option value="fitzroy">Fitzroy</option>
            <option value="collingwood">Collingwood</option>
            <option value="richmond">Richmond</option>
            <option value="south_yarra">South Yarra</option>
            <option value="st_kilda">St Kilda</option>
            <option value="northern_suburbs">Northern Suburbs</option>
            <option value="brunswick">Brunswick</option>
            <option value="coburg">Coburg</option>
            <option value="preston">Preston</option>
            <option value="northcote">Northcote</option>
            <option value="thomastown">Thomastown</option>
            <option value="broadmeadows">Broadmeadows</option>
            <option value="eastern_suburbs">Eastern Suburbs</option>
            <option value="box_hill">Box Hill</option>
            <option value="doncaster">Doncaster</option>
            <option value="ringwood">Ringwood</option>
            <option value="burwood">Burwood</option>
            <option value="camberwell">Camberwell</option>
            <option value="blackburn">Blackburn</option>
            <option value="western_suburbs">Western Suburbs</option>
            <option value="footscray">Footscray</option>
            <option value="sunshine">Sunshine</option>
            <option value="werribee">Werribee</option>
            <option value="altona">Altona</option>
            <option value="point_cook">Point Cook</option>
            <option value="williamstown">Williamstown</option>
            <option value="southern_suburbs">Southern Suburbs</option>
            <option value="brighton">Brighton</option>
            <option value="sandringham">Sandringham</option>
            <option value="cheltenham">Cheltenham</option>
            <option value="frankston">Frankston</option>
            <option value="dandenong">Dandenong</option>
            <option value="mornington">Mornington</option>
          </select>
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* School Year and Program */}
        <div className="flex space-x-3">
          {/* School Year */}
          <select
            {...register('schoolYear')}
            className="w-1/2 rounded-lg border px-4 py-2 text-gray-500 outline-none focus:ring-2 focus:ring-[#002366]"
          >
            <option value="">Current School Year</option>
            <option value="year_3">Year 3</option>
            <option value="year_4">Year 4</option>
            <option value="year_5">Year 5</option>
            <option value="year_6">Year 6</option>
            <option value="year_7">Year 7</option>
            <option value="year_8">Year 8</option>
            <option value="year_9">Year 9</option>
            <option value="year_10">Year 10</option>
            <option value="year_11">Year 11</option>
            <option value="year_12">Year 12</option>
          </select>

          {/* Program */}
          <select
            {...register('program')}
            className="w-1/2 rounded-lg border px-4 py-2 text-gray-500 outline-none focus:ring-2 focus:ring-[#002366]"
          >
            <option value="">Select Program</option>
            <option value="consult">Consult</option>
            <option value="selective_entry">Selective Entry</option>
            <option value="vce">VCE</option>
            <option value="public_speaking">Public Speaking</option>
          </select>
        </div>
        {errors.program && (
          <p className="mt-1 text-sm text-red-500">{errors.program.message}</p>
        )}

        {/* Message */}
        <textarea
          {...register('message')}
          rows={3}
          placeholder="Please provide an overview of your academic and extracurricular background and goals..."
          className="w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-[#002366]"
        />

        {/* Terms Checkbox */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              {...register('terms')}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              I agree to the terms and conditions and privacy policy
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 w-full rounded-lg bg-orange-500 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Claim My Free Consultation'}
        </button>
      </form>
    </div>
  );
}

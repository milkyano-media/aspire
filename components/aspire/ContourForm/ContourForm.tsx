'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  consultationFormSchema,
  ConsultationFormData,
} from '../ConsultationForm/schema';
import { CountryCodeSelect } from '../ConsultationForm/CountryCodeSelect';
import { Input } from '@/components/ui/input';
import { trackEvent } from '@/lib/gtm';
import { submitToPabbly, submitToExternalAPI } from '@/lib/form-api';
import { sendConsultationConfirmation } from '@/app/(dashboard)/actions/consultation';
import { cn } from '@/lib/utils';

interface ContourFormProps {
  onSuccess: () => void;
  subject?: string;
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
  }
}

const TOTAL_STEPS = 9;

export function ContourForm({ onSuccess, subject }: ContourFormProps) {
  const [visibleSteps, setVisibleSteps] = useState(1);
  const [roleSelected, setRoleSelected] = useState(false);

  // Listen for Calendly events and prevent any redirect behavior
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        // Prevent any redirect that Calendly might trigger
        if (e.data.event === 'calendly.event_scheduled') {
          // Event was scheduled successfully, stay on current page
          console.log('Calendly event scheduled');
        }
      }
    };

    window.addEventListener('message', handleCalendlyEvent);
    return () => window.removeEventListener('message', handleCalendlyEvent);
  }, []);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      countryCode: '+61',
    },
    mode: 'onChange',
  });

  const watchedValues = watch();

  // Progressive disclosure logic
  useEffect(() => {
    // Step 1: Role (always visible)
    // Step 2: Name - visible after role is explicitly selected
    if (roleSelected && visibleSteps < 2) {
      setVisibleSteps(2);
    }
    // Step 3: Email - visible after name is filled
    if (watchedValues.name && watchedValues.name.length >= 2 && visibleSteps < 3) {
      setVisibleSteps(3);
    }
    // Step 4: Phone - visible after email is filled
    if (watchedValues.email && watchedValues.email.includes('@') && visibleSteps < 4) {
      setVisibleSteps(4);
    }
    // Step 5: City - visible after phone is filled
    if (watchedValues.phone && watchedValues.phone.length >= 5 && visibleSteps < 5) {
      setVisibleSteps(5);
    }
    // Step 6: School Year - visible after city is selected
    if (watchedValues.city && visibleSteps < 6) {
      setVisibleSteps(6);
    }
    // Step 7: Program - visible after school year is selected (or skipped)
    if (visibleSteps === 6 && visibleSteps < 7) {
      // Show program right after city, school year is optional
      setVisibleSteps(7);
    }
    // Step 8: Message - visible after program is selected
    if (watchedValues.program && visibleSteps < 8) {
      setVisibleSteps(8);
    }
    // Step 9: Terms + Submit - visible after message (message is optional, so show after a delay)
    if (visibleSteps === 8 && visibleSteps < 9) {
      const timer = setTimeout(() => {
        setVisibleSteps(9);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [watchedValues, visibleSteps, roleSelected]);

  const onSubmit = async (data: ConsultationFormData) => {
    try {
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

      const [pabblyResult, externalApiResult, emailResult] = await Promise.allSettled([
        submitToPabbly(submissionData),
        submitToExternalAPI({
          formData: {
            ...submissionData,
            submittedAt: new Date().toISOString(),
          },
          spreadsheetUrl: process.env.NEXT_PUBLIC_SPREADSHEET_URL!,
          emailReceiver: process.env.NEXT_PUBLIC_FORM_EMAIL_RECEIVER!,
          metadata: {
            formType: 'consultation_request',
            subject: `New Aspire Academics Consultation Request${subject ? ` - ${subject}` : ''}`,
          },
        }),
        sendConsultationConfirmation(data),
      ]);

      if (pabblyResult.status === 'rejected') {
        console.error('Pabbly submission error:', pabblyResult.reason);
        alert('Error submitting form. Please try again.');
        return;
      }

      if (externalApiResult.status === 'rejected') {
        console.error('External API submission error:', externalApiResult.reason);
      }

      if (emailResult.status === 'rejected') {
        console.error('Confirmation email error:', emailResult.reason);
      }

      const nameParts = data.name.split(' ');
      trackEvent('form_submit', {
        email: data.email,
        phone: submissionData.phone,
        city: data.city,
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        role: data.role,
        form_id: 'contourConsultForm',
        form_name: 'Contour Consultation Form',
      });

      onSuccess();

      setTimeout(() => {
        if (typeof window !== 'undefined' && window.Calendly) {
          // Get the base Calendly URL and add redirect_url to stay on current page
          const calendlyUrl = new URL(process.env.NEXT_PUBLIC_CALENDLY_URL!);
          calendlyUrl.searchParams.set('redirect_url', window.location.href);

          window.Calendly.initPopupWidget({
            url: calendlyUrl.toString(),
            prefill: {
              name: data.name,
              email: data.email,
              customAnswers: {
                a1: `City: ${data.city} - Program: ${data.program} - School Year: ${data.schoolYear || 'N/A'} - Message: ${data.message || 'N/A'}`,
              },
            },
            utm: {
              utmSource: 'website',
              utmMedium: 'contour-form',
            },
          });
        }
      }, 1000);
    } catch (error) {
      console.error('Unexpected error in form submission:', error);
      alert('Error submitting form. Please try again.');
    }
  };

  const role = watchedValues.role;
  const progress = Math.min((visibleSteps / TOTAL_STEPS) * 100, 100);

  return (
    <div className="w-full max-w-xl rounded-2xl bg-white p-8 md:p-10 shadow-xl">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-1 w-full rounded-full bg-gray-100">
          <div
            className="h-1 rounded-full bg-[#007aff] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Title */}
      <h2 className="mb-2 text-2xl md:text-3xl font-bold text-gray-900 text-center">
        Get Your Free Consultation Today
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Fill out the form below and we&apos;ll be in touch
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Role Toggle */}
        <div
          className={cn(
            'transition-all duration-500 ease-out',
            visibleSteps >= 1
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 h-0 overflow-hidden'
          )}
        >
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Are you a student or a parent/guardian?
          </label>
          <div className="flex justify-center">
            <div className="inline-flex rounded-lg bg-gray-100 p-1 w-full">
              <button
                type="button"
                onClick={() => {
                  setValue('role', 'Parent', { shouldValidate: true });
                  setRoleSelected(true);
                }}
                className={cn(
                  'flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all',
                  role === 'Parent'
                    ? 'bg-white text-[#007aff] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                I&apos;m a Parent
              </button>
              <button
                type="button"
                onClick={() => {
                  setValue('role', 'Student', { shouldValidate: true });
                  setRoleSelected(true);
                }}
                className={cn(
                  'flex-1 px-6 py-3 rounded-lg text-sm font-medium transition-all',
                  role === 'Student'
                    ? 'bg-white text-[#007aff] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                I&apos;m a Student
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Name */}
        <div
          className={cn(
            'transition-all duration-500 ease-out',
            visibleSteps >= 2
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 h-0 overflow-hidden'
          )}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('name')}
            type="text"
            placeholder="Enter your full name"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Step 3: Email */}
        <div
          className={cn(
            'transition-all duration-500 ease-out',
            visibleSteps >= 3
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 h-0 overflow-hidden'
          )}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Step 4: Phone */}
        <div
          className={cn(
            'transition-all duration-500 ease-out',
            visibleSteps >= 4
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 h-0 overflow-hidden'
          )}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="flex overflow-hidden rounded-lg border border-gray-300 focus-within:border-[#007aff] focus-within:ring-2 focus-within:ring-[#007aff]/20">
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
              placeholder="412 345 678"
              className="flex-1 border-0 px-4 py-3 outline-none"
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>

        {/* Step 5: City */}
        <div
          className={cn(
            'transition-all duration-500 ease-out',
            visibleSteps >= 5
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 h-0 overflow-hidden'
          )}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City / Suburb <span className="text-red-500">*</span>
          </label>
          <select
            {...register('city')}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20"
          >
            <option value="">Select your area</option>
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
            <option value="truganina">Truganina</option>
            <option value="tarneit">Tarneit</option>
          </select>
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>

        {/* Step 6: School Year */}
        <div
          className={cn(
            'transition-all duration-500 ease-out',
            visibleSteps >= 6
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 h-0 overflow-hidden'
          )}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current School Year
          </label>
          <select
            {...register('schoolYear')}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20"
          >
            <option value="">Select year level (optional)</option>
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
        </div>

        {/* Step 7: Program */}
        <div
          className={cn(
            'transition-all duration-500 ease-out',
            visibleSteps >= 7
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 h-0 overflow-hidden'
          )}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Program of Interest <span className="text-red-500">*</span>
          </label>
          <select
            {...register('program')}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20"
          >
            <option value="">Select a program</option>
            <option value="consult">General Consultation</option>
            <option value="selective_entry">Selective Entry</option>
            <option value="vce">VCE</option>
            <option value="public_speaking">Public Speaking</option>
          </select>
          {errors.program && (
            <p className="mt-1 text-sm text-red-500">{errors.program.message}</p>
          )}
        </div>

        {/* Step 8: Message */}
        <div
          className={cn(
            'transition-all duration-500 ease-out',
            visibleSteps >= 8
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 h-0 overflow-hidden'
          )}
        >
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Information
          </label>
          <textarea
            {...register('message')}
            rows={3}
            placeholder="Tell us about your academic goals... (optional)"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#007aff] focus:ring-2 focus:ring-[#007aff]/20 resize-none"
          />
        </div>

        {/* Step 9: Terms + Submit */}
        <div
          className={cn(
            'transition-all duration-500 ease-out space-y-4',
            visibleSteps >= 9
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4 h-0 overflow-hidden'
          )}
        >
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                {...register('terms')}
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#007aff] focus:ring-[#007aff]"
              />
              <span className="text-sm text-gray-600">
                I agree to the{' '}
                <a href="/terms" className="text-[#007aff] hover:underline">
                  terms and conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-[#007aff] hover:underline">
                  privacy policy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[#ffa737] py-4 text-lg font-semibold text-white hover:bg-[#ff9500] disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Claim My Free Consultation'}
          </button>

          <p className="text-center text-sm text-gray-500">
            We&apos;ll be in touch within 24 hours
          </p>
        </div>
      </form>
    </div>
  );
}

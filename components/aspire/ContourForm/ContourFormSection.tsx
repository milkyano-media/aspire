'use client';

import { useState } from 'react';
import { ContourForm } from './ContourForm';
import { SuccessScreen } from '../ConsultationForm/SuccessScreen';

interface ContourFormSectionProps {
  subject?: string;
}

export function ContourFormSection({ subject }: ContourFormSectionProps) {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <section
      id="form"
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#f8fbff] to-white px-4 py-16"
    >
      {showSuccess ? (
        <SuccessScreen />
      ) : (
        <ContourForm onSuccess={() => setShowSuccess(true)} subject={subject} />
      )}
    </section>
  );
}

'use client';

import { useState } from 'react';
import { ConsultationForm } from './ConsultationForm/ConsultationForm';
import { SuccessScreen } from './ConsultationForm/SuccessScreen';

export function ConsultationFormSection() {
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <section
      id="form"
      className="flex min-h-screen items-center justify-center bg-white px-4 py-12"
    >
      {showSuccess ? (
        <SuccessScreen />
      ) : (
        <ConsultationForm onSuccess={() => setShowSuccess(true)} />
      )}
    </section>
  );
}

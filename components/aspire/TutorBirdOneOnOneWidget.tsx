'use client';

import { useEffect, useRef } from 'react';

export function TutorBirdOneOnOneWidget() {
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !widgetContainerRef.current) return;

    const script = document.createElement('script');
    script.src =
      'https://app.tutorbird.com/Widget/v4/Widget.ashx?settings=eyJTY2hvb2xJRCI6InNjaF9wV1RKVCIsIldlYnNpdGVJRCI6Indic181ZnZKViIsIldlYnNpdGVCbG9ja0lEIjoid2JiX2NHNVNKRiJ9';
    script.async = true;

    widgetContainerRef.current.appendChild(script);
    isInitialized.current = true;

    return () => {
      if (widgetContainerRef.current && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return <div ref={widgetContainerRef} className="w-full" />;
}

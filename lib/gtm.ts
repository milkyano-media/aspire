/**
 * Google Tag Manager (GTM) tracking utilities
 */

interface GTMEvent {
  event: string;
  button_text?: string;
  button_location?: string;
  page_path?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    dataLayer?: GTMEvent[];
  }
}

/**
 * Track a CTA button click
 * @param buttonText - The text displayed on the button
 * @param location - Where the button appears (e.g., 'hero', 'cta-section', 'course-card')
 */
export function trackCTAClick(buttonText: string, location: string) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    return;
  }

  const event: GTMEvent = {
    event: 'cta_click',
    button_text: buttonText,
    button_location: location,
    page_path: window.location.pathname,
  };

  window.dataLayer.push(event);
}

/**
 * Track a custom event with custom data
 * @param eventName - The event name
 * @param eventData - Additional event data
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window === 'undefined' || !window.dataLayer) {
    return;
  }

  const event: GTMEvent = {
    event: eventName,
    page_path: window.location.pathname,
    ...eventData,
  };

  window.dataLayer.push(event);
}

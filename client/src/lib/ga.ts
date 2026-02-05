declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = "G-MBGWM1D09D";

/**
 * Track page views (SPA-safe)
 */
export const trackPageView = (path: string) => {
  if (!window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: path,
  });
};

/**
 * Track custom GA4 events
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (!window.gtag) return;

  window.gtag("event", eventName, {
    ...params,
    transport_type: "beacon",
  });
};

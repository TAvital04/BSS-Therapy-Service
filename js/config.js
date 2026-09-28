/**
 * Global Configuration for Bett-r Support and Service Applications
 */
export const CONFIG = {
  // FormSubmit.co Configuration (Unified across Appointment & Careers Forms)
  FORMSUBMIT_ENDPOINT: import.meta.env?.VITE_FORMSUBMIT_ENDPOINT || "https://formsubmit.co/",
  ACCESS_KEY: (
    import.meta.env?.VITE_ACCESS_KEY ||
    import.meta.env?.VITE_FORMSUBMIT_KEY ||
    ""
  ).split("#")[0].trim(),

  VALIDATION: {
    MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB FormSubmit limit
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

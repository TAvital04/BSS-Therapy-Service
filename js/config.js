/**
 * Global Configuration for Bett-r Support and Service Applications
 */
export const CONFIG = {
  // Web3Forms Configuration (Appointment Form)
  WEB3FORMS_ACCESS_KEY: import.meta.env?.VITE_WEB3FORMS_ACCESS_KEY || "b4e445ae-e0fe-4925-86b0-100c84a08bd2",
  WEB3FORMS_CAREERS_KEY: import.meta.env?.VITE_WEB3FORMS_CAREERS_KEY || "fff888c6-1c17-44f7-8113-c395d9a96034",
  WEB3FORMS_ENDPOINT: import.meta.env?.VITE_WEB3FORMS_ENDPOINT || "https://api.web3forms.com/submit",

  // FormSubmit.co Configuration for Careers Applications (Free PDF attachment support up to 10MB)
  FORMSUBMIT_ENDPOINT: import.meta.env?.VITE_FORMSUBMIT_ENDPOINT || "https://formsubmit.co/",
  CAREERS_EMAIL: import.meta.env?.VITE_CAREERS_EMAIL || "tal.avital04@gmail.com",

  VALIDATION: {
    MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB FormSubmit limit
    EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
};

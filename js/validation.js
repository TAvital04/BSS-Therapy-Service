import { CONFIG } from "./config.js";

/**
 * Validates input controls for appointment and career applications.
 * @param {HTMLFormElement} form
 * @param {boolean} checkResume
 * @returns {boolean} isValid
 */
export function validateForm(form, checkResume) {
  let valid = true;

  const firstName = form.querySelector("#first_name");
  const lastName = form.querySelector("#last_name");
  const email = form.querySelector("#email");
  const phone = form.querySelector("#phone");
  const county = form.querySelector("#county");
  const service = form.querySelector("#service_selection");
  const resumeInput = form.querySelector("#resume");
  const resumeLink = form.querySelector("#resume_link");

  function checkRequired(input) {
    if (!input || !input.value.trim()) {
      markInvalid(input);
      valid = false;
    }
  }

  checkRequired(firstName);
  checkRequired(lastName);
  checkRequired(county);
  checkRequired(service);

  // Email Pattern Check
  if (!email || !email.value.trim() || !CONFIG.VALIDATION.EMAIL_PATTERN.test(email.value.trim())) {
    markInvalid(email);
    valid = false;
  }

  // Phone Pattern Check (accepts numbers, spaces, dashes, parentheses: 7-20 chars)
  const cleanPhone = phone ? phone.value.replace(/[\s()+-]/g, "") : "";
  if (!phone || !phone.value.trim() || cleanPhone.length < 7 || isNaN(cleanPhone)) {
    markInvalid(phone);
    valid = false;
  }

  // PDF Resume Check (if file input exists)
  if (checkResume && resumeInput) {
    const errorResume = form.querySelector("#error-resume");
    const dropzone = form.querySelector("#file-dropzone");
    const file = resumeInput.files ? resumeInput.files[0] : null;

    if (!file) {
      markInvalid(resumeInput);
      if (dropzone) markInvalid(dropzone);
      if (errorResume) errorResume.textContent = "Please upload your resume in PDF format.";
      valid = false;
    } else {
      const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
      const isValidSize = file.size <= CONFIG.VALIDATION.MAX_FILE_SIZE_BYTES;

      if (!isPdf) {
        markInvalid(resumeInput);
        if (dropzone) markInvalid(dropzone);
        if (errorResume) errorResume.textContent = "Only PDF files are accepted. Please choose a .pdf document.";
        valid = false;
      } else if (!isValidSize) {
        markInvalid(resumeInput);
        if (dropzone) markInvalid(dropzone);
        if (errorResume) errorResume.textContent = "File exceeds the 10MB limit. Please upload a smaller PDF.";
        valid = false;
      }
    }
  }

  // Resume Link Check (if URL input exists)
  if (checkResume && resumeLink) {
    const val = resumeLink.value.trim();
    if (!val || val.length < 5) {
      markInvalid(resumeLink);
      valid = false;
    }
  }

  return valid;
}

/**
 * Marks input element as invalid with aria-invalid state and attach single-shot event handler to clear invalid class.
 * @param {HTMLElement} element
 */
export function markInvalid(element) {
  if (element) {
    element.classList.add("invalid");
    element.setAttribute("aria-invalid", "true");
    const eventType = element.tagName === "SELECT" || element.type === "file" ? "change" : "input";
    element.addEventListener(eventType, function handleInput() {
      element.classList.remove("invalid");
      element.removeAttribute("aria-invalid");
      element.removeEventListener(eventType, handleInput);
    });
  }
}

/**
 * Clears invalid states across form inputs.
 * @param {HTMLFormElement} form
 */
export function clearErrors(form) {
  const invalidElements = form.querySelectorAll(".invalid");
  invalidElements.forEach((el) => {
    el.classList.remove("invalid");
    el.removeAttribute("aria-invalid");
  });
}

import { CONFIG } from "./config.js";
import { validateForm, clearErrors } from "./validation.js";

/**
 * Initializes form submission handler for Appointment or Careers forms.
 */
export function initFormHandler() {
  const form = document.getElementById("appointment-form") || document.getElementById("careers-form");
  if (!form) return;

  const submitBtn = document.getElementById("submit-btn");
  const btnText = document.getElementById("btn-text");
  const btnSpinner = document.getElementById("btn-spinner");
  const alertContainer = document.getElementById("form-alert-container");

  const isCareersForm = form.id === "careers-form";

  // Resume Help Guide Toggle
  const helpBtn = form.querySelector("#resume-help-btn");
  const helpGuide = form.querySelector("#resume-help-guide");
  const helpClose = form.querySelector("#resume-help-close");

  if (helpBtn && helpGuide) {
    helpBtn.addEventListener("click", () => {
      const isExpanded = helpBtn.getAttribute("aria-expanded") === "true";
      helpBtn.setAttribute("aria-expanded", String(!isExpanded));
      helpGuide.classList.toggle("u-hidden", isExpanded);
    });

    if (helpClose) {
      helpClose.addEventListener("click", () => {
        helpBtn.setAttribute("aria-expanded", "false");
        helpGuide.classList.add("u-hidden");
        helpBtn.focus();
      });
    }
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Reset error indicators & alert message
    clearErrors(form);
    hideAlert(alertContainer);

    // 1. Client-Side Honeypot & Input Validation
    const botCheck = form.querySelector('input[name="botcheck"]');
    if (botCheck && botCheck.checked) {
      console.warn("Spambot detected via honeypot field. Submission dropped.");
      form.reset();
      return;
    }

    const isValid = validateForm(form, isCareersForm);
    if (!isValid) {
      showAlert(alertContainer, "Please correct the highlighted fields before submitting.", "error");
      return;
    }

    // 2. Set UI Loading State
    setLoadingState(true, submitBtn, btnText, btnSpinner, isCareersForm);

    try {
      // 3. Live Web3Forms Dispatch
      const formData = new FormData(form);
      const accessKey =
        form.querySelector('input[name="access_key"]')?.value ||
        (isCareersForm ? CONFIG.WEB3FORMS_CAREERS_KEY : CONFIG.WEB3FORMS_ACCESS_KEY);
      formData.set("access_key", accessKey);

      const response = await fetch(CONFIG.WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: formData
      });

      let result;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const responseText = await response.text();
        if (responseText.includes("Pro feature") || responseText.includes("upgrade")) {
          result = {
            success: false,
            message:
              "File uploads require a Web3Forms Pro subscription. Please provide a Google Drive / LinkedIn resume link instead."
          };
        } else {
          result = { success: false, message: `Submission error (Status ${response.status}).` };
        }
      }

      if (response.ok && result.success) {
        const successMsg = isCareersForm
          ? "Thank you for applying! Your application has been submitted successfully."
          : "Thank you! Your appointment request has been submitted successfully.";
        showAlert(alertContainer, successMsg, "success");
        form.reset();
        if (helpBtn && helpGuide) {
          helpBtn.setAttribute("aria-expanded", "false");
          helpGuide.classList.add("u-hidden");
        }
      } else {
        showAlert(alertContainer, result.message || "Web3Forms submission error. Please try again.", "error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showAlert(
        alertContainer,
        "Failed to send submission due to a network connection error. Please try again later.",
        "error"
      );
    } finally {
      setLoadingState(false, submitBtn, btnText, btnSpinner, isCareersForm);
    }
  });
}

function setLoadingState(isLoading, submitBtn, btnText, btnSpinner, isCareers) {
  if (!submitBtn || !btnText || !btnSpinner) return;
  if (isLoading) {
    submitBtn.disabled = true;
    btnText.textContent = isCareers ? "Submitting Application..." : "Sending Message...";
    btnSpinner.style.display = "inline-block";
  } else {
    submitBtn.disabled = false;
    btnText.textContent = isCareers ? "Submit Application" : "Send Message";
    btnSpinner.style.display = "none";
  }
}

function showAlert(alertContainer, message, type) {
  if (!alertContainer) return;
  alertContainer.textContent = message;
  alertContainer.className = `form-alert-container form-alert-${type}`;
  alertContainer.style.display = "block";
  alertContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideAlert(alertContainer) {
  if (!alertContainer) return;
  alertContainer.style.display = "none";
  alertContainer.textContent = "";
}

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

  if (isCareersForm) {
    const baseEndpoint = (CONFIG.FORMSUBMIT_ENDPOINT || "https://formsubmit.co/").replace(/\/+$/, "");
    form.action = `${baseEndpoint}/${CONFIG.CAREERS_EMAIL}`;
  }

  // Check for successful submission redirect on careers form
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("submitted") === "true") {
    showAlert(
      alertContainer,
      "Thank you for applying! Your application and resume have been submitted successfully.",
      "success"
    );
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // Initialize Dropzone if present
  initDropzone(form);

  form.addEventListener("submit", async (e) => {
    // Reset error indicators & alert message
    clearErrors(form);
    hideAlert(alertContainer);

    // 1. Client-Side Honeypot & Input Validation
    const botCheck = form.querySelector('input[name="botcheck"]') || form.querySelector('input[name="_honey"]');
    if (botCheck && (botCheck.checked || (botCheck.type === "text" && botCheck.value.trim() !== ""))) {
      e.preventDefault();
      console.warn("Spambot detected via honeypot field. Submission dropped.");
      form.reset();
      return;
    }

    const isValid = validateForm(form, isCareersForm);
    if (!isValid) {
      e.preventDefault();
      showAlert(alertContainer, "Please correct the highlighted fields before submitting.", "error");
      return;
    }

    if (isCareersForm) {
      // Standard multipart/form-data POST to FormSubmit.co is required for file attachments
      const baseEndpoint = (CONFIG.FORMSUBMIT_ENDPOINT || "https://formsubmit.co/").replace(/\/+$/, "");
      form.action = `${baseEndpoint}/${CONFIG.CAREERS_EMAIL}`;
      form.method = "POST";
      form.enctype = "multipart/form-data";

      const nextInput = form.querySelector("#formsubmit-next");
      if (nextInput) {
        nextInput.value = `${window.location.origin}${window.location.pathname}?submitted=true`;
      }

      setLoadingState(true, submitBtn, btnText, btnSpinner, true);
      // Native POST submission proceeds with the binary PDF attachment
      return;
    }

    // 2. Appointment Form: Live Web3Forms AJAX Dispatch
    e.preventDefault();
    setLoadingState(true, submitBtn, btnText, btnSpinner, false);

    try {
      // Live Web3Forms Dispatch for Appointment Form
      const formData = new FormData(form);
      const accessKey = form.querySelector('input[name="access_key"]')?.value || CONFIG.WEB3FORMS_ACCESS_KEY;
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
        result = { success: false, message: responseText || `Submission error (Status ${response.status}).` };
      }

      if (response.ok && result.success) {
        showAlert(alertContainer, "Thank you! Your appointment request has been submitted successfully.", "success");
        form.reset();
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

/**
 * Sets up drag-and-drop, file selection feedback, and file removal for the PDF resume uploader.
 */
function initDropzone(form) {
  const dropzone = form.querySelector("#file-dropzone");
  const fileInput = form.querySelector("#resume");
  const defaultView = form.querySelector("#dropzone-default");
  const selectedView = form.querySelector("#file-selected-card");
  const fileNameDisplay = form.querySelector("#file-name-display");
  const fileSizeDisplay = form.querySelector("#file-size-display");
  const removeBtn = form.querySelector("#file-remove-btn");
  const errorResume = form.querySelector("#error-resume");

  if (!dropzone || !fileInput) return;

  function updateFileView(file) {
    if (file) {
      if (fileNameDisplay) fileNameDisplay.textContent = file.name;
      if (fileSizeDisplay) fileSizeDisplay.textContent = formatBytes(file.size);
      if (defaultView) defaultView.classList.add("u-hidden");
      if (selectedView) selectedView.classList.remove("u-hidden");
      dropzone.classList.remove("invalid");
      fileInput.classList.remove("invalid");
      dropzone.classList.add("has-file");
    } else {
      fileInput.value = "";
      if (defaultView) defaultView.classList.remove("u-hidden");
      if (selectedView) selectedView.classList.add("u-hidden");
      dropzone.classList.remove("has-file");
    }
  }

  // Dropzone click opens native file dialog
  dropzone.addEventListener("click", (e) => {
    if (e.target.closest("#file-remove-btn")) return;
    fileInput.click();
  });

  // Keyboard accessibility
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!e.target.closest("#file-remove-btn")) {
        fileInput.click();
      }
    }
  });

  // File input change
  fileInput.addEventListener("change", () => {
    const file = fileInput.files && fileInput.files[0];
    if (file) {
      const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
      const isValidSize = file.size <= CONFIG.VALIDATION.MAX_FILE_SIZE_BYTES;

      if (!isPdf) {
        dropzone.classList.add("invalid");
        if (errorResume) {
          errorResume.textContent = "Only PDF files are accepted. Please choose a .pdf document.";
          errorResume.style.display = "block";
        }
        updateFileView(null);
        return;
      }
      if (!isValidSize) {
        dropzone.classList.add("invalid");
        if (errorResume) {
          errorResume.textContent = "File exceeds the 10MB limit. Please upload a smaller PDF.";
          errorResume.style.display = "block";
        }
        updateFileView(null);
        return;
      }
      if (errorResume) errorResume.style.display = "";
      updateFileView(file);
    } else {
      updateFileView(null);
    }
  });

  // Remove selected file button
  if (removeBtn) {
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateFileView(null);
    });
  }

  // Drag and drop event listeners
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add("drag-over");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove("drag-over");
    });
  });

  dropzone.addEventListener("drop", (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      fileInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

function setLoadingState(isLoading, submitBtn, btnText, btnSpinner, isCareers) {
  if (!submitBtn || !btnText || !btnSpinner) return;
  if (isLoading) {
    btnText.textContent = isCareers ? "Submitting Application..." : "Sending Message...";
    btnSpinner.style.display = "inline-block";
    if (isCareers) {
      setTimeout(() => {
        submitBtn.disabled = true;
      }, 50);
    } else {
      submitBtn.disabled = true;
    }
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

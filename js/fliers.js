/**
 * Bett-r Support and Service - Fliers Interactive Script
 * Handles printing, link copying, category filtering, and interactive actions.
 */

document.addEventListener("DOMContentLoaded", () => {
  initPrintButtons();
  initShareButtons();
  initCategoryFilters();
});

/**
 * Initializes Print buttons across all flier pages and directory cards
 */
function initPrintButtons() {
  const printBtns = document.querySelectorAll(".btn-trigger-print, .flier-btn-print");
  printBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // If it's a link to another page with #print, the target page handles it.
      // If it's on a flier page directly, invoke window.print()
      if (btn.classList.contains("flier-action-print")) {
        e.preventDefault();
        window.print();
      }
    });
  });

  // Automatically trigger print dialog if URL hash is #print
  if (window.location.hash === "#print") {
    setTimeout(() => {
      window.print();
    }, 400);
  }
}

/**
 * Initializes Share / Copy Link buttons with clipboard API and toast alerts
 */
function initShareButtons() {
  const shareBtns = document.querySelectorAll(".btn-trigger-share, .flier-btn-share");
  let toastTimeout;

  shareBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const targetUrl = btn.getAttribute("data-url") || window.location.href;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(targetUrl);
          showToast("📋 Flier link copied to clipboard!");
        } else {
          // Fallback prompt
          window.prompt("Copy this flier link:", targetUrl);
        }
      } catch (err) {
        console.error("Failed to copy link:", err);
        showToast("⚠️ Link copy unavailable. URL: " + targetUrl);
      }
    });
  });

  function showToast(message) {
    let toast = document.getElementById("flier-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "flier-toast";
      toast.className = "flier-toast";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }
}

/**
 * Initializes Category Filtering on the Fliers Hub page
 */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll(".flier-filter-btn");
  const cards = document.querySelectorAll(".flier-card");

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");

      // Update active button state
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filter cards
      cards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (category === "all" || cardCategory === category) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

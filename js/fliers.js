/**
 * Bett-r Support and Service - Instagram Ads & Visual Creatives Script
 * Handles format switching (Feed 1:1, Story 9:16, Both), copying ad captions,
 * category filtering, sharing, and smooth section navigation.
 */

document.addEventListener("DOMContentLoaded", () => {
  initFormatSwitcher();
  initCopyCaptionButtons();
  initPrintButtons();
  initShareButtons();
  initCategoryFilters();
});

/**
 * Initializes format switcher between Feed (1:1), Story (9:16), and Both Side-by-Side across all sections
 */
function initFormatSwitcher() {
  const switchBtns = document.querySelectorAll(".format-switch-btn");
  const container = document.querySelector(".ad-document-container") || document.body;
  const stages = document.querySelectorAll(".ad-visuals-stage");

  if (!switchBtns.length) return;

  switchBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const format = btn.getAttribute("data-format");

      // Update button states
      switchBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Update container & all stages
      container.classList.remove("view-all", "view-feed", "view-story");
      container.classList.add(`view-${format}`);

      stages.forEach((stage) => {
        stage.classList.remove("view-all", "view-feed", "view-story");
        stage.classList.add(`view-${format}`);
      });
    });
  });
}

/**
 * Initializes Copy Caption & Hashtags buttons with clipboard API and toast feedback
 */
function initCopyCaptionButtons() {
  const copyBtns = document.querySelectorAll(".btn-copy-caption");

  copyBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const drawer = btn.closest(".ad-caption-drawer");
      const captionContainer = drawer
        ? drawer.querySelector(".ad-caption-body")
        : document.querySelector(".ad-caption-body");

      if (!captionContainer) return;

      const textToCopy = captionContainer.innerText.trim();

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
          showAdToast("✨ Instagram caption & hashtags copied to clipboard!");
        } else {
          window.prompt("Copy this caption:", textToCopy);
        }
      } catch (err) {
        console.error("Failed to copy caption:", err);
        window.prompt("Copy this caption:", textToCopy);
      }
    });
  });
}

/**
 * Initializes Print / Save PDF buttons
 */
function initPrintButtons() {
  const printBtns = document.querySelectorAll(".btn-trigger-print, .flier-btn-print");
  printBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      if (btn.classList.contains("flier-action-print")) {
        e.preventDefault();
        window.print();
      }
    });
  });

  if (window.location.hash === "#print") {
    setTimeout(() => {
      window.print();
    }, 400);
  }
}

/**
 * Initializes Share / Copy Link buttons
 */
function initShareButtons() {
  const shareBtns = document.querySelectorAll(".btn-trigger-share, .flier-btn-share");

  shareBtns.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const targetUrl = btn.getAttribute("data-url") || window.location.href;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(targetUrl);
          showAdToast("🔗 Visual Ad link copied to clipboard!");
        } else {
          window.prompt("Copy this visual link:", targetUrl);
        }
      } catch (err) {
        console.error("Failed to copy link:", err);
        showAdToast("⚠️ Link copy unavailable. URL: " + targetUrl);
      }
    });
  });
}

/**
 * Shows user-friendly toast message
 */
let toastTimeout;
function showAdToast(message) {
  let toast = document.getElementById("ad-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "ad-toast";
    toast.className = "ad-toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/**
 * Initializes Category Filtering on the Ads Hub page
 */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll(".flier-filter-btn");
  const cards = document.querySelectorAll(".flier-card");

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

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

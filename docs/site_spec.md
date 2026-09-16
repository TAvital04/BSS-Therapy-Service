# Bett-r Support and Service - Site Specification & Documentation

**Project:** Bett-r Support and Service Website  
**Hosting Target:** GitHub Pages (`/` root or `/docs`)  
**Last Updated:** August 25, 2026

---

## 📁 Repository Structure

```text
bss-therapy-service/
├── index.html                 # Core homepage HTML5 markup with appointment form
├── careers.html               # Dedicated Careers & Employment application page (PDF resume upload)
├── styles.css                 # Modular CSS stylesheet (Design Tokens, Cards, Forms, File Uploads)
├── script.js                  # Multi-page form validation, PDF check & Web3Forms integration
├── CNAME                      # GitHub Pages custom domain configuration
├── .nojekyll                  # Jekyll build bypass file for GitHub Pages
├── README.md                  # Developer documentation & deployment guide
├── assets/
│   └── images/
│       ├── logo/              # Brand logo PNG mark (897x646 px)
│       ├── hero/              # Hero community booth photo (964x777 px)
│       ├── services/          # 5 service photo cards (ABA, HHA, PT, ST, OT)
│       └── insurances/        # 7 official insurance provider logos
└── docs/
    ├── site_manifest.json     # Single authoritative JSON asset & content schema
    └── site_spec.md           # Master site content specification
```

---

## 📄 Pages Overview

1. **Homepage ([`index.html`](file:///c:/Users/talav/Documents/Github/Orly/index.html)):**
   - Main clinic overview, 5 square service cards, location cards, insurance logos, appointment form, emergency banner, and footer.
2. **Careers Application ([`careers.html`](file:///c:/Users/talav/Documents/Github/Orly/careers.html)):**
   - Dedicated application form featuring all standard fields plus a PDF resume file upload (`max 5MB`).
   - Dispatches PDF attachments directly to your inbox via Web3Forms.

---

## 🛡️ Anti-Spam Implementation

1. **Invisible Honeypot (`name="botcheck"`):**
   - Configured in `index.html` and `careers.html`, verified in `script.js`.
   - Invisible to human applicants (`display: none !important;`).
   - Automatically drops automated spambots.

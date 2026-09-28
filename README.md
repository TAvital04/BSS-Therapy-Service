# Bett-r Support and Service Website

Production-ready, modern static website built for **Bett-r Support and Service** and configured for deployment on **GitHub Pages** with custom domain support and FormSubmit.co integration.

---

## 📁 Clean Repository Structure

```text
bss-therapy-service/
├── index.html                 # Core HTML5 semantic page structure
├── styles.css                 # Custom CSS stylesheet with design tokens
├── script.js                  # Client-side form validation & FormSubmit integration
├── CNAME                      # Custom domain configuration (example.com)
├── .nojekyll                  # Bypass Jekyll processing on GitHub Pages
├── README.md                  # Setup & deployment documentation
├── assets/
│   └── images/
│       ├── logo/              # BSS Therapy Service brand logo
│       ├── hero/              # Hero outreach booth feature image
│       ├── services/          # Pediatric therapy service cards
│       └── insurances/        # Accepted insurance provider logo icons
└── docs/
    ├── site_manifest.json     # Master JSON content & asset schema
    └── site_spec.md           # Full site specification document
```

---

## 📧 Email Setup (FormSubmit.co - Zero Access Keys Required)

Both the **Appointment Form** and **Careers Application Form** are handled by **FormSubmit.co**, delivering messages and PDF attachments directly to your inbox with automatic **`Reply-To`** routing.

- **Zero Access Keys:** No API keys or account registration required.
- **PDF Upload Support:** Free file attachment support up to 10MB on Careers applications.
- **Live In-Page Dispatch:** Appointment requests use FormSubmit AJAX for instant, seamless confirmation without leaving the page.
- **Recipient Email:** Configured via `VITE_FORMSUBMIT_EMAIL` in `.env` (defaults to `behaviorbalance20@gmail.com`).
- **One-Time Activation:** The first time a submission is received at a new email address, FormSubmit sends an activation link to that inbox to confirm receiving messages.

---

## 🚀 GitHub Pages & Custom Domain Setup

1. **GitHub Pages Deployment:**
   - Go to your repository settings on GitHub under **Settings > Pages**.
   - Under **Build and deployment**, select **Deploy from a branch**.
   - Set Branch to `main` and Folder to `/ (root)`.

2. **Custom Domain Setup (`CNAME`):**
   - Replace the contents of `CNAME` with your custom domain (e.g. `bsstherapy.com`).
   - At your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), configure DNS records:
     - **A Records** pointing `@` to GitHub Pages IPs:
       - `185.199.108.153`
       - `185.199.109.153`
       - `185.199.110.153`
       - `185.199.111.153`
     - **CNAME Record** pointing `www` to your GitHub username target (e.g., `<username>.github.io`).

---

## 🛠️ Local Development

Start the local Vite development server:

```bash
npm run dev
```

Alternatively, run a static HTTP server from the repository root:

```bash
# Windows
py -m http.server 8080

# macOS / Linux
python3 -m http.server 8080
```

Open `http://localhost:5173` (Vite) or `http://localhost:8080` in your web browser.

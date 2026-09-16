# Bett-r Support and Service Website

Production-ready, modern static website built for **Bett-r Support and Service** and configured for deployment on **GitHub Pages** with custom domain support and Web3Forms contact form integration.

---

## 📁 Clean Repository Structure

```text
bss-therapy-service/
├── index.html                 # Core HTML5 semantic page structure
├── styles.css                 # Custom CSS stylesheet with design tokens
├── script.js                  # Client-side form validation & Web3Forms integration
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

## 📧 Email Setup (Web3Forms - Zero OAuth Required)

Contact form submissions are handled by **Web3Forms**, delivering messages directly to your inbox with automatic **`Reply-To`** routing. When you click **Reply** in Outlook or Gmail, your response goes directly to the patient's email.

### Setup Steps (Takes 1 Minute):

1. Visit [web3forms.com](https://web3forms.com) and type your receiving email address to get a free **Access Key**.
2. Open [`script.js`](file:///c:/Users/talav/Documents/Github/Orly/script.js) and paste your key into `WEB3FORMS_ACCESS_KEY`:
   ```javascript
   const WEB3FORMS_ACCESS_KEY = "your-actual-access-key-here";
   ```
3. (Optional) You can also paste it into the hidden input in `index.html`:
   ```html
   <input type="hidden" name="access_key" value="your-actual-access-key-here" />
   ```

That's it! No passwords, OAuth linking, or server backends required.

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

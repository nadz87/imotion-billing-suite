# iMotion Invoicing & Delivery Suite (`billing-suite`)

A full-stack, enterprise-grade automated invoice, quotation, and delivery order generation system built for premium multimedia and video production agencies. The application features **AI-Assisted Natural Language Generation** and **Multimodal Receipt OCR scanning** powered by Gemini, and real-time **Firestore Cloud Sync** (with automatic local storage fallback).

---

## 🔍 Audit & Capabilities Report

To prepare for production VPS hosting, we performed a structural audit of the application to determine its runtime dependencies and external integrations:

1. **Frontend Architecture**
   - **Framework**: React 19 + TypeScript (compiled using Vite 6).
   - **Styling**: Tailwind CSS v4 using the modern `@tailwindcss/vite` configuration.
   - **Animations**: Fluid, hardware-accelerated transitions via `motion` (Framer Motion).
   - **Icons**: SVG vectors imported from `lucide-react`.

2. **Backend Architecture**
   - **Server Runtime**: Express v4 server (`server.ts`) running on Node.js.
   - **Static Serving**: In production mode (`NODE_ENV=production`), the Express backend serves the pre-compiled single-page application (SPA) static files from `/dist` and redirects all non-API routing requests to `index.html` to support client-side React Router navigation.
   - **API Proxy Layer**: Handles multipart form files and routes API requests to the Gemini SDK securely to prevent exposing sensitive keys to client browsers.

3. **Database & Persistence**
   - **Firestore Cloud Sync**: Integrated client-side using the standard Firebase SDK. It synchronizes records directly to Firestore when Firebase keys are provided in the environment variables.
   - **Zero-Config Fallback (High-Fidelity Local Storage)**: If Firebase credentials are left blank or unconfigured, the app falls back to client-side `localStorage`. Data persists in the browser cache, ensuring full-featured functionality out-of-the-box.

4. **Gemini AI Integration**
   - **SDK**: Modern `@google/genai` TypeScript SDK.
   - **Models**: Powered by `gemini-3.5-flash` for high speed and low latency.
   - **Text-to-Invoice**: Analyzes natural language instructions and outputs structured invoice JSON matching a strict response schema.
   - **Multimodal OCR Receipt Scanner**: Extracts line items, vendor details, totals, and SST tax calculations from receipt image uploads using base64 image streams.

5. **OCR & PDF Generation Profile**
   - **OCR Dependencies**: Leverages Gemini’s native multimodal capabilities on the server, eliminating the need for heavy, system-level server OCR engines (such as Tesseract, C++, or Python libraries).
   - **PDF Generation**: Handled directly in the browser using custom `@media print` CSS configurations. This eliminates heavy, expensive, and server-crashing server-side PDF generators (such as Puppeteer or PDFKit), resulting in perfect typography and low container footprints.

---

## 📁 Repository Directory Structure

The prepared codebase follows a modular, clean production-ready structure:

```text
billing-suite/
├── .github/
│   └── workflows/
│       └── build-check.yml       # GitHub Actions: Automatic typecheck, lint, and build validation
├── src/
│   ├── components/
│   │   ├── templates/            # Invoice, Quotation, and Delivery Order designs
│   │   │   ├── DeliveryOrderTemplate.tsx # Custom 1-line address & brand logo template
│   │   │   ├── TemplateSwitcher.tsx
│   │   │   └── ... (other designs)
│   │   ├── BrandSettings.tsx     # Brand identity and logo configuration
│   │   ├── InvoiceForm.tsx       # Dynamic manual document editor
│   │   └── InvoicePreview.tsx    # Print viewer & Convert to Delivery Order action
│   ├── context/                  # State managers (e.g., BrandSettingsContext)
│   ├── firebase/
│   │   └── config.ts             # Dynamic env-ready Firebase Firestore initializer
│   ├── services/
│   │   ├── aiService.ts          # Server-side Gemini generation and OCR scanner
│   │   └── storageService.ts     # CRUD logic for Firestore / Local Storage
│   ├── App.tsx                   # Core UI Router and Dashboard Layout
│   ├── index.css                 # Global CSS (imports Tailwind v4 & Custom fonts)
│   ├── main.tsx                  # Client entry point
│   └── types.ts                  # Shared data type schemas and interfaces
├── assets/                       # Static public assets and documentation logos
├── .env.example                  # Guide for VPS / local environment configurations
├── .gitignore                    # Ignores local node_modules, build artifacts, and .env files
├── Dockerfile                    # Multi-stage production container build rules
├── docker-compose.yml            # Docker orchestration manifest for VPS deployment
├── index.html                    # Frontend HTML shell
├── package.json                  # Dependency manifests, esbuild configurations, and run scripts
├── server.ts                     # Full-stack Node.js server entry point
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite build and tailwind plugin configuration
```

---

## 🛠️ Local Environment Setup

1. **Clone and Enter Repository**:
   ```bash
   git clone <your-new-github-repo-url> billing-suite
   cd billing-suite
   ```

2. **Configure Environment Variables**:
   Copy the example file and fill in your Gemini and optional Firebase credentials:
   ```bash
   cp .env.example .env
   nano .env
   ```

3. **Install Dependencies & Start Dev Mode**:
   ```bash
   npm install
   npm run dev
   ```
   Open `http://localhost:3000` to view the development server with HMR.

---

## 🐳 Docker Deployment (Recommended)

For production hosting on a VPS, **deploying as a single full-stack container is strongly recommended**. Because our Node.js server acts both as an API proxy for Gemini and serves our static React frontend assets, a single container keeps build overhead, resource usage, and networking complexity to an absolute minimum.

### Step 1: Build & Launch with Docker Compose
To build the optimized multi-stage image and spin up the container in the background:
```bash
docker-compose up --build -d
```

### Step 2: Manage the Container
- **View logs in real-time**:
  ```bash
  docker compose logs -f
  ```
- **Stop the container**:
  ```bash
  docker compose down
  ```
- **Check container status**:
  ```bash
  docker compose ps
  ```

---

## 🌐 Production VPS Hosting behind Nginx

To securely expose the app on standard ports (`80`/`443`) with SSL/TLS encryption, configure an **Nginx reverse proxy** on your VPS.

### 1. Nginx Site Configuration
Create a virtual host configuration file (e.g., `/etc/nginx/sites-available/billing.imotion.pro`):

```nginx
server {
    listen 80;
    server_name billing.imotion.pro; # Replace with your domain or VPS IP

    # Support large file uploads (such as high-res receipt image OCR scans)
    client_max_body_size 10M;

    # Gzip Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    location / {
        # Forward traffic to the Docker container listening on port 3000
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        # Headers to maintain request origin details
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. Enable Configuration & Get SSL Certificate (Let's Encrypt)
Run the following commands on your VPS shell:

```bash
# Link the site to make it active
sudo ln -s /etc/nginx/sites-available/billing.imotion.pro /etc/nginx/sites-enabled/

# Verify Nginx syntax is clean
sudo nginx -t

# Restart Nginx to load the proxy rules
sudo systemctl restart nginx

# Install certbot and request a free secure SSL certificate
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d billing.imotion.pro
```

---

## ⚡ GitHub Actions Workflow

The included `.github/workflows/build-check.yml` will trigger on every push or pull request to the `main` or `master` branches. It performs:
1. **Dependency integrity check** using `npm ci`.
2. **Syntax and type-safety audits** using the TypeScript linter compiler (`npm run lint`).
3. **Compilation validation** using Vite and esbuild (`npm run build`) to ensure the final bundle compiles flawlessly before deployment.

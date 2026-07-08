import "dotenv/config";
import express from "express";
import path from "path";
import multer from "multer";
import { createServer as createViteServer } from "vite";
import { generateInvoiceFromText, scanReceiptImage } from "./src/services/aiService.js";

const app = express();
const PORT = Number(process.env.PORT || 3000);

// Set up JSON body parser with increased limit for custom logo uploads if needed
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Configure Multer for processing receipt images in-memory as buffers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// --- API Endpoints ---

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 2. Text-to-Invoice endpoint (Gemini Natural Language generation)
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required." });
    }
    const data = await generateInvoiceFromText(prompt);
    res.json(data);
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate invoice." });
  }
});

// 3. Receipt OCR Scan endpoint (Gemini Multimodal scanner)
app.post("/api/ocr", upload.single("receipt"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Receipt image file is required." });
    }
    const data = await scanReceiptImage(req.file.buffer, req.file.mimetype);
    res.json(data);
  } catch (error: any) {
    console.error("OCR Scanner Error:", error);
    res.status(500).json({ error: error.message || "Failed to parse receipt image." });
  }
});

// --- Vite Middleware Integration ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 iMotion Invoicing Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});

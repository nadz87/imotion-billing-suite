import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini SDK with named parameters
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("⚠️ GEMINI_API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({
  apiKey: apiKey || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Enforce strict JSON output using the SDK's responseSchema property
const invoiceResponseSchema = {
  type: Type.OBJECT,
  properties: {
    documentType: {
      type: Type.STRING,
      description: "Must be either 'Tax Invoice' or 'Quotation' depending on user request.",
    },
    invoiceNumber: {
      type: Type.STRING,
      description: "A generated unique number, e.g., IMP-QT-2026001 or IMP-INV-2026001.",
    },
    vendor: {
      type: Type.STRING,
      description: "The service provider. Must be 'iMotion Production' for generated documents.",
    },
    date: {
      type: Type.STRING,
      description: "Document date in YYYY-MM-DD format.",
    },
    clientName: {
      type: Type.STRING,
      description: "Name of the client company or individual.",
    },
    clientAddress: {
      type: Type.STRING,
      description: "Address of the client.",
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          description: {
            type: Type.STRING,
            description: "High-end media agency term, e.g. 'Cinematography (RED V-Raptor 8K Package)', 'Post-Production & Offline Editing', 'Color Grading & Mastering'.",
          },
          quantity: {
            type: Type.NUMBER,
            description: "Number of units, hours, or packages.",
          },
          unitPrice: {
            type: Type.NUMBER,
            description: "Unit rate in MYR (RM).",
          },
          amount: {
            type: Type.NUMBER,
            description: "quantity * unitPrice",
          },
        },
        required: ["description", "quantity", "unitPrice", "amount"],
      },
    },
    subtotal: {
      type: Type.NUMBER,
      description: "Sum of all item amounts.",
    },
    tax: {
      type: Type.NUMBER,
      description: "Malaysian SST calculated at exactly 8% of the subtotal.",
    },
    total: {
      type: Type.NUMBER,
      description: "subtotal + tax",
    },
    revisionPolicy: {
      type: Type.STRING,
      description: "Clear, structured revision policy tailored to multimedia agency (e.g. 'Includes up to 3 rounds of minor offline modifications. VFX, specialized graphics, or revisions after creative sign-off are billed at RM250/hour.').",
    },
    deliveryTimeline: {
      type: Type.STRING,
      description: "Clear, structured production and delivery timeline (e.g. 'First rough cut delivered within 10 working days of production wrap. Final mastered 4K deliverables transferred within 3 working days after client approval.').",
    },
  },
  required: [
    "documentType",
    "invoiceNumber",
    "vendor",
    "date",
    "clientName",
    "clientAddress",
    "items",
    "subtotal",
    "tax",
    "total",
    "revisionPolicy",
    "deliveryTimeline",
  ],
};

/**
 * AI-Assisted generation of line items and totals from natural language text
 */
export async function generateInvoiceFromText(prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const systemInstruction = `You are the Lead Creative Producer and Chief Financial Controller of "iMotion Production", a top-tier premium multimedia, video production, and digital creative agency located in Johor Bahru, Malaysia.
Your role is to translate natural language client requests or details into formal, professional agency proposals, quotations, or tax invoices.
You must:
- Use media and creative agency terminology (e.g., "RED Komodo 6K Camera Package", "Grip & Gaffer Gear Crew", "Color Grading (DaVinci Resolve)", "Audio Post-Production & Sound SFX Design", "Creative Storyboarding & Director Treatment").
- Always format the output into the provided strict schema.
- Calculate Malaysian SST (Service Tax) at exactly 8% of the subtotal.
- Ensure all mathematics are completely flawless.
- Generate realistic, professional client details if the prompt provides a company name but lacks an address (use plausible Malaysian addresses, e.g., KL or Johor Bahru, to make it professional).
- Always include an industry-standard, professional revision policy and delivery timeline.`;

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: invoiceResponseSchema,
      temperature: 0.2, // Low temperature for calculation accuracy
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response received from Gemini.");
  }

  return JSON.parse(text);
}

/**
 * Multimodal Receipt OCR Scanner: Extracts line items, vendor, date, totals into an invoice draft structure.
 */
export async function scanReceiptImage(imageBuffer: Buffer, mimeType: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const systemInstruction = `You are an advanced AI Receipt Scanner and OCR parser.
Your task is to analyze receipt images, invoices, or billing documents and extract all relevant billing elements into our standardized JSON schema.
- Identify the original vendor, document date, line items with quantities, rates, and amounts.
- Extract any taxes or Service Tax (SST/GST) shown. If not visible, calculate the tax at 8% or leave as zero as appropriate to match the receipt total.
- Ensure the line item names are captured verbatim or polished professionally.
- Since this is an incoming receipt scanned for records or draft invoicing, extract the original vendor name as the 'vendor' field.
- Ensure that subtotal, tax, and total match the calculations in the receipt.
- Generate a clear media-style revision policy and timeline for our files if missing, or use sensible defaults.`;

  const imagePart = {
    inlineData: {
      mimeType,
      data: imageBuffer.toString("base64"),
    },
  };

  const textPart = {
    text: "Extract and structure all details from this receipt image according to the schema rules.",
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: [imagePart, textPart],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: invoiceResponseSchema,
      temperature: 0.1, // Very low temperature to prevent hallucinating extra line items
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response received from Gemini OCR.");
  }

  return JSON.parse(text);
}

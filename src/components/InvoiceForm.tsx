import React, { useState, useEffect } from "react";
import { InvoiceData, LineItem, TemplateType } from "../types";
import { useClientsQuery } from "../hooks/useInvoiceQueries";
import { useBrandSettings } from "../context/BrandSettingsContext";
import { TemplateSwitcher } from "./templates/TemplateSwitcher";
import {
  Sparkles,
  FileCheck,
  Plus,
  Trash2,
  Cpu,
  Upload,
  RefreshCw,
  FolderOpen,
  ArrowLeft,
  Layout,
  Check,
  Image as ImageIcon,
  QrCode,
  Link
} from "lucide-react";

interface InvoiceFormProps {
  initialData?: InvoiceData | null;
  onSave: (data: InvoiceData) => void;
  onCancel: () => void;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData, onSave, onCancel }) => {
  const { data: clientsList } = useClientsQuery();
  const { settings } = useBrandSettings();

  // Active sub-tab state inside Builder
  const [activeTab, setActiveTab] = useState<"manual" | "ai-writer" | "ocr-scanner">("manual");

  // Form State
  const [documentType, setDocumentType] = useState<"Tax Invoice" | "Quotation" | "Receipt" | "Delivery Order">("Tax Invoice");
  const [includeSst, setIncludeSst] = useState(true);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientWebsite, setClientWebsite] = useState("");
  const [clientContactPerson, setClientContactPerson] = useState("");
  const [items, setItems] = useState<LineItem[]>([]);
  const [revisionPolicy, setRevisionPolicy] = useState(
    "Includes up to 3 rounds of minor offline modifications. VFX, advanced CGI, or major revisions after final creative sign-off are billed at RM250/hour."
  );
  const [deliveryTimeline, setDeliveryTimeline] = useState(
    "First draft rough cut delivered within 10 working days of production wrap. Final mastered 4K master transfers executed within 3 business days of approval."
  );
  const [templateId, setTemplateId] = useState<TemplateType>("Creative");
  const [projectQrCode, setProjectQrCode] = useState<string | null>("");
  const [designBoardLink, setDesignBoardLink] = useState<string>("");

  // Custom Delivery Order states
  const [orderNumber, setOrderNumber] = useState("");
  const [associatedInvoiceNumber, setAssociatedInvoiceNumber] = useState("");
  const [totalPackagesDespatched, setTotalPackagesDespatched] = useState("1 PKG");
  const [dateDespatched, setDateDespatched] = useState(new Date().toISOString().split("T")[0]);
  const [deliveredVia, setDeliveredVia] = useState("Courier Services");
  const [weight, setWeight] = useState("");
  const [salesperson, setSalesperson] = useState("iMotion HQ");

  // AI Prompt & OCR File States
  const [aiPrompt, setAiPrompt] = useState("");
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrPreview, setOcrPreview] = useState<string | null>(null);

  // Loaders & Success Indicators
  const [aiLoading, setAiLoading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Initialize form with existing invoice details if editing
  useEffect(() => {
    if (initialData) {
      setDocumentType(initialData.documentType);
      if (initialData.includeSst !== undefined) {
        setIncludeSst(initialData.includeSst);
      } else {
        setIncludeSst(initialData.tax > 0 || initialData.subtotal === 0);
      }
      setInvoiceNumber(initialData.invoiceNumber);
      setDate(initialData.date);
      setClientName(initialData.clientName);
      setClientAddress(initialData.clientAddress);
      setClientContact(initialData.clientContact || "");
      setClientPhone(initialData.clientPhone || "");
      setClientWebsite(initialData.clientWebsite || "");
      setClientContactPerson(initialData.clientContactPerson || "");
      setItems(initialData.items || []);
      setRevisionPolicy(initialData.revisionPolicy || "");
      setDeliveryTimeline(initialData.deliveryTimeline || "");
      setTemplateId(initialData.templateId || "Creative");
      setProjectQrCode(initialData.projectQrCodeUrl || "");
      setDesignBoardLink(initialData.designBoardLink || "");
      
      // Populate Delivery Order specific states if defined
      setOrderNumber(initialData.orderNumber || `IMP-PO-${initialData.invoiceNumber.split("-").pop() || "2026"}`);
      setAssociatedInvoiceNumber(initialData.associatedInvoiceNumber || initialData.invoiceNumber);
      setTotalPackagesDespatched(initialData.totalPackagesDespatched || "1 PKG");
      setDateDespatched(initialData.dateDespatched || initialData.date);
      setDeliveredVia(initialData.deliveredVia || "Courier Services");
      setWeight(initialData.weight || "");
      setSalesperson(initialData.salesperson || "iMotion HQ");
    } else {
      // Generate default reference number
      const randomId = Math.floor(1000 + Math.random() * 9000);
      setInvoiceNumber(`IMP-INV-2026${randomId}`);
      setItems([
        { description: "Pre-Production, Storyboarding & Creative Direction", quantity: 1, unitPrice: 1500, amount: 1500 }
      ]);
      setOrderNumber(`IMP-PO-2026${randomId}`);
      setAssociatedInvoiceNumber(`IMP-INV-2026${randomId}`);
      setTotalPackagesDespatched("1 PKG");
      setDateDespatched(new Date().toISOString().split("T")[0]);
      setDeliveredVia("Courier Services");
      setWeight("");
      setSalesperson("iMotion HQ");
    }
  }, [initialData]);

  // Handle client selection from query cache
  const handleClientSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setClientName("");
      setClientAddress("");
      setClientContact("");
      setClientPhone("");
      setClientWebsite("");
      setClientContactPerson("");
    } else {
      const selected = clientsList?.find((c) => c.name === val);
      if (selected) {
        setClientName(selected.name);
        setClientAddress(selected.address);
        setClientContact(selected.contact || "");
        setClientPhone(selected.phone || "");
        setClientWebsite(selected.website || "");
        setClientContactPerson(selected.contactPerson || "");
      }
    }
  };

  // Add Item to table
  const handleAddItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0, amount: 0 }]);
  };

  // Remove Item from table
  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, idx) => idx !== index));
  };

  // Handle individual item text change
  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index] };

    if (field === "quantity") {
      item.quantity = Number(value) || 0;
    } else if (field === "unitPrice") {
      item.unitPrice = Number(value) || 0;
    } else if (field === "stockNumber") {
      item.stockNumber = value;
    } else if (field === "qtyOrdered") {
      item.qtyOrdered = Number(value) || 0;
    } else {
      item.description = value;
    }

    item.amount = item.quantity * item.unitPrice;
    updated[index] = item;
    setItems(updated);
  };

  const handleProjectQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select a QR code smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectQrCode(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculations for totals
  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const tax = includeSst ? subtotal * 0.08 : 0; // 8% SST
  const total = subtotal + tax;

  // AI Prompt generation endpoint call
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      alert("Please describe the invoice or quotation first.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!res.ok) {
        throw new Error("Failed to communicate with AI server.");
      }

      const data = await res.json();

      // Populate Form State with response from Gemini JSON Schema API
      setDocumentType(data.documentType || "Tax Invoice");
      setInvoiceNumber(data.invoiceNumber || `IMP-INV-2026${Math.floor(1000 + Math.random() * 9000)}`);
      if (data.date) setDate(data.date);
      if (data.clientName) setClientName(data.clientName);
      if (data.clientAddress) setClientAddress(data.clientAddress);
      if (data.clientContact) setClientContact(data.clientContact);
      if (data.clientPhone) setClientPhone(data.clientPhone);
      if (data.clientWebsite) setClientWebsite(data.clientWebsite);
      if (data.clientContactPerson) setClientContactPerson(data.clientContactPerson);
      if (data.items) setItems(data.items);
      if (data.revisionPolicy) setRevisionPolicy(data.revisionPolicy);
      if (data.deliveryTimeline) setDeliveryTimeline(data.deliveryTimeline);

      setSuccessMsg("✨ Gemini parsed creative details successfully!");
      setActiveTab("manual");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(`AI error: ${err.message || "Failed to process prompt."}`);
    } finally {
      setAiLoading(false);
    }
  };

  // OCR scanning with multimodal file input
  const handleOCRFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOcrFile(file);
      const url = URL.createObjectURL(file);
      setOcrPreview(url);
    }
  };

  const handleScanReceipt = async () => {
    if (!ocrFile) {
      alert("Please upload or drop a receipt image first.");
      return;
    }
    setOcrLoading(true);
    const formData = new FormData();
    formData.append("receipt", ocrFile);

    try {
      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to analyze receipt image.");
      }

      const data = await res.json();

      // Populate form state from scanned receipt
      setDocumentType(data.documentType || "Tax Invoice");
      setInvoiceNumber(data.invoiceNumber || `IMP-INV-2026${Math.floor(1000 + Math.random() * 9000)}`);
      if (data.date) setDate(data.date);
      if (data.clientName) setClientName(data.clientName);
      if (data.clientAddress) setClientAddress(data.clientAddress);
      if (data.clientContact) setClientContact(data.clientContact);
      if (data.clientPhone) setClientPhone(data.clientPhone);
      if (data.clientWebsite) setClientWebsite(data.clientWebsite);
      if (data.clientContactPerson) setClientContactPerson(data.clientContactPerson);
      if (data.items) setItems(data.items);
      if (data.revisionPolicy) setRevisionPolicy(data.revisionPolicy);
      if (data.deliveryTimeline) setDeliveryTimeline(data.deliveryTimeline);

      setSuccessMsg("🎯 OCR scanned and parsed receipt details!");
      setActiveTab("manual");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err: any) {
      alert(`OCR scan failed: ${err.message || "Failed to parse receipt."}`);
    } finally {
      setOcrLoading(false);
    }
  };

  // Submit current state back to application save mutation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert("Please provide a client name.");
      return;
    }
    if (items.length === 0) {
      alert("Please add at least one line item.");
      return;
    }

    const payload: InvoiceData = {
      id: initialData?.id,
      documentType,
      invoiceNumber,
      vendor: "iMotion Production",
      date,
      clientName,
      clientAddress,
      clientContact,
      clientPhone,
      clientWebsite,
      clientContactPerson,
      items,
      subtotal,
      tax,
      total,
      revisionPolicy,
      deliveryTimeline,
      templateId,
      includeSst,
      projectQrCodeUrl: projectQrCode,
      designBoardLink,
      
      // Custom logistics support fields
      orderNumber,
      associatedInvoiceNumber,
      totalPackagesDespatched,
      dateDespatched,
      deliveredVia,
      weight,
      salesperson,
    };

    onSave(payload);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 no-print">
      {/* Back button header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <button
          onClick={onCancel}
          className="flex items-center text-slate-500 hover:text-slate-900 font-semibold text-xs cursor-pointer gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>
        <span className="text-xs font-bold text-slate-400">
          {initialData ? `Editing: ${initialData.invoiceNumber}` : "New Campaign Document"}
        </span>
      </div>

      {/* Main Feature Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full">
        <button
          onClick={() => setActiveTab("manual")}
          className={`flex-1 flex items-center justify-center py-3.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all gap-2 ${
            activeTab === "manual" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FolderOpen className="h-4 w-4" /> Manual Form Editor
        </button>
        <button
          onClick={() => setActiveTab("ai-writer")}
          className={`flex-1 flex items-center justify-center py-3.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all gap-2 ${
            activeTab === "ai-writer" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Sparkles className="h-4 w-4" /> AI Prompt Builder
        </button>
        <button
          onClick={() => setActiveTab("ocr-scanner")}
          className={`flex-1 flex items-center justify-center py-3.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all gap-2 ${
            activeTab === "ocr-scanner" ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <Cpu className="h-4 w-4" /> AI OCR Receipt Scanner
        </button>
      </div>

      {/* AI Success Notification */}
      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-2 text-sm text-emerald-800 animate-bounce">
          <Check className="h-5 w-5 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* TAB 1: AI Prompt Writer */}
      {activeTab === "ai-writer" && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="text-yellow-500 h-5 w-5" /> Gemini AI Natural Language Draft Writer
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Describe the invoice or quotation in plain English (e.g., campaign shoot for Petronas, 3 cameras, 2 editors, RM12,000 budget), and Gemini will compose the services list, price entries, and SST calculations.
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              rows={5}
              placeholder="E.g., Compose a Quotation for Astro Malaysia Holdings for a 3-day corporate video shoot. Include Red Raptor camera packages, a crew of 4, post-production audio mixing, and visual editing. The total budget is RM18,000."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white"
            />
            <button
              onClick={handleGenerateWithAI}
              disabled={aiLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <RefreshCw className="animate-spin h-4 w-4" /> Consulting Gemini Agent...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-yellow-300 fill-yellow-300" /> Compose Document with Gemini
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: AI OCR Receipt Scanner */}
      {activeTab === "ocr-scanner" && (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <Cpu className="text-blue-600 h-5 w-5" /> Multimodal AI Receipt OCR Scanner
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Upload an image of a receipts or invoice from gear rental, talent payments, or travel, and Gemini will scan and extract all line items, dates, vendor names, and totals into this builder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-dashed border-slate-200 hover:border-slate-400 bg-slate-50 hover:bg-slate-50/50 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer relative min-h-60 transition-all">
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={handleOCRFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="text-slate-400 h-8 w-8 mb-2" />
              <p className="text-sm font-semibold text-slate-800">Select receipt image</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
            </div>

            <div className="border border-slate-100 rounded-2xl bg-slate-50 p-4 flex flex-col justify-between min-h-60">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Selected Image Preview</p>
              {ocrPreview ? (
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-xl mt-3 relative max-h-40">
                  <img src={ocrPreview} alt="Receipt preview" className="object-contain max-h-full max-w-full" />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 mt-3">
                  <ImageIcon className="h-10 w-10 text-slate-300 mb-1" />
                  <span className="text-xs">No image uploaded</span>
                </div>
              )}
              <button
                onClick={handleScanReceipt}
                disabled={ocrLoading || !ocrFile}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm py-3 px-4 rounded-xl cursor-pointer shadow-sm mt-4 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {ocrLoading ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4" /> Optical Scanning with Gemini...
                  </>
                ) : (
                  <>
                    <Cpu className="h-4 w-4" /> Run Multimodal Scan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Main Manual Form Editor */}
      {activeTab === "manual" && (
        <form onSubmit={handleSubmit} className="w-full bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            {/* Form Fields */}
            <div className="p-6 sm:p-8 space-y-6">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-3 mb-4">
              <FileCheck className="text-slate-700 h-5 w-5" /> Document Specifications
            </h3>

            {/* Document Header fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => {
                    const newType = e.target.value as any;
                    setDocumentType(newType);
                    // Smart formatting prefix & template switching
                    if (newType === "Delivery Order") {
                      setTemplateId("DeliveryOrder" as any);
                      if (invoiceNumber.startsWith("IMP-INV-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-INV-", "IMP-DO-"));
                      } else if (invoiceNumber.startsWith("IMP-QT-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-QT-", "IMP-DO-"));
                      } else if (invoiceNumber.startsWith("IMP-REC-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-REC-", "IMP-DO-"));
                      } else if (!invoiceNumber.includes("IMP-DO-")) {
                        setInvoiceNumber(`IMP-DO-${invoiceNumber.split("-").pop() || "2026"}`);
                      }
                    } else if (newType === "Receipt") {
                      if (invoiceNumber.startsWith("IMP-DO-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-DO-", "IMP-REC-"));
                      } else if (invoiceNumber.startsWith("IMP-INV-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-INV-", "IMP-REC-"));
                      } else if (invoiceNumber.startsWith("IMP-QT-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-QT-", "IMP-REC-"));
                      }
                    } else if (newType === "Quotation") {
                      if (invoiceNumber.startsWith("IMP-DO-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-DO-", "IMP-QT-"));
                      } else if (invoiceNumber.startsWith("IMP-INV-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-INV-", "IMP-QT-"));
                      } else if (invoiceNumber.startsWith("IMP-REC-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-REC-", "IMP-QT-"));
                      }
                    } else { // Tax Invoice
                      if (invoiceNumber.startsWith("IMP-DO-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-DO-", "IMP-INV-"));
                      } else if (invoiceNumber.startsWith("IMP-QT-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-QT-", "IMP-INV-"));
                      } else if (invoiceNumber.startsWith("IMP-REC-")) {
                        setInvoiceNumber(invoiceNumber.replace("IMP-REC-", "IMP-INV-"));
                      }
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
                >
                  <option value="Tax Invoice">Tax Invoice (SST)</option>
                  <option value="Quotation">Quotation (Draft)</option>
                  <option value="Receipt">Receipt (Thermal Style)</option>
                  <option value="Delivery Order">Delivery Order (Logistics)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Document Number
                </label>
                <input
                  type="text"
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* SST (8%) Toggle Switch Row */}
            <div className="bg-slate-50 border border-slate-100/50 p-4 rounded-xl flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">Apply Malaysian SST (8%)</span>
                <span className="text-[10px] text-slate-400">Enable 8% service tax calculation for this document.</span>
              </div>
              <button
                type="button"
                onClick={() => setIncludeSst(!includeSst)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  includeSst ? "bg-emerald-600" : "bg-slate-200"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    includeSst ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Delivery Order Specific Logistics Fields (only visible for Delivery Order) */}
            {documentType === "Delivery Order" && (
              <div className="bg-blue-50/40 p-5 rounded-2xl border border-blue-100 space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-blue-900 flex items-center gap-1.5 border-b border-blue-100 pb-2">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                    Logistics & Despatch Specifications (Delivery Order)
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">Configure shipping metadata shown on your physical delivery order.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Purchase Order (PO) Number
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., PO-7780"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Associated Invoice No.
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., IMP-INV-20268892"
                      value={associatedInvoiceNumber}
                      onChange={(e) => setAssociatedInvoiceNumber(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Packages Despatched
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., 2 BOXES, 1 PALLET"
                      value={totalPackagesDespatched}
                      onChange={(e) => setTotalPackagesDespatched(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Date Despatched
                    </label>
                    <input
                      type="date"
                      value={dateDespatched}
                      onChange={(e) => setDateDespatched(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Delivered Via
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., Lalamove, DHL, Hand Carry"
                      value={deliveredVia}
                      onChange={(e) => setDeliveredVia(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Total Weight (KG / Tons)
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., 14.5 KG"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      Salesperson / Handler
                    </label>
                    <input
                      type="text"
                      placeholder="E.g., Imran Shah"
                      value={salesperson}
                      onChange={(e) => setSalesperson(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Client Section */}
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-5">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-slate-100 pb-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Bill To / Quotation Recipient
                  </label>
                  <p className="text-[11px] text-slate-400 mt-0.5">Specify registered client details and attention contacts</p>
                </div>
                {clientsList && clientsList.length > 0 && (
                  <select
                    onChange={handleClientSelect}
                    className="bg-white border border-slate-200 rounded-xl text-xs py-1.5 px-3 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer shadow-sm"
                  >
                    <option value="custom">-- Choose Saved Client --</option>
                    {clientsList.map((client) => (
                      <option key={client.id} value={client.name}>
                        {client.name}
                      </option>
                    ))}
                    <option value="custom">Custom (Type below)</option>
                  </select>
                )}
              </div>

              {/* Responsive Grid of Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 flex items-center">
                    Company Name <span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Petronas Berhad"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Harris bin Ahmad"
                    value={clientContactPerson}
                    onChange={(e) => setClientContactPerson(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">E.g., Printed on Attention (Attn:) line</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Client Physical Address
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., Tower 1, Twin Towers, Kuala Lumpur City Centre, 50088 Kuala Lumpur"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., billing@absorich.com"
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Used for payment receipts & follow-ups</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Client Phone
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., +60 13-313 0838"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Include country code if outside Malaysia</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">
                    Client Website
                  </label>
                  <input
                    type="text"
                    placeholder="E.g., www.absorich.com"
                    value={clientWebsite}
                    onChange={(e) => setClientWebsite(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Corporate website homepage (optional)</p>
                </div>
              </div>
            </div>

            {/* Line Items Editor */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  {documentType === "Delivery Order" ? "Delivery Manifest Items" : "Deliverables & Pricing Items"}
                </label>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-xs text-slate-900 hover:text-slate-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Add Line Item
                </button>
              </div>

              {items.length > 0 ? (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    documentType === "Delivery Order" ? (
                      /* Delivery Order specialized item editor row */
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center border-b border-slate-50 pb-3 sm:pb-2 bg-blue-50/10 p-3 rounded-xl border border-blue-100/50"
                      >
                        {/* Description */}
                        <div className="sm:col-span-5">
                          <label className="block sm:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5">Item Description</label>
                          <input
                            type="text"
                            required
                            placeholder="Item Description (e.g., VFX Workstation Unit)"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        {/* Stock Number */}
                        <div className="sm:col-span-3">
                          <label className="block sm:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5">Stock / SKU No.</label>
                          <input
                            type="text"
                            placeholder="Stock No. (E.g., IM-1025)"
                            value={item.stockNumber || ""}
                            onChange={(e) => handleItemChange(idx, "stockNumber", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-center font-mono"
                          />
                        </div>

                        {/* Qty Ordered */}
                        <div className="sm:col-span-2">
                          <label className="block sm:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5">Qty Ordered</label>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="Ordered"
                            value={item.qtyOrdered !== undefined ? item.qtyOrdered : item.quantity}
                            onChange={(e) => handleItemChange(idx, "qtyOrdered", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-center font-mono"
                          />
                        </div>

                        {/* Qty Sent */}
                        <div className="sm:col-span-1.5">
                          <label className="block sm:hidden text-[9px] font-bold text-slate-400 uppercase mb-0.5">Qty Sent</label>
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="Sent"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                            className="w-full bg-white border border-blue-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-center font-mono font-bold text-blue-900"
                          />
                        </div>

                        {/* Trash */}
                        <div className="sm:col-span-0.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Standard invoice/quotation/receipt item editor row */
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center border-b border-slate-50 pb-3 sm:pb-0"
                      >
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            required
                            placeholder="Service Description (e.g., Cinematography Crew)"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                          />
                        </div>
                        <div className="col-span-2 sm:col-span-1.5">
                          <input
                            type="number"
                            required
                            min="1"
                            placeholder="Qty"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, "quantity", e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none"
                          />
                        </div>
                        <div className="col-span-4 sm:col-span-2.5">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">RM</span>
                            <input
                              type="number"
                              required
                              min="0"
                              placeholder="Price"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-sm focus:outline-none"
                            />
                          </div>
                        </div>
                        <div className="col-span-4 sm:col-span-1.5 text-right font-mono text-xs font-bold text-slate-800">
                          RM {item.amount.toFixed(2)}
                        </div>
                        <div className="col-span-2 sm:col-span-0.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4 mx-auto" />
                          </button>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <p className="text-center text-xs text-slate-400 italic py-6">
                  {documentType === "Delivery Order"
                    ? 'No manifest items specified yet. Click "Add Line Item" to define deliverable package items.'
                    : 'No deliverables specified yet. Click "Add Line Item" to define project scopes.'}
                </p>
              )}
            </div>

            {/* Project QR Code Upload Section */}
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <QrCode className="h-4 w-4 text-slate-600" /> Project QR Code Image (Related Project Details)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-28 h-28 border border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-sm">
                  {projectQrCode ? (
                    <div className="relative w-full h-full group">
                      <img src={projectQrCode} alt="Project QR Preview" className="w-full h-full object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => setProjectQrCode("")}
                        className="absolute inset-0 bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        Remove QR
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-2">
                      <QrCode className="mx-auto text-slate-300 h-7 w-7 mb-1" />
                      <p className="text-[9px] text-slate-400">Design Board QR</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto">
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Upload Project QR
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleProjectQrCodeUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                    Upload a QR code representing the related project's design board, files, or reference links shown at the bottom yellow area.
                  </p>
                </div>
              </div>

              {/* Design Board Link Text Input */}
              <div className="border-t border-slate-200/60 pt-4 mt-3 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Link className="h-4 w-4 text-slate-500" /> Design Board Link (URL)
                </label>
                <input
                  type="url"
                  value={designBoardLink}
                  onChange={(e) => setDesignBoardLink(e.target.value)}
                  placeholder="e.g., https://imotion.my/your-figma-or-frameio-link"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all shadow-sm"
                />
                <p className="text-[10px] text-slate-400 leading-normal">
                  Paste the live URL (e.g., Figma board, Frame.io review link, or client drive folder) that will be linked to from the <strong>"DESIGN BOARD LINK"</strong> text at the bottom.
                </p>
              </div>
            </div>

            {/* Premium Template Selection */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1">
                <Layout className="h-4 w-4" /> Select Premium Template Layout
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {(["Minimal", "Modern", "Creative", "Corporate", "Dark"] as TemplateType[]).map((temp) => (
                  <button
                    key={temp}
                    type="button"
                    onClick={() => setTemplateId(temp)}
                    className={`p-3 border rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      templateId === temp
                        ? "border-slate-900 bg-slate-900 text-white font-bold shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span className="text-sm">{temp}</span>
                    <span className="text-[9px] mt-1 opacity-75">
                      {temp === "Minimal" && "Clean & airy"}
                      {temp === "Modern" && "Bold banner"}
                      {temp === "Creative" && "iMotion Split (PDF)"}
                      {temp === "Corporate" && "Formal grid"}
                      {temp === "Dark" && "Futuristic"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom fields (policies/timeline) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Creative Revision Policy
                </label>
                <textarea
                  rows={3}
                  value={revisionPolicy}
                  onChange={(e) => setRevisionPolicy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                  Production Delivery Timeline
                </label>
                <textarea
                  rows={3}
                  value={deliveryTimeline}
                  onChange={(e) => setDeliveryTimeline(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Actions footer */}
          <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
            <div className="text-left">
              <span className="text-xs text-slate-400">{includeSst ? "Total SST (8%) Due:" : "Total Due (SST Exempt):"}</span>
              <p className="text-lg font-extrabold text-slate-900">RM {total.toFixed(2)}</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2 rounded-xl cursor-pointer shadow-sm transition-colors"
              >
                Save & Preview Document
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
export default InvoiceForm;

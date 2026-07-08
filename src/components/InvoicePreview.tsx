import React, { useState } from "react";
import { InvoiceData } from "../types";
import { useBrandSettings } from "../context/BrandSettingsContext";
import { TemplateSwitcher } from "./templates/TemplateSwitcher";
import { useSaveInvoiceMutation } from "../hooks/useInvoiceQueries";
import { Printer, Edit3, ArrowLeft, Download, Info, ExternalLink, AlertTriangle, X, FileCheck, RefreshCw } from "lucide-react";

interface InvoicePreviewProps {
  invoice: InvoiceData;
  onEdit: () => void;
  onBack: () => void;
  onUpdate?: (updated: InvoiceData) => void;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, onEdit, onBack, onUpdate }) => {
  const { settings } = useBrandSettings();
  const saveMutation = useSaveInvoiceMutation();
  const [showIframeWarning, setShowIframeWarning] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  const isIframe = typeof window !== "undefined" && window.self !== window.top;

  const handleConvertToInvoice = async () => {
    setIsConverting(true);
    try {
      // Create converted copy of the quotation
      const newInvoiceNumber = invoice.invoiceNumber.toUpperCase().startsWith("QT") 
        ? invoice.invoiceNumber.replace(/^QT/i, "INV") 
        : `INV-${invoice.invoiceNumber}`;

      const converted: InvoiceData = {
        ...invoice,
        documentType: "Tax Invoice",
        invoiceNumber: newInvoiceNumber,
        date: new Date().toISOString().split("T")[0], // Update to current date as invoice date
      };

      const savedDoc = await saveMutation.mutateAsync(converted);
      if (onUpdate) {
        onUpdate(savedDoc);
      }
      alert(`Quotation successfully converted to Tax Invoice: ${newInvoiceNumber}`);
    } catch (err) {
      console.error(err);
      alert("Failed to convert quotation to invoice.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleConvertToDeliveryOrder = async () => {
    setIsConverting(true);
    try {
      // Create converted copy of the invoice as a Delivery Order
      const newDONumber = invoice.invoiceNumber.toUpperCase().startsWith("IMP-INV") 
        ? invoice.invoiceNumber.replace(/^IMP-INV/i, "IMP-DO") 
        : invoice.invoiceNumber.toUpperCase().startsWith("INV")
          ? invoice.invoiceNumber.replace(/^INV/i, "DO")
          : `DO-${invoice.invoiceNumber}`;

      const converted: InvoiceData = {
        ...invoice,
        documentType: "Delivery Order",
        templateId: "DeliveryOrder",
        invoiceNumber: newDONumber,
        date: new Date().toISOString().split("T")[0], // Update to current date as DO date
        associatedInvoiceNumber: invoice.invoiceNumber,
        orderNumber: invoice.orderNumber || `IMP-PO-${invoice.invoiceNumber.split("-").pop() || "2026"}`,
        totalPackagesDespatched: invoice.totalPackagesDespatched || "1 PKG",
        dateDespatched: invoice.dateDespatched || new Date().toISOString().split("T")[0],
        deliveredVia: invoice.deliveredVia || "Courier Services",
        weight: invoice.weight || "",
        salesperson: invoice.salesperson || "iMotion HQ",
      };

      const savedDoc = await saveMutation.mutateAsync(converted);
      if (onUpdate) {
        onUpdate(savedDoc);
      }
      alert(`Invoice successfully converted to Delivery Order: ${newDONumber}`);
    } catch (err) {
      console.error(err);
      alert("Failed to convert invoice to delivery order.");
    } finally {
      setIsConverting(false);
    }
  };

  const handlePrint = () => {
    if (isIframe) {
      setShowIframeWarning(true);
      return;
    }

    try {
      window.print();
    } catch (e) {
      console.error("Print or Save as PDF is restricted in the preview iframe:", e);
      setShowIframeWarning(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Interactive Toolbar - Hidden when printing */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 no-print">
        <button
          onClick={onBack}
          className="flex items-center text-slate-500 hover:text-slate-900 font-semibold text-xs cursor-pointer gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Return to List
        </button>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
          {invoice.documentType === "Quotation" && (
            <button
              onClick={handleConvertToInvoice}
              disabled={isConverting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="animate-spin h-3.5 w-3.5" /> Converting...
                </>
              ) : (
                <>
                  <FileCheck className="h-3.5 w-3.5" /> Convert to Invoice
                </>
              )}
            </button>
          )}

          {invoice.documentType === "Tax Invoice" && (
            <button
              onClick={handleConvertToDeliveryOrder}
              disabled={isConverting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
            >
              {isConverting ? (
                <>
                  <RefreshCw className="animate-spin h-3.5 w-3.5" /> Converting...
                </>
              ) : (
                <>
                  <FileCheck className="h-3.5 w-3.5" /> Convert to Delivery Order
                </>
              )}
            </button>
          )}

          <button
            onClick={onEdit}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Document
          </button>
          
          <button
            onClick={handlePrint}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Printer className="h-4 w-4" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Printing Tips Callout Banner */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 text-xs text-blue-800 no-print">
        <Info className="h-5 w-5 text-blue-600 shrink-0" />
        <div>
          <span className="font-bold">Pro-Tip for PDF Saving:</span>
          <p className="mt-1 leading-relaxed">
            When the print dialog opens, set the Destination to <span className="font-semibold">"Save as PDF"</span>. 
            For flawless visual designs, enable <span className="font-semibold">"Background graphics"</span> in the printing options dialog.
          </p>
        </div>
      </div>

      {/* Sandboxed iFrame Modal Warning */}
      {showIframeWarning && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 no-print">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl border border-slate-100 overflow-hidden relative">
            <button 
              onClick={() => setShowIframeWarning(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="p-6">
              <div className="flex items-center gap-3 text-amber-600 mb-4">
                <AlertTriangle className="h-6 w-6 shrink-0" />
                <h3 className="text-base font-bold text-slate-950">Print Restricted by Sandbox</h3>
              </div>
              
              <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
                <p>
                  Modern web browsers strictly block print commands (`window.print()`) from running inside embedded preview panels or iframes for security reasons.
                </p>
                <p className="font-semibold text-slate-800">
                  To save/print your document flawlessly in high-fidelity:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-slate-700">
                  <li>Click the button below to open this application in a clean, new browser tab.</li>
                  <li>Click <strong>"Print / Save as PDF"</strong> inside that tab.</li>
                  <li>Set the Destination to <strong>"Save as PDF"</strong> (enable <em>"Background graphics"</em> in the layout options).</li>
                </ol>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <a
                  href={typeof window !== "undefined" ? window.location.href : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowIframeWarning(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-3 px-4 rounded-xl text-center flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                >
                  <ExternalLink className="h-4 w-4" /> Open App in New Tab to Print
                </a>
                <button
                  onClick={() => setShowIframeWarning(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 px-4 rounded-xl text-center cursor-pointer transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Printable template canvas - Spans full-screen on printing */}
      <div className="printable-document bg-white rounded-2xl shadow-sm border border-slate-100/50 overflow-hidden">
        <TemplateSwitcher data={invoice} branding={settings} />
      </div>
    </div>
  );
};
export default InvoicePreview;

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrandSettingsProvider } from "./context/BrandSettingsContext";
import { useInvoicesQuery, useSaveInvoiceMutation } from "./hooks/useInvoiceQueries";
import { isFirebaseConfigured } from "./firebase/config";
import { InvoiceList } from "./components/InvoiceList";
import { InvoiceForm } from "./components/InvoiceForm";
import { InvoicePreview } from "./components/InvoicePreview";
import { BrandSettings } from "./components/BrandSettings";
import { InvoiceData } from "./types";
import {
  FileText,
  Sliders,
  Sparkles,
  CloudLightning,
  CheckCircle,
  Database,
  ArrowUpRight
} from "lucide-react";

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const InvoicingHubContent: React.FC = () => {
  // Navigation states
  const [currentView, setCurrentView] = useState<"dashboard" | "builder" | "preview" | "settings">("dashboard");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

  // Queries & Mutations
  const { data: invoices = [], isLoading } = useInvoicesQuery();
  const saveMutation = useSaveInvoiceMutation();

  // Navigation handlers
  const handleSelectInvoice = (invoice: InvoiceData) => {
    setSelectedInvoice(invoice);
    setCurrentView("preview");
  };

  const handleCreateNew = () => {
    setSelectedInvoice(null);
    setCurrentView("builder");
  };

  const handleEditInvoice = () => {
    setCurrentView("builder");
  };

  const handleSaveInvoice = async (invoice: InvoiceData) => {
    try {
      const savedDoc = await saveMutation.mutateAsync(invoice);
      setSelectedInvoice(savedDoc);
      setCurrentView("preview");
    } catch (err) {
      alert("Failed to save the invoice or quotation.");
    }
  };

  const handleCancelBuilder = () => {
    if (selectedInvoice) {
      setCurrentView("preview");
    } else {
      setCurrentView("dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col justify-between">
      {/* 1. Global Navigation - Hidden during PDF generation printing */}
      <nav className="bg-white border-b border-slate-100 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Brand Logo & Title */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                iM
              </div>
              <div>
                <span className="font-bold text-slate-900 uppercase tracking-tight text-sm sm:text-base">
                  iMotion <span className="font-light text-slate-500">Production</span>
                </span>
                <span className="text-[10px] sm:text-[11px] text-blue-600 font-extrabold ml-1.5 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded">
                  AI Billing Hub
                </span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="flex items-center gap-1 sm:gap-4">
              <button
                onClick={() => setCurrentView("dashboard")}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer flex items-center gap-1.5 transition-all ${
                  currentView === "dashboard" || currentView === "preview"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <FileText className="h-4 w-4" /> Documents
              </button>

              <button
                onClick={() => setCurrentView("settings")}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer flex items-center gap-1.5 transition-all ${
                  currentView === "settings"
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                <Sliders className="h-4 w-4" /> Brand Guidelines
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Database Connection Banner - Hidden during PDF generation */}
      <div className="no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {isFirebaseConfigured ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3.5 flex items-center justify-between text-xs text-emerald-800">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>
                  <span className="font-bold">Firestore Sync Active:</span> Every client, draft, invoice, and logo is safely synchronized to your Firebase cloud account.
                </span>
              </div>
              <span className="hidden md:inline-block bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                PRODUCTION READY
              </span>
            </div>
          ) : (
            <div className="bg-slate-100 border border-slate-200 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
              <div className="flex items-start sm:items-center gap-2">
                <Database className="h-4 w-4 text-slate-500 shrink-0 mt-0.5 sm:mt-0" />
                <div>
                  <span className="font-bold text-slate-800">Local Cache Active (Offline Mode):</span> Running in high-fidelity local emulation. Setup Firestore credentials in <code className="bg-slate-200/80 px-1 py-0.5 rounded text-rose-600 font-mono font-bold">src/firebase/config.ts</code> to enable live multi-user cloud sync.
                </div>
              </div>
              <a
                href="#settings"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentView("settings");
                }}
                className="text-slate-900 hover:text-slate-700 font-bold flex items-center shrink-0 self-start sm:self-auto gap-0.5"
              >
                View guidelines <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      {/* 3. Main Application Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "dashboard" && (
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Database className="animate-bounce text-slate-300 h-10 w-10" />
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest">Waking up database nodes...</p>
            </div>
          ) : (
            <InvoiceList
              invoices={invoices}
              onSelect={handleSelectInvoice}
              onCreateNew={handleCreateNew}
            />
          )
        )}

        {currentView === "builder" && (
          <InvoiceForm
            initialData={selectedInvoice}
            onSave={handleSaveInvoice}
            onCancel={handleCancelBuilder}
          />
        )}

        {currentView === "preview" && selectedInvoice && (
          <InvoicePreview
            invoice={selectedInvoice}
            onEdit={handleEditInvoice}
            onBack={() => {
              setSelectedInvoice(null);
              setCurrentView("dashboard");
            }}
            onUpdate={(updated) => setSelectedInvoice(updated)}
          />
        )}

        {currentView === "settings" && <BrandSettings />}
      </main>

      {/* 4. Visual Margin Footer - Hidden during printing */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
          <p className="font-medium text-slate-500">
            iMotion Production AI Invoice & Quotation Hub v1.0.0
          </p>
          <p>
            Johor Bahru, Malaysia | Crafted for premium multimedia video production & digital media agency operations.
          </p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrandSettingsProvider>
        <InvoicingHubContent />
      </BrandSettingsProvider>
    </QueryClientProvider>
  );
};

export default App;

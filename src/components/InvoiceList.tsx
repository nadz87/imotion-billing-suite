import React, { useState } from "react";
import { InvoiceData } from "../types";
import { Search, Filter, Plus, FileText, ChevronRight, Coins, Percent, FileCheck, Layers } from "lucide-react";
import { motion } from "motion/react";

interface InvoiceListProps {
  invoices: InvoiceData[];
  onSelect: (invoice: InvoiceData) => void;
  onCreateNew: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onSelect, onCreateNew }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"All" | "Tax Invoice" | "Quotation" | "Receipt">("All");

  // Filter invoices based on type and search query
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      (inv.invoiceNumber || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.items || []).some((item) => (item?.description || "").toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType === "All" || inv.documentType === filterType;

    return matchesSearch && matchesType;
  });

  // Calculate Metrics
  const totalInvoiced = invoices
    .filter((inv) => inv.documentType === "Tax Invoice")
    .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

  const totalQuoted = invoices
    .filter((inv) => inv.documentType === "Quotation")
    .reduce((sum, inv) => sum + Number(inv.total || 0), 0);

  const totalSST = invoices
    .filter((inv) => inv.documentType === "Tax Invoice")
    .reduce((sum, inv) => sum + Number(inv.tax || 0), 0);

  const totalCount = invoices.length;

  return (
    <div className="space-y-8 no-print">
      {/* 4-Bento Grid metrics card header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 rounded-xl text-emerald-600">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Invoiced (SST)</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">RM {totalInvoiced.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-sky-50 rounded-xl text-sky-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Proposed (Quotations)</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">RM {totalQuoted.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 rounded-xl text-blue-600">
            <Percent className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">SST Tax Collected (8%)</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">RM {totalSST.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-slate-100 rounded-xl text-slate-700">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Documents</p>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{totalCount} Campaigns</h3>
          </div>
        </div>
      </div>

      {/* Control Panel (Search & Filter Tabs) */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number, client name, services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
          />
        </div>

        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto">
          {/* Document type filter tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(["All", "Tax Invoice", "Quotation", "Receipt", "Delivery Order"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                  filterType === type ? "bg-white text-slate-950 shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {type === "All"
                  ? "All"
                  : type === "Tax Invoice"
                  ? "Invoices"
                  : type === "Quotation"
                  ? "Quotations"
                  : type === "Receipt"
                  ? "Receipts"
                  : "Delivery Orders"}
              </button>
            ))}
          </div>

          <button
            onClick={onCreateNew}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="h-4 w-4" /> New Document
          </button>
        </div>
      </div>

      {/* Documents Grid / List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h4 className="text-sm font-bold text-slate-800">Billing History Log</h4>
        </div>

        {filteredInvoices.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredInvoices.map((inv) => (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={inv.id}
                onClick={() => onSelect(inv)}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/70 cursor-pointer transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`p-2.5 rounded-xl ${
                      inv.documentType === "Tax Invoice" ? "bg-emerald-50 text-emerald-600" :
                      inv.documentType === "Receipt" ? "bg-rose-50 text-rose-600" :
                      inv.documentType === "Delivery Order" ? "bg-blue-50 text-blue-600" : "bg-sky-50 text-sky-600"
                    }`}
                  >
                    <FileCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{inv.invoiceNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.documentType === "Tax Invoice"
                            ? "bg-emerald-50 text-emerald-700"
                            : inv.documentType === "Receipt"
                            ? "bg-rose-50 text-rose-700"
                            : inv.documentType === "Delivery Order"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-sky-50 text-sky-700"
                        }`}
                      >
                        {inv.documentType}
                      </span>
                      <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                        {inv.templateId} Layout
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-700 mt-1">{inv.clientName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Date Created: {inv.date}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      {inv.documentType === "Delivery Order" ? "Shipment Size" : "Campaign Budget"}
                    </p>
                    <p className="text-lg font-extrabold text-slate-950 mt-0.5">
                      {inv.documentType === "Delivery Order"
                        ? (inv.totalPackagesDespatched || "1 PKG")
                        : `RM ${Number(inv.total || 0).toLocaleString("en-MY", { minimumFractionDigits: 2 })}`}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-16 text-center">
            <FileText className="mx-auto text-slate-300 h-12 w-12 mb-3" />
            <h3 className="text-base font-bold text-slate-800">No documents found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm
                ? `No invoices matching "${searchTerm}" found in the directory.`
                : "Create your first AI-assisted invoice or quotation by clicking 'New Document' above."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default InvoiceList;

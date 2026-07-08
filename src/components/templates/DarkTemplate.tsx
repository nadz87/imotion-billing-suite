import React from "react";
import { InvoiceData, BrandingSettings } from "../../types";

interface InvoiceTemplateProps {
  data: InvoiceData;
  branding: BrandingSettings;
}

export const DarkTemplate: React.FC<InvoiceTemplateProps> = ({ data, branding }) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: "Rubik, sans-serif",
  };

  const textAccentStyle = {
    color: branding.secondaryColor || "#3b82f6",
  };

  const bgAccentStyle = {
    backgroundColor: branding.primaryColor || "#0f172a",
  };

  const outlineAccentStyle = {
    borderColor: branding.secondaryColor || "#3b82f6",
  };

  return (
    <div
      style={containerStyle}
      className="bg-[#121620] text-slate-300 p-12 md:p-16 w-full max-w-4xl mx-auto min-h-[1056px] flex flex-col justify-between overflow-hidden shadow-2xl relative"
    >
      {/* Dynamic ambient dark visual background effects */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

      <div className="relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-800 pb-8 mb-10">
          <div>
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="h-14 mb-4 object-contain brightness-110" />
            ) : (
              <div
                style={outlineAccentStyle}
                className="h-10 w-28 border rounded flex items-center justify-center font-mono text-xs mb-4"
              >
                iMotion Pro
              </div>
            )}
            <h2 className="text-xl font-black text-white tracking-tight">{branding.companyName || data.vendor || "iMotion Production"}</h2>
            <p className="text-[11px] text-slate-500 mt-1 leading-normal whitespace-pre-line">
              {branding.companyAddress || "Level 14, Menara MSC Cyberport, No. 5 Jalan Bukit Meldrum\n80300 Johor Bahru, Johor, Malaysia"}
              {(branding.companyContact || branding.companyEmail) && (
                <span className="block mt-1 lowercase font-semibold text-slate-400">
                  {branding.companyContact} {branding.companyContact && branding.companyEmail && " | "} {branding.companyEmail}
                </span>
              )}
            </p>
          </div>
          <div className="text-left md:text-right mt-6 md:mt-0">
            <span
              style={{ backgroundColor: (branding.secondaryColor || "#3b82f6") + "20", color: branding.secondaryColor || "#3b82f6" }}
              className="px-3 py-1 rounded text-xs font-bold uppercase tracking-widest block w-max md:ml-auto mb-3"
            >
              {data.documentType}
            </span>
            <p className="text-sm font-semibold font-mono text-white">Ref No: {data.invoiceNumber}</p>
            <p className="text-xs text-slate-500 mt-1">Date Issued: {data.date}</p>
          </div>
        </div>

        {/* Invoice details grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-[#191e2b] p-5 rounded-xl border border-slate-800/80 md:col-span-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Client Destination
            </span>
            <p className="text-base font-bold text-white mb-1">{data.clientName || "N/A"}</p>
            <div className="text-xs text-slate-400 space-y-0.5 mb-2 leading-relaxed">
              {data.clientContactPerson && <p><span className="font-semibold text-slate-300">Attn:</span> {data.clientContactPerson}</p>}
              {data.clientPhone && <p><span className="font-semibold text-slate-300">Phone:</span> {data.clientPhone}</p>}
              {data.clientContact && <p><span className="font-semibold text-slate-300">Email:</span> {data.clientContact}</p>}
              {data.clientWebsite && <p><span className="font-semibold text-slate-300">Website:</span> {data.clientWebsite}</p>}
            </div>
            <p className="text-xs text-slate-500 border-t border-slate-800/80 pt-2 whitespace-pre-line leading-relaxed">
              {data.clientAddress || "No client address provided."}
            </p>
          </div>
          <div className="bg-[#191e2b] p-5 rounded-xl border border-slate-800/80 text-left md:text-right flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Currency & Tax
            </span>
            <p className="text-xs leading-relaxed text-slate-400">
              Billing Currency: <span className="font-semibold text-white">MYR (RM)</span><br />
              SST Reg No: <span className="font-semibold text-white">W10-1808-32000024</span><br />
              SST Levy Rate: <span className="font-semibold text-white">8.00%</span>
            </p>
          </div>
        </div>

        {/* Dark theme stylized invoice items table */}
        <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-[#161a25] mb-10">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#1a1f2e] text-slate-400 font-semibold">
                <th className="py-4 px-5">Description of Creative Services</th>
                <th className="py-4 px-5 text-center w-16">Qty</th>
                <th className="py-4 px-5 text-right w-28">Rate</th>
                <th className="py-4 px-5 text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-400">
              {data.items && data.items.length > 0 ? (
                data.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/20">
                    <td className="py-4 px-5 text-slate-200 font-medium">{item.description}</td>
                    <td className="py-4 px-5 text-center text-slate-400">{item.quantity}</td>
                    <td className="py-4 px-5 text-right text-slate-400">RM {Number(item.unitPrice || 0).toFixed(2)}</td>
                    <td className="py-4 px-5 text-right font-semibold text-white">RM {Number(item.amount || 0).toFixed(2)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-600 italic">
                    No billing elements.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals summation block */}
        <div className="flex justify-end mb-10">
          <div className="w-full sm:w-80 bg-[#191e2b] p-5 rounded-xl border border-slate-800/80 text-xs sm:text-sm space-y-3">
            {Number(data.tax || 0) > 0 && (
              <>
                <div className="flex justify-between text-slate-500">
                  <span>Gross Total</span>
                  <span className="font-medium text-slate-300">RM {(data.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 pb-2 border-b border-slate-800/80">
                  <span>Malaysian SST (8.00%)</span>
                  <span className="font-medium text-slate-300">RM {(data.tax || 0).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-lg font-black" style={textAccentStyle}>
              <span>{Number(data.tax || 0) > 0 ? "Total Billable" : "Total Due"}</span>
              <span>RM {(data.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Area */}
      <div className="border-t border-slate-800/80 pt-8 text-[11px] text-slate-500 leading-relaxed">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Agency Revision Policy</h4>
            <p className="italic">{data.revisionPolicy || "Includes up to 3 rounds of minor modifications."}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Production Delivery & Milestones</h4>
            <p className="italic">{data.deliveryTimeline || "Deliverables as scheduled in production storyboard."}</p>
          </div>
          {branding.bankName && (
            <div className="border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 flex justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-bold text-slate-400 uppercase tracking-widest text-[9px] mb-1">Bank Transfer Info</h4>
                <div className="space-y-0.5 text-slate-400 leading-tight text-[10px]">
                  <p><span className="font-semibold text-slate-500">Bank:</span> {branding.bankName}</p>
                  <p className="break-all"><span className="font-semibold text-slate-400">Account:</span> {branding.bankAccountNumber}</p>
                  <p><span className="font-semibold text-slate-400">Name:</span> {branding.bankAccountName}</p>
                </div>
              </div>
              {branding.qrCodeUrl && (
                <div className="w-14 h-14 bg-white/10 border border-slate-800 rounded p-0.5 flex-shrink-0 self-center shadow-sm">
                  <img src={branding.qrCodeUrl} alt="Payment QR" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-center text-[9px] text-slate-600 border-t border-slate-800/50 pt-4">
          iMotion Production | Creative, Video Production, and Interactive Digital Media Services Malaysia
        </p>
      </div>
    </div>
  );
};

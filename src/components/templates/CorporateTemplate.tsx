import React from "react";
import { InvoiceData, BrandingSettings } from "../../types";

interface InvoiceTemplateProps {
  data: InvoiceData;
  branding: BrandingSettings;
}

export const CorporateTemplate: React.FC<InvoiceTemplateProps> = ({ data, branding }) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: "Rubik, sans-serif",
  };

  const lineAccentStyle = {
    borderColor: branding.primaryColor,
  };

  const fillAccentStyle = {
    backgroundColor: branding.primaryColor,
  };

  const textAccentStyle = {
    color: branding.primaryColor,
  };

  return (
    <div
      style={containerStyle}
      className="bg-white p-12 md:p-16 w-full max-w-4xl mx-auto min-h-[1056px] flex flex-col justify-between text-slate-900 border border-slate-200"
    >
      <div>
        {/* Document header */}
        <div className="flex justify-between items-start border-b-2 pb-6 mb-8" style={lineAccentStyle}>
          <div>
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt={branding.companyName || data.vendor} className="h-16 mb-4 object-contain" />
            ) : (
              <div
                className="h-12 w-48 text-white flex items-center justify-center font-bold tracking-widest text-sm rounded mb-4"
                style={fillAccentStyle}
              >
                {(branding.companyName || data.vendor).toUpperCase()}
              </div>
            )}
            <p className="text-xs text-slate-500 leading-relaxed font-semibold whitespace-pre-line">
              <span className="font-bold text-slate-800 text-sm block mb-1">{branding.companyName || data.vendor || "iMotion Production"}</span>
              {branding.companyAddress || "Level 14, Menara MSC Cyberport, No. 5 Jalan Bukit Meldrum\n80300 Johor Bahru, Johor, Malaysia"}
              {(branding.companyContact || branding.companyEmail) && (
                <span className="block mt-1">
                  Contact: {branding.companyContact} {branding.companyContact && branding.companyEmail && " | "} {branding.companyEmail}
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <h1 className="text-3xl font-bold uppercase tracking-tight" style={textAccentStyle}>
              {data.documentType}
            </h1>
            <p className="text-sm font-bold text-slate-700 mt-1">NO: {data.invoiceNumber}</p>
            <p className="text-xs text-slate-400 mt-0.5">DATE: {data.date}</p>
          </div>
        </div>

        {/* Corporate Billing Details */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-xs sm:text-sm">
          <div className="border border-slate-200 p-4 rounded bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
              CLIENT / BILLING DEPT
            </span>
            <p className="text-base font-bold text-slate-950 mb-1">{data.clientName || "N/A"}</p>
            <div className="text-xs text-slate-600 space-y-0.5 mb-2 leading-relaxed">
              {data.clientContactPerson && <p><span className="font-semibold text-slate-700">Attn:</span> {data.clientContactPerson}</p>}
              {data.clientPhone && <p><span className="font-semibold text-slate-700">Phone:</span> {data.clientPhone}</p>}
              {data.clientContact && <p><span className="font-semibold text-slate-700">Email:</span> {data.clientContact}</p>}
              {data.clientWebsite && <p><span className="font-semibold text-slate-700">Website:</span> {data.clientWebsite}</p>}
            </div>
            <p className="text-xs text-slate-500 border-t border-slate-200/60 pt-2 whitespace-pre-line leading-relaxed">
              {data.clientAddress || "No address provided."}
            </p>
          </div>
          <div className="border border-slate-200 p-4 rounded bg-slate-50/50 text-right flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1">
                INVOICING ORIGIN
              </span>
              <p className="font-bold text-slate-950">iMotion Production Sdn. Bhd.</p>
              <p className="text-slate-600">Johor Bahru, Malaysia</p>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2">
              <p className="text-xs text-slate-500">
                Payment Currency: <span className="font-bold text-slate-800">MYR (RM)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Structured Grid Table */}
        <table className="w-full text-left text-xs sm:text-sm border-collapse mb-8 border border-slate-200">
          <thead>
            <tr style={fillAccentStyle} className="text-white text-xs font-semibold">
              <th className="py-3 px-4 border border-slate-200">ITEM</th>
              <th className="py-3 px-4 border border-slate-200">DESCRIPTION</th>
              <th className="py-3 px-4 text-center border border-slate-200 w-16">QTY</th>
              <th className="py-3 px-4 text-right border border-slate-200 w-28">UNIT PRICE</th>
              <th className="py-3 px-4 text-right border border-slate-200 w-32">TOTAL (RM)</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {data.items && data.items.length > 0 ? (
              data.items.map((item, idx) => (
                <tr key={idx} className="even:bg-slate-50 hover:bg-slate-50/50">
                  <td className="py-3 px-4 border border-slate-200 text-center font-bold font-mono">{idx + 1}</td>
                  <td className="py-3 px-4 border border-slate-200 font-medium text-slate-800">{item.description}</td>
                  <td className="py-3 px-4 border border-slate-200 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 border border-slate-200 text-right">RM {Number(item.unitPrice || 0).toFixed(2)}</td>
                  <td className="py-3 px-4 border border-slate-200 text-right font-semibold text-slate-950">RM {Number(item.amount || 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400 italic">
                  No invoice details entered.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Breakdown Calculation */}
        <div className="flex justify-end mb-12">
          <table className="w-full sm:w-80 text-xs sm:text-sm border border-slate-200">
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {Number(data.tax || 0) > 0 && (
                <>
                  <tr>
                    <td className="py-3 px-4 font-semibold bg-slate-50">Subtotal Gross</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">RM {(data.subtotal || 0).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold bg-slate-50">Malaysian SST (8.00%)</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">RM {(data.tax || 0).toFixed(2)}</td>
                  </tr>
                </>
              )}
              <tr style={{ backgroundColor: branding.primaryColor + "09" }}>
                <td className="py-3 px-4 font-bold" style={textAccentStyle}>{Number(data.tax || 0) > 0 ? "NET TOTAL DUE" : "TOTAL DUE"}</td>
                <td className="py-3 px-4 text-right font-bold text-slate-950 text-base">RM {(data.total || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Corporate Signatures and Policies */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t pt-8 mb-8 text-xs text-slate-500 leading-relaxed">
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Corporate Creative Deliverable Policy</h4>
            <p className="italic">{data.revisionPolicy || "Includes up to 3 rounds of minor modifications."}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 mb-2">Corporate Production Timeline</h4>
            <p className="italic">{data.deliveryTimeline || "Deliverables schedule as agreed on storyboards."}</p>
          </div>
          {branding.bankName && (
            <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 flex justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 mb-2">Bank Transfer Details</h4>
                <div className="space-y-1 text-slate-600 leading-tight">
                  <p><span className="font-semibold text-slate-500">Bank:</span> {branding.bankName}</p>
                  <p className="break-all"><span className="font-semibold text-slate-500">Account:</span> {branding.bankAccountNumber}</p>
                  <p><span className="font-semibold text-slate-500">Name:</span> {branding.bankAccountName}</p>
                </div>
              </div>
              {branding.qrCodeUrl && (
                <div className="w-14 h-14 bg-white border border-slate-200 rounded p-0.5 flex-shrink-0 self-center shadow-sm">
                  <img src={branding.qrCodeUrl} alt="Payment QR" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Traditional Corporate Signature Blocks */}
        <div className="grid grid-cols-2 gap-12 pt-8 text-xs">
          <div className="text-left mt-6">
            <div className="w-48 border-b border-slate-400 h-10 mb-2"></div>
            <p className="font-bold text-slate-800">Authorized Signature</p>
            <p className="text-slate-400">iMotion Production Sdn. Bhd.</p>
          </div>
          <div className="text-right flex flex-col items-end mt-6">
            <div className="w-48 border-b border-slate-400 h-10 mb-2"></div>
            <p className="font-bold text-slate-800">Client Sign-Off & Stamp</p>
            <p className="text-slate-400">For and on behalf of {data.clientName || "Recipient"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

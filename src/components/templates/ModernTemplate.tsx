import React from "react";
import { InvoiceData, BrandingSettings } from "../../types";

interface InvoiceTemplateProps {
  data: InvoiceData;
  branding: BrandingSettings;
}

export const ModernTemplate: React.FC<InvoiceTemplateProps> = ({ data, branding }) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: "Rubik, sans-serif",
  };

  const headerStyle = {
    backgroundColor: branding.primaryColor,
  };

  const borderAccentStyle = {
    borderColor: branding.secondaryColor,
  };

  const textAccentStyle = {
    color: branding.primaryColor,
  };

  return (
    <div
      style={containerStyle}
      className="bg-slate-50 w-full max-w-4xl mx-auto min-h-[1056px] flex flex-col justify-between shadow-sm overflow-hidden text-slate-800"
    >
      <div>
        {/* Banner Header */}
        <div style={headerStyle} className="text-white px-10 py-12 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="h-16 bg-white p-2.5 rounded-lg object-contain shadow-sm mb-4" />
            ) : (
              <div className="h-14 w-44 mb-4 flex items-center justify-center rounded bg-white/10 border border-white/20 text-white/70 text-xs font-mono">
                [iMotion Logo]
              </div>
            )}
            <h2 className="text-xl font-black tracking-tight">{branding.companyName || data.vendor || "iMotion Production"}</h2>
            <p className="text-[11px] text-white/70 mt-1 max-w-sm leading-tight whitespace-pre-line">
              {branding.companyAddress || "Level 14, Menara MSC Cyberport, JB, Malaysia"}
              {(branding.companyContact || branding.companyEmail) && (
                <span className="block mt-1">
                  {branding.companyContact} {branding.companyContact && branding.companyEmail && " • "} {branding.companyEmail}
                </span>
              )}
            </p>
          </div>
          <div className="text-left md:text-right mt-6 md:mt-0">
            <h1 className="text-4xl font-extrabold uppercase tracking-tight">{data.documentType}</h1>
            <p className="text-white/80 mt-1 font-mono text-sm">Ref: {data.invoiceNumber}</p>
            <p className="text-white/60 text-xs mt-1">Date: {data.date}</p>
          </div>
        </div>

        {/* Client details Card & Company Sub-Info */}
        <div className="px-10 pt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 col-span-2" style={borderAccentStyle}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Recipient Information
            </span>
            <p className="text-base font-bold text-slate-950 mb-1">{data.clientName || "N/A"}</p>
            <div className="text-xs text-slate-600 space-y-0.5 mb-2 leading-relaxed">
              {data.clientContactPerson && <p><span className="font-semibold text-slate-700">Attn:</span> {data.clientContactPerson}</p>}
              {data.clientPhone && <p><span className="font-semibold text-slate-700">Phone:</span> {data.clientPhone}</p>}
              {data.clientContact && <p><span className="font-semibold text-slate-700">Email:</span> {data.clientContact}</p>}
              {data.clientWebsite && <p><span className="font-semibold text-slate-700">Website:</span> {data.clientWebsite}</p>}
            </div>
            <p className="text-xs text-slate-500 border-t border-slate-100 pt-2 whitespace-pre-line leading-relaxed">
              {data.clientAddress || "No client address provided."}
            </p>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm text-left md:text-right flex flex-col justify-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Payment Parameters
            </span>
            <p className="text-xs text-slate-600 leading-normal">
              Currency: <span className="font-semibold text-slate-900">MYR (RM)</span><br />
              SST ID: <span className="font-semibold text-slate-900">W10-1808-32000024</span><br />
              SST Rate: <span className="font-semibold text-slate-900">8.00%</span>
            </p>
          </div>
        </div>

        {/* Table representation */}
        <div className="px-10 pt-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead style={{ backgroundColor: branding.primaryColor + "09", color: branding.primaryColor }} className="font-semibold">
                <tr className="border-b border-slate-100">
                  <th className="py-4 px-6">Description of Media Deliverables</th>
                  <th className="py-4 px-6 text-center w-20">Qty</th>
                  <th className="py-4 px-6 text-right w-32">Rate</th>
                  <th className="py-4 px-6 text-right w-36">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {data.items && data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-4 px-6 text-slate-800 font-medium">{item.description}</td>
                      <td className="py-4 px-6 text-center">{item.quantity}</td>
                      <td className="py-4 px-6 text-right">RM {Number(item.unitPrice || 0).toFixed(2)}</td>
                      <td className="py-4 px-6 text-right font-semibold text-slate-900">RM {Number(item.amount || 0).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                      No line items present.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dynamic Summary Cards */}
        <div className="px-10 pt-8 flex justify-end">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 w-full sm:w-96 space-y-4 text-sm">
            {Number(data.tax || 0) > 0 && (
              <>
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">RM {(data.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500 pb-2 border-b border-slate-100">
                  <span>Tax (Malaysian SST 8%)</span>
                  <span className="font-semibold text-slate-800">RM {(data.tax || 0).toFixed(2)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-xl font-extrabold" style={textAccentStyle}>
              <span>{Number(data.tax || 0) > 0 ? "Grand Total" : "Total Due"}</span>
              <span>RM {(data.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Production footer */}
      <div className="px-10 pb-10 pt-10 text-xs text-slate-400 border-t border-slate-200/60 bg-white mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 leading-relaxed mb-6">
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Agency Revision Agreement</h4>
            <p>{data.revisionPolicy || "Includes up to 3 rounds of minor modifications."}</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Delivery Schedule</h4>
            <p>{data.deliveryTimeline || "Timeline as mutually specified."}</p>
          </div>
          {branding.bankName && (
            <div className="border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6 flex justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Bank Transfer Info</h4>
                <div className="space-y-0.5 text-slate-500 leading-tight text-[11px]">
                  <p><span className="font-semibold text-slate-400">Bank:</span> {branding.bankName}</p>
                  <p className="break-all"><span className="font-semibold text-slate-400">Account:</span> {branding.bankAccountNumber}</p>
                  <p><span className="font-semibold text-slate-400">Name:</span> {branding.bankAccountName}</p>
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
        <p className="text-center text-[10px] border-t border-slate-100 pt-4 text-slate-400">
          This is a system-generated document for iMotion Production billing operations.
        </p>
      </div>
    </div>
  );
};

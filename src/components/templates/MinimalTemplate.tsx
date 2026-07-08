import React from "react";
import { InvoiceData, BrandingSettings } from "../../types";

interface InvoiceTemplateProps {
  data: InvoiceData;
  branding: BrandingSettings;
}

export const MinimalTemplate: React.FC<InvoiceTemplateProps> = ({ data, branding }) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: "Rubik, sans-serif",
  };

  const accentColorStyle = {
    color: branding.primaryColor,
  };

  return (
    <div
      style={containerStyle}
      className="bg-white p-12 md:p-16 w-full max-w-4xl mx-auto min-h-[1056px] flex flex-col justify-between text-slate-800"
    >
      <div>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start border-b border-slate-100 pb-10 mb-12">
          <div>
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="iMotion Production" className="h-14 mb-4 object-contain" />
            ) : (
              <div
                className="h-14 w-44 mb-4 flex items-center justify-center rounded border border-dashed border-slate-300 text-slate-400 text-xs font-mono"
                style={{ borderColor: branding.primaryColor }}
              >
                [iMotion Logo]
              </div>
            )}
            <h2 className="text-lg font-bold text-slate-900">{branding.companyName || data.vendor || "iMotion Production"}</h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed whitespace-pre-line">
              {branding.companyAddress || "Level 14, Menara MSC Cyberport\n80300 Johor Bahru, Johor, Malaysia"}
              {(branding.companyContact || branding.companyEmail) && (
                <span className="block mt-1 lowercase font-semibold text-slate-400">
                  {branding.companyContact} {branding.companyContact && branding.companyEmail && " | "} {branding.companyEmail}
                </span>
              )}
            </p>
          </div>
          <div className="text-left md:text-right mt-6 md:mt-0">
            <h1 className="text-4xl font-light tracking-widest uppercase mb-2" style={accentColorStyle}>
              {data.documentType}
            </h1>
            <div className="text-sm text-slate-500 space-y-1">
              <p>
                <span className="font-semibold text-slate-700">No:</span> {data.invoiceNumber}
              </p>
              <p>
                <span className="font-semibold text-slate-700">Date:</span> {data.date}
              </p>
            </div>
          </div>
        </div>

        {/* Client Billing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
              Billed To:
            </span>
            <p className="text-base font-semibold text-slate-900 mb-1">{data.clientName || "N/A"}</p>
            <div className="text-xs text-slate-500 space-y-0.5 mb-2 leading-relaxed">
              {data.clientContactPerson && <p><span className="font-medium text-slate-700">Attn:</span> {data.clientContactPerson}</p>}
              {data.clientPhone && <p><span className="font-medium text-slate-700">Phone:</span> {data.clientPhone}</p>}
              {data.clientContact && <p><span className="font-medium text-slate-700">Email:</span> {data.clientContact}</p>}
              {data.clientWebsite && <p><span className="font-medium text-slate-700">Website:</span> {data.clientWebsite}</p>}
            </div>
            <p className="text-xs text-slate-500 border-t border-slate-100 pt-2 whitespace-pre-line leading-relaxed">
              {data.clientAddress || "No client address provided."}
            </p>
          </div>
        </div>

        {/* Invoice Table */}
        <table className="w-full text-left border-collapse text-sm mb-12">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 font-normal">
              <th className="py-3 font-medium">Description</th>
              <th className="py-3 text-center font-medium w-16">Qty</th>
              <th className="py-3 text-right font-medium w-28">Rate</th>
              <th className="py-3 text-right font-medium w-32">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.items && data.items.length > 0 ? (
              data.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-4 font-normal text-slate-800">{item.description}</td>
                  <td className="py-4 text-center text-slate-500">{item.quantity}</td>
                  <td className="py-4 text-right text-slate-500">RM {Number(item.unitPrice || 0).toFixed(2)}</td>
                  <td className="py-4 text-right font-medium text-slate-900">RM {Number(item.amount || 0).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                  No billing line items.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end mb-12">
          <div className="w-full sm:w-80 text-sm space-y-3">
            {Number(data.tax || 0) > 0 && (
              <>
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">RM {(data.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>SST (8%)</span>
                  <span className="font-medium text-slate-800">RM {(data.tax || 0).toFixed(2)}</span>
                </div>
              </>
            )}
            <div
              className="flex justify-between text-lg font-bold pt-4 border-t border-slate-100"
              style={{ color: branding.primaryColor }}
            >
              <span>Total Due</span>
              <span>RM {(data.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Creative Agency Accents */}
      <div className="border-t border-slate-100 pt-8 mt-8 text-xs text-slate-400">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 leading-relaxed">
          <div>
            <h4 className="font-semibold text-slate-500 uppercase tracking-wider mb-1">Creative Deliverables & Revision Policy</h4>
            <p className="italic">{data.revisionPolicy || "Subject to agency agreement."}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-500 uppercase tracking-wider mb-1">Production Timeline</h4>
            <p className="italic">{data.deliveryTimeline || "Delivered within production parameters."}</p>
          </div>
          {branding.bankName && (
            <div className="border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex justify-between gap-3">
              <div className="flex-1">
                <h4 className="font-semibold text-slate-500 uppercase tracking-wider mb-1">Bank Transfer Info</h4>
                <div className="space-y-0.5 text-slate-400 leading-tight text-[11px]">
                  <p><span className="font-medium text-slate-500">Bank:</span> {branding.bankName}</p>
                  <p className="break-all"><span className="font-medium text-slate-500">Account:</span> {branding.bankAccountNumber}</p>
                  <p><span className="font-medium text-slate-500">Name:</span> {branding.bankAccountName}</p>
                </div>
              </div>
              {branding.qrCodeUrl && (
                <div className="w-14 h-14 bg-white border border-slate-100 rounded p-0.5 flex-shrink-0 self-center">
                  <img src={branding.qrCodeUrl} alt="Payment QR" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="text-center mt-8 pt-4 border-t border-slate-50">
          Thank you for choosing iMotion Production. We craft premium visual experiences.
        </div>
      </div>
    </div>
  );
};

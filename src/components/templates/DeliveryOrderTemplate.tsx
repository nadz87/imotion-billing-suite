import React from "react";
import { InvoiceData, BrandingSettings } from "../../types";

interface DeliveryOrderTemplateProps {
  data: InvoiceData;
  branding: BrandingSettings;
}

export const DeliveryOrderTemplate: React.FC<DeliveryOrderTemplateProps> = ({ data, branding }) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: branding.fontFamily || "Inter, sans-serif",
  };

  // Extract variables with intelligent Malaysian business defaults if not defined
  const companyName = branding.companyName || "iMotion Production";
  const companyAddress = branding.companyAddress || "No. 12-3, Jalan Telawi 5, Bangsar Baru, 59100 Kuala Lumpur, Malaysia";
  const companyEmail = branding.companyEmail || "hello@imotion.pro";
  const companyContact = branding.companyContact || "+603-2284 5566";
  const companyWebsite = branding.designBoardLink || "www.imotion.pro";

  return (
    <div
      style={containerStyle}
      className="bg-white p-8 sm:p-12 w-full max-w-4xl mx-auto min-h-[1056px] flex flex-col justify-between text-slate-800 border border-slate-200 shadow-lg print:border-none print:shadow-none"
    >
      <div>
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          {/* Brand Logo & Company info block */}
          <div className="flex flex-col items-start gap-3 w-full md:max-w-2xl">
            {branding.logoUrl ? (
              <img
                src={branding.logoUrl}
                alt={companyName}
                className="h-12 w-auto object-contain max-w-[220px]"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex flex-col select-none">
                <span className="text-2xl font-black tracking-tight text-[#0f1c3f] leading-none">
                  <span className="italic font-serif font-bold text-[#0f1c3f]">i</span>Motion
                </span>
                <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-700 mt-1 block">
                  Production
                </span>
              </div>
            )}
            
            <div className="text-[11px] text-slate-500 leading-relaxed max-w-xl mt-1">
              <p className="mb-1 text-slate-600 font-medium">{companyAddress.replace(/\n+/g, ", ").replace(/,\s*,/g, ",").trim()}</p>
              <p className="flex flex-wrap items-center gap-y-1 text-slate-500">
                <span>
                  <span className="font-semibold text-slate-700">Tel:</span> {companyContact}
                </span>
                {companyEmail && (
                  <>
                    <span className="mx-1.5 text-slate-300">|</span>
                    <span>
                      <span className="font-semibold text-slate-700">Email:</span> {companyEmail}
                    </span>
                  </>
                )}
                {companyWebsite && (
                  <>
                    <span className="mx-1.5 text-slate-300">|</span>
                    <span>
                      <span className="font-semibold text-slate-700">Web:</span> {companyWebsite}
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Document Title / Delivery Note Header */}
          <div className="text-left md:text-right w-full md:w-auto mt-4 md:mt-0">
            <h1
              className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase border-b-4 pb-1 mb-2 text-blue-950"
              style={{ borderColor: branding.primaryColor, color: branding.primaryColor }}
            >
              DELIVERY ORDER
            </h1>
            <p className="text-sm font-bold text-slate-800">
              No. <span className="text-lg text-blue-900 bg-slate-50 px-3 py-1 rounded-md border border-slate-200 inline-block font-mono ml-2">{data.invoiceNumber}</span>
            </p>
          </div>
        </div>

        {/* MID-SECTION: DELIVER TO & LOGISTICAL SPECIFICATION BOX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-stretch">
          {/* Deliver To */}
          <div className="border border-slate-300 rounded-xl p-5 bg-white relative flex flex-col justify-between">
            <div>
              <span
                className="absolute -top-3 left-4 bg-white px-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500"
                style={{ color: branding.primaryColor }}
              >
                DELIVER TO
              </span>
              <p className="text-base font-extrabold text-slate-950 mt-1 mb-1.5">
                {data.clientName || "Recipient Company Name"}
              </p>
              <div className="text-xs text-slate-600 space-y-1 mb-3 leading-relaxed">
                {data.clientContactPerson && (
                  <p>
                    <span className="font-semibold text-slate-800">Attn:</span> {data.clientContactPerson}
                  </p>
                )}
                {data.clientPhone && (
                  <p>
                    <span className="font-semibold text-slate-800">Phone:</span> {data.clientPhone}
                  </p>
                )}
                {data.clientContact && (
                  <p>
                    <span className="font-semibold text-slate-800">Email:</span> {data.clientContact}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-dashed border-slate-200 pt-2.5">
              <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed italic">
                {data.clientAddress || "No delivery address provided."}
              </p>
            </div>
          </div>

          {/* Reference Info Box */}
          <div className="border border-slate-300 rounded-xl overflow-hidden flex flex-col justify-between">
            {/* Header Dates Row */}
            <div className="grid grid-cols-3 bg-slate-100 text-[10px] font-extrabold text-slate-700 uppercase tracking-wider text-center border-b border-slate-300">
              <div className="py-2 border-r border-slate-300">DATE</div>
              <div className="py-2 border-r border-slate-300">ORDER No.</div>
              <div className="py-2">INVOICE No.</div>
            </div>
            {/* Header Dates Values */}
            <div className="grid grid-cols-3 text-center text-xs font-semibold py-2.5 border-b border-slate-300 font-mono bg-white text-slate-900">
              <div className="border-r border-slate-200">{data.date || "N/A"}</div>
              <div className="border-r border-slate-200">{data.orderNumber || "N/A"}</div>
              <div>{data.associatedInvoiceNumber || data.invoiceNumber || "N/A"}</div>
            </div>

            {/* Invoice To block */}
            <div className="p-4 bg-slate-50/50 flex-1 flex flex-col justify-center">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                INVOICE TO
              </span>
              <p className="text-xs font-bold text-slate-800">
                {data.clientName || "Same as Deliver To"}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">
                {data.clientAddress || "Same as Delivery Address"}
              </p>
            </div>
          </div>
        </div>

        {/* LOGISTICS MANIFEST BAR */}
        <div className="border border-slate-300 rounded-xl overflow-hidden mb-8 bg-slate-50/50">
          <div className="grid grid-cols-5 text-center bg-slate-100 text-[9px] font-black text-slate-600 uppercase tracking-widest border-b border-slate-300">
            <div className="py-2 border-r border-slate-300 px-1 leading-tight">PACKAGES DESPATCHED</div>
            <div className="py-2 border-r border-slate-300 px-1 leading-tight">DATE DESPATCHED</div>
            <div className="py-2 border-r border-slate-300 px-1 leading-tight">DELIVERED VIA</div>
            <div className="py-2 border-r border-slate-300 px-1 leading-tight">WEIGHT</div>
            <div className="py-2 px-1 leading-tight">SALESPERSON</div>
          </div>
          <div className="grid grid-cols-5 text-center text-xs font-bold py-2.5 text-slate-900">
            <div className="border-r border-slate-200 font-mono">{data.totalPackagesDespatched || "1 PKG"}</div>
            <div className="border-r border-slate-200 font-mono">{data.dateDespatched || data.date || "N/A"}</div>
            <div className="border-r border-slate-200">{data.deliveredVia || "Courier Services"}</div>
            <div className="border-r border-slate-200 font-mono">{data.weight || "N/A"}</div>
            <div className="font-mono">{data.salesperson || "iMotion HQ"}</div>
          </div>
        </div>

        {/* MAIN MANIFEST TABLE */}
        <div className="border border-slate-300 rounded-xl overflow-hidden mb-8">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-black uppercase tracking-wider text-slate-700">
                <th className="py-3 px-4 border-r border-slate-300 text-center w-28">QTY ORDERED</th>
                <th className="py-3 px-4 border-r border-slate-300 text-center w-28">QTY SENT</th>
                <th className="py-3 px-4 border-r border-slate-300 text-center w-36">STOCK NUMBER</th>
                <th className="py-3 px-4">ITEM / SERVICE DESCRIPTION</th>
              </tr>
            </thead>
            <tbody>
              {data.items && data.items.length > 0 ? (
                data.items.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-slate-200 font-medium ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}
                  >
                    <td className="py-3 px-4 border-r border-slate-200 text-center font-mono font-bold text-slate-900">
                      {item.qtyOrdered || item.quantity}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200 text-center font-mono font-black text-blue-900">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 border-r border-slate-200 text-center font-mono text-slate-600">
                      {item.stockNumber || `IM-${1000 + index}`}
                    </td>
                    <td className="py-3 px-4 text-slate-800 leading-normal font-semibold">
                      {item.description}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-mono">
                    No items found on this Delivery Order manifest.
                  </td>
                </tr>
              )}

              {/* Extra Empty Rows to replicate traditional delivery logs aesthetic */}
              {Array.from({ length: Math.max(0, 5 - (data.items?.length || 0)) }).map((_, i) => (
                <tr key={`empty-${i}`} className="border-b border-slate-200 h-9">
                  <td className="border-r border-slate-200"></td>
                  <td className="border-r border-slate-200"></td>
                  <td className="border-r border-slate-200"></td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER SIGNATURE BLOCKS */}
      <div className="mt-auto pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border border-slate-300 rounded-xl overflow-hidden bg-slate-50/50 mb-4">
          <div className="p-4 border-b sm:border-b-0 sm:border-r border-slate-300 min-h-[90px] flex flex-col justify-between">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">
              DATE RECEIVED
            </span>
            <div className="border-b border-dotted border-slate-400 w-full h-6"></div>
          </div>

          <div className="p-4 border-b sm:border-b-0 sm:border-r border-slate-300 min-h-[90px] flex flex-col justify-between">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">
              PRINT NAME
            </span>
            <div className="border-b border-dotted border-slate-400 w-full h-6"></div>
          </div>

          <div className="p-4 border-b sm:border-b-0 sm:border-r border-slate-300 min-h-[90px] flex flex-col justify-between">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block">
              AUTHORISED SIGNATURE
            </span>
            <div className="border-b border-dotted border-slate-400 w-full h-6"></div>
          </div>

          <div className="p-4 min-h-[90px] flex flex-col justify-between">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block leading-tight">
              TOTAL PACKAGES RECEIVED
            </span>
            <div className="border-b border-dotted border-slate-400 w-full h-6"></div>
          </div>
        </div>

        {/* Small footprint note */}
        <p className="text-[9px] font-black tracking-wider text-center text-slate-400 uppercase leading-normal">
          PLEASE NOTIFY US IMMEDIATELY IF AN ERROR IS FOUND IN SHIPMENT. THANK YOU!
        </p>
      </div>
    </div>
  );
};

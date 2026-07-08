import React from "react";
import { InvoiceData, BrandingSettings } from "../../types";

interface InvoiceTemplateProps {
  data: InvoiceData;
  branding: BrandingSettings;
}

export const CreativeTemplate: React.FC<InvoiceTemplateProps> = ({ data, branding }) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: "Rubik, sans-serif",
  };

  // Generate fallback customer ID based on client name
  const getCustomerId = () => {
    if (data.clientName) {
      const cleanName = data.clientName.replace(/[^a-zA-Z]/g, "").substring(0, 7).toUpperCase();
      return `CUST${cleanName || "GPD"}10`;
    }
    return "CUSTGPD10";
  };

  // Format currency with spaces instead of commas to match PDF exactly (e.g., "RM 1 250")
  const formatCurrency = (amount: number) => {
    const formatted = Number(amount || 0).toLocaleString("en-MY", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).replace(/,/g, " ");
    return `RM ${formatted}`;
  };

  return (
    <div
      style={containerStyle}
      className="bg-white w-full max-w-4xl mx-auto min-h-[1120px] flex flex-row text-slate-900 overflow-hidden shadow-md border border-slate-100 print:shadow-none print:border-none"
      id="creative-invoice-template"
    >
      {/* LEFT SIDEBAR - Brand yellow/amber background */}
      <div className="w-[32%] bg-[#ffb01c] flex flex-col justify-between border-r border-amber-600/15 select-none">
        <div className="flex flex-col">
          {/* Brand Logo Header Box */}
          <div className="p-6 pt-10 pb-4 bg-[#ffb01c] h-[144px] flex flex-col justify-end">
            {branding.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="h-[68px] object-contain self-start" />
            ) : (
              <div className="flex flex-col">
                <span className="text-[38px] font-black tracking-tight text-[#0f1c3f] leading-none">
                  <span className="italic font-serif font-bold text-[#0f1c3f]">i</span>Motion
                </span>
                <span className="text-sm font-black tracking-[0.2em] uppercase text-[#0f1c3f] mt-1 block">
                  Production
                </span>
              </div>
            )}
            <div className="border-b-4 border-[#0f1c3f] mt-3.5 w-full" />
          </div>

          {/* Table Header Row Spacer in Sidebar (Grey spacer matching the table header on the right!) */}
          <div className="h-10 bg-[#e2e8f0] border-r border-slate-300/40" />

          {/* Main Sidebar Data Area */}
          <div className="p-6 pt-6 space-y-6 text-[#0f1c3f]">
            {/* BILLING TO Section */}
            <div className="space-y-1.5">
              <h3 className="text-[10px] font-black tracking-widest uppercase text-[#0f1c3f]/80">
                BILLING TO :
              </h3>
              <p className="font-extrabold text-sm text-[#0f1c3f] leading-snug">
                {data.clientName || "Absorich Sdn Bhd"}
              </p>
              <div className="text-[10px] text-[#0f1c3f]/90 font-bold space-y-0.5 leading-relaxed">
                {data.clientContactPerson && <p><span className="font-black">Attn:</span> {data.clientContactPerson}</p>}
                {data.clientPhone && <p><span className="font-black">Phone:</span> {data.clientPhone}</p>}
                {data.clientContact && <p><span className="font-black">Email:</span> {data.clientContact}</p>}
                {data.clientWebsite && <p><span className="font-black">Website:</span> {data.clientWebsite}</p>}
              </div>
              <p className="text-[10px] text-[#0f1c3f]/80 whitespace-pre-line leading-relaxed font-bold border-t border-[#0f1c3f]/10 pt-1.5">
                {data.clientAddress || "4-1-1A, Blok 4, Level 1, Plaza Sentral\nJalan Stesen Sentral 5\nKuala Lumpur Sentral, 50470 Kuala Lumpur"}
              </p>
            </div>

            {/* INVOICE DETAILS Section */}
            <div className="space-y-1 border-t border-[#0f1c3f]/10 pt-4">
              <h3 className="text-[10px] font-black tracking-widest uppercase text-[#0f1c3f]/80">
                {data.documentType === "Tax Invoice" ? "INVOICE DETAILS" : "QUOTATION DETAILS"}
              </h3>
              <div className="text-[10px] text-[#0f1c3f]/95 space-y-1 font-bold">
                <p className="flex justify-between items-center">
                  <span>{data.documentType === "Tax Invoice" ? "Invoice no." : "Quotation no."}</span>
                  <span className="font-mono bg-[#0f1c3f]/10 px-1 py-0.5 rounded text-[10px] font-black">
                    {data.invoiceNumber || "260227701GD"}
                  </span>
                </p>
                <p className="flex justify-between items-center">
                  <span>{data.documentType === "Tax Invoice" ? "Invoice date" : "Quotation date"}</span>
                  <span className="font-extrabold">{data.date || "27th Feb 2026"}</span>
                </p>
                <p className="flex justify-between items-center">
                  <span>Customer ID</span>
                  <span className="font-mono bg-[#0f1c3f]/10 px-1 py-0.5 rounded text-[10px] font-black">
                    {getCustomerId()}
                  </span>
                </p>
              </div>
            </div>

            {/* COMPANY DETAILS Section */}
            <div className="space-y-1 border-t border-[#0f1c3f]/10 pt-4">
              <h3 className="text-[10px] font-black tracking-widest uppercase text-[#0f1c3f]/80">
                COMPANY DETAILS :
              </h3>
              <p className="font-black text-xs text-[#0f1c3f] uppercase">
                {branding.companyName || "IMOTION PRODUCTION"}
              </p>
              <p className="text-[9px] font-black text-[#0f1c3f]/85">
                002208429-W
              </p>
              <p className="text-[10px] text-[#0f1c3f]/90 whitespace-pre-line leading-tight font-bold">
                {branding.companyAddress || "Wisma Suria, Level 4,\nJalan Teknokrat 6,\nCyber 5, Sepang\n63000 Cyberjaya"}
              </p>
            </div>

            {/* PAYMENT DETAILS Section */}
            <div className="space-y-1 border-t border-[#0f1c3f]/10 pt-4">
              <h3 className="text-[10px] font-black tracking-widest uppercase text-[#0f1c3f]/80">
                PAYMENT DETAILS :
              </h3>
              <p className="font-black text-xs text-[#0f1c3f] tracking-tight uppercase">
                {branding.bankName || "MAYBANK ISLAMIC"}
              </p>
              <p className="text-[10px] font-extrabold text-[#0f1c3f]">
                {branding.bankAccountName || "iMOTION PRODUCTION"}
              </p>
              <p className="text-[11px] font-black text-white bg-[#0f1c3f] px-2 py-0.5 rounded inline-block font-mono tracking-wide mt-1">
                {branding.bankAccountNumber || "566 010 632 240"}
              </p>
            </div>
          </div>
        </div>

        {/* PROJECT DETAILS & QR CODE (Stuck to bottom of sidebar, centered) */}
        <div className="p-6 pb-8 space-y-3.5 text-[#0f1c3f] flex flex-col items-center text-center">
          <div className="flex flex-col items-center">
            <h3 className="text-[10px] font-black tracking-widest uppercase text-[#0f1c3f]/80 mb-2">
              PROJECT DETAILS:
            </h3>
            <div className="bg-white p-1.5 rounded-lg inline-block shadow-sm">
              {(data.projectQrCodeUrl || branding.projectQrCodeUrl) ? (
                <img src={data.projectQrCodeUrl || branding.projectQrCodeUrl || ""} alt="Project Details QR Code" className="w-20 h-20 object-contain" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-20 h-20 bg-white flex items-center justify-center border border-amber-200 rounded">
                  <svg viewBox="0 0 100 100" className="w-16 h-16 text-[#0f1c3f]">
                    <rect x="0" y="0" width="100" height="100" fill="white" />
                    <rect x="5" y="5" width="25" height="25" fill="currentColor" />
                    <rect x="10" y="10" width="15" height="15" fill="white" />
                    <rect x="13" y="13" width="9" height="9" fill="currentColor" />
                    
                    <rect x="70" y="5" width="25" height="25" fill="currentColor" />
                    <rect x="75" y="10" width="15" height="15" fill="white" />
                    <rect x="78" y="13" width="9" height="9" fill="currentColor" />
                    
                    <rect x="5" y="70" width="25" height="25" fill="currentColor" />
                    <rect x="10" y="75" width="15" height="15" fill="white" />
                    <rect x="13" y="78" width="9" height="9" fill="currentColor" />
                    
                    <rect x="40" y="40" width="20" height="20" fill="currentColor" />
                    <rect x="45" y="45" width="10" height="10" fill="white" />
                    
                    <rect x="70" y="70" width="10" height="10" fill="currentColor" />
                    <rect x="85" y="85" width="10" height="10" fill="currentColor" />
                    <rect x="75" y="40" width="15" height="10" fill="currentColor" />
                    <rect x="40" y="75" width="10" height="15" fill="currentColor" />
                    <rect x="55" y="70" width="10" height="10" fill="currentColor" />
                    <rect x="85" y="50" width="10" height="15" fill="currentColor" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[9px] font-black text-[#0f1c3f]/75 block uppercase tracking-widest leading-none">
              CLICK HERE
            </span>
            <a
              href={data.designBoardLink || branding.designBoardLink || "https://imotion.my"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-black underline text-slate-900 hover:text-black tracking-tight block mt-0.5"
            >
              DESIGN BOARD LINK
            </a>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT AREA - Invoice tables and totals */}
      <div className="flex-1 bg-white pt-10 pb-10 px-8 sm:px-10 flex flex-col justify-between">
        <div>
          {/* Header - Giant Document Title */}
          <div className="h-[80px] flex justify-end items-end pb-3 mb-6">
            <div className="text-right w-full max-w-sm">
              <h1 className="text-5xl font-black text-slate-950 tracking-widest uppercase">
                {data.documentType === "Tax Invoice" ? "INVOICE" : "QUOTATION"}
              </h1>
              <div className="border-b-[6px] border-slate-950 mt-2.5 w-full" />
            </div>
          </div>

          {/* Line Items Table Header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead>
                <tr className="bg-[#e2e8f0] text-slate-900 text-[10px] font-black uppercase tracking-wider h-10 select-none">
                  <th className="py-2 px-4 w-3/5">Descriptions</th>
                  <th className="py-2 px-2 text-right">Rate</th>
                  <th className="py-2 px-2 text-center">Quantity</th>
                  <th className="py-2 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-900">
                {data.items && data.items.length > 0 ? (
                  data.items.map((item, idx) => (
                    <tr key={idx} className="border-b border-slate-200/65 align-top">
                      <td className="py-5 px-4 font-bold leading-relaxed whitespace-pre-line text-slate-950">
                        {item.description}
                      </td>
                      <td className="py-5 px-2 text-right font-bold whitespace-nowrap text-slate-700">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-5 px-2 text-center font-bold text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="py-5 px-4 text-right font-black text-slate-950 whitespace-nowrap">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 italic font-semibold">
                      No services or items added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer block containing terms and sign-offs */}
        <div className="space-y-6 pt-2">
          {/* Subtotal & Summary Section */}
          <div className="border-t border-slate-950/20 pt-2 space-y-1.5 mb-2">
            {Number(data.tax || 0) > 0 && (
              <>
                <div className="flex justify-between text-xs font-bold text-slate-500 px-4">
                  <span className="uppercase tracking-widest">Gross Subtotal</span>
                  <span>{formatCurrency(data.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500 px-4">
                  <span className="uppercase tracking-widest">Malaysian SST (8%)</span>
                  <span>{formatCurrency(data.tax)}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-xs font-black text-slate-950 border-t-2 border-slate-950 pt-2.5 pb-2 px-4">
              <span className="uppercase tracking-wider">Monthly Subscription</span>
              <span className="text-sm font-black">{formatCurrency(data.total)}</span>
            </div>
            <div className="border-b border-slate-950/20 mt-1" />
          </div>

          <div className="space-y-4 w-full">
            {/* Terms and Conditions */}
            <div className="space-y-2 w-full">
              <div className="bg-[#ffb01c] text-[#0f1c3f] font-black text-[9px] px-3 py-0.5 rounded-full inline-block uppercase tracking-wider select-none">
                Terms and Conditions:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[9.5px] text-slate-500 leading-relaxed font-normal">
                <div className="flex items-start gap-1.5">
                  <span className="text-[#ffb01c] font-black text-xs leading-none select-none mt-0.5">•</span>
                  <p className="italic text-slate-500 text-justify">
                    <strong className="font-extrabold text-slate-700 not-italic block mb-0.5">Creative Revision Policy:</strong> {data.revisionPolicy || "Includes up to 3 rounds of minor offline modifications. VFX, advanced CGI, or major revisions after final creative sign-off are billed at RM250/hour."}
                  </p>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-[#ffb01c] font-black text-xs leading-none select-none mt-0.5">•</span>
                  <p className="italic text-slate-500 text-justify">
                    <strong className="font-extrabold text-slate-700 not-italic block mb-0.5">Production Delivery Timeline:</strong> {data.deliveryTimeline || "First draft rough cut delivered within 10 working days of production wrap. Final mastered 4K master transfers executed within 3 business days of approval."}
                  </p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200/60 pt-2" />

            {/* Footer metadata containing phone, email & website */}
            <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-700 font-bold select-none gap-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1">
                <span>{branding.companyContact || "+6012 697 5464"}</span>
                <span className="text-slate-300">|</span>
                <span>{branding.companyEmail || "a.nadzri@icloud.com"}</span>
                <span className="text-slate-300">|</span>
                <span className="font-extrabold text-slate-950">imotion.my</span>
              </div>
              <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center md:text-right">
                PAGE OF PAGES &nbsp;<span className="font-mono text-slate-500">1 | 1</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate;

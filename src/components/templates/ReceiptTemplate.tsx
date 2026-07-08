import React from "react";
import { InvoiceData, BrandingSettings } from "../../types";

interface InvoiceTemplateProps {
  data: InvoiceData;
  branding: BrandingSettings;
}

export const ReceiptTemplate: React.FC<InvoiceTemplateProps> = ({ data, branding }) => {
  const containerStyle: React.CSSProperties = {
    fontFamily: "Rubik, sans-serif",
  };

  // Format currency
  const formatValue = (amount: number) => {
    return Number(amount || 0).toFixed(2);
  };

  // Generate fallback/mock metadata parameters to match the realistic receipts
  const terminalId = "68259456";
  const customerId = "808191";
  const transactionId = "155844121";

  // Use current local time or default 2:49 PM
  const getReceiptTime = () => {
    try {
      const parts = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      return parts;
    } catch {
      return "2:49 PM";
    }
  };

  return (
    <div
      style={containerStyle}
      className="bg-white w-full max-w-[420px] mx-auto min-h-[900px] py-10 px-6 text-slate-900 select-none flex flex-col items-center font-sans print:shadow-none print:border-none"
      id="thermal-receipt-template"
    >
      {/* 1. BRAND LOGO SECTION */}
      <div className="flex flex-col items-center text-center mb-5">
        {(branding.receiptLogoUrl || branding.logoUrl) ? (
          <img src={branding.receiptLogoUrl || branding.logoUrl || ""} alt="Logo" className="h-16 object-contain mb-3" referrerPolicy="no-referrer" />
        ) : (
          <div className="flex flex-col items-center mb-3">
            {/* Custom stylized high-fidelity iMotion vector logo */}
            <svg
              viewBox="0 0 100 100"
              className="w-20 h-20 text-[#0f1c3f]"
              fill="currentColor"
            >
              {/* Vertical stylized i/1 bar */}
              <path d="M22 25 L34 12 L34 78 L22 78 Z" />
              {/* Nestled M leg */}
              <path d="M38 32 L48 48 L58 32 L68 48 L68 78 L56 78 L56 50 L48 62 L40 50 L40 78 L38 78 Z" />
              {/* Yellow-themed loop for P */}
              <path d="M72 40 C72 26 88 26 88 40 C88 54 72 54 72 40 Z" fill="#ffb01c" />
              <path d="M72 34 L72 78 L80 78 L80 50 C86 50 86 34 80 34 Z" />
            </svg>
            <span className="text-xl font-black tracking-tight text-[#0f1c3f] mt-1 uppercase">
              iMotion
            </span>
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-slate-500">
              Production
            </span>
          </div>
        )}

        {/* 2. COMPANY ADDRESS */}
        <div className="text-xs text-slate-800 text-center leading-relaxed font-normal max-w-[280px] mt-2 whitespace-pre-line">
          {branding.companyAddress || (
            <>
              Wisma Suria, Level 4,
              {"\n"}Jalan Teknokrat 6,
              {"\n"}Cyber 5, Sepang
              {"\n"}63000 Cyberjaya
            </>
          )}
        </div>
      </div>

      {/* 3. RECEIPT INFO BLOCK */}
      <div className="w-full text-xs text-slate-800 space-y-1 my-4 text-left font-normal">
        <div>Time: {getReceiptTime()}</div>
        <div>REC No. : {data.invoiceNumber || "GDP8429260202"}</div>
      </div>

      {/* 4. PRODUCTS & DELIVERABLES TABLE */}
      <div className="w-full my-4 text-xs">
        <div className="space-y-4">
          {data.items && data.items.map((item, idx) => (
            <div key={idx} className="flex flex-col text-slate-900">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-left max-w-[260px] break-words">
                  {item.description || "Unlabeled Service"}
                </span>
                <span className="font-mono text-right shrink-0">
                  {formatValue(item.amount)}
                </span>
              </div>
              {item.quantity > 1 && (
                <span className="text-[10px] text-slate-500 text-left font-mono">
                  {item.quantity} x RM {formatValue(item.unitPrice)}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 5. DASHED SEPARATOR */}
        <div className="border-t border-dashed border-slate-400 my-4" />

        {/* 6. TOTAL ROW */}
        <div className="flex justify-between items-center text-sm font-black text-slate-950 py-1">
          <span className="uppercase tracking-wide">TOTAL</span>
          <div className="flex items-center gap-6">
            <span className="text-xs font-bold text-slate-500">MYR</span>
            <span className="font-mono text-base">{formatValue(data.total)}</span>
          </div>
        </div>

        {/* 7. DOUBLE RULE SEPARATOR */}
        <div className="border-t-[3px] border-double border-slate-900 my-4" />
      </div>

      {/* 8. METADATA SPECIFICATIONS */}
      <div className="w-full text-[11px] text-slate-700 space-y-1.5 font-normal my-2 px-1">
        <div className="flex justify-between">
          <span>GD - PL .</span>
          <span className="font-mono">{transactionId}</span>
        </div>
        <div className="flex justify-between">
          <span>{data.clientName || "Petsy"} - CID</span>
          <span className="font-mono">{customerId}</span>
        </div>
        <div className="flex justify-between">
          <span>Terminal ID</span>
          <span className="font-mono">{terminalId}</span>
        </div>
      </div>

      {/* 9. MALAYSIA NATIONAL QR CODE BADGE */}
      <div className="my-6 flex flex-col items-center">
        {/* Pink Badge frame matching the uploaded picture exactly */}
        <div className="w-[260px] bg-[#e91e63] p-4 rounded-[24px] flex flex-col items-center shadow-sm">
          {/* White inner QR Code holder */}
          <div className="bg-white rounded-[16px] p-3 w-full aspect-square flex items-center justify-center">
            {branding.qrCodeUrl ? (
              <img src={branding.qrCodeUrl} alt="Payment QR Code" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            ) : (
              /* Custom high fidelity national QR SVG pattern */
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full text-[#e91e63]"
                fill="currentColor"
              >
                {/* Outer boundary boxes */}
                <path d="M 5,5 h 25 v 25 h -25 z M 9,9 v 17 h 17 v -17 z M 14,14 h 7 v 7 h -7 z" />
                <path d="M 70,5 h 25 v 25 h -25 z M 74,9 v 17 h 17 v -17 z M 79,14 h 7 v 7 h -7 z" />
                <path d="M 5,70 h 25 v 25 h -25 z M 9,74 v 17 h 17 v -17 z M 14,79 h 7 v 7 h -7 z" />
                
                {/* Alignment / Timing marks */}
                <rect x="35" y="8" width="5" height="5" />
                <rect x="45" y="8" width="5" height="5" />
                <rect x="55" y="8" width="5" height="5" />
                
                <rect x="8" y="35" width="5" height="5" />
                <rect x="8" y="45" width="5" height="5" />
                <rect x="8" y="55" width="5" height="5" />

                {/* Inside QR noise blocks for ultra-realistic cash register feel */}
                <path d="M 35,35 h 10 v 5 h -5 v 10 h -5 z" />
                <path d="M 50,35 h 15 v 10 h -5 v -5 h -10 z" />
                <path d="M 35,55 h 5 v 10 h 10 v 5 h -15 z" />
                <path d="M 55,50 h 10 v 15 h -5 v -10 h -5 z" />
                <path d="M 50,70 h 5 v 25 h -5 z" />
                <path d="M 60,70 h 10 v 5 h -10 z" />
                <path d="M 60,80 h 5 v 10 h -5 z" />
                <path d="M 75,35 h 15 v 5 h -10 v 10 h -5 z" />
                <path d="M 80,50 h 5 v 5 h -5 z" />
                <path d="M 75,60 h 10 v 5 h -10 z" />
                <path d="M 75,70 h 5 v 15 h 5 v -10 h 5 v -5 z" />
                <path d="M 90,75 h 5 v 15 h -5 z" />
                <path d="M 90,65 h 5 v 5 h -5 z" />
                <path d="M 85,90 h 10 v 5 h -10 z" />
                
                {/* Malaysian National logo center spot indicator (simulated) */}
                <rect x="44" y="44" width="12" height="12" rx="2" fill="#e91e63" />
                <path d="M 47,50 L 53,50 M 50,47 L 50,53" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>
          {/* Lower text on pink badge */}
          <span className="text-[9px] font-black tracking-widest text-white uppercase text-center mt-3">
            MALAYSIA NATIONAL QR
          </span>
        </div>
      </div>

      {/* 10. BOTTOM COORDINATES WITH ASTERISKS */}
      <div className="w-full text-center text-xs text-slate-800 space-y-1 py-2 mt-2 select-none">
        <div className="text-slate-400 font-mono tracking-tighter">
          **************************************************
        </div>
        <div className="font-extrabold text-slate-900 tracking-wide">
          {branding.bankName || "MAYBANK"}
        </div>
        <div className="font-medium">
          {branding.companyContact || "+60-12-697-5464"}
        </div>
        <div className="font-medium underline hover:text-slate-950">
          {branding.companyEmail || "imotion.my"}
        </div>
        <div className="text-slate-400 font-mono tracking-tighter pt-1">
          **************************************************
        </div>
      </div>
    </div>
  );
};
export default ReceiptTemplate;

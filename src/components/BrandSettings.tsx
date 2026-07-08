import React, { useState } from "react";
import { useBrandSettings } from "../context/BrandSettingsContext";
import { Upload, Check, RefreshCw, Building, CreditCard, QrCode, Phone, Mail, MapPin } from "lucide-react";

export const BrandSettings: React.FC = () => {
  const { settings, updateSettings, loading } = useBrandSettings();
  const [logo, setLogo] = useState<string | null>(settings.logoUrl);
  const [receiptLogo, setReceiptLogo] = useState<string | null>(settings.receiptLogoUrl || "");
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor);
  const [fontFamily, setFontFamily] = useState("Rubik, sans-serif");
  const [companyName, setCompanyName] = useState(settings.companyName || "");
  const [companyAddress, setCompanyAddress] = useState(settings.companyAddress || "");
  const [companyContact, setCompanyContact] = useState(settings.companyContact || "");
  const [companyEmail, setCompanyEmail] = useState(settings.companyEmail || "");
  const [bankName, setBankName] = useState(settings.bankName || "");
  const [bankAccountNumber, setBankAccountNumber] = useState(settings.bankAccountNumber || "");
  const [bankAccountName, setBankAccountName] = useState(settings.bankAccountName || "");
  const [qrCode, setQrCode] = useState<string | null>(settings.qrCodeUrl || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    if (!loading) {
      setLogo(settings.logoUrl);
      setReceiptLogo(settings.receiptLogoUrl || "");
      setPrimaryColor(settings.primaryColor);
      setSecondaryColor(settings.secondaryColor);
      setFontFamily("Rubik, sans-serif");
      setCompanyName(settings.companyName || "");
      setCompanyAddress(settings.companyAddress || "");
      setCompanyContact(settings.companyContact || "");
      setCompanyEmail(settings.companyEmail || "");
      setBankName(settings.bankName || "");
      setBankAccountNumber(settings.bankAccountNumber || "");
      setBankAccountName(settings.bankAccountName || "");
      setQrCode(settings.qrCodeUrl || "");
    }
  }, [loading, settings]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select a logo smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReceiptLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select a logo smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select a QR code smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrCode(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await updateSettings({
        logoUrl: logo,
        receiptLogoUrl: receiptLogo,
        primaryColor,
        secondaryColor,
        fontFamily,
        companyName,
        companyAddress,
        companyContact,
        companyEmail,
        bankName,
        bankAccountNumber,
        bankAccountName,
        qrCodeUrl: qrCode,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Failed to save brand settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefault = () => {
    setLogo("");
    setReceiptLogo("");
    setPrimaryColor("#0f172a");
    setSecondaryColor("#3b82f6");
    setFontFamily("Rubik, sans-serif");
    setCompanyName("iMotion Production");
    setCompanyAddress("Level 14, Menara MSC Cyberport, No. 5 Jalan Bukit Meldrum, 80300 Johor Bahru, Johor, Malaysia");
    setCompanyContact("+60 12-345 6789");
    setCompanyEmail("hello@imotion.pro");
    setBankName("Maybank");
    setBankAccountNumber("5012 3456 7890");
    setBankAccountName("iMotion Production Sdn. Bhd.");
    setQrCode("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-blue-600 h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8 no-print">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Brand Settings</h2>
          <p className="text-sm text-slate-500 mt-1">
            Customize iMotion Production's corporate logo, fonts, and theme colors. These settings apply globally to all templates.
          </p>
        </div>
        <button
          type="button"
          onClick={handleResetToDefault}
          className="text-xs text-slate-400 hover:text-rose-600 font-medium transition-colors"
        >
          Reset Defaults
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Logo Upload Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Company Corporate Logo</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-36 h-24 border border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-sm shrink-0">
                {logo ? (
                  <div className="relative w-full h-full group">
                    <img src={logo} alt="Logo Preview" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => setLogo(null)}
                      className="absolute inset-0 bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity animate-fade-in"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-2">
                    <Upload className="mx-auto text-slate-400 h-5 w-5 mb-1" />
                    <p className="text-[9px] text-slate-400">PNG, JPG up to 2MB</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto cursor-pointer">
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload Corporate Logo
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  Default logo for standard documents & invoices.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Receipt (Thermal Style) Logo</label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-36 h-24 border border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-sm shrink-0">
                {receiptLogo ? (
                  <div className="relative w-full h-full group">
                    <img src={receiptLogo} alt="Receipt Logo Preview" className="w-full h-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => setReceiptLogo(null)}
                      className="absolute inset-0 bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity animate-fade-in"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-2">
                    <Upload className="mx-auto text-slate-400 h-5 w-5 mb-1" />
                    <p className="text-[9px] text-slate-400">PNG, JPG up to 2MB</p>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto cursor-pointer">
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  Upload Receipt Logo
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleReceiptLogoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                  Optimized custom logo for Receipt (Thermal Style).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Colors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <label className="block text-sm font-semibold text-slate-800 mb-1">Primary Color</label>
            <p className="text-xs text-slate-400 mb-4">Used for template headers, titles, and main accents.</p>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer p-1 bg-white"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono uppercase"
              />
            </div>
          </div>

          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <label className="block text-sm font-semibold text-slate-800 mb-1">Secondary / Accent Color</label>
            <p className="text-xs text-slate-400 mb-4">Used for visual badges, subtle borders, and secondary text.</p>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer p-1 bg-white"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono uppercase"
              />
            </div>
          </div>
        </div>

        {/* Company Profile Settings */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
            <Building className="h-5 w-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-800">Company Profile Details</h3>
          </div>
          <p className="text-xs text-slate-400">Specify your official registered company details. These will replace default template values automatically.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Registered Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. iMotion Production"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Company Email</label>
              <input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="e.g. billing@imotion.pro"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Official Contact Number</label>
              <input
                type="text"
                value={companyContact}
                onChange={(e) => setCompanyContact(e.target.value)}
                placeholder="e.g. +60 12-345 6789"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Business Address</label>
              <textarea
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                placeholder="Enter full legal company address..."
                rows={2}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Bank Details & QR Code Section */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/60 pb-2">
            <CreditCard className="h-5 w-5 text-slate-700" />
            <h3 className="text-sm font-bold text-slate-800">Bank Information & QR Payment</h3>
          </div>
          <p className="text-xs text-slate-400">Configure bank accounts or upload a DuitNow, TNG, or other payment QR code. This will display at the bottom of the templates for your clients.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g. Maybank / CIMB"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Number</label>
              <input
                type="text"
                value={bankAccountNumber}
                onChange={(e) => setBankAccountNumber(e.target.value)}
                placeholder="e.g. 5012 3456 7890"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Account Holder Name</label>
              <input
                type="text"
                value={bankAccountName}
                onChange={(e) => setBankAccountName(e.target.value)}
                placeholder="e.g. iMotion Production Sdn. Bhd."
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* QR Code Upload Sub-Section */}
          <div className="pt-2 border-t border-slate-200/40 mt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">Payment QR Code Image</label>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-32 h-32 border border-dashed border-slate-200 rounded-xl flex items-center justify-center overflow-hidden bg-white shadow-sm">
                  {qrCode ? (
                    <div className="relative w-full h-full group">
                      <img src={qrCode} alt="QR Code Preview" className="w-full h-full object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => setQrCode("")}
                        className="absolute inset-0 bg-black/60 text-white text-[10px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        Remove QR
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-2">
                      <QrCode className="mx-auto text-slate-300 h-8 w-8 mb-1" />
                      <p className="text-[9px] text-slate-400">DuitNow / TNG QR</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 w-full">
                  <label className="cursor-pointer inline-flex items-center justify-center px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors w-full sm:w-auto">
                    <Upload className="h-3.5 w-3.5 mr-1.5" />
                    Upload QR Code
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleQrCodeUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                    Upload your corporate payment QR code image (PNG, JPG up to 2MB).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Font Family Selection */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
          <label className="block text-sm font-semibold text-slate-800 mb-1">Document Typography</label>
          <p className="text-xs text-slate-400 mb-4">The font family has been standardized to Rubik across all templates and UI systems to maintain unified brand aesthetics.</p>
          <div className="w-full bg-slate-100 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 flex items-center justify-between">
            <span>Rubik (Standardized Premium Font)</span>
            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
          </div>

          {/* Typography Preview */}
          <div className="mt-4 p-4 rounded-xl bg-white border border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Font Family Preview</p>
            <div style={{ fontFamily: "Rubik, sans-serif" }} className="text-slate-800 space-y-1">
              <p className="text-lg font-bold">iMotion Production Premium Media Services</p>
              <p className="text-sm">RM 14,500.00 Cinema Package - Total SST 8% Due</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          {saved && (
            <span className="flex items-center text-xs font-semibold text-emerald-600 animate-fade-in">
              <Check className="h-4 w-4 mr-1" /> Settings updated globally!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="animate-spin h-4 w-4 mr-2" /> Saving...
              </>
            ) : (
              "Save Brand Guidelines"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

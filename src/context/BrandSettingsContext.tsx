import React, { createContext, useContext, useState, useEffect } from "react";
import { BrandingSettings } from "../types";
import { getBrandSettings, saveBrandSettings } from "../services/storageService";

interface BrandSettingsContextType {
  settings: BrandingSettings;
  updateSettings: (newSettings: BrandingSettings) => Promise<void>;
  loading: boolean;
}

const BrandSettingsContext = createContext<BrandSettingsContextType | undefined>(undefined);

export const BrandSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BrandingSettings>({
    logoUrl: "",
    primaryColor: "#0f172a",
    secondaryColor: "#3b82f6",
    fontFamily: "Rubik, sans-serif",
    companyName: "iMotion Production",
    companyAddress: "Level 14, Menara MSC Cyberport, No. 5 Jalan Bukit Meldrum, 80300 Johor Bahru, Johor, Malaysia",
    companyContact: "+60 12-345 6789",
    companyEmail: "hello@imotion.pro",
    bankName: "Maybank",
    bankAccountNumber: "5012 3456 7890",
    bankAccountName: "iMotion Production Sdn. Bhd.",
    qrCodeUrl: "",
    receiptLogoUrl: "",
    projectQrCodeUrl: "",
    designBoardLink: "https://imotion.my"
  });
  const [loading, setLoading] = useState(true);

  // Fetch settings on load
  useEffect(() => {
    let active = true;
    getBrandSettings()
      .then((data) => {
        if (active) {
          setSettings(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error loading brand settings:", err);
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateSettings = async (newSettings: BrandingSettings) => {
    try {
      await saveBrandSettings(newSettings);
      setSettings(newSettings);
    } catch (err) {
      console.error("Error updating brand settings:", err);
      throw err;
    }
  };

  return (
    <BrandSettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </BrandSettingsContext.Provider>
  );
};

export const useBrandSettings = () => {
  const context = useContext(BrandSettingsContext);
  if (!context) {
    throw new Error("useBrandSettings must be used within a BrandSettingsProvider");
  }
  return context;
};

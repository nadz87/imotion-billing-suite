import React from "react";
import { InvoiceData, BrandingSettings } from "../../types";
import { MinimalTemplate } from "./MinimalTemplate";
import { ModernTemplate } from "./ModernTemplate";
import { CreativeTemplate } from "./CreativeTemplate";
import { CorporateTemplate } from "./CorporateTemplate";
import { DarkTemplate } from "./DarkTemplate";
import { ReceiptTemplate } from "./ReceiptTemplate";
import { DeliveryOrderTemplate } from "./DeliveryOrderTemplate";

interface TemplateSwitcherProps {
  data: InvoiceData;
  branding: BrandingSettings;
}

export const TemplateSwitcher: React.FC<TemplateSwitcherProps> = ({ data, branding }) => {
  if (data.documentType === "Receipt" || data.templateId as string === "Receipt") {
    return <ReceiptTemplate data={data} branding={branding} />;
  }

  if (data.documentType === "Delivery Order" || data.templateId === "DeliveryOrder") {
    return <DeliveryOrderTemplate data={data} branding={branding} />;
  }

  switch (data.templateId) {
    case "Minimal":
      return <MinimalTemplate data={data} branding={branding} />;
    case "Modern":
      return <ModernTemplate data={data} branding={branding} />;
    case "Creative":
      return <CreativeTemplate data={data} branding={branding} />;
    case "Corporate":
      return <CorporateTemplate data={data} branding={branding} />;
    case "Dark":
      return <DarkTemplate data={data} branding={branding} />;
    default:
      return <CreativeTemplate data={data} branding={branding} />;
  }
};

export default TemplateSwitcher;

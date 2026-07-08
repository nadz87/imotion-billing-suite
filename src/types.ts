export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  stockNumber?: string; // Add optional SKU/stock number for delivery orders
  qtyOrdered?: number;  // Add optional quantity ordered vs quantity sent
}

export type TemplateType = "Minimal" | "Modern" | "Creative" | "Corporate" | "Dark" | "DeliveryOrder";

export interface InvoiceData {
  id?: string;
  documentType: "Tax Invoice" | "Quotation" | "Receipt" | "Delivery Order";
  invoiceNumber: string;
  vendor: string;
  date: string;
  clientName: string;
  clientAddress: string;
  clientContact?: string;
  clientPhone?: string;
  clientWebsite?: string;
  clientContactPerson?: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  revisionPolicy: string;
  deliveryTimeline: string;
  templateId: TemplateType;
  includeSst?: boolean;
  projectQrCodeUrl?: string | null;
  designBoardLink?: string;
  
  // Custom Logistics fields matching the uploaded delivery layout
  orderNumber?: string;
  associatedInvoiceNumber?: string;
  totalPackagesDespatched?: string;
  dateDespatched?: string;
  deliveredVia?: string;
  weight?: string;
  salesperson?: string;
}

export interface BrandingSettings {
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  companyName?: string;
  companyAddress?: string;
  companyContact?: string;
  companyEmail?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  qrCodeUrl?: string | null;
  receiptLogoUrl?: string | null;
  projectQrCodeUrl?: string | null;
  designBoardLink?: string;
}

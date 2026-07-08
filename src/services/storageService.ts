import { db, isFirebaseConfigured } from "../firebase/config";
import { doc, getDoc, setDoc, collection, getDocs, addDoc } from "firebase/firestore";
import { InvoiceData, BrandingSettings } from "../types";

const LOCAL_STORAGE_INVOICES_KEY = "imotion_invoices";
const LOCAL_STORAGE_BRAND_KEY = "imotion_brand_settings";

// Default Malaysian premium clients to pre-populate the dropdown and database
const DEFAULT_CLIENTS = [
  { id: "c1", name: "PETRONAS Nasional Berhad", address: "Tower 1, PETRONAS Twin Towers, Kuala Lumpur City Centre, 50088 Kuala Lumpur", phone: "+60 3-2051 5000", contact: "info@petronas.com.my", website: "www.petronas.com", contactPerson: "Ahmad Sufian" },
  { id: "c2", name: "Astro Malaysia Holdings", address: "All Asia Broadcast Centre, Bukit Jalil, 57000 Kuala Lumpur", phone: "+60 3-9543 3838", contact: "wecare@astro.com.my", website: "www.astro.com.my", contactPerson: "Mariam Jamilah" },
  { id: "c3", name: "Maybank Group Malaysia", address: "Menara Maybank, 100 Jalan Tun Perak, 50050 Kuala Lumpur", phone: "+60 3-2070 8833", contact: "corporate@maybank.com.my", website: "www.maybank.com", contactPerson: "Farhan Haris" },
  { id: "c4", name: "Maxis Communications", address: "Menara Maxis, Kuala Lumpur City Centre, 50088 Kuala Lumpur", phone: "+60 3-2330 7000", contact: "customercare@maxis.com.my", website: "www.maxis.com.my", contactPerson: "Siti Aminah" },
  { id: "c5", name: "Digi Telecommunications", address: "Lot 10, Jalan Delima 1/1, Subang Hi-Tech Industrial Park, 40000 Shah Alam, Selangor", phone: "+60 16-221 1800", contact: "business@digi.com.my", website: "www.digi.com.my", contactPerson: "Tan Kok Seng" }
];

const DEFAULT_BRAND_SETTINGS: BrandingSettings = {
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
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Brand Settings operations
 */
export async function getBrandSettings(): Promise<BrandingSettings> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "config", "brandSettings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as BrandingSettings;
      }
    } catch (err) {
      console.error("Firestore Error fetching brand settings:", err);
    }
  }

  await delay(200);
  const stored = localStorage.getItem(LOCAL_STORAGE_BRAND_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return DEFAULT_BRAND_SETTINGS;
}

export async function saveBrandSettings(settings: BrandingSettings): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      const docRef = doc(db, "config", "brandSettings");
      await setDoc(docRef, settings, { merge: true });
      return;
    } catch (err) {
      console.error("Firestore Error saving brand settings:", err);
      throw err;
    }
  }

  await delay(300);
  localStorage.setItem(LOCAL_STORAGE_BRAND_KEY, JSON.stringify(settings));
}

/**
 * Invoice & Quotation operations
 */
export async function getInvoices(): Promise<InvoiceData[]> {
  if (isFirebaseConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "invoices"));
      const list: InvoiceData[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as InvoiceData);
      });
      return list.sort((a, b) => b.date.localeCompare(a.date));
    } catch (err) {
      console.error("Firestore Error listing invoices:", err);
    }
  }

  await delay(200);
  const stored = localStorage.getItem(LOCAL_STORAGE_INVOICES_KEY);
  if (stored) {
    const list = JSON.parse(stored) as InvoiceData[];
    return list.sort((a, b) => b.date.localeCompare(a.date));
  }
  return [];
}

export async function saveInvoice(invoice: InvoiceData): Promise<InvoiceData> {
  if (isFirebaseConfigured && db) {
    try {
      const { id, ...invoiceData } = invoice;
      const docRef = await addDoc(collection(db, "invoices"), invoiceData);

      return {
        ...invoiceData,
        id: docRef.id,
      } as InvoiceData;
    } catch (err) {
      console.error("Firestore Error saving invoice:", err);
      throw err;
    }
  }

  await delay(400);
  const stored = localStorage.getItem(LOCAL_STORAGE_INVOICES_KEY);
  const currentInvoices: InvoiceData[] = stored ? JSON.parse(stored) : [];

  const newInvoice = {
    ...invoice,
    id: invoice.id || `local_${Date.now()}`
  };

  const existingIdx = currentInvoices.findIndex(inv => inv.id === newInvoice.id);
  if (existingIdx >= 0) {
    currentInvoices[existingIdx] = newInvoice;
  } else {
    currentInvoices.push(newInvoice);
  }

  localStorage.setItem(LOCAL_STORAGE_INVOICES_KEY, JSON.stringify(currentInvoices));
  return newInvoice;
}

/**
 * Clients list operation
 */
export async function getClients(): Promise<{ id: string; name: string; address: string; contact?: string; phone?: string; website?: string; contactPerson?: string }[]> {
  if (isFirebaseConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, "clients"));
      const list: any[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.error("Firestore Error listing clients:", err);
    }
  }

  await delay(100);
  const storedInvoices = localStorage.getItem(LOCAL_STORAGE_INVOICES_KEY);
  const invoices: InvoiceData[] = storedInvoices ? JSON.parse(storedInvoices) : [];

  const clientMap = new Map<string, { id: string; name: string; address: string; contact?: string; phone?: string; website?: string; contactPerson?: string }>();

  DEFAULT_CLIENTS.forEach(c => clientMap.set(c.name.toLowerCase(), c));

  invoices.forEach(inv => {
    if (inv.clientName && inv.clientName.trim().length > 0) {
      const clientKey = inv.clientName.trim().toLowerCase();
      if (!clientMap.has(clientKey)) {
        clientMap.set(clientKey, {
          id: `client_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          name: inv.clientName.trim(),
          address: inv.clientAddress || "",
          contact: inv.clientContact || "",
          phone: inv.clientPhone || "",
          website: inv.clientWebsite || "",
          contactPerson: inv.clientContactPerson || ""
        });
      }
    }
  });

  return Array.from(clientMap.values());
}
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClients, getInvoices, saveInvoice } from "../services/storageService";
import { InvoiceData } from "../types";

/**
 * Hook to fetch the list of clients (either pre-seeded premium clients or harvested dynamically)
 */
export const useClientsQuery = () => {
  return useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};

/**
 * Hook to fetch all saved invoices and quotations
 */
export const useInvoicesQuery = () => {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: getInvoices,
  });
};

/**
 * Mutation hook to save an invoice or quotation, with high-fidelity optimistic updates
 */
export const useSaveInvoiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveInvoice,
    // When mutate is called, perform optimistic update
    onMutate: async (newInvoice: InvoiceData) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["invoices"] });

      // Snapshot the previous value
      const previousInvoices = queryClient.getQueryData<InvoiceData[]>(["invoices"]) || [];

      // Create an optimistic version of the invoice (with a temporary ID if it doesn't have one)
      const optimisticInvoice = {
        ...newInvoice,
        id: newInvoice.id || `optimistic_${Date.now()}`,
      };

      // Optimistically update the list
      const updatedList = [optimisticInvoice, ...previousInvoices.filter(inv => inv.id !== optimisticInvoice.id)];
      queryClient.setQueryData(["invoices"], updatedList);

      // Return context with previous list
      return { previousInvoices };
    },
    // If the mutation fails, rollback
    onError: (err, newInvoice, context) => {
      if (context?.previousInvoices) {
        queryClient.setQueryData(["invoices"], context.previousInvoices);
      }
    },
    // Always refetch or invalidate after success or failure to ensure sync
    onSuccess: () => {
      // Also invalidate clients to harvest newly inputted clients dynamically
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

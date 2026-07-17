import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "#constants/apiUrl.constants";
import { apiRequest } from "#utils/apiRequest";

const fetchInvoice = async (id: string) => {
  const url = `${apiUrl}/api/invoices/fetchInvoice?id=${id}`;

  const response = await apiRequest(url, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch invoice");
  }

  const result = await response.json();

  if (!result.invoice) {
    throw new Error("Invoice data not found");
  }

  return result.invoice;
};

export const useInvoiceQuery = (invoiceId: string | undefined) => {
  return useQuery<InvoiceTypes>({
    queryKey: ["invoice", invoiceId],
    queryFn: () => fetchInvoice(invoiceId!),
    enabled: !!invoiceId,
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};

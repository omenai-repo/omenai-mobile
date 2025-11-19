import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getOrdersBySellerId } from "services/orders/getOrdersBySellerId";
import { organizeOrders } from "utils/utils_splitArray";
import { useModalStore } from "store/modal/modalStore";

interface UseOrdersManagementOptions {
  queryKey: readonly string[];
  errorMessage?: string;
}

export const useOrdersManagement = ({
  queryKey,
  errorMessage = "Failed to fetch orders",
}: UseOrdersManagementOptions) => {
  const { updateModal } = useModalStore();
  const [selectedTab, setSelectedTab] = useState<"pending" | "processing" | "completed">("pending");
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({});
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const ordersQuery = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const res = await getOrdersBySellerId();
        if (!res?.isOk) throw new Error(res?.body?.message ?? errorMessage);
        return Array.isArray(res.data) ? res.data : [];
      } catch (err: any) {
        updateModal({
          message: err?.message ?? errorMessage,
          showModal: true,
          modalType: "error",
        });
        return [];
      }
    },
    staleTime: 30_000,
    gcTime: 10 * 60_000,
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const { pending, processing, completed } = useMemo(() => {
    const parsed = organizeOrders(ordersQuery.data ?? []);
    return parsed;
  }, [ordersQuery.data]);

  const filterByYear = useCallback(
    (arr: any[]) => {
      if (!Array.isArray(arr)) return [];
      return arr.filter((o) => new Date(o.createdAt).getFullYear() === selectedYear);
    },
    [selectedYear]
  );

  const getCurrentOrders = useCallback(() => {
    if (selectedTab === "pending") return filterByYear(pending);
    if (selectedTab === "processing") return filterByYear(processing);
    return filterByYear(completed);
  }, [selectedTab, filterByYear, pending, processing, completed]);

  const toggleRecentOrder = useCallback((key: string | number) => {
    const k = String(key);
    setOpenSection((prev) => ({
      ...prev,
      [k]: !prev[k],
    }));
  }, []);

  const isInitialLoading = ordersQuery.isLoading && !ordersQuery.data;
  const isRefreshing = ordersQuery.isFetching && !!ordersQuery.data;

  return {
    selectedTab,
    setSelectedTab,
    openSection,
    selectedYear,
    setSelectedYear,
    ordersQuery,
    pending,
    processing,
    completed,
    currentOrders: getCurrentOrders(),
    toggleRecentOrder,
    isInitialLoading,
    isRefreshing,
  };
};

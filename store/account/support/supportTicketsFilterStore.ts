import { create } from "zustand";

type FilterState = {
  status: string;
  priority: string;
  year: string;
  setStatus: (status: string) => void;
  setPriority: (priority: string) => void;
  setYear: (year: string) => void;
  clearAllFilters: () => void;
  getActiveFilterCount: () => number;
  getSelectedFilters: () => { name: string }[];
};

const INITIAL_STATE = {
  status: "ALL",
  priority: "ALL",
  year: "ALL",
};

export const useSupportTicketsFilterStore = create<FilterState>((set, get) => ({
  ...INITIAL_STATE,

  setStatus: (status) => set({ status }),
  setPriority: (priority) => set({ priority }),
  setYear: (year) => set({ year }),

  clearAllFilters: () => set(INITIAL_STATE),

  getActiveFilterCount: () => {
    const { status, priority, year } = get();
    let count = 0;
    if (status !== "ALL") count++;
    if (priority !== "ALL") count++;
    if (year !== "ALL") count++;
    return count;
  },

  getSelectedFilters: () => {
    const { status, priority, year } = get();
    const filters: { name: string }[] = [];
    if (status !== "ALL")
      filters.push({ name: `Status: ${status.replaceAll("_", " ")}` });
    if (priority !== "ALL") filters.push({ name: `Priority: ${priority}` });
    if (year !== "ALL") filters.push({ name: `Year: ${year}` });
    return filters;
  },
}));

export const STATUS_OPTIONS = [
  { label: "All Status", value: "ALL" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Resolved", value: "RESOLVED" },
  { label: "Closed", value: "CLOSED" },
];

export const PRIORITY_OPTIONS = [
  { label: "All Priority", value: "ALL" },
  { label: "High", value: "HIGH" },
  { label: "Normal", value: "NORMAL" },
  { label: "Low", value: "LOW" },
];

const currentYear = new Date().getFullYear();
export const YEAR_OPTIONS = [
  { label: "All Years", value: "ALL" },
  ...Array.from({ length: currentYear - 2019 }, (_, i) => ({
    label: String(currentYear - i),
    value: String(currentYear - i),
  })),
];

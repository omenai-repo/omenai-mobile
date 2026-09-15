import { useMemo, useState } from "react";
import {
  startOfToday,
  parseYmdLocal,
  formatYmdLocal,
} from "../helpers/createEventHelpers";

export type DateFieldKey = "start_date" | "end_date" | "vip_preview_date";

type DatePickerConfig = {
  min: Date | undefined;
  max: Date | undefined;
  current: Date;
};

export function useEventDatePicker(
  startDate: string,
  endDate: string,
  vipPreviewDate: string,
) {
  const [activeDateField, setActiveDateField] = useState<DateFieldKey | null>(null);

  const datePickerConfig = useMemo((): DatePickerConfig | null => {
    if (!activeDateField) return null;

    const sod = startOfToday();
    const startParsed = parseYmdLocal(startDate);
    const endParsed = parseYmdLocal(endDate);
    const vipParsed = parseYmdLocal(vipPreviewDate);

    if (activeDateField === "start_date") {
      const current =
        startParsed && startParsed.getTime() >= sod.getTime() ? startParsed : sod;
      return { min: sod, max: undefined, current };
    }

    if (activeDateField === "end_date") {
      const minEnd =
        startParsed && startParsed.getTime() >= sod.getTime() ? startParsed : sod;
      const current =
        endParsed && endParsed.getTime() >= minEnd.getTime() ? endParsed : minEnd;
      return { min: minEnd, max: undefined, current };
    }

    // VIP preview: no min/max
    const current = vipParsed ?? sod;
    return { min: undefined, max: undefined, current };
  }, [activeDateField, startDate, endDate, vipPreviewDate]);

  const handleDatePicked = (
    picked: Date,
    setFormData: React.Dispatch<React.SetStateAction<any>>,
    setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  ) => {
    if (!activeDateField) return;

    const normalized = new Date(picked);
    normalized.setHours(0, 0, 0, 0);
    const ymd = formatYmdLocal(normalized);

    setErrors((prev) => ({ ...prev, [activeDateField]: "" }));

    if (activeDateField === "start_date") {
      setFormData((prev: any) => {
        let { end_date: end, vip_preview_date: vip } = prev;
        if (end) {
          const endD = parseYmdLocal(end);
          if (endD && endD.getTime() < normalized.getTime()) end = ymd;
        }
        return { ...prev, start_date: ymd, end_date: end, vip_preview_date: vip };
      });
    } else if (activeDateField === "end_date") {
      setFormData((prev: any) => ({ ...prev, end_date: ymd }));
    } else {
      setFormData((prev: any) => ({ ...prev, vip_preview_date: ymd }));
    }
    setActiveDateField(null);
  };

  return {
    activeDateField,
    setActiveDateField,
    datePickerConfig,
    handleDatePicked,
  };
}

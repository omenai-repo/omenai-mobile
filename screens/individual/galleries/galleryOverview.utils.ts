import { getEventStatus } from "#services/events/events.service";
import type { GalleryOverviewEvent } from "#services/partners/fetchGalleryOverviewData";

export type HeadlinerStatus = "Active" | "Upcoming" | "Closed" | null;

function categorizeEvents(events: GalleryOverviewEvent[]) {
  const active: GalleryOverviewEvent[] = [];
  let earliestUpcoming: GalleryOverviewEvent | null = null;
  let latestPast: GalleryOverviewEvent | null = null;
  let earliestUpcomingTime = Infinity;
  let latestPastTime = -Infinity;

  for (const event of events) {
    const startTime = new Date(event.start_date).getTime();
    const st = getEventStatus(event.start_date, event.end_date);

    if (st === "Active") {
      active.push(event);
      continue;
    }

    if (st === "Upcoming") {
      if (startTime < earliestUpcomingTime) {
        earliestUpcomingTime = startTime;
        earliestUpcoming = event;
      }
      continue;
    }

    if (startTime > latestPastTime) {
      latestPastTime = startTime;
      latestPast = event;
    }
  }

  return { active, earliestUpcoming, latestPast };
}

export function computeGalleryHeadliner(events: GalleryOverviewEvent[] | undefined) {
  if (!events?.length) {
    return {
      highlightEvent: null as GalleryOverviewEvent | null,
      historyEvents: [] as GalleryOverviewEvent[],
      status: null as HeadlinerStatus,
    };
  }

  const { active, earliestUpcoming, latestPast } = categorizeEvents(events);
  const headliner =
    active[0] ??
    earliestUpcoming ??
    latestPast ??
    null;
  let currentStatus: HeadlinerStatus = null;
  if (active[0]) {
    currentStatus = "Active";
  } else if (earliestUpcoming) {
    currentStatus = "Upcoming";
  } else if (latestPast) {
    currentStatus = "Closed";
  }

  const historyEvents = headliner
    ? events.filter((e) => e.event_id !== headliner.event_id)
    : events;

  return { highlightEvent: headliner, historyEvents, status: currentStatus };
}

export function isExhibitionType(eventType: string) {
  return eventType === "exhibition";
}

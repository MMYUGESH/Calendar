import {
  DateFormatter,
  endOfMonth,
  endOfWeek,
  endOfYear,
  fromDate,
  getLocalTimeZone,
  now,
  startOfMonth,
  startOfWeek,
  startOfYear,
  ZonedDateTime,
} from "@internationalized/date";
import React from "react";
import { EventProps } from "../components/event";

const getEventsBetween = async (start: string, end: string) => {
  console.log("fetching events between", start, end);

  return (await import("../data/calendarfromtoenddate.json")).default;
};

const eventsReducer = (acc: Map<string, Set<EventProps>>, curr: EventProps) => {
  const key1 = new DateFormatter(navigator.language, {
    dateStyle: "short",
  }).format(fromDate(new Date(curr.start), getLocalTimeZone()).toDate());

  const key2 = new DateFormatter(navigator.language, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(fromDate(new Date(curr.start), getLocalTimeZone()).toDate());

  if (!acc.has(key1)) {
    acc.set(key1, new Set());
  }

  if (!acc.has(key2)) {
    acc.set(key2, new Set());
  }

  acc.get(key1)?.add(curr);

  acc.get(key2)?.add(curr);

  return acc;
};

export type CalendarContextValue = {
  events: Map<string, Set<EventProps>>;
  date: ZonedDateTime;
  view: "day" | "week" | "month" | "year";
  changeView: (view: "day" | "week" | "month" | "year") => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleToday: () => void;
};

export const CalendarContext = React.createContext<CalendarContextValue | null>(
  null
);

export const useCalendarContextValue = () => {
  const [date, setDate] = React.useState<CalendarContextValue["date"]>(
    now(getLocalTimeZone())
  );

  const [events, setEvents] = React.useState<CalendarContextValue["events"]>(
    new Map()
  );

  const [view, setView] = React.useState<CalendarContextValue["view"]>("day");

  const changeView = React.useCallback<CalendarContextValue["changeView"]>(
    (view) => {
      setView(view);
    },
    [setView]
  );

  const handleNext = React.useCallback(() => {
    if (view === "day") {
      return setDate((date) => date.add({ days: 1 }));
    }
    if (view === "week") {
      return setDate((date) => date.add({ weeks: 1 }));
    }
    if (view === "month") {
      return setDate((date) => date.add({ months: 1 }));
    }
    if (view === "year") {
      return setDate((date) => date.add({ years: 1 }));
    }
  }, [view]);

  const handlePrev = React.useCallback(() => {
    if (view === "day") {
      return setDate((date) => date.subtract({ days: 1 }));
    }
    if (view === "week") {
      return setDate((date) => date.subtract({ weeks: 1 }));
    }
    if (view === "month") {
      return setDate((date) => date.subtract({ months: 1 }));
    }
    if (view === "year") {
      return setDate((date) => date.subtract({ years: 1 }));
    }
  }, [view]);

  const handleToday = React.useCallback(() => {
    setDate(now(getLocalTimeZone()));
  }, []);

  React.useEffect(() => {
    (async () => {
      if (view === "day") {
        const events = (
          (await getEventsBetween(
            date.toDate().toString(),
            date.toDate().toString()
          )) as EventProps[]
        ).reduce(eventsReducer, new Map());

        setEvents(() => events);
      }

      if (view === "week") {
        const events = (
          (await getEventsBetween(
            startOfWeek(date, navigator.language).toDate().toString(),
            endOfWeek(date, navigator.language).toDate().toString()
          )) as EventProps[]
        ).reduce(eventsReducer, new Map());

        setEvents(() => events);
      }

      if (view === "month") {
        const events = (
          (await getEventsBetween(
            startOfMonth(date).toDate().toString(),
            endOfMonth(date).toDate().toString()
          )) as EventProps[]
        ).reduce(eventsReducer, new Map());

        setEvents(() => events);
      }

      if (view === "year") {
        const events = (
          (await getEventsBetween(
            startOfYear(date).toDate().toString(),
            endOfYear(date).toDate().toString()
          )) as EventProps[]
        ).reduce(eventsReducer, new Map());

        setEvents(() => events);
      }
    })();
  }, [view, date]);

  return {
    changeView,
    date,
    events,
    handleNext,
    handlePrev,
    handleToday,
    view,
  };
};

export const useCalendarContext = () => {
  const context = React.useContext(CalendarContext);

  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a Calendar Component"
    );
  }

  return context;
};

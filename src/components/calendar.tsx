import {
  DateFormatter,
  endOfWeek,
  getLocalTimeZone,
  startOfWeek,
  today,
} from "@internationalized/date";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import React from "react";
import {
  CalendarContext,
  CalendarContextValue,
  useCalendarContext,
  useCalendarContextValue,
} from "../hooks/use-calendar-context";
import { Day } from "./day";
import { Month } from "./month";
import { Week } from "./week";
import { Year } from "./year";

export const Calendar = () => {
  const value = useCalendarContextValue();

  return (
    <CalendarContext.Provider value={value}>
      <Card>
        <CardContent>
          <CalendarHeader />

          <CalendarBody />
        </CardContent>
      </Card>
    </CalendarContext.Provider>
  );
};

const ViewButton = ({
  label,
}: {
  label: Parameters<CalendarContextValue["changeView"]>[0];
}) => {
  const { changeView, view } = useCalendarContext();

  const handleChangeView = React.useCallback<
    (view: Parameters<CalendarContextValue["changeView"]>[0]) => () => void
  >(
    (view) => () => {
      changeView(view);
    },
    [changeView]
  );

  return (
    <Button
      onClick={handleChangeView(label)}
      variant={(() => {
        if (view === label) {
          return "contained";
        }

        return "text";
      })()}
    >
      {label}
    </Button>
  );
};

const CalendarHeaderTitle = () => {
  const { date, view } = useCalendarContext();

  return (
    <>
      {(() => {
        if (view === "day") {
          return (
            <>
              {new DateFormatter(navigator.language, {
                dateStyle: "long",
              }).format(date.toDate())}
            </>
          );
        }
        if (view === "week") {
          const startDate = startOfWeek(date, navigator.language);
          const endDate = endOfWeek(date, navigator.language);

          return (
            <>
              {new DateFormatter(navigator.language, {
                dateStyle: "long",
              }).format(startDate.toDate())}{" "}
              to{" "}
              {new DateFormatter(navigator.language, {
                dateStyle: "long",
              }).format(endDate.toDate())}
            </>
          );
        }
        if (view === "month") {
          return (
            <>
              {new DateFormatter(navigator.language, {
                month: "long",
                year: "numeric",
              }).format(date.toDate())}
            </>
          );
        }
        if (view === "year") {
          return (
            <>
              {new DateFormatter(navigator.language, {
                year: "numeric",
              }).format(date.toDate())}
            </>
          );
        }
      })()}
    </>
  );
};

const CalendarHeader = () => {
  const { handleNext, handlePrev, handleToday } = useCalendarContext();

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Stack direction="row" spacing={2} alignItems="center">
        <Button variant="outlined" onClick={handlePrev}>
          <ChevronLeft />
        </Button>

        <Button variant="outlined" onClick={handleNext}>
          <ChevronRight />
        </Button>

        <Button color="inherit" variant="contained" onClick={handleToday}>
          <Typography color="primary">
            {new DateFormatter(navigator.language, {
              day: "2-digit",
            }).format(today(getLocalTimeZone()).toDate(getLocalTimeZone()))}
          </Typography>
        </Button>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Typography>
          <strong>
            <CalendarHeaderTitle />
          </strong>
        </Typography>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <ViewButton label="day" />
        <ViewButton label="week" />
        <ViewButton label="month" />
        <ViewButton label="year" />
      </Stack>
    </Stack>
  );
};

export const CalendarBody = () => {
  const { view, date } = useCalendarContext();

  return (
    <Stack sx={{ padding: 2, paddingTop: 3 }}>
      {(() => {
        if (view === "day") {
          return <Day date={date} />;
        }
        if (view === "week") {
          return <Week date={date} />;
        }
        if (view === "month") {
          return <Month date={date} />;
        }
        if (view === "year") {
          return <Year />;
        }

        return null;
      })()}
    </Stack>
  );
};

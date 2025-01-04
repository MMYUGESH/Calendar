import { DateFormatter, ZonedDateTime } from "@internationalized/date";
import { Badge, Box, Button, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import { useCalendarContext } from "../hooks/use-calendar-context";
import { Event, EventDialog, EventProps, EventsMenu } from "./event";

export type DayProps = {
  date: ZonedDateTime;
};

export const Day = ({ date }: DayProps) => {
  const { view } = useCalendarContext();

  return (
    <>
      {(() => {
        if (view === "day") {
          return (
            <>
              <Stack
                direction="row"
                alignItems="flex-end"
                justifyContent="center"
              >
                <Box sx={{ width: 160 }}>
                  <TimeLine
                    date={date}
                    renderSlot={(datetime) => <TimeLabel datetime={datetime} />}
                  />
                </Box>
                <Box sx={{ width: "100%" }}>
                  <TimeLine
                    date={date}
                    renderSlot={(datetime) => (
                      <TimeLabel
                        datetime={datetime}
                        hideLabel
                        renderEvent={(datetime) => (
                          <RenderTimeLineEvent datetime={datetime} />
                        )}
                      />
                    )}
                  />
                </Box>
              </Stack>
            </>
          );
        }

        if (view === "week") {
          return (
            <>
              <TimeLine
                date={date}
                renderSlot={(datetime) => (
                  <TimeLabel
                    datetime={datetime}
                    hideLabel
                    renderEvent={(datetime) => (
                      <RenderTimeLineEvent datetime={datetime} />
                    )}
                  />
                )}
              />
            </>
          );
        }

        if (view === "month") {
          return (
            <>
              <DayTile date={date} />
            </>
          );
        }
      })()}
    </>
  );
};

export const RenderTimeLineEvent = ({
  datetime,
}: {
  datetime: ZonedDateTime;
}) => {
  const { events } = useCalendarContext();

  const eventsSet = events.get(
    new DateFormatter(navigator.language, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(datetime.toDate())
  );

  const eventsArray = Array.from(eventsSet || (new Set() as Set<EventProps>));

  if (eventsArray.length > 1) {
    return (
      <EventsMenu
        events={eventsArray}
        renderTrigger={(handleClick) => (
          <Badge
            sx={{ width: "100%", height: "100%" }}
            badgeContent={eventsArray.length}
            color="secondary"
          >
            <Event {...{ ...eventsArray[0], handleClick }} />
          </Badge>
        )}
      />
    );
  }

  if (eventsArray.length === 1) {
    return (
      <EventDialog
        eventId={eventsArray[0].id}
        renderTrigger={(handleClick) => (
          <Event {...{ ...eventsArray[0], handleClick }} />
        )}
      />
    );
  }

  return null;
};

export type TimeLineProps = DayProps & {
  renderSlot: (date: ZonedDateTime) => React.ReactNode;
};

export const TimeLine = ({ renderSlot, date }: TimeLineProps) => {
  return (
    <>
      <Stack direction="column" alignItems="center" sx={{ width: "100%" }}>
        {[
          0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
          20, 21, 22, 23, 0,
        ].map((hour, index) => {
          const datetime = date.set({
            hour,
            minute: 0,
            second: 0,
            millisecond: 0,
          });

          return (
            <React.Fragment
              key={(() => {
                if (index === 0) {
                  return `${datetime.toDate().toString()}${index}`;
                }

                return datetime.toDate().toString();
              })()}
            >
              <Stack
                direction="column"
                sx={{
                  height: (() => {
                    if (index === 0) {
                      return undefined;
                    }

                    return 100;
                  })(),
                  width: "100%",
                }}
              >
                {renderSlot(datetime)}
              </Stack>
            </React.Fragment>
          );
        })}
      </Stack>
    </>
  );
};

export type TimeLabelProps = {
  datetime: ZonedDateTime;
  hideLabel?: boolean;
  renderEvent?: (datetime: ZonedDateTime) => React.ReactNode;
};

export const TimeLabel = ({
  datetime,
  hideLabel,
  renderEvent,
}: TimeLabelProps) => {
  const label = new DateFormatter(navigator.language, {
    timeStyle: "short",
  }).format(datetime.toDate());

  return (
    <Stack direction="row" sx={{ width: "100%", height: "100%" }}>
      <Stack
        direction="column"
        sx={{ width: "100%" }}
        alignItems="center"
        justifyContent="flex-end"
      >
        {(() => {
          if (hideLabel) {
            return null;
          }

          return <Typography>{label}</Typography>;
        })()}

        {(() => {
          if (renderEvent) {
            return renderEvent(datetime);
          }

          return null;
        })()}

        <Box sx={{ width: "100%" }}>
          <Divider orientation="horizontal" />
        </Box>
      </Stack>

      <Box sx={{ height: "100%" }}>
        <Divider orientation="vertical" />
      </Box>
    </Stack>
  );
};

export type DayTileProps = DayProps;

export const DayTile = ({ date }: DayTileProps) => {
  return (
    <Stack
      direction="row"
      sx={{
        height: 160,
        width: "100%",
      }}
    >
      <Stack
        direction="column"
        sx={{ width: "100%", height: "100%" }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Button disabled>
          <Typography color="primary">
            <strong>
              {new DateFormatter(navigator.language, {
                day: "2-digit",
              }).format(date.toDate())}
            </strong>
          </Typography>
        </Button>

        <Box sx={{ width: "100%", paddingX: 1.5 }}>
          <RenderDayTileEvent datetime={date} />
        </Box>

        <Box sx={{ width: "100%" }}>
          <Divider orientation="horizontal" />
        </Box>
      </Stack>

      <Divider orientation="vertical" />
    </Stack>
  );
};

export const RenderDayTileEvent = ({
  datetime,
}: {
  datetime: ZonedDateTime;
}) => {
  const { events } = useCalendarContext();

  const eventsSet = events.get(
    new DateFormatter(navigator.language, {
      dateStyle: "short",
    }).format(datetime.toDate())
  );

  const eventsArray = Array.from(eventsSet || (new Set() as Set<EventProps>));

  if (eventsArray.length > 1) {
    return (
      <EventsMenu
        events={eventsArray}
        renderTrigger={(handleClick) => (
          <Badge
            sx={{ width: "100%", height: "100%" }}
            badgeContent={eventsArray.length}
            color="secondary"
          >
            <Event {...{ ...eventsArray[0], handleClick }} />
          </Badge>
        )}
      />
    );
  }

  if (eventsArray.length === 1) {
    return (
      <EventDialog
        eventId={eventsArray[0].id}
        renderTrigger={(handleClick) => (
          <Event {...{ ...eventsArray[0], handleClick }} />
        )}
      />
    );
  }

  return null;
};

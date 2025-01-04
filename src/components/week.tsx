import {
  DateFormatter,
  startOfWeek,
  ZonedDateTime,
} from "@internationalized/date";
import { Grid2, Typography } from "@mui/material";
import { Day, TimeLabel, TimeLine } from "./day";

export type WeekProps = {
  date: ZonedDateTime;
};

export const Week = ({ date }: WeekProps) => {
  const startDate = startOfWeek(date, navigator.language);

  return (
    <>
      <Grid2 container>
        <Grid2 size="grow" />

        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const date = startDate.add({ days: day });
          return (
            <Grid2 key={date.toDate().toString()} size="grow">
              <Typography align="center">
                <strong>
                  {new DateFormatter(navigator.language, {
                    day: "2-digit",
                  }).format(date.toDate())}{" "}
                  {new DateFormatter(navigator.language, {
                    month: "long",
                  }).format(date.toDate())}
                </strong>
              </Typography>
              <Typography align="center">
                {new DateFormatter(navigator.language, {
                  weekday: "long",
                }).format(date.toDate())}
              </Typography>
            </Grid2>
          );
        })}
      </Grid2>

      <Grid2 container alignItems="flex-end">
        <Grid2 size="grow">
          <TimeLine
            date={date}
            renderSlot={(datetime) => <TimeLabel datetime={datetime} />}
          />
        </Grid2>

        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const date = startDate.add({ days: day });
          return (
            <Grid2 key={date.toDate().toString()} size="grow">
              <Day date={date} />
            </Grid2>
          );
        })}
      </Grid2>
    </>
  );
};

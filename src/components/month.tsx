import {
  DateFormatter,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  ZonedDateTime,
} from "@internationalized/date";
import { Box, Divider, Grid2, Stack, Typography } from "@mui/material";
import { Day } from "./day";

export type MonthProps = {
  date: ZonedDateTime;
};

export const Month = ({ date }: MonthProps) => {
  const startDate = startOfWeek(startOfMonth(date), navigator.language);
  const endDate = endOfWeek(endOfMonth(date), navigator.language);

  return (
    <>
      <Grid2 container>
        {[0, 1, 2, 3, 4, 5, 6].map((day) => {
          const date = startDate.add({ days: day });
          return (
            <Grid2 key={date.toDate().toString()} size="grow">
              <Stack direction="column" spacing={2}>
                <Typography align="center">
                  <strong>
                    {new DateFormatter(navigator.language, {
                      weekday: "long",
                    }).format(date.toDate())}
                  </strong>
                </Typography>

                <Box sx={{ width: "100%" }}>
                  <Divider orientation="horizontal" />
                </Box>
              </Stack>
            </Grid2>
          );
        })}
      </Grid2>

      <Grid2 container>
        {(() => {
          const dates = [];
          for (
            let date = startDate;
            date <= endDate;
            date = date.add({ days: 1 })
          ) {
            dates.push(
              <Grid2 key={date.toDate().toString()} size={1.7142857143}>
                <Day date={date} />
              </Grid2>
            );
          }

          return dates;
        })()}
      </Grid2>
    </>
  );
};

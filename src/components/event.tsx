import {
  DateFormatter,
  fromDate,
  getLocalTimeZone,
} from "@internationalized/date";
import { Download, Visibility } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Dialog,
  DialogContent,
  Divider,
  Link,
  Menu,
  MenuItem,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import React from "react";
import GoogleMeetLogo from "../assets/google-meet.webp";

export type EventProps = {
  id: number;
  end: string;
  job_id: { jobRequest_Role: string; jobRequest_Title: string };
  link: string;
  start: string;
  summary: string;
  user_det: {
    candidate: { candidate_firstName: string; candidate_lastName: string };
    handled_by: { firstName: string; lastName: string };
  };
};

export const ITEM_HEIGHT = 100;

export const Event = (
  props: EventProps & {
    handleClick?: Parameters<EventsMenuProps["renderTrigger"]>[0];
    fullDetails?: boolean;
  }
) => {
  return (
    <>
      <Card sx={{ height: ITEM_HEIGHT, width: "100%" }}>
        <CardActionArea onClick={props.handleClick} sx={{ height: "100%" }}>
          <CardContent
            sx={{
              height: "100%",
              borderLeft: (theme) => `5px solid ${theme.palette.primary.main}`,
            }}
          >
            <Typography variant="caption" sx={{ textOverflow: "ellipsis" }}>
              {props.job_id.jobRequest_Title}
            </Typography>

            <br />

            <Typography variant="caption" sx={{ textOverflow: "ellipsis" }}>
              {(() => {
                if (props.fullDetails) {
                  return <>{props.summary} | </>;
                }

                return null;
              })()}
              Interviewer: {props.user_det.handled_by.firstName}
            </Typography>

            <br />

            <Typography
              variant="caption"
              sx={{ textOverflow: "ellipsis" }}
              noWrap
            >
              {(() => {
                if (props.fullDetails) {
                  return (
                    <>
                      Date:{" "}
                      {new DateFormatter(navigator.language, {
                        dateStyle: "medium",
                      }).format(
                        fromDate(
                          new Date(props.start),
                          getLocalTimeZone()
                        ).toDate()
                      )}{" "}
                      |{" "}
                    </>
                  );
                }

                return null;
              })()}
              Time:{" "}
              {new DateFormatter(navigator.language, {
                hour: "numeric",
              })
                .format(
                  fromDate(new Date(props.start), getLocalTimeZone()).toDate()
                )
                .replace(" AM", "")
                .replace(" PM", "")}{" "}
              -{" "}
              {new DateFormatter(navigator.language, {
                hour: "numeric",
                minute: "2-digit",
              }).format(
                fromDate(new Date(props.end), getLocalTimeZone()).toDate()
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
};

export type EventsMenuProps = {
  renderTrigger: (
    handleClick: (event: React.MouseEvent<HTMLElement>) => void
  ) => React.ReactNode;
  events: EventProps[];
};

export const EventsMenu = ({ events, renderTrigger }: EventsMenuProps) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {renderTrigger(handleClick)}
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: 260,
            },
          },
        }}
      >
        {events.map((event) => (
          <MenuItem key={event.id} sx={{ paddingX: 0 }}>
            <EventDialog
              eventId={event.id}
              renderTrigger={(handleClick) => (
                <Event {...{ ...event, handleClick, fullDetails: true }} />
              )}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const getEvent = async (eventId: number) => {
  console.log("fetching event for eventId", eventId);
  return (await import("../data/calendar-meeting.json")).default;
};

type EventDialogProps = {
  eventId: number;
  renderTrigger: (handleClick: () => void) => React.ReactNode;
};

export const EventDialog = ({ eventId, renderTrigger }: EventDialogProps) => {
  const [event, setEvent] = React.useState<EventProps>();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  React.useEffect(() => {
    (async () => {
      const fetchedEvent = (await getEvent(eventId)) as EventProps;

      setEvent(() => fetchedEvent);
    })();
  }, [eventId]);

  return (
    <>
      {renderTrigger(handleClickOpen)}

      <Dialog
        fullWidth
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        {(() => {
          if (event) {
            return (
              <DialogContent>
                <Stack
                  direction="row"
                  sx={{ width: "100%", height: "100%" }}
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Stack direction="column" sx={{ width: "100%" }} spacing={2}>
                    <Typography>
                      Interview With:{" "}
                      {event.user_det.candidate.candidate_firstName}{" "}
                      {event.user_det.candidate.candidate_lastName}
                    </Typography>

                    <Typography>
                      Position: {event.job_id.jobRequest_Role}
                    </Typography>

                    <Typography>Created By: -</Typography>

                    <Typography>
                      Interview Date:{" "}
                      {new DateFormatter(navigator.language, {
                        dateStyle: "medium",
                      }).format(
                        fromDate(
                          new Date(event.start),
                          getLocalTimeZone()
                        ).toDate()
                      )}
                    </Typography>

                    <Typography>
                      Interview Time:{" "}
                      {new DateFormatter(navigator.language, {
                        hour: "numeric",
                      })
                        .format(
                          fromDate(
                            new Date(event.start),
                            getLocalTimeZone()
                          ).toDate()
                        )
                        .replace(" AM", "")
                        .replace(" PM", "")}{" "}
                      -{" "}
                      {new DateFormatter(navigator.language, {
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(
                        fromDate(
                          new Date(event.end),
                          getLocalTimeZone()
                        ).toDate()
                      )}
                    </Typography>

                    <Button
                      variant="outlined"
                      sx={{ justifyContent: "space-between" }}
                      endIcon={
                        <Stack direction="row" spacing={1}>
                          <Visibility />
                          <Download />
                        </Stack>
                      }
                    >
                      Resume.docx
                    </Button>

                    <Button
                      variant="outlined"
                      sx={{ justifyContent: "space-between" }}
                      endIcon={
                        <Stack direction="row" spacing={1}>
                          <Visibility />
                          <Download />
                        </Stack>
                      }
                    >
                      Aadhaar Card
                    </Button>
                  </Stack>

                  <Divider orientation="vertical" flexItem />

                  <Stack
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ width: "100%" }}
                    spacing={2}
                  >
                    <Card sx={{ width: 140 }}>
                      <CardMedia
                        sx={{ height: 140 }}
                        image={GoogleMeetLogo}
                        title="green iguana"
                      />
                    </Card>

                    <Button
                      variant="contained"
                      LinkComponent={Link}
                      href={event?.link}
                      rel="noreferrer"
                      target="_blank"
                    >
                      JOIN
                    </Button>
                  </Stack>
                </Stack>
              </DialogContent>
            );
          }

          return null;
        })()}
      </Dialog>
    </>
  );
};

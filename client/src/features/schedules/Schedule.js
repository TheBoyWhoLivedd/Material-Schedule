import { Link, useNavigate } from "react-router-dom";
import { selectScheduleById, useGetSchedulesQuery } from "./schedulesApiSlice";
import { memo } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";

import { Edit } from "feather-icons-react";

const Schedule = ({ scheduleId }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { schedule } = useGetSchedulesQuery("schedulesList", {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[scheduleId],
    }),
  });
  console.log(schedule);

  const navigate = useNavigate();

  if (schedule) {
    const created = new Date(schedule.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "long",
    });
    // const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

    const handleEdit = () => navigate(`/dash/notes/${scheduleId}`);

    return (
      <>
        <Grid item key={schedule.id} xs={12} sm={6} md={4} styles={{paddingRight:"32px"}}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              ":hover": {
                transform: "scale(1.06)",
                transition: "transform 0.5s ease",
              },
              [theme.breakpoints.down("sm")]: {
                height: "auto",
                
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                gutterBottom
                variant="h5"
                component="h2"
                sx={{
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "1.2rem",
                  },
                }}
              >
                {schedule.title}
              </Typography>
              <Typography
                sx={{
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.8rem",
                  },
                }}
              >
                Funded By {schedule.funder}
              </Typography>
              <Typography
                sx={{
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.8rem",
                  },
                }}
              >
                Contractor: {schedule.contractor}
              </Typography>
              <Typography
                sx={{
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.8rem",
                  },
                }}
              >
                Contractor's TIN: {schedule.tin}
              </Typography>
              <Typography
                sx={{
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.8rem",
                  },
                }}
              >
                By {schedule.username}
              </Typography>
              <Typography
                sx={{
                  [theme.breakpoints.down("sm")]: {
                    fontSize: "0.8rem",
                  },
                }}
              >
                {created}
              </Typography>
            </CardContent>
            <CardActions>
              <Link to={`/dash/schedules/${schedule.id}`}>
                <Button size="small"> Schedules</Button>
              </Link>
              <Link to={`/dash/schedules/${schedule.id}/application`}>
                <Button size="small">Applications</Button>
              </Link>
              <Link to={`/dash/schedules/edit/${schedule.id}`}>
                <Button
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    background: "transparent",
                    color: "black",
                    "&:hover": {
                      background: "transparent",
                      color: "black",
                    },
                    [theme.breakpoints.down("sm")]: {
                      position: "relative",
                      top: 0,
                      right: 0,
                    },
                  }}
                >
                  <Edit size={20} />
                </Button>
              </Link>
            </CardActions>
          </Card>
        </Grid>
      </>
    );
  } else return null;
};

const memoizedNote = memo(Schedule);

export default memoizedNote;

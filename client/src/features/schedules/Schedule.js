import { Link, useNavigate } from "react-router-dom";
import { selectScheduleById, useGetSchedulesQuery } from "./schedulesApiSlice";
import { memo } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import Grid from "@mui/material/Grid";
import {
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import { Edit } from "feather-icons-react";

const CustomCardContent = () => {
  const theme = useTheme();

  return (
    <CardContent>
      <Skeleton variant="text" height={30} />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
      <Skeleton variant="text" />
    </CardContent>
  );
};

const Schedule = ({ scheduleId }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { schedule, isLoading } = useGetSchedulesQuery("schedulesList", {
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
    // const updated = new Date(schedule.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

    const handleEdit = () => navigate(`/dash/notes/${scheduleId}`);

    return (
      <>
        <Grid
          item
          key={schedule.id}
          xs={12}
          sm={6}
          md={4}
          styles={{ paddingRight: "32px" }}
        >
          <Card
            sx={{
              backgroundColor: (theme) => theme.palette.background.secondary,
              "&.MuiPaper-root": {
                backgroundImage: "none !important",
              },
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
                  fontSize: isSmallScreen ? "1.2rem" : "1.5rem",
                  fontWeight: "bold",
                }}
              >
                {schedule.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: isSmallScreen ? "0.8rem" : "1rem",
                  mb: 1,
                }}
              >
                <AttachMoneyIcon /> {schedule.funder}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: isSmallScreen ? "0.8rem" : "1rem",
                  mb: 1,
                }}
              >
                <WorkOutlineIcon /> {schedule.contractor}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: isSmallScreen ? "0.8rem" : "1rem",
                  mb: 1,
                }}
              >
                <FingerprintOutlinedIcon /> {schedule.tin}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: isSmallScreen ? "0.8rem" : "1rem",
                  mb: 1,
                }}
              >
                <PersonOutlineIcon /> {schedule.username}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: isSmallScreen ? "0.8rem" : "1rem",
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

                    "&:hover": {
                      background: "transparent",
                    },
                    [theme.breakpoints.down("sm")]: {
                      position: "relative",
                      top: 0,
                      right: 0,
                    },
                  }}
                >
                  <EditOutlinedIcon />
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

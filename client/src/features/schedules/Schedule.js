// Schedule.jsx
import React, { memo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  AttachMoney as AttachMoneyIcon,
  WorkOutline as WorkOutlineIcon,
  FingerprintOutlined as FingerprintOutlinedIcon,
  PersonOutline as PersonOutlineIcon,
  EditOutlined as EditOutlinedIcon,
} from "@mui/icons-material";

const ScheduleCard = ({ schedule, isSmallScreen }) => {
  const theme = useTheme();
  const created = new Date(schedule.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
  });
  const [searchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const size = parseInt(searchParams.get('size') || '6', 10)


  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.secondary,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s ease",
        "&:hover": {
          transform: "scale(1.03)",
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
        {[
          { icon: AttachMoneyIcon, text: schedule.funder },
          { icon: WorkOutlineIcon, text: schedule.contractor },
          { icon: FingerprintOutlinedIcon, text: schedule.tin },
          { icon: PersonOutlineIcon, text: schedule.user.username },
        ].map(({ icon: Icon, text }, index) => (
          <Typography
            key={index}
            variant="body1"
            sx={{
              fontSize: isSmallScreen ? "0.8rem" : "1rem",
              mb: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon sx={{ color: "#475BE8", mr: 1 }} />
            {text}
          </Typography>
        ))}
        <Typography
          variant="body2"
          sx={{
            fontSize: isSmallScreen ? "0.7rem" : "0.9rem",
          }}
        >
          Created: {created}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: "space-between", padding: "16px" }}>
        <div>
          <Button
            component={Link}
            to={`/dash/schedules/${schedule.id}?page=${page}&size=${size}`}
            size="small"
            variant="outlined"
            sx={{ mr: 1 }}
          >
            <Typography color="text.primary">Schedules</Typography>
          </Button>
          <Button
            component={Link}
            to={`/dash/schedules/${schedule.id}/application?page=${page}&size=${size}`}
            size="small"
            variant="outlined"
          >
            <Typography color="text.primary">Applications</Typography>
          </Button>
        </div>
        <Button
          component={Link}
          to={`/dash/schedules/edit/${schedule.id}`}
          size="small"
          sx={{
            minWidth: "auto",
            padding: "4px",
          }}
        >
          <EditOutlinedIcon sx={{ color: "text.primary" }} />
        </Button>
      </CardActions>
    </Card>
  );
};

const Schedule = ({ schedule }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!schedule) return null;

  return (
    <Grid item xs={12} sm={6} md={4}>
      <ScheduleCard schedule={schedule} isSmallScreen={isSmallScreen} />
    </Grid>
  );
};

export default memo(Schedule);

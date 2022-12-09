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

const Schedule = ({ scheduleId }) => {
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
        <Grid item key={schedule.id} xs={12} sm={6} md={4}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {schedule.title}
              </Typography>
              <Typography> Funded By {schedule.funder}</Typography>
              <Typography> {schedule.contractor}</Typography>
              <Typography>By {schedule.username}</Typography>
              <Typography>{created}</Typography>
            </CardContent>
            <CardActions>
              <Link to={`/dash/schedules/${schedule.id}`}>
                <Button size="small">View Schedule</Button>
              </Link>
              <Link to={`/dash/schedules/${schedule.id}/application`}>
                <Button size="small">View Applications</Button>
              </Link>
              <Link to={`/dash/schedules/edit/${schedule.id}`}>
                <Button size="small">Edit</Button>
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

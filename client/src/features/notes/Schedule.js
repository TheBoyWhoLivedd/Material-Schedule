import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { selectScheduleById, useGetSchedulesQuery } from "./schedulesApiSlice";
import { memo } from "react";
import { useSelector } from "react-redux";

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
            <article>
                <h2>{schedule.title}</h2>

                <h3>{schedule.description}</h3>

                <p className="postCredit">{schedule.username}</p>

                <Link to={`/dash/schedules/${schedule.id}`}>View</Link>
            </article>
        );
    } else return null;
};

const memoizedNote = memo(Schedule);

export default memoizedNote;

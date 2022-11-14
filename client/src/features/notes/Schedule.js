import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetSchedulesQuery } from "./schedulesApiSlice";
import { memo } from "react";

const Note = ({ noteId }) => {
    const { note } = useGetSchedulesQuery("schedulesList", {
        selectFromResult: ({ data }) => ({
            note: data?.entities[noteId],
        }),
    });

    const navigate = useNavigate();

    if (note) {
        const created = new Date(note.createdAt).toLocaleString("en-US", {
            day: "numeric",
            month: "long",
        });
        console.log(note);
        // const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

        const handleEdit = () => navigate(`/dash/notes/${noteId}`);

        return (
            <article>
                <h2>{note.title}</h2>
                
                <h3>{note.description}</h3>
                
                <p className="postCredit">{note.username}</p>

            </article>
        );
    } else return null;
};
 
const memoizedNote = memo(Note);

export default memoizedNote;

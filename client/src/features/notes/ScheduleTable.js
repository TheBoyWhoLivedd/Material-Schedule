import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetNotesQuery } from "./notesApiSlice";
import { memo } from "react";

const ScheduleTable = ({ child }) => {
    return (
        <>
            <tr className="table__row">
                <td className="table__cell note__status"></td>
                <td className="table__cell note__title">
                    {child.materialName}
                </td>
                <td className="table__cell note__updated">
                    {child.itemDescription}
                </td>
                <td className="table__cell note__created">
                    {child.computedValue}
                </td>
                {/* <td className="table__cell note__username">{note.username}</td> */}

                <td className="table__cell">
                    <button className="icon-button table__button" onClick="">
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </td>
            </tr>
        </>
    );
};

const memoizedScheduleTable = memo(ScheduleTable);

export default memoizedScheduleTable;

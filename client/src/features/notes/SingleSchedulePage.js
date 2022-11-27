import { useGetNotesQuery } from "./notesApiSlice";
import ScheduleTable from "./ScheduleTable";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { selectScheduleById, useGetSchedulesQuery } from "./schedulesApiSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const SingleSchedulePage = () => {
    useTitle("techNotes: Single Schedule Page");

    const { id } = useParams();

    console.log(id);

    const { schedule } = useGetSchedulesQuery("schedulesList", {
        selectFromResult: ({ data }) => ({
            schedule: data?.entities[id],
        }),
    });
    console.log(schedule);

    const { username, isManager, isAdmin } = useAuth();

    // const {
    //     data: notes,
    //     isLoading,
    //     isSuccess,
    //     isError,
    //     error,
    // } = useGetNotesQuery("notesList", {
    //     pollingInterval: 15000,
    //     refetchOnFocus: true,
    //     refetchOnMountOrArgChange: true,
    // });

    let content;

    // if (isLoading) content = <PulseLoader color={"#FFF"} />;

    // if (isError) {
    //     content = <p className="errmsg">{error?.data?.message}</p>;
    // }

    // if (isSuccess) {
    //     const { ids, entities } = notes;

    //     let filteredIds;
    //     if (isManager || isAdmin) {
    //         filteredIds = [...ids];
    //     } else {
    //         filteredIds = ids.filter(
    //             (noteId) => entities[noteId].username === username
    //         );
    //     }

    // const tableContent =
    //     ids?.length &&
    //     filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

    const tableContent = schedule?.children?.map((child) => (
        <ScheduleTable child={child} />
    ));

    content = (
        <table className="table table--notes">
            <thead className="table__thead">
                <tr>
                    <th scope="col" className="table__th note__status">
                        Material Name
                    </th>
                    <th scope="col" className="table__th note__created">
                        Item Description
                    </th>
                    <th scope="col" className="table__th note__title">
                        Computed Amounts
                    </th>
                    <th scope="col" className="table__th note__edit">
                        Edit
                    </th>
                    <th scope="col" className="table__th note__edit">
                    
                    </th>
                </tr>
            </thead>
            <tbody>{tableContent}</tbody>
        </table>
    );
    // }

    return content;
};
export default SingleSchedulePage;

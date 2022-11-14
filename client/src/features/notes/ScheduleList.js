import { useGetSchedulesQuery } from "./schedulesApiSlice";

import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import Schedule from "./Schedule";

const NotesList = () => {
    useTitle("Deemed VAT: Schedule List");

    const { username, isManager, isAdmin } = useAuth();

    const {
        data: notes,
        isLoading,
        isSuccess,
        isError,
        error,
    } = useGetSchedulesQuery("notesList", {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    });

    let content;

    if (isLoading) content = <PulseLoader color={"#FFF"} />;

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>;
    }

    if (isSuccess) {
        const { ids, entities } = notes;

        let filteredIds;
        if (isManager || isAdmin) {
            filteredIds = [...ids];
        } else {
            filteredIds = ids.filter(
                (noteId) => entities[noteId].username === username
            );
        }

        const ScheduleContent =
            ids?.length &&
            filteredIds.map((noteId) => (
                <Schedule key={noteId} noteId={noteId} />
            ));

        return ScheduleContent;
    }
};
export default NotesList;

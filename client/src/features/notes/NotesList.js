import { useGetNotesQuery } from "./notesApiSlice";
import Note from "./Note";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const NotesList = () => {
  useTitle("techNotes: Notes List");

  const { username, isManager, isAdmin } = useAuth();

  const {
    data: notes,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetNotesQuery("notesList", {
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

    const tableContent =
      ids?.length &&
      filteredIds.map((noteId) => <Note key={noteId} noteId={noteId} />);

    content = (
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Notes</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <table className="table table--notes">
                  <thead className="table__thead">
                    <tr>
                      <th scope="col" className="table__th note__status">
                        Username
                      </th>
                      <th scope="col" className="table__th note__created">
                        Created
                      </th>
                      <th scope="col" className="table__th note__updated">
                        Updated
                      </th>
                      <th scope="col" className="table__th note__title">
                        Title
                      </th>
                      <th scope="col" className="table__th note__username">
                        Owner
                      </th>
                      <th scope="col" className="table__th note__edit">
                        Edit
                      </th>
                    </tr>
                  </thead>
                  <tbody>{tableContent}</tbody>
                </table>
              </div>
            </div>
            {/* end row */}
          </div>
        </div>
      </div>
    );
  }

  return content;
};
export default NotesList;

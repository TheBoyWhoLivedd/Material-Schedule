import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";

const UsersList = () => {
  useTitle("techNotes: Users List");

  const {
    data: users,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUsersQuery("usersList", {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = users;

    const tableContent =
      ids?.length && ids.map((userId) => <User key={userId} userId={userId} />);

    content = (
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Users</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
                <table className="table table--users">
                  <thead className="table__thead">
                    <tr>
                      <th scope="col" className="table__th user__username">
                        Username
                      </th>
                      <th scope="col" className="table__th user__roles">
                        Roles
                      </th>
                      <th scope="col" className="table__th user__edit">
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
export default UsersList;

import { useParams } from "react-router-dom";
import EditScheduleForm from "../schedules/EditScheduleForm";
import { useGetSchedulesQuery } from "./schedulesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";
import useTitle from "../../hooks/useTitle";

const EditSchedule = () => {
  useTitle("Deemed VAT: Edit Schedule");

  const { id } = useParams();

  const { username, isManager, isAdmin } = useAuth();

  const { schedule } = useGetSchedulesQuery("notesList", {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });

  const { users } = useGetUsersQuery("usersList", {
    selectFromResult: ({ data }) => ({
      users: data?.ids.map((id) => data?.entities[id]),
    }),
  });

  if (!schedule || !users?.length) return <PulseLoader color={"#FFF"} />;

  if (!isManager && !isAdmin) {
    if (schedule.username !== username) {
      return <p className="errmsg">No access</p>;
    }
  }

  const content = <EditScheduleForm schedule={schedule} users={users} />;

  return content;
};
export default EditSchedule;

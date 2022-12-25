import { useGetSchedulesQuery } from "./schedulesApiSlice";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import Schedule from "./Schedule";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const ScheduleList = () => {
  useTitle("Deemed VAT: Schedule List");

  const { username, isManager, isAdmin } = useAuth();

  const {
    data: schedules,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetSchedulesQuery("notesList", {
    pollingInterval: 150000000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;
  const theme = createTheme();

  if (isLoading) content = <PulseLoader color={"#FFF"} />;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = schedules;
    // console.log(schedules);

    let filteredIds;
    if (isManager || isAdmin) {
      filteredIds = [...ids];
      // console.log(filteredIds)
    } else {
      filteredIds = ids.filter(
        (scheduleId) => entities[scheduleId].username === username
      );
    }

    const ScheduleContent =
      ids?.length &&
      filteredIds.map((scheduleId) => (
        <Schedule key={scheduleId} scheduleId={scheduleId} />
      ));

    return (
      <>
        <div className="midde_cont">
          <div className="container-fluid">
            <div className="row column_title">
              <div className="col-md-12">
                <div className="page_title">
                  <h2>Projects</h2>
                </div>
              </div>
            </div>
            <div className="row column1">
              <div className="col-md-12">
                <div className="white_shd full margin_bottom_30">
                  <Grid container spacing={4}>
                    {ScheduleContent}
                  </Grid>
                </div>
              </div>
              {/* end row */}
            </div>
          </div>
        </div>
      </>
    );
  }
};
export default ScheduleList;

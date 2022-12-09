import { useEffect } from "react";
import { useGetNotesQuery } from "../notes/notesApiSlice";
import ScheduleTable from "./ScheduleTable";
import useAuth from "../../hooks/useAuth";
import useTitle from "../../hooks/useTitle";
import PulseLoader from "react-spinners/PulseLoader";
import { selectScheduleById, useGetSchedulesQuery } from "./schedulesApiSlice";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@mui/material";
import ModalComponent from "../../components/ModalComponent";
import ApplicationAddForm from "../../components/ApplicationAddForm";
import { Plus, Edit, Trash } from "feather-icons-react";
import { useDeleteMaterialMutation } from "./schedulesApiSlice";

const SingleApplicationPage = () => {
  useTitle("techNotes: Single Application Page");

  const { id } = useParams();

  console.log(id);

  const { schedule } = useGetSchedulesQuery("schedulesList", {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });
  console.log(schedule);
  const [deleteMaterial] = useDeleteMaterialMutation();

  const onDeleteMaterialClicked = async (materialId) => {
    await deleteMaterial({ id: schedule.id, _id: materialId });
  };

  let content;

  content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <ModalComponent
          openModal={
            <Button variant="outlined">
              <Plus width={20} />
              Add Application
            </Button>
          }
        >
          <ApplicationAddForm id={id} />
        </ModalComponent>
        <div style={{ marginLeft: "1rem" }}>
          <Link to={`/dash/schedules/${id}/summary`}>
            <Button variant="outlined">View Summary</Button>
          </Link>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ITEM</TableCell>
              <TableCell>Supplier</TableCell>

              <TableCell align="right">UNIT</TableCell>
              <TableCell align="right">Allowed</TableCell>
              <TableCell align="right">Rejected</TableCell>
              <TableCell align="right">Edit</TableCell>
              <TableCell align="right">Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedule?.materials?.map((child) => (
              <TableRow
                key={child._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {child.materialName}
                </TableCell>
                <TableCell component="th" scope="row">
                  {}
                </TableCell>
                <TableCell align="right">{child.unit}</TableCell>
                <TableCell component="th" scope="row" align="right">
                  {child.computedValue}
                </TableCell>

                <TableCell align="right">{child.computedValue}</TableCell>
                <TableCell align="right">
                  <ModalComponent
                    openModal={
                      <Button>
                        <Edit size={20} />
                      </Button>
                    }
                  >
                    <ApplicationAddForm formData={child} id={id} />
                  </ModalComponent>
                </TableCell>
                <TableCell align="right">
                  <Button onClick={() => onDeleteMaterialClicked(child._id)}>
                    <Trash size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  return content;
};
export default SingleApplicationPage;

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
import MaterialAddForm from "../../components/MaterialAddForm";
import { Plus, Edit, Trash } from "feather-icons-react";
import { useDeleteMaterialMutation } from "./schedulesApiSlice";

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
  const [
    deleteMaterial,
  ] = useDeleteMaterialMutation();


  const onDeleteMaterialClicked = async (materialId) => {
    await deleteMaterial({ id: schedule.id, _id: materialId });
  };


  let content;

  content = (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <ModalComponent
          openModal={
            <Button variant="outlined">
              <Plus width={20} />
              Add Materials
            </Button>
          }
        >
          <MaterialAddForm id={id} />
        </ModalComponent>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ITEM</TableCell>
              <TableCell align="right">Description</TableCell>
              <TableCell align="right">UNIT</TableCell>
              <TableCell align="right">QUANTITy</TableCell>
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
                <TableCell align="right">{child.materialDescription}</TableCell>
                <TableCell align="right">{child.unit}</TableCell>
                <TableCell align="right">{child.computedValue}</TableCell>
                <TableCell align="right">
                  <ModalComponent
                    openModal={
                      <Button>
                        <Edit size={20} />
                      </Button>
                    }
                  >
                    <MaterialAddForm formData={child} id={id} schedule={schedule} />
                  </ModalComponent>
                </TableCell>
                <TableCell align="right">
                  <Button onClick={()=>onDeleteMaterialClicked(child._id)}>
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
export default SingleSchedulePage;

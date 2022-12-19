import { useEffect, useState } from "react";
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
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@material-ui/core";

const SingleApplicationPage = () => {
  useTitle("techNotes: Single Application Page");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);
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
    <div>
      {schedule?.application?.map((application) => (
        <ExpansionPanel key={application._id}>
          <ExpansionPanelSummary>{application.date}</ExpansionPanelSummary>
          <Button variant="contained" color="primary" onClick={""}>Print</Button>
          <ExpansionPanelDetails>
            <List>
              {application.items.map((item) => (
                <ListItem key={item._id}>
                  <ListItemText
                    primary={item.item}
                    secondary={`Supplier: ${item.supplier} | Requested: ${item.amountRequested} | Allowed: ${item.amountAllowed}`}
                  />
                  <ListItemSecondaryAction>
                    <Button variant="contained" color="primary" onClick={""}>
                      <Edit />
                    </Button>
                    <Button variant="contained" color="secondary" onClick={""}>
                      <Trash />
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </div>
  );

  return content;
};
export default SingleApplicationPage;

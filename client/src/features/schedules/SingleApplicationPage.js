import { useEffect, useState, useRef } from "react";
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
import { Button, TextField } from "@mui/material";
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
  Popper,
  Fade,
  ClickAwayListener,
} from "@material-ui/core";

const MyPopper = ({ isOpen, clickAwayHandler, children, anchorEl }) => (
  <ClickAwayListener onClickAway={clickAwayHandler}>
    <Popper open={isOpen} anchorEl={anchorEl}>
      <Paper>{children}</Paper>
    </Popper>
  </ClickAwayListener>
);

const SingleApplicationPage = () => {
  useTitle("techNotes: Single Application Page");

  const { id } = useParams();

  const [editItem, setEditItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const clickAwayHandler = (event) => {
    // Check if the event target has the "edit-button" class name
    if (event.target.className.includes("edit-button")) {
      return;
    }

    setIsPopperOpen(false);
  };
  const openPopper = (event, item) => {
    setIsPopperOpen(true);
    setEditItem(item);
    setAnchorEl(event.currentTarget);
  };
  console.log(id);
  // State variables for the popper

  // Function to update the item
  const updateItem = () => {
    // Update the item here
    // Use the editItem state variable to get the values of the item to be edited
    // and the schedule.id to update the item in the correct schedule
  };

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
          <Button variant="contained" color="primary" onClick={""}>
            Print
          </Button>
          

          <ExpansionPanelDetails style={{  display: "block" }}>
            <List>
              {application.items.map((item) => (
                <ListItem key={item._id} style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                  <ListItemText
                    primary={item.item}
                    secondary={`Supplier: ${item.supplier} | Requested: ${item.amountRequested} | Allowed: ${item.amountAllowed}`}
                  />
                  <ListItemSecondaryAction>
                    {/* Add a button to open the popper when clicked */}
                    <div >
                    <Button
                      className="edit-button"
                      variant="contained"
                      color="primary"
                      onClick={(e) => openPopper(e, item)}
                    >
                      <Edit />
                    </Button>
                    <Button variant="contained" color="secondary" onClick={""}>
                      <Trash />
                    </Button>
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </ExpansionPanelDetails>
          
        </ExpansionPanel>
      ))}
      {/* Render the popper component */}
      {isPopperOpen && (
        <MyPopper
          isOpen={isPopperOpen}
          clickAwayHandler={clickAwayHandler}
          anchorEl={anchorEl}
        >
          <form>
            <TextField
              label="Item"
              value={editItem.item}
              onChange={(e) =>
                setEditItem({ ...editItem, item: e.target.value })
              }
            />
            <TextField
              label="Supplier"
              value={editItem.supplier}
              onChange={(e) =>
                setEditItem({ ...editItem, supplier: e.target.value })
              }
            />
            <TextField
              label="Amount Requested"
              value={editItem.amountRequested}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  amountRequested: e.target.value,
                })
              }
            />
            <TextField
              label="Amount Allowed"
              value={editItem.amountAllowed}
              onChange={(e) =>
                setEditItem({ ...editItem, amountAllowed: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => updateItem(editItem)}
            >
              Update
            </Button>
          </form>
        </MyPopper>
      )}
    </div>
  );
  return content;
};
export default SingleApplicationPage;

import { useState } from "react";
import useTitle from "../../hooks/useTitle";
import { useGetSchedulesQuery } from "./schedulesApiSlice";
import { useParams, Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
// import { Button, TextField } from "@mui/material";
import { Plus, Edit, Trash } from "feather-icons-react";
import {
  useDeleteMaterialMutation,
  useUpdateApplicationItemMutation,
  useDeleteApplicationItemMutation,
  useDeleteApplicationMutation,
} from "./schedulesApiSlice";
import ModalComponent from "../../components/ModalComponent";
import ModalSecondary from "../../components/ModalSecondary";
import ApplicationAddForm from "../../components/ApplicationAddForm";
import ApplicationEditForm from "../../components/ApplicationAddForm/ApplicationEditForm";
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Popper,
  ClickAwayListener,
  Button,
  TextField,
} from "@material-ui/core";
import { applicationItems } from "../../assets/data";
import { Autocomplete } from "@mui/material";
import DeleteModal from "../../components/DeleteModal";
import moment from "moment";

// Custom Popper component that also handles closing when user clicks away
const MyPopper = ({ isOpen, clickAwayHandler, children, anchorEl }) => (
  <ClickAwayListener onClickAway={clickAwayHandler}>
    <Popper open={isOpen} anchorEl={anchorEl}>
      <Paper>{children}</Paper>
    </Popper>
  </ClickAwayListener>
);

const SingleApplicationPage = () => {
  useTitle("techNotes: Single Application Page");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { id } = useParams();

  // State for the edit form
  const [editItem, setEditItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [appId, setAppId] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const clickAwayHandler = (event) => {
    // Check if the event target has the "edit-button" class name
    if (event.target.className.includes("edit-button")) {
      return;
    }

    setIsPopperOpen(false);
  };

  // Handles the click event for the edit button
  const handleEditClick = (event, item, applId) => {
    setIsPopperOpen(true);
    setEditItem(item);
    setAnchorEl(event.currentTarget);
    setAppId(applId);
    setItemId(item._id);
    console.log(appId, itemId);
  };

  // RTK Query mutations for updating and deleting items
  const [updateApplicationItem, { isSuccess }] =
    useUpdateApplicationItemMutation();
  const [deleteApplicationItem, { isSuccess: isDelSuccess }] =
    useDeleteApplicationItemMutation();
  const [deleteApplication, { isSuccess: isDelAppSuccess }] =
    useDeleteApplicationMutation();

  // Function to update the individual item
  const updateItem = async () => {
    await updateApplicationItem({
      id: id,
      appId: appId,
      itemId: itemId,
      editItem: editItem,
    });
  };
  // Function to delete the item
  const onDeleteitemClicked = async (applId, itemlId) => {
    console.log(appId, itemId);
    await deleteApplicationItem({ id: id, appId: applId, itemId: itemlId });
  };
  // Function to delete the whole Application
  const onDeleteApplicationClicked = async (applId) => {
    console.log(appId);
    await deleteApplication({ id: id, appId: applId });
  };

  // Query to get the schedule from the API
  const { schedule } = useGetSchedulesQuery("schedulesList", {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });
  console.log(schedule);

  // Handles change events for the edit individual item form
  const handleOnItemSelect = (e, name) => {
    setEditItem({ ...editItem, [name]: e.target.value });
    console.log(editItem);
  };

  const [deleteMaterial] = useDeleteMaterialMutation();

  // Handling Secondary Modal
  const [open1, setOpen1] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);

  const expandModel = (child) => {
    setSelectedChild(child);
    setOpen1(true);
  };
  const closeModal = () => {
    setSelectedChild(null);
    setOpen1(false);
  };

  let content;
  content = (
      <div className="midde_cont">
        <div className="container-fluid">
          <div className="row column_title">
            <div className="col-md-12">
              <div className="page_title">
                <h2>Application</h2>
              </div>
            </div>
          </div>
          <div className="row column1">
            <div className="col-md-12">
              <div className="white_shd full margin_bottom_30">
              <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "1rem",
        }}
      >
        <ModalComponent
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          openModal={
            <Button variant="outlined">
              <Plus width={20} />
              Add Application
            </Button>
          }
        >
          <ApplicationAddForm id={id} handleClose={handleClose} />
        </ModalComponent>
        <div style={{ marginLeft: "1rem" }}>
          <Link to={`/dash/schedules/${id}/summary`}>
            <Button variant="outlined">View Summary</Button>
          </Link>
        </div>
      </div>
      {schedule?.application?.map((application) => (
        <ExpansionPanel key={application._id}>
          <ExpansionPanelSummary>
            {moment(application.date).format("MMMM DD, YYYY")}
          </ExpansionPanelSummary>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {" "}
            <Button
              variant="outlined"
              color="primary"
              onClick={""}
              style={{ marginLeft: "2rem" }}
            >
              Print
            </Button>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "2rem",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => expandModel(application)}
                style={{ marginRight: "8px" }}
              >
                <Plus width={20} />
                Add
              </Button>
              <DeleteModal
                handleDelete={(e) =>
                  onDeleteApplicationClicked(application._id)
                }
              />
            </div>
          </div>

          <ExpansionPanelDetails style={{ display: "block" }}>
            <List>
              {application.items.map((item) => (
                <ListItem
                  key={item._id}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <ListItemText
                    primary={item.item}
                    secondary={`Supplier: ${item.supplier} | Requested: ${item.amountRequested} | Allowed: ${item.amountAllowed}`}
                  />
                  <ListItemSecondaryAction>
                    {/* Add a button to open the popper when clicked */}
                    <div
                      style={{
                        display: "flex",
                      }}
                    >
                      <Button
                        className="edit-button"
                        variant="outlined"
                        color="primary"
                        onClick={(e) =>
                          handleEditClick(e, item, application._id)
                        }
                        style={{ border: "none" }}
                      >
                        <Edit />
                      </Button>
                      {/* <Button
                        variant="contained"
                        color="secondary"
                        onClick={(e) =>
                          onDeleteitemClicked(application._id, item._id)
                        }
                      >
                        <Trash />
                      </Button> */}
                      <DeleteModal
                        handleDelete={(e) =>
                          onDeleteitemClicked(application._id, item._id)
                        }
                        element="icon"
                      />
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
      <ModalSecondary open={open1} handleClose={closeModal}>
        <ApplicationEditForm
          id={id}
          handleClose={handleClose}
          content={selectedChild}
        />
      </ModalSecondary>
      {/* Render the popper component */}
      {isPopperOpen && (
        <MyPopper
          isOpen={isPopperOpen}
          clickAwayHandler={clickAwayHandler}
          anchorEl={anchorEl}
        >
          <form style={{ display: "flex" }}>
            <TextField
              label="Supplier"
              value={editItem.supplier}
              onChange={(e) =>
                setEditItem({ ...editItem, supplier: e.target.value })
              }
            />
            <Autocomplete
              id="items_id"
              options={applicationItems.map((option) => option)}
              name="item"
              placeholder="Choose Element"
              onSelect={(e) => handleOnItemSelect(e, "item")}
              value={editItem.item}
              style={{ width: 200 }}
              required
              renderInput={(params) => (
                <TextField {...params} label="Item" required />
              )}
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
            </div>
            {/* end row */}
          </div>
        </div>
      </div>
  );
  return content;
};
export default SingleApplicationPage;

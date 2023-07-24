import { useState, useEffect, useCallback, useMemo } from "react";
import useTitle from "../../hooks/useTitle";
import { useGetSchedulesQuery } from "./schedulesApiSlice";
import { useParams, Link } from "react-router-dom";
import Paper from "@mui/material/Paper";
// import { Button, TextField } from "@mui/material";
import { Plus, Edit, Trash } from "feather-icons-react";
import {
  useUpdateApplicationItemMutation,
  useDeleteApplicationItemMutation,
  useDeleteApplicationMutation,
  useDownloadApplicationMutation,
} from "./schedulesApiSlice";
import ModalComponent from "../../components/ModalComponent";
import ModalSecondary from "../../components/ModalSecondary";
import ApplicationAddForm from "../../components/ApplicationAddForm";
import ApplicationEditForm from "../../components/ApplicationAddForm/ApplicationEditForm";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Popper,
  ClickAwayListener,
  Button,
  TextField,
  Snackbar,
  Typography,
} from "@mui/material";
import { applicationItems } from "../../assets/data";
import { Autocomplete } from "@mui/material";
import DeleteModal from "../../components/DeleteModal";
import moment from "moment";
import FileSaver from "file-saver";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";

// Custom Popper component that also handles closing when user clicks away
const MyPopper = ({ isOpen, clickAwayHandler, children, anchorEl }) => (
  <ClickAwayListener onClickAway={clickAwayHandler}>
    <Popper open={isOpen} anchorEl={anchorEl}>
      <Paper>{children}</Paper>
    </Popper>
  </ClickAwayListener>
);

const SingleApplicationPage = () => {
  useTitle("Deemed VAT: Single Application Page");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //State for the snackbar
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const openSnackbarWithMessage = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

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

  // RTK Query mutations for updating deleting and downloading applications or items
  const [updateApplicationItem, { isSuccess, isLoading }] =
    useUpdateApplicationItemMutation();
  const [
    deleteApplicationItem,
    { isSuccess: isDelSuccess, isLoading: isDelLoading },
  ] = useDeleteApplicationItemMutation();
  const [deleteApplication, { isSuccess: isDelAppSuccess }] =
    useDeleteApplicationMutation();
  const [downloadApplication] = useDownloadApplicationMutation();

  // Function to update the individual item
  const updateItem = async () => {
    await updateApplicationItem({
      id: id,
      appId: appId,
      itemId: itemId,
      editItem: editItem,
    }).then(() => {
      setIsPopperOpen(false);
    });
  };

  // Function to delete the item
  const [toBeDeleted, setToBeDeleted] = useState({ appId: null, itemId: null });
  const [deleteApplicationModalOpen, setDeleteApplicationModalOpen] =
    useState(false);
  const [deleteApplicationItemModalOpen, setDeleteApplicationItemModalOpen] =
    useState(false);
  const handleDeleteApplicationItem = (applId, itemId) => {
    setToBeDeleted({ appId: applId, itemId });
    setDeleteApplicationItemModalOpen(true);
  };

  // Function to delete the whole Application
  const [deleting, setIsDeleting] = useState(false);

  const handleDeleteApplication = (appId) => {
    setToBeDeleted({ appId: appId, itemId: null });
    setDeleteApplicationModalOpen(true);
  };

  const handleConfirmDeleteItem = async () => {
    if (toBeDeleted.itemId) {
      try {
        setIsDeleting(true);
        const response = await deleteApplicationItem({
          id: id,
          appId: toBeDeleted.appId,
          itemId: toBeDeleted.itemId,
        });
        if (response.data.isError) {
          console.log(`Error: ${response.message}`);
          openSnackbarWithMessage(`Error: ${response.data.message}`);
        } else {
          openSnackbarWithMessage(`Item Deleted`);
        }
      } catch (error) {
        openSnackbarWithMessage(`Error: ${error.message}`);
      } finally {
        setToBeDeleted({ appId: null, itemId: null });
        setDeleteApplicationItemModalOpen(false);
        setIsDeleting(false);
      }
    }
  };

  const handleConfirmDeleteApplication = async () => {
    if (!toBeDeleted.itemId) {
      try {
        setIsDeleting(true);
        const response = await deleteApplication({
          id: id,
          appId: toBeDeleted.appId,
        });
        if (response.data.isError) {
          console.log(`Error: ${response.message}`);
          openSnackbarWithMessage(`Error: ${response.data.message}`);
        } else {
          openSnackbarWithMessage(`Application Deleted`);
        }
      } catch (error) {
        openSnackbarWithMessage(`Error: ${error.message}`);
      } finally {
        setToBeDeleted({ appId: null, itemId: null });
        setDeleteApplicationModalOpen(false);
        setIsDeleting(false);
      }
    }
  };

  // Delete application modal
  const deleteApplicationModal = (
    <DeleteModal
      deleting={deleting}
      handleOpenDeleteModal={() => setDeleteApplicationModalOpen(true)}
      handleCloseDeleteModal={() => setDeleteApplicationModalOpen(false)}
      openDeleteModal={deleteApplicationModalOpen}
      handleDelete={handleConfirmDeleteApplication}
    />
  );

  // Delete application item modal
  const deleteApplicationItemModal = (
    <DeleteModal
      deleting={deleting}
      handleOpenDeleteModal={() => setDeleteApplicationItemModalOpen(true)}
      handleCloseDeleteModal={() => setDeleteApplicationItemModalOpen(false)}
      openDeleteModal={deleteApplicationItemModalOpen}
      handleDelete={handleConfirmDeleteItem}
      element="icon"
    />
  );

  //function to download application.
  const accessToken = useSelector(selectCurrentToken);
  const onDownloadApplicatonClicked = async (applId) => {
    console.log(`Schedule id is ${id} and Application id is ${applId}`);
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3500"
        : "https://server-materialschedule.hitajitech.site";
    try {
      const response = await fetch(
        `${baseUrl}/schedules/${id}/applications/${applId}/download`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          method: "POST",
        }
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "applications.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  // Query to get the schedule from the API
  const { schedule } = useGetSchedulesQuery("schedulesList", {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });
  console.log(schedule);

  // Handles change events for the edit individual item form
  const handleOnItemSelect = useCallback(
    (e, name) => {
      setEditItem({ ...editItem, [name]: e.target.value });
      console.log(editItem);
    },
    [editItem]
  );
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
  const memoizedContent = useMemo(() => {
    return (
      <div>
        <Typography
          sx={{
            marginRight: "1rem",
            color: (theme) => theme.palette.text.primary,
          }}
        >
          Applications List. Adding an item to the application reduces it by a
          similar amount in the Material Schedule. View Summary shows the
          aggregation of materials applieid for.
        </Typography>
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
            <ApplicationAddForm
              id={id}
              handleClose={handleClose}
              schedule={schedule}
              openSnackbarWithMessage={openSnackbarWithMessage}
            />
          </ModalComponent>
          <div style={{ marginLeft: "1rem" }}>
            <Link to={`/dash/schedules/${id}/requested`}>
              <Button variant="outlined">View Summary</Button>
            </Link>
          </div>
        </div>
        {schedule?.application?.map((application) => (
          <Accordion key={application._id}>
            <AccordionSummary>
              {moment(application.date).format("MMMM DD, YYYY")}
            </AccordionSummary>
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
                onClick={() => {
                  onDownloadApplicatonClicked(application._id);
                }}
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
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteApplication(application._id)}
                  disabled={deleting}
                >
                  <Trash width={20} />
                  Delete
                </Button>
              </div>
            </div>

            <AccordionDetails style={{ display: "block" }}>
              <List>
                {application.items.map((item) => {
                  // Find the corresponding item in the balanceAllowable array
                  const balanceItem = schedule.balanceAllowable.find(
                    (bItem) => bItem._id === item.item
                  );

                  return (
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
                        secondary={`Supplier: ${item.supplier} | Requested: ${
                          item.amountRequested
                        } | Balance Allowable: ${
                          balanceItem ? balanceItem.Value : ""
                        }`}
                      />
                      <ListItemSecondaryAction>
                        {/* Add a button to open the popper when clicked */}
                        <div className="button-container">
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
                          <Button
                            className="edit-button"
                            variant="outlined"
                            color="secondary"
                            disabled={deleting}
                            onClick={(e) =>
                              handleDeleteApplicationItem(
                                application._id,
                                item._id
                              )
                            }
                            style={{ border: "none" }}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
        <div
          style={{
            display: "none",
          }}
        >
          {deleteApplicationModal}
          {deleteApplicationItemModal}
        </div>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={openSnackbar}
          message={snackbarMessage}
          autoHideDuration={3000} // closes after 3 seconds
          onClose={closeSnackbar}
          style={{
            width: "500px",
            color: "white !important",
          }}
        />
        <ModalSecondary open={open1} handleClose={closeModal}>
          <ApplicationEditForm
            id={id}
            handleClose={closeModal}
            content={selectedChild}
            openSnackbarWithMessage={openSnackbarWithMessage}
            schedule={schedule}
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
                style={{ flex: 2 }}
              />
              <Autocomplete
                id="items_id"
                options={applicationItems.map((option) => option)}
                name="item"
                placeholder="Choose Element"
                onSelect={(e) => handleOnItemSelect(e, "item")}
                value={editItem.item}
                style={{ flex: 1.25 }}
                required
                className="autocomplete"
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
                style={{ flex: 0.5 }}
              />

              {/* <TextField
              label="Amount Requested"
              value={editItem.amountRequested}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  amountRequested: e.target.value,
                })
              }
              style={{ flex: 0.5 }}
            /> */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => updateItem(editItem)}
                style={{ flex: 0.35 }}
              >
                {isLoading ? "Updating..." : "Update"}
              </Button>
            </form>
            <style>
              {`
        @media screen and (max-width: 600px) {
          form {
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap:6px
            
          }
          .autocomplete {
            width:100%
          }
        }
      `}
            </style>
          </MyPopper>
        )}
      </div>
    );
  });

  return memoizedContent;
};
export default SingleApplicationPage;

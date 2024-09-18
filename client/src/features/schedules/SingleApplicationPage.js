import { useState, useCallback, useMemo } from "react";
import useTitle from "../../hooks/useTitle";
import { useGetSchedulesQuery } from "./schedulesApiSlice";
import { useParams, Link, useSearchParams } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { Plus, Edit, Trash } from "feather-icons-react";
import {
  useUpdateApplicationItemMutation,
  useDeleteApplicationItemMutation,
  useDeleteApplicationMutation,
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
import { useSelector } from "react-redux";
import { selectCurrentToken } from "../auth/authSlice";
import useSnackbar from "../../hooks/useSnackbar";
import useDeleteModal from "../../hooks/useDeleteModal";

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

  // State for the edit form
  const [open, setOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [appId, setAppId] = useState(null);
  const [itemId, setItemId] = useState(null);
  const [isPopperOpen, setIsPopperOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [deleting, setIsDeleting] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState({ appId: null, itemId: null });

  const { id } = useParams();
  const accessToken = useSelector(selectCurrentToken);

  // RTK Query mutations for updating deleting and downloading applications or items
  const [updateApplicationItem, { isLoading }] =
    useUpdateApplicationItemMutation();
  const [deleteApplicationItem] = useDeleteApplicationItemMutation();
  const [deleteApplication] = useDeleteApplicationMutation();

  // Custom hooks
  const {
    openSnackbar,
    snackbarMessage,
    openSnackbarWithMessage,
    closeSnackbar,
  } = useSnackbar();

  const {
    deleteApplicationModalOpen,
    deleteApplicationItemModalOpen,
    handleOpenDeleteApplicationModal,
    handleCloseDeleteApplicationModal,
    handleOpenDeleteApplicationItemModal,
    handleCloseDeleteApplicationItemModal,
  } = useDeleteModal();

  //Helper Functions
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const clickAwayHandler = (event) => {
    // Check if the event target has the "edit-button" class name
    if (event.target.className.includes("edit-button")) {
      return;
    }

    setIsPopperOpen(false);
  };

  // Handles the click event for the edit button
  const handleEditClick = useCallback(
    (event, item, applId) => {
      setIsPopperOpen(true);
      setEditItem(item);
      setAnchorEl(event.currentTarget);
      setAppId(applId);
      setItemId(item._id);
      console.log(appId, itemId);
    },
    [
      setIsPopperOpen,
      setEditItem,
      setAnchorEl,
      setAppId,
      setItemId,
      appId,
      itemId,
    ]
  );

  // Function to update the individual item
  const updateItem = useCallback(async () => {
    await updateApplicationItem({
      id: id,
      appId: appId,
      itemId: itemId,
      editItem: editItem,
    }).then(() => {
      setIsPopperOpen(false);
    });
  }, [id, appId, itemId, editItem, updateApplicationItem, setIsPopperOpen]);

  // Handles change events for the edit individual item form
  const handleOnItemSelect = useCallback(
    (e, name) => {
      setEditItem({ ...editItem, [name]: e.target.value });
      console.log(editItem);
    },
    [editItem]
  );

  const expandModel = (child) => {
    setSelectedChild(child);
    setOpen1(true);
  };
  const closeModal = () => {
    setSelectedChild(null);
    setOpen1(false);
  };

  // Function to delete the item
  const handleDeleteApplicationItem = useCallback(
    (applId, itemId) => {
      setToBeDeleted({ appId: applId, itemId });
      handleOpenDeleteApplicationItemModal();
    },
    [setToBeDeleted, handleOpenDeleteApplicationItemModal]
  );

  // Function to delete the whole Application
  const handleDeleteApplication = useCallback(
    (appId) => {
      setToBeDeleted({ appId: appId, itemId: null });
      handleOpenDeleteApplicationModal();
    },
    [setToBeDeleted, handleOpenDeleteApplicationModal]
  );

  const handleConfirmDeleteItem = useCallback(async () => {
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
        handleCloseDeleteApplicationItemModal();
        setIsDeleting(false);
      }
    }
  }, [
    id,
    toBeDeleted,
    openSnackbarWithMessage,
    handleCloseDeleteApplicationItemModal,
    deleteApplicationItem,
  ]);

  const handleConfirmDeleteApplication = useCallback(async () => {
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
        handleCloseDeleteApplicationModal();
        setIsDeleting(false);
      }
    }
  }, [
    id,
    toBeDeleted,
    openSnackbarWithMessage,
    handleCloseDeleteApplicationModal,
    deleteApplication,
  ]);

  // Delete application modal
  const deleteApplicationModal = useMemo(
    () => (
      <DeleteModal
        deleting={deleting}
        handleOpenDeleteModal={handleOpenDeleteApplicationModal}
        handleCloseDeleteModal={handleCloseDeleteApplicationModal}
        openDeleteModal={deleteApplicationModalOpen}
        handleDelete={handleConfirmDeleteApplication}
      />
    ),
    [
      deleting,
      handleOpenDeleteApplicationModal,
      handleCloseDeleteApplicationModal,
      deleteApplicationModalOpen,
      handleConfirmDeleteApplication,
    ]
  );

  // Delete application item modal
  const deleteApplicationItemModal = useMemo(
    () => (
      <DeleteModal
        deleting={deleting}
        handleOpenDeleteModal={handleOpenDeleteApplicationItemModal}
        handleCloseDeleteModal={handleCloseDeleteApplicationItemModal}
        openDeleteModal={deleteApplicationItemModalOpen}
        handleDelete={handleConfirmDeleteItem}
        element="icon"
      />
    ),
    [
      deleting,
      handleOpenDeleteApplicationItemModal,
      handleCloseDeleteApplicationItemModal,
      deleteApplicationItemModalOpen,
      handleConfirmDeleteItem,
    ]
  );

  //function to download application.
  const onDownloadApplicatonClicked = useCallback(
    async (applId) => {
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
    },
    [id, accessToken]
  );

  const [searchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const size = parseInt(searchParams.get('size') || '6', 10)
  const search = searchParams.get('search') || ''

  // Query to get the schedule from the API
  const { schedule } = useGetSchedulesQuery({ page, size, search }, {
    selectFromResult: ({ data }) => ({
      schedule: data?.entities[id],
    }),
  });
  console.log(schedule);

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
            <Link to={`/dash/schedules/${id}/requested?page=${page}&size=${size}&search=${search}`}>
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
  }, [
    schedule,
    deleting,
    open,
    open1,
    selectedChild,
    openSnackbar,
    snackbarMessage,
    id,
    isPopperOpen,
    anchorEl,
    editItem,
    isLoading,
    deleteApplicationItemModal,
    deleteApplicationModal,
    closeSnackbar,
    handleDeleteApplication,
    handleDeleteApplicationItem,
    handleEditClick,
    handleOnItemSelect,
    onDownloadApplicatonClicked,
    openSnackbarWithMessage,
    updateItem,
  ]);

  return memoizedContent;
};
export default SingleApplicationPage;

import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Trash } from "feather-icons-react";

const DeleteModal = ({
  handleDelete,
  element,
  isLoading,
  deleting,
  handleOpenDeleteModal,
  handleCloseDeleteModal,
  openDeleteModal,
  isSuccess,
}) => {
  // const [open, setOpen] = React.useState(false);

  // const handleClickOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <div>
      <Button onClick={handleOpenDeleteModal} color="secondary">
        {element === "icon" ? <Trash size={20} /> : "Delete"}
      </Button>
      <Dialog
        open={openDeleteModal}
        onClose={handleCloseDeleteModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteModal}
            color="primary"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            disabled={isLoading || deleting}
            onClick={handleDelete}
            color="secondary"
            autoFocus
          >
            {isLoading || deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteModal;

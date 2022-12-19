import { Box, Button, Modal } from "@mui/material";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import React from "react";

export default function ModalComponent({
  open,
  handleOpen,
  handleClose,
  openModal = false,
  children,
}) {
  // const dispatch = useDispatch();
  // const open = useSelector((state) => state.modal.open);
  // const handleOpen = () => dispatch(close());
  // const handleClose = () => dispatch(close());

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",

    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
    color: "#000",
    borderRadius: "10px",
    overflow: "scroll",
    height: "auto",
    maxHeight: "85%",
    scrollbarWidth: "none",
    "::-webkit-scrollbar": {
      width: "8px",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
      },
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: "gray",
      borderRadius: "10px",
      "&:hover": {
        backgroundColor: "darkgray",
      },
    },
    "::-webkit-scrollbar-button": {
      display: "none",
    },
  };

  const styles = {
    scrollbarWidth: "none",
  };
  return (
    <div>
      <div onClick={handleOpen}>
        {openModal ? (
          openModal
        ) : (
          <Button onClick={handleOpen}>Open modal</Button>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={styles}
      >
        <Box sx={style}>{children}</Box>
      </Modal>
    </div>
  );
}

import { Box, Button, Modal, useTheme } from "@mui/material";
import { autoBatchEnhancer } from "@reduxjs/toolkit";
import React from "react";

export default function ModalComponent({
  open,
  handleOpen,
  handleClose,
  openModal = false,
  children,
}) {
  const theme = useTheme();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",

    transform: "translate(-50%, -50%)",
    bgcolor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
    color: theme.palette.text.primary,
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

  const mediaQueries = {
    [theme.breakpoints.down("sm")]: {
      width: "90%",
    },
    [theme.breakpoints.between("sm", "md")]: {
      width: "70%",
    },
  };

  const modalStyles = { ...style, ...mediaQueries };
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
        <Box sx={modalStyles}>{children}</Box>
      </Modal>
    </div>
  );
}

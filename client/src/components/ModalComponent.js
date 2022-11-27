import { Box, Button, Modal } from "@mui/material";
import React from "react";

export default function ModalComponent({ openModal = false, children }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
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
      >
        <Box sx={style}>{children}</Box>
      </Modal>
    </div>
  );
}

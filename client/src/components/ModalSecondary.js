import { Box, Button, Modal } from "@mui/material";
import React from "react";

export default function ModalSecondary({
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
    overflow: "hidden",
  };

  const styles = {
    overflow: "scroll",
  };
  return (
    <div>
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

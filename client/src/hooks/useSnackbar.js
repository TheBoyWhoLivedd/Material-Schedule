import { useState } from "react";

const useSnackbar = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const openSnackbarWithMessage = (message) => {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
  };

  const closeSnackbar = () => {
    setOpenSnackbar(false);
  };

  return {
    openSnackbar,
    snackbarMessage,
    openSnackbarWithMessage,
    closeSnackbar,
  };
};

export default useSnackbar;

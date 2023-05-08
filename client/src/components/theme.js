import { createTheme } from "@mui/material/styles";

const theme = ({ dark }) => {
  return createTheme({
    palette: {
      mode: dark ? "dark" : "light",
      background: {
        primary: dark ? "#111315" : "#F4F4F4",
        secondary: dark ? "#1A1D1F" : "#FCFCFC",
        // paper: dark ? "#1f1f1f" : "#ffffff",
      },
    },
  });
};
export default theme;

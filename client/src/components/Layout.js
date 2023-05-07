import { Outlet } from "react-router-dom";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { useMemo, useState } from "react";

const Layout = ({dark}) => {
 

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
        },
      }),
    [dark]
  );
  return (
    <ThemeProvider theme={darkTheme}>
      <Outlet />
    </ThemeProvider>
  );
};
export default Layout;

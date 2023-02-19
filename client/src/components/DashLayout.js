import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import { useMemo, useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";

const DashLayout = () => {
  const [dark, setDark] = useState(true);

  const customColors = {
    primary: {
      main: "#123456",
      light: "#789abc",
      dark: "#def123",
    },
    secondary: {
      main: "#fedcba",
      light: "#987654",
      dark: "#3210fe",
    },
  };

  const darkTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: dark ? "dark" : "light",
          // primary: customColors.primary,
          // secondary: customColors.secondary,
        },
      }),
    [dark]
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <div
        style={{
          display: "flex",
          paddingTop: "5rem",
          paddingLeft: "1rem",
          paddingRight: "2rem",
        }}
      >
        <DashHeader dark={dark} setDark={setDark} />

        <div className="dash-container">
          <Outlet />
        </div>
      </div>
    </ThemeProvider>
  );
};
export default DashLayout;

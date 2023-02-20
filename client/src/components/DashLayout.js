import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import { useMemo, useState } from "react";
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/material";

const DashLayout = () => {
  const [dark, setDark] = useState(true);

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
      <div
        style={{
          display: "flex",
          paddingTop: "5rem",
          paddingLeft: "1rem",
          paddingRight: "2rem",
        }}
      >
        <DashHeader dark={dark} setDark={setDark} />
        <Container maxWidth="1500px">
          <Outlet />
        </Container>

        {/* <div className="dash-container">
          <Outlet />
        </div> */}
      </div>
    </ThemeProvider>
  );
};
export default DashLayout;

import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import { Container, Box } from "@mui/material";

const DashLayout = ({ dark, setDark }) => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.primary,
        display: "flex",
        paddingTop: "5rem",
        // marginLeft: "1rem",
        paddingRight: "2rem",
        height:"100vh"
      }}
    >
      <DashHeader
        dark={dark}
        setDark={setDark}
        sx={{
          backgroundColor: (theme) => theme.palette.background.primary,
        }}
      />
      <Container maxWidth="1500px" >
        <Outlet />
      </Container>
    </Box>
  );
};
export default DashLayout;

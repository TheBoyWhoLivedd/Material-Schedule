import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import { styled } from "@mui/material/styles";
import {
  Box,
  Toolbar,
  CssBaseline,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { Brightness4, Brightness7, Home, Menu } from "@mui/icons-material";
import { useState } from "react";
import SideList from "./SideList";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DashHeader = ({ dark, setDark }) => {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const { isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const errClass = isError ? "errmsg" : "offscreen";
  const content = (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.secondary,
      }}
    >
      <Box
        sx={{
          display: "flex",
          backgroundColor: (theme) => theme.palette.background.secondary,
        }}
      >
        <AppBar
          position="fixed"
          open={open}
          sx={{
            backgroundColor: (theme) => theme.palette.background.secondary,
            boxShadow: "none",
            backgroundImage: "none",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <Menu />
            </IconButton>
            <Tooltip title="Go back to home page">
              <IconButton sx={{ mr: 1 }} onClick={() => navigate("/dash")}>
                <Home />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton onClick={() => setDark(!dark)}>
              {dark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Toolbar>
          <p className={errClass}>{error?.data?.message}</p>
        </AppBar>
        <SideList {...{ open, setOpen, sendLogout }} />
      </Box>
    </Box>
  );

  return content;
};
export default DashHeader;

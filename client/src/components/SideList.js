import {
  ChevronLeft,
  Dashboard,
  Logout,
  PeopleAlt,
  ListAltOutlined,
  PostAddOutlined,
  SettingsOutlined,
  PersonAddAltOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SideList = ({ open, setOpen, sendLogout }) => {
  const [selectedLink, setSelectedLink] = useState("");

  const { username, status, isManager, isAdmin } = useAuth();

  const list = [
    {
      title: "View Projects",
      icon: <ListAltOutlined />,
      link: "/dash/schedules",
    },
    ...(isAdmin || isManager
      ? [
          {
            title: "Add New Project",
            icon: <PostAddOutlined />,
            link: "/dash/schedules/new",
          },
          {
            title: "View User Settings",
            icon: <SettingsOutlined />,
            link: "/dash/users",
          },
          {
            title: "Add New User",
            icon: <PersonAddAltOutlined />,
            link: "/dash/users/new",
          },
        ]
      : []),
  ];

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.background.secondary,
        background: "none",
      }}
    >
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          backgroundColor: (theme) => theme.palette.background.secondary,
          "& .MuiDrawer-paper": {
            ...openedMixin,
            backgroundColor: (theme) => theme.palette.background.secondary,
            border: "none",
          },
        }}
      >
        <DrawerHeader
          sx={{
            backgroundColor: (theme) => theme.palette.background.secondary,
            border: "none",
          }}
        >
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeft />
          </IconButton>
        </DrawerHeader>

        <List>
          {list.map((item) => (
            <ListItem
              key={item.title}
              disablePadding
              sx={{
                display: "block",
                paddingRight: "0.5rem",
                paddingLeft: "0.5rem",
                gap: "1rem",
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  backgroundColor:
                    selectedLink === item.link ? "#475BE8 !important" : "none",
                  padding: "16px 16px",
                  gap: "10px",
                  marginBottom: "5px",
                  height: "56px",
                  borderRadius: "12px",
                }}
                onClick={() => {
                  navigate(item.link);
                  setSelectedLink(item.link);
                }}
                selected={selectedLink === item.link}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    // mr: open ? 3 : "auto",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    opacity: open ? 1 : 0,
                    display: open ? "block" : "none",
                    color: selectedLink === item.link ? "#FCFCFC" : "auto",
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mx: "auto", mt: 3, mb: 1 }}>
          <Tooltip title={username}>
            <Avatar src="" {...(open && { sx: { width: 100, height: 100 } })} />
          </Tooltip>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          {open && <Typography>{status}</Typography>}
          <Typography variant="body2">{username}</Typography>

          <Tooltip title="Logout" sx={{ mt: 1 }}>
            <IconButton onClick={sendLogout}>
              <Logout />
            </IconButton>
          </Tooltip>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SideList;

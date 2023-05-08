import { Outlet } from "react-router-dom";

import { useMemo, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";

const Layout = () => {
  return (
    // <CssBaseline />
    <Outlet />
  );
};
export default Layout;

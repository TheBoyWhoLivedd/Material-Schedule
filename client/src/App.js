import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import ScheduleList from "./features/schedules/ScheduleList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditSchedule from "./features/schedules/EditSchedule";
import NewSchedule from "./features/schedules/NewSchedule";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";
import SingleSchedulePage from "./features/schedules/SingleSchedulePage";
import SingleApplicationPage from "./features/schedules/SingleApplicationPage";
import SummaryPage from "./features/schedules/SummaryPage";
import RequestedSummaryPage from "./features/schedules/RequestedSummaryPage";
import AddMaterialsPage from "./features/schedules/AddMaterialsPage";
import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./components/theme";

function App() {
  useTitle("Demmed VAT");
  const [dark, setDark] = useState(true);

  return (
    <ThemeProvider theme={theme({ dark })}>
      <Routes>
        <Route path="/" element={<Layout dark={dark} />}>
          {/* public routes */}
          <Route index element={<Login />} />

          {/* Protected Routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
            >
              <Route element={<Prefetch />}>
                <Route
                  path="dash"
                  element={<DashLayout dark={dark} setDark={setDark} />}
                >
                  <Route index element={<Welcome />} />

                  <Route
                    element={
                      <RequireAuth
                        allowedRoles={[ROLES.Manager, ROLES.Admin]}
                      />
                    }
                  >
                    <Route path="users">
                      <Route index element={<UsersList />} />
                      <Route path=":id" element={<EditUser />} />
                      <Route path="new" element={<NewUserForm />} />
                    </Route>
                  </Route>

                  <Route path="schedules">
                    <Route index element={<ScheduleList />} />
                    <Route path=":id" element={<SingleSchedulePage />} />
                    <Route
                      path=":id/application"
                      element={<SingleApplicationPage />}
                    />
                    <Route path=":id/summary" element={<SummaryPage />} />
                    <Route
                      path=":id/requested"
                      element={<RequestedSummaryPage />}
                    />
                    <Route path="new" element={<NewSchedule />} />
                    <Route path="add" element={<AddMaterialsPage />} />
                    <Route path="edit/:id" element={<EditSchedule />} />
                  </Route>
                </Route>
                {/* End Dash */}
                {/* Default route */}
                <Route path="/*" element={<ScheduleList />} />
              </Route>
            </Route>
          </Route>

          {/* End Protected Routes */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;

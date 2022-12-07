import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import NotesList from "./features/notes/NotesList";
import ScheduleList from "./features/schedules/ScheduleList";
import UsersList from "./features/users/UsersList";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import EditNote from "./features/notes/EditNote";
import EditSchedule from "./features/schedules/EditSchedule";
import NewNote from "./features/notes/NewNote";
import NewSchedule from "./features/schedules/NewSchedule";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";
import SingleSchedulePage from "./features/schedules/SingleSchedulePage";
import SummaryPage from "./features/schedules/SummaryPage"
import AddMaterialsPage from "./features/schedules/AddMaterialsPage";

function App() {
  useTitle("Demmed VAT");

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          <Route
            element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}
          >
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>

                <Route path="schedules">
                  <Route index element={<ScheduleList />} />
                  <Route path=":id" element={<SingleSchedulePage />} />
                  <Route path=":id/summary" element={<SummaryPage />} />
                  <Route path="new" element={<NewSchedule />} />
                  <Route path="add" element={<AddMaterialsPage />} />
                  <Route path="edit/:id" element={<EditSchedule />} />
                </Route>
              </Route>
              {/* End Dash */}
            </Route>
          </Route>
        </Route>

        {/* End Protected Routes */}
      </Route>
    </Routes>
  );
}

export default App;

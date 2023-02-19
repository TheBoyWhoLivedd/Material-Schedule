import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";

const DashLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        paddingTop: "5rem",
        paddingLeft: "1rem",
        paddingRight: "2rem",
      }}
    >
      <DashHeader />

      <div className="dash-container">
        <Outlet />
      </div>
    </div>
  );
};
export default DashLayout;

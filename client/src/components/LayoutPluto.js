import * as images from "../images/index";
import { useState } from "react";
import { Link } from "react-router-dom";

function Layout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleSidebar() {
    setSidebarVisible((prevState) => !prevState);
  }

  function toggleDropdown() {
    setShowDropdown((prevState) => !prevState);
  }

  return (
    <div className="full_container">
      <div className="inner_container">
        {/* Sidebar  */}
        <nav id="sidebar" className={sidebarVisible ? "active" : ""}>
          <div className="sidebar_blog_1">
            <div className="sidebar-header">
              <div className="logo_section">
                <a href="index.html">
                  <img
                    className="logo_icon img-responsive"
                    src={images.logo_icon}
                    alt="#"
                  />
                </a>
              </div>
            </div>
            <div className="sidebar_user_info">
              <div className="icon_setting" />
              <div className="user_profle_side">
                <div className="user_img">
                  <img
                    className="img-responsive"
                    src={images.user_img}
                    alt="#"
                  />
                </div>
                <div className="user_info">
                  <h6>John David</h6>
                  <h6 className="yellow_color" style={{ fontSize: "0.9em" }}>
                    Admin
                  </h6>
                  <p>
                    <span className="online_animation" /> Online
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="sidebar_blog_2">
            <ul className="list-unstyled components">
              <li className="active">
                <Link to="/projects">
                  <i className="fa fa-briefcase blue1_color" />{" "}
                  <span>Projects</span>
                </Link>
              </li>
              <li>
                <Link to="/newSchedule">
                  <i className="fa fa-plus red_color" />{" "}
                  <span>Add new Project</span>
                </Link>
              </li>
              {/* <li>
                <Link
                  to="/applications"
                  data-toggle="collapse"
                  aria-expanded="false"
                >
                  <i className="fa fa-tasks purple_color2" />{" "}
                  <span>Applications</span>
                </Link>
              </li> */}
              {/* <li>
                <Link to="/schedules">
                  <i className="fa fa-clock-o blue1_color" />{" "}
                  <span>Schedules</span>
                </Link>
              </li> */}

              <li>
                <Link to="/userSetting">
                  <i className="fa fa-cog yellow_color" />{" "}
                  <span>User Settings</span>
                </Link>
              </li>
              <li>
                <Link to="/newUser">
                  <i className="fa fa-plus green_color" />{" "}
                  <span>Add New User</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        {/* end sidebar */}
        {/* right content */}
        <div id="content">
          {/* topbar */}
          <div className="topbar">
            <nav className="navbar navbar-expand-lg navbar-light">
              <div className="full">
                <button
                  type="button"
                  onClick={toggleSidebar}
                  id="sidebarCollapse"
                  className="sidebar_toggle"
                >
                  <i className="fa fa-bars" />
                </button>
                <div className="logo_section">
                  <Link to="/projects">
                    <img className="img-responsive" src={images.logo} alt="#" />
                  </Link>
                </div>
                <div className="right_topbar">
                  <div className="icon_info">
                    <ul className="user_profile_dd">
                      <li>
                        <a
                          href=".#"
                          onClick={toggleDropdown}
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          <img
                            className="img-responsive rounded-circle"
                            src={images.user_img}
                            alt="#"
                          />
                          <span className="name_user">John David</span>
                        </a>
                        <div
                          className={
                            showDropdown
                              ? "dropdown-menu active"
                              : "dropdown-menu"
                          }
                        >
                          <Link to="/profile" className="dropdown-item">
                            My Profile
                          </Link>
                          {/* <a class="dropdown-item" href="settings.html">Settings</a> */}
                          {/* <a class="dropdown-item" href="help.html">Help</a> */}
                          <Link to="/login" className="dropdown-item">
                            <span>Log Out</span>{" "}
                            <i className="fa fa-sign-out" />
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </nav>
          </div>
          {/* end topbar */}
          {/* dashboard inner */}
          {children}
          {/* end dashboard inner */}
        </div>
      </div>
    </div>
  );
}

export default Layout;

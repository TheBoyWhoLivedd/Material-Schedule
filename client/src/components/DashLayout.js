import { Outlet } from "react-router-dom";
import * as images from "../assets/images/index";
import { useEffect,useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import useTitle from "../hooks/useTitle";
import {
  faFileCirclePlus,
  faFilePen,
  faUserGear,
  faUserPlus,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";
import PulseLoader from "react-spinners/PulseLoader";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashLayout = () => {
  const { isManager, isAdmin } = useAuth();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sendLogout, { isLoading, isSuccess, isError, error }] =
    useSendLogoutMutation();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  const onNewNoteClicked = () => navigate("/dash/notes/new");
  const onNewUserClicked = () => navigate("/dash/users/new");
  const onNotesClicked = () => navigate("/dash/notes");
  const onUsersClicked = () => navigate("/dash/users");

  let dashClass = null;
  if (
    !DASH_REGEX.test(pathname) &&
    !NOTES_REGEX.test(pathname) &&
    !USERS_REGEX.test(pathname)
  ) {
    dashClass = "dash-header__container--small";
  }

  let newNoteButton = null;
  if (NOTES_REGEX.test(pathname)) {
    newNoteButton = (
      <button
        className="icon-button"
        title="New Note"
        onClick={onNewNoteClicked}
      >
        <FontAwesomeIcon icon={faFileCirclePlus} />
      </button>
    );
  }

  let newUserButton = null;
  if (USERS_REGEX.test(pathname)) {
    newUserButton = (
      <button
        className="icon-button"
        title="New User"
        onClick={onNewUserClicked}
      >
        <FontAwesomeIcon icon={faUserPlus} />
      </button>
    );
  }

  let userButton = null;
  if (isManager || isAdmin) {
    if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
      userButton = (
        <button className="icon-button" title="Users" onClick={onUsersClicked}>
          <FontAwesomeIcon icon={faUserGear} />
        </button>
      );
    }
  }

  let notesButton = null;
  if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
    notesButton = (
      <button className="icon-button" title="Notes" onClick={onNotesClicked}>
        <FontAwesomeIcon icon={faFilePen} />
      </button>
    );
  }

  const logoutButton = (
    <button className="icon-button" title="Logout" onClick={sendLogout}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );

  const errClass = isError ? "errmsg" : "offscreen";

  let buttonContent;
  if (isLoading) {
    buttonContent = <PulseLoader color={"#FFF"} />;
  } else {
    buttonContent = (
      <>
        {newNoteButton}
        {newUserButton}
        {notesButton}
        {userButton}
        {logoutButton}
      </>
    );
  }
  const { username, status } = useAuth();

  const onGoHomeClicked = () => navigate("/dash");

  let goHomeButton = null;
  if (pathname !== "/dash") {
    goHomeButton = (
      <button
        className="dash-footer__button icon-button"
        title="Home"
        onClick={onGoHomeClicked}
      >
        <FontAwesomeIcon icon={faHouse} />
      </button>
    );
  }
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleSidebar() {
    setSidebarVisible((prevState) => !prevState);
  }

  function toggleDropdown() {
    setShowDropdown((prevState) => !prevState);
  }
  useTitle(`techNotes: ${username}`);

  const date = new Date();
  const today = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "long",
  }).format(date);

  return (
    <>
      {/* header */}
      {/* <header className="dash-header">
        <div className={`dash-header__container ${dashClass}`}>
          <Link to="/dash">
            <h1 className="dash-header__title">Material Schedule Generator</h1>
          </Link>
          <nav className="dash-header__nav">{buttonContent}</nav>
        </div>
      </header> */}
      {/* header */}
      {/* body */}
      {/* <div className="dash-container">
        <Outlet />
      </div> */}
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
                    <h6>{username}</h6>
                    <h6 className="yellow_color" style={{ fontSize: "0.9em" }}>
                    {status}
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
                  <Link to="/dash/schedules">
                    <i className="fa fa-briefcase blue1_color" />{" "}
                    <span>Projects</span>
                  </Link>
                </li>
                <li>
                  <Link to="/dash/schedules/new">
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
                 {(isManager || isAdmin) && (
                <li>
                  <Link to="/dash/users">
                    <i className="fa fa-cog yellow_color" />{" "}
                    <span>User Settings</span>
                  </Link>
                </li>
                 )}
                 {(isManager || isAdmin) && (
                <li>
                  <Link to="/dash/users/new">
                    <i className="fa fa-plus green_color" />{" "}
                    <span>Add New User</span>
                  </Link>
                </li>
                )}
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
                      <img
                        className="img-responsive"
                        src={images.logo}
                        alt="#"
                      />
                    </Link>
                  </div>
                  <div className="right_topbar">
                    <div className="icon_info">
                      <ul className="user_profile_dd">
                        <li>
                          <a
                            onClick={toggleDropdown}
                            className="dropdown-toggle"
                            data-toggle="dropdown"
                          >
                            <img
                              className="img-responsive rounded-circle"
                              src={images.user_img}
                            />
                            <span className="name_user">{username}</span>
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
            {/* {children} */}
      <p className={errClass}>{error?.data?.message}</p>
            <Outlet />
            {/* end dashboard inner */}
          </div>
        </div>
      </div>
      {/* body */}
      {/* footer */}
      {/* <footer className="dash-footer">
        {goHomeButton}
        <p>Current User: {username}</p>
        <p>Status: {status}</p>
      </footer> */}
      {/* footer */}
    </>
  );
};
export default DashLayout;

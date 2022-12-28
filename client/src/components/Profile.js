import React from "react";
import "../assets/css/bootstrap.min.css";
import "../assets/css/responsive.css";
import "../assets/css/perfect-scrollbar.css";
import "../assets/css/custom.css";
import * as images from "../assets/images/index";
import { useEffect, useState } from "react";
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
const Profile = () => {
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
      <li title="Notes" onClick={onNotesClicked}>
        <i className="fa fa-clock-o blue1_color" /> <span>Schedules</span>
      </li>
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

  const content = (
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
            <li>
            <Link
              to="/dash/notes"
              data-toggle="collapse"
              aria-expanded="false"
            >
              <i className="fa fa-tasks purple_color2" />{" "}
              <span>Notes</span>
            </Link>
          </li>
            <li>
            <Link
              to="/dash/notes/new"
              data-toggle="collapse"
              aria-expanded="false"
            >
              <i className="fa fa-plus  purple_color" />{" "}
              <span>Add New Note</span>
            </Link>
          </li>
            {(isManager || isAdmin) && (
              <li>
                <Link to="/dash/users">
                  <i className="fa fa-users yellow_color" />{" "}
                  <span>Users</span>
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
        {/* <p className={errClass}>{error?.data?.message}</p> */}
        <div className="midde_cont">
            <div className="container-fluid">
              <div className="row column_title">
                <div className="col-md-12">
                  <div className="page_title">
                    <h2>Profile</h2>
                  </div>
                </div>
              </div>
              {/* row */}
              <div className="row column1">
                <div className="col-md-2" />
                <div className="col-md-8">
                  <div className="white_shd full margin_bottom_30">
                    <div className="full graph_head">
                      <div className="heading1 margin_0">
                        <h2>User profile</h2>
                      </div>
                    </div>
                    <div className="full price_table padding_infor_info">
                      <div className="row">
                        {/* user profile section */}
                        {/* profile image */}
                        <div className="col-lg-12">
                          <div className="full dis_flex center_text">
                            <div className="profile_img">
                              <img
                                width={180}
                                className="rounded-circle"
                                src={images.user_img}
                                alt="#"
                              />
                            </div>
                            <div className="profile_contant ">
                              <div className="contact_inner ">
                                <h3>John Smith</h3>
                                <p>
                                  <strong>About: </strong>Frontend Developer
                                </p>
                                <ul className="list-unstyled">
                                  <li>
                                    <i className="fa fa-envelope-o" /> :
                                    test@gmail.com
                                  </li>
                                  <li>
                                    <i className="fa fa-phone" /> : 987 654 3210
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          {/* profile contant section */}
                          <div className="full inner_elements margin_top_30">
                            <div className="tab_style2">
                              <div className="tabbar">
                                <nav>
                                  <div
                                    className="nav nav-tabs"
                                    id="nav-tab"
                                    role="tablist"
                                  >
                                    <a
                                      className="nav-item nav-link active"
                                      id="nav-home-tab"
                                      data-toggle="tab"
                                      href="#recent_activity"
                                      role="tab"
                                      aria-selected="true"
                                    >
                                      Projects Worked on
                                    </a>
                                  </div>
                                </nav>
                                <div
                                  className="tab-content"
                                  id="nav-tabContent"
                                >
                                  <div
                                    className="tab-pane fade show active"
                                    id="recent_activity"
                                    role="tabpanel"
                                    aria-labelledby="nav-home-tab"
                                  >
                                    <div className="msg_list_main">
                                      <ul className="msg_list">
                                        <li>
                                          <span>
                                            <img
                                              src={images.msg2}
                                              className="img-responsive"
                                              alt="#"
                                            />
                                          </span>
                                          <span>
                                            <span className="name_user">
                                              Taison Jack
                                            </span>
                                            <span className="msg_user">
                                              Sed ut perspiciatis unde omnis.
                                            </span>
                                            <span className="time_ago">
                                              12 min ago
                                            </span>
                                          </span>
                                        </li>
                                        <li>
                                          <span>
                                            <img
                                              src={images.msg2}
                                              className="img-responsive"
                                              alt="#"
                                            />
                                          </span>
                                          <span>
                                            <span className="name_user">
                                              Mike John
                                            </span>
                                            <span className="msg_user">
                                              On the other hand, we denounce.
                                            </span>
                                            <span className="time_ago">
                                              12 min ago
                                            </span>
                                          </span>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* end user profile section */}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-2" />
                </div>
                {/* end row */}
              </div>
            </div>
            {/* end dashboard inner */}
          </div>
        {/* end dashboard inner */}
      </div>
    </div>
  </div>
  );
  return content;
};

export default Profile;

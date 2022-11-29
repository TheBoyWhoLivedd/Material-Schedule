import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewScheduleMutation } from "./schedulesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Box } from "@mui/system";
import MenuItem from '@mui/material/MenuItem';

const NewScheduleForm = ({ users }) => {
  const [addNewSchedule, { isLoading, isSuccess, isError, error }] =
    useAddNewScheduleMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [funder, setFunder] = useState("");
  const [contractor, setContractor] = useState("");
  const [projectID, setProjectID] = useState("");

  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState(users[0].id);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setDescription("");
      setUserId("");
      navigate("/dash/schedules");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onFunderChanged = (e) => setFunder(e.target.value);
  const onContractorChanged = (e) => setContractor(e.target.value);
  const onTextChanged = (e) => setDescription(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [title, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewSchedule({ user: userId, title, description });
    }
  };

  const options = users.map((user) => {
    return (
      <MenuItem key={user.id} value={user.id}>
        {" "}
        {user.username}
      </MenuItem>
    );
  });

  const errClass = isError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !description ? "form__input--incomplete" : "";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={onSaveNoteClicked}>
        <div className="form__title-row">
          <h2>New Schedule</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <Box
          sx={{
            width: 800,
            maxWidth: "100%",
          }}
        >
          <TextField
            className={`form__input ${validTitleClass}`}
            id="title"
            name="title"
            type="text"
            autoComplete="off"
            value={title}
            size="normal"
            variant="outlined"
            label="Project Title"
            onChange={onTitleChanged}
            margin="normal"
          />
          <TextField
            className={`form__input ${validTitleClass}`}
            id="funder"
            name="funder"
            type="text"
            autoComplete="off"
            value={funder}
            size="normal"
            variant="outlined"
            label="Project Funder"
            onChange={onFunderChanged}
            margin="normal"
          />
          <TextField
            className={`form__input ${validTitleClass}`}
            id="contractor"
            name="contractor"
            type="text"
            autoComplete="off"
            value={contractor}
            size="normal"
            variant="outlined"
            label="Contractor's Name"
            onChange={onContractorChanged}
            margin="normal"
          />

          
          
        </Box>

        {/* <label className="form__label" htmlFor="text">
          Description
        </label>
        <input
          className={`form__input form__input--text ${validTextClass}`}
          id="text"
          name="text"
          value={description}
          onChange={onTextChanged}
        /> */}

        <label
          // className="form__label form__checkbox-container"
          htmlFor="username"
        >
          ASSIGNED TO:
        </label>
        <div >

        <TextField
          className="select"
          select
          variant="standard"
          id="username"
          name="username"
          
          value={userId}
          onChange={onUserIdChanged}
        >
          {options}
        </TextField>
        </div>
      </form>
    </>
  );

  return content;
};

export default NewScheduleForm;

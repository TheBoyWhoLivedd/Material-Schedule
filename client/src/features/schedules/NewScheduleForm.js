import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewScheduleMutation } from "./schedulesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Box } from "@mui/system";
import MenuItem from "@mui/material/MenuItem";
import { FormLabel } from "@mui/material";

const NewScheduleForm = ({ users }) => {
  const [addNewSchedule, { isLoading, isSuccess, isError, error }] =
    useAddNewScheduleMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [program, setProgram] = useState("");
  const [funder, setFunder] = useState("");
  const [contractor, setContractor] = useState("");

  const [userId, setUserId] = useState(users[0].id);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setProgram("");
      setFunder("");
      setContractor("");

      setUserId("");
      navigate("/dash/schedules");
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onProgramChanged = (e) => setProgram(e.target.value);
  const onFunderChanged = (e) => setFunder(e.target.value);
  const onContractorChanged = (e) => setContractor(e.target.value);
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave =
    [title, userId, program, funder, contractor].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewSchedule({
        user: userId,
        title,
        program,
        funder,
        contractor,
      });
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
            id="program"
            name="program"
            type="text"
            autoComplete="off"
            value={program}
            size="normal"
            variant="outlined"
            label="Program Title"
            onChange={onProgramChanged}
            margin="normal"
          />
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
            sx={{
              width: { sm: 200, md: 640 },
              "& .MuiInputBase-root": {
                height: 60,
              },
            }}
            inputProps={{ style: { fontFamily: "Arial", color: "white" } }}
            style={{ color: "white" }}
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

          <FormLabel
            // className="form__label form__checkbox-container"
            htmlFor="username"
          >
            <TextField
              sx={{
                width: { sm: 200, md: 300 },
                "& .MuiInputBase-root": {
                  height: 60,
                },
              }}
              className="select"
              select
              variant="outlined"
              id="username"
              name="username"
              label="ASSIGNED TO"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </TextField>
          </FormLabel>
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
      </form>
    </>
  );

  return content;
};

export default NewScheduleForm;

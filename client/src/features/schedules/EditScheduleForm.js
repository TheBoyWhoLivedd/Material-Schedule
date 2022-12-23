import { useState, useEffect } from "react";
import {
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from "./schedulesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";
import { Box } from "@mui/system";
import MenuItem from "@mui/material/MenuItem";
import { FormLabel } from "@mui/material";

const EditScheduleForm = ({ schedule, users }) => {
  const { isManager, isAdmin } = useAuth();

  const [updateSchedule, { isLoading, isSuccess, isError, error }] =
    useUpdateScheduleMutation();

  const [
    deleteSchedule,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteScheduleMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState(schedule.title);
  const [program, setProgram] = useState(schedule.program);
  const [funder, setFunder] = useState(schedule.funder);
  const [contractor, setContractor] = useState(schedule.contractor);
  const [tin, setTin] = useState(schedule.tin);
  const [description, setDescription] = useState(schedule.description);
  const [completed, setCompleted] = useState(schedule.completed);
  const [userId, setUserId] = useState(schedule.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setProgram("");
      setFunder("");
      setContractor("");

      setTin("");
      setUserId("");
      navigate("/dash/schedules");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onProgramChanged = (e) => setProgram(e.target.value);
  const onFunderChanged = (e) => setFunder(e.target.value);
  const onContractorChanged = (e) => setContractor(e.target.value);
  const onTinChanged = (e) => setTin(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev);

  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [title, program, funder, contractor, tin, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    if (canSave) {
      await updateSchedule({
        id: schedule.id,
        user: userId,
        title,
        program,
        funder,
        contractor,
        tin,
       
        completed,
      });
    }
  };

  const onDeleteScheduleClicked = async () => {
    await deleteSchedule({ id: schedule.id });
  };

  const created = new Date(schedule.createdAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  const updated = new Date(schedule.updatedAt).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const options = users.map((user) => {
    return (
      <option key={user.id} value={user.id}>
        {" "}
        {user.username}
      </option>
    );
  });
  const options2 = users.map((user) => {
    return {
      id: user.id,
      username: user.username,
    };
  });

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !description ? "form__input--incomplete" : "";

  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <button
        className="icon-button"
        title="Delete"
        onClick={onDeleteScheduleClicked}
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Project #{schedule.ticket}</h2>
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {deleteButton}
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
            onChange={onProgramChanged}
            label="Program"
          />
          <TextField
            className={`form__input ${validTitleClass}`}
            id="title"
            name="title"
            type="text"
            autoComplete="off"
            value={title}
            onChange={onTitleChanged}
            label="Title"
          />
          <TextField
            className={`form__input ${validTitleClass}`}
            id="funder"
            name="funder"
            type="text"
            autoComplete="off"
            value={funder}
            onChange={onFunderChanged}
            label="Funder"
          />
          <TextField
            className={`form__input ${validTitleClass}`}
            id="contractor"
            name="contractor"
            type="text"
            autoComplete="off"
            value={contractor}
            onChange={onContractorChanged}
            label="Contractor"
          />
          <TextField
            className={`form__input ${validTitleClass}`}
            id="tin"
            name="tin"
            type="text"
            autoComplete="off"
            value={tin}
            onChange={onTinChanged}
            label="TIN"
          />
          
        </Box>
        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label form__checkbox-container"
              htmlFor="note-username"
            >
              ASSIGNED TO:
            </label>
            <select
              id="note-username"
              name="username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {created}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {updated}
            </p>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditScheduleForm;

import { useState, useEffect } from "react";
import {
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from "./schedulesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";

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
  const [description, setDescription] = useState(schedule.description);
  const [completed, setCompleted] = useState(schedule.completed);
  const [userId, setUserId] = useState(schedule.user);

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      setTitle("");
      setDescription("");
      setUserId("");
      navigate("/dash/schedules");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onCompletedChanged = (e) => setCompleted((prev) => !prev)
  const onUserIdChanged = (e) => setUserId(e.target.value);

  const canSave = [title, description, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e) => {
    if (canSave) {
      await updateSchedule({
        id: schedule.id,
        user: userId,
        title,
        description,
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
          <h2>Edit Schedule #{schedule.ticket}</h2>
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
        <label className="form__label" htmlFor="note-title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="note-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="note-text">
          Description
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="note-text"
          name="text"
          value={description}
          onChange={onDescriptionChanged}
        />
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

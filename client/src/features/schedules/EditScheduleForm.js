import { useEffect } from "react";
import {
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from "./schedulesApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import useAuth from "../../hooks/useAuth";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import MenuItem from "@mui/material/MenuItem";
import { Button, FormLabel, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const EditScheduleForm = ({ schedule, users }) => {
  const { isManager, isAdmin } = useAuth();

  const [updateSchedule, { isLoading, isSuccess, isError, error }] =
    useUpdateScheduleMutation();

  const [
    deleteSchedule,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteScheduleMutation();

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      title: schedule.title,
      program: schedule.program,
      funder: schedule.funder,
      contractor: schedule.contractor,
      tin: schedule.tin,
      user: schedule.user._id,
      completed: schedule.completed,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      reset();
      navigate("/dash/schedules");
    }
  }, [isSuccess, isDelSuccess, navigate, reset]);

  const onSaveScheduleClicked = async (data) => {
    if (isValid) {
      await updateSchedule({ id: schedule.id, ...data });
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

  const options = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  let deleteButton = null;
  if (isManager || isAdmin) {
    deleteButton = (
      <Button
        variant="contained"
        color="secondary"
        onClick={onDeleteScheduleClicked}
        startIcon={<FontAwesomeIcon icon={faTrashCan} />}
      >
        Delete
      </Button>
    );
  }

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={handleSubmit(onSaveScheduleClicked)}>
        <div className="form__title-row">
          <Typography variant="h4" component="h2" color="text.primary">
            Edit Project #{schedule.ticket}
          </Typography>
          <div className="form__action-buttons">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={!isValid || isLoading}
              startIcon={<FontAwesomeIcon icon={faSave} />}
            >
              Save
            </Button>
            {deleteButton}
          </div>
        </div>

        <Box
          sx={{
            width: 800,
            maxWidth: "100%",
          }}
        >
          <Controller
            name="program"
            control={control}
            rules={{ required: "Program is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                style={{ width: "100%" }}
                id="program"
                type="text"
                autoComplete="off"
                label="Program"
                margin="normal"
                error={!!errors.program}
                helperText={errors.program?.message}
              />
            )}
          />
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                style={{ width: "100%" }}
                id="title"
                type="text"
                autoComplete="off"
                label="Title"
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          <Controller
            name="funder"
            control={control}
            rules={{ required: "Funder is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                style={{ width: "100%" }}
                id="funder"
                type="text"
                autoComplete="off"
                label="Funder"
                margin="normal"
                error={!!errors.funder}
                helperText={errors.funder?.message}
              />
            )}
          />
          <Controller
            name="contractor"
            control={control}
            rules={{ required: "Contractor is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                style={{ width: "100%" }}
                id="contractor"
                type="text"
                autoComplete="off"
                label="Contractor"
                margin="normal"
                error={!!errors.contractor}
                helperText={errors.contractor?.message}
              />
            )}
          />
          <Controller
            name="tin"
            control={control}
            rules={{ required: "TIN is required" }}
            render={({ field }) => (
              <TextField
                {...field}
                style={{ width: "100%" }}
                id="tin"
                type="text"
                autoComplete="off"
                label="TIN"
                margin="normal"
                error={!!errors.tin}
                helperText={errors.tin?.message}
              />
            )}
          />

          <FormLabel htmlFor="username">
            <Controller
              name="user"
              control={control}
              rules={{ required: "User is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  sx={{
                    width: "100%",
                    "& .MuiInputBase-root": {
                      height: 60,
                    },
                  }}
                  select
                  variant="outlined"
                  id="username"
                  label="ASSIGNED TO"
                  error={!!errors.user}
                  helperText={errors.user?.message}
                  margin="normal"
                >
                  {options}
                </TextField>
              )}
            />
          </FormLabel>
        </Box>
        <div className="form__row">
          <div className="form__divider">
            <Typography variant="body1" color="text.secondary">
              Created:
              <br />
              {created}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Updated:
              <br />
              {updated}
            </Typography>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditScheduleForm;

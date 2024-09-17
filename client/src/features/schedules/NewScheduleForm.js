import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewScheduleMutation } from "./schedulesApiSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/system";
import MenuItem from "@mui/material/MenuItem";
import { Button, FormLabel, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const NewScheduleForm = ({ users }) => {
  const [addNewSchedule, { isLoading, isSuccess, isError, error }] =
    useAddNewScheduleMutation();

  const navigate = useNavigate();

  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    defaultValues: {
      title: "",
      program: "",
      funder: "",
      contractor: "",
      tin: "",
      user: users[0].id,
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate("/dash/schedules");
    }
  }, [isSuccess, navigate, reset]);

  const onSaveProjectClicked = async (data) => {
    if (isValid) {
      await addNewSchedule(data);
    }
  };

  const options = users.map((user) => (
    <MenuItem key={user.id} value={user.id}>
      {user.username}
    </MenuItem>
  ));

  const errClass = isError ? "errmsg" : "offscreen";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <form className="form" onSubmit={handleSubmit(onSaveProjectClicked)}>
        <div className="form__title-row">
          <Typography variant="h4" component="h2" color="text.primary">
            New Project
          </Typography>
          <div className="form__action-buttons">
            <Button
              variant="contained"
              color="primary"
              title="Save"
              type="submit"
              disabled={!isValid || isLoading}
              startIcon={<FontAwesomeIcon icon={faSave} />}
            >
              Save
            </Button>
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
                style={{ color: "white", width: "100%" }}
                id="program"
                type="text"
                autoComplete="off"
                size="normal"
                variant="outlined"
                label="Program Title"
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
                style={{ color: "white", width: "100%" }}
                id="title"
                type="text"
                autoComplete="off"
                size="normal"
                variant="outlined"
                label="Project Title"
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
                style={{ color: "white", width: "100%" }}
                id="funder"
                type="text"
                autoComplete="off"
                size="normal"
                variant="outlined"
                label="Project Funder"
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
                style={{ color: "white", width: "100%" }}
                id="contractor"
                type="text"
                autoComplete="off"
                size="normal"
                variant="outlined"
                label="Contractor's Name"
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
                style={{ color: "white", width: "100%" }}
                id="tin"
                type="number"
                autoComplete="off"
                size="normal"
                variant="outlined"
                label="Contractor's TIN"
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
                  className={`select`}
                  select
                  variant="outlined"
                  id="username"
                  label="ASSIGNED TO"
                  error={!!errors.userId}
                  helperText={errors.userId?.message}
                >
                  {options}
                </TextField>
              )}
            />
          </FormLabel>
        </Box>
      </form>
    </>
  );

  return content;
};

export default NewScheduleForm;

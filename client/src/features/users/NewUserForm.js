import { useEffect } from "react";
import { useAddNewUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import useTitle from "../../hooks/useTitle";
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const NewUserForm = () => {
  useTitle("Deemed VAT: New User");

  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUserMutation();

  const navigate = useNavigate();

  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm({
    defaultValues: {
      username: "",
      password: "",
      roles: ["Employee"],
    },
    mode: "onChange"
  });

  useEffect(() => {
    if (isSuccess) {
      reset();
      navigate("/dash/users");
    }
  }, [isSuccess, navigate, reset]);

  const onSaveUserClicked = async (data) => {
    if (isValid) {
      await addNewUser(data);
    }
  };

  const roleOptions = Object.values(ROLES).map((role) => (
    <MenuItem key={role} value={role}>
      {role}
    </MenuItem>
  ));

  const errClass = isError ? "errmsg" : "offscreen";

  const content = (
    <>
      <p className={errClass}>{error?.data?.message}</p>

      <Box component="form" onSubmit={handleSubmit(onSaveUserClicked)} sx={{ mt: 1 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 2 }} color="text.primary">
          New User
        </Typography>

        <Controller
          name="username"
          control={control}
          rules={{
            required: "Username is required",
            pattern: {
              value: USER_REGEX,
              message: "Username must be 3-20 letters"
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              autoComplete="off"
              error={!!errors.username}
              helperText={errors.username?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
            pattern: {
              value: PWD_REGEX,
              message: "Password must be 4-12 chars including !@#$%"
            }
          }}
          render={({ field }) => (
            <TextField
              {...field}
              margin="normal"
              fullWidth
              id="password"
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel id="roles-label">Assigned Roles</InputLabel>
          <Controller
            name="roles"
            control={control}
            rules={{ required: "At least one role is required" }}
            render={({ field }) => (
              <Select
                {...field}
                labelId="roles-label"
                id="roles"
                multiple
                error={!!errors.roles}
              >
                {roleOptions}
              </Select>
            )}
          />
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={!isValid || isLoading}
          startIcon={<FontAwesomeIcon icon={faSave} />}
        >
          Save User
        </Button>
      </Box>
    </>
  );

  return content;
};

export default NewUserForm;

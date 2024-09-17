import { useEffect } from "react";
import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { ROLES } from "../../config/roles";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [
    deleteUser,
    { isSuccess: isDelSuccess, isError: isDelError, error: delerror },
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user.username,
      password: "",
      roles: user.roles,
      active: user.active,
    },
    mode: "onChange",
  });

  const watchPassword = watch("password");

  useEffect(() => {
    if (isSuccess || isDelSuccess) {
      navigate("/dash/users");
    }
  }, [isSuccess, isDelSuccess, navigate]);

  const onSaveUserClicked = async (data) => {
    if (data.password) {
      await updateUser({ id: user.id, ...data });
    } else {
      const { password, ...dataWithoutPassword } = data;
      await updateUser({ id: user.id, ...dataWithoutPassword });
    }
  };

  const onDeleteUserClicked = async () => {
    await deleteUser({ id: user.id });
  };

  const canSave = watchPassword
    ? [
        watch("roles").length,
        USER_REGEX.test(watch("username")),
        PWD_REGEX.test(watchPassword),
      ].every(Boolean) && !isLoading
    : [watch("roles").length, USER_REGEX.test(watch("username"))].every(
        Boolean
      ) && !isLoading;

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const errContent = (error?.data?.message || delerror?.data?.message) ?? "";

  return (
    <>
      <p className={errClass}>{errContent}</p>

      <Box
        component="form"
        onSubmit={handleSubmit(onSaveUserClicked)}
        sx={{ mt: 1 }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h2" color="text.primary">
            Edit User
          </Typography>
          <div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSaveUserClicked)}
              disabled={!canSave}
              startIcon={<FontAwesomeIcon icon={faSave} />}
              sx={{ mr: 1 }}
            >
              Save
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={onDeleteUserClicked}
              startIcon={<FontAwesomeIcon icon={faTrashCan} />}
            >
              Delete
            </Button>
          </div>
        </Box>

        <Controller
          name="username"
          control={control}
          rules={{
            required: "Username is required",
            pattern: {
              value: USER_REGEX,
              message: "Username must be 3-20 letters",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Username"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message || "3-20 letters"}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            pattern: {
              value: PWD_REGEX,
              message: "4-12 chars incl. !@#$%",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={
                errors.password?.message ||
                "Leave empty for no change. 4-12 chars incl. !@#$%"
              }
            />
          )}
        />

        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value} />}
              label="Active"
              sx={{
                "& .MuiFormControlLabel-label": {
                  color: "text.primary",
                },
              }}
            />
          )}
        />

        <Controller
          name="roles"
          control={control}
          rules={{ required: "At least one role is required" }}
          render={({ field }) => (
            <Select
              {...field}
              multiple
              fullWidth
              margin="normal"
              error={!!errors.roles}
              renderValue={(selected) => selected.join(", ")}
            >
              {Object.values(ROLES).map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.roles && (
          <Typography color="error">{errors.roles.message}</Typography>
        )}
      </Box>
    </>
  );
};

export default EditUserForm;

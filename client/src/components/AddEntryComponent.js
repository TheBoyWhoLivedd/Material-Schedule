// AddEntryComponent.js
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Grid,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Trash, Plus } from "feather-icons-react";
import Autocomplete from "@mui/material/Autocomplete";

const AddEntryComponent = ({
  handleAddEntry, 
  handleFormSubmit,
  schedule,
  isLoading,
}) => {
  const { control, handleSubmit, watch, reset } = useForm({
    defaultValues: {
      item: "",
      supplier: "",
      amountRequested: "",
    },
  });

  const [amountAllowed, setAmountAllowed] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const selectedItem = watch("item");

  useEffect(() => {
    if (selectedItem && schedule?.balanceAllowable && schedule?.summary) {
      const balanceItem = schedule.balanceAllowable.find(
        (item) => item._id === selectedItem
      );
      const summaryItem = schedule.summary.find(
        (item) => item._id === selectedItem
      );

      if (balanceItem) {
        setAmountAllowed(balanceItem.Value);
      } else if (summaryItem) {
        setAmountAllowed(summaryItem.Value);
      } else {
        setAmountAllowed("N/A");
      }
    } else {
      setAmountAllowed("N/A");
    }
  }, [selectedItem, schedule]);

  const onSubmit = (data) => {
    handleAddEntry(data);
    reset();
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* Item Autocomplete */}
        <Grid item xs={12} sm={6} md={4}>
          <Controller
            name="item"
            control={control}
            rules={{ required: "Item is required" }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                options={schedule?.summary.map((option) => option.name) || []}
                onChange={(event, value) => field.onChange(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Item"
                    placeholder="Select Item"
                    error={!!error}
                    helperText={error ? error.message : null}
                    required
                  />
                )}
              />
            )}
          />
        </Grid>

        {/* Supplier Field */}
        <Grid item xs={12} sm={6} md={3}>
          <Controller
            name="supplier"
            control={control}
            rules={{ required: "Supplier is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Supplier"
                placeholder="Enter Supplier"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                required
              />
            )}
          />
        </Grid>

        {/* Amount Requested */}
        <Grid item xs={12} sm={6} md={2}>
          <Controller
            name="amountRequested"
            control={control}
            rules={{
              required: "Quantity is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Enter a valid number",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Requested"
                placeholder="Enter Quantity"
                variant="outlined"
                fullWidth
                error={!!error}
                helperText={error ? error.message : null}
                required
              />
            )}
          />
        </Grid>

        {/* Amount Allowed (Read-Only) */}
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            label="Allowed"
            value={amountAllowed}
            variant="outlined"
            fullWidth
            InputProps={{ readOnly: true }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Add Entry Button */}
        <Grid item xs={12} sm={6} md={1} display="flex" alignItems="center">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<Plus width={20} height={20} />}
            sx={{
              height: "100%",
            }}
          >
           
          </Button>
        </Grid>
      </Grid>

      {/* Submit Application Button */}
      <Box
        sx={{
          mt: 3,
          width: '100%',
        }}
      >
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          color="secondary"
          disabled={isLoading}
          fullWidth
          startIcon={isLoading ? null : <Plus width={20} height={20} />}
        >
          {isLoading ? "Submitting..." : "Submit Application"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddEntryComponent;

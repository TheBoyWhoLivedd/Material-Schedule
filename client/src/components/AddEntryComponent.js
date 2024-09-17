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
  existingEntries,
}) => {
  const { control, handleSubmit, watch, reset, setError, clearErrors } =
    useForm({
      defaultValues: {
        item: "",
        supplier: "",
        amountRequested: "",
      },
    });

  const [maxAllowed, setMaxAllowed] = useState("");
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

      let allowedValue = 0;
      if (balanceItem) {
        console.log(`We have a balance item: ${balanceItem}`);
        allowedValue = balanceItem.Value;
      } else if (summaryItem) {
        allowedValue = summaryItem.Value;
      } else {
        setMaxAllowed("N/A");
        return;
      }
      // Calculate total requested for this item from existing entries
      const totalRequested = existingEntries
        .filter((entry) => entry.item === selectedItem && !entry._id)
        .reduce((sum, entry) => sum + Number(entry.amountRequested || 0), 0);

      const remaining = allowedValue - totalRequested;

      setMaxAllowed(remaining >= 0 ? remaining : 0);
    } else {
      setMaxAllowed("N/A");
    }
  }, [selectedItem, schedule, existingEntries]);

  const onSubmit = (data) => {
    if (maxAllowed !== "N/A" && Number(data.amountRequested) > maxAllowed) {
      setError("amountRequested", {
        type: "manual",
        message: `Amount exceeds the remaining balance of ${maxAllowed}`,
      });
      return;
    }
    handleAddEntry(data);
    reset();
    clearErrors("amountRequested");
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
                getOptionDisabled={(option) => {
                  // Disable options if remaining balance is 0
                  if (!selectedItem) return false;
                  if (option !== selectedItem) return false;
                  const itemBalance =
                    schedule.balanceAllowable.find(
                      (item) => item.name === option
                    )?.Value ||
                    schedule.summary.find((item) => item.name === option)
                      ?.Value ||
                    0;
                  const totalRequested = existingEntries
                    .filter((entry) => entry.item === option)
                    .reduce(
                      (sum, entry) => sum + Number(entry.amountRequested || 0),
                      0
                    );
                  return itemBalance - totalRequested <= 0;
                }}
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
              validate: (value) => {
                if (maxAllowed === "N/A") return true;
                if (Number(value) > maxAllowed) {
                  return `Cannot exceed ${maxAllowed}`;
                }
                return true;
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                type="number"
                label="Requested"
                placeholder="Enter Quantity"
                variant="outlined"
                fullWidth
                inputProps={{
                  min: 1,
                  max: maxAllowed !== "N/A" ? maxAllowed : undefined,
                }}
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
            value={maxAllowed !== "N/A" ? maxAllowed : "N/A"}
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
            disabled={maxAllowed === 0 || maxAllowed === "N/A"} // Disable if no balance
          >
            {/* You can add text or keep it as icon */}
          </Button>
        </Grid>
      </Grid>

      {/* Submit Application Button */}
      <Box
        sx={{
          mt: 3,
          width: "100%",
        }}
      >
        <Button
          onClick={handleFormSubmit}
          variant="contained"
          color="secondary"
          disabled={isLoading || existingEntries.length === 0}
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

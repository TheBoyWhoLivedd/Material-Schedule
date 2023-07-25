import { React, useState, useEffect } from "react";
import { Button, TextField, Grid } from "@mui/material";
import { Trash, Plus } from "feather-icons-react";
import Autocomplete from "@mui/material/Autocomplete";


const AddEntryComponent = ({
  newEntry,
  setNewEntry,
  handleSubmit,
  handleChange,
  handleFormSubmit,
  handleOnItemSelect,
  schedule,
  isLoading,
}) => {
  const [amountAllowed, setAmountAllowed] = useState("");

  useEffect(() => {
    if (newEntry?.item && schedule?.balanceAllowable && schedule?.summary) {
      const balanceItem = schedule.balanceAllowable.find(
        (item) => item._id === newEntry.item
      );
      const summaryItem = schedule.summary.find(
        (item) => item._id === newEntry.item
      );

      if (balanceItem) {
        setAmountAllowed(balanceItem.Value);
      } else if (summaryItem) {
        setAmountAllowed(summaryItem.Value);
      } else {
        setAmountAllowed("null");
      }
    } else {
      setAmountAllowed("null");
    }
  }, [newEntry?.item, schedule?.balanceAllowable, schedule?.summary]);

  return (
    <div>
      <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Grid container spacing={3} mt={0.5}>
          <Grid item md={4}>
            <Autocomplete
              options={schedule?.summary.map((option) => option.name)}
              name="item"
              placeholder="Choose Element"
              onSelect={(e) => handleOnItemSelect(e, "item")}
              value={newEntry?.item}
              required
              className="autocomplete"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Item"
                  required
                  placeholder="Item Description"
                />
              )}
            />
          </Grid>
          <Grid item md={3}>
            <TextField
              label="Supplier"
              name="supplier"
              placeholder="Enter Supplier"
              variant="outlined"
              value={newEntry?.supplier}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item md={2}>
            <TextField
              label="Requested"
              name="amountRequested"
              placeholder="Enter Quantity Requested"
              variant="outlined"
              value={newEntry?.amountRequested}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item md={2}>
            <TextField
              label="Allowed"
              name="allowed"
              variant="outlined"
              value={amountAllowed || null}
              InputProps={{ readOnly: true }}
              InputLabelProps={{ shrink: !!amountAllowed }}
              fullWidth
            />
          </Grid>

          <Grid item md={1}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
            >
              <Plus width={20} />
            </Button>
          </Grid>
        </Grid>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={handleFormSubmit} variant="contained" type="submit">
            {isLoading ? "Adding..." : "Add Items"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEntryComponent;

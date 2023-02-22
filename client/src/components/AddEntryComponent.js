import { React, useRef } from "react";
import { Button, TextField, Grid } from "@mui/material";
import { Trash, Plus } from "feather-icons-react";
import Autocomplete from "@mui/material/Autocomplete";
import { applicationItems } from "../assets/data";

const AddEntryComponent = ({
  newEntry,
  setNewEntry,
  handleSubmit,
  handleChange,
  handleFormSubmit,
  handleOnItemSelect,
}) => {
  return (
    <div>
      <form style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Grid container spacing={3} mt={0.5}>
          <Grid item md={4}>
            <Autocomplete
              options={applicationItems.map((option) => option)}
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
          <Grid item md={4}>
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
          <Grid item md={3}>
            <TextField
              label="Requested"
              name="requested"
              placeholder="Enter Quantity Requested"
              variant="outlined"
              value={newEntry?.requested}
              onChange={handleChange}
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
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddEntryComponent;

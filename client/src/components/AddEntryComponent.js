import { React, useRef } from "react";
import {
  Button,
  TextField,
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Text,
} from "@mui/material";
import { Trash, Plus } from "feather-icons-react";

const AddEntryComponent = ({
  newEntry,
  setNewEntry,
  handleSubmit,
  handleChange,
}) => {

  return (
    <div>
     
      <form >
        <Grid container spacing={3}>
          <Grid item md={3}>
            <TextField
              label="Item"
              name="item"
              placeholder="Item Description"
              variant="outlined"
              value={newEntry?.item}
              onChange={handleChange}
              fullWidth
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
          <Grid item md={3}>
            <TextField
              label="Allowed"
              name="allowed"
              placeholder="Enter Quantity Allowed"
              variant="outlined"
              value={newEntry?.allowed}
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

        {/* <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={""} variant="contained" type="submit">
            Submit
          </Button>
        </div> */}
      </form>
    </div>
  );
};

export default AddEntryComponent;

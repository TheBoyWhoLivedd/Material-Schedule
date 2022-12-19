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
import { Trash } from "feather-icons-react";
import React from "react";

const EntryList = ({ entries, handleDelete, handleChange }) => {
  return (
    <div>
      {entries?.map((entry) => (
        <div>
          <form key={entry.id}>
            <Grid container spacing={3} mt={0.5}>
              <Grid item md={3}>
                <TextField
                  label="Item"
                  name="item"
                  placeholder="Item Description"
                  variant="outlined"
                  value={entry?.item}
                  onChange={(e) => handleChange(e, entry.id)}
                  fullWidth
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  label="Supplier"
                  name="supplier"
                  placeholder="Enter Supplier"
                  variant="outlined"
                  value={entry?.supplier}
                  onChange={(e) => handleChange(e, entry.id)}
                  fullWidth
                />
              </Grid>
              <Grid item md={2}>
                <TextField
                  label="Requested"
                  name="requested"
                  placeholder="Enter Quantity Requested"
                  variant="outlined"
                  value={entry?.requested}
                  onChange={(e) => handleChange(e, entry.id)}
                  fullWidth
                />
              </Grid>
              <Grid item md={2}>
                <TextField
                  label="Allowed"
                  name="allowed"
                  placeholder="Enter Quantity Allowed"
                  variant="outlined"
                  value={entry?.allowed}
                  onChange={(e) => handleChange(e, entry.id)}
                  fullWidth
                />
              </Grid>
              <Grid item md={2}>
                <Button onClick={() => handleDelete(entry.id)}>
                  <Trash size={20} />
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      ))}
    </div>
  );
};

export default EntryList;

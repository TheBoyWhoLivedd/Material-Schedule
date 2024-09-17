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
  console.log("entries in EntryList", entries);
  return (
    <div>
      {entries?.map((entry) => {
        const isEditable = !entry._id;
        const uniqueId = entry._id || entry.changeId;
        return (
          <div key={uniqueId}>
            <form>
              <Grid container spacing={3} mt={0.5} mr={0.5}>
                <Grid item md={4}>
                  <TextField
                    label="Item"
                    name="item"
                    placeholder="Item Description"
                    variant="outlined"
                    value={entry?.item}
                    onChange={(e) => isEditable && handleChange(e, uniqueId)}
                    fullWidth
                    disabled={!isEditable}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    label="Supplier"
                    name="supplier"
                    placeholder="Enter Supplier"
                    variant="outlined"
                    value={entry?.supplier}
                    onChange={(e) => isEditable && handleChange(e, uniqueId)}
                    fullWidth
                    disabled={!isEditable}
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    label="Requested"
                    name="amountRequested"
                    placeholder="Enter Quantity Requested"
                    variant="outlined"
                    value={entry?.amountRequested}
                    onChange={(e) => isEditable && handleChange(e, uniqueId)}
                    fullWidth
                    disabled={!isEditable}
                  />
                </Grid>
                <Grid item md={1}>
                  <Button 
                    onClick={() => isEditable && handleDelete(uniqueId)}
                    disabled={!isEditable}
                  >
                    <Trash size={20} />
                  </Button>
                </Grid>
              </Grid>
            </form>
          </div>
        );
      })}
    </div>
  );
};

export default EntryList;

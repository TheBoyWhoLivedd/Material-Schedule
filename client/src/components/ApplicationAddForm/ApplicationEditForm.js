import React, { useState } from "react";
import { useUpdateApplicationMutation } from "../../features/schedules/schedulesApiSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { Container, Paper, Box, Button, TextField, Grid } from "@mui/material";
import { applicationItems } from "../../assets/data";
import { Plus, Trash } from "feather-icons-react";
import "./ApplicationAddForm.css";
import { v4 as uuidv4 } from "uuid";

const ApplicationEditForm = ({
  id,
  handleClose,
  content,
  openSnackbarWithMessage,
}) => {
  const [entries, setEntries] = useState(content.items);

  const initialState = {
    item: "",
    supplier: "",
    amountRequested: "",
    amountAllowed: "",
  };
  const [newEntry, setNewEntry] = useState(initialState);

  const [updateApplication, { isSuccess: isAddSuccess, isLoading }] =
    useUpdateApplicationMutation();

  const addEntry = (entry) => {
    const changeId = uuidv4().substring(0, 8);
    const myNewEntry = { ...entry, changeId };
    const listEntries = [...entries, myNewEntry];
    console.log(listEntries);
    setEntries(listEntries);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.keys(newEntry).length === 0) {
      return;
    } else {
      addEntry(newEntry);
      setNewEntry(initialState);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await updateApplication({
      id: id,
      appId: content._id,
      body: { entries },
    });
    if (response.data.isError) {
      console.log(`Error: ${response.message}`);
      openSnackbarWithMessage(`Error: ${response.data.message}`);
    } else {
      handleClose();
      openSnackbarWithMessage(`Materials Added Successfully`);
    }
  };

  const handleOnChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
    console.log(newEntry);
  };
  const handleOnItemSelect = (e, name) => {
    setNewEntry({ ...newEntry, [name]: e.target.value });
    // console.log(newEntry);
  };
  const handleDelete = (id) => {
    const entryItems = entries.filter((entry) => entry.changeId !== id);
    setEntries(entryItems);
  };
  const handleEntryChange = (e, changeId) => {
    const entryItems = entries.map((entry) => {
      if (entry.changeId === changeId) {
        return { ...entry, [e.target.name]: e.target.value };
      }
      return entry;
    });
    setEntries(entryItems);
    console.log(entryItems);
  };
  const style = {
    boxShadow: "none",
    padding: "2rem",
  };
  return (
    <div>
      <Container>
        <Paper component={Box} sx={style}>
          {entries?.length ? (
            <div>
              {entries?.map((entry) => (
                <div key={entry._id || entry.changeId}>
                  <form>
                    <Grid container spacing={3} mt={0.5}>
                      <Grid item md={4}>
                        <Autocomplete
                          options={applicationItems.map((option) => option)}
                          name="item"
                          placeholder="Choose Element"
                          onSelect={(e) => handleEntryChange(e, entry.changeId)}
                          value={entry?.item}
                          required
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Item"
                              required
                              placeholder="Item Description"
                              disabled={entry._id !== undefined}
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
                          value={entry?.supplier}
                          onChange={(e) => handleEntryChange(e, entry.changeId)}
                          fullWidth
                          disabled={entry._id !== undefined}
                        />
                      </Grid>
                      <Grid item md={3}>
                        <TextField
                          label="Requested"
                          name="amountRequested"
                          placeholder="Enter Quantity Requested"
                          variant="outlined"
                          value={entry?.amountRequested}
                          onChange={(e) => handleEntryChange(e, entry.changeId)}
                          fullWidth
                          disabled={entry._id !== undefined}
                        />
                      </Grid>

                      {entry._id === undefined && (
                        <Grid item md={1}>
                          <Button
                            sx={{
                              variant: "primary",
                              size: "small",
                              pt: 1.5,
                              pl: 0,
                            }}
                            onClick={() => handleDelete(entry.changeId)}
                          >
                            <Trash />
                          </Button>
                        </Grid>
                      )}
                    </Grid>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: "2rem" }}>Your list is empty.</p>
          )}
          <form className="inputsForm">
            <Grid container spacing={3} mt={0.5}>
              <Grid item md={4}>
                <Autocomplete
                  options={applicationItems.map((option) => option)}
                  name="item"
                  placeholder="Choose Element"
                  onSelect={(e) => handleOnItemSelect(e, "item")}
                  value={newEntry?.item}
                  required
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
                  onChange={handleOnChange}
                  fullWidth
                />
              </Grid>
              <Grid item md={4}>
                <TextField
                  label="Requested"
                  name="amountRequested"
                  placeholder="Enter Quantity Requested"
                  variant="outlined"
                  value={newEntry?.amountRequested}
                  onChange={handleOnChange}
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
              <Button
                onClick={handleFormSubmit}
                variant="contained"
                type="submit"
              >
                {isLoading ? "Adding..." : "Add Items"}
              </Button>
            </div>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default ApplicationEditForm;

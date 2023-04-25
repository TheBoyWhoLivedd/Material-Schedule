import React, { useState, useEffect } from "react";
import {
  useAddApplicationMutation,
  useUpdateMaterialMutation,
} from "../../features/schedules/schedulesApiSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { Container, Paper, Box } from "@mui/material";
import AddEntryComponent from "../AddEntryComponent";

import "./ApplicationAddForm.css";
import Content from "../Content";

const ApplicationAddForm = ({ id, handleClose, content, schedule,openSnackbarWithMessage }) => {
  const [entries, setEntries] = useState([]);
  if (content) {
    setEntries(content);
  }
  const initialState = {
    item: "",
    supplier: "",
    amountRequested: "",
   
  };
  const [newEntry, setNewEntry] = useState(initialState);

  const [addApplication, { isSuccess: isAddSuccess, isLoading }] =
    useAddApplicationMutation();

  const addEntry = (entry) => {
    const id = entries.length ? entries[entries.length - 1].id + 1 : 1;
    const myNewEntry = { ...entry, id };
    const listEntries = [...entries, myNewEntry];
    // console.log(listEntries);

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
    const response = await addApplication({
      body: entries,
      id: id,
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
    // console.log(newEntry);
  };
  const handleOnItemSelect = (e, name) => {
    setNewEntry({ ...newEntry, [name]: e.target.value });
    // console.log(newEntry);
  };
  const handleDelete = (id) => {
    const entryItems = entries.filter((entry) => entry.id !== id);
    setEntries(entryItems);
  };
  const handleEntryChange = (e, id) => {
    const entryItems = entries.map((entry) => {
      if (entry.id === id) {
        return { ...entry, [e.target.name]: e.target.value };
      }
      return entry;
    });
    setEntries(entryItems);
    console.log(entryItems);
  };
  const style = {
    boxShadow: "none",
    padding: "1rem",
  };
  return (
    <Container>
      <Paper component={Box} sx={style}>
        <Content
          entries={entries}
          handleDelete={handleDelete}
          handleChange={handleEntryChange}
        />
        <AddEntryComponent
          newEntry={newEntry}
          handleChange={handleOnChange}
          handleSubmit={handleSubmit}
          handleFormSubmit={handleFormSubmit}
          handleOnItemSelect={handleOnItemSelect}
          schedule={schedule}
          isLoading={isLoading}
        />
      </Paper>
    </Container>
  );
};

export default ApplicationAddForm;

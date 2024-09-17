// ApplicationAddForm.js
import React, { useState, useEffect } from "react";
import { useAddApplicationMutation } from "../../features/schedules/schedulesApiSlice";
import { Container, Paper, Box } from "@mui/material";
import AddEntryComponent from "../AddEntryComponent";
import "./ApplicationAddForm.css";
import Content from "../Content";

const ApplicationAddForm = ({
  id,
  handleClose,
  content,
  schedule,
  openSnackbarWithMessage,
}) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (content) {
      setEntries(content);
    }
  }, [content]);

  const initialState = {
    item: "",
    supplier: "",
    amountRequested: "",
  };

  const [addApplication, { isSuccess: isAddSuccess, isLoading }] =
    useAddApplicationMutation();

  const handleAddEntry = (entry) => {
    const id = entries.length ? entries[entries.length - 1].id + 1 : 1;
    const myNewEntry = { ...entry, id };
    setEntries((prevEntries) => [...prevEntries, myNewEntry]);
  };

  const handleFormSubmit = async () => {
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

  const handleDelete = (id) => {
    setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
  };

  const handleEntryChange = (e, id) => {
    const { name, value } = e.target;
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, [name]: value } : entry
      )
    );
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
          handleAddEntry={handleAddEntry}
          handleFormSubmit={handleFormSubmit}
          schedule={schedule}
          isLoading={isLoading}
          existingEntries={entries}
        />
      </Paper>
    </Container>
  );
};

export default ApplicationAddForm;

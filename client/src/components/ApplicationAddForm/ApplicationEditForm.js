// ApplicationEditForm.js
import React, { useState, useEffect } from "react";
import { useUpdateApplicationMutation } from "../../features/schedules/schedulesApiSlice";
import { Container, Paper, Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import AddEntryComponent from "../AddEntryComponent";
import Content from "../Content";
import "./ApplicationAddForm.css";

const ApplicationEditForm = ({
  id,
  handleClose,
  content,
  openSnackbarWithMessage,
  schedule,
}) => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (content) {
      setEntries(content.items);
    }
  }, [content]);

  const [updateApplication, { isSuccess: isUpdateSuccess, isLoading }] =
    useUpdateApplicationMutation();

  const handleAddEntry = (entry) => {
    const changeId = uuidv4().substring(0, 8);
    const myNewEntry = { ...entry, changeId };
    setEntries((prevEntries) => [...prevEntries, myNewEntry]);
  };

  const handleFormSubmit = async () => {
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
      openSnackbarWithMessage(`Materials Updated Successfully`);
    }
  };

  const handleDelete = (changeId) => {
    setEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.changeId !== changeId)
    );
  };

  const handleEntryChange = (e, changeId) => {
    const { name, value } = e.target;
    setEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.changeId === changeId ? { ...entry, [name]: value } : entry
      )
    );
  };

  const style = {
    boxShadow: "none",
    padding: "2rem",
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
        />
      </Paper>
    </Container>
  );
};

export default ApplicationEditForm;

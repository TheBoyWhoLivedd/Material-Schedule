import React, { useState, useEffect } from "react";
import {
  useAddApplicationMutation,
  useUpdateMaterialMutation,
} from "../../features/schedules/schedulesApiSlice";
import Autocomplete from "@mui/material/Autocomplete";
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
import AddEntryComponent from "../AddEntryComponent";

import "./ApplicationAddForm.css";
import Content from "../Content";

const ApplicationAddForm = ({ id, handleClose }) => {
  const [entries, setEntries] = useState([]);
  const initialState = {
    item: "",
    supplier: "",
    requested: "",
    allowed: "",
  };
  const [newEntry, setNewEntry] = useState(initialState);

  const [addApplication, { isSuccess: isAddSuccess }] =
    useAddApplicationMutation();
    useEffect(() => {
      console.log(entries);
    }, [entries]);
  const addEntry = (entry) => {
    const id = entries.length ? entries[entries.length - 1].id + 1 : 1;
    const myNewEntry = { ...entry, id };
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

  const handleOnChange = (e) => {
    setNewEntry({ ...newEntry, [e.target.name]: e.target.value });
    console.log(newEntry);
  };
  return (
    <div>
      <Container>
        <Paper component={Box} p={4}>
          <AddEntryComponent
            newEntry={newEntry}
            handleChange={handleOnChange}
            handleSubmit={handleSubmit}
          />
          <main>
            <Content />
          </main>
        </Paper>
      </Container>
    </div>
  );
};

export default ApplicationAddForm;

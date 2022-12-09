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
import { Trash } from "feather-icons-react";

import "./ApplicationAddForm.css";
import {
  concreteClassOptions,
  elementsData,
  wallingMaterialsData,
  mortarOptions,
  reinforcementMaterialsData,
  brcSizeOptions,
  rebarSizeOptions,
  bondData,
} from "../../assets/data";
const ApplicationAddForm = ({ id }) => {

  const userTemplate = { item: "", supplier: "", requested: "", allowed: "" };
  const [addApplication, { isSuccess: isAddSuccess }] =
    useAddApplicationMutation();

  const [users, setUsers] = useState( [userTemplate] );

  const addUser = () => {
    setUsers([...users, userTemplate]);
  };
  const onChange = (e, index) => {
    console.log(users.length)
    const updatedUsers = users.map((user, i) =>
      index === i
        ? Object.assign(user, { [e.target.name]: e.target.value })
        : users[0]
    );
    setUsers(updatedUsers);
  };
  const removeUser = (index) => {
    const filteredUsers = [...users];
    filteredUsers.splice(index, 1);
    setUsers(filteredUsers);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    await addApplication({
      id: id,
      body:users,
    });
  };
  return (
    <div>
      <Container>
        <Paper component={Box} p={4}>
          {users.map((user, index) => (
            <Grid container spacing={3} key={index}>
              <Grid item md={3}>
                <TextField
                  label="Item"
                  name="item"
                  placeholder="Item Description"
                  variant="outlined"
                  value={user.item}
                  onChange={(e) => onChange(e, index)}
                  fullWidth
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  label="Supplier"
                  name="supplier"
                  placeholder="Enter Supplier"
                  variant="outlined"
                  value={user.supplier}
                  onChange={(e) => onChange(e, index)}
                  fullWidth
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  label="Requested"
                  name="requested"
                  placeholder="Enter Quantity Requested"
                  variant="outlined"
                  value={user.requested}
                  onChange={(e) => onChange(e, index)}
                  fullWidth
                />
              </Grid>
              <Grid item md={3}>
                <TextField
                  label="Allowed"
                  name="allowed"
                  placeholder="Enter Quantity Allowed"
                  variant="outlined"
                  value={user.allowed}
                  onChange={(e) => onChange(e, index)}
                  fullWidth
                />
              </Grid>
              <Grid item md={1}>
                <Button onClick={() => removeUser(index)}>
                  <Trash size={20} />
                </Button>
              </Grid>
            </Grid>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button variant="contained" color="primary" onClick={addUser}>
              add more
            </Button>
            <Button onClick={handleSubmit} variant="contained" type="submit">
              Submit
            </Button>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default ApplicationAddForm;

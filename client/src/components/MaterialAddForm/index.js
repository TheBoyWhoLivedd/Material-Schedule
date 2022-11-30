import React, { useState } from "react";

// import Autocomplete from "./Autocomplete";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, TextField } from "@mui/material";
import "./MaterialAddForm.css";
import {
  materialsData,
  concreteClassOptions,
  beamSizeOptions,
} from "../../assets/data";
const MaterialAddForm = ({ formData = {} }) => {
  const [options, setOptions] = useState(formData);

  const handleOnSelect = (e, name) => {
    setOptions({ ...options, [name]: e.target.value });
  };
  const handleOnChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
    console.log(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    console.log(options);
    if (Object.keys(formData).length === 0) {
      // Edit Material
    } else {
      // Add material
    }
  };
  return (
    <div>
      <form onSubmit={handleOnSubmit} className="inputsForm">
        <TextField
          type="text"
          name="description"
          label="Description"
          placeholder="Enter Description"
          onChange={handleOnChange}
          value={options?.description}
          required
        />
        <Autocomplete
          id="materials_id"
          options={materialsData.map((option) => option)}
          name="materials"
          placeholder="Enter Material"
          onSelect={(e) => handleOnSelect(e, "materials")}
          value={options?.materials}
          required={true}
          renderInput={(params) => (
            <TextField {...params} label="Materials" required />
          )}
        />

        {options?.materials === "Cement" && (
          <>
            <Autocomplete
              id="concreteClassOptions_id"
              options={concreteClassOptions.map((option) => option.class)}
              name="concreteClass"
              value={options?.concreteClass}
              placeholder="Choose Concrete Class"
              onSelect={(e) => handleOnSelect(e, "concreteClass")}
              required={true}
              renderInput={(params) => (
                <TextField {...params} label="Concrete Class" required />
              )}
            />
            <TextField
              type="number"
              name="cum"
              label="Cubic Meters"
              placeholder="Enter Cubic Metres"
              onChange={handleOnChange}
              value={options?.cum}
            />
          </>
        )}
        {options?.materials === "Beams" && (
          <>
            <Autocomplete
              id="beamSizeOptions_id"
              options={beamSizeOptions.map((option) => option.size)}
              name="beamSize"
              value={options?.beamSize}
              placeholder="Choose Beam Size"
              onSelect={(e) => handleOnSelect(e, "beamSize")}
              required={true}
              renderInput={(params) => (
                <TextField {...params} label="Beam Size" required />
              )}
            />
            <TextField
              type="text"
              name="kgs"
              value={options?.kgs}
              label="Total weight (kgs)"
              placeholder="Enter Weight"
              onChange={handleOnChange}
            />
          </>
        )}

        <Button variant="outlined" type="submit" className="button">
          {Object.keys(formData).length === 0 ? "Gererate" : "Update"}
        </Button>
      </form>
    </div>
  );
};

export default MaterialAddForm;

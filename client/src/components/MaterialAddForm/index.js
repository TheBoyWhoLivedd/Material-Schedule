import React, { useState } from "react";

import { useAddNewMaterialMutation } from "../../features/schedules/schedulesApiSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, TextField } from "@mui/material";
import "./MaterialAddForm.css";
import {
  materialsData,
  concreteClassOptions,
  beamSizeOptions,
} from "../../assets/data";
const MaterialAddForm = ({ formData = {}, id }) => {
  const [addNewMaterial, { isLoading, isSuccess, isError, error }] =
    useAddNewMaterialMutation();

  const [options, setOptions] = useState(formData);

  const handleOnSelect = (e, name) => {
    setOptions({ ...options, [name]: e.target.value });
  };
  const handleOnChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.value });
    console.log(e.target.value);
  };

  // Add Material
  const onSaveMaterialClicked = async (e) => {
    e.preventDefault();
    console.log(options);
    await addNewMaterial({
      id:id,
      description: options.description,
      material: options.material,
      parameters: {
        concreteClass: options.concreteClass,
        cum: options.cum
      },
    });
  };

  return (
    <div>
      <form onSubmit={onSaveMaterialClicked} className="inputsForm">
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
          name="material"
          placeholder="Enter Material"
          onSelect={(e) => handleOnSelect(e, "material")}
          value={options?.material}
          required={true}
          renderInput={(params) => (
            <TextField {...params} label="Materials" required />
          )}
        />

        {options?.material === "Cement" && (
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

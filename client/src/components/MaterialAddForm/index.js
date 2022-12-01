import React, { useState, useEffect } from "react";
import {
  useAddNewMaterialMutation,
  useUpdateMaterialMutation,
} from "../../features/schedules/schedulesApiSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, TextField } from "@mui/material";
import "./MaterialAddForm.css";
import {
  materialsData,
  concreteClassOptions,
  beamSizeOptions,
} from "../../assets/data";
const MaterialAddForm = ({ formData = {}, id, schedule }) => {
  const [addNewMaterial, { isSuccess: isAddSuccess }] =
    useAddNewMaterialMutation();

  const [updateMaterial, { isSuccess }] = useUpdateMaterialMutation();

  useEffect(() => {
    if (isSuccess || isAddSuccess) {
      //Set the state that closes the modals
    }
  }, [isSuccess, isAddSuccess]);
  const [options, setOptions] = useState(formData);
  console.log(options);
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
      
      id: id,
      description: options.description,
      materialName: options.materialName,
      parameters: {
        concreteClass: options.concreteClass,
        cum: options.cum,
      },
    });
  };

  const onUpdateMaterialClicked = async (e) => {
    e.preventDefault();
    await updateMaterial({

      id: id,
      _id: options._id,
      description: options.description,
      materialName: options.materialName,
      parameters: {
        concreteClass: options.concreteClass,
        cum: options.cum,
      },
    });
  };

  // Update Material

  return (
    <div>
      <form className="inputsForm">
        <TextField
          type="text"
          name="description"
          label="Description"
          placeholder="Enter Description"
          onChange={handleOnChange}
          value={options?.materialDescription}
          required
        />
        <Autocomplete
          id="materials_id"
          options={materialsData.map((option) => option)}
          name="materialName"
          placeholder="Enter Material"
          onSelect={(e) => handleOnSelect(e, "materialName")}
          value={options?.materialName}
          required={true}
          renderInput={(params) => (
            <TextField {...params} label="Materials" required />
          )}
        />

        {options?.materialName === "Cement" && (
          <>
            <Autocomplete
              id="concreteClassOptions_id"
              options={concreteClassOptions.map((option) => option.class)}
              name="concreteClass"
              value={options?.parameters?.concreteClass}
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
              value={options?.parameters?.cum}
            />
          </>
        )}
        {options?.materialName === "Beams" && (
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

        {Object.keys(formData).length === 0 ? (
          <Button
            onClick={onSaveMaterialClicked}
            variant="outlined"
            type="submit"
            className="button"
          >
            Generate
          </Button>
        ) : (
          <Button
            onClick={onUpdateMaterialClicked}
            variant="outlined"
            type="submit"
            className="button"
          >
            Update
          </Button>
        )}
      </form>
    </div>
  );
};

export default MaterialAddForm;

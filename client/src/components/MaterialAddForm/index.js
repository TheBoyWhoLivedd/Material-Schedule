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
  elementsData,
  concreteMaterialsData,
  wallingMaterialsData,
  mortarOptions,
  reinforcementMaterialsData,
  brcSizeOptions,
  rebarSizeOptions,
  bondData,
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
        <Autocomplete
          id="elements_id"
          options={elementsData.map((option) => option)}
          name="elementName"
          placeholder="Choose Element"
          onSelect={(e) => handleOnSelect(e, "elementName")}
          value={options?.elementName}
          required={true}
          renderInput={(params) => (
            <TextField {...params} label="Choose Element" required />
          )}
        />

        {options?.elementName === "Concrete" && (
          <>
            {/* <Autocomplete
              id="concreteMaterials_id"
              options={concreteMaterialsData.map((option) => option)}
              name="materialName"
              placeholder="Enter Material"
              onSelect={(e) => handleOnSelect(e, "materialName")}
              value={options?.materialName}
              required={true}
              renderInput={(params) => (
                <TextField {...params} label="Materials" required />
              )}
            /> */}
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
        {options?.elementName === "Walling" && (
          <>
            <Autocomplete
              id="wallingMaterials_id"
              options={wallingMaterialsData.map((option) => option)}
              name="materialName"
              placeholder="Enter Material"
              onSelect={(e) => handleOnSelect(e, "materialName")}
              value={options?.materialName}
              required={true}
              renderInput={(params) => (
                <TextField {...params} label="Materials" required />
              )}
            />
            <Autocomplete
              id="bond_id"
              options={bondData.map((option) => option)}
              name="bondName"
              placeholder="Choose Bond Type"
              onSelect={(e) => handleOnSelect(e, "bondName")}
              value={options?.bondName}
              required={true}
              renderInput={(params) => (
                <TextField {...params} label="Bond Type" required />
              )}
            />
            <Autocomplete
              id="mortarOptions_id"
              options={mortarOptions.map((option) => option.ratio)}
              name="mortarRatio"
              value={options?.parameters?.ratio}
              placeholder="Choose Mortar Ratio"
              onSelect={(e) => handleOnSelect(e, "mortarRatio")}
              required={true}
              renderInput={(params) => (
                <TextField {...params} label="Mortar Ratio" required />
              )}
            />
            <TextField
              type="text"
              name="wallArea"
              value={options?.area}
              label="Wall Area (sqm)"
              placeholder="Enter Wall Area"
              onChange={handleOnChange}
            />
          </>
        )}
        {options?.elementName === "Reinforcement" && (
          <>
            <Autocomplete
              id="reinforcementMaterials_id"
              options={reinforcementMaterialsData.map((option) => option)}
              name="materialName"
              placeholder="Enter Material"
              onSelect={(e) => handleOnSelect(e, "materialName")}
              value={options?.materialName}
              required={true}
              renderInput={(params) => (
                <TextField {...params} label="Materials" required />
              )}
            />
            {options?.materialName === "BRC" && (
              <>
                <Autocomplete
                  id="brcSizeOptions_id"
                  options={brcSizeOptions.map((option) => option.size)}
                  name="brcSize"
                  value={options?.parameters?.size}
                  placeholder="Choose BRC Size"
                  onSelect={(e) => handleOnSelect(e, "brcSize")}
                  required={true}
                  renderInput={(params) => (
                    <TextField {...params} label="BRC Size" required />
                  )}
                />
                <TextField
                  type="text"
                  name="Area"
                  value={options?.area}
                  label="Area (sqm)"
                  placeholder="Area"
                  onChange={handleOnChange}
                />
              </>
            )}
            {options?.materialName === "Rebar" && (
              <>
                <Autocomplete
                  id="rebarSizeOptions_id"
                  options={rebarSizeOptions.map((option) => option.size)}
                  name="rebarSize"
                  value={options?.parameters?.size}
                  placeholder="Choose Rebar Diameter (mm)"
                  onSelect={(e) => handleOnSelect(e, "rebarSize")}
                  required={true}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Rebar Diameter (mm)"
                      required
                    />
                  )}
                />
                <TextField
                  type="text"
                  name="Kgs"
                  value={options?.kgs}
                  label="Kilograms"
                  placeholder="Total Kilograms"
                  onChange={handleOnChange}
                />
              </>
            )}
          </>
        )}
        <TextField
          type="text"
          name="description"
          label="Description"
          placeholder="Enter Description"
          onChange={handleOnChange}
          value={options?.materialDescription}
        />
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

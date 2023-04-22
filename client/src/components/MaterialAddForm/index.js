//why isnt the required prop working on the textfields?
import React, { useState, useEffect } from "react";

import {
  useAddNewMaterialMutation,
  useUpdateMaterialMutation,
} from "../../features/schedules/schedulesApiSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, TextField, useTheme } from "@mui/material";
import "./MaterialAddForm.css";
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
import { evaluate } from "mathjs";

const MaterialAddForm = ({
  formData = {},
  id,
  handleClose,
  openSnackbarWithMessage,
}) => {
  const theme = useTheme();
  const [addNewMaterial, { isSuccess: isAddSuccess }] =
    useAddNewMaterialMutation();

  const [updateMaterial, { isLoading, isSuccess }] =
    useUpdateMaterialMutation();


  const [options, setOptions] = useState(formData);
  const [error, setError] = React.useState("");

  console.log(options);
  const handleOnElementSelect = (e, name) => {
    setOptions({ ...options, [name]: e.target.value });
  };
  const handleOnSelect = (e, name) => {
    setOptions({ ...options, [name]: e.target.value });
  };
  const handleOnChange = (e) => {
    setOptions({ ...options, [e.target.name]: e.target.value });

    console.log(e.target.value);
  };
  const handleOnParamSelect = (e, name) => {
    setOptions({
      ...options,
      parameters: { ...options.parameters, [name]: e.target.value },
    });
  };
  const handleOnParamChange = (e) => {
    setOptions({
      ...options,
      parameters: { ...options.parameters, [e.target.name]: e.target.value },
    });

    console.log(e.target.value);
  };
  const handleOnCalcParamChange = (e) => {
    try {
      // Check the input string for any incomplete expressions

      const regex = /[+-/*]$|[(][^)]*$/;
      if (regex.test(e.target.value)) {
        // If there is an incomplete expression, don't evaluate the input
        setError(
          "The expression is incomplete because it has an open brcaket or missing operator at end"
        );
        setOptions({
          ...options,
          parameters: {
            ...options.parameters,
            expression: e.target.value,
            [e.target.name]: e.target.value,
          },
        });
      } else {
        // Use the math.js evaluate function to calculate the result
        const result = evaluate(e.target.value);
        setOptions({
          ...options,
          parameters: {
            ...options.parameters,
            expression: e.target.value,
            [e.target.name]: result,
          },
        });

        setError(false);
        // If the calculation is successful, update the state or UI to show the result
      }
    } catch (error) {
      // If an error occurs, you can set the error message using the TextField's error prop
      setError(error.message);
      console.log(error);
    }
  };

  //validating that all object keys have values before sending update request
  let canSave;
  if ("parameters" in options) {
    const allPropsWithValue = Object.keys(options).every(
      (key) => options[key] !== undefined && options[key] !== null
    );
    const allParamPropsWithValue = Object.keys(options.parameters).every(
      (key) =>
        options.parameters[key] !== undefined &&
        options.parameters[key] !== null
    );
    canSave = allPropsWithValue && allParamPropsWithValue && !isLoading;
    console.log(canSave);
  } else {
    const allPropsWithValue = Object.keys(options).every(
      (key) =>
        options[key] !== undefined &&
        options[key] !== null &&
        options[key] !== ""
    );
    canSave = allPropsWithValue;
  }

  
  //preventing edit of elementName property if calculation from backend has already been made
  const canEdit = "_id" in options;

  // Add Material
  const onSaveMaterialClicked = async (e) => {
    e.preventDefault();
    console.log(options);
    try {
      const response = await addNewMaterial({
        id: id,
        elementName: options.elementName,
        description: options.materialDescription,
        materialName: options.materialName,
        parameters: options.parameters,
        materialType: options?.materialType,
        computedValue: options?.computedValue,
        materialUnit: options?.materialUnit,
      });

      if (response.data.isError) {
        console.log(`Error: ${response.message}`);  
        openSnackbarWithMessage(`Error: ${response.data.message}`);
      } else {
        handleClose();
        openSnackbarWithMessage(`Material Added Successfully`);
      }
    } catch (error) {
      openSnackbarWithMessage(`Error: ${error.message}`);
    }
  };
  

const onUpdateMaterialClicked = async (e) => {
  e.preventDefault();
  try {
    await updateMaterial({
      id: id,
      _id: options._id,
      elementName: options.elementName,
      description: options.materialDescription,
      materialName: options.materialName,
      parameters: options.parameters,
      materialType: options?.materialType,
      relatedId: options?.relatedId,
      computedValue: options?.computedValue,
      materialUnit: options?.materialUnit,
    }).then(() => {
      handleClose();
    });
  } catch (error) {
    openSnackbarWithMessage(`Error: ${error.message}`);
  }
};
  // Update Material

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <form className="inputsForm">
        <Autocomplete
          id="elements_id"
          options={elementsData.map((option) => option)}
          name="elementName"
          placeholder="Choose Element"
          onSelect={(e) => handleOnElementSelect(e, "elementName")}
          value={options?.elementName}
          disabled={canEdit}
          // required
          renderInput={(params) => (
            <TextField {...params} label="Choose Element" required  />
          )}
        />

        {options?.elementName === "Concrete" && (
          <>
            <Autocomplete
              id="concreteClassOptions_id"
              options={concreteClassOptions.map((option) => option.class)}
              name="concreteClass"
              value={options?.parameters?.concreteClass}
              placeholder="Choose Concrete Class"
              onSelect={(e) => handleOnParamSelect(e, "concreteClass")}
              required
              renderInput={(params) => (
                <TextField {...params} label="Concrete Class" required />
              )}
            />
            <TextField
              type="string"
              name="cum"
              label="Cubic Meters"
              placeholder="Enter Cubic Metres"
              onChange={handleOnCalcParamChange}
              value={options?.parameters?.expression}
              required
              error={Boolean(error)}
              helperText={error}
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
              onSelect={(e) => handleOnSelect(e, "materialType")}
              value={options?.materialType}
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
              onSelect={(e) => handleOnParamSelect(e, "bondName")}
              value={options?.parameters?.bondName}
              required={true}
              renderInput={(params) => (
                <TextField {...params} label="Bond Type" required />
              )}
            />
            <TextField
              type="text"
              name="wallArea"
              value={options?.parameters?.expression}
              label="Wall Area (sqm)"
              placeholder="Enter Wall Area"
              onChange={handleOnCalcParamChange}
              error={Boolean(error)}
              helperText={error}
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
              disabled={canEdit}
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
                  value={options?.parameters?.brcSize}
                  placeholder="Choose BRC Size"
                  onSelect={(e) => handleOnParamSelect(e, "brcSize")}
                  required={true}
                  renderInput={(params) => (
                    <TextField {...params} label="BRC Size" required />
                  )}
                />
                <TextField
                  type="text"
                  name="area"
                  value={options?.parameters?.expression}
                  label="Area (sqm)"
                  placeholder="Area"
                  onChange={handleOnCalcParamChange}
                  error={Boolean(error)}
                  helperText={error}
                />
              </>
            )}
            {options?.materialName === "Rebar" && (
              <>
                <Autocomplete
                  id="rebarSizeOptions_id"
                  options={rebarSizeOptions.map((option) => option.size)}
                  name="rebarSize"
                  value={options?.parameters?.rebarSize}
                  placeholder="Choose Rebar Diameter (mm)"
                  onSelect={(e) => handleOnParamSelect(e, "rebarSize")}
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
                  value={options?.parameters?.expression}
                  label="Kilograms"
                  placeholder="Total Kilograms"
                  onChange={handleOnCalcParamChange}
                  error={Boolean(error)}
                  helperText={error}
                />
              </>
            )}
          </>
        )}
        {options?.elementName === "Other" && (
          <>
            <TextField
              type="text"
              name="materialName"
              label="Material Name"
              placeholder="Enter Material Name"
              onChange={handleOnChange}
              value={options?.materialName}
              required
              error={Boolean(error)}
              helperText={error}
            />

            <TextField
              type="text"
              name="materialUnit"
              label="Material Unit"
              placeholder="Enter Unit"
              onChange={handleOnChange}
              value={options?.materialUnit}
              required
              error={Boolean(error)}
              helperText={error}
            />

            <TextField
              type="number"
              name="computedValue"
              label="Computed Value"
              placeholder="Enter Computed Value"
              onChange={handleOnChange}
              value={options?.computedValue}
              required
              error={Boolean(error)}
              helperText={error}
            />
          </>
        )}
        <TextField
          type="text"
          name="materialDescription"
          label="Description"
          placeholder="Enter Description"
          onChange={handleOnChange}
          value={options?.materialDescription}
 
        />

        {Object.keys(formData).length === 0 ? (
          <Button
            onClick={onSaveMaterialClicked}
            name="submit"
            variant="outlined"
            type="submit"
            className="button"
            disabled={error}
          >
            Generate
          </Button>
        ) : (
          <Button
            onClick={onUpdateMaterialClicked}
            variant="outlined"
            type="submit"
            className="button"
            disabled={!canSave || error}
          >
            Update
          </Button>
        )}
      </form>
    </div>
  );
};

export default MaterialAddForm;

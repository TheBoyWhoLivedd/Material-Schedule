import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  useAddNewMaterialMutation,
  useUpdateMaterialMutation,
} from "../../features/schedules/schedulesApiSlice";
import Autocomplete from "@mui/material/Autocomplete";
import { Button, TextField, useTheme } from "@mui/material";
import "./MaterialAddForm.css";
import config from "../../assets/config.json";
import { evaluate } from "mathjs";

const MaterialAddForm = ({
  formData = {},
  id,
  handleClose,
  openSnackbarWithMessage,
}) => {
  const theme = useTheme();
  const [addNewMaterial, { isSuccess: isAddSuccess, isLoading: isAddLoading }] =
    useAddNewMaterialMutation();

  const [
    updateMaterial,
    { isLoading: isUpdateLoading, isSuccess: isUpdateSuccess },
  ] = useUpdateMaterialMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      elementName: formData.elementName || "",
      materialDescription: formData.materialDescription || "",
      materialName: formData.materialName || "",
      categoryName: formData.categoryName || "",
      materialType: formData.materialType || "",
      materialUnit: formData.materialUnit || "",
      computedValue: formData.computedValue || "",
      parameters: formData.parameters || {},
    },
  });

  const [calcError, setCalcError] = useState({});

  const watchedValues = watch();

  const handleOnCalcParamChange = (fieldName, value) => {
    // Reset error for this field
    setCalcError((prev) => ({ ...prev, [fieldName]: null }));

    // If the value is empty, set an error and return
    if (value.trim() === "") {
      setCalcError((prev) => ({ ...prev, [fieldName]: "Required" }));
      return "Required";
    }

    // Check if the input is a valid number
    if (!isNaN(value) && value.trim() !== "") {
      const numericValue = parseFloat(value);
      setValue(`parameters.${fieldName}Expression`, value.trim(), {
        shouldValidate: true,
      });
      setValue(`parameters.${fieldName}`, numericValue, {
        shouldValidate: true,
      });
      return true;
    }

    // If not a number, attempt to evaluate it as an expression
    try {
      // Basic validation for BODMAS expression
      if (!/^[\d\s\+\-\*\/\(\)\.]+$/.test(value)) {
        throw new Error("Invalid characters in expression");
      }

      // Evaluate the expression
      const result = evaluate(value);

      if (typeof result !== "number" || isNaN(result)) {
        throw new Error("Expression did not evaluate to a valid number");
      }

      // If valid, set the expression and evaluated value
      setValue(`parameters.${fieldName}Expression`, value.trim(), {
        shouldValidate: true,
      });
      setValue(`parameters.${fieldName}`, result, { shouldValidate: true });
      return true;
    } catch (error) {
      setCalcError((prev) => ({ ...prev, [fieldName]: error.message }));
      return error.message;
    }
  };

  const canEdit = useMemo(() => "_id" in formData, [formData]);

  const onSubmit = async (data) => {
    try {
      let response;
      if (Object.keys(formData).length === 0) {
        response = await addNewMaterial({
          id: id,
          ...data,
        });
      } else {
        response = await updateMaterial({
          id: id,
          _id: formData._id,
          relatedId: formData.relatedId,
          ...data,
        });
      }

      if (response.data?.isError) {
        openSnackbarWithMessage(`Error: ${response.data.message}`);
      } else {
        handleClose();
        openSnackbarWithMessage(
          `${
            Object.keys(formData).length === 0
              ? "Material Added"
              : "Material Updated"
          } Successfully`
        );
      }
    } catch (error) {
      openSnackbarWithMessage(`Error: ${error.message}`);
    }
  };

  const selectedUnit = watchedValues?.parameters?.unit;

  // Determine if there are any calculation errors
  const hasCalcErrors = Object.values(calcError).some((error) => error);

  return (
    <div
      style={{
        backgroundColor: theme.palette.background.default,
      }}
    >
      <form className="inputsForm" onSubmit={handleSubmit(onSubmit)}>
        {/* Element Name */}
        <Controller
          name="elementName"
          control={control}
          rules={{ required: "Element Name is required" }}
          render={({ field }) => (
            <Autocomplete
              {...field}
              id="elements_id"
              options={config.elements.map((option) => option.name)}
              placeholder="Choose Element"
              onChange={(e, value) => field.onChange(value)}
              disabled={canEdit}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Choose Element"
                  required
                  error={!!errors.elementName}
                  helperText={errors.elementName?.message}
                />
              )}
            />
          )}
        />

        {/* Concrete Section */}
        {watchedValues?.elementName === "Concrete" && (
          <>
            {/* Concrete Class */}
            <Controller
              name="parameters.concreteClass"
              control={control}
              rules={{ required: "Concrete Class is required" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  id="concreteClassOptions_id"
                  options={
                    config.elements.find(
                      (element) => element.name === "Concrete"
                    ).concreteClasses
                  }
                  placeholder="Choose Concrete Class"
                  onChange={(e, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Concrete Class"
                      required
                      error={!!errors.parameters?.concreteClass}
                      helperText={errors.parameters?.concreteClass?.message}
                    />
                  )}
                />
              )}
            />

            {/* Cubic Metres */}
            <Controller
              name="parameters.cumExpression"
              control={control}
              rules={{
                required: "Cubic Metres is required",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Cubic Metres"
                  placeholder="Enter Cubic Metres or Expression"
                  required
                  error={!!errors.parameters?.cum || !!calcError.cum}
                  helperText={errors.parameters?.cum?.message || calcError.cum}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    // Pass the value and field name to the handler
                    handleOnCalcParamChange("cum", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Walling Section */}
        {watchedValues?.elementName === "Walling" && (
          <>
            {/* Material Type */}
            <Controller
              name="materialType"
              control={control}
              rules={{ required: "Material Type is required" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(e, value) => field.onChange(value)}
                  options={
                    config.elements.find((el) => el.name === "Walling")
                      .materials
                  }
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Materials"
                      required
                      error={!!errors.materialType}
                      helperText={errors.materialType?.message}
                    />
                  )}
                />
              )}
            />

            {/* Bond Name */}
            <Controller
              name="parameters.bondName"
              control={control}
              rules={{ required: "Bond Type is required" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  onChange={(e, value) => field.onChange(value)}
                  options={
                    config.elements.find((el) => el.name === "Walling").bonds
                  }
                  isOptionEqualToValue={(option, value) => option === value}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Bond Type"
                      required
                      error={!!errors.parameters?.bondName}
                      helperText={errors.parameters?.bondName?.message}
                    />
                  )}
                />
              )}
            />

            {/* Wall Area */}
            <Controller
              name="parameters.expression"
              control={control}
              rules={{
                required: "Wall Area is required",
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Wall Area (sqm)"
                  placeholder="Enter Wall Area or Expression"
                  required
                  error={!!errors.parameters?.wallArea || !!calcError.wallArea}
                  helperText={
                    errors.parameters?.wallArea?.message || calcError.wallArea
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    // Pass the value and field name to the handler
                    handleOnCalcParamChange("wallArea", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Reinforcement Section */}
        {watchedValues?.elementName === "Reinforcement" && (
          <>
            {/* Material Name */}
            <Controller
              name="materialName"
              control={control}
              rules={{ required: "Material Name is required" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                   id="reinforcementMaterials_id"
                  options={
                    config.elements.find(
                      (element) => element.name === "Reinforcement"
                    ).materials
                  }
                  onChange={(e, value) => {
                    console.log("value", value);
                    field.onChange(value);
                  }}
                  isOptionEqualToValue={(option, value) => option === value}
                  disabled={canEdit}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Materials"
                      required
                      error={!!errors.materialName}
                      helperText={errors.materialName?.message}
                    />
                  )}
                />
              )}
            />
            {/* BRC Section */}
            {watchedValues?.materialName === "BRC" && (
              <>
                <Controller
                  name="parameters.brcSize"
                  control={control}
                  rules={{ required: "BRC Size is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={
                        config.elements.find(
                          (element) => element.name === "Reinforcement"
                        ).brcSizes
                      }
                      onChange={(e, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="BRC Size"
                          required
                          error={!!errors.parameters?.brcSize}
                          helperText={errors.parameters?.brcSize?.message}
                        />
                      )}
                    />
                  )}
                />
                {/* Area */}
                <Controller
                  name="parameters.expression"
                  control={control}
                  rules={{ required: "Area is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      label="Area (sqm)"
                      placeholder="Enter Area"
                      required
                      error={!!calcError.area || !!errors.parameters?.area}
                      helperText={
                        calcError.area || errors.parameters?.area?.message
                      }
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleOnCalcParamChange("area", e.target.value);
                      }}
                    />

                  )}
                />
              </>
            )}
            {/* Rebar Section */}
            {watchedValues?.materialName === "Rebar" && (
              <>
                <Controller
                  name="parameters.rebarSize"
                  control={control}
                  rules={{ required: "Rebar Diameter is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={
                        config.elements.find(
                          (element) => element.name === "Reinforcement"
                        ).rebarSizes
                      }
                      onChange={(e, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Rebar Diameter (mm)"
                          required
                          error={!!errors.parameters?.rebarSize}
                          helperText={errors.parameters?.rebarSize?.message}
                        />
                      )}
                    />
                  )}
                />
                {/* Kilograms */}
                <Controller
                  name="parameters.expression"
                  control={control}
                  rules={{ required: "Kilograms is required" }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="text"
                      label="Kilograms"
                      placeholder="Enter Kilograms"
                      required
                      error={!!calcError.Kgs || !!errors.parameters?.Kgs}
                      helperText={
                        calcError.Kgs || errors.parameters?.Kgs?.message
                      }
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        handleOnCalcParamChange("Kgs", e.target.value);
                      }}
                    />
                  )}
                />
              </>
            )}
          </>
        )}

        {/* Anti-Termite Treatment */}
        {watchedValues?.elementName === "Anti-Termite Treatment" && (
          <>
            <Controller
              name="parameters.expression"
              control={control}
              rules={{ required: "Square Metres is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Square Metres"
                  placeholder="Enter Square Metres"
                  required
                  error={!!calcError.surfaceArea || !!errors.parameters?.surfaceArea}
                  helperText={
                    calcError.surfaceArea || errors.parameters?.surfaceArea?.message
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleOnCalcParamChange("surfaceArea", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Murram */}
        {watchedValues?.elementName === "Murram" && (
          <>
            <Controller
              name="parameters.expression"
              control={control}
              rules={{ required: "Cubic Metres is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Cubic Metres"
                  placeholder="Enter Cubic Metres"
                  required
                  error={!!calcError.cum || !!errors.parameters?.cum}
                  helperText={
                    calcError.cum || errors.parameters?.cum?.message
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleOnCalcParamChange("cum", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Hardcore */}
        {watchedValues?.elementName === "Hardcore" && (
          <>
            <Controller
              name="parameters.unit"
              control={control}
              rules={{ required: "Unit of Measurement is required" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    config.elements.find(
                      (element) => element.name === "Hardcore"
                    ).unit
                  }
                  onChange={(e, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Unit of Measurement"
                      required
                      error={!!errors.parameters?.unit}
                      helperText={errors.parameters?.unit?.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              name="parameters.expression"
              control={control}
              rules={{ required: "Value is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={
                    selectedUnit === "CM" ? "Cubic Metres" : "Square Metres"
                  }
                  placeholder={
                    selectedUnit === "CM"
                      ? "Enter Cubic Metres"
                      : "Enter Square Metres"
                  }
                  required
                  error={!!calcError.cum || !!errors.parameters?.cum}
                  helperText={
                    calcError.cum || errors.parameters?.cum?.message
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleOnCalcParamChange("cum", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Sand Blinding */}
        {watchedValues?.elementName === "Sand Blinding" && (
          <>
            <Controller
              name="parameters.expression"
              control={control}
              rules={{ required: "Square Metres is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Square Metres"
                  placeholder="Enter Square Metres"
                  required
                  error={!!calcError.surfaceArea || !!errors.parameters?.surfaceArea}
                  helperText={
                    calcError.surfaceArea || errors.parameters?.surfaceArea?.message
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleOnCalcParamChange("surfaceArea", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Damp Proof Membrane */}
        {watchedValues?.elementName === "Damp Proof Membrane" && (
          <>
            <Controller
              name="parameters.expression"
              control={control}
              rules={{ required: "Square Metres is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Square Metres"
                  placeholder="Enter Square Metres"
                  required
                  error={!!calcError.surfaceArea || !!errors.parameters?.surfaceArea}
                  helperText={
                    calcError.surfaceArea || errors.parameters?.surfaceArea?.message
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleOnCalcParamChange("surfaceArea", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Damp Proof Course */}
        {watchedValues?.elementName === "Damp Proof Course" && (
          <>
            <Controller
              name="parameters.expression"
              control={control}
              rules={{ required: "Linear Metres is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Linear Metres"
                  placeholder="Enter Linear Metres"
                  required
                  error={!!calcError.lm || !!errors.parameters?.lm}
                  helperText={
                    calcError.lm || errors.parameters?.lm?.message
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleOnCalcParamChange("lm", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Steel Work */}
        {watchedValues?.elementName === "Steel Work" && (
          <>
            {/* Material Name */}
            <Controller
              name="materialName"
              control={control}
              rules={{ required: "Material Name is required" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    config.elements.find(
                      (element) => element.name === "Steel Work"
                    ).materials
                  }
                  onChange={(e, value) => field.onChange(value)}
                  disabled={canEdit}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Materials"
                      required
                      error={!!errors.materialName}
                      helperText={errors.materialName?.message}
                    />
                  )}
                />
              )}
            />
            {/* Section Size */}
            {[
              "UB/IPE/UC",
              "Hollow Sections",
              "CHS",
              "RSC/PFC",
              "JIS",
              "CFC/Z/CFLC(Purlins)",
              "CFA",
              "RSA",
            ].includes(watchedValues?.materialName) && (
              <>
                <Controller
                  name="parameters.sectionSize"
                  control={control}
                  rules={{ required: "Section Size is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={
                        config.elements.find(
                          (element) => element.name === "Steel Work"
                        )[
                          {
                            "UB/IPE/UC": "UB",
                            "Hollow Sections": "HS",
                            CHS: "CHS",
                            "RSC/PFC": "RSC",
                            JIS: "JIS",
                            "CFC/Z/CFLC(Purlins)": "CFC",
                            CFA: "CFA",
                            RSA: "RSA",
                          }[watchedValues?.materialName]
                        ]
                      }
                      onChange={(e, value) => field.onChange(value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Section Size"
                          required
                          error={!!errors.parameters?.sectionSize}
                          helperText={errors.parameters?.sectionSize?.message}
                        />
                      )}
                    />
                  )}
                />
              </>
            )}
            {/* Unit */}
            <Controller
              name="parameters.unit"
              control={control}
              rules={{ required: "Unit of Measurement is required" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    config.elements.find(
                      (element) => element.name === "Steel Work"
                    ).unit
                  }
                  onChange={(e, value) => field.onChange(value)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Unit of Measurement"
                      required
                      error={!!errors.parameters?.unit}
                      helperText={errors.parameters?.unit?.message}
                    />
                  )}
                />
              )}
            />
            {/* Value */}
            <Controller
              name="parameters.expression"
              control={control}
              rules={{ required: "Value is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label={selectedUnit === "LM" ? "Linear Metres" : "Kilograms"}
                  placeholder={
                    selectedUnit === "LM"
                      ? "Enter Linear Metres"
                      : "Enter Kilograms"
                  }
                  required
                  error={!!calcError.eval || !!errors.parameters?.eval}
                  helperText={
                    calcError.eval || errors.parameters?.eval?.message
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleOnCalcParamChange("eval", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Finishes */}
        {watchedValues?.elementName === "Finishes" && (
          <>
            {/* Category Name */}
            <Controller
              name="categoryName"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={
                    config.elements.find(
                      (element) => element.name === "Finishes"
                    ).category
                  }
                  onChange={(e, value) => field.onChange(value)}
                  disabled={canEdit}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Category"
                      required
                      error={!!errors.categoryName}
                      helperText={errors.categoryName?.message}
                    />
                  )}
                />
              )}
            />
            {/* Floor Finishes */}
            {watchedValues?.categoryName === "Floor Finishes" && (
              <>
                <Controller
                  name="materialName"
                  control={control}
                  rules={{ required: "Material Name is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={
                        config.elements.find(
                          (element) => element.name === "Finishes"
                        ).floorMaterials
                      }
                      onChange={(e, value) => field.onChange(value)}
                      disabled={canEdit}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Materials"
                          required
                          error={!!errors.materialName}
                          helperText={errors.materialName?.message}
                        />
                      )}
                    />
                  )}
                />
                {/* CSS Class */}
                {watchedValues?.materialName === "Cement sand screed" && (
                  <>
                    <Controller
                      name="parameters.cssClass"
                      control={control}
                      rules={{ required: "CSS Class is required" }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={
                            config.elements.find(
                              (element) => element.name === "Finishes"
                            ).cssClass
                          }
                          onChange={(e, value) => field.onChange(value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="CSS Class"
                              required
                              error={!!errors.parameters?.cssClass}
                              helperText={errors.parameters?.cssClass?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </>
                )}
              </>
            )}
            {/* Wall Finishes */}
            {watchedValues?.categoryName === "Wall Finishes" && (
              <>
                <Controller
                  name="materialName"
                  control={control}
                  rules={{ required: "Material Name is required" }}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={
                        config.elements.find(
                          (element) => element.name === "Finishes"
                        ).wallMaterials
                      }
                      onChange={(e, value) => field.onChange(value)}
                      disabled={canEdit}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Materials"
                          required
                          error={!!errors.materialName}
                          helperText={errors.materialName?.message}
                        />
                      )}
                    />
                  )}
                />
                {/* CSS Class */}
                {watchedValues?.materialName === "Cement sand screed" && (
                  <>
                    <Controller
                      name="parameters.cssClass"
                      control={control}
                      rules={{ required: "CSS Class is required" }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={
                            config.elements.find(
                              (element) => element.name === "Finishes"
                            ).cssClass
                          }
                          onChange={(e, value) => field.onChange(value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="CSS Class"
                              required
                              error={!!errors.parameters?.cssClass}
                              helperText={errors.parameters?.cssClass?.message}
                            />
                          )}
                        />
                      )}
                    />
                  </>
                )}
                {/* Plaster Class */}
                {watchedValues?.materialName === "Plastering and rendering" && (
                  <>
                    <Controller
                      name="parameters.plasterClass"
                      control={control}
                      rules={{ required: "Plaster Class is required" }}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={
                            config.elements.find(
                              (element) => element.name === "Finishes"
                            ).plasterClass
                          }
                          onChange={(e, value) => field.onChange(value)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Plaster Class"
                              required
                              error={!!errors.parameters?.plasterClass}
                              helperText={
                                errors.parameters?.plasterClass?.message
                              }
                            />
                          )}
                        />
                      )}
                    />
                  </>
                )}
              </>
            )}
            {/* Area */}
            <Controller
              name="parameters.expression"
              control={control}
              rules={{ required: "Area is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="text"
                  label="Area (sqm)"
                  placeholder="Enter Area"
                  required
                  error={!!calcError.area || !!errors.parameters?.area}
                  helperText={
                    calcError.area || errors.parameters?.area?.message
                  }
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    handleOnCalcParamChange("area", e.target.value);
                  }}
                />
              )}
            />
          </>
        )}

        {/* Other */}
        {watchedValues?.elementName === "Other" && (
          <>
            <Controller
              name="materialName"
              control={control}
              rules={{ required: "Material Name is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Material Name"
                  placeholder="Enter Material Name"
                  required
                  error={!!errors.materialName}
                  helperText={errors.materialName?.message}
                />
              )}
            />

            <Controller
              name="materialUnit"
              control={control}
              rules={{ required: "Material Unit is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Material Unit"
                  placeholder="Enter Unit"
                  required
                  error={!!errors.materialUnit}
                  helperText={errors.materialUnit?.message}
                />
              )}
            />

            <Controller
              name="computedValue"
              control={control}
              rules={{ required: "Computed Value is required" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="number"
                  label="Computed Value"
                  placeholder="Enter Computed Value"
                  required
                  error={!!errors.computedValue}
                  helperText={errors.computedValue?.message}
                />
              )}
            />
          </>
        )}

        {/* Description */}
        <Controller
          name="materialDescription"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              type="text"
              label="Description"
              required
              multiline
              rows={4}
              placeholder="Enter Description"
              onChange={field.onChange}
              value={field.value}
            />
          )}
        />

        {/* Submit Button */}
        {Object.keys(formData).length === 0 ? (
          <Button
            variant="outlined"
            type="submit"
            className="button"
            disabled={!isValid || isAddLoading || hasCalcErrors}
          >
            {isAddLoading ? "Generating..." : "Generate"}
          </Button>
        ) : (
          <Button
            variant="outlined"
            type="submit"
            className="button"
            disabled={!isValid || isUpdateLoading || hasCalcErrors}
          >
            {isUpdateLoading ? "Updating..." : "Update"}
          </Button>
        )}
      </form>
    </div>
  );
};

export default MaterialAddForm;

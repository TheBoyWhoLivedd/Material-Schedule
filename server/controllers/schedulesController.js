const Schedule = require("../models/Schedule");
const User = require("../models/User");
const mongoose = require("mongoose");
const ExcelJS = require("exceljs");
const moment = require("moment");
const { v4: uuid } = require("uuid");
const {
  materialsAggregationPipeline,
  applicationAggregationPipeline,
} = require("../utils/aggregatePipeline");

const {
  handleConcrete,
  handleReinforcementBRC,
  handleReinforcementRebar,
  handleWallingBricks,
  handleWallingBlocks,
  handleOther,
  updateConcrete,
  updateBRC,
  updateRebar,
  updateWalling,
} = require("../utils/helpers.js");

// @desc Get all schedules
// @route GET /schedules
// @access Private

// const updateBalanceAllowable = async (schedule, objectId) => {
//   const totalRequested = schedule.totalRequested;
//   const summary = schedule.summary;

//   console.log("totalRequested", totalRequested);
//   console.log("summary", summary);

//   // Create a map from the balanceAllowable array for faster lookup
//   const balanceAllowableMap = new Map(
//     schedule.balanceAllowable.map((item) => [item._id, item.Value])
//   );

//   for (const { _id: requestedId, amountRequested } of totalRequested) {
//     const summaryItem = summary.find(
//       ({ _id: summaryId }) => summaryId === requestedId
//     );

//     if (summaryItem) {
//       const currentAllowableValue = balanceAllowableMap.get(requestedId) || 0;
//       const newAllowableValue = summaryItem.Value - parseFloat(amountRequested);

//       // Update the value in the map
//       balanceAllowableMap.set(requestedId, newAllowableValue);

//       // Update the value in the database
//       await Schedule.updateMany(
//         { _id: objectId, "balanceAllowable._id": requestedId },
//         { $set: { "balanceAllowable.$.Value": newAllowableValue } }
//       );

//       // If there was no previous balanceAllowable item, add a new one
//       if (!currentAllowableValue) {
//         const newBalanceAllowableItem = {
//           _id: requestedId,
//           Value: newAllowableValue,
//         };
//         await Schedule.updateMany(
//           { _id: objectId },
//           { $push: { balanceAllowable: newBalanceAllowableItem } }
//         );
//       }
//     }
//   }

//   // Remove any items in balanceAllowable that are not in totalRequested or summary
//   for (const { _id } of schedule.balanceAllowable) {
//     if (!totalRequested.some(({ _id: requestedId }) => requestedId === _id)) {
//       await Schedule.updateMany(
//         { _id: objectId },
//         { $pull: { balanceAllowable: { _id } } }
//       );
//     }
//   }
// };

const updateBalanceAllowable = async (schedule, objectId) => {
  const totalRequested = schedule.totalRequested;
  const summary = schedule.summary;

  console.log("totalRequested", totalRequested);
  console.log("summary", summary);

  const balanceAllowableMap = new Map(
    schedule.balanceAllowable.map((item) => [item._id, item.Value])
  );
  const summaryMap = new Map(summary.map((item) => [item._id, item]));

  const bulkUpdates = [];

  for (const { _id: requestedId, amountRequested } of totalRequested) {
    const summaryItem = summaryMap.get(requestedId);

    if (summaryItem) {
      const currentAllowableValue = balanceAllowableMap.get(requestedId) || 0;
      const newAllowableValue = summaryItem.Value - parseFloat(amountRequested);

      balanceAllowableMap.set(requestedId, newAllowableValue);

      bulkUpdates.push({
        updateOne: {
          filter: { _id: objectId, "balanceAllowable._id": requestedId },
          update: { $set: { "balanceAllowable.$.Value": newAllowableValue } },
        },
      });

      if (!currentAllowableValue) {
        const newBalanceAllowableItem = {
          _id: requestedId,
          Value: newAllowableValue,
        };

        bulkUpdates.push({
          updateOne: {
            filter: { _id: objectId },
            update: { $push: { balanceAllowable: newBalanceAllowableItem } },
          },
        });
      }
    }
  }

  for (const { _id } of schedule.balanceAllowable) {
    if (!totalRequested.some(({ _id: requestedId }) => requestedId === _id)) {
      bulkUpdates.push({
        updateOne: {
          filter: { _id: objectId },
          update: { $pull: { balanceAllowable: { _id } } },
        },
      });
    }
  }

  if (bulkUpdates.length) {
    await Schedule.bulkWrite(bulkUpdates);
  }
};

const getAllSchedules = async (req, res) => {
  // Get all notes from MongoDB
  const schedules = await Schedule.find().lean();

  // If no notes
  if (!schedules?.length) {
    return res.status(400).json({ message: "No schedules found" });
  }

  // Add username to each schedule before sending the response
  // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
  // You could also do this with a for...of loop
  const schedulesWithUser = await Promise.all(
    schedules.map(async (schedule) => {
      const user = await User.findById(schedule.user).lean().exec();
      return { ...schedule, username: user.username };
    })
  );

  res.json(schedulesWithUser);
};

// @desc Create new schedule
// @route POST /schedules
// @access Private
const createNewSchedule = async (req, res) => {
  const { user, title, contractor, funder, program, tin } = req.body;

  // Confirm data
  if (!user || !title || !contractor || !funder || !program || !tin) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for duplicate title
  const duplicate = await Schedule.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  if (duplicate) {
    return res
      .status(409)
      .json({ message: `Schedule with title ${title} exists` });
  }

  // Create and store the new user
  const schedule = await Schedule.create({
    user,
    title,
    contractor,
    funder,
    program,
    tin,
  });

  if (schedule) {
    // Created
    return res.status(201).json({ message: "New schedule created" });
  } else {
    return res.status(400).json({ message: "Invalid schedule data received" });
  }
};

// @desc Update a schedule
// @route PATCH /schedules
// @access Private
const updateSchedule = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const updateFields = req.body;

  // Confirm data
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({ message: "Please provide a relevant field" });
  }

  // Confirm schedule exists to update
  const schedule = await Schedule.findById(scheduleId).exec();
  if (!schedule) {
    return res.status(400).json({ message: "Schedule not found" });
  }

  // Check for duplicate title
  if (updateFields.title) {
    const duplicate = await Schedule.findOne({ title: updateFields.title })
      .collation({ locale: "en", strength: 2 })
      .lean()
      .exec();

    // Allow renaming of the original schedule
    if (duplicate && duplicate?._id.toString() !== scheduleId) {
      return res.status(409).json({ message: "Duplicate Schedule title" });
    }
  }
  // Exclude id field
  delete updateFields.id;
  // Update fields
  Object.keys(updateFields).forEach((field) => {
    schedule[field] = updateFields[field];
  });

  const updatedSchedule = await schedule.save();

  res.json({
    "message ": "Schedule updated successfully",
    schedule: updatedSchedule,
  });
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
const deleteSchedule = async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "Schedule ID required" });
  }

  // Confirm note exists to delete
  const schedule = await Schedule.findById(id).exec();

  if (!schedule) {
    return res.status(400).json({ message: "Schedule not found" });
  }

  const result = await schedule.deleteOne();

  const reply = `Schedule '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
};

const addScheduleMaterial = async (req, res) => {
  const {
    materialName,
    elementName,
    description,
    parameters,
    materialType,
    materialUnit,
    computedValue, //when the user chooses the "Other" to add a material
  } = req.body;
  const scheduleId = req.params.scheduleId;
  const objectId = mongoose.Types.ObjectId(scheduleId);

  console.log("Request Parametrs", req.params);
  // Confirm data
  if (!elementName || !description) {
    throw new Error("Please provide values for elementName and description");
  }

  // Confirm schedule exists to update
  const schedule = await Schedule.findById(scheduleId).exec();
  const relatedId = uuid();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }

  switch (elementName) {
    case "Concrete":
      if (!parameters.concreteClass || !parameters.cum) {
        throw new Error("Please provide values for concreteClass and cum");
      }
      handleConcrete(schedule, parameters, description, relatedId);
      break;
    case "Reinforcement":
      switch (materialName) {
        case "BRC":
          if (!parameters.brcSize || !parameters.area) {
            throw new Error("Please provide values for brcSize and area");
          }
          handleReinforcementBRC(schedule, parameters, description);
          break;
        case "Rebar":
          if (!parameters.rebarSize || !parameters.Kgs) {
            throw new Error("Please provide values for Rebar Diamter and Kgs");
          }
          handleReinforcementRebar(schedule, parameters, description);
          break;
        default:
          throw new Error("Please Provide a Material Type");
      }
      break;
    case "Walling":
      switch (materialType) {
        case "Bricks":
          if (!parameters.wallArea || !parameters.bondName) {
            throw new Error("Please provide values for wallArea and bondName");
          }
          handleWallingBricks(
            schedule,
            parameters,
            description,
            relatedId,
            materialType
          );
          break;
        case "Blocks":
          if (!parameters.wallArea || !parameters.bondName) {
            throw new Error("Please provide values for wallArea and bondName");
          }
          handleWallingBlocks(
            schedule,
            parameters,
            description,
            relatedId,
            materialType
          );
          break;
        default:
          throw new Error("Please Provide a Material Type");
      }
      break;
    case "Other":
      if (!computedValue || !materialUnit || !materialName || !description) {
        throw new Error("Please Provide all required values");
      }
      handleOther(
        schedule,
        materialName,
        description,
        computedValue,
        materialUnit
      );
      break;
    default:
      throw new Error("Invalid elementName");
  }
  const updatedSchedule = await schedule.save();
  const summary = await materialsAggregationPipeline(objectId);
  console.log(summary);

  // Update the summary field of the Schedule document
  await Schedule.updateOne(
    { _id: scheduleId },
    { $set: { summary: summary } }
  ).exec();
  res.json({
    message:
      "Please find attached added material and new aggregated quantities",
    schedule: updatedSchedule,
    summary: summary,
  });
};

const deleteScheduleMaterial = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const materialId = req.params.materialId;
  const objectId = mongoose.Types.ObjectId(scheduleId);

  // Find the schedule with the materialId
  const schedule = await Schedule.findOne(
    { _id: scheduleId, "materials._id": materialId },
    { "materials.$": 1 }
  ).exec();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }

  // Get the material from the schedule
  const material = schedule.materials[0];

  // Check if the material has a relatedId property
  const relatedId = material.relatedId;
  const pullQuery = relatedId
    ? { materials: { relatedId } }
    : { materials: { _id: materialId } };

  // Use findOneAndUpdate to remove the material or related materials in one query
  await Schedule.findOneAndUpdate(
    { _id: scheduleId },
    { $pull: pullQuery }
  ).exec();

  const summary = await materialsAggregationPipeline(objectId);
  // Update the summary field of the Schedule document
  await Schedule.updateOne(
    { _id: scheduleId },
    { $set: { summary: summary } }
  ).exec();

  res.json({
    message: `Material ${material.materialName} deleted successfully`,
  });
};

const getScheduleDetails = async (req, res) => {
  const scheduleId = req.params.scheduleId;

  // Confirm schedule exists
  const schedule = await Schedule.findById(scheduleId).exec();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }

  res.status(200).json({
    "status ": "Success",
    schedule: schedule,
  });
};

const updateScheduleMaterial = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const objectId = mongoose.Types.ObjectId(scheduleId);
  console.log(objectId);
  const materialId = req.params.materialId;
  // Validate update data
  const {
    elementName,
    materialName,
    description,
    parameters,
    materialType,
    relatedId,
  } = req.body;
  console.log(relatedId);
  // Confirm data
  if (!materialName && !description && !parameters && !elementName) {
    return res.status(400).json({ message: "Please provide a relevant field" });
  }

  const schedule = await Schedule.findById(scheduleId).exec();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }

  //Run New Parameters through function

  switch (elementName) {
    case "Concrete":
      await updateConcrete(schedule, relatedId, description, parameters);
      break;

    case "Reinforcement":
      switch (materialName) {
        case "BRC":
          await updateBRC(scheduleId, materialId, description, parameters);
          break;
        case "Rebar":
          await updateRebar(scheduleId, materialId, description, parameters);
          break;
      }
      break;

    case "Walling":
      await updateWalling(
        schedule,
        relatedId,
        description,
        parameters,
        materialType
      );
      break;
  }

  const updatedMaterial = await schedule.save();

  const summary = await materialsAggregationPipeline(objectId);
  // Update the summary field of the Schedule document
  await Schedule.updateOne(
    { _id: scheduleId },
    { $set: { summary: summary } }
  ).exec();
  // console.log(summary);

  res.json({
    "message ": "Material updated successfully",
    material: updatedMaterial,
  });
};

const getSummary = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  console.log(req.params);
  const objectId = mongoose.Types.ObjectId(scheduleId);
  console.log(objectId);
  // Confirm schedule exists to aggregate
  const schedule = await Schedule.findById(scheduleId).exec();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }

  const results = await Schedule.aggregate([
    { $match: { _id: objectId } },
    { $unwind: "$materials" },
    {
      $group: {
        //grouping by name
        _id: "$materials.materialName",
        unit: { $first: "$materials.unit" },
        Value: { $sum: "$materials.computedValue" },
      },
    },
    {
      $project: {
        name: "$_id",
        unit: "$unit",
        Value: 1,
      },
    },
  ]);

  console.log(results);

  res.json({
    "message ": "Please find attached aggregated quantities",
    summary: results,
  });
};

const postApplication = async (req, res) => {
  const applications = req.body;
  const scheduleId = req.params.scheduleId;
  const objectId = mongoose.Types.ObjectId(scheduleId);

  console.log(applications);

  // Confirm schedule exists to update
  const schedule = await Schedule.findById(scheduleId).exec();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }

  // Validate and create a single application object with a date field and an items array
  const date = new Date().toISOString();
  const updatedApplication = {
    date,
    items: [],
  };
  applications.forEach((application) => {
    if (!application.item || !application.supplier || !application.requested) {
      throw new Error("Missing required fields");
    }

    // Find matching summary item and pick unit if found, otherwise use an empty string
    const summaryItem = schedule.summary.find(
      (item) => item._id === application.item
    );
    const unit = summaryItem ? summaryItem.unit[0] : "";

    updatedApplication.items.push({
      item: application.item,
      supplier: application.supplier,
      unit: unit,
      amountRequested: application.requested,
    });
  });

  try {
    // Add the updated application to the schedule
    const schedule = await Schedule.findOneAndUpdate(
      { _id: objectId },
      {
        $push: {
          application: { $each: [updatedApplication], $sort: { date: -1 } },
        },
      },
      { new: true }
    );

    // Calculate the totalRequested field
    const results = await applicationAggregationPipeline(objectId);
    schedule.totalRequested = results[0].totalRequested;

    // Update the balanceAllowable array based on the difference between the summary and totalRequested array
    await updateBalanceAllowable(schedule, objectId);

    // Save the updated schedule to the database
    await schedule.save();

    res.json({
      message: "Application added successfully",
      schedule: schedule,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const updateApplication = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const objectId = mongoose.Types.ObjectId(scheduleId);
  const applicationId = mongoose.Types.ObjectId(req.params.appId);
  const applications = req.body;

  for (const item of applications.entries) {
    if (
      item.item === "" ||
      item.supplier === "" ||
      item.amountRequested === ""
    ) {
      throw new Error("One or more fields in the item array is empty");
    }
  }

  try {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: objectId, "date._id": applicationId },
      { $set: { "application.$[elem].items": applications.entries } },
      {
        arrayFilters: [{ "elem._id": applicationId }],
        new: true,
      }
    );

    // Calculate the totalRequested field
    const results = await applicationAggregationPipeline(objectId);
    schedule.totalRequested = results[0].totalRequested;

    // Update the balanceAllowable array based on the difference between the summary and totalRequested array
    await updateBalanceAllowable(schedule, objectId);

    // Save the updated schedule to the database
    await schedule.save();

    res.status(200).send({
      message: "Application updated successfully",
      updatedSchedule: schedule,
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating application" });
  }
};

const deleteApplication = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const objectId = mongoose.Types.ObjectId(scheduleId);
  const applicationId = mongoose.Types.ObjectId(req.params.appId);

  try {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: objectId },
      { $pull: { application: { _id: applicationId } } },
      { new: true }
    );

    // Calculate the totalRequested field
    const results = await applicationAggregationPipeline(objectId);

    if (results && results.length > 0) {
      // Use a conditional operator to check if totalRequested is undefined and set schedule.totalRequested accordingly
      schedule.totalRequested =
        results[0].totalRequested === undefined
          ? []
          : results[0].totalRequested;
    } else {
      schedule.totalRequested = [];
    }

    // Update the balanceAllowable array based on the difference between the summary and totalRequested array
    await updateBalanceAllowable(schedule, objectId);

    // Save the updated schedule to the database
    await schedule.save();

    res.send({ message: "Application deleted successfully", schedule });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error deleting item" });
  }
};

// Function to generate the Excel workbook
async function generateExcel(app, username, title, funder, contractor) {
  const { application } = app;
  console.log("Application received", application);
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile("./template.xlsx");
  const sheet = workbook.getWorksheet(1);

  const style = {
    font: { name: "Bookman Old Style", size: 13 },
    alignment: { horizontal: "center", vertical: "center" },
    wrapText: true,
  };

  sheet.getCell("C11").value = ` ${moment().format("DD-MMM-YYYY")}`;
  sheet.getCell("C11").style = style;
  sheet.getCell("C15").value = ` ${title}`;
  sheet.getCell("C15").style = {
    ...style,
    font: { ...style.font, bold: true },
  };
  sheet.getCell(
    "A17"
  ).value = ` Reference is made to the letter  from Arrow Centre (Uganda) Limited received on 27th March 2023 requesting for confirmation that the VAT payable on taxable supplies to ${contractor} for the purposes of the above project is  deemed to have been paid by the Ministry for purposes of the above project. Our findings are as tabled below:`;
  sheet.getCell("A17").style = style;

  let currentRow = 20;
  let rowIndex = 1;
  application.forEach((app) => {
    app.items.forEach((item) => {
      // Merge cells B and C for the item name
      sheet.mergeCells(`B${currentRow}`, `C${currentRow}`);

      // Add new row with data
      const newRow = sheet.addRow([
        rowIndex,
        item.item, // Write the item name to the merged cell
        "",
        item.supplier,
        item.unit.toString(),
        item.amountRequested,
      ]);

      // Apply style to each cell in the newRow
      newRow.eachCell((cell) => {
        cell.style = style;
      });

      // Increment the row number and rowIndex for the next item
      currentRow++;
      rowIndex++;
    });
  });

  // Apply style to the username cell
  sheet.getCell(`A${currentRow + 4}`).value = username;
  sheet.getCell(`A${currentRow + 4}`).style = {
    font: { name: "Bookman Old Style", size: 13, bold: true },
    alignment: { horizontal: "left", vertical: "center" },
    wrapText: true,
  };

  // Generate the Excel file and send it to the user for download
  const excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer;
}

const downloadApplication = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const applId = req.params.appId;
  const objectId = mongoose.Types.ObjectId(scheduleId);
  const applicationId = mongoose.Types.ObjectId(applId);
  const schedule = await Schedule.findOne({ _id: objectId });
  const { title, funder, contractor } = schedule;
  const user = await User.findOne({ _id: schedule.user });
  const username = user.username;
  const application = await Schedule.findOne(
    {
      _id: objectId,
      application: {
        $elemMatch: { _id: applicationId },
      },
    },
    {
      "application.$": 1, // returns only the matching element
    }
  );

  try {
    // Generate the Excel buffer
    const excelBuffer = await generateExcel(
      application,
      username,
      title,
      funder,
      contractor
    );

    // Set the response headers
    res.setHeader("Content-Type", "application/vnd.ms-excel");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=applications.xlsx"
    );

    // Send the Excel buffer to the client for download
    res.send(excelBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating Excel file");
  }
};

const updateApplicationItem = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const objectId = mongoose.Types.ObjectId(scheduleId);
  const applicationId = mongoose.Types.ObjectId(req.params.appId);
  const itemId = req.params.itemId;

  // Extract fields from the request body
  const { item, supplier, amountRequested, amountAllowed } = req.body;

  // Find the updated document and save it to the database
  let updatedSchedule;
  try {
    updatedSchedule = await Schedule.findOne({ _id: objectId }).exec();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error finding schedule" });
    return;
  }

  // Update the item in the database
  try {
    await Schedule.updateOne(
      { _id: objectId, "date._id": applicationId },
      {
        $set: {
          "application.$[].items.$[elem].item": item,
          "application.$[].items.$[elem].supplier": supplier,
          "application.$[].items.$[elem].amountRequested": amountRequested,
          "application.$[].items.$[elem].amountAllowed": amountAllowed,
        },
      },
      { arrayFilters: [{ "elem._id": itemId }], returnOriginal: false }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error updating item" });
    return;
  }

  // Calculate the totalRequested field
  const results = await applicationAggregationPipeline(objectId);
  updatedSchedule.totalRequested = results[0].totalRequested;

  await updateBalanceAllowable(updatedSchedule, objectId);

  // Save the updated schedule to the database
  try {
    await updatedSchedule.save();
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error saving updated schedule" });
    return;
  }

  res.status(200).send({
    message: "Item updated successfully",
    updatedSchedule,
    results,
  });
};

const deleteApplicationItem = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const objectId = mongoose.Types.ObjectId(scheduleId);
  const applicationId = mongoose.Types.ObjectId(req.params.appId);
  const itemId = req.params.itemId;

  try {
    // Find and update the schedule document with the modified application array
    const updatedSchedule = await Schedule.findOneAndUpdate(
      { _id: objectId, "date._id": applicationId },
      { $pull: { "application.$[].items": { _id: itemId } } },
      { new: true } // return the updated document
    ).exec();

    // Get the updated totalRequested array from the modified application array
    const results = await applicationAggregationPipeline(objectId);
    updatedSchedule.totalRequested = results[0].totalRequested;

    await updateBalanceAllowable(updatedSchedule, objectId);

    // Update the totalRequested field in the schedule document
    await Schedule.updateOne(
      { _id: scheduleId },
      { $set: { totalRequested: results[0].totalRequested } }
    ).exec();

    res
      .status(200)
      .send({ message: "Item deleted successfully", updatedSchedule, results });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error deleting item" });
  }
};

module.exports = {
  getAllSchedules,
  createNewSchedule,
  updateSchedule,
  deleteSchedule,
  addScheduleMaterial,
  deleteScheduleMaterial,
  getScheduleDetails,
  updateScheduleMaterial,
  getSummary,
  postApplication,
  updateApplicationItem,
  deleteApplicationItem,
  updateApplication,
  deleteApplication,
  downloadApplication,
};

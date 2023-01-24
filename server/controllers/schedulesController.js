// const { calculateConcreteGivenClass } = require("./Calculations");
const Schedule = require("../models/Schedule");
const User = require("../models/User");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
const {
  materialsAggregationPipeline,
  applicationAggregationPipeline,
} = require("../utils/aggregatePipeline");
const { calculateConcreteGivenClass } = require("../utils/calculations");

// @desc Get all schedules
// @route GET /schedules
// @access Private

function calculateBRC(size, area) {
  if (size === "A66" || "A98(30)") {
    let brcRolls = Math.ceil(Number(area) / 57.514);
    return {
      brcSize: size,
      brcRolls: brcRolls,
    };
  } else if (size === "A98(48)" || "A142") {
    let brcRolls = Math.ceil(Number(area) / 105.16);
    return {
      brcSize: size,
      brcRolls: brcRolls,
    };
  } else if (size === "A193" || "A252") {
    let brcRolls = Math.ceil(Number(area) / 10.12);
    return {
      brcSize: size,
      brcRolls: brcRolls,
    };
  }
}

function calculateRebar(diameter, weight) {
  if (diameter === "8") {
    let pieces = Math.ceil(Number(weight) / 4.8);
    return {
      rebarDiameter: diameter,
      rebarPieces: pieces,
    };
  } else if (diameter === "10") {
    let pieces = Math.ceil(Number(weight) / 7.44);
    return {
      rebarDiameter: diameter,
      rebarPieces: pieces,
    };
  } else if (diameter === "12") {
    let pieces = Math.ceil(Number(weight) / 10.68);
    return {
      rebarDiameter: diameter,
      rebarPieces: pieces,
    };
  } else if (diameter === "16") {
    let pieces = Math.ceil(Number(weight) / 18.96);
    return {
      rebarDiameter: diameter,
      rebarPieces: pieces,
    };
  } else if (diameter === "20") {
    let pieces = Math.ceil(Number(weight) / 29.64);
    return {
      rebarDiameter: diameter,
      rebarPieces: pieces,
    };
  } else if (diameter === "25") {
    let pieces = Math.ceil(Number(weight) / 46.32);
    return {
      rebarDiameter: diameter,
      rebarPieces: pieces,
    };
  } else if (diameter === "32") {
    let pieces = Math.ceil(Number(weight) / 75.84);
    return {
      rebarDiameter: diameter,
      rebarPieces: pieces,
    };
  } else if (diameter === "40") {
    let pieces = Math.ceil(Number(weight) / 118.32);
    return {
      rebarDiameter: diameter,
      rebarPieces: pieces,
    };
  }
}

function calculateBricks(area, bond) {
  let hoopIron = Math.ceil(Number(area) * 0.1);
  let numCementBags = Math.ceil(Number(area) * 0.3);
  let sandWeighttTonnes = Number(area) * 0.04;
  let numBricks;
  if (bond === "Header") {
    numBricks = Math.ceil(Number(area) * 112);
  } else if (bond === "Stretcher") {
    numBricks = Math.ceil(Number(area) * 60);
  }
  return {
    bond: bond,
    hoopIron: hoopIron,
    numCementBags: numCementBags,
    sandWeighttTonnes: sandWeighttTonnes,
    numBricks: numBricks,
  };
}
function calculateBlocks(area, bond) {
  let hoopIron = Math.ceil(Number(area) * 0.1);
  let numCementBags;
  if (bond === "Header") {
    numCementBags = Math.ceil(Number(area) * 0.4);
  } else if (bond === "Stretcher") {
    numCementBags = Math.ceil(Number(area) * 0.2);
  }
  let sandWeighttTonnes = Number(area) * 0.04;
  let numBlocks;
  if (bond === "Header") {
    numBlocks = Math.ceil(Number(area) * 24);
  } else if (bond === "Stretcher") {
    numBlocks = Math.ceil(Number(area) * 11);
  }
  return {
    bond: bond,
    hoopIron: hoopIron,
    numCementBags: numCementBags,
    sandWeighttTonnes: sandWeighttTonnes,
    numBlocks: numBlocks,
  };
}

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
  const { materialName, elementName, description, parameters, materialType } =
    req.body;
  const scheduleId = req.params.scheduleId;
  const objectId = mongoose.Types.ObjectId(scheduleId);

  console.log("Request Parametrs", req.params);
  // Confirm data
  if (!elementName || !description || !parameters) {
    return res.status(400).json({ message: "Please provide a relevant field" });
  }

  // Confirm schedule exists to update
  const schedule = await Schedule.findById(scheduleId).exec();
  const relatedId = uuid();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }
  if (elementName === "Concrete") {
    // Calculate here
    console.log(parameters.concreteClass, parameters.cum);
    const results = calculateConcreteGivenClass(
      parameters.concreteClass,
      parameters.cum
    );

    schedule.materials.push({
      elementName: "Concrete",
      materialName: "Cement",
      materialDescription: description,
      computedValue: results.cementBags,
      unit: "Bags",
      parameters: parameters,
      relatedId: relatedId,
    });
    schedule.materials.push({
      elementName: "Concrete",
      materialName: "Sand",
      materialDescription: description,
      computedValue: results.amountofSand,
      unit: "Tonnes",
      parameters: parameters,
      relatedId: relatedId,
    });
    schedule.materials.push({
      elementName: "Concrete",
      materialName: "Aggregates",
      materialDescription: description,
      computedValue: results.amountofAggregates,
      unit: "Tonnes",
      parameters: parameters,
      relatedId: relatedId,
    });
  } else if (elementName === "Reinforcement" && materialName === "BRC") {
    const results = calculateBRC(parameters.brcSize, parameters.area);
    console.log(results);
    schedule.materials.push({
      elementName: "Reinforcement",
      materialName: "BRC",
      materialDescription: description,

      computedValue: results.brcRolls,
      unit: "Rolls",
      parameters: parameters,
    });
  } else if (elementName === "Reinforcement" && materialName === "Rebar") {
    const results = calculateRebar(parameters.rebarSize, parameters.Kgs);
    console.log(results);
    schedule.materials.push({
      elementName: "Reinforcement",
      materialName: "Rebar",
      materialDescription: description,
      computedValue: results.rebarPieces,
      unit: "Pieces",
      parameters: parameters,
    });
  } else if (elementName === "Walling" && materialType === "Bricks") {
    const results = calculateBricks(parameters.wallArea, parameters.bondName);
    console.log(results);
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Bricks",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.numBricks,
      unit: "Bricks",
      parameters: parameters,
      relatedId: relatedId,
    });
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Cement",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.numCementBags,
      unit: "Bags",
      parameters: parameters,
      relatedId: relatedId,
    });

    schedule.materials.push({
      elementName: "Walling",
      materialName: "Sand",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.sandWeighttTonnes,
      unit: "Tonnes",
      parameters: parameters,
      relatedId: relatedId,
    });
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Hoop Iron",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.hoopIron,
      unit: "Rolls",
      parameters: parameters,
      relatedId: relatedId,
    });
  } else if (elementName === "Walling" && materialType === "Blocks") {
    const results = calculateBlocks(parameters.wallArea, parameters.bondName);
    console.log(results);
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Blocks",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.numBlocks,
      unit: "Blocks",
      parameters: parameters,
      relatedId: relatedId,
    });
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Cement",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.numCementBags,
      unit: "Bags",
      parameters: parameters,
      relatedId: relatedId,
    });
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Sand",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.sandWeighttTonnes,
      unit: "Tonnes",
      parameters: parameters,
      relatedId: relatedId,
    });
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Hoop Iron",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.hoopIron,
      unit: "Rolls",
      parameters: parameters,
      relatedId: relatedId,
    });
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
  // Confirm schedule exists to update
  const schedule = await Schedule.findById(scheduleId).exec();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }

  // Find material with id
  const material = schedule.materials.id(materialId);

  if (!material) {
    return res.status(404).json({
      status: "fail",
      message: `Material with id ${materialId} not found`,
    });
  }

  // delete material
  await schedule.materials.remove(material);

  await schedule.save();
  const summary = await materialsAggregationPipeline(objectId);
  // Update the summary field of the Schedule document
  await Schedule.updateOne(
    { _id: scheduleId },
    { $set: { summary: summary } }
  ).exec();

  res.json({
    "message ": `Material ${material.materialName} deleted successfully`,
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

  //Run New Parameters through function
  let results = {};
  let updatedValue = 1;
  let schedule;
  if (elementName === "Concrete") {
    // Find objects that have the relatedId in the request body
    schedule = await Schedule.findOne({
      _id: scheduleId,
    }).exec();

    const materials = schedule?.materials?.filter(
      (material) => material.relatedId === relatedId
    );
    results = calculateConcreteGivenClass(
      parameters.concreteClass,
      parameters.cum
    );
    for (const material of materials) {
      //Find out which of the three concrete constituent materials to update
      if (material.materialName == "Cement") {
        material.computedValue = results.cementBags;
        material.parameters = parameters;
        material.materialDescription = description;
      } else if (material.materialName == "Sand") {
        material.computedValue = results.amountofSand;
        material.parameters = parameters;
        material.materialDescription = description;
      } else if (material.materialName == "Aggregates") {
        material.computedValue = results.amountofAggregates;
        material.parameters = parameters;
        material.materialDescription = description;
      }
    }
    await schedule.save();
  } else if (elementName === "Reinforcement" && materialName === "BRC") {
    const results = calculateBRC(parameters.brcSize, parameters.area);
    schedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, "materials._id": materialId },
      {
        $set: {
          "materials.$.parameters": parameters,
          "materials.$.elementName": elementName,
          "materials.$.materialDescription": description,
          "materials.$.computedValue": results.brcRolls,
        },
      }
    ).exec();
  } else if (elementName === "Reinforcement" && materialName === "Rebar") {
    const results = calculateRebar(parameters.rebarSize, parameters.Kgs);
    schedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, "materials._id": materialId },
      {
        $set: {
          "materials.$.parameters": parameters,
          "materials.$.elementName": elementName,
          "materials.$.materialDescription": description,
          "materials.$.computedValue": results.rebarPieces,
        },
      }
    ).exec();
  }
  if (elementName === "Walling") {
    schedule = await Schedule.findOne({ _id: scheduleId }).exec();
    const materials = schedule?.materials?.filter(
      (material) => material.relatedId === relatedId
    );
    if (materialType === "Bricks") {
      results = calculateBricks(parameters.wallArea, parameters.bondName);
    } else if (materialType === "Blocks") {
      results = calculateBlocks(parameters.wallArea, parameters.bondName);
    }

    for (const material of materials) {
      if (material.materialName === "Bricks" && materialType === "Blocks") {
        material.materialName = "Blocks";
        material.materialType = "Blocks";
        material.unit = "Blocks";
      }
      if (material.materialName === "Blocks" && materialType === "Bricks") {
        material.materialName = "Bricks";
        material.materialType = "Bricks";
        material.unit = "Bricks";
      }
      if (material.materialName == "Cement") {
        material.computedValue = results.numCementBags;
        material.parameters = parameters;
        material.materialDescription = description;
        material.materialType = materialType;
      } else if (material.materialName == "Sand") {
        material.computedValue = results.sandWeighttTonnes;
        material.parameters = parameters;
        material.materialDescription = description;
        material.materialType = materialType;
      } else if (material.materialName == "Bricks") {
        material.computedValue = results.numBricks;
        material.parameters = parameters;
        material.materialDescription = description;
        material.materialType = materialType;
      } else if (material.materialName == "Blocks") {
        material.computedValue = results.numBlocks;
        material.parameters = parameters;
        material.materialDescription = description;
        material.materialType = materialType;
      } else if (material.materialName == "Hoop Iron") {
        material.computedValue = results.hoopIron;
        material.parameters = parameters;
        material.materialDescription = description;
        material.materialType = materialType;
      }
    }

    await schedule.save();
  }

  // Confirm schedule exists to update
  // const schedule = await Schedule.findById(scheduleId).exec();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }

  // Find material with id
  const material = schedule.materials.id(materialId);

  if (!material) {
    return res.status(404).json({
      status: "fail",
      message: `Material with id ${materialId} not found`,
    });
  }

  const updatedMaterial = await schedule.save();

  const summary = await materialsAggregationPipeline(objectId);
  // Update the summary field of the Schedule document
  await Schedule.updateOne(
    { _id: scheduleId },
    { $set: { summary: summary } }
  ).exec();
  console.log(summary);

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
    updatedApplication.items.push({
      item: application.item,
      supplier: application.supplier,
      amountRequested: application.requested,
    });
    // updatedApplication.items = updatedApplication.items.map((item) => {
    //   let amountAllowed = 0;
    //   schedule.summary.forEach((s) => {
    //     if (item.item == s._id) {
    //       schedule.totalRequested.forEach((tr) => {
    //         if (item.item === tr._id) {
    //           amountAllowed = s.Value - Number(tr.amountRequested);
    //         }
    //       });
    //     }
    //   });
    //   return {
    //     ...item,
    //     amountAllowed,
    //   };
    // });
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

    // Calculate the amountAllowed value for each item
    schedule.application[0].items = schedule.application[0].items.map(
      (item) => {
        let amountAllowed = 0;
        schedule.summary.forEach((s) => {
          if (item.item == s._id) {
            schedule.totalRequested.forEach((tr) => {
              if (item.item === tr._id) {
                amountAllowed = s.Value - Number(tr.amountRequested);
              }
            });
          }
        });
        return {
          ...item,
          amountAllowed,
        };
      }
    );

    // Save the updated schedule to the database
    await schedule.save();

    res.json({
      message: "Application added successfully",
      schedule: schedule,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error adding application" });
  }
};

const updateApplication = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const objectId = mongoose.Types.ObjectId(scheduleId);
  const applicationId = mongoose.Types.ObjectId(req.params.appId);

  const applications = req.body;

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
    schedule.totalRequested = results[0].totalRequested;

    // Save the updated schedule to the database
    await schedule.save();

    res.send({ message: "Application deleted successfully", schedule });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error deleting item" });
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
};

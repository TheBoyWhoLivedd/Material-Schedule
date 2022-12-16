// const { calculateConcreteGivenClass } = require("./Calculations");
const Schedule = require("../models/Schedule");
const User = require("../models/User");
const mongoose = require("mongoose");
const { v4: uuid } = require("uuid");
// @desc Get all schedules
// @route GET /schedules
// @access Private

function calculateConcreteGivenClass(concreteClass, cum) {
  if (concreteClass === "C30") {
    let cementKgs = Number(cum) * 540;
    let sandWeightkgs = Number(cum) * 400;
    let sandWeighttTonnes = Math.ceil(Number(sandWeightkgs) / 1000);
    let aggregateWeightkgs = Number(cum) * 850;
    let aggregateWeightTonnes = Math.ceil(Number(aggregateWeightkgs) / 1000);
    let numCementBags = Math.ceil(Number(cementKgs) / 50);
    return {
      cementBags: numCementBags,
      amountofSand: sandWeighttTonnes,
      amountofAggregates: aggregateWeightTonnes,
    };
  } else if (concreteClass === "C25") {
    let cementKgs = Number(cum) * 393;
    let sandWeightkgs = Number(cum) * 435;
    let sandWeighttTonnes = Math.ceil(Number(sandWeightkgs) / 1000);
    let aggregateWeightkgs = Number(cum) * 928;
    let aggregateWeightTonnes = Math.ceil(Number(aggregateWeightkgs) / 1000);
    let numCementBags = Math.ceil(Number(cementKgs) / 50);
    return {
      cementBags: numCementBags,
      amountofSand: sandWeighttTonnes,
      amountofAggregates: aggregateWeightTonnes,
    };
  } else if (concreteClass === "C20") {
    let cementKgs = Number(cum) * 309;
    let sandWeightkgs = Number(cum) * 456;
    let sandWeighttTonnes = Math.ceil(Number(sandWeightkgs) / 1000);
    let aggregateWeightkgs = Number(cum) * 972;
    let aggregateWeightTonnes = Math.ceil(Number(aggregateWeightkgs) / 1000);
    let numCementBags = Math.ceil(Number(cementKgs) / 50);
    return {
      cementBags: numCementBags,
      amountofSand: sandWeighttTonnes,
      amountofAggregates: aggregateWeightTonnes,
    };
  } else if (concreteClass === "C15") {
    let cementKgs = Number(cum) * 216;
    let sandWeightkgs = Number(cum) * 479;
    let sandWeighttTonnes = Math.ceil(Number(sandWeightkgs) / 1000);
    let aggregateWeightkgs = Number(cum) * 1020;
    let aggregateWeightTonnes = Math.ceil(Number(aggregateWeightkgs) / 1000);
    let numCementBags = Math.ceil(Number(cementKgs) / 50);
    return {
      cementBags: numCementBags,
      amountofSand: sandWeighttTonnes,
      amountofAggregates: aggregateWeightTonnes,
    };
  } else if (concreteClass === "C10") {
    let cementKgs = Number(cum) * 166;
    let sandWeightkgs = Number(cum) * 491;
    let sandWeighttTonnes = Math.ceil(Number(sandWeightkgs) / 1000);
    let aggregateWeightkgs = Number(cum) * 1046;
    let aggregateWeightTonnes = Math.ceil(Number(aggregateWeightkgs) / 1000);
    let numCementBags = Math.ceil(Number(cementKgs) / 50);
    return {
      cementBags: numCementBags,
      amountofSand: sandWeighttTonnes,
      amountofAggregates: aggregateWeightTonnes,
    };
  }
}

function calculateBRC(size, area) {
  if (size === "A66" || "A98(30)") {
    let brcRolls = Math.ceil(Number(area) / 63.9);
    return {
      brcSize: size,
      brcRolls: brcRolls,
    };
  } else if (size === "A98(48)" || "A142") {
    let brcRolls = Math.ceil(Number(area) / 115.2);
    return {
      brcSize: size,
      brcRolls: brcRolls,
    };
  } else if (size === "A193" || "A252") {
    let brcRolls = Math.ceil(Number(area) / 11.52);
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
  if (bond === "Header") {
    let hoopIron = Math.ceil(Number(area) * 0.1);
    let numCementBags = Math.ceil(Number(area) * 0.3);
    let sandWeighttTonnes = Math.ceil(Number(area) * 0.04);
    let numBricks = Math.ceil(Number(area) * 112);
    return {
      bond: bond,
      hoopIron: hoopIron,
      numCementBags: numCementBags,
      sandWeighttTonnes: sandWeighttTonnes,
      numBricks: numBricks,
    };
  } else if (bond === "Stretcher") {
    let hoopIron = Math.ceil(Number(area) * 0.1);
    let numCementBags = Math.ceil(Number(area) * 0.2);
    let sandWeighttTonnes = Math.ceil(Number(area) * 0.04);
    let numBricks = Math.ceil(Number(area) * 60);
    return {
      bond: bond,
      hoopIron: hoopIron,
      numCementBags: numCementBags,
      sandWeighttTonnes: sandWeighttTonnes,
      numBricks: numBricks,
    };
  }
}
function calculateBlocks(area, bond) {
  if (bond === "Header") {
    let hoopIron = Math.ceil(Number(area) * 0.1);
    let numCementBags = Math.ceil(Number(area) * 0.3);
    let sandWeighttTonnes = Math.ceil(Number(area) * 0.04);
    let numBricks = Math.ceil(Number(area) * 112);
    return {
      bond: bond,
      hoopIron: hoopIron,
      numCementBags: numCementBags,
      sandWeighttTonnes: sandWeighttTonnes,
      numBricks: numBricks,
    };
  } else if (bond === "Stretcher") {
    let hoopIron = Math.ceil(Number(area) * 0.1);
    let numCementBags = Math.ceil(Number(area) * 0.2);
    let sandWeighttTonnes = Math.ceil(Number(area) * 0.04);
    let numBricks = Math.ceil(Number(area) * 60);
    return {
      bond: bond,
      hoopIron: hoopIron,
      numCementBags: numCementBags,
      sandWeighttTonnes: sandWeighttTonnes,
      numBricks: numBricks,
    };
  }
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
  const { title, description } = req.body;
  const scheduleId = req.params.scheduleId;
  // Confirm data
  if (!title && !description) {
    return res.status(400).json({ message: "Please provide a relevant field" });
  }

  // Confirm schedule exists to update
  const schedule = await Schedule.findById(scheduleId).exec();

  if (!schedule) {
    return res.status(400).json({ message: "Schedule not found" });
  }

  // Check for duplicate title
  const duplicate = await Schedule.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec();

  // Allow renaming of the original schedule
  if (duplicate && duplicate?._id.toString() !== scheduleId) {
    return res.status(409).json({ message: "Duplicate Schedule title" });
  }
  if (title) {
    schedule.title = title;
  }

  if (description) {
    schedule.description = description;
  }

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

  console.log(req.params);
  // Confirm data
  if (!elementName || !description || !parameters) {
    return res.status(400).json({ message: "Please provide a relevant field" });
  }

  // Confirm schedule exists to update
  const schedule = await Schedule.findById(scheduleId).exec();
  const relatedId = uuid();
  console.log(relatedId);

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }
  if (elementName === "Concrete") {
    // Calculate here
    const results = calculateConcreteGivenClass(
      parameters.concreteClass,
      parameters.cum
    );
    console.log(results);
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
      computedValue: results.numBricks,
      unit: "Blocks",
      parameters: parameters,
    });
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Cement",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.numCementBags,
      unit: "Bags",
      parameters: parameters,
    });
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Sand",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.sandWeighttTonnes,
      unit: "Tonnes",
      parameters: parameters,
    });
    schedule.materials.push({
      elementName: "Walling",
      materialName: "Hoop Iron",
      materialDescription: description,
      materialType: materialType,
      computedValue: results.hoopIron,
      unit: "Rolls",
      parameters: parameters,
    });
  }
  const updatedSchedule = await schedule.save();
  res.json({
    "message ": "Material added successfully",
    schedule: updatedSchedule,
  });
};

const deleteScheduleMaterial = async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const materialId = req.params.materialId;

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

    // Update the material's computedValue property
    //  await Schedule.updateOne(
    //   { "materials._id": materialId },
    //   {
    //     $set: {
    //       "materials.$.parameters": parameters,
    //       "materials.$.elementName": elementName,
    //       "materials.$.materialDescription": description,
    //       "materials.$.computedValue": updatedValue,
    //     },
    //   }
    // ).exec();
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
  } else if (elementName === "Walling" && materialType === "Bricks") {
    const results = calculateBricks(parameters.wallArea, parameters.bondName);
    //Find out which of the Four Walling constituent materials to update
    if (materialName == "Cement") {
      updatedValue = results.numCementBags;
    } else if (materialName == "Sand") {
      updatedValue = results.sandWeighttTonnes;
    } else if (materialName == "Bricks") {
      updatedValue = results.numBricks;
    } else if (materialName == "Hoop Iron") {
      updatedValue = results.hoopIron;
    }
    schedule = await Schedule.findOneAndUpdate(
      { _id: scheduleId, "materials._id": materialId },
      {
        $set: {
          "materials.$.parameters": parameters,
          "materials.$.elementName": elementName,
          "materials.$.materialDescription": description,
          "materials.$.computedValue": updatedValue,
        },
      }
    ).exec();
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
        //grouping by name and unit
        // _id: "$materials.materialName",
        _id: { name: "$materials.materialName", unit: "$materials.unit" },
        Value: { $sum: "$materials.computedValue" },
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
  // const { item, supplier, requested, allowed } = req.body;
  const scheduleId = req.params.scheduleId;

  console.log(req.params);
  // Confirm data
  // if (!item || !supplier || !requested || !allowed) {
  //   return res.status(400).json({ message: "Please provide a relevant field" });
  // }

  // Confirm schedule exists to update
  const schedule = await Schedule.findById(scheduleId).exec();

  if (!schedule) {
    return res
      .status(400)
      .json({ message: `Schedule with id ${scheduleId} not found` });
  }

  schedule.application.push({
    req,
  });

  const updatedSchedule = await schedule.save();
  res.json({
    "message ": "Material added successfully",
    schedule: updatedSchedule,
  });
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
};

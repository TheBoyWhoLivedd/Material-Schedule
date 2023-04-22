const Schedule = require("../models/Schedule");

const materialsAggregationPipeline = async (scheduleId) => {
  return await Schedule.aggregate([
    { $match: { _id: scheduleId } },
    { $unwind: "$materials" },
    {
      $group: {
        _id: {
          $cond: [
            "$materials.groupByFirstProp",
            "$materials.materialDetail",
            "$materials.materialName",
          ],
        },
        unit: { $addToSet: "$materials.unit" },
        Value: { $sum: "$materials.computedValue" },
        details: {
          $push: {
            materialDescription: "$materials.materialDescription",
            computedValue: "$materials.computedValue",
          },
        },
      },
    },
    {
      $project: {
        name: "$_id",
        unit: "$unit",
        Value: "$Value",
        details: "$details",
      },
    },
  ]);
};

// const materialsAggregationPipeline = async (scheduleId) => {
//   return await Schedule.aggregate([
//     { $match: { _id: scheduleId } },
//     { $unwind: "$materials" },
//     {
//       $group: {
//         _id: "$materials.materialName",
//         unit: { $addToSet: "$materials.unit" },
//         Value: { $sum: "$materials.computedValue" },
//         details: {
//           $push: {
//             materialDescription: "$materials.materialDescription",
//             computedValue: "$materials.computedValue",
//           },
//         },
//       },
//     },
//     {
//       $project: {
//         name: "$_id",
//         unit: "$unit",
//         Value: "$Value",
//         details: "$details",
//       },
//     },
//   ]);
// };

const applicationAggregationPipeline = async (scheduleId) => {
  return await Schedule.aggregate([
    { $match: { _id: scheduleId } },
    {
      $unwind: "$application",
    },
    {
      $unwind: "$application.items",
    },
    {
      $group: {
        _id: "$application.items.item",
        amountRequested: {
          $sum: { $toDouble: "$application.items.amountRequested" },
        },
        unit: {
          $first: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$summary",
                  as: "item",
                  cond: { $eq: ["$$item.name", "$application.items.item"] },
                },
              },
              0,
            ],
          },
        },
      },
    },
    {
      $project: {
        name: "$_id",
        amountRequested: "$amountRequested",
        unit: { $ifNull: ["$unit.unit", ""] },
      },
    },
    {
      $group: {
        _id: null,
        totalRequested: { $push: "$$ROOT" },
      },
    },
    {
      $addFields: {
        totalRequested: "$totalRequested",
      },
    },
    {
      $sort: {
        name: 1, // sort by name in ascending order
      },
    },
  ]).exec();
};

module.exports = {
  materialsAggregationPipeline,
  applicationAggregationPipeline,
};

// const addScheduleMaterial = async (req, res) => {
//   const {
//     materialName,
//     elementName,
//     description,
//     parameters,
//     materialType,
//     unit,
//     computedValue, //when the user chooses the "Other" to add a material
//   } = req.body;
//   const scheduleId = req.params.scheduleId;
//   const objectId = mongoose.Types.ObjectId(scheduleId);

//   console.log("Request Parametrs", req.params);
//   // Confirm data
//   if (!elementName || !description) {
//     throw new Error("Please provide values for elementName and description");
//   }

//   // Confirm schedule exists to update
//   const schedule = await Schedule.findById(scheduleId).exec();
//   const relatedId = uuid();

//   if (!schedule) {
//     return res
//       .status(400)
//       .json({ message: `Schedule with id ${scheduleId} not found` });
//   }
//   if (elementName === "Concrete") {
//     if (!parameters.concreteClass || !parameters.cum) {
//       throw new Error("Please provide values for concreteClass and cum");
//     }
//     // Calculate here
//     console.log(parameters.concreteClass, parameters.cum);
//     const results = calculateConcreteGivenClass(
//       parameters.concreteClass,
//       parameters.cum
//     );

//     schedule.materials.push({
//       elementName: "Concrete",
//       materialName: "Cement",
//       materialDescription: description,
//       computedValue: results.cementBags,
//       unit: "Bags",
//       parameters: parameters,
//       relatedId: relatedId,
//       groupByFirstProp: false,
//     });
//     schedule.materials.push({
//       elementName: "Concrete",
//       materialName: "Sand",
//       materialDescription: description,
//       computedValue: results.amountofSand,
//       unit: "Tonnes",
//       parameters: parameters,
//       relatedId: relatedId,
//       groupByFirstProp: false,
//     });
//     schedule.materials.push({
//       elementName: "Concrete",
//       materialName: "Aggregates",
//       materialDescription: description,
//       computedValue: results.amountofAggregates,
//       unit: "Tonnes",
//       parameters: parameters,
//       relatedId: relatedId,
//       groupByFirstProp: false,
//     });
//   } else if (elementName === "Reinforcement" && materialName === "BRC") {
//     if (!parameters.brcSize || !parameters.area) {
//       throw new Error("Please provide values for brcSize and area");
//     }

//     const results = calculateBRC(parameters.brcSize, parameters.area);
//     console.log(results);
//     schedule.materials.push({
//       elementName: "Reinforcement",
//       materialName: "BRC",
//       materialDescription: description,
//       computedValue: results.brcRolls,
//       unit: "Rolls",
//       parameters: parameters,
//       materialDetail: `${materialName}(${parameters.brcSize})`,
//       groupByFirstProp: true,
//     });
//   } else if (elementName === "Reinforcement" && materialName === "Rebar") {
//     if (!parameters.rebarSize || !parameters.Kgs) {
//       throw new Error("Please provide values for Rebar Diamter and Kgs");
//     }
//     const results = calculateRebar(parameters.rebarSize, parameters.Kgs);
//     console.log(results);
//     schedule.materials.push({
//       elementName: "Reinforcement",
//       materialName: "Rebar",
//       materialDescription: description,
//       computedValue: results.rebarPieces,
//       unit: "Pieces",
//       parameters: parameters,
//       materialDetail: `${materialName}(${parameters.rebarSize})`,
//       groupByFirstProp: true,
//     });
//   } else if (elementName === "Reinforcement" && materialName === "") {
//     throw new Error("Please Provide a Material Type");
//   } else if (elementName === "Walling" && materialType === "Bricks") {
//     if (!parameters.wallArea || !parameters.bondName) {
//       throw new Error("Please provide values for wallArea and bondName");
//     }
//     const results = calculateBricks(parameters.wallArea, parameters.bondName);
//     console.log(results);
//     schedule.materials.push({
//       elementName: "Walling",
//       materialName: "Bricks",
//       materialDescription: description,
//       materialType: materialType,
//       computedValue: results.numBricks,
//       unit: "Bricks",
//       parameters: parameters,
//       relatedId: relatedId,
//       groupByFirstProp: false,
//     });
//     schedule.materials.push({
//       elementName: "Walling",
//       materialName: "Cement",
//       materialDescription: description,
//       materialType: materialType,
//       computedValue: results.numCementBags,
//       unit: "Bags",
//       parameters: parameters,
//       relatedId: relatedId,
//       groupByFirstProp: false,
//     });

//     schedule.materials.push({
//       elementName: "Walling",
//       materialName: "Sand",
//       materialDescription: description,
//       materialType: materialType,
//       computedValue: results.sandWeighttTonnes,
//       unit: "Tonnes",
//       parameters: parameters,
//       relatedId: relatedId,
//       groupByFirstProp: false,
//     });
//     schedule.materials.push({
//       elementName: "Walling",
//       materialName: "Hoop Iron",
//       materialDescription: description,
//       materialType: materialType,
//       computedValue: results.hoopIron,
//       unit: "Rolls",
//       parameters: parameters,
//       relatedId: relatedId,
//       groupByFirstProp: false,
//     });
//   } else if (elementName === "Walling" && materialType === "Blocks") {
//     if (!parameters.wallArea || !parameters.bondName) {
//       throw new Error("Please provide values for wallArea and bondName");
//     }
//     const results = calculateBlocks(parameters.wallArea, parameters.bondName);
//     console.log(results);
//     schedule.materials.push({
//       elementName: "Walling",
//       materialName: "Blocks",
//       materialDescription: description,
//       materialType: materialType,
//       computedValue: results.numBlocks,
//       unit: "Blocks",
//       parameters: parameters,
//       relatedId: relatedId,
//     });
//     schedule.materials.push({
//       elementName: "Walling",
//       materialName: "Cement",
//       materialDescription: description,
//       materialType: materialType,
//       computedValue: results.numCementBags,
//       unit: "Bags",
//       parameters: parameters,
//       relatedId: relatedId,
//     });
//     schedule.materials.push({
//       elementName: "Walling",
//       materialName: "Sand",
//       materialDescription: description,
//       materialType: materialType,
//       computedValue: results.sandWeighttTonnes,
//       unit: "Tonnes",
//       parameters: parameters,
//       relatedId: relatedId,
//     });
//     schedule.materials.push({
//       elementName: "Walling",
//       materialName: "Hoop Iron",
//       materialDescription: description,
//       materialType: materialType,
//       computedValue: results.hoopIron,
//       unit: "Rolls",
//       parameters: parameters,
//       relatedId: relatedId,
//     });
//   } else if (elementName === "Other") {
//     if (!computedValue || !unit || !materialName || !description) {
//       throw new Error("Please Provide all required values");
//     }
//     schedule.materials.push({
//       elementName: elementName,
//       materialName: materialName,
//       materialDescription: description,
//       computedValue: computedValue,
//       unit: unit,
//     });
//   }

//   const updatedSchedule = await schedule.save();
//   const summary = await materialsAggregationPipeline(objectId);
//   console.log(summary);

//   // Update the summary field of the Schedule document
//   await Schedule.updateOne(
//     { _id: scheduleId },
//     { $set: { summary: summary } }
//   ).exec();
//   res.json({
//     message:
//       "Please find attached added material and new aggregated quantities",
//     schedule: updatedSchedule,
//     summary: summary,
//   });
// };

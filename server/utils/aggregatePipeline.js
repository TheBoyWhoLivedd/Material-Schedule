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
          $sum: { $toInt: "$application.items.amountRequested" },
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

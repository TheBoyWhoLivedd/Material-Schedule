const Schedule = require("../models/Schedule");



const aggregatePipeline = async (scheduleId) => {
  return await Schedule.aggregate([
    { $match: { _id: scheduleId } },
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
}

module.exports = {
  aggregatePipeline
}

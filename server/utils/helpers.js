const Schedule = require("../models/Schedule");
const {
  calculateConcreteGivenClass,
  calculateBRC,
  calculateRebar,
  calculateBlocks,
  calculateBricks,
  calculateAntiTermite,
  calculateMurram,
  calculateHardcore,
  calculateSandBlinding,
  calculateDampProofing,
  calculateDampProofMembrane,
  calculateDampProofCourse,
  calculateSteel,
} = require("./calculations");

// HELPERS TO ADD MATERIALS TO THE SCHEDULE

const addMaterialToSchedule = (schedule, material) => {
  schedule.materials.push(material);
};

const createMaterialObject = (
  elementName,
  materialName,
  materialDescription,
  computedValue,
  unit,
  parameters,
  relatedId,
  groupByFirstProp = false,
  materialType = undefined,
  materialDetail = undefined
) => ({
  elementName,
  materialName,
  materialDescription,
  computedValue,
  unit,
  parameters,
  relatedId,
  groupByFirstProp,
  materialType,
  materialDetail,
});

const handleConcrete = (schedule, parameters, description, relatedId) => {
  const results = calculateConcreteGivenClass(
    parameters.concreteClass,
    parameters.cum
  );

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Concrete",
      "Cement",
      description,
      results.cementBags,
      "Bags",
      parameters,
      relatedId
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Concrete",
      "Sand",
      description,
      results.amountofSand,
      "Tonnes",
      parameters,
      relatedId
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Concrete",
      "Aggregates",
      description,
      results.amountofAggregates,
      "Tonnes",
      parameters,
      relatedId
    )
  );
};

const handleReinforcementBRC = (schedule, parameters, description) => {
  const results = calculateBRC(parameters.brcSize, parameters.area);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Reinforcement",
      "BRC",
      description,
      results.brcRolls,
      "Rolls",
      parameters,
      undefined,
      true,
      undefined,
      `BRC(${parameters.brcSize})`
    )
  );
};
const handleReinforcementRebar = (schedule, parameters, description) => {
  const results = calculateRebar(parameters.rebarSize, parameters.Kgs);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Reinforcement",
      "Rebar",
      description,
      results.rebarPieces,
      "Pieces",
      parameters,
      undefined,
      true,
      undefined,
      `Rebar(${parameters.rebarSize})`
    )
  );
};

const handleWallingBricks = (
  schedule,
  parameters,
  description,
  relatedId,
  materialType
) => {
  const results = calculateBricks(parameters.wallArea, parameters.bondName);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Walling",
      "Bricks",
      description,
      results.numBricks,
      "Bricks",
      parameters,
      relatedId,
      false,
      materialType,
      undefined
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Walling",
      "Cement",
      description,
      results.numCementBags,
      "Bags",
      parameters,
      relatedId,
      false,
      materialType,
      undefined
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Walling",
      "Sand",
      description,
      results.sandWeighttTonnes,
      "Tonnes",
      parameters,
      relatedId,
      false,
      materialType,
      undefined
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Walling",
      "Hoop Iron",
      description,
      results.hoopIron,
      "Rolls",
      parameters,
      relatedId,
      false,
      materialType,
      undefined
    )
  );
};

const handleWallingBlocks = (
  schedule,
  parameters,
  description,
  relatedId,
  materialType
) => {
  const results = calculateBlocks(parameters.wallArea, parameters.bondName);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Walling",
      "Blocks",
      description,
      results.numBlocks,
      "Blocks",
      parameters,
      relatedId,
      false,
      materialType,
      undefined
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Walling",
      "Cement",
      description,
      results.numCementBags,
      "Bags",
      parameters,
      relatedId,
      false,
      materialType,
      undefined
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Walling",
      "Sand",
      description,
      results.sandWeighttTonnes,
      "Tonnes",
      parameters,
      relatedId,
      false,
      materialType,
      undefined
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Walling",
      "Hoop Iron",
      description,
      results.hoopIron,
      "Rolls",
      parameters,
      relatedId,
      false,
      materialType,
      undefined
    )
  );
};

const handleAntiTermite = (schedule, parameters, description) => {
  const results = calculateAntiTermite(parameters.surfaceArea);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Anti-Termite Treatment",
      "Anti-Termite",
      description,
      results.numAntiTermite,
      "Litres",
      parameters,
      undefined,
      false,
      undefined,
      undefined
    )
  );
};
const handleMurram = (schedule, parameters, description) => {
  const results = calculateMurram(parameters.cum);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Murram",
      "Murram",
      description,
      results.numMurram,
      "Tonnes",
      parameters,
      undefined,
      false,
      undefined,
      undefined
    )
  );
};
const handleHardcore = (schedule, parameters, description) => {
  const results = calculateHardcore(parameters.unit, parameters.cum);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Hardcore",
      "Hardcore",
      description,
      results.numHardcore,
      "Tonnes",
      parameters,
      undefined,
      false,
      undefined,
      undefined
    )
  );
};

const handleSandBlinding = (schedule, parameters, description) => {
  const results = calculateSandBlinding(parameters.surfaceArea);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Sand Blinding",
      "Sand Blinding",
      description,
      results.numSandBlinding,
      "Tonnes",
      parameters,
      undefined,
      false,
      undefined,
      undefined
    )
  );
};
const handleDampProofMembrane = (schedule, parameters, description) => {
  const results = calculateDampProofMembrane(parameters.surfaceArea);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Damp Proof Membrane",
      "Damp Proof Membrane",
      description,
      results.numDampProofMembrane,
      "Rolls",
      parameters,
      undefined,
      false,
      undefined,
      undefined
    )
  );
};
const handleDampProofCourse = (schedule, parameters, description) => {
  const results = calculateDampProofCourse(parameters.lm);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Damp Proof Course",
      "Damp Proof Course",
      description,
      results.numDampProofCourse,
      "Metres",
      parameters,
      undefined,
      false,
      undefined,
      undefined
    )
  );
};

const handleSteel = (schedule, materialName, parameters, description) => {
  const results = calculateSteel(
    materialName,
    parameters.sectionSize,
    parameters.eval,
    parameters.unit
  );

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Steel Work",
      materialName,
      description,
      results.steelPieces,
      "Pieces",
      parameters,
      undefined,
      true,
      undefined,
      `${parameters.sectionSize}`
    )
  );
};

const handleOther = (
  schedule,
  materialName,
  description,
  computedValue,
  unit
) => {
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Other",
      materialName,
      description,
      computedValue,
      unit,
      undefined,
      undefined,
      false,
      undefined,
      undefined
    )
  );
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//HELPERS TO UPDATE SCHEDULE MATERIALS

const updateConcrete = async (schedule, relatedId, description, parameters) => {
  const results = calculateConcreteGivenClass(
    parameters.concreteClass,
    parameters.cum
  );
  console.log(results);
  const materials = schedule?.materials?.filter(
    (material) => material.relatedId === relatedId
  );

  for (const material of materials) {
    if (material.materialName === "Cement") {
      material.computedValue = results.cementBags;
    } else if (material.materialName === "Sand") {
      material.computedValue = results.amountofSand;
    } else if (material.materialName === "Aggregates") {
      material.computedValue = results.amountofAggregates;
    }

    material.parameters = parameters;
    material.materialDescription = description;
  }

  await schedule.save();
};

const updateBRC = async (scheduleId, materialId, description, parameters) => {
  const results = calculateBRC(parameters.brcSize, parameters.area);
  await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.brcRolls,
        "materials.$.materialDetail": `BRC(${parameters.brcSize})`,
      },
    }
  ).exec();
};

const updateRebar = async (scheduleId, materialId, description, parameters) => {
  const results = calculateRebar(parameters.rebarSize, parameters.Kgs);
  await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.materialDetail": `Rebar(${parameters.rebarSize})`,
        "materials.$.computedValue": results.rebarPieces,
      },
    }
  ).exec();
};

const updateWalling = async (
  schedule,
  relatedId,
  description,
  parameters,
  materialType
) => {
  const materials = schedule?.materials?.filter(
    (material) => material.relatedId === relatedId
  );

  let results;
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

    if (material.materialName === "Cement") {
      material.computedValue = results.numCementBags;
    } else if (material.materialName === "Sand") {
      material.computedValue = results.sandWeighttTonnes;
    } else if (material.materialName === "Bricks") {
      material.computedValue = results.numBricks;
    } else if (material.materialName == "Blocks") {
      material.computedValue = results.numBlocks;
    } else if (material.materialName == "Hoop Iron") {
      material.computedValue = results.hoopIron;
    }
    material.parameters = parameters;
    material.materialDescription = description;
    material.materialType = materialType;
  }

  await schedule.save();
};

const updateAntiTermite = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateAntiTermite(parameters.surfaceArea);
  await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numAntiTermite,
      },
    }
  ).exec();
};
const updateMurram = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateMurram(parameters.cum);
  await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numMurram,
      },
    }
  ).exec();
};
const updateHardcore = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateHardcore(parameters.unit, parameters.cum);
  await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numHardcore,
      },
    }
  ).exec();
};

const updateSandBlinding = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateSandBlinding(parameters.surfaceArea);
  await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numSandBlinding,
      },
    }
  ).exec();
};
const updateDampProofMembrane = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateDampProofMembrane(parameters.surfaceArea);
  await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numDampProofMembrane,
      },
    }
  ).exec();
};
const updateDampProofCourse = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateDampProofCourse(parameters.lm);
  await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numDampProofCourse,
      },
    }
  ).exec();
};

const updateSteel = async (
  scheduleId,
  materialId,
  materialName,
  description,
  parameters
) => {
  const results = calculateSteel(
    materialName,
    parameters.sectionSize,
    parameters.eval,
    parameters.unit
  );
  await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.materialDetail": `${parameters.sectionSize}`,
        "materials.$.computedValue": results.steelPieces,
      },
    }
  ).exec();
};

module.exports = {
  addMaterialToSchedule,
  createMaterialObject,
  handleConcrete,
  handleReinforcementBRC,
  handleReinforcementRebar,
  handleWallingBricks,
  handleWallingBlocks,
  handleOther,
  handleAntiTermite,
  handleMurram,
  handleHardcore,
  handleSandBlinding,
  handleDampProofMembrane,
  handleDampProofCourse,
  handleSteel,

  updateConcrete,
  updateBRC,
  updateRebar,
  updateWalling,
  updateAntiTermite,
  updateMurram,
  updateHardcore,
  updateSandBlinding,
  updateDampProofMembrane,
  updateDampProofCourse,
  updateSteel,
};

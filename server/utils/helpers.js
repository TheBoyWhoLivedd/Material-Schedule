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
  calculateTiles,
  calculateScreed,
  calculatePlastering,
  calculateCeiling,
  calculatePainting,
  calculateWallScreed,
  calculateFloorScreed,
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
  materialDetail = undefined,
  categoryName = undefined
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
  categoryName,
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

const handleTiles = (
  schedule,
  parameters,
  description,
  relatedId,
  categoryName
) => {
  const results = calculateTiles(parameters.area);
  console.log(results);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Tiles",
      description,
      results.tiles,
      "Number",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Adhesive",
      description,
      results.adhesiveBags,
      "Bags",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Grout",
      description,
      results.groutKgs,
      "Kgs",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
};

const handleScreed = (
  schedule,
  parameters,
  description,
  relatedId,
  categoryName
) => {
  const results =
    categoryName === "Wall Finishes"
      ? calculateWallScreed(parameters.area, parameters.cssClass)
      : calculateFloorScreed(parameters.area, parameters.cssClass);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Cement",
      description,
      results.cementBags,
      "Kgs",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Sand",
      description,
      results.sandTons,
      "Tonnes",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
};

const handlePlastering = (
  schedule,
  parameters,
  description,
  relatedId,
  categoryName
) => {
  const results = calculatePlastering(parameters.area, parameters.plasterClass);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Cement",
      description,
      results.cementBags,
      "Bags",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Lime",
      description,
      results.limeBags,
      "Bags",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Sand",
      description,
      results.sandTons,
      "Tonnes",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
};
const handleCeiling = (
  schedule,
  parameters,
  description,
  relatedId,
  categoryName
) => {
  const results = calculateCeiling(parameters.area);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Expanded Metal Lathe",
      description,
      results.lathe,
      "Bundles",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Branderings",
      description,
      results.branderings,
      "Pieces",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
};
const handlePainting = (
  schedule,
  parameters,
  description,
  relatedId,
  categoryName
) => {
  const results = calculatePainting(parameters.area);

  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Undercoat",
      description,
      results.undercoat,
      "Litres",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
    )
  );
  addMaterialToSchedule(
    schedule,
    createMaterialObject(
      "Finishes",
      "Finishing Coat (3 Coats)",
      description,
      results.finish,
      "Litres",
      parameters,
      relatedId,
      false,
      undefined,
      undefined,
      categoryName
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
  console.log("relatedId", relatedId);
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
  console.log("materirals in updateConcrete", materials); 
  return materials;
};

const updateBRC = async (scheduleId, materialId, description, parameters) => {
  const results = calculateBRC(parameters.brcSize, parameters.area);
  const updatedMaterial = await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.brcRolls,
        "materials.$.materialDetail": `BRC(${parameters.brcSize})`,
      },
    },
    { new: true }
  ).exec();
  return updatedMaterial.materials.id(materialId);
};

const updateRebar = async (scheduleId, materialId, description, parameters) => {
  const results = calculateRebar(parameters.rebarSize, parameters.Kgs);
  const updatedMaterial = await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.materialDetail": `Rebar(${parameters.rebarSize})`,
        "materials.$.computedValue": results.rebarPieces,
      },
    },
    { new: true }
  ).exec();
  return updatedMaterial.materials.id(materialId);
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
  return materials;
};

const updateAntiTermite = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateAntiTermite(parameters.surfaceArea);
  const updatedMaterial = await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numAntiTermite,
      },
    },
    { new: true }
  ).exec();
  return updatedMaterial.materials.id(materialId);
};

const updateMurram = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateMurram(parameters.cum);
  const updatedMaterial = await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numMurram,
      },
    },
    { new: true }
  ).exec();
  return updatedMaterial.materials.id(materialId);
};

const updateHardcore = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateHardcore(parameters.unit, parameters.cum);
  const updatedMaterial = await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numHardcore,
      },
    },
    { new: true }
  ).exec();
  return updatedMaterial.materials.id(materialId);
};

const updateSandBlinding = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateSandBlinding(parameters.surfaceArea);
  const updatedMaterial = await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numSandBlinding,
      },
    },
    { new: true }
  ).exec();
  return updatedMaterial.materials.id(materialId);
};

const updateDampProofMembrane = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateDampProofMembrane(parameters.surfaceArea);
  const updatedMaterial = await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numDampProofMembrane,
      },
    },
    { new: true }
  ).exec();
  return updatedMaterial.materials.id(materialId);
};

const updateDampProofCourse = async (
  scheduleId,
  materialId,
  description,
  parameters
) => {
  const results = calculateDampProofCourse(parameters.lm);
  const updatedMaterial = await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.computedValue": results.numDampProofCourse,
      },
    },
    { new: true }
  ).exec();
  return updatedMaterial.materials.id(materialId);
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
  const updatedMaterial = await Schedule.findOneAndUpdate(
    { _id: scheduleId, "materials._id": materialId },
    {
      $set: {
        "materials.$.parameters": parameters,
        "materials.$.materialDescription": description,
        "materials.$.materialDetail": `${parameters.sectionSize}`,
        "materials.$.computedValue": results.steelPieces,
      },
    },
    { new: true }
  ).exec();
  return updatedMaterial.materials.id(materialId);
};

const updateTiles = async (schedule, relatedId, description, parameters) => {
  const results = calculateTiles(parameters.area);
  const materials = schedule?.materials?.filter(
    (material) => material.relatedId === relatedId
  );

  for (const material of materials) {
    if (material.materialName === "Tiles") {
      material.computedValue = results.tiles;
    } else if (material.materialName === "Adhesive") {
      material.computedValue = results.adhesiveBags;
    } else if (material.materialName === "Grout") {
      material.computedValue = results.groutKgs;
    }

    material.parameters = parameters;
    material.materialDescription = description;
  }

  await schedule.save();
  return materials;
};

const updateScreed = async (
  schedule,
  relatedId,
  description,
  parameters,
  categoryName
) => {
  const results =
    categoryName === "Wall Finishes"
      ? calculateWallScreed(parameters.area, parameters.cssClass)
      : calculateFloorScreed(parameters.area, parameters.cssClass);
  console.log(results);
  const materials = schedule?.materials?.filter(
    (material) => material.relatedId === relatedId
  );

  for (const material of materials) {
    if (material.materialName === "Cement") {
      material.computedValue = results.cementBags;
    } else if (material.materialName === "Sand") {
      material.computedValue = results.sandTons;
    }
    material.parameters = parameters;
    material.materialDescription = description;
  }

  await schedule.save();
  return materials;
};

const updatePlastering = async (
  schedule,
  relatedId,
  description,
  parameters
) => {
  const results = calculatePlastering(parameters.area, parameters.plasterClass);

  const materials = schedule?.materials?.filter(
    (material) => material.relatedId === relatedId
  );

  for (const material of materials) {
    if (material.materialName === "Cement") {
      material.computedValue = results.cementBags;
    } else if (material.materialName === "Lime") {
      material.computedValue = results.limeBags;
    } else if (material.materialName === "Sand") {
      material.computedValue = results.sandTons;
    }

    material.parameters = parameters;
    material.materialDescription = description;
  }

  await schedule.save();
  return materials;
};

const updatePainting = async (schedule, relatedId, description, parameters) => {
  const results = calculatePainting(parameters.area);

  const materials = schedule?.materials?.filter(
    (material) => material.relatedId === relatedId
  );

  for (const material of materials) {
    if (material.materialName === "Undercoat") {
      material.computedValue = results.undercoat;
    } else if (material.materialName === "Finishing coat (3 coats)") {
      material.computedValue = results.finish;
    }
    material.parameters = parameters;
    material.materialDescription = description;
  }

  await schedule.save();
  return materials;
};

const updateCeiling = async (schedule, relatedId, description, parameters) => {
  const results = calculateCeiling(parameters.area);

  const materials = schedule?.materials?.filter(
    (material) => material.relatedId === relatedId
  );

  for (const material of materials) {
    if (material.materialName === "Expanded Metal lathe") {
      material.computedValue = results.lathe;
    } else if (material.materialName === "Branderings") {
      material.computedValue = results.branderings;
    }
    material.parameters = parameters;
    material.materialDescription = description;
  }

  await schedule.save();
  return materials;
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
  handleTiles,
  handleScreed,
  handlePlastering,
  handlePainting,
  handleCeiling,

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
  updateTiles,
  updateScreed,
  updatePlastering,
  updatePainting,
  updateCeiling,
};

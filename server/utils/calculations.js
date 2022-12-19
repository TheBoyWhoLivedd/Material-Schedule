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

module.exports = {
  calculateConcreteGivenClass,
  calculateBRC,
  calculateRebar,
  calculateBlocks,
  calculateBricks,
};

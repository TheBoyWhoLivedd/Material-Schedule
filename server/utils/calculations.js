function calculateConcreteGivenClass(concreteClass, cum) {
  console.log(concreteClass, cum);
  const ratios = {
    C30: [540, 400, 850],
    C25: [393, 435, 928],
    C20: [309, 456, 972],
    C15: [216, 479, 1020],
    C10: [166, 491, 1046],
  };

  let [cementKgs, sandWeightkgs, aggregateWeightkgs] = ratios[
    concreteClass
  ].map((x) => Number.parseFloat((x * cum).toFixed(4)));

  let sandWeighttTonnes = parseFloat((sandWeightkgs / 1000).toFixed(4));
  console.log(sandWeighttTonnes);
  let aggregateWeightTonnes = parseFloat(
    (aggregateWeightkgs / 1000).toFixed(4)
  );
  console.log(aggregateWeightTonnes);
  let numCementBags = Math.ceil(cementKgs / 50);

  return {
    cementBags: numCementBags,
    amountofSand: sandWeighttTonnes,
    amountofAggregates: aggregateWeightTonnes,
  };
}

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

module.exports = {
  calculateConcreteGivenClass,
  calculateBRC,
  calculateRebar,
  calculateBlocks,
  calculateBricks,
};

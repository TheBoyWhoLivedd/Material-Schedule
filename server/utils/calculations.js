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

function calculateAntiTermite(area) {
  let numAntiTermite = Math.ceil(Number(area) * 0.1);
  return {
    numAntiTermite: numAntiTermite,
  };
}

function calculateMurram(cum) {
  let numMurram = Math.ceil(Number(cum) * 1.6);
  return {
    numMurram: numMurram,
  };
}

function calculateHardcore(unit, value) {
  let numHardcore;
  if (unit === "CM") {
    numHardcore = Math.ceil(Number(value) * 1.6);
  } else if (unit === "SM") {
    numHardcore = Math.ceil(Number(value) * 0.32);
  }
  return {
    numHardcore: numHardcore,
  };
}

function calculateSandBlinding(sqm) {
  let numSandBlinding = Math.ceil(Number(sqm) * 0.08);
  return {
    numSandBlinding: numSandBlinding,
  };
}
function calculateDampProofMembrane(sqm) {
  let numDampProofMembrane = Math.ceil(Number(sqm) * 0.02);
  return {
    numDampProofMembrane: numDampProofMembrane,
  };
}
function calculateDampProofCourse(lm) {
  let numDampProofCourse = Math.ceil(Number(lm) * 0.03);
  return {
    numDampProofCourse: numDampProofCourse,
  };
}

function calculateSteel(name, size, weight, unit) {
  console.log(name);
  const materialData = {
    "UB/IPE/UC": [
      { size: "IPE 100AA x 55", kgPerPiece: 40.32 },
      { size: "IPE 100 x 55", kgPerPiece: 48.6 },
      { size: "IPE 140AA x 73", kgPerPiece: 60.6 },
      { size: "IPE 140 x 73", kgPerPiece: 63 },
      { size: "IPE 160AA x 82", kgPerPiece: 73.86 },
      { size: "IPE 160 x 82", kgPerPiece: 94.62 },
      { size: "IPE 180AA x 91", kgPerPiece: 89.4 },
      { size: "IPE 180 x 91", kgPerPiece: 112.74 },
      { size: "IPE 200AA x 100", kgPerPiece: 107.7 },
      { size: "IPE 200 x 100", kgPerPiece: 134.16 },
      { size: "203x133 UB 25", kgPerPiece: 150 },
      { size: "254x102 UB 22", kgPerPiece: 132 },
      { size: "254x146 UB 31", kgPerPiece: 186 },
      { size: "305x102 UB 25", kgPerPiece: 150 },
      { size: "305x127 UB 37", kgPerPiece: 222 },
      { size: "305x165 UB 40", kgPerPiece: 240 },
      { size: "356x171 UB 45", kgPerPiece: 270 },
      { size: "406x140 UB 39", kgPerPiece: 234 },
      { size: "406x178 UB 54", kgPerPiece: 324 },
      { size: "457x191 UB 67", kgPerPiece: 402 },
      { size: "457x191 UB 74", kgPerPiece: 444 },
      { size: "533x210 UB 82", kgPerPiece: 492 },
      { size: "533x210 UB 92", kgPerPiece: 552 },
      { size: "610x229 UB 101", kgPerPiece: 606 },
      { size: "610x229 UB 125", kgPerPiece: 750 },
      { size: "686x254 UB 125", kgPerPiece: 750 },
      { size: "914x305 UB 201", kgPerPiece: 1206 },
      { size: "914x305 UB 253", kgPerPiece: 1518 },
      { size: "914x305 UB 343", kgPerPiece: 2058 },
      { size: "152x152 UC 23", kgPerPiece: 138 },
      { size: "203x203 UC 46", kgPerPiece: 276 },
      { size: "254x254 UC 63", kgPerPiece: 378 },
      { size: "254x254UC 73", kgPerPiece: 438 },
      { size: "305x305 UC 97", kgPerPiece: 582 },
      { size: "305x305 UC 118", kgPerPiece: 708 },
      { size: "305x305 UC 137", kgPerPiece: 822 },
    ],
    "Hollow Sections": [
      { size: "SHS 20x20x1.5mm", kgPerPiece: 5.05 },
      { size: "SHS 20x20x2.0mm", kgPerPiece: 6.55 },
      { size: "SHS 25x25x1.5mm", kgPerPiece: 6.55 },
      { size: "SHS 25x25x2.0mm", kgPerPiece: 8.35 },
      { size: "SHS 25x25x3.0mm", kgPerPiece: 12.01 },
      { size: "SHS 30x30x1.5mm", kgPerPiece: 7.77 },
      { size: "SHS 30x30x2.0mm", kgPerPiece: 10.21 },
      { size: "SHS 30x30x3.0mm", kgPerPiece: 14.73 },
      { size: "SHS 40x40x1.5mm", kgPerPiece: 10.5 },
      { size: "SHS 40x40x2.0mm", kgPerPiece: 13.86 },
      { size: "SHS 40x40x3.0mm", kgPerPiece: 20.24 },
      { size: "SHS 50x50x1.5mm", kgPerPiece: 13.22 },
      { size: "SHS 50x50x2.0mm", kgPerPiece: 17.46 },
      { size: "SHS 50x50x3.0mm", kgPerPiece: 25.69 },
      { size: "SHS 50x50x4.0mm", kgPerPiece: 33.52 },
      { size: "SHS 75x75x2.0mm", kgPerPiece: 26.56 },
      { size: "SHS 75x75x3.0mm", kgPerPiece: 39.32 },
      { size: "SHS 75x75x4.0mm", kgPerPiece: 51.74 },
      { size: "SHS 75x75x6.0mm", kgPerPiece: 75.4 },
      { size: "SHS 100x100x3.0mm", kgPerPiece: 53.01 },
      { size: "SHS 100x100x4.0mm", kgPerPiece: 69.6 },
      { size: "SHS 100x100x6.0mm", kgPerPiece: 102.66 },
      { size: "SHS 125x125x3.0mm", kgPerPiece: 66.12 },
      { size: "SHS 125x125x4.0mm", kgPerPiece: 88.16 },
      { size: "SHS 125x125x6.0mm", kgPerPiece: 129.92 },
      { size: "SHS 150x150X3.0mm", kgPerPiece: 80.74 },
      { size: "SHS 150x150x4.0mm", kgPerPiece: 106.14 },
      { size: "SHS 150x150x6.0mm", kgPerPiece: 157.18 },
      { size: "SHS 175x175x3mm", kgPerPiece: 94.25 },
      { size: "SHS 175x175x4mm", kgPerPiece: 124.58 },
      { size: "SHS 175x175x6mm", kgPerPiece: 184.44 },
      { size: "SHS 200x200x4mm", kgPerPiece: 142.8 },
      { size: "SHS 200x200x6mm", kgPerPiece: 211.99 },
      { size: "RHS 40x20x1.5mm", kgPerPiece: 7.77 },
      { size: "RHS 40x20x2.0mm", kgPerPiece: 10.21 },
      { size: "RHS 40x25x1.5mm", kgPerPiece: 8.47 },
      { size: "RHS 40x25x2.0mm", kgPerPiece: 11.14 },
      { size: "RHS 40x25x3.0mm", kgPerPiece: 16.12 },
      { size: "RHS 50x25x1.5mm", kgPerPiece: 9.86 },
      { size: "RHS 50x25x2.0mm", kgPerPiece: 12.93 },
      { size: "RHS 50x25x3.0mm", kgPerPiece: 18.85 },
      { size: "RHS 60x40x1.5mm", kgPerPiece: 13.22 },
      { size: "RHS 60x40x2.0mm", kgPerPiece: 17.46 },
      { size: "RHS 60x40x3.0mm", kgPerPiece: 25.69 },
      { size: "RHS 75x50x2.0mm", kgPerPiece: 22.04 },
      { size: "RHS 75x50x3.0mm", kgPerPiece: 32.48 },
      { size: "RHS 75x50x4.0mm", kgPerPiece: 42.63 },
      { size: "RHS 100x50x2.0mm", kgPerPiece: 26.56 },
      { size: "RHS 100x50x3.0mm", kgPerPiece: 39.32 },
      { size: "RHS 100x50x4.0mm", kgPerPiece: 51.74 },
      { size: "RHS 125x75x3mm", kgPerPiece: 53.01 },
      { size: "RHS 125x75x4mm", kgPerPiece: 69.6 },
      { size: "RHS 125x75x6mm", kgPerPiece: 102.66 },
      { size: "RHS 150x50x3mm", kgPerPiece: 53.01 },
      { size: "RHS 150x50x4mm", kgPerPiece: 69.6 },
      { size: "RHS 150x100x3mm", kgPerPiece: 66.12 },
      { size: "RHS 150x100x4mm", kgPerPiece: 88.16 },
      { size: "RHS 150x100x6mm", kgPerPiece: 129.92 },
      { size: "RHS 200x50x3mm", kgPerPiece: 66.12 },
      { size: "RHS 200x50x4mm", kgPerPiece: 88.16 },
      { size: "RHS 200x100x4mm", kgPerPiece: 106.14 },
      { size: "RHS 200x100x6mm", kgPerPiece: 157.18 },
      { size: "RHS 200x150x6mm", kgPerPiece: 184.44 },
    ],
    CHS: [
      { size: "CHS 16x1.0mm", kgPerPiece: 2.15 },
      { size: "CHS 16x1.2mm", kgPerPiece: 2.54 },
      { size: "CHS 16x1.5mm", kgPerPiece: 3.11 },
      { size: "CHS 20x1.0mm", kgPerPiece: 2.72 },
      { size: "CHS 20x1.2mm", kgPerPiece: 3.23 },
      { size: "CHS 20x1.5mm", kgPerPiece: 3.97 },
      { size: "CHS 22x1.0mm", kgPerPiece: 3.0 },
      { size: "CHS 22x1.2mm", kgPerPiece: 3.57 },
      { size: "CHS 22x1.5mm", kgPerPiece: 4.4 },
      { size: "CHS 25x1.0mm", kgPerPiece: 3.43 },
      { size: "CHS 25x1.2mm", kgPerPiece: 4.07 },
      { size: "CHS 25x1.5mm", kgPerPiece: 5.05 },
      { size: "CHS 26.9x1.0mm", kgPerPiece: 8.24 },
      { size: "CHS 26.9x1.2mm", kgPerPiece: 9.22 },
      { size: "CHS 26.9x1.5mm", kgPerPiece: 11.02 },
      { size: "CHS 32x1.2mm", kgPerPiece: 5.28 },
      { size: "CHS 32x1.5mm", kgPerPiece: 6.55 },
      { size: "CHS 33.5x1.2mm", kgPerPiece: 5.56 },
      { size: "CHS 33.5x1.5mm", kgPerPiece: 6.9 },
      { size: "CHS 33.5x2.65mm", kgPerPiece: 11.72 },
      { size: "CHS 33.5x3.25mm", kgPerPiece: 14.09 },
      { size: "CHS 33.5x4.05mm", kgPerPiece: 17.05 },
      { size: "CHS 38.7x1.2mm", kgPerPiece: 6.44 },
      { size: "CHS 38.7x1.5mm", kgPerPiece: 7.95 },
      { size: "CHS 42.5x1.2mm", kgPerPiece: 7.08 },
      { size: "CHS 42.5x1.5mm", kgPerPiece: 8.76 },
      { size: "CHS 42.5x2.65mm", kgPerPiece: 15.02 },
      { size: "CHS 42.5x3.25mm", kgPerPiece: 18.1 },
      { size: "CHS 42.5x4.05mm", kgPerPiece: 22.16 },
      { size: "CHS 48.25x1.2mm", kgPerPiece: 8.06 },
      { size: "CHS 48.25x1.5mm", kgPerPiece: 10.03 },
      { size: "CHS 48.25x2.65mm", kgPerPiece: 18.79 },
      { size: "CHS 48.25x3.25mm", kgPerPiece: 20.94 },
      { size: "CHS 48.25x4.05mm", kgPerPiece: 25.58 },
      { size: "CHS 60x1.5mm", kgPerPiece: 12.59 },
      { size: "CHS 60x2.65mm", kgPerPiece: 23.66 },
      { size: "CHS 60x3.25mm", kgPerPiece: 26.39 },
      { size: "CHS 60x4.05mm", kgPerPiece: 35.73 },
      { size: "CHS 76x1.5mm", kgPerPiece: 16.01 },
      { size: "CHS 76x2.65mm", kgPerPiece: 33.81 },
      { size: "CHS 76x3.25mm", kgPerPiece: 37.82 },
      { size: "CHS 76x4.05mm", kgPerPiece: 45.99 },
      { size: "CHS 88.6x3.25mm", kgPerPiece: 39.5 },
      { size: "CHS 88.6x4.05mm", kgPerPiece: 49.13 },
      { size: "CHS 88.6x4.85mm", kgPerPiece: 58.58 },
      { size: "CHS 113.9x3.65mm", kgPerPiece: 57.36 },
      { size: "CHS 113.9x4.5mm", kgPerPiece: 70.18 },
      { size: "CHS 113.9x5.4mm", kgPerPiece: 83.52 },
      { size: "CHS 139.7x4.5mm", kgPerPiece: 93.96 },
      { size: "CHS 139.7x5.4mm", kgPerPiece: 103.24 },
      { size: "CHS 165.1x4.5mm", kgPerPiece: 111.36 },
      { size: "CHS 165.1x5.4mm", kgPerPiece: 122.38 },
      { size: "CHS 216.3x5.0mm", kgPerPiece: 150.8 },
      { size: "CHS 216.3x6.0mm", kgPerPiece: 180.38 },
      { size: "CHS 216.3x7.0mm", kgPerPiece: 209.38 },
      { size: "CHS 21.4x2.0mm (15NB 'A')", kgPerPiece: 5.52 },
      { size: "CHS 21.7x2.65mm (15NB 'B')", kgPerPiece: 7.08 },
      { size: "CHS 21.7x3.25mm (15NB 'C')", kgPerPiece: 8.41 },
      { size: "CHS 21.4x2.35mm (20NB 'A')", kgPerPiece: 8.18 },
      { size: "CHS 27.2x2.65mm (20NB 'B')", kgPerPiece: 9.16 },
      { size: "CHS 27.2x3.25mm (20NB 'C')", kgPerPiece: 11.02 },
      { size: "CHS 33.8x2.65mm (25NB 'A')", kgPerPiece: 11.66 },
      { size: "CHS 34.2x3.25mm (25NB 'B')", kgPerPiece: 14.15 },
      { size: "CHS 34.2x4.05mm (25NB 'C')", kgPerPiece: 17.23 },
      { size: "CHS 42.25x2.65mm (32NB 'A')", kgPerPiece: 14.96 },
      { size: "CHS 42.25x3.25mm (32NB 'B')", kgPerPiece: 18.21 },
      { size: "CHS 42.25x4.05mm (32NB 'C')", kgPerPiece: 22.27 },
      { size: "CHS 48.25x2.9mm (40NB 'A')", kgPerPiece: 18.85 },
      { size: "CHS 48.25x3.25mm (40NB 'B')", kgPerPiece: 20.94 },
      { size: "CHS 48.25x4.05mm (40NB 'C')", kgPerPiece: 25.69 },
      { size: "CHS 60x2.9mm (50NB 'A')", kgPerPiece: 23.84 },
      { size: "CHS 60x3.65mm (50NB 'B')", kgPerPiece: 29.58 },
      { size: "CHS 60x4.5mm (50NB 'C')", kgPerPiece: 35.79 },
      { size: "CHS 76x3.25mm (65NB 'A')", kgPerPiece: 33.64 },
      { size: "CHS 76x3.65mm (65NB 'B')", kgPerPiece: 37.76 },
      { size: "CHS 76x4.5mm (65NB 'C')", kgPerPiece: 45.82 },
      { size: "CHS 88.6x3.25mm (80NB 'A')", kgPerPiece: 39.5 },
      { size: "CHS 88.6x4.05mm (80NB 'B')", kgPerPiece: 49.13 },
      { size: "CHS 88.6x4.85mm (80NB 'C')", kgPerPiece: 58.58 },
      { size: "CHS 113.9x3.65mm (100NB 'A')", kgPerPiece: 57.36 },
      { size: "CHS 113.9x4.5mm (100NB 'B')", kgPerPiece: 70.18 },
      { size: "CHS 113.9x5.4mm (100NB 'C')", kgPerPiece: 83.52 },
      { size: "CHS 139.7x4.85mm (125NB 'B')", kgPerPiece: 93.96 },
      { size: "CHS 139.7x5.4mm (125NB 'C')", kgPerPiece: 103.24 },
      { size: "CHS 165.1x4.85mm (150NB 'B')", kgPerPiece: 111.36 },
      { size: "CHS 165.1x5.4mm (150NB 'C')", kgPerPiece: 122.96 },
      { size: "CHS 216.3x5.0mm (200NB 'B')", kgPerPiece: 150.8 },
      { size: "CHS 216.3x6.0mm (200NB 'C')", kgPerPiece: 180.38 },
    ],
    "RSC/PFC": [
      { size: "RSC 76x38x6.7mm", kgPerPiece: 38.86 },
      { size: "RSC 100x50mm", kgPerPiece: 61.48 },
      { size: "RSC 102x51x10.42mm", kgPerPiece: 60.44 },
      { size: "RSC 127x64x14.9mm", kgPerPiece: 86.42 },
      { size: "RSC 152x76x17.9mm", kgPerPiece: 103.82 },
      { size: "RSC 152x88x23.84mm", kgPerPiece: 138.27 },
      { size: "RSC 178x76x20.84mm", kgPerPiece: 120.87 },
      { size: "RSC 178x89x26.81mm", kgPerPiece: 155.5 },
      { size: "RSC 200x75mm", kgPerPiece: 147.32 },
      { size: "RSC 203x76x23.82mm", kgPerPiece: 138.16 },
      { size: "RSC 203x89x29.78mm", kgPerPiece: 172.72 },
      { size: "RSC 229x76x26.06mm", kgPerPiece: 151.15 },
      { size: "RSC 229x89x32.76mm", kgPerPiece: 190.01 },
      { size: "RSC 230x75x25.7mm", kgPerPiece: 149.06 },
      { size: "RSC 254x76x28.29mm", kgPerPiece: 164.08 },
      { size: "RSC 254x89x35.74mm", kgPerPiece: 207.29 },
      { size: "RSC 260x90x34.8mm", kgPerPiece: 201.84 },
      { size: "RSC 300x90x41.4mm", kgPerPiece: 240.12 },
      { size: "RSC 305x89x41.69mm", kgPerPiece: 241.8 },
      { size: "RSC 305X100X45.5mm", kgPerPiece: 263.9 },
      { size: "RSC 305X102X46.18mm", kgPerPiece: 267.84 },
      { size: "RSC 381x102x55.10mm", kgPerPiece: 319.58 },
      { size: "RSC 432x102x65.54mm", kgPerPiece: 380.13 },
      { size: "PFC 100x50mm", kgPerPiece: 58.58 },
      { size: "PFC 120x55mm", kgPerPiece: 72.5 },
      { size: "PFC 140x60mm", kgPerPiece: 88.74 },
      { size: "PFC 160x65mm", kgPerPiece: 104.98 },
      { size: "PFC 180x70mm", kgPerPiece: 122.38 },
      { size: "PFC 200x75mm", kgPerPiece: 140.94 },
      { size: "PFC 220x80mm", kgPerPiece: 164.14 },
      { size: "PFC 240x85mm", kgPerPiece: 185.6 },
      { size: "PFC 260x90mm", kgPerPiece: 210.54 },
      { size: "PFC 280x95mm", kgPerPiece: 237.22 },
      { size: "PFC 300x100mm", kgPerPiece: 263.32 },
    ],
    JIS: [
      { size: "JIS/150x150x31.1", kgPerPiece: 186.6 },
      { size: "JIS/198x99x17.8", kgPerPiece: 106.8 },
      { size: "JIS/200x100x20.9", kgPerPiece: 125.4 },
      { size: "JIS/200x200x49.9", kgPerPiece: 299.4 },
      { size: "JIS/248x124x25.82", kgPerPiece: 154.92 },
      { size: "JIS/250x125x29", kgPerPiece: 174 },
      { size: "JIS/250x250x71.8", kgPerPiece: 430.8 },
      { size: "JIS/298x149x32", kgPerPiece: 192 },
      { size: "JIS/300x150x36.7", kgPerPiece: 220.2 },
      { size: "JIS/300x300x93", kgPerPiece: 558 },
      { size: "JIS/346x174x41.2", kgPerPiece: 247.2 },
      { size: "JIS/350x175x49.4", kgPerPiece: 296.4 },
      { size: "JIS/396x199x56.1", kgPerPiece: 336.6 },
      { size: "JIS/446x199x65.1", kgPerPiece: 390.6 },
      { size: "JIS/450x200x74.9", kgPerPiece: 449.4 },
      { size: "JIS/500x200x88.1", kgPerPiece: 528.6 },
      { size: "JIS/596x199x92.4", kgPerPiece: 554.4 },
      { size: "JIS/600x200x103", kgPerPiece: 618 },
    ],
    "CFC/Z/CFLC(Purlins)": [
      { size: "CFZ 150x50x20x1.5mm", kgPerPiece: 19.81 },
      { size: "CFZ127x50x1.5mm", kgPerPiece: 17.69 },
      { size: "CFZ140x50x20x1.5", kgPerPiece: 19.12 },
      { size: "CFLC 150x50x20x2mm", kgPerPiece: 26.41 },
      { size: "CFZ100x50x2mm", kgPerPiece: 20.53 },
      { size: "CFZ115x50x2mm", kgPerPiece: 21.92 },
      { size: "CFZ130x50x2mm", kgPerPiece: 23.32 },
      { size: "CFZ140x50x2mm", kgPerPiece: 24.19 },
      { size: "CFZ 150x50x2mm", kgPerPiece: 25.11 },
      { size: "CFZ175x50x2mm", kgPerPiece: 28.96 },
      { size: "CFZ 175x65x2mm", kgPerPiece: 29.99 },
      { size: "CFZ 175x65x2.5mm", kgPerPiece: 38.57 },
      { size: "CFZ 200x65x2.0mm", kgPerPiece: 34.34 },
    ],
    CFA: [
      { size: "CFA28X28X1.5mm", kgPerPiece: 3.83 },
      { size: "CFA28X28Xmm2", kgPerPiece: 5.1 },
      { size: "CFA 30x30x2mm", kgPerPiece: 5.46 },
      { size: "CFA 70x50x6mm", kgPerPiece: 32.78 },
      { size: "CFA150x75x8mm", kgPerPiece: 81.95 },
      { size: "CFA50X50X2mm", kgPerPiece: 9.11 },
      { size: "CFA 110X30X4mm", kgPerPiece: 25.52 },
      { size: "CFA 100X50X6mm", kgPerPiece: 40.98 },
      { size: "CFA 140X40X4mm", kgPerPiece: 32.78 },
      { size: "CFA50x50x4mm", kgPerPiece: 18.21 },
      { size: "CFA50x50x6mm", kgPerPiece: 27.32 },
    ],
    RSA: [
      { size: "RSA 25x25x3mm", kgPerPiece: 6.44 },
      { size: "RSA 25x25x4mm", kgPerPiece: 8.41 },
      { size: "RSA 25x25x5mm", kgPerPiece: 10.27 },
      { size: "RSA 30x30x3mm", kgPerPiece: 7.89 },
      { size: "RSA 30x30x4.0mm", kgPerPiece: 10.32 },
      { size: "RSA 30x30x5.0mm", kgPerPiece: 12.64 },
      { size: "RSA 40x40x3.0mm", kgPerPiece: 10.67 },
      { size: "RSA 40x40x4.0mm", kgPerPiece: 14.04 },
      { size: "RSA 40x40x5.0mm", kgPerPiece: 17.23 },
      { size: "RSA 40x40x6.0mm", kgPerPiece: 20.42 },
      { size: "RSA 45x45x3.0mm", kgPerPiece: 12.12 },
      { size: "RSA 45x45x4.0mm", kgPerPiece: 15.89 },
      { size: "RSA 45x45x5.0mm", kgPerPiece: 19.6 },
      { size: "RSA 45x45x6.0mm", kgPerPiece: 23.2 },
      { size: "RSA 50x50x3.0mm", kgPerPiece: 13.51 },
      { size: "RSA 50x50x4.0mm", kgPerPiece: 17.75 },
      { size: "RSA 50x50x5.0mm", kgPerPiece: 21.87 },
      { size: "RSA 50x50x6.0mm", kgPerPiece: 25.93 },
      { size: "RSA 50x50x8.0mm", kgPerPiece: 33.76 },
      { size: "RSA 60x60x5.0mm", kgPerPiece: 26.51 },
      { size: "RSA 60x60x6.0mm", kgPerPiece: 31.44 },
      { size: "RSA 60x60x8.0mm", kgPerPiece: 41.12 },
      { size: "RSA 60x60x10.0mm", kgPerPiece: 50.4 },
      { size: "RSA 65x65x5.0mm", kgPerPiece: 29.0 },
      { size: "RSA 65x65x6.0mm", kgPerPiece: 34.28 },
      { size: "RSA 65x65x8.0mm", kgPerPiece: 44.43 },
      { size: "RSA 70x70x6.0mm", kgPerPiece: 37.0 },
      { size: "RSA 70x70x8.0mm", kgPerPiece: 48.49 },
      { size: "RSA 70X70X10.0mm", kgPerPiece: 59.74 },
      { size: "RSA 75X75X6.0mm", kgPerPiece: 39.73 },
      { size: "RSA 75X75X8.0mm", kgPerPiece: 52.37 },
      { size: "RSA 75X75X9.0mm", kgPerPiece: 57.77 },
      { size: "RSA 75X75X10.0mm", kgPerPiece: 58.0 },
      { size: "RSA 75X75X12.0mm", kgPerPiece: 75.4 },
      { size: "RSA 80X80X6.0mm", kgPerPiece: 42.57 },
      { size: "RSA 80X80X8.0mm", kgPerPiece: 55.85 },
      { size: "RSA 80X80X10.0mm", kgPerPiece: 69.02 },
      { size: "RSA 90X90X6.0mm", kgPerPiece: 48.14 },
      { size: "RSA 90X90X7.0mm", kgPerPiece: 55.74 },
      { size: "RSA 90X90X8.0mm", kgPerPiece: 63.22 },
      { size: "RSA 90X90X10.0mm", kgPerPiece: 77.72 },
      { size: "RSA 90X90X12.0mm", kgPerPiece: 92.22 },
      { size: "RSA 100X100X6.0mm", kgPerPiece: 53.36 },
      { size: "RSA 100X100X7.0mm", kgPerPiece: 62.06 },
      { size: "RSA 100X100X8.0mm", kgPerPiece: 70.76 },
      { size: "RSA 100X100X10.0mm", kgPerPiece: 87.0 },
      { size: "RSA 100X100X12.0mm", kgPerPiece: 103.24 },
      { size: "RSA 100X100X15.0mm", kgPerPiece: 127.02 },
      { size: "RSA 120X120X8.0mm", kgPerPiece: 85.26 },
      { size: "RSA 120X120X10.0mm", kgPerPiece: 105.56 },
      { size: "RSA 120X120X12.0mm", kgPerPiece: 125.28 },
      { size: "RSA 120X120X15.0mm", kgPerPiece: 154.28 },
      { size: "RSA 150X150X10.0mm", kgPerPiece: 133.4 },
      { size: "RSA 150X150X12.0mm", kgPerPiece: 158.34 },
      { size: "RSA 150X150X15.0mm", kgPerPiece: 196.04 },
      { size: "RSA 150X150X18.0mm", kgPerPiece: 232.58 },
      { size: "RSA 200X200X16.0mm", kgPerPiece: 281.3 },
      { size: "RSA 200X200X18.0mm", kgPerPiece: 314.36 },
      { size: "RSA 200X200X20.0mm", kgPerPiece: 347.42 },
      { size: "RSA 200X200X24.0mm", kgPerPiece: 412.38 },
      { size: "RSA 250X250X25.0mm", kgPerPiece: 542.88 },
      { size: "RSA 250X250X28.0mm", kgPerPiece: 603.2 },
      { size: "RSA 250X250X32.0mm", kgPerPiece: 684.4 },
      { size: "RSA 250X250X35.0mm", kgPerPiece: 742.4 },
      { size: "75X50X6 RSA", kgPerPiece: 32.77 },
      { size: "75X50X8 RSA", kgPerPiece: 42.86 },
      { size: "80X60X6 RSA", kgPerPiece: 36.95 },
      { size: "80X60X7 RSA", kgPerPiece: 42.69 },
      { size: "80X60X8 RSA", kgPerPiece: 48.37 },
      { size: "100X65X7 RSA", kgPerPiece: 50.87 },
      { size: "100X65X8 RSA", kgPerPiece: 57.65 },
      { size: "100X65X10 RSA", kgPerPiece: 71.34 },
      { size: "100X75X8 RSA", kgPerPiece: 61.48 },
      { size: "100X75X10 RSA", kgPerPiece: 75.4 },
      { size: "100X75X12 RSA", kgPerPiece: 89.32 },
      { size: "125X75X8 RSA", kgPerPiece: 70.76 },
      { size: "125X75X10 RSA", kgPerPiece: 87.0 },
      { size: "125X75X12 RSA", kgPerPiece: 103.24 },
      { size: "150X75X10 RSA", kgPerPiece: 98.6 },
      { size: "150X75X12 RSA", kgPerPiece: 117.16 },
      { size: "150X75X15 RSA", kgPerPiece: 143.84 },
      { size: "150X90X10 RSA", kgPerPiece: 105.56 },
      { size: "150X90X12 RSA", kgPerPiece: 125.28 },
      { size: "150X90X15 RSA", kgPerPiece: 154.28 },
      { size: "200X100X10 RSA", kgPerPiece: 133.4 },
      { size: "200X100X12 RSA", kgPerPiece: 158.34 },
      { size: "200X100X15 RSA", kgPerPiece: 195.46 },
      { size: "200X150X12 RSA", kgPerPiece: 185.6 },
      { size: "200X150X15 RSA", kgPerPiece: 229.68 },
      { size: "200X150X18 RSA", kgPerPiece: 273.18 },
    ],
  };

  const material = materialData[name].find((item) => item.size === size);

  if (material) {
    return {
      steelSize: size,
      steelPieces:
        unit === "Kgs"
          ? Math.ceil(Number(weight) / material.kgPerPiece)
          : Math.ceil(Number(weight) / material.kgPerPiece / 6),
    };
  } else {
    throw new Error(`Material ${material} with size ${size} not found.`);
  }
}

module.exports = {
  calculateConcreteGivenClass,
  calculateBRC,
  calculateRebar,
  calculateBlocks,
  calculateBricks,
  calculateAntiTermite,
  calculateMurram,
  calculateHardcore,
  calculateSandBlinding,
  calculateDampProofMembrane,
  calculateDampProofCourse,
  calculateSteel,
};

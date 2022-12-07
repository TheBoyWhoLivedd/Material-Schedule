let PI = 3.14159265359;
let RIGHT_ANGLE = 90.0;
let CUBIC_INCHES_PER_CUBIC_FOOT = 1728.0;
let ONE_FOOT = 12.0;
const CUBIC_FEET_PER_CUBIC_YARD = 27;
let PERCENTAGE_ADDED = 1.1; //Add 10%
const GRAVEL_POUND_PER_CUBIC_FOOT = 105;
const POUNDS_IN_A_TON = 2000;
const CMU_HEIGHT = 8; //in inches
const CMU_LENGTH = 16; //in inches
let MORTAR_PER_BLOCK_6 = 0.08;
let MORTAR_PER_BLOCK_8 = 0.09; //Estimate of 80# bags of mortar needed per block.
let MORTAR_PER_BLOCK_12 = 0.12;
let CUBIC_YARDS_PER_BLOCK_6 = 0.010111;
let CUBIC_YARDS_PER_BLOCK_8 = 0.010534; //Estimate of cubic yards of concrete needed to fill a block.
let CUBIC_YARDS_PER_BLOCK_12 = 0.014389;
let EXCAVATED_CLAY_VOLUME = 1.3; //this represents the excavated volume compared to compacted volume of the soil
let GRAVEL_TONS_PER_CUBIC_YARD = 1.4;
let CONCRETE_SAND_TONS_PER_CUBIC_YARD = 1.3;
let MASONRY_SAND_TONS_PER_CUBIC_YARD = 1.2;
let BASE_TONS_PER_CUBIC_YARD = 1.5;
const CONCRETE_POUNDS_PER_CUBIC_FOOT = 150;

 function calculateConcreteGivenClass(concreteClass, cum) {
  if (concreteClass === "C25") {
    let cementKgs = Number(cum) * 6.25;
    let numCementBags = Number(cum) * 8.3;
    let sandWeight = Number(cementKgs) * 1.5 * 50;
    let aggregateWeight = Number(cementKgs) * 3 * 50;
    return {
      cementBags: numCementBags,
      amountofSand: sandWeight,
      amountofAggregates: aggregateWeight,
    };
  } else if (concreteClass === "C20") {
    let cementKgs = Number(cum) * 6.25;
    let sandWeight = Number(cementKgs) * 1.5 * 50;
    let aggregateWeight = Number(cementKgs) * 3 * 50;
    let numCementBags = Number(cementKgs) / 50;
    return {
      cementBags: numCementBags,
      amountofSand: sandWeight,
      amountofAggregates: aggregateWeight,
    };
  } else if (concreteClass === "C30") {
    let cementKgs = Number(cum) * 10.25;
    let sandWeight = Number(cementKgs) * 1.5 * 50;
    let aggregateWeight = Number(cementKgs) * 3 * 50;
    let numCementBags = Number(cementKgs) / 50;
    return {
      cementBags: numCementBags,
      amountofSand: sandWeight,
      amountofAggregates: aggregateWeight,
    };
  } else if (concreteClass === "C40") {
    let cementKgs = Number(cum) * 12.43;
    let sandWeight = Number(cementKgs) * 1.5 * 50;
    let aggregateWeight = Number(cementKgs) * 3 * 50;
    let numCementBags = Number(cementKgs) / 50;
    return {
      cementBags: numCementBags,
      amountofSand: sandWeight,
      amountofAggregates: aggregateWeight,
    };
  }
}

function concreteSlabCubicYards(totalSquarefeet, thickness) {
  //Calculate cubic yards
  return (totalSquarefeet * (thickness / ONE_FOOT)) / CUBIC_FEET_PER_CUBIC_YARD;
}

function concretePrice(priceOfConcrete, cubicYards) {
  return priceOfConcrete * cubicYards;
}

/*
 * @param: cubicYards represents the total amount of concrete needed.
 * return: The number of 80# bags of concrete mix needed given the cubicYards amount.
 */
function calculate80PoundBags(cubicYards) {
  //Standard estimate of cubic feet in a 80# bag of concrete mix
  let cubicFeetPerBag = 0.6;

  return int(
    Math.ceil((cubicYards * CUBIC_FEET_PER_CUBIC_YARD) / cubicFeetPerBag)
  );
}

/*
 * @param: cubicYards represents the total amount of concrete needed.
 * return: The number of 60# bags of concrete mix needed given the cubicYards amount.
 */
function calculate60PoundBags(cubicYards) {
  //Standard estimate of cubic feet in a 60# bag of concrete mix
  let cubicFeetPerBag = 0.45;

  return Number(
    Math.ceil(cubicYards * CUBIC_FEET_PER_CUBIC_YARD) / cubicFeetPerBag
  );
}

/*
 * @param: cubicYards represents the total amount of concrete needed.
 * return: The number of 40# bags of concrete mix needed given the cubicYards amount.
 */
function calculate40PoundBags(cubicYards) {
  //Double the 80# bag calculation
  return calculate80PoundBags(cubicYards) * 2;
}

/*
 * @param: totalSquareFeet represents the area that needs rebar
 * @param: spacing represents how close the rebar should be spaced.
 * 	spacing is in inches.
 * return: the total linear length of rebar (in feet) needed to fill the area with 10% added.
 */
function calculateRebar(totalSquareFeet, spacing) {
  //Convert spacing to feet
  spacing = spacing / ONE_FOOT;

  //Calculate the side length of a square whose area is equal to the size of totalSquareFeet.
  let areaSideLength = Math.ceil(Math.sqrt(totalSquareFeet));

  //Return the rebar needed with 10% added
  return int(
    Math.ceil(areaSideLength * (areaSideLength / spacing + 1)) *
      2 *
      PERCENTAGE_ADDED
  );
}

/*
 * @param: height represents the height of the wall in feet
 * @param: lenght represents the length of the wall in feet
 * @param: rebarSpacingVertical represents the vertical spacing of rebar in inches
 * @param: rebarSpacingHorizontal represents the horizontal spacing of rebar in inches
 *
 * return: the total linear length of rebar (in feet) needed for the wall with 10% added
 *
 */
function calculateWallRebar(
  height,
  length,
  rebarSpacingVertical,
  rebarSpacingHorizontal
) {
  let totalRebarLength = 0;

  //convert rebar spacings to feet
  let verticalSpacing = rebarSpacingVertical / ONE_FOOT;
  let horizontalSpacing = rebarSpacingHorizontal / ONE_FOOT;

  //Make sure I don't divide by zero
  if (verticalSpacing > 0) {
    //Calculate the linear feet needed for vertical rebar
    totalRebarLength = int(Math.ceil(length / verticalSpacing) * height);
  }

  if (horizontalSpacing > 0) {
    //Calculate the linear feet needed for the horizontal rebar and add it to totalRebarLength
    totalRebarLength += int(Math.ceil(height / horizontalSpacing) * length);
  }

  return int(totalRebarLength * PERCENTAGE_ADDED); //Add 10%
}

/*
 * returns the total linear length of rebar (in feet) needed for the footing with 10% added
 *
 * @param: width is in inches
 * @param: length is in feet
 * @param: numOfLengthwiseRebar is how many rebars are running lengthwise in the footing
 * @param: perpendicularSpacing is the spacing in inches.
 */
function calculateFootingRebar(
  width,
  length,
  numOfLengthwiseRebars,
  perpendicularSpacing
) {
  let totalRebarLength = Number(length * numOfLengthwiseRebars);

  if (perpendicularSpacing == 0)
    return int(totalRebarLength * PERCENTAGE_ADDED);

  //subtract for inset (3" in each side), and convert to feet
  width = (width - 6) / ONE_FOOT;

  //convert to feet
  let barSpacing = perpendicularSpacing / ONE_FOOT;
  let numOfPerpendicularRebars = int(length / barSpacing + 1);

  return int(
    (numOfPerpendicularRebars * width + totalRebarLength) * PERCENTAGE_ADDED
  );
}

/*
 * @param: totalSquareFeet refers to the area that needs covered with gravel
 * @param: depth refers to the depth in inches.
 *
 * return: The total tons of gravel needed
 */
function calculateGravel(totalSquareFeet, depth) {
  //Convert depth to feet
  depth = depth / ONE_FOOT;

  return (
    (totalSquareFeet * depth * GRAVEL_POUND_PER_CUBIC_FOOT) / POUNDS_IN_A_TON
  );
}

/*
 * @param: height of the column in feet.
 * @param: diameter of the column. It is in inches.
 *
 * return: cubic yards of concrete needed for this column
 */
function calculateColumnCubicYards(heigth, diameter) {
  //Convert diameter to feet and get a radius for the column
  let radius = diameter / ONE_FOOT / 2.0;

  //Formula for column is ( PI * r^2 * H )
  return (PI * Math.pow(radius, 2) * heigth) / CUBIC_FEET_PER_CUBIC_YARD;
}

/*
 * The rebar for a column is calculated with "n" number of vertical rebars in the column, and a
 * 	horizontal rebar tied every so often up along the vertical bars. Each horizontal rebar form a circle
 * 	around the vertical ones.
 *
 * @param: height of the column in feet
 * @param: diameter of the column in inches.
 * @param: numberOfVerticalBars refer to vertical rebars in the column
 * @param: horizontalSpacing refers to the spacing between the horizontal rebars. For example,
 * 		you could tie a horizontal rebar around the vertical rebars every 6 inches going up in the column.
 *
 * Returns the linear feet of rebar needed for a column as an integer.
 */
function calculateRebarForColumn(
  height,
  diameter,
  numberOfVerticalBars,
  horizontalSpacing
) {
  //calculate the vertical rebars needed
  let totalRebarLenght = height * numberOfVerticalBars;

  //Calculate the circumference of the column diameter - 4".
  //I subtract 4" to adjust for the space there needs to be between the rebar and the column perimeter
  let r = (diameter - 4) / 2.0;
  let circumferenceInFeet = (2 * PI * r) / ONE_FOOT;
  let numberOfHorinzontalBars = 0;
  //Make sure I don't divide by 0
  if (horizontalSpacing > 0) {
    numberOfHorinzontalBars = Number(
      Math.ceil(height * ONE_FOOT) / horizontalSpacing
    );
  }

  return int(
    (numberOfHorinzontalBars * circumferenceInFeet + totalRebarLenght) *
      PERCENTAGE_ADDED
  );
}

/*
 * In these calculations I have divide the steps up in a top area, and a bottom area.
 * The top area is just the top triangle area of each thread. As taking the (rise * run / 2).
 * Anything below that I have treated as just a regular concrete slab area,
 * with each end ending in another triangle area.
 *
 * Except numSteps, All parameters are in inches
 * @param: width is the width of the steps.
 * @param: rise is the height of each individual step
 * @param: run is the "depth" of each individual step
 * @param: depth is the height from the 'inside corner' of an individual step down to the bottom of the concrete
 * @param: numSteps is the total number of steps.
 *
 * Returns the cubic yards of concrete needed for the steps.
 *
 * it's helpful to have a picture of the sloping steps handy.
 */
function calculateStepsSlopeCubicYards(width, rise, run, depth, numSteps) {
  let totalCubicInches = 0;
  //Prevent divide by 0
  if (run == 0 || rise == 0) return 0;

  let angleA = Math.toDegrees(Math.atan(rise / run));
  let angleB = RIGHT_ANGLE - angleA;
  let topTriangleAreaInCubicInches = ((rise * run * numSteps) / 2) * width; //cubic inches of step top triangle are

  //Find the top length of the bottom area.
  let topLengthOfBottomArea =
    Math.sqrt(Math.pow(rise, 2) + Math.pow(run, 2)) * numSteps; //Find hypotenuse of each step and multiply it with the number of steps.
  let l = depth / Math.sin(Math.toRadians(angleA)); //Find the length of the bottom area lower triangle
  let h = depth / Math.sin(Math.toRadians(angleB)); //Find the height of the bottom area lower triangle
  let r = Math.sqrt(Math.pow(l, 2) + Math.pow(h, 2)); //r = the hypotenuse of the lower triangle.
  let remainingLengthOfBottomArea = topLengthOfBottomArea - r;
  let bottomAreaInCubicInches = remainingLengthOfBottomArea * depth * width;
  let bottomAreaLowerTriangleInCubicInhes = ((h * l) / 2) * width;

  totalCubicInches =
    topTriangleAreaInCubicInches +
    bottomAreaInCubicInches +
    bottomAreaLowerTriangleInCubicInhes;

  return (
    totalCubicInches / (CUBIC_INCHES_PER_CUBIC_FOOT * CUBIC_FEET_PER_CUBIC_YARD)
  );
}

/*
 * Except numSteps, All parameters are in inches
 * @param: platformLength is the distance from the front of the top step to the back of the concrete
 * @param: width is the width of the steps.
 * @param: rise is the height of each individual step
 * @param: run is the "depth" of each individual step
 * @param: numSteps is the total number of steps.
 *
 * Returns the cubic yards of concrete needed for the steps.
 */
function calculateStepsPlatformCubicYards(
  platformLength,
  run,
  width,
  numSteps
) {
  let totalCubicInches = 0;
  if (run == 0 || rise == 0) return 0;

  numSteps -= 1; //Subtract 1 in order not to calculate the platform

  let stepsArea = rise * run * ((numSteps * (numSteps + 1)) / 2) * width;
  let platformArea = rise * (numSteps + 1) * platformLength * width;

  totalCubicInches = stepsArea + platformArea;

  return (
    totalCubicInches / (CUBIC_INCHES_PER_CUBIC_FOOT * CUBIC_FEET_PER_CUBIC_YARD)
  );
}

/*
 * @param: height is measured in inches
 * @param: length is measured in inches.
 *
 * Returns the number of 8x8x16 inch blocks needed for a wall
 */
function calculateBlocks(height, length) {
  let verticalBlocks = height / CMU_HEIGHT;
  let lengthBlocks = length / CMU_LENGTH;

  return Number(Math.ceil(verticalBlocks * lengthBlocks * 1.05)); //5% added
}

/*
 * @param: blocks is the amount of 8x8x16 inch blocks in the wall.
 * @param: size refers to the width of the blocks. ( 6x8x16, 8x8x16, or 12x8x16 ).
 *
 * Return the number of 80# bags of mortar mix needed for the blocks.
 */
function calculateMortarForBlocks(blocks, size) {
  let mortarBagsNeeded = 0;
  switch (size) {
    case 6:
      mortarBagsNeeded = Number(
        Math.ceil(MORTAR_PER_BLOCK_6 * blocks * PERCENTAGE_ADDED)
      );
      break; //10% added
    case 8:
      mortarBagsNeeded = Number(
        Math.ceil(MORTAR_PER_BLOCK_8 * blocks * PERCENTAGE_ADDED)
      );
      break;
    case 12:
      mortarBagsNeeded = Number(
        Math.ceil(MORTAR_PER_BLOCK_12 * blocks * PERCENTAGE_ADDED)
      );
      break;
    default:
      mortarBagsNeeded = Number(
        Math.ceil(MORTAR_PER_BLOCK_8 * blocks * PERCENTAGE_ADDED)
      );
      break;
  }

  return mortarBagsNeeded;
}

/*
 * @param: blocks is the amount of 8x8x16 inch blocks in the wall.
 * @param: size refers to the width of the blocks. ( 6x8x16, 8x8x16, or 12x8x16 ).
 *
 * Return the cubic yards needed to fill the block wall with concrete.
 */
function calculateFillForBlocks(blocks, size) {
  let cubicYards = 0;

  switch (size) {
    //6, 8, and 12 refer to the width of a block
    case 6:
      cubicYards = CUBIC_YARDS_PER_BLOCK_6 * blocks;
      break;
    case 8:
      cubicYards = CUBIC_YARDS_PER_BLOCK_8 * blocks;
      break;
    case 12:
      cubicYards = CUBIC_YARDS_PER_BLOCK_12 * blocks;
      break;
    default:
      cubicYards = CUBIC_YARDS_PER_BLOCK_8 * blocks;
      break;
  }

  return cubicYards;
}

/*
 * returns the amount of calculated dirt in cubic yards.
 *  Accounts for the extra space dirt takes up when excavated compared to when it's compacted.
 *
 * @param: squarefeet is the total area to be excavated
 * @param: depth of the area to be excavated. it is in feet
 */
function calculateExcavatedDirt(squarefeet, depth) {
  let area = squarefeet * depth;
  return (area * EXCAVATED_CLAY_VOLUME) / CUBIC_FEET_PER_CUBIC_YARD;
}

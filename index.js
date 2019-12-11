const pullAt = require("lodash.pullat");

/**
 * Returns an array of periods with overlapping periods joined together
 * @param {Array<{start: Number, end: Number}>} periodsToJoin - Array of objects with start and end (timestamp)
 * @returns {Array<{start: Number, end: Number}>}
 */
function flattenPeriods(periodsToJoin) {
  validateInput(periodsToJoin);
  const joinedPeriods = [...periodsToJoin];
  let overlappingPeriods = hasOverlap(joinedPeriods);
  while (overlappingPeriods) {
    const [periodA, periodB] = pullAt(joinedPeriods, overlappingPeriods);
    joinedPeriods.push(joinPeriods(periodA, periodB));
    overlappingPeriods = hasOverlap(joinedPeriods);
  }
  return joinedPeriods.sort((a, b) => a.start - b.start);
}

function validateInput(input) {
  if (!Array.isArray(input)) {
    throw new Error("Input must be array");
  }
  input.forEach(({start, end}) => {
    if (start === undefined) {
      throw new Error("All elements must have a start");
    }
    if (end === undefined) {
      throw new Error("All elements must have an end");
    }
    if (!Number.isSafeInteger(start)) {
      throw new Error("All start values must be integers");
    }
    if (!Number.isSafeInteger(end)) {
      throw new Error("All end values must be integers");
    }
    if (start > end) {
      throw new Error("Start values must not be greater than end values");
    }
  });
}

function timePeriodsOverlap(periodA, periodB) {
  if (periodA.end > periodB.start && periodB.start >= periodA.start) {
    return true;
  }
  if (periodB.end > periodA.start && periodA.start >= periodB.start) {
    return true;
  }
  return false;
}

function joinPeriods(periodA, periodB) {
  const start = periodA.start > periodB.start ? periodB.start : periodA.start;
  const end = periodA.end > periodB.end ? periodA.end : periodB.end;
  return {start, end};
}

function hasOverlap(periods) {
  for (let i = 0; i < periods.length; i++) {
    for (let j = i + 1; j < periods.length; j++) {
      if (timePeriodsOverlap(periods[i], periods[j])) {
        return [i, j];
      }
    }
  }
  return false;
}

module.exports = flattenPeriods;

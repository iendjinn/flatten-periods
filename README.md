# flatten-periods
Utility function for de-duplicating period data that contains overlapping periods.

## Usage
```
const flattenPeriods = require("path/to/this/module");

const data = [{start: 5, end: 7}, {start: 6, end: 9}];
const flattenedPeriods = flattenPeriods(data);
console.log(flattenedPeriods); // [{start: 5, end: 9}]
```

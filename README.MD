## Visual testing lib to compare screenshots integrated with codecept


## how it works?
### get screenshot base of the page, when run again, get screenshot of the current state and compare.


1. `npm install visualreg-codeceptjs`

2. add the lib on the "codecept steps" (steps_file.js):
```
// in this file you can append custom step methods to 'I' object
const visualTest = require("@shelloliver/visualreg-codeceptjs")

module.exports = function () {
  return actor({
    visualTest
  })
```

3. use into the test

Example:

```
const { assert } = require('chai')

Scenario('test something', async (I) => {
    I.amOnPage('https://github.com/Codeception/VisualCeption');
    const output = await I.visualTest('someimage')
    assert.equal(output, true)
});

```


#### getting bugs??
open a issue or a PR :)
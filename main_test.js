const assert = require('assert');

Feature('phaser movement');

Scenario('test something', async (I) => {
    I.amOnPage('https://github.com/Codeception/VisualCeption');
    I.see('GitHub');
    I.compareScreenShot('zomeimage')
    assert.equal(output, 0)
});


// in this file you can append custom step methods to 'I' object
const fs = require('fs')
const PNG = require('pngjs').PNG
const pixelmatch = require('pixelmatch')
const path = require("path");

module.exports = function () {
  return actor({
    compareScreenShot(fileName) {
      const mainPath = `./output/visual-regression`
      const baseFilePath = `${mainPath}/base/${fileName}.png`
      if (!fs.existsSync(mainPath)) {
        fs.mkdir(`${mainPath}/base`, { recursive: true }, (err) => console.error(err));
        console.log('created new base folder')
      }

      if (!fs.existsSync(baseFilePath)) {
        this.saveScreenshot(baseFilePath)
        console.log(`saveScreenshot saved for ${baseFilePath}`)
      } else {
        !fs.existsSync(`${mainPath}/test`) && fs.mkdirSync(`${mainPath}/test`)
        const prefix = new Date().toISOString()
        const testFilePath = `${mainPath}/test/${prefix}_${fileName}.png`
        return this.saveScreenshot(testFilePath).then(img => {
          const imgOneResolved = fs.readFileSync(path.resolve(__dirname, baseFilePath));
          const imgTwoResolved = fs.readFileSync(path.resolve(__dirname, testFilePath));

          const imgOne = PNG.sync.read(imgOneResolved);
          const imgTwo = PNG.sync.read(imgTwoResolved);

          const { width, height } = imgOne;
          const diff = new PNG({ width, height });

          const numDiffPixels = pixelmatch(imgOne.data, imgTwo.data, diff.data, width, height, { threshold: 0.1 });
          const totalSize = width * height
          const percentageDiff = numDiffPixels * 100 / totalSize
          fs.writeFileSync('diff.png', PNG.sync.write(diff));
          return percentageDiff.toPrecision(4)

        })
      }
    }

  });
}

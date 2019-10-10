const pixelmatch = require('pixelmatch')
const path = require("path");
const fs = require('fs')
const PNG = require('pngjs').PNG

function getMainPath() {
    const package = require(path.resolve('package.json'))
    const settings = package['visualreg-codeceptjs']
    if (settings && settings.output)
        return settings.output
    return 'output'
}

const mainPath = getMainPath()

function compareImages(baseFilePath, testFilePath, threshold, fileImage) {
    const imgOneResolved = fs.readFileSync(path.resolve(baseFilePath));
    const imgTwoResolved = fs.readFileSync(path.resolve(testFilePath));
    const imgOne = PNG.sync.read(imgOneResolved);
    const imgTwo = PNG.sync.read(imgTwoResolved);
    const { width, height } = imgOne;
    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(imgOne.data, imgTwo.data, diff.data, width, height, { threshold });
    fs.writeFileSync(`${mainPath}/diff_${fileImage}`, PNG.sync.write(diff));
    return numDiffPixels === 0;
}

function compareScreenShot(fileName, threshold = 0.1) {
    const fileImage = `${fileName}.png`
    const baseFilePath = `${mainPath}/base/${fileImage}`


    if (!fs.existsSync(`${mainPath}/base`)) {
        fs.mkdir(`${mainPath}/base`, { recursive: true }, (err) => console.error(err));
        console.log('CREATED new base FOLDER')
    }

    if (!fs.existsSync(baseFilePath)) {
        this.saveScreenshot(baseFilePath)
        console.warn(`BASE IMAGE SAVED for ${baseFilePath}`)
        return true
    } else {
        !fs.existsSync(`${mainPath}/test`) && fs.mkdirSync(`${mainPath}/test`)
        const prefix = new Date().toISOString()
        const testFilePath = `${mainPath}/test/${prefix}_${fileImage}`
        return this.saveScreenshot(testFilePath).then(() =>
            compareImages(baseFilePath, testFilePath, threshold, fileImage)
        )
    }
}

module.exports = compareScreenShot
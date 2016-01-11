var react = require('react-tools');
var sourceMap = require('../../source-map-utility');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.filePath
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @param {function} options.callback
 */
function compile(options) {

    var reactOptions = {};

    if (options.sourceMap) {
        reactOptions.sourceMap = true;
        reactOptions.sourceFilename = sourceMap.getSourceFilePath(options.filePath, options.siteRoot);
    }

    var result = react.transform(options.code, reactOptions);

    options.callback(result);

}

module.exports = compile;
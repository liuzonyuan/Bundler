var babel = require('babel-core');
var path = require('path');
var Promise = require('bluebird');

/**
 * @param {string[]} presets
 * @param {object} options
 * @param {string} options.code
 * @param {string} options.inputPath
 * @param {string} options.nodeModulesPath
 * @param {boolean} options.sourceMap
 * @returns {{code: string, map: object}}
 */
function transform(presets, options) {

    var babelOptions = {
        presets: presets.map(function(preset) {
            return path.join(options.nodeModulesPath, preset);
        })
    };

    if (options.sourceMap) {
        babelOptions.sourceMaps = true;
        babelOptions.sourceFileName = options.inputPath;
    }

    var result = babel.transform(options.code, babelOptions);

    return {
        code: result.code,
        map: result.map
    };

}

module.exports = {
    transform: transform
};
var CleanCss = require('clean-css');
var Promise = require('bluebird');
var _ = require('underscore');
var path = require('path');

/**
 * @param {object} options
 * @param {string} options.code
 * @param {object} options.map
 * @param {string} options.inputPath
 * @param {boolean} options.sourceMap
 * @param {string} options.siteRoot
 * @returns {bluebird}
 */
function minify(options) {

    if (isAlreadyMinified(options.inputPath)) {
        return Promise.resolve(options);
    }

    return new Promise(function(resolve, reject) {

        try {

            var cleanerInput = {},
                cleaner;

            cleaner = new CleanCss({
                advanced: false,
                restructuring: false,
                rebase: false,
                sourceMap: options.sourceMap,
                root: options.siteRoot
            });

            cleanerInput[options.inputPath] = {
                styles: options.code
            };

            if (options.sourceMap && options.map) {
                cleanerInput[options.inputPath].sourceMap = getSourceMap(options);
            }

            cleaner.minify(cleanerInput, function (err, result) {

                if (err) {
                    reject(err);
                } else {
                    resolve({
                        code: result.styles,
                        map: result.sourceMap ? JSON.parse(result.sourceMap.toString()) : undefined
                    });
                }

            });

        } catch (err) {

            reject(err);

        }

    });

}

function isAlreadyMinified(filePath) {

    return /\.min\.css$/.test(filePath);

}

function getSourceMap(options) {

    var map = _.clone(options.map);

    map.sources = map.sources.map(function(source) {
        return path.relative(path.dirname(options.inputPath), path.join(options.siteRoot, source));
    });

    return JSON.stringify(map);

}

module.exports = minify;

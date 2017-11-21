'use strict';

/**
 * @constructor
 */
function DataFormatter() {
    /** Prevent usage without "new" operator. If it happens, "this" points to the global object. */
    if (this instanceof DataFormatter) {
        throw new Error('DataFormatter constructor called without "new" operator');
    }
}

/**
 * @param {string} data
 * @param {Function} callback
 */
DataFormatter.prototype.formatToCSV = function (data, callback) {
    let csv = '';
    for (let row of data) {
        csv += (row.join(',') + "\n");
    }

    callback(csv);
};

/**
 * @returns {DataFormatter}
 */
module.exports = function () {
    return new DataFormatter();
};

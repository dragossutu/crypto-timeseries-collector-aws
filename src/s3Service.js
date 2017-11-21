'use strict';

/**
 * @constructor
 */
function S3Service(awsSdk) {
    /** Prevent usage without "new" operator. If it happens, "this" points to the global object. */
    if (this instanceof S3Service) {
        throw new Error('S3Service constructor called without "new" operator');
    }

    /** {Object} */
    this.awsSdk = awsSdk
}

/**
 * @param {string} bucket
 * @param {string} filePrefix
 * @param {string} data
 * @param {Function} callback
 */
S3Service.prototype.saveToS3Bucket = function (bucket, filePrefix, data, callback) {
    const key = buildS3Key(filePrefix);
    const s3 = new this.awsSdk.S3();
    const params = {
        Body : data,
        Bucket : bucket,
        Key : key
    };

    s3.putObject(params, function(err, data) {
        if (err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

/**
 * @param {string} filePrefix
 * @returns {string}
 */
function buildS3Key(filePrefix) {
    const date = new Date();
    const keyParts = [];

    keyParts.push(filePrefix);
    keyParts.push(date.getUTCFullYear());
    keyParts.push(date.getUTCMonth());
    keyParts.push(date.getUTCDay());
    keyParts.push(date.getUTCHours());
    keyParts.push(date.getUTCMinutes());
    keyParts.push(date.getUTCSeconds());

    return keyParts.join('.');
}

/**
 * @param {Object} awsSdk
 * @returns {S3Service}
 */
module.exports = function (awsSdk) {
    return new S3Service(awsSdk);
};

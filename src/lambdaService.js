'use strict';

/**
 * @param {KrakenHttpClient} krakenHttpClient
 * @param {DataFormatter} dataFormatter
 * @param {S3Service} s3Service
 * @constructor
 */
function LambdaService(krakenHttpClient, dataFormatter, s3Service) {
    /** Prevent usage without "new" operator. If it happens, "this" points to the global object. */
    assert((this instanceof LambdaService), 'LambdaService constructor called without "new" operator');

    /** @type {KrakenHttpClient} */
    this.krakenHttpClient = krakenHttpClient;

    /** @type {DataFormatter} */
    this.dataFormatter = dataFormatter;

    /** @type {S3Service} */
    this.s3Service = s3Service;
}

/**
 * @param {string} pair
 * @param {string} bucket
 */
LambdaService.prototype.run = function (pair, bucket) {
    this.krakenHttpClient.fetchData(pair, function (err, data) {
        if (null !== err) {
            console.log(err);
            return;
        }

        this.dataFormatter.formatToCSV(data, function (csvData) {
            this.s3Service.saveToS3Bucket(bucket, pair, csvData, function (err, data) {
                if (null !== err) {
                    console.log(err);
                    return;
                }

                console.log(data);
            });
        })
    });
};

/**
 * @param {KrakenHttpClient} krakenHttpClient
 * @param {DataFormatter} dataFormatter
 * @param {S3Service} s3Service
 * @returns {LambdaService}
 */
module.exports = function (krakenHttpClient, dataFormatter, s3Service) {
    return new LambdaService(krakenHttpClient, dataFormatter, s3Service);
};
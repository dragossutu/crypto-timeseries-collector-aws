'use strict';

/**
 * @param {KrakenHttpClient} krakenHttpClient
 * @param {DataFormatter} dataFormatter
 * @param {S3Service} s3Service
 * @constructor
 */
function LambdaService(krakenHttpClient, dataFormatter, s3Service) {
    /** Prevent usage without "new" operator. If it happens, "this" points to the global object. */
    if (!(this instanceof LambdaService)) {
        throw new Error('LambdaService constructor called without "new" operator');
    }

    /** @type {KrakenHttpClient} */
    this.krakenHttpClient = krakenHttpClient;

    /** @type {DataFormatter} */
    this.dataFormatter = dataFormatter;

    /** @type {S3Service} */
    this.s3Service = s3Service;
}

/**
 * @param {string} url
 * @param {string} pair
 * @param {string} bucket
 */
LambdaService.prototype.run = function (url, pair, bucket) {
    const self = this;

    self.krakenHttpClient.fetchData(url, pair, (error, data) => {
        if (error) {
            return console.log(error);
        }

        self.dataFormatter.formatToCSV(data, (csvData) => {
            self.s3Service.saveToS3Bucket(bucket, pair, csvData, (error, data) => {
                if (error) {
                    return console.log(error);
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

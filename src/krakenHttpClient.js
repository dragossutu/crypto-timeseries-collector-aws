'use strict';

/**
 * @param {Object} https
 * @constructor
 */
function KrakenHttpClient(https) {
    /** Prevent usage without "new" operator. If it happens, "this" points to the global object. */
    if (this instanceof KrakenHttpClient) {
        throw new Error('KrakenHttpClient constructor called without "new" operator');
    }

    this.https = https;
}

const resultKeyNameMap = {
    'XBTEUR': 'XXBTZEUR',
};

/**
 * @param {string} pair
 * @param {Function} callback
 */
KrakenHttpClient.prototype.fetchData = function (pair, callback) {
    const options = {
        hostname: 'api.kraken.com',
        port: 443,
        path: '/0/public/OHLC?pair=' + pair + '&since=1510000000',
        method: 'GET'
    };

    this.https.request(options, (res) => {
        let responseDataString = '';

        res.on('data', (dataPart) => {
            responseDataString += dataPart;
        }).on('end', function () {
            const responseDataJson = JSON.parse(responseDataString);
            if (Array.isArray(responseDataJson.error) && responseDataJson.error.length > 0) {
                callback(responseDataJson.error);
            } else {
                const resultKeyName = resultKeyNameMap[pair];
                callback(null, responseDataJson.result[resultKeyName]);
            }
        });

    }).on('error', (err) => {
        callback(err);
    }).end();
};

/**
 * @param {Object} https
 * @returns {KrakenHttpClient}
 */
module.exports = function (https) {
    return new KrakenHttpClient(https);
};
